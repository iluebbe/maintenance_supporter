/**
 * The history-edit dialog's draft, built from a history entry + its task —
 * ONE place for the field-by-field copy the panel, the quick-actions
 * dialog, the calendar card and the strategy shim each carried (DRY round
 * 2026-09: four copies, and the #161 photo / #130 parts / phase-2 readings
 * fields had to be added to every one of them).
 */

import type { HistoryEntryDraft } from "../components/history-edit-dialog";
import type { HistoryEntry, ReadingSlot } from "../types";
import { historyPhotoIds } from "./history-photos";
import { entryReadingValues } from "./reading-slots";

/** The task fields the draft needs — a MaintenanceTask or the slim shape
 *  the cards fetch through `maintenance_supporter/object`. */
export interface DraftTaskLike {
  type?: string | null;
  reading_unit?: string | null;
  readings?: ReadingSlot[] | null;
}

type UsedPart = { part_id: string; name?: string; quantity: number; entry_id?: string };

/** Build the draft for `entry` of task `taskId` in object `entryId`.
 *  Accepts the typed HistoryEntry and the raw `Record<string, unknown>` the
 *  Lovelace paths hold (every field is read defensively). */
export function buildHistoryEntryDraft(
  entryId: string,
  taskId: string,
  source: HistoryEntry | Record<string, unknown>,
  task: DraftTaskLike | null | undefined,
): HistoryEntryDraft {
  const entry = source as Record<string, unknown>;
  const str = (v: unknown): string | null => (typeof v === "string" ? v : null);
  const num = (v: unknown): number | null => (typeof v === "number" ? v : null);
  const timestamp = str(entry.timestamp) ?? "";
  return {
    entry_id: entryId,
    task_id: taskId,
    original_timestamp: timestamp,
    type: str(entry.type) || "completed",
    timestamp,
    notes: str(entry.notes),
    cost: num(entry.cost),
    duration: num(entry.duration),
    completed_by: str(entry.completed_by),
    used_parts: Array.isArray(entry.used_parts) ? (entry.used_parts as UsedPart[]) : null,
    photo_doc_ids: historyPhotoIds(entry),
    reading_value: num(entry.reading_value),
    reading_values: entryReadingValues(entry),
    readings: task?.readings ?? [],
    task_type: task?.type ?? null,
    reading_unit: task?.reading_unit ?? null,
  };
}

/** The minimal connection the Lovelace paths hold (the strategy shim reads
 *  `hass` off the <home-assistant> element, not through our HomeAssistant type). */
export interface DraftConnection {
  connection: { sendMessagePromise<T>(msg: Record<string, unknown>): Promise<T> };
}

interface ObjectWithHistory {
  tasks?: Array<DraftTaskLike & { id?: string; history?: Array<Record<string, unknown>> }>;
}

/** Fetch object → task → the entry stamped `timestamp` and build its draft;
 *  null when the task or entry is gone. Throws on a WS failure so the
 *  caller can fall back (deep link / ll-custom event). */
export async function loadHistoryEntryDraft(
  hass: DraftConnection,
  entryId: string,
  taskId: string,
  timestamp: string,
): Promise<HistoryEntryDraft | null> {
  const r = await hass.connection.sendMessagePromise<ObjectWithHistory>({
    type: "maintenance_supporter/object",
    entry_id: entryId,
  });
  const task = r.tasks?.find((tk) => tk.id === taskId);
  const entry = task?.history?.find((h) => h.timestamp === timestamp);
  if (!task || !entry) return null;
  return buildHistoryEntryDraft(entryId, taskId, entry, task);
}
