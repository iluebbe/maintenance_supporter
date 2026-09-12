/** Object lifecycle history section (#138) — the object detail's cross-task
 * "service booklet": every lifecycle entry of every task, merged and sorted
 * chronologically, with date-range + task filters and a printable service
 * record (blob tab → print / save as PDF).
 *
 * The objects list response carries only each task's recent history window,
 * so on first use the section fetches every task's FULL history in parallel
 * (`maintenance_supporter/task/history`) and merges from that.
 */

import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { t, ensureLocale, langOf, formatDate, formatDateTime, formatCost, formatNumber, formatRecurrence } from "../styles";
import {
  filterObjectHistory,
  mergeObjectHistory,
  objectHistoryTotals,
  type ObjectHistoryEntry,
} from "../helpers/object-history";
import {
  buildServiceRecordHtml,
  DEFAULT_INCLUDE,
  type ServiceRecordInclude,
  type ServiceRecordLabels,
  type ServiceRecordLayout,
  type ServiceRecordPhoto,
  type ServiceRecordTask,
} from "../helpers/service-record";
import { openHtmlInNewTab, signDocumentPath } from "../helpers/document-url";
import { objectRef, taskRef } from "../helpers/reference";
import { LS_KEYS, lsGet, lsSet } from "../helpers/storage-keys";
import "./ms-date-field";
import type { HistoryEntry, HomeAssistant, MaintenanceObject, MaintenanceTask } from "../types";

/** Mirrors the backend's per-task history retention cap — a full history of
 * exactly this length has probably been trimmed, which the record must say. */
const HISTORY_RETENTION_CAP = 500;
/** Photos signed for one booklet — one WS call each; beyond this, names only. */
const MAX_BOOKLET_PHOTOS = 60;

export class MaintenanceObjectHistorySection extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property() public entryId = "";
  @property({ attribute: false }) public object: MaintenanceObject | null = null;
  @property({ attribute: false }) public tasks: MaintenanceTask[] = [];
  @property() public currencySymbol = "€";
  /** Resolves a user id to a display name; null hides the credit line — a
   *  raw UUID on a printed service record is noise, not information. */
  @property({ attribute: false }) public userName: (id: string) => string | null = () => null;

  @state() private _full: Record<string, HistoryEntry[]> = {};
  @state() private _loading = false;
  @state() private _filterTask = "";
  @state() private _from = "";
  @state() private _to = "";
  @state() private _expanded = false;
  // #170: the print options panel (layout + what lands on paper), remembered
  // per browser so the second booklet needs one click.
  @state() private _printOpen = false;
  @state() private _printLayout: ServiceRecordLayout = "chronological";
  @state() private _printInclude: ServiceRecordInclude = { ...DEFAULT_INCLUDE };
  @state() private _printing = false;

  private _loadedFor: string | null = null;
  private _localeReady = false;

  connectedCallback(): void {
    super.connectedCallback();
    try {
      const saved = JSON.parse(lsGet(LS_KEYS.printOptions) || "null") as { layout?: ServiceRecordLayout; include?: Partial<ServiceRecordInclude> } | null;
      if (saved?.layout === "by_task" || saved?.layout === "chronological") this._printLayout = saved.layout;
      if (saved?.include && typeof saved.include === "object") this._printInclude = { ...DEFAULT_INCLUDE, ...saved.include };
    } catch { /* corrupt or absent → defaults */ }
  }

  private _savePrintOptions(): void {
    lsSet(LS_KEYS.printOptions, JSON.stringify({ layout: this._printLayout, include: this._printInclude }));
  }

  private _toggleInclude(key: keyof ServiceRecordInclude, on: boolean): void {
    this._printInclude = { ...this._printInclude, [key]: on };
    this._savePrintOptions();
  }

  private get _lang(): string {
    return langOf(this.hass);
  }

  updated(changed: Map<string, unknown>): void {
    super.updated(changed);
    if (!this._localeReady && this.hass) {
      this._localeReady = true;
      void ensureLocale(this._lang).then(() => this.requestUpdate());
    }
    if (this.entryId && this._loadedFor !== this.entryId) {
      this._loadedFor = this.entryId;
      this._full = {};
      this._filterTask = "";
      this._from = "";
      this._to = "";
      void this._loadFullHistories();
    }
  }

  /** Fetch every task's full history in parallel; tasks whose fetch fails
   *  keep their (windowed) list-response history — degraded, never empty. */
  private async _loadFullHistories(): Promise<void> {
    const entryId = this.entryId;
    const tasks = this.tasks;
    if (!tasks.length) return;
    this._loading = true;
    const results = await Promise.all(
      tasks.map(async (task) => {
        try {
          const res = (await this.hass.connection.sendMessagePromise({
            type: "maintenance_supporter/task/history",
            entry_id: entryId,
            task_id: task.id,
          })) as { history?: HistoryEntry[] };
          return [task.id, res.history ?? []] as const;
        } catch {
          return [task.id, task.history ?? []] as const;
        }
      }),
    );
    if (this.entryId !== entryId) return; // navigated away meanwhile
    this._full = Object.fromEntries(results);
    this._loading = false;
  }

  private get _entries(): ObjectHistoryEntry[] {
    return mergeObjectHistory(
      this.tasks.map((task) => ({
        id: task.id,
        name: task.name,
        history: this._full[task.id] ?? task.history ?? [],
        ref_no: task.ref_no,
        reading_unit: task.reading_unit,
      })),
    );
  }

  private get _capped(): boolean {
    return Object.values(this._full).some((h) => h.length >= HISTORY_RETENTION_CAP);
  }

  private _openTask(taskId: string): void {
    this.dispatchEvent(new CustomEvent("open-task", { detail: { taskId }, bubbles: true, composed: true }));
  }

  /** #170: everything the booklet prints beyond the entries — linked
   *  documents per task, signed photo urls (short-lived, the sheet renders
   *  right away), QR codes per task — each best-effort: a failed lookup
   *  degrades to "no photo / no QR", never to no booklet. */
  private async _bookletData(filtered: ReadonlyArray<ObjectHistoryEntry>): Promise<{ tasks: ServiceRecordTask[]; photos: Record<string, ServiceRecordPhoto> }> {
    const inc = this._printInclude;
    const L = this._lang;
    let docs: Array<{ id: string; title?: string | null; filename?: string | null; tags?: string[] | null; task_ids?: string[] | null; task_pages?: Record<string, number> | null }> = [];
    if (inc.documents || inc.photos) {
      try {
        const res = (await this.hass.connection.sendMessagePromise({ type: "maintenance_supporter/documents/list", entry_id: this.entryId })) as { documents?: typeof docs };
        docs = res.documents || [];
      } catch { docs = []; }
    }
    const qr = new Map<string, string>();
    if (inc.qr && this._printLayout === "by_task") {
      await Promise.all(this.tasks.map(async (task) => {
        try {
          const res = (await this.hass.connection.sendMessagePromise({ type: "maintenance_supporter/qr/generate", entry_id: this.entryId, task_id: task.id, url_mode: "server", action: "view" })) as { svg_data_uri?: string };
          if (res.svg_data_uri) qr.set(task.id, res.svg_data_uri);
        } catch { /* no QR for this task */ }
      }));
    }
    const tasks: ServiceRecordTask[] = this.tasks.map((task) => ({
      id: task.id,
      name: task.name,
      ref: taskRef(this.object, task),
      schedule: formatRecurrence(task, L) || null,
      // Completion photos are linked to their task too — they print as photos
      // under the entry, not as "linked documents" of the task.
      documents: docs
        .filter((d) => (d.task_ids || []).includes(task.id) && !(d.tags || []).includes("photo"))
        .map((d) => ({ title: d.title || d.filename || "", page: d.task_pages?.[task.id] ?? null })),
      qrDataUri: qr.get(task.id) ?? null,
    }));
    const photos: Record<string, ServiceRecordPhoto> = {};
    if (inc.photos) {
      const ids = [...new Set(filtered.filter((e) => e.type === "completed").flatMap((e) => e.photoIds))].slice(0, MAX_BOOKLET_PHOTOS);
      const byId = new Map(docs.map((d) => [d.id, d]));
      await Promise.all(ids.map(async (id) => {
        const d = byId.get(id);
        const name = d?.title || d?.filename || id.slice(0, 8);
        try {
          photos[id] = { name, url: new URL(await signDocumentPath(this.hass, id), window.location.origin).href };
        } catch {
          photos[id] = { name, url: null };
        }
      }));
    }
    return { tasks, photos };
  }

  private async _print(filtered: ReadonlyArray<ObjectHistoryEntry>): Promise<void> {
    const L = this._lang;
    const o = this.object;
    if (!o || this._printing) return;
    this._printing = true;
    let data: { tasks: ServiceRecordTask[]; photos: Record<string, ServiceRecordPhoto> };
    try {
      data = await this._bookletData(filtered);
    } finally {
      this._printing = false;
    }
    this._printOpen = false;
    const labels: ServiceRecordLabels = {
      title: t("service_record_title", L),
      generated: t("report_generated", L),
      manufacturer: t("manufacturer", L),
      model: t("model", L),
      serial: t("serial_number_label", L),
      installed: t("installed", L),
      colDate: t("date", L),
      colTask: t("task_name", L),
      colCost: t("cost", L),
      colDuration: t("duration", L),
      colNotes: t("notes_label", L),
      completedBy: t("completed_by", L),
      totalLabel: t("report_total_cost", L),
      entriesLabel: (n) => `${n} ${t("service_record_entries", L)}`,
      capNote: t("object_history_cap_note", L),
      none: "—",
      readings: t("print_inc_readings", L),
      parts: t("print_inc_parts", L),
      photos: t("print_inc_photos", L),
      documents: t("print_inc_documents", L),
      checklist: t("print_inc_checklist", L),
      refNumber: t("ref_number", L),
      scanHint: t("report_scan_hint", L),
      page: (n) => t("search_page", L).replace("{page}", String(n)),
    };
    const printable = filtered.map((e) => ({
      ...e,
      completedBy: e.completedBy ? this.userName(e.completedBy) : null,
    }));
    const htmlDoc = buildServiceRecordHtml(
      o,
      printable,
      labels,
      (iso) => (iso ? formatDate(iso, L) : ""),
      (minutes) => `${minutes} min`,
      (amount) => formatCost(amount, this.currencySymbol, L),
      new Date().toISOString(),
      {
        capped: this._capped,
        options: { layout: this._printLayout, include: this._printInclude },
        data: { objectRef: objectRef(o), tasks: data.tasks, photos: data.photos, fmtNumber: (n) => formatNumber(n, L) },
      },
    );
    openHtmlInNewTab(htmlDoc);
  }

  /** The print options panel (#170): layout + one switch per block. */
  private _renderPrintOptions(filtered: ReadonlyArray<ObjectHistoryEntry>) {
    const L = this._lang;
    const inc = this._printInclude;
    const box = (key: keyof ServiceRecordInclude, labelKey: string, disabled = false) => html`
      <label class="opt ${disabled ? "disabled" : ""}">
        <input type="checkbox" .checked=${inc[key]} ?disabled=${disabled}
          @change=${(e: Event) => this._toggleInclude(key, (e.target as HTMLInputElement).checked)} />
        <span>${t(labelKey, L)}</span>
      </label>`;
    const byTask = this._printLayout === "by_task";
    return html`
      <div class="print-options" role="dialog" aria-label=${t("print_options_title", L)}>
        <div class="po-title">${t("print_options_title", L)}</div>
        <div class="po-group">
          <span class="po-label">${t("print_layout", L)}</span>
          <label class="opt"><input type="radio" name="layout" value="chronological" .checked=${!byTask}
            @change=${() => { this._printLayout = "chronological"; this._savePrintOptions(); }} /><span>${t("print_layout_chronological", L)}</span></label>
          <label class="opt"><input type="radio" name="layout" value="by_task" .checked=${byTask}
            @change=${() => { this._printLayout = "by_task"; this._savePrintOptions(); }} /><span>${t("print_layout_by_task", L)}</span></label>
        </div>
        <div class="po-group">
          <span class="po-label">${t("print_include", L)}</span>
          ${box("readings", "print_inc_readings")}
          ${box("parts", "print_inc_parts")}
          ${box("photos", "print_inc_photos")}
          ${box("checklist", "print_inc_checklist")}
          ${box("notes", "print_inc_notes")}
          ${box("costs", "print_inc_costs")}
          ${box("person", "print_inc_person")}
          ${box("refs", "print_inc_refs")}
          ${box("bare", "print_inc_bare")}
          ${box("documents", "print_inc_documents", !byTask)}
          ${box("qr", "print_inc_qr", !byTask)}
        </div>
        <div class="po-actions">
          <ha-button appearance="plain" @click=${() => { this._printOpen = false; }}>${t("cancel", L)}</ha-button>
          <ha-button appearance="filled" class="po-print" .disabled=${this._printing} @click=${() => this._print(filtered)}>
            ${this._printing ? t("loading", L) : t("print_button", L)}
          </ha-button>
        </div>
      </div>`;
  }

  render() {
    const L = this._lang;
    const all = this._entries;
    if (!all.length && !this._loading) return nothing;
    const filtered = filterObjectHistory(all, {
      taskId: this._filterTask || null,
      from: this._from || null,
      to: this._to || null,
    });
    const { completed, totalCost } = objectHistoryTotals(filtered);
    const shown = this._expanded ? filtered : filtered.slice(0, 15);

    return html`
      <div class="section">
        <h3>
          ${t("object_history_section", L)}
          <span class="count">${filtered.length}</span>
          ${this._loading ? html`<span class="loading-hint">${t("loading", L)}</span>` : nothing}
          <ha-button appearance="plain" class="print-btn" @click=${() => { this._printOpen = !this._printOpen; }}>
            <ha-icon icon="mdi:printer-outline"></ha-icon>
            ${t("service_record_print", L)}
          </ha-button>
        </h3>
        ${this._printOpen ? this._renderPrintOptions(filtered) : nothing}

        <div class="filters">
          <select .value=${this._filterTask} @change=${(e: Event) => { this._filterTask = (e.target as HTMLSelectElement).value; }}>
            <option value="">${t("object_history_all_tasks", L)}</option>
            ${this.tasks.map((task) => html`<option value=${task.id} ?selected=${task.id === this._filterTask}>${task.name}</option>`)}
          </select>
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${L}
            .label=${t("date_from", L)}
            .value=${this._from}
            @value-changed=${(e: CustomEvent) => { this._from = e.detail.value as string; }}
          ></ms-date-field>
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${L}
            .label=${t("date_to", L)}
            .value=${this._to}
            @value-changed=${(e: CustomEvent) => { this._to = e.detail.value as string; }}
          ></ms-date-field>
        </div>

        ${filtered.length === 0
          ? html`<p class="empty">${t("object_history_empty", L)}</p>`
          : html`
              <div class="rows">
                ${shown.map((e) => html`
                  <div class="row">
                    <span class="date" title=${formatDateTime(e.timestamp, L)}>${formatDate(e.timestamp, L)}</span>
                    <span class="type type-${e.type}">${t(e.type, L)}</span>
                    <button class="task-link" @click=${() => this._openTask(e.taskId)}>${e.taskName}${e.phaseName ? ` · ${e.phaseName}` : ""}</button>
                    <span class="facts">
                      ${e.cost != null ? html`<span>${formatCost(e.cost, this.currencySymbol, L)}</span>` : nothing}
                      ${e.duration != null ? html`<span>${e.duration} min</span>` : nothing}
                    </span>
                    ${e.notes ? html`<span class="notes" title=${e.notes}>${e.notes}</span>` : nothing}
                  </div>
                `)}
              </div>
              ${filtered.length > shown.length
                ? html`<ha-button appearance="plain" class="more" @click=${() => { this._expanded = true; }}>
                    ${t("show_all", L)} (${filtered.length})
                  </ha-button>`
                : nothing}
              <div class="totals">
                ${completed} ${t("service_record_entries", L)} · ${t("report_total_cost", L)}:
                <strong>${formatCost(totalCost, this.currencySymbol, L)}</strong>
              </div>
              ${this._capped
                ? html`<p class="cap-note">${t("object_history_cap_note", L)}</p>`
                : nothing}
            `}
      </div>
    `;
  }

  static styles = css`
    .section { margin-top: 28px; }
    h3 { display: flex; align-items: center; gap: 8px; margin: 0 0 10px; }
    .count {
      font-size: 12px; color: var(--secondary-text-color);
      background: var(--secondary-background-color); padding: 2px 8px; border-radius: 999px;
    }
    .loading-hint { font-size: 12px; color: var(--secondary-text-color); font-weight: 400; }
    .print-btn { margin-left: auto; }
    .print-btn ha-icon { --mdc-icon-size: 16px; margin-right: 4px; }
    .print-options {
      border: 1px solid var(--divider-color); border-radius: 10px; padding: 12px 14px; margin: 0 0 12px;
      background: var(--card-background-color); display: flex; flex-direction: column; gap: 10px; font-size: 13px;
    }
    .po-title { font-weight: 600; }
    .po-group { display: flex; flex-wrap: wrap; gap: 6px 14px; align-items: center; }
    .po-label { color: var(--secondary-text-color); font-size: 11.5px; text-transform: uppercase; letter-spacing: .04em; min-width: 64px; }
    .opt { display: inline-flex; align-items: center; gap: 6px; cursor: pointer; }
    .opt.disabled { opacity: .5; cursor: default; }
    .po-actions { display: flex; justify-content: flex-end; gap: 8px; }
    .filters {
      display: flex; flex-wrap: wrap; gap: 12px; align-items: center;
      margin-bottom: 10px; font-size: 13px; color: var(--secondary-text-color);
    }
    .filters select, .filters input {
      background: var(--card-background-color, transparent);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color);
      border-radius: 6px; padding: 5px 8px; font: inherit;
    }
    .filters label { display: inline-flex; align-items: center; gap: 6px; }
    .rows { display: flex; flex-direction: column; }
    .row {
      display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap;
      padding: 6px 4px; border-bottom: 1px solid var(--divider-color);
      font-size: 13px;
    }
    .date { color: var(--secondary-text-color); min-width: 84px; white-space: nowrap; }
    .type {
      font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;
      padding: 1px 6px; border-radius: 4px; white-space: nowrap;
    }
    .type-completed { background: color-mix(in srgb, var(--success-color, #43a047) 18%, transparent); color: var(--success-color, #43a047); }
    .type-skipped { background: color-mix(in srgb, var(--secondary-text-color) 15%, transparent); color: var(--secondary-text-color); }
    .type-missed { background: color-mix(in srgb, var(--error-color, #db4437) 15%, transparent); color: var(--error-color, #db4437); }
    .type-reset { background: color-mix(in srgb, var(--info-color, #039be5) 15%, transparent); color: var(--info-color, #039be5); }
    .task-link {
      background: none; border: none; padding: 0; cursor: pointer;
      color: var(--primary-text-color); font: inherit; font-weight: 500;
    }
    .task-link:hover { color: var(--primary-color); text-decoration: underline; }
    .facts { display: inline-flex; gap: 10px; color: var(--secondary-text-color); white-space: nowrap; }
    .notes {
      flex: 1 1 100%; color: var(--secondary-text-color);
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      padding-left: 94px;
    }
    .more { margin-top: 6px; }
    .totals {
      margin-top: 10px; font-size: 13px; color: var(--secondary-text-color);
      display: flex; justify-content: flex-end; gap: 6px;
    }
    .totals strong { color: var(--primary-text-color); }
    .cap-note { margin: 8px 0 0; font-size: 11px; color: var(--secondary-text-color); }
    .empty { color: var(--secondary-text-color); font-style: italic; font-size: 13px; }
    @media (max-width: 640px) {
      .notes { padding-left: 0; }
    }
  `;
}

if (!customElements.get("maintenance-object-history-section")) {
  customElements.define("maintenance-object-history-section", MaintenanceObjectHistorySection);
}
