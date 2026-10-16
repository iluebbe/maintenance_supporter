/** Live lifecycle consistency check (ha-maint): two throwaway objects walk
 *  through the whole task lifecycle, and after EVERY step every surface must
 *  tell the same story as the WS object payload:
 *
 *   - the 7 per-task entities: status sensor (state + attributes), next-due
 *     and countdown sensors (enabled for the run), overdue binary sensor, the
 *     complete / skip / reset buttons; one shared entity_id prefix per task
 *   - the summary sensors and the statistics WS command (counts recomputed
 *     from the payload of every object)
 *   - todo.maintenance (item per active task, needs-action exactly for the
 *     actionable statuses, due = next due)
 *   - calendar.maintenance_schedule (an event on the next due date for every
 *     active task with one, none for inert tasks)
 *   - the list_tasks service and task/history
 *   - the lifecycle events (completed / skipped / reset), one per action
 *   - with --ui: the panel's object page rows (status pill incl. the derived
 *     "No due date", due text), the task page chip and the Lovelace card
 *
 *  Steps: create (ok, due soon, overdue, manual, one-time, sensor threshold)
 *  → complete with details → double tap → undo → complete again → backdated
 *  completion → skip → postpone → reset → assign → pause / resume task →
 *  sensor trigger → recovery auto-complete → history edit → history delete →
 *  rename task + interval → rename object → archive / unarchive → pause /
 *  resume object → move → duplicate → RESTART HA → delete task → delete
 *  objects. A difference that settles within 25 s counts as eventual
 *  consistency (its settle time is reported); one that stays is a finding.
 *  The run never stops at the first finding — it reports all of them.
 *
 *  node e2e/live-lifecycle-consistency-check.mjs [--ui]
 */
import { execSync } from "node:child_process";
import { chromium } from "@playwright/test";
import { DEEP_SRC, hassTokensInit, loadToken, watchdog, wsClient } from "./ws-client.mjs";

const UI = process.argv.includes("--ui");
const REST = process.env.HA_REST || "http://127.0.0.1:8125";
const HA = process.env.HA_BROWSER || "http://ha-maint:8123";
const CONTAINER = process.env.HA_CONTAINER || "ha-maint";
const PW_WS = "ws://127.0.0.1:3000/";
const SETTLE_MS = 25000;
watchdog(25 * 60e3, "lifecycle consistency check");

const log = (...a) => console.log(...a);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const token = loadToken();
const H = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
const rest = async (path, init = {}) => {
  const r = await fetch(REST + path, { ...init, headers: { ...H, ...(init.headers || {}) } });
  const text = await r.text();
  try { return JSON.parse(text); } catch { return text; }
};

const findings = new Map();   // message -> steps it showed in (inconsistencies that did not settle, failed expectations)
const settles = [];            // [step, ms] for parity that needed time
const finding = (step, msg) => {
  if (!findings.has(msg)) { findings.set(msg, []); log(`  FINDING: ${msg}`); }
  findings.get(msg).push(step);
};
const expect = (step, cond, msg) => { if (cond) log(`  ok: ${msg}`); else finding(step, `expected: ${msg}`); };

let api = await wsClient(REST, token);
const send = (m) => api.send(m);

// ── HA's calendar day ───────────────────────────────────────────────────────
const tz = (await rest("/api/config")).time_zone;
const localDay = (d = new Date()) => new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
const addDays = (iso, n) => { const d = new Date(`${iso}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const today = () => localDay();

// ── events ──────────────────────────────────────────────────────────────────
const EVENT_TYPES = ["maintenance_supporter_task_completed", "maintenance_supporter_task_skipped", "maintenance_supporter_task_reset"];
let events = [];
async function subscribeEvents() {
  for (const et of EVENT_TYPES) await api.subscribe({ type: "subscribe_events", event_type: et }, (ev) => events.push({ type: ev.event_type, data: ev.data }));
}
await subscribeEvents();
const takeEvents = () => { const e = events; events = []; return e; };

// ── state of the world ──────────────────────────────────────────────────────
const stamp = Date.now() % 100000;
const SENSOR = `sensor.lc_${stamp}_pressure`;
const ids = { areaId: null, A: null, B: null, dash: null };
const T = {};               // logical name -> task id
const ourEntries = () => [ids.A, ids.B].filter(Boolean);

const setSensor = (v) => rest(`/api/states/${SENSOR}`, { method: "POST", body: JSON.stringify({ state: String(v), attributes: { unit_of_measurement: "bar", friendly_name: "LC pressure" } }) });

async function objects() { return (await send({ type: "maintenance_supporter/objects" })).objects; }
const taskById = (objs, id) => { for (const o of objs) for (const t of o.tasks || []) if (t.id === id) return { o, t }; return null; };

async function gather() {
  const start = new Date(Date.now() - 400 * 86400e3).toISOString();
  const end = new Date(Date.now() + 800 * 86400e3).toISOString();
  const [objs, reg, states, todo, cal, stats, lists] = await Promise.all([
    objects(),
    send({ type: "config/entity_registry/list" }),
    send({ type: "get_states" }),
    send({ type: "todo/item/list", entity_id: "todo.maintenance" }).then((r) => r.items).catch(() => null),
    rest(`/api/calendars/calendar.maintenance_schedule?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`),
    send({ type: "maintenance_supporter/statistics" }).catch(() => null),
    Promise.all(ourEntries().map((e) => send({ type: "call_service", domain: "maintenance_supporter", service: "list_tasks", service_data: { entry_id: e }, return_response: true }).then((r) => r.response?.tasks || []))).then((x) => x.flat()),
  ]);
  return { objs, reg, states: Object.fromEntries(states.map((s) => [s.entity_id, s])), todo, cal: Array.isArray(cal) ? cal : [], stats, lists };
}

const ACTION = new Set(["overdue", "due_soon", "triggered"]);
const PROBLEM = new Set(["overdue", "triggered"]);
const ACTION_NOW = new Set(["overdue", "triggered"]);
const SUFFIX = { next_due: "_next_due", days_until_due: "_days_until_due", overdue: "_overdue", complete: "_complete", skip: "_skip", reset: "_reset" };

let staticOut = [];
function parity(s) {
  const out = [];
  staticOut = [];
  const ourObjs = s.objs.filter((o) => ourEntries().includes(o.entry_id));
  for (const o of ourObjs) {
    const objPaused = !!o.object?.paused_at;
    for (const t of o.tasks || []) {
      const label = `${t.name}`;
      const inert = !!t.archived || t.enabled === false || !!t.paused || objPaused;
      // registry: 7 entities, one prefix
      const ents = s.reg.filter((e) => e.platform === "maintenance_supporter" && e.unique_id.includes(t.id));
      const kind = (e) => Object.keys(SUFFIX).find((k) => e.unique_id.endsWith("_" + k)) || (e.unique_id.endsWith(t.id) ? "status" : "?");
      const byKind = Object.fromEntries(ents.map((e) => [kind(e), e]));
      if (ents.length !== 7) out.push(`${label}: ${ents.length} registry entities, expected 7 (${ents.map((e) => e.entity_id).join(", ")})`);
      const st = byKind.status;
      if (!st) { out.push(`${label}: no status sensor in the registry`); continue; }
      const base = st.entity_id.replace(/^sensor\./, "");
      for (const [k, suf] of Object.entries(SUFFIX)) {
        const e = byKind[k];
        const dom = k === "overdue" ? "binary_sensor" : ["complete", "skip", "reset"].includes(k) ? "button" : "sensor";
        // naming is static (fixed at registration): reported once, never waited for
        if (e && e.entity_id !== `${dom}.${base}${suf}`) staticOut.push(`${label}: ${k} entity ${e.entity_id} does not share the prefix of ${st.entity_id}`);
      }
      if (t.sensor_entity_id !== st.entity_id) out.push(`${label}: payload sensor_entity_id ${t.sensor_entity_id} ≠ registry ${st.entity_id}`);
      if (byKind.overdue && t.binary_sensor_entity_id !== byKind.overdue.entity_id) out.push(`${label}: payload binary_sensor_entity_id ${t.binary_sensor_entity_id} ≠ registry ${byKind.overdue.entity_id}`);
      // states
      const ss = s.states[st.entity_id];
      if (!ss) out.push(`${label}: status sensor ${st.entity_id} has no state`);
      else {
        if (ss.state !== t.status) out.push(`${label}: status sensor reads ${ss.state}, payload ${t.status}`);
        const a = ss.attributes;
        const same = (x, y) => (x ?? null) === (y ?? null);
        if (!same(a.next_due, t.next_due)) out.push(`${label}: sensor next_due ${a.next_due}, payload ${t.next_due}`);
        if (!same(a.days_until_due, t.days_until_due)) out.push(`${label}: sensor days_until_due ${a.days_until_due}, payload ${t.days_until_due}`);
        if (!same(a.last_performed, t.last_performed)) out.push(`${label}: sensor last_performed ${a.last_performed}, payload ${t.last_performed}`);
        if (!same(a.times_performed, t.times_performed)) out.push(`${label}: sensor times_performed ${a.times_performed}, payload ${t.times_performed}`);
        if (Math.abs((a.total_cost || 0) - (t.total_cost || 0)) > 0.001) out.push(`${label}: sensor total_cost ${a.total_cost}, payload ${t.total_cost}`);
        if (!same(a.responsible_user_id, t.responsible_user_id)) out.push(`${label}: sensor responsible_user_id ${a.responsible_user_id}, payload ${t.responsible_user_id}`);
      }
      const od = byKind.overdue && s.states[byKind.overdue.entity_id];
      if (od && od.state !== (PROBLEM.has(t.status) ? "on" : "off")) out.push(`${label}: overdue binary ${od.state} for status ${t.status}`);
      const nd = byKind.next_due && s.states[byKind.next_due.entity_id];
      if (nd) {
        const want = t.archived || !t.next_due ? null : t.next_due;
        const got = ["unknown", "unavailable"].includes(nd.state) ? null : localDay(new Date(nd.state));
        if (got !== want) out.push(`${label}: next-due sensor ${nd.state} (${got}), payload ${want}`);
      }
      const cd = byKind.days_until_due && s.states[byKind.days_until_due.entity_id];
      if (cd) {
        const want = t.archived || t.days_until_due == null ? null : String(t.days_until_due);
        const got = ["unknown", "unavailable"].includes(cd.state) ? null : String(Number(cd.state));
        if (got !== want) out.push(`${label}: countdown sensor ${cd.state}, payload ${want}`);
      }
      for (const k of ["complete", "skip", "reset"]) {
        const b = byKind[k] && s.states[byKind[k].entity_id];
        if (!b) out.push(`${label}: ${k} button ${byKind[k]?.entity_id} has no state`);
        else if ((b.state === "unavailable") !== inert) out.push(`${label}: ${k} button ${b.state} while the task is ${inert ? "inert" : "active"}`);
      }
      // list_tasks
      if (!t.archived) {
        const row = s.lists.find((r) => r.task_id === t.id);
        if (!row) out.push(`${label}: missing from list_tasks`);
        else {
          for (const f of ["status", "next_due", "days_until_due", "last_performed"]) if ((row[f] ?? null) !== (t[f] ?? null)) out.push(`${label}: list_tasks ${f} ${row[f]}, payload ${t[f]}`);
          if (row.entity_id !== st.entity_id) out.push(`${label}: list_tasks entity_id ${row.entity_id} ≠ ${st.entity_id}`);
        }
      }
      // to-do
      if (s.todo) {
        const item = s.todo.find((i) => i.uid === `${o.entry_id}:${t.id}`);
        if (inert && item) out.push(`${label}: inert task still on the to-do list (${item.status})`);
        if (!inert) {
          if (!item) out.push(`${label}: missing from the to-do list`);
          else {
            const want = ACTION.has(t.status) ? "needs_action" : "completed";
            if (item.status !== want) out.push(`${label}: to-do status ${item.status} for task status ${t.status}`);
            if ((item.due ?? null) !== (t.next_due ?? null)) out.push(`${label}: to-do due ${item.due}, payload next_due ${t.next_due}`);
          }
        }
      }
      // calendar
      const evs = s.cal.filter((e) => (e.summary || "").includes(t.name) && (e.summary || "").includes(`(${o.object.name})`));
      const days = evs.map((e) => e.start?.date || (e.start?.dateTime ? localDay(new Date(e.start.dateTime)) : null)).sort();
      if (inert && evs.length) out.push(`${label}: inert task has calendar events (${days.join(", ")})`);
      // Overdue and triggered tasks sit on today (as in the panel's Calendar
      // tab), everything else on its next due date.
      const calDay = ACTION_NOW.has(t.status) ? localDay() : t.next_due;
      if (!inert && calDay && !days.includes(calDay)) out.push(`${label}: no calendar event on ${calDay} for status ${t.status} (events: ${days.join(", ") || "none"})`);
      if (!inert && calDay && days.some((d) => d !== calDay)) out.push(`${label}: calendar event off ${calDay} (events: ${days.join(", ")})`);
    }
  }
  // summary sensors + statistics vs counts recomputed from the payload
  const counts = { overdue: 0, due_soon: 0, triggered: 0, ok: 0, total_tasks: 0 };
  for (const o of s.objs) for (const t of o.tasks || []) {
    if (!t.archived) counts.total_tasks++;
    if (t.status in counts) counts[t.status]++;
  }
  counts.needs_attention = counts.overdue + counts.due_soon + counts.triggered;
  for (const [k, v] of Object.entries(counts)) {
    const ent = s.states[`sensor.maintenance_supporter_${k}`];
    if (ent && Number(ent.state) !== v) out.push(`summary sensor ${k} reads ${ent.state}, payload counts ${v}`);
    if (s.stats && k in s.stats && Number(s.stats[k]) !== v) out.push(`statistics WS ${k} ${s.stats[k]}, payload counts ${v}`);
  }
  return out;
}

async function checkParity(step) {
  const t0 = Date.now();
  let last = [];
  while (Date.now() - t0 < SETTLE_MS) {
    const s = await gather();
    last = parity(s);
    for (const m of staticOut) finding(step, m);
    if (!last.length) {
      const ms = Date.now() - t0;
      if (ms > 1500) settles.push([step, ms]);
      log(`  parity ok${ms > 1500 ? ` (settled after ${(ms / 1000).toFixed(1)} s)` : ""}`);
      return s;
    }
    await sleep(1500);
  }
  for (const m of last) finding(step, m);
  return gather();
}

// ── UI ──────────────────────────────────────────────────────────────────────
let browser = null, panelPage = null, cardPage = null;
const statusKey = (t) => (t.archived ? "archived" : t.is_done ? "done" : (t.status || "ok") === "ok" && t.schedule_type === "manual" && t.days_until_due == null ? "no_due" : t.status || "ok");
const dueText = (t) => {
  if (t.days_until_due == null) {
    if (!t.last_performed) return "—";
    const d = Math.round((Date.parse(`${today()}T12:00:00Z`) - Date.parse(`${String(t.last_performed).slice(0, 10)}T12:00:00Z`)) / 86400e3);
    return d <= 0 ? "done today" : `done ${d} d ago`;
  }
  const d = t.days_until_due;
  return d < 0 ? `${-d} d overdue` : d === 0 ? "Today" : d === 1 ? "1 day" : `${d} days`;
};
const DOT = { ok: "success-color", due_soon: "warning-color", overdue: "error-color", triggered: "deep-orange-color", paused: "info-color", no_due: "secondary-text-color" };

async function uiOpen() {
  browser = await chromium.connect(PW_WS, { timeout: 30000 });
  const ctx = await browser.newContext({ viewport: { width: 1400, height: 950 } });
  await ctx.addInitScript(hassTokensInit, { t: token, ha: HA });
  panelPage = await ctx.newPage();
  await panelPage.goto(`${HA}/maintenance-supporter`, { waitUntil: "domcontentloaded", timeout: 30000 });
  for (let i = 0; i < 40; i++) {
    await panelPage.waitForTimeout(1000);
    const up = await panelPage.evaluate(`(() => { ${DEEP_SRC}
      window.__panel = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-PANEL")[0];
      return !!window.__panel && (window.__panel._objects || []).length > 0; })()`).catch(() => false);
    if (up) break;
  }
  cardPage = await ctx.newPage();
}

async function uiCardConfig(names) {
  await send({ type: "lovelace/config/save", url_path: ids.dash, config: { views: [{ title: "lc", cards: [{ type: "custom:maintenance-supporter-card", filter_objects: names, show_actions: false }] }] } });
  await cardPage.goto(`${HA}/${ids.dash}/0`, { waitUntil: "domcontentloaded", timeout: 30000 });
}

async function uiCheck(step, s) {
  if (!UI) return;
  const ours = s.objs.filter((o) => ourEntries().includes(o.entry_id));
  const t0 = Date.now();
  let last = [];
  while (Date.now() - t0 < SETTLE_MS) {
    last = [];
    const panel = await panelPage.evaluate(async (entries) => {
      const p = window.__panel;
      const wait = (ms) => new Promise((r) => setTimeout(r, ms));
      const out = {};
      for (const e of entries) {
        p._showObject(e);
        await wait(700);
        for (const r of p.shadowRoot.querySelectorAll(".task-row")) {
          const name = (r.querySelector(".task-name")?.textContent || "").trim().replace(/^#\S+\s*/, "");
          const badge = r.querySelector(".status-badge");
          out[`${e}|${name}`] = { badge: badge ? [...badge.classList].filter((c) => c !== "status-badge").join(" ") : "", due: (r.querySelector(".due-text")?.textContent || "").trim() };
        }
      }
      return out;
    }, ourEntries()).catch((err) => ({ __err: String(err) }));
    if (panel.__err) { last.push(`panel unreadable: ${panel.__err}`); break; }
    for (const o of ours) for (const t of o.tasks || []) {
      if (t.archived) continue;
      const row = Object.entries(panel).find(([k]) => k.startsWith(`${o.entry_id}|`) && k.endsWith(t.name))?.[1];
      if (!row) { last.push(`panel: no row for ${t.name}`); continue; }
      if (row.badge !== statusKey(t)) last.push(`panel: ${t.name} pill ${row.badge}, expected ${statusKey(t)}`);
      if (row.due !== dueText(t)) last.push(`panel: ${t.name} due "${row.due}", expected "${dueText(t)}"`);
    }
    // the card (status dot + due text)
    const card = await cardPage.evaluate(`(() => { ${DEEP_SRC}
      const c = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-CARD")[0];
      if (!c || !c.shadowRoot) return null;
      const out = {};
      for (const r of c.shadowRoot.querySelectorAll(".task-item")) out[r.querySelector(".task-name").textContent.trim()] = { due: r.querySelector(".task-due")?.textContent.trim(), dot: r.querySelector(".status-dot")?.getAttribute("style") || "" };
      return out; })()`).catch(() => null);
    if (!card) last.push("card: not rendered");
    else for (const o of ours) for (const t of o.tasks || []) {
      if (t.archived) continue;
      const row = Object.entries(card).find(([k]) => k.startsWith(t.name))?.[1];
      if (!row) { last.push(`card: no item for ${t.name}`); continue; }
      const key = statusKey(t);
      if (DOT[key] && !row.dot.includes(DOT[key])) last.push(`card: ${t.name} dot "${row.dot}", expected ${DOT[key]}`);
      if (t.status !== "triggered" && row.due !== dueText(t)) last.push(`card: ${t.name} due "${row.due}", expected "${dueText(t)}"`);
    }
    if (!last.length) { log(`  ui ok${Date.now() - t0 > 1500 ? ` (settled after ${((Date.now() - t0) / 1000).toFixed(1)} s)` : ""}`); return; }
    await sleep(2000);
  }
  for (const m of last) finding(step, m);
}

async function uiTaskChips(step, s) {
  if (!UI) return;
  for (const o of s.objs.filter((x) => ourEntries().includes(x.entry_id))) for (const t of o.tasks || []) {
    const chip = await panelPage.evaluate(async ({ e, id }) => {
      const p = window.__panel;
      p._showTask(e, id);
      await new Promise((r) => setTimeout(r, 900));
      const c = p.shadowRoot.querySelector(".status-chip");
      return c ? [...c.classList].filter((x) => x !== "status-chip").join(" ") : null;
    }, { e: o.entry_id, id: t.id }).catch(() => null);
    if (chip !== statusKey(t)) finding(step, `task page: ${t.name} chip ${chip}, expected ${statusKey(t)}`);
  }
  log("  task page chips checked");
}

// ── steps ───────────────────────────────────────────────────────────────────
async function step(name, fn, { ui = true, chips = false } = {}) {
  log(`\n▶ ${name}`);
  let ret;
  try { ret = await fn(); } catch (err) { finding(name, `step failed: ${err?.message || JSON.stringify(err)}`); }
  const s = await checkParity(name);
  if (ui) await uiCheck(name, s);
  if (chips) await uiTaskChips(name, s);
  return { s, ret };
}
const task = async (key) => taskById(await objects(), T[key])?.t;
const evOf = (evs, type, id) => evs.filter((e) => e.type === `maintenance_supporter_${type}` && e.data?.task_id === id).length;

let baselineCounts;
try {
  await setSensor(2.0);
  baselineCounts = (await gather()).stats;
  const area = await send({ type: "config/area_registry/create", name: `LC Area ${stamp}` });
  ids.areaId = area.area_id;
  if (UI) {
    await send({ type: "lovelace/dashboards/create", url_path: `lc-${stamp}`, title: `LC ${stamp}`, mode: "storage", show_in_sidebar: false, require_admin: false });
    ids.dash = `lc-${stamp}`;
    await uiOpen();
  }

  await step("create", async () => {
    ids.A = (await send({ type: "maintenance_supporter/object/create", name: `LC Workshop ${stamp}`, area_id: ids.areaId })).entry_id;
    ids.B = (await send({ type: "maintenance_supporter/object/create", name: `LC Garage ${stamp}` })).entry_id;
    const mk = async (entry, key, data) => { T[key] = (await send({ type: "maintenance_supporter/task/create", entry_id: entry, ...data })).task_id; };
    await mk(ids.A, "ok", { name: "Oil the hinges", interval_days: 30, last_performed: addDays(today(), -10) });
    await mk(ids.A, "soon", { name: "Check the belt", interval_days: 14, warning_days: 7, last_performed: addDays(today(), -10) });
    await mk(ids.A, "over", { name: "Clean the filter", interval_days: 7, last_performed: addDays(today(), -10) });
    await mk(ids.A, "man", { name: "Sharpen the blades", schedule_type: "manual", last_performed: addDays(today(), -23) });
    await mk(ids.A, "once", { name: "Buy a spare fuse", schedule_type: "one_time", due_date: addDays(today(), 5) });
    await mk(ids.A, "sens", { name: "Bleed the compressor", schedule_type: "sensor_based", trigger_config: { type: "threshold", entity_id: SENSOR, entity_ids: [SENSOR], trigger_above: 3, auto_complete_on_recovery: true } });
    await mk(ids.B, "tyres", { name: "Check the tyres", interval_days: 30, last_performed: addDays(today(), -5) });
    // the next-due and countdown twins are disabled by default: enable them for the run
    const reg = await send({ type: "config/entity_registry/list" });
    for (const e of reg.filter((x) => x.platform === "maintenance_supporter" && Object.values(T).some((id) => x.unique_id.includes(id)) && x.disabled_by)) {
      await send({ type: "config/entity_registry/update", entity_id: e.entity_id, disabled_by: null });
    }
    for (const e of ourEntries()) await rest(`/api/config/config_entries/entry/${e}/reload`, { method: "POST" });
    await sleep(4000);
    if (UI) await uiCardConfig([`LC Workshop ${stamp}`, `LC Garage ${stamp}`]);
  }, { chips: true });
  const s0 = await gather();
  const st = (k) => taskById(s0.objs, T[k])?.t;
  expect("create", st("ok")?.status === "ok" && st("ok")?.days_until_due === 20, "Oil the hinges ok, 20 days");
  expect("create", st("soon")?.status === "due_soon", "Check the belt due soon");
  expect("create", st("over")?.status === "overdue" && st("over")?.days_until_due === -3, "Clean the filter 3 d overdue");
  expect("create", st("man")?.status === "ok" && st("man")?.days_until_due == null, "Sharpen the blades ok, no due date");
  expect("create", st("once")?.next_due === addDays(today(), 5), "Buy a spare fuse due in 5 days");
  expect("create", st("sens")?.status === "ok", "Bleed the compressor ok while the pressure is 2 bar");

  takeEvents();
  await step("complete with details", async () => {
    await send({ type: "maintenance_supporter/task/complete", entry_id: ids.A, task_id: T.over, notes: "lifecycle", cost: 12.5, duration: 15 });
  });
  let t = await task("over");
  expect("complete", t.status === "ok" && t.last_performed?.startsWith(today()) && t.next_due === addDays(today(), 7), "Clean the filter ok, done today, next in 7 days");
  expect("complete", Math.abs(t.total_cost - 12.5) < 0.001, "the cost counts");
  let ev = takeEvents();
  expect("complete", evOf(ev, "task_completed", T.over) === 1, `one completed event (${ev.length} events)`);
  const histAfterComplete = t.history.length;

  await step("double tap", async () => {
    const r = await send({ type: "maintenance_supporter/task/complete", entry_id: ids.A, task_id: T.over }).catch((e) => ({ error: e?.code || String(e) }));
    log(`  second completion answered ${JSON.stringify(r)}`);
  }, { ui: false });
  t = await task("over");
  expect("double tap", t.history.length === histAfterComplete, `the second tap adds no history entry (${t.history.length} vs ${histAfterComplete})`);
  ev = takeEvents();
  expect("double tap", evOf(ev, "task_completed", T.over) === 0, `no second completed event (${ev.length})`);

  await step("undo", async () => {
    const r = await send({ type: "maintenance_supporter/task/undo", entry_id: ids.A, task_id: T.over });
    log(`  undo answered ${JSON.stringify(r)}`);
  });
  t = await task("over");
  expect("undo", t.status === "overdue" && t.last_performed?.startsWith(addDays(today(), -10)) && t.history.length === histAfterComplete - 1, "back to overdue, last done 10 days ago, completion gone");
  expect("undo", Math.abs(t.total_cost) < 0.001, "the cost is gone again");
  log(`  events after undo: ${JSON.stringify(takeEvents().map((e) => e.type))}`);

  await step("complete again right after the undo", async () => {
    const r = await send({ type: "maintenance_supporter/task/complete", entry_id: ids.A, task_id: T.over, cost: 8 });
    log(`  answered ${JSON.stringify(r)}`);
  });
  t = await task("over");
  expect("complete again", t.status === "ok" && t.history.length === histAfterComplete, "the redo lands (not swallowed by the double-tap guard)");
  ev = takeEvents();
  expect("complete again", evOf(ev, "task_completed", T.over) === 1, "one completed event");

  const okBefore = await task("ok");
  await step("backdated completion (older than the last one)", async () => {
    await send({ type: "maintenance_supporter/task/complete", entry_id: ids.A, task_id: T.ok, completed_at: `${addDays(today(), -40)}T09:00:00`, cost: 3 });
  });
  t = await task("ok");
  expect("backfill", t.history.length === okBefore.history.length + 1 && t.last_performed === okBefore.last_performed && t.next_due === okBefore.next_due, "history +1, cycle untouched");
  ev = takeEvents();
  const bf = ev.find((e) => e.type === "maintenance_supporter_task_completed" && e.data?.task_id === T.ok);
  expect("backfill", bf?.data?.backfill === true, `the event says backfill (${JSON.stringify(bf?.data?.backfill)})`);

  const soonBefore = await task("soon");
  await step("skip", async () => { await send({ type: "maintenance_supporter/task/skip", entry_id: ids.A, task_id: T.soon, reason: "lifecycle" }); });
  t = await task("soon");
  expect("skip", t.status === "ok" && t.next_due > soonBefore.next_due && t.history.at(-1)?.type === "skipped", `skipped: next due ${soonBefore.next_due} → ${t.next_due}`);
  ev = takeEvents();
  expect("skip", evOf(ev, "task_skipped", T.soon) === 1, "one skipped event");

  await step("postpone", async () => { await send({ type: "maintenance_supporter/task/postpone", entry_id: ids.A, task_id: T.ok, until: addDays(today(), 60) }); });
  t = await task("ok");
  expect("postpone", t.next_due === addDays(today(), 60) && !!t.due_override, "due in 60 days, marked postponed");

  await step("reset", async () => { await send({ type: "maintenance_supporter/task/reset", entry_id: ids.A, task_id: T.ok }); });
  t = await task("ok");
  expect("reset", t.last_performed?.startsWith(today()) && t.next_due === addDays(today(), 30) && !t.due_override, "done today, next in 30 days, postponement cleared");
  ev = takeEvents();
  expect("reset", evOf(ev, "task_reset", T.ok) === 1, "one reset event");

  await step("assign", async () => {
    const me = await send({ type: "auth/current_user" });
    await send({ type: "maintenance_supporter/task/assign_user", entry_id: ids.A, task_id: T.ok, user_id: me.id });
  }, { ui: false });
  t = await task("ok");
  expect("assign", !!t.responsible_user_id, "assigned");

  await step("pause task", async () => { await send({ type: "maintenance_supporter/task/pause", entry_id: ids.A, task_id: T.soon }); });
  t = await task("soon");
  expect("pause task", t.status === "paused" && t.paused, "Check the belt paused");
  await step("resume task", async () => { await send({ type: "maintenance_supporter/task/resume", entry_id: ids.A, task_id: T.soon }); });
  t = await task("soon");
  expect("resume task", t.status !== "paused" && t.next_due === addDays(today(), 14), `fresh cycle from today (next ${t.next_due})`);

  await step("sensor crosses the threshold", async () => { await setSensor(3.6); await sleep(1500); }, { chips: true });
  t = await task("sens");
  expect("trigger", t.status === "triggered" && t.trigger_active, "Bleed the compressor triggered");
  const sensHist = t.history.length;
  takeEvents();
  await step("sensor recovers (auto-complete)", async () => { await setSensor(2.0); await sleep(1500); });
  t = await task("sens");
  expect("recovery", t.status === "ok" && t.history.filter((h) => h.type === "completed").length >= 1 && t.history.length > sensHist, "completed by itself on recovery");
  ev = takeEvents();
  expect("recovery", evOf(ev, "task_completed", T.sens) === 1, `one completed event (${JSON.stringify(ev.map((e) => e.type))})`);

  await step("history edit", async () => {
    const cur = await task("over");
    const last = cur.history.filter((h) => h.type === "completed").at(-1);
    await send({ type: "maintenance_supporter/task/history/update", entry_id: ids.A, task_id: T.over, original_timestamp: last.timestamp, cost: 20, notes: "edited" });
  });
  t = await task("over");
  expect("history edit", Math.abs(t.total_cost - 20) < 0.001 && t.history.filter((h) => h.type === "completed").at(-1)?.notes === "edited", "cost and note corrected");

  await step("history delete", async () => {
    const cur = await task("over");
    const last = cur.history.filter((h) => h.type === "completed").at(-1);
    await send({ type: "maintenance_supporter/task/history/delete", entry_id: ids.A, task_id: T.over, timestamp: last.timestamp });
  });
  t = await task("over");
  expect("history delete", t.status === "overdue" && t.last_performed?.startsWith(addDays(today(), -10)), `last done re-derived (${t.last_performed}), overdue again`);

  await step("rename task + change the interval", async () => {
    await send({ type: "maintenance_supporter/task/update", entry_id: ids.A, task_id: T.man, name: "Sharpen the blades now" });
    await send({ type: "maintenance_supporter/task/update", entry_id: ids.A, task_id: T.ok, interval_days: 60 });
  });
  t = await task("ok");
  expect("rename task", t.next_due === addDays(today(), 60), "Oil the hinges now every 60 days");
  expect("rename task", (await task("man")).name === "Sharpen the blades now", "renamed");

  await step("rename object", async () => {
    await send({ type: "maintenance_supporter/object/update", entry_id: ids.A, name: `LC Workshop renamed ${stamp}` });
    await sleep(3000);
    if (UI) await uiCardConfig([`LC Workshop renamed ${stamp}`, `LC Garage ${stamp}`]);
  }, { chips: true });

  await step("archive task", async () => { await send({ type: "maintenance_supporter/task/archive", entry_id: ids.A, task_id: T.once }); });
  expect("archive", (await task("once")).archived === true, "Buy a spare fuse archived");
  await step("unarchive task", async () => { await send({ type: "maintenance_supporter/task/unarchive", entry_id: ids.A, task_id: T.once }); });
  expect("unarchive", !(await task("once")).archived, "back");

  await step("pause object", async () => { await send({ type: "maintenance_supporter/object/pause", entry_id: ids.B }); });
  expect("pause object", (await task("tyres")).status === "paused", "Check the tyres paused with its object");
  await step("resume object", async () => { await send({ type: "maintenance_supporter/object/resume", entry_id: ids.B }); });
  t = await task("tyres");
  expect("resume object", t.status === "ok" && t.next_due === addDays(today(), 30), `fresh cycle (next ${t.next_due})`);

  await step("move task to the other object", async () => {
    await send({ type: "maintenance_supporter/task/move", entry_id: ids.B, task_id: T.tyres, target_entry_id: ids.A });
    await sleep(3000);
  }, { chips: true });
  const moved = taskById(await objects(), T.tyres);
  expect("move", moved?.o.entry_id === ids.A, "Check the tyres now on the workshop");
  const stale = (await send({ type: "config/entity_registry/list" })).filter((e) => e.unique_id.includes(T.tyres) && e.config_entry_id === ids.B);
  expect("move", stale.length === 0, `no entities left on the old object (${stale.length})`);

  await step("duplicate task", async () => {
    const r = await send({ type: "maintenance_supporter/task/duplicate", entry_id: ids.A, task_id: T.ok });
    T.dup = r.task_id;
    await sleep(3000);
  });
  expect("duplicate", !!T.dup && !!(await task("dup")), "a copy exists");

  // ── restart ──
  const before = Object.fromEntries((await objects()).filter((o) => ourEntries().includes(o.entry_id)).flatMap((o) => o.tasks.map((x) => [x.id, { status: x.status, next_due: x.next_due, last: x.last_performed, hist: x.history.length, cost: x.total_cost }])));
  await step("restart Home Assistant", async () => {
    try { api.close(); } catch { /* ignore */ }
    execSync(`docker restart ${CONTAINER}`, { stdio: "ignore", env: { ...process.env, MSYS_NO_PATHCONV: "1" } });
    for (let i = 0; i < 120; i++) {
      const code = await fetch(REST + "/api/", { headers: H }).then((r) => r.status).catch(() => 0);
      if (code === 200) break;
      await sleep(2000);
    }
    for (let i = 0; i < 60; i++) {
      try {
        api = await wsClient(REST, token);
        const objs = (await api.send({ type: "maintenance_supporter/objects" })).objects;
        if (ourEntries().every((e) => objs.some((o) => o.entry_id === e && (o.tasks || []).every((x) => x.status)))) break;
        api.close();
      } catch { /* not up yet */ }
      await sleep(2000);
    }
    events = [];
    await subscribeEvents();
    await sleep(5000);
    if (UI) {
      await panelPage.reload({ waitUntil: "domcontentloaded" });
      for (let i = 0; i < 40; i++) {
        await panelPage.waitForTimeout(1000);
        const up = await panelPage.evaluate(`(() => { ${DEEP_SRC}
          window.__panel = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-PANEL")[0];
          return !!window.__panel && (window.__panel._objects || []).length > 0; })()`).catch(() => false);
        if (up) break;
      }
      await cardPage.reload({ waitUntil: "domcontentloaded" });
      await cardPage.waitForTimeout(4000);
    }
  }, { chips: true });
  const after = Object.fromEntries((await objects()).filter((o) => ourEntries().includes(o.entry_id)).flatMap((o) => o.tasks.map((x) => [x.id, { status: x.status, next_due: x.next_due, last: x.last_performed, hist: x.history.length, cost: x.total_cost }])));
  for (const [id, b] of Object.entries(before)) {
    const a = after[id];
    expect("restart", JSON.stringify(a) === JSON.stringify(b), `task ${Object.keys(T).find((k) => T[k] === id)} unchanged by the restart${JSON.stringify(a) === JSON.stringify(b) ? "" : ` (${JSON.stringify(b)} → ${JSON.stringify(a)})`}`);
  }

  await step("delete task", async () => { await send({ type: "maintenance_supporter/task/delete", entry_id: ids.A, task_id: T.dup }); await sleep(3000); });
  const leftovers = (await send({ type: "config/entity_registry/list" })).filter((e) => e.unique_id.includes(T.dup));
  expect("delete task", leftovers.length === 0, `no entities left for the deleted task (${leftovers.map((e) => e.entity_id).join(", ")})`);
  const st2 = await send({ type: "get_states" });
  expect("delete task", !st2.some((x) => leftovers.some((e) => e.entity_id === x.entity_id)), "no states left");
} catch (err) {
  finding("run", `aborted: ${err?.stack || err?.message || JSON.stringify(err)}`);
} finally {
  log("\n▶ cleanup");
  try {
    for (const e of ourEntries()) await send({ type: "maintenance_supporter/object/delete", entry_id: e }).catch((x) => log("  delete failed", JSON.stringify(x)));
    await sleep(3000);
    const reg = await send({ type: "config/entity_registry/list" });
    const left = reg.filter((e) => Object.values(T).some((id) => e.unique_id.includes(id)));
    expect("delete objects", left.length === 0, `no entities left for any of our tasks (${left.map((e) => e.entity_id).join(", ")})`);
    const devs = await send({ type: "config/device_registry/list" });
    expect("delete objects", !devs.some((d) => ourEntries().some((e) => (d.config_entries || []).includes(e))), "no devices left");
    const todo = (await send({ type: "todo/item/list", entity_id: "todo.maintenance" })).items;
    expect("delete objects", !todo.some((i) => ourEntries().some((e) => i.uid.startsWith(e))), "no to-do items left");
    const stats = await send({ type: "maintenance_supporter/statistics" }).catch(() => null);
    if (stats && baselineCounts) expect("delete objects", stats.total_tasks === baselineCounts.total_tasks, `task total back to ${baselineCounts.total_tasks} (${stats.total_tasks})`);
    if (ids.areaId) await send({ type: "config/area_registry/delete", area_id: ids.areaId }).catch(() => {});
    await rest(`/api/states/${SENSOR}`, { method: "DELETE" });
    if (ids.dash) {
      const ds = await send({ type: "lovelace/dashboards/list" });
      const d = (ds || []).find((x) => x.url_path === ids.dash);
      if (d) await send({ type: "lovelace/dashboards/delete", dashboard_id: d.id });
    }
  } catch (err) { log("  cleanup error", err?.message || err); }
  if (browser) await browser.close().catch(() => {});
  log("\n════ RESULT ════");
  if (settles.length) log(`eventual consistency (settled): ${settles.map(([s, ms]) => `${s} ${(ms / 1000).toFixed(1)} s`).join("; ")}`);
  if (findings.size) {
    log(`${findings.size} FINDING(S):`);
    for (const [f, steps] of findings) log(`  - ${f}
      in: ${[...new Set(steps)].join(", ")}`);
  } else log("ALL SURFACES CONSISTENT");
  try { api.close(); } catch { /* ignore */ }
  process.exit(findings.size ? 1 : 0);
}
