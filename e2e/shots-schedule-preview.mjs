/** Screenshot: the live schedule preview with the #83 configuration
 *  (2nd Saturday, seasonal window Jan+Jul) — clipped to the dialog. */
import { chromium } from "@playwright/test";
import { loadToken, watchdog, wsClient, hassTokensInit } from "./ws-client.mjs";

const HA = "http://ha-maint:8123", REST = "http://127.0.0.1:8125", PW_WS = "ws://127.0.0.1:3000/";
const OUT = process.argv[2] || ".";
const log = (...a) => console.log(...a);
watchdog(5 * 60e3, "schedule preview shot");

const token = loadToken();
const api = await wsClient(REST, token);
let browser;
try {
  browser = await chromium.connect(PW_WS);
  const ctx = await browser.newContext({ viewport: { width: 1400, height: 1100 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  await p.addInitScript(hassTokensInit, { t: token, ha: HA });
  await p.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded", timeout: 30000 });
  await p.waitForTimeout(4000);

  const rect = await p.evaluate(async () => {
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
    dlg._name = "Change smoke detector batteries";
    dlg._scheduleType = "nth_weekday";
    dlg._nth = "2";
    dlg._nthWeekday = "5"; // Saturday
    dlg._seasonMonths = [1, 7];
    await dlg.updateComplete;
    await new Promise((r) => setTimeout(r, 700)); // debounce + WS roundtrip
    await dlg.updateComplete;
    const box = dlg.shadowRoot.querySelector(".schedule-preview");
    if (!box) return { err: "preview box missing" };
    box.scrollIntoView({ block: "center" });
    await new Promise((r) => setTimeout(r, 200));
    // The dialog is an <ha-dialog>; clip to its content area intersected
    // with the viewport (the content can be taller than the screen).
    const c = dlg.shadowRoot.querySelector(".content").getBoundingClientRect();
    const x = Math.max(0, c.x - 24), y = Math.max(0, c.y - 56);
    const width = Math.min(window.innerWidth - x, c.width + 48);
    const height = Math.min(window.innerHeight - y, c.height + 72);
    return { x, y, width, height, text: box.textContent.replace(/\s+/g, " ").trim() };
  });
  log("probe:", JSON.stringify(rect));
  if (rect.err) throw new Error(rect.err);
  const clip = rect.width > 100 && rect.height > 100
    ? { x: Math.max(0, rect.x), y: Math.max(0, rect.y), width: Math.min(rect.width, 1400), height: Math.min(rect.height, 1100) }
    : undefined;
  await p.screenshot({ path: `${OUT}/schedule-preview.png`, ...(clip ? { clip } : {}) });
  log("SHOT SAVED");
} finally {
  await api.close();
  if (browser) await browser.close();
}
