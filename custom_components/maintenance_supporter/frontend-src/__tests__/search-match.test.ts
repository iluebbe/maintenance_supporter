/**
 * The tolerant matcher (#171) — twin of tests/test_search_match.py; the
 * same examples must pass on both sides so the panel's local groups and the
 * server's document/history groups agree on what "matches".
 */

import { expect } from "@open-wc/testing";
import {
  SCORE_EXACT, SCORE_FUZZY, SCORE_PREFIX, SCORE_SUBSTRING,
  compact, fieldScore, fold, queryTokens, scoreFields, withinOneEdit, wordScore, words,
} from "../helpers/search-match.js";
import { DOC_FILTER_MIN, filterDocuments } from "../helpers/document-filter.js";

describe("search-match (#171)", () => {
  it("fold is length-preserving and strips diacritics", () => {
    for (const s of ["Kühlschrank", "Straße", "Ærø", "ÉCOLE", "naïve café", "Łódź"]) expect(fold(s).length).to.equal(s.length);
    expect(fold("Kühlschrank")).to.equal("kuhlschrank");
    expect(fold("Straße")).to.equal("strase");
    expect(fold("Łódź")).to.equal("lodz");
  });

  it("words / compact", () => {
    expect(words("Fehler-Code E-24, Zulauf!")).to.deep.equal(["fehler", "code", "e", "24", "zulauf"]);
    expect(compact("E-24 / WM14T5")).to.equal("e24wm14t5");
  });

  it("query tokens carry digraph variants and keep the original", () => {
    expect(queryTokens("Spuel-Maschine")).to.deep.equal([["spuel", "spul"], ["maschine"]]);
    expect(queryTokens("Bauer")).to.deep.equal([["bauer", "baur"]]);
    expect(queryTokens("  ")).to.deep.equal([]);
  });

  it("withinOneEdit", () => {
    expect(withinOneEdit("reinigen", "reinigne")).to.equal(true);
    expect(withinOneEdit("filter", "fiter")).to.equal(true);
    expect(withinOneEdit("filter", "fillter")).to.equal(true);
    expect(withinOneEdit("filter", "filtar")).to.equal(true);
    expect(withinOneEdit("filter", "flitre")).to.equal(false);
    expect(withinOneEdit("abc", "abcde")).to.equal(false);
  });

  it("word score ladder", () => {
    expect(wordScore(["filter"], "filter")).to.equal(SCORE_EXACT);
    expect(wordScore(["filt"], "filter")).to.equal(SCORE_PREFIX);
    expect(wordScore(["leitung"], "bedienungsanleitung")).to.equal(SCORE_SUBSTRING);
    expect(wordScore(["reinigne"], "reinigen")).to.equal(SCORE_FUZZY);
    expect(wordScore(["reinigugn"], "reinigungsmittel")).to.equal(SCORE_FUZZY);
    expect(wordScore(["er"], "filter")).to.equal(0);
    expect(wordScore(["filt"], "fitler")).to.equal(0);
  });

  it("field score folds diacritics and separators", () => {
    expect(fieldScore(["kuhl"], "Kühlschrank")).to.equal(SCORE_PREFIX);
    expect(fieldScore(["spul"], "Spülmaschine")).to.equal(SCORE_PREFIX);
    expect(fieldScore(["e24"], "Fehlercode E-24")).to.equal(SCORE_SUBSTRING);
  });

  it("every token must hit, order does not matter, names outrank notes", () => {
    const fields = [{ text: "Filter reinigen", weight: 3 }, { text: "Spülmaschine", weight: 2 }];
    expect(scoreFields(queryTokens("spülm filt"), fields)).to.be.greaterThan(0);
    expect(scoreFields(queryTokens("filt spülm"), fields)).to.equal(scoreFields(queryTokens("spülm filt"), fields));
    expect(scoreFields(queryTokens("spuel filter"), fields)).to.be.greaterThan(0);
    expect(scoreFields(queryTokens("spülm garten"), fields)).to.equal(0);
    expect(scoreFields([], fields)).to.equal(0);
    const inName = scoreFields(queryTokens("filter"), [{ text: "Filter", weight: 3 }, { text: "", weight: 1 }]);
    const inNotes = scoreFields(queryTokens("filter"), [{ text: "Pumpe", weight: 3 }, { text: "Filter wechseln", weight: 1 }]);
    expect(inName).to.be.greaterThan(inNotes);
    expect(inNotes).to.be.greaterThan(0);
  });

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
