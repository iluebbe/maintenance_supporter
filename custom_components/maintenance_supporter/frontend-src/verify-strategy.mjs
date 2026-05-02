/** Verify the dashboard strategy registers in HA 2026.5+'s frontend.
 *
 * Headless Chromium logs into ha-maint, then evaluates window.customStrategies
 * to confirm our entry is there. Plus tries the actual generate() call to make
 * sure the WS round-trip works.
 *
 * Run after: npm run build && docker restart ha-maint
 *   node verify-strategy.mjs
 */
import { chromium } from "playwright";

const HA = "http://localhost:8125";
const HA_TOKEN = process.env.HA_TOKEN;
if (!HA_TOKEN) {
  console.error("Set HA_TOKEN env var (long-lived access token).");
  process.exit(1);
}

// HA expects a *refresh* token in localStorage, not an LLAT. Quick refresh-token
// dance: hit /auth/login_flow with username/password.
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
    client_id: `${HA}/`,
    handler: ["homeassistant", null],
    redirect_uri: `${HA}/`,
  });
  const auth = await post(`/auth/login_flow/${flow.flow_id}`, {
    client_id: `${HA}/`,
    username: "dev",
    password: "dev",
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

const refreshToken = await getRefreshToken();
await page.goto(HA);
await page.waitForTimeout(1000);
await page.evaluate(({ ha, r }) => {
  localStorage.setItem(
    "hassTokens",
    JSON.stringify({
      hassUrl: ha,
      clientId: `${ha}/`,
      refresh_token: r,
      access_token: "",
      token_type: "Bearer",
      expires_in: 1800,
      expires: 0,
    }),
  );
}, { ha: HA, r: refreshToken });
await page.goto(HA);
await page.waitForTimeout(8000); // let frontend extra modules load

const result = await page.evaluate(async () => {
  const out = {};

  // 1. window.customStrategies populated?
  out.customStrategies = (window.customStrategies || []).map((s) => ({
    type: s.type,
    strategyType: s.strategyType,
    name: s.name,
  }));

  // 2. Custom element registered?
  out.elementRegistered = !!customElements.get(
    "ll-strategy-dashboard-maintenance-supporter",
  );

  // 3. Try the actual generate() call in BOTH group_by modes
  try {
    const StrategyClass = customElements.get(
      "ll-strategy-dashboard-maintenance-supporter",
    );
    const ha = document.querySelector("home-assistant");
    if (StrategyClass?.generate && ha?.hass) {
      const byArea = await StrategyClass.generate(
        { type: "custom:maintenance-supporter" },
        ha.hass,
      );
      out.generatedArea = {
        title: byArea.title,
        viewCount: byArea.views?.length ?? 0,
        viewTitles: (byArea.views || []).map((v) => v.title),
      };
      const byStatus = await StrategyClass.generate(
        { type: "custom:maintenance-supporter", group_by: "status" },
        ha.hass,
      );
      out.generatedStatus = {
        title: byStatus.title,
        viewCount: byStatus.views?.length ?? 0,
        viewTitles: (byStatus.views || []).map((v) => v.title),
      };
    }
  } catch (e) {
    out.generateError = String(e);
  }

  // 4. HA version
  const ha = document.querySelector("home-assistant");
  out.haVersion = ha?.hass?.config?.version;

  return out;
});

console.log(JSON.stringify(result, null, 2));

const ours = result.customStrategies.find(
  (s) => s.type === "maintenance-supporter",
);
const okRegister = !!ours;
const okElement = result.elementRegistered;
const okArea = !!result.generatedArea && result.generatedArea.viewCount > 0;
const okStatus = !!result.generatedStatus && result.generatedStatus.viewCount > 0;

console.log(
  "\n=== SUMMARY ===\n" +
    `  HA version:                    ${result.haVersion}\n` +
    `  customStrategies has our entry: ${okRegister ? "✓" : "✗"}\n` +
    `  custom element registered:     ${okElement ? "✓" : "✗"}\n` +
    `  generate(group_by=area):       ${okArea ? "✓" : "✗"} (${result.generatedArea?.viewCount} views)\n` +
    `  generate(group_by=status):     ${okStatus ? "✓" : "✗"} (${result.generatedStatus?.viewCount} views)`,
);

await browser.close();
process.exit(okRegister && okElement && okArea && okStatus ? 0 : 1);
