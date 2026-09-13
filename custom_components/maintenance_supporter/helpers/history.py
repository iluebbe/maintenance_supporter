"""Tiny history-entry helpers shared by everything that reads a task's log.

``completed_entries`` is the one spelling of "the completions in this
history" — seven call sites (coordinator, interval analyzer, reading slots,
sensor predictor, reference numbers, options flow, model) used to hand-type
``h.get("type") == "completed"`` (DRY review 2026-09-12).
"""

from __future__ import annotations

from collections.abc import Iterable
from typing import Any

from ..const import HistoryEntryType


def completed_entries(history: Iterable[Any] | None) -> list[dict[str, Any]]:
    """The completion entries of ``history``, in stored order; non-dict
    entries (hand-edited / imported logs) are skipped."""
    out: list[dict[str, Any]] = []
    for entry in history or ():
        if isinstance(entry, dict) and entry.get("type") == HistoryEntryType.COMPLETED:
            out.append(entry)
    return out
