import { html, nothing } from "lit";
import type { TemplateResult } from "lit";

/**
 * Render free-text notes as markdown via HA's own `<ha-markdown>` element
 * (registered by the HA frontend in the panel context; it sanitises and
 * opens links with target=_blank rel=noreferrer). When the element is not
 * available — test runners, exotic hosts — fall back to the plain pre-wrap
 * text these sites always rendered.
 *
 * Deliberately used ONLY on block-shaped notes (task detail, object detail,
 * object quick-actions). One-line ellipsized sites (table cells, history
 * rows) keep plain text: markdown would break their layout and their
 * `title` tooltips would still show raw source. Printables stay plain too.
 */
export function renderNotesMarkdown(
  notes: string | null | undefined,
): TemplateResult | typeof nothing {
  if (!notes) return nothing;
  if (customElements.get("ha-markdown")) {
    return html`<ha-markdown class="notes-md" .content=${notes} breaks></ha-markdown>`;
  }
  return html`${notes}`;
}
