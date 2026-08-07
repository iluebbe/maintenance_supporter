/**
 * The battery-fleet one-click setup entry points.
 *
 * Originally pinned as a standalone dashboard BUTTON; since #125 the setup
 * lives in two places instead: an entry in the "New ▾" menu and a
 * getting-started CHIP (content-driven: batteries exist AND no fleet yet —
 * the same availability rule as before, so these tests pin the same
 * behaviour through the redesign). A failing check hides both quietly.
 */

import { expect } from "@open-wc/testing";
import { mountPanel, obj, resetTaskSeq, sr, task } from "./_panel-utils.js";

function fleetChip(el: HTMLElement): Element | undefined {
  return [...sr(el).querySelectorAll(".gs-chip")].find((c) =>
    c.querySelector('ha-icon[icon="mdi:battery-sync"]'),
  );
}

async function openNewMenu(el: HTMLElement & { updateComplete: Promise<unknown> }) {
  const btn = sr(el).querySelector<HTMLElement>(".new-menu-button");
  expect(btn, "New menu button present").to.exist;
  btn!.click();
  await el.updateComplete;
}

function fleetMenuItem(el: HTMLElement): Element | undefined {
  return [...sr(el).querySelectorAll(".new-menu-popup .popup-menu-item")].find((i) =>
    i.querySelector('ha-icon[icon="mdi:battery-sync"]'),
  );
}

async function mountWithFleetCheck(response: (() => unknown) | Record<string, unknown>) {
  resetTaskSeq();
  const handler = typeof response === "function" ? response : () => response;
  return mountPanel([obj("e1", [task()])], {
    "maintenance_supporter/battery_fleet/status": handler,
  });
}

describe("battery fleet setup entry points", () => {
  beforeEach(() => {
    localStorage.removeItem("msp-overview-tab"); // dashboard tab is the default
    localStorage.removeItem("msp-gs-dismissed");
  });

  it("chip + menu item show when batteries exist and no fleet is configured", async () => {
    const { el } = await mountWithFleetCheck({ available: true, configured: false });
    expect(fleetChip(el), "getting-started chip missing").to.not.equal(undefined);
    await openNewMenu(el);
    expect(fleetMenuItem(el), "menu item missing").to.not.equal(undefined);
  });

  it("hides when the fleet is already configured", async () => {
    const { el } = await mountWithFleetCheck({ available: true, configured: true });
    expect(fleetChip(el)).to.equal(undefined);
    await openNewMenu(el);
    expect(fleetMenuItem(el)).to.equal(undefined);
  });

  it("hides when there are no batteries at all", async () => {
    const { el } = await mountWithFleetCheck({ available: false, configured: false });
    expect(fleetChip(el)).to.equal(undefined);
    await openNewMenu(el);
    expect(fleetMenuItem(el)).to.equal(undefined);
  });

  it("hides quietly when the check fails (older backend, WS error)", async () => {
    const { el } = await mountWithFleetCheck(() => {
      throw new Error("no such command");
    });
    expect(fleetChip(el)).to.equal(undefined);
    await openNewMenu(el);
    expect(fleetMenuItem(el)).to.equal(undefined);
    // The rest of the dashboard still rendered.
    expect(sr(el).querySelectorAll("ha-button").length).to.be.greaterThan(1);
  });

  it("a dismissed chip stays dismissed, the menu item stays", async () => {
    localStorage.setItem("msp-gs-dismissed", JSON.stringify(["fleet"]));
    const { el } = await mountWithFleetCheck({ available: true, configured: false });
    expect(fleetChip(el)).to.equal(undefined);
    await openNewMenu(el);
    expect(fleetMenuItem(el), "menu item must survive a chip dismissal").to.not.equal(undefined);
  });
});
