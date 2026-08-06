/** Hydration for compact WS payloads (perf wave 2, item 3).
 *
 * With `compact: true` the server strips keys whose value is None/[]/{}
 * from the object + task summaries (52 % of the payload on a 121-task
 * instance was exactly that). Scalars need no restoration — absent and
 * null read identically through `== null` / `||` access — but the
 * list/dict-typed keys below get iterated (`?.map`, `.length`, spreads)
 * and MUST come back as their empty containers.
 *
 * These key lists are pinned against the server's actual builder output by
 * `tests/test_ws_compact_mode.py` — a new list/dict-defaulted response
 * field fails that test until it is added here.
 */

const TASK_LIST_KEYS = [
  "assignee_pool",
  "required_completion_fields",
  "checklist",
  "labels",
  "history",
] as const;
const TASK_DICT_KEYS = ["checklist_progress"] as const;
const RESPONSE_LIST_KEYS = ["tasks", "parts"] as const;
const OBJECT_LIST_KEYS = ["manual_docs", "battery_fleet_excluded"] as const;

type AnyDict = Record<string, unknown>;

function fill(target: AnyDict, listKeys: readonly string[], dictKeys: readonly string[] = []): void {
  for (const k of listKeys) if (target[k] === undefined) target[k] = [];
  for (const k of dictKeys) if (target[k] === undefined) target[k] = {};
}

/** Hydrate one compact object response in place (full responses pass
 *  through untouched — every key is already present). Typed loosely on
 *  purpose: response interfaces carry no index signature, and hydration
 *  only ever ADDS the empty containers those interfaces already declare. */
export function hydrateObjectResponse<T extends object>(resp: T): T {
  const r = resp as AnyDict;
  fill(r, RESPONSE_LIST_KEYS);
  if (r.object && typeof r.object === "object") {
    fill(r.object as AnyDict, OBJECT_LIST_KEYS);
  }
  for (const t of r.tasks as AnyDict[]) fill(t, TASK_LIST_KEYS, TASK_DICT_KEYS);
  return resp;
}

/** Hydrate a compact objects list in place. */
export function hydrateObjects<T extends object>(objects: T[]): T[] {
  for (const o of objects) hydrateObjectResponse(o);
  return objects;
}
