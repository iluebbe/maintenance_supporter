/**
 * Lit component test for #42 — `interval_days` hydration on edit.
 *
 * Repro: a sensor_based task whose user has cleared the optional safety
 * interval is persisted as `interval_days: null` on the backend. Before
 * the fix, opening the edit dialog re-hydrated the field as "30" because
 * of the `?.toString() || "30"` fallback in openEdit, silently restoring
 * a value the user had explicitly removed.
 *
 * The test pins both branches of the corrected ternary:
 *   - null → empty string
 *   - explicit number → string of that number
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/task-dialog.js";
import type { MaintenanceTaskDialog } from "../components/task-dialog";
import { createMockHass } from "./_test-utils.js";

async function mountDialog(): Promise<MaintenanceTaskDialog> {
  const { hass } = createMockHass({
    handlers: {
      "maintenance_supporter/task/update": () => ({}),
    },
  });
  const el = await fixture<MaintenanceTaskDialog>(html`
    <maintenance-task-dialog .hass=${hass}></maintenance-task-dialog>
  `);
  await el.updateComplete;
  return el;
}

describe("task-dialog interval_days hydration (#42 regression)", () => {
  it("hydrates a cleared safety interval as empty string, not '30'", async () => {
    const el = await mountDialog();
    await el.openEdit("entry_x", {
      id: "t1",
      name: "Sensor task without safety net",
      type: "custom",
      schedule_type: "sensor_based",
      interval_days: null, // user has cleared the safety interval
      warning_days: 7,
      enabled: true,
      trigger_config: {
        type: "threshold",
        entity_id: "sensor.x",
        trigger_above: 100,
      },
    } as any);
    await el.updateComplete;

    expect((el as any)._intervalDays, "should be empty when persisted as null").to.equal("");
  });

  it("hydrates an explicit interval value to its string form", async () => {
    const el = await mountDialog();
    await el.openEdit("entry_x", {
      id: "t1",
      name: "Time-based task with 90-day interval",
      type: "custom",
      schedule_type: "time_based",
      interval_days: 90,
      warning_days: 7,
      enabled: true,
    } as any);
    await el.updateComplete;

    expect((el as any)._intervalDays, "should preserve the persisted number").to.equal("90");
  });

  it("hydrates a missing interval_days field as empty string", async () => {
    // The backend may send the field as undefined when not set on a manual task.
    const el = await mountDialog();
    await el.openEdit("entry_x", {
      id: "t1",
      name: "Manual task",
      type: "custom",
      schedule_type: "manual",
      warning_days: 7,
      enabled: true,
    } as any);
    await el.updateComplete;

    expect((el as any)._intervalDays, "undefined should hydrate to empty").to.equal("");
  });
});
