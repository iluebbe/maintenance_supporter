/** Windowing math for the virtualized dashboard task table (500+ tasks).
 *
 * Pure functions only — the panel measures the scroll container / row height
 * and renders `rows.slice(start, end)` between two grid-spanning spacers whose
 * heights keep the scrollbar honest. The window start/end snap to a `step`
 * grid so a 1-row scroll doesn't rebind the whole slice on every frame.
 *
 * Why windowing at all: the table's cross-row column alignment comes from CSS
 * subgrid, which is incompatible with `content-visibility`/`size` containment
 * (the cheap skip-offscreen-paint trick used elsewhere). So for large installs
 * the initial O(n) render is paid on every keystroke/filter change unless the
 * DOM itself is windowed.
 */

/** Rows below this count render normally — windowing has bookkeeping cost and
 *  only pays off when the O(n) render actually hurts. */
export const VIRTUAL_MIN_ROWS = 120;

export interface VirtualWindowInput {
  /** Scroll offset of the scrolling container. */
  scrollTop: number;
  /** Visible (client) height of the scrolling container. */
  viewportHeight: number;
  /** Top of the table relative to the container's content (scrollTop space). */
  listTop: number;
  /** Measured uniform row height in px (clamped to >= 1). */
  rowHeight: number;
  /** Total row count. */
  total: number;
  /** Extra rows rendered above/below the viewport. Default 12. */
  overscan?: number;
  /** Start/end snap to this grid to avoid re-render churn. Default 6. */
  step?: number;
}

export interface VirtualWindow {
  start: number;
  end: number;
  padTop: number;
  padBottom: number;
}

export function computeWindow(i: VirtualWindowInput): VirtualWindow {
  if (i.total <= 0) return { start: 0, end: 0, padTop: 0, padBottom: 0 };
  const overscan = i.overscan ?? 12;
  const step = Math.max(1, i.step ?? 6);
  const rh = Math.max(1, i.rowHeight);

  const firstVisible = Math.floor((i.scrollTop - i.listTop) / rh);
  const visibleCount = Math.ceil(i.viewportHeight / rh) + 1;

  let start = Math.max(0, firstVisible - overscan);
  start = Math.floor(start / step) * step;
  let end = Math.min(i.total, Math.max(firstVisible, 0) + visibleCount + overscan);
  end = Math.min(i.total, Math.ceil(end / step) * step);

  // Degenerate inputs (table far above/below viewport): keep a sane window.
  if (start >= end) {
    start = Math.min(start, Math.max(0, i.total - 1));
    end = Math.min(i.total, start + Math.max(visibleCount, 1));
  }

  return {
    start,
    end,
    padTop: start * rh,
    padBottom: (i.total - end) * rh,
  };
}
