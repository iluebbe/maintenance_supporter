"""Tiny history-entry helpers shared by everything that reads a task's log.

``completed_entries`` is the one spelling of "the completions in this
history" — seven call sites (coordinator, interval analyzer, reading slots,
sensor predictor, reference numbers, options flow, model) used to hand-type
``h.get("type") == "completed"`` (DRY review 2026-09-12).
"""

from __future__ import annotations

import math
from collections.abc import Iterable
from typing import Any

from ..const import HistoryEntryType


def finite_amount(value: Any) -> float | None:
    """A history number (cost, duration) as a finite, non-negative float,
    or ``None``. Imports accept text and ``NaN``/``Infinity``; one bad entry
    summed raw took down the whole object's refresh (``"duration": "30"``,
    bug audit 2026-09-26) or poisoned a total."""
    if isinstance(value, bool) or not isinstance(value, (int, float, str)):
        return None
    try:
        number = float(value)
    except ValueError:
        return None
    return number if math.isfinite(number) and number >= 0 else None


def completed_entries(history: Iterable[Any] | None) -> list[dict[str, Any]]:
    """The completion entries of ``history``, in stored order; non-dict
    entries (hand-edited / imported logs) are skipped."""
    out: list[dict[str, Any]] = []
    for entry in history or ():
        if isinstance(entry, dict) and entry.get("type") == HistoryEntryType.COMPLETED:
            out.append(entry)
    return out
