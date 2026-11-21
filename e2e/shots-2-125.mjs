/** The docs pictures of 2.125 on the seeded demo, dark theme:
 *
 *  - task-rotation-weekday.png (D#284): the task editor's people row with a
 *    rotation by weekday, one row of weekday chips per person.
 *  - task-upcoming-turns.png (D#284): the task page's *Next turns*.
 *  - calendar-turns.png (D#284): the calendar as Anna sees it with *My
 *    tasks*: only her days of the daily task (of its next five dates, the calendar's
 *    cap per task).
 *  - task-todo-lists.png (#273): the editor's to-do row, naming the object's
 *    list and the list of the person whose turn it is.
 *  - settings-todo-person-lists.png (#273): Settings, the people's own lists.
 *  - settings-quiet-weekend.png (D#277): quiet hours with other times on
 *    Saturday and Sunday.
 *  - task-idle-trigger.png (D#275): a rule that waits for seven quiet days.
 *
 *  The objects "Cat" and "Front Gate", the to-do lists Pets, Anna and Ben, a
 *  gate latch state and the settings these pictures need are put on the demo
 *  before the browser opens and taken off again in the finally, so the other
 *  scripts keep the demo they know.
 *  Prereqs: seeded ha-shots (restarted after backend changes) +
 *  playwright-server running. Some pictures only: node shots-2-125.mjs calendar-turns.png,task-todo-lists.png */
import { chromium } from "@playwright/test";
import { haLogin, watchdog, wsClient } from "./ws-client.mjs";

const REST = "http://127.0.0.1:8131", HA = "http://ha-shots:8123", PW_WS = "ws://127.0.0.1:3000/";
const OUT = new URL("../docs/images/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const D = "maintenance_supporter";
const CAT = "Cat", GATE = "Front Gate", LATCH = "binary_sensor.gate_latch";
const LISTS = ["Pets", "Anna", "Ben"];
const log = (...a) => console.log(...a);
const only = process.argv[2];
const want = (name) => !only || only.split(",").includes(name);
watchdog(10 * 60e3, "2.125 shots");

const DEEP = `const deep = (pred) => { const st=[document.documentElement]; const o=[]; let n=0;
  while (st.length && n < 80000) { const el = st.pop(); n++; if (!el) continue;
    if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
    for (const k of (el.children || [])) st.push(k); } return o; };
  window.__deep = deep;
  window.__panel = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-PANEL")[0];
  window.__dialog = () => deep((el) => el.tagName === "MAINTENANCE-TASK-DIALOG")[0];
  window.__settings = () => deep((el) => el.tagName === "MAINTENANCE-SETTINGS-VIEW")[0];
  window.__calendar = () => deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-CALENDAR-CARD")[0];`;

const token = await haLogin(REST, { user: "demo", pass: "demo-pass-1", cid: HA + "/" });
const api = await wsClient(REST, token);
const hdr = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
const j = (r) => r.json();
const failures = [];
const pause = (ms) => new Promise((r) => setTimeout(r, ms));
const daysAgo = (n) => new Date(Date.now() - n * 864e5).toISOString().slice(0, 10);
const objects = async () => (await api.send({ type: `${D}/objects` })).objects || [];
const slug = (name) => "todo." + name.toLowerCase();

/** The settings these pictures change, as they were (put back in the finally). */
const SETTING_KEYS = {
  general: ["notifications_enabled", "notify_service", "todo_person_lists"],
  notifications: ["quiet_hours_enabled", "quiet_hours_start", "quiet_hours_end", "quiet_hours_weekend_enabled",
    "quiet_hours_weekend_start", "quiet_hours_weekend_end", "quiet_hours_weekend_days"],
};
let settingsWas = null;

async function unseed() {
  for (const o of (await objects()).filter((x) => [CAT, GATE].includes(x.object?.name))) {
    await api.send({ type: `${D}/object/delete`, entry_id: o.entry_id });
  }
  if (settingsWas) await api.send({ type: `${D}/global/update`, settings: settingsWas });
  const entries = await fetch(`${REST}/api/config/config_entries/entry?domain=local_todo`, { headers: hdr }).then(j).catch(() => []);
  for (const e of entries.filter((x) => LISTS.includes(x.title))) {
    await fetch(`${REST}/api/config/config_entries/entry/${e.entry_id}`, { method: "DELETE", headers: hdr });
  }
  await fetch(`${REST}/api/states/${LATCH}`, { method: "DELETE", headers: hdr }).catch(() => {});
}

// After a restart our commands arrive some seconds after HA's API.
for (let i = 0; i < 45; i++) {
  try { await api.send({ type: `${D}/objects` }); break; } catch { await pause(2000); }
}

// ── Seed, all before the browser (a WS call after the page opens hangs) ──
const ids = {};
try {
  await unseed(); // a crashed earlier run
  await pause(1500);
  const users = ((await api.send({ type: `${D}/users/list` })).users || []).filter((u) => !u.system_generated);
  ids.anna = users.find((u) => u.name === "Anna")?.id;
  ids.ben = users.find((u) => u.name === "Ben")?.id;
  if (!ids.anna || !ids.ben) throw new Error("the demo has no Anna and Ben");

  for (const name of LISTS) {
    const flow = await fetch(`${REST}/api/config/config_entries/flow`, { method: "POST", headers: hdr,
      body: JSON.stringify({ handler: "local_todo", show_advanced_options: false }) }).then(j);
    const done = await fetch(`${REST}/api/config/config_entries/flow/${flow.flow_id}`, { method: "POST", headers: hdr,
      body: JSON.stringify({ todo_list_name: name }) }).then(j);
    if (done.type !== "create_entry") throw new Error(`to-do list ${name}: ${done.type}`);
  }
  await pause(2000);
  const states = await fetch(`${REST}/api/states`, { headers: hdr }).then(j);
  for (const name of LISTS) if (!states.some((s) => s.entity_id === slug(name))) throw new Error(`no ${slug(name)}`);

  const now = await api.send({ type: `${D}/settings` });
  settingsWas = {};
  for (const keys of Object.values(SETTING_KEYS)) for (const k of keys) settingsWas[k] = now.general?.[k] ?? now.notifications?.[k];
  settingsWas.todo_person_lists = settingsWas.todo_person_lists ?? {};
  await api.send({ type: `${D}/global/update`, settings: {
    todo_person_lists: { [ids.anna]: slug("Anna"), [ids.ben]: slug("Ben") },
    notifications_enabled: true, notify_service: "notify.persistent_notification",
    quiet_hours_enabled: true, quiet_hours_start: "22:00", quiet_hours_end: "07:00",
    quiet_hours_weekend_enabled: true, quiet_hours_weekend_start: "23:30", quiet_hours_weekend_end: "09:30",
    quiet_hours_weekend_days: [5, 6],
  } });

  // Anna feeds the cat Monday, Wednesday, Friday and Sunday; Ben the other days.
  ids.cat = (await api.send({ type: `${D}/object/create`, name: CAT, mirror_todo_entities: [slug("Pets")] })).entry_id;
  await pause(1500);
  const days = [0, 1, 2, 3, 4, 5, 6].map((d) => (d % 2 === 0 ? ids.anna : ids.ben));
  ids.catTask = (await api.send({
    type: `${D}/task/create`, entry_id: ids.cat, name: "Feed the cat", task_type: "custom",
    schedule_type: "time_based", interval_days: 1, warning_days: 0, last_performed: daysAgo(1),
    assignee_pool: [ids.anna, ids.ben], rotation_strategy: "by_weekday", weekday_assignees: days,
  })).task_id;

  await fetch(`${REST}/api/states/${LATCH}`, { method: "POST", headers: hdr,
    body: JSON.stringify({ state: "off", attributes: { device_class: "lock", friendly_name: "Gate latch" } }) });
  ids.gate = (await api.send({ type: `${D}/object/create`, name: GATE })).entry_id;
  await pause(1500);
  ids.gateTask = (await api.send({
    type: `${D}/task/create`, entry_id: ids.gate, name: "Check the Latch", task_type: "inspection", schedule_type: "sensor_based",
    trigger_config: { type: "idle", entity_id: LATCH, entity_ids: [LATCH], trigger_idle_days: 7, trigger_idle_mode: "no_change" },
  })).task_id;
  await pause(3000);
  if (!ids.catTask || !ids.gateTask) throw new Error("a task was not made");
  log("SEED", JSON.stringify(ids));
} catch (e) {
  log("FAIL seed", String(e && e.message || e).slice(0, 200));
  failures.push("seed");
}

const b = await chromium.connect(PW_WS, { timeout: 20000 });
const ctx = await b.newContext({ viewport: { width: 1600, height: 1000 }, colorScheme: "dark" });
// F5 keeps the panel's page since 2.116 (history state); every visit here starts fresh.
await ctx.addInitScript(() => { try { history.replaceState(null, ""); } catch { /* ignore */ } });
await ctx.addInitScript(({ t, ha }) => {
  localStorage.setItem("hassTokens", JSON.stringify({
    access_token: t, token_type: "Bearer", expires_in: 1800,
    hassUrl: ha, clientId: ha + "/", expires: Date.now() + 9e11, refresh_token: "",
  }));
  localStorage.setItem("msp-overview-tab", '"dashboard"');
}, { t: token, ha: HA });
const p = await ctx.newPage();
// What each check saw, for the log.
p.on("console", (m) => { if (/^(weekday rows|next turns|calendar|to-do field|person rows|weekend rows|idle days)/.test(m.text())) log("  page:", m.text()); });

async function openPanel() {
  await p.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded" });
  for (let i = 0; i < 30; i++) {
    await p.waitForTimeout(1000);
    const ok = await p.evaluate(({ d, id }) => {
      eval(d);
      return !!window.__panel && Array.isArray(window.__panel._objects) && window.__panel._objects.some((o) => o.entry_id === id);
    }, { d: DEEP, id: ids.gate }).catch(() => false);
    if (ok) break;
  }
  await p.waitForTimeout(1200);
}

/** The box around the elements the finder returns, with a margin, across the panel's width. */
async function clipOf(finder) {
  return p.evaluate(({ d, finder }) => {
    eval(d);
    const r = window.__panel.getBoundingClientRect();
    // eslint-disable-next-line no-new-func
    const found = new Function("return (" + finder + ")()")();
    const els = (Array.isArray(found) ? found : [found]).filter(Boolean);
    const boxes = els.map((el) => el.getBoundingClientRect());
    const top = Math.min(...boxes.map((x) => x.top)), bottom = Math.max(...boxes.map((x) => x.bottom));
    const y = Math.max(0, top - 16);
    return { x: Math.max(0, r.x), y, width: Math.min(r.width, 1600), height: Math.min(bottom - top + 32, innerHeight - y) };
  }, { d: DEEP, finder });
}

async function shoot(name, prepare, { verify, clip } = {}) {
  if (!want(name) || !ids.gateTask) return;
  log("STEP", name);
  try {
    await openPanel();
    await p.evaluate(prepare, { d: DEEP, ids });
    await p.waitForTimeout(2000);
    const ok = verify ? await p.evaluate(verify, { d: DEEP, ids }) : true;
    if (!ok) throw new Error("what the picture is about did not render");
    await p.screenshot({ path: OUT + name, ...(clip ? { clip: await clipOf(clip) } : {}) });
    log("SHOT", name);
  } catch (e) {
    failures.push(name);
    log("FAIL", name, String(e && e.message || e).slice(0, 200));
  }
}

/** Opens a task in the editor with one rule row selected (the new look shows
 *  a rule as a sentence; its fields render for the selected row only). */
const editorAt = (entryKey, taskKey, row, anchor) => `async ({ d, ids }) => {
  eval(d);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const panel = window.__panel;
  const obj = panel._objects.find((o) => o.entry_id === ids.${entryKey});
  const dlg = panel.shadowRoot.querySelector("maintenance-task-dialog") || (await panel._ui("maintenance-task-dialog"));
  await dlg.openEdit(ids.${entryKey}, obj.tasks.find((t) => t.id === ids.${taskKey}));
  await sleep(600);
  dlg._ruleSel = "${row}";
  for (let i = 0; i < 30 && !dlg.shadowRoot.querySelector("${anchor}"); i++) await sleep(300);
  await sleep(600);
  dlg.shadowRoot.querySelector("${anchor}")?.scrollIntoView({ block: "center" });
}`;
// eslint-disable-next-line no-new-func
const fn = (src) => new Function("return " + src)();

const openSettings = async ({ d }) => {
  eval(d);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  window.__panel._setOverviewTab("settings");
  await window.__panel.updateComplete;
  for (let i = 0; i < 30 && !window.__settings()?._settings; i++) await sleep(300);
  await sleep(800);
};

try {
  // 1. The people row: a day belongs to one person, a click moves it.
  await shoot("task-rotation-weekday.png", fn(editorAt("cat", "catTask", "people", ".weekday-rotation")), {
    verify: ({ d }) => {
      eval(d);
      const dlg = window.__dialog();
      const rows = dlg?.shadowRoot?.querySelectorAll(".weekday-rotation-row") || [];
      const names = [...rows].map((r) => r.querySelector(".weekday-rotation-name")?.textContent.trim());
      console.log("weekday rows:", names.join(", "));
      return dlg && dlg._open !== false && rows.length === 2 && names.includes("Anna") && names.includes("Ben");
    },
  });

  // 2. The task page: whose turn the coming dates are.
  await shoot("task-upcoming-turns.png", async ({ d, ids }) => {
    eval(d);
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    window.__panel._showTask(ids.cat, ids.catTask);
    for (let i = 0; i < 30 && !window.__deep((el) => el.classList?.contains("upcoming-turns"))[0]; i++) await sleep(300);
  }, {
    verify: ({ d }) => {
      eval(d);
      const box = window.__deep((el) => el.classList?.contains("upcoming-turns"))[0];
      const names = [...(box?.querySelectorAll(".upcoming-turn-name") || [])].map((n) => n.textContent.trim());
      console.log("next turns:", names.join(", "));
      return names.length >= 3 && names.includes("Anna") && names.includes("Ben");
    },
  });

  // 3. The calendar, filtered to Anna: her days of the daily task only.
  await shoot("calendar-turns.png", async ({ d, ids }) => {
    eval(d);
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    window.__panel._setOverviewTab("calendar");
    await window.__panel.updateComplete;
    for (let i = 0; i < 30 && !window.__calendar(); i++) await sleep(300);
    const cal = window.__calendar();
    // As Anna sees it: *My tasks* reads the signed-in person (the demo signs
    // in as Demo), so the card gets Anna's hass for this picture.
    const fake = { ...cal.hass, user: { ...cal.hass.user, id: ids.anna, name: "Anna" } };
    Object.defineProperty(cal, "hass", { get: () => fake, set: () => {}, configurable: true });
    cal._windowDays = 7;
    cal._userFilter = "current_user";
    cal.requestUpdate();
    await cal.updateComplete;
  }, {
    // The toolbar and the week: the daily task on Anna's four days.
    clip: "() => { const sr = window.__calendar().shadowRoot; return [sr.querySelector('.cal-user-filter').parentElement, ...sr.querySelectorAll('.cal-day-row')]; }",
    verify: ({ d }) => {
      eval(d);
      const cal = window.__calendar();
      const text = cal?.shadowRoot?.textContent || "";
      const n = text.split("Feed the cat").length - 1;
      const select = cal?.shadowRoot?.querySelector(".cal-user-filter");
      console.log("calendar:", !!cal, "filter", select?.selectedOptions?.[0]?.textContent, "days", cal?._windowDays, "| Feed the cat on Anna's days:", n);
      // Anna has four days of every week (Monday, Wednesday, Friday and
      // Sunday): all of them show, not only those among the task's next five dates.
      return n === 4 && select?.value === "current_user";
    },
  });

  // 4. The to-do row: the object's list, and the list of whoever's turn it is.
  await shoot("task-todo-lists.png", fn(editorAt("cat", "catTask", "todo", ".mirror-todo-field")), {
    verify: ({ d }) => {
      eval(d);
      const sr = window.__dialog()?.shadowRoot;
      const field = sr?.querySelector(".mirror-todo-field")?.textContent.replace(/\s+/g, " ") || "";
      const people = sr?.querySelector(".mirror-todo-people")?.textContent.replace(/\s+/g, " ") || "";
      console.log("to-do field:", field.slice(0, 120), "| people:", people.trim());
      return /This object's lists: Pets/.test(field) && /(Anna|Ben)/.test(people);
    },
  });

  // 5. Settings: each person's own list.
  await shoot("settings-todo-person-lists.png", openSettings, {
    clip: "() => [window.__settings().shadowRoot.querySelector('.todo-person-lists'), ...window.__settings().shadowRoot.querySelectorAll('.todo-person-list')]",
    verify: ({ d }) => {
      eval(d);
      const sr = window.__settings()?.shadowRoot;
      sr?.querySelector(".todo-person-lists")?.scrollIntoView({ block: "center" });
      const rows = [...(sr?.querySelectorAll(".todo-person-list") || [])].map((r) => r.textContent.replace(/\s+/g, " ").trim().slice(0, 40));
      console.log("person rows:", rows.join(" | "));
      return rows.length >= 2;
    },
  });

  // 6. Quiet hours with other times on Saturday and Sunday.
  await shoot("settings-quiet-weekend.png", openSettings, {
    clip: `() => { const sr = window.__settings().shadowRoot; const t = sr.querySelector('.quiet-weekend-toggle');
      const before = []; let el = t; for (let i = 0; i < 3 && el; i++) { el = el.previousElementSibling; if (el) before.push(el); }
      return [...before, t, ...sr.querySelectorAll('.quiet-weekend-row'), sr.querySelector('.quiet-weekend-hint')]; }`,
    verify: ({ d }) => {
      eval(d);
      const sr = window.__settings()?.shadowRoot;
      sr?.querySelector(".quiet-weekend-toggle")?.scrollIntoView({ block: "center" });
      const rows = sr?.querySelectorAll(".quiet-weekend-row").length || 0;
      console.log("weekend rows:", rows);
      return rows >= 3 && !!sr.querySelector(".quiet-weekend-hint");
    },
  });

  // 7. A rule that waits for seven quiet days.
  await shoot("task-idle-trigger.png", fn(editorAt("gate", "gateTask", "trigger", ".idle-days")), {
    verify: ({ d }) => {
      eval(d);
      const sr = window.__dialog()?.shadowRoot;
      const days = sr?.querySelector(".idle-days");
      console.log("idle days:", days?.value, "| mode row:", !!sr?.querySelector(".idle-mode"));
      return String(days?.value) === "7" && !!sr.querySelector(".idle-mode");
    },
  });
} finally {
  await ctx.close().catch(() => {});
  await unseed().catch((e) => log("FAIL unseed", String(e && e.message || e).slice(0, 200)));
}

api.close();
await b.close();
if (failures.length) {
  console.error("FAILED:", failures.join(", "));
  process.exit(1);
}
process.exit(0);
