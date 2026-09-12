/** #161: the completion-photo state machine, shared by the complete dialog
 * and the history edit dialog as a Lit ReactiveController.
 *
 * Holds the attached photos (in pick order), remembers which of them THIS
 * session uploaded so an abandoned dialog can drop them again, uploads
 * picked files one after another (a slow connection still shows progress
 * tile by tile), and caps the list — anything beyond `max` is dropped
 * with a note rather than silently.
 *
 * Pre-existing photos (the history edit dialog opens with the entry's
 * `photo_doc_ids`) are seeded via `reset(ids)`: removing one of those only
 * DETACHES it — the file stays in the object's documents — while removing
 * an upload made in this session deletes it straight away.
 */

import type { ReactiveController, ReactiveControllerHost } from "lit";
import type { HomeAssistant } from "../types";
import { t } from "../styles";
import { MAX_COMPLETION_PHOTOS, discardUploadedPhotos, uploadCompletionPhoto } from "./photo-upload";

export interface PhotoUploadOptions {
  /** The object the photos belong to — read per upload, the host may change it. */
  entryId: () => string;
  hass: () => HomeAssistant;
  /** Upper bound on attached photos; defaults to MAX_COMPLETION_PHOTOS. */
  max?: number;
}

export interface AttachedPhoto {
  id: string;
  /** Object URL of the picked file; "" for a pre-existing photo (render by id). */
  preview: string;
}

export class PhotoUploadController implements ReactiveController {
  /** The photos attached so far, in pick order. */
  photos: AttachedPhoto[] = [];
  /** Docs uploaded by THIS session; dropped again on cancel. */
  uploadedIds: string[] = [];
  uploading = false;
  /** Locale key of the last upload problem ("" = none): `photos_limit`
   *  (takes `{max}`), `doc_too_large`, `doc_upload_failed`. */
  errorKey = "";
  readonly max: number;

  constructor(private readonly host: ReactiveControllerHost, private readonly opts: PhotoUploadOptions) {
    this.max = opts.max ?? MAX_COMPLETION_PHOTOS;
    host.addController(this);
  }

  /** Nothing to do on connect — the session starts with reset(). */
  hostConnected(): void {}

  get ids(): string[] {
    return this.photos.map((p) => p.id);
  }

  get remaining(): number {
    return Math.max(this.max - this.photos.length, 0);
  }

  get full(): boolean {
    return this.remaining === 0;
  }

  /** The current error in the host's language ("" when none). */
  errorText(lang: string): string {
    if (!this.errorKey) return "";
    return t(this.errorKey, lang).replace("{max}", String(this.max));
  }

  clearError(): void {
    this.errorKey = "";
  }

  /** Start a session: drop previews of the last one, seed with the photos
   *  already attached (pre-existing ids — never deleted, only detached). */
  reset(existingIds: string[] = []): void {
    this._revokeAll();
    this.photos = existingIds.map((id) => ({ id, preview: "" }));
    this.uploadedIds = [];
    this.uploading = false;
    this.errorKey = "";
    this.host.requestUpdate();
  }

  /** Upload picked or captured files one by one; beyond the cap = note. */
  async addFiles(files: File[]): Promise<void> {
    if (files.length === 0) return;
    const accepted = files.slice(0, this.remaining);
    this.uploading = true;
    this.errorKey = "";
    this.host.requestUpdate();
    try {
      for (const file of accepted) {
        const id = await uploadCompletionPhoto(this.opts.hass(), this.opts.entryId(), file);
        this.uploadedIds = [...this.uploadedIds, id];
        this.photos = [...this.photos, { id, preview: URL.createObjectURL(file) }];
        this.host.requestUpdate();
      }
      if (files.length > accepted.length) this.errorKey = "photos_limit";
    } catch (e) {
      this.errorKey = e instanceof Error && e.message === "doc_too_large" ? "doc_too_large" : "doc_upload_failed";
    } finally {
      this.uploading = false;
      this.host.requestUpdate();
    }
  }

  /** ✕ on a tile: drop it from the list; an upload of this session is
   *  deleted as well (nothing else references it), a pre-existing photo is
   *  only detached. */
  remove(id: string): void {
    const gone = this.photos.find((p) => p.id === id);
    if (gone?.preview) URL.revokeObjectURL(gone.preview);
    this.photos = this.photos.filter((p) => p.id !== id);
    if (this.uploadedIds.includes(id)) {
      this.uploadedIds = this.uploadedIds.filter((x) => x !== id);
      void discardUploadedPhotos(this.opts.hass(), [id]);
    }
    this.host.requestUpdate();
  }

  /** Cancel/close: the uploads of this session are orphans nobody references. */
  discardOrphans(): void {
    if (this.uploadedIds.length === 0) return;
    const orphans = this.uploadedIds;
    this.uploadedIds = [];
    void discardUploadedPhotos(this.opts.hass(), orphans);
  }

  /** After a successful save: the uploads belong to the entry now. */
  markAttached(): void {
    this.uploadedIds = [];
  }

  private _revokeAll(): void {
    for (const p of this.photos) if (p.preview) URL.revokeObjectURL(p.preview);
  }
}
