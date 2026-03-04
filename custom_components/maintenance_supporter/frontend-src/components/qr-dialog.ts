/** Dialog for generating, printing, and downloading QR codes. */

import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
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

/** Escape HTML entities to prevent XSS in document.write contexts. */
function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Sanitize a string for use in a filename (remove OS-invalid chars). */
function sanitizeFilename(s: string): string {
  return s.replace(/[/\\:*?"<>|#%]+/g, "").replace(/\s+/g, "-").toLowerCase().substring(0, 100);
}

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
  private _generateSeq = 0;

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
    const seq = ++this._generateSeq;
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
      if (seq !== this._generateSeq) return; // stale response from previous request
      this._result = res;
    } catch (err: unknown) {
      if (seq !== this._generateSeq) return;
      // HA WS rejects with {code, message} plain object, not Error
      const code = (err as Record<string, unknown>)?.code;
      const msg = (err as Record<string, unknown>)?.message;
      this._error = code === "no_url" || (typeof msg === "string" && msg.includes("No Home Assistant URL"))
        ? t("qr_error_no_url", this.lang)
        : t("qr_error", this.lang);
    } finally {
      if (seq === this._generateSeq) this._loading = false;
    }
  }

  private _setAction(action: "view" | "complete"): void {
    if (this._action === action) return;
    this._action = action;
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
    const safeTitle = escapeHtml(title);
    const safeSub = escapeHtml(subtitle);
    const safeUrl = escapeHtml(r.url);
    w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
<title>${safeTitle}</title>
<style>
  body{font-family:sans-serif;text-align:center;padding:20px}
  h2{margin:0 0 4px}
  .sub{color:#666;font-size:14px;margin-bottom:16px}
  img{max-width:280px;width:100%}
  .url{font-size:11px;color:#999;word-break:break-all;margin-top:12px}
</style></head><body>
<h2>${safeTitle}</h2>
${safeSub ? `<div class="sub">${safeSub}</div>` : ""}
<img src="${r.svg_data_uri}" alt="QR Code" />
<div class="url">${safeUrl}</div>
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
    a.download = `qr-${sanitizeFilename(name)}.svg`;
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
                  <div class="action-toggle">
                    <button class="toggle-btn ${this._action === "view" ? "active" : ""}"
                      @click=${() => this._setAction("view")}>${t("qr_action_view", L)}</button>
                    <button class="toggle-btn ${this._action === "complete" ? "active" : ""}"
                      @click=${() => this._setAction("complete")}>${t("qr_action_complete", L)}</button>
                  </div>
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
      flex-direction: column;
      gap: 6px;
      width: 100%;
    }
    .action-row label {
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .action-toggle {
      display: flex;
      gap: 4px;
      background: var(--divider-color, #e0e0e0);
      border-radius: 6px;
      padding: 3px;
    }
    .toggle-btn {
      flex: 1;
      padding: 8px 12px;
      border: none;
      background: transparent;
      color: var(--primary-text-color);
      cursor: pointer;
      border-radius: 4px;
      font-size: 13px;
      transition: all 0.2s;
      line-height: 1.3;
    }
    .toggle-btn:hover {
      background: rgba(0, 0, 0, 0.05);
    }
    .toggle-btn.active {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
    }
  `;
}

if (!customElements.get("maintenance-qr-dialog")) {
  customElements.define("maintenance-qr-dialog", MaintenanceQrDialog);
}
