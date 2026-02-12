/** Dialog for creating/editing a maintenance object. */

import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant, MaintenanceObject } from "../types";
import { t } from "../styles";

@customElement("maintenance-object-dialog")
export class MaintenanceObjectDialog extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _open = false;
  @state() private _loading = false;
  @state() private _name = "";
  @state() private _manufacturer = "";
  @state() private _model = "";
  @state() private _entryId: string | null = null; // null = create, string = update

  private get _lang(): string {
    return this.hass?.language ?? navigator.language.split("-")[0] ?? "en";
  }

  public openCreate(): void {
    this._entryId = null;
    this._name = "";
    this._manufacturer = "";
    this._model = "";
    this._open = true;
  }

  public openEdit(entryId: string, obj: MaintenanceObject): void {
    this._entryId = entryId;
    this._name = obj.name || "";
    this._manufacturer = obj.manufacturer || "";
    this._model = obj.model || "";
    this._open = true;
  }

  private async _save(): Promise<void> {
    if (!this._name.trim()) return;
    this._loading = true;
    try {
      if (this._entryId) {
        await this.hass.connection.sendMessagePromise({
          type: "maintenance_supporter/object/update",
          entry_id: this._entryId,
          name: this._name,
          manufacturer: this._manufacturer || null,
          model: this._model || null,
        });
      } else {
        await this.hass.connection.sendMessagePromise({
          type: "maintenance_supporter/object/create",
          name: this._name,
          manufacturer: this._manufacturer || null,
          model: this._model || null,
        });
      }
      this._open = false;
      this.dispatchEvent(new CustomEvent("object-saved"));
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
      <ha-dialog open @closed=${this._close} .heading=${title}>
        <div class="content">
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
        </div>
        <ha-button slot="secondaryAction" appearance="plain" @click=${this._close}>
          ${t("cancel", this._lang)}
        </ha-button>
        <ha-button
          slot="primaryAction"
          @click=${this._save}
          .disabled=${this._loading || !this._name.trim()}
        >
          ${this._loading ? t("saving", this._lang) : t("save", this._lang)}
        </ha-button>
      </ha-dialog>
    `;
  }

  static styles = css`
    .content {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 300px;
    }
    ha-textfield {
      display: block;
    }
  `;
}
