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

export class MaintenanceConfirmDialog extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private _open = false;
  @state() private _title = "";
  @state() private _message = "";
  @state() private _confirmText = "";
  @state() private _danger = false;

  private _resolve: ((value: boolean) => void) | null = null;

  public confirm(opts: ConfirmOptions): Promise<boolean> {
    this._title = opts.title;
    this._message = opts.message;
    this._confirmText = opts.confirmText || "OK";
    this._danger = opts.danger || false;
    this._open = true;
    return new Promise<boolean>((resolve) => {
      this._resolve = resolve;
    });
  }

  private _cancel(): void {
    this._open = false;
    this._resolve?.(false);
    this._resolve = null;
  }

  private _confirmAction(): void {
    this._open = false;
    this._resolve?.(true);
    this._resolve = null;
  }

  render() {
    if (!this._open) return nothing;
    const lang = this.hass?.language || "de";
    return html`
      <ha-dialog open @closed=${this._cancel} .heading=${this._title}>
        <div class="content">${this._message}</div>
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
    }
    ha-button.danger {
      --mdc-theme-primary: var(--error-color, #f44336);
    }
  `;
}

if (!customElements.get("maintenance-confirm-dialog")) {
  customElements.define("maintenance-confirm-dialog", MaintenanceConfirmDialog);
}
