/** Toast timing — one set for every surface that shows a transient message.
 *
 * The panel (4 s), the settings view (3 s) and the quick-actions dialog
 * (2.5 s / 3.5 s) each had their own numbers, and the latter two never
 * cleared a pending timer: a second toast was cut short by the first one's
 * hide, and a timer outlived the closed dialog / detached view (DRY audit
 * 2026-09-26). `ToastTimer` is the one pending hide per surface.
 */

/** A plain message. */
export const TOAST_MS = 4000;
/** A toast carrying an action (Undo / Configure) — time to react. */
export const ACTION_TOAST_MS = 7000;

export class ToastTimer {
  private _handle: ReturnType<typeof setTimeout> | null = null;

  /** (Re)arm the hide: a newer toast replaces the older one's timer. */
  schedule(hide: () => void, ms: number = TOAST_MS): void {
    this.clear();
    this._handle = setTimeout(() => {
      this._handle = null;
      hide();
    }, ms);
  }

  /** Drop a pending hide (surface closed / detached). */
  clear(): void {
    if (this._handle !== null) {
      clearTimeout(this._handle);
      this._handle = null;
    }
  }

  get pending(): boolean {
    return this._handle !== null;
  }
}
