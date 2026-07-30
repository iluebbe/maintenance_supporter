/**
 * The battery fleet's full roster (discussion #113).
 *
 * The exclude control used to render only on rows in the `low` list, so a
 * device could be dismissed from the fleet ONLY while it was already nagging —
 * and by the time the reporter looked, the fleet task had auto-completed and
 * dropped the device from that list again, leaving no way to exclude it at
 * all. A robot vacuum that recharges itself has to be excludable while it is
 * perfectly healthy.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/battery-fleet-section.js";
import type { MaintenanceBatteryFleetSection } from "../components/battery-fleet-section";
import { createMockHass } from "./_test-utils.js";

const LOW = {
  entity_id: "sensor.lock_battery_plus", device_name: "Front Lock",
  battery_type: "AA", quantity: 2, level: 8, days_until: null,
};
const HEALTHY = {
  entity_id: "sensor.vacuum_battery_plus", device_name: "Robot Vacuum",
  battery_type: "Li-ion", quantity: 1, level: 96, days_until: null,
};

function overview(extra: Record<string, unknown> = {}) {
  return {
    available: true, has_battery_notes: true, configured: true, task_ok: true,
    total: 2,
    low: [LOW],
    soon: [],
    all: [
      { ...LOW, status: "low" },
      { ...HEALTHY, status: "ok" },
    ],
    needs_now: { AA: 2 }, needs_soon: {}, types: ["AA", "Li-ion"], excluded: [],
    ...extra,
  };
}

async function mount(ov: unknown = overview()) {
  const calls: Array<Record<string, unknown>> = [];
  const { hass } = createMockHass({
    handlers: {
      "maintenance_supporter/battery_fleet/overview": () => ov,
      "maintenance_supporter/battery_fleet/set_excluded": (msg: Record<string, unknown>) => {
        calls.push(msg);
        return { success: true };
      },
    },
  });
  const el = await fixture<MaintenanceBatteryFleetSection>(
    html`<maintenance-battery-fleet-section .hass=${hass}></maintenance-battery-fleet-section>`,
  );
  await el.updateComplete;
  // The overview is fetched asynchronously on first hass update.
  await new Promise((r) => setTimeout(r, 0));
  await el.updateComplete;
  return { el, calls };
}

const roster = (el: MaintenanceBatteryFleetSection) => el.shadowRoot!.querySelector("details.bf-roster");

describe("battery fleet roster", () => {
  it("lists a healthy device that appears in neither low nor soon", async () => {
    const { el } = await mount();
    const names = [...roster(el)!.querySelectorAll(".bf-dev")].map((n) => n.textContent?.trim());
    expect(names).to.deep.equal(["Front Lock", "Robot Vacuum"]);
  });

  it("offers exclude on the healthy device, which is the whole point", async () => {
    const { el, calls } = await mount();
    const rows = [...roster(el)!.querySelectorAll(".bf-row")];
    const vacuumRow = rows.find((r) => /Robot Vacuum/.test(r.textContent || ""));
    expect(vacuumRow, "the healthy device has no row").to.not.equal(undefined);

    const button = vacuumRow!.querySelector<HTMLButtonElement>("button.bf-exclude");
    expect(button, "a healthy device cannot be excluded").to.not.equal(null);
    button!.click();
    await el.updateComplete;

    expect(calls).to.have.lengthOf(1);
    expect(calls[0].entity_id).to.equal("sensor.vacuum_battery_plus");
    expect(calls[0].excluded).to.equal(true);
  });

  it("marks each row with its status so the list can be read at a glance", async () => {
    const { el } = await mount();
    const chips = [...roster(el)!.querySelectorAll(".bf-status")].map((n) => n.className);
    expect(chips.some((c) => c.includes("bf-low"))).to.equal(true);
    expect(chips.some((c) => c.includes("bf-ok"))).to.equal(true);
  });

  it("stays collapsed, so the section still opens on what needs doing", async () => {
    const { el } = await mount();
    expect((roster(el) as HTMLDetailsElement).open).to.equal(false);
  });

  it("renders nothing when an older backend sends no roster", async () => {
    const { all, ...withoutRoster } = overview() as Record<string, unknown>;
    void all;
    const { el } = await mount(withoutRoster);
    expect(roster(el)).to.equal(null);
  });
});
