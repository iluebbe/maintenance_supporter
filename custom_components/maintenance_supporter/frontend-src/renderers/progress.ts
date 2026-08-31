/** Progress renderers shared by the dashboard rows, the object-detail view and
 *  the task-detail overview tab.
 *
 * These are pure of component state — everything they need is passed in — so
 * they live outside the panel (which keeps the 2.5k-line panel focused on
 * routing/data) yet still render into its shadow root, where the CSS lives.
 *
 * - renderTriggerProgress: a "current / target" bar for a sensor trigger
 *   (threshold / counter / state_change / runtime / compound).
 * - renderMiniSparkline: a tiny 60x20 trend line for overview rows.
 * - renderDaysProgress: the detailed last→next due bar for the detail view.
 */

import { html, nothing } from "lit";
import { t, formatDate, formatDueDays } from "../styles";
import { daysProgress } from "../helpers/interval";
import type { MaintenanceTask, TaskRow, StatisticsPoint } from "../types";

const MINI_SPARKLINE_W = 60;
const MINI_SPARKLINE_H = 20;
const MAX_MINI_POINTS = 30;

export type TrendState = "approaching" | "stable" | "easing";
const TREND_GLYPHS: Record<TrendState, string> = { approaching: "\u2197", stable: "\u2192", easing: "\u2198" };

/** #150 follow-up: on narrow/tight rows the squeezed sparkline is unreadable
 *  — this reduces the same points to the one question the curve answered:
 *  is the value heading TOWARD the threshold, holding, or easing away?
 *  Direction is relative to the threshold (a dropping salt level and a
 *  rising runtime are both "approaching"). null = no arrow (no direction,
 *  compound, or fewer than two points). */
export function computeTrend(
  row: TaskRow | MaintenanceTask,
  miniStatsData: Map<string, StatisticsPoint[]>,
): TrendState | null {
  const tc = row.trigger_config;
  if (!tc?.entity_id) return null;
  let toward: 1 | -1;
  const type = tc.type || "threshold";
  if (type === "threshold") {
    if (tc.trigger_above != null) toward = 1;
    else if (tc.trigger_below != null) toward = -1;
    else return null; // discrete = / \u2260 levels have no gradient
  } else if (type === "counter" || type === "runtime" || type === "state_change") {
    toward = 1; // these accumulate toward their target
  } else {
    return null; // compound: conditions may point both ways
  }
  const statsPoints = miniStatsData.get(tc.entity_id) || [];
  let points: { ts: number; val: number }[] =
    statsPoints.length >= 2
      ? statsPoints.map((p) => ({ ts: p.ts, val: p.val }))
      : (row.history || [])
          .filter((h) => h.trigger_value != null)
          .map((h) => ({ ts: new Date(h.timestamp).getTime(), val: h.trigger_value as number }));
  if (row.trigger_current_value != null) points = [...points, { ts: Date.now(), val: row.trigger_current_value }];
  if (points.length < 2) return null;
  points.sort((a, b) => a.ts - b.ts);
  const vals = points.map((p) => p.val);
  const range = Math.max(...vals) - Math.min(...vals);
  const delta = vals[vals.length - 1] - vals[0];
  // Significance is judged against the JOURNEY to the threshold, not the
  // series' own noise band: a sensor crawling 50.0 -> 50.15 under a
  // 60-threshold is flat, even though that move spans most of its range.
  const target =
    type === "threshold" ? (tc.trigger_above ?? tc.trigger_below)
    : type === "counter" ? tc.trigger_target_value
    : type === "runtime" ? tc.trigger_runtime_hours
    : tc.trigger_target_changes;
  const base = typeof target === "number" ? Math.max(Math.abs(target - vals[0]), range) : range;
  if (base === 0 || Math.abs(delta) < base * (typeof target === "number" ? 0.05 : 0.15)) return "stable";
  return Math.sign(delta) === toward ? "approaching" : "easing";
}

export function renderTriggerProgress(row: TaskRow | MaintenanceTask, opts?: { trend?: TrendState | null; lang?: string }) {
  const tc = row.trigger_config ?? null;
  if (!tc) return nothing;

  const triggerType = tc.type || "threshold";
  const unit = row.trigger_entity_info?.unit_of_measurement ?? "";

  let pct = 0;
  let label = "";

  if (triggerType === "threshold") {
    const val = row.trigger_current_value ?? null;
    if (val == null) return nothing;
    const above = tc.trigger_above;
    const below = tc.trigger_below;
    if (above != null) {
      // Progress toward upper limit
      const low = below ?? 0;
      const range = above - low || 1;
      pct = Math.min(100, Math.max(0, ((val - low) / range) * 100));
      label = `${val.toFixed(1)} / ${above} ${unit}`;
    } else if (below != null) {
      // Progress toward lower limit (inverted: lower is worse)
      // Use entity max, or 2x the threshold as a stable "safe" reference.
      // Using val*2 caused a dynamic ceiling that distorted the bar.
      const entityMax = row.trigger_entity_info?.max;
      const high = entityMax ?? ((below * 2) || 100);
      const range = high - below || 1;
      pct = Math.min(100, Math.max(0, ((high - val) / range) * 100));
      label = `${val.toFixed(1)} / ${below} ${unit}`;
    } else if (tc.trigger_equals != null || tc.trigger_not_equals != null) {
      // Discrete = / ≠ levels have no meaningful gradient — binary bar,
      // same treatment as compound.
      const target = tc.trigger_equals != null ? `= ${tc.trigger_equals}` : `≠ ${tc.trigger_not_equals}`;
      label = `${val.toFixed(1)} (${target}${unit ? ` ${unit}` : ""})`;
      pct = row.trigger_active ? 100 : 0;
    } else {
      return nothing;
    }
  } else if (triggerType === "counter") {
    const target = tc.trigger_target_value || 1;
    let val: number | null;
    if (tc.trigger_delta_mode) {
      // Delta mode: NEVER fall back to the raw counter — a lifetime odometer
      // at 27,000 km with a 15,000 km interval would render as a full red
      // "27000/15000" bar right after adoption, before the baseline reaches
      // the read-model (issue #102). Compute from the baseline if the delta
      // itself isn't exposed yet; show nothing rather than lie.
      val = row.trigger_current_delta ?? null;
      if (val == null && row.trigger_baseline_value != null && row.trigger_current_value != null) {
        val = row.trigger_current_value - row.trigger_baseline_value;
      }
    } else {
      val = row.trigger_current_value ?? null;
    }
    if (val == null) return nothing;
    pct = Math.min(100, Math.max(0, (val / target) * 100));
    label = `${val.toFixed(1)} / ${target} ${unit}`;
  } else if (triggerType === "state_change") {
    const target = tc.trigger_target_changes || 1;
    const val = row.trigger_current_value ?? null;
    if (val == null) return nothing;
    pct = Math.min(100, Math.max(0, (val / target) * 100));
    label = `${Math.round(val)} / ${target}`;
  } else if (triggerType === "runtime") {
    const target = tc.trigger_runtime_hours || 100;
    const val = row.trigger_current_value ?? null;
    if (val == null) return nothing;
    pct = Math.min(100, Math.max(0, (val / target) * 100));
    label = `${val.toFixed(1)}h / ${target}h`;
  } else if (triggerType === "compound") {
    const logic = tc.compound_logic || (tc as any).operator || "AND";
    const condCount = tc.conditions?.length || 0;
    label = `${logic} (${condCount})`;
    pct = row.trigger_active ? 100 : 0;
  } else {
    return nothing;
  }

  const triggerOverflow = pct >= 100;
  const barColor = pct > 90 ? "var(--error-color, #f44336)"
                 : pct > 70 ? "var(--warning-color, #ff9800)"
                 : "var(--primary-color)";

  return html`
    <div class="trigger-progress">
      <div class="trigger-progress-bar">
        <div class="trigger-progress-fill${triggerOverflow ? " overflow" : ""}" style="width:${pct}%;background:${barColor}"></div>
      </div>
      <span class="trigger-progress-label">${label}${opts?.trend
        ? html` <i class="trend-arrow trend-${opts.trend}" title="${t(`trend_${opts.trend}`, opts.lang ?? "en")}" aria-label="${t(`trend_${opts.trend}`, opts.lang ?? "en")}">${TREND_GLYPHS[opts.trend]}</i>`
        : nothing}</span>
    </div>
  `;
}

/** A mini sparkline for overview rows (tiny trend line). */
export function renderMiniSparkline(
  row: TaskRow | MaintenanceTask,
  miniStatsData: Map<string, StatisticsPoint[]>,
  lang: string,
) {
  if (!row.trigger_config?.entity_id) return nothing;
  const entityId = row.trigger_config.entity_id;

  // PRIMARY: HA recorder statistics (daily, last 14 days)
  const statsPoints = miniStatsData.get(entityId) || [];

  let points: { ts: number; val: number }[] = [];

  if (statsPoints.length >= 2) {
    points = statsPoints.map((p) => ({ ts: p.ts, val: p.val }));
  } else {
    // FALLBACK: original behavior from task history
    if (!row.history) return nothing;
    for (const h of row.history) {
      if (h.trigger_value != null) {
        points.push({ ts: new Date(h.timestamp).getTime(), val: h.trigger_value });
      }
    }
  }

  if (row.trigger_current_value != null) {
    points.push({ ts: Date.now(), val: row.trigger_current_value });
  }
  if (points.length < 2) return nothing;
  points.sort((a, b) => a.ts - b.ts);

  const W = MINI_SPARKLINE_W, H = MINI_SPARKLINE_H;
  const vals = points.map((p) => p.val);
  let minV = Math.min(...vals), maxV = Math.max(...vals);
  const range = maxV - minV || 1;
  minV -= range * 0.1; maxV += range * 0.1;
  const tsMin = points[0].ts, tsMax = points[points.length - 1].ts;
  const tsR = tsMax - tsMin || 1;

  const toX = (ts: number) => ((ts - tsMin) / tsR) * W;
  const toY = (v: number) => 2 + (1 - (v - minV) / (maxV - minV)) * (H - 4);

  // Downsample for tiny SVG
  let renderPoints = points;
  if (renderPoints.length > MAX_MINI_POINTS) {
    const step = Math.ceil(renderPoints.length / MAX_MINI_POINTS);
    renderPoints = renderPoints.filter((_, i) => i % step === 0 || i === renderPoints.length - 1);
  }

  const pts = renderPoints.map((p) => `${toX(p.ts).toFixed(1)},${toY(p.val).toFixed(1)}`).join(" ");
  // Match the detail chart's semantics: an actively-triggered sensor tints red.
  const stroke = row.trigger_active
    ? "var(--error-color, #f44336)"
    : "var(--primary-color)";

  return html`
    <svg class="mini-sparkline" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="${t("chart_mini_sparkline", lang)}">
      <polyline points="${pts}" fill="none" stroke="${stroke}" stroke-width="1.5" stroke-linejoin="round" />
    </svg>
  `;
}

/** A detailed days-progress bar (last performed → next due) for the detail view. */
export function renderDaysProgress(task: MaintenanceTask, lang: string) {
  const L = lang;
  if (task.days_until_due == null || !task.interval_days || task.interval_days <= 0) return nothing;

  // Unit-aware (issue #59): a "1 year" task has span ≈365 d, not 1 d.
  const { pct, overflow: daysOverflow } = daysProgress(
    task.interval_days, task.days_until_due, task.interval_unit,
  );

  let barColor = "var(--success-color, #4caf50)";
  if (task.status === "overdue") barColor = "var(--error-color, #f44336)";
  else if (task.status === "due_soon") barColor = "var(--warning-color, #ff9800)";

  return html`
    <div class="days-progress">
      <div class="days-progress-labels">
        <span>${task.last_performed ? `${t("last_performed", L)}: ${formatDate(task.last_performed, L)}` : ""}</span>
        <span>${task.next_due ? `${t("next_due", L)}: ${formatDate(task.next_due, L)}` : ""}</span>
      </div>
      <div class="days-progress-bar" role="progressbar" aria-valuenow="${Math.round(pct)}" aria-valuemin="0" aria-valuemax="100" aria-label="${t("days_progress", L)}">
        <div class="days-progress-fill${daysOverflow ? " overflow" : ""}" style="width:${pct}%;background:${barColor}"></div>
      </div>
      <div class="days-progress-text">${formatDueDays(task.days_until_due, L)}</div>
    </div>
  `;
}
