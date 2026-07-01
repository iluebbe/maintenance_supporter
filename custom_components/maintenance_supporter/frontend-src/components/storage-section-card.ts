/** Document-storage overview card (panel overview).
 *
 * Shows the physical footprint (real backup cost), the dedup saving, and a
 * per-object drill-down sorted by size. Object ids from the WS summary are
 * mapped to names via the panel's already-loaded objects. Self-hides when no
 * documents exist, so it never clutters the overview for non-users.
 */

import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { t } from "../styles";
import { describeWsError } from "../ws-errors";
import { formatBytes } from "../helpers/format-bytes";
import type { HomeAssistant } from "../types";

interface StorageSummary {
  total_bytes: number;
  dedup_savings_bytes: number;
  file_count: number;
  link_count: number;
  document_count: number;
  by_object: Record<string, { bytes: number; files: number; links: number }>;
}

interface PanelObject {
  entry_id: string;
  object?: { id?: string; name?: string };
}

export class MaintenanceStorageSectionCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public objects: PanelObject[] = [];

  @state() private _summary: StorageSummary | null = null;
  @state() private _loaded = false;
  @state() private _busy = false;
  @state() private _error = "";

  private _initiallyLoaded = false;

  private get _lang(): string {
    return this.hass?.language || "en";
  }

  updated(changed: Map<string, unknown>): void {
    super.updated(changed);
    if (changed.has("hass") && this.hass && !this._initiallyLoaded) {
      this._initiallyLoaded = true;
      void this._load();
    }
  }

  private async _load(): Promise<void> {
    this._busy = true;
    try {
      this._summary = await this.hass.connection.sendMessagePromise<StorageSummary>({
        type: "maintenance_supporter/documents/storage",
      });
      this._error = "";
    } catch (e) {
      this._error = describeWsError(e, this._lang);
    } finally {
      this._loaded = true;
      this._busy = false;
    }
  }

  private _nameFor(objectId: string): string {
    const o = this.objects.find((x) => x.object?.id === objectId);
    return o?.object?.name || objectId.slice(0, 8);
  }

  render() {
    if (!this._loaded || !this._summary) return nothing;
    const s = this._summary;
    if (s.document_count === 0) return nothing; // self-hide when unused
    const L = this._lang;

    const rows = Object.entries(s.by_object)
      .filter(([, v]) => v.files > 0 || v.links > 0)
      .map(([id, v]) => ({ id, name: this._nameFor(id), ...v }))
      .sort((a, b) => b.bytes - a.bytes);

    return html`
      <ha-card>
        <div class="card-content">
          <div class="header">
            <div class="title">
              <span class="emoji">🗄️</span>
              <span>${t("doc_storage_title", L)}</span>
            </div>
            <button
              class="icon-btn"
              title=${t("doc_storage_refresh", L)}
              ?disabled=${this._busy}
              @click=${this._load}
            >
              <ha-icon icon="mdi:refresh"></ha-icon>
            </button>
          </div>

          <div class="totals">
            <div class="stat">
              <div class="stat-value">${formatBytes(s.total_bytes)}</div>
              <div class="stat-label">
                <ha-icon icon="mdi:file-document-outline"></ha-icon> ${s.file_count}
                <ha-icon icon="mdi:link-variant"></ha-icon> ${s.link_count}
              </div>
            </div>
            ${s.dedup_savings_bytes > 0
              ? html`<div class="stat">
                  <div class="stat-value saved">−${formatBytes(s.dedup_savings_bytes)}</div>
                  <div class="stat-label">${t("doc_storage_saved", L)}</div>
                </div>`
              : nothing}
          </div>

          ${this._error ? html`<div class="error">${this._error}</div>` : nothing}

          ${rows.length
            ? html`<div class="obj-list">
                ${rows.map(
                  (r) => html`
                    <div class="obj-row">
                      <span class="obj-name">${r.name}</span>
                      <span class="obj-meta">
                        ${r.files > 0
                          ? html`<ha-icon icon="mdi:file-document-outline"></ha-icon>${r.files}`
                          : nothing}
                        ${r.links > 0
                          ? html`<ha-icon icon="mdi:link-variant"></ha-icon>${r.links}`
                          : nothing}
                      </span>
                      <span class="obj-size">${formatBytes(r.bytes)}</span>
                    </div>
                  `,
                )}
              </div>`
            : nothing}
        </div>
      </ha-card>
    `;
  }

  static styles = css`
    ha-card { margin-top: 16px; }
    .card-content { padding: 16px; }
    .header { display: flex; align-items: center; justify-content: space-between; }
    .title { display: flex; align-items: center; gap: 8px; font-size: 16px; font-weight: 500; }
    .emoji { font-size: 18px; }
    .totals { display: flex; gap: 24px; margin: 12px 0 8px; flex-wrap: wrap; }
    .stat-value { font-size: 22px; font-weight: 600; }
    .stat-value.saved { color: var(--success-color, #4caf50); }
    .stat-label {
      font-size: 12px; color: var(--secondary-text-color, #888);
      display: flex; align-items: center; gap: 4px;
    }
    .stat-label ha-icon { --mdc-icon-size: 15px; }
    .obj-list { display: flex; flex-direction: column; gap: 2px; margin-top: 8px; }
    .obj-row {
      display: flex; align-items: center; gap: 10px;
      padding: 6px 8px; border-radius: 6px;
    }
    .obj-row:nth-child(odd) { background: var(--secondary-background-color, rgba(0,0,0,0.04)); }
    .obj-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 14px; }
    .obj-meta {
      display: flex; align-items: center; gap: 4px;
      color: var(--secondary-text-color, #888); font-size: 13px;
    }
    .obj-meta ha-icon { --mdc-icon-size: 15px; }
    .obj-size { font-variant-numeric: tabular-nums; font-size: 13px; min-width: 64px; text-align: right; }
    .icon-btn {
      display: inline-flex; align-items: center; justify-content: center;
      width: 32px; height: 32px; border-radius: 8px; cursor: pointer;
      background: transparent; border: none; color: var(--primary-text-color);
    }
    .icon-btn:hover { background: var(--secondary-background-color, rgba(0,0,0,0.06)); }
    .icon-btn[disabled] { opacity: 0.4; pointer-events: none; }
    .error { color: var(--error-color, #f44336); font-size: 13px; margin-top: 6px; }
  `;
}

if (!customElements.get("maintenance-storage-section-card")) {
  customElements.define("maintenance-storage-section-card", MaintenanceStorageSectionCard);
}
