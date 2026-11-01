/** The beta task editor with Home Assistant's own pickers, for real (no
 * value-changed shortcuts): every picker in a row's sidebar is opened by a
 * click, searched by typing, its option tapped — then the task is saved and
 * read back over WS. The sidebar is a scroll box: a picker list it clipped
 * would make that setting unreachable, a regression against the classic form.
 * Every check runs in the beta AND in the classic dialog (MODES), so a picker
 * that fails in both is Home Assistant's, one that fails in the beta only is
 * ours.
 *
 * Pickers: the trigger's entities, the environment sensor, "Done when" and
 * its state, the completion action and its target, the task and notification
 * icons, the to-do list, the last-performed date (HA's date dialog), the
 * calendar of a calendar schedule and the time of day.
 *
 * Usage (restart playwright-server first, wedge prevention):
 *   HA_REST=http://127.0.0.1:8133 HA_BROWSER=http://ha-212:8123 HA_USER=demo HA_PASS=… \
 *     node e2e/live-beta-editor-pickers.mjs
 *   BROWSERS=chromium VIEWPORTS=desktop-1440 MODES=beta SHOTS_DIR=… KEEP=1
 */
import { createRequire } from "module";
import { hassTokensInit, loadToken, onboardOrLogin, watchdog, wsClient } from "./ws-client.mjs";
import { contextOptions, pickDevices, tapLands } from "./layout-sweep-kit.mjs";

const require = createRequire(new URL("../custom_components/maintenance_supporter/frontend-src/package.json", import.meta.url));
const pw = require("playwright");

const REST = process.env.HA_REST || "http://127.0.0.1:8125";
const HA = process.env.HA_BROWSER || "http://ha-maint:8123";
const D = "maintenance_supporter";
const SHOTS = process.env.SHOTS_DIR || "";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (...a) => console.log(...a);
watchdog(Number(process.env.WATCHDOG_MS || 3_600_000), "beta editor picker check");

const VIEWPORTS = pickDevices(process.env.VIEWPORTS || "desktop-1440,phone-390");
const BROWSERS = (process.env.BROWSERS || "chromium,webkit").split(",");
const MODES = (process.env.MODES || "beta,classic").split(",");
const ADVANCED = ["adaptive", "beta_editor", "checklists", "completion_actions", "environmental", "schedule_time", "seasonal"].map((k) => `advanced_${k}_visible`);

const token = process.env.HA_USER
  ? await onboardOrLogin(REST, { user: process.env.HA_USER, pass: process.env.HA_PASS, cid: REST + "/" })
  : loadToken();
const api = await wsClient(REST, token);
const before = (await api.send({ type: `${D}/settings` })).features || {};
await api.send({ type: `${D}/global/update`, settings: Object.fromEntries(ADVANCED.map((k) => [k, true])) });

// ── what the pickers will choose: entities of this HA ─────────────────────
const states = await api.send({ type: "get_states" });
const byId = Object.fromEntries(states.map((s) => [s.entity_id, s]));
const name = (id) => byId[id]?.attributes?.friendly_name || id;
const first = (pred) => states.find(pred)?.entity_id;
const NUM = first((s) => s.entity_id.startsWith("sensor.") && typeof s.attributes.unit_of_measurement === "string" && Number.isFinite(Number(s.state)));
const ENV = first((s) => s.entity_id.startsWith("sensor.") && s.attributes.device_class === "temperature" && s.entity_id !== NUM) || NUM;
const BIN = first((s) => s.entity_id.startsWith("binary_sensor.") && ["on", "off"].includes(s.state));
const TODO = first((s) => s.entity_id.startsWith("todo.") && !s.entity_id.includes("maintenance"));
const CAL = first((s) => s.entity_id.startsWith("calendar.") && !s.entity_id.includes("maintenance"));
const COUNTER = first((s) => s.entity_id.startsWith("counter."));
const today = new Date();
const TODAY = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
log(`entities: NUM=${NUM} ENV=${ENV} BIN=${BIN} TODO=${TODO} CAL=${CAL} COUNTER=${COUNTER}`);

const NAME = "Beta picker check washer";
for (const o of ((await api.send({ type: `${D}/objects` })).objects || []).filter((o) => o.object?.name === NAME)) {
  await api.send({ type: `${D}/object/delete`, entry_id: o.entry_id });
}
const OBJ = (await api.send({ type: `${D}/object/create`, name: NAME })).entry_id;
await sleep(2000);

const results = [];
const failures = [];
const record = (combo, what, problem) => {
  results.push({ combo, what, ok: !problem });
  if (problem) failures.push(`${combo} ${what}: ${problem}`);
  log(`${problem ? "FAIL" : "ok  "} ${combo.padEnd(28)} ${what}${problem ? "  — " + problem : ""}`);
};

/** The element that has focus, through shadow roots. */
const deepFocus = (page) => page.evaluate(() => {
  let a = document.activeElement;
  while (a?.shadowRoot?.activeElement) a = a.shadowRoot.activeElement;
  return a ? a.localName : null;
});

// Options inside an OPEN list only: a picker field shows its current value
// with the same ha-combo-box-item, under the list (HA 2026.11: wa-popover >
// dialog > ha-picker-combo-box; older cores: the vaadin overlay or a menu).
const OPTION = ["ha-picker-combo-box", "vaadin-combo-box-overlay", "mwc-menu", "ha-md-menu", "ha-bottom-sheet"]
  .flatMap((list) => ["ha-list-item-option", "ha-combo-box-item", "mwc-list-item", "ha-list-item", "md-list-item", "vaadin-combo-box-item", "ha-md-list-item"].map((o) => `${list} ${o}`))
  .join(", ");

/** Escape closes an open picker list; with none open it would close the
 *  whole dialog, so only then. */
async function closePicker(page) {
  const open = page.locator("ha-picker-combo-box, vaadin-combo-box-overlay[opened], ha-bottom-sheet");
  for (let i = 0; i < (await open.count()); i++) {
    if (await open.nth(i).isVisible().catch(() => false)) {
      await page.keyboard.press("Escape").catch(() => {});
      await sleep(400);
      return;
    }
  }
}

/** Click where a user taps. Playwright's own hit test fails in WebKit over
 *  HA's bottom sheet (a top-layer <dialog> in a shadow root: it reports
 *  "<home-assistant> intercepts pointer events"); then the deep hit test
 *  (through shadow roots and the top layer) decides, and the click is sent
 *  to that point only when it lands on the element. */
async function tap(loc) {
  try {
    await loc.click({ timeout: 3000 });
    return true;
  } catch {
    if (!(await tapLands(loc))) return false;
    await loc.click({ force: true });
    return true;
  }
}

/** Click a picker open, type what a user types, tap the option. `picker`
 *  is HA's picker element; the click goes to its own field or button (an
 *  empty "add" picker is a narrow "Add entity" button in a wide box). */
async function pickFrom(page, picker, query, optionRe) {
  if (!(await picker.count())) return "picker not found";
  const inner = picker.locator("ha-picker-field, ha-button, [role=combobox], ha-combo-box").first();
  const field = (await inner.count()) ? inner : picker;
  await field.scrollIntoViewIfNeeded().catch(() => {});
  if (!(await tap(field))) return "the picker field takes no tap";
  const lists = page.locator("ha-picker-combo-box, vaadin-combo-box-overlay[opened]");
  let open = false;
  for (let i = 0; i < 30 && !open; i++) {
    for (let j = 0; j < (await lists.count()); j++) {
      if (await lists.nth(j).isVisible().catch(() => false)) { open = true; break; }
    }
    if (!open) await sleep(100);
  }
  if (!open) return "the picker list did not open";
  await sleep(500);
  if (query) {
    if ((await deepFocus(page)) !== "input") {
      // On a touch screen HA leaves the search unfocused (no keyboard pops
      // up by itself): a user taps it.
      const search = page.locator("ha-picker-combo-box input, vaadin-combo-box-overlay input");
      for (let j = 0; j < (await search.count()); j++) {
        if (await search.nth(j).isVisible().catch(() => false)) { await tap(search.nth(j)); break; }
      }
      await sleep(300);
    }
    const focus = await deepFocus(page);
    if (focus !== "input") {
      await closePicker(page);
      return `no search field to type into (${focus})`;
    }
    await page.keyboard.type(query, { delay: 30 });
    await sleep(1100);
  }
  const candidates = page.locator(OPTION).filter({ hasText: optionRe });
  const n = await candidates.count();
  for (let i = 0; i < n; i++) {
    const opt = candidates.nth(i);
    if (!(await opt.isVisible().catch(() => false))) continue;
    if (!(await tapLands(opt))) {
      await closePicker(page);
      return "the option is covered or clipped";
    }
    await tap(opt);
    await sleep(900);
    return null;
  }
  await closePicker(page);
  return `no visible option ${optionRe}`;
}

async function runCombo(browserName, vp, mode) {
  const combo = `${mode}/${browserName}/${vp.name}`;
  const beta = mode === "beta";
  await api.send({ type: `${D}/global/update`, settings: { advanced_beta_editor_visible: beta } });
  const SENSOR = (await api.send({
    type: `${D}/task/create`, entry_id: OBJ, task_type: "cleaning", name: `Sensor picks ${combo}`,
    schedule_type: "sensor_based", interval_days: 60,
    trigger_config: { type: "threshold", entity_id: NUM, entity_ids: [NUM], trigger_above: 50 },
  })).task_id;
  const TIMED = (await api.send({
    type: `${D}/task/create`, entry_id: OBJ, task_type: "inspection", name: `Timed picks ${combo}`, schedule_type: "time_based", interval_days: 30,
  })).task_id;
  const browser = await pw[browserName].connect("ws://127.0.0.1:3000/");
  const ctx = await browser.newContext(contextOptions(browserName, vp, "en"));
  try {
    await ctx.addInitScript(hassTokensInit, { t: token, ha: HA });
    const page = await ctx.newPage();
    const panel = page.locator("maintenance-supporter-panel");
    const dlg = page.locator("maintenance-task-dialog");
    const openEdit = async (taskId) => {
      await page.goto(`${HA}/maintenance-supporter?entry_id=${OBJ}&task_id=${taskId}`);
      await panel.locator(".more-menu-wrapper ha-icon-button").first().waitFor({ timeout: 60_000 });
      await sleep(2500);
      await panel.locator(".more-menu-wrapper ha-icon-button").first().click();
      await sleep(400);
      await panel.locator(".popup-menu [role=menuitem]").first().click();
      await dlg.locator(beta ? ".beta-content" : ".content").first().waitFor({ timeout: 20_000 });
      await sleep(1200);
    };
    const openRow = async (id) => {
      if (beta) {
        const main = dlg.locator(`.rule-row[data-row="${id}"] .rule-main`);
        if ((await main.getAttribute("aria-expanded")) !== "true") await main.click();
        await sleep(900);
      }
      // ha-form pickers by their schema field, for the locators below.
      await dlg.evaluate((d) => {
        for (const f of d.shadowRoot.querySelectorAll("ha-form")) {
          const n = f.schema?.[0]?.name;
          if (n) f.setAttribute("data-field", n);
        }
      });
    };
    // The open row's sidebar in the beta, the whole form in the classic dialog.
    const side = (sel) => (beta ? dlg.locator(`.rules-sidebar.open ${sel}`) : dlg.locator(sel));
    const state = (key) => dlg.evaluate((d, k) => d[k], key);
    /** A picked value lands a moment later on a slow engine: poll. */
    const until = async (key, ok) => {
      let v;
      for (let i = 0; i < 20; i++) {
        v = await state(key);
        if (ok(v)) return null;
        await sleep(150);
      }
      return `got ${JSON.stringify(v)}`;
    };
    const save = async () => {
      await dlg.locator(".dialog-actions ha-button").last().click();
      for (let i = 0; i < 40 && (await dlg.locator(".dialog-actions").count()); i++) await sleep(250);
      await sleep(1500);
    };
    const stored = async (id) => ((await api.send({ type: `${D}/object`, entry_id: OBJ })).tasks || []).find((x) => x.id === id);
    const check = async (what, fn) => {
      let problem;
      try {
        problem = await fn();
      } catch (e) {
        problem = `error: ${e.message.split("\n")[0]}`;
      }
      if (problem && SHOTS) await page.screenshot({ path: `${SHOTS}/${combo.replaceAll("/", "-")}-${what.replace(/[^a-z]+/gi, "-")}.png` }).catch(() => {});
      if (problem) await closePicker(page);
      record(combo, what, problem);
    };

    // ── the sensor task ──
    await openEdit(SENSOR);
    await openRow("trigger");
    await check("trigger: add an entity", async () => {
      const p = await pickFrom(page, side('ha-form[data-field="trigger_entities"] ha-generic-picker').last(), name(BIN), new RegExp(name(BIN)));
      return p ?? (await until("_triggerEntityIds", (v) => (v || []).includes(BIN)));
    });
    await check("trigger: environment sensor", async () => {
      const p = await pickFrom(page, side('ha-form[data-field="environmental_entity"] ha-generic-picker').first(), name(ENV), new RegExp(name(ENV)));
      return p ?? (await until("_environmentalEntity", (v) => v === ENV));
    });
    await openRow("completion");
    await check("done when: entity", async () => {
      const p = await pickFrom(page, side('ha-form[data-field="complete_when"] ha-generic-picker').first(), name(BIN), new RegExp(name(BIN)));
      return p ?? (await until("_completeWhenEntity", (v) => v === BIN));
    });
    await openRow("completion");
    await check("done when: state", async () => {
      const p = await pickFrom(page, side('.complete-when-field ha-form[data-field="s"] ha-generic-picker, .complete-when-field ha-form[data-field="s"] ha-combo-box').first(), "", /^\s*(On|Open|Detected|Wet)\b/);
      return p ?? (await until("_completeWhenState", (v) => v === "on"));
    });
    await check("completion action: the action", async () => {
      // Folded away in both dialogs: open it as a user does.
      const ca = side("details.ca-section").filter({ has: page.locator("ha-service-picker") });
      if (!(await ca.evaluate((d) => d.open))) await ca.locator("summary").click();
      await sleep(500);
      const p = await pickFrom(page, side("ha-service-picker ha-generic-picker, ha-service-picker ha-combo-box").first(), "counter reset", /Reset/);
      return p ?? (await until("_actionService", (v) => v === "counter.reset"));
    });
    await openRow("completion");
    await check("completion action: its target", async () => {
      const p = await pickFrom(page, side('ha-form[data-field="target_entity"] ha-generic-picker').first(), name(COUNTER), new RegExp(name(COUNTER)));
      return p ?? (await until("_actionTargetEntity", (v) => v === COUNTER));
    });
    await openRow("task");
    await check("task: icon", async () => {
      const details = side(".details-section");
      if (!(await details.evaluate((d) => d.open))) await details.locator("summary").click();
      await sleep(400);
      // The list sorts by name, so an exact "mdi:wrench" sits far down a
      // virtualised list; any icon the search shows proves the picker.
      const p = await pickFrom(page, side(".details-section ha-icon-picker ha-generic-picker, .details-section ha-icon-picker ha-combo-box").first(), "car-wrench", /mdi:car-wrench\s*$/);
      return p ?? (await until("_customIcon", (v) => v === "mdi:car-wrench"));
    });
    await openRow("notifications");
    await check("notifications: icon", async () => {
      const p = await pickFrom(page, side("ha-icon-picker.notify-icon-picker ha-generic-picker, ha-icon-picker.notify-icon-picker ha-combo-box").first(), "bell ring", /^\s*mdi:bell-ring\s*$|^\s*bell-ring\s*$/i);
      return p ?? (await until("_notifyIcon", (v) => v === "mdi:bell-ring"));
    });
    await check("notifications: to-do list", async () => {
      const p = await pickFrom(page, side('ha-form[data-field="mirror_todo_entities"] ha-generic-picker').last(), name(TODO), new RegExp(name(TODO)));
      return p ?? (await until("_mirrorTodoEntities", (v) => (v || []).includes(TODO)));
    });
    await openRow("schedule");
    await check("schedule: last performed (HA's date dialog)", async () => {
      const field = side('ms-date-field[label="Last performed (optional)"] ha-selector');
      await field.scrollIntoViewIfNeeded();
      if (!(await tap(field))) return "the date field takes no tap";
      await sleep(1200);
      // HA 2026.11's date dialog: a month grid, Cancel and OK (no Today
      // button) — tap today's day as a user does.
      const day = page.locator("button, [role=gridcell]").filter({ hasText: new RegExp(`^\\s*${today.getDate()}\\s*$`) });
      let pickedToday = false;
      for (let i = 0; i < (await day.count()); i++) {
        if (await day.nth(i).isVisible()) { pickedToday = await tap(day.nth(i)); break; }
      }
      if (!pickedToday) return `the date dialog showed no day ${today.getDate()}`;
      await sleep(500);
      const ok = page.locator("ha-button, mwc-button, button").filter({ hasText: /^\s*(OK|Select|Set|Done)\s*$/ });
      for (let i = 0; i < (await ok.count()); i++) {
        if (await ok.nth(i).isVisible()) { await tap(ok.nth(i)); break; }
      }
      await sleep(900);
      return until("_lastPerformed", (v) => v === TODAY);
    });
    if (SHOTS) await page.screenshot({ path: `${SHOTS}/${combo.replaceAll("/", "-")}-sensor.png` });
    await save();
    await check("sensor task: everything stored", async () => {
      const t = await stored(SENSOR);
      const want = {
        "trigger entities": (t.trigger_config?.entity_ids || []).includes(BIN),
        "environment": t.adaptive_config?.environmental_entity === ENV,
        "done when": t.complete_when?.entity_id === BIN && t.complete_when?.to_state === "on",
        "action": t.on_complete_action?.service === "counter.reset" && JSON.stringify(t.on_complete_action?.target || {}).includes(COUNTER),
        "icon": t.custom_icon === "mdi:car-wrench",
        "notify icon": t.notify_icon === "mdi:bell-ring",
        "to-do": (t.mirror_todo_entities || []).includes(TODO),
        "last performed": String(t.last_performed || "").startsWith(TODAY),
      };
      const bad = Object.entries(want).filter(([, v]) => !v).map(([k]) => k);
      return bad.length ? `not stored: ${bad.join(", ")}` : null;
    });

    // ── the timed task: a calendar schedule with a time of day ──
    await openEdit(TIMED);
    await openRow("schedule");
    await check("schedule: calendar", async () => {
      await side('select[aria-label="Schedule type"]').selectOption("calendar");
      await sleep(900);
      await openRow("schedule");
      const p = await pickFrom(page, side('ha-form[data-field="calendar_entity"] ha-generic-picker').first(), name(CAL), new RegExp(name(CAL)));
      return p ?? (await until("_calendarEntity", (v) => v === CAL));
    });
    await check("schedule: time of day", async () => {
      const toggle = side(".schedule-time-toggle input");
      if (!(await toggle.isChecked())) await tap(toggle);
      await sleep(700);
      const inputs = side(".schedule-section ms-date-field[kind=time] input");
      if ((await inputs.count()) < 2) return `time field has ${await inputs.count()} inputs`;
      await tap(inputs.nth(0));
      await inputs.nth(0).fill("7");
      await tap(inputs.nth(1));
      await inputs.nth(1).fill("45");
      await page.keyboard.press("Tab");
      await sleep(600);
      return until("_scheduleTime", (v) => /^07:45/.test(v || ""));
    });
    if (SHOTS) await page.screenshot({ path: `${SHOTS}/${combo.replaceAll("/", "-")}-timed.png` });
    await save();
    await check("timed task: calendar and time stored", async () => {
      const t = await stored(TIMED);
      const bad = [];
      if (t.schedule?.kind !== "calendar" || t.schedule?.entity_id !== CAL) bad.push(`schedule ${JSON.stringify(t.schedule)}`);
      if (!/^07:45/.test(t.schedule_time || "")) bad.push(`time ${t.schedule_time}`);
      return bad.length ? bad.join(", ") : null;
    });
  } catch (e) {
    record(combo, "run", `error: ${e.message.split("\n")[0]}`);
  } finally {
    await ctx.close().catch(() => {});
    await browser.close().catch(() => {});
  }
}

for (const mode of MODES) {
  for (const browserName of BROWSERS) {
    for (const vp of VIEWPORTS) await runCombo(browserName, vp, mode);
  }
}

await api.send({ type: `${D}/global/update`, settings: Object.fromEntries(ADVANCED.map((k) => [k, !!before[k.replace(/^advanced_/, "").replace(/_visible$/, "")]])) });
if (!process.env.KEEP) await api.send({ type: `${D}/object/delete`, entry_id: OBJ }).catch(() => {});
api.close();
log(`\n${results.length - failures.length}/${results.length} checks passed`);
if (failures.length) log("FAILURES:\n  " + failures.join("\n  "));
process.exit(failures.length ? 1 : 0);
