/**
 * helpers/complete-dialog-args — the ONE derivation every surface that opens
 * <maintenance-complete-dialog> goes through (panel, Lovelace card,
 * quick-actions dialog). Before, the Lovelace paths forwarded a subset: no
 * tag-scan gate, no restock default / unit cost, no currency, no "consumes"
 * hint lines, no in-cycle checklist ticks (audit 2026-08-29).
 */

import { expect } from "@open-wc/testing";
import { DEFAULT_CURRENCY_SYMBOL } from "../styles";
import {
  buildCompleteDialogArgs,
  fillAndOpenCompleteDialog,
  type CompleteDialogTarget,
} from "../helpers/complete-dialog-args";

const OBJECTS = [
  {
    entry_id: "e1",
    object: { name: "Vacuum" },
    parts: [{ id: "bag", name: "Dust bags", stock: 4, restock_quantity: 10, cost: 1.5 }],
  },
  {
    entry_id: "e2",
    object: { name: "Shelf" },
    parts: [{ id: "hepa", name: "HEPA", stock: 2 }],
  },
] as never;

const BASE_TASK = {
  id: "t1",
  name: "Task",
  type: "custom",
  schedule_type: "time_based",
  interval_days: 30,
  warning_days: 7,
  enabled: true,
};

function build(taskOver: Record<string, unknown>, over: Record<string, unknown> = {}) {
  return buildCompleteDialogArgs({
    entryId: "e1",
    taskId: "t1",
    taskName: "Task",
    task: { ...BASE_TASK, ...taskOver } as never,
    objects: OBJECTS,
    lang: "en",
    ...over,
  });
}

describe("buildCompleteDialogArgs", () => {
  it("buy task: restock default + unit cost, currency, no parts picker", () => {
    const args = build({ part_ref: { part_id: "bag" } }, { currencySymbol: "€" });
    expect(args.restock_default).to.equal(10);
    expect(args.restock_unit_cost).to.equal(1.5);
    expect(args.currency_symbol).to.equal("€");
    expect(args.parts).to.deep.equal([]);
    expect(args.consumes_parts).to.deep.equal([]);
  });

  it("buy task whose part is gone still restocks (default 1)", () => {
    const args = build({ part_ref: { part_id: "nope" } });
    expect(args.restock_default).to.equal(1);
    expect(args.restock_unit_cost).to.equal(null);
  });

  it("consuming task: tag-scan gate, checklist ticks, shared-pool hint + picker", () => {
    const args = build({
      require_tag_scan: true,
      checklist: ["A", "B"],
      checklist_progress: { A: true },
      consumes_parts: [{ part_id: "hepa", quantity: 1, entry_id: "e2" }],
      type: "reading",
      reading_unit: "km",
    }, { checklist: ["A", "B"] });
    expect(args.require_tag_scan).to.equal(true);
    expect(args.checklist).to.deep.equal(["A", "B"]);
    expect(args.checklist_prefill).to.deep.equal({ A: true });
    expect(args.consumes_info).to.deep.equal(["1× HEPA (Shelf) (2)"]);
    expect(args.consumes_parts).to.deep.equal([{ part_id: "hepa", quantity: 1, entry_id: "e2" }]);
    expect(args.parts!.map((p) => p.id)).to.deep.equal(["bag", "hepa"]);
    expect(args.parts![1].owner_name).to.equal("Shelf");
    expect(args.task_type).to.equal("reading");
    expect(args.reading_unit).to.equal("km");
    expect(args.restock_default).to.equal(null);
  });

  it("phase override wins; a disabled checklist feature empties the phase checklist", () => {
    const phased = {
      checklist: ["task-level"],
      phases: { flip: { name: "Flip", checklist: ["Loosen"], required_completion_fields: ["cost"] } },
      phase_sequence: ["flip"],
      phase_cursor: 0,
    };
    const on = build(phased, { checklist: ["task-level"] });
    expect(on.checklist).to.deep.equal(["Loosen"]);
    expect(on.required_completion_fields).to.deep.equal(["cost"]);
    expect(on.phase_label).to.equal("1/1 · Flip");
    const off = build(phased, { checklist: undefined, checklistsEnabled: false });
    expect(off.checklist).to.deep.equal([]);
  });

  it("no task at hand: a usable minimal bag (deep-link race)", () => {
    const args = buildCompleteDialogArgs({
      entryId: "e1", taskId: "t9", taskName: "Ghost", task: null, objects: OBJECTS, lang: "en",
    });
    expect(args.task_name).to.equal("Ghost");
    expect(args.checklist).to.deep.equal([]);
    expect(args.require_tag_scan).to.equal(false);
    expect(args.restock_default).to.equal(null);
    expect(args.via_tag_scan).to.equal(false);
    expect(args.parts_cost_mode, "default: parts count when bought").to.equal("purchase");
  });

  it("buy task of a part bought in packages names the package (#98)", () => {
    const objects = [{
      entry_id: "e1", object: { name: "Garage" },
      parts: [{ id: "spray", name: "Contact spray", unit: "ml", package_size: 400, restock_quantity: 2, cost: 12 }],
    }] as never;
    const args = build({ part_ref: { part_id: "spray" } }, { objects });
    expect(args.restock_default, "packages").to.equal(2);
    expect(args.restock_unit_cost, "per package").to.equal(12);
    expect(args.restock_package).to.equal("400 ml");
    expect(build({ part_ref: { part_id: "bag" } }).restock_package, "no package size").to.equal("");
  });

  it("forwards the household's parts cost mode (#104)", () => {
    expect(build({}, { partsCostMode: "use" }).parts_cost_mode).to.equal("use");
  });
});

describe("fillAndOpenCompleteDialog", () => {
  function target() {
    const calls: unknown[] = [];
    const dlg = {
      entryId: "", taskId: "", taskName: "", lang: "", checklist: [], adaptiveEnabled: false,
      requiredFields: [], taskType: "", readingUnit: "", parts: [], consumesParts: [],
      phaseLabel: "", requireTagScan: false, restockDefault: null, restockUnitCost: null, restockPackage: "",
      currencySymbol: "", consumesInfo: [], checklistPrefill: {}, viaTagScan: false,
      partsCostMode: "purchase",
      open: (opts?: { viaTagScan?: boolean }) => { calls.push(opts); },
    } as unknown as CompleteDialogTarget;
    return { dlg, calls };
  }

  it("assigns every field and opens with the scan flag", () => {
    const { dlg, calls } = target();
    fillAndOpenCompleteDialog(dlg, {
      entry_id: "e1", task_id: "t1", task_name: "Filter",
      checklist: ["A"], adaptive_enabled: true, required_completion_fields: ["notes"],
      task_type: "reading", reading_unit: "km", parts: [{ id: "p", name: "P" }] as never,
      consumes_parts: [{ part_id: "p", quantity: 1 }], phase_label: "1/2 · X",
      require_tag_scan: true, restock_default: 3, restock_unit_cost: 2, currency_symbol: "€",
      consumes_info: ["1× P"], checklist_prefill: { A: true }, via_tag_scan: true,
      parts_cost_mode: "use",
    }, "de");
    expect(dlg.partsCostMode).to.equal("use");
    expect(dlg.lang).to.equal("de");
    expect(dlg.requireTagScan).to.equal(true);
    expect(dlg.restockDefault).to.equal(3);
    expect(dlg.restockUnitCost).to.equal(2);
    expect(dlg.currencySymbol).to.equal("€");
    expect(dlg.consumesInfo).to.deep.equal(["1× P"]);
    expect(dlg.checklistPrefill).to.deep.equal({ A: true });
    expect(dlg.viaTagScan).to.equal(true);
    expect(calls).to.deep.equal([{ viaTagScan: true }]);
  });

  it("omitted fields RESET (singleton dialog must not leak the previous task)", () => {
    const { dlg, calls } = target();
    fillAndOpenCompleteDialog(dlg, {
      entry_id: "e1", task_id: "t1", task_name: "Filter",
      require_tag_scan: true, restock_default: 3, restock_unit_cost: 2, currency_symbol: "€",
      consumes_info: ["1× P"], checklist_prefill: { A: true }, via_tag_scan: true,
      parts_cost_mode: "use",
    }, "en");
    fillAndOpenCompleteDialog(dlg, { entry_id: "e2", task_id: "t2", task_name: "Plain" }, "en");
    expect(dlg.requireTagScan).to.equal(false);
    expect(dlg.restockDefault).to.equal(null);
    expect(dlg.restockUnitCost).to.equal(null);
    expect(dlg.restockPackage).to.equal("");
    expect(dlg.currencySymbol, "reset to the default symbol").to.equal(DEFAULT_CURRENCY_SYMBOL);
    expect(dlg.consumesInfo).to.deep.equal([]);
    expect(dlg.checklistPrefill).to.deep.equal({});
    expect(dlg.viaTagScan).to.equal(false);
    expect(dlg.partsCostMode).to.equal("purchase");
    expect(calls[1]).to.deep.equal({ viaTagScan: false });
  });
});
