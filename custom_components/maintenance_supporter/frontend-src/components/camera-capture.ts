/**
 * In-app camera (#161 follow-up).
 *
 * The Android Companion app's file chooser ignores `capture="environment"`
 * on `<input type="file">` — "Take photo" opens the same picker as
 * "Choose photo", and there is no camera in it. Until the app honours the
 * capture hint, the panel brings its own viewfinder: a full-screen overlay
 * on `getUserMedia({ video: { facingMode: "environment" } })` with a
 * Capture and a Cancel button; a shot is drawn to a canvas and handed on as
 * a JPEG `File`, so the callers' upload paths do not change.
 *
 * Only used where `inAppCameraPreferred()` says so (the Android app with a
 * media-devices API); every other host keeps the native input, which does
 * the right thing there. When the camera cannot be opened (permission
 * denied, no camera, an insecure origin) the element fires
 * `capture-unavailable` and the caller falls back to the native input.
 *
 * Events: `photo-captured` `{ file: File }`, `capture-unavailable`
 * `{ reason: string }`, both composed so a dialog can listen on the host.
 */

import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { t } from "../styles";
import { isAndroidCompanion } from "../helpers/companion";

export function inAppCameraPreferred(): boolean {
  if (!isAndroidCompanion()) return false;
  const md = typeof navigator !== "undefined" ? navigator.mediaDevices : undefined;
  return !!md && typeof md.getUserMedia === "function";
}

/** Longest edge of a captured photo; the Companion WebView has little
 *  memory to spare and the upload cap is measured in megabytes. */
const MAX_EDGE = 1920;
const JPEG_QUALITY = 0.88;

export class MsCameraCapture extends LitElement {
  @property({ type: String }) lang = "en";
  @state() private _open = false;
  @state() private _busy = false;
  private _stream: MediaStream | null = null;

  /** Open the viewfinder. Resolves once the stream is attached or the
   *  fallback event has fired — callers do not need to await it. */
  async open(): Promise<void> {
    if (this._open) return;
    const md = typeof navigator !== "undefined" ? navigator.mediaDevices : undefined;
    if (!md || typeof md.getUserMedia !== "function") {
      this._unavailable("no_media_devices");
      return;
    }
    try {
      this._stream = await md.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
    } catch (e) {
      this._unavailable(e instanceof Error ? e.name || e.message : String(e));
      return;
    }
    this._open = true;
    await this.updateComplete;
    const video = this._video;
    if (video && this._stream) {
      video.srcObject = this._stream;
      try {
        await video.play();
      } catch {
        // autoplay refused — the muted, playsinline video still shows the
        // first frame on user gesture; Capture keeps working.
      }
    }
  }

  close(): void {
    this._stopStream();
    this._open = false;
    this._busy = false;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._stopStream();
  }

  private get _video(): HTMLVideoElement | null {
    return this.shadowRoot?.querySelector("video") ?? null;
  }

  private _stopStream(): void {
    for (const track of this._stream?.getTracks() ?? []) track.stop();
    this._stream = null;
    const v = this._video;
    if (v) v.srcObject = null;
  }

  private _unavailable(reason: string): void {
    this._stopStream();
    this._open = false;
    this.dispatchEvent(new CustomEvent("capture-unavailable", { detail: { reason }, bubbles: true, composed: true }));
  }

  private async _shoot(): Promise<void> {
    const video = this._video;
    if (!video || this._busy) return;
    this._busy = true;
    try {
      const w = video.videoWidth || 640;
      const h = video.videoHeight || 480;
      const scale = Math.min(1, MAX_EDGE / Math.max(w, h));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(w * scale);
      canvas.height = Math.round(h * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("no_canvas");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY));
      if (!blob) throw new Error("no_blob");
      const stamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15);
      const file = new File([blob], `photo-${stamp}.jpg`, { type: "image/jpeg" });
      this.close();
      this.dispatchEvent(new CustomEvent("photo-captured", { detail: { file }, bubbles: true, composed: true }));
    } catch (e) {
      this._unavailable(e instanceof Error ? e.message : String(e));
    } finally {
      this._busy = false;
    }
  }

  render() {
    if (!this._open) return nothing;
    const L = this.lang;
    return html`
      <div class="overlay" role="dialog" aria-modal="true" aria-label=${t("doc_camera", L)}>
        <video autoplay playsinline muted></video>
        <div class="bar">
          <button type="button" class="cancel" @click=${this.close}>${t("cancel", L)}</button>
          <button type="button" class="shoot" ?disabled=${this._busy} @click=${this._shoot}>
            <ha-icon icon="mdi:camera"></ha-icon><span>${t("camera_capture_shoot", L)}</span>
          </button>
        </div>
      </div>
    `;
  }

  static styles = css`
    :host { display: contents; }
    .overlay {
      position: fixed; inset: 0; z-index: 10000;
      background: #000; color: #fff;
      display: flex; flex-direction: column;
    }
    video { flex: 1; min-height: 0; width: 100%; object-fit: contain; background: #000; }
    .bar {
      display: flex; justify-content: space-between; align-items: center; gap: 16px;
      padding: 12px 16px calc(12px + env(safe-area-inset-bottom, 0px));
      background: rgba(0, 0, 0, 0.8);
    }
    button {
      font: inherit; border-radius: 24px; padding: 10px 18px; cursor: pointer;
      display: inline-flex; align-items: center; gap: 8px;
    }
    .cancel { background: transparent; color: #fff; border: 1px solid rgba(255, 255, 255, 0.6); }
    .shoot { background: var(--primary-color, #03a9f4); color: #fff; border: none; font-weight: 600; }
    .shoot[disabled] { opacity: 0.6; cursor: default; }
    .shoot ha-icon { --mdc-icon-size: 22px; }
  `;
}

if (!customElements.get("ms-camera-capture")) {
  customElements.define("ms-camera-capture", MsCameraCapture);
}

declare global {
  interface HTMLElementTagNameMap {
    "ms-camera-capture": MsCameraCapture;
  }
}
