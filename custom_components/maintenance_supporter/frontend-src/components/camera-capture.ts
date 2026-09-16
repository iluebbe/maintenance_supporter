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
import { LS_KEYS, lsGet, lsSet } from "../helpers/storage-keys";

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
  /** Every video input the browser lists (labels may be empty in the
   *  Android WebView — the ids are what the lens switch cycles through). */
  @state() private _devices: MediaDeviceInfo[] = [];
  /** Position in `_devices` of the camera we are showing. Kept by us: the
   *  Android WebView often reports no `deviceId` in the track settings, so
   *  it cannot be derived from the stream (#161 — "switching does nothing"). */
  @state() private _deviceIndex = -1;
  /** #161 follow-up: every listed id refused AND the facing fallback failed —
   *  say so instead of a tap that silently does nothing. */
  @state() private _switchFailed = false;
  /** Which way we believe the current camera faces (for the id-less fallback). */
  private _facing: "user" | "environment" = "environment";
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
    // A camera the user picked with the lens switch wins over every
    // heuristic (the WebView often reports no labels, so the heuristic
    // cannot tell the main module from the ultra-wide one — #161).
    const remembered = lsGet(LS_KEYS.cameraDevice);
    let acquired = false;
    if (remembered) {
      try {
        this._stream = await md.getUserMedia({ video: { deviceId: { exact: remembered } }, audio: false });
        acquired = true;
      } catch {
        // the remembered camera is gone (another phone, a revoked id) — fall through
      }
    }
    if (!acquired) {
      try {
        this._stream = await md.getUserMedia({
          video: { facingMode: { ideal: "environment" }, zoom: 1, advanced: [{ zoom: 1 } as MediaTrackConstraintSet] } as MediaTrackConstraints,
          audio: false,
        });
      } catch (e) {
        this._unavailable(e instanceof Error ? e.name || e.message : String(e));
        return;
      }
      await this._preferMainBackCamera(md);
    }
    await this._applyZoomOne();
    await this._listDevices(md);
    this._deviceIndex = this._indexOfCurrent(remembered && acquired ? remembered : null);
    this._switchFailed = false;
    this._facing = (this._stream?.getVideoTracks()[0]?.getSettings().facingMode as "user" | "environment" | undefined) ?? "environment";
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

  /** Phones with an ultra-wide module often hand that one out for
   *  "environment" (the viewfinder opens at 0.5×, #161). Once permission is
   *  granted the device labels are readable: pick the first back-facing
   *  camera in enumeration order (Android names the main module
   *  "camera2 0, facing back", the wide one a higher index) and, when the
   *  track exposes a zoom range that starts below 1, set it to 1×. Every
   *  step is best-effort — whatever stream we hold stays usable. */
  private async _preferMainBackCamera(md: MediaDevices): Promise<void> {
    if (typeof md.enumerateDevices !== "function") return;
    let devices: MediaDeviceInfo[] = [];
    try {
      devices = await md.enumerateDevices();
    } catch {
      return;
    }
    const index = (d: MediaDeviceInfo): number => {
      const m = /camera2?\s*(\d+)/i.exec(d.label);
      return m ? Number(m[1]) : Number.MAX_SAFE_INTEGER;
    };
    const back = devices
      .filter((d) => d.kind === "videoinput" && d.deviceId && /back|rear|environment|rück|hinten/i.test(d.label))
      .sort((a, b) => index(a) - index(b));
    const track = this._stream?.getVideoTracks()[0];
    const current = track?.getSettings().deviceId;
    if (back.length > 1 && back[0].deviceId !== current) {
      try {
        const stream = await md.getUserMedia({ video: { deviceId: { exact: back[0].deviceId } }, audio: false });
        for (const t of this._stream?.getTracks() ?? []) t.stop();
        this._stream = stream;
      } catch {
        // keep the stream we have
      }
    }
  }

  /** 1× when the track's zoom range starts below it (the logical
   *  multi-camera on some phones opens at 0.5×). Advisory; tried as a
   *  required constraint first and as an advanced one second — engines
   *  differ in which spelling they honour. */
  private async _applyZoomOne(): Promise<void> {
    const chosen = this._stream?.getVideoTracks()[0];
    const caps = chosen && typeof chosen.getCapabilities === "function" ? (chosen.getCapabilities() as { zoom?: { min?: number; max?: number } }) : undefined;
    if (!caps?.zoom || typeof caps.zoom.min !== "number" || caps.zoom.min >= 1 || (caps.zoom.max ?? 1) < 1) return;
    for (const constraints of [{ zoom: 1 } as MediaTrackConstraints, { advanced: [{ zoom: 1 } as MediaTrackConstraintSet] } as MediaTrackConstraints]) {
      try {
        await chosen!.applyConstraints(constraints);
        return;
      } catch {
        // try the other spelling
      }
    }
  }

  /** Where the current camera sits in `_devices`: by the remembered id, else
   *  by the track's reported deviceId, else unknown (-1 → the first switch
   *  goes to the first listed camera). */
  private _indexOfCurrent(preferredId: string | null): number {
    const ids = this._devices.map((d) => d.deviceId);
    const reported = this._currentDeviceId;
    for (const id of [preferredId, reported]) {
      if (id) {
        const at = ids.indexOf(id);
        if (at >= 0) return at;
      }
    }
    return -1;
  }

  private async _listDevices(md: MediaDevices): Promise<void> {
    if (typeof md.enumerateDevices !== "function") return;
    try {
      this._devices = (await md.enumerateDevices()).filter((d) => d.kind === "videoinput" && !!d.deviceId);
    } catch {
      this._devices = [];
    }
  }

  private get _currentDeviceId(): string | undefined {
    return this._stream?.getVideoTracks()[0]?.getSettings().deviceId;
  }

  /** The lens switch: next video input in the browser's list (labels not
   *  needed), by OUR index — the WebView may report no deviceId on the
   *  track, which used to make the cycle restart at the current camera.
   *  A camera that refuses is skipped; the position (2/3) is shown on the
   *  button so a tap visibly did something; the pick is remembered per
   *  browser so the next open starts there. */
  private async _switchCamera(): Promise<void> {
    const md = typeof navigator !== "undefined" ? navigator.mediaDevices : undefined;
    if (!md || this._devices.length < 2 || this._busy) return;
    const ids = this._devices.map((d) => d.deviceId);
    this._busy = true;
    try {
      for (let step = 1; step < ids.length; step++) {
        const at = (this._deviceIndex + step) % ids.length;
        const next = ids[at];
        if (next === this._currentDeviceId && this._deviceIndex < 0) continue; // unknown position, but this one is provably the current camera
        try {
          const stream = await md.getUserMedia({ video: { deviceId: { exact: next } }, audio: false });
          for (const track of this._stream?.getTracks() ?? []) track.stop();
          this._stream = stream;
          this._deviceIndex = at;
          this._switchFailed = false;
          await this._applyZoomOne();
          lsSet(LS_KEYS.cameraDevice, next);
          const video = this._video;
          if (video) {
            video.srcObject = stream;
            try {
              await video.play();
            } catch {
              // see open()
            }
          }
          return;
        } catch {
          // that camera refused — try the next one
        }
      }
      // #161 follow-up: the WebView listed the cameras but honours none of
      // the ids (reported live: "the button is there, a tap does nothing").
      // Ask by facing instead — the id-less request phones still answer —
      // and when that fails too, say so on screen.
      const other: "user" | "environment" = this._facing === "user" ? "environment" : "user";
      for (const facingMode of [{ exact: other }, { ideal: other }]) {
        try {
          const stream = await md.getUserMedia({ video: { facingMode }, audio: false });
          for (const track of this._stream?.getTracks() ?? []) track.stop();
          this._stream = stream;
          this._facing = other;
          this._deviceIndex = this._indexOfCurrent(null);
          this._switchFailed = false;
          await this._applyZoomOne();
          const video = this._video;
          if (video) {
            video.srcObject = stream;
            try {
              await video.play();
            } catch {
              // see open()
            }
          }
          return;
        } catch {
          // try the softer spelling, then give up visibly
        }
      }
      this._switchFailed = true;
    } finally {
      this._busy = false;
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
        ${this._switchFailed ? html`<div class="switch-note" role="status">${t("camera_switch_failed", L)}</div>` : nothing}
        <div class="bar">
          <button type="button" class="cancel" @click=${this.close}>${t("cancel", L)}</button>
          ${this._devices.length > 1
            ? html`<button type="button" class="switch" ?disabled=${this._busy} title=${t("camera_switch_lens", L)} aria-label=${t("camera_switch_lens", L)} @click=${this._switchCamera}>
                <ha-icon icon="mdi:camera-flip-outline"></ha-icon>
                <span class="switch-pos">${this._deviceIndex >= 0 ? `${this._deviceIndex + 1}/${this._devices.length}` : `?/${this._devices.length}`}</span>
              </button>`
            : nothing}
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
    .switch { background: transparent; color: #fff; border: 1px solid rgba(255, 255, 255, 0.6); padding: 10px 12px; }
    .switch ha-icon { --mdc-icon-size: 22px; }
    .switch-pos { font-size: 12px; opacity: 0.85; }
    .switch-note { position: absolute; left: 12px; right: 12px; bottom: 84px; text-align: center; color: #fff; font-size: 13px; text-shadow: 0 1px 2px #000; }
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
