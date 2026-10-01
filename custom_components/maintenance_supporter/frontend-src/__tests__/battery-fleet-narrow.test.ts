/**
 * The battery fleet at phone widths (discussion #162).
 *
 * maisun's iPhone (402 px wide) showed the status badges and the hide icon of
 * "All tracked batteries" past the card's right edge — on rows the demo
 * instance never has: batteries without a level whose typical-lifetime
 * forecast has passed (the ~date with the alert icon), the Replaced action on
 * each of them, long device names. These are her rows, measured at the
 * common phone widths in every list the section draws (Needs now, Needed
 * soon, the roster), in the panel and in the Lovelace card's flat variant:
 * nothing may draw past the list it belongs to.
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
const SOON = ["Bedroom Closet Window", "Bedroom Left Window", "Toolshed Carport Door", "Utility Room Window"].map((name, i) =>
  sensorless(name, -18 + i),
);

function overview() {
  return {
    available: true, has_battery_notes: true, configured: true, task_ok: true, total: 6,
    low: [LOW], soon: SOON,
    all: [{ ...LOW, status: "low" }, ...SOON.map((s) => ({ ...s, status: "soon" })), { ...OK, status: "ok" }],
    needs_now: { CR2450: 1 }, needs_soon: { CR1632: 4 }, types: ["CR1632", "CR2450", "CR2032"], excluded: [],
  };
}

async function mount(flat: boolean) {
  const { hass } = createMockHass({
    handlers: {
      "maintenance_supporter/battery_fleet/overview": () => overview(),
      "maintenance_supporter/battery_fleet/overview_history": () => ({ series: {} }),
    },
  });
  // The actions (Replaced, hide) are write tier — the section shows them to writers.
  (hass as unknown as { user: unknown }).user = { id: "u_admin", name: "Admin", is_admin: true };
  const el = await fixture<MaintenanceBatteryFleetSection>(
    flat
      ? html`<maintenance-battery-fleet-section flat .hass=${hass}></maintenance-battery-fleet-section>`
      : html`<maintenance-battery-fleet-section .hass=${hass}></maintenance-battery-fleet-section>`,
  );
  await el.updateComplete;
  await new Promise((r) => setTimeout(r, 0));
  await el.updateComplete;
  el.shadowRoot!.querySelectorAll("details").forEach((d) => {
    (d as HTMLDetailsElement).open = true;
  });
  await el.updateComplete;
  return el;
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

describe("battery fleet at phone widths (D#162, maisun's iPhone)", () => {
  for (const flat of [false, true]) {
    for (const width of [360, 390, 402, 430]) {
      it(`${flat ? "card" : "panel"}, ${width} px: nothing draws past its list`, async () => {
        await setViewport({ width, height: 900 });
        try {
          const el = await mount(flat);
          const { rows, past } = spills(el);
          // Needs now (1) + Needed soon (4) + the roster (6).
          expect(rows, "all three lists rendered").to.equal(11);
          expect(past, past.join("\n")).to.deep.equal([]);
        } finally {
          await setViewport({ width: 800, height: 600 });
        }
      });
    }
  }
});
