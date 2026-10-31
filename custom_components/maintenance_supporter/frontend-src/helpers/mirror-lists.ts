/** The to-do lists a task can be mirrored into (D#183, #231): the rule both
 *  pickers apply, Settings' default lists and the task dialog's own lists.
 *  The dialog offered every list without a cap and with our own, and the
 *  backend refused the save in the words of a text that is too long (DRY
 *  audit 2026-10-30, X6-A3). */

import type { HomeAssistant } from "../types";

/** const.MAX_MIRROR_TODO_LISTS (tests/test_frontend_const_parity.py). */
export const MAX_MIRROR_TODO_LISTS = 5;

/** Maintenance Supporter's own list: it takes no rows (helpers/todo_mirror
 *  mirror_todo_error), and a task mirrored into it would be shown twice. */
export function isOwnTodoList(hass: HomeAssistant | undefined, entityId: string): boolean {
  return hass?.entities?.[entityId]?.platform === "maintenance_supporter";
}

/** Our own lists among ``hass``'s entities: what a list picker leaves out. */
export function ownTodoLists(hass: HomeAssistant | undefined): string[] {
  return Object.keys(hass?.entities || {}).filter((id) => id.startsWith("todo.") && isOwnTodoList(hass, id));
}

/** A picked list as saved: no own list, at most the cap. */
export function mirrorTargets(hass: HomeAssistant | undefined, ids: readonly string[]): string[] {
  return [...new Set(ids.filter((id) => id && !isOwnTodoList(hass, id)))].slice(0, MAX_MIRROR_TODO_LISTS);
}
