/**
 * DRY audit round 7 (2026-11-07): copies of one rule that behaved differently.
 *
 * FE7-A1  the panel's rows, the quick actions and the task page offered
 *         Complete / Skip / Reset on a paused or switched-off task; the card
 *         did not (isInertTask), and the server refuses them.
 * FE7-A2  the trace labelled allow_skip "Don't allow skipping" with the
 *         stored value (it read the other way round) and named
 *         notify_enabled, required_completion_fields and entity_slug "other
 *         settings".
 * FE7-A3  the trace's values dropped what a schedule, a Done-when rule and a
 *         sensor rule say beyond their kind: "One-time → One-time".
 * FE7-A4  the editor's schedule row left out the months, the last business
 *         day and the shift of a calendar pattern.
 * FE7-A5  a rotation read as its storage key ("round_robin").
 * FE7-A6  "Trigger ended" named the sensor by its id and the value without
 *         its unit.
 *
 * And the copies that still agreed (B), now one rule each:
 * FE7-B1  the editor's sensor rule row is the stored rule's sentence
 *         (task-rules.test.ts).
 * FE7-B4  a reading with its unit, the way Home Assistant writes a state.
 * FE7-B5  the mirror lists the save sends and the ones the editor shows.
 * FE7-B6  a card's watch of the page's objects.
 */

import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import "../components/task-quick-actions-dialog.js";
import "../components/task-dialog.js";
import type { MaintenanceTaskDialog } from "../components/task-dialog";
import type { MaintenanceTaskQuickActionsDialog } from "../components/task-quick-actions-dialog";
import { buildCycles, changeDetails, editedFieldsText, eventItem, type ChangeContext } from "../helpers/task-trace.js";
import { scheduleSentence, type RuleDraft } from "../helpers/task-rules.js";
import { invalidateSettingsCache } from "../helpers/settings-cache.js";
import { compoundLogic } from "../helpers/trigger-entities.js";
import { emptyTypeFields } from "../helpers/trigger-fields.js";
import { triggerValueText } from "../helpers/trigger-value.js";
import { fmtVal } from "../renderers/chart-utils.js";
import { formatQty, withUnit } from "../styles.js";
import { mirrorChoice } from "../helpers/mirror-lists.js";
import { ObjectsFollower } from "../helpers/objects-hub.js";
import { DEFAULT_SETTINGS_RESPONSE, createMockHass } from "./_test-utils.js";
import { mountPanel, obj, resetTaskSeq, sr, task } from "./_panel-utils.js";

const ACTIONS = ".row-actions ha-button, .row-actions .row-icon-btn";

describe("FE7-A1: nothing to do on a paused or switched-off task", () => {
  beforeEach(() => {
    resetTaskSeq();
    localStorage.clear();
    invalidateSettingsCache();
  });

  it("the panel's rows offer no Complete or Skip, like the card", async () => {
    localStorage.setItem("msp-overview-tab", "dashboard");
    const tasks = [
      task({ name: "Clean the filter" }),
      task({ name: "Paused task", status: "paused", paused: true }),
      task({ name: "Switched off", enabled: false }),
    ];
    const { el } = await mountPanel([obj("e1", tasks, "Pump")]);
    const rowSel = ".task-row:not(.virt-sizer)";
    await waitUntil(() => sr(el).querySelectorAll(rowSel).length >= 3, "three rows");
    const row = (name: string) => [...sr(el).querySelectorAll(rowSel)].find((r) => r.textContent!.includes(name))!;
    expect(!!row("Clean the filter").querySelector(ACTIONS)).to.equal(true);
    expect(!!row("Paused task").querySelector(ACTIONS), "paused").to.equal(false);
    expect(!!row("Switched off").querySelector(ACTIONS), "switched off").to.equal(false);
    expect(!!row("Switched off").querySelector(".badge-disabled"), "the badge says why").to.equal(true);
  });

  async function quickActions(over: Record<string, unknown>) {
    const wire = {
      id: "t1", name: "Filter", type: "custom", schedule_type: "time_based", interval_days: 30, warning_days: 7,
      status: "ok", enabled: true, archived: false, is_done: false, days_until_due: 10, next_due: "2026-10-10",
      last_performed: null, trigger_active: false, times_performed: 0, total_cost: 0, average_duration: null,
      history: [], checklist: [], ...over,
    };
    const { hass } = createMockHass({
      settingsResponse: DEFAULT_SETTINGS_RESPONSE as never,
      handlers: { "maintenance_supporter/object": () => ({ entry_id: "e1", object: { id: "o1", name: "Pump" }, tasks: [wire] }) },
    });
    (hass as Record<string, unknown>).user = { id: "admin", is_admin: true };
    const el = await fixture<MaintenanceTaskQuickActionsDialog>(html`<maintenance-task-quick-actions-dialog .hass=${hass}></maintenance-task-quick-actions-dialog>`);
    await el.openFor("e1", "t1");
    await el.updateComplete;
    return el;
  }

  it("the quick actions keep Complete, Skip and Reset for a live task only", async () => {
    const live = await quickActions({});
    expect(!!live.shadowRoot!.querySelector(".primary-row")).to.equal(true);
    const paused = await quickActions({ status: "paused", paused: true });
    expect(!!paused.shadowRoot!.querySelector(".primary-row"), "paused").to.equal(false);
    expect(!!paused.shadowRoot!.querySelector(".qa-qr"), "the QR code stays").to.equal(true);
    const off = await quickActions({ enabled: false });
    expect(!!off.shadowRoot!.querySelector(".primary-row"), "switched off").to.equal(false);
  });
});

const ctx: ChangeContext = {
  lang: "en",
  entityName: (id) => ({ "sensor.tank": "Water tank", "binary_sensor.door": "Washer door" })[id] ?? id,
  userName: () => null,
};

describe("FE7-A2: the trace names every field the dialog names, the right way round", () => {
  it("allow_skip and notify_enabled read as the dialog asks them", () => {
    const rows = changeDetails({ allow_skip: [true, false], notify_enabled: [true, false] }, ctx);
    expect(rows).to.deep.equal([
      { label: "Don't allow skipping", value: "✗ → ✓" },
      { label: "No notifications for this task", value: "✗ → ✓" },
    ]);
  });

  it("required fields and the entity name have labels of their own", () => {
    expect(editedFieldsText(["required_completion_fields", "entity_slug"], "en")).to.equal("Require on completion, Entity ID");
    const [row] = changeDetails({ required_completion_fields: [[], ["notes", "photo"]] }, ctx);
    expect(row.value).to.equal("— → Notes, Photo");
  });
});

describe("FE7-A3: a value says what changed beyond its kind", () => {
  it("a one-time task's new date", () => {
    const [row] = changeDetails({ schedule: [{ kind: "one_time", due_date: "2026-11-10" }, { kind: "one_time", due_date: "2026-11-20" }] }, ctx);
    const [before, after] = row.value.split(" → ");
    expect(before).to.not.equal(after);
    expect(after).to.contain("20");
  });

  it("an interval counted from the planned date, a season, an end", () => {
    const [row] = changeDetails({
      schedule: [{ kind: "interval", every: 30 }, { kind: "interval", every: 30, anchor: "planned", season_months: [4, 5], ends: { count: 5 } }],
    }, ctx);
    const after = row.value.split(" → ")[1];
    expect(after).to.contain("From planned date");
    expect(after).to.contain("Seasonal window");
    expect(after).to.contain("Number of times: 5");
  });

  it("Done when: how long the state holds and whether it counts any time", () => {
    const [row] = changeDetails({
      complete_when: [{ entity_id: "binary_sensor.door", to_state: "off" }, { entity_id: "binary_sensor.door", to_state: "off", for_minutes: 5, any_time: true }],
    }, ctx);
    expect(row.value).to.equal("Washer door → off → Washer door → off for 5 min, also when not due");
  });

  it("a sensor rule's end, and a compound's logic in any case", () => {
    const rule = { type: "threshold", entity_id: "sensor.tank", trigger_below: 10 };
    const [row] = changeDetails({ trigger_config: [rule, { ...rule, auto_complete_on_recovery: true }] }, ctx);
    const [before, after] = row.value.split(" → ");
    expect(before).to.not.equal(after);
    expect(after).to.contain("Record the task as done");
    const [hold] = changeDetails({ trigger_config: [rule, { ...rule, trigger_hold_until_done: true }] }, ctx);
    expect(hold.value.split(" → ")[1]).to.contain("Keep the task triggered until it is done");
    const anyOf = changeDetails({ trigger_config: [null, { type: "compound", compound_logic: "or", conditions: [rule, rule] }] }, ctx)[0];
    expect(anyOf.value).to.contain("Any condition applies (2)");
  });
});

describe("FE7-A5: a rotation by its name", () => {
  it("round_robin reads as the dialog's option", () => {
    const [row] = changeDetails({ rotation_strategy: [null, "round_robin"] }, ctx);
    expect(row.value).to.equal("— → Round-robin");
  });
});

describe("FE7-A6: Trigger ended names the sensor and the value's unit", () => {
  it("as the history does", () => {
    const item = eventItem({ at: "2026-11-07T10:00:00+00:00", kind: "trigger_cleared", entity: "sensor.tank", value: 80 }, "en", {
      triggerUnit: "%",
      entityName: ctx.entityName,
    });
    expect(item.text).to.equal("Trigger ended at 80%");
    expect(item.details[0].value).to.equal("Water tank");
  });

  it("buildCycles hands the names down", () => {
    const [cycle] = buildCycles([{ at: "2026-11-07T10:00:00+00:00", kind: "trigger_cleared", entity: "sensor.tank", value: 80 }], [], "en", {
      triggerUnit: "%",
      entityName: ctx.entityName,
    });
    expect(cycle.items[0].details[0].value).to.equal("Water tank");
  });
});

function draft(over: Partial<RuleDraft>): RuleDraft {
  return {
    name: "", enabled: true, typeLabel: "", scheduleType: "day_of_month", intervalDays: "", intervalUnit: "days", intervalAnchor: "completion",
    dueDate: "", weekdays: [], nth: "1", nthWeekday: "5", domDay: "1", domLastDay: false, calendarEntity: "", warningDays: "7",
    trigger: emptyTypeFields(), triggerEntityIds: [], triggerCombinator: "any", entityLogic: "any",
    compoundLogic: "AND", compoundCount: 0, compoundEntityIds: [], completeWhenEntity: "", completeWhenState: "", completeWhenFor: "",
    completeWhenAnyTime: false, quickOn: false, requiredCount: 0, allowSkip: true, requireTagScan: false, checklistCount: 0, partsCount: 0,
    responsibleUserId: null, pool: [], rotation: "", notifyEnabled: true, mirrorLists: [],
    ...over,
  };
}

describe("FE7-A4: the editor's schedule row says what the recurrence says", () => {
  it("the months a pattern keeps to, the last business day, the shift", () => {
    expect(scheduleSentence(draft({ domDay: "1", calMonths: [9] }), "en")).to.equal("Day of month: 1 · Sep");
    expect(scheduleSentence(draft({ domLastDay: true, domBusiness: true }), "en")).to.equal("Day of month: Last business day");
    expect(scheduleSentence(draft({ scheduleType: "weekdays", weekdays: [0, 3], calOffset: "2" }), "en")).to.contain("+2d");
    expect(scheduleSentence(draft({ scheduleType: "nth_weekday", nth: "1", nthWeekday: "5", calMonths: [3, 9], calOffset: "-1" }), "en")).to.contain("−1d · Mar, Sep");
  });
});

describe("FE7-B2: a compound's logic read as the backend reads it", () => {
  it("any case, AND unless it says otherwise; a legacy operator is not read (bug audit 2026-11-08, E8-8)", () => {
    expect(compoundLogic({ compound_logic: "or" } as never)).to.equal("OR");
    expect(compoundLogic({ compound_logic: "and" } as never)).to.equal("AND");
    expect(compoundLogic({})).to.equal("AND");
    expect(compoundLogic({ operator: "OR" } as never)).to.equal("AND");
    expect(compoundLogic(null)).to.equal("AND");
  });
});

describe("FE7-B4: a reading with its unit, the way Home Assistant writes a state", () => {
  it("a firing's value, the chart's tooltip, a quantity and the trace agree", () => {
    const firing = { trigger_value: 58 } as never;
    expect(triggerValueText(firing, "en", { unit: "%" })).to.equal("Trigger value: 58%");
    expect(triggerValueText(firing, "de", { unit: "%" })).to.match(/58 %$/);
    expect(triggerValueText(firing, "en", { unit: "km" })).to.equal("Trigger value: 58 km");
    expect(fmtVal(58, "%", "en")).to.equal("58%");
    expect(fmtVal(21, "°", "en")).to.equal("21°");
    expect(formatQty(3, "%", "en")).to.equal("3%");
    const ended = eventItem({ at: "2026-11-07T10:00:00+00:00", kind: "trigger_cleared", entity: "sensor.tank", value: 58 }, "en", { triggerUnit: "%" });
    expect(ended.text).to.equal("Trigger ended at 58%");
    expect(withUnit("58", "%", "fr")).to.equal("58 %");
    expect(withUnit("58", "", "en")).to.equal("58");
  });
});

describe("FE7-B5: the mirror lists the save sends are the ones the editor shows", () => {
  const hass = { entities: { "todo.maintenance": { platform: "maintenance_supporter" } } } as never;

  it("default lists, own lists, none", () => {
    expect(mirrorChoice(hass, "default", ["todo.house"], ["todo.shop"])).to.deep.equal({ entities: [], useDefault: true, lists: ["todo.house"] });
    expect(mirrorChoice(hass, "own", ["todo.house"], ["todo.shop"])).to.deep.equal({ entities: ["todo.shop"], useDefault: false, lists: ["todo.shop"] });
    expect(mirrorChoice(hass, "none", ["todo.house"], ["todo.shop"])).to.deep.equal({ entities: [], useDefault: false, lists: [] });
  });

  it("the row leaves out what the save leaves out: our own list, more than the cap", () => {
    const own = ["todo.maintenance", "todo.a", "todo.b", "todo.c", "todo.d", "todo.e", "todo.f"];
    const choice = mirrorChoice(hass, "own", ["todo.house"], own);
    expect(choice.lists).to.deep.equal(["todo.a", "todo.b", "todo.c", "todo.d", "todo.e"]);
    expect(choice.lists).to.deep.equal(choice.entities);
  });

  it("without default lists there is no choice: the task's own lists, an earlier opt-out stays", () => {
    expect(mirrorChoice(hass, "default", [], ["todo.shop"])).to.deep.equal({ entities: ["todo.shop"], useDefault: true, lists: ["todo.shop"] });
    expect(mirrorChoice(hass, "none", [], [])).to.deep.equal({ entities: [], useDefault: false, lists: [] });
  });
});

describe("FE7-B1 / FE7-B5 in the editor", () => {
  async function editTask(task: Record<string, unknown>, states: Record<string, unknown> = {}, entities: Record<string, unknown> = {}) {
    const mock = createMockHass({ states });
    (mock.hass as unknown as { entities: unknown }).entities = entities;
    const el = await fixture<MaintenanceTaskDialog>(html`<maintenance-task-dialog .hass=${mock.hass} .betaEditor=${true}></maintenance-task-dialog>`);
    await el.openEdit("e1", { id: "t1", name: "Tank", type: "cleaning", warning_days: 7, enabled: true, ...task } as never);
    await el.updateComplete;
    return { el, root: el.shadowRoot!, sent: mock.sent };
  }

  it("the sensor rule row says the limit with the sensor's unit, like the task page", async () => {
    const { root } = await editTask(
      { schedule_type: "sensor_based", trigger_config: { type: "threshold", entity_id: "sensor.tank", trigger_below: 60 } },
      { "sensor.tank": { state: "58", attributes: { unit_of_measurement: "%", friendly_name: "Water tank" } } },
    );
    expect(root.querySelector('.rule-row[data-row="trigger"] .rule-sentence')?.textContent?.trim()).to.equal("below 60%");
  });

  it("the notifications row names the lists the save sends", async () => {
    const { el, root, sent } = await editTask(
      { schedule_type: "time_based", interval_days: 30, mirror_todo_entities: ["todo.maintenance", "todo.house"] },
      { "todo.house": { state: "0", attributes: { friendly_name: "Household" } } },
      { "todo.maintenance": { platform: "maintenance_supporter" }, "todo.house": { platform: "local_todo" } },
    );
    const chips = [...root.querySelectorAll('.rule-row[data-row="notifications"] .rule-chip')].map((c) => c.textContent?.trim());
    expect(chips).to.deep.equal(["Household"]);
    await (el as unknown as { _save(): Promise<void> })._save();
    const save = [...sent].reverse().find((m) => m.type === "maintenance_supporter/task/update") as Record<string, unknown> | undefined;
    expect(save?.mirror_todo_entities).to.deep.equal(["todo.house"]);
  });
});

describe("FE7-B6: a card's watch of the page's objects", () => {
  function connection(log: string[]) {
    return {
      sendMessagePromise: () => Promise.resolve({}) as never,
      subscribeMessage: () => {
        log.push("subscribe");
        return Promise.resolve(() => log.push("unsubscribe"));
      },
    };
  }

  it("loads, then watches; a new connection watches first; the same one does nothing", () => {
    const log: string[] = [];
    const follow = new ObjectsFollower(() => undefined, () => log.push("load"));
    expect(follow.started).to.equal(false);
    const first = connection(log);
    follow.sync(first);
    expect(log).to.deep.equal(["load", "subscribe"]);
    expect(follow.started).to.equal(true);
    follow.sync(first);
    expect(log).to.deep.equal(["load", "subscribe"]);
    follow.sync(connection(log));
    expect(log).to.deep.equal(["load", "subscribe", "subscribe", "load"]);
    follow.stop();
    expect(follow.started).to.equal(false);
  });

  it("hands the subscription's events to the card", async () => {
    let push: ((event: unknown) => void) | null = null;
    const conn = {
      sendMessagePromise: () => Promise.resolve({}) as never,
      subscribeMessage: (cb: (event: unknown) => void) => {
        push = cb;
        return Promise.resolve(() => undefined);
      },
    };
    const seen: unknown[] = [];
    const follow = new ObjectsFollower((event) => seen.push(event), () => undefined);
    follow.sync(conn);
    push!({ objects: [] });
    expect(seen).to.have.length(1);
    follow.stop();
    push!({ objects: [] });
    expect(seen).to.have.length(1);
  });
});
