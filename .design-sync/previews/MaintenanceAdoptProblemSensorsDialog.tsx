/** MaintenanceAdoptProblemSensorsDialog — discover HA problem/binary sensors
 * and adopt them as auto-resolving maintenance tasks. The kit has no
 * problem_sensors/discover handler, so the preview supplies the backend's
 * discovery payload (incl. #136's for_minutes hold field). */
import * as React from "react";
import { dsDemoHass, dsProps } from "maintenance-supporter-frontend";

/** The capture harness's story root has transform:translateZ(0), which makes
 * it the containing block for position:fixed — the overlay would collapse to
 * the zero-height mount and clip the card. Neutralize so it anchors to the
 * real viewport. */
const FixedAnchor = () => (
  <style>{".ds-single{transform:none !important}"}</style>
);

const SENSORS = [
  {
    entity_id: "binary_sensor.hvac_filter_dirty",
    name: "HVAC filter dirty",
    state: "on",
    device_id: "dev_hvac",
    device_name: "Daikin FTXM35",
    area_name: "Living Room",
    suggested_entry_id: "demo_hvac",
    suggested_object_name: "HVAC Unit",
    suggested_part_id: "p_filter",
    suggested_part_name: "HEPA filter",
  },
  {
    entity_id: "binary_sensor.dishwasher_check_salt",
    name: "Dishwasher salt low",
    state: "off",
    device_id: "dev_dishwasher",
    device_name: "Bosch SMS6ZCI49E",
    area_name: "Kitchen",
    suggested_entry_id: null,
    suggested_object_name: "Bosch Dishwasher",
    suggested_part_id: null,
    suggested_part_name: "Dishwasher salt",
  },
  {
    entity_id: "binary_sensor.washer_drum_clean_reminder",
    name: "Drum clean reminder",
    state: "off",
    device_id: "dev_washer",
    device_name: "LG F4WV710",
    area_name: "Utility Room",
    suggested_entry_id: null,
    suggested_object_name: "Washing Machine",
    suggested_part_id: null,
    suggested_part_name: null,
  },
];

const openAdopt = (sensors: Array<Record<string, unknown>>) => (el: unknown) => {
  if (!el) return;
  dsProps({
    hass: dsDemoHass({
      handlers: {
        "maintenance_supporter/problem_sensors/discover": () => ({ sensors }),
      },
    }),
  })(el);
  (el as { open: () => Promise<void> }).open();
};

/** Three discovered sensors (one currently firing), all preselected, with
 * hold-minutes field and responsible-user picker. */
export const Discovered = () => (
  <>
    <FixedAnchor />
    <maintenance-adopt-problem-sensors-dialog ref={openAdopt(SENSORS)} />
  </>
);

/** Nothing left to adopt — every problem sensor is already tracked. */
export const NothingToAdopt = () => (
  <>
    <FixedAnchor />
    <maintenance-adopt-problem-sensors-dialog ref={openAdopt([])} />
  </>
);
