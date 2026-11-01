// The large household for the timelapse (HOUSEHOLD=large): thirty objects
// from the template gallery next to seed.json's eight, and sensor rules of
// every kind on sensors that drift DAY by day, so the task pages have real
// charts, sparklines and trigger episodes, and the panel's lists are long
// enough to show what a full installation looks like.
//
// The sensors are pushed through the REST API like the seed's own, once a
// week when the clock moves; their day-by-day values are kept and imported
// as hourly recorder statistics at the end, the way the charts read them.
// A completion resets the sensor its task is about (a new filter brings the
// airflow back). Nothing here talks to the integration except through its
// WebSocket commands. The counters carry no state_class: the recorder would
// compile its own sum statistics for them and refuse the imported means.
import { setState } from "../migration/lib.mjs";

export const TEMPLATES = [
  "vehicle_ev", "vehicle_bicycle", "home_hvac", "home_water_heater", "home_water_softener", "home_ventilation",
  "home_fireplace", "home_houseplants", "home_bathroom_fan", "household_bathroom", "household_kitchen", "home_knives",
  "garden_lawn_mower", "garden_irrigation", "appliance_washing_machine", "appliance_dryer", "appliance_espresso",
  "appliance_robot_vacuum", "pets_litter_box", "tech_printer", "tech_nas", "tech_camera", "pets_aquarium",
  "home_heat_pump", "home_solar_pv", "home_garage_door", "household_dehumidifier", "household_air_purifier",
  "tech_ups", "garden_rainwater_tank",
];

/** value, unit/attributes, daily step (rand → change), the value after the
 *  task is done (null = a counter: its rule counts from the completion). */
export function sensors(rand) {
  return {
    "sensor.hvac_airflow": { v: 97, attrs: { unit_of_measurement: "%", friendly_name: "HVAC airflow" }, day: () => -(0.25 + rand() * 0.35), reset: 98, min: 0 },
    "sensor.softener_salt_level": { v: 90, attrs: { unit_of_measurement: "%", friendly_name: "Softener salt level" }, day: () => -(0.6 + rand() * 0.9), reset: 100, min: 0 },
    "sensor.purifier_filter_life": { v: 70, attrs: { unit_of_measurement: "%", friendly_name: "Purifier filter life" }, day: () => -(0.15 + rand() * 0.2), reset: 100, min: 0 },
    "sensor.washer_total_washes": { v: 412, attrs: { friendly_name: "Washer total washes" }, counter: true, day: () => (rand() < 0.6 ? 1 : 0), reset: null },
    "sensor.car_odometer": { v: 18250, attrs: { unit_of_measurement: "km", device_class: "distance", friendly_name: "Car odometer" }, counter: true, day: () => Math.round(15 + rand() * 60), reset: null },
    "sensor.dehumidifier_tank": { v: 10, attrs: { unit_of_measurement: "%", friendly_name: "Dehumidifier tank" }, day: () => 4 + rand() * 6, reset: 5, max: 100 },
    "sensor.basement_humidity": { v: 58, attrs: { unit_of_measurement: "%", device_class: "humidity", friendly_name: "Basement humidity" }, day: () => (rand() - 0.45) * 3, reset: null, min: 35, max: 85 },
    "sensor.printer_status": { v: "idle", attrs: { friendly_name: "Printer status" }, day: () => (rand() < 0.04 ? "paper_jam" : null), reset: "idle" },
  };
}

/** The sensor rules, added to the template objects by name. */
export const RULES = [
  { object: "HVAC System", name: "Replace the filter (airflow)", interval_days: 180,
    trigger_config: { type: "threshold", entity_id: "sensor.hvac_airflow", entity_ids: ["sensor.hvac_airflow"], trigger_below: 60 }, resets: "sensor.hvac_airflow" },
  { object: "Water Softener", name: "Refill the salt", interval_days: null,
    trigger_config: { type: "threshold", entity_id: "sensor.softener_salt_level", entity_ids: ["sensor.softener_salt_level"], trigger_below: 20 }, resets: "sensor.softener_salt_level" },
  { object: "Air Purifier", name: "Replace the purifier filter", interval_days: 365,
    trigger_config: { type: "threshold", entity_id: "sensor.purifier_filter_life", entity_ids: ["sensor.purifier_filter_life"], trigger_below: 10 }, resets: "sensor.purifier_filter_life" },
  { object: "Washing Machine", name: "Clean the drum and seal", interval_days: 90,
    trigger_config: { type: "counter", entity_id: "sensor.washer_total_washes", entity_ids: ["sensor.washer_total_washes"], trigger_delta_mode: true, trigger_target_value: 40 } },
  { object: "Electric Car", name: "Rotate the tyres (distance)", interval_days: 365,
    trigger_config: { type: "counter", entity_id: "sensor.car_odometer", entity_ids: ["sensor.car_odometer"], trigger_delta_mode: true, trigger_target_value: 8000 } },
  { object: "Dehumidifier", name: "Empty the tank or ventilate", interval_days: null,
    trigger_config: { type: "compound", compound_logic: "OR", conditions: [
      { type: "threshold", entity_id: "sensor.dehumidifier_tank", trigger_above: 90 },
      { type: "threshold", entity_id: "sensor.basement_humidity", trigger_above: 72 },
    ] }, resets: "sensor.dehumidifier_tank" },
  { object: "Printer", name: "Clear a paper jam", interval_days: null,
    trigger_config: { type: "state_change", entity_id: "sensor.printer_status", entity_ids: ["sensor.printer_status"], trigger_to_state: "paper_jam" }, resets: "sensor.printer_status" },
];

export async function setup(api, ws, log) {
  let made = 0;
  for (const id of TEMPLATES) {
    await ws.call({ type: "maintenance_supporter/object/from_template", template_id: id, language: "en" }).then(() => made++, (e) => log(`template ${id}:`, String(e.message).slice(0, 100)));
  }
  await new Promise((r) => setTimeout(r, 8000));
  const objs = (await ws.call({ type: "maintenance_supporter/objects" })).objects || [];
  let rules = 0;
  for (const r of RULES) {
    const o = objs.find((x) => x.object.name === r.object);
    if (!o) { log(`no object "${r.object}" for "${r.name}"`); continue; }
    await ws.call({
      type: "maintenance_supporter/task/create", entry_id: o.entry_id, name: r.name, task_type: "replacement",
      schedule_type: "sensor_based", ...(r.interval_days ? { interval_days: r.interval_days } : {}), trigger_config: r.trigger_config,
    }).then(() => rules++, (e) => log(`rule ${r.name}:`, String(e.message).slice(0, 140)));
  }
  log(`large household: ${made} template objects, ${rules} sensor rules`);
}

export async function push(base, token, state) {
  for (const [id, s] of Object.entries(state)) {
    const v = typeof s.v === "number" ? (Number.isInteger(s.v) ? String(s.v) : s.v.toFixed(1)) : s.v;
    await setState(base, token, id, v, s.attrs);
  }
}

export function day(state) {
  for (const s of Object.values(state)) {
    const step = s.day();
    if (typeof s.v === "number") {
      s.v += step;
      if (s.min !== undefined) s.v = Math.max(s.min, s.v);
      if (s.max !== undefined) s.v = Math.min(s.max, s.v);
    } else if (step !== null) {
      s.v = step;
    }
  }
}

/** The household did what the task asked: the sensor it watched recovers. */
export function completed(state, taskName) {
  const rule = RULES.find((r) => r.name === taskName);
  if (!rule?.resets) return;
  const s = state[rule.resets];
  if (s && s.reset !== null) s.v = s.reset;
}

/** One value a day per numeric sensor, for the statistics import. */
export function note(state, date) {
  for (const s of Object.values(state)) {
    if (typeof s.v !== "number") continue;
    (s.series ||= []).push({ t: date.getTime(), v: s.v });
  }
}

/** The daily values as hourly statistics, straight lines between the days
 *  — what HA's own statistics look like for a sensor that reported all year:
 *  mean/min/max for a measurement, state/sum for a counter (what the panel
 *  asks a counter rule's chart for). Returns the number of rows imported. */
export async function importSeries(ws, state) {
  let rows = 0;
  for (const [id, s] of Object.entries(state)) {
    if (!s.series?.length) continue;
    const stats = [];
    for (let i = 0; i + 1 < s.series.length; i++) {
      const a = s.series[i];
      const b = s.series[i + 1];
      for (let h = 0; h < 24; h++) {
        const v = Math.round((a.v + ((b.v - a.v) * h) / 24) * 10) / 10;
        const start = new Date(a.t + h * 3600e3).toISOString();
        stats.push(s.counter ? { start, state: v, sum: Math.round((v - s.series[0].v) * 10) / 10 } : { start, mean: v, min: v, max: v });
      }
    }
    await ws.call({
      type: "recorder/import_statistics",
      metadata: { has_mean: !s.counter, has_sum: !!s.counter, name: null, source: "recorder", statistic_id: id, unit_of_measurement: s.attrs.unit_of_measurement ?? null },
      stats,
    });
    rows += stats.length;
  }
  return rows;
}
