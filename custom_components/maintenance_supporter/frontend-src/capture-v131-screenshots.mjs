/**
 * Capture v1.3.1 screenshots: completion-actions feature flag toggle, the
 * task-dialog On-Complete Action section with the new ha-service-picker,
 * and the schema-driven ha-form for service data.
 *
 * Reuses the same login/panel-traversal pattern as
 * capture-readme-screenshots.mjs.
 *
 *   docker compose --profile testing up -d  # ensure playwright is up
 *   node capture-v131-screenshots.mjs
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
  await page.goto(HA + "/maintenance-supporter");
  await page.waitForTimeout(8000);
}

async function shot(page, name) {
  const filePath = path.join(OUTPUT, name);
  await page.screenshot({ path: filePath });
  console.log(`  ${name}`);
}

async function enableCompletionActionsFeature(page) {
  // Flip the feature flag via the WS settings update.
  const result = await page.evaluate(async () => {
    const ha = document.querySelector("home-assistant");
    const hass = ha && (ha.__hass || ha.hass);
    try {
      const r = await hass.connection.sendMessagePromise({
        type: "maintenance_supporter/global/update",
        settings: { advanced_completion_actions_visible: true },
      });
      return { ok: true, result: r };
    } catch (e) {
      return { ok: false, error: JSON.stringify(e) };
    }
  });
  console.log("  flag result:", JSON.stringify(result));
  // Reload to pick up the flag.
  await page.goto(HA + "/maintenance-supporter");
  await page.waitForTimeout(6000);
}

async function getFirstTask(page) {
  const raw = await page.evaluate(`{
    ${panelJS()}
    var result = null;
    if (p && p._objects && p._objects.length > 0) {
      for (var i = 0; i < p._objects.length; i++) {
        var obj = p._objects[i];
        if (obj.tasks && obj.tasks.length > 0) {
          result = { entry_id: obj.entry_id, task_id: obj.tasks[0].id, name: obj.tasks[0].name, obj_name: obj.object.name };
          break;
        }
      }
    }
    JSON.stringify(result);
  }`);
  const r = JSON.parse(raw);
  if (!r) throw new Error("No tasks found in demo data");
  return r;
}

async function openEditDialog(page, entryId, taskId) {
  // Navigate to task detail first so the dialog has full context.
  await page.evaluate(`{
    ${panelJS()}
    if (p) p._showTask('${entryId}', '${taskId}');
  }`);
  await page.waitForTimeout(2500);

  // Open the edit dialog programmatically via the panel's task-dialog ref.
  await page.evaluate(`{
    ${panelJS()}
    if (p) {
      var dlg = p.shadowRoot && p.shadowRoot.querySelector('maintenance-task-dialog');
      if (dlg) {
        // Find the task object from p._objects
        var task = null;
        for (var i = 0; i < p._objects.length; i++) {
          if (p._objects[i].entry_id === '${entryId}') {
            for (var j = 0; j < p._objects[i].tasks.length; j++) {
              if (p._objects[i].tasks[j].id === '${taskId}') {
                task = p._objects[i].tasks[j];
                break;
              }
            }
          }
        }
        if (task) dlg.openEdit('${entryId}', task);
      }
    }
  }`);
  await page.waitForTimeout(3000);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const browser = await chromium.connect("ws://localhost:3000");
console.log("Connected to Playwright server\n");

const ctx = await browser.newContext({
  viewport: { width: 1280, height: 900 },
  locale: "en",
  colorScheme: "dark",
});
const page = await ctx.newPage();

console.log("Login + setup …");
await login(page);
await setEnglishDark(page);

console.log("Enable completion-actions feature flag …");
await enableCompletionActionsFeature(page);

// ─── Settings tab — feature toggle ─────────────────────────────────────
console.log("\nSettings tab screenshots:");
await page.evaluate(`{
  ${panelJS()}
  if (p) p._activeView = 'settings';
  if (p) p.requestUpdate();
}`);
await page.waitForTimeout(2000);

// Try to scroll to the Features section
await page.evaluate(`{
  ${panelJS()}
  if (p) {
    var sv = p.shadowRoot && p.shadowRoot.querySelector('maintenance-settings-view');
    if (sv && sv.shadowRoot) {
      var features = sv.shadowRoot.querySelector('.features-section, [data-section=features]');
      if (features) features.scrollIntoView({behavior: 'instant', block: 'start'});
    }
  }
}`);
await page.waitForTimeout(1500);
await shot(page, "settings-completion-actions-toggle.png");

// ─── Open edit dialog with on_complete_action visible ─────────────────
console.log("\nTask-dialog screenshots:");
const t = await getFirstTask(page);
console.log(`  Using task: ${t.obj_name} → ${t.name}`);
await openEditDialog(page, t.entry_id, t.task_id);

// Programmatically open the on_complete_action <details>
await page.evaluate(`{
  ${panelJS()}
  if (p) {
    var dlg = p.shadowRoot && p.shadowRoot.querySelector('maintenance-task-dialog');
    if (dlg && dlg.shadowRoot) {
      var detailsEls = dlg.shadowRoot.querySelectorAll('details.ca-section');
      detailsEls.forEach(function(d) { d.open = true; });
      // Scroll the first details into view
      if (detailsEls[0]) detailsEls[0].scrollIntoView({behavior: 'instant', block: 'center'});
    }
  }
}`);
await page.waitForTimeout(1500);
await shot(page, "task-dialog-action-section-empty.png");

// Set service to light.turn_on so ha-form renders
console.log("  Setting service = light.turn_on …");
await page.evaluate(`{
  ${panelJS()}
  if (p) {
    var dlg = p.shadowRoot && p.shadowRoot.querySelector('maintenance-task-dialog');
    if (dlg) {
      dlg._actionService = 'light.turn_on';
      dlg.requestUpdate();
    }
  }
}`);
await page.waitForTimeout(2000);
await page.evaluate(`{
  ${panelJS()}
  if (p) {
    var dlg = p.shadowRoot && p.shadowRoot.querySelector('maintenance-task-dialog');
    if (dlg && dlg.shadowRoot) {
      var d = dlg.shadowRoot.querySelector('details.ca-section');
      if (d) { d.open = true; d.scrollIntoView({behavior: 'instant', block: 'center'}); }
    }
  }
}`);
await page.waitForTimeout(1000);
await shot(page, "task-dialog-action-form-light.png");

// Pick a service with no schema → JSON fallback
console.log("  Setting service = button.press (no schema) …");
await page.evaluate(`{
  ${panelJS()}
  if (p) {
    var dlg = p.shadowRoot && p.shadowRoot.querySelector('maintenance-task-dialog');
    if (dlg) {
      dlg._actionService = 'button.press';
      dlg.requestUpdate();
    }
  }
}`);
await page.waitForTimeout(2000);
await page.evaluate(`{
  ${panelJS()}
  if (p) {
    var dlg = p.shadowRoot && p.shadowRoot.querySelector('maintenance-task-dialog');
    if (dlg && dlg.shadowRoot) {
      var d = dlg.shadowRoot.querySelector('details.ca-section');
      if (d) { d.open = true; d.scrollIntoView({behavior: 'instant', block: 'center'}); }
    }
  }
}`);
await page.waitForTimeout(1000);
await shot(page, "task-dialog-action-form-fallback.png");

// Quick-complete defaults section
console.log("  Quick-complete defaults section …");
await page.evaluate(`{
  ${panelJS()}
  if (p) {
    var dlg = p.shadowRoot && p.shadowRoot.querySelector('maintenance-task-dialog');
    if (dlg && dlg.shadowRoot) {
      var detailsEls = dlg.shadowRoot.querySelectorAll('details.ca-section');
      if (detailsEls[1]) {
        detailsEls[1].open = true;
        detailsEls[1].scrollIntoView({behavior: 'instant', block: 'center'});
      }
    }
  }
}`);
await page.waitForTimeout(1500);
await shot(page, "task-dialog-quick-complete-defaults.png");

console.log("\nDone.");
await browser.close();
