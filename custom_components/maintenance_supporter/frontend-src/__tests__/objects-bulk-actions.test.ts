/**
 * #188: the All-objects view gets a Select mode — pick many objects, then
 * delete them (with their tasks, behind a confirm) or archive them (undoable).
 * Cards toggle instead of navigating while selecting.
 */

import { expect } from "@open-wc/testing";
import { mountPanel, obj, resetTaskSeq, sr, task } from "./_panel-utils.js";

type Panel = HTMLElement & { updateComplete: Promise<unknown>; _showAllObjects: () => void; _objBulkMode: boolean; _view: string };

async function openObjects() {
  const { el, sent } = await mountPanel(
    [obj("e1", [task()], "Boiler"), obj("e2", [task()], "Car"), obj("e3", [], "Fridge")],
    {
      "maintenance_supporter/object/delete": () => ({ success: true }),
      "maintenance_supporter/object/archive": () => ({ success: true, archived_at: "2026-09-19T10:00:00+00:00" }),
      "maintenance_supporter/object/unarchive": () => ({ success: true }),
    },
  );
  const panel = el as unknown as Panel;
  panel._showAllObjects();
  await panel.updateComplete;
  return { el: panel, sent: sent as Array<Record<string, unknown>> };
}

const settle = async (el: Panel) => { await new Promise((r) => setTimeout(r, 40)); await el.updateComplete; };

describe("all-objects bulk select (#188)", () => {
  beforeEach(() => resetTaskSeq());

  it("selects cards and deletes them one by one after a confirm", async () => {
    const { el, sent } = await openObjects();
    sr(el).querySelector<HTMLElement>(".obj-bulk-toggle")!.click();
    await el.updateComplete;
    const cards = [...sr(el).querySelectorAll<HTMLElement>(".object-card")];
    expect(cards.length).to.equal(3);
    cards[0].click();
    cards[2].click();
    await el.updateComplete;
    expect(el._view, "selecting does not navigate").to.equal("all_objects");
    expect(sr(el).querySelectorAll(".object-card.bulk-selected").length).to.equal(2);
    expect(sr(el).querySelector(".obj-bulk-bar .bulk-count")!.textContent).to.contain("2");
    const dlg = sr(el).querySelector("maintenance-confirm-dialog") as unknown as { confirm: () => Promise<boolean> };
    dlg.confirm = async () => true;
    sr(el).querySelector<HTMLElement>(".obj-bulk-delete")!.click();
    await settle(el);
    const deleted = sent.filter((m) => m.type === "maintenance_supporter/object/delete").map((m) => m.entry_id);
    expect(deleted).to.deep.equal(["e1", "e3"]);
    expect(el._objBulkMode, "select mode ends after the action").to.equal(false);
  });

  it("a declined confirm deletes nothing", async () => {
    const { el, sent } = await openObjects();
    sr(el).querySelector<HTMLElement>(".obj-bulk-toggle")!.click();
    await el.updateComplete;
    sr(el).querySelector<HTMLElement>(".object-card")!.click();
    await el.updateComplete;
    const dlg = sr(el).querySelector("maintenance-confirm-dialog") as unknown as { confirm: () => Promise<boolean> };
    dlg.confirm = async () => false;
    sr(el).querySelector<HTMLElement>(".obj-bulk-delete")!.click();
    await settle(el);
    expect(sent.some((m) => m.type === "maintenance_supporter/object/delete")).to.equal(false);
    expect(el._objBulkMode, "still selecting").to.equal(true);
  });

  it("select all + archive sends object/archive for every listed object", async () => {
    const { el, sent } = await openObjects();
    sr(el).querySelector<HTMLElement>(".obj-bulk-toggle")!.click();
    await el.updateComplete;
    const all = sr(el).querySelector<HTMLInputElement>(".obj-bulk-bar .bulk-selectall input")!;
    all.click();
    await el.updateComplete;
    expect(sr(el).querySelectorAll(".object-card.bulk-selected").length).to.equal(3);
    sr(el).querySelector<HTMLElement>(".obj-bulk-archive")!.click();
    await settle(el);
    const archived = sent.filter((m) => m.type === "maintenance_supporter/object/archive").map((m) => m.entry_id);
    expect(archived).to.deep.equal(["e1", "e2", "e3"]);
  });

  it("is not offered to operators without write access", async () => {
    const { el } = await mountPanel([obj("e1", [task()], "Boiler")], {}, { user: { id: "op-1", is_admin: false } });
    const panel = el as unknown as Panel;
    panel._showAllObjects();
    await panel.updateComplete;
    expect(sr(panel).querySelector(".obj-bulk-toggle")).to.equal(null);
  });
});
