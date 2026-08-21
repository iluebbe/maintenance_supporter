/**
 * <maintenance-task-dialog>: full trigger_config save-roundtrip closure
 * (#103 class).
 *
 * The dialog rebuilds trigger_config from scratch on save, so every key the
 * engine knows must survive openEdit -> _save unchanged. Pins a MAXIMAL
 * config per trigger type — including per-condition attribute / baseline /
 * entity_logic inside compound triggers, which travel through the editor's
 * `carry` passthrough without having form fields.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/task-dialog.js";
import type { MaintenanceTaskDialog } from "../components/task-dialog";
import { type SentMessage, createMockHass } from "./_test-utils.js";

async function saveRoundtrip(triggerConfig: Record<string, unknown>): Promise<Record<string, unknown>> {
  const { hass, sent } = createMockHass({
    states: { "sensor.a": { state: "42" }, "sensor.b": { state: "7" } },
    handlers: { "maintenance_supporter/task/update": () => ({ success: true }) },
  });
  const el = await fixture<MaintenanceTaskDialog>(html`
    <maintenance-task-dialog .hass=${hass}></maintenance-task-dialog>
  `);
  await el.updateComplete;
  await el.openEdit("entry_x", {
    id: "t1",
    name: "Roundtrip",
    type: "custom",
    schedule_type: "sensor_based",
    warning_days: 7,
    enabled: true,
    trigger_config: triggerConfig,
  } as any);
  await el.updateComplete;
  await (el as any)._save();
  const update = sent.find((m) => m.type === "maintenance_supporter/task/update") as any;
  expect(update, "update message sent").to.exist;
  return update.trigger_config;
}

describe("task-dialog trigger_config roundtrip closure (#103 class)", () => {
  it("threshold: attribute, both bounds, for_minutes, entity_logic, recovery", async () => {
    const tc = await saveRoundtrip({
      type: "threshold",
      entity_id: "sensor.a",
      entity_ids: ["sensor.a", "sensor.b"],
      entity_logic: "all",
      attribute: "level",
      trigger_above: 80,
      trigger_below: 10,
      trigger_for_minutes: 5,
      auto_complete_on_recovery: true,
    });
    expect(tc).to.deep.include({
      type: "threshold",
      entity_logic: "all",
      attribute: "level",
      trigger_above: 80,
      trigger_below: 10,
      trigger_for_minutes: 5,
      auto_complete_on_recovery: true,
    });
  });

  it("threshold: =/≠ limits and the all-combinator survive", async () => {
    const tc = await saveRoundtrip({
      type: "threshold",
      entity_id: "sensor.a",
      trigger_equals: 3,
      trigger_not_equals: 1,
      trigger_combinator: "all",
    });
    expect(tc).to.deep.include({
      type: "threshold",
      trigger_equals: 3,
      trigger_not_equals: 1,
      trigger_combinator: "all",
    });
  });

  it("combinator defaults to any and is then omitted from the payload", async () => {
    const tc = await saveRoundtrip({
      type: "threshold",
      entity_id: "sensor.a",
      trigger_above: 80,
    });
    expect(tc.trigger_combinator, "any must not be persisted").to.equal(undefined);
  });

  it("threshold stored with ONLY plural entity_ids survives an edit (#106)", async () => {
    // The Battery Fleet task's trigger has no singular entity_id; the save
    // path gates on _triggerEntityId, so before the hydration fallback an
    // unrelated edit sent trigger_config: null and wiped the trigger.
    const tc = await saveRoundtrip({
      type: "threshold",
      entity_ids: ["sensor.a"],
      entity_logic: "any",
      trigger_above: 0,
      auto_complete_on_recovery: true,
    });
    expect(tc, "trigger_config must not be nulled").to.exist;
    expect(tc).to.deep.include({
      type: "threshold",
      entity_id: "sensor.a",
      trigger_above: 0,
      auto_complete_on_recovery: true,
    });
    expect(tc.entity_ids).to.deep.equal(["sensor.a"]);
  });

  it("counter: delta mode with start value", async () => {
    const tc = await saveRoundtrip({
      type: "counter",
      entity_id: "sensor.a",
      entity_ids: ["sensor.a"],
      trigger_target_value: 15000,
      trigger_delta_mode: true,
      trigger_baseline_value: 12000,
    });
    expect(tc).to.deep.include({
      type: "counter",
      trigger_target_value: 15000,
      trigger_delta_mode: true,
      trigger_baseline_value: 12000,
    });
  });

  it("runtime: on_states and attribute", async () => {
    const tc = await saveRoundtrip({
      type: "runtime",
      entity_id: "sensor.a",
      entity_ids: ["sensor.a"],
      trigger_runtime_hours: 250,
      trigger_on_states: ["cooling", "heating"],
      attribute: "hvac_action",
    });
    expect(tc).to.deep.include({
      type: "runtime",
      trigger_runtime_hours: 250,
      attribute: "hvac_action",
    });
    expect(tc.trigger_on_states).to.deep.equal(["cooling", "heating"]);
  });

  it("state_change: from/to states and target changes", async () => {
    const tc = await saveRoundtrip({
      type: "state_change",
      entity_id: "sensor.a",
      entity_ids: ["sensor.a"],
      trigger_from_state: "unlocked",
      trigger_to_state: "locked",
      trigger_target_changes: 500,
      auto_complete_on_recovery: true,
    });
    expect(tc).to.deep.include({
      type: "state_change",
      trigger_from_state: "unlocked",
      trigger_to_state: "locked",
      trigger_target_changes: 500,
      auto_complete_on_recovery: true,
    });
  });

  it("state_change: the hold filter (for_minutes, #136) survives the roundtrip", async () => {
    const tc = await saveRoundtrip({
      type: "state_change",
      entity_id: "binary_sensor.vacuum_problem",
      entity_ids: ["binary_sensor.vacuum_problem"],
      trigger_to_state: "on",
      trigger_target_changes: 1,
      trigger_for_minutes: 10,
      auto_complete_on_recovery: true,
    });
    expect(tc).to.deep.include({
      type: "state_change",
      trigger_to_state: "on",
      trigger_for_minutes: 10,
    });
  });

  it("compound: per-condition attribute/baseline/entity_logic survive via carry", async () => {
    const tc = await saveRoundtrip({
      type: "compound",
      compound_logic: "OR",
      conditions: [
        {
          type: "runtime",
          entity_id: "sensor.a",
          entity_ids: ["sensor.a"],
          trigger_runtime_hours: 500,
          trigger_on_states: ["printing"],
          attribute: "job_state",
        },
        {
          type: "counter",
          entity_id: "sensor.b",
          entity_ids: ["sensor.b"],
          trigger_target_value: 100,
          trigger_delta_mode: true,
          trigger_baseline_value: 40,
          entity_logic: "any",
        },
      ],
    });
    expect(tc.type).to.equal("compound");
    expect(tc.compound_logic).to.equal("OR");
    const conds = tc.conditions as Array<Record<string, unknown>>;
    expect(conds).to.have.length(2);
    expect(conds[0]).to.deep.include({
      type: "runtime",
      trigger_runtime_hours: 500,
      attribute: "job_state",
    });
    expect(conds[0].trigger_on_states).to.deep.equal(["printing"]);
    expect(conds[1]).to.deep.include({
      type: "counter",
      trigger_target_value: 100,
      trigger_delta_mode: true,
      trigger_baseline_value: 40,
      entity_logic: "any",
    });
  });

  it("compound: condition =/≠ limits and task-level combinator survive", async () => {
    const tc = await saveRoundtrip({
      type: "compound",
      compound_logic: "AND",
      trigger_combinator: "all",
      conditions: [
        {
          type: "threshold",
          entity_id: "sensor.a",
          entity_ids: ["sensor.a"],
          trigger_equals: 3,
          trigger_not_equals: 1,
        },
        {
          type: "threshold",
          entity_id: "sensor.b",
          entity_ids: ["sensor.b"],
          trigger_above: 80,
        },
      ],
    });
    expect(tc.trigger_combinator).to.equal("all");
    const conds = tc.conditions as Array<Record<string, unknown>>;
    expect(conds[0]).to.deep.include({
      type: "threshold",
      trigger_equals: 3,
      trigger_not_equals: 1,
    });
  });
});
