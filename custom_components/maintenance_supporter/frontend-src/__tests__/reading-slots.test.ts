/**
 * #161 phase 2 — reading slots: several named values per completion.
 *
 * Pins the frontend halves:
 *   - the helper (entry snapshot, last value per slot, per-slot delta that
 *     skips a meter not read in between, editor clean-up)
 *   - the task dialog hydrates + re-emits `readings`, rows add/remove, and a
 *     non-reading task always sends [] (server-side clear)
 *   - the complete dialog renders one field per slot with the last value as
 *     hint, warns below the last value, sends `reading_values` keyed by slot
 *     id (unread meters omitted) and never the scalar
 *   - the history timeline lists name / value (+delta) per slot
 *   - the history-edit dialog edits the snapshot (whole map when changed),
 *     offers current slots the entry skipped, and patches the scalar
 */

import { expect, fixture, html } from "@open-wc/testing";
import { render } from "lit";
import {
  cleanReadingSlots,
  entryReadingValues,
  lastReadingsBySlot,
  readingSlotDelta,
} from "../helpers/reading-slots.js";
import { buildCompleteDialogArgs } from "../helpers/complete-dialog-args.js";
import { renderHistoryEntry, type HistoryContext } from "../renderers/history.js";
import "../components/task-dialog.js";
import "../components/complete-dialog.js";
import "../components/history-edit-dialog.js";
import type { MaintenanceTaskDialog } from "../components/task-dialog";
import type { MaintenanceCompleteDialog } from "../components/complete-dialog";
import type { HistoryEntryDraft, MaintenanceHistoryEditDialog } from "../components/history-edit-dialog";
import type { HistoryEntry, MaintenanceTask } from "../types";
import { type SentMessage, createMockHass } from "./_test-utils.js";

const SLOTS = [
  { id: "cold", name: "Water cold", unit: "m³" },
  { id: "warm", name: "Water warm", unit: "m³" },
  { id: "power", name: "Electricity", unit: "kWh" },
];

const entry = (timestamp: string, values: Array<[string, number]>, extra: Partial<HistoryEntry> = {}): HistoryEntry =>
  ({
    timestamp,
    type: "completed",
    reading_values: values.map(([id, value]) => ({ id, name: SLOTS.find((s) => s.id === id)?.name ?? id, unit: "m³", value })),
    ...extra,
  }) as HistoryEntry;

const HISTORY: HistoryEntry[] = [
  entry("2026-01-01T10:00:00", [["cold", 100], ["warm", 50]]),
  entry("2026-02-01T10:00:00", [["cold", 110]]), // warm skipped this month
  entry("2026-03-01T10:00:00", [["cold", 125], ["warm", 58]]),
];

describe("reading-slots helper (#161 phase 2)", () => {
  it("validates the entry snapshot and finds the last value per slot", () => {
    expect(entryReadingValues({ reading_values: [{ id: "a", name: "A", value: 1 }, { id: "a", value: 2 }, { id: "b", value: "x" }, null] } as never))
      .to.deep.equal([{ id: "a", name: "A", unit: null, value: 1 }]);
    expect(entryReadingValues({})).to.deep.equal([]);
    const last = lastReadingsBySlot(HISTORY);
    expect(last.cold.value).to.equal(125);
    expect(last.warm.value).to.equal(58);
    expect(last.power).to.equal(undefined);
  });

  it("delta matches the previous entry carrying the SAME slot", () => {
    expect(readingSlotDelta(HISTORY, HISTORY[2], "cold")).to.equal(15);
    // warm was skipped in February — March compares against January.
    expect(readingSlotDelta(HISTORY, HISTORY[2], "warm")).to.equal(8);
    expect(readingSlotDelta(HISTORY, HISTORY[0], "cold")).to.equal(null);
    expect(readingSlotDelta(HISTORY, HISTORY[1], "warm")).to.equal(null);
  });

  it("cleans the editor rows (empty names dropped, trimmed, capped)", () => {
    const rows = cleanReadingSlots([
      { id: "a", name: "  Gas ", unit: " m³ " },
      { id: "b", name: "   " },
      { id: "a", name: "dupe" },
      { id: "c", name: "Oil", unit: "" },
    ]);
    expect(rows).to.deep.equal([{ id: "a", name: "Gas", unit: "m³" }, { id: "c", name: "Oil", unit: null }]);
    expect(cleanReadingSlots(Array.from({ length: 25 }, (_, i) => ({ id: `s${i}`, name: `m${i}` }))).length).to.equal(20);
  });
});

describe("task-dialog reading slots editor (#161 phase 2)", () => {
  async function openAndSave(taskOver: Record<string, unknown>, mutate?: (el: MaintenanceTaskDialog) => void) {
    const { hass, sent } = createMockHass({ handlers: { "maintenance_supporter/task/update": () => ({ success: true }) } });
    const el = await fixture<MaintenanceTaskDialog>(html`<maintenance-task-dialog .hass=${hass}></maintenance-task-dialog>`);
    await el.updateComplete;
    await el.openEdit("entry_x", {
      id: "t1", name: "Meter round", type: "reading", schedule_type: "time_based",
      interval_days: 30, warning_days: 7, enabled: true, ...taskOver,
    } as never);
    await el.updateComplete;
    if (mutate) { mutate(el); await el.updateComplete; }
    // Row count BEFORE save — a successful save closes (empties) the dialog.
    const rows = el.shadowRoot!.querySelectorAll(".reading-row").length;
    await (el as unknown as { _save: () => Promise<void> })._save();
    const update = sent.find((m) => m.type === "maintenance_supporter/task/update") as Record<string, unknown>;
    expect(update, "update message sent").to.exist;
    return { el, update, rows };
  }

  it("hydrates the slots, renders one row each and re-emits them on save", async () => {
    const { rows, update } = await openAndSave({ readings: SLOTS });
    expect(rows).to.equal(3);
    expect(update.readings).to.deep.equal(SLOTS);
  });

  it("adds and removes rows; blank rows are not sent", async () => {
    const { rows, update } = await openAndSave({ readings: SLOTS.slice(0, 1) }, (dlg) => {
      dlg.shadowRoot!.querySelector<HTMLElement>(".reading-add")!.click();
    });
    expect(rows).to.equal(2);
    // The new row is blank → dropped; the existing one survives.
    expect(update.readings).to.deep.equal([SLOTS[0]]);
    const { update: after } = await openAndSave({ readings: SLOTS }, (dlg) => {
      dlg.shadowRoot!.querySelectorAll<HTMLElement>(".reading-remove")[1].click();
    });
    expect((after.readings as Array<{ id: string }>).map((s) => s.id)).to.deep.equal(["cold", "power"]);
  });

  it("a non-reading task hides the editor but never wipes stored slots on save", async () => {
    const { rows, update } = await openAndSave({ type: "cleaning", readings: SLOTS });
    expect(rows).to.equal(0);
    expect(update.readings).to.deep.equal(SLOTS);
    const { update: none } = await openAndSave({ type: "cleaning" });
    expect(none.readings).to.deep.equal([]);
  });
});

describe("complete-dialog reading slots (#161 phase 2)", () => {
  async function mount(readings = SLOTS, lastReadings = lastReadingsBySlot(HISTORY)) {
    const { hass, sent } = createMockHass({ handlers: { "maintenance_supporter/task/complete": () => ({ success: true }) } });
    const el = await fixture<MaintenanceCompleteDialog>(html`
      <maintenance-complete-dialog
        .hass=${hass} .entryId=${"entry1"} .taskId=${"task1"} .taskName=${"Meter round"} .lang=${"en"}
        .taskType=${"reading"} .readingUnit=${""} .readings=${readings} .lastReadings=${lastReadings}
      ></maintenance-complete-dialog>`);
    el.open();
    await el.updateComplete;
    return { el, sent };
  }
  const inputs = (el: MaintenanceCompleteDialog) => [...el.shadowRoot!.querySelectorAll<HTMLInputElement>(".reading-field .field-input")];
  const type = async (el: MaintenanceCompleteDialog, idx: number, value: string) => {
    const input = inputs(el)[idx];
    input.value = value;
    input.dispatchEvent(new Event("input"));
    await el.updateComplete;
  };
  const complete = async (el: MaintenanceCompleteDialog) => {
    const buttons = [...el.shadowRoot!.querySelectorAll(".dialog-actions ha-button")];
    (buttons[buttons.length - 1] as HTMLElement).click();
    await new Promise((r) => setTimeout(r, 10));
  };

  it("renders one field per slot with the last value as placeholder", async () => {
    const { el } = await mount();
    const fields = inputs(el);
    expect(fields.length).to.equal(3);
    expect(fields[0].placeholder).to.include("125");
    expect(fields[2].placeholder).to.equal("");
    expect(el.shadowRoot!.textContent).to.include("Water cold (m³)");
    // The scalar field is gone for a slot task.
    expect(el.shadowRoot!.textContent).to.not.include("Reading value");
  });

  it("sends reading_values keyed by slot id, unread meters omitted, comma decimals accepted", async () => {
    const { el, sent } = await mount();
    await type(el, 0, "130,5");
    await type(el, 2, "4200");
    await complete(el);
    const msg = sent.find((m) => m.type === "maintenance_supporter/task/complete")!;
    expect(msg.reading_values).to.deep.equal({ cold: 130.5, power: 4200 });
    expect("reading_value" in msg).to.be.false;
  });

  it("warns below the last value but still completes; nothing typed sends no readings", async () => {
    const { el, sent } = await mount();
    await type(el, 0, "120");
    expect(el.shadowRoot!.querySelector(".reading-warn")!.textContent).to.include("125");
    await type(el, 0, "126");
    expect(el.shadowRoot!.querySelector(".reading-warn")).to.equal(null);
    await type(el, 0, "");
    await complete(el);
    const msg = sent.find((m) => m.type === "maintenance_supporter/task/complete")!;
    expect("reading_values" in msg).to.be.false;
  });

  it("buildCompleteDialogArgs carries the slots + last values from the task", () => {
    const task = { id: "t1", name: "Meter round", type: "reading", readings: SLOTS, history: HISTORY } as unknown as MaintenanceTask;
    const args = buildCompleteDialogArgs({ entryId: "e1", taskId: "t1", taskName: "Meter round", task, objects: [], lang: "en" });
    expect(args.readings).to.deep.equal(SLOTS);
    expect(args.last_readings!.cold.value).to.equal(125);
  });
});

describe("history timeline readings (#161 phase 2)", () => {
  it("lists name, value, unit and the per-slot delta", () => {
    const { hass } = createMockHass();
    const ctx: HistoryContext = {
      lang: "en", hass, filter: null, search: "", currencySymbol: "€",
      setFilter: () => undefined, setSearch: () => undefined, openEdit: () => undefined,
      readingSlotDelta: (e, id) => readingSlotDelta(HISTORY, e, id),
    };
    const host = document.createElement("div");
    document.body.appendChild(host);
    render(renderHistoryEntry(HISTORY[2], ctx), host);
    const rows = [...host.querySelectorAll(".history-reading")].map((n) => n.textContent!.replace(/\s+/g, " ").trim());
    expect(rows.length).to.equal(2);
    expect(rows[0]).to.include("Water cold").and.include("125 m³").and.include("(+15)");
    expect(rows[1]).to.include("Water warm").and.include("(+8)");
  });
});

describe("history-edit dialog readings (#161 phase 2)", () => {
  function draft(partial: Partial<HistoryEntryDraft> = {}): HistoryEntryDraft {
    return {
      entry_id: "e1", task_id: "t1", original_timestamp: "2026-02-01T10:00:00",
      type: "completed", timestamp: "2026-02-01T10:00:00",
      notes: null, cost: null, duration: null, completed_by: null, ...partial,
    };
  }
  async function mountDialog(): Promise<{ el: MaintenanceHistoryEditDialog; sent: SentMessage[] }> {
    const { hass, sent } = createMockHass({
      handlers: {
        "maintenance_supporter/parts/overview": () => ({ parts: [] }),
        "maintenance_supporter/task/history/update": () => ({ success: true }),
      },
    });
    const el = await fixture<MaintenanceHistoryEditDialog>(html`<maintenance-history-edit-dialog .hass=${hass}></maintenance-history-edit-dialog>`);
    return { el, sent };
  }
  const settle = async (el: MaintenanceHistoryEditDialog) => { await el.updateComplete; await new Promise((r) => setTimeout(r, 20)); await el.updateComplete; };
  const save = (el: MaintenanceHistoryEditDialog) => (el as unknown as { _save: () => Promise<void> })._save();
  const update = (sent: SentMessage[]) => sent.find((m) => m.type === "maintenance_supporter/task/history/update") as Record<string, unknown> | undefined;
  const setRow = async (el: MaintenanceHistoryEditDialog, idx: number, value: string) => {
    const input = el.shadowRoot!.querySelectorAll<HTMLInputElement>(".reading-row-input")[idx];
    input.value = value;
    input.dispatchEvent(new Event("input"));
    await el.updateComplete;
  };

  it("shows the snapshot plus the current slots the entry skipped; untouched = no patch", async () => {
    const { el, sent } = await mountDialog();
    el.openEdit(draft({ reading_values: entryReadingValues(HISTORY[1]), readings: SLOTS, notes: "x" }));
    await settle(el);
    const names = [...el.shadowRoot!.querySelectorAll(".reading-row-name")].map((n) => n.textContent!.trim());
    expect(names).to.deep.equal(["Water cold (m³)", "Water warm (m³)", "Electricity (kWh)"]);
    const inputs = [...el.shadowRoot!.querySelectorAll<HTMLInputElement>(".reading-row-input")].map((i) => i.value);
    expect(inputs).to.deep.equal(["110", "", ""]);
    (el as unknown as { _set: (k: "notes", v: string) => void })._set("notes", "changed");
    await save(el);
    expect("reading_values" in update(sent)!).to.equal(false);
  });

  it("sends the whole map when a value changed — filled, corrected, cleared", async () => {
    const { el, sent } = await mountDialog();
    el.openEdit(draft({ reading_values: entryReadingValues(HISTORY[1]), readings: SLOTS }));
    await settle(el);
    await setRow(el, 0, "111");
    await setRow(el, 1, "54,5");
    await save(el);
    expect(update(sent)!.reading_values).to.deep.equal({ cold: 111, warm: 54.5, power: null });
  });

  it("keeps a snapshot slot the task no longer has, and patches the scalar on a single-value task", async () => {
    const { el, sent } = await mountDialog();
    el.openEdit(draft({ reading_values: [{ id: "retired", name: "Old gas meter", unit: "m³", value: 3 }], readings: SLOTS.slice(0, 1) }));
    await settle(el);
    const names = [...el.shadowRoot!.querySelectorAll(".reading-row-name")].map((n) => n.textContent!.trim());
    // Task slot order first, then the retired snapshot slot.
    expect(names).to.deep.equal(["Water cold (m³)", "Old gas meter (m³)"]);
    await setRow(el, 1, "");
    await save(el);
    expect(update(sent)!.reading_values).to.deep.equal({ cold: null, retired: null });

    const second = await mountDialog();
    second.el.openEdit(draft({ reading_value: 7, task_type: "reading", reading_unit: "kWh" }));
    await settle(second.el);
    expect(second.el.shadowRoot!.querySelector(".reading-row")).to.equal(null);
    expect(second.el.shadowRoot!.textContent).to.include("Reading value (kWh)");
    (second.el as unknown as { _set: (k: "reading_value", v: number | null) => void })._set("reading_value", 8.25);
    await save(second.el);
    expect(update(second.sent)!.reading_value).to.equal(8.25);
  });
});
