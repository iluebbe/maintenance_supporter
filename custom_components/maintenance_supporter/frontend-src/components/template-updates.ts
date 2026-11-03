/** What an object's template has learned since (D#85, 2.118): a line on the
 *  object page when the template changed a task since the object was made
 *  from it, or gained a task, and the dialog to take the changes over.
 *
 *  The server says what is offered (websocket/template_updates.py): only
 *  fields the template changed, each marked when the user changed it too.
 *  Those are unticked; the rest are ticked. Applying sends a yes or no per
 *  offer, and a no is not offered again. */

import { css, html, LitElement, nothing } from "lit";
import { property, state } from "lit/decorators.js";

import type { HomeAssistant } from "../types";
import { countText, formatRecurrence, formatUnit, langOf, monthName, t } from "../styles";
import { headerTitle, titleLine } from "../helpers/beta-ui";
import { checkField } from "../helpers/check-field";
import { notice } from "../helpers/notice";
import { haToast } from "../helpers/toast";
import { runWs } from "../helpers/ws-run";

type Field = "name" | "notes" | "recurrence" | "warning_days";

interface Schedule {
  kind?: string; every?: number | null; unit?: string; season_months?: number[];
  weekdays?: number[]; nth?: number; weekday?: number; day?: number; months?: number[];
}

export interface TemplateChange {
  task_id: string;
  task_name: string;
  field: Field;
  conflict: boolean;
  before: unknown;
  after: unknown;
}

export interface TemplateNewTask {
  key: string;
  name: string;
  notes?: string | null;
  schedule?: Schedule | null;
  warning_days?: number | null;
}

export interface TemplateUpdates {
  template_id: string | null;
  template_name: string | null;
  changes: TemplateChange[];
  new_tasks: TemplateNewTask[];
}

/** The panel's label of each field. */
const FIELD_LABELS: Record<Field, string> = {
  name: "name",
  notes: "notes_label",
  recurrence: "task_section_schedule",
  warning_days: "warning_days",
};

const changeId = (c: TemplateChange) => `${c.task_id}|${c.field}`;
const newId = (n: TemplateNewTask) => `new|${n.key}`;

/** A recurrence as the task page says it, with its season window. */
export function recurrenceText(s: Schedule | null | undefined, lang: string): string {
  const base = formatRecurrence({ schedule: s ?? null }, lang);
  const months = s?.season_months || [];
  return months.length ? `${base} · ${[...months].sort((a, b) => a - b).map((m) => monthName(m - 1, lang, "short")).join(", ")}` : base;
}

export class MaintenanceTemplateUpdates extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  /** The object; "" (the idle warm-up's copy of the page) asks nothing. */
  @property({ attribute: false }) public entryId = "";
  @state() private _updates: TemplateUpdates | null = null;
  @state() private _open = false;
  @state() private _busy = false;
  @state() private _error = "";
  @state() private _picked = new Set<string>();

  private get _lang(): string {
    return langOf(this.hass);
  }

  protected updated(changed: Map<string, unknown>): void {
    if (changed.has("entryId")) void this._load();
  }

  private async _load(): Promise<void> {
    const id = this.entryId;
    this._updates = null;
    if (!id || !this.hass) return;
    try {
      const got = (await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/template_updates",
        entry_id: id,
        language: this.hass.language,
      })) as TemplateUpdates;
      if (this.entryId === id) this._updates = got;
    } catch {
      // An older server without the command, or a reload in between:
      // nothing to offer.
    }
  }

  private get _count(): number {
    return this._updates ? this._updates.changes.length + this._updates.new_tasks.length : 0;
  }

  private _openDialog(): void {
    const u = this._updates;
    if (!u) return;
    this._picked = new Set([...u.changes.filter((c) => !c.conflict).map(changeId), ...u.new_tasks.map(newId)]);
    this._error = "";
    this._open = true;
  }

  private _toggle(id: string, on: boolean): void {
    const next = new Set(this._picked);
    if (on) next.add(id); else next.delete(id);
    this._picked = next;
  }

  private async _apply(): Promise<void> {
    const u = this._updates;
    if (!u) return;
    const done = await runWs(this, {
      type: "maintenance_supporter/template_updates/apply",
      entry_id: this.entryId,
      changes: u.changes.map((c) => ({ task_id: c.task_id, field: c.field, accept: this._picked.has(changeId(c)) })),
      new_tasks: u.new_tasks.map((n) => ({ key: n.key, accept: this._picked.has(newId(n)) })),
    }, {
      busy: (b) => { this._busy = b; },
      fallbackKey: "save_error",
      onError: (m) => { this._error = m; },
    });
    if (done === undefined) return;
    this._open = false;
    haToast(this, t("template_updates_done", this._lang));
    this.dispatchEvent(new CustomEvent("template-updates-applied", { bubbles: true, composed: true }));
    await this._load();
  }

  private _value(field: Field, value: unknown): string {
    const L = this._lang;
    if (field === "recurrence") return recurrenceText(value as Schedule, L);
    if (field === "warning_days") return formatUnit(Number(value), "day", L);
    return typeof value === "string" && value ? value : field === "notes" ? t("template_updates_no_notes", L) : "—";
  }

  private _renderChange(c: TemplateChange) {
    const L = this._lang;
    return checkField({
      cls: `tpl-change${c.conflict ? " conflict" : ""}`,
      checked: this._picked.has(changeId(c)),
      onChange: (e: Event) => this._toggle(changeId(c), (e.target as HTMLInputElement).checked),
    }, html`<span class="tpl-change-text">
      <span class="tpl-field">${t(FIELD_LABELS[c.field], L)}</span>
      <span class="tpl-values ${c.field}">
        <span class="tpl-before">${this._value(c.field, c.before)}</span>
        <span class="tpl-arrow" aria-hidden="true">→</span>
        <span class="tpl-after">${this._value(c.field, c.after)}</span>
      </span>
      ${c.conflict ? html`<span class="tpl-conflict">${t("template_updates_conflict", L)}</span>` : nothing}
    </span>`);
  }

  private _renderDialog() {
    const u = this._updates;
    if (!this._open || !u) return nothing;
    const L = this._lang;
    const byTask = new Map<string, TemplateChange[]>();
    for (const c of u.changes) byTask.set(c.task_id, [...(byTask.get(c.task_id) || []), c]);
    const title = t("template_updates_title", L);
    return html`
      <ha-dialog open .headerTitle=${headerTitle(title)} @closed=${() => { this._open = false; }}>
        ${titleLine(title)}
        <div class="content">
          <p class="hint">${t("template_updates_hint", L)}</p>
          ${this._error ? notice("error", this._error) : nothing}
          ${[...byTask.values()].map((changes) => html`
            <div class="tpl-task">
              <div class="tpl-task-name">${changes[0].task_name}</div>
              ${changes.map((c) => this._renderChange(c))}
            </div>`)}
          ${u.new_tasks.length ? html`
            <div class="tpl-task tpl-new">
              <div class="tpl-task-name">${t("template_updates_new_tasks", L)}</div>
              ${u.new_tasks.map((n) => checkField({
                cls: "tpl-change tpl-new-task",
                checked: this._picked.has(newId(n)),
                onChange: (e: Event) => this._toggle(newId(n), (e.target as HTMLInputElement).checked),
              }, html`<span class="tpl-change-text">
                <span class="tpl-new-name">${n.name}</span>
                <span class="tpl-values">${recurrenceText(n.schedule, L)}</span>
              </span>`))}
            </div>` : nothing}
        </div>
        <div class="dialog-actions">
          <div class="spacer"></div>
          <ha-button appearance="plain" @click=${() => { this._open = false; }}>${t("template_updates_later", L)}</ha-button>
          <ha-button class="tpl-apply" @click=${() => void this._apply()} .disabled=${this._busy}>
            ${this._busy ? t("saving", L) : t("apply_suggestion", L)}
          </ha-button>
        </div>
      </ha-dialog>
    `;
  }

  render() {
    const u = this._updates;
    const n = this._count;
    if (!u || !n) return nothing;
    const L = this._lang;
    const line = countText("template_updates_banner", "template_updates_banner_one", n, L).replace("{template}", u.template_name || "");
    return html`
      <div class="tpl-banner" role="status">
        <ha-icon icon="mdi:file-replace-outline"></ha-icon>
        <span class="tpl-banner-text">${line}</span>
        <ha-button appearance="plain" class="tpl-review" @click=${() => this._openDialog()}>${t("template_updates_review", L)}</ha-button>
      </div>
      ${this._renderDialog()}
    `;
  }

  static styles = css`
    :host { display: block; }
    .tpl-banner {
      display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
      margin: 8px 0 12px; padding: 8px 12px;
      border-radius: var(--ha-card-border-radius, 12px);
      background: var(--secondary-background-color);
      color: var(--primary-text-color); font-size: 14px;
    }
    .tpl-banner ha-icon { color: var(--primary-color); --mdc-icon-size: 20px; flex: none; }
    .tpl-banner-text { flex: 1 1 200px; min-width: 0; overflow-wrap: anywhere; }
    .dialog-title { font-size: 18px; font-weight: 500; padding-bottom: 12px; }
    .content { min-width: min(320px, 100%); max-width: 560px; }
    .hint { color: var(--secondary-text-color); font-size: 13px; margin: 0 0 12px; }
    .tpl-task { margin: 0 0 14px; }
    .tpl-task-name { font-weight: 500; margin-bottom: 4px; overflow-wrap: anywhere; }
    .tpl-change { display: flex; align-items: flex-start; gap: 8px; padding: 4px 0; }
    .tpl-change-text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
    .tpl-field { font-size: 12px; color: var(--secondary-text-color); }
    .tpl-values { font-size: 14px; overflow-wrap: anywhere; }
    .tpl-values.notes { white-space: pre-wrap; max-height: 9em; overflow: auto; }
    .tpl-before { color: var(--secondary-text-color); text-decoration: line-through; }
    .tpl-arrow { margin: 0 4px; color: var(--secondary-text-color); }
    .tpl-conflict { font-size: 12px; color: var(--warning-color, #ff9800); }
    .dialog-actions { display: flex; align-items: center; gap: 8px; padding-top: 16px; }
    .spacer { flex: 1; }
  `;
}

if (!customElements.get("maintenance-template-updates")) {
  customElements.define("maintenance-template-updates", MaintenanceTemplateUpdates);
}
