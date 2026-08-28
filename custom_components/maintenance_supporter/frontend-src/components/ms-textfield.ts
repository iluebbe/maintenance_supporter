/** ms-textfield — drop-in for `<ha-textfield>` that always renders.
 *
 *  Background: HA's `<ha-textfield>` is lazy-loaded by HA's frontend on first
 *  use. In contexts where HA hasn't yet imported it (custom panels mounted
 *  via panel_custom; Lovelace dialogs mounted via dialog-mount onto
 *  document.body), `customElements.get("ha-textfield")` returns undefined,
 *  the element renders as HTMLUnknownElement with `offsetHeight: 0`, and
 *  the user sees an apparently empty form with only the label visible.
 *
 *  Reported manifestations:
 *    - Issue #50: complete-dialog notes/cost/duration invisible
 *    - Issue #50 follow-up: task-dialog target-entity invisible
 *    - Issue #46 follow-up: object-dialog name/manufacturer/model/serial/url/
 *      notes invisible (only ha-area-picker rendered, hence user could
 *      "only change the area")
 *
 *  This wrapper uses a native `<input>` element styled to match HA's
 *  appearance. Same API surface as ha-textfield: `label`, `value`, `type`,
 *  `placeholder`, `required`, `step`, `min`, `max`, `pattern`. Fires a
 *  standard `input` event with `event.target.value` so existing handlers
 *  work unchanged.
 *
 *  The CSS uses HA's CSS custom properties so the input visually matches
 *  the surrounding HA UI in both light and dark themes.
 */

import { LitElement, html, css, nothing } from "lit";
import { property } from "lit/decorators.js";

export class MsTextfield extends LitElement {
  @property() public label = "";
  @property() public value = "";
  @property() public placeholder = "";
  @property() public type: "text" | "number" | "url" | "email" | "password" | "date" | "time" | "datetime-local" = "text";
  @property({ type: Boolean }) public required = false;
  @property({ type: Boolean }) public disabled = false;
  @property() public step?: string;
  @property() public min?: string;
  @property() public max?: string;
  @property() public pattern?: string;
  @property() public helper?: string;
  /** Render a <textarea> instead of an <input> (free-text notes). The
   *  `input` event contract is identical — target.value works for both. */
  @property({ type: Boolean }) public multiline = false;
  @property({ type: Number }) public rows = 3;

  /** Forwards the native input's value into our `value` property and
   *  re-fires as a bubbling `input` event so consumers reading
   *  `(e.target as HTMLInputElement).value` still work — that's the
   *  pattern used everywhere ha-textfield was. */
  private _onInput(e: Event): void {
    const v = (e.target as HTMLInputElement).value;
    this.value = v;
    this.dispatchEvent(
      new CustomEvent("input", { bubbles: true, composed: true, detail: { value: v } }),
    );
  }

  render() {
    return html`
      <label class="field">
        ${this.label ? html`<span class="label">${this.label}${this.required ? html`<span class="req">*</span>` : nothing}</span>` : nothing}
        ${this.multiline ? html`
        <textarea
          .value=${this.value ?? ""}
          rows=${this.rows}
          ?required=${this.required}
          ?disabled=${this.disabled}
          placeholder=${this.placeholder}
          @input=${this._onInput}
          @change=${this._onInput}
        ></textarea>` : html`
        <input
          .value=${this.value ?? ""}
          .type=${this.type}
          ?required=${this.required}
          ?disabled=${this.disabled}
          placeholder=${this.placeholder}
          step=${this.step ?? nothing}
          min=${this.min ?? nothing}
          max=${this.max ?? nothing}
          pattern=${this.pattern ?? nothing}
          @input=${this._onInput}
          @change=${this._onInput}
        />`}
        ${this.helper ? html`<span class="helper">${this.helper}</span>` : nothing}
      </label>
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
    input {
      padding: 8px 10px;
      font-size: 14px;
      background: var(--secondary-background-color, rgba(0,0,0,0.06));
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color, rgba(255,255,255,0.12));
      border-radius: 6px;
      font-family: inherit;
      width: 100%;
      box-sizing: border-box;
      outline: none;
    }
    input:focus {
      border-color: var(--primary-color);
    }
    input:disabled { opacity: 0.5; cursor: not-allowed; }
    textarea {
      padding: 8px 10px;
      font-size: 14px;
      background: var(--secondary-background-color, rgba(0,0,0,0.06));
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color, rgba(255,255,255,0.12));
      border-radius: 6px;
      font-family: inherit;
      width: 100%;
      box-sizing: border-box;
      outline: none;
      resize: vertical;
    }
    textarea:focus { border-color: var(--primary-color); }
    textarea:disabled { opacity: 0.5; cursor: not-allowed; }
    .helper {
      font-size: 11px;
      color: var(--secondary-text-color);
      font-style: italic;
    }
  `;
}

if (!customElements.get("ms-textfield")) {
  customElements.define("ms-textfield", MsTextfield);
}
