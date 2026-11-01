/** Every panel surface at every screen size of layout-sweep-kit.mjs: phones
 * portrait and held sideways, iPads both ways, both sides of HA's 870 px
 * breakpoint, laptops, full HD, QHD and 4K — in Chromium and WebKit, in
 * English and German (Ukrainian and Hungarian, the longest labels, at the
 * narrowest phones). The beta task editor has its own sweep
 * (live-beta-editor-viewports.mjs); this one runs with the beta off.
 *
 * Surfaces: the overview tabs (Today, Dashboard, Calendar, Settings), an
 * object page, a task page and its history, the task's ⋮ menu, the complete
 * dialog, the create dialog, the search with results, the template gallery
 * and the saved-views dialog. Fails when
 *   - an element of ours pokes past the window, spills out of its own
 *     unclipped box (the in-box check), or a scrolling box hides content
 *     sideways;
 *   - the page or the panel scrolls sideways;
 *   - a tap does not reach what it aims at: the last ⋮ menu item, a
 *     dialog's Save, and the LEFT edge of the search, the gallery and the
 *     saved views (HA 2026.11 drew its docked sidebar over them).
 *
 * Usage (restart playwright-server first, wedge prevention):
 *   HA_REST=http://127.0.0.1:8132 HA_BROWSER=http://ha-211:8123 HA_USER=demo HA_PASS=… \
 *     SHOTS_DIR=… node e2e/live-screen-sizes-sweep.mjs
 *   node e2e/live-screen-sizes-sweep.mjs                  # ha-maint, docker/.env token
 *   BROWSERS=webkit VIEWPORTS=ipad-air-landscape,uhd-4k LANGS=de KEEP=1 …
 */
import { createRequire } from "module";
import fs from "fs";
import { hassTokensInit, loadToken, onboardOrLogin, watchdog, wsClient } from "./ws-client.mjs";
import { NO_LAYOUT_PROBLEMS, contextOptions, createReport, languageSwitcher, measureAt, pickDevices, sidewaysScroll, tapLands } from "./layout-sweep-kit.mjs";

const require = createRequire(new URL("../custom_components/maintenance_supporter/frontend-src/package.json", import.meta.url));
const pw = require("playwright");

const REST = process.env.HA_REST || "http://127.0.0.1:8125";
const HA = process.env.HA_BROWSER || "http://ha-maint:8123";
const D = "maintenance_supporter";
const SHOTS = process.env.SHOTS_DIR || "";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (...a) => console.log(...a);
watchdog(Number(process.env.WATCHDOG_MS || 10_800_000), "screen sizes sweep");

const VIEWPORTS = pickDevices(process.env.VIEWPORTS);
const BROWSERS = (process.env.BROWSERS || "chromium,webkit").split(",");
const LANGS = (process.env.LANGS || "en,de").split(",");
const EXTRA_LANGS = (process.env.EXTRA_LANGS ?? "uk,hu").split(",").filter(Boolean);
const EXTRA_VIEWPORTS = ["phone-320", "phone-360"];
const SEARCH = { en: "drum", de: "drum", uk: "drum", hu: "drum" };

const token = process.env.HA_USER
  ? await onboardOrLogin(REST, { user: process.env.HA_USER, pass: process.env.HA_PASS, cid: REST + "/" })
  : loadToken();
const api = await wsClient(REST, token);
const userLang = await languageSwitcher(api);

// ── data: a long-named object and task with history, labels and a part ────
const settingsBefore = await api.send({ type: `${D}/settings` });
await api.send({ type: `${D}/global/update`, settings: { advanced_beta_editor_visible: false } });
const NAME = "Screen sizes sweep heat pump outdoor unit behind the garage";
const old = ((await api.send({ type: `${D}/objects` })).objects || []).find((o) => o.object?.name === NAME);
if (old) await api.send({ type: `${D}/object/delete`, entry_id: old.entry_id });
const OBJ = (await api.send({ type: `${D}/object/create`, name: NAME })).entry_id;
await sleep(1500);
const PART = (await api.send({
  type: `${D}/part/create`, entry_id: OBJ, name: "Condensate drain hose with clamp, 16 mm", stock: 2, reorder_threshold: 1, storage_location: "Garage shelf, top left",
}).catch(() => ({}))).part_id;
const TASK_NAME = "Clean the evaporator fins and the drum of the condensate drain";
const TASK = (await api.send({
  type: `${D}/task/create`, entry_id: OBJ, task_type: "cleaning", name: TASK_NAME, interval_days: 90, warning_days: 14,
  labels: ["outdoor", "before winter", "ladder needed"],
  checklist: ["Switch the unit off at the isolator", "Brush the fins top to bottom", "Flush the drain", "Check the drain heater"],
  notes: "Use the soft brush from the garage. The fins bend easily; never use a pressure washer on them.",
  ...(PART ? { consumes_parts: [{ part_id: PART, quantity: 1 }] } : {}),
})).task_id;
for (const note of ["Fins were full of pollen, drain was blocked at the outlet", "Quick check only, nothing to do"]) {
  await api.send({ type: `${D}/task/complete`, entry_id: OBJ, task_id: TASK, notes: note, cost: 18.5 });
  await sleep(600);
}
log(`setup: object ${OBJ}, task ${TASK}, part ${PART ?? "-"}`);

// The scrolling / clipping boxes whose sideways overflow counts.
const BOXES = [".content", ".palette-results", ".template-gallery-body", ".dialog", ".dialog-scroll"];
const measure = (locator, vp) => measureAt(locator, vp, BOXES);
const { results, failures, record, shot, errorShot, summary } = createReport({ shotsDir: SHOTS, log });

async function runCombo(browserName, vp, lang) {
  const combo = `${browserName}/${vp.name}/${lang}`;
  await userLang.set(lang);
  const browser = await pw[browserName].connect("ws://127.0.0.1:3000/");
  const ctx = await browser.newContext(contextOptions(browserName, vp, lang));
  try {
    await ctx.addInitScript(hassTokensInit, { t: token, ha: HA });
    await ctx.addInitScript((lg) => localStorage.setItem("selectedLanguage", JSON.stringify(lg)), lang);
    const page = await ctx.newPage();
    const panel = page.locator("maintenance-supporter-panel");
    // `menuOpen`: an open dropdown overlaps its container by design, so its
    // container "spills"; the window edge and the tap still count.
    const at = async (name, locator, extra = [], { menuOpen = false } = {}) => {
      await shot(page, combo, name.replaceAll(" ", "-"));
      const m = await measure(locator, vp);
      record(combo, name, menuOpen ? { ...m, spilled: [] } : m, [...extra, ...(await sidewaysScroll(page))]);
    };

    await page.goto(`${HA}/maintenance-supporter`);
    await page.waitForFunction(() => {
      const p = document.querySelector("home-assistant")?.shadowRoot?.querySelector("home-assistant-main")?.shadowRoot
        ?.querySelector("ha-drawer partial-panel-resolver ha-panel-custom maintenance-supporter-panel");
      return p && Array.isArray(p._objects) && p._objects.length > 0;
    }, null, { timeout: 60_000 });
    await sleep(1500);

    // The overview tabs.
    for (const tab of ["today", "dashboard", "calendar", "settings"]) {
      await panel.evaluate((p, t) => { p._view = "overview"; p._setOverviewTab(t); }, tab);
      await sleep(tab === "settings" ? 2500 : 1500);
      await at(`tab ${tab}`, panel);
    }

    // The search with results: its left edge lies where HA 2026.11's sidebar is.
    await panel.evaluate((p) => { p._view = "overview"; p._setOverviewTab("dashboard"); });
    await sleep(800);
    await page.keyboard.press("/");
    await panel.locator(".palette-input").fill(SEARCH[lang] || "drum");
    await sleep(1500);
    const hit = panel.locator(".palette-item").first();
    const searchExtra = (await hit.count()) ? ((await tapLands(hit, "left")) ? [] : ["first search hit not reachable at its left edge"]) : ["no search hit"];
    await at("search", panel, searchExtra);
    await page.keyboard.press("Escape");
    await sleep(400);

    // The template gallery.
    await panel.evaluate((p) => p._openTemplateGallery());
    await sleep(1800);
    const card = panel.locator(".template-card").first();
    await at("template gallery", panel, (await tapLands(card, "left")) ? [] : ["first template card not reachable at its left edge"]);
    await panel.evaluate((p) => { p._templateGalleryOpen = false; });
    await sleep(400);

    // The saved-views dialog (the hand-built modal frame).
    await panel.evaluate((p) => p._openSavedViewsDialog());
    await sleep(900);
    const views = page.locator("maintenance-saved-views-dialog");
    await at("saved views", views, (await tapLands(views.locator(".dialog"), "left")) ? [] : ["saved views not reachable at its left edge"]);
    await page.keyboard.press("Escape");
    await sleep(400);

    // The object page.
    await panel.evaluate((p, e) => p._showObject(e), OBJ);
    await sleep(2000);
    await at("object page", panel);

    // The create dialog (classic: the beta is off for this sweep).
    const add = panel.locator("ha-button").filter({ hasText: /^\s*\+/ }).first();
    await add.click();
    const tdlg = page.locator("maintenance-task-dialog");
    await tdlg.locator(".content").first().waitFor({ timeout: 20_000 });
    await sleep(1000);
    const tsave = tdlg.locator(".dialog-actions ha-button").last();
    await at("create dialog", tdlg, (await tapLands(tsave)) ? [] : ["Save not reachable by a tap"]);
    await tdlg.locator(".dialog-actions ha-button").first().click();
    await sleep(600);

    // The task page and its history.
    await panel.evaluate((p, a) => p._showTask(a.e, a.t), { e: OBJ, t: TASK });
    await sleep(2000);
    await at("task page", panel);
    await panel.evaluate((p) => { p._activeTab = "history"; });
    await sleep(1500);
    await at("task history", panel);
    await panel.evaluate((p) => { p._activeTab = "overview"; });
    await sleep(600);

    // The task's ⋮ menu: inside the window, its last item reachable.
    await panel.locator(".more-menu-wrapper ha-icon-button").first().click();
    await sleep(500);
    const menu = panel.locator(".popup-menu").first();
    const lastItem = menu.locator("[role=menuitem]").last();
    await at("task menu", panel, (await tapLands(lastItem)) ? [] : ["last menu item not reachable by a tap"], { menuOpen: true });
    await panel.locator(".more-menu-wrapper ha-icon-button").first().click();
    await sleep(400);

    // The complete dialog, with every field the task asks for.
    await panel.evaluate((p, a) => p._openCompleteDialog(a.e, a.t, a.n, undefined, false, { details: true }), { e: OBJ, t: TASK, n: TASK_NAME });
    const cdlg = page.locator("maintenance-complete-dialog");
    await cdlg.locator(".dialog-actions").waitFor({ timeout: 20_000 });
    await sleep(1000);
    const csave = cdlg.locator(".dialog-actions ha-button").last();
    await at("complete dialog", cdlg, (await tapLands(csave)) ? [] : ["Save not reachable by a tap"]);
    await cdlg.locator(".dialog-actions ha-button").first().click();
    await sleep(500);
  } catch (e) {
    record(combo, "run", NO_LAYOUT_PROBLEMS, [`error: ${e.message.split("\n")[0]}`]);
    await errorShot(ctx, combo);
  } finally {
    await ctx.close().catch(() => {});
    await browser.close().catch(() => {});
  }
}

for (const browserName of BROWSERS) {
  for (const vp of VIEWPORTS) {
    const langs = [...LANGS, ...(EXTRA_VIEWPORTS.includes(vp.name) ? EXTRA_LANGS : [])];
    for (const lang of langs) {
      if (SHOTS) fs.mkdirSync(`${SHOTS}/${browserName}/${vp.name}`, { recursive: true });
      await runCombo(browserName, vp, lang);
    }
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
