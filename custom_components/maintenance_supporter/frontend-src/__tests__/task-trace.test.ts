/**
 * The task trace (2026-10 beta): the journal and the history merged into due
 * cycles. A completion, skip or reset ends a cycle, and what it set off right
 * away (the status back to OK, the reminder off the phones) stays with it.
 * The Trace tab shows one cycle at a time, newest first.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/task-trace-view.js";
import type { MaintenanceTaskTrace } from "../components/task-trace-view";
import { buildCycles, editedFieldsText, eventItem, type TraceEvent } from "../helpers/task-trace";
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
    setLocale("de", { hist_note_sensor_triggered: "Sensor-Auslöser aktiviert", triggered: "Ausgelöst", completed: "Erledigt" });
    const [cycle] = buildCycles([], [H("2026-10-01T10:00:00+00:00", "triggered", "Sensor trigger activated"), H("2026-10-02T10:00:00+00:00", "completed", "Per Hand")], "de");
    expect(cycle.items.map((i) => i.text)).to.deep.equal(["Ausgelöst · Sensor-Auslöser aktiviert", "Erledigt · Per Hand"]);
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
