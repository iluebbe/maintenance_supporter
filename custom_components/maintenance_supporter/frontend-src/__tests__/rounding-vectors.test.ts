/**
 * DRY audit 2026-10-30, X6-A1: the panel and the backend round money and
 * part quantities one way. Python's round() sent a half to the even
 * neighbour: a total of 4.50 for four showed 1.13 each and was stored as
 * 1.12. tests/test_dry_round6_t2.py reads the same vectors.
 */

import { expect } from "@open-wc/testing";
import { restockUnits, round2 } from "../helpers/parts-cost.js";
import fixture from "./fixtures/rounding-vectors.json";

describe("two decimals, a half up (X6-A1)", () => {
  it("round2 gives every expected value of the shared vectors", () => {
    const vectors: number[][] = fixture.vectors;
    expect(vectors.length).to.be.greaterThan(10);
    for (const [input, expected] of vectors) {
      expect(round2(input), String(input)).to.equal(expected);
    }
  });

  it("the purchase dialog's price each and the restock units use it", () => {
    expect(round2(4.5 / 4)).to.equal(1.13);
    expect(restockUnits({ restock_quantity: 0.125, package_size: null })).to.equal(0.13);
  });
});
