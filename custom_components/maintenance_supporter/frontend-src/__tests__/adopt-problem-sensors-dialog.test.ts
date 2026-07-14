/**
 * <maintenance-adopt-problem-sensors-dialog>: the suggested-spare-part link.
 *
 * Pins: a candidate carrying suggested_part_id/name renders the part chip, and
 * the adopt payload forwards part_id for exactly those candidates.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/adopt-problem-sensors-dialog.js";
import type { MaintenanceAdoptProblemSensorsDialog } from "../components/adopt-problem-sensors-dialog";
import { type SentMessage, createMockHass } from "./_test-utils.js";

const SENSORS = [
  {
    entity_id: "binary_sensor.toner_low", name: "Toner low", state: "on",
    device_id: "d1", device_name: "Printer", area_name: "Office",
    suggested_entry_id: "e1", suggested_object_name: "Printer",
    suggested_part_id: "part_toner", suggested_part_name: "Toner cartridge",
  },
  {
    entity_id: "binary_sensor.pump_problem", name: "Pump problem", state: "off",
    device_id: "d2", device_name: "Pump", area_name: null,
    suggested_entry_id: null, suggested_object_name: "Pump",
    suggested_part_id: null, suggested_part_name: null,
  },
];

async function mountOpen(): Promise<{ el: MaintenanceAdoptProblemSensorsDialog; sent: SentMessage[] }> {
  const { hass, sent } = createMockHass({
    handlers: {
      "maintenance_supporter/problem_sensors/discover": () => ({ sensors: SENSORS }),
      "maintenance_supporter/problem_sensors/adopt": () => ({ tasks_created: 2, objects_created: 1, total: 2 }),
    },
  });
  const el = await fixture<MaintenanceAdoptProblemSensorsDialog>(html`
    <maintenance-adopt-problem-sensors-dialog .hass=${hass}></maintenance-adopt-problem-sensors-dialog>
  `);
  await el.open();
  await el.updateComplete;
  return { el, sent };
}

describe("adopt-problem-sensors dialog: suggested part", () => {
  it("renders the part chip only for candidates with a suggested part", async () => {
    const { el } = await mountOpen();
    const rows = el.shadowRoot!.querySelectorAll(".row");
    expect(rows.length).to.equal(2);
    expect(rows[0].querySelector(".row-part")?.textContent).to.include("Toner cartridge");
    expect(rows[1].querySelector(".row-part")).to.equal(null);
  });

  it("forwards part_id in the adopt payload for the matched candidate only", async () => {
    const { el, sent } = await mountOpen();
    el.shadowRoot!.querySelectorAll<HTMLElement>("ha-button")[1].click(); // Adopt selected
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    const adopt = sent.find((m) => m.type === "maintenance_supporter/problem_sensors/adopt")! as {
      selections: Array<{ entity_id: string; part_id?: string }>;
    };
    const byId = Object.fromEntries(adopt.selections.map((s) => [s.entity_id, s]));
    expect(byId["binary_sensor.toner_low"].part_id).to.equal("part_toner");
    expect(byId["binary_sensor.pump_problem"].part_id).to.equal(undefined);
  });
});
