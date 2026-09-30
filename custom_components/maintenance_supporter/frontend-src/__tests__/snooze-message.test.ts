/** #193: a snooze names its duration and end — the task itself shows no
 *  change, and a bare "Snoozed" left people wondering what happened. */

import { expect } from "@open-wc/testing";
import { snoozedMessage } from "../helpers/snooze.js";

describe("snoozedMessage", () => {
  const now = new Date(2026, 9, 1, 14, 0);

  it("hours and the time of day when it ends today", () => {
    const until = new Date(2026, 9, 1, 18, 30).toISOString();
    const text = snoozedMessage({ hours: 4, snoozed_until: until }, "en", now);
    expect(text).to.include("4 hours");
    expect(text).to.match(/6:30|18:30/);
  });

  it("the singular for one hour", () => {
    const until = new Date(2026, 9, 1, 15, 0).toISOString();
    expect(snoozedMessage({ hours: 1, snoozed_until: until }, "en", now)).to.include("one hour");
  });

  it("the date too when it ends another day", () => {
    const until = new Date(2026, 9, 3, 14, 0).toISOString();
    expect(snoozedMessage({ hours: 48, snoozed_until: until }, "en", now)).to.match(/10\/0?3\/2026|2026-10-03|0?3\.10\.2026/);
  });

  it("an older backend without the fields gets the plain word", () => {
    expect(snoozedMessage({}, "en", now)).to.equal("Snoozed");
    expect(snoozedMessage(null, "en", now)).to.equal("Snoozed");
  });
});
