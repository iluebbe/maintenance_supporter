/** Phone-width check of the battery fleet section (discussion #162).
 *
 * A user reported (iPhone) icons sticking out on the right of the battery
 * lists below "Needed soon". The overflow sweep never visited the fleet task,
 * so nothing guarded it. This opens the fleet task on the demo instance
 * (ha-shots, 8131) at 360 px (common Android) and 390 px (iPhone 12–15), in
 * English and German, opens the full roster, and fails when anything in the
 * fleet section passes the viewport or draws past its own unclipped box
 * (the sweep's spill rule, shadow roots walked). The Lovelace battery fleet
 * card gets the same check on a throwaway dashboard (removed afterwards).
 *
 *   docker restart playwright-server
 *   node e2e/live-battery-fleet-narrow-check.mjs
 */
import { chromium } from "@playwright/test";
import { haLogin, watchdog, wsClient } from "./ws-client.mjs";

const REST = process.env.HA_REST || "http://127.0.0.1:8131";
const HA = process.env.HA_BROWSER || "http://ha-shots:8123";
const PW_WS = process.env.PW_WS || "ws://127.0.0.1:3000/";
const SHOT = process.env.SHOT_DIR || "";
const LANGS = (process.env.MS_LANGS || "en,de").split(",");
const WIDTHS = [360, 390];
const log = (...a) => console.log(...a);
watchdog(8 * 60e3, "battery fleet narrow check");

const token = await haLogin(REST, { user: "demo", pass: "demo-pass-1", cid: HA + "/" });
const api = await wsClient(REST, token);
const { objects } = await api.send({ type: "maintenance_supporter/objects" });
const fleet = objects.find((o) => o.tasks.some((t) => t.battery_fleet_task));
if (!fleet) throw new Error("the demo has no battery fleet (run shots-demo / remainder3 first)");
const fleetTask = fleet.tasks.find((t) => t.battery_fleet_task);
const setLang = (lg) => api.send({
  type: "frontend/set_user_data",
  key: "language",
  value: { language: lg, number_format: "language", time_format: "language", date_format: "language", first_weekday: "language" },
});

const findSection = `(() => {
  const st = [document.documentElement]; let n = 0;
  while (st.length && n++ < 20000) {
    const el = st.pop();
    if (el.tagName === "MAINTENANCE-BATTERY-FLEET-SECTION") return el;
    if (el.shadowRoot) st.push(...el.shadowRoot.querySelectorAll("*"));
    else if (el.children) st.push(...el.children);
  }
  return null;
})()`;

const findCard = `(() => {
  const st = [document.documentElement]; let n = 0;
  while (st.length && n++ < 20000) {
    const el = st.pop();
    if (el.tagName === "MAINTENANCE-BATTERY-FLEET-CARD") return el;
    if (el.shadowRoot) st.push(...el.shadowRoot.querySelectorAll("*"));
    else if (el.children) st.push(...el.children);
  }
  return null;
})()`;

/** Past-the-viewport and spilled elements under one element's shadow root. */
const measureIn = (finder, width) => `(() => {
  const s = ${finder};
  const root = s.shadowRoot || s;
  const out = { past: [], spilled: [], rows: 0 };
  const label = (el) => el.tagName.toLowerCase() + "." + [...(el.classList || [])].slice(0, 2).join(".");
  const walk = (r) => {
    for (const el of r.querySelectorAll("*")) {
      if (el.shadowRoot) walk(el.shadowRoot);
      if (el.classList && el.classList.contains("bf-row")) out.rows += 1;
      const box = el.getBoundingClientRect();
      if (box.width > 0 && box.right > ${width} + 1) out.past.push(label(el) + " right=" + Math.round(box.right));
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.display === "contents" || cs.overflowX !== "visible" || !el.clientWidth) continue;
      if (el.scrollWidth > el.clientWidth + 1) out.spilled.push(label(el) + " " + el.scrollWidth + ">" + el.clientWidth);
    }
  };
  walk(root);
  return out;
})()`;

const CARD_PATH = "bf-narrow-check";
let dashboardId = null;
const dashboards = await api.send({ type: "lovelace/dashboards/list" });
dashboardId = (dashboards || []).find((d) => d.url_path === CARD_PATH)?.id ?? null;
if (!dashboardId) {
  dashboardId = (await api.send({ type: "lovelace/dashboards/create", url_path: CARD_PATH, title: "BF narrow", mode: "storage", show_in_sidebar: false })).id;
}
await api.send({
  type: "lovelace/config/save",
  url_path: CARD_PATH,
  config: { views: [{ title: "BF", cards: [{ type: "custom:maintenance-battery-fleet-card" }] }] },
});

const results = [];
const browser = await chromium.connect(PW_WS, { timeout: 20000 });
try {
  for (const width of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, isMobile: true, hasTouch: true });
    const page = await ctx.newPage();
    await page.addInitScript(({ tk, ha }) => {
      localStorage.setItem("hassTokens", JSON.stringify({
        access_token: tk, token_type: "Bearer", expires_in: 1800,
        hassUrl: ha, clientId: ha + "/", expires: Date.now() + 9e11, refresh_token: "",
      }));
    }, { tk: token, ha: HA });
    for (const lang of LANGS) {
      await setLang(lang);
      await page.goto(`${HA}/maintenance-supporter?entry_id=${encodeURIComponent(fleet.entry_id)}&task_id=${fleetTask.id}`, { waitUntil: "domcontentloaded" });
      await page.waitForFunction(`(() => { const s = ${findSection}; return s && (s.shadowRoot || s).querySelector(".bf-rows, .bf-empty"); })()`, null, { timeout: 60000 });
      await page.evaluate(`(() => { const s = ${findSection}; const root = s.shadowRoot || s; root.querySelectorAll("details").forEach((d) => { d.open = true; }); })()`);
      await page.waitForTimeout(1500);
      const m = await page.evaluate(measureIn(findSection, width));
      const pass = !m.past.length && !m.spilled.length;
      const line = `${width}px/${lang}: ${pass ? "PASS" : "FAIL"} rows=${m.rows}` +
        (m.past.length ? ` past=[${m.past.slice(0, 5).join(" | ")}]` : "") +
        (m.spilled.length ? ` spilled=[${m.spilled.slice(0, 5).join(" | ")}]` : "");
      results.push({ pass, line });
      log("  " + line);
      if (SHOT) {
        await page.evaluate(`(() => { const s = ${findSection}; s.scrollIntoView({ block: "start" }); })()`);
        await page.waitForTimeout(400);
        await page.screenshot({ path: `${SHOT}/battery-fleet-${width}-${lang}.png`, fullPage: false });
      }
      // The Lovelace card, same rules.
      await page.goto(`${HA}/${CARD_PATH}/0`, { waitUntil: "domcontentloaded" });
      await page.waitForFunction(`(() => { const c = ${findCard}; return c && (c.shadowRoot || c).querySelector(".bf-row, .bf-empty, ha-card"); })()`, null, { timeout: 60000 });
      await page.waitForTimeout(1500);
      const c = await page.evaluate(measureIn(findCard, width));
      const cardPass = !c.past.length && !c.spilled.length;
      const cardLine = `${width}px/${lang}/card: ${cardPass ? "PASS" : "FAIL"} rows=${c.rows}` +
        (c.past.length ? ` past=[${c.past.slice(0, 5).join(" | ")}]` : "") +
        (c.spilled.length ? ` spilled=[${c.spilled.slice(0, 5).join(" | ")}]` : "");
      results.push({ pass: cardPass, line: cardLine });
      log("  " + cardLine);
      if (SHOT) await page.screenshot({ path: `${SHOT}/battery-fleet-card-${width}-${lang}.png`, fullPage: false });
    }
    await ctx.close();
  }
} finally {
  if (dashboardId) await api.send({ type: "lovelace/dashboards/delete", dashboard_id: dashboardId }).catch(() => {});
  await setLang("en").catch(() => {});
  await browser.close().catch(() => {});
  api.close();
}
const fails = results.filter((r) => !r.pass);
log(fails.length ? `\n${fails.length} FAILURES` : "\nBATTERY FLEET NARROW: ALL PASS");
setTimeout(() => process.exit(fails.length ? 1 : 0), 300);
