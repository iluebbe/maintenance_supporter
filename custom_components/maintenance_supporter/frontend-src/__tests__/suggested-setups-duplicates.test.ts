/**
 * <maintenance-suggested-setups-dialog> without duplicates (2.94).
 *
 * Reported from a real home: the washer and the dryer were adopted as NEW
 * objects next to the user's own. Pins: the found object is the default
 * target and says why, a task it probably already has starts unticked with
 * that task's name, tasks it has by name are listed as already there, the
 * before/after line counts the ticked tasks, only ticked tasks are adopted,
 * and picking "new object" asks the server again and updates the line.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/suggested-setups-dialog.js";
import type { MaintenanceSuggestedSetupsDialog } from "../components/suggested-setups-dialog";
import { type SentMessage, createMockHass } from "./_test-utils.js";

const DRYER = {
  device_id: "dev_dryer", device_name: "Dryer T 8861", area_name: "Laundry",
  integration: "ha_washdata", integration_name: "WashData",
  suggested_entry_id: null, suggested_object_name: "Dryer T 8861",
  candidate: { entry_id: "obj_dryer", name: "Dryer", reasons: ["model", "name"] },
  target_entry_id: "obj_dryer", target_task_count: 3,
  tasks: [
    {
      task_name: "Filter Cleaning", task_name_localized: "Filter Cleaning", entity_ids: ["sensor.dryer_cycles"],
      threshold: 50, direction: "usage_delta",
      covered_by: { task_id: "t1", name: "Clean lint filter", reason: "similar_name" },
    },
    {
      task_name: "Clean Tub", task_name_localized: "Clean Tub", entity_ids: ["sensor.dryer_cycles"],
      threshold: 100, direction: "usage_delta", covered_by: null,
    },
  ],
  already: [{ task_name: "Descaling", task_name_localized: "Descaling", existing_name: "Descaling" }],
};

async function mountOpen() {
  const previews: unknown[] = [];
  const { hass, sent } = createMockHass({
    handlers: {
      "maintenance_supporter/integration_setups/discover": () => ({ setups: [DRYER] }),
      "maintenance_supporter/objects": () => ({ objects: [{ entry_id: "obj_dryer", object: { name: "Dryer" } }] }),
      "maintenance_supporter/integration_setups/preview": (msg) => {
        previews.push(msg);
        return {
          ...DRYER, target_entry_id: null, target_task_count: 0, already: [],
          tasks: DRYER.tasks.map((task) => ({ ...task, covered_by: null })),
        };
      },
      "maintenance_supporter/integration_setups/adopt": () => ({ tasks_created: 1, objects_created: 0, total: 1 }),
    },
  });
  const el = await fixture<MaintenanceSuggestedSetupsDialog>(html`
    <maintenance-suggested-setups-dialog .hass=${hass}></maintenance-suggested-setups-dialog>
  `);
  await el.open();
  await el.updateComplete;
  return { el, sent: sent as SentMessage[], previews };
}

const text = (el: Element | null) => (el?.textContent || "").replace(/\s+/g, " ").trim();

describe("suggested-setups dialog: no duplicates (2.94)", () => {
  it("defaults to the found object, leaves the likely duplicate unticked and says what happens", async () => {
    const { el } = await mountOpen();
    const sr = el.shadowRoot!;
    const select = sr.querySelector<HTMLSelectElement>(".target-select")!;
    expect(select.value).to.equal("obj_dryer");
    expect(text(select.selectedOptions[0])).to.contain("Dryer").and.contain("model number").and.contain("name");
    const ticks = [...sr.querySelectorAll<HTMLInputElement>(".task-check")].map((c) => c.checked);
    expect(ticks).to.deep.equal([false, true]);
    expect(text(sr.querySelector(".maybe"))).to.contain("Clean lint filter");
    expect(text(sr.querySelector(".already"))).to.contain("Descaling");
    expect(text(sr.querySelector(".before-after"))).to.contain("3 → 4");
  });

  it("adopts only the ticked tasks into the found object", async () => {
    const { el, sent } = await mountOpen();
    el.shadowRoot!.querySelectorAll<HTMLElement>("ha-button")[1].click();
    await new Promise((r) => setTimeout(r, 0));
    const adopt = sent.find((m) => m.type === "maintenance_supporter/integration_setups/adopt") as unknown as {
      selections: Array<{ device_id: string; entry_id?: string; task_names: string[] }>;
    };
    expect(adopt.selections).to.have.length(1);
    expect(adopt.selections[0].entry_id).to.equal("obj_dryer");
    expect(adopt.selections[0].task_names).to.deep.equal(["Clean Tub"]);
  });

  it("ticking the likely duplicate adds it; nothing ticked disables the button", async () => {
    const { el } = await mountOpen();
    const sr = el.shadowRoot!;
    const [dup, tub] = sr.querySelectorAll<HTMLInputElement>(".task-check");
    dup.click();
    await el.updateComplete;
    expect(text(sr.querySelector(".before-after"))).to.contain("3 → 5");
    dup.click();
    tub.click();
    await el.updateComplete;
    const adoptButton = sr.querySelectorAll<HTMLElement & { disabled: boolean }>("ha-button")[1];
    expect(adoptButton.disabled).to.equal(true);
  });

  it("choosing a new object asks the server again and updates the line", async () => {
    const { el, previews } = await mountOpen();
    const sr = el.shadowRoot!;
    const select = sr.querySelector<HTMLSelectElement>(".target-select")!;
    select.value = "__new__";
    select.dispatchEvent(new Event("change", { bubbles: true }));
    await new Promise((r) => setTimeout(r, 10));
    await el.updateComplete;
    expect(previews).to.have.length(1);
    expect((previews[0] as { entry_id: unknown }).entry_id).to.equal(null);
    expect([...sr.querySelectorAll<HTMLInputElement>(".task-check")].map((c) => c.checked)).to.deep.equal([true, true]);
    expect(sr.querySelector(".already")).to.equal(null);
    expect(text(sr.querySelector(".before-after"))).to.contain("Dryer T 8861").and.contain("2");
  });
});
