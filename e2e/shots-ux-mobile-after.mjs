/** After-shots for the narrow-viewport disclosure rework: collapsed landing
 *  view + expanded filters + expanded actions menu on phone/tablet. */
import { chromium } from "@playwright/test";
import fs from "fs";
import { watchdog } from "./ws-client.mjs";

const REST = "http://127.0.0.1:8131";
const HA = "http://ha-shots:8123";
const PW_WS = "ws://127.0.0.1:3000/";
const CID = REST + "/";
const OUT = new URL("./shots/ux/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const log = (...a) => console.log(...a);
watchdog(10 * 60e3, "ux after shots");
const j = (r) => r.json();

async function login() {
  const f = await fetch(REST + "/auth/login_flow", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: CID, handler: ["homeassistant", null], redirect_uri: CID }),
  }).then(j);
  const s = await fetch(REST + "/auth/login_flow/" + f.flow_id, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: CID, username: "demo", password: "demo-pass-1" }),
  }).then(j);
  const t = await fetch(REST + "/auth/token", {
    method: "POST",
    body: new URLSearchParams({ grant_type: "authorization_code", code: s.result, client_id: CID }),
  }).then(j);
  if (!t.access_token) throw new Error("login failed");
  return t.access_token;
}

const deepFindPanel = `
  const deep = (pred) => { const st=[document.documentElement]; const o=[]; let n=0;
    while (st.length && n < 60000) { const el = st.pop(); n++; if (!el) continue;
      if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
      for (const k of (el.children || [])) st.push(k); } return o; };
  window.__panel = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-PANEL")[0];
`;

const token = await login();
fs.mkdirSync(OUT, { recursive: true });

for (const [name, width, height] of [["phone-390", 390, 844], ["phone-360", 360, 740], ["tablet-portrait-820", 820, 1180]]) {
  const b = await chromium.connect(PW_WS, { timeout: 20000 });
  try {
    const ctx = await b.newContext({ viewport: { width, height }, colorScheme: "dark" });
    await ctx.addInitScript(({ t, ha }) => {
      localStorage.setItem("hassTokens", JSON.stringify({
        access_token: t, token_type: "Bearer", expires_in: 1800,
        hassUrl: ha, clientId: ha + "/", expires: Date.now() + 9e11, refresh_token: "",
      }));
      localStorage.setItem("msp-overview-tab", "dashboard");
    }, { t: token, ha: HA });
    const p = await ctx.newPage();
    await p.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded" });
    let mounted = false;
    for (let i = 0; i < 25 && !mounted; i++) {
      await p.waitForTimeout(1000);
      mounted = await p.evaluate(({ finder }) => {
        eval(finder);
        return !!window.__panel && Array.isArray(window.__panel._objects) && window.__panel._objects.length > 0;
      }, { finder: deepFindPanel }).catch(() => false);
    }
    if (!mounted) { log("NOT MOUNTED", name); continue; }
    await p.waitForTimeout(1500);
    await p.screenshot({ path: `${OUT}${name}-after.png` });
    log("SHOT", `${name}-after.png`);
    if (name === "phone-390") {
      await p.evaluate(({ finder }) => { eval(finder); window.__panel._actionsMenuOpen = true; }, { finder: deepFindPanel });
      await p.waitForTimeout(500);
      await p.screenshot({ path: `${OUT}${name}-after-menu.png` });
      log("SHOT", `${name}-after-menu.png`);
      await p.evaluate(({ finder }) => {
        eval(finder);
        window.__panel._actionsMenuOpen = false;
        window.__panel._filtersOpen = true;
      }, { finder: deepFindPanel });
      await p.waitForTimeout(500);
      await p.screenshot({ path: `${OUT}${name}-after-filters.png` });
      log("SHOT", `${name}-after-filters.png`);
    }
    await ctx.close();
  } catch (e) {
    log("FAIL", name, String(e && e.message || e).slice(0, 150));
  } finally {
    await b.close().catch(() => {});
  }
}
log("DONE");
