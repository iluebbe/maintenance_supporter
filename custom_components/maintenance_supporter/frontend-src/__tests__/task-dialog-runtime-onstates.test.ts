/**
 * <maintenance-task-dialog>: runtime trigger_on_states in the UI (#103).
 *
 * Pins: the field is rendered for runtime triggers, an adopted task's
 * on_states (e.g. ["mowing"]) hydrate into it and SURVIVE a save roundtrip
 * (before this fix the dialog rebuilt trigger_config without
 * trigger_on_states — any edit silently reset a mower task to ["on"] and
 * stopped the accumulation), and an empty field omits the key (backend
 * default ["on"]).
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/task-dialog.js";
import type { MaintenanceTaskDialog } from "../components/task-dialog";
import { type SentMessage, createMockHass } from "./_test-utils.js";

async function mountDialog(): Promise<{ el: MaintenanceTaskDialog; sent: SentMessage[] }> {
  const { hass, sent } = createMockHass({
    states: { "lawn_mower.navi": { state: "mowing" } },
    handlers: { "maintenance_supporter/task/update": () => ({ success: true }) },
  });
  const el = await fixture<MaintenanceTaskDialog>(html`
    <maintenance-task-dialog .hass=${hass}></maintenance-task-dialog>
  `);
  await el.updateComplete;
  return { el, sent };
}

const MOWER_TASK = {
  id: "t1",
  name: "Replace Blades",
  type: "replacement",
  schedule_type: "sensor_based",
  warning_days: 7,
  enabled: true,
  trigger_config: {
    type: "runtime",
    entity_id: "lawn_mower.navi",
    entity_ids: ["lawn_mower.navi"],
    trigger_runtime_hours: 100,
    trigger_on_states: ["mowing"],
  },
};

describe("task-dialog runtime on-states (#103)", () => {
  it("hydrates adopted on_states into the field", async () => {
    const { el } = await mountDialog();
    await el.openEdit("entry_x", MOWER_TASK as any);
    await el.updateComplete;
    expect((el as any)._triggerOnStates).to.equal("mowing");
  });

  it("on_states survive a save roundtrip (no silent reset to ['on'])", async () => {
    const { el, sent } = await mountDialog();
    await el.openEdit("entry_x", MOWER_TASK as any);
    await el.updateComplete;
    await (el as any)._save();
    const update = sent.find((m) => m.type === "maintenance_supporter/task/update")! as {
      trigger_config: { trigger_on_states?: string[] };
    };
    expect(update.trigger_config.trigger_on_states).to.deep.equal(["mowing"]);
  });

  it("an empty field omits trigger_on_states (backend default)", async () => {
    const { el, sent } = await mountDialog();
    await el.openEdit("entry_x", MOWER_TASK as any);
    await el.updateComplete;
    (el as any)._triggerOnStates = "";
    await el.updateComplete;
    await (el as any)._save();
    const update = sent.find((m) => m.type === "maintenance_supporter/task/update")! as {
      trigger_config: { trigger_on_states?: string[] };
    };
    expect(update.trigger_config.trigger_on_states).to.equal(undefined);
  });
});
