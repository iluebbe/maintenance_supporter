/**
 * Dashboard budget display: spent totals without a maximum (#104).
 *
 * With budget tracking enabled but no monthly/yearly maximum configured,
 * the spent totals used to be invisible (a bar needs a denominator).
 * Pins: spent-only lines render without a bar, a configured maximum still
 * renders the classic bar, and the mixed case shows one of each.
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

describe("dashboard budget: spent-only display (#104)", () => {
  beforeEach(() => resetTaskSeq());

  it("no maximum set: renders spent lines without bars", async () => {
    const { el } = await mountPanel([obj("e1", [task()])], handlers({
      monthly_budget: 0, yearly_budget: 0, monthly_spent: 9, yearly_spent: 429.6,
    }));
    const items = sr(el).querySelectorAll(".budget-spent-only");
    expect(items.length).to.equal(2);
    expect(items[0].textContent).to.contain("9.00 €");
    expect(items[1].textContent).to.contain("429.60 €");
    expect(sr(el).querySelectorAll(".budget-bar").length).to.equal(0);
  });

  it("mixed: monthly maximum renders a bar, yearly stays spent-only", async () => {
    const { el } = await mountPanel([obj("e1", [task()])], handlers({
      monthly_budget: 150, yearly_budget: 0, monthly_spent: 9, yearly_spent: 429.6,
    }));
    expect(sr(el).querySelectorAll(".budget-bar").length).to.equal(1);
    const spentOnly = sr(el).querySelectorAll(".budget-spent-only");
    expect(spentOnly.length).to.equal(1);
    expect(spentOnly[0].textContent).to.contain("429.60 €");
  });
});
