"""Export maintenance data as JSON or YAML."""

from __future__ import annotations

import json
import logging
from typing import Any

from homeassistant.core import HomeAssistant

from .const import CONF_OBJECT, CONF_TASKS, DOMAIN, GLOBAL_UNIQUE_ID

_LOGGER = logging.getLogger(__name__)


def _build_export_object(
    hass: HomeAssistant,
    entry,
    coordinator_data: dict | None,
    include_history: bool,
) -> dict[str, Any]:
    """Build a single object's export dict."""
    obj_data = entry.data.get(CONF_OBJECT, {})
    tasks_data = entry.data.get(CONF_TASKS, {})
    ct_tasks = (coordinator_data or {}).get(CONF_TASKS, {})

    tasks = []
    for tid, tdata in tasks_data.items():
        ct = ct_tasks.get(tid, {})
        task: dict[str, Any] = {
            "id": tid,
            "name": tdata.get("name", ""),
            "type": tdata.get("type", "custom"),
            "enabled": tdata.get("enabled", True),
            "schedule_type": tdata.get("schedule_type", "time_based"),
            "interval_days": tdata.get("interval_days"),
            "warning_days": tdata.get("warning_days", 7),
            "last_performed": tdata.get("last_performed"),
            "notes": tdata.get("notes"),
            "documentation_url": tdata.get("documentation_url"),
            "checklist": tdata.get("checklist", []),
            "status": ct.get("_status", "ok"),
            "days_until_due": ct.get("_days_until_due"),
            "next_due": ct.get("_next_due"),
            "times_performed": ct.get("_times_performed", 0),
            "total_cost": ct.get("_total_cost", 0.0),
            "average_duration": ct.get("_average_duration"),
        }

        trigger_config = tdata.get("trigger_config")
        if trigger_config:
            task["trigger_config"] = trigger_config

        if include_history:
            task["history"] = tdata.get("history", [])

        tasks.append(task)

    return {
        "entry_id": entry.entry_id,
        "object": {
            "name": obj_data.get("name", ""),
            "area_id": obj_data.get("area_id"),
            "manufacturer": obj_data.get("manufacturer"),
            "model": obj_data.get("model"),
            "installation_date": obj_data.get("installation_date"),
        },
        "tasks": tasks,
    }


def export_maintenance_data(
    hass: HomeAssistant,
    fmt: str = "json",
    include_history: bool = True,
) -> str:
    """Export all maintenance data as a JSON or YAML string.

    Args:
        hass: Home Assistant instance.
        fmt: Output format — "json" or "yaml".
        include_history: Whether to include task history entries.

    Returns:
        Serialized string in the requested format.
    """
    entries = [
        entry
        for entry in hass.config_entries.async_entries(DOMAIN)
        if entry.unique_id != GLOBAL_UNIQUE_ID
    ]

    objects = []
    for entry in entries:
        rd = hass.data.get(DOMAIN, {}).get(entry.entry_id)
        coord_data = rd.coordinator.data if rd and rd.coordinator else None
        objects.append(
            _build_export_object(hass, entry, coord_data, include_history)
        )

    data: dict[str, Any] = {
        "version": 1,
        "objects": objects,
    }

    if fmt == "yaml":
        try:
            import yaml  # noqa: PLC0415

            return yaml.safe_dump(data, default_flow_style=False, allow_unicode=True)
        except ImportError:
            _LOGGER.warning("PyYAML not available, falling back to JSON")
            return json.dumps(data, indent=2, ensure_ascii=False)

    return json.dumps(data, indent=2, ensure_ascii=False)
