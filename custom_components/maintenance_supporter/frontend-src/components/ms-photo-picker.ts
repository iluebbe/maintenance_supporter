/**
 * <ms-photo-picker> — the "Take photo" / "Choose photos" pair (#161).
 *
 * One element for every surface that takes photos (complete dialog,
 * history edit dialog, documents section), so the Companion-app quirks
 * live in ONE place:
 *
 *   - The Android app answers a `<input type="file" multiple>` pick with an
 *     EMPTY file list (helpers/companion.ts), so the gallery input is
 *     single-select there, the label says "Choose photo" and a hint says
 *     each pick is added.
 *   - The Android app's chooser ignores `capture=`, so "Take photo" opens
 *     the in-app viewfinder (<ms-camera-capture>) there; when the camera
 *     cannot be opened the native input takes over for the rest of the
 *     element's life.
 *
 * Renders into the LIGHT DOM (no shadow root): the host's stylesheet must
 * include `photoPickerStyles`, and the host can query `.photo-pick-camera
 * input` / `.photo-pick-gallery input` / `ms-camera-capture` directly.
 *
 * Emits `files-picked` `{ files: File[] }` (bubbles, composed) for a native
 * pick and for an in-app shot alike; the host uploads.
 */

import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { t } from "../styles";
import { isAndroidCompanion } from "../helpers/companion";
import "./camera-capture";
import { inAppCameraPreferred, type MsCameraCapture } from "./camera-capture";

/** Styles for the picker's light-DOM markup — add to every host's `styles`. */
export const photoPickerStyles = css`
  ms-photo-picker { display: contents; }
  .photo-pickers {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .photo-pick {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border: 1px dashed var(--divider-color);
    border-radius: 8px;
    cursor: pointer;
    font-size: 13px;
    color: var(--secondary-text-color);
    width: fit-content;
  }
  .photo-pick:hover { border-color: var(--primary-color); }
  .photo-pick:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }
  .photo-pick.disabled { opacity: 0.6; cursor: default; }
  .photo-pick input[type="file"] { display: none; }
  .photo-android-hint {
    font-size: 12px;
    color: var(--secondary-text-color);
    margin-top: 4px;
  }
`;

export class MsPhotoPicker extends LitElement {
  @property({ type: String }) lang = "en";
  /** Host-side lock (e.g. saving): both inputs refuse a pick. */
  @property({ type: Boolean }) disabled = false;
  /** An upload is running: inputs locked, the camera label says so. */
  @property({ type: Boolean }) busy = false;
  @property({ type: String }) accept = "image/*";
  @property({ type: Boolean }) showCamera = true;
  @property({ type: Boolean }) showGallery = true;
  /** Icon-only labels (text moves to aria-label/title) — toolbar buttons. */
  @property({ type: Boolean }) compact = false;
  /** Files the host still accepts; 0 renders nothing (the host shows its
   *  own "limit reached" note). */
  @property({ type: Number }) remaining = Infinity;

  /** Evaluated once per element; the host app does not change. */
  private readonly _singlePick = isAndroidCompanion();
  @state() private _inAppCamera = inAppCameraPreferred();

  /** Light DOM: the host styles the markup and can query the inputs. */
  protected createRenderRoot(): HTMLElement {
    return this;
  }

  private get _locked(): boolean {
    return this.disabled || this.busy;
  }

  private _emit(files: File[]): void {
    if (files.length === 0) return;
    this.dispatchEvent(new CustomEvent("files-picked", { detail: { files }, bubbles: true, composed: true }));
  }

  private _onInput(e: Event): void {
    const input = e.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    input.value = ""; // allow re-picking the same file
    this._emit(files);
  }

  private _onCameraClick(e: Event): void {
    if (!this._inAppCamera || this._locked) return;
    e.preventDefault();
    void this.querySelector<MsCameraCapture>("ms-camera-capture")?.open();
  }

  private _onCameraUnavailable(): void {
    this._inAppCamera = false;
    this.querySelector<HTMLInputElement>(".photo-pick-camera input")?.click();
  }

  /** Keyboard support for the <label>s (Enter/Space = click). */
  private _onKeydown(e: KeyboardEvent): void {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    if (this._locked) return;
    (e.currentTarget as HTMLElement).click();
  }

  render() {
    if (this.remaining <= 0 || (!this.showCamera && !this.showGallery)) return nothing;
    const L = this.lang;
    const cls = this._locked ? "disabled" : "";
    const cameraText = this.busy ? t("uploading", L) : t("doc_camera", L);
    const galleryText = t(this._singlePick ? "choose_photo" : "choose_photos", L);
    return html`
      <div class="photo-pickers">
        ${this.showCamera
          ? html`<label class="photo-pick photo-pick-camera ${cls}" role="button" tabindex="0"
              aria-label=${cameraText} title=${this.compact ? cameraText : nothing}
              @click=${this._onCameraClick} @keydown=${this._onKeydown}>
              <ha-icon icon="mdi:camera"></ha-icon>
              ${this.compact ? nothing : html`<span>${cameraText}</span>`}
              <input type="file" accept=${this.accept} capture="environment"
                ?disabled=${this._locked} @change=${this._onInput} />
            </label>`
          : nothing}
        ${this.showGallery
          ? html`<label class="photo-pick photo-pick-gallery ${cls}" role="button" tabindex="0"
              aria-label=${galleryText} title=${this.compact ? galleryText : nothing}
              @keydown=${this._onKeydown}>
              <ha-icon icon="mdi:image-multiple"></ha-icon>
              ${this.compact ? nothing : html`<span>${galleryText}</span>`}
              <input type="file" accept=${this.accept} ?multiple=${!this._singlePick}
                ?disabled=${this._locked} @change=${this._onInput} />
            </label>`
          : nothing}
      </div>
      ${this.showGallery && this._singlePick
        ? html`<div class="photo-android-hint">${t("photos_android_hint", L)}</div>`
        : nothing}
      ${this.showCamera && this._inAppCamera
        ? html`<ms-camera-capture .lang=${L}
            @photo-captured=${(e: CustomEvent<{ file: File }>) => this._emit([e.detail.file])}
            @capture-unavailable=${this._onCameraUnavailable}></ms-camera-capture>`
        : nothing}
    `;
  }
}

if (!customElements.get("ms-photo-picker")) {
  customElements.define("ms-photo-picker", MsPhotoPicker);
}

declare global {
  interface HTMLElementTagNameMap {
    "ms-photo-picker": MsPhotoPicker;
  }
}
