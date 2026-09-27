"""Single source of truth for cross-entry status aggregation.

Both the ``maintenance_supporter/statistics`` WebSocket endpoint (which feeds
the panel KPI chips and the Lovelace card header) and the global summary
sensors compute their counts here, so the numbers can never diverge.
"""

from __future__ import annotations

from collections.abc import Iterator, Mapping
from typing import TYPE_CHECKING, Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er

from ..const import (
    CONF_OBJECT,
    CONF_TASKS,
    DEFAULT_TASK_PRIORITY,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MaintenanceStatus,
    TaskPriority,
    slugify_object_name,
    task_unique_id,
)

if TYPE_CHECKING:
    from .. import MaintenanceSupporterData
    from ..storage import MaintenanceStore

# The status buckets we count. `ok` is included so the dashboard strategy
# headline and a future summary sensor have a single source for it too.
_COUNTED_STATUSES = (
    MaintenanceStatus.OVERDUE,
    MaintenanceStatus.DUE_SOON,
    MaintenanceStatus.TRIGGERED,
    MaintenanceStatus.OK,
)

# Sort rank of a task priority — high-priority work first (#134). ONE table
# for the notification manager's daily-limit fairness and the Assist
# "what is due?" ordering, which kept its own inline copy (DRY audit
# 2026-09-26 B). An unknown value ranks like "normal".
PRIORITY_RANK: dict[str, int] = {TaskPriority.HIGH: 0, TaskPriority.NORMAL: 1, TaskPriority.LOW: 2}


def priority_rank(priority: Any) -> int:
    """The :data:`PRIORITY_RANK` of a stored priority value (unset = normal)."""
    return PRIORITY_RANK.get(str(priority or DEFAULT_TASK_PRIORITY), PRIORITY_RANK[TaskPriority.NORMAL])


def is_object_entry(entry: ConfigEntry | None) -> bool:
    """True iff *entry* is one of OUR object entries (not None, not another
    domain's, not the global settings entry).

    The three-part guard was hand-typed at eight sites (WS resolver, the two
    adopt handlers, the service-facing task helpers, the foreign-part
    resolver, …) — one predicate so a future site can't forget a leg.
    """
    return entry is not None and entry.domain == DOMAIN and entry.unique_id != GLOBAL_UNIQUE_ID


def object_name(entry: ConfigEntry) -> str:
    """The object's display name, falling back to the entry title.

    One rule for the ~13 hand-written fallbacks that existed in four spellings
    — half used ``.get("name", title)``, which kept an EMPTY name instead of
    falling through to the title."""
    return str((entry.data.get(CONF_OBJECT) or {}).get("name") or entry.title)


def object_slug(obj_data: Mapping[str, Any]) -> str:
    """The object slug every per-task entity's unique_id is built from.

    THE registration rule of the sensor / binary_sensor / button platforms
    (``name`` as stored, ``"unknown"`` only when the key is missing). The
    registry LOOKUPS of the task sensor (coordinator, list_tasks, the
    notification context, the logbook) each derived it on their own and two
    had drifted — an object with an empty name resolved to no sensor there
    (DRY audit 2026-09-26 B). A non-string name (never registered) reads
    like a missing one instead of raising.
    """
    name = obj_data.get("name", "unknown")
    return slugify_object_name(name if isinstance(name, str) else "unknown")


def task_entity_id(hass: HomeAssistant, slug: str, task_id: str, *, platform: str = "sensor", suffix: str = "") -> str | None:
    """The REGISTERED entity_id of a per-task entity (users rename them), or
    None when the registry does not know it. ``slug`` = :func:`object_slug`."""
    return er.async_get(hass).async_get_entity_id(platform, DOMAIN, task_unique_id(slug, task_id, suffix))


def task_sensor_entity_id(hass: HomeAssistant, obj_data: Mapping[str, Any], task_id: str) -> str | None:
    """The registered entity_id of a task's status sensor, from the object's
    stored data — the one lookup behind every "which sensor is this task?"."""
    return task_entity_id(hass, object_slug(obj_data), task_id)


def merged_tasks(entry: ConfigEntry) -> dict[str, Any]:
    """Merged task data (static ConfigEntry + dynamic Store) for an entry.

    THE read path for task dicts outside the coordinator — it was re-implemented
    eight times, and only one copy overlaid the in-cycle checklist ticks. The
    ticks are overlaid HERE rather than via the Store merge whitelist: merged
    dicts feed MaintenanceTask.from_dict all over the coordinator, and this
    field is presentation state the model never needs. Degrades to the static
    data when the Store is unavailable.
    """
    tasks_data: dict[str, Any] = entry.data.get(CONF_TASKS, {})
    rd = getattr(entry, "runtime_data", None)
    store = getattr(rd, "store", None) if rd else None
    if store is None:
        return tasks_data
    merged: dict[str, Any] = store.merge_all_tasks(tasks_data)
    for tid, td in merged.items():
        progress = store.get_task_state(tid).get("checklist_progress")
        if progress:
            td["checklist_progress"] = progress
    return merged


def get_object_entries(hass: HomeAssistant, entry_ids: set[str] | None = None) -> list[ConfigEntry]:
    """Return all non-global config entries for this domain, optionally
    narrowed to a selection (``entry_ids=None`` means all objects)."""
    return [
        entry
        for entry in hass.config_entries.async_entries(DOMAIN)
        if entry.unique_id != GLOBAL_UNIQUE_ID and (entry_ids is None or entry.entry_id in entry_ids)
    ]


def get_runtime_data(hass: HomeAssistant, entry_id: str) -> MaintenanceSupporterData | None:
    """Get runtime data for a config entry."""
    entry = hass.config_entries.async_get_entry(entry_id)
    if entry is None:
        return None
    return getattr(entry, "runtime_data", None)


def get_store(hass: HomeAssistant, entry_id: str) -> MaintenanceStore | None:
    """The entry's dynamic-state Store, or None when the entry is unknown or
    not loaded (disabled / setup-retry / mid-reload = no runtime_data).

    ``store = getattr(rd, "store", None) if rd else None`` was copied at nine
    WS sites — this is the one spelling."""
    rd = get_runtime_data(hass, entry_id)
    return getattr(rd, "store", None) if rd else None


def get_coordinator_data(hass: HomeAssistant, entry_id: str) -> dict[str, Any] | None:
    """The entry coordinator's live data, or None when it is not loaded."""
    rd = get_runtime_data(hass, entry_id)
    coordinator = getattr(rd, "coordinator", None) if rd else None
    return coordinator.data if coordinator is not None else None


def iter_live_tasks(hass: HomeAssistant, entry_id: str | None = None) -> Iterator[tuple[ConfigEntry, str, dict[str, Any]]]:
    """``(entry, task_id, computed task)`` for every non-archived task of
    every LOADED object (optionally one object only).

    The coordinator's computed payload, so ``_status`` / ``_next_due`` reflect
    the Store rather than stale entry data. An object that is not loaded
    (disabled, setup retry, mid-reload) has no coordinator data and
    contributes nothing. THE cross-object walk behind the ``list_tasks``
    service and the Assist task snapshot, which each carried a copy of it
    (DRY audit 2026-09-26 B).
    """
    for entry in get_object_entries(hass):
        if entry_id is not None and entry.entry_id != entry_id:
            continue
        rd = getattr(entry, "runtime_data", None)
        coordinator = getattr(rd, "coordinator", None) if rd else None
        if coordinator is None or not coordinator.data:
            continue
        for task_id, task in coordinator.data.get(CONF_TASKS, {}).items():
            if str(task.get("_status", "")) == MaintenanceStatus.ARCHIVED:
                continue
            yield entry, task_id, task


def compute_status_counts(hass: HomeAssistant) -> dict[str, Any]:
    """Aggregate task status counts across every maintenance object.

    Status counts come from the live coordinator data (``_status``), which
    already forces disabled tasks to OK. ``total_tasks`` is the configured
    task count (static), matching the historical statistics-endpoint shape.
    """
    counts = {str(s): 0 for s in _COUNTED_STATUSES}
    total_objects = 0
    total_tasks = 0
    total_cost = 0.0

    for entry in get_object_entries(hass):
        total_objects += 1
        # Archived tasks are inert: excluded from the task total and (via their
        # ARCHIVED _status, which isn't a counted bucket) from every status
        # count. Their cost still counts — budget is retained on archive.
        total_tasks += sum(1 for td in entry.data.get(CONF_TASKS, {}).values() if td.get("archived_at") is None)

        coord_data = get_coordinator_data(hass, entry.entry_id)
        for task in (coord_data or {}).get(CONF_TASKS, {}).values():
            status = str(task.get("_status", MaintenanceStatus.OK))
            if status in counts:
                counts[status] += 1
            total_cost += task.get("_total_cost", 0.0) or 0.0

    needs_attention = (
        counts[str(MaintenanceStatus.OVERDUE)]
        + counts[str(MaintenanceStatus.DUE_SOON)]
        + counts[str(MaintenanceStatus.TRIGGERED)]
    )

    return {
        "total_objects": total_objects,
        "total_tasks": total_tasks,
        "overdue": counts[str(MaintenanceStatus.OVERDUE)],
        "due_soon": counts[str(MaintenanceStatus.DUE_SOON)],
        "triggered": counts[str(MaintenanceStatus.TRIGGERED)],
        "ok": counts[str(MaintenanceStatus.OK)],
        "needs_attention": needs_attention,
        "total_cost": round(total_cost, 2),
    }
