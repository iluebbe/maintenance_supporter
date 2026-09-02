/** Scroll-aware docking for the master-detail task pane (split view).
 *
 * Pure state machine — the panel measures the scroll container / pane /
 * list and applies the returned `top` + `marginTop` to the pane, which stays
 * a plain `position: sticky` grid item. Two modes:
 *
 *  - `top`:    `top: GAP` — the pane hangs from the viewport top. This is
 *              the whole story while the pane FITS the viewport.
 *  - `bottom`: `top: viewH - paneH - GAP` (negative) — a pane taller than
 *              the viewport is pinned by its bottom edge while scrolling
 *              down, so the end of a long detail is reachable without a
 *              nested scrollbar (the pane never scrolls on its own).
 *
 * Direction changes release the pane at its current position (`marginTop`
 * pins its natural place in the grid area) so it travels with the list
 * until the opposite edge reaches the viewport, then sticks there. The
 * margin is clamped to the list height so the grid row never grows —
 * except on selection at the tail of a long list (`stickyStateOnSelect`):
 * there the pane is parked where the user is looking even if that means
 * a taller row, because "the detail opened 2000px above me" is exactly
 * the bug this exists to fix.
 */

export const STICKY_GAP = 8;

export type StickyMode = "top" | "bottom";

export interface StickyState {
  mode: StickyMode;
  /** Natural offset of the pane below the top of its grid area (px). */
  marginTop: number;
  lastScrollTop: number;
}

export interface StickyMetrics {
  /** Scroll offset of the scrolling container. */
  scrollTop: number;
  /** Visible (client) height of the scrolling container. */
  viewH: number;
  /** Rendered pane height (no inner scrolling — this is the content). */
  paneH: number;
  /** Height of the list column, i.e. the grid row the pane is docked in. */
  listH: number;
  /** Top of the split layout in scrollTop space. */
  layoutTop: number;
  /** Where the pane is rendered right now, in scrollTop space (includes
   *  the sticky shift). */
  renderedTop: number;
}

export const INITIAL_STICKY: StickyState = { mode: "top", marginTop: 0, lastScrollTop: 0 };

/** The `top` CSS value (px) for a state under the given metrics. */
export function stickyTop(mode: StickyMode, m: Pick<StickyMetrics, "viewH" | "paneH">): number {
  return mode === "top" ? STICKY_GAP : m.viewH - m.paneH - STICKY_GAP;
}

/** State for a freshly selected task (the pane just (re)rendered, no scroll
 *  since). Top mode, margin 0 — top-sticky shows the pane at the viewport
 *  top wherever the user is — unless the grid row is too short for the
 *  sticky offset to reach that far (tail of the list): then the natural
 *  position itself is moved to the viewport top and the row grows. */
export function stickyStateOnSelect(m: StickyMetrics): StickyState {
  const wanted = m.scrollTop + STICKY_GAP - m.layoutTop;
  const maxMargin = Math.max(0, m.listH - m.paneH);
  const marginTop = wanted > maxMargin ? Math.max(0, wanted) : 0;
  return { mode: "top", marginTop, lastScrollTop: m.scrollTop };
}

export function nextStickyState(prev: StickyState, m: StickyMetrics): StickyState {
  const last = m.scrollTop;
  const dir = m.scrollTop > prev.lastScrollTop ? "down" : m.scrollTop < prev.lastScrollTop ? "up" : "none";
  const maxMargin = Math.max(0, m.listH - m.paneH);
  // Fits the viewport, or the list is shorter than the pane (nothing to
  // dock against): plain top-sticky — the browser handles everything.
  const fits = m.paneH + 2 * STICKY_GAP <= m.viewH || m.listH <= m.paneH;
  let { mode, marginTop } = prev;
  if (fits) mode = "top";

  if (mode === "top" && marginTop > 0 && dir === "up") {
    // Parked at the tail (stickyStateOnSelect): the natural position follows
    // the viewport top, so the pane stays put instead of sinking out of
    // view with the list …
    marginTop = Math.max(0, Math.min(marginTop, m.scrollTop + STICKY_GAP - m.layoutTop));
    // … until plain top-sticky can hold it there by itself.
    if (marginTop <= maxMargin) marginTop = 0;
  } else if (!fits && dir === "down" && mode === "top") {
    // Release from the top edge: pin the natural position where the pane
    // sits now, then let bottom-mode sticky catch it at the viewport bottom.
    const natural = m.renderedTop - m.layoutTop;
    if (natural <= maxMargin) {
      mode = "bottom";
      marginTop = Math.max(0, natural);
    }
    // else: tail of the list — the grid area already parks the pane
    // bottom-aligned with the last row; top mode keeps that.
  } else if (!fits && dir === "up" && mode === "bottom") {
    // Release from the bottom edge the same way; once the pane's top edge
    // comes back into view, hand over to top mode (margin 0 keeps the
    // rendered position: the sticky offset takes over seamlessly).
    marginTop = Math.min(Math.max(0, m.renderedTop - m.layoutTop), maxMargin);
    if (m.scrollTop + STICKY_GAP <= m.layoutTop + marginTop) {
      mode = "top";
      marginTop = 0;
    }
  }
  return { mode, marginTop, lastScrollTop: last };
}
