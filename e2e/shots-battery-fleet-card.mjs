/** Docs screenshot: the Battery Fleet Lovelace card (#135 follow-up).
 *
 *  Runs on the seeded ha-shots demo AFTER shots-remainder3.mjs (which seeds
 *  the Battery-Notes-shaped states this card renders). Creates a throwaway
 *  storage dashboard with just the card, shoots the CARD ELEMENT (not the
 *  page), writes docs/images/battery-fleet-card.png, deletes the dashboard.
 */
import { chromium } from "@playwright/test";
import { watchdog, wsClient } from "./ws-client.mjs";

const REST = "http://127.0.0.1:8131";
const HA = "http://ha-shots:8123";
const PW_WS = "ws://127.0.0.1:3000/";
const CID = HA + "/";
const OUT = new URL("../docs/images/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const log = (...a) => console.log(...a);
watchdog(6 * 60e3, "battery fleet card shot");

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

const token = await login();
const api = await wsClient(REST, token);
const URL_PATH = "demo-bfc-shot";
let dashboardId = null;
let browser = null;

try {
  // Re-runs: an earlier crash may have left the dashboard behind.
  const dashboards = await api.send({ type: "lovelace/dashboards/list" });
  const stale = (dashboards || []).find((d) => d.url_path === URL_PATH);
  if (stale) dashboardId = stale.id;
  if (!dashboardId) {
    const dash = await api.send({
      type: "lovelace/dashboards/create",
      url_path: URL_PATH,
      title: "BFC Shot",
      mode: "storage",
      show_in_sidebar: false,
    });
    dashboardId = dash.id;
  }
  await api.send({
    type: "lovelace/config/save",
    url_path: URL_PATH,
    // Panel view: the single card gets the full width instead of a narrow
    // masonry column, and the tall viewport keeps the element screenshot in
    // one piece (no cut-off header).
    config: { views: [{ title: "BFC", type: "panel", cards: [{ type: "custom:maintenance-battery-fleet-card" }] }] },
  });
  log("DASHBOARD READY", URL_PATH);

  browser = await chromium.connect(PW_WS, { timeout: 20000 });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 2900 }, colorScheme: "dark" });
  await ctx.addInitScript(({ t, ha }) => {
    localStorage.setItem("hassTokens", JSON.stringify({
      access_token: t, token_type: "Bearer", expires_in: 1800,
      hassUrl: ha, clientId: ha + "/", expires: Date.now() + 9e11, refresh_token: "",
    }));
  }, { t: token, ha: HA });
  const p = await ctx.newPage();
  await p.goto(`${HA}/${URL_PATH}/0`, { waitUntil: "domcontentloaded", timeout: 30000 });

  let ready = false;
  for (let i = 0; i < 30 && !ready; i++) {
    await p.waitForTimeout(1000);
    ready = await p.evaluate(() => {
      const deep = (pred) => { const st = [document.documentElement]; const o = []; let n = 0;
        while (st.length && n < 80000) { const el = st.pop(); n++; if (!el) continue;
          if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
          for (const k of (el.children || [])) st.push(k); } return o; };
      const card = deep((el) => el.tagName === "MAINTENANCE-BATTERY-FLEET-CARD")[0];
      const sec = card && card.shadowRoot && card.shadowRoot.querySelector("maintenance-battery-fleet-section");
      if (!sec || !sec.shadowRoot || !sec.shadowRoot.querySelector(".bf-head")) return false;
      const roster = sec.shadowRoot.querySelector("details.bf-roster");
      if (roster && !roster.open) { roster.open = true; return false; } // sparklines fetch next tick
      window.__bfcCard = card;
      return true;
    }).catch(() => false);
  }
  if (!ready) throw new Error("card did not render");
  await p.waitForTimeout(2500); // sparkline history fetch after roster open

  const handle = await p.evaluateHandle(() => window.__bfcCard);
  await handle.asElement().screenshot({ path: OUT + "battery-fleet-card.png" });
  log("SHOT battery-fleet-card.png");
  process.exitCode = 0;
} catch (err) {
  console.error("ERROR:", err && (err.stack || err.message || err));
  process.exitCode = 1;
} finally {
  try { if (dashboardId) await api.send({ type: "lovelace/dashboards/delete", dashboard_id: dashboardId }); } catch { /* ignore */ }
  try { if (browser) await browser.close(); } catch { /* ignore */ }
  try { api.close(); } catch { /* ignore */ }
  process.exit(process.exitCode ?? 1);
}
