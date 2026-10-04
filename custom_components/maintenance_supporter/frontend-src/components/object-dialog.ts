/** Dialog for creating, editing and replacing a maintenance object. */

import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import type { HomeAssistant, MaintenanceObject, MaintenanceObjectResponse } from "../types";

/** What a device change did to the tasks' wiring (object/update + replace). */
export interface DeviceSwap {
  moved: number;
  unmatched: string[];
}

type ReplaceDevice = "keep" | "other" | "none";
import { t, langOf } from "../styles";

import { runWs } from "../helpers/ws-run";
import "./ms-textfield";
import "./ms-date-field";

export class MaintenanceObjectDialog extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  /** All objects — choices for the parent-object picker (2.19). */
  @property({ attribute: false }) public objects: MaintenanceObjectResponse[] = [];
  /** 2026-10 places: the advanced feature switch shows the place fields. */
  @property({ type: Boolean }) public placesEnabled = false;
  @state() private _open = false;
  @state() private _loading = false;
  @state() private _error = "";
  @state() private _name = "";
  @state() private _manufacturer = "";
  @state() private _model = "";
  @state() private _serialNumber = "";
  @state() private _areaId = "";
  @state() private _installationDate = "";
  // (#67): per-object warranty expiry date
  @state() private _warrantyExpiry = "";
  // v1.4.0 (#43): per-object link to PDF manual / vendor page
  @state() private _documentationUrl = "";
  // v1.4.10 (#46): free-form notes (multiline)
  @state() private _notes = "";
  // 2.19: attach to an existing HA device / nest under another object
  @state() private _haDeviceId = "";
  @state() private _parentEntryId = "";
  // 2026-10 places: an HA zone ("" = home) and "remind only on site".
  @state() private _place = "";
  @state() private _remindOnSite = false;
  @state() private _entryId: string | null = null; // null = create, string = update
  // Replace (journey N1): the successor's device. The old unit's device is
  // what the object links to now; a new unit usually is a new device.
  @state() private _replacing = false;
  @state() private _oldDeviceId = "";
  @state() private _replaceDevice: ReplaceDevice = "keep";

  private get _lang(): string {
    return langOf(this.hass);
  }

  public openCreate(): void {
    this._entryId = null;
    this._name = "";
    this._manufacturer = "";
    this._model = "";
    this._serialNumber = "";
    this._areaId = "";
    this._installationDate = "";
    this._warrantyExpiry = "";
    this._documentationUrl = "";
    this._notes = "";
    this._haDeviceId = "";
    this._parentEntryId = "";
    this._place = "";
    this._remindOnSite = false;
    this._replacing = false;
    this._error = "";
    this._open = true;
  }

  /** Replace a worn-out object: the old one is archived in place, a
   *  successor carries its tasks and documents over. Asks for the name and
   *  for the new unit's device — keeping the old link silently made the
   *  successor watch the retired machine's sensors. */
  public openReplace(entryId: string, obj: MaintenanceObject): void {
    this._entryId = entryId;
    this._replacing = true;
    this._name = obj.name || "";
    this._oldDeviceId = obj.ha_device_id || "";
    this._haDeviceId = "";
    this._replaceDevice = "keep";
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
    this._warrantyExpiry = obj.warranty_expiry || "";
    this._documentationUrl = obj.documentation_url || "";
    this._notes = obj.notes || "";
    this._haDeviceId = obj.ha_device_id || "";
    this._parentEntryId = obj.parent_entry_id || "";
    this._place = obj.place || "";
    this._remindOnSite = !!obj.remind_on_site;
    this._replacing = false;
    this._error = "";
    this._open = true;
  }

  private async _replace(): Promise<void> {
    if (this._loading || !this._entryId) return;
    const msg: Record<string, unknown> = {
      type: "maintenance_supporter/object/replace",
      entry_id: this._entryId,
      name: this._name.trim() || null,
    };
    if (this._oldDeviceId) {
      // "keep" sends nothing: the successor stays on the same device.
      if (this._replaceDevice === "other") msg.ha_device_id = this._haDeviceId;
      if (this._replaceDevice === "none") msg.ha_device_id = null;
    } else if (this._haDeviceId) {
      msg.ha_device_id = this._haDeviceId;
    }
    const res = await runWs<{ entry_id?: string; device_swap?: DeviceSwap }>(this, msg, {
      busy: (b) => { this._loading = b; },
      fallbackKey: "save_error",
      onError: (m) => { this._error = m; },
    });
    if (res === undefined) return;
    this._open = false;
    this.dispatchEvent(new CustomEvent("object-replaced", {
      detail: { entry_id: res?.entry_id, device_swap: res?.device_swap },
    }));
  }

  private _deviceName(deviceId: string): string {
    const devices = (this.hass as unknown as { devices?: Record<string, { name?: string | null; name_by_user?: string | null }> })?.devices;
    const device = devices?.[deviceId];
    return device?.name_by_user || device?.name || deviceId;
  }

  private _deviceSelector(label: string) {
    return html`<ha-form
      .hass=${this.hass}
      .data=${{ device: this._haDeviceId || undefined }}
      .schema=${[{ name: "device", selector: { device: {} } }]}
      .computeLabel=${() => label}
      @value-changed=${(e: CustomEvent) =>
        (this._haDeviceId =
          ((e.detail.value as { device?: string })?.device as string) || "")}
    ></ha-form>`;
  }

  private _renderReplace() {
    const L = this._lang;
    const choice = (value: ReplaceDevice, label: string) => html`<label class="radio-row">
      <input
        type="radio"
        name="replace-device"
        .checked=${this._replaceDevice === value}
        @change=${() => { this._replaceDevice = value; }}
      />
      <span>${label}</span>
    </label>`;
    const blocked = this._replaceDevice === "other" && !this._haDeviceId;
    return html`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${t("replace_object", L)}</div>
        <div class="content">
          ${this._error ? html`<div class="error">${this._error}</div>` : nothing}
          <div class="hint">${t("replace_object_prompt", L)}</div>
          <ms-textfield
            label="${t("replace_name_label", L)}"
            .value=${this._name}
            @input=${(e: Event) => (this._name = (e.target as HTMLInputElement).value)}
          ></ms-textfield>
          ${this._oldDeviceId
            ? html`<div class="radio-group" role="radiogroup" aria-label=${t("replace_device_heading", L)}>
                <div class="textarea-label">${t("replace_device_heading", L)}</div>
                ${choice("keep", t("replace_device_keep", L).replace("{device}", this._deviceName(this._oldDeviceId)))}
                ${this._replaceDevice === "keep" ? html`<div class="hint">${t("replace_device_keep_hint", L)}</div>` : nothing}
                ${choice("other", t("replace_device_other", L))}
                ${this._replaceDevice === "other"
                  ? html`${this._deviceSelector(t("replace_device_pick", L))}
                      <div class="hint">${t("replace_device_other_hint", L)}</div>`
                  : nothing}
                ${choice("none", t("replace_device_none", L))}
              </div>`
            : this._deviceSelector(t("link_device_optional", L))}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${t("cancel", L)}
          </ha-button>
          <ha-button @click=${this._replace} .disabled=${this._loading || blocked}>
            ${this._loading ? t("saving", L) : t("replace_object", L)}
          </ha-button>
        </div>
      </ha-dialog>
    `;
  }

  /** 2026-10 places: the zone the object is maintained at ("" = home) and
   *  whether its reminders wait until somebody is there. */
  private _renderPlace(L: string) {
    const missing = !!this._place && !this.hass?.states?.[this._place];
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${{ place: this._place || undefined }}
        .schema=${[{ name: "place", selector: { entity: { domain: "zone" } } }]}
        .computeLabel=${() => t("place_optional", L)}
        @value-changed=${(e: CustomEvent) => {
          this._place = ((e.detail.value as { place?: string })?.place as string) || "";
          if (!this._place) this._remindOnSite = false;
        }}
      ></ha-form>
      ${missing ? html`<div class="place-missing">${t("place_missing", L)}</div>` : nothing}
      <label class="place-on-site ${this._place ? "" : "disabled"}">
        <input
          type="checkbox"
          .checked=${this._remindOnSite}
          ?disabled=${!this._place}
          @change=${(e: Event) => (this._remindOnSite = (e.target as HTMLInputElement).checked)}
        />
        <span>${t("remind_on_site", L)}</span>
      </label>
      ${this._place ? html`<div class="place-hint">${t("remind_on_site_hint", L)}</div>` : nothing}
    `;
  }

  private async _save(): Promise<void> {
    if (this._loading) return;  // synchronous re-entry guard (double-click)
    if (!this._name.trim()) return;
    this._error = "";
    // One field set for create and update (the two payloads were copies).
    const fields = {
      name: this._name,
      manufacturer: this._manufacturer || null,
      model: this._model || null,
      serial_number: this._serialNumber || null,
      area_id: this._areaId || null,
      installation_date: this._installationDate || null,
      warranty_expiry: this._warrantyExpiry || null,
      documentation_url: this._documentationUrl.trim() || null,
      notes: this._notes.trim() || null,
      ha_device_id: this._haDeviceId || null,
      parent_entry_id: this._parentEntryId || null,
      // Only with the feature on: switched off, a stored place is kept as is.
      ...(this.placesEnabled ? { place: this._place || null, remind_on_site: !!this._place && this._remindOnSite } : {}),
    };
    const res = await runWs<{ device_swap?: DeviceSwap }>(
      this,
      this._entryId
        ? { type: "maintenance_supporter/object/update", entry_id: this._entryId, ...fields }
        : { type: "maintenance_supporter/object/create", ...fields },
      { busy: (b) => { this._loading = b; }, fallbackKey: "save_error", onError: (m) => { this._error = m; } },
    );
    if (res === undefined) return;
    this._open = false;
    // A changed device moved the tasks' sensor links along — the panel says
    // how many, and which could not be placed.
    this.dispatchEvent(new CustomEvent("object-saved", { detail: { device_swap: res?.device_swap } }));
  }

  private _parentChoices(): MaintenanceObjectResponse[] {
    return (this.objects || []).filter((o) => o.entry_id !== this._entryId);
  }

  private _close(): void {
    this._open = false;
  }

  render() {
    if (!this._open) return html``;
    if (this._replacing) return this._renderReplace();
    const L = this._lang;
    const title = this._entryId ? t("edit_object", L) : t("new_object", L);
    return html`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${title}</div>
        <div class="content">
          ${this._error ? html`<div class="error">${this._error}</div>` : nothing}
          <ms-textfield
            label="${t("name", L)}"
            required
            .value=${this._name}
            @input=${(e: Event) => (this._name = (e.target as HTMLInputElement).value)}
          ></ms-textfield>
          <ms-textfield
            label="${t("manufacturer_optional", L)}"
            .value=${this._manufacturer}
            @input=${(e: Event) => (this._manufacturer = (e.target as HTMLInputElement).value)}
          ></ms-textfield>
          <ms-textfield
            label="${t("model_optional", L)}"
            .value=${this._model}
            @input=${(e: Event) => (this._model = (e.target as HTMLInputElement).value)}
          ></ms-textfield>
          <ms-textfield
            label="${t("serial_number_optional", L)}"
            .value=${this._serialNumber}
            @input=${(e: Event) => (this._serialNumber = (e.target as HTMLInputElement).value)}
          ></ms-textfield>
          <ms-textfield
            label="${t("documentation_url_optional", L)}"
            type="url"
            .value=${this._documentationUrl}
            @input=${(e: Event) => (this._documentationUrl = (e.target as HTMLInputElement).value)}
          ></ms-textfield>
          <ha-area-picker
            .hass=${this.hass}
            label="${t("area_id_optional", L)}"
            .value=${this._areaId}
            @value-changed=${(e: CustomEvent) =>
              (this._areaId = (e.detail.value as string) || "")}
          ></ha-area-picker>
          ${this.placesEnabled ? this._renderPlace(L) : nothing}
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${L}
            label="${t("installation_date_optional", L)}"
            .value=${this._installationDate}
            @value-changed=${(e: CustomEvent) => (this._installationDate = e.detail.value as string)}
          ></ms-date-field>
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${L}
            label="${t("warranty_expiry_optional", L)}"
            .value=${this._warrantyExpiry}
            @value-changed=${(e: CustomEvent) => (this._warrantyExpiry = e.detail.value as string)}
          ></ms-date-field>
          <ha-form
            .hass=${this.hass}
            .data=${{ device: this._haDeviceId || undefined }}
            .schema=${[{ name: "device", selector: { device: {} } }]}
            .computeLabel=${() => t("link_device_optional", L)}
            @value-changed=${(e: CustomEvent) =>
              (this._haDeviceId =
                ((e.detail.value as { device?: string })?.device as string) || "")}
          ></ha-form>
          ${this._parentChoices().length
            ? html`<label class="textarea-field">
                <span class="textarea-label">${t("parent_object_optional", L)}</span>
                <select
                  class="parent-select"
                  .value=${this._parentEntryId}
                  @change=${(e: Event) =>
                    (this._parentEntryId = (e.target as HTMLSelectElement).value)}
                >
                  <option value="" ?selected=${!this._parentEntryId}>
                    ${t("parent_none", L)}
                  </option>
                  ${this._parentChoices().map(
                    (o) => html`<option
                      value=${o.entry_id}
                      ?selected=${this._parentEntryId === o.entry_id}
                    >${o.object.name}</option>`,
                  )}
                </select>
              </label>`
            : nothing}
          <label class="textarea-field">
            <span class="textarea-label">${t("object_notes_optional", L)}</span>
            <textarea
              rows="3"
              .value=${this._notes}
              @input=${(e: Event) => (this._notes = (e.target as HTMLTextAreaElement).value)}
            ></textarea>
            <span class="md-hint">${t("notes_markdown_hint", L)}</span>
          </label>
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
    .place-on-site {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: var(--primary-text-color);
    }
    .place-on-site.disabled {
      color: var(--disabled-text-color, var(--secondary-text-color));
    }
    .place-hint,
    .place-missing {
      font-size: 12px;
      color: var(--secondary-text-color);
      margin-top: -4px;
    }
    .place-missing {
      color: var(--warning-color, #c77700);
    }
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
    ms-textfield {
      display: block;
    }
    .textarea-field {
      display: flex; flex-direction: column; gap: 4px;
    }
    .textarea-label {
      font-size: 12px; color: var(--secondary-text-color, #888); font-weight: 500;
    }
    .textarea-field textarea {
      padding: 8px 10px; font-size: 14px; font-family: inherit;
      background: var(--secondary-background-color, rgba(0,0,0,0.06));
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color); border-radius: 6px;
      resize: vertical;
    }
    .textarea-field textarea:focus {
      outline: none; border-color: var(--primary-color);
    }
    .md-hint {
      font-size: 11px; color: var(--secondary-text-color); font-style: italic;
    }
    .parent-select {
      padding: 8px 10px; font-size: 14px; font-family: inherit;
      background: var(--secondary-background-color, rgba(0,0,0,0.06));
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color); border-radius: 6px;
    }
    .error {
      color: var(--error-color, #f44336);
      font-size: 13px;
    }
    .hint {
      font-size: 13px;
      color: var(--secondary-text-color);
      line-height: 1.4;
    }
    .radio-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .radio-row {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      cursor: pointer;
    }
    .radio-row input {
      margin: 0;
    }
  `;
}

if (!customElements.get("maintenance-object-dialog")) {
  customElements.define("maintenance-object-dialog", MaintenanceObjectDialog);
}
