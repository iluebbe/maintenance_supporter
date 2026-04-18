"""Export maintenance data as JSON or YAML."""

from __future__ import annotations

import json
import logging
from pathlib import Path
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import CONF_OBJECT, CONF_TASKS, DOMAIN, GLOBAL_UNIQUE_ID

_LOGGER = logging.getLogger(__name__)


def _build_export_object(
    hass: HomeAssistant,
    entry: ConfigEntry,
    coordinator_data: dict[str, Any] | None,
    include_history: bool,
) -> dict[str, Any]:
    """Build a single object's export dict."""
    obj_data = entry.data.get(CONF_OBJECT, {})
    # Merge static + Store dynamic data for each task
    rd = getattr(entry, "runtime_data", None)
    store = getattr(rd, "store", None) if rd else None
    static_tasks = entry.data.get(CONF_TASKS, {})
    tasks_data = store.merge_all_tasks(static_tasks) if store is not None else static_tasks
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
            "interval_anchor": tdata.get("interval_anchor", "completion"),
            "last_planned_due": tdata.get("last_planned_due"),
            "warning_days": tdata.get("warning_days", 7),
            "last_performed": tdata.get("last_performed"),
            "notes": tdata.get("notes"),
            "documentation_url": tdata.get("documentation_url"),
            "custom_icon": tdata.get("custom_icon"),
            "nfc_tag_id": tdata.get("nfc_tag_id"),
            "responsible_user_id": tdata.get("responsible_user_id"),
            "entity_slug": tdata.get("entity_slug"),
            "adaptive_config": tdata.get("adaptive_config"),
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
            "serial_number": obj_data.get("serial_number"),
            "installation_date": obj_data.get("installation_date"),
        },
        "tasks": tasks,
    }


def build_export_data(
    hass: HomeAssistant,
    include_history: bool = True,
) -> dict[str, Any]:
    """Gather all maintenance data into a plain dict.

    This must be called from the event loop (accesses HA APIs).
    The returned dict contains no HA objects and is safe to
    serialize in an executor thread.
    """
    entries = [
        entry
        for entry in hass.config_entries.async_entries(DOMAIN)
        if entry.unique_id != GLOBAL_UNIQUE_ID
    ]

    objects = []
    for entry in entries:
        rd = getattr(entry, "runtime_data", None)
        coord_data = rd.coordinator.data if rd and rd.coordinator else None
        objects.append(
            _build_export_object(hass, entry, coord_data, include_history)
        )

    return {
        "version": 1,
        "objects": objects,
    }


def serialize_export(data: dict[str, Any], fmt: str = "json") -> str:
    """Serialize an export data dict to a JSON or YAML string.

    Pure function with no HA dependencies — safe to run in an executor.
    """
    if fmt == "yaml":
        try:
            import yaml  # type: ignore[import-untyped]

            return str(yaml.safe_dump(data, default_flow_style=False, allow_unicode=True))
        except ImportError:
            _LOGGER.warning("PyYAML not available, falling back to JSON")
            return json.dumps(data, indent=2, ensure_ascii=False)

    return json.dumps(data, indent=2, ensure_ascii=False)


def serialize_export_to_file(
    data: dict[str, Any], fmt: str, file_path: str
) -> str:
    """Serialize export data and write to a file.

    Pure sync function — safe to run in an executor via
    ``hass.async_add_executor_job``.

    Returns:
        The file path written to.
    """
    content = serialize_export(data, fmt)
    Path(file_path).write_text(content, encoding="utf-8")
    return file_path


def export_maintenance_data(
    hass: HomeAssistant,
    fmt: str = "json",
    include_history: bool = True,
) -> str:
    """Export all maintenance data as a JSON or YAML string.

    Legacy convenience wrapper used by the WebSocket export handler.
    For the service handler, prefer ``build_export_data`` +
    ``serialize_export_to_file`` (via executor) to avoid blocking
    the event loop.
    """
    data = build_export_data(hass, include_history=include_history)
    return serialize_export(data, fmt)
