/**
 * Settings → Notifications → "Completion notifications" (#173 follow-up):
 * the select reflects the stored mode, defaults to off, and writes
 * `notify_completed` through global/update.
 */
import { expect, fixture, html } from "@open-wc/testing";
import "../components/settings-view.js";
import type { MaintenanceSettingsView } from "../components/settings-view";
import { DEFAULT_FEATURES, DEFAULT_SETTINGS_RESPONSE, createMockHass } from "./_test-utils.js";

describe("settings: completion notifications (#173 follow-up)", () => {
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
            notifications: { ...settings.notifications, ...("notify_completed" in s ? { completed: s.notify_completed } : {}) },
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

  const select = (el: MaintenanceSettingsView) => el.shadowRoot!.querySelector<HTMLSelectElement>("select.notify-completed")!;

  it("defaults to off and offers the three modes with their labels", async () => {
    const { el } = await mount();
    const s = select(el);
    expect(s.value).to.equal("off");
    expect([...s.options].map((o) => o.value)).to.deep.equal(["off", "automatic", "all"]);
    expect(s.textContent).to.contain("Automatic completions only").and.to.contain("All completions");
    expect(el.shadowRoot!.textContent).to.contain("Completion notifications");
  });

  it("reflects the stored mode and writes notify_completed on change", async () => {
    const { el, updates } = await mount({ completed: "automatic" });
    expect(select(el).value).to.equal("automatic");
    select(el).value = "all";
    select(el).dispatchEvent(new Event("change", { bubbles: true }));
    await new Promise((r) => setTimeout(r, 50));
    await el.updateComplete;
    expect(updates.some((u) => u.notify_completed === "all")).to.equal(true);
    expect(select(el).value).to.equal("all");
  });
});
