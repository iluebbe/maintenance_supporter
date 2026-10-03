/** Credits: a negative cost (#200).
 *
 * Money also comes back — the old unit sold, a refund. The entry field is a
 * Cost | Credit switch plus a positive amount (phone keypads have no minus
 * key); every total nets a credit, the averages per completion leave it out,
 * and the displays say "Credit" instead of printing a bare minus: the
 * history row, the task's cost chart (a bar below a zero line), the area
 * chart and its cost shares.
 */

import { expect, fixture, html } from "@open-wc/testing";
import { render } from "lit";
import "../components/ms-cost-input.js";
import "../components/area-view.js";
import type { MsCostInput } from "../components/ms-cost-input";
import type { MaintenanceAreaView } from "../components/area-view";
import { renderHistoryEntry, type HistoryContext } from "../renderers/history.js";
import { renderCostDurationCard } from "../renderers/charts.js";
import { areaTotals, costByObject, type AreaHistoryEntry } from "../helpers/area-history.js";
import { formatCost } from "../styles.js";
import type { HistoryEntry, MaintenanceTask } from "../types";
import { createMockHass } from "./_test-utils.js";

function mount(template: unknown): HTMLElement {
  const host = document.createElement("div");
  document.body.appendChild(host);
  render(template, host);
  return host;
}

describe("<ms-cost-input> (#200)", () => {
  it("a signed value in: the switch on Credit, the amount positive", async () => {
    const el = await fixture<MsCostInput>(html`<ms-cost-input .lang=${"en"} .value=${"-150"}></ms-cost-input>`);
    const sr = el.shadowRoot!;
    expect(sr.querySelector(".kind.credit")!.classList.contains("on")).to.equal(true);
    expect(sr.querySelector<HTMLInputElement>("input.amount")!.value).to.equal("150");
    expect(sr.querySelector(".hint")!.textContent).to.include("Money back");
  });

  it("the switch flips the sign; a typed minus flips the switch and stays out of the field", async () => {
    const el = await fixture<MsCostInput>(html`<ms-cost-input .lang=${"en"} .value=${"-150"}></ms-cost-input>`);
    const sr = el.shadowRoot!;
    const seen: string[] = [];
    el.addEventListener("value-changed", (e) => seen.push((e as CustomEvent<{ value: string }>).detail.value));

    sr.querySelector<HTMLButtonElement>(".kind.cost")!.click();
    await el.updateComplete;
    expect(seen).to.deep.equal(["150"]);
    expect(sr.querySelector(".hint"), "no credit hint on a cost").to.equal(null);

    const input = sr.querySelector<HTMLInputElement>("input.amount")!;
    input.value = "-20";
    input.dispatchEvent(new Event("input"));
    await el.updateComplete;
    expect(seen.at(-1)).to.equal("-20");
    expect(input.value).to.equal("20");
    expect(sr.querySelector(".kind.credit")!.classList.contains("on")).to.equal(true);

    input.value = "";
    input.dispatchEvent(new Event("input"));
    expect(seen.at(-1), "no amount = no value, whatever the switch says").to.equal("");
  });

  it("Credit before the amount stays put; a reset from outside goes back to Cost", async () => {
    const el = await fixture<MsCostInput>(html`<ms-cost-input .lang=${"en"}></ms-cost-input>`);
    const sr = el.shadowRoot!;
    // The parent echoes every value-changed back, as the dialogs do.
    el.addEventListener("value-changed", (e) => { el.value = (e as CustomEvent<{ value: string }>).detail.value; });
    sr.querySelector<HTMLButtonElement>(".kind.credit")!.click();
    await el.updateComplete;
    expect(sr.querySelector(".kind.credit")!.classList.contains("on"), "the echoed empty value keeps the switch").to.equal(true);
    const input = sr.querySelector<HTMLInputElement>("input.amount")!;
    input.value = "30";
    input.dispatchEvent(new Event("input"));
    await el.updateComplete;
    expect(el.value).to.equal("-30");

    el.value = "";
    await el.updateComplete;
    expect(sr.querySelector(".kind.cost")!.classList.contains("on")).to.equal(true);
    expect(input.value).to.equal("");
  });
});

describe("credit displays (#200)", () => {
  it("formatCost never prints a negative zero", () => {
    expect(formatCost(-150, "€", "en")).to.equal("-150 €");
    expect(formatCost(-0.2, "€", "en", 0)).to.equal("0 €");
    expect(formatCost(-0.004, "", "en", 2)).to.equal("0.00");
  });

  it("the history row says Credit and the amount", () => {
    const { hass } = createMockHass({});
    const ctx: HistoryContext = {
      lang: "en", hass: hass as never, filter: null, search: "", currencySymbol: "€",
      setFilter: () => undefined, setSearch: () => undefined,
    };
    const host = mount(renderHistoryEntry({ type: "completed", timestamp: "2026-08-01T10:00:00", cost: -150 } as HistoryEntry, ctx));
    expect(host.querySelector(".history-credit")!.textContent!.trim()).to.equal("Credit: 150 €");
    const cost = mount(renderHistoryEntry({ type: "completed", timestamp: "2026-08-01T10:00:00", cost: 80 } as HistoryEntry, ctx));
    expect(cost.querySelector(".history-credit")).to.equal(null);
    expect(cost.querySelector(".history-details")!.textContent).to.include("Cost: 80 €");
  });

  it("the task's cost chart hangs a credit below the zero line", () => {
    const task = {
      history: [
        { type: "completed", timestamp: "2026-01-10T10:00:00", cost: 200 },
        { type: "completed", timestamp: "2026-03-10T10:00:00", cost: -150 },
        { type: "completed", timestamp: "2026-05-10T10:00:00", cost: 50 },
      ],
    } as unknown as MaintenanceTask;
    const host = mount(renderCostDurationCard(task, "en", "cost", () => undefined, "€"));
    const bars = [...host.querySelectorAll<SVGRectElement>("rect.cost-bar")];
    const credit = host.querySelector<SVGRectElement>("rect.credit-bar")!;
    const zero = Number(host.querySelector("line.cost-zero")!.getAttribute("y1"));
    expect(bars.length).to.equal(2);
    const num = (r: SVGRectElement, a: string) => Number(r.getAttribute(a));
    for (const bar of bars) expect(num(bar, "y") + num(bar, "height"), "a cost stands on the zero line").to.be.closeTo(zero, 0.11);
    expect(num(credit, "y"), "a credit hangs from it").to.be.closeTo(zero, 0.11);
    expect(num(credit, "height")).to.be.greaterThan(0);
    expect(credit.querySelector("title")!.textContent).to.include("Credit 150 €");
    expect(host.querySelector(".chart-legend")!.textContent).to.include("Credit");
  });

  it("a chart of costs only has no zero line and no credit legend", () => {
    const task = {
      history: [
        { type: "completed", timestamp: "2026-01-10T10:00:00", cost: 20 },
        { type: "completed", timestamp: "2026-03-10T10:00:00", cost: 40 },
      ],
    } as unknown as MaintenanceTask;
    const host = mount(renderCostDurationCard(task, "en", "cost", () => undefined, "€"));
    expect(host.querySelector("line.cost-zero")).to.equal(null);
    expect(host.querySelectorAll("rect.cost-bar").length).to.equal(2);
    expect(host.querySelector(".chart-legend")!.textContent).not.to.include("Credit");
  });

  it("area totals net a credit; the average per completion and the shares leave it out", () => {
    const entries = [
      { type: "completed", entryId: "e1", cost: 200, duration: 30 },
      { type: "completed", entryId: "e1", cost: -150 },
      { type: "completed", entryId: "e2", cost: 50 },
      { type: "completed", entryId: "e3", cost: -80 },
    ] as unknown as AreaHistoryEntry[];
    const tot = areaTotals(entries);
    expect(tot.completions).to.equal(4);
    expect(tot.totalCost).to.equal(20);
    expect(tot.avgCost, "two jobs at 200 and 50").to.equal(125);
    const rows = costByObject(entries, [
      { entry_id: "e1", object: { name: "Washer" } },
      { entry_id: "e2", object: { name: "Dryer" } },
      { entry_id: "e3", object: { name: "Old fridge" } },
    ]);
    expect(rows.map((r) => [r.objectName, r.cost, r.share])).to.deep.equal([
      ["Washer", 50, 0.5],
      ["Dryer", 50, 0.5],
      ["Old fridge", -80, 0],
    ]);
  });

  it("the area chart dips a credit month below a zero line", async () => {
    const { hass } = createMockHass({ handlers: { "maintenance_supporter/task/history": () => ({ history: [] }) } });
    (hass as Record<string, unknown>).areas = { laundry: { area_id: "laundry", name: "Laundry", icon: "mdi:washing-machine" } };
    const objects = [{
      entry_id: "e1",
      object: { name: "Washer", area_id: "laundry" },
      tasks: [{
        id: "t1", name: "Replace", status: "ok", history_count: 2,
        history: [
          { type: "completed", timestamp: "2026-01-10T12:00:00", cost: 200 },
          { type: "completed", timestamp: "2026-02-10T12:00:00", cost: -150, notes: "old drum sold" },
        ],
      }],
    }];
    const el = await fixture<MaintenanceAreaView>(html`
      <maintenance-area-view .hass=${hass as never} .areaKey=${"laundry"} .objects=${objects as never} .currencySymbol=${"€"}></maintenance-area-view>
    `);
    await (el as unknown as { _histories: { settled(): Promise<void> } })._histories.settled();
    await el.updateComplete;
    const priv = el as unknown as { _from: string; _to: string };
    priv._from = "2026-01-01";
    priv._to = "2026-02-28";
    await el.updateComplete;

    expect(el.querySelector(".area-empty"), "a credit month is no empty chart").to.equal(null);
    const fills = [...el.querySelectorAll<HTMLElement>(".area-bar-fill")];
    expect(fills.length).to.equal(2);
    const [jan, feb] = fills;
    // 200 up, 150 down: the zero line sits 150/350 of the height up.
    expect(el.querySelector<HTMLElement>(".area-chart-zero")!.style.bottom).to.equal("42.9%");
    expect(jan.classList.contains("credit")).to.equal(false);
    expect(jan.style.height).to.equal("57.1%");
    expect(jan.style.bottom).to.equal("42.9%");
    expect(feb.classList.contains("credit")).to.equal(true);
    expect(feb.style.height).to.equal("42.9%");
    expect(el.querySelector(".area-chart-min")!.textContent).to.include("-150");
    expect(el.querySelector(".area-kpi-cost")!.textContent).to.include("50");
  });
});
