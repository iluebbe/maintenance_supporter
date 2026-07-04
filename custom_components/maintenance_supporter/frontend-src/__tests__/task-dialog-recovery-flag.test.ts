/**
 * <maintenance-task-dialog>: the auto_complete_on_recovery flag (#53) —
 * hydration from trigger_config, checkbox rendering, and the outgoing
 * WS payload (set only when true; absence means off).
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

describe("task-dialog auto-complete-on-recovery (#53)", () => {
  it("hydrates the flag from trigger_config on openEdit", async () => {
    const { el } = await mountDialog();
    await el.openEdit("e", {
      id: "t1", name: "Refill salt", type: "custom",
      schedule_type: "sensor_based", warning_days: 7, enabled: true,
      trigger_config: {
        type: "threshold", entity_id: "sensor.salt",
        trigger_below: 20, auto_complete_on_recovery: true,
      },
    } as any);
    await el.updateComplete;
    expect((el as any)._autoCompleteOnRecovery).to.be.true;
  });

  it("sends the flag in trigger_config only when enabled", async () => {
    const { el, sent } = await mountDialog();
    await el.openCreate("e");
    (el as any)._name = "Refill salt";
    (el as any)._scheduleType = "sensor_based";
    (el as any)._triggerEntityId = "sensor.salt";
    (el as any)._triggerEntityIds = ["sensor.salt"];
    (el as any)._triggerType = "threshold";
    (el as any)._triggerBelow = "20";
    (el as any)._autoCompleteOnRecovery = true;
    await (el as any)._save();
    const msg = sent.find((m) => m.type === "maintenance_supporter/task/create") as any;
    expect(msg, "create message sent").to.exist;
    expect(msg.trigger_config.auto_complete_on_recovery).to.be.true;
  });

  it("omits the flag when off (absence means off)", async () => {
    const { el, sent } = await mountDialog();
    await el.openCreate("e");
    (el as any)._name = "Refill salt";
    (el as any)._scheduleType = "sensor_based";
    (el as any)._triggerEntityId = "sensor.salt";
    (el as any)._triggerEntityIds = ["sensor.salt"];
    (el as any)._triggerType = "threshold";
    (el as any)._triggerBelow = "20";
    await (el as any)._save();
    const msg = sent.find((m) => m.type === "maintenance_supporter/task/create") as any;
    expect("auto_complete_on_recovery" in msg.trigger_config).to.be.false;
  });

  it("renders the checkbox in the sensor trigger section", async () => {
    const { el } = await mountDialog();
    await el.openCreate("e");
    (el as any)._scheduleType = "sensor_based";
    (el as any)._triggerEntityId = "sensor.salt";
    (el as any)._triggerEntityIds = ["sensor.salt"];
    await el.updateComplete;
    const checkboxes = [...el.shadowRoot!.querySelectorAll('input[type="checkbox"]')];
    // delta-mode checkbox only shows for counter type; the recovery checkbox
    // shows for every sensor trigger type.
    expect(checkboxes.length).to.be.greaterThan(0);
    const label = [...el.shadowRoot!.querySelectorAll("label")].find((l) =>
      /auto-complete|recover/i.test(l.textContent || ""),
    );
    expect(label, "recovery checkbox label present").to.exist;
  });
});
