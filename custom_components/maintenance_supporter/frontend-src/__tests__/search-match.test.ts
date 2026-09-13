/**
 * The tolerant matcher (#171) — twin of tests/test_search_match.py. Both
 * sides run the SAME examples (fixtures/search-match-examples.json) so the
 * panel's local groups and the server's document/history groups agree on
 * what "matches"; a case added to the fixture runs on both sides.
 */

import { expect } from "@open-wc/testing";
import {
  SCORE_EXACT, SCORE_FUZZY, SCORE_PREFIX, SCORE_SUBSTRING,
  compact, fieldScore, fold, queryTokens, scoreFields, withinOneEdit, wordScore, words,
} from "../helpers/search-match.js";
import { DOC_FILTER_MIN, filterDocuments } from "../helpers/document-filter.js";
// A static import, not fetch(): web-test-runner's esbuild plugin serves
// .json files as JS modules (`var _comment = …`), which fetch() would see.
import examples from "./fixtures/search-match-examples.json";

interface Examples {
  fold_length_preserving: string[];
  fold: Array<[string, string]>;
  words: Array<[string, string[]]>;
  compact: Array<[string, string]>;
  query_tokens: Array<[string, string[][]]>;
  within_one_edit: Array<[string, string, boolean]>;
  word_score: Array<[string[], string, string]>;
  field_score: Array<[string[], string, string]>;
  score_fields: {
    fields: Array<[string, number]>;
    hits: string[];
    misses: string[];
    order_independent: Array<[string, string]>;
    name_outranks_notes: { query: string; in_name: Array<[string, number]>; in_notes: Array<[string, number]> };
  };
}

const SCORES: Record<string, number> = { EXACT: SCORE_EXACT, PREFIX: SCORE_PREFIX, SUBSTRING: SCORE_SUBSTRING, FUZZY: SCORE_FUZZY, NONE: 0 };
const toFields = (rows: Array<[string, number]>) => rows.map(([text, weight]) => ({ text, weight }));

const ex = examples as unknown as Examples;

describe("search-match (#171) — shared examples", () => {
  it("the shared fixture loaded (guards the Python twin's assumption that both read one file)", () => {
    expect(ex.word_score.length).to.be.greaterThan(3);
    expect(ex.score_fields.hits.length).to.be.greaterThan(0);
  });

  it("fold is length-preserving and strips diacritics", () => {
    for (const s of ex.fold_length_preserving) expect(fold(s).length, s).to.equal(s.length);
    for (const [input, expected] of ex.fold) expect(fold(input)).to.equal(expected);
  });

  it("words / compact", () => {
    for (const [input, expected] of ex.words) expect(words(input)).to.deep.equal(expected);
    for (const [input, expected] of ex.compact) expect(compact(input)).to.equal(expected);
  });

  it("query tokens carry digraph variants and keep the original", () => {
    for (const [input, expected] of ex.query_tokens) expect(queryTokens(input), input).to.deep.equal(expected);
  });

  it("withinOneEdit", () => {
    for (const [a, b, expected] of ex.within_one_edit) expect(withinOneEdit(a, b), `${a} ~ ${b}`).to.equal(expected);
  });

  it("word score ladder", () => {
    for (const [variants, word, score] of ex.word_score) {
      expect(wordScore(variants, word), `${variants.join("/")} in ${word}`).to.equal(SCORES[score]);
    }
  });

  it("field score folds diacritics and separators", () => {
    for (const [variants, text, score] of ex.field_score) {
      expect(fieldScore(variants, text), `${variants.join("/")} in ${text}`).to.equal(SCORES[score]);
    }
  });

  it("every token must hit, order does not matter, names outrank notes", () => {
    const sf = ex.score_fields;
    const fields = toFields(sf.fields);
    for (const q of sf.hits) expect(scoreFields(queryTokens(q), fields), q).to.be.greaterThan(0);
    for (const q of sf.misses) expect(scoreFields(queryTokens(q), fields), q).to.equal(0);
    for (const [a, b] of sf.order_independent) expect(scoreFields(queryTokens(a), fields)).to.equal(scoreFields(queryTokens(b), fields));
    expect(scoreFields([], fields)).to.equal(0);
    const n = sf.name_outranks_notes;
    const inName = scoreFields(queryTokens(n.query), toFields(n.in_name));
    const inNotes = scoreFields(queryTokens(n.query), toFields(n.in_notes));
    expect(inName).to.be.greaterThan(inNotes);
    expect(inNotes).to.be.greaterThan(0);
  });
});

describe("search-match (#171) — panel-only", () => {
  it("filterDocuments: empty query = unchanged list, otherwise ranked matches", () => {
    const docs = [
      { id: "a", title: "Garantie", filename: "g.pdf", tags: ["warranty"] },
      { id: "b", title: "Bedienungsanleitung", filename: "m.pdf", tags: ["manual"] },
      { id: "c", title: "Rechnung", filename: "anleitung-kurz.pdf", tags: [] },
    ];
    expect(filterDocuments(docs, "")).to.equal(docs);
    expect(filterDocuments(docs, "anleit").map((d) => d.id)).to.have.members(["b", "c"]);
    expect(filterDocuments(docs, "warrenty").map((d) => d.id)).to.deep.equal(["a"]); // one typo
    expect(filterDocuments(docs, "garantie manual")).to.deep.equal([]);
    expect(DOC_FILTER_MIN).to.equal(8);
  });
});
