/**
 * Capture v1.4.x screenshots:
 *   - object-detail-with-manual.png   #43: documentation_url on object header
 *   - task-detail-with-manual.png     #43+1.4.1: parent manual link on task page
 *   - settings-notification-title-style.png  #44: dropdown
 *   - overview-v142.png               refreshed dashboard with v1.4 polish
 *
 * Same login + panel-traversal pattern as capture-v131-screenshots.mjs.
 *
 *   docker compose --profile testing up -d  # ensure playwright is up
 *   node capture-v14-screenshots.mjs
 */

import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HA = "http://homeassistant-dev:8123";
const OUTPUT = path.resolve(__dirname, "../../../docs/images");
fs.mkdirSync(OUTPUT, { recursive: true });

function token() {
  if (process.env.HA_TOKEN) return process.env.HA_TOKEN;
  const env = path.resolve(__dirname, "../../../docker/.env");
  const lines = fs.readFileSync(env, "utf8").split("\n");
  for (const line of lines) {
    if (line.startsWith("HA_TOKEN=")) return line.split("=")[1].trim();
  }
  throw new Error("HA_TOKEN not found");
}

const ACCESS_TOKEN = token();

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
  await page.evaluate((t) => {
    localStorage.setItem("hassTokens", JSON.stringify({
      hassUrl: "http://homeassistant-dev:8123",
      clientId: "http://homeassistant-dev:8123/",
      refresh_token: "",
      access_token: t,
      token_type: "Bearer",
      expires_in: 86400,
      expires: Date.now() + 86400000,
    }));
  }, ACCESS_TOKEN);
  await page.goto(HA + "/maintenance-supporter");
  await page.waitForTimeout(8000);
}

async function setEnglishDark(page) {
  // The set_user_data round-trip occasionally crashes the page (HA frontend
  // reloads itself when language changes). Wrap in try/catch — if the page
  // crashed, the caller will recreate it via the recovery branch below.
  try {
    await page.evaluate(async () => {
      const ha = document.querySelector("home-assistant");
      const hass = ha && (ha.__hass || ha.hass);
      if (hass && hass.connection) {
        await hass.connection.sendMessagePromise({
          type: "frontend/set_user_data", key: "language",
          value: { language: "en", number_format: "language" },
        });
        await hass.connection.sendMessagePromise({
          type: "frontend/set_user_data", key: "core",
          value: { selectedTheme: { theme: "default", dark: true } },
        });
      }
    });
  } catch (e) {
    console.log("  (language/theme change crashed, recovering)");
    return false;
  }
  await page.goto(HA + "/maintenance-supporter");
  await page.waitForTimeout(8000);
  return true;
}

async function shot(page, name) {
  const filePath = path.join(OUTPUT, name);
  await page.screenshot({ path: filePath });
  console.log(`  ${name}`);
}

// ─── Setup helpers ────────────────────────────────────────────────────

async function getObjects(page) {
  const raw = await page.evaluate(`{
    ${panelJS()}
    var result = [];
    if (p && p._objects) {
      for (var i = 0; i < p._objects.length; i++) {
        var obj = p._objects[i];
        var tasks = [];
        if (obj.tasks) for (var j = 0; j < obj.tasks.length; j++) {
          tasks.push({ id: obj.tasks[j].id, name: obj.tasks[j].name });
        }
        result.push({ entry_id: obj.entry_id, name: obj.object.name, tasks: tasks });
      }
    }
    JSON.stringify(result);
  }`);
  return JSON.parse(raw);
}

async function setObjectDocUrl(page, entryId, url) {
  // v1.4.0 #43: set documentation_url on the object so the new
  // manual-link line renders in the object detail header (and via
  // v1.4.1 also on each task detail page belonging to this object).
  return await page.evaluate(async ({ entry_id, documentation_url }) => {
    const ha = document.querySelector("home-assistant");
    const hass = ha && (ha.__hass || ha.hass);
    return await hass.connection.sendMessagePromise({
      type: "maintenance_supporter/object/update",
      entry_id, documentation_url,
    });
  }, { entry_id: entryId, documentation_url: url });
}

async function setNotificationTitleStyle(page, style) {
  // v1.4.0 #44: flip the global setting so the dropdown screenshot
  // shows it pre-selected (rather than the boring default).
  return await page.evaluate(async ({ s }) => {
    const ha = document.querySelector("home-assistant");
    const hass = ha && (ha.__hass || ha.hass);
    return await hass.connection.sendMessagePromise({
      type: "maintenance_supporter/global/update",
      settings: { notification_title_style: s, notifications_enabled: true },
    });
  }, { s: style });
}

// ─── Main ─────────────────────────────────────────────────────────────

const browser = await chromium.connect("ws://localhost:3000");
console.log("Connected to Playwright server\n");

const ctx = await browser.newContext({
  viewport: { width: 1280, height: 900 },
  locale: "en",
  colorScheme: "dark",
});
let page = await ctx.newPage();

console.log("Login + setup …");
await login(page);
const langOk = await setEnglishDark(page);
if (!langOk) {
  try { await page.close(); } catch { /* ignore */ }
  page = await ctx.newPage();
  await login(page);
}

console.log("\nPick a target object …");
const objects = await getObjects(page);
const target = objects.find(o => o.name === "HVAC System")
  || objects.find(o => o.tasks.length > 0)
  || objects[0];
if (!target) {
  console.error("No objects in demo");
  process.exit(1);
}
console.log(`  using: ${target.name} (${target.tasks.length} tasks)`);

console.log("\nSet documentation_url on the object …");
const r1 = await setObjectDocUrl(page, target.entry_id,
  "https://www.energystar.gov/products/hvac/maintenance-guide.pdf");
console.log("  result:", JSON.stringify(r1));

console.log("\nFlip notification_title_style to object_name + enable notifications …");
const r2 = await setNotificationTitleStyle(page, "object_name");
console.log("  flag result keys:", Object.keys(r2 || {}));

// Reload so the panel picks up the changes
await page.goto(HA + "/maintenance-supporter");
await page.waitForTimeout(6000);

// ─── Screenshot 1: object detail with the new documentation URL link ──
console.log("\n1) object-detail-with-manual.png");
await page.evaluate(`{
  ${panelJS()}
  if (p) p._showObject('${target.entry_id}');
}`);
await page.waitForTimeout(2500);
await shot(page, "object-detail-with-manual.png");

// ─── Screenshot 2: task detail with parent object's manual link ──────
console.log("\n2) task-detail-with-manual.png");
if (target.tasks.length > 0) {
  const task = target.tasks[0];
  await page.evaluate(`{
    ${panelJS()}
    if (p) p._showTask('${target.entry_id}', '${task.id}');
  }`);
  await page.waitForTimeout(3500);
  await shot(page, "task-detail-with-manual.png");
} else {
  console.log("  skipped — target object has no tasks");
}

// ─── Screenshot 3: notification title style dropdown in Settings ─────
console.log("\n3) settings-notification-title-style.png");
await page.evaluate(`{
  ${panelJS()}
  if (p) {
    p._activeView = 'settings';
    p.requestUpdate();
  }
}`);
await page.waitForTimeout(2500);
// Scroll the notification settings section into view
await page.evaluate(`{
  ${panelJS()}
  if (p) {
    var sv = p.shadowRoot && p.shadowRoot.querySelector('maintenance-settings-view');
    if (sv && sv.shadowRoot) {
      // Try to find the title-style row
      var rows = sv.shadowRoot.querySelectorAll('.notif-row, .row, [data-key=notification_title_style]');
      // Fallback: scroll the settings root into the middle of the viewport
      var anchor = sv.shadowRoot.querySelector('select[data-key=notification_title_style]')
        || sv.shadowRoot.querySelector('[data-key=notification_title_style]')
        || rows[0];
      if (anchor) anchor.scrollIntoView({behavior: 'instant', block: 'center'});
    }
  }
}`);
await page.waitForTimeout(1500);
await shot(page, "settings-notification-title-style.png");

// ─── Screenshot 4: refreshed overview (just dashboard tab) ────────────
console.log("\n4) overview-v142.png");
await page.evaluate(`{
  ${panelJS()}
  if (p) {
    p._activeView = 'tasks';
    p.requestUpdate();
  }
}`);
await page.waitForTimeout(2500);
await shot(page, "overview-v142.png");

console.log("\nDone.");
await browser.close();
