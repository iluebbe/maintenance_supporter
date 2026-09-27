/** The hand-built modal frame of the dialogs that are NOT <ha-dialog>:
 *  the history-entry editor and the object / task quick-action dialogs
 *  (Lovelace-mounted, so they cannot lean on the panel's dialog stack).
 *
 *  Each carried its own copy of the backdrop + centred card CSS (the sizes
 *  had drifted: 460 vs 480 px, 90 vs 92 vh) and none closed on Escape,
 *  unlike every HA dialog next to them (DRY audit 2026-09-26). One frame
 *  now: `renderModalShell()` + `modalShellStyles`, sized per dialog through
 *  custom properties (`--ms-modal-max-width`, `--ms-modal-max-height`,
 *  `--ms-modal-gap`) so each keeps its own proportions.
 *
 *  Escape is handled on the frame itself, not on window: a dialog stacked
 *  ON TOP (the confirm dialog, the complete dialog a quick action opens)
 *  keeps its keystrokes, because they never bubble through this frame. */

import { css, html, type TemplateResult } from "lit";

export const modalShellStyles = css`
  .backdrop {
    position: fixed; inset: 0; z-index: 100;
    background: rgba(0,0,0,0.5);
  }
  .dialog {
    position: fixed; left: 50%; top: 50%;
    transform: translate(-50%, -50%);
    width: 95vw; max-width: var(--ms-modal-max-width, 480px);
    max-height: var(--ms-modal-max-height, 92vh); overflow: auto;
    background: var(--card-background-color, var(--ha-card-background, #1c1c1c));
    color: var(--primary-text-color);
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.4);
    padding: 20px;
    display: flex; flex-direction: column; gap: var(--ms-modal-gap, 14px);
    z-index: 101;
  }
  /* Focused programmatically on open (so Escape works at once) — no ring. */
  .dialog:focus { outline: none; }
`;

/** Close on Escape unless something inside already consumed the key (a
 *  date field leaving its typing mode, a menu closing) or it came from the
 *  in-dialog camera viewfinder, which is its own full-screen layer. */
export function closeOnEscape(e: KeyboardEvent, close: () => void): void {
  if (e.key !== "Escape" || e.defaultPrevented) return;
  if (e.composedPath().some((n) => n instanceof Element && n.localName === "ms-camera-capture")) return;
  e.preventDefault();
  e.stopPropagation();
  close();
}

/** Backdrop (click = close) + the focusable dialog frame around `body`. */
export function renderModalShell(close: () => void, body: unknown): TemplateResult {
  return html`
    <div class="backdrop" @click=${close}></div>
    <div class="dialog" role="dialog" aria-modal="true" tabindex="-1"
      @keydown=${(e: KeyboardEvent) => closeOnEscape(e, close)}>${body}</div>
  `;
}

/** Move focus into a freshly opened frame so Escape reaches it without a
 *  click first. Call from `updated()` when the open flag flipped to true. */
export function focusModalShell(root: ParentNode | null | undefined): void {
  root?.querySelector<HTMLElement>(".dialog")?.focus({ preventScroll: true });
}
