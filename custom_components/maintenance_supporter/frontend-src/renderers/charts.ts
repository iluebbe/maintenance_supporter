/** Cost/duration chart renderers (task detail).
 *
 * Completions are plotted on a true time axis (a completion 8 months ago sits
 * visibly further away than one from last week), with round y-ticks per axis
 * and year-aware date labels once the span crosses years — "Jun 3 '25" cannot
 * be misread as coming after "Feb 21 '26".
 */

import { html, svg, nothing } from "lit";
import { t, formatCost } from "../styles";
import { niceTicks, fmtNum, fmtDateTick, timeTicks, needsYear, px } from "./chart-utils";
import type { MaintenanceTask } from "../types";
import { entrySpend } from "../helpers/parts-cost";

const COST_CHART_H = 200;
const PAD_T = 10;
const PAD_B = 22;

export function renderCostDurationCard(
  task: MaintenanceTask,
  lang: string,
  toggle: "cost" | "duration" | "both",
  setToggle: (val: "cost" | "duration" | "both") => void,
  currencySymbol: string,
) {
  // Cost = what the entry counts (#104: parts booked when used, a purchase
  // moved into stock) — the same number as the totals.
  const completedEntries = task.history.filter((h) => h.type === "completed" && (entrySpend(h) != null || h.duration != null));
  if (completedEntries.length < 2) return nothing;

  // A credit (#200) is a cost too: a bar below the zero line.
  const anyCost = completedEntries.some((h) => (entrySpend(h) ?? 0) !== 0);
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
      ${renderHistoryChart(task, lang, toggle, currencySymbol)}
    </div>
  `;
}

function renderHistoryChart(task: MaintenanceTask, lang: string, toggle: "cost" | "duration" | "both", currencySymbol: string) {
  const entries = task.history
    .filter((h) => h.type === "completed" && (entrySpend(h) != null || h.duration != null))
    .map((h) => ({ ts: new Date(h.timestamp).getTime(), cost: entrySpend(h) ?? 0, duration: h.duration ?? 0 }))
    .sort((a, b) => a.ts - b.ts);

  if (entries.length < 2) return nothing;

  const dataCost = entries.some((e) => e.cost !== 0);
  const anyCredit = entries.some((e) => e.cost < 0);
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

  // The cost axis reaches below zero only for a credit (#200).
  const costMin = Math.min(0, ...entries.map((e) => e.cost));
  const costMax = Math.max(0, ...entries.map((e) => e.cost));
  const costAxis = niceTicks(costMin, costMax > costMin ? costMax : costMin + 1, 3);
  const durAxis = niceTicks(0, Math.max(...entries.map((e) => e.duration)) || 1, 3);
  const costSpan = costAxis.niceMax - costAxis.niceMin || 1;
  const costY = (v: number) => PAD_T + (1 - (v - costAxis.niceMin) / costSpan) * plotH;
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
            <line x1="${PAD_L}" y1="${px(y)}" x2="${W - PAD_R}" y2="${px(y)}" stroke="var(--divider-color)" stroke-width="1" opacity="0.55" />
            <text x="${PAD_L - 6}" y="${px(y + 3.5)}" text-anchor="end" fill="var(--primary-color)" font-size="10.5">${fmtNum(v, lang)}${currencySymbol}</text>`;
        }) : nothing}
        ${showDuration ? durAxis.ticks.map((v) => {
          const y = durY(v);
          if (y < PAD_T - 1 || y > plotB + 1) return nothing;
          return svg`<text x="${W - PAD_R + 6}" y="${px(y + 3.5)}" text-anchor="start" fill="var(--accent-color, #ff9800)" font-size="10.5">${fmtNum(v, lang)}m</text>`;
        }) : nothing}

        ${showCost && costAxis.niceMin < 0 ? svg`
          <line class="cost-zero" x1="${PAD_L}" y1="${px(costY(0))}" x2="${W - PAD_R}" y2="${px(costY(0))}" stroke="var(--secondary-text-color)" stroke-width="1" opacity="0.7" />
        ` : nothing}
        ${showCost ? entries.filter((e) => e.cost !== 0).map((e) => {
          const top = costY(Math.max(e.cost, 0));
          const credit = e.cost < 0;
          return svg`
          <rect class="${credit ? "credit-bar" : "cost-bar"}" x="${px(toX(e.ts) - barW / 2)}" y="${px(top)}" width="${px(barW)}" height="${px(costY(Math.min(e.cost, 0)) - top)}"
            fill="${credit ? "var(--success-color, #43a047)" : "var(--primary-color)"}" opacity="0.6" rx="2">
            <title>${fmtDateTick(e.ts, lang, true)}: ${credit ? `${t("cost_kind_credit", lang)} ` : ""}${formatCost(Math.abs(e.cost), currencySymbol, lang)}${e.duration ? ` · ${e.duration}m` : ""}</title>
          </rect>`;
        }) : nothing}
        ${showDuration ? svg`
          <polyline points="${entries.map((e) => `${px(toX(e.ts))},${px(durY(e.duration))}`).join(" ")}"
            fill="none" stroke="var(--accent-color, #ff9800)" stroke-width="2" stroke-linejoin="round" />
          ${entries.map((e) => svg`
            <circle cx="${px(toX(e.ts))}" cy="${px(durY(e.duration))}" r="3.5" fill="var(--accent-color, #ff9800)">
              <title>${fmtDateTick(e.ts, lang, true)}: ${e.duration}m${e.cost ? ` · ${formatCost(e.cost, currencySymbol, lang)}` : ""}</title>
            </circle>
          `)}
        ` : nothing}

        <line x1="${PAD_L}" y1="${plotB}" x2="${W - PAD_R}" y2="${plotB}" stroke="var(--divider-color)" stroke-width="1" />
        ${xTicks.map((ts, i) => {
          const anchor = i === 0 ? "start" : i === xTicks.length - 1 ? "end" : "middle";
          return svg`<text x="${px(toX(ts))}" y="${H - 6}" text-anchor="${anchor}" fill="var(--secondary-text-color)" font-size="10">${fmtDateTick(ts, lang, withYear)}</text>`;
        })}
      </svg>
    </div>
    <div class="chart-legend">
      ${showCost ? html`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color);opacity:0.6"></span>${t("cost", lang)}</span>` : nothing}
      ${showCost && anyCredit ? html`<span class="legend-item"><span class="legend-swatch" style="background:var(--success-color, #43a047);opacity:0.6"></span>${t("cost_kind_credit", lang)}</span>` : nothing}
      ${showDuration ? html`<span class="legend-item"><span class="legend-swatch" style="background:var(--accent-color, #ff9800)"></span>${t("duration", lang)}</span>` : nothing}
    </div>
  `;
}
