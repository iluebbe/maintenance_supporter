/** #161: the photos of one history entry, whichever shape it carries.
 *
 * Entries written before multi-photo hold a single `photo_doc_id`; newer
 * ones carry `photo_doc_ids`. Mirrors `helpers/completion_photos.py`
 * (legacy scalar first, strings only, de-duplicated, capped).
 */

/** Upper bound per completion — mirrors MAX_COMPLETION_PHOTOS in Python. */
export const MAX_COMPLETION_PHOTOS = 10;

type PhotoBearing = {
  photo_doc_id?: unknown;
  photo_doc_ids?: unknown;
};

/** Ordered, de-duplicated photo document ids of a history entry. */
export function historyPhotoIds(entry: PhotoBearing | Record<string, unknown> | null | undefined): string[] {
  if (!entry) return [];
  const raw: unknown[] = [];
  const legacy = (entry as PhotoBearing).photo_doc_id;
  if (typeof legacy === "string") raw.push(legacy);
  const list = (entry as PhotoBearing).photo_doc_ids;
  if (Array.isArray(list)) raw.push(...list);
  const out: string[] = [];
  for (const item of raw) {
    if (typeof item !== "string") continue;
    const id = item.trim();
    if (!id || out.includes(id)) continue;
    out.push(id);
    if (out.length >= MAX_COMPLETION_PHOTOS) break;
  }
  return out;
}
