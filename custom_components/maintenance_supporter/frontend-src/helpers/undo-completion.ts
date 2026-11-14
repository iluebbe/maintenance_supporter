/**
 * Undo a completion the current person just made — the panel's and the
 * dashboard card's toast action (2026-10).
 *
 * The server remembers each person's last completion for ten minutes
 * (`task/undo`, the record the voice "undo that" uses too) and restores the
 * history, the cycle anchor, the phase, the learning and the parts stock. It
 * refuses for another task than the toast's, after the ten minutes, and when
 * the task changed since; what already ran outside (a completion action,
 * notifications) stays — the success message says so when the task has an
 * action.
 */
import { t } from "../styles";
import type { HomeAssistant } from "../types";
import { runWs } from "./ws-run";

export interface UndoResult {
  ok: boolean;
  message: string;
}

/** The two refusals the toast explains in its own words; any other one reads
 *  as runWs puts it (the server's reason, or "restart Home Assistant" while
 *  an update waits for it) — it used to be the bare "Action failed". */
const UNDO_REFUSALS: Record<string, string> = { changed_since: "undo_changed", nothing_to_undo: "undo_nothing" };

export async function undoCompletion(hass: HomeAssistant, entryId: string, taskId: string, lang: string): Promise<UndoResult> {
  let failure = "";
  const res = await runWs<{ action_ran?: boolean } | null>(
    { hass },
    { type: "maintenance_supporter/task/undo", entry_id: entryId, task_id: taskId },
    {
      lang,
      onError: (message, err) => {
        const key = UNDO_REFUSALS[(err as { code?: string } | null)?.code ?? ""];
        failure = key ? t(key, lang) : message;
      },
    },
  );
  if (res === undefined) return { ok: false, message: failure };
  return { ok: true, message: t(res?.action_ran ? "undo_done_action_ran" : "undo_done", lang) };
}

/** The answer to a completion the server's double-tap guard dropped (the
 *  same task completed seconds before, here or on another device): what the
 *  surfaces say instead of "completed" with an Undo; null for a completion
 *  that was recorded. The second tap used to read as done, silently. */
export function alreadyRecordedMessage(res: unknown, lang: string): string | null {
  const seconds = (res as { already_recorded_seconds?: unknown } | null)?.already_recorded_seconds;
  return typeof seconds === "number" ? t("completion_already_recorded", lang).replace("{seconds}", String(seconds)) : null;
}

/** What a surface without a toast of its own says after a quick completion
 *  (#233): Home Assistant's toast with Undo, else "Quickly marked complete".
 *  The card said so; the quick-actions dialog closed silently when there was
 *  nothing to undo (DRY audit 2026-10-30, FE6-A4). */
export function confirmQuickComplete(
  el: HTMLElement,
  hass: HomeAssistant,
  detail: { entryId: string; taskId: string; taskName: string },
  undo: boolean,
  lang: string,
  after: () => void,
): void {
  if (undo) {
    offerUndoToast(el, hass, detail, lang, after);
    return;
  }
  el.dispatchEvent(new CustomEvent("hass-notification", { detail: { message: t("quick_complete_success", lang) }, bubbles: true, composed: true }));
}

/** Home Assistant's own toast with an Undo button — for surfaces without a
 *  toast of their own (the dashboard card). The outcome is a second toast;
 *  `after` runs after a successful undo (reload the list). */
export function offerUndoToast(
  el: HTMLElement,
  hass: HomeAssistant,
  detail: { entryId: string; taskId: string; taskName: string },
  lang: string,
  after: () => void,
): void {
  const notify = (message: string, action?: { text: string; action: () => void }) =>
    el.dispatchEvent(
      new CustomEvent("hass-notification", {
        detail: action ? { message, action, duration: 10000 } : { message },
        bubbles: true,
        composed: true,
      }),
    );
  notify(t("task_completed_named", lang).replace("{task}", detail.taskName), {
    text: t("undo", lang),
    action: () => {
      void undoCompletion(hass, detail.entryId, detail.taskId, lang).then((res) => {
        notify(res.message);
        if (res.ok) after();
      });
    },
  });
}
