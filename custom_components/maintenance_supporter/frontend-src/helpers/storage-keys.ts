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
} as const;
