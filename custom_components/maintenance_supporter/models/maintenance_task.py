"""Maintenance task model."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date, time
from typing import Any
from uuid import uuid4

from homeassistant.util import dt as dt_util

from ..const import (
    DEFAULT_MAX_HISTORY_ENTRIES,
    DEFAULT_WARNING_DAYS,
    HistoryEntryType,
    MaintenanceStatus,
    MaintenanceTypeEnum,
    ScheduleType,
)
from ..helpers.dates import parse_iso_date
from ..helpers.schedule import Schedule, read_legacy_fields


@dataclass
class MaintenanceTask:
    """Represents a specific maintenance task belonging to an object.

    Examples: 'Filter Cleaning' for Pool Pump, 'Oil Change' for Car.
    """

    # --- Identity ---
    id: str = field(default_factory=lambda: uuid4().hex)
    object_id: str = ""
    name: str = ""
    type: str = MaintenanceTypeEnum.CUSTOM
    enabled: bool = True

    # --- Schedule ---
    schedule_type: str = ScheduleType.TIME_BASED
    interval_days: int | None = None
    interval_unit: str = "days"  # days | weeks | months | years (calendar-aware)
    warning_days: int = DEFAULT_WARNING_DAYS
    # Completion window: max days *before* the due date a task may be completed.
    # None = no restriction (complete any time). 0 = only on/after the due date.
    earliest_completion_days: int | None = None
    last_performed: str | None = None  # ISO format YYYY-MM-DD
    created_at: str | None = None  # ISO date: fallback anchor for next_due when last_performed is None
    interval_anchor: str = "completion"  # "completion" or "planned"
    last_planned_due: str | None = None  # ISO date: anchor for planned mode
    schedule_time: str | None = None  # "HH:MM" in HA's configured TZ; None = midnight (default)
    due_date: str | None = None  # ISO date: one-time task due date (ScheduleType.ONE_TIME)
    # Per-occurrence postpone: an ISO date that overrides just the CURRENT
    # cycle's due date (see Schedule.next_due). Cleared on completion so the
    # next cycle returns to the normal cadence. Dynamic (lives in the Store).
    due_override: str | None = None
    # Raw nested schedule dict (schedule-model v2). The source of truth for the
    # calendar kinds (weekdays/nth_weekday/day_of_month), which the flat fields
    # above can't represent. None for legacy/flat-only data.
    schedule_raw: dict[str, Any] | None = None

    # --- Trigger ---
    trigger_config: dict[str, Any] | None = None

    # --- Metadata ---
    notes: str | None = None
    documentation_url: str | None = None
    custom_icon: str | None = None
    nfc_tag_id: str | None = None
    priority: str = "normal"
    labels: list[str] = field(default_factory=list)
    # --- Meter readings (v2.20, #83) ---
    # Display unit for the recorded value of a `reading`-type task ("kWh",
    # "m³", …). The value itself lives per completion in the history entry
    # (`reading_value`), so the unit is task-level config, not state.
    reading_unit: str | None = None

    # --- Archive (v2.10.0) ---
    # archived_at is an ISO timestamp; None means active. When set, the task
    # reads the ARCHIVED status (highest precedence) and goes inert everywhere
    # except budget/cost history. archived_reason is one of ARCHIVE_REASON_*
    # (manual | auto | object) and drives the auto-delete + object-cascade rules.
    archived_at: str | None = None
    archived_reason: str | None = None

    # --- User Assignment ---
    responsible_user_id: str | None = None  # HA user UUID (current pointer)
    assignee_pool: list[str] = field(default_factory=list)  # HA user UUIDs
    rotation_strategy: str | None = None  # round_robin | least_completed | random

    # --- Checklist ---
    checklist: list[str] = field(default_factory=list)

    # --- Adaptive Scheduling ---
    adaptive_config: dict[str, Any] | None = None

    # --- History ---
    history: list[dict[str, Any]] = field(default_factory=list)

    # --- Runtime (not persisted) ---
    _trigger_active: bool = field(default=False, repr=False)
    _trigger_current_value: float | None = field(default=None, repr=False)

    # --- Computed Properties ---

    @property
    def next_due(self) -> date | None:
        """Calculate the next due date.

        - ``one_time`` tasks are due on ``due_date`` and return ``None`` once
          completed (they archive instead of re-arming).
        - Otherwise the date is ``last_performed (or created_at) + interval``,
          where the interval honours ``interval_unit`` (days/weeks/months/years).
          With ``interval_anchor == "planned"`` the date is computed from the
          previously planned due date to avoid drift for strictly periodic tasks.

        Example (30-day interval, planned for March 1):
          - Completed March 5 → next due: March 31 (not April 4)
          - If never completed the date may be in the past → OVERDUE.
        """
        # Recurrence is computed by the Schedule value object
        # (helpers/schedule.py, Phase 2). ISO parsing stays here at the boundary;
        # a *malformed* last_performed preserves the historical "no next_due".
        last: date | None = None
        if self.last_performed:
            try:
                last = date.fromisoformat(self.last_performed)
            except (ValueError, TypeError):
                return None
        return self._schedule().next_due(
            last_performed=last,
            created_at=parse_iso_date(self.created_at),
            last_planned_due=parse_iso_date(self.last_planned_due),
            today=dt_util.now().date(),
            times_performed=self.times_performed,
            due_override=parse_iso_date(self.due_override),
        )

    def _schedule(self) -> Schedule:
        """The recurrence as a value object (see docs/design/schedule-model-v2.md).

        A nested ``schedule_raw`` is authoritative — it's the only representation
        that carries the calendar kinds (weekdays / nth_weekday / day_of_month).
        Otherwise fall back to the flat fields (legacy / old exports)."""
        if isinstance(self.schedule_raw, dict) and self.schedule_raw.get("kind"):
            return Schedule.from_dict(self.schedule_raw)
        return Schedule.from_legacy(
            schedule_type=self.schedule_type,
            interval_days=self.interval_days,
            interval_unit=self.interval_unit,
            interval_anchor=self.interval_anchor,
            due_date=self.due_date,
        )

    @property
    def days_until_due(self) -> int | None:
        """Calculate days until the task is due. Negative means overdue."""
        due = self.next_due
        if due is None:
            return None
        return (due - dt_util.now().date()).days

    def _is_past_schedule_time(self) -> bool:
        """True iff a `schedule_time` is set AND current local time is past it.

        Used as a sub-day refinement of the OVERDUE transition: when `days_until_due`
        is exactly 0, the task is considered overdue once the configured HH:MM has
        passed (in HA's configured TZ). Returns False when no `schedule_time` is set
        — that preserves the historical "due at midnight" semantic.
        """
        if not self.schedule_time:
            return False
        try:
            hh, mm = self.schedule_time.split(":", 1)
            target = time(int(hh), int(mm))
        except (ValueError, TypeError):
            return False
        return dt_util.now().time() >= target

    @property
    def archived(self) -> bool:
        """True iff the task is archived (retired but retained)."""
        return self.archived_at is not None

    @property
    def status(self) -> MaintenanceStatus:
        """Determine the current status of this task."""
        # Archived takes precedence over everything — a retired task is inert.
        # Mirror this in helpers/status.compute_status_from_task_dict (the dict
        # twin used where only coordinator data is available).
        if self.archived_at is not None:
            return MaintenanceStatus.ARCHIVED

        # Trigger takes precedence
        if self._trigger_active:
            return MaintenanceStatus.TRIGGERED

        days = self.days_until_due
        if days is None:
            # Manual task or no schedule: always OK unless triggered
            return MaintenanceStatus.OK

        if days < 0:
            return MaintenanceStatus.OVERDUE
        # Sub-day refinement: same-day past schedule_time also counts as overdue.
        # Without this, a task with schedule_time="09:00" would only flip at midnight.
        if days == 0 and self._is_past_schedule_time():
            return MaintenanceStatus.OVERDUE
        # Don't let the warning window exceed one interval, measured in real
        # days via the Schedule (a 6-*month* task must not collapse a 14-day
        # warning to min(14, 6) — issue #58). Single source: the Schedule, not
        # raw interval fields.
        span = self._schedule().span_days()
        effective_warning = min(self.warning_days, span) if span else self.warning_days
        if days <= effective_warning:
            return MaintenanceStatus.DUE_SOON
        return MaintenanceStatus.OK

    @property
    def can_complete_now(self) -> bool:
        """Whether completion is currently allowed by the completion window.

        A task with ``earliest_completion_days`` set may only be completed once
        it's within that many days of its due date (or overdue). Tasks without
        a schedule (``days_until_due is None``) are always completable.
        """
        if self.earliest_completion_days is None:
            return True
        days = self.days_until_due
        if days is None:
            return True
        return days <= self.earliest_completion_days

    @property
    def is_done(self) -> bool:
        """True for a completed one-time task, or a finite series that has ended.

        ("Done" is the terminal state of a one-off. It is distinct from
        "archived" — see ``archived`` — which is the retire-but-retain state
        added in v2.10.0 and reserved for that feature.)
        """
        if self.schedule_type == ScheduleType.ONE_TIME and self.last_performed is not None:
            return True
        # A finite recurring series (repeat N times / recur until a date) is
        # terminally done once it has been performed and no longer re-arms.
        if self.last_performed is not None and self._schedule().is_finite() and self.next_due is None:
            return True
        return False

    @property
    def times_performed(self) -> int:
        """Count the number of completed maintenance entries in history."""
        return sum(1 for entry in self.history if entry.get("type") == HistoryEntryType.COMPLETED)

    @property
    def total_cost(self) -> float:
        """Sum of all costs in history."""
        total = 0.0
        for entry in self.history:
            cost = entry.get("cost")
            if cost is None:
                continue
            try:
                total += float(cost)
            except (ValueError, TypeError):
                continue
        return total

    @property
    def average_duration(self) -> float | None:
        """Average duration of completed maintenance in minutes."""
        durations = [
            entry["duration"]
            for entry in self.history
            if entry.get("type") == HistoryEntryType.COMPLETED and entry.get("duration") is not None
        ]
        if not durations:
            return None
        return float(sum(durations)) / len(durations)

    @property
    def last_entry(self) -> dict[str, Any] | None:
        """Return the most recent history entry."""
        if not self.history:
            return None
        return self.history[-1]

    # --- Methods ---

    def complete(
        self,
        notes: str | None = None,
        cost: float | None = None,
        duration: int | None = None,
        checklist_state: dict[str, bool] | None = None,
        feedback: str | None = None,
        completed_by: str | None = None,
        photo_doc_id: str | None = None,
        reading_value: float | None = None,
    ) -> None:
        """Mark this task as completed."""
        # Save current next_due as anchor for planned mode before resetting
        if self.interval_anchor == "planned" and self.next_due is not None:
            self.last_planned_due = self.next_due.isoformat()

        now = dt_util.now()
        self.last_performed = now.date().isoformat()
        self._trigger_active = False
        self._trigger_current_value = None
        # A postponed occurrence is consumed by completing it — the next cycle
        # returns to the normal cadence.
        self.due_override = None

        self.add_history_entry(
            entry_type=HistoryEntryType.COMPLETED,
            notes=notes,
            cost=cost,
            duration=duration,
            checklist_state=checklist_state,
            feedback=feedback,
            completed_by=completed_by,
            photo_doc_id=photo_doc_id,
            reading_value=reading_value,
        )

        # Shared tasks: rotate the "currently responsible" pointer to the next
        # assignee for the coming cycle (after this completion is recorded, so
        # least_completed sees it).
        self.advance_rotation()

    def advance_rotation(self) -> None:
        """Advance ``responsible_user_id`` to the next pool member.

        No-op unless a rotation strategy is set and the pool has ≥2 members.
        - ``round_robin``: next after the current pointer (wraps).
        - ``least_completed``: the pool member credited with the fewest
          completions in history (tie-break by pool order).
        - ``random``: a random *other* member (falls back to the pool if the
          current pointer is the only entry left).
        """
        pool = [u for u in self.assignee_pool if u]
        if len(pool) < 2 or not self.rotation_strategy:
            return
        current = self.responsible_user_id
        if self.rotation_strategy == "round_robin":
            idx = pool.index(current) if current in pool else -1
            self.responsible_user_id = pool[(idx + 1) % len(pool)]
        elif self.rotation_strategy == "least_completed":
            counts = dict.fromkeys(pool, 0)
            for h in self.history:
                who = h.get("completed_by")
                if who in counts:
                    counts[who] += 1
            self.responsible_user_id = min(pool, key=lambda u: counts[u])
        elif self.rotation_strategy == "random":
            import random

            others = [u for u in pool if u != current] or pool
            self.responsible_user_id = random.choice(others)

    def reset(self, reset_date: date | None = None) -> None:
        """Reset last performed to a specific date."""
        if reset_date is None:
            reset_date = dt_util.now().date()
        self.last_performed = reset_date.isoformat()
        # Clear planned anchor so next_due is computed from the reset date
        self.last_planned_due = None

        self.add_history_entry(
            entry_type=HistoryEntryType.RESET,
            notes=f"Reset to {reset_date.isoformat()}",
        )

    def skip(self, reason: str | None = None, *, as_missed: bool = False) -> None:
        """Skip the current maintenance cycle.

        ``as_missed=True`` records the cycle as MISSED (was due and never done)
        rather than a deliberate SKIPPED — clearer history + compliance views.
        The cycle restarts either way.
        """
        # Save current next_due as anchor for planned mode before resetting
        if self.interval_anchor == "planned" and self.next_due is not None:
            self.last_planned_due = self.next_due.isoformat()

        # Move last_performed to today to restart the cycle
        self.last_performed = dt_util.now().date().isoformat()
        self._trigger_active = False

        self.add_history_entry(
            entry_type=HistoryEntryType.MISSED if as_missed else HistoryEntryType.SKIPPED,
            notes=reason,
        )

    def add_history_entry(
        self,
        entry_type: str,
        notes: str | None = None,
        cost: float | None = None,
        duration: int | None = None,
        trigger_value: float | None = None,
        checklist_state: dict[str, bool] | None = None,
        feedback: str | None = None,
        completed_by: str | None = None,
        photo_doc_id: str | None = None,
        reading_value: float | None = None,
    ) -> None:
        """Add an entry to the maintenance history."""
        entry: dict[str, Any] = {
            "timestamp": dt_util.now().isoformat(),
            "type": entry_type,
        }
        if notes is not None:
            entry["notes"] = notes
        if cost is not None:
            entry["cost"] = cost
        if duration is not None:
            entry["duration"] = duration
        if trigger_value is not None:
            entry["trigger_value"] = trigger_value
        if checklist_state is not None:
            entry["checklist_state"] = checklist_state
        if feedback is not None:
            entry["feedback"] = feedback
        if completed_by is not None:
            entry["completed_by"] = completed_by
        if photo_doc_id is not None:
            entry["photo_doc_id"] = photo_doc_id
        # Meter readings (v2.20, #83): the recorded value rides on the
        # completion entry — the delta view derives from consecutive entries.
        if reading_value is not None:
            entry["reading_value"] = reading_value

        self.history.append(entry)

        # Trim history to max entries — TYPE-AWARE (journey K1): trigger
        # noise is evicted first, so a flapping sensor (hundreds of
        # `triggered` entries) can never push out the completion record that
        # `times_performed` / `total_cost` / adaptive learning are computed
        # from. Only if dropping all trigger entries still isn't enough does
        # the trim fall back to oldest-first over everything.
        if len(self.history) > DEFAULT_MAX_HISTORY_ENTRIES:
            overflow = len(self.history) - DEFAULT_MAX_HISTORY_ENTRIES
            noise_types = {
                HistoryEntryType.TRIGGERED,
                HistoryEntryType.TRIGGER_REMOVED,
            }
            kept: list[dict[str, Any]] = []
            dropped = 0
            for h in self.history:
                if dropped < overflow and h.get("type") in noise_types:
                    dropped += 1
                    continue
                kept.append(h)
            if len(kept) > DEFAULT_MAX_HISTORY_ENTRIES:
                kept = kept[-DEFAULT_MAX_HISTORY_ENTRIES:]
            self.history = kept

    # --- Serialization ---

    def to_dict(self) -> dict[str, Any]:
        """Serialize to dictionary for config entry storage."""
        data: dict[str, Any] = {
            "id": self.id,
            "object_id": self.object_id,
            "name": self.name,
            "type": self.type,
            "enabled": self.enabled,
            "warning_days": self.warning_days,
            "history": self.history,
        }
        # Recurrence as the nested `schedule` value object (schedule-model v2).
        # Sensor-ness stays in trigger_config; schedule_type is derived on read
        # via read_legacy_fields, so it is no longer stored.
        data["schedule"] = self._schedule().to_dict()
        if self.last_planned_due is not None:
            data["last_planned_due"] = self.last_planned_due
        if self.due_override is not None:
            data["due_override"] = self.due_override
        if self.schedule_time is not None:
            data["schedule_time"] = self.schedule_time
        if self.last_performed is not None:
            data["last_performed"] = self.last_performed
        if self.created_at is not None:
            data["created_at"] = self.created_at
        if self.trigger_config is not None:
            data["trigger_config"] = self.trigger_config
        if self.notes is not None:
            data["notes"] = self.notes
        if self.documentation_url is not None:
            data["documentation_url"] = self.documentation_url
        if self.custom_icon is not None:
            data["custom_icon"] = self.custom_icon
        if self.nfc_tag_id is not None:
            data["nfc_tag_id"] = self.nfc_tag_id
        if self.reading_unit is not None:
            data["reading_unit"] = self.reading_unit
        # Only persist a non-default priority to keep stored dicts lean.
        if self.priority and self.priority != "normal":
            data["priority"] = self.priority
        if self.labels:
            data["labels"] = self.labels
        if self.earliest_completion_days is not None:
            data["earliest_completion_days"] = self.earliest_completion_days
        if self.archived_at is not None:
            data["archived_at"] = self.archived_at
        if self.archived_reason is not None:
            data["archived_reason"] = self.archived_reason
        if self.responsible_user_id is not None:
            data["responsible_user_id"] = self.responsible_user_id
        if self.assignee_pool:
            data["assignee_pool"] = self.assignee_pool
        if self.rotation_strategy:
            data["rotation_strategy"] = self.rotation_strategy
        if self.checklist:
            data["checklist"] = self.checklist
        if self.adaptive_config is not None:
            data["adaptive_config"] = self.adaptive_config
        return data

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> MaintenanceTask:
        """Deserialize from dictionary.

        Accepts both the nested ``schedule`` storage (Phase 3) and the flat
        v2.6.x fields via :func:`read_legacy_fields` — the recurrence is held
        in flat attributes in memory either way, so every existing reader of
        ``task.interval_days`` etc. is unaffected.
        """
        sched = read_legacy_fields(data)
        return cls(
            id=data.get("id", uuid4().hex),
            object_id=data.get("object_id", ""),
            name=data.get("name", ""),
            type=data.get("type", MaintenanceTypeEnum.CUSTOM),
            enabled=data.get("enabled", True),
            schedule_type=sched["schedule_type"],
            interval_days=sched["interval_days"],
            interval_unit=sched["interval_unit"],
            due_date=sched["due_date"],
            schedule_raw=data.get("schedule") if isinstance(data.get("schedule"), dict) else None,
            warning_days=data.get("warning_days", DEFAULT_WARNING_DAYS),
            earliest_completion_days=data.get("earliest_completion_days"),
            last_performed=data.get("last_performed"),
            created_at=data.get("created_at"),
            interval_anchor=sched["interval_anchor"],
            last_planned_due=data.get("last_planned_due"),
            due_override=data.get("due_override"),
            schedule_time=data.get("schedule_time"),
            trigger_config=data.get("trigger_config"),
            notes=data.get("notes"),
            documentation_url=data.get("documentation_url"),
            custom_icon=data.get("custom_icon"),
            nfc_tag_id=data.get("nfc_tag_id"),
            reading_unit=data.get("reading_unit"),
            priority=data.get("priority", "normal"),
            labels=data.get("labels", []),
            archived_at=data.get("archived_at"),
            archived_reason=data.get("archived_reason"),
            responsible_user_id=data.get("responsible_user_id"),
            assignee_pool=data.get("assignee_pool", []),
            rotation_strategy=data.get("rotation_strategy"),
            checklist=data.get("checklist", []),
            adaptive_config=data.get("adaptive_config"),
            history=data.get("history", []),
        )
