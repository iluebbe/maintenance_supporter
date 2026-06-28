/**
 * Lit component tests for the notify-target picker (datalist) in the general
 * section of <maintenance-settings-view>.
 *
 * The picker merges legacy notify *services* (`hass.services.notify` — groups,
 * mobile_app legacy) with notify *entities* (`hass.states` notify.* — the newer
 * model, where many single devices live) as <datalist> suggestions, excluding
 * the generic `send_message` action, while staying a free-text input.
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

async function mount(
  services?: Record<string, Record<string, unknown>>,
  states?: Record<string, unknown>,
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
    states,
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
  it("merges notify services and entities, excluding send_message + other domains", async () => {
    const el = await mount(
      {
        notify: {
          mobile_app_phone: {}, // legacy service (also an entity below)
          all_devices_group: {}, // a notify group (service)
          send_message: {}, // generic action — must be excluded
        },
      },
      {
        "notify.mobile_app_phone": { entity_id: "notify.mobile_app_phone" }, // dupe of service
        "notify.file": { entity_id: "notify.file" }, // entity-only device
        "light.kitchen": { entity_id: "light.kitchen" }, // unrelated domain
      },
    );

    const opts = options(el);
    expect(opts).to.include("notify.mobile_app_phone"); // service
    expect(opts).to.include("notify.all_devices_group"); // group service
    expect(opts).to.include("notify.file"); // entity-only device — the fix
    expect(opts, "generic action excluded").to.not.include("notify.send_message");
    expect(opts, "other domains ignored").to.not.include("light.kitchen");
    // Deduped: a target that is both a service and an entity appears once.
    expect(opts.filter((o) => o === "notify.mobile_app_phone")).to.have.lengthOf(1);
  });

  it("lists an entity-only device even when no notify service exists (the reported bug)", async () => {
    const el = await mount(undefined, { "notify.file": { entity_id: "notify.file" } });
    expect(options(el), "entity device suggested").to.include("notify.file");
  });

  it("degrades to an empty datalist when no notify targets exist", async () => {
    const el = await mount(undefined, undefined);
    const list = el.shadowRoot?.querySelector<HTMLDataListElement>("#ms-notify-services");
    expect(list, "datalist still present").to.exist;
    expect(list!.querySelectorAll("option").length, "no options").to.equal(0);
    // Free-text input still renders so notifications can be configured.
    const input = el.shadowRoot?.querySelector<HTMLInputElement>(
      'input[list="ms-notify-services"]',
    );
    expect(input, "free-text input still present").to.exist;
  });
});
