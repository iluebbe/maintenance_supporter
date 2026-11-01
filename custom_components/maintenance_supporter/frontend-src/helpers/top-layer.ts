/** Lifts the panel's own overlays (the search, the template gallery, the
 *  hand-built dialogs, the photo lightbox, the camera viewfinder) into the
 *  browser's top layer, where Home Assistant's own dialogs already are.
 *
 *  HA 2026.11 isolates the panel (`partial-panel-resolver { isolation:
 *  isolate }`), so no z-index inside it rises above HA's docked sidebar any
 *  more: between 871 and about 1230 px the sidebar covered the left of these
 *  overlays and took the taps meant for them (2026-10-31, found by the beta
 *  editor's viewport sweep; HA 2026.10 was fine).
 *
 *  A MANUAL popover, not a modal <dialog>: it rises above every stacking
 *  context without making the rest of the page inert (HA's pickers float
 *  their lists outside our markup) and leaves Escape to our own handlers.
 *  Mark the overlay's outermost element `class="… top-layer" popover="manual"
 *  ${topLayer}` and add `topLayerStyles`. Where popovers are missing, the
 *  attribute does nothing and the overlay stays the fixed layer it was. */

import { css } from "lit";
import { ref } from "lit/directives/ref.js";

/** Shows the element as a popover once it is in the page. Lit fills a new
 *  template's parts while its nodes are still in the detached fragment, so
 *  the element is inserted only after this runs: show it a microtask later,
 *  still before the next paint. One callback for every overlay: Lit calls
 *  it with `undefined` when another element takes it over, which is ignored. */
function show(el?: Element): void {
  if (!(el instanceof HTMLElement) || typeof el.showPopover !== "function") return;
  queueMicrotask(() => {
    if (!el.isConnected || el.matches(":popover-open")) return;
    try {
      el.showPopover();
    } catch {
      // Not a popover after all (attribute removed), or its document went away.
    }
  });
}

export const topLayer = ref(show);

/** Undo the browser's popover box (centred, fit-content, framed, Canvas
 *  colours). Zero specificity: each overlay's own rules still win, and
 *  `display` stays theirs, so an overlay whose popover was closed by the
 *  browser still shows as the fixed layer it was. */
export const topLayerStyles = css`
  :where(.top-layer[popover]) {
    position: fixed;
    inset: 0;
    width: auto;
    height: auto;
    max-width: none;
    max-height: none;
    margin: 0;
    border: 0;
    padding: 0;
    overflow: visible;
    color: inherit;
    background: none;
  }
`;
