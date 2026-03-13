/**
 * Take all README screenshots in dark mode.
 *
 * Usage:  HA_TOKEN=<token> node scripts/_screenshot.mjs
 */

import { chromium } from "playwright";

const TOKEN = process.env.HA_TOKEN;
if (!TOKEN) { console.error("HA_TOKEN not set"); process.exit(1); }

const BASE = "http://localhost:8123";
const OUT  = "docs/images";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getRoot() {
  let n = document.querySelector("home-assistant");
  n = n?.shadowRoot?.querySelector("home-assistant-main");
  n = n?.shadowRoot?.querySelector("ha-drawer");
  n = n?.querySelector("partial-panel-resolver");
  n = n?.querySelector("ha-panel-custom");
  n = n?.querySelector("maintenance-supporter-panel");
  return n?.shadowRoot;
}

async function panelClick(page, selector) {
  await page.evaluate(({ sel, fn }) => {
    const getRoot = new Function("return " + fn)();
    const root = getRoot();
    if (root) { const el = root.querySelector(sel); if (el) el.click(); }
  }, { sel: selector, fn: getRoot.toString() });
}

async function panelClickText(page, selector, text) {
  await page.evaluate(({ sel, txt, fn }) => {
    const getRoot = new Function("return " + fn)();
    const root = getRoot();
    if (!root) return;
    const els = [...root.querySelectorAll(sel)];
    const el = els.find(e => e.textContent?.includes(txt));
    if (el) el.click();
  }, { sel: selector, txt: text, fn: getRoot.toString() });
}

async function shot(page, name, ms = 1500) {
  await page.waitForTimeout(ms);
  await page.screenshot({ path: `${OUT}/${name}`, fullPage: false });
  console.log(`  ✓ ${name}`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

console.log("Launching browser…");
const browser = await chromium.launch({ headless: true });

const ctx = await browser.newContext({
  viewport: { width: 1400, height: 900 },
  deviceScaleFactor: 2,
  colorScheme: "dark",
  locale: "en-US",
});
const page = await ctx.newPage();

// Authenticate
console.log("Authenticating…");
await page.goto(`${BASE}/auth/authorize?response_type=code&client_id=${BASE}/`);
await page.waitForTimeout(2000);
await page.evaluate((token) => {
  localStorage.setItem("hassTokens", JSON.stringify({
    hassUrl: "http://localhost:8123",
    clientId: "http://localhost:8123/",
    refresh_token: "", access_token: token,
    token_type: "Bearer", expires_in: 999999999,
    expires: Date.now() + 999999999000,
  }));
}, TOKEN);

// Set dark theme
console.log("Setting dark theme…");
await page.goto(`${BASE}/maintenance-supporter`);
await page.waitForTimeout(4000);
await page.evaluate(async () => {
  const ha = document.querySelector("home-assistant");
  if (ha?.hass?.connection) {
    await ha.hass.connection.sendMessage({
      type: "frontend/set_user_data",
      key: "core",
      value: { selectedTheme: { theme: "default", dark: true } },
    });
    await ha.hass.connection.sendMessage({
      type: "frontend/set_user_data",
      key: "language",
      value: { language: "en" },
    });
  }
});
await page.goto(`${BASE}/maintenance-supporter`);
await page.waitForTimeout(5000);

// ---------------------------------------------------------------------------
// 1) Overview
// ---------------------------------------------------------------------------
console.log("1) Overview…");
await shot(page, "overview.png", 2000);

// ---------------------------------------------------------------------------
// 2) Object Detail
// ---------------------------------------------------------------------------
console.log("2) Object Detail…");
await panelClickText(page, ".cell.object-name", "Family Car");
await shot(page, "object-detail.png", 2000);

// ---------------------------------------------------------------------------
// 3) Task Detail
// ---------------------------------------------------------------------------
console.log("3) Task Detail…");
await page.goto(`${BASE}/maintenance-supporter`);
await page.waitForTimeout(3000);
await panelClickText(page, ".cell.task-name", "Oil Change");
await shot(page, "task-detail.png", 2000);

// ---------------------------------------------------------------------------
// 4) Complete Dialog
// ---------------------------------------------------------------------------
console.log("4) Complete Dialog…");
await page.goto(`${BASE}/maintenance-supporter`);
await page.waitForTimeout(3000);
await panelClick(page, ".task-row .btn-complete");
await shot(page, "complete-dialog.png", 2000);
await page.keyboard.press("Escape");
await page.waitForTimeout(500);

// ---------------------------------------------------------------------------
// 5) Task History — click "History" tab in task detail
// ---------------------------------------------------------------------------
console.log("5) Task History…");
await page.goto(`${BASE}/maintenance-supporter`);
await page.waitForTimeout(3000);
await panelClickText(page, ".cell.task-name", "Oil Change");
await page.waitForTimeout(2000);
// Click the "History" tab
await panelClickText(page, ".tab, [role='tab'], button", "History");
await shot(page, "task-history.png", 1500);

// ---------------------------------------------------------------------------
// 6) QR Dialog
// ---------------------------------------------------------------------------
console.log("6) QR Dialog…");
await page.goto(`${BASE}/maintenance-supporter`);
await page.waitForTimeout(3000);
await panelClickText(page, ".cell.object-name", "Family Car");
await page.waitForTimeout(1500);
await page.evaluate((fn) => {
  const getRoot = new Function("return " + fn)();
  const root = getRoot();
  if (!root) return;
  const btns = [...root.querySelectorAll("ha-button, button, mwc-icon-button")];
  const qr = btns.find(b => b.querySelector("ha-icon[icon='mdi:qrcode']") || b.textContent?.includes("QR"));
  if (qr) qr.click();
}, getRoot.toString());
await shot(page, "qr-dialog.png", 2500);
await page.keyboard.press("Escape");
await page.waitForTimeout(500);

// ---------------------------------------------------------------------------
// 7) Multi-Entity Trigger
// ---------------------------------------------------------------------------
console.log("7) Multi-Entity Trigger…");
await page.goto(`${BASE}/maintenance-supporter`);
await page.waitForTimeout(3000);
await panelClickText(page, ".cell.task-name", "Tire Pressure Check");
await shot(page, "multi-entity-trigger.png", 2000);

// ---------------------------------------------------------------------------
// 8) Compound Trigger
// ---------------------------------------------------------------------------
console.log("8) Compound Trigger…");
await page.goto(`${BASE}/maintenance-supporter`);
await page.waitForTimeout(3000);
await panelClickText(page, ".cell.task-name", "Cartridge Replacement");
await shot(page, "compound-trigger.png", 2000);

// ---------------------------------------------------------------------------
// 9) Lovelace Card — add card to dashboard first, then screenshot
// ---------------------------------------------------------------------------
console.log("9) Lovelace Card…");
// Create a dedicated lovelace dashboard with the maintenance-card
await page.evaluate(async () => {
  const ha = document.querySelector("home-assistant");
  if (!ha?.hass?.connection) return;
  const conn = ha.hass.connection;
  try {
    // Ensure card JS is registered as a lovelace resource
    const resources = await conn.sendMessagePromise({ type: "lovelace/resources" });
    const hasResource = resources.some(r => r.url?.includes("maintenance_supporter_card"));
    if (!hasResource) {
      await conn.sendMessagePromise({
        type: "lovelace/resources/create",
        url: "/maintenance_supporter_card",
        res_type: "module",
      });
    }
    // List existing dashboards to check if ours already exists
    const dashboards = await conn.sendMessagePromise({ type: "lovelace/dashboards/list" });
    const exists = dashboards.some(d => d.url_path === "maint-card");
    if (!exists) {
      await conn.sendMessagePromise({
        type: "lovelace/dashboards/create",
        url_path: "maint-card",
        title: "Maint Card",
        icon: "mdi:wrench",
        show_in_sidebar: false,
        require_admin: false,
        mode: "storage",
      });
    }
    // Save card config into this dashboard
    await conn.sendMessagePromise({
      type: "lovelace/config/save",
      url_path: "maint-card",
      config: {
        views: [{
          title: "Maintenance",
          cards: [
            { type: "custom:maintenance-supporter-card", title: "Maintenance Overview", show_header: true },
          ],
        }],
      },
    });
  } catch (e) {
    console.error("Failed to create lovelace dashboard:", e);
  }
});
await page.waitForTimeout(3000);
await page.goto(`${BASE}/maint-card/0`);
await page.waitForTimeout(6000);
await shot(page, "lovelace-card.png", 2000);

// ---------------------------------------------------------------------------
// 10) Calendar
// ---------------------------------------------------------------------------
console.log("10) Calendar…");
await page.goto(`${BASE}/calendar`);
await page.waitForTimeout(4000);
await shot(page, "calendar.png", 2000);

// ---------------------------------------------------------------------------
// 11) Entity Attributes — navigate directly to entity page
// ---------------------------------------------------------------------------
console.log("11) Entity Attributes…");
// Use HA's entity detail page with more-info dialog
await page.goto(`${BASE}/developer-tools/state`);
await page.waitForTimeout(4000);

// Try typing in the entity filter field
await page.evaluate(() => {
  const ha = document.querySelector("home-assistant");
  const main = ha?.shadowRoot?.querySelector("home-assistant-main");
  const drawer = main?.shadowRoot?.querySelector("ha-drawer");
  const panel = drawer?.querySelector("partial-panel-resolver");
  const devTools = panel?.querySelector("ha-panel-developer-tools");
  const sr1 = devTools?.shadowRoot;
  const stateTab = sr1?.querySelector("developer-tools-state");
  const sr2 = stateTab?.shadowRoot;
  if (!sr2) return "no sr2";

  // Find the search-input and set its value property
  const searchInput = sr2.querySelector("search-input");
  if (searchInput) {
    // Set the filter property directly on the search-input component
    searchInput.filter = "sensor.family_car_oil";
    // Also try dispatching value-changed event
    searchInput.dispatchEvent(new CustomEvent("value-changed", {
      detail: { value: "sensor.family_car_oil" },
      bubbles: true,
      composed: true,
    }));
  }
});
await page.waitForTimeout(2000);

// Click on the entity to expand it
await page.evaluate(() => {
  const ha = document.querySelector("home-assistant");
  const main = ha?.shadowRoot?.querySelector("home-assistant-main");
  const drawer = main?.shadowRoot?.querySelector("ha-drawer");
  const panel = drawer?.querySelector("partial-panel-resolver");
  const devTools = panel?.querySelector("ha-panel-developer-tools");
  const sr1 = devTools?.shadowRoot;
  const stateTab = sr1?.querySelector("developer-tools-state");
  const sr2 = stateTab?.shadowRoot;
  if (!sr2) return;
  // Look for entity rows containing our entity
  const allEls = sr2.querySelectorAll("*");
  for (const el of allEls) {
    if (el.textContent?.includes("family_car_oil_change") && (el.tagName === "A" || el.tagName === "BUTTON" || el.getAttribute("role") === "row" || el.classList.contains("entity-picker-result"))) {
      el.click();
      return;
    }
  }
  // Fallback: click any link with the entity
  const links = sr2.querySelectorAll("a");
  for (const a of links) {
    if (a.href?.includes("family_car_oil_change") || a.textContent?.includes("family_car_oil_change")) {
      a.click();
      return;
    }
  }
});
await shot(page, "entity-attributes.png", 2000);

// ---------------------------------------------------------------------------
// 12) Config Flow — integration page in Settings
// ---------------------------------------------------------------------------
console.log("12) Config Flow…");
await page.goto(`${BASE}/config/integrations/integration/maintenance_supporter`);
await page.waitForTimeout(5000);
await shot(page, "config-flow.png", 2000);

// ---------------------------------------------------------------------------
// 13) Mobile Overview + Mobile Task
// ---------------------------------------------------------------------------
console.log("13) Mobile Overview…");
const mobileCtx = await browser.newContext({
  viewport: { width: 375, height: 812 },
  deviceScaleFactor: 2,
  colorScheme: "dark",
  locale: "en-US",
});
const mobilePage = await mobileCtx.newPage();

await mobilePage.goto(`${BASE}/auth/authorize?response_type=code&client_id=${BASE}/`);
await mobilePage.waitForTimeout(2000);
await mobilePage.evaluate((token) => {
  localStorage.setItem("hassTokens", JSON.stringify({
    hassUrl: "http://localhost:8123",
    clientId: "http://localhost:8123/",
    refresh_token: "", access_token: token,
    token_type: "Bearer", expires_in: 999999999,
    expires: Date.now() + 999999999000,
  }));
}, TOKEN);

await mobilePage.goto(`${BASE}/maintenance-supporter`);
await mobilePage.waitForTimeout(4000);
await mobilePage.evaluate(async () => {
  const ha = document.querySelector("home-assistant");
  if (ha?.hass?.connection) {
    await ha.hass.connection.sendMessage({
      type: "frontend/set_user_data",
      key: "core",
      value: { selectedTheme: { theme: "default", dark: true } },
    });
    await ha.hass.connection.sendMessage({
      type: "frontend/set_user_data",
      key: "language",
      value: { language: "en" },
    });
  }
});
await mobilePage.goto(`${BASE}/maintenance-supporter`);
await mobilePage.waitForTimeout(5000);
await mobilePage.screenshot({ path: `${OUT}/mobile-overview.png`, fullPage: false });
console.log("  ✓ mobile-overview.png");

// 14) Mobile Task Detail
console.log("14) Mobile Task…");
await mobilePage.evaluate(({ fn }) => {
  const getRoot = new Function("return " + fn)();
  const root = getRoot();
  if (!root) return;
  const els = [...root.querySelectorAll(".cell.task-name")];
  const el = els.find(e => e.textContent?.includes("Filter Replacement"));
  if (el) el.click();
}, { fn: getRoot.toString() });
await mobilePage.waitForTimeout(3000);
await mobilePage.screenshot({ path: `${OUT}/mobile-task.png`, fullPage: false });
console.log("  ✓ mobile-task.png");
await mobilePage.close();

console.log("\nDone! All screenshots saved to docs/images/");
await browser.close();
