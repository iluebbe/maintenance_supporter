/**
 * Local filter for a loaded document list (#171) — the object page's
 * documents section and a task's linked documents. Same tolerant matcher
 * as the global search, over what a document list shows: title, file
 * name, tags, URL. Empty query = the list as it was.
 */

import { queryTokens, scoreFields } from "./search-match";

/** Below this many documents a filter box is noise, not help. */
export const DOC_FILTER_MIN = 8;

export interface FilterableDoc {
  title?: string | null;
  filename?: string | null;
  url?: string | null;
  tags?: string[] | null;
  description?: string | null;
  kind?: string;
  added_at?: string | null;
}

export const DOC_SORT_MODES = ["newest", "oldest", "title", "category"] as const;
export type DocSortMode = (typeof DOC_SORT_MODES)[number];

export function asDocSortMode(raw: string | null | undefined): DocSortMode {
  return (DOC_SORT_MODES as readonly string[]).includes(raw ?? "") ? (raw as DocSortMode) : "newest";
}

const DOC_CATEGORIES = ["manual", "warranty", "invoice", "spare_parts", "photo", "other"];

/** Sort a document list (#164). "title" is a natural order — "Construct 2"
 *  before "Construct 10", "#1, #2, #3" — via a numeric collator, so a user
 *  who numbers their documents gets the folder-like sequence they typed.
 *  "category" groups by the category tag (manual, warranty, …, links last)
 *  and orders by title inside a group. A query (filterDocuments) ranks by
 *  match instead, so the sort applies to the unfiltered list only. */
export function sortDocuments<T extends FilterableDoc>(docs: T[], mode: DocSortMode): T[] {
  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });
  const name = (d: T) => (d.title || d.filename || d.url || "").trim();
  const byTitle = (a: T, b: T) => collator.compare(name(a), name(b));
  const category = (d: T) => {
    if (d.kind === "weblink") return DOC_CATEGORIES.length + 1;
    const tag = (d.tags || []).find((x) => DOC_CATEGORIES.includes(x)) || "other";
    return DOC_CATEGORIES.indexOf(tag);
  };
  const out = [...docs];
  switch (mode) {
    case "oldest":
      return out.sort((a, b) => (a.added_at || "").localeCompare(b.added_at || ""));
    case "title":
      return out.sort(byTitle);
    case "category":
      return out.sort((a, b) => category(a) - category(b) || byTitle(a, b));
    default:
      return out.sort((a, b) => (b.added_at || "").localeCompare(a.added_at || ""));
  }
}

export function filterDocuments<T extends FilterableDoc>(docs: T[], query: string): T[] {
  const tokens = queryTokens(query);
  if (!tokens.length) return docs;
  const scored: Array<{ doc: T; score: number }> = [];
  for (const doc of docs) {
    const score = scoreFields(tokens, [
      { text: doc.title, weight: 3 },
      { text: doc.filename, weight: 2 },
      { text: (doc.tags || []).join(" "), weight: 2 },
      { text: doc.description, weight: 2 },
      { text: doc.url, weight: 1 },
    ]);
    if (score > 0) scored.push({ doc, score });
  }
  return scored.sort((a, b) => b.score - a.score).map((s) => s.doc);
}
