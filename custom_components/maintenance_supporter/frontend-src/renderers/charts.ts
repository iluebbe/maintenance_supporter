/** Cost/duration chart renderers (task detail).
 *
 * Completions are plotted on a true time axis (a completion 8 months ago sits
 * visibly further away than one from last week), with round y-ticks per axis
 * and year-aware date labels once the span crosses years — "Jun 3 '25" cannot
 * be misread as coming after "Feb 21 '26".
 */

import { html, svg, nothing } from "lit";
import { t } from "../styles";
import { niceTicks, fmtNum, fmtDateTick, timeTicks, needsYear } from "./chart-utils";
import type { MaintenanceTask } from "../types";

const COST_CHART_H = 200;
const PAD_T = 10;
const PAD_B = 22;

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

  const W = 640; // wide viewBox; the container scales it to full card width
  const H = COST_CHART_H;
  const PAD_L = showCost ? 44 : 12;
  const PAD_R = showDuration ? 44 : 12;
  const plotW = W - PAD_L - PAD_R;
  const plotB = H - PAD_B;
  const plotH = plotB - PAD_T;

  // True time axis with a padded domain so edge bars don't clip.
  const tsMin = entries[0].ts;
  const tsMax = entries[entries.length - 1].ts;
  const tsPad = (tsMax - tsMin || 86400000) * 0.05;
  const t0 = tsMin - tsPad;
  const t1 = tsMax + tsPad;
  const withYear = needsYear(tsMin, tsMax);
  const toX = (ts: number) => PAD_L + ((ts - t0) / (t1 - t0)) * plotW;

  const costAxis = niceTicks(0, Math.max(...entries.map((e) => e.cost)) || 1, 3);
  const durAxis = niceTicks(0, Math.max(...entries.map((e) => e.duration)) || 1, 3);
  const costY = (v: number) => PAD_T + (1 - v / (costAxis.niceMax || 1)) * plotH;
  const durY = (v: number) => PAD_T + (1 - v / (durAxis.niceMax || 1)) * plotH;

  // Bars keep a readable width even when completions crowd together.
  const minGap = entries.length > 1
    ? Math.min(...entries.slice(1).map((e, i) => toX(e.ts) - toX(entries[i].ts)))
    : plotW;
  const barW = Math.max(6, Math.min(22, minGap * 0.55));

  const xTicks = timeTicks(tsMin, tsMax, Math.max(2, Math.min(4, entries.length)));

  return html`
    <div class="sparkline-container">
      <svg class="history-chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${t("chart_history", lang)}">
        ${showCost ? costAxis.ticks.map((v) => {
          const y = costY(v);
          if (y < PAD_T - 1 || y > plotB + 1) return nothing;
          return svg`
            <line x1="${PAD_L}" y1="${y.toFixed(1)}" x2="${W - PAD_R}" y2="${y.toFixed(1)}" stroke="var(--divider-color)" stroke-width="1" opacity="0.55" />
            <text x="${PAD_L - 6}" y="${(y + 3.5).toFixed(1)}" text-anchor="end" fill="var(--primary-color)" font-size="10.5">${fmtNum(v)}€</text>`;
        }) : nothing}
        ${showDuration ? durAxis.ticks.map((v) => {
          const y = durY(v);
          if (y < PAD_T - 1 || y > plotB + 1) return nothing;
          return svg`<text x="${W - PAD_R + 6}" y="${(y + 3.5).toFixed(1)}" text-anchor="start" fill="var(--accent-color, #ff9800)" font-size="10.5">${fmtNum(v)}m</text>`;
        }) : nothing}

        ${showCost ? entries.filter((e) => e.cost > 0).map((e) => svg`
          <rect x="${(toX(e.ts) - barW / 2).toFixed(1)}" y="${costY(e.cost).toFixed(1)}" width="${barW.toFixed(1)}" height="${(plotB - costY(e.cost)).toFixed(1)}"
            fill="var(--primary-color)" opacity="0.6" rx="2">
            <title>${fmtDateTick(e.ts, lang, true)}: ${e.cost.toLocaleString(lang)}€${e.duration ? ` · ${e.duration}m` : ""}</title>
          </rect>
        `) : nothing}
        ${showDuration ? svg`
          <polyline points="${entries.map((e) => `${toX(e.ts).toFixed(1)},${durY(e.duration).toFixed(1)}`).join(" ")}"
            fill="none" stroke="var(--accent-color, #ff9800)" stroke-width="2" stroke-linejoin="round" />
          ${entries.map((e) => svg`
            <circle cx="${toX(e.ts).toFixed(1)}" cy="${durY(e.duration).toFixed(1)}" r="3.5" fill="var(--accent-color, #ff9800)">
              <title>${fmtDateTick(e.ts, lang, true)}: ${e.duration}m${e.cost ? ` · ${e.cost.toLocaleString(lang)}€` : ""}</title>
            </circle>
          `)}
        ` : nothing}

        <line x1="${PAD_L}" y1="${plotB}" x2="${W - PAD_R}" y2="${plotB}" stroke="var(--divider-color)" stroke-width="1" />
        ${xTicks.map((ts, i) => {
          const anchor = i === 0 ? "start" : i === xTicks.length - 1 ? "end" : "middle";
          return svg`<text x="${toX(ts).toFixed(1)}" y="${H - 6}" text-anchor="${anchor}" fill="var(--secondary-text-color)" font-size="10">${fmtDateTick(ts, lang, withYear)}</text>`;
        })}
      </svg>
    </div>
    <div class="chart-legend">
      ${showCost ? html`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color);opacity:0.6"></span>${t("cost", lang)}</span>` : nothing}
      ${showDuration ? html`<span class="legend-item"><span class="legend-swatch" style="background:var(--accent-color, #ff9800)"></span>${t("duration", lang)}</span>` : nothing}
    </div>
  `;
}
