/**
 * Tests for the standalone <maintenance-supporter-calendar-card> (audit #10).
 *
 * The bucketing math is deep-tested in calendar-bucket.test.ts; this covers
 * the card behaviours on top of it:
 *  - window chips re-bucket the events (an event beyond the window disappears)
 *  - projected recurrences render with the projected class; the real
 *    next-due event does not
 *  - clicking an event fires the ll-custom open-task payload the panel and
 *    dialog-mount listen for
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../maintenance-calendar-card.js";
import { createMockHass } from "./_test-utils.js";

type CardEl = HTMLElement & { updateComplete: Promise<unknown> };

function isoInDays(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  const p = (x: number) => String(x).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function task(over: Record<string, unknown> = {}) {
  return {
    id: "t1",
    name: "Filter",
    type: "custom",
    schedule_type: "time_based",
    interval_days: 30,
    warning_days: 7,
    status: "ok",
    days_until_due: 5,
    next_due: isoInDays(5),
    trigger_active: false,
    history: [],
    enabled: true,
    archived: false,
    responsible_user_id: null,
    ...over,
  };
}

async function mount(tasks: unknown[]) {
  const { hass } = createMockHass({
    handlers: {
      "maintenance_supporter/objects": () => ({
        objects: [{
          entry_id: "e1",
          object: { id: "o1", name: "Pool Pump", area_id: null, task_ids: [] },
          tasks,
        }],
      }),
      "maintenance_supporter/statistics": () => ({}),
    },
  });
  const el = await fixture<CardEl>(html`
    <maintenance-supporter-calendar-card .hass=${hass}></maintenance-supporter-calendar-card>
  `);
  await new Promise((r) => setTimeout(r, 30));
  await el.updateComplete;
  return { el };
}

function eventTitles(el: CardEl): string[] {
  return [...el.shadowRoot!.querySelectorAll(".cal-event-title")]
    .map((e) => e.textContent?.trim() || "");
}

describe("calendar-card", () => {
  it("window chips re-bucket: a 20-days-out event survives +30d but not +7d", async () => {
    const { el } = await mount([
      task({ id: "near", name: "Near", days_until_due: 2, next_due: isoInDays(2), interval_days: 400 }),
      task({ id: "far", name: "Far", days_until_due: 20, next_due: isoInDays(20), interval_days: 400 }),
    ]);

    // Default +30d window shows both.
    expect(eventTitles(el).some((t2) => t2.includes("Near"))).to.be.true;
    expect(eventTitles(el).some((t2) => t2.includes("Far"))).to.be.true;

    // Click the +7d chip → the 20-days-out event drops off.
    const chip = [...el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".cal-window-chip")]
      .find((c) => c.textContent?.trim() === "+7d")!;
    chip.click();
    await el.updateComplete;
    expect(eventTitles(el).some((t2) => t2.includes("Near"))).to.be.true;
    expect(eventTitles(el).some((t2) => t2.includes("Far"))).to.be.false;
  });

  it("projected recurrences carry the projected class; the real event does not", async () => {
    // 10-day interval inside a 30-day window → 1 real + projected occurrences.
    const { el } = await mount([
      task({ id: "rec", name: "Recurring", days_until_due: 3, next_due: isoInDays(3), interval_days: 10 }),
    ]);

    const real = [...el.shadowRoot!.querySelectorAll(".cal-event:not(.cal-event-projected)")];
    const projected = [...el.shadowRoot!.querySelectorAll(".cal-event.cal-event-projected")];
    expect(real.length).to.equal(1);
    expect(projected.length).to.be.greaterThan(0);
  });

  it("clicking an event fires the ll-custom open-task payload", async () => {
    const { el } = await mount([
      task({ id: "t42", name: "Clicky", days_until_due: 2, next_due: isoInDays(2), interval_days: 400 }),
    ]);

    let detail: Record<string, unknown> | null = null;
    el.addEventListener("ll-custom", (e) => {
      detail = (e as CustomEvent<Record<string, unknown>>).detail;
    });

    el.shadowRoot!.querySelector<HTMLElement>(".cal-event")!.click();
    expect(detail, "ll-custom fired").to.not.be.null;
    expect(detail!.type).to.equal("maintenance-supporter:open-task");
    expect(detail!.entry_id).to.equal("e1");
    expect(detail!.task_id).to.equal("t42");
  });
});
