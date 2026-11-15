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
 *  (unavailable / unknown — the device could not be reached). */
export type SegmentKind = "alarm" | "ok" | "gone";

export interface Segment {
  start: number;
  end: number;
  kind: SegmentKind;
}

/** One alert of one sensor: from its alert state until it was fine again
 *  (an outage in between belongs to it — a router reboots to install).
 *  `end` null: still in alert, or not reached since. */
export interface Episode {
  entityId: string;
  start: number;
  end: number | null;
}

/** The rule's alert state, as the backend's latch reads it. */
export interface AlertRule {
  to: string | null;
  from: string | null;
  holdMs: number;
}

const NOT_KNOWN = new Set(["unavailable", "unknown"]);

/** The state as a rule compares it (helpers/state_match.py, casefold). */
function norm(s: string): string {
  return s.trim().toLowerCase();
}

/** A single-shot state rule's alert state, or null for every other rule
 *  (a change counter keeps its line). */
export function alertRule(tc: TriggerConfig | null | undefined): AlertRule | null {
  if (!tc || tc.type !== "state_change") return null;
  if ((tc.trigger_target_changes ?? 1) !== 1) return null;
  const to = typeof tc.trigger_to_state === "string" && tc.trigger_to_state.trim() ? norm(tc.trigger_to_state) : null;
  const from = typeof tc.trigger_from_state === "string" && tc.trigger_from_state.trim() ? norm(tc.trigger_from_state) : null;
  if (!to && !from) return null;
  return { to, from, holdMs: Math.max(0, Number(tc.trigger_for_minutes) || 0) * 60_000 };
}

/** Whether a state is the alert state; null when it is not known. */
export function isAlert(state: string, rule: AlertRule): boolean | null {
  const s = norm(state);
  if (NOT_KNOWN.has(s)) return null;
  if (rule.to) return s === rule.to;
  return s !== rule.from;
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
