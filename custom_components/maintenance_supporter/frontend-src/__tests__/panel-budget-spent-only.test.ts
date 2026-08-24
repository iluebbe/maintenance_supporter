/**
 * Budget KPI tiles: spent totals without a maximum (#104, layout #125).
 *
 * With budget tracking enabled but no monthly/yearly maximum configured,
 * the spent totals used to be invisible (a bar needs a denominator).
 * Since #125 the budgets render as KPI tiles in the stats strip; the #104
 * semantics survive the move: a tile without a maximum shows the plain
 * spent total and no bar, a configured maximum keeps its mini bar, and the
 * mixed case shows one of each.
 */

import { expect } from "@open-wc/testing";
import { DEFAULT_FEATURES, DEFAULT_SETTINGS_RESPONSE } from "./_test-utils.js";
import { mountPanel, obj, resetTaskSeq, sr, task } from "./_panel-utils.js";

function handlers(budget: Record<string, unknown>) {
  return {
    "maintenance_supporter/settings": () => ({
      ...DEFAULT_SETTINGS_RESPONSE,
      features: { ...DEFAULT_FEATURES, budget: true },
    }),
    "maintenance_supporter/budget_status": () => ({
      alert_threshold_pct: 80,
      currency_symbol: "€",
      ...budget,
    }),
  };
}

describe("budget KPI tiles: spent-only display (#104)", () => {
  beforeEach(() => resetTaskSeq());

  it("no maximum set: tiles show spent totals without bars", async () => {
    const { el } = await mountPanel([obj("e1", [task()])], handlers({
      monthly_budget: 0, yearly_budget: 0, monthly_spent: 9, yearly_spent: 429.6,
    }));
    const tiles = sr(el).querySelectorAll(".budget-tile");
    expect(tiles.length).to.equal(2);
    expect(tiles[0].textContent).to.contain("9.00 €");
    expect(tiles[1].textContent).to.contain("429.60 €");
    expect(sr(el).querySelectorAll(".budget-tile-bar").length).to.equal(0);
  });

  it("mixed: monthly maximum renders a mini bar, yearly stays spent-only", async () => {
    const { el } = await mountPanel([obj("e1", [task()])], handlers({
      monthly_budget: 150, yearly_budget: 0, monthly_spent: 9, yearly_spent: 429.6,
    }));
    const tiles = sr(el).querySelectorAll(".budget-tile");
    expect(tiles.length).to.equal(2);
    expect(sr(el).querySelectorAll(".budget-tile-bar").length).to.equal(1);
    // 2026-08-24: the spent amount carries the full stat-value typography
    // (same size as the other KPI chips); the "/ max" ratio is its own
    // small line so it can't overflow the grid cell.
    expect(tiles[0].querySelector(".stat-value")!.textContent).to.contain("9.00 €");
    expect(tiles[0].querySelector(".budget-tile-max")!.textContent).to.contain("/ 150 €");
    expect(tiles[1].textContent).to.contain("429.60 €");
    expect(tiles[1].querySelector(".budget-tile-max"), "spent-only tile has no ratio line").to.equal(null);
  });

  it("tiles live INSIDE the stats strip (#125)", async () => {
    const { el } = await mountPanel([obj("e1", [task()])], handlers({
      monthly_budget: 150, yearly_budget: 1500, monthly_spent: 9, yearly_spent: 429.6,
    }));
    const strip = sr(el).querySelector(".stats-bar");
    expect(strip, "stats strip rendered").to.exist;
    expect(strip!.querySelectorAll(".budget-tile").length).to.equal(2);
  });
});
