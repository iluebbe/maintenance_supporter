/** Verify v2.1.0 KPI click filtering (Discussion #49 — @byoung79).
 *
 * Loads the panel, clicks each clickable KPI, asserts the panel's
 * filter dropdown reflects the new state and the .stat-item.active class
 * lights up correctly.
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
const errors = [];
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));

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
await page.goto(`${HA}/maintenance-supporter`);
await page.waitForTimeout(8000);

// Helper that drills into the panel's shadow root and finds the stat items.
const PANEL_QUERY = `
  (function () {
    const ha = document.querySelector("home-assistant");
    const sr = ha?.shadowRoot
      ?.querySelector("home-assistant-main")?.shadowRoot
      ?.querySelector("ha-drawer")
      ?.querySelector("partial-panel-resolver")
      ?.querySelector("ha-panel-custom")
      ?.querySelector("maintenance-supporter-panel")?.shadowRoot;
    return sr;
  })()
`;

const result = await page.evaluate(async (q) => {
  const out = {};
  const sr = eval(q);
  if (!sr) {
    out.error = "panel shadowRoot not found";
    return out;
  }
  const items = [...sr.querySelectorAll(".stat-item.clickable")];
  out.kpiCount = items.length;
  out.kpiLabels = items.map((i) => i.querySelector(".stat-label")?.textContent?.trim());

  // Click "overdue" KPI and check filter
  const findKpi = (label) =>
    items.find((i) =>
      i.querySelector(".stat-label")?.textContent?.trim().toLowerCase() ===
      label.toLowerCase(),
    );
  const overdueItem = findKpi("Overdue") || findKpi("Überfällig");
  if (overdueItem) {
    overdueItem.click();
    await new Promise((r) => setTimeout(r, 400));
    const select = sr.querySelector(".filter-bar select");
    out.afterOverdueClick_dropdownValue = select?.value;
    out.afterOverdueClick_overdueActive = overdueItem.classList.contains("active");
  }

  // Click "tasks" KPI to clear filter
  const tasksItem = findKpi("Tasks") || findKpi("Aufgaben");
  if (tasksItem) {
    tasksItem.click();
    await new Promise((r) => setTimeout(r, 400));
    const select = sr.querySelector(".filter-bar select");
    out.afterTasksClick_dropdownValue = select?.value;
    out.afterTasksClick_overdueActive = overdueItem?.classList.contains("active");
  }

  return out;
}, PANEL_QUERY);

console.log(JSON.stringify(result, null, 2));

const okFiveKpis = result.kpiCount === 5;
const okOverdueClick =
  result.afterOverdueClick_dropdownValue === "overdue" &&
  result.afterOverdueClick_overdueActive === true;
const okTasksClick =
  result.afterTasksClick_dropdownValue === "" &&
  result.afterTasksClick_overdueActive === false;

console.log(
  "\n=== SUMMARY ===\n" +
    `  5 clickable KPIs:                  ${okFiveKpis ? "✓" : "✗"} (${result.kpiCount})\n` +
    `  overdue click → dropdown=overdue:  ${okOverdueClick ? "✓" : "✗"}\n` +
    `  tasks click clears + dehighlights: ${okTasksClick ? "✓" : "✗"}`,
);

if (errors.length) {
  console.log("\n=== Browser errors ===");
  errors.slice(0, 5).forEach((e) => console.log(`  ${e.substring(0, 200)}`));
}

await browser.close();
process.exit(okFiveKpis && okOverdueClick && okTasksClick ? 0 : 1);
