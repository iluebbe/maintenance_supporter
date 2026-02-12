/** Dialog for generating, printing, and downloading QR codes. */

import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant } from "../types";
import { t } from "../styles";

interface QrResult {
  svg_data_uri: string;
  url: string;
  label: {
    object_name: string;
    manufacturer: string;
    model: string;
    task_name: string | null;
  };
}

@customElement("maintenance-qr-dialog")
export class MaintenanceQrDialog extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property() public lang = "de";

  @state() private _open = false;
  @state() private _loading = false;
  @state() private _error = "";
  @state() private _result: QrResult | null = null;
  @state() private _action: "view" | "complete" = "view";

  private _entryId = "";
  private _taskId: string | null = null;
  private _objectName = "";
  private _taskName = "";

  public openForObject(entryId: string, objectName: string): void {
    this._entryId = entryId;
    this._taskId = null;
    this._objectName = objectName;
    this._taskName = "";
    this._action = "view";
    this._error = "";
    this._result = null;
    this._open = true;
    this._generate();
  }

  public openForTask(
    entryId: string,
    taskId: string,
    objectName: string,
    taskName: string,
  ): void {
    this._entryId = entryId;
    this._taskId = taskId;
    this._objectName = objectName;
    this._taskName = taskName;
    this._action = "view";
    this._error = "";
    this._result = null;
    this._open = true;
    this._generate();
  }

  private async _generate(): Promise<void> {
    this._loading = true;
    this._error = "";
    try {
      const data: Record<string, unknown> = {
        type: "maintenance_supporter/qr/generate",
        entry_id: this._entryId,
        action: this._action,
      };
      if (this._taskId) data.task_id = this._taskId;
      const res = (await this.hass.connection.sendMessagePromise(data)) as QrResult;
      this._result = res;
    } catch {
      this._error = t("qr_error", this.lang);
    } finally {
      this._loading = false;
    }
  }

  private _onActionChange(e: Event): void {
    this._action = (e.target as HTMLSelectElement).value as "view" | "complete";
    this._generate();
  }

  private _print(): void {
    if (!this._result) return;
    const r = this._result;
    const title = r.label.task_name
      ? `${r.label.object_name} — ${r.label.task_name}`
      : r.label.object_name;
    const subtitle = [r.label.manufacturer, r.label.model]
      .filter(Boolean)
      .join(" ");
    const w = window.open("", "_blank", "width=400,height=500");
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
<title>${title}</title>
<style>
  body{font-family:sans-serif;text-align:center;padding:20px}
  h2{margin:0 0 4px}
  .sub{color:#666;font-size:14px;margin-bottom:16px}
  img{max-width:280px;width:100%}
  .url{font-size:11px;color:#999;word-break:break-all;margin-top:12px}
</style></head><body>
<h2>${title}</h2>
${subtitle ? `<div class="sub">${subtitle}</div>` : ""}
<img src="${r.svg_data_uri}" alt="QR Code" />
<div class="url">${r.url}</div>
<script>setTimeout(()=>window.print(),300)<\/script>
</body></html>`);
    w.document.close();
  }

  private _download(): void {
    if (!this._result) return;
    // Decode the data URI back to raw SVG for download
    const svgContent = decodeURIComponent(
      this._result.svg_data_uri.replace("data:image/svg+xml,", ""),
    );
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const name = this._taskName
      ? `${this._objectName}-${this._taskName}`
      : this._objectName;
    a.download = `qr-${name.replace(/\s+/g, "-").toLowerCase()}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }

  private _close(): void {
    this._open = false;
  }

  render() {
    if (!this._open) return html``;
    const L = this.lang || this.hass?.language || "de";
    const heading = this._taskName
      ? `${t("qr_code", L)}: ${this._objectName} — ${this._taskName}`
      : `${t("qr_code", L)}: ${this._objectName}`;
    return html`
      <ha-dialog open @closed=${this._close} .heading=${heading}>
        <div class="content">
          ${this._loading
            ? html`<div class="loading">${t("qr_generating", L)}</div>`
            : this._error
              ? html`<div class="error">${this._error}</div>`
              : this._result
                ? html`
                    <img
                      class="qr-image"
                      src="${this._result.svg_data_uri}"
                      alt="QR Code"
                    />
                    <div class="url-display">${this._result.url}</div>
                  `
                : nothing}
          ${this._taskId
            ? html`
                <div class="action-row">
                  <label>${t("qr_action", L)}</label>
                  <select @change=${this._onActionChange} .value=${this._action}>
                    <option value="view">${t("qr_action_view", L)}</option>
                    <option value="complete">${t("qr_action_complete", L)}</option>
                  </select>
                </div>
              `
            : nothing}
        </div>
        <ha-button slot="secondaryAction" appearance="plain" @click=${this._close}>
          ${t("cancel", L)}
        </ha-button>
        <ha-button
          slot="primaryAction"
          @click=${this._download}
          .disabled=${!this._result}
        >
          ${t("qr_download", L)}
        </ha-button>
        <ha-button
          slot="primaryAction"
          @click=${this._print}
          .disabled=${!this._result}
        >
          ${t("qr_print", L)}
        </ha-button>
      </ha-dialog>
    `;
  }

  static styles = css`
    .content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      min-width: 300px;
    }
    .qr-image {
      width: 240px;
      height: 240px;
      image-rendering: pixelated;
    }
    .url-display {
      font-size: 11px;
      color: var(--secondary-text-color);
      word-break: break-all;
      text-align: center;
      max-width: 280px;
    }
    .loading {
      padding: 40px 0;
      color: var(--secondary-text-color);
    }
    .error {
      padding: 20px 0;
      color: var(--error-color, #f44336);
    }
    .action-row {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
    }
    .action-row label {
      font-size: 13px;
      color: var(--secondary-text-color);
      white-space: nowrap;
    }
    .action-row select {
      flex: 1;
      padding: 6px 8px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font-size: 13px;
    }
  `;
}

