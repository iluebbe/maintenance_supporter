/** Card editor for the Maintenance Supporter Lovelace card. */

import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";
import { t } from "./styles";
import type { HomeAssistant, CardConfig } from "./types";

export class MaintenanceSupporterCardEditor extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config: CardConfig = { type: "custom:maintenance-supporter-card" };

  private get _lang(): string {
    return this.hass?.language || "en";
  }

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
    const L = this._lang;
    return html`
      <div class="editor">
        <ha-textfield
          label="${t("card_title", L)}"
          .value=${this._config.title || ""}
          @input=${(e: Event) =>
            this._valueChanged("title", (e.target as HTMLInputElement).value)}
        ></ha-textfield>

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
