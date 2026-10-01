/**
 * Settings → Notifications → "Snooze duration (hours)" (discussion #193).
 *
 * Every Snooze uses this duration — the task menu, a card, voice, the phone's
 * Snooze button — but the field only rendered while the phone's Snooze
 * action button was switched on, indented under it, so somebody snoozing from
 * the panel could not find where the four hours came from. It now sits with
 * the other reminder limits, always shown, and still writes
 * `snooze_duration_hours`.
 */
import { expect, fixture, html } from "@open-wc/testing";
import "../components/settings-view.js";
import type { MaintenanceSettingsView } from "../components/settings-view";
import { DEFAULT_FEATURES, DEFAULT_SETTINGS_RESPONSE, createMockHass } from "./_test-utils.js";

describe("settings: snooze duration (D#193)", () => {
  async function mount(actions: Record<string, unknown> = {}) {
    const updates: Record<string, unknown>[] = [];
    const settings = {
      ...DEFAULT_SETTINGS_RESPONSE,
      general: { ...DEFAULT_SETTINGS_RESPONSE.general, notifications_enabled: true },
      actions: { ...DEFAULT_SETTINGS_RESPONSE.actions, ...actions },
    };
    const { hass } = createMockHass({
      handlers: {
        "maintenance_supporter/settings": () => settings,
        "maintenance_supporter/global/update": (msg) => {
          updates.push(msg.settings as Record<string, unknown>);
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

  const row = (el: MaintenanceSettingsView) => el.shadowRoot!.querySelector<HTMLElement>(".setting-row.snooze-duration");

  it("is there with the phone's Snooze button off, as a setting of its own", async () => {
    const { el } = await mount({ snooze_enabled: false, snooze_duration_hours: 6 });
    const r = row(el);
    expect(r, "the snooze duration row").to.exist;
    expect(r!.classList.contains("sub-row"), "not indented under the action button").to.equal(false);
    expect(r!.textContent).to.contain("Snooze duration (hours)");
    expect(r!.querySelector<HTMLInputElement>("input[type=number]")!.value).to.equal("6");
    expect(r!.nextElementSibling!.textContent, "the hint says every Snooze uses it").to.contain("task menu");
  });

  it("appears once, also with the Snooze button on", async () => {
    const { el } = await mount({ snooze_enabled: true });
    const labels = [...el.shadowRoot!.querySelectorAll(".setting-row")].filter((r) =>
      (r.textContent || "").includes("Snooze duration (hours)"),
    );
    expect(labels).to.have.lengthOf(1);
  });

  it("writes snooze_duration_hours", async () => {
    const { el, updates } = await mount();
    const input = row(el)!.querySelector<HTMLInputElement>("input[type=number]")!;
    input.value = "12";
    input.dispatchEvent(new Event("change", { bubbles: true }));
    await new Promise((r) => setTimeout(r, 50));
    expect(updates.some((u) => u.snooze_duration_hours === 12)).to.equal(true);
  });
});
