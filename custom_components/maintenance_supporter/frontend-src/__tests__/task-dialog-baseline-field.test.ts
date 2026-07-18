/**
 * <maintenance-task-dialog>: the delta-counter start-value field (#102).
 *
 * Pins the create/edit split: creating shows the "count from the current
 * reading" help, while editing shows the "keep the existing counting" help
 * plus the LIVE effective anchor (Store baseline from the read-model) — an
 * adopted delta task has no config baseline, so without the live line the
 * field would read as empty/zero even though counting is anchored.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/task-dialog.js";
import type { MaintenanceTaskDialog } from "../components/task-dialog";
import { createMockHass } from "./_test-utils.js";

async function mountDialog(): Promise<MaintenanceTaskDialog> {
  const { hass } = createMockHass({ states: { "sensor.odometer": { state: "27100" } } });
  const el = await fixture<MaintenanceTaskDialog>(html`
    <maintenance-task-dialog .hass=${hass}></maintenance-task-dialog>
  `);
  await el.updateComplete;
  return el;
}

describe("task-dialog delta start-value field (#102)", () => {
  it("edit mode shows the edit help and the live effective anchor", async () => {
    const el = await mountDialog();
    await el.openEdit("entry_x", {
      id: "t1",
      name: "Annual Service",
      type: "custom",
      schedule_type: "sensor_based",
      warning_days: 7,
      enabled: true,
      trigger_config: {
        type: "counter",
        entity_id: "sensor.odometer",
        trigger_target_value: 15000,
        trigger_delta_mode: true,
      },
      trigger_baseline_value: 27000, // live anchor from the read-model
    } as any);
    await el.updateComplete;

    const helps = [...el.shadowRoot!.querySelectorAll(".field-help")]
      .map((n) => n.textContent ?? "")
      .join(" | ");
    expect(helps).to.contain("keep the existing counting");
    const effective = el.shadowRoot!.querySelector(".baseline-effective");
    expect(effective?.textContent).to.contain("27000");
  });

  it("create mode shows the count-from-current help and no effective line", async () => {
    const el = await mountDialog();
    await el.openCreate("entry_x", []);
    await el.updateComplete;
    (el as any)._scheduleType = "sensor_based";
    (el as any)._triggerType = "counter";
    (el as any)._triggerDeltaMode = true;
    await el.updateComplete;

    const helps = [...el.shadowRoot!.querySelectorAll(".field-help")]
      .map((n) => n.textContent ?? "")
      .join(" | ");
    expect(helps).to.contain("count from the current value");
    expect(el.shadowRoot!.querySelector(".baseline-effective")).to.equal(null);
  });
});
