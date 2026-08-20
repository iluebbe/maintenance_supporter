/** Maintenance Supporter Lovelace Card. */

import { LitElement, html, css, nothing } from "lit";
import { applySubscriptionEvent, type SubscriptionEvent } from "./helpers/subscription-merge";
import { hydrateObjects } from "./helpers/hydrate-objects";
import { property, state } from "lit/decorators.js";
import { sharedStyles, STATUS_COLORS, t, ensureLocale, isLocaleLoaded, setDateTimePrefs, formatDueDays, langOf } from "./styles";
import { openSignedDocument } from "./helpers/document-url";
import { registerCustomCard } from "./helpers/register-card";
import type {
  HomeAssistant,
  MaintenanceObjectResponse,
  MaintenanceTask,
  StatisticsResponse,
  CardConfig,
  SavedView,
  SavedViewFilters,
} from "./types";
import { UserService } from "./user-service";
import { partsForCompletion } from "./helpers/shared-parts";
import "./maintenance-card-editor";
import "./components/complete-dialog";
// The Battery Fleet card ships in this globally-loaded bundle so it is
// available on every dashboard without another extra_module_url entry.
import "./components/battery-fleet-card";
import {
  openCreateObjectDialog,
  openCreateTaskDialog,
  openTaskQuickActions,
} from "./dialog-mount";

interface CardDoc {
  id: string;
  title: string;
  kind: string;
  url?: string | null;
}

interface FlatTask {
  entry_id: string;
  object_name: string;
  task: MaintenanceTask;
}

export class MaintenanceSupporterCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config: CardConfig = { type: "custom:maintenance-supporter-card" };
  @state() private _objects: MaintenanceObjectResponse[] = [];
  @state() private _stats: StatisticsResponse | null = null;
  @state() private _unsub: (() => void) | null = null;
  @state() private _viewFilters: SavedViewFilters | null = null;
  /** id → display name for the assignee badge. Empty until users/list
   *  resolves; the badge stays hidden rather than showing a raw uuid. */
  @state() private _userNames: Record<string, string> = {};
  private _userService: UserService | null = null;
  private _userNamesLoaded = false;
  /** entry_id → (task_id → documents) for the row chips. */
  @state() private _taskDocs: Record<string, Record<string, CardDoc[]>> = {};
  private _docsLoadedFor = new Set<string>();

  private get _lang(): string {
    return langOf(this.hass);
  }

  static getConfigElement() {
    return document.createElement("maintenance-supporter-card-editor");
  }

  static getStubConfig() {
    // Opinionated default: when a user picks "Maintenance Supporter" from the
    // card picker, show only the actionable tasks (overdue + triggered + due
    // soon, max 10) — not the full task list which is overwhelming on first
    // add. The user can broaden the filter via the editor afterwards.
    return {
      type: "custom:maintenance-supporter-card",
      show_header: true,
      show_actions: true,
      filter_status: ["overdue", "triggered", "due_soon"],
      max_items: 10,
    };
  }

  setConfig(config: CardConfig): void {
    const viewChanged = config.view_id !== this._config.view_id;
    this._config = config;
    // Config can change after the initial load (editor preview) — re-resolve
    // the referenced view then; the initial resolve happens in _loadData.
    if (viewChanged && this._dataLoaded && this.hass) {
      this._loadViewFilters();
    }
  }

  getCardSize(): number {
    return 3;
  }

  private _dataLoaded = false;
  private _lastConnection: unknown = null;

  connectedCallback(): void {
    super.connectedCallback();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._unsub) {
      this._unsub();
      this._unsub = null;
    }
    this._dataLoaded = false;
    this._lastConnection = null;
  }

  updated(changedProps: Map<string, unknown>): void {
    super.updated(changedProps);
    // Dates/times follow the HA profile format, not just the language (#97).
    if (changedProps.has("hass")) setDateTimePrefs(this.hass?.locale);
    const lang = this.hass?.language;
    if (lang && !isLocaleLoaded(lang)) {
      ensureLocale(lang).then(() => this.requestUpdate());
    }
    // Assignee names: resolved once, only when the config allows it AND some
    // task actually carries a responsible user. The condition is checked
    // synchronously here — an unconditional call whose promise triggered a
    // re-render looped the element forever. Assigning `_userNames` (@state)
    // is what re-renders once the list arrives.
    if (
      this.hass &&
      !this._userNamesLoaded &&
      this._config.show_assignee !== false &&
      this._objects.some((o) => o.tasks.some((tk) => tk.responsible_user_id))
    ) {
      this._loadUserNames();
    }
    // Documents: same shape of guard — fetch per object, once, and only for
    // objects that actually have a document attached to one of their tasks.
    if (this.hass && this._config.show_documents !== false) {
      for (const obj of this._objects) {
        if (this._docsLoadedFor.has(obj.entry_id)) continue;
        if (!obj.tasks.some((tk) => (tk.document_count ?? 0) > 0)) continue;
        this._loadDocuments(obj.entry_id);
      }
    }
    if (changedProps.has("hass") && this.hass) {
      if (!this._dataLoaded) {
        this._dataLoaded = true;
        this._lastConnection = this.hass.connection;
        this._loadData();
        this._subscribe();
      } else if (this.hass.connection !== this._lastConnection) {
        this._lastConnection = this.hass.connection;
        if (this._unsub) {
          try { this._unsub(); } catch { /* ignore */ }
          this._unsub = null;
        }
        this._subscribe();
        this._loadData();
      }
    }
  }

  private async _loadData(): Promise<void> {
    try {
      const [objResult, statsResult] = await Promise.all([
        this.hass.connection.sendMessagePromise({ type: "maintenance_supporter/objects", compact: true }),
        this.hass.connection.sendMessagePromise({ type: "maintenance_supporter/statistics" }),
      ]);
      this._objects = hydrateObjects((objResult as { objects: MaintenanceObjectResponse[] }).objects);
      this._stats = statsResult as StatisticsResponse;
    } catch {
      // WS not available yet
    }
    await this._loadViewFilters();
  }

  /** Display name of the task's responsible user, or "" when the badge must
   *  stay hidden (feature off, nobody assigned, or the name not resolved).
   *  With a rotation this is whoever is up next — the pointer the engine
   *  advances on every completion. */
  private _assigneeName(task: MaintenanceTask): string {
    if (this._config.show_assignee === false) return "";
    const id = task.responsible_user_id;
    if (!id) return "";
    return this._userNames[id] || "";
  }

  /** Resolve display names for the assignee badge (best-effort).
   *
   *  `users/list` is a READ-tier command, so the household members this card
   *  is built for can call it without admin rights. A failure (or a task
   *  whose user was deleted) leaves the name unresolved and the badge simply
   *  does not render — never a raw user id. */
  private async _loadUserNames(): Promise<void> {
    this._userNamesLoaded = true;
    if (!this._userService) this._userService = new UserService(this.hass);
    else this._userService.updateHass(this.hass);
    try {
      const users = await this._userService.getUsers();
      this._userNames = Object.fromEntries(users.map((u) => [u.id, u.name]));
    } catch {
      // leave whatever we had; the badge hides for unresolved ids
    }
  }

  /** Fetch one object's documents and index them by task.
   *
   *  `documents/list` is READ tier, like `users/list` — the household members
   *  this card is for may call it. A failure leaves the row without chips
   *  rather than breaking the card. */
  private async _loadDocuments(entryId: string): Promise<void> {
    this._docsLoadedFor.add(entryId);
    try {
      const res = (await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/documents/list",
        entry_id: entryId,
      })) as { documents: Array<CardDoc & { task_ids?: string[] }> };
      const byTask: Record<string, CardDoc[]> = {};
      for (const doc of res.documents || []) {
        for (const taskId of doc.task_ids || []) {
          (byTask[taskId] ||= []).push({ id: doc.id, title: doc.title, kind: doc.kind, url: doc.url });
        }
      }
      this._taskDocs = { ...this._taskDocs, [entryId]: byTask };
    } catch {
      // no chips for this object; the card is unaffected otherwise
    }
  }

  /** Chips to render on a row: linked documents plus the task's own manual
   *  link, which is the same "the manual is one tap away" affordance. */
  private _docsFor(entryId: string, task: MaintenanceTask): CardDoc[] {
    if (this._config.show_documents === false) return [];
    const linked = this._taskDocs[entryId]?.[task.id] || [];
    const out = [...linked];
    if (task.documentation_url) {
      out.push({ id: `url:${task.id}`, title: t("documentation_label", this._lang), kind: "weblink", url: task.documentation_url });
    }
    return out;
  }

  /** Open a chip: a web link directly, a stored file through a signed path
   *  (the same route the panel uses, so it works in the Companion app). */
  private async _openDoc(doc: CardDoc): Promise<void> {
    if (doc.kind === "weblink" && doc.url) {
      window.open(doc.url, "_blank", "noopener");
      return;
    }
    try {
      await openSignedDocument(this.hass, doc.id);
    } catch {
      /* silent — the card has no error surface */
    }
  }

  /** Resolve the configured saved view's filters (best-effort). A missing or
   *  deleted view degrades to "no view filter" — same fallback semantics as
   *  the backend's notification routing, never an inexplicably empty card. */
  private async _loadViewFilters(): Promise<void> {
    if (!this._config.view_id) {
      this._viewFilters = null;
      return;
    }
    try {
      const res = await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/views/list",
      }) as { views: SavedView[] };
      const view = (res.views || []).find((v) => v.id === this._config.view_id);
      this._viewFilters = view ? view.filters : null;
    } catch {
      this._viewFilters = null;
    }
  }

  private async _subscribe(): Promise<void> {
    try {
      const unsub = await this.hass.connection.subscribeMessage(
        (msg: unknown) => {
          const next = applySubscriptionEvent(
            this._objects,
            msg as SubscriptionEvent<MaintenanceObjectResponse>,
          );
          if (next !== null) this._objects = next;
        },
        // deltas: only changed entries arrive — see helpers/subscription-merge.
        // compact: empty keys stripped server-side, hydrated above.
        { type: "maintenance_supporter/subscribe", deltas: true, compact: true }
      );
      // Detached mid-subscribe → drop the orphaned subscription.
      if (!this.isConnected) {
        unsub();
        return;
      }
      this._unsub = unsub;
    } catch {
      // Subscription failed
    }
  }

  private get _flatTasks(): FlatTask[] {
    const tasks: FlatTask[] = [];
    const {
      filter_status,
      filter_objects,
      entity_ids,
      filter_due_min_days,
      filter_due_max_days,
      filter_labels,
      filter_priority,
      filter_areas,
      max_items,
    } = this._config;
    const entityFilter = entity_ids?.length ? new Set(entity_ids) : null;
    const hasDueRange =
      filter_due_min_days !== undefined || filter_due_max_days !== undefined;
    // Saved-view scope: unlike the panel (where applying a view REPLACES the
    // filter state), the card ANDs the view's task-selecting filters with its
    // own config — the card's filters are static YAML, not transient UI state.
    // The view's `current_user` sentinel resolves against the logged-in user
    // here (client-side), which the backend notification routing cannot do.
    const vf = this._viewFilters;
    const viewUser =
      vf?.user_id === "current_user" ? (this.hass.user?.id ?? null) : (vf?.user_id ?? null);

    for (const obj of this._objects) {
      if (filter_objects?.length && !filter_objects.includes(obj.object.name)) continue;
      // Areas (C8): object-level, so it selects whole objects like
      // filter_objects does — "the tasks for this room". An object with no
      // area_id can never satisfy a non-empty list.
      if (filter_areas?.length) {
        const areaId = obj.object.area_id;
        if (!areaId || !filter_areas.includes(areaId)) continue;
      }
      for (const task of obj.tasks) {
        // Completed one-time tasks ("done") are hidden from the active list.
        if (task.is_done) continue;
        // v2.10.0: archived tasks (and tasks of an archived object) are inert —
        // never shown on the Lovelace card.
        if (task.archived || obj.object.archived) continue;
        if (filter_status?.length && !filter_status.includes(task.status)) continue;
        // Labels: a task passes when it carries at least one configured label.
        if (filter_labels?.length && !(task.labels || []).some((lb) => filter_labels.includes(lb))) continue;
        // Priority (#134): OR over the configured levels; no explicit
        // priority on the task means "normal" (the model default).
        if (filter_priority?.length && !filter_priority.includes(task.priority || "normal")) continue;
        // entity_ids: HA-native filter — match the task's sensor or
        // binary_sensor entity_id. Both fields come pre-resolved from the
        // backend WS response (see _build_task_summary in websocket/__init__.py).
        if (entityFilter) {
          const matches = (task.sensor_entity_id && entityFilter.has(task.sensor_entity_id))
            || (task.binary_sensor_entity_id && entityFilter.has(task.binary_sensor_entity_id));
          if (!matches) continue;
        }
        // due-days range — used by group_by=due_date strategy buckets.
        // Tasks without a numeric days_until_due are excluded from any
        // ranged view; they show up in unfiltered or status-only views.
        if (hasDueRange) {
          const days = task.days_until_due;
          if (days === null || days === undefined) continue;
          if (filter_due_min_days !== undefined && days < filter_due_min_days) continue;
          if (filter_due_max_days !== undefined && days > filter_due_max_days) continue;
        }
        if (vf) {
          if (vf.status && task.status !== vf.status) continue;
          if (vf.label && !(task.labels || []).includes(vf.label)) continue;
          if (vf.priority && (task.priority || "normal") !== vf.priority) continue;
          if (viewUser && task.responsible_user_id !== viewUser) continue;
        }
        tasks.push({ entry_id: obj.entry_id, object_name: obj.object.name, task });
      }
    }

    const order: Record<string, number> = { overdue: 0, triggered: 1, due_soon: 2, ok: 3 };
    tasks.sort((a, b) => {
      const byStatus = (order[a.task.status] ?? 9) - (order[b.task.status] ?? 9);
      if (byStatus !== 0) return byStatus;
      // Within a status, soonest-due first; tasks without a due date go last.
      return (a.task.days_until_due ?? Infinity) - (b.task.days_until_due ?? Infinity);
    });

    if (max_items && max_items > 0) {
      return tasks.slice(0, max_items);
    }
    return tasks;
  }

  private _onCompleted = async (): Promise<void> => {
    await this._loadData();
  };

  /** Open the per-task quick-actions dialog (Complete / Skip / Reset / Edit /
   *  QR / Delete) — full per-task panel parity. Mounted on document.body via
   *  the shared dialog-mount helper, so the card works on any dashboard
   *  without depending on the strategy bundle's ll-custom handler. */
  private _openTaskDetail(entryId: string, taskId: string): void {
    openTaskQuickActions(entryId, taskId);
  }

  render() {
    const L = this._lang;
    const title = this._config.title || t("maintenance", L);
    const showHeader = this._config.show_header !== false;
    const showActions = this._config.show_actions !== false;
    const compact = this._config.compact || false;
    const tasks = this._flatTasks;
    const s = this._stats;

    return html`
      <ha-card>
        <div class="card-header">
          <h1>${title}</h1>
          <div class="header-right">
            ${showHeader && s
              ? html`
                  <div class="header-stats">
                    ${s.overdue > 0 ? html`<span class="badge overdue">${s.overdue}</span>` : nothing}
                    ${s.due_soon > 0 ? html`<span class="badge due_soon">${s.due_soon}</span>` : nothing}
                    ${s.triggered > 0 ? html`<span class="badge triggered">${s.triggered}</span>` : nothing}
                  </div>
                `
              : nothing}
            ${showActions
              ? html`
                  <mwc-icon-button
                    class="hdr-add"
                    title="${t("new_object", L)}"
                    @click=${() => openCreateObjectDialog()}
                  >
                    <ha-icon icon="mdi:plus-box"></ha-icon>
                  </mwc-icon-button>
                  <mwc-icon-button
                    class="hdr-add"
                    title="${t("add_task", L)}"
                    @click=${() => openCreateTaskDialog()}
                  >
                    <ha-icon icon="mdi:playlist-plus"></ha-icon>
                  </mwc-icon-button>
                `
              : nothing}
          </div>
        </div>
        ${tasks.length === 0
          ? this._objects.some((o) => o.tasks.length > 0)
            ? html`<div class="empty-card">
                <!-- (#86) tasks exist but none match the filter (default:
                     actionable-only) — "all caught up", NOT "no tasks yet". -->
                <div class="all-caught-up">✓ ${t("card_all_caught_up", L)}</div>
              </div>`
            : html`<div class="empty-card">
                <div>${t("card_no_tasks_title", L)}</div>
                <a class="empty-link" href="/maintenance-supporter">${t("card_no_tasks_cta", L)}</a>
              </div>`
          : html`
              <div class="task-list ${compact ? "compact" : ""}">
                ${tasks.map(
                  ({ entry_id, object_name, task }) => html`
                    <div class="task-item clickable"
                         @click=${() => this._openTaskDetail(entry_id, task.id)}
                         title="${t("open_task", L) || "Open task"}">
                      <div class="status-dot" style="background: ${STATUS_COLORS[task.status] || "#ccc"}"></div>
                      <div class="task-info">
                        <div class="task-name">
                          ${task.name}
                          ${(task as any).due_override
                            ? html`<ha-icon
                                class="postponed-icon"
                                icon="mdi:calendar-clock"
                                title="${t("postponed", L) || "Postponed"}"
                              ></ha-icon>`
                            : nothing}
                        </div>
                        ${!compact
                          ? html`<div class="task-meta">
                              ${object_name} · ${t(task.type, L)}${this._assigneeName(task)
                                ? html` · <span class="assignee"
                                    ><ha-icon icon="mdi:account"></ha-icon>${this._assigneeName(task)}</span
                                  >`
                                : nothing}
                            </div>`
                          : this._assigneeName(task)
                            ? html`<div class="task-meta compact-assignee" title="${this._assigneeName(task)}">
                                <ha-icon icon="mdi:account"></ha-icon>${this._assigneeName(task)}
                              </div>`
                            : nothing}
                      </div>
                      ${this._docsFor(entry_id, task).length
                        ? html`<div class="doc-chips">
                            ${this._docsFor(entry_id, task).map((doc) => html`
                              <button
                                type="button"
                                class="doc-chip"
                                title="${doc.title}"
                                @click=${(e: Event) => { e.stopPropagation(); void this._openDoc(doc); }}
                              >
                                <ha-icon icon=${doc.kind === "weblink" ? "mdi:link-variant" : "mdi:file-document-outline"}></ha-icon>
                                <span>${doc.title}</span>
                              </button>
                            `)}
                          </div>`
                        : nothing}
                      <div class="task-due">
                        ${task.days_until_due !== null && task.days_until_due !== undefined
                          ? task.days_until_due < 0
                            ? html`<span class="overdue-text">${formatDueDays(task.days_until_due, L)}</span>`
                            : formatDueDays(task.days_until_due, L)
                          : task.trigger_active
                          ? "⚡"
                          : "—"}
                      </div>
                      ${showActions
                        ? html`
                            <mwc-icon-button
                              class="complete-btn"
                              title="${t("complete", L)}"
                              @click=${(e: Event) => {
                                // Stop the row's open-task handler from also firing
                                e.stopPropagation();
                                const dlg = this.shadowRoot!.querySelector("maintenance-complete-dialog") as any;
                                dlg.entryId = entry_id;
                                dlg.taskId = task.id;
                                dlg.taskName = task.name;
                                dlg.checklist = task.checklist || [];
                                dlg.adaptiveEnabled = !!task.adaptive_config?.enabled;
                                dlg.taskType = task.type || "";
                                dlg.readingUnit = (task as any).reading_unit || "";
                                dlg.requiredFields = task.required_completion_fields || [];
                                dlg.lang = L;
                                // #99: editable per-completion parts selection
                                // (skip on buy tasks — those restock instead).
                                // #111: the list also carries the shared pools
                                // this task draws on, each named after its
                                // owner — resolving against the object's own
                                // parts alone left a foreign link invisible.
                                const isBuy = !!(task as any).part_ref;
                                dlg.parts = isBuy ? [] : partsForCompletion(task, entry_id, this._objects, L);
                                dlg.consumesParts = isBuy ? [] : (task.consumes_parts || []);
                                dlg.open();
                              }}
                            >
                              <ha-icon icon="mdi:check"></ha-icon>
                            </mwc-icon-button>
                          `
                        : nothing}
                    </div>
                  `
                )}
              </div>
            `}
      </ha-card>
      <maintenance-complete-dialog
        .hass=${this.hass}
        @task-completed=${this._onCompleted}
      ></maintenance-complete-dialog>
    `;
  }

  static styles = [
    sharedStyles,
    css`
      ha-card { overflow: hidden; }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 16px 8px;
      }

      .card-header h1 { margin: 0; font-size: 18px; font-weight: 500; }
      .header-right { display: flex; align-items: center; gap: 6px; }
      .header-stats { display: flex; gap: 6px; }
      .hdr-add {
        --mdc-icon-button-size: 32px;
        --mdc-icon-size: 20px;
        color: var(--primary-color);
      }

      .badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 22px;
        height: 22px;
        border-radius: 11px;
        font-size: 12px;
        font-weight: 600;
        color: white;
        padding: 0 6px;
      }

      .badge.overdue { background: var(--error-color, #f44336); }
      .badge.due_soon { background: var(--warning-color, #ff9800); }
      .badge.triggered { background: #ff5722; }

      .empty-card {
        padding: 24px 16px;
        text-align: center;
        color: var(--secondary-text-color);
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: center;
      }
      .empty-link {
        color: var(--primary-color);
        text-decoration: none;
        font-size: 13px;
      }
      .empty-link:hover { text-decoration: underline; }
      .all-caught-up { color: var(--success-color, #4caf50); font-weight: 500; }
      .task-list { padding: 0 16px 16px; }

      .task-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 0;
        border-bottom: 1px solid var(--divider-color);
      }
      .task-item:last-child { border-bottom: none; }
      .task-list.compact .task-item { padding: 4px 0; }
      /* Row click opens the task editor (in-place via the strategy bundle's
         ll-custom handler). Hover state hints that the row is interactive. */
      .task-item.clickable { cursor: pointer; transition: background 0.12s; }
      .task-item.clickable:hover {
        background: var(--state-icon-color, rgba(255,255,255,0.04));
      }

      .status-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
      .task-info { flex: 1; min-width: 0; }
      .task-name { font-size: 14px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .postponed-icon { --mdc-icon-size: 14px; color: var(--secondary-text-color); vertical-align: text-bottom; margin-inline-start: 4px; }
      .task-meta { font-size: 12px; color: var(--secondary-text-color); }
      .assignee, .compact-assignee {
        display: inline-flex;
        align-items: center;
        gap: 2px;
        white-space: nowrap;
      }
      .assignee ha-icon, .compact-assignee ha-icon {
        --mdc-icon-size: 13px;
        width: 13px;
        height: 13px;
      }
      /* Compact rows have no meta line of their own — keep the name from
         pushing the due column off a narrow phone card. */
      .compact-assignee {
        max-width: 11ch;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .doc-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        margin-right: 6px;
        max-width: 45%;
      }
      .doc-chip {
        display: inline-flex;
        align-items: center;
        gap: 3px;
        max-width: 14ch;
        padding: 1px 6px;
        border: 1px solid var(--divider-color, #e0e0e0);
        border-radius: 10px;
        background: none;
        color: var(--secondary-text-color);
        font: inherit;
        font-size: 11px;
        cursor: pointer;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .doc-chip:hover { color: var(--primary-color); border-color: var(--primary-color); }
      .doc-chip ha-icon { --mdc-icon-size: 12px; width: 12px; height: 12px; }
      /* nowrap: the due label is localized via formatDueDays ("5 d overdue",
         "5 T überfällig") — without it a narrow phone card wraps that onto a
         second line and the row grows taller. The name column ellipsizes
         instead, which it already does by design. */
      .task-due { font-size: 13px; color: var(--secondary-text-color); min-width: 40px; text-align: right; white-space: nowrap; }
      .overdue-text { color: var(--error-color); font-weight: 500; }

      .complete-btn {
        --mdc-icon-button-size: 32px;
        --mdc-icon-size: 18px;
        color: var(--primary-color);
      }
    `,
  ];
}

// Module-bottom registration so esbuild's tree-shaker doesn't drop the
// element class when the only reference is the @customElement decorator
// (which triggered this exact bug for the dialog components — issue #32:
// "card not showing in the card selector, busy spinner only").
if (!customElements.get("maintenance-supporter-card")) {
  customElements.define("maintenance-supporter-card", MaintenanceSupporterCard);
}

// Register as custom card so the Lovelace card picker lists it.
registerCustomCard({
  type: "maintenance-supporter-card",
  name: "Maintenance Supporter",
  description: "Overview of your maintenance tasks with quick actions.",
  preview: true,
});
