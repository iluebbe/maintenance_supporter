/** ms-date-field — date / time / date+time input that follows the HA profile
 *  date and time format (#163).
 *
 *  Native `<input type="date|time|datetime-local">` renders in the BROWSER's
 *  locale: an en-US browser shows 09/02/2026 and 12:30 PM no matter what the
 *  user picked under Profile → Date format / Time format, and no attribute or
 *  CSS changes that. HA's own pickers do honour the profile, so this wrapper
 *  renders `<ha-selector>` with a date / time / datetime selector — the same
 *  reliably-registered route the dialogs already use for entity and device
 *  pickers (see dialog-no-lazy-load-elements.test.ts). ha-selector lazy-loads
 *  ha-date-input / ha-time-input itself and, since HA 2026.6, reads the locale
 *  from HA's Lit context — so the element must sit inside HA's provider tree
 *  (panel, Lovelace card, or a dialog-mount'ed dialog), never on document.body.
 *
 *  Value contract (what the consumers store / send over WS):
 *    date      "YYYY-MM-DD"
 *    time      "HH:MM"
 *    datetime  "YYYY-MM-DDTHH:MM:SS"   (local, no zone — as before)
 *  "" means empty. The HA selectors speak "YYYY-MM-DD", "HH:MM:SS" and
 *  "YYYY-MM-DD HH:MM:SS"; the conversion lives here only. Fires a bubbling
 *  `value-changed` with `detail.value` in the contract format.
 *
 *  `clearable` adds a ✕ that resets to "" — HA's date selector has no empty
 *  state of its own, and the datetime selector only ever reports a value once
 *  BOTH halves are set, so optional fields need the explicit clear.
 */

import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import type { HomeAssistant } from "../types";
import { formatDate, t } from "../styles";
import { parseTypedDate } from "../helpers/date-parse";

export type DateFieldKind = "date" | "time" | "datetime";

/** Contract value → the HA selector's value (undefined = empty). */
export function toSelectorValue(kind: DateFieldKind, value: string): string | undefined {
  if (!value) return undefined;
  switch (kind) {
    case "date":
      return value.split("T")[0];
    case "time":
      return value.length === 5 ? `${value}:00` : value;
    case "datetime": {
      const [d, tm = "00:00:00"] = value.split("T");
      return `${d} ${tm.length === 5 ? `${tm}:00` : tm}`;
    }
  }
}

/** The HA selector's value → contract value ("" = empty). */
export function fromSelectorValue(kind: DateFieldKind, value: unknown): string {
  if (typeof value !== "string" || !value) return "";
  switch (kind) {
    case "date":
      return value.slice(0, 10);
    case "time":
      return value.slice(0, 5);
    case "datetime": {
      const [d, tm = "00:00:00"] = value.split(" ");
      return `${d}T${tm.length === 5 ? `${tm}:00` : tm}`;
    }
  }
}

export class MsDateField extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property() public kind: DateFieldKind = "date";
  @property() public label = "";
  @property() public value = "";
  @property() public helper?: string;
  @property({ type: Boolean }) public clearable = false;
  @property({ type: Boolean }) public disabled = false;
  @property({ type: Boolean }) public required = false;
  /** UI language for the ✕ tooltip (consumers pass their own `lang`). */
  @property() public lang = "en";

  // Forum #23: HA's date dialog steps month by month and its text field is
  // read-only — a 1978 installation date was hundreds of clicks away. The
  // keyboard toggle swaps in a plain text input; Enter/blur commit through
  // parseTypedDate (ISO, bare year, or the profile's own order).
  @state() private _typing = false;
  @state() private _typed = "";
  @state() private _typedInvalid = false;

  private _startTyping(): void {
    this._typed = this.value;
    this._typedInvalid = false;
    this._typing = true;
    void this.updateComplete.then(() => this.shadowRoot?.querySelector<HTMLInputElement>("input.typed")?.focus());
  }

  private _commitTyped(): void {
    if (!this._typed.trim()) {
      this._typing = false;
      return;
    }
    const parsed = parseTypedDate(this._typed, this.lang);
    if (!parsed) {
      this._typedInvalid = true;
      return;
    }
    this._typing = false;
    this._typedInvalid = false;
    this._emit(parsed);
  }

  private _onTypedKey(e: KeyboardEvent): void {
    if (e.key === "Enter") {
      e.preventDefault();
      this._commitTyped();
    } else if (e.key === "Escape") {
      e.preventDefault();
      this._typing = false;
      this._typedInvalid = false;
    }
  }

  private _selector() {
    switch (this.kind) {
      case "date":
        return { date: {} };
      case "time":
        return { time: { no_second: true } };
      case "datetime":
        return { datetime: {} };
    }
  }

  private _onSelectorChange(e: CustomEvent): void {
    // The raw ha-selector event must not reach the consumer — it carries the
    // selector's own value format.
    e.stopPropagation();
    this._emit(fromSelectorValue(this.kind, (e.detail as { value?: unknown })?.value));
  }

  private _clear(): void {
    this._emit("");
  }

  private _emit(value: string): void {
    if (value === this.value) return;
    this.value = value;
    this.dispatchEvent(
      new CustomEvent("value-changed", { bubbles: true, composed: true, detail: { value } }),
    );
  }

  render() {
    return html`
      <div class="field">
        ${this.label
          ? html`<span class="label">${this.label}${this.required ? html`<span class="req">*</span>` : nothing}</span>`
          : nothing}
        <div class="row">
          ${this._typing
            ? html`<input class="typed" type="text" inputmode="numeric" autocomplete="off"
                .value=${this._typed}
                placeholder=${formatDate("1978-03-15", this.lang)}
                aria-invalid=${this._typedInvalid ? "true" : "false"}
                @input=${(e: Event) => { this._typed = (e.target as HTMLInputElement).value; this._typedInvalid = false; }}
                @keydown=${this._onTypedKey}
                @blur=${this._commitTyped} />`
            : html`<ha-selector
                .hass=${this.hass}
                .selector=${this._selector()}
                .value=${toSelectorValue(this.kind, this.value)}
                .required=${this.required}
                .disabled=${this.disabled}
                @value-changed=${this._onSelectorChange}
              ></ha-selector>`}
          ${this.kind === "date" && !this.disabled && !this._typing
            ? html`<button type="button" class="type-toggle" title=${t("date_type_toggle", this.lang)} aria-label=${t("date_type_toggle", this.lang)} @click=${this._startTyping}>
                <ha-icon icon="mdi:keyboard-outline"></ha-icon>
              </button>`
            : nothing}
          ${this.clearable && this.value && !this.disabled && !this._typing
            ? html`<button type="button" class="clear" title=${t("clear", this.lang)} aria-label=${t("clear", this.lang)} @click=${this._clear}>
                <ha-icon icon="mdi:close"></ha-icon>
              </button>`
            : nothing}
        </div>
        ${this._typedInvalid
          ? html`<span class="helper invalid">${t("date_type_invalid", this.lang)}</span>`
          : this.helper ? html`<span class="helper">${this.helper}</span>` : nothing}
      </div>
    `;
  }

  static styles = css`
    :host { display: block; }
    .field {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .label {
      font-size: 12px;
      color: var(--secondary-text-color, #888);
      font-weight: 500;
    }
    .req { color: var(--error-color, #f44336); margin-left: 2px; }
    .row {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    ha-selector {
      flex: 1;
      min-width: 0;
    }
    .clear, .type-toggle {
      flex: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      padding: 0;
      border: none;
      border-radius: 50%;
      background: transparent;
      color: var(--secondary-text-color);
      cursor: pointer;
      --mdc-icon-size: 20px;
    }
    .clear:hover, .type-toggle:hover { background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.08); }
    .clear:focus-visible, .type-toggle:focus-visible { outline: 2px solid var(--primary-color); }
    .helper {
      font-size: 11px;
      color: var(--secondary-text-color);
      font-style: italic;
    }
    .helper.invalid { color: var(--error-color, #f44336); font-style: normal; }
    input.typed {
      flex: 1;
      min-width: 0;
      height: 40px;
      box-sizing: border-box;
      padding: 0 12px;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font: inherit;
    }
    input.typed[aria-invalid="true"] { border-color: var(--error-color, #f44336); }
    input.typed:focus { outline: 2px solid var(--primary-color); outline-offset: -1px; }
  `;
}

if (!customElements.get("ms-date-field")) {
  customElements.define("ms-date-field", MsDateField);
}
