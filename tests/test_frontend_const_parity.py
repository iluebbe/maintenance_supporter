"""Cross-language parity tripwires: frontend TS mirrors ↔ Python const.py.

Several lists are hand-maintained in BOTH const.py and the TypeScript frontend
(the objects-table column catalog and the budget-currency codes). The TS files
carry "keep in lockstep with const.py" comments but nothing enforced it — so a
change to one side could silently drift from the other.

These tests parse the TS source as text and assert the mirrored lists match
const.py exactly (order included, since both are ordered for display). If you
change one side, update the other or this fails.
"""

from __future__ import annotations

import re
from pathlib import Path

from custom_components.maintenance_supporter.const import (
    BUDGET_CURRENCIES,
    DEFAULT_OBJECTS_TABLE_COLUMNS,
    KNOWN_OBJECT_TABLE_COLUMNS,
    MaintenanceTypeEnum,
    ScheduleType,
    TaskPriority,
    TriggerType,
)

_FRONTEND = (
    Path(__file__).resolve().parents[1]
    / "custom_components"
    / "maintenance_supporter"
    / "frontend-src"
)
_OBJECT_COLUMNS_TS = _FRONTEND / "helpers" / "object-columns.ts"
_SETTINGS_VIEW_TS = _FRONTEND / "components" / "settings-view.ts"
_TASK_DIALOG_TS = _FRONTEND / "components" / "task-dialog.ts"
_STYLES_TS = _FRONTEND / "styles.ts"
_LOCALES_DIR = _FRONTEND / "locales"


def _block(source: str, anchor: str) -> str:
    """Return the text between ``anchor`` and the next ``];``."""
    start = source.index(anchor)
    end = source.index("];", start)
    return source[start:end]


def _quoted_strings(text: str) -> list[str]:
    """Every double-quoted string in ``text``, in order."""
    return re.findall(r'"([^"]+)"', text)


def test_ts_object_columns_match_const_known_columns() -> None:
    src = _OBJECT_COLUMNS_TS.read_text(encoding="utf-8")
    # OBJECT_COLUMNS defs → the `key:` of each entry, in canonical order.
    block = _block(src, "export const OBJECT_COLUMNS")
    ts_keys = re.findall(r'key:\s*"([^"]+)"', block)
    assert ts_keys == KNOWN_OBJECT_TABLE_COLUMNS, (
        "object-columns.ts OBJECT_COLUMNS keys drifted from "
        "const.KNOWN_OBJECT_TABLE_COLUMNS"
    )


def test_ts_default_columns_match_const_defaults() -> None:
    src = _OBJECT_COLUMNS_TS.read_text(encoding="utf-8")
    block = _block(src, "export const DEFAULT_OBJECTS_TABLE_COLUMNS")
    ts_defaults = _quoted_strings(block)
    assert ts_defaults == DEFAULT_OBJECTS_TABLE_COLUMNS, (
        "object-columns.ts DEFAULT_OBJECTS_TABLE_COLUMNS drifted from const.py"
    )


def test_ts_currencies_match_const_budget_currencies() -> None:
    src = _SETTINGS_VIEW_TS.read_text(encoding="utf-8")
    block = _block(src, "const CURRENCIES")
    ts_currencies = _quoted_strings(block)
    assert ts_currencies == list(BUDGET_CURRENCIES), (
        "settings-view.ts CURRENCIES drifted from const.BUDGET_CURRENCIES keys"
    )


def test_ts_maintenance_type_keys_match_enum() -> None:
    """task-dialog MAINTENANCE_TYPE_KEYS must equal the Python enum (order incl.)."""
    src = _TASK_DIALOG_TS.read_text(encoding="utf-8")
    keys = _quoted_strings(_block(src, "const MAINTENANCE_TYPE_KEYS"))
    assert keys == [e.value for e in MaintenanceTypeEnum], (
        "task-dialog.ts MAINTENANCE_TYPE_KEYS drifted from MaintenanceTypeEnum"
    )


def test_ts_trigger_type_keys_match_enum() -> None:
    """TRIGGER_TYPE_KEYS = the non-compound trigger types; the WITH_COMPOUND
    superset = the full enum."""
    src = _TASK_DIALOG_TS.read_text(encoding="utf-8")
    flat = _quoted_strings(_block(src, "const TRIGGER_TYPE_KEYS ="))
    all_types = [t.value for t in TriggerType]
    assert flat == [t for t in all_types if t != TriggerType.COMPOUND], (
        "task-dialog.ts TRIGGER_TYPE_KEYS drifted from TriggerType (minus compound)"
    )
    assert [*flat, "compound"] == all_types, (
        "TRIGGER_TYPE_KEYS + compound must equal the full TriggerType enum"
    )


def test_ts_priority_keys_match_enum() -> None:
    """task-dialog PRIORITY_KEYS must equal the Python TaskPriority enum."""
    src = _TASK_DIALOG_TS.read_text(encoding="utf-8")
    keys = _quoted_strings(_block(src, "const PRIORITY_KEYS"))
    assert keys == [e.value for e in TaskPriority], (
        "task-dialog.ts PRIORITY_KEYS drifted from TaskPriority"
    )


def test_ts_schedule_type_keys_cover_every_enum_value() -> None:
    """SCHEDULE_TYPE_KEYS mixes ScheduleType values with calendar kinds; it must
    at least offer every ScheduleType value so no schedule kind is unreachable."""
    src = _TASK_DIALOG_TS.read_text(encoding="utf-8")
    keys = set(_quoted_strings(_block(src, "const SCHEDULE_TYPE_KEYS")))
    missing = {s.value for s in ScheduleType} - keys
    assert not missing, f"SCHEDULE_TYPE_KEYS is missing ScheduleType values: {missing}"


def test_supported_langs_match_locale_files() -> None:
    """styles.SUPPORTED_LANGS must list exactly the shipped locales/*.json files
    (minus 'en', the bundled default) — else a new language silently serves
    English because ensureLocale never fetches it."""
    src = _STYLES_TS.read_text(encoding="utf-8")
    start = src.index("const SUPPORTED_LANGS")
    block = src[start : src.index("])", start)]
    ts_langs = set(_quoted_strings(block))
    locale_files = {p.stem for p in _LOCALES_DIR.glob("*.json")} - {"en"}
    assert ts_langs == locale_files, (
        f"SUPPORTED_LANGS {ts_langs} != shipped locales {locale_files}"
    )


# === Every localized top-level surface must load its locale =================


def test_every_top_level_surface_loads_locale() -> None:
    """Every top-level UI surface that renders localized text (imports ``t`` from
    styles) must also call ``ensureLocale`` — otherwise it paints in English
    until some *other* surface happens to fetch the locale. This is the class of
    bug where a dashboard-strategy-opened dialog / section card showed English
    while the rest of HA was translated.

    Top-level surfaces = the esbuild entry points, the dialog mounter (which
    loads the locale for every strategy-opened dialog), and the strategy-mounted
    section cards. Child components inherit the loaded locale from their parent
    and are intentionally excluded.
    """
    surfaces = [
        _FRONTEND / "maintenance-panel.ts",
        _FRONTEND / "maintenance-card.ts",
        _FRONTEND / "maintenance-calendar-card.ts",
        _FRONTEND / "dialog-mount.ts",
        *sorted((_FRONTEND / "components").glob("*-section-card.ts")),
    ]
    imports_t = re.compile(r'import\s*\{[^}]*\bt\b[^}]*\}\s*from\s*"\.{1,2}/styles"')
    offenders = []
    for f in surfaces:
        assert f.exists(), f"surface missing: {f}"
        src = f.read_text(encoding="utf-8")
        renders_localized = bool(imports_t.search(src))
        loads_locale = "ensureLocale" in src
        if renders_localized and not loads_locale:
            offenders.append(f.name)
    assert not offenders, (
        "top-level surfaces render localized text (import t) but never call "
        f"ensureLocale — they'll show English: {offenders}"
    )
