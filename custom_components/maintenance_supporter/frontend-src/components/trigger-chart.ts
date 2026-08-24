/** Responsive sensor-history chart for the task detail view.
 *
 * Replaces the fixed 300x140 sparkline: renders at the card's real pixel
 * width (ResizeObserver), draws round y-ticks with gridlines, shades the
 * danger zone beyond a threshold (with the in-zone line segments in the
 * error color via clip paths), pins a target line for counters, moves
 * completion markers into a calm bottom lane, and offers a crosshair that
 * follows the pointer (works for touch) plus 7d/30d/90d/1y range chips.
 *
 * The component is deliberately dumb: it plots the points and reference
 * lines it is given. All task semantics (delta baselines, cumulative
 * clamping, projections) live in renderers/sparkline.ts.
 */

import { LitElement, html, css, svg, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { t } from "../styles";
import { niceTicks, fmtNum, fmtVal, fmtDateTick, fmtDateTime, timeTicks, needsYear } from "../renderers/chart-utils";

export interface ChartPoint {
  ts: number;
  val: number;
  min?: number;
  max?: number;
}

export interface ChartEvent {
  ts: number;
  type: string; // completed | skipped | reset
}

const H = 210;
const PAD_L = 46;
const PAD_R = 14;
const PAD_T = 12;
const LANE_H = 14; // completion-marker lane between plot and x labels
const PAD_B = 20 + LANE_H;

const RANGES = [
  { days: 7, key: "chart_range_7d" },
  { days: 30, key: "chart_range_30d" },
  { days: 90, key: "chart_range_90d" },
  { days: 365, key: "chart_range_1y" },
] as const;

export class MaintenanceTriggerChart extends LitElement {
  @property({ attribute: false }) public points: ChartPoint[] = [];
  @property({ attribute: false }) public events: ChartEvent[] = [];
  @property() public unit = "";
  @property() public lang = "en";
  @property({ attribute: false }) public thresholdAbove: number | null = null;
  @property({ attribute: false }) public thresholdBelow: number | null = null;
  /** Absolute y of a counter target line (points are pre-transformed). */
  @property({ attribute: false }) public targetValue: number | null = null;
  @property({ type: Boolean }) public forceZero = false;
  /** Optional dashed projection segment (e.g. degradation trend). */
  @property({ attribute: false }) public projection: ChartPoint[] | null = null;
  @property({ attribute: false }) public rangeDays = 30;
  @property({ type: Boolean }) public showRange = true;
  @property({ type: Boolean }) public busy = false;
  /** Reflects the parent's "hide outliers" state (filtering happens upstream). */
  @property({ type: Boolean }) public hideOutliers = false;
  /** Show the outlier toggle chip (only where a raw oscillating series exists). */
  @property({ type: Boolean }) public showOutlierToggle = true;

  @state() private _width = 0;
  @state() private _hover: { x: number; y: number; p: ChartPoint } | null = null;

  private _ro: ResizeObserver | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    this._ro = new ResizeObserver((entries) => {
      const w = Math.floor(entries[0]?.contentRect?.width || 0);
      if (w && Math.abs(w - this._width) > 2) this._width = w;
    });
    this._ro.observe(this);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._ro?.disconnect();
    this._ro = null;
  }

  private _emitRange(days: number): void {
    if (days === this.rangeDays) return;
    this.dispatchEvent(new CustomEvent("range-change", { detail: { days }, bubbles: true, composed: true }));
  }

  private _toggleOutliers(): void {
    this.dispatchEvent(new CustomEvent("outlier-toggle", {
      detail: { hide: !this.hideOutliers }, bubbles: true, composed: true,
    }));
  }

  render() {
    const W = this._width || 320;
    const pts = [...this.points].sort((a, b) => a.ts - b.ts);
    const L = this.lang;

    return html`
      <div class="chart-wrap">
        ${this.showRange
          ? html`<div class="range-chips" role="group">
              ${this.showOutlierToggle
                ? html`<button
                    class="range-chip outlier-chip ${this.hideOutliers ? "active" : ""}"
                    ?disabled=${this.busy}
                    title=${t("hide_outliers", L)}
                    @click=${() => this._toggleOutliers()}
                  ><ha-icon icon="mdi:filter-variant"></ha-icon></button>`
                : nothing}
              ${RANGES.map(
                (r) => html`<button
                  class="range-chip ${this.rangeDays === r.days ? "active" : ""}"
                  ?disabled=${this.busy}
                  @click=${() => this._emitRange(r.days)}
                >${t(r.key, L)}</button>`,
              )}
            </div>`
          : nothing}
        ${pts.length < 2
          ? html`<div class="chart-empty">
              <ha-icon icon="mdi:chart-line"></ha-icon> ${t("loading_chart", L)}
            </div>`
          : this._renderSvg(W, pts)}
      </div>
    `;
  }

  private _renderSvg(W: number, pts: ChartPoint[]) {
    const L = this.lang;
    const plotW = W - PAD_L - PAD_R;
    const plotB = H - PAD_B;
    const plotH = plotB - PAD_T;

    // Domain: data ∪ min/max band ∪ reference lines ∪ optional zero floor.
    let lo = Infinity;
    let hi = -Infinity;
    for (const p of pts) {
      lo = Math.min(lo, p.min ?? p.val);
      hi = Math.max(hi, p.max ?? p.val);
    }
    if (this.thresholdAbove != null) { lo = Math.min(lo, this.thresholdAbove); hi = Math.max(hi, this.thresholdAbove); }
    if (this.thresholdBelow != null) { lo = Math.min(lo, this.thresholdBelow); hi = Math.max(hi, this.thresholdBelow); }
    if (this.targetValue != null) { lo = Math.min(lo, this.targetValue); hi = Math.max(hi, this.targetValue); }
    if (this.forceZero) lo = Math.min(lo, 0);
    const pad = (hi - lo || 1) * 0.06;
    // A progress axis never dips below zero — padding must not create a -50 tick.
    const loPadded = this.forceZero && lo >= 0 ? 0 : lo - pad;
    let { ticks, niceMin, niceMax } = niceTicks(loPadded, hi + pad, 4);
    if (this.forceZero && lo >= 0 && niceMin < 0) {
      niceMin = 0;
      ticks = ticks.filter((v) => v >= 0);
    }

    const tsMin = pts[0].ts;
    // The dashed projection extends the TIME domain. sparkline.ts builds it
    // as [last sample, last sample + 30 d]; with a data-only domain its
    // start sat exactly on the right plot edge and the x2 clamp below
    // collapsed the line to zero width — the production degradation
    // projection never rendered (found via the design-system previews,
    // 2026-08-24).
    const projEnd = this.projection && this.projection.length === 2 ? this.projection[1].ts : null;
    const tsMax = projEnd != null ? Math.max(pts[pts.length - 1].ts, projEnd) : pts[pts.length - 1].ts;
    const tsSpan = tsMax - tsMin || 1;
    const withYear = needsYear(tsMin, tsMax);

    const toX = (ts: number) => PAD_L + ((ts - tsMin) / tsSpan) * plotW;
    const toY = (v: number) => PAD_T + (1 - (v - niceMin) / (niceMax - niceMin || 1)) * plotH;

    const linePts = pts.map((p) => `${toX(p.ts).toFixed(1)},${toY(p.val).toFixed(1)}`).join(" ");
    const areaPath =
      `M${toX(pts[0].ts).toFixed(1)},${plotB} ` +
      pts.map((p) => `L${toX(p.ts).toFixed(1)},${toY(p.val).toFixed(1)}`).join(" ") +
      ` L${toX(pts[pts.length - 1].ts).toFixed(1)},${plotB} Z`;

    // Optional min/max band behind the line.
    let bandPath = "";
    const band = pts.filter((p) => p.min != null && p.max != null);
    if (band.length >= 2) {
      const up = band.map((p) => `${toX(p.ts).toFixed(1)},${toY(p.max!).toFixed(1)}`);
      const dn = [...band].reverse().map((p) => `${toX(p.ts).toFixed(1)},${toY(p.min!).toFixed(1)}`);
      bandPath = `M${up[0]} ` + up.slice(1).map((x) => `L${x}`).join(" ") + ` L${dn.join(" L")} Z`;
    }

    // Danger zones: rect (shading + line-color clip), the threshold line y,
    // and where its label sits (just inside the zone).
    const zones: { y: number; h: number; lineY: number; label: string; labelY: number }[] = [];
    if (this.thresholdBelow != null) {
      const zy = toY(this.thresholdBelow);
      zones.push({ y: zy, h: Math.max(0, plotB - zy), lineY: zy, label: `▼ ${fmtNum(this.thresholdBelow)}`, labelY: Math.min(plotB - 4, zy + 13) });
    }
    if (this.thresholdAbove != null) {
      const zy = toY(this.thresholdAbove);
      zones.push({ y: PAD_T, h: Math.max(0, zy - PAD_T), lineY: zy, label: `▲ ${fmtNum(this.thresholdAbove)}`, labelY: Math.max(PAD_T + 11, zy - 5) });
    }

    const lastP = pts[pts.length - 1];
    const events = (this.events || []).filter((e) => e.ts >= tsMin && e.ts <= tsMax);
    const xTicks = timeTicks(tsMin, tsMax, Math.max(2, Math.min(5, Math.floor(plotW / 110) + 1)));
    const hover = this._hover;

    return html`
      <div class="svg-holder">
        <svg
          class="chart-svg"
          viewBox="0 0 ${W} ${H}"
          width=${W}
          height=${H}
          role="img"
          aria-label=${t("chart_sparkline", L)}
          @pointermove=${(e: PointerEvent) => this._onPointer(e, pts, toX, toY, W)}
          @pointerdown=${(e: PointerEvent) => this._onPointer(e, pts, toX, toY, W)}
          @pointerleave=${() => (this._hover = null)}
        >
          <defs>
            <clipPath id="plot"><rect x="${PAD_L}" y="${PAD_T}" width="${plotW}" height="${plotH}" /></clipPath>
            ${zones.length
              ? svg`<clipPath id="danger">${zones.map((z) => svg`<rect x="${PAD_L}" y="${z.y.toFixed(1)}" width="${plotW}" height="${z.h.toFixed(1)}" />`)}</clipPath>`
              : nothing}
            <!-- Diagonal hatch so the danger zone reads without relying on the
                 red tint alone (dark-theme contrast + colour-blind support). -->
            <pattern id="dangerHatch" patternUnits="userSpaceOnUse" width="7" height="7" patternTransform="rotate(45)">
              <rect width="7" height="7" fill="var(--error-color, #f44336)" opacity="0.10" />
              <line x1="0" y1="0" x2="0" y2="7" stroke="var(--error-color, #f44336)" stroke-width="1.4" opacity="0.5" />
            </pattern>
          </defs>

          ${ticks.map((v) => {
            const y = toY(v);
            if (y < PAD_T - 1 || y > plotB + 1) return nothing;
            return svg`
              <line x1="${PAD_L}" y1="${y.toFixed(1)}" x2="${W - PAD_R}" y2="${y.toFixed(1)}"
                stroke="var(--divider-color)" stroke-width="1" opacity="0.6" />
              <text x="${PAD_L - 7}" y="${(y + 3.5).toFixed(1)}" text-anchor="end" class="tick-label">${fmtNum(v)}</text>`;
          })}

          ${zones.map(
            (z) => svg`<rect x="${PAD_L}" y="${z.y.toFixed(1)}" width="${plotW}" height="${z.h.toFixed(1)}"
              fill="url(#dangerHatch)" />`,
          )}

          ${bandPath ? svg`<path d="${bandPath}" fill="var(--primary-color)" opacity="0.08" clip-path="url(#plot)" />` : nothing}
          <path d="${areaPath}" fill="var(--primary-color)" opacity="0.10" clip-path="url(#plot)" />
          <polyline points="${linePts}" fill="none" stroke="var(--primary-color)" stroke-width="2"
            stroke-linejoin="round" stroke-linecap="round" clip-path="url(#plot)" />
          ${zones.length
            ? svg`<polyline points="${linePts}" fill="none" stroke="var(--error-color, #f44336)" stroke-width="2"
                stroke-linejoin="round" stroke-linecap="round" clip-path="url(#danger)" />`
            : nothing}

          ${zones.map(
            (z) => svg`
              <line x1="${PAD_L}" y1="${z.lineY.toFixed(1)}" x2="${W - PAD_R}" y2="${z.lineY.toFixed(1)}"
                stroke="var(--error-color, #f44336)" stroke-width="1.5" stroke-dasharray="6,4" />
              <text x="${W - PAD_R - 4}" y="${z.labelY.toFixed(1)}" text-anchor="end" class="zone-label">${z.label}</text>`,
          )}

          ${this.targetValue != null
            ? svg`<line x1="${PAD_L}" y1="${toY(this.targetValue).toFixed(1)}" x2="${W - PAD_R}" y2="${toY(this.targetValue).toFixed(1)}"
                stroke="var(--error-color, #f44336)" stroke-width="1.5" stroke-dasharray="6,4" />
              <text x="${W - PAD_R - 4}" y="${(toY(this.targetValue) - 5).toFixed(1)}" text-anchor="end" class="zone-label">◆ ${fmtNum(this.targetValue)} ${this.unit}</text>`
            : nothing}

          ${this.projection && this.projection.length === 2
            ? svg`<line x1="${toX(this.projection[0].ts).toFixed(1)}" y1="${toY(this.projection[0].val).toFixed(1)}"
                x2="${Math.min(toX(this.projection[1].ts), W - PAD_R).toFixed(1)}" y2="${toY(Math.max(niceMin, Math.min(niceMax, this.projection[1].val))).toFixed(1)}"
                stroke="var(--warning-color, #ff9800)" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.8" />`
            : nothing}

          ${xTicks.map((ts, i) => {
            const x = toX(ts);
            const anchor = i === 0 ? "start" : i === xTicks.length - 1 ? "end" : "middle";
            return svg`<text x="${x.toFixed(1)}" y="${H - 5}" text-anchor="${anchor}" class="tick-label">${fmtDateTick(ts, L, withYear)}</text>`;
          })}

          <line x1="${PAD_L}" y1="${plotB}" x2="${W - PAD_R}" y2="${plotB}" stroke="var(--divider-color)" stroke-width="1" />

          ${events.map((e) => {
            const x = toX(e.ts);
            const color =
              e.type === "completed"
                ? "var(--success-color, #4caf50)"
                : e.type === "skipped"
                  ? "var(--warning-color, #ff9800)"
                  : "var(--info-color, #2196f3)";
            return svg`
              <line x1="${x.toFixed(1)}" y1="${PAD_T}" x2="${x.toFixed(1)}" y2="${plotB}" stroke="${color}" stroke-width="1" opacity="0.14" />
              <rect x="${(x - 1.5).toFixed(1)}" y="${plotB + 3}" width="3" height="${LANE_H - 6}" rx="1.5" fill="${color}">
                <title>${fmtDateTime(e.ts, L)}</title>
              </rect>`;
          })}

          ${hover
            ? svg`
                <line x1="${hover.x.toFixed(1)}" y1="${PAD_T}" x2="${hover.x.toFixed(1)}" y2="${plotB}"
                  stroke="var(--secondary-text-color)" stroke-width="1" stroke-dasharray="3,3" opacity="0.7" />
                <circle cx="${hover.x.toFixed(1)}" cy="${hover.y.toFixed(1)}" r="4.5" fill="var(--primary-color)"
                  stroke="var(--card-background-color, #fff)" stroke-width="2" />`
            : svg`<circle cx="${toX(lastP.ts).toFixed(1)}" cy="${toY(lastP.val).toFixed(1)}" r="4" fill="var(--primary-color)"
                stroke="var(--card-background-color, #fff)" stroke-width="1.5" />`}
        </svg>
        ${hover
          ? html`<div
              class="hover-chip"
              style="left:${Math.min(Math.max(hover.x, 70), W - 70)}px"
            >
              <div class="hover-date">${fmtDateTime(hover.p.ts, L)}</div>
              <div class="hover-val">
                ${fmtVal(hover.p.val, this.unit, L)}
                ${hover.p.min != null && hover.p.max != null
                  ? html`<span class="hover-range">(${fmtNum(hover.p.min)}–${fmtNum(hover.p.max)})</span>`
                  : nothing}
              </div>
            </div>`
          : nothing}
      </div>
    `;
  }

  private _onPointer(
    e: PointerEvent,
    pts: ChartPoint[],
    toX: (ts: number) => number,
    toY: (v: number) => number,
    W: number,
  ): void {
    const svgEl = e.currentTarget as SVGSVGElement;
    const rect = svgEl.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    if (px < PAD_L - 8 || px > W - PAD_R + 8) {
      this._hover = null;
      return;
    }
    let best = pts[0];
    let bestD = Infinity;
    for (const p of pts) {
      const d = Math.abs(toX(p.ts) - px);
      if (d < bestD) {
        bestD = d;
        best = p;
      }
    }
    this._hover = { x: toX(best.ts), y: toY(best.val), p: best };
  }

  static styles = css`
    :host { display: block; width: 100%; }
    .chart-wrap { position: relative; }
    .range-chips { display: flex; gap: 4px; justify-content: flex-end; margin-bottom: 2px; }
    .range-chip {
      font: inherit; font-size: 11.5px; padding: 2px 9px; border-radius: 12px; cursor: pointer;
      border: 1px solid var(--divider-color); background: transparent;
      color: var(--secondary-text-color);
    }
    /* Outlier toggle sits left of the range chips as an icon button. */
    .outlier-chip { margin-right: auto; padding: 2px 7px; display: inline-flex; align-items: center; }
    .outlier-chip ha-icon { --mdc-icon-size: 15px; }
    .range-chip.active {
      background: var(--primary-color); border-color: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .range-chip[disabled] { opacity: 0.5; pointer-events: none; }
    .svg-holder { position: relative; }
    .chart-svg { display: block; touch-action: pan-y; }
    .tick-label { fill: var(--secondary-text-color); font-size: 10.5px; }
    .zone-label { fill: var(--error-color, #f44336); font-size: 11px; font-weight: 600; }
    .chart-empty {
      display: flex; align-items: center; justify-content: center; gap: 8px; height: 120px;
      color: var(--secondary-text-color); font-size: 12.5px;
    }
    .chart-empty ha-icon { --mdc-icon-size: 17px; }
    .hover-chip {
      position: absolute; top: 0; transform: translateX(-50%);
      background: var(--card-background-color, #fff); border: 1px solid var(--divider-color);
      border-radius: 8px; padding: 4px 9px; pointer-events: none; white-space: nowrap;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); z-index: 3;
    }
    .hover-date { font-size: 10.5px; color: var(--secondary-text-color); }
    .hover-val { font-size: 12.5px; font-weight: 600; color: var(--primary-text-color); }
    .hover-range { font-weight: 400; color: var(--secondary-text-color); font-size: 11px; }
  `;
}

if (!customElements.get("maintenance-trigger-chart")) {
  customElements.define("maintenance-trigger-chart", MaintenanceTriggerChart);
}
