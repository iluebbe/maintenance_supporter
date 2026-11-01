/** Reusable confirmation dialog wrapping <ha-dialog>. */

import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import type { HomeAssistant } from "../types";
import { langOf, t, nativeFieldStyles } from "../styles";
import { headerTitle, titleLine } from "../helpers/beta-ui";
import { selectField, selectIsHa } from "../helpers/select-field";
import { checkField } from "../helpers/check-field";

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
  /** Render a <select> instead of a text input (task/move picks an object). */
  options?: { value: string; label: string }[];
}

export interface PromptResult {
  confirmed: boolean;
  value: string;
}

/** #247: a yes/no question with one more choice below the message, ticked
 *  at first (delete a buy task: "also turn off the part's buy reminder"). */
export interface CheckOptions extends ConfirmOptions {
  check: string;
}

export interface CheckResult {
  confirmed: boolean;
  checked: boolean;
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
  @state() private _options: { value: string; label: string }[] | null = null;
  @state() private _inputValue = "";
  @state() private _check = "";
  @state() private _checked = true;

  private _resolve: ((value: boolean) => void) | null = null;
  private _promptResolve: ((value: PromptResult) => void) | null = null;
  private _checkResolve: ((value: CheckResult) => void) | null = null;

  /** Open with one question; the caller hands in the one resolver it waits on. */
  private _show(opts: PromptOptions & { check?: string }): void {
    this._title = opts.title;
    this._message = opts.message;
    this._confirmText = opts.confirmText || "OK";
    this._danger = opts.danger || false;
    this._inputLabel = opts.inputLabel || "";
    this._inputType = opts.inputType || "";
    this._options = opts.options && opts.options.length ? opts.options : null;
    this._inputValue = opts.inputValue || "";
    this._check = opts.check || "";
    this._checked = true;
    this._resolve = null;
    this._promptResolve = null;
    this._checkResolve = null;
    this._open = true;
  }

  public confirm(opts: ConfirmOptions): Promise<boolean> {
    this._show(opts);
    return new Promise<boolean>((resolve) => (this._resolve = resolve));
  }

  public confirmWithCheck(opts: CheckOptions): Promise<CheckResult> {
    this._show(opts);
    return new Promise<CheckResult>((resolve) => (this._checkResolve = resolve));
  }

  public prompt(opts: PromptOptions): Promise<PromptResult> {
    this._show(opts);
    return new Promise<PromptResult>((resolve) => (this._promptResolve = resolve));
  }

  private _cancel(): void {
    this._open = false;
    if (this._promptResolve) {
      this._promptResolve({ confirmed: false, value: "" });
      this._promptResolve = null;
    }
    this._checkResolve?.({ confirmed: false, checked: false });
    this._checkResolve = null;
    this._resolve?.(false);
    this._resolve = null;
  }

  private _confirmAction(): void {
    this._open = false;
    if (this._promptResolve) {
      this._promptResolve({ confirmed: true, value: this._inputValue });
      this._promptResolve = null;
    }
    this._checkResolve?.({ confirmed: true, checked: this._checked });
    this._checkResolve = null;
    this._resolve?.(true);
    this._resolve = null;
  }

  render() {
    if (!this._open) return nothing;
    const lang = langOf(this.hass);
    return html`
      <ha-dialog open .headerTitle=${headerTitle(this._title)} @closed=${this._cancel}>
        ${titleLine(this._title)}
        <div class="content">
          ${this._message}
          ${this._check
            ? checkField({ cls: "confirm-check", checked: this._checked, onChange: (e: Event) => (this._checked = (e.target as HTMLInputElement).checked) }, this._check)
            : nothing}
          ${this._inputLabel ? html`
            <!-- Native <input> rather than <ha-textfield>: HA loads
                 ha-textfield lazily for its own panels, so inside this custom
                 panel it can be unregistered and render with zero height —
                 the prompt then shows no field at all (caught live testing
                 the pause/replace prompts; same fix as complete-dialog). -->
            <label class="field">
              <span class="field-label">${this._inputLabel}</span>
              ${this._options
                ? html`${selectField({ cls: "field-input field-select", onChange: (e: Event) => (this._inputValue = (e.target as HTMLSelectElement).value) }, html`
                    ${this._options.map((o) => html`<option value=${o.value} ?selected=${o.value === this._inputValue}>${o.label}</option>`)}
                  `)}`
                : html`<input class="field-input"
                    type="${this._inputType || "text"}"
                    .value=${this._inputValue}
                    @input=${(e: Event) => (this._inputValue = (e.target as HTMLInputElement).value)} />`}
            </label>
          ` : nothing}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._cancel}>
            ${t("cancel", lang)}
          </ha-button>
          <ha-button
            class="${this._danger ? "danger" : ""}"
            variant=${this._danger ? "danger" : "brand"}
            @click=${this._confirmAction}
          >
            ${this._confirmText}
          </ha-button>
        </div>
      </ha-dialog>
    `;
  }

  static styles = [nativeFieldStyles, css`
    .dialog-title {
      font-size: 18px;
      font-weight: 500;
      padding-bottom: 12px;
    }
    /* shared native-field scaffold from nativeFieldStyles; the prompt input
       follows the message text, hence the extra top margin here */
    .field { margin-top: 12px; }
    .confirm-check { display: flex; align-items: center; gap: 8px; cursor: pointer; }
    .content {
      padding: 8px 0;
      min-width: 280px;
      line-height: 1.5;
      display: flex;
      flex-direction: column;
      gap: 12px;
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
    ha-button.danger {
      --mdc-theme-primary: var(--error-color, #f44336);
    }
  `];
}

if (!customElements.get("maintenance-confirm-dialog")) {
  customElements.define("maintenance-confirm-dialog", MaintenanceConfirmDialog);
}
