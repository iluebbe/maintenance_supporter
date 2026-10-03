/** A cost that may be a credit (#200): a Cost | Credit switch and the amount.
 *
 *  Money also comes back — the old unit sold, a refund — and a credit is a
 *  negative cost. Phone keypads for number fields have no minus key, so the
 *  sign is the switch and the field keeps the amount positive (a typed minus
 *  flips the switch). `value` is the signed number as text, "" = none, and
 *  `value-changed` carries it the same way. A native input inside: the
 *  complete dialog's #50 rule — it renders wherever the dialog is mounted. */

import { css, html, LitElement, nothing, type PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";

import { nativeFieldStyles, t } from "../styles";

export class MsCostInput extends LitElement {
  @property() public value = "";
  @property() public lang = "en";

  @state() private _credit = false;
  @state() private _amount = "";

  protected willUpdate(changed: PropertyValues<this>): void {
    if (!changed.has("value")) return;
    const text = (this.value ?? "").trim();
    if (text === this._signed()) return; // our own value coming back
    const n = parseFloat(text);
    if (text === "" || Number.isNaN(n)) {
      // Cleared from outside (a reset, the next entry): back to a cost.
      this._amount = "";
      this._credit = false;
      return;
    }
    this._credit = n < 0;
    this._amount = String(Math.abs(n));
  }

  private _signed(): string {
    const amount = this._amount.trim();
    if (amount === "") return "";
    return this._credit ? `-${amount}` : amount;
  }

  private _emit(): void {
    this.value = this._signed();
    this.dispatchEvent(new CustomEvent("value-changed", { detail: { value: this.value }, bubbles: true, composed: true }));
  }

  private _setCredit(credit: boolean): void {
    if (this._credit === credit) return;
    this._credit = credit;
    this._emit();
  }

  private _onInput(e: Event): void {
    const raw = (e.target as HTMLInputElement).value;
    if (raw.startsWith("-")) this._credit = true;
    this._amount = raw.replace(/^-+/, "");
    this._emit();
  }

  render() {
    const L = this.lang;
    return html`
      <div class="wrap">
        <div class="sign" role="group">
          <button type="button" class="kind cost ${this._credit ? "" : "on"}" aria-pressed=${String(!this._credit)}
            @click=${() => this._setCredit(false)}>${t("cost", L)}</button>
          <button type="button" class="kind credit ${this._credit ? "on" : ""}" aria-pressed=${String(this._credit)}
            @click=${() => this._setCredit(true)}>${t("cost_kind_credit", L)}</button>
        </div>
        <input type="number" step="0.01" min="0" inputmode="decimal" class="field-input amount"
          .value=${this._amount} @input=${this._onInput} />
      </div>
      ${this._credit ? html`<div class="hint">${t("cost_credit_hint", L)}</div>` : nothing}
    `;
  }

  static styles = [
    nativeFieldStyles,
    css`
      :host { display: block; }
      .wrap { display: flex; gap: 8px; align-items: stretch; }
      .sign {
        display: inline-flex;
        flex: none;
        border: 1px solid var(--divider-color);
        border-radius: 6px;
        overflow: hidden;
      }
      .kind {
        font: inherit;
        font-size: 13px;
        padding: 0 10px;
        border: none;
        background: transparent;
        color: var(--secondary-text-color);
        cursor: pointer;
      }
      .kind.on { background: var(--primary-color); color: var(--text-primary-color, #fff); }
      .kind.credit.on { background: var(--success-color, #43a047); }
      .amount { flex: 1; min-width: 0; }
      .hint { margin-top: 4px; font-size: 12px; color: var(--secondary-text-color); }
    `,
  ];
}

if (!customElements.get("ms-cost-input")) {
  customElements.define("ms-cost-input", MsCostInput);
}
