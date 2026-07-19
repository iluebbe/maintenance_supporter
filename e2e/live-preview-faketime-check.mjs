/** Faketime check for schedule/preview: with HA's clock frozen at
 *  2026-12-01, the engine's "today" must be the FAKED date — exact
 *  expected occurrences, no structural hedging. */
import { loadToken, watchdog, wsClient } from "./ws-client.mjs";

const REST = "http://127.0.0.1:8125";
const log = (...a) => console.log(...a);
const fail = (m) => { console.error("FAIL:", m); throw new Error(m); };
const assert = (cond, msg) => { if (!cond) fail(msg); log("  ok:", msg); };
watchdog(3 * 60e3, "faketime preview check");

const api = await wsClient(REST, loadToken());
try {
  // #83: 2nd Saturday, window Jan+Jul — exact dates from faked 2026-12-01.
  const r1 = await api.send({
    type: "maintenance_supporter/schedule/preview",
    schedule: { kind: "nth_weekday", nth: 2, weekday: 5, season_months: [1, 7] },
  });
  log("  #83:", JSON.stringify(r1.occurrences));
  assert(
    JSON.stringify(r1.occurrences) === JSON.stringify(["2027-01-09", "2027-07-10", "2028-01-08"]),
    "exact 2nd Saturdays of Jan/Jul from faked today",
  );

  // 30-day interval anchors on the FAKED today: Dec 31, Jan 30, Mar 1.
  const r2 = await api.send({
    type: "maintenance_supporter/schedule/preview",
    schedule: { kind: "interval", every: 30, unit: "days" },
  });
  log("  interval:", JSON.stringify(r2.occurrences));
  assert(
    JSON.stringify(r2.occurrences) === JSON.stringify(["2026-12-31", "2027-01-30", "2027-03-01"]),
    "interval anchored on the faked 2026-12-01",
  );

  // last_performed beats the faked today as anchor.
  const r3 = await api.send({
    type: "maintenance_supporter/schedule/preview",
    schedule: { kind: "interval", every: 1, unit: "months" },
    last_performed: "2026-11-15",
  });
  log("  monthly:", JSON.stringify(r3.occurrences));
  assert(
    JSON.stringify(r3.occurrences) === JSON.stringify(["2026-12-15", "2027-01-15", "2027-02-15"]),
    "monthly steps from last_performed under faketime",
  );

  log("FAKETIME PREVIEW CHECK PASSED");
} finally {
  await api.close();
}
