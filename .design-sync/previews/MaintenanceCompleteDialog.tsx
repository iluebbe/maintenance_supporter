/** MaintenanceCompleteDialog — the completion flow with checklist,
 * details and per-completion parts. Opened imperatively after props land. */
import * as React from "react";
import { dsDemoHass, dsProps } from "maintenance-supporter-frontend";

const openWith = (props: Record<string, unknown>) => (el: unknown) => {
  if (!el) return;
  dsProps({ hass: dsDemoHass(), ...props })(el);
  (el as { open: () => void }).open();
};

export const WithChecklist = () => (
  <maintenance-complete-dialog
    ref={openWith({
      entryId: "demo_hvac",
      taskId: "t_filter",
      taskName: "Clean air filter",
      checklist: ["Remove front cover", "Vacuum filter", "Rinse and dry", "Reinsert"],
      requiredFields: ["notes"],
    })}
  />
);

export const ReadingTask = () => (
  <maintenance-complete-dialog
    ref={openWith({
      entryId: "demo_pool",
      taskId: "t_ph",
      taskName: "Test water chemistry",
      taskType: "reading",
      readingUnit: "pH",
    })}
  />
);
