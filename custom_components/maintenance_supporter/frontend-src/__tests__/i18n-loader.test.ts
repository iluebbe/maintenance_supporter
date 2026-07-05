/**
 * i18n runtime-loader guard.
 *
 * The panel/card UI strings used to be one big inline `TRANSLATIONS` object in
 * styles.ts. They now live in `frontend-src/locales/<lang>.json`: only English
 * is bundled (imported by styles.ts) as the always-available fallback; the other
 * 12 languages are fetched at runtime from `/maintenance_supporter_locales/` —
 * so a translation edit needs no bundle rebuild (the stale-bundle pitfall fix).
 *
 * Cross-locale KEY PARITY is guarded in Python (`tests/test_i18n.py` reads every
 * `frontend-src/locales/*.json`). This browser test guards the runtime LOADER
 * behaviour that replaced the inline tables: bundled-EN, English fallback, and
 * the no-fetch fast paths of ensureLocale/isLocaleLoaded.
 */
import { expect } from "@open-wc/testing";
import { t, isLocaleLoaded, ensureLocale } from "../styles";

describe("i18n runtime loader", () => {
  it("serves bundled English synchronously", () => {
    // A key known to exist in en.json resolves with no fetch and isn't the key.
    expect(t("loading", "en")).to.be.a("string").and.not.equal("loading");
  });

  it("falls back to English for an unloaded language, then to the key", () => {
    // German isn't bundled; before load an EN-present key falls back to EN…
    expect(t("loading", "de")).to.equal(t("loading", "en"));
    // …and an unknown key returns the key itself.
    expect(t("__nonexistent_key__", "de")).to.equal("__nonexistent_key__");
  });

  it("treats English (and its regional variants) as always loaded", () => {
    expect(isLocaleLoaded("en")).to.be.true;
    expect(isLocaleLoaded("en-GB")).to.be.true; // normalises to "en"
    expect(isLocaleLoaded("de")).to.be.false; // not fetched yet
  });

  it("ensureLocale resolves immediately for English and unsupported langs", async () => {
    await ensureLocale("en"); // bundled → no-op
    await ensureLocale("xx"); // unsupported → no fetch, stays on English
    expect(isLocaleLoaded("xx")).to.be.false;
  });
});
