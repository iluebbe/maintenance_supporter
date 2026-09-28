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
