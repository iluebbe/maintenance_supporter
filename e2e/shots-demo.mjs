/** Fresh-HA demo seed + dark-mode documentation screenshots.
 *
 * Boots against the throwaway ha-shots instance (port 8131): onboards HA,
 * adds the integration, seeds a realistic English demo dataset (mixed
 * statuses, rich history with costs, priorities, labels, checklists,
 * warranties, calendar kinds, sensor triggers with 30 days of imported
 * statistics, two demo users with rotation, an uploaded PDF manual),
 * switches the theme to dark, and captures the full documentation
 * screenshot set (desktop + mobile) into docs/images/.
 *
 * Companion config: docker/.shots-config/configuration.yaml must define the
 * template sensors referenced below (hvac_airflow, pump_pressure,
 * pump_runtime, smoke_detector_*_battery, water_meter) and
 * input_boolean.pool_pump_power. Temporary tool — rerun any time the docs
 * imagery needs refreshing.
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
// The docker playwright-server browser can wedge silently (evaluate that
// never resolves) — a watchdog turns a silent hang into a loggable failure.
const watchdog = setTimeout(() => { log("WATCHDOG: run exceeded 20 minutes — aborting"); process.exit(3); }, 20 * 60e3);

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

// A tiny but structurally complete one-page PDF ("Owner's Manual") so the
// documents section has a real file entry with a plausible size.
function minimalPdf(title) {
  const content = `BT /F1 24 Tf 72 770 Td (${title}) Tj ET`;
  const objs = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];
  let body = "%PDF-1.4\n";
  const offsets = [];
  objs.forEach((o, i) => { offsets.push(body.length); body += `${i + 1} 0 obj ${o} endobj\n`; });
  const xref = body.length;
  body += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`
    + offsets.map((o) => String(o).padStart(10, "0") + " 00000 n \n").join("")
    + `trailer << /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  // Pad with comment lines so the file size reads like a real manual (~2.4 MB).
  return body + ("%" + "x".repeat(1023) + "\n").repeat(2400);
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
        { name: "Filter Replacement", type: "replacement", schedule_type: "sensor_based",
          warning_days: 14, last_performed: iso(-84),
          trigger_config: { type: "threshold", entity_id: "sensor.hvac_airflow", trigger_below: 60 },
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
          trigger_config: { type: "threshold", entity_id: "sensor.pump_pressure", trigger_above: 1.5 },
          history: history(7, 10, { cost: [0, 2], dur: [5, 8], lastDaysAgo: 3 }) },
        // Compound trigger demo: service when EITHER 200h runtime is reached
        // OR the filter pressure climbs past 1.5 bar.
        { name: "Pump Service", type: "service", schedule_type: "sensor_based",
          warning_days: 7, last_performed: iso(-120),
          trigger_config: { type: "compound", compound_logic: "OR", conditions: [
            { type: "runtime", entity_id: "sensor.pump_runtime", entity_ids: ["sensor.pump_runtime"], trigger_runtime_hours: 200 },
            { type: "threshold", entity_id: "sensor.pump_pressure", entity_ids: ["sensor.pump_pressure"], trigger_above: 1.5 },
          ] },
          history: history(180, 2, { cost: [60, 90], dur: [45, 60], lastDaysAgo: 120 }) },
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
      ],
    },
    {
      object: { name: "Utility Meters", manufacturer: "Stadtwerke", model: "Basement meter cabinet",
        notes: "Water + electricity readings go into the utility spreadsheet" },
      tasks: [
        // Reading task type + end-of-month scheduling (last business day).
        { name: "Water Meter Reading", type: "reading",
          schedule: { kind: "day_of_month", day: -1, business: true }, warning_days: 3,
          last_performed: iso(-28) },
        { name: "Electricity Meter Reading", type: "reading",
          schedule: { kind: "day_of_month", day: -1 }, warning_days: 3,
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
        // Multi-entity threshold demo: replace batteries when ANY detector
        // battery drops below 15 %.
        { name: "Battery Replacement", type: "replacement", schedule_type: "sensor_based",
          warning_days: 30, last_performed: iso(-340),
          trigger_config: { type: "threshold",
            entity_id: "sensor.smoke_detector_hall_battery",
            entity_ids: ["sensor.smoke_detector_hall_battery", "sensor.smoke_detector_kitchen_battery"],
            entity_logic: "any", trigger_below: 15 },
          history: history(365, 2, { cost: [18, 25], dur: [20, 25], lastDaysAgo: 340 }) },
      ],
    },
  ],
};

// Post-import patches: priority/labels/actions aren't part of the import
// whitelist — applied via task/update after import.
const PATCHES = [
  { object: "HVAC System", task: "Filter Replacement", set: { priority: "high", labels: ["air quality", "seasonal"],
    quick_complete_defaults: { notes: "Standard filter swap", cost: 24.9, duration: 15 } } },
  { object: "Smoke Detectors", task: "Test Buttons", set: { priority: "high", labels: ["safety"] } },
  { object: "Smoke Detectors", task: "Battery Replacement", set: { priority: "high", labels: ["safety"] } },
  { object: "Pool Pump", task: "Impeller Cleaning", set: { labels: ["summer"],
    on_complete_action: { service: "input_boolean.turn_on", target: { entity_id: "input_boolean.pool_pump_power" } } } },
  { object: "Espresso Machine", task: "Descaling", set: { labels: ["kitchen"] } },
  { object: "Family Car", task: "Oil Change", set: { priority: "high" } },
  { object: "Washing Machine", task: "Door Seal Wipe", set: { priority: "low" } },
];

// Node-side HA WebSocket client. The seed used to run as one giant in-page
// evaluate; the dockered playwright-server wedges on those often enough that
// the whole run died — plain WS from node has no browser in the loop.
async function wsClient(url, accessToken) {
  const ws = new WebSocket(url);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = () => rej(new Error("ws connect failed")); });
  let nextId = 1;
  const pending = new Map();
  await new Promise((res, rej) => {
    ws.onmessage = (ev) => {
      const m = JSON.parse(ev.data);
      if (m.type === "auth_required") ws.send(JSON.stringify({ type: "auth", access_token: accessToken }));
      else if (m.type === "auth_ok") res();
      else if (m.type === "auth_invalid") rej(new Error("ws auth invalid"));
      else if (m.type === "result") {
        const pr = pending.get(m.id);
        if (!pr) return;
        pending.delete(m.id);
        m.success ? pr.res(m.result) : pr.rej(new Error(m.error ? JSON.stringify(m.error) : "ws error"));
      }
    };
  });
  const send = (msg) => new Promise((res, rej) => {
    const id = nextId++;
    pending.set(id, { res, rej });
    ws.send(JSON.stringify({ ...msg, id }));
  });
  return { send, close: () => ws.close() };
}

// ── Main ─────────────────────────────────────────────────────────────────────

log("ONBOARD");
const token = await onboardOrLogin();
await ensureIntegration(token);
log("INTEGRATION READY");

// Seed via node-side WS (browser-free — see wsClient above).
const api = await wsClient("ws://localhost:8131/api/websocket", token);
// Retry-friendly: a wedged browser step aborts the run AFTER seeding — a
// rerun must not seed on top of the existing dataset.
const preSeeded = ((await api.send({ type: "maintenance_supporter/objects" })).objects || []).length > 0;
log(preSeeded ? "SEED SKIPPED — instance already seeded" : "SEED START");
const seed = preSeeded ? null : await (async () => {
  const importPayload = IMPORT, patches = PATCHES;
  const send = api.send;

  // Demo household members → user badges + rotation in the shots.
  const anna = await send({ type: "config/auth/create", name: "Anna", group_ids: ["system-users"] });
  const ben = await send({ type: "config/auth/create", name: "Ben", group_ids: ["system-users"] });
  const annaId = anna.user.id, benId = ben.user.id;

  // 30 days of hourly recorder statistics so trigger sparklines have a real
  // curve: airflow degrading 95% → ~54% (below the 60% threshold →
  // TRIGGERED), pump pressure oscillating 1.1–1.4 bar (ok), pump runtime
  // climbing 118h → 187h, detector batteries slowly draining 97% → ~78%.
  const hourMs = 3600e3;
  const nowH = Math.floor(Date.now() / hourMs) * hourMs;
  const series = { airflow: [], pressure: [], runtime: [], battHall: [], battKitchen: [] };
  for (let i = 30 * 24; i >= 1; i--) {
    const start = new Date(nowH - i * hourMs).toISOString();
    const tPos = 1 - i / (30 * 24); // 0 → 1 over the window
    const push = (arr, v, digits = 1) => {
      const r = Math.round(v * 10 ** digits) / 10 ** digits;
      arr.push({ start, mean: r, min: r, max: r });
    };
    push(series.airflow, 95 - 41 * tPos + 2.5 * Math.sin(i / 5));
    push(series.pressure, 1.15 + 0.22 * Math.sin(i / 9) + 0.08 * Math.sin(i / 3.1), 2);
    push(series.runtime, 118 + 69.5 * tPos);
    push(series.battHall, 97 - 19 * tPos, 0);
    push(series.battKitchen, 98 - 17 * tPos, 0);
  }
  const importStats = (statistic_id, unit, stats) => send({
    type: "recorder/import_statistics",
    metadata: { has_mean: true, has_sum: false, name: null, source: "recorder", statistic_id, unit_of_measurement: unit },
    stats,
  });
  await importStats("sensor.hvac_airflow", "%", series.airflow);
  await importStats("sensor.pump_pressure", "bar", series.pressure);
  await importStats("sensor.pump_runtime", "h", series.runtime);
  await importStats("sensor.smoke_detector_hall_battery", "%", series.battHall);
  await importStats("sensor.smoke_detector_kitchen_battery", "%", series.battKitchen);

  // Route user assignments through the patch list (ids only known now).
  patches.push(
    { object: "HVAC System", task: "Filter Replacement", set: { responsible_user_id: annaId } },
    { object: "Family Car", task: "Oil Change", set: { responsible_user_id: benId } },
    { object: "Smoke Detectors", task: "Test Buttons", set: { responsible_user_id: annaId } },
    { object: "Washing Machine", task: "Door Seal Wipe", set: {
      responsible_user_id: annaId, assignee_pool: [annaId, benId], rotation_strategy: "round_robin" } },
    { object: "Espresso Machine", task: "Descaling", set: { responsible_user_id: benId } },
  );

  const imp = await send({ type: "maintenance_supporter/json/import", json_content: JSON.stringify(importPayload) });
  // Dark theme for everyone.
  await send({ type: "call_service", domain: "frontend", service: "set_theme", service_data: { name: "default", mode: "dark" } });
  // Budget + features for richer screenshots.
  await send({ type: "maintenance_supporter/global/update", settings: {
    advanced_budget_visible: true, advanced_checklists_visible: true,
    advanced_completion_actions_visible: true,
    budget_monthly: 150.0, budget_yearly: 1500.0, budget_alerts_enabled: true,
    budget_currency: "EUR", panel_enabled: true,
  } });
  // Apply patches (priority / labels / users / actions).
  const objs = await send({ type: "maintenance_supporter/objects" });
  let patched = 0;
  for (const patch of patches) {
    const o = objs.objects.find((x) => x.object.name === patch.object);
    const t2 = o && o.tasks.find((x) => x.name === patch.task);
    if (!t2) continue;
    await send({ type: "maintenance_supporter/task/update", entry_id: o.entry_id, task_id: t2.id, ...patch.set });
    patched++;
  }
  const car = objs.objects.find((x) => x.object.name === "Family Car");
  const oil = car && car.tasks.find((x) => x.name === "Oil Change");

  // (v2.22) Showcase the new scheduling markings in the docs shots:
  //  - postpone a single occurrence → "postponed" indicator on the card row
  //  - a seasonal window on a recurring reading task → season month chips
  //    render selected in the schedule dialog (task-dialog-schedule.png)
  try {
    if (car && oil) {
      await send({ type: "maintenance_supporter/task/postpone", entry_id: car.entry_id, task_id: oil.id, until: iso(21) });
    }
    const um = objs.objects.find((x) => x.object.name === "Utility Meters");
    const wm = um && um.tasks.find((x) => x.name === "Water Meter Reading");
    if (um && wm) {
      const sched = wm.schedule && typeof wm.schedule === "object" ? wm.schedule : { kind: "interval", every: 30, unit: "days" };
      await send({ type: "maintenance_supporter/task/update", entry_id: um.entry_id, task_id: wm.id,
        schedule: { ...sched, season_months: [4, 5, 6, 7, 8, 9, 10] } });
    }
  } catch (e) { log("v2.22 marking seed skipped:", String(e && e.message || e)); }

  // (2.23) Spare parts on the Espresso Machine: a stocked descaler wired to
  // the descaling task, a water filter AT its threshold (the auto "Buy ..."
  // reminder shows up on the dashboard), and a catalog-only seal.
  try {
    const em = objs.objects.find((x) => x.object.name === "Espresso Machine");
    if (em) {
      const desc = await send({
        type: "maintenance_supporter/part/create", entry_id: em.entry_id,
        name: "Descaling tablets", vendor: "Jura", mpn: "62535",
        gtin: "7610917625352", storage_location: "Utility cabinet, box 2",
        unit: "pcs", cost: 8.9, stock: 6, reorder_threshold: 1,
        restock_quantity: 6, auto_buy_task: true,
      });
      await send({
        type: "maintenance_supporter/part/create", entry_id: em.entry_id,
        name: "Water filter cartridge", vendor: "Jura", mpn: "71794",
        storage_location: "Utility cabinet, box 2", unit: "pcs", cost: 15.5,
        stock: 1, reorder_threshold: 1, restock_quantity: 3, auto_buy_task: true,
      });
      await send({
        type: "maintenance_supporter/part/create", entry_id: em.entry_id,
        name: "Brew group seal", vendor: "Jura", mpn: "63308",
        product_url: "https://www.jura.com/en/customer-care",
      });
      const descTask = em.tasks.find((x) => x.name === "Descaling");
      if (descTask) {
        await send({
          type: "maintenance_supporter/task/update", entry_id: em.entry_id,
          task_id: descTask.id, name: descTask.name, task_type: descTask.type,
          consumes_parts: [{ part_id: desc.part_id, quantity: 1 }],
        });
      }
    }
  } catch (e) { log("parts seed skipped:", String(e && e.message || e)); }

  return { patched, objects: objs.objects.length, carEntry: car && car.entry_id, oilTaskId: oil && oil.id };
})();
log("SEED OK", JSON.stringify(seed));

// Documents: upload a PDF manual to the Family Car + add a web link, and
// link the manual to the Oil Change task (page 12).
if (seed) {
log("DOCUMENTS");
const fd = new FormData();
fd.append("entry_id", seed.carEntry);
fd.append("title", "Owner's Manual");
fd.append("tags", "manual");
fd.append("file", new Blob([minimalPdf("Skoda Octavia - Owner's Manual")], { type: "application/pdf" }), "octavia-owners-manual.pdf");
const up = await fetch(REST + "/api/maintenance_supporter/document/upload", {
  method: "POST", headers: { Authorization: "Bearer " + token }, body: fd,
}).then(j);
log("DOC UPLOADED", JSON.stringify(up).slice(0, 200));
{
  const docId = up.doc_id || (up.doc && up.doc.doc_id) || up.id;
  await api.send({ type: "maintenance_supporter/documents/add_link", entry_id: seed.carEntry,
    url: "https://www.skoda-auto.com/service/maintenance", title: "Service schedule (web)", tags: ["service"] });
  if (docId && seed.oilTaskId) {
    await api.send({ type: "maintenance_supporter/documents/update", doc_id: docId,
      task_ids: [seed.oilTaskId], task_pages: { [seed.oilTaskId]: 12 } });
  }
  api.close();
}
} else { api.close(); }

// Browser only from here on — everything above is REST/WS from node. The
// page never visits /lovelace (a fresh 2026.6 instance redirects it to the
// new /home dashboard, which wedged the dockered browser); every shot step
// navigates to its own URL.
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
log("PAGE OPEN");

await p.waitForTimeout(6000); // let the coordinator evaluate the new triggers

// ── Screenshots (desktop) ────────────────────────────────────────────────────
fs.mkdirSync(OUT, { recursive: true });
const deepFindPanel = `
  const deep = (pred) => { const st=[document.documentElement]; const o=[]; let n=0;
    while (st.length && n < 60000) { const el = st.pop(); n++; if (!el) continue;
      if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
      for (const k of (el.children || [])) st.push(k); } return o; };
  window.__panel = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-PANEL")[0];
`;

const failures = [];
async function step(name, fn) {
  log("STEP", name);
  try { await fn(); log("OK", name); }
  catch (e) { failures.push(name); log("FAIL", name, String(e && e.message || e).slice(0, 300)); }
}

async function openPanel(tab) {
  await p.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded" });
  // Poll until the panel component is actually mounted — the faketime dev
  // image boots/renders slower than the plain one; a fixed wait was flaky.
  let mounted = false;
  for (let i = 0; i < 30 && !mounted; i++) {
    await p.waitForTimeout(1000);
    mounted = await p.evaluate(({ finder }) => {
      eval(finder);
      return !!window.__panel && Array.isArray(window.__panel._objects) && window.__panel._objects.length > 0;
    }, { finder: deepFindPanel }).catch(() => false);
  }
  await p.waitForTimeout(1500);
  if (tab) {
    await p.evaluate(({ finder, t2 }) => {
      eval(finder);
      const panel = window.__panel;
      panel._setOverviewTab ? panel._setOverviewTab(t2) : (panel._overviewTab = t2);
    }, { finder: deepFindPanel, t2: tab });
    await p.waitForTimeout(1200);
  }
}

async function shot(name, page = p) {
  await page.screenshot({ path: OUT + name });
  log("SHOT", name);
}

// Open the task dialog in edit mode for a named task, optionally scrolling a
// section heading into view (matched by rendered text).
async function openTaskDialog(objName, taskName, scrollToText) {
  await p.evaluate(({ finder, objName, taskName, scrollToText }) => {
    eval(finder);
    const panel = window.__panel;
    const o = panel._objects.find((x) => x.object.name === objName);
    const t2 = o.tasks.find((x) => x.name === taskName);
    const dlg = panel.shadowRoot.querySelector("maintenance-task-dialog");
    dlg.openEdit(o.entry_id, t2);
    if (scrollToText) {
      // The action + quick-complete sections are collapsed <details> — open
      // the matching one and scroll its summary into view.
      setTimeout(() => {
        for (const sum of dlg.shadowRoot.querySelectorAll("details > summary")) {
          if (new RegExp(scrollToText, "i").test(sum.textContent || "")) {
            sum.parentElement.open = true;
            sum.scrollIntoView({ block: "start" });
          }
        }
      }, 900);
    }
  }, { finder: deepFindPanel, objName, taskName, scrollToText: scrollToText || null });
  await p.waitForTimeout(2000);
}

async function closeDialogs() {
  await p.keyboard.press("Escape");
  await p.waitForTimeout(500);
}

// 1. Dashboard overview — sparklines, user badges, priorities, Triggered KPI
await step("overview.png", async () => {
  await openPanel("dashboard");
  await p.waitForTimeout(2500); // mini-sparkline stats fetch
  await shot("overview.png");
});

// 2. Today view
await step("today-view.png", async () => {
  await openPanel("today");
  await shot("today-view.png");
});

// 3. Calendar tab (30-day window: real + projected events)
await step("calendar-tab.png", async () => {
  await openPanel("calendar");
  await p.waitForTimeout(1500);
  await shot("calendar-tab.png");
});

// 4. Object detail (Family Car — warranty chip + tasks + documents section)
await step("object-detail.png", async () => {
  await openPanel("dashboard");
  await p.evaluate(({ finder }) => {
    eval(finder);
    const panel = window.__panel;
    const car = panel._objects.find((o) => o.object.name === "Family Car");
    panel._showObject(car.entry_id);
  }, { finder: deepFindPanel });
  await p.waitForTimeout(2500);
  await shot("object-detail.png");
});

// 4b. Documents section (scrolled into view on the object detail page)
await step("documents-section.png", async () => {
  await p.evaluate(({ finder }) => {
    eval(finder);
    const root = window.__panel.shadowRoot;
    const docs = root.querySelector("maintenance-documents-section");
    if (docs) docs.scrollIntoView({ block: "start" });
  }, { finder: deepFindPanel });
  await p.waitForTimeout(800);
  await shot("documents-section.png");
});

// Spare parts section on the object detail (2.23) — the Espresso Machine's
// shelf: stocked descaler, LOW water filter, catalog-only seal.
await step("parts-section.png", async () => {
  await openPanel("dashboard");
  await p.evaluate(({ finder }) => {
    eval(finder);
    const panel = window.__panel;
    const o = panel._objects.find((x) => x.object.name === "Espresso Machine");
    panel._showObject(o.entry_id);
  }, { finder: deepFindPanel });
  await p.waitForTimeout(1500);
  await p.evaluate(({ finder }) => {
    eval(finder);
    const root = window.__panel.shadowRoot;
    const parts = root.querySelector("maintenance-parts-section");
    if (parts) parts.scrollIntoView({ block: "center" });
  }, { finder: deepFindPanel });
  await p.waitForTimeout(800);
  await shot("parts-section.png");
});

// The auto-created "Buy ..." reminder's complete dialog with the editable
// "Quantity bought" field (2.23).
await step("parts-buy-dialog.png", async () => {
  await openPanel("dashboard");
  await p.evaluate(({ finder }) => {
    eval(finder);
    const panel = window.__panel;
    const o = panel._objects.find((x) => x.object.name === "Espresso Machine");
    const buy = o.tasks.find((x) => x.part_ref);
    panel._openCompleteDialog(o.entry_id, buy.id, buy.name, buy.checklist, false);
  }, { finder: deepFindPanel });
  await p.waitForTimeout(1500);
  await shot("parts-buy-dialog.png");
  await closeDialogs();
});

// 5. Task detail (HVAC Filter Replacement — TRIGGERED, sparkline, checklist)
await step("task-detail.png", async () => {
  await openPanel("dashboard");
  await p.evaluate(({ finder }) => {
    eval(finder);
    const panel = window.__panel;
    const o = panel._objects.find((x) => x.object.name === "HVAC System");
    const t2 = o.tasks.find((x) => x.name === "Filter Replacement");
    panel._showTask(o.entry_id, t2.id);
  }, { finder: deepFindPanel });
  await p.waitForTimeout(3000);
  await shot("task-detail.png");
});

// 6. Task history tab (Espresso Descaling — rich cost history + chart)
await step("task-history.png", async () => {
  await p.evaluate(({ finder }) => {
    eval(finder);
    const panel = window.__panel;
    const o = panel._objects.find((x) => x.object.name === "Espresso Machine");
    const t2 = o.tasks.find((x) => x.name === "Descaling");
    panel._showTask(o.entry_id, t2.id);
  }, { finder: deepFindPanel });
  await p.waitForTimeout(2000);
  await p.evaluate(({ finder }) => { eval(finder); window.__panel._activeTab = "history"; }, { finder: deepFindPanel });
  await p.waitForTimeout(1500);
  await shot("task-history.png");
});

// 7. Complete dialog (HVAC Filter Replacement — checklist + notes/cost/photo)
await step("complete-dialog.png", async () => {
  await openPanel("dashboard");
  await p.evaluate(({ finder }) => {
    eval(finder);
    const panel = window.__panel;
    const o = panel._objects.find((x) => x.object.name === "HVAC System");
    const t2 = o.tasks.find((x) => x.name === "Filter Replacement");
    panel._openCompleteDialog(o.entry_id, t2.id, t2.name, t2.checklist, false);
  }, { finder: deepFindPanel });
  await p.waitForTimeout(1500);
  await shot("complete-dialog.png");
  await closeDialogs();
});

// 8. Objects table (warranty chips green/amber/red, sortable columns)
await step("objects-table.png", async () => {
  await p.evaluate(({ finder }) => {
    eval(finder);
    const panel = window.__panel;
    panel._view = "all_objects";
    panel._objectViewMode = "table";
  }, { finder: deepFindPanel });
  await p.waitForTimeout(1500);
  await shot("objects-table.png");
});

// 9. Settings tab (features, notifications, budget)
await step("settings-view.png", async () => {
  await openPanel("settings");
  await p.waitForTimeout(2000);
  await shot("settings-view.png");
});

// 10. Task dialog — Reading type + end-of-month schedule (last business day)
await step("task-dialog-schedule.png", async () => {
  await openPanel("dashboard");
  await openTaskDialog("Utility Meters", "Water Meter Reading");
  await shot("task-dialog-schedule.png");
  await closeDialogs();
});

// 11. Multi-entity trigger (Smoke Detectors battery — ANY-of-two threshold)
await step("multi-entity-trigger.png", async () => {
  await openTaskDialog("Smoke Detectors", "Battery Replacement", "trigger");
  await shot("multi-entity-trigger.png");
  await closeDialogs();
});

// 12. Compound trigger (Pump Service — runtime OR pressure)
await step("compound-trigger.png", async () => {
  await openTaskDialog("Pool Pump", "Pump Service", "trigger");
  await shot("compound-trigger.png");
  await closeDialogs();
});

// 13. Completion action editor (Impeller Cleaning — turn pump back on)
await step("task-dialog-action.png", async () => {
  await openTaskDialog("Pool Pump", "Impeller Cleaning", "on complete");
  await shot("task-dialog-action.png");
  await closeDialogs();
});

// 14. Quick-complete defaults (Filter Replacement)
await step("task-dialog-quick-complete.png", async () => {
  await openTaskDialog("HVAC System", "Filter Replacement", "quick-complete");
  await shot("task-dialog-quick-complete.png");
  await closeDialogs();
});

// 15. QR dialog (Family Car Oil Change)
await step("qr-dialog.png", async () => {
  await p.evaluate(({ finder }) => {
    eval(finder);
    const panel = window.__panel;
    const o = panel._objects.find((x) => x.object.name === "Family Car");
    const t2 = o.tasks.find((x) => x.name === "Oil Change");
    panel._openQrForTask(o.entry_id, t2.id, "Family Car", t2.name);
  }, { finder: deepFindPanel });
  await p.waitForTimeout(2000);
  await shot("qr-dialog.png");
  await closeDialogs();
});

// 16. Entity attributes — Developer tools -> States with a task sensor
// selected (HA 2026.6's more-info dialog no longer shows an attributes panel).
await step("entity-attributes.png", async () => {
  await p.goto(HA + "/developer-tools/state", { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(6000);
  await p.evaluate(() => {
    const deep = (pred) => { const st = [document.documentElement]; const o = []; let n = 0;
      while (st.length && n < 200000) { const el = st.pop(); n++; if (!el) continue;
        if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
        for (const k of (el.children || [])) st.push(k); } return o; };
    const hass = document.querySelector("home-assistant").hass;
    const id = Object.keys(hass.states).find((k) => k.startsWith("sensor.") && k.includes("oil_change"));
    const devState = deep((el) => el.tagName === "DEVELOPER-TOOLS-STATE")[0];
    devState._entityIdChanged({ detail: { value: id } });
  });
  await p.waitForTimeout(2500);
  await shot("entity-attributes.png");
});

// 17. Lovelace card — a dedicated storage-mode dashboard (saving the default
// config has no effect: HA 2026 renders its auto home dashboard on /lovelace).
await step("lovelace-card.png", async () => {
  await p.evaluate(async () => {
    const hass = document.querySelector("home-assistant").hass;
    const send = (m) => hass.connection.sendMessagePromise(m);
    const dashboards = await send({ type: "lovelace/dashboards/list" });
    if (!dashboards.some((d) => d.url_path === "demo-cards")) {
      await send({ type: "lovelace/dashboards/create", url_path: "demo-cards", title: "Demo",
        require_admin: false, show_in_sidebar: true, mode: "storage" });
    }
    await send({ type: "lovelace/config/save", url_path: "demo-cards",
      config: { views: [{ title: "Cards", path: "cards", cards: [
        { type: "custom:maintenance-supporter-card", show_header: true, show_actions: true,
          filter_status: ["overdue", "triggered", "due_soon"], max_items: 8 },
      ] }] } });
  });
  await p.goto(HA + "/demo-cards", { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(8000);
  // Clip to the card so the shot isn't a mostly-empty dashboard.
  const rect = await p.evaluate(() => {
    const deep = (pred) => { const st = [document.documentElement]; const o = []; let n = 0;
      while (st.length && n < 80000) { const el = st.pop(); n++; if (!el) continue;
        if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
        for (const k of (el.children || [])) st.push(k); } return o; };
    const card = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-CARD")[0];
    if (!card) return null;
    const r = card.getBoundingClientRect();
    return { x: Math.max(0, r.x - 16), y: Math.max(0, r.y - 16), width: Math.min(r.width + 32, 1600), height: Math.min(r.height + 32, 1000) };
  });
  if (!rect || rect.width < 100) throw new Error("card not rendered");
  await p.screenshot({ path: OUT + "lovelace-card.png", clip: rect });
  log("SHOT lovelace-card.png (clipped)");
});

// 18. HA-native calendar entity (month view)
await step("calendar.png", async () => {
  await p.goto(HA + "/calendar", { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(6000);
  await shot("calendar.png");
});

// 19. Native To-do list entity
await step("todo-list.png", async () => {
  await p.goto(HA + "/todo", { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(6000);
  await shot("todo-list.png");
});

// 20. Config flow (integration options via Settings → Integrations)
await step("config-flow.png", async () => {
  await p.goto(HA + "/config/integrations/integration/maintenance_supporter", { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(5000);
  const clicked = await p.evaluate(() => {
    const deep = (pred) => { const st = [document.documentElement]; const o = []; let n = 0;
      while (st.length && n < 80000) { const el = st.pop(); n++; if (!el) continue;
        if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
        for (const k of (el.children || [])) st.push(k); } return o; };
    // The global settings entry (unique per install) carries the gear-icon
    // configure button; object entries do too — the first is fine.
    const label = (el) => (el.getAttribute && (el.getAttribute("aria-label") || el.getAttribute("label") || el.title) || "") + " " + (el.textContent || "");
    const cand = deep((el) => ["HA-BUTTON", "MWC-BUTTON", "HA-ICON-BUTTON"].includes(el.tagName) && /configur|options/i.test(label(el)));
    if (cand[0]) { cand[0].click(); return true; }
    return false;
  });
  if (!clicked) throw new Error("no configure button found");
  await p.waitForTimeout(3500);
  await shot("config-flow.png");
  await closeDialogs();
});

// ── Mobile shots ────────────────────────────────────────────────────────────
// NOTE: creating a second context on a long-lived playwright-server can wedge
// silently (observed 2026-07-05). If mobile steps hang, restart the
// playwright-server container and run e2e/shots-fix.mjs, which shoots mobile
// first on a fresh connection.
const mctx = await b.newContext({ viewport: { width: 400, height: 860 }, colorScheme: "dark", isMobile: true, hasTouch: true });
await mctx.addInitScript(({ t, ha }) => {
  localStorage.setItem("hassTokens", JSON.stringify({
    access_token: t, token_type: "Bearer", expires_in: 1800,
    hassUrl: ha, clientId: ha + "/", expires: Date.now() + 9e11, refresh_token: "",
  }));
  localStorage.setItem("msp-overview-tab", "today");
}, { t: token, ha: HA });
const mp = await mctx.newPage();

await step("mobile-overview.png", async () => {
  await mp.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded" });
  await mp.waitForTimeout(6000);
  await shot("mobile-overview.png", mp);
});

await step("mobile-task.png", async () => {
  await mp.evaluate(({ finder }) => {
    eval(finder);
    const panel = window.__panel;
    const o = panel._objects.find((x) => x.object.name === "HVAC System");
    const t2 = o.tasks.find((x) => x.name === "Filter Replacement");
    panel._showTask(o.entry_id, t2.id);
  }, { finder: deepFindPanel });
  await mp.waitForTimeout(3000);
  await shot("mobile-task.png", mp);
});

log(failures.length ? "DONE WITH FAILURES: " + failures.join(", ") : "DONE ALL OK");
clearTimeout(watchdog);
await b.close();
process.exit(failures.length ? 1 : 0);
