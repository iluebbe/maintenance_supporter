/** Live language smoke check — new-language validation in the dev instance.
 *
 * For each language: set the user's HA language, load the panel, read the
 * tab bar + a few key labels from the live DOM and FAIL if they still show
 * the English strings (i.e. the locale file did not load), then save a
 * screenshot for eyeballing.
 *
 *   docker restart playwright-server
 *   MS_LANGS="pt-BR,hu,ko,tr" node e2e/live-lang-check.mjs
 */

import { mkdirSync } from "node:fs";
import { chromium } from "@playwright/test";
import { loadToken, wsClient, watchdog, hassTokensInit } from "./ws-client.mjs";

const HA = "http://ha-maint:8123";
const REST = "http://127.0.0.1:8125";
const PW_WS = "ws://127.0.0.1:3000/";
const LANGS = (process.env.MS_LANGS || "pt-BR,hu,ko,tr").split(",");
const OUT = "e2e/lang-check-shots";
const log = (...a) => console.log(...a);
watchdog(10 * 60e3, "lang check");
mkdirSync(OUT, { recursive: true });

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

const results = [];
const browser = await chromium.connect(PW_WS, { timeout: 20000 });
try {
  const ctx = await browser.newContext({ viewport: { width: 1100, height: 900 } });
  const p = await ctx.newPage();
  await p.addInitScript(hassTokensInit, { t: token, ha: HA });
  for (const lg of LANGS) {
    await setLang(lg);
    await p.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded", timeout: 30000 });
    await p.waitForTimeout(5000);
    const probe = await p.evaluate((fnStr) => {
      const panel = eval(`(${fnStr})`)();
      if (!panel?.shadowRoot) return { err: "no panel" };
      const tabs = [...panel.shadowRoot.querySelectorAll(".tab-bar .tab")].map((el) => (el.textContent || "").trim());
      const texts = [...panel.shadowRoot.querySelectorAll("button, h1, h2, h3")].map((el) => (el.textContent || "").trim()).filter(Boolean).slice(0, 25);
      return { tabs, texts };
    }, panelOf.toString());
    if (probe.err) {
      results.push({ pass: false, line: `${lg}: FAIL (${probe.err})` });
    } else {
      // English leak detector: the EN tab set must NOT be what renders.
      const joined = probe.tabs.join("|");
      const englishLeak = /Tasks\|/.test(joined + "|") && /\|Calendar/.test("|" + joined);
      const pass = probe.tabs.length >= 3 && !englishLeak;
      results.push({ pass, line: `${lg}: ${pass ? "PASS" : "FAIL"} tabs=[${probe.tabs.join(", ")}]` });
    }
    await p.screenshot({ path: `${OUT}/panel-${lg}.png`, fullPage: false });
    log("  " + results[results.length - 1].line);
  }
  await ctx.close();
} finally {
  await setLang("en").catch(() => {});
  await browser.close().catch(() => {});
  api.close();
}

const fails = results.filter((r) => !r.pass);
log(fails.length ? `\n${fails.length} FAILURES` : "\nLANG CHECK: ALL PASS");
process.exit(fails.length ? 1 : 0);
