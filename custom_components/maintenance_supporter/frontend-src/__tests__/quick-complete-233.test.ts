/**
 * #233: Quick complete, a task that completes in one tap. A household's
 * kitchen tablet wanted chores closed without the dialog, which asked them
 * nothing; the quick-complete QR code did that, and nothing else.
 *
 * Pins: the task dialog's switch (saved as {} on without a prefill, null
 * off) and its hints; every Complete in the panel, on the card and in the
 * card's quick actions completes a Quick-complete task in one tap
 * (task/quick_complete, source panel) and opens the dialog when the server
 * says the task needs it; Complete with details… and a past completion
 * always ask; the dialog starts with the prefill; the open circle marks a
 * task that completes in one tap; bulk edit switches it for many tasks.
 */

import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import { render } from "lit";
import "../components/task-dialog.js";
import "../components/complete-dialog.js";
import "../components/bulk-edit-dialog.js";
import "../maintenance-card.js";
import type { MaintenanceTaskDialog } from "../components/task-dialog";
import type { MaintenanceCompleteDialog } from "../components/complete-dialog";
import type { MaintenanceBulkEditDialog } from "../components/bulk-edit-dialog";
import type { MaintenanceSupporterCard } from "../maintenance-card";
import { buildCompleteDialogArgs, fillAndOpenCompleteDialog } from "../helpers/complete-dialog-args";
import { quickCompleteOn, quickCompleteValues } from "../helpers/quick-complete";
import { type SentMessage, createMockHass } from "./_test-utils.js";
import { mountPanel, obj, resetTaskSeq, sr, task } from "./_panel-utils.js";

type Priv = HTMLElement & { updateComplete: Promise<unknown>; [k: string]: any }; // eslint-disable-line @typescript-eslint/no-explicit-any

const base = { id: "t1", name: "Empty the filter", type: "custom", schedule_type: "time_based", interval_days: 7, warning_days: 1, enabled: true };
const quickMsgs = (sent: SentMessage[]) => sent.filter((m) => m.type === "maintenance_supporter/task/quick_complete");

describe("#233: the switch", () => {
  it("is the presence of the prefill, an empty one included", () => {
    expect(quickCompleteOn({ quick_complete_defaults: {} })).to.equal(true);
    expect(quickCompleteOn({ quick_complete_defaults: null })).to.equal(false);
    expect(quickCompleteOn({})).to.equal(false);
    expect(quickCompleteValues({ quick_complete_defaults: { cost: 2 } })).to.deep.equal({ cost: 2 });
    expect(quickCompleteValues({})).to.equal(null);
  });

  it("the task dialog saves it on without a prefill, off as null, and says what a tap cannot answer", async () => {
    const { hass, sent } = createMockHass({ handlers: { "maintenance_supporter/task/update": () => ({}) } });
    const el = await fixture<Priv>(html`<maintenance-task-dialog .hass=${hass}></maintenance-task-dialog>`);
    await (el as unknown as MaintenanceTaskDialog).openEdit("e1", { ...base, required_completion_fields: ["photo"] } as never);
    await el.updateComplete;
    const box = () => el.shadowRoot!.querySelector<HTMLInputElement>(".quick-complete-switch input")!;
    expect(box().checked).to.equal(false);
    expect(el.shadowRoot!.querySelector("details.quick-complete-values"), "no prefill while off").to.equal(null);
    box().click();
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".quick-complete-note")!.textContent).to.contain("Photo");
    await el._save();
    const update = (sent as SentMessage[]).filter((m) => m.type === "maintenance_supporter/task/update").at(-1) as Record<string, unknown>;
    expect(update.quick_complete_defaults).to.deep.equal({});
    await (el as unknown as MaintenanceTaskDialog).openEdit("e1", { ...base, quick_complete_defaults: { cost: 3 } } as never);
    await el.updateComplete;
    expect(box().checked).to.equal(true);
    box().click();
    await el.updateComplete;
    await el._save();
    const off = (sent as SentMessage[]).filter((m) => m.type === "maintenance_supporter/task/update").at(-1) as Record<string, unknown>;
    expect(off.quick_complete_defaults).to.equal(null);
  });
});

describe("#233: one tap in the panel", () => {
  async function panel(handlers: Record<string, (msg: SentMessage) => unknown> = {}) {
    resetTaskSeq();
    const quick = task({ name: "Empty the filter", quick_complete_defaults: {} });
    const plain = task({ name: "Descale" });
    const { el, sent } = await mountPanel([obj("e1", [quick, plain], "Dishwasher")], {
      "maintenance_supporter/task/quick_complete": () => ({ success: true, via: "quick", undo: true }),
      ...handlers,
    });
    return { el: el as Priv, sent: sent as SentMessage[], quick, plain };
  }

  it("completes a Quick-complete task without the dialog; the others open it", async () => {
    const { el, sent, quick, plain } = await panel();
    el._openCompleteDialog("e1", quick.id, quick.name);
    await waitUntil(() => quickMsgs(sent).length === 1, "quick sent", { timeout: 4000 });
    expect(quickMsgs(sent)[0]).to.include({ entry_id: "e1", task_id: quick.id, source: "panel" });
    el._openCompleteDialog("e1", plain.id, plain.name);
    const dlg = () => sr(el).querySelector<Priv>("maintenance-complete-dialog");
    await waitUntil(() => dlg()?._open === true, "the dialog opens", { timeout: 10000 });
    expect(dlg()!.taskId).to.equal(plain.id);
    expect(quickMsgs(sent)).to.have.length(1);
  });

  it("Complete with details… and the server's 'needs the dialog' open the dialog", async () => {
    const { el, sent, quick } = await panel({
      "maintenance_supporter/task/quick_complete": () => { throw { code: "completion_details_required", message: "Photo" }; },
    });
    const dlg = () => sr(el).querySelector<Priv>("maintenance-complete-dialog");
    el._openCompleteDialog("e1", quick.id, quick.name, undefined, false, { details: true });
    await waitUntil(() => dlg()?._open === true, "details open the dialog", { timeout: 10000 });
    expect(quickMsgs(sent)).to.have.length(0);
    dlg()!._open = false;
    el._openCompleteDialog("e1", quick.id, quick.name);
    await waitUntil(() => quickMsgs(sent).length === 1 && dlg()?._open === true, "the refusal falls back to the dialog", { timeout: 4000 });
    expect(dlg()!.viaTagScan, "a tap is not a scan").to.equal(false);
  });

  it("marks a Quick-complete task with an open circle", async () => {
    const { el } = await panel();
    el._rowActionStyle = "icons";
    const host = document.createElement("div");
    render(el._renderRowActions("en", () => undefined, undefined, false, true), host);
    expect(host.querySelector(".btn-complete.quick ha-icon")!.getAttribute("icon")).to.equal("mdi:checkbox-blank-circle-outline");
    render(el._renderRowActions("en", () => undefined, undefined, false, false), host);
    expect(host.querySelector(".btn-complete ha-icon")!.getAttribute("icon")).to.equal("mdi:check");
  });
});

describe("#233: the card and the dialog", () => {
  it("the card completes a Quick-complete task in one tap and opens the dialog when told to", async () => {
    const objects = [{
      entry_id: "e1",
      object: { id: "e1", name: "Dishwasher" },
      tasks: [{ ...base, status: "overdue", days_until_due: -1, quick_complete_defaults: {} }],
    }];
    const sent: SentMessage[] = [];
    let refuse = false;
    const el = await fixture<MaintenanceSupporterCard & Priv>(html`<maintenance-supporter-card></maintenance-supporter-card>`);
    el.setConfig({ type: "custom:maintenance-supporter-card", action_style: "icons" } as never);
    el.hass = {
      language: "en",
      user: { id: "u1", name: "Ann", is_admin: true, is_owner: true },
      connection: {
        sendMessagePromise: async (msg: SentMessage) => {
          sent.push(msg);
          if (msg.type === "maintenance_supporter/objects") return { objects };
          if (msg.type === "maintenance_supporter/task/quick_complete") {
            if (refuse) throw { code: "completion_details_required", message: "Photo" };
            return { success: true, undo: true };
          }
          return { overdue: 0, due_soon: 0, triggered: 0, ok: 0, total: 0 };
        },
        subscribeMessage: async () => () => {},
      },
    } as never;
    await waitUntil(() => el.shadowRoot!.querySelector(".complete-btn"), "row renders", { timeout: 2000 });
    const btn = el.shadowRoot!.querySelector<HTMLElement>(".complete-btn")!;
    expect(btn.classList.contains("quick")).to.equal(true);
    expect(btn.querySelector("ha-icon")!.getAttribute("icon")).to.equal("mdi:checkbox-blank-circle-outline");
    btn.click();
    await waitUntil(() => quickMsgs(sent).length === 1, "quick sent", { timeout: 2000 });
    const dlg = el.shadowRoot!.querySelector<Priv>("maintenance-complete-dialog")!;
    expect(dlg._open).to.equal(false);
    refuse = true;
    el.shadowRoot!.querySelector<HTMLElement>(".complete-btn")!.click();
    await waitUntil(() => dlg._open === true, "the dialog after all", { timeout: 2000 });
  });

  it("the completion dialog starts with the prefill", async () => {
    const { hass } = createMockHass();
    const dlg = await fixture<Priv>(html`<maintenance-complete-dialog .hass=${hass}></maintenance-complete-dialog>`);
    const target = dlg as unknown as MaintenanceCompleteDialog;
    const args = buildCompleteDialogArgs({
      entryId: "e1", taskId: "t1", taskName: "Filter",
      task: { ...base, quick_complete_defaults: { notes: "Rinsed", cost: 12.5, duration: 10, feedback: "not_needed" } } as never,
      objects: [], lang: "en",
    });
    fillAndOpenCompleteDialog(target, args, "en");
    expect([dlg._notes, dlg._cost, dlg._duration, dlg._feedback]).to.deep.equal(["Rinsed", "12.5", "10", "not_needed"]);
    dlg._open = false;
    fillAndOpenCompleteDialog(target, buildCompleteDialogArgs({ entryId: "e1", taskId: "t2", taskName: "Other", task: base as never, objects: [], lang: "en" }), "en");
    expect([dlg._notes, dlg._cost, dlg._feedback], "no prefill leaks into the next task").to.deep.equal(["", "", "needed"]);
  });

  it("bulk edit switches Quick complete for the selected tasks", async () => {
    const { hass } = createMockHass();
    const el = await fixture<MaintenanceBulkEditDialog>(html`<maintenance-bulk-edit-dialog .hass=${hass}></maintenance-bulk-edit-dialog>`);
    const pending = el.open("edit", [{ entry_id: "e1", task_id: "t1", labels: [] }] as never[], []);
    await el.updateComplete;
    el.shadowRoot!.querySelector<HTMLInputElement>("input.set-quick")!.click();
    await el.updateComplete;
    el.shadowRoot!.querySelector<HTMLElement>("ha-button.apply")!.click();
    expect(await pending).to.deep.equal({ quick_complete: true });
  });
});
