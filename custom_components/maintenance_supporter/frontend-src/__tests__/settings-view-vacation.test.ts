/**
 * Lit component tests for the vacation section of <maintenance-settings-view>.
 *
 * Mounts the component with a mocked `hass` (just a connection stub that
 * captures sendMessagePromise calls) and asserts on rendered output +
 * outgoing WS messages. No HA shell, no shadow-DOM-deep-piercing —
 * runs in real Chromium via @web/test-runner.
 */

import { expect, fixture, html, oneEvent } from "@open-wc/testing";
import "../components/settings-view.js";
import type { MaintenanceSettingsView } from "../components/settings-view";
import {
  DEFAULT_FEATURES,
  DEFAULT_SETTINGS_RESPONSE,
  createMockHass,
} from "./_test-utils.js";

function mockHass(opts: {
  vacationActive?: boolean;
  vacationStart?: string | null;
  vacationEnd?: string | null;
  exemptIds?: string[];
} = {}) {
  const settingsResponse = {
    ...DEFAULT_SETTINGS_RESPONSE,
    vacation: {
      ...DEFAULT_SETTINGS_RESPONSE.vacation,
      enabled: opts.vacationActive ?? false,
      start: opts.vacationStart ?? null,
      end: opts.vacationEnd ?? null,
      exempt_task_ids: opts.exemptIds ?? [],
      is_active: opts.vacationActive ?? false,
      window_end: opts.vacationEnd ?? null,
    },
  };

  return createMockHass({
    settingsResponse,
    handlers: {
      "maintenance_supporter/vacation/update": (msg) => ({
        // Echo the patch merged onto current vacation state — what the
        // real backend does.
        ...settingsResponse.vacation,
        ...(msg.enabled !== undefined ? { enabled: msg.enabled, is_active: msg.enabled } : {}),
        ...(msg.start !== undefined ? { start: msg.start } : {}),
        ...(msg.end !== undefined ? { end: msg.end } : {}),
        ...(msg.buffer_days !== undefined ? { buffer_days: msg.buffer_days } : {}),
        ...(msg.exempt_task_ids !== undefined ? { exempt_task_ids: msg.exempt_task_ids } : {}),
      }),
      "maintenance_supporter/vacation/end_now": () => ({
        ...settingsResponse.vacation, enabled: false, is_active: false,
      }),
      "maintenance_supporter/vacation/preview": () => ({ rows: [], window_end: null }),
    },
  });
}

async function mount(opts = {}) {
  const { hass, sent } = mockHass(opts);
  const el = await fixture<MaintenanceSettingsView>(html`
    <maintenance-settings-view .hass=${hass} .features=${DEFAULT_FEATURES}></maintenance-settings-view>
  `);
  // Wait for _loadSettings to complete — it's kicked off by updated()
  // which fires after first render.
  await new Promise((r) => setTimeout(r, 50));
  await el.updateComplete;
  return { el, sent };
}

function vacationSection(el: MaintenanceSettingsView): HTMLElement | null {
  return el.shadowRoot?.querySelector(".vacation-section") || null;
}

describe("settings-view vacation section", () => {
  it("renders the vacation section with title and disabled toggle by default", async () => {
    const { el } = await mount();
    const section = vacationSection(el);
    expect(section, "vacation section present").to.exist;
    const h3 = section!.querySelector("h3");
    expect(h3?.textContent || "").to.match(/vacation|urlaub/i);
    const toggle = section!.querySelector<HTMLInputElement>(".vac-toggle input");
    expect(toggle, "enable toggle present").to.exist;
    expect(toggle!.checked, "toggle off by default").to.be.false;
  });

  it("hydrates dates from settings response", async () => {
    const { el } = await mount({
      vacationStart: "2099-06-10",
      vacationEnd: "2099-06-20",
    });
    const dateInputs = vacationSection(el)!.querySelectorAll<HTMLInputElement>(".vac-grid input[type=date]");
    expect(dateInputs.length, "two date inputs").to.equal(2);
    expect(dateInputs[0].value).to.equal("2099-06-10");
    expect(dateInputs[1].value).to.equal("2099-06-20");
  });

  it("shows the active badge when vacation.is_active is true", async () => {
    const { el } = await mount({
      vacationActive: true,
      vacationStart: "2099-06-10",
      vacationEnd: "2099-06-20",
    });
    const badge = vacationSection(el)!.querySelector(".vac-badge.active");
    expect(badge, "active badge rendered").to.exist;
    const endNow = vacationSection(el)!.querySelector(".vac-end-now");
    expect(endNow, "end-now button rendered").to.exist;
  });

  it("dispatches vacation/update when the enable toggle is clicked", async () => {
    const { el, sent } = await mount();
    const toggle = vacationSection(el)!.querySelector<HTMLInputElement>(".vac-toggle input")!;
    toggle.checked = true;
    toggle.dispatchEvent(new Event("change"));
    await new Promise((r) => setTimeout(r, 30));
    const update = sent.find(m => m.type === "maintenance_supporter/vacation/update");
    expect(update, "update message sent").to.exist;
    expect(update!.enabled, "enabled=true in payload").to.equal(true);
  });

  it("dispatches vacation/update with new buffer_days when number changes", async () => {
    const { el, sent } = await mount();
    const buffer = vacationSection(el)!.querySelectorAll<HTMLInputElement>(".vac-grid input[type=number]")[0];
    expect(buffer, "buffer input present").to.exist;
    buffer.value = "7";
    buffer.dispatchEvent(new Event("change"));
    await new Promise((r) => setTimeout(r, 30));
    const update = sent.find(m => m.type === "maintenance_supporter/vacation/update" && m.buffer_days === 7);
    expect(update, "update with buffer_days=7 sent").to.exist;
  });

  it("emits settings-changed when vacation toggles (so the panel re-evaluates the Vacation tab)", async () => {
    const { el } = await mount();
    const toggle = vacationSection(el)!.querySelector<HTMLInputElement>(".vac-toggle input")!;
    toggle.checked = true;
    const evtPromise = oneEvent(el, "settings-changed");
    toggle.dispatchEvent(new Event("change"));
    const evt = await evtPromise;
    expect(evt.type).to.equal("settings-changed");
  });

  it("does not show end-now button when vacation is disabled and not stale", async () => {
    const { el } = await mount();
    const endNow = vacationSection(el)!.querySelector(".vac-end-now");
    expect(endNow, "no end-now in default state").to.not.exist;
  });
});
