/** Dialog for editing an existing history entry (timestamp / notes / cost /
 *  duration / completed_by). Backed by maintenance_supporter/task/history/update.
 *
 *  Opened from:
 *    - Task detail page → history tab → Edit button per entry
 *    - Calendar past-window event click (via ll-custom dispatch from
 *      maintenance-supporter-calendar-card)
 */

import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { t } from "../styles";
import type { HomeAssistant } from "../types";
import { describeWsError } from "../ws-errors";

export interface HistoryEntryDraft {
  entry_id: string;
  task_id: string;
  original_timestamp: string;   // identifies the entry on save
  type: string;                  // for display only — read-only
  timestamp: string;
  notes: string | null;
  cost: number | null;
  duration: number | null;
  completed_by: string | null;
}

export class MaintenanceHistoryEditDialog extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private _open = false;
  @state() private _saving = false;
  @state() private _error = "";
  @state() private _draft: HistoryEntryDraft | null = null;

  // Original snapshot so we can detect "no change" and skip the WS call
  private _originalSnapshot: HistoryEntryDraft | null = null;

  private get _lang(): string {
    return this.hass?.language || "en";
  }

  /** Open the dialog with the given history-entry data. The caller must
   *  pass `original_timestamp` (the entry's current timestamp before edit)
   *  so the backend can find the entry. */
  public openEdit(draft: HistoryEntryDraft): void {
    this._draft = { ...draft };
    this._originalSnapshot = { ...draft };
    this._error = "";
    this._open = true;
  }

  public close(): void {
    this._open = false;
    this._error = "";
    this._draft = null;
    this._originalSnapshot = null;
  }

  private _set<K extends keyof HistoryEntryDraft>(
    key: K, value: HistoryEntryDraft[K],
  ): void {
    if (!this._draft) return;
    this._draft = { ...this._draft, [key]: value };
  }

  private async _save(): Promise<void> {
    if (!this._draft || !this._originalSnapshot) return;
    this._saving = true;
    this._error = "";
    try {
      const patch: Record<string, unknown> = {
        type: "maintenance_supporter/task/history/update",
        entry_id: this._draft.entry_id,
        task_id: this._draft.task_id,
        original_timestamp: this._originalSnapshot.original_timestamp,
      };
      // Only send fields that actually changed — keeps the patch minimal
      // and the WS schema happy (it treats missing as "no change").
      if (this._draft.timestamp !== this._originalSnapshot.timestamp) {
        patch.timestamp = this._draft.timestamp;
      }
      if (this._draft.notes !== this._originalSnapshot.notes) {
        patch.notes = this._draft.notes;
      }
      if (this._draft.cost !== this._originalSnapshot.cost) {
        patch.cost = this._draft.cost;
      }
      if (this._draft.duration !== this._originalSnapshot.duration) {
        patch.duration = this._draft.duration;
      }
      if (this._draft.completed_by !== this._originalSnapshot.completed_by) {
        patch.completed_by = this._draft.completed_by;
      }
      // Nothing changed → close without WS call
      const changedKeys = Object.keys(patch).filter(
        (k) => !["type", "entry_id", "task_id", "original_timestamp"].includes(k),
      );
      if (changedKeys.length === 0) {
        this.close();
        return;
      }
      await this.hass.connection.sendMessagePromise(patch);
      // Notify upstream so they can refresh
      this.dispatchEvent(
        new CustomEvent("history-entry-saved", {
          detail: {
            entry_id: this._draft.entry_id,
            task_id: this._draft.task_id,
            new_timestamp: this._draft.timestamp,
          },
          bubbles: true,
          composed: true,
        }),
      );
      this.close();
    } catch (e) {
      this._error = describeWsError(e, this._lang);
    } finally {
      this._saving = false;
    }
  }

  render() {
    if (!this._open || !this._draft) return nothing;
    const L = this._lang;
    const d = this._draft;
    return html`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        <h2>${t("history_edit_title", L) || "Edit history entry"}</h2>
        <div class="entry-type">
          <ha-icon icon="mdi:tag-outline"></ha-icon>
          <span>${t(d.type, L) || d.type}</span>
        </div>
        <label>
          <span>${t("history_edit_timestamp", L) || "Timestamp"}</span>
          <input type="datetime-local"
            .value=${d.timestamp.length >= 16 ? d.timestamp.slice(0, 16) : d.timestamp}
            @change=${(e: Event) => {
              const v = (e.target as HTMLInputElement).value;
              // Re-add seconds if input drops them
              this._set("timestamp", v.length === 16 ? `${v}:00` : v);
            }} />
        </label>
        <label>
          <span>${t("notes", L) || "Notes"}</span>
          <textarea
            rows="3"
            @input=${(e: Event) => {
              const v = (e.target as HTMLTextAreaElement).value;
              this._set("notes", v ? v : null);
            }}
            .value=${d.notes ?? ""}></textarea>
        </label>
        <div class="row">
          <label>
            <span>${t("cost", L) || "Cost"}</span>
            <input type="number" min="0" step="0.01"
              .value=${d.cost != null ? String(d.cost) : ""}
              @input=${(e: Event) => {
                const v = (e.target as HTMLInputElement).value;
                this._set("cost", v ? Number(v) : null);
              }} />
          </label>
          <label>
            <span>${t("duration", L) || "Duration (min)"}</span>
            <input type="number" min="0"
              .value=${d.duration != null ? String(d.duration) : ""}
              @input=${(e: Event) => {
                const v = (e.target as HTMLInputElement).value;
                this._set("duration", v ? Number(v) : null);
              }} />
          </label>
        </div>
        ${this._error ? html`<div class="error">${this._error}</div>` : nothing}
        <div class="actions">
          <button class="cancel" @click=${this.close} ?disabled=${this._saving}>
            ${t("cancel", L) || "Cancel"}
          </button>
          <button class="save" @click=${this._save} ?disabled=${this._saving}>
            ${this._saving ? (t("saving", L) || "Saving…") : (t("save", L) || "Save")}
          </button>
        </div>
      </div>
    `;
  }

  static styles = css`
    :host { display: contents; }
    .backdrop {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.5);
      z-index: 100;
    }
    .dialog {
      position: fixed; left: 50%; top: 50%;
      transform: translate(-50%, -50%);
      width: 95vw; max-width: 480px;
      background: var(--card-background-color, var(--ha-card-background, #1c1c1c));
      color: var(--primary-text-color);
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.4);
      padding: 20px;
      display: flex; flex-direction: column; gap: 12px;
      z-index: 101;
      max-height: 90vh; overflow: auto;
    }
    h2 { margin: 0; font-size: 18px; }
    .entry-type {
      display: flex; align-items: center; gap: 6px;
      color: var(--secondary-text-color); font-size: 13px;
    }
    label { display: flex; flex-direction: column; gap: 4px; font-size: 13px; }
    label span { color: var(--secondary-text-color); }
    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    input, textarea {
      padding: 8px; font-size: 14px;
      background: var(--secondary-background-color, #2c2c2c);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color, #444);
      border-radius: 6px;
      width: 100%; box-sizing: border-box;
      font-family: inherit;
    }
    .actions {
      display: flex; gap: 8px; justify-content: flex-end;
      margin-top: 8px;
    }
    button {
      padding: 8px 16px; font-size: 14px;
      border-radius: 6px; cursor: pointer;
      border: none; font-weight: 500;
    }
    button.cancel {
      background: transparent;
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color);
    }
    button.save {
      background: var(--primary-color);
      color: var(--text-primary-color, white);
    }
    button[disabled] { opacity: 0.5; cursor: wait; }
    .error {
      color: var(--error-color, #d32f2f);
      font-size: 13px; padding: 8px;
      background: rgba(211,47,47,0.1);
      border-radius: 6px;
    }
  `;
}

if (!customElements.get("maintenance-history-edit-dialog")) {
  customElements.define(
    "maintenance-history-edit-dialog",
    MaintenanceHistoryEditDialog,
  );
}
