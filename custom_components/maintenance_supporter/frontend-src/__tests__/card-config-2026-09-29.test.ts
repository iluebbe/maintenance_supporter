/**
 * Card configuration that did not do what its docs and editor said
 * (reachability audit 2026-09-29, package C3):
 *  - the header badges counted the whole home on a card filtered to one room;
 *  - the calendar's object dropdown vanished once chips and user filter were
 *    off, although show_object_filter was on;
 *  - past_days had no editor control and silently beat the window chosen in
 *    the editor — and removing it left the card in its past view;
 *  - "Follow the household setting" wrote `action_style: undefined`.
 */

import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import "../maintenance-card.js";
import "../maintenance-card-editor.js";
import "../maintenance-calendar-card.js";
import type { MaintenanceSupporterCard } from "../maintenance-card";
import { createMockHass } from "./_test-utils.js";

const task = (id: string, name: string, status: string, days: number) => ({
  id, name, status, days_until_due: days, type: "service", enabled: true, archived: false,
  schedule_type: "time_based", interval_days: 30, warning_days: 7, next_due: null,
  trigger_active: false, history: [], responsible_user_id: null,
});

const OBJECTS = [
  { entry_id: "e1", object: { id: "o1", name: "Dishwasher", area_id: "kitchen" },
    tasks: [task("t1", "Clean filter", "overdue", -2)] },
  { entry_id: "e2", object: { id: "o2", name: "Boiler", area_id: "cellar" },
    tasks: [task("t2", "Service", "overdue", -5), task("t3", "Bleed", "due_soon", 3), task("t4", "Vent", "due_soon", 4)] },
];

describe("card header badges follow the card's filters", () => {
  async function card(config: Record<string, unknown>) {
    const { hass } = createMockHass({
      handlers: {
        "maintenance_supporter/objects": () => ({ objects: OBJECTS }),
        "maintenance_supporter/statistics": () => ({ overdue: 2, due_soon: 2, triggered: 0, ok: 0, total: 4 }),
      },
    });
    const el = await fixture<MaintenanceSupporterCard>(html`<maintenance-supporter-card></maintenance-supporter-card>`);
    el.setConfig({ type: "custom:maintenance-supporter-card", show_actions: false, show_documents: false, ...config } as never);
    el.hass = hass as never;
    await waitUntil(() => el.shadowRoot!.querySelectorAll(".task-name").length > 0, "card renders", { timeout: 2000 });
    await el.updateComplete;
    const badge = (cls: string) => el.shadowRoot!.querySelector(`.badge.${cls}`)?.textContent?.trim() ?? "0";
    return { overdue: badge("overdue"), dueSoon: badge("due_soon") };
  }

  it("counts only the kitchen on a kitchen card", async () => {
    expect(await card({ filter_areas: ["kitchen"] })).to.deep.equal({ overdue: "1", dueSoon: "0" });
  });

  it("counts the whole selection, not just the rows max_items shows", async () => {
    expect(await card({ filter_objects: ["Boiler"], max_items: 1 })).to.deep.equal({ overdue: "1", dueSoon: "2" });
  });

  it("counts everything on an unfiltered card", async () => {
    expect(await card({})).to.deep.equal({ overdue: "2", dueSoon: "2" });
  });
});

type CalEl = HTMLElement & {
  setConfig: (c: Record<string, unknown>) => void;
  updateComplete: Promise<boolean>;
};

describe("calendar card configuration", () => {
  async function calendar(config: Record<string, unknown>) {
    const { hass } = createMockHass({
      handlers: {
        "maintenance_supporter/objects": () => ({ objects: OBJECTS }),
        "maintenance_supporter/statistics": () => ({}),
      },
    });
    const el = await fixture<CalEl>(html`
      <maintenance-supporter-calendar-card .hass=${hass}></maintenance-supporter-calendar-card>
    `);
    el.setConfig({ type: "custom:maintenance-supporter-calendar-card", ...config });
    await new Promise((r) => setTimeout(r, 30));
    await el.updateComplete;
    return el;
  }

  it("keeps the object dropdown with the chips and the user filter off", async () => {
    const el = await calendar({ show_window_chips: false, show_user_filter: false });
    const options = [...el.shadowRoot!.querySelectorAll("select.cal-user-filter option")].map((o) => o.textContent?.trim());
    expect(options).to.include.members(["Dishwasher", "Boiler"]);
  });

  it("leaves the past view when past_days is removed from the config", async () => {
    const el = await calendar({ past_days: 30, show_window_chips: true });
    const active = () => el.shadowRoot!.querySelector(".cal-window-chip.active")?.textContent?.trim();
    expect(active()).to.equal("−30d");
    // The editor's plain default: neither key — the card's own 30-day window.
    el.setConfig({ type: "custom:maintenance-supporter-calendar-card" });
    await el.updateComplete;
    expect(active()).to.equal("+30d");
  });

  it("offers the past windows in the editor and writes one key at a time", async () => {
    const editor = await fixture<CalEl>(html`
      <maintenance-supporter-calendar-card-editor .hass=${{ language: "en" }}></maintenance-supporter-calendar-card-editor>
    `);
    editor.setConfig({ type: "custom:maintenance-supporter-calendar-card", window_days: 14 });
    await editor.updateComplete;
    const configs: Array<Record<string, unknown>> = [];
    editor.addEventListener("config-changed", (e) => configs.push((e as CustomEvent).detail.config));
    const select = editor.shadowRoot!.querySelector<HTMLSelectElement>("select#window")!;
    expect([...select.options].map((o) => o.value)).to.include.members(["past-30", "past-90"]);

    select.value = "past-90";
    select.dispatchEvent(new Event("change"));
    expect(configs.at(-1)!.past_days).to.equal(90);
    expect("window_days" in configs.at(-1)!).to.equal(false);

    await editor.updateComplete;
    expect(select.value, "the editor shows the past window it wrote").to.equal("past-90");
    select.value = "7";
    select.dispatchEvent(new Event("change"));
    expect(configs.at(-1)!.window_days).to.equal(7);
    expect("past_days" in configs.at(-1)!).to.equal(false);
  });
});

describe("card editor: following the household row style", () => {
  it("removes action_style instead of storing undefined", async () => {
    const editor = await fixture<CalEl>(html`
      <maintenance-supporter-card-editor .hass=${createMockHass({}).hass}></maintenance-supporter-card-editor>
    `);
    editor.setConfig({ type: "custom:maintenance-supporter-card", action_style: "icons" });
    await editor.updateComplete;
    let config: Record<string, unknown> | null = null;
    editor.addEventListener("config-changed", (e) => { config = (e as CustomEvent).detail.config; });
    const select = [...editor.shadowRoot!.querySelectorAll<HTMLSelectElement>("label.editor-select select")]
      .find((s) => [...s.options].some((o) => o.value === "icons"))!;
    select.value = "";
    select.dispatchEvent(new Event("change"));
    expect(config).to.not.equal(null);
    expect("action_style" in config!).to.equal(false);
  });
});
