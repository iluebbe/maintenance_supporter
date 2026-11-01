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
 *
 * Rows are not uniform (a sensor row carries a value and a sparkline under
 * its date), so the panel keeps each row's measured height (RowHeights) and
 * passes the running offsets. One mean height for every row put the window
 * in the wrong place: 70 tall rows followed by short ones made the mean drop
 * as the short rows came into view, the index under the scroll position
 * jumped ahead, and rows 78 to 95 of a 138-task list never rendered at all
 * (2026-11-01).
 */

/** Rows below this count render normally — windowing has bookkeeping cost and
 *  only pays off when the O(n) render actually hurts. */
export const VIRTUAL_MIN_ROWS = 120;

/** Height assumed for a row nobody has measured yet (and nothing else is
 *  known): one line of name plus the sub line. */
export const DEFAULT_ROW_HEIGHT = 53;

export interface VirtualWindowInput {
  /** Scroll offset of the scrolling container. */
  scrollTop: number;
  /** Visible (client) height of the scrolling container. */
  viewportHeight: number;
  /** Top of the table relative to the container's content (scrollTop space). */
  listTop: number;
  /** Uniform row height in px (clamped to >= 1), used when `offsets` is absent. */
  rowHeight?: number;
  /** Top of every row and, last, the end of the table: `total + 1` entries,
   *  `offsets[0] === 0`. Takes precedence over `rowHeight`. */
  offsets?: ArrayLike<number>;
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

/** Index of the row that contains `y` (clamped to the table). */
function rowAt(y: number, total: number, top: (k: number) => number): number {
  let lo = 0;
  let hi = total - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (top(mid) <= y) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

export function computeWindow(i: VirtualWindowInput): VirtualWindow {
  if (i.total <= 0) return { start: 0, end: 0, padTop: 0, padBottom: 0 };
  const overscan = i.overscan ?? 12;
  const step = Math.max(1, i.step ?? 6);
  const rh = Math.max(1, i.rowHeight ?? DEFAULT_ROW_HEIGHT);
  const offsets = i.offsets;
  const top = offsets ? (k: number) => offsets[k] : (k: number) => k * rh;

  const y = i.scrollTop - i.listTop;
  const firstVisible = rowAt(y, i.total, top);
  const lastVisible = rowAt(y + i.viewportHeight, i.total, top);

  let start = Math.max(0, firstVisible - overscan);
  start = Math.floor(start / step) * step;
  let end = Math.min(i.total, lastVisible + 1 + overscan);
  end = Math.min(i.total, Math.ceil(end / step) * step);

  return {
    start,
    end,
    padTop: top(start),
    padBottom: top(i.total) - top(end),
  };
}

/** Measured row heights, by row key. Rows nobody has seen yet count as the
 *  mean of the measured ones. A new table width forgets everything, because
 *  the rows wrap differently. */
export class RowHeights {
  private _heights = new Map<string, number>();
  private _sum = 0;
  private _width = -1;

  /** Call with the table's width before recording; a change clears the cache. */
  setWidth(width: number): void {
    if (Math.abs(width - this._width) < 1) return;
    this._width = width;
    this._heights.clear();
    this._sum = 0;
  }

  /** Remember one rendered row. Zero heights (a hidden table) are ignored. */
  record(key: string, height: number): void {
    if (!(height > 0)) return;
    const prev = this._heights.get(key);
    if (prev === height) return;
    this._sum += height - (prev ?? 0);
    this._heights.set(key, height);
  }

  get estimate(): number {
    return this._heights.size ? this._sum / this._heights.size : DEFAULT_ROW_HEIGHT;
  }

  /** Running offsets for `keys` in order (see VirtualWindowInput.offsets). */
  offsets(keys: readonly string[]): Float64Array {
    const est = this.estimate;
    const out = new Float64Array(keys.length + 1);
    for (let k = 0; k < keys.length; k++) out[k + 1] = out[k] + (this._heights.get(keys[k]) ?? est);
    return out;
  }
}
