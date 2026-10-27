"""What the coordinator publishes per task: the task, plus what one refresh computed.

The computed fields used to ride inside the task's own dict as ``_status``,
``_days_until_due`` and 30 more ``_``-prefixed keys, read with ``.get`` —
a misspelt key read as None, and mypy could not tell (typing audit
2026-10-25). As attributes, every read is checked.

The values are computed per refresh and never persisted. The per-task
``sensor`` / ``binary_sensor`` update the trigger fields and the status in
place between refreshes (a live trigger flip), so the class is mutable.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, TypedDict

from ..const import MaintenanceStatus, TriggerEntityState
from .shapes import HistoryEntry, IntervalAnalysis, StoredTask


@dataclass(slots=True, kw_only=True)
class TaskResult:
    """One task in the coordinator's data."""

    # The task as ``MaintenanceTask.to_dict`` serializes it, with the Store's
    # dynamic state merged in. Fields only the config entry carries
    # (``notify_enabled``, ``consumes_parts``, ...) are not in it.
    task: StoredTask
    status: str = MaintenanceStatus.OK
    days_until_due: int | None = None
    next_due: str | None = None
    is_done: bool = False
    # The tasks of a paused object, or a paused task (the status twin in
    # helpers.status reads it).
    paused: bool = False
    # The span-capped warning window (#58), for the status twin; None on the
    # inert and degraded results, where it falls back to ``warning_days``.
    warning_days_effective: int | None = None
    # #189: the calendar events behind ``next_due``.
    next_event_titles: list[str] = field(default_factory=list)

    # --- Trigger ---
    trigger_active: bool = False
    trigger_current_value: float | None = None
    trigger_entity_state: str = TriggerEntityState.AVAILABLE
    # Counter in delta mode: the baseline and the progress since it.
    trigger_baseline_value: float | None = None
    trigger_current_delta: float | None = None

    # --- From the history ---
    times_performed: int = 0
    total_cost: float = 0.0
    average_cost: float | None = None
    average_duration: float | None = None
    last_entry: HistoryEntry | None = None

    # --- Adaptive scheduling ---
    suggested_interval: int | None = None
    interval_confidence: str | None = None
    interval_analysis: IntervalAnalysis | None = None

    # --- Sensor-driven predictions ---
    degradation_rate: float | None = None
    degradation_trend: str | None = None
    degradation_r_squared: float | None = None
    degradation_data_points: int | None = None
    # How many prior service cycles the rate learned from (0 = current window only).
    prediction_cycles: int = 0
    days_until_threshold: float | None = None
    threshold_prediction_date: str | None = None
    threshold_prediction_confidence: str | None = None
    sensor_prediction_urgency: bool = False
    environmental_factor: float | None = None
    environmental_entity: str | None = None
    environmental_correlation: float | None = None


class CoordinatorData(TypedDict):
    """``MaintenanceCoordinator.data``."""

    object: dict[str, Any]
    tasks: dict[str, TaskResult]
