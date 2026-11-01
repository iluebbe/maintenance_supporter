/** ms-ha-select — the beta UI's dropdown: Home Assistant's ha-select fed
 *  by `<option>` children, so one options template serves a native select
 *  (classic) and HA's (helpers/select-field).
 *
 *  ha-select takes its options as data and is controlled: it fires
 *  `selected` with `{ value }` and leaves its value to the owner (probed on
 *  2026.7.2 … 2026.11). This element reads the options from its children
 *  (they stay invisible: no slot), keeps the value, and fires a bubbling
 *  `change` with itself as target — consumers read
 *  `(e.target as HTMLSelectElement).value` as before. */

import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";

interface HaSelectOption {
  value: string;
  label: string;
}

/** ha-select reads "" as nothing chosen and shows only its label, so an
 *  "All" or "None" option with the value "" left the field looking empty
 *  (the beta overview's filters, 2026-11-01). It travels as this instead. */
const EMPTY = "__ms_empty__";
const toHa = (v: string) => (v === "" ? EMPTY : v);

export class MsHaSelect extends LitElement {
  @property() public label = "";
  /** undefined = the option marked `selected` (as a native select). */
  @property() public value: string | undefined = undefined;
  @property({ type: Boolean }) public disabled = false;
  @property() public helper = "";
  @state() private _options: HaSelectOption[] = [];
  @state() private _selected = "";
  private _observer: MutationObserver | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    this._read();
    this._observer = new MutationObserver(() => this._read());
    this._observer.observe(this, { childList: true, subtree: true, characterData: true, attributes: true });
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._observer?.disconnect();
    this._observer = null;
  }

  private _read(): void {
    const opts = [...this.querySelectorAll("option")];
    this._options = opts.map((o) => ({ value: toHa(o.value), label: (o.textContent ?? "").replace(/\s+/g, " ").trim() }));
    this._selected = opts.find((o) => o.hasAttribute("selected") || o.selected)?.value ?? opts[0]?.value ?? "";
  }

  private _picked(e: CustomEvent<{ value: string }>): void {
    e.stopPropagation();
    this.value = e.detail.value === EMPTY ? "" : e.detail.value;
    this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
  }

  render() {
    return html`
      <ha-select
        .label=${this.label}
        .helper=${this.helper}
        .options=${this._options}
        .value=${toHa(this.value ?? this._selected)}
        .disabled=${this.disabled}
        @selected=${this._picked}
      ></ha-select>`;
  }

  static styles = css`
    :host { display: block; }
    ha-select { display: block; width: 100%; }
  `;
}

if (!customElements.get("ms-ha-select")) {
  customElements.define("ms-ha-select", MsHaSelect);
}
