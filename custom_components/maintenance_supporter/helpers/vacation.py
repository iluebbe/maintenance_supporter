"""Vacation mode (v1.2.0).

Suppresses notifications for non-exempt tasks during a configured date range
plus a buffer (so a task that comes due the day of return doesn't fire
immediately). Sensor-triggered notifications are suppressed too unless the
task is on the exempt list.

The exempt list lives at the global config-entry level — it is *persistent*
across vacations, not per-vacation. Use case: pool chemistry that the
neighbour checks regardless of whether you're away.
"""

from __future__ import annotations

from collections.abc import Iterable, Mapping
from dataclasses import dataclass, field
from datetime import date, datetime, timedelta
from typing import TYPE_CHECKING, Any

from homeassistant.util import dt as dt_util

from ..const import (
    CONF_VACATION_BUFFER_DAYS,
    CONF_VACATION_ENABLED,
    CONF_VACATION_END,
    CONF_VACATION_EXEMPT_TASK_IDS,
    CONF_VACATION_START,
    DEFAULT_VACATION_BUFFER_DAYS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant


@dataclass(frozen=True)
class VacationState:
    """Frozen snapshot of vacation config.

    Frozen so callers can pass it around without worrying about mutation
    during a notification-decision window.
    """

    enabled: bool
    start: date | None
    end: date | None
    buffer_days: int
    exempt_task_ids: frozenset[str] = field(default_factory=frozenset)

    @property
    def window_end(self) -> date | None:
        """Last day on which suppression still applies (inclusive)."""
        if self.end is None:
            return None
        return self.end + timedelta(days=max(0, self.buffer_days))

    def is_active(self, at: datetime | None = None) -> bool:
        """True if today falls within [start, end + buffer] and the toggle is on."""
        if not self.enabled or self.start is None or self.end is None:
            return False
        today = (at or dt_util.now()).date()
        return self.start <= today <= (self.window_end or self.end)

    def is_silent_for(self, task_id: str, at: datetime | None = None) -> bool:
        """Return True if a notification for *task_id* must be suppressed.

        Suppressed iff vacation is currently active AND the task is not in
        the exempt list. Exempt tasks fire normally even during vacation.
        """
        if not self.is_active(at):
            return False
        return task_id not in self.exempt_task_ids


def _coerce_date(value: Any) -> date | None:
    """Parse an ISO YYYY-MM-DD string from config; tolerant of None / junk."""
    if not value or not isinstance(value, str):
        return None
    try:
        return date.fromisoformat(value)
    except (TypeError, ValueError):
        return None


def _coerce_buffer(value: Any) -> int:
    try:
        i = int(value)
    except (TypeError, ValueError):
        return DEFAULT_VACATION_BUFFER_DAYS
    if i < 0 or i > 14:
        return DEFAULT_VACATION_BUFFER_DAYS
    return i


def _global_options(hass: HomeAssistant) -> Mapping[str, Any]:
    """Return options dict from the global config entry."""
    for entry in hass.config_entries.async_entries(DOMAIN):
        if entry.unique_id == GLOBAL_UNIQUE_ID:
            return entry.options or entry.data
    return {}


def get_vacation_state(hass: HomeAssistant) -> VacationState:
    """Read the current vacation state from the global config entry."""
    opts = _global_options(hass)
    raw_exempt = opts.get(CONF_VACATION_EXEMPT_TASK_IDS) or []
    exempt: list[str] = []
    if isinstance(raw_exempt, list):
        for x in raw_exempt:
            if isinstance(x, str):
                stripped = x.strip()
                if stripped and len(stripped) <= 64:
                    exempt.append(stripped)
    return VacationState(
        enabled=bool(opts.get(CONF_VACATION_ENABLED, False)),
        start=_coerce_date(opts.get(CONF_VACATION_START)),
        end=_coerce_date(opts.get(CONF_VACATION_END)),
        buffer_days=_coerce_buffer(
            opts.get(CONF_VACATION_BUFFER_DAYS, DEFAULT_VACATION_BUFFER_DAYS)
        ),
        exempt_task_ids=frozenset(exempt),
    )


# ---------------------------------------------------------------------------
# Preview
# ---------------------------------------------------------------------------


@dataclass(frozen=True)
class PreviewEvent:
    """A single projected status transition during the vacation window."""

    date: date
    status: str  # "due_soon" | "overdue" | "triggered_est"


def _project_time_based(
    last_performed: date | None,
    created_at: date | None,
    interval_days: int | None,
    warning_days: int,
    today: date,
    window_start: date,
    window_end: date,
) -> list[PreviewEvent]:
    """Project DUE_SOON / OVERDUE dates for a time-based task."""
    if not interval_days or interval_days <= 0:
        return []
    anchor = last_performed or created_at or today
    next_due = anchor + timedelta(days=interval_days)
    due_soon_from = next_due - timedelta(days=max(0, warning_days))

    events: list[PreviewEvent] = []
    if window_start <= due_soon_from <= window_end and due_soon_from > today:
        events.append(PreviewEvent(date=due_soon_from, status="due_soon"))
    if window_start <= next_due <= window_end and next_due > today:
        events.append(PreviewEvent(date=next_due, status="overdue"))
    # Edge: task is already DUE_SOON or OVERDUE today and stays in that state
    # — surface as a "today" event so the user can act on it before leaving.
    if not events:
        if today >= next_due and today <= window_end:
            events.append(PreviewEvent(date=today, status="overdue"))
        elif today >= due_soon_from and today <= window_end and due_soon_from <= today < next_due:
            events.append(PreviewEvent(date=today, status="due_soon"))
    return events


def compute_preview(
    state: VacationState,
    tasks: Iterable[Mapping[str, Any]],
    today: date | None = None,
) -> list[dict[str, Any]]:
    """Project status changes for each task during [start, end+buffer].

    Each input *task* dict must carry: ``task_id``, ``entry_id``,
    ``object_name``, ``task_name``, ``schedule_type``, plus the dynamic
    fields ``last_performed``, ``created_at``, ``interval_days``,
    ``warning_days``, ``enabled`` (all optional).

    Returns a list of preview rows; tasks with no projected events in the
    window are omitted (caller may still want to display the task list
    elsewhere).
    """
    if state.start is None or state.end is None:
        return []
    today = today or dt_util.now().date()
    window_start = max(state.start, today)
    window_end = state.window_end or state.end
    if window_end < window_start:
        return []

    rows: list[dict[str, Any]] = []
    for t in tasks:
        if not t.get("enabled", True):
            continue
        task_id = str(t.get("task_id") or "")
        if not task_id:
            continue
        schedule_type = t.get("schedule_type") or "time_based"

        events: list[PreviewEvent] = []
        kind: str
        confidence: str

        if schedule_type == "time_based":
            events = _project_time_based(
                last_performed=_coerce_date(t.get("last_performed")),
                created_at=_coerce_date(t.get("created_at")),
                interval_days=t.get("interval_days"),
                warning_days=int(t.get("warning_days") or 0),
                today=today,
                window_start=window_start,
                window_end=window_end,
            )
            kind = "time_based"
            confidence = "deterministic"
        elif schedule_type == "sensor_based":
            # Sensor triggers are non-deterministic. Surface every sensor task
            # in the window with a single "may fire anytime" event so the user
            # can decide per-task whether to exempt or pre-complete.
            events = [PreviewEvent(date=window_start, status="triggered_est")]
            kind = "sensor_based"
            confidence = "unpredictable"
        else:
            # Manual tasks have no auto-due — never appear in vacation preview.
            continue

        if not events:
            continue

        rows.append(
            {
                "task_id": task_id,
                "entry_id": t.get("entry_id"),
                "object_name": t.get("object_name") or "",
                "task_name": t.get("task_name") or "",
                "kind": kind,
                "confidence": confidence,
                "events": [{"date": e.date.isoformat(), "status": e.status} for e in events],
                "will_suppress": task_id not in state.exempt_task_ids,
            }
        )
    # Stable ordering: object name then task name, matches #40 sort
    rows.sort(key=lambda r: ((r["object_name"] or "").lower(), (r["task_name"] or "").lower()))
    return rows
