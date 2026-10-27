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
    CONF_GROUPS,
    CONF_PANEL_TITLE,
    DEFAULT_BATTERY_LOW_PERCENT,
    DEFAULT_CONSUMABLE_THRESHOLD,
    DEFAULT_WARNING_DAYS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MAX_PANEL_TITLE_LENGTH,
    PANEL_TITLES,
    THRESHOLD_PERCENT_RANGE,
)
from .settings_registry import setting_default


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


def entry_option(entry: ConfigEntry, key: str) -> Any:
    """One setting of the GLOBAL entry at hand, falling back to the registry
    default when unset — for the code that already holds that entry (its
    setup, its update listener, the daily reminder ticks). Same read rule as
    :func:`get_global_options` (``options``, else the creation ``data``).
    The defaults used to be hand-typed next to each key (DRY audit
    2026-09-26 B)."""
    return (entry.options or entry.data).get(key, setting_default(key))


def global_option(hass: HomeAssistant, key: str) -> Any:
    """One global setting, falling back to the registry default when unset —
    the runtime readers' accessor (coordinator, notification manager), so the
    fallback is never hand-typed next to the key."""
    entry = get_global_entry(hass)
    return entry_option(entry, key) if entry is not None else setting_default(key)


def is_schedule_time_enabled(hass: HomeAssistant) -> bool:
    """The global advanced flag for time-of-day scheduling.

    Reads the global entry's options on every call (cheap), so a toggle in
    Settings takes effect on the next refresh without a restart. Was copied
    inline by the coordinator, calendar, and sensor before living here.
    """
    return bool(global_option(hass, CONF_ADVANCED_SCHEDULE_TIME))


def get_default_warning_days(hass: HomeAssistant) -> int:
    """Resolve the integration-wide default warning_days for new tasks.

    Reads the `default_warning_days` option from the global config entry; falls
    back to the constant `DEFAULT_WARNING_DAYS` when the global entry does not
    exist yet (during initial setup) or when no user value has been stored.
    """
    raw = global_option(hass, CONF_DEFAULT_WARNING_DAYS)
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
    "Maintenance" dashboard, 2026.5+). Falls back to the default title in the
    server's language when unset, blank, or not a string. Trimmed and
    length-capped.
    """
    raw = get_global_options(hass).get(CONF_PANEL_TITLE)
    title = raw.strip() if isinstance(raw, str) else ""
    if not title:
        return default_panel_title(hass)
    return title[:MAX_PANEL_TITLE_LENGTH]


def default_panel_title(hass: HomeAssistant) -> str:
    """The sidebar title an unset ``panel_title`` means, in the server's language."""
    from .i18n import normalize_language

    return PANEL_TITLES.get(normalize_language(hass), PANEL_TITLES["en"])


def _percent_option(hass: HomeAssistant, key: str, default: int) -> int:
    """A percent option within THRESHOLD_PERCENT_RANGE, else its default."""
    raw = global_option(hass, key)
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


def merge_global_options(hass: HomeAssistant, entry: ConfigEntry, changes: dict[str, Any]) -> None:
    """Merge ``changes`` into the global entry's settings and save them.

    The one read-modify-write for code that already holds the global entry
    (DRY audit 2026-09-26 B — saved views, group cleanup, the vacation
    exempt list on task delete/move, the settings import). The base is
    ``options``, else the creation ``data`` — the read rule of
    helpers.global_options.get_global_options; a copy that started from
    ``entry.options`` alone would, on a never-saved entry, write an options
    dict holding ONLY the change and hide every setting kept in ``data``.
    """
    hass.config_entries.async_update_entry(entry, options={**(entry.options or entry.data), **changes})


def cleanup_group_refs(
    hass: HomeAssistant,
    *,
    entry_id: str | None = None,
    task_id: str | None = None,
) -> None:
    """Remove deleted task/object references from all groups.

    Pass entry_id to remove all refs for that object.
    Pass task_id to remove refs for a specific task.
    """
    global_entry = get_global_entry(hass)
    if global_entry is None:
        return

    groups = (global_entry.options or global_entry.data).get(CONF_GROUPS)
    if not groups:
        return

    groups = dict(groups)
    changed = False
    for gid, group in groups.items():
        old_refs = group.get("task_refs", [])
        new_refs = [
            ref
            for ref in old_refs
            if not (
                (entry_id is not None and ref.get("entry_id") == entry_id)
                or (task_id is not None and ref.get("task_id") == task_id)
            )
        ]
        if len(new_refs) != len(old_refs):
            groups[gid] = {**group, "task_refs": new_refs}
            changed = True

    if changed:
        merge_global_options(hass, global_entry, {CONF_GROUPS: groups})
