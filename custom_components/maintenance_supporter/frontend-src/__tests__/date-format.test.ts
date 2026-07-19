/** Unit tests for formatDate/formatDateTime honouring HA's per-user profile
 *  date/time format (issue #97 — dates followed only the UI language, so an
 *  English UI always showed mm/dd/yyyy even with dd/mm/yyyy configured). */

import { expect } from "@open-wc/testing";
import { formatDate, formatDateTime, setDateTimePrefs } from "../styles";

const reset = () => setDateTimePrefs({ date_format: undefined, time_format: undefined });

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
