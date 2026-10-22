/**
 * #225: objects inside other objects. An object's *Parent object* (2.19,
 * `parent_entry_id`) used to nest only its device in Home Assistant; the
 * panel listed every object flat. Pins:
 *   - the tree helpers (a parent outside the list, a cycle, the chain up,
 *     everything below, the rows of a folded table)
 *   - All objects: a sub-object is a chip on its parent's card instead of a
 *     card of its own; the chip opens it; a parent holding an overdue object
 *     is marked and sorts with it; a container says how many objects it holds
 *   - an archived (hidden) parent, another area group, select mode: the
 *     object stands on its own
 *   - the table: a parent's rows fold behind a chevron, remembered
 *   - the object page: a Sub-objects section, Add sub-object (a new
 *     object, one from a template, an existing one moved inside), the
 *     breadcrumb and the back arrow climb the chain
 *   - the object dialog: a preset parent, no cycles offered, path names
 */

import { expect, fixture, html } from "@open-wc/testing";
import { ancestorsOf, buildObjectTree, descendantIds, subtreeOf, treeRows } from "../helpers/object-tree";
import "../components/object-dialog";
import type { MaintenanceObjectDialog } from "../components/object-dialog";
import type { MaintenanceObjectResponse } from "../types";
import { createMockHass } from "./_test-utils.js";
import { mountPanel, obj, resetTaskSeq, sr, task } from "./_panel-utils.js";

type Panel = HTMLElement & {
  updateComplete: Promise<unknown>;
  _showAllObjects: () => void;
  _showObject: (id: string) => void;
  _view: string;
  _selectedEntryId: string | null;
  _objectViewMode: string;
  _groupByMode: string;
  _objectSortMode: string;
  _showArchived: boolean;
  _addSubObject: (id: string) => void;
};

function child(entryId: string, parent: string | null, tasks: unknown[], name: string, extra: Record<string, unknown> = {}) {
  const o = obj(entryId, tasks, name);
  Object.assign(o.object, { parent_entry_id: parent, ...extra });
  return o;
}

/** Vehicles holds two cars (one overdue); Garden holds the mower, which
 *  holds its blade set; the Boiler stands alone. */
function fleet() {
  return [
    child("veh", null, [], "Vehicles"),
    child("car1", "veh", [task({ status: "overdue", days_until_due: -3 })], "Car 1"),
    child("car2", "veh", [task({ days_until_due: 40 })], "Car 2"),
    child("gar", null, [task({ days_until_due: 20 })], "Garden"),
    child("mow", "gar", [task({ days_until_due: 15 })], "Mower"),
    child("blade", "mow", [task({ days_until_due: 30 })], "Blade set"),
    child("boil", null, [task({ days_until_due: 5 })], "Boiler"),
  ];
}

const settle = async (el: { updateComplete: Promise<unknown> }) => { await new Promise((r) => setTimeout(r, 30)); await el.updateComplete; };
const cards = (el: HTMLElement) => [...sr(el).querySelectorAll<HTMLElement>(".objects-grid > .object-card")];
const cardOf = (el: HTMLElement, id: string) => sr(el).querySelector<HTMLElement>(`.objects-grid > .object-card[data-entry-id="${id}"]`);
const chipsOf = (card: HTMLElement) => [...card.querySelectorAll<HTMLElement>(".object-child-chip")];

async function allObjects(objects = fleet(), prepare?: (p: Panel) => void) {
  const { el, sent } = await mountPanel(objects);
  const panel = el as Panel;
  prepare?.(panel);
  panel._showAllObjects();
  await settle(panel);
  return { el: panel, sent: sent as Array<Record<string, unknown>> };
}

describe("object tree helpers (#225)", () => {
  const list = fleet() as unknown as MaintenanceObjectResponse[];

  it("builds the top level and what sits inside each", () => {
    const tree = buildObjectTree(list);
    expect(tree.roots.map((o) => o.entry_id)).to.deep.equal(["veh", "gar", "boil"]);
    expect(tree.children.get("veh")!.map((o) => o.entry_id)).to.deep.equal(["car1", "car2"]);
    expect(tree.children.get("mow")!.map((o) => o.entry_id)).to.deep.equal(["blade"]);
    expect(subtreeOf(tree, list[3]).map((o) => o.entry_id)).to.deep.equal(["gar", "mow", "blade"]);
  });

  it("a parent outside the list makes a top-level object", () => {
    const tree = buildObjectTree(list.filter((o) => o.entry_id !== "veh"));
    expect(tree.roots.map((o) => o.entry_id)).to.include.members(["car1", "car2"]);
  });

  it("a cycle draws every object once, at the top level", () => {
    const loop = [child("a", "b", [], "A"), child("b", "a", [], "B"), child("c", "a", [], "C")] as unknown as MaintenanceObjectResponse[];
    const tree = buildObjectTree(loop);
    expect(tree.roots.map((o) => o.entry_id)).to.deep.equal(["a", "b"]);
    expect(tree.children.get("a")!.map((o) => o.entry_id), "hanging off the cycle").to.deep.equal(["c"]);
    expect(treeRows(tree, () => true).map((r) => r.obj.entry_id)).to.deep.equal(["a", "c", "b"]);
    const self = buildObjectTree([child("s", "s", [], "Self")] as unknown as MaintenanceObjectResponse[]);
    expect(self.roots.length).to.equal(1);
    expect(ancestorsOf(loop, "c").map((o) => o.entry_id), "the chain stops where it repeats").to.deep.equal(["b", "a"]);
  });

  it("climbs the chain and lists everything below", () => {
    expect(ancestorsOf(list, "blade").map((o) => o.entry_id)).to.deep.equal(["gar", "mow"]);
    expect(ancestorsOf(list, "boil")).to.deep.equal([]);
    expect([...descendantIds(list, "gar")].sort()).to.deep.equal(["blade", "mow"]);
    expect(descendantIds(list, "boil").size).to.equal(0);
  });

  it("table rows: depth first, a folded parent's rows left out", () => {
    const tree = buildObjectTree(list);
    expect(treeRows(tree, () => false).map((r) => r.obj.entry_id)).to.deep.equal(["veh", "gar", "boil"]);
    const open = treeRows(tree, (id) => id === "gar" || id === "mow");
    expect(open.map((r) => [r.obj.entry_id, r.depth])).to.deep.equal([["veh", 0], ["gar", 0], ["mow", 1], ["blade", 2], ["boil", 0]]);
  });
});

describe("All objects as a tree (#225)", () => {
  beforeEach(() => {
    resetTaskSeq();
    localStorage.clear();
    localStorage.setItem("msp-overview-tab", "dashboard");
  });
  afterEach(() => localStorage.clear());

  it("a sub-object is a chip on its parent's card, not a card of its own", async () => {
    const { el } = await allObjects();
    expect(cards(el).map((c) => c.dataset.entryId).sort()).to.deep.equal(["boil", "gar", "veh"]);
    const veh = cardOf(el, "veh")!;
    expect(chipsOf(veh).map((c) => c.textContent!.trim())).to.deep.equal(["Car 1", "Car 2"]);
    // The mower holds the blade set: its chip says how many are inside.
    const mower = chipsOf(cardOf(el, "gar")!)[0];
    expect(mower.querySelector(".object-child-count")!.textContent).to.equal("1");
    // A container without tasks of its own says what it holds.
    expect(veh.querySelector(".object-card-count")!.textContent!.trim()).to.equal("2 sub-objects");
    expect(veh.querySelector(".object-card-empty") === null, "not 'No tasks yet'").to.equal(true);
    expect(cardOf(el, "gar")!.querySelector(".object-card-count")!.textContent!.trim(), "own tasks first").to.equal("1 task");
  });

  it("the chip opens the sub-object", async () => {
    const { el } = await allObjects();
    chipsOf(cardOf(el, "veh")!)[1].click();
    await el.updateComplete;
    expect(el._view).to.equal("object");
    expect(el._selectedEntryId).to.equal("car2");
  });

  it("an overdue object inside marks its parent and its chip", async () => {
    const { el } = await allObjects();
    const veh = cardOf(el, "veh")!;
    expect(veh.classList.contains("object-card-overdue")).to.equal(true);
    expect(veh.querySelector(".overdue-dot")).to.exist;
    const [car1, car2] = chipsOf(veh);
    expect(car1.classList.contains("overdue")).to.equal(true);
    expect(car2.classList.contains("overdue")).to.equal(false);
    expect(cardOf(el, "gar")!.classList.contains("object-card-overdue")).to.equal(false);
  });

  it("sorted by due date, a parent sorts by the soonest due inside it", async () => {
    const { el } = await allObjects(fleet(), (p) => { p._objectSortMode = "due_soonest"; });
    // Vehicles (a car 3 days overdue), Boiler (5), Garden (its mower in 15).
    expect(cards(el).map((c) => c.dataset.entryId)).to.deep.equal(["veh", "boil", "gar"]);
  });

  it("sorted by task count, a parent counts the tasks inside it", async () => {
    const { el } = await allObjects(fleet(), (p) => { p._objectSortMode = "task_count"; });
    // Garden 3 (own + mower + blade set), Vehicles 2, Boiler 1.
    expect(cards(el).map((c) => c.dataset.entryId)).to.deep.equal(["gar", "veh", "boil"]);
  });

  it("a hidden archived parent leaves its objects on their own", async () => {
    const objects = fleet();
    Object.assign(objects[0].object, { archived: true, archived_at: "2026-10-01T10:00:00" });
    const { el } = await allObjects(objects);
    expect(cardOf(el, "veh") === null, "archived and hidden").to.equal(true);
    expect(cardOf(el, "car1"), "a card of its own").to.exist;
    expect(cardOf(el, "car2")).to.exist;
  });

  it("grouped by area, an object sits inside its parent only within the same area", async () => {
    const objects = fleet();
    Object.assign(objects[1].object, { area_id: "garage" }); // Car 1 in the garage, Vehicles without area
    const { el } = await allObjects(objects, (p) => {
      (p as unknown as { hass: { areas: unknown } }).hass.areas = { garage: { area_id: "garage", name: "Garage" } };
      p._groupByMode = "area";
    });
    const sections = [...sr(el).querySelectorAll<HTMLElement>("details.group-section")];
    const garage = sections.find((s) => s.querySelector(".group-section-header")!.textContent!.includes("Garage"))!;
    expect(garage.querySelector('.object-card[data-entry-id="car1"]'), "Car 1 stands alone in the garage").to.exist;
    const none = sections.find((s) => s.querySelector('.object-card[data-entry-id="veh"]'))!;
    expect(chipsOf(none.querySelector<HTMLElement>('.object-card[data-entry-id="veh"]')!).map((c) => c.textContent!.trim())).to.deep.equal(["Car 2"]);
  });

  it("select mode lists every object on its own", async () => {
    const { el } = await allObjects();
    sr(el).querySelector<HTMLElement>(".obj-bulk-toggle")!.click();
    await el.updateComplete;
    expect(cards(el).length).to.equal(7);
    expect(sr(el).querySelector(".object-child-chip") === null).to.equal(true);
  });

  it("the table folds a parent's rows behind a chevron and remembers it", async () => {
    const { el } = await allObjects(fleet(), (p) => { p._objectViewMode = "table"; });
    const ids = () => [...sr(el).querySelectorAll<HTMLElement>(".objects-table tbody tr")].map((r) => r.dataset.entryId);
    expect(ids()).to.deep.equal(["boil", "gar", "veh"]);
    const vehRow = sr(el).querySelector<HTMLElement>('tr[data-entry-id="veh"]')!;
    expect(vehRow.querySelector(".object-tree-count")!.textContent).to.equal("2");
    const toggle = vehRow.querySelector<HTMLButtonElement>(".object-tree-toggle")!;
    expect(toggle.getAttribute("aria-expanded")).to.equal("false");
    expect(toggle.getAttribute("aria-label")).to.equal("Show sub-objects");
    expect(sr(el).querySelector('tr[data-entry-id="boil"] .object-tree-spacer'), "names line up").to.exist;
    toggle.click();
    await el.updateComplete;
    expect(el._view, "the chevron does not open the object").to.equal("all_objects");
    expect(ids()).to.deep.equal(["boil", "gar", "veh", "car1", "car2"]);
    const car = sr(el).querySelector<HTMLElement>('tr[data-entry-id="car1"]')!;
    expect(car.classList.contains("sub-object-row")).to.equal(true);
    expect(car.querySelector<HTMLElement>(".oc-name")!.style.paddingLeft).to.equal("34px");
    expect(JSON.parse(localStorage.getItem("msp-object-tree-open")!)).to.deep.equal(["veh"]);
    expect(sr(el).querySelector('tr[data-entry-id="veh"] .object-tree-count') === null, "no count while open").to.equal(true);
  });

  it("a remembered open parent starts open", async () => {
    localStorage.setItem("msp-object-tree-open", JSON.stringify(["gar", "mow", 7]));
    const { el } = await allObjects(fleet(), (p) => { p._objectViewMode = "table"; });
    const ids = [...sr(el).querySelectorAll<HTMLElement>(".objects-table tbody tr")].map((r) => r.dataset.entryId);
    expect(ids).to.deep.equal(["boil", "gar", "mow", "blade", "veh"]);
  });
});

describe("the object page of a tree (#225)", () => {
  beforeEach(() => {
    resetTaskSeq();
    localStorage.clear();
    localStorage.setItem("msp-overview-tab", "dashboard");
  });
  afterEach(() => localStorage.clear());

  async function page(id: string, user?: { id: string; is_admin: boolean }) {
    const { el } = await mountPanel(fleet(), {}, user ? { user } : {});
    const panel = el as Panel;
    panel._showObject(id);
    await settle(panel);
    return panel;
  }

  it("lists the objects inside it, with Add sub-object", async () => {
    const el = await page("gar");
    const section = sr(el).querySelector<HTMLElement>('.obj-section[data-section="children"]')!;
    expect(section, "a Sub-objects section").to.exist;
    expect(section.querySelector(".sub-objects-head")!.textContent).to.contain("Sub-objects (1)");
    const card = section.querySelector<HTMLElement>('.object-card[data-entry-id="mow"]')!;
    expect(chipsOf(card).map((c) => c.textContent!.trim()), "the blade set inside the mower").to.deep.equal(["Blade set"]);
    expect(section.nextElementSibling!.getAttribute("data-section"), "before the tasks").to.equal("tasks");

    let asked: string | null = null;
    el._addSubObject = (id: string) => { asked = id; };
    section.querySelector<HTMLElement>(".add-sub-object")!.click();
    await el.updateComplete;
    const menu = section.querySelector<HTMLElement>(".sub-object-menu")!;
    expect([...menu.querySelectorAll(".popup-menu-item")].map((i) => i.textContent!.trim()))
      .to.deep.equal(["New Object", "From template", "Move an existing object here"]);
    menu.querySelector<HTMLElement>(".sub-object-new")!.click();
    await el.updateComplete;
    expect(asked).to.equal("gar");
    expect(section.querySelector(".sub-object-menu") === null, "the pick closes it").to.equal(true);
  });

  it("no section without objects inside, and none to add for a reader", async () => {
    const el = await page("boil");
    expect(sr(el).querySelector('.obj-section[data-section="children"]') === null).to.equal(true);
    const reader = await page("gar", { id: "op-1", is_admin: false });
    expect(sr(reader).querySelector('.obj-section[data-section="children"]')).to.exist;
    expect(sr(reader).querySelector(".add-sub-object") === null).to.equal(true);
  });

  it("the breadcrumb and the back arrow climb the chain", async () => {
    const el = await page("blade");
    const crumbs = sr(el).querySelector<HTMLElement>(".breadcrumbs")!;
    expect(crumbs.textContent!.replace(/\s+/g, " ").trim()).to.equal("Maintenance / Garden / Mower / Blade set");
    [...crumbs.querySelectorAll<HTMLElement>("a")].find((a) => a.textContent === "Garden")!.click();
    await el.updateComplete;
    expect(el._selectedEntryId).to.equal("gar");

    el._showObject("blade");
    await el.updateComplete;
    sr(el).querySelector<HTMLElement>(".header ha-icon-button")!.click();
    await el.updateComplete;
    expect(el._view).to.equal("object");
    expect(el._selectedEntryId, "up to the mower").to.equal("mow");
    sr(el).querySelector<HTMLElement>(".header ha-icon-button")!.click();
    await el.updateComplete;
    expect(el._selectedEntryId).to.equal("gar");
    sr(el).querySelector<HTMLElement>(".header ha-icon-button")!.click();
    await el.updateComplete;
    expect(el._view, "a top-level object goes back to the overview").to.equal("overview");
  });

  it("select mode left on in All objects does not reach an object page", async () => {
    const el = await page("gar");
    (el as unknown as { _objBulkMode: boolean })._objBulkMode = true;
    await el.updateComplete;
    const card = sr(el).querySelector<HTMLElement>('.obj-section[data-section="children"] .object-card')!;
    expect(card.classList.contains("selectable")).to.equal(false);
    card.click();
    await el.updateComplete;
    expect(el._selectedEntryId, "the card opens the mower").to.equal("mow");
  });

  it("a phone's breadcrumb names only the object it sits in", async () => {
    const el = await page("blade");
    (el as unknown as { narrow: boolean }).narrow = true;
    await el.updateComplete;
    const crumbs = sr(el).querySelector<HTMLElement>(".breadcrumbs")!;
    expect(crumbs.textContent!.replace(/\s+/g, " ").trim()).to.equal("Maintenance / Mower / Blade set");
  });

  it("the ⋮ menu's Add sub-object opens the same choices in its place", async () => {
    const el = await page("boil");
    (el as unknown as { _toggleObjMenu: () => void })._toggleObjMenu();
    await el.updateComplete;
    const item = sr(el).querySelector<HTMLElement>(".add-sub-object-item")!;
    expect(item.textContent).to.equal("Add sub-object");
    item.click();
    await el.updateComplete;
    const wrapper = sr(el).querySelector<HTMLElement>(".detail-header .more-menu-wrapper")!;
    expect(wrapper.querySelector(".add-sub-object-item") === null, "the ⋮ menu closed").to.equal(true);
    expect(wrapper.querySelector(".sub-object-menu .sub-object-template")).to.exist;
    expect(wrapper.querySelector(".sub-object-menu-head") === null, "placed like the ⋮ menu").to.equal(true);
  });
});

describe("Add sub-object: from a template, or an existing object (#225)", () => {
  beforeEach(() => {
    resetTaskSeq();
    localStorage.clear();
    localStorage.setItem("msp-overview-tab", "dashboard");
  });
  afterEach(() => localStorage.clear());

  type Chooser = Panel & {
    _moveHereChoices: (id: string) => Array<{ value: string; label: string }>;
    _openTemplateGallery: (parent?: string | null) => Promise<void>;
  };

  async function page(id: string, objects = fleet()) {
    const { el, sent } = await mountPanel(objects, {
      "maintenance_supporter/templates": () => ({ categories: {}, templates: [{ id: "home_hvac", name: "HVAC", category: "home", tasks: [{}] }] }),
      "maintenance_supporter/object/from_template": () => ({ entry_id: "new-1" }),
      "maintenance_supporter/object/update": () => ({ success: true }),
    });
    const panel = el as Chooser;
    panel._showObject(id);
    await settle(panel);
    return { el: panel, sent: sent as Array<Record<string, unknown>> };
  }

  async function pick(el: Chooser, cls: string) {
    sr(el).querySelector<HTMLElement>(".add-sub-object")!.click();
    await el.updateComplete;
    sr(el).querySelector<HTMLElement>(`.sub-object-menu .${cls}`)!.click();
    await settle(el);
  }

  it("offers every object but itself, those it sits in and those already inside it", async () => {
    const objects = fleet();
    objects.push(child("old", null, [], "Old shed", { archived: true }), child("bat", null, [], "Batteries", { battery_fleet: true }));
    const { el } = await page("mow", objects);
    expect(el._moveHereChoices("mow").map((c) => [c.value, c.label])).to.deep.equal([
      ["boil", "Boiler"],
      ["veh", "Vehicles"],
      ["car1", "Vehicles › Car 1"],
      ["car2", "Vehicles › Car 2"],
    ]);
    expect(el._moveHereChoices("veh").map((c) => c.label), "a whole branch can move").to.deep.equal([
      "Boiler", "Garden", "Garden › Mower", "Garden › Mower › Blade set",
    ]);
  });

  it("moves the chosen object inside", async () => {
    const { el, sent } = await page("mow");
    type Prompt = { title: string; message: string; options: Array<{ value: string }> };
    const asked: { opts?: Prompt } = {};
    const dlg = sr(el).querySelector("maintenance-confirm-dialog") as unknown as { prompt: (o: Prompt) => Promise<unknown> };
    dlg.prompt = async (o: Prompt) => { asked.opts = o; return { confirmed: true, value: "boil" }; };
    await pick(el, "sub-object-move");
    expect(asked.opts!.title).to.equal("Move an existing object here");
    expect(asked.opts!.message).to.contain("inside Mower");
    expect(asked.opts!.options.map((o) => o.value)).to.deep.equal(["boil", "veh", "car1", "car2"]);
    const update = sent.find((m) => m.type === "maintenance_supporter/object/update")!;
    expect(update).to.include({ entry_id: "boil", parent_entry_id: "mow" });
  });

  it("no move without an object that could go there", async () => {
    const { el } = await page("p", [child("p", null, [], "Parent"), child("c", "p", [], "Child")]);
    sr(el).querySelector<HTMLElement>(".add-sub-object")!.click();
    await el.updateComplete;
    expect([...sr(el).querySelectorAll(".sub-object-menu .popup-menu-item")].map((i) => i.textContent!.trim()))
      .to.deep.equal(["New Object", "From template"]);
  });

  it("from a template: the gallery says where the object goes, and it is created there", async () => {
    const { el, sent } = await page("gar");
    await pick(el, "sub-object-template");
    expect(sr(el).querySelector(".template-parent-hint")!.textContent!.trim()).to.equal("The new object goes inside Garden.");
    sr(el).querySelector<HTMLElement>(".template-card")!.click();
    await settle(el);
    const create = sent.find((m) => m.type === "maintenance_supporter/object/from_template")!;
    expect(create).to.include({ template_id: "home_hvac", parent_entry_id: "gar" });

    // The New menu's gallery still makes a top-level object.
    await el._openTemplateGallery();
    await settle(el);
    expect(sr(el).querySelector(".template-parent-hint") === null).to.equal(true);
    sr(el).querySelector<HTMLElement>(".template-card")!.click();
    await settle(el);
    const second = sent.filter((m) => m.type === "maintenance_supporter/object/from_template")[1];
    expect("parent_entry_id" in second).to.equal(false);
  });
});

describe("the object dialog's parent (#225)", () => {
  async function dialog() {
    const { hass } = createMockHass();
    const el = await fixture<MaintenanceObjectDialog>(html`
      <maintenance-object-dialog .hass=${hass as never} .objects=${fleet() as never}></maintenance-object-dialog>
    `);
    return el;
  }
  const options = (el: HTMLElement) =>
    [...el.shadowRoot!.querySelectorAll<HTMLOptionElement>(".parent-select option")].map((o) => [o.value, o.textContent!.trim()]);

  it("a new sub-object starts with its parent", async () => {
    const el = await dialog();
    el.openCreate("gar");
    await el.updateComplete;
    const select = el.shadowRoot!.querySelector<HTMLSelectElement>(".parent-select")!;
    expect(select.value).to.equal("gar");
    expect(el.shadowRoot!.querySelector(".parent-select + .md-hint")!.textContent).to.contain("Shown inside the parent");
    el.openCreate();
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector<HTMLSelectElement>(".parent-select")!.value, "a plain new object has none").to.equal("");
  });

  it("names each choice by its path and offers no cycle", async () => {
    const el = await dialog();
    el.openEdit("gar", fleet()[3].object as never);
    await el.updateComplete;
    expect(options(el)).to.deep.equal([
      ["", "(No parent)"],
      ["boil", "Boiler"],
      ["veh", "Vehicles"],
      ["car1", "Vehicles › Car 1"],
      ["car2", "Vehicles › Car 2"],
    ]);
  });
});
