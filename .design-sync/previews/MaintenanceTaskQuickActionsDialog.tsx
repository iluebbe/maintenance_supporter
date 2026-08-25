/** MaintenanceTaskQuickActionsDialog — the card's in-place task hub:
 * quick info, Complete/Skip/Reset, admin row, expandable history + stats.
 * Opened via openFor(entryId, taskId); loads /object + /settings from the kit. */
import * as React from "react";
import { dsDemoHass, dsProps } from "maintenance-supporter-frontend";

/** The capture harness's story root has transform:translateZ(0), which makes
 * it the containing block for position:fixed — this self-centering dialog
 * would clip above the viewport. Neutralize so it anchors to the real one. */
const FixedAnchor = () => (
  <style>{".ds-single{transform:none !important}"}</style>
);

const openTask =
  (entryId: string, taskId: string, expand?: "details") => (el: unknown) => {
    if (!el) return;
    dsProps({ hass: dsDemoHass() })(el);
    const dlg = el as { openFor: (e: string, t: string) => Promise<void> };
    void dlg.openFor(entryId, taskId).then(() => {
      if (expand === "details") {
        (el as Record<string, unknown>)._showDetails = true;
      }
    });
  };

/** Overdue interval task (checklist + history behind the toggles). */
export const OverdueTask = () => (
  <>
    <FixedAnchor />
    <maintenance-task-quick-actions-dialog ref={openTask("demo_hvac", "t_filter")} />
  </>
);

/** Same task with "Show history + stats" expanded: stat tiles + entry list
 * with per-entry edit buttons. */
export const DetailsExpanded = () => (
  <>
    <FixedAnchor />
    <maintenance-task-quick-actions-dialog
      ref={openTask("demo_hvac", "t_filter", "details")}
    />
  </>
);

/** Sensor-triggered task: no next-due date, runtime trigger currently firing. */
export const TriggeredSensorTask = () => (
  <>
    <FixedAnchor />
    <maintenance-task-quick-actions-dialog ref={openTask("demo_vacuum", "t_brush")} />
  </>
);
