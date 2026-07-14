/**
 * Component test for the Lovelace card's saved-view scope (v2.26 — the last
 * open piece of roadmap item 2).
 *
 * Pins:
 *   - `view_id` in the card config applies the view's status/user/label
 *     filters ON TOP of the card's own filters (AND semantics, unlike the
 *     panel where applying a view replaces the filter state)
 *   - the `current_user` sentinel resolves against hass.user client-side
 *   - a deleted/unknown view id degrades to "no view filter", never an
 *     inexplicably empty card (same fallback as backend notification routing)
 */

import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import "../maintenance-card.js";
import type { MaintenanceSupporterCard } from "../maintenance-card";

const T = (
  id: string, name: string, status: string,
  extra: Record<string, unknown> = {},
) => ({ id, name, status, days_until_due: 1, type: "service", ...extra });
const O = (entry_id: string, name: string, tasks: unknown[]) => ({
  entry_id, object: { id: entry_id, name }, tasks,
});

function mockObjects() {
  return [
    O("e1", "Garden shed", [
      T("t1", "Sharpen mower blades", "overdue", { labels: ["garden"], responsible_user_id: "u1" }),
      T("t2", "Oil hedge trimmer", "due_soon", { labels: ["garden"], responsible_user_id: "u2" }),
    ]),
    O("e2", "Kitchen", [
      T("t3", "Descale kettle", "overdue", { labels: ["kitchen"], responsible_user_id: "u1" }),
      T("t4", "Clean extractor", "ok", { labels: [], responsible_user_id: null }),
    ]),
  ];
}

const VIEWS = [
  { id: "vgarden", name: "Garden", filters: { status: "", user_id: null, label: "garden", archived: false, sort_mode: "due_date", group_by: "none" } },
  { id: "vmine", name: "Mine", filters: { status: "", user_id: "current_user", label: null, archived: false, sort_mode: "due_date", group_by: "none" } },
  { id: "voverdue", name: "Overdue only", filters: { status: "overdue", user_id: null, label: null, archived: false, sort_mode: "due_date", group_by: "none" } },
];

function mockHass() {
  return {
    language: "en",
    user: { id: "u1", name: "Tester", is_admin: true, is_owner: true },
    connection: {
      sendMessagePromise: async (msg: { type: string }) => {
        if (msg.type === "maintenance_supporter/objects") return { objects: mockObjects() };
        if (msg.type === "maintenance_supporter/views/list") return { views: VIEWS };
        return { overdue: 0, due_soon: 0, triggered: 0, ok: 0, total: 0 };
      },
      subscribeMessage: async () => () => {},
    },
  };
}

async function mount(config: Record<string, unknown> = {}): Promise<MaintenanceSupporterCard> {
  const el = await fixture<MaintenanceSupporterCard>(
    html`<maintenance-supporter-card .hass=${mockHass() as never}></maintenance-supporter-card>`
  );
  el.setConfig({ type: "custom:maintenance-supporter-card", show_actions: false, ...config } as never);
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

describe("maintenance-card saved-view scope", () => {
  it("applies the view's label filter", async () => {
    const el = await mount({ view_id: "vgarden" });
    await waitUntil(() => names(el).length === 2, "view filter applied", { timeout: 2000 });
    expect(names(el)).to.deep.equal(["Sharpen mower blades", "Oil hedge trimmer"]);
  });

  it("resolves the current_user sentinel against hass.user", async () => {
    const el = await mount({ view_id: "vmine" });
    await waitUntil(() => names(el).length === 2, "user filter applied", { timeout: 2000 });
    // u1 owns t1 + t3; t2 is u2's, t4 unassigned.
    expect(names(el)).to.deep.equal(["Sharpen mower blades", "Descale kettle"]);
  });

  it("ANDs the view with the card's own filters", async () => {
    const el = await mount({ view_id: "vgarden", filter_status: ["overdue"] });
    await waitUntil(() => names(el).length === 1, "combined filter applied", { timeout: 2000 });
    expect(names(el)).to.deep.equal(["Sharpen mower blades"]);
  });

  it("applies the view's own status filter", async () => {
    const el = await mount({ view_id: "voverdue" });
    await waitUntil(() => names(el).length === 2, "status filter applied", { timeout: 2000 });
    expect(names(el)).to.deep.equal(["Sharpen mower blades", "Descale kettle"]);
  });

  it("a deleted view id degrades to no view filter, not an empty card", async () => {
    const el = await mount({ view_id: "deleted_view" });
    await waitUntil(() => names(el).length === 4, "fallback shows all", { timeout: 2000 });
    expect(names(el)).to.have.length(4);
  });
});
