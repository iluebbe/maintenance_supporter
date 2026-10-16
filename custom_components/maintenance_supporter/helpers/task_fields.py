"""Single source of truth for task-field enums + numeric ranges.

The task/trigger forms exist in TWO hand-written UIs (the panel's
``task-dialog.ts`` and the HA options config-flow) plus the WS create/update
schemas and the sanitizer. This module pins the *values* those surfaces must
agree on — enum option sets and numeric bounds — so they are consumed from one
place on the Python side (WS schemas, sanitizer, config-flow selectors) and
enforced against the TypeScript dialog by the parity tripwires in
``tests/test_frontend_const_parity.py`` / ``tests/test_parity_task_fields.py``.

This is the field-level companion of ``helpers/settings_registry`` (which does
the same for the global settings). Full form *generation* from these specs is
the remaining long-term step; until then, a new enum value or bound changed
here propagates to every Python surface by construction and fails the build if
the TS dialog wasn't updated.
"""

from __future__ import annotations

from ..const import (
    MAX_INTERVAL_DAYS,
    ROTATION_STRATEGIES,
    TaskPriority,
)
from .completion_requirements import (
    REQUIRABLE_COMPLETION_FIELDS as _REQUIRABLE_COMPLETION_FIELDS,
)

# ─── Enum option sets ────────────────────────────────────────────────────────

# Priority choices, in display order. Derived from the TaskPriority enum so a
# new priority level lands in the WS schemas + config-flow dropdowns
# automatically (the TS dialog is pinned by test_ts_priority_keys_match_enum).
TASK_PRIORITIES: tuple[str, ...] = tuple(p.value for p in TaskPriority)

# next_due anchoring: from the completion date (drifts) or the planned date.
INTERVAL_ANCHORS: tuple[str, ...] = ("completion", "planned")

# Shared-task rotation strategies (defined in const; re-exported here so all
# task-field consumers import from one module).
ROTATION_STRATEGY_VALUES: tuple[str, ...] = ROTATION_STRATEGIES

# Details a task can demand on completion (re-exported so every task-field
# consumer imports its enums from this one module).
REQUIRABLE_COMPLETION_FIELDS: tuple[str, ...] = _REQUIRABLE_COMPLETION_FIELDS

# ─── Numeric bounds (inclusive) ─────────────────────────────────────────────

WARNING_DAYS_RANGE: tuple[int, int] = (0, 365)
EARLIEST_COMPLETION_RANGE: tuple[int, int] = (0, 3650)
INTERVAL_DAYS_RANGE: tuple[int, int] = (1, MAX_INTERVAL_DAYS)


# ─── Imported values (JSON / YAML backup, CSV) ──────────────────────────────
# One rule per field for both import formats: the JSON import dropped a zero
# interval and replaced an out-of-range warning value with the default, while
# the CSV import kept both for the sanitizer to clamp (interval 1, warning 365)
# and took any YYYY-MM-DD shape as a due date (2026-02-31) that the JSON
# import did not check at all — the same file in two formats became two
# different tasks (DRY audit 2026-10-12, BI5-A10).


def import_interval_days(value: object) -> int | None:
    """An imported interval: a whole number within INTERVAL_DAYS_RANGE, read
    from a number or numeric text; ``None`` (no interval) otherwise."""
    if isinstance(value, bool):
        return None
    try:
        number = float(value) if isinstance(value, (int, float, str)) else None
    except ValueError:
        return None
    if number is None or not number.is_integer():
        return None
    days = int(number)
    return days if INTERVAL_DAYS_RANGE[0] <= days <= INTERVAL_DAYS_RANGE[1] else None


def import_warning_days(value: object, default: int) -> int:
    """Imported warning days within WARNING_DAYS_RANGE, else ``default``."""
    if isinstance(value, bool):
        return default
    try:
        number = float(value) if isinstance(value, (int, float, str)) else None
    except ValueError:
        return default
    if number is None or not number.is_integer():
        return default
    days = int(number)
    return days if WARNING_DAYS_RANGE[0] <= days <= WARNING_DAYS_RANGE[1] else default


def import_due_date(value: object) -> str | None:
    """An imported one-time due date: a real ISO date (``YYYY-MM-DD``)."""
    from .dates import parse_iso_date

    if not isinstance(value, str):
        return None
    text = value.strip()
    return text if len(text) == 10 and parse_iso_date(text) is not None else None
