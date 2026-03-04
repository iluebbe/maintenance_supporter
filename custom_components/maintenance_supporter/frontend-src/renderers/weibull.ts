/** Weibull reliability analysis renderers. */

import { html, svg, nothing } from "lit";
import { t } from "../styles";
import type { MaintenanceTask } from "../types";

export function renderWeibullSection(task: MaintenanceTask, lang: string) {
  const analysis = task.interval_analysis;
  const beta = analysis?.weibull_beta;
  const eta = analysis?.weibull_eta;
  if (beta == null || eta == null) return nothing;

  const currentInterval = task.interval_days ?? 0;
  const rec = task.suggested_interval ?? currentInterval;

  return html`
    <div class="weibull-section">
      <div class="weibull-title">
        <ha-svg-icon aria-hidden="true" path="M3,14L3.5,14.07L8.07,9.5C7.89,8.85 8.06,8.11 8.59,7.59C9.37,6.8 10.63,6.8 11.41,7.59C11.94,8.11 12.11,8.85 11.93,9.5L14.5,12.07L15,12C15.18,12 15.35,12 15.5,12.07L19.07,8.5C19,8.35 19,8.18 19,8A2,2 0 0,1 21,6A2,2 0 0,1 23,8A2,2 0 0,1 21,10C20.82,10 20.65,10 20.5,9.93L16.93,13.5C17,13.65 17,13.82 17,14A2,2 0 0,1 15,16A2,2 0 0,1 13,14L13.07,13.5L10.5,10.93C10.18,11 9.82,11 9.5,10.93L4.93,15.5L5,16A2,2 0 0,1 3,18A2,2 0 0,1 1,16A2,2 0 0,1 3,14Z"></ha-svg-icon>
        ${t("weibull_reliability_curve", lang)}
        ${renderBetaBadge(beta, lang)}
      </div>
      ${renderWeibullChart(beta, eta, currentInterval, rec, lang)}
      ${renderWeibullInfo(analysis!, lang)}
      ${analysis?.confidence_interval_low != null ? renderConfidenceInterval(analysis!, task, lang) : nothing}
    </div>
  `;
}

function renderBetaBadge(beta: number, lang: string) {
  let cls: string;
  let icon: string;
  let key: string;
  if (beta < 0.8) {
    cls = "early_failures";
    icon = "M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z";
    key = "beta_early_failures";
  } else if (beta <= 1.2) {
    cls = "random_failures";
    icon = "M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,17H11V15H13V17M13,13H11V7H13V13Z";
    key = "beta_random_failures";
  } else if (beta <= 3.5) {
    cls = "wear_out";
    icon = "M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12H12V6Z";
    key = "beta_wear_out";
  } else {
    cls = "highly_predictable";
    icon = "M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z";
    key = "beta_highly_predictable";
  }
  return html`
    <span class="beta-badge ${cls}">
      <ha-svg-icon path="${icon}"></ha-svg-icon>
      ${t(key, lang)} (\u03B2=${beta.toFixed(2)})
    </span>
  `;
}

function renderWeibullChart(beta: number, eta: number, currentInterval: number, recommended: number, lang: string) {
  const W = 300, H = 160;
  const PAD_L = 32, PAD_R = 8, PAD_T = 8, PAD_B = 24;
  const chartW = W - PAD_L - PAD_R;
  const chartH = H - PAD_T - PAD_B;

  const maxT = Math.max(currentInterval, recommended, eta, 1) * 1.3;
  const N = 50;

  const points: Array<[number, number]> = [];
  for (let i = 0; i <= N; i++) {
    const t_val = (i / N) * maxT;
    const cdf = 1.0 - Math.exp(-Math.pow(t_val / eta, beta));
    const x = PAD_L + (t_val / maxT) * chartW;
    const y = PAD_T + chartH - cdf * chartH;
    points.push([x, y]);
  }

  const polyline = points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const areaPath = `M${PAD_L},${PAD_T + chartH} ` +
    points.map(([x, y]) => `L${x.toFixed(1)},${y.toFixed(1)}`).join(" ") +
    ` L${points[N][0].toFixed(1)},${PAD_T + chartH} Z`;

  const curX = PAD_L + (currentInterval / maxT) * chartW;
  const curCdf = 1.0 - Math.exp(-Math.pow(currentInterval / eta, beta));
  const curY = PAD_T + chartH - curCdf * chartH;
  const reliability = ((1.0 - curCdf) * 100).toFixed(0);

  const recX = PAD_L + (recommended / maxT) * chartW;
  const yTicks = [0, 0.25, 0.5, 0.75, 1.0];

  return html`
    <div class="weibull-chart">
      <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${t("chart_weibull", lang)}">
        ${yTicks.map(tick => {
          const y = PAD_T + chartH - tick * chartH;
          return svg`
            <line x1="${PAD_L}" y1="${y.toFixed(1)}" x2="${W - PAD_R}" y2="${y.toFixed(1)}"
              stroke="var(--divider-color)" stroke-width="0.5" ${tick === 0.5 ? 'stroke-dasharray="4,3"' : ""} />
            <text x="${PAD_L - 4}" y="${(y + 3).toFixed(1)}" fill="var(--secondary-text-color)"
              font-size="8" text-anchor="end">${(tick * 100).toFixed(0)}%</text>
          `;
        })}

        <text x="${PAD_L}" y="${H - 4}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">0</text>
        <text x="${(PAD_L + W - PAD_R) / 2}" y="${H - 4}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(maxT / 2)}</text>
        <text x="${W - PAD_R}" y="${H - 4}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(maxT)}</text>

        <path d="${areaPath}" fill="var(--primary-color, #03a9f4)" opacity="0.08" />
        <polyline points="${polyline}" fill="none"
          stroke="var(--primary-color, #03a9f4)" stroke-width="2" />

        ${currentInterval > 0 ? svg`
          <line x1="${curX.toFixed(1)}" y1="${PAD_T}" x2="${curX.toFixed(1)}" y2="${(PAD_T + chartH).toFixed(1)}"
            stroke="var(--primary-color, #03a9f4)" stroke-width="1.5" stroke-dasharray="4,3" />
          <circle cx="${curX.toFixed(1)}" cy="${curY.toFixed(1)}" r="3"
            fill="var(--primary-color, #03a9f4)" />
          <text x="${(curX + 4).toFixed(1)}" y="${(curY - 6).toFixed(1)}" fill="var(--primary-color, #03a9f4)"
            font-size="9" font-weight="600">R=${reliability}%</text>
        ` : nothing}

        ${recommended > 0 && recommended !== currentInterval ? svg`
          <line x1="${recX.toFixed(1)}" y1="${PAD_T}" x2="${recX.toFixed(1)}" y2="${(PAD_T + chartH).toFixed(1)}"
            stroke="var(--success-color, #4caf50)" stroke-width="1.5" stroke-dasharray="4,3" />
        ` : nothing}

        <line x1="${PAD_L}" y1="${PAD_T}" x2="${PAD_L}" y2="${PAD_T + chartH}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
        <line x1="${PAD_L}" y1="${PAD_T + chartH}" x2="${W - PAD_R}" y2="${PAD_T + chartH}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
      </svg>
    </div>
    <div class="chart-legend">
      <span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4)"></span> ${t("weibull_failure_probability", lang)}</span>
      ${currentInterval > 0 ? html`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4); opacity:0.5"></span> ${t("current_interval_marker", lang)}</span>` : nothing}
      ${recommended > 0 && recommended !== currentInterval ? html`<span class="legend-item"><span class="legend-swatch" style="background:var(--success-color, #4caf50)"></span> ${t("recommended_marker", lang)}</span>` : nothing}
    </div>
  `;
}

function renderWeibullInfo(analysis: NonNullable<MaintenanceTask["interval_analysis"]>, lang: string) {
  return html`
    <div class="weibull-info-row">
      <div class="weibull-info-item">
        <span>${t("characteristic_life", lang)}</span>
        <span class="weibull-info-value">${Math.round(analysis.weibull_eta!)} ${t("days", lang)}</span>
      </div>
      ${analysis.weibull_r_squared != null ? html`
        <div class="weibull-info-item">
          <span>${t("weibull_r_squared", lang)}</span>
          <span class="weibull-info-value">${analysis.weibull_r_squared!.toFixed(3)}</span>
        </div>
      ` : nothing}
    </div>
  `;
}

function renderConfidenceInterval(analysis: NonNullable<MaintenanceTask["interval_analysis"]>, task: MaintenanceTask, lang: string) {
  const low = analysis.confidence_interval_low!;
  const high = analysis.confidence_interval_high!;
  const rec = task.suggested_interval ?? task.interval_days ?? 0;
  const current = task.interval_days ?? 0;

  const barMin = Math.max(0, low - 5);
  const barMax = high + 5;
  const range = barMax - barMin;

  const fillLeft = ((low - barMin) / range) * 100;
  const fillWidth = ((high - low) / range) * 100;
  const recPos = ((rec - barMin) / range) * 100;
  const curPos = current > 0 ? ((current - barMin) / range) * 100 : -1;

  return html`
    <div class="confidence-range">
      <div class="confidence-range-title">
        ${t("confidence_interval", lang)}: ${rec} ${t("days", lang)} (${low}\u2013${high})
      </div>
      <div class="confidence-bar">
        <div class="confidence-fill" style="left:${fillLeft.toFixed(1)}%;width:${fillWidth.toFixed(1)}%"></div>
        ${curPos >= 0 ? html`<div class="confidence-marker current" style="left:${curPos.toFixed(1)}%"></div>` : nothing}
        <div class="confidence-marker recommended" style="left:${recPos.toFixed(1)}%"></div>
      </div>
      <div class="confidence-labels">
        <span class="confidence-text low">${t("confidence_conservative", lang)} (${low}${t("days", lang).charAt(0)})</span>
        <span class="confidence-text high">${t("confidence_aggressive", lang)} (${high}${t("days", lang).charAt(0)})</span>
      </div>
    </div>
  `;
}
