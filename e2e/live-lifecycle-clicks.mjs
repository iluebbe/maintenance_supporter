/** One object's whole life, clicked through the panel and the dashboard card
 * the way a user does: create it, give it tasks, complete, undo, skip,
 * postpone, snooze, reset, pause, archive, edit, a checklist, the history,
 * documents, spare parts, a sub-object, moving and copying a task, search,
 * select mode, the calendar, the card's quick actions, pausing and archiving
 * the object, a reload, and deleting it all again.
 *
 * In the new look (the default since 2026-11-01) also the overview as Home
 * Assistant's list page (the toolbar's search, the filter pane, Group by /
 * Sort by, the header row, the create button), the row icons, the double-tap
 * answer, F5 on task and object pages, the object page at 2560 (two columns,
 * a docked task), long names at 1920 and on a phone, the objects table, the
 * trace, the card with a paused task and the virtual rows of a large
 * household: 102 steps, run on the faketime year (HOUSEHOLD=large) with
 * HA_REST=http://127.0.0.1:8164.
 *
 * Every step is clicked and typed (no component internals), then the stored
 * state is read back over the WebSocket API. Steps build on each other; when
 * one fails, the next step's `need` puts the state it expects in place over
 * the API, so one failure stays one failure. A step that fails is retried
 * once (the panel or HA was slow), and a screenshot is kept.
 *
 * Usage (restart playwright-server first, wedge prevention):
 *   HA_REST=http://127.0.0.1:8133 HA_BROWSER=http://ha-212:8123 HA_USER=demo HA_PASS=… \
 *     node e2e/live-lifecycle-clicks.mjs
 *   MODE=classic     the classic look (the switch off); unset or MODE=beta is
 *                    the new look (HA's controls, the rule-row task editor)
 *   BROWSER=webkit VIEWPORT=phone-390 SHOTS_DIR=… ONLY=12,13 KEEP=1
 */
import { createRequire } from "module";
import fs from "fs";
import os from "os";
import path from "path";
import { hassTokensInit, loadToken, onboardOrLogin, watchdog, wsClient } from "./ws-client.mjs";
import { contextOptions, pickDevices, tapLands } from "./layout-sweep-kit.mjs";

const require = createRequire(new URL("../custom_components/maintenance_supporter/frontend-src/package.json", import.meta.url));
const pw = require("playwright");

const REST = process.env.HA_REST || "http://127.0.0.1:8125";
const HA = process.env.HA_BROWSER || "http://ha-maint:8123";
const D = "maintenance_supporter";
const BETA = process.env.MODE !== "classic";
const BROWSER = process.env.BROWSER || "chromium";
const VP = pickDevices(process.env.VIEWPORT || "desktop-1440")[0];
const SHOTS = process.env.SHOTS_DIR || "";
const ONLY = (process.env.ONLY || "").split(",").map((s) => Number(s.trim())).filter(Boolean);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (...a) => console.log(...a);
watchdog(Number(process.env.WATCHDOG_MS || 3_600_000), "lifecycle clicks");

const token = process.env.HA_USER
  ? await onboardOrLogin(REST, { user: process.env.HA_USER, pass: process.env.HA_PASS, cid: REST + "/" })
  : loadToken();
const api = await wsClient(REST, token);
const ws = (type, extra = {}) => api.send({ type: `${D}/${type}`, ...extra });
const ADVANCED = ["checklists"].map((k) => `advanced_${k}_visible`);
const before = (await ws("settings")).features || {};
await ws("global/update", { settings: { ...Object.fromEntries(ADVANCED.map((k) => [k, true])), advanced_beta_editor_visible: BETA } });

// "Today" as HA counts it, and dates around it.
const TZ = (await fetch(`${REST}/api/config`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json())).time_zone;
const today = () => new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date());
const dayOffset = (n) => {
  const d = new Date(`${today()}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

// ── names and the state the steps share ──────────────────────────────────────
const RUN = `${BETA ? "B" : "C"}${Date.now().toString(36).slice(-4)}`;
const OBJ_NAME = `Lifecycle washer ${RUN}`;
const SUB_NAME = `Lifecycle pump ${RUN}`;
const T1 = "Clean the lint filter";
const T2 = "Descale the drum";
const T3 = "Service the pump";
const DASH = "ms-lifecycle-clicks";
const S = { obj: null, sub: null, t1: null, t2: null, t3: null, t4: null, part: null, copy: null, word: null };

for (const o of ((await ws("objects")).objects || []).filter((o) => /^Lifecycle (washer|pump) /.test(o.object?.name || ""))) {
  await ws("object/delete", { entry_id: o.entry_id }).catch(() => {});
}
const dashboards = await api.send({ type: "lovelace/dashboards/list" });
if (!dashboards.some((d) => d.url_path === DASH)) {
  await api.send({ type: "lovelace/dashboards/create", url_path: DASH, title: "Lifecycle", mode: "storage", require_admin: false, show_in_sidebar: false });
}
// A second card lists every status, the paused tasks too.
await api.send({ type: "lovelace/config/save", url_path: DASH, config: { views: [{ title: "Lifecycle", cards: [
  { type: "custom:maintenance-supporter-card" },
  { type: "custom:maintenance-supporter-card", title: "All", filter_status: ["overdue", "triggered", "due_soon", "ok", "paused"] },
] }] } });

// ── backend reads ────────────────────────────────────────────────────────────
const objects = async () => (await ws("objects")).objects || [];
const objByName = async (name) => (await objects()).find((o) => o.object?.name === name);
const objPayload = async (id) => ws("object", { entry_id: id });
const tasksOf = async (id) => (await objPayload(id)).tasks || [];
const taskNamed = async (id, name) => (await tasksOf(id)).find((t) => t.name === name);
const task = async (id, tid) => (await tasksOf(id)).find((t) => t.id === tid);
const history = async (id, tid) => (await ws("task/history", { entry_id: id, task_id: tid })).history || [];
const docs = async (id) => (await ws("documents/list", { entry_id: id })).documents || [];
const parts = async (id) => (await objPayload(id)).parts || [];
/** Polls until `check` returns null (fine) or the time is up: the panel's
 *  write lands a moment after the click. */
async function until(check, ms = 8000) {
  const end = Date.now() + ms;
  let last = "not checked";
  while (Date.now() < end) {
    try { last = await check(); } catch (e) { last = `check threw: ${e.message}`; }
    if (!last) return null;
    await sleep(400);
  }
  return last;
}
/** A name matched whole: "Service the pump" must not find "Service the pump (copy)". */
const exact = (name) => new RegExp(`^\\s*${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`);
const eq = (label, got, want) => (JSON.stringify(got) === JSON.stringify(want) ? null : `${label}: ${JSON.stringify(got)} ≠ ${JSON.stringify(want)}`);

// ── the browser ──────────────────────────────────────────────────────────────
const browser = await pw[BROWSER].connect("ws://127.0.0.1:3000/");
const ctx = await browser.newContext({ ...contextOptions(BROWSER, VP, "en"), locale: "en-US" });
await ctx.addInitScript(hassTokensInit, { t: token, ha: HA });
await ctx.addInitScript(() => { try { localStorage.setItem("selectedLanguage", JSON.stringify("en")); } catch { /* private */ } });
const page = await ctx.newPage();
const panel = page.locator("maintenance-supporter-panel");
const PHONE = VP.width < 600;

/** A tap where a user taps (WebKit cannot hit-test into HA's top-layer
 *  dialogs, so the deep test decides; see live-menus-check). */
/** Scroll the panel's list the way a user does: the wheel where there is
 *  one, the list itself on a phone (mobile WebKit has no mouse wheel). */
let noWheel = false;
async function scrollList(dy) {
  if (!noWheel) {
    try {
      await page.mouse.wheel(0, dy);
      return;
    } catch {
      noWheel = true;
    }
  }
  await panel.evaluate((p, d) => p.shadowRoot.querySelector(".content")?.scrollBy(0, d), dy);
}
async function tap(loc) {
  await loc.waitFor({ timeout: 10_000 });
  try {
    await loc.click({ timeout: 3000 });
  } catch {
    if (!(await tapLands(loc))) throw new Error("the control takes no tap");
    await loc.click({ force: true });
  }
  await sleep(350);
}
const visible = (loc) => loc.filter({ visible: true }).first();
async function go(url, ready) {
  // A goto to the address already open is a reload in Chrome and keeps the
  // history state, and the panel goes back to the page that state names (F5
  // keeps the page since 2026-11-01): a fresh visit starts without it.
  await page.evaluate(() => history.replaceState(null, "")).catch(() => {});
  await page.goto(`${HA}${url}`);
  await ready().waitFor({ timeout: 60_000 });
  await sleep(1500);
}
const goObject = (id = S.obj) => go(`/maintenance-supporter?entry_id=${id}`, () => panel.locator(".detail-header h2"));
const goTask = (id, tid) => go(`/maintenance-supporter?entry_id=${id}&task_id=${tid}`, () => panel.locator(".task-header-actions ha-button").first());
/** The overview, on the Dashboard tab (the panel remembers the last tab,
 *  and the calendar has no + Add). */
async function goOverview() {
  await go("/maintenance-supporter", () => panel.locator(".overview-tabs, ha-tab-group, .tab-bar, .new-menu-button").first());
  if (!(await panel.locator(".new-menu-button").count())) {
    await tap(panel.locator("ha-tab-group ha-tab, ha-tab, .tab, [role=tab]").filter({ hasText: /^\s*Dashboard\s*$/ }).first());
    await panel.locator(".new-menu-button").first().waitFor({ timeout: 10_000 });
  }
}

/** An item of a ⋮ / + menu: HA's ha-dropdown with the beta, our popup without. */
async function menu(trigger, re) {
  await tap(trigger);
  await sleep(300);
  const item = visible(page.locator(BETA ? "ha-dropdown-item" : ".popup-menu [role=menuitem], .new-menu-popup [role=menuitem]").filter({ hasText: re }));
  await tap(item);
  await sleep(600);
}
const taskMenu = (re) => menu(panel.locator(".task-header-actions .more-menu-wrapper ha-icon-button").first(), re);
const objectMenu = (re) => menu(panel.locator(".detail-header .more-menu-wrapper ha-icon-button").first(), re);

/** The open confirm / prompt dialog (the panel's or the shared one). */
const openConfirm = () => page.locator("maintenance-confirm-dialog").filter({ has: page.locator("ha-dialog") }).last();
/** The open dialog's buttons; its host has no box of its own (like HA's
 *  ha-adaptive-dialog), so waiting for the host to show never ends. */
const confirmButtons = async () => {
  const b = openConfirm().locator(".dialog-actions ha-button");
  await b.last().waitFor({ timeout: 8000 });
  return b;
};
async function answer(re, { fill, option } = {}) {
  await confirmButtons();
  const d = openConfirm();
  await sleep(300);
  if (fill !== undefined) await d.locator("input.field-input").first().fill(fill);
  if (option) await choose(d, option);
  await tap(d.locator(".dialog-actions ha-button").filter({ hasText: re }).last());
  await sleep(1200);
}

/** A question that may follow (a prompt some paths ask, some do not). */
async function maybeAnswer(re) {
  const b = openConfirm().locator(".dialog-actions ha-button").last();
  if (await b.waitFor({ timeout: 3000 }).then(() => true, () => false)) await answer(re);
}

/** A dropdown: the native select, or HA's ha-select (beta) opened and its
 *  option tapped. `scope` holds exactly the one select meant. */
async function choose(scope, optionText, label = null) {
  // ms-ha-select carries its label as a property, the native select as aria-label.
  const all = scope.locator("select, ms-ha-select");
  await all.first().waitFor({ state: "attached", timeout: 8000 });
  const index = label ? await all.evaluateAll((els, l) => els.findIndex((e) => (e.getAttribute("aria-label") || e.label) === l), label) : 0;
  if (index < 0) throw new Error(`no dropdown "${label}"`);
  const sel = all.nth(index);
  if ((await sel.evaluate((e) => e.localName)) === "select") {
    await sel.selectOption({ label: optionText });
    await sleep(300);
    return;
  }
  await tap(sel.locator("ha-select").first());
  await sleep(500);
  const opt = visible(page.locator("ha-dropdown-item, ha-list-item, mwc-list-item, ha-md-select-option, wa-option, [role=option], ha-select-item").filter({ hasText: optionText }));
  await tap(opt);
  await sleep(400);
}

/** HA's toast (beta) or ours: its text, and its Undo. */
async function toastText() {
  return page.evaluate(() => {
    let haToast = null;
    const walk = (root) => {
      for (const el of root.querySelectorAll("*")) {
        if (el.localName === "ha-toast" && el.labelText && el.shadowRoot?.querySelector(".toast.visible")) haToast = el.labelText;
        if (el.shadowRoot) walk(el.shadowRoot);
      }
    };
    walk(document);
    const p = document.querySelector("home-assistant")?.shadowRoot?.querySelector("home-assistant-main")?.shadowRoot
      ?.querySelector("ha-drawer partial-panel-resolver ha-panel-custom maintenance-supporter-panel");
    const ours = p?.shadowRoot?.querySelector(".toast")?.textContent;
    return (ours || haToast || "").trim().replace(/\s+/g, " ");
  });
}
async function waitToast(re, ms = 6000) {
  const end = Date.now() + ms;
  let last = "";
  while (Date.now() < end) {
    last = await toastText();
    if (re.test(last)) return null;
    await sleep(250);
  }
  return `no toast matching ${re} (last: "${last}")`;
}
async function undoToast() {
  const undo = BETA
    ? visible(page.locator("ha-toast").locator("ha-button, mwc-button, button").filter({ hasText: /Undo/ }))
    : panel.locator(".toast .toast-undo").first();
  await tap(undo);
  await sleep(1500);
}

// ── the task dialog, in either look ──────────────────────────────────────────
const taskDlg = () => page.locator("maintenance-task-dialog");
async function taskField(label, value) {
  const f = taskDlg().locator(`ms-textfield[label="${label}"] input, ms-textfield[label="${label}"] textarea`).filter({ visible: true }).first();
  await f.fill(String(value), { timeout: 10_000 });
  await sleep(200);
}
/** Beta: open the row whose fields come next. Classic: one long form. */
async function taskRow(id) {
  if (!BETA) return;
  await tap(taskDlg().locator(`.rule-row[data-row="${id}"] .rule-main`).first());
  await sleep(400);
}
async function taskSave() {
  await tap(taskDlg().locator(".dialog-actions ha-button").filter({ hasText: /Save/ }).last());
  for (let i = 0; i < 40 && (await taskDlg().locator(".beta-content, .content").count()); i++) await sleep(250);
  await sleep(1200);
}
/** "+ Add Task" on the object page; the beta's start screen: from scratch. */
async function newTask() {
  await goObject();
  await tap(panel.locator(".detail-header ha-button").filter({ hasText: /Add Task/i }).first());
  if (BETA) await tap(taskDlg().locator(".chooser-scratch").first());
  else await taskDlg().locator(".content").first().waitFor({ timeout: 10_000 });
  await sleep(500);
}
async function editTask(id, tid) {
  await goTask(id, tid);
  await taskMenu(/^\s*Edit\s*$/);
  await taskDlg().locator(BETA ? ".beta-content" : ".content").first().waitFor({ timeout: 10_000 });
  await sleep(500);
}

// ── the complete dialog ──────────────────────────────────────────────────────
const completeDlg = () => page.locator("maintenance-complete-dialog").filter({ has: page.locator("ha-dialog") }).last();
async function completeIn({ notes, cost, duration, ticks = [], partName } = {}) {
  const d = completeDlg();
  await d.locator(".dialog-actions").waitFor({ timeout: 10_000 });
  await sleep(400);
  if (notes !== undefined) await d.locator("textarea.notes-input").fill(notes);
  if (cost !== undefined) await d.locator("ms-cost-input input").first().fill(String(cost));
  if (duration !== undefined) await d.locator('input[inputmode="numeric"]').first().fill(String(duration));
  for (const i of ticks) await tap(d.locator(".checklist-item").nth(i).locator("ha-checkbox, input[type=checkbox]").first());
  if (partName) await tap(d.locator(".used-part-row").filter({ hasText: partName }).locator("ha-checkbox, input[type=checkbox]").first());
  await tap(d.locator(".dialog-actions ha-button").filter({ hasText: /Complete/ }).last());
  await sleep(1500);
}

/** A second completion of the same task within 30 s counts as the same
 *  real-world action (the household double-tap guard) and is dropped: wait
 *  until the last one is older. */
async function guardGap(id, tid) {
  const h = (await history(id, tid)).filter((e) => e.type === "completed");
  const last = h[h.length - 1];
  if (!last) return;
  const wait = new Date(last.timestamp).getTime() + 31_000 - Date.now();
  if (wait > 0) await sleep(wait);
}

// ── the steps ────────────────────────────────────────────────────────────────
const steps = [];
const step = (name, run, need = null) => steps.push({ name, run, need });

/** Each `need` builds over the API what a failed step before would have made. */
const needObject = async () => {
  if (S.obj && (await objects()).some((o) => o.entry_id === S.obj)) return;
  S.obj = (await objByName(OBJ_NAME))?.entry_id ?? (await ws("object/create", { name: OBJ_NAME, manufacturer: "Acme", model: "W1" })).entry_id;
  await sleep(1500);
};
const needTask = (key, name, fields = {}) => async () => {
  await needObject();
  const existing = (await tasksOf(S.obj)).find((t) => t.id === S[key]) ?? (await taskNamed(S.obj, name));
  if (existing) { S[key] = existing.id; return; }
  S[key] = (await ws("task/create", { entry_id: S.obj, name, task_type: "cleaning", schedule_type: "time_based", interval_days: 30, ...fields })).task_id;
  await sleep(1000);
};
const needT1 = needTask("t1", T1);
const needT3 = needTask("t3", T3, { interval_days: 180, checklist: ["Drain", "Clean", "Refill"] });
const needActive = async () => {
  await needT1();
  const t = await task(S.obj, S.t1);
  if (t?.paused) await ws("task/resume", { entry_id: S.obj, task_id: S.t1 });
  if (t?.archived) await ws("task/unarchive", { entry_id: S.obj, task_id: S.t1 });
  if (t?.enabled === false) await ws("task/update", { entry_id: S.obj, task_id: S.t1, enabled: true });
  await sleep(500);
};

// A. The object
step("create the object from + Add › New object", async () => {
  await goOverview();
  await menu(panel.locator(".new-menu-button").first(), /New Object/i);
  const d = page.locator("maintenance-object-dialog");
  await d.locator(".dialog-actions").waitFor({ timeout: 10_000 });
  await d.locator('ms-textfield[label="Name"] input').first().fill(OBJ_NAME);
  await d.locator('ms-textfield[label="Manufacturer (optional)"] input').first().fill("Acme");
  await d.locator('ms-textfield[label="Model (optional)"] input').first().fill("W1");
  await tap(d.locator(".dialog-actions ha-button").filter({ hasText: /Save/ }).last());
  return until(async () => {
    const o = await objByName(OBJ_NAME);
    if (!o) return "no object stored";
    S.obj = o.entry_id;
    return eq("manufacturer", o.object.manufacturer, "Acme") || eq("model", o.object.model, "W1");
  });
});
step("find the object with the search and open it", async () => {
  await goOverview();
  await tap(panel.locator("ha-icon-button[title='Search']").first().or(panel.locator(".search-open, ha-icon-button.search-button").first()));
  await panel.locator(".palette-input").fill(OBJ_NAME);
  await sleep(800);
  await tap(panel.locator(".palette-item").filter({ hasText: OBJ_NAME }).first());
  await sleep(1200);
  const h = (await panel.locator(".detail-header h2").first().textContent().catch(() => "")) || "";
  return h.includes(OBJ_NAME) ? null : `the page shows "${h.trim()}"`;
}, needObject);
step("edit the object: model and notes", async () => {
  await goObject();
  await tap(panel.locator(".detail-header ha-button").filter({ hasText: /^\s*Edit\s*$/ }).first());
  const d = page.locator("maintenance-object-dialog");
  await d.locator(".dialog-actions").waitFor({ timeout: 10_000 });
  await d.locator('ms-textfield[label="Model (optional)"] input').first().fill("W2");
  await d.locator("label.textarea-field").filter({ hasText: "Notes" }).locator("textarea").first().fill("In the basement");
  await tap(d.locator(".dialog-actions ha-button").filter({ hasText: /Save/ }).last());
  return until(async () => {
    const o = (await objects()).find((x) => x.entry_id === S.obj);
    return eq("model", o?.object?.model, "W2") || eq("notes", o?.object?.notes, "In the basement");
  });
}, needObject);

// B. Tasks
step("add a task from scratch: name and a 30-day interval", async () => {
  await newTask();
  await taskField("Task name", T1);
  await taskRow("schedule");
  await taskField("Interval", 30);
  await taskSave();
  return until(async () => {
    const t = await taskNamed(S.obj, T1);
    if (!t) return "no task stored";
    S.t1 = t.id;
    return eq("schedule", t.schedule_type, "time_based") || eq("interval", t.interval_days, 30);
  });
}, needObject);
step("add a second task: 90 days, warned 10 days ahead", async () => {
  await newTask();
  await taskField("Task name", T2);
  await taskRow("schedule");
  await taskField("Interval", 90);
  await taskField("Warning days", 10);
  await taskSave();
  return until(async () => {
    const t = await taskNamed(S.obj, T2);
    if (!t) return "no task stored";
    S.t2 = t.id;
    return eq("interval", t.interval_days, 90) || eq("warning", t.warning_days, 10);
  });
}, needObject);
step("add a task with a checklist of three steps", async () => {
  await newTask();
  await taskField("Task name", T3);
  await taskRow("schedule");
  await taskField("Interval", 180);
  await taskRow("completion");
  await taskDlg().locator("textarea.checklist-textarea").filter({ visible: true }).first().fill("Drain\nClean\nRefill");
  await taskSave();
  return until(async () => {
    const t = await taskNamed(S.obj, T3);
    if (!t) return "no task stored";
    S.t3 = t.id;
    return eq("checklist", t.checklist, ["Drain", "Clean", "Refill"]);
  });
}, needObject);
step(BETA ? "add a task from a template's task (start screen)" : "add a task with notes and a type", async () => {
  const n = (await tasksOf(S.obj)).length;
  if (BETA) {
    await goObject();
    await tap(panel.locator(".detail-header ha-button").filter({ hasText: /Add Task/i }).first());
    await tap(taskDlg().locator(".chooser-template").first());
    await sleep(1500);
    await tap(taskDlg().locator(".template-task").first());
    await sleep(500);
  } else {
    await newTask();
    await taskField("Task name", "Inspect the door seal");
    await taskField("Notes (optional)", "Look for cracks");
    await choose(taskDlg(), "Inspection", "Maintenance type");
  }
  await taskSave();
  return until(async () => {
    const all = await tasksOf(S.obj);
    if (all.length !== n + 1) return `${all.length} tasks, expected ${n + 1}`;
    const t = all.find((x) => ![S.t1, S.t2, S.t3].includes(x.id));
    S.t4 = t?.id;
    if (!BETA) return eq("notes", t?.notes, "Look for cracks") || eq("type", t?.type, "inspection");
    return t?.name ? null : "the new task has no name";
  });
}, needObject);
step("open a task from the object page", async () => {
  await goObject();
  await tap(panel.locator(".object-tasks .task-row .cell.task-name").filter({ hasText: T1 }).first());
  await panel.locator(".task-header-actions").waitFor({ timeout: 10_000 });
  const name = (await panel.locator(".task-name-breadcrumb").first().textContent()) || "";
  return name.includes(T1) ? null : `the task page shows "${name.trim()}"`;
}, needT1);

// C. Completing and the other household actions
step("complete with notes, cost and duration", async () => {
  await goTask(S.obj, S.t1);
  await tap(panel.locator(".task-header-actions ha-button").filter({ hasText: /^\s*Complete\s*$/ }).first());
  await completeIn({ notes: "First clean", cost: 12.5, duration: 15 });
  return until(async () => {
    const h = (await history(S.obj, S.t1)).filter((e) => e.type === "completed");
    const last = h[h.length - 1];
    if (!last) return "no completion in the history";
    const t = await task(S.obj, S.t1);
    return eq("notes", last.notes, "First clean") || eq("cost", last.cost, 12.5) || eq("duration", last.duration, 15)
      || (String(t.last_performed || "").startsWith(today()) ? null : `last performed ${t.last_performed}`);
  });
}, needActive);
// Another task: a second completion of the same task within 30 s is the
// household double-tap guard's (no Undo then, by design).
step("complete a task and take it back with the toast's Undo", async () => {
  const n = (await history(S.obj, S.t2)).length;
  const lp = (await task(S.obj, S.t2))?.last_performed ?? null;
  await goTask(S.obj, S.t2);
  await tap(panel.locator(".task-header-actions ha-button").filter({ hasText: /^\s*Complete\s*$/ }).first());
  await completeIn({ notes: "Undo me" });
  const p = await waitToast(/Undo|completed/i);
  if (p) return p;
  await undoToast();
  return until(async () => {
    const h = await history(S.obj, S.t2);
    if (h.some((e) => e.notes === "Undo me")) return "the undone completion is still in the history";
    return eq("history length", h.length, n) || eq("last performed", (await task(S.obj, S.t2))?.last_performed ?? null, lp);
  });
}, needTask("t2", T2, { interval_days: 90 }));
step("complete from the row on the object page", async () => {
  await guardGap(S.obj, S.t1);
  const n = (await history(S.obj, S.t1)).filter((e) => e.type === "completed").length;
  await goObject();
  const row = panel.locator(".object-tasks .task-row").filter({ hasText: T1 }).first();
  // The labelled button, or the icon (the beta's rows while nobody chose a style).
  await tap(row.locator('ha-button[title="Complete"], [aria-label="Complete"], ha-icon-button.btn-complete').first());
  await completeIn({ notes: "From the row" });
  return until(async () => {
    const h = (await history(S.obj, S.t1)).filter((e) => e.type === "completed");
    return h.length === n + 1 && h[h.length - 1].notes === "From the row" ? null : `${h.length} completions, expected ${n + 1}`;
  });
}, needActive);
step("skip with a reason", async () => {
  await goTask(S.obj, S.t1);
  await tap(panel.locator(".task-header-actions ha-button").filter({ hasText: /^\s*Skip\s*$/ }).first());
  await answer(/Skip/, { fill: "On holiday" });
  return until(async () => {
    const h = await history(S.obj, S.t1);
    const last = h[h.length - 1];
    return last?.type === "skipped" && /On holiday/.test(last.notes || last.reason || "") ? null : `last entry ${JSON.stringify(last)?.slice(0, 120)}`;
  });
}, needActive);
step("postpone to a date", async () => {
  const until20 = dayOffset(20);
  await goTask(S.obj, S.t1);
  await taskMenu(/Postpone/);
  await answer(/Postpone/, { fill: until20 });
  return until(async () => eq("due override", (await task(S.obj, S.t1))?.due_override, until20));
}, needActive);
step("snooze the reminders", async () => {
  await goTask(S.obj, S.t1);
  await taskMenu(/^\s*Snooze\s*$/);
  return waitToast(/snooze|hour|until/i);
}, needActive);
step("reset to a date three days ago", async () => {
  const d3 = dayOffset(-3);
  await goTask(S.obj, S.t1);
  await taskMenu(/^\s*Reset\s*$/);
  await answer(/Reset/, { fill: d3 });
  return until(async () => {
    const t = await task(S.obj, S.t1);
    return String(t?.last_performed || "").startsWith(d3) ? null : `last performed ${t?.last_performed}`;
  });
}, needActive);
step("pause the task until a date", async () => {
  const d40 = dayOffset(40);
  await goTask(S.obj, S.t1);
  await taskMenu(/Pause/);
  await answer(/Pause/, { fill: d40 });
  return until(async () => {
    const t = await task(S.obj, S.t1);
    return t?.paused ? eq("paused until", String(t.paused_until || "").slice(0, 10), d40) : "not paused";
  });
}, needActive);
step("resume the task", async () => {
  if (!(await task(S.obj, S.t1))?.paused) await ws("task/pause", { entry_id: S.obj, task_id: S.t1 });
  await goTask(S.obj, S.t1);
  await taskMenu(/^\s*Resume\s*$/);
  return until(async () => ((await task(S.obj, S.t1))?.paused ? "still paused" : null));
}, needT1);
step("archive the task", async () => {
  await goTask(S.obj, S.t1);
  await taskMenu(/^\s*Archive\s*$/);
  return until(async () => ((await task(S.obj, S.t1))?.archived ? null : "not archived"));
}, needActive);
step("show the archived tasks and unarchive it", async () => {
  if (!(await task(S.obj, S.t1))?.archived) await ws("task/archive", { entry_id: S.obj, task_id: S.t1 });
  await goObject();
  await tap(panel.locator("ha-button").filter({ hasText: /Show archived/i }).first());
  await tap(panel.locator(".object-tasks .task-row .cell.task-name").filter({ hasText: T1 }).first());
  await panel.locator(".task-header-actions").waitFor({ timeout: 10_000 });
  await sleep(800);
  await taskMenu(/^\s*Unarchive\s*$/);
  return until(async () => ((await task(S.obj, S.t1))?.archived ? "still archived" : null));
}, needT1);

// D. Editing
step("edit: the interval to 21 days", async () => {
  await editTask(S.obj, S.t1);
  await taskRow("schedule");
  await taskField("Interval", 21);
  await taskSave();
  return until(async () => eq("interval", (await task(S.obj, S.t1))?.interval_days, 21));
}, needActive);
step("edit: notes", async () => {
  await editTask(S.obj, S.t1);
  await taskRow("task");
  await taskField("Notes (optional)", "Use the soft brush");
  await taskSave();
  return until(async () => eq("notes", (await task(S.obj, S.t1))?.notes, "Use the soft brush"));
}, needActive);
step("edit: labels and priority (the Details fold)", async () => {
  await editTask(S.obj, S.t1);
  await taskRow("task");
  const fold = taskDlg().locator(".details-section").first();
  const head = fold.locator("summary, [slot=header], .collapsible-head").first();
  if (await head.count()) await tap(head);
  else await tap(fold);
  await sleep(500);
  await taskField("Labels", "filter, monthly");
  await choose(taskDlg().locator(".details-section").first(), "High", "Priority");
  await taskSave();
  return until(async () => {
    const t = await task(S.obj, S.t1);
    return eq("labels", t?.labels, ["filter", "monthly"]) || eq("priority", t?.priority, "high");
  });
}, needActive);
step("edit: switch the task off", async () => {
  await editTask(S.obj, S.t1);
  await taskRow("task");
  await tap(taskDlg().locator(".toggle-row").filter({ visible: true }).locator("ha-checkbox, input[type=checkbox]").first());
  await taskSave();
  return until(async () => eq("enabled", (await task(S.obj, S.t1))?.enabled, false));
}, needT1);
step("edit: switch it on again", async () => {
  if ((await task(S.obj, S.t1))?.enabled !== false) await ws("task/update", { entry_id: S.obj, task_id: S.t1, enabled: false });
  await editTask(S.obj, S.t1);
  await taskRow("task");
  await tap(taskDlg().locator(".toggle-row").filter({ visible: true }).locator("ha-checkbox, input[type=checkbox]").first());
  await taskSave();
  return until(async () => eq("enabled", (await task(S.obj, S.t1))?.enabled, true));
}, needT1);

// E. A checklist completion
step("complete the checklist task with two of three steps ticked", async () => {
  await goTask(S.obj, S.t3);
  await tap(panel.locator(".task-header-actions ha-button").filter({ hasText: /^\s*Complete\s*$/ }).first());
  await completeIn({ ticks: [0, 2] });
  return until(async () => {
    const h = (await history(S.obj, S.t3)).filter((e) => e.type === "completed");
    const st = h[h.length - 1]?.checklist_state;
    if (!st) return "no checklist state in the completion";
    return eq("ticked", Object.entries(st).filter(([, v]) => v).map(([k]) => k).sort(), ["0", "2"]);
  });
}, needT3);

// F. History
step("the History tab lists every entry", async () => {
  const n = (await history(S.obj, S.t1)).length;
  await goTask(S.obj, S.t1);
  await tap(panel.locator("ha-tab-group ha-tab, ha-tab, .tab, [role=tab]").filter({ hasText: /^\s*History\s*$/ }).first());
  await sleep(1000);
  const shown = await panel.locator(".history-timeline .history-entry").count();
  return shown === n ? null : `${shown} entries shown, ${n} stored`;
}, needT1);
step("edit a history entry's note", async () => {
  await goTask(S.obj, S.t1);
  await tap(panel.locator("ha-tab-group ha-tab, ha-tab, .tab, [role=tab]").filter({ hasText: /^\s*History\s*$/ }).first());
  await sleep(800);
  const entry = panel.locator(".history-entry").filter({ hasText: "From the row" }).first();
  if (!(await entry.count())) return "no entry 'From the row' shown";
  await tap(entry.locator(".history-edit-btn"));
  const d = page.locator("maintenance-history-edit-dialog");
  await d.locator("button.save").waitFor({ timeout: 8000 });
  await d.locator("textarea").first().fill("From the row, edited");
  await tap(d.locator("button.save"));
  return until(async () => ((await history(S.obj, S.t1)).some((e) => e.notes === "From the row, edited") ? null : "the note did not change"));
}, async () => {
  await needActive();
  if (!(await history(S.obj, S.t1)).some((e) => e.notes === "From the row")) {
    await ws("task/complete", { entry_id: S.obj, task_id: S.t1, notes: "From the row" });
  }
});
step("delete a history entry", async () => {
  const h0 = await history(S.obj, S.t1);
  await goTask(S.obj, S.t1);
  await tap(panel.locator("ha-tab-group ha-tab, ha-tab, .tab, [role=tab]").filter({ hasText: /^\s*History\s*$/ }).first());
  await sleep(800);
  const entry = panel.locator(".history-entry").filter({ hasText: "First clean" }).first();
  if (!(await entry.count())) return "no entry 'First clean' shown";
  await tap(entry.locator(".history-edit-btn"));
  const d = page.locator("maintenance-history-edit-dialog");
  await tap(d.locator("button.delete-entry"));
  await answer(/Delete/);
  return until(async () => {
    const h = await history(S.obj, S.t1);
    return h.some((e) => e.notes === "First clean") ? "the entry is still stored" : eq("entries", h.length, h0.length - 1);
  });
}, async () => {
  await needActive();
  if (!(await history(S.obj, S.t1)).some((e) => e.notes === "First clean")) {
    await ws("task/complete", { entry_id: S.obj, task_id: S.t1, notes: "First clean" });
  }
});

// G. Documents
const docsSection = () => panel.locator("maintenance-documents-section").first();
async function openDocs() {
  await goObject();
  if (!(await docsSection().count())) {
    await tap(panel.locator(".obj-section-title, .obj-section-toggle, button").filter({ hasText: /^\s*Documents/ }).first());
    await sleep(800);
  }
  await docsSection().locator(".doc-header").waitFor({ timeout: 10_000 });
}
step("documents: add a link", async () => {
  await openDocs();
  await tap(docsSection().locator("button.btn").filter({ hasText: /Add link/i }).first());
  await docsSection().locator('.link-form input[type="url"]').fill("https://example.com/washer-manual.pdf");
  await docsSection().locator(".link-form input").nth(1).fill("Washer manual");
  await tap(docsSection().locator(".link-form .btn.primary"));
  return until(async () => ((await docs(S.obj)).some((d) => d.url === "https://example.com/washer-manual.pdf" && d.title === "Washer manual") ? null : "no link stored"));
}, needObject);
step("documents: upload a file", async () => {
  await openDocs();
  const file = path.join(os.tmpdir(), `ms-lifecycle-${RUN}.txt`);
  fs.writeFileSync(file, "Warranty card\n");
  const chooser = page.waitForEvent("filechooser", { timeout: 8000 });
  await tap(docsSection().locator(".doc-actions label.btn.primary").first());
  await (await chooser).setFiles(file);
  return until(async () => ((await docs(S.obj)).some((d) => (d.filename || "").includes("ms-lifecycle")) ? null : "no file stored"), 15_000);
}, needObject);
step("documents: rename the link", async () => {
  await openDocs();
  const row = docsSection().locator(".doc-row").filter({ hasText: "Washer manual" }).first();
  await tap(row.locator('button.icon-btn[title="Edit"]'));
  await docsSection().locator(".doc-row.editing input.edit-title").fill("Washer manual (EN)");
  await tap(docsSection().locator('.doc-row.editing button.icon-btn[title="Save"]'));
  return until(async () => ((await docs(S.obj)).some((d) => d.title === "Washer manual (EN)") ? null : "the title did not change"));
}, async () => {
  await needObject();
  if (!(await docs(S.obj)).some((d) => d.title === "Washer manual")) {
    await ws("documents/add_link", { entry_id: S.obj, url: "https://example.com/washer-manual.pdf", title: "Washer manual" });
  }
});
step("documents: delete the file (Home Assistant's dialog, red button)", async () => {
  await openDocs();
  const row = docsSection().locator(".doc-row").filter({ hasText: "ms-lifecycle" }).first();
  await tap(row.locator("button.icon-btn.danger"));
  const variant = await (await confirmButtons()).last().getAttribute("variant");
  await answer(/Delete/);
  const p = await until(async () => ((await docs(S.obj)).some((x) => (x.filename || "").includes("ms-lifecycle")) ? "the file is still stored" : null));
  return p || eq("Delete button variant", variant, "danger");
}, needObject);

// H. Spare parts
const partsSection = () => panel.locator("maintenance-parts-section").first();
async function openParts() {
  await goObject();
  if (!(await partsSection().count())) {
    await tap(panel.locator(".obj-section-title, .obj-section-toggle, button").filter({ hasText: /^\s*Parts/ }).first());
    await sleep(800);
  }
  await partsSection().locator(".section-head").waitFor({ timeout: 10_000 });
}
const formField = (label) => partsSection().locator("label.form-field").filter({ has: page.locator(`span:text-is("${label}")`) }).locator("input").first();
step("parts: add a part with stock 2, reorder at 1", async () => {
  await openParts();
  await tap(partsSection().locator(".section-head ha-button").filter({ hasText: /Add part/i }).first());
  await formField("Name").fill("Lint filter");
  await formField("Stock").fill("2");
  await formField("Reorder at").fill("1");
  await tap(partsSection().locator(".form-actions ha-button").last());
  return until(async () => {
    const p = (await parts(S.obj)).find((x) => x.name === "Lint filter");
    if (!p) return "no part stored";
    S.part = p.id;
    return eq("stock", p.stock, 2) || eq("reorder at", p.reorder_threshold, 1);
  });
}, needObject);
step("parts: adjust the stock by +3", async () => {
  await openParts();
  const row = partsSection().locator(".part-row").filter({ hasText: "Lint filter" }).first();
  await tap(row.locator('ha-icon-button[title="Adjust stock"]'));
  await row.locator("input.restock-input").fill("3");
  await tap(row.locator('ha-icon-button[title="Save"]'));
  return until(async () => eq("stock", (await parts(S.obj)).find((x) => x.id === S.part)?.stock, 5));
}, async () => {
  await needObject();
  const p = (await parts(S.obj)).find((x) => x.name === "Lint filter");
  if (p) { S.part = p.id; await ws("part/update", { entry_id: S.obj, part_id: p.id, stock: 2 }).catch(() => {}); return; }
  S.part = (await ws("part/create", { entry_id: S.obj, name: "Lint filter", stock: 2, reorder_threshold: 1 })).part_id;
});
step("complete with a used part: the stock drops by one", async () => {
  const stock = (await parts(S.obj)).find((x) => x.id === S.part)?.stock;
  await guardGap(S.obj, S.t1);
  await goTask(S.obj, S.t1);
  await tap(panel.locator(".task-header-actions ha-button").filter({ hasText: /^\s*Complete\s*$/ }).first());
  await completeIn({ notes: "Filter swapped", partName: "Lint filter" });
  return until(async () => eq("stock", (await parts(S.obj)).find((x) => x.id === S.part)?.stock, stock - 1));
}, async () => {
  await needActive();
  if (!S.part || !(await parts(S.obj)).some((x) => x.id === S.part)) {
    S.part = (await ws("part/create", { entry_id: S.obj, name: "Lint filter", stock: 5, reorder_threshold: 1 })).part_id;
  }
});
// #247: a buy task belongs to its part and came straight back after a
// delete while the part stayed low. Deleting it offers to turn the part's buy
// reminder off with it (ticked); then it stays gone, also after the reload.
const buyTask = async () => (await tasksOf(S.obj)).find((tk) => tk.part_ref?.part_id === S.part);
step("parts: delete the buy task, its reminder with it (#247)", async () => {
  const buy = await buyTask();
  if (!buy) return "no buy task to delete";
  await goTask(S.obj, buy.id);
  await taskMenu(/^\s*Delete\s*$/);
  await confirmButtons();
  const ticked = await openConfirm().evaluate((d) => {
    const box = d.shadowRoot.querySelector(".confirm-check input[type=checkbox], .confirm-check ha-checkbox");
    return box ? box.checked === true : null;
  });
  if (ticked !== true) return `the reminder's switch is ${ticked === null ? "missing" : "not ticked"}`;
  await answer(/Delete/);
  const off = await until(async () => {
    if (await buyTask()) return "the buy task is still there";
    const part = (await parts(S.obj)).find((x) => x.id === S.part);
    return part?.auto_buy_task === false ? null : `auto_buy_task ${part?.auto_buy_task}`;
  }, 12_000);
  if (off) return off;
  await sleep(4000); // the reload after the delete re-plans the buy tasks
  return (await buyTask()) ? "the buy task came back" : null;
}, async () => {
  await needObject();
  if (!S.part || !(await parts(S.obj)).some((x) => x.id === S.part)) {
    S.part = (await ws("part/create", { entry_id: S.obj, name: "Lint filter", stock: 5, reorder_threshold: 1 })).part_id;
  }
  if (!(await buyTask())) {
    await ws("part/update", { entry_id: S.obj, part_id: S.part, name: "Lint filter", auto_buy_task: true, reorder_threshold: 1, stock: 0 });
  }
  await until(async () => ((await buyTask()) ? null : "no buy task yet"), 15_000);
});
step("parts: delete the part (Home Assistant's dialog, red button)", async () => {
  await openParts();
  const row = partsSection().locator(".part-row").filter({ hasText: "Lint filter" }).first();
  await tap(row.locator('ha-icon-button[title="Delete"]'));
  const variant = await (await confirmButtons()).last().getAttribute("variant");
  await answer(/Delete/);
  const p = await until(async () => ((await parts(S.obj)).some((x) => x.name === "Lint filter") ? "the part is still stored" : null));
  return p || eq("Delete button variant", variant, "danger");
}, async () => {
  await needObject();
  if (!(await parts(S.obj)).some((x) => x.name === "Lint filter")) await ws("part/create", { entry_id: S.obj, name: "Lint filter", stock: 1 });
});

// I. Structure: a sub-object, moving and copying a task
step("add a sub-object from the object menu", async () => {
  await goObject();
  if (BETA) await objectMenu(/sub-object: New Object/i);
  else {
    await objectMenu(/Add sub-object/i);
    await tap(visible(panel.locator(".sub-object-menu [role=menuitem]").filter({ hasText: /New Object/i })));
  }
  const d = page.locator("maintenance-object-dialog");
  await d.locator(".dialog-actions").waitFor({ timeout: 10_000 });
  await d.locator('ms-textfield[label="Name"] input').first().fill(SUB_NAME);
  await tap(d.locator(".dialog-actions ha-button").filter({ hasText: /Save/ }).last());
  return until(async () => {
    const o = await objByName(SUB_NAME);
    if (!o) return "no sub-object stored";
    S.sub = o.entry_id;
    return eq("parent", o.object.parent_entry_id ?? o.object.parent_id, S.obj);
  });
}, needObject);
step("move a task to the sub-object", async () => {
  await goTask(S.obj, S.t2);
  await taskMenu(/Move to another object/i);
  await answer(/Move/, { option: SUB_NAME });
  return until(async () => ((await tasksOf(S.sub)).some((t) => t.name === T2) && !(await tasksOf(S.obj)).some((t) => t.name === T2) ? null : "the task did not move"));
}, async () => {
  await needTask("t2", T2, { interval_days: 90 })();
  if (!S.sub || !(await objects()).some((o) => o.entry_id === S.sub)) {
    S.sub = (await ws("object/create", { name: SUB_NAME, parent_entry_id: S.obj })).entry_id;
    await sleep(1500);
  }
});
step("duplicate a task", async () => {
  const n = (await tasksOf(S.obj)).length;
  await goTask(S.obj, S.t3);
  await taskMenu(/Duplicate/);
  return until(async () => {
    const all = await tasksOf(S.obj);
    const copy = all.find((t) => t.id !== S.t3 && t.name.startsWith(T3));
    S.copy = copy?.id ?? null;
    return all.length === n + 1 && copy ? eq("copied checklist", copy.checklist, ["Drain", "Clean", "Refill"]) : `${all.length} tasks, expected ${n + 1}`;
  });
}, needT3);
step("delete the copy (confirmed, red button)", async () => {
  await goTask(S.obj, S.copy);
  await taskMenu(/^\s*Delete\s*$/);
  const variant = await (await confirmButtons()).last().getAttribute("variant");
  await answer(/Delete/);
  const p = await until(async () => ((await tasksOf(S.obj)).some((t) => t.id === S.copy) ? "the copy is still stored" : null));
  return p || eq("Delete button variant", variant, "danger");
}, async () => {
  await needT3();
  if (!S.copy || !(await task(S.obj, S.copy))) S.copy = (await ws("task/create", { entry_id: S.obj, name: `${T3} (copy)`, task_type: "custom", schedule_type: "time_based", interval_days: 30 })).task_id;
});

// J. The overview: search, select mode, calendar
step("search a task and open it", async () => {
  await goOverview();
  await page.keyboard.press("/");
  await sleep(500);
  if (!(await panel.locator(".palette-input").count())) await tap(panel.locator("ha-icon-button[title='Search']").first());
  await panel.locator(".palette-input").fill("lint filter");
  await sleep(900);
  await tap(panel.locator(".palette-item").filter({ hasText: T1 }).first());
  await panel.locator(".task-header-actions").waitFor({ timeout: 10_000 });
  const name = (await panel.locator(".task-name-breadcrumb").first().textContent()) || "";
  return name.includes(T1) ? null : `opened "${name.trim()}"`;
}, needActive);
async function selectTwo() {
  await goOverview();
  await panel.evaluate((p) => { p._view = "overview"; p._setOverviewTab("dashboard"); });
  await sleep(900);
  if (await panel.locator(".filter-bar.collapsed").count()) await tap(panel.locator(".mobile-toggle").first());
  // Beta: the selection-mode chip of the toolbar (HA's list pages).
  await tap(panel.locator(BETA ? ".ms-toolbar .ms-chip.icon-only" : ".bulk-toggle").first());
  for (const name of [T1, T3]) {
    // A long list renders only what is on screen (virtual rows): scroll to
    // the task the way a user does.
    const row = panel.locator(".task-row").filter({ has: page.locator(".cell.task-name", { hasText: exact(name) }) });
    await page.mouse.move(VP.width / 2, VP.height * 0.7);
    // The panel keeps its scroll position: start from the top.
    if (!(await row.count())) {
      await scrollList(-200_000);
      await sleep(400);
    }
    for (let i = 0; i < 60 && !(await row.count()); i++) {
      await scrollList(700);
      await sleep(200);
    }
    // Rendered is not on screen: the window draws a screen more below the
    // fold. A user scrolls until the row is in view; a click that scrolls it
    // there itself moves the window, and the rows' elements, under it.
    const box = row.locator('input[type="checkbox"]').first();
    for (let i = 0; i < 20; i++) {
      const b = await box.boundingBox();
      if (b && b.y > 140 && b.y + b.height < VP.height - 40) break;
      await scrollList(b && b.y <= 140 ? -250 : 250);
      await sleep(250);
    }
    await tap(box);
  }
}
step("select mode: pause two tasks", async () => {
  await selectTwo();
  await tap(panel.locator(".bulk-more").first());
  await tap(visible(page.locator(BETA ? "ha-dropdown-item" : ".bulk-more-wrapper .popup-menu [role=menuitem]").filter({ hasText: /Pause/ })));
  await maybeAnswer(/Pause/);
  return until(async () => {
    const [a, b] = [await task(S.obj, S.t1), await task(S.obj, S.t3)];
    return a?.paused && b?.paused ? null : `paused: ${!!a?.paused}, ${!!b?.paused}`;
  });
}, async () => { await needActive(); await needT3(); });
step("select mode: resume them", async () => {
  for (const tid of [S.t1, S.t3]) if (!(await task(S.obj, tid))?.paused) await ws("task/pause", { entry_id: S.obj, task_id: tid });
  await selectTwo();
  await tap(panel.locator(".bulk-more").first());
  await tap(visible(page.locator(BETA ? "ha-dropdown-item" : ".bulk-more-wrapper .popup-menu [role=menuitem]").filter({ hasText: /Resume/ })));
  await maybeAnswer(/Resume/);
  return until(async () => {
    const [a, b] = [await task(S.obj, S.t1), await task(S.obj, S.t3)];
    return !a?.paused && !b?.paused ? null : `paused: ${!!a?.paused}, ${!!b?.paused}`;
  });
}, async () => { await needT1(); await needT3(); });
step("the calendar shows the task on its due date", async () => {
  const t = await task(S.obj, S.t1);
  await goOverview();
  await tap(panel.locator("ha-tab-group ha-tab, ha-tab, .tab, [role=tab]").filter({ hasText: /^\s*Calendar\s*$/ }).first());
  await sleep(1500);
  const text = await panel.evaluate((p) => {
    const out = [];
    const walk = (root) => { for (const el of root.querySelectorAll("*")) { if (el.shadowRoot) walk(el.shadowRoot); } out.push(root.textContent || ""); };
    walk(p.shadowRoot);
    return out.join(" ");
  });
  return text.includes(T1) ? null : `"${T1}" not in the calendar (next due ${t?.next_due})`;
}, needActive);

// K. The dashboard card's quick actions
async function openCard(name) {
  const item = () => page.locator("maintenance-supporter-card .task-item.clickable").filter({ has: page.locator(".task-name", { hasText: exact(name) }) }).first();
  await go(`/${DASH}`, item);
  await tap(item());
  const QA = BETA ? "maintenance-task-quick-actions-dialog ha-adaptive-dialog .ha-shell-body" : "maintenance-task-quick-actions-dialog .dialog";
  await page.locator(QA).first().waitFor({ timeout: 10_000 });
  await sleep(600);
  return page.locator("maintenance-task-quick-actions-dialog").first();
}
step("card: complete from the quick actions", async () => {
  await guardGap(S.obj, S.t3);
  const n = (await history(S.obj, S.t3)).filter((e) => e.type === "completed").length;
  const qa = await openCard(T3);
  await tap(qa.locator(".primary-row ha-button").filter({ hasText: /^\s*Complete\s*$/ }).first());
  await completeIn({ notes: "From the card" });
  return until(async () => {
    const h = (await history(S.obj, S.t3)).filter((e) => e.type === "completed");
    return h.length === n + 1 && h[h.length - 1].notes === "From the card" ? null : `${h.length} completions, expected ${n + 1}`;
  });
}, async () => {
  await needT3();
  if ((await task(S.obj, S.t3))?.paused) await ws("task/resume", { entry_id: S.obj, task_id: S.t3 });
  // Due, so the card lists it.
  await ws("task/update", { entry_id: S.obj, task_id: S.t3, last_performed: dayOffset(-200) });
  await sleep(1000);
});
// The task is overdue: skipping it lets that cycle lapse, which the history
// records as "missed" (a skip ahead of time is "skipped", step 12).
step("card: skip an overdue task with a reason (recorded as missed)", async () => {
  const qa = await openCard(T3);
  await tap(qa.locator(".primary-row ha-button").filter({ hasText: /^\s*Skip\s*$/ }).first());
  await qa.locator(".inline-form ms-textfield input").first().fill("Not needed yet");
  await tap(qa.locator(".inline-form button.btn.primary"));
  return until(async () => {
    const h = await history(S.obj, S.t3);
    const last = h[h.length - 1];
    return last?.type === "missed" && /Not needed yet/.test(last.notes || last.reason || "") ? null : `last entry ${JSON.stringify(last)?.slice(0, 120)}`;
  });
}, async () => {
  await needT3();
  if ((await task(S.obj, S.t3))?.paused) await ws("task/resume", { entry_id: S.obj, task_id: S.t3 });
  await ws("task/update", { entry_id: S.obj, task_id: S.t3, last_performed: dayOffset(-200) });
  await sleep(1000);
});

// M. The beta overview as Home Assistant's list page, the wide layouts and
// the fixes of 2026-11-01, on a large household (the faketime year). Beta
// only: classic has none of it.
const LONG_WORD = "Kondensatablaufschlauchreinigungsintervallüberprüfung";
const LONG_OBJECT = `Wärmepumpe Außeneinheit Garten Nordseite ${RUN} (Viessmann Vitocal 250-A AWO-E-AC 251.A13)`;
const betaStep = (name, run, need = null) => { if (BETA) step(name, run, need); };
// The header row and the objects table exist only on a wide panel (a phone
// gets the cards): these run where they are drawn.
const wideBetaStep = (name, run, need = null) => { if (BETA && VP.width > 870) step(name, run, need); };
/** The dashboard tab with the toolbar, nothing filtered, no search. */
async function goList() {
  await goOverview();
  await panel.evaluate((p) => {
    p._view = "overview"; p._setOverviewTab("dashboard"); p._listSearch = "";
    p._filterStatus = ""; p._filterUser = null; p._filterLabel = null; p._filterPlace = ""; p._filterPriority = ""; p._activeViewId = "";
    p._groupByMode = "none"; p._sortMode = "due_date";
  });
  await panel.locator(".ms-toolbar").first().waitFor({ timeout: 10_000 });
  await sleep(700);
}
const rowNames = () => panel.locator(".task-table .task-row:not(.virt-sizer) .cell.task-name").allTextContents().then((a) => a.map((s) => s.trim()));
async function search(q) {
  await panel.locator(".ms-search input").first().fill(q);
  await sleep(900);
}
async function openPane() {
  if (!(await panel.locator(".ms-filter-pane").count())) await tap(panel.locator(".ms-toolbar .ms-chip").first());
  await panel.locator(".ms-filter-pane").first().waitFor({ timeout: 5000 });
  await sleep(400);
}
async function closePane() {
  if (await panel.locator(".ms-filter-pane").count()) await tap(panel.locator(".ms-pane-head .ms-chip").first());
  await sleep(400);
}
/** A choice in the filter pane, its section opened first. */
async function paneOption(section, label) {
  await openPane();
  const sec = panel.locator(".ms-pane-section").filter({ has: page.locator(".ms-pane-section-head", { hasText: section }) }).first();
  const opt = sec.locator(".ms-pane-option").filter({ hasText: label }).first();
  if (!(await opt.isVisible().catch(() => false))) {
    await tap(sec.locator(".ms-pane-section-head").first());
    await sleep(500);
  }
  await tap(opt);
  await sleep(800);
}
/** Group by (0) / Sort by (1): HA's menu from its chip. */
async function chipMenu(index, label) {
  await tap(panel.locator(".ms-toolbar ha-dropdown").nth(index).locator(".ms-chip").first());
  await sleep(400);
  await tap(visible(page.locator("ha-dropdown-item").filter({ hasText: new RegExp(`^\\s*${label}\\s*$`) })));
  await sleep(900);
}
/** A step at another screen size (the run's own size comes back after). */
async function atSize(width, height, run) {
  await page.setViewportSize({ width, height });
  await sleep(600);
  try { return await run(); } finally { await page.setViewportSize({ width: VP.width, height: VP.height }); await sleep(400); }
}
/** The trace's text (it renders into its own shadow root). */
const traceText = () => panel.locator("maintenance-task-trace").first().evaluate((el) => (el.shadowRoot?.textContent || el.textContent || "")).catch(() => "");
const statusRows = (p, st) => p.evaluate((el, s) => [...el.shadowRoot.querySelectorAll(".task-table .task-row:not(.virt-sizer)")].every((r) => r.querySelector(`.status-badge.${s}`)), st);
const needWord = async () => {
  await needObject();
  S.word = (await taskNamed(S.obj, LONG_WORD))?.id
    ?? (await ws("task/create", { entry_id: S.obj, name: LONG_WORD, task_type: "cleaning", schedule_type: "time_based", interval_days: 30, last_performed: dayOffset(-41) })).task_id;
  await sleep(800);
};

betaStep("toolbar: the search finds a task by its name", async () => {
  await goList();
  await search("lint filter");
  const names = await rowNames();
  return names.includes(T1) && names.every((n) => /lint filter/i.test(n) || n === T1) ? null : `rows: ${JSON.stringify(names.slice(0, 6))}`;
}, needActive);
betaStep("toolbar: the search finds the tasks of an object by its name", async () => {
  await goList();
  await search(OBJ_NAME);
  const names = await rowNames();
  return names.includes(T1) && names.length <= (await tasksOf(S.obj)).length ? null : `${names.length} rows for the object: ${JSON.stringify(names.slice(0, 6))}`;
}, needActive);
betaStep("toolbar: clearing the search brings every row back", async () => {
  await goList();
  const all = await panel.locator(".ms-search input").first().getAttribute("placeholder");
  await search("lint filter");
  await tap(panel.locator(".ms-search-clear").first());
  await sleep(800);
  const after = await panel.locator(".ms-search input").first().inputValue();
  const rows = await panel.locator(".task-table .task-row:not(.virt-sizer)").count();
  return after === "" && rows > 5 ? null : `search "${after}", ${rows} rows (placeholder ${all})`;
}, needActive);
betaStep("filter pane: Overdue shows overdue tasks only", async () => {
  await goList();
  await paneOption("Status", "Overdue");
  const only = await statusRows(panel, "overdue");
  const n = await panel.locator(".task-table .task-row:not(.virt-sizer)").count();
  return only && n > 0 ? null : `${n} rows, all overdue: ${only}`;
}, async () => { await needActive(); await ws("task/update", { entry_id: S.obj, task_id: S.t1, last_performed: dayOffset(-60) }); await sleep(800); });
betaStep("filter pane: the chip counts the active filter, clear takes it off", async () => {
  await goList();
  await paneOption("Status", "Overdue");
  await closePane();
  const badge = (await panel.locator(".ms-toolbar .ms-chip .ms-chip-badge").first().textContent().catch(() => ""))?.trim();
  await openPane();
  await tap(panel.locator(".ms-pane-clear").first());
  await sleep(800);
  const status = await panel.evaluate((p) => p._filterStatus);
  return eq("badge", badge, "1") || eq("status after clear", status, "");
}, needActive);
betaStep("filter pane: priority High", async () => {
  await goList();
  await paneOption("Priority", "High");
  const names = await rowNames();
  const highs = (await objects()).flatMap((o) => o.tasks).filter((tk) => tk.priority === "high" && !tk.archived).length;
  return names.includes(T1) && names.length <= highs ? null : `${names.length} rows (high: ${highs}), T1 ${names.includes(T1)}`;
}, async () => { await needActive(); await ws("task/update", { entry_id: S.obj, task_id: S.t1, priority: "high" }); await sleep(800); });
betaStep("filter pane: a label", async () => {
  await goList();
  await paneOption("Label", "monthly");
  const names = await rowNames();
  return names.includes(T1) ? null : `T1 missing under the label: ${JSON.stringify(names.slice(0, 5))}`;
}, async () => { await needActive(); await ws("task/update", { entry_id: S.obj, task_id: S.t1, labels: ["filter", "monthly"] }); await sleep(800); });
betaStep("filter pane: My tasks", async () => {
  await goList();
  await paneOption("User", "My Tasks");
  const user = await panel.evaluate((p) => p._filterUser);
  return eq("user filter", user, "current_user");
}, needActive);
betaStep("Group by Object puts the object's name over its tasks", async () => {
  await goList();
  await chipMenu(0, "Object");
  const head = await panel.locator(".group-section-header").filter({ hasText: OBJ_NAME }).count();
  const chip = (await panel.locator(".ms-toolbar ha-dropdown").first().locator(".ms-chip").textContent())?.replace(/\s+/g, " ").trim();
  return head ? (/Object/.test(chip || "") ? null : `chip reads "${chip}"`) : "no group for the object";
}, needActive);
betaStep("Group by Area, then back to no grouping", async () => {
  await goList();
  await chipMenu(0, "Area");
  const areaGroups = await panel.locator(".group-section-header").count();
  await chipMenu(0, "No grouping");
  const mode = await panel.evaluate((p) => p._groupByMode);
  return areaGroups > 0 ? eq("group mode", mode, "none") : "no area groups";
}, needActive);
betaStep("Sort by Task name orders the list by name", async () => {
  await goList();
  await chipMenu(1, "Task name");
  const names = await rowNames();
  const sorted = [...names].sort((a, b) => a.localeCompare(b));
  return eq("first rows", names.slice(0, 8), sorted.slice(0, 8));
}, needActive);
wideBetaStep("the header row sorts: Object, then Due date", async () => {
  await goList();
  await tap(panel.locator(".task-head .th-object").first());
  const byObject = await panel.evaluate((p) => p._sortMode);
  await tap(panel.locator(".task-head .th-due").first());
  const byDue = await panel.evaluate((p) => p._sortMode);
  const arrow = await panel.locator(".task-head .th-due[aria-sort=ascending]").count();
  return eq("object sort", byObject, "object") || eq("due sort", byDue, "due_date") || eq("arrow on due", arrow, 1);
}, needActive);
betaStep("Add (bottom right) › New task opens the task editor", async () => {
  await goList();
  await menu(panel.locator(".ms-fab-wrapper .new-menu-button").first(), /New (Maintenance )?Task/i);
  const open = await taskDlg().locator(".chooser-scratch, .beta-content").first().waitFor({ timeout: 8000 }).then(() => true, () => false);
  await page.keyboard.press("Escape");
  await sleep(600);
  return open ? null : "the task editor did not open";
});
betaStep("Add (bottom right) › New object opens the object dialog", async () => {
  await goList();
  await menu(panel.locator(".ms-fab-wrapper .new-menu-button").first(), /New Object/i);
  const d = page.locator("maintenance-object-dialog");
  const open = await d.locator(".dialog-actions").waitFor({ timeout: 8000 }).then(() => true, () => false);
  await page.keyboard.press("Escape");
  await sleep(600);
  return open ? null : "the object dialog did not open";
});
betaStep("the rows carry icons for Complete and Skip (nobody chose a style)", async () => {
  await goObject();
  const row = panel.locator(".object-tasks .task-row").filter({ hasText: T1 }).first();
  // Counted in the row itself: Playwright's locators also find the button
  // inside each ha-icon-button's shadow root.
  const [icons, buttons] = await row.evaluate((r) => [r.querySelectorAll("ha-icon-button.btn-complete").length, r.querySelectorAll("ha-button").length]);
  return icons === 1 && buttons === 0 ? null : `${icons} complete icons, ${buttons} labelled buttons`;
}, needActive);
betaStep("the row's ✓ icon completes", async () => {
  await guardGap(S.obj, S.t1);
  const n = (await history(S.obj, S.t1)).filter((e) => e.type === "completed").length;
  await goObject();
  await tap(panel.locator(".object-tasks .task-row").filter({ hasText: T1 }).first().locator("ha-icon-button.btn-complete").first());
  await completeIn({ notes: "From the icon" });
  return until(async () => {
    const h = (await history(S.obj, S.t1)).filter((e) => e.type === "completed");
    return h.length === n + 1 ? null : `${h.length} completions, expected ${n + 1}`;
  });
}, needActive);
betaStep("a second Complete within 30 s says it was already recorded", async () => {
  const n = (await history(S.obj, S.t1)).filter((e) => e.type === "completed").length;
  await goTask(S.obj, S.t1);
  await tap(panel.locator(".task-header-actions ha-button").filter({ hasText: /^\s*Complete\s*$/ }).first());
  await completeIn({});
  const toast = await waitToast(/Already recorded \d+ s ago/);
  const after = (await history(S.obj, S.t1)).filter((e) => e.type === "completed").length;
  return toast || eq("completions", after, n);
}, async () => {
  await needActive();
  // a fresh completion moments ago, so the next tap is a double tap
  await guardGap(S.obj, S.t1);
  await ws("task/complete", { entry_id: S.obj, task_id: S.t1 });
  await sleep(800);
});
betaStep("the row's ⏭ icon skips", async () => {
  const n = (await history(S.obj, S.t2)).length;
  await goObject();
  await tap(panel.locator(".object-tasks .task-row").filter({ hasText: T2 }).first().locator("ha-icon-button.btn-skip").first());
  await maybeAnswer(/Skip/);
  return until(async () => {
    const h = await history(S.obj, S.t2);
    return h.length === n + 1 && /skipped|missed/.test(h[h.length - 1].type) ? null : `history ${h.length}, expected ${n + 1}`;
  });
}, needTask("t2", T2, { interval_days: 90 }));
betaStep("F5 on a task page stays on the task", async () => {
  await goTask(S.obj, S.t1);
  await page.reload();
  await panel.locator(".task-header-actions").first().waitFor({ timeout: 60_000 });
  await sleep(1500);
  const [view, tid] = await panel.evaluate((p) => [p._view, p._selectedTaskId]);
  return eq("view after F5", [view, tid], ["task", S.t1]);
}, needActive);
betaStep("F5 on an object page stays on the object", async () => {
  await goObject();
  await page.reload();
  await panel.locator(".detail-header h2").first().waitFor({ timeout: 60_000 });
  await sleep(1500);
  const [view, eid] = await panel.evaluate((p) => [p._view, p._selectedEntryId]);
  return eq("view after F5", [view, eid], ["object", S.obj]);
}, needObject);
betaStep("Back from a task page returns to its object", async () => {
  await goObject();
  await tap(panel.locator(".object-tasks .task-row .cell.task-name").filter({ hasText: exact(T1) }).first());
  await panel.locator(".task-header-actions").first().waitFor({ timeout: 10_000 });
  await page.goBack();
  await sleep(1500);
  const view = await panel.evaluate((p) => p._view);
  return eq("view after Back", view, "object");
}, needActive);
betaStep("2560: the object page in two columns, data on the right", () => atSize(2560, 1440, async () => {
  await goObject();
  const cols = await panel.locator(".object-columns > .object-col").count();
  const right = (await panel.locator(".object-columns > .object-col").nth(1).textContent().catch(() => "")) || "";
  return cols === 2 && /Acme/.test(right) ? null : `${cols} columns, right: "${right.slice(0, 60)}"`;
}), needObject);
betaStep("2560: a task docks beside the object page", () => atSize(2560, 1440, async () => {
  await goObject();
  await tap(panel.locator(".object-tasks .task-row .cell.task-name").filter({ hasText: exact(T1) }).first());
  await sleep(1200);
  const [view, tid] = await panel.evaluate((p) => [p._view, p._selectedTaskId]);
  const docked = (await panel.locator(".object-split .split-pane .task-name-breadcrumb").first().textContent().catch(() => "")) || "";
  return eq("view", view, "object") || eq("docked task", tid, S.t1) || (docked.includes(T1) ? null : `pane shows "${docked}"`);
}), needActive);
betaStep("2560: F5 keeps the docked task", () => atSize(2560, 1440, async () => {
  await goObject();
  await tap(panel.locator(".object-tasks .task-row .cell.task-name").filter({ hasText: exact(T1) }).first());
  await sleep(1200);
  await page.reload();
  await panel.locator(".object-split .split-pane .task-name-breadcrumb").first().waitFor({ timeout: 60_000 });
  const docked = (await panel.locator(".object-split .split-pane .task-name-breadcrumb").first().textContent()) || "";
  return docked.includes(T1) ? null : `pane shows "${docked}"`;
}), needActive);
betaStep("2560: complete from the docked task", () => atSize(2560, 1440, async () => {
  await guardGap(S.obj, S.t1);
  const n = (await history(S.obj, S.t1)).filter((e) => e.type === "completed").length;
  await goObject();
  await tap(panel.locator(".object-tasks .task-row .cell.task-name").filter({ hasText: exact(T1) }).first());
  await sleep(1200);
  await tap(panel.locator(".object-split .split-pane .task-header-actions ha-button").filter({ hasText: /^\s*Complete\s*$/ }).first());
  await completeIn({ notes: "Docked" });
  return until(async () => {
    const h = (await history(S.obj, S.t1)).filter((e) => e.type === "completed");
    return h.length === n + 1 && h[h.length - 1].notes === "Docked" ? null : `${h.length} completions, expected ${n + 1}`;
  });
}), needActive);
betaStep("2560: the overview docks a picked task and marks its row", () => atSize(2560, 1440, async () => {
  await goList();
  await search("lint filter");
  await tap(panel.locator(".task-row .cell.task-name").filter({ hasText: exact(T1) }).first());
  await sleep(1200);
  const marked = await panel.locator(".task-row.selected .cell.task-name").filter({ hasText: exact(T1) }).count();
  const docked = (await panel.locator(".split-pane .task-name-breadcrumb").first().textContent().catch(() => "")) || "";
  return marked === 1 && docked.includes(T1) ? null : `marked ${marked}, pane "${docked}"`;
}), needActive);
betaStep("1920: with the filter pane open no empty task pane, a picked task docks", () => atSize(1920, 1080, async () => {
  await goList();
  await panel.evaluate((p) => { p._selectedTaskId = null; });
  await openPane();
  const empty = await panel.locator(".split-pane").count();
  await search("lint filter");
  await tap(panel.locator(".task-row .cell.task-name").filter({ hasText: exact(T1) }).first());
  await sleep(1200);
  const docked = await panel.locator(".split-pane .task-name-breadcrumb").count();
  await closePane();
  return eq("empty task pane", empty, 0) || eq("docked after the pick", docked, 1);
}), needActive);
betaStep("1920: a 53-letter word stays left of the due date", () => atSize(1920, 1080, async () => {
  await goList();
  await openPane();
  await search(LONG_WORD.slice(0, 12));
  const r = await panel.evaluate((p, w) => {
    const row = [...p.shadowRoot.querySelectorAll(".task-row:not(.virt-sizer)")].find((x) => x.querySelector(".cell.task-name")?.textContent.includes(w));
    if (!row) return "no row";
    const range = document.createRange();
    range.selectNodeContents(row.querySelector(".cell.task-name"));
    const right = Math.max(...[...range.getClientRects()].map((c) => c.right));
    const due = row.querySelector(".due-cell").getBoundingClientRect().left;
    return right <= due + 1 ? null : `name ends at ${Math.round(right)}, due starts at ${Math.round(due)}`;
  }, LONG_WORD);
  await closePane();
  return r;
}), needWord);
betaStep("phone: the long word does not run over the object's name", () => atSize(390, 844, async () => {
  await goList();
  await search(LONG_WORD.slice(0, 12));
  return panel.evaluate((p, w) => {
    const row = [...p.shadowRoot.querySelectorAll(".task-row:not(.virt-sizer)")].find((x) => x.querySelector(".cell.task-name")?.textContent.includes(w));
    if (!row) return "no row";
    const range = document.createRange();
    range.selectNodeContents(row.querySelector(".cell.task-name"));
    const rects = [...range.getClientRects()];
    const obj = row.querySelector(".cell.object-name").getBoundingClientRect();
    const hit = rects.some((c) => c.right > obj.left + 1 && c.bottom > obj.top + 1 && c.top < obj.bottom - 1);
    return hit ? "the name's text runs over the object's name" : null;
  }, LONG_WORD);
}), needWord);
betaStep("2560: a long object name gets a wider column", () => atSize(2560, 1440, async () => {
  await goList();
  await search(LONG_WORD.slice(0, 12));
  const w = await panel.evaluate((p, w2) => {
    const row = [...p.shadowRoot.querySelectorAll(".task-row:not(.virt-sizer)")].find((x) => x.querySelector(".cell.task-name")?.textContent.includes(w2));
    return row ? row.querySelector(".cell.object-name").getBoundingClientRect().width : 0;
  }, LONG_WORD);
  return w > 250 ? null : `object column ${Math.round(w)} px`;
}), async () => { await needWord(); await ws("object/update", { entry_id: S.obj, name: LONG_OBJECT }).catch(() => {}); await sleep(1200); });
betaStep("the object keeps its name after the stress test", async () => {
  await ws("object/update", { entry_id: S.obj, name: OBJ_NAME });
  return until(async () => (((await objects()).find((o) => o.entry_id === S.obj)?.object?.name === OBJ_NAME) ? null : "rename back failed"));
}, needObject);
wideBetaStep("objects table: a column header sorts", async () => {
  await goList();
  await panel.evaluate((p) => { p._view = "all_objects"; p._objectViewMode = "table"; p._objectsTableColumns = ["name", "manufacturer", "notes", "task_count", "actions"]; });
  await sleep(1200);
  await tap(panel.locator("th.oc-manufacturer button").first());
  const sort = await panel.evaluate((p) => p._objTableSort);
  const aria = await panel.locator("th.oc-manufacturer").first().getAttribute("aria-sort");
  await tap(panel.locator("th.oc-manufacturer button").first());
  const desc = await panel.locator("th.oc-manufacturer").first().getAttribute("aria-sort");
  return eq("sort", sort, { key: "manufacturer", dir: "asc" }) || eq("aria", [aria, desc], ["ascending", "descending"]);
}, needObject);
wideBetaStep("objects table: notes read as text, not markdown", async () => {
  await goList();
  await panel.evaluate((p) => { p._view = "all_objects"; p._objectViewMode = "table"; p._objectsTableColumns = ["name", "notes"]; p._objTableSort = null; });
  await sleep(1200);
  await search("").catch(() => {});
  const cell = await panel.evaluate((p, n) => {
    const row = [...p.shadowRoot.querySelectorAll(".objects-table-row")].find((r) => r.textContent.includes(n));
    return row?.querySelector(".oc-notes")?.textContent?.trim() ?? null;
  }, OBJ_NAME);
  return eq("notes cell", cell, "Filter every year, see the manual");
}, async () => { await needObject(); await ws("object/update", { entry_id: S.obj, notes: "**Filter** every year, see [the manual](https://example.com/m.pdf)" }); await sleep(1200); });
wideBetaStep("objects table: the name column stays put", async () => {
  await goList();
  await panel.evaluate((p) => { p._view = "all_objects"; p._objectViewMode = "table"; p._objectsTableColumns = ["name", "manufacturer", "model", "serial_number", "notes"]; });
  await sleep(1200);
  const pos = await panel.evaluate((p) => getComputedStyle(p.shadowRoot.querySelector("td.oc-name")).position);
  return eq("name cell position", pos, "sticky");
});
betaStep("trace: this cycle's completion and the edit are listed", async () => {
  await goTask(S.obj, S.t1);
  await tap(panel.locator("ha-tab-group ha-tab, ha-tab-group-tab, ha-tab, .tab, [role=tab]").filter({ hasText: /^\s*Trace\s*$/ }).first());
  await sleep(1800);
  const text = await traceText();
  return /Completed|Task changed/.test(text) ? null : `trace reads "${text.replace(/\s+/g, " ").slice(0, 100)}"`;
}, needActive);
betaStep("trace: a changed interval is named as the dialog names it", async () => {
  await editTask(S.obj, S.t1);
  await taskRow("schedule");
  await taskField("Interval", 28);
  await taskSave();
  await goTask(S.obj, S.t1);
  await tap(panel.locator("ha-tab-group ha-tab, ha-tab-group-tab, ha-tab, .tab, [role=tab]").filter({ hasText: /^\s*Trace\s*$/ }).first());
  await sleep(1800);
  const text = await traceText();
  return /Task changed: [^\n]*Interval/.test(text) && !/interval_days/.test(text) ? null : `trace reads "${text.replace(/\s+/g, " ").slice(0, 140)}"`;
}, needActive);
betaStep("the warning tile reads 1 day, not 1 days", async () => {
  await goTask(S.obj, S.t1);
  const tile = await panel.evaluate((p) => [...p.shadowRoot.querySelectorAll(".kpi-card")].map((k) => k.textContent.replace(/\s+/g, " ").trim()).find((s) => /WARNING/i.test(s)) ?? "");
  return /\b1 day\b/.test(tile) && !/1 days/.test(tile) ? null : `tile "${tile}"`;
}, async () => { await needActive(); await ws("task/update", { entry_id: S.obj, task_id: S.t1, warning_days: 1 }); await sleep(1000); });
betaStep("card: a paused task says Paused instead of Complete", async () => {
  const item = () => page.locator("maintenance-supporter-card").nth(1).locator(".task-item").filter({ has: page.locator(".task-name", { hasText: exact(T3) }) }).first();
  await go(`/${DASH}`, item);
  const label = (await item().locator(".inert-label").textContent().catch(() => ""))?.trim();
  const complete = await item().locator(".complete-btn, .complete-btn-text").count();
  return eq("label", label, "Paused") || eq("complete actions", complete, 0);
}, async () => { await needT3(); if (!(await task(S.obj, S.t3))?.paused) await ws("task/pause", { entry_id: S.obj, task_id: S.t3 }); await sleep(1000); });
betaStep("card: resumed, the task has its Complete again", async () => {
  const item = () => page.locator("maintenance-supporter-card").nth(1).locator(".task-item").filter({ has: page.locator(".task-name", { hasText: exact(T3) }) }).first();
  await go(`/${DASH}`, item);
  const complete = await item().locator(".complete-btn, .complete-btn-text").count();
  return eq("complete actions", complete, 1);
}, async () => { await needT3(); if ((await task(S.obj, S.t3))?.paused) await ws("task/resume", { entry_id: S.obj, task_id: S.t3 }); await sleep(1000); });
betaStep("the long list shows every row while scrolling (virtual rows)", async () => {
  await goList();
  const expected = await panel.evaluate((p) => p._rowsFiltered(true).length);
  if (expected < 120) return null; // a small household renders every row
  const seen = new Set();
  await page.mouse.move(VP.width / 2, VP.height * 0.7);
  await scrollList(-200_000);
  await sleep(400);
  for (let i = 0; i < 300; i++) {
    for (const n of await panel.evaluate((p) => {
      const sc = p.shadowRoot.querySelector(".content"), vr = sc.getBoundingClientRect();
      return [...p.shadowRoot.querySelectorAll(".task-row:not(.virt-sizer)")].filter((r) => { const b = r.getBoundingClientRect(); return b.bottom > vr.top && b.top < vr.bottom; })
        .map((r) => `${r.querySelector(".cell.object-name")?.textContent.trim()}|${r.querySelector(".cell.task-name")?.textContent.trim()}`);
    })) seen.add(n);
    const [top, max] = await panel.evaluate((p) => { const sc = p.shadowRoot.querySelector(".content"); return [sc.scrollTop, sc.scrollHeight - sc.clientHeight]; });
    if (top >= max - 2 && i > 2) break;
    await scrollList(400);
    await sleep(150);
  }
  return seen.size >= expected ? null : `${seen.size} of ${expected} rows were on screen`;
}, needActive);
betaStep("Today lists an overdue task of the household", async () => {
  await goOverview();
  await tap(panel.locator("ha-tab-group ha-tab, ha-tab-group-tab, ha-tab, .tab, [role=tab]").filter({ hasText: /^\s*Today\s*$/ }).first());
  await sleep(1500);
  const text = await panel.evaluate((p) => p.shadowRoot.querySelector(".today-view, .content")?.textContent || "");
  return text.includes(T1) ? null : "the overdue task is not on Today";
}, async () => { await needActive(); await ws("task/update", { entry_id: S.obj, task_id: S.t1, last_performed: dayOffset(-60) }); await sleep(1000); });
betaStep("settings: Task row actions shows Icons while nobody chose", async () => {
  await goOverview();
  await tap(panel.locator("ha-tab-group ha-tab, ha-tab-group-tab, ha-tab, .tab, [role=tab]").filter({ hasText: /^\s*Settings\s*$/ }).first());
  await sleep(2000);
  const shown = await panel.evaluate((p) => {
    const view = p.shadowRoot.querySelector("maintenance-settings-view");
    const row = [...(view?.shadowRoot ?? view)?.querySelectorAll(".setting-row") ?? []].find((r) => /Task row actions/i.test(r.textContent));
    const sel = row?.querySelector("ms-ha-select, select");
    return sel ? (sel.value ?? null) : null;
  });
  return eq("row actions setting", shown, "icons");
});
betaStep("objects view: the sort dropdown is Home Assistant's", async () => {
  await goList();
  await panel.evaluate((p) => { p._view = "all_objects"; p._objectViewMode = "cards"; });
  await sleep(1200);
  const ha = await panel.locator(".filter-bar ms-ha-select").count();
  const native = await panel.locator(".filter-bar select").count();
  return ha > 0 && native === 0 ? null : `${ha} HA selects, ${native} native`;
});
betaStep("the stats bar counts what the server counts", async () => {
  await goList();
  const shown = await panel.evaluate((p) => [...p.shadowRoot.querySelectorAll(".stats-bar .stat-item")].map((s) => s.textContent.replace(/\s+/g, " ").trim()));
  const st = await ws("statistics");
  const overdue = shown.find((s) => /Overdue/.test(s)) || "";
  return overdue.startsWith(String(st.overdue)) ? null : `stats "${overdue}" vs server ${st.overdue}`;
});
betaStep("complete with a date in the past (yesterday)", async () => {
  await guardGap(S.obj, S.t2);
  await goTask(S.obj, S.t2);
  await tap(panel.locator(".task-header-actions ha-button").filter({ hasText: /^\s*Complete\s*$/ }).first());
  const d = completeDlg();
  await d.locator(".dialog-actions").waitFor({ timeout: 10_000 });
  // "Set date & time", then the moment as HA's date picker hands it to the
  // field (its own value-changed contract; the picker is HA's dialog).
  await tap(d.locator(".backdate-pick").first());
  await d.locator("ms-date-field").first().evaluate((f, v) => f._emit(v), `${dayOffset(-1)}T09:00:00`);
  await sleep(400);
  await tap(d.locator(".dialog-actions ha-button").filter({ hasText: /Complete/ }).last());
  await sleep(1500);
  return until(async () => {
    const h = (await history(S.obj, S.t2)).filter((e) => e.type === "completed");
    return h.some((e) => (e.timestamp || "").startsWith(dayOffset(-1))) ? null : `no completion dated ${dayOffset(-1)}`;
  });
}, needTask("t2", T2, { interval_days: 90 }));
betaStep("Undo from Home Assistant's toast after the row's ✓", async () => {
  await guardGap(S.obj, S.t1);
  const n = (await history(S.obj, S.t1)).length;
  await goObject();
  await tap(panel.locator(".object-tasks .task-row").filter({ hasText: T1 }).first().locator("ha-icon-button.btn-complete").first());
  await completeIn({ notes: "Undo the icon" });
  await undoToast();
  return until(async () => {
    const h = await history(S.obj, S.t1);
    return h.some((e) => e.notes === "Undo the icon") ? "the completion is still in the history" : eq("history length", h.length, n);
  });
}, needActive);
betaStep("the long-word task goes again", async () => {
  await goTask(S.obj, S.word);
  await taskMenu(/^\s*Delete\s*$/);
  await answer(/Delete/);
  return until(async () => ((await task(S.obj, S.word)) ? "still stored" : null));
}, needWord);

// L. The object's end of life
const objState = async () => (await objects()).find((o) => o.entry_id === S.obj)?.object || {};
step("pause the object", async () => {
  await goObject();
  await objectMenu(/^\s*Pause\s*$/);
  await answer(/Pause/);
  return until(async () => ((await objState()).paused ? null : "the object is not paused"));
}, async () => { await needObject(); if ((await objState()).paused) await ws("object/resume", { entry_id: S.obj }); });
step("resume the object", async () => {
  await goObject();
  await objectMenu(/^\s*Resume\s*$/);
  return until(async () => ((await objState()).paused ? "still paused" : null));
}, async () => { await needObject(); if (!(await objState()).paused) await ws("object/pause", { entry_id: S.obj }); });
step("archive the object, then Undo", async () => {
  await goObject();
  await objectMenu(/^\s*Archive/);
  const archived = await until(async () => ((await objState()).archived ? null : "not archived"));
  if (archived) return archived;
  await undoToast();
  return until(async () => ((await objState()).archived ? "Undo left it archived" : null));
}, async () => { await needObject(); if ((await objState()).archived) await ws("object/unarchive", { entry_id: S.obj }); });
// A reload keeps the page (the history entry's state, 2026-11-01); the step
// still opens the task from its object, as before.
step("reload, then the task page shows what is stored", async () => {
  await goTask(S.obj, S.t1);
  await page.reload();
  await panel.locator(".new-menu-button, ha-tab-group, .tab-bar").first().waitFor({ timeout: 60_000 });
  await sleep(1500);
  await goObject();
  await tap(panel.locator(".object-tasks .task-row .cell.task-name").filter({ hasText: exact(T1) }).first());
  await panel.locator(".task-header-actions ha-button").first().waitFor({ timeout: 10_000 });
  await sleep(800);
  const t = await task(S.obj, S.t1);
  const text = (await panel.locator(".task-header").first().textContent()) || "";
  const tab = panel.locator("ha-tab-group ha-tab, ha-tab, .tab, [role=tab]").filter({ hasText: /^\s*History\s*$/ }).first();
  await tap(tab);
  await sleep(800);
  const shown = await panel.locator(".history-timeline .history-entry").count();
  const n = (await history(S.obj, S.t1)).length;
  return (text.includes(T1) ? null : "the name is missing after the reload") || eq("history entries after the reload", shown, n);
}, needT1);
step("delete a task (confirmed, red button)", async () => {
  await goTask(S.obj, S.t1);
  await taskMenu(/^\s*Delete\s*$/);
  const variant = await (await confirmButtons()).last().getAttribute("variant");
  await answer(/Delete/);
  const p = await until(async () => ((await task(S.obj, S.t1)) ? "the task is still stored" : null));
  return p || eq("Delete button variant", variant, "danger");
}, needT1);
step("delete the sub-object", async () => {
  await goObject(S.sub);
  await objectMenu(/^\s*Delete\s*$/);
  await answer(/Delete/);
  return until(async () => ((await objects()).some((o) => o.entry_id === S.sub) ? "the sub-object is still stored" : null), 12_000);
}, async () => {
  await needObject();
  if (!S.sub || !(await objects()).some((o) => o.entry_id === S.sub)) {
    S.sub = (await ws("object/create", { name: SUB_NAME, parent_entry_id: S.obj })).entry_id;
    await sleep(1500);
  }
});
step("delete the object", async () => {
  await goObject();
  await objectMenu(/^\s*Delete\s*$/);
  const variant = await (await confirmButtons()).last().getAttribute("variant");
  await answer(/Delete/);
  const p = await until(async () => ((await objects()).some((o) => o.entry_id === S.obj) ? "the object is still stored" : null), 12_000);
  return p || eq("Delete button variant", variant, "danger");
}, needObject);
step("the overview no longer lists anything of it", async () => {
  await goOverview();
  await panel.evaluate((p) => { p._view = "overview"; p._setOverviewTab("dashboard"); });
  await sleep(1200);
  const text = await panel.evaluate((p) => p.shadowRoot.textContent || "");
  return [OBJ_NAME, SUB_NAME, T1, T3].filter((n) => text.includes(n)).map((n) => `"${n}" still shown`).join("; ") || null;
});

// ── run ──────────────────────────────────────────────────────────────────────
const results = [];
const combo = `${BETA ? "beta" : "classic"} ${BROWSER}/${VP.name}`;
log(`${combo}: ${steps.length} steps against ${HA}, run ${RUN}`);
for (const [i, s] of steps.entries()) {
  const nr = i + 1;
  if (ONLY.length && !ONLY.includes(nr)) continue;
  let problem = null;
  let tries = 0;
  for (; tries < 2; tries++) {
    try {
      if (s.need) await s.need();
      problem = await s.run();
    } catch (e) {
      problem = `error: ${e.message.split("\n")[0]}`;
    }
    if (!problem) break;
    if (SHOTS) await page.screenshot({ path: `${SHOTS}/${String(nr).padStart(2, "0")}-${tries}-${s.name.replace(/[^a-z0-9]+/gi, "-").slice(0, 50)}.png` }).catch(() => {});
    await page.keyboard.press("Escape").catch(() => {});
    await sleep(800);
  }
  results.push({ nr, name: s.name, ok: !problem, problem, retried: tries > 0 && !problem });
  log(`${problem ? "FAIL" : "ok  "} ${String(nr).padStart(2)} ${s.name}${problem ? `  — ${problem}` : tries ? "  (passed on the retry)" : ""}`);
}

await ctx.close().catch(() => {});
await browser.close().catch(() => {});
await ws("global/update", { settings: { ...Object.fromEntries(ADVANCED.map((k) => [k, !!before[k.replace(/^advanced_/, "").replace(/_visible$/, "")]])), advanced_beta_editor_visible: !!before.beta_editor } });
if (!process.env.KEEP) {
  for (const o of ((await ws("objects")).objects || []).filter((o) => o.object?.name === OBJ_NAME || o.object?.name === SUB_NAME)) {
    await ws("object/delete", { entry_id: o.entry_id }).catch(() => {});
  }
}
api.close();
const failed = results.filter((r) => !r.ok);
log(`\n${combo}: ${results.length - failed.length}/${results.length} steps passed${results.some((r) => r.retried) ? ` (${results.filter((r) => r.retried).length} on the retry)` : ""}`);
if (failed.length) log("FAILURES:\n  " + failed.map((r) => `${r.nr} ${r.name}: ${r.problem}`).join("\n  "));
process.exit(failed.length ? 1 : 0);
