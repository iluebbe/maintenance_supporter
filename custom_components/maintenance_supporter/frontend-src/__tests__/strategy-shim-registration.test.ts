/** The zero-import strategy shim is what HA loads at boot (extra_module_url),
 *  so it must register EVERY strategy element synchronously — the dashboard
 *  one AND the four section strategies. Until v2.73.0 the section tags were
 *  only defined by the lazily loaded heavy bundle, so a section strategy
 *  dropped into the home dashboard (docs/EXAMPLES.md "Section strategy") on a
 *  fresh page hit HA's 5 s whenDefined timeout and rendered empty unless the
 *  Maintenance Supporter dashboard had been generated first in that session.
 *  Importing the shim here runs its top-level registration for real. */

import { expect } from "@open-wc/testing";
import "../maintenance-strategy-shim";

type PickerEntry = { type: string; strategyType: string; name: string };
const picker = () => (window as unknown as { customStrategies?: PickerEntry[] }).customStrategies ?? [];

const SECTION_TYPES = [
  "maintenance-supporter-section",
  "maintenance-supporter-vacation",
  "maintenance-supporter-budget",
  "maintenance-supporter-groups",
];

describe("strategy shim registration", () => {
  it("defines the dashboard strategy element at import time", () => {
    const ctor = customElements.get("ll-strategy-dashboard-maintenance-supporter");
    expect(ctor, "dashboard tag").to.be.a("function");
    expect((ctor as unknown as { generate?: unknown }).generate).to.be.a("function");
  });

  it("defines all four section strategy elements at import time (not only after the bundle loads)", () => {
    for (const type of SECTION_TYPES) {
      const ctor = customElements.get(`ll-strategy-section-${type}`);
      expect(ctor, type).to.be.a("function");
      expect((ctor as unknown as { generate?: unknown }).generate, `${type}.generate`).to.be.a("function");
    }
  });

  it("advertises the dashboard AND the section strategies to HA's pickers", () => {
    const entries = picker();
    const dash = entries.filter((e) => e.type === "maintenance-supporter" && e.strategyType === "dashboard");
    expect(dash, "dashboard picker entry").to.have.length(1);
    for (const type of SECTION_TYPES) {
      const hits = entries.filter((e) => e.type === type && e.strategyType === "section");
      expect(hits, `${type} picker entry`).to.have.length(1);
      expect(hits[0].name).to.match(/^Maintenance Supporter/);
    }
  });

  it("registration is idempotent across a cache-busted re-import (self-heal path)", async () => {
    const before = picker().length;
    // The self-heal re-imports the shim with a fresh query string; a second
    // evaluation must neither throw on the already-defined tags nor duplicate
    // the picker entries.
    await import(/* @vite-ignore */ `../maintenance-strategy-shim.ts?reimport=${Date.now()}`);
    expect(picker().length).to.equal(before);
    expect(customElements.get("ll-strategy-section-maintenance-supporter-budget")).to.be.a("function");
  });
});
