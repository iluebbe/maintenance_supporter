/** Pure-function tests for the split-view pane docking (helpers/sticky-pane).
 *
 * Pins:
 *   - a pane that fits the viewport is plain top-sticky, always
 *   - a taller pane releases from the top edge on the first downward scroll
 *     (bottom mode, natural position pinned where it was) and hands back to
 *     top mode only once its top edge re-enters the viewport on the way up
 *   - the pinned margin never exceeds the list height (the grid row must not
 *     grow), and a list shorter than the pane means "no docking at all"
 *   - stickyTop(): 8px in top mode, negative bottom-anchor in bottom mode
 *   - stickyStateOnSelect(): a selection parks the pane at the viewport top;
 *     at the tail of the list that means growing the row (margin), never
 *     "the detail opened 2000px above you"
 */

import { expect } from "@open-wc/testing";
import {
  INITIAL_STICKY,
  nextStickyState,
  STICKY_GAP,
  stickyStateOnSelect,
  stickyTop,
  type StickyMetrics,
  type StickyState,
} from "../helpers/sticky-pane.js";

const TALL: StickyMetrics = {
  scrollTop: 0,
  viewH: 800,
  paneH: 1400,
  listH: 5000,
  layoutTop: 300,
  renderedTop: 300,
};

describe("sticky-pane", () => {
  it("a pane that fits stays top-sticky with no margin whatever the scroll does", () => {
    let s: StickyState = INITIAL_STICKY;
    for (const scrollTop of [0, 400, 900, 300, 0]) {
      s = nextStickyState(s, { ...TALL, paneH: 500, scrollTop, renderedTop: scrollTop + STICKY_GAP });
      expect(s.mode).to.equal("top");
      expect(s.marginTop).to.equal(0);
    }
    expect(stickyTop("top", { viewH: 800, paneH: 500 })).to.equal(STICKY_GAP);
  });

  it("a list shorter than the pane never docks (nothing to dock against)", () => {
    const s = nextStickyState(INITIAL_STICKY, { ...TALL, listH: 1000, scrollTop: 600, renderedTop: 300 });
    expect(s.mode).to.equal("top");
    expect(s.marginTop).to.equal(0);
  });

  it("scrolling down releases a tall pane from the top edge and pins its natural spot", () => {
    // Top-stuck at scrollTop 1000: rendered at 1008.
    const s = nextStickyState({ ...INITIAL_STICKY, lastScrollTop: 990 }, { ...TALL, scrollTop: 1000, renderedTop: 1008 });
    expect(s.mode).to.equal("bottom");
    expect(s.marginTop).to.equal(1008 - TALL.layoutTop);
    // Bottom anchor: top = viewH - paneH - gap (negative for a tall pane).
    expect(stickyTop(s.mode, TALL)).to.equal(800 - 1400 - STICKY_GAP);
  });

  it("scrolling up from the bottom edge releases, then hands over to top mode when the top edge is back in view", () => {
    // Bottom-stuck deep in the list: rendered = scrollTop + (viewH - paneH - gap).
    const stuck: StickyState = { mode: "bottom", marginTop: 700, lastScrollTop: 3000 };
    const s1 = nextStickyState(stuck, { ...TALL, scrollTop: 2990, renderedTop: 2990 + 800 - 1400 - STICKY_GAP });
    expect(s1.mode, "released, still bottom mode").to.equal("bottom");
    expect(s1.marginTop).to.equal(2990 + 800 - 1400 - STICKY_GAP - TALL.layoutTop);
    // Keep scrolling up: the pane travels with the list (rendered == natural)
    // until its top edge reaches the viewport top + gap.
    const natural = TALL.layoutTop + s1.marginTop;
    const s2 = nextStickyState(s1, { ...TALL, scrollTop: natural + 100, renderedTop: natural });
    expect(s2.mode).to.equal("bottom");
    expect(s2.marginTop).to.equal(s1.marginTop);
    const s3 = nextStickyState(s2, { ...TALL, scrollTop: natural - STICKY_GAP, renderedTop: natural });
    expect(s3.mode).to.equal("top");
    expect(s3.marginTop).to.equal(0);
  });

  it("the pinned margin is clamped so the grid row never outgrows the list", () => {
    const stuck: StickyState = { mode: "bottom", marginTop: 0, lastScrollTop: 4800 };
    const s = nextStickyState(stuck, { ...TALL, scrollTop: 4790, renderedTop: 4600 });
    expect(s.marginTop).to.be.at.most(TALL.listH - TALL.paneH);
  });

  it("at the tail of the list a top-stuck pane stays in top mode (the grid area already parks it)", () => {
    const s = nextStickyState(
      { ...INITIAL_STICKY, lastScrollTop: 4000 },
      { ...TALL, scrollTop: 4100, renderedTop: TALL.layoutTop + TALL.listH - TALL.paneH + 50 },
    );
    expect(s.mode).to.equal("top");
    expect(s.marginTop).to.equal(0);
  });

  it("selection near the top: plain top-sticky, margin 0", () => {
    expect(stickyStateOnSelect({ ...TALL, scrollTop: 0 })).to.deep.equal({ mode: "top", marginTop: 0, lastScrollTop: 0 });
    // Scrolled into the list but the row still has room below: sticky
    // reaches the viewport top by itself.
    expect(stickyStateOnSelect({ ...TALL, scrollTop: 2000 })).to.deep.equal({ mode: "top", marginTop: 0, lastScrollTop: 2000 });
  });

  it("selection at the tail of the list parks the pane where the user is looking (row grows)", () => {
    // listH 5000, paneH 1400 → sticky can reach a natural offset of at most
    // 3600. At scrollTop 4500 the viewport top is 4200 below the layout: park there.
    const s = stickyStateOnSelect({ ...TALL, scrollTop: 4500 });
    expect(s.mode).to.equal("top");
    expect(s.marginTop).to.equal(4500 + STICKY_GAP - TALL.layoutTop);
    // Scrolling DOWN keeps the parked margin (the row end is where the pane
    // lives now; the rest of a tall detail scrolls into view) …
    const down = nextStickyState(s, { ...TALL, scrollTop: 4600, renderedTop: TALL.layoutTop + s.marginTop });
    expect(down.mode).to.equal("top");
    expect(down.marginTop).to.equal(s.marginTop);
    // … including a pane that shrinks to fit the viewport.
    const fits = nextStickyState(down, { ...TALL, paneH: 400, scrollTop: 4650, renderedTop: TALL.layoutTop + s.marginTop });
    expect(fits.marginTop).to.equal(s.marginTop);
  });

  it("scrolling UP from a parked pane keeps it at the viewport top (margin follows), then hands over to plain sticky", () => {
    const s = stickyStateOnSelect({ ...TALL, scrollTop: 4500 });
    // Up by 100: the natural position moves up by 100 too — the pane stays
    // put on screen instead of sinking out of view with the list.
    const u1 = nextStickyState(s, { ...TALL, scrollTop: 4400, renderedTop: TALL.layoutTop + s.marginTop });
    expect(u1.mode).to.equal("top");
    expect(u1.marginTop).to.equal(4400 + STICKY_GAP - TALL.layoutTop);
    // Once the margin is within reach of the row (≤ listH - paneH = 3600),
    // plain top-sticky holds the pane: margin 0, rendered position unchanged.
    const u2 = nextStickyState(u1, { ...TALL, scrollTop: 3800, renderedTop: TALL.layoutTop + u1.marginTop });
    expect(u2.marginTop).to.equal(0);
    expect(u2.mode).to.equal("top");
  });

  it("a short list (no docking) still honours the selection margin", () => {
    const s = stickyStateOnSelect({ ...TALL, listH: 1000, scrollTop: 900 });
    expect(s.marginTop).to.equal(900 + STICKY_GAP - TALL.layoutTop);
    const n = nextStickyState(s, { ...TALL, listH: 1000, scrollTop: 950, renderedTop: TALL.layoutTop + s.marginTop });
    expect(n.marginTop).to.equal(s.marginTop);
    // Up: follows the viewport; maxMargin is 0 here, so it only lets go at
    // the very top of the layout.
    const u = nextStickyState(n, { ...TALL, listH: 1000, scrollTop: 500, renderedTop: TALL.layoutTop + n.marginTop });
    expect(u.marginTop).to.equal(500 + STICKY_GAP - TALL.layoutTop);
    const u0 = nextStickyState(u, { ...TALL, listH: 1000, scrollTop: 200, renderedTop: TALL.layoutTop + u.marginTop });
    expect(u0.marginTop).to.equal(0);
  });

  it("a resize without scroll movement keeps the mode and only refreshes the anchor", () => {
    const s0: StickyState = { mode: "bottom", marginTop: 500, lastScrollTop: 2000 };
    const s = nextStickyState(s0, { ...TALL, scrollTop: 2000, renderedTop: 800 });
    expect(s.mode).to.equal("bottom");
    expect(s.marginTop).to.equal(500);
    expect(stickyTop(s.mode, { ...TALL, viewH: 900 })).to.equal(900 - 1400 - STICKY_GAP);
  });
});
