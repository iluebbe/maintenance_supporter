/** Pure-function tests for the task-table windowing math (helpers/virtual-window).
 *
 * Pins:
 *   - the window covers the visible range plus overscan on both sides
 *   - start/end snap to the step grid (re-render churn control)
 *   - clamping at the top (scrollTop above the table) and at the bottom
 *   - spacer heights always add up: padTop + rendered + padBottom == total
 *   - degenerate inputs (0 rows, table far below viewport) stay sane
 *   - with measured heights (RowHeights) a scroll through rows of mixed
 *     height puts every row on screen and never shows a bare spacer
 */

import { expect } from "@open-wc/testing";
import { computeWindow, DEFAULT_ROW_HEIGHT, RowHeights, VIRTUAL_MIN_ROWS } from "../helpers/virtual-window.js";
import { panelStyles } from "../panel-styles.js";

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

/** The panel's loop in miniature: render the window, measure what was
 *  rendered, recompute until the window holds, then look at what the user
 *  sees (rendered rows laid out from the top spacer, at their real heights). */
function scrollThrough(heights: number[], viewport: number, stepPx: number) {
  const keys = heights.map((_, i) => `row${i}`);
  const cache = new RowHeights();
  cache.setWidth(1000);
  let start = 0;
  let end = Math.min(keys.length, 40);
  const seen = new Set<number>();
  const gaps: number[] = [];
  for (let scroll = 0; scroll < 1e6; scroll += stepPx) {
    for (let pass = 0; pass < 8; pass++) {
      for (let k = start; k < end; k++) cache.record(keys[k], heights[k]);
      const w = computeWindow({ scrollTop: scroll, viewportHeight: viewport, listTop: 0, offsets: cache.offsets(keys), total: keys.length });
      if (w.start === start && w.end === end) break;
      start = w.start;
      end = w.end;
    }
    const offsets = cache.offsets(keys);
    let y = offsets[start];
    // The rendered slice must cover the viewport, or the user sees a spacer.
    if (y > scroll && start > 0) gaps.push(scroll);
    for (let k = start; k < end; k++) {
      if (y < scroll + viewport && y + heights[k] > scroll) seen.add(k);
      y += heights[k];
    }
    if (y < scroll + viewport && end < keys.length) gaps.push(scroll);
    if (scroll > y + (offsets[keys.length] - offsets[end])) break;
  }
  return { seen, gaps };
}

describe("virtual-window with measured row heights", () => {
  it("offsets place the window on the row under the scroll position", () => {
    // 10 rows of 100 px, then 100 rows of 40 px: y=1400 is row 10 + 400/40 = 20.
    const heights = [...Array(10).fill(100), ...Array(100).fill(40)];
    const offsets = new Float64Array(heights.length + 1);
    heights.forEach((h, k) => { offsets[k + 1] = offsets[k] + h; });
    const w = computeWindow({ scrollTop: 1400, viewportHeight: 400, listTop: 0, offsets, total: heights.length, overscan: 0, step: 1 });
    expect(w.start).to.equal(20);
    expect(w.end).to.equal(31); // rows 20..30 cover 1400..1840
    expect(w.padTop).to.equal(1400);
    expect(w.padBottom).to.equal(offsets[heights.length] - offsets[31]);
  });

  it("a slow scroll through tall rows then short rows shows every row", () => {
    // The 2026-11-01 case: 78 sensor rows (~90 px) above 60 plain rows
    // (~47 px). With one mean height rows 78..95 never rendered.
    const heights = [...Array(78).fill(90), ...Array(60).fill(47)];
    const { seen, gaps } = scrollThrough(heights, 800, 150);
    const missing = heights.map((_, k) => k).filter((k) => !seen.has(k));
    expect(missing, `rows never on screen: ${missing.join(",")}`).to.deep.equal([]);
    expect(gaps, `blank viewport at scroll ${gaps.join(",")}`).to.deep.equal([]);
  });

  it("short rows then tall rows, and a mix, show every row too", () => {
    for (const heights of [
      [...Array(60).fill(47), ...Array(78).fill(90)],
      Array.from({ length: 300 }, (_, k) => (k % 7 === 0 ? 120 : k % 3 === 0 ? 90 : 47)),
    ]) {
      const { seen, gaps } = scrollThrough(heights, 700, 150);
      expect(heights.length - seen.size).to.equal(0);
      expect(gaps).to.deep.equal([]);
    }
  });

  it("the virtual table is no scroll anchor (reused rows ran the scroll off)", () => {
    // Live 2026-11-01: one 600 px wheel step went from 1200 to the end of
    // the list, because Chrome followed a recycled row element downwards.
    const rule = panelStyles.cssText.match(/\.task-table\.virtual\s*\{[^}]*\}/)?.[0] ?? "";
    expect(rule).to.contain("overflow-anchor: none");
  });

  it("RowHeights: unseen rows count as the mean, a width change forgets", () => {
    const h = new RowHeights();
    h.setWidth(800);
    expect(h.estimate).to.equal(DEFAULT_ROW_HEIGHT);
    h.record("a", 90);
    h.record("b", 50);
    h.record("c", 0); // a hidden table measures 0: ignored
    expect(h.estimate).to.equal(70);
    expect([...h.offsets(["a", "x", "b"])]).to.deep.equal([0, 90, 160, 210]);
    h.record("a", 100); // re-measured: replaces, does not add
    expect(h.estimate).to.equal(75);
    h.setWidth(800.4); // sub-pixel: same width
    expect(h.estimate).to.equal(75);
    h.setWidth(1200);
    expect(h.estimate).to.equal(DEFAULT_ROW_HEIGHT);
  });
});
