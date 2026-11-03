/**
 * Settings → Notifications → Title prefix (D#248): a phone that hears from
 * two Home Assistant instances could not tell their reminders apart. The
 * field shows the stored prefix, writes `notification_title_prefix` trimmed
 * on change, and suggests the home's name from Settings → System → General.
 */
import { expect, fixture, html } from "@open-wc/testing";
import "../components/settings-view.js";
import type { MaintenanceSettingsView } from "../components/settings-view";
import type { HomeAssistant } from "../types";
import { DEFAULT_FEATURES, DEFAULT_SETTINGS_RESPONSE, createMockHass } from "./_test-utils.js";

describe("settings: notification title prefix (D#248)", () => {
  async function mount(notifications: Record<string, unknown> = {}, locationName?: string) {
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
          if ("notification_title_prefix" in s) {
            settings = { ...settings, notifications: { ...settings.notifications, title_prefix: String(s.notification_title_prefix) } };
          }
          return settings;
        },
      },
    });
    const withHome = (locationName ? { ...hass, config: { location_name: locationName } } : hass) as unknown as HomeAssistant;
    const el = await fixture<MaintenanceSettingsView>(html`
      <maintenance-settings-view .hass=${withHome} .features=${DEFAULT_FEATURES}></maintenance-settings-view>
    `);
    await new Promise((r) => setTimeout(r, 50));
    await el.updateComplete;
    return { el, updates };
  }

  const field = (el: MaintenanceSettingsView) => el.shadowRoot!.querySelector<HTMLInputElement>("input.notify-title-prefix");
  const suggestions = (el: MaintenanceSettingsView) =>
    [...el.shadowRoot!.querySelectorAll<HTMLOptionElement>("datalist#ms-title-prefix option")].map((o) => o.value);

  it("sits with the title style and shows the stored prefix", async () => {
    const { el } = await mount({ title_prefix: "Rental" });
    const input = field(el);
    expect(input !== null, "the field is there").to.equal(true);
    expect(input!.value).to.equal("Rental");
    expect(input!.maxLength).to.equal(40);
    expect(input!.closest(".setting-row")!.textContent).to.contain("Title prefix");
    const style = el.shadowRoot!.querySelector(".notify-title-style");
    expect(style !== null && !!(style.compareDocumentPosition(input!) & Node.DOCUMENT_POSITION_FOLLOWING), "right after the title style").to.equal(true);
  });

  it("writes notification_title_prefix trimmed, and an emptied field clears it", async () => {
    const { el, updates } = await mount();
    const input = field(el)!;
    expect(input.value).to.equal("");
    input.value = "  Lake House  ";
    input.dispatchEvent(new Event("change"));
    await new Promise((r) => setTimeout(r, 20));
    await el.updateComplete;
    expect(updates.at(-1)).to.deep.equal({ notification_title_prefix: "Lake House" });
    input.value = "";
    input.dispatchEvent(new Event("change"));
    await new Promise((r) => setTimeout(r, 20));
    expect(updates.at(-1)).to.deep.equal({ notification_title_prefix: "" });
  });

  it("suggests the home's name, and nothing when HA has none", async () => {
    const { el } = await mount({}, "Lake House");
    expect(field(el)!.getAttribute("list")).to.equal("ms-title-prefix");
    expect(suggestions(el)).to.deep.equal(["Lake House"]);
    const { el: bare } = await mount();
    expect(suggestions(bare)).to.deep.equal([]);
  });
});
