/** Live check of every sensor trigger kind on a real HA (ha-maint): each task
 *  watches its own REST-state sensor, the check drives the sensor across the
 *  limit and back and asserts the task's status, trigger flag and history,
 *  and that the overdue binary sensor, the to-do list, the calendar and the
 *  summary sensor agree.
 *
 *  Kinds: threshold above / below (auto-complete on recovery) / equal /
 *  not equal / held for a minute, counter absolute / delta (re-baselines on
 *  completion), state change (2 transitions), runtime, due date, compound
 *  AND / OR, several entities with "all".
 *
 *  While everything is triggered it shoots the dashboard, the object page, a
 *  task page per kind and the card at 1600 px and 400 px into
 *  %TEMP%/trigger-shots/ for an alignment review, and runs
 *  a geometry probe: the status pills of a column start at one x, the due
 *  texts end at one x, no row content spills out of its row.
 *
 *  node e2e/live-trigger-types-check.mjs
 */
import { mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium } from "@playwright/test";
import { DEEP_SRC, hassTokensInit, loadToken, watchdog, wsClient } from "./ws-client.mjs";

const REST = process.env.HA_REST || "http://127.0.0.1:8125";
const HA = process.env.HA_BROWSER || "http://ha-maint:8123";
const PW_WS = "ws://127.0.0.1:3000/";
const OUT = join(tmpdir(), "trigger-shots") + "/";
mkdirSync(OUT, { recursive: true });
watchdog(20 * 60e3, "trigger types check");

const log = (...a) => console.log(...a);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const findings = [];
const expect = (cond, msg) => { if (cond) log(`  ok: ${msg}`); else { findings.push(msg); log(`  FINDING: ${msg}`); } };
const token = loadToken();
const H = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
const api = await wsClient(REST, token);
const send = (m) => api.send(m);
const stamp = Date.now() % 100000;
const S = (name) => `sensor.tl${stamp}_${name}`;
const BIN = (name) => `binary_sensor.tl${stamp}_${name}`;
const SW = `switch.tl${stamp}_pump`;
const setState = (id, state, attrs = {}) => fetch(`${REST}/api/states/${id}`, { method: "POST", headers: H, body: JSON.stringify({ state: String(state), attributes: attrs }) });
const iso = (d) => d.toISOString();

let entry = null, dash = null, browser = null;
const T = {};
const used = new Set();
const set = async (id, v, attrs) => { used.add(id); await setState(id, v, attrs); };

async function objectTasks() {
  const o = (await send({ type: "maintenance_supporter/objects" })).objects.find((x) => x.entry_id === entry);
  return Object.fromEntries((o?.tasks || []).map((t) => [Object.keys(T).find((k) => T[k] === t.id), t]));
}
async function waitFor(key, pred, label, ms = 15000) {
  const t0 = Date.now();
  let t;
  while (Date.now() - t0 < ms) {
    t = (await objectTasks())[key];
    if (t && pred(t)) { expect(true, `${key}: ${label} (${((Date.now() - t0) / 1000).toFixed(1)} s)`); return t; }
    await sleep(700);
  }
  expect(false, `${key}: ${label} — got status ${t?.status}, trigger_active ${t?.trigger_active}, value ${t?.trigger_current_value}`);
  return t;
}
const triggered = (t) => t.status === "triggered" && t.trigger_active;
const calm = (t) => t.status !== "triggered" && !t.trigger_active;

try {
  // ── sensors at rest ──
  await set(S("temp"), 20, { unit_of_measurement: "°C" });
  await set(S("level"), 50, { unit_of_measurement: "%" });
  await set(S("code"), 0, {});
  await set(S("mode"), 0, {});
  await set(S("held"), 20, { unit_of_measurement: "°C" });
  await set(S("cycles"), 10, { unit_of_measurement: "cycles", state_class: "total_increasing" });
  await set(S("odo"), 1000, { unit_of_measurement: "km", state_class: "total_increasing" });
  await set(BIN("door"), "off", { device_class: "door" });
  await set(SW, "off", {});
  await set(S("due"), iso(new Date(Date.now() + 20 * 86400e3)), { device_class: "timestamp" });
  await set(S("t2"), 20, { unit_of_measurement: "°C" });
  await set(BIN("window"), "off", { device_class: "window" });
  await set(S("a1"), 20, { unit_of_measurement: "°C" });
  await set(S("a2"), 20, { unit_of_measurement: "°C" });

  entry = (await send({ type: "maintenance_supporter/object/create", name: `Trigger Lab ${stamp}` })).entry_id;
  const mk = async (key, name, tc) => {
    T[key] = (await send({ type: "maintenance_supporter/task/create", entry_id: entry, name, schedule_type: "sensor_based", trigger_config: tc })).task_id;
  };
  const one = (id) => ({ entity_id: id, entity_ids: [id] });
  await mk("above", "Above 30 °C", { type: "threshold", ...one(S("temp")), trigger_above: 30 });
  await mk("below", "Below 10 % (auto)", { type: "threshold", ...one(S("level")), trigger_below: 10, auto_complete_on_recovery: true });
  await mk("equals", "Equals 360", { type: "threshold", ...one(S("code")), trigger_equals: 360 });
  await mk("notequals", "Not 0", { type: "threshold", ...one(S("mode")), trigger_not_equals: 0 });
  await mk("held", "Above 30 °C for 1 min", { type: "threshold", ...one(S("held")), trigger_above: 30, trigger_for_minutes: 1 });
  await mk("counter", "100 cycles", { type: "counter", ...one(S("cycles")), trigger_target_value: 100 });
  await mk("delta", "Every 500 km", { type: "counter", ...one(S("odo")), trigger_target_value: 500, trigger_delta_mode: true, trigger_baseline_value: 1000 });
  await mk("state", "Door opened twice", { type: "state_change", ...one(BIN("door")), trigger_to_state: "on", trigger_target_changes: 2 });
  await mk("runtime", "Pump 36 s", { type: "runtime", ...one(SW), trigger_runtime_hours: 0.01, trigger_on_states: ["on"] });
  await mk("due", "Due date in 3 days", { type: "due_date", ...one(S("due")), trigger_days_before: 3 });
  await mk("and", "Warm AND window open", { type: "compound", compound_logic: "AND", conditions: [
    { type: "threshold", ...one(S("t2")), trigger_above: 30 },
    { type: "state_change", ...one(BIN("window")), trigger_to_state: "on", trigger_target_changes: 1 },
  ] });
  await mk("or", "Warm OR window open", { type: "compound", compound_logic: "OR", conditions: [
    { type: "threshold", ...one(S("t2")), trigger_above: 30 },
    { type: "state_change", ...one(BIN("window")), trigger_to_state: "on", trigger_target_changes: 1 },
  ] });
  await mk("all", "Both above 30 °C", { type: "threshold", entity_id: S("a1"), entity_ids: [S("a1"), S("a2")], entity_logic: "all", trigger_above: 30 });
  await sleep(4000);

  log("\n▶ at rest");
  const rest = await objectTasks();
  for (const [k, t] of Object.entries(rest)) expect(calm(t), `${k}: not triggered at rest (${t.status})`);

  log("\n▶ threshold");
  await set(S("temp"), 35, { unit_of_measurement: "°C" });
  await waitFor("above", triggered, "35 °C over 30 triggers");
  await set(S("level"), 5, { unit_of_measurement: "%" });
  await waitFor("below", triggered, "5 % under 10 triggers");
  await set(S("code"), 360, {});
  await waitFor("equals", triggered, "reading 360 triggers");
  await set(S("mode"), 3, {});
  await waitFor("notequals", triggered, "reading 3 (not 0) triggers");
  await set(S("held"), 35, { unit_of_measurement: "°C" });
  await sleep(5000);
  expect(calm((await objectTasks()).held), "held: not yet triggered after 5 s of a 1-minute hold");

  log("\n▶ counter");
  await set(S("cycles"), 99, { unit_of_measurement: "cycles", state_class: "total_increasing" });
  await sleep(2500);
  expect(calm((await objectTasks()).counter), "counter: 99 of 100 not triggered");
  await set(S("cycles"), 100, { unit_of_measurement: "cycles", state_class: "total_increasing" });
  await waitFor("counter", triggered, "100 cycles triggers");
  await set(S("odo"), 1400, { unit_of_measurement: "km", state_class: "total_increasing" });
  await sleep(2500);
  expect(calm((await objectTasks()).delta), "delta: +400 of 500 km not triggered");
  await set(S("odo"), 1500, { unit_of_measurement: "km", state_class: "total_increasing" });
  await waitFor("delta", triggered, "+500 km triggers");

  log("\n▶ state change, runtime, due date");
  await set(BIN("door"), "on", { device_class: "door" }); await sleep(800);
  await set(BIN("door"), "off", { device_class: "door" }); await sleep(800);
  expect(calm((await objectTasks()).state), "state: one opening of two not triggered");
  await set(BIN("door"), "on", { device_class: "door" });
  await waitFor("state", triggered, "second opening triggers");
  await set(SW, "on", {});
  await set(S("due"), iso(new Date(Date.now() + 2 * 86400e3)), { device_class: "timestamp" });
  await waitFor("due", triggered, "a date 2 days out with a 3-day lead triggers");

  log("\n▶ compound + all");
  await set(S("t2"), 35, { unit_of_measurement: "°C" });
  await waitFor("or", triggered, "OR: warm alone triggers");
  await sleep(2000);
  expect(calm((await objectTasks()).and), "AND: warm alone does not trigger");
  await set(BIN("window"), "on", { device_class: "window" });
  await waitFor("and", triggered, "AND: warm + window open triggers");
  await set(S("a1"), 35, { unit_of_measurement: "°C" });
  await sleep(2500);
  expect(calm((await objectTasks()).all), "all: one of two above does not trigger");
  await set(S("a2"), 35, { unit_of_measurement: "°C" });
  await waitFor("all", triggered, "all: both above triggers");

  log("\n▶ held threshold and runtime (time based)");
  await waitFor("held", triggered, "held above 30 °C for a minute triggers", 80000);
  await set(SW, "off", {});
  await waitFor("runtime", triggered, "36 s of runtime triggers", 30000);

  // ── surfaces while triggered ──
  log("\n▶ surfaces agree while triggered");
  const now = await objectTasks();
  const trig = Object.entries(now).filter(([, t]) => triggered(t));
  expect(trig.length === Object.keys(T).length, `all ${Object.keys(T).length} triggered (${trig.length})`);
  const states = Object.fromEntries((await send({ type: "get_states" })).map((s) => [s.entity_id, s]));
  const todo = (await send({ type: "todo/item/list", entity_id: "todo.maintenance" })).items;
  const start = new Date(Date.now() - 86400e3).toISOString(), end = new Date(Date.now() + 86400e3).toISOString();
  const cal = await fetch(`${REST}/api/calendars/calendar.maintenance_schedule?start=${start}&end=${end}`, { headers: H }).then((r) => r.json());
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: (await (await fetch(`${REST}/api/config`, { headers: H })).json()).time_zone }).format(new Date());
  for (const [k, t] of trig) {
    expect(states[t.binary_sensor_entity_id]?.state === "on", `${k}: overdue binary on`);
    expect(states[t.sensor_entity_id]?.state === "triggered", `${k}: status sensor triggered`);
    expect(todo.some((i) => i.uid === `${entry}:${t.id}` && i.status === "needs_action"), `${k}: on the to-do list`);
    expect(cal.some((e) => (e.summary || "").includes(t.name) && (e.start?.date || "").startsWith(today)), `${k}: calendar event today`);
  }
  // The summary coordinator coalesces refreshes over a 1 s cooldown, so give
  // it that long to catch up with the task that triggered last.
  const t0 = Date.now();
  let total = -1, summary = null;
  while (Date.now() - t0 < 5000) {
    total = 0; for (const o of (await send({ type: "maintenance_supporter/objects" })).objects) for (const t of o.tasks) if (t.status === "triggered") total++;
    summary = (await send({ type: "get_states" })).find((s) => s.entity_id === "sensor.maintenance_supporter_triggered")?.state;
    if (Number(summary) === total) break;
    await sleep(250);
  }
  expect(Number(summary) === total, `summary triggered ${summary} = ${total} (settled after ${((Date.now() - t0) / 1000).toFixed(1)} s)`);

  // ── screenshots + geometry ──
  log("\n▶ screenshots");
  await send({ type: "lovelace/dashboards/create", url_path: `tl-${stamp}`, title: `TL ${stamp}`, mode: "storage", show_in_sidebar: false, require_admin: false });
  dash = `tl-${stamp}`;
  await send({ type: "lovelace/config/save", url_path: dash, config: { views: [{ title: "tl", cards: [{ type: "custom:maintenance-supporter-card", filter_objects: [`Trigger Lab ${stamp}`], show_actions: true }] }] } });
  browser = await chromium.connect(PW_WS, { timeout: 30000 });
  const charts = {};
  for (const [label, width, height] of [["desktop", 1600, 1300], ["phone", 400, 1600]]) {
    const ctx = await browser.newContext({ viewport: { width, height }, isMobile: width < 500 });
    await ctx.addInitScript(hassTokensInit, { t: token, ha: HA });
    const p = await ctx.newPage();
    await p.goto(`${HA}/maintenance-supporter`, { waitUntil: "domcontentloaded", timeout: 30000 });
    for (let i = 0; i < 40; i++) {
      await p.waitForTimeout(1000);
      if (await p.evaluate(`(() => { ${DEEP_SRC}
        window.__panel = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-PANEL")[0];
        return !!window.__panel && (window.__panel._objects || []).some((o) => o.entry_id === ${JSON.stringify(entry)}); })()`).catch(() => false)) break;
    }
    // object page: all 13 rows, then the geometry probe
    await p.evaluate((e) => window.__panel._showObject(e), entry);
    await p.waitForTimeout(2000);
    await p.screenshot({ path: `${OUT}object-${label}.png`, fullPage: true });
    const geo = await p.evaluate(() => {
      const root = window.__panel.shadowRoot;
      const rows = [...root.querySelectorAll(".task-row")];
      const lefts = new Set(), rights = new Set(), spill = [];
      for (const r of rows) {
        const rb = r.getBoundingClientRect();
        const pill = r.querySelector(".status-badge"), due = r.querySelector(".due-text");
        if (pill) lefts.add(Math.round(pill.getBoundingClientRect().left));
        if (due && due.textContent.trim()) rights.add(Math.round(due.getBoundingClientRect().right));
        for (const el of r.querySelectorAll("*")) {
          const b = el.getBoundingClientRect();
          if (b.width && (b.right > rb.right + 1 || b.left < rb.left - 1)) { spill.push(`${(r.querySelector(".task-name")?.textContent || "").trim()}: ${el.tagName.toLowerCase()}.${el.className}`); break; }
        }
      }
      return { rows: rows.length, pillLefts: [...lefts], dueRights: [...rights], spill };
    });
    log(`  ${label} geometry: ${JSON.stringify(geo)}`);
    expect(geo.rows >= Object.keys(T).length, `${label}: ${geo.rows} rows on the object page`);
    expect(geo.pillLefts.length === 1, `${label}: status pills start at one x (${geo.pillLefts.join(", ")})`);
    expect(geo.dueRights.length <= 1, `${label}: due texts end at one x (${geo.dueRights.join(", ")})`);
    expect(geo.spill.length === 0, `${label}: nothing spills out of its row (${geo.spill.slice(0, 3).join(" | ")})`);
    // dashboard filtered to the lab
    await p.evaluate(() => { const pn = window.__panel; pn._view = "overview"; pn._setOverviewTab?.("dashboard"); pn._filterStatus = "triggered"; });
    await p.waitForTimeout(1500);
    await p.screenshot({ path: `${OUT}dashboard-${label}.png`, fullPage: false });
    // one task page per kind
    for (const k of ["above", "below", "equals", "held", "counter", "delta", "state", "runtime", "due", "and", "all"]) {
      await p.evaluate(({ e, id }) => window.__panel._showTask(e, id), { e: entry, id: T[k] });
      // The chart series as drawn: sample it early and again once it stops
      // changing, so a partial first paint and a desktop/phone mismatch show.
      const sample = () => p.evaluate(`(() => { ${DEEP_SRC}
        const c = deep((el) => el.tagName === "MAINTENANCE-TRIGGER-CHART")[0];
        if (!c) return "none";
        const v = (c.points || []).map((q) => q.val);
        return v.length ? \`n\${v.length} \${Math.min(...v)}..\${Math.max(...v)} first \${v[0]} last \${v.at(-1)}\${c.hideOutliers ? " outliers-hidden" : ""}\` : "empty"; })()`).catch(() => "error");
      await p.waitForTimeout(1600);
      const early = await sample();
      let settled = early;
      for (let i = 0; i < 10; i++) {
        await p.waitForTimeout(1000);
        const s = await sample();
        if (s === settled) break;
        settled = s;
      }
      (charts[k] ||= {})[label] = settled;
      if (early !== settled) log(`  ${label} ${k}: chart changed after first paint: ${early} → ${settled}`);
      await p.screenshot({ path: `${OUT}task-${k}-${label}.png`, fullPage: false });
    }
    // the card
    await p.goto(`${HA}/${dash}/0`, { waitUntil: "domcontentloaded", timeout: 30000 });
    let cardRows = 0;
    for (let i = 0; i < 45 && cardRows < Object.keys(T).length; i++) {
      await p.waitForTimeout(1000);
      cardRows = await p.evaluate(`(() => { ${DEEP_SRC}
        const c = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-CARD")[0];
        return c?.shadowRoot ? c.shadowRoot.querySelectorAll(".task-row, .task-item, li").length : 0; })()`).catch(() => 0);
    }
    expect(cardRows >= Object.keys(T).length, `${label}: the card lists the lab tasks (${cardRows})`);
    await p.waitForTimeout(800);
    await p.screenshot({ path: `${OUT}card-${label}.png`, fullPage: true });
    await ctx.close();
  }
  // Same data, same chart: the phone must not draw a different series. The
  // runtime line is synthesized up to "now", so only its shape is compared.
  for (const [k, v] of Object.entries(charts)) {
    const norm = (s) => (k === "runtime" ? String(s).replace(/[\d.]+\.\.[\d.]+.*/, "") : s);
    expect(norm(v.desktop) === norm(v.phone), `${k}: desktop and phone draw the same series (${v.desktop} | ${v.phone})`);
  }

  // ── recovery ──
  log("\n▶ recovery");
  const hist = (await objectTasks()).below.history.length;
  await set(S("level"), 60, { unit_of_measurement: "%" });
  const below = await waitFor("below", (t) => calm(t) && t.history.length > hist, "back above 10 % completes by itself");
  expect(below?.history.at(-1)?.type === "completed", `below: the recovery is recorded as completed (${below?.history.at(-1)?.type})`);
  await set(S("temp"), 20, { unit_of_measurement: "°C" });
  await sleep(2500);
  const above = (await objectTasks()).above;
  log(`  above after recovery without auto-complete: status ${above.status}, trigger_active ${above.trigger_active}`);
  await send({ type: "maintenance_supporter/task/complete", entry_id: entry, task_id: T.delta });
  await waitFor("delta", calm, "delta: completing re-baselines and clears");
  await set(S("odo"), 1600, { unit_of_measurement: "km", state_class: "total_increasing" });
  await sleep(2500);
  expect(calm((await objectTasks()).delta), "delta: +100 after the new baseline does not trigger");
} catch (err) {
  findings.push(`aborted: ${err?.stack || err}`);
  log("ERROR", err?.stack || err);
} finally {
  try { if (entry) await send({ type: "maintenance_supporter/object/delete", entry_id: entry }); } catch { /* ignore */ }
  for (const id of used) { try { await fetch(`${REST}/api/states/${id}`, { method: "DELETE", headers: H }); } catch { /* ignore */ } }
  try { if (dash) { const d = (await send({ type: "lovelace/dashboards/list" })).find((x) => x.url_path === dash); if (d) await send({ type: "lovelace/dashboards/delete", dashboard_id: d.id }); } } catch { /* ignore */ }
  if (browser) await browser.close().catch(() => {});
  log(`\n════ ${findings.length ? `${findings.length} FINDING(S)` : "ALL TRIGGER KINDS OK"} ════`);
  for (const f of findings) log(`  - ${f}`);
  api.close();
  process.exit(findings.length ? 1 : 0);
}
