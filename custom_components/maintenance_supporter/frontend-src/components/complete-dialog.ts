/** Dialog for completing a maintenance task with optional notes, cost, duration. */

import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import type { HomeAssistant } from "../types";
import { t } from "../styles";

export class MaintenanceCompleteDialog extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property() public entryId = "";
  @property() public taskId = "";
  @property() public taskName = "";
  @property() public lang = "de";
  @property({ type: Array }) public checklist: string[] = [];
  @property({ type: Boolean }) public adaptiveEnabled = false;
  @state() private _open = false;
  @state() private _notes = "";
  @state() private _cost = "";
  @state() private _duration = "";
  @state() private _loading = false;
  @state() private _checklistState: Record<string, boolean> = {};
  @state() private _feedback: string = "needed";

  public open(): void {
    this._open = true;
    this._notes = "";
    this._cost = "";
    this._duration = "";
    this._checklistState = {};
    this._feedback = "needed";
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

  private async _complete(): Promise<void> {
    this._loading = true;
    try {
      const data: Record<string, unknown> = {
        type: "maintenance_supporter/task/complete",
        entry_id: this.entryId,
        task_id: this.taskId,
      };
      if (this._notes) data.notes = this._notes;
      if (this._cost) data.cost = parseFloat(this._cost);
      if (this._duration) data.duration = parseInt(this._duration, 10);
      if (this.checklist.length > 0) {
        data.checklist_state = this._checklistState;
      }
      if (this.adaptiveEnabled) {
        data.feedback = this._feedback;
      }
      await this.hass.connection.sendMessagePromise(data);
      this._open = false;
      this.dispatchEvent(new CustomEvent("task-completed"));
    } finally {
      this._loading = false;
    }
  }

  private _close(): void {
    this._open = false;
  }

  render() {
    if (!this._open) return html``;
    const L = this.lang || this.hass?.language || "de";
    return html`
      <ha-dialog
        open
        @closed=${this._close}
        .heading=${t("complete_title", L) + this.taskName}
      >
        <div class="content">
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
          <ha-textfield
            label="${t("notes_optional", L)}"
            .value=${this._notes}
            @input=${(e: Event) => (this._notes = (e.target as HTMLInputElement).value)}
          ></ha-textfield>
          <ha-textfield
            label="${t("cost_optional", L)}"
            type="number"
            step="0.01"
            .value=${this._cost}
            @input=${(e: Event) => (this._cost = (e.target as HTMLInputElement).value)}
          ></ha-textfield>
          <ha-textfield
            label="${t("duration_minutes", L)}"
            type="number"
            .value=${this._duration}
            @input=${(e: Event) => (this._duration = (e.target as HTMLInputElement).value)}
          ></ha-textfield>
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
        <ha-button slot="secondaryAction" appearance="plain" @click=${this._close}>
          ${t("cancel", L)}
        </ha-button>
        <ha-button
          slot="primaryAction"
          @click=${this._complete}
          .disabled=${this._loading}
        >
          ${this._loading ? t("completing", L) : t("complete", L)}
        </ha-button>
      </ha-dialog>
    `;
  }

  static styles = css`
    .content {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 300px;
    }
    ha-textfield {
      display: block;
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
  `;
}

// Safe registration — avoids duplicate define when both panel and card load
if (!customElements.get("maintenance-complete-dialog")) {
  customElements.define("maintenance-complete-dialog", MaintenanceCompleteDialog);
}
