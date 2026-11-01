/** A section that folds: our `<details>` (classic), or with the beta UI Home
 *  Assistant's ha-expansion-panel (HA's chevron, outline and animation; it
 *  fires `expanded-changed` with `{ expanded }` — probed on 2026.7.2 …
 *  2026.11). The classic markup is the `<details>` each place had. */

import { html, nothing, type TemplateResult } from "lit";
import { betaWith } from "./beta-ui";

export interface CollapsibleOptions {
  /** The class each place's `<details>` had (styles, tests, live checks). */
  cls?: string;
  open?: boolean;
  header: unknown;
  /** The header's own class (classic `<summary class>`). */
  headerCls?: string;
  /** Opened or closed by the user. */
  onToggle?: (open: boolean) => void;
}

export function collapsible(o: CollapsibleOptions, body: unknown): TemplateResult {
  if (betaWith("ha-expansion-panel")) {
    return html`
      <ha-expansion-panel class=${o.cls ?? ""} outlined .expanded=${!!o.open}
        @expanded-changed=${(e: CustomEvent<{ expanded: boolean }>) => {
          // Nested panels bubble theirs: only this one's counts.
          if (e.target === e.currentTarget) o.onToggle?.(e.detail.expanded);
        }}>
        <div slot="header" class=${o.headerCls ?? "collapsible-header"}>${o.header}</div>
        ${body}
      </ha-expansion-panel>`;
  }
  return html`<details class=${o.cls ?? ""} ?open=${!!o.open}
    @toggle=${o.onToggle ? (e: Event) => o.onToggle!((e.target as HTMLDetailsElement).open) : nothing}><summary class=${o.headerCls ?? nothing}>${o.header}</summary>${body}</details>`;
}
