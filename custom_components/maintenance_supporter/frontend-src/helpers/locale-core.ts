/**
 * The locale store and lookup, without Lit and without the bundled English
 * table — so the dashboard strategy (a deliberately small, Lit-free bundle)
 * can translate too (i18n audit 2026-09-27: the generated dashboard was all
 * English). styles.ts re-exports everything here and seeds English; the
 * strategy passes its own English fallback to t().
 */

import { BUNDLE_VERSION } from "./bundle-version";

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
interface LocaleGlobals {
  store: Record<string, Translations>;
  inflight: Record<string, Promise<void>>;
}
const _localeGlobals: LocaleGlobals = (() => {
  const w = window as unknown as { __msLocales?: LocaleGlobals };
  if (!w.__msLocales) w.__msLocales = { store: {}, inflight: {} };
  return w.__msLocales;
})();

const STORE = _localeGlobals.store;
const _localeInflight = _localeGlobals.inflight;

/** Seed/extend the shared English table with this bundle's copy.
 *
 * MERGE, not first-wins (#135 regression): after an update, a cached app
 * shell can still list an OLD sibling bundle (the card) next to the fresh
 * panel. First-wins let the stale bundle's EN — missing every new key —
 * claim the store, and the fresh panel rendered raw keys
 * ("BATTERY_FLEET_ADD"). Existing entries win conflicts (steady state is
 * unchanged); every bundle contributes the keys it knows, so a newer
 * bundle's keys can never be shadowed by an older first-loader.
 */
export function seedEnglish(en: Record<string, string>): void {
  STORE.en = Object.assign({}, en, STORE.en ?? {});
}

/** Languages available as runtime-loaded JSON. Keep in sync with locales/. */
const SUPPORTED_LANGS = new Set<string>([
  "de", "nl", "fr", "it", "es", "pt", "pt-br", "ru", "uk", "pl", "cs", "sv", "zh",
  "da", "fi", "nb", "ja", "hi", "hu", "ko", "tr",
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

/** Get a localized string. Falls back to English, then to ``fallback``
 *  (the strategy's own English), then to the key itself. */
export function t(key: string, lang?: string, fallback?: string): string {
  const l = normLang(lang);
  return STORE[l]?.[key] ?? STORE.en?.[key] ?? fallback ?? key;
}

/** True when *lang*'s table is in memory (English counts as loaded). */
export function isLocaleLoaded(lang?: string): boolean {
  const l = normLang(lang);
  return l === DEFAULT_LANG || l in STORE;
}

/**
 * Fetch *lang*'s table once and cache it. Resolves immediately for English,
 * an already-loaded language, or an unsupported one (which keeps the English
 * fallback). Never rejects: a failed fetch silently leaves English in place,
 * matching t()'s fall-through. Callers re-render on resolution.
 */
export function ensureLocale(lang?: string): Promise<void> {
  const l = normLang(lang);
  if (l === DEFAULT_LANG || l in STORE || !SUPPORTED_LANGS.has(l)) {
    return Promise.resolve();
  }
  if (!(l in _localeInflight)) {
    // Version-busted (#135, same family as #124): the locale files are served
    // without Cache-Control, so browsers cache them heuristically — after an
    // update a stale table would miss every new key and silently fall back to
    // English for them. "dev" builds keep a stable URL.
    _localeInflight[l] = fetch(`${LOCALES_BASE}/${l}.json?v=${BUNDLE_VERSION}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          STORE[l] = data as Translations;
        } else {
          // Don't make one failed fetch sticky for the whole page session —
          // the next ensureLocale() call retries.
          delete _localeInflight[l];
        }
      })
      .catch(() => {
        delete _localeInflight[l];
      });
  }
  return _localeInflight[l];
}

/**
 * Synchronously seed a locale table, bypassing the fetch. For tests and for
 * callers that already hold a table (preload/SSR); the loader and t() share the
 * same STORE, so a seeded language reads immediately.
 */
export function setLocale(lang: string, table: Translations): void {
  STORE[normLang(lang)] = table;
}
