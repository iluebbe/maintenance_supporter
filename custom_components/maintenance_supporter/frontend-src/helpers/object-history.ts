/** Object lifecycle history (#138): merge every task's history into one
 * chronological, cross-task record — the "vehicle service booklet" view.
 *
 * Pure functions over data the object response already carries (plus the
 * full per-task histories fetched lazily by the section); no new data model.
 */

import type { HistoryEntry, ReadingValue } from "../types";
import { historyPhotoIds } from "./history-photos";

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
  /** #170: the completion's number within its task ("8.3-2" → 2). */
  refNo: number | null;
  /** #170: the task's number within the object ("8.3" → 3). */
  taskRefNo: number | null;
  /** Readings recorded on this completion — slots (#161) or the scalar
   *  reading (v2.20); `delta` against the previous entry carrying the same
   *  slot, null for the first one. */
  readings: Array<{ name: string; value: number; unit: string; delta: number | null }>;
  /** Parts consumed by this completion (name snapshot + quantity). */
  parts: Array<{ name: string; quantity: number }>;
  /** Completion photos (document ids; the booklet resolves names/urls). */
  photoIds: string[];
  /** Checklist ticks recorded with the completion, null without one. */
  checklist: { done: number; total: number } | null;
}

/** Entry types that belong in a lifecycle record — mirrors the task detail's
 * editable set plus "missed" (a skipped-by-neglect cycle is part of the
 * object's story). Trigger noise (triggered / trigger_replaced) is not. */
const LIFECYCLE_TYPES = new Set(["completed", "skipped", "reset", "missed"]);

/** The readings an entry recorded: per-slot snapshot (#161) or the scalar. */
function entryReadings(h: HistoryEntry, unit: string | null | undefined): Array<{ id: string; name: string; value: number; unit: string }> {
  const slots = (h.reading_values || []) as ReadingValue[];
  if (slots.length) {
    return slots
      .filter((r) => typeof r.value === "number")
      .map((r) => ({ id: r.id, name: r.name || "", value: r.value as number, unit: r.unit || "" }));
  }
  if (typeof h.reading_value === "number") return [{ id: "", name: "", value: h.reading_value, unit: unit || "" }];
  return [];
}

export function mergeObjectHistory(
  tasks: ReadonlyArray<{
    id: string;
    name: string;
    history?: HistoryEntry[] | null;
    phases?: Record<string, { name: string }> | null;
    ref_no?: number | null;
    reading_unit?: string | null;
    checklist?: string[] | null;
  }>,
): ObjectHistoryEntry[] {
  const out: ObjectHistoryEntry[] = [];
  for (const task of tasks) {
    // Deltas need the task's entries in time order — the previous entry
    // carrying the same slot (a skipped meter keeps its chain, #161).
    const chrono = [...(task.history ?? [])]
      .map((h) => ({ h, ts: new Date(h.timestamp).getTime() }))
      .filter((x) => Number.isFinite(x.ts))
      .sort((a, b) => a.ts - b.ts);
    const lastBySlot = new Map<string, number>();
    for (const { h, ts } of chrono) {
      const readings = entryReadings(h, task.reading_unit).map((r) => {
        const prev = lastBySlot.get(r.id);
        lastBySlot.set(r.id, r.value);
        return { name: r.name, value: r.value, unit: r.unit, delta: prev == null ? null : r.value - prev };
      });
      if (!LIFECYCLE_TYPES.has(h.type)) continue;
      const ticks = h.checklist_state && typeof h.checklist_state === "object" ? Object.values(h.checklist_state) : null;
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
        refNo: typeof h.ref_no === "number" ? h.ref_no : null,
        taskRefNo: typeof task.ref_no === "number" ? task.ref_no : null,
        readings,
        parts: (h.used_parts || []).filter((p) => p && (p.name || p.part_id)).map((p) => ({ name: p.name || p.part_id, quantity: typeof p.quantity === "number" ? p.quantity : 1 })),
        photoIds: historyPhotoIds(h),
        checklist: ticks && ticks.length ? { done: ticks.filter(Boolean).length, total: ticks.length } : null,
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
