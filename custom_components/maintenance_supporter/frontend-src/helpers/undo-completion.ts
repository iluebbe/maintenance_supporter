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

export interface UndoResult {
  ok: boolean;
  message: string;
}

export async function undoCompletion(hass: HomeAssistant, entryId: string, taskId: string, lang: string): Promise<UndoResult> {
  try {
    const res = (await hass.connection.sendMessagePromise({
      type: "maintenance_supporter/task/undo",
      entry_id: entryId,
      task_id: taskId,
    })) as { action_ran?: boolean } | null;
    return { ok: true, message: t(res?.action_ran ? "undo_done_action_ran" : "undo_done", lang) };
  } catch (err) {
    const code = (err as { code?: string } | null)?.code;
    if (code === "changed_since") return { ok: false, message: t("undo_changed", lang) };
    if (code === "nothing_to_undo") return { ok: false, message: t("undo_nothing", lang) };
    return { ok: false, message: t("action_error", lang) };
  }
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
