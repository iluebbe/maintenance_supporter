/**
 * GitHub round 2026-11-19: the due-today text and {days_since} (#280, D#282,
 * D#283), the weekend's quiet hours (D#277), the to-do lists of an object and
 * of a person (#273).
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/task-dialog.js";
import "../components/object-dialog.js";
import "../components/settings-view.js";
import type { MaintenanceTaskDialog } from "../components/task-dialog";
import type { MaintenanceObjectDialog } from "../components/object-dialog";
import type { MaintenanceSettingsView } from "../components/settings-view";
import { DEFAULT_FEATURES, DEFAULT_SETTINGS_RESPONSE, createMockHass, type WsHandler } from "./_test-utils.js";
import { NOTIFICATION_TEXT_KINDS, NOTIFICATION_TEXT_PLACEHOLDERS } from "../helpers/notification-texts.js";
import { toggleWeekday } from "../helpers/weekday-chips.js";

const STATES = {
  "todo.garden": { entity_id: "todo.garden", state: "0", attributes: { friendly_name: "Garden" } },
  "todo.jane": { entity_id: "todo.jane", state: "0", attributes: { friendly_name: "Jane's list" } },
};

const baseTask = {
  id: "t1", name: "Hedge", type: "custom",
  schedule_type: "time_based", interval_days: 30, warning_days: 7, enabled: true,
};

async function mountTaskDialog(handlers: Record<string, WsHandler> = {}) {
  const { hass, sent } = createMockHass({ states: STATES, handlers: { "maintenance_supporter/task/update": () => ({}), ...handlers } });
  const el = await fixture<MaintenanceTaskDialog>(html`<maintenance-task-dialog .hass=${hass}></maintenance-task-dialog>`);
  await el.updateComplete;
  return { el, sent };
}

async function settle(el: { updateComplete: Promise<unknown> }): Promise<void> {
  await new Promise((r) => setTimeout(r, 30));
  await el.updateComplete;
}

describe("#280 / D#283 / D#282: the due date's own text", () => {
  it("sits between due soon and overdue, with {days_since} where a task was done before", () => {
    expect(NOTIFICATION_TEXT_KINDS.slice(0, 3)).to.deep.equal(["due_soon", "due_today", "overdue"]);
    expect(NOTIFICATION_TEXT_PLACEHOLDERS.due_today).to.deep.equal(["task", "object", "due", "days_since"]);
    expect(NOTIFICATION_TEXT_PLACEHOLDERS.overdue).to.include("days_since");
    expect(NOTIFICATION_TEXT_PLACEHOLDERS.completed).to.not.include("days_since");
  });

  it("says when the due-today text goes out and what {days_since} counts", async () => {
    const { el } = await mountTaskDialog();
    await el.openEdit("e", baseTask as never);
    (el as unknown as { _notifyTextsOpen: boolean })._notifyTextsOpen = true;
    await el.updateComplete;
    const block = el.shadowRoot!.querySelector('.notify-text[data-kind="due_today"]');
    expect(block !== null, "a due-today block").to.equal(true);
    const help = block!.querySelector(".field-help")!.textContent || "";
    expect(help).to.contain("once on the due date");
    expect(help).to.contain("{days_since}: days since the task was last done");
  });
});

describe("D#277: the weekend's quiet hours", () => {
  it("picks days in week order", () => {
    expect(toggleWeekday([5, 6], 4)).to.deep.equal([4, 5, 6]);
    expect(toggleWeekday([4, 5, 6], 6)).to.deep.equal([4, 5]);
  });

  it("shows the days and times once switched on, and saves a toggled day", async () => {
    const settings = {
      ...DEFAULT_SETTINGS_RESPONSE,
      general: { ...DEFAULT_SETTINGS_RESPONSE.general, notifications_enabled: true },
      notifications: { ...DEFAULT_SETTINGS_RESPONSE.notifications, quiet_hours_enabled: true, quiet_hours_weekend_enabled: true, quiet_hours_weekend_days: [5, 6] },
    };
    const { hass, sent } = createMockHass({ settingsResponse: settings as never, handlers: { "maintenance_supporter/global/update": () => settings } });
    const el = await fixture<MaintenanceSettingsView>(html`<maintenance-settings-view .hass=${hass} .features=${DEFAULT_FEATURES}></maintenance-settings-view>`);
    await settle(el);
    const chips = [...el.shadowRoot!.querySelectorAll(".quiet-weekend-days .weekday-chip")] as HTMLButtonElement[];
    expect(chips.length).to.equal(7);
    expect(chips.filter((c) => c.classList.contains("selected")).map((c) => c.dataset.day)).to.deep.equal(["5", "6"]);
    expect(el.shadowRoot!.querySelector(".quiet-weekend-start") !== null && el.shadowRoot!.querySelector(".quiet-weekend-end") !== null).to.equal(true);
    chips[4].click();
    await settle(el);
    const update = sent.filter((m) => m.type === "maintenance_supporter/global/update").pop() as { settings?: Record<string, unknown> } | undefined;
    expect(update?.settings?.quiet_hours_weekend_days).to.deep.equal([4, 5, 6]);
  });
});

describe("#273: to-do lists of an object and of a person", () => {
  it("are a row and a section of their own, naming the object's lists and the person's", async () => {
    const { el, sent } = await mountTaskDialog({
      "maintenance_supporter/object": () => ({ entry_id: "e", object: { name: "Garden", mirror_todo_entities: ["todo.garden"] }, tasks: [] }),
    });
    el.betaEditor = true;
    el.mirrorTodoDefault = ["todo.family"];
    el.todoPersonLists = { u1: "todo.jane" };
    await el.openEdit("e", { ...baseTask, responsible_user_id: "u1" } as never);
    await el.updateComplete;
    (el as unknown as { _ruleSel: string })._ruleSel = "todo";
    await settle(el);
    const root = el.shadowRoot!;
    const row = root.querySelector('.rule-row[data-row="todo"]');
    expect(row !== null, "a to-do row").to.equal(true);
    expect(row!.textContent).to.contain("Garden");
    expect(row!.textContent).to.contain("Jane's list");
    const choice = root.querySelector(".mirror-todo-choice")!.textContent || "";
    expect(choice).to.contain("This object's lists: Garden");
    expect(root.querySelector(".mirror-todo-people")!.textContent).to.contain("Jane's list");
    expect(sent.some((m) => m.type === "maintenance_supporter/object" && (m as { entry_id?: string }).entry_id === "e")).to.equal(true);
    const notifications = root.querySelector('.rule-row[data-row="notifications"]')!;
    expect(notifications.querySelectorAll(".rule-chip").length, "no list chips under notifications").to.equal(0);
  });

  it("the object dialog saves the lists for its tasks", async () => {
    const { hass, sent } = createMockHass({ states: STATES, handlers: { "maintenance_supporter/object/update": () => ({ success: true }) } });
    const el = await fixture<MaintenanceObjectDialog>(html`<maintenance-object-dialog .hass=${hass}></maintenance-object-dialog>`);
    el.openEdit("e", { name: "Garden", mirror_todo_entities: ["todo.garden"] } as never);
    await el.updateComplete;
    const form = el.shadowRoot!.querySelector("ha-form.object-mirror-todo") as unknown as { data: Record<string, unknown> } & HTMLElement;
    expect(form.data.mirror_todo_entities).to.deep.equal(["todo.garden"]);
    form.dispatchEvent(new CustomEvent("value-changed", { bubbles: true, composed: true, detail: { value: { mirror_todo_entities: ["todo.garden", "todo.jane", ""] } } }));
    await el.updateComplete;
    await (el as unknown as { _save: () => Promise<void> })._save();
    const msg = sent.find((m) => m.type === "maintenance_supporter/object/update") as { mirror_todo_entities?: string[] } | undefined;
    expect(msg?.mirror_todo_entities).to.deep.equal(["todo.garden", "todo.jane"]);
  });

  it("the settings name each person's own list", async () => {
    const { hass, sent } = createMockHass({
      states: STATES,
      handlers: {
        "maintenance_supporter/users/list": () => ({ users: [{ id: "u1", name: "Jane" }] }),
        "maintenance_supporter/global/update": () => DEFAULT_SETTINGS_RESPONSE,
      },
    });
    const el = await fixture<MaintenanceSettingsView>(html`<maintenance-settings-view .hass=${hass} .features=${DEFAULT_FEATURES}></maintenance-settings-view>`);
    await settle(el);
    const row = el.shadowRoot!.querySelector('.todo-person-list[data-user="u1"]');
    expect(row !== null, "a row per person").to.equal(true);
    const select = row!.querySelector("select") as HTMLSelectElement;
    select.value = "todo.jane";
    select.dispatchEvent(new Event("change"));
    await settle(el);
    const update = sent.filter((m) => m.type === "maintenance_supporter/global/update").pop() as { settings?: Record<string, unknown> } | undefined;
    expect(update?.settings?.todo_person_lists).to.deep.equal({ u1: "todo.jane" });
  });
});

describe("D#284: a rotation by weekday", () => {
  it("moves a day between people and names the days nobody has", async () => {
    const { cleanWeekdays, toggleWeekdayOwner, unassignedDays, restLine } = await import("../helpers/rotation-turns.js");
    const days = cleanWeekdays(["u1", "bob", null, "u2"], ["u1", "u2"]);
    expect(days).to.deep.equal(["u1", null, null, "u2", null, null, null]);
    const moved = toggleWeekdayOwner(days, 0, "u2");
    expect(moved[0]).to.equal("u2");
    expect(toggleWeekdayOwner(moved, 0, "u2")[0], "a second click frees the day").to.equal(null);
    expect(unassignedDays(days)).to.deep.equal([1, 2, 4, 5, 6]);
    expect(restLine(["u1", "u1", "u1", "u1", "u1", null, null], "en")).to.match(/^Sat, Sun: anyone/);
  });

  it("the editor sets each person's days and saves them", async () => {
    const { el, sent } = await mountTaskDialog();
    await el.openEdit("e", { ...baseTask, assignee_pool: ["u1", "u2"], rotation_strategy: "by_weekday", weekday_assignees: ["u1", null, null, null, null, null, null] } as never);
    (el as unknown as { _availableUsers: Array<{ id: string; name: string }> })._availableUsers = [{ id: "u1", name: "Jane" }, { id: "u2", name: "John" }];
    await el.updateComplete;
    const root = el.shadowRoot!;
    expect(root.querySelector(".weekday-responsible") !== null, "no responsible picker: the weekday decides").to.equal(true);
    const rows = [...root.querySelectorAll(".weekday-rotation-row")] as HTMLElement[];
    expect(rows.map((r) => r.dataset.user)).to.deep.equal(["u1", "u2"]);
    const johnsTuesday = rows[1].querySelector('.weekday-chip[data-day="1"]') as HTMLButtonElement;
    johnsTuesday.click();
    await el.updateComplete;
    expect(root.querySelector(".weekday-rotation-rest")!.textContent).to.contain("anyone");
    await (el as unknown as { _save: () => Promise<void> })._save();
    const msg = sent.find((m) => m.type === "maintenance_supporter/task/update") as { weekday_assignees?: unknown; rotation_strategy?: string } | undefined;
    expect(msg?.rotation_strategy).to.equal("by_weekday");
    expect(msg?.weekday_assignees).to.deep.equal(["u1", "u2", null, null, null, null, null]);
  });

  it("the task page lists the coming turns", async () => {
    const { renderUpcomingTurns } = await import("../helpers/rotation-turns.js");
    const { render } = await import("lit");
    const host = document.createElement("div");
    render(renderUpcomingTurns([{ date: "2026-11-20", user_id: "u1" }, { date: "2026-11-21", user_id: null }], "en", undefined, (id) => (id === "u1" ? "Jane" : null)), host);
    const turns = [...host.querySelectorAll(".upcoming-turn")];
    expect(turns.map((n) => n.querySelector(".upcoming-turn-name")!.textContent)).to.deep.equal(["Jane", "anyone"]);
    expect(host.querySelector(".upcoming-turns-label")!.textContent).to.equal("Next turns");
    // With a rotation by weekday the weekday is the point: "Fri, Nov 20".
    expect(turns.map((n) => n.querySelector(".upcoming-turn-date")!.textContent)).to.deep.equal(["Fri, Nov 20", "Sat, Nov 21"]);
    const de = document.createElement("div");
    render(renderUpcomingTurns([{ date: "2026-11-20", user_id: "u1" }, { date: "2026-11-21", user_id: "u1" }], "de", undefined, () => "Jane"), de);
    expect(de.querySelector(".upcoming-turn-date")!.textContent).to.match(/^Fr\.?, 20\. Nov/);
  });

  it("the calendar names each coming date's person and filters by it", async () => {
    const { buildCalendarBuckets } = await import("../helpers/calendar-bucket.js");
    const task = {
      id: "t1", name: "Feed the cat", enabled: true, status: "due_soon", schedule_type: "time_based", interval_days: 1, interval_unit: "days",
      next_due: "2026-11-20", days_until_due: 0, assignee_pool: ["u1", "u2"], rotation_strategy: "by_weekday", responsible_user_id: "u1",
      upcoming_turns: [{ date: "2026-11-20", user_id: "u1" }, { date: "2026-11-21", user_id: "u2" }, { date: "2026-11-22", user_id: null }],
      history: [],
    };
    const objects = [{ entry_id: "e", object: { name: "Home" }, tasks: [task] }] as never;
    const all = buildCalendarBuckets(objects, "2026-11-20", 7).flatMap((b) => b.events);
    expect(all.slice(0, 3).map((ev) => ev.responsible_user_id)).to.deep.equal(["u1", "u2", null]);
    const johns = buildCalendarBuckets(objects, "2026-11-20", 7, "u2").flatMap((b) => b.events.map((ev) => ev.date));
    expect(johns.slice(0, 2), "his turn and the day nobody has").to.deep.equal(["2026-11-21", "2026-11-22"]);
  });

  // The calendar drew a task five times and then dropped the other person's
  // dates: of a daily task, John (every third day) saw one or two days.
  it("under a person's filter the cap of five counts that person's dates", async () => {
    const { buildCalendarBuckets, MAX_OCCURRENCES_PER_TASK } = await import("../helpers/calendar-bucket.js");
    const { addDaysIso } = await import("../helpers/ha-time.js");
    const day = (i: number): string => addDaysIso("2026-11-20", i);
    const task = {
      id: "t1", name: "Feed the cat", enabled: true, status: "due_soon", schedule_type: "time_based", interval_days: 1, interval_unit: "days",
      next_due: day(0), days_until_due: 0, assignee_pool: ["u1", "u2"], rotation_strategy: "by_weekday", responsible_user_id: "u1",
      upcoming_turns: Array.from({ length: 15 }, (_, i) => ({ date: day(i), user_id: i % 3 === 2 ? "u2" : "u1" })),
      history: [],
    };
    const objects = [{ entry_id: "e", object: { name: "Home" }, tasks: [task] }] as never;
    const dates = (user: string | null, window = 30): string[] =>
      buildCalendarBuckets(objects, day(0), window, user).flatMap((b) => b.events.map((ev) => ev.date));
    expect(dates(null), "everybody's view keeps its five").to.deep.equal([0, 1, 2, 3, 4].map(day));
    expect(dates("u2"), "John's own five, not the one among the first five").to.deep.equal([2, 5, 8, 11, 14].map(day));
    expect(dates("u1"), "Jane's first five, no more").to.deep.equal([0, 1, 3, 4, 6].map(day));
    expect(dates("u1").length).to.equal(MAX_OCCURRENCES_PER_TASK);
    expect(dates("u2", 7), "the window still ends it").to.deep.equal([2, 5].map(day));
    expect(dates("u3"), "not on the rota: none of the named dates").to.deep.equal([]);
  });

  it("the calendar draws a rotation's dates as the server gives them", async () => {
    const { buildCalendarBuckets } = await import("../helpers/calendar-bucket.js");
    // A monthly task: stepping 30 days from the due date misses the real dates
    // (and with them their people).
    const task = {
      id: "t1", name: "Clean the stairs", enabled: true, status: "ok", schedule_type: "time_based", interval_days: 1, interval_unit: "months",
      next_due: "2026-11-30", days_until_due: 10, assignee_pool: ["u1", "u2"], rotation_strategy: "round_robin", responsible_user_id: "u1",
      upcoming_turns: [{ date: "2026-11-30", user_id: "u1" }, { date: "2026-12-30", user_id: "u2" }, { date: "2027-01-30", user_id: "u1" }],
      history: [],
    };
    const objects = [{ entry_id: "e", object: { name: "Home" }, tasks: [task] }] as never;
    const events = buildCalendarBuckets(objects, "2026-11-20", 365).flatMap((b) => b.events.map((ev) => `${ev.date} ${ev.responsible_user_id}`));
    expect(events).to.deep.equal(["2026-11-30 u1", "2026-12-30 u2", "2027-01-30 u1"]);
  });

  it("the task page lists six turns however many the server sends", async () => {
    const { renderUpcomingTurns, SHOWN_TURNS } = await import("../helpers/rotation-turns.js");
    const { addDaysIso } = await import("../helpers/ha-time.js");
    const { render } = await import("lit");
    const host = document.createElement("div");
    const turns = Array.from({ length: 20 }, (_, i) => ({ date: addDaysIso("2026-11-20", i), user_id: "u1" }));
    render(renderUpcomingTurns(turns, "en", undefined, () => "Jane"), host);
    expect(SHOWN_TURNS).to.equal(6);
    expect([...host.querySelectorAll(".upcoming-turn")].map((n) => n.getAttribute("data-date"))).to.deep.equal(turns.slice(0, 6).map((turn) => turn.date));
  });
});

describe("D#275: nothing happened for N days", () => {
  it("round-trips its days and kind, and reads as a sentence", async () => {
    const { typeFieldsFromConfig, configFromTypeFields } = await import("../helpers/trigger-fields.js");
    const { triggerSentence, ADD_TRIGGER_TYPES, TRIGGER_ICONS } = await import("../helpers/task-rules.js");
    const unavailable = { type: "idle", trigger_idle_days: 7, trigger_idle_mode: "unavailable" } as const;
    const fields = typeFieldsFromConfig(unavailable as never);
    expect([fields.idleDays, fields.idleMode]).to.deep.equal(["7", "unavailable"]);
    expect(configFromTypeFields(fields)).to.deep.equal(unavailable);
    const quiet = configFromTypeFields({ ...fields, idleMode: "no_change", idleDays: "14" });
    expect(quiet).to.deep.equal({ type: "idle", trigger_idle_days: 14 }, "no change is the default, stored as absence");
    expect(ADD_TRIGGER_TYPES).to.include("idle");
    expect(TRIGGER_ICONS.idle).to.equal("mdi:sleep");
    const draft = { trigger: fields, triggerEntityIds: ["binary_sensor.shed_latch"], triggerUnit: null } as never;
    expect(triggerSentence(draft, "en")).to.contain("unavailable for 7 days");
  });
});
