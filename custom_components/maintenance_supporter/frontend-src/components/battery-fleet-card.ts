/** Battery Fleet Lovelace card (#135 follow-up).
 *
 * A thin ha-card wrapper around the battery-fleet section — the same
 * component the fleet task's detail page renders. Before this card the
 * roster/needs view existed ONLY there; dashboard users templated over the
 * `batteries_due` sensor attributes instead. The section is fully
 * self-contained (fetches its own overview over WS, handles its own
 * locale loading), so the card only supplies chrome and an optional title.
 */

import { LitElement, html, css, nothing } from "lit";
import { StatesRedrawGate } from "../helpers/hass-changes";
import { property, state } from "lit/decorators.js";
import { registerCustomCard } from "../helpers/register-card";
import type { HomeAssistant } from "../types";

interface BatteryFleetCardConfig {
  type: string;
  title?: string;
}

export class MaintenanceBatteryFleetCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  /** A change of only `states` redraws at most once a second, as in the
   *  panel (helpers/hass-changes): each card redrew on every state change
   *  in the home, 15 to 27 times in 10 s on one (perf 2026-11-05). */
  private readonly _statesGate = new StatesRedrawGate(this);

  protected shouldUpdate(changedProps: Map<string, unknown>): boolean {
    return !this._statesGate.hold(changedProps);
  }

  willUpdate(changedProps: Map<string, unknown>): void {
    super.willUpdate(changedProps);
    this._statesGate.release(changedProps);
  }

  @state() private _config: BatteryFleetCardConfig = { type: "custom:maintenance-battery-fleet-card" };

  static getStubConfig(): BatteryFleetCardConfig {
    return { type: "custom:maintenance-battery-fleet-card" };
  }

  setConfig(config: BatteryFleetCardConfig): void {
    this._config = config;
  }

  connectedCallback(): void {
    super.connectedCallback();
    // The section is a sixth of the card bundle, which Home Assistant loads
    // on every page: it loads when a fleet card is first shown and upgrades
    // the element drawn below (perf 2026-11-05).
    void import("./battery-fleet-section");
  }

  getCardSize(): number {
    return 6;
  }

  render() {
    if (!this.hass) return nothing;
    return html`
      <ha-card .header=${this._config.title || undefined}>
        <div class="content">
          <maintenance-battery-fleet-section flat .hass=${this.hass}></maintenance-battery-fleet-section>
        </div>
      </ha-card>
    `;
  }

  static styles = css`
    ha-card {
      overflow: hidden;
    }
    .content {
      padding: 12px 16px 14px;
    }
  `;
}

// Module-bottom registration so esbuild's tree-shaker doesn't drop the class
// (same pattern as the other cards — issue #32).
if (!customElements.get("maintenance-battery-fleet-card")) {
  customElements.define("maintenance-battery-fleet-card", MaintenanceBatteryFleetCard);
}

registerCustomCard({
  type: "maintenance-battery-fleet-card",
  name: "Battery Fleet",
  description: "All tracked batteries: what is low now, what runs out soon, and what to buy.",
  preview: false,
});
