/**
 * Lit component tests for the v1.3.0 completion-actions sections of
 * <maintenance-task-dialog>: on_complete_action + quick_complete_defaults.
 *
 * The two sections are gated behind `completionActionsEnabled`. Save-payload
 * shape is what the WS contract pins on the backend (test_completion_actions.py
 * + test_ws_roundtrip.py); these tests pin the UI side: gating, hydration of
 * existing values, and outgoing payload shape.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/task-dialog.js";
import type { MaintenanceTaskDialog } from "../components/task-dialog";
import {
  type CreateMockHassResult,
  type SentMessage,
  type ServiceCall,
  createMockHass,
} from "./_test-utils.js";

// v1.3.1: minimal service registry so the schema-driven data form can
// resolve `light.toggle` to a known field set.
const SERVICES_FIXTURE = {
  light: {
    toggle: {
      fields: {
        brightness: { selector: { number: { min: 0, max: 255 } }, required: false },
        transition: { selector: { number: { min: 0, max: 60 } }, required: false },
      },
    },
    turn_on: {
      fields: {
        brightness: { selector: { number: { min: 0, max: 255 } }, required: false },
      },
    },
  },
  button: { press: {} }, // no fields → fallback JSON textfield
};

function mockHass(): CreateMockHassResult {
  return createMockHass({
    services: SERVICES_FIXTURE,
    handlers: {
      "maintenance_supporter/task/create": () => ({ task_id: "newtask123" }),
      "maintenance_supporter/task/update": () => ({}),
    },
  });
}

async function mountDialog(opts: { completionActions?: boolean } = {}): Promise<{
  el: MaintenanceTaskDialog;
  sent: SentMessage[];
  serviceCalls: ServiceCall[];
}> {
  const { hass, sent, serviceCalls } = mockHass();
  const el = await fixture<MaintenanceTaskDialog>(html`
    <maintenance-task-dialog
      .hass=${hass}
      ?completion-actions-enabled=${opts.completionActions ?? false}
    ></maintenance-task-dialog>
  `);
  await el.updateComplete;
  return { el, sent, serviceCalls };
}

function caSections(el: MaintenanceTaskDialog): NodeListOf<HTMLElement> {
  return el.shadowRoot!.querySelectorAll<HTMLElement>("details.ca-section");
}

describe("task-dialog completion-actions sections", () => {
  it("hides both sections when feature flag is off", async () => {
    const { el } = await mountDialog({ completionActions: false });
    await el.openCreate("entry_x");
    await el.updateComplete;
    expect(caSections(el).length, "no .ca-section when gated off").to.equal(0);
  });

  it("renders both sections when feature flag is on", async () => {
    const { el } = await mountDialog({ completionActions: true });
    await el.openCreate("entry_x");
    await el.updateComplete;
    const sections = caSections(el);
    expect(sections.length, "two collapsible sections present").to.equal(2);
    expect(sections[0].querySelector("summary")?.textContent || "")
      .to.match(/action|aktion/i);
    expect(sections[1].querySelector("summary")?.textContent || "")
      .to.match(/quick|schnell/i);
  });

  it("hydrates on_complete_action from an existing task on openEdit", async () => {
    const { el } = await mountDialog({ completionActions: true });
    await el.openEdit("entry_x", {
      id: "t1",
      name: "Edit hydration",
      type: "custom",
      schedule_type: "time_based",
      interval_days: 30,
      warning_days: 7,
      enabled: true,
      on_complete_action: {
        service: "light.turn_on",
        target: { entity_id: "light.workshop" },
        data: { brightness: 200 },
      },
      quick_complete_defaults: {
        notes: "Quick note",
        cost: 4.5,
        duration: 10,
        feedback: "needed",
      },
    } as any);
    await el.updateComplete;

    // v1.3.1: service field is now an <ha-service-picker> (not a textfield).
    const servicePicker = el.shadowRoot!
      .querySelector<HTMLElement & { value: string }>(
        "details.ca-section ha-service-picker",
      );
    expect(servicePicker?.value, "service picker hydrated").to.equal("light.turn_on");

    // Internal state pins the parsed data dict — ha-form gets it via .data prop.
    expect((el as any)._actionData.brightness, "data hydrated").to.equal(200);

    // Quick-complete fields are in the second details panel.
    // v2.3.x: ha-textfield → ms-textfield to dodge HA's lazy-load (issues #46/#50).
    const sections = caSections(el);
    const qcInputs = sections[1].querySelectorAll<HTMLElement & { value: string }>(
      "ms-textfield",
    );
    expect(qcInputs[0]?.value, "qc notes").to.equal("Quick note");
    expect(qcInputs[1]?.value, "qc cost").to.equal("4.5");
    expect(qcInputs[2]?.value, "qc duration").to.equal("10");

    const qcSelect = sections[1].querySelector<HTMLSelectElement>("select.qc-feedback");
    expect(qcSelect?.value, "qc feedback").to.equal("needed");
  });

  it("Test button calls hass.callService with target as separate arg (matches production action_listener.py)", async () => {
    const { el, serviceCalls } = await mountDialog({ completionActions: true });
    await el.openCreate("entry_x");
    (el as any)._actionService = "light.toggle";
    (el as any)._actionTargetEntity = "light.workshop";
    (el as any)._actionData = { brightness: 100 };
    await el.updateComplete;

    const testBtn = el.shadowRoot!.querySelector<HTMLButtonElement>(
      "details.ca-section .ca-test-row button",
    );
    expect(testBtn, "test button rendered").to.exist;
    testBtn!.click();
    await new Promise((r) => setTimeout(r, 30));

    expect(serviceCalls.length, "exactly one service call dispatched").to.equal(1);
    expect(serviceCalls[0].domain).to.equal("light");
    expect(serviceCalls[0].service).to.equal("toggle");
    // v2.3.x: target is now a separate 4th arg, NOT merged into data.
    // This matches helpers/action_listener.py which calls
    // hass.services.async_call(d, n, service_data=data, target=target).
    // Otherwise test path silently diverges from production — exactly the
    // class of bug that hid issue #50 for so long.
    expect(serviceCalls[0].target?.entity_id, "target as separate arg").to.equal("light.workshop");
    expect(serviceCalls[0].data?.brightness, "data is service-data only").to.equal(100);
    expect(serviceCalls[0].data?.entity_id, "entity_id is NOT in data").to.be.undefined;
  });

  it("Test button blocks call + shows error on service/entity domain-mismatch", async () => {
    // Issue #50 follow-up: user picked button.press service + input_button.*
    // entity. HA's service-call returns success (does nothing) and only logs
    // a warning. Test action used to show a green checkmark. Now: up-front
    // check catches the mismatch + shows an explicit error WITHOUT calling.
    const { el, serviceCalls } = await mountDialog({ completionActions: true });
    await el.openCreate("entry_x");
    (el as any)._actionService = "button.press";
    (el as any)._actionTargetEntity = "input_button.foo";
    await el.updateComplete;

    const testBtn = el.shadowRoot!.querySelector<HTMLButtonElement>(
      "details.ca-section .ca-test-row button",
    );
    testBtn!.click();
    await new Promise((r) => setTimeout(r, 30));
    await el.updateComplete;

    expect(serviceCalls.length, "no service call dispatched on mismatch").to.equal(0);
    expect((el as any)._actionTestResult).to.equal("error");
    const errMsg = (el as any)._actionTestError as string;
    expect(errMsg, "error message names both domains")
      .to.match(/button\.\*.*input_button\.\*|input_button\.\*.*button\.\*/);
  });

  it("Test button allows cross-domain services (homeassistant.turn_on, scene.*)", async () => {
    const { el, serviceCalls } = await mountDialog({ completionActions: true });
    await el.openCreate("entry_x");
    (el as any)._actionService = "homeassistant.turn_on";
    (el as any)._actionTargetEntity = "light.kitchen";
    await el.updateComplete;

    const testBtn = el.shadowRoot!.querySelector<HTMLButtonElement>(
      "details.ca-section .ca-test-row button",
    );
    testBtn!.click();
    await new Promise((r) => setTimeout(r, 30));

    expect(serviceCalls.length, "homeassistant.turn_on bypasses domain check").to.equal(1);
    expect(serviceCalls[0].target?.entity_id).to.equal("light.kitchen");
  });

  it("renders ha-form when the picked service has a schema", async () => {
    const { el } = await mountDialog({ completionActions: true });
    await el.openCreate("entry_x");
    (el as any)._actionService = "light.toggle";
    await el.updateComplete;
    const actionSection = caSections(el)[0]!;
    // Two ha-form elements expected: the entity picker (always) + the
    // data-form (only when service has a schema, like light.toggle does).
    expect(
      actionSection.querySelector("ha-form.ca-data-form"),
      "data ha-form rendered for schemaed service",
    ).to.exist;
    expect(
      actionSection.querySelector("ms-textfield"),
      "no JSON fallback textfield when schema present",
    ).to.not.exist;
  });

  it("falls back to JSON textfield when the service has no schema", async () => {
    const { el } = await mountDialog({ completionActions: true });
    await el.openCreate("entry_x");
    (el as any)._actionService = "button.press"; // services.button.press has no fields
    await el.updateComplete;
    const actionSection = caSections(el)[0]!;
    // v2.3.x: there's now an entity-picker ha-form (always present) PLUS
    // the optional data-form ha-form (only when service has a schema).
    // Disambiguate via the .ca-data-form class — the bare ha-form is the
    // entity picker and is always present.
    expect(
      actionSection.querySelector("ha-form.ca-data-form"),
      "no DATA ha-form when service has no fields",
    ).to.not.exist;
    expect(
      actionSection.querySelector("ms-textfield"),
      "JSON fallback textfield rendered (now ms-textfield)",
    ).to.exist;
  });

  it("Test button is disabled when service is empty", async () => {
    const { el } = await mountDialog({ completionActions: true });
    await el.openCreate("entry_x");
    await el.updateComplete;
    const btn = el.shadowRoot!.querySelector<HTMLButtonElement>(
      "details.ca-section .ca-test-row button",
    );
    expect(btn?.disabled, "test button disabled with no service").to.be.true;
  });
});
