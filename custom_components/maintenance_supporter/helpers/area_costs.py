"""What maintenance cost per Home Assistant area (#191).

The area page (panel) shows an area's costs over any period; these totals
back the per-area cost SENSORS, so a room dashboard can show them and the
recorder can keep long-term statistics (a statistics graph of the cost per
year). An object belongs to the area its ``area_id`` names — the rule the
area page uses. Archived objects count: a retired washing machine's repairs
were still money spent in that room, and dropping them when the unit is
retired would read as a negative cost in the statistics.
"""

from __future__ import annotations

from dataclasses import dataclass

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from ..const import CONF_OBJECT
from .aggregate import get_store
from .budget import completed_spend


@dataclass
class AreaCost:
    """Booked maintenance spending — of one object, or summed per area."""

    total: float = 0.0  # all time
    year: float = 0.0  # this local calendar year


def object_area_id(entry: ConfigEntry) -> str | None:
    """The area an object belongs to (its ``area_id``), or None."""
    area_id = (entry.data.get(CONF_OBJECT) or {}).get("area_id")
    return str(area_id) if area_id else None


def entry_cost(hass: HomeAssistant, entry: ConfigEntry) -> AreaCost | None:
    """One object's spending — or None while its history cannot be read
    (the entry is not loaded: Home Assistant is starting, or it reloads).

    None is not zero: a sum that briefly dropped to zero would be recorded
    as a negative cost and a positive one right after it.
    """
    if get_store(hass, entry.entry_id) is None:
        return None
    this_year = dt_util.now().year
    cost = AreaCost()
    for _entry, when, spend in completed_spend(hass, [entry]):
        cost.total += spend
        if when.year == this_year:
            cost.year += spend
    return cost
