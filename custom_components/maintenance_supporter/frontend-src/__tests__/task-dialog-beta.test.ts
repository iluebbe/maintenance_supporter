/**
 * The beta task editor (2026-10, advanced_beta_editor_visible): the task
 * dialog as rule rows with a sidebar, the "Add rule" picker (by type and by
 * the object's device), removing a rule, the start screen of a new task
 * (scratch, a template's task, a copy) — on the dialog's own state and save.
 *
 * Pins above all that the beta saves exactly what the classic form saves:
 * an unchanged task sends the same message in both modes.
 */

import { expect, fixture, html } from "@open-wc/testing";
import { setViewport } from "@web/test-runner-commands";
import "../components/task-dialog.js";
import type { MaintenanceTaskDialog } from "../components/task-dialog";
import { createMockHass, type CreateMockHassOptions } from "./_test-utils.js";

interface Priv {
  _save(): Promise<void>;
  _setSensorRule(type: string, entityId?: string): void;
  _triggerFromState: string;
  _triggerToState: string;
  _autoCompleteOnRecovery: boolean;
  _scheduleType: string;
  _intervalDays: string;
  _triggerType: string;
  _triggerEntityId: string;
  _compoundConditions: Array<{ entityIds: string; type: string }>;
  _compoundLogic: string;
  _completeWhenEntity: string;
  _name: string;
  _taskId: string | null;
  _entryId: string;
  _ruleSel: string | null;
  _patchCondition(i: number, patch: Record<string, unknown>): void;
}

async function mount(opts: CreateMockHassOptions & { beta?: boolean; entities?: Record<string, unknown> } = {}) {
  const mock = createMockHass(opts);
  if (opts.entities) (mock.hass as unknown as { entities: unknown }).entities = opts.entities;
  const el = await fixture<MaintenanceTaskDialog>(
    html`<maintenance-task-dialog .hass=${mock.hass} .betaEditor=${opts.beta ?? true}></maintenance-task-dialog>`,
  );
  return { el, p: el as unknown as Priv, root: () => el.shadowRoot!, ...mock };
}

const TASK = { id: "t1", name: "Filter", type: "cleaning", warning_days: 7, enabled: true };

async function edit(task: Record<string, unknown>, opts: Parameters<typeof mount>[0] = {}) {
  const m = await mount(opts);
  await m.el.openEdit("e1", { ...TASK, ...task } as never);
  await m.el.updateComplete;
  return m;
}

const rowIds = (root: ShadowRoot) => [...root.querySelectorAll(".rule-row")].map((r) => r.getAttribute("data-row"));
const rowText = (root: ShadowRoot, id: string) => root.querySelector(`.rule-row[data-row="${id}"] .rule-sentence`)?.textContent?.trim();
const click = async (el: MaintenanceTaskDialog, target: Element | null | undefined) => {
  if (!target) throw new Error("nothing to click");
  (target as HTMLElement).click();
  await el.updateComplete;
};
const lastSave = (sent: Array<{ type: string }>) =>
  [...sent].reverse().find((m) => m.type === "maintenance_supporter/task/update" || m.type === "maintenance_supporter/task/create") as Record<string, unknown> | undefined;

describe("beta task editor: rows and sidebar", () => {
  it("the classic form while the beta is off", async () => {
    const { root } = await edit({ schedule_type: "time_based", interval_days: 30 }, { beta: false });
    expect(root().querySelector(".rules-layout")).to.equal(null);
    expect(root().querySelector(".content > section.schedule-section")).to.exist;
  });

  it("one row per question, the sidebar empty until a row is picked", async () => {
    const { el, root } = await edit({ schedule_type: "time_based", interval_days: 30 });
    expect(rowIds(root())).to.deep.equal(["task", "schedule", "completion", "people", "notifications"]);
    expect(rowText(root(), "schedule")).to.equal("Every 30 days");
    expect(root().querySelector(".rules-sidebar.open")).to.equal(null);
    expect(root().querySelector(".sidebar-hint")).to.exist;

    await click(el, root().querySelector('.rule-row[data-row="schedule"] .rule-main'));
    const aside = root().querySelector(".rules-sidebar.open")!;
    expect(aside.querySelector(".schedule-section"), "the schedule section in the sidebar").to.exist;
    expect(aside.querySelector(".sidebar-title")?.textContent).to.equal("Schedule");
    expect(root().querySelector('.rule-row[data-row="schedule"]')?.classList.contains("selected")).to.equal(true);

    // A change in the sidebar shows in the row at once.
    const interval = aside.querySelector(".schedule-section ms-textfield") as HTMLElement & { value: string };
    interval.value = "45";
    interval.dispatchEvent(new Event("input"));
    await el.updateComplete;
    expect(rowText(root(), "schedule")).to.equal("Every 45 days");

    await click(el, root().querySelector('.rule-row[data-row="schedule"] .rule-main'));
    expect(root().querySelector(".rules-sidebar.open"), "the row again closes it").to.equal(null);
  });

  it("each row opens its own section", async () => {
    const { el, root } = await edit({ schedule_type: "sensor_based", trigger_config: { type: "threshold", entity_id: "sensor.x", entity_ids: ["sensor.x"], trigger_above: 5 } });
    const sections: Record<string, string> = {
      task: "ms-textfield[label='Task name']",
      trigger: ".trigger-section",
      completion: ".completion-section",
      people: ".people-section",
      notifications: ".notifications-section",
    };
    for (const [id, sel] of Object.entries(sections)) {
      await click(el, root().querySelector(`.rule-row[data-row="${id}"] .rule-main`));
      expect(root().querySelector(`.rules-sidebar.open ${sel}`), id).to.exist;
    }
  });
});

describe("beta task editor: adding and removing rules", () => {
  it("a sensor rule on a time-based task keeps the interval as its safety interval", async () => {
    const { el, p, root } = await edit({ schedule_type: "time_based", interval_days: 30 });
    await click(el, root().querySelector(".rule-add"));
    expect(root().querySelector(".rules-sidebar.open .add-tabs")).to.exist;
    await click(el, root().querySelector('.add-choice[data-kind="trigger"][data-value="counter"]'));
    expect(p._scheduleType).to.equal("sensor_based");
    expect(p._triggerType).to.equal("counter");
    expect(p._intervalDays).to.equal("30");
    expect(rowIds(root())).to.include("trigger");
    expect(rowText(root(), "schedule")).to.equal("Or every 30 days, whichever comes first");
    expect(root().querySelector(".rules-sidebar.open .trigger-section"), "the new rule opens").to.exist;
  });

  it("a second sensor rule joins the first: a compound that fires on either", async () => {
    const { el, p, root, sent } = await edit({
      schedule_type: "sensor_based",
      trigger_config: { type: "threshold", entity_id: "sensor.a", entity_ids: ["sensor.a"], trigger_above: 25, trigger_for_minutes: 10 },
    });
    await click(el, root().querySelector(".rule-add"));
    const choice = root().querySelector('.add-choice[data-kind="trigger"][data-value="state_change"]');
    expect(choice?.querySelector(".add-choice-note")?.textContent).to.equal("Joins the current sensor rule");
    await click(el, choice);
    expect(p._triggerType).to.equal("compound");
    expect(p._compoundLogic).to.equal("OR");
    expect(p._compoundConditions.map((c) => [c.entityIds, c.type])).to.deep.equal([["sensor.a", "threshold"], ["", "state_change"]]);
    p._patchCondition(1, { entityIds: "binary_sensor.b", toState: "on" });
    await el.updateComplete;
    expect(rowText(root(), "trigger")).to.equal("Any condition applies (2)");
    await p._save();
    const tc = lastSave(sent)!.trigger_config as { type: string; compound_logic: string; conditions: Array<Record<string, unknown>> };
    expect(tc.type).to.equal("compound");
    expect(tc.compound_logic).to.equal("OR");
    expect(tc.conditions).to.deep.equal([
      { entity_id: "sensor.a", entity_ids: ["sensor.a"], type: "threshold", trigger_above: 25, trigger_for_minutes: 10 },
      { entity_id: "binary_sensor.b", entity_ids: ["binary_sensor.b"], type: "state_change", trigger_to_state: "on", trigger_for_minutes: 0 },
    ]);
  });

  it("removing a compound's second condition leaves a plain sensor rule (a compound needs two)", async () => {
    const { el, p, root, sent } = await edit({
      schedule_type: "sensor_based",
      trigger_config: { type: "compound", compound_logic: "OR", conditions: [
        { type: "threshold", entity_id: "sensor.a", entity_ids: ["sensor.a"], trigger_above: 3 },
        { type: "state_change", entity_id: "binary_sensor.b", entity_ids: ["binary_sensor.b"], trigger_to_state: "on" },
      ] },
    });
    await click(el, root().querySelector('.rule-row[data-row="trigger"] .rule-main'));
    await click(el, root().querySelectorAll(".rules-sidebar .compound-condition .icon-btn")[1]);
    expect(p._triggerType).to.equal("threshold");
    expect(p._triggerEntityId).to.equal("sensor.a");
    expect(rowText(root(), "trigger")).to.equal("above 3");
    await p._save();
    expect(lastSave(sent)!.trigger_config).to.deep.equal({ entity_id: "sensor.a", entity_ids: ["sensor.a"], type: "threshold", trigger_above: 3, trigger_for_minutes: 0 });
  });

  it("the classic compound editor keeps its one condition (unchanged)", async () => {
    const { el, p, root } = await edit({
      schedule_type: "sensor_based",
      trigger_config: { type: "compound", compound_logic: "OR", conditions: [
        { type: "threshold", entity_id: "sensor.a", entity_ids: ["sensor.a"], trigger_above: 3 },
        { type: "state_change", entity_id: "binary_sensor.b", entity_ids: ["binary_sensor.b"], trigger_to_state: "on" },
      ] },
    }, { beta: false });
    await click(el, root().querySelectorAll(".compound-condition .icon-btn")[1]);
    expect(p._triggerType).to.equal("compound");
    expect(p._compoundConditions.length).to.equal(1);
  });

  it("a safety interval on a sensor task", async () => {
    const { el, p, root } = await edit({ schedule_type: "sensor_based", trigger_config: { type: "threshold", entity_id: "sensor.x", entity_ids: ["sensor.x"], trigger_above: 5 } });
    expect(rowText(root(), "schedule")).to.equal("Only when the sensor rule says so");
    await click(el, root().querySelector(".rule-add"));
    await click(el, root().querySelector('.add-choice[data-kind="schedule"][data-value="time_based"]'));
    expect(p._scheduleType).to.equal("sensor_based");
    expect(p._intervalDays).to.equal("30");
    expect(p._ruleSel).to.equal("trigger");
  });

  it("another schedule replaces a sensor rule", async () => {
    const { el, p, root } = await edit({ schedule_type: "sensor_based", trigger_config: { type: "threshold", entity_id: "sensor.x", entity_ids: ["sensor.x"], trigger_above: 5 } });
    await click(el, root().querySelector(".rule-add"));
    const weekdays = root().querySelector('.add-choice[data-kind="schedule"][data-value="weekdays"]');
    expect(weekdays?.querySelector(".add-choice-note")?.textContent).to.equal("Replaces the current schedule");
    await click(el, weekdays);
    expect(p._scheduleType).to.equal("weekdays");
    expect(p._triggerEntityId).to.equal("");
    expect(rowIds(root())).to.not.include("trigger");
  });

  it("removing rules: the sensor rule leaves the interval, the interval leaves nothing", async () => {
    const { el, p, root } = await edit({
      schedule_type: "sensor_based", interval_days: 60,
      trigger_config: { type: "threshold", entity_id: "sensor.x", entity_ids: ["sensor.x"], trigger_above: 5 },
    });
    await click(el, root().querySelector('.rule-row[data-row="trigger"] .rule-remove'));
    expect(p._scheduleType).to.equal("time_based");
    expect(rowText(root(), "schedule")).to.equal("Every 60 days");
    await click(el, root().querySelector('.rule-row[data-row="schedule"] .rule-remove'));
    expect(p._scheduleType).to.equal("manual");
    expect(root().querySelector('.rule-row[data-row="schedule"] .rule-remove'), "nothing left to remove").to.equal(null);
  });

  it("removing a sensor task's safety interval keeps the sensor rule", async () => {
    const { el, p, root } = await edit({
      schedule_type: "sensor_based", interval_days: 60,
      trigger_config: { type: "threshold", entity_id: "sensor.x", entity_ids: ["sensor.x"], trigger_above: 5 },
    });
    await click(el, root().querySelector('.rule-row[data-row="schedule"] .rule-remove'));
    expect(p._scheduleType).to.equal("sensor_based");
    expect(p._intervalDays).to.equal("");
    expect(rowIds(root())).to.include("trigger");
  });

  it("a sensor rule on a task without a schedule does not pick up a stale interval", async () => {
    const { el, p, root } = await edit({ schedule_type: "manual" });
    await click(el, root().querySelector(".rule-add"));
    await click(el, root().querySelector('.add-choice[data-kind="trigger"][data-value="threshold"]'));
    expect(p._scheduleType).to.equal("sensor_based");
    expect(p._intervalDays).to.equal("");
  });
});

describe("beta task editor: suggestions from the object's device", () => {
  const OBJ = { "maintenance_supporter/objects": () => ({ objects: [{ entry_id: "e1", object: { name: "Washer", ha_device_id: "d1", area_id: null }, tasks: [] }] }) };
  const STATES = {
    "sensor.washes": { state: "412", attributes: { friendly_name: "Total washes", state_class: "total_increasing" } },
    "binary_sensor.door": { state: "off", attributes: { friendly_name: "Door", device_class: "door" } },
  };
  const ENTITIES = { "sensor.washes": { device_id: "d1", platform: "miele" }, "binary_sensor.door": { device_id: "d1", platform: "miele" } };

  it("offers the device's entities with the rules that fit them", async () => {
    const { el, p, root } = await edit({ schedule_type: "time_based", interval_days: 30 }, { handlers: OBJ, states: STATES, entities: ENTITIES });
    await click(el, root().querySelector(".rule-add"));
    await click(el, root().querySelector(".add-tab-device"));
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    const entities = [...root().querySelectorAll(".device-entity")].map((n) => n.getAttribute("data-entity"));
    expect(entities).to.deep.equal(["binary_sensor.door", "sensor.washes"]);

    await click(el, root().querySelector('.device-entity[data-entity="binary_sensor.door"] .add-choice[data-target="done_when"]'));
    expect(p._completeWhenEntity).to.equal("binary_sensor.door");
    expect(p._ruleSel).to.equal("completion");

    await click(el, root().querySelector(".rule-add"));
    await click(el, root().querySelector('.device-entity[data-entity="sensor.washes"] .add-choice[data-type="counter"]'));
    expect(p._scheduleType).to.equal("sensor_based");
    expect(p._triggerType).to.equal("counter");
    expect(p._triggerEntityId).to.equal("sensor.washes");
    expect(p._intervalDays, "the interval stays as the safety interval").to.equal("30");
  });

  it("the device's own entities first, under their own heading; then the rest of its area", async () => {
    const states = {
      ...STATES,
      "sensor.humidity": { state: "61", attributes: { friendly_name: "Air humidity", unit_of_measurement: "%" } },
    };
    const entities = { ...ENTITIES, "sensor.humidity": { device_id: "d9", platform: "zha" } };
    const { el, root, hass } = await edit({ schedule_type: "time_based", interval_days: 30 }, { handlers: OBJ, states, entities });
    (hass as unknown as Record<string, unknown>).devices = { d1: { area_id: "laundry" }, d9: { area_id: "laundry" } };
    (hass as unknown as Record<string, unknown>).areas = { laundry: { area_id: "laundry", name: "Laundry" } };
    await click(el, root().querySelector(".rule-add"));
    await click(el, root().querySelector(".add-tab-device"));
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    const order = [...root().querySelectorAll(".device-group, .device-entity")].map((n) =>
      n.classList.contains("device-group") ? `# ${n.textContent!.trim()}` : n.getAttribute("data-entity"));
    expect(order).to.deep.equal(["# This device", "binary_sensor.door", "sensor.washes", "# More in the Laundry area", "sensor.humidity"]);
  });

  it("says so when the object has no device or area", async () => {
    const { el, root } = await edit({ schedule_type: "time_based", interval_days: 30 }, {
      handlers: { "maintenance_supporter/objects": () => ({ objects: [{ entry_id: "e1", object: { name: "Bike" }, tasks: [] }] }) },
    });
    await click(el, root().querySelector(".rule-add"));
    await click(el, root().querySelector(".add-tab-device"));
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(root().querySelector(".beta-no-device")?.textContent).to.contain("not linked to a device");
  });
});

describe("beta task editor: the same save as the classic form", () => {
  const FIXTURES: Array<Record<string, unknown>> = [
    { schedule_type: "time_based", interval_days: 30, interval_unit: "days", last_performed: "2026-09-27" },
    { schedule_type: "time_based", interval_days: 2, interval_unit: "weeks", interval_anchor: "planned", notes: "n", labels: ["a"] },
    { schedule_type: "one_time", due_date: "2026-12-01" },
    { schedule_type: "manual", complete_when: { entity_id: "binary_sensor.door", to_state: "on", for_minutes: 2 }, allow_skip: false },
    { schedule_type: "sensor_based", interval_days: 90, trigger_config: { type: "counter", entity_id: "sensor.w", entity_ids: ["sensor.w"], trigger_target_value: 25, trigger_delta_mode: true, trigger_combinator: "all" } },
    { schedule_type: "sensor_based", trigger_config: { type: "compound", compound_logic: "OR", conditions: [
      { type: "threshold", entity_id: "sensor.a", entity_ids: ["sensor.a"], trigger_above: 3 },
      { type: "state_change", entity_id: "binary_sensor.b", entity_ids: ["binary_sensor.b"], trigger_to_state: "on" },
    ] } },
    { schedule_type: "weekdays", schedule: { kind: "weekdays", weekdays: [0, 3] } },
    { schedule_type: "time_based", interval_days: 30, assignee_pool: ["u1", "u2"], rotation_strategy: "round_robin", notify_enabled: false, mirror_todo_entities: ["todo.house"] },
  ];

  for (const [i, fx] of FIXTURES.entries()) {
    it(`fixture ${i + 1}: ${fx.schedule_type}`, async () => {
      const payloads: Array<Record<string, unknown>> = [];
      for (const beta of [false, true]) {
        const { p, sent } = await edit(fx, { beta });
        await p._save();
        payloads.push(lastSave(sent)!);
      }
      expect(payloads[1]).to.deep.equal(payloads[0]);
    });
  }
});

describe("beta task editor: a new task", () => {
  it("starts on the start screen; scratch opens the rules with the name", async () => {
    const { el, p, root, sent } = await mount();
    await el.openCreate("e1");
    await el.updateComplete;
    const items = [...root().querySelectorAll(".chooser-item")].map((n) => [...n.classList].find((c) => c !== "chooser-item"));
    expect(items).to.deep.equal(["chooser-scratch", "chooser-sensor", "chooser-template", "chooser-copy"]);
    expect(root().querySelector(".dialog-actions ha-button:not([appearance])"), "no Save on the start screen").to.equal(null);

    await click(el, root().querySelector(".chooser-scratch"));
    expect(root().querySelector(".rules-sidebar.open ms-textfield[label='Task name']"), "the name first").to.exist;
    p._name = "Descale";
    await el.updateComplete;
    await p._save();
    const msg = lastSave(sent)!;
    expect(msg.type).to.equal("maintenance_supporter/task/create");
    expect(msg).to.deep.include({ entry_id: "e1", name: "Descale", schedule_type: "time_based", interval_days: 30 });
  });

  it("a template's task fills the rules", async () => {
    const { el, p, root } = await mount({
      handlers: {
        "maintenance_supporter/templates": () => ({ templates: [
          { name: "Washing machine", tasks: [
            { name: "Clean the drum filter", type: "cleaning", schedule_type: "time_based", interval_days: 60, warning_days: 5 },
            { name: "Descale", type: "service", schedule_type: "time_based", interval_days: 90, warning_days: 7 },
          ] },
          { name: "Hidden", disabled: true, tasks: [{ name: "Gone", type: "custom", schedule_type: "time_based", interval_days: 1, warning_days: 1 }] },
        ] }),
      },
    });
    await el.openCreate("e1");
    await el.updateComplete;
    await click(el, root().querySelector(".chooser-template"));
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect([...root().querySelectorAll(".template-task .chooser-title")].map((n) => n.textContent)).to.deep.equal(["Clean the drum filter", "Descale"]);
    const search = root().querySelector(".chooser-search") as HTMLInputElement;
    search.value = "desc";
    search.dispatchEvent(new Event("input"));
    await el.updateComplete;
    await click(el, root().querySelector(".template-task"));
    expect(p._name).to.equal("Descale");
    expect(p._intervalDays).to.equal("90");
    expect(rowText(root(), "schedule")).to.equal("Every 90 days");
  });

  it("a copied task brings its rules, for this object", async () => {
    const source = {
      id: "s1", name: "Clean the drum filter", type: "cleaning", warning_days: 3, enabled: true,
      schedule_type: "sensor_based", interval_days: 30, last_performed: "2026-09-27", nfc_tag_id: "tag-1",
      trigger_config: { type: "counter", entity_id: "sensor.w", entity_ids: ["sensor.w"], trigger_target_value: 25, trigger_delta_mode: true },
      complete_when: { entity_id: "binary_sensor.door", to_state: "on" },
    };
    const { el, p, root, sent } = await mount({
      handlers: {
        "maintenance_supporter/objects": () => ({ objects: [
          { entry_id: "e2", object: { name: "Old washer" }, tasks: [source, { ...source, id: "fleet", name: "Fleet", battery_fleet_task: true }] },
        ] }),
      },
    });
    await el.openCreate("e1");
    await el.updateComplete;
    await click(el, root().querySelector(".chooser-copy"));
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    const names = [...root().querySelectorAll(".copy-task .chooser-title")].map((n) => n.textContent);
    expect(names, "no fleet task").to.deep.equal(["Clean the drum filter"]);
    await click(el, root().querySelector(".copy-task"));
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(p._taskId).to.equal(null);
    expect(p._entryId).to.equal("e1");
    await p._save();
    const msg = lastSave(sent)!;
    expect(msg.type).to.equal("maintenance_supporter/task/create");
    expect(msg).to.deep.include({ entry_id: "e1", name: "Clean the drum filter", schedule_type: "sensor_based", interval_days: 30, last_performed: null, nfc_tag_id: null });
    expect((msg.trigger_config as Record<string, unknown>).trigger_target_value).to.equal(25);
    expect(msg.complete_when).to.deep.equal({ entity_id: "binary_sensor.door", to_state: "on" });
  });

  it("the classic dialog opens a new task without the start screen", async () => {
    const { el, root } = await mount({ beta: false });
    await el.openCreate("e1");
    await el.updateComplete;
    expect(root().querySelector(".chooser")).to.equal(null);
    expect(root().querySelector(".content > section.schedule-section")).to.exist;
  });
});

describe("beta task editor: update entities and the sidebar's height (2026-11-04)", () => {
  it("a new state rule on an update entity starts off → on, recorded as done when it ends", async () => {
    const { el, p, sent } = await edit({ schedule_type: "time_based", interval_days: 30 });
    p._setSensorRule("state_change", "update.wallbox_firmware");
    await el.updateComplete;
    expect([p._triggerFromState, p._triggerToState, p._autoCompleteOnRecovery]).to.deep.equal(["off", "on", true]);
    await p._save();
    const tc = lastSave(sent)!.trigger_config as Record<string, unknown>;
    expect(tc).to.include({ type: "state_change", trigger_from_state: "off", trigger_to_state: "on", auto_complete_on_recovery: true });
  });

  it("a stored rule keeps its own end; other entities get no seed", async () => {
    const { p } = await edit({
      schedule_type: "sensor_based",
      trigger_config: { type: "state_change", entity_id: "update.wallbox_firmware", entity_ids: ["update.wallbox_firmware"], trigger_from_state: "off", trigger_to_state: "on" },
    });
    expect(p._autoCompleteOnRecovery, "opening a task changes nothing").to.equal(false);
    p._setSensorRule("state_change", "binary_sensor.door");
    expect([p._triggerFromState, p._triggerToState, p._autoCompleteOnRecovery]).to.deep.equal(["", "", false]);
  });

  it("the sidebar spanning the rows adds no empty space under them (two scrollbars, found live)", async () => {
    await setViewport({ width: 1280, height: 1000 });
    const { el, root } = await edit({ schedule_type: "sensor_based", trigger_config: { type: "threshold", entity_id: "sensor.x", entity_ids: ["sensor.x"], trigger_above: 5 } });
    await click(el, root().querySelector('.rule-row[data-row="trigger"] .rule-main'));
    const layout = root().querySelector(".rules-layout")!.getBoundingClientRect();
    const side = root().querySelector(".rules-sidebar")!.getBoundingClientRect();
    const rows = [...root().querySelectorAll(".rules-layout > :not(.rules-sidebar)")].map((r) => r.getBoundingClientRect().bottom);
    // Its 60-row span gave every empty row an 8 px gap: ~470 px under the rows.
    expect(layout.height).to.be.at.most(Math.max(side.height, Math.max(...rows) - layout.top) + 9);
  });
});

describe("beta task editor: phone width", () => {
  afterEach(async () => {
    await setViewport({ width: 1280, height: 900 });
  });

  it("a phone held sideways scrolls the whole dialog; the sidebar below its row does not stick (found live)", async () => {
    await setViewport({ width: 844, height: 390 });
    const { el, root } = await edit({ schedule_type: "time_based", interval_days: 30 });
    expect(getComputedStyle(root().querySelector(".beta-content")!).maxHeight, "no own scroll box under the title").to.equal("none");
    await click(el, root().querySelector('.rule-row[data-row="task"] .rule-main'));
    expect(getComputedStyle(root().querySelector(".rules-sidebar")!).position).to.equal("static");
    await setViewport({ width: 768, height: 1024 });
    await el.updateComplete;
    expect(getComputedStyle(root().querySelector(".rules-sidebar")!).position, "tablet portrait").to.equal("static");
    await setViewport({ width: 1280, height: 900 });
    await el.updateComplete;
    expect(getComputedStyle(root().querySelector(".rules-sidebar")!).position, "beside the rows it may stick").to.equal("sticky");
  });

  it("the classic dialog scrolls as a whole on a phone held sideways too", async () => {
    await setViewport({ width: 844, height: 390 });
    const { root } = await edit({ schedule_type: "time_based", interval_days: 30 }, { beta: false });
    expect(getComputedStyle(root().querySelector(".content")!).maxHeight).to.equal("none");
  });

  it("a long add picker in a short window keeps its tabs (found live on HA 2026.11)", async () => {
    await setViewport({ width: 1280, height: 520 });
    const { el, root } = await edit({ schedule_type: "time_based", interval_days: 30 });
    await click(el, root().querySelector(".rule-add"));
    const body = root().querySelector(".rules-sidebar .sidebar-body") as HTMLElement;
    expect(body.scrollHeight, "the list is longer than the sidebar").to.be.greaterThan(body.clientHeight);
    const tabs = root().querySelector(".add-tabs") as HTMLElement;
    expect(tabs.getBoundingClientRect().height).to.be.greaterThan(24);
    const head = root().querySelector(".sidebar-head") as HTMLElement;
    body.scrollTop = body.scrollHeight;
    expect(head.getBoundingClientRect().top, "the head stays in place").to.be.greaterThan(0);
  });

  it("puts the sidebar right below the picked row and hides it while closed", async () => {
    await setViewport({ width: 390, height: 844 });
    const { el, root } = await edit({ schedule_type: "time_based", interval_days: 30 });
    const aside = () => root().querySelector(".rules-sidebar") as HTMLElement;
    expect(getComputedStyle(aside()).display).to.equal("none");
    await click(el, root().querySelector('.rule-row[data-row="completion"] .rule-main'));
    const row = root().querySelector('.rule-row[data-row="completion"]') as HTMLElement;
    expect(Number(aside().style.order)).to.equal(Number(row.style.order) + 1);
    const rowBox = row.getBoundingClientRect();
    const asideBox = aside().getBoundingClientRect();
    expect(asideBox.top).to.be.greaterThan(rowBox.top);
    const people = (root().querySelector('.rule-row[data-row="people"]') as HTMLElement).getBoundingClientRect();
    expect(asideBox.top, "before the next row").to.be.lessThan(people.top);
  });
});
