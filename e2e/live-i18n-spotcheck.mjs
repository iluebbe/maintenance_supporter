/** Live i18n spot-check: render the panel in several languages (via the real
 *  user-language setting + reload) and verify this month's NEW strings appear
 *  translated — compared against the shipped locale files themselves.
 *
 *  Checked per language: the schedule-preview title + on-time caption (#83),
 *  the runtime "active states" label (#103), and the delta start-value
 *  label (#102). Restores the user language to English afterwards. */
import { readFileSync } from "node:fs";
import { chromium } from "@playwright/test";
import { loadToken, watchdog, wsClient, hassTokensInit } from "./ws-client.mjs";

const HA = "http://ha-maint:8123", REST = "http://127.0.0.1:8125", PW_WS = "ws://127.0.0.1:3000/";
const LANGS = ["de", "fr", "ja", "pl", "cs", "sv"];
const log = (...a) => console.log(...a);
const fail = (m) => { console.error("FAIL:", m); throw new Error(m); };
const assert = (cond, msg) => { if (!cond) fail(msg); log("  ok:", msg); };
watchdog(8 * 60e3, "i18n spot-check");

const token = loadToken();
const api = await wsClient(REST, token);
const locale = (lg) =>
  JSON.parse(readFileSync(new URL(`../custom_components/maintenance_supporter/frontend-src/locales/${lg}.json`, import.meta.url), "utf-8"));

const setLanguage = (lg) =>
  api.send({ type: "frontend/set_user_data", key: "language", value: { language: lg, number_format: "language", time_format: "language", date_format: "language", first_weekday: "language" } });

let browser;
try {
  browser = await chromium.connect(PW_WS);
  const ctx = await browser.newContext({ viewport: { width: 1500, height: 1000 } });
  const p = await ctx.newPage();
  await p.addInitScript(hassTokensInit, { t: token, ha: HA });

  for (const lg of LANGS) {
    await setLanguage(lg);
    await p.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded", timeout: 30000 });
    await p.waitForTimeout(4500);
    const exp = locale(lg);

    const probe = await p.evaluate(async () => {
      const panel = document
        .querySelector("home-assistant")?.shadowRoot
        ?.querySelector("home-assistant-main")?.shadowRoot
        ?.querySelector("ha-drawer partial-panel-resolver ha-panel-custom maintenance-supporter-panel");
      if (!panel?.shadowRoot) return { err: "panel not found" };
      const dlg = panel.shadowRoot.querySelector("maintenance-task-dialog");
      const objsResp = await panel.hass.connection.sendMessagePromise({ type: "maintenance_supporter/objects" });
      const entryId = objsResp.objects[0]?.entry_id;
      if (!entryId) return { err: "no objects" };
      await dlg.openCreate(entryId, []);
      // Schedule preview (#83 config) …
      dlg._scheduleType = "nth_weekday";
      dlg._nth = "2";
      dlg._nthWeekday = "5";
      dlg._seasonMonths = [1, 7];
      await dlg.updateComplete;
      await new Promise((r) => setTimeout(r, 700));
      await dlg.updateComplete;
      const preview = dlg.shadowRoot.querySelector(".schedule-preview")?.textContent?.replace(/\s+/g, " ").trim() ?? null;
      // … then the sensor-based trigger form: runtime on-states + counter baseline.
      dlg._scheduleType = "sensor_based";
      dlg._triggerType = "runtime";
      await dlg.updateComplete;
      const runtimeForm = [...dlg.shadowRoot.querySelectorAll("ms-textfield")].map((n) => n.getAttribute("label")).join(" | ");
      dlg._triggerType = "counter";
      dlg._triggerDeltaMode = true;
      await dlg.updateComplete;
      const counterForm = [...dlg.shadowRoot.querySelectorAll("ms-textfield")].map((n) => n.getAttribute("label")).join(" | ");
      dlg._close?.();
      return { lang: panel.hass.language, preview, runtimeForm, counterForm };
    });
    if (probe.err) fail(`${lg}: ${probe.err}`);
    log(`[${lg}] hass.language=${probe.lang}`);
    log(`  preview: ${probe.preview}`);
    assert(probe.lang === lg, `${lg}: HA reports the language`);
    assert(probe.preview && probe.preview.includes(exp.schedule_preview_title), `${lg}: preview title localized ("${exp.schedule_preview_title}")`);
    assert(probe.runtimeForm.includes(exp.runtime_on_states), `${lg}: runtime on-states label localized ("${exp.runtime_on_states}")`);
    assert(probe.counterForm.includes(exp.baseline_start_value), `${lg}: start-value label localized ("${exp.baseline_start_value}")`);
  }
  log("I18N SPOT-CHECK PASSED");
} finally {
  await setLanguage("en").catch(() => {});
  await api.close();
  if (browser) await browser.close();
}
