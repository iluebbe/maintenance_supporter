/** MaintenanceObjectDialog — create/edit a maintenance object.
 * `objects` feeds the parent-object dropdown (2.19); area picker and
 * device link render as the honest picker placeholders outside HA. */
import * as React from "react";
import { dsDemoHass, dsProps, DS_DEMO } from "maintenance-supporter-frontend";

type ObjectDialogEl = {
  openCreate: () => void;
  openEdit: (entryId: string, obj: unknown) => void;
};

const openWith = (call: (el: ObjectDialogEl) => void) => (el: unknown) => {
  if (!el) return;
  dsProps({ hass: dsDemoHass(), objects: DS_DEMO.OBJECTS })(el);
  call(el as ObjectDialogEl);
};

export const Create = () => (
  <maintenance-object-dialog ref={openWith((el) => el.openCreate())} />
);

export const Edit = () => (
  <maintenance-object-dialog
    ref={openWith((el) =>
      el.openEdit("demo_hvac", {
        ...DS_DEMO.OBJECTS[0].object,
        installation_date: "2023-05-12",
        warranty_expiry: "2028-05-12",
        documentation_url: "https://www.daikin.eu/manuals/ftxm35",
        notes: "Outdoor unit on the south wall. Indoor filter clips are fragile — open from the left side first.",
        ha_device_id: "",
        parent_entry_id: "",
      }),
    )}
  />
);
