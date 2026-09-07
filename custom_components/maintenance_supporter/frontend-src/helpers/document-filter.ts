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
      { text: doc.url, weight: 1 },
    ]);
    if (score > 0) scored.push({ doc, score });
  }
  return scored.sort((a, b) => b.score - a.score).map((s) => s.doc);
}
