/** Viewport sweep for the panel: dashboard + object detail at tablet
 *  (portrait/landscape: iPad mini, iPad/Air, iPad Pro 11/13) and desktop
 *  sizes (1366/1920/2560) against the seeded ha-shots demo instance.
 *
 *    node e2e/shots-viewports.mjs [out-dir]
 *
 *  Why it exists (#145, 2026-08-30): the panel has TWO width regimes that
 *  are not the viewport — HA sets `narrow` below 870 px, but with the
 *  sidebar docked an iPad in portrait leaves ~768 px of panel inside a
 *  1024 px viewport. That band overflowed the wide row grid; the panel now
 *  measures itself (`tight`). Re-run after any change to the task-row grid
 *  or the row actions and eyeball the 744–1133 px shots first.
 *  Prereqs: ha-shots + playwright-server running, demo seed present. */
import fs from "fs";
import { chromium } from "@playwright/test";
import { haLogin, watchdog } from "./ws-client.mjs";

const REST = "http://127.0.0.1:8131", HA = "http://ha-shots:8123", PW_WS = "ws://127.0.0.1:3000/";
const OUT = process.argv[2] || "./viewport-shots/";
fs.mkdirSync(OUT, { recursive: true });
const log = (...a) => console.log(...a);
watchdog(12 * 60e3, "viewport sweep");

const DEEP = `const deep = (pred) => { const st=[document.documentElement]; const o=[]; let n=0;
  while (st.length && n < 80000) { const el = st.pop(); n++; if (!el) continue;
    if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
    for (const k of (el.children || [])) st.push(k); } return o; };
  window.__panel = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-PANEL")[0];`;

// [label, width, height]
const SIZES = [
  ["ipad-mini-portrait", 744, 1133], ["ipad-mini-landscape", 1133, 744],
  ["ipad-portrait", 820, 1180], ["ipad-landscape", 1180, 820],
  ["ipad-pro-11-portrait", 834, 1194], ["ipad-pro-11-landscape", 1194, 834],
  ["ipad-pro-13-portrait", 1024, 1366], ["ipad-pro-13-landscape", 1366, 1024],
  ["laptop-1366", 1366, 768], ["desktop-1920", 1920, 1080], ["desktop-2560", 2560, 1440],
];

const token = await haLogin(REST, { user: "demo", pass: "demo-pass-1", cid: HA + "/" });
const b = await chromium.connect(PW_WS, { timeout: 20000 });
const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: "dark" });
await ctx.addInitScript(({ t, ha }) => {
  localStorage.setItem("hassTokens", JSON.stringify({
    access_token: t, token_type: "Bearer", expires_in: 1800,
    hassUrl: ha, clientId: ha + "/", expires: Date.now() + 9e11, refresh_token: "",
  }));
  localStorage.setItem("msp-overview-tab", "dashboard");
}, { t: token, ha: HA });
const p = await ctx.newPage();

async function mounted() {
  for (let i = 0; i < 30; i++) {
    await p.waitForTimeout(1000);
    const ok = await p.evaluate(({ d }) => { eval(d); return !!window.__panel && Array.isArray(window.__panel._objects) && window.__panel._objects.length > 0; }, { d: DEEP }).catch(() => false);
    if (ok) return;
  }
  throw new Error("panel not mounted");
}

await p.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded" });
await mounted();
for (const [label, w, h] of SIZES) {
  await p.setViewportSize({ width: w, height: h });
  await p.evaluate(({ d }) => { eval(d); const panel = window.__panel; panel._selectedEntryId = null; panel._setOverviewTab ? panel._setOverviewTab("dashboard") : (panel._overviewTab = "dashboard"); }, { d: DEEP });
  await p.waitForTimeout(1500);
  await p.screenshot({ path: `${OUT}${label}-dashboard.png` });
  log("SHOT", `${label}-dashboard.png`);
  await p.evaluate(({ d }) => { eval(d); const panel = window.__panel; const o = panel._objects.find((x) => x.object.name === "HVAC System"); panel._showObject(o.entry_id); }, { d: DEEP });
  await p.waitForTimeout(1500);
  await p.screenshot({ path: `${OUT}${label}-object.png` });
  log("SHOT", `${label}-object.png`);
  await p.evaluate(({ d }) => { eval(d); window.__panel._selectedEntryId = null; window.__panel._view = "overview"; }, { d: DEEP }).catch(() => undefined);
  await p.waitForTimeout(400);
}
await ctx.close();
await b.close();
log("DONE");
