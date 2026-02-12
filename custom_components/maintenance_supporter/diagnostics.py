"""Diagnostics support for the Maintenance Supporter integration."""

from __future__ import annotations

from typing import Any

from homeassistant.components.diagnostics import async_redact_data
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import (
    CONF_OBJECT,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MaintenanceStatus,
    TriggerEntityState,
)

# Fields to redact from diagnostics
TO_REDACT = {
    "notes",
    "documentation_url",
    "manufacturer",
    "model",
    "name",
    "notify_service",
}


async def async_get_config_entry_diagnostics(
    hass: HomeAssistant, entry: ConfigEntry
) -> dict[str, Any]:
    """Return diagnostics for a config entry."""
    is_global = entry.unique_id == GLOBAL_UNIQUE_ID

    diag: dict[str, Any] = {
        "entry": {
            "title": entry.title,
            "unique_id": entry.unique_id,
            "version": entry.version,
            "is_global": is_global,
        },
        "data": async_redact_data(entry.data, TO_REDACT),
    }

    if is_global:
        # Global entry diagnostics
        diag["options"] = async_redact_data(
            entry.options or {}, TO_REDACT
        )
        diag["overview"] = _get_integration_overview(hass)
    else:
        # Object entry diagnostics
        diag["statistics"] = _calculate_statistics(entry.data)
        diag["trigger_status"] = _check_trigger_status(hass, entry.data)
        diag["data_quality"] = _check_data_quality(entry.data)

        # Coordinator info
        runtime_data = hass.data.get(DOMAIN, {}).get(entry.entry_id)
        if runtime_data and runtime_data.coordinator:
            coord = runtime_data.coordinator
            diag["coordinator"] = {
                "last_update_success": coord.last_update_success,
                "last_update_success_time": str(
                    getattr(coord, "last_update_success_time", None)
                ),
                "update_interval": str(coord.update_interval),
            }

    return diag


def _get_integration_overview(hass: HomeAssistant) -> dict[str, Any]:
    """Get an overview of all maintenance objects."""
    entries = hass.config_entries.async_entries(DOMAIN)
    objects = [e for e in entries if e.unique_id != GLOBAL_UNIQUE_ID]

    total_tasks = 0
    overdue = 0
    due_soon = 0

    for entry in objects:
        tasks = entry.data.get(CONF_TASKS, {})
        total_tasks += len(tasks)

        runtime_data = hass.data.get(DOMAIN, {}).get(entry.entry_id)
        if runtime_data and runtime_data.coordinator and runtime_data.coordinator.data:
            for task_data in runtime_data.coordinator.data.get("tasks", {}).values():
                status = task_data.get("_status")
                if status == MaintenanceStatus.OVERDUE:
                    overdue += 1
                elif status == MaintenanceStatus.DUE_SOON:
                    due_soon += 1

    return {
        "total_objects": len(objects),
        "total_tasks": total_tasks,
        "overdue_tasks": overdue,
        "due_soon_tasks": due_soon,
    }


def _calculate_statistics(data: dict[str, Any]) -> dict[str, Any]:
    """Calculate statistics for a maintenance object."""
    tasks = data.get(CONF_TASKS, {})

    stats: dict[str, Any] = {
        "total_tasks": len(tasks),
        "enabled_tasks": sum(1 for t in tasks.values() if t.get("enabled", True)),
        "tasks_with_triggers": sum(
            1 for t in tasks.values() if t.get("trigger_config")
        ),
        "tasks_by_type": {},
        "tasks_by_schedule": {},
        "total_history_entries": 0,
    }

    for task in tasks.values():
        # By type
        task_type = task.get("type", "unknown")
        stats["tasks_by_type"][task_type] = (
            stats["tasks_by_type"].get(task_type, 0) + 1
        )

        # By schedule
        schedule = task.get("schedule_type", "unknown")
        stats["tasks_by_schedule"][schedule] = (
            stats["tasks_by_schedule"].get(schedule, 0) + 1
        )

        # History
        stats["total_history_entries"] += len(task.get("history", []))

    return stats


def _check_trigger_status(
    hass: HomeAssistant, data: dict[str, Any]
) -> list[dict[str, Any]]:
    """Check the status of all configured triggers."""
    results = []
    tasks = data.get(CONF_TASKS, {})

    for task_id, task in tasks.items():
        trigger_config = task.get("trigger_config")
        if not trigger_config:
            continue

        entity_id = trigger_config.get("entity_id")
        if not entity_id:
            continue

        state = hass.states.get(entity_id)

        # Determine consolidated entity_health
        if state is None:
            entity_health = TriggerEntityState.MISSING
        elif state.state in ("unavailable", "unknown"):
            entity_health = TriggerEntityState.UNAVAILABLE
        else:
            entity_health = TriggerEntityState.AVAILABLE

        results.append(
            {
                "task_id": task_id,
                "trigger_entity": entity_id,
                "trigger_type": trigger_config.get("type"),
                "entity_available": state is not None,
                "entity_state": state.state if state else None,
                "entity_health": entity_health,
            }
        )

    return results


def _check_data_quality(data: dict[str, Any]) -> list[str]:
    """Check data quality and return warnings."""
    warnings = []

    obj = data.get(CONF_OBJECT, {})
    tasks = data.get(CONF_TASKS, {})

    if not obj.get("name"):
        warnings.append("Object has no name")

    if not tasks:
        warnings.append("Object has no tasks defined")

    for task_id, task in tasks.items():
        if not task.get("name"):
            warnings.append(f"Task {task_id} has no name")

        if task.get("schedule_type") == "time_based" and not task.get("interval_days"):
            warnings.append(
                f"Task '{task.get('name', task_id)}' is time-based but has no interval"
            )

        trigger = task.get("trigger_config")
        if trigger and not trigger.get("entity_id"):
            warnings.append(
                f"Task '{task.get('name', task_id)}' has trigger config but no entity"
            )

    return warnings
