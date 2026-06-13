/**
 * i18n key-parity guard.
 *
 * Every panel/card string is looked up via t(key, lang), which falls back to
 * English when a language is missing the key. That fallback silently ships
 * English text to non-English users when a feature's strings are added to EN
 * (and DE) but not the other locales — exactly what happened to the 45
 * v2.1–v2.4 keys across 10 languages. This test fails CI the moment any
 * language block drifts from the EN key set, so the gap can't recur unnoticed.
 */
import { expect } from "@open-wc/testing";
import { TRANSLATIONS } from "../styles";

const REFERENCE = "en";

describe("i18n key parity (styles.ts TRANSLATIONS)", () => {
  const langs = Object.keys(TRANSLATIONS).filter((l) => l !== REFERENCE);
  const refKeys = Object.keys(TRANSLATIONS[REFERENCE]).sort();

  it("ships the expected set of UI languages", () => {
    // de + en + the 10 backfilled locales + zh-Hans (v2.8.3, #64) = 13
    expect(Object.keys(TRANSLATIONS).sort()).to.deep.equal(
      ["cs", "de", "en", "es", "fr", "it", "nl", "pl", "pt", "ru", "sv", "uk", "zh"],
    );
  });

  for (const lang of langs) {
    it(`${lang} has exactly the same keys as ${REFERENCE}`, () => {
      const keys = new Set(Object.keys(TRANSLATIONS[lang]));
      const missing = refKeys.filter((k) => !keys.has(k));
      const extra = [...keys].filter((k) => !refKeys.includes(k)).sort();
      // Separate, explicit assertions so a failure names the offending keys.
      expect(missing, `${lang} is MISSING keys (would fall back to English)`).to.deep.equal([]);
      expect(extra, `${lang} has EXTRA keys not present in ${REFERENCE}`).to.deep.equal([]);
    });
  }

  it("no language has duplicate-collapsed or empty values", () => {
    for (const lang of Object.keys(TRANSLATIONS)) {
      for (const [key, value] of Object.entries(TRANSLATIONS[lang])) {
        expect(value, `${lang}.${key} must be a non-empty string`).to.be.a("string").and.not.equal("");
      }
    }
  });
});
