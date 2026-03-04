/** Reusable confirmation dialog wrapping <ha-dialog>. */

import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import type { HomeAssistant } from "../types";
import { t } from "../styles";

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  danger?: boolean;
}

export interface PromptOptions extends ConfirmOptions {
  inputLabel?: string;
  inputType?: string; // "text" | "date" etc.
  inputValue?: string;
}

export interface PromptResult {
  confirmed: boolean;
  value: string;
}

export class MaintenanceConfirmDialog extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private _open = false;
  @state() private _title = "";
  @state() private _message = "";
  @state() private _confirmText = "";
  @state() private _danger = false;
  @state() private _inputLabel = "";
  @state() private _inputType = "";
  @state() private _inputValue = "";

  private _resolve: ((value: boolean) => void) | null = null;
  private _promptResolve: ((value: PromptResult) => void) | null = null;

  public confirm(opts: ConfirmOptions): Promise<boolean> {
    this._title = opts.title;
    this._message = opts.message;
    this._confirmText = opts.confirmText || "OK";
    this._danger = opts.danger || false;
    this._inputLabel = "";
    this._inputType = "";
    this._inputValue = "";
    this._open = true;
    return new Promise<boolean>((resolve) => {
      this._resolve = resolve;
      this._promptResolve = null;
    });
  }

  public prompt(opts: PromptOptions): Promise<PromptResult> {
    this._title = opts.title;
    this._message = opts.message;
    this._confirmText = opts.confirmText || "OK";
    this._danger = opts.danger || false;
    this._inputLabel = opts.inputLabel || "";
    this._inputType = opts.inputType || "text";
    this._inputValue = opts.inputValue || "";
    this._open = true;
    return new Promise<PromptResult>((resolve) => {
      this._promptResolve = resolve;
      this._resolve = null;
    });
  }

  private _cancel(): void {
    this._open = false;
    if (this._promptResolve) {
      this._promptResolve({ confirmed: false, value: "" });
      this._promptResolve = null;
    }
    this._resolve?.(false);
    this._resolve = null;
  }

  private _confirmAction(): void {
    this._open = false;
    if (this._promptResolve) {
      this._promptResolve({ confirmed: true, value: this._inputValue });
      this._promptResolve = null;
    }
    this._resolve?.(true);
    this._resolve = null;
  }

  render() {
    if (!this._open) return nothing;
    const lang = this.hass?.language || "de";
    return html`
      <ha-dialog open @closed=${this._cancel} .heading=${this._title}>
        <div class="content">
          ${this._message}
          ${this._inputLabel ? html`
            <ha-textfield
              label="${this._inputLabel}"
              type="${this._inputType}"
              .value=${this._inputValue}
              @input=${(e: Event) => (this._inputValue = (e.target as HTMLInputElement).value)}
            ></ha-textfield>
          ` : nothing}
        </div>
        <ha-button slot="secondaryAction" appearance="plain" @click=${this._cancel}>
          ${t("cancel", lang)}
        </ha-button>
        <ha-button
          slot="primaryAction"
          class="${this._danger ? "danger" : ""}"
          @click=${this._confirmAction}
        >
          ${this._confirmText}
        </ha-button>
      </ha-dialog>
    `;
  }

  static styles = css`
    .content {
      padding: 8px 0;
      min-width: 280px;
      line-height: 1.5;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    ha-textfield {
      display: block;
    }
    ha-button.danger {
      --mdc-theme-primary: var(--error-color, #f44336);
    }
  `;
}

if (!customElements.get("maintenance-confirm-dialog")) {
  customElements.define("maintenance-confirm-dialog", MaintenanceConfirmDialog);
}
