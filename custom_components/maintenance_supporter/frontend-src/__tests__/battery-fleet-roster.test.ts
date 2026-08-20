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

async function mount(ov: unknown = overview(), history: Record<string, unknown> = {}) {
  const calls: Array<Record<string, unknown>> = [];
  const { hass, serviceCalls } = createMockHass({
    handlers: {
      "maintenance_supporter/battery_fleet/overview": () => ov,
      "maintenance_supporter/battery_fleet/overview_history": () => ({ series: history }),
      "maintenance_supporter/battery_fleet/set_excluded": (msg: Record<string, unknown>) => {
        calls.push(msg);
        return { success: true };
      },
      "maintenance_supporter/battery_fleet/set_included": (msg: Record<string, unknown>) => {
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
  return { el, calls, serviceCalls };
}

const roster = (el: MaintenanceBatteryFleetSection) => el.shadowRoot!.querySelector("details.bf-roster");

describe("battery fleet roster", () => {
  beforeEach(() => localStorage.removeItem("ms_bf_roster_sort"));

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

it("shows the predicted replacement date where a forecast exists (#114)", async () => {
    const soon = { ...HEALTHY, entity_id: "sensor.doorbell_battery_plus", device_name: "Doorbell", days_until: 12 };
    const { el } = await mount(overview({
      total: 3,
      all: [
        { ...LOW, status: "low" },          // no forecast left — nothing to show
        { ...soon, status: "soon" },
        { ...HEALTHY, status: "ok" },       // days_until null — nothing to show
      ],
    }));
    const rows = [...roster(el)!.querySelectorAll(".bf-row")];
    const withDate = rows.filter((r) => r.querySelector(".bf-predicted"));
    expect(withDate).to.have.lengthOf(1);
    expect(withDate[0].textContent).to.contain("Doorbell");
    const chip = withDate[0].querySelector(".bf-predicted")!;
    // Starts with the estimate tilde and contains a plausible year.
    expect(chip.textContent!.trim().startsWith("~")).to.equal(true);
    expect(chip.getAttribute("title")).to.match(/Expected around/);
  });

  it("marks a trend-based date and names source + confidence in the tooltip (#114 c)", async () => {
    const trendRow = {
      ...HEALTHY, entity_id: "sensor.cam_battery_plus", device_name: "Yard Cam",
      days_until: 21, predicted_source: "trend", prediction_confidence: "high",
    };
    const tableRow = {
      ...HEALTHY, entity_id: "sensor.bell_battery_plus", device_name: "Doorbell",
      days_until: 25, predicted_source: "typical", prediction_confidence: null,
    };
    const { el } = await mount(overview({
      total: 2,
      all: [{ ...trendRow, status: "soon" }, { ...tableRow, status: "soon" }],
    }));
    const chips = [...roster(el)!.querySelectorAll(".bf-predicted")];
    expect(chips).to.have.lengthOf(2);
    const trend = chips.find((c) => c.classList.contains("bf-trend"))!;
    expect(trend, "trend chip carries the marker class").to.exist;
    expect(trend.getAttribute("title")).to.match(/discharge trend/);
    expect(trend.getAttribute("title")).to.match(/high confidence/);
    const table = chips.find((c) => !c.classList.contains("bf-trend"))!;
    expect(table.getAttribute("title")).to.match(/Expected around/);
  });

  it("renders nothing when an older backend sends no roster", async () => {
    const { all, ...withoutRoster } = overview() as Record<string, unknown>;
    void all;
    const { el } = await mount(withoutRoster);
    expect(roster(el)).to.equal(null);
  });

  async function openRoster(el: MaintenanceBatteryFleetSection) {
    const details = roster(el) as HTMLDetailsElement;
    details.open = true;
    details.dispatchEvent(new Event("toggle"));
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
  }

  it("draws a sparkline from the lazy history, with a dotted trend projection", async () => {
    const now = Math.floor(Date.now() / 1000);
    const trendRow = {
      ...HEALTHY, entity_id: "sensor.cam_battery_plus", device_name: "Yard Cam",
      days_until: 21, predicted_source: "trend", prediction_confidence: "high",
    };
    const points: [number, number][] = Array.from({ length: 30 }, (_, i) => [now - (30 - i) * 86400, 90 - i]);
    const { el } = await mount(
      overview({ total: 2, all: [{ ...trendRow, status: "soon" }, { ...HEALTHY, status: "ok" }] }),
      {
        "sensor.cam_battery_plus": { points, threshold: 20 },
        // The healthy row has history but NO trend — line yes, projection no.
        "sensor.vacuum_battery_plus": { points, threshold: 20 },
      },
    );
    await openRoster(el);
    const sparks = [...roster(el)!.querySelectorAll("svg.bf-spark")];
    expect(sparks).to.have.lengthOf(2);
    const camRow = [...roster(el)!.querySelectorAll(".bf-row")].find((r) => /Yard Cam/.test(r.textContent || ""))!;
    expect(camRow.querySelector(".bf-spark-line"), "the level line").to.not.equal(null);
    expect(camRow.querySelector(".bf-spark-proj"), "trend rows project to the threshold").to.not.equal(null);
    const vacuumRow = [...roster(el)!.querySelectorAll(".bf-row")].find((r) => /Robot Vacuum/.test(r.textContent || ""))!;
    expect(vacuumRow.querySelector(".bf-spark-proj"), "no trend, no projection").to.equal(null);
  });

  it("renders rows unchanged when a battery has no history", async () => {
    const { el } = await mount(overview(), {});
    await openRoster(el);
    expect(roster(el)!.querySelectorAll("svg.bf-spark")).to.have.lengthOf(0);
    expect(roster(el)!.querySelectorAll(".bf-row")).to.have.lengthOf(2);
  });

  it("defaults to urgency (issue #123): emptiest low first, then soonest forecast", async () => {
    const soonRow = {
      ...HEALTHY, entity_id: "sensor.bell_battery_plus", device_name: "Aaa Doorbell",
      days_until: 12, status: "soon",
    };
    // Two lows: Zz Sensor at 3 % must beat Front Lock at 8 % despite the name.
    const emptier = { ...LOW, entity_id: "sensor.zz_battery_plus", device_name: "Zz Sensor", level: 3 };
    // The backend delivers `all` name-sorted — the fixture mirrors that.
    const { el } = await mount(overview({
      total: 4,
      all: [{ ...soonRow }, { ...LOW, status: "low" }, { ...HEALTHY, status: "ok" }, { ...emptier, status: "low" }],
    }));
    await openRoster(el);
    const names = () => [...roster(el)!.querySelectorAll(".bf-dev")].map((n) => n.textContent?.trim());
    expect(names(), "urgency is the default; lows sort by level").to.deep.equal(
      ["Zz Sensor", "Front Lock", "Aaa Doorbell", "Robot Vacuum"],
    );

    const buttons = [...roster(el)!.querySelectorAll<HTMLButtonElement>("button.bf-sort")];
    expect(buttons).to.have.lengthOf(2);
    buttons[1].click(); // second chip = name mode
    await el.updateComplete;
    expect(names()).to.deep.equal(["Aaa Doorbell", "Front Lock", "Robot Vacuum", "Zz Sensor"]);
    expect(localStorage.getItem("ms_bf_roster_sort"), "the choice persists").to.equal("name");
    buttons[0].click();
    await el.updateComplete;
    expect(names()[0]).to.equal("Zz Sensor");
    expect(localStorage.getItem("ms_bf_roster_sort")).to.equal("urgency");
  });

  it("honours a previously stored sort choice on mount", async () => {
    localStorage.setItem("ms_bf_roster_sort", "name");
    const { el } = await mount();
    await openRoster(el);
    const active = roster(el)!.querySelector("button.bf-sort-active")!;
    expect(active.textContent).to.match(/name/i);
    localStorage.removeItem("ms_bf_roster_sort");
  });

  it("filters the roster via the shopping-line type chips", async () => {
    const { el } = await mount();
    const chip = el.shadowRoot!.querySelector<HTMLButtonElement>("button.bf-type-chip")!;
    expect(chip.textContent).to.contain("AA");
    chip.click();
    await el.updateComplete;
    expect((roster(el) as HTMLDetailsElement).open, "filtering opens the roster").to.equal(true);
    let names = [...roster(el)!.querySelectorAll(".bf-dev")].map((n) => n.textContent?.trim());
    expect(names).to.deep.equal(["Front Lock"], "only the AA device remains");
    chip.click();
    await el.updateComplete;
    names = [...roster(el)!.querySelectorAll(".bf-dev")].map((n) => n.textContent?.trim());
    expect(names).to.deep.equal(["Front Lock", "Robot Vacuum"], "clicking again clears the filter");
  });

  it("renders a level bar colored by charge", async () => {
    const { el } = await mount();
    await openRoster(el);
    const rows = [...roster(el)!.querySelectorAll(".bf-row")];
    const lockBar = rows.find((r) => /Front Lock/.test(r.textContent || ""))!.querySelector(".bf-bar-fill")!;
    const vacuumBar = rows.find((r) => /Robot Vacuum/.test(r.textContent || ""))!.querySelector(".bf-bar-fill")!;
    expect(lockBar.className).to.contain("bf-bar-bad"); // 8 %
    expect(vacuumBar.className).to.contain("bf-bar-good"); // 96 %
    expect((vacuumBar as HTMLElement).style.width).to.equal("96%");
  });

  it("colors the level bar against the battery's OWN threshold, not a fixed 20", async () => {
    const at30 = { ...HEALTHY, entity_id: "sensor.t1_battery_plus", device_name: "Thermo High", level: 30, low_threshold: 35 };
    const at50 = { ...HEALTHY, entity_id: "sensor.t2_battery_plus", device_name: "Thermo Mid", level: 50, low_threshold: 35 };
    const { el } = await mount(overview({
      total: 2,
      all: [{ ...at30, status: "ok" }, { ...at50, status: "ok" }],
    }));
    await openRoster(el);
    const rows = [...roster(el)!.querySelectorAll(".bf-row")];
    const bar30 = rows.find((r) => /Thermo High/.test(r.textContent || ""))!.querySelector(".bf-bar-fill")!;
    const bar50 = rows.find((r) => /Thermo Mid/.test(r.textContent || ""))!.querySelector(".bf-bar-fill")!;
    expect(bar30.className, "30 % is red when the note says low at 35").to.contain("bf-bar-bad");
    expect(bar50.className, "50 % sits in the 35+20 approach band").to.contain("bf-bar-warn");
  });

  it("offers a one-click record for a detected unrecorded swap", async () => {
    const now = Math.floor(Date.now() / 1000);
    const { el, serviceCalls } = await mount(overview(), {
      "sensor.vacuum_battery_plus": {
        points: [[now - 86400, 15], [now - 43200, 100]] as [number, number][],
        threshold: 20,
        jump: { at: now - 43200, from: 15, to: 100, device_id: "dev123" },
      },
    });
    await openRoster(el);
    const btn = roster(el)!.querySelector<HTMLButtonElement>("button.bf-jump");
    expect(btn, "the jump chip renders").to.not.equal(null);
    expect(btn!.getAttribute("title")).to.match(/record this replacement/i);
    btn!.click();
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(serviceCalls).to.have.lengthOf(1);
    expect(serviceCalls[0].domain).to.equal("battery_notes");
    expect(serviceCalls[0].service).to.equal("set_battery_replaced");
    expect(serviceCalls[0].data!.device_id).to.equal("dev123");
    expect(String(serviceCalls[0].data!.datetime_replaced)).to.contain("T");
    expect(roster(el)!.querySelector("button.bf-jump"), "recorded → chip gone").to.equal(null);
  });

  it("labels the mark action on a low rechargeable as recharging, not replacing", async () => {
    const lowPack = { ...LOW, entity_id: "sensor.cam2_battery_plus", device_name: "Yard Cam 2", battery_type: "BATTERY PACK", rechargeable: true };
    const { el } = await mount(overview({
      total: 2,
      low: [LOW, lowPack],
      all: [{ ...LOW, status: "low" }, { ...lowPack, status: "low" }],
    }));
    const lowRows = [...el.shadowRoot!.querySelectorAll(".bf-rows")[0].querySelectorAll(".bf-row")];
    const packRow = lowRows.find((r) => /Yard Cam 2/.test(r.textContent || ""))!;
    const plainRow = lowRows.find((r) => /Front Lock/.test(r.textContent || ""))!;
    expect(packRow.querySelector("button.bf-mark:not(.bf-exclude)")!.getAttribute("title")).to.match(/recharged/i);
    expect(plainRow.querySelector("button.bf-mark:not(.bf-exclude)")!.getAttribute("title")).to.not.match(/recharged/i);
  });
});


describe("battery fleet manual include (#135)", () => {
  it("renders the add-battery picker inside the roster", async () => {
    const { el } = await mount();
    const details = roster(el)!;
    expect(details.querySelector(".bf-add ha-selector")).to.exist;
  });

  it("picking an entity sends set_included immediately", async () => {
    const { el, calls } = await mount();
    const selector = roster(el)!.querySelector(".bf-add ha-selector")!;
    selector.dispatchEvent(
      new CustomEvent("value-changed", { detail: { value: "sensor.side_gate_cell" } }),
    );
    await new Promise((r) => setTimeout(r, 0));
    const call = calls.find((c) => c.type === "maintenance_supporter/battery_fleet/set_included");
    expect(call).to.exist;
    expect(call!.entity_id).to.equal("sensor.side_gate_cell");
    expect(call!.included).to.equal(true);
  });

  it("an empty picker change is a no-op", async () => {
    const { el, calls } = await mount();
    const selector = roster(el)!.querySelector(".bf-add ha-selector")!;
    selector.dispatchEvent(new CustomEvent("value-changed", { detail: { value: "" } }));
    await new Promise((r) => setTimeout(r, 0));
    expect(calls.some((c) => c.type === "maintenance_supporter/battery_fleet/set_included")).to.equal(false);
  });
});
