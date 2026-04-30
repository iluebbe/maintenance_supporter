/**
 * Pure helper for the panel's Calendar tab (v1.5.0+).
 *
 * Given the loaded objects, a window in days, and an optional user filter,
 * produce a flat day-bucketed event list ready for rendering.
 *
 * Recurring projection (time-based tasks): the first occurrence is the task's
 * next_due (or "today" if overdue/triggered). Subsequent occurrences are
 * projected by adding interval_days repeatedly until the window end, capped
 * at MAX_OCCURRENCES_PER_TASK to prevent absurdly small intervals (e.g. a
 * 1-day-interval task in a 30-day window would otherwise produce 30 entries).
 *
 * Sensor-triggered tasks: only next_due is shown — we have no honest way to
 * predict when a sensor will next fire.
 */

import type { MaintenanceObjectResponse } from "../types";

export const MAX_OCCURRENCES_PER_TASK = 5;

export interface CalendarEvent {
  /** ISO date string (YYYY-MM-DD) — the day this event is bucketed under. */
  date: string;
  entry_id: string;
  task_id: string;
  task_name: string;
  object_name: string;
  status: string;        // "ok" | "due_soon" | "overdue" | "triggered"
  days_until_due: number | null;
  /** True if this is a projected recurrence (not the actual next_due). */
  projected: boolean;
  schedule_type: string;
  interval_days: number | null;
  responsible_user_id: string | null;
  avg_cost: number | null;
  /** v1.5.1: source indicator. */
  adaptive_enabled: boolean;
  /** v1.5.1: sensor prediction confidence ("low" | "medium" | "high") or null
   *  for time-based / no prediction available. */
  prediction_confidence: string | null;
}

export interface CalendarDayBucket {
  date: string;          // ISO date YYYY-MM-DD
  events: CalendarEvent[];
}

/**
 * Format a Date as ISO YYYY-MM-DD using LOCAL time components — matches what
 * the user sees on their wall clock, not UTC. The naive `.toISOString().slice(0,10)`
 * approach silently shifts dates near midnight in non-UTC timezones.
 */
export function isoDateLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Build the list of N consecutive ISO dates starting today (local). */
export function buildWindowDates(today: Date, windowDays: number): string[] {
  const out: string[] = [];
  for (let i = 0; i < windowDays; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    d.setHours(0, 0, 0, 0);
    out.push(isoDateLocal(d));
  }
  return out;
}

/** Add `days` to an ISO date (local), return new ISO date. */
function addDaysIso(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  return isoDateLocal(date);
}

/** Average cost from history rows (mirrors the panel's avg-cost calc). */
function computeAvgCost(history: Array<{ cost?: number | null }> | undefined): number | null {
  if (!history || history.length === 0) return null;
  const costs = history.map((h) => h.cost).filter((c): c is number => typeof c === "number");
  if (costs.length === 0) return null;
  return costs.reduce((a, b) => a + b, 0) / costs.length;
}

interface ProjectionInput {
  windowStart: string;
  windowEnd: string;   // inclusive
  task: any;           // panel's task shape from MaintenanceObjectResponse
  entryId: string;
  objectName: string;
}

/**
 * Project up to MAX_OCCURRENCES_PER_TASK occurrences for a single task.
 * Returns events keyed by their bucketed date.
 */
function projectTask(input: ProjectionInput): CalendarEvent[] {
  const { windowStart, windowEnd, task, entryId, objectName } = input;
  const out: CalendarEvent[] = [];

  const baseEvent = (date: string, projected: boolean): CalendarEvent => ({
    date,
    entry_id: entryId,
    task_id: task.id,
    task_name: task.name,
    object_name: objectName,
    // Projected recurrences are hypothetical future occurrences that assume
    // the current cycle resolves on schedule. If the parent task is currently
    // overdue/triggered, carrying that status forward to the projection (e.g.
    // "OVERDUE 211d" on the May 7 projection of a 7-day-interval task) is
    // misleading — the projection IS the assumption that the user completes
    // it today, so the projected slot should read as a fresh "ok" event.
    status: projected && (task.status === "overdue" || task.status === "triggered")
      ? "ok"
      : task.status,
    days_until_due: projected ? null : (task.days_until_due ?? null),
    projected,
    schedule_type: task.schedule_type,
    interval_days: task.interval_days ?? null,
    responsible_user_id: task.responsible_user_id ?? null,
    avg_cost: computeAvgCost(task.history),
    adaptive_enabled: !!task.adaptive_config?.enabled,
    prediction_confidence: task.threshold_prediction_confidence ?? null,
  });

  // Overdue / triggered → bucket on today (windowStart) regardless of next_due
  if (task.status === "overdue" || task.status === "triggered") {
    out.push(baseEvent(windowStart, false));
    // Continue projecting from "today" forward for time-based tasks
    if (task.schedule_type === "time_based" && task.interval_days && task.interval_days > 0) {
      let cursor = addDaysIso(windowStart, task.interval_days);
      let count = 1;
      while (cursor <= windowEnd && count < MAX_OCCURRENCES_PER_TASK) {
        out.push(baseEvent(cursor, true));
        count++;
        cursor = addDaysIso(cursor, task.interval_days);
      }
    }
    return out;
  }

  // Non-actionable status (ok / due_soon): need a next_due
  const nextDue = task.next_due;
  if (typeof nextDue !== "string" || !nextDue) return out;
  const firstDate = nextDue.slice(0, 10);  // strip time portion if any

  // First occurrence must be in window
  if (firstDate >= windowStart && firstDate <= windowEnd) {
    out.push(baseEvent(firstDate, false));
  } else if (firstDate > windowEnd) {
    return out;  // entire occurrence chain is past window
  }

  // Subsequent projected occurrences (time-based only, with interval_days)
  if (task.schedule_type === "time_based" && task.interval_days && task.interval_days > 0) {
    let cursor = addDaysIso(firstDate, task.interval_days);
    let count = out.length;
    while (cursor <= windowEnd && count < MAX_OCCURRENCES_PER_TASK) {
      // Skip occurrences before window start (when next_due itself was past)
      if (cursor >= windowStart) {
        out.push(baseEvent(cursor, true));
        count++;
      }
      cursor = addDaysIso(cursor, task.interval_days);
    }
  }

  return out;
}

/** Status sort priority: lower = shown first. */
const STATUS_RANK: Record<string, number> = {
  overdue: 0,
  triggered: 1,
  due_soon: 2,
  ok: 3,
};

/**
 * Main entry point: build the day-bucketed event list for the Calendar tab.
 *
 * @param objects   The panel's loaded objects (with nested tasks).
 * @param today     "Today" as a Date (caller passes new Date() — easier for tests).
 * @param windowDays Number of days to include (7 / 14 / 30).
 * @param userFilter null/empty = all; otherwise filter tasks by responsible_user_id.
 */
export function buildCalendarBuckets(
  objects: MaintenanceObjectResponse[],
  today: Date,
  windowDays: number,
  userFilter: string | null = null,
): CalendarDayBucket[] {
  const days = buildWindowDates(today, windowDays);
  const windowStart = days[0];
  const windowEnd = days[days.length - 1];

  const allEvents: CalendarEvent[] = [];
  for (const obj of objects) {
    const objectName = obj.object?.name || "";
    const entryId = obj.entry_id;
    const tasks = obj.tasks || [];
    for (const task of tasks) {
      // User filter
      if (userFilter && task.responsible_user_id !== userFilter) continue;
      // Disabled tasks never produce calendar events
      if (task.enabled === false) continue;
      const projected = projectTask({
        windowStart, windowEnd, task, entryId, objectName,
      });
      allEvents.push(...projected);
    }
  }

  // Bucket by date
  const byDate = new Map<string, CalendarEvent[]>();
  for (const day of days) byDate.set(day, []);
  for (const ev of allEvents) {
    const bucket = byDate.get(ev.date);
    if (bucket) bucket.push(ev);
  }

  // Sort within day: status priority first, then projected last, then by name
  for (const [, evs] of byDate) {
    evs.sort((a, b) => {
      const rA = STATUS_RANK[a.status] ?? 99;
      const rB = STATUS_RANK[b.status] ?? 99;
      if (rA !== rB) return rA - rB;
      if (a.projected !== b.projected) return a.projected ? 1 : -1;
      const cmp = a.object_name.localeCompare(b.object_name);
      if (cmp !== 0) return cmp;
      return a.task_name.localeCompare(b.task_name);
    });
  }

  return days.map((d) => ({ date: d, events: byDate.get(d) ?? [] }));
}
