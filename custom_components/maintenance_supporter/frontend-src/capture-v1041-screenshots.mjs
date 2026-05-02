/**
 * Capture screenshots of the user-visible features added between v1.0.22
 * and v1.0.41. Assumes:
 *   - ha-maint is up with seeded demo data (setup_demo.py + seed_history.py)
 *   - playwright-server is reachable on ws://localhost:3000
 *   - docker/.env contains HA_TOKEN (or HA_REFRESH_TOKEN is in env)
 *
 * Writes PNGs into docs/images/ using filenames prefixed with the feature.
 *
 * Run:
 *   cd custom_components/maintenance_supporter/frontend-src
 *   node capture-v1041-screenshots.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { setup, ws, cleanup } from "./e2e-helpers.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT = path.resolve(__dirname, "../../../docs/images");
fs.mkdirSync(OUTPUT, { recursive: true });

const PANEL_EVAL = `
window._ha=document.querySelector('home-assistant');
window._main=_ha.shadowRoot.querySelector('home-assistant-main');
window._drawer=_main.shadowRoot.querySelector('ha-drawer');
window._resolver=_drawer.querySelector('partial-panel-resolver');
window._custom=_resolver.querySelector('ha-panel-custom');
window._panel=_custom.querySelector('maintenance-supporter-panel');
window._sr=_panel.shadowRoot;
`;

async function screenshot(page, name, opts = {}) {
  const file = path.join(OUTPUT, `${name}.png`);
  await page.screenshot({ path: file, ...opts });
  console.log(`  saved ${name}.png`);
}

async function main() {
  console.log("== Launch browser + login ==");
  const { browser, ctx, page } = await setup({ mobile: false });

  console.log("\n== Enable all advanced feature flags ==");
  await ws(page, {
    type: "maintenance_supporter/global/update",
    settings: {
      advanced_adaptive_visible: true,
      advanced_predictions_visible: true,
      advanced_seasonal_visible: true,
      advanced_environmental_visible: true,
      advanced_budget_visible: true,
      advanced_groups_visible: true,
      advanced_checklists_visible: true,
      advanced_schedule_time_visible: true,
    },
  });

  console.log("\n== Pick a time-based task and enrich it ==");
  const objects = (await ws(page, { type: "maintenance_supporter/objects" })).objects;
  // Use a time_based task so the schedule_time field actually renders in the dialog
  const familyCar = objects.find(o => o.object.name === "Family Car");
  const tireTask = familyCar.tasks.find(t => t.name === "Tire Rotation");
  console.log(`   target task: ${familyCar.object.name} / ${tireTask.name}`);

  // Add a checklist + schedule_time so the screenshots have content.
  // Note: checklist is sent separately via task/update because schedule_time
  // is currently accepted by the WS schema for any schedule_type.
  await ws(page, {
    type: "maintenance_supporter/task/update",
    entry_id: familyCar.entry_id,
    task_id: tireTask.id,
    checklist: [
      "Raise the vehicle with a jack at each wheel",
      "Loosen and remove each wheel's lug nuts",
      "Rotate tires: front-to-back, same side (FWD) or crosswise (AWD/RWD)",
      "Torque lug nuts to manufacturer spec (~110 Nm)",
      "Reset TPMS learn mode if equipped",
    ],
    schedule_time: "09:00",
  });

  // Also give the HVAC filter a checklist so the sensor_based detail view is still
  // useful elsewhere — but the primary demo task is now Tire Rotation.
  const hvac = objects.find(o => o.object.name === "HVAC System");
  const filterTask = hvac.tasks.find(t => t.name.toLowerCase().includes("filter"));

  console.log("\n== Give the HVAC filter task manual seasonal overrides ==");
  try {
    await ws(page, {
      type: "maintenance_supporter/task/seasonal_overrides",
      entry_id: hvac.entry_id,
      task_id: filterTask.id,
      overrides: {1: 1.4, 2: 1.3, 7: 0.6, 8: 0.6, 12: 1.5},
    });
  } catch (e) { console.log("   seasonal skipped:", e?.message); }

  console.log("\n== Create a demo group so the groups section renders ==");
  try {
    await ws(page, {
      type: "maintenance_supporter/group/create",
      name: "Quarterly Appliances",
      description: "All tasks for appliances on a 90-day cycle",
      task_refs: [
        { entry_id: familyCar.entry_id, task_id: tireTask.id },
        { entry_id: hvac.entry_id, task_id: filterTask.id },
      ],
    });
  } catch (e) { console.log("   group skipped:", e?.message); }

  // Force-refresh the panel so the new state shows up
  await page.evaluate((fn) => { eval(fn); return window._panel._loadData(); }, PANEL_EVAL);
  await page.waitForTimeout(2500);

  console.log("\n== (1) panel overview with KPIs, budget bar, status chips ==");
  await page.evaluate((fn) => {
    eval(fn);
    window._panel._view = "overview";
    window._panel.requestUpdate();
  }, PANEL_EVAL);
  await page.waitForTimeout(1500);
  await screenshot(page, "overview-v1041");

  console.log("\n== (2) settings view with 8 feature toggles ==");
  await page.evaluate((fn) => {
    eval(fn);
    window._panel._view = "overview";
    window._panel._overviewTab = "settings";
    window._panel.requestUpdate();
  }, PANEL_EVAL);
  await page.waitForTimeout(1500);
  // Scroll down so the 8 feature flags are visible
  await page.evaluate((fn) => {
    eval(fn);
    const sv = window._sr.querySelector("maintenance-settings-view");
    if (sv?.shadowRoot) {
      const el = sv.shadowRoot.querySelector(".features-section, .features, .feature-flags");
      if (el?.scrollIntoView) el.scrollIntoView({ block: "start" });
    }
  }, PANEL_EVAL);
  await page.waitForTimeout(500);
  await screenshot(page, "settings-features", { fullPage: true });

  console.log("\n== (3) task detail with checklist preview + schedule_time ==");
  await page.evaluate(({ eid, tid, fn }) => {
    eval(fn);
    window._panel._selectedEntryId = eid;
    window._panel._selectedTaskId = tid;
    window._panel._view = "task";
    window._panel.requestUpdate();
  }, { eid: familyCar.entry_id, tid: tireTask.id, fn: PANEL_EVAL });
  await page.waitForTimeout(1500);
  await screenshot(page, "task-detail-checklist-and-time", { fullPage: true });

  console.log("\n== (4) task edit dialog with schedule_time + checklist editor ==");
  const freshTask = (await ws(page, { type: "maintenance_supporter/object", entry_id: familyCar.entry_id }))
    .tasks.find(t => t.id === tireTask.id);
  await page.evaluate(({ eid, task, fn }) => {
    eval(fn);
    window._sr.querySelector("maintenance-task-dialog").openEdit(eid, task);
  }, { eid: familyCar.entry_id, task: freshTask, fn: PANEL_EVAL });
  await page.waitForTimeout(1200);
  await screenshot(page, "task-dialog-new-fields");

  // Scroll the dialog to the checklist textarea so it's visible in the shot
  await page.evaluate((fn) => {
    eval(fn);
    const content = window._sr.querySelector("maintenance-task-dialog").shadowRoot.querySelector(".content");
    const ta = window._sr.querySelector("maintenance-task-dialog").shadowRoot.querySelector("textarea.checklist-textarea");
    if (ta && content) content.scrollTop = Math.max(0, ta.offsetTop - 100);
  }, PANEL_EVAL);
  await page.waitForTimeout(500);
  await screenshot(page, "task-dialog-checklist-editor");

  // Close
  await page.evaluate((fn) => {
    eval(fn);
    window._sr.querySelector("maintenance-task-dialog")._open = false;
  }, PANEL_EVAL);
  await page.waitForTimeout(500);

  console.log("\n== (5) object dialog with ha-area-picker ==");
  await page.evaluate(({ eid, fn }) => {
    eval(fn);
    // object-dialog doesn't have an openEdit that takes an id — find the
    // "Edit object" entrypoint via the panel's menu
    const obj = window._panel._objects.find(o => o.entry_id === eid);
    if (obj) {
      window._sr.querySelector("maintenance-object-dialog").openEdit(obj.entry_id, obj.object);
    }
  }, { eid: hvac.entry_id, fn: PANEL_EVAL });
  await page.waitForTimeout(1200);
  await screenshot(page, "object-dialog-area-picker");
  await page.evaluate((fn) => {
    eval(fn);
    window._sr.querySelector("maintenance-object-dialog")._open = false;
  }, PANEL_EVAL);
  await page.waitForTimeout(500);

  console.log("\n== (6) seasonal overrides dialog (12-month editor) ==");
  try {
    const seasonalTask = (await ws(page, { type: "maintenance_supporter/object", entry_id: hvac.entry_id }))
      .tasks.find(t => t.id === filterTask.id);
    await page.evaluate(({ eid, tid, fn }) => {
      eval(fn);
      window._panel._selectedEntryId = eid;
      window._panel._selectedTaskId = tid;
      window._panel._view = "task";
      window._panel.requestUpdate();
    }, { eid: hvac.entry_id, tid: filterTask.id, fn: PANEL_EVAL });
    await page.waitForTimeout(1000);
    await page.evaluate(({ task, fn }) => {
      eval(fn);
      window._sr.querySelector("maintenance-seasonal-overrides-dialog")
        .open(window._panel._selectedEntryId, window._panel._selectedTaskId, task.adaptive_config?.seasonal_overrides);
    }, { task: seasonalTask, fn: PANEL_EVAL });
    await page.waitForTimeout(1200);
    await screenshot(page, "seasonal-overrides-dialog");
    await page.evaluate((fn) => {
      eval(fn);
      window._sr.querySelector("maintenance-seasonal-overrides-dialog")._open = false;
    }, PANEL_EVAL);
  } catch (e) { console.log("   seasonal-dialog skipped:", e?.message); }

  console.log("\n== (7) localized validation error in dialog ==");
  // Open a task dialog, paste an oversized name, hit save
  await page.evaluate(({ eid, task, fn }) => {
    eval(fn);
    window._sr.querySelector("maintenance-task-dialog").openEdit(eid, task);
  }, { eid: familyCar.entry_id, task: freshTask, fn: PANEL_EVAL });
  await page.waitForTimeout(1000);
  await page.evaluate((fn) => {
    eval(fn);
    const dlg = window._sr.querySelector("maintenance-task-dialog");
    dlg._name = "X".repeat(500);  // triggers WS vol.Length rejection
    dlg.requestUpdate();
  }, PANEL_EVAL);
  await page.waitForTimeout(300);
  await page.evaluate((fn) => {
    eval(fn);
    window._sr.querySelector("maintenance-task-dialog")._save();
  }, PANEL_EVAL);
  await page.waitForTimeout(1200);
  await screenshot(page, "validation-error-localized");

  await cleanup(browser, ctx);
  console.log("\n== Done. Screenshots in docs/images/ ==");
}

main().catch((e) => { console.error(e); process.exit(1); });
