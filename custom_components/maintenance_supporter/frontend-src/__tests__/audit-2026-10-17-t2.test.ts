/**
 * Bug audit 2026-10-17, tranche 2 — the frontend findings (P-3 is pinned
 * in area-history.test.ts next to the loader's other tests). Every test
 * fails on the code before the fix.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/object-quick-actions-dialog.js";
import type { MaintenanceObjectQuickActionsDialog } from "../components/object-quick-actions-dialog";
import { createMockHass } from "./_test-utils.js";
import { mountPanel, obj, resetTaskSeq, task } from "./_panel-utils.js";

const tick = (ms = 20) => new Promise((r) => setTimeout(r, ms));

function deferred<T>() {
  let resolve!: (v: T) => void;
  const promise = new Promise<T>((r) => { resolve = r; });
  return { promise, resolve };
}

describe("P-4 object quick actions: a slow answer for a closed object", () => {
  it("never shows under the next object's id", async () => {
    const slowA = deferred<unknown>();
    const { hass } = createMockHass({
      handlers: {
        "maintenance_supporter/object": (msg) =>
          msg.entry_id === "a"
            ? slowA.promise
            : { entry_id: "b", object: { id: "ob", name: "Boiler" }, tasks: [] },
      },
    });
    (hass as Record<string, unknown>).user = { id: "admin", is_admin: true };
    const el = await fixture<MaintenanceObjectQuickActionsDialog>(html`
      <maintenance-object-quick-actions-dialog .hass=${hass}></maintenance-object-quick-actions-dialog>
    `);
    const forA = el.openFor("a");
    el.close();
    await el.openFor("b");
    slowA.resolve({ entry_id: "a", object: { id: "oa", name: "Aquarium" }, tasks: [] });
    await forA;
    await el.updateComplete;
    const state = el as unknown as { _entryId: string; _data: { object: { name: string } } | null };
    expect(state._entryId).to.equal("b");
    expect(state._data?.object.name, "A's answer landed under B").to.equal("Boiler");
  });

  it("opening another object drops the previous one's data at once", async () => {
    const slowB = deferred<unknown>();
    const { hass } = createMockHass({
      handlers: {
        "maintenance_supporter/object": (msg) =>
          msg.entry_id === "b" ? slowB.promise : { entry_id: "a", object: { id: "oa", name: "Aquarium" }, tasks: [] },
      },
    });
    (hass as Record<string, unknown>).user = { id: "admin", is_admin: true };
    const el = await fixture<MaintenanceObjectQuickActionsDialog>(html`
      <maintenance-object-quick-actions-dialog .hass=${hass}></maintenance-object-quick-actions-dialog>
    `);
    await el.openFor("a");
    const forB = el.openFor("b");
    await el.updateComplete;
    expect((el as unknown as { _data: unknown })._data, "A's data while B loads").to.equal(null);
    slowB.resolve({ entry_id: "b", object: { id: "ob", name: "Boiler" }, tasks: [] });
    await forB;
  });
});

describe("P-5 the ⋮ menu after a pick", () => {
  beforeEach(() => resetTaskSeq());

  it("opens on the next click instead of closing in the same one", async () => {
    const { el } = await mountPanel([obj("e1", [task()])]);
    const panel = el as unknown as { _toggleObjMenu(): void; _closeObjMenu(): void; _objMenuOpen: boolean };
    const click = () => document.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    panel._toggleObjMenu();
    await tick(); // the outside-click closer is armed
    panel._closeObjMenu(); // a pick: its click stops at the menu, the closer never runs
    panel._toggleObjMenu(); // the next click on ⋮ …
    click(); // … bubbles on to the document
    expect(panel._objMenuOpen, "shut by the leftover closer").to.equal(true);
    await tick();
    click(); // a click outside still closes it
    expect(panel._objMenuOpen).to.equal(false);
  });
});
