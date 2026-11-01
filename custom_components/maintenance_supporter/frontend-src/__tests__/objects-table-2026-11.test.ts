/**
 * The objects table, from the column test on the faketime year (2026-11-01):
 *   - the Notes column showed the raw markdown ("**Filter** [manual](…)");
 *     it shows the text, one line, the tooltip too
 *   - the headers did not sort; each one does now (a second tap turns the
 *     order round, empty cells last, the Sort dropdown takes over again)
 *   - with a dozen columns the name scrolled out of view; it stays put
 *   - with the beta UI the filter bars were the one place still on the
 *     browser's select
 */

import { expect } from "@open-wc/testing";
import { mountPanel, obj, resetTaskSeq, sr } from "./_panel-utils.js";
import { notesPlainText } from "../helpers/notes-markdown";
import { setBetaUi } from "../helpers/beta-ui";

// Home Assistant's elements the beta UI builds on, stubbed as beta-ui.test does.
for (const tag of ["ha-dropdown", "ha-dropdown-item", "wa-divider", "ha-adaptive-dialog", "ha-select", "ha-input", "ha-switch",
  "ha-checkbox", "ha-settings-row", "ha-expansion-panel", "ha-alert", "ha-tab-group", "ha-tab-group-tab"]) {
  if (!customElements.get(tag)) customElements.define(tag, class extends HTMLElement {});
}

type PanelEl = HTMLElement & {
  updateComplete: Promise<unknown>;
  requestUpdate: () => void;
  _view: string;
  _objectViewMode: string;
  _objectsTableColumns: string[];
  _objTableSort: { key: string; dir: string } | null;
};

function object(entryId: string, name: string, extra: Record<string, unknown> = {}) {
  const o = obj(entryId, [], name);
  Object.assign(o.object, extra);
  return o;
}

async function mountTable(columns: string[]) {
  const { el } = await mountPanel([
    object("e1", "Boiler", { manufacturer: "Vaillant", notes: "**Filter** every year, see [the manual](https://example.com/m.pdf)" }),
    object("e2", "Alarm", { manufacturer: null }),
    object("e3", "Car", { manufacturer: "audi" }),
  ]);
  const panel = el as PanelEl;
  panel._view = "all_objects";
  panel._objectViewMode = "table";
  panel._objectsTableColumns = columns;
  await panel.updateComplete;
  await new Promise((r) => setTimeout(r, 10));
  await panel.updateComplete;
  return panel;
}

const names = (panel: PanelEl) =>
  [...sr(panel).querySelectorAll(".objects-table-row .objects-table-name")].map((n) => n.textContent!.trim());

async function tapHeader(panel: PanelEl, key: string) {
  sr(panel).querySelector<HTMLButtonElement>(`th.oc-${key} button`)!.click();
  await panel.updateComplete;
}

describe("objects table (2026-11)", () => {
  beforeEach(() => {
    resetTaskSeq();
    localStorage.clear();
  });
  afterEach(() => {
    localStorage.clear();
    setBetaUi(false);
  });

  it("notesPlainText drops the marks and keeps the text", () => {
    expect(notesPlainText("**Filter** every year, see [the manual](https://example.com/m.pdf)")).to.equal("Filter every year, see the manual");
    expect(notesPlainText("# Title\n- one\n- [x] two\n> quoted _really_ `code`")).to.equal("Title one two quoted really code");
    expect(notesPlainText("snake_case_name and 2*3*4 stay")).to.equal("snake_case_name and 2*3*4 stay");
    expect(notesPlainText(null)).to.equal("");
  });

  it("the Notes cell and its tooltip show the text, not the markdown", async () => {
    const panel = await mountTable(["name", "notes"]);
    const cell = [...sr(panel).querySelectorAll<HTMLElement>(".objects-table-row")]
      .find((r) => r.textContent!.includes("Boiler"))!.querySelector<HTMLElement>(".oc-notes")!;
    expect(cell.textContent!.trim()).to.equal("Filter every year, see the manual");
    expect(cell.title).to.equal("Filter every year, see the manual");
  });

  it("a header sorts by its column, again turns it round, empty cells last", async () => {
    const panel = await mountTable(["name", "manufacturer", "actions"]);
    expect(sr(panel).querySelector("th.oc-actions button") === null, "the actions column does not sort").to.equal(true);
    await tapHeader(panel, "manufacturer");
    expect(names(panel)).to.deep.equal(["Car", "Boiler", "Alarm"]); // audi, Vaillant, (none)
    expect(sr(panel).querySelector("th.oc-manufacturer")!.getAttribute("aria-sort")).to.equal("ascending");
    await tapHeader(panel, "manufacturer");
    expect(names(panel)).to.deep.equal(["Boiler", "Car", "Alarm"]); // empty stays last
    expect(sr(panel).querySelector("th.oc-manufacturer")!.getAttribute("aria-sort")).to.equal("descending");
    expect(localStorage.getItem("msp-object-table-sort")).to.equal("manufacturer:desc");
    await tapHeader(panel, "name");
    expect(names(panel)).to.deep.equal(["Alarm", "Boiler", "Car"]);
  });

  it("the name column stays put while the others scroll sideways", async () => {
    const panel = await mountTable(["name", "manufacturer"]);
    for (const cell of [sr(panel).querySelector("th.oc-name")!, sr(panel).querySelector("td.oc-name")!]) {
      const cs = getComputedStyle(cell);
      expect(cs.position).to.equal("sticky");
      expect(cs.left).to.equal("0px");
      expect(cs.backgroundColor, "opaque, the cells do not show through").to.not.equal("rgba(0, 0, 0, 0)");
    }
  });

  it("with the beta UI the sort dropdown is Home Assistant's select", async () => {
    const panel = await mountTable(["name"]);
    // The household's switch, as the panel's settings would bring it.
    setBetaUi(true);
    panel.requestUpdate();
    await panel.updateComplete;
    const bar = sr(panel).querySelector(".filter-bar")!;
    expect(bar.querySelectorAll("select").length, "no browser select left").to.equal(0);
    const sel = bar.querySelector("ms-ha-select") as (HTMLElement & { label: string }) | null;
    expect(sel !== null, "ms-ha-select").to.equal(true);
    expect(sel!.label).to.equal("Sort");
  });
});
