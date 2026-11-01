/** The panel's tables with their column views, live: the objects table
 * (the columns chosen under Settings › Objects table columns, #67), the
 * dashboard's task table (one subgrid, the bulk column, grouped) and the
 * all-parts table, in the classic look and with the beta UI, at the sizes
 * where the table is shown and where it gives way to cards.
 *
 * The column choice itself is clicked in Settings and read back; the other
 * column sets are stored over the API. Per table it checks:
 *   - headers: as many as columns, in the configured order, with the labels;
 *   - rows: every row has as many cells as the header;
 *   - columns line up: a column's cells share their left edge (±1 px) with
 *     its header, across all rows;
 *   - nothing spills: no cell content reaches past its cell, no cell
 *     overlaps the next one (the task table's grid cells too);
 *   - sideways: a table wider than its box scrolls inside it, never the page;
 *   - no runaway row: no row is more than 3× the median row height (a long
 *     note or URL wrapping a letter per line);
 *   - the row's buttons take a tap;
 *   - on a phone the objects view shows cards, not a squeezed table.
 *
 * Usage (playwright-server on 127.0.0.1:3000):
 *   HA_REST=http://127.0.0.1:8164 HA_BROWSER=http://ms-timelapse-large:8123 HA_USER=owner HA_PASS=… \
 *     node e2e/live-columns-check.mjs
 *   MODES=beta,classic BROWSERS=chromium,webkit VIEWPORTS=fhd-1920,desktop-1440,ipad-air-landscape,laptop-1280,phone-390
 *   SHOTS_DIR=… keeps a picture of every table state.
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
const MODES = (process.env.MODES || "beta,classic").split(",");
const BROWSERS = (process.env.BROWSERS || "chromium").split(",");
const VIEWPORTS = pickDevices(process.env.VIEWPORTS || "fhd-1920,desktop-1440,laptop-1280,ipad-air-landscape,phone-390");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (...a) => console.log(...a);
watchdog(Number(process.env.WATCHDOG_MS || 5_400_000), "columns check");

const token = process.env.HA_USER
  ? await onboardOrLogin(REST, { user: process.env.HA_USER, pass: process.env.HA_PASS, cid: REST + "/" })
  : loadToken();
const api = await wsClient(REST, token);
const ws = (type, extra = {}) => api.send({ type: `${D}/${type}`, ...extra });
const settingsBefore = await ws("settings");
const colsBefore = settingsBefore.objects_table_columns ?? null;
const betaBefore = !!settingsBefore.features?.beta_editor;

const ALL = ["name", "ref_no", "manufacturer", "model", "serial_number", "installation_date", "warranty_expiry", "area_id", "documentation_url", "notes", "task_count", "actions"];
const SETS = {
  default: ["name", "manufacturer", "model", "serial_number", "installation_date", "warranty_expiry", "area_id", "task_count", "actions"],
  all: ALL,
  "name-only": ["name"],
  "long-text": ["name", "documentation_url", "notes", "actions"],
};

const results = [];
const failures = [];
const record = (combo, what, problems) => {
  results.push({ combo, what, ok: !problems.length });
  if (problems.length) failures.push(`${combo} ${what}: ${problems.join("; ")}`);
  log(`${problems.length ? "FAIL" : "ok  "} ${combo.padEnd(34)} ${what}${problems.length ? "  — " + problems.join("; ") : ""}`);
};

/** The measurements, in the page: one table (or the task grid) by selector. */
function measureTable(sel) {
  const panel = document.querySelector("home-assistant")?.shadowRoot?.querySelector("home-assistant-main")?.shadowRoot
    ?.querySelector("ha-drawer partial-panel-resolver ha-panel-custom maintenance-supporter-panel");
  const root = panel?.shadowRoot;
  const table = root?.querySelector(sel);
  if (!table) return { missing: true };
  const r = (el) => el.getBoundingClientRect();
  const out = { problems: [], headers: [], rows: 0 };
  const heads = [...table.querySelectorAll("thead th")];
  out.headers = heads.map((h) => (h.textContent || "").trim());
  const bodyRows = [...table.querySelectorAll("tbody tr")].filter((tr) => r(tr).height > 0);
  out.rows = bodyRows.length;
  const heights = bodyRows.map((tr) => r(tr).height).sort((a, b) => a - b);
  const median = heights[Math.floor(heights.length / 2)] || 0;
  const tallest = heights[heights.length - 1] || 0;
  if (median && tallest > median * 3) out.problems.push(`a row ${Math.round(tallest)} px tall (median ${Math.round(median)} px)`);
  const spills = new Set();
  for (const [ri, tr] of bodyRows.entries()) {
    const cells = [...tr.children].filter((c) => c.localName === "td");
    if (cells.length !== heads.length) out.problems.push(`row ${ri + 1} has ${cells.length} cells, the header ${heads.length}`);
    cells.forEach((td, ci) => {
      const h = heads[ci];
      if (h && Math.abs(r(td).left - r(h).left) > 1) out.problems.push(`column ${ci + 1} ("${out.headers[ci]}") row ${ri + 1} starts ${Math.round(r(td).left - r(h).left)} px off its header`);
      const box = r(td);
      if (getComputedStyle(td).overflow !== "visible") return;
      for (const el of td.querySelectorAll("*")) {
        const b = r(el);
        if (!b.width || !b.height) continue;
        if (b.right > box.right + 1.5 || b.left < box.left - 1.5) spills.add(`${out.headers[ci] || `column ${ci + 1}`}: <${el.localName}${el.className && typeof el.className === "string" ? "." + el.className.split(" ")[0] : ""}> ${Math.round(b.right - box.right)} px past its cell`);
      }
    });
  }
  out.problems.push(...[...spills].slice(0, 6));
  // Sideways: the table's box scrolls when the table is wider; the page never.
  const wrap = table.parentElement;
  const tw = table.scrollWidth;
  if (wrap && tw > wrap.clientWidth + 1) {
    const ox = getComputedStyle(wrap).overflowX;
    if (ox !== "auto" && ox !== "scroll") out.problems.push(`table ${tw} px in a ${wrap.clientWidth} px box that does not scroll (${ox})`);
    out.scrollsInside = true;
  }
  const scroller = root.host.parentElement;
  const page = document.scrollingElement;
  if (page.scrollWidth > innerWidth + 1) out.problems.push(`the page scrolls sideways (${page.scrollWidth} > ${innerWidth})`);
  out.width = Math.round(r(table).width);
  out.box = wrap ? Math.round(wrap.clientWidth) : null;
  void scroller;
  return out;
}

/** The dashboard's task table: a CSS grid of rows on one subgrid. */
function measureTaskGrid() {
  const panel = document.querySelector("home-assistant")?.shadowRoot?.querySelector("home-assistant-main")?.shadowRoot
    ?.querySelector("ha-drawer partial-panel-resolver ha-panel-custom maintenance-supporter-panel");
  const root = panel?.shadowRoot;
  const table = root?.querySelector(".task-table");
  if (!table) return { missing: true };
  const r = (el) => el.getBoundingClientRect();
  const problems = [];
  const rows = [...table.querySelectorAll(".task-row:not(.virt-sizer)")].filter((x) => r(x).height > 0);
  const CELLS = [".bulk-check", ".cell-badges", ".cell.object-name", ".cell.task-name", ".cell.type", ".due-cell", ".row-actions"];
  const lefts = Object.fromEntries(CELLS.map((c) => [c, []]));
  for (const row of rows) {
    const cells = CELLS.map((c) => [c, row.querySelector(`:scope > ${c}`)]).filter(([, el]) => el && r(el).width > 0);
    for (const [c, el] of cells) lefts[c].push(r(el).left);
    for (let i = 0; i + 1 < cells.length; i++) {
      const a = r(cells[i][1]);
      const b = r(cells[i + 1][1]);
      if (Math.abs(a.top - b.top) < 4 && a.right > b.left + 1.5) problems.push(`"${(row.querySelector(".cell.task-name")?.textContent || "").trim().slice(0, 30)}": ${cells[i][0]} runs ${Math.round(a.right - b.left)} px into ${cells[i + 1][0]}`);
    }
    const box = r(row);
    for (const el of row.querySelectorAll(":scope > *")) {
      const b = r(el);
      if (b.width && b.right > box.right + 1.5) problems.push(`"${(row.querySelector(".cell.task-name")?.textContent || "").trim().slice(0, 30)}": ${el.className} ${Math.round(b.right - box.right)} px past the row`);
    }
  }
  for (const [c, xs] of Object.entries(lefts)) {
    if (xs.length < 2) continue;
    const spread = Math.max(...xs) - Math.min(...xs);
    if (spread > 1.5 && c !== ".row-actions") problems.push(`${c} starts at ${Math.round(Math.min(...xs))}…${Math.round(Math.max(...xs))} px across rows`);
  }
  const page = document.scrollingElement;
  if (page.scrollWidth > innerWidth + 1) problems.push(`the page scrolls sideways (${page.scrollWidth} > ${innerWidth})`);
  return { problems: [...new Set(problems)].slice(0, 8), rows: rows.length };
}

async function runCombo(mode, browserName, vp) {
  const combo = `${mode} ${browserName}/${vp.name}`;
  await ws("global/update", { settings: { advanced_beta_editor_visible: mode === "beta" } });
  const browser = await pw[browserName].connect("ws://127.0.0.1:3000/");
  const ctx = await browser.newContext({ ...contextOptions(browserName, vp, "en"), locale: "en-US" });
  await ctx.addInitScript(hassTokensInit, { t: token, ha: HA });
  await ctx.addInitScript(() => { try { localStorage.setItem("selectedLanguage", JSON.stringify("en")); } catch { /* private */ } });
  const page = await ctx.newPage();
  const panel = page.locator("maintenance-supporter-panel");
  const shot = async (name) => { if (SHOTS) await page.screenshot({ path: `${SHOTS}/${combo.replace(/[ /]/g, "-")}-${name}.png` }).catch(() => {}); };
  const tap = async (loc) => {
    await loc.waitFor({ timeout: 10_000 });
    try { await loc.click({ timeout: 3000 }); } catch { await loc.click({ force: true }); }
    await sleep(500);
  };
  const narrow = () => panel.evaluate((p) => !!p.narrow);
  // A goto to the address already open is a reload in Chrome and keeps the
  // history state, and the panel goes back to the page that state names (F5
  // keeps the page since 2026-11-01): each visit starts without it.
  const freshVisit = async () => {
    await page.evaluate(() => history.replaceState(null, "")).catch(() => {});
    await page.goto(`${HA}/maintenance-supporter`);
  };
  try {
    await freshVisit();
    await panel.locator(".stats-bar .stat-item").first().waitFor({ timeout: 60_000 });
    await sleep(2000);

    // The column choice, clicked in Settings (once per mode, on a desktop).
    if (vp.name === "desktop-1440" && browserName === "chromium") {
      const problems = [];
      await tap(panel.locator("ha-tab-group ha-tab, ha-tab, .tab, [role=tab]").filter({ hasText: /^\s*Settings\s*$/ }).first());
      const section = panel.locator("maintenance-settings-view").locator('[data-section="objects_table_columns"]');
      await section.waitFor({ timeout: 15_000 });
      await section.scrollIntoViewIfNeeded();
      for (const want of [ALL, SETS.default]) {
        for (const label of ["Notes", "Manual", "Reference number"]) {
          const row = section.locator(".setting-row").filter({ hasText: label }).first();
          if (!(await row.count())) continue;
          const box = row.locator("ha-checkbox, ha-switch, input[type=checkbox]").first();
          const on = await box.evaluate((b) => !!b.checked);
          const key = { Notes: "notes", Manual: "documentation_url", "Reference number": "ref_no" }[label];
          if (on !== want.includes(key)) await tap(box);
        }
        await sleep(1200);
        const stored = (await ws("settings")).objects_table_columns || [];
        for (const key of ["notes", "documentation_url", "ref_no"]) {
          if (stored.includes(key) !== want.includes(key)) problems.push(`"${key}" ${want.includes(key) ? "ticked but not stored" : "unticked but still stored"}`);
        }
      }
      await shot("settings-columns");
      record(combo, "Settings › Objects table columns: tick and untick", problems);
    }

    // The objects table, column set by column set.
    for (const [setName, cols] of Object.entries(SETS)) {
      await ws("global/update", { settings: { objects_table_columns: cols } });
      await freshVisit();
      await panel.locator(".stats-bar .stat-item").first().waitFor({ timeout: 60_000 });
      await sleep(1500);
      await tap(panel.locator(".stats-bar .stat-item.clickable").first());
      await sleep(800);
      if (await narrow()) {
        const tables = await panel.locator(".objects-table").count();
        record(combo, `objects (${setName}): cards on a narrow screen`, tables ? ["a table on a narrow screen"] : []);
        if (setName === "all") await shot(`objects-cards`);
        continue;
      }
      const toggle = panel.locator(".view-toggle-btn").nth(1);
      if (!(await toggle.evaluate((b) => b.classList.contains("active")))) await tap(toggle);
      await panel.locator(".objects-table").first().waitFor({ timeout: 10_000 });
      await sleep(600);
      const m = await page.evaluate(measureTable, ".objects-table");
      const problems = [...(m.problems || [])];
      if (m.missing) problems.push("no table");
      else {
        const labels = { name: "Name", ref_no: "Ref", manufacturer: "Manufacturer", model: "Model", task_count: "Tasks" };
        if (m.headers.length !== cols.length) problems.push(`${m.headers.length} headers for ${cols.length} columns`);
        cols.forEach((c, i) => { if (labels[c] && !new RegExp(labels[c], "i").test(m.headers[i] || "")) problems.push(`header ${i + 1} is "${m.headers[i]}", expected ${c}`); });
        if (!m.rows) problems.push("no rows");
      }
      if (cols.includes("actions") && !m.missing) {
        const btn = panel.locator(".objects-table tbody tr").first().locator("td.oc-actions ha-icon-button, td.oc-actions ha-button, td.oc-actions button").first();
        if (await btn.count()) { if (!(await tapLands(btn))) problems.push("the first row's action button takes no tap"); }
      }
      record(combo, `objects table (${setName}, ${m.rows ?? 0} rows${m.scrollsInside ? `, ${m.width} px scrolls in ${m.box} px` : ""})`, problems);
      if (problems.length || setName === "all" || setName === "default") await shot(`objects-${setName}`);
      // Select mode adds a column in front.
      if (setName === "all") {
        await tap(panel.locator(".obj-bulk-toggle").first());
        await sleep(600);
        const mb = await page.evaluate(measureTable, ".objects-table");
        const p2 = [...(mb.problems || [])];
        if (!mb.missing && mb.headers.length !== cols.length + 1) p2.push(`${mb.headers.length} headers in select mode for ${cols.length + 1} columns`);
        record(combo, `objects table (all) in select mode`, p2);
        if (p2.length) await shot(`objects-all-select`);
        await tap(panel.locator(".obj-bulk-toggle").first());
      }
    }

    // The dashboard task table: flat, select mode, grouped. The new look's
    // selection toggle is the chip in the list's toolbar (HA's list pages).
    const selectToggle = () => panel.locator(mode === "beta" ? ".ms-toolbar .ms-chip.icon-only" : ".bulk-toggle").first();
    await freshVisit();
    await panel.locator(".stats-bar .stat-item").first().waitFor({ timeout: 60_000 });
    await sleep(1500);
    await panel.evaluate((p) => { p._view = "overview"; p._setOverviewTab("dashboard"); });
    await sleep(1500);
    let g = await page.evaluate(measureTaskGrid);
    record(combo, `task table (${g.rows ?? 0} rows)`, g.missing ? ["no task table"] : g.problems);
    await shot("tasks");
    if (await panel.locator(".filter-bar.collapsed").count()) await tap(panel.locator(".mobile-toggle").first());
    await tap(selectToggle());
    await sleep(800);
    g = await page.evaluate(measureTaskGrid);
    record(combo, `task table in select mode`, g.missing ? ["no task table"] : g.problems);
    if (g.problems?.length) await shot("tasks-select");
    await tap(selectToggle());
    for (const mode of ["object", "area"]) {
      await panel.evaluate((p, m) => { p._groupByMode = m; }, mode);
      await sleep(1200);
      g = await page.evaluate(measureTaskGrid);
      record(combo, `task table grouped by ${mode}`, g.missing ? ["no task table"] : g.problems);
      if (g.problems?.length || mode === "object") await shot(`tasks-by-${mode}`);
    }
    await panel.evaluate((p) => { p._groupByMode = "none"; });

    // The all-parts table.
    await panel.evaluate((p) => p._showAllParts());
    await sleep(2000);
    const parts = await page.evaluate(measureTable, ".objects-table");
    if (parts.missing) record(combo, "all-parts table", (await panel.locator(".empty-state").count()) ? [] : ["no table and no empty state"]);
    else record(combo, `all-parts table (${parts.rows} rows${parts.scrollsInside ? `, ${parts.width} px scrolls in ${parts.box} px` : ""})`, parts.problems);
    await shot("parts");
  } catch (e) {
    await shot("error");
    record(combo, "run", [`error: ${e.message.split("\n")[0]}`]);
  } finally {
    await ctx.close().catch(() => {});
    await browser.close().catch(() => {});
  }
}

for (const mode of MODES) {
  for (const b of BROWSERS) for (const vp of VIEWPORTS) await runCombo(mode, b, vp);
}
await ws("global/update", { settings: { advanced_beta_editor_visible: betaBefore, ...(colsBefore ? { objects_table_columns: colsBefore } : {}) } });
api.close();
log(`\n${results.length - failures.length}/${results.length} checks passed`);
if (failures.length) log("FAILURES:\n  " + failures.join("\n  "));
process.exit(failures.length ? 1 : 0);
