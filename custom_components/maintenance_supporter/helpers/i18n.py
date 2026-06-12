"""Internationalization helpers."""

from __future__ import annotations

from homeassistant.core import HomeAssistant


def normalize_language(hass: HomeAssistant) -> str:
    """Return the HA UI language as a lowercase 2-letter table key.

    HA emits regional language codes (e.g. ``zh-Hans``, ``zh-Hant``,
    ``pt-BR``), but the integration's localization tables — the
    calendar/notification/config-flow Python string dicts, the
    ``name_<lang>`` template fields, and the ``styles.ts`` panel strings —
    are keyed by the bare 2-letter prefix. Centralizing the normalization
    keeps every consumer identical, so a regional-code user never silently
    falls back to English. Defaults to ``en`` when the language is unset.
    """
    return (getattr(hass.config, "language", None) or "en")[:2].lower()
