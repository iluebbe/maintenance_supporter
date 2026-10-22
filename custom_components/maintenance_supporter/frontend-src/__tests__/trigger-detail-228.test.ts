/**
 * #228: a sensor trigger may name an attribute of its entity whose value says
 * what the triggered task is about ("Buy medicine · Trulicity: 3 left").
 * Pins: the dialog's *Show with the task* field (choices from the entity's
 * attributes with their values now, hydration, the save for a plain and a
 * compound trigger, nothing sent for "Nothing"), and the lists showing the
 * server's `trigger_detail` muted after the task name.
 */

import { expect, fixture, html } from "@open-wc/testing";
import { render } from "lit";
import "../components/task-dialog.js";
import type { MaintenanceTaskDialog } from "../components/task-dialog";
import { renderTriggerDetail } from "../helpers/event-titles.js";
import { type SentMessage, createMockHass } from "./_test-utils.js";
import { mountPanel, obj, resetTaskSeq, sr, task } from "./_panel-utils.js";

// The dialog's private fields are driven directly, as the other dialog tests do.
type Dialog = HTMLElement & {
  updateComplete: Promise<unknown>;
  openEdit: MaintenanceTaskDialog["openEdit"];
  openCreate: MaintenanceTaskDialog["openCreate"];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [k: string]: any;
};

async function mountDialog(): Promise<{ el: Dialog; sent: SentMessage[] }> {
  const { hass, sent } = createMockHass({
    handlers: {
      "maintenance_supporter/task/create": () => ({ task_id: "new1" }),
      "maintenance_supporter/task/update": () => ({}),
      "maintenance_supporter/entity/attributes": (msg: Record<string, unknown>) => ({
        entity_id: msg.entity_id,
        suggested_attributes: [],
        available_attributes: msg.entity_id === "binary_sensor.supplies_low"
          ? [{ name: "low", value: ["Trulicity: 3 left"], numeric: false }, { name: "count", value: 1, numeric: true }]
          : [{ name: "level", value: 40, numeric: true }],
      }),
    },
  });
  (hass as unknown as { states: Record<string, unknown> }).states = {
    "binary_sensor.supplies_low": { state: "on", attributes: { low: ["Trulicity: 3 left"], count: 1, friendly_name: "Supplies low" } },
  };
  const el = await fixture<Dialog>(html`<maintenance-task-dialog .hass=${hass}></maintenance-task-dialog>`);
  await el.updateComplete;
  return { el, sent };
}

const settle = async (el: { updateComplete: Promise<unknown> }) => { await new Promise((r) => setTimeout(r, 30)); await el.updateComplete; };

function sensorTask(extra: Record<string, unknown> = {}) {
  return {
    id: "t1", name: "Buy medicine", type: "custom", schedule_type: "sensor_based", warning_days: 7, enabled: true,
    trigger_config: { type: "state_change", entity_id: "binary_sensor.supplies_low", entity_ids: ["binary_sensor.supplies_low"], trigger_to_state: "on", ...extra },
  };
}

describe("Show with the task (#228): the dialog", () => {
  it("offers the entity's attributes with their values now, and hydrates the choice", async () => {
    const { el } = await mountDialog();
    await el.openEdit("e", sensorTask({ detail_attribute: "low" }) as never);
    await settle(el);
    await settle(el);
    expect(el._triggerDetailAttribute).to.equal("low");
    const select = el.shadowRoot!.querySelector<HTMLSelectElement>(".detail-attribute-select")!;
    expect(select, "a choice, not a text field").to.exist;
    expect([...select.options].map((o) => o.textContent!.trim())).to.deep.equal(["Nothing", "count: 1", "low: Trulicity: 3 left"]);
    expect(select.value).to.equal("low");
    expect(el.shadowRoot!.textContent).to.contain("which medicine is running low");
  });

  it("sends the choice for a plain trigger, and nothing for Nothing", async () => {
    const { el, sent } = await mountDialog();
    await el.openEdit("e", sensorTask({ detail_attribute: "low" }) as never);
    await settle(el);
    await el._save();
    const first = sent.filter((m) => m.type === "maintenance_supporter/task/update").at(-1) as Record<string, any>;
    expect(first.trigger_config.detail_attribute).to.equal("low");

    await el.openEdit("e", sensorTask({ detail_attribute: "low" }) as never);
    await settle(el);
    el._triggerDetailAttribute = "";
    await el._save();
    const second = sent.filter((m) => m.type === "maintenance_supporter/task/update").at(-1) as Record<string, any>;
    expect("detail_attribute" in second.trigger_config).to.equal(false);
  });

  it("a compound trigger keeps it across a save", async () => {
    const { el, sent } = await mountDialog();
    await el.openEdit("e", {
      ...sensorTask(),
      trigger_config: {
        type: "compound", compound_logic: "OR", detail_attribute: "low",
        conditions: [
          { type: "state_change", entity_id: "binary_sensor.supplies_low", trigger_to_state: "on" },
          { type: "threshold", entity_id: "sensor.level", trigger_below: 10 },
        ],
      },
    } as never);
    await settle(el);
    await settle(el);
    const select = el.shadowRoot!.querySelector<HTMLSelectElement>(".detail-attribute-select")!;
    expect([...select.options].map((o) => o.value), "every condition's entity").to.include.members(["low", "count", "level"]);
    await el._save();
    const msg = sent.filter((m) => m.type === "maintenance_supporter/task/update").at(-1) as Record<string, any>;
    expect(msg.trigger_config.detail_attribute).to.equal("low");
  });

  it("no field before an entity is picked", async () => {
    const { el } = await mountDialog();
    await el.openCreate("e");
    el._scheduleType = "sensor_based";
    await settle(el);
    expect(el.shadowRoot!.querySelector(".detail-attribute-select, .detail-attribute-input")).to.equal(null);
  });
});

describe("Show with the task (#228): the lists", () => {
  beforeEach(() => {
    resetTaskSeq();
    localStorage.clear();
    localStorage.setItem("msp-overview-tab", "dashboard");
  });
  afterEach(() => localStorage.clear());

  it("renders the detail muted after a separator, nothing without one", () => {
    const host = document.createElement("div");
    render(renderTriggerDetail("Trulicity: 3 left"), host);
    expect(host.querySelector(".event-titles.trigger-detail")!.textContent).to.equal(" · Trulicity: 3 left");
    for (const empty of [null, undefined, ""]) {
      const h = document.createElement("div");
      render(renderTriggerDetail(empty), h);
      expect(h.querySelector(".trigger-detail"), String(empty)).to.equal(null);
    }
  });

  it("the dashboard row names what the trigger is about", async () => {
    const triggered = task({ name: "Buy medicine", status: "triggered", trigger_active: true, trigger_detail: "Trulicity: 3 left" });
    const plain = task({ name: "Clean shelf", days_until_due: 5 });
    const { el } = await mountPanel([obj("e1", [triggered, plain], "Medicine cabinet")]);
    const names = [...sr(el).querySelectorAll<HTMLElement>(".task-row .cell.task-name")].map((n) => n.textContent!.replace(/\s+/g, " ").trim());
    expect(names.find((n) => n.includes("Buy medicine"))).to.contain("Buy medicine · Trulicity: 3 left");
    expect(names.find((n) => n.includes("Clean shelf"))).to.not.contain("·");
  });
});
