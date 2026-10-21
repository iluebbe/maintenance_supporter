/**
 * #226: use some of a part outside a task — the washer fluid topped up
 * between two oil changes. Pins:
 *   - the parts shelf shows a *Use* pill on a counted part with some in
 *     stock (not on an empty or uncounted one, not for a reader)
 *   - it opens a count field (one, or a whole package of a part bought in
 *     packages) and sends part/use; the stock shows the server's count
 *   - a nonsense count is marked and sends nothing; Escape closes
 *   - a part that counts as spending when used says the use books nothing
 *   - the All-parts view has the same pill beside the stock, and a click on
 *     it does not open the row's object
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/parts-section";
import type { MaintenancePartsSection } from "../components/parts-section";
import { defaultUseQuantity } from "../components/ms-part-use";
import type { MaintenancePart } from "../types";
import { mountPanel, obj, resetTaskSeq, sr, task } from "./_panel-utils.js";

const FLUID: MaintenancePart = { id: "p_fluid", name: "Washer fluid", unit: "l", package_size: 5, stock: 12, is_low: false };
const CELLS: MaintenancePart = { id: "p_cells", name: "AA Eneloop", unit: "pcs", stock: 4, restoring: 0, reuse: "charge", is_low: false };
const EMPTY: MaintenancePart = { id: "p_empty", name: "Wiper blade", stock: 0, is_low: true };
const CATALOG: MaintenancePart = { id: "p_cat", name: "Cabin filter", is_low: false };
const INK: MaintenancePart = { id: "p_ink", name: "Ink", stock: 3, cost_mode: "purchase", is_low: false };

async function mountShelf(opts: { canWrite?: boolean; house?: "purchase" | "use"; fleet?: boolean; reply?: (msg: Record<string, unknown>) => unknown } = {}) {
  const sent: Array<Record<string, unknown>> = [];
  const hass = {
    language: "en",
    connection: {
      sendMessagePromise: async (msg: Record<string, unknown>) => {
        sent.push(msg);
        if (opts.reply) return opts.reply(msg);
        if (msg.type === "maintenance_supporter/part/use") return { stock: 10.5, restoring: 0 };
        return { success: true };
      },
    },
  };
  const el = await fixture<MaintenancePartsSection>(html`
    <maintenance-parts-section
      .hass=${hass as never}
      .entryId=${"e1"}
      .parts=${[FLUID, CELLS, EMPTY, CATALOG, INK].map((p) => ({ ...p }))}
      .canWrite=${opts.canWrite ?? true}
      .partsCostMode=${opts.house ?? "purchase"}
      .fleet=${opts.fleet ?? false}
    ></maintenance-parts-section>
  `);
  await el.updateComplete;
  return { el, sent };
}

const rowOf = (el: HTMLElement, name: string) =>
  [...el.shadowRoot!.querySelectorAll<HTMLElement>(".part-row")].find((r) => r.textContent!.includes(name))!;
const useOf = (row: HTMLElement) => row.querySelector<HTMLElement & { updateComplete: Promise<unknown> }>("ms-part-use");
const settle = async (el: { updateComplete: Promise<unknown> }) => { await new Promise((r) => setTimeout(r, 20)); await el.updateComplete; };

async function openUse(row: HTMLElement) {
  const use = useOf(row)!;
  use.shadowRoot!.querySelector<HTMLButtonElement>(".use-pill")!.click();
  await use.updateComplete;
  return use;
}

describe("use a part outside a task (#226)", () => {
  it("one pill per counted part with something in stock, for a writer", async () => {
    const { el } = await mountShelf();
    expect(useOf(rowOf(el, "Washer fluid")), "counted, in stock").to.exist;
    expect(useOf(rowOf(el, "AA Eneloop"))).to.exist;
    expect(useOf(rowOf(el, "Wiper blade")) === null, "nothing left to use").to.equal(true);
    expect(useOf(rowOf(el, "Cabin filter")) === null, "not counted").to.equal(true);
    const pill = useOf(rowOf(el, "Washer fluid"))!.shadowRoot!.querySelector(".use-pill")!;
    expect(pill.textContent!.trim()).to.equal("Use");
    expect(pill.getAttribute("title")).to.contain("outside a task");

    const reader = await mountShelf({ canWrite: false });
    expect(reader.el.shadowRoot!.querySelector("ms-part-use") === null, "a reader cannot use").to.equal(true);
  });

  it("opens a count field with a whole package and sends part/use; the stock follows", async () => {
    const { el, sent } = await mountShelf();
    let changed = 0;
    el.addEventListener("parts-changed", () => changed++);
    const row = rowOf(el, "Washer fluid");
    const use = await openUse(row);
    const input = use.shadowRoot!.querySelector<HTMLInputElement>("input")!;
    expect(input.value, "one 5 l jug").to.equal("5");
    expect(use.shadowRoot!.querySelector(".unit")!.textContent).to.equal("l");
    input.value = "1.5";
    input.dispatchEvent(new Event("input"));
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    await settle(use);
    await settle(el);
    expect(sent.filter((m) => m.type === "maintenance_supporter/part/use")).to.deep.equal([
      { type: "maintenance_supporter/part/use", entry_id: "e1", part_id: "p_fluid", quantity: 1.5 },
    ]);
    expect(rowOf(el, "Washer fluid").querySelector(".stock-badge")!.textContent).to.contain("10.5");
    expect(changed, "the panel reloads").to.equal(1);
    expect(use.shadowRoot!.querySelector("input") === null, "closed again").to.equal(true);
  });

  it("one by default without a package size", async () => {
    const { el } = await mountShelf();
    const use = await openUse(rowOf(el, "AA Eneloop"));
    expect(use.shadowRoot!.querySelector<HTMLInputElement>("input")!.value).to.equal("1");
    expect(defaultUseQuantity({ package_size: null })).to.equal(1);
    expect(defaultUseQuantity({ package_size: 400 })).to.equal(400);
    expect(defaultUseQuantity({ package_size: 0 })).to.equal(1);
  });

  it("a nonsense count is marked and sends nothing; Escape closes", async () => {
    const { el, sent } = await mountShelf();
    const use = await openUse(rowOf(el, "AA Eneloop"));
    const input = use.shadowRoot!.querySelector<HTMLInputElement>("input")!;
    for (const bad of ["0", "-2", ""]) {
      input.value = bad;
      input.dispatchEvent(new Event("input"));
      use.shadowRoot!.querySelector<HTMLButtonElement>(".use-pill.confirm")!.click();
      await settle(use);
      expect(use.shadowRoot!.querySelector("input")!.classList.contains("invalid"), `"${bad}" marked`).to.equal(true);
    }
    expect(sent.some((m) => m.type === "maintenance_supporter/part/use")).to.equal(false);
    use.shadowRoot!.querySelector("input")!.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await use.updateComplete;
    expect(use.shadowRoot!.querySelector("input") === null).to.equal(true);
    expect(use.shadowRoot!.querySelector(".use-pill")).to.exist;
  });

  it("a refusal stays open with the reason", async () => {
    const { el } = await mountShelf({
      reply: (msg) => {
        if (msg.type === "maintenance_supporter/part/use") throw { code: "not_found", message: "No part with a counted stock" };
        return {};
      },
    });
    const use = await openUse(rowOf(el, "AA Eneloop"));
    use.shadowRoot!.querySelector<HTMLButtonElement>(".use-pill.confirm")!.click();
    await settle(use);
    expect(use.shadowRoot!.querySelector(".error"), "the reason").to.exist;
    expect(use.shadowRoot!.querySelector("input"), "still open").to.exist;
  });

  it("says a use books nothing for a part that counts when used", async () => {
    const house = await mountShelf({ house: "use" });
    const fluid = await openUse(rowOf(house.el, "Washer fluid"));
    expect(fluid.shadowRoot!.querySelector(".note")!.textContent).to.contain("Not booked as spending");
    const ink = await openUse(rowOf(house.el, "Ink"));
    expect(ink.shadowRoot!.querySelector(".note") === null, "this part counts when bought").to.equal(true);

    const bought = await mountShelf({ house: "purchase" });
    expect((await openUse(rowOf(bought.el, "Washer fluid"))).shadowRoot!.querySelector(".note") === null).to.equal(true);

    const fleet = await mountShelf({ house: "use", fleet: true });
    expect((await openUse(rowOf(fleet.el, "AA Eneloop"))).shadowRoot!.querySelector(".note") === null, "fleet cells count when bought").to.equal(true);
  });
});

describe("the All-parts view's Use pill (#226)", () => {
  beforeEach(() => resetTaskSeq());

  const rows = () => [
    { part_id: "p_fluid", entry_id: "e1", object_name: "Garage shelf", name: "Washer fluid", unit: "l", package_size: 5,
      reorder_threshold: 5, stock: 12, low: false, consumers: [] },
    { part_id: "p_cat", entry_id: "e1", object_name: "Garage shelf", name: "Cabin filter", unit: null,
      reorder_threshold: null, stock: null, low: false, consumers: [] },
  ];

  async function openAllParts(user?: { id: string; is_admin: boolean }) {
    let overview = 0;
    const { el, sent } = await mountPanel([obj("e1", [task()], "Garage shelf")], {
      "maintenance_supporter/parts/overview": () => { overview++; return { parts: rows(), count: 2 }; },
      "maintenance_supporter/part/use": () => ({ stock: 7, restoring: 0 }),
    }, user ? { user } : {});
    (el as any)._showAllParts();
    await settle(el);
    await settle(el);
    return { el, sent: sent as Array<Record<string, unknown>>, overviews: () => overview };
  }

  it("sits beside a counted stock and books the row's part without opening its object", async () => {
    const { el, sent, overviews } = await openAllParts();
    const trs = [...sr(el).querySelectorAll<HTMLElement>(".objects-table tbody tr")];
    const use = trs[0].querySelector<HTMLElement & { updateComplete: Promise<unknown> }>(".all-parts-stock ms-part-use")!;
    expect(use, "pill beside the stock").to.exist;
    expect(trs[1].querySelector("ms-part-use") === null, "an uncounted part has none").to.equal(true);

    use.shadowRoot!.querySelector<HTMLButtonElement>(".use-pill")!.click();
    await use.updateComplete;
    expect((el as any)._view, "the click stays in the view").to.equal("all_parts");
    const before = overviews();
    use.shadowRoot!.querySelector<HTMLButtonElement>(".use-pill.confirm")!.click();
    await settle(use);
    await settle(el);
    expect(sent.find((m) => m.type === "maintenance_supporter/part/use")).to.deep.equal({
      type: "maintenance_supporter/part/use", entry_id: "e1", part_id: "p_fluid", quantity: 5,
    });
    expect((el as any)._view).to.equal("all_parts");
    expect(overviews(), "the table reloads").to.be.greaterThan(before);
  });

  it("is not there for a reader", async () => {
    const { el } = await openAllParts({ id: "op-1", is_admin: false });
    expect(sr(el).querySelector(".objects-table tbody tr")).to.exist;
    expect(sr(el).querySelector("ms-part-use") === null).to.equal(true);
  });
});
