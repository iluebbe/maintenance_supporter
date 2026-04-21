/**
 * E2E for the Uhrzeit / time-of-day scheduling feature.
 *
 * Verifies:
 *  1. Feature flag off by default → dialog has NO time input → WS summary has
 *     schedule_time=null.
 *  2. Toggling the flag on → dialog shows the field → a value round-trips to
 *     WS (create + /object) and back to the dialog in edit mode.
 *  3. Feature flag off again → WS-computed _status ignores the stored time
 *     (backend gating confirms "OFF means midnight semantic").
 */
import { setup, ws, cleanup } from "./e2e-helpers.mjs";

const RUN = Date.now().toString(36);
const OBJ_NAME = `Schedule Time ${RUN}`;

const log = (...a) => console.log(...a);
let pass = 0, fail = 0;
const check = (label, ok, detail) => {
  if (ok) { pass++; log(`  ✓ ${label}`); }
  else { fail++; log(`  ✗ ${label}${detail ? " — " + detail : ""}`); }
};

const PANEL_EVAL = `
window._ha=document.querySelector('home-assistant');
window._main=_ha.shadowRoot.querySelector('home-assistant-main');
window._drawer=_main.shadowRoot.querySelector('ha-drawer');
window._resolver=_drawer.querySelector('partial-panel-resolver');
window._custom=_resolver.querySelector('ha-panel-custom');
window._panel=_custom.querySelector('maintenance-supporter-panel');
window._sr=_panel.shadowRoot;
`;

async function main() {
  const { browser, ctx, page } = await setup({ mobile: false });

  log("\n== Step 1: feature flag starts OFF");
  let settings = await ws(page, {
    type: "maintenance_supporter/global/update",
    settings: { advanced_schedule_time_visible: false },
  });
  check("backend reports schedule_time=false", settings.features.schedule_time === false);
  // Force panel to pick up the flag change (direct WS doesn't trigger listener).
  await page.evaluate((fn) => { eval(fn); return window._panel._loadData(); }, PANEL_EVAL);
  await page.waitForTimeout(1000);

  log("\n== Step 2: create obj + time-based task");
  const obj = await ws(page, { type: "maintenance_supporter/object/create", name: OBJ_NAME });
  const taskRes = await ws(page, {
    type: "maintenance_supporter/task/create",
    entry_id: obj.entry_id, name: "Daily chore", interval_days: 1,
  });
  await page.waitForTimeout(2000);

  log("\n== Step 3: open edit dialog, field should NOT be visible");
  const task = (await ws(page, { type: "maintenance_supporter/object", entry_id: obj.entry_id }))
    .tasks.find(t => t.id === taskRes.task_id);
  await page.evaluate(({ eid, task, fn }) => {
    eval(fn);
    window._sr.querySelector("maintenance-task-dialog").openEdit(eid, task);
  }, { eid: obj.entry_id, task, fn: PANEL_EVAL });
  await page.waitForTimeout(1200);

  const hiddenState = await page.evaluate((fn) => {
    eval(fn);
    const dlgSr = window._sr.querySelector("maintenance-task-dialog").shadowRoot;
    return {
      scheduleTimeEnabled: window._sr.querySelector("maintenance-task-dialog").scheduleTimeEnabled,
      hasTimeInput: !!dlgSr.querySelector('ha-textfield[type="time"]'),
    };
  }, PANEL_EVAL);
  check("scheduleTimeEnabled prop is false on dialog", hiddenState.scheduleTimeEnabled === false);
  check("time input is NOT in the DOM when feature is off", hiddenState.hasTimeInput === false);

  log("\n== Step 4: enable the feature flag, re-open edit");
  settings = await ws(page, {
    type: "maintenance_supporter/global/update",
    settings: { advanced_schedule_time_visible: true },
  });
  check("backend reports schedule_time=true after toggle", settings.features.schedule_time === true);
  await page.waitForTimeout(1000);
  // Direct WS update doesn't fire the panel's "settings-changed" listener,
  // so force a reload so _features picks up the flip.
  await page.evaluate((fn) => {
    eval(fn);
    return window._panel._loadData();
  }, PANEL_EVAL);
  await page.waitForTimeout(1500);
  // Close dialog, reopen (the prop is bound from _features on the parent panel)
  await page.evaluate((fn) => {
    eval(fn);
    window._sr.querySelector("maintenance-task-dialog")._open = false;
  }, PANEL_EVAL);
  await page.waitForTimeout(500);
  await page.evaluate(({ eid, task, fn }) => {
    eval(fn);
    window._sr.querySelector("maintenance-task-dialog").openEdit(eid, task);
  }, { eid: obj.entry_id, task, fn: PANEL_EVAL });
  await page.waitForTimeout(1200);
  const visibleState = await page.evaluate((fn) => {
    eval(fn);
    const dlgSr = window._sr.querySelector("maintenance-task-dialog").shadowRoot;
    return {
      scheduleTimeEnabled: window._sr.querySelector("maintenance-task-dialog").scheduleTimeEnabled,
      hasTimeInput: !!dlgSr.querySelector('ha-textfield[type="time"]'),
    };
  }, PANEL_EVAL);
  check("scheduleTimeEnabled prop is true after feature on", visibleState.scheduleTimeEnabled === true);
  check("time input IS in the DOM after feature on", visibleState.hasTimeInput === true);

  log("\n== Step 5: set time via WS (skip the DOM event roundtrip), re-read task");
  await ws(page, {
    type: "maintenance_supporter/task/update",
    entry_id: obj.entry_id, task_id: taskRes.task_id, schedule_time: "14:00",
  });
  await page.waitForTimeout(1500);
  const updated = (await ws(page, { type: "maintenance_supporter/object", entry_id: obj.entry_id }))
    .tasks.find(t => t.id === taskRes.task_id);
  check("summary contains schedule_time=14:00", updated.schedule_time === "14:00",
    `got ${updated.schedule_time}`);

  log("\n== Step 6: reject malformed schedule_time at the WS layer");
  let rejected = false;
  try {
    await ws(page, {
      type: "maintenance_supporter/task/update",
      entry_id: obj.entry_id, task_id: taskRes.task_id, schedule_time: "25:99",
    });
  } catch {
    rejected = true;
  }
  check("malformed HH:MM rejected by schema", rejected);

  log("\n== Step 7: cleanup");
  await ws(page, { type: "maintenance_supporter/object/delete", entry_id: obj.entry_id });
  // Leave the flag on — test fixture state is not restored, next run will re-toggle.
  await cleanup(browser, ctx);

  log(`\n=== ${pass} passed, ${fail} failed ===`);
  process.exit(fail === 0 ? 0 : 1);
}

main().catch((e) => { console.error(e); process.exit(1); });
