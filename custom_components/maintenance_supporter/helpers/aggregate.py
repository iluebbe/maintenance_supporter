"""Single source of truth for cross-entry status aggregation.

Both the ``maintenance_supporter/statistics`` WebSocket endpoint (which feeds
the panel KPI chips and the Lovelace card header) and the global summary
sensors compute their counts here, so the numbers can never diverge.
"""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from ..const import CONF_OBJECT, CONF_TASKS, DOMAIN, GLOBAL_UNIQUE_ID, MaintenanceStatus

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
