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

import { html, nothing } from "lit";
import { t, fireMoreInfo } from "../styles";
import { fmtNum, fmtVal } from "./chart-utils";
import "../components/trigger-chart";
import type { ChartPoint, ChartEvent } from "../components/trigger-chart";
import type { MaintenanceTask, TriggerConfig, StatisticsPoint } from "../types";

export interface SparklineContext {
  lang: string;
  detailStatsData: Map<string, StatisticsPoint[]>;
  hasStatsService: boolean;
  isCounterEntity: (tc: TriggerConfig) => boolean;
  rangeDays: number;
  setRangeDays: (days: number) => void;
}

export function renderTriggerSection(task: MaintenanceTask, ctx: SparklineContext) {
  const tc = task.trigger_config;
  if (!tc) return nothing;
  const L = ctx.lang;
  const info = task.trigger_entity_info;
  const infos = task.trigger_entity_infos;
  const friendlyName = info?.friendly_name || tc.entity_id || "—";
  const entityId = tc.entity_id || "";
  const entityIds = tc.entity_ids || (entityId ? [entityId] : []);
  const unit = info?.unit_of_measurement || "";
  const currentVal = task.trigger_current_value;
  const triggerType = tc.type || "threshold";
  const isMultiEntity = entityIds.length > 1;
  const isCounterTask = triggerType === "counter" && tc.trigger_target_value != null;

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

      ${isCounterTask
        ? renderCounterProgress(task, unit, ctx)
        : currentVal !== null && currentVal !== undefined
          ? html`
              <div class="trigger-value-row">
                <span class="trigger-current ${task.trigger_active ? "active" : ""}">${typeof currentVal === "number" ? fmtVal(currentVal, "", L) : currentVal}</span>
                ${unit ? html`<span class="trigger-unit">${unit}</span>` : nothing}
              </div>
            `
          : nothing}

      <div class="trigger-limits">
        ${triggerType === "threshold" ? html`
          ${tc.trigger_above != null ? html`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${t("threshold_above", L)}: ${tc.trigger_above} ${unit}</span>` : nothing}
          ${tc.trigger_below != null ? html`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${t("threshold_below", L)}: ${tc.trigger_below} ${unit}</span>` : nothing}
          ${tc.trigger_for_minutes ? html`<span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${t("for_minutes", L)}: ${tc.trigger_for_minutes}</span>` : nothing}
        ` : nothing}
        ${triggerType === "state_change" ? html`
          ${tc.trigger_target_changes != null ? html`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${t("target_changes", L)}: ${tc.trigger_target_changes}</span>` : nothing}
        ` : nothing}
        ${triggerType === "runtime" ? html`
          ${tc.trigger_runtime_hours != null ? html`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${t("runtime_hours", L)}: ${tc.trigger_runtime_hours}h</span>` : nothing}
        ` : nothing}
        ${triggerType === "compound" ? html`
          <span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${t("compound_logic", L)}: ${tc.compound_logic || (tc as any).operator || "AND"}</span>
          ${(tc.conditions || []).map((cond: any, i: number) => html`
            <span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${i + 1}. ${t(cond.type || "unknown", L)}: ${cond.entity_id ? html`<span class="entity-link" @click=${(ev: Event) => fireMoreInfo(ev, cond.entity_id)}>${cond.entity_id}</span>` : ""}</span>
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
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
  return e ? new Date(e.timestamp).getTime() : null;
}

/** "8,507 / 15,000 km · 57 %" header + progress bar for counter tasks. */
function renderCounterProgress(task: MaintenanceTask, unit: string, ctx: SparklineContext) {
  const tc = task.trigger_config!;
  const target = tc.trigger_target_value!;
  const cur = task.trigger_current_value;
  if (cur == null || target <= 0) return nothing;

  const base = counterBaseline(task, rawStatsPoints(task, ctx));
  const progress = Math.max(0, cur - (base?.value ?? cur));
  const pct = Math.min(999, Math.round((progress / target) * 100));
  const level = pct >= 100 ? "over" : pct >= 75 ? "near" : "ok";
  const L = ctx.lang;

  return html`
    <div class="counter-progress">
      <div class="counter-progress-nums">
        <span class="counter-progress-main">${fmtVal(progress, "", L)}<span class="counter-progress-target"> / ${fmtVal(target, unit, L)}</span></span>
        <span class="counter-progress-pct ${level}">${pct} %</span>
      </div>
      <div class="counter-progress-bar" role="progressbar" aria-valuenow=${pct} aria-valuemin="0" aria-valuemax="100">
        <div class="counter-progress-fill ${level}" style="width:${Math.min(100, pct)}%"></div>
      </div>
      <div class="counter-progress-caption">
        ${t("chart_since_service", L)} · ${t("current", L)}: ${fmtVal(cur, unit, L)}
      </div>
    </div>
  `;
}

/** Raw stats/history series for the task's entity (no transforms). */
function rawStatsPoints(task: MaintenanceTask, ctx: SparklineContext): ChartPoint[] {
  const tc = task.trigger_config;
  if (!tc) return [];
  const entityId = tc.entity_id || "";
  const statsPoints = ctx.detailStatsData.get(entityId) || [];
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
        points.push({ ts: new Date(h.timestamp).getTime(), val: h.trigger_value });
      }
    }
  }
  if (task.trigger_current_value != null) {
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
  const entityId = tc.entity_id || "";
  const isCounterTask = triggerType === "counter" && tc.trigger_target_value != null;

  let points = rawStatsPoints(task, ctx);

  // Still waiting for the first stats fetch → placeholder with the range chips.
  const loading = points.length < 2 && !!entityId && ctx.hasStatsService && !ctx.detailStatsData.has(entityId);
  if (points.length < 2 && !loading) return nothing;

  // The history fallback can span years; honor the selected window when enough
  // points remain (never crop below a drawable series).
  const cutoff = Date.now() - ctx.rangeDays * 86400000;
  const inRange = points.filter((p) => p.ts >= cutoff);
  if (inRange.length >= 2) points = inRange;

  let targetValue: number | null = null;
  let forceZero = false;
  if (isCounterTask && points.length) {
    // Progress domain: cumulative since the last service, never negative.
    const base = counterBaseline(task, points);
    if (base) {
      if (base.ts != null) {
        const kept = points.filter((p) => p.ts >= base.ts!);
        if (kept.length >= 2) points = kept;
      }
      points = points.map((p) => ({ ...p, val: Math.max(0, p.val - base.value) }));
    }
    targetValue = tc.trigger_target_value!;
    forceZero = true;
  }

  // Dashed degradation projection (30 days ahead of the last reading).
  let projection: ChartPoint[] | null = null;
  if (
    !isCounterTask &&
    task.degradation_rate != null &&
    task.degradation_trend !== "stable" &&
    task.degradation_trend !== "insufficient_data" &&
    points.length >= 2
  ) {
    const lp = points[points.length - 1];
    projection = [lp, { ts: lp.ts + 30 * 86400000, val: lp.val + task.degradation_rate * 30 }];
  }

  const events: ChartEvent[] = task.history
    .filter((h) => ["completed", "skipped", "reset"].includes(h.type))
    .map((h) => ({ ts: new Date(h.timestamp).getTime(), type: h.type }));

  return html`
    <maintenance-trigger-chart
      .points=${loading ? [] : points}
      .events=${events}
      .unit=${unit}
      .lang=${ctx.lang}
      .thresholdAbove=${triggerType === "threshold" ? tc.trigger_above ?? null : null}
      .thresholdBelow=${triggerType === "threshold" ? tc.trigger_below ?? null : null}
      .targetValue=${targetValue}
      .forceZero=${forceZero}
      .projection=${projection}
      .rangeDays=${ctx.rangeDays}
      .busy=${loading}
      @range-change=${(e: CustomEvent<{ days: number }>) => ctx.setRangeDays(e.detail.days)}
    ></maintenance-trigger-chart>
  `;
}
