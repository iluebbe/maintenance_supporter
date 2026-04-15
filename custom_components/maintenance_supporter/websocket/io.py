"""WebSocket handlers for export, import, CSV, QR, and templates."""

from __future__ import annotations

import json as json_mod
import logging
from typing import Any
from uuid import uuid4

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant

from ..const import (
    CONF_OBJECT,
    CONF_OBJECT_MANUFACTURER,
    CONF_OBJECT_MODEL,
    CONF_OBJECT_NAME,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from ..websocket.tasks import _check_nfc_tag_duplicate

_LOGGER = logging.getLogger(__name__)

from ..helpers.qr_generator import (
    _ACTION_ICON_MAP,
    build_qr_url,
    generate_qr_svg_data_uri,
)


@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/templates"}
)
@websocket_api.async_response
async def ws_get_templates(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return all available maintenance templates."""
    from ..templates import TEMPLATE_CATEGORIES, TEMPLATES

    result = {
        "categories": {
            cat_id: {
                k: v for k, v in cat.items()
            }
            for cat_id, cat in TEMPLATE_CATEGORIES.items()
        },
        "templates": [
            {
                "id": t.id,
                "name": t.name,
                "category": t.category,
                "tasks": [
                    {
                        "name": tt.name,
                        "type": tt.type,
                        "schedule_type": tt.schedule_type,
                        "interval_days": tt.interval_days,
                        "warning_days": tt.warning_days,
                    }
                    for tt in t.tasks
                ],
            }
            for t in TEMPLATES
        ],
    }
    connection.send_result(msg["id"], result)


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/export",
        vol.Optional("format", default="json"): vol.In(["json", "yaml"]),
        vol.Optional("include_history", default=True): bool,
    }
)
@websocket_api.async_response
async def ws_export_data(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Export all maintenance data as JSON or YAML."""
    from ..export import build_export_data, serialize_export  # noqa: PLC0415

    fmt = msg.get("format", "json")
    include_history = msg.get("include_history", True)

    # Phase 1: gather data on the event loop (accesses HA APIs)
    data = build_export_data(hass, include_history=include_history)

    # Phase 2: serialize in executor (CPU-bound, no HA API calls)
    result = await hass.async_add_executor_job(serialize_export, data, fmt)

    connection.send_result(msg["id"], {"format": fmt, "data": result})


@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/csv/export"}
)
@websocket_api.async_response
async def ws_export_csv(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Export all maintenance data as CSV."""
    from ..helpers.csv_handler import export_objects_csv  # noqa: PLC0415

    csv_data = export_objects_csv(hass)
    connection.send_result(msg["id"], {"csv": csv_data})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/csv/import",
        vol.Required("csv_content"): str,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_import_csv(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Import maintenance objects from CSV content."""
    from ..helpers.csv_handler import import_objects_csv  # noqa: PLC0415

    csv_content = msg["csv_content"]
    # Guard against oversized payloads (max 1MB / 1000 objects)
    if len(csv_content) > 1_048_576:
        connection.send_error(msg["id"], "too_large", "CSV content exceeds 1MB limit")
        return

    objects = import_objects_csv(csv_content)
    if len(objects) > 1000:
        connection.send_error(msg["id"], "too_many", "CSV contains more than 1000 objects")
        return

    if not objects:
        connection.send_error(msg["id"], "empty_csv", "No valid objects found in CSV")
        return

    created = []
    errors: list[dict[str, str]] = []
    for idx, obj_data in enumerate(objects):
        # Check for NFC tag duplicates in CSV-imported tasks
        nfc_warnings: list[str] = []
        for t_data in obj_data.get("tasks", {}).values():
            nfc_val = t_data.get("nfc_tag_id")
            if nfc_val:
                nfc_warn = _check_nfc_tag_duplicate(hass, nfc_val)
                if nfc_warn:
                    nfc_warnings.append(nfc_warn)

        try:
            result = await hass.config_entries.flow.async_init(
                DOMAIN,
                context={"source": "websocket"},
                data={
                    CONF_OBJECT: obj_data["object"],
                    CONF_TASKS: obj_data["tasks"],
                },
            )
        except Exception:  # noqa: BLE001
            obj_name = obj_data.get("object", {}).get("name", f"row {idx + 1}")
            _LOGGER.exception("CSV import failed for %s", obj_name)
            errors.append({"name": obj_name, "reason": "unexpected error"})
            continue
        if result["type"] == "create_entry":
            entry_info: dict[str, Any] = {
                "entry_id": result["result"].entry_id,
                "name": obj_data["object"].get("name", ""),
                "task_count": len(obj_data["tasks"]),
            }
            if nfc_warnings:
                entry_info["warnings"] = nfc_warnings
            created.append(entry_info)
        else:
            obj_name = obj_data.get("object", {}).get("name", f"row {idx + 1}")
            errors.append({"name": obj_name, "reason": result.get("reason", "unknown")})

    resp: dict[str, Any] = {
        "imported": created,
        "total": len(objects),
        "created": len(created),
    }
    if errors:
        resp["errors"] = errors
    connection.send_result(msg["id"], resp)


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/json/import",
        vol.Required("json_content"): str,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_import_json(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Import maintenance objects from JSON content (exported by /export)."""
    raw = msg["json_content"]
    if len(raw) > 10_485_760:
        connection.send_error(msg["id"], "too_large", "JSON content exceeds 10MB limit")
        return

    try:
        data = json_mod.loads(raw)
    except (json_mod.JSONDecodeError, ValueError):
        connection.send_error(msg["id"], "invalid_json", "Content is not valid JSON")
        return

    if not isinstance(data, dict) or "objects" not in data:
        connection.send_error(msg["id"], "invalid_format", "JSON must contain an 'objects' array")
        return

    objects = data["objects"]
    if not isinstance(objects, list):
        connection.send_error(msg["id"], "invalid_format", "'objects' must be an array")
        return

    if len(objects) > 1000:
        connection.send_error(msg["id"], "too_many", "JSON contains more than 1000 objects")
        return

    if not objects:
        connection.send_error(msg["id"], "empty", "No objects found in JSON")
        return

    created = []
    errors: list[dict[str, str]] = []
    for idx, obj_entry in enumerate(objects):
        obj_data = obj_entry.get("object", {})
        obj_name = (obj_data.get("name") or "").strip()
        if not obj_name:
            errors.append({"name": f"object {idx + 1}", "reason": "missing name"})
            continue

        obj_id = uuid4().hex
        import_obj: dict[str, Any] = {
            "id": obj_id,
            "name": obj_name,
            "manufacturer": obj_data.get("manufacturer"),
            "model": obj_data.get("model"),
            "serial_number": obj_data.get("serial_number"),
            "area_id": obj_data.get("area_id"),
            "installation_date": obj_data.get("installation_date"),
            "task_ids": [],
        }

        import_tasks: dict[str, dict[str, Any]] = {}
        for task_entry in obj_entry.get("tasks", []):
            task_name = (task_entry.get("name") or "").strip()
            if not task_name:
                continue
            task_id = uuid4().hex
            task_data: dict[str, Any] = {
                "id": task_id,
                "object_id": obj_id,
                "name": task_name,
                "type": task_entry.get("type", "custom"),
                "enabled": task_entry.get("enabled", True),
                "schedule_type": task_entry.get("schedule_type", "time_based"),
                "warning_days": task_entry.get("warning_days", 7),
                "history": task_entry.get("history", []),
            }
            for key in (
                "interval_days", "interval_anchor", "last_planned_due",
                "last_performed", "notes", "documentation_url",
                "custom_icon", "nfc_tag_id", "responsible_user_id",
                "entity_slug", "trigger_config", "adaptive_config",
                "checklist",
            ):
                val = task_entry.get(key)
                if val is not None:
                    task_data[key] = val

            import_tasks[task_id] = task_data
            import_obj["task_ids"].append(task_id)

        # Check for NFC tag duplicates across imported tasks
        nfc_warnings: list[str] = []
        for t_data in import_tasks.values():
            nfc_val = t_data.get("nfc_tag_id")
            if nfc_val:
                nfc_warn = _check_nfc_tag_duplicate(hass, nfc_val)
                if nfc_warn:
                    nfc_warnings.append(nfc_warn)

        try:
            result = await hass.config_entries.flow.async_init(
                DOMAIN,
                context={"source": "websocket"},
                data={
                    CONF_OBJECT: import_obj,
                    CONF_TASKS: import_tasks,
                },
            )
        except Exception:  # noqa: BLE001
            _LOGGER.exception("JSON import failed for %s", obj_name)
            errors.append({"name": obj_name, "reason": "unexpected error"})
            continue
        if result["type"] == "create_entry":
            entry_info: dict[str, Any] = {
                "entry_id": result["result"].entry_id,
                "name": obj_name,
                "task_count": len(import_tasks),
            }
            if nfc_warnings:
                entry_info["warnings"] = nfc_warnings
            created.append(entry_info)
        else:
            errors.append({"name": obj_name, "reason": result.get("reason", "unknown")})

    resp: dict[str, Any] = {
        "imported": created,
        "total": len(objects),
        "created": len(created),
    }
    if errors:
        resp["errors"] = errors
    connection.send_result(msg["id"], resp)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/qr/generate",
        vol.Required("entry_id"): str,
        vol.Optional("task_id"): str,
        vol.Optional("action", default="view"): vol.In(["view", "complete"]),
        vol.Optional("url_mode", default="server"): vol.In(
            ["server", "local", "companion"]
        ),
        vol.Optional("base_url"): vol.Url(),
    }
)
@websocket_api.async_response
async def ws_generate_qr(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Generate a QR code for a maintenance object or task."""
    entry_id = msg["entry_id"]
    entry = hass.config_entries.async_get_entry(entry_id)
    if entry is None or entry.domain != DOMAIN or entry.unique_id == GLOBAL_UNIQUE_ID:
        connection.send_error(msg["id"], "not_found", "Object not found")
        return

    obj_data = entry.data.get(CONF_OBJECT, {})
    task_id = msg.get("task_id")
    task_name = None

    if task_id:
        tasks_data = entry.data.get(CONF_TASKS, {})
        if task_id not in tasks_data:
            connection.send_error(msg["id"], "not_found", "Task not found")
            return
        task_name = tasks_data[task_id].get("name", "")

    action = msg.get("action", "view")
    url_mode = msg.get("url_mode", "server")
    base_url = msg.get("base_url")
    try:
        url = build_qr_url(
            hass, entry_id, task_id=task_id, action=action,
            base_url_override=base_url, url_mode=url_mode,
        )
    except ValueError as err:
        connection.send_error(msg["id"], "no_url", str(err))
        return
    from functools import partial  # noqa: PLC0415

    icon = _ACTION_ICON_MAP.get(action)
    gen_fn = partial(generate_qr_svg_data_uri, url, border=2, icon=icon)
    svg_data_uri = await hass.async_add_executor_job(gen_fn)

    connection.send_result(
        msg["id"],
        {
            "svg_data_uri": svg_data_uri,
            "url": url,
            "label": {
                "object_name": obj_data.get(CONF_OBJECT_NAME, ""),
                "manufacturer": obj_data.get(CONF_OBJECT_MANUFACTURER, ""),
                "model": obj_data.get(CONF_OBJECT_MODEL, ""),
                "task_name": task_name,
            },
        },
    )
