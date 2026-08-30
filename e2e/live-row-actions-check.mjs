/** Live check on ha-maint for the #145 row-action style (2.69):
 *
 *   1. settings exposes `row_action_style` (default buttons_compact) and the
 *      one-time `row_action_notice_pending` flag;
 *   2. with the notice pending, the panel shows the banner (admin) and its
 *      "Back to icons" button writes style=icons + clears the notice in one
 *      round trip — rows then render the classic mwc-icon-button pair;
 *   3. switching back to buttons_compact renders ha-button rows (labelled on
 *      desktop, icon-only on a phone viewport).
 *
 *  Leaves the household on buttons_compact with the notice cleared.
 */
import { chromium } from "@playwright/test";
import { hassTokensInit, loadToken, watchdog, wsClient } from "./ws-client.mjs";

const HA = "http://ha-maint:8123", REST = "http://127.0.0.1:8125", PW_WS = "ws://127.0.0.1:3000/";
const log = (...a) => console.log(...a);
const fail = (m) => { console.error("FAIL:", m); throw new Error(m); };
const assert = (cond, msg) => { if (!cond) fail(msg); log("  ok:", msg); };
watchdog(5 * 60e3, "row-actions live check");

const DEEP = `const deep = (pred) => { const st=[document.documentElement]; const o=[]; let n=0;
  while (st.length && n < 80000) { const el = st.pop(); n++; if (!el) continue;
    if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
    for (const k of (el.children || [])) st.push(k); } return o; };
  window.__deep = deep;
  window.__panel = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-PANEL")[0];`;

const token = loadToken();
const api = await wsClient(REST, token);
let browser = null;

const settings = async () => (await api.send({ type: "maintenance_supporter/settings" })).general;
const update = (s) => api.send({ type: "maintenance_supporter/global/update", settings: s });

try {
  // 1. payload + default
  let g = await settings();
  assert(["buttons_compact", "buttons", "icons"].includes(g.row_action_style), `row_action_style exposed (${g.row_action_style})`);
  assert(typeof g.row_action_notice_pending === "boolean", "row_action_notice_pending exposed");
  await update({ row_action_style: "buttons_compact", row_action_notice_pending: true });
  g = await settings();
  assert(g.row_action_notice_pending === true, "notice re-armed for the check");

  browser = await chromium.connect(PW_WS, { timeout: 20000 });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await ctx.addInitScript(hassTokensInit, { t: token, ha: HA });
  const p = await ctx.newPage();

  const mounted = async () => {
    for (let i = 0; i < 30; i++) {
      await p.waitForTimeout(1000);
      const ok = await p.evaluate(({ d }) => { eval(d); return !!window.__panel && Array.isArray(window.__panel._objects) && window.__panel._objects.length > 0; }, { d: DEEP }).catch(() => false);
      if (ok) return;
    }
    fail("panel not mounted");
  };
  const rowKinds = () => p.evaluate(({ d }) => {
    eval(d);
    const panel = window.__panel;
    panel._setOverviewTab ? panel._setOverviewTab("dashboard") : (panel._overviewTab = "dashboard");
    return new Promise((r) => setTimeout(() => {
      const sr = panel.shadowRoot;
      r({
        icon: sr.querySelectorAll(".row-actions mwc-icon-button.btn-complete").length,
        button: sr.querySelectorAll(".row-actions.as-buttons ha-button").length,
        compact: sr.querySelectorAll(".row-actions.as-buttons.compact").length,
        banner: !!sr.querySelector(".row-actions-banner"),
      });
    }, 800));
  }, { d: DEEP });

  // 2. banner + "Back to icons"
  await p.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded" });
  await mounted();
  let k = await rowKinds();
  assert(k.banner, "banner shown while the notice is pending (admin)");
  assert(k.button > 0 && k.icon === 0, `rows render ha-buttons by default (${k.button})`);
  await p.evaluate(({ d }) => {
    eval(d);
    const btns = [...window.__panel.shadowRoot.querySelectorAll(".row-actions-banner ha-button")];
    btns[btns.length - 1].click(); // "Back to icons" is the filled, last button
  }, { d: DEEP });
  await p.waitForTimeout(2500);
  g = await settings();
  assert(g.row_action_style === "icons" && g.row_action_notice_pending === false, "Back to icons wrote style=icons + cleared the notice");
  k = await rowKinds();
  assert(!k.banner, "banner gone after the choice");
  assert(k.icon > 0 && k.button === 0, `rows render the classic icon pair (${k.icon})`);

  // 3. back to buttons_compact: labelled on desktop, icon-only on a phone width
  await update({ row_action_style: "buttons_compact" });
  await p.reload({ waitUntil: "domcontentloaded" });
  await mounted();
  k = await rowKinds();
  assert(k.button > 0 && k.compact === 0, "desktop: labelled ha-buttons, not compact");
  await p.setViewportSize({ width: 400, height: 860 });
  await p.waitForTimeout(1500);
  k = await rowKinds();
  assert(k.compact > 0, `phone: compact icon-only ha-buttons (${k.compact} rows)`);

  await ctx.close();
  log("ROW-ACTIONS LIVE CHECK: PASS");
} finally {
  try { await update({ row_action_style: "buttons_compact", row_action_notice_pending: false }); } catch { /* best effort */ }
  if (browser) await browser.close().catch(() => undefined);
  api.close();
}
