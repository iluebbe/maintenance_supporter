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

from homeassistant.core import HomeAssistant

from ..const import (
    CONF_DEFAULT_WARNING_DAYS,
    CONF_PANEL_TITLE,
    DEFAULT_WARNING_DAYS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MAX_PANEL_TITLE_LENGTH,
    PANEL_TITLE,
)


def get_global_options(hass: HomeAssistant) -> Mapping[str, Any]:
    """Return the options dict from the global config entry, or empty mapping."""
    for entry in hass.config_entries.async_entries(DOMAIN):
        if entry.unique_id == GLOBAL_UNIQUE_ID:
            return entry.options or entry.data
    return {}


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
