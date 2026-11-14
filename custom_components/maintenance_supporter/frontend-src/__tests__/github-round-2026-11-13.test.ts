/**
 * GitHub round 2026-11-13.
 *
 * - #266: the Calendar tab draws the coming dates of a weekdays / nth-weekday
 *   / day-of-month / calendar task, which the backend sends as
 *   `upcoming_dates`; a flat interval is stepped as before.
 * - D#267: a battery row shows the device's area unless the name says it.
 * - #265: a part ordered by e-mail links its `mailto:` address.
 * - #262: the part form moves a part to another object.
 * - D#256: the delete question says where shared parts go.
 * - #261: a part row records an order, shows it and cancels it.
 * - D#253: Settings exports the history as CSV with the chosen date range.
 * - #255: a rule's hold may last thirty days; the dialog says a long one in
 *   hours or days below the minutes field.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/parts-section";
import "../components/battery-fleet-section.js";
import "../components/settings-view.js";
import type { MaintenancePartsSection } from "../components/parts-section";
import type { MaintenanceBatteryFleetSection } from "../components/battery-fleet-section";
import type { MaintenanceSettingsView } from "../components/settings-view";
import type { MaintenancePart } from "../types";
import { buildCalendarBuckets, MAX_OCCURRENCES_PER_TASK } from "../helpers/calendar-bucket";
import { deleteObjectMessage } from "../helpers/delete-object-message";
import { isPartLink } from "../helpers/url";
import { addDaysIso } from "../helpers/ha-time";
import "../components/task-dialog.js";
import { COMPLETE_WHEN_FOR_MINUTES_RANGE, TRIGGER_FOR_MINUTES_RANGE } from "../helpers/setting-ranges";
import { conditionText } from "../helpers/task-rules";
import { taskTitleText, triggerDetailText } from "../helpers/event-titles";
import { DEFAULT_FEATURES, DEFAULT_SETTINGS_RESPONSE, createMockHass } from "./_test-utils.js";

const TODAY = "2026-11-12";

function calTask(over: Record<string, unknown> = {}) {
  return {
    id: "t1",
    name: "Water plants",
    enabled: true,
    schedule_type: "time_based",
    interval_days: null,
    status: "ok",
    next_due: addDaysIso(TODAY, 1),
    days_until_due: 1,
    history: [],
    responsible_user_id: null,
    ...over,
  };
}

function calObj(tasks: unknown[]) {
  return [{ entry_id: "e1", object: { id: "o1", name: "Garden" }, tasks }] as never;
}

function eventDates(buckets: ReturnType<typeof buildCalendarBuckets>): Array<[string, boolean]> {
  return buckets.flatMap((b) => b.events.map((e) => [b.date, e.projected] as [string, boolean]));
}

describe("calendar: coming dates of a calendar-kind schedule (#266)", () => {
  it("draws the dates the backend sends after the next due date", () => {
    const upcoming = [1, 2, 3, 5, 6].map((n) => addDaysIso(TODAY, n));
    const got = eventDates(buildCalendarBuckets(calObj([calTask({ upcoming_dates: upcoming })]), TODAY, 30));
    expect(got).to.deep.equal([
      [upcoming[0], false],
      [upcoming[1], true],
      [upcoming[2], true],
      [upcoming[3], true],
      [upcoming[4], true],
    ]);
    expect(got.length <= MAX_OCCURRENCES_PER_TASK, "under the cap").to.equal(true);
  });

  it("without them a calendar-kind task shows only its next date, an interval steps as before", () => {
    const bare = eventDates(buildCalendarBuckets(calObj([calTask()]), TODAY, 30));
    expect(bare).to.deep.equal([[addDaysIso(TODAY, 1), false]]);
    const interval = eventDates(buildCalendarBuckets(calObj([calTask({ interval_days: 7 })]), TODAY, 30));
    expect(interval.map((e) => e[0])).to.deep.equal([1, 8, 15, 22, 29].map((n) => addDaysIso(TODAY, n)));
  });

  it("an overdue task sits on today and its coming dates follow", () => {
    const upcoming = [0, 2, 4].map((n) => addDaysIso(TODAY, n));
    const got = eventDates(
      buildCalendarBuckets(calObj([calTask({ status: "overdue", next_due: addDaysIso(TODAY, -3), upcoming_dates: upcoming })]), TODAY, 30),
    );
    expect(got).to.deep.equal([
      [TODAY, false],
      [upcoming[1], true],
      [upcoming[2], true],
    ]);
  });

  it("keeps to the window and ignores what is not a date", () => {
    const upcoming = [addDaysIso(TODAY, 1), "soon", addDaysIso(TODAY, 3), addDaysIso(TODAY, 40)];
    const got = eventDates(buildCalendarBuckets(calObj([calTask({ upcoming_dates: upcoming })]), TODAY, 7));
    expect(got.map((e) => e[0])).to.deep.equal([addDaysIso(TODAY, 1), addDaysIso(TODAY, 3)]);
  });
});

describe("battery fleet: the area beside a device name (D#267)", () => {
  const row = (entity: string, area: string | undefined, name = "Radiator valve") => ({
    entity_id: entity, device_name: name, area_name: area, battery_type: "AA", quantity: 2, level: 8, days_until: null,
  });

  it("tells same-named devices apart by their area", async () => {
    const low = [row("sensor.a", "Office"), row("sensor.b", "Living room"), row("sensor.c", "Kitchen", "Kitchen valve"), row("sensor.d", undefined)];
    const ov = {
      available: true, has_battery_notes: true, configured: true, task_ok: true, total: 4,
      low, soon: [], all: low.map((r) => ({ ...r, status: "low" })),
      needs_now: { AA: 8 }, needs_soon: {}, types: ["AA"], excluded: [],
    };
    const { hass } = createMockHass({
      handlers: {
        "maintenance_supporter/battery_fleet/overview": () => ov,
        "maintenance_supporter/battery_fleet/overview_history": () => ({ series: {} }),
      },
    });
    const el = await fixture<MaintenanceBatteryFleetSection>(html`
      <maintenance-battery-fleet-section .hass=${hass}></maintenance-battery-fleet-section>
    `);
    await new Promise((r) => setTimeout(r, 50));
    await el.updateComplete;
    const areas = [...el.shadowRoot!.querySelectorAll(".bf-dev")].map((d) => d.querySelector(".bf-area")?.textContent?.trim() ?? "");
    expect(areas.includes("Office"), "Office shown").to.equal(true);
    expect(areas.includes("Living room"), "Living room shown").to.equal(true);
    // A name that already says the room, and a device without an area, show none.
    expect(areas.includes("Kitchen"), "no doubled room").to.equal(false);
    expect(areas.includes(""), "a row without an area badge").to.equal(true);
  });
});

describe("spare parts: e-mail order link, move, order (#265, #262, #261)", () => {
  const PARTS = (): MaintenancePart[] => [
    { id: "p1", name: "Shaft seal", stock: 4, is_low: false, restock_quantity: 3, shopping_url: "mailto:orders@supplier.example?subject=Shaft%20seal" },
    { id: "p2", name: "Filter", stock: 1, is_low: true, on_order: { quantity: 2, expected: "2026-11-20" } },
  ];

  async function mount(parts = PARTS(), extra: { canWrite?: boolean; fleet?: boolean } = {}) {
    const sent: Record<string, unknown>[] = [];
    const hass = {
      language: "en",
      connection: {
        sendMessagePromise: async (msg: Record<string, unknown>) => {
          sent.push(msg);
          if (msg.type === "maintenance_supporter/part/order") {
            return { on_order: { quantity: msg.quantity, expected: msg.expected_date ?? null }, task_id: "t9" };
          }
          return { success: true };
        },
      },
    };
    const el = await fixture<MaintenancePartsSection>(html`
      <maintenance-parts-section
        .hass=${hass as never}
        .entryId=${"e1"}
        .parts=${parts}
        .canWrite=${extra.canWrite ?? true}
        .fleet=${extra.fleet ?? false}
        .moveTargets=${[{ entry_id: "e2", name: "Kitchen" }, { entry_id: "e3", name: "Laundry" }]}
      ></maintenance-parts-section>
    `);
    await el.updateComplete;
    return { el, sent };
  }

  it("accepts a mailto: address as a part's link, and nothing that runs code", () => {
    expect(isPartLink("mailto:orders@supplier.example")).to.equal(true);
    expect(isPartLink("https://shop.example/seal")).to.equal(true);
    expect(isPartLink("mailto:")).to.equal(false);
    expect(isPartLink("javascript:alert(1)")).to.equal(false);
    expect(isPartLink(undefined)).to.equal(false);
  });

  it("links the part's name to its order address", async () => {
    const { el } = await mount();
    const link = el.shadowRoot!.querySelector<HTMLAnchorElement>(".part-row .part-name a");
    expect(link !== null, "the name is a link").to.equal(true);
    expect(link!.getAttribute("href")).to.equal("mailto:orders@supplier.example?subject=Shaft%20seal");
  });

  it("shows an open order and cancels it", async () => {
    const { el, sent } = await mount();
    const badge = el.shadowRoot!.querySelector(".order-badge");
    expect(badge !== null, "the order badge is there").to.equal(true);
    expect(badge!.textContent).to.include("2");
    const cancel = el.shadowRoot!.querySelector<HTMLButtonElement>(".order-cancel");
    expect(cancel !== null, "a writer can cancel").to.equal(true);
    cancel!.click();
    await new Promise((r) => setTimeout(r, 20));
    await el.updateComplete;
    expect(sent.some((m) => m.type === "maintenance_supporter/part/order_cancel" && m.part_id === "p2")).to.equal(true);
    expect(el.shadowRoot!.querySelector(".order-badge") === null, "the badge is gone").to.equal(true);
  });

  it("records an order with the restock amount and the delivery day", async () => {
    const { el, sent } = await mount();
    const open = el.shadowRoot!.querySelector<HTMLButtonElement>(".order-open");
    expect(open !== null, "the part without an order offers Ordered…").to.equal(true);
    open!.click();
    await el.updateComplete;
    const qty = el.shadowRoot!.querySelector<HTMLInputElement>(".order-qty")!;
    expect(qty.value, "prefilled with the restock amount").to.equal("3");
    const day = el.shadowRoot!.querySelector<HTMLElement>(".order-date")!;
    day.dispatchEvent(new CustomEvent("value-changed", { detail: { value: "2026-12-01" } }));
    el.shadowRoot!.querySelector<HTMLButtonElement>(".order-confirm")!.click();
    await new Promise((r) => setTimeout(r, 20));
    await el.updateComplete;
    const msg = sent.find((m) => m.type === "maintenance_supporter/part/order");
    expect(msg !== undefined, "the order was sent").to.equal(true);
    expect(msg!.part_id).to.equal("p1");
    expect(msg!.quantity).to.equal(3);
    expect(msg!.expected_date).to.equal("2026-12-01");
    expect(el.shadowRoot!.querySelectorAll(".order-badge").length, "both parts are on order now").to.equal(2);
  });

  it("offers no order form to a reader, and none on the battery fleet", async () => {
    const reader = await mount(PARTS(), { canWrite: false });
    expect(reader.el.shadowRoot!.querySelector(".order-open") === null).to.equal(true);
    expect(reader.el.shadowRoot!.querySelector(".order-cancel") === null).to.equal(true);
    expect(reader.el.shadowRoot!.querySelector(".order-badge") !== null, "the order is still shown").to.equal(true);
    const fleet = await mount(PARTS(), { fleet: true });
    expect(fleet.el.shadowRoot!.querySelector(".order-open") === null).to.equal(true);
  });

  it("moves a part to the chosen object", async () => {
    const { el, sent } = await mount();
    let changed = 0;
    el.addEventListener("parts-changed", () => changed++);
    (el as unknown as { _openEdit(p: MaintenancePart): void })._openEdit(el.parts[0]);
    await el.updateComplete;
    const select = el.shadowRoot!.querySelector<HTMLSelectElement>(".move-select");
    expect(select !== null, "the form offers the move").to.equal(true);
    expect([...select!.options].map((o) => o.textContent?.trim())).to.include.members(["Kitchen", "Laundry"]);
    const btn = el.shadowRoot!.querySelector<HTMLElement & { disabled: boolean }>(".move-btn")!;
    expect(btn.disabled, "nothing chosen yet").to.equal(true);
    select!.value = "e3";
    select!.dispatchEvent(new Event("change"));
    await el.updateComplete;
    btn.click();
    await new Promise((r) => setTimeout(r, 20));
    await el.updateComplete;
    const msg = sent.find((m) => m.type === "maintenance_supporter/part/move");
    expect(msg !== undefined, "the move was sent").to.equal(true);
    expect(msg!.entry_id).to.equal("e1");
    expect(msg!.part_id).to.equal("p1");
    expect(msg!.target_entry_id).to.equal("e3");
    expect(changed).to.equal(1);
    expect(el.shadowRoot!.querySelector(".part-form") === null, "the form closed").to.equal(true);
  });

  it("offers no move for a new part or on the battery fleet", async () => {
    const { el } = await mount();
    (el as unknown as { _openAdd(): void })._openAdd();
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".move-select") === null, "a new part has nowhere to move from").to.equal(true);
    const fleet = await mount(PARTS(), { fleet: true });
    (fleet.el as unknown as { _openEdit(p: MaintenancePart): void })._openEdit(fleet.el.parts[0]);
    await fleet.el.updateComplete;
    expect(fleet.el.shadowRoot!.querySelector(".move-select") === null).to.equal(true);
  });
});

describe("delete object: where shared parts go (D#256)", () => {
  const host = (reply: unknown, fail = false) => ({
    connection: {
      sendMessagePromise: async <T>(): Promise<T> => {
        if (fail) throw new Error("offline");
        return reply as T;
      },
    },
  });

  it("names the parts and their new owner", async () => {
    const text = await deleteObjectMessage(host({ parts_handover: { new_owner: "Kitchen", parts: ["Dust bags", "Filter"] } }), "e1", "en");
    expect(text).to.include("Delete this object");
    expect(text).to.include("Kitchen");
    expect(text).to.include("Dust bags, Filter");
  });

  it("asks the plain question when nothing moves or the preview fails", async () => {
    const plain = await deleteObjectMessage(host({ parts_handover: null }), "e1", "en");
    expect(plain).to.not.include("Kitchen");
    expect(await deleteObjectMessage(host(null, true), "e1", "en")).to.equal(plain);
    expect(await deleteObjectMessage(host(null), null, "en")).to.equal(plain);
  });
});

describe("settings: history as CSV (D#253)", () => {
  it("asks for the history with the chosen date range and downloads it", async () => {
    const sent: Record<string, unknown>[] = [];
    const { hass } = createMockHass({
      handlers: {
        "maintenance_supporter/settings": () => DEFAULT_SETTINGS_RESPONSE,
        "maintenance_supporter/csv/history": (msg: Record<string, unknown>) => {
          sent.push(msg);
          return { csv: "object,task\r\nCar,Oil\r\n" };
        },
      },
    });
    const el = await fixture<MaintenanceSettingsView>(html`
      <maintenance-settings-view .hass=${hass} .features=${DEFAULT_FEATURES}></maintenance-settings-view>
    `);
    await new Promise((r) => setTimeout(r, 50));
    await el.updateComplete;
    const downloads: Array<[string, string, string]> = [];
    const inner = el as unknown as {
      _historyCsvFrom: string;
      _historyCsvTo: string;
      _downloadFile(content: string, name: string, mime: string): void;
      _exportHistoryCsv(): Promise<void>;
    };
    inner._downloadFile = (content, name, mime) => { downloads.push([content, name, mime]); };
    inner._historyCsvFrom = "2026-01-01";
    inner._historyCsvTo = "";
    await inner._exportHistoryCsv();
    expect(sent.length).to.equal(1);
    expect(sent[0].date_from).to.equal("2026-01-01");
    expect("date_to" in sent[0], "an open end is not sent").to.equal(false);
    expect("entry_ids" in sent[0], "no selection means all objects").to.equal(false);
    expect(downloads.length).to.equal(1);
    expect(downloads[0][0]).to.include("Car,Oil");
    expect(downloads[0][1].startsWith("maintenance_history_") && downloads[0][1].endsWith(".csv")).to.equal(true);
    expect(downloads[0][2]).to.equal("text/csv");
  });
});

describe("sensor rule: a hold of days (#255)", () => {
  type Dialog = HTMLElement & {
    updateComplete: Promise<unknown>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [k: string]: any;
  };

  async function mountFrost(forMinutes: number): Promise<Dialog> {
    const { hass } = createMockHass({ handlers: { "maintenance_supporter/task/update": () => ({}) } });
    (hass as unknown as { states: Record<string, unknown> }).states = {
      "sensor.outdoor_temp": { state: "6", attributes: { friendly_name: "Outdoor", unit_of_measurement: "°C" } },
    };
    const el = await fixture<Dialog>(html`<maintenance-task-dialog .hass=${hass}></maintenance-task-dialog>`);
    await el.updateComplete;
    await el.openEdit("e", {
      id: "t1", name: "Open the irrigation", type: "custom", schedule_type: "sensor_based", warning_days: 1, enabled: true,
      trigger_config: { type: "threshold", entity_id: "sensor.outdoor_temp", entity_ids: ["sensor.outdoor_temp"], trigger_above: 3, trigger_for_minutes: forMinutes },
    } as never);
    await new Promise((r) => setTimeout(r, 30));
    await el.updateComplete;
    return el;
  }

  it("allows thirty days for a rule and keeps the done-when wait at a day", () => {
    expect([...TRIGGER_FOR_MINUTES_RANGE]).to.deep.equal([0, 43200]);
    expect([...COMPLETE_WHEN_FOR_MINUTES_RANGE]).to.deep.equal([1, 1440]);
  });

  it("says a long hold in days, a medium one in hours, a short one not at all", async () => {
    const days = await mountFrost(21600);
    expect(days._triggerForMinutes).to.equal("21600");
    const hint = () => days.shadowRoot!.querySelector(".hold-readable")?.textContent ?? "";
    expect(hint()).to.include("15 days");
    days._triggerForMinutes = "180";
    days.requestUpdate();
    await days.updateComplete;
    expect(hint()).to.include("3 hours");
    days._triggerForMinutes = "30";
    days.requestUpdate();
    await days.updateComplete;
    expect(days.shadowRoot!.querySelector(".hold-readable") === null, "no hint for a short hold").to.equal(true);
  });

  it("says the hold in the rule sentence the same way: days, hours, minutes", () => {
    const rule = (minutes: number) => conditionText({ type: "threshold", trigger_above: 3, trigger_for_minutes: minutes }, "°C", "en");
    expect(rule(21600)).to.contain("for 15 days");
    expect(rule(21600)).to.not.contain("minutes");
    expect(rule(180)).to.contain("for 3 hours");
    expect(rule(30)).to.contain("for 30 minutes");
    expect(rule(119)).to.contain("for 119 minutes");
    // to the minute: it is what the rule waits for, never a rounded "2.1 hours"
    expect(rule(150)).to.contain("for 2 hours 30 minutes");
    expect(rule(125)).to.contain("for 2 hours 5 minutes");
    expect(rule(1500)).to.contain("for 25 hours");
    expect(rule(2881)).to.contain("for 2 days 1 minute");
    expect(rule(3600)).to.contain("for 2 days 12 hours");
    expect(rule(21605)).to.contain("for 15 days 5 minutes");
    expect(rule(43200)).to.contain("for 30 days");
  });
});

describe("The trigger detail in the viewer's number format (2.121)", () => {
  const detail = (text: string, numbers: string[] | null) => ({ trigger_detail: text, trigger_detail_numbers: numbers });

  it("writes the decimals the backend names as the viewer does", () => {
    expect(triggerDetailText(detail("81.23", ["81.23"]), "de")).to.equal("81,23");
    expect(triggerDetailText(detail("81.23", ["81.23"]), "en")).to.equal("81.23");
    expect(triggerDetailText(detail("Cellar: 81.23, Attic: 40", ["81.23"]), "de")).to.equal("Cellar: 81,23, Attic: 40");
    expect(triggerDetailText(detail("1234567.89", ["1234567.89"]), "de")).to.equal("1.234.567,89");
    expect(triggerDetailText(detail("0.0042", ["0.0042"]), "de")).to.equal("0,0042");
  });

  it("leaves what the entity wrote itself, and a longer number that only contains one", () => {
    expect(triggerDetailText(detail("Firmware v1.10", null), "de")).to.equal("Firmware v1.10");
    expect(triggerDetailText(detail("Trulicity: 3 left", []), "de")).to.equal("Trulicity: 3 left");
    expect(triggerDetailText(detail("11.55 and 1.5", ["1.5"]), "de")).to.equal("11.55 and 1,5");
    expect(triggerDetailText(detail("x", ["not a number", "7"]), "de")).to.equal("x");
    expect(triggerDetailText({ trigger_detail: null }, "de")).to.equal(null);
    expect(triggerDetailText(undefined, "de")).to.equal(null);
  });

  it("is what the dialog's title carries", () => {
    const task = detail("81.23", ["81.23"]);
    expect(taskTitleText("Air the cellar", [], triggerDetailText(task, "de"))).to.equal("Air the cellar · 81,23");
  });
});
