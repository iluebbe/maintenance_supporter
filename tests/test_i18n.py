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
    {"de", "en", "nl", "fr", "it", "es", "pt", "pt-br", "ru", "uk", "pl", "cs", "sv", "zh", "da", "fi", "nb", "ja", "hi", "hu", "ko", "tr"}
)

# The shipped UI languages. Mirrors the frontend guard's set (which uses "zh"
# and "pt-br"); HA's on-disk convention is the regional file name ("zh-Hans",
# "pt-BR").
_EXPECTED_LANGUAGES = frozenset(
    {
        "cs", "de", "en", "es", "fr", "it", "nl", "pl", "pt", "pt-BR", "ru", "sv", "uk",
        "zh-Hans", "da", "fi", "nb", "ja", "hi", "hu", "ko", "tr",
    }
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
        ("pt-BR", "pt-br"),  # the one regional variant with its own tables
        ("pt-PT", "pt"),
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


# ── Value-level completeness gates ──────────────────────────────────────────
#
# Key parity alone lets untranslated VALUES ship: the easiest way to satisfy it
# is copying the English value into all 18 files "for now" — which is exactly
# how "Missed" / "Snooze" / "Last day of month" ended up live in ru/zh/cs
# (2026-07 audit: 270 such values). These gates make that a CI failure.

# Languages whose UI text is written in a non-Latin script. A value that
# contains Latin words but not a single native-script character is untranslated
# English, not a loanword. (CJK punctuation counts as native for zh/ja.)
_NATIVE_SCRIPTS = {
    "ru": re.compile(r"[Ѐ-ӿ]"),  # Cyrillic
    "uk": re.compile(r"[Ѐ-ӿ]"),
    "zh": re.compile(r"[一-鿿]"),  # Han
    "zh-Hans": re.compile(r"[一-鿿]"),  # backend file-name variant
    "ja": re.compile(r"[぀-ヿ一-鿿]"),  # Kana + Han
    "hi": re.compile(r"[ऀ-ॿ]"),  # Devanagari
    "ko": re.compile(r"[가-힣ᄀ-ᇿ]"),  # Hangul
}

# Values that are language-neutral everywhere (acronyms, formats, symbols).
_NEUTRAL_VALUES = {"ok", "id", "url", "qr", "pdf", "csv", "svg", "json", "nfc", "matter", "e-mail", "email", "beta", "mdns"}

# Frontend keys whose value is LEGITIMATELY identical to English in the listed
# languages (audited cognates/loanwords — "Dashboard" IS the German word,
# "Notes"/"Actions" ARE French) or legitimately ASCII in native-script
# languages ("*"). Adding a key here is a REVIEWED decision, not a shortcut:
# a new failure means translate the value or consciously allowlist it.
_VALUE_OK: dict[str, frozenset[str] | str] = {
    "actions": frozenset({"fr"}),
    "qr_print_actions": frozenset({"fr"}),
    "area": frozenset({"it"}),
    "sort_area": frozenset({"it"}),
    "battery_fleet_offline": frozenset({"de", "it", "nl", "pl", "pt", "sv", "da", "fi", "cs", "pt-br", "hu"}),
    "checklist": frozenset({"fr", "it", "nl", "pt-br"}),
    "feat_checklists": frozenset({"fr", "nl", "pt-br"}),
    "compound_condition": frozenset({"fr"}),
    "dashboard": frozenset({"de", "it", "nl"}),
    "degradation_trend": frozenset({"de", "nl", "pl", "sv", "nb", "cs", "hu"}),
    "doc_cat_manual": frozenset({"es", "pt", "sv", "pt-br"}),
    "documentation_url_label": frozenset({"es", "pt", "sv", "da", "pt-br"}),
    "manual": frozenset({"es", "pt", "pt-br"}),
    "seasonal_manual": frozenset({"es", "pt", "pt-br"}),
    "doc_cat_photo": frozenset({"fr"}),
    "doc_download": frozenset({"da"}),
    "qr_download": frozenset({"da"}),
    "doc_link_badge": frozenset({"de", "it", "nl", "pl", "da", "pt-br"}),
    "doc_link_url": "*",  # "URL (https://…)" — syntax hint, neutral
    "doc_page": frozenset({"fr"}),
    "documentation_label": frozenset({"fr"}),
    "documents": frozenset({"fr"}),
    "filter_label": frozenset({"de", "nl", "sv", "da", "nb"}),
    "qr_print_filter": frozenset({"de", "nl", "sv", "da", "nb"}),
    "inspection": frozenset({"fr"}),
    "interval": frozenset({"nl", "da", "cs"}),
    "interval_value": frozenset({"nl", "da", "cs"}),
    "label_filter": frozenset({"de", "nl"}),
    "labels": frozenset({"de", "nl"}),
    "maintenance": frozenset({"fr"}),
    "model": frozenset({"nl", "pl", "da", "cs", "tr"}),
    "name": frozenset({"de"}),
    "part_name": frozenset({"de"}),
    # "Photo" is the French word too.
    "photo_label": frozenset({"fr"}),
    "normal": frozenset({"de", "fr", "es", "pt", "sv", "da", "nb", "pt-br", "tr"}),
    "priority_normal": frozenset({"de", "es", "pt", "sv", "da", "nb", "pt-br", "tr"}),
    "notes_label": frozenset({"fr"}),
    "object_notes_label": frozenset({"fr"}),
    "report_notes": frozenset({"fr"}),
    "quick_complete_defaults_notes": frozenset({"fr"}),
    "object": frozenset({"nl"}),
    "on_complete_action_service": frozenset({"de", "fr", "nl"}),
    "service": frozenset({"de", "fr", "nl", "sv", "da", "nb"}),
    "part_stock": frozenset({"fr"}),
    "qr_mode_companion": "*",  # "Companion App" — HA product name
    "qr_mode_local": frozenset({"fr", "es", "pt", "pt-br"}),
    "recurrence_occurrence": frozenset({"fr"}),
    "report_button": frozenset({"it"}),
    "report_col_status": frozenset({"de", "nl", "pl", "sv", "da", "nb", "pt-br"}),
    "report_col_type": frozenset({"fr", "nl", "da", "nb"}),
    "sort_type": frozenset({"fr", "nl", "da", "nb"}),
    "reset": frozenset({"cs"}),
    "rotation_strategy": frozenset({"de", "fr", "sv", "da"}),
    "send_test": frozenset({"da", "nb"}),
    "settings_budget": frozenset({"de", "fr", "it", "nl", "sv", "da"}),
    "settings_general": frozenset({"es"}),
    "settings_import_export": frozenset({"de", "fr", "it", "nl", "sv", "cs"}),
    "settings_notifications": frozenset({"fr"}),
    "settings_quiet_start": frozenset({"nl", "sv", "da", "nb"}),
    "vacation_start": frozenset({"sv", "da", "nb"}),
    "trend_stable": frozenset({"fr"}),
    "trigger": frozenset({"de", "it", "nl"}),
    "weibull_r_squared": frozenset({"nl"}),
    "worksheet_pages": frozenset({"fr"}),
}


def _value_allowlisted(key: str, lang: str) -> bool:
    allowed = _VALUE_OK.get(key)
    return allowed == "*" or (isinstance(allowed, frozenset) and lang in allowed)


def _suspicious_value(key: str, lang: str, value: str, en_value: str | None) -> bool:
    """True when *value* looks like untranslated English for *lang*."""
    stripped = _TOKEN_RE.sub("", value).strip()  # placeholders are neutral
    if len(stripped) <= 3 or stripped.lower() in _NEUTRAL_VALUES:
        return False
    if _value_allowlisted(key, lang):
        return False
    native = _NATIVE_SCRIPTS.get(lang)
    if native is not None:
        # Latin words but not one native-script character → not translated.
        return bool(re.search(r"[A-Za-z]{3}", stripped)) and not native.search(value)
    # Latin-script language: byte-identical to English is suspect.
    return value == en_value and bool(re.search(r"[A-Za-z]{3}", stripped))


@pytest.mark.parametrize(
    "path",
    [p for p in sorted(_FRONTEND_LOCALES.glob("*.json")) if p.stem != "en"],
    ids=lambda p: p.name,
)
def test_frontend_locale_value_completeness(path: Path) -> None:
    """No untranslated English VALUES behind a green key parity.

    Copying the EN value into every locale satisfies key parity but ships
    English UI to that language. Fails naming (key, value); fix = translate,
    or — for a genuine cognate/loanword — consciously extend ``_VALUE_OK``.
    """
    en = _load(_FRONTEND_LOCALES / "en.json")
    lang = path.stem
    bad = {
        key: value
        for key, value in _load(path).items()
        if isinstance(value, str) and _suspicious_value(key, lang, value, en.get(key))
    }
    assert not bad, {"locale": path.name, "untranslated_values": bad}


# Backend translations: cognates allowlisted by VALUE (the same English word
# appears under many dotted keys — "Notes" alone has 8). A value listed here
# is legitimately identical to English in the given languages; "*" = all.
_BACKEND_VALUE_OK: dict[str, frozenset[str] | str] = {
    "Action": frozenset({"fr"}),
    "Area": frozenset({"it"}),
    "Checklists": frozenset({"nl", "pt-BR"}),
    "Condition #{condition_num} — Type": frozenset({"fr"}),
    "Date": frozenset({"fr"}),
    "Description": frozenset({"fr"}),
    "Format": frozenset({"da", "de", "fr", "nb", "pl", "sv"}),
    "Inspection": frozenset({"fr"}),
    "Interval": frozenset({"cs", "da", "nl"}),
    "Labels": frozenset({"de", "nl"}),
    "Maintenance": frozenset({"fr"}),
    "Maintenance Supporter": "*",  # brand
    "Manual": frozenset({"es", "pt", "pt-BR"}),
    "Model": frozenset({"cs", "da", "nl", "pl", "tr"}),
    "Name": frozenset({"de"}),
    "Notes": frozenset({"fr"}),
    "Object": frozenset({"nl"}),
    "Service": frozenset({"da", "de", "fr", "nb", "nl", "sv"}),
    "Stable": frozenset({"fr"}),
    "Status": frozenset({"da", "de", "nb", "nl", "pl", "pt-BR", "sv"}),
    "Weibull R²": "*",  # statistical term
}


@pytest.mark.parametrize("path", _non_en_files(), ids=lambda p: p.name)
def test_backend_locale_value_completeness(path: Path) -> None:
    """Backend twin of the frontend value gate (same 270-values lesson).

    A ``translations/<lang>.json`` value identical to English (Latin-script
    languages), or containing Latin words without one native-script character
    (ru/uk/zh-Hans/ja/hi), is untranslated. Cognates are allowlisted by VALUE
    in ``_BACKEND_VALUE_OK`` since the same English word repeats across many
    dotted keys.
    """
    en = _strings(_load(_TRANSLATIONS / "en.json"))
    lang = path.stem
    native = _NATIVE_SCRIPTS.get(lang)
    bad: dict[str, str] = {}
    for key, value in _strings(_load(path)).items():
        en_value = en.get(key)
        stripped = _TOKEN_RE.sub("", value).strip()
        if len(stripped) <= 3 or stripped.lower() in _NEUTRAL_VALUES:
            continue
        allowed = _BACKEND_VALUE_OK.get(en_value or "")
        if allowed == "*" or (isinstance(allowed, frozenset) and lang in allowed and value == en_value):
            continue
        if native is not None:
            if re.search(r"[A-Za-z]{3}", stripped) and not native.search(value):
                bad[key] = value
        elif value == en_value and re.search(r"[A-Za-z]{3}", stripped):
            bad[key] = value
    assert not bad, {"locale": path.name, "untranslated_values": bad}


# Static t("...") literals in the panel/card sources. Dynamic keys
# (t(`prefix_${x}`), t(variable)) are invisible here and intentionally skipped.
_T_CALL_RE = re.compile(r"""\bt\(\s*(?:"([^"]+)"|'([^']+)')\s*[,)]""")


def test_frontend_t_usage_coverage() -> None:
    """Every static ``t("key")`` in the frontend sources exists in en.json.

    ``t()`` falls back to the RAW KEY string when a key is missing from every
    locale — key parity can't catch that (all files are equally missing it),
    so a typo'd or forgotten key renders as e.g. ``battery_fleet_title`` in
    the UI. This scans the sources and fails on the first unknown key.
    """
    en_keys = set(_load(_FRONTEND_LOCALES / "en.json"))
    src = _COMPONENT / "frontend-src"
    missing: dict[str, str] = {}
    for ts in src.rglob("*.ts"):
        rel = ts.relative_to(src).as_posix()
        if rel.startswith(("node_modules/", "__tests__/", "locales/")):
            continue
        for match in _T_CALL_RE.finditer(ts.read_text(encoding="utf-8", errors="replace")):
            key = match.group(1) or match.group(2)
            if key not in en_keys:
                missing.setdefault(key, rel)
    assert not missing, {"t()_keys_missing_from_en.json": missing}


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


def test_normalize_language_code_regional_variants() -> None:
    """pt-BR is the one regional variant with its OWN tables — every other
    regional code collapses to its 2-letter prefix. A bare [:2] anywhere
    would silently hand Brazilian users the European Portuguese UI."""
    from custom_components.maintenance_supporter.helpers.i18n import normalize_language_code

    assert normalize_language_code("pt-BR") == "pt-br"
    assert normalize_language_code("pt_BR") == "pt-br"
    assert normalize_language_code("pt") == "pt"
    assert normalize_language_code("pt-PT") == "pt"
    assert normalize_language_code("de-DE") == "de"
    assert normalize_language_code("zh-Hans") == "zh"
    assert normalize_language_code(None) == "en"


# ─── In-python language tables (2026-08 parity audit) ────────────────────────
#
# Four modules carry their own language dicts in Python (the notification
# manager, the logbook renderer, the calendar entity and the options-flow
# test-notification result). Nothing coupled them to the 22 locale languages
# — two silently stalled at 14 (calendar + test-notification) while the file
# locales grew. These pins derive from the SAME expectation as the locale
# files, so a new UI language fails here until every in-python table learns
# it too (feedback_new_language_pr_audit class).

# The python tables use lowercase/short codes where the locale files use
# BCP-47-ish ones.
_PY_TABLE_LANGUAGES = frozenset(
    lang.lower().replace("zh-hans", "zh") for lang in _EXPECTED_LANGUAGES
)


def _py_language_tables() -> dict[str, dict[str, dict[str, str]]]:
    from custom_components.maintenance_supporter import calendar as cal_mod
    from custom_components.maintenance_supporter import config_flow_options_global as ofg
    from custom_components.maintenance_supporter import logbook as logbook_mod
    from custom_components.maintenance_supporter.helpers import notification_manager as nm

    return {
        "notification_manager._NOTIFICATION_STRINGS": nm._NOTIFICATION_STRINGS,
        "logbook._STRINGS": logbook_mod._STRINGS,
        "calendar._CAL_STRINGS": cal_mod._CAL_STRINGS,
        "config_flow_options_global._TEST_NOTIFICATION_RESULTS": ofg._TEST_NOTIFICATION_RESULTS,
    }


def test_py_language_tables_cover_every_language() -> None:
    for name, table in _py_language_tables().items():
        present = set(table)
        assert present == _PY_TABLE_LANGUAGES, {
            "table": name,
            "missing": sorted(_PY_TABLE_LANGUAGES - present),
            "unexpected": sorted(present - _PY_TABLE_LANGUAGES),
        }


def test_py_language_tables_key_parity() -> None:
    """Every language block carries exactly the English key set."""
    for name, table in _py_language_tables().items():
        ref = set(table["en"])
        for lang, block in table.items():
            assert set(block) == ref, {
                "table": name,
                "lang": lang,
                "missing": sorted(ref - set(block)),
                "extra": sorted(set(block) - ref),
            }


def test_py_language_tables_placeholder_parity() -> None:
    """``{placeholders}`` must survive translation in the python tables too."""
    for name, table in _py_language_tables().items():
        for key, ref_val in table["en"].items():
            ref_tokens = set(_TOKEN_RE.findall(ref_val))
            for lang, block in table.items():
                tokens = set(_TOKEN_RE.findall(block[key]))
                assert tokens == ref_tokens, {
                    "table": name, "lang": lang, "key": key,
                    "missing": sorted(ref_tokens - tokens),
                    "extra": sorted(tokens - ref_tokens),
                }
