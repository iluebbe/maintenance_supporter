/**
 * Shared devices (#233 follow-up): accounts several people use (a kitchen
 * tablet). Pins: Settings lists every account and writes the ones ticked
 * as shared_device_user_ids; the object history names the person a
 * completion counts for and the device it came from.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/settings-view.js";
import type { MaintenanceSettingsView } from "../components/settings-view";
import { DEFAULT_FEATURES, DEFAULT_SETTINGS_RESPONSE, createMockHass } from "./_test-utils.js";
import { mergeObjectHistory } from "../helpers/object-history";

const tick = (ms = 0) => new Promise((r) => setTimeout(r, ms));

describe("shared devices", () => {
  it("Settings lists the accounts and writes the ones ticked", async () => {
    const { hass, sent } = createMockHass({
      handlers: {
        "maintenance_supporter/users/list": () => ({
          users: [{ id: "u_tab", name: "Kitchen tablet", is_admin: false }, { id: "u_ann", name: "Ann", is_admin: true }],
        }),
        "maintenance_supporter/global/update": () => ({ ...DEFAULT_SETTINGS_RESPONSE, shared_device_user_ids: ["u_tab"] }),
      },
    });
    const el = await fixture<MaintenanceSettingsView>(html`
      <maintenance-settings-view .hass=${hass} .features=${DEFAULT_FEATURES}></maintenance-settings-view>
    `);
    await tick(50);
    await el.updateComplete;
    const section = el.shadowRoot!.querySelector<HTMLElement>(".shared-devices")!;
    const rows = [...section.querySelectorAll<HTMLElement>(".setting-row")];
    expect(rows.map((r) => r.textContent!.trim())).to.deep.equal(["Kitchen tablet", "Ann"]);
    rows[0].querySelector<HTMLInputElement>("input")!.click();
    await tick();
    const update = sent.filter((m) => m.type === "maintenance_supporter/global/update").at(-1) as unknown as { settings: Record<string, unknown> };
    expect(update.settings).to.deep.equal({ shared_device_user_ids: ["u_tab"] });
  });

  it("the object history keeps the device a completion came from", () => {
    const entries = mergeObjectHistory([{
      id: "t1", name: "Empty the filter",
      history: [{ type: "completed", timestamp: "2026-10-27T10:00:00+00:00", completed_by: "u_ann", completed_via: "u_tab" }],
    }] as never);
    expect(entries.map((e) => [e.completedBy, e.completedVia])).to.deep.equal([["u_ann", "u_tab"]]);
  });
});
