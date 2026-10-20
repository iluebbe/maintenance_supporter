/**
 * #222: each spare part says when it counts as spending — as in Settings
 * (the default), when bought, or when used.
 *
 * Pins: the part form offers the three choices and names the household's
 * current one, sends the choice (and nothing for the battery fleet, whose
 * cells always count when bought); the completion dialog splits the value of
 * the ticked parts into what is booked now and what was counted at purchase;
 * a buy reminder's hint follows the part it buys; a shared pool's part is
 * valued like an own one.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/parts-section";
import "../components/complete-dialog.js";
import type { MaintenancePartsSection } from "../components/parts-section";
import type { MaintenanceCompleteDialog } from "../components/complete-dialog";
import type { MaintenancePart } from "../types";
import { buildCompleteDialogArgs } from "../helpers/complete-dialog-args";
import { partCostMode } from "../helpers/parts-cost";
import { partsForCompletion } from "../helpers/shared-parts";
import { createMockHass } from "./_test-utils.js";

async function mountParts(parts: MaintenancePart[], opts: { mode?: "purchase" | "use"; fleet?: boolean } = {}) {
  const sent: Array<Record<string, unknown>> = [];
  const hass = {
    language: "en",
    connection: {
      sendMessagePromise: async (m: Record<string, unknown>) => {
        sent.push(m);
        return {};
      },
    },
  };
  const el = await fixture<MaintenancePartsSection>(html`
    <maintenance-parts-section
      .hass=${hass as never}
      .entryId=${"e1"}
      .parts=${parts}
      .canWrite=${true}
      .partsCostMode=${opts.mode ?? "purchase"}
      .fleet=${!!opts.fleet}
    ></maintenance-parts-section>
  `);
  await el.updateComplete;
  return { el, sent };
}

const priv = (el: MaintenancePartsSection) => el as unknown as {
  _openEdit(p: MaintenancePart): void;
  _openAdd(): void;
  _save(): Promise<void>;
};

describe("part form: when the part counts (#222)", () => {
  it("offers the household's choice, when bought and when used", async () => {
    const { el } = await mountParts([], { mode: "use" });
    priv(el)._openAdd();
    await el.updateComplete;
    const select = el.shadowRoot!.querySelector<HTMLSelectElement>(".cost-mode-select")!;
    expect([...select.options].map((o) => [o.value, o.textContent!.trim()])).to.deep.equal([
      ["", "As in Settings (When used)"],
      ["purchase", "When bought"],
      ["use", "When used"],
    ]);
    expect(select.value).to.equal("");
    expect(el.shadowRoot!.textContent).to.include("in the year it is made");
  });

  it("opens a part on its own choice and sends what is picked", async () => {
    const { el, sent } = await mountParts([{ id: "p1", name: "Bulb", cost_mode: "use" }]);
    priv(el)._openEdit({ id: "p1", name: "Bulb", cost_mode: "use" });
    await el.updateComplete;
    const select = el.shadowRoot!.querySelector<HTMLSelectElement>(".cost-mode-select")!;
    expect(select.value).to.equal("use");
    select.value = "purchase";
    select.dispatchEvent(new Event("change"));
    await priv(el)._save();
    expect(sent.at(-1)).to.include({ type: "maintenance_supporter/part/update", part_id: "p1", cost_mode: "purchase" });

    priv(el)._openEdit({ id: "p1", name: "Bulb", cost_mode: "purchase" });
    await el.updateComplete;
    const again = el.shadowRoot!.querySelector<HTMLSelectElement>(".cost-mode-select")!;
    again.value = "";
    again.dispatchEvent(new Event("change"));
    await priv(el)._save();
    expect(sent.at(-1)!.cost_mode, "back to the household setting").to.equal(null);
  });

  it("the battery fleet's parts offer no choice and send none", async () => {
    const { el, sent } = await mountParts([{ id: "batt_aa", name: "AA" }], { fleet: true });
    priv(el)._openEdit({ id: "batt_aa", name: "AA" });
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".cost-mode-select") === null, "no choice for the fleet").to.equal(true);
    await priv(el)._save();
    expect(sent.at(-1)).to.not.have.property("cost_mode");
  });
});

describe("completion dialog: the value of the parts by when they count (#222)", () => {
  async function mount(over: Partial<MaintenanceCompleteDialog>) {
    const { hass } = createMockHass({});
    const el = await fixture<MaintenanceCompleteDialog>(html`
      <maintenance-complete-dialog .hass=${hass} .entryId=${"e1"} .taskId=${"t1"} .taskName=${"Lamp"} .lang=${"en"}></maintenance-complete-dialog>
    `);
    Object.assign(el, over);
    el.open();
    await el.updateComplete;
    return el;
  }
  const notes = (el: MaintenanceCompleteDialog) =>
    [...el.shadowRoot!.querySelectorAll<HTMLElement>(".cost-note")].map((n) => n.textContent!.trim());

  it("books the parts that count when used and names the others", async () => {
    const el = await mount({
      parts: [
        { id: "bulb", name: "Bulb", cost: 10, cost_mode: "use" },
        { id: "cloth", name: "Cloth", cost: 2 },
      ] as never,
      consumesParts: [{ part_id: "bulb", quantity: 2 }, { part_id: "cloth", quantity: 1 }] as never,
      currencySymbol: "€",
      partsCostMode: "purchase",
    });
    const lines = notes(el);
    expect(lines).to.have.length(2);
    expect(lines[0]).to.include("20 €").and.include("booked automatically");
    expect(lines[1]).to.include("2 €").and.include("counted when they were bought");
  });

  it("one line when every part counts the same way", async () => {
    const el = await mount({
      parts: [{ id: "ink", name: "Ink", cost: 30, cost_mode: "purchase" }] as never,
      consumesParts: [{ part_id: "ink", quantity: 1 }] as never,
      currencySymbol: "€",
      partsCostMode: "use",
    });
    expect(notes(el)).to.have.length(1);
    expect(notes(el)[0]).to.include("counted when they were bought");
  });
});

describe("completion arguments and pools (#222)", () => {
  const objects = [
    {
      entry_id: "e1",
      object: { name: "Office" },
      tasks: [],
      parts: [
        { id: "ink", name: "Ink", cost: 30, cost_mode: "purchase" },
        { id: "bulb", name: "Bulb", cost: 10, cost_mode: "use" },
        { id: "fuse", name: "Fuse", cost: 1 },
      ],
    },
    { entry_id: "e2", object: { name: "Shed" }, tasks: [], parts: [{ id: "oil", name: "Oil", cost: 8, package_size: 4, cost_mode: "use" }] },
  ] as never;
  const args = (partId: string, house: "purchase" | "use") =>
    buildCompleteDialogArgs({
      entryId: "e1", taskId: "buy", taskName: "Buy", lang: "en", objects,
      task: { id: "buy", name: "Buy", part_ref: { part_id: partId } } as never,
      partsCostMode: house,
    });

  it("a buy reminder follows the part it buys", () => {
    expect(args("ink", "use").parts_cost_mode).to.equal("purchase");
    expect(args("bulb", "purchase").parts_cost_mode).to.equal("use");
    expect(args("fuse", "use").parts_cost_mode, "no own choice: the house's").to.equal("use");
    expect(partCostMode(null, "purchase")).to.equal("purchase");
  });

  it("a pool's part carries its price and its choice", () => {
    const list = partsForCompletion({ consumes_parts: [{ part_id: "oil", entry_id: "e2", quantity: 1 }] }, "e1", objects, "en");
    const oil = list.find((p) => p.id === "oil")!;
    expect(oil).to.include({ cost: 8, package_size: 4, cost_mode: "use", entry_id: "e2" });
  });
});
