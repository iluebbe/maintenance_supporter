/**
 * Bug audit 2026-09-12, finding 8: the budget section card's progress line
 * formatted the spent half with a pinned 0 decimals while the budget half
 * followed the "Decimal places for amounts" setting ("65 / 100.00 €"). Both
 * halves now follow the setting.
 */
import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import "../components/budget-section-card.js";
import type { MaintenanceBudgetSectionCard } from "../components/budget-section-card";
import { setCurrencyDecimals } from "../styles";
import { createMockHass } from "./_test-utils.js";

async function mount(status: Record<string, unknown>) {
  const { hass } = createMockHass({
    handlers: { "maintenance_supporter/budget_status": () => ({ alert_threshold_pct: 80, currency_symbol: "€", ...status }) },
  });
  const el = await fixture<MaintenanceBudgetSectionCard>(html`<maintenance-budget-section-card></maintenance-budget-section-card>`);
  el.setConfig({ type: "custom:maintenance-budget-section-card" } as never);
  el.hass = hass as never;
  await waitUntil(() => !!el.shadowRoot!.querySelector(".track"), "budget tracks render", { timeout: 2000 });
  await el.updateComplete;
  return el;
}

const numbers = (el: MaintenanceBudgetSectionCard) =>
  [...el.shadowRoot!.querySelectorAll(".track-numbers")].map((n) => n.textContent!.replace(/\s+/g, " ").trim());

describe("budget-section-card: spent and budget share the decimals setting (bug audit 2026-09-12)", () => {
  afterEach(() => setCurrencyDecimals(0));

  it("2 decimals: both halves of the bar line and the spent-only line carry them", async () => {
    const el = await mount({ currency_decimals: 2, monthly_budget: 100, monthly_spent: 65.5, yearly_budget: 0, yearly_spent: 429.6 });
    expect(numbers(el)).to.deep.equal(["65.50 / 100.00 €", "429.60 €"]);
  });

  it("0 decimals (default) keeps the old rendering", async () => {
    const el = await mount({ currency_decimals: 0, monthly_budget: 100, monthly_spent: 65.5, yearly_budget: 0, yearly_spent: 429.6 });
    expect(numbers(el)).to.deep.equal(["66 / 100 €", "430 €"]);
  });
});
