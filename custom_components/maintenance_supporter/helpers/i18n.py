"""Internationalization helpers."""

from __future__ import annotations

from homeassistant.core import HomeAssistant


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
