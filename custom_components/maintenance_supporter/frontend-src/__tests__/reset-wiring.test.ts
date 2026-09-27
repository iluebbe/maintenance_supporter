/**
 * Completing a task also resets the integration's own counter (2.95).
 *
 * Pins: a suggested task names the reset button it will press (and that the
 * button gets switched on), existing tasks are offered in their own section
 * with a before/after line, only ticked offers are wired, the panel hears
 * about it, and the task dialog keeps the "not when the task completes
 * itself" flag of a completion action.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/suggested-setups-dialog.js";
import "../components/task-dialog.js";
import type { MaintenanceSuggestedSetupsDialog } from "../components/suggested-setups-dialog";
import type { MaintenanceTaskDialog } from "../components/task-dialog";
import { type SentMessage, createMockHass } from "./_test-utils.js";

const VACUUM = {
  device_id: "dev_s8", device_name: "Roborock S8", area_name: "Hall",
  integration: "roborock", integration_name: "Roborock",
  suggested_entry_id: null, suggested_object_name: "Roborock S8",
  candidate: null, target_entry_id: null, target_task_count: 0,
  tasks: [
    {
      task_name: "Replace Main Brush", task_name_localized: "Replace Main Brush",
      entity_ids: ["sensor.s8_main_brush_time_left"], threshold: 10, direction: "duration_left",
      covered_by: null,
      reset: { entity_id: "button.s8_reset_main_brush", name: "Reset main brush consumable", disabled: true },
    },
    {
      task_name: "Replace Filter", task_name_localized: "Replace Filter",
      entity_ids: ["sensor.s8_filter_time_left"], threshold: 10, direction: "duration_left",
      covered_by: null, reset: null,
    },
  ],
  already: [],
};

const OFFERS = [
  {
    entry_id: "obj_q7", object_name: "Q7", task_id: "t_brush", task_name: "Replace Main Brush",
    integration_name: "Roborock", button_entity_id: "button.q7_reset_main_brush",
    button_name: "Reset main brush consumable", button_disabled: false,
  },
  {
    entry_id: "obj_mower", object_name: "Mower", task_id: "t_blades", task_name: "Replace Blades",
    integration_name: "Husqvarna Automower", button_entity_id: "button.mower_reset_blades",
    button_name: "Reset cutting blade usage time", button_disabled: true,
  },
];

async function mountSetups() {
  let offers = OFFERS;
  const { hass, sent } = createMockHass({
    handlers: {
      "maintenance_supporter/integration_setups/discover": () => ({ setups: [VACUUM] }),
      "maintenance_supporter/objects": () => ({ objects: [] }),
      "maintenance_supporter/integration_setups/reset_offers": () => ({ offers }),
      "maintenance_supporter/integration_setups/wire_resets": (msg) => {
        const items = (msg as unknown as { items: Array<{ task_id: string }> }).items;
        offers = offers.filter((o) => !items.some((i) => i.task_id === o.task_id));
        return { wired: items.length };
      },
    },
  });
  const el = await fixture<MaintenanceSuggestedSetupsDialog>(html`
    <maintenance-suggested-setups-dialog .hass=${hass}></maintenance-suggested-setups-dialog>
  `);
  await el.open();
  await new Promise((r) => setTimeout(r, 0));
  await el.updateComplete;
  return { el, sent: sent as SentMessage[] };
}

const text = (el: Element | null) => (el?.textContent || "").replace(/\s+/g, " ").trim();

describe("reset wiring (2.95)", () => {
  it("a suggested task names the reset it will press", async () => {
    const { el } = await mountSetups();
    const lines = [...el.shadowRoot!.querySelectorAll(".reset")].map(text);
    expect(lines).to.have.length(1);
    expect(lines[0]).to.contain("Reset main brush consumable").and.contain("switched on");
  });

  it("offers existing tasks with a before/after line, all ticked", async () => {
    const { el } = await mountSetups();
    const sr = el.shadowRoot!;
    const offers = [...sr.querySelectorAll(".offer")];
    expect(offers.map((o) => o.getAttribute("data-task"))).to.deep.equal(["t_brush", "t_blades"]);
    expect(text(offers[0].querySelector(".offer-before"))).to.contain("Roborock");
    expect(text(offers[0].querySelector(".offer-after"))).to.contain("Reset main brush consumable").and.not.contain("switched on");
    expect(text(offers[1].querySelector(".offer-after"))).to.contain("switched on");
    expect([...sr.querySelectorAll<HTMLInputElement>(".offer-check")].every((c) => c.checked)).to.equal(true);
  });

  it("wires only the ticked offers and tells the panel", async () => {
    const { el, sent } = await mountSetups();
    const sr = el.shadowRoot!;
    const heard: Array<{ wired: number }> = [];
    el.addEventListener("reset-counters-wired", (e) => heard.push((e as CustomEvent).detail));
    sr.querySelectorAll<HTMLInputElement>(".offer-check")[1].click();
    await el.updateComplete;
    sr.querySelector<HTMLElement>(".offers-actions ha-button")!.click();
    await new Promise((r) => setTimeout(r, 10));
    await el.updateComplete;
    const wire = sent.find((m) => m.type === "maintenance_supporter/integration_setups/wire_resets") as unknown as {
      items: Array<{ entry_id: string; task_id: string }>;
    };
    expect(wire.items).to.deep.equal([{ entry_id: "obj_q7", task_id: "t_brush" }]);
    expect(heard).to.deep.equal([{ wired: 1 }]);
    expect([...sr.querySelectorAll(".offer")].map((o) => o.getAttribute("data-task"))).to.deep.equal(["t_blades"]);
  });

  it("an older backend without offers shows no section", async () => {
    const { hass } = createMockHass({
      handlers: {
        "maintenance_supporter/integration_setups/discover": () => ({ setups: [VACUUM] }),
        "maintenance_supporter/objects": () => ({ objects: [] }),
      },
    });
    const el = await fixture<MaintenanceSuggestedSetupsDialog>(html`
      <maintenance-suggested-setups-dialog .hass=${hass}></maintenance-suggested-setups-dialog>
    `);
    await el.open();
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".offers")).to.equal(null);
  });
});

describe("task dialog: a completion action that skips automatic completions (2.95)", () => {
  async function mountTaskDialog() {
    const { hass, sent } = createMockHass({
      services: { button: { press: {} } },
      handlers: { "maintenance_supporter/task/update": () => ({}) },
    });
    const el = await fixture<MaintenanceTaskDialog>(html`
      <maintenance-task-dialog .hass=${hass} ?completion-actions-enabled=${true}></maintenance-task-dialog>
    `);
    await el.updateComplete;
    return { el, sent: sent as SentMessage[] };
  }

  const TASK = {
    id: "t1", name: "Replace Main Brush", type: "replacement", schedule_type: "sensor_based",
    warning_days: 7, enabled: true,
    trigger_config: { type: "threshold", entity_id: "sensor.s8_main_brush_time_left", trigger_below: 10 },
    on_complete_action: { service: "button.press", target: { entity_id: "button.s8_reset_main_brush" }, skip_auto: true },
  };

  it("keeps skip_auto through an edit", async () => {
    const { el, sent } = await mountTaskDialog();
    await el.openEdit("e", TASK as any);
    await el.updateComplete;
    const box = el.shadowRoot!.querySelector<HTMLInputElement>("label.ca-skip-auto input")!;
    expect(box.checked).to.equal(true);
    await (el as any)._save();
    const msg = sent.find((m) => m.type === "maintenance_supporter/task/update") as any;
    expect(msg.on_complete_action.skip_auto).to.equal(true);
  });

  it("unticking it drops the flag", async () => {
    const { el, sent } = await mountTaskDialog();
    await el.openEdit("e", TASK as any);
    await el.updateComplete;
    const box = el.shadowRoot!.querySelector<HTMLInputElement>("label.ca-skip-auto input")!;
    box.click();
    await el.updateComplete;
    await (el as any)._save();
    const msg = sent.find((m) => m.type === "maintenance_supporter/task/update") as any;
    expect("skip_auto" in msg.on_complete_action).to.equal(false);
  });
});

describe("task dialog: a wired reset stays visible without the completion-actions toggle (2.95)", () => {
  it("shows (only) the action section and saves an edit to it", async () => {
    const { hass, sent } = createMockHass({
      services: { button: { press: {} } },
      handlers: { "maintenance_supporter/task/update": () => ({}) },
    });
    const el = await fixture<MaintenanceTaskDialog>(html`
      <maintenance-task-dialog .hass=${hass}></maintenance-task-dialog>
    `);
    await el.openEdit("e", {
      id: "t1", name: "Replace Main Brush", type: "replacement", schedule_type: "time_based",
      interval_days: 90, warning_days: 7, enabled: true,
      on_complete_action: { service: "button.press", target: { entity_id: "button.s8_reset_main_brush" }, skip_auto: true },
    } as any);
    await el.updateComplete;
    expect(el.shadowRoot!.querySelectorAll("details.ca-section")).to.have.length(1);
    el.shadowRoot!.querySelector<HTMLInputElement>("label.ca-skip-auto input")!.click();
    await el.updateComplete;
    await (el as any)._save();
    const msg = (sent as SentMessage[]).find((m) => m.type === "maintenance_supporter/task/update") as any;
    expect(msg.on_complete_action.service).to.equal("button.press");
    expect("skip_auto" in msg.on_complete_action).to.equal(false);
    expect("quick_complete_defaults" in msg).to.equal(false);

    // the next task without an action: no section, no leftover flag
    await el.openEdit("e", { id: "t2", name: "Other", type: "custom", schedule_type: "time_based", interval_days: 30, warning_days: 7, enabled: true } as any);
    await el.updateComplete;
    expect(el.shadowRoot!.querySelectorAll("details.ca-section")).to.have.length(0);
    expect((el as any)._actionSkipAuto).to.equal(false);
  });
});

describe("reset offers: a task renamed since it was set up (2.95 fingerprint)", () => {
  it("is offered unticked with a hint", async () => {
    const renamed = { ...OFFERS[0], task_id: "t_old", task_name: "Saugi: Bürste tauschen", renamed: true };
    const { hass } = createMockHass({
      handlers: {
        "maintenance_supporter/integration_setups/discover": () => ({ setups: [] }),
        "maintenance_supporter/objects": () => ({ objects: [] }),
        "maintenance_supporter/integration_setups/reset_offers": () => ({ offers: [OFFERS[1], renamed] }),
      },
    });
    const el = await fixture<MaintenanceSuggestedSetupsDialog>(html`
      <maintenance-suggested-setups-dialog .hass=${hass}></maintenance-suggested-setups-dialog>
    `);
    await el.open();
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    const sr = el.shadowRoot!;
    const offers = [...sr.querySelectorAll(".offer")];
    const checks = [...sr.querySelectorAll<HTMLInputElement>(".offer-check")].map((c) => c.checked);
    expect(checks).to.deep.equal([true, false]);
    expect(offers[0].querySelector(".offer-renamed")).to.equal(null);
    expect(text(offers[1].querySelector(".offer-renamed"))).to.contain("Renamed");
  });
});
