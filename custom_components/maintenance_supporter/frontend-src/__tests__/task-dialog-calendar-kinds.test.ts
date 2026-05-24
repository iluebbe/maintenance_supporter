/**
 * Lit component tests for the Phase 4 calendar recurrence kinds in
 * <maintenance-task-dialog>: weekdays / nth_weekday / day_of_month.
 *
 * Pins the UI side of the WS contract (backend: test_schedule.py +
 * test_ws_roundtrip.py): hydration from the nested `schedule`, the outgoing
 * `schedule` payload shape, and that the per-kind field groups render.
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

describe("task-dialog calendar kinds (Phase 4)", () => {
  it("hydrates nth_weekday from the nested schedule on openEdit", async () => {
    const { el } = await mountDialog();
    await el.openEdit("e", {
      id: "t1", name: "Smoke alarm", type: "custom",
      schedule_type: "nth_weekday", warning_days: 7, enabled: true,
      schedule: { kind: "nth_weekday", nth: 1, weekday: 5 },
    } as any);
    await el.updateComplete;
    expect((el as any)._scheduleType).to.equal("nth_weekday");
    expect((el as any)._nth).to.equal("1");
    expect((el as any)._nthWeekday).to.equal("5");
  });

  it("hydrates weekdays from the nested schedule", async () => {
    const { el } = await mountDialog();
    await el.openEdit("e", {
      id: "t1", name: "Floors", type: "custom",
      schedule_type: "weekdays", warning_days: 7, enabled: true,
      schedule: { kind: "weekdays", weekdays: [0, 3] },
    } as any);
    await el.updateComplete;
    expect((el as any)._scheduleType).to.equal("weekdays");
    expect((el as any)._weekdays).to.deep.equal([0, 3]);
  });

  it("create sends the nested schedule for nth_weekday", async () => {
    const { el, sent } = await mountDialog();
    await el.openCreate("e");
    (el as any)._name = "Smoke alarm";
    (el as any)._scheduleType = "nth_weekday";
    (el as any)._nth = "1";
    (el as any)._nthWeekday = "5";
    await (el as any)._save();
    const msg = sent.find((m) => m.type === "maintenance_supporter/task/create") as any;
    expect(msg, "create message sent").to.exist;
    expect(msg.schedule).to.deep.equal({ kind: "nth_weekday", nth: 1, weekday: 5 });
  });

  it("create sends a sorted weekdays schedule", async () => {
    const { el, sent } = await mountDialog();
    await el.openCreate("e");
    (el as any)._name = "Floors";
    (el as any)._scheduleType = "weekdays";
    (el as any)._weekdays = [3, 0];
    await (el as any)._save();
    const msg = sent.find((m) => m.type === "maintenance_supporter/task/create") as any;
    expect(msg.schedule).to.deep.equal({ kind: "weekdays", weekdays: [0, 3] });
  });

  it("create sends day_of_month", async () => {
    const { el, sent } = await mountDialog();
    await el.openCreate("e");
    (el as any)._name = "Rent";
    (el as any)._scheduleType = "day_of_month";
    (el as any)._domDay = "15";
    await (el as any)._save();
    const msg = sent.find((m) => m.type === "maintenance_supporter/task/create") as any;
    expect(msg.schedule).to.deep.equal({ kind: "day_of_month", day: 15 });
  });

  it("renders 7 weekday chips for the weekdays kind", async () => {
    const { el } = await mountDialog();
    await el.openCreate("e");
    (el as any)._scheduleType = "weekdays";
    await el.updateComplete;
    const chips = el.shadowRoot!.querySelectorAll(".weekday-chip");
    expect(chips.length).to.equal(7);
  });
});
