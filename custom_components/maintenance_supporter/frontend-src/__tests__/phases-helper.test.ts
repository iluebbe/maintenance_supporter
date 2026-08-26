/**
 * Pure-function tests for the task-phases helper (#139) — the frontend twin
 * of helpers/phases.py.
 *
 * Pins:
 *   - clampPhaseCursor mirrors the backend (garbage → 0, wrap via modulo)
 *   - hasPhases needs BOTH defs and a non-empty sequence
 *   - effectivePhase resolves the step currently due, with phase-set fields
 *     OVERRIDING task fields and unset ones falling through (never merged)
 *   - an out-of-range cursor (stale Store) still resolves via the clamp
 *   - a sequence id without a def resolves to null instead of throwing
 *   - phaseLabel renders "2/4 · Flip blades" and "" for phase-less tasks
 */

import { expect } from "@open-wc/testing";
import {
  clampPhaseCursor,
  effectivePhase,
  hasPhases,
  phaseLabel,
} from "../helpers/phases";

const PHASES = {
  swap: { name: "Swap cutting disks" },
  flip: { name: "Flip blades", checklist: ["Loosen screws", "Flip", "Torque"] },
  replace: {
    name: "Replace blades",
    consumes_parts: [{ part_id: "p_blades", quantity: 14 }],
    required_completion_fields: ["cost"],
  },
};
const SEQUENCE = ["swap", "flip", "swap", "replace"];

function task(over: Partial<any> = {}) {
  return {
    phases: PHASES,
    phase_sequence: SEQUENCE,
    phase_cursor: 0,
    checklist: ["Task-level step"],
    consumes_parts: [{ part_id: "p_oil", quantity: 1 }],
    required_completion_fields: ["notes"],
    ...over,
  };
}

describe("clampPhaseCursor", () => {
  it("passes valid cursors through and wraps out-of-range ones", () => {
    expect(clampPhaseCursor(0, 4)).to.equal(0);
    expect(clampPhaseCursor(3, 4)).to.equal(3);
    expect(clampPhaseCursor(99, 4)).to.equal(99 % 4);
  });

  it("maps garbage and negatives to 0", () => {
    expect(clampPhaseCursor("garbage", 4)).to.equal(0);
    expect(clampPhaseCursor(undefined, 4)).to.equal(0);
    expect(clampPhaseCursor(-3, 4)).to.equal(0);
    expect(clampPhaseCursor(2.9, 4)).to.equal(2);
  });

  it("returns 0 for an empty sequence", () => {
    expect(clampPhaseCursor(5, 0)).to.equal(0);
  });
});

describe("hasPhases", () => {
  it("needs both defs and a non-empty sequence", () => {
    expect(hasPhases(task())).to.equal(true);
    expect(hasPhases(task({ phases: null }))).to.equal(false);
    expect(hasPhases(task({ phase_sequence: [] }))).to.equal(false);
    expect(hasPhases(task({ phase_sequence: null }))).to.equal(false);
    expect(hasPhases(null)).to.equal(false);
  });
});

describe("effectivePhase", () => {
  it("is null for a phase-less task", () => {
    expect(effectivePhase(task({ phases: null }))).to.equal(null);
    expect(effectivePhase(null)).to.equal(null);
  });

  it("falls through to task fields when the phase is silent", () => {
    const p = effectivePhase(task({ phase_cursor: 0 }))!; // "swap" sets nothing
    expect(p.id).to.equal("swap");
    expect(p.index).to.equal(0);
    expect(p.count).to.equal(4);
    expect(p.checklist).to.deep.equal(["Task-level step"]);
    expect(p.consumesParts).to.deep.equal([{ part_id: "p_oil", quantity: 1 }]);
    expect(p.requiredFields).to.deep.equal(["notes"]);
  });

  it("overrides task fields when the phase speaks (override, not merge)", () => {
    const p = effectivePhase(task({ phase_cursor: 3 }))!; // "replace"
    expect(p.id).to.equal("replace");
    expect(p.consumesParts).to.deep.equal([{ part_id: "p_blades", quantity: 14 }]);
    expect(p.requiredFields).to.deep.equal(["cost"]);
    // replace sets no checklist → the TASK checklist falls through
    expect(p.checklist).to.deep.equal(["Task-level step"]);
  });

  it("uses the phase checklist when set", () => {
    const p = effectivePhase(task({ phase_cursor: 1 }))!; // "flip"
    expect(p.checklist).to.deep.equal(["Loosen screws", "Flip", "Torque"]);
  });

  it("clamps a stale out-of-range cursor instead of failing", () => {
    const p = effectivePhase(task({ phase_cursor: 99 }))!;
    expect(p.id).to.equal(SEQUENCE[99 % SEQUENCE.length]);
  });

  it("resolves to null when the sequence points at a missing def", () => {
    const p = effectivePhase(task({ phase_sequence: ["ghost"], phase_cursor: 0 }));
    expect(p).to.equal(null);
  });
});

describe("phaseLabel", () => {
  it('renders "2/4 · Flip blades"', () => {
    expect(phaseLabel(task({ phase_cursor: 1 }))).to.equal("2/4 · Flip blades");
  });

  it("is empty for phase-less tasks", () => {
    expect(phaseLabel(task({ phases: null }))).to.equal("");
    expect(phaseLabel(null)).to.equal("");
  });
});
