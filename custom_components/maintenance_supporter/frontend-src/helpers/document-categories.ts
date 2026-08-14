/**
 * Document category tags + their icons — one source for the object-level
 * documents section and the task-documents card (the two carried
 * byte-identical copies before this module).
 *
 * A category is stored as a plain tag on the document; anything outside this
 * list renders as a free-form tag.
 */

export const CATEGORIES = ["manual", "warranty", "invoice", "spare_parts", "photo", "other"] as const;

export const CATEGORY_ICONS: Record<string, string> = {
  manual: "mdi:book-open-variant",
  warranty: "mdi:shield-check",
  invoice: "mdi:receipt-text-outline",
  spare_parts: "mdi:cog-outline",
  photo: "mdi:image-outline",
  other: "mdi:file-document-outline",
};
