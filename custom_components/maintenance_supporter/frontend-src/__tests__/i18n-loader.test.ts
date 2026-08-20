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
import { t, isLocaleLoaded, ensureLocale, seedEnglish } from "../styles";

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

  it("shares the locale store across bundle copies via window (German-panel/English-dialog regression)", () => {
    // maintenance-card.js is loaded on EVERY page (extra_module_url) and its
    // custom-element definitions win first — so a dialog inside the panel
    // executes the CARD bundle's copy of styles.ts. If each copy had its own
    // module-scoped store, the panel's locale load would never reach the
    // dialog: German panel, English "Edit Task" dialog (the v2.17.0 bug).
    // Guard: the store is window-scoped, so writing to the global (as another
    // bundle copy would) is immediately visible to this copy's t().
    const g = (window as unknown as {
      __msLocales?: { store: Record<string, Record<string, string>> };
    }).__msLocales;
    expect(g, "window.__msLocales must back the locale store").to.exist;
    g!.store.pt = { loading: "A carregar (from another bundle copy)" };
    try {
      expect(t("loading", "pt")).to.equal("A carregar (from another bundle copy)");
      expect(isLocaleLoaded("pt")).to.be.true;
    } finally {
      delete g!.store.pt;
    }
  });

  it("seedEnglish MERGES so a stale first-loader cannot shadow newer keys (#135 regression)", () => {
    // After an update, a cached app shell can load an OLD card bundle first;
    // its EN table lacks every key the fresh panel introduced. First-wins
    // seeding froze that stale table and the panel rendered raw keys
    // ("BATTERY_FLEET_ADD"). The merge keeps existing entries (steady state
    // unchanged) but lets every bundle contribute the keys it knows.
    const g = (window as unknown as {
      __msLocales: { store: Record<string, Record<string, string>> };
    }).__msLocales;
    const original = g.store.en;
    try {
      // Simulate the stale bundle having seeded first with a tiny old table.
      g.store.en = { loading: "Old loading text" };
      seedEnglish({ loading: "Fresh loading text", brand_new_key: "New feature label" });
      expect(t("loading", "en"), "existing entries win conflicts").to.equal("Old loading text");
      expect(t("brand_new_key", "en"), "newer keys are contributed, never raw").to.equal("New feature label");
    } finally {
      g.store.en = original;
    }
  });
});
