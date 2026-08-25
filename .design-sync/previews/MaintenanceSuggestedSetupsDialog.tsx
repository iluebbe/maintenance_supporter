/** MaintenanceSuggestedSetupsDialog — integration-aware suggested setups from
 * the verified signature catalog: devices whose consumable entities can back
 * pre-wired threshold tasks. The kit has no integration_setups/discover
 * handler, so the preview supplies the backend's payload shape (tasks with
 * entity_ids + threshold + direction; usage_delta shows the baseline field). */
import * as React from "react";
import { dsDemoHass, dsProps } from "maintenance-supporter-frontend";

/** The capture harness's story root has transform:translateZ(0), which makes
 * it the containing block for position:fixed — the overlay would collapse to
 * the zero-height mount and clip the card. Neutralize so it anchors to the
 * real viewport. */
const FixedAnchor = () => (
  <style>{".ds-single{transform:none !important}"}</style>
);

const SETUPS = [
  {
    device_id: "dev_roborock",
    device_name: "Roborock S8 Pro",
    area_name: "Hallway",
    integration: "roborock",
    integration_name: "Roborock",
    suggested_entry_id: "demo_vacuum",
    suggested_object_name: "Robot Vacuum",
    tasks: [
      { task_name: "Replace main brush", entity_ids: ["sensor.roborock_s8_main_brush_time_left"], threshold: 300, direction: "below_hours" },
      { task_name: "Replace filter", entity_ids: ["sensor.roborock_s8_filter_time_left"], threshold: 150, direction: "below_hours" },
      { task_name: "Clean sensors", entity_ids: ["sensor.roborock_s8_sensor_time_left"], threshold: 30, direction: "below_hours" },
    ],
  },
  {
    device_id: "dev_brother",
    device_name: "Brother HL-L2350DW",
    area_name: "Office",
    integration: "brother",
    integration_name: "Brother",
    suggested_entry_id: null,
    suggested_object_name: "Brother HL-L2350DW",
    tasks: [
      { task_name: "Replace toner", entity_ids: ["sensor.brother_hl_l2350dw_black_toner_remaining"], threshold: 10, direction: "below_percent" },
      { task_name: "Replace drum unit", entity_ids: ["sensor.brother_hl_l2350dw_page_counter"], threshold: 12000, direction: "usage_delta" },
    ],
  },
];

const openSetups = (setups: Array<Record<string, unknown>>) => (el: unknown) => {
  if (!el) return;
  dsProps({
    hass: dsDemoHass({
      handlers: {
        "maintenance_supporter/integration_setups/discover": () => ({ setups }),
      },
    }),
  })(el);
  (el as { open: () => Promise<void> }).open();
};

/** Vacuum + printer discovered: task chips, target-object pickers and a
 * counting-baseline input for the usage_delta duty. */
export const Discovered = () => (
  <>
    <FixedAnchor />
    <maintenance-suggested-setups-dialog ref={openSetups(SETUPS)} />
  </>
);

/** No catalogued devices found. */
export const NoDevicesFound = () => (
  <>
    <FixedAnchor />
    <maintenance-suggested-setups-dialog ref={openSetups([])} />
  </>
);
