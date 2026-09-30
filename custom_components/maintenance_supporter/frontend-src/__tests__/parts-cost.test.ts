/** helpers/parts-cost — the browser's copy of the backend's spare-parts
 * money (#104) and package arithmetic (#98). The panel sums history in the
 * browser (object history, area report, service record); these cases are
 * the ones tests/test_parts_cost_and_packages.py pins on the backend, so the
 * two stay equal to the cent. */

import { expect } from "@open-wc/testing";
import { entrySpend, partsCostModeOf, restockUnits, unitPrice } from "../helpers/parts-cost.js";
import { mergeObjectHistory, objectHistoryTotals } from "../helpers/object-history.js";

describe("unitPrice (#98)", () => {
  it("spreads a package price over its contents", () => {
    // A 400 ml can at 12 → 0.03 per ml.
    expect(unitPrice({ cost: 12, package_size: 400 })).to.be.closeTo(0.03, 1e-9);
  });

  it("is the plain price without a package size", () => {
    expect(unitPrice({ cost: 15, package_size: null })).to.equal(15);
    expect(unitPrice({ cost: 15 } as never)).to.equal(15);
  });

  it("is null without a price", () => {
    expect(unitPrice({ cost: null, package_size: 400 })).to.equal(null);
    expect(unitPrice(null)).to.equal(null);
  });
});

describe("restockUnits (#98)", () => {
  it("packages × size", () => {
    expect(restockUnits({ restock_quantity: 2, package_size: 400 })).to.equal(800);
    expect(restockUnits({ restock_quantity: 2, package_size: 400 }, 3)).to.equal(1200);
  });

  it("one package is one unit without a size — the old behaviour", () => {
    expect(restockUnits({ restock_quantity: 5, package_size: null })).to.equal(5);
    expect(restockUnits({ restock_quantity: null, package_size: null } as never)).to.equal(1);
  });
});

describe("entrySpend (#104)", () => {
  it("an entry booked when bought counts its typed cost, never its parts", () => {
    expect(entrySpend({ cost: 20, parts_cost: 15 })).to.equal(20);
    expect(entrySpend({ parts_cost: 15 } as never)).to.equal(null);
  });

  it("an entry booked when used counts its parts on top of its own cost", () => {
    expect(entrySpend({ cost: 5, parts_cost: 15, cost_basis: "use" })).to.equal(20);
    expect(entrySpend({ parts_cost: 15, cost_basis: "use" } as never)).to.equal(15);
  });

  it("a purchase booked when used is stock, not spending", () => {
    expect(entrySpend({ cost: 30, purchase: true, cost_basis: "use" } as never)).to.equal(null);
    expect(entrySpend({ cost: 30, purchase: true } as never), "when bought, it is the spending").to.equal(30);
  });

  it("reads the setting defensively", () => {
    expect(partsCostModeOf("use")).to.equal("use");
    expect(partsCostModeOf("purchase")).to.equal("purchase");
    expect(partsCostModeOf(undefined)).to.equal("purchase");
    expect(partsCostModeOf("bogus")).to.equal("purchase");
  });
});

describe("object history totals follow entrySpend (#104)", () => {
  // A year of a filter: bought two for 30 when bought, then (after the
  // switch) one change booked when used and one more purchase.
  const TASKS = [
    {
      id: "buy",
      name: "Buy filters",
      history: [
        { timestamp: "2026-01-05T09:00:00+00:00", type: "completed", cost: 30, purchase: true },
        { timestamp: "2026-06-05T09:00:00+00:00", type: "completed", cost: 32, purchase: true, cost_basis: "use" },
      ],
    },
    {
      id: "swap",
      name: "Change filter",
      history: [
        { timestamp: "2026-02-01T09:00:00+00:00", type: "completed", parts_cost: 15 },
        { timestamp: "2026-07-01T09:00:00+00:00", type: "completed", cost: 4, parts_cost: 16, cost_basis: "use" },
      ],
    },
  ] as never[];

  it("each row carries what it counts, its parts and a purchase moved to stock", () => {
    const rows = mergeObjectHistory(TASKS as never);
    const byTime = Object.fromEntries(rows.map((r) => [r.timestamp.slice(0, 10), r]));
    expect(byTime["2026-01-05"].cost).to.equal(30);
    expect(byTime["2026-01-05"].purchaseCost).to.equal(null);
    expect(byTime["2026-02-01"].cost, "parts shown, counted at purchase").to.equal(null);
    expect(byTime["2026-02-01"].partsCost).to.equal(15);
    expect(byTime["2026-02-01"].partsCounted).to.equal(false);
    expect(byTime["2026-06-05"].cost).to.equal(null);
    expect(byTime["2026-06-05"].purchaseCost).to.equal(32);
    expect(byTime["2026-07-01"].cost).to.equal(20);
    expect(byTime["2026-07-01"].partsCounted).to.equal(true);
  });

  it("the total never counts a filter twice", () => {
    const totals = objectHistoryTotals(mergeObjectHistory(TASKS as never));
    // 30 (bought, old rule) + 20 (used, new rule) — not + 15 + 32.
    expect(totals.totalCost).to.equal(50);
  });
});
