/**
 * #181: the battery fleet task has nothing to link — its quantities come from
 * Battery Notes per device. Editing it hides the parts picker and shows the
 * hint instead; an ordinary task keeps the picker.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/task-dialog.js";
import type { MaintenanceTaskDialog } from "../components/task-dialog";
import { createMockHass } from "./_test-utils.js";

const VACUUM = "entry_vacuum";
const BRUSH = { id: "part_brush", name: "Side brush", unit: "pcs", stock: 2 };
const BASE_TASK = {
  id: "t1",
  name: "Service",
  type: "custom",
  schedule_type: "time_based",
  interval_days: 30,
  warning_days: 7,
  enabled: true,
};

async function mountTaskDialog() {
  const { hass } = createMockHass({
    handlers: {
      "maintenance_supporter/object": () => ({ parts: [BRUSH] }),
      "maintenance_supporter/objects": () => ({ objects: [{ entry_id: VACUUM, object: { name: "Vacuum" }, parts: [BRUSH] }] }),
    },
  });
  const el = await fixture<MaintenanceTaskDialog>(html`
    <maintenance-task-dialog .hass=${hass}></maintenance-task-dialog>
  `);
  await el.updateComplete;
  return el;
}

const settle = async (el: MaintenanceTaskDialog) => {
  await el.updateComplete;
  await new Promise((r) => setTimeout(r, 20));
  await el.updateComplete;
};

describe("task-dialog: battery fleet task parts (#181)", () => {
  it("hides the picker and shows the hint for the fleet task", async () => {
    const el = await mountTaskDialog();
    await el.openEdit(VACUUM, { ...BASE_TASK, battery_fleet_task: true } as any);
    await settle(el);
    expect(el.shadowRoot!.querySelector(".parts-fleet-hint"), "hint rendered").to.exist;
    expect(el.shadowRoot!.querySelector(".consumes-row"), "no picker rows").to.equal(null);
  });

  it("keeps the picker for an ordinary task, also after a fleet task was edited", async () => {
    const el = await mountTaskDialog();
    await el.openEdit(VACUUM, { ...BASE_TASK, battery_fleet_task: true } as any);
    await settle(el);
    await el.openEdit(VACUUM, { ...BASE_TASK } as any);
    await settle(el);
    expect(el.shadowRoot!.querySelector(".parts-fleet-hint")).to.equal(null);
    expect(el.shadowRoot!.querySelector(".consumes-row"), "picker back").to.exist;
    await el.openCreate(VACUUM);
    await settle(el);
    expect(el.shadowRoot!.querySelector(".parts-fleet-hint"), "create never shows the hint").to.equal(null);
  });
});
