/**
 * Bug audit 2026-09-12, finding 1: the settings view re-renders on every
 * hass assignment, and the typed number inputs (battery-lifetime months from
 * D#162, default warning days, consumable threshold, battery-low percent)
 * bound their value through Lit's `live()` — which snapped a half-typed
 * entry back to the stored value mid-typing (the #176 class). The inputs
 * now keep the draft across a re-render; a server reject or an
 * out-of-range entry snaps the field back by writing `input.value`.
 */
import { expect, fixture, html } from "@open-wc/testing";
import "../components/settings-view.js";
import type { MaintenanceSettingsView } from "../components/settings-view";
import { DEFAULT_FEATURES, DEFAULT_SETTINGS_RESPONSE, createMockHass } from "./_test-utils.js";

const CATALOG = [
  { type: "CR2032", months: 24, source: "override", default_months: 18, override_months: 24, learned_models: [], in_fleet: true },
  { type: "AA", months: 12, source: "table", default_months: 12, override_months: null, learned_models: [], in_fleet: true },
];

async function mount(reject: (settings: Record<string, unknown>) => boolean = () => false) {
  const updates: Record<string, unknown>[] = [];
  let settings = {
    ...DEFAULT_SETTINGS_RESPONSE,
    general: {
      ...DEFAULT_SETTINGS_RESPONSE.general,
      default_warning_days: 7, default_consumable_threshold: 10, battery_low_percent: 20,
      battery_lifetime_months: { CR2032: 24 }, battery_lifetimes: CATALOG,
    },
  };
  const { hass } = createMockHass({
    handlers: {
      "maintenance_supporter/settings": () => settings,
      "maintenance_supporter/global/update": (msg) => {
        const s = msg.settings as Record<string, unknown>;
        updates.push(s);
        if (reject(s)) throw new Error("server says no");
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

const sr = (el: MaintenanceSettingsView) => el.shadowRoot!;
const months = (el: MaintenanceSettingsView, row: number) => sr(el).querySelectorAll<HTMLInputElement>("input.bl-months")[row];
const warning = (el: MaintenanceSettingsView) => sr(el).querySelector<HTMLInputElement>('input[type="number"][max="365"]')!;
const percents = (el: MaintenanceSettingsView) => [...sr(el).querySelectorAll<HTMLInputElement>('input[type="number"][max="90"]')];

/** What HA does many times a minute: a fresh hass object → the view re-renders. */
async function rerender(el: MaintenanceSettingsView) {
  el.hass = { ...el.hass } as typeof el.hass;
  await el.updateComplete;
  el.requestUpdate();
  await el.updateComplete;
}

function typeInto(input: HTMLInputElement, value: string) {
  input.value = value;
  input.dispatchEvent(new Event("input"));
}

async function change(el: MaintenanceSettingsView, input: HTMLInputElement, value: string) {
  input.value = value;
  input.dispatchEvent(new Event("change"));
  await new Promise((r) => setTimeout(r, 20));
  await el.updateComplete;
}

describe("settings typed inputs survive a hass re-render (bug audit 2026-09-12, #176 class)", () => {
  it("a half-typed battery-lifetime value stays through a re-render and is not sent", async () => {
    const { el, updates } = await mount();
    expect(months(el, 0).value).to.equal("24");
    typeInto(months(el, 0), "3");
    await rerender(el);
    expect(months(el, 0).value, "draft kept").to.equal("3");
    expect(updates).to.deep.equal([]);
    // Finishing the entry commits it and the stored value follows.
    await change(el, months(el, 0), "30");
    expect(updates.at(-1)).to.deep.equal({ battery_lifetime_months: { CR2032: 30 } });
    await rerender(el);
    expect(months(el, 0).value).to.equal("30");
  });

  it("the general thresholds keep their draft through a re-render too", async () => {
    const { el, updates } = await mount();
    const [consumable, battery] = percents(el);
    typeInto(warning(el), "1");
    typeInto(consumable, "4");
    typeInto(battery, "3");
    await rerender(el);
    expect(warning(el).value).to.equal("1");
    expect(percents(el).map((i) => i.value)).to.deep.equal(["4", "3"]);
    expect(updates).to.deep.equal([]);
  });

  it("a rejected battery-lifetime update snaps the field back to the stored months", async () => {
    const { el, updates } = await mount((s) => "battery_lifetime_months" in s);
    const aa = months(el, 1);
    expect(aa.value).to.equal("12");
    await change(el, aa, "10");
    expect(updates).to.deep.equal([{ battery_lifetime_months: { CR2032: 24, AA: 10 } }]);
    expect(aa.value, "rejected value not left in the field").to.equal("12");
    // Out of range: nothing sent, field snapped back.
    await change(el, aa, "999");
    expect(updates.length).to.equal(1);
    expect(aa.value).to.equal("12");
  });

  it("a rejected threshold update snaps the field back without live()", async () => {
    const { el, updates } = await mount((s) => "default_warning_days" in s);
    await change(el, warning(el), "12");
    expect(updates).to.deep.equal([{ default_warning_days: 12 }]);
    expect(warning(el).value, "rejected value not left in the field").to.equal("7");
    // An accepted one is kept and survives the next re-render.
    const [consumable] = percents(el);
    await change(el, consumable, "15");
    expect(updates.at(-1)).to.deep.equal({ default_consumable_threshold: 15 });
    await rerender(el);
    expect(percents(el)[0].value).to.equal("15");
  });
});
