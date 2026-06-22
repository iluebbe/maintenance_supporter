/** (#67) Objects-table column catalog.
 *
 * Shared by the panel's table view and the Settings column-config UI. Keep
 * KNOWN/DEFAULT in lockstep with const.py (KNOWN_OBJECT_TABLE_COLUMNS /
 * DEFAULT_OBJECTS_TABLE_COLUMNS) — the backend sanitises to the same set.
 */

export interface ObjectColumnDef {
  /** Stable column key (matches the persisted setting + object field). */
  key: string;
  /** i18n key for the header cell + the Settings checkbox label. */
  labelKey: string;
  /** Columns the user may not remove (always rendered). */
  required?: boolean;
}

/** Canonical order + label mapping. Most labels reuse existing i18n keys. */
export const OBJECT_COLUMNS: ObjectColumnDef[] = [
  { key: "name", labelKey: "name", required: true },
  { key: "manufacturer", labelKey: "manufacturer" },
  { key: "model", labelKey: "model" },
  { key: "serial_number", labelKey: "serial_number_label" },
  { key: "installation_date", labelKey: "installed" },
  { key: "warranty_expiry", labelKey: "warranty" },
  { key: "area_id", labelKey: "area" },
  { key: "documentation_url", labelKey: "documentation_url_label" },
  { key: "notes", labelKey: "object_notes_label" },
  { key: "task_count", labelKey: "tasks" },
  { key: "actions", labelKey: "actions" },
];

export const KNOWN_OBJECT_COLUMNS: string[] = OBJECT_COLUMNS.map((c) => c.key);

export const DEFAULT_OBJECTS_TABLE_COLUMNS: string[] = [
  "name",
  "manufacturer",
  "model",
  "serial_number",
  "installation_date",
  "warranty_expiry",
  "area_id",
  "task_count",
  "actions",
];

/**
 * Sanitise a stored/configured column list to known keys (order preserved,
 * deduped). Falls back to the defaults when empty/invalid, and always keeps
 * the required `name` column so the table stays usable. Mirrors the backend.
 */
export function sanitizeColumns(cols: unknown): string[] {
  if (!Array.isArray(cols)) return [...DEFAULT_OBJECTS_TABLE_COLUMNS];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const c of cols) {
    if (typeof c === "string" && KNOWN_OBJECT_COLUMNS.includes(c) && !seen.has(c)) {
      seen.add(c);
      out.push(c);
    }
  }
  if (!out.length) return [...DEFAULT_OBJECTS_TABLE_COLUMNS];
  if (!out.includes("name")) out.unshift("name");
  return out;
}
