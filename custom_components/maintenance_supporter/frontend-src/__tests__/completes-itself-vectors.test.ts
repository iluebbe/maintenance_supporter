/**
 * D#250 follow-up: the rows and the reminders decide "completes itself" by
 * one rule. tests/test_completes_itself_250.py reads the same vectors for
 * helpers/completes_itself.py, which takes Complete and Skip off the push.
 */

import { expect } from "@open-wc/testing";
import { canHoldUntilDone, completesItself } from "../helpers/completes-itself.js";
import type { TriggerConfig } from "../types.js";
import fixture from "./fixtures/completes-itself-vectors.json";

interface Vector {
  note: string;
  trigger_config: Record<string, unknown> | null;
  trigger_active: boolean | null;
  expected: boolean;
}

describe("completes itself, the shared vectors (D#250)", () => {
  it("gives every expected value", () => {
    const vectors = fixture.vectors as Vector[];
    expect(vectors.length).to.be.greaterThan(10);
    for (const v of vectors) {
      const got = completesItself({ trigger_config: v.trigger_config as TriggerConfig | null, trigger_active: v.trigger_active });
      expect(got, v.note).to.equal(v.expected);
    }
  });
});

describe("which rules may hold until done (D#229, one list with the backend)", () => {
  it("a level or a state latch; no counter, runtime, change counter or compound", () => {
    expect(canHoldUntilDone({ type: "threshold" })).to.equal(true);
    expect(canHoldUntilDone({ type: "due_date" })).to.equal(true);
    expect(canHoldUntilDone({ type: "state_change", trigger_to_state: "finished" })).to.equal(true);
    expect(canHoldUntilDone({ type: "state_change" }), "any change").to.equal(false);
    expect(canHoldUntilDone({ type: "state_change", trigger_to_state: "on", trigger_target_changes: 3 })).to.equal(false);
    expect(canHoldUntilDone({ type: "counter" })).to.equal(false);
    expect(canHoldUntilDone({ type: "compound" })).to.equal(false);
  });
});
