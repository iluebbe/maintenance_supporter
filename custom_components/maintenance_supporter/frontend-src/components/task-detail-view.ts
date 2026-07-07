/** <maintenance-task-detail-view> — the task-detail sub-view as a web
 * component. The incremental step over the renderers/task-detail
 * extraction: the panel now hands the component a task + the
 * TaskDetailContext instead of calling the render function inline, giving
 * the sub-view a real element boundary (own update lifecycle, testable in
 * isolation, future home for detail-only state).
 *
 * Deliberately renders into LIGHT DOM (createRenderRoot returns `this`):
 * the element lives inside the panel's shadow root, so every selector in
 * panel-styles.ts (.task-header, .kpi-bar, .popup-menu, …) keeps matching
 * and every dialog-opening callback still runs against the panel's shadow
 * root. Moving the ~1000 lines of detail CSS and the dialog ownership in
 * here would be the big-bang rewrite this component exists to avoid.
 */

import { LitElement, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { renderTaskDetail, type TaskDetailContext } from "../renderers/task-detail";
import type { MaintenanceTask } from "../types";

export class MaintenanceTaskDetailView extends LitElement {
  @property({ attribute: false }) public task?: MaintenanceTask;
  @property({ attribute: false }) public ctx?: TaskDetailContext;

  protected createRenderRoot(): HTMLElement {
    return this;
  }

  protected render(): unknown {
    if (!this.task || !this.ctx) return nothing;
    return html`${renderTaskDetail(this.task, this.ctx)}`;
  }
}

if (!customElements.get("maintenance-task-detail-view")) {
  customElements.define("maintenance-task-detail-view", MaintenanceTaskDetailView);
}
