/** The whole panel as a Lovelace card (#174).
 *
 * `custom:maintenance-supporter-panel-card` mounts the sidebar panel's own
 * element (`maintenance-supporter-panel`) inside a card, so the complete UI
 * can live as a dashboard subview — a panel view with this single card —
 * without the sidebar entry. Nothing is duplicated: the card lazy-imports
 * the panel bundle from the URL HA itself registered for the sidebar panel
 * (`hass.panels[...].config._panel_custom.module_url`), so both surfaces run
 * the very same module instance and the element is defined exactly once.
 *
 * The panel is told it is `embedded`: no hamburger button (the dashboard
 * has its own header), no safe-area padding (the dashboard wrapper applies
 * it), deep links are read from whatever path the dashboard has, and the
 * card's `tab` / `view` presets pick the opening tab or saved view without
 * touching the panel's remembered choice. The panel keeps its bounded box
 * with `.content` as the scroller (virtualised table, sticky bulk bar,
 * docked split view all hang off it), so the card gives it a definite
 * height: by default it fills the viewport below the card's top edge (a
 * panel view), or whatever `height` the config names for mixed views.
 */

import { LitElement, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { registerCustomCard } from "./helpers/register-card";
import { langOf, t } from "./styles";
import type { HomeAssistant, SavedView } from "./types";

export const PANEL_CARD_TAG = "maintenance-supporter-panel-card";
const PANEL_TAG = "maintenance-supporter-panel";
const PANEL_URL_PATH = "maintenance-supporter";
/** HA's own `narrow` breakpoint (home-assistant-main: max-width 870px). */
const NARROW_MAX_PX = 870;
const MIN_FILL_PX = 320;
export const PANEL_CARD_TABS = ["today", "dashboard", "calendar", "settings"] as const;

export interface PanelCardConfig {
  type: string;
  /** Opening tab; unset = the tab the panel remembers. */
  tab?: (typeof PANEL_CARD_TABS)[number] | "";
  /** Opening saved view (id or name); implies the dashboard tab. */
  view?: string;
  /** Card height: unset / "fill" = fill the viewport below the card's top
   *  edge (panel view); a number = px; a string = any CSS length. */
  height?: string | number;
}

interface PanelElement extends HTMLElement {
  hass: HomeAssistant;
  narrow: boolean;
  embedded: boolean;
  panel: Record<string, unknown>;
  presets: { tab?: string; view?: string };
}

/** The module URL HA registered for the sidebar panel — the one import that
 *  shares the element definition with the sidebar. null = panel not
 *  registered (integration not set up, or an older core without panels). */
export function panelModuleUrl(hass: HomeAssistant | undefined): string | null {
  const entry = hass?.panels?.[PANEL_URL_PATH];
  const url = entry?.config?._panel_custom?.module_url;
  return typeof url === "string" && url.startsWith("/") ? url : null;
}

/** Resolve the configured height to a CSS length (null = fill). */
export function configuredHeight(height: PanelCardConfig["height"]): string | null {
  if (height === undefined || height === null || height === "" || height === "fill") return null;
  if (typeof height === "number") return height > 0 ? `${Math.round(height)}px` : null;
  const s = String(height).trim();
  return /^\d+(\.\d+)?$/.test(s) ? `${s}px` : s || null;
}

export class MaintenanceSupporterPanelCard extends HTMLElement {
  static getConfigElement(): HTMLElement {
    return document.createElement("maintenance-supporter-panel-card-editor");
  }

  static getStubConfig(): PanelCardConfig {
    return { type: `custom:${PANEL_CARD_TAG}` };
  }

  private _config: PanelCardConfig = { type: `custom:${PANEL_CARD_TAG}` };
  private _hass: HomeAssistant | undefined;
  private _panel: PanelElement | null = null;
  private _status: HTMLElement;
  private _loading: Promise<void> | null = null;
  private _observer: ResizeObserver | null = null;
  private _lastWidth = -1;
  private _onResize = () => this._layout(true);

  constructor() {
    super();
    const root = this.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = `
      :host { display: block; box-sizing: border-box; overflow: hidden; border-radius: var(--ha-card-border-radius, 12px); }
      .status { padding: 16px; color: var(--secondary-text-color); font-size: 14px; }
      ${PANEL_TAG} { display: block; height: 100%; }
    `;
    root.appendChild(style);
    this._status = document.createElement("div");
    this._status.className = "status";
    this._status.hidden = true;
    root.appendChild(this._status);
  }

  setConfig(config: PanelCardConfig): void {
    this._config = { ...config };
    if (this._panel) this._panel.presets = this._presets();
    this._layout(true);
  }

  /** A full-width, tall card: HA's masonry/sections sizing hints. */
  getCardSize(): number {
    return 12;
  }

  getGridOptions(): { columns: "full"; rows: "auto" } {
    return { columns: "full", rows: "auto" };
  }

  set hass(hass: HomeAssistant) {
    this._hass = hass;
    if (this._panel) this._panel.hass = hass;
    else void this._mount();
  }

  get hass(): HomeAssistant | undefined {
    return this._hass;
  }

  connectedCallback(): void {
    if (typeof ResizeObserver !== "undefined" && !this._observer) {
      this._observer = new ResizeObserver(() => this._layout(false));
      this._observer.observe(this);
    }
    window.addEventListener("resize", this._onResize);
    this._layout(true);
    if (this._hass) void this._mount();
  }

  disconnectedCallback(): void {
    this._observer?.disconnect();
    this._observer = null;
    window.removeEventListener("resize", this._onResize);
  }

  private _presets(): { tab?: string; view?: string } {
    const presets: { tab?: string; view?: string } = {};
    if ((PANEL_CARD_TABS as readonly string[]).includes(this._config.tab ?? "")) presets.tab = this._config.tab;
    if (typeof this._config.view === "string" && this._config.view.trim()) presets.view = this._config.view.trim();
    return presets;
  }

  private _setStatus(text: string): void {
    this._status.textContent = text;
    this._status.hidden = false;
  }

  /** Define the panel element if the sidebar has not loaded it yet, then
   *  mount one instance. Idempotent: one panel per card, one import per
   *  page. */
  private async _mount(): Promise<void> {
    if (this._panel || this._loading || !this._hass || !this.isConnected) return;
    const lang = langOf(this._hass);
    if (!customElements.get(PANEL_TAG)) {
      const url = panelModuleUrl(this._hass);
      if (!url) {
        this._setStatus(t("panel_card_not_registered", lang));
        return;
      }
      this._loading = import(/* @vite-ignore */ url).then(
        () => undefined,
        () => {
          this._setStatus(t("panel_card_load_failed", lang));
          throw new Error("panel bundle failed to load");
        },
      );
      try {
        await this._loading;
      } catch {
        return;
      } finally {
        this._loading = null;
      }
      if (this._panel || !this._hass || !this.isConnected) return;
    }
    const panel = document.createElement(PANEL_TAG) as PanelElement;
    panel.embedded = true;
    panel.panel = (this._hass.panels?.[PANEL_URL_PATH] as Record<string, unknown> | undefined) ?? { url_path: PANEL_URL_PATH };
    panel.presets = this._presets();
    panel.narrow = this._narrow();
    panel.hass = this._hass;
    this._status.hidden = true;
    this.shadowRoot!.appendChild(panel);
    this._panel = panel;
    this._layout(true);
  }

  private _narrow(): boolean {
    const w = this.getBoundingClientRect().width;
    return w > 0 ? w < NARROW_MAX_PX : window.innerWidth < NARROW_MAX_PX;
  }

  /** Width → the panel's `narrow`; height → the configured length or the
   *  viewport below the card's top edge. The fill is measured on mount,
   *  resize and width changes only — never on scroll, so a scrolled page
   *  cannot feed its own offset back into the card's height. */
  _layout(force: boolean): void {
    const rect = this.getBoundingClientRect();
    const widthChanged = Math.round(rect.width) !== this._lastWidth;
    if (!force && !widthChanged) return;
    this._lastWidth = Math.round(rect.width);
    if (this._panel && rect.width > 0) this._panel.narrow = rect.width < NARROW_MAX_PX;
    const fixed = configuredHeight(this._config.height);
    if (fixed) {
      this.style.height = fixed;
      return;
    }
    if (!this.isConnected) return;
    const top = Math.max(0, rect.top);
    const fill = Math.max(MIN_FILL_PX, Math.floor(window.innerHeight - top));
    this.style.height = `${fill}px`;
  }
}

/** Visual editor: opening tab, opening saved view, height. */
export class MaintenanceSupporterPanelCardEditor extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config: PanelCardConfig = { type: `custom:${PANEL_CARD_TAG}` };
  @state() private _views: SavedView[] = [];
  private _viewsLoaded = false;

  setConfig(config: PanelCardConfig): void {
    this._config = { ...config };
  }

  updated(changed: Map<string, unknown>): void {
    super.updated(changed);
    if (changed.has("hass") && this.hass && !this._viewsLoaded) {
      this._viewsLoaded = true;
      void this._loadViews();
    }
  }

  private async _loadViews(): Promise<void> {
    try {
      const res = await this.hass.connection.sendMessagePromise<{ views?: SavedView[] }>({ type: "maintenance_supporter/views/list" });
      this._views = res?.views || [];
    } catch {
      this._views = [];
    }
  }

  private _set(key: keyof PanelCardConfig, value: string): void {
    const next: PanelCardConfig = { ...this._config };
    if (value === "" || value === undefined) delete next[key];
    else (next as unknown as Record<string, unknown>)[key] = value;
    this._config = next;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: next }, bubbles: true, composed: true }));
  }

  render() {
    const L = langOf(this.hass);
    const tabLabel = (tab: string) => t(tab === "today" ? "tab_today" : tab === "calendar" ? "tab_calendar" : tab, L);
    return html`
      <div class="editor">
        <div class="field">
          <div class="field-label">${t("panel_card_tab", L)}</div>
          <select class="tab-select" .value=${this._config.tab || ""} @change=${(e: Event) => this._set("tab", (e.target as HTMLSelectElement).value)}>
            <option value="" ?selected=${!this._config.tab}>${t("panel_card_tab_default", L)}</option>
            ${PANEL_CARD_TABS.map((tab) => html`<option value=${tab} ?selected=${this._config.tab === tab}>${tabLabel(tab)}</option>`)}
          </select>
        </div>
        ${this._views.length > 0
          ? html`<div class="field">
              <div class="field-label">${t("panel_card_view", L)}</div>
              <select class="view-select" .value=${this._config.view || ""} @change=${(e: Event) => this._set("view", (e.target as HTMLSelectElement).value)}>
                <option value="" ?selected=${!this._config.view}>${t("card_saved_view_none", L)}</option>
                ${this._views.map((v) => html`<option value=${v.id} ?selected=${this._config.view === v.id || this._config.view === v.name}>${v.name}</option>`)}
              </select>
            </div>`
          : nothing}
        <div class="field">
          <ha-textfield
            .label=${t("panel_card_height", L)}
            .value=${this._config.height === undefined ? "" : String(this._config.height)}
            placeholder="fill"
            @change=${(e: Event) => this._set("height", (e.target as HTMLInputElement).value.trim())}
          ></ha-textfield>
          <div class="field-help">${t("panel_card_height_help", L)}</div>
        </div>
      </div>
    `;
  }

  static styles = css`
    .editor { display: flex; flex-direction: column; gap: 16px; padding: 16px; }
    ha-textfield { display: block; }
    .field { display: flex; flex-direction: column; gap: 6px; }
    .field-label { font-size: 13px; color: var(--secondary-text-color); font-weight: 500; }
    .field-help { font-size: 12px; color: var(--secondary-text-color); }
    select { padding: 8px; border-radius: 4px; border: 1px solid var(--divider-color); background: var(--card-background-color); color: var(--primary-text-color); font-size: 14px; max-width: 320px; }
  `;
}

// Module-bottom, guarded registration (first definition wins across bundles).
if (!customElements.get(PANEL_CARD_TAG)) {
  customElements.define(PANEL_CARD_TAG, MaintenanceSupporterPanelCard);
}
if (!customElements.get("maintenance-supporter-panel-card-editor")) {
  customElements.define("maintenance-supporter-panel-card-editor", MaintenanceSupporterPanelCardEditor);
}

registerCustomCard({
  type: PANEL_CARD_TAG,
  name: "Maintenance Supporter — Panel",
  description: "The complete Maintenance Supporter panel as a card — for a panel view / dashboard subview without the sidebar entry.",
  preview: false,
});
