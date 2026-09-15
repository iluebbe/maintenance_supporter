/**
 * #181: Settings → Battery → "Record a replacement automatically when a low
 * battery recovers" — a plain boolean row under the recovery threshold that
 * writes `battery_auto_record_recovery` through global/update.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/settings-view.js";
import type { MaintenanceSettingsView } from "../components/settings-view";
import { DEFAULT_FEATURES, DEFAULT_SETTINGS_RESPONSE, createMockHass, type SentMessage } from "./_test-utils.js";

describe("settings: battery auto-record on recovery (#181)", () => {
  async function mount(enabled: boolean) {
    const settings = {
      ...DEFAULT_SETTINGS_RESPONSE,
      general: { ...DEFAULT_SETTINGS_RESPONSE.general, battery_auto_record_recovery: enabled },
    };
    const { hass, sent } = createMockHass({
      handlers: {
        "maintenance_supporter/settings": () => settings,
        "maintenance_supporter/global/update": (msg: any) => ({
          ...settings,
          general: { ...settings.general, ...msg.settings },
        }),
      },
    });
    const el = await fixture<MaintenanceSettingsView>(html`
      <maintenance-settings-view .hass=${hass} .features=${DEFAULT_FEATURES}></maintenance-settings-view>
    `);
    await new Promise((r) => setTimeout(r, 50));
    await el.updateComplete;
    return { el, sent: sent as SentMessage[] };
  }

  it("renders the toggle unchecked by default and checked when enabled", async () => {
    const off = await mount(false);
    const boxOff = off.el.shadowRoot!.querySelector<HTMLInputElement>("input.auto-record-recovery");
    expect(boxOff, "toggle rendered").to.exist;
    expect(boxOff!.checked).to.equal(false);
    const on = await mount(true);
    expect(on.el.shadowRoot!.querySelector<HTMLInputElement>("input.auto-record-recovery")!.checked).to.equal(true);
  });

  it("writes battery_auto_record_recovery on change", async () => {
    const { el, sent } = await mount(false);
    const box = el.shadowRoot!.querySelector<HTMLInputElement>("input.auto-record-recovery")!;
    box.checked = true;
    box.dispatchEvent(new Event("change"));
    await new Promise((r) => setTimeout(r, 30));
    const msg = sent.find((m) => m.type === "maintenance_supporter/global/update") as any;
    expect(msg, "update sent").to.exist;
    expect(msg.settings).to.deep.equal({ battery_auto_record_recovery: true });
  });
});
