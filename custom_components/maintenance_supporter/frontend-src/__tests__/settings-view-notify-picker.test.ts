/**
 * Lit component tests for the notify-target picker (datalist) in the general
 * section of <maintenance-settings-view>.
 *
 * The pickable-target LIST is computed server-side by build_notify_targets and
 * arrives as `settings.general.notify_targets` (merging legacy notify services +
 * notify entities, minus the generic send_message, plus the saved value). The
 * panel's only job is to render that list into a <datalist> while keeping the
 * input free-text. The merge logic itself is covered by the Python tests for
 * build_notify_targets — here we only assert the panel mirrors what it's given.
 * See settings-view.ts::_renderGeneral.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/settings-view.js";
import type { MaintenanceSettingsView } from "../components/settings-view";
import {
  DEFAULT_FEATURES,
  DEFAULT_SETTINGS_RESPONSE,
  createMockHass,
} from "./_test-utils.js";

async function mount(notifyTargets?: string[]): Promise<MaintenanceSettingsView> {
  const { hass } = createMockHass({
    settingsResponse: {
      ...DEFAULT_SETTINGS_RESPONSE,
      general: {
        ...DEFAULT_SETTINGS_RESPONSE.general,
        notifications_enabled: true,
        notify_service: "notify.mobile_app_phone",
        ...(notifyTargets !== undefined ? { notify_targets: notifyTargets } : {}),
      },
    },
  });
  const el = await fixture<MaintenanceSettingsView>(html`
    <maintenance-settings-view .hass=${hass} .features=${DEFAULT_FEATURES}></maintenance-settings-view>
  `);
  // _loadSettings is kicked off by updated() after first render.
  await new Promise((r) => setTimeout(r, 50));
  await el.updateComplete;
  return el;
}

function options(el: MaintenanceSettingsView): string[] {
  const list = el.shadowRoot?.querySelector<HTMLDataListElement>("#ms-notify-services");
  return Array.from(list?.querySelectorAll("option") ?? []).map((o) => o.value);
}

describe("settings-view notify-target picker", () => {
  it("renders the server-provided notify_targets verbatim as datalist options", async () => {
    const el = await mount([
      "notify.mobile_app_phone",
      "notify.all_devices_group",
      "notify.file",
    ]);

    const opts = options(el);
    expect(opts).to.include("notify.mobile_app_phone");
    expect(opts).to.include("notify.all_devices_group");
    expect(opts).to.include("notify.file");
    expect(opts).to.have.lengthOf(3);
  });

  it("degrades to an empty datalist when no notify targets are provided", async () => {
    const el = await mount([]);
    const list = el.shadowRoot?.querySelector<HTMLDataListElement>("#ms-notify-services");
    expect(list, "datalist still present").to.exist;
    expect(list!.querySelectorAll("option").length, "no options").to.equal(0);
    // Free-text input still renders so notifications can be configured.
    const input = el.shadowRoot?.querySelector<HTMLInputElement>(
      'input[list="ms-notify-services"]',
    );
    expect(input, "free-text input still present").to.exist;
  });

  it("degrades gracefully when an older backend omits notify_targets", async () => {
    // notify_targets absent entirely (undefined) → no options, no crash.
    const { hass } = createMockHass({
      settingsResponse: {
        ...DEFAULT_SETTINGS_RESPONSE,
        general: {
          default_warning_days: 7,
          notifications_enabled: true,
          notify_service: "notify.mobile_app_phone",
          panel_enabled: false,
          // notify_targets deliberately omitted
        } as unknown as (typeof DEFAULT_SETTINGS_RESPONSE)["general"],
      },
    });
    const el = await fixture<MaintenanceSettingsView>(html`
      <maintenance-settings-view .hass=${hass} .features=${DEFAULT_FEATURES}></maintenance-settings-view>
    `);
    await new Promise((r) => setTimeout(r, 50));
    await el.updateComplete;
    expect(options(el), "no options when omitted").to.have.lengthOf(0);
  });
});
