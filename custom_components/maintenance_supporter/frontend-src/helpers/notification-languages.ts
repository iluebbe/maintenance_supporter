/**
 * #251: the languages the notifications can speak, each by its own name —
 * the tables of helpers/notification_manager.py. "auto" (the default) is
 * Home Assistant's language. Keep in lockstep with
 * const.NOTIFICATION_LANGUAGE_NAMES (tests/test_frontend_const_parity.py).
 */

export const NOTIFICATION_LANGUAGE_AUTO = "auto";

export const NOTIFICATION_LANGUAGES: ReadonlyArray<readonly [string, string]> = [
  ["en", "English"],
  ["cs", "Čeština"],
  ["da", "Dansk"],
  ["de", "Deutsch"],
  ["es", "Español"],
  ["fi", "Suomi"],
  ["fr", "Français"],
  ["hi", "हिन्दी"],
  ["hu", "Magyar"],
  ["it", "Italiano"],
  ["ja", "日本語"],
  ["ko", "한국어"],
  ["nb", "Norsk bokmål"],
  ["nl", "Nederlands"],
  ["pl", "Polski"],
  ["pt", "Português"],
  ["pt-br", "Português (Brasil)"],
  ["ru", "Русский"],
  ["sv", "Svenska"],
  ["tr", "Türkçe"],
  ["uk", "Українська"],
  ["zh", "简体中文"],
];

/** A table language by its own name; the code when it is not one of them.
 *  Home Assistant's own code reads as a table key through locale-core's
 *  normLang ("pt-BR" → "pt-br", "zh-Hans" → "zh"). */
export function notificationLanguageName(code: string): string {
  return NOTIFICATION_LANGUAGES.find(([c]) => c === code)?.[1] ?? code;
}
