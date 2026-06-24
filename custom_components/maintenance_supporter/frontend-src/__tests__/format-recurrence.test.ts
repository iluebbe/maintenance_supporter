/** Unit tests for formatRecurrence — the single recurrence label for every
 *  schedule kind (Phase 4 calendar kinds). Weekday names come from Intl. */

import { expect } from "@open-wc/testing";
import { formatRecurrence, setLocale } from "../styles";
import de from "../locales/de.json";

describe("formatRecurrence", () => {
  // German strings are runtime-loaded (not bundled); seed the real table so the
  // localized-ordinal case exercises actual German, not the EN fallback.
  before(() => setLocale("de", de as Record<string, string>));

  it("interval → '6 Months'", () => {
    expect(formatRecurrence({ schedule: { kind: "interval", every: 6, unit: "months" } }, "en")).to.equal("6 Months");
  });
  it("nth_weekday → '1st Saturday'", () => {
    expect(formatRecurrence({ schedule: { kind: "nth_weekday", nth: 1, weekday: 5 } }, "en")).to.equal("1st Saturday");
  });
  it("nth_weekday last → 'Last Saturday'", () => {
    expect(formatRecurrence({ schedule: { kind: "nth_weekday", nth: -1, weekday: 5 } }, "en")).to.equal("Last Saturday");
  });
  it("weekdays → 'Mon & Thu'", () => {
    expect(formatRecurrence({ schedule: { kind: "weekdays", weekdays: [0, 3] } }, "en")).to.equal("Mon & Thu");
  });
  it("day_of_month → 'Day 15'", () => {
    expect(formatRecurrence({ schedule: { kind: "day_of_month", day: 15 } }, "en")).to.equal("Day 15");
  });
  it("manual → 'Manual'", () => {
    expect(formatRecurrence({ schedule: { kind: "manual" } }, "en")).to.equal("Manual");
  });
  it("one_time → due date", () => {
    expect(formatRecurrence({ schedule: { kind: "one_time" }, due_date: "2026-09-01" }, "en")).to.contain("2026");
  });
  it("legacy flat interval (no nested schedule) → '30 Days'", () => {
    expect(formatRecurrence({ interval_days: 30, interval_unit: "days", schedule_type: "time_based" }, "en")).to.equal("30 Days");
  });
  it("German nth_weekday → '1. Samstag'", () => {
    expect(formatRecurrence({ schedule: { kind: "nth_weekday", nth: 1, weekday: 5 } }, "de")).to.equal("1. Samstag");
  });
  it("empty weekdays → em dash", () => {
    expect(formatRecurrence({ schedule: { kind: "weekdays", weekdays: [] } }, "en")).to.equal("—");
  });
});
