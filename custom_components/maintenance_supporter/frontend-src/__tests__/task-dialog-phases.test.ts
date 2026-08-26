/**
 * <maintenance-task-dialog>: phases editor roundtrip (#139).
 *
 * Pins:
 *   - openEdit hydrates the defs + sequence from the task
 *   - _save re-emits phases + phase_sequence (name/checklist/one part link)
 *   - sequence steps whose def was removed are dropped from the save
 *   - a task without phases saves phases: null / phase_sequence: null
 *     (always sent — null is what clears them server-side)
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/task-dialog.js";
import type { MaintenanceTaskDialog } from "../components/task-dialog";
import { createMockHass } from "./_test-utils.js";

const PHASES = {
  swap: { name: "Swap disks" },
  flip: { name: "Flip blades", checklist: ["Loosen", "Flip"], consumes_parts: [{ part_id: "p_1", quantity: 2 }] },
};
const SEQUENCE = ["swap", "flip", "swap"];

async function openAndSave(taskOver: Record<string, unknown>, mutate?: (el: MaintenanceTaskDialog) => void) {
  const { hass, sent } = createMockHass({
    handlers: { "maintenance_supporter/task/update": () => ({ success: true }) },
  });
  const el = await fixture<MaintenanceTaskDialog>(html`
    <maintenance-task-dialog .hass=${hass}></maintenance-task-dialog>
  `);
  await el.updateComplete;
  await el.openEdit("entry_x", {
    id: "t1",
    name: "Mower blades",
    type: "custom",
    schedule_type: "time_based",
    interval_days: 30,
    warning_days: 7,
    enabled: true,
    ...taskOver,
  } as any);
  await el.updateComplete;
  if (mutate) {
    mutate(el);
    await el.updateComplete;
  }
  await (el as any)._save();
  const update = sent.find((m) => m.type === "maintenance_supporter/task/update") as any;
  expect(update, "update message sent").to.exist;
  return { el, update };
}

describe("task-dialog phases editor (#139)", () => {
  it("hydrates defs + sequence and re-emits them on save", async () => {
    const { el, update } = await openAndSave({ phases: PHASES, phase_sequence: SEQUENCE });
    expect((el as any)._phaseDefs.map((d: any) => d.id)).to.deep.equal(["swap", "flip"]);
    expect((el as any)._phaseSeq).to.deep.equal(SEQUENCE);
    expect(update.phases).to.deep.equal({
      swap: { name: "Swap disks" },
      flip: { name: "Flip blades", checklist: ["Loosen", "Flip"], consumes_parts: [{ part_id: "p_1", quantity: 2 }] },
    });
    expect(update.phase_sequence).to.deep.equal(SEQUENCE);
  });

  it("drops sequence steps whose def was removed", async () => {
    const { update } = await openAndSave(
      { phases: PHASES, phase_sequence: SEQUENCE },
      (el) => {
        (el as any)._removePhaseDef("flip");
      },
    );
    expect(update.phases).to.deep.equal({ swap: { name: "Swap disks" } });
    expect(update.phase_sequence).to.deep.equal(["swap", "swap"]);
  });

  it("sends null for both fields on a phase-less task (server-side clear)", async () => {
    const { update } = await openAndSave({});
    expect(update.phases).to.equal(null);
    expect(update.phase_sequence).to.equal(null);
  });

  it("renders the phases section with the editor rows", async () => {
    const { hass } = createMockHass({});
    const el = await fixture<MaintenanceTaskDialog>(html`
      <maintenance-task-dialog .hass=${hass}></maintenance-task-dialog>
    `);
    await el.updateComplete;
    await el.openEdit("entry_x", {
      id: "t1",
      name: "Mower blades",
      type: "custom",
      schedule_type: "time_based",
      interval_days: 30,
      warning_days: 7,
      enabled: true,
      phases: PHASES,
      phase_sequence: SEQUENCE,
    } as any);
    await el.updateComplete;
    const defs = el.shadowRoot!.querySelectorAll(".phase-def");
    expect(defs.length).to.equal(2);
    const chips = el.shadowRoot!.querySelectorAll(".phase-chip");
    expect(chips.length).to.equal(3);
  });
});
