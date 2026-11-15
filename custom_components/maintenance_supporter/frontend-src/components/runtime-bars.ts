/** A runtime rule's chart: the hours its device ran per day, as bars, with
 *  the services marked, the mean per day and when the target comes at that
 *  pace (helpers/runtime-days.ts). Loads the device's states itself, like
 *  the state timeline; the range chips are the chart's. */

import { LitElement, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { formatDate, t } from "../styles";
import { fmtDateTick, fmtVal, niceTicks, rangeAddsNothing } from "../renderers/chart-utils";
import { spanText } from "../helpers/span-text";
import { stampMs } from "../helpers/ha-time";
import { firstStamp, withLiveState, type RecordedState } from "../helpers/state-timeline";
import { hoursPerBucket, runtimeIntervals, untilTarget } from "../helpers/runtime-days";
import type { HistoryEntry, HomeAssistant } from "../types";

const DAY = 86_400_000;
const RANGES = [
  { days: 7, key: "chart_range_7d" },
  { days: 30, key: "chart_range_30d" },
  { days: 90, key: "chart_range_90d" },
  { days: 365, key: "chart_range_1y" },
] as const;
const CHIP_DAYS = RANGES.map((r) => r.days);

function fill(text: string, values: Record<string, string>): string {
  return Object.entries(values).reduce((s, [k, v]) => s.split(`{${k}}`).join(v), text);
}

export class MaintenanceRuntimeBars extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property() public entityId = "";
  /** The states that count as running (the rule's list, else on/1/true). */
  @property({ attribute: false }) public onStates: string[] | null = null;
  /** #149: a run books at most this many seconds. */
  @property({ attribute: false }) public capSeconds: number | null = null;
  @property({ attribute: false }) public rangeDays = 30;
  @property() public lang = "en";
  @property({ attribute: false }) public history: readonly HistoryEntry[] = [];
  /** Hours since the last service and the target: when it comes. */
  @property({ attribute: false }) public current: number | null = null;
  @property({ attribute: false }) public target: number | null = null;
  @property() public revision = "";

  @state() private _rows: RecordedState[] | null = null;
  private _now = 0;
  private _loadedFor = "";

  protected updated(): void {
    const key = `${this.entityId}|${this.rangeDays}|${this.revision}`;
    if (this.hass && this.entityId && key !== this._loadedFor) {
      this._loadedFor = key;
      void this._load(key);
    }
  }

  private async _load(key: string): Promise<void> {
    const now = Date.now();
    let rows: RecordedState[] = [];
    try {
      const res = await this.hass!.connection.sendMessagePromise<Record<string, RecordedState[]>>({
        type: "history/history_during_period",
        start_time: new Date(now - this.rangeDays * DAY).toISOString(),
        end_time: new Date(now).toISOString(),
        entity_ids: [this.entityId],
        minimal_response: true,
        no_attributes: true,
        significant_changes_only: false,
      });
      rows = res?.[this.entityId] ?? [];
    } catch {
      rows = [];
    }
    if (key !== this._loadedFor) return;
    this._now = now;
    this._rows = rows;
  }

  private _emitRange(days: number): void {
    if (days === this.rangeDays) return;
    this.dispatchEvent(new CustomEvent("range-change", { detail: { days }, bubbles: true, composed: true }));
  }

  protected render(): unknown {
    const L = this.lang;
    const loaded = this._rows;
    const t1 = Math.max(Date.now(), this._now);
    const rows = loaded ? withLiveState(loaded, this.hass?.states?.[this.entityId] as { state?: unknown; last_changed?: unknown } | undefined) : null;
    const first = rows ? firstStamp(rows) : NaN;
    // Where the data begin, when the recorder keeps less than the range.
    const dataStart = Number.isFinite(first) && first > t1 - this.rangeDays * DAY + DAY ? first : NaN;
    const chips = html`<div class="range-chips" role="group">
      ${RANGES.map((r) => {
        const same = r.days !== this.rangeDays && rangeAddsNothing(r.days, CHIP_DAYS, Number.isFinite(dataStart) ? dataStart : null, t1);
        return html`<button class="range-chip ${this.rangeDays === r.days ? "active" : ""}" ?disabled=${same}
          title=${same ? fill(t("timeline_range_no_more", L), { date: formatDate(new Date(dataStart).toISOString(), L) }) : ""}
          @click=${() => this._emitRange(r.days)}>${t(r.key, L)}</button>`;
      })}
    </div>`;
    if (!rows) return html`${chips}<div class="rb-note">${t("loading_chart", L)}</div>`;
    if (!Number.isFinite(first)) return html`${chips}<div class="rb-note">${t("timeline_no_data", L)}</div>`;
    const t0 = Math.max(t1 - this.rangeDays * DAY, first);
    const capMs = this.capSeconds && this.capSeconds > 0 ? this.capSeconds * 1000 : null;
    const intervals = runtimeIntervals(rows, this.onStates, t0, t1, capMs);
    const weekly = t1 - t0 > 62 * DAY;
    const buckets = hoursPerBucket(intervals, t0, t1, weekly ? 7 : 1);
    const total = buckets.reduce((s, b) => s + b.hours, 0);
    const perDay = total / Math.max((t1 - t0) / DAY, 1 / 24);
    const max = Math.max(0.5, ...buckets.map((b) => b.hours));
    const { ticks, niceMax } = niceTicks(0, max, 3);
    const top = niceMax || max;
    const services = this.history
      .filter((h) => h.type === "completed" || h.type === "reset")
      .map((h) => stampMs(h.timestamp))
      .filter((at) => Number.isFinite(at) && at >= t0 && at <= t1);
    // A mean and a forecast need a day of states at least: minutes of a
    // new device said "12 days to the target".
    const enough = t1 - t0 >= DAY;
    const until = enough ? untilTarget(this.current, this.target, perDay) : null;
    const label = (i: number) => fmtDateTick(buckets[i].start, L, false);
    const xLabels = buckets.length > 2 ? [0, Math.floor((buckets.length - 1) / 2), buckets.length - 1] : buckets.map((_, i) => i);
    return html`
      ${chips}
      <div class="rb-plot">
        <div class="rb-y">${ticks.slice().reverse().map((v) => html`<span style="bottom:${(v / top) * 100}%">${fmtVal(v, "h", L)}</span>`)}</div>
        <div class="rb-area">
          ${ticks.map((v) => html`<span class="rb-grid" style="bottom:${(v / top) * 100}%"></span>`)}
          <div class="rb-bars">
            ${buckets.map((b) => {
              const done = services.filter((at) => at >= b.start && at < b.end);
              const title = `${weekly ? `${formatDate(b.day, L)} – ${formatDate(new Date(b.end - 1).toISOString(), L)}` : formatDate(b.day, L)}: ${fmtVal(b.hours, "h", L)}`;
              return html`<div class="rb-col" title=${title}>
                <div class="rb-bar ${b.hours > 0 ? "some" : ""}" style="height:${(b.hours / top) * 100}%"></div>
                ${done.length ? html`<span class="rb-service" title=${done.map((at) => formatDate(new Date(at).toISOString(), L)).join(", ")}></span>` : nothing}
              </div>`;
            })}
          </div>
        </div>
      </div>
      <div class="rb-x">${xLabels.map((i) => html`<span style="left:${((i + 0.5) / buckets.length) * 100}%">${label(i)}</span>`)}</div>
      <div class="rb-foot">
        ${enough ? html`<span>${fill(t("runtime_avg_per_day", L), { hours: fmtVal(perDay, "h", L) })}</span>` : nothing}
        ${until !== null ? html`<span>${fill(t("runtime_target_in", L), { span: spanText(until, L) })}</span>` : nothing}
        ${services.length ? html`<span class="rb-legend"><i class="rb-service"></i>${t("completed", L)}</span>` : nothing}
      </div>
    `;
  }

  static styles = css`
    :host { display: block; width: 100%; }
    .range-chips { display: flex; gap: 4px; justify-content: flex-end; margin-bottom: 6px; }
    .range-chip {
      font: inherit; font-size: 11.5px; padding: 2px 9px; border-radius: 12px; cursor: pointer;
      border: 1px solid var(--divider-color); background: transparent; color: var(--secondary-text-color);
    }
    .range-chip.active { background: var(--primary-color); border-color: var(--primary-color); color: var(--text-primary-color, #fff); }
    .range-chip[disabled] { opacity: 0.45; cursor: default; }
    .rb-note { color: var(--secondary-text-color); font-size: 12.5px; padding: 12px 0; text-align: center; }
    .rb-plot { display: grid; grid-template-columns: 44px 1fr; height: 130px; }
    .rb-y { position: relative; }
    .rb-y span { position: absolute; right: 6px; transform: translateY(50%); font-size: 10.5px; color: var(--secondary-text-color); white-space: nowrap; }
    .rb-area { position: relative; border-bottom: 1px solid var(--divider-color); }
    .rb-grid { position: absolute; left: 0; right: 0; border-top: 1px solid var(--divider-color); opacity: 0.6; }
    .rb-bars { position: absolute; inset: 0; display: flex; align-items: flex-end; gap: 2px; }
    .rb-col { position: relative; flex: 1; height: 100%; display: flex; align-items: flex-end; min-width: 1px; }
    .rb-bar { width: 100%; background: var(--primary-color); border-radius: 2px 2px 0 0; min-height: 0; }
    /* A day it ran is never an empty bar. */
    .rb-bar.some { min-height: 3px; }
    .rb-col:hover .rb-bar { filter: brightness(1.15); }
    .rb-service { position: absolute; bottom: -9px; left: 50%; transform: translateX(-50%); width: 7px; height: 7px; border-radius: 50%; background: var(--success-color, #4caf50); }
    .rb-x { position: relative; height: 16px; margin: 10px 0 0 44px; }
    .rb-x span { position: absolute; transform: translateX(-50%); font-size: 10.5px; color: var(--secondary-text-color); white-space: nowrap; }
    .rb-foot { display: flex; flex-wrap: wrap; gap: 4px 16px; margin-top: 6px; font-size: 12.5px; color: var(--primary-text-color); }
    .rb-legend { display: inline-flex; align-items: center; gap: 5px; color: var(--secondary-text-color); font-size: 12px; }
    .rb-legend .rb-service { position: static; transform: none; display: inline-block; }
  `;
}

if (!customElements.get("maintenance-runtime-bars")) {
  customElements.define("maintenance-runtime-bars", MaintenanceRuntimeBars);
}
