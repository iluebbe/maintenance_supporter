/** Live check for the schedule/preview endpoint + the dialog's "next dates"
 *  box (#83). Structural WS assertions (real "today" moves), then a UI pass:
 *  the create dialog shows the preview for a plain interval schedule. */
import { chromium } from "@playwright/test";
import { loadToken, watchdog, wsClient, hassTokensInit } from "./ws-client.mjs";

const HA = "http://ha-maint:8123", REST = "http://127.0.0.1:8125", PW_WS = "ws://127.0.0.1:3000/";
const OUT = process.argv[2] || ".";
const log = (...a) => console.log(...a);
const fail = (m) => { console.error("FAIL:", m); throw new Error(m); };
const assert = (cond, msg) => { if (!cond) fail(msg); log("  ok:", msg); };
watchdog(6 * 60e3, "schedule preview check");

const token = loadToken();
const api = await wsClient(REST, token);

// 1. The #83 case: 2nd Saturday, season window Jan+Jul.
const r1 = await api.send({
  type: "maintenance_supporter/schedule/preview",
  schedule: { kind: "nth_weekday", nth: 2, weekday: 5, season_months: [1, 7] },
});
log("  #83 case:", JSON.stringify(r1.occurrences));
assert(r1.occurrences.length === 3, "three occurrences");
for (const iso of r1.occurrences) {
  const d = new Date(`${iso}T12:00:00`);
  assert(d.getDay() === 6, `${iso} is a Saturday`);
  assert([0, 6].includes(d.getMonth()), `${iso} is in Jan or Jul`);
  const dom = d.getDate();
  assert(dom >= 8 && dom <= 14, `${iso} is the 2nd of its weekday in the month`);
}
assert(r1.occurrences.every((v, i, a) => i === 0 || v > a[i - 1]), "strictly increasing");

// 2. Interval 30 days: exactly 30 apart, first one 30 days from today.
const r2 = await api.send({
  type: "maintenance_supporter/schedule/preview",
  schedule: { kind: "interval", every: 30, unit: "days" },
});
log("  interval:", JSON.stringify(r2.occurrences));
const days = r2.occurrences.map((iso) => Date.parse(`${iso}T12:00:00`) / 86400000);
assert(Math.round(days[1] - days[0]) === 30 && Math.round(days[2] - days[1]) === 30, "steps of 30 days");

// 3. Finite series flags the end.
const r3 = await api.send({
  type: "maintenance_supporter/schedule/preview",
  schedule: { kind: "interval", every: 7, unit: "days", ends: { count: 2 } },
});
assert(r3.occurrences.length === 2 && r3.series_ended === true, "finite series ends after 2");

// 4. UI: create dialog shows the preview box for the default interval.
let browser;
try {
  browser = await chromium.connect(PW_WS);
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 } });
  const p = await ctx.newPage();
  await p.addInitScript(hassTokensInit, { t: token, ha: HA });
  await p.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded", timeout: 30000 });
  await p.waitForTimeout(4000);

  const probe2 = await p.evaluate(async () => {
    const panel = document
      .querySelector("home-assistant")?.shadowRoot
      ?.querySelector("home-assistant-main")?.shadowRoot
      ?.querySelector("ha-drawer partial-panel-resolver ha-panel-custom maintenance-supporter-panel");
    if (!panel?.shadowRoot) return { err: "panel not found" };
    const dlg = panel.shadowRoot.querySelector("maintenance-task-dialog");
    if (!dlg) return { err: "task dialog element not found" };
    // Use any existing object as the target entry.
    const objsResp = await panel.hass.connection.sendMessagePromise({ type: "maintenance_supporter/objects" });
    const entryId = objsResp.objects[0]?.entry_id;
    if (!entryId) return { err: "no objects on instance" };
    await dlg.openCreate(entryId, []);
    dlg._scheduleType = "time_based";
    dlg._intervalDays = "30";
    await dlg.updateComplete;
    await new Promise((r) => setTimeout(r, 600)); // debounce 300ms + WS roundtrip
    await dlg.updateComplete;
    const box = dlg.shadowRoot.querySelector(".schedule-preview");
    return { text: box ? box.textContent.replace(/\s+/g, " ").trim() : null };
  });
  log("  dialog preview:", JSON.stringify(probe2));
  assert(probe2.text, "preview box renders in the create dialog");
  assert(/\d{2}/.test(probe2.text), "preview carries dates");
  await p.screenshot({ path: `${OUT}/schedule-preview-dialog.png` });
  log("SCHEDULE PREVIEW LIVE CHECK PASSED");
} finally {
  await api.close();
  if (browser) await browser.close();
}
