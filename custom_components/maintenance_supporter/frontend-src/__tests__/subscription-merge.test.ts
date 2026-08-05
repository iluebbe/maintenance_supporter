/** The delta-subscription merge shared by panel and card (2.52).
 *
 *  Server contract (websocket/dashboard.py::ws_subscribe): a full
 *  `{objects}` replaces everything (legacy events + initial snapshot);
 *  `{delta, removed}` patches in place; an event that carries neither
 *  change returns null so callers skip the re-render entirely.
 */

import { expect } from "@open-wc/testing";
import { mergeSubscriptionEvent } from "../helpers/subscription-merge.js";

const a = { entry_id: "a", name: "A" };
const b = { entry_id: "b", name: "B" };

describe("mergeSubscriptionEvent", () => {
  it("a full objects payload replaces the list (legacy + snapshot)", () => {
    expect(mergeSubscriptionEvent([a], { objects: [b] })).to.deep.equal([b]);
  });

  it("a delta patches the matching entry in place, keeping order", () => {
    const a2 = { entry_id: "a", name: "A changed" };
    expect(mergeSubscriptionEvent([a, b], { delta: [a2] })).to.deep.equal([a2, b]);
  });

  it("an unknown delta entry is appended (new object)", () => {
    const c = { entry_id: "c", name: "C" };
    expect(mergeSubscriptionEvent([a], { delta: [c] })).to.deep.equal([a, c]);
  });

  it("removed entries drop out", () => {
    expect(mergeSubscriptionEvent([a, b], { removed: ["a"] })).to.deep.equal([b]);
  });

  it("an empty event returns null so callers skip the re-render", () => {
    expect(mergeSubscriptionEvent([a], { delta: [], removed: [] })).to.equal(null);
    expect(mergeSubscriptionEvent([a], {})).to.equal(null);
  });
});
