"""Single source of truth for global-setting validation AND defaults.

Each writable global setting is declared ONCE here as a ``SettingSpec`` (key +
type + default + optional numeric range / string cap). The WS write handler
(``websocket/dashboard.py``) derives its allow-list and range/cap tables from
this registry, and the options flow (``config_flow_options_global.py``) pulls
its NumberSelector min/max from the same specs — so the ranges can't drift
between the two surfaces (they previously lived as three hand-kept copies).

The ``default`` is what an unset option means everywhere: the WS ``settings``
echo, the options-flow form defaults and the runtime readers (notification
manager, coordinator) all go through :func:`setting_default`, so "24 h" for
the due-soon repeat or "off" for completion notifications is written once
(DRY review 2026-09-12 — the values used to live as four hand-kept copies).
``tests/test_settings_defaults.py`` pins the three surfaces to this table.

Bespoke normalisation that isn't a plain range/cap (panel-title trim,
title-style enum, quiet-hours regex, list sanitisers, notify-service
validation) stays in the WS handler; the registry only covers the mechanical
type + range + length checks.
"""

from __future__ import annotations

from copy import deepcopy
from dataclasses import dataclass
from typing import Any

import voluptuous as vol

from ..const import (
    BATTERY_RECOVERED_PERCENT_RANGE,
    CONF_ACTION_COMPLETE_ENABLED,
    CONF_ACTION_SKIP_ENABLED,
    CONF_ACTION_SNOOZE_ENABLED,
    CONF_ADMIN_PANEL_USER_IDS,
    CONF_ADVANCED_ADAPTIVE,
    CONF_ADVANCED_BUDGET,
    CONF_ADVANCED_CHECKLISTS,
    CONF_ADVANCED_COMPLETION_ACTIONS,
    CONF_ADVANCED_ENVIRONMENTAL,
    CONF_ADVANCED_GROUPS,
    CONF_ADVANCED_PREDICTIONS,
    CONF_ADVANCED_SCHEDULE_TIME,
    CONF_ADVANCED_SEASONAL,
    CONF_ARCHIVE_ONEOFF_DAYS,
    CONF_BATTERY_AUTO_RECORD_RECOVERY,
    CONF_BATTERY_LIFETIME_MONTHS,
    CONF_BATTERY_LOW_PERCENT,
    CONF_BATTERY_RECOVERED_PERCENT,
    CONF_BUDGET_ALERT_THRESHOLD,
    CONF_BUDGET_ALERTS_ENABLED,
    CONF_BUDGET_CURRENCY,
    CONF_BUDGET_MONTHLY,
    CONF_BUDGET_YEARLY,
    CONF_CURRENCY_DECIMALS,
    CONF_DEFAULT_CONSUMABLE_THRESHOLD,
    CONF_DEFAULT_WARNING_DAYS,
    CONF_DELETE_ARCHIVED_ONEOFF_DAYS,
    CONF_DISABLED_TEMPLATE_IDS,
    CONF_HOME_TYPE,
    CONF_INSTALL_ASSIST_SENTENCES,
    CONF_MAX_NOTIFICATIONS_PER_DAY,
    CONF_MEMBER_DISPLAY,
    CONF_NOTIFICATION_BUNDLE_THRESHOLD,
    CONF_NOTIFICATION_BUNDLING_ENABLED,
    CONF_NOTIFICATION_TITLE_STYLE,
    CONF_NOTIFICATIONS_ENABLED,
    CONF_NOTIFY_COMPLETED,
    CONF_NOTIFY_DUE_SOON_ENABLED,
    CONF_NOTIFY_DUE_SOON_INTERVAL,
    CONF_NOTIFY_EVENT_ONLY,
    CONF_NOTIFY_EXTRA_DATA,
    CONF_NOTIFY_OVERDUE_ENABLED,
    CONF_NOTIFY_OVERDUE_INTERVAL,
    CONF_NOTIFY_SCOPE_VIEW_ID,
    CONF_NOTIFY_SERVICE,
    CONF_NOTIFY_TRIGGERED_ENABLED,
    CONF_NOTIFY_TRIGGERED_INTERVAL,
    CONF_OBJECTS_TABLE_COLUMNS,
    CONF_OPERATOR_WRITE_ENABLED,
    CONF_PANEL_ENABLED,
    CONF_PANEL_TITLE,
    CONF_PART_SEARCH_URL_TEMPLATE,
    CONF_QUIET_HOURS_ENABLED,
    CONF_QUIET_HOURS_END,
    CONF_QUIET_HOURS_START,
    CONF_REF_NUMBERS_IN_LISTS,
    CONF_REMINDER_LEAD_DAYS,
    CONF_ROW_ACTION_NOTICE,
    CONF_ROW_ACTION_STYLE,
    CONF_SHOPPING_LIST_ENTITY,
    CONF_SNOOZE_DURATION_HOURS,
    CONF_WARRANTY_REMINDER_DAYS,
    CONF_WARRANTY_REMINDER_ENABLED,
    CONF_WEEKLY_DIGEST_ENABLED,
    DEFAULT_ARCHIVE_ONEOFF_DAYS,
    DEFAULT_BATTERY_LOW_PERCENT,
    DEFAULT_BATTERY_RECOVERED_PERCENT,
    DEFAULT_BUDGET_CURRENCY,
    DEFAULT_CONSUMABLE_THRESHOLD,
    DEFAULT_CURRENCY_DECIMALS,
    DEFAULT_DELETE_ARCHIVED_ONEOFF_DAYS,
    DEFAULT_MAX_NOTIFICATIONS_PER_DAY,
    DEFAULT_OBJECTS_TABLE_COLUMNS,
    DEFAULT_PANEL_ENABLED,
    DEFAULT_ROW_ACTION_STYLE,
    DEFAULT_SNOOZE_DURATION_HOURS,
    DEFAULT_WARNING_DAYS,
    DEFAULT_WARRANTY_REMINDER_DAYS,
    MAX_NOTIFY_EXTRA_DATA_LENGTH,
    MAX_PART_SEARCH_URL_TEMPLATE_LENGTH,
)


@dataclass(frozen=True)
class SettingSpec:
    """Validation spec + default for one writable global setting."""

    key: str
    py_type: type  # int | float | bool | str | list — used for isinstance()
    default: Any = None  # what an unset option means (never None — see the tripwire)
    int_range: tuple[int, int] | None = None
    float_range: tuple[float, float] | None = None
    max_len: int | None = None  # string length cap


# The complete set of keys accepted by global/update. Order groups related
# settings; it has no functional meaning.
SETTING_SPECS: tuple[SettingSpec, ...] = (
    # General
    # 0 = no warning window: new tasks turn due_soon on the due date itself
    # (the per-task range already allowed 0 — #145).
    SettingSpec(CONF_DEFAULT_WARNING_DAYS, int, DEFAULT_WARNING_DAYS, int_range=(0, 365)),
    # #146: household "low" floors (percent) for discovery and the battery fleet.
    SettingSpec(CONF_DEFAULT_CONSUMABLE_THRESHOLD, int, DEFAULT_CONSUMABLE_THRESHOLD, int_range=(1, 90)),
    SettingSpec(CONF_BATTERY_LOW_PERCENT, int, DEFAULT_BATTERY_LOW_PERCENT, int_range=(1, 90)),
    # #180: a low battery stays low until its level rises ABOVE this (hysteresis).
    SettingSpec(CONF_BATTERY_RECOVERED_PERCENT, int, DEFAULT_BATTERY_RECOVERED_PERCENT, int_range=BATTERY_RECOVERED_PERCENT_RANGE),
    # #181 follow-up: a level-driven recovery records the replacement itself
    # (Battery Notes date + stock) — advanced, off by default.
    SettingSpec(CONF_BATTERY_AUTO_RECORD_RECOVERY, bool, False),
    # D#182: shopping-search URL with a {q} placeholder ("" = automatic by
    # country/language); the {q} requirement is a bespoke rule in dashboard.py.
    SettingSpec(CONF_PART_SEARCH_URL_TEMPLATE, str, "", max_len=MAX_PART_SEARCH_URL_TEMPLATE_LENGTH),
    # D#162 follow-up: {battery type: typical lifetime in months} — the forecast
    # anchor for batteries without a level sensor (sanitised in dashboard.py).
    SettingSpec(CONF_BATTERY_LIFETIME_MONTHS, dict, {}),
    SettingSpec(CONF_NOTIFICATIONS_ENABLED, bool, False),
    SettingSpec(CONF_NOTIFY_SERVICE, str, "", max_len=200),
    # todo.* entity the buy-task shopping sync mirrors into ("" = off);
    # format-validated by a bespoke sanitiser rule (todo. prefix), max_len is
    # HA's entity-id cap.
    SettingSpec(CONF_SHOPPING_LIST_ENTITY, str, "", max_len=255),
    # #145: enum-validated by a bespoke rule (ROW_ACTION_STYLES); the notice
    # flag is only ever cleared by the panel banner.
    SettingSpec(CONF_ROW_ACTION_STYLE, str, DEFAULT_ROW_ACTION_STYLE, max_len=32),
    SettingSpec(CONF_REF_NUMBERS_IN_LISTS, bool, False),
    SettingSpec(CONF_ROW_ACTION_NOTICE, bool, False),
    SettingSpec(CONF_PANEL_ENABLED, bool, DEFAULT_PANEL_ENABLED),
    # panel_title is trimmed+capped to MAX_PANEL_TITLE_LENGTH by a bespoke rule,
    # not a plain drop-if-too-long — so no max_len here.
    SettingSpec(CONF_PANEL_TITLE, str, ""),
    # Advanced-feature toggles
    SettingSpec(CONF_ADVANCED_ADAPTIVE, bool, False),
    SettingSpec(CONF_ADVANCED_PREDICTIONS, bool, False),
    SettingSpec(CONF_ADVANCED_SEASONAL, bool, False),
    SettingSpec(CONF_ADVANCED_ENVIRONMENTAL, bool, False),
    SettingSpec(CONF_ADVANCED_BUDGET, bool, False),
    SettingSpec(CONF_ADVANCED_GROUPS, bool, False),
    SettingSpec(CONF_ADVANCED_CHECKLISTS, bool, False),
    SettingSpec(CONF_ADVANCED_SCHEDULE_TIME, bool, False),
    SettingSpec(CONF_ADVANCED_COMPLETION_ACTIONS, bool, False),
    # Governance (list elements sanitised by a bespoke rule in the handler)
    SettingSpec(CONF_ADMIN_PANEL_USER_IDS, list, []),
    SettingSpec(CONF_OPERATOR_WRITE_ENABLED, bool, False),
    SettingSpec(CONF_OBJECTS_TABLE_COLUMNS, list, DEFAULT_OBJECTS_TABLE_COLUMNS),
    # #169 follow-up: member avatars (bespoke palette/initials sanitiser)
    SettingSpec(CONF_MEMBER_DISPLAY, dict, {}),
    # v2.21: hidden template ids (bespoke known-id sanitiser in the handler)
    SettingSpec(CONF_DISABLED_TEMPLATE_IDS, list, []),
    # v2.93: home profile dwelling type (enum-checked in dashboard.py).
    SettingSpec(CONF_HOME_TYPE, str, "auto", max_len=16),
    # Archive automation
    SettingSpec(CONF_ARCHIVE_ONEOFF_DAYS, int, DEFAULT_ARCHIVE_ONEOFF_DAYS, int_range=(0, 3650)),
    SettingSpec(CONF_DELETE_ARCHIVED_ONEOFF_DAYS, int, DEFAULT_DELETE_ARCHIVED_ONEOFF_DAYS, int_range=(0, 3650)),
    # Notification per-status (interval 0 = notify once per status)
    SettingSpec(CONF_NOTIFY_DUE_SOON_ENABLED, bool, True),
    SettingSpec(CONF_NOTIFY_DUE_SOON_INTERVAL, int, 24, int_range=(0, 720)),
    SettingSpec(CONF_NOTIFY_OVERDUE_ENABLED, bool, True),
    SettingSpec(CONF_NOTIFY_OVERDUE_INTERVAL, int, 12, int_range=(0, 720)),
    SettingSpec(CONF_NOTIFY_TRIGGERED_ENABLED, bool, True),
    SettingSpec(CONF_NOTIFY_TRIGGERED_INTERVAL, int, 0, int_range=(0, 720)),
    # Quiet hours (HH:MM[:SS] validated by a bespoke regex in the handler)
    SettingSpec(CONF_QUIET_HOURS_ENABLED, bool, True),
    SettingSpec(CONF_QUIET_HOURS_START, str, "22:00", max_len=5),
    SettingSpec(CONF_QUIET_HOURS_END, str, "08:00", max_len=5),
    # Limits + bundling
    SettingSpec(CONF_MAX_NOTIFICATIONS_PER_DAY, int, DEFAULT_MAX_NOTIFICATIONS_PER_DAY, int_range=(0, 1000)),
    SettingSpec(CONF_NOTIFICATION_BUNDLING_ENABLED, bool, False),
    SettingSpec(CONF_NOTIFICATION_BUNDLE_THRESHOLD, int, 2, int_range=(2, 20)),
    # title_style is enum-validated by a bespoke rule in the handler
    # (v1.4.0 / #44: "default" keeps the per-status titles).
    SettingSpec(CONF_NOTIFICATION_TITLE_STYLE, str, "default"),
    # #173 follow-up: completion notifications off / automatic / all (enum-checked in dashboard.py).
    SettingSpec(CONF_NOTIFY_COMPLETED, str, "off", max_len=16),
    SettingSpec(CONF_NOTIFY_SCOPE_VIEW_ID, str, "", max_len=64),
    # #165: your own notification rule
    SettingSpec(CONF_NOTIFY_EVENT_ONLY, bool, False),
    SettingSpec(CONF_NOTIFY_EXTRA_DATA, str, "", max_len=MAX_NOTIFY_EXTRA_DATA_LENGTH),
    # Actions
    SettingSpec(CONF_ACTION_COMPLETE_ENABLED, bool, False),
    SettingSpec(CONF_ACTION_SKIP_ENABLED, bool, False),
    SettingSpec(CONF_ACTION_SNOOZE_ENABLED, bool, False),
    SettingSpec(CONF_SNOOZE_DURATION_HOURS, int, DEFAULT_SNOOZE_DURATION_HOURS, int_range=(1, 168)),
    SettingSpec(CONF_WEEKLY_DIGEST_ENABLED, bool, False),
    SettingSpec(CONF_INSTALL_ASSIST_SENTENCES, bool, False),
    SettingSpec(CONF_WARRANTY_REMINDER_ENABLED, bool, False),
    SettingSpec(CONF_WARRANTY_REMINDER_DAYS, int, DEFAULT_WARRANTY_REMINDER_DAYS, int_range=(1, 365)),
    # List of days-before-due (bespoke int-list sanitiser in the WS handler).
    SettingSpec(CONF_REMINDER_LEAD_DAYS, list, []),
    # Budget
    SettingSpec(CONF_BUDGET_MONTHLY, float, 0.0, float_range=(0.0, 10_000_000.0)),
    SettingSpec(CONF_BUDGET_YEARLY, float, 0.0, float_range=(0.0, 100_000_000.0)),
    SettingSpec(CONF_BUDGET_ALERTS_ENABLED, bool, False),
    SettingSpec(CONF_BUDGET_ALERT_THRESHOLD, int, 80, int_range=(10, 100)),
    SettingSpec(CONF_BUDGET_CURRENCY, str, DEFAULT_BUDGET_CURRENCY, max_len=5),
    SettingSpec(CONF_CURRENCY_DECIMALS, int, DEFAULT_CURRENCY_DECIMALS, int_range=(0, 3)),
)

_SPEC_BY_KEY: dict[str, SettingSpec] = {s.key: s for s in SETTING_SPECS}


def setting_default(key: str) -> Any:
    """The default for a registered global setting — what an unset option
    means on every surface. Lists/dicts come back as copies so no caller can
    mutate the table. ``KeyError`` for an unregistered key (a typo fails loudly)."""
    default = _SPEC_BY_KEY[key].default
    return deepcopy(default) if isinstance(default, (list, dict)) else default


def settings_defaults() -> dict[str, Any]:
    """``{key: default}`` for every registered setting (fresh copies)."""
    return {s.key: setting_default(s.key) for s in SETTING_SPECS}


# ─── Derived views (single source → the tables the handler used to hand-keep) ─

ALLOWED_SETTING_KEYS: dict[str, type | vol.Any] = {s.key: s.py_type for s in SETTING_SPECS}
INT_RANGES: dict[str, tuple[int, int]] = {s.key: s.int_range for s in SETTING_SPECS if s.int_range is not None}
FLOAT_RANGES: dict[str, tuple[float, float]] = {s.key: s.float_range for s in SETTING_SPECS if s.float_range is not None}
STR_MAX_LENGTHS: dict[str, int] = {s.key: s.max_len for s in SETTING_SPECS if s.max_len is not None}


def int_range(key: str) -> tuple[int, int]:
    """Return the (min, max) for an int setting — for the options-flow selector.

    Raises KeyError if the key isn't a registered int setting, so a typo fails
    loudly at import/first-use rather than silently using a wrong bound.
    """
    spec = _SPEC_BY_KEY[key]
    if spec.int_range is None:
        raise KeyError(f"{key} is not an int-ranged setting")
    return spec.int_range


def float_range(key: str) -> tuple[float, float]:
    """Return the (min, max) for a float setting — for the options-flow selector."""
    spec = _SPEC_BY_KEY[key]
    if spec.float_range is None:
        raise KeyError(f"{key} is not a float-ranged setting")
    return spec.float_range
