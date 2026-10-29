/**
 * #238: the Bought… pill, for a purchase recorded at any time.
 *
 * On sale before the reorder threshold is reached: the pill opens a small
 * form for how many (packages of a part bought in packages, the restock
 * amount prefilled), the price each or the total (the part's price
 * prefilled, either one follows the other), the day and a note.
 * `part/purchase` books it as the completion of the part's buy task, so it
 * goes into the stock and the spending like a completed reminder. Shared by
 * the object's parts shelf and the All-parts view; fires `part-bought` with
 * the new stock.
 *
 * For a part that counts as spending when used, the form says the purchase
 * is stock and goes into the part's average price.
 */

import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { t, langOf, formatQty } from "../styles";
import { runWs } from "../helpers/ws-run";
import { haToday } from "../helpers/ha-time";
import { restockUnits } from "../helpers/parts-cost";
import type { HomeAssistant, MaintenancePart } from "../types";
import "./ms-date-field";

export type PurchasablePart = Pick<MaintenancePart, "id" | "unit" | "package_size" | "cost" | "restock_quantity">;

export interface PartBoughtDetail {
  partId: string;
  stock: number;
}

/** What one purchase buys by default: the part's restock amount (packages
 *  of a part bought in packages), else one. */
export function defaultPurchaseQuantity(part: Pick<MaintenancePart, "restock_quantity">): number {
  const q = part.restock_quantity;
  return typeof q === "number" && Number.isFinite(q) && q > 0 ? q : 1;
}

const round2 = (n: number): number => Math.round(n * 100) / 100;
const numOf = (s: string): number => (s.trim() === "" ? NaN : parseFloat(s));

export class MsPartPurchase extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public entryId!: string;
  @property({ attribute: false }) public sparePart!: PurchasablePart;
  @property({ attribute: false }) public currencySymbol = "€";
  /** The part counts as spending when used: a purchase is stock, and its
   *  price goes into the part's average price. Said while the form is open. */
  @property({ type: Boolean }) public onUse = false;

  @state() private _open = false;
  @state() private _qty = "";
  @state() private _price = "";
  @state() private _total = "";
  @state() private _date = "";
  @state() private _notes = "";
  @state() private _invalid = "";
  @state() private _busy = false;
  @state() private _error = "";

  constructor() {
    super();
    // The All-parts row opens its object on a click: a click in here is ours.
    this.addEventListener("click", (e) => e.stopPropagation());
  }

  private get _lang(): string {
    return langOf(this.hass);
  }

  protected updated(): void {
    // `open` on the host lets the row make room for the form.
    this.toggleAttribute("open", this._open);
  }

  private _start(): void {
    const part = this.sparePart;
    this._qty = String(defaultPurchaseQuantity(part));
    this._price = typeof part.cost === "number" ? String(part.cost) : "";
    this._total = "";
    this._followPrice();
    this._date = haToday();
    this._notes = "";
    this._invalid = "";
    this._error = "";
    this._open = true;
    void this.updateComplete.then(() => this.shadowRoot?.querySelector<HTMLInputElement>("input.qty")?.select());
  }

  /** The total follows the quantity and the price each. */
  private _followPrice(): void {
    const q = numOf(this._qty), p = numOf(this._price);
    if (Number.isFinite(q) && Number.isFinite(p)) this._total = String(round2(q * p));
    else if (this._price.trim() === "") this._total = "";
  }

  /** ... and the price each a typed total. */
  private _followTotal(): void {
    const q = numOf(this._qty), total = numOf(this._total);
    if (Number.isFinite(q) && q > 0 && Number.isFinite(total)) this._price = String(round2(total / q));
    else if (this._total.trim() === "") this._price = "";
  }

  private async _record(): Promise<void> {
    // Enter plus a click on the button: _busy is set before the first await.
    if (this._busy) return;
    const qty = numOf(this._qty);
    const total = numOf(this._total);
    if (!Number.isFinite(qty) || qty <= 0) {
      this._invalid = "qty";
      return;
    }
    if (this._total.trim() !== "" && (!Number.isFinite(total) || total < 0)) {
      this._invalid = "total";
      return;
    }
    this._invalid = "";
    const msg: Record<string, unknown> = {
      type: "maintenance_supporter/part/purchase",
      entry_id: this.entryId,
      part_id: this.sparePart.id,
      quantity: qty,
    };
    // What was paid is the total: the price each is rounded, the receipt is not.
    if (this._total.trim() !== "") msg.cost = round2(total);
    if (this._date && this._date !== haToday()) msg.date = this._date;
    if (this._notes.trim()) msg.notes = this._notes.trim();
    const result = await runWs<{ task_id: string; stock: number; cost: number | null }>(this, msg, {
      busy: (b) => { this._busy = b; },
      onError: (m) => { this._error = m; },
    });
    if (result === undefined) return;
    this._open = false;
    this.dispatchEvent(new CustomEvent<PartBoughtDetail>("part-bought", {
      detail: { partId: this.sparePart.id, stock: result?.stock ?? 0 },
      bubbles: true,
      composed: true,
    }));
  }

  private _keys(e: KeyboardEvent): void {
    // Our own fields only: Enter in the date field's typed input commits the day.
    if ((e.target as HTMLElement | null)?.tagName !== "INPUT") return;
    if (e.key === "Enter") void this._record();
    if (e.key === "Escape") this._open = false;
  }

  protected render() {
    const L = this._lang;
    if (!this._open) {
      return html`<button class="buy-pill" title=${t("part_bought_hint", L)} @click=${() => this._start()}>
        <ha-icon icon="mdi:cart-plus"></ha-icon>${t("part_bought", L)}
      </button>`;
    }
    const part = this.sparePart;
    const size = typeof part.package_size === "number" && part.package_size > 0 ? part.package_size : null;
    const qty = numOf(this._qty);
    const cur = this.currencySymbol;
    return html`
      <div class="buy-form" @keydown=${(e: KeyboardEvent) => this._keys(e)}>
        <label class="f">
          <span>${size ? t("part_bought_packages", L).replace("{size}", formatQty(size, part.unit, L)) : t("part_bought_quantity", L)}</span>
          <input class="qty ${this._invalid === "qty" ? "invalid" : ""}" type="number" min="0" step="any" inputmode="decimal"
            .value=${this._qty}
            @input=${(e: Event) => { this._qty = (e.target as HTMLInputElement).value; this._followPrice(); }} />
        </label>
        <label class="f">
          <span>${size ? t("part_bought_price_package", L) : t("part_bought_price_each", L)} (${cur})</span>
          <input class="price" type="number" min="0" step="0.01" inputmode="decimal"
            .value=${this._price}
            @input=${(e: Event) => { this._price = (e.target as HTMLInputElement).value; this._followPrice(); }} />
        </label>
        <label class="f">
          <span>${t("part_bought_total", L)} (${cur})</span>
          <input class="total ${this._invalid === "total" ? "invalid" : ""}" type="number" min="0" step="0.01" inputmode="decimal"
            .value=${this._total}
            @input=${(e: Event) => { this._total = (e.target as HTMLInputElement).value; this._followTotal(); }} />
        </label>
        <div class="f date">
          <span>${t("part_bought_date", L)}</span>
          <ms-date-field kind="date" .hass=${this.hass} .lang=${L} .value=${this._date}
            @value-changed=${(e: CustomEvent) => (this._date = (e.detail.value as string) || haToday())}></ms-date-field>
        </div>
        <label class="f notes">
          <span>${t("notes_label", L)}</span>
          <input class="notes-input" type="text" maxlength="2000" placeholder=${t("part_bought_note", L)}
            .value=${this._notes}
            @input=${(e: Event) => (this._notes = (e.target as HTMLInputElement).value)} />
        </label>
        <div class="adds">
          ${Number.isFinite(qty) && qty > 0
            ? t("part_bought_adds", L).replace("{qty}", formatQty(restockUnits(part, qty), part.unit, L))
            : nothing}
        </div>
        ${this.onUse ? html`<div class="note">${t("part_bought_on_use", L)}</div>` : nothing}
        ${this._error ? html`<div class="error">${this._error}</div>` : nothing}
        <div class="actions">
          <button class="buy-pill confirm" .disabled=${this._busy} @click=${() => this._record()}>
            <ha-icon icon="mdi:check"></ha-icon>${t("part_bought_confirm", L)}
          </button>
          <button class="buy-pill" @click=${() => (this._open = false)}>${t("cancel", L)}</button>
        </div>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: inline-flex;
      max-width: 100%;
      white-space: normal;
    }
    :host([open]) {
      display: block;
      width: 100%;
      min-width: min(100%, 280px);
    }
    .buy-pill {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font: inherit;
      font-size: 12px;
      font-weight: 400;
      padding: 2px 10px;
      min-height: 28px;
      border-radius: 14px;
      border: 1px solid var(--divider-color, #ccc);
      background: transparent;
      color: var(--secondary-text-color);
      cursor: pointer;
      white-space: nowrap;
    }
    .buy-pill:hover,
    .buy-pill.confirm {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
    .buy-pill ha-icon {
      --mdc-icon-size: 16px;
    }
    /* Wraps instead of a grid: the date picker needs its width, and on a
       narrow shelf or in a table cell every field takes a line. */
    .buy-form {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-end;
      gap: 8px 10px;
      margin: 6px 0 4px;
      padding: 10px;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      font-weight: 400;
    }
    .f {
      display: flex;
      flex-direction: column;
      gap: 3px;
      flex: 1 1 110px;
      min-width: 0;
    }
    .f.date {
      flex: 1 1 190px;
    }
    .f > span {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .f.notes,
    .adds,
    .note,
    .error,
    .actions {
      flex: 1 1 100%;
    }
    input {
      width: 100%;
      box-sizing: border-box;
      padding: 5px 6px;
      font: inherit;
      font-size: 13px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
    }
    input.invalid {
      border-color: var(--error-color, #f44336);
    }
    .adds,
    .note,
    .error {
      font-size: 12px;
      line-height: 1.4;
    }
    .adds,
    .note {
      color: var(--secondary-text-color);
    }
    .error {
      color: var(--error-color);
    }
    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
  `;
}

if (!customElements.get("ms-part-purchase")) {
  customElements.define("ms-part-purchase", MsPartPurchase);
}
