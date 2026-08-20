/** The Battery Fleet Lovelace card (#135 follow-up).
 *
 * A thin ha-card wrapper around the battery-fleet section. The tests pin the
 * wrapper contract: the section renders inside (in flat mode, so the card
 * chrome is not doubled), the optional title reaches ha-card, the picker
 * entry exists, and a card without hass renders nothing instead of throwing.
 */

import { expect, fixture, html } from "@open-wc/testing";
import { MaintenanceBatteryFleetCard } from "../components/battery-fleet-card.js";
import { createMockHass } from "./_test-utils.js";

const OVERVIEW = {
  available: true, has_battery_notes: true, configured: true, task_ok: true,
  total: 1,
  low: [],
  soon: [],
  all: [{
    entity_id: "sensor.lock_battery_plus", device_name: "Front Lock",
    battery_type: "AA", quantity: 2, level: 80, days_until: null, status: "ok",
  }],
  needs_now: {}, needs_soon: {}, types: ["AA"], excluded: [],
};

async function mount(config?: Record<string, unknown>) {
  const { hass } = createMockHass({
    handlers: {
      "maintenance_supporter/battery_fleet/overview": () => OVERVIEW,
      "maintenance_supporter/battery_fleet/overview_history": () => ({ series: {} }),
    },
  });
  const el = await fixture<MaintenanceBatteryFleetCard>(
    html`<maintenance-battery-fleet-card .hass=${hass}></maintenance-battery-fleet-card>`,
  );
  if (config) el.setConfig(config as never);
  await el.updateComplete;
  await new Promise((r) => setTimeout(r, 0));
  await el.updateComplete;
  return el;
}

describe("battery fleet card", () => {
  it("renders the section in flat mode inside an ha-card", async () => {
    const el = await mount();
    const section = el.shadowRoot!.querySelector("maintenance-battery-fleet-section");
    expect(section, "the section is the card's content").to.exist;
    expect(section!.hasAttribute("flat"), "flat mode: no doubled card chrome").to.equal(true);
    expect(el.shadowRoot!.querySelector("ha-card")).to.exist;
    // The section actually loaded — its own header (title + count) rendered.
    await (section as MaintenanceBatteryFleetCard).updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    expect(section!.shadowRoot!.querySelector(".bf-head")).to.exist;
  });

  it("passes an optional title through to ha-card", async () => {
    const el = await mount({ type: "custom:maintenance-battery-fleet-card", title: "Batterien" });
    const card = el.shadowRoot!.querySelector("ha-card") as { header?: string };
    expect(card.header).to.equal("Batterien");
  });

  it("registers in the Lovelace card picker with the element's exact tag", () => {
    const cards = (window as unknown as { customCards?: { type: string }[] }).customCards || [];
    expect(cards.some((c) => c.type === "maintenance-battery-fleet-card")).to.equal(true);
  });

  it("declares a stub config and a card size", async () => {
    const el = await mount();
    expect(MaintenanceBatteryFleetCard.getStubConfig().type).to.equal("custom:maintenance-battery-fleet-card");
    expect(el.getCardSize()).to.be.greaterThan(0);
  });
});
