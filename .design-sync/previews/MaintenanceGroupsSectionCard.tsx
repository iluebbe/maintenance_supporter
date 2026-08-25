/** MaintenanceGroupsSectionCard — inline group CRUD (add / rename / delete);
 * task assignment deep-links into the panel. */
import * as React from "react";
import { dsDemoHass, dsProps } from "maintenance-supporter-frontend";

const ref = (t: string) => ({ entry_id: "demo_hvac", task_id: t });

export const HouseholdGroups = () => (
  <maintenance-groups-section-card
    ref={dsProps({
      hass: dsDemoHass({
        handlers: {
          "maintenance_supporter/groups": () => ({
            groups: {
              g_weekly: { name: "Weekly routine", task_refs: [ref("t_dustbin"), ref("t_ph"), ref("t_sensor_wipe")] },
              g_seasonal: { name: "Seasonal", task_refs: [ref("t_winterize"), ref("t_coils")] },
              g_outdoor: { name: "Outdoor", task_refs: [ref("t_backwash"), ref("t_winterize")] },
              g_safety: { name: "Safety checks", task_refs: [ref("t_filter")] },
            },
          }),
        },
      }),
    })}
    style={{ display: "block", width: 400 }}
  />
);

export const FirstRun = () => (
  <maintenance-groups-section-card
    ref={dsProps({
      hass: dsDemoHass({
        handlers: { "maintenance_supporter/groups": () => ({ groups: {} }) },
      }),
    })}
    style={{ display: "block", width: 400 }}
  />
);
