/** The two docs screenshots no other script owns (both on the seeded
 *  ha-shots demo, dark):
 *
 *  - battery-fleet.png  Battery-fleet task detail with the shopping list and
 *    the opened "All tracked batteries" roster. Battery-Notes-shaped states
 *    are injected via REST (incl. one LOW-ONLY binary battery — the v2.47
 *    #121 shape with a real type and no percentage), then the one-click
 *    fleet setup builds object + task.
 *  - object-report.png  The printable report (opens as a popup page).
 *
 *  Run after shots-demo.mjs has seeded the instance.
 */
import { chromium } from "@playwright/test";
import fs from "fs";
import { wsClient, watchdog } from "./ws-client.mjs";

const REST = "http://127.0.0.1:8131";
const HA = "http://ha-shots:8123";
const PW_WS = "ws://127.0.0.1:3000/";
const CID = HA + "/";
const USER = "demo", PASS = "demo-pass-1";
const OUT = new URL("../docs/images/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const log = (...a) => console.log(...a);
watchdog(8 * 60e3, "remainder3 shots");

const j = (r) => r.json();
async function login() {
  const f = await fetch(REST + "/auth/login_flow", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: CID, handler: ["homeassistant", null], redirect_uri: CID }),
  }).then(j);
  const s = await fetch(REST + "/auth/login_flow/" + f.flow_id, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: CID, username: USER, password: PASS }),
  }).then(j);
  const t = await fetch(REST + "/auth/token", {
    method: "POST",
    body: new URLSearchParams({ grant_type: "authorization_code", code: s.result, client_id: CID }),
  }).then(j);
  if (!t.access_token) throw new Error("login failed");
  return t.access_token;
}

const token = await login();
const auth = { Authorization: "Bearer " + token, "Content-Type": "application/json" };
log("LOGIN OK");

// ── Battery-Notes-shaped states (device_class battery + battery_type) ──────
const monthsAgo = (n) => new Date(Date.now() - n * 30 * 864e5).toISOString();
const NOTES = [
  ["hall_motion",      "Hall Motion",          "CR2450", 1, 82, 9],
  ["front_door_lock",  "Front Door Lock",      "AA",     4, 61, 7],
  ["garage_remote",    "Garage Remote",        "CR2032", 1,  8, 13],
  ["kitchen_smoke",    "Kitchen Smoke Alarm",  "9V",     1, 34, 10],
  ["bedroom_sensor",   "Bedroom Sensor",       "AAA",    2,  6, 12],
  ["patio_door",       "Patio Door",           "CR2032", 1, 55, 5],
  ["utility_leak",     "Utility Leak Sensor",  "CR2",    1, 71, 3],
  ["office_remote",    "Office Remote",        "AAA",    2, 18, 11],
];
for (const [slug, name, type, qty, level, ageMonths] of NOTES) {
  await fetch(`${REST}/api/states/sensor.${slug}_battery_plus`, {
    method: "POST", headers: auth,
    body: JSON.stringify({
      state: String(level),
      attributes: {
        device_class: "battery", unit_of_measurement: "%",
        battery_type: type, battery_quantity: qty,
        battery_low: level <= 10, battery_last_replaced: monthsAgo(ageMonths),
        device_name: name, friendly_name: name + " Battery",
      },
    }),
  });
}
// The v2.47 shape (#121): a lock that reports ONLY a low binary — real type,
// no percentage.
await fetch(`${REST}/api/states/binary_sensor.back_door_lock_battery_plus_low`, {
  method: "POST", headers: auth,
  body: JSON.stringify({
    state: "off",
    attributes: {
      device_class: "battery", battery_type: "Lithium 3-volt CR2",
      battery_quantity: 1, battery_last_replaced: monthsAgo(4),
      device_name: "Back Door Lock", friendly_name: "Back Door Lock Battery low",
    },
  }),
});
log("SEEDED battery states");

const api = await wsClient(REST, token);
let fleetEntry = null;
const existing = (await api.send({ type: "maintenance_supporter/objects" })).objects;
fleetEntry = existing.find((o) => o.object.battery_fleet || /battery fleet/i.test(o.object.name))?.entry_id;
if (!fleetEntry) {
  const res = await api.send({ type: "maintenance_supporter/battery_fleet/setup" });
  fleetEntry = res.entry_id;
  log("FLEET CREATED", fleetEntry);
  await new Promise((r) => setTimeout(r, 4000));
}
const objs = (await api.send({ type: "maintenance_supporter/objects" })).objects;
const fleet = objs.find((o) => o.entry_id === fleetEntry);
const fleetTask = fleet.tasks[0];
const hvac = objs.find((o) => o.object.name === "HVAC System");
api.close();

// ── Browser ────────────────────────────────────────────────────────────────
const b = await chromium.connect(PW_WS, { timeout: 20000 });
const ctx = await b.newContext({ viewport: { width: 1600, height: 1150 }, colorScheme: "dark" });
await ctx.addInitScript(({ t, ha }) => {
  localStorage.setItem("hassTokens", JSON.stringify({
    access_token: t, token_type: "Bearer", expires_in: 1800,
    hassUrl: ha, clientId: ha + "/", expires: Date.now() + 9e11, refresh_token: "",
  }));
}, { t: token, ha: HA });
const p = await ctx.newPage();

const deepFindPanel = `
  const deep = (pred) => { const st=[document.documentElement]; const o=[]; let n=0;
    while (st.length && n < 60000) { const el = st.pop(); n++; if (!el) continue;
      if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
      for (const k of (el.children || [])) st.push(k); } return o; };
  window.__panel = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-PANEL")[0];
`;

await p.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded" });
for (let i = 0; i < 30; i++) {
  const ok = await p.evaluate(({ finder }) => {
    eval(finder);
    return !!window.__panel && Array.isArray(window.__panel._objects) && window.__panel._objects.length > 0;
  }, { finder: deepFindPanel }).catch(() => false);
  if (ok) break;
  await p.waitForTimeout(1000);
}
log("PANEL MOUNTED");

// battery-fleet.png — task detail + opened roster.
await p.evaluate(({ finder, entryId, taskId }) => {
  eval(finder);
  window.__panel._showTask(entryId, taskId);
}, { finder: deepFindPanel, entryId: fleetEntry, taskId: fleetTask.id });
await p.waitForTimeout(3500);
await p.evaluate(({ finder }) => {
  eval(finder);
  const deep2 = (root, pred, out = []) => { const st = [root]; let n = 0;
    while (st.length && n < 60000) { const el = st.pop(); n++; if (!el) continue;
      if (pred(el)) out.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
      for (const k of (el.children || [])) st.push(k); } return out; };
  for (const d of deep2(window.__panel, (el) => el.tagName === "DETAILS")) d.open = true;
}, { finder: deepFindPanel });
await p.waitForTimeout(1200);
await p.screenshot({ path: OUT + "battery-fleet.png" });
log("SHOT battery-fleet.png");

// object-report.png — the report opens as a popup page.
const popupPromise = ctx.waitForEvent("page", { timeout: 30000 });
await p.evaluate(({ finder, entryId }) => {
  eval(finder);
  window.__panel._printObjectReport(entryId);
}, { finder: deepFindPanel, entryId: hvac.entry_id });
const report = await popupPromise;
await report.waitForLoadState("load");
await report.setViewportSize({ width: 1000, height: 1250 });
await report.waitForTimeout(2500);
await report.screenshot({ path: OUT + "object-report.png" });
log("SHOT object-report.png");

await b.close();
log("DONE ALL OK");
