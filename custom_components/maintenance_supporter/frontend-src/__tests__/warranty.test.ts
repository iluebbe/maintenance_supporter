/**
 * Warranty status classification (#67) — pure + today-injectable.
 *
 * Pins the 4 states and the 60-day amber threshold so the object-detail chip
 * and the objects-table column stay in lockstep with the backend field.
 */
import { expect } from "@open-wc/testing";
import { warrantyStatus, WARRANTY_WARN_DAYS } from "../helpers/warranty";

const TODAY = new Date(2026, 5, 1); // 2026-06-01 local

describe("warrantyStatus (#67)", () => {
  it("null / undefined / empty / invalid → none", () => {
    expect(warrantyStatus(null, TODAY).kind).to.equal("none");
    expect(warrantyStatus(undefined, TODAY).kind).to.equal("none");
    expect(warrantyStatus("", TODAY).kind).to.equal("none");
    expect(warrantyStatus("not-a-date", TODAY).kind).to.equal("none");
  });

  it("far future → valid", () => {
    const s = warrantyStatus("2027-06-01", TODAY);
    expect(s.kind).to.equal("valid");
    expect(s.days).to.equal(365);
  });

  it("61 days out (just past threshold) → valid", () => {
    const s = warrantyStatus("2026-08-01", TODAY); // Jun1 -> Aug1 = 61d
    expect(s.days).to.equal(61);
    expect(s.kind).to.equal("valid");
  });

  it("exactly the warn threshold (60d) → expiring", () => {
    const s = warrantyStatus("2026-07-31", TODAY); // Jun1 -> Jul31 = 60d
    expect(s.days).to.equal(WARRANTY_WARN_DAYS);
    expect(s.kind).to.equal("expiring");
  });

  it("within threshold → expiring", () => {
    const s = warrantyStatus("2026-06-30", TODAY); // 29d
    expect(s.kind).to.equal("expiring");
    expect(s.days).to.equal(29);
  });

  it("today → expiring (0 days)", () => {
    const s = warrantyStatus("2026-06-01", TODAY);
    expect(s.kind).to.equal("expiring");
    expect(s.days).to.equal(0);
  });

  it("past → expired (negative days)", () => {
    const s = warrantyStatus("2026-05-20", TODAY);
    expect(s.kind).to.equal("expired");
    expect(s.days).to.equal(-12);
  });

  it("echoes the ISO date back (null when absent)", () => {
    expect(warrantyStatus("2027-06-01", TODAY).date).to.equal("2027-06-01");
    expect(warrantyStatus("2026-05-20", TODAY).date).to.equal("2026-05-20");
    expect(warrantyStatus(null, TODAY).date).to.equal(null);
  });
});
