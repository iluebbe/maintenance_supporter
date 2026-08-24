/** MaintenanceSupporterCard — the main Lovelace task list. */
import * as React from "react";
import { dsDemoHass, dsProps } from "maintenance-supporter-frontend";

export const Household = () => (
  <maintenance-supporter-card
    ref={dsProps({ hass: dsDemoHass() })}
    style={{ display: "block", width: 460 }}
  />
);
