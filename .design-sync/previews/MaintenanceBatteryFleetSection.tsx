/** MaintenanceBatteryFleetSection — shopping summary, low/soon rows, and the
 * expandable roster with sparklines. The component reads the fleet aggregate
 * over WS, so the demo hass answers `battery_fleet/overview` (+ history) in
 * the component's real response shape. */
import * as React from "react";
import { dsDemoHass, dsProps } from "maintenance-supporter-frontend";

const nowSec = Date.now() / 1000;
const daysAgo = (d: number) => nowSec - d * 86400;

const row = (over: Record<string, unknown>) => ({
  entity_id: "",
  device_name: "",
  battery_type: "AA",
  quantity: 1,
  level: 80,
  days_until: null as number | null,
  low_threshold: 20,
  ...over,
});

const LOW = [
  row({ entity_id: "sensor.smoke_hall_battery", device_name: "Smoke Detector Hall", battery_type: "9V", level: 8 }),
  row({ entity_id: "sensor.door_front_battery", device_name: "Front Door Sensor", battery_type: "CR2032", level: 14, available: false }),
];
const SOON = [
  row({
    entity_id: "sensor.motion_landing_battery", device_name: "Landing Motion Sensor",
    battery_type: "AA", quantity: 2, level: 27, days_until: 16,
    predicted_source: "trend", prediction_confidence: "high",
  }),
];
const OK = [
  row({ entity_id: "sensor.remote_bedroom_battery", device_name: "Bedroom Remote", battery_type: "AAA", quantity: 2, level: 81, days_until: 210, predicted_source: "typical" }),
  row({ entity_id: "sensor.leak_kitchen_battery", device_name: "Kitchen Leak Sensor", battery_type: "CR123A", level: 92, days_until: -4, forecast_overdue: true }),
  row({ entity_id: "sensor.ring_battery", device_name: "Fitness Ring", battery_type: "Rechargeable", level: 64, rechargeable: true }),
];

const ALL = [
  ...LOW.map((b) => ({ ...b, status: "low" })),
  ...SOON.map((b) => ({ ...b, status: "soon" })),
  ...OK.map((b) => ({ ...b, status: "ok" })),
];

const OVERVIEW = {
  available: true,
  configured: true,
  task_ok: true,
  total: ALL.length + 1, // +1 excluded tablet
  low: LOW,
  soon: SOON,
  all: ALL,
  needs_now: { "9V": 1, CR2032: 1 },
  needs_soon: { AA: 2 },
  types: ["9V", "CR2032", "AA", "AAA", "CR123A"],
  excluded: [{ entity_id: "sensor.tablet_battery", device_name: "Hallway Wall Tablet" }],
  track_self_charging: true,
};

// 30 d level history ([tsSeconds, %]) for the roster sparklines. The landing
// sensor declines toward its threshold (trend forecast → dotted projection);
// the kitchen leak sensor shows an unrecorded swap (18 % → 96 % jump).
const decline = (from: number, to: number): [number, number][] =>
  Array.from({ length: 16 }, (_, i) => [daysAgo(30 - i * 2), from + ((to - from) * i) / 15]);
const SERIES = {
  "sensor.motion_landing_battery": { points: decline(52, 27), threshold: 20 },
  "sensor.smoke_hall_battery": { points: decline(34, 8), threshold: 20 },
  "sensor.remote_bedroom_battery": { points: decline(88, 81), threshold: 20 },
  "sensor.leak_kitchen_battery": {
    points: [
      ...decline(40, 18).filter(([t]) => t < daysAgo(11)),
      ...decline(96, 92).filter(([t]) => t >= daysAgo(10)),
    ],
    threshold: 15,
    jump: { at: daysAgo(10), from: 18, to: 96, device_id: "dev_kitchen_leak" },
  },
};

const fleetHass = (overview: Record<string, unknown> = OVERVIEW) =>
  dsDemoHass({
    handlers: {
      "maintenance_supporter/battery_fleet/overview": () => overview,
      "maintenance_supporter/battery_fleet/overview_history": () => ({ series: SERIES }),
    },
  });

export const ShoppingAndLow = () => (
  <maintenance-battery-fleet-section
    ref={dsProps({ hass: fleetHass() })}
    style={{ display: "block", width: 640 }}
  />
);

/** Same fleet with the full roster opened (details expanded after mount so
 * the lazily-fetched history sparklines render too). */
const expandRoster = (el: unknown) => {
  if (!el) return;
  dsProps({ hass: fleetHass() })(el);
  let tries = 0;
  const timer = setInterval(() => {
    const host = el as { shadowRoot?: ShadowRoot | null };
    const det = host.shadowRoot?.querySelector("details.bf-roster") as HTMLDetailsElement | null;
    if (det) {
      det.open = true;
      clearInterval(timer);
    } else if (++tries > 30) clearInterval(timer);
  }, 100);
};

export const RosterExpanded = () => (
  <maintenance-battery-fleet-section
    ref={expandRoster}
    style={{ display: "block", width: 780 }}
  />
);

/** flat attribute variant (card wrapper provides the chrome) with a healthy
 * fleet — the "nothing to do" state. */
const OK_OVERVIEW = {
  ...OVERVIEW,
  low: [],
  soon: [],
  all: OK.map((b) => ({ ...b, status: "ok" })),
  needs_now: {},
  needs_soon: {},
  excluded: [],
  total: OK.length,
};

export const FlatAllOk = () => (
  <maintenance-battery-fleet-section
    ref={(el: unknown) => {
      if (!el) return;
      // The :host([flat]) chrome switch matches on the ATTRIBUTE — React
      // assigns unknown JSX props as properties on custom elements, so set
      // the attribute explicitly (the card wrapper does the same).
      (el as HTMLElement).setAttribute("flat", "");
      dsProps({ hass: fleetHass(OK_OVERVIEW) })(el);
    }}
    style={{ display: "block", width: 640 }}
  />
);
