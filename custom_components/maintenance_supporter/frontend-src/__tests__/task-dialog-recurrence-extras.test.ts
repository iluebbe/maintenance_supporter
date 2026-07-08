/**
 * Lit tests for the seasonal-window + finite-series recurrence extras in
 * <maintenance-task-dialog>. Pins hydration from the nested schedule and the
 * outgoing `schedule` payload (backend: test_schedule.py / test_ws_io.py).
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

describe("task-dialog recurrence extras (season / finite series)", () => {
  it("hydrates season_months and a count end from the nested schedule", async () => {
    const { el } = await mountDialog();
    await el.openEdit("e", {
      id: "t1", name: "Mow", type: "custom", schedule_type: "time_based",
      interval_days: 14, interval_unit: "days", warning_days: 7, enabled: true,
      schedule: { kind: "interval", every: 14, unit: "days", season_months: [4, 5, 6], ends: { count: 6 } },
    } as any);
    await el.updateComplete;
    expect((el as any)._seasonMonths).to.deep.equal([4, 5, 6]);
    expect((el as any)._endsMode).to.equal("count");
    expect((el as any)._endsCount).to.equal("6");
  });

  it("hydrates an until end", async () => {
    const { el } = await mountDialog();
    await el.openEdit("e", {
      id: "t1", name: "Cure", type: "custom", schedule_type: "time_based",
      interval_days: 30, warning_days: 7, enabled: true,
      schedule: { kind: "interval", every: 30, unit: "days", ends: { until: "2027-01-01" } },
    } as any);
    await el.updateComplete;
    expect((el as any)._endsMode).to.equal("until");
    expect((el as any)._endsUntil).to.equal("2027-01-01");
  });

  it("create sends season_months + ends on an interval task's nested schedule", async () => {
    const { el, sent } = await mountDialog();
    await el.openCreate("e");
    (el as any)._name = "Mow";
    (el as any)._scheduleType = "time_based";
    (el as any)._intervalDays = "14";
    (el as any)._intervalUnit = "days";
    (el as any)._seasonMonths = [7, 4, 5];
    (el as any)._endsMode = "count";
    (el as any)._endsCount = "6";
    await (el as any)._save();
    const msg = sent.find((m) => m.type === "maintenance_supporter/task/create") as any;
    expect(msg.schedule).to.deep.equal({ kind: "interval", season_months: [4, 5, 7], ends: { count: 6 } });
    expect(msg.interval_days).to.equal(14); // flat fields still carry the cadence
  });

  it("attaches the extras to a calendar-kind schedule too", async () => {
    const { el, sent } = await mountDialog();
    await el.openCreate("e");
    (el as any)._name = "Gutter";
    (el as any)._scheduleType = "day_of_month";
    (el as any)._domDay = "15";
    (el as any)._seasonMonths = [10, 11];
    await (el as any)._save();
    const msg = sent.find((m) => m.type === "maintenance_supporter/task/create") as any;
    expect(msg.schedule).to.deep.equal({ kind: "day_of_month", day: 15, season_months: [10, 11] });
  });

  it("clearing season/ends on edit sends an authoritative schedule without them", async () => {
    const { el, sent } = await mountDialog();
    await el.openEdit("e", {
      id: "t1", name: "Mow", type: "custom", schedule_type: "time_based",
      interval_days: 14, warning_days: 7, enabled: true,
      schedule: { kind: "interval", every: 14, unit: "days", season_months: [4, 5], ends: { count: 3 } },
    } as any);
    (el as any)._seasonMonths = [];
    (el as any)._endsMode = "never";
    await (el as any)._save();
    const msg = sent.find((m) => m.type === "maintenance_supporter/task/update") as any;
    expect(msg.schedule).to.deep.equal({ kind: "interval" }); // no season_months, no ends
  });

  it("shows the season chips + ends selector for recurring, not for one_time", async () => {
    const { el } = await mountDialog();
    await el.openCreate("e");
    (el as any)._scheduleType = "time_based";
    await el.updateComplete;
    expect(el.shadowRoot!.querySelectorAll(".season-chip").length).to.equal(12);
    expect(el.shadowRoot!.querySelector('select option[value="count"]')).to.exist;

    (el as any)._scheduleType = "one_time";
    await el.updateComplete;
    expect(el.shadowRoot!.querySelectorAll(".season-chip").length).to.equal(0);
  });
});
