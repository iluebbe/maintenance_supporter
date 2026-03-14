/** Dialog for generating, printing, and downloading QR codes.
 *
 * For tasks: shows two QR codes side-by-side — "Info" (ℹ) and "Complete" (✓)
 * with embedded icons. For objects: shows a single "Info" QR.
 */

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

/** Sanitize a data URI for safe use in an img src attribute. */
function sanitizeDataUri(uri: string): string {
  if (!uri.startsWith("data:image/svg+xml,") && !uri.startsWith("data:image/png;base64,")) {
    return "";
  }
  return escapeHtml(uri);
}

/** Sanitize a string for use in a filename (remove OS-invalid chars). */
function sanitizeFilename(s: string): string {
  return s.replace(/[/\\:*?"<>|#%]+/g, "").replace(/\s+/g, "-").toLowerCase().substring(0, 100);
}

export class MaintenanceQrDialog extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property() public lang = "en";

  @state() private _open = false;
  @state() private _loading = false;
  @state() private _error = "";
  @state() private _viewResult: QrResult | null = null;
  @state() private _completeResult: QrResult | null = null;
  @state() private _urlMode: "companion" | "local" | "server" = "companion";

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
    this._urlMode = "companion";
    this._error = "";
    this._viewResult = null;
    this._completeResult = null;
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
    this._urlMode = "companion";
    this._error = "";
    this._viewResult = null;
    this._completeResult = null;
    this._open = true;
    this._generate();
  }

  private async _generate(): Promise<void> {
    const seq = ++this._generateSeq;
    this._loading = true;
    this._error = "";
    this._viewResult = null;
    this._completeResult = null;
    try {
      const base: Record<string, unknown> = {
        type: "maintenance_supporter/qr/generate",
        entry_id: this._entryId,
        url_mode: this._urlMode,
      };
      if (this._taskId) base.task_id = this._taskId;

      // Always request "view" QR; also request "complete" if this is a task
      const promises: Promise<unknown>[] = [
        this.hass.connection.sendMessagePromise({ ...base, action: "view" }),
      ];
      if (this._taskId) {
        promises.push(
          this.hass.connection.sendMessagePromise({ ...base, action: "complete" }),
        );
      }

      const results = await Promise.all(promises);
      if (seq !== this._generateSeq) return;

      this._viewResult = results[0] as QrResult;
      if (results.length > 1) {
        this._completeResult = results[1] as QrResult;
      }
    } catch (err: unknown) {
      if (seq !== this._generateSeq) return;
      const code = (err as Record<string, unknown>)?.code;
      const msg = (err as Record<string, unknown>)?.message;
      this._error = code === "no_url" || (typeof msg === "string" && msg.includes("No Home Assistant URL"))
        ? t("qr_error_no_url", this.lang)
        : t("qr_error", this.lang);
    } finally {
      if (seq === this._generateSeq) this._loading = false;
    }
  }

  private _setUrlMode(mode: "companion" | "local" | "server"): void {
    if (this._urlMode === mode) return;
    this._urlMode = mode;
    this._generate();
  }

  private _print(): void {
    if (!this._viewResult) return;
    const r = this._viewResult;
    const title = r.label.task_name
      ? `${r.label.object_name} — ${r.label.task_name}`
      : r.label.object_name;
    const subtitle = [r.label.manufacturer, r.label.model]
      .filter(Boolean)
      .join(" ");
    const w = window.open("", "_blank", "width=600,height=500");
    if (!w) return;
    const L = this.lang || "en";
    const safeTitle = escapeHtml(title);
    const safeSub = escapeHtml(subtitle);

    const hasComplete = !!this._completeResult;
    const viewLabel = escapeHtml(t("qr_action_view", L));
    const completeLabel = escapeHtml(t("qr_action_complete", L));

    w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
<title>${safeTitle}</title>
<style>
  body{font-family:sans-serif;text-align:center;padding:20px}
  h2{margin:0 0 4px}
  .sub{color:#666;font-size:14px;margin-bottom:16px}
  .qr-row{display:flex;justify-content:center;gap:24px;margin:12px 0}
  .qr-col{display:flex;flex-direction:column;align-items:center;gap:6px}
  .qr-col img{width:${hasComplete ? "200px" : "280px"}}
  .qr-label{font-size:13px;font-weight:500;color:#333}
  .url{font-size:10px;color:#999;word-break:break-all;margin-top:8px;max-width:480px}
</style></head><body>
<h2>${safeTitle}</h2>
${safeSub ? `<div class="sub">${safeSub}</div>` : ""}
<div class="qr-row">
  <div class="qr-col">
    <img src="${sanitizeDataUri(this._viewResult.svg_data_uri)}" alt="QR Info" />
    <div class="qr-label">${viewLabel}</div>
  </div>
  ${hasComplete ? `<div class="qr-col">
    <img src="${sanitizeDataUri(this._completeResult!.svg_data_uri)}" alt="QR Complete" />
    <div class="qr-label">${completeLabel}</div>
  </div>` : ""}
</div>
<div class="url">${escapeHtml(this._viewResult.url)}</div>
<script>setTimeout(()=>window.print(),300)<\/script>
</body></html>`);
    w.document.close();
  }

  private _downloadSvg(result: QrResult, suffix: string): void {
    const svgContent = decodeURIComponent(
      result.svg_data_uri.replace("data:image/svg+xml,", ""),
    );
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const name = this._taskName
      ? `${this._objectName}-${this._taskName}`
      : this._objectName;
    a.download = `qr-${sanitizeFilename(name)}-${suffix}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }

  private _close(): void {
    this._open = false;
    this._viewResult = null;
    this._completeResult = null;
    this._error = "";
    this._loading = false;
  }

  render() {
    if (!this._open) return html``;
    const L = this.lang || this.hass?.language || "en";
    const heading = this._taskName
      ? `${t("qr_code", L)}: ${this._objectName} — ${this._taskName}`
      : `${t("qr_code", L)}: ${this._objectName}`;
    const hasResults = !!this._viewResult;
    return html`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${heading}</div>
        <div class="content">
          ${this._loading
            ? html`<div class="loading">${t("qr_generating", L)}</div>`
            : this._error
              ? html`<div class="error">${this._error}</div>`
              : hasResults
                ? html`
                    <div class="qr-pair">
                      <div class="qr-item">
                        <img
                          class="qr-image ${this._completeResult ? "small" : ""}"
                          src="${this._viewResult!.svg_data_uri}"
                          alt="QR Info"
                        />
                        <div class="qr-item-label">${t("qr_action_view", L)}</div>
                        <button class="dl-btn"
                          @click=${() => this._downloadSvg(this._viewResult!, "info")}>
                          <ha-icon icon="mdi:download"></ha-icon>
                          ${t("qr_download", L)}
                        </button>
                      </div>
                      ${this._completeResult
                        ? html`
                            <div class="qr-item">
                              <img
                                class="qr-image small"
                                src="${this._completeResult.svg_data_uri}"
                                alt="QR Complete"
                              />
                              <div class="qr-item-label">${t("qr_action_complete", L)}</div>
                              <button class="dl-btn"
                                @click=${() => this._downloadSvg(this._completeResult!, "complete")}>
                                <ha-icon icon="mdi:download"></ha-icon>
                                ${t("qr_download", L)}
                              </button>
                            </div>
                          `
                        : nothing}
                    </div>
                    <div class="url-display">${this._viewResult!.url}</div>
                  `
                : nothing}
          <div class="action-row">
            <label>${t("qr_url_mode", L)}</label>
            <div class="action-toggle">
              <button class="toggle-btn ${this._urlMode === "companion" ? "active" : ""}"
                @click=${() => this._setUrlMode("companion")}>${t("qr_mode_companion", L)}</button>
              <button class="toggle-btn ${this._urlMode === "local" ? "active" : ""}"
                @click=${() => this._setUrlMode("local")}>${t("qr_mode_local", L)}</button>
              <button class="toggle-btn ${this._urlMode === "server" ? "active" : ""}"
                @click=${() => this._setUrlMode("server")}>${t("qr_mode_server", L)}</button>
            </div>
          </div>
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${t("cancel", L)}
          </ha-button>
          <ha-button
            @click=${this._print}
            .disabled=${!hasResults}
          >
            ${t("qr_print", L)}
          </ha-button>
        </div>
      </ha-dialog>
    `;
  }

  static styles = css`
    .dialog-title {
      font-size: 18px;
      font-weight: 500;
      padding-bottom: 12px;
    }
    .content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      min-width: 300px;
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding-top: 16px;
    }
    .qr-pair {
      display: flex;
      gap: 20px;
      justify-content: center;
      width: 100%;
    }
    .qr-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }
    .qr-image {
      width: 240px;
      height: 240px;
      image-rendering: pixelated;
    }
    .qr-image.small {
      width: 180px;
      height: 180px;
    }
    .qr-item-label {
      font-size: 12px;
      font-weight: 500;
      color: var(--secondary-text-color);
      text-align: center;
    }
    .dl-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: none;
      border: 1px solid var(--divider-color, #e0e0e0);
      cursor: pointer;
      font-size: 13px;
      color: var(--primary-text-color);
      padding: 6px 14px;
      border-radius: 18px;
      transition: background 0.2s, border-color 0.2s;
    }
    .dl-btn:hover {
      background: var(--secondary-background-color, #f5f5f5);
      border-color: var(--primary-color);
    }
    .dl-btn ha-icon {
      --mdc-icon-size: 18px;
    }
    .url-display {
      font-size: 11px;
      color: var(--secondary-text-color);
      word-break: break-all;
      text-align: center;
      max-width: 400px;
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
