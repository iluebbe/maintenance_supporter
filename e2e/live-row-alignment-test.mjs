/** Live check: dashboard row geometry (user reports 2026-07-07 + 2026-07-10).
 *  (1) Priority badges (chevron-double-up AND -down) must be vertically
 *      centered on the status chip's midline and keep a sane gap to it.
 *  (2) Cross-row: the chevrons must form ONE column even though status pills
 *      differ in width (Overdue vs OK) — extras anchor to the badge-track
 *      edge (2026-07-10: the low chevron beside the short OK pill sat out of
 *      the column formed by the high chevrons).
 *  (3) The due-cell bars must have ONE consistent width: the trigger-progress
 *      bar (rows with a sensor trigger, i.e. the rows that also get a
 *      sparkline) must span the full cell like the plain days-bar does.
 */
import { chromium } from "@playwright/test";
import fs from "fs";
import { loadToken, wsClient, watchdog, hassTokensInit } from "./ws-client.mjs";
const HA = "http://ha-maint:8123", REST = "http://127.0.0.1:8125", PW_WS = "ws://127.0.0.1:3000/";
const OUT = new URL("./live-shots/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
fs.mkdirSync(OUT, { recursive: true });
const token = loadToken();
const auth = { Authorization: "Bearer " + token, "Content-Type": "application/json" };
const log = (...a) => console.log(...a);
watchdog(6 * 60e3, "row-alignment test");

const suffix = Date.now() % 100000;
const svc = await fetch(REST + "/api/services/maintenance_supporter/add_object?return_response", {
  method: "POST", headers: auth, body: JSON.stringify({ name: "Align Check " + suffix }),
}).then((r) => r.json());
const entryId = (svc.service_response ?? svc).entry_id;
log("object", entryId);

// Seed: helper entity + a priority-high overdue task (days-bar) + a
// threshold-trigger task (trigger-progress bar, sparkline-eligible row).
// Node-side WS client — in-page evaluate seeding wedges the dockered
// playwright-server (documented gotcha); the browser is only used to measure.
const api = await wsClient(REST, token);
const helper = await api.send({ type: "input_number/create", name: "Align Filter Usage", min: 0, max: 100, step: 0.1 });
const helperEntity = "input_number." + (helper.id || "align_filter_usage");
await fetch(REST + "/api/services/input_number/set_value", {
  method: "POST", headers: auth, body: JSON.stringify({ entity_id: helperEntity, value: 54.2 }),
});
const past = new Date(Date.now() - 45 * 864e5).toISOString().slice(0, 10);
await api.send({
  type: "maintenance_supporter/task/create", entry_id: entryId,
  name: "Overdue Days Task", task_type: "inspection",
  interval_days: 30, warning_days: 7, priority: "high",
  last_performed: past,
});
await api.send({
  type: "maintenance_supporter/task/create", entry_id: entryId,
  name: "Trigger Bar Task", task_type: "replacement",
  interval_days: 365, warning_days: 14, priority: "low",
  trigger_config: { type: "threshold", entity_id: helperEntity, trigger_above: 60 },
});
log("seed ok");

const b = await chromium.connect(PW_WS, { timeout: 20000 });
const ctx = await b.newContext({ viewport: { width: 1440, height: 950 } });
await ctx.addInitScript(hassTokensInit, { t: token, ha: HA });
const p = await ctx.newPage();
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
  // Both priority variants: the high chevron on the days row AND the low
  // chevron on the trigger row. The original fix was only ever measured on
  // high — and only within its own row. The user-visible requirement is
  // cross-row: chevrons must form ONE column even though the status pills
  // differ in width (Overdue vs OK), so we also compare right edges.
  const measureChevron = (row) => {
    const chip = r(row.querySelector(".status-badge"));
    const badge = row.querySelector(".priority-badge");
    const cb = r(badge);
    const icon = r(badge?.querySelector("ha-icon"));
    if (!chip || !cb) return null;
    return {
      gap: +(cb.left - chip.right).toFixed(1),
      right: +cb.right.toFixed(1),
      centerOffset: +((cb.top + cb.height / 2) - (chip.top + chip.height / 2)).toFixed(1),
      iconOffsetInBadge: icon ? +((icon.top + icon.height / 2) - (cb.top + cb.height / 2)).toFixed(1) : null,
    };
  };
  const cell = r(days.querySelector(".due-cell"));
  const daysBar = r(days.querySelector(".days-bar"));
  const trigBar = r(trig.querySelector(".trigger-progress-bar"));
  const trigCell = r(trig.querySelector(".due-cell"));
  return {
    high: measureChevron(days),
    low: measureChevron(trig),
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
for (const [name, c] of [["high", m.high], ["low", m.low]]) {
  if (!c) { failures.push(`${name}-priority chevron not rendered`); continue; }
  if (c.gap < 4) failures.push(`${name} priority gap ${c.gap}px (chevron must not crowd the status pill)`);
  if (Math.abs(c.centerOffset) > 1.5) failures.push(`${name} priority vertical offset ${c.centerOffset}px (want centered)`);
  if (c.iconOffsetInBadge !== null && Math.abs(c.iconOffsetInBadge) > 1.5)
    failures.push(`${name} chevron icon off-center inside its badge by ${c.iconOffsetInBadge}px`);
}
if (m.high && m.low && Math.abs(m.high.right - m.low.right) > 1)
  failures.push(`chevrons out of column: high right ${m.high.right}px vs low right ${m.low.right}px (pills differ in width — extras must anchor to the track edge)`);
if (Math.abs(m.daysBarWidth - m.trigBarWidth) > 2) failures.push(`bar widths inconsistent: days ${m.daysBarWidth}px vs trigger ${m.trigBarWidth}px`);
if (failures.length) { console.error("FAILURES:\n - " + failures.join("\n - ")); }

// Cleanup (object + helper) — Node-side WS, same wedge avoidance as the seed.
await api.send({ type: "maintenance_supporter/object/delete", entry_id: entryId });
const helpers = await api.send({ type: "input_number/list" });
for (const it of helpers) {
  if (it.name === "Align Filter Usage") {
    await api.send({ type: "input_number/delete", input_number_id: it.id });
  }
}
api.close();
log("cleanup done");

if (failures.length) process.exit(1);
log("ALL OK");
await ctx.close(); await b.close(); process.exit(0);
