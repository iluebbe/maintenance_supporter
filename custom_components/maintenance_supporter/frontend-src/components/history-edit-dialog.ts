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
import { t, langOf } from "../styles";
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
  // #130: the entry's recorded part consumption ({part_id, name, quantity,
  // entry_id? for pooled parts}); absent/empty = nothing consumed.
  used_parts?: Array<{ part_id: string; name?: string; quantity: number; entry_id?: string }> | null;
}

/** One selectable part option in the edit dialog — the object's own parts
 *  plus pooled parts this task links to, fetched via parts/overview. */
interface PartOption {
  part_id: string;
  name: string;
  entry_id: string;      // owning object
  foreign: boolean;      // pooled (#111) — carried into the saved link
  object_name: string | null;
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
    return langOf(this.hass);
  }

  // #130: selectable parts + the edited selection (part key -> quantity;
  // 0/absent = not consumed). Key = `${entry_id}:${part_id}` (pool-safe).
  @state() private _partOptions: PartOption[] | null = null;
  @state() private _partQty: Record<string, number> = {};
  private _partQtyOriginal = "";

  /** Open the dialog with the given history-entry data. The caller must
   *  pass `original_timestamp` (the entry's current timestamp before edit)
   *  so the backend can find the entry. */
  public openEdit(draft: HistoryEntryDraft): void {
    this._draft = { ...draft };
    this._originalSnapshot = { ...draft };
    this._error = "";
    this._open = true;
    this._partOptions = null;
    this._partQty = {};
    this._partQtyOriginal = "";
    void this._loadPartOptions();
  }

  /** The object's own parts + pooled parts this task draws on — from the
   *  instance-wide overview so pooled owners resolve without extra calls. */
  private async _loadPartOptions(): Promise<void> {
    const draft = this._draft;
    if (!draft) return;
    try {
      const result = await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/parts/overview",
      }) as {
        parts: Array<{
          part_id: string; name: string; entry_id: string; object_name: string | null;
          consumers: Array<{ entry_id: string; task_id: string }>;
        }>;
      };
      const options: PartOption[] = [];
      for (const row of result.parts || []) {
        const own = row.entry_id === draft.entry_id;
        const linked = row.consumers.some((c) => c.entry_id === draft.entry_id && c.task_id === draft.task_id);
        if (!own && !linked) continue;
        options.push({
          part_id: row.part_id,
          name: row.name,
          entry_id: row.entry_id,
          foreign: !own,
          object_name: row.object_name,
        });
      }
      // Recorded parts whose catalog entry vanished stay selectable so a
      // correction can still zero them out.
      for (const link of draft.used_parts || []) {
        const owner = link.entry_id || draft.entry_id;
        if (!options.some((o) => o.part_id === link.part_id && o.entry_id === owner)) {
          options.push({
            part_id: link.part_id,
            name: link.name || link.part_id,
            entry_id: owner,
            foreign: owner !== draft.entry_id,
            object_name: null,
          });
        }
      }
      const qty: Record<string, number> = {};
      for (const link of draft.used_parts || []) {
        qty[`${link.entry_id || draft.entry_id}:${link.part_id}`] = link.quantity ?? 1;
      }
      this._partOptions = options;
      this._partQty = qty;
      this._partQtyOriginal = this._partSelectionKey();
    } catch {
      this._partOptions = [];  // parts UI unavailable — the rest still edits
    }
  }

  private _partSelectionKey(): string {
    return JSON.stringify(
      Object.entries(this._partQty)
        .filter(([, q]) => q > 0)
        .sort(([a], [b]) => a.localeCompare(b)),
    );
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
      // #130: send the parts selection only when it actually changed — the
      // backend reconciles stock by the delta, so a no-op must stay silent.
      if (this._partOptions !== null && this._partSelectionKey() !== this._partQtyOriginal) {
        patch.used_parts = (this._partOptions || [])
          .filter((o) => (this._partQty[`${o.entry_id}:${o.part_id}`] || 0) > 0)
          .map((o) => ({
            part_id: o.part_id,
            quantity: this._partQty[`${o.entry_id}:${o.part_id}`],
            ...(o.foreign ? { entry_id: o.entry_id } : {}),
          }));
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
          <span>${t("notes_label", L)}</span>
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
        ${this._partOptions && this._partOptions.length > 0 ? html`
          <div class="parts-block">
            <span class="parts-title">${t("complete_parts_used", L)}</span>
            ${this._partOptions.map((o) => {
              const key = `${o.entry_id}:${o.part_id}`;
              const qty = this._partQty[key] || 0;
              return html`
                <label class="part-row-edit">
                  <input type="checkbox" .checked=${qty > 0}
                    @change=${(e: Event) => {
                      const on = (e.target as HTMLInputElement).checked;
                      this._partQty = { ...this._partQty, [key]: on ? 1 : 0 };
                    }} />
                  <span class="part-label">${o.name}${o.foreign && o.object_name ? ` (${o.object_name})` : ""}</span>
                  ${qty > 0 ? html`
                    <input class="part-qty" type="number" min="0.01" max="999" step="0.01"
                      .value=${String(qty)}
                      @input=${(e: Event) => {
                        const v = parseFloat((e.target as HTMLInputElement).value);
                        if (!isNaN(v) && v > 0) this._partQty = { ...this._partQty, [key]: v };
                      }} />
                  ` : nothing}
                </label>
              `;
            })}
          </div>
        ` : nothing}
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
    /* #130: parts on the entry */
    .parts-block {
      display: flex; flex-direction: column; gap: 6px;
      border: 1px solid var(--divider-color, #444);
      border-radius: 6px; padding: 8px;
    }
    .parts-title { color: var(--secondary-text-color); font-size: 13px; }
    .part-row-edit {
      display: flex; flex-direction: row; align-items: center; gap: 8px;
      font-size: 14px;
    }
    .part-row-edit input[type="checkbox"] { width: auto; }
    .part-label { flex: 1; color: var(--primary-text-color); }
    .part-qty { width: 76px; }
  `;
}

if (!customElements.get("maintenance-history-edit-dialog")) {
  customElements.define(
    "maintenance-history-edit-dialog",
    MaintenanceHistoryEditDialog,
  );
}
