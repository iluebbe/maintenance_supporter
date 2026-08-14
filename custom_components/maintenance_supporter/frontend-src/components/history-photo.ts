/** Thumbnail for a completion photo in the task history timeline.
 *
 * The photo is a DocumentStore file (tagged "photo"); its bytes are served,
 * auth-gated, at /api/maintenance_supporter/document/<doc_id>. An <img> can't
 * send the auth header, so we mint a short-lived signed path via auth/sign_path
 * (the same Companion-safe pattern documents-section uses) and point the <img>
 * at that. Clicking opens the full image in a new tab.
 */

import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import type { HomeAssistant } from "../types";
import { signDocumentPath } from "../helpers/document-url";

export class MaintenanceHistoryPhoto extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property() public docId = "";
  @state() private _url = "";
  @state() private _failed = false;
  private _signedFor = "";

  updated(): void {
    if (this.hass && this.docId && this._signedFor !== this.docId) {
      this._signedFor = this.docId;
      this._url = "";
      this._failed = false;
      void this._sign();
    }
  }

  private async _sign(): Promise<void> {
    try {
      this._url = await signDocumentPath(this.hass, this.docId);
    } catch {
      this._failed = true;
    }
  }

  render() {
    if (this._failed || !this.docId) return nothing;
    if (!this._url) return html`<div class="ph"></div>`;
    return html`
      <a href=${this._url} target="_blank" rel="noopener" class="wrap">
        <img src=${this._url} alt="" loading="lazy"
          @error=${() => (this._failed = true)} />
      </a>`;
  }

  static styles = css`
    .wrap { display: inline-block; margin-top: 4px; }
    img {
      max-width: 96px;
      max-height: 96px;
      border-radius: 6px;
      display: block;
      border: 1px solid var(--divider-color);
    }
    .ph {
      width: 96px;
      height: 64px;
      border-radius: 6px;
      background: var(--secondary-background-color, rgba(0,0,0,0.06));
      margin-top: 4px;
    }
  `;
}

if (!customElements.get("maintenance-history-photo")) {
  customElements.define("maintenance-history-photo", MaintenanceHistoryPhoto);
}
