/** The to-do lists a task can be mirrored into (D#183, #231): the rule both
 *  pickers apply, Settings' default lists and the task dialog's own lists.
 *  The dialog offered every list without a cap and with our own, and the
 *  backend refused the save in the words of a text that is too long (DRY
 *  audit 2026-10-30, X6-A3). */

import type { HomeAssistant } from "../types";
import { taskUserIds, type AssignedTask } from "./assignees";

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

/** The lists a stored task is mirrored into: its own, else its object's
 *  (#273), else Settings' default lists, unless it opted out (#231); on top
 *  the own lists of the people it is meant for (#273). The twin of
 *  ``helpers/todo_mirror.py mirror_lists``; both read
 *  ``__tests__/fixtures/twin-rules-vectors.json`` (DRY audit 2026-10-30,
 *  X6-B10). */
export function mirrorListsOf(
  task: { mirror_todo_entities?: readonly unknown[] | null; mirror_todo_use_default?: boolean | null } & AssignedTask,
  defaults: readonly string[] | null | undefined = [],
  objectLists: readonly string[] | null | undefined = [],
  people: Readonly<Record<string, string>> | null | undefined = null,
): string[] {
  const own = (task.mirror_todo_entities ?? []).filter((e): e is string => typeof e === "string" && !!e);
  if (!own.length && task.mirror_todo_use_default === false) return [];
  const inherited = objectLists?.length ? [...objectLists] : Array.isArray(defaults) ? [...defaults] : [];
  const lists = own.length ? [...own] : inherited;
  if (people) for (const userId of taskUserIds(task)) if (people[userId]) lists.push(people[userId]);
  return [...new Set(lists)];
}

/** The task dialog's choice: Settings' default lists, the task's own, or none. */
export type MirrorMode = "default" | "own" | "none";

/** What the dialog's mirror choice saves, and the lists the task then goes
 *  onto as helpers/todo_mirror reads it: its own lists replace the default
 *  ones, `mirror_todo_use_default: false` opts out. Without default lists
 *  there is no choice, only its own lists. The save and the editor's
 *  notifications row each worked it out, and the row showed a picked list
 *  the save leaves out (DRY audit 2026-11-07, FE7-B5). */
export function mirrorChoice(
  hass: HomeAssistant | undefined,
  mode: MirrorMode,
  defaults: readonly string[],
  own: readonly string[],
  objectLists: readonly string[] = [],
  people: Readonly<Record<string, string>> | null = null,
  assigned: AssignedTask = {},
): { entities: string[]; useDefault: boolean; lists: string[] } {
  // #273: "default" is whatever the task inherits, its object's lists first.
  const inherited = objectLists.length ? objectLists : defaults;
  const entities = inherited.length && mode !== "own" ? [] : mirrorTargets(hass, own);
  const useDefault = inherited.length ? mode === "default" : mode !== "none";
  return {
    entities,
    useDefault,
    lists: mirrorListsOf({ mirror_todo_entities: entities, mirror_todo_use_default: useDefault, ...assigned }, defaults, objectLists, people),
  };
}
