/** Skeleton-from-cache: the last known objects payload in localStorage.
 *
 * Cold panel load spends 700–1100 ms in the HA shell + bundle before the
 * first WS byte arrives. Rendering the previous visit's task list
 * immediately and reconciling when the live payload lands makes revisits
 * feel instant — the live data replaces the skeleton through the normal
 * `_objects` assignment, so no special reconcile path exists.
 *
 * Safety rails:
 *  - The entry is stamped with the bundle version — after an update the
 *    cached shape may not match what the new code expects, so a version
 *    mismatch discards the cache (one cold load right after updating).
 *  - Entries older than MAX_AGE_MS are ignored: a household that hasn't
 *    opened the panel in a week shouldn't flash week-old due states.
 *  - Reads and writes swallow storage errors (Safari private mode throws,
 *    quota can overflow) — the panel then simply loads as before.
 *  - The entry remembers the look the list was painted in (the new look's
 *    switch): the skeleton paints in it, not in the classic look until the
 *    settings arrive (2026-11-01, the new look became the default).
 *  - It remembers what else the first draw shows and only the settings and
 *    the budget answers know (`extras`): without it the two budget tiles
 *    joined the strip a few frames later and pushed the five counts aside
 *    (prod look 2026-11-23).
 */

import { betaUi } from "./beta-ui";
import { BUNDLE_VERSION } from "./bundle-version";
import { LS_KEYS, lsGet, lsSet } from "./storage-keys";

const MAX_AGE_MS = 7 * 24 * 3600 * 1000;

export interface ObjectsCacheEntry<O = unknown, S = unknown, X = unknown> {
  v: string;
  at: number;
  objects: O[];
  stats: S | null;
  /** The new look was on (absent in entries written before 2026-11-01). */
  beta?: boolean;
  /** What the panel drew besides the rows (absent in older entries). */
  extras?: X;
}

export function readObjectsCache<O = unknown, S = unknown, X = unknown>(): { objects: O[]; stats: S | null; beta?: boolean; extras?: X } | null {
  try {
    const raw = lsGet(LS_KEYS.objectsCache);
    if (!raw) return null;
    const entry = JSON.parse(raw) as ObjectsCacheEntry<O, S, X>;
    if (entry.v !== BUNDLE_VERSION) return null;
    if (!Number.isFinite(entry.at) || Date.now() - entry.at > MAX_AGE_MS) return null;
    if (!Array.isArray(entry.objects) || entry.objects.length === 0) return null;
    return {
      objects: entry.objects,
      stats: entry.stats ?? null,
      ...(typeof entry.beta === "boolean" ? { beta: entry.beta } : {}),
      ...(entry.extras && typeof entry.extras === "object" ? { extras: entry.extras } : {}),
    };
  } catch {
    return null;
  }
}

export function writeObjectsCache<O, S, X = unknown>(objects: O[], stats: S | null, beta: boolean = betaUi(), extras?: X): void {
  if (!Array.isArray(objects) || objects.length === 0) return;
  try {
    const entry: ObjectsCacheEntry<O, S, X> = { v: BUNDLE_VERSION, at: Date.now(), objects, stats, beta, ...(extras ? { extras } : {}) };
    lsSet(LS_KEYS.objectsCache, JSON.stringify(entry));
  } catch {
    // quota / blocked storage — skeleton just won't be available next visit
  }
}
