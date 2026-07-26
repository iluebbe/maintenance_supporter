/** Layout-overflow sweep — roadmap regression guard 3 (the ~18-commit class).
 *
 * English-only visual checks provably hide i18n-length overflow: the
 * task-detail ⋮ menu shipped unreachable at phone width in GERMAN while
 * every English screenshot looked fine (fixed in v2.38.3). This sweep walks
 * the main panel surfaces at phone + tablet width in the LONGEST-label
 * languages and fails when anything pokes past the viewport.
 *
 * Per (language × viewport × surface): PASS = no element's right edge
 * exceeds the viewport (1px tolerance) and the panel does not scroll
 * horizontally.
 *
 * Run against the dev instance before releases (validate-in-Docker rule):
 *   docker restart playwright-server   # wedge prevention
 *   node e2e/live-overflow-sweep.mjs
 * Exit code 1 on any FAIL. Surfaces: dashboard (overview), a task detail,
 * an object detail, the settings tab.
 */

import { chromium } from "@playwright/test";
import { loadToken, wsClient, watchdog, hassTokensInit } from "./ws-client.mjs";

const HA = "http://ha-maint:8123";
const REST = "http://127.0.0.1:8125";
const PW_WS = "ws://127.0.0.1:3000/";
// Longest-label languages measured in the 2026-07 full sweep (worst rows:
// uk 385px, hi 380px, de 378px at 412px viewport) + en as the baseline.
const LANGS = ["de", "uk", "hi", "en"];
const VIEWPORTS = [
  { name: "phone", width: 412, height: 915 },
  { name: "tablet", width: 768, height: 1024 },
];
const log = (...a) => console.log(...a);
watchdog(15 * 60e3, "overflow sweep");

const token = loadToken();
const api = await wsClient(REST, token);
const setLang = (lg) => api.send({
  type: "frontend/set_user_data",
  key: "language",
  value: { language: lg, number_format: "language", time_format: "language", date_format: "language", first_weekday: "language" },
});

const panelOf = () => document
  .querySelector("home-assistant")?.shadowRoot
  ?.querySelector("home-assistant-main")?.shadowRoot
  ?.querySelector("ha-drawer partial-panel-resolver ha-panel-custom maintenance-supporter-panel");

/** Worst offender in the panel: {right, tag} — right must stay <= width+1. */
async function measure(p, width) {
  return p.evaluate(({ fnStr, width }) => {
    const panel = eval(`(${fnStr})`)();
    if (!panel?.shadowRoot) return { err: "no panel" };
    let worst = 0, worstEl = "";
    for (const el of panel.shadowRoot.querySelectorAll("*")) {
      const r = el.getBoundingClientRect?.();
      if (r && r.width > 0 && r.right > worst) {
        worst = Math.round(r.right);
        worstEl = `${el.tagName.toLowerCase()}.${[...(el.classList || [])].slice(0, 2).join(".")}`;
      }
    }
    const host = panel.shadowRoot.host;
    return { worst, worstEl, scrollW: host.scrollWidth, clientW: host.clientWidth, width };
  }, { fnStr: panelOf.toString(), width });
}

async function clickFirstTaskRow(p) {
  return p.evaluate((fnStr) => {
    const panel = eval(`(${fnStr})`)();
    const row = panel.shadowRoot.querySelector(".task-row .task-name, .task-row");
    if (!row) return false;
    row.click();
    return true;
  }, panelOf.toString());
}

async function clickObjectBreadcrumb(p) {
  return p.evaluate((fnStr) => {
    const panel = eval(`(${fnStr})`)();
    const bc = panel.shadowRoot.querySelector(".object-name-breadcrumb");
    if (!bc) return false;
    bc.click();
    return true;
  }, panelOf.toString());
}

async function clickTab(p, re) {
  return p.evaluate(({ fnStr, re }) => {
    const panel = eval(`(${fnStr})`)();
    const tab = [...panel.shadowRoot.querySelectorAll(".tab-bar .tab")]
      .find((el) => new RegExp(re, "i").test(el.textContent || ""));
    if (!tab) return false;
    tab.click();
    return true;
  }, { fnStr: panelOf.toString(), re });
}

const results = [];
const browser = await chromium.connect(PW_WS, { timeout: 20000 });
try {
  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.width < 500, hasTouch: vp.width < 500 });
    const p = await ctx.newPage();
    await p.addInitScript(hassTokensInit, { t: token, ha: HA });
    for (const lg of LANGS) {
      await setLang(lg);
      await p.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded", timeout: 30000 });
      await p.waitForTimeout(4500);

      const surfaces = [
        ["dashboard", async () => {}],
        ["settings", () => clickTab(p, "settings|einstell|налаштування|सेटिंग")],
        ["task-detail", () => clickTab(p, ".").then(() => p.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded" })).then(() => p.waitForTimeout(3500)).then(() => clickFirstTaskRow(p))],
        ["object-detail", () => clickObjectBreadcrumb(p)],
      ];
      for (const [name, nav] of surfaces) {
        await nav();
        await p.waitForTimeout(1800);
        const m = await measure(p, vp.width);
        const pass = !m.err && m.worst <= vp.width + 1 && m.scrollW <= m.clientW + 1;
        results.push({ pass, line: `${vp.name}/${lg}/${name}: ${pass ? "PASS" : "FAIL"} worst=${m.worst ?? "?"} (${m.worstEl ?? m.err}) scroll=${m.scrollW}/${m.clientW}` });
        log("  " + results[results.length - 1].line);
      }
    }
    await ctx.close();
  }
} finally {
  await setLang("en").catch(() => {});
  await browser.close().catch(() => {});
  api.close();
}

const fails = results.filter((r) => !r.pass);
log(fails.length ? `\n${fails.length} FAILURES` : "\nOVERFLOW SWEEP: ALL PASS");
process.exit(fails.length ? 1 : 0);
