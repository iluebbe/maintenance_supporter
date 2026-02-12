/** Maintenance Supporter Lovelace Card. */

import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { sharedStyles, STATUS_COLORS, t } from "./styles";
import type {
  HomeAssistant,
  MaintenanceObjectResponse,
  MaintenanceTask,
  StatisticsResponse,
  CardConfig,
} from "./types";
import "./maintenance-card-editor";
import "./components/complete-dialog";

interface FlatTask {
  entry_id: string;
  object_name: string;
  task: MaintenanceTask;
}

@customElement("maintenance-supporter-card")
export class MaintenanceSupporterCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config: CardConfig = { type: "custom:maintenance-supporter-card" };
  @state() private _objects: MaintenanceObjectResponse[] = [];
  @state() private _stats: StatisticsResponse | null = null;
  @state() private _unsub: (() => void) | null = null;

  private get _lang(): string {
    return this.hass?.language || "de";
  }

  static getConfigElement() {
    return document.createElement("maintenance-supporter-card-editor");
  }

  static getStubConfig() {
    return { type: "custom:maintenance-supporter-card", show_header: true, show_actions: true };
  }

  setConfig(config: CardConfig): void {
    this._config = config;
  }

  getCardSize(): number {
    return 3;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._loadData();
    this._subscribe();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._unsub) {
      this._unsub();
      this._unsub = null;
    }
  }

  private async _loadData(): Promise<void> {
    try {
      const [objResult, statsResult] = await Promise.all([
        this.hass.connection.sendMessagePromise({ type: "maintenance_supporter/objects" }),
        this.hass.connection.sendMessagePromise({ type: "maintenance_supporter/statistics" }),
      ]);
      this._objects = (objResult as { objects: MaintenanceObjectResponse[] }).objects;
      this._stats = statsResult as StatisticsResponse;
    } catch {
      // WS not available yet
    }
  }

  private async _subscribe(): Promise<void> {
    try {
      this._unsub = await this.hass.connection.subscribeMessage(
        (msg: unknown) => {
          const data = msg as { objects: MaintenanceObjectResponse[] };
          this._objects = data.objects;
        },
        { type: "maintenance_supporter/subscribe" }
      );
    } catch {
      // Subscription failed
    }
  }

  private get _flatTasks(): FlatTask[] {
    const tasks: FlatTask[] = [];
    const { filter_status, filter_objects, max_items } = this._config;

    for (const obj of this._objects) {
      if (filter_objects?.length && !filter_objects.includes(obj.object.name)) continue;
      for (const task of obj.tasks) {
        if (filter_status?.length && !filter_status.includes(task.status)) continue;
        tasks.push({ entry_id: obj.entry_id, object_name: obj.object.name, task });
      }
    }

    const order: Record<string, number> = { overdue: 0, triggered: 1, due_soon: 2, ok: 3 };
    tasks.sort((a, b) => (order[a.task.status] ?? 9) - (order[b.task.status] ?? 9));

    if (max_items && max_items > 0) {
      return tasks.slice(0, max_items);
    }
    return tasks;
  }

  private _onCompleted = async (): Promise<void> => {
    await this._loadData();
  };

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
          ${showHeader && s
            ? html`
                <div class="header-stats">
                  ${s.overdue > 0 ? html`<span class="badge overdue">${s.overdue}</span>` : nothing}
                  ${s.due_soon > 0 ? html`<span class="badge due_soon">${s.due_soon}</span>` : nothing}
                  ${s.triggered > 0 ? html`<span class="badge triggered">${s.triggered}</span>` : nothing}
                </div>
              `
            : nothing}
        </div>
        ${tasks.length === 0
          ? html`<div class="empty-card">${t("no_tasks_short", L)}</div>`
          : html`
              <div class="task-list ${compact ? "compact" : ""}">
                ${tasks.map(
                  ({ entry_id, object_name, task }) => html`
                    <div class="task-item">
                      <div class="status-dot" style="background: ${STATUS_COLORS[task.status] || "#ccc"}"></div>
                      <div class="task-info">
                        <div class="task-name">${task.name}</div>
                        ${!compact ? html`<div class="task-meta">${object_name} · ${t(task.type, L)}</div>` : nothing}
                      </div>
                      <div class="task-due">
                        ${task.days_until_due !== null && task.days_until_due !== undefined
                          ? task.days_until_due < 0
                            ? html`<span class="overdue-text">${Math.abs(task.days_until_due)}${L.startsWith("de") ? "T" : "d"}</span>`
                            : task.days_until_due === 0
                            ? t("today", L)
                            : `${task.days_until_due}${L.startsWith("de") ? "T" : "d"}`
                          : task.trigger_active
                          ? "⚡"
                          : "—"}
                      </div>
                      ${showActions
                        ? html`
                            <mwc-icon-button
                              class="complete-btn"
                              title="${t("complete", L)}"
                              @click=${() => {
                                const dlg = this.shadowRoot!.querySelector("maintenance-complete-dialog") as any;
                                dlg.entryId = entry_id;
                                dlg.taskId = task.id;
                                dlg.taskName = task.name;
                                dlg.lang = L;
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
      .header-stats { display: flex; gap: 6px; }

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

      .empty-card { padding: 16px; text-align: center; color: var(--secondary-text-color); }
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

      .status-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
      .task-info { flex: 1; min-width: 0; }
      .task-name { font-size: 14px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .task-meta { font-size: 12px; color: var(--secondary-text-color); }

      .task-due { font-size: 13px; color: var(--secondary-text-color); min-width: 40px; text-align: right; }
      .overdue-text { color: var(--error-color); font-weight: 500; }

      .complete-btn {
        --mdc-icon-button-size: 32px;
        --mdc-icon-size: 18px;
        color: var(--primary-color);
      }
    `,
  ];
}

// Register as custom card
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: "maintenance-supporter-card",
  name: "Maintenance Supporter",
  description: "Overview of your maintenance tasks with quick actions.",
  preview: true,
});
