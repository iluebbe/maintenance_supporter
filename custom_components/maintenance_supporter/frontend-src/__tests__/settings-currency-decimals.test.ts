/**
 * Settings → General → "Decimal places for amounts": the select shows the
 * stored value (default 0), writes `currency_decimals` as a number through
 * global/update, and loading the settings syncs the global money prefs so
 * formatCost rounds the same way everywhere.
 */
import { expect, fixture, html } from "@open-wc/testing";
import "../components/settings-view.js";
import type { MaintenanceSettingsView } from "../components/settings-view";
import { currencyDecimals, formatCost, setCurrencyDecimals } from "../styles";
import { DEFAULT_FEATURES, DEFAULT_SETTINGS_RESPONSE, createMockHass } from "./_test-utils.js";

describe("settings: decimal places for amounts", () => {
  afterEach(() => setCurrencyDecimals(0));

  async function mount(budget: Record<string, unknown> = {}) {
    const updates: Record<string, unknown>[] = [];
    let settings = { ...DEFAULT_SETTINGS_RESPONSE, budget: { ...DEFAULT_SETTINGS_RESPONSE.budget, ...budget } };
    const { hass } = createMockHass({
      handlers: {
        "maintenance_supporter/settings": () => settings,
        "maintenance_supporter/global/update": (msg) => {
          const s = msg.settings as Record<string, unknown>;
          updates.push(s);
          settings = { ...settings, budget: { ...settings.budget, ...("currency_decimals" in s ? { currency_decimals: s.currency_decimals } : {}) } };
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

  const select = (el: MaintenanceSettingsView) => el.shadowRoot!.querySelector<HTMLSelectElement>("select.currency-decimals")!;

  it("defaults to 0 and offers 0–3", async () => {
    const { el } = await mount();
    expect(select(el).value).to.equal("0");
    expect([...select(el).options].map((o) => o.value)).to.deep.equal(["0", "1", "2", "3"]);
    expect(el.shadowRoot!.textContent).to.contain("Decimal places for amounts");
  });

  it("reflects the stored value, syncs the money prefs, and writes a number", async () => {
    const { el, updates } = await mount({ currency_decimals: 2 });
    expect(select(el).value).to.equal("2");
    expect(currencyDecimals()).to.equal(2);
    expect(formatCost(929.6, "€", "en")).to.equal("929.60 €");
    select(el).value = "0";
    select(el).dispatchEvent(new Event("change", { bubbles: true }));
    await new Promise((r) => setTimeout(r, 50));
    await el.updateComplete;
    expect(updates.some((u) => u.currency_decimals === 0)).to.equal(true, "written as a number, not a string");
    expect(currencyDecimals()).to.equal(0);
    expect(formatCost(929.6, "€", "en")).to.equal("930 €");
  });
});
