/** The task editor reads the parts from the opener's object list (perf
 *  2026-11-02): every opening waited on two requests, one object with its
 *  whole history and the whole list (764 KB in a home with 160 tasks), for
 *  the parts the panel's own list already holds. Without a list, or without
 *  the object in it, the editor fetches as before. */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/task-dialog.js";
import type { MaintenanceTaskDialog } from "../components/task-dialog";
import { createMockHass, type SentMessage } from "./_test-utils.js";
import { mountPanel, obj, resetTaskSeq, sr, task } from "./_panel-utils.js";

const TASK = { id: "t1", name: "Filter", type: "custom", schedule_type: "time_based", interval_days: 30, warning_days: 7, enabled: true };

const LIST = [
  { entry_id: "e1", object: { name: "Boiler" }, parts: [{ id: "p1", name: "Burner nozzle" }] },
  { entry_id: "e3", object: { name: "Pool" }, parts: [] },
  { entry_id: "e2", object: { name: "Car" }, parts: [{ id: "p9", name: "Wiper", unit: "pcs" }] },
];

const FETCHED = {
  "maintenance_supporter/object": () => ({ parts: [{ id: "p1", name: "Burner nozzle" }] }),
  "maintenance_supporter/objects": () => ({ objects: LIST }),
};

type Priv = { parts: Array<{ id: string }>; _foreignOwners: Array<{ entry_id: string; name: string; parts: Array<{ id: string }> }> };

async function dialog(objects?: unknown[]) {
  const { hass, sent } = createMockHass({ handlers: FETCHED });
  const el = await fixture<MaintenanceTaskDialog>(html`<maintenance-task-dialog .hass=${hass} .objects=${objects}></maintenance-task-dialog>`);
  return { el, sent, priv: el as unknown as Priv };
}

const partRequests = (sent: SentMessage[]) =>
  sent.map((m) => m.type).filter((t) => t === "maintenance_supporter/object" || t === "maintenance_supporter/objects");

describe("perf 2026-11-02: the task editor reads the opener's object list", () => {
  it("editing asks for neither the object nor the whole list, and has the same parts", async () => {
    const { el, sent, priv } = await dialog(LIST);
    await el.openEdit("e1", TASK as never);
    expect(partRequests(sent), "no request").to.deep.equal([]);
    expect(priv.parts.map((p) => p.id), "the object's own parts").to.deep.equal(["p1"]);
    expect(priv._foreignOwners.map((o) => [o.entry_id, o.name, o.parts.map((p) => p.id)]), "the other objects' pools")
      .to.deep.equal([["e2", "Car", ["p9"]]]);
  });

  it("creating too, for the object picked in the list", async () => {
    const { el, sent, priv } = await dialog(LIST);
    await el.openCreate("e2");
    expect(partRequests(sent)).to.deep.equal([]);
    expect(priv.parts.map((p) => p.id)).to.deep.equal(["p9"]);
    expect(priv._foreignOwners.map((o) => o.entry_id)).to.deep.equal(["e1"]);
  });

  it("an object the list does not hold yet (just created): fetched as before", async () => {
    const { el, sent, priv } = await dialog([LIST[2]]);
    await el.openEdit("e1", TASK as never);
    expect(partRequests(sent).sort()).to.deep.equal(["maintenance_supporter/object", "maintenance_supporter/objects"]);
    expect(priv.parts.map((p) => p.id)).to.deep.equal(["p1"]);
    expect(priv._foreignOwners.map((o) => o.entry_id)).to.deep.equal(["e2"]);
  });

  it("without a list (the card): fetched as before", async () => {
    const { el, sent, priv } = await dialog();
    await el.openEdit("e1", TASK as never);
    expect(partRequests(sent).sort()).to.deep.equal(["maintenance_supporter/object", "maintenance_supporter/objects"]);
    expect(priv.parts.map((p) => p.id)).to.deep.equal(["p1"]);
  });

  it("the panel hands its live list to its editor", async () => {
    resetTaskSeq();
    const r = await mountPanel([obj("e1", [task({ name: "Filter" })])]);
    const el = r.el as HTMLElement & { _objects: unknown[]; _ensureLazyUi: () => Promise<unknown>; updateComplete: Promise<unknown> };
    await el._ensureLazyUi();
    const dlg = sr(el).querySelector("maintenance-task-dialog") as MaintenanceTaskDialog;
    expect(dlg.objects === el._objects, "the same list").to.equal(true);
    const before = r.sent.length;
    await dlg.openEdit("e1", el._objects.length ? (el._objects[0] as { tasks: never[] }).tasks[0] : (TASK as never));
    expect(partRequests(r.sent.slice(before)), "no request from the panel's editor").to.deep.equal([]);
  });
});
