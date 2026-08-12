/**
 * History-edit dialog: part consumption on the entry (#130).
 *
 * Pins: opening loads part options via parts/overview (own + this task's
 * pooled links, vanished-but-recorded parts stay selectable), the recorded
 * quantities pre-check their rows, saving sends used_parts ONLY when the
 * selection changed (with entry_id on pooled links), and an unchanged
 * selection stays out of the patch.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/history-edit-dialog.js";
import type { HistoryEntryDraft, MaintenanceHistoryEditDialog } from "../components/history-edit-dialog";
import { type SentMessage, createMockHass } from "./_test-utils.js";

const OVERVIEW = {
  parts: [
    {
      part_id: "p_own", name: "Filter", entry_id: "e1", object_name: "Machine",
      consumers: [{ entry_id: "e1", task_id: "t1" }],
    },
    {
      part_id: "p_pool", name: "Dust bags", entry_id: "e9", object_name: "Shelf",
      consumers: [{ entry_id: "e1", task_id: "t1" }],
    },
    {
      part_id: "p_other", name: "Unrelated", entry_id: "e7", object_name: "Elsewhere",
      consumers: [],
    },
  ],
};

function draft(partial: Partial<HistoryEntryDraft> = {}): HistoryEntryDraft {
  return {
    entry_id: "e1", task_id: "t1",
    original_timestamp: "2026-08-01T10:00:00",
    type: "completed", timestamp: "2026-08-01T10:00:00",
    notes: null, cost: null, duration: null, completed_by: null,
    ...partial,
  };
}

async function mountDialog(): Promise<{ el: MaintenanceHistoryEditDialog; sent: SentMessage[] }> {
  const { hass, sent } = createMockHass({
    handlers: {
      "maintenance_supporter/parts/overview": () => OVERVIEW,
      "maintenance_supporter/task/history/update": () => ({ success: true }),
    },
  });
  const el = await fixture<MaintenanceHistoryEditDialog>(html`
    <maintenance-history-edit-dialog .hass=${hass}></maintenance-history-edit-dialog>
  `);
  return { el, sent };
}

const settle = async (el: MaintenanceHistoryEditDialog) => {
  await el.updateComplete;
  await new Promise((r) => setTimeout(r, 20));
  await el.updateComplete;
};

describe("history-edit dialog parts (#130)", () => {
  it("offers own + pooled-linked parts, keeps vanished recorded parts selectable", async () => {
    const { el } = await mountDialog();
    el.openEdit(draft({
      used_parts: [{ part_id: "p_gone", name: "Old seal", quantity: 1 }],
    }));
    await settle(el);
    const labels = [...el.shadowRoot!.querySelectorAll(".part-label")].map((n) => n.textContent?.trim());
    expect(labels).to.include("Filter");
    expect(labels.some((l) => l?.startsWith("Dust bags")), "pooled option offered").to.equal(true);
    expect(labels).to.include("Old seal");
    expect(labels.some((l) => l?.includes("Unrelated")), "unlinked foreign part hidden").to.equal(false);
    const checked = [...el.shadowRoot!.querySelectorAll(".part-row-edit input[type=checkbox]")]
      .map((c) => (c as HTMLInputElement).checked);
    expect(checked.filter(Boolean).length, "only the recorded part pre-checked").to.equal(1);
  });

  it("sends the changed selection with entry_id on pooled links", async () => {
    const { el, sent } = await mountDialog();
    el.openEdit(draft({ used_parts: [{ part_id: "p_own", name: "Filter", quantity: 1 }] }));
    await settle(el);
    (el as any)._partQty = { "e1:p_own": 2, "e9:p_pool": 1 };
    await (el as any)._save();
    const msg = sent.find((m) => m.type === "maintenance_supporter/task/history/update") as any;
    expect(msg, "update sent").to.exist;
    const byId = Object.fromEntries(msg.used_parts.map((u: any) => [u.part_id, u]));
    expect(byId.p_own.quantity).to.equal(2);
    expect("entry_id" in byId.p_own, "own part carries no entry_id").to.equal(false);
    expect(byId.p_pool.entry_id).to.equal("e9");
  });

  it("an untouched selection stays out of the patch", async () => {
    const { el, sent } = await mountDialog();
    el.openEdit(draft({ used_parts: [{ part_id: "p_own", name: "Filter", quantity: 1 }], notes: "x" }));
    await settle(el);
    (el as any)._set("notes", "changed");
    await (el as any)._save();
    const msg = sent.find((m) => m.type === "maintenance_supporter/task/history/update") as any;
    expect(msg.notes).to.equal("changed");
    expect("used_parts" in msg, "no parts field without a selection change").to.equal(false);
  });
});
