/** Unit tests for formatDate/formatDateTime honouring HA's per-user profile
 *  date/time format (issue #97 — dates followed only the UI language, so an
 *  English UI always showed mm/dd/yyyy even with dd/mm/yyyy configured). */

import { expect } from "@open-wc/testing";
import { formatDate, formatDateTime, formatDateShort, formatTimeOfDay, formatWeekday, formatMonth, weekdayName, monthName, setDateTimePrefs } from "../styles";
import { fmtDateTick, fmtDateTime } from "../renderers/chart-utils";

const reset = () => setDateTimePrefs({ date_format: undefined, time_format: undefined }, null);

describe("formatDate with HA profile date_format (#97)", () => {
  afterEach(reset);

  it("DMY renders dd/mm/yyyy regardless of language", () => {
    setDateTimePrefs({ date_format: "DMY" });
    expect(formatDate("2026-08-10", "en")).to.equal("10/08/2026");
    expect(formatDate("2026-08-10", "de")).to.equal("10/08/2026");
  });

  it("MDY renders mm/dd/yyyy regardless of language", () => {
    setDateTimePrefs({ date_format: "MDY" });
    expect(formatDate("2026-08-10", "de")).to.equal("08/10/2026");
  });

  it("YMD renders yyyy-mm-dd", () => {
    setDateTimePrefs({ date_format: "YMD" });
    expect(formatDate("2026-08-10", "en")).to.equal("2026-08-10");
  });

  it('"language" / unset keeps the language-derived format (backwards compatible)', () => {
    setDateTimePrefs({ date_format: "language" });
    expect(formatDate("2026-08-10", "en")).to.equal("08/10/2026"); // en → en-US
    expect(formatDate("2026-08-10", "de")).to.equal("10.08.2026"); // de → de-DE
    reset();
    expect(formatDate("2026-08-10", "de")).to.equal("10.08.2026");
  });

  it("pl/cs/sv derive their own locale, not en-US (live-check find)", () => {
    setDateTimePrefs({ date_format: "language" });
    // These three were missing from langToLocale and silently rendered
    // US-ordered dates. Day must come before month for all of them.
    expect(formatDate("2026-08-10", "pl")).to.equal("10.08.2026");
    expect(formatDate("2026-08-10", "cs")).to.equal("10. 08. 2026"); // Czech spaces its dots
    expect(formatDate("2026-08-10", "sv")).to.equal("2026-08-10"); // sv-SE = ISO order
    reset();
  });

  it("null/invalid input unchanged by prefs", () => {
    setDateTimePrefs({ date_format: "DMY" });
    expect(formatDate(null, "en")).to.equal("—");
  });
});

describe("formatDateTime with HA profile time_format (#97)", () => {
  afterEach(reset);

  it("24 forces 24h clock even for en", () => {
    setDateTimePrefs({ date_format: "DMY", time_format: "24" });
    expect(formatDateTime("2026-08-10T14:30:00", "en")).to.equal("10/08/2026 14:30");
  });

  it("12 forces a 12h clock even for de", () => {
    setDateTimePrefs({ date_format: "DMY", time_format: "12" });
    const out = formatDateTime("2026-08-10T14:30:00", "de");
    expect(out.startsWith("10/08/2026 ")).to.be.true;
    expect(out).to.match(/2:30/);
    expect(out.toLowerCase()).to.match(/pm|nachm/);
  });
});

describe("server country regionalizes the language default (#140)", () => {
  afterEach(reset);

  it('"en" + AU renders dd/mm/yyyy without any profile setting', () => {
    setDateTimePrefs({ date_format: "language" }, "AU");
    expect(formatDate("2026-08-10", "en")).to.equal("10/08/2026");
  });

  it('"en" + US keeps mm/dd/yyyy; "de" + AT stays dd.mm.yyyy', () => {
    setDateTimePrefs({ date_format: "language" }, "US");
    expect(formatDate("2026-08-10", "en")).to.equal("08/10/2026");
    setDateTimePrefs({ date_format: "language" }, "AT");
    expect(formatDate("2026-08-10", "de")).to.equal("10.08.2026");
  });

  it("an explicit profile format always beats the country", () => {
    setDateTimePrefs({ date_format: "MDY" }, "AU");
    expect(formatDate("2026-08-10", "en")).to.equal("08/10/2026");
    setDateTimePrefs({ date_format: "YMD" }, "AU");
    expect(formatDate("2026-08-10", "en")).to.equal("2026-08-10");
  });

  it("garbage/unset country falls back to the language mapping", () => {
    setDateTimePrefs({ date_format: "language" }, "!!");
    expect(formatDate("2026-08-10", "en")).to.equal("08/10/2026");
    setDateTimePrefs({ date_format: "language" }, null);
    expect(formatDate("2026-08-10", "en")).to.equal("08/10/2026");
  });

  it("country survives a later prefs update that omits it (undefined ≠ clear)", () => {
    setDateTimePrefs({ date_format: "language" }, "AU");
    setDateTimePrefs({ date_format: "language" });
    expect(formatDate("2026-08-10", "en")).to.equal("10/08/2026");
  });
});

describe("name-style helpers + chart labels route through styles.ts (#163 DRY)", () => {
  afterEach(reset);

  it("formatTimeOfDay follows the profile time format", () => {
    const d = new Date(2026, 7, 10, 14, 30);
    setDateTimePrefs({ time_format: "24" });
    expect(formatTimeOfDay(d, "en")).to.equal("14:30");
    setDateTimePrefs({ time_format: "12" });
    expect(formatTimeOfDay(d, "de")).to.match(/2:30/);
    expect(formatTimeOfDay(d, "de").toLowerCase()).to.match(/pm|nachm/);
  });

  it("formatDateShort: day+month in the UI language, optional 2-digit year", () => {
    const d = new Date(2026, 6, 3);
    expect(formatDateShort(d, "en")).to.equal("Jul 3");
    expect(formatDateShort(d, "de")).to.equal("3. Juli");
    expect(formatDateShort(d, "en", true)).to.match(/^Jul 3, ?26$/);
  });

  it("weekday / month names come from the UI language, indexed Mon=0 / Jan=0", () => {
    expect(weekdayName(0, "en", "short")).to.equal("Mon");
    expect(weekdayName(6, "de", "long")).to.equal("Sonntag");
    expect(monthName(0, "en", "short")).to.equal("Jan");
    expect(monthName(11, "de", "long")).to.equal("Dezember");
    const sun = new Date(2026, 6, 5); // 2026-07-05 is a Sunday
    expect(formatWeekday(sun, "en", "short")).to.equal("Sun");
    expect(formatMonth(sun, "de", "long")).to.equal("Juli");
  });

  it("chart crosshair label honours the profile time format (was browser/language-only)", () => {
    const ts = new Date(2026, 6, 3, 14, 30).getTime();
    setDateTimePrefs({ time_format: "24" });
    expect(fmtDateTime(ts, "en")).to.equal("Jul 3, 14:30");
    setDateTimePrefs({ time_format: "12" });
    expect(fmtDateTime(ts, "de")).to.match(/^3\. Juli, .*2:30/);
    expect(fmtDateTick(ts, "en", false)).to.equal("Jul 3");
  });
});
