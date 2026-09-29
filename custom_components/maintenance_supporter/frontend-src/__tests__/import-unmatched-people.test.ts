/**
 * A backup moved to another Home Assistant maps its people by name; the
 * ones nobody here matches lose their task assignments. The settings page
 * names them after the import and keeps the notice until the next one
 * (round-trip audit 2026-09-29).
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/settings-view.js";
import type { MaintenanceSettingsView } from "../components/settings-view";
import { DEFAULT_FEATURES, createMockHass } from "./_test-utils.js";

async function importWith(result: Record<string, unknown>): Promise<MaintenanceSettingsView> {
  const { hass } = createMockHass({ handlers: { "maintenance_supporter/json/import": () => result } });
  const el = await fixture<MaintenanceSettingsView>(html`
    <maintenance-settings-view .hass=${hass} .features=${DEFAULT_FEATURES}></maintenance-settings-view>
  `);
  await new Promise((r) => setTimeout(r, 50));
  const priv = el as unknown as { _importCsv: string; _importCsvAction: () => Promise<void> };
  priv._importCsv = '{"objects": []}';
  await priv._importCsvAction();
  await el.updateComplete;
  return el;
}

describe("settings: people an import could not match", () => {
  it("names them next to the import box", async () => {
    const el = await importWith({ created: 2, unmatched_users: ["Bob", "Carla"] });
    const notice = el.shadowRoot!.querySelector(".import-notice");
    expect(notice, "notice").to.exist;
    expect(notice!.textContent).to.contain("Bob, Carla");
  });

  it("shows nothing when everyone was found", async () => {
    const el = await importWith({ created: 2 });
    expect(el.shadowRoot!.querySelector(".import-notice")).to.equal(null);
  });
});
