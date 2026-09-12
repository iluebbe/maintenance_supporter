/**
 * Tolerant text matching for the panel's search surfaces (#171) — the
 * TypeScript twin of helpers/search_match.py; keep the two in step
 * (tests/test_search_match.py + __tests__/search-match.test.ts pin the same
 * examples).
 *
 * Folding (case, diacritics, a few ligatures — length-preserving), German
 * digraph query variants (spuel → spul, strasse → strase, the original is
 * always kept too), word matching by exact / prefix / substring / one typo,
 * and the AND rule: every query word must match somewhere in the candidate,
 * order does not matter.
 */

const LIGATURES: Record<string, string> = {
  "ß": "s", "ẞ": "s", "æ": "a", "œ": "o", "ø": "o", "đ": "d", "ð": "d", "þ": "t", "ł": "l", "ı": "i",
};

export const SCORE_EXACT = 10;
export const SCORE_PREFIX = 7;
export const SCORE_SUBSTRING = 4;
export const SCORE_FUZZY = 2;
const FUZZY_MIN_LEN = 5;
const SUBSTRING_MIN_LEN = 3;

const WORD_RE = /[a-z0-9]+/g;

/** Lower-case, strip diacritics, map ligatures — one char in, one char out. */
export function fold(text: string): string {
  let out = "";
  for (const ch of text.toLowerCase()) {
    if (ch.charCodeAt(0) < 128 && ch.length === 1) { out += ch; continue; }
    const mapped = LIGATURES[ch];
    if (mapped) { out += mapped; continue; }
    const base = ch.normalize("NFKD")[0] || ch;
    out += base.charCodeAt(0) < 128 ? base : ch;
  }
  return out;
}

export function words(text: string): string[] {
  return fold(text).match(WORD_RE) || [];
}

export function compact(text: string): string {
  return fold(text).replace(/[^a-z0-9]+/g, "");
}

function collapseDigraphs(token: string): string {
  return token.replace(/ue/g, "u").replace(/oe/g, "o").replace(/ae/g, "a").replace(/ss/g, "s");
}

/** Query → tokens, each with its spelling variants (original first). */
export function queryTokens(query: string): string[][] {
  const out: string[][] = [];
  for (const raw of words(query)) {
    const variants = [raw];
    const collapsed = collapseDigraphs(raw);
    if (collapsed && collapsed !== raw) variants.push(collapsed);
    out.push(variants);
  }
  return out;
}

/** Optimal-string-alignment distance ≤ 1 (insert / delete / substitute / adjacent swap). */
export function withinOneEdit(a: string, b: string): boolean {
  if (a === b) return true;
  const la = a.length, lb = b.length;
  if (Math.abs(la - lb) > 1) return false;
  if (la === lb) {
    const diffs: number[] = [];
    for (let i = 0; i < la; i++) if (a[i] !== b[i]) diffs.push(i);
    if (diffs.length === 1) return true;
    if (diffs.length === 2 && diffs[1] === diffs[0] + 1) {
      const i = diffs[0];
      return a[i] === b[i + 1] && a[i + 1] === b[i];
    }
    return false;
  }
  const [longer, shorter] = la > lb ? [a, b] : [b, a];
  let i = 0, j = 0, skipped = false;
  while (i < longer.length && j < shorter.length) {
    if (longer[i] === shorter[j]) { i++; j++; }
    else if (skipped) return false;
    else { skipped = true; i++; }
  }
  return true;
}

export function wordScore(variants: string[], word: string): number {
  let best = 0;
  for (const tok of variants) {
    if (!tok) continue;
    if (word === tok) return SCORE_EXACT;
    if (word.startsWith(tok)) { best = Math.max(best, SCORE_PREFIX); continue; }
    if (tok.length >= SUBSTRING_MIN_LEN && word.includes(tok)) { best = Math.max(best, SCORE_SUBSTRING); continue; }
    if (tok.length >= FUZZY_MIN_LEN && best < SCORE_FUZZY) {
      if (withinOneEdit(tok, word) || (word.length > tok.length && withinOneEdit(tok, word.slice(0, tok.length)))) best = SCORE_FUZZY;
    }
  }
  return best;
}

export function fieldScore(variants: string[], text: string): number {
  let best = 0;
  for (const w of words(text)) {
    best = Math.max(best, wordScore(variants, w));
    if (best === SCORE_EXACT) return best;
  }
  if (best < SCORE_SUBSTRING) {
    const flat = compact(text);
    for (const tok of variants) if (tok.length >= SUBSTRING_MIN_LEN && flat.includes(tok)) return SCORE_SUBSTRING;
  }
  return best;
}

export interface WeightedField { text: string | null | undefined; weight: number }

/** Does `text` match `query` under the same rules as the server's search
 *  (fold-tolerant, every query word must hit, order free)? For a client-side
 *  filter that has to agree with a server hit — the task history's notes
 *  filter is pre-filled from a global-search history hit, and a plain
 *  `includes()` there left the tab empty for "spuelung" vs "Spülung" or a
 *  reordered query (bug audit 2026-09-12). A query without any word token
 *  (punctuation only) falls back to a folded substring test. */
export function matchesQuery(text: string | null | undefined, query: string): boolean {
  if (!text) return false;
  const tokens = queryTokens(query);
  if (!tokens.length) {
    const needle = fold(query.trim());
    return needle.length > 0 && fold(text).includes(needle);
  }
  return scoreFields(tokens, [{ text, weight: 1 }]) > 0;
}

/** 0 = at least one token matched nothing; otherwise the weighted sum over tokens. */
export function scoreFields(tokens: string[][], fields: WeightedField[]): number {
  if (!tokens.length) return 0;
  const live = fields.filter((f) => f.text);
  let total = 0;
  for (const variants of tokens) {
    let best = 0;
    for (const f of live) {
      const s = fieldScore(variants, f.text as string) * f.weight;
      if (s > best) best = s;
    }
    if (best === 0) return 0;
    total += best;
  }
  return total;
}
