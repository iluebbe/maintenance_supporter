/**
 * Settings → General: the household "low" floors (#146) — consumable
 * threshold and battery-low percent — render with their values and write
 * through global/update; out-of-range input is not sent.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/settings-view.js";
import type { MaintenanceSettingsView } from "../components/settings-view";
import { DEFAULT_FEATURES, DEFAULT_SETTINGS_RESPONSE, createMockHass } from "./_test-utils.js";
import { setLocale } from "../styles";
import ja from "../locales/ja.json";

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

  it("names an out-of-range entry in a toast and snaps the field back (bug review 2026-09-04)", async () => {
    const updates: Record<string, unknown>[] = [];
    let general: Record<string, unknown> = { ...DEFAULT_SETTINGS_RESPONSE.general, default_consumable_threshold: 10, battery_low_percent: 20, default_warning_days: 7 };
    const { hass } = createMockHass({
      handlers: {
        "maintenance_supporter/settings": () => ({ ...DEFAULT_SETTINGS_RESPONSE, general }),
        "maintenance_supporter/global/update": (msg) => {
          const s = msg.settings as Record<string, unknown>;
          updates.push(s);
          if ("battery_low_percent" in s) throw new Error("server says no");
          general = { ...general, ...s };
          return { ...DEFAULT_SETTINGS_RESPONSE, general };
        },
      },
    });
    const el = await fixture<MaintenanceSettingsView>(html`
      <maintenance-settings-view .hass=${hass} .features=${DEFAULT_FEATURES}></maintenance-settings-view>
    `);
    await new Promise((r) => setTimeout(r, 50));
    await el.updateComplete;
    const sr = el.shadowRoot!;
    const toast = () => sr.querySelector(".settings-toast")?.textContent?.trim() ?? "";
    const set = async (input: HTMLInputElement, v: string) => {
      input.value = v;
      input.dispatchEvent(new Event("change"));
      await new Promise((r) => setTimeout(r, 20));
      await el.updateComplete;
    };

    const [consumable, battery] = [...sr.querySelectorAll<HTMLInputElement>('input[type="number"][max="90"]')];
    const warning = sr.querySelector<HTMLInputElement>('input[type="number"][max="365"]')!;

    await set(consumable, "95");
    expect(updates, "nothing sent").to.deep.equal([]);
    expect(toast()).to.equal("Value must be between 1 and 90");
    expect(consumable.value, "field snapped back").to.equal("10");

    await set(warning, "400");
    expect(toast()).to.equal("Value must be between 0 and 365");
    expect(warning.value).to.equal("7");

    await set(consumable, "abc");
    expect(consumable.value, "non-numeric entry snaps back too").to.equal("10");

    // A server reject snaps back as well (the value was in range).
    await set(battery, "40");
    expect(updates).to.deep.equal([{ battery_low_percent: 40 }]);
    expect(battery.value, "rejected value not left in the field").to.equal("20");
  });
});

describe("settings: Battery Notes hint (#146 follow-up)", () => {
  async function mountWith(general: Record<string, unknown>, language = "en") {
    const { hass } = createMockHass({
      language,
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

  it("links only the integration name — also behind the fullwidth colon of ja/zh", async () => {
    // Bug review 2026-09-04: the ASCII-only split linked the whole Japanese
    // sentence and appended its last character a second time.
    setLocale("ja", ja as Record<string, string>);
    const bn = { default: 10, devices: 3, overrides: [], more: 0 };
    const en = (await mountWith({ battery_notes: bn })).shadowRoot!.querySelector(".bn-note")!;
    expect(en.querySelector("a.bn-link")!.textContent).to.equal("Battery Notes");
    expect(en.textContent!.replace(/\s+/g, " ")).to.contain("Battery Notes: 10 % for 3 batteries");

    const jp = (await mountWith({ battery_notes: bn }, "ja")).shadowRoot!.querySelector(".bn-note")!;
    expect(jp.querySelector("a.bn-link")!.textContent).to.equal("Battery Notes");
    const text = jp.textContent!.replace(/\s+/g, " ");
    expect(text).to.contain("Battery Notes：3 個の電池に 10 %");
    expect(text, "last character not duplicated").to.not.contain("10 %%");
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
