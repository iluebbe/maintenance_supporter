/**
 * Lit component tests for the notify-service picker (datalist) in the general
 * section of <maintenance-settings-view>.
 *
 * The picker lists registered `notify.*` services from `hass.services` as a
 * <datalist> — suggestions while staying a free-text input (custom /
 * lazily-registered values keep working), excluding the generic
 * `send_message` entity-action. See settings-view.ts::_renderGeneral.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/settings-view.js";
import type { MaintenanceSettingsView } from "../components/settings-view";
import {
  DEFAULT_FEATURES,
  DEFAULT_SETTINGS_RESPONSE,
  createMockHass,
} from "./_test-utils.js";

async function mount(
  services?: Record<string, Record<string, unknown>>,
): Promise<MaintenanceSettingsView> {
  const { hass } = createMockHass({
    settingsResponse: {
      ...DEFAULT_SETTINGS_RESPONSE,
      general: {
        ...DEFAULT_SETTINGS_RESPONSE.general,
        notifications_enabled: true,
        notify_service: "notify.mobile_app_phone",
      },
    },
    services,
  });
  const el = await fixture<MaintenanceSettingsView>(html`
    <maintenance-settings-view .hass=${hass} .features=${DEFAULT_FEATURES}></maintenance-settings-view>
  `);
  // _loadSettings is kicked off by updated() after first render.
  await new Promise((r) => setTimeout(r, 50));
  await el.updateComplete;
  return el;
}

describe("settings-view notify-service picker", () => {
  it("lists registered notify services as datalist options, excluding send_message", async () => {
    const el = await mount({
      notify: {
        mobile_app_phone: {}, // mobile_app direct
        all_devices_group: {}, // a notify group
        send_message: {}, // generic entity action — must be excluded
      },
    });

    const list = el.shadowRoot?.querySelector<HTMLDataListElement>("#ms-notify-services");
    expect(list, "datalist present").to.exist;
    const values = Array.from(list!.querySelectorAll("option")).map((o) => o.value);
    expect(values).to.include("notify.mobile_app_phone");
    expect(values).to.include("notify.all_devices_group");
    expect(values, "generic send_message action excluded").to.not.include("notify.send_message");

    // The field stays a free-text input wired to the datalist (custom values
    // still work for lazily-registered services).
    const input = el.shadowRoot?.querySelector<HTMLInputElement>(
      'input[list="ms-notify-services"]',
    );
    expect(input, "notify input wired to datalist").to.exist;
    expect(input!.value).to.equal("notify.mobile_app_phone");
  });

  it("degrades to an empty datalist when no notify services are registered", async () => {
    const el = await mount(undefined); // hass.services undefined

    const list = el.shadowRoot?.querySelector<HTMLDataListElement>("#ms-notify-services");
    expect(list, "datalist still present").to.exist;
    expect(list!.querySelectorAll("option").length, "no options").to.equal(0);
    // Free-text input still renders so notifications can be configured.
    const input = el.shadowRoot?.querySelector<HTMLInputElement>(
      'input[list="ms-notify-services"]',
    );
    expect(input, "notify input still present").to.exist;
  });
});
