/** docs/images/split-view.png — the master-detail split on a wide panel
 *  (2.71+): task list left, the docked task detail (chart, KPIs, history,
 *  actions) right, the selected row marked. 1920 viewport, dark theme, on
 *  the seeded demo instance.
 *  Prereqs: seeded ha-shots + playwright-server running (see shots-demo.mjs). */
import { chromium } from "@playwright/test";
import { haLogin, watchdog } from "./ws-client.mjs";

const REST = "http://127.0.0.1:8131", HA = "http://ha-shots:8123", PW_WS = "ws://127.0.0.1:3000/";
const OUT = new URL("../docs/images/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const log = (...a) => console.log(...a);
watchdog(5 * 60e3, "split-view shot");

const DEEP = `window.__panel = (function(){const st=[document.documentElement];let n=0;while(st.length&&n<80000){const el=st.pop();n++;if(!el)continue;if(el.tagName==="MAINTENANCE-SUPPORTER-PANEL")return el;if(el.shadowRoot)st.push(el.shadowRoot);for(const k of (el.children||[]))st.push(k);}return null;})();`;

const token = await haLogin(REST, { user: "demo", pass: "demo-pass-1", cid: HA + "/" });
const b = await chromium.connect(PW_WS, { timeout: 20000 });
const ctx = await b.newContext({ viewport: { width: 1920, height: 1080 }, colorScheme: "dark" });
await ctx.addInitScript(({ t, ha }) => {
  localStorage.setItem("hassTokens", JSON.stringify({
    access_token: t, token_type: "Bearer", expires_in: 1800,
    hassUrl: ha, clientId: ha + "/", expires: Date.now() + 9e11, refresh_token: "",
  }));
  localStorage.setItem("msp-overview-tab", "dashboard");
}, { t: token, ha: HA });
const p = await ctx.newPage();
await p.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded" });
for (let i = 0; i < 30; i++) {
  await p.waitForTimeout(1000);
  const ok = await p.evaluate(({ d }) => { eval(d); return !!window.__panel && window.__panel._objects?.length > 0; }, { d: DEEP }).catch(() => false);
  if (ok) break;
}
await p.waitForTimeout(1000);
const clicked = await p.evaluate(() => {
  const sr = window.__panel.shadowRoot;
  for (const row of sr.querySelectorAll(".task-row")) {
    const name = row.querySelector(".cell.task-name");
    if (name?.textContent?.includes("Filter Replacement")) { name.click(); return true; }
  }
  const first = sr.querySelector(".task-row .cell.task-name");
  if (first) { first.click(); return true; }
  return false;
});
if (!clicked) throw new Error("no task row to select");
await p.waitForTimeout(2500);
const ok = await p.evaluate(() => ({
  pane: !!window.__panel.shadowRoot.querySelector(".split-pane maintenance-task-detail-view"),
  sel: !!window.__panel.shadowRoot.querySelector(".task-row.selected"),
}));
if (!ok.pane || !ok.sel) throw new Error("split state not reached: " + JSON.stringify(ok));
const rect = await p.evaluate(() => {
  const r = window.__panel.getBoundingClientRect();
  return { x: Math.max(0, r.x), y: 0, width: Math.min(r.width, 1920 - Math.max(0, r.x)), height: 1080 };
});
await p.screenshot({ path: OUT + "split-view.png", clip: rect });
log("SHOT split-view.png");
await ctx.close();
await b.close();
process.exit(0);
