/**
 * The task trace (2026-10 beta): the journal and the history merged into due
 * cycles. A completion, skip or reset ends a cycle, and what it set off right
 * away (the status back to OK, the reminder off the phones) stays with it.
 * The Trace tab shows one cycle at a time, newest first.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/task-trace-view.js";
import type { MaintenanceTaskTrace } from "../components/task-trace-view";
import {
  activityRows, buildCycles, changeDetails, changeValue, completedByDetail, cycleResult, detailEntry, editedFieldsText, eventItem, spanText,
  type ChangeContext, type TraceEvent,
} from "../helpers/task-trace";
import { triggerValueText } from "../helpers/trigger-value";
import { formatDayCount, setLocale } from "../styles";
import type { HistoryEntry } from "../types";
import { createMockHass } from "./_test-utils.js";

const H = (timestamp: string, type: string, notes?: string): HistoryEntry => ({ timestamp, type, notes } as unknown as HistoryEntry);
const E = (at: string, kind: string, extra: Record<string, unknown> = {}): TraceEvent => ({ at, kind, ...extra });

const JOURNAL: TraceEvent[] = [
  E("2026-10-20T00:00:05+00:00", "status", { from: "ok", to: "due_soon" }),
  E("2026-10-25T09:12:00+00:00", "done_when", { entity: "Door", state: "on", result: "not_due", status: "due_soon" }),
  E("2026-10-27T00:00:05+00:00", "status", { from: "due_soon", to: "overdue" }),
  E("2026-10-27T07:00:00+00:00", "reminder", { reminder: "status", status: "overdue" }),
  E("2026-10-27T07:14:00+00:00", "snoozed", { until: "2026-10-27T11:14:00+00:00", hours: 4 }),
  E("2026-10-31T11:31:00+00:00", "done_when", { entity: "Door", state: "on", result: "waiting", minutes: 2 }),
  E("2026-10-31T11:33:00+00:00", "done_when", { entity: "Door", state: "on", result: "counted" }),
  E("2026-10-31T11:33:01+00:00", "reminder_cleared", { reason: "done" }),
  E("2026-10-31T11:33:02+00:00", "status", { from: "overdue", to: "ok" }),
  E("2026-11-02T08:00:00+00:00", "edited", { fields: ["interval_days"] }),
];
const HISTORY = [H("2026-09-27T18:05:00+00:00", "completed", "By hand"), H("2026-10-31T11:33:00+00:00", "completed", "Auto-completed: Door changed to on")];

describe("task trace: cycles", () => {
  it("splits at completions and keeps a completion's aftermath with it", () => {
    const cycles = buildCycles(JOURNAL, HISTORY, "en");
    expect(cycles.map((c) => c.closed)).to.deep.equal([true, true, false]);
    expect(cycles[0].items.map((i) => i.text)).to.deep.equal(["Completed · By hand"]);
    const second = cycles[1].items.map((i) => i.text);
    expect(second[0]).to.equal("OK → Due Soon");
    expect(second).to.include("Door changed to on: not counted, the task was not due");
    expect(second).to.include("Reminder sent: Overdue");
    expect(second).to.include("Door changed to on: waiting 2 minutes");
    expect(second).to.include("Door changed to on: counts as done");
    expect(second.slice(-2)).to.deep.equal(["Reminder taken off the phones: done", "Overdue → OK"]);
    expect(cycles[2].items.map((i) => i.text)).to.deep.equal(["Task changed: Interval"]);
  });

  it("marks the steps that did not count and the completions", () => {
    const items = buildCycles(JOURNAL, HISTORY, "en")[1].items;
    expect(items.find((i) => i.text.includes("not due"))?.tone).to.equal("skipped");
    expect(items.find((i) => i.text.startsWith("Completed"))?.tone).to.equal("done");
    expect(items.find((i) => i.text.includes("→ Overdue"))?.tone).to.equal("status");
  });

  it("an empty task has no cycle; junk is ignored", () => {
    expect(buildCycles([], [], "en")).to.deep.equal([]);
    expect(buildCycles([{ at: 5 } as unknown as TraceEvent, E("2026-10-01T00:00:00+00:00", "status", { from: "ok", to: "overdue" })], [{} as HistoryEntry], "en"))
      .to.have.length(1);
  });

  it("reads every event kind", () => {
    const text = (e: TraceEvent) => eventItem(e, "en").text;
    expect(text(E("x", "reminder", { reminder: "lead", days: 3 }))).to.equal("Heads-up sent: due in 3 days");
    expect(text(E("x", "reminder_cleared", { reason: "status_left" }))).to.equal("Reminder taken off the phones: no longer needed");
    expect(text(E("x", "reminder_cleared", { reason: "inert" }))).to.equal("Reminder taken off the phones: paused or archived");
    expect(text(E("x", "done_when", { entity: "Door", state: "on", result: "left_early" }))).to.equal("Door left on too early: not counted");
    expect(text(E("x", "done_when", { entity: "Door", state: "on", result: "inert" }))).to.contain("paused or archived");
    expect(text(E("x", "done_when", { entity: "Door", state: "on", result: "recent" }))).to.contain("moments ago");
    expect(text(E("x", "unknown_kind"))).to.equal("unknown_kind");
  });
});

describe("task trace: the Trace tab", () => {
  async function mount(answer: unknown) {
    const { hass, sent } = createMockHass({ handlers: { "maintenance_supporter/task/trace": () => answer } });
    const el = await fixture<MaintenanceTaskTrace>(html`<maintenance-task-trace .hass=${hass} .entryId=${"e1"} .taskId=${"t1"}></maintenance-task-trace>`);
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    return { el, root: el.shadowRoot!, sent };
  }

  it("asks for the task's trace and shows the newest cycle first", async () => {
    const { root, sent } = await mount({ enabled: true, events: JOURNAL, history: HISTORY });
    expect(sent.find((m) => m.type === "maintenance_supporter/task/trace")).to.deep.include({ entry_id: "e1", task_id: "t1" });
    expect(root.querySelector(".trace-cycle-label")?.textContent).to.contain("Current cycle");
    expect([...root.querySelectorAll(".trace-step .trace-text")].map((n) => n.textContent)).to.deep.equal(["Task changed: Interval"]);
    expect(root.querySelectorAll(".trace-node").length).to.equal(1);
    expect(root.querySelector(".trace-off")).to.equal(null);
  });

  it("steps back to older cycles and not past the oldest", async () => {
    const { el, root } = await mount({ enabled: true, events: JOURNAL, history: HISTORY });
    const older = root.querySelector(".trace-older") as HTMLElement;
    older.click();
    await el.updateComplete;
    expect(root.querySelectorAll(".trace-step").length).to.be.greaterThan(5);
    expect(root.querySelector(".trace-node.skipped")).to.exist;
    older.click();
    await el.updateComplete;
    expect([...root.querySelectorAll(".trace-step .trace-text")].map((n) => n.textContent)).to.deep.equal(["Completed · By hand"]);
    expect((root.querySelector(".trace-older") as HTMLButtonElement & { disabled: boolean }).disabled).to.equal(true);
    (root.querySelector(".trace-newer") as HTMLElement).click();
    await el.updateComplete;
    expect(root.querySelectorAll(".trace-step").length).to.be.greaterThan(5);
  });

  it("says when traces are not recorded, and when there is nothing yet", async () => {
    const { root } = await mount({ enabled: false, events: [], history: [] });
    expect(root.querySelector(".trace-off")?.textContent).to.contain("while the new look is on");
    expect(root.textContent).to.contain("Nothing happened in this cycle yet.");
  });

  it("a refused request says so instead of spinning", async () => {
    const { root } = await mount(Promise.reject(new Error("nope")));
    expect(root.textContent).to.contain("Could not load the trace.");
  });
});

describe("trace texts in the reader's words (language check 2026-11-01)", () => {
  it("a note the backend wrote is the translated one, a typed note stays", () => {
    setLocale("de", { hist_note_button: "Über den Dashboard-Button erledigt", completed: "Erledigt", skipped: "Übersprungen" });
    const [first, second] = buildCycles([], [H("2026-10-01T10:00:00+00:00", "completed", "Completed from dashboard button"), H("2026-10-02T10:00:00+00:00", "skipped", "Per Hand")], "de");
    expect(first.items.map((i) => i.text)).to.deep.equal(["Erledigt · Über den Dashboard-Button erledigt"]);
    expect(second.items.map((i) => i.text)).to.deep.equal(["Übersprungen · Per Hand"]);
  });

  it("a trigger firing says its value, not the note every firing carries", () => {
    setLocale("de", { hist_note_sensor_triggered: "Sensor-Auslöser aktiviert", triggered: "Ausgelöst", trigger_val: "Auslösewert" });
    const fired = { ...H("2026-10-01T10:00:00+00:00", "triggered", "Sensor trigger activated"), trigger_value: 523.5 } as HistoryEntry;
    const [cycle] = buildCycles([], [H("2026-09-30T10:00:00+00:00", "triggered", "Sensor trigger activated"), fired], "de", { triggerUnit: "h" });
    // The two fold into one line; each keeps its own text.
    expect(cycle.items).to.have.length(1);
    expect(cycle.items[0].foldText).to.equal("Ausgelöst");
    expect(cycle.items[0].repeats!.map((r) => r.text)).to.deep.equal(["Ausgelöst", "Ausgelöst · Auslösewert: 523,5 h"]);
  });

  it("changed fields are named as the dialog names them, each once, the rest as other settings", () => {
    expect(editedFieldsText(["interval_days", "interval_unit", "trigger_config", "complete_when"], "en")).to.equal("Interval, Sensor rule, Done when");
    expect(editedFieldsText(["interval_days", "battery_low_latch"], "en")).to.equal("Interval, other settings");
    expect(editedFieldsText([], "en")).to.equal("");
  });

  it("a count of days takes the language's singular", () => {
    expect(formatDayCount(1, "en")).to.equal("1 day");
    expect(formatDayCount(3, "en")).to.equal("3 days");
  });
});

describe("task trace: what it adds to the history (after HA's traces, 2026-11-01)", () => {
  it("each step knows the time since the one before it", () => {
    const items = buildCycles(JOURNAL, HISTORY, "en")[1].items;
    expect(items[0].gapMs).to.equal(null);
    // due_soon on 20.10. 00:00:05, the door on 25.10. 09:12
    expect(spanText(items[1].gapMs!, "en")).to.equal("5 days");
  });

  it("a status says how long it lasted", () => {
    const items = buildCycles(JOURNAL, HISTORY, "en")[1].items;
    const dueSoon = items.find((i) => i.text === "OK → Due Soon")!;
    expect(dueSoon.details).to.deep.include({ label: "Duration", value: "7 days" });
  });

  it("a Done-when step names the rule and the status that kept it from counting", () => {
    const step = eventItem(E("x", "done_when", { entity: "Door", state: "on", result: "not_due", status: "due_soon" }), "en");
    expect(step.details.map((d) => d.value)).to.deep.equal(["Door → on", "Due Soon"]);
    const bundled = eventItem(E("x", "reminder", { reminder: "bundle", status: "overdue" }), "en");
    expect(bundled.details[0].value).to.contain("together with the other due tasks");
    expect(eventItem(E("x", "snoozed", { until: "2026-10-27T11:14:00+00:00", hours: 4 }), "en").details).to.deep.equal([{ label: "Duration", value: "4 hours" }]);
  });

  it("the cycle's result: how late it was done, the reminders and snoozes, the interval", () => {
    const cycle = buildCycles(JOURNAL, HISTORY, "en")[1];
    const result = cycleResult(cycle, "en");
    expect(result.tone).to.equal("done");
    expect(result.text).to.match(/^Completed · /);
    // overdue from 27.10. 00:00, done 31.10. 11:33
    expect(result.facts).to.deep.equal(["Done 4 days after it was due", "Cycle: 34 days", "1 reminder", "Snoozed once"]);
  });

  it("done while due soon is before it was due; the current cycle says how long it has been due", () => {
    const early = buildCycles(
      [E("2026-10-20T00:00:05+00:00", "status", { from: "ok", to: "due_soon" })],
      [H("2026-10-22T08:00:00+00:00", "completed")], "en")[0];
    expect(cycleResult(early, "en").facts).to.deep.equal(["Done before it was due"]);
    const running = buildCycles([E("2026-10-27T00:00:00+00:00", "status", { from: "due_soon", to: "overdue" })], [], "en")[0];
    const result = cycleResult(running, "en", Date.parse("2026-10-30T00:00:00+00:00"));
    expect(result.text).to.equal("Still running");
    expect(result.facts).to.deep.equal(["Due for 3 days"]);
  });

  it("a firing that was missed and fired again counts from the second time", () => {
    const cycle = buildCycles([
      E("2026-08-30T10:00:00+00:00", "status", { from: "ok", to: "triggered" }),
      E("2026-08-30T10:00:01+00:00", "status", { from: "triggered", to: "ok" }),
      E("2026-09-06T10:00:00+00:00", "status", { from: "ok", to: "triggered" }),
    ], [H("2026-08-30T10:00:00+00:00", "missed"), H("2026-09-06T10:30:00+00:00", "completed")], "en")[0];
    expect(cycle.dueAt).to.equal("2026-09-06T10:00:00+00:00");
    expect(cycleResult(cycle, "en").facts[0]).to.equal("Done 30 minutes after it was due");
  });

  it("who completed, on which device, resolved when the details are drawn", () => {
    const h = { ...H("2026-10-01T10:00:00+00:00", "completed"), completed_by: "u1", completed_via: "u2" } as HistoryEntry;
    const names: Record<string, string> = { u1: "Alex", u2: "Kitchen tablet" };
    expect(completedByDetail(h, (id) => names[id] ?? null, "en")).to.deep.equal({ label: "Completed by", value: "Alex (via Kitchen tablet)" });
    expect(completedByDetail(h, () => null, "en")).to.equal(null);
  });

  it("a firing's details leave out the note every firing carries, a typed one stays", () => {
    expect(detailEntry(H("x", "triggered", "Sensor trigger activated")).notes).to.equal(null);
    expect(detailEntry(H("x", "triggered", "Pump was loud")).notes).to.equal("Pump was loud");
    expect(detailEntry(H("x", "completed", "Sensor trigger activated")).notes).to.equal("Sensor trigger activated");
  });

  it("only same-shape steps in a row fold", () => {
    const fire = (at: string) => H(at, "triggered", "Sensor trigger activated");
    const items = buildCycles(
      [E("2026-10-03T10:00:00+00:00", "status", { from: "ok", to: "triggered" })],
      [fire("2026-10-01T10:00:00+00:00"), fire("2026-10-02T10:00:00+00:00"), fire("2026-10-04T10:00:00+00:00")], "en")[0].items;
    expect(items.map((i) => i.repeats?.length ?? 1)).to.deep.equal([2, 1, 1]);
    // The step after a folded run counts from the run's last step.
    expect(spanText(items[1].gapMs!, "en")).to.equal("24 hours");
  });
});

describe("task trace: the steps in the Trace tab", () => {
  async function mount(answer: unknown) {
    const { hass } = createMockHass({ handlers: { "maintenance_supporter/task/trace": () => answer } });
    const el = await fixture<MaintenanceTaskTrace>(html`<maintenance-task-trace .hass=${hass} .entryId=${"e1"} .taskId=${"t1"}
      .userName=${(id: string) => (id === "u1" ? "Alex" : null)}></maintenance-task-trace>`);
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    (el.shadowRoot!.querySelector(".trace-older") as HTMLElement).click();
    await el.updateComplete;
    return { el, root: el.shadowRoot! };
  }

  it("node and text sit on the same line, also where the text wraps", async () => {
    const long = E("2026-10-26T09:12:00+00:00", "done_when", { entity: "A sensor with a very long name ".repeat(6), state: "on", result: "not_due", status: "due_soon" });
    const { el, root } = await mount({ enabled: true, events: [...JOURNAL, long], history: HISTORY });
    el.style.width = "420px";
    await el.updateComplete;
    const steps = [...root.querySelectorAll(".trace-step")];
    expect(steps.length).to.be.greaterThan(5);
    for (const step of steps) {
      const node = step.querySelector(".trace-node")!.getBoundingClientRect();
      const time = step.querySelector(".trace-time")!.getBoundingClientRect();
      // The line's first row (its time) is centred on the node.
      expect(Math.abs(time.top + 10 - (node.top + node.height / 2))).to.be.below(3);
    }
    expect(root.querySelector(".trace-graph")).to.equal(null);
  });

  it("a click opens the step's details and a second one closes them", async () => {
    const { el, root } = await mount({ enabled: true, events: JOURNAL, history: HISTORY });
    const steps = [...root.querySelectorAll<HTMLButtonElement>(".trace-step")];
    const dueSoon = steps.find((s) => s.textContent!.includes("OK → Due Soon"))!;
    dueSoon.click();
    await el.updateComplete;
    expect(dueSoon.getAttribute("aria-expanded")).to.equal("true");
    const details = root.querySelector(".trace-details")!;
    expect(details.textContent).to.contain("Timestamp");
    expect(details.textContent).to.contain("7 days");
    dueSoon.click();
    await el.updateComplete;
    expect(root.querySelector(".trace-details")).to.equal(null);
  });

  it("a completion's details show what the history knows and who did it", async () => {
    const history = [HISTORY[0], { ...HISTORY[1], completed_by: "u1", cost: 12.5, duration: 20 } as HistoryEntry];
    const { el, root } = await mount({ enabled: true, events: JOURNAL, history });
    const done = [...root.querySelectorAll<HTMLButtonElement>(".trace-step")].find((s) => s.textContent!.includes("Completed"))!;
    done.click();
    await el.updateComplete;
    const text = root.querySelector(".trace-details")!.textContent!.replace(/\s+/g, " ");
    expect(text).to.contain("Completed by");
    expect(text).to.contain("Alex");
    expect(text).to.contain("Cost");
    expect(text).to.contain("Duration");
  });

  it("the result line sits above the steps; a folded run shows its count and each step", async () => {
    const fire = (at: string, v: number) => ({ ...H(at, "triggered", "Sensor trigger activated"), trigger_value: v } as HistoryEntry);
    const history = [fire("2026-10-01T10:00:00+00:00", 1), fire("2026-10-02T10:00:00+00:00", 2), fire("2026-10-03T10:00:00+00:00", 3), H("2026-10-04T10:00:00+00:00", "completed")];
    const { el, root } = await mount({ enabled: true, events: [], history });
    expect(root.querySelector(".trace-result")?.textContent).to.contain("Completed");
    expect(root.querySelector(".trace-count")?.textContent).to.equal("×3");
    (root.querySelector(".trace-step") as HTMLElement).click();
    await el.updateComplete;
    expect(root.querySelectorAll(".trace-repeats li").length).to.equal(3);
    expect(root.querySelector(".trace-details")!.textContent).not.to.contain("Sensor trigger activated");
    expect(root.querySelector(".trace-repeats")!.textContent).to.contain("Trigger value: 3");
  });
});

describe("task trace: before and after, activity, download (2026-11-02)", () => {
  const ctx: ChangeContext = {
    lang: "en",
    entityName: (id) => ({ "sensor.filter_hours": "Filter hours", "binary_sensor.door": "Washer door" } as Record<string, string>)[id] ?? id,
    userName: (id) => (id === "u1" ? "Alex" : null),
    unit: "h",
  };

  it("an edit's values read the way the dialog says them", () => {
    expect(changeValue("schedule", { kind: "interval", every: 30, unit: "days" }, ctx)).to.match(/30/);
    expect(changeValue("warning_days", 7, ctx)).to.equal("7 days");
    expect(changeValue("trigger_config", { type: "threshold", entity_id: "sensor.filter_hours", trigger_above: 500 }, ctx)).to.equal("Filter hours: above 500 h");
    expect(changeValue("complete_when", { entity_id: "binary_sensor.door", to_state: "on" }, ctx)).to.equal("Washer door → on");
    expect(changeValue("responsible_user_id", "u1", ctx)).to.equal("Alex");
    expect(changeValue("enabled", false, ctx)).to.equal("✗");
    expect(changeValue("notes", null, ctx)).to.equal("—");
    expect(changeValue("labels", ["garden", "pump"], ctx)).to.equal("garden, pump");
    expect(changeValue("on_complete_action", { service: "x" }, ctx)).to.equal("…");
  });

  it("each changed field with a label of its own is one line, the others stay 'other settings'", () => {
    const step = eventItem(E("2026-10-02T08:00:00+00:00", "edited", {
      fields: ["schedule", "warning_days", "battery_low_latch"],
      changes: { schedule: [{ kind: "interval", every: 30 }, { kind: "interval", every: 60 }], warning_days: [7, 3], battery_low_latch: [1, 2] },
    }), "en");
    const rows = changeDetails(step.changes, ctx);
    expect(rows.map((r) => r.label)).to.deep.equal(["Schedule type", "Warning days"]);
    expect(rows[1].value).to.equal("7 days → 3 days");
    // An edit without values (recorded before 2.117) has no lines, and two edits never fold.
    expect(changeDetails(eventItem(E("x", "edited", { fields: ["notes"] }), "en").changes, ctx)).to.deep.equal([]);
    const twice = buildCycles([E("2026-10-02T08:00:00+00:00", "edited", { fields: ["notes"] }), E("2026-10-02T09:00:00+00:00", "edited", { fields: ["notes"] })], [], "en")[0];
    expect(twice.items).to.have.length(2);
  });

  it("the recorded states around a step: every sensor merged, the closest ones, in time order", () => {
    const at = Date.parse("2026-10-02T10:00:00+00:00");
    const sec = (iso: string) => Date.parse(iso) / 1000;
    const rows = activityRows({
      "sensor.a": [{ s: "1", lu: sec("2026-10-02T09:00:00+00:00") }, { s: "5", lu: sec("2026-10-02T09:58:00+00:00") }],
      "sensor.b": [{ state: "on", last_updated: "2026-10-02T10:01:00+00:00" }, { s: "x" }],
    }, at, 2);
    expect(rows.map((r) => `${r.entityId}=${r.state}`)).to.deep.equal(["sensor.a=5", "sensor.b=on"]);
    expect(activityRows(null, at)).to.deep.equal([]);
  });

  async function mount(answer: unknown, handlers: Record<string, (msg: Record<string, unknown>) => unknown> = {}, task: Record<string, unknown> | null = null) {
    const { hass, sent } = createMockHass({ handlers: { "maintenance_supporter/task/trace": () => answer, ...handlers } });
    const el = await fixture<MaintenanceTaskTrace>(html`<maintenance-task-trace .hass=${hass} .entryId=${"e1"} .taskId=${"t1"} .task=${task}></maintenance-task-trace>`);
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    return { el, root: el.shadowRoot!, sent };
  }

  it("an edit's details say from what to what", async () => {
    const events = [E("2026-11-02T08:00:00+00:00", "edited", { fields: ["warning_days"], changes: { warning_days: [7, 3] } })];
    const { el, root } = await mount({ enabled: true, events, history: [] });
    (root.querySelector(".trace-step") as HTMLElement).click();
    await el.updateComplete;
    expect(root.querySelector(".trace-details")!.textContent).to.contain("7 days → 3 days");
  });

  it("opening a firing loads its sensor's recorded states around it; a step without a sensor asks for none", async () => {
    const at = "2026-10-02T10:00:00+00:00";
    const history = [{ ...H(at, "triggered", "Sensor trigger activated"), trigger_value: 512 } as HistoryEntry];
    const events = [E("2026-10-02T11:00:00+00:00", "reminder_cleared", { reason: "status_left" })];
    const task = { name: "Filter", trigger_config: { type: "threshold", entity_id: "sensor.filter_hours", trigger_above: 500 } };
    const { el, root, sent } = await mount({ enabled: true, events, history }, {
      "history/history_during_period": () => ({ "sensor.filter_hours": [{ s: "498", lu: Date.parse(at) / 1000 - 600 }, { s: "512", lu: Date.parse(at) / 1000 }] }),
    }, task);
    const [fired, cleared] = [...root.querySelectorAll<HTMLElement>(".trace-step")];
    fired.click();
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    const ask = sent.find((m) => m.type === "history/history_during_period")!;
    expect(ask).to.deep.include({ entity_ids: ["sensor.filter_hours"] });
    expect(Date.parse(ask.start_time as string)).to.equal(Date.parse(at) - 3_600_000);
    const activity = root.querySelector(".trace-activity")!.textContent!;
    expect(activity).to.contain("Activity around this step");
    expect(activity).to.contain("sensor.filter_hours: 498");
    expect(root.querySelectorAll(".trace-activity li").length).to.equal(2);
    cleared.click();
    await el.updateComplete;
    expect(sent.filter((m) => m.type === "history/history_during_period")).to.have.length(1);
    expect(root.querySelector(".trace-activity")).to.equal(null);
  });

  it("a recorder that refuses says nothing was recorded", async () => {
    const task = { trigger_config: { type: "threshold", entity_id: "sensor.filter_hours" } };
    const { el, root } = await mount({ enabled: true, events: [], history: [H("2026-10-02T10:00:00+00:00", "triggered")] }, {
      "history/history_during_period": () => Promise.reject(new Error("no recorder")),
    }, task);
    (root.querySelector(".trace-step") as HTMLElement).click();
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(root.querySelector(".trace-activity")!.textContent).to.contain("Nothing recorded around this time");
  });

  it("the download button saves the answer with its task as JSON", async () => {
    const answer = { enabled: true, events: JOURNAL, history: HISTORY };
    const { root } = await mount(answer, {}, { name: "Wäsche aufhängen", history: HISTORY, interval_days: 7 });
    let blob: Blob | null = null;
    let filename = "";
    const create = URL.createObjectURL;
    const dispatch = HTMLAnchorElement.prototype.dispatchEvent;
    URL.createObjectURL = (b: Blob | MediaSource) => { blob = b as Blob; return "blob:test"; };
    HTMLAnchorElement.prototype.dispatchEvent = function (this: HTMLAnchorElement) { filename = this.download; return true; };
    try {
      (root.querySelector(".trace-download") as HTMLElement).click();
    } finally {
      URL.createObjectURL = create;
      HTMLAnchorElement.prototype.dispatchEvent = dispatch;
    }
    expect(filename).to.match(/^trace-wasche-aufhangen-\d{4}-\d{2}-\d{2}\.json$/);
    const json = JSON.parse(await blob!.text());
    expect(json).to.deep.include({ entry_id: "e1", task_id: "t1", enabled: true });
    expect(json.events).to.have.length(JOURNAL.length);
    expect(json.task).to.deep.equal({ name: "Wäsche aufhängen", interval_days: 7 });
  });
});

describe("task trace: a rule that lets go by itself (update task, found live 2026-11-04)", () => {
  // A state rule on an update entity: July's firing from before the journal,
  // today's firing with its versions, the install three hours later.
  const july = { ...H("2026-07-23T12:27:29+00:00", "triggered", "Sensor trigger activated"), trigger_value: 1 } as HistoryEntry;
  const today = {
    ...H("2026-11-04T12:28:24.300+00:00", "triggered", "Sensor trigger activated"),
    trigger_value: 1,
    trigger_change: { from: "off", to: "on", installed: "v0.9.74", latest: "v2026.11.0" },
  } as HistoryEntry;
  const journal = [
    E("2026-11-04T12:28:24.400+00:00", "status", { from: "ok", to: "triggered" }),
    E("2026-11-04T12:28:24.500+00:00", "reminder", { reminder: "status", status: "triggered" }),
    E("2026-11-04T15:28:37.000+00:00", "trigger_cleared", { entity: "update.wallbox", state: "off", installed: "v2026.11.0", latest: "v2026.11.0" }),
    E("2026-11-04T15:28:37.600+00:00", "status", { from: "triggered", to: "ok" }),
    E("2026-11-04T15:28:37.700+00:00", "reminder_cleared", { reason: "status_left" }),
  ];

  it("ends the cycle instead of running on from one firing to the next", () => {
    const cycles = buildCycles(journal, [july, today], "en", { stateRule: true });
    expect(cycles).to.have.length(1);
    expect(cycles[0].closed).to.equal(true);
    expect(cycles[0].items.at(-1)!.text, "the reminder taken off the phones stays with it").to.equal("Reminder taken off the phones: no longer needed");
    const result = cycleResult(cycles[0], "en");
    expect(result.text).to.match(/^Ended by itself · /);
    expect(result.facts).to.deep.equal(["Triggered for 3 hours", "1 reminder"]);
    // The next firing starts a new cycle.
    const next = buildCycles([...journal, E("2026-11-20T08:00:00+00:00", "status", { from: "ok", to: "triggered" })], [july, today], "en");
    expect(next.map((c) => c.closed)).to.deep.equal([true, false]);
  });

  it("the firings say what changed, the end what is installed now", () => {
    const items = buildCycles(journal, [july, today], "en", { stateRule: true })[0].items;
    // July's firing has only the count: no "Trigger value: 1" any more.
    expect(items[0].repeats!.map((r) => r.text)).to.deep.equal(["Triggered", "Triggered · v2026.11.0 available, v0.9.74 installed"]);
    expect(items.map((i) => i.text)).to.include("Trigger ended: v2026.11.0 installed");
  });

  it("a rule ending without a journal entry (from before 2.119) still ends the cycle, a missed occurrence does not", () => {
    const old = buildCycles([E("2026-11-04T12:28:24+00:00", "status", { from: "ok", to: "triggered" }), E("2026-11-04T15:28:37+00:00", "status", { from: "triggered", to: "ok" })], [], "en");
    expect(old.map((c) => c.endType)).to.deep.equal(["self_ended"]);
    const paused = buildCycles([E("2026-11-04T12:28:24+00:00", "status", { from: "ok", to: "triggered" }), E("2026-11-04T15:28:37+00:00", "status", { from: "triggered", to: "paused" })], [], "en");
    expect(paused.map((c) => c.closed), "a pause is no end").to.deep.equal([false]);
  });

  it("the end of a rule in words: the state, the reading, or just that it ended", () => {
    expect(eventItem(E("2026-11-04T15:28:37+00:00", "trigger_cleared", { entity: "binary_sensor.door", state: "off" }), "en").text).to.equal("Trigger ended: now off");
    expect(eventItem(E("2026-11-04T15:28:37+00:00", "trigger_cleared", { entity: "sensor.tpms", value: 41.25 }), "en").text).to.equal("Trigger ended at 41.25");
    const plain = eventItem(E("2026-11-04T15:28:37+00:00", "trigger_cleared"), "en");
    expect([plain.text, plain.details]).to.deep.equal(["Trigger ended", []]);
  });

  it("a firing's value: the reading with its unit, a state rule's transition, never the bare count", () => {
    const at = "2026-11-04T12:00:00+00:00";
    const reading = { ...H(at, "triggered"), trigger_value: 77408.44860672 } as HistoryEntry;
    expect(triggerValueText(reading, "en", { unit: "km" })).to.equal("Trigger value: 77,408.449 km");
    expect(triggerValueText({ ...H(at, "triggered"), trigger_value: 1 } as HistoryEntry, "en", { stateRule: true })).to.equal("");
    const door = { ...H(at, "triggered"), trigger_value: 1, trigger_change: { from: "off", to: "on" } } as HistoryEntry;
    expect(triggerValueText(door, "en", { stateRule: true })).to.equal("Trigger value: off → on");
    const same = { ...H(at, "triggered"), trigger_change: { to: "on", installed: "v1", latest: "v1" } } as HistoryEntry;
    expect(triggerValueText(same, "en")).to.equal("Trigger value: on");
  });
});
