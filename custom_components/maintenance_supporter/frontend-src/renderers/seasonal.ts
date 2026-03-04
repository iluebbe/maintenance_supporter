/** Seasonal factor chart renderers. */

import { html, svg, nothing } from "lit";
import { t } from "../styles";
import type { MaintenanceTask, AdvancedFeatures } from "../types";

const MONTH_KEYS = [
  "month_jan", "month_feb", "month_mar", "month_apr",
  "month_may", "month_jun", "month_jul", "month_aug",
  "month_sep", "month_oct", "month_nov", "month_dec",
];

export function renderSeasonalCardCompact(task: MaintenanceTask, lang: string, features: AdvancedFeatures) {
  if (!features.seasonal || !task.seasonal_factor || task.seasonal_factor === 1.0) {
    return nothing;
  }

  const months = MONTH_KEYS.map(k => t(k, lang));
  const currentMonth = new Date().getMonth();

  const realFactors = task.seasonal_factors || task.interval_analysis?.seasonal_factors || null;
  const seasonalData = realFactors && realFactors.length === 12
    ? realFactors
    : months.map((_, i) => {
        const base = task.seasonal_factor || 1.0;
        const variation = Math.sin((i - 6) * Math.PI / 6) * 0.3;
        return Math.max(0.7, Math.min(1.3, base + variation));
      });

  return html`
    <div class="seasonal-card-compact">
      <h4>${t("seasonal_awareness", lang)}</h4>
      <div class="seasonal-mini-chart">
        ${seasonalData.map((factor, i) => {
          const height = factor * 40;
          const colorClass = factor < 0.9 ? 'low' : factor > 1.1 ? 'high' : 'normal';
          const isCurrentMonth = i === currentMonth;
          return html`
            <div class="seasonal-bar ${colorClass} ${isCurrentMonth ? 'current' : ''}"
                 style="height: ${height}px"
                 title="${months[i]}: ${factor.toFixed(2)}x">
            </div>
          `;
        })}
      </div>
      <div class="seasonal-legend">
        <span class="legend-item"><span class="dot low"></span> ${t("shorter", lang) || "Kürzer"}</span>
        <span class="legend-item"><span class="dot normal"></span> ${t("normal", lang) || "Normal"}</span>
        <span class="legend-item"><span class="dot high"></span> ${t("longer", lang) || "Länger"}</span>
      </div>
    </div>
  `;
}

export function renderSeasonalCardExpanded(task: MaintenanceTask, lang: string) {
  return renderSeasonalChart(task, lang);
}

export function renderSeasonalChart(task: MaintenanceTask, lang: string) {
  const factors = task.seasonal_factors
    ?? task.interval_analysis?.seasonal_factors;
  if (!factors || factors.length !== 12) return nothing;

  const reason = task.interval_analysis?.seasonal_reason;
  const currentMonth = new Date().getMonth();
  const W = 300, H = 100;
  const PAD_T = 8, PAD_B = 4;
  const chartH = H - PAD_T - PAD_B;
  const maxFactor = Math.max(...factors, 1.5);
  const barW = W / 12;
  const barInner = barW * 0.65;
  const baselineY = PAD_T + chartH - (1.0 / maxFactor) * chartH;

  return html`
    <div class="seasonal-chart">
      <div class="seasonal-chart-title">
        <ha-svg-icon aria-hidden="true" path="M17.75 4.09L15.22 6.03L16.13 9.09L13.5 7.28L10.87 9.09L11.78 6.03L9.25 4.09L12.44 4L13.5 1L14.56 4L17.75 4.09M21.25 11L19.61 12.25L20.2 14.23L18.5 13.06L16.8 14.23L17.39 12.25L15.75 11L17.81 10.95L18.5 9L19.19 10.95L21.25 11M18.97 15.95C19.8 15.87 20.69 17.05 20.16 17.8C19.84 18.25 19.5 18.67 19.08 19.07C15.17 23 8.84 23 4.94 19.07C1.03 15.17 1.03 8.83 4.94 4.93C5.34 4.53 5.76 4.17 6.21 3.85C6.96 3.32 8.14 4.21 8.06 5.04C7.79 7.9 8.75 10.87 10.95 13.06C13.14 15.26 16.1 16.22 18.97 15.95Z"></ha-svg-icon>
        ${t("seasonal_chart_title", lang)}
        ${reason ? html`<span class="source-tag">${reason === "learned" ? t("seasonal_learned", lang) : t("seasonal_manual", lang)}</span>` : nothing}
      </div>
      <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${t("chart_seasonal", lang)}">
        <line x1="0" y1="${baselineY.toFixed(1)}" x2="${W}" y2="${baselineY.toFixed(1)}"
          stroke="var(--divider-color)" stroke-width="1" stroke-dasharray="4,3" />
        ${factors.map((f, i) => {
          const barH = (f / maxFactor) * chartH;
          const x = i * barW + (barW - barInner) / 2;
          const y = PAD_T + chartH - barH;
          const isCurrent = i === currentMonth;
          const color = f < 1.0
            ? "var(--success-color, #4caf50)"
            : f > 1.0
              ? "var(--warning-color, #ff9800)"
              : "var(--secondary-text-color)";
          return svg`
            <rect x="${x.toFixed(1)}" y="${y.toFixed(1)}"
              width="${barInner.toFixed(1)}" height="${barH.toFixed(1)}"
              fill="${color}" opacity="${isCurrent ? 1 : 0.5}" rx="2" />
          `;
        })}
      </svg>
      <div class="seasonal-labels">
        ${MONTH_KEYS.map((key, i) =>
          html`<span class="seasonal-label ${i === currentMonth ? "active-month" : ""}">${t(key, lang)}</span>`
        )}
      </div>
    </div>
  `;
}
