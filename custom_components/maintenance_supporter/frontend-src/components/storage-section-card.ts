/** Document-storage overview card (panel overview).
 *
 * Shows the physical footprint (real backup cost), the dedup saving, and a
 * per-object drill-down sorted by size. Object ids from the WS summary are
 * mapped to names via the panel's already-loaded objects. Self-hides when no
 * documents exist, so it never clutters the overview for non-users.
 */

import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { t, ensureLocale } from "../styles";
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

interface SearchResult {
  id: string;
  entry_id: string;
  object_name: string;
  kind: "file" | "weblink";
  title: string;
  filename?: string;
  url?: string;
  size?: number;
  tags?: string[];
}

export class MaintenanceStorageSectionCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public objects: PanelObject[] = [];

  @state() private _summary: StorageSummary | null = null;
  @state() private _loaded = false;
  @state() private _busy = false;
  @state() private _error = "";
  @state() private _query = "";
  @state() private _results: SearchResult[] = [];
  @state() private _expanded = false;

  private _initiallyLoaded = false;
  private _searchTimer = 0;

  private get _lang(): string {
    return this.hass?.language || "en";
  }

  updated(changed: Map<string, unknown>): void {
    super.updated(changed);
    if (changed.has("hass") && this.hass && !this._initiallyLoaded) {
      this._initiallyLoaded = true;
      void this._load();
      // Re-render once the runtime locale JSON arrives (t() falls back to
      // English until then; this card can paint before the panel's fetch lands).
      void ensureLocale(this._lang).then(() => this.requestUpdate());
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

  private _entryFor(objectId: string): string | undefined {
    return this.objects.find((x) => x.object?.id === objectId)?.entry_id;
  }

  private _toggle(): void {
    this._expanded = !this._expanded;
  }

  /** Ask the panel (which owns navigation) to open an object's detail view. */
  private _openObject(entryId: string): void {
    this.dispatchEvent(
      new CustomEvent("open-object", {
        detail: { entry_id: entryId },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _onSearch(e: Event): void {
    this._query = (e.target as HTMLInputElement).value;
    clearTimeout(this._searchTimer);
    this._searchTimer = window.setTimeout(() => void this._doSearch(), 250);
  }

  private async _doSearch(): Promise<void> {
    const q = this._query.trim();
    if (!q) {
      this._results = [];
      return;
    }
    try {
      const r = await this.hass.connection.sendMessagePromise<{ results: SearchResult[] }>({
        type: "maintenance_supporter/documents/search",
        query: q,
      });
      this._results = r.results || [];
    } catch (e) {
      this._error = describeWsError(e, this._lang);
      this._results = [];
    }
  }

  private async _openResult(doc: SearchResult): Promise<void> {
    if (doc.kind === "weblink") {
      window.open(doc.url, "_blank", "noopener");
      return;
    }
    const win = window.open("about:blank", "_blank");
    try {
      const s = await this.hass.connection.sendMessagePromise<{ path: string }>({
        type: "auth/sign_path",
        path: `/api/maintenance_supporter/document/${doc.id}`,
        expires: 300,
      });
      // Absolute URL so it navigates the blank popup reliably (about:blank base).
      if (win) win.location.href = new URL(s.path, window.location.origin).href;
    } catch (e) {
      if (win) win.close();
      this._error = describeWsError(e, this._lang);
    }
  }

  private _renderResult(doc: SearchResult, L: string) {
    return html`
      <div class="obj-row result-row" title=${t("doc_open", L)} @click=${() => this._openResult(doc)}>
        <ha-icon icon=${doc.kind === "weblink" ? "mdi:link-variant" : "mdi:file-document-outline"}></ha-icon>
        <div class="result-info">
          <div class="result-title">${doc.title || doc.filename || doc.url}</div>
          <div class="result-obj">${doc.object_name}</div>
        </div>
        <ha-icon class="result-open" icon=${doc.kind === "weblink" ? "mdi:open-in-new" : "mdi:eye-outline"}></ha-icon>
      </div>
    `;
  }

  render() {
    if (!this._loaded || !this._summary) return nothing;
    const s = this._summary;
    if (s.document_count === 0) return nothing; // self-hide when unused
    const L = this._lang;

    const rows = Object.entries(s.by_object)
      .filter(([, v]) => v.files > 0 || v.links > 0)
      .map(([id, v]) => ({ id, name: this._nameFor(id), entry: this._entryFor(id), ...v }))
      .sort((a, b) => b.bytes - a.bytes);

    return html`
      <ha-card>
        <div class="card-content">
          <div class="header">
            <button
              class="toggle"
              @click=${this._toggle}
              aria-expanded=${this._expanded ? "true" : "false"}
              aria-label=${t("doc_storage_title", L)}
            >
              <ha-icon class="chevron" icon=${this._expanded ? "mdi:chevron-down" : "mdi:chevron-right"}></ha-icon>
              <span class="emoji">🗄️</span>
              <span class="title-text">${t("doc_storage_title", L)}</span>
              <span class="header-summary">
                ${formatBytes(s.total_bytes)}
                ${s.dedup_savings_bytes > 0 ? html`<span class="saved">−${formatBytes(s.dedup_savings_bytes)}</span>` : nothing}
              </span>
            </button>
            <button
              class="icon-btn"
              title=${t("doc_storage_refresh", L)}
              ?disabled=${this._busy}
              @click=${this._load}
            >
              <ha-icon icon="mdi:refresh"></ha-icon>
            </button>
          </div>

          ${this._expanded
            ? html`
                <div class="body">
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

                  <div class="doc-search">
                    <ha-icon icon="mdi:magnify"></ha-icon>
                    <input
                      type="search"
                      aria-label=${t("doc_search", L)}
                      placeholder=${t("doc_search", L)}
                      .value=${this._query}
                      @input=${this._onSearch}
                    />
                  </div>

                  ${this._error ? html`<div class="error">${this._error}</div>` : nothing}

                  ${this._query.trim()
                    ? this._results.length
                      ? html`<div class="obj-list">${this._results.map((d) => this._renderResult(d, L))}</div>`
                      : html`<div class="search-empty">${t("doc_search_none", L)}</div>`
                    : rows.length
                      ? html`<div class="obj-list">${rows.map((r) => this._renderObjRow(r, L))}</div>`
                      : nothing}
                </div>
              `
            : nothing}
        </div>
      </ha-card>
    `;
  }

  private _renderObjRow(
    r: { id: string; name: string; entry?: string; bytes: number; files: number; links: number },
    L: string,
  ) {
    const eid = r.entry;
    return html`
      <div
        class="obj-row ${eid ? "clickable" : ""}"
        role=${eid ? "button" : nothing}
        tabindex=${eid ? "0" : nothing}
        aria-label=${eid ? r.name : nothing}
        @click=${eid ? () => this._openObject(eid) : undefined}
        @keydown=${eid
          ? (e: KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                this._openObject(eid);
              }
            }
          : undefined}
      >
        <span class="obj-name">${r.name}</span>
        <span class="obj-meta">
          ${r.files > 0 ? html`<ha-icon icon="mdi:file-document-outline"></ha-icon>${r.files}` : nothing}
          ${r.links > 0 ? html`<ha-icon icon="mdi:link-variant"></ha-icon>${r.links}` : nothing}
        </span>
        <span class="obj-size">${formatBytes(r.bytes)}</span>
        ${eid ? html`<ha-icon class="obj-go" icon="mdi:chevron-right"></ha-icon>` : nothing}
      </div>
    `;
  }

  static styles = css`
    ha-card { margin-top: 16px; }
    .card-content { padding: 16px; }
    .doc-search {
      display: flex; align-items: center; gap: 6px; margin: 10px 0 4px;
      padding: 2px 10px; border-radius: 8px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.06));
      border: 1px solid var(--divider-color);
    }
    .doc-search ha-icon { --mdc-icon-size: 18px; color: var(--secondary-text-color, #888); }
    .doc-search input {
      flex: 1; border: none; background: transparent; font: inherit; outline: none;
      color: var(--primary-text-color); padding: 6px 0;
    }
    .result-row { cursor: pointer; }
    .result-row > ha-icon { color: var(--primary-color); --mdc-icon-size: 20px; flex: none; }
    .result-info { flex: 1; min-width: 0; }
    .result-title { font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .result-obj { font-size: 12px; color: var(--secondary-text-color, #888); }
    .result-open { color: var(--secondary-text-color, #888); --mdc-icon-size: 18px; flex: none; }
    .search-empty { color: var(--secondary-text-color, #888); font-size: 13px; padding: 8px 2px; }
    .header { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
    .toggle {
      display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0;
      background: none; border: none; padding: 4px 0; margin: 0; cursor: pointer;
      font: inherit; color: var(--primary-text-color); text-align: left;
    }
    .toggle:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; border-radius: 6px; }
    .chevron { --mdc-icon-size: 22px; color: var(--secondary-text-color, #888); flex: none; }
    .title-text { font-size: 16px; font-weight: 500; }
    .header-summary {
      margin-left: auto; display: flex; align-items: center; gap: 8px;
      font-size: 14px; font-weight: 600; white-space: nowrap;
    }
    .header-summary .saved { color: var(--success-color, #4caf50); font-weight: 500; }
    .emoji { font-size: 18px; }
    .body { margin-top: 4px; }
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
    .obj-row.clickable { cursor: pointer; }
    .obj-row.clickable:hover { background: var(--secondary-background-color, rgba(0,0,0,0.10)); }
    .obj-row.clickable:focus-visible { outline: 2px solid var(--primary-color); outline-offset: -2px; }
    .obj-go { --mdc-icon-size: 18px; color: var(--secondary-text-color, #888); flex: none; }
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
