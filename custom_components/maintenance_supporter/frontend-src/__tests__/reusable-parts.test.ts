/**
 * Reusable parts (#208): a used one waits to be ready again — charged,
 * sharpened, cleaned, dried, refilled. Pins:
 *   - the parts list shows how many wait ("2 to charge") and a writer's
 *     "Charged" button sends part/ready_again
 *   - the part form offers "After use" and the waiting count, and saves both
 *   - the battery fleet shows the counted rechargeable spares with their
 *     "Charged" button
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/parts-section";
import type { MaintenancePartsSection } from "../components/parts-section";
import "../components/battery-fleet-section.js";
import type { MaintenanceBatteryFleetSection } from "../components/battery-fleet-section";
import type { MaintenancePart } from "../types";
import { createMockHass } from "./_test-utils.js";

const CELLS: MaintenancePart = {
  id: "p_cells", name: "AAA Eneloop", unit: "pcs", stock: 2, restoring: 2, reuse: "charge", is_low: false,
};
const BLADES: MaintenancePart = {
  id: "p_blades", name: "Mower blades", stock: 1, restoring: 0, reuse: "sharpen", is_low: false,
};
const FILTER: MaintenancePart = { id: "p_filter", name: "Filter", stock: 3, is_low: false };

async function mountParts(canWrite: boolean, parts: MaintenancePart[] = [CELLS, BLADES, FILTER]) {
  const sent: Array<Record<string, unknown>> = [];
  const hass = {
    language: "en",
    connection: {
      sendMessagePromise: async (msg: Record<string, unknown>) => {
        sent.push(msg);
        if (msg.type === "maintenance_supporter/part/ready_again") return { moved: 2, stock: 4, restoring: 0 };
        return { success: true, part_id: "new" };
      },
    },
  };
  const el = await fixture<MaintenancePartsSection>(html`
    <maintenance-parts-section .hass=${hass as never} .entryId=${"e1"} .parts=${parts.map((p) => ({ ...p }))} .canWrite=${canWrite}></maintenance-parts-section>
  `);
  await el.updateComplete;
  return { el, sent };
}

describe("reusable parts in the parts list", () => {
  it("shows what waits and readies it in one click", async () => {
    const { el, sent } = await mountParts(true);
    const rows = [...el.shadowRoot!.querySelectorAll(".part-row")];
    expect(rows[0].querySelector(".waiting-badge")!.textContent).to.equal("2 to charge");
    expect(rows[1].querySelector(".waiting-badge"), "nothing waits").to.equal(null);
    expect(rows[2].querySelector(".waiting-badge"), "a used-up part").to.equal(null);

    const button = rows[0].querySelector<HTMLButtonElement>(".ready-again")!;
    expect(button.textContent!.trim()).to.equal("Charged");
    button.click();
    await new Promise((r) => setTimeout(r, 20));
    await el.updateComplete;
    expect(sent.find((m) => m.type === "maintenance_supporter/part/ready_again")).to.deep.include({ entry_id: "e1", part_id: "p_cells" });
    expect(el.shadowRoot!.querySelector(".waiting-badge"), "the pile is back in stock").to.equal(null);
  });

  it("offers no ready-again button to a reader", async () => {
    const { el } = await mountParts(false);
    expect(el.shadowRoot!.querySelector(".waiting-badge")).to.exist;
    expect(el.shadowRoot!.querySelector(".ready-again")).to.equal(null);
  });

  it("edits what happens after use and the waiting count", async () => {
    const { el, sent } = await mountParts(true);
    // Edit the cells: the form carries their reuse and pile.
    const editButtons = [...el.shadowRoot!.querySelectorAll<HTMLElement>("ha-icon-button")].filter((b) => b.getAttribute("title") === "Edit");
    editButtons[0].click();
    await el.updateComplete;
    const select = el.shadowRoot!.querySelector<HTMLSelectElement>(".reuse-select")!;
    expect(select.value).to.equal("charge");
    expect([...select.options].map((o) => o.value)).to.deep.equal(["", "charge", "sharpen", "clean", "dry", "refill", "restore"]);
    const waiting = [...el.shadowRoot!.querySelectorAll<HTMLLabelElement>(".form-field")].find((l) => l.textContent!.includes("Used, not ready yet"))!;
    const input = waiting.querySelector("input")!;
    expect(input.value).to.equal("2");
    input.value = "1";
    input.dispatchEvent(new Event("input"));
    const save = [...el.shadowRoot!.querySelectorAll<HTMLElement>("ha-button")].find((b) => b.textContent!.trim() === "Save")!;
    save.click();
    await new Promise((r) => setTimeout(r, 20));
    const update = sent.find((m) => m.type === "maintenance_supporter/part/update")!;
    expect(update).to.deep.include({ part_id: "p_cells", reuse: "charge", restoring: 1 });

    // Used up: no waiting field, and the save says so.
    editButtons[2].click();
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector<HTMLSelectElement>(".reuse-select")!.value).to.equal("");
    expect([...el.shadowRoot!.querySelectorAll(".form-field")].some((l) => l.textContent!.includes("Used, not ready yet"))).to.equal(false);
  });
});

describe("rechargeable spares in the battery fleet", () => {
  it("lists the counted cells and charges them", async () => {
    const calls: Array<Record<string, unknown>> = [];
    const { hass } = createMockHass({
      handlers: {
        "maintenance_supporter/battery_fleet/overview": () => ({
          available: true, has_battery_notes: true, configured: true, task_ok: true, entry_id: "fleet",
          total: 1, low: [], soon: [], all: [], needs_now: {}, needs_soon: {}, types: ["AAA NIMH"], excluded: [],
          charging: [{ part_id: "batt_aaa nimh", name: "AAA NIMH battery", reuse: "charge", stock: 2, restoring: 2 }],
        }),
        "maintenance_supporter/battery_fleet/overview_history": () => ({ series: {} }),
        "maintenance_supporter/part/ready_again": (msg: Record<string, unknown>) => {
          calls.push(msg);
          return { moved: 2, stock: 4, restoring: 0 };
        },
      },
    });
    (hass as unknown as { user: unknown }).user = { id: "u", name: "Admin", is_admin: true };
    const el = await fixture<MaintenanceBatteryFleetSection>(html`<maintenance-battery-fleet-section .hass=${hass}></maintenance-battery-fleet-section>`);
    await new Promise((r) => setTimeout(r, 20));
    await el.updateComplete;
    const line = el.shadowRoot!.querySelector(".bf-charging")!;
    expect(line.textContent).to.contain("Rechargeable spares");
    expect(line.textContent).to.contain("AAA NIMH battery");
    expect(line.textContent).to.contain("2 ready");
    expect(line.textContent).to.contain("2 to charge");
    line.querySelector<HTMLButtonElement>(".bf-charged")!.click();
    await new Promise((r) => setTimeout(r, 20));
    expect(calls[0]).to.deep.include({ entry_id: "fleet", part_id: "batt_aaa nimh" });
  });
});

describe("dispose of used ones (#218)", () => {
  it("asks how many, one by default, and sends part/dispose", async () => {
    const sent: Array<Record<string, unknown>> = [];
    const hass = {
      language: "en",
      connection: {
        sendMessagePromise: async (msg: Record<string, unknown>) => {
          sent.push(msg);
          return { disposed: msg.quantity, stock: 2, restoring: 2 - Number(msg.quantity) };
        },
      },
    };
    const el = await fixture<MaintenancePartsSection>(html`
      <maintenance-parts-section .hass=${hass as never} .entryId=${"e1"} .parts=${[{ ...CELLS }]} .canWrite=${true}></maintenance-parts-section>
    `);
    await el.updateComplete;
    const open = el.shadowRoot!.querySelector<HTMLButtonElement>(".ready-again.dispose")!;
    expect(open.textContent!.trim()).to.equal("Dispose");
    open.click();
    await el.updateComplete;
    const input = el.shadowRoot!.querySelector<HTMLInputElement>(".dispose-input")!;
    expect(input.value).to.equal("1");
    expect(input.max).to.equal("2");
    expect(sent, "nothing booked by opening it").to.deep.equal([]);

    // Zero is no amount: the field stays open and says so.
    input.value = "0";
    input.dispatchEvent(new Event("input"));
    el.shadowRoot!.querySelector<HTMLButtonElement>(".dispose.confirm")!.click();
    await el.updateComplete;
    expect(sent).to.deep.equal([]);
    expect(el.shadowRoot!.querySelector(".dispose-input.invalid")).to.exist;

    input.value = "2";
    input.dispatchEvent(new Event("input"));
    el.shadowRoot!.querySelector<HTMLButtonElement>(".dispose.confirm")!.click();
    await new Promise((r) => setTimeout(r, 20));
    await el.updateComplete;
    expect(sent[0]).to.deep.include({ type: "maintenance_supporter/part/dispose", entry_id: "e1", part_id: "p_cells", quantity: 2 });
    expect(el.shadowRoot!.querySelector(".waiting-badge"), "the pile is empty").to.equal(null);
  });

  it("is a writer's action only", async () => {
    const { el } = await mountParts(false);
    expect(el.shadowRoot!.querySelector(".dispose")).to.equal(null);
  });

  it("disposes of dead cells in the battery fleet", async () => {
    const calls: Array<Record<string, unknown>> = [];
    const { hass } = createMockHass({
      handlers: {
        "maintenance_supporter/battery_fleet/overview": () => ({
          available: true, has_battery_notes: true, configured: true, task_ok: true, entry_id: "fleet",
          total: 1, low: [], soon: [], all: [], needs_now: {}, needs_soon: {}, types: ["AAA NIMH"], excluded: [],
          charging: [{ part_id: "batt_aaa nimh", name: "AAA NIMH battery", reuse: "charge", stock: 2, restoring: 2 }],
        }),
        "maintenance_supporter/battery_fleet/overview_history": () => ({ series: {} }),
        "maintenance_supporter/part/dispose": (msg: Record<string, unknown>) => {
          calls.push(msg);
          return { disposed: 1, stock: 2, restoring: 1 };
        },
      },
    });
    (hass as unknown as { user: unknown }).user = { id: "u", name: "Admin", is_admin: true };
    const el = await fixture<MaintenanceBatteryFleetSection>(html`<maintenance-battery-fleet-section .hass=${hass}></maintenance-battery-fleet-section>`);
    await new Promise((r) => setTimeout(r, 20));
    await el.updateComplete;
    el.shadowRoot!.querySelector<HTMLButtonElement>(".bf-dispose")!.click();
    await el.updateComplete;
    const qty = el.shadowRoot!.querySelector<HTMLInputElement>(".bf-dispose-qty")!;
    expect(qty.value).to.equal("1");
    el.shadowRoot!.querySelector<HTMLButtonElement>(".bf-dispose.confirm")!.click();
    await new Promise((r) => setTimeout(r, 20));
    await el.updateComplete;
    expect(calls[0]).to.deep.include({ entry_id: "fleet", part_id: "batt_aaa nimh", quantity: 1 });
    expect(el.shadowRoot!.querySelector(".bf-dispose-qty"), "the field closes").to.equal(null);
  });
});
