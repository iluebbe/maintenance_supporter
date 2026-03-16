/** Trigger section and sparkline chart renderers. */

import { html, svg, nothing } from "lit";
import { t, fireMoreInfo } from "../styles";
import type { MaintenanceTask, TriggerConfig, StatisticsPoint } from "../types";

const DETAIL_SPARKLINE_W = 300;
const DETAIL_SPARKLINE_H = 140;
const MAX_HOVER_TARGETS = 27;

export interface SparklineContext {
  lang: string;
  detailStatsData: Map<string, StatisticsPoint[]>;
  hasStatsService: boolean;
  isCounterEntity: (tc: TriggerConfig) => boolean;
  tooltip: { x: number; y: number; text: string } | null;
  setTooltip: (t: { x: number; y: number; text: string } | null) => void;
}

export function renderTriggerSection(task: MaintenanceTask, ctx: SparklineContext) {
  const tc = task.trigger_config;
  if (!tc) return nothing;
  const L = ctx.lang;
  const info = task.trigger_entity_info;
  const infos = task.trigger_entity_infos;
  const friendlyName = info?.friendly_name || tc.entity_id || "\u2014";
  const entityId = tc.entity_id || "";
  const entityIds = tc.entity_ids || (entityId ? [entityId] : []);
  const unit = info?.unit_of_measurement || "";
  const currentVal = task.trigger_current_value;
  const triggerType = tc.type || "threshold";
  const isMultiEntity = entityIds.length > 1;

  return html`
    <h3>${t("trigger", L)}</h3>
    <div class="trigger-card">
      <div class="trigger-header">
        <ha-icon icon="mdi:pulse" style="color: var(--primary-color); --mdc-icon-size: 20px;"></ha-icon>
        <div>
          ${isMultiEntity ? html`
            <div class="trigger-entity-name">${entityIds.length} ${t("entities", L)} (${tc.entity_logic || "any"})</div>
            <div class="trigger-entity-id">${entityIds.map((eid, i) => html`${i > 0 ? ", " : ""}<span class="entity-link" @click=${(ev: Event) => fireMoreInfo(ev, eid)}>${eid}</span>`)}${tc.attribute ? ` \u2192 ${tc.attribute}` : ""}</div>
          ` : html`
            <div class="trigger-entity-name">${friendlyName}</div>
            <div class="trigger-entity-id">${entityId ? html`<span class="entity-link" @click=${(ev: Event) => fireMoreInfo(ev, entityId)}>${entityId}</span>` : ""}${tc.attribute ? ` \u2192 ${tc.attribute}` : ""}</div>
          `}
        </div>
        <span class="status-badge ${task.trigger_active ? "triggered" : "ok"}" style="margin-left: auto;">
          ${task.trigger_active ? t("triggered", L) : t("ok", L)}
        </span>
      </div>

      ${currentVal !== null && currentVal !== undefined
        ? html`
            <div class="trigger-value-row">
              <span class="trigger-current ${task.trigger_active ? "active" : ""}">${typeof currentVal === "number" ? currentVal.toFixed(1) : currentVal}</span>
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
        ${triggerType === "counter" ? html`
          ${tc.trigger_target_value != null ? html`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${t("target_value", L)}: ${tc.trigger_target_value} ${unit}</span>` : nothing}
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
        ${info?.min != null ? html`<span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${t("min", L)}: ${info.min} ${unit}</span>` : nothing}
        ${info?.max != null ? html`<span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${t("max", L)}: ${info.max} ${unit}</span>` : nothing}
      </div>

      ${infos && infos.length > 1 ? html`
        <div class="trigger-entity-list">
          ${infos.map(info => html`
            <span class="trigger-entity-id">${info.friendly_name} (<span class="entity-link" @click=${(ev: Event) => fireMoreInfo(ev, info.entity_id)}>${info.entity_id}</span>)</span>
          `)}
        </div>
      ` : nothing}

      ${renderSparkline(task, unit, ctx)}
    </div>
  `;
}

export function renderSparkline(task: MaintenanceTask, unit: string, ctx: SparklineContext) {
  const tc = task.trigger_config;
  if (!tc) return nothing;
  const triggerType = tc.type || "threshold";
  const isDelta = triggerType === "counter" && tc.trigger_delta_mode;
  const isCounter = ctx.isCounterEntity(tc);
  const entityId = tc.entity_id || "";

  const statsPoints = ctx.detailStatsData.get(entityId) || [];
  const points: { ts: number; val: number; min?: number; max?: number }[] = [];
  let hasMinMax = false;

  if (statsPoints.length >= 2) {
    for (const sp of statsPoints) {
      let val = sp.val;
      if (isDelta && task.trigger_baseline_value != null) {
        val -= task.trigger_baseline_value;
      }
      const pt: { ts: number; val: number; min?: number; max?: number } = { ts: sp.ts, val };
      if (!isCounter && sp.min != null && sp.max != null) {
        pt.min = isDelta && task.trigger_baseline_value != null ? sp.min - task.trigger_baseline_value : sp.min;
        pt.max = isDelta && task.trigger_baseline_value != null ? sp.max - task.trigger_baseline_value : sp.max;
        hasMinMax = true;
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
    let curVal = task.trigger_current_value;
    if (isDelta && task.trigger_baseline_value != null) {
      curVal -= task.trigger_baseline_value;
    }
    points.push({ ts: Date.now(), val: curVal });
  }

  if (points.length < 2 && entityId && ctx.hasStatsService && !ctx.detailStatsData.has(entityId)) {
    return html`<div class="sparkline-container" aria-live="polite" style="display:flex;align-items:center;justify-content:center;height:140px;color:var(--secondary-text-color);font-size:12px;">
      <ha-icon icon="mdi:chart-line" style="--mdc-icon-size:16px;margin-right:8px;"></ha-icon>
      ${t("loading_chart", ctx.lang)}
    </div>`;
  }

  if (points.length < 2) return nothing;

  points.sort((a, b) => a.ts - b.ts);

  const W = DETAIL_SPARKLINE_W;
  const H = DETAIL_SPARKLINE_H;
  const PAD_L = 30, PAD_R = 2, PAD_T = 8, PAD_B = 16;

  const vals = points.map((p) => p.val);
  let minVal = Math.min(...vals);
  let maxVal = Math.max(...vals);

  if (hasMinMax) {
    for (const p of points) {
      if (p.min != null) minVal = Math.min(minVal, p.min);
      if (p.max != null) maxVal = Math.max(maxVal, p.max);
    }
  }

  if (tc.trigger_above != null) {
    maxVal = Math.max(maxVal, tc.trigger_above);
    minVal = Math.min(minVal, tc.trigger_above);
  }
  if (tc.trigger_below != null) {
    minVal = Math.min(minVal, tc.trigger_below);
    maxVal = Math.max(maxVal, tc.trigger_below);
  }

  let counterEffectiveBaseline: number | null = null;
  let counterAbsoluteTarget: number | null = null;
  if (triggerType === "counter" && tc.trigger_target_value != null) {
    if (task.trigger_baseline_value != null) {
      counterEffectiveBaseline = task.trigger_baseline_value;
    } else if (points.length > 0) {
      const lastMaint = [...task.history]
        .filter((h) => h.type === "completed" || h.type === "reset")
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
      if (lastMaint) {
        const maintTs = new Date(lastMaint.timestamp).getTime();
        let closest = points[0];
        let closestDist = Math.abs(points[0].ts - maintTs);
        for (const p of points) {
          const dist = Math.abs(p.ts - maintTs);
          if (dist < closestDist) {
            closest = p;
            closestDist = dist;
          }
        }
        counterEffectiveBaseline = closest.val;
      } else {
        counterEffectiveBaseline = points[0].val;
      }
    }
    if (counterEffectiveBaseline != null) {
      counterAbsoluteTarget = counterEffectiveBaseline + tc.trigger_target_value;
      maxVal = Math.max(maxVal, counterAbsoluteTarget);
      minVal = Math.min(minVal, counterEffectiveBaseline);
    } else {
      maxVal = Math.max(maxVal, tc.trigger_target_value);
      minVal = Math.min(minVal, 0);
    }
  }
  if (isDelta && task.trigger_baseline_value != null) {
    minVal = Math.min(minVal, 0);
  }

  const range = maxVal - minVal || 1;
  minVal -= range * 0.1;
  maxVal += range * 0.1;

  const tsMin = points[0].ts;
  const tsMax = points[points.length - 1].ts;
  const tsRange = tsMax - tsMin || 1;

  const toX = (ts: number) => PAD_L + ((ts - tsMin) / tsRange) * (W - PAD_L - PAD_R);
  const toY = (v: number) => PAD_T + (1 - (v - minVal) / (maxVal - minVal)) * (H - PAD_T - PAD_B);

  const linePoints = points.map((p) => `${toX(p.ts).toFixed(1)},${toY(p.val).toFixed(1)}`).join(" ");
  const areaPath =
    `M${toX(points[0].ts).toFixed(1)},${H - PAD_B} ` +
    points.map((p) => `L${toX(p.ts).toFixed(1)},${toY(p.val).toFixed(1)}`).join(" ") +
    ` L${toX(points[points.length - 1].ts).toFixed(1)},${H - PAD_B} Z`;

  let minMaxBandPath = "";
  if (hasMinMax) {
    const ptsWithMM = points.filter((p) => p.min != null && p.max != null);
    if (ptsWithMM.length >= 2) {
      const upperPath = ptsWithMM.map((p) => `${toX(p.ts).toFixed(1)},${toY(p.max!).toFixed(1)}`);
      const lowerPath = [...ptsWithMM].reverse().map((p) => `${toX(p.ts).toFixed(1)},${toY(p.min!).toFixed(1)}`);
      minMaxBandPath = `M${upperPath[0]} ` + upperPath.slice(1).map((pt) => `L${pt}`).join(" ") +
        ` L${lowerPath[0]} ` + lowerPath.slice(1).map((pt) => `L${pt}`).join(" ") + " Z";
    }
  }

  const lastP = points[points.length - 1];
  const dotCx = toX(lastP.ts);
  const dotCy = toY(lastP.val);

  const fmtY = (v: number) => Math.abs(v) >= 10000 ? (v / 1000).toFixed(0) + "k" : v >= 1000 ? (v / 1000).toFixed(1) + "k" : v.toFixed(v < 10 ? 1 : 0);
  const yMaxLabel = fmtY(maxVal);
  const yMinLabel = fmtY(minVal);

  const eventMarkers = task.history
    .filter((h) => ["completed", "skipped", "reset"].includes(h.type))
    .map((h) => ({ ts: new Date(h.timestamp).getTime(), type: h.type }))
    .filter((e) => e.ts >= tsMin && e.ts <= tsMax);

  let hoverPoints = points;
  if (points.length > MAX_HOVER_TARGETS) {
    const step = (points.length - 1) / (MAX_HOVER_TARGETS - 1);
    hoverPoints = [];
    for (let i = 0; i < MAX_HOVER_TARGETS; i++) {
      hoverPoints.push(points[Math.round(i * step)]);
    }
  }

  return html`
    <div class="sparkline-container">
      <svg class="sparkline-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${t("chart_sparkline", ctx.lang)}">
        <text x="${PAD_L - 3}" y="${PAD_T + 3}" text-anchor="end" fill="var(--secondary-text-color)" font-size="8">${yMaxLabel}</text>
        <text x="${PAD_L - 3}" y="${H - PAD_B + 3}" text-anchor="end" fill="var(--secondary-text-color)" font-size="8">${yMinLabel}</text>
        <text x="${PAD_L}" y="${H - 1}" text-anchor="start" fill="var(--secondary-text-color)" font-size="7">${new Date(tsMin).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</text>
        <text x="${W - PAD_R}" y="${H - 1}" text-anchor="end" fill="var(--secondary-text-color)" font-size="7">${new Date(tsMax).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</text>
        ${minMaxBandPath ? svg`<path d="${minMaxBandPath}" fill="var(--primary-color)" opacity="0.08" />` : nothing}
        <path d="${areaPath}" fill="var(--primary-color)" opacity="0.15" />
        <polyline points="${linePoints}" fill="none" stroke="var(--primary-color)" stroke-width="2" stroke-linejoin="round" />
        ${task.degradation_rate != null && task.degradation_trend !== "stable" && task.degradation_trend !== "insufficient_data" && points.length >= 2 ? (() => {
          const lp = points[points.length - 1];
          const projDays = 30;
          const projTs = lp.ts + projDays * 86400000;
          const projVal = lp.val + task.degradation_rate! * projDays;
          const clampedTs = Math.min(projTs, tsMax + (tsMax - tsMin) * 0.3);
          const clampedVal = Math.max(minVal, Math.min(maxVal, projVal));
          const px1 = toX(lp.ts), py1 = toY(lp.val);
          const px2 = toX(clampedTs), py2 = toY(clampedVal);
          return svg`<line x1="${px1.toFixed(1)}" y1="${py1.toFixed(1)}" x2="${px2.toFixed(1)}" y2="${py2.toFixed(1)}" stroke="var(--warning-color, #ff9800)" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.7" />`;
        })() : nothing}
        ${triggerType === "threshold" && tc.trigger_above != null
          ? svg`<line x1="${PAD_L}" y1="${toY(tc.trigger_above).toFixed(1)}" x2="${W}" y2="${toY(tc.trigger_above).toFixed(1)}" stroke="var(--error-color, #f44336)" stroke-width="1.5" stroke-dasharray="5,3" />
                <text x="${W - 2}" y="${toY(tc.trigger_above) - 3}" text-anchor="end" fill="var(--error-color, #f44336)" font-size="9">\u25B2 ${tc.trigger_above}</text>`
          : nothing}
        ${triggerType === "threshold" && tc.trigger_below != null
          ? svg`<line x1="${PAD_L}" y1="${toY(tc.trigger_below).toFixed(1)}" x2="${W}" y2="${toY(tc.trigger_below).toFixed(1)}" stroke="var(--error-color, #f44336)" stroke-width="1.5" stroke-dasharray="5,3" />
                <text x="${W - 2}" y="${toY(tc.trigger_below) + 11}" text-anchor="end" fill="var(--error-color, #f44336)" font-size="9">\u25BC ${tc.trigger_below}</text>`
          : nothing}
        ${triggerType === "counter" && counterAbsoluteTarget != null
          ? svg`<line x1="${PAD_L}" y1="${toY(counterAbsoluteTarget).toFixed(1)}" x2="${W}" y2="${toY(counterAbsoluteTarget).toFixed(1)}" stroke="var(--error-color, #f44336)" stroke-width="1.5" stroke-dasharray="5,3" />
                <text x="${W - 2}" y="${toY(counterAbsoluteTarget) - 3}" text-anchor="end" fill="var(--error-color, #f44336)" font-size="9">${t("target_value", ctx.lang)}: +${tc.trigger_target_value}</text>`
          : nothing}
        ${triggerType === "counter" && counterEffectiveBaseline != null
          ? svg`<line x1="${PAD_L}" y1="${toY(counterEffectiveBaseline).toFixed(1)}" x2="${W}" y2="${toY(counterEffectiveBaseline).toFixed(1)}" stroke="var(--secondary-text-color)" stroke-width="1" stroke-dasharray="3,3" opacity="0.5" />
                <text x="${PAD_L + 2}" y="${toY(counterEffectiveBaseline) + 11}" text-anchor="start" fill="var(--secondary-text-color)" font-size="8">${t("baseline", ctx.lang)}</text>`
          : nothing}
        <circle cx="${dotCx.toFixed(1)}" cy="${dotCy.toFixed(1)}" r="3.5" fill="var(--primary-color)" />
        ${eventMarkers.map((e) => {
          const ex = toX(e.ts);
          const color = e.type === "completed" ? "var(--success-color, #4caf50)"
                      : e.type === "skipped" ? "var(--warning-color, #ff9800)"
                      : "var(--info-color, #2196f3)";
          return svg`
            <line x1="${ex.toFixed(1)}" y1="${PAD_T}" x2="${ex.toFixed(1)}" y2="${H - PAD_B}" stroke="${color}" stroke-width="1" stroke-dasharray="3,3" opacity="0.5" />
            <circle cx="${ex.toFixed(1)}" cy="${PAD_T + 2}" r="5" fill="${color}" opacity="0.8" />
            <text x="${ex.toFixed(1)}" y="${PAD_T + 6}" text-anchor="middle" fill="white" font-size="7" font-weight="bold">${e.type === "completed" ? "\u2713" : e.type === "skipped" ? "\u23ED" : "\u21BA"}</text>
          `;
        })}
        ${hoverPoints.map((p) => {
          const cx = toX(p.ts);
          const cy = toY(p.val);
          const dateStr = new Date(p.ts).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
          let valStr = `${p.val.toFixed(1)} ${unit}`;
          if (hasMinMax && p.min != null && p.max != null) {
            valStr += ` (${p.min.toFixed(1)}\u2013${p.max.toFixed(1)})`;
          }
          return svg`<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="8" fill="transparent" tabindex="0"
            @mouseenter=${(ev: MouseEvent) => showSparklineTooltip(ev, `${dateStr}\n${valStr}`, ctx.setTooltip)}
            @focus=${(ev: FocusEvent) => showSparklineTooltip(ev, `${dateStr}\n${valStr}`, ctx.setTooltip)}
            @mouseleave=${() => { ctx.setTooltip(null); }}
            @blur=${() => { ctx.setTooltip(null); }} />`;
        })}
      </svg>
      ${ctx.tooltip ? html`
        <div class="sparkline-tooltip" role="tooltip" aria-live="assertive" style="left:${ctx.tooltip.x}px;top:${ctx.tooltip.y}px">
          ${ctx.tooltip.text.split("\n").map((line) => html`<div>${line}</div>`)}
        </div>
      ` : nothing}
    </div>
  `;
}

function showSparklineTooltip(e: MouseEvent | FocusEvent, text: string, setTooltip: SparklineContext["setTooltip"]) {
  const el = e.currentTarget as SVGElement;
  const container = el.closest(".sparkline-container");
  if (!container) return;
  const rect = container.getBoundingClientRect();
  const circle = (el as Element).getBoundingClientRect();
  setTooltip({
    x: circle.left - rect.left + circle.width / 2,
    y: circle.top - rect.top - 8,
    text,
  });
}
