/**
 * dialog-mount argument forwarding (bug audit 2026-08-22).
 *
 * Two Lovelace-mount defects pinned here:
 *
 *  1. openCreateTaskDialog() called the task dialog's openCreate() with NO
 *     arguments — _entryId stayed undefined and _objectChoices empty, so the
 *     card's "Add task" button produced a dialog with no object picker whose
 *     save always failed on the backend's required entry_id. The mount helper
 *     must forward the caller's entryId / object list.
 *
 *  2. openCompleteDialog() dropped taskType / readingUnit / parts /
 *     consumesParts — reading tasks opened without their value field and
 *     required_completion_fields were bypassed from the quick-actions path.
 *     And because the dialog is a singleton, omitted fields must RESET, not
 *     leak the previous task's values.
 */

import { expect, waitUntil } from "@open-wc/testing";
import { openCompleteDialog, openCreateTaskDialog } from "../dialog-mount";
import type { MaintenanceCompleteDialog } from "../components/complete-dialog";

const TASK_TAG = "maintenance-task-dialog";
const COMPLETE_TAG = "maintenance-complete-dialog";

function makeHaRoot(): HTMLElement {
  const root = document.createElement("home-assistant");
  root.attachShadow({ mode: "open" });
  (root as HTMLElement & { hass?: object }).hass = {
    language: "en",
    // Rejecting settings fetch → dialog-mount falls back to defaults and
    // still calls openCreate (a hanging promise would swallow the call).
    connection: { sendMessagePromise: () => Promise.reject(new Error("offline")) },
  };
  document.body.appendChild(root);
  return root;
}

describe("dialog-mount argument forwarding", () => {
  afterEach(() => {
    document.querySelector("home-assistant")?.remove();
    document.body.querySelector(TASK_TAG)?.remove();
    document.body.querySelector(COMPLETE_TAG)?.remove();
  });

  it("openCreateTaskDialog forwards entryId and objects to openCreate", async () => {
    const ha = makeHaRoot();
    // Pre-mount a stray dialog so we can spy on openCreate before the helper
    // runs — getOrCreate adopts it into the HA shadow root.
    const stray = document.createElement(TASK_TAG) as HTMLElement & {
      openCreate?: (...args: unknown[]) => void;
    };
    let got: unknown[] | null = null;
    stray.openCreate = (...args: unknown[]) => {
      got = args;
    };
    document.body.appendChild(stray);

    const objs = [{ entry_id: "e1", object: { name: "Boiler" } }];
    const opened = openCreateTaskDialog("", objs);
    expect(opened).to.equal(true);
    await waitUntil(() => got !== null, "openCreate called");
    expect(got![0]).to.equal("");
    expect(got![1]).to.equal(objs);
    expect(ha.shadowRoot!.querySelector(TASK_TAG), "adopted into HA root").to.exist;
  });

  it("openCreateTaskDialog forwards a quick-actions entryId", async () => {
    makeHaRoot();
    const stray = document.createElement(TASK_TAG) as HTMLElement & {
      openCreate?: (...args: unknown[]) => void;
    };
    let got: unknown[] | null = null;
    stray.openCreate = (...args: unknown[]) => {
      got = args;
    };
    document.body.appendChild(stray);

    openCreateTaskDialog("entry_42");
    await waitUntil(() => got !== null, "openCreate called");
    expect(got![0]).to.equal("entry_42");
  });

  it("openCompleteDialog passes reading fields, parts and required fields", () => {
    const ha = makeHaRoot();
    const parts = [{ id: "p1", name: "Filter", stock: 2 }];
    const consumes = [{ part_id: "p1", quantity: 1 }];
    openCompleteDialog({
      entry_id: "e1",
      task_id: "t1",
      task_name: "Read meter",
      task_type: "reading",
      reading_unit: "km",
      required_completion_fields: ["notes"],
      parts: parts as never,
      consumes_parts: consumes as never,
    });
    const dlg = ha.shadowRoot!.querySelector(COMPLETE_TAG) as MaintenanceCompleteDialog;
    expect(dlg.taskType).to.equal("reading");
    expect(dlg.readingUnit).to.equal("km");
    expect(dlg.requiredFields).to.deep.equal(["notes"]);
    expect(dlg.parts).to.equal(parts);
    expect(dlg.consumesParts).to.equal(consumes);

    // Singleton reset: omitted fields must not leak into the next open.
    openCompleteDialog({ entry_id: "e2", task_id: "t2", task_name: "Plain" });
    expect(dlg.taskType).to.equal("");
    expect(dlg.readingUnit).to.equal("");
    expect(dlg.parts).to.deep.equal([]);
    expect(dlg.consumesParts).to.deep.equal([]);
    expect(dlg.requiredFields).to.deep.equal([]);
  });

  it("openCompleteDialog forwards the tag-scan gate, restock, currency, hints and checklist ticks", () => {
    const ha = makeHaRoot();
    openCompleteDialog({
      entry_id: "e1",
      task_id: "t1",
      task_name: "Buy bags",
      require_tag_scan: true,
      restock_default: 10,
      restock_unit_cost: 1.5,
      currency_symbol: "€",
      consumes_info: ["1× HEPA (Shelf)"],
      checklist: ["A", "B"],
      checklist_prefill: { A: true },
      via_tag_scan: true,
    });
    const dlg = ha.shadowRoot!.querySelector(COMPLETE_TAG) as MaintenanceCompleteDialog;
    expect(dlg.requireTagScan).to.equal(true);
    expect(dlg.restockDefault).to.equal(10);
    expect(dlg.restockUnitCost).to.equal(1.5);
    expect(dlg.currencySymbol).to.equal("€");
    expect(dlg.consumesInfo).to.deep.equal(["1× HEPA (Shelf)"]);
    expect(dlg.checklistPrefill).to.deep.equal({ A: true });
    expect(dlg.viaTagScan).to.equal(true);

    // Singleton reset — the next task must not inherit any of it.
    (dlg as unknown as { _close: () => void })._close();
    openCompleteDialog({ entry_id: "e2", task_id: "t2", task_name: "Plain" });
    expect(dlg.requireTagScan).to.equal(false);
    expect(dlg.restockDefault).to.equal(null);
    expect(dlg.restockUnitCost).to.equal(null);
    expect(dlg.currencySymbol).to.equal("");
    expect(dlg.consumesInfo).to.deep.equal([]);
    expect(dlg.checklistPrefill).to.deep.equal({});
    expect(dlg.viaTagScan).to.equal(false);
  });
});
