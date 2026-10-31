/**
 * DRY audit 2026-10-30, FE6-A1 / BR6-A9: the battery fleet's cells count
 * when bought, whatever the household chose (S-6). The buy reminder's dialog
 * left that out and said the price would count when used, and a pool cell
 * another object took was valued as used. One rule, partCostMode's third
 * argument, as helpers/parts_cost.py part_cost_mode(owner=).
 */

import { expect } from "@open-wc/testing";
import { buildCompleteDialogArgs } from "../helpers/complete-dialog-args.js";
import { partCostMode } from "../helpers/parts-cost.js";
import { partsForCompletion } from "../helpers/shared-parts.js";

const cell = { id: "batt_aa", name: "AA battery", cost: 0.5, stock: 10 };
const fleet = { entry_id: "fleet", object: { id: "f", name: "Battery fleet", battery_fleet: true }, parts: [cell] };
const remote = { entry_id: "remote", object: { id: "r", name: "Remote" }, parts: [] };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const objects = [fleet, remote] as any[];

describe("the battery fleet's cells count when bought (FE6-A1)", () => {
  it("partCostMode says so for a part the fleet owns", () => {
    expect(partCostMode({ cost_mode: "use" }, "use", true)).to.equal("purchase");
    expect(partCostMode({ cost_mode: "use" }, "purchase")).to.equal("use");
    expect(partCostMode(null, "use")).to.equal("use");
  });

  it("the fleet's buy reminder does not claim the price counts when used", () => {
    const task = { id: "buy", name: "Buy AA battery", part_ref: { part_id: "batt_aa" } };
    const args = buildCompleteDialogArgs({
      entryId: "fleet", taskId: "buy", taskName: "Buy AA battery", task: task as never, objects, lang: "en", partsCostMode: "use",
    });
    expect(args.parts_cost_mode).to.equal("purchase");
  });

  it("a pool cell another object takes is valued as bought", () => {
    const parts = partsForCompletion({ consumes_parts: [{ part_id: "batt_aa", entry_id: "fleet", quantity: 2 }] }, "remote", objects, "en");
    const linked = parts.find((p) => p.id === "batt_aa")!;
    expect(linked.cost_mode).to.equal("purchase");
    expect(partsForCompletion(null, "fleet", objects, "en")[0].cost_mode, "the fleet's own shelf").to.equal("purchase");
  });
});
