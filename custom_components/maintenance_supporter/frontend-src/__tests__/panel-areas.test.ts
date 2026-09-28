/** Areas in the panel (#191): the All objects breadcrumb chip opens the
 * areas page, a row opens the area, Back walks the same way (the area id
 * rides in the history state like entry/task ids), the object page links
 * to its area, and `?area=` deep-links straight in. */

import { expect } from "@open-wc/testing";
import { mountPanel, obj, resetTaskSeq, sr, task } from "./_panel-utils.js";

type Panel = HTMLElement & {
  updateComplete: Promise<unknown>;
  hass: { areas: Record<string, unknown> };
  _view: string;
  _selectedAreaId: string | null;
  _showAllObjects(): void;
  _showObject(entryId: string): void;
};

function objects() {
  resetTaskSeq();
  const kitchen = obj("e1", [task({ name: "Clean coils", history: [{ timestamp: "2026-02-10T12:00:00", type: "completed", cost: 50 }], history_count: 1 })], "Fridge");
  (kitchen.object as Record<string, unknown>).area_id = "kitchen";
  const loose = obj("e2", [task({ name: "Oil change" })], "Car");
  return [kitchen, loose];
}

async function settle(el: Panel): Promise<void> {
  await customElements.whenDefined("maintenance-areas-view");
  await customElements.whenDefined("maintenance-area-view");
  for (let i = 0; i < 3; i++) {
    await new Promise((r) => setTimeout(r, 20));
    await el.updateComplete;
    for (const child of sr(el).querySelectorAll<HTMLElement & { updateComplete?: Promise<unknown> }>("maintenance-areas-view, maintenance-area-view")) {
      await child.updateComplete;
    }
  }
}

async function mount(): Promise<Panel> {
  const { el } = await mountPanel(objects());
  const panel = el as unknown as Panel;
  panel.hass.areas = { kitchen: { area_id: "kitchen", name: "Kitchen", icon: "mdi:stove" } };
  return panel;
}

describe("panel areas navigation (#191)", () => {
  afterEach(() => history.replaceState(null, "", window.location.pathname));

  it("All objects chip → areas page → area, with the area id in the history state", async () => {
    const el = await mount();
    el._showAllObjects();
    await el.updateComplete;
    const chip = sr(el).querySelector<HTMLElement>('.sibling-view-chip[data-view="all_areas"]');
    expect(chip, "areas chip in the All objects breadcrumb").to.exist;
    chip!.click();
    await settle(el);
    expect(el._view).to.equal("all_areas");
    expect((history.state as { msp_view: string }).msp_view).to.equal("all_areas");

    const list = sr(el).querySelector("maintenance-areas-view")!;
    const rows = [...list.querySelectorAll<HTMLElement>("tbody tr")];
    expect(rows.map((r) => r.querySelector(".objects-table-name")!.textContent!.trim())).to.deep.equal(["Kitchen", "No area"]);
    rows[0].click();
    await settle(el);
    expect(el._view).to.equal("area");
    expect(el._selectedAreaId).to.equal("kitchen");
    expect((history.state as { msp_area: string }).msp_area).to.equal("kitchen");
    const detail = sr(el).querySelector("maintenance-area-view") as HTMLElement & { areaKey: string };
    expect(detail.areaKey).to.equal("kitchen");
    expect(detail.querySelector(".area-title")!.textContent).to.contain("Kitchen");
    // The header crumbs name the page too.
    expect(sr(el).querySelector(".breadcrumbs")!.textContent).to.contain("Kitchen");

    // Back (browser) restores the areas page, Forward the area.
    window.dispatchEvent(new PopStateEvent("popstate", { state: { msp_view: "all_areas", msp_entry: null, msp_task: null, msp_area: null } }));
    await settle(el);
    expect(el._view).to.equal("all_areas");
    window.dispatchEvent(new PopStateEvent("popstate", { state: { msp_view: "area", msp_entry: null, msp_task: null, msp_area: "kitchen" } }));
    await settle(el);
    expect(el._view).to.equal("area");
    expect(el._selectedAreaId).to.equal("kitchen");
  });

  it("the area page's rows lead on to the object and the task", async () => {
    const el = await mount();
    el._showAllObjects();
    await el.updateComplete;
    sr(el).querySelector<HTMLElement>('.sibling-view-chip[data-view="all_areas"]')!.click();
    await settle(el);
    sr(el).querySelector("maintenance-areas-view")!.querySelector<HTMLElement>("tbody tr")!.click();
    await settle(el);
    const detail = sr(el).querySelector("maintenance-area-view")!;
    // "All time", so the row does not depend on today's date.
    [...detail.querySelectorAll<HTMLElement>(".area-range-chips .filter-chip")].at(-1)!.click();
    await settle(el);
    detail.querySelector<HTMLElement>(".area-history-row")!.click();
    await el.updateComplete;
    expect(el._view).to.equal("task");
  });

  it("the object page links to its area; the parts page has the chip too", async () => {
    const el = await mount();
    el._showObject("e1");
    await el.updateComplete;
    const link = sr(el).querySelector<HTMLElement>(".object-area-link");
    expect(link!.textContent!.trim()).to.equal("Kitchen");
    link!.click();
    await settle(el);
    expect(el._view).to.equal("area");
    expect(el._selectedAreaId).to.equal("kitchen");
    el._showObject("e2");
    await el.updateComplete;
    expect(sr(el).querySelector(".object-area-link"), "no area, no link").to.equal(null);
  });

  it("?area= deep-links to the area; an unknown one lands on the areas page", async () => {
    history.replaceState(null, "", `${window.location.pathname}?area=kitchen`);
    const { el } = await mountPanel(objects());
    const panel = el as unknown as Panel;
    await settle(panel);
    expect(panel._view).to.equal("area");
    expect(panel._selectedAreaId).to.equal("kitchen");
    expect(window.location.search, "consumed once").to.equal("");

    history.replaceState(null, "", `${window.location.pathname}?area=attic`);
    const { el: el2 } = await mountPanel(objects());
    await settle(el2 as unknown as Panel);
    expect((el2 as unknown as Panel)._view).to.equal("all_areas");
  });
});
