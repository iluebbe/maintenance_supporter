/** MaintenanceTaskDetailView — the task-detail sub-view (hero screen):
 * header with status + actions, KPI bar, notes/manual card, progress bar,
 * recommendation card, cost/duration chart, checklist, recent activity and
 * the linked-documents card.
 *
 * The component renders into LIGHT DOM by design (its CSS lives in the
 * panel's shadow root), so this preview injects the panel's real stylesheet
 * (panel-styles.ts) into the page — the same rules the panel applies. */
import * as React from "react";
import { dsDemoHass, dsProps, DS_DEMO } from "maintenance-supporter-frontend";
import { panelStyles } from "../../custom_components/maintenance_supporter/frontend-src/panel-styles";
import { sharedStyles } from "../../custom_components/maintenance_supporter/frontend-src/styles";

const PHOTO_SVG =
  "<svg xmlns='http://www.w3.org/2000/svg' width='320' height='240'>" +
  "<rect width='320' height='240' fill='#eceff1'/>" +
  "<rect x='24' y='20' width='272' height='200' rx='10' fill='#fafafa' stroke='#b0bec5' stroke-width='3'/>" +
  "<rect x='44' y='48' width='232' height='132' rx='4' fill='#cfd8dc'/>" +
  Array.from({ length: 9 }, (_, i) => `<line x1='${56 + i * 26}' y1='48' x2='${56 + i * 26}' y2='180' stroke='#90a4ae' stroke-width='4'/>`).join("") +
  "<rect x='44' y='190' width='120' height='10' rx='5' fill='#b0bec5'/>" +
  "</svg>";
const PHOTO_URI = "data:image/svg+xml;utf8," + encodeURIComponent(PHOTO_SVG);

const HASS = () =>
  dsDemoHass({
    handlers: {
      "auth/sign_path": () => ({ path: PHOTO_URI }),
    },
  });

const HISTORY = [
  { timestamp: "2026-08-06T09:12:00+00:00", type: "completed", notes: "Rinsed and dried the filter", cost: 0, duration: 15, completed_by: "admin-1" },
  { timestamp: "2026-07-05T16:40:00+00:00", type: "completed", notes: "Replaced with a fresh HEPA insert", cost: 24.9, duration: 20, completed_by: "user-2" },
  { timestamp: "2026-06-07T10:05:00+00:00", type: "skipped", notes: "On vacation" },
  { timestamp: "2026-05-04T08:30:00+00:00", type: "completed", duration: 15, cost: 0, completed_by: "admin-1" },
  // History renders earliest-first, so the completion photo sits on the
  // first visible entry.
  { timestamp: "2026-04-03T18:20:00+00:00", type: "completed", notes: "Heavy dust after renovation", cost: 24.9, duration: 30, completed_by: "user-2", photo_doc_id: "doc_photo" },
];

// The demo household's overdue filter task, enriched for the detail page.
const TASK = {
  ...DS_DEMO.OBJECTS[0].tasks[0],
  notes: "Front grille clips are brittle — open from the bottom first.",
  documentation_url: "https://example.com/ftxm35/filter-care",
  suggested_interval: 35,
  interval_confidence: "high",
  interval_analysis: { confidence_interval_low: 31, confidence_interval_high: 39 },
  checklist_progress: { "Remove front cover": true, "Vacuum filter": true },
  history: HISTORY,
  history_count: HISTORY.length,
  responsible_user_id: "admin-1",
};

const noop = () => undefined;

const makeCtx = (over: Record<string, unknown> = {}) => {
  const hass = HASS();
  return {
    lang: "en",
    hass,
    entryId: "demo_hvac",
    taskId: "t_filter",
    objectName: "HVAC Unit",
    objectDocUrl: "https://example.com/ftxm35-manual",
    objectManualDocs: [],
    openManualDoc: noop,
    setChecklistItem: noop,
    isOperator: false,
    actionLoading: false,
    moreMenuOpen: false,
    activeTab: "overview",
    features: DS_DEMO.SETTINGS.features,
    currencySymbol: "€",
    collapsedSections: new Set<string>(),
    costDurationToggle: "both",
    suggestionDismissed: false,
    sparkline: {
      lang: "en",
      detailStatsData: new Map(),
      hasStatsService: false,
      isCounterEntity: () => false,
      rangeDays: 30,
      setRangeDays: noop,
      hideOutliers: false,
      setHideOutliers: noop,
    },
    history: {
      lang: "en",
      hass,
      filter: null,
      search: "",
      currencySymbol: "€",
      setFilter: noop,
      setSearch: noop,
      openEdit: noop,
    },
    getUserName: (id: string) => (id === "admin-1" ? "Alex" : id === "user-2" ? "Sam" : null),
    setActiveTab: noop,
    toggleSection: noop,
    setCostDurationToggle: noop,
    showTaskView: noop,
    showObject: noop,
    toggleMoreMenu: noop,
    closeMoreMenu: noop,
    openEdit: noop,
    openComplete: noop,
    promptSkip: noop,
    toggleArchive: noop,
    openQr: noop,
    duplicateTask: noop,
    promptReset: noop,
    promptPostpone: noop,
    snoozeTask: noop,
    printWorksheet: noop,
    deleteTask: noop,
    applySuggestion: noop,
    reanalyze: noop,
    dismissSuggestion: noop,
    openSeasonalOverrides: noop,
    ...over,
  };
};

/** Page frame: the panel's stylesheet + panel background, sized like the
 * panel's content column. */
const Frame = ({ children }: { children?: unknown }) => (
  <div style={{ width: 820, background: "var(--primary-background-color)", padding: "0 16px 16px" }}>
    <style>{sharedStyles.cssText + panelStyles.cssText}</style>
    {children}
  </div>
);

export const Overview = () => (
  <Frame>
    <maintenance-task-detail-view ref={dsProps({ task: TASK, ctx: makeCtx() })} />
  </Frame>
);

export const HistoryTab = () => (
  <Frame>
    <maintenance-task-detail-view ref={dsProps({ task: TASK, ctx: makeCtx({ activeTab: "history" }) })} />
  </Frame>
);
