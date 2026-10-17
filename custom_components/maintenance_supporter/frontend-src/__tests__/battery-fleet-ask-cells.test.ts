/**
 * D#213: with the fleet's ask-cells option on, Replaced asks which cells
 * went in (the note's type or a fleet part of the same size) and sends the
 * choice; a battery with nothing to choose is booked at once, as before.
 * The option is a roster toggle like its neighbours.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/battery-fleet-section.js";
import type { MaintenanceBatteryFleetSection } from "../components/battery-fleet-section";
import { createMockHass } from "./_test-utils.js";

const CHOICES = [
  { type: "AA", name: "AA", rechargeable: false },
  { type: "AA NIMH", name: "AA NiMH", rechargeable: true },
];
const LOCK = {
  entity_id: "sensor.lock_battery_plus", device_name: "Front Lock",
  battery_type: "AA", quantity: 2, level: 8, days_until: null,
};

function overview(lock: Record<string, unknown>) {
  return {
    available: true, has_battery_notes: true, configured: true, task_ok: true,
    total: 1, low: [lock], soon: [], all: [{ ...lock, status: "low" }],
    needs_now: { AA: 2 }, needs_soon: {}, types: ["AA"], excluded: [], ask_cells: true,
  };
}

async function mount(lock: Record<string, unknown>) {
  const calls: Array<Record<string, unknown>> = [];
  const record = (msg: Record<string, unknown>) => { calls.push(msg); return { success: true, marked: 1, pressed: 1, consumed: {} }; };
  const { hass } = createMockHass({
    handlers: {
      "maintenance_supporter/battery_fleet/overview": () => overview(lock),
      "maintenance_supporter/battery_fleet/overview_history": () => ({ series: {} }),
      "maintenance_supporter/battery_fleet/mark_replaced": record,
      "maintenance_supporter/battery_fleet/set_ask_cells": record,
    },
  });
  (hass as unknown as { user: unknown }).user = { id: "u_admin", name: "Admin", is_admin: true };
  const el = await fixture<MaintenanceBatteryFleetSection>(html`<maintenance-battery-fleet-section .hass=${hass}></maintenance-battery-fleet-section>`);
  await el.updateComplete;
  await new Promise((r) => setTimeout(r, 0));
  await el.updateComplete;
  return { el, calls };
}

const markButton = (el: MaintenanceBatteryFleetSection) =>
  el.shadowRoot!.querySelector<HTMLButtonElement>(".bf-row button.bf-mark:not(.bf-exclude)")!;

describe("battery fleet: which cells went in (D#213)", () => {
  it("asks, preselects what the battery holds, and sends the choice", async () => {
    const { el, calls } = await mount({ ...LOCK, cell_choices: CHOICES, cells_installed: "AA" });
    markButton(el).click();
    await el.updateComplete;
    expect(calls.filter((c) => c.type === "maintenance_supporter/battery_fleet/mark_replaced"), "nothing booked yet").to.have.length(0);
    const radios = [...el.shadowRoot!.querySelectorAll<HTMLInputElement>(".bf-cells input[type=radio]")];
    expect(radios.map((r) => r.checked)).to.deep.equal([true, false]);
    expect(el.shadowRoot!.querySelector(".bf-cells .bf-cell-tag"), "the rechargeable one is marked").to.exist;
    radios[1].click();
    await el.updateComplete;
    el.shadowRoot!.querySelector<HTMLButtonElement>(".bf-cells-ok")!.click();
    await new Promise((r) => setTimeout(r, 0));
    const call = calls.find((c) => c.type === "maintenance_supporter/battery_fleet/mark_replaced")!;
    expect(call.entity_ids).to.deep.equal([LOCK.entity_id]);
    expect(call.cells).to.deep.equal({ [LOCK.entity_id]: "AA NIMH" });
  });

  it("books at once when there is nothing to choose", async () => {
    const { el, calls } = await mount(LOCK);
    markButton(el).click();
    await new Promise((r) => setTimeout(r, 0));
    const call = calls.find((c) => c.type === "maintenance_supporter/battery_fleet/mark_replaced")!;
    expect(call.entity_ids).to.deep.equal([LOCK.entity_id]);
    expect(call.cells).to.equal(undefined);
    expect(el.shadowRoot!.querySelector(".bf-cells")).to.equal(null);
  });

  it("the option is a roster toggle", async () => {
    const { el, calls } = await mount(LOCK);
    const box = el.shadowRoot!.querySelector<HTMLInputElement>(".bf-ask-cells input")!;
    expect(box.checked).to.equal(true);
    box.click();
    await new Promise((r) => setTimeout(r, 0));
    expect(calls.find((c) => c.type === "maintenance_supporter/battery_fleet/set_ask_cells")).to.deep.include({ enabled: false });
  });
});
