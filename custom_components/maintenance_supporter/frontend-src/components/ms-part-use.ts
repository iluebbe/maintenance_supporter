/**
 * #226: the Use pill, for some of a part used outside a task.
 *
 * The washer fluid topped up between two oil changes, a cell for the kitchen
 * scale: the pill opens a count field, one by default, a whole package for a
 * part bought in packages.
 * `part/use` takes it off the stock like a completion's parts, so a reusable
 * part's used ones go on the pile and the reorder threshold and the buy
 * reminder follow. Shared by the object's parts shelf and the All-parts view;
 * fires `part-used` with the new counts.
 *
 * Nothing is valued: there is no completion to book a price on. For a part
 * that counts as spending when used, the open field says so.
 */

import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { t, langOf } from "../styles";
import { runWs } from "../helpers/ws-run";
import type { HomeAssistant, MaintenancePart } from "../types";

export type UsablePart = Pick<MaintenancePart, "id" | "unit" | "package_size">;

export interface PartUsedDetail {
  partId: string;
  stock: number;
  restoring: number;
}

/** What one use takes by default: a package of a part bought in packages
 *  (the jug that is empty), else one. */
export function defaultUseQuantity(part: Pick<MaintenancePart, "package_size">): number {
  const size = part.package_size;
  return typeof size === "number" && Number.isFinite(size) && size > 0 ? size : 1;
}

export class MsPartUse extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public entryId!: string;
  @property({ attribute: false }) public sparePart!: UsablePart;
  /** The part counts as spending when used, which a use outside a task
   *  does not book: said while the field is open. */
  @property({ type: Boolean }) public notBooked = false;
  /** Keep the open field on one line (a table cell, which scrolls). */
  @property({ type: Boolean, reflect: true }) public nowrap = false;

  @state() private _open = false;
  @state() private _qty = "";
  @state() private _invalid = false;
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
    // `open` on the host lets the row make room for the field.
    this.toggleAttribute("open", this._open);
  }

  private _start(): void {
    this._qty = String(defaultUseQuantity(this.sparePart));
    this._invalid = false;
    this._error = "";
    this._open = true;
    void this.updateComplete.then(() => this.shadowRoot?.querySelector<HTMLInputElement>("input")?.select());
  }

  private async _use(): Promise<void> {
    // Enter plus a click on the button: _busy is set before the first await.
    if (this._busy) return;
    const qty = parseFloat(this._qty);
    if (!Number.isFinite(qty) || qty <= 0) {
      this._invalid = true;
      return;
    }
    this._invalid = false;
    const result = await runWs<{ stock: number; restoring: number }>(
      this,
      { type: "maintenance_supporter/part/use", entry_id: this.entryId, part_id: this.sparePart.id, quantity: qty },
      { busy: (b) => { this._busy = b; }, onError: (m) => { this._error = m; } },
    );
    if (result === undefined) return;
    this._open = false;
    this.dispatchEvent(new CustomEvent<PartUsedDetail>("part-used", {
      detail: { partId: this.sparePart.id, stock: result?.stock ?? 0, restoring: result?.restoring ?? 0 },
      bubbles: true,
      composed: true,
    }));
  }

  protected render() {
    const L = this._lang;
    if (!this._open) {
      return html`<button class="use-pill" title=${t("part_use_hint", L)} @click=${() => this._start()}>
        <ha-icon icon="mdi:package-variant-minus"></ha-icon>${t("part_use", L)}
      </button>`;
    }
    return html`
      <span class="use-field">
        <input
          class=${this._invalid ? "invalid" : ""}
          type="number"
          min="0"
          step="any"
          .value=${this._qty}
          aria-label=${t("part_use_how_many", L)}
          title=${t("part_use_how_many", L)}
          @input=${(e: Event) => (this._qty = (e.target as HTMLInputElement).value)}
          @keydown=${(e: KeyboardEvent) => {
            if (e.key === "Enter") void this._use();
            if (e.key === "Escape") this._open = false;
          }}
        />
        ${this.sparePart.unit ? html`<span class="unit">${this.sparePart.unit}</span>` : nothing}
        <button class="use-pill confirm" title=${t("part_use_hint", L)} .disabled=${this._busy} @click=${() => this._use()}>
          <ha-icon icon="mdi:check"></ha-icon>${t("part_use", L)}
        </button>
        <ha-icon-button class="use-cancel" title=${t("cancel", L)} @click=${() => (this._open = false)}
          ><ha-icon icon="mdi:close"></ha-icon
        ></ha-icon-button>
      </span>
      ${this.notBooked ? html`<div class="note">${t("part_use_not_booked", L)}</div>` : nothing}
      ${this._error ? html`<div class="error">${this._error}</div>` : nothing}
    `;
  }

  static styles = css`
    :host {
      display: inline-flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
      max-width: 100%;
      white-space: normal;
    }
    .use-field {
      display: inline-flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 6px;
    }
    :host([nowrap]) .use-field {
      flex-wrap: nowrap;
    }
    .use-pill {
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
    .use-pill:hover {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
    .use-pill.confirm {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
    .use-pill ha-icon {
      --mdc-icon-size: 16px;
    }
    input {
      width: 72px;
      padding: 4px;
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
    .unit {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .use-cancel {
      --ha-icon-button-size: 32px;
    }
    .note,
    .error {
      font-size: 12px;
      line-height: 1.4;
      max-width: 36ch;
    }
    .note {
      color: var(--secondary-text-color);
    }
    .error {
      color: var(--error-color);
    }
  `;
}

if (!customElements.get("ms-part-use")) {
  customElements.define("ms-part-use", MsPartUse);
}
