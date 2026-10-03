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

import math
from collections.abc import Iterator
from datetime import datetime
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from ..const import CONF_TASKS, HistoryEntryType
from .aggregate import get_object_entries, get_runtime_data
from .parts_cost import entry_spend


def is_countable_cost(value: Any) -> bool:
    """True when a history entry's ``cost`` may be summed into the budget.

    Strict on purpose — a real, finite number and nothing else:

    * Every write path already guarantees that. ``task/complete`` and
      ``history/patch`` both run ``vol.Coerce(float)`` +
      ``Range(MIN_COST, MAX_COST)`` before the entry is stored (a credit,
      #200, is a negative cost and lowers the spend), and the JSON/YAML
      importer (``websocket/io.py::_sanitize_history``) *drops* any cost that
      isn't a plain finite number within those bounds. A string cost is therefore not
      producible through any supported path; it can only come from a
      hand-edited ``.storage`` file or a corrupted backup.
    * The lenient ``float(cost)`` alternative re-opens the exact hole that
      importer closes: ``float("Infinity")`` and ``float("nan")`` both succeed,
      and ``_sanitize_history`` exists specifically because a non-finite cost
      poisons budget aggregation ("a ``+inf`` fake 'budget exceeded' alert, or
      ``nan`` silently disabling all alerts"). Accepting *strings* let those
      values back in through the side door — on the alert path, the one that
      actually messages the user.

    ``bool`` is excluded explicitly: it is an ``int`` subclass, so a stray
    ``True`` would otherwise silently count as 1 unit of currency.
    """
    return isinstance(value, (int, float)) and not isinstance(value, bool) and math.isfinite(value)


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
        rd = get_runtime_data(hass, entry.entry_id)
        store = getattr(rd, "store", None) if rd else None
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
