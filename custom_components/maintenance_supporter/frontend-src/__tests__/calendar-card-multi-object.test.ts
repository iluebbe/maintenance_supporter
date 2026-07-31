/**
 * Calendar card: `object_filter` as a LIST (discussion #83 follow-up).
 *
 * The task card takes `filter_objects` as a list; the calendar card only took
 * one object. A list of 2+ values now restricts the card to that set, and the
 * runtime dropdown narrows WITHIN it instead of offering the whole house. One
 * value keeps the original behaviour (pre-select among all objects), so
 * existing YAML is untouched.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../maintenance-calendar-card.js";
import { createMockHass } from "./_test-utils.js";

type CardEl = HTMLElement & {
  hass: unknown;
  setConfig: (c: Record<string, unknown>) => void;
  shadowRoot: ShadowRoot;
  updateComplete: Promise<boolean>;
};

const isoInDays = (n: number) => {
  const d = new Date(Date.now() + n * 864e5);
  return d.toISOString().slice(0, 10);
};

function obj(entryId: string, name: string, taskName: string) {
  return {
    entry_id: entryId,
    object: { id: entryId + "_o", name, area_id: null, task_ids: [] },
    tasks: [
      {
        id: entryId + "_t", name: taskName, type: "custom",
        schedule_type: "time_based", interval_days: 30, warning_days: 7,
        status: "ok", days_until_due: 3, next_due: isoInDays(3),
        trigger_active: false, history: [], enabled: true, archived: false,
        responsible_user_id: null,
      },
    ],
  };
}

async function mount(config: Record<string, unknown>) {
  const { hass } = createMockHass({
    handlers: {
      "maintenance_supporter/objects": () => ({
        objects: [
          obj("e1", "Pool Pump", "Impeller"),
          obj("e2", "Family Car", "Oil Change"),
          obj("e3", "Espresso Machine", "Descaling"),
        ],
      }),
      "maintenance_supporter/statistics": () => ({}),
    },
  });
  const el = await fixture<CardEl>(html`
    <maintenance-supporter-calendar-card .hass=${hass}></maintenance-supporter-calendar-card>
  `);
  el.setConfig({ type: "custom:maintenance-supporter-calendar-card", ...config });
  await new Promise((r) => setTimeout(r, 30));
  await el.updateComplete;
  return { el };
}

const titles = (el: CardEl) =>
  [...el.shadowRoot.querySelectorAll(".cal-event-title")].map((e) => e.textContent?.trim() || "");

const dropdownOptions = (el: CardEl): string[] => {
  const selects = [...el.shadowRoot.querySelectorAll<HTMLSelectElement>("select.cal-user-filter")];
  const objSel = selects.find((s) => [...s.options].some((o) => /Pool Pump|Family Car/.test(o.textContent || "")));
  return objSel ? [...objSel.options].map((o) => o.textContent?.trim() || "") : [];
};

describe("calendar card multi-object filter", () => {
  it("a list of two names restricts the card to those objects", async () => {
    const { el } = await mount({ object_filter: ["Pool Pump", "Family Car"] });
    const shown = titles(el);
    expect(shown.some((t) => t.includes("Impeller"))).to.equal(true);
    expect(shown.some((t) => t.includes("Oil Change"))).to.equal(true);
    expect(shown.some((t) => t.includes("Descaling"))).to.equal(false);
  });

  it("the dropdown then narrows within the configured set, not the whole house", async () => {
    const { el } = await mount({ object_filter: ["Pool Pump", "Family Car"] });
    const options = dropdownOptions(el);
    expect(options.some((o) => o.includes("Pool Pump"))).to.equal(true);
    expect(options.some((o) => o.includes("Family Car"))).to.equal(true);
    expect(options.some((o) => o.includes("Espresso"))).to.equal(false);
  });

  it("a single-element list behaves like the plain string form", async () => {
    const { el } = await mount({ object_filter: ["Family Car"] });
    const shown = titles(el);
    expect(shown.some((t) => t.includes("Oil Change"))).to.equal(true);
    expect(shown.some((t) => t.includes("Impeller"))).to.equal(false);
    // …and the dropdown still offers every object, exactly as before.
    const options = dropdownOptions(el);
    expect(options.some((o) => o.includes("Espresso"))).to.equal(true);
  });

  it("an entirely unresolved list falls back to all objects, not a blank card", async () => {
    const { el } = await mount({ object_filter: ["Nonexistent A", "Nonexistent B"] });
    expect(titles(el).length).to.be.greaterThan(2);
  });
});
