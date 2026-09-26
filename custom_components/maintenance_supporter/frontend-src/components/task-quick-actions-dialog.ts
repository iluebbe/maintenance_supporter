/** v2.3.0 — Task Quick-Actions Dialog.
 *
 *  Opens from the Lovelace card / strategy when the user clicks a task row.
 *  Surfaces every action the panel's Task-Detail header offers, in-place,
 *  without forcing a panel-roundtrip:
 *
 *    • Quick info  — name + status + next due + last performed + interval
 *    • Primary actions — Complete (existing dialog), Skip (inline), Reset (inline)
 *    • Secondary (admin) — Edit settings (existing dialog), QR Code, Delete
 *    • Footer — "Open in Maintenance Panel" deep-link for History/Statistics
 *
 *  Mounted via dialog-mount.openTaskQuickActions(entryId, taskId).
 */

import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { sharedStyles, t, formatDate, formatInterval, formatRecurrence, formatCost, formatDuration, currencySymbolOf, langOf, syncCurrencyDecimals} from "../styles";
import { describeWsError } from "../ws-errors";
import { isoDateLocal } from "../helpers/calendar-bucket";
import { buildCompleteDialogArgs } from "../helpers/complete-dialog-args";
import { phaseLabel } from "../helpers/phases";
import { buildHistoryEntryDraft } from "../helpers/history-draft";
import { readingSlotDelta } from "../helpers/reading-slots";
import { taskRef } from "../helpers/reference";
import { newestFirst, renderHistoryEntry } from "../renderers/history";
import { renderStatusBadge, statusColor } from "../renderers/status";
import { fetchSettingsOnce } from "../helpers/settings-cache";
import { canWrite, NO_DELEGATION, type WriteAccess } from "../helpers/permissions";
import { confirmAction } from "../helpers/confirm";
import { ToastTimer } from "../helpers/toast";
import { renderWeibullSection } from "../renderers/weibull";
import { renderPredictionSection } from "../renderers/prediction";
import { renderRecommendationBars } from "../renderers/recommendation";
import "./ms-date-field";
import {
  renderSeasonalCardCompact,
  renderSeasonalCardExpanded,
} from "../renderers/seasonal";
import type {
  HomeAssistant,
  HistoryEntry,
  MaintenanceObjectResponse,
  MaintenanceTask,
  AdvancedFeatures,
} from "../types";

interface MaintenanceObjectFull {
  entry_id: string;
  object: { id: string; name: string; ref_no?: number | null };
  tasks: MaintenanceTask[];
}

export class MaintenanceTaskQuickActionsDialog extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private _open = false;
  @state() private _entryId: string | null = null;
  @state() private _taskId: string | null = null;
  @state() private _task: MaintenanceTask | null = null;
  @state() private _objectName = "";
  /** #170: "8.3" once the backend numbered the task — the history rows' "#8.3-n" chips. */
  @state() private _taskRef: string | null = null;
  @state() private _busy = false;
  @state() private _error = "";
  @state() private _showSkip = false;
  @state() private _showReset = false;
  @state() private _showDetails = false;
  @state() private _showAdaptive = false;
  @state() private _skipReason = "";
  @state() private _resetDate = "";
  @state() private _features: AdvancedFeatures = {
    adaptive: false, predictions: false, seasonal: false, environmental: false,
    budget: false, groups: false, checklists: false, schedule_time: false,
    completion_actions: false,
  };
  @state() private _toast = "";
  private readonly _toastTimer = new ToastTimer();
  /** Operator-write delegation (helpers/permissions): Edit / Archive /
   *  Delete follow canWrite() like the panel, not `is_admin` alone. */
  @state() private _access: WriteAccess = NO_DELEGATION;
  /** Currency symbol for the complete dialog's cost suggestion — read off
   *  the same settings response as the feature flags. */
  private _currencySymbol = "";

  private get _lang(): string {
    return langOf(this.hass);
  }

  /** Open the dialog. Loads fresh data from /object via WS so dialog stays in
   *  sync even if the underlying card has stale data. */
  public async openFor(entryId: string, taskId: string): Promise<void> {
    this._entryId = entryId;
    this._taskId = taskId;
    this._error = "";
    this._showSkip = false;
    this._showReset = false;
    this._showAdaptive = false;
    this._skipReason = "";
    // Local calendar date — toISOString() is UTC and prefills YESTERDAY for
    // users east of UTC before their morning (bug audit 2026-08-22).
    this._resetDate = isoDateLocal(new Date());
    this._open = true;
    await Promise.all([this._loadTask(), this._loadFeatures()]);
  }

  /** Pull the active feature flags so adaptive sections only render when
   *  Adaptive / Seasonal / Environmental are actually enabled (matches the
   *  panel's behaviour), plus the write delegation and currency. Through
   *  the page-wide settings cache (one fetch per page, invalidated by
   *  global/update) — the private fetch here bypassed it and never
   *  re-read after a settings change (DRY audit 2026-09-26). A failed
   *  fetch serves the all-off fallback and asks again next open. */
  private async _loadFeatures(): Promise<void> {
    const settings = await fetchSettingsOnce(this.hass);
    this._features = { ...this._features, ...settings.features };
    this._access = settings.access;
    this._currencySymbol = currencySymbolOf(settings.budget ?? undefined);
    syncCurrencyDecimals(settings.budget ?? undefined);
  }

  public close(): void {
    this._open = false;
    this._task = null;
    this._error = "";
    this._toastTimer.clear();
    this._toast = "";
  }

  private _showToast(msg: string, ms?: number): void {
    this._toast = msg;
    this._toastTimer.schedule(() => { this._toast = ""; }, ms);
  }

  private async _loadTask(): Promise<void> {
    if (!this._entryId || !this._taskId) return;
    try {
      const r = await this.hass.connection.sendMessagePromise<MaintenanceObjectFull>({
        type: "maintenance_supporter/object",
        entry_id: this._entryId,
      });
      this._objectName = r.object?.name || "";
      const found = (r.tasks || []).find((t) => t.id === this._taskId);
      this._task = found ?? null;
      this._taskRef = taskRef(r.object, found);
    } catch (e) {
      this._error = describeWsError(e, this._lang);
    }
  }

  private async _runWs(payload: Record<string, unknown>): Promise<boolean> {
    this._busy = true;
    this._error = "";
    try {
      await this.hass.connection.sendMessagePromise(payload);
      this._busy = false;
      return true;
    } catch (e) {
      this._error = describeWsError(e, this._lang);
      this._busy = false;
      return false;
    }
  }

  private _notifyChanged(action: string): void {
    this.dispatchEvent(
      new CustomEvent("task-action-fired", {
        detail: { entry_id: this._entryId, task_id: this._taskId, action },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _onComplete(): void {
    if (!this._entryId || !this._taskId || !this._task) return;
    // Reuse the existing rich complete-dialog by mounting it on body.
    // Pass EVERYTHING the card's direct path passes — omitting
    // required_completion_fields let a mandatory note be skipped, and a
    // reading task without type+unit never rendered its value field
    // (bug audit 2026-08-22).
    import("../dialog-mount").then(async ({ openCompleteDialog }) => {
      const task = this._task!;
      // The object list resolves the parts picker (own inventory + shared
      // pools, #99/#111), the "consumes" hint lines and a buy task's restock
      // default — fetched for every task kind, since a buy task needs its
      // part's restock quantity + unit cost too.
      let objects: MaintenanceObjectResponse[] = [];
      try {
        const r = await this.hass.connection.sendMessagePromise<{
          objects: MaintenanceObjectResponse[];
        }>({ type: "maintenance_supporter/objects", compact: true });
        objects = r.objects || [];
      } catch {
        // Parts stay empty — the dialog still completes without them.
      }
      // Same derivation as the panel and the card (phase override, tag-scan
      // gate, checklist ticks …) — see helpers/complete-dialog-args.
      const ok = openCompleteDialog(
        buildCompleteDialogArgs({
          entryId: this._entryId!,
          taskId: this._taskId!,
          taskName: task.name,
          task,
          objects,
          lang: this._lang,
          // The feature switches gate the checklist and the adaptive
          // feedback exactly like the panel (DRY audit 2026-09-26).
          features: this._features,
          currencySymbol: this._currencySymbol,
        }),
      );
      if (ok) {
        this._notifyChanged("complete");
        this.close();
      }
    });
  }

  private async _onSkipConfirm(): Promise<void> {
    if (!this._entryId || !this._taskId) return;
    const ok = await this._runWs({
      type: "maintenance_supporter/task/skip",
      entry_id: this._entryId,
      task_id: this._taskId,
      reason: this._skipReason.trim() || null,
    });
    if (ok) {
      this._notifyChanged("skip");
      this.close();
    }
  }

  private async _onResetConfirm(): Promise<void> {
    if (!this._entryId || !this._taskId) return;
    const ok = await this._runWs({
      type: "maintenance_supporter/task/reset",
      entry_id: this._entryId,
      task_id: this._taskId,
      date: this._resetDate || undefined,
    });
    if (ok) {
      this._notifyChanged("reset");
      this.close();
    }
  }

  private _onEdit(): void {
    if (!this._entryId || !this._taskId) return;
    import("../dialog-mount").then(({ openEditTaskDialog }) => {
      openEditTaskDialog(this._entryId!, this._taskId!);
      this.close();
    });
  }

  private _onQr(): void {
    if (!this._entryId || !this._taskId || !this._task) return;
    import("../dialog-mount").then(({ openQrDialog }) => {
      openQrDialog({
        entry_id: this._entryId!,
        task_id: this._taskId!,
        task_name: this._task!.name,
        object_name: this._objectName,
      });
      this.close();
    });
  }

  private async _onDelete(): Promise<void> {
    if (!this._entryId || !this._taskId) return;
    const confirmed = await confirmAction(this.hass, {
      title: t("delete", this._lang),
      message: t("delete_task_confirm", this._lang),
      confirmText: t("delete", this._lang),
      danger: true,
    });
    if (!confirmed) return;
    const ok = await this._runWs({
      type: "maintenance_supporter/task/delete",
      entry_id: this._entryId,
      task_id: this._taskId,
    });
    if (ok) {
      this._notifyChanged("delete");
      this.close();
    }
  }

  private async _onArchive(): Promise<void> {
    if (!this._entryId || !this._taskId) return;
    const ok = await this._runWs({
      type: "maintenance_supporter/task/archive",
      entry_id: this._entryId,
      task_id: this._taskId,
    });
    if (ok) {
      this._notifyChanged("archive");
      this.close();
    }
  }

  private async _onUnarchive(): Promise<void> {
    if (!this._entryId || !this._taskId) return;
    const ok = await this._runWs({
      type: "maintenance_supporter/task/unarchive",
      entry_id: this._entryId,
      task_id: this._taskId,
    });
    if (ok) {
      this._notifyChanged("unarchive");
      this.close();
    }
  }

  private _onOpenInPanel(): void {
    if (!this._entryId || !this._taskId) return;
    const path = `/maintenance-supporter?entry_id=${encodeURIComponent(this._entryId)}`
      + `&task_id=${encodeURIComponent(this._taskId)}`;
    history.pushState(null, "", path);
    window.dispatchEvent(new CustomEvent("location-changed"));
    this.close();
  }

  private async _applySuggestion(): Promise<void> {
    if (!this._entryId || !this._taskId || !this._task?.suggested_interval) return;
    const ok = await this._runWs({
      type: "maintenance_supporter/task/apply_suggestion",
      entry_id: this._entryId,
      task_id: this._taskId,
      interval: this._task.suggested_interval,
    });
    if (ok) {
      this._showToast(t("suggestion_applied", this._lang));
      this._notifyChanged("apply_suggestion");
      // Refresh local task so the recommendation card hides
      await this._loadTask();
    }
  }

  private async _reanalyzeInterval(): Promise<void> {
    if (!this._entryId || !this._taskId) return;
    this._busy = true;
    this._error = "";
    try {
      const r = await this.hass.connection.sendMessagePromise<{
        recommended_interval: number | null;
        confidence: string;
        data_points: number;
      }>({
        type: "maintenance_supporter/task/analyze_interval",
        entry_id: this._entryId,
        task_id: this._taskId,
      });
      this._showToast(r.recommended_interval
        // The analyzer always works in DAYS (helpers/interval_analyzer.py), so
        // the unit is pinned here rather than taken from the task's own unit.
        ? `${t("reanalyze_result", this._lang)}: ${formatInterval(r.recommended_interval, "days", this._lang)} (${r.data_points} pts)`
        : t("reanalyze_insufficient_data", this._lang));
      await this._loadTask();
    } catch (e) {
      this._error = describeWsError(e, this._lang);
    } finally {
      this._busy = false;
    }
  }

  private _onEditHistoryEntry(entry: HistoryEntry): void {
    if (!this._entryId || !this._taskId) return;
    const draft = buildHistoryEntryDraft(this._entryId, this._taskId, entry, this._task);
    import("../dialog-mount").then(({ openHistoryEditDialog }) => openHistoryEditDialog(draft));
  }

  /** Inline recommendation card (Current vs Suggested with apply/reanalyze).
   *  Bars + confidence badge come from the shared renderer; the action row
   *  uses native <button>s because <ha-button> isn't always registered in
   *  the Lovelace context (same lazy-load issue that bit complete-dialog
   *  with ha-textfield in #50). The panel uses ha-button + adds Dismiss. */
  private _renderRecommendation(task: MaintenanceTask) {
    if (!this._features.adaptive
      || !task.suggested_interval
      || task.suggested_interval === task.interval_days) {
      return nothing;
    }
    const L = this._lang;
    return html`
      <div class="recommendation-card">
        <h4>${t("suggested_interval", L)}</h4>
        ${renderRecommendationBars(
          task.interval_days, task.suggested_interval,
          task.interval_confidence || "medium", L,
        )}
        <div class="recommendation-actions">
          <button class="btn primary"
            @click=${this._applySuggestion} ?disabled=${this._busy}>
            <ha-icon icon="mdi:check"></ha-icon>
            ${t("apply_suggestion", L)}
          </button>
          <button class="btn"
            @click=${this._reanalyzeInterval} ?disabled=${this._busy}>
            <ha-icon icon="mdi:refresh"></ha-icon>
            ${t("reanalyze", L)}
          </button>
        </div>
      </div>
    `;
  }

  /** Adaptive section: prediction + recommendation + Weibull + seasonal,
   *  reusing the panel's renderers. Only renders blocks that have data. */
  private _renderAdaptive(task: MaintenanceTask) {
    const L = this._lang;
    const hasRecommendation = this._features.adaptive
      && task.suggested_interval
      && task.suggested_interval !== task.interval_days;
    const hasPrediction = (task.degradation_trend != null
        && task.degradation_trend !== "insufficient_data")
      || task.days_until_threshold != null
      || (task.environmental_factor != null && task.environmental_factor !== 1.0);
    const hasWeibull = this._features.adaptive
      && task.interval_analysis?.weibull_beta != null
      && task.interval_analysis?.weibull_eta != null;
    const hasSeasonal = this._features.seasonal
      && task.seasonal_factor
      && task.seasonal_factor !== 1.0;

    if (!hasRecommendation && !hasPrediction && !hasWeibull && !hasSeasonal) {
      return html`<div class="adaptive-empty">
        ${t("adaptive_no_data", L)}
      </div>`;
    }
    return html`
      <div class="adaptive-stack">
        ${this._toast
          ? html`<div class="toast">${this._toast}</div>`
          : nothing}
        ${hasRecommendation ? this._renderRecommendation(task) : nothing}
        ${hasPrediction ? renderPredictionSection(task, L, this._features) : nothing}
        ${hasWeibull ? renderWeibullSection(task, L) : nothing}
        ${hasSeasonal ? html`
          ${renderSeasonalCardCompact(task, L, this._features)}
          ${task.seasonal_factors?.length === 12
              || task.interval_analysis?.seasonal_factors?.length === 12
            ? renderSeasonalCardExpanded(task, L)
            : nothing}
        ` : nothing}
      </div>
    `;
  }

  /** Read-only details panel: stats + history. Shown when the user clicks
   *  "Show details" in the dialog. Edit-buttons on history entries open the
   *  existing history-edit dialog (which lives in the same dialog-mount). */
  private _renderDetails(task: MaintenanceTask) {
    const L = this._lang;
    // The list payload carries only the most recent entries (payload diet,
    // 20) — the stats come from the server's totals over the WHOLE history,
    // not from that window: a task done 30 times read "20" here (DRY audit
    // 2026-09-26). The list itself stays the recent window, newest first by
    // timestamp (a backdated #133 completion is appended last).
    const history = (task.history || []) as HistoryEntry[];
    const totalEntries = task.history_count ?? history.length;
    const recent = newestFirst(history).slice(0, 20);

    return html`
      <div class="details">
        <div class="stats-grid">
          <div class="stat">
            <span class="stat-label">${t("times_performed", L)}</span>
            <span class="stat-value">${task.times_performed ?? 0}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${t("total_cost", L)}</span>
            <span class="stat-value">${formatCost(task.total_cost ?? 0, this._currencySymbol, L)}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${t("avg_duration", L)}</span>
            <span class="stat-value">${formatDuration(task.average_duration != null ? Math.round(task.average_duration) : null, L)}</span>
          </div>
        </div>
        <div class="history-header">
          <strong>${t("history", L)}</strong>
          <span class="history-count">${totalEntries}</span>
        </div>
        ${history.length === 0
          ? html`<div class="history-empty">${t("history_empty", L)}</div>`
          : html`
              <div class="history-list">
                ${recent.map((entry) => renderHistoryEntry(entry, {
                  lang: L,
                  hass: this.hass,
                  currencySymbol: this._currencySymbol,
                  openEdit: (e) => this._onEditHistoryEntry(e),
                  readingUnit: task.reading_unit,
                  readingSlotDelta: (e, slotId) => readingSlotDelta(history, e, slotId),
                  taskRef: this._taskRef,
                }, { compact: true }))}
                ${totalEntries > recent.length
                  ? html`<div class="history-more">… +${totalEntries - recent.length} ${t("older_entries", L)}</div>`
                  : nothing}
              </div>
            `}
      </div>
    `;
  }

  render() {
    if (!this._open) return nothing;
    const L = this._lang;
    const task = this._task;
    const writer = canWrite(this.hass?.user, this._access);

    return html`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        ${task
          ? html`
              <div class="header">
                <div class="title">
                  <span class="status-dot" style="background: ${statusColor(task)}"></span>
                  <span class="task-name">${task.name}</span>
                  ${renderStatusBadge(task, L)}
                </div>
                <div class="object">
                  <button class="link-inline" @click=${() => {
                    if (!this._entryId) return;
                    import("../dialog-mount").then(({ openObjectQuickActions }) => {
                      openObjectQuickActions(this._entryId!);
                      this.close();
                    });
                  }}>${this._objectName}</button>
                </div>
                <div class="quick-info">
                  ${task.next_due
                    ? html`<span><strong>${t("next_due", L)}:</strong> ${formatDate(task.next_due, L)}</span>`
                    : nothing}
                  ${task.last_performed
                    ? html`<span><strong>${t("last_performed", L)}:</strong> ${formatDate(task.last_performed, L)}</span>`
                    : nothing}
                  ${(task.schedule?.kind && !["manual", "one_time"].includes(task.schedule.kind)) || task.interval_days != null
                    ? html`<span><strong>${t("interval", L)}:</strong> ${formatRecurrence(task, L)}</span>`
                    : nothing}
                  ${phaseLabel(task)
                    ? html`<span><strong>${t("phase_current", L)}:</strong> ${phaseLabel(task)}</span>`
                    : nothing}
                </div>
              </div>

              ${this._error
                ? html`<div class="error">${this._error}</div>`
                : nothing}

              ${this._showSkip
                ? html`
                    <div class="inline-form">
                      <label>${t("skip_reason", L)}</label>
                      <input type="text" .value=${this._skipReason}
                        @input=${(e: Event) => { this._skipReason = (e.target as HTMLInputElement).value; }} />
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${() => { this._showSkip = false; }} ?disabled=${this._busy}>
                          ${t("cancel", L)}
                        </button>
                        <button class="btn primary" @click=${this._onSkipConfirm} ?disabled=${this._busy}>
                          ${t("skip", L)}
                        </button>
                      </div>
                    </div>
                  `
                : this._showReset
                ? html`
                    <div class="inline-form">
                      <label>${t("reset_to_date", L)}</label>
                      <ms-date-field
                        kind="date"
                        .hass=${this.hass}
                        .lang=${L}
                        .value=${this._resetDate}
                        @value-changed=${(e: CustomEvent) => { this._resetDate = e.detail.value as string; }}
                      ></ms-date-field>
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${() => { this._showReset = false; }} ?disabled=${this._busy}>
                          ${t("cancel", L)}
                        </button>
                        <button class="btn primary" @click=${this._onResetConfirm} ?disabled=${this._busy}>
                          ${t("reset", L)}
                        </button>
                      </div>
                    </div>
                  `
                : html`
                    <div class="actions primary-row">
                      <ha-button appearance="accent" variant="success" @click=${this._onComplete} .disabled=${this._busy}>
                        <ha-icon slot="start" icon="mdi:check"></ha-icon>
                        ${t("complete", L)}
                      </ha-button>
                      ${task.allow_skip !== false
                        ? html`
                            <ha-button appearance="outlined" variant="warning" @click=${() => { this._showSkip = true; }} .disabled=${this._busy}>
                              <ha-icon slot="start" icon="mdi:skip-next"></ha-icon>
                              ${t("skip", L)}
                            </ha-button>
                          `
                        : nothing}
                      <ha-button appearance="outlined" variant="neutral" @click=${() => { this._showReset = true; }} .disabled=${this._busy}>
                        <ha-icon slot="start" icon="mdi:restart"></ha-icon>
                        ${t("reset", L)}
                      </ha-button>
                    </div>
                    <!-- QR is read tier (the panel offers it to operators too);
                         Edit / Archive / Delete follow canWrite() — the panel's
                         operator delegation, not is_admin alone. -->
                    <div class="actions secondary-row">
                      ${writer
                        ? html`<ha-button size="small" appearance="outlined" variant="neutral" class="qa-edit" @click=${this._onEdit} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:pencil"></ha-icon>
                            ${t("edit", L)}
                          </ha-button>`
                        : nothing}
                      <ha-button size="small" appearance="outlined" variant="neutral" class="qa-qr" @click=${this._onQr} .disabled=${this._busy}>
                        <ha-icon slot="start" icon="mdi:qrcode"></ha-icon>
                        ${t("qr_code", L)}
                      </ha-button>
                      ${writer
                        ? html`<ha-button size="small" appearance="outlined" variant="neutral" class="qa-archive"
                            @click=${task.archived ? this._onUnarchive : this._onArchive}
                            .disabled=${this._busy}>
                            <ha-icon slot="start" icon="${task.archived ? 'mdi:archive-arrow-up-outline' : 'mdi:archive-outline'}"></ha-icon>
                            ${task.archived ? t("unarchive", L) : t("archive", L)}
                          </ha-button>
                          <ha-button size="small" appearance="outlined" variant="danger" class="danger qa-delete" @click=${this._onDelete} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:delete"></ha-icon>
                            ${t("delete", L)}
                          </ha-button>`
                        : nothing}
                    </div>
                    <div class="details-toggle">
                      <button class="link" @click=${() => { this._showDetails = !this._showDetails; }}>
                        <ha-icon icon="${this._showDetails ? 'mdi:chevron-up' : 'mdi:chevron-down'}"></ha-icon>
                        ${this._showDetails
                          ? t("hide_details", L)
                          : t("show_details", L)}
                      </button>
                      ${this._features.adaptive
                          || this._features.seasonal
                          || this._features.environmental
                        ? html`<button class="link" @click=${() => { this._showAdaptive = !this._showAdaptive; }}>
                            <ha-icon icon="${this._showAdaptive ? 'mdi:chart-line' : 'mdi:chart-line-variant'}"></ha-icon>
                            ${this._showAdaptive
                              ? t("hide_stats", L)
                              : t("show_stats", L)}
                          </button>`
                        : nothing}
                    </div>
                    ${this._showDetails ? this._renderDetails(task) : nothing}
                    ${this._showAdaptive ? this._renderAdaptive(task) : nothing}
                    <div class="footer">
                      <button class="link" @click=${this._onOpenInPanel}>
                        <ha-icon icon="mdi:open-in-new"></ha-icon>
                        ${t("open_in_panel", L)}
                      </button>
                    </div>
                  `}
            `
          : html`<div class="loading">${t("loading", L)}</div>`}
      </div>
    `;
  }

  static styles = [sharedStyles, css`
    :host { display: contents; }
    .backdrop {
      position: fixed; inset: 0; z-index: 100;
      background: rgba(0,0,0,0.5);
    }
    .dialog {
      position: fixed; left: 50%; top: 50%;
      transform: translate(-50%, -50%);
      width: 95vw; max-width: 460px;
      max-height: 92vh; overflow: auto;
      background: var(--card-background-color, var(--ha-card-background, #1c1c1c));
      color: var(--primary-text-color);
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.4);
      padding: 20px;
      display: flex; flex-direction: column; gap: 14px;
      z-index: 101;
    }
    .header { display: flex; flex-direction: column; gap: 6px; }
    .title { display: flex; align-items: center; gap: 10px; }
    .status-dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
    .task-name { font-size: 18px; font-weight: 600; }
    .object { font-size: 13px; color: var(--secondary-text-color); }
    .link-inline {
      background: transparent; border: none; padding: 0; cursor: pointer;
      color: var(--primary-color); font-size: inherit; font-family: inherit;
    }
    .link-inline:hover { text-decoration: underline; }
    .quick-info {
      display: flex; flex-wrap: wrap; gap: 12px;
      font-size: 12px; color: var(--secondary-text-color);
      padding-top: 4px; border-top: 1px solid var(--divider-color);
    }
    .quick-info strong { color: var(--primary-text-color); font-weight: 500; }
    .actions { display: flex; gap: 8px; }
    .actions.primary-row { gap: 6px; }
    .actions.primary-row .btn { flex: 1; }
    .actions.primary-row ha-button { flex: 1; }
    /* Edit + QR are admin-tools — left-align as a group; Delete is destructive
       so it gets pushed to the far right with margin-left:auto for visual
       separation. Earlier this row was flex-end which left a strange empty
       gap on the left (user feedback). */
    .actions.secondary-row {
      padding-top: 8px; border-top: 1px solid var(--divider-color);
      justify-content: flex-start;
    }
    .actions.secondary-row .btn.danger,
    .actions.secondary-row ha-button.danger {
      margin-left: auto;
    }
    .actions.secondary-row ha-button { --ha-button-font-size: 13px; }
    .btn {
      padding: 8px 12px; font-size: 14px;
      border-radius: 6px; cursor: pointer;
      border: 1px solid var(--divider-color);
      background: var(--secondary-background-color, transparent);
      color: var(--primary-text-color);
      font-weight: 500;
      display: inline-flex; align-items: center; gap: 6px;
      transition: background 0.12s;
    }
    .btn:hover { background: var(--state-icon-color, rgba(255,255,255,0.06)); }
    .btn[disabled] { opacity: 0.5; cursor: wait; }
    .btn.primary {
      background: var(--primary-color);
      color: var(--text-primary-color, white);
      border-color: var(--primary-color);
    }
    .btn.cancel { background: transparent; }
    .btn.ghost { padding: 6px 10px; font-size: 13px; }
    .btn.danger { color: var(--error-color); }
    .btn ha-icon { --mdc-icon-size: 18px; }
    .inline-form { display: flex; flex-direction: column; gap: 8px; }
    .inline-form label { font-size: 13px; color: var(--secondary-text-color); }
    .inline-form input {
      padding: 8px; font-size: 14px;
      background: var(--secondary-background-color, #2c2c2c);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color, #444);
      border-radius: 6px;
    }
    .inline-actions { display: flex; gap: 8px; justify-content: flex-end; }
    .footer { display: flex; justify-content: center; padding-top: 4px; }
    .link {
      background: transparent; border: none; cursor: pointer;
      color: var(--primary-color); font-size: 13px;
      display: inline-flex; align-items: center; gap: 4px;
    }
    .link:hover { text-decoration: underline; }
    .link ha-icon { --mdc-icon-size: 14px; }
    .loading { padding: 24px; text-align: center; color: var(--secondary-text-color); }
    .error {
      padding: 8px; border-radius: 6px;
      background: rgba(211,47,47,0.1);
      color: var(--error-color, #d32f2f); font-size: 13px;
    }

    /* Details (expandable Show details section) */
    .details-toggle { display: flex; justify-content: center; margin-top: 4px; }
    .details {
      display: flex; flex-direction: column; gap: 12px;
      border-top: 1px solid var(--divider-color);
      padding-top: 12px;
    }
    .stats-grid {
      display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px;
    }
    .stat {
      display: flex; flex-direction: column; gap: 2px;
      background: var(--secondary-background-color, rgba(255,255,255,0.04));
      padding: 8px; border-radius: 6px;
      align-items: center;
    }
    .stat-label { font-size: 11px; color: var(--secondary-text-color); text-transform: uppercase; letter-spacing: 0.5px; }
    .stat-value { font-size: 16px; font-weight: 600; }
    .history-header {
      display: flex; align-items: baseline; gap: 8px;
      font-size: 14px;
    }
    .history-count {
      font-size: 12px; color: var(--secondary-text-color);
      background: var(--secondary-background-color); padding: 2px 8px; border-radius: 999px;
    }
    .history-empty { color: var(--secondary-text-color); font-style: italic; font-size: 13px; }
    /* The rows themselves are the shared renderer's (.history-entry.compact
       + the history-* classes from sharedStyles); only the list chrome is
       local. */
    .history-list { display: flex; flex-direction: column; max-height: 280px; overflow: auto; }
    .history-list .history-entry {
      padding: 6px 8px; border-radius: 6px; border-bottom: none; margin-bottom: 6px;
      background: var(--secondary-background-color, rgba(255,255,255,0.03));
    }
    .history-list .history-date { font-size: 11px; }
    .history-list .history-details { font-size: 11px; }
    .history-more { padding: 8px; text-align: center; font-size: 12px; color: var(--secondary-text-color); font-style: italic; }

    /* Adaptive section — wraps the panel renderers (which assume sharedStyles
       are present) and adds dialog-specific layout. */
    .adaptive-stack {
      display: flex; flex-direction: column; gap: 12px;
      border-top: 1px solid var(--divider-color);
      padding-top: 12px;
    }
    .adaptive-empty {
      padding: 16px; text-align: center;
      color: var(--secondary-text-color);
      font-style: italic; font-size: 13px;
      border-top: 1px solid var(--divider-color);
    }
    .toast {
      padding: 8px 12px; border-radius: 6px;
      background: rgba(76, 175, 80, 0.15);
      color: #4caf50; font-size: 13px; font-weight: 500;
    }
    /* The panel's recommendation-card uses ha-button. We use plain <button>
       in this dialog's button styles. Re-style the action row to match. */
    .recommendation-actions {
      display: flex; gap: 8px; margin-top: 8px;
    }
    /* Constrain SVG charts so they fit the dialog width even on mobile. */
    .weibull-section, .seasonal-card-compact { max-width: 100%; }
    .weibull-chart svg { max-width: 100%; height: auto; }
    .details-toggle { gap: 12px; flex-wrap: wrap; }
  `];
}

if (!customElements.get("maintenance-task-quick-actions-dialog")) {
  customElements.define(
    "maintenance-task-quick-actions-dialog",
    MaintenanceTaskQuickActionsDialog,
  );
}
