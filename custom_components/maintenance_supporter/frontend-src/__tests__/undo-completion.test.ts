/**
 * Undo after Complete (2026-10) and the parts a deleted completion returns.
 *
 * Pins: the complete dialog tells its opener which task was completed and
 * whether the server remembered it for Undo; the helper turns task/undo's
 * answers into the right message; the dashboard card offers Undo through
 * Home Assistant's own toast and its action sends task/undo for exactly that
 * task; the history delete confirm names the parts that go back to stock.
 */
import { expect, fixture, html, oneEvent, waitUntil } from "@open-wc/testing";
import "../components/complete-dialog.js";
import "../components/history-edit-dialog.js";
import "../maintenance-card.js";
import type { MaintenanceCompleteDialog, TaskCompletedDetail } from "../components/complete-dialog";
import type { HistoryEntryDraft, MaintenanceHistoryEditDialog } from "../components/history-edit-dialog";
import type { MaintenanceSupporterCard } from "../maintenance-card";
import type { MaintenanceConfirmDialog } from "../components/confirm-dialog";
import { undoCompletion } from "../helpers/undo-completion";
import { createMockHass, type SentMessage } from "./_test-utils.js";
import { mountPanel, obj, resetTaskSeq, sr, task } from "./_panel-utils.js";

async function completeDialog(answer: () => unknown) {
  const { hass, sent } = createMockHass({ handlers: { "maintenance_supporter/task/complete": answer } });
  const el = await fixture<MaintenanceCompleteDialog>(html`
    <maintenance-complete-dialog .hass=${hass} .entryId=${"e1"} .taskId=${"t1"} .taskName=${"Descale"} .lang=${"en"}></maintenance-complete-dialog>
  `);
  el.open();
  await el.updateComplete;
  return { el, sent };
}

function clickComplete(el: MaintenanceCompleteDialog) {
  const buttons = [...el.shadowRoot!.querySelectorAll(".dialog-actions ha-button")];
  (buttons[buttons.length - 1] as HTMLElement).click();
}

describe("complete dialog → its opener", () => {
  it("reports the task and that the completion can be undone", async () => {
    const { el } = await completeDialog(() => ({ success: true, undo: true }));
    const evt = oneEvent(el, "task-completed");
    clickComplete(el);
    const detail = (await evt).detail as TaskCompletedDetail;
    expect(detail).to.deep.equal({ entryId: "e1", taskId: "t1", taskName: "Descale", undo: true });
  });

  it("an older server without Undo: undo false", async () => {
    const { el } = await completeDialog(() => ({ success: true }));
    const evt = oneEvent(el, "task-completed");
    clickComplete(el);
    expect(((await evt).detail as TaskCompletedDetail).undo).to.equal(false);
  });
});

describe("undoCompletion", () => {
  const run = async (answer: () => unknown) => {
    const { hass, sent } = createMockHass({ handlers: { "maintenance_supporter/task/undo": answer } });
    const res = await undoCompletion(hass as never, "e1", "t1", "en");
    return { res, sent: sent as SentMessage[] };
  };

  it("sends task/undo for exactly that task and reports success", async () => {
    const { res, sent } = await run(() => ({ success: true, action_ran: false }));
    expect(sent.find((m) => m.type === "maintenance_supporter/task/undo")).to.include({ entry_id: "e1", task_id: "t1" });
    expect(res).to.deep.equal({ ok: true, message: "Completion undone" });
  });

  it("says when the completion action had already run", async () => {
    const { res } = await run(() => ({ success: true, action_ran: true }));
    expect(res.ok).to.equal(true);
    expect(res.message).to.contain("already run");
  });

  it("explains a refusal: changed since / nothing to undo / anything else", async () => {
    const changed = await run(() => { throw { code: "changed_since", message: "x" }; });
    expect(changed.res).to.deep.equal({ ok: false, message: "Can't undo. The task has changed since." });
    const nothing = await run(() => { throw { code: "nothing_to_undo", message: "x" }; });
    expect(nothing.res.ok).to.equal(false);
    expect(nothing.res.message).to.contain("10 minutes");
    const other = await run(() => { throw { code: "unknown_error", message: "x" }; });
    expect(other.res.ok).to.equal(false);
    expect(other.res.message).to.not.equal("");
  });
});

describe("dashboard card: Undo through Home Assistant's toast", () => {
  it("offers Undo after a completion and its action undoes that task", async () => {
    const { hass, sent } = createMockHass({
      handlers: {
        "maintenance_supporter/objects": () => ({ objects: [] }),
        "maintenance_supporter/task/undo": () => ({ success: true, action_ran: false }),
      },
    });
    const el = await fixture<MaintenanceSupporterCard>(html`<maintenance-supporter-card></maintenance-supporter-card>`);
    el.setConfig({ type: "custom:maintenance-supporter-card" } as never);
    el.hass = hass as never;
    await el.updateComplete;
    const dialog = el.shadowRoot!.querySelector("maintenance-complete-dialog")!;

    const toasts: Array<{ message: string; action?: { text: string; action: () => void } }> = [];
    el.addEventListener("hass-notification", (e) => toasts.push((e as CustomEvent).detail));
    dialog.dispatchEvent(
      new CustomEvent<TaskCompletedDetail>("task-completed", { detail: { entryId: "e1", taskId: "t9", taskName: "Clean filter", undo: true } }),
    );
    await waitUntil(() => toasts.length === 1, "the completion toast");
    expect(toasts[0].message).to.equal("Completed: Clean filter");
    expect(toasts[0].action!.text).to.equal("Undo");

    toasts[0].action!.action();
    await waitUntil(() => toasts.length === 2, "the outcome toast");
    expect((sent as SentMessage[]).find((m) => m.type === "maintenance_supporter/task/undo")).to.include({ entry_id: "e1", task_id: "t9" });
    expect(toasts[1].message).to.equal("Completion undone");
  });

  it("no Undo when the server did not remember the completion", async () => {
    const { hass } = createMockHass({ handlers: { "maintenance_supporter/objects": () => ({ objects: [] }) } });
    const el = await fixture<MaintenanceSupporterCard>(html`<maintenance-supporter-card></maintenance-supporter-card>`);
    el.setConfig({ type: "custom:maintenance-supporter-card" } as never);
    el.hass = hass as never;
    await el.updateComplete;
    const toasts: unknown[] = [];
    el.addEventListener("hass-notification", (e) => toasts.push((e as CustomEvent).detail));
    el.shadowRoot!.querySelector("maintenance-complete-dialog")!.dispatchEvent(
      new CustomEvent("task-completed", { detail: { entryId: "e1", taskId: "t9", taskName: "x", undo: false } }),
    );
    await new Promise((r) => setTimeout(r, 30));
    expect(toasts).to.deep.equal([]);
  });
});

describe("history delete: the confirm names the parts that go back", () => {
  afterEach(() => {
    document.querySelectorAll("maintenance-confirm-dialog[data-ms-lovelace-confirm]").forEach((d) => d.remove());
  });

  async function confirmText(draft: HistoryEntryDraft): Promise<string> {
    const { hass } = createMockHass({ handlers: { "maintenance_supporter/parts/overview": () => ({ parts: [] }) } });
    const el = await fixture<MaintenanceHistoryEditDialog>(html`
      <maintenance-history-edit-dialog .hass=${hass}></maintenance-history-edit-dialog>
    `);
    el.openEdit(draft);
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 20));
    el.shadowRoot!.querySelector<HTMLButtonElement>("button.delete-entry")!.click();
    let dlg: MaintenanceConfirmDialog | null = null;
    for (let i = 0; i < 50 && !dlg?.shadowRoot?.querySelector("ha-dialog"); i++) {
      await new Promise((r) => setTimeout(r, 10));
      dlg = document.querySelector<MaintenanceConfirmDialog>("maintenance-confirm-dialog[data-ms-lovelace-confirm]");
    }
    const text = dlg!.shadowRoot!.textContent || "";
    const buttons = dlg!.shadowRoot!.querySelectorAll<HTMLElement>(".dialog-actions ha-button");
    buttons[0].click(); // decline — nothing is sent
    return text;
  }

  const base: HistoryEntryDraft = {
    entry_id: "e1", task_id: "t1",
    original_timestamp: "2026-08-01T10:00:00",
    type: "completed", timestamp: "2026-08-01T10:00:00",
    notes: null, cost: null, duration: null, completed_by: null,
  };

  it("lists the used parts with their quantities", async () => {
    const text = await confirmText({
      ...base,
      used_parts: [
        { part_id: "p1", name: "Water filter", quantity: 2 },
        { part_id: "p2", name: "Seal", quantity: 1 },
      ],
    });
    expect(text).to.contain("go back to stock");
    expect(text).to.contain("2× Water filter");
    expect(text).to.contain("1× Seal");
    expect(text).to.not.contain("not restocked");
  });

  it("an entry without parts mentions none", async () => {
    const text = await confirmText(base);
    expect(text).to.contain("Delete this history entry?");
    expect(text).to.not.contain("go back to stock");
  });
});

describe("panel: Undo in its own toast", () => {
  beforeEach(() => resetTaskSeq());

  it("offers Undo after a completion from the dialog and sends task/undo for that task", async () => {
    const { el, sent } = await mountPanel([obj("e1", [task({ name: "Descale" })], "Kettle")], {
      "maintenance_supporter/task/undo": () => ({ success: true, action_ran: false }),
    });
    const dialog = sr(el).querySelector("maintenance-complete-dialog")!;
    dialog.dispatchEvent(
      new CustomEvent<TaskCompletedDetail>("task-completed", { detail: { entryId: "e1", taskId: "t42", taskName: "Descale", undo: true } }),
    );
    await waitUntil(() => sr(el).querySelector(".toast-undo, .undo-button, .toast button"), "an Undo is offered", { timeout: 2000 });
    expect(sr(el).textContent).to.contain("Completed: Descale");
    sr(el).querySelector<HTMLElement>(".toast-undo, .undo-button, .toast button")!.click();
    await waitUntil(() => (sent as SentMessage[]).some((m) => m.type === "maintenance_supporter/task/undo"), "task/undo sent");
    expect((sent as SentMessage[]).find((m) => m.type === "maintenance_supporter/task/undo")).to.include({ entry_id: "e1", task_id: "t42" });
    await waitUntil(() => (sr(el).textContent || "").includes("Completion undone"), "the outcome toast");
  });

  it("no Undo when the server did not remember the completion", async () => {
    const { el } = await mountPanel([obj("e1", [task({ name: "Descale" })], "Kettle")]);
    sr(el).querySelector("maintenance-complete-dialog")!.dispatchEvent(
      new CustomEvent("task-completed", { detail: { entryId: "e1", taskId: "t42", taskName: "Descale", undo: false } }),
    );
    await new Promise((r) => setTimeout(r, 80));
    expect(sr(el).querySelector(".toast-undo, .undo-button")).to.equal(null);
  });
});
