/**
 * D#229 follow-up and D#250, 2026-11-06:
 *
 *   - a threshold and a date from a sensor offer the same choice as the
 *     state latch when they end by themselves: back to OK, record as done,
 *     or keep the task triggered until it is done;
 *   - a task that only its sensor completes right now (its trigger is
 *     active and records the task as done when it ends) shows "Completes
 *     itself" in the rows of the card and the panel instead of Complete and
 *     Skip; due by its safety interval, or with nothing to end, it keeps them.
 */

import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import "../components/task-dialog.js";
import "../maintenance-card.js";
import type { MaintenanceTaskDialog } from "../components/task-dialog";
import { completesItself } from "../helpers/completes-itself";
import { type SentMessage, createMockHass } from "./_test-utils.js";
import { mountPanel, obj, resetTaskSeq, sr, task } from "./_panel-utils.js";

type Dialog = HTMLElement & {
  updateComplete: Promise<unknown>;
  openEdit: MaintenanceTaskDialog["openEdit"];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [k: string]: any;
};

const settle = async (el: { updateComplete: Promise<unknown> }) => { await new Promise((r) => setTimeout(r, 30)); await el.updateComplete; };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const lastUpdate = (sent: SentMessage[]) => sent.filter((m) => m.type === "maintenance_supporter/task/update").at(-1) as Record<string, any>;
const endChoice = (el: Dialog) => [...el.shadowRoot!.querySelectorAll<HTMLInputElement>(".trigger-end input[type=radio]")];

async function mountDialog(): Promise<{ el: Dialog; sent: SentMessage[] }> {
  const { hass, sent } = createMockHass({
    handlers: {
      "maintenance_supporter/task/update": () => ({}),
      "maintenance_supporter/entity/attributes": (msg: Record<string, unknown>) => ({ entity_id: msg.entity_id, suggested_attributes: [], available_attributes: [] }),
    },
  });
  (hass as unknown as { states: Record<string, unknown> }).states = {
    "sensor.drawer": { state: "40", attributes: { friendly_name: "Waste drawer", unit_of_measurement: "%" } },
    "sensor.filter_due": { state: "2027-01-01T00:00:00+00:00", attributes: { friendly_name: "Filter due", device_class: "timestamp" } },
    "sensor.cycles": { state: "3", attributes: { friendly_name: "Cycles" } },
  };
  const el = await fixture<Dialog>(html`<maintenance-task-dialog .hass=${hass}></maintenance-task-dialog>`);
  await el.updateComplete;
  return { el, sent };
}

const sensorTask = (trigger: Record<string, unknown>) => ({
  id: "t1", name: "Empty the drawer", type: "custom", schedule_type: "sensor_based", warning_days: 7, enabled: true,
  trigger_config: { entity_ids: [trigger.entity_id], ...trigger },
});

describe("D#229 follow-up: a threshold and a date can hold until done", () => {
  it("a threshold offers the choice and saves the hold", async () => {
    const { el, sent } = await mountDialog();
    await el.openEdit("e", sensorTask({ type: "threshold", entity_id: "sensor.drawer", trigger_above: 80, auto_complete_on_recovery: true }) as never);
    await settle(el);
    expect(endChoice(el).map((r) => r.value)).to.deep.equal(["ok", "done", "hold"]);
    expect(endChoice(el).find((r) => r.checked)!.value).to.equal("done");
    expect(el.shadowRoot!.querySelector(".trigger-end .field-label")!.textContent).to.equal("When the value is back in range");
    expect(el.shadowRoot!.textContent).to.not.contain("Auto-complete when the sensor recovers");

    const hold = endChoice(el).find((r) => r.value === "hold")!;
    hold.checked = true;
    hold.dispatchEvent(new Event("change"));
    await settle(el);
    expect(el.shadowRoot!.textContent).to.contain("a forecast that turns milder");
    await el._save();
    const tc = lastUpdate(sent).trigger_config;
    expect(tc.trigger_hold_until_done).to.equal(true);
    expect("auto_complete_on_recovery" in tc).to.equal(false);
  });

  it("a date from a sensor offers it under its own words and hydrates it", async () => {
    const { el } = await mountDialog();
    await el.openEdit("e", sensorTask({ type: "due_date", entity_id: "sensor.filter_due", trigger_days_before: 7, trigger_hold_until_done: true }) as never);
    await settle(el);
    expect(el.shadowRoot!.querySelector(".trigger-end .field-label")!.textContent).to.equal("When the device reports a later date");
    expect(endChoice(el).find((r) => r.checked)!.value).to.equal("hold");
  });

  it("a counter keeps the checkbox and never sends a hold", async () => {
    const { el, sent } = await mountDialog();
    await el.openEdit("e", sensorTask({ type: "counter", entity_id: "sensor.cycles", trigger_target_value: 30, trigger_hold_until_done: true }) as never);
    await settle(el);
    expect(endChoice(el).length).to.equal(0);
    expect(el.shadowRoot!.textContent).to.contain("Auto-complete when the sensor recovers");
    await el._save();
    expect("trigger_hold_until_done" in lastUpdate(sent).trigger_config).to.equal(false);
  });
});

// ─── D#250 ──────────────────────────────────────────────────────────────────

const selfDone = { type: "threshold", entity_id: "sensor.tank", trigger_below: 10, auto_complete_on_recovery: true } as const;

describe("D#250: which tasks complete themselves", () => {
  it("only an active trigger that records the task as done when it ends", () => {
    expect(completesItself({ trigger_active: true, trigger_config: selfDone })).to.equal(true);
    expect(completesItself({ trigger_active: false, trigger_config: selfDone }), "due by its safety interval").to.equal(false);
    expect(completesItself({ trigger_active: true, trigger_config: { ...selfDone, auto_complete_on_recovery: false } })).to.equal(false);
    expect(completesItself({ trigger_active: true, trigger_config: { type: "due_date", auto_complete_on_recovery: true } })).to.equal(true);
    expect(completesItself({ trigger_active: true, trigger_config: { type: "compound", auto_complete_on_recovery: true } })).to.equal(true);
    expect(completesItself({ trigger_active: true, trigger_config: { type: "state_change", trigger_to_state: "empty", auto_complete_on_recovery: true } })).to.equal(true);
    expect(completesItself({ trigger_active: true, trigger_config: { type: "state_change", trigger_to_state: "x", trigger_target_changes: 30, auto_complete_on_recovery: true } }), "a count of changes").to.equal(false);
    expect(completesItself({ trigger_active: true, trigger_config: { type: "counter", auto_complete_on_recovery: true } })).to.equal(false);
    expect(completesItself({ trigger_active: true, trigger_config: null })).to.equal(false);
    expect(completesItself(null)).to.equal(false);
  });
});

const tasksForRows = () => [
  task({ id: "tank", name: "Fill the water tank", schedule_type: "sensor_based", status: "triggered", trigger_active: true, days_until_due: null, trigger_config: selfDone }),
  task({ id: "filter", name: "Clean the filter", schedule_type: "sensor_based", status: "triggered", trigger_active: true, days_until_due: null,
    trigger_config: { type: "counter", entity_id: "sensor.cycles", trigger_target_value: 30, auto_complete_on_recovery: true } }),
  task({ id: "late", name: "Descale the tank", schedule_type: "sensor_based", status: "overdue", trigger_active: false, days_until_due: -2, trigger_config: selfDone }),
];

describe("D#250: the rows say it instead of Complete and Skip", () => {
  beforeEach(() => {
    resetTaskSeq();
    localStorage.clear();
  });

  it("the task card", async () => {
    const { hass } = createMockHass({
      handlers: {
        "maintenance_supporter/objects": () => ({ objects: [obj("e1", tasksForRows(), "Robot vacuum")] }),
        "maintenance_supporter/statistics": () => ({}),
      },
    });
    const card = (await fixture(html`<div></div>`)).appendChild(document.createElement("maintenance-supporter-card")) as HTMLElement & {
      setConfig(c: Record<string, unknown>): void; hass: unknown; updateComplete: Promise<unknown>;
    };
    card.setConfig({ type: "custom:maintenance-supporter-card" });
    card.hass = { ...hass, states: {}, user: { id: "u1", is_admin: true } };
    await waitUntil(() => card.shadowRoot!.querySelectorAll(".task-item").length === 3, "three rows");
    const row = (name: string) => [...card.shadowRoot!.querySelectorAll(".task-item")].find((r) => r.textContent!.includes(name))!;
    const label = row("Fill the water tank").querySelector(".inert-label");
    expect(label?.textContent).to.equal("Completes itself");
    expect(label?.getAttribute("title")).to.contain("when its sensor recovers");
    expect(!!row("Fill the water tank").querySelector(".complete-btn, .complete-btn-text")).to.equal(false);
    expect(!!row("Clean the filter").querySelector(".complete-btn, .complete-btn-text"), "a counter never ends by itself").to.equal(true);
    expect(!!row("Descale the tank").querySelector(".complete-btn, .complete-btn-text"), "due by its safety interval").to.equal(true);
  });

  for (const [tab, rowSel] of [["dashboard", ".task-row:not(.virt-sizer)"], ["today", ".today-row"]] as const) {
    it(`the panel's ${tab} rows`, async () => {
      localStorage.setItem("msp-overview-tab", tab);
      const { el } = await mountPanel([obj("e1", tasksForRows(), "Robot vacuum")]);
      await waitUntil(() => sr(el).querySelectorAll(rowSel).length >= 3, `${tab} rows`);
      const row = (name: string) => [...sr(el).querySelectorAll(rowSel)].find((r) => r.textContent!.includes(name))!;
      const label = row("Fill the water tank").querySelector(".row-actions .self-completing");
      expect(label?.textContent).to.equal("Completes itself");
      expect(!!row("Fill the water tank").querySelector(".row-actions ha-button, .row-actions .row-icon-btn")).to.equal(false);
      expect(!!row("Clean the filter").querySelector(".row-actions .self-completing")).to.equal(false);
      expect(!!row("Clean the filter").querySelector(".row-actions ha-button, .row-actions .row-icon-btn")).to.equal(true);
      expect(!!row("Descale the tank").querySelector(".row-actions .self-completing")).to.equal(false);
    });
  }
});
