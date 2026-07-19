/** Live check for #104: spent-only budget display without a maximum.
 *
 *  Sets both budget maxima to 0 on ha-maint, verifies the dashboard renders
 *  plain spent lines (no bars), screenshots the proof, then restores the
 *  previous maxima (150 / 1500 on the dev instance). */
import { chromium } from "@playwright/test";
import { loadToken, watchdog, wsClient, hassTokensInit } from "./ws-client.mjs";

const HA = "http://ha-maint:8123", REST = "http://127.0.0.1:8125", PW_WS = "ws://127.0.0.1:3000/";
const OUT = process.argv[2] || ".";
const log = (...a) => console.log(...a);
const fail = (m) => { console.error("FAIL:", m); throw new Error(m); };
const assert = (cond, msg) => { if (!cond) fail(msg); log("  ok:", msg); };
watchdog(5 * 60e3, "budget spent-only check");

const token = loadToken();
const api = await wsClient(REST, token);

// Remember + zero the maxima.
const before = await api.send({ type: "maintenance_supporter/budget_status" });
log("before:", JSON.stringify({ m: before.monthly_budget, y: before.yearly_budget, ms: before.monthly_spent, ys: before.yearly_spent }));
await api.send({ type: "maintenance_supporter/global/update", settings: { budget_monthly: 0, budget_yearly: 0 } });

let browser;
try {
  browser = await chromium.connect(PW_WS);
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 } });
  const p = await ctx.newPage();
  await p.addInitScript(hassTokensInit, { t: token, ha: HA });
  await p.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded", timeout: 30000 });
  await p.waitForTimeout(4000);

  const probe = await p.evaluate(() => {
    const panel = document
      .querySelector("home-assistant")?.shadowRoot
      ?.querySelector("home-assistant-main")?.shadowRoot
      ?.querySelector("ha-drawer partial-panel-resolver ha-panel-custom maintenance-supporter-panel");
    if (!panel?.shadowRoot) return { err: "panel not found" };
    const spentOnly = [...panel.shadowRoot.querySelectorAll(".budget-spent-only")].map((n) => n.textContent.replace(/\s+/g, " ").trim());
    const bars = panel.shadowRoot.querySelectorAll(".budget-bar").length;
    return { spentOnly, bars };
  });
  log("probe:", JSON.stringify(probe));
  assert(!probe.err, "panel mounted");
  assert(probe.spentOnly.length === 2, `two spent-only lines render (got ${probe.spentOnly.length})`);
  assert(probe.bars === 0, "no denominator bars without maxima");
  assert(/\d/.test(probe.spentOnly[0]), "spent line carries an amount");
  await p.screenshot({ path: `${OUT}/budget-spent-only.png` });
  log("screenshot saved");
  log("BUDGET SPENT-ONLY LIVE CHECK PASSED");
} finally {
  // Restore the dev instance's maxima regardless of outcome.
  await api.send({
    type: "maintenance_supporter/global/update",
    settings: { budget_monthly: before.monthly_budget || 0, budget_yearly: before.yearly_budget || 0 },
  });
  const after = await api.send({ type: "maintenance_supporter/budget_status" });
  log("restored:", JSON.stringify({ m: after.monthly_budget, y: after.yearly_budget }));
  await api.close();
  if (browser) await browser.close();
}
