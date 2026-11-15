/** An on/off rule as a timeline: when each sensor was in its alert state,
 *  when it could not be reached, and when the task was done.
 *
 *  A single-shot state rule (an update offered, a problem sensor, a door
 *  left open) was drawn as a line on a 0 / 0.5 / 1 / 1.5 axis, only for the
 *  rule's first sensor, and an eight-minute alert on a 30-day axis was a
 *  hairline at its edge (prod review 2026-11-15). Home Assistant shows
 *  such states as bars on a time axis; so does this. The alert state
 *  follows the backend's latch (entity/triggers/state_change.py,
 *  ``_in_alert_state``). Pure, unit-tested in state-timeline.test.ts. */

import type { HistoryEntry, TriggerConfig } from "../types";
import { stampMs } from "./ha-time";

/** A recorded state as `history/history_during_period` sends it (the
 *  compressed form: `s`, `lu`/`lc` in seconds; the long one as fallback). */
export interface RecordedState {
  s?: string;
  lu?: number;
  lc?: number;
  state?: string;
  last_updated?: string;
  last_changed?: string;
}

/** What a sensor's state means for the rule: alert, fine, or not known
 *  (unavailable / unknown — the device could not be reached); "nodata"
 *  before the recorder's first state where nothing can be inferred (a
 *  condition of an AND/OR rule). */
export type SegmentKind = "alarm" | "ok" | "gone" | "nodata";

export interface Segment {
  start: number;
  end: number;
  kind: SegmentKind;
}

/** One alert of one sensor: from its alert state until it was fine again
 *  (an outage in between belongs to it — a router reboots to install).
 *  `end` null: still in alert, or not reached since.
 *
 *  `own`: read from the task's own record (its trace and history) for the
 *  time before the recorder's states; `entityId` is "" when that record
 *  does not say which sensor it was, and `endUnknown` when it does not say
 *  when the alert ended (a firing from before the trace). */
export interface Episode {
  entityId: string;
  start: number;
  end: number | null;
  own?: boolean;
  endUnknown?: boolean;
}

/** A journal event as `maintenance_supporter/task/trace` sends it. */
export interface TraceEventLike {
  at: string;
  kind: string;
  [key: string]: unknown;
}

const SAME_MOMENT_MS = 120_000;

/** The task's alerts as its own record has them, for the time before
 *  `before` (where the recorder's states begin; the recorder keeps a few
 *  days, the task its trace and history for months).
 *
 *  - The trace's status changes: from "triggered" being entered to it being
 *    left. The sensor is the one the firing named (the history entry at the
 *    start, since 2.122.0), else the one the trace saw let go at the end.
 *  - Before the trace's first event, the history's firings: the start and
 *    the sensor if it was recorded; the end is the next completion, skip
 *    or reset, or not known.
 *
 *  An alert still going at `before` is cut there: the recorder goes on.
 *  With `keepOpen` (the record IS the line, an AND/OR rule's "rule met")
 *  an alert going on now stays open. */
export function ownEpisodes(
  events: readonly TraceEventLike[],
  history: readonly HistoryEntry[],
  before: number,
  keepOpen = false,
): Episode[] {
  const firings = history
    .filter((h) => h.type === "triggered")
    .map((h) => ({ at: stampMs(h.timestamp), entity: typeof h.trigger_change?.entity === "string" ? h.trigger_change.entity : "" }))
    .filter((f) => Number.isFinite(f.at))
    .sort((a, b) => a.at - b.at);
  const sorted = events
    .map((e) => ({ e, at: Date.parse(e.at) }))
    .filter((x) => Number.isFinite(x.at))
    .sort((a, b) => a.at - b.at);
  const near = (at: number, items: readonly { at: number; entity: string }[]): string =>
    items.find((i) => i.entity && Math.abs(i.at - at) <= SAME_MOMENT_MS)?.entity ?? "";
  const cleared = sorted
    .filter(({ e }) => e.kind === "trigger_cleared" && typeof e.entity === "string")
    .map(({ e, at }) => ({ at, entity: e.entity as string }));
  const out: Episode[] = [];
  let open: Episode | null = null;
  for (const { e, at } of sorted) {
    if (e.kind !== "status") continue;
    if (e.to === "triggered" && !open) {
      open = { entityId: near(at, firings), start: at, end: null, own: true };
      out.push(open);
    } else if (e.from === "triggered" && open) {
      open.end = at;
      if (!open.entityId) open.entityId = near(at, cleared);
      open = null;
    }
  }
  const traceStart = sorted.length ? sorted[0].at : Infinity;
  const lifecycle = history
    .filter((h) => h.type === "completed" || h.type === "skipped" || h.type === "reset")
    .map((h) => stampMs(h.timestamp))
    .filter((at) => Number.isFinite(at))
    .sort((a, b) => a - b);
  for (const f of firings) {
    if (f.at >= traceStart) break;
    const end = lifecycle.find((at) => at > f.at) ?? null;
    out.push(end === null || end > traceStart
      ? { entityId: f.entity, start: f.at, end: f.at, own: true, endUnknown: true }
      : { entityId: f.entity, start: f.at, end, own: true });
  }
  return out
    .filter((ep) => ep.start < before)
    .map((ep) => ((ep.end === null && !keepOpen) || (ep.end !== null && ep.end > before) ? { ...ep, end: before } : ep))
    .sort((a, b) => a.start - b.start);
}

/** The rule's alert state, as the backend's latch reads it. */
/** When a sensor's state is the rule's alert, as the backend decides it:
 *  - "state": a single-shot state rule (entity/triggers/state_change.py,
 *    `_in_alert_state`): the to-state, else anything but the from-state;
 *  - "number": a threshold (helpers/trigger_fallback.py, `threshold_exceeds`):
 *    above, below, equal to or not equal to its limits, a reading that is no
 *    number not counted. */
export type AlertRule =
  | { kind: "state"; to: string | null; from: string | null; holdMs: number }
  | { kind: "number"; above: number | null; below: number | null; equals: number | null; notEquals: number | null; holdMs: number };

const NOT_KNOWN = new Set(["unavailable", "unknown"]);

/** The state as a rule compares it (helpers/state_match.py, casefold). */
function norm(s: string): string {
  return s.trim().toLowerCase();
}

function holdOf(tc: TriggerConfig): number {
  return Math.max(0, Number(tc.trigger_for_minutes) || 0) * 60_000;
}

function num(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

/** A single-shot state rule's alert state; null for a change counter. */
function stateRule(tc: TriggerConfig): AlertRule | null {
  if ((tc.trigger_target_changes ?? 1) !== 1) return null;
  const to = typeof tc.trigger_to_state === "string" && tc.trigger_to_state.trim() ? norm(tc.trigger_to_state) : null;
  const from = typeof tc.trigger_from_state === "string" && tc.trigger_from_state.trim() ? norm(tc.trigger_from_state) : null;
  if (!to && !from) return null;
  return { kind: "state", to, from, holdMs: holdOf(tc) };
}

/** A threshold's limits; null without any. */
function numberRule(tc: TriggerConfig): AlertRule | null {
  const rule = {
    kind: "number" as const,
    above: num(tc.trigger_above),
    below: num(tc.trigger_below),
    equals: num(tc.trigger_equals),
    notEquals: num(tc.trigger_not_equals),
    holdMs: holdOf(tc),
  };
  return rule.above === null && rule.below === null && rule.equals === null && rule.notEquals === null ? null : rule;
}

/** Whether a threshold watches a code, not a reading: "= 3" or "≠ 0" and no
 *  limit above or below. A fault code, an operating mode. */
export function isDiscreteThreshold(tc: TriggerConfig | null | undefined): boolean {
  return (
    !!tc && (tc.type || "threshold") === "threshold" && num(tc.trigger_above) === null && num(tc.trigger_below) === null &&
    (num(tc.trigger_equals) !== null || num(tc.trigger_not_equals) !== null)
  );
}

/** The rule a single-source rule's timeline draws: a single-shot state rule,
 *  or a threshold on a code; null for every other rule (a reading keeps its
 *  line, a change counter its step line). An attribute is not in the states
 *  the timeline loads. */
export function alertRule(tc: TriggerConfig | null | undefined): AlertRule | null {
  if (!tc || tc.attribute) return null;
  if (tc.type === "state_change") return stateRule(tc);
  return isDiscreteThreshold(tc) ? numberRule(tc) : null;
}

/** What one condition of an AND/OR rule draws as its line: a single-shot
 *  state condition or any threshold; null for a condition that counts up
 *  until the service (a counter, a runtime, a change count, a date) or reads
 *  an attribute. */
export function conditionRule(cond: TriggerConfig): AlertRule | null {
  if (cond.attribute) return null;
  const type = cond.type || "threshold";
  if (type === "state_change") return stateRule(cond);
  return type === "threshold" ? numberRule(cond) : null;
}

const EPS = 1e-9;

/** Whether a state is the alert state; null when it is not known. */
export function isAlert(state: string, rule: AlertRule): boolean | null {
  const s = norm(state);
  if (NOT_KNOWN.has(s)) return null;
  if (rule.kind === "state") {
    if (rule.to) return s === rule.to;
    return s !== rule.from;
  }
  const v = Number(s);
  if (s === "" || !Number.isFinite(v)) return null;
  if (rule.above !== null && v > rule.above) return true;
  if (rule.below !== null && v < rule.below) return true;
  if (rule.equals !== null && Math.abs(v - rule.equals) <= Math.max(EPS, EPS * Math.abs(rule.equals))) return true;
  return rule.notEquals !== null && Math.abs(v - rule.notEquals) > Math.max(EPS, EPS * Math.abs(rule.notEquals));
}

/** Several sensors' segments as one line: "any" is in alert when one of
 *  them is, "all" when every one is (an AND/OR rule's condition on several
 *  sensors, and the rule itself over its conditions). A sensor that cannot
 *  be reached keeps its last known state, as the backend does (a latch
 *  clears on a real state only, a threshold skips what is no number): a
 *  router rebooting to install is still the alert. The line is "not known"
 *  only where nothing is known. */
export function combineSegments(lists: readonly (readonly Segment[])[], logic: "any" | "all", t0: number, t1: number): Segment[] {
  if (!lists.length) return [];
  const cuts = new Set<number>([t0, t1]);
  for (const list of lists) for (const s of list) { cuts.add(Math.max(t0, s.start)); cuts.add(Math.min(t1, s.end)); }
  const times = [...cuts].filter((x) => x >= t0 && x <= t1).sort((a, b) => a - b);
  const kindAt = (list: readonly Segment[], at: number): SegmentKind => {
    const i = list.findIndex((s) => s.start <= at && at < s.end);
    if (i < 0) return "nodata";
    if (list[i].kind !== "gone") return list[i].kind;
    for (let j = i - 1; j >= 0; j--) if (list[j].kind === "alarm" || list[j].kind === "ok") return list[j].kind;
    return "gone";
  };
  const out: Segment[] = [];
  for (let i = 0; i + 1 < times.length; i++) {
    const [a, b] = [times[i], times[i + 1]];
    const kinds = lists.map((l) => kindAt(l, a));
    const alarms = kinds.filter((k) => k === "alarm").length;
    const known = kinds.filter((k) => k === "alarm" || k === "ok").length;
    let kind: SegmentKind;
    if (logic === "any" ? alarms > 0 : alarms === kinds.length) kind = "alarm";
    else if (known > 0) kind = "ok";
    else kind = kinds.every((k) => k === "nodata") ? "nodata" : "gone";
    out.push({ start: a, end: b, kind });
  }
  return merged(out);
}

export function stampOf(row: RecordedState): number {
  const seconds = row.lu ?? row.lc;
  if (typeof seconds === "number") return seconds * 1000;
  return Date.parse(row.last_updated ?? row.last_changed ?? "");
}

/** One sensor's recorded states as segments from `t0` to `now`. The first
 *  row is the state at the start of the window. An alert shorter than the
 *  rule's hold time never fired: it counts as fine. */
export function segmentsOf(rows: readonly RecordedState[] | undefined, rule: AlertRule, t0: number, now: number): Segment[] {
  const points = (rows ?? [])
    .map((r) => ({ at: stampOf(r), state: r.s ?? r.state }))
    .filter((p): p is { at: number; state: string } => Number.isFinite(p.at) && typeof p.state === "string")
    .sort((a, b) => a.at - b.at);
  const raw: Segment[] = [];
  points.forEach((p, i) => {
    const start = Math.max(t0, p.at);
    const end = Math.min(now, i + 1 < points.length ? points[i + 1].at : now);
    if (end <= start) return;
    const alert = isAlert(p.state, rule);
    raw.push({ start, end, kind: alert === null ? "gone" : alert ? "alarm" : "ok" });
  });
  // Merged before the hold is judged: a state recorded twice in a row (an
  // attribute changed) is one alert.
  const held = merged(raw).map((s) => (s.kind === "alarm" && s.end - s.start < rule.holdMs && s.end < now ? { ...s, kind: "ok" as const } : s));
  return merged(held);
}

function merged(segments: readonly Segment[]): Segment[] {
  const out: Segment[] = [];
  for (const s of segments) {
    const last = out[out.length - 1];
    if (last && last.kind === s.kind && last.end === s.start) last.end = s.end;
    else out.push({ ...s });
  }
  return out;
}

/** The alerts in one sensor's segments: each from an alert segment to the
 *  next fine one, outages in between included. */
export function episodesOf(entityId: string, segments: readonly Segment[]): Episode[] {
  const out: Episode[] = [];
  let open: Episode | null = null;
  for (const s of segments) {
    if (s.kind === "alarm" && !open) {
      open = { entityId, start: s.start, end: null };
      out.push(open);
    } else if (s.kind === "ok" && open) {
      open.end = s.start;
      open = null;
    }
  }
  return out;
}

/** The newest alert of all sensors (by its start). */
export function latestEpisode(episodes: readonly Episode[]): Episode | null {
  let best: Episode | null = null;
  for (const e of episodes) if (!best || e.start > best.start) best = e;
  return best;
}

/** The completion recorded when an alert ended (the rule completing the
 *  task by itself, or somebody right then): the green tick at its end. */
export function doneAt(ep: Episode, history: readonly HistoryEntry[] | undefined): HistoryEntry | null {
  if (ep.end === null) return null;
  for (const h of history ?? []) {
    if (h.type !== "completed") continue;
    const at = stampMs(h.timestamp);
    if (at >= ep.end - 120_000 && at <= ep.end + 300_000) return h;
  }
  return null;
}

/** The recorded states with the live one after them when it is newer: the
 *  recorder writes every few seconds, and a report that just came in would
 *  wait for the next load. */
export function withLiveState(
  rows: readonly RecordedState[] | undefined,
  live: { state?: unknown; last_changed?: unknown } | undefined,
): RecordedState[] {
  const out = [...(rows ?? [])];
  const at = typeof live?.last_changed === "string" ? Date.parse(live.last_changed) : NaN;
  if (typeof live?.state !== "string" || !Number.isFinite(at)) return out;
  let last = -Infinity;
  for (const r of out) {
    const ts = stampOf(r);
    if (Number.isFinite(ts) && ts > last) last = ts;
  }
  if (at > last) out.push({ s: live.state, lu: at / 1000 });
  return out;
}

/** The first recorded instant of a sensor (NaN without any): the axis
 *  starts where the recorder's states do. */
export function firstStamp(rows: readonly RecordedState[] | undefined): number {
  let first = NaN;
  for (const r of rows ?? []) {
    const at = stampOf(r);
    if (Number.isFinite(at) && !(at >= first)) first = at;
  }
  return first;
}

/** Narrower than this on screen, an alert gets the magnifier. */
export const READABLE_PX = 24;

/** The span the magnifier shows: the newest alert and the ones the hours
 *  before it, padded. Null when every alert in the window reads at its own
 *  width, or when the magnifier would hardly enlarge anything. */
export function zoomWindow(
  episodes: readonly Episode[],
  t0: number,
  t1: number,
  trackPx: number,
): { start: number; end: number } | null {
  const span = t1 - t0;
  if (!episodes.length || !(span > 0) || !(trackPx > 0)) return null;
  const px = (ms: number): number => (ms / span) * trackPx;
  if (episodes.every((e) => px((e.end ?? t1) - e.start) >= READABLE_PX)) return null;
  const newest = latestEpisode(episodes)!;
  const near = episodes.filter((e) => e.start >= newest.start - 12 * 3_600_000);
  const lo = Math.min(...near.map((e) => e.start));
  const hi = Math.max(...near.map((e) => e.end ?? t1));
  const pad = Math.max(hi - lo, 20 * 60_000) * 0.2;
  const start = Math.max(t0, lo - pad);
  const end = Math.min(t1, hi + pad);
  if (end - start >= span * 0.5) return null;
  return { start, end };
}

/** Where on the track an instant lies, 0–100. */
export function pct(at: number, t0: number, t1: number): number {
  if (!(t1 > t0)) return 0;
  return Math.min(100, Math.max(0, ((at - t0) / (t1 - t0)) * 100));
}
