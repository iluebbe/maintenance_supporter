/**
 * Reachability audit 2026-09-28, package 3 — data the backend stored and the
 * docs described, but no panel surface could set or show:
 *  - a part's notes (form state carried them, no field; rows never showed them);
 *  - the replacement lineage (object ⋮ → Replace links the retired unit and
 *    its successor; neither page linked the other);
 *  - "not sure" as a quick-complete default feedback (the complete dialog has
 *    it, the defaults did not).
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/parts-section";
import "../components/task-dialog.js";
import type { MaintenancePartsSection } from "../components/parts-section";
import type { MaintenanceTaskDialog } from "../components/task-dialog";
import type { MaintenancePart } from "../types";
import { mountPanel, obj, resetTaskSeq, sr, task } from "./_panel-utils.js";
import { createMockHass } from "./_test-utils.js";

describe("parts: notes", () => {
  const PART: MaintenancePart = { id: "p1", name: "HEPA filter", stock: 2, notes: "Order two — one always cracks" };

  async function mount(sent: Record<string, unknown>[]) {
    const el = await fixture<MaintenancePartsSection>(html`
      <maintenance-parts-section
        .hass=${{ language: "en", connection: { sendMessagePromise: async (m: Record<string, unknown>) => { sent.push(m); return {}; } } } as never}
        .entryId=${"e1"}
        .parts=${[PART]}
        .canWrite=${true}
      ></maintenance-parts-section>
    `);
    await el.updateComplete;
    return el;
  }

  it("shows a part's notes in its row", async () => {
    const el = await mount([]);
    expect(el.shadowRoot!.querySelector(".part-notes")!.textContent).to.contain("one always cracks");
  });

  it("edits them in the form and saves them", async () => {
    const sent: Record<string, unknown>[] = [];
    const el = await mount(sent);
    (el as unknown as { _openEdit(p: MaintenancePart): void })._openEdit(PART);
    await el.updateComplete;
    const area = el.shadowRoot!.querySelector<HTMLTextAreaElement>(".form-field.notes textarea")!;
    expect(area.value).to.equal(PART.notes);
    area.value = "Fits the S8 too";
    area.dispatchEvent(new Event("input"));
    await el.updateComplete;
    await (el as unknown as { _save(): Promise<void> })._save();
    const msg = sent.find((m) => m.type === "maintenance_supporter/part/update")!;
    expect(msg.notes).to.equal("Fits the S8 too");
  });
});

describe("object page: replacement lineage", () => {
  type Panel = HTMLElement & { updateComplete: Promise<unknown>; _view: string; _selectedEntryId: string | null; _showObject(id: string): void };

  it("the successor links its predecessor and back", async () => {
    resetTaskSeq();
    const old = obj("e_old", [task({ name: "Descale" })], "Old boiler");
    const next = obj("e_new", [task({ name: "Descale" })], "New boiler");
    Object.assign(old.object, { archived: true, archived_at: "2026-09-01T10:00:00", replaced_by_entry_id: "e_new" });
    Object.assign(next.object, { predecessor_entry_id: "e_old" });
    const { el } = await mountPanel([old, next]);
    const panel = el as unknown as Panel;

    panel._showObject("e_new");
    await panel.updateComplete;
    const back = sr(panel).querySelector<HTMLElement>(".object-lineage-link")!;
    expect(back.closest("p")!.textContent).to.match(/Replaces:\s*Old boiler/);
    back.click();
    await panel.updateComplete;
    expect(panel._selectedEntryId).to.equal("e_old");
    const forward = sr(panel).querySelector<HTMLElement>(".object-lineage-link")!;
    expect(forward.closest("p")!.textContent).to.match(/Replaced by:\s*New boiler/);
  });
});

describe("task dialog: quick-complete default feedback", () => {
  it("offers and keeps 'not sure'", async () => {
    const { hass, sent } = createMockHass({ handlers: { "maintenance_supporter/task/update": () => ({}) } });
    const el = await fixture<MaintenanceTaskDialog>(html`
      <maintenance-task-dialog .hass=${hass} ?completion-actions-enabled=${true}></maintenance-task-dialog>
    `);
    await el.openEdit("e", {
      id: "t1", name: "Scoop litter", type: "cleaning", schedule_type: "time_based",
      interval_days: 1, warning_days: 0, enabled: true,
      quick_complete_defaults: { feedback: "not_sure" },
    } as never);
    await el.updateComplete;
    const select = [...el.shadowRoot!.querySelectorAll<HTMLSelectElement>("select")]
      .find((s) => [...s.options].some((o) => o.value === "not_sure"))!;
    expect(select, "the defaults' feedback select offers not_sure").to.exist;
    expect(select.value).to.equal("not_sure");
    await (el as unknown as { _save(): Promise<void> })._save();
    const msg = sent.find((m) => m.type === "maintenance_supporter/task/update") as Record<string, { feedback?: string }>;
    expect(msg.quick_complete_defaults.feedback).to.equal("not_sure");
  });
});
