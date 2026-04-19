/**
 * Comprehensive E2E test suite for the Maintenance Supporter panel.
 *
 * Prerequisites:
 *   docker compose up -d                # ha-maint + playwright
 *   docker restart playwright-server    # clean session
 *
 * Usage:
 *   cd custom_components/maintenance_supporter/frontend-src
 *   node e2e-test.mjs                   # auto-fetches refresh token
 *   HA_REFRESH_TOKEN=... node e2e-test.mjs   # explicit token
 */
import { setup, ws, openEditDialog, readDialogSelects, readDialogFields, cleanup } from "./e2e-helpers.mjs";

let passed = 0, failed = 0, skipped = 0;
function check(name, ok) {
  if (ok) { passed++; console.log("  PASS " + name); }
  else { failed++; console.log("  FAIL " + name); }
}

async function runTest(name, fn) {
  console.log("\n=== " + name + " ===");
  try { await fn(); }
  catch (e) { failed++; console.log("  ERROR: " + e.message); }
}

// ═══════════════════════════════════════════════════════════════
// DESKTOP TESTS
// ═══════════════════════════════════════════════════════════════
const { browser, ctx, page } = await setup();
const ENTRY = (await ws(page, { type: "maintenance_supporter/objects" })).objects[0].entry_id;

await runTest("Sort dropdown exists with 4 modes", async () => {
  const selects = await page.evaluate(() => {
    const ha = document.querySelector("home-assistant");
    const main = ha?.shadowRoot?.querySelector("home-assistant-main");
    const drawer = main?.shadowRoot?.querySelector("ha-drawer");
    const resolver = drawer?.querySelector("partial-panel-resolver");
    const custom = resolver?.querySelector("ha-panel-custom");
    const panel = custom?.querySelector("maintenance-supporter-panel");
    const sr = panel?.shadowRoot;
    const filterBar = sr?.querySelector(".filter-bar");
    if (!filterBar) return [];
    return [...filterBar.querySelectorAll("select")].map(s => ({
      options: [...s.options].map(o => o.value),
    }));
  });
  const sortSelect = selects.find(s => s.options.includes("due_date"));
  check("sort dropdown found", !!sortSelect);
  check("has 4 sort options", sortSelect?.options.length === 4);
});

await runTest("All Objects view via KPI click", async () => {
  const clicked = await page.evaluate(() => {
    const ha = document.querySelector("home-assistant");
    const sr = ha?.shadowRoot?.querySelector("home-assistant-main")?.shadowRoot?.querySelector("ha-drawer")?.querySelector("partial-panel-resolver")?.querySelector("ha-panel-custom")?.querySelector("maintenance-supporter-panel")?.shadowRoot;
    const item = sr?.querySelector(".stat-item.clickable");
    if (item) { item.click(); return true; }
    return false;
  });
  check("KPI clickable", clicked);
  await page.waitForTimeout(1000);
  const cards = await page.evaluate(() => {
    const ha = document.querySelector("home-assistant");
    const sr = ha?.shadowRoot?.querySelector("home-assistant-main")?.shadowRoot?.querySelector("ha-drawer")?.querySelector("partial-panel-resolver")?.querySelector("ha-panel-custom")?.querySelector("maintenance-supporter-panel")?.shadowRoot;
    return sr?.querySelectorAll(".object-card")?.length ?? 0;
  });
  check("object cards rendered", cards > 0);
});

// Reload panel to reset view state after All Objects test
await page.goto("http://homeassistant-dev:8123/maintenance-supporter");
await page.waitForTimeout(5000);

await runTest("Select dropdowns preserve values on edit", async () => {
  const objs = await ws(page, { type: "maintenance_supporter/objects" });
  let triggerTask = null, triggerEntry = null;
  for (const o of objs.objects) {
    for (const t of o.tasks) {
      if (t.trigger_config?.type) { triggerTask = t; triggerEntry = o.entry_id; break; }
    }
    if (triggerTask) break;
  }
  if (!triggerTask) { skipped++; console.log("  SKIP: no sensor-trigger task"); return; }
  await openEditDialog(page, triggerEntry, triggerTask);
  const selects = await readDialogSelects(page);
  for (const s of selects) {
    check(s.label + " selected matches value", s.match);
  }
  await page.keyboard.press("Escape");
});

await runTest("Last performed field in task dialog", async () => {
  const cr = await ws(page, {
    type: "maintenance_supporter/task/create", entry_id: ENTRY,
    name: "E2E LP Test", task_type: "service", schedule_type: "time_based",
    interval_days: 30, last_performed: "2025-11-01", enabled: true,
  });
  // Reload so panel picks up the new task
  await page.goto("http://homeassistant-dev:8123/maintenance-supporter");
  await page.waitForTimeout(5000);
  const obj = await ws(page, { type: "maintenance_supporter/object", entry_id: ENTRY });
  const task = obj.tasks.find(t => t.id === cr.task_id);
  await openEditDialog(page, ENTRY, task);
  const fields = await readDialogFields(page);
  console.log("  Fields found:", fields.length, fields.map(f => f.type + ":" + f.label?.slice(0, 20)).join(", "));
  const dateField = fields.find(f => f.type === "date");
  check("date field exists", !!dateField);
  check("date value correct", dateField?.value === "2025-11-01");
  await page.keyboard.press("Escape");
  await ws(page, { type: "maintenance_supporter/task/delete", entry_id: ENTRY, task_id: cr.task_id });
});

await runTest("Task create with enabled field (Bug #14 regression)", async () => {
  const r = await ws(page, {
    type: "maintenance_supporter/task/create", entry_id: ENTRY,
    name: "E2E Enabled Test", task_type: "cleaning", schedule_type: "time_based",
    interval_days: 30, enabled: true,
  });
  check("create with enabled succeeds", !!r.task_id);
  if (r.task_id) await ws(page, { type: "maintenance_supporter/task/delete", entry_id: ENTRY, task_id: r.task_id });
});

await runTest("Reset with date field (Bug #12 regression)", async () => {
  const objs = await ws(page, { type: "maintenance_supporter/objects" });
  const t = objs.objects[0].tasks[0];
  try {
    await ws(page, { type: "maintenance_supporter/task/reset", entry_id: ENTRY, task_id: t.id, date: "2026-04-01" });
    check("reset with date succeeds", true);
  } catch (e) {
    check("reset with date succeeds", false);
  }
});

await runTest("Desktop header bar hidden on overview", async () => {
  await page.goto("http://homeassistant-dev:8123/maintenance-supporter");
  await page.waitForTimeout(3000);
  const headerVisible = await page.evaluate(() => {
    const ha = document.querySelector("home-assistant");
    const sr = ha?.shadowRoot?.querySelector("home-assistant-main")?.shadowRoot?.querySelector("ha-drawer")?.querySelector("partial-panel-resolver")?.querySelector("ha-panel-custom")?.querySelector("maintenance-supporter-panel")?.shadowRoot;
    const header = sr?.querySelector(".header");
    if (!header) return false;
    const style = window.getComputedStyle(header);
    return style.display !== "none" && header.offsetHeight > 0;
  });
  check("header NOT visible on desktop overview", !headerVisible);
});

await cleanup(browser, ctx);

// Reconnect for timezone + mobile tests
import { chromium } from "playwright";
const browser2 = await chromium.connect("ws://localhost:3000");

// ═══════════════════════════════════════════════════════════════
// TIMEZONE + MOBILE TESTS (reuse same browser connection)
// ═══════════════════════════════════════════════════════════════
await runTest("Date formatting in US timezone (Bug #21)", async () => {
  const tzCtx = await browser2.newContext({ viewport: { width: 800, height: 600 }, locale: "en-US", timezoneId: "America/New_York" });
  const tzPage = await tzCtx.newPage();
  await tzPage.goto("about:blank");
  const r = await tzPage.evaluate(() => ({
    utc: new Date("2025-11-01").toLocaleDateString("en-US"),
    local: new Date("2025-11-01T00:00:00").toLocaleDateString("en-US"),
  }));
  check("UTC parse shows wrong date (Oct 31)", r.utc.includes("10/31"));
  check("Local parse shows correct date (Nov)", r.local.includes("11/"));
  await tzCtx.close();
});

await runTest("Mobile hamburger menu button", async () => {
  const mobCtx = await browser2.newContext({ viewport: { width: 375, height: 812 }, locale: "en-US", colorScheme: "dark", isMobile: true });
  const mobPage = await mobCtx.newPage();
  await mobPage.goto("http://homeassistant-dev:8123");
  await mobPage.waitForTimeout(1000);
  await mobPage.evaluate((r) => localStorage.setItem("hassTokens", JSON.stringify({
    hassUrl: "http://homeassistant-dev:8123", clientId: "http://homeassistant-dev:8123/",
    refresh_token: r, access_token: "", token_type: "Bearer", expires_in: 1800, expires: 0,
  })), process.env.HA_REFRESH_TOKEN);
  await mobPage.goto("http://homeassistant-dev:8123/maintenance-supporter");
  await mobPage.waitForTimeout(7000);
  const hasMenu = await mobPage.evaluate(() => {
    const ha = document.querySelector("home-assistant");
    const sr = ha?.shadowRoot?.querySelector("home-assistant-main")?.shadowRoot?.querySelector("ha-drawer")?.querySelector("partial-panel-resolver")?.querySelector("ha-panel-custom")?.querySelector("maintenance-supporter-panel")?.shadowRoot;
    return !!sr?.querySelector("ha-menu-button");
  });
  check("ha-menu-button visible on mobile", hasMenu);
  await mobCtx.close();
});

await cleanup(browser2, { close() {} });

// ═══════════════════════════════════════════════════════════════
console.log("\n" + "═".repeat(50));
console.log(`RESULTS: ${passed} passed, ${failed} failed, ${skipped} skipped`);
if (failed > 0) { console.log("SOME TESTS FAILED!"); process.exit(1); }
else console.log("ALL TESTS PASSED!");
