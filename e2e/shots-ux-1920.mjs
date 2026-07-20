/** UX review screenshot sweep: the panel's landing view (and a scrolled
 *  variant) across phone / tablet / desktop viewports against the seeded
 *  ha-shots demo instance. Output goes to e2e/shots/ux/ — a review tool,
 *  not part of the docs set. */
import { chromium } from "@playwright/test";
import fs from "fs";
import { watchdog } from "./ws-client.mjs";

const REST = "http://localhost:8131";
const HA = "http://ha-shots:8123";
const PW_WS = "ws://127.0.0.1:3000/";
const CID = REST + "/";
const USER = "demo", PASS = "demo-pass-1";
const OUT = new URL("./shots/ux/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

const log = (...a) => console.log(...a);
watchdog(15 * 60e3, "ux viewport shots");
const j = (r) => r.json();

async function login() {
  const f = await fetch(REST + "/auth/login_flow", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: CID, handler: ["homeassistant", null], redirect_uri: CID }),
  }).then(j);
  const s = await fetch(REST + "/auth/login_flow/" + f.flow_id, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: CID, username: USER, password: PASS }),
  }).then(j);
  const t = await fetch(REST + "/auth/token", {
    method: "POST",
    body: new URLSearchParams({ grant_type: "authorization_code", code: s.result, client_id: CID }),
  }).then(j);
  if (!t.access_token) throw new Error("login failed " + JSON.stringify(t));
  return t.access_token;
}

const deepFindPanel = `
  const deep = (pred) => { const st=[document.documentElement]; const o=[]; let n=0;
    while (st.length && n < 60000) { const el = st.pop(); n++; if (!el) continue;
      if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
      for (const k of (el.children || [])) st.push(k); } return o; };
  window.__panel = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-PANEL")[0];
`;

const VIEWPORTS = [
  ["fullhd-1920", 1920, 1080],
];

fs.mkdirSync(OUT, { recursive: true });
const token = await login();

for (const [name, width, height] of VIEWPORTS) {
  // Fresh connection per viewport — the dockered browser wedges silently when
  // one connection cycles many contexts; a reconnect isolates each run.
  let b;
  try {
    b = await chromium.connect(PW_WS, { timeout: 20000 });
  } catch (e) {
    log("CONNECT FAIL at", name, String(e).slice(0, 120));
    continue;
  }
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
  if (!mounted) { log("NOT MOUNTED at", name); await ctx.close(); continue; }
  await p.waitForTimeout(1500);
  await p.screenshot({ path: `${OUT}${name}-top.png` });
  log("SHOT", `${name}-top.png`);
  // Where do the actual tasks begin? Scroll one viewport-height down.
  await p.evaluate(({ finder, dy }) => {
    eval(finder);
    const sc = window.__panel?.shadowRoot?.querySelector(".content, .panel-content, main") || window;
    (sc.scrollBy ? sc : window).scrollBy(0, dy);
    // HA panels usually scroll the ha-panel-custom parent; also try document.
    document.scrollingElement && (document.scrollingElement.scrollTop += dy);
  }, { finder: deepFindPanel, dy: Math.round(height * 0.9) });
  await p.waitForTimeout(600);
  await p.screenshot({ path: `${OUT}${name}-scrolled.png` });
  log("SHOT", `${name}-scrolled.png`);
  await ctx.close();
  } catch (e) {
    log("VIEWPORT FAIL at", name, String(e && e.message || e).slice(0, 200));
  } finally {
    await b.close().catch(() => {});
  }
}
log("DONE ->", OUT);
