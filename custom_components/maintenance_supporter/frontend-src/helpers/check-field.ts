/** A checkbox with its label: our `<label><input type="checkbox">…</label>`
 *  (classic — the markup each place had, box before or after the text), or
 *  with the beta UI Home Assistant's ha-checkbox, which takes the label as
 *  its content and has `.checked` itself (fires `change`; probed on
 *  2026.7.2 … 2026.11). `onChange` reads `e.target.checked` in both.
 *
 *  The class stays on a `<span>` around the ha-checkbox, not on the
 *  ha-checkbox itself: the places style it as the old label (`display: flex`,
 *  `flex: 1`, `justify-content: space-between`), and on the ha-checkbox host
 *  that layout pushed box and text towards the middle of the row (195 to 400
 *  px in the complete dialog and the settings, live on 2026.11). */

import { html, nothing, type TemplateResult } from "lit";
import { betaWith } from "./beta-ui";

export interface CheckFieldOptions {
  /** The label's class. */
  cls?: string;
  /** The input's own class (classic). */
  inputCls?: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (e: Event) => void;
  /** Classic: the box after the text. */
  boxAfter?: boolean;
}

export function checkField(o: CheckFieldOptions, label: unknown): TemplateResult {
  if (betaWith("ha-checkbox")) {
    const ha = html`<ha-checkbox .checked=${o.checked} .disabled=${!!o.disabled} @change=${o.onChange}>${label}</ha-checkbox>`;
    return o.cls ? html`<span class=${o.cls}>${ha}</span>` : ha;
  }
  const box = html`<input type="checkbox" class=${o.inputCls ?? nothing} .checked=${o.checked} ?disabled=${!!o.disabled} @change=${o.onChange} />`;
  return o.boxAfter
    ? html`<label class=${o.cls ?? nothing}>${label}${box}</label>`
    : html`<label class=${o.cls ?? nothing}>${box}${label}</label>`;
}
