/** Documents linked to a maintenance task.
 *
 * A filtered view over the object's document pool via each doc's `task_ids`:
 * link/unlink existing object documents to the task and open/download them. Full
 * upload + management lives at the object level (documents-section); this keeps
 * the manual / spare-parts list right where the maintenance work happens. Hides
 * itself entirely when the object has no documents at all.
 */

import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { t, ensureLocale } from "../styles";
import { describeWsError } from "../ws-errors";
import { downloadUrl } from "../helpers/download";
import { formatBytes } from "../helpers/format-bytes";
import type { HomeAssistant } from "../types";

interface Doc {
  id: string;
  kind: "file" | "weblink";
  title: string;
  filename?: string;
  url?: string;
  mime?: string;
  size?: number;
  tags?: string[];
  task_ids?: string[];
  task_pages?: Record<string, number>;
}

const CATEGORIES = ["manual", "warranty", "invoice", "spare_parts", "photo", "other"] as const;
const CATEGORY_ICONS: Record<string, string> = {
  manual: "mdi:book-open-variant",
  warranty: "mdi:shield-check",
  invoice: "mdi:receipt-text-outline",
  spare_parts: "mdi:cog-outline",
  photo: "mdi:image-outline",
  other: "mdi:file-document-outline",
};

export class MaintenanceTaskDocuments extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public entryId!: string;
  @property({ attribute: false }) public taskId!: string;
  @property({ type: Boolean }) public canWrite = false;

  @state() private _docs: Doc[] = [];
  @state() private _loaded = false;
  @state() private _busy = false;
  @state() private _error = "";
  @state() private _attachId = "";

  private _loadedKey = "";
  private _localeReady = false;

  private get _lang(): string {
    return this.hass?.language || "en";
  }

  updated(changed: Map<string, unknown>): void {
    super.updated(changed);
    if (this.hass && !this._localeReady) {
      this._localeReady = true;
      void ensureLocale(this._lang).then(() => this.requestUpdate());
    }
    const key = `${this.entryId}|${this.taskId}`;
    if (this.hass && this.entryId && this.taskId && this._loadedKey !== key) {
      this._loadedKey = key;
      void this._load();
    }
  }

  private async _load(): Promise<void> {
    try {
      const r = await this.hass.connection.sendMessagePromise<{ documents: Doc[] }>({
        type: "maintenance_supporter/documents/list",
        entry_id: this.entryId,
      });
      this._docs = r.documents || [];
      this._loaded = true;
      this._error = "";
    } catch (e) {
      this._error = describeWsError(e, this._lang);
      this._loaded = true;
    }
  }

  private _linked(): Doc[] {
    return this._docs.filter((d) => (d.task_ids || []).includes(this.taskId));
  }

  private _available(): Doc[] {
    return this._docs.filter((d) => !(d.task_ids || []).includes(this.taskId));
  }

  private async _setTaskIds(doc: Doc, taskIds: string[]): Promise<void> {
    this._busy = true;
    this._error = "";
    try {
      await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/documents/update",
        doc_id: doc.id,
        task_ids: taskIds,
      });
      await this._load();
    } catch (e) {
      this._error = describeWsError(e, this._lang);
    } finally {
      this._busy = false;
    }
  }

  private _link(): void {
    const doc = this._docs.find((d) => d.id === this._attachId);
    if (!doc) return;
    this._attachId = "";
    void this._setTaskIds(doc, [...(doc.task_ids || []), this.taskId]);
  }

  private _unlink(doc: Doc): void {
    void this._setTaskIds(doc, (doc.task_ids || []).filter((x) => x !== this.taskId));
  }

  private _isPdf(doc: Doc): boolean {
    return doc.mime === "application/pdf" || (doc.filename || "").toLowerCase().endsWith(".pdf");
  }

  /** The page this doc should open at for the current task, if set (PDFs only). */
  private _pageFor(doc: Doc): number | undefined {
    return this._isPdf(doc) ? doc.task_pages?.[this.taskId] : undefined;
  }

  private async _open(doc: Doc): Promise<void> {
    if (doc.kind === "weblink") {
      window.open(doc.url, "_blank", "noopener");
      return;
    }
    // A per-task page hint jumps straight to the relevant page via the PDF
    // viewer's #page=N fragment (client-side, so it never breaks the signature).
    const page = this._pageFor(doc);
    const frag = page ? `#page=${page}` : "";
    const win = window.open("about:blank", "_blank");
    try {
      const s = await this.hass.connection.sendMessagePromise<{ path: string }>({
        type: "auth/sign_path",
        path: `/api/maintenance_supporter/document/${doc.id}`,
        expires: 300,
      });
      // Absolute URL: a fragment on a *root-relative* path won't resolve against
      // the blank popup's about:blank base, so it would silently stay blank.
      if (win) win.location.href = new URL(s.path + frag, window.location.origin).href;
    } catch (e) {
      if (win) win.close();
      this._error = describeWsError(e, this._lang);
    }
  }

  /** Set (page >= 1) or clear (0) the jump-to page for this doc's task link. */
  private async _setPage(doc: Doc, page: number): Promise<void> {
    this._busy = true;
    this._error = "";
    try {
      await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/documents/update",
        doc_id: doc.id,
        task_pages: { [this.taskId]: page },
      });
      await this._load();
    } catch (e) {
      this._error = describeWsError(e, this._lang);
    } finally {
      this._busy = false;
    }
  }

  private async _download(doc: Doc): Promise<void> {
    try {
      const s = await this.hass.connection.sendMessagePromise<{ path: string }>({
        type: "auth/sign_path",
        path: `/api/maintenance_supporter/document/${doc.id}`,
        expires: 30,
      });
      downloadUrl(s.path, doc.filename || doc.title || "document");
    } catch (e) {
      this._error = describeWsError(e, this._lang);
    }
  }

  render() {
    // Hide entirely for objects with no documents — no clutter on every task.
    if (!this._loaded || this._docs.length === 0) return nothing;
    const L = this._lang;
    const linked = this._linked();
    const available = this._available();
    return html`
      <div class="task-docs">
        <h3><ha-icon icon="mdi:paperclip"></ha-icon> ${t("documents", L)} (${linked.length})</h3>
        ${this._error ? html`<div class="tdoc-error">${this._error}</div>` : nothing}
        ${linked.length === 0
          ? html`<div class="tdoc-empty">${t("doc_task_none", L)}</div>`
          : html`<div class="tdoc-list">${linked.map((d) => this._renderRow(d, L))}</div>`}
        ${this.canWrite && available.length
          ? html`<div class="tdoc-attach">
              <select
                class="tdoc-select"
                ?disabled=${this._busy}
                @change=${(e: Event) => (this._attachId = (e.target as HTMLSelectElement).value)}
              >
                <option value="" ?selected=${!this._attachId}>${t("doc_link_existing", L)}</option>
                ${available.map(
                  (d) => html`<option value=${d.id} ?selected=${d.id === this._attachId}>${d.title || d.filename || d.url}</option>`,
                )}
              </select>
              <button class="tdoc-btn" ?disabled=${this._busy || !this._attachId} @click=${this._link}>
                <ha-icon icon="mdi:link-variant-plus"></ha-icon> ${t("doc_attach", L)}
              </button>
            </div>`
          : nothing}
      </div>
    `;
  }

  private _renderRow(doc: Doc, L: string) {
    const isFile = doc.kind === "file";
    const isPdf = this._isPdf(doc);
    const page = doc.task_pages?.[this.taskId];
    const cat = (doc.tags || []).find((x) => (CATEGORIES as readonly string[]).includes(x)) || "other";
    const meta = isFile ? formatBytes(doc.size) : t("doc_link_badge", L);
    return html`
      <div class="tdoc-row">
        <ha-icon class="tdoc-icon" icon=${isFile ? CATEGORY_ICONS[cat] : "mdi:link-variant"}></ha-icon>
        <div
          class="tdoc-info"
          role="button"
          tabindex="0"
          title=${page ? `${t("doc_open", L)} · ${t("doc_page", L)} ${page}` : t("doc_open", L)}
          @click=${() => this._open(doc)}
          @keydown=${(e: KeyboardEvent) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              void this._open(doc);
            }
          }}
        >
          <div class="tdoc-title">${doc.title || doc.filename || doc.url}</div>
          <div class="tdoc-meta">
            ${meta}${page ? html` · <span class="tdoc-pagetag">${t("doc_page", L)} ${page}</span>` : nothing}
          </div>
        </div>
        ${this.canWrite && isPdf
          ? html`<input
              class="tdoc-page"
              type="number"
              min="1"
              inputmode="numeric"
              aria-label=${t("doc_page", L)}
              title=${t("doc_page", L)}
              placeholder=${t("doc_page", L)}
              .value=${page ? String(page) : ""}
              ?disabled=${this._busy}
              @change=${(e: Event) => {
                const v = parseInt((e.target as HTMLInputElement).value, 10);
                void this._setPage(doc, Number.isFinite(v) && v >= 1 ? v : 0);
              }}
            />`
          : nothing}
        <button class="icon-btn" title=${t("doc_open", L)} @click=${() => this._open(doc)}>
          <ha-icon icon=${isFile ? "mdi:eye-outline" : "mdi:open-in-new"}></ha-icon>
        </button>
        ${isFile
          ? html`<button class="icon-btn" title=${t("doc_download", L)} @click=${() => this._download(doc)}>
              <ha-icon icon="mdi:download"></ha-icon>
            </button>`
          : nothing}
        ${this.canWrite
          ? html`<button class="icon-btn" title=${t("doc_unlink", L)} ?disabled=${this._busy} @click=${() => this._unlink(doc)}>
              <ha-icon icon="mdi:link-variant-off"></ha-icon>
            </button>`
          : nothing}
      </div>
    `;
  }

  static styles = css`
    :host { display: block; }
    .task-docs { margin-top: 20px; }
    h3 {
      display: flex; align-items: center; gap: 6px; margin: 0 0 8px;
      font-size: 15px; color: var(--primary-text-color);
    }
    h3 ha-icon { --mdc-icon-size: 18px; color: var(--secondary-text-color, #888); }
    .tdoc-empty { color: var(--secondary-text-color, #888); font-size: 13px; padding: 2px 0 8px; }
    .tdoc-error { color: var(--error-color, #f44336); font-size: 13px; margin: 4px 0; }
    .tdoc-list { display: flex; flex-direction: column; gap: 4px; }
    .tdoc-row {
      display: flex; align-items: center; gap: 10px; padding: 6px 10px;
      border: 1px solid var(--divider-color); border-radius: 8px;
    }
    .tdoc-icon { color: var(--primary-color); --mdc-icon-size: 22px; flex: none; }
    .tdoc-info { flex: 1; min-width: 0; cursor: pointer; border-radius: 6px; }
    .tdoc-info:hover .tdoc-title { text-decoration: underline; }
    .tdoc-info:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }
    .tdoc-title { font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .tdoc-meta { font-size: 12px; color: var(--secondary-text-color, #888); }
    .tdoc-pagetag { color: var(--primary-color); font-weight: 500; }
    .tdoc-page {
      flex: none; width: 76px; padding: 5px 8px; border-radius: 6px; font: inherit; font-size: 13px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.06));
      color: var(--primary-text-color); border: 1px solid var(--divider-color);
    }
    .tdoc-page:disabled { opacity: 0.5; }
    .icon-btn {
      display: inline-flex; align-items: center; justify-content: center;
      width: 34px; height: 34px; border-radius: 8px; cursor: pointer;
      background: transparent; border: none; color: var(--primary-text-color);
    }
    .icon-btn:hover { background: var(--secondary-background-color, rgba(0, 0, 0, 0.06)); }
    .icon-btn[disabled] { opacity: 0.4; pointer-events: none; }
    .icon-btn ha-icon { --mdc-icon-size: 20px; }
    .tdoc-attach { display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap; }
    .tdoc-select {
      flex: 1; min-width: 160px; padding: 6px 10px; border-radius: 6px; font: inherit;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.06));
      color: var(--primary-text-color); border: 1px solid var(--divider-color);
    }
    .tdoc-btn {
      display: inline-flex; align-items: center; gap: 6px; cursor: pointer;
      padding: 6px 12px; border-radius: 6px; font: inherit; font-size: 13px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.06));
      color: var(--primary-text-color); border: 1px solid var(--divider-color);
    }
    .tdoc-btn ha-icon { --mdc-icon-size: 18px; }
    .tdoc-btn[disabled] { opacity: 0.5; pointer-events: none; }
  `;
}

if (!customElements.get("maintenance-task-documents")) {
  customElements.define("maintenance-task-documents", MaintenanceTaskDocuments);
}
