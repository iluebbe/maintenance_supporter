/**
 * <maintenance-task-dialog>: dialog/flow parity round —
 * (a) the adaptive-scheduling section (hydration, change-gated task/set_adaptive
 *     call, min>max validation) and
 * (c) the editable per-condition attribute in the compound editor
 *     (hydration out of `carry`, round-trip into the saved trigger_config).
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
      "maintenance_supporter/task/set_adaptive": () => ({ success: true }),
      "maintenance_supporter/entity/attributes": () => ({
        domain: "sensor",
        suggested_attributes: ["temperature"],
        available_attributes: [
          { name: "temperature", value: 21, numeric: true },
          { name: "humidity", value: 40, numeric: true },
        ],
      }),
    },
  });
  const el = await fixture<MaintenanceTaskDialog>(html`
    <maintenance-task-dialog .hass=${hass}></maintenance-task-dialog>
  `);
  await el.updateComplete;
  return { el, sent };
}

describe("task-dialog adaptive section (flow parity)", () => {
  it("renders the section and reveals tuning fields when enabled", async () => {
    const { el } = await mountDialog();
    await el.openCreate("e");
    (el as any)._scheduleType = "time_based";
    await el.updateComplete;
    const sections = [...el.shadowRoot!.querySelectorAll("details.ca-section summary, details.adaptive-section summary")]
      .map((s) => s.textContent?.trim());
    expect(sections.some((s) => /adaptive/i.test(s || "")), "adaptive section present").to.be.true;
    (el as any)._adaptiveEnabled = true;
    await el.updateComplete;
    const labels = [...el.shadowRoot!.querySelectorAll("ms-textfield")].map((n) => n.getAttribute("label") || "");
    expect(labels.some((l) => /minimum interval/i.test(l)), "min field").to.be.true;
    expect(labels.some((l) => /learning rate/i.test(l)), "alpha field").to.be.true;
  });

  it("is hidden for one-time and manual tasks (nothing to adapt)", async () => {
    const { el } = await mountDialog();
    await el.openCreate("e");
    (el as any)._scheduleType = "manual";
    await el.updateComplete;
    const sections = [...el.shadowRoot!.querySelectorAll("details.ca-section summary, details.adaptive-section summary")]
      .map((s) => s.textContent?.trim());
    expect(sections.some((s) => /adaptive/i.test(s || ""))).to.be.false;
  });

  it("hydrates from adaptive_config on openEdit", async () => {
    const { el } = await mountDialog();
    await el.openEdit("e", {
      id: "t1", name: "Filter", type: "custom",
      schedule_type: "time_based", interval_days: 90, warning_days: 7, enabled: true,
      adaptive_config: {
        enabled: true, ewa_alpha: 0.5, min_interval_days: 14,
        max_interval_days: 120, seasonal_enabled: false, sensor_prediction_enabled: true,
      },
    } as any);
    await el.updateComplete;
    expect((el as any)._adaptiveEnabled).to.be.true;
    expect((el as any)._adaptiveAlpha).to.equal("0.5");
    expect((el as any)._adaptiveMin).to.equal("14");
    expect((el as any)._adaptiveMax).to.equal("120");
    expect((el as any)._adaptiveSeasonal).to.be.false;
    expect((el as any)._adaptivePrediction).to.be.true;
  });

  it("saves via task/set_adaptive only when something changed", async () => {
    const { el, sent } = await mountDialog();
    await el.openCreate("e");
    (el as any)._name = "Filter";
    await (el as any)._save();
    expect(sent.some((m) => m.type === "maintenance_supporter/task/set_adaptive"), "untouched -> no call").to.be.false;

    await el.openCreate("e");
    (el as any)._name = "Filter";
    (el as any)._adaptiveEnabled = true;
    (el as any)._adaptiveMin = "10";
    (el as any)._adaptiveMax = "60";
    await (el as any)._save();
    const msg = sent.find((m) => m.type === "maintenance_supporter/task/set_adaptive") as any;
    expect(msg, "changed -> call").to.exist;
    expect(msg.enabled).to.be.true;
    expect(msg.min_interval_days).to.equal(10);
    expect(msg.max_interval_days).to.equal(60);
    expect(msg.task_id).to.equal("new1");
  });

  it("rejects min > max before anything is saved", async () => {
    const { el, sent } = await mountDialog();
    await el.openCreate("e");
    (el as any)._name = "Filter";
    (el as any)._adaptiveEnabled = true;
    (el as any)._adaptiveMin = "100";
    (el as any)._adaptiveMax = "10";
    await (el as any)._save();
    expect(sent.some((m) => m.type === "maintenance_supporter/task/create"), "task not saved").to.be.false;
    expect((el as any)._error).to.not.equal("");
  });
});

describe("task-dialog compound condition attribute (flow parity)", () => {
  it("hydrates a stored per-condition attribute into the editor", async () => {
    const { el } = await mountDialog();
    await el.openEdit("e", {
      id: "t1", name: "Pump", type: "custom",
      schedule_type: "sensor_based", warning_days: 7, enabled: true,
      trigger_config: {
        type: "compound", compound_logic: "OR",
        conditions: [
          { type: "threshold", entity_id: "sensor.pump", entity_ids: ["sensor.pump"],
            attribute: "temperature", trigger_above: 60 },
        ],
      },
    } as any);
    await el.updateComplete;
    const cond = (el as any)._compoundConditions[0];
    expect(cond.attribute).to.equal("temperature");
    expect("attribute" in (cond.carry || {}), "attribute no longer rides in carry").to.be.false;
  });

  it("round-trips the edited attribute into the saved condition", async () => {
    const { el, sent } = await mountDialog();
    await el.openCreate("e");
    (el as any)._name = "Pump";
    (el as any)._scheduleType = "sensor_based";
    (el as any)._triggerType = "compound";
    (el as any)._compoundLogic = "OR";
    (el as any)._compoundConditions = [
      { entityIds: "sensor.pump", type: "threshold", attribute: "temperature", above: "60", below: "",
        forMinutes: "0", targetValue: "", deltaMode: false, fromState: "", toState: "",
        targetChanges: "", runtimeHours: "", onStates: "", carry: {} },
      { entityIds: "sensor.pump2", type: "threshold", attribute: "", above: "80", below: "",
        forMinutes: "0", targetValue: "", deltaMode: false, fromState: "", toState: "",
        targetChanges: "", runtimeHours: "", onStates: "", carry: {} },
    ];
    await (el as any)._save();
    const msg = sent.find((m) => m.type === "maintenance_supporter/task/create") as any;
    expect(msg.trigger_config.conditions[0].attribute).to.equal("temperature");
    expect("attribute" in msg.trigger_config.conditions[1], "empty attribute omitted").to.be.false;
  });

  it("renders the attribute dropdown from the live entity attributes", async () => {
    const { el } = await mountDialog();
    await el.openCreate("e");
    (el as any)._scheduleType = "sensor_based";
    (el as any)._triggerType = "compound";
    (el as any)._compoundConditions = [
      { entityIds: "sensor.pump", type: "threshold", attribute: "", above: "", below: "",
        forMinutes: "0", targetValue: "", deltaMode: false, fromState: "", toState: "",
        targetChanges: "", runtimeHours: "", onStates: "", carry: {} },
    ];
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 50)); // let the lazy fetch resolve
    await el.updateComplete;
    const row = el.shadowRoot!.querySelector(".compound-condition");
    const options = [...(row?.querySelectorAll("select option") ?? [])].map((o) => o.textContent?.trim());
    expect(options.some((o) => /temperature ★/.test(o || "")), "suggested attribute offered").to.be.true;
  });
});
