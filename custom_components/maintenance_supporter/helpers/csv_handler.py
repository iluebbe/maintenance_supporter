"""CSV import/export for maintenance objects and tasks."""

from __future__ import annotations

import csv
import io
import logging
from typing import Any
from uuid import uuid4

from homeassistant.core import HomeAssistant

from ..const import CONF_OBJECT, CONF_TASKS, DOMAIN, GLOBAL_UNIQUE_ID

_LOGGER = logging.getLogger(__name__)

# CSV column order
_COLUMNS = [
    "object_name",
    "object_manufacturer",
    "object_model",
    "object_area_id",
    "task_name",
    "task_type",
    "schedule_type",
    "interval_days",
    "warning_days",
    "last_performed",
    "notes",
    "status",
    "times_performed",
    "total_cost",
]


def export_objects_csv(hass: HomeAssistant) -> str:
    """Export all maintenance objects and tasks as CSV.

    Each row represents one task, with the parent object info repeated.
    """
    entries = [
        entry
        for entry in hass.config_entries.async_entries(DOMAIN)
        if entry.unique_id != GLOBAL_UNIQUE_ID
    ]

    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=_COLUMNS, extrasaction="ignore")
    writer.writeheader()

    for entry in entries:
        obj_data = entry.data.get(CONF_OBJECT, {})
        tasks_data = entry.data.get(CONF_TASKS, {})

        rd = hass.data.get(DOMAIN, {}).get(entry.entry_id)
        coord_data = rd.coordinator.data if rd and rd.coordinator else None
        ct_tasks = (coord_data or {}).get(CONF_TASKS, {})

        for tid, tdata in tasks_data.items():
            ct = ct_tasks.get(tid, {})
            writer.writerow(
                {
                    "object_name": obj_data.get("name", ""),
                    "object_manufacturer": obj_data.get("manufacturer", ""),
                    "object_model": obj_data.get("model", ""),
                    "object_area_id": obj_data.get("area_id", ""),
                    "task_name": tdata.get("name", ""),
                    "task_type": tdata.get("type", "custom"),
                    "schedule_type": tdata.get("schedule_type", "time_based"),
                    "interval_days": tdata.get("interval_days", ""),
                    "warning_days": tdata.get("warning_days", 7),
                    "last_performed": tdata.get("last_performed", ""),
                    "notes": tdata.get("notes", ""),
                    "status": ct.get("_status", "ok"),
                    "times_performed": ct.get("_times_performed", 0),
                    "total_cost": ct.get("_total_cost", 0.0),
                }
            )

    return output.getvalue()


def import_objects_csv(
    csv_content: str,
) -> list[dict[str, Any]]:
    """Parse CSV content into a list of object dicts ready for creation.

    Returns a list of objects, each with 'object' and 'tasks' dicts
    matching the format expected by the config flow.
    """
    reader = csv.DictReader(io.StringIO(csv_content))

    # Group rows by object name
    objects_map: dict[str, dict[str, Any]] = {}

    for row in reader:
        obj_name = (row.get("object_name") or "").strip()
        if not obj_name:
            continue

        if obj_name not in objects_map:
            objects_map[obj_name] = {
                "object": {
                    "id": uuid4().hex,
                    "name": obj_name,
                    "manufacturer": (row.get("object_manufacturer") or "").strip() or None,
                    "model": (row.get("object_model") or "").strip() or None,
                    "area_id": (row.get("object_area_id") or "").strip() or None,
                    "task_ids": [],
                },
                "tasks": {},
            }

        task_name = (row.get("task_name") or "").strip()
        if not task_name:
            continue

        task_id = uuid4().hex
        task_data: dict[str, Any] = {
            "id": task_id,
            "object_id": objects_map[obj_name]["object"]["id"],
            "name": task_name,
            "type": (row.get("task_type") or "custom").strip(),
            "enabled": True,
            "schedule_type": (row.get("schedule_type") or "time_based").strip(),
            "warning_days": _safe_int(row.get("warning_days"), 7),
            "history": [],
        }

        interval = row.get("interval_days", "").strip()
        if interval:
            task_data["interval_days"] = _safe_int(interval, None)

        last_performed = (row.get("last_performed") or "").strip()
        if last_performed:
            task_data["last_performed"] = last_performed

        notes = (row.get("notes") or "").strip()
        if notes:
            task_data["notes"] = notes

        objects_map[obj_name]["tasks"][task_id] = task_data
        objects_map[obj_name]["object"]["task_ids"].append(task_id)

    return list(objects_map.values())


def _safe_int(value: str | None, default: int | None) -> int | None:
    """Safely convert a string to int."""
    if value is None:
        return default
    try:
        return int(float(value))
    except (ValueError, TypeError):
        return default
