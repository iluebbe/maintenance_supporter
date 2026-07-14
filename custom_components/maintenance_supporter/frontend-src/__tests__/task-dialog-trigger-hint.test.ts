/**
 * <maintenance-task-dialog>: the live "what happens next" trigger hint.
 *
 * The sensor-based trigger form reads the bound entity's CURRENT state and
 * spells out the semantics (a delta counter counts from the current reading,
 * not from zero, and restarts after each completion). Pins: the hint renders
 * with the live value + computed due point, updates per trigger type, and
 * stays absent when no entity/state is available.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/task-dialog.js";
import type { MaintenanceTaskDialog } from "../components/task-dialog";
import { createMockHass } from "./_test-utils.js";

async function mountCreate(states: Record<string, unknown>): Promise<MaintenanceTaskDialog> {
  const { hass } = createMockHass({ states });
  const el = await fixture<MaintenanceTaskDialog>(html`
    <maintenance-task-dialog .hass=${hass}></maintenance-task-dialog>
  `);
  el.openCreate("e1", []);
  await el.updateComplete;
  (el as any)._scheduleType = "sensor_based";
  await el.updateComplete;
  return el;
}

const hint = (el: MaintenanceTaskDialog): string | null =>
  el.shadowRoot!.querySelector(".trigger-live-hint")?.textContent?.trim() ?? null;

describe("task-dialog live trigger hint", () => {
  it("delta counter: shows current reading, computed due point, and restart semantics", async () => {
    const el = await mountCreate({
      "sensor.pump_hours": { state: "660", attributes: { unit_of_measurement: "h" } },
    });
    (el as any)._triggerEntityId = "sensor.pump_hours";
    (el as any)._triggerEntityIds = ["sensor.pump_hours"];
    (el as any)._triggerType = "counter";
    (el as any)._triggerDeltaMode = true;
    (el as any)._triggerTargetValue = "100";
    await el.updateComplete;
    const text = hint(el)!;
    expect(text, "hint rendered").to.not.equal(null);
    expect(text).to.include("660 h"); // current reading
    expect(text).to.include("760 h"); // computed due point (660 + 100)
  });

  it("threshold: shows current value and the above-target", async () => {
    const el = await mountCreate({
      "sensor.pressure": { state: "1.2", attributes: { unit_of_measurement: "bar" } },
    });
    (el as any)._triggerEntityId = "sensor.pressure";
    (el as any)._triggerEntityIds = ["sensor.pressure"];
    (el as any)._triggerType = "threshold";
    (el as any)._triggerAbove = "1.5";
    await el.updateComplete;
    const text = hint(el)!;
    expect(text).to.include("1.2 bar");
    expect(text).to.include("1.5 bar");
  });

  it("renders nothing without a bound entity or without targets", async () => {
    const el = await mountCreate({
      "sensor.pressure": { state: "1.2", attributes: {} },
    });
    (el as any)._triggerType = "threshold";
    (el as any)._triggerAbove = "1.5"; // target set, but NO entity
    await el.updateComplete;
    expect(hint(el)).to.equal(null);

    (el as any)._triggerEntityId = "sensor.pressure";
    (el as any)._triggerEntityIds = ["sensor.pressure"];
    (el as any)._triggerAbove = ""; // entity set, but no target
    await el.updateComplete;
    expect(hint(el)).to.equal(null);
  });

  it("editing a delta task uses the since-last-completion wording (baseline is not the current reading)", async () => {
    const { hass } = createMockHass({
      states: { "sensor.pump_hours": { state: "660", attributes: { unit_of_measurement: "h" } } },
    });
    const el = await fixture<MaintenanceTaskDialog>(html`
      <maintenance-task-dialog .hass=${hass}></maintenance-task-dialog>
    `);
    await el.openEdit("e1", {
      id: "t1", name: "Service", type: "custom",
      schedule_type: "sensor_based", warning_days: 7, enabled: true,
      trigger_config: {
        type: "counter", entity_id: "sensor.pump_hours", entity_ids: ["sensor.pump_hours"],
        trigger_target_value: 100, trigger_delta_mode: true,
      },
    } as any);
    await el.updateComplete;
    const text = hint(el)!;
    expect(text, "hint rendered in edit mode").to.not.equal(null);
    // Must NOT claim the count starts at the current reading (the stored
    // baseline is the last completion, not "now") — no computed 760 h.
    expect(text).to.not.include("760");
    expect(text).to.include("100 h");
  });
});
