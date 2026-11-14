/** #233: *Quick complete*, a task that completes without a dialog.
 *
 * Mirrors `helpers/completion_requirements.py`: the switch is the presence of
 * `quick_complete_defaults` (an empty object is "on, nothing to prefill"),
 * and the object holds the prefill every completion without a dialog
 * records. The completion dialog starts with it too.
 *
 * {@link quickComplete} is the one-tap path the card, the quick-actions
 * dialog and the panel share (the panel had its own copy, with its own list
 * of the refusals that open the dialog: DRY audit 2026-10-30, FE6-B1): it
 * answers what happened, and "dialog" when the task needs the dialog after
 * all (a required photo, a reading, a tag scan the tap is not), which the
 * caller then opens.
 */
import type { HomeAssistant, MaintenanceTask } from "../types";
import { runWs } from "./ws-run";
import { alreadyRecordedMessage } from "./undo-completion";

export type QuickCompleteValues = NonNullable<MaintenanceTask["quick_complete_defaults"]>;

/** Is the task's *Quick complete* on? */
export function quickCompleteOn(task: { quick_complete_defaults?: QuickCompleteValues | null } | null | undefined): boolean {
  const v = task?.quick_complete_defaults;
  return !!v && typeof v === "object" && !Array.isArray(v);
}

/** The prefill (null while *Quick complete* is off). */
export function quickCompleteValues(task: { quick_complete_defaults?: QuickCompleteValues | null } | null | undefined): QuickCompleteValues | null {
  return quickCompleteOn(task) ? { ...task!.quick_complete_defaults! } : null;
}

export type QuickCompleteOutcome =
  | { result: "done"; undo: boolean }
  /** The double-tap guard dropped it: completed seconds before (the message says when). */
  | { result: "already"; message: string }
  | { result: "dialog" }
  | { result: "failed"; message: string };

/** The refusals that mean "the dialog has to collect something": Quick
 *  complete is off, details the prefill does not cover, a tag scan the tap
 *  is not. tests/test_frontend_const_parity.py pins each to a code the
 *  server sends. */
export const NEEDS_DIALOG = new Set(["no_defaults", "completion_details_required", "tag_scan_required"]);

/** Complete in one tap from a dashboard surface (never proof of presence),
 *  or after the panel's QR scan (``source: "qr"``). */
export async function quickComplete(
  hass: HomeAssistant, entryId: string, taskId: string, lang: string, source: "panel" | "qr" = "panel",
): Promise<QuickCompleteOutcome> {
  let failure: { message: string; code: string } = { message: "", code: "" };
  const res = await runWs<{ undo?: boolean } | null>(
    { hass },
    { type: "maintenance_supporter/task/quick_complete", entry_id: entryId, task_id: taskId, source },
    {
      lang,
      fallbackKey: "action_error",
      onError: (message, err) => {
        failure = { message, code: (err as { code?: string } | null)?.code ?? "" };
      },
    },
  );
  if (res === undefined) {
    return NEEDS_DIALOG.has(failure.code) ? { result: "dialog" } : { result: "failed", message: failure.message };
  }
  const already = alreadyRecordedMessage(res, lang);
  if (already) return { result: "already", message: already };
  return { result: "done", undo: res?.undo === true };
}
