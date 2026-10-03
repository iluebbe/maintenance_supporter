/** Several tasks changed at once (discussion #199): who is assigned, their
 *  labels, and the few settings that make sense in bulk.
 *
 *  The dialog only collects the change. The panel sends it with
 *  `tasks/update_many` (one write and one reload per object) and offers the
 *  undo — the same orchestration as the bulk bar's other actions. */

import { css, html, LitElement, nothing } from "lit";
import { property, state } from "lit/decorators.js";

import { langOf, t } from "../styles";
import "./ms-textfield";
import type { HAUser, HomeAssistant, TaskRow } from "../types";

export type BulkMode = "assign" | "labels" | "edit";
export type BulkChanges = Record<string, unknown>;

const ROTATIONS = ["round_robin", "least_completed", "random"] as const;
const PRIORITIES = ["low", "normal", "high"] as const;
const WARNING_DAYS_MAX = 365;

export class MaintenanceBulkEditDialog extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private _open = false;
  @state() private _mode: BulkMode = "assign";
  @state() private _count = 0;
  @state() private _users: HAUser[] = [];
  @state() private _present: string[] = [];
  // Assign
  @state() private _assignKind: "one" | "rotate" = "one";
  @state() private _person = "";
  @state() private _pool: Set<string> = new Set();
  @state() private _rotation: string = ROTATIONS[0];
  // Labels
  @state() private _addText = "";
  @state() private _remove: Set<string> = new Set();
  // Edit
  @state() private _setWarning = false;
  @state() private _warning = 7;
  @state() private _setPriority = false;
  @state() private _priority = "normal";
  @state() private _setMute = false;
  @state() private _mute = false;

  private _resolve: ((value: BulkChanges | null) => void) | null = null;

  private get _lang(): string {
    return langOf(this.hass);
  }

  /** Ask for the change; resolves with it, or null when cancelled. */
  public open(mode: BulkMode, rows: TaskRow[], users: HAUser[]): Promise<BulkChanges | null> {
    this._resolve?.(null);
    this._mode = mode;
    this._count = rows.length;
    this._users = [...users].sort((a, b) => a.name.localeCompare(b.name));
    this._present = [...new Set(rows.flatMap((r) => r.labels || []))].sort((a, b) => a.localeCompare(b));
    this._assignKind = "one";
    this._person = "";
    this._pool = new Set();
    this._rotation = ROTATIONS[0];
    this._addText = "";
    this._remove = new Set();
    this._setWarning = false;
    this._warning = 7;
    this._setPriority = false;
    this._priority = "normal";
    this._setMute = false;
    this._mute = false;
    this._open = true;
    return new Promise((resolve) => {
      this._resolve = resolve;
    });
  }

  private _finish(value: BulkChanges | null): void {
    this._open = false;
    const resolve = this._resolve;
    this._resolve = null;
    resolve?.(value);
  }

  /** The change to send, or null while there is nothing to change. */
  public changes(): BulkChanges | null {
    if (this._mode === "assign") {
      if (this._assignKind === "one") {
        // One person (or nobody) replaces a rotation too.
        return { responsible_user_id: this._person || null, assignee_pool: null, rotation_strategy: null };
      }
      const pool = this._users.map((u) => u.id).filter((id) => this._pool.has(id));
      if (pool.length < 2) return null;
      // The backend seeds the first person on duty.
      return { assignee_pool: pool, rotation_strategy: this._rotation, responsible_user_id: null };
    }
    if (this._mode === "labels") {
      const add = [...new Set(this._addText.split(",").map((s) => s.trim()).filter(Boolean))];
      const remove = [...this._remove];
      return add.length || remove.length ? { labels_add: add, labels_remove: remove } : null;
    }
    const out: BulkChanges = {};
    if (this._setWarning) out.warning_days = this._warning;
    if (this._setPriority) out.priority = this._priority;
    if (this._setMute) out.notify_enabled = !this._mute;
    return Object.keys(out).length ? out : null;
  }

  private _toggle(set: Set<string>, key: string): Set<string> {
    const next = new Set(set);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    return next;
  }

  private _renderAssign(L: string) {
    return html`
      <div class="hint">${t("bulk_assign_hint", L)}</div>
      <label class="choice">
        <input type="radio" name="kind" .checked=${this._assignKind === "one"} @change=${() => (this._assignKind = "one")} />
        ${t("bulk_assign_one", L)}
      </label>
      ${this._assignKind === "one"
        ? html`<select class="person" .value=${this._person} @change=${(e: Event) => (this._person = (e.target as HTMLSelectElement).value)}>
            <option value="" ?selected=${!this._person}>${t("unassigned", L)}</option>
            ${this._users.map((u) => html`<option value=${u.id} ?selected=${this._person === u.id}>${u.name}</option>`)}
          </select>`
        : nothing}
      <label class="choice">
        <input type="radio" name="kind" .checked=${this._assignKind === "rotate"} @change=${() => (this._assignKind = "rotate")} />
        ${t("bulk_assign_rotate", L)}
      </label>
      ${this._assignKind === "rotate"
        ? html`<div class="pool">
              ${this._users.map(
                (u) => html`<label class="row">
                  <input type="checkbox" .checked=${this._pool.has(u.id)} @change=${() => (this._pool = this._toggle(this._pool, u.id))} />
                  ${u.name}
                </label>`,
              )}
            </div>
            <label class="field">
              <span>${t("rotation_strategy", L)}</span>
              <select class="rotation" .value=${this._rotation} @change=${(e: Event) => (this._rotation = (e.target as HTMLSelectElement).value)}>
                ${ROTATIONS.map((r) => html`<option value=${r} ?selected=${this._rotation === r}>${t(`rotation_${r}`, L)}</option>`)}
              </select>
            </label>
            ${this._pool.size < 2 ? html`<div class="hint">${t("bulk_rotation_min_two", L)}</div>` : nothing}`
        : nothing}
    `;
  }

  private _renderLabels(L: string) {
    return html`
      <ms-textfield
        class="labels-add"
        label=${t("bulk_labels_add", L)}
        .helper=${t("labels_help", L)}
        .value=${this._addText}
        @input=${(e: Event) => (this._addText = (e.target as HTMLInputElement).value)}
      ></ms-textfield>
      ${this._present.length
        ? html`<div class="section-title">${t("bulk_labels_remove", L)}</div>
            <div class="pool">
              ${this._present.map(
                (label) => html`<label class="row">
                  <input type="checkbox" .checked=${this._remove.has(label)} @change=${() => (this._remove = this._toggle(this._remove, label))} />
                  ${label}
                </label>`,
              )}
            </div>`
        : nothing}
    `;
  }

  private _renderEdit(L: string) {
    return html`
      <div class="hint">${t("bulk_edit_hint", L)}</div>
      <div class="row edit-row">
        <input type="checkbox" class="set-warning" .checked=${this._setWarning} @change=${(e: Event) => (this._setWarning = (e.target as HTMLInputElement).checked)} />
        <span class="grow">${t("warning_days", L)}</span>
        <input type="number" class="warning" min="0" max=${WARNING_DAYS_MAX} .value=${String(this._warning)} ?disabled=${!this._setWarning}
          @change=${(e: Event) => {
            const v = parseInt((e.target as HTMLInputElement).value, 10);
            this._warning = Number.isInteger(v) ? Math.min(Math.max(v, 0), WARNING_DAYS_MAX) : this._warning;
          }} />
      </div>
      <div class="row edit-row">
        <input type="checkbox" class="set-priority" .checked=${this._setPriority} @change=${(e: Event) => (this._setPriority = (e.target as HTMLInputElement).checked)} />
        <span class="grow">${t("priority", L)}</span>
        <select class="priority" .value=${this._priority} ?disabled=${!this._setPriority} @change=${(e: Event) => (this._priority = (e.target as HTMLSelectElement).value)}>
          ${PRIORITIES.map((p) => html`<option value=${p} ?selected=${this._priority === p}>${t(`priority_${p}`, L)}</option>`)}
        </select>
      </div>
      <div class="row edit-row">
        <input type="checkbox" class="set-mute" .checked=${this._setMute} @change=${(e: Event) => (this._setMute = (e.target as HTMLInputElement).checked)} />
        <span class="grow">${t("bulk_no_notifications", L)}</span>
        <input type="checkbox" class="mute" .checked=${this._mute} ?disabled=${!this._setMute} @change=${(e: Event) => (this._mute = (e.target as HTMLInputElement).checked)} />
      </div>
    `;
  }

  render() {
    if (!this._open) return html``;
    const L = this._lang;
    const heading = this._mode === "assign" ? t("bulk_assign", L) : this._mode === "labels" ? t("labels", L) : t("edit", L);
    const ready = this.changes() !== null;
    // The title is our own element: Home Assistant's dialog draws no
    // `heading` (the other dialogs here render theirs the same way).
    return html`
      <ha-dialog open @closed=${() => this._finish(null)}>
        <div class="dialog-title">${heading}</div>
        <div class="content">
          <div class="count">${t("bulk_n_selected", L).replace("{n}", String(this._count))}</div>
          ${this._mode === "assign" ? this._renderAssign(L) : this._mode === "labels" ? this._renderLabels(L) : this._renderEdit(L)}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${() => this._finish(null)}>${t("cancel", L)}</ha-button>
          <ha-button class="apply" .disabled=${!ready} @click=${() => this._finish(this.changes())}>${t("save", L)}</ha-button>
        </div>
      </ha-dialog>
    `;
  }

  static styles = css`
    .dialog-title { font-size: 18px; font-weight: 500; padding-bottom: 12px; }
    .content {
      display: flex;
      flex-direction: column;
      gap: 10px;
      min-width: min(360px, calc(100vw - 24px));
      max-width: 520px;
      max-height: 60vh;
      overflow-y: auto;
    }
    @media (max-width: 600px) {
      .content { min-width: 0; max-width: none; max-height: none; }
    }
    .count, .hint { color: var(--secondary-text-color); font-size: 13px; }
    .section-title {
      font-size: 14px;
      font-weight: 500;
      padding-bottom: 4px;
      border-bottom: 1px solid var(--divider-color);
    }
    .choice, .row { display: flex; align-items: center; gap: 8px; font-size: 14px; cursor: pointer; }
    .pool { display: flex; flex-direction: column; gap: 4px; padding-left: 26px; }
    .field { display: flex; align-items: center; gap: 8px; justify-content: space-between; font-size: 14px; }
    .grow { flex: 1; min-width: 0; }
    select, input[type="number"] {
      font: inherit;
      padding: 4px 6px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      max-width: 100%;
    }
    input[type="number"] { width: 72px; }
    select.person { margin-left: 26px; }
    .dialog-actions { display: flex; justify-content: flex-end; gap: 8px; padding-top: 16px; }
  `;
}

if (!customElements.get("maintenance-bulk-edit-dialog")) {
  customElements.define("maintenance-bulk-edit-dialog", MaintenanceBulkEditDialog);
}
