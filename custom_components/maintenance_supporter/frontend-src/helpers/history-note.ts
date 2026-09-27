/**
 * The notes the backend writes into history entries itself ("Completed from
 * dashboard button", "Sensor trigger activated" …) in the user's language
 * (i18n audit 2026-09-27: they showed in English everywhere). Stored data
 * stays as it is — the text is translated where it is shown, so old entries
 * are covered too. A note a person typed never matches and is shown as is.
 *
 * The English wording mirrors the backend (const.COMPLETION_PROVENANCE_NOTES,
 * the skip reasons, coordinator/repairs notes); tests/test_i18n.py fails when
 * one of them changes without this table.
 */

import { formatDate, t } from "../styles";

const EXACT: Record<string, string> = {
  "Completed from dashboard button": "hist_note_button",
  "Completed from the To-do list": "hist_note_todo",
  "Completed by voice": "hist_note_voice",
  "Completed from the notification": "hist_note_notification",
  "Completed via NFC tag": "hist_note_nfc",
  "Completed from the shopping list": "hist_note_shopping_list",
  "Completed from a mirrored to-do list": "hist_note_todo_mirror",
  "Skipped from notification": "hist_note_skipped_notification",
  "Skipped from dashboard button": "hist_note_skipped_button",
  "Sensor trigger activated": "hist_note_sensor_triggered",
  "Initial value set during task creation": "hist_note_initial",
};

type Fill = (m: RegExpMatchArray, lang: string) => Record<string, string>;
const PATTERNS: Array<[RegExp, string, Fill]> = [
  [/^Auto-completed: sensor recovered \((.+)\)$/, "hist_note_auto_recovered", (m) => ({ value: m[1] })],
  [/^Reset to (\d{4}-\d{2}-\d{2})$/, "hist_note_reset", (m, lang) => ({ date: formatDate(m[1], lang) })],
  [/^Trigger entity replaced: (.+) → (.+)$/, "hist_note_trigger_replaced", (m) => ({ old: m[1], new: m[2] })],
  [
    /^Sensor trigger removed \(entity was: (.+)\)\. Schedule converted to (\w+)\.$/,
    "hist_note_trigger_removed",
    (m, lang) => ({ entity: m[1], schedule: t(m[2], lang) }),
  ],
  [
    /^Entity (.+) removed from compound trigger; (\d+) conditions remain\.$/,
    "hist_note_compound_removed",
    (m) => ({ entity: m[1], count: m[2] }),
  ],
];

/** The history note as the user should read it. */
export function historyNoteText(notes: string | null | undefined, lang: string): string {
  if (!notes) return "";
  const exact = EXACT[notes.trim()];
  if (exact) return t(exact, lang);
  for (const [re, key, fill] of PATTERNS) {
    const m = notes.trim().match(re);
    if (m) {
      const values = fill(m, lang);
      return t(key, lang).replace(/\{(\w+)\}/g, (all, name: string) => values[name] ?? all);
    }
  }
  return notes;
}
