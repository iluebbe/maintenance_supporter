/**
 * #251: Settings → Notifications → Notification language. "auto" (the
 * default) names Home Assistant's own language; the others are the
 * notification tables' languages by their own names. A change writes
 * `notification_language`.
 */
import { expect, fixture, html } from "@open-wc/testing";
import "../components/settings-view.js";
import type { MaintenanceSettingsView } from "../components/settings-view";
import type { HomeAssistant } from "../types";
import { NOTIFICATION_LANGUAGES } from "../helpers/notification-languages.js";
import { DEFAULT_FEATURES, DEFAULT_SETTINGS_RESPONSE, createMockHass } from "./_test-utils.js";

describe("settings: notification language (#251)", () => {
  async function mount(notifications: Record<string, unknown> = {}, haLanguage = "de") {
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
          if ("notification_language" in s) {
            settings = { ...settings, notifications: { ...settings.notifications, language: String(s.notification_language) } };
          }
          return settings;
        },
      },
    });
    const withLang = { ...hass, config: { language: haLanguage } } as unknown as HomeAssistant;
    const el = await fixture<MaintenanceSettingsView>(html`
      <maintenance-settings-view .hass=${withLang} .features=${DEFAULT_FEATURES}></maintenance-settings-view>
    `);
    await new Promise((r) => setTimeout(r, 50));
    await el.updateComplete;
    return { el, updates };
  }

  const select = (el: MaintenanceSettingsView) => el.shadowRoot!.querySelector<HTMLSelectElement>("select.notify-language");

  it("defaults to auto, named after Home Assistant's language, then every table language", async () => {
    const { el } = await mount({}, "pt-BR");
    const s = select(el);
    expect(s !== null, "the select is there").to.equal(true);
    expect(s!.value).to.equal("auto");
    const options = [...s!.options];
    expect(options[0].textContent).to.contain("Português (Brasil)");
    expect(options.slice(1).map((o) => o.value)).to.deep.equal(NOTIFICATION_LANGUAGES.map(([code]) => code));
    expect(options.find((o) => o.value === "ja")!.textContent).to.equal("日本語");
    expect(el.shadowRoot!.textContent).to.contain("Notification language");
  });

  it("reflects the stored language and writes notification_language on change", async () => {
    const { el, updates } = await mount({ language: "fr" });
    expect(select(el)!.value).to.equal("fr");
    select(el)!.value = "de";
    select(el)!.dispatchEvent(new Event("change", { bubbles: true }));
    await new Promise((r) => setTimeout(r, 50));
    await el.updateComplete;
    expect(updates.some((u) => u.notification_language === "de")).to.equal(true);
    expect(select(el)!.value).to.equal("de");
  });
});
