/** docs/images/object-history.png — the object's History card (all tasks,
 *  filter row, service-record link) on the seeded Pool Pump, dark theme.
 *  Replaces the light-theme v2.64 one-off. Prereqs: seeded ha-shots +
 *  playwright-server running (see shots-demo.mjs). */
import { chromium } from "@playwright/test";
import { haLogin, watchdog } from "./ws-client.mjs";

const REST = "http://127.0.0.1:8131", HA = "http://ha-shots:8123", PW_WS = "ws://127.0.0.1:3000/";
const OUT = new URL("../docs/images/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const log = (...a) => console.log(...a);
watchdog(5 * 60e3, "object-history shot");

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
}, { t: token, ha: HA });
const p = await ctx.newPage();
await p.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded" });
for (let i = 0; i < 30; i++) {
  await p.waitForTimeout(1000);
  const ok = await p.evaluate(({ d }) => { eval(d); return !!window.__panel && Array.isArray(window.__panel._objects) && window.__panel._objects.length > 0; }, { d: DEEP }).catch(() => false);
  if (ok) break;
}
await p.evaluate(({ d }) => {
  eval(d);
  const panel = window.__panel;
  const o = panel._objects.find((x) => x.object.name === "Pool Pump") || panel._objects[0];
  panel._showObject(o.entry_id);
}, { d: DEEP });
await p.waitForTimeout(2500);
const rect = await p.evaluate(({ d }) => {
  eval(d);
  const sec = window.__deep((el) => el.tagName === "MAINTENANCE-OBJECT-HISTORY-SECTION")[0];
  if (!sec) return null;
  sec.scrollIntoView({ block: "start" });
  const r = sec.getBoundingClientRect();
  return { x: Math.max(0, r.x - 8), y: Math.max(0, r.y - 8), width: Math.min(r.width + 16, 1600), height: Math.min(r.height + 16, 1080) };
}, { d: DEEP });
if (!rect || rect.width < 200) throw new Error("history section not rendered");
await p.waitForTimeout(600);
await p.screenshot({ path: OUT + "object-history.png", clip: rect });
log("SHOT object-history.png");
await ctx.close();
await b.close();
log("DONE");
