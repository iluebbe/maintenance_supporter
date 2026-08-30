"""Cross-entry lookups for the global config entry's options.

The integration uses one global config entry (`unique_id == GLOBAL_UNIQUE_ID`)
that holds settings shared across every per-object entry — most notably the
`default_warning_days` value the user picks in the panel's General Settings.

Per-object task-create flows (panel, options-flow, WS) need to honour that
default instead of falling back to the hard-coded `DEFAULT_WARNING_DAYS`
constant. These helpers centralise the cross-entry lookup.
"""

from __future__ import annotations

from collections.abc import Mapping
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from ..const import (
    CONF_ADVANCED_SCHEDULE_TIME,
    CONF_BATTERY_LOW_PERCENT,
    CONF_DEFAULT_CONSUMABLE_THRESHOLD,
    CONF_DEFAULT_WARNING_DAYS,
    CONF_PANEL_TITLE,
    DEFAULT_BATTERY_LOW_PERCENT,
    DEFAULT_CONSUMABLE_THRESHOLD,
    DEFAULT_WARNING_DAYS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MAX_PANEL_TITLE_LENGTH,
    PANEL_TITLE,
    THRESHOLD_PERCENT_RANGE,
)


def get_global_entry(hass: HomeAssistant) -> ConfigEntry | None:
    """Return the single global config entry (`unique_id == GLOBAL_UNIQUE_ID`).

    The one place that resolves it — the ~inline `for entry in async_entries(...)
    if unique_id == GLOBAL_UNIQUE_ID` loop was copy-pasted across many modules.
    """
    for entry in hass.config_entries.async_entries(DOMAIN):
        if entry.unique_id == GLOBAL_UNIQUE_ID:
            return entry
    return None


def get_global_options(hass: HomeAssistant) -> Mapping[str, Any]:
    """Return the options dict from the global config entry, or empty mapping."""
    entry = get_global_entry(hass)
    return (entry.options or entry.data) if entry is not None else {}


def is_schedule_time_enabled(hass: HomeAssistant) -> bool:
    """The global advanced flag for time-of-day scheduling.

    Reads the global entry's options on every call (cheap), so a toggle in
    Settings takes effect on the next refresh without a restart. Was copied
    inline by the coordinator, calendar, and sensor before living here.
    """
    return bool(get_global_options(hass).get(CONF_ADVANCED_SCHEDULE_TIME, False))


def get_default_warning_days(hass: HomeAssistant) -> int:
    """Resolve the integration-wide default warning_days for new tasks.

    Reads the `default_warning_days` option from the global config entry; falls
    back to the constant `DEFAULT_WARNING_DAYS` when the global entry does not
    exist yet (during initial setup) or when no user value has been stored.
    """
    raw = get_global_options(hass).get(CONF_DEFAULT_WARNING_DAYS, DEFAULT_WARNING_DAYS)
    try:
        value = int(raw)
    except (TypeError, ValueError):
        return DEFAULT_WARNING_DAYS
    if value < 0 or value > 365:
        return DEFAULT_WARNING_DAYS
    return value


def get_panel_title(hass: HomeAssistant) -> str:
    """Resolve the sidebar panel title for the custom panel.

    Reads the user-set `panel_title` option from the global config entry so a
    user can rename the sidebar entry (e.g. to avoid clashing with HA's built-in
    "Maintenance" dashboard, 2026.5+). Falls back to the default `PANEL_TITLE`
    when unset, blank, or not a string. Trimmed and length-capped.
    """
    raw = get_global_options(hass).get(CONF_PANEL_TITLE)
    if not isinstance(raw, str):
        return PANEL_TITLE
    title = raw.strip()
    if not title:
        return PANEL_TITLE
    return title[:MAX_PANEL_TITLE_LENGTH]


def _percent_option(hass: HomeAssistant, key: str, default: int) -> int:
    """A percent option within THRESHOLD_PERCENT_RANGE, else its default."""
    raw = get_global_options(hass).get(key, default)
    try:
        value = int(raw)
    except (TypeError, ValueError):
        return default
    lo, hi = THRESHOLD_PERCENT_RANGE
    return value if lo <= value <= hi else default


def get_consumable_threshold(hass: HomeAssistant) -> int:
    """#146: the household's floor for percent-remaining consumables — what
    Suggested setups pre-wires for catalog signatures that use the default
    (a signature with its own explicit floor keeps it)."""
    return _percent_option(hass, CONF_DEFAULT_CONSUMABLE_THRESHOLD, DEFAULT_CONSUMABLE_THRESHOLD)


def get_battery_low_percent(hass: HomeAssistant) -> int:
    """#146: the fleet-wide "battery low" floor for batteries without their
    own Battery Notes threshold (a higher Battery Notes threshold still wins)."""
    return _percent_option(hass, CONF_BATTERY_LOW_PERCENT, DEFAULT_BATTERY_LOW_PERCENT)
