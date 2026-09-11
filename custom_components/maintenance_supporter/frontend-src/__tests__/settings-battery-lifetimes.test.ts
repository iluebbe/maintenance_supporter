/**
 * Settings → Typical battery lifetimes (D#162 follow-up): the table lists the
 * fleet's types first with the effective months and their source, editing a
 * value writes the whole `battery_lifetime_months` map, "Use default"
 * removes the override, and the hint says when the table matters at all.
 */
import { expect, fixture, html } from "@open-wc/testing";
import "../components/settings-view.js";
import type { MaintenanceSettingsView } from "../components/settings-view";
import { DEFAULT_FEATURES, DEFAULT_SETTINGS_RESPONSE, createMockHass } from "./_test-utils.js";

const CATALOG = [
  { type: "CR2032", months: 24, source: "override", samples: 0, default_months: 18, learned_months: null, override_months: 24, in_fleet: true },
  { type: "AA", months: 9, source: "learned", samples: 4, default_months: 12, learned_months: 9, override_months: null, in_fleet: true },
  { type: "CR2450", months: 24, source: "table", samples: 0, default_months: 24, learned_months: null, override_months: null, in_fleet: false },
];

describe("settings: typical battery lifetimes (D#162)", () => {
  async function mount() {
    const updates: Record<string, unknown>[] = [];
    let settings = {
      ...DEFAULT_SETTINGS_RESPONSE,
      general: { ...DEFAULT_SETTINGS_RESPONSE.general, battery_lifetime_months: { CR2032: 24 }, battery_lifetimes: CATALOG },
    };
    const { hass } = createMockHass({
      handlers: {
        "maintenance_supporter/settings": () => settings,
        "maintenance_supporter/global/update": (msg) => {
          const s = msg.settings as Record<string, unknown>;
          updates.push(s);
          settings = { ...settings, general: { ...settings.general, ...s } };
          return settings;
        },
      },
    });
    const el = await fixture<MaintenanceSettingsView>(html`
      <maintenance-settings-view .hass=${hass} .features=${DEFAULT_FEATURES}></maintenance-settings-view>
    `);
    await new Promise((r) => setTimeout(r, 50));
    await el.updateComplete;
    return { el, updates };
  }

  const rows = (el: MaintenanceSettingsView) => [...el.shadowRoot!.querySelectorAll<HTMLElement>(".bl-row")];

  it("lists fleet types first with months and source; other types fold away", async () => {
    const { el } = await mount();
    expect(el.shadowRoot!.textContent).to.contain("Typical battery lifetimes");
    expect(el.shadowRoot!.textContent).to.contain("Only used for batteries without a percentage");
    const r = rows(el);
    expect(r.map((x) => x.querySelector(".bl-type")!.textContent!.trim().split(" ")[0])).to.deep.equal(["CR2032", "AA", "CR2450"]);
    expect(r[0].textContent).to.contain("your setting");
    expect(r[1].textContent).to.contain("learned from 4 replacements");
    expect(r[2].textContent).to.contain("built-in table");
    expect(r[0].querySelector<HTMLInputElement>("input.bl-months")!.value).to.equal("24");
    expect(el.shadowRoot!.querySelector(".bl-more"), "non-fleet types behind a disclosure").to.exist;
  });

  it("editing a value writes the whole override map; Use default removes the entry", async () => {
    const { el, updates } = await mount();
    const aa = rows(el)[1].querySelector<HTMLInputElement>("input.bl-months")!;
    aa.value = "10";
    aa.dispatchEvent(new Event("change"));
    await new Promise((r) => setTimeout(r, 20));
    expect(updates.at(-1)).to.deep.equal({ battery_lifetime_months: { CR2032: 24, AA: 10 } });
    rows(el)[0].querySelector<HTMLButtonElement>("button.bl-reset")!.click();
    await new Promise((r) => setTimeout(r, 20));
    expect(updates.at(-1)).to.deep.equal({ battery_lifetime_months: { AA: 10 } });
    // Out-of-range input is ignored.
    aa.value = "999";
    aa.dispatchEvent(new Event("change"));
    await new Promise((r) => setTimeout(r, 20));
    expect(updates.length).to.equal(2);
  });
});
