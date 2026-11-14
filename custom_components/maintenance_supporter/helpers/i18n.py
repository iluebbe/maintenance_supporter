"""Internationalization helpers."""

from __future__ import annotations

import logging
import math
from collections.abc import Mapping
from typing import Any

from homeassistant.core import HomeAssistant

_LOGGER = logging.getLogger(__name__)


def normalize_language(hass: HomeAssistant) -> str:
    """Return the HA UI language as a lowercase table key.

    HA emits regional language codes (e.g. ``zh-Hans``, ``zh-Hant``,
    ``pt-BR``), but the integration's localization tables — the
    calendar/notification/config-flow Python string dicts, the
    ``name_<lang>`` template fields, and the ``styles.ts`` panel strings —
    are keyed by the bare 2-letter prefix. Centralizing the normalization
    keeps every consumer identical, so a regional-code user never silently
    falls back to English. Defaults to ``en`` when the language is unset.

    Brazilian Portuguese is the one regional variant with its OWN tables
    (``pt-br``) — it must not collapse into European ``pt``.
    """
    return normalize_language_code(getattr(hass.config, "language", None))


def request_language(hass: HomeAssistant, language: str | None) -> str:
    """The language a request asks for (the panel sends its user's), else
    Home Assistant's, as a table key. Four commands spelled it out (DRY
    audit 2026-11-07, BI7-B4)."""
    return normalize_language_code(language) if language else normalize_language(hass)


def normalize_language_code(code: str | None) -> str:
    """Normalize a raw language code to a table key (idempotent).

    Every consumer that accepts an explicit ``language`` parameter must run
    it through here instead of truncating to two letters itself — a bare
    ``[:2]`` would collapse ``pt-BR`` into European ``pt``.
    """
    lang = str(code or "en").lower()
    if lang.startswith("pt") and lang.endswith("br"):
        return "pt-br"
    return lang[:2]


# Languages that write a decimal COMMA ("12,5"). Everything else here writes
# a point; a spoken answer and a number in a reminder follow the same rule.
DECIMAL_COMMA_LANGUAGES = frozenset(
    {"de", "fr", "es", "it", "nl", "pt", "pt-br", "ru", "uk", "pl", "cs", "da", "fi", "nb", "sv", "tr", "hu"}
)
_MAX_PLACES = 10


def plain_number(value: float, lang: str | None = None, *, digits: int = 2) -> str:
    """A reading as a person writes it: at most ``digits`` decimals, no
    trailing zeros, never an exponent ("21.46", "7", "1234567").

    ``:g`` kept six significant digits, so a reminder read "0.123457" or
    "1.23457e+06". Below one a value keeps two significant digits
    ("0.015", "0.0042"): two decimals alone made 0.015 read "0.01" and
    0.004 nothing. With a ``lang`` that writes a decimal comma the mark is
    a comma; without one it is a point (a stored note or an event, which
    an automation reads).

    ``digits`` is how much the reader wants: two for a reminder, read at
    a glance; more for a history note, read to find out what happened.
    """
    number = float(value)
    if not math.isfinite(number):
        return str(value)
    places = digits
    if number and abs(number) < 1:
        places = min(_MAX_PLACES, max(digits, 1 - math.floor(math.log10(abs(number)))))
    text = f"{number:.{places}f}"
    if "." in text:
        text = text.rstrip("0").rstrip(".")
    if text in ("-0", ""):
        text = "0"
    return text.replace(".", ",") if lang and normalize_language_code(lang) in DECIMAL_COMMA_LANGUAGES else text


def format_text(tables: Mapping[str, Mapping[str, str]], lang: str, key: str, **kwargs: Any) -> str:
    """Look *key* up in a per-language string table and fill its placeholders.

    THE formatter behind the integration's Python string tables — the
    notification, calendar, logbook and Assist copies each had their own
    (bug audit 2026-09-26, DRY BR-A6). One rule set for all of them:

    * a missing language or a missing key falls back to the English line
      (per key), a key missing everywhere to the key itself;
    * values are inserted verbatim. ``str.format`` never re-parses a
      substituted value, so a task named "Filter {A}" needs no escaping —
      the notification copy doubled the braces anyway and users read
      "Filter {{A}}" on their phones;
    * a translation with a stray placeholder falls back to the English
      line instead of taking the whole message down.
    """
    english = tables.get("en", {})
    text = tables.get(lang, english).get(key)
    if text is None:
        text = english.get(key, key)
    if not kwargs:
        return text
    try:
        return text.format(**kwargs)
    except (KeyError, IndexError, ValueError):
        _LOGGER.warning("Malformed translation %s/%s — using the English text", lang, key)
        fallback = english.get(key, key)
        try:
            return fallback.format(**kwargs)
        except (KeyError, IndexError, ValueError):
            return fallback
