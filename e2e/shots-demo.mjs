/** Fresh-HA demo seed + dark-mode documentation screenshots.
 *
 * Boots against the throwaway ha-shots instance (port 8131): onboards HA,
 * adds the integration, seeds a realistic demo dataset (mixed statuses, rich
 * history with costs, priorities, labels, checklists, warranties, calendar
 * kinds), switches the theme to dark, and captures the documentation
 * screenshots (desktop + mobile) into docs/images/. Temporary tool — rerun
 * any time the docs imagery needs refreshing.
 */
import { chromium } from "@playwright/test";
import fs from "fs";

const REST = "http://localhost:8131";           // host-side REST
const HA = "http://ha-shots:8123";              // browser-side (docker net)
const PW_WS = "ws://127.0.0.1:3000/";
const CID = REST + "/";
const USER = "demo", PASS = "demo-pass-1";
const OUT = new URL("../docs/images/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

const LOG = new URL("./shots-demo.log", import.meta.url);
fs.writeFileSync(LOG, "");
const log = (...a) => { const line = a.map((x) => typeof x === "string" ? x : JSON.stringify(x)).join(" "); fs.appendFileSync(LOG, line + String.fromCharCode(10)); console.log(line); };
process.on("unhandledRejection", (e) => { log("UNHANDLED", String(e && e.stack || e)); process.exit(2); });

const j = (r) => r.json();
const iso = (offsetDays) => { const d = new Date(Date.now() + offsetDays * 864e5); return d.toISOString().slice(0, 10); };
const ts = (offsetDays) => new Date(Date.now() + offsetDays * 864e5).toISOString();

async function exchange(code) {
  const t = await fetch(REST + "/auth/token", {
    method: "POST",
    body: new URLSearchParams({ grant_type: "authorization_code", code, client_id: CID }),
  }).then(j);
  if (!t.access_token) throw new Error("token exchange failed " + JSON.stringify(t));
  return t.access_token;
}

async function onboardOrLogin() {
  const status = await fetch(REST + "/api/onboarding").then(j).catch(() => null);
  const done = Array.isArray(status) && status.every((x) => x.done);
  if (done) {
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
  const u = await fetch(REST + "/api/onboarding/users", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: CID, name: "Demo", username: USER, password: PASS, language: "en" }),
  }).then(j);
  const token = await exchange(u.auth_code);
  const auth = { Authorization: "Bearer " + token, "Content-Type": "application/json" };
  for (const [step, body] of [["core_config", {}], ["analytics", {}],
    ["integration", { client_id: CID, redirect_uri: CID + "?auth_callback=1" }]]) {
    const r = await fetch(REST + "/api/onboarding/" + step, { method: "POST", headers: auth, body: JSON.stringify(body) });
    if (!r.ok) throw new Error(`onboarding/${step} -> ${r.status}`);
  }
  return token;
}

async function ensureIntegration(token) {
  const auth = { Authorization: "Bearer " + token, "Content-Type": "application/json" };
  const entries = await fetch(REST + "/api/config/config_entries/entry", { headers: auth }).then(j).catch(() => []);
  if (Array.isArray(entries) && entries.some((e) => e.domain === "maintenance_supporter")) return;
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
  if (res.type !== "create_entry") throw new Error("integration flow failed " + JSON.stringify(res));
  await new Promise((r) => setTimeout(r, 5000));
}

// ── Demo dataset ─────────────────────────────────────────────────────────────

function history(everyDays, count, { cost = [25, 60], dur = [15, 45], lastDaysAgo }) {
  const out = [];
  for (let i = count - 1; i >= 0; i--) {
    const daysAgo = lastDaysAgo + i * everyDays + ((i * 7) % 5) - 2; // slight jitter
    out.push({
      timestamp: ts(-daysAgo),
      type: "completed",
      cost: Math.round((cost[0] + ((i * 37) % (cost[1] - cost[0]))) * 100) / 100,
      duration: dur[0] + ((i * 13) % (dur[1] - dur[0])),
      notes: i === 0 ? "Replaced with OEM part" : "",
    });
  }
  return out;
}

const IMPORT = {
  objects: [
    {
      object: { name: "HVAC System", manufacturer: "Daikin", model: "Altherma 3", area_id: null,
        installation_date: iso(-900), warranty_expiry: iso(500), notes: "Filter size: 500x300mm, MERV 13" },
      tasks: [
        { name: "Filter Replacement", type: "replacement", schedule_type: "time_based", interval_days: 90,
          warning_days: 14, last_performed: iso(-84),
          checklist: ["Turn off the unit", "Vacuum the filter compartment", "Insert new filter (airflow arrow up)", "Reset the filter counter"],
          history: history(90, 6, { cost: [18, 30], dur: [10, 20], lastDaysAgo: 84 }) },
        { name: "Duct Inspection", type: "inspection", schedule_type: "time_based", interval_days: 365,
          warning_days: 30, last_performed: iso(-300),
          history: history(365, 2, { cost: [120, 180], dur: [60, 90], lastDaysAgo: 300 }) },
      ],
    },
    {
      object: { name: "Family Car", manufacturer: "Skoda", model: "Octavia Combi",
        installation_date: iso(-1400), warranty_expiry: iso(210), notes: "Plate: HH-MS 2170" },
      tasks: [
        { name: "Oil Change", type: "service", schedule_type: "time_based", interval_days: 365,
          warning_days: 21, last_performed: iso(-352),
          history: history(365, 4, { cost: [95, 140], dur: [45, 60], lastDaysAgo: 352 }) },
        { name: "Tire Rotation", type: "service", schedule_type: "time_based", interval_days: 180,
          warning_days: 14, last_performed: iso(-40),
          history: history(180, 4, { cost: [25, 40], dur: [30, 40], lastDaysAgo: 40 }) },
        { name: "Annual Inspection (TUV)", type: "inspection", schedule_type: "one_time", due_date: iso(18), warning_days: 21 },
      ],
    },
    {
      object: { name: "Pool Pump", manufacturer: "Speck", model: "BADU 90",
        installation_date: iso(-700), notes: "Impeller spare in garage shelf B3" },
      tasks: [
        { name: "Impeller Cleaning", type: "cleaning", schedule_type: "time_based", interval_days: 30,
          warning_days: 7, last_performed: iso(-44),
          history: history(30, 8, { cost: [0, 5], dur: [15, 25], lastDaysAgo: 44 }) },
        { name: "Pressure Check", type: "inspection", schedule_type: "time_based", interval_days: 7,
          warning_days: 2, last_performed: iso(-3),
          history: history(7, 10, { cost: [0, 2], dur: [5, 8], lastDaysAgo: 3 }) },
      ],
    },
    {
      object: { name: "Washing Machine", manufacturer: "Miele", model: "WWD 320",
        installation_date: iso(-400), warranty_expiry: iso(26) },
      tasks: [
        { name: "Descaling", type: "cleaning", schedule_type: "time_based", interval_days: 90,
          warning_days: 10, last_performed: iso(-86),
          history: history(90, 4, { cost: [6, 9], dur: [10, 15], lastDaysAgo: 86 }) },
        { name: "Door Seal Wipe", type: "cleaning", schedule_type: "time_based", interval_days: 14,
          warning_days: 3, last_performed: iso(-5),
          history: history(14, 6, { cost: [0, 1], dur: [3, 5], lastDaysAgo: 5 }) },
      ],
    },
    {
      object: { name: "Espresso Machine", manufacturer: "ECM", model: "Synchronika",
        installation_date: iso(-600), warranty_expiry: iso(-40), notes: "Use only descaler approved for E61 groups" },
      tasks: [
        { name: "Descaling", type: "cleaning", schedule_type: "time_based", interval_days: 60,
          warning_days: 7, last_performed: iso(-71),
          history: history(60, 9, { cost: [7, 11], dur: [25, 35], lastDaysAgo: 71 }) },
        { name: "Backflush", type: "cleaning", schedule_type: "time_based", interval_days: 7,
          warning_days: 2, last_performed: iso(-4),
          history: history(7, 12, { cost: [0, 2], dur: [5, 10], lastDaysAgo: 4 }) },
        { name: "Water Meter Reading", type: "reading",
          schedule: { kind: "day_of_month", day: -1, business: true }, warning_days: 3,
          last_performed: iso(-28) },
      ],
    },
    {
      object: { name: "Smoke Detectors", manufacturer: "Ei Electronics", model: "Ei650 x6" },
      tasks: [
        { name: "Test Buttons", type: "inspection",
          schedule: { kind: "nth_weekday", nth: 1, weekday: 5 }, warning_days: 2,
          last_performed: iso(-26),
          history: history(30, 5, { cost: [0, 1], dur: [10, 12], lastDaysAgo: 26 }) },
        { name: "Battery Replacement", type: "replacement", schedule_type: "time_based",
          interval_days: 365, interval_unit: "days", warning_days: 30, last_performed: iso(-340),
          history: history(365, 2, { cost: [18, 25], dur: [20, 25], lastDaysAgo: 340 }) },
      ],
    },
  ],
};

// Post-import patches: priority/labels aren't part of the import whitelist.
const PATCHES = [
  { object: "HVAC System", task: "Filter Replacement", set: { priority: "high", labels: ["air quality", "seasonal"] } },
  { object: "Smoke Detectors", task: "Test Buttons", set: { priority: "high", labels: ["safety"] } },
  { object: "Smoke Detectors", task: "Battery Replacement", set: { priority: "high", labels: ["safety"] } },
  { object: "Pool Pump", task: "Impeller Cleaning", set: { labels: ["summer"] } },
  { object: "Espresso Machine", task: "Descaling", set: { labels: ["kitchen"] } },
  { object: "Family Car", task: "Oil Change", set: { priority: "high" } },
  { object: "Washing Machine", task: "Door Seal Wipe", set: { priority: "low" } },
];

// ── Main ─────────────────────────────────────────────────────────────────────

log("ONBOARD");
const token = await onboardOrLogin();
await ensureIntegration(token);
log("INTEGRATION READY");

const b = await chromium.connect(PW_WS, { timeout: 20000 });
const ctx = await b.newContext({ viewport: { width: 1600, height: 1000 }, colorScheme: "dark" });
await ctx.addInitScript(({ t, ha }) => {
  localStorage.setItem("hassTokens", JSON.stringify({
    access_token: t, token_type: "Bearer", expires_in: 1800,
    hassUrl: ha, clientId: ha + "/", expires: Date.now() + 9e11, refresh_token: "",
  }));
  localStorage.setItem("msp-overview-tab", "dashboard");
}, { t: token, ha: HA });
const p = await ctx.newPage();
await p.goto(HA + "/lovelace", { waitUntil: "domcontentloaded" });
await p.waitForTimeout(6000);

// Seed via WS from inside the page.
const seed = await p.evaluate(async ({ importPayload, patches }) => {
  const hass = document.querySelector("home-assistant").hass;
  const send = (m) => hass.connection.sendMessagePromise(m);
  const imp = await send({ type: "maintenance_supporter/json/import", json_content: JSON.stringify(importPayload) });
  // Dark theme for everyone.
  await hass.callService("frontend", "set_theme", { name: "default", mode: "dark" });
  // Budget + features for richer screenshots.
  await send({ type: "maintenance_supporter/global/update", settings: {
    advanced_budget_visible: true, advanced_checklists_visible: true,
    budget_monthly: 150.0, budget_yearly: 1500.0, budget_alerts_enabled: true,
    budget_currency: "EUR", panel_enabled: true,
  } });
  // Apply priority/label patches.
  const objs = await send({ type: "maintenance_supporter/objects" });
  let patched = 0;
  for (const patch of patches) {
    const o = objs.objects.find((x) => x.object.name === patch.object);
    const t2 = o && o.tasks.find((x) => x.name === patch.task);
    if (!t2) continue;
    await send({ type: "maintenance_supporter/task/update", entry_id: o.entry_id, task_id: t2.id, ...patch.set });
    patched++;
  }
  return { import: imp, patched, objects: objs.objects.length };
}, { importPayload: IMPORT, patches: PATCHES });
log("SEED", JSON.stringify(seed).slice(0, 300));

await p.waitForTimeout(2500);

// ── Screenshots (desktop) ────────────────────────────────────────────────────
fs.mkdirSync(OUT, { recursive: true });
const deepFindPanel = `
  const deep = (pred) => { const st=[document.documentElement]; const o=[]; let n=0;
    while (st.length && n < 60000) { const el = st.pop(); n++; if (!el) continue;
      if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
      for (const k of (el.children || [])) st.push(k); } return o; };
  window.__panel = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-PANEL")[0];
`;

async function openPanel(tab) {
  await p.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(5000);
  if (tab) {
    await p.evaluate(({ finder, t2 }) => {
      eval(finder);
      const panel = window.__panel;
      panel._setOverviewTab ? panel._setOverviewTab(t2) : (panel._overviewTab = t2);
    }, { finder: deepFindPanel, t2: tab });
    await p.waitForTimeout(1200);
  }
}

async function shot(name) {
  await p.screenshot({ path: OUT + name });
  log("SHOT", name);
}

// 1. Dashboard overview
await openPanel("dashboard");
await shot("overview.png");

// 2. Today view
await openPanel("today");
await shot("today-view.png");

// 3. Calendar tab
await openPanel("calendar");
await p.waitForTimeout(1500);
await shot("calendar-tab.png");

// 4. Object detail (Family Car — warranty chip + tasks + docs section)
await openPanel("dashboard");
const nav = await p.evaluate(({ finder }) => {
  eval(finder);
  const panel = window.__panel;
  const car = panel._objects.find((o) => o.object.name === "Family Car");
  panel._showObject(car.entry_id);
  return car.entry_id;
}, { finder: deepFindPanel });
await p.waitForTimeout(2000);
await shot("object-detail.png");

// 5. Task detail (Espresso Descaling — rich history → KPI + chart)
await p.evaluate(({ finder }) => {
  eval(finder);
  const panel = window.__panel;
  const o = panel._objects.find((x) => x.object.name === "Espresso Machine");
  const t2 = o.tasks.find((x) => x.name === "Descaling");
  panel._showTask(o.entry_id, t2.id);
}, { finder: deepFindPanel });
await p.waitForTimeout(2500);
await shot("task-detail.png");

// 6. Task history tab
await p.evaluate(({ finder }) => { eval(finder); window.__panel._activeTab = "history"; }, { finder: deepFindPanel });
await p.waitForTimeout(1200);
await shot("task-history.png");

// 7. Complete dialog (HVAC Filter Replacement — checklist + photo picker)
await openPanel("dashboard");
await p.evaluate(({ finder }) => {
  eval(finder);
  const panel = window.__panel;
  const o = panel._objects.find((x) => x.object.name === "HVAC System");
  const t2 = o.tasks.find((x) => x.name === "Filter Replacement");
  panel._openCompleteDialog(o.entry_id, t2.id, t2.name, t2.checklist, false);
}, { finder: deepFindPanel });
await p.waitForTimeout(1200);
await shot("complete-dialog.png");
await p.keyboard.press("Escape");

// 8. Objects table view
await p.evaluate(({ finder }) => {
  eval(finder);
  const panel = window.__panel;
  panel._view = "all_objects";
  panel._objectViewMode = "table";
}, { finder: deepFindPanel });
await p.waitForTimeout(1500);
await shot("objects-table.png");

// ── Mobile shots ────────────────────────────────────────────────────────────
const mctx = await b.newContext({ viewport: { width: 400, height: 860 }, colorScheme: "dark", isMobile: true, hasTouch: true });
await mctx.addInitScript(({ t, ha }) => {
  localStorage.setItem("hassTokens", JSON.stringify({
    access_token: t, token_type: "Bearer", expires_in: 1800,
    hassUrl: ha, clientId: ha + "/", expires: Date.now() + 9e11, refresh_token: "",
  }));
  localStorage.setItem("msp-overview-tab", "today");
}, { t: token, ha: HA });
const mp = await mctx.newPage();
await mp.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded" });
await mp.waitForTimeout(6000);
await mp.screenshot({ path: OUT + "mobile-overview.png" });
log("SHOT mobile-overview.png");

await mp.evaluate(({ finder }) => {
  eval(finder);
  const panel = window.__panel;
  const o = panel._objects.find((x) => x.object.name === "Pool Pump");
  const t2 = o.tasks.find((x) => x.name === "Impeller Cleaning");
  panel._showTask(o.entry_id, t2.id);
}, { finder: deepFindPanel });
await mp.waitForTimeout(2500);
await mp.screenshot({ path: OUT + "mobile-task.png" });
log("SHOT mobile-task.png");

log("DONE");
await b.close();
