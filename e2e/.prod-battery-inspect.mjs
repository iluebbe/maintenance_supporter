/** TEMPLATE, READ-ONLY: deep-dive one device's battery series — long-term
 *  weekly profile vs temperature, plus the fall/recovery signature the trend
 *  predictor keys on (a battery that "recovers" within the window is a
 *  cold-dip or self-charger and must not get a linear forecast).
 *
 *    PROD_DEVICE_ID  device registry id to inspect (required)
 *
 *  Usage: HA_URL=... HA_PROD_TOKEN=... PROD_DEVICE_ID=<32-hex> \
 *         node e2e/.prod-battery-inspect.mjs
 */
import { wsClient, watchdog } from "./ws-client.mjs";

const DEVICE = process.env.PROD_DEVICE_ID;
if (!DEVICE) {
  console.log("set PROD_DEVICE_ID");
  process.exit(1);
}
const api = await wsClient(process.env.HA_URL, process.env.HA_PROD_TOKEN);
watchdog(5 * 60e3, "battery inspect");
try {
  // Find the battery + temperature entities of that device.
  const ents = await api.send({ type: "config/entity_registry/list" });
  const mine = ents.filter((e) => e.device_id === DEVICE).map((e) => e.entity_id);
  console.log("device entities:", mine.join(", "));
  const batt = mine.find((e) => e.includes("battery") && e.startsWith("sensor.") && !e.includes("_low"));
  const temp = mine.find((e) => e.startsWith("sensor.") && /temp/i.test(e) && !e.includes("battery"));
  console.log("battery:", batt, "| temperature:", temp);

  const DAYS = 150;
  const start = new Date(Date.now() - DAYS * 864e5).toISOString();
  const ids = [batt, temp].filter(Boolean);
  const stats = await api.send({
    type: "recorder/statistics_during_period", start_time: start,
    statistic_ids: ids, period: "day", types: ["mean", "min", "max"],
  });

  const rows = stats[batt] || [];
  console.log(`\nbattery daily stats: ${rows.length} days`);
  // Weekly profile: week start, batt mean/min/max, temp mean.
  const tRows = stats[temp] || [];
  const tByDay = new Map(tRows.map((r) => [Math.floor(r.start / 864e5), r.mean]));
  let week = [];
  const out = [];
  for (const r of rows) {
    week.push(r);
    if (week.length === 7) {
      const d = new Date(week[0].start).toISOString().slice(0, 10);
      const means = week.map((x) => x.mean).filter((v) => v != null);
      const mins = week.map((x) => x.min ?? x.mean).filter((v) => v != null);
      const maxs = week.map((x) => x.max ?? x.mean).filter((v) => v != null);
      const temps = week.map((x) => tByDay.get(Math.floor(x.start / 864e5))).filter((v) => v != null);
      const avg = (a) => (a.length ? (a.reduce((s, v) => s + v, 0) / a.length) : NaN);
      out.push(`${d}  batt ${avg(means).toFixed(1)}% (min ${Math.min(...mins).toFixed(0)} / max ${Math.max(...maxs).toFixed(0)})   temp ${avg(temps).toFixed(1)}°C`);
      week = [];
    }
  }
  console.log(out.join("\n"));

  // Recovery detection over the last 30 d hourly (what the predictor sees).
  const h = await api.send({
    type: "recorder/statistics_during_period",
    start_time: new Date(Date.now() - 31 * 864e5).toISOString(),
    statistic_ids: [batt], period: "hour", types: ["mean"],
  });
  const pts = (h[batt] || []).filter((r) => r.mean != null).map((r) => r.mean);
  let minSeen = Infinity, maxRecovery = 0;
  for (const v of pts) { minSeen = Math.min(minSeen, v); maxRecovery = Math.max(maxRecovery, v - minSeen); }
  console.log(`\nlast 30 d hourly: ${pts.length} pts, first ${pts[0]}, last ${pts[pts.length - 1]}, min ${minSeen}, max recovery after a low: +${maxRecovery.toFixed(1)} %`);
} finally {
  api.close();
}
