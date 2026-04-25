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

interface SentMessage { type: string; [key: string]: unknown }

function mockHass(): {
  hass: {
    language: string;
    connection: { sendMessagePromise: (msg: SentMessage) => Promise<unknown> };
    callService: (domain: string, service: string, data?: Record<string, unknown>) => Promise<void>;
  };
  sent: SentMessage[];
  serviceCalls: Array<{ domain: string; service: string; data?: Record<string, unknown> }>;
} {
  const sent: SentMessage[] = [];
  const serviceCalls: Array<{ domain: string; service: string; data?: Record<string, unknown> }> = [];
  const sendMessagePromise = async (msg: SentMessage): Promise<unknown> => {
    sent.push(msg);
    if (msg.type === "maintenance_supporter/users/list") return { users: [] };
    if (msg.type === "maintenance_supporter/tags/list") return { tags: [] };
    if (msg.type === "maintenance_supporter/task/create") return { task_id: "newtask123" };
    if (msg.type === "maintenance_supporter/task/update") return {};
    return {};
  };
  const callService = async (
    domain: string, service: string, data?: Record<string, unknown>,
  ): Promise<void> => {
    serviceCalls.push({ domain, service, data });
  };
  return {
    hass: { language: "en", connection: { sendMessagePromise }, callService },
    sent, serviceCalls,
  };
}

async function mountDialog(opts: { completionActions?: boolean } = {}): Promise<{
  el: MaintenanceTaskDialog;
  sent: SentMessage[];
  serviceCalls: Array<{ domain: string; service: string; data?: Record<string, unknown> }>;
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

    const serviceField = el.shadowRoot!
      .querySelector<HTMLElement & { value: string }>(
        "details.ca-section ha-textfield",
      );
    expect(serviceField?.value, "service field hydrated").to.equal("light.turn_on");

    // Quick-complete fields are in the second details panel.
    const sections = caSections(el);
    const qcInputs = sections[1].querySelectorAll<HTMLElement & { value: string }>(
      "ha-textfield",
    );
    expect(qcInputs[0]?.value, "qc notes").to.equal("Quick note");
    expect(qcInputs[1]?.value, "qc cost").to.equal("4.5");
    expect(qcInputs[2]?.value, "qc duration").to.equal("10");

    const qcSelect = sections[1].querySelector<HTMLSelectElement>("select.qc-feedback");
    expect(qcSelect?.value, "qc feedback").to.equal("needed");
  });

  it("calls hass.callService when the Test button is clicked", async () => {
    const { el, serviceCalls } = await mountDialog({ completionActions: true });
    await el.openCreate("entry_x");
    // Manually wire the action service + target as if user typed them.
    (el as any)._actionService = "light.toggle";
    (el as any)._actionTargetEntity = "light.workshop";
    (el as any)._actionDataJson = '{"brightness": 100}';
    await el.updateComplete;

    const testBtn = el.shadowRoot!.querySelector<HTMLButtonElement>(
      "details.ca-section .ca-test-row button",
    );
    expect(testBtn, "test button rendered").to.exist;
    testBtn!.click();
    // Wait one tick for the async _testAction to dispatch + resolve.
    await new Promise((r) => setTimeout(r, 30));

    expect(serviceCalls.length, "exactly one service call dispatched").to.equal(1);
    expect(serviceCalls[0].domain).to.equal("light");
    expect(serviceCalls[0].service).to.equal("toggle");
    expect(serviceCalls[0].data?.entity_id, "target merged into data").to.equal("light.workshop");
    expect(serviceCalls[0].data?.brightness).to.equal(100);
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
