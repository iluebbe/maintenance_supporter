"""The validation of a settings write against the settings registry: the one
sanitizer behind the ``global/update`` command, the settings import and the
options flow's general step, so the three surfaces cannot drift. Returns the
accepted subset and, for a refused value, the error code."""

from __future__ import annotations

import math
from typing import Any, cast

from homeassistant.core import valid_entity_id

from ..const import (
    BUDGET_CURRENCIES,
    CONF_ADMIN_PANEL_USER_IDS,
    CONF_BATTERY_LIFETIME_MONTHS,
    CONF_BUDGET_CURRENCY,
    CONF_DISABLED_TEMPLATE_IDS,
    CONF_HOME_REGION,
    CONF_HOME_TYPE,
    CONF_MEMBER_DISPLAY,
    CONF_MIRROR_TODO_DEFAULT_ENTITIES,
    CONF_NOTIFICATION_TITLE_STYLE,
    CONF_NOTIFY_COMPLETED,
    CONF_NOTIFY_SERVICE,
    CONF_OBJECTS_TABLE_COLUMNS,
    CONF_PANEL_TITLE,
    CONF_PART_SEARCH_URL_TEMPLATE,
    CONF_PARTS_COST_MODE,
    CONF_QUIET_HOURS_END,
    CONF_QUIET_HOURS_START,
    CONF_REMINDER_LEAD_DAYS,
    CONF_ROW_ACTION_STYLE,
    CONF_SHARED_DEVICE_USER_IDS,
    CONF_SHOPPING_LIST_ENTITY,
    DEFAULT_OBJECTS_TABLE_COLUMNS,
    HOME_TYPES,
    KNOWN_OBJECT_TABLE_COLUMNS,
    MAX_PANEL_TITLE_LENGTH,
    MAX_REMINDER_LEADS,
    NOTIFICATION_TITLE_STYLES,
    NOTIFY_COMPLETED_MODES,
    PARTS_COST_MODES,
    ROW_ACTION_STYLES,
    TIME_HHMMSS_PATTERN,
)
from .battery_lifetime import sanitize_lifetime_overrides
from .member_display import sanitize_member_display
from .notify_targets import validate_notify_service
from .parts import valid_search_template
from .region import is_region_setting
from .sanitize import sanitize_mirror_todo_entities
from .settings_registry import (
    ALLOWED_SETTING_KEYS,
    FLOAT_RANGES,
    INT_RANGES,
    STR_MAX_LENGTHS,
)

# Keys accepted by global/update + their range/cap tables are derived from the
# single settings registry (helpers/settings_registry) so they can't drift from
# each other or from the options-flow selectors that share the same specs.
# Every value is a SettingSpec.py_type — a plain class, the isinstance()
# target below; the registry's ``type | vol.Any`` value annotation is wider
# than what it actually holds.
_ALLOWED_SETTING_KEYS = cast(dict[str, type], ALLOWED_SETTING_KEYS)


def settings_error_field(error: str) -> str:
    """The setting a ``sanitize_settings_input`` error code refers to — the
    notify-service codes come from ``validate_notify_service``, the others are
    the sanitizer's own early returns."""
    return {
        "invalid_shopping_list_entity": CONF_SHOPPING_LIST_ENTITY,
        "invalid_search_template": CONF_PART_SEARCH_URL_TEMPLATE,
    }.get(error, CONF_NOTIFY_SERVICE)


def sanitize_settings_input(settings_input: dict[str, Any]) -> tuple[dict[str, Any], str | None]:
    """Filter + validate a flat settings dict against the registry.

    Returns ``(filtered, notify_error)`` — the validated subset plus the
    error code when ``notify_service`` was present but invalid. Shared by
    ``global/update`` and the settings-export import path so the two
    surfaces cannot drift."""

    # Filter to allowed keys and validate types
    filtered: dict[str, Any] = {}
    for key, expected_type in _ALLOWED_SETTING_KEYS.items():
        if key in settings_input:
            val = settings_input[key]
            # bool is an int subclass in Python, so a bare isinstance() let
            # `{"default_warning_days": true}` through as 1 — reject bools for
            # every numeric spec (bug audit 2026-09-12).
            if expected_type in (int, float) and isinstance(val, bool):
                continue
            # Accept int for float fields
            if expected_type is float and isinstance(val, int):
                val = float(val)
            # The options flow's NumberSelector persists ints as floats (7.0);
            # a settings export → import used to drop those keys silently.
            # An INTEGRAL float is the same number — coerce it; 7.5 stays out.
            if expected_type is int and isinstance(val, float) and math.isfinite(val) and val.is_integer():
                val = int(val)
            if isinstance(val, expected_type):
                filtered[key] = val

    # Range-validate numeric and string settings against the shared registry.
    for key, (lo, hi) in INT_RANGES.items():
        if key in filtered and not (lo <= filtered[key] <= hi):
            del filtered[key]
    for key, (flo, fhi) in FLOAT_RANGES.items():
        if key in filtered:
            v = filtered[key]
            if not math.isfinite(v) or not (flo <= v <= fhi):
                del filtered[key]
    for key, max_len in STR_MAX_LENGTHS.items():
        if key in filtered and len(filtered[key]) > max_len:
            del filtered[key]

    # Sidebar panel title (#63): trim + cap rather than drop, so an over-long
    # or padded value is normalised instead of silently ignored. A blank value
    # is kept (it clears the override → panel falls back to the default title).
    if CONF_PANEL_TITLE in filtered:
        raw_title = filtered[CONF_PANEL_TITLE]
        if isinstance(raw_title, str):
            filtered[CONF_PANEL_TITLE] = raw_title.strip()[:MAX_PANEL_TITLE_LENGTH]
        else:
            del filtered[CONF_PANEL_TITLE]

    # v1.4.0 (#44): enum-validate notification_title_style. Anything outside
    # the known set is dropped silently so a bogus value can't get into the
    # ConfigEntry options.
    if CONF_PARTS_COST_MODE in filtered and filtered[CONF_PARTS_COST_MODE] not in PARTS_COST_MODES:
        del filtered[CONF_PARTS_COST_MODE]
    # Only a currency the pickers offer (bug audit 2026-10-17, N-17).
    if CONF_BUDGET_CURRENCY in filtered and filtered[CONF_BUDGET_CURRENCY] not in BUDGET_CURRENCIES:
        del filtered[CONF_BUDGET_CURRENCY]

    if CONF_HOME_TYPE in filtered and filtered[CONF_HOME_TYPE] not in HOME_TYPES:
        del filtered[CONF_HOME_TYPE]
    if CONF_HOME_REGION in filtered and not is_region_setting(filtered[CONF_HOME_REGION]):
        del filtered[CONF_HOME_REGION]
    if CONF_NOTIFY_COMPLETED in filtered and filtered[CONF_NOTIFY_COMPLETED] not in NOTIFY_COMPLETED_MODES:
        filtered[CONF_NOTIFY_COMPLETED] = "off"
    if CONF_NOTIFICATION_TITLE_STYLE in filtered and filtered[CONF_NOTIFICATION_TITLE_STYLE] not in NOTIFICATION_TITLE_STYLES:
        del filtered[CONF_NOTIFICATION_TITLE_STYLE]

    # #145: same treatment for the row-action style.
    if CONF_ROW_ACTION_STYLE in filtered and filtered[CONF_ROW_ACTION_STYLE] not in ROW_ACTION_STYLES:
        del filtered[CONF_ROW_ACTION_STYLE]

    # v1.4.6 (#44 follow-up): drop quiet-hours time strings that aren't valid
    # HH:MM[:SS]. The HA TimeSelector in the options-flow rejects empty / bad
    # strings as "Invalid time" and that error blocks the entire form save —
    # even when the user is here to change something else and quiet_hours is
    # disabled. By dropping invalid values here, the form falls back to the
    # 22:00 / 08:00 defaults next render.
    for time_key in (CONF_QUIET_HOURS_START, CONF_QUIET_HOURS_END):
        if time_key in filtered:
            v = filtered[time_key]
            if not isinstance(v, str) or not TIME_HHMMSS_PATTERN.match(v):
                del filtered[time_key]

    # Sanitise the user-id lists (admin_panel_user_ids, the shared devices):
    # drop non-string entries + whitespace-only entries, cap each at 64
    # chars (HA user UUIDs are 32), cap list at 50 entries, dedupe.
    for user_ids_key in (CONF_ADMIN_PANEL_USER_IDS, CONF_SHARED_DEVICE_USER_IDS):
        if user_ids_key not in filtered:
            continue
        raw = filtered[user_ids_key]
        cleaned: list[str] = []
        seen: set[str] = set()
        for v in raw:
            if not isinstance(v, str):
                continue
            stripped = v.strip()
            if not stripped or len(stripped) > 64:
                continue
            if stripped in seen:
                continue
            seen.add(stripped)
            cleaned.append(stripped)
            if len(cleaned) >= 50:
                break
        filtered[user_ids_key] = cleaned

    # Multiple lead-time reminders: keep only ints within 0..365, dedupe, sort
    # descending (furthest lead first), cap the list. Empty list is valid — it
    # turns the feature off.
    if CONF_REMINDER_LEAD_DAYS in filtered:
        raw_leads = filtered[CONF_REMINDER_LEAD_DAYS]
        leads: list[int] = []
        for v in raw_leads:
            if isinstance(v, bool) or not isinstance(v, int):
                continue
            if 0 <= v <= 365 and v not in leads:
                leads.append(v)
        filtered[CONF_REMINDER_LEAD_DAYS] = sorted(leads, reverse=True)[:MAX_REMINDER_LEADS]

    # (#67): objects_table_columns — keep only known column keys, preserve the
    # caller's order, dedupe. An empty/invalid result falls back to the default
    # set (the panel also defaults defensively).
    if CONF_OBJECTS_TABLE_COLUMNS in filtered:
        raw_cols = filtered[CONF_OBJECTS_TABLE_COLUMNS]
        cols: list[str] = []
        seen_cols: set[str] = set()
        for v in raw_cols:
            if not isinstance(v, str) or v not in KNOWN_OBJECT_TABLE_COLUMNS:
                continue
            if v in seen_cols:
                continue
            seen_cols.add(v)
            cols.append(v)
        filtered[CONF_OBJECTS_TABLE_COLUMNS] = cols or list(DEFAULT_OBJECTS_TABLE_COLUMNS)

    # #169 follow-up: member avatars — initials capped, colours from the
    # palette only, empty entries dropped (an empty map clears every override).
    if CONF_MEMBER_DISPLAY in filtered:
        filtered[CONF_MEMBER_DISPLAY] = sanitize_member_display(filtered[CONF_MEMBER_DISPLAY])

    # D#162 follow-up: battery lifetime overrides — canonical type keys, months
    # within range, junk dropped (an empty map clears every override).
    if CONF_BATTERY_LIFETIME_MONTHS in filtered:
        filtered[CONF_BATTERY_LIFETIME_MONTHS] = sanitize_lifetime_overrides(filtered[CONF_BATTERY_LIFETIME_MONTHS])

    # v2.21: disabled_template_ids — keep only ids of templates that actually
    # exist (a typo/stale id must not linger invisibly), dedupe.
    if CONF_DISABLED_TEMPLATE_IDS in filtered:
        from ..templates import KNOWN_TEMPLATE_IDS

        raw_tids = filtered[CONF_DISABLED_TEMPLATE_IDS]
        tids: list[str] = []
        for v in raw_tids:
            if isinstance(v, str) and v in KNOWN_TEMPLATE_IDS and v not in tids:
                tids.append(v)
        filtered[CONF_DISABLED_TEMPLATE_IDS] = tids

    # Validate shopping_list_entity if provided: "" clears; otherwise it must
    # be a todo.* entity id. Format-only — NO existence check (the list's
    # integration may load later; the sync self-heals on first appearance).
    if CONF_SHOPPING_LIST_ENTITY in filtered:
        raw_ent = (filtered[CONF_SHOPPING_LIST_ENTITY] or "").strip()
        if raw_ent and not valid_entity_id(raw_ent):
            return filtered, "invalid_shopping_list_entity"
        if raw_ent and not raw_ent.startswith("todo."):
            return filtered, "invalid_shopping_list_entity"
        filtered[CONF_SHOPPING_LIST_ENTITY] = raw_ent

    # #231: the to-do mirror's default lists — the per-task field's shape
    # rule (todo.* ids, deduped, capped); [] turns the default off. Our own
    # to-do platform is refused by the WS handler (it needs hass).
    if CONF_MIRROR_TODO_DEFAULT_ENTITIES in filtered:
        filtered[CONF_MIRROR_TODO_DEFAULT_ENTITIES] = sanitize_mirror_todo_entities(
            filtered[CONF_MIRROR_TODO_DEFAULT_ENTITIES]
        )

    # D#182: the shopping-search template — "" clears (automatic by country /
    # language); anything else must be an http(s) URL WITH the {q} placeholder,
    # or the search would open the same page for every part.
    if CONF_PART_SEARCH_URL_TEMPLATE in filtered:
        raw_tpl = (filtered[CONF_PART_SEARCH_URL_TEMPLATE] or "").strip()
        if raw_tpl and not valid_search_template(raw_tpl):
            return filtered, "invalid_search_template"
        filtered[CONF_PART_SEARCH_URL_TEMPLATE] = raw_tpl

    # Validate notify_service if provided
    if CONF_NOTIFY_SERVICE in filtered:
        normalized, error = validate_notify_service(filtered[CONF_NOTIFY_SERVICE])
        if error:
            return filtered, error
        filtered[CONF_NOTIFY_SERVICE] = normalized

    return filtered, None
