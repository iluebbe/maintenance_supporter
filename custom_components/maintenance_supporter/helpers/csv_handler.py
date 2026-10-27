"""CSV import/export for maintenance objects and tasks."""

from __future__ import annotations

import csv
import io
import json
import logging
from typing import Any
from uuid import uuid4

from homeassistant.core import HomeAssistant

from ..const import (
    ARCHIVE_REASON_OBJECT,
    CONF_OBJECT,
    CONF_OBJECT_PLACE,
    CONF_OBJECT_REMIND_ON_SITE,
    DEFAULT_TASK_PRIORITY,
    DEFAULT_WARNING_DAYS,
)
from ..models.task_result import TaskResult
from .aggregate import merged_tasks, task_results_of
from .dates import INTERVAL_UNITS, import_day, normalize_hhmm, parse_iso_date
from .global_options import get_default_warning_days
from .pause import pause_end_day, write_anchor
from .reading_slots import parse_reading_slots_text, reading_slots_text
from .schedule import Schedule, read_legacy_fields
from .task_fields import import_due_date, import_interval_days, import_warning_days

_LOGGER = logging.getLogger(__name__)

# CSV column order
_COLUMNS = [
    # Bug audit 2026-09-27: the source object's entry id keys the rows of ONE
    # object — grouping by name merged a replaced pair (same name) into one
    # object, the archived predecessor's tasks coming back active. With the
    # archive marker and the predecessor it also carries the replace lineage
    # (remapped to the new ids on import). Old CSVs without these columns
    # still group by name.
    "object_entry_id",
    "object_archived_at",
    "object_predecessor_entry_id",
    "object_name",
    "object_manufacturer",
    "object_model",
    "object_serial_number",
    "object_area_id",
    "object_installation_date",
    "object_warranty_expiry",
    # The 2026-08 round-trip audit: the IMPORT read these two from day one,
    # but the export never wrote the columns — a CSV migration silently
    # dropped object notes + documentation URL.
    "object_documentation_url",
    "object_notes",
    # The object's place (a zone) and the on-site reminder: a CSV round trip
    # dropped both (DRY audit 2026-10-12, BI5-A11).
    "object_place",
    "object_remind_on_site",
    "task_name",
    "task_type",
    "enabled",
    # A task's own archive / pause: a round trip brought retired and paused
    # tasks back live (bug audit 2026-10-16, F7).
    "task_archived_at",
    "task_paused_at",
    "task_paused_until",
    "schedule_type",
    "interval_days",
    "interval_unit",
    "due_date",
    "interval_anchor",
    # Bug audit 2026-09-27: the nested recurrence as JSON — the flat columns
    # above cannot express a calendar kind (a day-of-month task came back as
    # "manual", never due), a seasonal window or a series end. The flat
    # cells stay (and win for an interval edited in a spreadsheet).
    "schedule",
    "schedule_time",
    "reading_unit",
    # #161 phase 2: reading slots, one "Name | Unit" per line (ids are
    # regenerated on import — a CSV round-trip creates new tasks anyway).
    "readings",
    "warning_days",
    "last_performed",
    "notes",
    "documentation_url",
    "custom_icon",
    "nfc_tag_id",
    "responsible_user_id",
    # #134 audit: priority routes notifications/filters and labels drive views
    # — a CSV migration losing them silently was the object_notes class again.
    "priority",
    "labels",
    "trigger_type",
    "status",
    "times_performed",
    "total_cost",
    # Checklist exported as a single cell with steps separated by literal "\n".
    # The csv module handles the embedded newlines via RFC 4180 field quoting.
    "checklist",
]


def _csv_safe(val: str | None) -> str:
    """Prefix cells that start with formula-triggering characters to mitigate
    CSV injection. A field stored as null is an empty cell."""
    if not val:
        return ""
    if val[0] in ("=", "+", "-", "@"):
        return "\t" + val
    return val


def export_objects_csv(hass: HomeAssistant, entry_ids: set[str] | None = None) -> str:
    """Export maintenance objects and tasks as CSV (all, or a selection).

    Each row represents one task, with the parent object info repeated.
    """
    from ..export import object_entries

    entries = object_entries(hass, entry_ids)

    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=_COLUMNS, extrasaction="ignore")
    writer.writeheader()

    for entry in entries:
        obj_data = entry.data.get(CONF_OBJECT, {})
        # Merge static + Store dynamic data
        tasks_data = merged_tasks(entry)

        ct_tasks = task_results_of(entry)

        object_row = {
            "object_entry_id": entry.entry_id,
            "object_archived_at": _csv_safe(str(obj_data.get("archived_at") or "")),
            "object_predecessor_entry_id": _csv_safe(str(obj_data.get("predecessor_entry_id") or "")),
            "object_name": _csv_safe(obj_data.get("name", "")),
            "object_manufacturer": _csv_safe(obj_data.get("manufacturer", "")),
            "object_model": _csv_safe(obj_data.get("model", "")),
            "object_serial_number": _csv_safe(obj_data.get("serial_number", "")),
            "object_area_id": _csv_safe(obj_data.get("area_id", "")),
            "object_installation_date": _csv_safe(obj_data.get("installation_date", "")),
            "object_warranty_expiry": _csv_safe(obj_data.get("warranty_expiry", "")),
            "object_documentation_url": _csv_safe(obj_data.get("documentation_url") or ""),
            "object_notes": _csv_safe(obj_data.get("notes") or ""),
            "object_place": _csv_safe(str(obj_data.get(CONF_OBJECT_PLACE) or "")),
            "object_remind_on_site": "true" if obj_data.get(CONF_OBJECT_REMIND_ON_SITE) is True else "",
        }
        # An object without tasks still gets its row: it was left out, and
        # the import never created it (bug audit 2026-10-16, F7).
        if not tasks_data:
            writer.writerow(object_row)

        for tid, tdata in tasks_data.items():
            ct = ct_tasks.get(tid) or TaskResult(task={})
            sched = read_legacy_fields(tdata)
            writer.writerow(
                {
                    **object_row,
                    "task_name": _csv_safe(tdata.get("name", "")),
                    # Free text over the WS API ("=HYPERLINK(…)" was exported
                    # raw — bug audit 2026-09-26); the dates were only
                    # length-checked on the service path until then too.
                    "task_type": _csv_safe(str(tdata.get("type") or "custom")),
                    "enabled": tdata.get("enabled", True),
                    # Only the task's OWN archive: one archived with its object
                    # comes back through the object's column.
                    "task_archived_at": _csv_safe(str(tdata.get("archived_at") or "")) if tdata.get("archived_reason") != ARCHIVE_REASON_OBJECT else "",
                    "task_paused_at": _csv_safe(str(tdata.get("paused_at") or "")),
                    "task_paused_until": _csv_safe(str(tdata.get("paused_until") or "")),
                    "schedule_type": sched["schedule_type"],
                    "interval_days": sched["interval_days"] if sched["interval_days"] is not None else "",
                    "interval_unit": sched["interval_unit"],
                    "due_date": _csv_safe(str(sched["due_date"] or "")),
                    "interval_anchor": sched["interval_anchor"],
                    "schedule": json.dumps(Schedule.parse(tdata).to_dict(), separators=(",", ":")),
                    "schedule_time": tdata.get("schedule_time", ""),
                    "reading_unit": _csv_safe(tdata.get("reading_unit", "")),
                    "readings": "\n".join(_csv_safe(line) for line in reading_slots_text(tdata.get("readings")).splitlines()),
                    "warning_days": tdata.get("warning_days", DEFAULT_WARNING_DAYS),
                    "last_performed": _csv_safe(str(tdata.get("last_performed") or "")),
                    "notes": _csv_safe(tdata.get("notes", "")),
                    "documentation_url": _csv_safe(tdata.get("documentation_url", "")),
                    "custom_icon": _csv_safe(tdata.get("custom_icon", "")),
                    "nfc_tag_id": _csv_safe(tdata.get("nfc_tag_id", "")),
                    "responsible_user_id": _csv_safe(tdata.get("responsible_user_id", "")),
                    "priority": tdata.get("priority") or DEFAULT_TASK_PRIORITY,
                    # Labels ride one cell, "\n"-separated like the checklist.
                    "labels": "\n".join(_csv_safe(lb) for lb in (tdata.get("labels") or []) if lb),
                    "trigger_type": (tdata.get("trigger_config") or {}).get("type", ""),
                    "status": ct.status,
                    "times_performed": ct.times_performed,
                    "total_cost": ct.total_cost,
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
    # #225: the object it sits inside, by name.
    "object_parent",
    "object_manufacturer",
    "object_model",
    "object_serial_number",
    "object_area_id",
    "object_installation_date",
    "object_warranty_expiry",
    "object_documentation_url",
    "object_notes",
    "object_place",
    "object_remind_on_site",
    "task_count",
]


def export_object_records_csv(hass: HomeAssistant, entry_ids: set[str] | None = None) -> str:
    """Export one row per maintenance object (the objects-table download, #67).

    Unlike ``export_objects_csv`` (one row per task, object fields repeated),
    this emits exactly one row per object — including objects that have no
    tasks, which the per-task export skips entirely — and carries the full
    asset field set used by the objects table. ``entry_ids`` narrows to a
    selection (None = all).
    """
    from ..export import object_entries

    entries = object_entries(hass, entry_ids)

    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=_OBJECT_RECORD_COLUMNS, extrasaction="ignore")
    writer.writeheader()

    for entry in entries:
        obj_data = entry.data.get(CONF_OBJECT, {})
        tasks_data = merged_tasks(entry)
        parent_id = obj_data.get("parent_entry_id")
        parent = hass.config_entries.async_get_entry(parent_id) if parent_id else None
        writer.writerow(
            {
                "object_name": _csv_safe(obj_data.get("name", "")),
                "object_parent": _csv_safe((parent.data.get(CONF_OBJECT) or {}).get("name") or "") if parent is not None else "",
                "object_manufacturer": _csv_safe(obj_data.get("manufacturer") or ""),
                "object_model": _csv_safe(obj_data.get("model") or ""),
                "object_serial_number": _csv_safe(obj_data.get("serial_number") or ""),
                "object_area_id": _csv_safe(obj_data.get("area_id") or ""),
                "object_installation_date": _csv_safe(obj_data.get("installation_date") or ""),
                "object_warranty_expiry": _csv_safe(obj_data.get("warranty_expiry") or ""),
                "object_documentation_url": _csv_safe(obj_data.get("documentation_url") or ""),
                "object_notes": _csv_safe(obj_data.get("notes") or ""),
                "object_place": _csv_safe(str(obj_data.get(CONF_OBJECT_PLACE) or "")),
                "object_remind_on_site": "true" if obj_data.get(CONF_OBJECT_REMIND_ON_SITE) is True else "",
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
    matching the format expected by the config flow. A row set with the
    ``object_entry_id`` column also carries the source ``entry_id``, the
    archive marker and the (source) ``predecessor_entry_id`` — the importer
    remaps those to the new entry ids — and per-object ``warnings`` for
    values that were dropped.
    """
    from homeassistant.util import dt as dt_util

    from ..const import ARCHIVE_REASON_MANUAL

    default_warning_days = get_default_warning_days(hass) if hass is not None else 7
    today = dt_util.now().date()
    # A spreadsheet's "CSV UTF-8" save starts with a byte-order mark, which
    # would otherwise glue itself to the first header cell.
    text = csv_content.lstrip("\ufeff")
    # A spreadsheet set to a comma-decimal language saves with semicolons:
    # the whole header became one column and the import found no object
    # (bug audit 2026-10-16, F6).
    header = text.split("\n", 1)[0]
    delimiter = ";" if header.count(";") > header.count(",") else ","
    reader = csv.DictReader(io.StringIO(text), delimiter=delimiter)

    # Group rows by the source object (its entry id), or — for a CSV written
    # before that column existed — by object name.
    objects_map: dict[str, dict[str, Any]] = {}

    for row in reader:
        obj_name = (row.get("object_name") or "").strip()
        if not obj_name:
            continue
        source_id = (row.get("object_entry_id") or "").strip()
        group = f"id:{source_id}" if source_id else f"name:{obj_name}"

        if group not in objects_map:
            archived_at = (row.get("object_archived_at") or "").strip().lstrip("\t")
            predecessor = (row.get("object_predecessor_entry_id") or "").strip()
            obj_warnings: list[str] = []
            objects_map[group] = {
                "entry_id": source_id or None,
                "warnings": obj_warnings,
                "object": {
                    "id": uuid4().hex,
                    "name": obj_name,
                    "manufacturer": (row.get("object_manufacturer") or "").strip() or None,
                    "model": (row.get("object_model") or "").strip() or None,
                    "serial_number": (row.get("object_serial_number") or "").strip() or None,
                    "area_id": (row.get("object_area_id") or "").strip() or None,
                    "installation_date": import_day(
                        (row.get("object_installation_date") or "").strip(), f"{obj_name}: installation date", obj_warnings
                    ),
                    "warranty_expiry": import_day(
                        (row.get("object_warranty_expiry") or "").strip(), f"{obj_name}: warranty expiry", obj_warnings
                    ),
                    # In the object-CSV export columns but never read back on
                    # import until now (round-trip gap, audit 2026-07-11).
                    "documentation_url": (row.get("object_documentation_url") or "").strip() or None,
                    "notes": (row.get("object_notes") or "").strip() or None,
                    # Only a zone is a place (what the place picker offers).
                    CONF_OBJECT_PLACE: place if (place := (row.get("object_place") or "").strip()).startswith("zone.") else None,
                    CONF_OBJECT_REMIND_ON_SITE: (row.get("object_remind_on_site") or "").strip().lower() == "true",
                    "archived_at": archived_at if _is_iso_moment(archived_at) else None,
                    "predecessor_entry_id": predecessor or None,
                    "task_ids": [],
                },
                "tasks": {},
            }
        current = objects_map[group]

        task_name = (row.get("task_name") or "").strip()
        if not task_name:
            continue

        task_id = uuid4().hex
        task_data: dict[str, Any] = {
            "id": task_id,
            "object_id": current["object"]["id"],
            "name": task_name,
            "type": (row.get("task_type") or "custom").strip(),
            "enabled": True,
            "schedule_type": (row.get("schedule_type") or "time_based").strip(),
            "warning_days": import_warning_days(row.get("warning_days"), default_warning_days),
            "history": [],
        }

        # The JSON import's rules (helpers.task_fields, BI5-A10).
        interval = import_interval_days((row.get("interval_days") or "").strip())
        if interval is not None:
            task_data["interval_days"] = interval

        interval_unit = (row.get("interval_unit") or "").strip().lower()
        if interval_unit in INTERVAL_UNITS:
            task_data["interval_unit"] = interval_unit

        due_date = import_due_date(row.get("due_date"))
        if due_date is not None:
            task_data["due_date"] = due_date

        anchor = (row.get("interval_anchor") or "").strip()
        if anchor in ("planned", "completion"):
            task_data["interval_anchor"] = anchor

        # The nested recurrence (calendar kinds, season, series end). The
        # flat cells above stay alongside: normalize_task_storage keeps a
        # calendar kind authoritative and lets edited flat interval cells win
        # over an interval schedule while keeping its extras.
        schedule_raw = (row.get("schedule") or "").strip()
        if schedule_raw:
            try:
                parsed_schedule = json.loads(schedule_raw)
                if isinstance(parsed_schedule, dict):
                    task_data["schedule"] = Schedule.from_dict(parsed_schedule).to_dict()
            except (ValueError, TypeError, KeyError, AttributeError):
                current["warnings"].append(f"{task_name}: unreadable schedule cell — the flat columns were used")

        # schedule_time round-trip, canonical HH:MM ("HH:MM:SS" from the
        # options flow folds); malformed values are dropped silently
        # (consistent with other CSV import fields).
        sched_time = normalize_hhmm(row.get("schedule_time"))
        if sched_time:
            task_data["schedule_time"] = sched_time

        # The cells are only split here: the flow step both imports hand
        # over to caps them (cap_task_fields) — the CSV's own copies of those
        # caps capped the labels before dropping duplicates and dropped an
        # unknown priority the JSON import kept (DRY audit 2026-10-12).
        reading_unit = (row.get("reading_unit") or "").strip()
        if reading_unit:
            task_data["reading_unit"] = reading_unit
        readings_raw = row.get("readings") or ""
        if readings_raw.strip():
            slots = parse_reading_slots_text(readings_raw)
            if slots:
                task_data["readings"] = slots

        last_performed = (row.get("last_performed") or "").strip()
        if last_performed:
            lp_date = parse_iso_date(last_performed)
            if lp_date is None:
                # Stored as it was, "01.10.2026" left a task that never fell
                # due (bug audit 2026-10-17, W-2).
                current["warnings"].append(f"{task_name}: last performed date {last_performed!r} is not a date — dropped")
            elif lp_date > today:
                # A day the work WAS done cannot lie ahead — a far-future one
                # overflowed the schedule math and kept the object in
                # setup-retry (bug audit 2026-09-27).
                current["warnings"].append(f"{task_name}: last performed date {last_performed} is in the future — dropped")
            else:
                write_anchor(task_data, lp_date.isoformat())

        notes = (row.get("notes") or "").strip()
        if notes:
            task_data["notes"] = notes

        # Optional fields (backwards-compatible — missing columns default to empty)
        if (row.get("enabled") or "").strip().lower() == "false":
            task_data["enabled"] = False
        doc_url = (row.get("documentation_url") or "").strip()
        if doc_url:
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

        # #134 audit: priority (closed set) + labels ("\n" cell like checklist).
        priority = (row.get("priority") or "").strip().lower()
        if priority:
            task_data["priority"] = priority
        # Labels and the checklist round-trip as one cell with "\n" between
        # the items.
        for field in ("labels", "checklist"):
            lines = (row.get(field) or "").splitlines()
            if any(line.strip() for line in lines):
                task_data[field] = lines

        # An archived object's tasks are archived WITH it (reason object, so
        # an unarchive restores them), and an archived object with live tasks
        # kept notifying. A task's own archive and pause have their columns
        # (bug audit 2026-10-16, F7). The task's own archive comes first, as in
        # the JSON import: cascaded over, an unarchive of the object brought
        # back a task that was archived on its own (bug audit 2026-10-17, W-8).
        task_archived = (row.get("task_archived_at") or "").strip().lstrip("\t")
        if _is_iso_moment(task_archived):
            task_data["archived_at"] = task_archived
            task_data["archived_reason"] = ARCHIVE_REASON_MANUAL
        elif current["object"].get("archived_at"):
            task_data["archived_at"] = current["object"]["archived_at"]
            task_data["archived_reason"] = ARCHIVE_REASON_OBJECT
        paused_at = (row.get("task_paused_at") or "").strip().lstrip("\t")
        if _is_iso_moment(paused_at):
            task_data["paused_at"] = paused_at
            paused_until = pause_end_day((row.get("task_paused_until") or "").lstrip("\t"))
            if paused_until is not None:
                task_data["paused_until"] = paused_until

        current["tasks"][task_id] = task_data
        current["object"]["task_ids"].append(task_id)

    return list(objects_map.values())


def _is_iso_moment(value: str) -> bool:
    """An ISO date / datetime string (the archive marker's shape)."""
    from datetime import datetime

    if not value:
        return False
    try:
        datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return False
    return True

