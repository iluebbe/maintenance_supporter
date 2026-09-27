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
 *
 * A session ends with reset() (next open), discardOrphans() (Cancel/close)
 * or markAttached() (saved). An upload still in flight at that moment
 * belongs to NO session any more: when it lands it is discarded at once
 * instead of joining the next session's list or lingering as an orphan
 * (bug audit 2026-09-26 #2). The hosts keep Save disabled while
 * `uploading`, so a save never races its own upload.
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
  /** Bumped whenever a session ends — an upload started under an older
   *  value landed after its dialog was gone. */
  private _session = 0;
  /** The object each upload of this session went to — the discard names
   *  it, and the host may point at another object by the time it runs. */
  private _uploadEntry = new Map<string, string>();

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
    this._endSession();
    this._revokeAll();
    this.photos = existingIds.map((id) => ({ id, preview: "" }));
    this.uploadedIds = [];
    this._uploadEntry.clear();
    this.errorKey = "";
    this.host.requestUpdate();
  }

  /** Upload picked or captured files one by one; beyond the cap = note. */
  async addFiles(files: File[]): Promise<void> {
    if (files.length === 0) return;
    const session = this._session;
    const hass = this.opts.hass();
    const entryId = this.opts.entryId();
    const accepted = files.slice(0, this.remaining);
    this.uploading = true;
    this.errorKey = "";
    this.host.requestUpdate();
    try {
      for (const file of accepted) {
        const id = await uploadCompletionPhoto(hass, entryId, file);
        if (session !== this._session) {
          // The dialog was closed (or saved, or reopened) while this file
          // was on its way: nothing will ever reference it.
          void discardUploadedPhotos(hass, entryId, [id]);
          return;
        }
        this.uploadedIds = [...this.uploadedIds, id];
        this._uploadEntry.set(id, entryId);
        this.photos = [...this.photos, { id, preview: URL.createObjectURL(file) }];
        this.host.requestUpdate();
      }
      if (files.length > accepted.length) this.errorKey = "photos_limit";
    } catch (e) {
      if (session !== this._session) return;
      this.errorKey = e instanceof Error && e.message === "doc_too_large" ? "doc_too_large" : "doc_upload_failed";
    } finally {
      // A newer session owns the flag now — never clear ITS upload state.
      if (session === this._session) {
        this.uploading = false;
        this.host.requestUpdate();
      }
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
      this._discard([id]);
    }
    this.host.requestUpdate();
  }

  /** Cancel/close: the uploads of this session are orphans nobody
   *  references — and so is any upload still in flight. */
  discardOrphans(): void {
    this._endSession();
    if (this.uploadedIds.length === 0) return;
    const orphans = this.uploadedIds;
    this.uploadedIds = [];
    this._discard(orphans);
  }

  /** After a successful save: the uploads belong to the entry now. */
  markAttached(): void {
    this._endSession();
    this.uploadedIds = [];
    this._uploadEntry.clear();
  }

  /** Close the session: late uploads get discarded on arrival. */
  private _endSession(): void {
    this._session++;
    this.uploading = false;
  }

  /** Discard uploads of this session, each against the object it went to. */
  private _discard(ids: string[]): void {
    const byEntry = new Map<string, string[]>();
    for (const id of ids) {
      const entryId = this._uploadEntry.get(id) ?? this.opts.entryId();
      this._uploadEntry.delete(id);
      byEntry.set(entryId, [...(byEntry.get(entryId) ?? []), id]);
    }
    const hass = this.opts.hass();
    for (const [entryId, docIds] of byEntry) void discardUploadedPhotos(hass, entryId, docIds);
  }

  private _revokeAll(): void {
    for (const p of this.photos) if (p.preview) URL.revokeObjectURL(p.preview);
  }
}
