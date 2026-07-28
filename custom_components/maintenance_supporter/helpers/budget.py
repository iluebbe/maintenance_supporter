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
from datetime import datetime
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from ..const import CONF_TASKS, HistoryEntryType
from .aggregate import get_object_entries, get_runtime_data


def is_countable_cost(value: Any) -> bool:
    """True when a history entry's ``cost`` may be summed into the budget.

    Strict on purpose — a real, finite number and nothing else:

    * Every write path already guarantees that. ``task/complete`` and
      ``history/patch`` both run ``vol.Coerce(float)`` + ``Range(0, MAX_COST)``
      before the entry is stored, and the JSON/YAML importer
      (``websocket/io.py::_sanitize_history``) *drops* any cost that isn't a
      plain finite non-negative number. A string cost is therefore not
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

    for entry in get_object_entries(hass):
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
                cost = h_entry.get("cost")
                if not is_countable_cost(cost):
                    continue
                try:
                    entry_dt = datetime.fromisoformat(h_entry.get("timestamp", ""))
                except (ValueError, TypeError):
                    continue
                if entry_dt.tzinfo is None:
                    entry_dt = entry_dt.replace(tzinfo=dt_util.DEFAULT_TIME_ZONE)
                entry_dt = dt_util.as_local(entry_dt)
                if entry_dt.year == now.year:
                    yearly += float(cost)
                    if entry_dt.month == now.month:
                        monthly += float(cost)

    return monthly, yearly
