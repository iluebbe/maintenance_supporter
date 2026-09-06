/**
 * Time of day on every date-driven schedule kind (#168).
 *
 * The backend never limited `schedule_time` to the interval kind — the
 * dialog did. Pins that the "Due at a specific time" checkbox renders for
 * the interval, the three calendar kinds and a one-off, that the picker only
 * appears once it is ticked (pre-ticked when the task has a time), that the
 * value is sent while ticked and null once unticked, and that the two
 * date-less kinds (manual, sensor-based) neither show the checkbox nor send
 * the field — a present-as-null there would be the #106 wipe pattern.
 *
 * Backend twin: tests/test_schedule_time_calendar_kinds.py (SCHEDULE_TIME_KINDS).
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/task-dialog.js";
import type { MaintenanceTaskDialog } from "../components/task-dialog";
import { type SentMessage, createMockHass } from "./_test-utils.js";

const TIMED_KINDS: Array<[string, Record<string, unknown>]> = [
  ["time_based", { interval_days: 7 }],
  ["one_time", { due_date: "2026-09-14" }],
  ["weekdays", { schedule: { kind: "weekdays", weekdays: [6] } }],
  ["nth_weekday", { schedule: { kind: "nth_weekday", nth: 2, weekday: 5 } }],
  ["day_of_month", { schedule: { kind: "day_of_month", day: 1 } }],
];

async function mountDialog(): Promise<{ el: MaintenanceTaskDialog; sent: SentMessage[] }> {
  const { hass, sent } = createMockHass({
    states: { "binary_sensor.filter": { state: "off" } },
    handlers: { "maintenance_supporter/task/update": () => ({}) },
  });
  const el = await fixture<MaintenanceTaskDialog>(html`
    <maintenance-task-dialog .hass=${hass} .scheduleTimeEnabled=${true}></maintenance-task-dialog>
  `);
  await el.updateComplete;
  return { el, sent };
}

const timeField = (el: MaintenanceTaskDialog) => el.shadowRoot!.querySelector('ms-date-field[kind="time"]');
const toggle = (el: MaintenanceTaskDialog) => el.shadowRoot!.querySelector<HTMLInputElement>('.schedule-time-toggle input[type="checkbox"]');

async function setToggle(el: MaintenanceTaskDialog, on: boolean): Promise<void> {
  const box = toggle(el)!;
  box.checked = on;
  box.dispatchEvent(new Event("change"));
  await el.updateComplete;
}

async function saveAndRead(el: MaintenanceTaskDialog, sent: SentMessage[]): Promise<Record<string, unknown>> {
  await (el as unknown as { _save: () => Promise<void> })._save();
  const update = sent.find((m) => m.type === "maintenance_supporter/task/update");
  expect(update, "update sent").to.exist;
  return update as unknown as Record<string, unknown>;
}

describe("task-dialog schedule time on every dated kind (#168)", () => {
  for (const [kind, extra] of TIMED_KINDS) {
    it(`${kind}: a stored time pre-ticks the checkbox, shows the picker and is sent`, async () => {
      const { el, sent } = await mountDialog();
      await el.openEdit("e", {
        id: "t1", name: "Sunday round", type: "cleaning", warning_days: 1, enabled: true,
        schedule_type: kind, schedule_time: "21:00", ...extra,
      } as never);
      await el.updateComplete;
      expect(toggle(el), `checkbox rendered for ${kind}`).to.exist;
      expect(toggle(el)!.checked, `checkbox pre-ticked for ${kind}`).to.be.true;
      expect(timeField(el), `time picker rendered for ${kind}`).to.exist;
      const update = await saveAndRead(el, sent);
      expect(update.schedule_time, `schedule_time sent for ${kind}`).to.equal("21:00");
    });
  }

  it("without a stored time the checkbox is unticked and the picker hidden; ticking reveals it and the value is sent", async () => {
    const { el, sent } = await mountDialog();
    await el.openEdit("e", {
      id: "t1", name: "Floors", type: "cleaning", warning_days: 1, enabled: true,
      schedule_type: "weekdays", schedule: { kind: "weekdays", weekdays: [0, 3] },
    } as never);
    await el.updateComplete;
    expect(toggle(el)!.checked).to.be.false;
    expect(timeField(el), "picker hidden until ticked").to.equal(null);
    await setToggle(el, true);
    expect(timeField(el), "picker revealed").to.exist;
    timeField(el)!.dispatchEvent(new CustomEvent("value-changed", { detail: { value: "19:00" } }));
    await el.updateComplete;
    const update = await saveAndRead(el, sent);
    expect(update.schedule_time).to.equal("19:00");
  });

  it("unticking the checkbox sends null so the backend drops the stored time", async () => {
    const { el, sent } = await mountDialog();
    await el.openEdit("e", {
      id: "t1", name: "Floors", type: "cleaning", warning_days: 1, enabled: true,
      schedule_type: "weekdays", schedule: { kind: "weekdays", weekdays: [0, 3] }, schedule_time: "08:30",
    } as never);
    await el.updateComplete;
    await setToggle(el, false);
    expect(timeField(el), "picker hidden again").to.equal(null);
    const update = await saveAndRead(el, sent);
    expect("schedule_time" in update).to.be.true;
    expect(update.schedule_time).to.equal(null);
  });

  it("a ticked checkbox with an empty picker also sends null", async () => {
    const { el, sent } = await mountDialog();
    await el.openEdit("e", {
      id: "t1", name: "Floors", type: "cleaning", warning_days: 1, enabled: true,
      schedule_type: "time_based", interval_days: 7, schedule_time: "08:30",
    } as never);
    await el.updateComplete;
    timeField(el)!.dispatchEvent(new CustomEvent("value-changed", { detail: { value: "" } }));
    await el.updateComplete;
    const update = await saveAndRead(el, sent);
    expect(update.schedule_time).to.equal(null);
  });

  for (const [kind, extra] of [
    ["manual", {}],
    ["sensor_based", { trigger_config: { entity_id: "binary_sensor.filter", trigger_type: "state_change", to_state: "on" } }],
  ] as Array<[string, Record<string, unknown>]>) {
    it(`${kind}: no checkbox, no picker, schedule_time omitted (not nulled)`, async () => {
      const { el, sent } = await mountDialog();
      await el.openEdit("e", {
        id: "t1", name: "Filter", type: "cleaning", warning_days: 1, enabled: true,
        schedule_type: kind, ...extra,
      } as never);
      await el.updateComplete;
      expect(toggle(el), `no checkbox for ${kind}`).to.equal(null);
      expect(timeField(el), `no time picker for ${kind}`).to.equal(null);
      const update = await saveAndRead(el, sent);
      expect("schedule_time" in update, `schedule_time omitted for ${kind}`).to.be.false;
    });
  }
});
