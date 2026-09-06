/** #161 phase 2: reading slots — several named values per completion.
 *
 * A `reading` task may declare slots (`task.readings`); each completion then
 * carries `reading_values` (a per-slot snapshot: name + unit copied at
 * completion time, `id` stable for deltas). Tasks without slots keep the
 * single `reading_value` with the task-level `reading_unit`. Mirrors
 * `helpers/reading_slots.py`.
 */

import type { HistoryEntry, ReadingSlot, ReadingValue } from "../types";

/** Mirrors MAX_READING_SLOTS in Python. */
export const MAX_READING_SLOTS = 20;

/** A fresh slot id for the task editor (the backend re-mints anything invalid). */
export function newReadingSlotId(): string {
  const bytes = new Uint8Array(4);
  (globalThis.crypto ?? { getRandomValues: (b: Uint8Array) => b.map(() => Math.floor(Math.random() * 256)) }).getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

/** The validated snapshot of one entry (tolerates loose WS shapes). */
export function entryReadingValues(entry: Pick<HistoryEntry, "reading_values"> | Record<string, unknown> | null | undefined): ReadingValue[] {
  const raw = (entry as { reading_values?: unknown } | null | undefined)?.reading_values;
  if (!Array.isArray(raw)) return [];
  const out: ReadingValue[] = [];
  const seen = new Set<string>();
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const v = item as Partial<ReadingValue>;
    if (typeof v.id !== "string" || !v.id || seen.has(v.id) || typeof v.value !== "number" || !Number.isFinite(v.value)) continue;
    seen.add(v.id);
    out.push({ id: v.id, name: typeof v.name === "string" ? v.name : v.id, unit: typeof v.unit === "string" ? v.unit : null, value: v.value });
  }
  return out;
}

/** Completed entries carrying readings, oldest first. */
function readingEntries(history: readonly HistoryEntry[]): HistoryEntry[] {
  return history
    .filter((h) => h.type === "completed" && (h.reading_value != null || entryReadingValues(h).length > 0))
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}

/** The most recent value per slot id (for the dialog's "last: …" hints and
 *  the lower-than-last warning), newest completion wins. */
export function lastReadingsBySlot(history: readonly HistoryEntry[] | null | undefined): Record<string, ReadingValue> {
  const out: Record<string, ReadingValue> = {};
  for (const entry of readingEntries(history ?? [])) {
    for (const v of entryReadingValues(entry)) out[v.id] = v;
  }
  return out;
}

/** One dated slot snapshot — what the complete dialog needs to find the
 *  last value BEFORE a backdated completion moment. */
export interface ReadingHistoryEntry {
  timestamp: string;
  values: ReadingValue[];
}

/** The slot snapshots of a history, oldest first (scalar-only entries drop out). */
export function readingHistory(history: readonly HistoryEntry[] | null | undefined): ReadingHistoryEntry[] {
  return readingEntries(history ?? [])
    .map((h) => ({ timestamp: h.timestamp, values: entryReadingValues(h) }))
    .filter((h) => h.values.length > 0);
}

/** The last value of one slot recorded strictly BEFORE `beforeMs` (all of
 *  history when undefined) — a January reading backfilled in March must
 *  compare against December, not against March. */
export function lastReadingBefore(entries: readonly ReadingHistoryEntry[], slotId: string, beforeMs?: number): ReadingValue | undefined {
  let last: ReadingValue | undefined;
  for (const h of entries) {
    if (beforeMs !== undefined) {
      const ts = new Date(h.timestamp).getTime();
      if (!isNaN(ts) && ts >= beforeMs) break;
    }
    const v = h.values.find((x) => x.id === slotId);
    if (v) last = v;
  }
  return last;
}

/** Delta of one slot against the previous completion that carried the same
 *  slot id (not the previous entry — a meter skipped once must not break
 *  the chain). null when there is no earlier value. */
export function readingSlotDelta(history: readonly HistoryEntry[], entry: HistoryEntry, slotId: string): number | null {
  const current = entryReadingValues(entry).find((v) => v.id === slotId);
  if (!current) return null;
  let previous: number | null = null;
  for (const h of readingEntries(history)) {
    if (h.timestamp >= entry.timestamp) break;
    const v = entryReadingValues(h).find((x) => x.id === slotId);
    if (v) previous = v.value;
  }
  return previous == null ? null : current.value - previous;
}

/** Ids of editor rows whose name repeats an EARLIER row (case-insensitive)
 *  — the backend keeps the first and drops the rest, so warn on those. */
export function duplicateReadingSlotIds(slots: readonly ReadingSlot[]): Set<string> {
  const seen = new Set<string>();
  const dupes = new Set<string>();
  for (const s of slots) {
    const key = (s.name || "").trim().toLowerCase();
    if (!key) continue;
    if (seen.has(key)) dupes.add(s.id);
    else seen.add(key);
  }
  return dupes;
}

/** The slot list a task editor works on: dropped empties, trimmed names,
 *  duplicate ids AND names dropped (first wins — mirrors the backend). */
export function cleanReadingSlots(slots: readonly ReadingSlot[]): ReadingSlot[] {
  const out: ReadingSlot[] = [];
  const seen = new Set<string>();
  const seenNames = new Set<string>();
  for (const s of slots) {
    const name = (s.name || "").trim();
    if (!name || seen.has(s.id) || seenNames.has(name.toLowerCase())) continue;
    seen.add(s.id);
    seenNames.add(name.toLowerCase());
    out.push({ id: s.id, name, unit: (s.unit || "").trim() || null });
    if (out.length >= MAX_READING_SLOTS) break;
  }
  return out;
}
