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

_FRONTEND = Path(__file__).resolve().parents[1] / "custom_components" / "maintenance_supporter" / "frontend-src"
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
        "object-columns.ts OBJECT_COLUMNS keys drifted from const.KNOWN_OBJECT_TABLE_COLUMNS"
    )


def test_ts_default_columns_match_const_defaults() -> None:
    src = _OBJECT_COLUMNS_TS.read_text(encoding="utf-8")
    block = _block(src, "export const DEFAULT_OBJECTS_TABLE_COLUMNS")
    ts_defaults = _quoted_strings(block)
    assert ts_defaults == DEFAULT_OBJECTS_TABLE_COLUMNS, "object-columns.ts DEFAULT_OBJECTS_TABLE_COLUMNS drifted from const.py"


def test_ts_currencies_match_const_budget_currencies() -> None:
    src = _SETTINGS_VIEW_TS.read_text(encoding="utf-8")
    block = _block(src, "const CURRENCIES")
    ts_currencies = _quoted_strings(block)
    assert ts_currencies == list(BUDGET_CURRENCIES), "settings-view.ts CURRENCIES drifted from const.BUDGET_CURRENCIES keys"


def test_ts_maintenance_type_keys_match_enum() -> None:
    """task-dialog MAINTENANCE_TYPE_KEYS must equal the Python enum (order incl.)."""
    src = _TASK_DIALOG_TS.read_text(encoding="utf-8")
    keys = _quoted_strings(_block(src, "const MAINTENANCE_TYPE_KEYS"))
    assert keys == [e.value for e in MaintenanceTypeEnum], "task-dialog.ts MAINTENANCE_TYPE_KEYS drifted from MaintenanceTypeEnum"


def test_ts_trigger_type_keys_match_enum() -> None:
    """TRIGGER_TYPE_KEYS = the non-compound trigger types; the WITH_COMPOUND
    superset = the full enum."""
    src = _TASK_DIALOG_TS.read_text(encoding="utf-8")
    flat = _quoted_strings(_block(src, "const TRIGGER_TYPE_KEYS ="))
    all_types = [t.value for t in TriggerType]
    assert flat == [t for t in all_types if t != TriggerType.COMPOUND], (
        "task-dialog.ts TRIGGER_TYPE_KEYS drifted from TriggerType (minus compound)"
    )
    assert [*flat, "compound"] == all_types, "TRIGGER_TYPE_KEYS + compound must equal the full TriggerType enum"


def test_ts_priority_keys_match_enum() -> None:
    """task-dialog PRIORITY_KEYS must equal the Python TaskPriority enum."""
    src = _TASK_DIALOG_TS.read_text(encoding="utf-8")
    keys = _quoted_strings(_block(src, "const PRIORITY_KEYS"))
    assert keys == [e.value for e in TaskPriority], "task-dialog.ts PRIORITY_KEYS drifted from TaskPriority"


def test_ts_rotation_strategies_match_const() -> None:
    """The task-dialog's rotation dropdown options must equal the Python
    ROTATION_STRATEGIES tuple (helpers/task_fields routes every Python surface
    through it; the TS dialog is the one hand-written copy left)."""
    from custom_components.maintenance_supporter.helpers.task_fields import (
        ROTATION_STRATEGY_VALUES,
    )

    src = _TASK_DIALOG_TS.read_text(encoding="utf-8")
    # The dropdown maps over an inline array: ["round_robin", ...].map(
    m = re.search(r"\[((?:\s*\"[a-z_]+\",?)+)\]\.map\(\s*\n?\s*\(key\) [^\n]*rotation_", src)
    assert m, "could not locate the rotation dropdown option array in task-dialog.ts"
    ts_values = re.findall(r'"([a-z_]+)"', m.group(1))
    assert ts_values == list(ROTATION_STRATEGY_VALUES), (
        f"task-dialog rotation options {ts_values} drifted from ROTATION_STRATEGIES {list(ROTATION_STRATEGY_VALUES)}"
    )


def test_python_enum_surfaces_share_task_fields_source() -> None:
    """Parity by construction (Python side): the WS schemas and every
    config-flow priority selector must consume TASK_PRIORITIES /
    INTERVAL_ANCHORS / the shared ranges from helpers/task_fields — no
    re-hardcoded literal option lists. A literal reappearing here means a
    surface was edited without the registry and can drift."""
    cc = Path(__file__).resolve().parents[1] / "custom_components" / "maintenance_supporter"
    surfaces = [
        cc / "websocket" / "tasks_crud.py",
        cc / "config_flow.py",
        cc / "config_flow_options_task_add.py",
        cc / "config_flow_options_task_crud.py",
    ]
    offenders: list[str] = []
    for path in surfaces:
        src = path.read_text(encoding="utf-8")
        if '"low", "normal", "high"' in src:
            offenders.append(f"{path.name}: hardcoded priority list")
        if '["completion", "planned"]' in src:
            offenders.append(f"{path.name}: hardcoded anchor list")
    assert not offenders, f"Task-field enums must come from helpers/task_fields: {offenders}"


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
    assert ts_langs == locale_files, f"SUPPORTED_LANGS {ts_langs} != shipped locales {locale_files}"


def test_status_colors_are_theme_token_based() -> None:
    """Dark-mode tripwire: every STATUS_COLORS value must resolve through an HA
    theme variable (``var(--…)``), never a bare hex/rgb literal. A bare colour
    ignores the active theme and can render low-contrast in dark mode.
    STATUS_COLORS lives in status-constants.ts since the 2026-07-10 DRY pass
    (dependency-free so the dashboard strategy can share it)."""
    src = (_FRONTEND / "status-constants.ts").read_text(encoding="utf-8")
    start = src.index("STATUS_COLORS")
    block = src[start : src.index("};", start)]
    # Collect the right-hand side of each `key: "value",` entry.
    values = re.findall(r':\s*"([^"]+)"', block)
    assert values, "could not parse STATUS_COLORS values"
    offenders = [v for v in values if "var(--" not in v]
    assert not offenders, f"STATUS_COLORS entries must use a theme token (var(--…)); bare colours break dark mode: {offenders}"


def test_status_palettes_cover_every_maintenance_status() -> None:
    """Coverage tripwire (drift audit 2026-08): the theme-token tests above
    check the palette VALUES but never that the KEY SET covers the enum — a
    7th MaintenanceStatus would render with no colour and no icon, silently.
    The calendar pills and the card editor are DELIBERATE subsets (actionable
    statuses only) and are asserted as such below, the _ATTR_EXEMPT way."""
    from custom_components.maintenance_supporter.const import MaintenanceStatus

    statuses = {s.value for s in MaintenanceStatus}
    src = (_FRONTEND / "status-constants.ts").read_text(encoding="utf-8")
    for name in ("STATUS_COLORS", "STATUS_ICONS"):
        start = src.index(name)
        block = src[start : src.index("};", start)]
        keys = set(re.findall(r"^\s*(\w+)\s*:", block, re.M))
        missing = statuses - keys
        assert not missing, f"{name} lacks entries for MaintenanceStatus values: {sorted(missing)}"


def test_history_type_map_covers_every_history_entry_type() -> None:
    """The calendar's past-mode map and the history filter chips must know
    every HistoryEntryType — `missed` was absent from the map and fell
    through to a green "ok" pill (real bug, drift audit 2026-08)."""
    from custom_components.maintenance_supporter.const import HistoryEntryType

    types = {t.value for t in HistoryEntryType}

    src = (_FRONTEND / "helpers" / "calendar-bucket.ts").read_text(encoding="utf-8")
    start = src.index("HISTORY_TYPE_TO_STATUS")
    block = src[start : src.index("};", start)]
    keys = set(re.findall(r"^\s*(\w+)\s*:", block, re.M))
    missing = types - keys
    assert not missing, f"HISTORY_TYPE_TO_STATUS lacks: {sorted(missing)} (falls through to a green 'ok')"

    hist = (_FRONTEND / "renderers" / "history.ts").read_text(encoding="utf-8")
    m = re.search(r"_FILTER_TYPES = \[([^\]]+)\]", hist)
    assert m, "could not parse _FILTER_TYPES"
    filter_types = set(re.findall(r'"(\w+)"', m.group(1)))
    missing = types - filter_types
    assert not missing, f"history filter chips lack: {sorted(missing)}"


def test_calendar_status_pills_are_theme_token_based() -> None:
    """Same dark-mode rule for the calendar's status pills: they used to keep a
    private hardcoded palette (triggered was even blue there) — every
    ``.cal-status-*`` background must go through a theme token now."""
    src = (_FRONTEND / "calendar-styles.ts").read_text(encoding="utf-8")
    rules = re.findall(r"\.cal-status-\w+\s*\{\s*background:\s*([^;]+);", src)
    assert rules, "could not parse .cal-status-* rules"
    offenders = [v for v in rules if "var(--" not in v]
    assert not offenders, f".cal-status-* pills must use theme tokens: {offenders}"


def test_status_chip_pills_are_theme_token_based() -> None:
    """The task-detail `.status-chip.*` set (panel-styles.ts) — the third status
    palette — must also route its background through a theme token. It predated
    STATUS_COLORS' token migration and kept bare hex, so it alone ignored custom/
    dark themes (the 3-palette drift the DRY audit surfaced)."""
    src = (_FRONTEND / "panel-styles.ts").read_text(encoding="utf-8")
    rules = re.findall(r"\.status-chip\.\w+\s*\{[^}]*?background:\s*([^;]+);", src)
    assert rules, "could not parse .status-chip.* rules"
    offenders = [v for v in rules if "var(--" not in v]
    assert not offenders, f".status-chip.* pills must use theme tokens (bare hex ignores the theme): {offenders}"


# === Every localized top-level surface must load its locale =================


def test_every_top_level_surface_loads_locale() -> None:
    """Every top-level UI surface that renders localized text (imports ``t`` from
    styles) must also call ``ensureLocale`` (directly or via the
    ``syncLocaleFromHass`` wrapper) — otherwise it paints in English
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
        # syncLocaleFromHass (styles.ts) wraps ensureLocale and additionally feeds
        # the HA profile date/time/number formats in (#163) — surfaces that
        # render formatted values use that instead of a bare ensureLocale.
        loads_locale = "ensureLocale" in src or "syncLocaleFromHass" in src
        if renders_localized and not loads_locale:
            offenders.append(f.name)
    assert not offenders, (
        f"top-level surfaces render localized text (import t) but never call ensureLocale — they'll show English: {offenders}"
    )


# === Saved-view filter value-sets (panel allowlists ↔ saved_views.py) ========

_PANEL_TS = _FRONTEND / "maintenance-panel.ts"


def test_ts_saved_view_sort_group_allowlists_match_python() -> None:
    """The panel validates a saved view's sort_mode / group_by against inline
    string allowlists (restated ~4× in maintenance-panel.ts). They MUST match the
    Python VALID_SORT_MODES / VALID_GROUP_BY the sanitiser coerces against — else
    a view the panel offers gets silently reset to due_date/none on save (a
    non-crashing data loss). Every `[...].includes(` allowlist is checked."""
    from custom_components.maintenance_supporter.helpers.saved_views import (
        VALID_GROUP_BY,
        VALID_SORT_MODES,
    )

    src = _PANEL_TS.read_text(encoding="utf-8")
    allowlists = re.findall(r"\[((?:\s*\"[^\"]+\",?)+)\s*\]\.includes\(", src)
    assert allowlists, "no [...].includes( allowlists found in maintenance-panel.ts"
    sort_seen = group_seen = 0
    for body in allowlists:
        values = set(re.findall(r'"([^"]+)"', body))
        if "due_date" in values:  # a sort-mode allowlist
            assert values == set(VALID_SORT_MODES), f"sort allowlist {values} != VALID_SORT_MODES {set(VALID_SORT_MODES)}"
            sort_seen += 1
        elif "none" in values and "user" in values:  # a group-by allowlist
            assert values == set(VALID_GROUP_BY), f"group allowlist {values} != VALID_GROUP_BY {set(VALID_GROUP_BY)}"
            group_seen += 1
    assert sort_seen and group_seen, f"expected both sort+group allowlists; saw sort={sort_seen} group={group_seen}"


# === WS command names (frontend literals ⊆ backend handlers) =================


def _backend_ws_commands() -> set[str]:
    """Every `maintenance_supporter/…` command the backend registers, parsed from
    the websocket modules (both f"{DOMAIN}/…" and literal forms)."""
    ws_dir = Path(__file__).resolve().parents[1] / "custom_components" / "maintenance_supporter" / "websocket"
    cmds: set[str] = set()
    for f in ws_dir.glob("*.py"):
        src = f.read_text(encoding="utf-8")
        cmds.update("maintenance_supporter/" + m for m in re.findall(r'f"\{DOMAIN\}/([a-z_][a-z_/]*)"', src))
        cmds.update(re.findall(r'"(maintenance_supporter/[a-z_][a-z_/]*)"', src))
    return cmds


def test_ws_command_names_frontend_subset_of_backend() -> None:
    """Every `maintenance_supporter/…` command string the frontend sends must
    have a backend handler — a typo or a renamed handler is otherwise a silent
    runtime 'unknown command'. (Backend-only commands are fine; the check is a
    subset, not equality.)"""
    backend = _backend_ws_commands()
    assert len(backend) > 30, f"backend command parse looks wrong: {len(backend)}"
    frontend: set[str] = set()
    for f in _FRONTEND.rglob("*.ts"):
        if "__tests__" in f.parts:
            continue
        frontend.update(re.findall(r'"(maintenance_supporter/[a-z_][a-z_/]*)"', f.read_text(encoding="utf-8")))
    orphans = frontend - backend
    assert not orphans, f"frontend sends WS commands with no backend handler: {sorted(orphans)}"


# === Settings keys (settings-view.ts ⊆ ALLOWED_SETTING_KEYS) =================


def test_settings_view_keys_subset_of_allowed() -> None:
    """Every key settings-view.ts writes via _updateSetting must be an allowed
    global-settings key — otherwise the UI offers a control the backend rejects."""
    from custom_components.maintenance_supporter.helpers.settings_registry import ALLOWED_SETTING_KEYS

    src = _SETTINGS_VIEW_TS.read_text(encoding="utf-8")
    written = set(re.findall(r'_updateSetting\(\s*"([a-z_][a-z_0-9]*)"', src))
    assert written, "no _updateSetting(\"key\", …) calls parsed from settings-view.ts"
    unknown = written - set(ALLOWED_SETTING_KEYS)
    assert not unknown, f"settings-view.ts writes keys not in ALLOWED_SETTING_KEYS: {sorted(unknown)}"


def test_panel_chunks_public_path_matches_const() -> None:
    """esbuild's publicPath and PANEL_CHUNKS_URL must stay in sync (DRY audit
    2026-08).

    The panel entry imports its code-split chunks by ABSOLUTE URL: esbuild
    rewrites the specifiers to ``<publicPath>/<chunkNames dir>/...`` while the
    backend mounts the static dir at ``PANEL_CHUNKS_URL``. The build config
    and the constant live in different files with only a comment tying them
    together — drift means every dialog chunk 404s in production.
    """
    from custom_components.maintenance_supporter.const import PANEL_CHUNKS_URL

    esbuild = (
        Path(__file__).parent.parent
        / "custom_components"
        / "maintenance_supporter"
        / "frontend-src"
        / "esbuild.mjs"
    ).read_text(encoding="utf-8")

    public_path = re.search(r'publicPath:\s*"([^"]+)"', esbuild)
    chunk_names = re.search(r'chunkNames:\s*"([^"]+)/\[name\]-\[hash\]"', esbuild)
    assert public_path, "publicPath missing from esbuild.mjs panel build"
    assert chunk_names, "chunkNames missing from esbuild.mjs panel build"
    expected = f"{public_path.group(1)}/{chunk_names.group(1)}"
    assert expected == PANEL_CHUNKS_URL, (
        f"PANEL_CHUNKS_URL ({PANEL_CHUNKS_URL}) != esbuild publicPath+chunk dir ({expected})"
    )


def test_ts_trigger_picker_domains_match_config_flow() -> None:
    """#129: the dialog's entity pickers and the config flow's EntitySelector
    are two UIs over the same trigger field — a domain usable in one must be
    pickable in the other."""
    from custom_components.maintenance_supporter.config_flow_trigger import TRIGGER_ENTITY_DOMAINS

    src = (_FRONTEND / "helpers" / "trigger-domains.ts").read_text(encoding="utf-8")
    block = _block(src, "export const TRIGGER_PICKER_DOMAINS")
    assert _quoted_strings(block) == list(TRIGGER_ENTITY_DOMAINS), (
        "trigger-domains.ts TRIGGER_PICKER_DOMAINS drifted from config_flow_trigger.TRIGGER_ENTITY_DOMAINS"
    )


def test_ts_environmental_picker_filter_matches_options_flow() -> None:
    """The environmental-entity picker mirrors the adaptive options step's
    EntitySelectorConfig (domain + device_class), parsed from the Python
    source since the config is inline."""
    flow_src = (
        Path(__file__).parents[1]
        / "custom_components"
        / "maintenance_supporter"
        / "config_flow_options_task_adaptive.py"
    ).read_text(encoding="utf-8")
    m = re.search(
        r"EntitySelectorConfig\(\s*domain=\[([^\]]+)\],\s*device_class=\[([^\]]+)\]",
        flow_src,
    )
    assert m, "adaptive EntitySelectorConfig not found in config_flow_options_task_adaptive.py"
    py_domains = re.findall(r'"([^"]+)"', m.group(1))
    py_classes = re.findall(r'"([^"]+)"', m.group(2))

    ts_src = (_FRONTEND / "helpers" / "trigger-domains.ts").read_text(encoding="utf-8")
    ts_domains = _quoted_strings(_block(ts_src, "export const ENVIRONMENTAL_PICKER_DOMAINS"))
    ts_classes = _quoted_strings(_block(ts_src, "export const ENVIRONMENTAL_PICKER_DEVICE_CLASSES"))
    assert ts_domains == py_domains, "ENVIRONMENTAL_PICKER_DOMAINS drifted from the adaptive options step"
    assert ts_classes == py_classes, "ENVIRONMENTAL_PICKER_DEVICE_CLASSES drifted from the adaptive options step"
