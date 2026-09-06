"""Export maintenance data as JSON or YAML."""

from __future__ import annotations

import json
import logging
from pathlib import Path
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import (
    BATTERY_FLEET_DUE_WITHOUT_SENSOR,
    BATTERY_FLEET_EXCLUDED,
    BATTERY_FLEET_INCLUDED,
    BATTERY_FLEET_OBJECT_FLAG,
    BATTERY_FLEET_REMOVED_PARTS,
    BATTERY_FLEET_TASK_FLAG,
    BATTERY_FLEET_TRACK_SELF_CHARGING,
    CONF_OBJECT,
    CONF_TASKS,
    DEFAULT_WARNING_DAYS,
    DOMAIN,
)
from .helpers.aggregate import get_object_entries, merged_tasks
from .helpers.schedule import Schedule, read_legacy_fields

_LOGGER = logging.getLogger(__name__)


def _export_documents(doc_store: Any, object_id: str) -> list[dict[str, Any]]:
    """Export an object's document metadata + web-links (blobs ride the backup).

    File binaries are NOT in the JSON export (they live under /config and travel
    via the HA backup). An import without a matching backup therefore recreates
    file metadata pointing at a missing blob — the storage-hygiene repair issue
    catches those as dangling. Web-links round-trip fully. ``task_ids`` are
    carried too (as the OLD task ids); the importer remaps them onto the fresh
    task ids so a doc's task links survive a backup/restore. The doc's own
    ``id`` rides along for the same reason: history entries (completion
    photos) and spare parts (``doc_id``) point at documents by id, and the
    importer mints fresh ids — without the old one it could not remap them.
    """
    out: list[dict[str, Any]] = []
    for d in doc_store.for_object(object_id):
        if d.get("kind") == "weblink":
            out.append(
                {
                    "id": d.get("id"),
                    "kind": "weblink",
                    "url": d.get("url"),
                    "title": d.get("title"),
                    "tags": d.get("tags") or [],
                    "task_ids": d.get("task_ids") or [],
                    "part_ids": d.get("part_ids") or [],
                }
            )
        else:
            out.append(
                {
                    "id": d.get("id"),
                    "kind": "file",
                    "hash": d.get("hash"),
                    "title": d.get("title"),
                    "filename": d.get("filename"),
                    "mime": d.get("mime"),
                    "size": d.get("size"),
                    "tags": d.get("tags") or [],
                    "task_ids": d.get("task_ids") or [],
                    "part_ids": d.get("part_ids") or [],
                }
            )
    return out


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
    tasks_data = merged_tasks(entry)
    ct_tasks = (coordinator_data or {}).get(CONF_TASKS, {})

    tasks = []
    for tid, tdata in tasks_data.items():
        ct = ct_tasks.get(tid, {})
        sched = read_legacy_fields(tdata)
        task: dict[str, Any] = {
            "id": tid,
            "name": tdata.get("name", ""),
            "type": tdata.get("type", "custom"),
            "enabled": tdata.get("enabled", True),
            # Provenance + lifecycle a backup must preserve: created_at is the
            # next_due fallback anchor when last_performed is None (dropping it
            # silently shifts due dates on restore), and the archived_* pair
            # keeps a retired task retired — without them an archived task comes
            # back ACTIVE after a restore.
            "created_at": tdata.get("created_at"),
            "archived_at": tdata.get("archived_at"),
            "archived_reason": tdata.get("archived_reason"),
            "schedule_type": sched["schedule_type"],
            "interval_days": sched["interval_days"],
            "interval_unit": sched["interval_unit"],
            "due_date": sched["due_date"],
            "interval_anchor": sched["interval_anchor"],
            # Nested recurrence — carries the calendar kinds (weekdays /
            # nth_weekday / day_of_month) that the flat fields above can't.
            "schedule": Schedule.parse(tdata).to_dict(),
            "last_planned_due": tdata.get("last_planned_due"),
            # A pending per-occurrence postpone is user intent — round-trip it
            # like last_planned_due so a backup/restore keeps the deferral.
            "due_override": tdata.get("due_override"),
            "warning_days": tdata.get("warning_days", DEFAULT_WARNING_DAYS),
            "last_performed": tdata.get("last_performed"),
            "notes": tdata.get("notes"),
            "documentation_url": tdata.get("documentation_url"),
            "custom_icon": tdata.get("custom_icon"),
            "nfc_tag_id": tdata.get("nfc_tag_id"),
            "require_tag_scan": tdata.get("require_tag_scan"),
            # #150: per-task skip lock.
            "allow_skip": tdata.get("allow_skip"),
            "responsible_user_id": tdata.get("responsible_user_id"),
            "entity_slug": tdata.get("entity_slug"),
            "adaptive_config": tdata.get("adaptive_config"),
            "checklist": tdata.get("checklist") or [],
            # In-cycle ticks (#73) — merged_tasks overlays them from the Store;
            # exporting them keeps half-done checklists across backup/restore.
            "checklist_progress": tdata.get("checklist_progress"),
            "schedule_time": tdata.get("schedule_time"),
            # v2.17+ / #83 task fields — persisted and user-facing, so a JSON
            # backup must restore them (same field-completeness contract as #67
            # for documentation_url/notes; import mirrors these keys).
            "priority": tdata.get("priority", "normal"),
            "labels": tdata.get("labels") or [],
            "earliest_completion_days": tdata.get("earliest_completion_days"),
            "on_complete_action": tdata.get("on_complete_action"),
            "quick_complete_defaults": tdata.get("quick_complete_defaults"),
            "assignee_pool": tdata.get("assignee_pool") or [],
            # v2.44: demanded completion details — the import has mirrored this
            # key from day one; the export builder lost it (found by the #130
            # export audit), so backups silently dropped the requirement.
            "required_completion_fields": tdata.get("required_completion_fields"),
            "rotation_strategy": tdata.get("rotation_strategy"),
            "reading_unit": tdata.get("reading_unit"),
            # #161 phase 2: reading slots (history carries the per-slot values).
            "readings": tdata.get("readings"),
            # Task phases (#139): defs + cycle are static config; the cursor is
            # Store-merged by merged_tasks, so a restore resumes mid-cycle
            # instead of silently restarting at step one.
            "phases": tdata.get("phases"),
            "phase_sequence": tdata.get("phase_sequence"),
            "phase_cursor": tdata.get("phase_cursor"),
            # Spare parts: consumption links + the auto-buy-task marker.
            "consumes_parts": tdata.get("consumes_parts"),
            "part_ref": tdata.get("part_ref"),
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

        # Battery fleet identity: the single aggregate task is flagged so the
        # detail view renders the battery section — without the marker a
        # restored fleet task is a plain inspection task.
        if tdata.get(BATTERY_FLEET_TASK_FLAG):
            task[BATTERY_FLEET_TASK_FLAG] = True

        if include_history:
            task["history"] = tdata.get("history") or []

        tasks.append(task)

    # (roadmap P6) attach document metadata + web-links.
    from . import DOCUMENT_STORE_KEY

    doc_store = hass.data.get(DOMAIN, {}).get(DOCUMENT_STORE_KEY)
    object_id = obj_data.get("id", "")
    documents = _export_documents(doc_store, object_id) if doc_store is not None and object_id else []

    export_obj: dict[str, Any] = {
        "name": obj_data.get("name", ""),
        "area_id": obj_data.get("area_id"),
        "manufacturer": obj_data.get("manufacturer"),
        "model": obj_data.get("model"),
        "serial_number": obj_data.get("serial_number"),
        "installation_date": obj_data.get("installation_date"),
        "warranty_expiry": obj_data.get("warranty_expiry"),
        # Round-tripped so a JSON backup restores the full asset record
        # (these were added in v1.4.0/v1.4.10 but missed here until #67).
        "documentation_url": obj_data.get("documentation_url"),
        "notes": obj_data.get("notes"),
        # 2.19: device link / parent hierarchy. Instance-specific ids —
        # meaningful when restoring on the SAME instance; dangling values
        # on a foreign instance are harmless (device_info falls back).
        "ha_device_id": obj_data.get("ha_device_id"),
        "parent_entry_id": obj_data.get("parent_entry_id"),
        # 2.20: seasonal pause (a paused pool restored in winter stays
        # paused) + replace-flow lineage (instance-specific entry ids,
        # same caveat as parent_entry_id above).
        "paused_at": obj_data.get("paused_at"),
        "paused_until": obj_data.get("paused_until"),
        "predecessor_entry_id": obj_data.get("predecessor_entry_id"),
        "replaced_by_entry_id": obj_data.get("replaced_by_entry_id"),
        # Object-level archive marker (the tasks carry their own pair
        # above). Without it an archived object came back ACTIVE after a
        # restore — with every task still archived (reason "object") and
        # object/unarchive refusing because the object "isn't archived".
        "archived_at": obj_data.get("archived_at"),
    }
    # Battery fleet identity — only emitted for the fleet object so a plain
    # object's export stays byte-identical to earlier versions. The importer
    # mirrors these (and keeps the deterministic ``batt_<type>`` part ids).
    if obj_data.get(BATTERY_FLEET_OBJECT_FLAG):
        export_obj[BATTERY_FLEET_OBJECT_FLAG] = True
        export_obj[BATTERY_FLEET_EXCLUDED] = list(obj_data.get(BATTERY_FLEET_EXCLUDED) or [])
        export_obj[BATTERY_FLEET_INCLUDED] = list(obj_data.get(BATTERY_FLEET_INCLUDED) or [])
        export_obj[BATTERY_FLEET_TRACK_SELF_CHARGING] = bool(obj_data.get(BATTERY_FLEET_TRACK_SELF_CHARGING))
        # D#162: on unless explicitly switched off (absent = on).
        export_obj[BATTERY_FLEET_DUE_WITHOUT_SENSOR] = obj_data.get(BATTERY_FLEET_DUE_WITHOUT_SENSOR) is not False
        export_obj[BATTERY_FLEET_REMOVED_PARTS] = list(obj_data.get(BATTERY_FLEET_REMOVED_PARTS) or [])

    return {
        "entry_id": entry.entry_id,
        "object": export_obj,
        "tasks": tasks,
        "documents": documents,
        # Spare parts: full static definition + the tracked stock (dynamic,
        # read from the Store) so a backup/restore keeps the shelf state.
        "parts": [
            {**part, "stock": store.get_part_stock(part["id"]) if store is not None else None}
            for part in (entry.data.get("parts") or {}).values()
        ],
    }


# The maintenance OBJECT entries (never the global hub). Shared by every
# exporter so JSON/YAML/CSV apply the same selective-export filter — the
# implementation lives in helpers.aggregate, this module keeps the name its
# importers (csv_handler, doc_archive, WS adopt handlers) bind to.
object_entries = get_object_entries


def build_export_data(
    hass: HomeAssistant,
    include_history: bool = True,
    entry_ids: set[str] | None = None,
) -> dict[str, Any]:
    """Gather all maintenance data into a plain dict.

    This must be called from the event loop (accesses HA APIs).
    The returned dict contains no HA objects and is safe to
    serialize in an executor thread. ``entry_ids`` narrows the export to a
    selection of objects (None = all).
    """
    entries = object_entries(hass, entry_ids)

    objects = []
    for entry in entries:
        rd = getattr(entry, "runtime_data", None)
        coord_data = rd.coordinator.data if rd and rd.coordinator else None
        objects.append(_build_export_object(hass, entry, coord_data, include_history))

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

            # Normalize through JSON first: yaml.safe_dump rejects types the
            # JSON path coerces (e.g. tuples → lists), so YAML export would
            # crash on data JSON handles fine. Round-tripping keeps both
            # formats consistent and YAML-safe.
            normalized = json.loads(json.dumps(data, ensure_ascii=False))
            return str(yaml.safe_dump(normalized, default_flow_style=False, allow_unicode=True))
        except ImportError:
            _LOGGER.warning("PyYAML not available, falling back to JSON")
            return json.dumps(data, indent=2, ensure_ascii=False)

    return json.dumps(data, indent=2, ensure_ascii=False)


def serialize_export_to_file(data: dict[str, Any], fmt: str, file_path: str) -> str:
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


# Global settings the export deliberately leaves behind: HA user ids are
# instance-bound (and the panel-access allowlist is security-relevant), and
# the adopted-task stash is transient re-adopt state.
_NON_PORTABLE_SETTINGS = ("admin_panel_user_ids", "adopted_task_notes", "shopping_list_entity", "member_display")


def build_settings_export(hass: HomeAssistant) -> dict[str, Any]:
    """The SECOND export: the global entry's settings.

    ``build_export_data`` deliberately carries only objects — groups, saved
    views, vacation config, notification/budget settings and the feature
    toggles live on the global entry and export through here instead
    (2026-08 round-trip audit decision). Instance-bound keys are excluded
    (see ``_NON_PORTABLE_SETTINGS``).
    """
    from .const import (
        CONF_GROUPS,
        CONF_SAVED_FILTER_VIEWS,
        CONF_VACATION_BUFFER_DAYS,
        CONF_VACATION_ENABLED,
        CONF_VACATION_END,
        CONF_VACATION_EXEMPT_TASK_IDS,
        CONF_VACATION_START,
    )
    from .helpers.global_options import get_global_options
    from .helpers.settings_registry import ALLOWED_SETTING_KEYS

    opts = get_global_options(hass)
    settings: dict[str, Any] = {
        k: opts[k] for k in ALLOWED_SETTING_KEYS if k in opts and k not in _NON_PORTABLE_SETTINGS
    }
    # Structured sections with their own WS surfaces (not in the registry).
    for key in (
        CONF_GROUPS,
        CONF_SAVED_FILTER_VIEWS,
        CONF_VACATION_ENABLED,
        CONF_VACATION_START,
        CONF_VACATION_END,
        CONF_VACATION_BUFFER_DAYS,
        CONF_VACATION_EXEMPT_TASK_IDS,
    ):
        if key in opts:
            settings[key] = opts[key]
    return {"version": 1, "global_settings": settings}
