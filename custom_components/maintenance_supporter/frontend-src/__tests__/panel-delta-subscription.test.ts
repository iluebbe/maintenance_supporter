/** The panel consumes the 2.52 delta subscription end-to-end.
 *
 *  Mounts the real panel, then pushes subscription events through the
 *  captured subscribeMessage callback: a delta patches one object's rows in
 *  place, `removed` drops them, and a legacy full payload still replaces
 *  the whole list — so a stale server that never learned deltas keeps
 *  working unchanged.
 */

import { expect } from "@open-wc/testing";
import { mountPanel, obj, resetTaskSeq, sr, task } from "./_panel-utils.js";

function rowNames(el: HTMLElement): string[] {
  return [...sr(el).querySelectorAll(".task-name")].map((n) => n.textContent?.trim() || "");
}

async function settle(el: HTMLElement & { updateComplete: Promise<unknown> }) {
  await new Promise((r) => setTimeout(r, 20));
  await el.updateComplete;
}

describe("panel delta subscription", () => {
  beforeEach(() => {
    resetTaskSeq();
    localStorage.removeItem("msp-overview-tab");
  });

  it("subscribes with deltas and patches / removes / replaces correctly", async () => {
    const o1 = obj("e1", [task({ name: "Alpha Task" })], "Pump A");
    const o2 = obj("e2", [task({ name: "Beta Task" })], "Pump B");
    const { el, subscriptions } = await mountPanel([o1, o2]);

    const sub = subscriptions.find((s) => s.msg.type === "maintenance_supporter/subscribe");
    expect(sub, "panel subscribed").to.not.equal(undefined);
    expect(sub!.msg.deltas, "the panel opts into the delta protocol").to.equal(true);
    expect(rowNames(el)).to.include("Alpha Task");

    // Delta: only e1 changes — Beta must survive untouched.
    const o1changed = obj("e1", [task({ name: "Alpha Renamed" })], "Pump A");
    sub!.push({ delta: [o1changed], removed: [] });
    await settle(el);
    const names1 = rowNames(el);
    expect(names1).to.include("Alpha Renamed");
    expect(names1).to.not.include("Alpha Task");
    expect(names1).to.include("Beta Task");

    // Removal drops e2's rows.
    sub!.push({ delta: [], removed: ["e2"] });
    await settle(el);
    expect(rowNames(el)).to.not.include("Beta Task");

    // Legacy full payload replaces everything (old-server compatibility).
    sub!.push({ objects: [obj("e3", [task({ name: "Gamma Task" })], "Pump C")] });
    await settle(el);
    const names3 = rowNames(el);
    expect(names3).to.include("Gamma Task");
    expect(names3).to.not.include("Alpha Renamed");
  });
});
