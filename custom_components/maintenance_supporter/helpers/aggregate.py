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
from .coordinator_data import task_results

if TYPE_CHECKING:
    from ..models.runtime_data import MaintenanceSupporterData
    from ..models.task_result import CoordinatorData, TaskResult
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


def name_or_title(obj: Mapping[str, Any] | None, title: str) -> str:
    """An object dict's display name, falling back to the entry title — the
    rule of :func:`object_name` for an object dict not written yet (a rename
    on its way into the entry)."""
    return str((obj or {}).get("name") or title)


def object_name(entry: ConfigEntry) -> str:
    """The object's display name, falling back to the entry title.

    One rule for the ~13 hand-written fallbacks that existed in four spellings
    — half used ``.get("name", title)``, which kept an EMPTY name instead of
    falling through to the title."""
    return name_or_title(entry.data.get(CONF_OBJECT), entry.title)


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
    store = store_of(entry)
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


def check_nfc_tag_duplicate(hass: HomeAssistant, nfc_tag_id: str, exclude_task_id: str | None = None) -> str | None:
    """Check if an NFC tag ID is already in use by another task.

    Returns a warning message if duplicate, or None.
    """
    for entry in get_object_entries(hass):
        tasks = entry.data.get(CONF_TASKS, {})
        obj_name = object_name(entry)
        for tid, tdata in tasks.items():
            if tid == exclude_task_id:
                continue
            if tdata.get("nfc_tag_id") == nfc_tag_id:
                return f"NFC tag '{nfc_tag_id}' is already linked to task '{tdata.get('name', tid)}' on object '{obj_name}'"
    return None


def get_runtime_data(hass: HomeAssistant, entry_id: str) -> MaintenanceSupporterData | None:
    """Get runtime data for a config entry."""
    entry = hass.config_entries.async_get_entry(entry_id)
    if entry is None:
        return None
    return getattr(entry, "runtime_data", None)


def store_of(entry: ConfigEntry) -> MaintenanceStore | None:
    """The dynamic-state Store of an entry in hand, or None while it is not
    loaded (disabled / setup-retry / mid-reload = no runtime_data).

    ``store = getattr(rd, "store", None) if rd else None`` was copied at nine
    WS sites (now :func:`get_store`) and at some twenty more that held the
    entry already (DRY audit 2026-10-12) — this is the one spelling. It does
    not reach the Store of an entry being removed (the STORES_CACHE_KEY
    reads do that on purpose)."""
    rd = getattr(entry, "runtime_data", None)
    return getattr(rd, "store", None) if rd else None


def store_or_cached(hass: HomeAssistant, entry: ConfigEntry) -> MaintenanceStore | None:
    """:func:`store_of`, else the Store the cache keeps while the entry
    reloads — the instance the reloaded entry takes up again, so a write made
    meanwhile is kept. A pool owner in the middle of a reload read as gone: a
    borrower's completion consumed nothing and raised a false "spare part no
    longer exists" repair (bug audit 2026-10-17, S-10). None for an entry
    being removed (its cache slot goes first)."""
    from ..const import STORES_CACHE_KEY

    return store_of(entry) or hass.data.get(STORES_CACHE_KEY, {}).get(entry.entry_id)


async def async_store_even_unloaded(hass: HomeAssistant, entry: ConfigEntry) -> MaintenanceStore | None:
    """The entry's Store while it is not loaded too: the copy the store cache
    keeps across reloads, else its file (a disabled object, one in setup
    retry). Through :func:`store_of` alone, an entity rename left such an
    object's counter baselines, runtime hours and to-do mirror records under
    the old id (bug audit 2026-10-17, T-5). None when it never wrote one."""
    store = store_or_cached(hass, entry)
    if store is not None:
        return store
    from ..storage import MaintenanceStore

    disk = MaintenanceStore(hass, entry.entry_id)
    return disk if await disk.async_load() is not None else None


def get_store(hass: HomeAssistant, entry_id: str) -> MaintenanceStore | None:
    """:func:`store_of` by entry id; None for an unknown entry too."""
    entry = hass.config_entries.async_get_entry(entry_id)
    return store_of(entry) if entry is not None else None


def get_coordinator_data(hass: HomeAssistant, entry_id: str) -> CoordinatorData | None:
    """The entry coordinator's live data, or None when it is not loaded."""
    rd = get_runtime_data(hass, entry_id)
    coordinator = getattr(rd, "coordinator", None) if rd else None
    return coordinator.data if coordinator is not None else None


def task_results_of(entry: ConfigEntry) -> dict[str, TaskResult]:
    """The published task results of the entry in hand ({} while it is not
    loaded or before the coordinator's first refresh)."""
    rd = getattr(entry, "runtime_data", None)
    return task_results(getattr(rd, "coordinator", None) if rd else None)


def get_task_results(hass: HomeAssistant, entry_id: str) -> dict[str, TaskResult]:
    """:func:`task_results_of` by entry id; {} for an unknown entry too."""
    entry = hass.config_entries.async_get_entry(entry_id)
    return task_results_of(entry) if entry is not None else {}


def iter_live_tasks(hass: HomeAssistant, entry_id: str | None = None) -> Iterator[tuple[ConfigEntry, str, TaskResult]]:
    """``(entry, task_id, computed result)`` for every non-archived task of
    every LOADED object (optionally one object only).

    The coordinator's computed results, so ``status`` / ``next_due`` reflect
    the Store rather than stale entry data. An object that is not loaded
    (disabled, setup retry, mid-reload) has no coordinator data and
    contributes nothing. THE cross-object walk behind the ``list_tasks``
    service and the Assist task snapshot, which each carried a copy of it
    (DRY audit 2026-09-26 B).
    """
    for entry in get_object_entries(hass):
        if entry_id is not None and entry.entry_id != entry_id:
            continue
        for task_id, result in task_results_of(entry).items():
            if result.status == MaintenanceStatus.ARCHIVED:
                continue
            yield entry, task_id, result


def compute_status_counts(hass: HomeAssistant) -> dict[str, Any]:
    """Aggregate task status counts across every maintenance object.

    Status counts come from the live coordinator data (``status``), which
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
        # ARCHIVED status, which isn't a counted bucket) from every status
        # count. Their cost still counts — budget is retained on archive.
        total_tasks += sum(1 for td in entry.data.get(CONF_TASKS, {}).values() if td.get("archived_at") is None)

        for result in task_results_of(entry).values():
            status = str(result.status)
            if status in counts:
                counts[status] += 1
            total_cost += result.total_cost or 0.0

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


def object_id_for_entry(entry: ConfigEntry) -> str:
    """Return the stable document key for an object entry.

    Documents are keyed by the object's own ``id`` (a uuid hex persisted in the
    entry data) rather than the ``entry_id`` so the association survives
    export/import — an imported object keeps its id but gets a fresh entry_id.
    Falls back to ``entry_id`` only for legacy entries created before object ids
    existed.
    """
    oid = entry.data.get(CONF_OBJECT, {}).get("id")
    return oid if isinstance(oid, str) and oid else entry.entry_id


async def async_commit_store(rd: Any, *, budget: bool = False) -> None:
    """Flush a user-initiated Store write and make it visible NOW.

    Save (never the debounced delay-save — a restart in that window would
    lose the change), optionally rebuild the coordinator's budget cache (a
    history edit moves costs), then ``async_refresh_now`` — a user action
    must never wait for the 10 s refresh debounce.
    """
    await rd.store.async_save()
    coordinator = getattr(rd, "coordinator", None)
    if coordinator is None:
        return
    if budget:
        coordinator.recalculate_budget_cache()
    await coordinator.async_refresh_now()
