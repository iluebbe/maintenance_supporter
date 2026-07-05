/** Pure-function tests for the task-table windowing math (helpers/virtual-window).
 *
 * Pins:
 *   - the window covers the visible range plus overscan on both sides
 *   - start/end snap to the step grid (re-render churn control)
 *   - clamping at the top (scrollTop above the table) and at the bottom
 *   - spacer heights always add up: padTop + rendered + padBottom == total
 *   - degenerate inputs (0 rows, table far below viewport) stay sane
 */

import { expect } from "@open-wc/testing";
import { computeWindow, VIRTUAL_MIN_ROWS } from "../helpers/virtual-window.js";

const BASE = {
  viewportHeight: 500,
  listTop: 200,
  rowHeight: 50,
  total: 500,
  overscan: 12,
  step: 6,
};

function invariant(w: { start: number; end: number; padTop: number; padBottom: number }) {
  expect(w.start).to.be.at.least(0);
  expect(w.end).to.be.at.most(BASE.total);
  expect(w.start).to.be.at.most(w.end);
  expect(w.padTop).to.equal(w.start * BASE.rowHeight);
  expect(w.padBottom).to.equal((BASE.total - w.end) * BASE.rowHeight);
}

describe("virtual-window", () => {
  it("at the top the window starts at 0 with no top pad", () => {
    const w = computeWindow({ ...BASE, scrollTop: 0 });
    expect(w.start).to.equal(0);
    expect(w.padTop).to.equal(0);
    // 10 visible + 1 + 12 overscan, snapped up to a step multiple.
    expect(w.end).to.be.at.least(23);
    expect(w.end).to.be.at.most(30);
    invariant(w);
  });

  it("mid-scroll covers the visible range plus overscan", () => {
    // scrollTop 1200 → firstVisible = (1200-200)/50 = row 20
    const w = computeWindow({ ...BASE, scrollTop: 1200 });
    expect(w.start).to.be.at.most(20 - BASE.overscan + BASE.step); // ≤ snapped(8)
    expect(w.start).to.be.at.least(0);
    expect(w.end).to.be.at.least(20 + 11); // last visible row rendered
    expect(w.start % BASE.step).to.equal(0);
    invariant(w);
  });

  it("start/end snap to the step grid", () => {
    const a = computeWindow({ ...BASE, scrollTop: 1200 });
    const b = computeWindow({ ...BASE, scrollTop: 1200 + 49 }); // < 1 row later
    // A sub-row scroll may shift the window at most one step, never per-pixel.
    expect(Math.abs(b.start - a.start) % BASE.step).to.equal(0);
  });

  it("clamps at the bottom: end == total and no bottom pad", () => {
    const w = computeWindow({ ...BASE, scrollTop: 200 + 500 * 50 }); // past the end
    expect(w.end).to.equal(BASE.total);
    expect(w.padBottom).to.equal(0);
    invariant(w);
  });

  it("scrolled above the table (negative firstVisible) starts at 0", () => {
    const w = computeWindow({ ...BASE, scrollTop: 0, listTop: 5000 });
    expect(w.start).to.equal(0);
    expect(w.padTop).to.equal(0);
    expect(w.end).to.be.greaterThan(0);
  });

  it("total 0 → empty window", () => {
    const w = computeWindow({ ...BASE, scrollTop: 0, total: 0 });
    expect(w).to.deep.equal({ start: 0, end: 0, padTop: 0, padBottom: 0 });
  });

  it("pads + rendered slice always account for every row", () => {
    for (const scrollTop of [0, 137, 999, 5000, 12345, 26000]) {
      const w = computeWindow({ ...BASE, scrollTop });
      const rendered = w.end - w.start;
      expect(w.padTop + rendered * BASE.rowHeight + w.padBottom)
        .to.equal(BASE.total * BASE.rowHeight);
    }
  });

  it("exports a sane virtualization threshold", () => {
    expect(VIRTUAL_MIN_ROWS).to.be.greaterThan(50);
  });
});
