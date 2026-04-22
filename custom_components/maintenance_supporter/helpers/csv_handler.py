"""CSV import/export for maintenance objects and tasks."""

from __future__ import annotations

import csv
import io
import logging
import re
from typing import Any
from uuid import uuid4

from homeassistant.core import HomeAssistant

from ..const import (
    CONF_OBJECT,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MAX_CHECKLIST_ITEM_LENGTH,
    MAX_CHECKLIST_ITEMS,
)
from .global_options import get_default_warning_days

_LOGGER = logging.getLogger(__name__)

# CSV column order
_COLUMNS = [
    "object_name",
    "object_manufacturer",
    "object_model",
    "object_serial_number",
    "object_area_id",
    "task_name",
    "task_type",
    "enabled",
    "schedule_type",
    "interval_days",
    "interval_anchor",
    "schedule_time",
    "warning_days",
    "last_performed",
    "notes",
    "documentation_url",
    "custom_icon",
    "nfc_tag_id",
    "responsible_user_id",
    "trigger_type",
    "status",
    "times_performed",
    "total_cost",
    # Checklist exported as a single cell with steps separated by literal "\n".
    # The csv module handles the embedded newlines via RFC 4180 field quoting.
    "checklist",
]


def _csv_safe(val: str) -> str:
    """Prefix cells that start with formula-triggering characters to mitigate CSV injection."""
    if val and val[0] in ("=", "+", "-", "@"):
        return "\t" + val
    return val


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
        # Merge static + Store dynamic data
        rd = getattr(entry, "runtime_data", None)
        store = getattr(rd, "store", None) if rd else None
        static_tasks = entry.data.get(CONF_TASKS, {})
        tasks_data = store.merge_all_tasks(static_tasks) if store is not None else static_tasks

        rd = getattr(entry, "runtime_data", None)
        coord_data = rd.coordinator.data if rd and rd.coordinator else None
        ct_tasks = (coord_data or {}).get(CONF_TASKS, {})

        for tid, tdata in tasks_data.items():
            ct = ct_tasks.get(tid, {})
            writer.writerow(
                {
                    "object_name": _csv_safe(obj_data.get("name", "")),
                    "object_manufacturer": _csv_safe(obj_data.get("manufacturer", "")),
                    "object_model": _csv_safe(obj_data.get("model", "")),
                    "object_serial_number": _csv_safe(obj_data.get("serial_number", "")),
                    "object_area_id": obj_data.get("area_id", ""),
                    "task_name": _csv_safe(tdata.get("name", "")),
                    "task_type": tdata.get("type", "custom"),
                    "enabled": tdata.get("enabled", True),
                    "schedule_type": tdata.get("schedule_type", "time_based"),
                    "interval_days": tdata.get("interval_days", ""),
                    "interval_anchor": tdata.get("interval_anchor", "completion"),
                    "schedule_time": tdata.get("schedule_time", ""),
                    "warning_days": tdata.get("warning_days", 7),
                    "last_performed": tdata.get("last_performed", ""),
                    "notes": _csv_safe(tdata.get("notes", "")),
                    "documentation_url": _csv_safe(tdata.get("documentation_url", "")),
                    "custom_icon": _csv_safe(tdata.get("custom_icon", "")),
                    "nfc_tag_id": tdata.get("nfc_tag_id", ""),
                    "responsible_user_id": tdata.get("responsible_user_id", ""),
                    "trigger_type": (tdata.get("trigger_config") or {}).get("type", ""),
                    "status": ct.get("_status", "ok"),
                    "times_performed": ct.get("_times_performed", 0),
                    "total_cost": ct.get("_total_cost", 0.0),
                    # Each item is _csv_safe()-prefixed individually so a step
                    # starting with "=" can't trigger a formula in Excel after
                    # the cell is unpacked.
                    "checklist": "\n".join(
                        _csv_safe(item) for item in tdata.get("checklist", []) if item
                    ),
                }
            )

    return output.getvalue()


def import_objects_csv(
    csv_content: str,
    hass: HomeAssistant | None = None,
) -> list[dict[str, Any]]:
    """Parse CSV content into a list of object dicts ready for creation.

    When *hass* is supplied, missing per-row ``warning_days`` columns fall back
    to the integration-wide default from the global config entry. Without
    *hass* (e.g. in unit tests that exercise the parser in isolation), the
    bare constant ``7`` is used.

    Returns a list of objects, each with 'object' and 'tasks' dicts
    matching the format expected by the config flow.
    """
    default_warning_days = get_default_warning_days(hass) if hass is not None else 7
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
                    "serial_number": (row.get("object_serial_number") or "").strip() or None,
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
            "warning_days": _safe_int(row.get("warning_days"), default_warning_days),
            "history": [],
        }

        interval = row.get("interval_days", "").strip()
        if interval:
            task_data["interval_days"] = _safe_int(interval, None)

        anchor = (row.get("interval_anchor") or "").strip()
        if anchor in ("planned", "completion"):
            task_data["interval_anchor"] = anchor

        # schedule_time round-trip with strict HH:MM validation; malformed
        # values are dropped silently (consistent with other CSV import fields).
        sched_time = (row.get("schedule_time") or "").strip()
        if sched_time and re.fullmatch(r"^([01]\d|2[0-3]):[0-5]\d$", sched_time):
            task_data["schedule_time"] = sched_time

        last_performed = (row.get("last_performed") or "").strip()
        if last_performed:
            task_data["last_performed"] = last_performed

        notes = (row.get("notes") or "").strip()
        if notes:
            task_data["notes"] = notes

        # Optional fields (backwards-compatible — missing columns default to empty)
        if (row.get("enabled") or "").strip().lower() == "false":
            task_data["enabled"] = False
        doc_url = (row.get("documentation_url") or "").strip()
        if doc_url:
            from urllib.parse import urlparse
            scheme = urlparse(doc_url).scheme.lower()
            if scheme in ("", "http", "https"):
                task_data["documentation_url"] = doc_url
        custom_icon = (row.get("custom_icon") or "").strip()
        if custom_icon:
            task_data["custom_icon"] = custom_icon
        nfc_tag = (row.get("nfc_tag_id") or "").strip()
        if nfc_tag:
            task_data["nfc_tag_id"] = nfc_tag
        resp_user = (row.get("responsible_user_id") or "").strip()
        if resp_user:
            task_data["responsible_user_id"] = resp_user

        # Checklist round-trips via a single cell with "\n" between items.
        # Apply the same hard caps as the WebSocket schema so a malicious or
        # accidental CSV can't bloat the entry.
        checklist_raw = row.get("checklist") or ""
        if checklist_raw:
            items = [
                line.strip()[:MAX_CHECKLIST_ITEM_LENGTH]
                for line in checklist_raw.splitlines()
                if line.strip()
            ][:MAX_CHECKLIST_ITEMS]
            if items:
                task_data["checklist"] = items

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
