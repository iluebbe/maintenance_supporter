/**
 * Capture README screenshots for the Maintenance Supporter integration.
 *
 * Prerequisites:
 *   docker compose up -d                           # ha-dev
 *   docker compose --profile testing up -d          # playwright
 *   python scripts/setup_demo.py && python scripts/seed_history.py
 *   docker compose restart homeassistant-dev
 *
 * Usage:
 *   cd custom_components/maintenance_supporter/frontend-src
 *   node capture-readme-screenshots.mjs
 *
 * Or with explicit refresh token:
 *   HA_REFRESH_TOKEN=<token> node capture-readme-screenshots.mjs
 */

import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HA = "http://homeassistant-dev:8123";
const OUTPUT = path.resolve(__dirname, "../../../docs/images");

// ---------------------------------------------------------------------------
// Refresh token: env var or auto-extract from HA auth storage
// ---------------------------------------------------------------------------
function getRefreshToken() {
  if (process.env.HA_REFRESH_TOKEN) return process.env.HA_REFRESH_TOKEN;
  const authPath = path.resolve(__dirname, "../../../docker/config-dev/.storage/auth");
  try {
    const auth = JSON.parse(fs.readFileSync(authPath, "utf8"));
    const tok = auth.data.refresh_tokens.find(
      (t) => t.client_id === "http://homeassistant-dev:8123/" && t.token_type === "normal"
    );
    if (tok) return tok.token;
  } catch { /* fall through */ }
  console.error("Set HA_REFRESH_TOKEN or ensure docker/config-dev/.storage/auth exists");
  process.exit(1);
}

const REFRESH = getRefreshToken();
fs.mkdirSync(OUTPUT, { recursive: true });

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function panelJS() {
  return `
    var ha = document.querySelector('home-assistant');
    var main = ha && ha.shadowRoot && ha.shadowRoot.querySelector('home-assistant-main');
    var drawer = main && main.shadowRoot && main.shadowRoot.querySelector('ha-drawer');
    var resolver = drawer && drawer.querySelector('partial-panel-resolver');
    var custom = resolver && resolver.querySelector('ha-panel-custom');
    var p = custom && custom.querySelector('maintenance-supporter-panel');
  `;
}

async function login(page) {
  await page.goto(HA);
  await page.waitForTimeout(1000);
  await page.evaluate((refresh) => {
    localStorage.setItem("hassTokens", JSON.stringify({
      hassUrl: "http://homeassistant-dev:8123",
      clientId: "http://homeassistant-dev:8123/",
      refresh_token: refresh,
      access_token: "",
      token_type: "Bearer",
      expires_in: 1800,
      expires: 0,
    }));
  }, REFRESH);
  await page.goto(HA + "/maintenance-supporter");
  await page.waitForTimeout(8000);
}

async function setEnglish(page) {
  // Set language to English via WS — fire and forget, don't await the WS result
  try {
    await page.evaluate(() => {
      const ha = document.querySelector("home-assistant");
      const hass = ha && (ha.__hass || ha.hass);
      if (hass && hass.connection) {
        hass.connection.sendMessage({
          type: "frontend/set_user_data",
          key: "language",
          value: { language: "en", number_format: "language" },
        });
      }
    });
    // Reload panel to apply language
    await page.goto(HA + "/maintenance-supporter");
    await page.waitForTimeout(8000);
  } catch {
    // If language change fails, continue with default locale
    console.log("  (language change skipped, using default locale)");
  }
}

async function getObjectData(page, maxWait = 30000) {
  const start = Date.now();
  while (Date.now() - start < maxWait) {
    const raw = await page.evaluate(`{
      ${panelJS()}
      var result = [];
      if (p && p._objects) {
        for (var i = 0; i < p._objects.length; i++) {
          var obj = p._objects[i];
          var tasks = [];
          if (obj.tasks) for (var j = 0; j < obj.tasks.length; j++) {
            tasks.push({ id: obj.tasks[j].id, name: obj.tasks[j].name,
              checklist: obj.tasks[j].checklist || [],
              adaptive: !!(obj.tasks[j].adaptive_config && obj.tasks[j].adaptive_config.enabled) });
          }
          result.push({ entry_id: obj.entry_id, name: obj.object.name, tasks: tasks });
        }
      }
      JSON.stringify(result);
    }`);
    const data = JSON.parse(raw);
    if (data.length > 0) return data;
    await page.waitForTimeout(1000);
  }
  throw new Error("Timed out waiting for panel objects to load");
}

function find(objects, objName, taskName) {
  const obj = objects.find((o) => o.name === objName);
  if (!obj) throw new Error(`Object '${objName}' not found`);
  if (!taskName) return { entryId: obj.entry_id, obj };
  const task = obj.tasks.find((t) => t.name === taskName);
  if (!task) throw new Error(`Task '${taskName}' not found in '${objName}'`);
  return { entryId: obj.entry_id, taskId: task.id, task, obj };
}

async function shot(page, name) {
  const filePath = path.join(OUTPUT, name);
  await page.screenshot({ path: filePath });
  console.log(`  ${name}`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const browser = await chromium.connect("ws://localhost:3000");
console.log("Connected to Playwright server\n");

// ======================== DESKTOP (1280×900) ========================
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: "en" });
const page = await ctx.newPage();
await login(page);
await setEnglish(page);

const objects = await getObjectData(page);
console.log(`Found ${objects.length} objects: ${objects.map((o) => o.name).join(", ")}\n`);

// 1. Overview
console.log("Desktop screenshots:");
await shot(page, "overview.png");

// 2. Object detail — Electric Car (most tasks)
const ev = find(objects, "Electric Car");
await page.evaluate(`{ ${panelJS()} if (p) p._showObject('${ev.entryId}'); }`);
await page.waitForTimeout(2000);
await shot(page, "object-detail.png");

// 3. Task detail — HVAC Filter Replacement (threshold trigger with history)
const hvac = find(objects, "HVAC System", "Filter Replacement");
await page.evaluate(`{ ${panelJS()} if (p) p._showTask('${hvac.entryId}', '${hvac.taskId}'); }`);
await page.waitForTimeout(3000);
await shot(page, "task-detail.png");

// 4. Task history — Washing Machine Drum Cleaning (8 entries)
const wm = find(objects, "Washing Machine", "Drum Cleaning");
await page.evaluate(`{ ${panelJS()} if (p) p._showTask('${wm.entryId}', '${wm.taskId}'); }`);
await page.waitForTimeout(2000);
// Switch to history tab
await page.evaluate(`{
  ${panelJS()}
  if (p) {
    var tabs = p.shadowRoot && p.shadowRoot.querySelectorAll('.tab-btn');
    if (tabs && tabs.length > 1) tabs[1].click();
  }
}`);
await page.waitForTimeout(1500);
await shot(page, "task-history.png");

// 5. Complete dialog — use a task with checklist if possible
const pool = find(objects, "Swimming Pool", "pH Test");
await page.evaluate(`{ ${panelJS()} if (p) p._showTask('${pool.entryId}', '${pool.taskId}'); }`);
await page.waitForTimeout(2000);
await page.evaluate(`{
  ${panelJS()}
  if (p) p._openCompleteDialog('${pool.entryId}', '${pool.taskId}', 'pH Test',
    ${JSON.stringify(pool.task.checklist)}, ${pool.task.adaptive});
}`);
await page.waitForTimeout(1500);
await shot(page, "complete-dialog.png");
// Close dialog
await page.keyboard.press("Escape");
await page.waitForTimeout(500);

// 6. QR dialog
await page.evaluate(`{
  ${panelJS()}
  if (p) p._openQrForTask('${hvac.entryId}', '${hvac.taskId}', 'HVAC System', 'Filter Replacement');
}`);
await page.waitForTimeout(3000);
await shot(page, "qr-dialog.png");
await page.keyboard.press("Escape");
await page.waitForTimeout(500);

// 7. Config flow — integration page
await page.goto(HA + "/config/integrations/integration/maintenance_supporter");
await page.waitForTimeout(4000);
await shot(page, "config-flow.png");

// 8. Lovelace card — create temp dashboard via REST then screenshot
try {
  // Create dashboard via lovelace WS — must return a promise
  const created = await page.evaluate(() => {
    return new Promise((resolve, reject) => {
      const ha = document.querySelector("home-assistant");
      const hass = ha && (ha.__hass || ha.hass);
      if (!hass || !hass.connection) { reject(new Error("no hass")); return; }
      hass.connection.sendMessagePromise({
        type: "lovelace/dashboards/create",
        url_path: "maintenance-demo",
        title: "Maintenance Demo",
        mode: "storage",
      }).then(() => resolve(true)).catch((e) => {
        // Dashboard may already exist, try saving config directly
        resolve(true);
      });
    });
  });
  // Save config to the dashboard
  await page.evaluate(() => {
    return new Promise((resolve) => {
      const ha = document.querySelector("home-assistant");
      const hass = ha && (ha.__hass || ha.hass);
      if (!hass) { resolve(); return; }
      hass.connection.sendMessagePromise({
        type: "lovelace/config/save",
        url_path: "maintenance-demo",
        config: {
          title: "Maintenance Demo",
          views: [{
            title: "Overview",
            cards: [{
              type: "custom:maintenance-supporter-card",
              title: "Maintenance Overview",
              show_header: true,
              show_actions: true,
            }],
          }],
        },
      }).then(() => resolve()).catch(() => resolve());
    });
  });
  await page.goto(HA + "/maintenance-demo/0");
  await page.waitForTimeout(6000);
  await shot(page, "lovelace-card.png");
  // Cleanup
  await page.evaluate(() => {
    const ha = document.querySelector("home-assistant");
    const hass = ha && (ha.__hass || ha.hass);
    if (hass) {
      hass.connection.sendMessagePromise({
        type: "lovelace/dashboards/delete",
        dashboard_id: "maintenance-demo",
      }).catch(() => {});
    }
  });
} catch (e) {
  console.log("  lovelace-card.png SKIPPED:", e.message);
}

// 9. Calendar
await page.goto(HA + "/calendar");
await page.waitForTimeout(4000);
await shot(page, "calendar.png");

// 10. Entity attributes — Developer Tools > States
await page.goto(HA + "/developer-tools/state");
await page.waitForTimeout(3000);
// Try to set the entity filter
try {
  await page.evaluate(() => {
    const ha = document.querySelector("home-assistant");
    const main = ha && ha.shadowRoot && ha.shadowRoot.querySelector("home-assistant-main");
    const drawer = main && main.shadowRoot && main.shadowRoot.querySelector("ha-drawer");
    const resolver = drawer && drawer.querySelector("partial-panel-resolver");
    const devTools = resolver && resolver.querySelector("ha-panel-developer-tools");
    if (!devTools) return;
    const sr = devTools.shadowRoot;
    if (!sr) return;
    const stateTab = sr.querySelector("developer-tools-state");
    if (!stateTab) return;
    const sr2 = stateTab.shadowRoot;
    if (!sr2) return;
    const input = sr2.querySelector("ha-textfield") || sr2.querySelector("input");
    if (input) {
      input.value = "sensor.maintenance_";
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }
  });
  await page.waitForTimeout(2000);
} catch { /* filter may fail, still take screenshot */ }
await shot(page, "entity-attributes.png");

await ctx.close();

// ======================== MOBILE (375×812) ========================
console.log("\nMobile screenshots:");
const mCtx = await browser.newContext({ viewport: { width: 375, height: 812 }, locale: "en", isMobile: true });
const mPage = await mCtx.newPage();
await login(mPage);
// Skip setEnglish for mobile — sendMessage can crash mobile contexts

const mObjects = await getObjectData(mPage);

// 11. Mobile overview
await shot(mPage, "mobile-overview.png");

// 12. Mobile task detail
const mHvac = find(mObjects, "HVAC System", "Filter Replacement");
await mPage.evaluate(`{ ${panelJS()} if (p) p._showTask('${mHvac.entryId}', '${mHvac.taskId}'); }`);
await mPage.waitForTimeout(2000);
await shot(mPage, "mobile-task.png");

await mCtx.close();
await browser.close();

console.log(`\nAll screenshots saved to ${OUTPUT}`);
