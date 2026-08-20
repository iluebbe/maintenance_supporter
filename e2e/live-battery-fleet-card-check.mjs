/** Live check: the Battery Fleet Lovelace card (#135 follow-up).
 *
 *   1. Creates a throwaway storage dashboard with ONE card:
 *      custom:maintenance-battery-fleet-card (title "Live Check").
 *   2. Opens it and asserts the card renders: ha-card with the title, the
 *      flat section inside with its header, the roster (incl. add-picker and
 *      track-self-charging toggle), and NO raw locale keys.
 *   3. Deletes the dashboard again.
 */
import { chromium } from "@playwright/test";
import { hassTokensInit, loadToken, watchdog, wsClient } from "./ws-client.mjs";

const HA = "http://ha-maint:8123", REST = "http://127.0.0.1:8125", PW_WS = "ws://127.0.0.1:3000/";
const log = (...a) => console.log(...a);
const fail = (m) => { console.error("FAIL:", m); throw new Error(m); };
const assert = (cond, msg) => { if (!cond) fail(msg); log("  ok:", msg); };
watchdog(5 * 60e3, "battery fleet card live check");

const token = loadToken();
const api = await wsClient(REST, token);
const stamp = Date.now() % 100000;
const URL_PATH = `test-bfc-${stamp}`;
let dashboardId = null;
let browser = null;

try {
  const dash = await api.send({
    type: "lovelace/dashboards/create",
    url_path: URL_PATH,
    title: `BFC Check ${stamp}`,
    mode: "storage",
    show_in_sidebar: false,
  });
  dashboardId = dash.id;
  assert(dashboardId, `throwaway dashboard created (${URL_PATH})`);

  await api.send({
    type: "lovelace/config/save",
    url_path: URL_PATH,
    config: {
      views: [{
        title: "BFC",
        cards: [{ type: "custom:maintenance-battery-fleet-card", title: "Live Check" }],
      }],
    },
  });
  log("  ok: dashboard config saved with the card");

  browser = await chromium.connect(PW_WS, { timeout: 20000 });
  const ctx = await browser.newContext({ viewport: { width: 1360, height: 950 } });
  const p = await ctx.newPage();
  await p.addInitScript(hassTokensInit, { t: token, ha: HA });
  await p.goto(`${HA}/${URL_PATH}/0`, { waitUntil: "domcontentloaded", timeout: 30000 });

  let ui = null;
  for (let i = 0; i < 30 && !ui; i++) {
    await p.waitForTimeout(1000);
    ui = await p.evaluate(() => {
      const deep = (pred) => { const st = [document.documentElement]; const o = []; let n = 0;
        while (st.length && n < 80000) { const el = st.pop(); n++; if (!el) continue;
          if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
          for (const k of (el.children || [])) st.push(k); } return o; };
      const card = deep((el) => el.tagName === "MAINTENANCE-BATTERY-FLEET-CARD")[0];
      if (!card || !card.shadowRoot) return null;
      const haCard = card.shadowRoot.querySelector("ha-card");
      const sec = card.shadowRoot.querySelector("maintenance-battery-fleet-section");
      if (!haCard || !sec || !sec.shadowRoot) return null;
      if (!sec.shadowRoot.querySelector(".bf-head")) return null; // overview not loaded yet
      const roster = sec.shadowRoot.querySelector("details.bf-roster");
      if (roster) roster.open = true;
      return {
        header: haCard.header || null,
        flat: sec.hasAttribute("flat"),
        head: !!sec.shadowRoot.querySelector(".bf-head"),
        roster: !!roster,
        picker: !!sec.shadowRoot.querySelector(".bf-add ha-selector"),
        toggle: !!sec.shadowRoot.querySelector(".bf-track-self input"),
        raw: (sec.shadowRoot.textContent || "").match(/battery_fleet_\w+/g) || [],
      };
    }).catch(() => null);
  }
  assert(ui, "the card rendered on the dashboard with a loaded overview");
  assert(ui.header === "Live Check", `config title reaches ha-card (${ui.header})`);
  assert(ui.flat, "the section runs in flat mode (no doubled chrome)");
  assert(ui.head, "the section header (title + low count) renders");
  assert(ui.roster, "the full roster renders on the dashboard");
  assert(ui.picker, "the add-battery picker is available on the dashboard");
  assert(ui.toggle, "the track-self-charging toggle is available on the dashboard");
  assert(ui.raw.length === 0, `no raw locale keys (${ui.raw.join(",") || "clean"})`);

  log("\nALL CARD LIVE CHECKS PASSED");
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
