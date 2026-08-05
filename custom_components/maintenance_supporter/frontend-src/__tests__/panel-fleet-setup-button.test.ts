/**
 * The dashboard's "Battery fleet" one-click-setup button.
 *
 * Written BEFORE swapping the panel's availability check from the heavy
 * `battery_fleet/overview` (which runs the full trend machinery server-side)
 * to the slim `battery_fleet/status`: these tests pin the visible behaviour
 * so the swap cannot change it. The button shows exactly when batteries
 * exist AND no fleet is configured yet; a failing check hides it quietly.
 */

import { expect } from "@open-wc/testing";
import { mountPanel, obj, resetTaskSeq, sr, task } from "./_panel-utils.js";

function fleetButton(el: HTMLElement): Element | undefined {
  return [...sr(el).querySelectorAll("ha-button")].find((b) =>
    b.querySelector('ha-icon[icon="mdi:battery-sync"]'),
  );
}

async function mountWithFleetCheck(response: (() => unknown) | Record<string, unknown>) {
  resetTaskSeq();
  const handler = typeof response === "function" ? response : () => response;
  return mountPanel([obj("e1", [task()])], {
    "maintenance_supporter/battery_fleet/status": handler,
    // Kept during the migration so the pre-swap implementation (which asked
    // the full overview) satisfies the same contract; the assertions only
    // care about the rendered button.
    "maintenance_supporter/battery_fleet/overview": handler,
  });
}

describe("battery fleet setup button", () => {
  beforeEach(() => localStorage.removeItem("msp-overview-tab")); // dashboard tab is the default

  it("shows when batteries exist and no fleet is configured", async () => {
    const { el } = await mountWithFleetCheck({ available: true, configured: false });
    expect(fleetButton(el), "setup button missing").to.not.equal(undefined);
  });

  it("hides when the fleet is already configured", async () => {
    const { el } = await mountWithFleetCheck({ available: true, configured: true });
    expect(fleetButton(el)).to.equal(undefined);
  });

  it("hides when there are no batteries at all", async () => {
    const { el } = await mountWithFleetCheck({ available: false, configured: false });
    expect(fleetButton(el)).to.equal(undefined);
  });

  it("hides quietly when the check fails (older backend, WS error)", async () => {
    const { el } = await mountWithFleetCheck(() => {
      throw new Error("no such command");
    });
    expect(fleetButton(el)).to.equal(undefined);
    // The rest of the dashboard still rendered.
    expect(sr(el).querySelectorAll("ha-button").length).to.be.greaterThan(2);
  });
});
