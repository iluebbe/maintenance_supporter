/**
 * Rendering task→part links when the pool may belong to ANOTHER object (#111).
 *
 * A link without `entry_id` consumes a part of the task's own object — every
 * link written before this feature, and still the default. With `entry_id` it
 * draws on a pool owned by that other object: three robot vacuums, one box of
 * dust bags, one number that is the real number.
 *
 * Every surface that displays a link goes through here, because the failure
 * that must not happen is silent: resolving `part_id` against the task's own
 * object only, missing, and rendering an empty string. The user would see a
 * task that consumes "" and never learn which shelf it drains. Here an
 * unresolvable link degrades to a visible "Unknown part" instead.
 */

import type { MaintenanceObjectResponse, MaintenancePart, TaskPartLink } from "../types";
import { t } from "../styles";

/** The subset of an object response this module needs — the panel and the card
 *  both hold full `MaintenanceObjectResponse`s, tests can pass less. */
export type PartOwner = Pick<MaintenanceObjectResponse, "entry_id" | "object" | "parts">;

/**
 * Stable identity of a link: the (entry_id, part_id) PAIR, never the id alone.
 *
 * Part ids are uuid4 in general, but the battery fleet mints deterministic ones
 * (`batt_aa`), so two objects genuinely can carry the same id — keying a
 * selection map by part_id alone would silently merge two different pools into
 * one checkbox.
 *
 * NUL-separated rather than a printable character: part ids are trimmed but not
 * forbidden from containing one, and "a b"+"c" must not key the same as
 * "a"+"b c".
 */
export function partLinkKey(link: { part_id: string; entry_id?: string }): string {
  return `${link.entry_id ?? ""}\u0000${link.part_id}`;
}

/** A part offered in a picker, tagged with the pool it actually belongs to. */
export interface LinkedPart extends MaintenancePart {
  /** Only set when the pool is owned by another object. */
  entry_id?: string;
  /** Owning object's name — only set when foreign, and what makes it visible. */
  owner_name?: string;
}

export interface ResolvedPartLink {
  /** The part definition, or null when nothing answers to that id any more. */
  part: MaintenancePart | null;
  /** True when the pool is owned by an object other than the task's. */
  foreign: boolean;
  /** Owning object's name; "" for an own part or an owner that is gone. */
  ownerName: string;
  /** Never empty: "Dust bags (Shelf)", "Dust bags", or "Unknown part". */
  label: string;
}

/** Resolve a link against the full object list — own parts and foreign pools. */
export function resolvePartLink(
  link: TaskPartLink,
  ownEntryId: string,
  objects: readonly PartOwner[],
  lang?: string,
): ResolvedPartLink {
  const foreign = !!link.entry_id && link.entry_id !== ownEntryId;
  const ownerId = foreign ? link.entry_id! : ownEntryId;
  const owner = objects.find((o) => o.entry_id === ownerId);
  const part = (owner?.parts || []).find((p) => p.id === link.part_id) || null;
  // Only a foreign pool gets an owner suffix: an own part reads exactly as it
  // always has, so nothing changes for the overwhelmingly common link.
  const ownerName = foreign ? owner?.object?.name || "" : "";
  const base = part?.name || t("shared_part_unknown", lang);
  return { part, foreign, ownerName, label: ownerName ? `${base} (${ownerName})` : base };
}

/**
 * One line describing a link: "2× Dust bags (Shelf) (6 pcs) — Rack 3".
 *
 * Shared by the printable work sheet and the completion dialog's hint, which
 * had built the identical string from two copies of the same lookup.
 */
export function describePartLink(
  link: TaskPartLink,
  ownEntryId: string,
  objects: readonly PartOwner[],
  lang?: string,
): string {
  const { part, label } = resolvePartLink(link, ownEntryId, objects, lang);
  const stock =
    part && part.stock !== null && part.stock !== undefined
      ? ` (${part.stock}${part.unit ? " " + part.unit : ""})`
      : "";
  const loc = part?.storage_location ? ` — ${part.storage_location}` : "";
  return `${link.quantity}× ${label}${stock}${loc}`;
}

/**
 * The parts the completion dialog offers for this task.
 *
 * The object's own inventory (the user may have used something the task does
 * not normally consume) plus every foreign pool this task actually links to.
 * Other objects' remaining parts are deliberately absent — a completion picks
 * from what is at hand, and listing every object's inventory would bury the
 * object's own. Adding a NEW shared pool is the task dialog's job.
 */
export function partsForCompletion(
  task: { consumes_parts?: TaskPartLink[] | null } | null | undefined,
  ownEntryId: string,
  objects: readonly PartOwner[],
  lang?: string,
): LinkedPart[] {
  const own = objects.find((o) => o.entry_id === ownEntryId)?.parts || [];
  const out: LinkedPart[] = own.map((p) => ({ ...p }));
  const seen = new Set(out.map((p) => partLinkKey({ part_id: p.id })));
  for (const link of task?.consumes_parts || []) {
    if (!link.entry_id || link.entry_id === ownEntryId) continue;
    const key = partLinkKey(link);
    if (seen.has(key)) continue;
    seen.add(key);
    const { part, ownerName } = resolvePartLink(link, ownEntryId, objects, lang);
    out.push({
      id: link.part_id,
      name: part?.name || t("shared_part_unknown", lang),
      unit: part?.unit,
      stock: part?.stock ?? null,
      storage_location: part?.storage_location,
      entry_id: link.entry_id,
      owner_name: ownerName,
    });
  }
  return out;
}
