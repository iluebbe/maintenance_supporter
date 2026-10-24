/**
 * D#229: a task completes itself when another entity changes to a state
 * (*Done when* in the dialog's "Completing it"), and a single-shot state
 * change can hold until the task is done (*When the state ends*, which
 * replaces the auto-complete checkbox for that latch). Pins: the choice is
 * offered for the latch only, it hydrates, and the save sends exactly one of
 * hold / auto-complete; Done when hydrates, saves, clears with null and
 * forgets the state when the entity changes; the task page shows the rule;
 * the completion's history note reads in the user's language.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/task-dialog.js";
import type { MaintenanceTaskDialog } from "../components/task-dialog";
import { historyNoteText } from "../helpers/history-note.js";
import { setLocale } from "../styles.js";
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
        entity_id: msg.entity_id, suggested_attributes: [], available_attributes: [],
      }),
    },
  });
  (hass as unknown as { states: Record<string, unknown> }).states = {
    "sensor.washer": { state: "off", attributes: { friendly_name: "Washer" } },
    "binary_sensor.washer_door": { state: "off", attributes: { friendly_name: "Washer door" } },
  };
  const el = await fixture<Dialog>(html`<maintenance-task-dialog .hass=${hass}></maintenance-task-dialog>`);
  await el.updateComplete;
  return { el, sent };
}

const settle = async (el: { updateComplete: Promise<unknown> }) => { await new Promise((r) => setTimeout(r, 30)); await el.updateComplete; };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const lastUpdate = (sent: SentMessage[]) => sent.filter((m) => m.type === "maintenance_supporter/task/update").at(-1) as Record<string, any>;

function washerTask(trigger: Record<string, unknown> = {}, extra: Record<string, unknown> = {}) {
  return {
    id: "t1", name: "Empty the washer", type: "custom", schedule_type: "sensor_based", warning_days: 7, enabled: true,
    trigger_config: { type: "state_change", entity_id: "sensor.washer", entity_ids: ["sensor.washer"], trigger_to_state: "finished", ...trigger },
    ...extra,
  };
}

const endChoice = (el: Dialog) => [...el.shadowRoot!.querySelectorAll<HTMLInputElement>(".trigger-end input[type=radio]")];

describe("When the state ends (D#229): the dialog", () => {
  it("offers the choice for a single-shot state change and hydrates the hold", async () => {
    const { el } = await mountDialog();
    await el.openEdit("e", washerTask({ trigger_hold_until_done: true }) as never);
    await settle(el);
    const radios = endChoice(el);
    expect(radios.map((r) => r.value)).to.deep.equal(["ok", "done", "hold"]);
    expect(radios.find((r) => r.checked)!.value).to.equal("hold");
    expect(el.shadowRoot!.textContent).to.contain("a finished wash");
  });

  it("keeps the auto-complete checkbox where nothing can hold (a counter)", async () => {
    const { el } = await mountDialog();
    await el.openEdit("e", washerTask({ trigger_target_changes: 30, auto_complete_on_recovery: true }) as never);
    await settle(el);
    expect(endChoice(el).length).to.equal(0);
    expect(el.shadowRoot!.textContent).to.contain("Auto-complete when the sensor recovers");
  });

  it("saves exactly one of hold and auto-complete", async () => {
    const { el, sent } = await mountDialog();
    await el.openEdit("e", washerTask({ auto_complete_on_recovery: true }) as never);
    await settle(el);
    expect(endChoice(el).find((r) => r.checked)!.value).to.equal("done");

    const hold = endChoice(el).find((r) => r.value === "hold")!;
    hold.checked = true;
    hold.dispatchEvent(new Event("change"));
    await settle(el);
    await el._save();
    let tc = lastUpdate(sent).trigger_config;
    expect(tc.trigger_hold_until_done).to.equal(true);
    expect("auto_complete_on_recovery" in tc).to.equal(false);

    await el.openEdit("e", washerTask({ trigger_hold_until_done: true }) as never);
    await settle(el);
    const ok = endChoice(el).find((r) => r.value === "ok")!;
    ok.checked = true;
    ok.dispatchEvent(new Event("change"));
    await settle(el);
    await el._save();
    tc = lastUpdate(sent).trigger_config;
    expect("trigger_hold_until_done" in tc).to.equal(false);
    expect("auto_complete_on_recovery" in tc).to.equal(false);
  });

  it("a hold left on a trigger that became a counter is not sent", async () => {
    const { el, sent } = await mountDialog();
    await el.openEdit("e", washerTask({ trigger_hold_until_done: true }) as never);
    await settle(el);
    el._triggerTargetChanges = "30";
    await settle(el);
    await el._save();
    expect("trigger_hold_until_done" in lastUpdate(sent).trigger_config).to.equal(false);
  });
});

describe("Done when (D#229): the dialog", () => {
  it("hydrates, shows the field in Completing it, and saves the rule", async () => {
    const { el, sent } = await mountDialog();
    await el.openEdit("e", washerTask({}, { complete_when: { entity_id: "binary_sensor.washer_door", to_state: "on" } }) as never);
    await settle(el);
    expect(el._completeWhenEntity).to.equal("binary_sensor.washer_door");
    expect(el._completeWhenState).to.equal("on");
    const field = el.shadowRoot!.querySelector(".completion-section .complete-when-field");
    expect(field, "in the Completing it section").to.not.equal(null);
    expect(field!.textContent).to.contain("washer's door opens");
    await el._save();
    expect(lastUpdate(sent).complete_when).to.deep.equal({ entity_id: "binary_sensor.washer_door", to_state: "on" });
  });

  it("sends null without an entity or a state", async () => {
    const { el, sent } = await mountDialog();
    await el.openEdit("e", washerTask({}, { complete_when: { entity_id: "binary_sensor.washer_door", to_state: "on" } }) as never);
    await settle(el);
    el._completeWhenState = " ";
    await el._save();
    expect(lastUpdate(sent).complete_when).to.equal(null);

    await el.openEdit("e", washerTask() as never);
    await settle(el);
    expect(el._completeWhenEntity).to.equal("");
    await el._save();
    expect(lastUpdate(sent).complete_when).to.equal(null);
  });

  it("a new task starts without a rule", async () => {
    const { el } = await mountDialog();
    await el.openEdit("e", washerTask({}, { complete_when: { entity_id: "binary_sensor.washer_door", to_state: "on" } }) as never);
    await settle(el);
    await el.openCreate("e");
    await settle(el);
    expect(el._completeWhenEntity).to.equal("");
    expect(el._completeWhenState).to.equal("");
  });
});

describe("Done when (D#229): the task page", () => {
  beforeEach(() => {
    resetTaskSeq();
    localStorage.clear();
  });
  afterEach(() => localStorage.clear());

  it("names the entity and the state on the task page", async () => {
    const { el } = await mountPanel([obj("e1", [task({ name: "Empty the washer", complete_when: { entity_id: "binary_sensor.washer_door", to_state: "on" } })], "Washer")]);
    const panel = el as unknown as { _showTask: (e: string, t: string) => void; updateComplete: Promise<unknown> };
    panel._showTask("e1", "t1");
    await panel.updateComplete;
    const badge = sr(el).querySelector<HTMLElement>(".complete-when-badge");
    expect(badge, "the badge").to.not.equal(null);
    expect(badge!.title).to.equal("Done when binary_sensor.washer_door changes to on");
  });
});

describe("Done when (D#229): the history note", () => {
  it("reads in the user's language, with the entity and the state filled in", () => {
    setLocale("de", { hist_note_auto_entity: "Automatisch abgeschlossen: {entity} wechselte zu {state}" });
    expect(historyNoteText("Auto-completed: Washer door changed to on", "de")).to.equal("Automatisch abgeschlossen: Washer door wechselte zu on");
    expect(historyNoteText("Auto-completed: sensor recovered", "en")).to.equal("Auto-completed: sensor recovered");
  });
});
