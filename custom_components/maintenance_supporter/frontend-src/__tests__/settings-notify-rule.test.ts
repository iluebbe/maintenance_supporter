/**
 * Settings → Notifications → "Your own notification rule" (#165): the
 * event-only toggle writes `notify_event_only`, the extra-data textarea
 * writes `notify_extra_data` on change, and both reflect the stored values.
 */
import { expect, fixture, html } from "@open-wc/testing";
import "../components/settings-view.js";
import type { MaintenanceSettingsView } from "../components/settings-view";
import { DEFAULT_FEATURES, DEFAULT_SETTINGS_RESPONSE, createMockHass } from "./_test-utils.js";

describe("settings: your own notification rule (#165)", () => {
  async function mount(notifications: Record<string, unknown> = {}) {
    const updates: Record<string, unknown>[] = [];
    let settings = {
      ...DEFAULT_SETTINGS_RESPONSE,
      general: { ...DEFAULT_SETTINGS_RESPONSE.general, notifications_enabled: true },
      notifications: { ...DEFAULT_SETTINGS_RESPONSE.notifications, ...notifications },
    };
    const { hass } = createMockHass({
      handlers: {
        "maintenance_supporter/settings": () => settings,
        "maintenance_supporter/global/update": (msg) => {
          const s = msg.settings as Record<string, unknown>;
          updates.push(s);
          settings = {
            ...settings,
            notifications: {
              ...settings.notifications,
              ...("notify_event_only" in s ? { event_only: s.notify_event_only } : {}),
              ...("notify_extra_data" in s ? { extra_data: s.notify_extra_data } : {}),
            },
          };
          return settings;
        },
      },
    });
    const el = await fixture<MaintenanceSettingsView>(html`
      <maintenance-settings-view .hass=${hass} .features=${DEFAULT_FEATURES}></maintenance-settings-view>
    `);
    await new Promise((r) => setTimeout(r, 50));
    await el.updateComplete;
    return { el, updates };
  }

  const eventOnlyBox = (el: MaintenanceSettingsView) =>
    [...el.shadowRoot!.querySelectorAll<HTMLLabelElement>(".setting-row")]
      .find((r) => /Only fire the event/.test(r.textContent || ""))!.querySelector<HTMLInputElement>("input")!;
  const textarea = (el: MaintenanceSettingsView) => el.shadowRoot!.querySelector<HTMLTextAreaElement>("textarea.notify-extra")!;

  it("renders both controls under their own heading with the stored values", async () => {
    const { el } = await mount({ event_only: true, extra_data: '{"category": "maintenance"}' });
    expect(el.shadowRoot!.textContent).to.contain("Your own notification rule");
    expect(el.shadowRoot!.textContent).to.contain("maintenance_supporter_notification");
    expect(eventOnlyBox(el).checked).to.equal(true);
    expect(textarea(el).value).to.equal('{"category": "maintenance"}');
    expect(textarea(el).maxLength).to.equal(2000);
  });

  it("writes notify_event_only and notify_extra_data through global/update", async () => {
    const { el, updates } = await mount();
    expect(eventOnlyBox(el).checked).to.equal(false);
    eventOnlyBox(el).click();
    await new Promise((r) => setTimeout(r, 20));
    await el.updateComplete;
    expect(updates.at(-1)).to.deep.equal({ notify_event_only: true });
    const ta = textarea(el);
    ta.value = "category: maintenance";
    ta.dispatchEvent(new Event("change"));
    await new Promise((r) => setTimeout(r, 20));
    await el.updateComplete;
    expect(updates.at(-1)).to.deep.equal({ notify_extra_data: "category: maintenance" });
    expect(textarea(el).value).to.equal("category: maintenance");
  });
  it("typing survives a re-render (#176: no live() on the textarea)", async () => {
    const { el, updates } = await mount({ extra_data: "" });
    const ta = textarea(el);
    ta.value = '{"category": "ma';
    ta.dispatchEvent(new Event("input"));
    // A hass update re-renders the view — the half-typed text must stay.
    el.hass = { ...el.hass } as typeof el.hass;
    await el.updateComplete;
    el.requestUpdate();
    await el.updateComplete;
    expect(textarea(el).value).to.equal('{"category": "ma');
    expect(updates).to.deep.equal([]);
  });
});
