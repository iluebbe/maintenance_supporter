/** Shared recommendation-card visuals (bars + confidence badge).
 *
 *  The visual layout is shared between the panel's task-detail page
 *  (maintenance-panel._renderRecommendationCard) and the Lovelace
 *  task-quick-actions dialog (task-quick-actions-dialog._renderRecommendation).
 *
 *  The two contexts disagree on:
 *    - Whether ha-button or native <button> is used (ha-button isn't always
 *      registered in Lovelace context — same lazy-load issue that bit
 *      complete-dialog with ha-textfield in #50)
 *    - Which actions are exposed (panel has Apply/Reanalyze/Dismiss; the
 *      dialog has Apply/Reanalyze, Dismiss is panel-only)
 *
 *  So this renderer only emits the **bars + labels + confidence badge** —
 *  every caller wraps it with its own header + actions row. CSS classes
 *  are in sharedStyles (.interval-comparison, .interval-bar,
 *  .interval-label, .interval-visual.current/.suggested, .confidence-badge).
 */

import { html, type TemplateResult } from "lit";
import { t } from "../styles";

export function renderRecommendationBars(
  current: number | null | undefined,
  suggested: number,
  confidence: string,
  lang: string,
): TemplateResult {
  const maxBar = Math.max(current || 1, suggested);
  return html`
    <div class="interval-comparison">
      <div class="interval-bar">
        <div class="interval-label">
          ${t("current", lang)}: ${current ?? "—"} ${current != null ? t("days", lang) : ""}
        </div>
        <div class="interval-visual current"
          style="width: ${current != null ? Math.min((current / maxBar) * 100, 100) : 0}%"></div>
      </div>
      <div class="interval-bar">
        <div class="interval-label">
          ${t("recommended", lang)}: ${suggested} ${t("days", lang)}
          <span class="confidence-badge ${confidence}">${t(`confidence_${confidence}`, lang)}</span>
        </div>
        <div class="interval-visual suggested"
          style="width: ${Math.min((suggested / maxBar) * 100, 100)}%"></div>
      </div>
    </div>
  `;
}
