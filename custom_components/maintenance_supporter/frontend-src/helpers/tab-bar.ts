/** A row of tabs: our `.tab-bar` of `.tab`s (classic), or with the beta UI
 *  Home Assistant's ha-tab-group (HA's indicator, keyboard and scroll
 *  controls; it fires `wa-tab-show` with `{ name }` — probed on 2026.7.2 …
 *  2026.11). `trailing` sits at the row's end in both (the search button). */

import { html, nothing, type TemplateResult } from "lit";
import { betaWith } from "./beta-ui";

export interface TabDef<K extends string> {
  key: K;
  label: unknown;
  /** The tab's own class (live checks find the Trace tab by it). */
  cls?: string;
}

export function renderTabBar<K extends string>(tabs: Array<TabDef<K> | false | null | undefined>, active: K, select: (key: K) => void, trailing: unknown = nothing): TemplateResult {
  const list = tabs.filter((tab): tab is TabDef<K> => !!tab);
  if (betaWith("ha-tab-group")) {
    return html`
      <div class="tab-bar ha-tabs">
        <ha-tab-group .active=${active} @wa-tab-show=${(e: CustomEvent<{ name: string }>) => {
          const key = list.find((tab) => tab.key === e.detail?.name)?.key;
          if (key && key !== active) select(key);
        }}>
          ${list.map((tab) => html`<ha-tab-group-tab slot="nav" panel=${tab.key} class=${tab.cls ?? nothing} .active=${tab.key === active}>${tab.label}</ha-tab-group-tab>`)}
        </ha-tab-group>
        ${trailing}
      </div>`;
  }
  return html`
    <div class="tab-bar">
      ${list.map((tab) => html`
        <div class="tab${tab.cls ? " " + tab.cls : ""} ${tab.key === active ? "active" : ""}" @click=${() => select(tab.key)}>
          ${tab.label}
        </div>`)}
      ${trailing}
    </div>`;
}
