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

async function mountCreate(states: Record<string, unknown>, language = "en"): Promise<MaintenanceTaskDialog> {
  const { hass } = createMockHass({ states, language });
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

  it("formats the figures in the user's number format (bug review 2026-09-04)", async () => {
    // Decimal comma + thousands separators for a de user — like the entity
    // card next to the dialog; the hint used raw String(n).
    const el = await mountCreate(
      {
        "sensor.odometer": { state: "100000", attributes: { unit_of_measurement: "km" } },
        "sensor.pressure": { state: "1.25", attributes: { unit_of_measurement: "bar" } },
      },
      "de",
    );
    (el as any)._triggerEntityId = "sensor.odometer";
    (el as any)._triggerEntityIds = ["sensor.odometer"];
    (el as any)._triggerType = "counter";
    (el as any)._triggerDeltaMode = true;
    (el as any)._triggerTargetValue = "15000";
    await el.updateComplete;
    let text = hint(el)!;
    expect(text).to.include("100.000 km");
    expect(text).to.include("115.000 km");
    expect(text).to.include("15.000 km");

    (el as any)._triggerEntityId = "sensor.pressure";
    (el as any)._triggerEntityIds = ["sensor.pressure"];
    (el as any)._triggerType = "threshold";
    (el as any)._triggerAbove = "1.5";
    await el.updateComplete;
    text = hint(el)!;
    expect(text).to.include("1,3 bar"); // 1.25 rounded to one decimal, decimal comma
    expect(text).to.include("1,5 bar");
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

  it("#156: below > above shows the overlap warning and blocks save (the limits are OR-ed)", async () => {
    const { hass, sent } = createMockHass({
      states: { "sensor.low_count": { state: "1", attributes: { unit_of_measurement: "batteries" } } },
      handlers: { "maintenance_supporter/task/create": () => ({ task_id: "new1" }) },
    });
    const el = await fixture<MaintenanceTaskDialog>(html`
      <maintenance-task-dialog .hass=${hass}></maintenance-task-dialog>
    `);
    el.openCreate("e1", []);
    await el.updateComplete;
    (el as any)._scheduleType = "sensor_based";
    await el.updateComplete;
    (el as any)._name = "Replace batteries";
    (el as any)._triggerEntityId = "sensor.low_count";
    (el as any)._triggerEntityIds = ["sensor.low_count"];
    (el as any)._triggerType = "threshold";
    (el as any)._triggerAbove = "0";
    (el as any)._triggerBelow = "5";
    await el.updateComplete;
    const warn = el.shadowRoot!.querySelector(".trigger-live-hint.warn");
    expect(warn, "overlap warning rendered").to.not.equal(null);
    expect(warn!.textContent).to.include("can never recover");
    // The regular hint still lists both limits above the warning.
    expect(hint(el)).to.include("0 batteries");

    await (el as any)._save();
    expect(sent.some((m) => m.type === "maintenance_supporter/task/create"), "save blocked").to.be.false;
    expect(el.shadowRoot!.querySelector(".error")?.textContent).to.include("can never recover");

    // A real band (below < above) or equal limits carry no warning.
    (el as any)._triggerBelow = "0";
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".trigger-live-hint.warn")).to.equal(null);
    (el as any)._triggerAbove = "5";
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".trigger-live-hint.warn")).to.equal(null);
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

describe("task-dialog state-change latch hint (#167)", () => {
  const latchHint = (el: MaintenanceTaskDialog): boolean =>
    [...el.shadowRoot!.querySelectorAll(".field-help")].some((n) => /latch/i.test(n.textContent || ""));

  it("explains the latch (incl. the from-only recovery) for a single transition with a pattern", async () => {
    const el = await mountCreate({ "sensor.dock_error": { state: "ok", attributes: {} } });
    (el as any)._triggerEntityId = "sensor.dock_error";
    (el as any)._triggerEntityIds = ["sensor.dock_error"];
    (el as any)._triggerType = "state_change";
    (el as any)._triggerFromState = "ok";
    (el as any)._triggerTargetChanges = "1";
    await el.updateComplete;
    expect(latchHint(el), "from-only, target 1").to.equal(true);

    (el as any)._triggerTargetChanges = "3";
    await el.updateComplete;
    expect(latchHint(el), "a counter is no latch").to.equal(false);

    (el as any)._triggerTargetChanges = "";
    (el as any)._triggerFromState = "";
    await el.updateComplete;
    expect(latchHint(el), "no pattern = no latch semantics").to.equal(false);
  });
});
