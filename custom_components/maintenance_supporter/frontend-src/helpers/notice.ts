/** A message in a form or dialog — an error, a warning: our `.error` box
 *  (classic), or with the beta UI Home Assistant's ha-alert (icon, colour
 *  and shape of HA's own messages). In the beta the box carries its own
 *  class, so a surface's `.error` styles do not frame HA's alert twice. */

import { html, type TemplateResult } from "lit";
import { betaWith } from "./beta-ui";

export function notice(kind: "error" | "warning", content: unknown): TemplateResult {
  if (betaWith("ha-alert")) {
    return html`<ha-alert alert-type=${kind} class="notice notice-${kind}">${content}</ha-alert>`;
  }
  return html`<div class=${kind === "warning" ? "error warning" : "error"}>${content}</div>`;
}
