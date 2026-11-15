/** A single-shot state rule's sensors as a timeline (helpers/state-timeline.ts):
 *
 *  - a line on top that says the newest alert in words (when, which
 *    sensor, an update's version, how long until it was fine again);
 *  - one bar per sensor that reported, red where it was in its alert state,
 *    never narrower than a few pixels; the quiet sensors fold into one line;
 *  - when the alerts are too short to read at the chosen range, the hours
 *    around the newest one again, enlarged: alert, the device not reachable
 *    (a router rebooting to install), and the tick where the task was done.
 *
 *  It loads the sensors' states itself (`history/history_during_period`,
 *  one call for all of them, unavailable included), like the trace's
 *  activity rows; the range chips are the chart's. */

import { LitElement, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { formatDateTime, formatTimeOfDay, t } from "../styles";
import { fmtDateTime, fmtXTick, timeTicks } from "../renderers/chart-utils";
import { entityName } from "../helpers/trigger-entities";
import { spanText } from "../helpers/span-text";
import {
  type AlertRule,
  type Episode,
  type RecordedState,
  type Segment,
  doneAt,
  episodesOf,
  firstStamp,
  latestEpisode,
  pct,
  segmentsOf,
  withLiveState,
  zoomWindow,
} from "../helpers/state-timeline";
import type { HistoryEntry, HomeAssistant } from "../types";

const DAY = 86_400_000;

const RANGES = [
  { days: 7, key: "chart_range_7d" },
  { days: 30, key: "chart_range_30d" },
  { days: 90, key: "chart_range_90d" },
  { days: 365, key: "chart_range_1y" },
] as const;

/** Below this width the names sit above their bars. */
const NARROW_PX = 480;

function fill(text: string, values: Record<string, string>): string {
  return Object.entries(values).reduce((s, [k, v]) => s.split(`{${k}}`).join(v), text);
}

function iso(ms: number): string {
  return new Date(ms).toISOString();
}

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

interface Lane {
  id: string;
  name: string;
  segs: Segment[];
  eps: Episode[];
}

export class MaintenanceStateTimeline extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public entityIds: string[] = [];
  @property({ attribute: false }) public rule: AlertRule | null = null;
  @property({ attribute: false }) public history: readonly HistoryEntry[] = [];
  @property({ attribute: false }) public rangeDays = 30;
  @property() public lang = "en";
  /** Changes when the task's trigger state or history does: the states are
   *  loaded again (a new alert shows without reopening the page). */
  @property() public revision = "";

  @state() private _rows: Record<string, RecordedState[] | undefined> | null = null;
  @state() private _width = 0;
  private _loadedFor = "";
  private _now = 0;
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

  protected updated(): void {
    const key = `${this.entityIds.join(",")}|${this.rangeDays}|${this.revision}`;
    if (this.hass && this.entityIds.length && key !== this._loadedFor) {
      this._loadedFor = key;
      void this._load(key);
    }
  }

  /** Only the answer for what is on screen may land (a quick 7 → 30 → 90). */
  private async _load(key: string): Promise<void> {
    const now = Date.now();
    let rows: Record<string, RecordedState[] | undefined>;
    try {
      rows = (await this.hass!.connection.sendMessagePromise<Record<string, RecordedState[]>>({
        type: "history/history_during_period",
        start_time: iso(now - this.rangeDays * DAY),
        end_time: iso(now),
        entity_ids: this.entityIds,
        minimal_response: true,
        no_attributes: true,
        significant_changes_only: false,
      })) ?? {};
    } catch {
      rows = {};
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
    const rule = this.rule;
    if (!rule) return nothing;
    const chips = html`<div class="range-chips" role="group">
      ${RANGES.map((r) => html`<button class="range-chip ${this.rangeDays === r.days ? "active" : ""}"
        @click=${() => this._emitRange(r.days)}>${t(r.key, L)}</button>`)}
    </div>`;
    const loaded = this._rows;
    if (loaded === null) return html`${chips}<div class="tl-note">${t("loading_chart", L)}</div>`;
    // Up to the live state: the timeline follows the sensors between loads.
    const rows = Object.fromEntries(
      this.entityIds.map((id) => [id, withLiveState(loaded[id], this.hass?.states?.[id] as { state?: unknown; last_changed?: unknown } | undefined)]),
    );
    const t1 = Math.max(Date.now(), this._now);
    // The recorder keeps ~10 days: the axis starts where its states do.
    const firsts = this.entityIds.map((id) => firstStamp(rows[id])).filter((v) => Number.isFinite(v));
    if (!firsts.length) return html`${chips}<div class="tl-note">${t("timeline_no_data", L)}</div>`;
    const t0 = Math.max(t1 - this.rangeDays * DAY, Math.min(...firsts));
    const lanes: Lane[] = this.entityIds.map((id) => {
      const segs = segmentsOf(rows[id], rule, t0, t1);
      return { id, name: entityName(this.hass, id), segs, eps: episodesOf(id, segs) };
    });
    const many = lanes.length > 1;
    const all = lanes.flatMap((l) => l.eps);
    const newest = (l: Lane): number => latestEpisode(l.eps)?.start ?? -Infinity;
    const shown = many ? lanes.filter((l) => l.eps.length).sort((a, b) => newest(b) - newest(a)) : lanes;
    const quiet = lanes.length - shown.length;
    const narrow = this._width > 0 && this._width < NARROW_PX;
    const width = this._width || 600;
    const trackPx = narrow ? width : width - Math.max(90, width * 0.32) - 12;
    const zoom = zoomWindow(all, t0, t1, trackPx);
    const zoomLanes = zoom ? shown.filter((l) => l.eps.some((e) => e.start < zoom.end && (e.end ?? t1) > zoom.start)) : [];
    const goneShown =
      shown.some((l) => l.segs.some((s) => s.kind === "gone" && pct(s.end, t0, t1) - pct(s.start, t0, t1) >= 0.6)) ||
      (zoom !== null && zoomLanes.some((l) => l.segs.some((s) => s.kind === "gone" && s.start < zoom.end && s.end > zoom.start)));
    const doneShown = (zoom !== null ? zoomLanes : shown).some((l) => l.eps.some((e) => doneAt(e, this.history)));
    return html`
      ${chips}
      ${this._renderSummary(latestEpisode(all), many, t0, L)}
      ${shown.length
        ? html`
          <div class="tl-lanes ${narrow ? "narrow" : ""}">
            ${shown.map((l) => this._renderLane(l, t0, t1, false, L, zoom === null))}
            <div class="tl-name tl-axis-spacer"></div>
            ${this._renderAxis(t0, t1, L)}
          </div>
          ${many && quiet ? html`<div class="tl-quiet">${fill(t("timeline_more_quiet", L), { n: String(quiet) })}</div>` : nothing}`
        : nothing}
      ${zoom ? this._renderZoom(zoomLanes, zoom, narrow, L) : nothing}
      ${shown.length
        ? html`<div class="tl-legend">
            <span><i class="sw alarm"></i>${t("triggered", L)}</span>
            ${goneShown ? html`<span><i class="sw gone"></i>${t("timeline_unreachable", L)}</span>` : nothing}
            <span><i class="sw ok"></i>${t("ok", L)}</span>
            ${doneShown ? html`<span><i class="tl-done-dot"></i>${t("completed", L)}</span>` : nothing}
          </div>`
        : nothing}
    `;
  }

  /** The newest alert in words: the line to read at a glance. */
  private _renderSummary(ep: Episode | null, many: boolean, t0: number, L: string) {
    if (!ep) return html`<div class="tl-last quiet">${fill(t("timeline_none", L), { when: formatDateTime(iso(t0), L) })}</div>`;
    const so = this.hass?.states?.[ep.entityId];
    const update = ep.entityId.startsWith("update.");
    const parts: string[] = [];
    const when = formatDateTime(iso(ep.start), L);
    const name = many ? entityName(this.hass, ep.entityId) : "";
    if (ep.end === null) {
      parts.push(fill(t("timeline_since", L), { when }));
      if (name) parts.push(name);
      const latest = update ? str(so?.attributes?.latest_version) : "";
      if (latest) parts.push(fill(t("trigger_update_offered", L), { latest }));
    } else {
      parts.push(fill(t("timeline_last", L), { when }));
      if (name) parts.push(name);
      const installed = update ? str(so?.attributes?.installed_version) : "";
      if (installed) parts.push(fill(t("trigger_update_installed", L), { installed }));
      parts.push(fill(t("timeline_ok_after", L), { duration: spanText(ep.end - ep.start, L) }));
      const done = doneAt(ep, this.history);
      if (done) parts.push(t(done.auto ? "timeline_auto_done" : "timeline_done", L));
    }
    return html`<div class="tl-last ${ep.end === null ? "open" : ""}">${parts.join(" · ")}</div>`;
  }

  /** One sensor's bar: the overview draws each alert as one mark (an outage
   *  inside it included) that never gets narrower than the CSS minimum;
   *  the magnifier draws the alert and the outage apart. The done ticks and
   *  the words under the bar go where the alerts can be read: in the
   *  magnifier, or in the overview when it needs none (`readable`; there
   *  only the sensor's newest alert is put in words). */
  private _renderLane(l: Lane, t0: number, t1: number, zoomed: boolean, L: string, readable = zoomed) {
    const span = (a: number, b: number): string => {
      const x = pct(a, t0, t1);
      const y = pct(b, t0, t1);
      // Anchored on the side it is closer to: a minimum-width mark at the
      // right edge grows to the left instead of out of the bar.
      return (x + y) / 2 > 50 ? `right:${100 - y}%;width:${y - x}%` : `left:${x}%;width:${y - x}%`;
    };
    const title = (e: Episode): string =>
      `${formatDateTime(iso(e.start), L)} – ${e.end === null ? "…" : formatTimeOfDay(new Date(e.end), L)}${e.end === null ? "" : ` · ${spanText(e.end - e.start, L)}`}`;
    const inView = (s: { start: number; end: number }) => s.start < t1 && s.end > t0;
    const marks = zoomed
      ? l.segs.filter((s) => s.kind !== "ok" && inView(s)).map((s) => html`<span class="tl-seg ${s.kind}" style=${span(Math.max(s.start, t0), Math.min(s.end, t1))}></span>`)
      : [
          ...l.segs
            .filter((s) => s.kind === "gone" && pct(s.end, t0, t1) - pct(s.start, t0, t1) >= 0.6)
            .map((s) => html`<span class="tl-seg gone" style=${span(s.start, s.end)}></span>`),
          ...l.eps.map((e) => html`<span class="tl-mark ${e.end === null ? "open" : ""}" style=${span(e.start, e.end ?? t1)} title=${title(e)}></span>`),
        ];
    const ticks = readable
      ? l.eps
          .map((e) => ({ e, done: doneAt(e, this.history) }))
          .filter(({ e, done }) => done && e.end !== null && e.end >= t0 && e.end <= t1)
          .map(({ e }) => html`<span class="tl-tick" style="left:${pct(e.end!, t0, t1)}%" title=${formatDateTime(iso(e.end!), L)}>✓</span>`)
      : [];
    const newest = latestEpisode(l.eps);
    const labels = zoomed
      ? l.eps.filter((e) => inView({ start: e.start, end: e.end ?? t1 })).map((e) => this._episodeText(e, L))
      : readable && newest
        ? [this._episodeText(newest, L)]
        : [];
    return html`
      <div class="tl-name" title=${l.name}>${l.name}</div>
      <div class="tl-cell">
        <div class="tl-track" role="img" aria-label=${`${l.name}: ${l.eps.map(title).join(", ") || t("ok", L)}`}>${marks}${ticks}</div>
        ${labels.length ? html`<div class="tl-labels">${labels.join(" · ")}</div>` : nothing}
      </div>`;
  }

  /** "12:57 reported → 13:05 completed (8 minutes)". */
  private _episodeText(e: Episode, L: string): string {
    const start = formatTimeOfDay(new Date(e.start), L);
    if (e.end === null) return fill(t("timeline_episode_open", L), { start });
    const values = { start, end: formatTimeOfDay(new Date(e.end), L), duration: spanText(e.end - e.start, L) };
    return fill(t(doneAt(e, this.history) ? "timeline_episode_done" : "timeline_episode", L), values);
  }

  private _renderAxis(t0: number, t1: number, L: string) {
    const count = Math.max(2, Math.min(5, Math.floor((this._width || 600) / 130) + 1));
    const ticks = timeTicks(t0, t1, count);
    return html`<div class="tl-axis">
      ${ticks.map((ts, i) => {
        const text = fmtXTick(ts, L, t0, t1);
        if (i > 0 && text === fmtXTick(ticks[i - 1], L, t0, t1)) return nothing;
        const edge = i === 0 ? "start" : i === ticks.length - 1 ? "end" : "mid";
        return html`<span class="tl-axis-tick ${edge}" style="left:${pct(ts, t0, t1)}%">${text}</span>`;
      })}
    </div>`;
  }

  private _renderZoom(lanes: Lane[], zoom: { start: number; end: number }, narrow: boolean, L: string) {
    const sameDay = zoom.end - zoom.start < DAY;
    const range = sameDay
      ? `${fmtDateTime(zoom.start, L)} – ${formatTimeOfDay(new Date(zoom.end), L)}`
      : `${fmtDateTime(zoom.start, L)} – ${fmtDateTime(zoom.end, L)}`;
    return html`
      <div class="tl-zoom">
        <div class="tl-zoom-head">${fill(t("timeline_zoom", L), { range })}</div>
        <div class="tl-lanes ${narrow ? "narrow" : ""}">
          ${lanes.map((l) => this._renderLane(l, zoom.start, zoom.end, true, L))}
          <div class="tl-name tl-axis-spacer"></div>
          ${this._renderAxis(zoom.start, zoom.end, L)}
        </div>
      </div>`;
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
      --tl-alarm: var(--error-color, #db4437);
      --tl-ok: color-mix(in srgb, var(--success-color, #4caf50) 22%, transparent);
      --tl-gone: var(--secondary-text-color, #727272);
    }
    .range-chips { display: flex; gap: 4px; justify-content: flex-end; margin-bottom: 6px; }
    .range-chip {
      font: inherit; font-size: 11.5px; padding: 2px 9px; border-radius: 12px; cursor: pointer;
      border: 1px solid var(--divider-color); background: transparent; color: var(--secondary-text-color);
    }
    .range-chip.active { background: var(--primary-color); border-color: var(--primary-color); color: var(--text-primary-color, #fff); }
    .tl-note { color: var(--secondary-text-color); font-size: 12.5px; padding: 12px 0; text-align: center; }
    .tl-last {
      font-size: 13.5px; line-height: 1.45; padding: 8px 12px; border-radius: 8px; margin-bottom: 10px;
      background: color-mix(in srgb, var(--success-color, #4caf50) 9%, transparent);
      border: 1px solid color-mix(in srgb, var(--success-color, #4caf50) 28%, transparent);
      color: var(--primary-text-color);
    }
    .tl-last.open {
      background: color-mix(in srgb, var(--tl-alarm) 10%, transparent);
      border-color: color-mix(in srgb, var(--tl-alarm) 35%, transparent);
    }
    .tl-last.quiet { background: transparent; border-color: var(--divider-color); color: var(--secondary-text-color); }
    .tl-lanes {
      display: grid; grid-template-columns: minmax(90px, 32%) 1fr; column-gap: 12px; row-gap: 8px; align-items: center;
    }
    .tl-lanes.narrow { grid-template-columns: 1fr; row-gap: 2px; }
    .tl-lanes.narrow .tl-cell { margin-bottom: 8px; }
    .tl-lanes.narrow .tl-axis-spacer { display: none; }
    .tl-name {
      font-size: 12.5px; color: var(--primary-text-color); min-width: 0;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .tl-cell { min-width: 0; }
    .tl-track {
      position: relative; height: 16px; border-radius: 4px; background: var(--tl-ok); overflow: hidden;
    }
    .tl-seg, .tl-mark { position: absolute; top: 0; bottom: 0; }
    .tl-seg.alarm, .tl-mark { background: var(--tl-alarm); }
    .tl-mark { min-width: 8px; border-radius: 2px; }
    .tl-mark.open { box-shadow: 0 0 0 2px color-mix(in srgb, var(--tl-alarm) 35%, transparent); }
    .tl-seg.gone {
      background: repeating-linear-gradient(135deg, color-mix(in srgb, var(--tl-gone) 55%, transparent) 0 2px, transparent 2px 6px),
        var(--card-background-color, #fff);
    }
    .tl-tick {
      position: absolute; top: 50%; transform: translate(-50%, -50%);
      width: 14px; height: 14px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
      background: var(--success-color, #4caf50); color: #fff; font-size: 10px; line-height: 1;
      box-shadow: 0 0 0 2px var(--card-background-color, #fff);
    }
    .tl-labels { font-size: 11.5px; color: var(--primary-text-color); margin-top: 3px; }
    .tl-axis { position: relative; height: 14px; }
    .tl-axis-tick { position: absolute; top: 0; font-size: 10.5px; color: var(--secondary-text-color); white-space: nowrap; transform: translateX(-50%); }
    .tl-axis-tick.start { transform: none; }
    .tl-axis-tick.end { transform: translateX(-100%); }
    .tl-quiet { font-size: 12px; color: var(--secondary-text-color); margin-top: 6px; }
    .tl-zoom {
      margin-top: 12px; padding: 10px 12px 8px; border-radius: 8px;
      background: color-mix(in srgb, var(--primary-text-color) 4%, transparent); border: 1px solid var(--divider-color);
    }
    .tl-zoom-head { font-size: 12px; font-weight: 600; color: var(--secondary-text-color); margin-bottom: 8px; }
    .tl-legend { display: flex; flex-wrap: wrap; gap: 6px 16px; margin-top: 10px; font-size: 12px; color: var(--secondary-text-color); }
    .tl-legend span { display: inline-flex; align-items: center; gap: 5px; }
    .sw { display: inline-block; width: 14px; height: 10px; border-radius: 2px; }
    .sw.alarm { background: var(--tl-alarm); }
    .sw.ok { background: var(--tl-ok); }
    .sw.gone {
      background: repeating-linear-gradient(135deg, color-mix(in srgb, var(--tl-gone) 55%, transparent) 0 2px, transparent 2px 6px);
      border: 1px solid var(--divider-color);
    }
    .tl-done-dot { display: inline-block; width: 11px; height: 11px; border-radius: 50%; background: var(--success-color, #4caf50); }
  `;
}

if (!customElements.get("maintenance-state-timeline")) {
  customElements.define("maintenance-state-timeline", MaintenanceStateTimeline);
}
