"""WebSocket handlers for export, import, CSV, QR, and templates."""

from __future__ import annotations

from typing import Any

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
from ..helpers.qr_generator import build_qr_url, generate_qr_svg_data_uri


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
    from ..export import export_maintenance_data  # noqa: PLC0415

    fmt = msg.get("format", "json")
    include_history = msg.get("include_history", True)
    result = export_maintenance_data(hass, fmt=fmt, include_history=include_history)
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
@websocket_api.async_response
async def ws_import_csv(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Import maintenance objects from CSV content."""
    from ..helpers.csv_handler import import_objects_csv  # noqa: PLC0415

    objects = import_objects_csv(msg["csv_content"])

    if not objects:
        connection.send_error(msg["id"], "empty_csv", "No valid objects found in CSV")
        return

    created = []
    for obj_data in objects:
        result = await hass.config_entries.flow.async_init(
            DOMAIN,
            context={"source": "websocket"},
            data={
                CONF_OBJECT: obj_data["object"],
                CONF_TASKS: obj_data["tasks"],
            },
        )
        if result["type"] == "create_entry":
            created.append({
                "entry_id": result["result"].entry_id,
                "name": obj_data["object"].get("name", ""),
                "task_count": len(obj_data["tasks"]),
            })

    connection.send_result(
        msg["id"],
        {"imported": created, "total": len(objects), "created": len(created)},
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/qr/generate",
        vol.Required("entry_id"): str,
        vol.Optional("task_id"): str,
        vol.Optional("action", default="view"): vol.In(["view", "complete"]),
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
    base_url = msg.get("base_url")
    try:
        url = build_qr_url(hass, entry_id, task_id=task_id, action=action, base_url_override=base_url)
    except ValueError as err:
        connection.send_error(msg["id"], "no_url", str(err))
        return
    svg_data_uri = await hass.async_add_executor_job(generate_qr_svg_data_uri, url, 2)

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
