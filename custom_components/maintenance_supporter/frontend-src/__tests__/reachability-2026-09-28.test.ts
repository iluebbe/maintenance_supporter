/**
 * Reachability audit 2026-09-28, package 2 — controls that existed but
 * could not be reached the way the docs described:
 *  - "Send test" was disabled without a notify service although event-only
 *    delivery needs none (the backend fires the event for the test);
 *  - Re-analyze sat only in the recommendation card, which shows once a
 *    differing suggestion exists — the analysis it triggers was unreachable
 *    before that. The task's ⋮ menu now carries it for adaptive tasks.
 */

import { expect, fixture, html } from "@open-wc/testing";
import { render } from "lit";
import "../components/settings-view.js";
import type { MaintenanceSettingsView } from "../components/settings-view";
import { renderTaskDetail, type TaskDetailContext } from "../renderers/task-detail.js";
import type { MaintenanceTask } from "../types";
import { DEFAULT_FEATURES, DEFAULT_SETTINGS_RESPONSE, createMockHass } from "./_test-utils.js";

async function settingsView(eventOnly: boolean, service: string): Promise<MaintenanceSettingsView> {
  const { hass } = createMockHass({
    handlers: {
      "maintenance_supporter/settings": () => ({
        ...DEFAULT_SETTINGS_RESPONSE,
        general: { ...DEFAULT_SETTINGS_RESPONSE.general, notifications_enabled: true, notify_service: service },
        notifications: { ...DEFAULT_SETTINGS_RESPONSE.notifications, event_only: eventOnly },
      }),
    },
  });
  const el = await fixture<MaintenanceSettingsView>(html`
    <maintenance-settings-view .hass=${hass} .features=${DEFAULT_FEATURES}></maintenance-settings-view>
  `);
  await new Promise((r) => setTimeout(r, 50));
  await el.updateComplete;
  return el;
}

function sendTestButton(el: MaintenanceSettingsView): HTMLButtonElement {
  return [...el.shadowRoot!.querySelectorAll<HTMLButtonElement>("button")]
    .find((b) => /send test/i.test(b.textContent || ""))!;
}

describe("settings: Send test in event-only mode", () => {
  it("is enabled without a notify service when only the event is fired", async () => {
    expect(sendTestButton(await settingsView(true, "")).disabled).to.equal(false);
  });

  it("stays disabled with neither a service nor event-only", async () => {
    expect(sendTestButton(await settingsView(false, "")).disabled).to.equal(true);
  });
});

describe("task detail: Re-analyze in the ⋮ menu", () => {
  const TASK = {
    id: "t1", name: "Descale", type: "cleaning", enabled: true, status: "ok",
    schedule_type: "time_based", interval_days: 30, warning_days: 7, days_until_due: 20,
    next_due: "2026-10-18", last_performed: "2026-09-18", times_performed: 3, total_cost: 0,
    history: [], checklist: [], is_done: false, archived: false, trigger_active: false,
    adaptive_config: { enabled: true },
  } as unknown as MaintenanceTask;

  function menu(adaptiveFeature: boolean, task: MaintenanceTask, reanalyze: () => void): HTMLElement {
    const { hass } = createMockHass({ handler: () => ({ documents: [] }) });
    const ctx = new Proxy({
      lang: "en", hass, entryId: "e1", taskId: "t1", objectName: "Espresso Machine",
      objectDocUrl: null, objectManualDocs: [], isOperator: false, actionLoading: false,
      moreMenuOpen: true, activeTab: "history", currencySymbol: "€", collapsedSections: new Set(),
      costDurationToggle: "both", suggestionDismissed: false,
      features: { ...DEFAULT_FEATURES, adaptive: adaptiveFeature },
      history: { lang: "en", hass, filter: null, search: "", entries: [] },
      reanalyze,
    } as Record<string, unknown>, {
      // every other callback is a no-op
      get: (target, key) => (key in target ? target[key as string] : () => undefined),
    }) as unknown as TaskDetailContext;
    const host = document.createElement("div");
    document.body.appendChild(host);
    render(renderTaskDetail(task, ctx), host);
    return host;
  }

  afterEach(() => document.body.querySelectorAll(":scope > div").forEach((d) => d.remove()));

  it("is offered for an adaptive task with the feature on — without a recommendation yet", () => {
    let calls = 0;
    const host = menu(true, TASK, () => { calls++; });
    const item = host.querySelector<HTMLElement>(".popup-menu-item.reanalyze");
    expect(item, "menu item").to.exist;
    item!.click();
    expect(calls).to.equal(1);
  });

  it("is not offered with the Adaptive feature off or for a task that does not adapt", () => {
    expect(menu(false, TASK, () => undefined).querySelector(".popup-menu-item.reanalyze")).to.equal(null);
    const plain = { ...TASK, adaptive_config: { enabled: false } } as unknown as MaintenanceTask;
    expect(menu(true, plain, () => undefined).querySelector(".popup-menu-item.reanalyze")).to.equal(null);
  });
});

describe("dashboard section strategy for an area (audit 2026-09-29)", () => {
  it("hands the card its area filter — an empty area no longer lists every task", async () => {
    const { SECTION_STRATEGIES } = await import("../maintenance-dashboard-strategy.js");
    const { hass, sent } = createMockHass({ handlers: { "maintenance_supporter/objects": () => ({ objects: [] }) } });
    const section = await SECTION_STRATEGIES["maintenance-supporter-section"].generate({ area_id: "kitchen" } as never, hass as never);
    const card = (section.cards as Array<Record<string, unknown>>).find((c) => c.type === "custom:maintenance-supporter-card")!;
    expect(card.filter_areas).to.deep.equal(["kitchen"]);
    expect(card.filter_objects).to.equal(undefined);
    expect(sent.some((m) => m.type === "maintenance_supporter/objects"), "no name lookup").to.equal(false);
  });
});

describe("task quick actions: postpone, snooze and notes (audit 2026-09-29)", () => {
  async function quickActions(over: Record<string, unknown> = {}) {
    await import("../components/task-quick-actions-dialog.js");
    const { invalidateSettingsCache } = await import("../helpers/settings-cache.js");
    invalidateSettingsCache();
    const task = {
      id: "t1", name: "Filter", type: "custom", schedule_type: "time_based", interval_days: 30, warning_days: 7,
      status: "ok", enabled: true, archived: false, is_done: false, days_until_due: 10, next_due: "2026-10-10",
      last_performed: null, trigger_active: false, times_performed: 0, total_cost: 0, average_duration: null,
      history: [], checklist: [], ...over,
    };
    const { hass, sent } = createMockHass({
      handlers: {
        "maintenance_supporter/object": () => ({ entry_id: "e1", object: { id: "o1", name: "Pump" }, tasks: [task] }),
        "maintenance_supporter/task/postpone": () => ({ success: true }),
        "maintenance_supporter/task/snooze": () => ({ success: true }),
      },
    });
    (hass as Record<string, unknown>).user = { id: "member", is_admin: false };
    const el = await fixture<HTMLElement & { openFor: (e: string, t: string) => Promise<void>; updateComplete: Promise<boolean> }>(html`
      <maintenance-task-quick-actions-dialog .hass=${hass}></maintenance-task-quick-actions-dialog>
    `);
    await el.openFor("e1", "t1");
    await el.updateComplete;
    return { el, sent, root: el.shadowRoot! };
  }

  it("offers Postpone to every household member and sends the chosen date", async () => {
    const { el, sent, root } = await quickActions();
    root.querySelector<HTMLElement>(".qa-postpone")!.click();
    await el.updateComplete;
    const confirm = root.querySelector<HTMLButtonElement>(".qa-postpone-confirm")!;
    expect(confirm.disabled, "no date yet").to.equal(true);
    const field = root.querySelector("ms-date-field")!;
    field.dispatchEvent(new CustomEvent("value-changed", { detail: { value: "2026-11-01" } }));
    await el.updateComplete;
    confirm.click();
    await new Promise((r) => setTimeout(r, 0));
    const msg = sent.find((m) => m.type === "maintenance_supporter/task/postpone");
    expect(msg?.until).to.equal("2026-11-01");
  });

  it("snoozes in one click", async () => {
    const { sent, root } = await quickActions();
    root.querySelector<HTMLElement>(".qa-snooze")!.click();
    await new Promise((r) => setTimeout(r, 0));
    expect(sent.some((m) => m.type === "maintenance_supporter/task/snooze")).to.equal(true);
  });

  it("offers neither for a task the server would refuse", async () => {
    for (const over of [{ archived: true }, { enabled: false }, { status: "paused" }]) {
      const { root } = await quickActions(over);
      expect(root.querySelector(".qa-postpone"), JSON.stringify(over)).to.equal(null);
      expect(root.querySelector(".qa-snooze"), JSON.stringify(over)).to.equal(null);
    }
  });

  it("renders the task notes the docs promise", async () => {
    const { root } = await quickActions({ notes: "Use **filter type B**" });
    expect(root.querySelector(".notes-body")?.textContent).to.contain("filter type B");
  });
});
