/** Live check of the discharge-trend forecast (#114 follow-up):
 *
 *   1. import 30 d of falling hourly statistics for one fleet battery
 *   2. fleet overview → that battery's ~date is TREND-based (source +
 *      confidence set, days_until plausible), the others stay "typical"
 *   3. second call is served from the 6 h cache (same result)
 *
 *  Run against a FRESHLY RESTARTED ha-maint (the trend cache lives in
 *  hass.data and the smoke needs a cold one).
 *
 *   HA_TOKEN=… node e2e/live-battery-trend-smoke.mjs
 */
import { wsClient, watchdog } from "./ws-client.mjs";

const URL = process.env.HA_URL || "http://127.0.0.1:8125";
const D = "maintenance_supporter";
let ENTITY = null;
watchdog(5 * 60e3, "battery trend smoke");

let failed = 0;
const check = (ok, label) => { console.log(`${ok ? "PASS" : "FAIL"}  ${label}`); if (!ok) failed++; };

const api = await wsClient(URL, process.env.HA_TOKEN);
try {
  // Pick a HEALTHY percentage battery (well above the 20 % floor) — low ones
  // are deliberately excluded from the trend forecast. Chosen from raw states,
  // NOT via the overview: that call would cache a trend miss for 6 h.
  const states = await api.send({ type: "get_states" });
  const cand = states.find((x) => {
    const a = x.attributes || {};
    const lvl = parseFloat(x.state);
    return x.entity_id.startsWith("sensor.") && a.device_class === "battery"
      && "battery_type" in a && !a.battery_low && Number.isFinite(lvl) && lvl >= 40;
  });
  if (!cand) throw new Error("no healthy percentage battery in the fleet");
  ENTITY = cand.entity_id;
  console.log("candidate:", ENTITY, `(${cand.state}%)`);
  // 30 days hourly, 80 % → 40 % (≈1.33 %/day): clean falling trend; crossing
  // the 20 % floor in ~15 days.
  const now = Date.now();
  const stats = [];
  for (let h = 0; h <= 30 * 24; h += 1) {
    const t = now - (30 * 24 - h) * 3600e3;
    const v = 80 - (40 * h) / (30 * 24);
    stats.push({ start: new Date(Math.floor(t / 3600e3) * 3600e3).toISOString(), mean: v, min: v, max: v });
  }
  await api.send({
    type: "recorder/import_statistics",
    metadata: {
      statistic_id: ENTITY, source: "recorder", name: null,
      unit_of_measurement: "%", has_mean: true, has_sum: false,
    },
    stats,
  });
  console.log("stats imported:", stats.length, "hours");

  // The import is queued onto the recorder worker — poll until the rows are
  // actually readable BEFORE the first overview call, because a premature
  // call caches its miss for six hours.
  let visible = 0;
  for (let i = 0; i < 15 && visible < 500; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const res = await api.send({
      type: "recorder/statistics_during_period",
      start_time: new Date(now - 31 * 864e5).toISOString(),
      statistic_ids: [ENTITY], period: "hour", types: ["mean"],
    });
    visible = (res[ENTITY] || []).length;
  }
  console.log("stats visible to the recorder:", visible);

  const rowOf = (ov) => (ov.all || []).find((r) => r.entity_id === ENTITY);
  const ov1 = await api.send({ type: `${D}/battery_fleet/overview` });
  const row = rowOf(ov1);
  check(!!row, "battery present in the roster");
  check(row.predicted_source === "trend", `trend source (${row.predicted_source})`);
  check(["medium", "high"].includes(row.prediction_confidence), `confidence set (${row.prediction_confidence})`);
  check(row.days_until != null && row.days_until >= 5 && row.days_until <= 40,
    `plausible crossing (${row.days_until} days)`);

  const others = (ov1.all || []).filter((r) => r.entity_id !== ENTITY && r.days_until != null);
  check(others.every((r) => r.predicted_source === "typical"),
    `others stay on the table forecast (${others.length} rows)`);

  const ov2 = await api.send({ type: `${D}/battery_fleet/overview` });
  const row2 = rowOf(ov2);
  check(row2.predicted_source === "trend" && row2.days_until === row.days_until, "cached second call agrees");
} finally {
  api.close();
  console.log(failed ? `\n${failed} check(s) FAILED` : "\nall checks passed");
  process.exitCode = failed ? 1 : 0;
}
