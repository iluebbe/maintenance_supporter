/**
 * #188: the adopt dialog lets the user say which sensors belong together —
 * an object-name field per selected row. The same typed name on several rows
 * → one object (the backend groups within the batch); an existing object's
 * name → its entry_id is sent so the sensors join that object.
 */
import { expect, fixture, html } from "@open-wc/testing";
import "../components/adopt-problem-sensors-dialog.js";
import type { MaintenanceAdoptProblemSensorsDialog } from "../components/adopt-problem-sensors-dialog";
import { type SentMessage, createMockHass } from "./_test-utils.js";

const SENSORS = [
  { entity_id: "binary_sensor.boiler_pressure", name: "Pressure low", state: "on", device_id: "d1", device_name: "Boiler ctrl", area_name: null,
    suggested_entry_id: null, suggested_object_name: "Boiler ctrl", suggested_part_id: null, suggested_part_name: null },
  { entity_id: "binary_sensor.boiler_flame", name: "Flame fault", state: "off", device_id: "d2", device_name: "Burner", area_name: null,
    suggested_entry_id: null, suggested_object_name: "Burner", suggested_part_id: null, suggested_part_name: null },
];

async function mountOpen() {
  const { hass, sent } = createMockHass({
    handlers: {
      "maintenance_supporter/problem_sensors/discover": () => ({ sensors: SENSORS }),
      "maintenance_supporter/problem_sensors/adopt": () => ({ tasks_created: 2, objects_created: 1, total: 2 }),
      "maintenance_supporter/objects": () => ({ objects: [{ entry_id: "e9", object: { name: "Workshop" } }, { entry_id: "e8", object: { name: "Old", archived_at: "2026-01-01" } }] }),
    },
  });
  const el = await fixture<MaintenanceAdoptProblemSensorsDialog>(html`
    <maintenance-adopt-problem-sensors-dialog .hass=${hass}></maintenance-adopt-problem-sensors-dialog>
  `);
  await el.open();
  await el.updateComplete;
  return { el, sent: sent as SentMessage[] };
}

const typeName = async (el: MaintenanceAdoptProblemSensorsDialog, row: number, value: string) => {
  const input = el.shadowRoot!.querySelectorAll<HTMLInputElement>(".row .adopt-object")[row];
  input.value = value;
  input.dispatchEvent(new Event("input", { bubbles: true }));
  await el.updateComplete;
};
const adoptPayload = async (el: MaintenanceAdoptProblemSensorsDialog, sent: SentMessage[]) => {
  el.shadowRoot!.querySelectorAll<HTMLElement>("ha-button")[1].click();
  await el.updateComplete;
  await new Promise((r) => setTimeout(r, 0));
  return sent.find((m) => m.type === "maintenance_supporter/problem_sensors/adopt") as unknown as {
    selections: Array<{ entity_id: string; object_name: string; entry_id?: string }>;
  };
};

describe("adopt dialog: group sensors into one object (#188)", () => {
  it("shows an object field per selected row, pre-filled with the suggestion, plus existing names", async () => {
    const { el } = await mountOpen();
    const inputs = el.shadowRoot!.querySelectorAll<HTMLInputElement>(".row .adopt-object");
    expect(inputs.length).to.equal(2);
    expect(inputs[0].value).to.equal("Boiler ctrl");
    const options = [...el.shadowRoot!.querySelectorAll("datalist option")].map((o) => (o as HTMLOptionElement).value);
    expect(options, "archived objects are not offered").to.deep.equal(["Workshop"]);
  });

  it("the same typed name on both rows is sent as one object_name without entry_id", async () => {
    const { el, sent } = await mountOpen();
    await typeName(el, 0, "Boiler");
    await typeName(el, 1, "Boiler");
    expect(el.shadowRoot!.querySelectorAll(".row-target .new-tag").length, "both marked new").to.equal(2);
    const p = await adoptPayload(el, sent);
    expect(p.selections.map((s) => s.object_name)).to.deep.equal(["Boiler", "Boiler"]);
    expect(p.selections.every((s) => s.entry_id === undefined)).to.equal(true);
  });

  it("an existing object's name resolves to its entry_id", async () => {
    const { el, sent } = await mountOpen();
    await typeName(el, 1, "workshop");
    expect(el.shadowRoot!.querySelectorAll(".row")[1].querySelector(".row-target .new-tag"), "not new").to.equal(null);
    const p = await adoptPayload(el, sent);
    expect(p.selections[1].entry_id).to.equal("e9");
    expect(p.selections[0].entry_id).to.equal(undefined);
  });
});
