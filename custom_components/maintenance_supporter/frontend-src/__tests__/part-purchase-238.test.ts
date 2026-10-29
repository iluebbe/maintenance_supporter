/**
 * #238: record a spare part purchase at any time, with what was paid. Pins:
 *   - the parts shelf shows a *Bought…* pill on a counted part, an empty one
 *     too (not on an uncounted one, not for a reader)
 *   - it opens a form with the restock amount and the part's price; the
 *     total follows the price each and the price each a typed total
 *   - part/purchase carries the quantity, the total as cost, a past day and
 *     the note (today's date and an empty note are left out); the stock
 *     shows the server's count and the panel reloads
 *   - a nonsense quantity is marked and sends nothing; Escape closes; a
 *     refusal stays open with the reason
 *   - a part that counts when used says the purchase is stock at an average
 *     price
 *   - the All-parts view has the same pill beside the stock, and a click on
 *     it does not open the row's object
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/parts-section";
import type { MaintenancePartsSection } from "../components/parts-section";
import { defaultPurchaseQuantity } from "../components/ms-part-purchase";
import { haToday } from "../helpers/ha-time";
import type { MaintenancePart } from "../types";
import { mountPanel, obj, resetTaskSeq, sr, task } from "./_panel-utils.js";

const FLUID: MaintenancePart = { id: "p_fluid", name: "Washer fluid", unit: "l", package_size: 5, cost: 10, restock_quantity: 2, stock: 12, is_low: false };
const FILTER: MaintenancePart = { id: "p_filter", name: "Water filter", cost: 8, stock: 0, is_low: true };
const CATALOG: MaintenancePart = { id: "p_cat", name: "Cabin filter", is_low: false };
const INK: MaintenancePart = { id: "p_ink", name: "Ink", stock: 3, cost_mode: "purchase", is_low: false };

type Purchase = HTMLElement & { updateComplete: Promise<unknown> };

async function mountShelf(opts: { canWrite?: boolean; house?: "purchase" | "use"; fleet?: boolean; reply?: (msg: Record<string, unknown>) => unknown } = {}) {
  const sent: Array<Record<string, unknown>> = [];
  const hass = {
    language: "en",
    connection: {
      sendMessagePromise: async (msg: Record<string, unknown>) => {
        sent.push(msg);
        if (opts.reply) return opts.reply(msg);
        if (msg.type === "maintenance_supporter/part/purchase") return { task_id: "t_buy", stock: 22, cost: 18 };
        return { success: true };
      },
    },
  };
  const el = await fixture<MaintenancePartsSection>(html`
    <maintenance-parts-section
      .hass=${hass as never}
      .entryId=${"e1"}
      .parts=${[FLUID, FILTER, CATALOG, INK].map((p) => ({ ...p }))}
      .canWrite=${opts.canWrite ?? true}
      .currencySymbol=${"€"}
      .partsCostMode=${opts.house ?? "purchase"}
      .fleet=${opts.fleet ?? false}
    ></maintenance-parts-section>
  `);
  await el.updateComplete;
  return { el, sent };
}

const rowOf = (el: HTMLElement, name: string) =>
  [...el.shadowRoot!.querySelectorAll<HTMLElement>(".part-row")].find((r) => r.textContent!.includes(name))!;
const buyOf = (row: HTMLElement) => row.querySelector<Purchase>("ms-part-purchase");
const settle = async (el: { updateComplete: Promise<unknown> }) => { await new Promise((r) => setTimeout(r, 20)); await el.updateComplete; };
const field = (buy: Purchase, cls: string) => buy.shadowRoot!.querySelector<HTMLInputElement>(`input.${cls}`)!;

async function openBuy(row: HTMLElement) {
  const buy = buyOf(row)!;
  buy.shadowRoot!.querySelector<HTMLButtonElement>(".buy-pill")!.click();
  await buy.updateComplete;
  return buy;
}

async function type(buy: Purchase, cls: string, value: string) {
  const input = field(buy, cls);
  input.value = value;
  input.dispatchEvent(new Event("input"));
  await buy.updateComplete;
}

describe("record a purchase (#238)", () => {
  it("one pill per counted part, an empty one too, for a writer", async () => {
    const { el } = await mountShelf();
    expect(buyOf(rowOf(el, "Washer fluid")), "counted").to.exist;
    expect(buyOf(rowOf(el, "Water filter")), "empty: the case for buying").to.exist;
    expect(buyOf(rowOf(el, "Cabin filter")) === null, "not counted").to.equal(true);
    const pill = buyOf(rowOf(el, "Washer fluid"))!.shadowRoot!.querySelector(".buy-pill")!;
    expect(pill.textContent!.trim()).to.equal("Bought…");
    expect(pill.getAttribute("title")).to.contain("Record a purchase");

    const reader = await mountShelf({ canWrite: false });
    expect(reader.el.shadowRoot!.querySelector("ms-part-purchase") === null, "a reader cannot buy").to.equal(true);
  });

  it("prefills the restock amount and the price; the total and the price each follow each other", async () => {
    const { el } = await mountShelf();
    const buy = await openBuy(rowOf(el, "Washer fluid"));
    expect(field(buy, "qty").value, "the restock amount: 2 jugs").to.equal("2");
    expect(field(buy, "price").value, "the part's price per jug").to.equal("10");
    expect(field(buy, "total").value).to.equal("20");
    const text = buy.shadowRoot!.textContent!;
    expect(text).to.contain("Packages of 5 l");
    expect(text).to.contain("Price per package");
    expect(text).to.contain("Adds 10 l to the stock");

    await type(buy, "qty", "3");
    expect(field(buy, "total").value, "3 × 10").to.equal("30");
    expect(buy.shadowRoot!.textContent!).to.contain("Adds 15 l to the stock");
    await type(buy, "total", "22.5");
    expect(field(buy, "price").value, "22.50 / 3").to.equal("7.5");
    await type(buy, "price", "");
    expect(field(buy, "total").value, "no price, no total").to.equal("");

    expect(defaultPurchaseQuantity({ restock_quantity: null })).to.equal(1);
    expect(defaultPurchaseQuantity({ restock_quantity: 0 })).to.equal(1);
  });

  it("sends the purchase and shows the server's stock", async () => {
    const { el, sent } = await mountShelf();
    let changed = 0;
    el.addEventListener("parts-changed", () => changed++);
    const buy = await openBuy(rowOf(el, "Washer fluid"));
    await type(buy, "total", "18");
    await type(buy, "notes-input", "  Hardware store  ");
    field(buy, "notes-input").dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, composed: true }));
    await settle(buy);
    await settle(el);
    expect(sent.filter((m) => m.type === "maintenance_supporter/part/purchase")).to.deep.equal([
      { type: "maintenance_supporter/part/purchase", entry_id: "e1", part_id: "p_fluid", quantity: 2, cost: 18, notes: "Hardware store" },
    ]);
    expect(rowOf(el, "Washer fluid").querySelector(".stock-badge")!.textContent).to.contain("22");
    expect(changed, "the panel reloads").to.equal(1);
    expect(buy.shadowRoot!.querySelector(".buy-form") === null, "closed again").to.equal(true);
  });

  it("a past day goes along, today and a missing price do not", async () => {
    const { el, sent } = await mountShelf();
    const buy = await openBuy(rowOf(el, "Water filter"));
    expect(field(buy, "qty").value, "one without a restock amount").to.equal("1");
    const date = buy.shadowRoot!.querySelector<HTMLElement & { value: string }>("ms-date-field")!;
    expect(date.value, "today").to.equal(haToday());
    date.dispatchEvent(new CustomEvent("value-changed", { detail: { value: "2026-01-15" } }));
    await type(buy, "price", "");
    buy.shadowRoot!.querySelector<HTMLButtonElement>(".buy-pill.confirm")!.click();
    await settle(buy);
    expect(sent.find((m) => m.type === "maintenance_supporter/part/purchase")).to.deep.equal({
      type: "maintenance_supporter/part/purchase", entry_id: "e1", part_id: "p_filter", quantity: 1, date: "2026-01-15",
    });
  });

  it("a nonsense quantity is marked and sends nothing; Escape closes", async () => {
    const { el, sent } = await mountShelf();
    const buy = await openBuy(rowOf(el, "Water filter"));
    for (const bad of ["0", "-2", ""]) {
      await type(buy, "qty", bad);
      buy.shadowRoot!.querySelector<HTMLButtonElement>(".buy-pill.confirm")!.click();
      await settle(buy);
      expect(field(buy, "qty").classList.contains("invalid"), `"${bad}" marked`).to.equal(true);
    }
    await type(buy, "qty", "1");
    await type(buy, "total", "-3");
    buy.shadowRoot!.querySelector<HTMLButtonElement>(".buy-pill.confirm")!.click();
    await settle(buy);
    expect(field(buy, "total").classList.contains("invalid"), "a negative total").to.equal(true);
    expect(sent.some((m) => m.type === "maintenance_supporter/part/purchase")).to.equal(false);
    field(buy, "qty").dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, composed: true }));
    await buy.updateComplete;
    expect(buy.shadowRoot!.querySelector(".buy-form") === null).to.equal(true);
    expect(buy.shadowRoot!.querySelector(".buy-pill")).to.exist;
  });

  it("a refusal stays open with the reason", async () => {
    const { el } = await mountShelf({
      reply: (msg) => {
        if (msg.type === "maintenance_supporter/part/purchase") throw { code: "part_owner_archived", message: "Garage shelf is archived" };
        return {};
      },
    });
    const buy = await openBuy(rowOf(el, "Water filter"));
    buy.shadowRoot!.querySelector<HTMLButtonElement>(".buy-pill.confirm")!.click();
    await settle(buy);
    expect(buy.shadowRoot!.querySelector(".error"), "the reason").to.exist;
    expect(buy.shadowRoot!.querySelector(".buy-form"), "still open").to.exist;
  });

  it("says the purchase is stock at an average price for a part that counts when used", async () => {
    const house = await mountShelf({ house: "use" });
    const fluid = await openBuy(rowOf(house.el, "Washer fluid"));
    expect(fluid.shadowRoot!.querySelector(".note")!.textContent).to.contain("average");
    const ink = await openBuy(rowOf(house.el, "Ink"));
    expect(ink.shadowRoot!.querySelector(".note") === null, "this part counts when bought").to.equal(true);

    const bought = await mountShelf({ house: "purchase" });
    expect((await openBuy(rowOf(bought.el, "Washer fluid"))).shadowRoot!.querySelector(".note") === null).to.equal(true);

    const fleet = await mountShelf({ house: "use", fleet: true });
    expect((await openBuy(rowOf(fleet.el, "Washer fluid"))).shadowRoot!.querySelector(".note") === null, "fleet cells count when bought").to.equal(true);
  });
});

describe("the All-parts view's Bought… pill (#238)", () => {
  beforeEach(() => resetTaskSeq());

  const rows = () => [
    { part_id: "p_fluid", entry_id: "e1", object_name: "Garage shelf", name: "Washer fluid", unit: "l", package_size: 5,
      cost: 10, restock_quantity: 2, reorder_threshold: 5, stock: 0, low: true, consumers: [] },
    { part_id: "p_cat", entry_id: "e1", object_name: "Garage shelf", name: "Cabin filter", unit: null,
      reorder_threshold: null, stock: null, low: false, consumers: [] },
  ];

  async function openAllParts(user?: { id: string; is_admin: boolean }) {
    let overview = 0;
    const { el, sent } = await mountPanel([obj("e1", [task()], "Garage shelf")], {
      "maintenance_supporter/parts/overview": () => { overview++; return { parts: rows(), count: 2 }; },
      "maintenance_supporter/part/purchase": () => ({ task_id: "t_buy", stock: 10, cost: 20 }),
    }, user ? { user } : {});
    (el as any)._showAllParts();
    await settle(el);
    await settle(el);
    return { el, sent: sent as Array<Record<string, unknown>>, overviews: () => overview };
  }

  it("sits beside a counted stock, empty too, and books the row's part without opening its object", async () => {
    const { el, sent, overviews } = await openAllParts();
    const trs = [...sr(el).querySelectorAll<HTMLElement>(".objects-table tbody tr")];
    const buy = trs[0].querySelector<Purchase>(".all-parts-stock ms-part-purchase")!;
    expect(buy, "pill beside the stock").to.exist;
    expect(trs[1].querySelector("ms-part-purchase") === null, "an uncounted part has none").to.equal(true);

    buy.shadowRoot!.querySelector<HTMLButtonElement>(".buy-pill")!.click();
    await buy.updateComplete;
    expect((el as any)._view, "the click stays in the view").to.equal("all_parts");
    expect(field(buy, "price").value, "the row's price").to.equal("10");
    const before = overviews();
    buy.shadowRoot!.querySelector<HTMLButtonElement>(".buy-pill.confirm")!.click();
    await settle(buy);
    await settle(el);
    expect(sent.find((m) => m.type === "maintenance_supporter/part/purchase")).to.deep.equal({
      type: "maintenance_supporter/part/purchase", entry_id: "e1", part_id: "p_fluid", quantity: 2, cost: 20,
    });
    expect((el as any)._view).to.equal("all_parts");
    expect(overviews(), "the table reloads").to.be.greaterThan(before);
  });

  it("is not there for a reader", async () => {
    const { el } = await openAllParts({ id: "op-1", is_admin: false });
    expect(sr(el).querySelector(".objects-table tbody tr")).to.exist;
    expect(sr(el).querySelector("ms-part-purchase") === null).to.equal(true);
  });
});
