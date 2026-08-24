/** MaintenanceVacationSectionCard — vacation mode toggle with start/end/buffer
 * inline. Status pill: active (green) / scheduled (amber) / inactive.
 *
 * Workaround: the ds-host-stub ha-switch styles its checked state via
 * `:host([checked])` but declares `checked` without `reflect: true`, so a
 * property-set checked switch still LOOKS off. Enabled stories mirror the
 * property onto the attribute after mount. */
import * as React from "react";
import { dsDemoHass, dsProps } from "maintenance-supporter-frontend";

const vacationHass = (state: Record<string, unknown>) =>
  dsDemoHass({
    handlers: { "maintenance_supporter/vacation/state": () => state },
  });

const vacationRef = (state: Record<string, unknown>) => (el: unknown) => {
  if (!el) return;
  dsProps({ hass: vacationHass(state) })(el);
  if (!state.enabled) return;
  const reflectChecked = (attempt: number) => {
    const sw = (el as HTMLElement).shadowRoot?.querySelector("ha-switch");
    if (sw) sw.setAttribute("checked", "");
    else if (attempt < 40) setTimeout(() => reflectChecked(attempt + 1), 50);
  };
  reflectChecked(0);
};

export const ActiveNow = () => (
  <maintenance-vacation-section-card
    ref={vacationRef({
      enabled: true,
      is_active: true,
      start: "2026-08-20",
      end: "2026-08-31",
      buffer_days: 5,
      window_end: "2026-09-05",
      exempt_task_ids: ["demo_vacuum:t_dustbin", "demo_pool:t_ph"],
    })}
    style={{ display: "block", width: 400 }}
  />
);

export const Scheduled = () => (
  <maintenance-vacation-section-card
    ref={vacationRef({
      enabled: true,
      is_active: false,
      start: "2026-09-14",
      end: "2026-09-28",
      buffer_days: 7,
      exempt_task_ids: [],
    })}
    style={{ display: "block", width: 400 }}
  />
);

export const Off = () => (
  <maintenance-vacation-section-card
    ref={dsProps({ hass: dsDemoHass() })}
    style={{ display: "block", width: 400 }}
  />
);
