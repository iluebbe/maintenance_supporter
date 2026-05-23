/**
 * Unit-aware interval math (issue #59) — progress bars + calendar projection
 * must treat weeks/months/years as their real day-span, not the raw count.
 */
import { expect } from "@open-wc/testing";
import { intervalSpanDays, daysProgress } from "../helpers/interval";

describe("intervalSpanDays (#59)", () => {
  it("days = raw count", () => expect(intervalSpanDays(7, "days")).to.equal(7));
  it("weeks × 7", () => expect(intervalSpanDays(2, "weeks")).to.equal(14));
  it("months ≈ 30.44/mo", () =>
    expect(intervalSpanDays(3, "months")).to.be.closeTo(91.3, 0.5));
  it("years ≈ 365.25", () =>
    expect(intervalSpanDays(1, "years")).to.be.closeTo(365.25, 0.01));
  it("missing unit defaults to days", () =>
    expect(intervalSpanDays(5)).to.equal(5));
  it("zero / null → 0", () => {
    expect(intervalSpanDays(0, "years")).to.equal(0);
    expect(intervalSpanDays(null, "years")).to.equal(0);
  });
});

describe("daysProgress (#59)", () => {
  it("yearly task halfway → ~50% (pre-fix clamped to 0)", () => {
    const p = daysProgress(1, 182, "years");
    expect(p.pct).to.be.closeTo(50, 1);
    expect(p.overflow).to.equal(false);
  });
  it("yearly task overdue → 100% + overflow", () => {
    const p = daysProgress(1, -10, "years");
    expect(p.pct).to.equal(100);
    expect(p.overflow).to.equal(true);
  });
  it("days unit unchanged: just performed → 0%", () =>
    expect(daysProgress(30, 30, "days").pct).to.equal(0));
  it("days unit: due today → 100%", () =>
    expect(daysProgress(30, 0, "days").pct).to.equal(100));
  it("monthly task: 1 of ~30 days elapsed → small %", () => {
    const p = daysProgress(1, 29, "months");
    expect(p.pct).to.be.greaterThan(0);
    expect(p.pct).to.be.lessThan(15);
  });
  it("no interval / null countdown → 0", () => {
    expect(daysProgress(null, 5, "days").pct).to.equal(0);
    expect(daysProgress(30, null, "days").pct).to.equal(0);
  });
});
