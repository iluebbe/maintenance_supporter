/** Live recovery test for the #86 (2nd report) fix against the throwaway
 *  ha-shots instance (port 8131). Reproduces jayg37's flow:
 *   1. Baseline: global entry loaded, summary sensors present, objects present.
 *   2. Delete the global entry → orphaned state (objects remain, summary
 *      sensors gone, missing-global-entry repair issue raised).
 *   3. Recreate the global entry via the config flow (as the repair does) →
 *      it must set up cleanly (state "loaded", NOT "setup_error" from the old
 *      "Overwriting panel" crash), summary sensors come back, and the existing
 *      objects are untouched (no recreation needed).
 */
import fs from "fs";
const REST = "http://localhost:8131";
const CID = REST + "/";
const USER = "demo", PASS = "demo-pass-1";
const log = (...a) => console.log(...a);
setTimeout(() => { console.error("WATCHDOG"); process.exit(3); }, 90e3);
const j = (r) => r.json();

async function exchange(code) {
  const t = await fetch(REST + "/auth/token", {
    method: "POST",
    body: new URLSearchParams({ grant_type: "authorization_code", code, client_id: CID }),
  }).then(j);
  if (!t.access_token) throw new Error("token exchange failed " + JSON.stringify(t));
  return t.access_token;
}
async function login() {
  const f = await fetch(REST + "/auth/login_flow", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: CID, handler: ["homeassistant", null], redirect_uri: CID }),
  }).then(j);
  const s = await fetch(REST + "/auth/login_flow/" + f.flow_id, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: CID, username: USER, password: PASS }),
  }).then(j);
  return exchange(s.result);
}

const token = await login();
const auth = { Authorization: "Bearer " + token, "Content-Type": "application/json" };

const entries = () => fetch(REST + "/api/config/config_entries/entry", { headers: auth }).then(j);
const msEntries = async () => (await entries()).filter((e) => e.domain === "maintenance_supporter");
const globalEntry = async () => (await msEntries()).find((e) => e.title === "Maintenance Supporter");
const objectEntries = async () => (await msEntries()).filter((e) => e.title !== "Maintenance Supporter");
async function state(entityId) {
  const r = await fetch(REST + "/api/states/" + entityId, { headers: auth });
  if (!r.ok) return null;
  return (await r.json()).state;
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── 1. Baseline ──────────────────────────────────────────────────────────────
const g0 = await globalEntry();
const objs0 = await objectEntries();
log("baseline: global entry state =", g0 && g0.state, "| object entries =", objs0.length);
if (!g0) throw new Error("no global entry to start from");
const overdue0 = await state("sensor.maintenance_supporter_overdue");
log("baseline: sensor.maintenance_supporter_overdue =", overdue0);
if (overdue0 === null) throw new Error("baseline summary sensor missing");

// ── 2. Delete the global entry → orphaned ────────────────────────────────────
await fetch(REST + "/api/config/config_entries/entry/" + g0.entry_id, { method: "DELETE", headers: auth });
await sleep(4000);
const gGone = await globalEntry();
const objsAfterDel = await objectEntries();
const overdueGone = await state("sensor.maintenance_supporter_overdue");
log("after delete: global entry =", gGone ? gGone.state : "ABSENT", "| object entries =", objsAfterDel.length,
    "| overdue sensor =", overdueGone);
if (gGone) throw new Error("global entry still present after delete");
if (objsAfterDel.length !== objs0.length) throw new Error("object entries changed on global delete!");
if (overdueGone !== null && overdueGone !== "unknown" && overdueGone !== "unavailable")
  throw new Error("summary sensor still live after global delete: " + overdueGone);

// ── 3. Recreate the global entry via the config flow ─────────────────────────
const start = await fetch(REST + "/api/config/config_entries/flow", {
  method: "POST", headers: auth,
  body: JSON.stringify({ handler: "maintenance_supporter", show_advanced_options: false }),
}).then(j);
let res = start;
if (start.type === "form") {
  res = await fetch(REST + "/api/config/config_entries/flow/" + start.flow_id, {
    method: "POST", headers: auth,
    body: JSON.stringify({ default_warning_days: 7, notifications_enabled: false, notify_service: "" }),
  }).then(j);
}
if (res.type !== "create_entry") throw new Error("recreate flow failed: " + JSON.stringify(res).slice(0, 200));
await sleep(6000);

// ── 4. Verify clean recovery ─────────────────────────────────────────────────
const gNew = await globalEntry();
const objsNew = await objectEntries();
const overdueNew = await state("sensor.maintenance_supporter_overdue");
log("after recreate: global entry state =", gNew && gNew.state, "| object entries =", objsNew.length,
    "| overdue sensor =", overdueNew);
if (!gNew) throw new Error("global entry missing after recreate");
if (gNew.state !== "loaded") throw new Error("global entry not loaded (Overwriting-panel crash?): " + gNew.state);
if (objsNew.length !== objs0.length) throw new Error("object entries changed across recovery!");
if (overdueNew === null || overdueNew === "unknown" || overdueNew === "unavailable")
  throw new Error("summary sensor did not come back: " + overdueNew);

log("RECOVERY OK — global entry reloaded cleanly, summary sensors restored, objects untouched");
process.exit(0);
