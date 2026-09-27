/**
 * Backend error texts in the user's language (i18n audit 2026-09-27).
 *
 * The backend answers a refused WS command with a translation key where it
 * has one (`send_error(..., translation_domain=, translation_key=,
 * translation_placeholders=)`), and Home Assistant already ships those texts
 * in all 22 languages (strings.json `exceptions`). Home Assistant's own
 * frontend loads that category on demand; we do the same once per language
 * and keep the resulting localize function on a window singleton, so every
 * bundle (panel, cards, dialogs mounted by either) shares it.
 */

type LocalizeFunc = (key: string, values?: Record<string, unknown>) => string;

interface HassWithBackendI18n {
  language?: string;
  loadBackendTranslation?: (category: string, integration?: string | string[]) => Promise<LocalizeFunc>;
}

interface BackendErrorGlobals {
  lang: string;
  localize: LocalizeFunc | null;
  inflight: Promise<void> | null;
}

const DOMAIN = "maintenance_supporter";

const G: BackendErrorGlobals = (() => {
  const w = window as unknown as { __msBackendErrors?: BackendErrorGlobals };
  return (w.__msBackendErrors ??= { lang: "", localize: null, inflight: null });
})();

/** Load our exception texts in hass's language (once per language). */
export function primeBackendErrors(hass: HassWithBackendI18n | undefined): void {
  const lang = hass?.language;
  if (!lang || typeof hass?.loadBackendTranslation !== "function") return;
  if (G.lang === lang && (G.localize || G.inflight)) return;
  G.lang = lang;
  G.localize = null;
  G.inflight = hass
    .loadBackendTranslation("exceptions", DOMAIN)
    .then((fn) => {
      if (G.lang === lang) G.localize = fn;
    })
    .catch(() => {
      /* keep the code-based headline */
    })
    .finally(() => {
      G.inflight = null;
    });
}

/** The translated text of a backend exception, or null when unknown. */
export function localizeBackendError(
  domain: string | undefined,
  key: string | undefined,
  placeholders?: Record<string, unknown> | null,
): string | null {
  if (!key || !G.localize || (domain && domain !== DOMAIN)) return null;
  const path = `component.${DOMAIN}.exceptions.${key}.message`;
  const text = G.localize(path, placeholders ?? undefined);
  return text && text !== path ? text : null;
}
