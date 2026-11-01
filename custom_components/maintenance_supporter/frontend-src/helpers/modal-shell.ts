/** The hand-built modal frame of the dialogs that are NOT <ha-dialog>:
 *  the history-entry editor and the object / task quick-action dialogs
 *  (Lovelace-mounted, so they cannot lean on the panel's dialog stack).
 *
 *  Each carried its own copy of the backdrop + centred card CSS (the sizes
 *  had drifted: 460 vs 480 px, 90 vs 92 vh) and none closed on Escape,
 *  unlike every HA dialog next to them (DRY audit 2026-09-26). One frame
 *  now: `renderModalShell()` + `modalShellStyles`, sized per dialog through
 *  custom properties (`--ms-modal-max-width`, `--ms-modal-max-height`,
 *  `--ms-modal-gap`, `--ms-modal-z`) so each keeps its own proportions.
 *
 *  A dialog whose middle can grow long (a list of found sensors or devices)
 *  puts it in `.dialog-scroll`: the title above and the buttons below stay
 *  on screen and only the middle scrolls. #211: with 54 problem sensors the
 *  adopt dialog's summary took the whole height and the list shrank to
 *  nothing, because the list was the only part allowed to shrink.
 *
 *  Escape is handled on the frame itself, not on window: a dialog stacked
 *  ON TOP (the confirm dialog, the complete dialog a quick action opens)
 *  keeps its keystrokes, because they never bubble through this frame.
 *
 *  Backdrop and frame sit in one top-layer popover (`helpers/top-layer`):
 *  inside the panel, HA 2026.11's docked sidebar covered their left side.
 *
 *  With the beta UI the frame is Home Assistant's own ha-adaptive-dialog:
 *  the title in HA's header beside the close button, a bottom sheet on a
 *  phone, HA's Escape and close button. The dialog then leaves out its own
 *  title line (`shellIsHa()`). */

import { css, html, type TemplateResult } from "lit";
import { betaWith } from "./beta-ui";
import { topLayer, topLayerStyles } from "./top-layer";

export const modalShellStyles = css`
  ${topLayerStyles}
  .modal-layer {
    display: block;
    z-index: var(--ms-modal-z, 100);
  }
  .backdrop {
    position: fixed; inset: 0; z-index: var(--ms-modal-z, 100);
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
    z-index: calc(var(--ms-modal-z, 100) + 1);
  }
  /* The beta UI's body inside ha-adaptive-dialog: the frame's column. */
  .ha-shell-body {
    display: flex; flex-direction: column; gap: var(--ms-modal-gap, 14px);
  }
  /* Focused programmatically on open (so Escape works at once) — no ring. */
  .dialog:focus { outline: none; }
  /* The one part that shrinks and scrolls (min-height: 0); the header and the
     buttons around it keep their content's height. */
  .dialog-scroll {
    flex: 1 1 auto; min-height: 0;
    overflow-y: auto; overscroll-behavior: contain;
    display: flex; flex-direction: column; gap: var(--ms-modal-gap, 14px);
  }
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

/** The frame is Home Assistant's dialog (beta UI, HA has it): the title
 *  goes into its header, the dialog leaves out its own title line. */
export function shellIsHa(): boolean {
  return betaWith("ha-adaptive-dialog");
}

/** Backdrop (click = close) + the focusable dialog frame around `body`;
 *  with the beta UI HA's ha-adaptive-dialog with `title` in its header. */
export function renderModalShell(close: () => void, body: unknown, opts: { title?: string } = {}): TemplateResult {
  if (shellIsHa()) {
    // `closed` bubbles from HA components inside (a picker's list): only
    // the dialog's own closes it.
    return html`
      <ha-adaptive-dialog open .headerTitle=${opts.title}
        @closed=${(e: Event) => { if (e.target === e.currentTarget) close(); }}>
        <div class="ha-shell-body">${body}</div>
      </ha-adaptive-dialog>
    `;
  }
  return html`
    <div class="modal-layer top-layer" popover="manual" ${topLayer}>
      <div class="backdrop" @click=${close}></div>
      <div class="dialog" role="dialog" aria-modal="true" tabindex="-1"
        @keydown=${(e: KeyboardEvent) => closeOnEscape(e, close)}>${body}</div>
    </div>
  `;
}

/** Move focus into a freshly opened frame so Escape reaches it without a
 *  click first. Call from `updated()` when the open flag flipped to true. */
export function focusModalShell(root: ParentNode | null | undefined): void {
  root?.querySelector<HTMLElement>(".dialog")?.focus({ preventScroll: true });
}
