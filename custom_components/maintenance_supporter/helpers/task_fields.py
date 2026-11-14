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

from collections.abc import Mapping
from types import MappingProxyType
from typing import Any

from ..const import (
    CONF_TRIGGER_COMBINATOR,
    CONF_TRIGGER_HOLD_UNTIL_DONE,
    MAX_INTERVAL_DAYS,
    ROTATION_STRATEGIES,
    TaskPriority,
)
from .completion_requirements import (
    REQUIRABLE_COMPLETION_FIELDS as _REQUIRABLE_COMPLETION_FIELDS,
)
from .dates import canonical_iso_date

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

# ─── Stored values ───────────────────────────────────────────────────────────

# What a task field means while it is not stored. The panel dialog sends
# these on every save, and a task's first save read as an edit ("Priority:
# — → Normal", DRY audit 2026-11-07, BR7-A2); every reader takes the same
# value for the missing key.
UNSTORED_TASK_FIELDS: Mapping[str, Any] = MappingProxyType(
    {
        "priority": TaskPriority.NORMAL.value,
        "enabled": True,
        "allow_skip": True,
        "notify_enabled": True,
        "require_tag_scan": False,
    }
)

# Keys whose empty container is a value, not an absence: #233's Quick
# complete is on while ``quick_complete_defaults`` is present, so ``{}``
# reads "on, nothing to prefill" (the compact list keeps it, the trace
# notes it).
COMPACT_KEEPS_EMPTY: frozenset[str] = frozenset({"quick_complete_defaults"})

# ─── Trigger keys the options flow has no field for ────────────────────────

#: The panel sets them; the options flow rebuilds a trigger from its form and
#: carries them over (tests/test_trigger_surface_parity): the recovery flag
#: (#53, the type steps write it again from their checkbox), the counting
#: start value (#102), the runtime session cap (#149), how the trigger and
#: the safety interval combine, the detail shown with the triggered task
#: (#228) and holding it until done (D#229). The plain rebuild and the
#: compound one each kept a list (DRY audit 2026-10-30, BI6-B6).
FLOW_CARRIED_TRIGGER_KEYS: tuple[str, ...] = (
    "auto_complete_on_recovery",
    "trigger_baseline_value",
    "trigger_runtime_max_session_seconds",
    CONF_TRIGGER_COMBINATOR,
    "detail_attribute",
    CONF_TRIGGER_HOLD_UNTIL_DONE,
)
#: What a compound keeps itself: its conditions own the counting start, the
#: session cap and the hold, and its recovery flag comes from its form.
COMPOUND_FLOW_CARRIED_TRIGGER_KEYS: tuple[str, ...] = (CONF_TRIGGER_COMBINATOR, "detail_attribute")


def carried_trigger_keys(previous: Mapping[str, Any], keys: tuple[str, ...] = FLOW_CARRIED_TRIGGER_KEYS) -> dict[str, Any]:
    """The carried keys of the stored trigger that are set (a start value of
    0 is one; None, "" and False are off)."""
    return {k: previous[k] for k in keys if k in previous and previous[k] is not None and previous[k] != "" and previous[k] is not False}

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
    """An imported one-time due date: a real ISO date, stored ``YYYY-MM-DD``."""
    if not isinstance(value, str):
        return None
    return canonical_iso_date(value.strip())
