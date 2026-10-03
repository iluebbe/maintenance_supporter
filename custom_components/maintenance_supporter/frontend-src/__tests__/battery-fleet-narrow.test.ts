/**
 * The battery fleet in a narrow list (discussion #162).
 *
 * maisun's iPhone (402 px wide) showed the status badges and the hide icon of
 * "All tracked batteries" past the card's right edge — on rows the demo
 * instance never has: batteries without a level whose typical-lifetime
 * forecast has passed (the ~date with the alert icon), the Replaced action on
 * each of them, long device names. These are her rows, measured at the
 * common phone widths in every list the section draws (Needs now, Needed
 * soon, the roster), in the panel and in the Lovelace card's flat variant:
 * nothing may draw past the list it belongs to.
 *
 * 2.97 still spilled, because every row shares the list's columns: ONE long
 * battery type ("1× BATTERY PACK") widened the type column of every row, a
 * rechargeable battery added its icon column, and the fixed gaps between
 * columns that are empty on a phone added the rest. The first version of
 * this test had short types only. And the two-line layout switched on the
 * SCREEN's width — a dashboard column on a wide screen kept the one-line
 * layout and the Lovelace card cut off the badge, the date and the hide
 * button. The lists now switch on their own width: a narrow box on a wide
 * screen is measured here too.
 */
import { expect, fixture, html } from "@open-wc/testing";
import "../components/battery-fleet-section.js";
import type { MaintenanceBatteryFleetSection } from "../components/battery-fleet-section";
import { createMockHass } from "./_test-utils.js";
import { setViewport } from "@web/test-runner-commands";

const sensorless = (name: string, days: number) => ({
  entity_id: `sensor.${name.toLowerCase().replace(/\W+/g, "_")}_battery`,
  device_name: name,
  battery_type: "CR1632",
  quantity: 1,
  level: null,
  no_sensor: true,
  can_mark_replaced: true,
  days_until: days,
  forecast_overdue: days < 0,
  predicted_source: "lifetime",
});
const LOW = {
  entity_id: "sensor.bedroom_hue_switch_battery", device_name: "Bedroom Hue Switch",
  battery_type: "CR2450", quantity: 1, level: 3, can_mark_replaced: true, days_until: null,
};
const OK = {
  entity_id: "sensor.michaels_room_hue_switch_battery", device_name: "Michael’s Room Hue Switch",
  battery_type: "CR2032", quantity: 1, level: 88, can_mark_replaced: true, days_until: 14, predicted_source: "trend",
};
// The widest column makers: a long type, a rechargeable one, and a type
// longer than any column may grow.
const PACK = {
  entity_id: "sensor.garage_door_remote_battery", device_name: "Garage Door Remote",
  battery_type: "BATTERY PACK", quantity: 1, level: 41, can_mark_replaced: true, days_until: 60, predicted_source: "trend",
  rechargeable: true,
};
const LONG_TYPE = "Lithium-ion pack 3.7 V 2000 mAh";
const VACUUM = {
  entity_id: "sensor.cordless_vacuum_battery", device_name: "Cordless Vacuum",
  battery_type: LONG_TYPE, quantity: 1, level: 64, can_mark_replaced: true, days_until: 120, predicted_source: "trend",
  rechargeable: true,
};
const SOON = ["Bedroom Closet Window", "Bedroom Left Window", "Toolshed Carport Door", "Utility Room Window"].map((name, i) =>
  sensorless(name, -18 + i),
);

function overview() {
  return {
    available: true, has_battery_notes: true, configured: true, task_ok: true, total: 8,
    low: [LOW], soon: SOON,
    all: [
      { ...LOW, status: "low" }, ...SOON.map((s) => ({ ...s, status: "soon" })),
      { ...OK, status: "ok" }, { ...PACK, status: "ok" }, { ...VACUUM, status: "ok" },
    ],
    needs_now: { CR2450: 1 }, needs_soon: { CR1632: 4 }, types: ["CR1632", "CR2450", "CR2032", "BATTERY PACK", LONG_TYPE], excluded: [],
  };
}

function mockHass() {
  const { hass } = createMockHass({
    handlers: {
      "maintenance_supporter/battery_fleet/overview": () => overview(),
      "maintenance_supporter/battery_fleet/overview_history": () => ({ series: {} }),
    },
  });
  // The actions (Replaced, hide) are write tier — the section shows them to writers.
  (hass as unknown as { user: unknown }).user = { id: "u_admin", name: "Admin", is_admin: true };
  return hass;
}

async function settle(el: MaintenanceBatteryFleetSection): Promise<MaintenanceBatteryFleetSection> {
  await el.updateComplete;
  await new Promise((r) => setTimeout(r, 0));
  await el.updateComplete;
  el.shadowRoot!.querySelectorAll("details").forEach((d) => {
    (d as HTMLDetailsElement).open = true;
  });
  await el.updateComplete;
  return el;
}

async function mount(flat: boolean) {
  const hass = mockHass();
  const el = await fixture<MaintenanceBatteryFleetSection>(
    flat
      ? html`<maintenance-battery-fleet-section flat .hass=${hass}></maintenance-battery-fleet-section>`
      : html`<maintenance-battery-fleet-section .hass=${hass}></maintenance-battery-fleet-section>`,
  );
  return settle(el);
}

/** The Lovelace card's list in a dashboard column `width` px wide (the card
 *  pads its content 16 px on either side). */
async function mountInColumn(width: number) {
  const hass = mockHass();
  const box = await fixture<HTMLElement>(html`
    <div style="width: ${width}px; padding: 12px 16px; box-sizing: border-box">
      <maintenance-battery-fleet-section flat .hass=${hass}></maintenance-battery-fleet-section>
    </div>
  `);
  return settle(box.querySelector<MaintenanceBatteryFleetSection>("maintenance-battery-fleet-section")!);
}

/** Every element of a row that draws past the list holding it. */
function spills(el: MaintenanceBatteryFleetSection): { rows: number; past: string[] } {
  const past: string[] = [];
  let rows = 0;
  for (const list of el.shadowRoot!.querySelectorAll<HTMLElement>(".bf-rows")) {
    const box = list.getBoundingClientRect();
    for (const row of list.querySelectorAll<HTMLElement>(".bf-row")) {
      rows += 1;
      for (const node of row.querySelectorAll<HTMLElement>("*")) {
        const r = node.getBoundingClientRect();
        if (r.width > 0 && (r.right > box.right + 1 || r.left < box.left - 1)) {
          const name = row.querySelector(".bf-dev")?.textContent?.trim();
          past.push(`${name}: ${node.className || node.tagName} ends at ${Math.round(r.right)}, the list at ${Math.round(box.right)}`);
        }
      }
    }
  }
  return { rows, past };
}

/** Is the roster in the two-line layout (the type on the name's next line)? */
function twoLine(el: MaintenanceBatteryFleetSection): boolean {
  const roster = [...el.shadowRoot!.querySelectorAll<HTMLElement>(".bf-rows")].at(-1)!;
  return getComputedStyle(roster.querySelector(".bf-type")!).gridRowStart === "2";
}

// Needs now (1) + Needed soon (4) + the roster (8).
const ROWS = 13;

describe("battery fleet at phone widths (D#162, maisun's iPhone)", () => {
  for (const flat of [false, true]) {
    for (const width of [360, 390, 402, 430]) {
      it(`${flat ? "card" : "panel"}, ${width} px: nothing draws past its list`, async () => {
        await setViewport({ width, height: 900 });
        try {
          const el = await mount(flat);
          const { rows, past } = spills(el);
          expect(rows, "all three lists rendered").to.equal(ROWS);
          expect(past, past.join("\n")).to.deep.equal([]);
          expect(twoLine(el), "a phone gets the two-line rows").to.equal(true);
        } finally {
          await setViewport({ width: 800, height: 600 });
        }
      });
    }
  }
});

describe("battery fleet in a dashboard column on a wide screen (D#162)", () => {
  for (const width of [400, 500, 640]) {
    it(`a ${width} px column: two-line rows, nothing past its list`, async () => {
      await setViewport({ width: 1440, height: 900 });
      try {
        const el = await mountInColumn(width);
        const { rows, past } = spills(el);
        expect(rows).to.equal(ROWS);
        expect(past, past.join("\n")).to.deep.equal([]);
        expect(twoLine(el), "the list's own width decides, not the screen's").to.equal(true);
      } finally {
        await setViewport({ width: 800, height: 600 });
      }
    });
  }

  it("a wide column keeps the one-line rows", async () => {
    await setViewport({ width: 1440, height: 900 });
    try {
      const el = await mountInColumn(900);
      expect(spills(el).past).to.deep.equal([]);
      expect(twoLine(el), "the desktop layout stays").to.equal(false);
    } finally {
      await setViewport({ width: 800, height: 600 });
    }
  });

  it("a type longer than its column ends in an ellipsis and keeps its full text as a tooltip", async () => {
    await setViewport({ width: 1440, height: 900 });
    try {
      const el = await mountInColumn(900);
      const type = [...el.shadowRoot!.querySelectorAll<HTMLElement>(".bf-type")].find((t) => t.textContent!.includes("Lithium"))!;
      expect(type.title).to.equal(`1× ${LONG_TYPE}`);
      expect(type.scrollWidth, "cut to the column").to.be.greaterThan(type.clientWidth);
    } finally {
      await setViewport({ width: 800, height: 600 });
    }
  });
});
