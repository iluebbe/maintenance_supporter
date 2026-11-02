/** Trigger section renderer (task detail).
 *
 * Owns the task semantics — which values the chart shows and what the
 * reference lines mean — and delegates the actual plotting to the
 * responsive <maintenance-trigger-chart> component:
 *
 * - threshold tasks plot the raw sensor with the danger zone shaded;
 * - counter tasks plot **progress since the last service** (cumulative,
 *   clamped at 0 — an odometer can never be negative) against the target,
 *   headed by a "8,507 / 15,000 km · 57 %" progress bar;
 * - everything else plots the raw series.
 */

import { html, nothing, svg } from "lit";
import { t, fireMoreInfo, formatDueDays } from "../styles";
import { fmtNum, fmtVal, px } from "./chart-utils";
import { dueDaysOf } from "./progress";
import { stampMs } from "../helpers/ha-time";
import { primaryTriggerEntity, ruleSensors, triggerEntityIds, triggerUnit, type RuleSensor } from "../helpers/trigger-entities";
import { betaUi } from "../helpers/beta-ui";
import { conditionText } from "../helpers/task-rules";
import "../components/trigger-chart";
import type { ChartPoint, ChartEvent } from "../components/trigger-chart";
import type { HomeAssistant, MaintenanceTask, TriggerConfig, StatisticsPoint } from "../types";

export interface SparklineContext {
  lang: string;
  /** The beta UI's sensor rows read the live states through it (HA's state
   *  formatting, the state badge, more-info). */
  hass?: HomeAssistant;
  detailStatsData: Map<string, StatisticsPoint[]>;
  hasStatsService: boolean;
  /** #141: entities whose series is recorder STATE HISTORY (no long-term
   *  statistics exist — binary sensors etc.). Changes the footnote and
   *  suppresses the trigger_current_value tail point (for a state_change
   *  trigger that is the change COUNTER, not the plotted state). */
  historyFallbackIds?: Set<string>;
  isCounterEntity: (tc: TriggerConfig) => boolean;
  rangeDays: number;
  setRangeDays: (days: number) => void;
  /** When true, drop statistical outliers (sensor glitches) from the chart. */
  hideOutliers: boolean;
  setHideOutliers: (hide: boolean) => void;
}

/** Drop outliers via the IQR fence (Tukey): keep points within
 *  [Q1 − 1.5·IQR, Q3 + 1.5·IQR]. Robust to a few wild glitch readings (a
 *  pressure sensor spiking to 100 while it normally sits at 1.5–3). No-ops on
 *  short series (< 4 points) where quartiles aren't meaningful. */
/** A binary HA state as the 0/1 level the history fallback plots, or null
 *  for states the fallback cannot express (then no trigger view is built). */
export function binaryLevel(state: string | null | undefined): 0 | 1 | null {
  const s = (state ?? "").trim().toLowerCase();
  if (s === "on" || s === "open" || s === "true") return 1;
  if (s === "off" || s === "closed" || s === "false") return 0;
  return null;
}

export interface StateChangeView {
  points: ChartPoint[];
  /** "alarm": single-shot latch (target 1 + a to-state) — 1 while the alert
   *  state is held, 0 otherwise. "count": change counter since the last
   *  service, stepped, honouring the hold filter. */
  mode: "alarm" | "count";
}

/** #141 (round 2): the recorder fallback plots the RAW entity state, but a
 *  state_change trigger is about transitions. A water-valve switch that is
 *  "on" all week with a few second-long "off" blips drew a flat 1 with the
 *  "Target changes: 1" line on the same axis — while the header said 0 / 1,
 *  because those blips never held for the #136 hold time. Re-express the
 *  step series in the trigger's own terms:
 *
 *  - latch (target_changes == 1 with a to-state): 1 = alert state HELD for
 *    the hold time, 0 = fine. Reads as "is the trigger active" — for a
 *    problem sensor (to-state on) this equals the raw line, for a switch
 *    watched for "off" it is the inverse the user expects.
 *  - counter (everything else): the cumulative number of matching, held
 *    transitions since the last service, anchored so the line ends at the
 *    trigger's live count (transitions before the recorder window are
 *    unknown but already in that count).
 *
 *  Returns null when the from/to states cannot be expressed as 0/1. */
export function stateChangeView(
  points: ChartPoint[],
  tc: { trigger_from_state?: string | null; trigger_to_state?: string | null; trigger_target_changes?: number; trigger_for_minutes?: number },
  opts: { since: number | null; current: number | null; now?: number },
): StateChangeView | null {
  if (points.length < 2) return null;
  const now = opts.now ?? Date.now();
  const holdMs = Math.max(0, tc.trigger_for_minutes ?? 0) * 60000;
  const fromLevel = tc.trigger_from_state ? binaryLevel(tc.trigger_from_state) : null;
  const toLevel = tc.trigger_to_state ? binaryLevel(tc.trigger_to_state) : null;
  if ((tc.trigger_from_state && fromLevel === null) || (tc.trigger_to_state && toLevel === null)) return null;

  // Collapse the doubled step points into held segments (start, level).
  const sorted = [...points].sort((a, b) => a.ts - b.ts);
  const segments: { start: number; level: number }[] = [];
  for (const p of sorted) {
    const last = segments[segments.length - 1];
    if (!last || last.level !== p.val) segments.push({ start: p.ts, level: p.val });
  }
  const held = (i: number) => {
    const end = i + 1 < segments.length ? segments[i + 1].start : now;
    return end - segments[i].start >= holdMs;
  };
  const step = (out: ChartPoint[], ts: number, val: number) => {
    const last = out[out.length - 1];
    if (last && last.val !== val) out.push({ ts, val: last.val });
    out.push({ ts, val });
  };

  const latch = (tc.trigger_target_changes ?? 1) === 1 && toLevel !== null;
  if (latch) {
    const out: ChartPoint[] = [];
    segments.forEach((seg, i) => step(out, seg.start, seg.level === toLevel && held(i) ? 1 : 0));
    const lastVal = out[out.length - 1]?.val ?? 0;
    out.push({ ts: now, val: lastVal });
    return { points: out, mode: "alarm" };
  }

  const since = opts.since ?? segments[0].start;
  let counted = 0;
  const stepsAt: number[] = [];
  for (let i = 1; i < segments.length; i++) {
    const prev = segments[i - 1], seg = segments[i];
    if (fromLevel !== null && prev.level !== fromLevel) continue;
    if (toLevel !== null && seg.level !== toLevel) continue;
    if (!held(i) || seg.start < since) continue;
    counted += 1;
    stepsAt.push(seg.start);
  }
  const base = Math.max(0, (opts.current ?? counted) - counted);
  const out: ChartPoint[] = [{ ts: Math.max(since, segments[0].start), val: base }];
  let val = base;
  for (const ts of stepsAt) {
    val += 1;
    step(out, ts, val);
  }
  out.push({ ts: now, val });
  return { points: out, mode: "count" };
}

export function filterOutliers(points: ChartPoint[]): ChartPoint[] {
  if (points.length < 4) return points;
  const vals = points.map((p) => p.val).sort((a, b) => a - b);
  const q = (frac: number) => {
    const idx = (vals.length - 1) * frac;
    const lo = Math.floor(idx), hi = Math.ceil(idx);
    return vals[lo] + (vals[hi] - vals[lo]) * (idx - lo);
  };
  const q1 = q(0.25), q3 = q(0.75), iqr = q3 - q1;
  if (iqr === 0) return points; // flat/degenerate — nothing to trim
  const lower = q1 - 1.5 * iqr, upper = q3 + 1.5 * iqr;
  const kept = points.filter((p) => p.val >= lower && p.val <= upper);
  return kept.length >= 2 ? kept : points; // never strip below a drawable series
}

export function renderTriggerSection(task: MaintenanceTask, ctx: SparklineContext) {
  const tc = task.trigger_config;
  if (!tc) return nothing;
  if (betaUi()) return renderSensorRule(task, ctx);
  const L = ctx.lang;
  const info = task.trigger_entity_info;
  const infos = task.trigger_entity_infos;
  const entityId = primaryTriggerEntity(tc) || "";
  const friendlyName = info?.friendly_name || entityId || "—";
  const entityIds = triggerEntityIds(tc);
  const unit = info?.unit_of_measurement || "";
  const currentVal = task.trigger_current_value;
  const triggerType = tc.type || "threshold";
  const isMultiEntity = entityIds.length > 1;
  const spec = progressSpec(task, unit, ctx);

  return html`
    <h3>${t("trigger", L)}</h3>
    <div class="trigger-card">
      <div class="trigger-header">
        <ha-icon icon="mdi:pulse" style="color: var(--primary-color); --mdc-icon-size: 20px;"></ha-icon>
        <div>
          ${isMultiEntity ? html`
            <div class="trigger-entity-name">${entityIds.length} ${t("entities", L)} (${tc.entity_logic || "any"})</div>
            <div class="trigger-entity-id">${entityIds.map((eid, i) => html`${i > 0 ? ", " : ""}<span class="entity-link" @click=${(ev: Event) => fireMoreInfo(ev, eid)}>${eid}</span>`)}${tc.attribute ? ` → ${tc.attribute}` : ""}</div>
          ` : html`
            <div class="trigger-entity-name">${friendlyName}</div>
            <div class="trigger-entity-id">${entityId ? html`<span class="entity-link" @click=${(ev: Event) => fireMoreInfo(ev, entityId)}>${entityId}</span>` : ""}${tc.attribute ? ` → ${tc.attribute}` : ""}</div>
          `}
        </div>
        <span class="status-badge ${task.trigger_active ? "triggered" : "ok"}" style="margin-left: auto;">
          ${task.trigger_active ? t("triggered", L) : t("ok", L)}
        </span>
      </div>

      ${spec
        ? renderProgress(spec, L)
        : currentVal !== null && currentVal !== undefined
          ? html`
              <div class="trigger-value-row">
                <span class="trigger-current ${task.trigger_active ? "active" : ""}">${triggerType === "due_date" && typeof currentVal === "number" ? formatDueDays(dueDaysOf(currentVal), L) : typeof currentVal === "number" ? fmtVal(currentVal, "", L) : currentVal}</span>
                ${unit ? html`<span class="trigger-unit">${unit}</span>` : nothing}
              </div>
            `
          : nothing}

      <div class="trigger-limits">
        ${triggerType === "threshold" ? html`
          ${tc.trigger_above != null ? html`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${t("threshold_above", L)}: ${tc.trigger_above} ${unit}</span>` : nothing}
          ${tc.trigger_below != null ? html`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${t("threshold_below", L)}: ${tc.trigger_below} ${unit}</span>` : nothing}
          ${tc.trigger_equals != null ? html`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> = ${tc.trigger_equals} ${unit}</span>` : nothing}
          ${tc.trigger_not_equals != null ? html`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ≠ ${tc.trigger_not_equals} ${unit}</span>` : nothing}
          ${tc.trigger_for_minutes ? html`<span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${t("for_minutes", L)}: ${tc.trigger_for_minutes}</span>` : nothing}
        ` : nothing}
        ${triggerType === "state_change" ? html`
          ${tc.trigger_target_changes != null ? html`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${t("target_changes", L)}: ${tc.trigger_target_changes}</span>` : nothing}
        ` : nothing}
        ${triggerType === "runtime" ? html`
          ${tc.trigger_runtime_hours != null ? html`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${t("runtime_hours", L)}: ${tc.trigger_runtime_hours}h</span>` : nothing}
        ` : nothing}
        ${triggerType === "due_date" ? html`
          <span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${t("days_before", L)}: ${tc.trigger_days_before ?? 0}</span>
        ` : nothing}
        ${triggerType === "compound" ? html`
          <span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${t("compound_logic", L)}: ${tc.compound_logic || (tc as any).operator || "AND"}</span>
          ${(tc.conditions || []).map((cond: any, i: number) => html`
            <span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${i + 1}. ${t(cond.type === "due_date" ? "trigger_type_due_date" : cond.type || "unknown", L)}: ${triggerEntityIds(cond).map((eid, j) => html`${j > 0 ? ", " : ""}<span class="entity-link" @click=${(ev: Event) => fireMoreInfo(ev, eid)}>${eid}</span>`)}</span>
          `)}
        ` : nothing}
      </div>

      ${infos && infos.length > 1 ? html`
        <div class="trigger-entity-list">
          ${infos.map(info => html`
            <span class="trigger-entity-id">${info.friendly_name} (<span class="entity-link" @click=${(ev: Event) => fireMoreInfo(ev, info.entity_id)}>${info.entity_id}</span>)</span>
          `)}
        </div>
      ` : nothing}

      ${renderChart(task, unit, ctx)}
    </div>
  `;
}

// The rule's sensors live with the other trigger readers (the trace asks
// for them as well); the panel and the tests import them from here.
export { ruleSensors };

/** Home Assistant's own way into a sensor's past: its history page. */
function openHistory(ev: Event, entityIds: string[]): void {
  ev.preventDefault();
  history.pushState(null, "", `/history?entity_id=${entityIds.map(encodeURIComponent).join(",")}`);
  window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: false } }));
}

const TREND_W = 88;
const TREND_H = 28;
const TREND_POINTS = 48;

/** A sensor's recent course as a small line, like the trend graph a Home
 *  Assistant tile can show: the statistics the page loaded for it, thinned
 *  to a few dozen points, the condition's limit dashed across when it lies
 *  near the line (the scale takes it in), the line red once its last value
 *  is past the limit. Nothing without two points (a text sensor has no
 *  statistics). */
export function renderSensorTrend(stats: StatisticsPoint[] | undefined, cond: TriggerConfig, live: number | null = null) {
  if (!stats || stats.length < 2) return nothing;
  // The statistics end at the last full hour; the line ends where the state
  // next to it stands, and "past the limit" is judged on that.
  const points = live !== null && Number.isFinite(live) && stats[stats.length - 1].ts < Date.now()
    ? [...stats, { ts: Date.now(), val: live }]
    : stats;
  const step = Math.max(1, Math.ceil(points.length / TREND_POINTS));
  const thin: StatisticsPoint[] = [];
  for (let i = 0; i < points.length; i += step) thin.push(points[i]);
  if (thin[thin.length - 1] !== points[points.length - 1]) thin.push(points[points.length - 1]);
  const limits = (cond.type || "threshold") === "threshold"
    ? [cond.trigger_above, cond.trigger_below].filter((v): v is number => typeof v === "number")
    : [];
  const vals = thin.map((p) => p.val);
  let lo = Math.min(...vals);
  let hi = Math.max(...vals);
  const span0 = hi - lo || Math.abs(hi) || 1;
  // A limit far off the line would flatten it; within two spans it is drawn.
  const shown = limits.filter((l) => l >= lo - 2 * span0 && l <= hi + 2 * span0);
  for (const l of shown) { lo = Math.min(lo, l); hi = Math.max(hi, l); }
  const span = hi - lo || 1;
  const t0 = thin[0].ts;
  const t1 = thin[thin.length - 1].ts;
  const x = (ts: number) => (t1 === t0 ? 0 : ((ts - t0) / (t1 - t0)) * (TREND_W - 2) + 1);
  const y = (v: number) => TREND_H - 2 - ((v - lo) / span) * (TREND_H - 4);
  const line = thin.map((p, i) => `${i ? "L" : "M"}${px(x(p.ts))},${px(y(p.val))}`).join(" ");
  const last = thin[thin.length - 1].val;
  const past = (cond.trigger_above != null && last > cond.trigger_above) || (cond.trigger_below != null && last < cond.trigger_below);
  return html`<svg class="sensor-trend ${past ? "past" : ""}" viewBox="0 0 ${TREND_W} ${TREND_H}" width=${TREND_W} height=${TREND_H}
    preserveAspectRatio="none" aria-hidden="true">
    ${shown.map((l) => svg`<line class="sensor-trend-limit" x1="0" x2=${TREND_W} y1=${px(y(l))} y2=${px(y(l))}></line>`)}
    <path class="sensor-trend-area" d=${`${line} L${px(x(t1))},${TREND_H} L${px(x(t0))},${TREND_H} Z`}></path>
    <path class="sensor-trend-line" d=${line}></path>
  </svg>`;
}

/** A sensor as Home Assistant's entities card shows one: its state badge,
 *  its name with the rule's condition below, its state as HA formats it.
 *  A tap opens HA's more-info, as everywhere in HA. No entity ids — those
 *  belong to the settings, not to a task page. */
function renderSensorRow(s: RuleSensor, ctx: SparklineContext, task: MaintenanceTask) {
  const L = ctx.lang;
  const hass = ctx.hass;
  const so = hass?.states?.[s.entityId];
  const info = (task.trigger_entity_infos || []).find((i) => i.entity_id === s.entityId)
    ?? (task.trigger_entity_info?.entity_id === s.entityId ? task.trigger_entity_info : undefined);
  const unit = (so?.attributes?.unit_of_measurement as string | undefined) ?? info?.unit_of_measurement ?? "";
  const name = (so?.attributes?.friendly_name as string | undefined) || info?.friendly_name || s.entityId;
  const h = hass as (HomeAssistant & {
    formatEntityState?: (so: unknown) => string;
    formatEntityAttributeValue?: (so: unknown, attr: string) => string;
  }) | undefined;
  let state = "—";
  if (so) {
    if (s.cond.attribute) {
      state = h?.formatEntityAttributeValue?.(so, s.cond.attribute) ?? String(so.attributes?.[s.cond.attribute] ?? "—");
    } else {
      state = h?.formatEntityState?.(so) ?? `${so.state}${unit ? ` ${unit}` : ""}`;
    }
  }
  const open = (ev: Event) => fireMoreInfo(ev, s.entityId);
  return html`
    <div class="sensor-row" role="button" tabindex="0" data-entity=${s.entityId} title=${name}
      @click=${open}
      @keydown=${(ev: KeyboardEvent) => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); open(ev); } }}>
      ${so && customElements.get("state-badge")
        ? html`<state-badge class="sensor-badge" .hass=${hass} .stateObj=${so} stateColor></state-badge>`
        : html`<ha-icon class="sensor-badge" icon=${(so?.attributes?.icon as string | undefined) || "mdi:eye"}></ha-icon>`}
      <div class="sensor-info">
        <div class="sensor-name">${name}</div>
        <div class="sensor-cond">${conditionText(s.cond, unit, L)}</div>
      </div>
      ${renderSensorTrend(ctx.detailStatsData.get(s.entityId), s.cond, so ? parseFloat(String(s.cond.attribute ? so.attributes?.[s.cond.attribute] : so.state)) : null)}
      <div class="sensor-state">${state}</div>
    </div>
  `;
}

/** The beta UI's trigger section: the sensor rule as a Home Assistant card
 *  — its title and state, one entities-card row per sensor (the condition
 *  under the name, HA's formatted state on the right, a tap for more-info),
 *  the progress where the rule counts, the chart, and "Show more" into HA's
 *  history of the rule's sensors, like the more-info dialog's. */
function renderSensorRule(task: MaintenanceTask, ctx: SparklineContext) {
  const tc = task.trigger_config!;
  const L = ctx.lang;
  const sensors = ruleSensors(tc);
  const ids = [...new Set(sensors.map((s) => s.entityId))];
  const unit = triggerUnit(ctx.hass, task);
  const spec = progressSpec(task, unit, ctx);
  const many = tc.type === "compound" ? (tc.conditions || []).length : ids.length;
  const all = tc.type === "compound" ? (tc.compound_logic || "AND") === "AND" : tc.entity_logic === "all";
  const subtitle = many > 1 ? t(all ? "beta_rules_all_of" : "beta_rules_any_of", L).split("{n}").join(String(many)) : "";
  return html`
    <div class="trigger-card sensor-rule">
      <div class="sensor-rule-head">
        <div class="sensor-rule-title">
          <span>${t("beta_sensor_rule", L)}</span>
          ${subtitle ? html`<span class="sensor-rule-sub">${subtitle}</span>` : nothing}
        </div>
        <span class="status-badge ${task.trigger_active ? "triggered" : "ok"}">
          ${task.trigger_active ? t("triggered", L) : t("ok", L)}
        </span>
      </div>
      <div class="sensor-rows">${sensors.map((s) => renderSensorRow(s, ctx, task))}</div>
      ${spec ? renderProgress(spec, L) : nothing}
      ${renderChart(task, unit, ctx)}
      ${ids.length
        ? html`<div class="sensor-rule-foot">
            <a class="sensor-rule-more" href=${`/history?entity_id=${ids.map(encodeURIComponent).join(",")}`}
              @click=${(ev: Event) => openHistory(ev, ids)}>${t("beta_show_history", L)}</a>
          </div>`
        : nothing}
    </div>
  `;
}

/** Progress toward a trigger target — the "8,507 / 15,000 km · 57 %" story.
 *
 *  All three accumulating trigger types map onto it: counters measure the
 *  raw meter against a baseline; state_change counts and runtime hours
 *  already accumulate from zero since the last reset.
 */
interface ProgressSpec {
  progress: number;
  target: number;
  unit: string;
  /** Raw meter reading, when it differs from the progress (counters). */
  meter: number | null;
}

function progressSpec(task: MaintenanceTask, unit: string, ctx: SparklineContext): ProgressSpec | null {
  const tc = task.trigger_config;
  const cur = task.trigger_current_value;
  if (!tc || cur == null) return null;
  switch (tc.type || "threshold") {
    case "counter": {
      const target = tc.trigger_target_value;
      if (target == null || target <= 0) return null;
      if (!tc.trigger_delta_mode) {
        // Non-delta counters count from zero since the last reset — the raw
        // value IS the progress. Subtracting a baseline here showed a fresh
        // cycle as stuck at 0 (progress.ts branches the same way; bug audit
        // 2026-08-22).
        return { progress: Math.max(0, cur), target, unit, meter: null };
      }
      const base = counterBaseline(task, rawStatsPoints(task, ctx));
      return { progress: Math.max(0, cur - (base?.value ?? cur)), target, unit, meter: cur };
    }
    case "state_change": {
      const target = tc.trigger_target_changes;
      if (target == null || target <= 0) return null;
      return { progress: Math.max(0, cur), target, unit: "", meter: null };
    }
    case "runtime": {
      const target = tc.trigger_runtime_hours;
      if (target == null || target <= 0) return null;
      return { progress: Math.max(0, cur), target, unit: "h", meter: null };
    }
  }
  return null;
}

/** Absolute baseline a counter's progress is measured from: the stored
 *  delta baseline if present, else the reading nearest the last service. */
function counterBaseline(task: MaintenanceTask, rawPoints: ChartPoint[]): { value: number; ts: number | null } | null {
  if (task.trigger_baseline_value != null) {
    return { value: task.trigger_baseline_value, ts: lastServiceTs(task) };
  }
  if (!rawPoints.length) return null;
  const ts = lastServiceTs(task);
  if (ts == null) return { value: rawPoints[0].val, ts: null };
  let best = rawPoints[0];
  let bestD = Math.abs(rawPoints[0].ts - ts);
  for (const p of rawPoints) {
    const d = Math.abs(p.ts - ts);
    if (d < bestD) { best = p; bestD = d; }
  }
  return { value: best.val, ts };
}

function lastServiceTs(task: MaintenanceTask): number | null {
  const e = [...task.history]
    .filter((h) => h.type === "completed" || h.type === "reset")
    .sort((a, b) => stampMs(b.timestamp) - stampMs(a.timestamp))[0];
  return e ? stampMs(e.timestamp) : null;
}

/** "8,507 / 15,000 km · 57 %" header + progress bar (counter / state_change / runtime). */
function renderProgress(spec: ProgressSpec, L: string) {
  const pct = Math.min(999, Math.round((spec.progress / spec.target) * 100));
  const level = pct >= 100 ? "over" : pct >= 75 ? "near" : "ok";

  return html`
    <div class="counter-progress">
      <div class="counter-progress-nums">
        <span class="counter-progress-main">${fmtVal(spec.progress, "", L)}<span class="counter-progress-target"> / ${fmtVal(spec.target, spec.unit, L)}</span></span>
        <span class="counter-progress-pct ${level}">${pct} %</span>
      </div>
      <div class="counter-progress-bar" role="progressbar" aria-valuenow=${pct} aria-valuemin="0" aria-valuemax="100">
        <div class="counter-progress-fill ${level}" style="width:${Math.min(100, pct)}%"></div>
      </div>
      <div class="counter-progress-caption">
        ${t("chart_since_service", L)}${spec.meter != null ? html` · ${t("current", L)}: ${fmtVal(spec.meter, spec.unit, L)}` : nothing}
      </div>
    </div>
  `;
}

/** Raw stats/history series for the task's entity (no transforms). */
function rawStatsPoints(task: MaintenanceTask, ctx: SparklineContext): ChartPoint[] {
  const tc = task.trigger_config;
  if (!tc) return [];
  const triggerType = tc.type || "threshold";
  const entityId = primaryTriggerEntity(tc) || "";
  // Runtime accumulates hours DERIVED from the entity's on/off time — the
  // entity's own long-term statistics (an on/off ratio, or an unrelated raw
  // sensor value) are NOT that accumulation. Plot only the recorded per-cycle
  // trigger_value snapshots + the live current value instead.
  const statsPoints =
    triggerType === "runtime" ? [] : (ctx.detailStatsData.get(entityId) || []);
  const isCounter = ctx.isCounterEntity(tc);
  const points: ChartPoint[] = [];

  if (statsPoints.length >= 2) {
    for (const sp of statsPoints) {
      const pt: ChartPoint = { ts: sp.ts, val: sp.val };
      if (!isCounter && sp.min != null && sp.max != null) {
        pt.min = sp.min;
        pt.max = sp.max;
      }
      points.push(pt);
    }
  } else {
    for (const h of task.history) {
      if (h.trigger_value != null) {
        points.push({ ts: stampMs(h.timestamp), val: h.trigger_value });
      }
    }
  }
  // #141: a history-fallback series already runs to "now" and plots the
  // STATE — appending trigger_current_value (a change counter on
  // state_change triggers) would graft a wrong-dimension point onto it.
  const fromHistory = !!entityId && !!ctx.historyFallbackIds?.has(entityId) && statsPoints.length >= 2;
  if (task.trigger_current_value != null && !fromHistory) {
    points.push({ ts: Date.now(), val: task.trigger_current_value });
  }
  points.sort((a, b) => a.ts - b.ts);
  return points;
}

// Module-private chart assembly — maps task semantics onto chart props.
function renderChart(task: MaintenanceTask, unit: string, ctx: SparklineContext) {
  const tc = task.trigger_config;
  if (!tc) return nothing;
  const triggerType = tc.type || "threshold";
  const entityId = primaryTriggerEntity(tc) || "";
  // A due date only counts down — no curve to tell.
  if (triggerType === "due_date") return nothing;

  let points = rawStatsPoints(task, ctx);
  // #141 round 2: a state_change trigger on recorder history draws the
  // trigger's view (alert held / change count), not the raw entity state.
  let stateView: StateChangeView | null = null;
  if (triggerType === "state_change" && entityId && ctx.historyFallbackIds?.has(entityId)) {
    stateView = stateChangeView(points, tc, { since: lastServiceTs(task), current: task.trigger_current_value ?? null });
    if (stateView) points = stateView.points;
  }
  // Runtime accumulates hours with no stored intermediate snapshots: synthesize
  // the current cycle (0 at the last service → live value now) so the chart
  // resets each completion and always has a drawable 2-point line.
  if (
    triggerType === "runtime" &&
    tc.trigger_runtime_hours &&
    task.trigger_current_value != null
  ) {
    const cycleStart = lastServiceTs(task) ?? points[0]?.ts ?? (Date.now() - 86400000);
    points = [
      { ts: cycleStart, val: 0 },
      { ts: Date.now(), val: Math.max(0, task.trigger_current_value) },
    ];
  }
  if (ctx.hideOutliers) points = filterOutliers(points);

  // Still waiting for the first stats fetch → placeholder with the range chips.
  const loading = points.length < 2 && !!entityId && ctx.hasStatsService && !ctx.detailStatsData.has(entityId);
  if (points.length < 2 && !loading) return nothing;

  // Entities without long-term statistics (input_booleans, sensors without a
  // state_class) silently fall back to the sparse maintenance-event values —
  // say so instead of letting the thin chart look broken.
  const statsFetchedEmpty =
    !!entityId && ctx.detailStatsData.has(entityId) && (ctx.detailStatsData.get(entityId)?.length ?? 0) < 2;
  // The beta UI draws no line for a state change that has neither
  // statistics nor recorder history: the values noted at completions are
  // not the sensor (a straight 1 → 0 across a year); "Show more" opens HA's
  // own history of it instead.
  if (betaUi() && triggerType === "state_change" && statsFetchedEmpty && !(entityId && ctx.historyFallbackIds?.has(entityId))) return nothing;

  // The history fallback can span years; honor the selected window when enough
  // points remain (never crop below a drawable series).
  const cutoff = Date.now() - ctx.rangeDays * 86400000;
  const inRange = points.filter((p) => p.ts >= cutoff);
  if (inRange.length >= 2) points = inRange;

  let targetValue: number | null = null;
  let targetMark = "◆";
  let forceZero = false;
  if (triggerType === "threshold" && tc.trigger_above == null && tc.trigger_below == null && (tc.trigger_equals != null || tc.trigger_not_equals != null)) {
    // A discrete level (= / ≠) is drawn like the limits are: the chart had
    // no line for it at all (trigger check 2026-10-16).
    targetValue = tc.trigger_equals ?? tc.trigger_not_equals ?? null;
    targetMark = tc.trigger_equals != null ? "=" : "≠";
  } else if (triggerType === "counter" && tc.trigger_target_value != null && points.length) {
    // Progress domain: cumulative since the last service, never negative.
    // Baseline subtraction is a DELTA-mode concept — a non-delta counter's
    // raw value already is the cycle progress (bug audit 2026-08-22).
    if (tc.trigger_delta_mode) {
      const base = counterBaseline(task, points);
      if (base) {
        if (base.ts != null) {
          const kept = points.filter((p) => p.ts >= base.ts!);
          if (kept.length >= 2) points = kept;
        }
        points = points.map((p) => ({ ...p, val: Math.max(0, p.val - base.value) }));
      }
    }
    targetValue = tc.trigger_target_value;
    forceZero = true;
  } else if (triggerType === "state_change" && tc.trigger_target_changes && stateView?.mode !== "alarm") {
    // Change counts / runtime hours already accumulate from zero. A latch
    // ("alarm" view) has no meaningful target line: its axis is alert/ok.
    targetValue = tc.trigger_target_changes;
    forceZero = true;
  } else if (triggerType === "runtime" && tc.trigger_runtime_hours) {
    // Points are the synthesized current-cycle line (built above).
    targetValue = tc.trigger_runtime_hours;
    forceZero = true;
  }

  // Dashed degradation projection (30 days ahead of the last reading). Also
  // shown for a "stable"-classified slope when a real threshold prediction
  // exists — a slow 0.25 %/day decline classifies stable yet still crosses
  // the threshold in a foreseeable number of days.
  let projection: ChartPoint[] | null = null;
  // A projection pointing AWAY from the configured threshold is noise (the
  // ET-4800 finding: a refill-skewed rising rate on a below-threshold ink
  // sensor projected the ink level going UP) — draw it only when it heads
  // toward the bound, or when no bound is configured at all.
  const rate = task.degradation_rate;
  const pointsAway =
    rate != null &&
    ((tc.trigger_below != null && tc.trigger_above == null && rate > 0) ||
      (tc.trigger_above != null && tc.trigger_below == null && rate < 0));
  if (
    targetValue == null &&
    rate != null &&
    !pointsAway &&
    (task.degradation_trend !== "stable" || task.days_until_threshold != null) &&
    task.degradation_trend !== "insufficient_data" &&
    points.length >= 2
  ) {
    const lp = points[points.length - 1];
    projection = [lp, { ts: lp.ts + 30 * 86400000, val: lp.val + rate * 30 }];
  }

  const events: ChartEvent[] = task.history
    .filter((h) => ["completed", "skipped", "reset"].includes(h.type))
    .map((h) => ({ ts: stampMs(h.timestamp), type: h.type }));

  return html`
    <maintenance-trigger-chart
      .points=${loading ? [] : points}
      .events=${events}
      .unit=${unit}
      .lang=${ctx.lang}
      .thresholdAbove=${triggerType === "threshold" ? tc.trigger_above ?? null : null}
      .thresholdBelow=${triggerType === "threshold" ? tc.trigger_below ?? null : null}
      .targetValue=${targetValue}
      .targetMark=${targetMark}
      .forceZero=${forceZero}
      .projection=${projection}
      .rangeDays=${ctx.rangeDays}
      .hideOutliers=${ctx.hideOutliers}
      .busy=${loading}
      @range-change=${(e: CustomEvent<{ days: number }>) => ctx.setRangeDays(e.detail.days)}
      @outlier-toggle=${(e: CustomEvent<{ hide: boolean }>) => ctx.setHideOutliers(e.detail.hide)}
    ></maintenance-trigger-chart>
    ${(() => {
      if (loading) return nothing;
      // #141: the series came from recorder state history (binary sensors
      // never have long-term statistics) — say so, incl. the shorter window.
      if (entityId && ctx.historyFallbackIds?.has(entityId) && !statsFetchedEmpty) {
        return html`<div class="chart-note">
          <ha-icon icon="mdi:information-outline"></ha-icon>
          ${t(stateView?.mode === "alarm" ? "chart_history_alarm" : stateView?.mode === "count" ? "chart_history_count" : "chart_history_fallback", ctx.lang)}
        </div>`;
      }
      if (statsFetchedEmpty) {
        return html`<div class="chart-note">
          <ha-icon icon="mdi:information-outline"></ha-icon>
          ${t("chart_no_stats", ctx.lang)}
        </div>`;
      }
      return nothing;
    })()}
  `;
}
