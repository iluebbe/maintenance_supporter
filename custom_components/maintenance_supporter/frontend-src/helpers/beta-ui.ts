/** The new look (Settings › Advanced features › New look and task editor;
 *  `advanced_beta_editor_visible`, on by default since 2026-11-01; the code
 *  still says "beta"): with it on, every surface uses Home
 *  Assistant's own 2026 components where it drew its own — HA's dialog
 *  header and adaptive dialog (a bottom sheet on a phone), ha-dropdown
 *  menus, HA's toast, ha-settings-row + ha-switch, ha-expansion-panel,
 *  ha-alert, ha-select, ha-input, ha-checkbox, ha-tab-group and HA's corner
 *  radii. With it off nothing changes.
 *
 *  One switch for the panel, the cards and the dialogs mounted on dashboards:
 *  module state exists once PER BUNDLE, so it lives on `window`. Every place
 *  also asks `haHas(tag)`: a component Home Assistant has not registered (an
 *  older or newer core, a test runner) keeps our own markup. Probed live on
 *  2026.7.2, 2026.10.4 and 2026.11: all of them registered in the panel and
 *  on dashboards, with the same properties and events (2026-10-31). */

import { html, nothing, type TemplateResult } from "lit";

const KEY = "__msBetaUi";
const EVENT = "ms-beta-ui-changed";

/** HA's corner-radius scale (4/8/12/16/24) for our 6 and 10 px corners. */
const RADII: Record<string, string> = {
  "--ms-radius-6": "var(--ha-border-radius-md, 8px)",
  "--ms-radius-10": "var(--ha-border-radius-lg, 12px)",
};

export function betaUi(): boolean {
  return (window as unknown as Record<string, unknown>)[KEY] === true;
}

/** Set from the settings (panel, settings cache); re-renders who listens. */
export function setBetaUi(on: boolean): void {
  const w = window as unknown as Record<string, unknown>;
  if (w[KEY] === on) return;
  w[KEY] = on;
  // Custom properties inherit through shadow roots: on the document they
  // reach the panel, the cards and the dialogs mounted elsewhere.
  const style = document.documentElement.style;
  for (const [name, value] of Object.entries(RADII)) {
    if (on) style.setProperty(name, value);
    else style.removeProperty(name);
  }
  window.dispatchEvent(new CustomEvent(EVENT));
}

/** An HA component is there to use. */
export function haHas(tag: string): boolean {
  return !!customElements.get(tag);
}

/** The beta UI is on AND Home Assistant has the component. */
export function betaWith(tag: string): boolean {
  return betaUi() && haHas(tag);
}

/** A dialog's title in HA's header beside the close button (beta UI); else
 *  undefined and `titleLine` draws our own line under an empty header. */
export function headerTitle(title: string): string | undefined {
  return betaUi() ? title : undefined;
}

/** Our own title line inside a dialog — not with the beta UI, whose title
 *  sits in HA's header (`headerTitle`). */
export function titleLine(title: unknown): TemplateResult | typeof nothing {
  return betaUi() ? nothing : html`<div class="dialog-title">${title}</div>`;
}

/** Re-render a long-lived element when the switch flips. Returns the
 *  unsubscribe (call it from disconnectedCallback). */
export function onBetaUiChange(cb: () => void): () => void {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}
