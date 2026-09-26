"""Internationalization helpers."""

from __future__ import annotations

import logging
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
