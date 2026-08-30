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

describe("settings: Battery Notes hint (#146 follow-up)", () => {
  async function mountWith(general: Record<string, unknown>) {
    const { hass } = createMockHass({
      handlers: {
        "maintenance_supporter/settings": () => ({
          ...DEFAULT_SETTINGS_RESPONSE,
          general: { ...DEFAULT_SETTINGS_RESPONSE.general, battery_low_percent: 20, ...general },
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

  it("names override devices as device links, capped with '+ n more'", async () => {
    const el = await mountWith({
      battery_notes: {
        default: 10, devices: 12, more: 2,
        overrides: [
          { name: "Front Door Lock", device_id: "dev1", threshold: 30 },
          { name: "Hallway Remote", device_id: null, threshold: 15 },
        ],
      },
    });
    const note = el.shadowRoot!.querySelector(".bn-note");
    expect(note, "hint rendered").to.exist;
    expect(note!.classList.contains("warn")).to.equal(false);
    const links = [...note!.querySelectorAll("a.bn-link")].map((a) => (a as HTMLAnchorElement).getAttribute("href"));
    expect(links).to.deep.equal([
      "/config/integrations/integration/battery_notes",
      "/config/devices/device/dev1",
    ]);
    expect(note!.textContent).to.contain("Front Door Lock");
    expect(note!.textContent).to.contain("Hallway Remote");
    expect(note!.textContent).to.contain("+ 2 more");
  });

  it("turns warn-toned when the Battery Notes default sits above the floor", async () => {
    const el = await mountWith({
      battery_low_percent: 5,
      battery_notes: { default: 10, devices: 3, overrides: [], more: 0 },
    });
    const note = el.shadowRoot!.querySelector(".bn-note");
    expect(note!.classList.contains("warn")).to.equal(true);
  });

  it("renders nothing without Battery Notes", async () => {
    const el = await mountWith({ battery_notes: null });
    expect(el.shadowRoot!.querySelector(".bn-note")).to.not.exist;
  });
});
