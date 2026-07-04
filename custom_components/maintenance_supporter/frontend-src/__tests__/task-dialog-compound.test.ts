/**
 * <maintenance-task-dialog>: the compound trigger editor (panel↔config-flow
 * parity). Hydration from a compound trigger_config into per-condition drafts,
 * and the outgoing WS payload building the {type:compound, compound_logic,
 * conditions[]} shape the backend expects.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/task-dialog.js";
import type { MaintenanceTaskDialog } from "../components/task-dialog";
import { type SentMessage, createMockHass } from "./_test-utils.js";

async function mountDialog(): Promise<{ el: MaintenanceTaskDialog; sent: SentMessage[] }> {
  const { hass, sent } = createMockHass({
    handlers: {
      "maintenance_supporter/task/create": () => ({ task_id: "new1" }),
      "maintenance_supporter/task/update": () => ({}),
    },
  });
  const el = await fixture<MaintenanceTaskDialog>(html`
    <maintenance-task-dialog .hass=${hass}></maintenance-task-dialog>
  `);
  await el.updateComplete;
  return { el, sent };
}

describe("task-dialog compound trigger editor (parity)", () => {
  it("hydrates compound_logic + conditions from trigger_config", async () => {
    const { el } = await mountDialog();
    await el.openEdit("e", {
      id: "t1", name: "AC service", type: "custom",
      schedule_type: "sensor_based", warning_days: 7, enabled: true,
      trigger_config: {
        type: "compound",
        compound_logic: "OR",
        conditions: [
          { entity_id: "sensor.hours", entity_ids: ["sensor.hours"], type: "runtime", trigger_runtime_hours: 500 },
          { entity_id: "sensor.dust", entity_ids: ["sensor.dust"], type: "threshold", trigger_above: 80 },
        ],
      },
    } as any);
    await el.updateComplete;
    expect((el as any)._triggerType).to.equal("compound");
    expect((el as any)._compoundLogic).to.equal("OR");
    const conds = (el as any)._compoundConditions;
    expect(conds).to.have.length(2);
    expect(conds[0].type).to.equal("runtime");
    expect(conds[0].runtimeHours).to.equal("500");
    expect(conds[0].entityIds).to.equal("sensor.hours");
    expect(conds[1].type).to.equal("threshold");
    expect(conds[1].above).to.equal("80");
  });

  it("builds a compound trigger_config on save", async () => {
    const { el, sent } = await mountDialog();
    await el.openCreate("e");
    (el as any)._name = "AC service";
    (el as any)._scheduleType = "sensor_based";
    (el as any)._triggerType = "compound";
    (el as any)._compoundLogic = "AND";
    (el as any)._compoundConditions = [
      { entityIds: "sensor.hours", type: "runtime", above: "", below: "", forMinutes: "0",
        targetValue: "", deltaMode: false, fromState: "", toState: "", targetChanges: "", runtimeHours: "500" },
      { entityIds: "sensor.dust, sensor.dust2", type: "threshold", above: "80", below: "", forMinutes: "0",
        targetValue: "", deltaMode: false, fromState: "", toState: "", targetChanges: "", runtimeHours: "" },
    ];
    await (el as any)._save();
    const msg = sent.find((m) => m.type === "maintenance_supporter/task/create") as any;
    expect(msg, "create message sent").to.exist;
    const tc = msg.trigger_config;
    expect(tc.type).to.equal("compound");
    expect(tc.compound_logic).to.equal("AND");
    expect(tc.conditions).to.have.length(2);
    expect(tc.conditions[0]).to.deep.include({ type: "runtime", trigger_runtime_hours: 500 });
    expect(tc.conditions[0].entity_ids).to.deep.equal(["sensor.hours"]);
    expect(tc.conditions[1]).to.deep.include({ type: "threshold", trigger_above: 80 });
    expect(tc.conditions[1].entity_ids).to.deep.equal(["sensor.dust", "sensor.dust2"]);
  });

  it("drops conditions with no entity, and clears the trigger if all empty on edit", async () => {
    const { el, sent } = await mountDialog();
    await el.openEdit("e", {
      id: "t1", name: "x", type: "custom", schedule_type: "sensor_based",
      warning_days: 7, enabled: true,
      trigger_config: { type: "compound", compound_logic: "AND", conditions: [] },
    } as any);
    (el as any)._triggerType = "compound";
    (el as any)._compoundConditions = [
      { entityIds: "  ", type: "threshold", above: "1", below: "", forMinutes: "0",
        targetValue: "", deltaMode: false, fromState: "", toState: "", targetChanges: "", runtimeHours: "" },
    ];
    await (el as any)._save();
    const msg = sent.find((m) => m.type === "maintenance_supporter/task/update") as any;
    expect(msg, "update message sent").to.exist;
    expect(msg.trigger_config).to.equal(null);
  });
});
