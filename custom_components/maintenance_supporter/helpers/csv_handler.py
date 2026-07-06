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
    DEFAULT_WARNING_DAYS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MAX_CHECKLIST_ITEM_LENGTH,
    MAX_CHECKLIST_ITEMS,
)
from .dates import INTERVAL_UNITS
from .global_options import get_default_warning_days
from .schedule import read_legacy_fields

_LOGGER = logging.getLogger(__name__)

# CSV column order
_COLUMNS = [
    "object_name",
    "object_manufacturer",
    "object_model",
    "object_serial_number",
    "object_area_id",
    "object_installation_date",
    "object_warranty_expiry",
    "task_name",
    "task_type",
    "enabled",
    "schedule_type",
    "interval_days",
    "interval_unit",
    "due_date",
    "interval_anchor",
    "schedule_time",
    "reading_unit",
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
    entries = [entry for entry in hass.config_entries.async_entries(DOMAIN) if entry.unique_id != GLOBAL_UNIQUE_ID]

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
            sched = read_legacy_fields(tdata)
            writer.writerow(
                {
                    "object_name": _csv_safe(obj_data.get("name", "")),
                    "object_manufacturer": _csv_safe(obj_data.get("manufacturer", "")),
                    "object_model": _csv_safe(obj_data.get("model", "")),
                    "object_serial_number": _csv_safe(obj_data.get("serial_number", "")),
                    "object_area_id": obj_data.get("area_id", ""),
                    "object_installation_date": obj_data.get("installation_date", ""),
                    "object_warranty_expiry": obj_data.get("warranty_expiry", ""),
                    "task_name": _csv_safe(tdata.get("name", "")),
                    "task_type": tdata.get("type", "custom"),
                    "enabled": tdata.get("enabled", True),
                    "schedule_type": sched["schedule_type"],
                    "interval_days": sched["interval_days"] if sched["interval_days"] is not None else "",
                    "interval_unit": sched["interval_unit"],
                    "due_date": sched["due_date"] or "",
                    "interval_anchor": sched["interval_anchor"],
                    "schedule_time": tdata.get("schedule_time", ""),
                    "reading_unit": tdata.get("reading_unit", ""),
                    "warning_days": tdata.get("warning_days", DEFAULT_WARNING_DAYS),
                    "last_performed": tdata.get("last_performed", ""),
                    "notes": _csv_safe(tdata.get("notes", "")),
                    "documentation_url": _csv_safe(tdata.get("documentation_url", "")),
                    "custom_icon": _csv_safe(tdata.get("custom_icon", "")),
                    "nfc_tag_id": _csv_safe(tdata.get("nfc_tag_id", "")),
                    "responsible_user_id": _csv_safe(tdata.get("responsible_user_id", "")),
                    "trigger_type": (tdata.get("trigger_config") or {}).get("type", ""),
                    "status": ct.get("_status", "ok"),
                    "times_performed": ct.get("_times_performed", 0),
                    "total_cost": ct.get("_total_cost", 0.0),
                    # Each item is _csv_safe()-prefixed individually so a step
                    # starting with "=" can't trigger a formula in Excel after
                    # the cell is unpacked.
                    "checklist": "\n".join(_csv_safe(item) for item in (tdata.get("checklist") or []) if item),
                }
            )

    return output.getvalue()


# (#67) Per-object CSV columns — one row per maintenance object (asset record).
_OBJECT_RECORD_COLUMNS = [
    "object_name",
    "object_manufacturer",
    "object_model",
    "object_serial_number",
    "object_area_id",
    "object_installation_date",
    "object_warranty_expiry",
    "object_documentation_url",
    "object_notes",
    "task_count",
]


def export_object_records_csv(hass: HomeAssistant) -> str:
    """Export one row per maintenance object (the objects-table download, #67).

    Unlike ``export_objects_csv`` (one row per task, object fields repeated),
    this emits exactly one row per object — including objects that have no
    tasks, which the per-task export skips entirely — and carries the full
    asset field set used by the objects table.
    """
    entries = [entry for entry in hass.config_entries.async_entries(DOMAIN) if entry.unique_id != GLOBAL_UNIQUE_ID]

    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=_OBJECT_RECORD_COLUMNS, extrasaction="ignore")
    writer.writeheader()

    for entry in entries:
        obj_data = entry.data.get(CONF_OBJECT, {})
        static_tasks = entry.data.get(CONF_TASKS, {})
        rd = getattr(entry, "runtime_data", None)
        store = getattr(rd, "store", None) if rd else None
        tasks_data = store.merge_all_tasks(static_tasks) if store is not None else static_tasks
        writer.writerow(
            {
                "object_name": _csv_safe(obj_data.get("name", "")),
                "object_manufacturer": _csv_safe(obj_data.get("manufacturer") or ""),
                "object_model": _csv_safe(obj_data.get("model") or ""),
                "object_serial_number": _csv_safe(obj_data.get("serial_number") or ""),
                "object_area_id": obj_data.get("area_id") or "",
                "object_installation_date": obj_data.get("installation_date") or "",
                "object_warranty_expiry": obj_data.get("warranty_expiry") or "",
                "object_documentation_url": _csv_safe(obj_data.get("documentation_url") or ""),
                "object_notes": _csv_safe(obj_data.get("notes") or ""),
                "task_count": len(tasks_data),
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
                    "installation_date": (row.get("object_installation_date") or "").strip() or None,
                    "warranty_expiry": (row.get("object_warranty_expiry") or "").strip() or None,
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

        interval_unit = (row.get("interval_unit") or "").strip().lower()
        if interval_unit in INTERVAL_UNITS:
            task_data["interval_unit"] = interval_unit

        due_date = (row.get("due_date") or "").strip()
        if due_date and re.fullmatch(r"\d{4}-\d{2}-\d{2}", due_date):
            task_data["due_date"] = due_date

        anchor = (row.get("interval_anchor") or "").strip()
        if anchor in ("planned", "completion"):
            task_data["interval_anchor"] = anchor

        # schedule_time round-trip with strict HH:MM validation; malformed
        # values are dropped silently (consistent with other CSV import fields).
        sched_time = (row.get("schedule_time") or "").strip()
        if sched_time and re.fullmatch(r"^([01]\d|2[0-3]):[0-5]\d$", sched_time):
            task_data["schedule_time"] = sched_time

        reading_unit = (row.get("reading_unit") or "").strip()
        if reading_unit:
            task_data["reading_unit"] = reading_unit[:32]

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
            items = [line.strip()[:MAX_CHECKLIST_ITEM_LENGTH] for line in checklist_raw.splitlines() if line.strip()][
                :MAX_CHECKLIST_ITEMS
            ]
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
