/** #106 follow-up: reproduce with the EXACT _build_task_summary shape. */
import { expect, fixture, html } from "@open-wc/testing";
import "../components/task-dialog.js";
import type { MaintenanceTaskDialog } from "../components/task-dialog";
import { createMockHass } from "./_test-utils.js";

it("fleet-shaped task (nested manual schedule + plural-only threshold) keeps its trigger", async () => {
  const { hass, sent } = createMockHass({
    states: { "sensor.maintenance_supporter_batteries_to_replace": { state: "8" } },
    handlers: { "maintenance_supporter/task/update": () => ({ success: true }) },
  });
  const el = await fixture<MaintenanceTaskDialog>(html`
    <maintenance-task-dialog .hass=${hass}></maintenance-task-dialog>
  `);
  await el.updateComplete;
  await el.openEdit("entry_x", {
    id: "t1",
    name: "Replace low batteries",
    type: "inspection",
    enabled: true,
    schedule_type: "sensor_based",
    interval_days: null,
    interval_unit: "days",
    due_date: null,
    interval_anchor: "completion",
    schedule: { kind: "manual" },
    warning_days: 7,
    battery_fleet_task: true,
    trigger_config: {
      type: "threshold",
      entity_ids: ["sensor.maintenance_supporter_batteries_to_replace"],
      trigger_above: 0,
      entity_logic: "any",
      auto_complete_on_recovery: true,
    },
    trigger_entity_info: {
      entity_id: "sensor.maintenance_supporter_batteries_to_replace",
      friendly_name: "Batteries to replace",
      unit_of_measurement: null,
    },
  } as any);
  await el.updateComplete;
  // the user's edit: rename + warning days
  (el as any)._name = "Remplacer les piles";
  (el as any)._warningDays = "1";
  await (el as any)._save();
  const update = sent.find((m: any) => m.type === "maintenance_supporter/task/update") as any;
  expect(update, "update sent").to.exist;
  expect(update.trigger_config, "trigger_config must survive").to.exist;
  expect(update.trigger_config.type).to.equal("threshold");
  expect(update.trigger_config.trigger_above).to.equal(0);
});
