/**
 * <maintenance-suggested-setups-dialog>: the optional counting start value
 * (#102 — "the last service was at reading X").
 *
 * Pins: usage_delta duties on a selected row render the baseline input
 * (other directions don't), an entered value is forwarded per task in the
 * adopt payload, and empty/invalid values are omitted.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/suggested-setups-dialog.js";
import type { MaintenanceSuggestedSetupsDialog } from "../components/suggested-setups-dialog";
import { type SentMessage, createMockHass } from "./_test-utils.js";

const SETUPS = [
  {
    device_id: "car1", device_name: "Kia EV6", area_name: "Garage",
    integration: "kia_uvo", integration_name: "Kia Uvo",
    suggested_entry_id: null, suggested_object_name: "Kia EV6",
    tasks: [
      {
        task_name: "Annual Service", entity_ids: ["sensor.kia_odometer"],
        threshold: 15000, direction: "usage_delta",
      },
      {
        task_name: "Tire Rotation", entity_ids: ["sensor.kia_odometer"],
        threshold: 10000, direction: "usage_delta",
      },
    ],
  },
  {
    device_id: "vac1", device_name: "Roborock", area_name: null,
    integration: "roborock", integration_name: "Roborock",
    suggested_entry_id: null, suggested_object_name: "Roborock",
    tasks: [
      {
        task_name: "Replace Filter", entity_ids: ["sensor.vac_filter"],
        threshold: 24, direction: "duration_left",
      },
    ],
  },
];

async function mountOpen(): Promise<{ el: MaintenanceSuggestedSetupsDialog; sent: SentMessage[] }> {
  const { hass, sent } = createMockHass({
    handlers: {
      "maintenance_supporter/integration_setups/discover": () => ({ setups: SETUPS }),
      "maintenance_supporter/objects": () => ({
        objects: [{ entry_id: "obj_existing", object: { name: "My Vacuum" } }],
      }),
      "maintenance_supporter/integration_setups/adopt": () => ({
        tasks_created: 3, objects_created: 2, total: 2,
      }),
    },
  });
  const el = await fixture<MaintenanceSuggestedSetupsDialog>(html`
    <maintenance-suggested-setups-dialog .hass=${hass}></maintenance-suggested-setups-dialog>
  `);
  await el.open();
  await el.updateComplete;
  return { el, sent };
}

describe("suggested-setups dialog: counting start value (#102)", () => {
  it("renders baseline inputs for usage_delta duties only", async () => {
    const { el } = await mountOpen();
    const rows = el.shadowRoot!.querySelectorAll(".row");
    expect(rows.length).to.equal(2);
    expect(rows[0].querySelectorAll(".baseline-field").length).to.equal(2); // both car duties
    expect(rows[1].querySelectorAll(".baseline-field").length).to.equal(0); // duration_left
  });

  it("target picker: choosing an existing object forwards its entry_id (#105)", async () => {
    const { el, sent } = await mountOpen();
    const selects = el.shadowRoot!.querySelectorAll<HTMLSelectElement>(".target-select");
    expect(selects.length).to.equal(2); // one per selected row
    // First row (car1): pick the existing object instead of "create new".
    selects[0].value = "obj_existing";
    selects[0].dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;

    el.shadowRoot!.querySelectorAll<HTMLElement>("ha-button")[1].click();
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));

    const adopt = sent.find((m) => m.type === "maintenance_supporter/integration_setups/adopt")! as {
      selections: Array<{ device_id: string; entry_id?: string }>;
    };
    const byId = Object.fromEntries(adopt.selections.map((s) => [s.device_id, s]));
    expect(byId["car1"].entry_id).to.equal("obj_existing");
    expect(byId["vac1"].entry_id).to.equal(undefined); // untouched row keeps default
  });

  it("forwards entered start values per task and omits empty ones", async () => {
    const { el, sent } = await mountOpen();
    const input = el.shadowRoot!.querySelector<HTMLInputElement>(".baseline-field input")!;
    input.value = "12000";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await el.updateComplete;

    el.shadowRoot!.querySelectorAll<HTMLElement>("ha-button")[1].click(); // Set up selected
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));

    const adopt = sent.find((m) => m.type === "maintenance_supporter/integration_setups/adopt")! as {
      selections: Array<{ device_id: string; baselines?: Record<string, number> }>;
    };
    const byId = Object.fromEntries(adopt.selections.map((s) => [s.device_id, s]));
    expect(byId["car1"].baselines).to.deep.equal({ "Annual Service": 12000 });
    expect(byId["vac1"].baselines).to.equal(undefined);
  });
});
