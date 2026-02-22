"""Maintenance task model."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date, datetime, timedelta
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
    warning_days: int = DEFAULT_WARNING_DAYS
    last_performed: str | None = None  # ISO format YYYY-MM-DD

    # --- Trigger ---
    trigger_config: dict[str, Any] | None = None

    # --- Metadata ---
    notes: str | None = None
    documentation_url: str | None = None

    # --- User Assignment ---
    responsible_user_id: str | None = None  # HA user UUID

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
        """Calculate the next due date based on last_performed and interval."""
        if self.interval_days is None:
            return None
        if self.last_performed is None:
            # Never performed but has interval → due today
            return dt_util.now().date()
        try:
            last = date.fromisoformat(self.last_performed)
            return last + timedelta(days=self.interval_days)
        except (ValueError, TypeError):
            return None

    @property
    def days_until_due(self) -> int | None:
        """Calculate days until the task is due. Negative means overdue."""
        due = self.next_due
        if due is None:
            return None
        return (due - dt_util.now().date()).days

    @property
    def status(self) -> MaintenanceStatus:
        """Determine the current status of this task."""
        # Trigger takes precedence
        if self._trigger_active:
            return MaintenanceStatus.TRIGGERED

        days = self.days_until_due
        if days is None:
            # Manual task or no schedule: always OK unless triggered
            return MaintenanceStatus.OK

        if days < 0:
            return MaintenanceStatus.OVERDUE
        if days <= self.warning_days:
            return MaintenanceStatus.DUE_SOON
        return MaintenanceStatus.OK

    @property
    def times_performed(self) -> int:
        """Count the number of completed maintenance entries in history."""
        return sum(
            1
            for entry in self.history
            if entry.get("type") == HistoryEntryType.COMPLETED
        )

    @property
    def total_cost(self) -> float:
        """Sum of all costs in history."""
        return sum(
            entry.get("cost", 0.0)
            for entry in self.history
            if entry.get("cost") is not None
        )

    @property
    def average_duration(self) -> float | None:
        """Average duration of completed maintenance in minutes."""
        durations = [
            entry["duration"]
            for entry in self.history
            if entry.get("type") == HistoryEntryType.COMPLETED
            and entry.get("duration") is not None
        ]
        if not durations:
            return None
        return sum(durations) / len(durations)

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
    ) -> None:
        """Mark this task as completed."""
        now = dt_util.now()
        self.last_performed = now.date().isoformat()
        self._trigger_active = False
        self._trigger_current_value = None

        self.add_history_entry(
            entry_type=HistoryEntryType.COMPLETED,
            notes=notes,
            cost=cost,
            duration=duration,
            checklist_state=checklist_state,
            feedback=feedback,
            completed_by=completed_by,
        )

    def reset(self, reset_date: date | None = None) -> None:
        """Reset last performed to a specific date."""
        if reset_date is None:
            reset_date = dt_util.now().date()
        self.last_performed = reset_date.isoformat()

        self.add_history_entry(
            entry_type=HistoryEntryType.RESET,
            notes=f"Reset to {reset_date.isoformat()}",
        )

    def skip(self, reason: str | None = None) -> None:
        """Skip the current maintenance cycle."""
        # Move last_performed to today to restart the cycle
        self.last_performed = dt_util.now().date().isoformat()
        self._trigger_active = False

        self.add_history_entry(
            entry_type=HistoryEntryType.SKIPPED,
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

        self.history.append(entry)

        # Trim history to max entries
        if len(self.history) > DEFAULT_MAX_HISTORY_ENTRIES:
            self.history = self.history[-DEFAULT_MAX_HISTORY_ENTRIES:]

    # --- Serialization ---

    def to_dict(self) -> dict[str, Any]:
        """Serialize to dictionary for config entry storage."""
        data: dict[str, Any] = {
            "id": self.id,
            "object_id": self.object_id,
            "name": self.name,
            "type": self.type,
            "enabled": self.enabled,
            "schedule_type": self.schedule_type,
            "warning_days": self.warning_days,
            "history": self.history,
        }
        if self.interval_days is not None:
            data["interval_days"] = self.interval_days
        if self.last_performed is not None:
            data["last_performed"] = self.last_performed
        if self.trigger_config is not None:
            data["trigger_config"] = self.trigger_config
        if self.notes is not None:
            data["notes"] = self.notes
        if self.documentation_url is not None:
            data["documentation_url"] = self.documentation_url
        if self.responsible_user_id is not None:
            data["responsible_user_id"] = self.responsible_user_id
        if self.checklist:
            data["checklist"] = self.checklist
        if self.adaptive_config is not None:
            data["adaptive_config"] = self.adaptive_config
        return data

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> MaintenanceTask:
        """Deserialize from dictionary."""
        return cls(
            id=data.get("id", uuid4().hex),
            object_id=data.get("object_id", ""),
            name=data.get("name", ""),
            type=data.get("type", MaintenanceTypeEnum.CUSTOM),
            enabled=data.get("enabled", True),
            schedule_type=data.get("schedule_type", ScheduleType.TIME_BASED),
            interval_days=data.get("interval_days"),
            warning_days=data.get("warning_days", DEFAULT_WARNING_DAYS),
            last_performed=data.get("last_performed"),
            trigger_config=data.get("trigger_config"),
            notes=data.get("notes"),
            documentation_url=data.get("documentation_url"),
            responsible_user_id=data.get("responsible_user_id"),
            checklist=data.get("checklist", []),
            adaptive_config=data.get("adaptive_config"),
            history=data.get("history", []),
        )
