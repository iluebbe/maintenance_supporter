import type { ReactiveController, ReactiveControllerHost } from "lit";

/** Which `hass` changes a surface has to redraw for. Home Assistant hands
 *  every panel and card a new `hass` object on each state change anywhere
 *  in the home, sharing every other field with the one before; in a busy
 *  home that is many a second (perf 2026-11-02). */

/** A surface that draws no entity state of its own redraws for a change of
 *  only `states` at most this often. */
export const HASS_STATES_REDRAW_MS = 1000;

/** Whether `cur` differs from `old` in `states` and in nothing else. The
 *  same states with a new object (a copy) is not such a change: the caller
 *  redraws as before. */
export function onlyStatesChanged(old: object, cur: object): boolean {
  const a = old as Record<string, unknown>;
  const b = cur as Record<string, unknown>;
  if (a === b || a.states === b.states) return false;
  for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
    if (key !== "states" && a[key] !== b[key]) return false;
  }
  return true;
}

interface GateHost extends ReactiveControllerHost {
  readonly hasUpdated: boolean;
  hass?: object;
}

/** That rule for one element (the panel and every card): from
 *  `shouldUpdate`, `hold()` keeps back an update whose only change is a
 *  `hass` with new `states`, until HASS_STATES_REDRAW_MS after the last
 *  draw; then it draws once with the newest `hass`. Any other change draws
 *  at once and, through `release()` in `willUpdate`, takes the held change
 *  along as the changed `hass`. */
export class StatesRedrawGate implements ReactiveController {
  /** The predecessor of the held change, handed on as the changed value. */
  private _held: object | undefined;
  private _timer = 0;
  private _lastDraw = 0;

  constructor(private readonly host: GateHost) {
    host.addController(this);
  }

  /** Whether to hold this update back (call from `shouldUpdate`). */
  hold(changed: Map<PropertyKey, unknown>): boolean {
    if (!this.host.hasUpdated || changed.size !== 1 || !changed.has("hass")) return false;
    const old = changed.get("hass") as object | undefined;
    const cur = this.host.hass;
    const wait = HASS_STATES_REDRAW_MS - (performance.now() - this._lastDraw);
    if (!old || !cur || wait <= 0 || !onlyStatesChanged(old, cur)) return false;
    this._held ??= old;
    if (!this._timer) {
      this._timer = window.setTimeout(() => {
        this._timer = 0;
        this.host.requestUpdate();
      }, wait);
    }
    return true;
  }

  /** A held change goes with this update, whatever started it (call first
   *  in `willUpdate`). */
  release(changed: Map<PropertyKey, unknown>): void {
    if (this._held) {
      if (!changed.has("hass")) changed.set("hass", this._held);
      this._held = undefined;
    }
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = 0;
    }
  }

  hostUpdated(): void {
    this._lastDraw = performance.now();
  }
}
