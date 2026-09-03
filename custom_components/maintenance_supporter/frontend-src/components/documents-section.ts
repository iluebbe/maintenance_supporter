/** Documents section for an object's detail view.
 *
 * Self-contained: lists an object's documents (files + web-links), uploads a
 * file (multipart POST to the authenticated view — a WS frame can't carry a
 * binary body), downloads via a signed path (`auth/sign_path` → Companion-safe
 * anchor), adds web-links, and deletes. Write actions are gated by `canWrite`
 * (the server enforces it too); download/open is available to everyone.
 */

import { LitElement, html, css, nothing } from "lit";
import { isSafeHttpUrl } from "../helpers/url";
import { property, state } from "lit/decorators.js";
import { t, ensureLocale, langOf } from "../styles";
import { describeWsError } from "../ws-errors";
import { downloadUrl } from "../helpers/download";
import { downloadSignedDocument, openSignedDocument, signDocumentPath } from "../helpers/document-url";
import { formatBytes } from "../helpers/format-bytes";
import { docDisplayName, CATEGORIES, CATEGORY_ICONS } from "../helpers/document-categories";
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
  @state() private _thumbs: Record<string, string> = {};
  @state() private _lightboxUrl = "";
  @state() private _editingId = "";
  @state() private _editTitle = "";
  @state() private _editCategory = "manual";
  @state() private _dragOver = false;

  private _loadedFor: string | null = null;
  private _localeReady = false;

  private _isImage(doc: MaintenanceDocument): boolean {
    return doc.kind === "file" && (doc.mime || "").startsWith("image/");
  }

  private async _sign(doc: MaintenanceDocument): Promise<string> {
    return signDocumentPath(this.hass, doc.id);
  }

  private get _lang(): string {
    return langOf(this.hass);
  }

  updated(changed: Map<string, unknown>): void {
    super.updated(changed);
    if (this.hass && !this._localeReady) {
      this._localeReady = true;
      // Re-render once the runtime locale JSON arrives (t() falls back to English
      // until then), so a first paint before the fetch lands still localizes.
      void ensureLocale(this._lang).then(() => this.requestUpdate());
    }
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
      this._thumbs = {};
      void this._loadThumbs();
    } catch (e) {
      this._error = describeWsError(e, this._lang);
      this._loaded = true;
    }
  }

  /** Pre-sign a serve URL for each image doc so it can render as a thumbnail. */
  private async _loadThumbs(): Promise<void> {
    await Promise.all(
      this._docs.filter((d) => this._isImage(d)).map(async (d) => {
        try {
          const url = await this._sign(d);
          this._thumbs = { ...this._thumbs, [d.id]: url };
        } catch {
          /* leave the fallback icon */
        }
      }),
    );
  }

  private _category_of(doc: MaintenanceDocument): string {
    const tag = (doc.tags || []).find((x) => (CATEGORIES as readonly string[]).includes(x));
    return tag || "other";
  }

  /** Keyboard support for the file-picker <label>s (Enter/Space → open). */
  private _labelKeydown(e: KeyboardEvent): void {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      (e.currentTarget as HTMLElement).querySelector("input")?.click();
    }
  }

  private _onFileInput(e: Event): void {
    const input = e.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    if (files.length) void this._uploadFiles(files);
    input.value = ""; // let the same file be re-picked
  }

  private _onCameraInput(e: Event): void {
    const input = e.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    if (files.length) void this._uploadFiles(files, "photo");
    input.value = "";
  }

  private _onDrop(e: DragEvent): void {
    e.preventDefault();
    this._dragOver = false;
    if (!this.canWrite || this._busy) return;
    const files = Array.from(e.dataTransfer?.files ?? []);
    if (files.length) void this._uploadFiles(files);
  }

  private _onDragOver(e: DragEvent): void {
    if (!this.canWrite) return;
    e.preventDefault();
    this._dragOver = true;
  }

  private _onDragLeave(e: DragEvent): void {
    // Only clear when the pointer truly leaves the zone (not when moving over a
    // child element), otherwise the overlay flickers.
    const rt = e.relatedTarget as Node | null;
    if (!rt || !(e.currentTarget as HTMLElement).contains(rt)) this._dragOver = false;
  }

  private async _uploadFiles(files: File[], category?: string): Promise<void> {
    const cat = category ?? this._category;
    this._busy = true;
    this._error = "";
    this._hint = "";
    let deduped = 0;
    let dupInObject = 0;
    try {
      for (const file of files) {
        const form = new FormData();
        form.append("entry_id", this.entryId);
        form.append("tags", cat);
        form.append("file", file, file.name);
        const resp = await fetch("/api/maintenance_supporter/document/upload", {
          method: "POST",
          headers: { Authorization: `Bearer ${this.hass.auth?.data?.access_token ?? ""}` },
          body: form,
        });
        if (!resp.ok) {
          this._error = resp.status === 413 ? t("doc_too_large", this._lang) : t("doc_upload_failed", this._lang);
          continue;
        }
        const doc = (await resp.json()) as { deduped?: boolean; duplicate_in_object?: string | null };
        if (doc.duplicate_in_object) dupInObject++;
        else if (doc.deduped) deduped++;
      }
      if (dupInObject) this._hint = t("doc_dup_in_object", this._lang);
      else if (deduped) this._hint = t("doc_deduped", this._lang);
      await this._load();
    } catch {
      this._error = t("doc_upload_failed", this._lang);
    } finally {
      this._busy = false;
    }
  }

  private async _download(doc: MaintenanceDocument): Promise<void> {
    try {
      await downloadSignedDocument(this.hass, doc.id, doc.filename || doc.title || "document");
    } catch (e) {
      this._error = describeWsError(e, this._lang);
    }
  }

  /** Open a document for viewing: images in an in-app lightbox, everything else
   *  inline in a new tab (the serve view sends Content-Disposition: inline). */
  private async _preview(doc: MaintenanceDocument): Promise<void> {
    if (this._isImage(doc)) {
      this._lightboxUrl = this._thumbs[doc.id] || (await this._sign(doc));
      return;
    }
    try {
      await openSignedDocument(this.hass, doc.id);
    } catch (e) {
      this._error = describeWsError(e, this._lang);
    }
  }

  /** Open a document from a title/row click (not just the small icons): preview
   *  a file, open a web-link in a new tab. */
  private _openDoc(doc: MaintenanceDocument): void {
    if (doc.kind === "file") void this._preview(doc);
    // Only open http(s) links — never a javascript:/data: URL (the same scheme
    // guard the rest of the panel applies before opening user-supplied URLs).
    else if (isSafeHttpUrl(doc.url)) window.open(doc.url, "_blank", "noopener");
  }

  private _startEdit(doc: MaintenanceDocument): void {
    this._editingId = doc.id;
    this._editTitle = doc.title || "";
    this._editCategory = this._category_of(doc);
    this._addingLink = false;
    this._error = "";
  }

  private _cancelEdit(): void {
    this._editingId = "";
  }

  private async _saveEdit(doc: MaintenanceDocument): Promise<void> {
    // Keep any free (non-category) tags; swap in the chosen category.
    const freeTags = (doc.tags || []).filter(
      (x) => !(CATEGORIES as readonly string[]).includes(x),
    );
    const tags = doc.kind === "file" ? [this._editCategory, ...freeTags] : (doc.tags ?? []);
    this._busy = true;
    this._error = "";
    try {
      await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/documents/update",
        doc_id: doc.id,
        title: this._editTitle.trim() || doc.filename || doc.url || "",
        tags,
      });
      this._editingId = "";
      await this._load();
    } catch (e) {
      this._error = describeWsError(e, this._lang);
    } finally {
      this._busy = false;
    }
  }

  private async _delete(doc: MaintenanceDocument): Promise<void> {
    const name = docDisplayName(doc);
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
      <div
        class="doc-zone ${this._dragOver ? "drag-over" : ""}"
        @dragover=${this._onDragOver}
        @dragleave=${this._onDragLeave}
        @drop=${this._onDrop}
      >
        ${this._dragOver && this.canWrite
          ? html`<div class="drop-overlay">
              <ha-icon icon="mdi:tray-arrow-down"></ha-icon> ${t("doc_drop_hint", L)}
            </div>`
          : nothing}
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
                <label
                  class="btn primary ${this._busy ? "disabled" : ""}"
                  role="button"
                  tabindex="0"
                  @keydown=${this._labelKeydown}
                >
                  <ha-icon icon="mdi:upload"></ha-icon>
                  ${this._busy ? t("doc_uploading", L) : t("doc_upload", L)}
                  <input type="file" multiple hidden ?disabled=${this._busy} @change=${this._onFileInput} />
                </label>
                <label
                  class="btn camera-btn ${this._busy ? "disabled" : ""}"
                  role="button"
                  tabindex="0"
                  aria-label=${t("doc_camera", L)}
                  title=${t("doc_camera", L)}
                  @keydown=${this._labelKeydown}
                >
                  <ha-icon icon="mdi:camera"></ha-icon>
                  <input type="file" accept="image/*" capture="environment" hidden ?disabled=${this._busy} @change=${this._onCameraInput} />
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

      ${this._lightboxUrl
        ? html`<div class="lightbox" @click=${() => (this._lightboxUrl = "")}>
            <img class="lightbox-img" src=${this._lightboxUrl} @click=${(e: Event) => e.stopPropagation()} />
            <button class="lightbox-close" title=${t("doc_close", L)} @click=${() => (this._lightboxUrl = "")}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>`
        : nothing}
      </div>
    `;
  }

  private _renderDoc(doc: MaintenanceDocument, L: string) {
    if (this._editingId === doc.id) return this._renderEdit(doc, L);
    const isFile = doc.kind === "file";
    const cat = this._category_of(doc);
    const meta = isFile
      ? `${t(`doc_cat_${cat}`, L)} · ${formatBytes(doc.size, L)}`
      : t("doc_link_badge", L);
    const thumb = this._thumbs[doc.id];
    return html`
      <div class="doc-row">
        ${isFile && thumb
          ? html`<img
              class="doc-thumb"
              src=${thumb}
              alt=${doc.title || ""}
              title=${t("doc_open", L)}
              @click=${() => this._preview(doc)}
            />`
          : html`<ha-icon
              class="doc-icon ${isFile ? "clickable" : ""}"
              icon=${isFile ? CATEGORY_ICONS[cat] : "mdi:link-variant"}
              @click=${() => isFile && this._preview(doc)}
            ></ha-icon>`}
        <div
          class="doc-info"
          role="button"
          tabindex="0"
          title=${t("doc_open", L)}
          @click=${() => this._openDoc(doc)}
          @keydown=${(e: KeyboardEvent) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              this._openDoc(doc);
            }
          }}
        >
          <div class="doc-title">${docDisplayName(doc)}</div>
          <div class="doc-meta">${meta}</div>
        </div>
        <div class="doc-row-actions">
          ${isFile
            ? html`
                <button class="icon-btn" title=${t("doc_open", L)} @click=${() => this._preview(doc)}>
                  <ha-icon icon="mdi:eye-outline"></ha-icon>
                </button>
                <button class="icon-btn" title=${t("doc_download", L)} @click=${() => this._download(doc)}>
                  <ha-icon icon="mdi:download"></ha-icon>
                </button>`
            : html`<a
                class="icon-btn"
                href=${isSafeHttpUrl(doc.url) ? doc.url : "#"}
                target="_blank"
                rel="noopener noreferrer"
                title=${t("doc_open", L)}
              ><ha-icon icon="mdi:open-in-new"></ha-icon></a>`}
          ${this.canWrite
            ? html`
                <button class="icon-btn" title=${t("edit", L)} ?disabled=${this._busy} @click=${() => this._startEdit(doc)}>
                  <ha-icon icon="mdi:pencil"></ha-icon>
                </button>
                <button class="icon-btn danger" title=${t("delete", L)} ?disabled=${this._busy} @click=${() => this._delete(doc)}>
                  <ha-icon icon="mdi:delete"></ha-icon>
                </button>`
            : nothing}
        </div>
      </div>
    `;
  }

  private _renderEdit(doc: MaintenanceDocument, L: string) {
    const isFile = doc.kind === "file";
    return html`
      <div class="doc-row editing">
        <input
          class="edit-title"
          type="text"
          placeholder=${t("doc_link_title", L)}
          .value=${this._editTitle}
          ?disabled=${this._busy}
          @input=${(e: Event) => (this._editTitle = (e.target as HTMLInputElement).value)}
        />
        ${isFile
          ? html`<select
              class="cat-select"
              ?disabled=${this._busy}
              @change=${(e: Event) => (this._editCategory = (e.target as HTMLSelectElement).value)}
            >
              ${CATEGORIES.map(
                (c) => html`<option value=${c} ?selected=${c === this._editCategory}>${t(`doc_cat_${c}`, L)}</option>`,
              )}
            </select>`
          : nothing}
        <button class="icon-btn" title=${t("save", L)} ?disabled=${this._busy || !this._editTitle.trim()} @click=${() => this._saveEdit(doc)}>
          <ha-icon icon="mdi:check"></ha-icon>
        </button>
        <button class="icon-btn" title=${t("cancel", L)} ?disabled=${this._busy} @click=${this._cancelEdit}>
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </div>
    `;
  }

  static styles = css`
    :host { display: block; margin: 8px 0 4px; }
    .doc-zone { position: relative; }
    .doc-zone.drag-over {
      outline: 2px dashed var(--primary-color); outline-offset: 4px; border-radius: 8px;
    }
    .drop-overlay {
      position: absolute; inset: 0; z-index: 5; pointer-events: none;
      display: flex; align-items: center; justify-content: center; gap: 8px;
      border-radius: 8px; font-size: 15px; font-weight: 600;
      color: var(--primary-color); opacity: 0.95;
      background: var(--card-background-color, rgba(255, 255, 255, 0.85));
    }
    .drop-overlay ha-icon { --mdc-icon-size: 24px; }
    .camera-btn { padding: 6px 10px; }
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
    .btn:focus-visible, .icon-btn:focus-visible {
      outline: 2px solid var(--primary-color); outline-offset: 2px;
    }
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
    .doc-row.editing { gap: 8px; }
    .edit-title {
      flex: 1; min-width: 0; padding: 6px 10px; border-radius: 6px; font: inherit;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.06));
      color: var(--primary-text-color); border: 1px solid var(--divider-color);
    }
    .doc-icon { color: var(--primary-color); --mdc-icon-size: 24px; flex: none; }
    .doc-icon.clickable { cursor: pointer; }
    .doc-thumb {
      width: 40px; height: 40px; object-fit: cover; border-radius: 6px; flex: none;
      cursor: pointer; border: 1px solid var(--divider-color);
      background: var(--secondary-background-color, rgba(0,0,0,0.06));
    }
    .lightbox {
      position: fixed; inset: 0; z-index: 9999; cursor: zoom-out;
      display: flex; align-items: center; justify-content: center;
      background: rgba(0, 0, 0, 0.85);
    }
    .lightbox-img {
      max-width: 92vw; max-height: 92vh; object-fit: contain; cursor: default;
      border-radius: 8px; box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5);
    }
    .lightbox-close {
      position: fixed; top: 16px; right: 16px; cursor: pointer;
      display: inline-flex; align-items: center; justify-content: center;
      width: 44px; height: 44px; border-radius: 50%; border: none;
      background: rgba(0, 0, 0, 0.5); color: #fff;
    }
    .lightbox-close ha-icon { --mdc-icon-size: 26px; }
    .doc-info { flex: 1; min-width: 0; cursor: pointer; border-radius: 6px; }
    .doc-info:hover .doc-title { text-decoration: underline; }
    .doc-info:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }
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
