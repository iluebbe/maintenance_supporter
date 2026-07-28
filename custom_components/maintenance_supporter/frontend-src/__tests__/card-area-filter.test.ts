/**
 * Component test for the card's `filter_areas` option (roadmap C8).
 *
 * The card already had `filter_objects` and `filter_labels` but not areas,
 * although every object carries `area_id` (exposed by _build_object_payload).
 * `filter_areas` is the object-level twin of `filter_objects`: it selects
 * whole objects by the room they sit in, which is what a wall tablet showing
 * "the tasks for this room" needs.
 *
 * Pins:
 *   - a single area keeps only that room's objects
 *   - several areas are OR'd, like filter_objects / filter_labels
 *   - an object with no area_id never matches a non-empty list
 *   - absent / empty filter_areas leaves the card unchanged
 *   - it ANDs with the other filters rather than replacing them
 */

import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import "../maintenance-card.js";
import type { MaintenanceSupporterCard } from "../maintenance-card";

const T = (id: string, name: string, extra: Record<string, unknown> = {}) => ({
  id, name, status: "overdue", days_until_due: -1, type: "service", ...extra,
});

const OBJECTS = [
  {
    entry_id: "e1",
    object: { id: "e1", name: "Dishwasher", area_id: "kitchen" },
    tasks: [T("t1", "Clean filter", { labels: ["appliance"] })],
  },
  {
    entry_id: "e2",
    object: { id: "e2", name: "Oven", area_id: "kitchen" },
    tasks: [T("t2", "Descale", { labels: ["descale"] })],
  },
  {
    entry_id: "e3",
    object: { id: "e3", name: "Boiler", area_id: "cellar" },
    tasks: [T("t3", "Service boiler", { labels: ["appliance"] })],
  },
  {
    // No area at all — the "unassigned object" case.
    entry_id: "e4",
    object: { id: "e4", name: "Bicycle" },
    tasks: [T("t4", "Oil the chain")],
  },
  {
    // area_id explicitly null, as the WS payload sends it for an object
    // whose area was never set.
    entry_id: "e5",
    object: { id: "e5", name: "Lawnmower", area_id: null },
    tasks: [T("t5", "Sharpen blades")],
  },
];

function mockHass() {
  return {
    language: "en",
    user: { id: "u1", name: "Tester", is_admin: true, is_owner: true },
    areas: {
      kitchen: { area_id: "kitchen", name: "Kitchen" },
      cellar: { area_id: "cellar", name: "Cellar" },
    },
    connection: {
      sendMessagePromise: async (msg: { type: string }) => {
        if (msg.type === "maintenance_supporter/objects") return { objects: OBJECTS };
        return { overdue: 0, due_soon: 0, triggered: 0, ok: 0, total: 0 };
      },
      subscribeMessage: async () => () => {},
    },
  };
}

/** Lovelace order: setConfig() first, then hass. */
async function mount(config: Record<string, unknown> = {}) {
  const el = await fixture<MaintenanceSupporterCard>(
    html`<maintenance-supporter-card></maintenance-supporter-card>`
  );
  el.setConfig({
    type: "custom:maintenance-supporter-card",
    show_actions: false,
    show_documents: false,
    ...config,
  } as never);
  el.hass = mockHass() as never;
  await waitUntil(
    () => el.shadowRoot!.querySelectorAll(".task-name, .empty-card").length > 0,
    "card renders",
    { timeout: 2000 }
  );
  await el.updateComplete;
  return el;
}

const names = (el: MaintenanceSupporterCard) =>
  [...el.shadowRoot!.querySelectorAll(".task-name")].map((n) => n.textContent?.trim() || "");

describe("maintenance-card area filter", () => {
  it("shows every task when no area filter is set", async () => {
    const el = await mount();
    expect(names(el)).to.have.lengthOf(5);
  });

  it("treats an empty list as no filter at all", async () => {
    const el = await mount({ filter_areas: [] });
    expect(names(el)).to.have.lengthOf(5);
  });

  it("limits the card to one area", async () => {
    const el = await mount({ filter_areas: ["kitchen"] });
    expect(names(el)).to.deep.equal(["Clean filter", "Descale"]);
  });

  it("keeps the tasks of every object in the listed areas (OR)", async () => {
    const el = await mount({ filter_areas: ["kitchen", "cellar"] });
    expect(names(el)).to.have.members(["Clean filter", "Descale", "Service boiler"]);
    expect(names(el)).to.have.lengthOf(3);
  });

  it("excludes objects without an area once a filter is set", async () => {
    const el = await mount({ filter_areas: ["kitchen"] });
    expect(names(el)).to.not.contain("Oil the chain");
    expect(names(el)).to.not.contain("Sharpen blades");
  });

  it("shows nothing for an area that holds no object", async () => {
    const el = await mount({ filter_areas: ["attic"] });
    expect(names(el)).to.have.lengthOf(0);
  });

  it("ANDs with filter_labels instead of replacing it", async () => {
    // "appliance" alone matches t1 (kitchen) + t3 (cellar); adding the area
    // narrows it to the kitchen one.
    const both = await mount({ filter_areas: ["kitchen"], filter_labels: ["appliance"] });
    expect(names(both)).to.deep.equal(["Clean filter"]);

    const labelOnly = await mount({ filter_labels: ["appliance"] });
    expect(labelOnly ? names(labelOnly) : []).to.have.members(["Clean filter", "Service boiler"]);
  });

  it("ANDs with filter_objects — an object outside the area drops out", async () => {
    const el = await mount({ filter_areas: ["kitchen"], filter_objects: ["Boiler"] });
    expect(names(el)).to.have.lengthOf(0);
  });

  it("ANDs with filter_objects — the intersection survives", async () => {
    const el = await mount({ filter_areas: ["kitchen"], filter_objects: ["Oven"] });
    expect(names(el)).to.deep.equal(["Descale"]);
  });
});
