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
await page.waitForTimeout(12000);

if (errors.length) {
  console.log("Pre-evaluate page errors:");
  errors.slice(0, 5).forEach((e) => console.log("  " + e.substring(0, 300)));
}

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
  // Wrap each step so a single failure doesn't abort the whole probe.
  const safe = async (label, fn) => {
    try { await fn(); }
    catch (e) { out[`${label}_error`] = String(e).substring(0, 150); }
  };

  const queryItems = () => [...sr.querySelectorAll(".stat-item.clickable")];
  const findKpi = (label) =>
    queryItems().find((i) =>
      i.querySelector(".stat-label")?.textContent?.trim().toLowerCase() ===
      label.toLowerCase(),
    );
  const findTab = (label) =>
    [...sr.querySelectorAll(".tab")].find((t) =>
      t.textContent?.trim().toLowerCase().includes(label.toLowerCase()),
    );
  const activeTabLabel = () =>
    sr.querySelector(".tab.active")?.textContent?.trim();

  out.kpiCount = queryItems().length;
  out.kpiLabels = queryItems().map((i) =>
    i.querySelector(".stat-label")?.textContent?.trim(),
  );

  // ── A. From Dashboard tab — overdue click ─────────────────────────────
  out.startTab = activeTabLabel();
  await safe("A", async () => {
    const overdueItem = findKpi("Overdue") || findKpi("Überfällig");
    overdueItem.click();
    await new Promise((r) => setTimeout(r, 600));
    const select = sr.querySelector(".filter-bar select");
    out.A_afterOverdueClick_dropdownValue = select?.value;
    out.A_afterOverdueClick_overdueActive = findKpi("Overdue")?.classList.contains("active");
    out.A_tabAfter = activeTabLabel();
  });

  // ── B. Click Tasks to clear filter ────────────────────────────────────
  await safe("B", async () => {
    const tasksItem = findKpi("Tasks") || findKpi("Aufgaben");
    tasksItem.click();
    await new Promise((r) => setTimeout(r, 600));
    const select = sr.querySelector(".filter-bar select");
    out.B_afterTasksClick_dropdownValue = select?.value;
    out.B_afterTasksClick_overdueActive =
      findKpi("Overdue")?.classList.contains("active") ?? null;
  });

  // ── C. Switch to Calendar tab — are KPIs still visible? ───────────────
  await safe("C", async () => {
    const calendarTab = findTab("Calendar") || findTab("Kalender");
    calendarTab.click();
    await new Promise((r) => setTimeout(r, 600));
    out.C_tabAfterCalendarClick = activeTabLabel();
    out.C_kpisVisibleOnCalendar = queryItems().length > 0;
  });

  // ── D. From Calendar tab, click Overdue KPI ───────────────────────────
  await safe("D", async () => {
    const overdueOnCalendar = findKpi("Overdue") || findKpi("Überfällig");
    if (!overdueOnCalendar) {
      out.D_skipped = "Overdue KPI not visible from Calendar tab";
      return;
    }
    overdueOnCalendar.click();
    await new Promise((r) => setTimeout(r, 800));
    out.D_tabAfterOverdueFromCalendar = activeTabLabel();
    const select = sr.querySelector(".filter-bar select");
    out.D_dropdownValue = select?.value;
  });

  // ── E. Switch to Settings tab — KPIs still visible? ───────────────────
  await safe("E", async () => {
    const dashTab = findTab("Dashboard") || findTab("Übersicht") || findTab("Overview");
    dashTab?.click();
    await new Promise((r) => setTimeout(r, 300));
    const settingsTab = findTab("Settings") || findTab("Einstellungen");
    if (!settingsTab) return;
    settingsTab.click();
    await new Promise((r) => setTimeout(r, 600));
    out.E_tabAfterSettingsClick = activeTabLabel();
    out.E_kpisVisibleOnSettings = queryItems().length > 0;
  });

  return out;
}, PANEL_QUERY);

console.log(JSON.stringify(result, null, 2));

const okFiveKpis = result.kpiCount === 5;
const okOverdueClick =
  result.A_afterOverdueClick_dropdownValue === "overdue" &&
  result.A_afterOverdueClick_overdueActive === true;
const okTasksClick =
  result.B_afterTasksClick_dropdownValue === "" &&
  result.B_afterTasksClick_overdueActive === false;
const okKpisOnCalendar = result.C_kpisVisibleOnCalendar === true;
const okFilterFromCalendar =
  result.D_tabAfterOverdueFromCalendar?.toLowerCase().includes("dashboard") ===
    true ||
  result.D_tabAfterOverdueFromCalendar?.toLowerCase().includes("übersicht") ===
    true;
const okKpisOnSettings = result.E_kpisVisibleOnSettings === true;

console.log(
  "\n=== SUMMARY ===\n" +
    `  5 clickable KPIs (Dashboard tab): ${okFiveKpis ? "✓" : "✗"} (${result.kpiCount})\n` +
    `  Overdue click → dropdown=overdue: ${okOverdueClick ? "✓" : "✗"}\n` +
    `  Tasks click clears + dehighlight: ${okTasksClick ? "✓" : "✗"}\n` +
    `  KPIs visible on Calendar tab:    ${okKpisOnCalendar ? "✓" : "✗"} (${result.C_kpisVisibleOnCalendar})\n` +
    `  KPIs visible on Settings tab:    ${okKpisOnSettings ? "✓" : "✗"} (${result.E_kpisVisibleOnSettings})\n` +
    `  Filter-from-Calendar tab works:  ${okFilterFromCalendar ? "✓" : "✗"} (tab-after=${result.D_tabAfterOverdueFromCalendar}, dropdown=${result.D_dropdownValue})`,
);

if (errors.length) {
  console.log("\n=== Browser errors ===");
  errors.slice(0, 5).forEach((e) => console.log(`  ${e.substring(0, 200)}`));
}

await browser.close();
process.exit(
  okFiveKpis &&
    okOverdueClick &&
    okTasksClick &&
    okKpisOnCalendar &&
    okKpisOnSettings &&
    okFilterFromCalendar
    ? 0
    : 1,
);
