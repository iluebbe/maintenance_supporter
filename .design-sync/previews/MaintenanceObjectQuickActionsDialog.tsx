/** MaintenanceObjectQuickActionsDialog — object hub: metadata, compact task
 * list (click-through to task quick-actions) and admin actions.
 * Opened via openFor(entryId); loads maintenance_supporter/object. */
import * as React from "react";
import { dsDemoHass, dsProps, DS_DEMO } from "maintenance-supporter-frontend";

/** The capture harness's story root has transform:translateZ(0), which makes
 * it the containing block for position:fixed — this self-centering dialog
 * would clip above the viewport. Neutralize so it anchors to the real one. */
const FixedAnchor = () => (
  <style>{".ds-single{transform:none !important}"}</style>
);

const openObject = (hass: unknown) => (el: unknown) => {
  if (!el) return;
  dsProps({ hass })(el);
  (el as { openFor: (e: string) => Promise<void> }).openFor("demo_hvac");
};

/** The kit's HVAC unit: manufacturer/model/serial meta + 3 tasks. */
export const HvacUnit = () => (
  <>
    <FixedAnchor />
    <maintenance-object-quick-actions-dialog ref={openObject(dsDemoHass())} />
  </>
);

/** Fully documented object: notes, install + warranty dates and a
 * documentation weblink rendered as a safe external link. */
export const FullyDocumented = () => {
  const hvac = DS_DEMO.OBJECTS[0];
  const rich = {
    ...hvac,
    object: {
      ...hvac.object,
      installation_date: "2021-05-12",
      warranty_expiry: "2026-05-12",
      documentation_url: "https://www.daikin.eu/manuals/ftxm35",
      notes: "Outdoor unit on the north wall. Breaker #14 in the garage panel.\nService contract with CoolAir Ltd. runs until 2027.",
    },
  };
  return (
    <>
      <FixedAnchor />
      <maintenance-object-quick-actions-dialog
        ref={openObject(
          dsDemoHass({ handlers: { "maintenance_supporter/object": () => rich } }),
        )}
      />
    </>
  );
};
