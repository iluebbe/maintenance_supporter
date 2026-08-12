/**
 * All-parts view (#130): the instance-wide parts table.
 *
 * Pins: the view loads `parts/overview` and renders one row per part with
 * owner, stock (unit-suffixed), low indicator and consumer chips (pooled
 * links dashed/prefixed); a row click navigates to the owning object; the
 * All-objects view carries the sibling chip that opens this view.
 */

import { expect } from "@open-wc/testing";
import { mountPanel, obj, resetTaskSeq, sr, task } from "./_panel-utils.js";

const ROWS = [
  {
    part_id: "p1", entry_id: "e1", object_name: "Shelf", name: "Dust bags",
    unit: "pcs", cost: 12.5, storage_location: "Basement", vendor: null,
    reorder_threshold: 2, stock: 1, low: true,
    consumers: [
      { entry_id: "e1", object_name: "Shelf", task_id: "t1", task_name: "Service", quantity: 1, pooled: false },
      { entry_id: "e2", object_name: "Vacuum", task_id: "t2", task_name: "Clean", quantity: 2, pooled: true },
    ],
  },
  {
    part_id: "p2", entry_id: "e2", object_name: "Vacuum", name: "Filter",
    unit: null, cost: null, storage_location: null, vendor: null,
    reorder_threshold: null, stock: null, low: false, consumers: [],
  },
];

const handlers = {
  "maintenance_supporter/parts/overview": () => ({ parts: ROWS, count: ROWS.length }),
};

describe("all-parts view (#130)", () => {
  beforeEach(() => resetTaskSeq());

  it("renders the table with stock, low icon and consumer chips", async () => {
    const { el } = await mountPanel([obj("e1", [task()])], handlers);
    (el as any)._showAllParts();
    await (el as any).updateComplete;
    await new Promise((r) => setTimeout(r, 20));
    await (el as any).updateComplete;

    const rows = sr(el).querySelectorAll(".objects-table tbody tr");
    expect(rows.length).to.equal(2);
    expect(rows[0].textContent).to.contain("Dust bags");
    expect(rows[0].textContent).to.contain("1 pcs");
    expect(rows[0].querySelector(".part-low-icon"), "low icon on row 1").to.exist;
    const chips = rows[0].querySelectorAll(".part-consumer-chip");
    expect(chips.length).to.equal(2);
    expect(chips[1].classList.contains("pooled")).to.equal(true);
    expect(chips[1].textContent).to.contain("Vacuum");
    expect(rows[1].querySelector(".part-low-icon"), "no low icon without threshold").to.equal(null);
  });

  it("row click navigates to the owning object", async () => {
    const { el } = await mountPanel([obj("e1", [task()])], handlers);
    (el as any)._showAllParts();
    await (el as any).updateComplete;
    await new Promise((r) => setTimeout(r, 20));
    await (el as any).updateComplete;
    (sr(el).querySelector(".objects-table tbody tr") as HTMLElement).click();
    await (el as any).updateComplete;
    expect((el as any)._view).to.equal("object");
    expect((el as any)._selectedEntryId).to.equal("e1");
  });

  it("the All-objects view links here via the sibling chip", async () => {
    const { el } = await mountPanel([obj("e1", [task()])], handlers);
    (el as any)._showAllObjects();
    await (el as any).updateComplete;
    const chip = sr(el).querySelector(".sibling-view-chip") as HTMLElement;
    expect(chip, "sibling chip present").to.exist;
    chip.click();
    await (el as any).updateComplete;
    expect((el as any)._view).to.equal("all_parts");
  });
});
