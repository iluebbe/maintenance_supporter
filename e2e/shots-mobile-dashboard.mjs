/** One shot: the narrow-viewport dashboard with the collapsed Filter / + Add
 *  disclosure (UX 2026-07) for the docs' responsive section. UI login. */
import { chromium } from "@playwright/test";
import { watchdog } from "./ws-client.mjs";

const HA = "http://ha-shots:8123";
const OUT = new URL("../docs/images/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
watchdog(4 * 60e3, "mobile dashboard shot");

const b = await chromium.connect("ws://127.0.0.1:3000/", { timeout: 20000 });
const ctx = await b.newContext({ viewport: { width: 400, height: 860 }, colorScheme: "dark", isMobile: true, hasTouch: true });
const p = await ctx.newPage();
await p.goto(HA + "/", { waitUntil: "domcontentloaded" });
await p.waitForTimeout(4000);
await p.evaluate(() => {
  const deep = (pred) => { const st = [document.documentElement]; const o = []; let n = 0;
    while (st.length && n < 80000) { const el = st.pop(); n++; if (!el) continue;
      if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
      for (const k of (el.children || [])) st.push(k); } return o; };
  const inputs = deep((el) => el.tagName === "INPUT" && ["text", "password"].includes(el.type));
  const set = (el, v) => { el.focus(); el.value = v; el.dispatchEvent(new Event("input", { bubbles: true, composed: true })); };
  const user = inputs.find((i) => i.type === "text");
  const pass = inputs.find((i) => i.type === "password");
  if (user) set(user, "demo");
  if (pass) set(pass, "demo-pass-1");
});
await p.keyboard.press("Enter");
await p.waitForTimeout(6000);
await p.evaluate(() => localStorage.setItem("msp-overview-tab", "dashboard"));
await p.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded" });
await p.waitForTimeout(7000);
await p.screenshot({ path: OUT + "mobile-dashboard.png" });
console.log("SHOT mobile-dashboard.png");
await b.close();
