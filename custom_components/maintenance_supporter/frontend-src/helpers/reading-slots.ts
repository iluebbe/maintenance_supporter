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

/** The slot list a task editor works on: dropped empties, trimmed names. */
export function cleanReadingSlots(slots: readonly ReadingSlot[]): ReadingSlot[] {
  const out: ReadingSlot[] = [];
  const seen = new Set<string>();
  for (const s of slots) {
    const name = (s.name || "").trim();
    if (!name || seen.has(s.id)) continue;
    seen.add(s.id);
    out.push({ id: s.id, name, unit: (s.unit || "").trim() || null });
    if (out.length >= MAX_READING_SLOTS) break;
  }
  return out;
}
