/**
 * The task dialog edits one target entity, but the API and imports accept
 * several entities, devices, areas, labels and floors. Rebuilding the target
 * from the field dropped them on every save — a rename included (audit
 * 2026-09-28). An untouched field now sends the stored target back verbatim
 * and names what it keeps; picking another entity replaces it.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/task-dialog.js";
import type { MaintenanceTaskDialog } from "../components/task-dialog";
import { type SentMessage, createMockHass } from "./_test-utils.js";

const WIDE_TARGET = { entity_id: ["light.kitchen", "light.hall"], area_id: "garden", label_id: "outdoor" };

function task(target: Record<string, unknown>) {
  return {
    id: "t1", name: "Clean the pond filter", type: "cleaning", schedule_type: "time_based",
    interval_days: 30, warning_days: 7, enabled: true,
    on_complete_action: { service: "light.turn_on", target },
  };
}

async function mount() {
  const { hass, sent } = createMockHass({
    services: { light: { turn_on: {} } },
    states: { "light.kitchen": { entity_id: "light.kitchen", state: "off", attributes: { friendly_name: "Kitchen light" } } },
    handlers: { "maintenance_supporter/task/update": () => ({}) },
  });
  (hass as any).areas = { garden: { area_id: "garden", name: "Garden" } };
  const el = await fixture<MaintenanceTaskDialog>(html`
    <maintenance-task-dialog .hass=${hass} ?completion-actions-enabled=${true}></maintenance-task-dialog>
  `);
  await el.updateComplete;
  return { el, sent: sent as SentMessage[] };
}

async function savedAction(el: MaintenanceTaskDialog, sent: SentMessage[]) {
  await (el as any)._save();
  return (sent.find((m) => m.type === "maintenance_supporter/task/update") as any).on_complete_action;
}

describe("task dialog keeps a completion action's full target", () => {
  it("an edit elsewhere sends the stored target back unchanged", async () => {
    const { el, sent } = await mount();
    await el.openEdit("e", task(WIDE_TARGET) as any);
    await el.updateComplete;
    (el as any)._name = "Clean the pond filter (renamed)";
    expect((await savedAction(el, sent)).target).to.deep.equal(WIDE_TARGET);
  });

  it("names everything it keeps", async () => {
    const { el } = await mount();
    await el.openEdit("e", task(WIDE_TARGET) as any);
    await el.updateComplete;
    const hint = el.shadowRoot!.querySelector(".ca-target-more")!.textContent!;
    expect(hint).to.contain("Kitchen light, light.hall, Garden, outdoor");
  });

  it("picking another entity replaces the whole target", async () => {
    const { el, sent } = await mount();
    await el.openEdit("e", task(WIDE_TARGET) as any);
    await el.updateComplete;
    (el as any)._actionTargetEntity = "light.porch";
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".ca-target-more")).to.equal(null);
    expect((await savedAction(el, sent)).target).to.deep.equal({ entity_id: "light.porch" });
  });

  it("a plain one-entity target shows no hint and round-trips as it was", async () => {
    const { el, sent } = await mount();
    await el.openEdit("e", task({ entity_id: ["light.kitchen"] }) as any);
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".ca-target-more")).to.equal(null);
    expect((await savedAction(el, sent)).target).to.deep.equal({ entity_id: ["light.kitchen"] });
  });
});
