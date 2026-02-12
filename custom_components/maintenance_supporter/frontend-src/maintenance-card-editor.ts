/** Card editor for the Maintenance Supporter Lovelace card. */

import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant, CardConfig } from "./types";

@customElement("maintenance-supporter-card-editor")
export class MaintenanceSupporterCardEditor extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config: CardConfig = { type: "custom:maintenance-supporter-card" };

  setConfig(config: CardConfig): void {
    this._config = { ...config };
  }

  private _valueChanged(key: string, value: unknown): void {
    const newConfig = { ...this._config, [key]: value };
    this._config = newConfig;
    this.dispatchEvent(
      new CustomEvent("config-changed", { detail: { config: newConfig } })
    );
  }

  render() {
    return html`
      <div class="editor">
        <ha-textfield
          label="Title"
          .value=${this._config.title || ""}
          @input=${(e: Event) =>
            this._valueChanged("title", (e.target as HTMLInputElement).value)}
        ></ha-textfield>

        <ha-formfield label="Show header with statistics">
          <ha-switch
            .checked=${this._config.show_header !== false}
            @change=${(e: Event) =>
              this._valueChanged("show_header", (e.target as HTMLInputElement).checked)}
          ></ha-switch>
        </ha-formfield>

        <ha-formfield label="Show action buttons">
          <ha-switch
            .checked=${this._config.show_actions !== false}
            @change=${(e: Event) =>
              this._valueChanged("show_actions", (e.target as HTMLInputElement).checked)}
          ></ha-switch>
        </ha-formfield>

        <ha-formfield label="Compact mode">
          <ha-switch
            .checked=${this._config.compact || false}
            @change=${(e: Event) =>
              this._valueChanged("compact", (e.target as HTMLInputElement).checked)}
          ></ha-switch>
        </ha-formfield>

        <ha-textfield
          label="Max items (0 = all)"
          type="number"
          .value=${String(this._config.max_items || 0)}
          @input=${(e: Event) =>
            this._valueChanged("max_items", parseInt((e.target as HTMLInputElement).value, 10) || 0)}
        ></ha-textfield>
      </div>
    `;
  }

  static styles = css`
    .editor {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 16px;
    }
    ha-textfield {
      display: block;
    }
  `;
}
