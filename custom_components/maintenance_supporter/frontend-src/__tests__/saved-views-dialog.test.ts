/**
 * Component tests for the saved-views dialog (v2.24).
 *
 * Pins:
 *   - Save sends the CURRENT filters under the typed name and emits the
 *     server's returned list via `saved-views-changed`.
 *   - Delete sends the view id and emits the trimmed list.
 *   - The name input is a native <input> (the <ha-textfield> panel-context trap).
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/saved-views-dialog.js";
import type { MaintenanceSavedViewsDialog } from "../components/saved-views-dialog";
import type { SavedView, SavedViewFilters } from "../types";

function makeHass(sent: unknown[]) {
  return {
    language: "en",
    connection: {
      sendMessagePromise: async (msg: Record<string, unknown>) => {
        sent.push(msg);
        if (msg.type === "maintenance_supporter/views/save") {
          return { views: [{ id: "new1", name: msg.name, filters: msg.filters }] };
        }
        return { views: [] }; // delete -> empty
      },
    },
  };
}

const FILTERS: SavedViewFilters = {
  status: "overdue",
  user_id: "current_user",
  archived: true,
  sort_mode: "area",
  group_by: "user",
};

const EXISTING: SavedView[] = [
  { id: "v1", name: "Kitchen overdue", filters: { ...FILTERS } },
];

async function mount(sent: unknown[]) {
  const el = await fixture<MaintenanceSavedViewsDialog>(html`
    <maintenance-saved-views-dialog .hass=${makeHass(sent)}></maintenance-saved-views-dialog>
  `);
  await el.open(FILTERS, EXISTING);
  await el.updateComplete;
  return el;
}

describe("saved-views dialog", () => {
  it("lists existing views and uses a native input for the name", async () => {
    const el = await mount([]);
    const names = [...el.shadowRoot!.querySelectorAll(".row-name")].map((n) => n.textContent?.trim());
    expect(names).to.deep.equal(["Kitchen overdue"]);
    const input = el.shadowRoot!.querySelector(".name-input");
    expect(input?.tagName).to.equal("INPUT");
  });

  it("saves the current filters under the typed name and emits the new list", async () => {
    const sent: unknown[] = [];
    const el = await mount(sent);
    let emitted: SavedView[] | null = null;
    el.addEventListener("saved-views-changed", (e) => {
      emitted = (e as CustomEvent<{ views: SavedView[] }>).detail.views;
    });

    const input = el.shadowRoot!.querySelector<HTMLInputElement>(".name-input")!;
    input.value = "My view";
    input.dispatchEvent(new Event("input"));
    await el.updateComplete;

    const saveBtn = [...el.shadowRoot!.querySelectorAll("ha-button")].find((b) =>
      (b.textContent || "").toLowerCase().includes("save"),
    )!;
    (saveBtn as HTMLElement).click();
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));

    const saveMsg = (sent as Record<string, unknown>[]).find(
      (m) => m.type === "maintenance_supporter/views/save",
    )!;
    expect(saveMsg.name).to.equal("My view");
    expect(saveMsg.filters).to.deep.equal(FILTERS);
    expect(emitted, "emits server list").to.not.be.null;
    expect(emitted![0].name).to.equal("My view");
  });

  it("deletes a view by id and emits the trimmed list", async () => {
    const sent: unknown[] = [];
    const el = await mount(sent);
    let emitted: SavedView[] | null = null;
    el.addEventListener("saved-views-changed", (e) => {
      emitted = (e as CustomEvent<{ views: SavedView[] }>).detail.views;
    });

    const delBtn = el.shadowRoot!.querySelector<HTMLElement>(".row ha-icon-button")!;
    delBtn.click();
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));

    const delMsg = (sent as Record<string, unknown>[]).find(
      (m) => m.type === "maintenance_supporter/views/delete",
    )!;
    expect(delMsg.view_id).to.equal("v1");
    expect(emitted).to.deep.equal([]);
  });
});
