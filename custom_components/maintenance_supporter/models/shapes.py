"""The JSON shapes the integration stores and serves, as TypedDicts.

Each class mirrors the interface of the same name in ``frontend-src/types.ts``
(:data:`TS_INTERFACES` maps the ones whose names differ, and
:data:`BACKEND_ONLY_SHAPES` names the ones the panel never receives);
``tests/test_typed_shapes.py`` keeps the key sets of the two sides equal and
checks that every ``.get`` on a name annotated with one of these shapes
asks for a declared key (mypy checks ``d["key"]`` but not ``d.get("key")``).

TypedDicts check nothing at runtime. They describe data AFTER the load
boundary (``MaintenanceStore._sanitize_loaded``, the models' ``from_dict``),
so imported or hand-edited data still needs the existing validation.
"""

from __future__ import annotations

from typing import Any, NotRequired, TypedDict


class ReadingSlot(TypedDict):
    """#161 phase 2: one named reading a ``reading`` task records."""

    id: str
    name: str
    unit: NotRequired[str | None]


class ReadingValue(TypedDict):
    """A slot's value on a completion; name and unit are a snapshot."""

    id: str
    name: str
    unit: NotRequired[str | None]
    value: float


class UsedPart(TypedDict, total=False):
    """#99/#130: one part a completion consumed (entry_id set for pooled)."""

    part_id: str
    name: str
    quantity: float
    entry_id: str
    unit_cost: float
    cost_basis: str


class HistoryEntry(TypedDict):
    """One entry of a task's history (completed, skipped, triggered, ...)."""

    timestamp: str
    type: str
    ref_no: NotRequired[int | None]
    notes: NotRequired[str | None]
    cost: NotRequired[float | None]
    duration: NotRequired[float | None]
    trigger_value: NotRequired[float | None]
    checklist_state: NotRequired[dict[str, bool] | None]
    feedback: NotRequired[str | None]
    completed_by: NotRequired[str | None]
    # The shared device the completion came from (its credit went to
    # completed_by, whoever was on duty).
    completed_via: NotRequired[str | None]
    photo_doc_id: NotRequired[str | None]
    photo_doc_ids: NotRequired[list[str] | None]
    reading_value: NotRequired[float | None]
    reading_values: NotRequired[list[ReadingValue] | None]
    used_parts: NotRequired[list[UsedPart] | None]
    parts_cost: NotRequired[float | None]
    cost_basis: NotRequired[str | None]
    purchase: NotRequired[bool]
    auto: NotRequired[bool]
    phase_id: NotRequired[str | None]
    reset_date: NotRequired[str | None]


class AdaptiveConfig(TypedDict, total=False):
    """A task's adaptive-scheduling settings and learning state."""

    enabled: bool
    ewa_alpha: float
    min_interval_days: int
    max_interval_days: int
    smoothed_interval: float
    feedback_count: int
    seasonal_enabled: bool
    seasonal_overrides: dict[Any, float] | None
    sensor_prediction_enabled: bool
    environmental_entity: str | None
    environmental_attribute: str | None


class IntervalAnalysis(TypedDict):
    """The adaptive analysis of one refresh, as the panel reads it."""

    average_actual: float | None
    ewa_prediction: float | None
    weibull_beta: float | None
    weibull_eta: float | None
    weibull_r_squared: float | None
    confidence_interval_low: int | None
    confidence_interval_high: int | None
    data_points: int
    reason: str | None
    seasonal_factor: float | None
    seasonal_factors: list[float] | None
    seasonal_reason: str | None


class CompleteWhen(TypedDict):
    """D#229: the entity whose change to a state completes the due task.
    D#240: ``any_time`` completes it when it is not due as well, and
    ``for_minutes`` wants the state to hold that long first."""

    entity_id: str
    to_state: str
    any_time: NotRequired[bool]
    for_minutes: NotRequired[int]


class ScheduleEnds(TypedDict, total=False):
    """Finite-series end condition: after N completions and/or past a date."""

    count: int
    until: str


class TaskSchedule(TypedDict, total=False):
    """The nested recurrence object (schedule-model v2), ``Schedule.to_dict``."""

    kind: str
    every: int | None
    unit: str
    anchor: str
    due_date: str | None
    weekdays: list[int]
    nth: int
    weekday: int
    day: int
    months: list[int]
    business: bool
    entity_id: str | None
    offset: int
    season_months: list[int]
    ends: ScheduleEnds


class TriggerConfig(TypedDict, total=False):
    """A sensor trigger; which keys apply depends on ``type``.

    Backend-only keys: ``_trigger_state``, the transient read model
    ``MaintenanceStore.merge_task_data`` rebuilds from the stored runtime;
    and the flat runtime keys of configs from before the Store
    (``trigger_accumulated_seconds``, ``trigger_change_count``,
    ``trigger_on_since``), split off into the Store on first setup and still
    read as a fallback.
    """

    type: str
    entity_id: str
    entity_ids: list[str]
    entity_logic: str
    attribute: str | None
    trigger_above: float | None
    trigger_below: float | None
    trigger_equals: float | None
    trigger_not_equals: float | None
    trigger_combinator: str
    trigger_for_minutes: float
    trigger_target_value: float
    trigger_delta_mode: bool
    trigger_baseline_value: float | None
    trigger_from_state: str | None
    trigger_to_state: str | None
    trigger_target_changes: int
    trigger_hold_until_done: bool
    trigger_runtime_hours: float
    trigger_days_before: int
    trigger_runtime_max_session_seconds: int
    trigger_on_states: list[str]
    compound_logic: str
    conditions: list[TriggerConfig]
    auto_complete_on_recovery: bool
    detail_attribute: str | None
    _trigger_state: dict[str, Any]
    trigger_accumulated_seconds: float
    trigger_change_count: int
    trigger_on_since: str | None


class StoredTask(TypedDict, total=False):
    """A task as ``entry.data[CONF_TASKS][task_id]`` holds it, with the
    dynamic fields the Store lays over it (``MaintenanceStore.merge_task_data``)
    and the in-cycle ticks ``helpers.aggregate.merged_tasks`` adds. Every key
    is optional: an imported or hand-edited task can lack any of them, and
    the flat recurrence keys of old entries survive until
    ``normalize_task_storage`` folds them into ``schedule``.

    Backend only: the panel never sees this dict, it gets the WS task
    summary (``MaintenanceTask`` in types.ts)."""

    id: str
    object_id: str
    name: str
    type: str
    enabled: bool
    created_at: str | None
    ref_no: int | None
    entity_slug: str
    origin: dict[str, str] | None
    # When: the recurrence, the trigger, the completion window
    schedule: TaskSchedule
    warning_days: int
    earliest_completion_days: int | None
    schedule_time: str | None
    trigger_config: TriggerConfig | None
    complete_when: CompleteWhen | None
    # The flat recurrence of old entries (schedule.read_legacy_fields)
    schedule_type: str
    interval_days: int | None
    interval_unit: str
    interval_anchor: str
    due_date: str | None
    # Dynamic: kept in the Store (storage._DYNAMIC_TASK_FIELDS)
    last_performed: str | None
    last_planned_due: str | None
    planned_day: int | None
    due_override: str | None
    history: list[HistoryEntry]
    adaptive_config: AdaptiveConfig | None
    phase_cursor: int
    # Split into the Store, laid over by merged_tasks (storage._SPLIT_ONLY_TASK_FIELDS)
    checklist_progress: dict[str, bool]
    battery_replacements: dict[str, dict[str, Any]]
    battery_low_latch: dict[str, dict[str, Any]]
    battery_installed_cells: dict[str, str]
    next_history_ref: int
    # What the work is
    notes: str | None
    documentation_url: str | None
    custom_icon: str | None
    priority: str
    labels: list[str]
    checklist: list[str]
    phases: dict[str, Any] | None
    phase_sequence: list[str]
    reading_unit: str | None
    readings: list[ReadingSlot]
    # Who does it
    responsible_user_id: str | None
    assignee_pool: list[str]
    rotation_strategy: str | None
    # Completing it
    nfc_tag_id: str | None
    require_tag_scan: bool
    allow_skip: bool
    required_completion_fields: list[str]
    on_complete_action: dict[str, Any] | None
    quick_complete_defaults: dict[str, Any] | None
    consumes_parts: list[dict[str, Any]]
    part_ref: dict[str, str]
    # Notifications and to-do lists
    notify_enabled: bool
    notify_icon: str | None
    mirror_todo_entities: list[str]
    mirror_todo_use_default: bool
    # Retired or paused
    archived_at: str | None
    archived_reason: str | None
    paused_at: str | None
    paused_until: str | None
    # The battery fleet's one task (const.BATTERY_FLEET_TASK_FLAG)
    battery_fleet_task: bool


# Python shape -> TypeScript interface, where the names differ.
TS_INTERFACES: dict[str, str] = {}

# Shapes the frontend never receives (no interface in types.ts).
BACKEND_ONLY_SHAPES: frozenset[str] = frozenset({"StoredTask"})

# Keys only the backend has, per shape (with the reason in the docstring).
BACKEND_ONLY_KEYS: dict[str, frozenset[str]] = {
    "TriggerConfig": frozenset(
        {"_trigger_state", "trigger_accumulated_seconds", "trigger_change_count", "trigger_on_since"}
    ),
}
