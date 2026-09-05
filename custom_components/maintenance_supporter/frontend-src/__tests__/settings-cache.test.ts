/**
 * helpers/settings-cache: the page-wide settings cache the Lovelace dialogs
 * and cards read (bug review 2026-09-04).
 *
 *   - one fetch per page, shared through window.__msSettingsCache
 *   - a FAILED fetch is not cached: the fallback is served once, the next
 *     reader asks again
 *   - invalidateSettingsCache() (called after global/update) makes the next
 *     reader fetch fresh — the card follows a style change without a reload
 */

import { expect } from "@open-wc/testing";
import { FALLBACK_SETTINGS, fetchSettingsOnce, invalidateSettingsCache } from "../helpers/settings-cache.js";

type Slot = { promise: Promise<unknown> | null };
const win = window as unknown as { __msSettingsCache?: Slot };

function hassWith(answer: () => Promise<unknown>) {
  let calls = 0;
  const hass = {
    connection: {
      sendMessagePromise: () => {
        calls += 1;
        return answer();
      },
    },
  } as never;
  return { hass, calls: () => calls };
}

describe("settings cache (page-wide)", () => {
  beforeEach(() => invalidateSettingsCache());

  it("fetches once and serves every later reader from the shared slot", async () => {
    const { hass, calls } = hassWith(async () => ({ general: { row_action_style: "icons", default_warning_days: 3 } }));
    const first = await fetchSettingsOnce(hass);
    const second = await fetchSettingsOnce(hass);
    expect(first.rowActionStyle).to.equal("icons");
    expect(first.defaultWarningDays).to.equal(3);
    expect(second).to.equal(first);
    expect(calls()).to.equal(1);
    // Boolean assertions on purpose: a Promise inside a failed chai message
    // wedges the test runner's error serialiser.
    expect(win.__msSettingsCache?.promise != null, "the slot is the window singleton").to.be.true;
  });

  it("a failed fetch serves the fallback once and asks again next time", async () => {
    let fail = true;
    const { hass, calls } = hassWith(async () => {
      if (fail) throw new Error("ws down");
      return { general: { row_action_style: "icons" } };
    });
    const first = await fetchSettingsOnce(hass);
    expect(first).to.equal(FALLBACK_SETTINGS);
    expect(win.__msSettingsCache?.promise === null, "rejection not retained").to.be.true;

    fail = false;
    const second = await fetchSettingsOnce(hass);
    expect(second.rowActionStyle).to.equal("icons");
    expect(calls()).to.equal(2);
  });

  it("invalidateSettingsCache() makes the next reader fetch the new settings", async () => {
    let style = "buttons_compact";
    const { hass, calls } = hassWith(async () => ({ general: { row_action_style: style } }));
    expect((await fetchSettingsOnce(hass)).rowActionStyle).to.equal("buttons_compact");

    style = "icons";
    expect((await fetchSettingsOnce(hass)).rowActionStyle, "still the cached answer").to.equal("buttons_compact");
    invalidateSettingsCache();
    expect((await fetchSettingsOnce(hass)).rowActionStyle).to.equal("icons");
    expect(calls()).to.equal(2);
  });

  it("a late failure does not wipe a fresher fetch that replaced it", async () => {
    let release: (() => void) | null = null;
    const slow = new Promise<never>((_, rej) => { release = () => rej(new Error("late")); });
    const { hass: slowHass } = hassWith(() => slow);
    const pending = fetchSettingsOnce(slowHass);

    invalidateSettingsCache();
    const { hass: freshHass } = hassWith(async () => ({ general: { row_action_style: "icons" } }));
    const fresh = fetchSettingsOnce(freshHass);
    expect(await fresh).to.include({ rowActionStyle: "icons" });

    release!();
    expect(await pending).to.equal(FALLBACK_SETTINGS);
    expect(win.__msSettingsCache?.promise === fresh, "the fresh promise survives").to.be.true;
  });
});
