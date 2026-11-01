/** A popup menu listed once and drawn two ways: our own `.popup-menu`
 *  (classic), or with the beta UI Home Assistant's ha-dropdown — its own
 *  placement inside the window (ours ran past a phone's edge and scrolled
 *  the page sideways), keyboard, focus and closing, HA's look, a red item
 *  for what destroys. ha-dropdown fires `wa-select` with the item; probed
 *  on 2026.7.2 … 2026.11 (helpers/beta-ui). */

import { html, nothing, type TemplateResult } from "lit";
import { betaWith } from "./beta-ui";
import { clickOnActivationKey } from "./keyboard";

export interface MenuItem {
  label: unknown;
  action: () => void;
  /** An mdi icon before the label. */
  icon?: string;
  /** The classic item's own class (tests and live checks find it by it). */
  cls?: string;
  danger?: boolean;
  /** The choice in force (Group by / Sort by): marked like HA marks it. */
  selected?: boolean;
}

/** An item, a divider, or nothing (not offered here). */
export type MenuEntry = MenuItem | "divider" | null | false | undefined;

/** The menu is Home Assistant's ha-dropdown (beta UI, HA has it). */
export function menuIsHa(): boolean {
  return betaWith("ha-dropdown");
}

const present = (entries: MenuEntry[]): Array<MenuItem | "divider"> =>
  entries.filter((e): e is MenuItem | "divider" => !!e);

/** Our popup (classic): `close` runs before each item's action. */
export function renderPopupMenu(entries: MenuEntry[], close: () => void, cls = ""): TemplateResult {
  return html`
    <div class="popup-menu${cls ? " " + cls : ""}" role="menu" @keydown=${clickOnActivationKey} @click=${(e: Event) => e.stopPropagation()}>
      ${present(entries).map((e) => e === "divider"
        ? html`<div class="popup-menu-divider"></div>`
        : html`<div role="menuitem" tabindex="0" class="popup-menu-item${e.cls ? " " + e.cls : ""}${e.danger ? " danger" : ""}${e.selected ? " selected" : ""}"
            @click=${() => { close(); e.action(); }}>${e.icon ? html`<ha-icon icon=${e.icon}></ha-icon> ` : nothing}${e.label}</div>`)}
    </div>`;
}

/** Home Assistant's dropdown around `trigger` (an element with
 *  slot="trigger"); the item's index is its value. */
export function renderHaMenu(trigger: TemplateResult, entries: MenuEntry[], opts: { cls?: string; placement?: string } = {}): TemplateResult {
  const items = present(entries);
  return html`
    <ha-dropdown class=${opts.cls ?? ""} placement=${opts.placement ?? "bottom-end"}
      @wa-select=${(e: CustomEvent<{ item?: Element & { value?: string } }>) => {
        const item = e.detail?.item;
        const picked = items[Number(item?.value ?? item?.getAttribute("value"))];
        if (picked && picked !== "divider") picked.action();
      }}>
      ${trigger}
      ${items.map((e, i) => e === "divider"
        ? html`<wa-divider></wa-divider>`
        : html`<ha-dropdown-item value=${String(i)} class=${`${e.cls ?? ""}${e.selected ? " selected" : ""}`} variant=${e.danger ? "danger" : "default"}>
            ${e.icon ? html`<ha-icon slot="icon" icon=${e.icon}></ha-icon>` : nothing}${e.label}
          </ha-dropdown-item>`)}
    </ha-dropdown>`;
}
