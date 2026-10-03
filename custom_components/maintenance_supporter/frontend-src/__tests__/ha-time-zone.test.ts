/**
 * Dates follow Home Assistant's time zone, not the browser's.
 *
 * The backend counts next_due, days_until_due and the status in HA's zone
 * (hass.config.time_zone) and reads a zone-less datetime as HA local time.
 * The frontend took "today" from the BROWSER's clock — a back-dated
 * completion's "now" and its future check, the reset date, the calendar
 * window and its Today marker, the battery forecast, cost months and years,
 * warranty days — a day off around midnight on a device in another zone
 * (east of HA a back-dated completion was refused as "in the future", west
 * of it stored hours early with next_due a day early). And every timestamp
 * showed in the browser's zone whatever the profile "Time zone" said.
 *
 *   1. helpers/ha-time with explicit zones and fixed instants (a DST day,
 *      New Year's Eve) — independent of the zone the test browser runs in;
 *   2. the formatters: a timestamp in the profile's zone, a date-only value
 *      never shifted, a zone-less stamp read as HA local time;
 *   3. the surfaces, with HA's zone injected through the mocked hass and
 *      set far from the browser's (Pacific/Kiritimati UTC+14 or Etc/GMT+12
 *      UTC−12 — 26 h apart, so one of them always reads another date);
 *   4. source tripwires: no "today" from the browser's clock outside the
 *      helper, history timestamps parsed through stampMs, every host feeds
 *      HA's zone into the prefs.
 */

import { expect, fixture, html } from "@open-wc/testing";
import { render } from "lit";
import {
  addDaysIso,
  browserTimeZone,
  daysBetweenIso,
  displayTimeZone,
  haNowMinute,
  haTimeZone,
  haToday,
  haWallTime,
  minuteIn,
  stampDate,
  stampMs,
  ymdIn,
} from "../helpers/ha-time.js";
import {
  formatDate,
  formatDateShort,
  formatDateTime,
  formatTimeOfDay,
  haTimeZoneHint,
  setProfilePrefs,
  syncLocaleFromHass,
  t,
} from "../styles.js";
import { needsYear } from "../renderers/chart-utils.js";
import { snoozedMessage } from "../helpers/snooze.js";
import { buildPastBuckets } from "../helpers/calendar-bucket.js";
import { costBuckets, filterAreaHistory, historyYears, mergeAreaHistory, summarizeAreas } from "../helpers/area-history.js";
import { warrantyStatus } from "../helpers/warranty.js";
import { renderSeasonalCardCompact } from "../renderers/seasonal.js";
import "../components/complete-dialog.js";
import type { MaintenanceCompleteDialog } from "../components/complete-dialog";
import "../components/task-quick-actions-dialog.js";
import type { MaintenanceTaskQuickActionsDialog } from "../components/task-quick-actions-dialog";
import "../components/history-edit-dialog.js";
import type { MaintenanceHistoryEditDialog } from "../components/history-edit-dialog";
import "../components/battery-fleet-section.js";
import type { MaintenanceBatteryFleetSection } from "../components/battery-fleet-section";
import "../maintenance-calendar-card.js";
import type { HistoryEntry, MaintenanceTask } from "../types";
import { createMockHass, pickDateField } from "./_test-utils.js";

const KIRITIMATI = "Pacific/Kiritimati"; // UTC+14, no DST
const GMT_MINUS_12 = "Etc/GMT+12"; // UTC−12 (POSIX sign), no DST

/** A zone whose calendar date differs from the browser's right now. */
function farZone(): string {
  const now = Date.now();
  return ymdIn(now, KIRITIMATI) !== ymdIn(now, browserTimeZone()) ? KIRITIMATI : GMT_MINUS_12;
}

/** What every host (panel, card, dialog-mount) runs when hass changes. */
function hostSync(hass: unknown): void {
  syncLocaleFromHass(
    { hass: hass as Parameters<typeof syncLocaleFromHass>[0]["hass"], requestUpdate: () => {} },
    new Map([["hass", undefined]]),
  );
}

/** HA's zone (config) and the profile (locale), as a mocked hass carries them. */
function useHass(config: { time_zone?: string }, locale?: Record<string, string | undefined>): void {
  hostSync({ language: "en", config, locale });
}

/** Back to "no zones known": HA's zone and the shown one are the browser's. */
function resetZones(): void {
  setProfilePrefs({ date_format: undefined, time_format: undefined, number_format: undefined, time_zone: undefined }, null, null);
}

// 2026-12-31T23:30:00Z — New Year's Eve.
const NYE = Date.UTC(2026, 11, 31, 23, 30);
const NYE_STAMP = "2026-12-31T23:30:00+00:00";

describe("helpers/ha-time — explicit zones, fixed instants", () => {
  afterEach(resetZones);

  it("ymdIn / minuteIn read a zone's wall clock (New Year's Eve)", () => {
    expect(minuteIn(NYE, "Europe/Berlin")).to.equal("2027-01-01T00:30");
    expect(minuteIn(NYE, "Asia/Tokyo")).to.equal("2027-01-01T08:30");
    expect(minuteIn(NYE, "America/New_York")).to.equal("2026-12-31T18:30");
    expect(ymdIn(NYE, "America/New_York")).to.equal("2026-12-31");
    expect(ymdIn(new Date(NYE), "Asia/Tokyo")).to.equal("2027-01-01");
    // Midnight reads 00, never 24.
    expect(minuteIn(Date.UTC(2026, 5, 30, 22), "Europe/Berlin")).to.equal("2026-07-01T00:00");
  });

  it("a DST day: the wall clock jumps, the instants do not", () => {
    // EU spring forward 2026-03-29 01:00Z (CET 02:00 → CEST 03:00).
    expect(minuteIn(Date.UTC(2026, 2, 29, 0, 59), "Europe/Berlin")).to.equal("2026-03-29T01:59");
    expect(minuteIn(Date.UTC(2026, 2, 29, 1, 0), "Europe/Berlin")).to.equal("2026-03-29T03:00");
    // US spring forward 2026-03-08 07:00Z (EST 02:00 → EDT 03:00).
    expect(minuteIn(Date.UTC(2026, 2, 8, 6, 59), "America/New_York")).to.equal("2026-03-08T01:59");
    expect(minuteIn(Date.UTC(2026, 2, 8, 7, 0), "America/New_York")).to.equal("2026-03-08T03:00");
  });

  it("stampMs: an offset is that instant, a zone-less value HA local time", () => {
    useHass({ time_zone: "Europe/Berlin" });
    expect(stampMs("2026-07-01T12:00:00+00:00")).to.equal(Date.UTC(2026, 6, 1, 12));
    expect(stampMs("2026-07-01T12:00:00Z")).to.equal(Date.UTC(2026, 6, 1, 12));
    expect(stampMs("2026-07-01T12:00:00")).to.equal(Date.UTC(2026, 6, 1, 10)); // CEST
    expect(stampMs("2026-01-15T12:00:00")).to.equal(Date.UTC(2026, 0, 15, 11)); // CET
    expect(stampMs("2026-07-01T12:00")).to.equal(Date.UTC(2026, 6, 1, 10));
    expect(stampMs("2026-07-01 12:00:00.250")).to.equal(Date.UTC(2026, 6, 1, 10, 0, 0, 250));
    expect(stampMs("2026-07-01"), "a date-only value: HA's midnight").to.equal(Date.UTC(2026, 5, 30, 22));
    useHass({ time_zone: "Asia/Tokyo" });
    expect(stampMs("2026-07-01T12:00:00")).to.equal(Date.UTC(2026, 6, 1, 3));
    expect(stampMs("2026-07-01T12:00:00+00:00"), "an offset ignores HA's zone").to.equal(Date.UTC(2026, 6, 1, 12));
    expect(stampMs("not-a-date")).to.be.NaN;
    expect(stampMs("2026-02-30T10:00:00")).to.be.NaN;
    expect(stampMs("")).to.be.NaN;
    expect(stampMs(null)).to.be.NaN;
  });

  it("stampMs resolves a DST edge like the backend (Python's fold=0)", () => {
    useHass({ time_zone: "Europe/Berlin" });
    // 02:30 happens twice on 2026-10-25: the first one (CEST, +02:00) …
    expect(stampMs("2026-10-25T02:30:00")).to.equal(Date.UTC(2026, 9, 25, 0, 30));
    expect(stampMs("2026-10-25T03:30:00")).to.equal(Date.UTC(2026, 9, 25, 2, 30));
    // … and never on 2026-03-29: the offset from before the switch.
    expect(stampMs("2026-03-29T02:30:00")).to.equal(Date.UTC(2026, 2, 29, 1, 30));
    expect(stampMs("2026-03-29T01:30:00")).to.equal(Date.UTC(2026, 2, 29, 0, 30));
    expect(stampMs("2026-03-29T03:30:00")).to.equal(Date.UTC(2026, 2, 29, 1, 30));
  });

  it("stampDate is the backend's local_date_from_iso: zone-less keeps its digits, an offset gives HA's day", () => {
    useHass({ time_zone: "Europe/Berlin" });
    expect(stampDate("2026-01-31T23:30:00+00:00")).to.equal("2026-02-01");
    expect(stampDate("2026-01-31T23:30:00.123456+00:00")).to.equal("2026-02-01");
    expect(stampDate("2026-01-31T23:30:00Z")).to.equal("2026-02-01");
    expect(stampDate("2026-01-31T23:59:59")).to.equal("2026-01-31");
    useHass({ time_zone: "America/New_York" });
    expect(stampDate("2026-01-31T23:30:00+00:00")).to.equal("2026-01-31");
    expect(stampDate("2026-02-01T03:00:00+00:00")).to.equal("2026-01-31");
    useHass({ time_zone: "Asia/Tokyo" });
    expect(stampDate("2026-01-31T23:59:59"), "zone-less: its own digits whatever the zone").to.equal("2026-01-31");
    expect(stampDate("2026-08-10")).to.equal("2026-08-10");
    expect(stampDate(null)).to.equal(null);
    expect(stampDate("")).to.equal(null);
    expect(stampDate("garbage")).to.equal(null);
  });

  it("a converted stamp is remembered per zone: a changed HA zone converts again", () => {
    // stampDate / stampMs memoize (formatToParts is slow and histories render
    // the same stamps on every update) — keyed by the zone, never stale.
    const imported = "2026-05-01T12:30:00+00:00";
    const zoneless = "2026-05-01T12:30:00";
    useHass({ time_zone: KIRITIMATI });
    expect(stampDate(imported)).to.equal("2026-05-02");
    const eastMs = stampMs(zoneless);
    expect(stampDate(imported), "the remembered answer").to.equal("2026-05-02");
    useHass({ time_zone: GMT_MINUS_12 });
    expect(stampDate(imported)).to.equal("2026-05-01");
    expect(stampMs(zoneless) - eastMs, "12:30 in UTC−12 is 26 h after 12:30 in UTC+14").to.equal(26 * 3600000);
    useHass({ time_zone: KIRITIMATI });
    expect(stampDate(imported)).to.equal("2026-05-02");
    expect(stampMs(zoneless)).to.equal(eastMs);
  });

  it("haWallTime: the HA wall clock a datetime field shows for a stamp", () => {
    useHass({ time_zone: "Europe/Berlin" });
    expect(haWallTime("2026-07-01T10:00:00+00:00"), "an imported UTC stamp").to.equal("2026-07-01T12:00:00");
    expect(haWallTime("2026-07-01T12:00:00.5+02:00")).to.equal("2026-07-01T12:00:00");
    expect(haWallTime("2026-07-01T12:34:56")).to.equal("2026-07-01T12:34:56");
    expect(haWallTime("2026-07-01T12:34")).to.equal("2026-07-01T12:34:00");
    expect(haWallTime("garbage")).to.equal("");
  });

  it("addDaysIso / daysBetweenIso: calendar maths on date-only strings, DST-safe", () => {
    expect(addDaysIso("2026-03-28", 1)).to.equal("2026-03-29");
    expect(addDaysIso("2026-03-28", 2)).to.equal("2026-03-30");
    expect(addDaysIso("2026-10-24", 2)).to.equal("2026-10-26");
    expect(addDaysIso("2026-12-31", 1)).to.equal("2027-01-01");
    expect(addDaysIso("2028-02-28", 1)).to.equal("2028-02-29");
    expect(addDaysIso("2026-03-01", -1)).to.equal("2026-02-28");
    expect(addDaysIso("2026-02-30", 0), "rolls over like Date — a stepping loop always advances").to.equal("2026-03-02");
    expect(addDaysIso("garbage", 3)).to.equal("garbage");
    expect(daysBetweenIso("2026-03-28", "2026-03-30")).to.equal(2);
    expect(daysBetweenIso("2026-10-24", "2026-10-26")).to.equal(2);
    expect(daysBetweenIso("2026-06-01", "2027-06-01")).to.equal(365);
    expect(daysBetweenIso("2026-06-01", "2026-05-20")).to.equal(-12);
    expect(daysBetweenIso("2026-06-01", "2026-02-30")).to.be.NaN;
    expect(daysBetweenIso("2026-06-01", "not-a-date")).to.be.NaN;
  });

  it("haToday / haNowMinute run on HA's zone — the browser's until hass tells", () => {
    expect(haTimeZone()).to.equal(browserTimeZone());
    expect(haToday()).to.equal(ymdIn(Date.now(), browserTimeZone()));
    const zone = farZone();
    useHass({ time_zone: zone });
    expect(haTimeZone()).to.equal(zone);
    const before = Date.now();
    const today = haToday();
    const minute = haNowMinute();
    const after = Date.now();
    expect([ymdIn(before, zone), ymdIn(after, zone)]).to.include(today);
    expect([minuteIn(before, zone), minuteIn(after, zone)]).to.include(minute);
    expect(today, "another day than the browser's").to.not.equal(ymdIn(after, browserTimeZone()));
    useHass({ time_zone: "Mars/Olympus_Mons" });
    expect(haTimeZone(), "a zone this browser does not know").to.equal(browserTimeZone());
  });

  it("displayTimeZone follows the profile's Time zone (HA's resolveTimeZone)", () => {
    useHass({ time_zone: "Asia/Tokyo" }, { time_zone: "server" });
    expect(displayTimeZone()).to.equal("Asia/Tokyo");
    useHass({ time_zone: "Asia/Tokyo" }, { time_zone: "local" });
    expect(displayTimeZone()).to.equal(browserTimeZone());
    useHass({ time_zone: "Asia/Tokyo" }, {});
    expect(displayTimeZone(), "HA's default is local").to.equal(browserTimeZone());
    resetZones();
    useHass({}, { time_zone: "server" });
    expect(displayTimeZone(), "no server zone known: the browser's").to.equal(browserTimeZone());
  });
});

describe("formatters: a timestamp in the profile's zone, a date never shifted", () => {
  afterEach(resetZones);

  it("profile 'server' shows HA's clock", () => {
    useHass({ time_zone: "Asia/Tokyo" }, { date_format: "YMD", time_format: "24", time_zone: "server" });
    expect(formatDateTime(NYE_STAMP, "en")).to.equal("2027-01-01 08:30");
    expect(formatDate(NYE_STAMP, "en")).to.equal("2027-01-01");
    expect(formatDateShort(new Date(NYE), "en")).to.equal("Jan 1");
    useHass({ time_zone: "America/New_York" }, { date_format: "DMY", time_format: "24", time_zone: "server" });
    expect(formatDateTime(NYE_STAMP, "en")).to.equal("31/12/2026 18:30");
    expect(formatTimeOfDay(new Date(Date.UTC(2026, 7, 10, 12)), "en")).to.equal("08:00");
    expect(formatDateShort(new Date(NYE), "en")).to.equal("Dec 31");
    useHass({ time_zone: "Asia/Tokyo" }, { date_format: "language", time_format: "24", time_zone: "server" });
    expect(formatDate(NYE_STAMP, "de"), "the language default too").to.equal("01.01.2027");
  });

  it("profile 'local' (HA's default) shows the browser's clock", () => {
    const local = browserTimeZone();
    useHass({ time_zone: farZone() }, { date_format: "YMD", time_format: "24", time_zone: "local" });
    expect(formatDateTime(NYE_STAMP, "en")).to.equal(`${ymdIn(NYE, local)} ${minuteIn(NYE, local).slice(11)}`);
  });

  it("a date-only value never shifts, whatever the zones", () => {
    for (const zone of [KIRITIMATI, GMT_MINUS_12]) {
      for (const option of ["server", "local"]) {
        useHass({ time_zone: zone }, { date_format: "DMY", time_zone: option });
        expect(formatDate("2026-08-10", "en"), `${zone} / ${option}`).to.equal("10/08/2026");
        expect(formatDateTime("2026-08-10", "en"), "no time of day to show").to.equal("10/08/2026");
        useHass({ time_zone: zone }, { date_format: "language", time_zone: option });
        expect(formatDate("2026-08-10", "de")).to.equal("10.08.2026");
        expect(formatDate("2026-08-10", "en")).to.equal("08/10/2026");
      }
    }
  });

  it("a zone-less timestamp is HA local time", () => {
    useHass({ time_zone: "Asia/Tokyo" }, { date_format: "YMD", time_format: "24", time_zone: "server" });
    expect(formatDateTime("2026-08-10T14:30:00", "en"), "HA's clock: its own digits").to.equal("2026-08-10 14:30");
    useHass({ time_zone: "Asia/Tokyo" }, { date_format: "YMD", time_format: "24", time_zone: "local" });
    const at = Date.UTC(2026, 7, 10, 5, 30); // 14:30 in Tokyo
    const local = browserTimeZone();
    expect(formatDateTime("2026-08-10T14:30:00", "en"), "on the browser's clock").to.equal(
      `${ymdIn(at, local)} ${minuteIn(at, local).slice(11)}`,
    );
  });

  it("chart ticks take the year from the shown zone", () => {
    const evening = Date.UTC(2026, 11, 31, 12); // Tokyo 21:00 31 Dec, New York 07:00
    const night = Date.UTC(2026, 11, 31, 16); // Tokyo 01:00 1 Jan, New York 11:00
    useHass({ time_zone: "Asia/Tokyo" }, { time_zone: "server" });
    expect(needsYear(evening, night)).to.equal(true);
    useHass({ time_zone: "America/New_York" }, { time_zone: "server" });
    expect(needsYear(evening, night)).to.equal(false);
    expect(needsYear(NaN, night), "no range, no crash").to.equal(false);
  });

  it("a snooze's end reads as 'today' on the shown clock", () => {
    const now = new Date(Date.UTC(2026, 7, 10, 12)); // Tokyo 21:00, New York 08:00
    const until = "2026-08-10T16:00:00+00:00"; // Tokyo 01:00 the next day, New York 12:00
    useHass({ time_zone: "Asia/Tokyo" }, { date_format: "YMD", time_format: "24", time_zone: "server" });
    expect(snoozedMessage({ hours: 4, snoozed_until: until }, "en", now)).to.contain("2026-08-11 01:00");
    useHass({ time_zone: "America/New_York" }, { date_format: "YMD", time_format: "24", time_zone: "server" });
    const text = snoozedMessage({ hours: 4, snoozed_until: until }, "en", now);
    expect(text).to.contain("12:00");
    expect(text).to.not.contain("2026-08-10");
  });

  it("the HA-zone hint shows only when the shown clock is not HA's", () => {
    useHass({ time_zone: browserTimeZone() }, { time_zone: "local" });
    expect(haTimeZoneHint("en")).to.equal("");
    const zone = farZone();
    useHass({ time_zone: zone }, { time_zone: "server" });
    expect(haTimeZoneHint("en"), "profile 'server': everything shows HA's clock already").to.equal("");
    useHass({ time_zone: zone }, { time_zone: "local" });
    expect(haTimeZoneHint("en")).to.equal(t("ha_time_zone_hint", "en").replace("{zone}", zone));
    expect(haTimeZoneHint("de")).to.contain(zone);
  });
});

describe("surfaces run on HA's clock (HA's zone far from the browser's)", () => {
  afterEach(resetZones);

  async function completeDialog(zone: string) {
    const { hass, sent } = createMockHass({
      handlers: { "maintenance_supporter/task/complete": () => ({ success: true }) },
    });
    Object.assign(hass, { config: { time_zone: zone }, locale: { language: "en", time_zone: "local" } });
    hostSync(hass); // the panel / card / dialog-mount that opens the dialog
    const el = await fixture<MaintenanceCompleteDialog>(html`
      <maintenance-complete-dialog
        .hass=${hass} .entryId=${"e1"} .taskId=${"t1"} .taskName=${"Filter"} .lang=${"en"}
      ></maintenance-complete-dialog>
    `);
    el.open();
    await el.updateComplete;
    el.shadowRoot!.querySelector<HTMLButtonElement>(".backdate-pick")!.click();
    await el.updateComplete;
    const field = el.shadowRoot!.querySelector("ms-date-field") as HTMLElement & { value: string; updateComplete: Promise<unknown> };
    await field.updateComplete;
    return { el, sent, field };
  }

  async function clickComplete(el: MaintenanceCompleteDialog): Promise<void> {
    const buttons = [...el.shadowRoot!.querySelectorAll(".dialog-actions ha-button")];
    (buttons[buttons.length - 1] as HTMLElement).click();
    await new Promise((r) => setTimeout(r, 10));
    await el.updateComplete;
  }

  /** The HA selector's value for an instant on HA's clock ("YYYY-MM-DD HH:MM:00"). */
  const haSelectorValue = (ms: number, zone: string) => `${minuteIn(ms, zone).replace("T", " ")}:00`;

  it("complete dialog: the back-date starts at HA's minute and names HA's zone", async () => {
    const zone = farZone();
    const before = Date.now();
    const { field } = await completeDialog(zone);
    const after = Date.now();
    expect([`${minuteIn(before, zone)}:00`, `${minuteIn(after, zone)}:00`]).to.include(field.value);
    expect(field.shadowRoot!.querySelector(".helper")?.textContent, "HA's zone named under the field").to.contain(zone);
  });

  it("complete dialog: a minute ago on HA's clock passes when HA is east of the browser", async () => {
    // Read on the browser's clock it was hours in the future: refused.
    const { el, sent, field } = await completeDialog(KIRITIMATI);
    const minuteAgo = haSelectorValue(Date.now() - 60000, KIRITIMATI);
    pickDateField(field, minuteAgo);
    await el.updateComplete;
    await clickComplete(el);
    const msg = sent.find((m) => m.type === "maintenance_supporter/task/complete");
    expect(msg, "accepted").to.exist;
    expect(msg!.completed_at, "still zone-less HA local time").to.equal(minuteAgo.replace(" ", "T"));
  });

  it("complete dialog: five minutes ahead on HA's clock is refused when HA is west of the browser", async () => {
    // Read on the browser's clock it was hours in the past: stored early.
    const { el, sent, field } = await completeDialog(GMT_MINUS_12);
    pickDateField(field, haSelectorValue(Date.now() + 5 * 60000, GMT_MINUS_12));
    await el.updateComplete;
    await clickComplete(el);
    expect(sent.find((m) => m.type === "maintenance_supporter/task/complete")).to.equal(undefined);
    expect(el.shadowRoot!.textContent).to.contain(t("completed_at_future_error", "en"));
  });

  it("history editor: shows HA's wall clock, names HA's zone, keeps an untouched stamp out of the patch", async () => {
    const zone = farZone();
    const { hass, sent } = createMockHass({
      handlers: {
        "maintenance_supporter/parts/overview": () => ({ parts: [] }),
        "maintenance_supporter/task/history/update": () => ({ success: true }),
      },
    });
    Object.assign(hass, { config: { time_zone: zone }, locale: { language: "en", time_zone: "local" } });
    hostSync(hass);
    const el = await fixture<MaintenanceHistoryEditDialog>(html`
      <maintenance-history-edit-dialog .hass=${hass}></maintenance-history-edit-dialog>`);
    // An imported stamp: its own digits are UTC, not HA local time.
    const stamp = "2026-07-01T10:00:00+00:00";
    el.openEdit({
      entry_id: "e1", task_id: "t1", original_timestamp: stamp, type: "completed", timestamp: stamp,
      notes: null, cost: null, duration: null, completed_by: null,
    });
    await el.updateComplete;
    const field = el.shadowRoot!.querySelector("ms-date-field") as HTMLElement & { value: string; updateComplete: Promise<unknown> };
    await field.updateComplete;
    expect(field.value, "the HA wall clock the zone-less value will mean").to.equal(`${minuteIn(Date.parse(stamp), zone)}:00`);
    expect(field.shadowRoot!.querySelector(".helper")?.textContent).to.contain(zone);
    const priv = el as unknown as { _set: (k: string, v: unknown) => void; _save: () => Promise<void> };
    priv._set("notes", "seal checked");
    await priv._save();
    const msg = sent.find((m) => m.type === "maintenance_supporter/task/history/update")!;
    expect(msg.original_timestamp).to.equal(stamp);
    expect("timestamp" in msg, "an untouched timestamp is not re-sent").to.equal(false);
  });

  it("quick actions: the reset date defaults to HA's today", async () => {
    const zone = farZone();
    const { hass, sent } = createMockHass({
      handlers: {
        "maintenance_supporter/object": () => ({
          entry_id: "e1", object: { id: "o1", name: "Pump" },
          tasks: [{ id: "t1", name: "Filter", type: "custom", schedule_type: "time_based", interval_days: 30, status: "ok", history: [] }],
        }),
        "maintenance_supporter/task/reset": () => ({ success: true }),
      },
    });
    Object.assign(hass, { user: { id: "admin", is_admin: true }, config: { time_zone: zone } });
    hostSync(hass);
    const el = await fixture<MaintenanceTaskQuickActionsDialog>(html`
      <maintenance-task-quick-actions-dialog .hass=${hass}></maintenance-task-quick-actions-dialog>`);
    await el.openFor("e1", "t1");
    expect((el as unknown as { _resetDate: string })._resetDate).to.equal(ymdIn(Date.now(), zone));
    await (el as unknown as { _onResetConfirm: () => Promise<void> })._onResetConfirm();
    expect(sent.find((m) => m.type === "maintenance_supporter/task/reset")?.date).to.equal(ymdIn(Date.now(), zone));
  });

  it("calendar card: the window and the Today marker start at HA's today", async () => {
    const zone = farZone();
    const today = ymdIn(Date.now(), zone);
    const task = (over: Record<string, unknown>) => ({
      id: "t1", name: "Task", type: "custom", schedule_type: "time_based", interval_days: 400, warning_days: 7,
      status: "ok", days_until_due: 5, next_due: today, trigger_active: false, history: [], enabled: true,
      archived: false, responsible_user_id: null, ...over,
    });
    const { hass } = createMockHass({
      handlers: {
        "maintenance_supporter/objects": () => ({
          objects: [{
            entry_id: "e1", object: { id: "o1", name: "Pool Pump", area_id: null, task_ids: [] },
            tasks: [
              task({ id: "late", name: "Late", status: "overdue", days_until_due: -3, next_due: addDaysIso(today, -3) }),
              task({ id: "soon", name: "Soon", days_until_due: 2, next_due: addDaysIso(today, 2) }),
            ],
          }],
        }),
        "maintenance_supporter/statistics": () => ({}),
      },
    });
    Object.assign(hass, { config: { time_zone: zone } });
    const el = await fixture<HTMLElement & { updateComplete: Promise<unknown> }>(html`
      <maintenance-supporter-calendar-card .hass=${hass}></maintenance-supporter-calendar-card>`);
    await new Promise((r) => setTimeout(r, 30));
    await el.updateComplete;
    const rows = [...el.shadowRoot!.querySelectorAll(".cal-day-row")];
    expect(rows[0].querySelector(".cal-day-pill")!.classList.contains("cal-today"), "the first day is HA's today").to.equal(true);
    expect(rows[0].querySelector(".cal-pill-day")!.textContent!.trim()).to.equal(String(Number(today.slice(8))));
    expect(rows[0].textContent, "an overdue task sits on HA's today").to.contain("Late");
    expect(rows[2].textContent, "next_due two HA days out").to.contain("Soon");
  });

  it("calendar past view: an imported '+00:00' stamp lands on its HA day", () => {
    const objects = [{
      entry_id: "e1", object: { id: "o1", name: "Pump" },
      tasks: [{ id: "t1", name: "Clean", schedule_type: "time_based", history: [{ timestamp: "2026-05-01T12:30:00+00:00", type: "completed" }] }],
    }] as never;
    const days = () => buildPastBuckets(objects, "2026-05-03", 7).filter((b) => b.events.length).map((b) => b.date);
    useHass({ time_zone: KIRITIMATI });
    expect(days(), "02:30 on 2 May in UTC+14").to.deep.equal(["2026-05-02"]);
    useHass({ time_zone: GMT_MINUS_12 });
    expect(days(), "00:30 on 1 May in UTC−12").to.deep.equal(["2026-05-01"]);
  });

  it("battery fleet: the forecast date counts from HA's today", async () => {
    const zone = farZone();
    const soon = {
      entity_id: "sensor.doorbell_battery_plus", device_name: "Doorbell", battery_type: "CR2032",
      quantity: 1, level: 40, days_until: 12, status: "soon",
    };
    const { hass } = createMockHass({
      handlers: {
        "maintenance_supporter/battery_fleet/overview": () => ({
          available: true, has_battery_notes: true, configured: true, task_ok: true, total: 1,
          low: [], soon: [], all: [soon], needs_now: {}, needs_soon: {}, types: ["CR2032"], excluded: [],
        }),
        "maintenance_supporter/battery_fleet/overview_history": () => ({ series: {} }),
      },
    });
    Object.assign(hass, { config: { time_zone: zone }, locale: { language: "en", date_format: "YMD" } });
    const el = await fixture<MaintenanceBatteryFleetSection>(html`
      <maintenance-battery-fleet-section .hass=${hass}></maintenance-battery-fleet-section>`);
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    const chip = el.shadowRoot!.querySelector("details.bf-roster .bf-predicted")!;
    expect(chip.textContent!.trim()).to.equal(`~${addDaysIso(ymdIn(Date.now(), zone), 12)}`);
  });

  it("area costs: months, years and the date filter are HA's", () => {
    // 12:30 UTC is already the next day in UTC+14 and still the same one in UTC−12.
    const history = [
      { timestamp: "2026-01-31T12:30:00+00:00", type: "completed", cost: 10 },
      { timestamp: "2025-12-31T12:30:00+00:00", type: "completed", cost: 5 },
    ] as unknown as HistoryEntry[];
    const objects = [{ entry_id: "e1", object: { name: "Pump", area_id: "garden" }, tasks: [{ id: "t1", name: "Clean", status: "ok", history }] }];
    const historyOf = (_entryId: string, task: { history?: HistoryEntry[] | null }) => task.history ?? [];
    const run = (zone: string) => {
      useHass({ time_zone: zone });
      const merged = mergeAreaHistory(objects, historyOf);
      return {
        months: costBuckets(merged, { from: "2025-12-01", to: "2026-02-28" }).buckets.map((b) => [b.key, b.cost]),
        year2026: summarizeAreas(objects, { showArchived: false, areas: undefined, noAreaLabel: "-", year: 2026, historyOf })[0].costYear,
        years: historyYears(merged, 2026),
        january: filterAreaHistory(merged, { from: "2026-01-01", to: "2026-01-31" }).map((e) => e.cost),
      };
    };
    expect(run(KIRITIMATI)).to.deep.equal({
      months: [["2025-12", 0], ["2026-01", 5], ["2026-02", 10]], year2026: 15, years: [2026], january: [5],
    });
    expect(run(GMT_MINUS_12)).to.deep.equal({
      months: [["2025-12", 5], ["2026-01", 10], ["2026-02", 0]], year2026: 10, years: [2026, 2025], january: [10],
    });
  });

  it("warranty: the days count from HA's today", () => {
    const zone = farZone();
    useHass({ time_zone: zone });
    const today = ymdIn(Date.now(), zone);
    expect(warrantyStatus(today)).to.deep.equal({ kind: "expiring", days: 0, date: today });
    const yesterday = addDaysIso(today, -1);
    expect(warrantyStatus(yesterday)).to.deep.equal({ kind: "expired", days: -1, date: yesterday });
  });

  it("the seasonal chart highlights HA's month", () => {
    const task = { seasonal_factor: 1.2, seasonal_factors: Array(12).fill(1) } as unknown as MaintenanceTask;
    const current = (zone: string): number => {
      useHass({ time_zone: zone });
      const host = document.createElement("div");
      render(renderSeasonalCardCompact(task, "en", { seasonal: true } as never), host);
      return [...host.querySelectorAll(".seasonal-bar")].findIndex((b) => b.classList.contains("current"));
    };
    // 31 Jan 12:30 UTC: already February in UTC+14, still January in UTC−12.
    const realNow = Date.now;
    Date.now = () => Date.UTC(2026, 0, 31, 12, 30);
    try {
      expect(current(KIRITIMATI)).to.equal(1);
      expect(current(GMT_MINUS_12)).to.equal(0);
    } finally {
      Date.now = realNow;
    }
  });
});

describe("tripwires: HA's clock, not the browser's (raw sources)", () => {
  let manifest: Record<string, string>;
  before(async () => {
    manifest = await (await fetch("/__source-manifest")).json();
  });

  /** Code lines only — a comment may name the banned spelling. */
  function codeLines(src: string): Array<[number, string]> {
    const out: Array<[number, string]> = [];
    let inBlock = false;
    src.split(/\r?\n/).forEach((line, i) => {
      const s = line.trim();
      if (inBlock) {
        if (s.includes("*/")) inBlock = false;
        return;
      }
      if (s.startsWith("//")) return;
      if (s.startsWith("/*")) {
        if (!s.includes("*/")) inBlock = true;
        return;
      }
      if (s.startsWith("*")) return;
      out.push([i + 1, line]);
    });
    return out;
  }

  function offenders(re: RegExp, allow: string[] = []): string[] {
    const hits: string[] = [];
    for (const [path, src] of Object.entries(manifest)) {
      if (allow.includes(path)) continue;
      for (const [n, line] of codeLines(src)) if (re.test(line)) hits.push(`${path}:${n}: ${line.trim()}`);
    }
    return hits;
  }

  const BROWSER_TODAY: Array<[string, RegExp]> = [
    ["isoDateLocal(new Date())", /\bisoDateLocal\(\s*new Date\(\s*\)\s*\)/],
    ["new Date().getFullYear() / getMonth() / getDate() / getDay()", /\bnew Date\(\s*\)\.get(?:FullYear|Month|Date|Day)\(/],
    ["toISOString().slice(0, 10)", /\.toISOString\(\)\.(?:slice|substring|substr)\(\s*0\s*,\s*10\s*\)/],
  ];

  it("no 'today' from the browser's clock outside helpers/ha-time", () => {
    for (const [label, re] of BROWSER_TODAY) {
      expect(offenders(re, ["helpers/ha-time.ts"]), `${label} is the browser's day — haToday() is HA's`).to.deep.equal([]);
    }
  });

  it("history timestamps parse through stampMs (a zone-less one is HA local time)", () => {
    expect(
      offenders(/new Date\(\s*[\w.?!]*\.timestamp\s*\)|Date\.parse\(\s*[\w.?!]*\.timestamp\b/),
      "new Date(x.timestamp) reads a zone-less stamp on the browser's clock — use stampMs",
    ).to.deep.equal([]);
  });

  it("every host feeds HA's zone into the profile prefs", () => {
    const hosts: string[] = [];
    const missing: string[] = [];
    for (const [path, src] of Object.entries(manifest)) {
      const code = codeLines(src).map(([, l]) => l).join("\n");
      for (const m of code.matchAll(/(?<!function )\bsetProfilePrefs\(([\s\S]*?)\);/g)) {
        hosts.push(path);
        if (!/\btime_zone\b/.test(m[1])) missing.push(`${path}: setProfilePrefs(${m[1].replace(/\s+/g, " ").trim()})`);
      }
    }
    expect(missing, "a host without config.time_zone leaves the schedule on the browser's clock").to.deep.equal([]);
    expect(hosts, "the rule still finds the hosts").to.include.members(["styles.ts", "dialog-mount.ts"]);
  });

  it("the rules still bite (guards against going stale)", () => {
    expect(BROWSER_TODAY[0][1].test("const ts = isoDateLocal(new Date());")).to.equal(true);
    expect(BROWSER_TODAY[1][1].test("const year = new Date().getFullYear();")).to.equal(true);
    expect(BROWSER_TODAY[2][1].test("const day = new Date().toISOString().slice(0, 10);")).to.equal(true);
    expect(manifest["helpers/ha-time.ts"]).to.match(/export function haToday\(/);
  });
});
