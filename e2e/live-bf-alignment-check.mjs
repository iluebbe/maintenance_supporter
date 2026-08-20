/** Geometric alignment check for the battery-fleet rows (issue-66 class).
 *
 *  The roster used to be a flex row per battery: every optional element
 *  (status chip, sparkline, bar, percentage, forecast date) shifted the rest
 *  of ITS row, so the right side never lined up across rows. Now the list is
 *  a grid + subgrid with pinned columns — this check measures
 *  getBoundingClientRect() across ALL roster rows on the seeded ha-shots
 *  demo (which has the messy variety: rows with/without sparklines, a long
 *  "LITHIUM 3-VOLT CR2" type, missing dates) and asserts each column edge
 *  is identical (±1 px) — at desktop 1280 AND narrow 400 (where spark/bar
 *  are display:none and their columns collapse).
 */
import { chromium } from "@playwright/test";
import { watchdog, wsClient } from "./ws-client.mjs";

const REST = "http://127.0.0.1:8131";
const HA = "http://ha-shots:8123";
const PW_WS = "ws://127.0.0.1:3000/";
const CID = HA + "/";
const log = (...a) => console.log(...a);
const fail = (m) => { console.error("FAIL:", m); throw new Error(m); };
const assert = (cond, msg) => { if (!cond) fail(msg); log("  ok:", msg); };
watchdog(6 * 60e3, "bf alignment check");

const j = (r) => r.json();
async function login() {
  const f = await fetch(REST + "/auth/login_flow", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: CID, handler: ["homeassistant", null], redirect_uri: CID }),
  }).then(j);
  const s = await fetch(REST + "/auth/login_flow/" + f.flow_id, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: CID, username: "demo", password: "demo-pass-1" }),
  }).then(j);
  const t = await fetch(REST + "/auth/token", {
    method: "POST",
    body: new URLSearchParams({ grant_type: "authorization_code", code: s.result, client_id: CID }),
  }).then(j);
  if (!t.access_token) throw new Error("login failed");
  return t.access_token;
}

const token = await login();
const api = await wsClient(REST, token);
const objs = (await api.send({ type: "maintenance_supporter/objects" })).objects;
let fleetEntry = null, fleetTaskId = null;
for (const o of objs) {
  const ft = (o.tasks || []).find((t2) => t2.battery_fleet_task);
  if (ft) { fleetEntry = o.entry_id; fleetTaskId = ft.id; break; }
}
if (!fleetEntry) fail("no fleet task on ha-shots");
api.close();

const MEASURE = ({ e, t2 }) => {
  const deep = (pred) => { const st = [document.documentElement]; const o = []; let n = 0;
    while (st.length && n < 80000) { const el = st.pop(); n++; if (!el) continue;
      if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
      for (const k of (el.children || [])) st.push(k); } return o; };
  const panel = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-PANEL")[0];
  if (!panel || !panel.shadowRoot || !Array.isArray(panel._objects) || !panel._objects.length) return null;
  if (!window.__navigated) { panel._showTask(e, t2); window.__navigated = true; return null; }
  const sec = panel.shadowRoot.querySelector("maintenance-battery-fleet-section");
  if (!sec || !sec.shadowRoot) return null;
  const roster = sec.shadowRoot.querySelector("details.bf-roster");
  if (!roster) return null;
  if (!roster.open) { roster.open = true; return null; }
  const rows = [...roster.querySelectorAll(".bf-row")];
  if (rows.length < 5) return null;
  const edges = {};
  const collect = (sel, edge) => {
    edges[sel + ":" + edge] = rows
      .map((r) => r.querySelector(sel))
      .filter(Boolean)
      .map((el2) => Math.round(el2.getBoundingClientRect()[edge]));
  };
  collect(".bf-status", "right");
  collect(".bf-type", "left");
  collect(".bf-level", "right");
  collect(".bf-predicted", "right");
  collect(".bf-exclude", "right");
  return { rowCount: rows.length, edges };
};

let browser = null;
try {
  browser = await chromium.connect(PW_WS, { timeout: 20000 });
  for (const [label, viewport] of [["desktop-1280", { width: 1280, height: 1600 }], ["narrow-400", { width: 400, height: 1600 }]]) {
    const ctx = await browser.newContext({ viewport });
    const p = await ctx.newPage();
    await p.addInitScript(({ t, ha }) => {
      localStorage.setItem("hassTokens", JSON.stringify({
        access_token: t, token_type: "Bearer", expires_in: 1800,
        hassUrl: ha, clientId: ha + "/", expires: Date.now() + 9e11, refresh_token: "",
      }));
    }, { t: token, ha: HA });
    await p.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded", timeout: 30000 });
    let res = null;
    for (let i = 0; i < 30 && !res; i++) {
      await p.waitForTimeout(1000);
      res = await p.evaluate(MEASURE, { e: fleetEntry, t2: fleetTaskId }).catch(() => null);
    }
    assert(res, `${label}: roster measured (${res && res.rowCount} rows)`);
    for (const [key, vals] of Object.entries(res.edges)) {
      if (vals.length < 2) { log(`  (skip ${label} ${key}: ${vals.length} sample)`); continue; }
      const spread = Math.max(...vals) - Math.min(...vals);
      assert(spread <= 1, `${label} ${key} aligned across ${vals.length} rows (spread ${spread}px)`);
    }
    await ctx.close();
  }
  log("\nALL ALIGNMENT CHECKS PASSED");
  process.exitCode = 0;
} catch (err) {
  console.error("ERROR:", err && (err.stack || err.message || err));
  process.exitCode = 1;
} finally {
  try { if (browser) await browser.close(); } catch { /* ignore */ }
  process.exit(process.exitCode ?? 1);
}
