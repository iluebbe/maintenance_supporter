/**
 * Settings → General: the "Task row actions" select offers the three styles
 * and writes `row_action_style` through global/update (#145).
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/settings-view.js";
import type { MaintenanceSettingsView } from "../components/settings-view";
import { DEFAULT_FEATURES, DEFAULT_SETTINGS_RESPONSE, createMockHass } from "./_test-utils.js";

describe("settings: task row actions (#145)", () => {
  it("offers buttons_compact / buttons / icons and saves the choice", async () => {
    const updates: Record<string, unknown>[] = [];
    const { hass } = createMockHass({
      handlers: {
        "maintenance_supporter/settings": () => ({
          ...DEFAULT_SETTINGS_RESPONSE,
          general: { ...DEFAULT_SETTINGS_RESPONSE.general, row_action_style: "buttons_compact" },
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

    const sel = [...el.shadowRoot!.querySelectorAll("select")].find((s) =>
      [...s.options].some((o) => o.value === "buttons_compact"),
    );
    expect(sel, "row-actions select rendered").to.exist;
    expect([...sel!.options].map((o) => o.value)).to.deep.equal(["buttons_compact", "buttons", "icons"]);
    expect(sel!.value).to.equal("buttons_compact");

    sel!.value = "icons";
    sel!.dispatchEvent(new Event("change"));
    await new Promise((r) => setTimeout(r, 30));
    expect(updates).to.deep.equal([{ row_action_style: "icons" }]);
  });
});
