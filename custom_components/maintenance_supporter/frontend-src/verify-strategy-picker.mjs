/** Diagnose: is the strategy registered in the Add-Dashboard picker context?
 *
 * Earlier verify-strategy.mjs checked window.customStrategies after navigating
 * to /maintenance-supporter. This script navigates to /config/dashboards
 * (Settings → Dashboards) instead — the actual context where the picker opens.
 */
import { chromium } from "playwright";

const HA = "http://localhost:8125";
const HA_TOKEN = process.env.HA_TOKEN;
if (!HA_TOKEN) {
  console.error("Set HA_TOKEN env var.");
  process.exit(1);
}

async function getRefreshToken() {
  async function post(path, body, ctype = "application/json") {
    const data = typeof body === "string" ? body : JSON.stringify(body);
    const r = await fetch(`${HA}${path}`, {
      method: "POST",
      headers: { "Content-Type": ctype },
      body: data,
    });
    return await r.json();
  }
  const flow = await post("/auth/login_flow", {
    client_id: `${HA}/`, handler: ["homeassistant", null], redirect_uri: `${HA}/`,
  });
  const auth = await post(`/auth/login_flow/${flow.flow_id}`, {
    client_id: `${HA}/`, username: "dev", password: "dev",
  });
  const tokens = await post(
    "/auth/token",
    `grant_type=authorization_code&code=${auth.result}&client_id=${HA}/`,
    "application/x-www-form-urlencoded",
  );
  return tokens.refresh_token;
}

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(`console: ${m.text().substring(0, 200)}`);
});

const refreshToken = await getRefreshToken();
await page.goto(HA);
await page.waitForTimeout(800);
await page.evaluate(({ ha, r }) => {
  localStorage.setItem("hassTokens", JSON.stringify({
    hassUrl: ha, clientId: `${ha}/`, refresh_token: r,
    access_token: "", token_type: "Bearer", expires_in: 1800, expires: 0,
  }));
}, { ha: HA, r: refreshToken });

// 1. After hitting root only — is window.customStrategies populated?
await page.goto(HA);
await page.waitForTimeout(8000);
const atRoot = await page.evaluate(() => ({
  customStrategies: window.customStrategies || null,
  customCards: (window.customCards || []).filter(c => c.type?.includes?.("maintenance")),
  scriptsLoaded: [...document.scripts].filter(s => s.src.includes("maintenance")).map(s => s.src),
  extraModules: [...document.querySelectorAll("script[type=module]")].filter(
    s => s.src.includes("maintenance")
  ).map(s => s.src),
}));
console.log("=== After root navigation ===");
console.log(JSON.stringify(atRoot, null, 2));

// 2. Now navigate to Settings → Dashboards (the picker's context)
await page.goto(`${HA}/config/dashboards`);
await page.waitForTimeout(6000);
const atDashboardsConfig = await page.evaluate(() => ({
  url: window.location.href,
  customStrategies: window.customStrategies || null,
  customCards: (window.customCards || []).filter(c => c.type?.includes?.("maintenance")),
  scriptsLoaded: [...document.scripts].filter(s => s.src.includes("maintenance")).map(s => s.src),
  // Check if our specific custom element is registered
  strategyTagDefined: !!customElements.get("ll-strategy-dashboard-maintenance-supporter"),
}));
console.log("\n=== After /config/dashboards navigation ===");
console.log(JSON.stringify(atDashboardsConfig, null, 2));

// 3. Open the Add-Dashboard picker dialog and look at what it renders
await page.goto(`${HA}/config/dashboards`);
await page.waitForTimeout(5000);

// Open the Add-Dashboard dialog via HA's standard "show-dialog" event —
// way more robust than chasing the FAB through nested shadow DOMs.
const dialogResult = await page.evaluate(async () => {
  const ha = document.querySelector("home-assistant");
  if (!ha) return { error: "no home-assistant element" };
  // HA opens dialogs via this DOM event. The dialog is dialog-new-dashboard.
  ha.dispatchEvent(
    new CustomEvent("show-dialog", {
      detail: {
        dialogTag: "dialog-new-dashboard",
        dialogImport: () =>
          import("/frontend_latest/dialog-new-dashboard").catch(() => ({})),
        dialogParams: {},
      },
      bubbles: true,
      composed: true,
    }),
  );
  // The standard import path may differ — wait for the dialog to materialize
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 200));
    if (document.querySelector("dialog-new-dashboard")) break;
  }
  return { tried: true };
});
console.log("Dialog open attempt:", dialogResult);

await page.waitForTimeout(2000);

// Inspect the dialog's content
const dialogContent = await page.evaluate(() => {
  const out = {};
  // The dialog opens at document level
  const dialog = document.querySelector("dialog-new-dashboard");
  out.dialogPresent = !!dialog;
  if (dialog) {
    const sr = dialog.shadowRoot;
    // Look for dashboard cards (each option in the picker)
    const cards = sr?.querySelectorAll("dashboard-card") || [];
    out.cardCount = cards.length;
    out.cardTypes = [...cards].map((c) => {
      const innerSr = c.shadowRoot;
      return {
        strategy: c.getAttribute("strategy") || c._strategy?.type,
        name: innerSr?.querySelector("[name], h3, .name")?.textContent?.trim(),
      };
    });
    // Also: did the component capture any custom strategies?
    out._customStrategies = dialog._customStrategies || dialog.__customStrategies;
  }
  // Also peek at the global registry one more time
  out.windowCustomStrategies = (window.customStrategies || []).map((s) => s.type);
  return out;
});
console.log("\n=== Dashboard picker dialog content ===");
console.log(JSON.stringify(dialogContent, null, 2));

if (errors.length) {
  console.log("\n=== Page errors ===");
  errors.slice(0, 8).forEach(e => console.log("  " + e.substring(0, 250)));
}

await browser.close();
