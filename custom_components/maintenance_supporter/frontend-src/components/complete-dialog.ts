/** Dialog for completing a maintenance task with optional notes, cost, duration. */

import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import type { HomeAssistant, TaskPartLink } from "../types";
import { t, nativeFieldStyles, formatCost } from "../styles";
import { describeWsError } from "../ws-errors";
import { partLinkKey, type LinkedPart } from "../helpers/shared-parts";
import { REQUIRED_COMPLETION_LABELS } from "./required-completion-labels";
import {
  MAX_COMPLETION_PHOTOS,
  discardUploadedPhotos,
  uploadCompletionPhoto,
} from "../helpers/photo-upload";
import "./ms-date-field";

export class MaintenanceCompleteDialog extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property() public entryId = "";
  @property() public taskId = "";
  @property() public taskName = "";
  @property() public lang = "en";
  @property({ type: Array }) public checklist: string[] = [];
  @property({ type: Boolean }) public adaptiveEnabled = false;
  // v2.20 (#83): task type + unit drive the reading-value field below.
  @property() public taskType = "";
  @property() public readingUnit = "";
  /** Buy task (part_ref): default restock quantity — shows an editable qty field. */
  @property({ attribute: false }) public restockDefault: number | null = null;
  /** #104 follow-up: the buy task's part unit cost — powers the cost
   *  suggestion (restock qty × unit cost). */
  @property({ attribute: false }) public restockUnitCost: number | null = null;
  /** Currency symbol for the cost suggestion ("" = plain number). */
  @property() public currencySymbol = "";
  /** #99: the parts offered on completion — enables the editable "parts used"
   *  section. Built by `partsForCompletion`: the object's own inventory plus
   *  every shared pool this task links to (#111), each tagged with its owner. */
  @property({ attribute: false }) public parts: LinkedPart[] = [];
  /** #99: the task's fixed consumes_parts links (prefill for the section).
   *  A link may carry an `entry_id` (#111) and MUST keep it through the edit —
   *  without it the completion would decrement the wrong inventory, or none. */
  @property({ attribute: false }) public consumesParts: TaskPartLink[] = [];
  /** "Consumes: 1× HEPA-Filter (Shelf B)" hint lines for consuming tasks. */
  @property({ type: Array }) public consumesInfo: string[] = [];
  /** Details this task demands before it counts as done (v2.44). The backend
   *  enforces the same list at every completion surface; blocking Save here
   *  just means the user never has to meet that rejection. */
  @property({ type: Array }) public requiredFields: string[] = [];
  /** #139: "2/4 · Flip blades" — which phase of the cycle this completion
   *  records. Purely informative; the backend advances the cursor itself. */
  @property() public phaseLabel = "";
  /** Proof of presence: the task completes only via NFC/QR scan — the
   *  dialog says so up front instead of relaying the server's refusal. */
  @property({ type: Boolean }) public requireTagScan = false;
  /** This open is the fallback of a QR/NFC scan (quick-complete refused for
   *  missing defaults/details): the completion carries `via_tag_scan` so the
   *  tag-scan gate counts the scan that got the user here, and the "scan
   *  required" note stays hidden — they just did. Set by open(); never
   *  survives into the next open. */
  @property({ type: Boolean }) public viaTagScan = false;
  @state() private _open = false;
  @state() private _notes = "";
  @state() private _cost = "";
  @state() private _duration = "";
  @state() private _loading = false;
  @state() private _error = "";
  @state() private _checklistState: Record<string, boolean> = {};
  @state() private _feedback: string = "needed";
  /** #161: the photos attached so far, in pick order (preview = object URL). */
  @state() private _photos: Array<{ id: string; preview: string }> = [];
  /** Docs uploaded by THIS dialog session; dropped again on Cancel so an
   *  abandoned completion leaves no orphan files behind. */
  private _uploadedIds: string[] = [];
  @state() private _photoUploading = false;
  @state() private _readingValue = "";
  @state() private _restockQty = "";
  /** #133: optional backdated completion moment ("YYYY-MM-DDTHH:MM:SS" local; "" = now). */
  @state() private _completedAt = "";
  /** Keyed by `partLinkKey` — the (entry_id, part_id) pair — because two
   *  objects can carry the same part id, so part_id alone would merge pools. */
  @state() private _usedParts: Record<string, TaskPartLink> = {};

  /** #73: in-cycle ticks (keyed by item TEXT) recorded on the task detail —
   *  prefill the dialog so nobody re-ticks what is already done. */
  @property({ attribute: false }) public checklistPrefill: Record<string, boolean> = {};

  public open(opts: { viaTagScan?: boolean } = {}): void {
    if (this._open) return;
    this._open = true;
    // Reset on every open — a plain open after a scan fallback must not
    // keep claiming proof of presence.
    this.viaTagScan = !!opts.viaTagScan;
    this._notes = "";
    this._cost = "";
    this._duration = "";
    this._error = "";
    // The dialog's own state is INDEX-keyed (historical shape, flows into the
    // history entry as-is) — map the text-keyed in-cycle ticks onto indices.
    this._checklistState = Object.fromEntries(
      this.checklist
        .map((item, i) => [String(i), !!this.checklistPrefill[item]] as const)
        .filter(([, done]) => done),
    );
    this._feedback = "needed";
    this._photos.forEach((p) => URL.revokeObjectURL(p.preview));
    this._photos = [];
    this._uploadedIds = [];
    this._photoUploading = false;
    this._readingValue = "";
    this._restockQty = this.restockDefault !== null ? String(this.restockDefault) : "";
    this._completedAt = "";
    // #99: prefill "parts used" with the task's fixed links — the user can
    // untick or adjust before completing. The whole link is kept, entry_id
    // included, so a shared pool survives the edit (#111).
    this._usedParts = Object.fromEntries(this.consumesParts.map((l) => [partLinkKey(l), { ...l }]));
  }

  private _toggleCheck(idx: number): void {
    const key = String(idx);
    this._checklistState = {
      ...this._checklistState,
      [key]: !this._checklistState[key],
    };
  }

  private _setFeedback(value: string): void {
    this._feedback = value;
  }

  /** #161: both pickers (camera = one shot, gallery = multiple) land here.
   *  Files upload one after another so a slow connection still shows
   *  progress tile by tile; anything beyond the cap is dropped with a
   *  note rather than silently. */
  private async _onPhotoInput(e: Event): Promise<void> {
    const input = e.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    input.value = ""; // allow re-picking the same file
    if (files.length === 0) return;
    const room = MAX_COMPLETION_PHOTOS - this._photos.length;
    const accepted = files.slice(0, Math.max(room, 0));
    this._photoUploading = true;
    this._error = "";
    try {
      for (const file of accepted) {
        const id = await uploadCompletionPhoto(this.hass, this.entryId, file);
        this._uploadedIds = [...this._uploadedIds, id];
        this._photos = [...this._photos, { id, preview: URL.createObjectURL(file) }];
      }
      if (files.length > accepted.length) {
        this._error = t("photos_limit", this.lang).replace("{max}", String(MAX_COMPLETION_PHOTOS));
      }
    } catch (e) {
      const key = e instanceof Error && e.message === "doc_too_large" ? "doc_too_large" : "doc_upload_failed";
      this._error = t(key, this.lang);
    } finally {
      this._photoUploading = false;
    }
  }

  /** ✕ on a tile: drop it from the completion AND delete the upload —
   *  the file only ever existed for this dialog session. */
  private _removePhoto(id: string): void {
    const gone = this._photos.find((p) => p.id === id);
    if (gone) URL.revokeObjectURL(gone.preview);
    this._photos = this._photos.filter((p) => p.id !== id);
    if (this._uploadedIds.includes(id)) {
      this._uploadedIds = this._uploadedIds.filter((x) => x !== id);
      void discardUploadedPhotos(this.hass, [id]);
    }
  }

  private async _complete(): Promise<void> {
    this._loading = true;
    this._error = "";
    try {
      const data: Record<string, unknown> = {
        type: "maintenance_supporter/task/complete",
        entry_id: this.entryId,
        task_id: this.taskId,
      };
      if (this._notes) data.notes = this._notes;
      if (this._cost) {
        const cost = parseFloat(this._cost);
        if (!isNaN(cost) && cost >= 0) data.cost = cost;
      }
      if (this._duration) {
        const dur = parseInt(this._duration, 10);
        if (!isNaN(dur) && dur >= 0) data.duration = dur;
      }
      if (this.checklist.length > 0) {
        data.checklist_state = this._checklistState;
      }
      if (this.adaptiveEnabled) {
        data.feedback = this._feedback;
      }
      if (this._photos.length > 0) {
        data.photo_doc_ids = this._photos.map((p) => p.id);
      }
      // Scan fallback: the backend accepts via_tag_scan on task/complete so a
      // require_tag_scan task can still be finished from the dialog the scan
      // opened. Only ever sent when a scan actually happened.
      if (this.viaTagScan) {
        data.via_tag_scan = true;
      }
      if (this._completedAt) {
        // Client-side guard mirrors the backend rule — a picked future moment
        // fails fast with a localized message instead of a WS roundtrip.
        if (new Date(this._completedAt).getTime() > Date.now()) {
          this._error = t("completed_at_future_error", this.lang);
          this._loading = false;
          return;
        }
        // Re-add seconds if the datetime-local input drops them (same
        // normalisation as the history-edit dialog).
        data.completed_at = this._completedAt.length === 16 ? `${this._completedAt}:00` : this._completedAt;
      }
      if (this._readingValue !== "") {
        const rv = parseFloat(this._readingValue);
        if (!isNaN(rv)) data.reading_value = rv;
      }
      if (this.restockDefault !== null && this._restockQty !== "") {
        const rq = parseFloat(this._restockQty);
        if (!isNaN(rq) && rq >= 1) data.restock_quantity = rq;
      }
      // #99: with a parts section shown, send the explicit selection — it
      // replaces the automatic consumes_parts deduction (empty = none used).
      // entry_id travels only when the pool is somebody else's (#111), so an
      // own-part payload is byte-identical to what shipped before.
      if (this.parts.length > 0) {
        data.used_parts = Object.values(this._usedParts)
          .filter((l) => Number.isFinite(l.quantity) && l.quantity > 0)
          .map((l) =>
            l.entry_id
              ? { part_id: l.part_id, quantity: l.quantity, entry_id: l.entry_id }
              : { part_id: l.part_id, quantity: l.quantity },
          );
      }
      await this.hass.connection.sendMessagePromise(data);
      this._uploadedIds = []; // attached now — Cancel cleanup must not touch them
      this._open = false;
      this.dispatchEvent(new CustomEvent("task-completed"));
    } catch (e) {
      this._error = describeWsError(e, this.lang, t("save_error", this.lang));
    } finally {
      this._loading = false;
    }
  }

  /** Required details the user has not supplied yet (drives Save + markers). */
  private get _missingRequired(): string[] {
    const filled: Record<string, boolean> = {
      notes: this._notes.trim() !== "",
      cost: this._cost.trim() !== "",
      duration: this._duration.trim() !== "",
      photo: this._photos.length > 0,
      // "Who did it" is filled in server-side from the authenticated
      // connection (websocket/tasks_actions.py), so the dialog satisfies it
      // as long as we ARE a logged-in user. Claiming it is always satisfied
      // was how a task requiring "user" ended up unclosable: Save stayed
      // enabled and the backend rejected the completion every time.
      user: !!this.hass?.user,
    };
    return this.requiredFields.filter((f) => !filled[f]);
  }

  /** Marker appended to a required field's label. */
  private _req(field: string) {
    return this.requiredFields.includes(field) ? html`<span class="req-mark" aria-hidden="true">*</span>` : nothing;
  }

  /** #104 follow-up: suggested cost derived from the parts this completion
   *  touches — the SELECTED "parts used" (qty × each part's unit cost) on a
   *  consuming task, or restock qty × unit cost on a buy task. Null when no
   *  involved part carries a price. Follows the live selection, so ticking
   *  a part off updates the suggestion. */
  private _partsCostSuggestion(): number | null {
    if (this.restockDefault !== null) {
      const qty = parseFloat(this._restockQty);
      if (this.restockUnitCost == null || !Number.isFinite(qty) || qty <= 0) return null;
      return Math.round(this.restockUnitCost * qty * 100) / 100;
    }
    if (!this.parts.length) return null;
    let sum = 0;
    let priced = false;
    for (const link of Object.values(this._usedParts)) {
      const def = this.parts.find(
        (pt) => partLinkKey({ part_id: pt.id, entry_id: pt.entry_id }) === partLinkKey(link),
      );
      if (def?.cost != null) {
        sum += def.cost * (link.quantity || 1);
        priced = true;
      }
    }
    return priced ? Math.round(sum * 100) / 100 : null;
  }

  /** The one-click "use ≈ X from parts" chip under the cost field. Hidden
   *  once the user typed a cost themselves — a suggestion, never an
   *  overwrite. */
  private _renderCostSuggestion(L: string) {
    if (this._cost.trim() !== "") return nothing;
    const suggestion = this._partsCostSuggestion();
    if (suggestion == null || suggestion <= 0) return nothing;
    const amount = formatCost(suggestion, this.currencySymbol, L);
    return html`<button
      type="button"
      class="cost-suggestion"
      @click=${() => (this._cost = String(Math.round(suggestion * 100) / 100))}
    >${t("cost_from_parts", L).replace("{amount}", amount)}</button>`;
  }

  private _close(): void {
    this._open = false;
    if (this._uploadedIds.length > 0) {
      const orphans = this._uploadedIds;
      this._uploadedIds = [];
      void discardUploadedPhotos(this.hass, orphans);
    }
  }

  /** Seed the backdate field with the current minute (local, seconds zeroed). */
  private _pickCompletedAt(): void {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    this._completedAt = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
  }

  render() {
    if (!this._open) return html``;
    const L = this.lang || this.hass?.language || "en";
    return html`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${t("complete_title", L)}${this.taskName}</div>
        ${this.phaseLabel ? html`<div class="phase-line">${t("phase_current", L)}: ${this.phaseLabel}</div>` : nothing}
        ${this.requireTagScan && !this.viaTagScan ? html`<div class="scan-required-note">${t("require_tag_scan_hint", L)}</div>` : nothing}
        <div class="content">
          ${this._error ? html`<div class="error">${this._error}</div>` : nothing}
          ${this.checklist.length > 0 ? html`
            <div class="checklist-section">
              <label class="checklist-label">${t("checklist", L)}</label>
              ${this.checklist.map((item, idx) => html`
                <label class="checklist-item" @click=${() => this._toggleCheck(idx)}>
                  <input type="checkbox" .checked=${!!this._checklistState[String(idx)]} />
                  <span>${item}</span>
                </label>
              `)}
            </div>
          ` : nothing}
          ${this.taskType === "reading"
            ? html`
              <label class="field">
                <span class="field-label">${t("reading_value_label", L)}${this.readingUnit ? ` (${this.readingUnit})` : ""}</span>
                <input type="number" step="any" class="field-input"
                  .value=${this._readingValue}
                  @input=${(e: Event) => (this._readingValue = (e.target as HTMLInputElement).value)} />
              </label>`
            : nothing}
          ${this.parts.length
            ? html`<div class="used-parts">
                <span class="field-label">${t("complete_parts_used", L)}</span>
                ${this.parts.map((pt) => {
                  const key = partLinkKey({ part_id: pt.id, entry_id: pt.entry_id });
                  const link = this._usedParts[key];
                  const checked = link !== undefined;
                  const base: TaskPartLink = pt.entry_id
                    ? { part_id: pt.id, quantity: 1, entry_id: pt.entry_id }
                    : { part_id: pt.id, quantity: 1 };
                  return html`<div class="used-part-row">
                    <label class="used-part-check">
                      <input type="checkbox" .checked=${checked}
                        @change=${(e: Event) => {
                          const next = { ...this._usedParts };
                          if ((e.target as HTMLInputElement).checked) next[key] = next[key] || base;
                          else delete next[key];
                          this._usedParts = next;
                        }} />
                      <span
                        >${pt.name}${pt.owner_name
                          ? html`<span class="used-part-owner"> (${pt.owner_name})</span>`
                          : nothing}${pt.stock !== null && pt.stock !== undefined ? ` (${pt.stock}${pt.unit ? " " + pt.unit : ""})` : ""}</span
                      >
                    </label>
                    ${checked
                      ? html`<input class="used-part-qty" type="number" min="0.01" max="999" step="0.01"
                          .value=${String(link.quantity)}
                          @input=${(e: Event) => {
                            const v = parseFloat((e.target as HTMLInputElement).value);
                            this._usedParts = {
                              ...this._usedParts,
                              [key]: { ...base, quantity: Number.isFinite(v) && v >= 0.01 ? v : 1 },
                            };
                          }} />`
                      : nothing}
                  </div>`;
                })}
              </div>`
            : this.consumesInfo.length
              ? html`<div class="consumes-hint">
                  ${this.consumesInfo.map((line) => html`<div>${line}</div>`)}
                </div>`
              : nothing}
          ${this.restockDefault !== null
            ? html`
              <label class="field">
                <span class="field-label">${t("restock_quantity_label", L)}</span>
                <input type="number" step="0.01" min="0.01" class="field-input"
                  .value=${this._restockQty}
                  @input=${(e: Event) => (this._restockQty = (e.target as HTMLInputElement).value)} />
              </label>`
            : nothing}
          <!-- Native <input>s rather than <ha-textfield>: when this dialog
               is opened from a Lovelace card via dialog-mount, ha-textfield
               isn't yet registered (HA loads it lazily when its own panels
               need it) so the elements render with zero height and the user
               only sees the title + Cancel/Complete buttons — the original
               bug report. Native inputs always render. -->
          <label class="field">
            <span class="field-label">${t("notes_optional", L)}${this._req("notes")}</span>
            <input type="text" class="field-input"
              .value=${this._notes}
              @input=${(e: Event) => (this._notes = (e.target as HTMLInputElement).value)} />
          </label>
          <label class="field">
            <span class="field-label">${t("cost_optional", L)}${this._req("cost")}</span>
            <input type="number" step="0.01" min="0" class="field-input"
              .value=${this._cost}
              @input=${(e: Event) => (this._cost = (e.target as HTMLInputElement).value)} />
            ${this._renderCostSuggestion(L)}
          </label>
          <label class="field">
            <span class="field-label">${t("duration_minutes", L)}${this._req("duration")}</span>
            <input type="number" step="0.01" min="0" class="field-input"
              .value=${this._duration}
              @input=${(e: Event) => (this._duration = (e.target as HTMLInputElement).value)} />
          </label>
          <div class="field">
            <span class="field-label">${t("completed_at_optional", L)}</span>
            ${this._completedAt
              ? html`<ms-date-field
                  kind="datetime"
                  clearable
                  .hass=${this.hass}
                  .lang=${L}
                  .value=${this._completedAt}
                  @value-changed=${(e: CustomEvent) => (this._completedAt = e.detail.value as string)}
                ></ms-date-field>`
              : html`<button type="button" class="backdate-pick" @click=${this._pickCompletedAt}>
                  <ha-icon icon="mdi:calendar-clock"></ha-icon>${t("completed_at_pick", L)}
                </button>`}
          </div>
          <div class="field">
            <span class="field-label">${t("completion_photos_optional", L)}${this._req("photo")}</span>
            ${this._photos.length > 0
              ? html`<div class="photo-strip">
                  ${this._photos.map((p) => html`
                    <div class="photo-preview">
                      <img src=${p.preview} alt="" />
                      <button type="button" class="photo-remove" @click=${() => this._removePhoto(p.id)}
                        title="${t("remove", L)}">✕</button>
                    </div>`)}
                </div>`
              : nothing}
            ${this._photos.length < MAX_COMPLETION_PHOTOS
              ? html`<div class="photo-pickers">
                  <label class="photo-pick photo-pick-camera">
                    <ha-icon icon="mdi:camera"></ha-icon>
                    <span>${this._photoUploading ? t("uploading", L) : t("doc_camera", L)}</span>
                    <input type="file" accept="image/*" capture="environment"
                      ?disabled=${this._photoUploading}
                      @change=${this._onPhotoInput} />
                  </label>
                  <label class="photo-pick photo-pick-gallery">
                    <ha-icon icon="mdi:image-multiple"></ha-icon>
                    <span>${t("choose_photos", L)}</span>
                    <input type="file" accept="image/*" multiple
                      ?disabled=${this._photoUploading}
                      @change=${this._onPhotoInput} />
                  </label>
                </div>`
              : html`<div class="photo-limit">${t("photos_limit", L).replace("{max}", String(MAX_COMPLETION_PHOTOS))}</div>`}
          </div>
          ${this.adaptiveEnabled ? html`
            <div class="feedback-section">
              <label class="feedback-label">${t("was_maintenance_needed", L)}</label>
              <div class="feedback-buttons">
                <button
                  class="feedback-btn ${this._feedback === "needed" ? "selected" : ""}"
                  @click=${() => this._setFeedback("needed")}
                >${t("feedback_needed", L)}</button>
                <button
                  class="feedback-btn ${this._feedback === "not_needed" ? "selected" : ""}"
                  @click=${() => this._setFeedback("not_needed")}
                >${t("feedback_not_needed", L)}</button>
                <button
                  class="feedback-btn ${this._feedback === "not_sure" ? "selected" : ""}"
                  @click=${() => this._setFeedback("not_sure")}
                >${t("feedback_not_sure", L)}</button>
              </div>
            </div>
          ` : nothing}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${t("cancel", L)}
          </ha-button>
          <ha-button
            @click=${this._complete}
            .disabled=${this._loading || this._missingRequired.length > 0}
            title=${this._missingRequired.length
              ? this._missingRequired.map((f) => t("err_required", L).replace("{field}", t(REQUIRED_COMPLETION_LABELS[f] ?? f, L))).join(" · ")
              : ""}
          >
            ${this._loading ? t("completing", L) : t("complete", L)}
          </ha-button>
        </div>
      </ha-dialog>
    `;
  }

  static styles = [nativeFieldStyles, css`
    .req-mark {
      color: var(--error-color, #f44336);
      margin-left: 2px;
      font-weight: 600;
    }
    /* #104: one-click cost suggestion from parts — quiet link-style chip. */
    .cost-suggestion {
      align-self: flex-start;
      margin-top: 4px;
      padding: 0;
      border: none;
      background: none;
      color: var(--primary-color);
      font-size: 12.5px;
      cursor: pointer;
      text-decoration: underline dotted;
      text-underline-offset: 2px;
    }
    .dialog-title {
      font-size: 18px;
      font-weight: 500;
      padding-bottom: 12px;
    }
    .scan-required-note {
      margin: -4px 0 12px;
      padding: 8px 10px;
      border-radius: 6px;
      background: rgba(255, 152, 0, 0.12);
      color: var(--primary-text-color);
      font-size: 13px;
    }
    .phase-line {
      margin-top: -8px;
      padding-bottom: 12px;
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .content {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 300px;
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding-top: 16px;
    }
    .consumes-hint {
      font-size: 13px;
      color: var(--secondary-text-color);
      border-left: 3px solid var(--primary-color);
      padding: 4px 8px;
      margin: 4px 0 8px;
    }
    /* #99: editable per-completion parts selection */
    .used-parts { margin: 4px 0 8px; display: flex; flex-direction: column; gap: 4px; }
    .used-part-row { display: flex; align-items: center; gap: 8px; }
    .used-part-check {
      display: flex; align-items: center; gap: 6px; flex: 1;
      font-size: 13px; cursor: pointer;
    }
    .used-part-check input { cursor: pointer; }
    /* #111: whose stock this row draws on. Muted but never omitted — an
       unlabelled foreign pool is indistinguishable from an own part. */
    .used-part-owner { color: var(--secondary-text-color); }
    .used-part-qty {
      width: 76px; padding: 4px 6px; border-radius: 4px; font: inherit; font-size: 13px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
    }
    .error {
      color: var(--error-color, #f44336);
      font-size: 13px;
    }
    /* .field/.field-label/.field-input come from nativeFieldStyles */
    .photo-pick {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border: 1px dashed var(--divider-color);
      border-radius: 8px;
      cursor: pointer;
      font-size: 13px;
      color: var(--secondary-text-color);
      width: fit-content;
    }
    .photo-pick:hover { border-color: var(--primary-color); }
    /* #163: the backdate moment starts EMPTY (= now); the button seeds the
       HA date+time picker with the current minute instead of the picker's
       own 00:00 default, so a backdated completion never lands at midnight
       by accident. */
    .backdate-pick {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border: 1px dashed var(--divider-color);
      border-radius: 8px;
      background: transparent;
      cursor: pointer;
      font: inherit;
      font-size: 13px;
      color: var(--secondary-text-color);
      width: fit-content;
      --mdc-icon-size: 18px;
    }
    .backdate-pick:hover { border-color: var(--primary-color); }
    .photo-pick input[type="file"] { display: none; }
    /* #161: several photos per completion — tiles wrap into a strip,
       the two pickers (camera / gallery) sit underneath while there is
       room left under the cap. */
    .photo-pickers {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .photo-strip {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin: 8px 0; /* room for the remove badges above the tiles */
    }
    .photo-limit {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .photo-preview {
      position: relative;
      width: fit-content;
    }
    /* Uniform tiles: a tiny or portrait shot must not collapse the strip. */
    .photo-preview img {
      width: 96px;
      height: 96px;
      object-fit: cover;
      border-radius: 8px;
      display: block;
      background: var(--secondary-background-color, rgba(0,0,0,0.06));
    }
    .photo-remove {
      position: absolute;
      top: -8px;
      right: -8px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: none;
      background: var(--error-color, #db4437);
      color: #fff;
      cursor: pointer;
      font-size: 12px;
      line-height: 1;
    }
    .checklist-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 8px 0;
      border-bottom: 1px solid var(--divider-color);
      margin-bottom: 4px;
    }
    .checklist-label {
      font-weight: 500;
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .checklist-item {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      padding: 4px 0;
      font-size: 14px;
    }
    .checklist-item input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }
    .feedback-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 8px 0;
      border-top: 1px solid var(--divider-color);
    }
    .feedback-label {
      font-weight: 500;
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .feedback-buttons {
      display: flex;
      gap: 8px;
    }
    .feedback-btn {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font-size: 13px;
      cursor: pointer;
      text-align: center;
      transition: all 0.2s;
    }
    .feedback-btn:hover {
      background: var(--secondary-background-color, #f5f5f5);
    }
    .feedback-btn.selected {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      border-color: var(--primary-color);
    }
  `];
}

// Safe registration — avoids duplicate define when both panel and card load
if (!customElements.get("maintenance-complete-dialog")) {
  customElements.define("maintenance-complete-dialog", MaintenanceCompleteDialog);
}
