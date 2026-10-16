/**
 * Bug audit 2026-10-16, tranche 2 — frontend regressions. Every test fails
 * on the code before the fix.
 *
 * - P2: "No notifications" of the task edited before carried into New task.
 * - P3: a part edit sent the stock from when the form was opened.
 * - P4: tapping a checklist item's text ticked and unticked it at once.
 * - FE-3: the card filtered objects by name — a rename emptied it, and the
 *   editor hid the stale name; the editor now stores entry ids.
 */

import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import "../components/complete-dialog.js";
import "../components/parts-section.js";
import "../components/task-dialog.js";
import "../maintenance-card.js";
import "../maintenance-card-editor.js";
import type { MaintenanceCompleteDialog } from "../components/complete-dialog";
import type { MaintenancePartsSection } from "../components/parts-section";
import type { MaintenanceTaskDialog } from "../components/task-dialog";
import type { MaintenanceSupporterCard } from "../maintenance-card";
import type { MaintenancePart } from "../types";
import { type SentMessage, createMockHass } from "./_test-utils.js";

describe("P2: a new task starts with notifications on", () => {
  it("openCreate after editing a silenced task", async () => {
    const { hass } = createMockHass();
    const el = await fixture<MaintenanceTaskDialog>(html`<maintenance-task-dialog .hass=${hass}></maintenance-task-dialog>`);
    await el.openEdit("e1", {
      id: "t1", name: "Quiet", type: "custom", schedule_type: "time_based", interval_days: 30,
      warning_days: 7, enabled: true, notify_enabled: false,
    } as never);
    expect((el as unknown as Record<string, unknown>)._notifyEnabled).to.equal(false);
    await el.openCreate("e1", []);
    expect((el as unknown as Record<string, unknown>)._notifyEnabled).to.equal(true);
  });
});

describe("P3: a part edit sends the stock only when it was changed", () => {
  const PART: MaintenancePart = { id: "p1", name: "Salt", stock: 4, is_low: false, reuse: "charge", restoring: 1 } as MaintenancePart;

  async function editAndSave(change: (form: Record<string, unknown>) => void): Promise<SentMessage> {
    const sent: SentMessage[] = [];
    const hass = { language: "en", connection: { sendMessagePromise: async (m: SentMessage) => { sent.push(m); return {}; } } };
    const el = await fixture<MaintenancePartsSection>(html`
      <maintenance-parts-section .hass=${hass as never} .entryId=${"e1"} .parts=${[PART]} .canWrite=${true}></maintenance-parts-section>
    `);
    const priv = el as unknown as Record<string, unknown> & { _openEdit(p: MaintenancePart): void; _save(): Promise<void> };
    priv._openEdit(PART);
    change(priv._editing as Record<string, unknown>);
    await priv._save();
    return sent.find((m) => m.type === "maintenance_supporter/part/update")!;
  }

  it("a renamed part keeps the stock as it is now", async () => {
    const msg = await editAndSave((f) => { f.name = "Salt tablets"; });
    expect(msg).to.not.have.property("stock");
    expect(msg).to.not.have.property("restoring");
    expect(msg.name).to.equal("Salt tablets");
  });

  it("a changed count is sent", async () => {
    const msg = await editAndSave((f) => { f.stock = "6"; f.restoring = "0"; });
    expect(msg.stock).to.equal(6);
    expect(msg.restoring).to.equal(0);
  });
});

describe("P4: a checklist item ticks by its text", () => {
  it("one tap on the text ticks it once", async () => {
    const { hass } = createMockHass();
    const el = await fixture<MaintenanceCompleteDialog>(html`
      <maintenance-complete-dialog .hass=${hass} .entryId=${"e1"} .taskId=${"t1"} .taskName=${"Filter"} .lang=${"en"}
        .checklist=${["Drain", "Refill"]}></maintenance-complete-dialog>
    `);
    el.open();
    await el.updateComplete;
    const text = el.shadowRoot!.querySelectorAll<HTMLElement>(".checklist-item span")[1];
    text.click();
    await el.updateComplete;
    expect((el as unknown as Record<string, unknown>)._checklistState).to.deep.equal({ "1": true });
    const box = el.shadowRoot!.querySelectorAll<HTMLInputElement>(".checklist-item input")[1];
    box.click();
    await el.updateComplete;
    expect((el as unknown as Record<string, Record<string, boolean>>)._checklistState["1"]).to.not.equal(true);
  });
});

describe("FE-3: the card keeps its objects across a rename", () => {
  const OBJECTS = [
    { entry_id: "e1", object: { id: "o1", name: "Dishwasher (new name)" }, tasks: [{ id: "t1", name: "Clean filter", status: "overdue", days_until_due: -1, type: "cleaning" }] },
    { entry_id: "e2", object: { id: "o2", name: "Oven" }, tasks: [{ id: "t2", name: "Descale", status: "overdue", days_until_due: -1, type: "cleaning" }] },
  ];

  function hassWith() {
    return createMockHass({ handlers: { "maintenance_supporter/objects": () => ({ objects: OBJECTS }) } }).hass;
  }

  it("filter_objects matches an entry id as well as a name", async () => {
    const el = await fixture<MaintenanceSupporterCard>(html`<maintenance-supporter-card></maintenance-supporter-card>`);
    el.setConfig({ type: "custom:maintenance-supporter-card", filter_objects: ["e1", "Oven"] } as never);
    el.hass = hassWith() as never;
    await waitUntil(() => ((el as unknown as Record<string, unknown[]>)._objects || []).length > 0);
    const names = (el as unknown as { _selectedTasks: Array<{ task: { name: string } } | { name: string }> })._selectedTasks
      .map((r) => ("task" in r ? r.task.name : r.name));
    expect(names).to.have.members(["Clean filter", "Descale"]);
  });

  it("the editor stores entry ids, replaces an old name and shows a stale one", async () => {
    const el = await fixture(html`<maintenance-supporter-card-editor></maintenance-supporter-card-editor>`);
    const editor = el as unknown as HTMLElement & Record<string, unknown> & { setConfig(c: unknown): void; updateComplete: Promise<unknown> };
    editor.setConfig({ type: "custom:maintenance-supporter-card", filter_objects: ["Oven", "Dishwasher"] });
    editor.hass = hassWith() as never;
    await waitUntil(() => ((editor._objects as unknown[]) || []).length > 0);
    await editor.updateComplete;
    const changes: unknown[] = [];
    editor.addEventListener("config-changed", (e) => changes.push((e as CustomEvent).detail.config));

    const rows = [...editor.shadowRoot!.querySelectorAll<HTMLElement>(".object-row")];
    const oven = rows.find((r) => r.textContent?.includes("Oven"))!;
    expect(oven.querySelector("input")!.checked, "a name from an older config still ticks its object").to.equal(true);
    const stale = rows.find((r) => r.classList.contains("stale"))!;
    expect(stale.textContent).to.contain("Dishwasher");

    const renamed = rows.find((r) => r.textContent?.includes("Dishwasher (new name)"))!;
    const box = renamed.querySelector("input")!;
    box.checked = true;
    box.dispatchEvent(new Event("change"));
    expect((changes.at(-1) as { filter_objects: string[] }).filter_objects).to.have.members(["Oven", "Dishwasher", "e1"]);

    const ovenBox = oven.querySelector("input")!;
    ovenBox.checked = true;
    ovenBox.dispatchEvent(new Event("change"));
    expect((changes.at(-1) as { filter_objects: string[] }).filter_objects).to.have.members(["Dishwasher", "e1", "e2"]);

    await editor.updateComplete;
    const staleNow = editor.shadowRoot!.querySelector<HTMLElement>(".object-row.stale")!;
    const staleBox = staleNow.querySelector("input")!;
    staleBox.checked = false;
    staleBox.dispatchEvent(new Event("change"));
    expect((changes.at(-1) as { filter_objects: string[] }).filter_objects).to.have.members(["e1", "e2"]);
  });
});
