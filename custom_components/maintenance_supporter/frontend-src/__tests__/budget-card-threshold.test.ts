/**
 * Tests for <maintenance-budget-section-card>'s spending display.
 *
 * Two defects this pins against coming back:
 *
 *  1. The amber step was hard-coded to 80 % while the card's own
 *     `budget_status` payload carries the CONFIGURED
 *     `alert_threshold_pct` (the panel's bar has always honoured it).
 *     A household on a 60 % alert got no warning until 80 %, and one on
 *     90 % got a false alarm at 80 %.
 *  2. #104 (budget tracking without a maximum) never landed on this card:
 *     it rendered "9 / 0 €" over a permanently empty bar instead of the
 *     panel's plain spent line.
 *
 * Mounted the way Lovelace does — setConfig() first, then hass.
 */

import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import "../components/budget-section-card.js";
import type { MaintenanceBudgetSectionCard } from "../components/budget-section-card";
import { createMockHass } from "./_test-utils.js";

const BASE_STATUS = {
  monthly_budget: 0,
  monthly_spent: 0,
  yearly_budget: 0,
  yearly_spent: 0,
  alert_threshold_pct: 80,
  currency_symbol: "€",
};

async function mount(status: Record<string, unknown> = {}) {
  const { hass, sent } = createMockHass({
    handlers: {
      "maintenance_supporter/budget_status": () => ({ ...BASE_STATUS, ...status }),
    },
  });
  const el = await fixture<MaintenanceBudgetSectionCard>(
    html`<maintenance-budget-section-card></maintenance-budget-section-card>`
  );
  el.setConfig({ type: "custom:maintenance-budget-section-card" } as never);
  el.hass = hass as never;
  await waitUntil(
    () => !!el.shadowRoot!.querySelector(".track"),
    "budget tracks render",
    { timeout: 2000 }
  );
  await el.updateComplete;
  return { el, sent };
}

const root = (el: MaintenanceBudgetSectionCard) => el.shadowRoot!;
const tracks = (el: MaintenanceBudgetSectionCard) => [...root(el).querySelectorAll(".track")];
const numbersOf = (track: Element) =>
  track.querySelector(".track-numbers")!.textContent!.replace(/\s+/g, " ").trim();
const levelOf = (track: Element) => {
  const cls = track.querySelector(".track-numbers")!.classList;
  return ["ok", "warning", "danger"].find((c) => cls.contains(c)) ?? "";
};

describe("budget-section-card: configured alert threshold", () => {
  it("goes amber at 65 % when the configured threshold is 60 %", async () => {
    const { el } = await mount({
      alert_threshold_pct: 60, monthly_budget: 100, monthly_spent: 65,
    });
    const monthly = tracks(el)[0];
    expect(levelOf(monthly), "warning at 65 % with a 60 % threshold").to.equal("warning");
    expect(monthly.querySelector(".bar-fill")!.classList.contains("warning")).to.be.true;
    expect(numbersOf(monthly)).to.equal("65 / 100 €");
  });

  it("stays green below the configured threshold", async () => {
    const { el } = await mount({
      alert_threshold_pct: 60, monthly_budget: 100, monthly_spent: 55,
    });
    expect(levelOf(tracks(el)[0])).to.equal("ok");
  });

  it("a 90 % threshold keeps 85 % green (the old literal 80 warned here)", async () => {
    const { el } = await mount({
      alert_threshold_pct: 90, yearly_budget: 1000, yearly_spent: 850,
    });
    // monthly has no maximum here, so the yearly track is the second one.
    const yearly = tracks(el)[1];
    expect(levelOf(yearly)).to.equal("ok");
    expect(yearly.querySelector(".bar-fill")!.classList.contains("ok")).to.be.true;
  });

  it("100 % is danger whatever the threshold is", async () => {
    const { el } = await mount({
      alert_threshold_pct: 60, monthly_budget: 100, monthly_spent: 140,
    });
    const monthly = tracks(el)[0];
    expect(levelOf(monthly)).to.equal("danger");
    // The bar clamps at full width rather than overflowing its rail.
    expect(monthly.querySelector<HTMLElement>(".bar-fill")!.style.width).to.equal("100%");
  });
});

describe("budget-section-card: spent-only display (#104)", () => {
  it("no maximum set: plain spent lines, no bars, no '/ 0'", async () => {
    const { el } = await mount({ monthly_spent: 9, yearly_spent: 429.6 });
    const spentOnly = [...root(el).querySelectorAll(".track.spent-only")];
    expect(spentOnly.length, "both tracks spent-only").to.equal(2);
    expect(numbersOf(spentOnly[0])).to.equal("9 €");
    expect(numbersOf(spentOnly[1])).to.equal("430 €");
    expect(root(el).querySelectorAll(".bar").length, "no progress bars").to.equal(0);
    expect(root(el).textContent).to.not.contain("/ 0");
  });

  it("mixed: a monthly maximum renders a bar, yearly stays spent-only", async () => {
    const { el } = await mount({
      monthly_budget: 150, monthly_spent: 9, yearly_spent: 429.6,
    });
    expect(root(el).querySelectorAll(".bar").length).to.equal(1);
    const spentOnly = [...root(el).querySelectorAll(".track.spent-only")];
    expect(spentOnly.length).to.equal(1);
    expect(numbersOf(spentOnly[0])).to.equal("430 €");
    expect(numbersOf(tracks(el)[0])).to.equal("9 / 150 €");
  });
});
