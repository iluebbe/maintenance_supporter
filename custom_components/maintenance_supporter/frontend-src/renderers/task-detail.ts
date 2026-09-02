/** Task-detail sub-view: header, tab bar, overview tab (KPIs, meta, charts,
 * analysis cards), history tab, and the documents section.
 *
 * Extracted from the panel (renderers/ pattern, like history.ts). State the
 * panel owns — the active tab, collapsed sections, feature flags — plus the
 * ~20 action callbacks (complete/skip/archive/QR/edit/…) are passed in via
 * TaskDetailContext. Dialog ownership deliberately STAYS in the panel: every
 * dialog-opening callback runs panel-side against the panel's shadow root, so
 * this module renders into the panel's root and never needs its own dialogs.
 */

import { html, nothing } from "lit";
import { isSafeHttpUrl } from "../helpers/url";
import { renderNotesMarkdown } from "../helpers/notes-markdown";
import { t, formatDate, formatDateTime, formatRecurrence } from "../styles";
import type { AdvancedFeatures, HomeAssistant, MaintenanceTask, ManualDocRef } from "../types";
import { renderTriggerSection, type SparklineContext } from "./sparkline";
import { renderPredictionSection } from "./prediction";
import { renderWeibullSection } from "./weibull";
import { renderRecommendationBars } from "./recommendation";
import { renderSeasonalCardCompact, renderSeasonalCardExpanded } from "./seasonal";
import { renderCostDurationCard } from "./charts";
import { renderDaysProgress } from "./progress";
import { renderHistoryFilters, renderHistoryList, type HistoryContext } from "./history";
import { clampPhaseCursor, effectivePhase, hasPhases } from "../helpers/phases";
import "../components/task-documents";

export interface TaskDetailContext {
  lang: string;
  hass: HomeAssistant;
  entryId: string;
  taskId: string;
  /** Parent object's display name (breadcrumb + object-manual label). */
  objectName: string;
  /** Parent object's documentation_url (raw; sanitised here). */
  objectDocUrl: string | null | undefined;
  /** Parent object's manual-tagged documents — the fallback for the manual
   *  row when documentation_url is empty (same rule as the objects table). */
  objectManualDocs: ManualDocRef[];
  /** Opens a manual document (signed path / weblink) — panel-owned. */
  openManualDoc: (doc: ManualDocRef) => void;
  /** #73: persist one checklist tick (panel sends the full state via WS). */
  setChecklistItem: (item: string, done: boolean) => void;
  /** #139: re-point the phase cursor (operator repair / mid-cycle adoption). */
  setPhaseCursor: (cursor: number) => void;
  isOperator: boolean;
  actionLoading: boolean;
  moreMenuOpen: boolean;
  activeTab: "overview" | "history";
  features: AdvancedFeatures;
  currencySymbol: string;
  collapsedSections: Set<string>;
  costDurationToggle: "cost" | "duration" | "both";
  /** Whether the interval suggestion for THIS task was dismissed this session. */
  suggestionDismissed: boolean;
  /** Sub-contexts for the chart + history renderers. */
  sparkline: SparklineContext;
  history: HistoryContext;
  getUserName: (userId: string) => string | null;
  // ── Panel-owned state mutations ────────────────────────────────────────
  setActiveTab: (tab: "overview" | "history") => void;
  toggleSection: (key: string) => void;
  setCostDurationToggle: (v: "cost" | "duration" | "both") => void;
  showTaskView: () => void;
  showObject: () => void;
  toggleMoreMenu: () => void;
  closeMoreMenu: () => void;
  // ── Panel-owned actions (dialogs live in the panel's shadow root) ──────
  openEdit: (task: MaintenanceTask) => void;
  openComplete: (task: MaintenanceTask) => void;
  promptSkip: () => void;
  toggleArchive: (archived: boolean) => void;
  openQr: (taskName: string) => void;
  duplicateTask: () => void;
  promptReset: () => void;
  promptPostpone: () => void;
  snoozeTask: () => void;
  /** v2.21: open the printable one-pager for this task. */
  printWorksheet: () => void;
  deleteTask: () => void;
  applySuggestion: (interval: number) => void;
  reanalyze: () => void;
  dismissSuggestion: () => void;
  openSeasonalOverrides: (task: MaintenanceTask) => void;
}

/** User badge for a task (if a responsible user is assigned). Also used by
 *  the object-detail task list, so it takes the lookup directly. */
export function renderUserBadge(
  task: MaintenanceTask,
  getUserName: (userId: string) => string | null,
) {
  if (!task.responsible_user_id) return nothing;
  const userName = getUserName(task.responsible_user_id);
  if (!userName) return nothing;
  return html`
    <span class="user-badge">
      <ha-icon icon="mdi:account"></ha-icon>
      ${userName}
    </span>
  `;
}

function renderTaskHeader(task: MaintenanceTask, ctx: TaskDetailContext) {
  const L = ctx.lang;
  const isOperator = ctx.isOperator;

  // Determine status chip — use the backend-computed status. A completed
  // one-time task is shown as archived ("done") rather than its raw "ok".
  const statusClass = task.archived ? "archived" : (task.is_done ? "done" : (task.status === "due_soon" ? "warning" : (task.status || "ok")));
  const statusText = task.archived ? t("archived", L) : (task.is_done ? t("completed", L) : t(task.status || "ok", L));

  return html`
    <div class="task-header">
      <div class="task-header-title">
        <span class="task-name-breadcrumb" @click=${() => ctx.showTaskView()}>${task.name}</span>
        <span class="breadcrumb-separator">·</span>
        <span class="object-name-breadcrumb" @click=${() => ctx.showObject()}>${ctx.objectName}</span>
        <span class="status-chip ${statusClass}">${statusText}</span>
        ${task.due_override ? html`<span class="postponed-badge" title="${t("postponed_to", L)}">
          <ha-icon icon="mdi:calendar-arrow-right"></ha-icon>${formatDate(task.due_override, L)}
        </span>` : nothing}
        ${renderUserBadge(task, ctx.getUserName)}
        ${task.nfc_tag_id
          ? html`<span class="nfc-badge" title="${t("nfc_tag_id", L)}: ${task.nfc_tag_id}"><ha-icon icon="mdi:nfc-variant"></ha-icon> NFC</span>`
          : !isOperator ? html`<span class="nfc-badge unlinked" title="${t("nfc_link_hint", L)}"
              @click=${() => ctx.openEdit(task)}>
              <ha-icon icon="mdi:nfc-variant"></ha-icon>
            </span>` : nothing
        }
      </div>
      <div class="task-header-actions">
        <ha-button appearance="filled" @click=${() => ctx.openComplete(task)}>${t("complete", L)}</ha-button>
        ${task.allow_skip !== false
          ? html`<ha-button appearance="outlined" variant="warning" .disabled=${ctx.actionLoading} @click=${() => ctx.promptSkip()}>${t("skip", L)}</ha-button>`
          : nothing}
        <div class="more-menu-wrapper">
          <ha-icon-button .disabled=${ctx.actionLoading} .path=${"M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"} @click=${() => ctx.toggleMoreMenu()}></ha-icon-button>
          ${ctx.moreMenuOpen ? html`
            <div class="popup-menu" @click=${(e: Event) => e.stopPropagation()}>
              ${!isOperator ? html`
                <div class="popup-menu-item" @click=${() => { ctx.closeMoreMenu(); ctx.openEdit(task); }}>${t("edit", L)}</div>
              ` : nothing}
              <div class="popup-menu-item" @click=${() => { ctx.closeMoreMenu(); ctx.openQr(task.name); }}>${t("qr_code", L)}</div>
              <div class="popup-menu-item" @click=${() => { ctx.closeMoreMenu(); ctx.printWorksheet(); }}>${t("worksheet", L)}</div>
              ${!isOperator ? html`
                <div class="popup-menu-item" @click=${() => ctx.duplicateTask()}>${t("duplicate", L)}</div>
                <div class="popup-menu-item" @click=${() => { ctx.closeMoreMenu(); ctx.promptReset(); }}>${t("reset", L)}</div>
                <div class="popup-menu-item" @click=${() => { ctx.closeMoreMenu(); ctx.promptPostpone(); }}>${t("postpone", L)}…</div>
                <div class="popup-menu-item" @click=${() => { ctx.closeMoreMenu(); ctx.snoozeTask(); }}>${t("snooze", L)}</div>
                <div class="popup-menu-item" @click=${() => { ctx.closeMoreMenu(); ctx.toggleArchive(!!task.archived); }}>${task.archived ? t("unarchive", L) : t("archive", L)}</div>
                <div class="popup-menu-divider"></div>
                <div class="popup-menu-item danger" @click=${() => { ctx.closeMoreMenu(); ctx.deleteTask(); }}>${t("delete", L)}</div>
              ` : nothing}
            </div>
          ` : nothing}
        </div>
      </div>
    </div>
  `;
}

function renderTabBar(ctx: TaskDetailContext) {
  const L = ctx.lang;
  return html`
    <div class="tab-bar">
      <div class="tab ${ctx.activeTab === "overview" ? "active" : ""}" @click=${() => ctx.setActiveTab("overview")}>
        ${t("overview", L)}
      </div>
      <div class="tab ${ctx.activeTab === "history" ? "active" : ""}" @click=${() => ctx.setActiveTab("history")}>
        ${t("history", L)}
      </div>
    </div>
  `;
}

/** Wrap a task-detail analysis card in a collapsible section. The section
 *  header owns the title (the wrapped card's own title is hidden via CSS —
 *  `.collapsible-body` — so it isn't shown twice). Remembered per key. */
function collapsible(key: string, titleKey: string, body: unknown, ctx: TaskDetailContext) {
  const collapsed = ctx.collapsedSections.has(key);
  return html`
    <div class="collapsible ${collapsed ? "collapsed" : ""}">
      <button class="collapsible-head" @click=${() => ctx.toggleSection(key)}
        aria-expanded=${collapsed ? "false" : "true"}>
        <ha-icon icon="${collapsed ? "mdi:chevron-right" : "mdi:chevron-down"}"></ha-icon>
        <span>${t(titleKey, ctx.lang)}</span>
      </button>
      ${collapsed ? nothing : html`<div class="collapsible-body">${body}</div>`}
    </div>
  `;
}

/** Interactive checklist (#73): steps can be ticked off DURING the cycle
 *  without completing the task — progress persists server-side (survives
 *  reloads, prefills the complete dialog) and resets when the task is
 *  completed or skipped. Only rendered when the Checklists feature is
 *  enabled and steps are set. */
/** #139: the cycle strip — every step of the phase sequence as a chip, the
 *  step currently due highlighted, each phase's last completion underneath.
 *  Operators can re-point the cursor (mis-click repair, mid-cycle adoption). */
function renderPhasesCard(task: MaintenanceTask, ctx: TaskDetailContext) {
  if (!hasPhases(task)) return nothing;
  const L = ctx.lang;
  const seq = task.phase_sequence!;
  const cursor = clampPhaseCursor(task.phase_cursor, seq.length);
  // Last completion per phase id — history is append-ordered, so walk it
  // backwards and keep the first hit.
  const lastByPhase = new Map<string, string>();
  for (let i = task.history.length - 1; i >= 0; i--) {
    const h = task.history[i];
    if (h.phase_id && h.type === "completed" && !lastByPhase.has(h.phase_id)) {
      lastByPhase.set(h.phase_id, h.timestamp);
    }
  }
  return html`
    <div class="phases-card">
      <div class="phases-card-header">
        <ha-icon icon="mdi:rotate-right"></ha-icon>
        <span>${t("phase_sequence_label", L)}</span>
      </div>
      <div class="phases-strip">
        ${seq.map((id, i) => {
          const name = task.phases?.[id]?.name || id;
          const last = lastByPhase.get(id);
          return html`
            <div class="phase-step ${i === cursor ? "current" : ""}"
              title=${i === cursor ? t("phase_current", L) : t("phase_set", L)}
              @click=${() => { if (i !== cursor) ctx.setPhaseCursor(i); }}>
              <span class="phase-step-name">${i + 1}. ${name}</span>
              ${last ? html`<span class="phase-step-last">${formatDate(last, L)}</span>` : nothing}
            </div>
          `;
        })}
      </div>
    </div>
  `;
}

function renderChecklistCard(task: MaintenanceTask, ctx: TaskDetailContext) {
  if (!ctx.features.checklists) return nothing;
  // #139: a phased task shows the checklist of the phase currently due.
  const items = effectivePhase(task)?.checklist ?? (task.checklist || []);
  if (items.length === 0) return nothing;
  const L = ctx.lang;
  const progress = task.checklist_progress || {};
  const done = items.filter((item) => progress[item]).length;
  return html`
    <div class="checklist-preview-card">
      <div class="checklist-preview-header">
        <ha-icon icon="mdi:format-list-checks"></ha-icon>
        <span>${t("checklist", L)} (${done}/${items.length})</span>
      </div>
      <ol class="checklist-preview-list">
        ${items.map((item) => html`
          <li class=${progress[item] ? "checked" : ""}>
            <label>
              <input
                type="checkbox"
                .checked=${!!progress[item]}
                @change=${(e: Event) =>
                  ctx.setChecklistItem(item, (e.target as HTMLInputElement).checked)}
              />
              <span>${item}</span>
            </label>
          </li>
        `)}
      </ol>
    </div>
  `;
}

/** Task notes, task documentation URL, and (since v1.4.1) the parent object's
 *  documentation_url for quick access to the device manual without having to
 *  navigate back to the object detail. */
function renderTaskMeta(task: MaintenanceTask, ctx: TaskDetailContext) {
  const safeTaskUrl = isSafeHttpUrl(task.documentation_url)
    ? task.documentation_url : null;
  const safeObjUrl = isSafeHttpUrl(ctx.objectDocUrl) ? ctx.objectDocUrl : null;
  // Same fallback rule as the objects table: an UPLOADED manual (category
  // "manual") stands in when the object's URL field is empty.
  const manualDoc = safeObjUrl ? null : (ctx.objectManualDocs || [])[0];
  if (!task.notes && !safeTaskUrl && !safeObjUrl && !manualDoc) return nothing;
  const L = ctx.lang;
  return html`
    <div class="task-meta-card">
      ${task.notes ? html`
        <div class="task-meta-row">
          <ha-icon icon="mdi:note-text-outline"></ha-icon>
          <span class="task-meta-notes">${renderNotesMarkdown(task.notes)}</span>
        </div>
      ` : nothing}
      ${safeTaskUrl ? html`
        <div class="task-meta-row task-meta-link">
          <ha-icon icon="mdi:open-in-new"></ha-icon>
          <a href="${safeTaskUrl}" target="_blank" rel="noopener noreferrer">${t("documentation_label", L)}</a>
        </div>
      ` : nothing}
      ${safeObjUrl ? html`
        <div class="task-meta-row task-meta-link">
          <ha-icon icon="mdi:book-open-variant"></ha-icon>
          <a href="${safeObjUrl}" target="_blank" rel="noopener noreferrer">${t("documentation_url_label", L)} (${ctx.objectName})</a>
        </div>
      ` : manualDoc ? html`
        <div class="task-meta-row task-meta-link">
          <ha-icon icon="mdi:book-open-variant"></ha-icon>
          <a href="#" title=${manualDoc.title}
            @click=${(e: Event) => { e.preventDefault(); ctx.openManualDoc(manualDoc); }}
            >${t("documentation_url_label", L)} (${ctx.objectName})</a>
        </div>
      ` : nothing}
    </div>
  `;
}

/** KPI bar with 7 cards. */
function renderKPIBar(task: MaintenanceTask, ctx: TaskDetailContext) {
  const L = ctx.lang;
  const avgCost = task.times_performed > 0 ? task.total_cost / task.times_performed : 0;
  const daysClass = task.days_until_due !== null && task.days_until_due !== undefined
    ? (task.days_until_due < 0 ? "overdue" : (task.days_until_due <= task.warning_days ? "warning" : ""))
    : "";

  return html`
    <div class="kpi-bar">
      <div class="kpi-card">
        <div class="kpi-label">${t("next_due", L)}</div>
        <div class="kpi-value">${task.next_due ? formatDate(task.next_due, L) : "—"}</div>
        ${ctx.features.schedule_time && task.schedule_time
          ? html`<div class="kpi-subtext">${t("at_time", L)} ${task.schedule_time}</div>`
          : nothing}
      </div>
      <div class="kpi-card ${daysClass}">
        <div class="kpi-label">${t("days_until_due", L)}</div>
        <div class="kpi-value-large">${task.days_until_due !== null && task.days_until_due !== undefined ? task.days_until_due : "—"}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${t("interval", L)}</div>
        <div class="kpi-value">${formatRecurrence(task, L)}</div>
        ${ctx.features.adaptive && task.suggested_interval && task.suggested_interval !== task.interval_days ? html`
          <div class="kpi-subtext">${t("recommended", L)}: ${task.suggested_interval}${task.interval_analysis?.confidence_interval_low != null ? ` (${task.interval_analysis.confidence_interval_low}–${task.interval_analysis.confidence_interval_high})` : ""}</div>
        ` : nothing}
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${t("warning", L)}</div>
        <div class="kpi-value">${task.warning_days} ${t("days", L)}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${t("last_performed", L)}</div>
        <div class="kpi-value">${task.last_performed ? formatDate(task.last_performed, L) : "—"}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${t("avg_cost", L)}</div>
        <div class="kpi-value">${avgCost.toFixed(0)} ${ctx.currencySymbol}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${t("avg_duration", L)}</div>
        <div class="kpi-value">${task.average_duration ? task.average_duration.toFixed(0) : "—"} min</div>
      </div>
    </div>
  `;
}

function renderRecommendationCard(task: MaintenanceTask, ctx: TaskDetailContext) {
  const L = ctx.lang;

  if (!ctx.features.adaptive || !task.suggested_interval
      || task.suggested_interval === task.interval_days) {
    return nothing;
  }
  if (ctx.suggestionDismissed) return nothing;

  const suggested = task.suggested_interval;
  return html`
    <div class="recommendation-card">
      <h4>${t("suggested_interval", L)}</h4>
      ${renderRecommendationBars(
        task.interval_days, suggested,
        task.interval_confidence || "medium", L,
      )}
      <div class="recommendation-actions">
        <ha-button appearance="filled"
          @click=${() => ctx.applySuggestion(suggested)}>
          ${t("apply_suggestion", L)}
        </ha-button>
        <ha-button appearance="plain"
          @click=${() => ctx.reanalyze()}>
          ${t("reanalyze", L)}
        </ha-button>
        <ha-button appearance="plain"
          @click=${() => ctx.dismissSuggestion()}>
          ${t("dismiss_suggestion", L)}
        </ha-button>
      </div>
    </div>
  `;
}

function renderRecentActivities(task: MaintenanceTask, ctx: TaskDetailContext) {
  const L = ctx.lang;
  const recent = task.history.slice(-3).reverse();

  if (recent.length === 0) {
    return nothing;
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "completed": return "✓";
      case "triggered": return "⊗";
      case "skipped": return "↷";
      case "reset": return "↺";
      default: return "·";
    }
  };

  return html`
    <div class="recent-activities">
      <h3>${t("recent_activities", L)}</h3>
      ${recent.map(entry => html`
        <div class="activity-item">
          <span class="activity-icon">${getIcon(entry.type)}</span>
          <span class="activity-date">${formatDateTime(entry.timestamp, L)}</span>
          <span class="activity-note">${entry.notes || "—"}</span>
          ${entry.cost ? html`<span class="activity-badge">${entry.cost.toFixed(0)}${ctx.currencySymbol}</span>` : nothing}
          ${entry.duration ? html`<span class="activity-badge">${entry.duration}min</span>` : nothing}
        </div>
      `)}
      <div class="activity-show-all">
        <ha-button appearance="plain" @click=${() => ctx.setActiveTab("history")}>${t("show_all", L)} →</ha-button>
      </div>
    </div>
  `;
}

export function renderOverviewTab(task: MaintenanceTask, ctx: TaskDetailContext) {
  const L = ctx.lang;

  // Check if we have recommendation / seasonal content
  const hasRecommendation = ctx.features.adaptive && task.suggested_interval && task.suggested_interval !== task.interval_days;
  const hasSeasonal = ctx.features.seasonal && task.seasonal_factor && task.seasonal_factor !== 1.0;
  const hasLeftColumn = hasRecommendation || hasSeasonal;

  // Analysis content: Weibull/Seasonal expanded (only when data is available)
  const hasWeibullData = ctx.features.adaptive
    && task.interval_analysis?.weibull_beta != null
    && task.interval_analysis?.weibull_eta != null;
  const hasSeasonalData = ctx.features.seasonal
    && (task.seasonal_factors?.length === 12
      || task.interval_analysis?.seasonal_factors?.length === 12);

  return html`
    <div class="tab-content overview-tab">
      ${task.battery_fleet_task
        ? html`<maintenance-battery-fleet-section .hass=${ctx.hass}></maintenance-battery-fleet-section>`
        : nothing}
      ${renderKPIBar(task, ctx)}
      ${renderTaskMeta(task, ctx)}
      ${task.battery_fleet_task
        ? nothing
        : html`
            ${renderDaysProgress(task, ctx.lang)}
            ${renderTriggerSection(task, ctx.sparkline)}
            ${renderPredictionSection(task, L, ctx.features)}
          `}
      <div class="two-column-layout ${hasLeftColumn ? '' : 'single-column'}">
        ${hasLeftColumn ? html`
          <div class="left-column">
            ${renderRecommendationCard(task, ctx)}
            ${renderSeasonalCardCompact(task, L, ctx.features)}
          </div>
        ` : nothing}
        <div class="right-column">
          ${renderCostDurationCard(task, L, ctx.costDurationToggle, (v) => ctx.setCostDurationToggle(v))}
        </div>
      </div>
      ${hasWeibullData
        ? collapsible("weibull", "weibull_reliability_curve", renderWeibullSection(task, L), ctx)
        : nothing}
      ${hasSeasonalData
        ? collapsible("seasonal", "seasonal_chart_title", html`
            ${renderSeasonalCardExpanded(task, L)}
            <div class="seasonal-actions">
              <ha-button appearance="plain" @click=${() => ctx.openSeasonalOverrides(task)}>
                ${t("edit_seasonal_overrides", L)}
              </ha-button>
            </div>
          `, ctx)
        : nothing}
      ${renderPhasesCard(task, ctx)}
      ${renderChecklistCard(task, ctx)}
      ${renderRecentActivities(task, ctx)}
    </div>
  `;
}

function renderHistoryTab(task: MaintenanceTask, ctx: TaskDetailContext) {
  return html`
    <div class="tab-content history-tab">
      <div class="history-add-past">
        <ha-button appearance="plain" class="history-add-past-btn" @click=${() => ctx.openComplete(task)}>
          <ha-icon icon="mdi:calendar-plus"></ha-icon>
          ${t("history_add_past", ctx.lang)}
        </ha-button>
      </div>
      ${renderHistoryFilters(task, ctx.history)}
      ${renderHistoryList(task, ctx.history)}
    </div>
  `;
}

function renderTabContent(task: MaintenanceTask, ctx: TaskDetailContext) {
  switch (ctx.activeTab) {
    case "overview":
      return renderOverviewTab(task, ctx);
    case "history":
      return renderHistoryTab(task, ctx);
    default:
      return nothing;
  }
}

/** The complete task-detail view. Renders into the PANEL's shadow root (this
 *  is a render function, not a component) so the panel's dialogs and styles
 *  keep working unchanged. */
export function renderTaskDetail(task: MaintenanceTask, ctx: TaskDetailContext) {
  return html`
    <div class="detail-section">
      ${renderTaskHeader(task, ctx)}
      ${renderTabBar(ctx)}
      ${renderTabContent(task, ctx)}
      <maintenance-task-documents
        .hass=${ctx.hass}
        .entryId=${ctx.entryId}
        .taskId=${ctx.taskId}
        .canWrite=${!ctx.isOperator}
      ></maintenance-task-documents>
    </div>
  `;
}
