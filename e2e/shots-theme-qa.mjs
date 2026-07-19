/** Dark/light theme QA screenshots of the panel task list (status badges).
 *
 * Uses the already-seeded ha-shots instance (8131) — no re-seed. Captures the
 * dashboard in both dark and light so the status-badge contrast fix (dark text
 * on green/orange/grey) can be eyeballed against white text before it. Output
 * to the scratchpad, not docs/. */
import { chromium } from "@playwright/test";
import { watchdog, wsClient, hassTokensInit } from "./ws-client.mjs";

const REST = "http://127.0.0.1:8131";
const HA = "http://ha-shots:8123";
const PW_WS = "ws://127.0.0.1:3000/";
const CID = REST + "/";
const USER = "demo", PASS = "demo-pass-1";
const OUT = process.argv[2] || ".";
const log = (...a) => console.log(...a);
watchdog(4 * 60e3, "theme-qa shots");
const j = (r) => r.json();

async function exchange(code) {
  const t = await fetch(REST + "/auth/token", {
    method: "POST",
    body: new URLSearchParams({ grant_type: "authorization_code", code, client_id: CID }),
  }).then(j);
  if (!t.access_token) throw new Error("token exchange failed " + JSON.stringify(t));
  return t.access_token;
}
async function login() {
  const f = await fetch(REST + "/auth/login_flow", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: CID, handler: ["homeassistant", null], redirect_uri: CID }),
  }).then(j);
  const s = await fetch(REST + "/auth/login_flow/" + f.flow_id, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: CID, username: USER, password: PASS }),
  }).then(j);
  return exchange(s.result);
}

const token = await login();
log("logged in");
const api = await wsClient(REST, token);

async function setTheme(mode) {
  await api.send({ type: "call_service", domain: "frontend", service: "set_theme", service_data: { name: "default", mode } });
}

async function seedAuth(page) {
  await page.addInitScript(hassTokensInit, { t: token, ha: HA });
}

const b = await chromium.connect(PW_WS, { timeout: 20000 });

// The custom panel lives deep in nested shadow roots — a flat selector can't
// reach it. Poll a deep-traversal finder until objects are loaded (mirrors
// shots-demo.mjs).
const deepFindPanel = `
  const deep = (pred) => { const st=[document.documentElement]; const o=[]; let n=0;
    while (st.length && n < 60000) { const el = st.pop(); n++; if (!el) continue;
      if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
      for (const k of (el.children || [])) st.push(k); } return o; };
  window.__panel = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-PANEL")[0];
`;

async function shoot(mode) {
  await setTheme(mode);
  const ctx = await b.newContext({ viewport: { width: 1500, height: 1000 }, colorScheme: mode, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  await seedAuth(p);
  await p.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded" });
  let mounted = false;
  for (let i = 0; i < 30 && !mounted; i++) {
    await p.waitForTimeout(1000);
    mounted = await p.evaluate(({ finder }) => {
      eval(finder);
      return !!window.__panel && Array.isArray(window.__panel._objects) && window.__panel._objects.length > 0;
    }, { finder: deepFindPanel }).catch(() => false);
  }
  if (!mounted) throw new Error("panel never mounted with objects (" + mode + ")");
  await p.waitForTimeout(2000);
  const file = OUT + "/theme-" + mode + ".png";
  await p.screenshot({ path: file });
  // Crisp close-up of the status-badge column (left edge of the task table).
  await p.screenshot({ path: OUT + "/theme-" + mode + "-badges.png", clip: { x: 95, y: 175, width: 340, height: 560 } });
  log("captured", file, "mounted=", mounted);
  await ctx.close();
}

await shoot("dark");
await shoot("light");
await b.close();
log("THEME QA SHOTS DONE");
process.exit(0);
