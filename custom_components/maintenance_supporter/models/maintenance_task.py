"""Maintenance task model."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date, timedelta
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
    created_at: str | None = None  # ISO date: fallback anchor for next_due when last_performed is None
    interval_anchor: str = "completion"  # "completion" or "planned"
    last_planned_due: str | None = None  # ISO date: anchor for planned mode

    # --- Trigger ---
    trigger_config: dict[str, Any] | None = None

    # --- Metadata ---
    notes: str | None = None
    documentation_url: str | None = None
    custom_icon: str | None = None
    nfc_tag_id: str | None = None

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
        """Calculate the next due date based on last_performed and interval.

        When interval_anchor is "planned", the next due date is computed from
        the *previously planned* due date rather than the actual completion
        date.  This prevents schedule drift for strictly periodic tasks.

        Example (30-day interval, planned for March 1):
          - Completed March 5 → next due: March 31 (not April 4)
          - If the task has not been completed, the date may be in the past, correctly showing OVERDUE status.
        """
        if not self.interval_days or self.interval_days <= 0:
            return None
        if self.last_performed is None:
            # First-time anchor: use created_at if known, else today.
            # Without this fallback the next_due would always be "today" and
            # the task would never transition to OVERDUE (issue #30).
            try:
                anchor_date = (
                    date.fromisoformat(self.created_at)
                    if self.created_at
                    else dt_util.now().date()
                )
            except (ValueError, TypeError):
                anchor_date = dt_util.now().date()
            return anchor_date + timedelta(days=self.interval_days)
        try:
            last = date.fromisoformat(self.last_performed)
        except (ValueError, TypeError):
            return None

        if self.interval_anchor == "planned" and self.interval_days > 0:
            # Anchor from the previously planned due date (saved on complete/skip)
            # so that late completions don't cause schedule drift.
            # Example: 30-day interval, planned March 1, completed March 5
            #   → last_planned_due="2026-03-01", next due = March 31 (not April 4)
            anchor = last  # fallback: use completion date
            if self.last_planned_due:
                try:
                    anchor = date.fromisoformat(self.last_planned_due)
                except (ValueError, TypeError):
                    pass  # fall back to last_performed

            # O(1) arithmetic to find the first candidate after last_performed
            days_gap = (last - anchor).days
            if days_gap < 0:
                periods = 1
            else:
                periods = (days_gap // self.interval_days) + 1
            return anchor + timedelta(days=periods * self.interval_days)

        return last + timedelta(days=self.interval_days)

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
        effective_warning = min(self.warning_days, self.interval_days) if self.interval_days else self.warning_days
        if days <= effective_warning:
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
            if entry.get("type") == HistoryEntryType.COMPLETED
            and entry.get("duration") is not None
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
    ) -> None:
        """Mark this task as completed."""
        # Save current next_due as anchor for planned mode before resetting
        if self.interval_anchor == "planned" and self.next_due is not None:
            self.last_planned_due = self.next_due.isoformat()

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
        # Clear planned anchor so next_due is computed from the reset date
        self.last_planned_due = None

        self.add_history_entry(
            entry_type=HistoryEntryType.RESET,
            notes=f"Reset to {reset_date.isoformat()}",
        )

    def skip(self, reason: str | None = None) -> None:
        """Skip the current maintenance cycle."""
        # Save current next_due as anchor for planned mode before resetting
        if self.interval_anchor == "planned" and self.next_due is not None:
            self.last_planned_due = self.next_due.isoformat()

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
        if self.interval_anchor != "completion":
            data["interval_anchor"] = self.interval_anchor
        if self.last_planned_due is not None:
            data["last_planned_due"] = self.last_planned_due
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
            created_at=data.get("created_at"),
            interval_anchor=data.get("interval_anchor", "completion"),
            last_planned_due=data.get("last_planned_due"),
            trigger_config=data.get("trigger_config"),
            notes=data.get("notes"),
            documentation_url=data.get("documentation_url"),
            custom_icon=data.get("custom_icon"),
            nfc_tag_id=data.get("nfc_tag_id"),
            responsible_user_id=data.get("responsible_user_id"),
            checklist=data.get("checklist", []),
            adaptive_config=data.get("adaptive_config"),
            history=data.get("history", []),
        )
