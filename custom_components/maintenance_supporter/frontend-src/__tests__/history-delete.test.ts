/**
 * History-edit dialog: delete the entry (#170 round 2).
 *
 * Pins: the dialog carries a "Delete entry" button; confirming sends
 * task/history/delete with the entry's ORIGINAL timestamp, fires
 * history-entry-saved with `deleted: true` and closes; declining the
 * confirm sends nothing; a WS error stays in the dialog.
 */

import { expect, fixture, html, oneEvent } from "@open-wc/testing";
import "../components/history-edit-dialog.js";
import type { HistoryEntryDraft, MaintenanceHistoryEditDialog } from "../components/history-edit-dialog";
import { type SentMessage, createMockHass } from "./_test-utils.js";

function draft(): HistoryEntryDraft {
  return {
    entry_id: "e1", task_id: "t1",
    original_timestamp: "2026-08-01T10:00:00",
    type: "completed", timestamp: "2026-08-01T10:00:00",
    notes: null, cost: null, duration: null, completed_by: null,
  };
}

async function mount(deleteHandler: () => unknown = () => ({ success: true, remaining: 0 })) {
  const { hass, sent } = createMockHass({
    handlers: {
      "maintenance_supporter/parts/overview": () => ({ parts: [] }),
      "maintenance_supporter/task/history/delete": deleteHandler,
    },
  });
  const el = await fixture<MaintenanceHistoryEditDialog>(html`
    <maintenance-history-edit-dialog .hass=${hass}></maintenance-history-edit-dialog>
  `);
  el.openEdit(draft());
  await el.updateComplete;
  await new Promise((r) => setTimeout(r, 20));
  await el.updateComplete;
  return { el, sent: sent as SentMessage[] };
}

describe("history-edit dialog: delete entry (#170)", () => {
  const realConfirm = window.confirm;
  afterEach(() => { window.confirm = realConfirm; });

  it("confirms, sends the delete with the original timestamp and reports deleted", async () => {
    window.confirm = () => true;
    const { el, sent } = await mount();
    const btn = el.shadowRoot!.querySelector<HTMLButtonElement>("button.delete-entry")!;
    expect(btn, "delete button").to.exist;
    const evt = oneEvent(el, "history-entry-saved");
    btn.click();
    const detail = (await evt).detail as Record<string, unknown>;
    expect(detail).to.deep.equal({ entry_id: "e1", task_id: "t1", deleted: true });
    const del = sent.find((m) => m.type === "maintenance_supporter/task/history/delete")!;
    expect(del).to.include({ entry_id: "e1", task_id: "t1", timestamp: "2026-08-01T10:00:00" });
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector("button.delete-entry"), "dialog closed").to.not.exist;
  });

  it("sends nothing when the confirm is declined", async () => {
    window.confirm = () => false;
    const { el, sent } = await mount();
    el.shadowRoot!.querySelector<HTMLButtonElement>("button.delete-entry")!.click();
    await new Promise((r) => setTimeout(r, 20));
    expect(sent.some((m) => m.type === "maintenance_supporter/task/history/delete")).to.equal(false);
    expect(el.shadowRoot!.querySelector("button.delete-entry"), "dialog still open").to.exist;
  });

  it("keeps the dialog open with the error when the backend refuses", async () => {
    window.confirm = () => true;
    const { el } = await mount(() => { throw { code: "not_found", message: "gone" }; });
    el.shadowRoot!.querySelector<HTMLButtonElement>("button.delete-entry")!.click();
    await new Promise((r) => setTimeout(r, 30));
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".error")?.textContent ?? "").to.not.equal("");
    expect(el.shadowRoot!.querySelector("button.delete-entry")).to.exist;
  });
});
