/**
 * Bug audit 2026-11-08: the panel and the task editor.
 *
 * W8-1  "Time based" without an interval: the server refuses it (it used to
 *       make a manual task), the dialog sent it. Switching to time based
 *       seeds the interval, and Save waits for one.
 * E8-1  Copy a task lost its adaptive tuning and its environmental sensor:
 *       both are saved after the create, and only when they changed.
 * E8-2  Combining two sensor rules lost the first rule's own settings (all
 *       entities must, the counting start, the session cap); removing the
 *       second condition lost them as well.
 * E8-3  The own notification texts and the Quick complete values folded
 *       shut when the last value was cleared while typing.
 * E8-6  The editor's calendar schedule line left out its shift.
 * C8-3  A card whose settings could not be read said "new look" but kept
 *       the classic one and labelled row buttons.
 *
 * E8-5 (Add a past completion on an inert task) is in
 * task-detail-renderer.test.ts, E8-8 (the legacy `operator`) in
 * dry-audit-2026-11-07.test.ts.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/task-dialog.js";
import type { MaintenanceTaskDialog } from "../components/task-dialog";
import { scheduleSentence, type RuleDraft } from "../helpers/task-rules.js";
import { emptyTypeFields } from "../helpers/trigger-fields.js";
import { betaUi, setBetaUi } from "../helpers/beta-ui.js";
import { fetchSettingsOnce, invalidateSettingsCache } from "../helpers/settings-cache.js";
import { createMockHass, type CreateMockHassOptions, type SentMessage } from "./_test-utils.js";

interface Priv {
  _save(): Promise<void>;
  _applyCopy(item: { entryId: string; task: unknown }): Promise<void>;
  _applyChoice(c: { kind: string; value: string; effect?: string }): void;
  _removeCondition(i: number): void;
  _patchCondition(i: number, patch: Record<string, unknown>): void;
  _setNotifyText(kind: string, field: "title" | "message", value: string): void;
  _scheduleType: string;
  _intervalDays: string;
  _triggerType: string;
  _triggerEntityLogic: string;
  _triggerBaselineValue: string;
  _triggerRuntimeMaxSession: string;
  _compoundConditions: Array<{ entityIds: string; type: string; carry: Record<string, unknown> }>;
  _qcNotes: string;
}

async function mount(opts: CreateMockHassOptions & { beta?: boolean } = {}) {
  const mock = createMockHass(opts);
  const el = await fixture<MaintenanceTaskDialog>(
    html`<maintenance-task-dialog .hass=${mock.hass} .betaEditor=${opts.beta ?? true}></maintenance-task-dialog>`,
  );
  return { el, p: el as unknown as Priv, root: () => el.shadowRoot!, ...mock };
}

const TASK = { id: "t1", name: "Descale", type: "cleaning", warning_days: 7, enabled: true };

async function edit(task: Record<string, unknown>, opts: Parameters<typeof mount>[0] = {}) {
  const m = await mount(opts);
  await m.el.openEdit("e1", { ...TASK, ...task } as never);
  await m.el.updateComplete;
  return m;
}

const saves = (sent: SentMessage[]) =>
  sent.filter((m) => m.type === "maintenance_supporter/task/update" || m.type === "maintenance_supporter/task/create");
const lastSave = (sent: SentMessage[]) => saves(sent).pop() as Record<string, unknown> | undefined;
const saveButton = (root: ShadowRoot) =>
  [...root.querySelectorAll(".dialog-actions ha-button")].pop() as (HTMLElement & { disabled?: boolean }) | undefined;

describe("W8-1: a time-based task needs its interval", () => {
  for (const beta of [false, true]) {
    it(`switching a manual task to time based seeds one, clearing it blocks Save (${beta ? "new look" : "classic"})`, async () => {
      const { el, p, root, sent } = await edit({ schedule_type: "manual", interval_days: null }, { beta });
      expect(p._intervalDays).to.equal("");
      if (beta) {
        await el.updateComplete;
        (root().querySelector('.rule-row[data-row="schedule"] .rule-main') as HTMLElement).click();
        await el.updateComplete;
      }
      const select = root().querySelector(".schedule-section select") as HTMLSelectElement | null;
      expect(select !== null, "the schedule type select").to.be.true;
      select!.value = "time_based";
      select!.dispatchEvent(new Event("change"));
      await el.updateComplete;
      expect(p._scheduleType).to.equal("time_based");
      expect(p._intervalDays).to.equal("30");
      expect(root().querySelector(".interval-required") === null, "no hint with an interval").to.be.true;
      expect(saveButton(root())?.disabled === true, "Save is open").to.be.false;

      p._intervalDays = "";
      await el.updateComplete;
      expect(root().querySelector(".interval-required")?.textContent?.trim()).to.equal("A time-based task needs an interval.");
      expect(saveButton(root())?.disabled === true, "Save waits for the interval").to.be.true;
      await p._save();
      expect(saves(sent).length, "nothing sent").to.equal(0);
    });
  }

  it("the Add rule choice still seeds it (one rule for both)", async () => {
    const { p } = await edit({ schedule_type: "manual", interval_days: null });
    p._applyChoice({ kind: "schedule", value: "time_based" });
    expect([p._scheduleType, p._intervalDays]).to.deep.equal(["time_based", "30"]);
  });
});

describe("E8-1: a copied task keeps its adaptive tuning and its environmental sensor", () => {
  const source = {
    id: "s1", name: "Replace the filter", type: "replacement", warning_days: 7, enabled: true,
    schedule_type: "sensor_based", interval_days: 90,
    trigger_config: { type: "threshold", entity_id: "sensor.dp", entity_ids: ["sensor.dp"], trigger_above: 40 },
    adaptive_config: {
      enabled: true, ewa_alpha: 0.5, min_interval_days: 10, max_interval_days: 120,
      environmental_entity: "sensor.temp", environmental_attribute: "",
    },
  };

  it("sends both after the create, for the new task", async () => {
    const { el, p, sent } = await mount({
      handlers: { "maintenance_supporter/task/create": () => ({ task_id: "new1" }) },
    });
    await el.openCreate("e1");
    await p._applyCopy({ entryId: "e2", task: source });
    await el.updateComplete;
    await p._save();
    const types = sent.map((m) => m.type);
    const create = types.indexOf("maintenance_supporter/task/create");
    expect(create >= 0, "created").to.be.true;
    const adaptive = sent.find((m) => m.type === "maintenance_supporter/task/set_adaptive") as Record<string, unknown> | undefined;
    const env = sent.find((m) => m.type === "maintenance_supporter/task/set_environmental_entity") as Record<string, unknown> | undefined;
    expect(adaptive !== undefined, "the adaptive tuning is sent").to.be.true;
    expect(adaptive).to.deep.include({ entry_id: "e1", task_id: "new1", enabled: true, ewa_alpha: 0.5, min_interval_days: 10, max_interval_days: 120 });
    expect(env !== undefined, "the environmental sensor is sent").to.be.true;
    expect(env).to.deep.include({ entry_id: "e1", task_id: "new1", environmental_entity: "sensor.temp" });
    expect(types.indexOf("maintenance_supporter/task/set_adaptive") > create, "after the create").to.be.true;
  });

  it("a copy of a task without them sends neither", async () => {
    const { el, p, sent } = await mount({
      handlers: { "maintenance_supporter/task/create": () => ({ task_id: "new1" }) },
    });
    await el.openCreate("e1");
    const { adaptive_config: _ac, ...plain } = source;
    await p._applyCopy({ entryId: "e2", task: plain });
    await p._save();
    const types = sent.map((m) => m.type);
    expect(types.includes("maintenance_supporter/task/create")).to.be.true;
    expect(types.includes("maintenance_supporter/task/set_adaptive"), "no adaptive save").to.be.false;
    expect(types.includes("maintenance_supporter/task/set_environmental_entity"), "no environmental save").to.be.false;
  });
});

describe("E8-2: combining and splitting sensor rules keeps the first rule's own settings", () => {
  const combineWithState = (p: Priv) => p._applyChoice({ kind: "trigger", value: "state_change", effect: "combine" });

  it("all entities must: the condition keeps it, and the flat rule gets it back", async () => {
    const { el, p, sent } = await edit({
      schedule_type: "sensor_based",
      trigger_config: { type: "threshold", entity_id: "sensor.a", entity_ids: ["sensor.a", "sensor.b"], entity_logic: "all", trigger_above: 30 },
    });
    combineWithState(p);
    expect(p._triggerType).to.equal("compound");
    p._patchCondition(1, { entityIds: "binary_sensor.door", toState: "on" });
    await el.updateComplete;
    await p._save();
    const tc = lastSave(sent)!.trigger_config as { conditions: Array<Record<string, unknown>> };
    expect(tc.conditions[0]).to.deep.include({ type: "threshold", entity_ids: ["sensor.a", "sensor.b"], entity_logic: "all", trigger_above: 30 });

    p._removeCondition(1);
    await el.updateComplete;
    expect([p._triggerType, p._triggerEntityLogic]).to.deep.equal(["threshold", "all"]);
    await p._save();
    expect(lastSave(sent)!.trigger_config).to.deep.include({ entity_logic: "all", entity_ids: ["sensor.a", "sensor.b"] });
  });

  it("the counting start value and the session cap ride along too", async () => {
    const counter = await edit({
      schedule_type: "sensor_based",
      trigger_config: { type: "counter", entity_id: "sensor.km", entity_ids: ["sensor.km"], trigger_target_value: 5000, trigger_delta_mode: true, trigger_baseline_value: 120 },
    });
    combineWithState(counter.p);
    expect(counter.p._compoundConditions[0].carry).to.deep.include({ trigger_baseline_value: 120 });
    counter.p._removeCondition(1);
    expect(counter.p._triggerBaselineValue).to.equal("120");

    const runtime = await edit({
      schedule_type: "sensor_based",
      trigger_config: { type: "runtime", entity_id: "switch.pump", entity_ids: ["switch.pump"], trigger_runtime_hours: 100, trigger_runtime_max_session_seconds: 14400 },
    });
    combineWithState(runtime.p);
    runtime.p._patchCondition(1, { entityIds: "binary_sensor.leak", toState: "on" });
    await runtime.el.updateComplete;
    await runtime.p._save();
    const tc = lastSave(runtime.sent)!.trigger_config as { conditions: Array<Record<string, unknown>> };
    expect(tc.conditions[0]).to.deep.include({ trigger_runtime_max_session_seconds: 14400 });
    runtime.p._removeCondition(1);
    expect(runtime.p._triggerRuntimeMaxSession).to.equal("14400");
  });
});

describe("E8-3: a section does not fold shut while it is edited", () => {
  it("own notification texts: clearing the only text keeps the section open", async () => {
    const { el, p, root } = await edit({ schedule_type: "time_based", interval_days: 30, notification_texts: { overdue: { title: "Descale now" } } }, { beta: false });
    const details = () => root().querySelector("details.notify-texts") as HTMLDetailsElement | null;
    expect(details()?.open === true, "open on a task with a text").to.be.true;
    p._setNotifyText("overdue", "title", "");
    await el.updateComplete;
    expect(details()?.open === true, "still open after clearing it").to.be.true;
  });

  it("Quick complete values: clearing the only value keeps the section open", async () => {
    const { el, p, root } = await edit({ schedule_type: "time_based", interval_days: 30, quick_complete_defaults: { notes: "Descaled" } }, { beta: false });
    const details = () => root().querySelector("details.quick-complete-values") as HTMLDetailsElement | null;
    expect(details()?.open === true, "open on a task with a prefill").to.be.true;
    p._qcNotes = "";
    await el.updateComplete;
    expect(details()?.open === true, "still open after clearing it").to.be.true;
  });
});

describe("E8-6: the calendar schedule line says its shift", () => {
  const draft = (over: Partial<RuleDraft>): RuleDraft => ({
    name: "", enabled: true, typeLabel: "", scheduleType: "calendar", intervalDays: "", intervalUnit: "days", intervalAnchor: "completion",
    dueDate: "", weekdays: [], nth: "1", nthWeekday: "5", domDay: "1", domLastDay: false, calendarEntity: "Bins", warningDays: "7",
    trigger: emptyTypeFields(), triggerEntityIds: [], triggerCombinator: "any", entityLogic: "any",
    compoundLogic: "AND", compoundCount: 0, compoundEntityIds: [], completeWhenEntity: "", completeWhenState: "", completeWhenFor: "",
    completeWhenAnyTime: false, quickOn: false, requiredCount: 0, allowSkip: true, requireTagScan: false, checklistCount: 0, partsCount: 0,
    responsibleUserId: null, pool: [], rotation: "", notifyEnabled: true, mirrorLists: [],
    ...over,
  });

  it("as the task page does", () => {
    expect(scheduleSentence(draft({ calOffset: "-1" }), "en")).to.equal("Calendar: Bins −1d");
    expect(scheduleSentence(draft({ calOffset: "0" }), "en")).to.equal("Calendar: Bins");
  });
});

describe("C8-3: a failed settings read uses the new look, as the server's default", () => {
  const win = window as unknown as Record<string, unknown>;
  const failing = () => ({
    connection: { sendMessagePromise: async () => { throw new Error("ws down"); } },
  }) as never;

  afterEach(() => {
    invalidateSettingsCache();
    delete win.__msBetaUi;
  });

  it("switches it on, with the row icons it shows while nobody chose a style", async () => {
    invalidateSettingsCache();
    delete win.__msBetaUi;
    const s = await fetchSettingsOnce(failing());
    expect(s.features.beta_editor).to.equal(true);
    expect(betaUi(), "the new look is on").to.be.true;
    expect(s.rowActionStyle).to.equal("icons");
  });

  it("never over a look a read that worked set", async () => {
    invalidateSettingsCache();
    setBetaUi(false);
    await fetchSettingsOnce(failing());
    expect(betaUi(), "the classic look stays").to.be.false;
  });
});
