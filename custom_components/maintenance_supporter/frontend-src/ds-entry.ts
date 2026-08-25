/** design-sync bundle entry.
 *
 * Re-exports every design-system component class; importing this module also
 * registers all custom elements (each component module calls
 * `customElements.define` on import) and the HA host-element fallbacks
 * (ds-host-stubs — first-wins, inert inside real Home Assistant).
 *
 * Built to `dist-ds/ds-entry.js` (ESM) by `node esbuild.mjs --ds`; that file
 * is the `--entry` the design-sync converter wraps into the claude.ai/design
 * bundle. Panel, card editor, dashboard strategy and services are deliberately
 * NOT here — they are app infrastructure, not design building blocks.
 */

import "./ds-host-stubs";

// Cards
export { MaintenanceSupporterCard } from "./maintenance-card";
export { MaintenanceCalendarCard } from "./maintenance-calendar-card";
export { MaintenanceBatteryFleetCard } from "./components/battery-fleet-card";
export { MaintenanceBudgetSectionCard } from "./components/budget-section-card";
export { MaintenanceGroupsSectionCard } from "./components/groups-section-card";
export { MaintenanceVacationSectionCard } from "./components/vacation-section-card";
export { MaintenanceStorageSectionCard } from "./components/storage-section-card";

// Dialogs
export { MaintenanceTaskDialog } from "./components/task-dialog";
export { MaintenanceObjectDialog } from "./components/object-dialog";
export { MaintenanceCompleteDialog } from "./components/complete-dialog";
export { MaintenanceConfirmDialog } from "./components/confirm-dialog";
export { MaintenanceGroupDialog } from "./components/group-dialog";
export { MaintenanceQrDialog } from "./components/qr-dialog";
export { MaintenanceHistoryEditDialog } from "./components/history-edit-dialog";
export { MaintenanceSavedViewsDialog } from "./components/saved-views-dialog";
export { SeasonalOverridesDialog } from "./components/seasonal-overrides-dialog";
export { MaintenanceTaskQuickActionsDialog } from "./components/task-quick-actions-dialog";
export { MaintenanceObjectQuickActionsDialog } from "./components/object-quick-actions-dialog";
export { MaintenanceAdoptProblemSensorsDialog } from "./components/adopt-problem-sensors-dialog";
export { MaintenanceSuggestedSetupsDialog } from "./components/suggested-setups-dialog";

// Sections
export { MaintenanceBatteryFleetSection } from "./components/battery-fleet-section";
export { MaintenanceDocumentsSection } from "./components/documents-section";
export { MaintenanceObjectHistorySection } from "./components/object-history-section";
export { MaintenancePartsSection } from "./components/parts-section";
export { MaintenanceTaskDocuments } from "./components/task-documents";

// Views
export { MaintenanceTaskDetailView } from "./components/task-detail-view";
export { MaintenanceSettingsView } from "./components/settings-view";

// Elements
export { MaintenanceTriggerChart } from "./components/trigger-chart";
export { MaintenanceHistoryPhoto } from "./components/history-photo";
export { MsTextfield } from "./components/ms-textfield";

// Preview support (demo household + property helper + icon paths)
export { DS_DEMO, dsDemoHass, dsProps } from "./ds-preview-kit";
export { DS_MDI_PATHS } from "./ds-mdi-map";
