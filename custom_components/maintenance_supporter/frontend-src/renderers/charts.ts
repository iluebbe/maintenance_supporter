/** Cost/duration chart renderers. */

import { html, svg, nothing } from "lit";
import { t } from "../styles";
import type { MaintenanceTask } from "../types";

const COST_CHART_W = 300;
const COST_CHART_H = 200;

export function renderCostDurationCard(
  task: MaintenanceTask,
  lang: string,
  toggle: "cost" | "duration" | "both",
  setToggle: (val: "cost" | "duration" | "both") => void,
) {
  const completedEntries = task.history.filter((h) => h.type === "completed" && (h.cost != null || h.duration != null));
  if (completedEntries.length < 2) return nothing;

  const anyCost = completedEntries.some((h) => (h.cost ?? 0) > 0);
  const anyDuration = completedEntries.some((h) => (h.duration ?? 0) > 0);
  if (!anyCost && !anyDuration) return nothing;

  return html`
    <div class="cost-duration-card">
      <div class="card-header">
        <h3>${t("cost_duration_chart", lang)}</h3>
        <div class="toggle-buttons">
          ${anyCost ? html`<button
            class="toggle-btn ${toggle === 'cost' ? 'active' : ''}"
            @click=${() => setToggle('cost')}>
            ${t("cost", lang)}
          </button>` : nothing}
          ${anyCost && anyDuration ? html`<button
            class="toggle-btn ${toggle === 'both' ? 'active' : ''}"
            @click=${() => setToggle('both')}>
            ${t("both", lang)}
          </button>` : nothing}
          ${anyDuration ? html`<button
            class="toggle-btn ${toggle === 'duration' ? 'active' : ''}"
            @click=${() => setToggle('duration')}>
            ${t("duration", lang)}
          </button>` : nothing}
        </div>
      </div>
      ${renderHistoryChart(task, lang, toggle)}
    </div>
  `;
}

function renderHistoryChart(task: MaintenanceTask, lang: string, toggle: "cost" | "duration" | "both") {
  const entries = task.history
    .filter((h) => h.type === "completed" && (h.cost != null || h.duration != null))
    .map((h) => ({ ts: new Date(h.timestamp).getTime(), cost: h.cost ?? 0, duration: h.duration ?? 0 }))
    .sort((a, b) => a.ts - b.ts);

  if (entries.length < 2) return nothing;

  const dataCost = entries.some((e) => e.cost > 0);
  const dataDuration = entries.some((e) => e.duration > 0);
  if (!dataCost && !dataDuration) return nothing;

  const hasCost = toggle !== "duration" && dataCost;
  const hasDuration = toggle !== "cost" && dataDuration;
  const showCost = hasCost || (!hasDuration && dataCost);
  const showDuration = hasDuration || (!hasCost && dataDuration);

  const W = COST_CHART_W, H = COST_CHART_H;
  const PAD_L = showCost ? 32 : 8;
  const PAD_R = showDuration ? 32 : 8;
  const PAD_T = 8, PAD_B = 20;
  const chartW = W - PAD_L - PAD_R;
  const chartH = H - PAD_T - PAD_B;

  const maxCost = Math.max(...entries.map((e) => e.cost)) || 1;
  const maxDur = Math.max(...entries.map((e) => e.duration)) || 1;
  const barW = Math.min(20, (chartW / entries.length) * 0.6);
  const gap = chartW / entries.length;

  const barX = (i: number) => PAD_L + gap * i + gap / 2;
  const costY = (v: number) => PAD_T + chartH - (v / maxCost) * chartH;
  const durY = (v: number) => PAD_T + chartH - (v / maxDur) * chartH;

  return html`
    <div class="sparkline-container">
      <svg class="history-chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${t("chart_history", lang)}">
        ${showCost ? entries.map((e, i) => svg`
          <rect x="${(barX(i) - barW / 2).toFixed(1)}" y="${costY(e.cost).toFixed(1)}" width="${barW.toFixed(1)}" height="${(PAD_T + chartH - costY(e.cost)).toFixed(1)}"
            fill="var(--primary-color)" opacity="0.6" rx="2" />
        `) : nothing}
        ${showDuration ? svg`
          <polyline points="${entries.map((e, i) => `${barX(i).toFixed(1)},${durY(e.duration).toFixed(1)}`).join(" ")}"
            fill="none" stroke="var(--accent-color, #ff9800)" stroke-width="2" stroke-linejoin="round" />
          ${entries.map((e, i) => svg`
            <circle cx="${barX(i).toFixed(1)}" cy="${durY(e.duration).toFixed(1)}" r="3" fill="var(--accent-color, #ff9800)" />
          `)}
        ` : nothing}
        <text x="${PAD_L}" y="${H - 2}" text-anchor="start" fill="var(--secondary-text-color)" font-size="7">${new Date(entries[0].ts).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</text>
        <text x="${W - PAD_R}" y="${H - 2}" text-anchor="end" fill="var(--secondary-text-color)" font-size="7">${new Date(entries[entries.length - 1].ts).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</text>
        ${showCost ? svg`
          <text x="${PAD_L - 3}" y="${PAD_T + 4}" text-anchor="end" fill="var(--primary-color)" font-size="7">${maxCost.toFixed(0)}\u20AC</text>
          <text x="${PAD_L - 3}" y="${PAD_T + chartH + 3}" text-anchor="end" fill="var(--primary-color)" font-size="7">0\u20AC</text>
        ` : nothing}
        ${showDuration ? svg`
          <text x="${W - PAD_R + 3}" y="${PAD_T + 4}" text-anchor="start" fill="var(--accent-color, #ff9800)" font-size="7">${maxDur.toFixed(0)}m</text>
          <text x="${W - PAD_R + 3}" y="${PAD_T + chartH + 3}" text-anchor="start" fill="var(--accent-color, #ff9800)" font-size="7">0m</text>
        ` : nothing}
      </svg>
    </div>
    <div class="chart-legend">
      ${showCost ? html`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color);opacity:0.6"></span>${t("cost", lang)}</span>` : nothing}
      ${showDuration ? html`<span class="legend-item"><span class="legend-swatch" style="background:var(--accent-color, #ff9800)"></span>${t("duration", lang)}</span>` : nothing}
    </div>
  `;
}
