/** MaintenanceGroupDialog — create/edit a task group; the `objects`
 * property provides the per-object task checkboxes. */
import * as React from "react";
import { dsDemoHass, dsProps, DS_DEMO } from "maintenance-supporter-frontend";

type GroupDialogEl = {
  openCreate: () => void;
  openEdit: (groupId: string, group: unknown) => void;
};

const openWith = (call: (el: GroupDialogEl) => void) => (el: unknown) => {
  if (!el) return;
  dsProps({ hass: dsDemoHass(), objects: DS_DEMO.OBJECTS })(el);
  call(el as GroupDialogEl);
};

export const Create = () => (
  <maintenance-group-dialog ref={openWith((el) => el.openCreate())} />
);

/** Matches the kit's g_weekly group — two tasks pre-selected. */
export const EditWeeklyRoutine = () => (
  <maintenance-group-dialog
    ref={openWith((el) =>
      el.openEdit("g_weekly", {
        name: "Weekly routine",
        description: "Sunday-morning sweep before the week starts",
        task_refs: [
          { entry_id: "demo_vacuum", task_id: "t_dustbin" },
          { entry_id: "demo_pool", task_id: "t_ph" },
        ],
      }),
    )}
  />
);
