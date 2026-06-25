"""Single source of truth for cross-entry status aggregation.

Both the ``maintenance_supporter/statistics`` WebSocket endpoint (which feeds
the panel KPI chips and the Lovelace card header) and the global summary
sensors compute their counts here, so the numbers can never diverge.
"""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from ..const import CONF_TASKS, DOMAIN, GLOBAL_UNIQUE_ID, MaintenanceStatus

if TYPE_CHECKING:
    from .. import MaintenanceSupporterData

# The status buckets we count. `ok` is included so the dashboard strategy
# headline and a future summary sensor have a single source for it too.
_COUNTED_STATUSES = (
    MaintenanceStatus.OVERDUE,
    MaintenanceStatus.DUE_SOON,
    MaintenanceStatus.TRIGGERED,
    MaintenanceStatus.OK,
)


def get_object_entries(hass: HomeAssistant) -> list[ConfigEntry]:
    """Return all non-global config entries for this domain."""
    return [
        entry
        for entry in hass.config_entries.async_entries(DOMAIN)
        if entry.unique_id != GLOBAL_UNIQUE_ID
    ]


def get_runtime_data(
    hass: HomeAssistant, entry_id: str
) -> MaintenanceSupporterData | None:
    """Get runtime data for a config entry."""
    entry = hass.config_entries.async_get_entry(entry_id)
    if entry is None:
        return None
    return getattr(entry, "runtime_data", None)


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
        total_tasks += sum(
            1
            for td in entry.data.get(CONF_TASKS, {}).values()
            if td.get("archived_at") is None
        )

        rd = get_runtime_data(hass, entry.entry_id)
        coord_data = rd.coordinator.data if rd and rd.coordinator else None
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
