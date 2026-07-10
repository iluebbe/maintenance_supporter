"""i18n guards: language normalization + translation key parity.

Two independent concerns live here:

* ``normalize_language`` — regional/uppercase/empty HA codes collapse to a
  2-letter key (the Python localization dicts and the frontend both key off it).
* **Translation key parity** — Home Assistant localizes by loading a matching
  ``translations/<lang>.json`` with the *same* key structure as ``strings.json``;
  a missing key silently ships English to that locale. These pure-JSON checks
  (no HA runtime) fail CI the moment a locale, or ``strings.json`` itself, drifts
  from the English source — the same drift hazard the frontend already guards in
  ``frontend-src/__tests__/i18n-parity.test.ts``. They caught the ``panel_title``
  setting living in every ``translations/*.json`` but missing from ``strings.json``.
"""

from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

import pytest
from homeassistant.core import HomeAssistant

from custom_components.maintenance_supporter.helpers.i18n import normalize_language

_COMPONENT = Path(__file__).resolve().parents[1] / "custom_components" / "maintenance_supporter"
_STRINGS = _COMPONENT / "strings.json"
_TRANSLATIONS = _COMPONENT / "translations"
# Frontend panel/card UI strings: runtime-loaded JSON (only EN is bundled into
# the JS). Same parity discipline as the backend translations; the 2-letter
# codes (zh, not zh-Hans) match the frontend t() table keys.
_FRONTEND_LOCALES = _COMPONENT / "frontend-src" / "locales"
_FRONTEND_LANGUAGES = frozenset(
    {"de", "en", "nl", "fr", "it", "es", "pt", "ru", "uk", "pl", "cs", "sv", "zh", "da", "fi", "nb", "ja", "hi"}
)

# The shipped UI languages. Mirrors the frontend guard's set (which uses "zh");
# HA's on-disk convention is the regional file name "zh-Hans".
_EXPECTED_LANGUAGES = frozenset(
    {"cs", "de", "en", "es", "fr", "it", "nl", "pl", "pt", "ru", "sv", "uk", "zh-Hans", "da", "fi", "nb", "ja", "hi"}
)

# HA/Python ``str.format`` placeholder, e.g. ``{task_name}``.
_TOKEN_RE = re.compile(r"\{(\w+)\}")


def _load(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def _keys(obj: Any, prefix: str = "") -> set[str]:
    """Recursive set of dotted key paths in a nested mapping."""
    out: set[str] = set()
    if isinstance(obj, dict):
        for key, value in obj.items():
            path = f"{prefix}.{key}" if prefix else key
            out.add(path)
            out |= _keys(value, path)
    return out


def _strings(obj: Any, prefix: str = "") -> dict[str, str]:
    """Flatten to ``{dotted_key: str_value}`` (leaf strings only)."""
    out: dict[str, str] = {}
    if isinstance(obj, dict):
        for key, value in obj.items():
            path = f"{prefix}.{key}" if prefix else key
            if isinstance(value, str):
                out[path] = value
            else:
                out.update(_strings(value, path))
    return out


def _tokens(value: str) -> list[str]:
    return sorted(_TOKEN_RE.findall(value))


def _locale_files() -> list[Path]:
    return sorted(_TRANSLATIONS.glob("*.json"))


def _non_en_files() -> list[Path]:
    return [p for p in _locale_files() if p.stem != "en"]


@pytest.mark.parametrize(
    ("ha_language", "expected"),
    [
        ("en", "en"),
        ("de", "de"),
        ("zh-Hans", "zh"),  # HA's only Simplified-Chinese code
        ("zh-Hant", "zh"),
        ("pt-BR", "pt"),
        ("en-GB", "en"),
        ("es-419", "es"),
        ("ES", "es"),  # case-folded
        ("", "en"),  # empty -> default
        (None, "en"),  # unset -> default
    ],
)
def test_normalize_language(hass: HomeAssistant, ha_language: str | None, expected: str) -> None:
    """Regional, uppercase, empty and unset HA codes map to a 2-letter key."""
    hass.config.language = ha_language
    assert normalize_language(hass) == expected


def test_expected_languages_present() -> None:
    """The shipped locale set is exactly the documented 13 languages.

    Guards against an accidental locale deletion or an un-mirrored addition
    (a new ``translations/<lang>.json`` without updating the expected set).
    """
    present = {p.stem for p in _locale_files()}
    assert present == set(_EXPECTED_LANGUAGES), {
        "missing": sorted(set(_EXPECTED_LANGUAGES) - present),
        "unexpected": sorted(present - set(_EXPECTED_LANGUAGES)),
    }


def test_en_matches_strings() -> None:
    """``translations/en.json`` must be a structural copy of ``strings.json``.

    Catches the easy mistake of adding/removing a config-flow field, service,
    or entity string in one file but not the other (e.g. the ``panel_title``
    setting that was present in every locale but missing from ``strings.json``).
    """
    strings_keys = _keys(_load(_STRINGS))
    en_keys = _keys(_load(_TRANSLATIONS / "en.json"))
    assert en_keys == strings_keys, {
        "missing_in_en": sorted(strings_keys - en_keys),
        "extra_in_en": sorted(en_keys - strings_keys),
    }


@pytest.mark.parametrize("path", _non_en_files(), ids=lambda p: p.name)
def test_locale_key_parity(path: Path) -> None:
    """Every locale must share ``en.json``'s exact key structure.

    A missing key silently falls back to English for that language; an extra key
    is dead weight that drifts from the source. Both fail here, naming the keys.
    """
    en_keys = _keys(_load(_TRANSLATIONS / "en.json"))
    locale_keys = _keys(_load(path))
    assert locale_keys == en_keys, {
        "locale": path.name,
        "missing": sorted(en_keys - locale_keys),
        "extra": sorted(locale_keys - en_keys),
    }


@pytest.mark.parametrize("path", _non_en_files(), ids=lambda p: p.name)
def test_placeholder_parity(path: Path) -> None:
    """Each locale value must carry the same ``{token}`` set as English.

    A locale that drops a placeholder (``{task_name}`` vanishes) or renames it
    would silently break entity names / messages without failing key parity.
    """
    en = _strings(_load(_TRANSLATIONS / "en.json"))
    loc = _strings(_load(path))
    mismatches = {
        key: {"en": _tokens(en[key]), "locale": _tokens(value)}
        for key, value in loc.items()
        if key in en and _tokens(value) != _tokens(en[key])
    }
    assert not mismatches, {"locale": path.name, "placeholder_mismatch": mismatches}


@pytest.mark.parametrize("path", _locale_files(), ids=lambda p: p.name)
def test_no_brace_balance_errors(path: Path) -> None:
    """Every value must have balanced, non-nested ``{`` / ``}`` braces.

    Catches a stray brace from a hand-edited translation that would raise at
    ``str.format`` time or render a literal ``{`` in the UI.
    """
    bad: dict[str, str] = {}
    for key, value in _strings(_load(path)).items():
        depth = 0
        ok = True
        for ch in value:
            if ch == "{":
                depth += 1
            elif ch == "}":
                depth -= 1
            if depth not in (0, 1):  # no nesting, never negative
                ok = False
                break
        if not ok or depth != 0:
            bad[key] = value
    assert not bad, {"locale": path.name, "brace_errors": bad}


def _frontend_locale_files() -> list[Path]:
    return sorted(_FRONTEND_LOCALES.glob("*.json"))


def test_frontend_languages_present() -> None:
    """The frontend ships the same 13 UI languages (2-letter codes).

    Guards the runtime-loaded ``frontend-src/locales/*.json`` set after the
    panel's strings moved out of the JS bundle (only EN stays bundled).
    """
    present = {p.stem for p in _frontend_locale_files()}
    assert present == set(_FRONTEND_LANGUAGES), {
        "missing": sorted(set(_FRONTEND_LANGUAGES) - present),
        "unexpected": sorted(present - set(_FRONTEND_LANGUAGES)),
    }


@pytest.mark.parametrize(
    "path",
    [p for p in _frontend_locale_files() if p.stem != "en"],
    ids=lambda p: p.name,
)
def test_frontend_locale_key_parity(path: Path) -> None:
    """Every frontend locale mirrors ``en.json``'s key set.

    A missing key silently falls back to English at runtime; an extra key is
    dead weight. Replaces the old inline-``TRANSLATIONS`` TS guard now that the
    tables are runtime-loaded JSON files.
    """
    en_keys = _keys(_load(_FRONTEND_LOCALES / "en.json"))
    locale_keys = _keys(_load(path))
    assert locale_keys == en_keys, {
        "locale": path.name,
        "missing": sorted(en_keys - locale_keys),
        "extra": sorted(locale_keys - en_keys),
    }


def test_buy_name_templates_cover_every_ui_language() -> None:
    """The auto buy-task name table (helpers/parts.py) was the only 18-language
    table WITHOUT a language tripwire (DRY audit 2026-07-10) — a newly added
    UI language would silently fall back to the English "Buy {part}" there.
    Its keys are the frontend 2-letter codes (zh, not zh-Hans)."""
    from custom_components.maintenance_supporter.helpers.parts import _BUY_NAME_TEMPLATES

    assert set(_BUY_NAME_TEMPLATES) == set(_FRONTEND_LANGUAGES), {
        "missing": sorted(_FRONTEND_LANGUAGES - set(_BUY_NAME_TEMPLATES)),
        "extra": sorted(set(_BUY_NAME_TEMPLATES) - _FRONTEND_LANGUAGES),
    }
    assert all("{name}" in tpl for tpl in _BUY_NAME_TEMPLATES.values()), "every template must keep the {name} placeholder"
