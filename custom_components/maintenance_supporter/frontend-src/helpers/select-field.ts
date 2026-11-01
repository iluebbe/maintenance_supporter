/** A dropdown whose `<option>` template is written once: a native
 *  `<select>` (classic — the same element each place had), or with the beta
 *  UI Home Assistant's ha-select through ms-ha-select, which reads the
 *  options from that template. `onChange` sees `e.target.value` in both. */

import { html, nothing, type TemplateResult } from "lit";
import { live } from "lit/directives/live.js";
import { ref } from "lit/directives/ref.js";
import { betaWith } from "./beta-ui";
import "../components/ms-ha-select";

export interface SelectFieldOptions {
  /** HA's label (beta); the native select's aria-label. */
  label?: string;
  cls?: string;
  id?: string;
  /** Omitted: the option marked `selected` decides, as before. */
  value?: string;
  /** The place bound its value through live() (snaps back on refusal). */
  live?: boolean;
  disabled?: boolean;
  onChange: (e: Event) => void;
}

/** Beta UI with HA's ha-select: the place leaves out its own label. */
export function selectIsHa(): boolean {
  return betaWith("ha-select");
}

export function selectField(o: SelectFieldOptions, options: unknown): TemplateResult {
  if (selectIsHa()) {
    return html`<ms-ha-select class=${o.cls ?? nothing} .label=${o.label ?? ""} .value=${o.value} .disabled=${!!o.disabled}
      @change=${o.onChange}>${options}</ms-ha-select>`;
  }
  if (o.value === undefined) {
    return html`<select class=${o.cls ?? nothing} id=${o.id ?? nothing} aria-label=${o.label ?? nothing} ?disabled=${!!o.disabled}
      @change=${o.onChange}>${options}</select>`;
  }
  // The options are a child part here: Lit sets `.value` BEFORE it renders
  // them, so on a first render (or a changed list) the select found no
  // matching option. Set it again once they are in — a microtask, still
  // before the update completes and before the next paint.
  const value = o.value;
  return html`<select class=${o.cls ?? nothing} id=${o.id ?? nothing} aria-label=${o.label ?? nothing} ?disabled=${!!o.disabled}
    .value=${o.live ? live(value) : value} @change=${o.onChange}
    ${ref((el?: Element) => {
      if (el instanceof HTMLSelectElement) queueMicrotask(() => { if (el.value !== value) el.value = value; });
    })}>${options}</select>`;
}
