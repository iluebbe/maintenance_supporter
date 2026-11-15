/** A rule on states or codes as a timeline (helpers/state-timeline.ts):
 *
 *  - a line on top that says the newest alert in words (when, which
 *    sensor, an update's version, how long until it was fine again);
 *  - a rule on several sensors, or an AND/OR rule, shows its result first
 *    ("one is enough" / "all are needed": when the task was triggered) and
 *    every single trigger under it: each sensor, or each condition with its
 *    sensors indented below it. Where the result held, a pale band lies
 *    across the single triggers, so which of them held at that moment reads
 *    at a glance;
 *  - one bar per line, red where it was in alert, never narrower than a few
 *    pixels; quiet sensors of a rule fold into one line;
 *  - when the alerts are too short to read at the chosen range, the hours
 *    around the newest one again, enlarged: alert, the device not reachable
 *    (a router rebooting to install), and the tick where the task was done.
 *
 *  It loads the sensors' states itself (`history/history_during_period`,
 *  one call for all of them, unavailable included), like the trace's
 *  activity rows; the range chips are the chart's. The recorder keeps a
 *  few days: before its first state the task's own record fills in (its
 *  trace and history, `task/trace`, back to the day the task began). The
 *  single triggers have no states there ("no data"), the result has the
 *  record. A chip that would show nothing a shorter one does not is off. */

import { LitElement, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { formatDate, formatDateTime, formatTimeOfDay, t } from "../styles";
import { fmtDateTime, fmtXTick, rangeAddsNothing, timeTicks } from "../renderers/chart-utils";
import { entityName } from "../helpers/trigger-entities";
import { spanText } from "../helpers/span-text";
import { stampMs } from "../helpers/ha-time";
import {
  type AlertRule,
  type Episode,
  type RecordedState,
  type Segment,
  type TraceEventLike,
  combineSegments,
  doneAt,
  episodesOf,
  firstStamp,
  latestEpisode,
  ownEpisodes,
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
const CHIP_DAYS = RANGES.map((r) => r.days);

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

/** One condition of an AND/OR rule, as the timeline draws it. `rule` null:
 *  it counts up until the service (no course to draw). */
export interface TimelineCondition {
  label: string;
  entityIds: string[];
  logic: "any" | "all";
  rule: AlertRule | null;
}

/** One line: the result, a sensor, a condition or a condition's sensor. */
interface Lane {
  id: string;
  name: string;
  kind: "result" | "entity" | "condition" | "sub";
  segs: Segment[];
  eps: Episode[];
  /** A condition without a course: said instead of a bar. */
  note?: string;
}

/** The task's own record, as `task/trace` answers. */
interface OwnRecord {
  events: TraceEventLike[];
  history: HistoryEntry[];
  createdAt: number;
}

/** Before the recorder's first state a single trigger shows "no data". */
function withNoData(segs: Segment[], t0: number, t1: number): Segment[] {
  const first = Math.min(segs[0]?.start ?? t1, t1);
  return first > t0 ? [{ start: t0, end: first, kind: "nodata" as const }, ...segs] : segs;
}

/** The task's status sensor reads "triggered" while its rule holds. */
const TRIGGERED: AlertRule = { kind: "state", to: "triggered", from: null, holdMs: 0 };

/** An episode of a real sensor (an entity id has a dot; the result's and a
 *  condition's lines are named without one). */
function isSensor(id: string): boolean {
  return id.includes(".");
}

export class MaintenanceStateTimeline extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  /** A single-source rule: its sensors and the rule they answer. */
  @property({ attribute: false }) public entityIds: string[] = [];
  @property({ attribute: false }) public rule: AlertRule | null = null;
  /** A single-source rule on several sensors: one is enough, or all. */
  @property() public logic: "any" | "all" = "any";
  /** An AND/OR rule: its conditions, joined by `compoundLogic`. */
  @property({ attribute: false }) public conditions: TimelineCondition[] = [];
  @property() public compoundLogic: "AND" | "OR" = "AND";
  /** The task's own status sensor: its recorded "triggered" is the result
   *  line, whether the trace is on or not. */
  @property() public resultEntity = "";
  @property({ attribute: false }) public history: readonly HistoryEntry[] = [];
  @property({ attribute: false }) public rangeDays = 30;
  @property() public lang = "en";
  /** The task, for its own record (`task/trace`); without them the
   *  timeline shows the recorder's days only. */
  @property() public entryId = "";
  @property() public taskId = "";
  /** Changes when the task's trigger state or history does: the states are
   *  loaded again (a new alert shows without reopening the page). */
  @property() public revision = "";

  @state() private _rows: Record<string, RecordedState[] | undefined> | null = null;
  @state() private _own: OwnRecord | null = null;
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

  /** Every sensor the timeline draws. */
  private _ids(): string[] {
    return this.conditions.length ? [...new Set(this.conditions.flatMap((c) => c.entityIds))] : this.entityIds;
  }

  /** What the timeline loads: the sensors, and the task's status sensor for
   *  a rule on several. */
  private _fetchIds(): string[] {
    const ids = this._ids();
    const several = this.conditions.length > 0 || ids.length > 1;
    return several && this.resultEntity && !ids.includes(this.resultEntity) ? [...ids, this.resultEntity] : ids;
  }

  protected updated(): void {
    const ids = this._fetchIds();
    const key = `${ids.join(",")}|${this.rangeDays}|${this.revision}|${this.entryId}|${this.taskId}`;
    if (this.hass && ids.length && key !== this._loadedFor) {
      this._loadedFor = key;
      void this._load(key, ids);
    }
  }

  /** Only the answer for what is on screen may land (a quick 7 → 30 → 90). */
  private async _load(key: string, ids: string[]): Promise<void> {
    const now = Date.now();
    const conn = this.hass!.connection;
    const states = conn
      .sendMessagePromise<Record<string, RecordedState[]>>({
        type: "history/history_during_period",
        start_time: iso(now - this.rangeDays * DAY),
        end_time: iso(now),
        entity_ids: ids,
        minimal_response: true,
        no_attributes: true,
        significant_changes_only: false,
      })
      .then((r) => r ?? {}, () => ({}));
    const own = this.entryId && this.taskId
      ? conn
          .sendMessagePromise<{ events?: TraceEventLike[]; history?: HistoryEntry[]; created_at?: string | null }>({
            type: "maintenance_supporter/task/trace",
            entry_id: this.entryId,
            task_id: this.taskId,
          })
          .then(
            (r): OwnRecord => ({
              events: r?.events ?? [],
              history: r?.history ?? [],
              createdAt: r?.created_at ? stampMs(r.created_at) : NaN,
            }),
            () => null,
          )
      : Promise.resolve(null);
    const [rows, record] = await Promise.all([states, own]);
    if (key !== this._loadedFor) return;
    this._now = now;
    this._own = record;
    this._rows = rows;
  }

  /** Where the task's own record begins: the day the task began, else its
   *  first trace event or history entry. */
  private _ownStart(): number {
    const own = this._own;
    if (!own) return NaN;
    if (Number.isFinite(own.createdAt)) return own.createdAt;
    const stamps = [
      ...own.events.map((e) => Date.parse(e.at)),
      ...own.history.map((h) => stampMs(h.timestamp)),
    ].filter((v) => Number.isFinite(v));
    return stamps.length ? Math.min(...stamps) : NaN;
  }

  /** The fullest history at hand: the trace's (all of it), else the task's
   *  (the payload keeps the recent entries). */
  private _history(): readonly HistoryEntry[] {
    return this._own?.history.length ? this._own.history : this.history;
  }

  private _emitRange(days: number): void {
    if (days === this.rangeDays) return;
    this.dispatchEvent(new CustomEvent("range-change", { detail: { days }, bubbles: true, composed: true }));
  }

  private _renderChips(dataStart: number, t1: number, L: string) {
    return html`<div class="range-chips" role="group">
      ${RANGES.map((r) => {
        const same = r.days !== this.rangeDays && rangeAddsNothing(r.days, CHIP_DAYS, dataStart, t1);
        return html`<button class="range-chip ${this.rangeDays === r.days ? "active" : ""}" ?disabled=${same}
          title=${same ? fill(t("timeline_range_no_more", L), { date: formatDate(iso(dataStart), L) }) : ""}
          @click=${() => this._emitRange(r.days)}>${t(r.key, L)}</button>`;
      })}
    </div>`;
  }

  /** The lines of the timeline: the single triggers (sensors, or conditions
   *  with their sensors) and, for a rule on several, the result on top. */
  private _lanes(rows: Record<string, RecordedState[]>, t0: number, t1: number, recorderStart: number, L: string): { result: Lane | null; lanes: Lane[] } {
    const compound = this.conditions.length > 0;
    const lanes: Lane[] = [];
    if (compound) {
      this.conditions.forEach((c, i) => {
        const id = `c${i}`;
        if (!c.rule) {
          lanes.push({ id, name: c.label, kind: "condition", segs: [], eps: [], note: t("timeline_condition_counts", L) });
          return;
        }
        const rule = c.rule;
        const per = c.entityIds.map((eid) => ({ eid, segs: withNoData(segmentsOf(rows[eid], rule, t0, t1), t0, t1) }));
        const segs = per.length === 1 ? per[0].segs : combineSegments(per.map((p) => p.segs), c.logic, t0, t1);
        lanes.push({ id, name: c.label, kind: "condition", segs, eps: episodesOf(id, segs) });
        if (per.length > 1) {
          for (const p of per) lanes.push({ id: `${id}:${p.eid}`, name: entityName(this.hass, p.eid), kind: "sub", segs: p.segs, eps: episodesOf(p.eid, p.segs) });
        }
      });
    } else if (this.rule) {
      const rule = this.rule;
      const many = this.entityIds.length > 1;
      for (const eid of this.entityIds) {
        const raw = segmentsOf(rows[eid], rule, t0, t1);
        // One sensor: the record IS its course, it was fine outside its
        // alerts. Several: before the recorder, which one is not known.
        const segs = many ? withNoData(raw, t0, t1) : raw;
        lanes.push({ id: eid, name: entityName(this.hass, eid), kind: "entity", segs, eps: episodesOf(eid, segs) });
      }
    }
    const own = this._own;
    const single = !compound && this.entityIds.length === 1;
    if (single) {
      // Before the recorder, the task's own record of its one sensor.
      if (own) {
        for (const ep of ownEpisodes(own.events, own.history, recorderStart)) {
          if ((ep.end ?? ep.start) >= t0) lanes[0].eps.push({ ...ep, entityId: lanes[0].id });
        }
        lanes[0].eps.sort((a, b) => a.start - b.start);
      }
      return { result: null, lanes };
    }
    // The result: when the task was triggered — the rule as it ran, holds
    // and cooldowns included. From the task's status sensor where the
    // recorder has it, before that from the task's own record; without
    // either, the single triggers combined.
    const all = compound ? this.compoundLogic === "AND" : this.logic === "all";
    const name = t(all ? "timeline_result_all" : "timeline_result_any", L);
    const statusRows = this.resultEntity ? rows[this.resultEntity] : undefined;
    const statusFirst = firstStamp(statusRows);
    const recorded = own ? ownEpisodes(own.events, own.history, t1, true).filter((e) => (e.end ?? t1) >= t0) : [];
    const hasRecord = !!own && (own.events.some((e) => e.kind === "status") || recorded.length > 0);
    let result: Lane;
    if (Number.isFinite(statusFirst)) {
      const segs = segmentsOf(statusRows, TRIGGERED, t0, t1);
      const eps = episodesOf("result", segs);
      if (own) {
        for (const ep of ownEpisodes(own.events, own.history, statusFirst)) {
          if ((ep.end ?? ep.start) >= t0) eps.push({ ...ep, entityId: "result" });
        }
      }
      eps.sort((a, b) => a.start - b.start);
      result = { id: "result", name, kind: "result", segs: own ? segs : withNoData(segs, t0, t1), eps };
    } else if (hasRecord) {
      result = { id: "result", name, kind: "result", segs: [], eps: recorded.map((e) => ({ ...e, entityId: "result" })) };
    } else {
      const drawn = lanes.filter((l) => l.kind === "condition" || l.kind === "entity");
      const complete = drawn.every((l) => !l.note);
      const segs = complete ? combineSegments(drawn.map((l) => l.segs), all ? "all" : "any", t0, t1) : [{ start: t0, end: t1, kind: "nodata" as const }];
      result = { id: "result", name, kind: "result", segs, eps: episodesOf("result", segs) };
    }
    if (!compound && own) {
      // A firing that named its sensor (since 2.122.0) shows on its line
      // before the recorder too.
      for (const ep of ownEpisodes(own.events, own.history, recorderStart)) {
        const lane = lanes.find((l) => l.id === ep.entityId);
        if (lane && (ep.end ?? ep.start) >= t0) lane.eps.push(ep);
      }
      for (const l of lanes) l.eps.sort((a, b) => a.start - b.start);
    }
    return { result, lanes };
  }

  protected render(): unknown {
    const L = this.lang;
    const ids = this._ids();
    if (!ids.length || (!this.rule && !this.conditions.length)) return nothing;
    const loaded = this._rows;
    if (loaded === null) return html`${this._renderChips(NaN, Date.now(), L)}<div class="tl-note">${t("loading_chart", L)}</div>`;
    // Up to the live state: the timeline follows the sensors between loads.
    const rows = Object.fromEntries(
      this._fetchIds().map((id) => [id, withLiveState(loaded[id], this.hass?.states?.[id] as { state?: unknown; last_changed?: unknown } | undefined)]),
    );
    const t1 = Math.max(Date.now(), this._now);
    // The recorder keeps ~10 days; before its first state the task's own
    // record fills in, back to the day the task began.
    const firsts = ids.map((id) => firstStamp(rows[id])).filter((v) => Number.isFinite(v));
    const recorderStart = firsts.length ? Math.min(...firsts) : t1;
    const ownStart = this._ownStart();
    const dataStart = Number.isFinite(ownStart) ? Math.min(ownStart, recorderStart) : firsts.length ? recorderStart : NaN;
    const chips = this._renderChips(dataStart, t1, L);
    if (!Number.isFinite(dataStart)) return html`${chips}<div class="tl-note">${t("timeline_no_data", L)}</div>`;
    const t0 = Math.max(t1 - this.rangeDays * DAY, dataStart);
    const { result, lanes } = this._lanes(rows, t0, t1, recorderStart, L);
    const compound = this.conditions.length > 0;
    const newest = (l: Lane): number => latestEpisode(l.eps)?.start ?? -Infinity;
    // A rule's quiet sensors fold into one line; an AND/OR rule shows all
    // its conditions, in their order.
    const shown = compound || lanes.length === 1 ? lanes : lanes.filter((l) => l.eps.length).sort((a, b) => newest(b) - newest(a));
    const quiet = lanes.length - shown.length;
    const narrow = this._width > 0 && this._width < NARROW_PX;
    const width = this._width || 600;
    const trackPx = narrow ? width : width - Math.max(90, width * 0.32) - 12;
    const base = result?.eps.length ? result.eps : shown.flatMap((l) => l.eps);
    const zoom = zoomWindow(base, t0, t1, trackPx);
    const inZoom = (l: Lane) => !!zoom && l.eps.some((e) => e.start < zoom.end && (e.end ?? t1) > zoom.start);
    const zoomLanes = zoom ? (compound ? shown.filter((l) => !l.note) : shown.filter(inZoom)) : [];
    const bands = result ? result.eps : [];
    const all = [result, ...shown].filter((l): l is Lane => !!l);
    // In the overview an alert's mark covers the outage inside it: the
    // legend names what can be seen.
    const drawnIn = (list: Lane[], from: number, to: number, kind: Segment["kind"], minPct: number, uncovered = false) =>
      list.some((l) =>
        l.segs.some(
          (s) =>
            s.kind === kind && s.start < to && s.end > from &&
            pct(Math.min(s.end, to), from, to) - pct(Math.max(s.start, from), from, to) >= minPct &&
            !(uncovered && l.eps.some((e) => e.start <= s.start && (e.end ?? t1) >= s.end)),
        ),
      );
    const goneShown = drawnIn(all, t0, t1, "gone", 0.6, true) || (!!zoom && drawnIn(zoomLanes, zoom.start, zoom.end, "gone", 0));
    const noDataShown = drawnIn(all, t0, t1, "nodata", 0.6);
    const tickLanes = result ? [result] : zoom ? zoomLanes : shown;
    const doneShown = tickLanes.some((l) => l.eps.some((e) => doneAt(e, this._history())));
    const ownShown = !!this._own && recorderStart > t0 + 60_000 && Number.isFinite(ownStart) && ownStart < recorderStart;
    const boundary = ownShown ? pct(recorderStart, t0, t1) : null;
    const readable = zoom === null;
    const summary = this._renderSummary(this._summaryEpisode(result, shown), !compound && this.entityIds.length > 1, t0, L);
    // A rule on several sensors that none reported: the line on top says it.
    if (!compound && lanes.length > 1 && !shown.length && !result?.eps.length) return html`${chips}${summary}`;
    return html`
      ${chips}
      ${summary}
      <div class="tl-lanes ${narrow ? "narrow" : ""}">
        ${result ? this._renderLane(result, t0, t1, { zoomed: false, readable, boundary, bands: [], L, labels: compound }) : nothing}
        ${shown.map((l) => this._renderLane(l, t0, t1, { zoomed: false, readable, boundary, bands: readable ? bands : [], L, labels: !result || !compound }))}
        <div class="tl-name tl-axis-spacer"></div>
        ${this._renderAxis(t0, t1, L)}
      </div>
      ${!compound && quiet ? html`<div class="tl-quiet">${fill(t("timeline_more_quiet", L), { n: String(quiet) })}</div>` : nothing}
      ${boundary !== null ? html`<div class="tl-quiet tl-before">${fill(t("timeline_before_recorder", L), { date: formatDate(iso(recorderStart), L) })}</div>` : nothing}
      ${zoom ? this._renderZoom(result && result.eps.some((e) => e.start < zoom.end && (e.end ?? t1) > zoom.start) ? result : null, zoomLanes, zoom, narrow, bands, compound, L) : nothing}
      <div class="tl-legend">
        <span><i class="sw alarm"></i>${t("triggered", L)}</span>
        ${result && bands.length ? html`<span><i class="sw band"></i>${t("timeline_band", L)}</span>` : nothing}
        ${goneShown ? html`<span><i class="sw gone"></i>${t("timeline_unreachable", L)}</span>` : nothing}
        ${noDataShown ? html`<span><i class="sw nodata"></i>${t("timeline_nodata", L)}</span>` : nothing}
        <span><i class="sw ok"></i>${t("ok", L)}</span>
        ${doneShown ? html`<span><i class="tl-done-dot"></i>${t("completed", L)}</span>` : nothing}
      </div>
    `;
  }

  /** The alert the line on top tells: on a rule where one sensor is enough
   *  the sensor's newest (it names the sensor and its version), else the
   *  result's, else the sensor's. */
  private _summaryEpisode(result: Lane | null, lanes: Lane[]): Episode | null {
    const sensors = latestEpisode(lanes.filter((l) => l.kind === "entity").flatMap((l) => l.eps));
    if (result && (this.conditions.length || this.logic === "all")) return latestEpisode(result.eps) ?? null;
    const fromResult = result ? latestEpisode(result.eps) : null;
    if (sensors && (!fromResult || sensors.start >= fromResult.start - 120_000)) return sensors;
    return fromResult ?? sensors;
  }

  /** The newest alert in words: the line to read at a glance. */
  private _renderSummary(ep: Episode | null, named: boolean, t0: number, L: string) {
    if (!ep) return html`<div class="tl-last quiet">${fill(t("timeline_none", L), { when: formatDateTime(iso(t0), L) })}</div>`;
    const real = isSensor(ep.entityId);
    const so = real ? this.hass?.states?.[ep.entityId] : undefined;
    const update = real && ep.entityId.startsWith("update.");
    const parts: string[] = [];
    const when = formatDateTime(iso(ep.start), L);
    const name = named && real ? entityName(this.hass, ep.entityId) : "";
    if (ep.endUnknown) {
      parts.push(fill(t("timeline_last", L), { when }));
      if (name) parts.push(name);
    } else if (ep.end === null) {
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
      const done = doneAt(ep, this._history());
      if (done) parts.push(t(done.auto ? "timeline_auto_done" : "timeline_done", L));
    }
    return html`<div class="tl-last ${ep.end === null ? "open" : ""}">${parts.join(" · ")}</div>`;
  }

  /** One line. The overview draws each alert as one mark (an outage inside
   *  it included) that never gets narrower than the CSS minimum; the
   *  magnifier draws the alert and the outage apart. The done ticks go on
   *  the result (or the only line); the words under a bar where the alerts
   *  can be read (`readable`): in the magnifier all of them, in the
   *  overview the line's newest. `bands`: where the result held, pale
   *  across a single trigger. */
  private _renderLane(
    l: Lane,
    t0: number,
    t1: number,
    o: { zoomed: boolean; readable: boolean; boundary: number | null; bands: readonly Episode[]; L: string; labels?: boolean },
  ) {
    const { zoomed, readable, boundary, bands, L } = o;
    const span = (a: number, b: number): string => {
      const x = pct(a, t0, t1);
      const y = pct(b, t0, t1);
      // Anchored on the side it is closer to: a minimum-width mark at the
      // right edge grows to the left instead of out of the bar.
      return (x + y) / 2 > 50 ? `right:${100 - y}%;width:${y - x}%` : `left:${x}%;width:${y - x}%`;
    };
    const title = (e: Episode): string =>
      e.endUnknown
        ? this._episodeText(e, L, true)
        : `${formatDateTime(iso(e.start), L)} – ${e.end === null ? "…" : formatTimeOfDay(new Date(e.end), L)}${e.end === null ? "" : ` · ${spanText(e.end - e.start, L)}`}`;
    const inView = (s: { start: number; end: number }) => s.start < t1 && s.end > t0;
    const clip = (a: number, b: number) => span(Math.max(a, t0), Math.min(b, t1));
    if (l.note) {
      return html`
        <div class="tl-name ${l.kind}" title=${l.name}>${l.name}</div>
        <div class="tl-cell ${l.kind}"><div class="tl-nocourse">${l.note}</div></div>`;
    }
    const mark = (e: Episode) => html`<span class="tl-mark ${e.end === null ? "open" : ""}" style=${clip(e.start, e.end ?? t1)} title=${title(e)}></span>`;
    const band = bands
      .filter((e) => inView({ start: e.start, end: e.end ?? t1 }))
      .map((e) => html`<span class="tl-band" style=${clip(e.start, e.end ?? t1)}></span>`);
    const segs = zoomed
      ? l.segs.filter((s) => s.kind !== "ok" && s.kind !== "alarm" && inView(s)).map((s) => html`<span class="tl-seg ${s.kind}" style=${clip(s.start, s.end)}></span>`)
      : l.segs
          .filter((s) => (s.kind === "nodata" || (s.kind === "gone" && pct(s.end, t0, t1) - pct(s.start, t0, t1) >= 0.6)) && inView(s))
          .map((s) => html`<span class="tl-seg ${s.kind}" style=${clip(s.start, s.end)}></span>`);
    const marks = zoomed
      ? [
          ...l.segs.filter((s) => s.kind === "alarm" && inView(s)).map((s) => html`<span class="tl-seg alarm" style=${clip(s.start, s.end)}></span>`),
          // The task's own record has no states to draw: its alerts as marks.
          ...l.eps.filter((e) => (e.own || !l.segs.length) && inView({ start: e.start, end: e.end ?? t1 })).map(mark),
        ]
      : l.eps.filter((e) => inView({ start: e.start, end: e.end ?? t1 })).map(mark);
    const edge = boundary !== null ? html`<span class="tl-boundary" style="left:${boundary}%"></span>` : nothing;
    const tickable = l.kind === "result" || (l.kind === "entity" && this.entityIds.length === 1 && !this.conditions.length);
    const ticks = readable && tickable
      ? l.eps
          .map((e) => ({ e, done: doneAt(e, this._history()) }))
          .filter(({ e, done }) => done && e.end !== null && e.end >= t0 && e.end <= t1)
          .map(({ e }) => html`<span class="tl-tick" style="left:${pct(e.end!, t0, t1)}%" title=${formatDateTime(iso(e.end!), L)}>✓</span>`)
      : [];
    const newest = latestEpisode(l.eps);
    const wantLabels = o.labels !== false && l.kind !== "sub";
    const labels = !wantLabels
      ? []
      : zoomed
        ? l.eps.filter((e) => inView({ start: e.start, end: e.end ?? t1 })).map((e) => this._episodeText(e, L))
        : readable && newest && inView({ start: newest.start, end: newest.end ?? t1 })
          ? [this._episodeText(newest, L)]
          : [];
    return html`
      <div class="tl-name ${l.kind}" title=${l.name}>${l.name}</div>
      <div class="tl-cell ${l.kind}">
        <div class="tl-track ${l.kind}" role="img" aria-label=${`${l.name}: ${l.eps.map(title).join(", ") || t("ok", L)}`}>${segs}${marks}${band}${edge}${ticks}</div>
        ${labels.length ? html`<div class="tl-labels">${labels.join(" · ")}</div>` : nothing}
      </div>`;
  }

  /** "12:57 reported → 13:05 completed (8 minutes)"; with the day for an
   *  alert from the task's own record, which can lie weeks back. */
  private _episodeText(e: Episode, L: string, withDay = !!e.own): string {
    const at = (ms: number) => (withDay ? formatDateTime(iso(ms), L) : formatTimeOfDay(new Date(ms), L));
    const start = at(e.start);
    if (e.endUnknown) return fill(t("timeline_episode_unknown_end", L), { start });
    if (e.end === null) return fill(t("timeline_episode_open", L), { start });
    const values = { start, end: formatTimeOfDay(new Date(e.end), L), duration: spanText(e.end - e.start, L) };
    return fill(t(doneAt(e, this._history()) ? "timeline_episode_done" : "timeline_episode", L), values);
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

  private _renderZoom(result: Lane | null, lanes: Lane[], zoom: { start: number; end: number }, narrow: boolean, bands: readonly Episode[], compound: boolean, L: string) {
    const sameDay = zoom.end - zoom.start < DAY;
    const range = sameDay
      ? `${fmtDateTime(zoom.start, L)} – ${formatTimeOfDay(new Date(zoom.end), L)}`
      : `${fmtDateTime(zoom.start, L)} – ${fmtDateTime(zoom.end, L)}`;
    const o = { zoomed: true, readable: true, boundary: null, L };
    return html`
      <div class="tl-zoom">
        <div class="tl-zoom-head">${fill(t("timeline_zoom", L), { range })}</div>
        <div class="tl-lanes ${narrow ? "narrow" : ""}">
          ${result ? this._renderLane(result, zoom.start, zoom.end, { ...o, bands: [], labels: compound }) : nothing}
          ${lanes.map((l) => this._renderLane(l, zoom.start, zoom.end, { ...o, bands, labels: !compound }))}
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
      --tl-nodata: color-mix(in srgb, var(--secondary-text-color, #727272) 14%, transparent);
    }
    .range-chips { display: flex; gap: 4px; justify-content: flex-end; margin-bottom: 6px; }
    .range-chip {
      font: inherit; font-size: 11.5px; padding: 2px 9px; border-radius: 12px; cursor: pointer;
      border: 1px solid var(--divider-color); background: transparent; color: var(--secondary-text-color);
    }
    .range-chip.active { background: var(--primary-color); border-color: var(--primary-color); color: var(--text-primary-color, #fff); }
    .range-chip[disabled] { opacity: 0.45; cursor: default; }
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
    /* The result reads first; a condition's sensors sit under it. */
    .tl-name.result { font-weight: 600; }
    .tl-name.sub { padding-left: 14px; font-size: 11.5px; color: var(--secondary-text-color); }
    .tl-cell { min-width: 0; }
    .tl-cell.result { padding-bottom: 6px; border-bottom: 1px solid var(--divider-color); }
    .tl-track {
      position: relative; height: 16px; border-radius: 4px; background: var(--tl-ok); overflow: hidden;
    }
    .tl-track.result { height: 20px; }
    .tl-track.sub { height: 10px; }
    .tl-seg, .tl-mark, .tl-band { position: absolute; top: 0; bottom: 0; }
    .tl-seg.alarm, .tl-mark { background: var(--tl-alarm); }
    .tl-mark { min-width: 8px; border-radius: 2px; }
    .tl-mark.open { box-shadow: 0 0 0 2px color-mix(in srgb, var(--tl-alarm) 35%, transparent); }
    .tl-seg.gone {
      background: repeating-linear-gradient(135deg, color-mix(in srgb, var(--tl-gone) 55%, transparent) 0 2px, transparent 2px 6px),
        var(--card-background-color, #fff);
    }
    .tl-seg.nodata { background: var(--card-background-color, #fff); box-shadow: inset 0 0 0 100px var(--tl-nodata); }
    /* Where the result held, over a single trigger: a pale frame on top, so
       it reads on a red alert (AND: every condition holds then) as well as
       on a fine stretch (OR: the others did not). */
    .tl-band {
      background: color-mix(in srgb, var(--tl-alarm) 14%, transparent);
      border-left: 2px solid color-mix(in srgb, var(--primary-text-color, #212121) 55%, transparent);
      border-right: 2px solid color-mix(in srgb, var(--primary-text-color, #212121) 55%, transparent);
      pointer-events: none;
    }
    .tl-tick {
      position: absolute; top: 50%; transform: translate(-50%, -50%);
      width: 14px; height: 14px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
      background: var(--success-color, #4caf50); color: #fff; font-size: 10px; line-height: 1;
      box-shadow: 0 0 0 2px var(--card-background-color, #fff);
    }
    .tl-nocourse { font-size: 11.5px; font-style: italic; color: var(--secondary-text-color); }
    .tl-labels { font-size: 11.5px; color: var(--primary-text-color); margin-top: 3px; }
    /* Where the recorder's states begin: before it, the task's own record. */
    .tl-boundary { position: absolute; top: 0; bottom: 0; border-left: 1.5px dashed var(--secondary-text-color, #727272); opacity: 0.7; }
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
    .sw.band {
      background: color-mix(in srgb, var(--tl-alarm) 14%, transparent);
      border-left: 2px solid color-mix(in srgb, var(--primary-text-color, #212121) 55%, transparent);
      border-right: 2px solid color-mix(in srgb, var(--primary-text-color, #212121) 55%, transparent);
    }
    .sw.nodata { background: var(--tl-nodata); }
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
