/** MaintenanceBatteryFleetCard — every tracked battery in one card:
 * what is low now, what runs out soon, and what to buy.
 *
 * The kit's built-in battery_fleet/overview handler predates the section's
 * real response shape, so these stories answer it with the shape the section
 * reads: {low, soon, all, needs_now, needs_soon, excluded, total, …}. */
import * as React from "react";
import { dsDemoHass, dsProps } from "maintenance-supporter-frontend";

const DAY = 86400;
const nowSec = () => Date.now() / 1000;

interface Row {
  entity_id: string;
  device_name: string;
  battery_type: string;
  quantity: number;
  level: number | null;
  days_until: number | null;
  low_threshold?: number;
  status?: "low" | "soon" | "ok";
  predicted_source?: "trend" | "typical";
  prediction_confidence?: "medium" | "high" | null;
  rechargeable?: boolean;
  forecast_overdue?: boolean;
}

const row = (over: Partial<Row> & Pick<Row, "entity_id" | "device_name" | "battery_type">): Row => ({
  quantity: 1,
  level: null,
  days_until: null,
  low_threshold: 20,
  status: "ok",
  ...over,
});

const SMOKE = row({ entity_id: "sensor.smoke_hall_battery", device_name: "Smoke Detector Hall", battery_type: "9V", level: 8, low_threshold: 15, status: "low" });
const GARAGE = row({ entity_id: "sensor.garage_motion_battery", device_name: "Garage Motion Sensor", battery_type: "AA", quantity: 2, level: 14, status: "low" });
const DOOR = row({ entity_id: "sensor.front_door_battery", device_name: "Front Door Sensor", battery_type: "CR2032", level: 31, days_until: 18, predicted_source: "trend", prediction_confidence: "high", status: "soon" });
const LEAK = row({ entity_id: "sensor.leak_kitchen_battery", device_name: "Water Leak Sensor Kitchen", battery_type: "CR123A", level: 45, days_until: 34, predicted_source: "trend", prediction_confidence: "medium", status: "ok" });
const THERMO = row({ entity_id: "sensor.thermostat_battery", device_name: "Thermostat Living Room", battery_type: "AA", quantity: 2, level: 64, days_until: 60, predicted_source: "typical", status: "ok" });
const REMOTE = row({ entity_id: "sensor.bedroom_remote_battery", device_name: "Bedroom Remote", battery_type: "AAA", quantity: 2, level: 81, days_until: 92, predicted_source: "typical", status: "ok" });
const RING = row({ entity_id: "sensor.fitness_ring_battery", device_name: "Fitness Ring", battery_type: "Rechargeable", level: 58, rechargeable: true, status: "ok" });
const WEATHER = row({ entity_id: "sensor.weather_station_battery", device_name: "Weather Station", battery_type: "AA", quantity: 3, level: 76, days_until: -4, predicted_source: "typical", forecast_overdue: true, status: "ok" });

const FLEET = {
  available: true,
  configured: true,
  task_ok: true,
  total: 8,
  low: [SMOKE, GARAGE],
  soon: [DOOR],
  all: [SMOKE, GARAGE, DOOR, LEAK, THERMO, REMOTE, RING, WEATHER],
  needs_now: { "9V": 1, AA: 2 },
  needs_soon: { CR2032: 1 },
  types: ["9V", "AA", "AAA", "CR2032", "CR123A"],
  excluded: [{ entity_id: "sensor.kitchen_tablet_battery", device_name: "Kitchen Tablet" }],
  track_self_charging: true,
};

/** 30-day level series for the roster sparklines (declining lines; one
 * unrecorded-swap jump on the Bedroom Remote). */
const series = (from: number, to: number, threshold: number) => {
  const points: [number, number][] = [];
  for (let i = 0; i <= 10; i++) {
    const t = nowSec() - (30 - 3 * i) * DAY;
    const wobble = i % 2 ? -1.5 : 1.5;
    points.push([t, from + ((to - from) * i) / 10 + wobble]);
  }
  points[points.length - 1][1] = to;
  return { points, threshold };
};

const HISTORY_SERIES = {
  series: {
    [SMOKE.entity_id]: series(34, 8, 15),
    [GARAGE.entity_id]: series(41, 14, 20),
    [DOOR.entity_id]: series(62, 31, 20),
    [LEAK.entity_id]: series(58, 45, 20),
    [THERMO.entity_id]: series(71, 64, 20),
    [REMOTE.entity_id]: {
      points: [
        [nowSec() - 30 * DAY, 24],
        [nowSec() - 24 * DAY, 19],
        [nowSec() - 18 * DAY, 15],
        [nowSec() - 17 * DAY, 96],
        [nowSec() - 9 * DAY, 89],
        [nowSec(), 81],
      ] as [number, number][],
      threshold: 20,
      jump: { at: nowSec() - 17 * DAY, from: 15, to: 96, device_id: "dev_bedroom_remote" },
    },
    [WEATHER.entity_id]: series(83, 76, 20),
  },
};

const fleetHass = (overview: typeof FLEET) =>
  dsDemoHass({
    handlers: {
      "maintenance_supporter/battery_fleet/overview": () => overview,
      "maintenance_supporter/battery_fleet/overview_history": () => HISTORY_SERIES,
    },
  });

export const NeedsAttention = () => (
  <maintenance-battery-fleet-card
    ref={dsProps({ hass: fleetHass(FLEET) })}
    style={{ display: "block", width: 560 }}
  />
);

/** Roster expanded: status chips, sparklines with trend projections,
 * forecast dates, and the record-swap repair button. Slimmed to one low
 * battery + four roster rows so the whole composition fits the capture
 * viewport (700px). */
const EXPANDED_FLEET = {
  ...FLEET,
  total: 4,
  low: [SMOKE],
  soon: [],
  all: [SMOKE, DOOR, REMOTE, WEATHER],
  needs_now: { "9V": 1 },
  needs_soon: {},
  excluded: [],
};

const expandRoster = (el: unknown) => {
  if (!el) return;
  dsProps({ hass: fleetHass(EXPANDED_FLEET) })(el);
  const tryOpen = (attempt: number) => {
    const host = el as HTMLElement;
    const section = host.shadowRoot?.querySelector("maintenance-battery-fleet-section");
    const details = section?.shadowRoot?.querySelector<HTMLDetailsElement>("details.bf-roster");
    if (details) {
      details.open = true;
      fixSelectorIcon(section as HTMLElement, 0);
    } else if (attempt < 40) {
      setTimeout(() => tryOpen(attempt + 1), 50);
    }
  };
  tryOpen(0);
};

/** Workaround: the ds-host-stub picker (ha-selector) renders its magnify
 * icon SVG at width/height 100%, which blows it up to the field's full
 * width. Pin it to icon size for the shot. */
const fixSelectorIcon = (section: HTMLElement, attempt: number) => {
  const svg = section.shadowRoot
    ?.querySelector("ha-selector")
    ?.shadowRoot?.querySelector<SVGElement>("svg");
  if (svg) {
    svg.style.width = "18px";
    svg.style.height = "18px";
    svg.style.flex = "0 0 auto";
  } else if (attempt < 40) {
    setTimeout(() => fixSelectorIcon(section, attempt + 1), 50);
  }
};

export const RosterExpanded = () => (
  <maintenance-battery-fleet-card
    ref={expandRoster}
    style={{ display: "block", width: 760 }}
  />
);

const HEALTHY = {
  ...FLEET,
  total: 5,
  low: [],
  soon: [],
  all: [LEAK, THERMO, REMOTE, RING, WEATHER],
  needs_now: {},
  needs_soon: {},
  excluded: [],
};

export const AllHealthy = () => (
  <maintenance-battery-fleet-card
    ref={dsProps({ hass: fleetHass(HEALTHY) })}
    style={{ display: "block", width: 560 }}
  />
);
