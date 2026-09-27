/**
 * In-app camera (#161 follow-up).
 *
 * The Android Companion app's file chooser ignores `capture="environment"`
 * on `<input type="file">` — "Take photo" opens the same picker as
 * "Choose photo", and there is no camera in it. Until the app honours the
 * capture hint, the panel brings its own viewfinder: a full-screen overlay
 * on `getUserMedia()` with a Capture and a Cancel button; a shot is drawn
 * to a canvas and handed on as a JPEG `File`, so the callers' upload paths
 * do not change.
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

/** How patiently a camera change waits for the camera it asks for (#161,
 *  Galaxy S26 Ultra). Android's camera service keeps a released camera
 *  registered for a moment after close on some phones; while it is, a
 *  DIFFERENT camera is refused ("Could not start video source") although
 *  the SAME one would reopen at once. So a busy answer is retried every
 *  `retryMs` until `windowMs` has passed — the rhythm CameraX uses. */
export interface CameraTiming {
  retryMs: number;
  windowMs: number;
}
export const CAMERA_TIMING: Readonly<CameraTiming> = { retryMs: 500, windowMs: 5000 };

/** Refusals that mean "held right now" — worth waiting for. Any other one
 *  (an id this WebView does not honour, a denied permission) is final. */
const BUSY_ERRORS = new Set(["NotReadableError", "AbortError", "TrackStartError"]);

/** Lines kept for the details panel. */
const LOG_LIMIT = 80;

type Outcome = "ok" | "busy" | "refused" | "cancelled";

interface Candidate {
  video: MediaTrackConstraints;
  /** What the details panel calls it: the camera's label, or the request. */
  what: string;
  deviceId?: string;
}

const BACK_LABEL = /back|rear|environment|rück|hinten/i;
const FRONT_LABEL = /front|user|selfie|vorne/i;

function cameraNumber(label: string): number {
  const m = /camera2?\s*(\d+)/i.exec(label);
  return m ? Number(m[1]) : Number.MAX_SAFE_INTEGER;
}

/** The camera the viewfinder should open with once labels are readable: the
 *  one the user switched to last time (by label — the WebView salts device
 *  ids per page, so a stored id never matched again), else the MAIN back
 *  module. Android names it "camera2 0, facing back"; the ultra-wide and
 *  tele modules carry higher numbers, and Chromium lists them FIRST, so
 *  `facingMode: "environment"` hands out the ultra-wide one on Samsung
 *  phones. Null when no camera is labelled. */
export function preferredCamera(devices: MediaDeviceInfo[], rememberedLabel: string | null): MediaDeviceInfo | null {
  if (rememberedLabel) {
    const hit = devices.find((d) => d.label === rememberedLabel);
    if (hit) return hit;
  }
  const back = devices
    .filter((d) => d.label && BACK_LABEL.test(d.label))
    .sort((a, b) => cameraNumber(a.label) - cameraNumber(b.label));
  return back[0] ?? null;
}

const errorName = (e: unknown): string => (e as { name?: string } | null)?.name || "Error";
const errorMessage = (e: unknown): string => (e as { message?: string } | null)?.message || "";

export class MsCameraCapture extends LitElement {
  @property({ type: String }) lang = "en";
  @state() private _open = false;
  @state() private _busy = false;
  /** A camera change is waiting for the camera it asked for. */
  @state() private _switching = false;
  /** Every video input the browser lists (labels are empty until the app
   *  process holds the camera permission — the ids are what the lens switch
   *  cycles through). */
  @state() private _devices: MediaDeviceInfo[] = [];
  /** Position in `_devices` of the camera we are showing. Kept by us: the
   *  Android WebView often reports no `deviceId` in the track settings. */
  @state() private _deviceIndex = -1;
  /** The camera asked for did not answer and the previous one runs again —
   *  said on screen, with the details a bug report needs. */
  @state() private _switchFailed = false;
  @state() private _copied = false;
  /** Retry rhythm for a busy camera; tests shorten it. */
  timing: CameraTiming = { ...CAMERA_TIMING };
  /** Which way we believe the current camera faces (for the id-less fallback). */
  private _facing: "user" | "environment" = "environment";
  private _stream: MediaStream | null = null;
  /** Set while open() is acquiring the camera. `_open` only flips once the
   *  stream is attached, so a double tap started TWO getUserMedia calls —
   *  the first stream was overwritten, never stopped, and kept the camera
   *  (and its LED) busy (bug audit 2026-09-26). */
  private _opening = false;
  /** Bumped by close() and by leaving the DOM: a camera call started under
   *  an older generation hands its stream back instead of keeping the camera
   *  (and its LED) on with no viewfinder to close (bug audit 2026-09-26 #2) —
   *  retries can now run for seconds, so Cancel must end them too. */
  private _gen = 0;
  /** Cameras that stayed busy for a whole retry window in this session: the
   *  next tap moves past them instead of waiting on them again. */
  private _refused = new Set<string>();
  /** What happened, for the details panel (#161: the reporter's phone is the
   *  only place the real refusal can be seen). */
  private _log: string[] = [];
  private _t0 = 0;
  private _lastError = "";

  /** Open the viewfinder. Resolves once the stream is attached or the
   *  fallback event has fired — callers do not need to await it. */
  async open(): Promise<void> {
    if (this._open || this._opening) return;
    this._opening = true;
    const gen = ++this._gen;
    try {
      await this._acquireAndShow(gen);
    } finally {
      this._opening = false;
    }
  }

  private _live(gen: number): boolean {
    return gen === this._gen && this.isConnected;
  }

  private async _acquireAndShow(gen: number): Promise<void> {
    const md = typeof navigator !== "undefined" ? navigator.mediaDevices : undefined;
    if (!md || typeof md.getUserMedia !== "function") {
      this._unavailable("no_media_devices");
      return;
    }
    this._log = [];
    this._t0 = Date.now();
    this._lastError = "";
    this._refused.clear();
    this._switchFailed = false;
    this._copied = false;
    this._note(navigator.userAgent);
    const remembered = lsGet(LS_KEYS.cameraLabel);
    // Labels are readable BEFORE the request once this app process holds the
    // camera permission (every open after the first): go straight to the
    // camera we want and never wake the ultra-wide module.
    let devices = await this._enumerate(md);
    if (!this._live(gen)) return;
    const cold = preferredCamera(devices, remembered);
    let outcome: Outcome = "refused";
    if (cold) outcome = await this._openPatiently(md, gen, this._byDevice(cold));
    if (outcome === "cancelled") return;
    if (outcome !== "ok") {
      // First open (no labels before the grant), or the camera we wanted
      // refused: ask by facing — Android may hand out the ultra-wide module
      // here; it is replaced below once the labels are readable.
      outcome = await this._openPatiently(md, gen, { video: { facingMode: { ideal: "environment" } }, what: "facing environment" });
      if (outcome === "cancelled") return;
      if (outcome !== "ok") {
        this._unavailable(this._lastError || "camera_unavailable");
        return;
      }
      devices = await this._enumerate(md);
      if (!this._live(gen)) {
        this._stopStream();
        return;
      }
    }
    this._devices = devices;
    this._deviceIndex = this._indexOfCurrent();
    this._facing = this._currentFacing();
    this._open = true;
    await this.updateComplete;
    if (!this._live(gen)) {
      this._stopStream();
      this._open = false;
      return;
    }
    await this._attach();
    const want = cold ? null : preferredCamera(devices, remembered);
    const current = this._deviceIndex >= 0 ? devices[this._deviceIndex] : undefined;
    if (!want || want.deviceId === current?.deviceId) return;
    const got = await this._replace(md, gen, [this._byDevice(want)], this._restoreCandidates(current));
    if (got === "cancelled") return;
    if (got === "lost") {
      this._unavailable("camera_lost");
      return;
    }
    this._settle(got);
  }

  /** One camera, patiently: a busy answer is retried every `retryMs` until
   *  `windowMs` has passed; any other refusal ends at once. Every attempt is
   *  logged for the details panel. */
  private async _openPatiently(md: MediaDevices, gen: number, c: Candidate): Promise<Outcome> {
    const start = Date.now();
    for (;;) {
      let stream: MediaStream;
      try {
        stream = await md.getUserMedia({ video: c.video, audio: false });
      } catch (e) {
        const name = errorName(e);
        const message = errorMessage(e);
        this._lastError = name;
        this._note(`${c.what} → ${name}${message && message !== name ? `: ${message}` : ""}`);
        if (!this._live(gen)) return "cancelled";
        if (!BUSY_ERRORS.has(name)) return "refused";
        if (Date.now() - start + this.timing.retryMs > this.timing.windowMs) return "busy";
        await new Promise((r) => setTimeout(r, this.timing.retryMs));
        if (!this._live(gen)) return "cancelled";
        continue;
      }
      if (!this._live(gen)) {
        for (const track of stream.getTracks()) track.stop();
        return "cancelled";
      }
      this._stream = stream;
      this._note(`${c.what} → ok (${this._describeTrack()})`);
      return "ok";
    }
  }

  /** Replace the running camera. The current one is released FIRST (many
   *  phones open one camera at a time), then the targets are tried in order:
   *  one the WebView refuses outright is skipped at once, one that stays
   *  busy for the whole window ends the attempt (it is remembered as refused
   *  so the next tap moves past it). Nothing sweeps through the other
   *  cameras back to back and nothing reopens the previous camera right
   *  away — both kept the phone's camera service from ever letting go
   *  (#161, v2.92). When no target answers, `restore` brings the previous
   *  camera back (the same camera reopens at once). */
  private async _replace(md: MediaDevices, gen: number, targets: Candidate[], restore: Candidate[]): Promise<Candidate | "restored" | "lost" | "cancelled"> {
    this._switching = true;
    this._stopStream();
    try {
      for (const c of targets) {
        const r = await this._openPatiently(md, gen, c);
        if (r === "ok") return c;
        if (r === "cancelled") return r;
        if (r === "busy") {
          if (c.deviceId) this._refused.add(c.deviceId);
          break;
        }
      }
      for (const c of restore) {
        const r = await this._openPatiently(md, gen, c);
        if (r === "ok") return "restored";
        if (r === "cancelled") return r;
      }
      return "lost";
    } finally {
      this._switching = false;
    }
  }

  /** Book-keeping after `_replace` settled on a stream. Returns whether the
   *  camera asked for is the one now running. */
  private _settle(got: Candidate | "restored"): boolean {
    if (got === "restored") {
      // the previous camera again: keep its position unless the track says otherwise
      this._switchFailed = true;
      const at = this._indexOfCurrent();
      if (at >= 0) this._deviceIndex = at;
      void this._attach();
      return false;
    }
    this._switchFailed = false;
    const at = got.deviceId ? this._devices.findIndex((d) => d.deviceId === got.deviceId) : -1;
    this._deviceIndex = at >= 0 ? at : this._indexOfCurrent();
    this._facing = this._currentFacing();
    void this._attach();
    return true;
  }

  private _byDevice(d: MediaDeviceInfo): Candidate {
    return { video: { deviceId: { exact: d.deviceId } }, what: d.label || "camera (no label)", deviceId: d.deviceId };
  }

  /** How to get the previous camera back: by id (the same camera reopens at
   *  once even while the phone still holds it), else by facing. */
  private _restoreCandidates(previous: MediaDeviceInfo | undefined, previousId?: string): Candidate[] {
    const out: Candidate[] = [];
    const id = previous?.deviceId || previousId;
    if (id) out.push({ video: { deviceId: { exact: id } }, what: `${previous?.label || "previous camera"} (back again)`, deviceId: id });
    out.push({ video: { facingMode: { ideal: this._facing } }, what: `facing ${this._facing} (back again)` });
    return out;
  }

  /** Show the stream we now hold in the viewfinder. */
  private async _attach(): Promise<void> {
    const video = this._video;
    if (!video || !this._stream) return;
    video.srcObject = this._stream;
    try {
      await video.play();
    } catch {
      // autoplay refused — the muted, playsinline video still shows the
      // first frame on user gesture; Capture keeps working.
    }
  }

  private async _enumerate(md: MediaDevices): Promise<MediaDeviceInfo[]> {
    if (typeof md.enumerateDevices !== "function") return [];
    try {
      const list = (await md.enumerateDevices()).filter((d) => d.kind === "videoinput" && !!d.deviceId);
      this._note(`cameras: ${list.map((d) => d.label || "(no label)").join(" | ") || "none listed"}`);
      return list;
    } catch (e) {
      this._note(`enumerateDevices → ${errorName(e)}`);
      return [];
    }
  }

  /** Where the running camera sits in `_devices`: by the track's reported
   *  deviceId, else by its label (Chromium names the track after the
   *  camera), else unknown (-1). */
  private _indexOfCurrent(): number {
    const track = this._stream?.getVideoTracks()[0];
    if (!track) return -1;
    const id = track.getSettings().deviceId;
    const byId = id ? this._devices.findIndex((d) => d.deviceId === id) : -1;
    if (byId >= 0) return byId;
    return track.label ? this._devices.findIndex((d) => d.label === track.label) : -1;
  }

  private _currentFacing(): "user" | "environment" {
    const track = this._stream?.getVideoTracks()[0];
    const reported = track?.getSettings().facingMode;
    if (reported === "user" || reported === "environment") return reported;
    const label = (this._deviceIndex >= 0 ? this._devices[this._deviceIndex]?.label : "") || track?.label || "";
    if (FRONT_LABEL.test(label)) return "user";
    if (BACK_LABEL.test(label)) return "environment";
    return this._facing;
  }

  private _describeTrack(): string {
    const track = this._stream?.getVideoTracks()[0];
    if (!track) return "no track";
    const s = track.getSettings();
    const size = s.width && s.height ? `${s.width}×${s.height}` : "size ?";
    return [track.label || "no label", size, s.facingMode].filter(Boolean).join(", ");
  }

  private _note(line: string): void {
    this._log.push(`+${Date.now() - this._t0} ms ${line}`);
    if (this._log.length > LOG_LIMIT) this._log.splice(1, this._log.length - LOG_LIMIT);
  }

  /** The lens switch: the NEXT video input in the browser's list (labels not
   *  needed), by OUR index. One camera per tap, asked for patiently; one that
   *  stayed busy is skipped on the next tap. When the WebView honours none
   *  of the ids, the opposite facing mode is asked for, and when nothing
   *  answers the previous camera comes back with a note and the details.
   *  The pick is remembered by label (a front camera is not — the next open
   *  should not greet the user with a selfie). */
  private async _switchCamera(): Promise<void> {
    const md = typeof navigator !== "undefined" ? navigator.mediaDevices : undefined;
    if (!md || this._devices.length < 2 || this._busy || this._switching) return;
    const gen = this._gen;
    const from = this._deviceIndex;
    const previous = from >= 0 ? this._devices[from] : undefined;
    const previousId = this._stream?.getVideoTracks()[0]?.getSettings().deviceId || previous?.deviceId;
    const other: "user" | "environment" = this._facing === "user" ? "environment" : "user";
    let order = this._nextCameras(from, previousId);
    if (!order.length && this._refused.size) {
      // every other camera was busy before — give them another chance
      this._refused.clear();
      order = this._nextCameras(from, previousId);
    }
    this._note(`switch from ${previous?.label || "unknown camera"}`);
    const targets: Candidate[] = [
      ...order.map((at) => this._byDevice(this._devices[at])),
      { video: { facingMode: { exact: other } }, what: `facing ${other} (exact)` },
      { video: { facingMode: { ideal: other } }, what: `facing ${other}` },
    ];
    this._busy = true;
    this._switchFailed = false;
    this._copied = false;
    try {
      const got = await this._replace(md, gen, targets, this._restoreCandidates(previous, previousId));
      if (got === "cancelled") return;
      if (got === "lost") {
        this._unavailable("camera_lost");
        return;
      }
      if (got !== "restored" && !got.deviceId) {
        // Asked by facing: an "ideal" answer may be the same camera again.
        if (this._isCamera(previousId, this._facing)) {
          this._switchFailed = true;
          await this._attach();
          return;
        }
        this._facing = other;
      }
      if (this._settle(got) && got !== "restored" && got.deviceId) {
        const label = this._devices[this._deviceIndex]?.label ?? "";
        if (label) lsSet(LS_KEYS.cameraLabel, FRONT_LABEL.test(label) ? "" : label);
      }
    } finally {
      this._busy = false;
    }
  }

  /** Indices of the cameras after `from` in list order, without the running
   *  one and the ones refused this session. Unknown position (-1): all. */
  private _nextCameras(from: number, currentId: string | undefined): number[] {
    const n = this._devices.length;
    const out: number[] = [];
    for (let step = 1; step <= (from < 0 ? n : n - 1); step++) {
      const at = (from + step) % n;
      const id = this._devices[at].deviceId;
      if (id === currentId || this._refused.has(id)) continue;
      out.push(at);
    }
    return out;
  }

  /** Whether the stream we hold is provably the camera described — by id
   *  when both sides report one, else by reported facing mode. */
  private _isCamera(deviceId: string | undefined, facing: "user" | "environment"): boolean {
    const settings = this._stream?.getVideoTracks()[0]?.getSettings();
    if (deviceId && settings?.deviceId) return settings.deviceId === deviceId;
    return !!settings?.facingMode && settings.facingMode === facing;
  }

  close(): void {
    this._gen++;
    this._stopStream();
    this._open = false;
    this._busy = false;
    this._switching = false;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._gen++;
    this._stopStream();
  }

  private get _video(): HTMLVideoElement | null {
    return this.shadowRoot?.querySelector("video") ?? null;
  }

  /** Release the camera and empty the viewfinder. */
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

  /** Copy the details for a bug report. The clipboard API needs a secure
   *  origin (a LAN http:// instance has none): fall back to selecting the
   *  text, which the user can then copy by hand. */
  private async _copyLog(): Promise<void> {
    const text = this._log.join("\n");
    let ok = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        ok = true;
      }
    } catch {
      // not allowed here — select instead
    }
    if (!ok) {
      const area = this.shadowRoot?.querySelector<HTMLTextAreaElement>(".details textarea");
      if (area) {
        area.focus();
        area.select();
        try {
          ok = document.execCommand("copy");
        } catch {
          ok = false;
        }
      }
    }
    this._copied = ok;
  }

  private async _shoot(): Promise<void> {
    const video = this._video;
    if (!video || this._busy || this._switching) return;
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
    const locked = this._busy || this._switching;
    return html`
      <div class="overlay" role="dialog" aria-modal="true" aria-label=${t("doc_camera", L)}>
        <video autoplay playsinline muted></video>
        ${this._switching ? html`<div class="switching" role="status">${t("camera_switching", L)}</div>` : nothing}
        ${this._switchFailed
          ? html`<div class="switch-note" role="status">
              <div>${t("camera_not_answered", L)}</div>
              <details class="details">
                <summary>${t("camera_diagnostics", L)}</summary>
                <textarea readonly rows="6" .value=${this._log.join("\n")}></textarea>
                <button type="button" class="copy" @click=${this._copyLog}>${t(this._copied ? "camera_copied" : "camera_copy", L)}</button>
              </details>
            </div>`
          : nothing}
        <div class="bar">
          <button type="button" class="cancel" @click=${this.close}>${t("cancel", L)}</button>
          ${this._devices.length > 1
            ? html`<button type="button" class="switch" ?disabled=${locked} title=${t("camera_switch_lens", L)} aria-label=${t("camera_switch_lens", L)} @click=${this._switchCamera}>
                <ha-icon icon="mdi:camera-flip-outline"></ha-icon>
                <span class="switch-pos">${this._deviceIndex >= 0 ? `${this._deviceIndex + 1}/${this._devices.length}` : `?/${this._devices.length}`}</span>
              </button>`
            : nothing}
          <button type="button" class="shoot" ?disabled=${locked} @click=${this._shoot}>
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
    .switch[disabled] { opacity: 0.5; cursor: default; }
    .switch ha-icon { --mdc-icon-size: 22px; }
    .switch-pos { font-size: 12px; opacity: 0.85; }
    .switching {
      position: absolute; top: 45%; left: 50%; transform: translate(-50%, -50%);
      padding: 8px 16px; border-radius: 16px; background: rgba(0, 0, 0, 0.6); font-size: 14px;
    }
    .switch-note {
      position: absolute; left: 12px; right: 12px; bottom: 84px; max-height: 60%; overflow: auto;
      text-align: center; color: #fff; font-size: 13px; text-shadow: 0 1px 2px #000;
    }
    .details { margin-top: 6px; text-align: start; text-shadow: none; }
    .details summary { cursor: pointer; text-align: center; opacity: 0.85; }
    .details textarea {
      display: block; box-sizing: border-box; width: 100%; margin: 6px 0;
      font: 11px/1.35 monospace; color: #fff; background: rgba(255, 255, 255, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 6px; padding: 6px; resize: vertical;
    }
    .copy { background: transparent; color: #fff; border: 1px solid rgba(255, 255, 255, 0.6); padding: 6px 14px; font-size: 13px; }
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
