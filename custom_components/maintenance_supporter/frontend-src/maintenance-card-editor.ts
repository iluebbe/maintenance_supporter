/** Card editor for the Maintenance Supporter Lovelace card. */

import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { t } from "./styles";
import type { HomeAssistant, CardConfig, MaintenanceObjectResponse } from "./types";

const STATUS_KEYS = ["overdue", "triggered", "due_soon", "ok"] as const;

export class MaintenanceSupporterCardEditor extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config: CardConfig = { type: "custom:maintenance-supporter-card" };
  @state() private _objects: MaintenanceObjectResponse[] = [];
  @state() private _loadingObjects = true;

  private _objectsLoaded = false;

  private get _lang(): string {
    return this.hass?.language || "en";
  }

  setConfig(config: CardConfig): void {
    this._config = { ...config };
  }

  updated(changedProps: Map<string, unknown>): void {
    super.updated(changedProps);
    if (changedProps.has("hass") && this.hass && !this._objectsLoaded) {
      this._objectsLoaded = true;
      this._loadObjects();
    }
  }

  private async _loadObjects(): Promise<void> {
    try {
      const result = await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/objects",
      }) as { objects: MaintenanceObjectResponse[] };
      this._objects = result.objects || [];
    } catch {
      this._objects = [];
    }
    this._loadingObjects = false;
  }

  private _valueChanged(key: string, value: unknown): void {
    const newConfig = { ...this._config, [key]: value };
    // Drop empty arrays so the saved YAML stays clean
    if (Array.isArray(value) && value.length === 0) {
      delete (newConfig as Record<string, unknown>)[key];
    }
    this._config = newConfig;
    this.dispatchEvent(
      new CustomEvent("config-changed", { detail: { config: newConfig } })
    );
  }

  private _toggleStatus(status: string, on: boolean): void {
    const current = new Set(this._config.filter_status || []);
    if (on) current.add(status); else current.delete(status);
    this._valueChanged("filter_status", [...current]);
  }

  private _toggleObject(name: string, on: boolean): void {
    const current = new Set(this._config.filter_objects || []);
    if (on) current.add(name); else current.delete(name);
    this._valueChanged("filter_objects", [...current]);
  }

  private _onEntitiesChanged = (e: CustomEvent<{ value: string[] }>): void => {
    this._valueChanged("entity_ids", e.detail.value || []);
  };

  render() {
    const L = this._lang;
    const selectedStatuses = new Set(this._config.filter_status || []);
    const selectedObjects = new Set(this._config.filter_objects || []);
    const objectNames = [...this._objects]
      .map((o) => o.object.name)
      .sort((a, b) => a.localeCompare(b));

    return html`
      <div class="editor">
        <ha-textfield
          label="${t("card_title", L)}"
          .value=${this._config.title || ""}
          @input=${(e: Event) =>
            this._valueChanged("title", (e.target as HTMLInputElement).value)}
        ></ha-textfield>

        <!-- Status filter (chip row) -->
        <div class="field">
          <div class="field-label">${t("card_filter_status", L)}</div>
          <div class="chip-row">
            ${STATUS_KEYS.map((s) => html`
              <label class="chip ${selectedStatuses.has(s) ? "active" : ""}">
                <input type="checkbox"
                  .checked=${selectedStatuses.has(s)}
                  @change=${(e: Event) => this._toggleStatus(s, (e.target as HTMLInputElement).checked)} />
                ${t(s, L)}
              </label>
            `)}
          </div>
          <div class="field-help">${t("card_filter_status_help", L)}</div>
        </div>

        <!-- Object filter (multi-checkbox) -->
        <div class="field">
          <div class="field-label">${t("card_filter_objects", L)}</div>
          ${this._loadingObjects
            ? html`<div class="field-help">${t("card_loading_objects", L)}</div>`
            : objectNames.length === 0
              ? html`<div class="field-help">${t("no_objects", L)}</div>`
              : html`
                <div class="object-list">
                  ${objectNames.map((name) => html`
                    <label class="object-row">
                      <input type="checkbox"
                        .checked=${selectedObjects.has(name)}
                        @change=${(e: Event) => this._toggleObject(name, (e.target as HTMLInputElement).checked)} />
                      <span>${name}</span>
                    </label>
                  `)}
                </div>
                <div class="field-help">${t("card_filter_objects_help", L)}</div>
              `}
        </div>

        <!-- Entity-id filter (HA-native pattern) -->
        <div class="field">
          <div class="field-label">${t("card_filter_entities", L)}</div>
          <ha-entities-picker
            .hass=${this.hass}
            .value=${this._config.entity_ids || []}
            include-domains='["sensor", "binary_sensor"]'
            @value-changed=${this._onEntitiesChanged}
          ></ha-entities-picker>
          <div class="field-help">${t("card_filter_entities_help", L)}</div>
        </div>

        <ha-formfield label="${t("card_show_header", L)}">
          <ha-switch
            .checked=${this._config.show_header !== false}
            @change=${(e: Event) =>
              this._valueChanged("show_header", (e.target as HTMLInputElement).checked)}
          ></ha-switch>
        </ha-formfield>

        <ha-formfield label="${t("card_show_actions", L)}">
          <ha-switch
            .checked=${this._config.show_actions !== false}
            @change=${(e: Event) =>
              this._valueChanged("show_actions", (e.target as HTMLInputElement).checked)}
          ></ha-switch>
        </ha-formfield>

        <ha-formfield label="${t("card_compact", L)}">
          <ha-switch
            .checked=${this._config.compact || false}
            @change=${(e: Event) =>
              this._valueChanged("compact", (e.target as HTMLInputElement).checked)}
          ></ha-switch>
        </ha-formfield>

        <ha-textfield
          label="${t("card_max_items", L)}"
          type="number"
          .value=${String(this._config.max_items || 0)}
          @input=${(e: Event) =>
            this._valueChanged("max_items", parseInt((e.target as HTMLInputElement).value, 10) || 0)}
        ></ha-textfield>
        ${nothing}
      </div>
    `;
  }

  static styles = css`
    .editor {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px;
    }
    ha-textfield { display: block; }
    .field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .field-label {
      font-size: 13px;
      color: var(--secondary-text-color);
      font-weight: 500;
    }
    .field-help {
      font-size: 12px;
      color: var(--secondary-text-color);
      font-style: italic;
    }
    .chip-row {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      border: 1px solid var(--divider-color);
      border-radius: 14px;
      cursor: pointer;
      font-size: 13px;
      user-select: none;
      transition: background 0.15s, border-color 0.15s;
    }
    .chip:hover {
      background: var(--secondary-background-color);
    }
    .chip.active {
      background: var(--primary-color);
      color: var(--text-primary-color);
      border-color: var(--primary-color);
    }
    .chip input {
      display: none;
    }
    .object-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 4px 12px;
      padding: 6px 0;
    }
    .object-row {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 3px 0;
      font-size: 13px;
      cursor: pointer;
    }
    .object-row input { cursor: pointer; }
  `;
}

// Module-bottom registration so esbuild's tree-shaker doesn't drop the
// element class when the only reference looks "type-only" (the
// @customElement decorator pattern triggered exactly that bug for the
// dialog components — same fix applied here for the card editor).
if (!customElements.get("maintenance-supporter-card-editor")) {
  customElements.define(
    "maintenance-supporter-card-editor",
    MaintenanceSupporterCardEditor,
  );
}
