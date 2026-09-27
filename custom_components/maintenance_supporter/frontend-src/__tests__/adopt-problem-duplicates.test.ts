/**
 * <maintenance-adopt-problem-sensors-dialog> without duplicates (2.94).
 *
 * Pins: a sensor whose device no object is linked to goes to the object the
 * device most likely is (with the reasons), a sensor that object probably
 * already watches starts unticked with that task's name, the summary counts
 * tasks before → after per object (and new objects), and typing another
 * object asks the server again for the hints.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/adopt-problem-sensors-dialog.js";
import type { MaintenanceAdoptProblemSensorsDialog } from "../components/adopt-problem-sensors-dialog";
import { type SentMessage, createMockHass } from "./_test-utils.js";

const SENSORS = [
  {
    entity_id: "binary_sensor.dryer_filter", name: "Dryer filter clogged", state: "off",
    device_id: "dev_dryer", device_name: "Dryer T 8861", area_name: "Laundry",
    suggested_entry_id: null, suggested_object_name: "Dryer T 8861",
    suggested_part_id: null, suggested_part_name: null,
    candidate: { entry_id: "obj_dryer", name: "Dryer", reasons: ["model", "name"] },
    target_entry_id: "obj_dryer",
    covered_by: { task_id: "t1", name: "Check clogged filter", reason: "similar_name" },
  },
  {
    entity_id: "binary_sensor.dryer_door", name: "Dryer door open", state: "on",
    device_id: "dev_dryer", device_name: "Dryer T 8861", area_name: "Laundry",
    suggested_entry_id: null, suggested_object_name: "Dryer T 8861",
    suggested_part_id: null, suggested_part_name: null,
    candidate: { entry_id: "obj_dryer", name: "Dryer", reasons: ["model", "name"] },
    target_entry_id: "obj_dryer",
    covered_by: null,
  },
];

async function mountOpen() {
  const previews: SentMessage[] = [];
  const { hass, sent } = createMockHass({
    handlers: {
      "maintenance_supporter/problem_sensors/discover": () => ({ sensors: SENSORS }),
      "maintenance_supporter/objects": () => ({
        objects: [{ entry_id: "obj_dryer", object: { name: "Dryer" }, tasks: [{}, {}, {}] }],
      }),
      "maintenance_supporter/problem_sensors/preview": (msg) => {
        previews.push(msg);
        return { covered: { "binary_sensor.dryer_filter": null, "binary_sensor.dryer_door": null } };
      },
      "maintenance_supporter/problem_sensors/adopt": () => ({ tasks_created: 1, objects_created: 0, created: [], total: 1 }),
    },
  });
  const el = await fixture<MaintenanceAdoptProblemSensorsDialog>(html`
    <maintenance-adopt-problem-sensors-dialog .hass=${hass}></maintenance-adopt-problem-sensors-dialog>
  `);
  await el.open();
  await el.updateComplete;
  return { el, sent: sent as SentMessage[], previews };
}

const text = (el: Element | null) => (el?.textContent || "").replace(/\s+/g, " ").trim();

describe("adopt problem sensors: no duplicates (2.94)", () => {
  it("goes to the found object, leaves the likely duplicate unticked and summarises", async () => {
    const { el } = await mountOpen();
    const sr = el.shadowRoot!;
    const rows = [...sr.querySelectorAll<HTMLElement>(".row")];
    expect(rows.map((r) => r.querySelector<HTMLInputElement>("input[type=checkbox]")!.checked)).to.deep.equal([false, true]);
    expect(text(rows[0].querySelector(".maybe"))).to.contain("Check clogged filter");
    expect(text(rows[1].querySelector(".row-target"))).to.contain("Dryer").and.contain("model number");
    expect(text(sr.querySelector(".summary"))).to.contain('"Dryer": tasks 3 → 4');
  });

  it("adopts into the found object's entry", async () => {
    const { el, sent } = await mountOpen();
    el.shadowRoot!.querySelectorAll<HTMLElement>("ha-button")[1].click();
    await new Promise((r) => setTimeout(r, 0));
    const adopt = sent.find((m) => m.type === "maintenance_supporter/problem_sensors/adopt") as unknown as {
      selections: Array<{ entity_id: string; entry_id?: string; device_id?: string }>;
    };
    expect(adopt.selections).to.deep.equal([
      {
        entity_id: "binary_sensor.dryer_door", name: "Dryer door open", entry_id: "obj_dryer", object_name: "Dryer",
        device_id: "dev_dryer", part_id: undefined, responsible_user_id: undefined, for_minutes: undefined,
      },
    ]);
  });

  it("typing another object asks the server again and the summary follows", async () => {
    const { el, previews } = await mountOpen();
    const sr = el.shadowRoot!;
    const input = sr.querySelectorAll<HTMLInputElement>(".adopt-object")[0];
    input.value = "Laundry machines";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await new Promise((r) => setTimeout(r, 450));
    await el.updateComplete;
    expect(previews).to.have.length(1);
    expect(sr.querySelector(".maybe")).to.equal(null);
    expect(text(sr.querySelector(".summary"))).to.contain('New object "Laundry machines"');
  });
});
