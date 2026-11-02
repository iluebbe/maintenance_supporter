/** Which `hass` changes a surface has to redraw for. Home Assistant hands
 *  every panel and card a new `hass` object on each state change anywhere
 *  in the home, sharing every other field with the one before; in a busy
 *  home that is many a second (perf 2026-11-02). */

/** A surface that draws no entity state of its own redraws for a change of
 *  only `states` at most this often. */
export const HASS_STATES_REDRAW_MS = 1000;

/** Whether `cur` differs from `old` in `states` and in nothing else. The
 *  same states with a new object (a copy) is not such a change: the caller
 *  redraws as before. */
export function onlyStatesChanged(old: object, cur: object): boolean {
  const a = old as Record<string, unknown>;
  const b = cur as Record<string, unknown>;
  if (a === b || a.states === b.states) return false;
  for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
    if (key !== "states" && a[key] !== b[key]) return false;
  }
  return true;
}
