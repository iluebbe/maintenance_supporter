"""Single source of truth for budget spend aggregation.

Two consumers ask the same question — "how much has been spent this month /
this year?": the coordinator's budget cache (which drives the budget ALERT
notification) and the ``maintenance_supporter/budget_status`` WS command (which
draws the panel's budget bars). Each used to carry its own hand-maintained copy
of the same ~35-line scan, and the copies had drifted apart on the one thing
that matters: **which ``cost`` values count**. The coordinator accepted
anything ``float()`` swallowed, the WS layer required a real number — so a cost
stored as the string ``"12.50"`` fed the alert but never appeared in the panel.

One function now owns both the traversal and the acceptance rule, so the two
surfaces can no longer disagree (the ``helpers/aggregate`` pattern, applied to
money).
"""

from __future__ import annotations

from collections.abc import Iterator
from datetime import datetime
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from ..const import CONF_TASKS, HistoryEntryType
from .aggregate import get_object_entries, store_or_cached
from .parts_cost import entry_spend


def completed_spend(
    hass: HomeAssistant, entries: list[ConfigEntry] | None = None
) -> Iterator[tuple[ConfigEntry, datetime, float]]:
    """Every completion that booked money: ``(object entry, local time, spend)``.

    The one walk over every object's completion history (Store-backed, or
    the legacy ``ConfigEntry.data`` copy for entries whose Store hasn't
    loaded) behind the budget and the per-area cost sensors, so the two
    count the same money. Archived objects and tasks are included — money
    already spent keeps counting.

    Naive timestamps — written by older versions, or restored from a backup —
    are read as HA local time, so an entry logged just before midnight on New
    Year's Eve lands in the year the user actually saw. ``entries`` narrows
    the walk to some objects (default: all of them).
    """
    for entry in entries if entries is not None else get_object_entries(hass):
        # The Store the cache keeps while an object reloads (or retries its
        # setup) too: through store_of alone its spending counted 0 and the
        # budget and its alert undercounted until the next recompute (bug
        # audit 2026-10-17, S-15).
        store = store_or_cached(hass, entry)
        tasks: dict[str, Any] = entry.data.get(CONF_TASKS, {})

        for task_id in tasks:
            if store is not None:
                history = store.get_history(task_id)
            else:
                # Legacy: dynamic state still lives in ConfigEntry.data.
                history = tasks.get(task_id, {}).get("history", [])

            for h_entry in history:
                if h_entry.get("type") != HistoryEntryType.COMPLETED:
                    continue
                # #104: the entry's booked spending — its cost, and with "when
                # used" bookkeeping its parts (a purchase then counts nothing).
                spend = entry_spend(h_entry)
                if not spend:
                    continue
                try:
                    entry_dt = datetime.fromisoformat(h_entry.get("timestamp", ""))
                except (ValueError, TypeError):
                    continue
                if entry_dt.tzinfo is None:
                    entry_dt = entry_dt.replace(tzinfo=dt_util.DEFAULT_TIME_ZONE)
                yield entry, dt_util.as_local(entry_dt), spend


def compute_spend(hass: HomeAssistant) -> tuple[float, float]:
    """Return ``(monthly_spent, yearly_spent)`` over every object's history.

    Scans the completion history of every maintenance object (Store-backed, or
    the legacy ``ConfigEntry.data`` copy for entries whose Store hasn't loaded)
    and buckets each countable cost by HA's *local* calendar month and year.

    Naive timestamps — written by older versions, or restored from a backup —
    are read as HA local time before bucketing, so an entry logged just before
    midnight on New Year's Eve lands in the year the user actually saw
    (otherwise the year/month boundary is off-by-one against ``now``).

    Values are returned unrounded; callers round for display.
    """
    now = dt_util.now()
    monthly = 0.0
    yearly = 0.0
    for _entry, when, spend in completed_spend(hass):
        if when.year == now.year:
            yearly += spend
            if when.month == now.month:
                monthly += spend
    return monthly, yearly
