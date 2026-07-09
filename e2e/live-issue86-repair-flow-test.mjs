/** Live end-to-end for the #86 REPAIR flow against the throwaway ha-shots
 *  instance (port 8131). Exercises the exact path jayg37 used:
 *   1. Baseline: global entry loaded, summary sensors present, objects present.
 *   2. Delete the global entry → orphaned state; the "missing_global_entry"
 *      repair issue is raised (checked over WS repairs/list_issues).
 *   3. Drive the REPAIR fix flow (POST /api/repairs/issues/fix) — not the plain
 *      config flow — which recreates the global entry via SOURCE_IMPORT.
 *   4. Verify clean recovery: global entry "loaded" (no Overwriting-panel /
 *      already-registered crash), summary sensors back, objects untouched, and
 *      the repair issue cleared.
 */
const REST = "http://localhost:8131";
const WS = "ws://localhost:8131/api/websocket";
const CID = REST + "/";
const USER = "demo", PASS = "demo-pass-1";
const log = (...a) => console.log(...a);
setTimeout(() => { console.error("WATCHDOG"); process.exit(3); }, 90e3);
const j = (r) => r.json();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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

async function repairIssues() {
  const ws = new WebSocket(WS);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = () => rej(new Error("ws fail")); });
  return await new Promise((resolve, reject) => {
    let id = 1;
    ws.onmessage = (ev) => {
      const m = JSON.parse(ev.data);
      if (m.type === "auth_required") ws.send(JSON.stringify({ type: "auth", access_token: token }));
      else if (m.type === "auth_ok") ws.send(JSON.stringify({ id, type: "repairs/list_issues" }));
      else if (m.type === "result") { ws.close(); resolve(m.success ? m.result.issues : []); }
      else if (m.type === "auth_invalid") { ws.close(); reject(new Error("auth invalid")); }
    };
  });
}
const hasMissingGlobalIssue = async () =>
  (await repairIssues()).some((i) => i.domain === "maintenance_supporter" && i.issue_id === "missing_global_entry");

// ── 1. Baseline ──────────────────────────────────────────────────────────────
const g0 = await globalEntry();
const objs0 = await objectEntries();
log("baseline: global =", g0 && g0.state, "| objects =", objs0.length,
    "| overdue =", await state("sensor.maintenance_supporter_overdue"));
if (!g0) throw new Error("no global entry to start from");

// ── 2. Delete the global entry → orphaned + repair issue ─────────────────────
await fetch(REST + "/api/config/config_entries/entry/" + g0.entry_id, { method: "DELETE", headers: auth });
await sleep(4000);
const objsDel = await objectEntries();
const issueRaised = await hasMissingGlobalIssue();
log("after delete: global =", (await globalEntry()) ? "PRESENT" : "ABSENT",
    "| objects =", objsDel.length, "| overdue =", await state("sensor.maintenance_supporter_overdue"),
    "| missing_global_entry issue =", issueRaised);
if (await globalEntry()) throw new Error("global still present after delete");
if (objsDel.length !== objs0.length) throw new Error("objects changed on delete!");
if (!issueRaised) throw new Error("missing_global_entry repair issue was not raised");

// ── 3. Drive the REPAIR fix flow ─────────────────────────────────────────────
const start = await fetch(REST + "/api/repairs/issues/fix", {
  method: "POST", headers: auth,
  body: JSON.stringify({ handler: "maintenance_supporter", issue_id: "missing_global_entry" }),
}).then(j);
log("repair flow start:", start.type, start.step_id || "");
let done = start;
if (start.type === "form") {
  done = await fetch(REST + "/api/repairs/issues/fix/" + start.flow_id, {
    method: "POST", headers: auth, body: JSON.stringify({}),
  }).then(j);
}
log("repair flow result:", done.type);
if (done.type !== "create_entry") throw new Error("repair fix flow did not finish: " + JSON.stringify(done).slice(0, 200));
await sleep(6000);

// ── 4. Verify clean recovery ─────────────────────────────────────────────────
const gNew = await globalEntry();
const objsNew = await objectEntries();
const overdueNew = await state("sensor.maintenance_supporter_overdue");
const issueCleared = !(await hasMissingGlobalIssue());
log("after repair: global =", gNew && gNew.state, "| objects =", objsNew.length,
    "| overdue =", overdueNew, "| issue cleared =", issueCleared);
if (!gNew) throw new Error("global entry missing after repair");
if (gNew.state !== "loaded") throw new Error("global entry not loaded (panel/route crash?): " + gNew.state);
if (objsNew.length !== objs0.length) throw new Error("objects changed across repair!");
if (overdueNew === null || overdueNew === "unknown" || overdueNew === "unavailable")
  throw new Error("summary sensor did not come back: " + overdueNew);
if (!issueCleared) throw new Error("repair issue not cleared after recovery");

log("REPAIR FLOW OK — orphaned → repair issue → fix flow recreated global entry cleanly, sensors + objects intact, issue cleared");
process.exit(0);
