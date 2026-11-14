/**
 * The beta task editor's rule rows (2026-10): every schedule kind and every
 * sensor rule reads as one sentence, the add picker offers what fits the
 * current rules (and says what a choice does to them), and a device's
 * entities suggest the rules that fit them.
 */

import { expect } from "@open-wc/testing";
import {
  buildRuleRows,
  deviceEntityFacts,
  ruleChoices,
  scheduleSentence,
  suggestionsFor,
  triggerSentence,
  type RuleDraft,
} from "../helpers/task-rules";
import { emptyTypeFields, type TriggerTypeFields } from "../helpers/trigger-fields";

const rule = (fields: Partial<TriggerTypeFields>): TriggerTypeFields => ({ ...emptyTypeFields(), ...fields });

function draft(over: Partial<RuleDraft> = {}): RuleDraft {
  return {
    name: "Clean the drum filter", enabled: true, typeLabel: "Cleaning",
    scheduleType: "time_based", intervalDays: "30", intervalUnit: "days", intervalAnchor: "completion",
    dueDate: "", weekdays: [], nth: "1", nthWeekday: "5", domDay: "1", domLastDay: false, calendarEntity: "",
    warningDays: "7",
    trigger: emptyTypeFields(), triggerEntityIds: [],
    triggerCombinator: "any", entityLogic: "any", compoundLogic: "AND", compoundCount: 0, compoundEntityIds: [],
    completeWhenEntity: "", completeWhenState: "", completeWhenFor: "", completeWhenAnyTime: false,
    quickOn: false, requiredCount: 0, allowSkip: true, requireTagScan: false, checklistCount: 0, partsCount: 0,
    responsibleUserId: null, pool: [], rotation: "", notifyEnabled: true, mirrorLists: [],
    ...over,
  };
}

const ctx = {
  lang: "en",
  entityName: (id: string) => ({ "sensor.washes": "Total washes", "binary_sensor.door": "Door", "todo.house": "Household" } as Record<string, string>)[id] ?? id,
  userName: (id: string) => ({ u1: "Mirko", u2: "Petra" } as Record<string, string>)[id] ?? id,
};

describe("beta editor: schedule sentences", () => {
  it("reads every schedule kind", () => {
    expect(scheduleSentence(draft(), "en")).to.equal("Every 30 days");
    expect(scheduleSentence(draft({ intervalDays: "2", intervalUnit: "weeks" }), "en")).to.equal("Every 2 weeks");
    expect(scheduleSentence(draft({ intervalDays: "1", intervalUnit: "years" }), "en")).to.equal("Every 1 year");
    expect(scheduleSentence(draft({ scheduleType: "one_time", dueDate: "" }), "en")).to.equal("Once, the date is still missing");
    expect(scheduleSentence(draft({ scheduleType: "one_time", dueDate: "2026-11-30" }), "en")).to.match(/^Once, on /);
    expect(scheduleSentence(draft({ scheduleType: "manual" }), "en")).to.equal("No schedule: whenever it is needed");
    expect(scheduleSentence(draft({ scheduleType: "weekdays", weekdays: [3, 0] }), "en")).to.match(/^Repeat on: Mon, Thu$/);
    expect(scheduleSentence(draft({ scheduleType: "nth_weekday", nth: "2", nthWeekday: "5" }), "en")).to.equal("Nth weekday of month: 2nd Saturday");
    expect(scheduleSentence(draft({ scheduleType: "nth_weekday", nth: "-1", nthWeekday: "0" }), "en")).to.equal("Nth weekday of month: Last Monday");
    expect(scheduleSentence(draft({ scheduleType: "day_of_month", domDay: "15" }), "en")).to.equal("Day of month: 15");
    expect(scheduleSentence(draft({ scheduleType: "day_of_month", domLastDay: true }), "en")).to.equal("Day of month: Last day of the month");
    expect(scheduleSentence(draft({ scheduleType: "calendar", calendarEntity: "Bins" }), "en")).to.equal("Calendar: Bins");
  });

  it("a sensor-based task's schedule is its safety interval", () => {
    expect(scheduleSentence(draft({ scheduleType: "sensor_based", intervalDays: "" }), "en")).to.equal("Only when the sensor rule says so");
    expect(scheduleSentence(draft({ scheduleType: "sensor_based" }), "en")).to.equal("Or every 30 days, whichever comes first");
    expect(scheduleSentence(draft({ scheduleType: "sensor_based", triggerCombinator: "all" }), "en")).to.equal("At the earliest after 30 days");
  });

  it("time-based without an interval is no schedule (the save sends none)", () => {
    expect(scheduleSentence(draft({ intervalDays: "" }), "en")).to.equal("No schedule: whenever it is needed");
  });

  it("uses the language's own plural for the units", () => {
    expect(scheduleSentence(draft({ intervalDays: "5" }), "ru")).to.contain("5 дней");
    expect(scheduleSentence(draft({ intervalDays: "2" }), "ru")).to.contain("2 дня");
  });
});

describe("beta editor: sensor rule sentences", () => {
  const sensor = (fields: Partial<TriggerTypeFields>, over: Partial<RuleDraft> = {}) =>
    draft({ scheduleType: "sensor_based", triggerEntityIds: ["sensor.washes"], trigger: rule(fields), ...over });

  it("reads each rule type", () => {
    expect(triggerSentence(sensor({ type: "threshold", above: "25" }), "en")).to.equal("above 25");
    expect(triggerSentence(sensor({ type: "threshold", above: "25", below: "5", forMinutes: "10" }), "en")).to.equal("above 25 · below 5 · for 10 minutes");
    expect(triggerSentence(sensor({ type: "counter", targetValue: "25", deltaMode: true }), "en")).to.equal("goes up by 25 since the last completion");
    expect(triggerSentence(sensor({ type: "counter", targetValue: "400" }), "en")).to.equal("reaches 400");
    expect(triggerSentence(sensor({ type: "state_change", toState: "on" }), "en")).to.equal("changes to on");
    expect(triggerSentence(sensor({ type: "state_change", fromState: "off", toState: "on", targetChanges: "3" }), "en")).to.equal("changes from off · changes to on · 3 times");
    expect(triggerSentence(sensor({ type: "state_change" }), "en")).to.equal("changes state");
    expect(triggerSentence(sensor({ type: "runtime", runtimeHours: "200" }), "en")).to.equal("has run for 200 hours");
    expect(triggerSentence(sensor({ type: "due_date", daysBefore: "7" }), "en")).to.equal("7 days before the date it reports");
    expect(triggerSentence(sensor({ type: "due_date" }), "en")).to.equal("on the date it reports");
    expect(triggerSentence(sensor({ type: "threshold", above: "25", attribute: "hardness" }), "en")).to.equal("above 25 (hardness)");
  });

  it("says the rule the way the task page and the trace do: with the unit and = / ≠ (DRY 2026-11-07 FE7-B1)", () => {
    expect(triggerSentence(sensor({ type: "threshold", below: "60" }, { triggerUnit: "%" }), "en")).to.equal("below 60%");
    expect(triggerSentence(sensor({ type: "threshold", below: "60" }, { triggerUnit: "%" }), "de")).to.match(/60 %$/);
    expect(triggerSentence(sensor({ type: "counter", targetValue: "400" }, { triggerUnit: "kWh" }), "en")).to.equal("reaches 400 kWh");
    expect(triggerSentence(sensor({ type: "threshold", equals: "3", notEquals: "0" }), "en")).to.equal("= 3 · ≠ 0");
  });

  it("a compound counts its conditions; a rule without a sensor asks for one", () => {
    expect(triggerSentence(draft({ trigger: rule({ type: "compound" }), compoundLogic: "OR", compoundCount: 2 }), "en")).to.equal("Any condition applies (2)");
    expect(triggerSentence(draft({ trigger: rule({ type: "compound" }), compoundLogic: "AND", compoundCount: 3 }), "en")).to.equal("All conditions apply (3)");
    expect(triggerSentence(draft({ trigger: rule({ type: "threshold" }), triggerEntityIds: [] }), "en")).to.equal("Pick a sensor");
  });
});

describe("beta editor: rows", () => {
  it("one row per question; the sensor rule only for a sensor task", () => {
    expect(buildRuleRows(draft(), ctx).map((r) => r.id)).to.deep.equal(["task", "schedule", "completion", "people", "notifications"]);
    expect(buildRuleRows(draft({ scheduleType: "sensor_based", triggerEntityIds: ["sensor.washes"] }), ctx).map((r) => r.id))
      .to.deep.equal(["task", "schedule", "trigger", "completion", "people", "notifications"]);
  });

  it("names the entities as chips and says what a row adds", () => {
    const rows = buildRuleRows(draft({
      scheduleType: "sensor_based", trigger: rule({ type: "counter", targetValue: "25", deltaMode: true }), triggerEntityIds: ["sensor.washes"],
      completeWhenEntity: "binary_sensor.door", completeWhenState: "on", completeWhenFor: "2",
      quickOn: true, requiredCount: 2, allowSkip: false, checklistCount: 3, partsCount: 1, requireTagScan: true,
      responsibleUserId: "u1", pool: ["u1", "u2"], rotation: "round_robin", mirrorLists: ["todo.house"], enabled: false,
    }), ctx);
    const by = Object.fromEntries(rows.map((r) => [r.id, r]));
    expect(by.task.badges).to.deep.equal(["Cleaning", "Disabled"]);
    expect(by.trigger.chips).to.deep.equal(["Total washes"]);
    expect(by.completion.text).to.equal("Done when Door changes to on · for 2 min");
    expect(by.completion.chips).to.deep.equal(["Door"]);
    expect(by.completion.badges.length).to.equal(6);
    expect(by.people.text).to.equal("Responsible User: Mirko");
    expect(by.people.badges).to.deep.equal(["Round-robin"]);
    expect(by.notifications.chips).to.deep.equal(["Household"]);
  });

  it("only the schedule and the sensor rule can be removed, and only while there is something to remove", () => {
    const rem = (d: Partial<RuleDraft>) => Object.fromEntries(buildRuleRows(draft(d), ctx).map((r) => [r.id, r.removable]));
    expect(rem({})).to.include({ task: false, schedule: true, completion: false });
    expect(rem({ scheduleType: "manual" }).schedule).to.equal(false);
    expect(rem({ scheduleType: "sensor_based", intervalDays: "" })).to.include({ schedule: false, trigger: true });
    expect(rem({ scheduleType: "sensor_based", intervalDays: "30" })).to.include({ schedule: true, trigger: true });
  });

  it("people: shared with, else nobody; notifications off", () => {
    const by = (d: Partial<RuleDraft>) => Object.fromEntries(buildRuleRows(draft(d), ctx).map((r) => [r.id, r]));
    expect(by({ pool: ["u1", "u2"] }).people.text).to.equal("Shared with: Mirko, Petra");
    expect(by({}).people.text).to.equal("Nobody in particular");
    expect(by({ notifyEnabled: false }).notifications.text).to.equal("No notifications for this task");
  });
});

describe("beta editor: add picker", () => {
  const effects = (d: { scheduleType: string; intervalDays: string; triggerType?: string }) =>
    Object.fromEntries(ruleChoices({ triggerType: "threshold", ...d } as never).map((c) => [`${c.kind}:${c.value}`, c.effect]));

  it("a time-based task: other schedules replace it, a sensor rule makes it sensor-based", () => {
    const e = effects({ scheduleType: "time_based", intervalDays: "30" });
    expect(e["schedule:time_based"]).to.equal(undefined);
    expect(e["schedule:one_time"]).to.equal("replace");
    expect(e["trigger:counter"]).to.equal("set");
    expect(e["trigger:compound"]).to.equal("set");
  });

  it("a sensor task: a safety interval, other sensor rules join it, no second compound", () => {
    expect(effects({ scheduleType: "sensor_based", intervalDays: "" })["schedule:time_based"]).to.equal("safety");
    expect(effects({ scheduleType: "sensor_based", intervalDays: "30" })["schedule:time_based"]).to.equal(undefined);
    const e = effects({ scheduleType: "sensor_based", intervalDays: "" });
    expect(e["trigger:runtime"]).to.equal("combine");
    expect(e["trigger:compound"]).to.equal(undefined);
    expect(e["schedule:weekdays"]).to.equal("replace");
  });

  it("a task without a schedule: everything sets it", () => {
    const e = effects({ scheduleType: "manual", intervalDays: "30" });
    expect(Object.values(e).every((v) => v === "set")).to.equal(true);
  });

  it("a date-only task becomes sensor-based by replacing its schedule", () => {
    expect(effects({ scheduleType: "one_time", intervalDays: "" })["trigger:threshold"]).to.equal("replace");
  });
});

describe("beta editor: device suggestions", () => {
  it("suggests what fits each kind of entity", () => {
    const kinds = (f: Parameters<typeof suggestionsFor>[0]) => suggestionsFor(f).map((s) => s.target === "done_when" ? "done_when" : s.triggerType);
    const base = { entityId: "x.y", name: "X" };
    expect(kinds({ ...base, domain: "sensor", numeric: true, stateClass: "total_increasing" })).to.deep.equal(["counter", "threshold"]);
    expect(kinds({ ...base, domain: "sensor", numeric: true, stateClass: "measurement" })).to.deep.equal(["threshold"]);
    expect(kinds({ ...base, domain: "sensor", numeric: false, deviceClass: "timestamp" })).to.deep.equal(["due_date"]);
    expect(kinds({ ...base, domain: "sensor", numeric: false })).to.deep.equal(["state_change", "done_when"]);
    expect(kinds({ ...base, domain: "binary_sensor", numeric: false, deviceClass: "door" })).to.deep.equal(["done_when", "state_change"]);
    expect(kinds({ ...base, domain: "switch", numeric: false })).to.deep.equal(["state_change", "runtime", "done_when"]);
    expect(kinds({ ...base, domain: "counter", numeric: true })).to.deep.equal(["counter"]);
    expect(kinds({ ...base, domain: "vacuum", numeric: false })).to.deep.equal(["state_change", "done_when"]);
    // An update entity: on while an update waits; installing it ends the rule.
    expect(kinds({ ...base, domain: "update", numeric: false })).to.deep.equal(["state_change"]);
    expect(kinds({ ...base, domain: "button", numeric: false })).to.deep.equal([]);
  });

  it("reads a device's entities, not our own, not hidden, diagnostics last", () => {
    const hass = {
      states: {
        "sensor.washes": { state: "412", attributes: { friendly_name: "Total washes", state_class: "total_increasing" } },
        "binary_sensor.door": { state: "off", attributes: { friendly_name: "Door", device_class: "door" } },
        "sensor.wifi": { state: "-60", attributes: { friendly_name: "Signal", unit_of_measurement: "dBm" } },
        "sensor.hidden": { state: "1", attributes: { friendly_name: "Hidden" } },
        "sensor.our_task": { state: "ok", attributes: { friendly_name: "Our task" } },
        "button.start": { state: "unknown", attributes: { friendly_name: "Start" } },
        "sensor.other": { state: "1", attributes: { friendly_name: "Other device" } },
      },
      entities: {
        "sensor.washes": { device_id: "d1", platform: "miele" },
        "binary_sensor.door": { device_id: "d1", platform: "miele" },
        "sensor.wifi": { device_id: "d1", platform: "miele", entity_category: "diagnostic" },
        "sensor.hidden": { device_id: "d1", platform: "miele", hidden: true },
        "sensor.our_task": { device_id: "d1", platform: "maintenance_supporter" },
        "button.start": { device_id: "d1", platform: "miele" },
        "sensor.other": { device_id: "d2", platform: "miele" },
      },
    };
    const names = deviceEntityFacts(hass, { deviceId: "d1", ownPlatform: "maintenance_supporter" }).map((f) => f.name);
    expect(names).to.deep.equal(["Door", "Total washes", "Signal"]);
    expect(deviceEntityFacts(hass, { deviceId: null, areaId: null, ownPlatform: "maintenance_supporter" })).to.deep.equal([]);
  });

  it("the device's own entities first, then the rest of its area (2026-10-31)", () => {
    const hass = {
      states: {
        "sensor.washes": { state: "412", attributes: { friendly_name: "Total washes", state_class: "total_increasing" } },
        "binary_sensor.door": { state: "off", attributes: { friendly_name: "Door", device_class: "door" } },
        "sensor.wifi": { state: "-60", attributes: { friendly_name: "Signal", unit_of_measurement: "dBm" } },
        "sensor.humidity": { state: "61", attributes: { friendly_name: "Air humidity", unit_of_measurement: "%" } },
        "binary_sensor.leak": { state: "off", attributes: { friendly_name: "A leak", device_class: "moisture" } },
        "sensor.kitchen": { state: "21", attributes: { friendly_name: "Kitchen temperature", unit_of_measurement: "°C" } },
      },
      entities: {
        "sensor.washes": { device_id: "d1", platform: "miele" },
        "binary_sensor.door": { device_id: "d1", platform: "miele" },
        "sensor.wifi": { device_id: "d1", platform: "miele", entity_category: "diagnostic" },
        // In the area through its own setting …
        "sensor.humidity": { device_id: "d2", area_id: "laundry", platform: "zha" },
        // … or through its device's area, as HA reads it.
        "binary_sensor.leak": { device_id: "d3", platform: "zha" },
        "sensor.kitchen": { device_id: "d4", platform: "zha" },
      },
      devices: { d1: { area_id: "laundry" }, d3: { area_id: "laundry" }, d4: { area_id: "kitchen" } },
    };
    const facts = deviceEntityFacts(hass, { deviceId: "d1", ownPlatform: "maintenance_supporter" });
    // The object has no area of its own: its device's area counts.
    expect(facts.map((f) => [f.group, f.name])).to.deep.equal([
      ["device", "Door"], ["device", "Total washes"], ["device", "Signal"],
      ["area", "A leak"], ["area", "Air humidity"],
    ]);
    const areaOnly = deviceEntityFacts(hass, { deviceId: null, areaId: "laundry", ownPlatform: "maintenance_supporter" });
    expect(areaOnly.map((f) => f.group), "without a device: the area alone").to.deep.equal(["area", "area", "area", "area", "area"]);
  });
});
