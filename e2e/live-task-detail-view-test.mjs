/** Live check: <maintenance-task-detail-view> web component (audit item 42).
 *  The task-detail sub-view now renders through a component boundary
 *  (light-DOM). Verifies: element present, no own shadow root, panel styles
 *  still apply (.detail-section padded, KPI bar laid out), tab switching and
 *  the more-menu still work through the ctx callbacks. */
import { chromium } from "@playwright/test";
import fs from "fs";
const HA = "http://ha-maint:8123", REST = "http://127.0.0.1:8125", PW_WS = "ws://127.0.0.1:3000/";
const OUT = new URL("./live-shots/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
fs.mkdirSync(OUT, { recursive: true });
const token = fs.readFileSync(new URL("../docker/.env", import.meta.url), "utf-8").match(/HA_TOKEN=(\S+)/)[1];
const auth = { Authorization: "Bearer " + token, "Content-Type": "application/json" };
const log = (...a) => console.log(...a);
setTimeout(() => { console.error("WATCHDOG"); process.exit(3); }, 6 * 60e3);

// Seed object via service.
const suffix = Date.now() % 100000;
const svc = await fetch(REST + "/api/services/maintenance_supporter/add_object?return_response", {
  method: "POST", headers: auth, body: JSON.stringify({ name: "Test Heizung " + suffix }),
}).then((r) => r.json());
const entryId = (svc.service_response ?? svc).entry_id;
log("object", entryId);

const b = await chromium.connect(PW_WS, { timeout: 20000 });
const ctx = await b.newContext({ viewport: { width: 1440, height: 950 } });
await ctx.addInitScript(({ t, ha }) => {
  localStorage.setItem("hassTokens", JSON.stringify({
    access_token: t, token_type: "Bearer", expires_in: 1800,
    hassUrl: ha, clientId: ha + "/", expires: Date.now() + 9e11, refresh_token: "",
  }));
}, { t: token, ha: HA });
const p = await ctx.newPage();
await p.goto(HA + "/lovelace", { waitUntil: "domcontentloaded" });
await p.waitForTimeout(6000);

// Task with checklist via WS (in-page, shots-demo style).
const taskId = await p.evaluate(async ({ entryId }) => {
  const hass = document.querySelector("home-assistant").hass;
  const r = await hass.connection.sendMessagePromise({
    type: "maintenance_supporter/task/create",
    entry_id: entryId, name: "Wartung Brenner", task_type: "service",
    interval_days: 365, warning_days: 14,
    notes: "Komponente-Boundary-Livecheck.",
    checklist: ["Schritt 1", "Schritt 2"],
  });
  return r.task_id;
}, { entryId });
log("task", taskId);

// Deep-link straight to the task detail.
await p.goto(HA + `/maintenance-supporter?entry_id=${entryId}&task_id=${taskId}`, { waitUntil: "domcontentloaded" });
await p.waitForTimeout(8000);
const panel = p.locator("maintenance-supporter-panel");
await panel.locator("maintenance-task-detail-view .task-header").waitFor({ timeout: 20000 });

const checks = await p.evaluate(() => {
  const panel = document.querySelector("home-assistant")
    .shadowRoot.querySelector("home-assistant-main")
    .shadowRoot.querySelector("maintenance-supporter-panel");
  const view = panel.shadowRoot.querySelector("maintenance-task-detail-view");
  const section = view && view.querySelector(".detail-section");
  const kpi = view && view.querySelector(".kpi-bar .kpi-card");
  const cs = section && getComputedStyle(section);
  const vd = view && getComputedStyle(view).display;
  return {
    componentPresent: !!view,
    lightDom: !!view && view.shadowRoot === null,
    sectionInLightDom: !!section,
    viewDisplay: vd,
    sectionPadding: cs ? cs.paddingTop : null,
    kpiCardRendered: !!kpi && kpi.getBoundingClientRect().height > 20,
    headerName: view?.querySelector(".task-name-breadcrumb")?.textContent?.trim() || "",
    tabCount: view ? view.querySelectorAll(".tab-bar .tab").length : 0,
  };
});
log("VERIFY", JSON.stringify(checks, null, 1));
await p.screenshot({ path: OUT + "50-task-detail-component.png", fullPage: false });
if (!checks.componentPresent) throw new Error("component missing");
if (!checks.lightDom) throw new Error("component grew a shadow root — panel styles would break");
if (!checks.sectionInLightDom) throw new Error("detail-section not in light DOM");
if (checks.viewDisplay !== "block") throw new Error("display:block rule not applied: " + checks.viewDisplay);
if (checks.sectionPadding !== "16px") throw new Error("panel styles not applying (padding=" + checks.sectionPadding + ")");
if (!checks.kpiCardRendered) throw new Error("KPI bar not laid out");
if (checks.headerName !== "Wartung Brenner") throw new Error("header name wrong: " + checks.headerName);
if (checks.tabCount !== 2) throw new Error("tab bar wrong");

// Tab switch works through the ctx callback (panel state → re-render).
await panel.locator("maintenance-task-detail-view .tab-bar .tab").nth(1).click();
await p.waitForTimeout(1200);
const historyVisible = await p.evaluate(() => {
  const panel = document.querySelector("home-assistant")
    .shadowRoot.querySelector("home-assistant-main")
    .shadowRoot.querySelector("maintenance-supporter-panel");
  const view = panel.shadowRoot.querySelector("maintenance-task-detail-view");
  return !!view.querySelector(".history-tab");
});
if (!historyVisible) throw new Error("history tab did not activate through the component");
log("tab switch OK");

// More-menu opens (panel-owned state, dialog ownership unchanged).
await panel.locator("maintenance-task-detail-view .more-menu-wrapper ha-icon-button").click();
await p.waitForTimeout(600);
const menuItems = await panel.locator("maintenance-task-detail-view .popup-menu-item").count();
log("more-menu items:", menuItems);
if (menuItems < 5) throw new Error("more-menu broken");
await p.screenshot({ path: OUT + "51-task-detail-component-menu.png", fullPage: false });

// Cleanup the seeded object.
await p.evaluate(async ({ entryId }) => {
  const hass = document.querySelector("home-assistant").hass;
  await hass.connection.sendMessagePromise({ type: "maintenance_supporter/object/delete", entry_id: entryId });
}, { entryId });
log("cleanup done");

log("ALL OK");
await ctx.close(); await b.close(); process.exit(0);
