/** The panel's <maintenance-confirm-dialog> for surfaces OUTSIDE the panel.
 *
 * The Lovelace quick-action dialogs and the groups card asked with the
 * browser's native `window.confirm` — an unstyled, untranslatable-title
 * modal that the Companion app renders as a system alert — while the panel
 * asked the same questions through its own confirm dialog (DRY audit
 * 2026-09-26). One singleton, mounted where dialog-mount puts every
 * Lovelace dialog: inside <home-assistant>'s shadow root, so HA's context
 * providers stay reachable (#129); document.body only as a fallback.
 */

import "../components/confirm-dialog";
import type { ConfirmOptions, MaintenanceConfirmDialog } from "../components/confirm-dialog";
import type { HomeAssistant } from "../types";

const TAG = "maintenance-confirm-dialog";
/** Marks OUR singleton — the panel keeps its own instance in its shadow root. */
const MARK = "data-ms-lovelace-confirm";

function host(): ShadowRoot | HTMLElement {
  return document.querySelector("home-assistant")?.shadowRoot ?? document.body;
}

/** Ask a yes/no question; resolves false on cancel / dismiss. */
export function confirmAction(hass: HomeAssistant, opts: ConfirmOptions): Promise<boolean> {
  const root = host();
  let dlg = root.querySelector<MaintenanceConfirmDialog>(`${TAG}[${MARK}]`);
  if (!dlg) {
    dlg = document.createElement(TAG) as MaintenanceConfirmDialog;
    dlg.setAttribute(MARK, "");
    root.appendChild(dlg);
  }
  dlg.hass = hass;
  return dlg.confirm(opts);
}
