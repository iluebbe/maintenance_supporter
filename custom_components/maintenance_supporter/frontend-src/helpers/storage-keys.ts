/** localStorage keys for panel UI preferences — single source of truth.
 *
 * The VALUES are a compatibility contract: they are what users' browsers
 * already have stored, so they must never change (the mixed msp-/full-name
 * prefixes are historical and stay). Centralizing the names just makes a typo
 * in one call site impossible — a DRY audit (2026-07-10) found every key
 * duplicated inline at its get/set pair.
 */

export const LS_KEYS = {
  overviewTab: "msp-overview-tab",
  collapsedSections: "msp-collapsed-sections",
  chartRange: "msp-chart-range",
  chartHideOutliers: "msp-chart-hide-outliers",
  taskSort: "maintenance_supporter_sort",
  objectSort: "maintenance_supporter_object_sort",
  groupBy: "maintenance_supporter_groupby",
  objectView: "maintenance_supporter_object_view",
  objectsCache: "msp-objects-cache",
  gettingStartedDismissed: "msp-gs-dismissed",
  batteryRosterSort: "ms_bf_roster_sort",
} as const;

/**
 * Guarded storage access — localStorage can THROW (Safari private mode /
 * locked-down policies raise instead of returning null), and an unguarded
 * call aborts the surrounding handler. The 2026-08 DRY audit found two
 * hand-written call sites that had missed the guard; every access now goes
 * through these two (a source tripwire forbids direct localStorage use
 * outside this module).
 */
export function lsGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function lsSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* private mode / storage blocked */
  }
}
