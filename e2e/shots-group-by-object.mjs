/** docs/images/group-by-object.png — the dashboard grouped by object/device
 *  (#150, 2.71+): the GROUP BY dropdown on "By object" with the collapsible
 *  per-object sections below, dark theme, on the seeded demo instance.
 *  Prereqs: seeded ha-shots + playwright-server running (see shots-demo.mjs). */
import { chromium } from "@playwright/test";
import { haLogin, watchdog } from "./ws-client.mjs";

const REST = "http://127.0.0.1:8131", HA = "http://ha-shots:8123", PW_WS = "ws://127.0.0.1:3000/";
const OUT = new URL("../docs/images/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const log = (...a) => console.log(...a);
watchdog(5 * 60e3, "group-by-object shot");

const DEEP = `const deep = (pred) => { const st=[document.documentElement]; const o=[]; let n=0;
  while (st.length && n < 80000) { const el = st.pop(); n++; if (!el) continue;
    if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
    for (const k of (el.children || [])) st.push(k); } return o; };
  window.__deep = deep;
  window.__panel = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-PANEL")[0];`;

const token = await haLogin(REST, { user: "demo", pass: "demo-pass-1", cid: HA + "/" });
const b = await chromium.connect(PW_WS, { timeout: 20000 });
const ctx = await b.newContext({ viewport: { width: 1600, height: 1100 }, colorScheme: "dark" });
await ctx.addInitScript(({ t, ha }) => {
  localStorage.setItem("hassTokens", JSON.stringify({
    access_token: t, token_type: "Bearer", expires_in: 1800,
    hassUrl: ha, clientId: ha + "/", expires: Date.now() + 9e11, refresh_token: "",
  }));
  localStorage.setItem("msp-overview-tab", '"dashboard"');
}, { t: token, ha: HA });
const p = await ctx.newPage();
await p.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded" });
for (let i = 0; i < 30; i++) {
  await p.waitForTimeout(1000);
  const ok = await p.evaluate(({ d }) => { eval(d); return !!window.__panel && Array.isArray(window.__panel._objects) && window.__panel._objects.length > 0; }, { d: DEEP }).catch(() => false);
  if (ok) break;
}
const ready = await p.evaluate(async ({ d }) => {
  eval(d);
  const panel = window.__panel;
  if (!panel) return false;
  panel._activeTab = "dashboard";
  panel._groupByMode = "object";
  await panel.updateComplete;
  return panel.shadowRoot.querySelectorAll(".group-section").length;
}, { d: DEEP });
if (!ready || ready < 2) throw new Error(`group sections not rendered (${ready})`);
await p.waitForTimeout(1500);
const rect = await p.evaluate(({ d }) => {
  eval(d);
  const r = window.__panel.getBoundingClientRect();
  return { x: Math.max(0, r.x), y: 0, width: Math.min(r.width, 1600), height: 1000 };
}, { d: DEEP });
await p.screenshot({ path: OUT + "group-by-object.png", clip: rect });
log(`SHOT group-by-object.png (${ready} sections)`);
await ctx.close();
await b.close();
process.exit(0);
