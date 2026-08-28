"""Single source of truth for global-setting validation.

Each writable global setting is declared ONCE here as a ``SettingSpec`` (key +
type + optional numeric range / string cap). The WS write handler
(``websocket/dashboard.py``) derives its allow-list and range/cap tables from
this registry, and the options flow (``config_flow_options_global.py``) pulls
its NumberSelector min/max from the same specs — so the ranges can't drift
between the two surfaces (they previously lived as three hand-kept copies).

Bespoke normalisation that isn't a plain range/cap (panel-title trim,
title-style enum, quiet-hours regex, list sanitisers, notify-service
validation) stays in the WS handler; the registry only covers the mechanical
type + range + length checks.
"""

from __future__ import annotations

from dataclasses import dataclass

import voluptuous as vol

from ..const import (
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
    CONF_BUDGET_ALERT_THRESHOLD,
    CONF_BUDGET_ALERTS_ENABLED,
    CONF_BUDGET_CURRENCY,
    CONF_BUDGET_MONTHLY,
    CONF_BUDGET_YEARLY,
    CONF_DEFAULT_WARNING_DAYS,
    CONF_DELETE_ARCHIVED_ONEOFF_DAYS,
    CONF_DISABLED_TEMPLATE_IDS,
    CONF_INSTALL_ASSIST_SENTENCES,
    CONF_MAX_NOTIFICATIONS_PER_DAY,
    CONF_NOTIFICATION_BUNDLE_THRESHOLD,
    CONF_NOTIFICATION_BUNDLING_ENABLED,
    CONF_NOTIFICATION_TITLE_STYLE,
    CONF_NOTIFICATIONS_ENABLED,
    CONF_NOTIFY_DUE_SOON_ENABLED,
    CONF_NOTIFY_DUE_SOON_INTERVAL,
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
    CONF_QUIET_HOURS_ENABLED,
    CONF_QUIET_HOURS_END,
    CONF_QUIET_HOURS_START,
    CONF_REMINDER_LEAD_DAYS,
    CONF_SHOPPING_LIST_ENTITY,
    CONF_SNOOZE_DURATION_HOURS,
    CONF_WARRANTY_REMINDER_DAYS,
    CONF_WARRANTY_REMINDER_ENABLED,
    CONF_WEEKLY_DIGEST_ENABLED,
)


@dataclass(frozen=True)
class SettingSpec:
    """Validation spec for one writable global setting."""

    key: str
    py_type: type  # int | float | bool | str | list — used for isinstance()
    int_range: tuple[int, int] | None = None
    float_range: tuple[float, float] | None = None
    max_len: int | None = None  # string length cap


# The complete set of keys accepted by global/update. Order groups related
# settings; it has no functional meaning.
SETTING_SPECS: tuple[SettingSpec, ...] = (
    # General
    SettingSpec(CONF_DEFAULT_WARNING_DAYS, int, int_range=(1, 365)),
    SettingSpec(CONF_NOTIFICATIONS_ENABLED, bool),
    SettingSpec(CONF_NOTIFY_SERVICE, str, max_len=200),
    # todo.* entity the buy-task shopping sync mirrors into ("" = off);
    # format-validated by a bespoke sanitiser rule (todo. prefix), max_len is
    # HA's entity-id cap.
    SettingSpec(CONF_SHOPPING_LIST_ENTITY, str, max_len=255),
    SettingSpec(CONF_PANEL_ENABLED, bool),
    # panel_title is trimmed+capped to MAX_PANEL_TITLE_LENGTH by a bespoke rule,
    # not a plain drop-if-too-long — so no max_len here.
    SettingSpec(CONF_PANEL_TITLE, str),
    # Advanced-feature toggles
    SettingSpec(CONF_ADVANCED_ADAPTIVE, bool),
    SettingSpec(CONF_ADVANCED_PREDICTIONS, bool),
    SettingSpec(CONF_ADVANCED_SEASONAL, bool),
    SettingSpec(CONF_ADVANCED_ENVIRONMENTAL, bool),
    SettingSpec(CONF_ADVANCED_BUDGET, bool),
    SettingSpec(CONF_ADVANCED_GROUPS, bool),
    SettingSpec(CONF_ADVANCED_CHECKLISTS, bool),
    SettingSpec(CONF_ADVANCED_SCHEDULE_TIME, bool),
    SettingSpec(CONF_ADVANCED_COMPLETION_ACTIONS, bool),
    # Governance (list elements sanitised by a bespoke rule in the handler)
    SettingSpec(CONF_ADMIN_PANEL_USER_IDS, list),
    SettingSpec(CONF_OPERATOR_WRITE_ENABLED, bool),
    SettingSpec(CONF_OBJECTS_TABLE_COLUMNS, list),
    # v2.21: hidden template ids (bespoke known-id sanitiser in the handler)
    SettingSpec(CONF_DISABLED_TEMPLATE_IDS, list),
    # Archive automation
    SettingSpec(CONF_ARCHIVE_ONEOFF_DAYS, int, int_range=(0, 3650)),
    SettingSpec(CONF_DELETE_ARCHIVED_ONEOFF_DAYS, int, int_range=(0, 3650)),
    # Notification per-status
    SettingSpec(CONF_NOTIFY_DUE_SOON_ENABLED, bool),
    SettingSpec(CONF_NOTIFY_DUE_SOON_INTERVAL, int, int_range=(0, 720)),
    SettingSpec(CONF_NOTIFY_OVERDUE_ENABLED, bool),
    SettingSpec(CONF_NOTIFY_OVERDUE_INTERVAL, int, int_range=(0, 720)),
    SettingSpec(CONF_NOTIFY_TRIGGERED_ENABLED, bool),
    SettingSpec(CONF_NOTIFY_TRIGGERED_INTERVAL, int, int_range=(0, 720)),
    # Quiet hours (HH:MM[:SS] validated by a bespoke regex in the handler)
    SettingSpec(CONF_QUIET_HOURS_ENABLED, bool),
    SettingSpec(CONF_QUIET_HOURS_START, str, max_len=5),
    SettingSpec(CONF_QUIET_HOURS_END, str, max_len=5),
    # Limits + bundling
    SettingSpec(CONF_MAX_NOTIFICATIONS_PER_DAY, int, int_range=(0, 1000)),
    SettingSpec(CONF_NOTIFICATION_BUNDLING_ENABLED, bool),
    SettingSpec(CONF_NOTIFICATION_BUNDLE_THRESHOLD, int, int_range=(2, 20)),
    # title_style is enum-validated by a bespoke rule in the handler.
    SettingSpec(CONF_NOTIFICATION_TITLE_STYLE, str),
    SettingSpec(CONF_NOTIFY_SCOPE_VIEW_ID, str, max_len=64),
    # Actions
    SettingSpec(CONF_ACTION_COMPLETE_ENABLED, bool),
    SettingSpec(CONF_ACTION_SKIP_ENABLED, bool),
    SettingSpec(CONF_ACTION_SNOOZE_ENABLED, bool),
    SettingSpec(CONF_SNOOZE_DURATION_HOURS, int, int_range=(1, 168)),
    SettingSpec(CONF_WEEKLY_DIGEST_ENABLED, bool),
    SettingSpec(CONF_INSTALL_ASSIST_SENTENCES, bool),
    SettingSpec(CONF_WARRANTY_REMINDER_ENABLED, bool),
    SettingSpec(CONF_WARRANTY_REMINDER_DAYS, int, int_range=(1, 365)),
    # List of days-before-due (bespoke int-list sanitiser in the WS handler).
    SettingSpec(CONF_REMINDER_LEAD_DAYS, list),
    # Budget
    SettingSpec(CONF_BUDGET_MONTHLY, float, float_range=(0.0, 10_000_000.0)),
    SettingSpec(CONF_BUDGET_YEARLY, float, float_range=(0.0, 100_000_000.0)),
    SettingSpec(CONF_BUDGET_ALERTS_ENABLED, bool),
    SettingSpec(CONF_BUDGET_ALERT_THRESHOLD, int, int_range=(10, 100)),
    SettingSpec(CONF_BUDGET_CURRENCY, str, max_len=5),
)

_SPEC_BY_KEY: dict[str, SettingSpec] = {s.key: s for s in SETTING_SPECS}


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
