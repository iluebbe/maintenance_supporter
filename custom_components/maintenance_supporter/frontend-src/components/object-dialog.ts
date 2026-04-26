/** Dialog for creating/editing a maintenance object. */

import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import type { HomeAssistant, MaintenanceObject } from "../types";
import { t } from "../styles";

import { describeWsError } from "../ws-errors";

export class MaintenanceObjectDialog extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _open = false;
  @state() private _loading = false;
  @state() private _error = "";
  @state() private _name = "";
  @state() private _manufacturer = "";
  @state() private _model = "";
  @state() private _serialNumber = "";
  @state() private _areaId = "";
  @state() private _installationDate = "";
  // v1.4.0 (#43): per-object link to PDF manual / vendor page
  @state() private _documentationUrl = "";
  @state() private _entryId: string | null = null; // null = create, string = update

  private get _lang(): string {
    return this.hass?.language ?? navigator.language.split("-")[0] ?? "en";
  }

  public openCreate(): void {
    this._entryId = null;
    this._name = "";
    this._manufacturer = "";
    this._model = "";
    this._serialNumber = "";
    this._areaId = "";
    this._installationDate = "";
    this._documentationUrl = "";
    this._error = "";
    this._open = true;
  }

  public openEdit(entryId: string, obj: MaintenanceObject): void {
    this._entryId = entryId;
    this._name = obj.name || "";
    this._manufacturer = obj.manufacturer || "";
    this._model = obj.model || "";
    this._serialNumber = obj.serial_number || "";
    this._areaId = obj.area_id || "";
    this._installationDate = obj.installation_date || "";
    this._documentationUrl = obj.documentation_url || "";
    this._error = "";
    this._open = true;
  }

  private async _save(): Promise<void> {
    if (!this._name.trim()) return;
    this._loading = true;
    this._error = "";
    try {
      if (this._entryId) {
        await this.hass.connection.sendMessagePromise({
          type: "maintenance_supporter/object/update",
          entry_id: this._entryId,
          name: this._name,
          manufacturer: this._manufacturer || null,
          model: this._model || null,
          serial_number: this._serialNumber || null,
          area_id: this._areaId || null,
          installation_date: this._installationDate || null,
          documentation_url: this._documentationUrl.trim() || null,
        });
      } else {
        await this.hass.connection.sendMessagePromise({
          type: "maintenance_supporter/object/create",
          name: this._name,
          manufacturer: this._manufacturer || null,
          model: this._model || null,
          serial_number: this._serialNumber || null,
          area_id: this._areaId || null,
          installation_date: this._installationDate || null,
          documentation_url: this._documentationUrl.trim() || null,
        });
      }
      this._open = false;
      this.dispatchEvent(new CustomEvent("object-saved"));
    } catch (e) {
      this._error = describeWsError(e, this._lang, t("save_error", this._lang));
    } finally {
      this._loading = false;
    }
  }

  private _close(): void {
    this._open = false;
  }

  render() {
    if (!this._open) return html``;
    const L = this._lang;
    const title = this._entryId ? t("edit_object", L) : t("new_object", L);
    return html`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${title}</div>
        <div class="content">
          ${this._error ? html`<div class="error">${this._error}</div>` : nothing}
          <ha-textfield
            label="${t("name", L)}"
            required
            .value=${this._name}
            @input=${(e: Event) => (this._name = (e.target as HTMLInputElement).value)}
          ></ha-textfield>
          <ha-textfield
            label="${t("manufacturer_optional", L)}"
            .value=${this._manufacturer}
            @input=${(e: Event) => (this._manufacturer = (e.target as HTMLInputElement).value)}
          ></ha-textfield>
          <ha-textfield
            label="${t("model_optional", L)}"
            .value=${this._model}
            @input=${(e: Event) => (this._model = (e.target as HTMLInputElement).value)}
          ></ha-textfield>
          <ha-textfield
            label="${t("serial_number_optional", L)}"
            .value=${this._serialNumber}
            @input=${(e: Event) => (this._serialNumber = (e.target as HTMLInputElement).value)}
          ></ha-textfield>
          <ha-textfield
            label="${t("documentation_url_optional", L)}"
            type="url"
            .value=${this._documentationUrl}
            @input=${(e: Event) => (this._documentationUrl = (e.target as HTMLInputElement).value)}
          ></ha-textfield>
          <ha-area-picker
            .hass=${this.hass}
            label="${t("area_id_optional", L)}"
            .value=${this._areaId}
            @value-changed=${(e: CustomEvent) =>
              (this._areaId = (e.detail.value as string) || "")}
          ></ha-area-picker>
          <ha-textfield
            label="${t("installation_date_optional", L)}"
            type="date"
            .value=${this._installationDate}
            @input=${(e: Event) => (this._installationDate = (e.target as HTMLInputElement).value)}
          ></ha-textfield>
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${t("cancel", this._lang)}
          </ha-button>
          <ha-button
            @click=${this._save}
            .disabled=${this._loading || !this._name.trim()}
          >
            ${this._loading ? t("saving", this._lang) : t("save", this._lang)}
          </ha-button>
        </div>
      </ha-dialog>
    `;
  }

  static styles = css`
    .dialog-title {
      font-size: 18px;
      font-weight: 500;
      padding-bottom: 12px;
    }
    .content {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 300px;
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding-top: 16px;
    }
    ha-textfield {
      display: block;
    }
    .error {
      color: var(--error-color, #f44336);
      font-size: 13px;
    }
  `;
}

if (!customElements.get("maintenance-object-dialog")) {
  customElements.define("maintenance-object-dialog", MaintenanceObjectDialog);
}
