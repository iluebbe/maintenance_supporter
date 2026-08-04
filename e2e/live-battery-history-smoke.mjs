/** Live check of the roster-sparkline history WS (fleet-UI wave):
 *
 *   1. import 30 d hourly statistics for two fleet batteries — one clean
 *      falling series, one with an unrecorded-swap signature (a week at
 *      ~15 %, jump to 100, then decline)
 *   2. battery_fleet/overview_history → downsampled points (≤60), the low
 *      threshold, NO jump on the monotone series, and — when the entity has
 *      a registry device — a jump {at, from, to, device_id} on the stepped one
 *   3. second call is served from the 6 h cache (identical result)
 *
 *  Run against a FRESHLY RESTARTED ha-maint (the history cache lives in
 *  hass.data and the smoke needs a cold one).
 *
 *   HA_TOKEN=… node e2e/live-battery-history-smoke.mjs
 */
import { wsClient, watchdog } from "./ws-client.mjs";

const URL = process.env.HA_URL || "http://127.0.0.1:8125";
const D = "maintenance_supporter";
watchdog(5 * 60e3, "battery history smoke");

let failed = 0;
const check = (ok, label) => { console.log(`${ok ? "PASS" : "FAIL"}  ${label}`); if (!ok) failed++; };

const api = await wsClient(URL, process.env.HA_TOKEN);
try {
  // Ensure the dev fixture integration is set up (device-backed BN-shaped
  // batteries — see docker/dev_battery_fixtures). Idempotent: the flow
  // aborts when the entry already exists.
  const entries = await api.send({ type: "config_entries/get" });
  if (!entries.some((e) => e.domain === "dev_battery_fixtures")) {
    const flow = await fetch(`${URL}/api/config/config_entries/flow`, {
      method: "POST",
      headers: { Authorization: "Bearer " + process.env.HA_TOKEN, "Content-Type": "application/json" },
      body: JSON.stringify({ handler: "dev_battery_fixtures", show_advanced_options: false }),
    }).then((r) => r.json());
    console.log("fixture entry created:", JSON.stringify(flow).slice(0, 140));
    await new Promise((r) => setTimeout(r, 3000));
  }
  const states = await api.send({ type: "get_states" });
  const reg = await api.send({ type: "config/entity_registry/list" });
  const regByEid = new Map(reg.map((e) => [e.entity_id, e]));
  const healthy = states.filter((x) => {
    const a = x.attributes || {};
    const lvl = parseFloat(x.state);
    return x.entity_id.startsWith("sensor.") && a.device_class === "battery"
      && "battery_type" in a && !a.battery_low && Number.isFinite(lvl) && lvl >= 40;
  });
  if (healthy.length < 2) throw new Error("need two healthy percentage batteries in the fleet");
  // Prefer the Hall Motion fixture (device-backed, 21-month-old
  // last_replaced) for the jump case; any device-backed battery otherwise.
  const jumpCand =
    healthy.find((x) => x.entity_id.includes("fixture_hall_motion"))
    ?? healthy.find((x) => regByEid.get(x.entity_id)?.device_id)
    ?? healthy[1];
  const fallCand = healthy.find((x) => x !== jumpCand);
  const FALL = fallCand.entity_id, JUMP = jumpCand.entity_id;
  const jumpHasDevice = !!regByEid.get(JUMP)?.device_id;
  console.log("falling:", FALL, "| stepped:", JUMP, jumpHasDevice ? "(device-backed)" : "(state-only - jump payload not expected)");

  const now = Date.now();
  const seed = async (entity, valueAt) => {
    const stats = [];
    for (let h = 0; h <= 30 * 24; h += 1) {
      const t = now - (30 * 24 - h) * 3600e3;
      const v = valueAt(h);
      stats.push({ start: new Date(Math.floor(t / 3600e3) * 3600e3).toISOString(), mean: v, min: v, max: v });
    }
    await api.send({
      type: "recorder/import_statistics",
      metadata: { statistic_id: entity, source: "recorder", name: null, unit_of_measurement: "%", has_mean: true, has_sum: false },
      stats,
    });
  };
  await seed(FALL, (h) => 80 - (40 * h) / (30 * 24));
  await seed(JUMP, (h) => (h < 7 * 24 ? 15 : 100 - (30 * (h - 7 * 24)) / (23 * 24)));
  console.log("stats imported for both");

  // Import flushes asynchronously on the recorder worker — poll until BOTH
  // series are readable before the first history call (a premature call
  // caches its miss for six hours).
  let vis = 0;
  for (let i = 0; i < 15 && vis < 2; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const res = await api.send({
      type: "recorder/statistics_during_period",
      start_time: new Date(now - 31 * 864e5).toISOString(),
      statistic_ids: [FALL, JUMP], period: "hour", types: ["mean"],
    });
    vis = [FALL, JUMP].filter((e) => (res[e] || []).length >= 500).length;
  }
  console.log("series visible to the recorder:", vis, "/ 2");

  const h1 = await api.send({ type: `${D}/battery_fleet/overview_history` });
  const fall = h1.series?.[FALL], jump = h1.series?.[JUMP];
  check(!!fall, "falling battery has a series");
  check(!!jump, "stepped battery has a series");
  check(fall.points.length >= 20 && fall.points.length <= 60, `downsampled point count (${fall.points.length})`);
  check(fall.threshold >= 20, `threshold carries the low floor (${fall.threshold})`);
  const values = fall.points.map((p) => p[1]);
  check(values[0] > values[values.length - 1], "falling series actually falls");
  check(fall.jump === undefined, "monotone series carries no jump");
  if (jumpHasDevice) {
    check(!!jump.jump, "stepped series carries the unrecorded-swap jump");
    if (jump.jump) {
      check(jump.jump.to - jump.jump.from >= 25, `jump size (${jump.jump.from} -> ${jump.jump.to})`);
      check(jump.jump.device_id === regByEid.get(JUMP).device_id, "jump names the source device");
      const days = (now / 1000 - jump.jump.at) / 86400;
      check(days > 20 && days < 26, `jump time ~23 d ago (${days.toFixed(1)} d)`);
    }
  } else {
    console.log("SKIP  jump payload assertions (no registry device on the candidate)");
  }

  const h2 = await api.send({ type: `${D}/battery_fleet/overview_history` });
  check(JSON.stringify(h2.series?.[FALL]) === JSON.stringify(fall), "cached second call agrees");
} finally {
  api.close();
  console.log(failed ? `\n${failed} check(s) FAILED` : "\nall checks passed");
  process.exitCode = failed ? 1 : 0;
}
