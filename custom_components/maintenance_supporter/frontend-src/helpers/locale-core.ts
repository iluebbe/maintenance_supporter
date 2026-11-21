/**
 * The locale store and lookup, without Lit and without the bundled English
 * table — so the dashboard strategy (a deliberately small, Lit-free bundle)
 * can translate too (i18n audit 2026-09-27: the generated dashboard was all
 * English). styles.ts re-exports everything here and seeds English; the
 * strategy passes its own English fallback to t().
 */

import { BUNDLE_VERSION, otherBundleVersions } from "./bundle-version";

export interface Translations {
  [key: string]: string;
}

const DEFAULT_LANG = "en";

// The locale store MUST be shared across bundle copies of this module.
// maintenance-card.js is loaded globally (extra_module_url) and defines the
// dialog custom elements first-wins — so a <maintenance-task-dialog> inside
// the panel runs the CARD bundle's copy of this module. With a module-scoped
// store, the panel's ensureLocale() fills only the PANEL copy and the dialog
// stays English while the rest of the panel is localized (v2.17.0 regression,
// invisible before the runtime-locale split because every bundle inlined all
// languages). One window-scoped store + inflight map keeps every copy reading
// and writing the same tables.
//
// Shared per VERSION, though (2026-11-16): a window can hold bundles of two
// versions (a card loaded before an update, the panel after it). A store
// keyed by language alone kept whichever table came first, and the newer
// panel read the older card's German: every text it added since read in
// English. Each version now keeps its own tables (`byVersion`), and t() reads
// them first; `store` stays the table every version can fall back on, and the
// one bundles from before this change read.
interface LocaleGlobals {
  store: Record<string, Translations>;
  inflight: Record<string, Promise<void>>;
  /** When a language's fetch last failed (ms). Optional: a stale bundle
   *  that created the globals first knows only store + inflight. */
  failedAt?: Record<string, number>;
  /** Each bundle version's own tables, by language. */
  byVersion?: Record<string, Record<string, Translations>>;
  /** The version that created each shared table. A table without an entry
   *  was fetched by a bundle from before 2026-11-16. */
  storeFrom?: Record<string, string>;
}
const _localeGlobals: LocaleGlobals = (() => {
  const w = window as unknown as { __msLocales?: LocaleGlobals };
  if (!w.__msLocales) w.__msLocales = { store: {}, inflight: {} };
  if (!w.__msLocales.failedAt) w.__msLocales.failedAt = {};
  if (!w.__msLocales.byVersion) w.__msLocales.byVersion = {};
  if (!w.__msLocales.storeFrom) w.__msLocales.storeFrom = {};
  return w.__msLocales;
})();

const STORE = _localeGlobals.store;
const _localeInflight = _localeGlobals.inflight;
const _localeFailedAt = _localeGlobals.failedAt as Record<string, number>;
const _storeFrom = _localeGlobals.storeFrom as Record<string, string>;
const _byVersion = _localeGlobals.byVersion as Record<string, Record<string, Translations>>;
/** This bundle version's own tables (shared by its copies in the panel and the cards). */
const OWN: Record<string, Translations> = (_byVersion[BUNDLE_VERSION] ??= {});

/** A failed fetch is retried, but not before this much time has passed:
 *  surfaces call ensureLocale() on every hass update, and without a pause a
 *  missing file was fetched again on each one. */
const RETRY_AFTER_MS = 60_000;

/** Seed/extend the English tables with this bundle's copy.
 *
 * This version's own table gets it, so this bundle reads its own wording even
 * next to an older bundle. The shared table MERGES, not first-wins (#135
 * regression): after an update, a cached app shell can still list an OLD
 * sibling bundle (the card) next to the fresh panel, and a bundle from before
 * 2026-11-16 reads only the shared table. Existing entries win conflicts
 * there; every bundle contributes the keys it knows.
 */
export function seedEnglish(en: Record<string, string>): void {
  OWN.en = Object.assign({}, en, OWN.en ?? {});
  STORE.en = Object.assign({}, en, STORE.en ?? {});
}

/** Languages available as runtime-loaded JSON. Keep in sync with locales/. */
const SUPPORTED_LANGS = new Set<string>([
  "de", "nl", "fr", "it", "es", "pt", "pt-br", "ru", "uk", "pl", "cs", "sv", "zh",
  "da", "fi", "nb", "ja", "hi", "hu", "ko", "tr", "sk",
]);

/** Served base for the runtime locale files (mirrors LOCALES_URL in const.py). */
const LOCALES_BASE = "/maintenance_supporter_locales";

/** Normalize an HA language code to our table key.
 *
 * Brazilian Portuguese is the one regional variant with its OWN table
 * ("pt-br") — it must not collapse into European "pt". Mirrors
 * normalize_language_code in helpers/i18n.py.
 */
export function normLang(lang?: string): string {
  const l = (lang || DEFAULT_LANG).toLowerCase();
  if (l.startsWith("pt") && l.endsWith("br")) return "pt-br";
  return l.substring(0, 2);
}

/**
 * The UI language for a hass object — the ONE rule every component's `_lang`
 * getter delegates to. Before this helper the 23 hand-copied getters had
 * drifted into three variants (`|| "en"`, `?? navigator.language...`, and a
 * `locale.language` probe), so sibling components could resolve different
 * languages from the same hass.
 */
export function langOf(hass?: { language?: string }): string {
  return hass?.language || "en";
}

/** Get a localized string: this version's table, then the shared one (an
 *  older bundle's German still beats English), then English the same way,
 *  then ``fallback`` (the strategy's own English), then the key itself. */
export function t(key: string, lang?: string, fallback?: string): string {
  const l = normLang(lang);
  return OWN[l]?.[key] ?? STORE[l]?.[key] ?? OWN.en?.[key] ?? STORE.en?.[key] ?? fallback ?? key;
}

/** True when nothing is left to fetch for *lang*: English, a language we
 *  have no table for (it reads in English for good) or this version's table
 *  in memory. Another version's table does not count: this bundle fetches
 *  its own, and its surfaces re-render when it arrives.
 *
 *  An unsupported language used to count as NOT loaded while ensureLocale()
 *  resolved at once for it, so surfaces that re-render "once the locale
 *  arrives" re-rendered in an endless microtask loop and froze the browser
 *  tab for every HA language outside ours (Greek, Hebrew, …). */
export function isLocaleLoaded(lang?: string): boolean {
  const l = normLang(lang);
  return l === DEFAULT_LANG || l in OWN || !SUPPORTED_LANGS.has(l);
}

/**
 * Fetch *lang*'s table of this version once and cache it. Resolves
 * immediately for English, an already-loaded language, or an unsupported one
 * (which keeps the English fallback). Never rejects: a failed fetch silently
 * leaves English (or another version's table) in place, matching t()'s
 * fall-through. Callers re-render on resolution.
 */
export function ensureLocale(lang?: string): Promise<void> {
  const l = normLang(lang);
  if (l === DEFAULT_LANG || l in OWN || !SUPPORTED_LANGS.has(l)) {
    return Promise.resolve();
  }
  // Per version: an older bundle's fetch of the same language (or its
  // failure) must not stand in for this one's.
  const job = `${l}@${BUNDLE_VERSION}`;
  const failedAt = _localeFailedAt[job];
  if (failedAt !== undefined && Date.now() - failedAt < RETRY_AFTER_MS) {
    return Promise.resolve();
  }
  if (!(job in _localeInflight)) {
    // Version-busted (#135, same family as #124): the locale files are served
    // without Cache-Control, so browsers cache them heuristically — after an
    // update a stale table would miss every new key and silently fall back to
    // English for them. "dev" builds keep a stable URL.
    _localeInflight[job] = fetch(`${LOCALES_BASE}/${l}.json?v=${BUNDLE_VERSION}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          OWN[l] = data as Translations;
          // The shared table: what an older bundle fetched stays, the keys
          // it lacks are added.
          if (!(l in STORE)) _storeFrom[l] = BUNDLE_VERSION;
          STORE[l] = Object.assign({}, data as Translations, STORE[l] ?? {});
        } else {
          // Don't make one failed fetch sticky for the whole page session —
          // a call after RETRY_AFTER_MS retries.
          delete _localeInflight[job];
          _localeFailedAt[job] = Date.now();
        }
      })
      .catch(() => {
        delete _localeInflight[job];
        _localeFailedAt[job] = Date.now();
      });
  }
  return _localeInflight[job];
}

/**
 * Synchronously seed a locale table, bypassing the fetch. For tests and for
 * callers that already hold a table (preload/SSR); the loader and t() share the
 * same tables, so a seeded language reads immediately.
 */
export function setLocale(lang: string, table: Translations): void {
  const l = normLang(lang);
  OWN[l] = table;
  STORE[l] = table;
  _storeFrom[l] = BUNDLE_VERSION;
}

/** True when this window also runs code of another version of ours: a
 *  bundle that said so on load, or one from before 2026-11-16 that did not,
 *  recognisable by a language table it fetched without saying which version
 *  it is. Only a reload brings them together again. */
export function windowMixesVersions(own: string = BUNDLE_VERSION): boolean {
  if (otherBundleVersions(own).length > 0) return true;
  return Object.keys(STORE).some((l) => l !== DEFAULT_LANG && !(l in _storeFrom));
}
