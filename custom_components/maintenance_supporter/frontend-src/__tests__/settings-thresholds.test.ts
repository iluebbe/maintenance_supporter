/**
 * Settings → General: the household "low" floors (#146) — consumable
 * threshold and battery-low percent — render with their values and write
 * through global/update; out-of-range input is not sent.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/settings-view.js";
import type { MaintenanceSettingsView } from "../components/settings-view";
import { DEFAULT_FEATURES, DEFAULT_SETTINGS_RESPONSE, createMockHass } from "./_test-utils.js";

describe("settings: default thresholds (#146)", () => {
  it("renders both inputs and saves valid values only", async () => {
    const updates: Record<string, unknown>[] = [];
    const { hass } = createMockHass({
      handlers: {
        "maintenance_supporter/settings": () => ({
          ...DEFAULT_SETTINGS_RESPONSE,
          general: { ...DEFAULT_SETTINGS_RESPONSE.general, default_consumable_threshold: 10, battery_low_percent: 20 },
        }),
        "maintenance_supporter/global/update": (msg) => {
          updates.push(msg.settings as Record<string, unknown>);
          return { ...DEFAULT_SETTINGS_RESPONSE, general: { ...DEFAULT_SETTINGS_RESPONSE.general, ...(msg.settings as object) } };
        },
      },
    });
    const el = await fixture<MaintenanceSettingsView>(html`
      <maintenance-settings-view .hass=${hass} .features=${DEFAULT_FEATURES}></maintenance-settings-view>
    `);
    await new Promise((r) => setTimeout(r, 50));
    await el.updateComplete;

    const inputs = [...el.shadowRoot!.querySelectorAll<HTMLInputElement>('input[type="number"][max="90"]')];
    expect(inputs.length, "two percent inputs").to.equal(2);
    expect(inputs.map((i) => i.value)).to.deep.equal(["10", "20"]);

    const set = async (input: HTMLInputElement, v: string) => {
      input.value = v;
      input.dispatchEvent(new Event("change"));
      await new Promise((r) => setTimeout(r, 20));
    };
    await set(inputs[0], "5");
    await set(inputs[1], "35");
    await set(inputs[0], "0"); // below range → ignored
    await set(inputs[1], "95"); // above range → ignored
    expect(updates).to.deep.equal([{ default_consumable_threshold: 5 }, { battery_low_percent: 35 }]);
  });
});
