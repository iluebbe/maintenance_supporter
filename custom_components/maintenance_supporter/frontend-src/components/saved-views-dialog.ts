/** Dialog to save the current panel filters as a named view + manage views.
 *
 * "Views" are shared, named combinations of the task-list filters (status /
 * user / archived) plus sort + group-by. This dialog saves the panel's *current*
 * filter state under a name and lists existing views for deletion. Applying a
 * view is done from the toolbar dropdown, not here.
 *
 * Uses a native <input> for the name — <ha-textfield> is not registered in the
 * custom-panel context, so it renders without its field (the documented trap).
 */

import { css, html, LitElement, nothing } from "lit";
import { property, state } from "lit/decorators.js";

import { t, ensureLocale } from "../styles";
import { describeWsError } from "../ws-errors";
import type { HomeAssistant, SavedView, SavedViewFilters } from "../types";

interface ViewsResponse {
  views: SavedView[];
}

export class MaintenanceSavedViewsDialog extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private _open = false;
  @state() private _busy = false;
  @state() private _error = "";
  @state() private _name = "";
  @state() private _views: SavedView[] = [];

  private _filters: SavedViewFilters | null = null;
  private _localeReady = false;

  private get _lang(): string {
    return this.hass?.language || "en";
  }

  updated(changed: Map<string, unknown>): void {
    if (changed.has("hass") && this.hass && !this._localeReady) {
      this._localeReady = true;
      ensureLocale(this._lang).then(() => this.requestUpdate());
    }
  }

  public async open(currentFilters: SavedViewFilters, views: SavedView[]): Promise<void> {
    this._open = true;
    this._error = "";
    this._name = "";
    this._filters = currentFilters;
    this._views = views;
  }

  private _close(): void {
    this._open = false;
  }

  private _emitChanged(views: SavedView[]): void {
    this._views = views;
    this.dispatchEvent(
      new CustomEvent("saved-views-changed", { bubbles: true, composed: true, detail: { views } }),
    );
  }

  private _save = async (): Promise<void> => {
    const name = this._name.trim();
    if (!name || this._busy || !this._filters) return;
    this._busy = true;
    this._error = "";
    try {
      const res = await this.hass.connection.sendMessagePromise<ViewsResponse>({
        type: "maintenance_supporter/views/save",
        name,
        filters: this._filters,
      });
      this._name = "";
      this._emitChanged(res.views || []);
    } catch (e) {
      this._error = describeWsError(e, this._lang);
    } finally {
      this._busy = false;
    }
  };

  private _delete = async (viewId: string): Promise<void> => {
    if (this._busy) return;
    this._busy = true;
    this._error = "";
    try {
      const res = await this.hass.connection.sendMessagePromise<ViewsResponse>({
        type: "maintenance_supporter/views/delete",
        view_id: viewId,
      });
      this._emitChanged(res.views || []);
    } catch (e) {
      this._error = describeWsError(e, this._lang);
    } finally {
      this._busy = false;
    }
  };

  render() {
    if (!this._open) return html``;
    const L = this._lang;
    return html`
      <div class="overlay" @click=${this._close}>
        <div class="card" @click=${(e: Event) => e.stopPropagation()}>
          <div class="title">${t("views_dialog_title", L)}</div>
          <div class="hint">${t("views_dialog_hint", L)}</div>
          ${this._error ? html`<div class="error">${this._error}</div>` : nothing}

          <div class="save-row">
            <input
              class="name-input"
              type="text"
              .value=${this._name}
              placeholder=${t("views_name_placeholder", L)}
              maxlength="60"
              @input=${(e: Event) => (this._name = (e.target as HTMLInputElement).value)}
              @keydown=${(e: KeyboardEvent) => {
                if (e.key === "Enter") this._save();
              }}
            />
            <ha-button @click=${this._save} .disabled=${!this._name.trim() || this._busy}>
              ${t("views_save_current", L)}
            </ha-button>
          </div>

          ${this._views.length === 0
            ? html`<div class="empty">${t("views_none_yet", L)}</div>`
            : html`
                <div class="list">
                  ${this._views.map(
                    (v) => html`
                      <div class="row">
                        <span class="row-name">${v.name}</span>
                        <ha-icon-button
                          .path=${"M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"}
                          .label=${t("delete", L)}
                          @click=${() => this._delete(v.id)}
                        ></ha-icon-button>
                      </div>
                    `,
                  )}
                </div>
              `}

          <div class="actions">
            <ha-button appearance="plain" @click=${this._close}>${t("close", L)}</ha-button>
          </div>
        </div>
      </div>
    `;
  }

  static styles = css`
    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .card {
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      border-radius: 12px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-width: 340px;
      max-width: 480px;
      width: 90vw;
      max-height: 80vh;
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    }
    .title {
      font-size: 18px;
      font-weight: 500;
    }
    .hint {
      color: var(--secondary-text-color);
      font-size: 13px;
    }
    .error {
      color: var(--error-color, #f44336);
      font-size: 13px;
    }
    .save-row {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .name-input {
      flex: 1;
      padding: 8px 10px;
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font-size: 14px;
    }
    .empty {
      color: var(--secondary-text-color);
      font-size: 14px;
      padding: 8px 0;
    }
    .list {
      display: flex;
      flex-direction: column;
      gap: 6px;
      overflow-y: auto;
      max-height: 50vh;
    }
    .row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 6px 8px;
      border: 1px solid var(--divider-color);
      border-radius: 6px;
    }
    .row-name {
      font-size: 14px;
      font-weight: 500;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding-top: 8px;
    }
  `;
}

if (!customElements.get("maintenance-saved-views-dialog")) {
  customElements.define("maintenance-saved-views-dialog", MaintenanceSavedViewsDialog);
}
