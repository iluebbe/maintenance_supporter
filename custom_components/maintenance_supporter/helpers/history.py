"""Tiny history-entry helpers shared by everything that reads a task's log.

``completed_entries`` is the one spelling of "the completions in this
history" — seven call sites (coordinator, interval analyzer, reading slots,
sensor predictor, reference numbers, options flow, model) used to hand-type
``h.get("type") == "completed"`` (DRY review 2026-09-12).
"""

from __future__ import annotations

import hashlib
import math
import re
from collections.abc import Iterable
from typing import Any

from ..const import LIFECYCLE_HISTORY_TYPES, HistoryEntryType
from .dates import local_date_from_iso, parse_iso_date, stamp_instant

# The note ``MaintenanceTask.reset`` has always written ("Reset to 2026-10-01")
# — the only record of the day on resets from before ``reset_date``.
_LEGACY_RESET_NOTE = re.compile(r"^Reset to (\d{4}-\d{2}-\d{2})$")


def signed_amount(value: Any) -> float | None:
    """A history number as a finite float of either sign, or ``None``.
    Imports accept text and ``NaN``/``Infinity``; one bad entry summed raw
    took down the whole object's refresh (``"duration": "30"``, bug audit
    2026-09-26) or poisoned a total. A cost reads through here: a credit
    (#200 — the old unit sold, a refund) is negative and nets every total."""
    if isinstance(value, bool) or not isinstance(value, (int, float, str)):
        return None
    try:
        number = float(value)
    except ValueError:
        return None
    return number if math.isfinite(number) else None


def strict_amount(value: Any) -> float | None:
    """A stored money value as a float — a real, finite number and nothing
    else, or ``None``. The budget's rule, strict on purpose:

    * Every write path stores a plain number already (the WS schemas coerce
      and bound it, the importer drops anything else), so a string can only
      come from a hand-edited ``.storage`` file or a broken backup.
    * A lenient ``float()`` takes ``"Infinity"`` and ``"nan"`` too — the very
      poison the importer keeps out: a ``+inf`` fake "budget exceeded" alert,
      or ``nan`` silently disabling every alert, on the path that messages
      the user. A ``bool`` is an ``int``: a stray ``True`` counted as 1.

    The parts cost, the budget and the importer's money checks each spelled
    it out (``budget.is_countable_cost`` was left without a caller; DRY audit
    2026-10-12). :func:`signed_amount` is the lenient twin a task's own
    totals read through."""
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value):
        return None
    return float(value)


def finite_amount(value: Any) -> float | None:
    """A history number that cannot be negative (a duration) as a finite,
    non-negative float, or ``None`` (see ``signed_amount``)."""
    number = signed_amount(value)
    return number if number is not None and number >= 0 else None


def _reset_day(entry: dict[str, Any]) -> str | None:
    """The day a reset entry restarted the cycle on (``YYYY-MM-DD``), or
    ``None`` when the entry does not say."""
    day = entry.get("reset_date")
    if day is None and isinstance(notes := entry.get("notes"), str):
        match = _LEGACY_RESET_NOTE.match(notes)
        day = match.group(1) if match else None
    return day if isinstance(day, str) and parse_iso_date(day) is not None else None


def anchor_stamp(entry: Any) -> str | None:
    """The stamp a lifecycle entry (completed / reset / skipped / missed)
    anchors the cycle on; ``None`` for any other entry or one without a
    string stamp.

    That is the entry's timestamp, except for a reset to an EARLIER day: the
    entry is stamped when it was recorded, the cycle restarts on its
    ``reset_date``. Read as the timestamp, a reset to 1 October entered on
    the 16th moved the anchor to the 16th on every later history edit, and a
    completion logged for the 10th counted as an old backfill (bug audit
    2026-10-16, W1). The bare date sorts before any time on that day."""
    if not isinstance(entry, dict) or entry.get("type") not in LIFECYCLE_HISTORY_TYPES:
        return None
    stamp = entry.get("timestamp")
    if entry.get("type") == HistoryEntryType.RESET:
        day = _reset_day(entry)
        if day is not None and (not isinstance(stamp, str) or day != local_date_from_iso(stamp)):
            return day
    return stamp if isinstance(stamp, str) else None


def cycle_token(history: Iterable[Any] | None) -> str:
    """A short token that changes whenever the task's cycle moves on — every
    completion, skip, reset or missed occurrence writes a newer lifecycle
    entry; a backfill (older) leaves it. A reminder's buttons carry it, so a
    tap on a reminder whose cycle was closed elsewhere does not act on the
    next one (bug audit 2026-10-16, N1)."""
    stamps = [
        stamp
        for entry in history or ()
        if isinstance(entry, dict) and entry.get("type") in LIFECYCLE_HISTORY_TYPES and isinstance(stamp := entry.get("timestamp"), str)
    ]
    return hashlib.sha256(max(stamps, key=stamp_instant, default="").encode()).hexdigest()[:8]


def latest_anchor_stamp(history: Iterable[Any] | None) -> str:
    """The latest :func:`anchor_stamp` in ``history`` by the instant it
    names (:func:`stamp_instant`); ``""`` without one."""
    return max((stamp for entry in history or () if (stamp := anchor_stamp(entry)) is not None), key=stamp_instant, default="")


def completed_entries(history: Iterable[Any] | None) -> list[dict[str, Any]]:
    """The completion entries of ``history``, in stored order; non-dict
    entries (hand-edited / imported logs) are skipped."""
    out: list[dict[str, Any]] = []
    for entry in history or ():
        if isinstance(entry, dict) and entry.get("type") == HistoryEntryType.COMPLETED:
            out.append(entry)
    return out
