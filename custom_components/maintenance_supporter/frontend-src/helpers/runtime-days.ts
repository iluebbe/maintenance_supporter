/** A runtime rule's hours per day, as the backend books them
 *  (entity/triggers/runtime.py): a run lasts from a state that counts as
 *  running until the next one that does not; unavailable pauses it; with a
 *  per-session cap (#149) a run books at most the cap, from its start.
 *
 *  The chart of a runtime rule was a straight line from 0 at the last
 *  service to the hours now: it said nothing the progress bar does not, and
 *  looked like the device ran evenly. Days as bars show how it ran.
 *  Pure, unit-tested in timeline-more-2026-11-15.test.ts. */

import { addDaysIso, haTimeZone, stampMs, ymdIn } from "./ha-time";
import { stampOf, type RecordedState } from "./state-timeline";

/** What counts as running without the rule's own list (runtime.py). */
export const DEFAULT_ON_STATES: readonly string[] = ["on", "1", "true"];

/** The booked runs as [start, end) intervals, clipped to [t0, t1]. */
export function runtimeIntervals(
  rows: readonly RecordedState[] | undefined,
  onStates: readonly string[] | null | undefined,
  t0: number,
  t1: number,
  capMs: number | null,
): Array<[number, number]> {
  const on = new Set((onStates?.length ? onStates : DEFAULT_ON_STATES).map((s) => s.trim().toLowerCase()).filter(Boolean));
  const points = (rows ?? [])
    .map((r) => ({ at: stampOf(r), state: r.s ?? r.state }))
    .filter((p): p is { at: number; state: string } => Number.isFinite(p.at) && typeof p.state === "string")
    .sort((a, b) => a.at - b.at);
  const out: Array<[number, number]> = [];
  const book = (start: number, end: number) => {
    const capped = capMs !== null && capMs > 0 ? Math.min(end, start + capMs) : end;
    const a = Math.max(start, t0);
    const b = Math.min(capped, t1);
    if (b > a) out.push([a, b]);
  };
  let start: number | null = null;
  for (const p of points) {
    const running = on.has(p.state.toLowerCase());
    if (running && start === null) start = p.at;
    else if (!running && start !== null) {
      book(start, p.at);
      start = null;
    }
  }
  if (start !== null) book(start, t1);
  return out;
}

export interface RuntimeBucket {
  /** The bucket's first HA day, "YYYY-MM-DD". */
  day: string;
  start: number;
  end: number;
  hours: number;
}

/** The booked hours per HA day (or per seven days for a long range),
 *  from the day of `t0` to the day of `t1`. */
export function hoursPerBucket(intervals: ReadonlyArray<readonly [number, number]>, t0: number, t1: number, days = 1): RuntimeBucket[] {
  const zone = haTimeZone();
  const out: RuntimeBucket[] = [];
  let day = ymdIn(t0, zone);
  for (let guard = 0; guard < 800; guard++) {
    const start = stampMs(day);
    if (!(start < t1)) break;
    const next = addDaysIso(day, days);
    const end = stampMs(next);
    let ms = 0;
    for (const [a, b] of intervals) {
      const lo = Math.max(a, start, t0);
      const hi = Math.min(b, end, t1);
      if (hi > lo) ms += hi - lo;
    }
    out.push({ day, start, end, hours: ms / 3_600_000 });
    day = next;
  }
  return out;
}

/** How long until the target at the pace of the shown days: null when it
 *  is reached, or nothing ran. In ms. */
export function untilTarget(current: number | null | undefined, target: number | null | undefined, hoursPerDay: number): number | null {
  if (typeof current !== "number" || typeof target !== "number" || !(target > current) || !(hoursPerDay > 0)) return null;
  return ((target - current) / hoursPerDay) * 86_400_000;
}
