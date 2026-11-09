/**
 * Settings → Notifications → "Notification language" (#251): the select shows
 * the system option plus the native language names, reflects the stored value
 * and writes `notify_language` through global/update.
 */
import { expect, fixture, html } from "@open-wc/testing";
import "../components/settings-view.js";
import type { MaintenanceSettingsView } from "../components/settings-view";
import { DEFAULT_FEATURES, DEFAULT_SETTINGS_RESPONSE, createMockHass } from "./_test-utils.js";

const LANGUAGE_OPTIONS = [
  { value: "de", label: "Deutsch" },
  { value: "fr", label: "Français" },
];

describe("settings: notification language (#251)", () => {
  async function mount(notifications: Record<string, unknown> = {}) {
    const updates: Record<string, unknown>[] = [];
    let settings = {
      ...DEFAULT_SETTINGS_RESPONSE,
      general: { ...DEFAULT_SETTINGS_RESPONSE.general, notifications_enabled: true },
      notifications: {
        ...DEFAULT_SETTINGS_RESPONSE.notifications,
        language_options: LANGUAGE_OPTIONS,
        ...notifications,
      } as typeof DEFAULT_SETTINGS_RESPONSE.notifications,
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
              ...("notify_language" in s ? { notify_language: s.notify_language as string } : {}),
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

  const select = (el: MaintenanceSettingsView) =>
    el.shadowRoot!.querySelector<HTMLSelectElement>("select.notify-language")!;

  it("offers the system option and the native language names", async () => {
    const { el } = await mount();
    const s = select(el);
    expect(s.value).to.equal("");
    expect([...s.options].map((o) => o.value)).to.deep.equal(["", "de", "fr"]);
    expect(s.textContent).to.contain("System language").and.to.contain("Deutsch").and.to.contain("Français");
    expect(el.shadowRoot!.textContent).to.contain("Notification language");
  });

  it("reflects the stored language and writes notify_language on change", async () => {
    const { el, updates } = await mount({ notify_language: "de" });
    expect(select(el).value).to.equal("de");
    select(el).value = "fr";
    select(el).dispatchEvent(new Event("change", { bubbles: true }));
    await new Promise((r) => setTimeout(r, 50));
    await el.updateComplete;
    expect(updates.some((u) => u.notify_language === "fr")).to.equal(true);
    expect(select(el).value).to.equal("fr");
  });
});
