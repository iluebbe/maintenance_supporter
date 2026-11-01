/**
 * The beta overview as Home Assistant's list pages (Settings › Entities,
 * 2026.11): one toolbar of chips (Filters, selection mode, a search over the
 * list, Group by, Sort by), the filters in a pane beside the list, a header
 * row that sorts, the create button at the bottom right. Before it, six HA
 * selects in two rows of 56 px, and the "All" choices read as empty fields
 * (2026-11-01). Classic keeps its filter bar.
 */

import { expect } from "@open-wc/testing";
import { setViewport } from "@web/test-runner-commands";
import { mountPanel, obj, resetTaskSeq, sr, task } from "./_panel-utils.js";
import { setBetaUi } from "../helpers/beta-ui";
import "../components/ms-ha-select";

// Home Assistant's elements the beta UI builds on, stubbed as beta-ui.test does.
for (const tag of ["ha-dropdown", "ha-dropdown-item", "wa-divider", "ha-adaptive-dialog", "ha-select", "ha-input", "ha-switch",
  "ha-checkbox", "ha-settings-row", "ha-expansion-panel", "ha-alert", "ha-tab-group", "ha-tab-group-tab"]) {
  if (!customElements.get(tag)) customElements.define(tag, class extends HTMLElement {});
}

type Panel = HTMLElement & {
  updateComplete: Promise<unknown>;
  requestUpdate: () => void;
  _sortMode: string;
  _groupByMode: string;
  _filterStatus: string;
};

async function settle(el: Panel) {
  await new Promise((r) => setTimeout(r, 30));
  await el.updateComplete;
}

async function overview(beta = true) {
  const { el } = await mountPanel([
    obj("e1", [task({ name: "Clean the air filter", status: "overdue", days_until_due: -3 }), task({ name: "Annual service" })], "Heat pump"),
    obj("e2", [task({ name: "Descale", status: "due_soon", days_until_due: 4 })], "Washing machine"),
  ]);
  const panel = el as unknown as Panel;
  // The household's switch, as the panel's settings would bring it.
  setBetaUi(beta);
  panel.requestUpdate();
  await settle(panel);
  return panel;
}

const names = (p: Panel) => [...sr(p).querySelectorAll(".task-table .task-row:not(.virt-sizer) .cell.task-name")].map((n) => n.textContent!.trim());

describe("beta overview: Home Assistant's list page", () => {
  beforeEach(() => {
    resetTaskSeq();
    localStorage.clear();
    localStorage.setItem("msp-overview-tab", "dashboard");
  });
  afterEach(async () => {
    setBetaUi(false);
    localStorage.clear();
    await setViewport({ width: 800, height: 600 });
  });

  it("one toolbar of chips, no dropdown fields, the create button at the bottom right", async () => {
    const p = await overview();
    const bar = sr(p).querySelector(".ms-toolbar");
    expect(bar !== null, "toolbar").to.equal(true);
    expect(sr(p).querySelectorAll(".filter-bar, .ms-toolbar select, .ms-toolbar ms-ha-select").length, "no field row left").to.equal(0);
    expect(bar!.querySelector(".ms-search input")!.getAttribute("placeholder")).to.equal("Search 3 tasks");
    const chips = [...bar!.querySelectorAll(".ms-chip")].map((c) => c.textContent!.replace(/\s+/g, " ").trim());
    expect(chips).to.include("Filters");
    expect(chips).to.include("Group by");
    expect(chips).to.include("Sort by Due date");
    expect(sr(p).querySelector(".ms-fab-wrapper .ms-fab") !== null, "create button").to.equal(true);
  });

  it("the filter pane: a tick filters, the chip counts it, clear takes it back", async () => {
    const p = await overview();
    sr(p).querySelector<HTMLButtonElement>(".ms-toolbar .ms-chip")!.click();
    await settle(p);
    expect(sr(p).querySelector(".ms-filter-pane") !== null, "pane open").to.equal(true);
    expect(localStorage.getItem("msp-filter-pane")).to.equal("1");
    const overdue = [...sr(p).querySelectorAll<HTMLButtonElement>(".ms-pane-option")].find((b) => b.textContent!.trim() === "Overdue")!;
    overdue.click();
    await settle(p);
    expect(names(p)).to.deep.equal(["Clean the air filter"]);
    expect(overdue.getAttribute("aria-checked")).to.equal("true");
    expect(sr(p).querySelector(".ms-pane-section-head .ms-chip-badge")?.textContent).to.equal("1");
    sr(p).querySelector<HTMLElement>(".ms-pane-clear")!.click();
    await settle(p);
    expect(names(p).length).to.equal(3);
    // closed again, the Filters chip carries the count of active filters
    p._filterStatus = "overdue";
    sr(p).querySelector<HTMLButtonElement>(".ms-pane-head .ms-chip")!.click();
    await settle(p);
    expect(sr(p).querySelector(".ms-toolbar .ms-chip .ms-chip-badge")?.textContent).to.equal("1");
  });

  it("the search narrows the list by task or object name", async () => {
    const p = await overview();
    const input = sr(p).querySelector<HTMLInputElement>(".ms-search input")!;
    input.value = "washing";
    input.dispatchEvent(new Event("input"));
    await settle(p);
    expect(names(p)).to.deep.equal(["Descale"]);
    sr(p).querySelector<HTMLButtonElement>(".ms-search-clear")!.click();
    await settle(p);
    expect(names(p).length).to.equal(3);
  });

  it("Group by and Sort by are menus with the choice in force marked; the header row sorts", async () => {
    await setViewport({ width: 1440, height: 900 }); // the header row is the wide layout's
    const p = await overview();
    const menus = sr(p).querySelectorAll(".ms-toolbar ha-dropdown");
    const groupItems = [...menus[0].querySelectorAll("ha-dropdown-item")];
    expect(groupItems.filter((i) => i.classList.contains("selected")).map((i) => i.textContent!.trim())).to.deep.equal(["No grouping"]);
    const objectItem = groupItems.find((i) => i.textContent!.trim() === "Object")!;
    menus[0].dispatchEvent(new CustomEvent("wa-select", { detail: { item: objectItem } }));
    await settle(p);
    expect(p._groupByMode).to.equal("object");
    p._groupByMode = "none";
    await settle(p);
    sr(p).querySelector<HTMLButtonElement>(".task-head .th-task")!.click();
    await settle(p);
    expect(p._sortMode).to.equal("task_name");
    expect(sr(p).querySelector(".task-head .th-task")!.getAttribute("aria-sort")).to.equal("ascending");
    expect(names(p)).to.deep.equal(["Annual service", "Clean the air filter", "Descale"]);
  });

  it("classic keeps its filter bar and no toolbar", async () => {
    const p = await overview(false);
    expect(sr(p).querySelector(".filter-bar") !== null).to.equal(true);
    expect(sr(p).querySelector(".ms-toolbar, .task-head, .ms-fab-wrapper") === null).to.equal(true);
  });

  it("HA's select shows an \"All\" choice (value \"\") instead of an empty field", async () => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    host.innerHTML = `<ms-ha-select><option value="">All</option><option value="overdue">Overdue</option></ms-ha-select>`;
    const wrap = host.querySelector("ms-ha-select") as HTMLElement & { updateComplete: Promise<unknown>; value?: string };
    await wrap.updateComplete;
    const inner = wrap.shadowRoot!.querySelector("ha-select") as HTMLElement & { value?: string; options?: Array<{ value: string }> };
    expect(inner.value, "the empty choice travels under its own value").to.not.equal("");
    expect(inner.options!.map((o) => o.value)).to.include(inner.value);
    let got = "x";
    wrap.addEventListener("change", (e) => { got = (e.target as HTMLSelectElement).value; });
    inner.dispatchEvent(new CustomEvent("selected", { detail: { value: inner.value } }));
    expect(got, "picked back as \"\"").to.equal("");
    host.remove();
  });
});
