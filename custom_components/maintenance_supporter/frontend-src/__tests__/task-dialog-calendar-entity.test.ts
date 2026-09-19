/**
 * Lit component tests for the `calendar` recurrence kind (#187 / D#157) in
 * <maintenance-task-dialog>: a task driven by a HA calendar entity, once per
 * event. Sibling of task-dialog-calendar-kinds.test.ts.
 *
 * Pins the UI side of the WS contract (backend: test_schedule_calendar_entity.py
 * + test_calendar_entity_prefetch.py): hydration from the nested `schedule`,
 * the outgoing `schedule` payload, the entity picker (an <ha-form> entity
 * selector restricted to the calendar domain — never a bare
 * <ha-entity-picker>, see dialog-no-lazy-load-elements.test.ts), the
 * required-entity guard and the preview request.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/task-dialog.js";
import type { MaintenanceTaskDialog } from "../components/task-dialog";
import { formatRecurrence } from "../styles";
import { type SentMessage, createMockHass } from "./_test-utils.js";

async function mountDialog(): Promise<{ el: MaintenanceTaskDialog; sent: SentMessage[] }> {
  const { hass, sent } = createMockHass({
    handlers: {
      "maintenance_supporter/task/create": () => ({ task_id: "new1" }),
      "maintenance_supporter/task/update": () => ({}),
      "maintenance_supporter/schedule/preview": () => ({ occurrences: ["2026-09-22", "2026-10-06"], series_ended: false }),
    },
  });
  const el = await fixture<MaintenanceTaskDialog>(html`
    <maintenance-task-dialog .hass=${hass}></maintenance-task-dialog>
  `);
  await el.updateComplete;
  return { el, sent };
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

describe("task-dialog calendar entity kind (#187)", () => {
  it("offers the kind in the schedule-type select", async () => {
    const { el } = await mountDialog();
    await el.openCreate("e");
    await el.updateComplete;
    const options = [...el.shadowRoot!.querySelectorAll<HTMLOptionElement>("option")].map((o) => o.value);
    expect(options).to.include("calendar");
  });

  it("hydrates the entity and offset from the nested schedule on openEdit", async () => {
    const { el } = await mountDialog();
    await el.openEdit("e", {
      id: "t1", name: "Bins out", type: "custom",
      schedule_type: "calendar", warning_days: 1, enabled: true,
      schedule: { kind: "calendar", entity_id: "calendar.bio_waste", offset: -1 },
    } as any);
    await el.updateComplete;
    expect((el as any)._scheduleType).to.equal("calendar");
    expect((el as any)._calendarEntity).to.equal("calendar.bio_waste");
    expect((el as any)._calOffset).to.equal("-1");
  });

  it("renders an <ha-form> entity selector restricted to the calendar domain (no ha-entity-picker)", async () => {
    const { el } = await mountDialog();
    await el.openCreate("e");
    (el as any)._scheduleType = "calendar";
    await el.updateComplete;
    const form = el.shadowRoot!.querySelector<HTMLElement & { schema: any[] }>("ha-form.calendar-entity-form");
    expect(form, "calendar entity ha-form").to.exist;
    expect(form!.schema[0].selector).to.deep.equal({ entity: { domain: "calendar" } });
    expect(el.shadowRoot!.querySelector("ha-entity-picker")).to.equal(null);
  });

  it("picking a calendar in the form updates the state", async () => {
    const { el } = await mountDialog();
    await el.openCreate("e");
    (el as any)._scheduleType = "calendar";
    await el.updateComplete;
    const form = el.shadowRoot!.querySelector("ha-form.calendar-entity-form")!;
    form.dispatchEvent(new CustomEvent("value-changed", { detail: { value: { calendar_entity: " calendar.paper " } } }));
    expect((el as any)._calendarEntity).to.equal("calendar.paper");
  });

  it("create sends the nested calendar schedule with the offset", async () => {
    const { el, sent } = await mountDialog();
    await el.openCreate("e");
    (el as any)._name = "Bins out";
    (el as any)._scheduleType = "calendar";
    (el as any)._calendarEntity = "calendar.bio_waste";
    (el as any)._calOffset = "-1";
    await (el as any)._save();
    const msg = sent.find((m) => m.type === "maintenance_supporter/task/create") as any;
    expect(msg, "create message sent").to.exist;
    expect(msg.schedule).to.deep.equal({ kind: "calendar", entity_id: "calendar.bio_waste", offset: -1 });
    expect(msg.interval_days).to.equal(null);
  });

  it("refuses to save without a calendar entity", async () => {
    const { el, sent } = await mountDialog();
    await el.openCreate("e");
    (el as any)._name = "Bins out";
    (el as any)._scheduleType = "calendar";
    (el as any)._calendarEntity = "";
    await (el as any)._save();
    expect(sent.find((m) => m.type === "maintenance_supporter/task/create")).to.equal(undefined);
    expect((el as any)._error).to.equal("Choose a calendar entity.");
  });

  it("asks the backend preview for the calendar schedule once an entity is picked", async () => {
    const { el, sent } = await mountDialog();
    await el.openCreate("e");
    (el as any)._scheduleType = "calendar";
    await el.updateComplete;
    await wait(400);
    expect(sent.filter((m) => m.type === "maintenance_supporter/schedule/preview")).to.have.lengthOf(0);
    (el as any)._calendarEntity = "calendar.bio_waste";
    await el.updateComplete;
    await wait(400);
    const req = sent.find((m) => m.type === "maintenance_supporter/schedule/preview") as any;
    expect(req, "preview requested").to.exist;
    expect(req.schedule).to.deep.equal({ kind: "calendar", entity_id: "calendar.bio_waste" });
    expect((el as any)._schedulePreview).to.deep.equal(["2026-09-22", "2026-10-06"]);
  });

  it("formatRecurrence labels the kind with the calendar's name, falling back to the entity_id", () => {
    expect(formatRecurrence({ schedule: { kind: "calendar", entity_id: "calendar.bio_waste" }, schedule_entity_name: "Bio waste" }, "en"))
      .to.equal("Calendar: Bio waste");
    expect(formatRecurrence({ schedule: { kind: "calendar", entity_id: "calendar.bio_waste", offset: -1 } }, "en"))
      .to.equal("Calendar: calendar.bio_waste −1d");
  });
});
