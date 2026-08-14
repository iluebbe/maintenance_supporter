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
 */

import { BUNDLE_VERSION } from "./bundle-version";
import { LS_KEYS, lsGet, lsSet } from "./storage-keys";

const MAX_AGE_MS = 7 * 24 * 3600 * 1000;

export interface ObjectsCacheEntry<O = unknown, S = unknown> {
  v: string;
  at: number;
  objects: O[];
  stats: S | null;
}

export function readObjectsCache<O = unknown, S = unknown>(): { objects: O[]; stats: S | null } | null {
  try {
    const raw = lsGet(LS_KEYS.objectsCache);
    if (!raw) return null;
    const entry = JSON.parse(raw) as ObjectsCacheEntry<O, S>;
    if (entry.v !== BUNDLE_VERSION) return null;
    if (!Number.isFinite(entry.at) || Date.now() - entry.at > MAX_AGE_MS) return null;
    if (!Array.isArray(entry.objects) || entry.objects.length === 0) return null;
    return { objects: entry.objects, stats: entry.stats ?? null };
  } catch {
    return null;
  }
}

export function writeObjectsCache<O, S>(objects: O[], stats: S | null): void {
  if (!Array.isArray(objects) || objects.length === 0) return;
  try {
    const entry: ObjectsCacheEntry<O, S> = { v: BUNDLE_VERSION, at: Date.now(), objects, stats };
    lsSet(LS_KEYS.objectsCache, JSON.stringify(entry));
  } catch {
    // quota / blocked storage — skeleton just won't be available next visit
  }
}
