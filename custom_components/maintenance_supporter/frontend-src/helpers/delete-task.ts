/** The question before a task is deleted, the same in the panel and in the
 *  card's quick actions.
 *
 *  #247: a buy task (`part_ref`) belongs to its part. Deleted on its own it
 *  came straight back while the part stayed low, and nothing said why. The
 *  question now says so and offers to turn the part's buy reminder off with
 *  it (ticked at first): `task/delete` then carries `disable_auto_buy_task`.
 */

import type { MaintenanceConfirmDialog } from "../components/confirm-dialog";
import { t } from "../styles";
import type { MaintenanceTask } from "../types";

/** The extra fields of the `task/delete` message, or null when cancelled. */
export async function askDeleteTask(
  dlg: MaintenanceConfirmDialog | null | undefined,
  task: Pick<MaintenanceTask, "part_ref"> | null | undefined,
  L: string,
): Promise<{ disable_auto_buy_task?: true } | null> {
  if (!dlg) return null;
  const base = { title: t("delete", L), confirmText: t("delete", L), danger: true };
  if (!task?.part_ref) {
    return (await dlg.confirm({ ...base, message: t("delete_task_confirm", L) })) ? {} : null;
  }
  const answer = await dlg.confirmWithCheck({
    ...base,
    message: t("delete_buy_task_confirm", L),
    check: t("delete_buy_task_off", L),
  });
  if (!answer.confirmed) return null;
  return answer.checked ? { disable_auto_buy_task: true } : {};
}
