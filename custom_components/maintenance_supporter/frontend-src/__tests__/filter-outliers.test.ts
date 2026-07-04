/** Tests for the chart outlier filter (IQR fence). */

import { expect } from "@open-wc/testing";
import { filterOutliers } from "../renderers/sparkline.js";
import type { ChartPoint } from "../components/trigger-chart";

const pts = (vals: number[]): ChartPoint[] =>
  vals.map((val, i) => ({ ts: i * 1000, val }));

describe("filterOutliers", () => {
  it("drops a wild glitch reading (pressure 1.5–3 → 100)", () => {
    const input = pts([1.6, 1.8, 2.0, 2.2, 1.9, 2.1, 100, 1.7, 2.3, 1.5]);
    const out = filterOutliers(input);
    expect(out.map((p) => p.val)).to.not.include(100);
    expect(out.length).to.equal(input.length - 1);
  });

  it("keeps a normal spread untouched", () => {
    const input = pts([1.6, 1.8, 2.0, 2.2, 1.9, 2.1, 1.7, 2.3, 1.5, 2.0]);
    expect(filterOutliers(input).length).to.equal(input.length);
  });

  it("no-ops on short series (< 4 points)", () => {
    const input = pts([1, 100, 2]);
    expect(filterOutliers(input).length).to.equal(3);
  });

  it("never strips below a drawable series", () => {
    // Two extreme values, everything else identical → IQR fence could nuke both
    // ends, but we must keep at least 2 points.
    const input = pts([5, 5, 5, 5, 5, 5, 999, -999]);
    expect(filterOutliers(input).length).to.be.greaterThan(1);
  });

  it("returns the series unchanged when all values are identical (IQR 0)", () => {
    const input = pts([3, 3, 3, 3, 3]);
    expect(filterOutliers(input).length).to.equal(5);
  });
});
