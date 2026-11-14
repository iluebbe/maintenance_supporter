/**
 * One rule for a language code as a table key, in the panel and on the
 * server: tests/test_frontend_const_parity.py reads the same vectors for
 * helpers/i18n.normalize_language_code (DRY audit 2026-11-07, X7-B2).
 */

import { expect } from "@open-wc/testing";
import { normLang } from "../helpers/locale-core.js";
import fixture from "./fixtures/language-code-vectors.json";

describe("language codes, the shared vectors", () => {
  it("normLang gives every expected key", () => {
    expect(fixture.vectors.length).to.be.greaterThan(5);
    for (const v of fixture.vectors) {
      expect(normLang(v.code ?? undefined), String(v.code)).to.equal(v.expected);
    }
  });
});
