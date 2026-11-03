"""The fields a template manages on a task, and their fingerprints (2.118).

Shared by the template builder, which records what it gave a task
(``origin["applied"]``), and helpers/template_updates.py, which compares it
with the task and the template later. Eight hex characters per value: texts
as they are, anything else as canonical JSON; templates_history.py uses the
same scheme.
"""

from __future__ import annotations

import hashlib
import json
from collections.abc import Mapping
from typing import Any, Final

from ..const import DEFAULT_WARNING_DAYS
from .schedule import Schedule, normalize_task_storage

FIELDS: Final = ("name", "notes", "recurrence", "warning_days")
#: The part of a stored schedule a template sets. The anchor, a finite end,
#: the business-day roll and a calendar offset stay the user's.
MANAGED_SCHEDULE_KEYS: Final = frozenset({"kind", "every", "unit", "weekdays", "nth", "weekday", "day", "months", "season_months"})


def fingerprint(value: Any) -> str:
    """Eight hex characters standing for a field value."""
    text = value if isinstance(value, str) else json.dumps(value, sort_keys=True, ensure_ascii=False)
    return hashlib.sha1(text.encode("utf-8")).hexdigest()[:8]


def managed_schedule(schedule: Any) -> dict[str, Any]:
    """The template-managed part of a stored (nested) schedule."""
    canonical = Schedule.from_dict(schedule).to_dict() if isinstance(schedule, Mapping) else {"kind": "manual"}
    return {k: v for k, v in canonical.items() if k in MANAGED_SCHEDULE_KEYS}


def task_values(task: Mapping[str, Any]) -> dict[str, Any]:
    """The managed fields of a task as compared (texts trimmed, the schedule
    in its stored shape)."""
    stored = normalize_task_storage(task)
    warning = task.get("warning_days")
    return {
        "name": str(task.get("name") or "").strip(),
        "notes": str(task.get("notes") or "").replace("\r\n", "\n").strip(),
        "recurrence": managed_schedule(stored.get("schedule")),
        "warning_days": warning if isinstance(warning, int) and not isinstance(warning, bool) else DEFAULT_WARNING_DAYS,
    }


def fingerprints(values: Mapping[str, Any]) -> dict[str, str]:
    """One fingerprint per managed field."""
    return {f: fingerprint(values[f]) for f in FIELDS}


def applied_fingerprints(task: Mapping[str, Any]) -> dict[str, str]:
    """What a freshly built template task records as its base."""
    return fingerprints(task_values(task))
