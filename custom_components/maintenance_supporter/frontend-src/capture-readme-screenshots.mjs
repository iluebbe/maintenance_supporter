/**
 * Capture README screenshots for the Maintenance Supporter integration.
 *
 * Prerequisites:
 *   docker compose up -d                           # ha-maint
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
// Access token: env var or auto-extract from docker/.env
// ---------------------------------------------------------------------------
function getAccessToken() {
  if (process.env.HA_TOKEN) return process.env.HA_TOKEN;
  const envPath = path.resolve(__dirname, "../../../docker/.env");
  try {
    const lines = fs.readFileSync(envPath, "utf8").split("\n");
    for (const line of lines) {
      if (line.startsWith("HA_TOKEN=")) return line.split("=")[1].trim();
    }
  } catch { /* fall through */ }
  console.error("Set HA_TOKEN or ensure docker/.env exists with HA_TOKEN=...");
  process.exit(1);
}

const ACCESS_TOKEN = getAccessToken();
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
  await page.evaluate((token) => {
    localStorage.setItem("hassTokens", JSON.stringify({
      hassUrl: "http://homeassistant-dev:8123",
      clientId: "http://homeassistant-dev:8123/",
      refresh_token: "",
      access_token: token,
      token_type: "Bearer",
      expires_in: 86400,
      expires: Date.now() + 86400000,
    }));
  }, ACCESS_TOKEN);
  await page.goto(HA + "/maintenance-supporter");
  await page.waitForTimeout(8000);
}

/** Returns true if page is still alive, false if it crashed. */
async function setEnglishDark(page) {
  try {
    await page.evaluate(async () => {
      const ha = document.querySelector("home-assistant");
      const hass = ha && (ha.__hass || ha.hass);
      if (hass && hass.connection) {
        await hass.connection.sendMessagePromise({
          type: "frontend/set_user_data",
          key: "language",
          value: { language: "en", number_format: "language" },
        });
        await hass.connection.sendMessagePromise({
          type: "frontend/set_user_data",
          key: "core",
          value: { selectedTheme: { theme: "default", dark: true } },
        });
      }
    });
    await page.goto(HA + "/maintenance-supporter");
    await page.waitForTimeout(8000);
    return true;
  } catch {
    console.log("  (language/theme change crashed, will recover)");
    return false;
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
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: "en", colorScheme: "dark" });
let page = await ctx.newPage();
await login(page);
const langOk = await setEnglishDark(page);
if (!langOk) {
  // Language change crashed the page — recreate and re-login
  try { await page.close(); } catch { /* already dead */ }
  page = await ctx.newPage();
  await login(page);
}

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

// 3. Task detail — HVAC Filter Replacement (threshold trigger with sparkline)
const hvac = find(objects, "HVAC System", "Filter Replacement");
await page.evaluate(`{ ${panelJS()} if (p) p._showTask('${hvac.entryId}', '${hvac.taskId}'); }`);
await page.waitForTimeout(5000);
await shot(page, "task-detail.png");

// 3b. Multi-entity trigger — Electric Car Tire Pressure Check (4 sensors, threshold < 2.0 bar)
const tire = find(objects, "Electric Car", "Tire Pressure Check");
await page.evaluate(`{ ${panelJS()} if (p) p._showTask('${tire.entryId}', '${tire.taskId}'); }`);
await page.waitForTimeout(5000);
await shot(page, "multi-entity-trigger.png");

// 3c. Compound trigger — Water Filter System (OR: threshold + counter)
const wf = find(objects, "Water Filter System", "Cartridge Replacement");
await page.evaluate(`{ ${panelJS()} if (p) p._showTask('${wf.entryId}', '${wf.taskId}'); }`);
await page.waitForTimeout(5000);
await shot(page, "compound-trigger.png");

// 4. Task history — Washing Machine Drum Cleaning (8 entries)
const wm = find(objects, "Washing Machine", "Drum Cleaning");
await page.evaluate(`{ ${panelJS()} if (p) p._showTask('${wm.entryId}', '${wm.taskId}'); }`);
await page.waitForTimeout(2000);
// Switch to history tab
await page.evaluate(`{
  ${panelJS()}
  if (p) {
    var tabs = p.shadowRoot && p.shadowRoot.querySelectorAll('.tab');
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

// 9. Calendar — show month view with maintenance events
await page.goto(HA + "/calendar");
await page.waitForTimeout(5000);
// Enable the maintenance calendar checkbox
try {
  // Pre-select the maintenance calendar in localStorage so the panel shows it
  await page.evaluate(() => {
    // HA stores selected calendars in hass-panel-calendar-selected per-user
    // Try to find and click the checkbox through shadow DOM
    const ha = document.querySelector("home-assistant");
    const main = ha?.shadowRoot?.querySelector("home-assistant-main");
    const drawer = main?.shadowRoot?.querySelector("ha-drawer");
    const resolver = drawer?.querySelector("partial-panel-resolver");
    const calPanel = resolver?.querySelector("ha-panel-calendar");
    const sr = calPanel?.shadowRoot;
    if (!sr) return "no-shadow-root";
    // Try ha-check-list-item or ha-checkbox or mwc-checkbox
    const checkItems = sr.querySelectorAll("ha-check-list-item, ha-checkbox-list-item");
    for (const item of checkItems) {
      if (item.textContent?.includes("Maintenance")) {
        if (!item.selected && !item.checked) item.click();
        return "clicked";
      }
    }
    // Try ha-calendar-list-item approach
    const calList = sr.querySelector("ha-sidebar-calendars, .calendars");
    if (calList) {
      const labels = calList.querySelectorAll("label, li, div");
      for (const lbl of labels) {
        if (lbl.textContent?.includes("Maintenance")) {
          const cb = lbl.querySelector("input[type=checkbox], ha-checkbox");
          if (cb && !cb.checked) cb.click();
          return "clicked-inner";
        }
      }
    }
    // Dump what we find for debugging
    return "items:" + sr.innerHTML.substring(0, 500);
  }).then(r => console.log("  calendar checkbox:", r));
  await page.waitForTimeout(3000);
} catch (e) { console.log("  calendar checkbox error:", e.message); }
await shot(page, "calendar.png");

// 10. Sensor attributes — Developer Tools States filtered to show one entity with all attributes
await page.goto(HA + "/developer-tools/state");
await page.waitForTimeout(4000);
try {
  // Filter entities by typing into the search field
  // The filter input is deep in shadow DOM; use evaluate to find and focus it
  await page.evaluate(() => {
    const ha = document.querySelector("home-assistant");
    const main = ha && ha.shadowRoot && ha.shadowRoot.querySelector("home-assistant-main");
    const drawer = main && main.shadowRoot && main.shadowRoot.querySelector("ha-drawer");
    const resolver = drawer && drawer.querySelector("partial-panel-resolver");
    const devTools = resolver && resolver.querySelector("ha-panel-developer-tools");
    if (!devTools || !devTools.shadowRoot) return;
    const statesPanel = devTools.shadowRoot.querySelector("developer-tools-state");
    if (!statesPanel || !statesPanel.shadowRoot) return;
    // Find the entity filter input (search field in the table header)
    const searchInputs = statesPanel.shadowRoot.querySelectorAll("search-input, ha-search-input, input[type=search]");
    // Also try generic inputs
    const allInputs = statesPanel.shadowRoot.querySelectorAll("input");
    const target = searchInputs[0] || allInputs[0];
    if (target) {
      target.focus();
      target.value = "sensor.hvac_system";
      target.dispatchEvent(new Event("input", { bubbles: true }));
      target.dispatchEvent(new Event("change", { bubbles: true }));
    }
  });
  await page.waitForTimeout(1000);
  // Fallback: use keyboard to type into whatever is focused
  await page.keyboard.type("sensor.hvac_system", { delay: 30 });
  await page.waitForTimeout(2000);
} catch { /* filter may not work */ }
await shot(page, "entity-attributes.png");

await ctx.close();

// ======================== MOBILE (375×812) ========================
console.log("\nMobile screenshots:");
try {
  const mCtx = await browser.newContext({ viewport: { width: 375, height: 812 }, locale: "en", isMobile: true, colorScheme: "dark" });
  const mPage = await mCtx.newPage();
  await login(mPage);
  // Skip setEnglishDark for mobile — sendMessage can crash mobile contexts

  const mObjects = await getObjectData(mPage);

  // 11. Mobile overview
  await shot(mPage, "mobile-overview.png");

  // 12. Mobile task detail
  const mHvac = find(mObjects, "HVAC System", "Filter Replacement");
  await mPage.evaluate(`{ ${panelJS()} if (p) p._showTask('${mHvac.entryId}', '${mHvac.taskId}'); }`);
  await mPage.waitForTimeout(2000);
  await shot(mPage, "mobile-task.png");

  await mCtx.close();
} catch (e) {
  console.log("  mobile screenshots SKIPPED:", e.message);
}

// ======================== NOTIFICATION MOCKUP (375×812) ========================
// Rendered as pure HTML/CSS — no HA login needed, own context for stability
console.log("\nNotification mockup:");
const nCtx = await browser.newContext({ viewport: { width: 375, height: 812 }, locale: "en" });
const notifPage = await nCtx.newPage();
await notifPage.setContent(`
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=375, initial-scale=1">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 375px; height: 812px;
    background: linear-gradient(135deg, #0a0a2e 0%, #1a1a3e 30%, #0d2137 70%, #0a1628 100%);
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif;
    -webkit-font-smoothing: antialiased;
    display: flex; flex-direction: column; align-items: center;
    overflow: hidden; position: relative;
  }
  /* Lock screen clock */
  .lock-time {
    margin-top: 120px;
    font-size: 76px; font-weight: 700; letter-spacing: 1px;
    color: #fff;
    text-align: center; line-height: 1;
  }
  .lock-date {
    font-size: 20px; font-weight: 400; color: rgba(255,255,255,0.7);
    margin-top: 6px; text-align: center;
  }
  /* Notification card */
  .notif-card {
    margin-top: 60px; width: 345px;
    background: rgba(255,255,255,0.15);
    backdrop-filter: blur(40px); -webkit-backdrop-filter: blur(40px);
    border-radius: 16px;
    overflow: hidden;
  }
  .notif-header {
    display: flex; align-items: center; gap: 8px;
    padding: 12px 14px 0 14px;
  }
  .notif-icon {
    width: 22px; height: 22px; border-radius: 5px;
    background: #038fc7;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .notif-icon svg { width: 14px; height: 14px; }
  .notif-app {
    font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.6);
    flex: 1;
  }
  .notif-time {
    font-size: 13px; color: rgba(255,255,255,0.45);
  }
  .notif-body { padding: 6px 14px 14px 14px; }
  .notif-title {
    font-size: 15px; font-weight: 600; color: #fff;
    margin-bottom: 3px;
  }
  .notif-message {
    font-size: 15px; font-weight: 400; color: rgba(255,255,255,0.85);
    line-height: 1.35;
  }
  /* Action buttons */
  .notif-actions {
    display: flex;
    border-top: 0.5px solid rgba(255,255,255,0.15);
  }
  .notif-action {
    flex: 1;
    padding: 13px 0;
    text-align: center;
    font-size: 15px; font-weight: 500;
    color: #64d2ff;
    cursor: pointer;
  }
  .notif-action:not(:last-child) {
    border-right: 0.5px solid rgba(255,255,255,0.15);
  }
  /* Home bar indicator */
  .home-bar {
    position: absolute; bottom: 8px;
    width: 134px; height: 5px;
    background: rgba(255,255,255,0.3);
    border-radius: 3px;
  }
</style>
</head>
<body>
  <div class="lock-time">9:41</div>
  <div class="lock-date">Saturday, March 7</div>

  <div class="notif-card">
    <div class="notif-header">
      <div class="notif-icon">
        <svg viewBox="0 0 24 24" fill="white">
          <path d="M12 3L4 9v12h5v-7h6v7h5V9l-8-6z"/>
        </svg>
      </div>
      <span class="notif-app">HOME ASSISTANT</span>
      <span class="notif-time">now</span>
    </div>
    <div class="notif-body">
      <div class="notif-title">Maintenance Overdue!</div>
      <div class="notif-message">Oil Change for Family Car is 3 day(s) overdue!</div>
    </div>
    <div class="notif-actions">
      <div class="notif-action">\u2705 Complete</div>
      <div class="notif-action">\u23ed\ufe0f Skip</div>
      <div class="notif-action">\ud83d\udca4 Snooze</div>
    </div>
  </div>

  <div class="home-bar"></div>
</body>
</html>
`, { waitUntil: "networkidle" });
await notifPage.waitForTimeout(500);
await shot(notifPage, "notification-actions.png");
await notifPage.close();
await nCtx.close();

await browser.close();

console.log(`\nAll screenshots saved to ${OUTPUT}`);
