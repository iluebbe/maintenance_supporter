/** Live check of the beta task editor (2026-10): the task dialog as rule rows
 * with a sidebar, the add-rule picker (by type and by the object's area or
 * device), removing rules, the new-task start screen, the template preview
 * and the Trace tab, through the real panel of a running Home Assistant.
 *
 * Every scenario changes a task through the UI and reads the stored task back
 * over the WebSocket API: what should change did, and nothing else did.
 * Entity, state and date pickers are HA's own components; the script answers
 * them the way they answer the dialog (a value-changed event on the picker),
 * everything else is clicked and typed.
 *
 * Usage (playwright-server on 127.0.0.1:3000, see reference recipe):
 *   node e2e/live-beta-editor-check.mjs                       # ha-maint, docker/.env token
 *   HA_REST=http://127.0.0.1:8132 HA_BROWSER=http://ha-211:8123 HA_USER=demo HA_PASS=… \
 *     WASHER_AREA=1 node e2e/live-beta-editor-check.mjs        # a throwaway instance
 *   ONLY=3,17 runs those scenarios; KEEP=1 leaves the test objects behind.
 *
 * WASHER_AREA=1 expects the template entities binary_sensor.washer_door,
 * sensor.washer_total_washes, sensor.washer_filter_due, sensor.washer_program
 * and switch.washer_motor; it puts them in an area the test object uses.
 */
import { createRequire } from "module";
import fs from "fs";
import { hassTokensInit, loadToken, onboardOrLogin, watchdog, wsClient } from "./ws-client.mjs";

const require = createRequire(new URL("../custom_components/maintenance_supporter/frontend-src/package.json", import.meta.url));
const { chromium } = require("playwright");

const REST = process.env.HA_REST || "http://127.0.0.1:8125";
const HA = process.env.HA_BROWSER || "http://ha-maint:8123";
const ONLY = (process.env.ONLY || "").split(",").map((s) => s.trim()).filter(Boolean);
const SHOTS = process.env.SHOTS_DIR || "";
const D = "maintenance_supporter";
watchdog(Number(process.env.WATCHDOG_MS || 3_600_000), "beta editor live check");

const token = process.env.HA_USER
  ? await onboardOrLogin(REST, { user: process.env.HA_USER, pass: process.env.HA_PASS, cid: REST + "/" })
  : loadToken();
const api = await wsClient(REST, token);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (...a) => console.log(...a);

// ── backend helpers ─────────────────────────────────────────────────────────
const created = [];
async function objectByName(name) {
  const res = await api.send({ type: `${D}/objects` });
  return (res.objects || []).find((o) => o.object?.name === name);
}
async function freshObject(name, extra = {}) {
  const old = await objectByName(name);
  if (old) await api.send({ type: `${D}/object/delete`, entry_id: old.entry_id });
  const res = await api.send({ type: `${D}/object/create`, name, ...extra });
  created.push(res.entry_id);
  await sleep(1500);
  return res.entry_id;
}
async function getTask(entryId, taskId) {
  const res = await api.send({ type: `${D}/object`, entry_id: entryId });
  return (res.tasks || []).find((t) => t.id === taskId);
}
async function tasksOf(entryId) {
  return (await api.send({ type: `${D}/object`, entry_id: entryId })).tasks || [];
}
async function seed(entryId, fields) {
  const res = await api.send({ type: `${D}/task/create`, entry_id: entryId, name: "Seed", task_type: "custom", schedule_type: "time_based", interval_days: 30, ...fields });
  await sleep(800);
  return res.task_id;
}
async function setBeta(on) {
  await api.send({ type: `${D}/global/update`, settings: { advanced_beta_editor_visible: on } });
  await sleep(1000);
}

// ── browser helpers ─────────────────────────────────────────────────────────
const browser = await chromium.connect("ws://127.0.0.1:3000/");
let ctx;
let page;
async function newPage(viewport = { width: 1400, height: 900 }) {
  if (ctx) await ctx.close().catch(() => {});
  ctx = await browser.newContext({ viewport, locale: "en-US" });
  await ctx.addInitScript(hassTokensInit, { t: token, ha: HA });
  await ctx.addInitScript(() => localStorage.setItem("selectedLanguage", JSON.stringify("en")));
  page = await ctx.newPage();
  await page.goto(`${HA}/maintenance-supporter`);
  await page.locator("maintenance-supporter-panel").waitFor({ timeout: 60_000 });
  await sleep(4000);
}
const dlg = () => page.locator("maintenance-task-dialog");
const inDlg = (sel) => dlg().locator(sel).first();
// HA 2026.11's ha-button reflects its appearance ("accent"), so Save goes by its text.
const saveBtn = () => dlg().locator(".dialog-actions ha-button").filter({ hasText: /Save/ }).last();
async function click(sel, settle = 300) {
  await inDlg(sel).click({ timeout: 10_000 });
  await sleep(settle);
}
async function row(id) {
  await click(`.rule-row[data-row="${id}"] .rule-main`);
}
async function fill(label, value) {
  const f = dlg().locator(`.rules-sidebar ms-textfield[label="${label}"] input, .rules-sidebar ms-textfield[label="${label}"] textarea`).first();
  await f.fill(String(value), { timeout: 10_000 });
  await sleep(200);
}
async function select(aria, value) {
  await dlg().locator(`select[aria-label="${aria}"]`).first().selectOption(String(value), { timeout: 10_000 });
  await sleep(200);
}
async function tick(text, on = true) {
  const box = dlg().locator("label", { hasText: text }).locator("input[type=checkbox]").first();
  await box.setChecked(on, { timeout: 10_000 });
  await sleep(200);
}
/** HA's pickers (ha-form + selector) answer with value-changed; so does this. */
async function pick(formSel, value, index = 0) {
  await dlg().locator(formSel).nth(index).evaluate((f, v) => {
    f.dispatchEvent(new CustomEvent("value-changed", { detail: { value: v }, bubbles: true, composed: true }));
  }, value);
  await sleep(400);
}
async function pickDate(label, iso) {
  await dlg().locator(`ms-date-field[label="${label}"]`).first().evaluate((f, v) => {
    f.dispatchEvent(new CustomEvent("value-changed", { detail: { value: v }, bubbles: true, composed: true }));
  }, iso);
  await sleep(300);
}
async function addRule(kind, value) {
  if (!(await dlg().locator(".rules-sidebar.open .add-tabs").count())) await click(".rule-add");
  await click(".add-tab-type");
  await click(`.add-choice[data-kind="${kind}"][data-value="${value}"]`, 500);
}
async function suggest(entityId, target, type = "") {
  if (!(await dlg().locator(".rules-sidebar.open .add-tabs").count())) await click(".rule-add");
  await click(".add-tab-device", 1200);
  const sel = `.device-entity[data-entity="${entityId}"] .add-choice[data-target="${target}"]${type ? `[data-type="${type}"]` : ""}`;
  await click(sel, 700);
}
async function remove(id) {
  await click(`.rule-row[data-row="${id}"] .rule-remove`, 400);
}
async function rowText(id) {
  return (await inDlg(`.rule-row[data-row="${id}"] .rule-sentence`).textContent())?.trim();
}
async function saveDisabled() {
  return saveBtn().evaluate((b) => !!b.disabled);
}
async function save() {
  await saveBtn().click({ timeout: 10_000 });
  for (let i = 0; i < 40; i++) {
    if (!(await dlg().locator(".beta-content, .content").count())) break;
    await sleep(250);
  }
  await sleep(1200);
}
async function cancel() {
  await dlg().locator(".dialog-actions ha-button[appearance=plain]").first().click({ timeout: 10_000 });
  await sleep(500);
}
/** Opens the task's page from a deep link and Edit from its ⋮ menu. */
async function openEditUi(entryId, taskId) {
  await page.goto(`${HA}/maintenance-supporter?entry_id=${entryId}&task_id=${taskId}`);
  await page.locator("maintenance-supporter-panel .more-menu-wrapper ha-icon-button").first().waitFor({ timeout: 30_000 });
  await sleep(1500);
  await page.locator("maintenance-supporter-panel .more-menu-wrapper ha-icon-button").first().click();
  await sleep(400);
  await page.locator("maintenance-supporter-panel .popup-menu [role=menuitem]", { hasText: /^Edit$/ }).first().click();
  await dlg().locator(".beta-content").waitFor({ timeout: 15_000 });
  await sleep(500);
}
/** Opens the edit dialog the way the panel does for a row's Edit. */
async function openEdit(entryId, taskId) {
  await page.locator("maintenance-supporter-panel").evaluate(async (panel, a) => {
    const res = await panel.hass.connection.sendMessagePromise({ type: "maintenance_supporter/object", entry_id: a.entryId });
    const task = res.tasks.find((t) => t.id === a.taskId);
    const d = await panel._ui("maintenance-task-dialog");
    await d.openEdit(a.entryId, task);
  }, { entryId, taskId });
  await dlg().locator(".beta-content").waitFor({ timeout: 15_000 });
  await sleep(400);
}
/** The object's page and its Add task button: the start screen. */
async function openCreateUi(entryId) {
  await page.goto(`${HA}/maintenance-supporter?entry_id=${entryId}`);
  const add = page.locator("maintenance-supporter-panel ha-button", { hasText: /Add Task/i }).first();
  await add.waitFor({ timeout: 30_000 });
  await sleep(1200);
  await add.click();
  await dlg().locator(".chooser").waitFor({ timeout: 15_000 });
  await sleep(400);
}

// ── checks ──────────────────────────────────────────────────────────────────
const results = [];
/** A trigger as stored, compared by meaning: key order aside, and a hold
 *  time of 0 (which every dialog save writes, the classic one too) is none. */
function normTrigger(tc) {
  if (!tc || typeof tc !== "object") return tc ?? null;
  const out = {};
  for (const k of Object.keys(tc).sort()) {
    if (k === "trigger_for_minutes" && tc[k] === 0) continue;
    out[k] = k === "conditions" && Array.isArray(tc[k]) ? tc[k].map(normTrigger) : tc[k];
  }
  return out;
}
const norm = (k, v) => (k === "trigger_config" ? normTrigger(v) : v ?? null);
function diffKeys(a, b, keys) {
  return keys.filter((k) => JSON.stringify(norm(k, a?.[k])) !== JSON.stringify(norm(k, b?.[k])));
}
const STABLE = ["name", "type", "schedule_type", "interval_days", "interval_unit", "interval_anchor", "warning_days", "due_date",
  "trigger_config", "complete_when", "notes", "priority", "labels", "documentation_url", "enabled", "allow_skip",
  "require_tag_scan", "nfc_tag_id", "notify_enabled", "responsible_user_id", "assignee_pool", "rotation_strategy",
  "required_completion_fields", "quick_complete_defaults", "earliest_completion_days", "schedule", "mirror_todo_entities"];

/** `changes`: the keys the scenario may change; every other stable key must stay. */
async function verify(entryId, taskId, before, changes, check) {
  const after = await getTask(entryId, taskId);
  const problems = [];
  if (!after) return ["task gone"];
  // The nested `schedule` mirrors the flat interval fields: it follows them.
  const allowed = changes.some((k) => ["interval_days", "interval_unit", "interval_anchor", "due_date", "schedule_type"].includes(k))
    ? [...changes, "schedule"] : changes;
  const moved = diffKeys(before, after, STABLE.filter((k) => !allowed.includes(k)));
  if (moved.length) problems.push(`unexpected change: ${moved.map((k) => `${k} ${JSON.stringify(before?.[k] ?? null)} → ${JSON.stringify(after?.[k] ?? null)}`).join("; ")}`);
  try {
    const msg = check(after);
    if (msg) problems.push(msg);
  } catch (e) {
    problems.push(`check threw: ${e.message}`);
  }
  return problems;
}
const eq = (label, got, want) => (JSON.stringify(got) === JSON.stringify(want) ? "" : `${label}: ${JSON.stringify(got)} ≠ ${JSON.stringify(want)}`);
const all = (...msgs) => msgs.filter(Boolean).join("; ");

// ── setup ───────────────────────────────────────────────────────────────────
const settingsBefore = await api.send({ type: `${D}/settings` });
const betaBefore = !!settingsBefore.features?.beta_editor;
await setBeta(true);

const states = Object.fromEntries((await api.send({ type: "get_states" })).map((s) => [s.entity_id, s]));
const pickEntity = (pred, fallback) => Object.values(states).find(pred)?.entity_id || fallback;
const NUM = pickEntity((s) => s.entity_id.startsWith("sensor.") && typeof s.attributes.unit_of_measurement === "string" && Number.isFinite(Number(s.state)), "sensor.sun_solar_elevation");
const NUM2 = pickEntity((s) => s.entity_id.startsWith("sensor.") && s.entity_id !== NUM && typeof s.attributes.unit_of_measurement === "string" && Number.isFinite(Number(s.state)), NUM);
const BIN = pickEntity((s) => s.entity_id.startsWith("binary_sensor."), "binary_sensor.washer_door");
const users = (await api.send({ type: `${D}/users/list` }).catch(() => ({ users: [] }))).users || [];

let areaId = null;
if (process.env.WASHER_AREA) {
  const areas = await api.send({ type: "config/area_registry/list" });
  areaId = areas.find((a) => a.name === "Beta laundry")?.area_id
    ?? (await api.send({ type: "config/area_registry/create", name: "Beta laundry" })).area_id;
  for (const id of ["binary_sensor.washer_door", "sensor.washer_total_washes", "sensor.washer_filter_due", "sensor.washer_program", "switch.washer_motor"]) {
    await api.send({ type: "config/entity_registry/update", entity_id: id, area_id: areaId }).catch((e) => log("area for", id, e.message));
  }
}
const OBJ = await freshObject("Beta editor check", areaId ? { area_id: areaId } : {});
const OTHER = await freshObject("Beta editor source");
const SOURCE_TASK = await seed(OTHER, {
  name: "Copy me", task_type: "service", schedule_type: "sensor_based", interval_days: 45, warning_days: 3,
  trigger_config: { type: "threshold", entity_id: NUM, entity_ids: [NUM], trigger_above: 30 },
  complete_when: { entity_id: BIN, to_state: "on" }, notes: "from the source",
});
log(`setup: object ${OBJ}, entities NUM=${NUM} NUM2=${NUM2} BIN=${BIN}, users=${users.length}, area=${areaId}`);
await newPage();

// ── scenarios ───────────────────────────────────────────────────────────────
const T = (fields = {}) => ({ name: "Filter", task_type: "cleaning", ...fields });
const S = []; // [name, seedFields|null, run(ctx) → problems[]]
const edit = (name, seedFields, changes, steps, check, { ui = false } = {}) => S.push([name, async () => {
  const taskId = await seed(OBJ, T(seedFields));
  const before = await getTask(OBJ, taskId);
  if (ui) await openEditUi(OBJ, taskId); else await openEdit(OBJ, taskId);
  await steps(taskId);
  await save();
  return verify(OBJ, taskId, before, changes, check);
}]);

// A. The schedule, in the sidebar.
edit("interval 30 → 45", {}, ["interval_days"], async () => { await row("schedule"); await fill("Interval", 45); }, (t) => eq("interval", t.interval_days, 45), { ui: true });
edit("unit days → weeks", {}, ["interval_days", "interval_unit"], async () => { await row("schedule"); await fill("Interval", 3); await select("Unit", "weeks"); }, (t) => all(eq("n", t.interval_days, 3), eq("unit", t.interval_unit, "weeks")));
edit("unit → months", {}, ["interval_days", "interval_unit"], async () => { await row("schedule"); await fill("Interval", 6); await select("Unit", "months"); }, (t) => all(eq("n", t.interval_days, 6), eq("unit", t.interval_unit, "months")));
edit("unit → years", {}, ["interval_days", "interval_unit"], async () => { await row("schedule"); await fill("Interval", 1); await select("Unit", "years"); }, (t) => all(eq("n", t.interval_days, 1), eq("unit", t.interval_unit, "years")));
edit("anchor → planned", {}, ["interval_anchor", "schedule"], async () => { await row("schedule"); await select("Interval anchor", "planned"); }, (t) => eq("anchor", t.interval_anchor, "planned"));
edit("warning days 7 → 3", { warning_days: 7 }, ["warning_days"], async () => { await row("schedule"); await fill("Warning days", 3); }, (t) => eq("warning", t.warning_days, 3));
edit("warning days → 0", { warning_days: 7 }, ["warning_days"], async () => { await row("schedule"); await fill("Warning days", 0); }, (t) => eq("warning", t.warning_days, 0));
edit("earliest completion 5", {}, ["earliest_completion_days"], async () => { await row("schedule"); await fill("Earliest completion (days before due)", 5); }, (t) => eq("earliest", t.earliest_completion_days, 5));
edit("one-time via add rule + date", {}, ["schedule_type", "interval_days", "due_date", "schedule", "interval_unit", "interval_anchor"], async () => {
  await addRule("schedule", "one_time");
  if (!(await saveDisabled())) throw new Error("save enabled without a date");
  await pickDate("Due date", "2026-12-24");
}, (t) => all(eq("type", t.schedule_type, "one_time"), eq("due", t.due_date, "2026-12-24")));
edit("weekdays Mon + Thu", {}, ["schedule_type", "interval_days", "schedule", "interval_unit", "interval_anchor"], async () => {
  await addRule("schedule", "weekdays");
  await click(".rules-sidebar .weekday-chip >> nth=0");
  await click(".rules-sidebar .weekday-chip >> nth=3");
}, (t) => all(eq("type", t.schedule_type, "weekdays"), eq("days", t.schedule?.weekdays, [0, 3])));
edit("nth weekday: 2nd Saturday", {}, ["schedule_type", "interval_days", "schedule", "interval_unit", "interval_anchor"], async () => {
  await addRule("schedule", "nth_weekday");
  await select("Occurrence", "2");
  await select("Weekday", "5");
}, (t) => all(eq("type", t.schedule_type, "nth_weekday"), eq("nth", t.schedule?.nth, 2), eq("wd", t.schedule?.weekday, 5)));
edit("day of month 15", {}, ["schedule_type", "interval_days", "schedule", "interval_unit", "interval_anchor"], async () => {
  await addRule("schedule", "day_of_month");
  await fill("Day of month (1–31)", 15);
}, (t) => all(eq("type", t.schedule_type, "day_of_month"), eq("day", t.schedule?.day, 15)));
edit("day of month: last day", {}, ["schedule_type", "interval_days", "schedule", "interval_unit", "interval_anchor"], async () => {
  await addRule("schedule", "day_of_month");
  await tick("Last day of the month");
}, (t) => all(eq("type", t.schedule_type, "day_of_month"), eq("day", t.schedule?.day, -1)));
edit("remove the schedule → manual", {}, ["schedule_type", "interval_days", "schedule", "interval_anchor", "interval_unit"], async () => { await remove("schedule"); }, (t) => all(eq("type", t.schedule_type, "manual"), eq("interval", t.interval_days ?? null, null)));
edit("manual → every 14 days", { schedule_type: "manual", interval_days: null }, ["schedule_type", "interval_days", "schedule", "interval_unit", "interval_anchor"], async () => {
  await addRule("schedule", "time_based");
  await fill("Interval", 14);
}, (t) => all(eq("type", t.schedule_type, "time_based"), eq("n", t.interval_days, 14)));
edit("schedule type select → one_time + date", {}, ["schedule_type", "interval_days", "due_date", "schedule", "interval_unit", "interval_anchor"], async () => {
  await row("schedule"); await select("Schedule type", "one_time"); await pickDate("Due date", "2027-01-15");
}, (t) => all(eq("type", t.schedule_type, "one_time"), eq("due", t.due_date, "2027-01-15")));

// B. Sensor rules.
const thresholdSeed = { schedule_type: "sensor_based", interval_days: null, trigger_config: { type: "threshold", entity_id: NUM, entity_ids: [NUM], trigger_above: 25 } };
edit("time-based + threshold: interval stays as safety", {}, ["schedule_type", "trigger_config", "schedule"], async () => {
  await addRule("trigger", "threshold");
  await pick(".rules-sidebar .trigger-section ha-form.entity-picker-form", { trigger_entities: [NUM] });
  await fill("Trigger above", 25);
}, (t) => all(eq("type", t.schedule_type, "sensor_based"), eq("safety", t.interval_days, 30), eq("tc", [t.trigger_config?.type, t.trigger_config?.trigger_above], ["threshold", 25])));
edit("threshold below 5 for 10 min", thresholdSeed, ["trigger_config"], async () => {
  await row("trigger"); await fill("Trigger above", ""); await fill("Trigger below", 5); await fill("For at least (minutes)", 10);
}, (t) => all(eq("below", t.trigger_config?.trigger_below, 5), eq("above", t.trigger_config?.trigger_above ?? null, null), eq("for", t.trigger_config?.trigger_for_minutes, 10)));
edit("threshold limit change 25 → 40", thresholdSeed, ["trigger_config"], async () => { await row("trigger"); await fill("Trigger above", 40); }, (t) => eq("above", t.trigger_config?.trigger_above, 40));
edit("counter by type, delta 25", {}, ["schedule_type", "trigger_config", "schedule"], async () => {
  await addRule("trigger", "counter");
  await pick(".rules-sidebar .trigger-section ha-form.entity-picker-form", { trigger_entities: [NUM] });
  await fill("Target value", 25); await tick("Delta mode");
}, (t) => all(eq("type", t.trigger_config?.type, "counter"), eq("target", t.trigger_config?.trigger_target_value, 25), eq("delta", t.trigger_config?.trigger_delta_mode, true)));
edit("state change to on", {}, ["schedule_type", "trigger_config", "schedule"], async () => {
  await addRule("trigger", "state_change");
  await pick(".rules-sidebar .trigger-section ha-form.entity-picker-form", { trigger_entities: [BIN] });
  await pick(".rules-sidebar .trigger-section ha-form.state-picker-form", { s: "on" }, 1);
}, (t) => all(eq("type", t.trigger_config?.type, "state_change"), eq("to", t.trigger_config?.trigger_to_state, "on")));
edit("state change from off to on, 3 times", {}, ["schedule_type", "trigger_config", "schedule"], async () => {
  await addRule("trigger", "state_change");
  await pick(".rules-sidebar .trigger-section ha-form.entity-picker-form", { trigger_entities: [BIN] });
  await pick(".rules-sidebar .trigger-section ha-form.state-picker-form", { s: "off" }, 0);
  await pick(".rules-sidebar .trigger-section ha-form.state-picker-form", { s: "on" }, 1);
  await fill("Target changes", 3);
}, (t) => all(eq("from", t.trigger_config?.trigger_from_state, "off"), eq("to", t.trigger_config?.trigger_to_state, "on"), eq("n", t.trigger_config?.trigger_target_changes, 3)));
edit("runtime 200 h", {}, ["schedule_type", "trigger_config", "schedule"], async () => {
  await addRule("trigger", "runtime");
  await pick(".rules-sidebar .trigger-section ha-form.entity-picker-form", { trigger_entities: [BIN] });
  await fill("Target runtime (hours)", 200);
}, (t) => all(eq("type", t.trigger_config?.type, "runtime"), eq("h", t.trigger_config?.trigger_runtime_hours, 200)));
edit("safety interval on a sensor-only task", thresholdSeed, ["interval_days", "interval_unit", "interval_anchor"], async () => {
  await addRule("schedule", "time_based");
}, (t) => eq("safety", t.interval_days, 30));
edit("safety interval 30 → 60 and combine: both", { ...thresholdSeed, interval_days: 30 }, ["interval_days", "trigger_config"], async () => {
  await row("trigger"); await fill("Safety interval (optional)", 60); await select("Combine trigger and interval", "all");
}, (t) => all(eq("safety", t.interval_days, 60), eq("comb", t.trigger_config?.trigger_combinator, "all")));
edit("remove the safety interval", { ...thresholdSeed, interval_days: 30 }, ["interval_days", "interval_anchor", "interval_unit"], async () => { await remove("schedule"); }, (t) => all(eq("type", t.schedule_type, "sensor_based"), eq("safety", t.interval_days ?? null, null)));
edit("remove the sensor rule → interval", { ...thresholdSeed, interval_days: 30 }, ["schedule_type", "trigger_config", "schedule"], async () => { await remove("trigger"); }, (t) => all(eq("type", t.schedule_type, "time_based"), eq("n", t.interval_days, 30), eq("tc", t.trigger_config ?? null, null)));
edit("remove the only sensor rule → manual", thresholdSeed, ["schedule_type", "trigger_config", "schedule", "interval_anchor"], async () => { await remove("trigger"); }, (t) => all(eq("type", t.schedule_type, "manual"), eq("tc", t.trigger_config ?? null, null)));
edit("weekdays replace a sensor rule", thresholdSeed, ["schedule_type", "trigger_config", "schedule", "interval_days", "interval_anchor", "interval_unit"], async () => {
  await addRule("schedule", "weekdays"); await click(".rules-sidebar .weekday-chip >> nth=1");
}, (t) => all(eq("type", t.schedule_type, "weekdays"), eq("tc", t.trigger_config ?? null, null), eq("days", t.schedule?.weekdays, [1])));
edit("combine: threshold + state change (OR)", thresholdSeed, ["trigger_config"], async () => {
  await addRule("trigger", "state_change");
  await pick(".rules-sidebar .compound-condition ha-form.entity-picker-form", { condition_entities: [BIN] }, 1);
}, (t) => all(eq("type", t.trigger_config?.type, "compound"), eq("logic", t.trigger_config?.compound_logic, "OR"), eq("n", t.trigger_config?.conditions?.length, 2),
  eq("first", t.trigger_config?.conditions?.[0]?.trigger_above, 25)));
edit("compound logic → AND", { schedule_type: "sensor_based", interval_days: null, trigger_config: { type: "compound", compound_logic: "OR", conditions: [
  { type: "threshold", entity_id: NUM, entity_ids: [NUM], trigger_above: 3 }, { type: "state_change", entity_id: BIN, entity_ids: [BIN], trigger_to_state: "on" }] } }, ["trigger_config"], async () => {
  await row("trigger"); await select("Compound logic", "AND");
}, (t) => eq("logic", t.trigger_config?.compound_logic, "AND"));
edit("compound: removing one of two leaves a plain rule", { schedule_type: "sensor_based", interval_days: null, trigger_config: { type: "compound", compound_logic: "OR", conditions: [
  { type: "threshold", entity_id: NUM, entity_ids: [NUM], trigger_above: 3 }, { type: "state_change", entity_id: BIN, entity_ids: [BIN], trigger_to_state: "on" }] } }, ["trigger_config"], async () => {
  await row("trigger"); await click(".rules-sidebar .compound-condition >> nth=1 >> .icon-btn");
  const txt = await rowText("trigger");
  if (txt !== "above 3") throw new Error(`row says ${txt}`);
}, (t) => all(eq("type", t.trigger_config?.type, "threshold"), eq("above", t.trigger_config?.trigger_above, 3), eq("e", t.trigger_config?.entity_id, NUM)));
edit("two entities, all must trigger", thresholdSeed, ["trigger_config"], async () => {
  await row("trigger");
  await pick(".rules-sidebar .trigger-section ha-form.entity-picker-form", { trigger_entities: [NUM, NUM2] });
  await select("Entity logic", "all");
}, (t) => NUM === NUM2 ? "" : all(eq("ids", t.trigger_config?.entity_ids, [NUM, NUM2]), eq("logic", t.trigger_config?.entity_logic, "all")));
edit("auto-complete on recovery", thresholdSeed, ["trigger_config"], async () => { await row("trigger"); await tick("Auto-complete when the sensor recovers"); }, (t) => eq("auto", t.trigger_config?.auto_complete_on_recovery, true));
edit("state latch: keep it until done", { schedule_type: "sensor_based", interval_days: null, trigger_config: { type: "state_change", entity_id: BIN, entity_ids: [BIN], trigger_to_state: "on" } }, ["trigger_config"], async () => {
  await row("trigger");
  await dlg().locator(".rules-sidebar label.trigger-end-option", { hasText: "Keep the task triggered until it is done" }).locator("input").check();
}, (t) => eq("hold", t.trigger_config?.trigger_hold_until_done, true));
edit("validation: overlapping limits are refused", thresholdSeed, [], async () => {
  await row("trigger"); await fill("Trigger above", 5); await fill("Trigger below", 10);
  await saveBtn().click();
  await sleep(600);
  const err = await dlg().locator(".error").first().textContent().catch(() => "");
  if (!err) throw new Error("no error shown");
  await cancel();
  throw Object.assign(new Error("ok"), { skipSave: true });
}, () => "");

// C. Completing it.
edit("done when door on (picker)", {}, ["complete_when"], async () => {
  await row("completion");
  await pick(".rules-sidebar .complete-when-field ha-form.entity-picker-form", { complete_when: BIN });
  await pick(".rules-sidebar .complete-when-field ha-form.state-picker-form", { s: "on" });
}, (t) => eq("cw", t.complete_when, { entity_id: BIN, to_state: "on" }));
edit("done when: hold 2 min", { complete_when: { entity_id: BIN, to_state: "on" } }, ["complete_when"], async () => {
  await row("completion"); await fill("For at least (minutes)", 2);
}, (t) => eq("cw", t.complete_when, { entity_id: BIN, to_state: "on", for_minutes: 2 }));
edit("done when: any time", { complete_when: { entity_id: BIN, to_state: "on" } }, ["complete_when"], async () => {
  await row("completion"); await tick("Also when it is not due");
}, (t) => eq("any", t.complete_when?.any_time, true));
edit("quick complete on", {}, ["quick_complete_defaults"], async () => { await row("completion"); await tick("Quick complete"); }, (t) => eq("qc", t.quick_complete_defaults, {}));
edit("require notes and cost", {}, ["required_completion_fields"], async () => {
  await row("completion");
  const opts = dlg().locator(".rules-sidebar .required-completion label.req-option input");
  await opts.nth(0).check(); await opts.nth(1).check(); await sleep(300);
}, (t) => eq("n", (t.required_completion_fields || []).length, 2));
edit("don't allow skipping", {}, ["allow_skip"], async () => { await row("completion"); await tick("Don't allow skipping"); }, (t) => eq("skip", t.allow_skip, false));
edit("tag id + only by scanning", {}, ["nfc_tag_id", "require_tag_scan"], async () => {
  await row("completion");
  const tagField = dlg().locator('.rules-sidebar ms-textfield[label="NFC Tag ID (optional)"] input');
  if (await tagField.count()) await tagField.fill("beta-tag-1");
  else await dlg().locator('.rules-sidebar select[aria-label="NFC Tag ID (optional)"]').selectOption({ index: 1 });
  await tick("Only complete by scanning the tag");
}, (t) => all(eq("scan", t.require_tag_scan, true), t.nfc_tag_id ? "" : "no tag stored"));

// D. People and notifications.
if (users.length >= 1) {
  edit("responsible user", {}, ["responsible_user_id"], async () => { await row("people"); await select("Responsible User", users[0].id); }, (t) => eq("resp", t.responsible_user_id, users[0].id));
}
if (users.length >= 2) {
  edit("shared with two, round-robin", {}, ["assignee_pool", "rotation_strategy", "responsible_user_id"], async () => {
    await row("people");
    const boxes = dlg().locator(".rules-sidebar .assignee-pool input[type=checkbox]");
    await boxes.nth(0).check(); await boxes.nth(1).check(); await sleep(300);
    await select("Rotation", "round_robin");
  }, (t) => all(eq("pool", (t.assignee_pool || []).length, 2), eq("rot", t.rotation_strategy, "round_robin")));
}
edit("no notifications", {}, ["notify_enabled"], async () => { await row("notifications"); await tick("No notifications for this task"); }, (t) => eq("notify", t.notify_enabled, false));
edit("notifications back on", { notify_enabled: false }, ["notify_enabled"], async () => { await row("notifications"); await tick("No notifications for this task", false); }, (t) => eq("notify", t.notify_enabled, true));

// E. The task itself.
edit("rename", {}, ["name"], async () => { await row("task"); await fill("Task name", "Clean the drum filter"); }, (t) => eq("name", t.name, "Clean the drum filter"), { ui: true });
edit("type → inspection", {}, ["type"], async () => { await row("task"); await select("Maintenance type", "inspection"); }, (t) => eq("type", t.type, "inspection"));
edit("notes", {}, ["notes"], async () => { await row("task"); await fill("Notes (optional)", "Drain into a flat tray first."); }, (t) => eq("notes", t.notes, "Drain into a flat tray first."));
edit("priority high", {}, ["priority"], async () => {
  await row("task"); await dlg().locator(".rules-sidebar details.details-section > summary").click(); await sleep(300); await select("Priority", "high");
}, (t) => eq("prio", t.priority, "high"));
edit("labels", {}, ["labels"], async () => {
  await row("task"); await dlg().locator(".rules-sidebar details.details-section > summary").click(); await sleep(300); await fill("Labels", "laundry, monthly");
}, (t) => eq("labels", t.labels, ["laundry", "monthly"]));
edit("documentation link", {}, ["documentation_url"], async () => {
  await row("task"); await dlg().locator(".rules-sidebar details.details-section > summary").click(); await sleep(300); await fill("Documentation URL (optional)", "https://example.com/manual");
}, (t) => eq("url", t.documentation_url, "https://example.com/manual"));
edit("disable the task", {}, ["enabled"], async () => { await row("task"); await tick("Task enabled", false); }, (t) => eq("enabled", t.enabled, false));
edit("several changes at once", {}, ["name", "interval_days", "allow_skip", "notify_enabled"], async () => {
  await row("task"); await fill("Task name", "Descale"); await row("schedule"); await fill("Interval", 90);
  await row("completion"); await tick("Don't allow skipping"); await row("notifications"); await tick("No notifications for this task");
}, (t) => all(eq("name", t.name, "Descale"), eq("n", t.interval_days, 90), eq("skip", t.allow_skip, false), eq("notify", t.notify_enabled, false)));
edit("no change: saving keeps everything", { notes: "keep", warning_days: 4 }, [], async () => { await row("schedule"); await row("completion"); }, () => "");
edit("sidebar closed and reopened keeps the edit", {}, ["interval_days"], async () => {
  await row("schedule"); await fill("Interval", 21); await click(".rules-sidebar .sidebar-head ha-icon-button"); await row("schedule");
  const v = await dlg().locator('.rules-sidebar ms-textfield[label="Interval"] input').inputValue();
  if (v !== "21") throw new Error(`field shows ${v}`);
}, (t) => eq("n", t.interval_days, 21));
edit("row sentence follows the sidebar", {}, ["interval_days", "interval_unit"], async () => {
  await row("schedule"); await fill("Interval", 2); await select("Unit", "weeks");
  const txt = await rowText("schedule");
  if (txt !== "Every 2 weeks") throw new Error(`row says ${txt}`);
}, (t) => eq("unit", t.interval_unit, "weeks"));

// F. Area / device suggestions (WASHER_AREA).
if (areaId) {
  edit("suggestion: door → done when", {}, ["complete_when"], async () => {
    await suggest("binary_sensor.washer_door", "done_when");
    await pick(".rules-sidebar .complete-when-field ha-form.state-picker-form", { s: "on" });
  }, (t) => eq("cw", t.complete_when, { entity_id: "binary_sensor.washer_door", to_state: "on" }));
  edit("suggestion: washes → counter", {}, ["schedule_type", "trigger_config", "schedule"], async () => {
    await suggest("sensor.washer_total_washes", "trigger", "counter"); await fill("Target value", 25); await tick("Delta mode");
  }, (t) => all(eq("type", t.trigger_config?.type, "counter"), eq("e", t.trigger_config?.entity_id, "sensor.washer_total_washes"), eq("safety", t.interval_days, 30)));
  edit("suggestion: motor → runtime", {}, ["schedule_type", "trigger_config", "schedule"], async () => {
    await suggest("switch.washer_motor", "trigger", "runtime"); await fill("Target runtime (hours)", 150);
  }, (t) => all(eq("type", t.trigger_config?.type, "runtime"), eq("e", t.trigger_config?.entity_id, "switch.washer_motor")));
  edit("suggestion: filter due → date from a sensor", {}, ["schedule_type", "trigger_config", "schedule"], async () => {
    await suggest("sensor.washer_filter_due", "trigger", "due_date"); await fill("Days before the date", 7);
  }, (t) => all(eq("type", t.trigger_config?.type, "due_date"), eq("days", t.trigger_config?.trigger_days_before, 7)));
  edit("suggestion: program → state change", {}, ["schedule_type", "trigger_config", "schedule"], async () => {
    await suggest("sensor.washer_program", "trigger", "state_change");
    await pick(".rules-sidebar .trigger-section ha-form.state-picker-form", { s: "washing" }, 1);
  }, (t) => all(eq("type", t.trigger_config?.type, "state_change"), eq("to", t.trigger_config?.trigger_to_state, "washing")));
  edit("suggestion joins an existing rule: compound", thresholdSeed, ["trigger_config"], async () => {
    await suggest("binary_sensor.washer_door", "trigger", "state_change");
  }, (t) => all(eq("type", t.trigger_config?.type, "compound"), eq("ids", t.trigger_config?.conditions?.map((c) => c.entity_id), [NUM, "binary_sensor.washer_door"])));
  edit("door: done when + washes: counter in one edit", {}, ["complete_when", "schedule_type", "trigger_config", "schedule"], async () => {
    await suggest("binary_sensor.washer_door", "done_when");
    await pick(".rules-sidebar .complete-when-field ha-form.state-picker-form", { s: "on" });
    await click(".rule-add");
    await suggest("sensor.washer_total_washes", "trigger", "counter"); await fill("Target value", 30);
  }, (t) => all(eq("cw", t.complete_when?.entity_id, "binary_sensor.washer_door"), eq("tc", t.trigger_config?.trigger_target_value, 30)));
} else {
  S.push(["no device: the By device tab says so", async () => {
    const taskId = await seed(OBJ, T());
    await openEdit(OBJ, taskId);
    await click(".rule-add"); await click(".add-tab-device", 1500);
    const txt = await dlg().locator(".beta-no-device").textContent().catch(() => "");
    await cancel();
    return txt.includes("not linked") ? [] : [`message: ${txt}`];
  }]);
}

// G. A new task from the object's page.
const createScenario = (name, run, check) => S.push([name, async () => {
  const beforeIds = new Set((await tasksOf(OBJ)).map((t) => t.id));
  await openCreateUi(OBJ);
  await run();
  const after = (await tasksOf(OBJ)).filter((t) => !beforeIds.has(t.id));
  try {
    const msg = check(after);
    return msg ? [msg] : [];
  } catch (e) {
    return [e.message];
  }
}]);
createScenario("new: scratch", async () => {
  await click(".chooser-scratch"); await fill("Task name", "Wipe the door seal"); await save();
}, (n) => all(eq("count", n.length, 1), eq("name", n[0]?.name, "Wipe the door seal"), eq("int", n[0]?.interval_days, 30)));
createScenario("new: scratch with a sensor rule and done when", async () => {
  await click(".chooser-scratch"); await fill("Task name", "Run a hot wash");
  await addRule("trigger", "threshold");
  await pick(".rules-sidebar .trigger-section ha-form.entity-picker-form", { trigger_entities: [NUM] });
  await fill("Trigger above", 10);
  await row("completion");
  await pick(".rules-sidebar .complete-when-field ha-form.entity-picker-form", { complete_when: BIN });
  await pick(".rules-sidebar .complete-when-field ha-form.state-picker-form", { s: "on" });
  await save();
}, (n) => all(eq("count", n.length, 1), eq("type", n[0]?.schedule_type, "sensor_based"), eq("above", n[0]?.trigger_config?.trigger_above, 10), eq("cw", n[0]?.complete_when?.to_state, "on")));
createScenario("new: from a template task", async () => {
  await click(".chooser-template", 1500);
  const first = dlg().locator(".template-task").first();
  const name = (await first.locator(".chooser-title").textContent()).trim();
  await first.click(); await sleep(500);
  if (!(await rowText("task")).includes(name)) throw new Error("template name not taken over");
  await save();
}, (n) => all(eq("count", n.length, 1), n[0]?.name ? "" : "no name"));
createScenario("new: template search and back to the start", async () => {
  await click(".chooser-template", 1500);
  await dlg().locator(".chooser-search").fill("zzzz-nothing");
  await sleep(300);
  if (await dlg().locator(".template-task").count()) throw new Error("search did not filter");
  await click(".beta-back"); await click(".chooser-scratch"); await fill("Task name", "After back"); await save();
}, (n) => eq("name", n[0]?.name, "After back"));
createScenario("new: copy a task of another object", async () => {
  await click(".chooser-copy", 1500);
  await dlg().locator(".chooser-search").fill("Copy me"); await sleep(300);
  await click(".copy-task", 1500);
  await save();
}, (n) => all(eq("count", n.length, 1), eq("name", n[0]?.name, "Copy me"), eq("type", n[0]?.schedule_type, "sensor_based"), eq("safety", n[0]?.interval_days, 45),
  eq("above", n[0]?.trigger_config?.trigger_above, 30), eq("cw", n[0]?.complete_when?.entity_id, BIN), eq("notes", n[0]?.notes, "from the source"), eq("warn", n[0]?.warning_days, 3)));
createScenario("new: cancel on the start screen creates nothing", async () => { await cancel(); }, (n) => eq("count", n.length, 0));
createScenario("new: cancel after typing creates nothing", async () => { await click(".chooser-scratch"); await fill("Task name", "Not saved"); await cancel(); }, (n) => eq("count", n.length, 0));
createScenario("new: no name, no save", async () => {
  await click(".chooser-scratch");
  if (!(await saveDisabled())) throw new Error("save enabled without a name");
  await cancel();
}, (n) => eq("count", n.length, 0));
createScenario("new: one-time task", async () => {
  await click(".chooser-scratch"); await fill("Task name", "Replace the hose");
  await addRule("schedule", "one_time"); await pickDate("Due date", "2027-03-01"); await save();
}, (n) => all(eq("type", n[0]?.schedule_type, "one_time"), eq("due", n[0]?.due_date, "2027-03-01")));
createScenario("new: from a sensor (start screen)", async () => {
  await click(".chooser-sensor", 1500);
  if (areaId) {
    await click('.device-entity[data-entity="sensor.washer_total_washes"] .add-choice[data-type="counter"]', 600);
    await fill("Target value", 40);
  } else {
    await click(".add-tab-type"); await click('.add-choice[data-kind="trigger"][data-value="threshold"]', 500);
    await pick(".rules-sidebar .trigger-section ha-form.entity-picker-form", { trigger_entities: [NUM] }); await fill("Trigger above", 7);
  }
  await row("task"); await fill("Task name", "From a sensor"); await save();
}, (n) => all(eq("count", n.length, 1), eq("type", n[0]?.schedule_type, "sensor_based"), n[0]?.trigger_config ? "" : "no trigger"));

// H. Trace, the toggle, phone width, series.
S.push(["trace: an edit, a snooze and a completion show in the Trace tab", async () => {
  const taskId = await seed(OBJ, T({ name: "Traced" }));
  await openEdit(OBJ, taskId); await row("schedule"); await fill("Interval", 33); await save();
  await api.send({ type: `${D}/task/snooze`, entry_id: OBJ, task_id: taskId }).catch(() => {});
  await api.send({ type: `${D}/task/complete`, entry_id: OBJ, task_id: taskId, notes: "done in the check" });
  await sleep(1500);
  const trace = await api.send({ type: `${D}/task/trace`, entry_id: OBJ, task_id: taskId });
  const kinds = trace.events.map((e) => e.kind);
  const problems = [];
  if (!kinds.includes("edited")) problems.push(`journal: ${kinds.join(",")}`);
  await page.goto(`${HA}/maintenance-supporter?entry_id=${OBJ}&task_id=${taskId}`);
  const tab = page.locator("maintenance-supporter-panel .tab.trace-tab");
  await tab.waitFor({ timeout: 30_000 }); await tab.click(); await sleep(2000);
  const steps = await page.locator("maintenance-task-trace .trace-step .trace-text").allTextContents();
  if (!steps.some((s) => s.startsWith("Completed"))) problems.push(`steps: ${steps.join(" | ")}`);
  if (!steps.some((s) => s.includes("Task changed"))) problems.push(`no edit step: ${steps.join(" | ")}`);
  return problems;
}]);
S.push(["trace: older and newer cycles", async () => {
  const taskId = await seed(OBJ, T({ name: "Two cycles" }));
  await api.send({ type: `${D}/task/complete`, entry_id: OBJ, task_id: taskId });
  await sleep(2500);
  await api.send({ type: `${D}/task/skip`, entry_id: OBJ, task_id: taskId, reason: "check" }).catch(() => {});
  await sleep(1500);
  await page.goto(`${HA}/maintenance-supporter?entry_id=${OBJ}&task_id=${taskId}`);
  const tab = page.locator("maintenance-supporter-panel .tab.trace-tab");
  await tab.waitFor({ timeout: 30_000 }); await tab.click(); await sleep(2000);
  // Both cycles fall in the same minute here, so the steps tell them apart, not the label.
  const steps = () => page.locator("maintenance-task-trace .trace-step .trace-text").allTextContents();
  const newest = await steps();
  await page.locator("maintenance-task-trace .trace-older").click(); await sleep(500);
  const older = await steps();
  const problems = [];
  if (!newest.some((s) => s.startsWith("Skipped"))) problems.push(`newest: ${newest.join(" | ")}`);
  if (!older.some((s) => s.startsWith("Completed"))) problems.push(`older: ${older.join(" | ")}`);
  return problems;
}]);
S.push(["toggle off: classic dialog, no Trace tab; on again: rows", async () => {
  const taskId = await seed(OBJ, T({ name: "Toggled" }));
  await setBeta(false);
  await newPage();
  await page.goto(`${HA}/maintenance-supporter?entry_id=${OBJ}&task_id=${taskId}`);
  await page.locator("maintenance-supporter-panel .more-menu-wrapper ha-icon-button").first().waitFor({ timeout: 30_000 });
  await sleep(1500);
  const problems = [];
  if (await page.locator("maintenance-supporter-panel .tab.trace-tab").count()) problems.push("Trace tab while off");
  await page.locator("maintenance-supporter-panel .more-menu-wrapper ha-icon-button").first().click(); await sleep(300);
  await page.locator("maintenance-supporter-panel .popup-menu [role=menuitem]", { hasText: /^Edit$/ }).first().click();
  await sleep(1500);
  if (await dlg().locator(".rules-layout").count()) problems.push("rows while off");
  await dlg().locator('section.schedule-section ms-textfield[label="Interval"] input').fill("12"); await sleep(200);
  await saveBtn().click(); await sleep(2000);
  const t = await getTask(OBJ, taskId);
  if (t.interval_days !== 12) problems.push(`classic save: ${t.interval_days}`);
  await setBeta(true);
  await newPage();
  await openEditUi(OBJ, taskId);
  if ((await rowText("schedule")) !== "Every 12 days") problems.push(`row: ${await rowText("schedule")}`);
  await cancel();
  return problems;
}]);
S.push(["phone width: the sidebar below the row, save works", async () => {
  await newPage({ width: 390, height: 844 });
  const taskId = await seed(OBJ, T({ name: "Phone" }));
  const before = await getTask(OBJ, taskId);
  await openEdit(OBJ, taskId);
  const problems = [];
  if (await dlg().locator(".rules-sidebar").isVisible()) problems.push("closed sidebar visible");
  await row("schedule");
  const rowBox = await inDlg('.rule-row[data-row="schedule"]').boundingBox();
  const sideBox = await inDlg(".rules-sidebar").boundingBox();
  const nextBox = await inDlg('.rule-row[data-row="completion"]').boundingBox();
  if (!(sideBox.y > rowBox.y && sideBox.y < nextBox.y)) problems.push(`sidebar at ${sideBox.y}, row ${rowBox.y}, next ${nextBox.y}`);
  const width = await page.evaluate(() => document.documentElement.scrollWidth);
  if (width > 392) problems.push(`page scrolls sideways: ${width}`);
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/beta-phone.png` });
  await fill("Interval", 10);
  await save();
  problems.push(...(await verify(OBJ, taskId, before, ["interval_days"], (t) => eq("n", t.interval_days, 10))));
  await newPage();
  return problems;
}]);
S.push(["series: two tasks one after the other", async () => {
  const a = await seed(OBJ, T({ name: "Series A" }));
  const b = await seed(OBJ, T({ name: "Series B" }));
  await page.locator("maintenance-supporter-panel").evaluate(async (panel, ids) => {
    const res = await panel.hass.connection.sendMessagePromise({ type: "maintenance_supporter/object", entry_id: ids.entry });
    const items = ids.tasks.map((id) => ({ entryId: ids.entry, task: res.tasks.find((t) => t.id === id) }));
    const d = await panel._ui("maintenance-task-dialog");
    await d.openEditSeries(items);
  }, { entry: OBJ, tasks: [a, b] });
  await dlg().locator(".beta-content").waitFor({ timeout: 15_000 });
  await row("schedule"); await fill("Interval", 11);
  await saveBtn().click(); await sleep(2500);
  await row("schedule"); await fill("Interval", 22); await save();
  const [ta, tb] = [await getTask(OBJ, a), await getTask(OBJ, b)];
  return [eq("a", ta.interval_days, 11), eq("b", tb.interval_days, 22)].filter(Boolean);
}]);

// I. The template preview in the gallery.
S.push(["template preview: untick one, create the rest", async () => {
  const res = await api.send({ type: `${D}/templates`, language: "en" });
  const tpl = res.templates.find((t) => !t.disabled && t.tasks.length >= 3);
  const objName = tpl.name;
  const old = await objectByName(objName);
  if (old) await api.send({ type: `${D}/object/delete`, entry_id: old.entry_id });
  await page.goto(`${HA}/maintenance-supporter`); await sleep(3000);
  await page.locator("maintenance-supporter-panel").evaluate((panel) => panel._openTemplateGallery());
  await sleep(1500);
  // By the card's exact name: "Car" is also in "Lawn Care".
  const exact = new RegExp("^" + tpl.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$");
  await page.locator("maintenance-supporter-panel .template-card").filter({ has: page.locator(".template-card-name", { hasText: exact }) }).first().click();
  await sleep(600);
  const boxes = page.locator("maintenance-supporter-panel .template-preview-task input");
  const total = await boxes.count();
  await boxes.nth(1).uncheck(); await sleep(300);
  const label = await page.locator("maintenance-supporter-panel .template-preview-create").textContent();
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/tpl-preview.png` });
  await page.locator("maintenance-supporter-panel .template-preview-create").click(); await sleep(4000);
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/tpl-after-create.png` });
  const obj = await objectByName(objName);
  if (!obj) return ["no object created"];
  created.push(obj.entry_id);
  const n = (await tasksOf(obj.entry_id)).length;
  return [eq("tasks", n, total - 1), label.includes(String(total - 1)) ? "" : `button: ${label}`].filter(Boolean);
}]);
S.push(["template preview: nothing ticked, nothing to create", async () => {
  await page.goto(`${HA}/maintenance-supporter`); await sleep(3000);
  await page.locator("maintenance-supporter-panel").evaluate((panel) => panel._openTemplateGallery());
  await sleep(1500);
  await page.locator("maintenance-supporter-panel .template-card").first().click(); await sleep(600);
  const boxes = page.locator("maintenance-supporter-panel .template-preview-task input");
  for (let i = 0; i < (await boxes.count()); i++) await boxes.nth(i).uncheck();
  await sleep(300);
  const disabled = await page.locator("maintenance-supporter-panel .template-preview-create").evaluate((b) => !!b.disabled);
  const hint = await page.locator("maintenance-supporter-panel .template-preview-none").count();
  await page.locator("maintenance-supporter-panel .template-preview-back").click(); await sleep(400);
  const back = await page.locator("maintenance-supporter-panel .template-card").count();
  await page.keyboard.press("Escape");
  return [disabled ? "" : "create enabled", hint ? "" : "no hint", back ? "" : "back did not return to the gallery"].filter(Boolean);
}]);

// ── run ─────────────────────────────────────────────────────────────────────
let n = 0;
for (const [name, run] of S) {
  n += 1;
  if (ONLY.length && !ONLY.includes(String(n))) continue;
  let problems;
  try {
    problems = await run();
  } catch (e) {
    problems = e.skipSave ? [] : [`error: ${e.message.split("\n")[0]}`];
    if (!e.skipSave && SHOTS) await page.screenshot({ path: `${SHOTS}/fail-${n}.png` }).catch(() => {});
    await page.keyboard.press("Escape").catch(() => {});
    if (await dlg().locator(".beta-content, .content").count().catch(() => 0)) await cancel().catch(() => {});
  }
  results.push({ n, name, ok: problems.length === 0, problems });
  log(`${problems.length ? "FAIL" : "ok  "} ${String(n).padStart(2)} ${name}${problems.length ? "  — " + problems.join(" | ") : ""}`);
}

// ── teardown ────────────────────────────────────────────────────────────────
await setBeta(betaBefore);
if (!process.env.KEEP) for (const id of created) await api.send({ type: `${D}/object/delete`, entry_id: id }).catch(() => {});
await browser.close();
api.close();
const failed = results.filter((r) => !r.ok);
log(`\n${results.length - failed.length}/${results.length} scenarios passed`);
if (process.env.RESULT_JSON) fs.writeFileSync(process.env.RESULT_JSON, JSON.stringify(results, null, 1));
process.exit(failed.length ? 1 : 0);
