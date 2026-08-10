/**
 * <maintenance-task-dialog>: entity pickers in the trigger form (#129).
 *
 * The sensor-based trigger form, each compound condition row, and the
 * environmental-entity field render HA entity pickers (ha-form + entity
 * selector) instead of comma-separated text inputs — parity with the config
 * flow's EntitySelector. Pins: the pickers mount with the right selector
 * config (multi + domain filter mirroring TRIGGER_PICKER_DOMAINS), prefill
 * from existing state, write picker output back to the dialog state, and the
 * old comma text field stays gone.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/task-dialog.js";
import type { MaintenanceTaskDialog } from "../components/task-dialog";
import {
  ENVIRONMENTAL_PICKER_DEVICE_CLASSES,
  ENVIRONMENTAL_PICKER_DOMAINS,
  TRIGGER_PICKER_DOMAINS,
} from "../helpers/trigger-domains";
import { createMockHass } from "./_test-utils.js";

type HaFormLike = HTMLElement & {
  schema: Array<{ name: string; selector: Record<string, unknown> }>;
  data: Record<string, unknown>;
};

async function mountSensorBased(): Promise<MaintenanceTaskDialog> {
  const { hass } = createMockHass({});
  const el = await fixture<MaintenanceTaskDialog>(html`
    <maintenance-task-dialog .hass=${hass}></maintenance-task-dialog>
  `);
  el.openCreate("e1", []);
  await el.updateComplete;
  (el as any)._scheduleType = "sensor_based";
  await el.updateComplete;
  await new Promise((r) => setTimeout(r, 0));
  await el.updateComplete;
  return el;
}

const formByField = (el: MaintenanceTaskDialog, field: string): HaFormLike | undefined =>
  [...el.shadowRoot!.querySelectorAll<HaFormLike>("ha-form.entity-picker-form")]
    .find((f) => f.schema?.some((s) => s.name === field));

const emitValue = (form: HaFormLike, value: Record<string, unknown>) =>
  form.dispatchEvent(new CustomEvent("value-changed", { detail: { value }, bubbles: true }));

describe("task-dialog entity pickers (#129)", () => {
  it("trigger field is a multi entity picker with the config-flow domain filter", async () => {
    const el = await mountSensorBased();
    (el as any)._triggerEntityId = "sensor.dust";
    (el as any)._triggerEntityIds = ["sensor.dust", "sensor.dust2"];
    await el.updateComplete;

    const form = formByField(el, "trigger_entities")!;
    expect(form, "trigger picker rendered").to.exist;
    const sel = form.schema[0].selector as { entity: { multiple: boolean; domain: string[] } };
    expect(sel.entity.multiple).to.equal(true);
    expect(sel.entity.domain).to.deep.equal(TRIGGER_PICKER_DOMAINS);
    expect(form.data.trigger_entities).to.deep.equal(["sensor.dust", "sensor.dust2"]);
  });

  it("picker output lands in _triggerEntityId/_triggerEntityIds", async () => {
    const el = await mountSensorBased();
    const form = formByField(el, "trigger_entities")!;
    emitValue(form, { trigger_entities: ["sensor.a", "sensor.b"] });
    await el.updateComplete;
    expect((el as any)._triggerEntityId).to.equal("sensor.a");
    expect((el as any)._triggerEntityIds).to.deep.equal(["sensor.a", "sensor.b"]);

    emitValue(form, { trigger_entities: [] });
    await el.updateComplete;
    expect((el as any)._triggerEntityId).to.equal("");
  });

  it("each compound condition row gets its own picker, round-tripping the draft's comma string", async () => {
    const el = await mountSensorBased();
    (el as any)._triggerType = "compound";
    (el as any)._compoundConditions = [
      { entityIds: "sensor.hours", type: "runtime", above: "", below: "", forMinutes: "0",
        targetValue: "", deltaMode: false, fromState: "", toState: "", targetChanges: "", carry: {} },
      { entityIds: "sensor.dust, sensor.dust2", type: "threshold", above: "80", below: "", forMinutes: "0",
        targetValue: "", deltaMode: false, fromState: "", toState: "", targetChanges: "", carry: {} },
    ];
    await el.updateComplete;

    const forms = [...el.shadowRoot!.querySelectorAll<HaFormLike>("ha-form.entity-picker-form")]
      .filter((f) => f.schema?.some((s) => s.name === "condition_entities"));
    expect(forms.length).to.equal(2);
    expect(forms[1].data.condition_entities).to.deep.equal(["sensor.dust", "sensor.dust2"]);

    emitValue(forms[0], { condition_entities: ["sensor.hours", "sensor.hours2"] });
    await el.updateComplete;
    expect((el as any)._compoundConditions[0].entityIds).to.equal("sensor.hours, sensor.hours2");
  });

  it("environmental field is a single picker mirroring the adaptive options filter", async () => {
    const el = await mountSensorBased();
    const form = formByField(el, "environmental_entity")!;
    expect(form, "environmental picker rendered").to.exist;
    const sel = form.schema[0].selector as { entity: { domain: string[]; device_class: string[] } };
    expect(sel.entity.domain).to.deep.equal(ENVIRONMENTAL_PICKER_DOMAINS);
    expect(sel.entity.device_class).to.deep.equal(ENVIRONMENTAL_PICKER_DEVICE_CLASSES);

    emitValue(form, { environmental_entity: "sensor.outdoor_temp" });
    await el.updateComplete;
    expect((el as any)._environmentalEntity).to.equal("sensor.outdoor_temp");
  });

  it("the comma-separated text fields are gone by default", async () => {
    const el = await mountSensorBased();
    (el as any)._triggerType = "compound";
    (el as any)._compoundConditions = [
      { entityIds: "sensor.x", type: "threshold", above: "", below: "", forMinutes: "0",
        targetValue: "", deltaMode: false, fromState: "", toState: "", targetChanges: "", carry: {} },
    ];
    await el.updateComplete;
    const labels = [...el.shadowRoot!.querySelectorAll("ms-textfield")]
      .map((n) => n.getAttribute("label") || "");
    expect(labels.some((l) => /comma/i.test(l)), "no comma-separated textfield left").to.equal(false);
  });

  it("fallback flag restores the comma text fields and drops the pickers", async () => {
    const el = await mountSensorBased();
    (el as any)._triggerEntityIds = ["sensor.a", "sensor.b"];
    (el as any)._entityPickerFallback = true;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector("ha-form.entity-picker-form")).to.equal(null);
    const comma = [...el.shadowRoot!.querySelectorAll("ms-textfield")]
      .find((n) => /comma/i.test(n.getAttribute("label") || ""));
    expect(comma, "comma textfield back").to.exist;
    expect((comma as any).value).to.equal("sensor.a, sensor.b");
  });

  it("state_change from/to render state selectors bound to the trigger entity", async () => {
    const el = await mountSensorBased();
    (el as any)._triggerEntityId = "sensor.pump";
    (el as any)._triggerEntityIds = ["sensor.pump"];
    (el as any)._triggerType = "state_change";
    await el.updateComplete;
    const stateForms = [...el.shadowRoot!.querySelectorAll<HaFormLike>("ha-form.state-picker-form")];
    expect(stateForms.length, "from + to state selectors").to.equal(2);
    const sel = stateForms[0].schema[0].selector as { state: { entity_id: string } };
    expect(sel.state.entity_id).to.equal("sensor.pump");
    emitValue(stateForms[1], { s: "off" });
    await el.updateComplete;
    expect((el as any)._triggerToState).to.equal("off");
  });

  it("runtime on-states round-trips the comma string through a multiple state selector", async () => {
    const el = await mountSensorBased();
    (el as any)._triggerEntityId = "vacuum.robo";
    (el as any)._triggerEntityIds = ["vacuum.robo"];
    (el as any)._triggerType = "runtime";
    (el as any)._triggerOnStates = "cleaning, returning";
    await el.updateComplete;
    const form = [...el.shadowRoot!.querySelectorAll<HaFormLike>("ha-form.state-picker-form")][0];
    expect(form, "on-states selector rendered").to.exist;
    const sel = form.schema[0].selector as { state: { entity_id: string; multiple: boolean } };
    expect(sel.state.multiple).to.equal(true);
    expect(form.data.s).to.deep.equal(["cleaning", "returning"]);
    emitValue(form, { s: ["cleaning", "docked"] });
    await el.updateComplete;
    expect((el as any)._triggerOnStates).to.equal("cleaning, docked");
  });

  it("without an entity the state fields stay plain textfields", async () => {
    const el = await mountSensorBased();
    (el as any)._triggerType = "state_change";
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector("ha-form.state-picker-form")).to.equal(null);
    const labels = [...el.shadowRoot!.querySelectorAll("ms-textfield")].map((n) => n.getAttribute("label") || "");
    expect(labels.some((l) => /from state/i.test(l)), "textfield fallback").to.equal(true);
  });

  it("self-heals: zero-height pickers flip the fallback within ~2.5s (card-context safety net)", async function () {
    this.timeout(6000);
    const el = await mountSensorBased();
    // In the test env ha-form is an unknown element with no layout — exactly
    // the broken-context signature the probe is built to catch.
    await new Promise((r) => setTimeout(r, 2600));
    await el.updateComplete;
    expect((el as any)._entityPickerFallback, "fallback engaged").to.equal(true);
    const comma = [...el.shadowRoot!.querySelectorAll("ms-textfield")]
      .find((n) => /comma/i.test(n.getAttribute("label") || ""));
    expect(comma, "comma textfield rendered after fallback").to.exist;
  });
});
