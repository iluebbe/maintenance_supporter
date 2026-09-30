/** What spare parts cost, and when that counts (#104, #98 follow-up).
 *
 * Mirrors helpers/parts_cost.py (entry_spend) and helpers/parts.py
 * (unit_price, restock_units) — the panel sums history in the browser (the
 * object history, the area report, the service record), and those totals
 * must be the backend's to the cent.
 *
 * - `unitPrice`: a part's price per stock unit. With a package size the
 *   stored price is per PACKAGE (a 500 ml can at 4.99), so one unit costs
 *   price / size.
 * - `restockUnits`: what a purchase adds to the stock — packages × size.
 * - `entrySpend`: what one history entry counts in every total. An entry
 *   booked "when used" (`cost_basis: "use"`) counts its parts and — if it
 *   was a purchase — not the purchase price; every other entry counts its
 *   typed cost. Decided by the entry itself, so a changed setting never
 *   re-values history.
 */

import type { HistoryEntry, MaintenancePart } from "../types";

export type PartsCostMode = "purchase" | "use";

/** The setting's value as read from the wire ("purchase" unless "use"). */
export function partsCostModeOf(value: unknown): PartsCostMode {
  return value === "use" ? "use" : "purchase";
}

const num = (v: unknown): number | null => (typeof v === "number" && Number.isFinite(v) ? v : null);

/** Price of ONE stock unit, or null when the part has no price. */
export function unitPrice(part: Pick<MaintenancePart, "cost" | "package_size"> | null | undefined): number | null {
  const cost = num(part?.cost);
  if (cost === null) return null;
  const size = num(part?.package_size);
  return size && size > 0 ? cost / size : cost;
}

/** Stock units one restock adds: `packages` (default: the part's restock
 *  amount, else 1) × the package size (1 without one). */
export function restockUnits(
  part: Pick<MaintenancePart, "restock_quantity" | "package_size">,
  packages?: number | null,
): number {
  const count = num(packages) && packages! > 0 ? packages! : (num(part.restock_quantity) || 1);
  const size = num(part.package_size);
  return Math.round(count * (size && size > 0 ? size : 1) * 100) / 100;
}

/** What one entry counts as spending; null when it records no money at all. */
export function entrySpend(h: Pick<HistoryEntry, "cost" | "parts_cost" | "cost_basis" | "purchase">): number | null {
  const cost = num(h.cost);
  if (h.cost_basis !== "use") return cost;
  const parts = num(h.parts_cost);
  const own = h.purchase ? null : cost;
  if (own === null && parts === null) return null;
  return (own ?? 0) + (parts ?? 0);
}
