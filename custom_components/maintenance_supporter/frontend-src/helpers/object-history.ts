/** Object lifecycle history (#138): merge every task's history into one
 * chronological, cross-task record — the "vehicle service booklet" view.
 *
 * Pure functions over data the object response already carries (plus the
 * full per-task histories fetched lazily by the section); no new data model.
 */

import type { HistoryEntry } from "../types";

/** One merged lifecycle row: a task's history entry plus its task identity. */
export interface ObjectHistoryEntry {
  ts: number;
  timestamp: string;
  taskId: string;
  taskName: string;
  type: string;
  cost: number | null;
  duration: number | null;
  notes: string | null;
  completedBy: string | null;
  /** #139: name of the cycle phase this completion recorded (null when the
   *  task is phase-less or the entry predates its phases). */
  phaseName: string | null;
}

/** Entry types that belong in a lifecycle record — mirrors the task detail's
 * editable set plus "missed" (a skipped-by-neglect cycle is part of the
 * object's story). Trigger noise (triggered / trigger_replaced) is not. */
const LIFECYCLE_TYPES = new Set(["completed", "skipped", "reset", "missed"]);

export function mergeObjectHistory(
  tasks: ReadonlyArray<{
    id: string;
    name: string;
    history?: HistoryEntry[] | null;
    phases?: Record<string, { name: string }> | null;
  }>,
): ObjectHistoryEntry[] {
  const out: ObjectHistoryEntry[] = [];
  for (const task of tasks) {
    for (const h of task.history ?? []) {
      if (!LIFECYCLE_TYPES.has(h.type)) continue;
      const ts = new Date(h.timestamp).getTime();
      if (!Number.isFinite(ts)) continue;
      out.push({
        ts,
        timestamp: h.timestamp,
        taskId: task.id,
        taskName: task.name,
        type: h.type,
        cost: typeof h.cost === "number" ? h.cost : null,
        duration: typeof h.duration === "number" ? h.duration : null,
        notes: h.notes ?? null,
        completedBy: h.completed_by ?? null,
        phaseName: (h.phase_id && task.phases?.[h.phase_id]?.name) || null,
      });
    }
  }
  // Most recent first; equal timestamps keep a stable task-name order so
  // re-renders don't shuffle rows.
  out.sort((a, b) => b.ts - a.ts || a.taskName.localeCompare(b.taskName));
  return out;
}

export interface ObjectHistoryFilter {
  taskId?: string | null;
  /** Inclusive ISO dates (YYYY-MM-DD, local calendar). */
  from?: string | null;
  to?: string | null;
}

export function filterObjectHistory(
  entries: ReadonlyArray<ObjectHistoryEntry>,
  f: ObjectHistoryFilter,
): ObjectHistoryEntry[] {
  const fromTs = f.from ? new Date(`${f.from}T00:00:00`).getTime() : null;
  // `to` is inclusive: compare against the START of the following day.
  const toTs = f.to ? new Date(`${f.to}T00:00:00`).getTime() + 86400000 : null;
  return entries.filter((e) => {
    if (f.taskId && e.taskId !== f.taskId) return false;
    if (fromTs != null && e.ts < fromTs) return false;
    if (toTs != null && e.ts >= toTs) return false;
    return true;
  });
}

/** Completed-entry totals for the footer / the printable record. */
export function objectHistoryTotals(entries: ReadonlyArray<ObjectHistoryEntry>): {
  completed: number;
  totalCost: number;
} {
  let completed = 0;
  let totalCost = 0;
  for (const e of entries) {
    if (e.type !== "completed") continue;
    completed++;
    if (e.cost != null) totalCost += e.cost;
  }
  return { completed, totalCost };
}
