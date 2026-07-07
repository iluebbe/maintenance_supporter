/** Live check: dashboard row geometry (user report, 2026-07-07).
 *  (1) Priority badge (chevron-double-up/down) must sit flush with the other
 *      badges: same 6px gap as between chips, vertically centered on the
 *      status chip's midline.
 *  (2) The due-cell bars must have ONE consistent width: the trigger-progress
 *      bar (rows with a sensor trigger, i.e. the rows that also get a
 *      sparkline) must span the full cell like the plain days-bar does.
 */
import { chromium } from "@playwright/test";
import fs from "fs";
const HA = "http://ha-maint:8123", REST = "http://127.0.0.1:8125", PW_WS = "ws://127.0.0.1:3000/";
const OUT = new URL("./live-shots/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
fs.mkdirSync(OUT, { recursive: true });
const token = fs.readFileSync(new URL("../docker/.env", import.meta.url), "utf-8").match(/HA_TOKEN=(\S+)/)[1];
const auth = { Authorization: "Bearer " + token, "Content-Type": "application/json" };
const log = (...a) => console.log(...a);
setTimeout(() => { console.error("WATCHDOG"); process.exit(3); }, 6 * 60e3);

const suffix = Date.now() % 100000;
const svc = await fetch(REST + "/api/services/maintenance_supporter/add_object?return_response", {
  method: "POST", headers: auth, body: JSON.stringify({ name: "Align Check " + suffix }),
}).then((r) => r.json());
const entryId = (svc.service_response ?? svc).entry_id;
log("object", entryId);

const b = await chromium.connect(PW_WS, { timeout: 20000 });
const ctx = await b.newContext({ viewport: { width: 1440, height: 950 } });
await ctx.addInitScript(({ t, ha }) => {
  localStorage.setItem("hassTokens", JSON.stringify({
    access_token: t, token_type: "Bearer", expires_in: 1800,
    hassUrl: ha, clientId: ha + "/", expires: Date.now() + 9e11, refresh_token: "",
  }));
}, { t: token, ha: HA });
const p = await ctx.newPage();
await p.goto(HA + "/lovelace", { waitUntil: "domcontentloaded" });
await p.waitForTimeout(6000);

// Seed: helper entity + a priority-high overdue task (days-bar) + a
// threshold-trigger task (trigger-progress bar, sparkline-eligible row).
const seed = await p.evaluate(async ({ entryId }) => {
  const hass = document.querySelector("home-assistant").hass;
  const send = (m) => hass.connection.sendMessagePromise(m);
  const step = async (label, fn) => {
    try { return await fn(); }
    catch (e) { throw new Error(label + ": " + (e && (e.message || e.code || JSON.stringify(e)))); }
  };
  try {
    const helper = await step("input_number/create", () => send({
      type: "input_number/create", name: "Align Filter Usage",
      min: 0, max: 100, step: 0.1,
    }));
    const helperEntity = "input_number." + (helper.id || "align_filter_usage");
    await step("set_value", () => hass.callService("input_number", "set_value", { value: 54.2 }, { entity_id: helperEntity }));
    const past = new Date(Date.now() - 45 * 864e5).toISOString().slice(0, 10);
    await step("task/create days", () => send({
      type: "maintenance_supporter/task/create", entry_id: entryId,
      name: "Overdue Days Task", task_type: "inspection",
      interval_days: 30, warning_days: 7, priority: "high",
      last_performed: past,
    }));
    await step("task/create trigger", () => send({
      type: "maintenance_supporter/task/create", entry_id: entryId,
      name: "Trigger Bar Task", task_type: "replacement",
      interval_days: 365, warning_days: 14, priority: "low",
      trigger_config: { type: "threshold", entity_id: helperEntity, trigger_above: 60 },
    }));
    return { ok: true };
  } catch (e) { return { ok: false, error: String(e) }; }
}, { entryId });
log("seed:", JSON.stringify(seed));
if (!seed.ok) throw new Error(seed.error);

await p.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded" });
await p.waitForTimeout(8000);

const m = await p.evaluate(() => {
  const panel = document.querySelector("home-assistant")
    .shadowRoot.querySelector("home-assistant-main")
    .shadowRoot.querySelector("maintenance-supporter-panel");
  const rows = [...panel.shadowRoot.querySelectorAll(".task-row")];
  const findRow = (name) => rows.find((r) => r.querySelector(".task-name")?.textContent?.includes(name));
  const days = findRow("Overdue Days Task");
  const trig = findRow("Trigger Bar Task");
  if (!days || !trig) return { error: "rows not found" };

  const r = (el) => el ? el.getBoundingClientRect() : null;
  const chip = r(days.querySelector(".status-badge"));
  const chevron = r(days.querySelector(".priority-badge"));
  const cell = r(days.querySelector(".due-cell"));
  const daysBar = r(days.querySelector(".days-bar"));
  const trigBar = r(trig.querySelector(".trigger-progress-bar"));
  const trigCell = r(trig.querySelector(".due-cell"));
  return {
    badgeGap: chevron && chip ? +(chevron.left - chip.right).toFixed(1) : null,
    badgeCenterOffset: chevron && chip
      ? +((chevron.top + chevron.height / 2) - (chip.top + chip.height / 2)).toFixed(1) : null,
    daysBarWidth: daysBar ? +daysBar.width.toFixed(1) : null,
    trigBarWidth: trigBar ? +trigBar.width.toFixed(1) : null,
    cellWidth: cell ? +cell.width.toFixed(1) : null,
    trigCellWidth: trigCell ? +trigCell.width.toFixed(1) : null,
  };
});
log("MEASURE", JSON.stringify(m));
if (m.error) throw new Error(m.error);
await p.screenshot({ path: OUT + "60-row-alignment.png", fullPage: false });

const failures = [];
if (Math.abs(m.badgeGap - 6) > 1.5) failures.push(`priority gap ${m.badgeGap}px (want ~6px like other badges)`);
if (Math.abs(m.badgeCenterOffset) > 1.5) failures.push(`priority vertical offset ${m.badgeCenterOffset}px (want centered)`);
if (Math.abs(m.daysBarWidth - m.trigBarWidth) > 2) failures.push(`bar widths inconsistent: days ${m.daysBarWidth}px vs trigger ${m.trigBarWidth}px`);
if (failures.length) { console.error("FAILURES:\n - " + failures.join("\n - ")); }

// Cleanup (object + helper).
await p.evaluate(async ({ entryId }) => {
  const hass = document.querySelector("home-assistant").hass;
  await hass.connection.sendMessagePromise({ type: "maintenance_supporter/object/delete", entry_id: entryId });
  const list = await hass.connection.sendMessagePromise({ type: "input_number/list" });
  for (const it of list) {
    if (it.name === "Align Filter Usage") {
      await hass.connection.sendMessagePromise({ type: "input_number/delete", input_number_id: it.id });
    }
  }
}, { entryId });
log("cleanup done");

if (failures.length) process.exit(1);
log("ALL OK");
await ctx.close(); await b.close(); process.exit(0);
