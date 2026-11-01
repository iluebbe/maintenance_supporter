/** The beta task editor (2026-10) across screen sizes, browsers and
 * long-label languages: every device of layout-sweep-kit.mjs (phones portrait
 * and held sideways, iPads both ways, both sides of the 870 px breakpoint,
 * laptops, full HD, QHD, 4K), in Chromium and WebKit.
 *
 * Per (browser × viewport × language) it walks the surfaces the beta adds —
 * the edit dialog's rows, each row's section in the sidebar, the add picker
 * by type and by device, the new-task start screen and its template list,
 * the template preview and the Trace tab — and fails when
 *   - an element pokes past the window,
 *   - content spills out of its own unclipped box (the in-box check),
 *   - a scrolling or clipping box hides content sideways (the sidebar, the
 *     dialog content: overflow there is silent),
 *   - the sidebar is not beside the rows on a wide screen / not right below
 *     the picked row on a narrow one, or the picker's tabs lost their height,
 *   - an edit saved at that size does not arrive (one per browser × size),
 *     or Save is not reachable by a tap once scrolled into view.
 * Then the classic dialog (flag off) at the phone, landscape, tablet and
 * laptop sizes: in the window, Save reachable, the save arrives.
 *
 * Usage (restart playwright-server first, wedge prevention):
 *   HA_REST=http://127.0.0.1:8132 HA_BROWSER=http://ha-211:8123 HA_USER=demo HA_PASS=… \
 *     WASHER_AREA=1 node e2e/live-beta-editor-viewports.mjs
 *   node e2e/live-beta-editor-viewports.mjs              # ha-maint, docker/.env token
 *   BROWSERS=chromium VIEWPORTS=phone-360,desktop-1440 LANGS=en,de SHOTS_DIR=… KEEP=1
 *   CLASSIC_ONLY=1 …                                     # the classic pass alone
 */
import { createRequire } from "module";
import fs from "fs";
import { hassTokensInit, loadToken, onboardOrLogin, watchdog, wsClient } from "./ws-client.mjs";
import { NO_LAYOUT_PROBLEMS, contextOptions, createReport, languageSwitcher, measureAt, pickDevices, tapLands } from "./layout-sweep-kit.mjs";

const require = createRequire(new URL("../custom_components/maintenance_supporter/frontend-src/package.json", import.meta.url));
const pw = require("playwright");

const REST = process.env.HA_REST || "http://127.0.0.1:8125";
const HA = process.env.HA_BROWSER || "http://ha-maint:8123";
const D = "maintenance_supporter";
const SHOTS = process.env.SHOTS_DIR || "";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (...a) => console.log(...a);
watchdog(Number(process.env.WATCHDOG_MS || 10_800_000), "beta editor viewport sweep");

const VIEWPORTS = pickDevices(process.env.VIEWPORTS);
const BROWSERS = (process.env.BROWSERS || "chromium,webkit").split(",");
const LANGS = (process.env.LANGS || "en,de").split(",");
// The longest-label languages (live-overflow-sweep) at the narrowest phones.
const EXTRA_LANGS = (process.env.EXTRA_LANGS ?? "uk,hu").split(",").filter(Boolean);
const EXTRA_VIEWPORTS = ["phone-320", "phone-360"];

const token = process.env.HA_USER
  ? await onboardOrLogin(REST, { user: process.env.HA_USER, pass: process.env.HA_PASS, cid: REST + "/" })
  : loadToken();
const api = await wsClient(REST, token);
const userLang = await languageSwitcher(api);

// ── data: an object with a long-named task that has every row filled ──────
const settingsBefore = await api.send({ type: `${D}/settings` });
await api.send({ type: `${D}/global/update`, settings: { advanced_beta_editor_visible: true } });
let areaId = null;
if (process.env.WASHER_AREA) {
  const areas = await api.send({ type: "config/area_registry/list" });
  areaId = areas.find((a) => a.name === "Beta laundry")?.area_id ?? (await api.send({ type: "config/area_registry/create", name: "Beta laundry" })).area_id;
  for (const id of ["binary_sensor.washer_door", "sensor.washer_total_washes", "sensor.washer_filter_due", "sensor.washer_program", "switch.washer_motor"]) {
    await api.send({ type: "config/entity_registry/update", entity_id: id, area_id: areaId }).catch(() => {});
  }
}
const states = Object.fromEntries((await api.send({ type: "get_states" })).map((s) => [s.entity_id, s]));
const pick = (pred, fb) => Object.values(states).find(pred)?.entity_id || fb;
const NUM = areaId ? "sensor.washer_total_washes" : pick((s) => s.entity_id.startsWith("sensor.") && typeof s.attributes.unit_of_measurement === "string" && Number.isFinite(Number(s.state)), "sensor.sun_solar_elevation");
const BIN = areaId ? "binary_sensor.washer_door" : pick((s) => s.entity_id.startsWith("binary_sensor."), "binary_sensor.x");
const NAME = "Beta viewport sweep washing machine in the basement";
const old = ((await api.send({ type: `${D}/objects` })).objects || []).find((o) => o.object?.name === NAME);
if (old) await api.send({ type: `${D}/object/delete`, entry_id: old.entry_id });
const OBJ = (await api.send({ type: `${D}/object/create`, name: NAME, ...(areaId ? { area_id: areaId } : {}) })).entry_id;
await sleep(1500);
const users = (await api.send({ type: `${D}/users/list` }).catch(() => ({ users: [] }))).users || [];
const TASK = (await api.send({
  type: `${D}/task/create`, entry_id: OBJ, task_type: "cleaning",
  name: "Clean the drum filter, the door seal and the detergent drawer",
  schedule_type: "sensor_based", interval_days: 30, warning_days: 7,
  trigger_config: { type: "counter", entity_id: NUM, entity_ids: [NUM], trigger_target_value: 25, trigger_delta_mode: true },
  complete_when: { entity_id: BIN, to_state: "on", for_minutes: 2 },
  quick_complete_defaults: {}, required_completion_fields: ["notes", "cost"], allow_skip: false,
  notes: "Open the flap at the bottom right, drain the water into a flat tray and rinse the filter under the tap.",
  ...(users[0] ? { responsible_user_id: users[0].id } : {}),
})).task_id;
await sleep(1200);
await api.send({ type: `${D}/task/snooze`, entry_id: OBJ, task_id: TASK }).catch(() => {});
await api.send({ type: `${D}/task/complete`, entry_id: OBJ, task_id: TASK, notes: "By hand, with a long note that wraps on a phone screen", cost: 12.5 });
await sleep(1000);
log(`setup: object ${OBJ}, task ${TASK}, NUM=${NUM}, BIN=${BIN}, area=${areaId}`);

// The scrolling / clipping boxes whose sideways overflow counts.
const BOXES = [".rules-sidebar", ".sidebar-body", ".content", ".beta-content", ".rules-layout", ".chooser", ".trace-body", ".trace-timeline"];
const measure = (locator, vp) => measureAt(locator, vp, BOXES);

// ── the sweep ──────────────────────────────────────────────────────────────
const { results, failures, record, shot, errorShot, summary } = createReport({ shotsDir: SHOTS, log });

async function runCombo(browserName, vp, lang, doSave) {
  const combo = `${browserName}/${vp.name}/${lang}`;
  await userLang.set(lang);
  const browser = await pw[browserName].connect("ws://127.0.0.1:3000/");
  const ctx = await browser.newContext(contextOptions(browserName, vp, lang));
  try {
    await ctx.addInitScript(hassTokensInit, { t: token, ha: HA });
    await ctx.addInitScript((lg) => localStorage.setItem("selectedLanguage", JSON.stringify(lg)), lang);
    const page = await ctx.newPage();
    const panel = page.locator("maintenance-supporter-panel");
    const dlg = page.locator("maintenance-task-dialog");

    // The task page and its Trace tab.
    await page.goto(`${HA}/maintenance-supporter?entry_id=${OBJ}&task_id=${TASK}`);
    await panel.locator(".more-menu-wrapper ha-icon-button").first().waitFor({ timeout: 60_000 });
    await sleep(2500);
    const traceTab = panel.locator(".tab.trace-tab");
    await traceTab.click();
    await sleep(2000);
    const steps = await page.locator("maintenance-task-trace .trace-step").count();
    await shot(page, combo, "trace");
    record(combo, "trace tab", await measure(panel, vp), steps ? [] : ["no trace steps"]);

    // The edit dialog: rows, then each row's section.
    await panel.locator(".more-menu-wrapper ha-icon-button").first().click();
    await sleep(400);
    await panel.locator(".popup-menu [role=menuitem]").first().click();
    await dlg.locator(".beta-content").waitFor({ timeout: 20_000 });
    await sleep(1200);
    const narrow = vp.width <= 870;
    const extraRows = [];
    const ADD_RULE = { en: "Add rule", de: "Regel hinzufügen", uk: "Додати правило", hu: "Szabály hozzáadása" };
    const addText = (await dlg.locator(".rule-add").textContent()).trim();
    if (ADD_RULE[lang] && addText !== ADD_RULE[lang]) extraRows.push(`language not ${lang}: "${addText}"`);
    const sideHidden = await dlg.locator(".rules-sidebar").evaluate((el) => getComputedStyle(el).display === "none");
    if (narrow && !sideHidden) extraRows.push("closed sidebar shown on a narrow screen");
    if (!narrow && sideHidden) extraRows.push("sidebar hint missing on a wide screen");
    await shot(page, combo, "rows");
    record(combo, "dialog rows", await measure(dlg, vp), extraRows);

    for (const id of ["task", "schedule", "trigger", "completion", "people", "notifications"]) {
      await dlg.locator(`.rule-row[data-row="${id}"] .rule-main`).click();
      await sleep(700);
      const extra = [];
      const row = await dlg.locator(`.rule-row[data-row="${id}"]`).boundingBox();
      const side = await dlg.locator(".rules-sidebar").boundingBox();
      if (!side || side.height < 40) extra.push("sidebar not shown");
      else if (narrow) {
        if (!(side.y > row.y)) extra.push(`sidebar (${Math.round(side.y)}) not below the row (${Math.round(row.y)})`);
      } else if (!(side.x >= row.x + row.width - 1)) {
        extra.push(`sidebar (${Math.round(side.x)}) not beside the rows (${Math.round(row.x + row.width)})`);
      }
      const headVisible = await dlg.locator(".sidebar-head").isVisible();
      if (!headVisible) extra.push("sidebar head hidden");
      if (id === "trigger" || id === "completion") await shot(page, combo, `sidebar-${id}`);
      record(combo, `sidebar ${id}`, await measure(dlg, vp), extra);
    }

    // The add picker, by type and by device.
    await dlg.locator(".rule-add").click();
    await sleep(600);
    await dlg.locator(".add-tab-type").click();
    await sleep(400);
    const tabsH = (await dlg.locator(".add-tabs").boundingBox())?.height ?? 0;
    await shot(page, combo, "add-type");
    record(combo, "add picker: by type", await measure(dlg, vp), tabsH > 24 ? [] : [`tabs ${tabsH}px high`]);
    await dlg.locator(".add-tab-device").click();
    await sleep(1500);
    const devCount = await dlg.locator(".device-entity, .beta-no-device").count();
    await shot(page, combo, "add-device");
    record(combo, "add picker: by device", await measure(dlg, vp), devCount ? [] : ["nothing in the device tab"]);

    // One real edit, saved at this size.
    if (doSave) {
      // The warning days: the schedule section's first number field in any language.
      const want = String(10 + (VIEWPORTS.indexOf(vp) % 50) + (browserName === "webkit" ? 50 : 0));
      await dlg.locator('.rule-row[data-row="schedule"] .rule-main').click();
      await sleep(500);
      const field = dlg.locator('.rules-sidebar .schedule-section ms-textfield[type="number"] input').first();
      await field.fill(want);
      await sleep(300);
      const save = dlg.locator(".dialog-actions ha-button").last();
      const reach = (await tapLands(save)) ? [] : ["Save not reachable by a tap"];
      await save.click();
      for (let i = 0; i < 40 && (await dlg.locator(".beta-content").count()); i++) await sleep(250);
      await sleep(1500);
      const t = ((await api.send({ type: `${D}/object`, entry_id: OBJ })).tasks || []).find((x) => x.id === TASK);
      const ok = String(t?.warning_days) === want;
      record(combo, "save at this size", NO_LAYOUT_PROBLEMS, [...reach, ...(ok ? [] : [`stored warning days ${t?.warning_days}, typed ${want}`])]);
    } else {
      await dlg.locator(".dialog-actions ha-button").first().click();
      await sleep(600);
    }

    // The start screen of a new task and its template list.
    await page.goto(`${HA}/maintenance-supporter?entry_id=${OBJ}`);
    // "+ Add Task" in every language starts with the plus.
    const add = panel.locator("ha-button").filter({ hasText: /^\s*\+/ }).first();
    await add.waitFor({ timeout: 60_000 });
    await sleep(1500);
    await add.click();
    await dlg.locator(".chooser").waitFor({ timeout: 20_000 });
    await sleep(800);
    await shot(page, combo, "start");
    record(combo, "start screen", await measure(dlg, vp));
    await dlg.locator(".chooser-template").click();
    await sleep(2000);
    record(combo, "template tasks", await measure(dlg, vp));
    await dlg.locator(".dialog-actions ha-button").first().click();
    await sleep(600);

    // The template preview in the gallery.
    await panel.evaluate((p) => p._openTemplateGallery());
    await sleep(1500);
    await panel.locator(".template-card").first().click();
    await sleep(800);
    await shot(page, combo, "template-preview");
    record(combo, "template preview", await measure(panel, vp));
  } catch (e) {
    record(combo, "run", NO_LAYOUT_PROBLEMS, [`error: ${e.message.split("\n")[0]}`]);
    await errorShot(ctx, combo);
  } finally {
    await ctx.close().catch(() => {});
    await browser.close().catch(() => {});
  }
}

/** The classic dialog (beta off) shares the scroll rules the landscape fix
 *  changed: its content in the window, Save reachable, a save that arrives. */
async function runClassic(browserName, vp) {
  const combo = `${browserName}/${vp.name}/classic`;
  await userLang.set("en");
  const browser = await pw[browserName].connect("ws://127.0.0.1:3000/");
  const ctx = await browser.newContext(contextOptions(browserName, vp, "en"));
  try {
    await ctx.addInitScript(hassTokensInit, { t: token, ha: HA });
    const page = await ctx.newPage();
    const panel = page.locator("maintenance-supporter-panel");
    const dlg = page.locator("maintenance-task-dialog");
    await page.goto(`${HA}/maintenance-supporter?entry_id=${OBJ}&task_id=${TASK}`);
    await panel.locator(".more-menu-wrapper ha-icon-button").first().waitFor({ timeout: 60_000 });
    await sleep(2500);
    await panel.locator(".more-menu-wrapper ha-icon-button").first().click();
    await sleep(400);
    await panel.locator(".popup-menu [role=menuitem]").first().click();
    // The dialog's body; nested components have a .content of their own.
    await dlg.locator(".content").first().waitFor({ timeout: 20_000 });
    await sleep(1200);
    const extra = (await dlg.locator(".beta-content").count()) ? ["beta dialog shown with the flag off"] : [];
    await shot(page, combo, "dialog");
    record(combo, "classic dialog", await measure(dlg, vp), extra);
    const want = String(70 + (VIEWPORTS.indexOf(vp) % 20) + (browserName === "webkit" ? 20 : 0));
    await dlg.locator('ms-textfield[label="Warning days"] input').fill(want);
    await sleep(300);
    const save = dlg.locator(".dialog-actions ha-button").last();
    const reach = (await tapLands(save)) ? [] : ["Save not reachable by a tap"];
    await shot(page, combo, "save");
    await save.click();
    for (let i = 0; i < 40 && (await dlg.locator(".content").count()); i++) await sleep(250);
    await sleep(1500);
    const t = ((await api.send({ type: `${D}/object`, entry_id: OBJ })).tasks || []).find((x) => x.id === TASK);
    const ok = String(t?.warning_days) === want;
    record(combo, "classic save", NO_LAYOUT_PROBLEMS, [...reach, ...(ok ? [] : [`stored warning days ${t?.warning_days}, typed ${want}`])]);
  } catch (e) {
    record(combo, "run", NO_LAYOUT_PROBLEMS, [`error: ${e.message.split("\n")[0]}`]);
    await errorShot(ctx, combo);
  } finally {
    await ctx.close().catch(() => {});
    await browser.close().catch(() => {});
  }
}

if (!process.env.CLASSIC_ONLY) {
  for (const browserName of BROWSERS) {
    for (const vp of VIEWPORTS) {
      const langs = [...LANGS, ...(EXTRA_VIEWPORTS.includes(vp.name) ? EXTRA_LANGS : [])];
      for (const [i, lang] of langs.entries()) {
        if (SHOTS) fs.mkdirSync(`${SHOTS}/${browserName}/${vp.name}`, { recursive: true });
        await runCombo(browserName, vp, lang, i === 0);
      }
    }
  }
}
const CLASSIC_VIEWPORTS = ["phone-320", "phone-360", "iphone-se-landscape", "phone-landscape", "ipad-mini", "tablet-768", "ipad-air-landscape", "laptop-1280", "uhd-4k"];
await api.send({ type: `${D}/global/update`, settings: { advanced_beta_editor_visible: false } });
for (const browserName of BROWSERS) {
  for (const vp of VIEWPORTS.filter((v) => CLASSIC_VIEWPORTS.includes(v.name))) {
    if (SHOTS) fs.mkdirSync(`${SHOTS}/${browserName}/${vp.name}`, { recursive: true });
    await runClassic(browserName, vp);
  }
}

// ── teardown ───────────────────────────────────────────────────────────────
await api.send({ type: `${D}/global/update`, settings: { advanced_beta_editor_visible: !!settingsBefore.features?.beta_editor } });
if (!process.env.KEEP) await api.send({ type: `${D}/object/delete`, entry_id: OBJ }).catch(() => {});
await userLang.restore();
api.close();
summary();
if (process.env.RESULT_JSON) fs.writeFileSync(process.env.RESULT_JSON, JSON.stringify(results, null, 1));
process.exit(failures.length ? 1 : 0);
