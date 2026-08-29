/**
 * <maintenance-settings-view>: a rejected setting update must not leave the
 * control showing the rejected value.
 *
 * The browser flips a <select> before we ask the server; when global/update
 * fails, `_settings` is unchanged, so a plain re-render would not touch the
 * DOM. The selects bind their value through Lit's `live()` and the error
 * path requests an update, which snaps them back (audit L10, 2026-08-29).
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/settings-view.js";
import type { MaintenanceSettingsView } from "../components/settings-view";
import {
  DEFAULT_FEATURES,
  DEFAULT_SETTINGS_RESPONSE,
  createMockHass,
  type WsHandler,
} from "./_test-utils.js";

async function mount(updateHandler: WsHandler) {
  const { hass, sent } = createMockHass({
    handlers: { "maintenance_supporter/global/update": updateHandler },
  });
  const el = await fixture<MaintenanceSettingsView>(html`
    <maintenance-settings-view .hass=${hass} .features=${DEFAULT_FEATURES}></maintenance-settings-view>
  `);
  await new Promise((r) => setTimeout(r, 50));
  await el.updateComplete;
  return { el, sent };
}

/** The currency select — the one whose options are the currency codes. */
function currencySelect(el: MaintenanceSettingsView): HTMLSelectElement {
  const sel = [...el.shadowRoot!.querySelectorAll("select")].find((s) =>
    [...s.options].some((o) => o.value === "EUR"),
  );
  expect(sel, "currency select rendered").to.exist;
  return sel!;
}

async function pick(el: MaintenanceSettingsView, sel: HTMLSelectElement, value: string) {
  sel.value = value;
  sel.dispatchEvent(new Event("change"));
  await new Promise((r) => setTimeout(r, 20));
  await el.updateComplete;
}

describe("settings-view select reverts on a rejected update", () => {
  it("snaps the select back to the stored value when global/update fails", async () => {
    const { el, sent } = await mount(() => {
      throw new Error("nope");
    });
    const sel = currencySelect(el);
    expect(sel.value).to.equal("EUR");
    const other = [...sel.options].map((o) => o.value).find((v) => v !== "EUR")!;

    await pick(el, sel, other);

    expect(sent.some((m) => m.type === "maintenance_supporter/global/update")).to.equal(true);
    expect(currencySelect(el).value, "rejected value reverted").to.equal("EUR");
  });

  it("keeps the new value when global/update succeeds", async () => {
    const { el } = await mount((msg) => ({
      ...DEFAULT_SETTINGS_RESPONSE,
      budget: {
        ...DEFAULT_SETTINGS_RESPONSE.budget,
        currency: (msg.settings as { budget_currency: string }).budget_currency,
      },
    }));
    const sel = currencySelect(el);
    const other = [...sel.options].map((o) => o.value).find((v) => v !== "EUR")!;

    await pick(el, sel, other);

    expect(currencySelect(el).value).to.equal(other);
  });
});
