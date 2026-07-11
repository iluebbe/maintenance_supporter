/**
 * Spare parts & consumables section on the object detail page.
 *
 * Shows the object's parts list (stock badge, storage location, identifiers,
 * shopping link), lets admins add/edit/delete parts, and adjust stock
 * (inventory correction / manual restock). Follows the documents-section
 * conventions: standalone LitElement fed by the panel, native <input>s in the
 * inline form (the ha-textfield-in-custom-panel trap), t() i18n.
 *
 * After a create/delete (entity set changes → backend reloads the entry) it
 * fires "parts-changed" so the panel re-fetches objects; stock adjustments
 * update the local copy from the WS response for instant feedback.
 */

import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { t, ensureLocale } from "../styles";
import { describeWsError } from "../ws-errors";
import type { HomeAssistant, MaintenancePart } from "../types";

interface PartForm {
  id?: string;
  name: string;
  vendor: string;
  mpn: string;
  gtin: string;
  storage_location: string;
  product_url: string;
  unit: string;
  cost: string;
  stock: string;
  reorder_threshold: string;
  restock_quantity: string;
  auto_buy_task: boolean;
  notes: string;
}

const EMPTY_FORM: PartForm = {
  name: "",
  vendor: "",
  mpn: "",
  gtin: "",
  storage_location: "",
  product_url: "",
  unit: "",
  cost: "",
  stock: "",
  reorder_threshold: "",
  restock_quantity: "",
  auto_buy_task: true,
  notes: "",
};

export class MaintenancePartsSection extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public entryId!: string;
  @property({ attribute: false }) public parts: MaintenancePart[] = [];
  @property({ type: Boolean }) public canWrite = false;

  @state() private _editing: PartForm | null = null;
  @state() private _busy = false;
  @state() private _error = "";
  @state() private _restockFor: string | null = null;
  @state() private _restockQty = "";
  @state() private _restockInvalid = false;

  private get _lang(): string {
    return this.hass?.locale?.language || this.hass?.language || "en";
  }

  public connectedCallback(): void {
    super.connectedCallback();
    // Lazy-load the locale bundle for t() (same pattern as documents-section).
    void ensureLocale(this._lang).then(() => this.requestUpdate());
  }

  private _notifyChanged(): void {
    this.dispatchEvent(new CustomEvent("parts-changed", { bubbles: true, composed: true }));
  }

  private async _send<T>(msg: Record<string, unknown>): Promise<T | null> {
    this._busy = true;
    this._error = "";
    try {
      return await this.hass.connection.sendMessagePromise<T>(msg);
    } catch (err) {
      this._error = describeWsError(err, this._lang);
      return null;
    } finally {
      this._busy = false;
    }
  }

  private _openAdd(): void {
    this._editing = { ...EMPTY_FORM };
  }

  private _openEdit(part: MaintenancePart): void {
    this._editing = {
      id: part.id,
      name: part.name,
      vendor: part.vendor || "",
      mpn: part.mpn || "",
      gtin: part.gtin || "",
      storage_location: part.storage_location || "",
      product_url: part.product_url || "",
      unit: part.unit || "",
      cost: part.cost != null ? String(part.cost) : "",
      stock: part.stock != null ? String(part.stock) : "",
      reorder_threshold: part.reorder_threshold != null ? String(part.reorder_threshold) : "",
      restock_quantity: part.restock_quantity != null ? String(part.restock_quantity) : "",
      auto_buy_task: !!part.auto_buy_task,
      notes: part.notes || "",
    };
  }

  private _formValue(f: PartForm): Record<string, unknown> {
    const num = (s: string): number | null => (s.trim() === "" ? null : Number(s));
    return {
      entry_id: this.entryId,
      name: f.name.trim(),
      vendor: f.vendor.trim() || null,
      mpn: f.mpn.trim() || null,
      gtin: f.gtin.trim() || null,
      storage_location: f.storage_location.trim() || null,
      product_url: f.product_url.trim() || null,
      unit: f.unit.trim() || null,
      cost: num(f.cost),
      stock: num(f.stock),
      reorder_threshold: num(f.reorder_threshold),
      restock_quantity: num(f.restock_quantity),
      auto_buy_task: f.auto_buy_task,
      notes: f.notes.trim() || null,
    };
  }

  private async _save(): Promise<void> {
    const f = this._editing;
    if (!f || !f.name.trim()) return;
    const payload = this._formValue(f);
    const type = f.id ? "maintenance_supporter/part/update" : "maintenance_supporter/part/create";
    const result = await this._send<{ part_id?: string }>(f.id ? { type, part_id: f.id, ...payload } : { type, ...payload });
    if (result !== null) {
      this._editing = null;
      this._notifyChanged();
    }
  }

  private async _delete(part: MaintenancePart): Promise<void> {
    const result = await this._send<{ success: boolean }>({
      type: "maintenance_supporter/part/delete",
      entry_id: this.entryId,
      part_id: part.id,
    });
    if (result !== null) this._notifyChanged();
  }

  private async _restock(part: MaintenancePart): Promise<void> {
    const qty = parseInt(this._restockQty, 10);
    if (!Number.isFinite(qty) || qty === 0) {
      // Don't silently swallow a no-op amount — keep the input open and mark
      // it so the user sees WHY nothing happened (0 / empty / not a number).
      this._restockInvalid = true;
      return;
    }
    this._restockInvalid = false;
    const result = await this._send<{ stock: number }>({
      type: "maintenance_supporter/part/restock",
      entry_id: this.entryId,
      part_id: part.id,
      delta: qty,
    });
    this._restockFor = null;
    if (result !== null) {
      // Instant local feedback; the panel refresh follows via parts-changed.
      part.stock = result.stock;
      this.requestUpdate();
      this._notifyChanged();
    }
  }

  private _identLine(part: MaintenancePart): string {
    return [part.vendor, part.mpn ? `MPN: ${part.mpn}` : "", part.gtin ? `GTIN: ${part.gtin}` : ""]
      .filter(Boolean)
      .join(" · ");
  }

  private _renderRow(part: MaintenancePart) {
    const L = this._lang;
    const tracked = part.stock !== null && part.stock !== undefined;
    const ident = this._identLine(part);
    return html`
      <div class="part-row ${part.is_low ? "low" : ""}">
        <ha-icon class="part-icon" icon=${part.is_low ? "mdi:cart-arrow-down" : "mdi:package-variant-closed"}></ha-icon>
        <div class="part-main">
          <div class="part-name">
            ${part.shopping_url
              ? html`<a href=${part.shopping_url} target="_blank" rel="noopener noreferrer">${part.name}</a>`
              : part.name}
            ${tracked
              ? html`<span class="stock-badge ${part.is_low ? "low" : ""}"
                  >${part.stock}${part.unit ? ` ${part.unit}` : ""}${part.reorder_threshold != null
                    ? html`<span class="threshold">/${part.reorder_threshold}</span>`
                    : nothing}</span
                >`
              : nothing}
          </div>
          <div class="part-meta">
            ${ident ? html`<span>${ident}</span>` : nothing}
            ${part.storage_location
              ? html`<span class="loc"><ha-icon icon="mdi:map-marker-outline"></ha-icon>${part.storage_location}</span>`
              : nothing}
          </div>
        </div>
        ${this.canWrite
          ? html`
              ${this._restockFor === part.id
                ? html`
                    <input
                      class="restock-input${this._restockInvalid ? " invalid" : ""}"
                      type="number"
                      .value=${this._restockQty}
                      placeholder="+1"
                      @input=${(e: Event) => (this._restockQty = (e.target as HTMLInputElement).value)}
                      @keydown=${(e: KeyboardEvent) => {
                        if (e.key === "Enter") this._restock(part);
                        if (e.key === "Escape") this._restockFor = null;
                      }}
                    />
                    <ha-icon-button title=${t("save", L)} @click=${() => this._restock(part)}
                      ><ha-icon icon="mdi:check"></ha-icon
                    ></ha-icon-button>
                  `
                : html`
                    <ha-icon-button
                      title=${t("part_restock", L)}
                      .disabled=${this._busy}
                      @click=${() => {
                        this._restockFor = part.id;
                        this._restockInvalid = false;
                        this._restockQty = String(part.restock_quantity || 1);
                      }}
                      ><ha-icon icon="mdi:plus-minus-variant"></ha-icon
                    ></ha-icon-button>
                  `}
              <ha-icon-button title=${t("edit", L)} .disabled=${this._busy} @click=${() => this._openEdit(part)}
                ><ha-icon icon="mdi:pencil"></ha-icon
              ></ha-icon-button>
              <ha-icon-button title=${t("delete", L)} .disabled=${this._busy} @click=${() => this._delete(part)}
                ><ha-icon icon="mdi:delete-outline"></ha-icon
              ></ha-icon-button>
            `
          : nothing}
      </div>
    `;
  }

  private _field(label: string, key: keyof PartForm, opts: { type?: string; placeholder?: string } = {}) {
    const f = this._editing!;
    return html`
      <label class="form-field">
        <span>${label}</span>
        <input
          type=${opts.type || "text"}
          .value=${String(f[key] ?? "")}
          placeholder=${opts.placeholder || ""}
          @input=${(e: Event) => {
            (this._editing as unknown as Record<string, unknown>)[key] = (e.target as HTMLInputElement).value;
            this.requestUpdate();
          }}
        />
      </label>
    `;
  }

  private _renderForm() {
    const L = this._lang;
    const f = this._editing!;
    return html`
      <div class="part-form">
        <div class="form-grid">
          ${this._field(t("part_name", L), "name")}
          ${this._field(t("part_vendor", L), "vendor")}
          ${this._field("MPN", "mpn")}
          ${this._field("GTIN / EAN", "gtin", { placeholder: "4006381333931" })}
          ${this._field(t("part_storage_location", L), "storage_location")}
          ${this._field(t("part_product_url", L), "product_url", { placeholder: "https://…" })}
          ${this._field(t("part_unit", L), "unit")}
          ${this._field(t("part_cost", L), "cost", { type: "number" })}
          ${this._field(t("part_stock", L), "stock", { type: "number" })}
          ${this._field(t("part_reorder_threshold", L), "reorder_threshold", { type: "number" })}
          ${this._field(t("part_restock_quantity", L), "restock_quantity", { type: "number" })}
          <label class="form-field checkbox">
            <input
              type="checkbox"
              .checked=${f.auto_buy_task}
              @change=${(e: Event) => {
                this._editing = { ...f, auto_buy_task: (e.target as HTMLInputElement).checked };
              }}
            />
            <span>${t("part_auto_buy", L)}</span>
          </label>
        </div>
        <div class="form-actions">
          <ha-button appearance="plain" @click=${() => (this._editing = null)}>${t("cancel", L)}</ha-button>
          <ha-button .disabled=${this._busy || !f.name.trim()} @click=${() => this._save()}
            >${t("save", L)}</ha-button
          >
        </div>
      </div>
    `;
  }

  protected render() {
    const L = this._lang;
    if (!this.parts.length && !this.canWrite) return nothing;
    return html`
      <div class="section-head">
        <h3>
          <ha-icon icon="mdi:package-variant"></ha-icon>
          ${t("parts_section", L)} (${this.parts.length})
        </h3>
        ${this.canWrite && !this._editing
          ? html`<ha-button appearance="plain" @click=${() => this._openAdd()}>
              <ha-icon icon="mdi:plus"></ha-icon> ${t("part_add", L)}
            </ha-button>`
          : nothing}
      </div>
      ${this._error ? html`<div class="error">${this._error}</div>` : nothing}
      ${this._editing ? this._renderForm() : nothing}
      ${this.parts.map((part) => this._renderRow(part))}
    `;
  }

  static styles = css`
    :host {
      display: block;
      margin: 12px 0;
    }
    .section-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    h3 {
      display: flex;
      align-items: center;
      gap: 6px;
      margin: 8px 0;
    }
    .part-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 4px;
      border-bottom: 1px solid var(--divider-color);
    }
    .part-row.low .part-icon {
      color: var(--warning-color, #ff9800);
    }
    .part-main {
      flex: 1;
      min-width: 0;
    }
    .part-name {
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .part-name a {
      color: var(--primary-color);
      text-decoration: none;
    }
    .stock-badge {
      font-size: 12px;
      padding: 1px 8px;
      border-radius: 10px;
      background: var(--secondary-background-color);
    }
    .stock-badge.low {
      background: var(--warning-color, #ff9800);
      color: var(--text-primary-color, #fff);
    }
    .stock-badge .threshold {
      opacity: 0.7;
    }
    .part-meta {
      font-size: 12px;
      color: var(--secondary-text-color);
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    .part-meta .loc ha-icon {
      --mdc-icon-size: 13px;
    }
    .restock-input {
      width: 64px;
      padding: 4px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
    }
    .restock-input.invalid {
      border-color: var(--error-color, #f44336);
    }
    .part-form {
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 8px;
    }
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 8px 12px;
    }
    .form-field {
      display: flex;
      flex-direction: column;
      gap: 2px;
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .form-field input[type="text"],
    .form-field input[type="number"] {
      padding: 6px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
    }
    .form-field.checkbox {
      flex-direction: row;
      align-items: center;
      gap: 6px;
      align-self: end;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 10px;
    }
    .error {
      color: var(--error-color);
      font-size: 13px;
      margin: 4px 0;
    }
  `;
}

customElements.define("maintenance-parts-section", MaintenancePartsSection);
