/** The overview's tabs — ONE list for the sidebar panel (deep links,
 *  remembered tab) and the panel-as-card editor's tab preset (#174), which
 *  used to carry its own copy (DRY audit 2026-09-12). Dependency-free so
 *  the cards bundle can import it without pulling the panel in. */
export const OVERVIEW_TABS = ["today", "dashboard", "calendar", "settings"] as const;

export type OverviewTab = (typeof OVERVIEW_TABS)[number];
