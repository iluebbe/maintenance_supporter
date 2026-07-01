/** Documents section for an object's detail view.
 *
 * Self-contained: lists an object's documents (files + web-links), uploads a
 * file (multipart POST to the authenticated view — a WS frame can't carry a
 * binary body), downloads via a signed path (`auth/sign_path` → Companion-safe
 * anchor), adds web-links, and deletes. Write actions are gated by `canWrite`
 * (the server enforces it too); download/open is available to everyone.
 */

import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { t } from "../styles";
import { describeWsError } from "../ws-errors";
import { downloadUrl } from "../helpers/download";
import type { HomeAssistant } from "../types";

interface MaintenanceDocument {
  id: string;
  kind: "file" | "weblink";
  title: string;
  filename?: string;
  url?: string;
  mime?: string;
  size?: number;
  tags?: string[];
  added_at?: string;
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

function fmtSize(bytes: number | undefined): string {
  const b = bytes ?? 0;
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
}

export class MaintenanceDocumentsSection extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public entryId!: string;
  @property({ type: Boolean }) public canWrite = false;

  @state() private _docs: MaintenanceDocument[] = [];
  @state() private _loaded = false;
  @state() private _busy = false;
  @state() private _error = "";
  @state() private _hint = "";
  @state() private _addingLink = false;
  @state() private _linkUrl = "";
  @state() private _linkTitle = "";
  @state() private _category = "manual";

  private _loadedFor: string | null = null;

  private get _lang(): string {
    return this.hass?.language || "en";
  }

  updated(changed: Map<string, unknown>): void {
    super.updated(changed);
    if (this.hass && this.entryId && this._loadedFor !== this.entryId) {
      this._loadedFor = this.entryId;
      void this._load();
    }
  }

  private async _load(): Promise<void> {
    try {
      const r = await this.hass.connection.sendMessagePromise<{ documents: MaintenanceDocument[] }>({
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

  private _category_of(doc: MaintenanceDocument): string {
    const tag = (doc.tags || []).find((x) => (CATEGORIES as readonly string[]).includes(x));
    return tag || "other";
  }

  private _onFileInput(e: Event): void {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) void this._upload(file);
    input.value = ""; // let the same file be re-picked
  }

  private async _upload(file: File): Promise<void> {
    this._busy = true;
    this._error = "";
    this._hint = "";
    try {
      const form = new FormData();
      form.append("entry_id", this.entryId);
      form.append("tags", this._category);
      form.append("file", file, file.name);
      const resp = await fetch("/api/maintenance_supporter/document/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${this.hass.auth?.data?.access_token ?? ""}` },
        body: form,
      });
      if (!resp.ok) {
        this._error = resp.status === 413 ? t("doc_too_large", this._lang) : t("doc_upload_failed", this._lang);
        return;
      }
      const doc = (await resp.json()) as { deduped?: boolean; duplicate_in_object?: string | null };
      if (doc.duplicate_in_object) this._hint = t("doc_dup_in_object", this._lang);
      else if (doc.deduped) this._hint = t("doc_deduped", this._lang);
      await this._load();
    } catch {
      this._error = t("doc_upload_failed", this._lang);
    } finally {
      this._busy = false;
    }
  }

  private async _download(doc: MaintenanceDocument): Promise<void> {
    try {
      const signed = await this.hass.connection.sendMessagePromise<{ path: string }>({
        type: "auth/sign_path",
        path: `/api/maintenance_supporter/document/${doc.id}`,
        expires: 30,
      });
      downloadUrl(signed.path, doc.filename || doc.title || "document");
    } catch (e) {
      this._error = describeWsError(e, this._lang);
    }
  }

  private async _delete(doc: MaintenanceDocument): Promise<void> {
    const name = doc.title || doc.filename || doc.url || "";
    if (!window.confirm(t("doc_delete_confirm", this._lang).replace("{name}", name))) return;
    this._busy = true;
    this._error = "";
    try {
      await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/documents/delete",
        doc_id: doc.id,
      });
      await this._load();
    } catch (e) {
      this._error = describeWsError(e, this._lang);
    } finally {
      this._busy = false;
    }
  }

  private async _addLink(): Promise<void> {
    const url = this._linkUrl.trim();
    if (!url) return;
    this._busy = true;
    this._error = "";
    try {
      await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/documents/add_link",
        entry_id: this.entryId,
        url,
        title: this._linkTitle.trim() || null,
      });
      this._linkUrl = "";
      this._linkTitle = "";
      this._addingLink = false;
      await this._load();
    } catch (e) {
      this._error = describeWsError(e, this._lang, t("doc_link_invalid", this._lang));
    } finally {
      this._busy = false;
    }
  }

  render() {
    const L = this._lang;
    return html`
      <div class="doc-header">
        <h3>${t("documents", L)} (${this._docs.length})</h3>
        ${this.canWrite
          ? html`
              <div class="doc-actions">
                <select
                  class="cat-select"
                  .value=${this._category}
                  ?disabled=${this._busy}
                  @change=${(e: Event) => (this._category = (e.target as HTMLSelectElement).value)}
                >
                  ${CATEGORIES.map((c) => html`<option value=${c}>${t(`doc_cat_${c}`, L)}</option>`)}
                </select>
                <label class="btn primary ${this._busy ? "disabled" : ""}">
                  <ha-icon icon="mdi:upload"></ha-icon>
                  ${this._busy ? t("doc_uploading", L) : t("doc_upload", L)}
                  <input type="file" hidden ?disabled=${this._busy} @change=${this._onFileInput} />
                </label>
                <button class="btn" ?disabled=${this._busy} @click=${() => (this._addingLink = !this._addingLink)}>
                  <ha-icon icon="mdi:link-variant"></ha-icon> ${t("doc_add_link", L)}
                </button>
              </div>
            `
          : nothing}
      </div>

      ${this._error ? html`<div class="doc-msg error">${this._error}</div>` : nothing}
      ${this._hint ? html`<div class="doc-msg hint">${this._hint}</div>` : nothing}

      ${this._addingLink && this.canWrite
        ? html`
            <div class="link-form">
              <input
                type="url"
                placeholder=${t("doc_link_url", L)}
                .value=${this._linkUrl}
                ?disabled=${this._busy}
                @input=${(e: Event) => (this._linkUrl = (e.target as HTMLInputElement).value)}
              />
              <input
                type="text"
                placeholder=${t("doc_link_title", L)}
                .value=${this._linkTitle}
                ?disabled=${this._busy}
                @input=${(e: Event) => (this._linkTitle = (e.target as HTMLInputElement).value)}
              />
              <button class="btn primary" ?disabled=${this._busy || !this._linkUrl.trim()} @click=${this._addLink}>
                ${t("add", L)}
              </button>
              <button class="btn" ?disabled=${this._busy} @click=${() => (this._addingLink = false)}>
                ${t("cancel", L)}
              </button>
            </div>
          `
        : nothing}

      ${!this._loaded
        ? html`<div class="doc-empty">${t("loading", L)}</div>`
        : this._docs.length === 0
          ? html`<div class="doc-empty">${t("documents_empty", L)}</div>`
          : html`
              <div class="doc-list">
                ${this._docs.map((doc) => this._renderDoc(doc, L))}
              </div>
            `}
    `;
  }

  private _renderDoc(doc: MaintenanceDocument, L: string) {
    const isFile = doc.kind === "file";
    const cat = this._category_of(doc);
    const meta = isFile
      ? `${t(`doc_cat_${cat}`, L)} · ${fmtSize(doc.size)}`
      : t("doc_link_badge", L);
    return html`
      <div class="doc-row">
        <ha-icon class="doc-icon" icon=${isFile ? CATEGORY_ICONS[cat] : "mdi:link-variant"}></ha-icon>
        <div class="doc-info">
          <div class="doc-title">${doc.title || doc.filename || doc.url}</div>
          <div class="doc-meta">${meta}</div>
        </div>
        <div class="doc-row-actions">
          ${isFile
            ? html`<button class="icon-btn" title=${t("doc_open", L)} @click=${() => this._download(doc)}>
                <ha-icon icon="mdi:download"></ha-icon>
              </button>`
            : html`<a
                class="icon-btn"
                href=${doc.url ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                title=${t("doc_open", L)}
              ><ha-icon icon="mdi:open-in-new"></ha-icon></a>`}
          ${this.canWrite
            ? html`<button
                class="icon-btn danger"
                title=${t("delete", L)}
                ?disabled=${this._busy}
                @click=${() => this._delete(doc)}
              >
                <ha-icon icon="mdi:delete"></ha-icon>
              </button>`
            : nothing}
        </div>
      </div>
    `;
  }

  static styles = css`
    :host { display: block; margin: 8px 0 4px; }
    .doc-header {
      display: flex; align-items: center; justify-content: space-between;
      gap: 12px; flex-wrap: wrap;
    }
    h3 { margin: 8px 0; font-size: 16px; }
    .doc-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .cat-select {
      padding: 6px 8px; border-radius: 6px; font: inherit;
      background: var(--secondary-background-color, rgba(0,0,0,0.06));
      color: var(--primary-text-color); border: 1px solid var(--divider-color);
    }
    .btn {
      display: inline-flex; align-items: center; gap: 6px; cursor: pointer;
      padding: 6px 12px; border-radius: 6px; font: inherit; font-size: 13px;
      background: var(--secondary-background-color, rgba(0,0,0,0.06));
      color: var(--primary-text-color); border: 1px solid var(--divider-color);
    }
    .btn.primary { background: var(--primary-color); color: var(--text-primary-color, #fff); border-color: var(--primary-color); }
    .btn.disabled, .btn[disabled] { opacity: 0.5; pointer-events: none; }
    .btn ha-icon { --mdc-icon-size: 18px; }
    .link-form { display: flex; gap: 8px; flex-wrap: wrap; margin: 8px 0; }
    .link-form input {
      flex: 1 1 180px; padding: 6px 10px; border-radius: 6px; font: inherit;
      background: var(--secondary-background-color, rgba(0,0,0,0.06));
      color: var(--primary-text-color); border: 1px solid var(--divider-color);
    }
    .doc-msg { font-size: 13px; margin: 6px 0; }
    .doc-msg.error { color: var(--error-color, #f44336); }
    .doc-msg.hint { color: var(--secondary-text-color, #888); }
    .doc-empty { color: var(--secondary-text-color, #888); font-size: 13px; padding: 8px 0; }
    .doc-list { display: flex; flex-direction: column; gap: 4px; }
    .doc-row {
      display: flex; align-items: center; gap: 12px; padding: 8px 10px;
      border: 1px solid var(--divider-color); border-radius: 8px;
      background: var(--card-background-color, transparent);
    }
    .doc-icon { color: var(--primary-color); --mdc-icon-size: 24px; flex: none; }
    .doc-info { flex: 1; min-width: 0; }
    .doc-title { font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .doc-meta { font-size: 12px; color: var(--secondary-text-color, #888); }
    .doc-row-actions { display: flex; gap: 4px; flex: none; }
    .icon-btn {
      display: inline-flex; align-items: center; justify-content: center;
      width: 34px; height: 34px; border-radius: 8px; cursor: pointer;
      background: transparent; border: none; color: var(--primary-text-color);
      text-decoration: none;
    }
    .icon-btn:hover { background: var(--secondary-background-color, rgba(0,0,0,0.06)); }
    .icon-btn.danger { color: var(--error-color, #f44336); }
    .icon-btn[disabled] { opacity: 0.4; pointer-events: none; }
    .icon-btn ha-icon { --mdc-icon-size: 20px; }
  `;
}

if (!customElements.get("maintenance-documents-section")) {
  customElements.define("maintenance-documents-section", MaintenanceDocumentsSection);
}
