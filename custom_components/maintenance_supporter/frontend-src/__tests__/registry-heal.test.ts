/**
 * The card bundles' self-heal after Home Assistant's registry swap
 * (helpers/registry-heal.ts). Bug audit 2026-09-29: a re-import that took
 * longer than the check interval started the next one in parallel — three
 * fetches and evaluations of a ~450 KB bundle during boot on a slow phone —
 * and one flag per TAG let whichever bundle ran first (the panel carries the
 * calendar card too) silence the other's watch.
 */
import { expect } from "@open-wc/testing";
import { healCardRegistry } from "../helpers/registry-heal.js";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
let n = 0;
const missingTag = () => `ms-heal-test-${++n}-${Date.now()}`;

describe("card registry heal", () => {
  it("never runs two re-imports at once", async () => {
    const calls: string[] = [];
    let release!: () => void;
    const slow = new Promise<void>((r) => { release = r; });
    healCardRegistry([missingTag()], "https://ha.local/card-a.js", (url) => { calls.push(url); return slow; });
    await wait(1400); // checks at 250, 750 and 1250 ms
    expect(calls.length, "one re-import while the first is still loading").to.equal(1);
    release();
    await wait(600);
    expect(calls.length, "the next check may try again once it settled").to.equal(2);
  });

  it("watches per bundle file, and a healed copy stays quiet", async () => {
    const tag = missingTag();
    const calls: string[] = [];
    const record = (url: string) => { calls.push(new URL(url).pathname); return new Promise<void>(() => undefined); };
    healCardRegistry([tag], "https://ha.local/panel.js", record);
    healCardRegistry([tag], "https://ha.local/calendar-card.js", record);
    healCardRegistry([tag], "https://ha.local/calendar-card.js?heal=1", record);
    await wait(400);
    expect(calls.sort()).to.deep.equal(["/calendar-card.js", "/panel.js"]);
  });
});
