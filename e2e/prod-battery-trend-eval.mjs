/** READ-ONLY evaluation: would the discharge-trend forecast produce sensible
 *  results on the PRODUCTION system's real batteries?
 *
 *  Pulls 30 d of hourly recorder statistics for every Battery-Notes percentage
 *  sensor and runs the SAME math locally (linear regression, r² confidence,
 *  threshold = max(battery_low_threshold, 20)). Nothing is written.
 *
 *   HA_URL=… HA_PROD_TOKEN=… node e2e/prod-battery-trend-eval.mjs
 */
import { wsClient, watchdog } from "./ws-client.mjs";

const URL = process.env.HA_URL;
const TOKEN = process.env.HA_PROD_TOKEN;
const FLOOR = 20;
const LOOKBACK_DAYS = 30;
watchdog(6 * 60e3, "prod trend eval");

function regress(points) {
  // points: [(day_float, value)] — mirrors sensor_predictor._linear_regression.
  const n = points.length;
  if (n < 5) return null;
  const x0 = points[0][0];
  let sx = 0, sy = 0, sxx = 0, sxy = 0;
  for (const [x, y] of points) { const t = x - x0; sx += t; sy += y; sxx += t * t; sxy += t * y; }
  const den = n * sxx - sx * sx;
  if (den === 0) return null;
  const slope = (n * sxy - sx * sy) / den;
  const mean = sy / n;
  let ssTot = 0, ssRes = 0;
  const intercept = (sy - slope * sx) / n;
  for (const [x, y] of points) { const t = x - x0; ssTot += (y - mean) ** 2; ssRes += (y - (slope * t + intercept)) ** 2; }
  const r2 = ssTot === 0 ? 0 : 1 - ssRes / ssTot;
  return { slope, r2 };
}

const api = await wsClient(URL, TOKEN);
try {
  const states = await api.send({ type: "get_states" });
  const cands = states.filter((s) => {
    const a = s.attributes || {};
    return s.entity_id.startsWith("sensor.") && a.device_class === "battery" && "battery_type" in a
      && Number.isFinite(parseFloat(s.state));
  });
  console.log(`percentage batteries on prod: ${cands.length}\n`);
  const start = new Date(Date.now() - (LOOKBACK_DAYS + 1) * 864e5).toISOString();
  const stats = await api.send({
    type: "recorder/statistics_during_period",
    start_time: start,
    statistic_ids: cands.map((c) => c.entity_id),
    period: "hour", types: ["mean"],
  });

  let trend = 0, fallback = 0;
  const rows = [];
  for (const s of cands) {
    const a = s.attributes;
    const level = parseFloat(s.state);
    const pts = (stats[s.entity_id] || [])
      .filter((r) => r.mean != null)
      .map((r) => [r.start / 864e5, r.mean]);
    // Recovery guard (mirrors the shipped logic): a rise > 10 % after a
    // window minimum means the percentage tracks something other than
    // discharge (cold-dip voltage bounce) — no trend.
    let minSeen = Infinity, maxRecovery = 0;
    for (const [, v] of pts) { minSeen = Math.min(minSeen, v); maxRecovery = Math.max(maxRecovery, v - minSeen); }
    const reg = regress(pts);
    const thr = Math.max(typeof a.battery_low_threshold === "number" ? a.battery_low_threshold : 10, FLOOR);
    let verdict = "fallback (table)";
    let extra = "";
    if (reg && reg.slope < 0) {
      const conf = reg.r2 >= 0.7 ? "high" : reg.r2 >= 0.3 ? "medium" : "low";
      const days = Math.min((level - thr) / -reg.slope, 3650);
      extra = `slope=${reg.slope.toFixed(3)}%/d r2=${reg.r2.toFixed(2)} -> ${conf}`;
      if (maxRecovery > 10) {
        verdict = "fallback (recovered +" + maxRecovery.toFixed(1) + "%)";
        fallback++;
      } else if (days > 365) {
        verdict = 'fallback (>365 d extrapolation)';
        fallback++;
      } else if (conf !== "low" && level > thr && !a.battery_low) {
        verdict = `TREND: empty in ~${Math.round(days)} d (${new Date(Date.now() + days * 864e5).toISOString().slice(0, 10)})`;
        trend++;
      } else {
        extra += " (filtered)";
        fallback++;
      }
    } else {
      extra = reg ? `slope=${reg.slope.toFixed(3)}%/d r2=${reg.r2.toFixed(2)} (not falling)` : `points=${pts.length} (too thin)`;
      fallback++;
    }
    rows.push(`${(a.device_name || s.entity_id).padEnd(38).slice(0, 38)} ${String(level).padStart(5)}%  ${verdict.padEnd(40)} ${extra}`);
  }
  rows.sort();
  console.log(rows.join("\n"));
  console.log(`\ntrend-capable: ${trend} / ${cands.length}  (rest -> table fallback)`);
} finally {
  api.close();
}
