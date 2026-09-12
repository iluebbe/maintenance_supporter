/**
 * Bug audit 2026-09-12, finding 7: the panel card's fill height was measured
 * from the card's CURRENT viewport top, so a resize after the page had been
 * scrolled grew the card by the scrolled distance. The top edge is now taken
 * relative to the unscrolled page (window scroll + every scrolled ancestor,
 * light-DOM parents and shadow hosts alike), so the fill is the same whether
 * or not the page is scrolled.
 */
import { expect, fixture, html } from "@open-wc/testing";
import { setViewport } from "@web/test-runner-commands";
import "../maintenance-panel.js";
import "../maintenance-panel-card.js";
import { PANEL_CARD_TAG } from "../maintenance-panel-card";
import type { HomeAssistant } from "../types";
import { createMockHass } from "./_test-utils.js";

type CardEl = HTMLElement & { hass: HomeAssistant; setConfig(c: Record<string, unknown>): void; _layout(force: boolean): void };

function mockHass(): HomeAssistant {
  const { hass } = createMockHass();
  (hass as Record<string, unknown>).user = { id: "admin-1", is_admin: true };
  (hass as Record<string, unknown>).areas = {};
  (hass as Record<string, unknown>).panels = { "maintenance-supporter": { url_path: "maintenance-supporter", config: { _panel_custom: { module_url: "/x" } } } };
  return hass;
}

describe("panel card fill height is scroll-independent (bug audit 2026-09-12)", () => {
  afterEach(async () => { window.scrollTo(0, 0); await setViewport({ width: 1200, height: 800 }); });

  it("a scrolled wrapper does not change the fill on a forced re-layout", async () => {
    await setViewport({ width: 1200, height: 1000 });
    const wrapper = await fixture<HTMLElement>(html`
      <div style="height: 300px; overflow: auto; display: block;">
        <div style="height: 200px;"></div>
        <maintenance-supporter-panel-card style="display: block;"></maintenance-supporter-panel-card>
      </div>
    `);
    const card = wrapper.querySelector(PANEL_CARD_TAG) as CardEl;
    card.setConfig({ type: `custom:${PANEL_CARD_TAG}` });
    card.hass = mockHass();
    await new Promise((r) => setTimeout(r, 60));
    card._layout(true);
    const unscrolledTop = card.getBoundingClientRect().top + window.scrollY;
    const unscrolled = parseInt(card.style.height, 10);
    expect(unscrolled, "not clamped to the minimum — the measurement matters").to.equal(Math.floor(window.innerHeight - unscrolledTop));

    wrapper.scrollTop = 150;
    expect(wrapper.scrollTop, "the wrapper actually scrolled").to.be.greaterThan(0);
    expect(card.getBoundingClientRect().top, "viewport top moved").to.be.lessThan(unscrolledTop);
    card._layout(true);
    expect(parseInt(card.style.height, 10), "same fill while scrolled").to.equal(unscrolled);
  });

  it("a scrolled window does not change the fill either", async () => {
    await setViewport({ width: 1200, height: 600 });
    const wrapper = await fixture<HTMLElement>(html`
      <div style="display: block;">
        <div style="height: 100px;"></div>
        <maintenance-supporter-panel-card style="display: block;"></maintenance-supporter-panel-card>
        <div style="height: 2000px;"></div>
      </div>
    `);
    const card = wrapper.querySelector(PANEL_CARD_TAG) as CardEl;
    card.setConfig({ type: `custom:${PANEL_CARD_TAG}` });
    card.hass = mockHass();
    await new Promise((r) => setTimeout(r, 60));
    window.scrollTo(0, 0);
    card._layout(true);
    const unscrolled = parseInt(card.style.height, 10);
    window.scrollTo(0, 300);
    expect(window.scrollY).to.be.greaterThan(0);
    card._layout(true);
    expect(parseInt(card.style.height, 10)).to.equal(unscrolled);
  });
});
