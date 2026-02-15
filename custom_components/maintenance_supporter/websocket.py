"""WebSocket API for the Maintenance Supporter integration."""

from __future__ import annotations

import logging
from typing import TYPE_CHECKING, Any
from uuid import uuid4

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback

if TYPE_CHECKING:
    from . import MaintenanceSupporterData

from .helpers.qr_generator import build_qr_url, generate_qr_svg_data_uri
from .const import (
    CONF_ADVANCED_ADAPTIVE,
    CONF_ADVANCED_BUDGET,
    CONF_ADVANCED_CHECKLISTS,
    CONF_ADVANCED_ENVIRONMENTAL,
    CONF_ADVANCED_GROUPS,
    CONF_ADVANCED_PREDICTIONS,
    CONF_ADVANCED_SEASONAL,
    CONF_OBJECT,
    CONF_OBJECT_AREA,
    CONF_OBJECT_INSTALLATION_DATE,
    CONF_OBJECT_MANUFACTURER,
    CONF_OBJECT_MODEL,
    CONF_OBJECT_NAME,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    HistoryEntryType,
    MaintenanceTypeEnum,
    ScheduleType,
)

_LOGGER = logging.getLogger(__name__)


@callback
def async_register_commands(hass: HomeAssistant) -> None:
    """Register all WebSocket commands."""
    websocket_api.async_register_command(hass, ws_get_objects)
    websocket_api.async_register_command(hass, ws_get_object)
    websocket_api.async_register_command(hass, ws_get_statistics)
    websocket_api.async_register_command(hass, ws_subscribe)
    websocket_api.async_register_command(hass, ws_create_object)
    websocket_api.async_register_command(hass, ws_update_object)
    websocket_api.async_register_command(hass, ws_delete_object)
    websocket_api.async_register_command(hass, ws_create_task)
    websocket_api.async_register_command(hass, ws_update_task)
    websocket_api.async_register_command(hass, ws_delete_task)
    websocket_api.async_register_command(hass, ws_complete_task)
    websocket_api.async_register_command(hass, ws_skip_task)
    websocket_api.async_register_command(hass, ws_reset_task)
    websocket_api.async_register_command(hass, ws_get_templates)
    websocket_api.async_register_command(hass, ws_export_data)
    websocket_api.async_register_command(hass, ws_get_budget_status)
    websocket_api.async_register_command(hass, ws_export_csv)
    websocket_api.async_register_command(hass, ws_import_csv)
    websocket_api.async_register_command(hass, ws_get_groups)
    websocket_api.async_register_command(hass, ws_create_group)
    websocket_api.async_register_command(hass, ws_update_group)
    websocket_api.async_register_command(hass, ws_delete_group)
    websocket_api.async_register_command(hass, ws_analyze_interval)
    websocket_api.async_register_command(hass, ws_apply_suggestion)
    websocket_api.async_register_command(hass, ws_seasonal_overrides)
    websocket_api.async_register_command(hass, ws_set_environmental_entity)
    websocket_api.async_register_command(hass, ws_generate_qr)
    websocket_api.async_register_command(hass, ws_get_settings)
    websocket_api.async_register_command(hass, ws_list_users)
    websocket_api.async_register_command(hass, ws_assign_user)
    websocket_api.async_register_command(hass, ws_tasks_by_user)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _get_object_entries(hass: HomeAssistant) -> list:
    """Return all non-global config entries for this domain."""
    return [
        entry
        for entry in hass.config_entries.async_entries(DOMAIN)
        if entry.unique_id != GLOBAL_UNIQUE_ID
    ]


def _get_runtime_data(hass: HomeAssistant, entry_id: str) -> MaintenanceSupporterData | None:
    """Get runtime data for a config entry."""
    return hass.data.get(DOMAIN, {}).get(entry_id)


def _build_task_summary(
    hass: HomeAssistant, task_id: str, task_data: dict, coordinator_task: dict | None
) -> dict:
    """Build a task summary dict for WS responses."""
    ct = coordinator_task or {}

    # Enrich trigger config with entity friendly name and state info
    trigger_config = task_data.get("trigger_config")
    trigger_entity_info: dict | None = None
    if trigger_config and trigger_config.get("entity_id"):
        entity_id = trigger_config["entity_id"]
        state_obj = hass.states.get(entity_id)
        if state_obj is not None:
            trigger_entity_info = {
                "entity_id": entity_id,
                "friendly_name": state_obj.attributes.get("friendly_name", entity_id),
                "unit_of_measurement": state_obj.attributes.get("unit_of_measurement"),
                "min": state_obj.attributes.get("min"),
                "max": state_obj.attributes.get("max"),
                "step": state_obj.attributes.get("step"),
            }

    return {
        "id": task_id,
        "name": task_data.get("name", ""),
        "type": task_data.get("type", "custom"),
        "enabled": task_data.get("enabled", True),
        "schedule_type": task_data.get("schedule_type", "time_based"),
        "interval_days": task_data.get("interval_days"),
        "warning_days": task_data.get("warning_days", 7),
        "last_performed": task_data.get("last_performed"),
        "notes": task_data.get("notes"),
        "documentation_url": task_data.get("documentation_url"),
        "responsible_user_id": task_data.get("responsible_user_id"),
        "trigger_config": trigger_config,
        "trigger_entity_info": trigger_entity_info,
        "checklist": task_data.get("checklist", []),
        "history": task_data.get("history", []),
        # Computed fields from coordinator
        "status": ct.get("_status", "ok"),
        "days_until_due": ct.get("_days_until_due"),
        "next_due": ct.get("_next_due"),
        "trigger_active": ct.get("_trigger_active", False),
        "trigger_current_value": ct.get("_trigger_current_value"),
        "trigger_entity_state": ct.get("_trigger_entity_state", "available"),
        "trigger_current_delta": ct.get("_trigger_current_delta"),
        "trigger_baseline_value": ct.get("_trigger_baseline_value"),
        "times_performed": ct.get("_times_performed", 0),
        "total_cost": ct.get("_total_cost", 0.0),
        "average_duration": ct.get("_average_duration"),
        # Adaptive scheduling
        "adaptive_config": task_data.get("adaptive_config"),
        "suggested_interval": ct.get("_suggested_interval"),
        "interval_confidence": ct.get("_interval_confidence"),
        "interval_analysis": ct.get("_interval_analysis"),
        # Seasonal scheduling (top-level for easy frontend access)
        "seasonal_factor": (ct.get("_interval_analysis") or {}).get("seasonal_factor"),
        "seasonal_factors": (ct.get("_interval_analysis") or {}).get("seasonal_factors"),
        # Sensor-driven predictions (Phase 3)
        "degradation_rate": ct.get("_degradation_rate"),
        "degradation_trend": ct.get("_degradation_trend"),
        "degradation_r_squared": ct.get("_degradation_r_squared"),
        "days_until_threshold": ct.get("_days_until_threshold"),
        "threshold_prediction_date": ct.get("_threshold_prediction_date"),
        "threshold_prediction_confidence": ct.get("_threshold_prediction_confidence"),
        "environmental_factor": ct.get("_environmental_factor"),
        "environmental_entity": ct.get("_environmental_entity"),
        "environmental_correlation": ct.get("_environmental_correlation"),
        "sensor_prediction_urgency": ct.get("_sensor_prediction_urgency", False),
    }


def _build_object_response(hass: HomeAssistant, entry, coordinator_data: dict | None) -> dict:
    """Build a full object response dict."""
    obj_data = entry.data.get(CONF_OBJECT, {})
    tasks_data = entry.data.get(CONF_TASKS, {})
    ct_tasks = (coordinator_data or {}).get(CONF_TASKS, {})

    tasks = [
        _build_task_summary(hass, tid, tdata, ct_tasks.get(tid))
        for tid, tdata in tasks_data.items()
    ]

    return {
        "entry_id": entry.entry_id,
        "object": {
            "id": obj_data.get("id", ""),
            "name": obj_data.get("name", ""),
            "area_id": obj_data.get("area_id"),
            "manufacturer": obj_data.get("manufacturer"),
            "model": obj_data.get("model"),
            "installation_date": obj_data.get("installation_date"),
        },
        "tasks": tasks,
    }


# ---------------------------------------------------------------------------
# Settings
# ---------------------------------------------------------------------------


@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/settings"}
)
@websocket_api.async_response
async def ws_get_settings(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return global settings including advanced feature flags."""
    global_entry = _get_global_entry(hass)
    if global_entry is None:
        connection.send_result(msg["id"], {"features": {}})
        return

    options = global_entry.options or global_entry.data

    connection.send_result(
        msg["id"],
        {
            "features": {
                "adaptive": options.get(CONF_ADVANCED_ADAPTIVE, False),
                "predictions": options.get(CONF_ADVANCED_PREDICTIONS, False),
                "seasonal": options.get(CONF_ADVANCED_SEASONAL, False),
                "environmental": options.get(CONF_ADVANCED_ENVIRONMENTAL, False),
                "budget": options.get(CONF_ADVANCED_BUDGET, False),
                "groups": options.get(CONF_ADVANCED_GROUPS, False),
                "checklists": options.get(CONF_ADVANCED_CHECKLISTS, False),
            },
        },
    )


# ---------------------------------------------------------------------------
# User Management Commands
# ---------------------------------------------------------------------------


@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/users/list"}
)
@websocket_api.async_response
async def ws_list_users(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return list of HA users for task assignment.

    Returns users with their basic info for frontend selector.
    Filters out system users (is_active=False, system_generated=True).
    """
    users_data = []

    for user in await hass.auth.async_get_users():
        # Filter out system users and inactive users
        if not user.is_active or user.system_generated:
            continue

        users_data.append({
            "id": user.id,
            "name": user.name,
            "is_admin": user.is_admin,
            "is_owner": user.is_owner,
        })

    connection.send_result(msg["id"], {"users": users_data})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/task/assign_user",
        vol.Required("entry_id"): str,
        vol.Required("task_id"): str,
        vol.Optional("user_id"): vol.Any(str, None),  # None = unassign
    }
)
@websocket_api.async_response
async def ws_assign_user(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Assign or unassign a user to a task."""
    entry = hass.config_entries.async_get_entry(msg["entry_id"])
    if entry is None or entry.domain != DOMAIN or entry.unique_id == GLOBAL_UNIQUE_ID:
        connection.send_error(msg["id"], "not_found", "Object not found")
        return

    tasks_data = dict(entry.data.get(CONF_TASKS, {}))
    task_id = msg["task_id"]
    if task_id not in tasks_data:
        connection.send_error(msg["id"], "not_found", "Task not found")
        return

    user_id = msg.get("user_id")

    # Validate user exists if provided
    if user_id:
        user = await hass.auth.async_get_user(user_id)
        if user is None:
            connection.send_error(msg["id"], "invalid_user", "User not found")
            return

    task = dict(tasks_data[task_id])
    if user_id is None:
        # Unassign user - remove field if it exists
        task.pop("responsible_user_id", None)
    else:
        task["responsible_user_id"] = user_id
    tasks_data[task_id] = task

    new_data = dict(entry.data)
    new_data[CONF_TASKS] = tasks_data
    hass.config_entries.async_update_entry(entry, data=new_data)

    # Refresh coordinator
    rd = _get_runtime_data(hass, entry.entry_id)
    if rd and rd.coordinator:
        await rd.coordinator.async_request_refresh()

    connection.send_result(msg["id"], {"success": True, "user_id": user_id})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/tasks/by_user",
        vol.Required("user_id"): str,
    }
)
@websocket_api.async_response
async def ws_tasks_by_user(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return all tasks assigned to a specific user across all objects."""
    user_id = msg["user_id"]
    entries = _get_object_entries(hass)
    result = []

    for entry in entries:
        rd = _get_runtime_data(hass, entry.entry_id)
        coord_data = rd.coordinator.data if rd and rd.coordinator else None
        ct_tasks = (coord_data or {}).get(CONF_TASKS, {})
        tasks_data = entry.data.get(CONF_TASKS, {})
        obj_data = entry.data.get(CONF_OBJECT, {})

        for tid, tdata in tasks_data.items():
            if tdata.get("responsible_user_id") == user_id:
                task_summary = _build_task_summary(hass, tid, tdata, ct_tasks.get(tid))
                task_summary["object_name"] = obj_data.get("name", "")
                task_summary["entry_id"] = entry.entry_id
                result.append(task_summary)

    connection.send_result(msg["id"], {"tasks": result})


# ---------------------------------------------------------------------------
# Read Commands
# ---------------------------------------------------------------------------


@websocket_api.websocket_command(
    {vol.Required("type"): "maintenance_supporter/objects"}
)
@websocket_api.async_response
async def ws_get_objects(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return all maintenance objects with tasks and computed status."""
    entries = _get_object_entries(hass)
    result = []
    for entry in entries:
        rd = _get_runtime_data(hass, entry.entry_id)
        coord_data = rd.coordinator.data if rd and rd.coordinator else None
        result.append(_build_object_response(hass, entry, coord_data))

    connection.send_result(msg["id"], {"objects": result})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/object",
        vol.Required("entry_id"): str,
    }
)
@websocket_api.async_response
async def ws_get_object(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return a single object with full task details including history."""
    entry_id = msg["entry_id"]
    entry = hass.config_entries.async_get_entry(entry_id)
    if entry is None or entry.domain != DOMAIN or entry.unique_id == GLOBAL_UNIQUE_ID:
        connection.send_error(msg["id"], "not_found", "Object not found")
        return

    rd = _get_runtime_data(hass, entry_id)
    coord_data = rd.coordinator.data if rd and rd.coordinator else None
    connection.send_result(msg["id"], _build_object_response(hass, entry, coord_data))


@websocket_api.websocket_command(
    {vol.Required("type"): "maintenance_supporter/statistics"}
)
@websocket_api.async_response
async def ws_get_statistics(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return aggregated statistics."""
    entries = _get_object_entries(hass)
    total_objects = len(entries)
    total_tasks = 0
    overdue = 0
    due_soon = 0
    triggered = 0
    total_cost = 0.0

    for entry in entries:
        rd = _get_runtime_data(hass, entry.entry_id)
        coord_data = rd.coordinator.data if rd and rd.coordinator else None
        ct_tasks = (coord_data or {}).get(CONF_TASKS, {})
        tasks_data = entry.data.get(CONF_TASKS, {})
        total_tasks += len(tasks_data)

        for tid, ct in ct_tasks.items():
            status = ct.get("_status", "ok")
            if status == "overdue":
                overdue += 1
            elif status == "due_soon":
                due_soon += 1
            elif status == "triggered":
                triggered += 1
            total_cost += ct.get("_total_cost", 0.0)

    connection.send_result(
        msg["id"],
        {
            "total_objects": total_objects,
            "total_tasks": total_tasks,
            "overdue": overdue,
            "due_soon": due_soon,
            "triggered": triggered,
            "total_cost": round(total_cost, 2),
        },
    )


@websocket_api.websocket_command(
    {vol.Required("type"): "maintenance_supporter/subscribe"}
)
@websocket_api.async_response
async def ws_subscribe(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Subscribe to real-time maintenance updates."""

    @callback
    def _forward_update() -> None:
        """Forward coordinator updates to the WebSocket."""
        entries = _get_object_entries(hass)
        result = []
        for entry in entries:
            rd = _get_runtime_data(hass, entry.entry_id)
            coord_data = rd.coordinator.data if rd and rd.coordinator else None
            result.append(_build_object_response(hass, entry, coord_data))
        connection.send_message(
            websocket_api.event_message(msg["id"], {"objects": result})
        )

    # Register listeners on all coordinators
    unsub_callbacks = []
    entries = _get_object_entries(hass)
    for entry in entries:
        rd = _get_runtime_data(hass, entry.entry_id)
        if rd and rd.coordinator:
            unsub_callbacks.append(
                rd.coordinator.async_add_listener(_forward_update)
            )

    @callback
    def _unsub() -> None:
        for unsub in unsub_callbacks:
            unsub()

    connection.subscriptions[msg["id"]] = _unsub

    # Send initial data
    connection.send_result(msg["id"])
    _forward_update()


# ---------------------------------------------------------------------------
# Write Commands: Object CRUD
# ---------------------------------------------------------------------------


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/object/create",
        vol.Required("name"): str,
        vol.Optional("area_id"): vol.Any(str, None),
        vol.Optional("manufacturer"): vol.Any(str, None),
        vol.Optional("model"): vol.Any(str, None),
        vol.Optional("installation_date"): vol.Any(str, None),
    }
)
@websocket_api.async_response
async def ws_create_object(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Create a new maintenance object via config flow."""
    result = await hass.config_entries.flow.async_init(
        DOMAIN,
        context={"source": "websocket"},
        data={
            CONF_OBJECT: {
                "id": uuid4().hex,
                CONF_OBJECT_NAME: msg["name"],
                CONF_OBJECT_AREA: msg.get("area_id"),
                CONF_OBJECT_MANUFACTURER: msg.get("manufacturer"),
                CONF_OBJECT_MODEL: msg.get("model"),
                CONF_OBJECT_INSTALLATION_DATE: msg.get("installation_date"),
                "task_ids": [],
            },
            CONF_TASKS: {},
        },
    )

    if result["type"] == "create_entry":
        connection.send_result(
            msg["id"],
            {"entry_id": result["result"].entry_id},
        )
    else:
        connection.send_error(
            msg["id"], "create_failed", f"Failed to create object: {result.get('reason', 'unknown')}"
        )


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/object/update",
        vol.Required("entry_id"): str,
        vol.Optional("name"): str,
        vol.Optional("manufacturer"): vol.Any(str, None),
        vol.Optional("model"): vol.Any(str, None),
    }
)
@websocket_api.async_response
async def ws_update_object(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Update an existing maintenance object."""
    entry = hass.config_entries.async_get_entry(msg["entry_id"])
    if entry is None or entry.domain != DOMAIN or entry.unique_id == GLOBAL_UNIQUE_ID:
        connection.send_error(msg["id"], "not_found", "Object not found")
        return

    new_data = dict(entry.data)
    obj = dict(new_data.get(CONF_OBJECT, {}))

    if "name" in msg:
        obj[CONF_OBJECT_NAME] = msg["name"]
    if "manufacturer" in msg:
        obj[CONF_OBJECT_MANUFACTURER] = msg["manufacturer"]
    if "model" in msg:
        obj[CONF_OBJECT_MODEL] = msg["model"]

    new_data[CONF_OBJECT] = obj
    title = obj.get(CONF_OBJECT_NAME, entry.title)
    hass.config_entries.async_update_entry(entry, data=new_data, title=title)

    connection.send_result(msg["id"], {"success": True})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/object/delete",
        vol.Required("entry_id"): str,
    }
)
@websocket_api.async_response
async def ws_delete_object(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Delete a maintenance object and all its tasks."""
    entry = hass.config_entries.async_get_entry(msg["entry_id"])
    if entry is None or entry.domain != DOMAIN or entry.unique_id == GLOBAL_UNIQUE_ID:
        connection.send_error(msg["id"], "not_found", "Object not found")
        return

    await hass.config_entries.async_remove(entry.entry_id)
    connection.send_result(msg["id"], {"success": True})


# ---------------------------------------------------------------------------
# Write Commands: Task CRUD
# ---------------------------------------------------------------------------


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/task/create",
        vol.Required("entry_id"): str,
        vol.Required("name"): str,
        vol.Optional("task_type", default="custom"): str,
        vol.Optional("schedule_type", default="time_based"): str,
        vol.Optional("interval_days"): vol.Any(int, None),
        vol.Optional("warning_days", default=7): int,
        vol.Optional("last_performed"): vol.Any(str, None),
        vol.Optional("trigger_config"): vol.Any(dict, None),
        vol.Optional("notes"): vol.Any(str, None),
        vol.Optional("documentation_url"): vol.Any(str, None),
        vol.Optional("responsible_user_id"): vol.Any(str, None),
    }
)
@websocket_api.async_response
async def ws_create_task(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Add a new task to an existing maintenance object."""
    entry = hass.config_entries.async_get_entry(msg["entry_id"])
    if entry is None or entry.domain != DOMAIN or entry.unique_id == GLOBAL_UNIQUE_ID:
        connection.send_error(msg["id"], "not_found", "Object not found")
        return

    task_id = uuid4().hex
    task_data: dict[str, Any] = {
        "id": task_id,
        "object_id": entry.data.get(CONF_OBJECT, {}).get("id", ""),
        "name": msg["name"],
        "type": msg.get("task_type", "custom"),
        "enabled": True,
        "schedule_type": msg.get("schedule_type", "time_based"),
        "warning_days": msg.get("warning_days", 7),
        "history": [],
    }

    if msg.get("interval_days") is not None:
        task_data["interval_days"] = msg["interval_days"]
    if msg.get("last_performed") is not None:
        task_data["last_performed"] = msg["last_performed"]
    if msg.get("trigger_config") is not None:
        task_data["trigger_config"] = msg["trigger_config"]
    if msg.get("notes") is not None:
        task_data["notes"] = msg["notes"]
    if msg.get("documentation_url") is not None:
        task_data["documentation_url"] = msg["documentation_url"]
    if msg.get("responsible_user_id") is not None:
        task_data["responsible_user_id"] = msg["responsible_user_id"]

    new_data = dict(entry.data)
    new_tasks = dict(new_data.get(CONF_TASKS, {}))
    new_tasks[task_id] = task_data
    new_data[CONF_TASKS] = new_tasks

    # Update task_ids on object
    obj = dict(new_data.get(CONF_OBJECT, {}))
    task_ids = list(obj.get("task_ids", []))
    task_ids.append(task_id)
    obj["task_ids"] = task_ids
    new_data[CONF_OBJECT] = obj

    hass.config_entries.async_update_entry(entry, data=new_data)

    # Reload entry to pick up new task entities
    await hass.config_entries.async_reload(entry.entry_id)

    connection.send_result(msg["id"], {"task_id": task_id})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/task/update",
        vol.Required("entry_id"): str,
        vol.Required("task_id"): str,
        vol.Optional("name"): str,
        vol.Optional("task_type"): str,
        vol.Optional("enabled"): bool,
        vol.Optional("schedule_type"): str,
        vol.Optional("interval_days"): vol.Any(int, None),
        vol.Optional("warning_days"): int,
        vol.Optional("trigger_config"): vol.Any(dict, None),
        vol.Optional("notes"): vol.Any(str, None),
        vol.Optional("documentation_url"): vol.Any(str, None),
        vol.Optional("responsible_user_id"): vol.Any(str, None),
    }
)
@websocket_api.async_response
async def ws_update_task(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Update an existing task."""
    entry = hass.config_entries.async_get_entry(msg["entry_id"])
    if entry is None or entry.domain != DOMAIN or entry.unique_id == GLOBAL_UNIQUE_ID:
        connection.send_error(msg["id"], "not_found", "Object not found")
        return

    tasks_data = dict(entry.data.get(CONF_TASKS, {}))
    task_id = msg["task_id"]
    if task_id not in tasks_data:
        connection.send_error(msg["id"], "not_found", "Task not found")
        return

    task = dict(tasks_data[task_id])

    # Update provided fields
    field_map = {
        "name": "name",
        "task_type": "type",
        "enabled": "enabled",
        "schedule_type": "schedule_type",
        "interval_days": "interval_days",
        "warning_days": "warning_days",
        "trigger_config": "trigger_config",
        "notes": "notes",
        "documentation_url": "documentation_url",
        "responsible_user_id": "responsible_user_id",
    }
    for msg_key, data_key in field_map.items():
        if msg_key in msg:
            task[data_key] = msg[msg_key]

    tasks_data[task_id] = task
    new_data = dict(entry.data)
    new_data[CONF_TASKS] = tasks_data
    hass.config_entries.async_update_entry(entry, data=new_data)

    # Refresh coordinator
    rd = _get_runtime_data(hass, entry.entry_id)
    if rd and rd.coordinator:
        await rd.coordinator.async_request_refresh()

    connection.send_result(msg["id"], {"success": True})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/task/delete",
        vol.Required("entry_id"): str,
        vol.Required("task_id"): str,
    }
)
@websocket_api.async_response
async def ws_delete_task(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Delete a task from a maintenance object."""
    entry = hass.config_entries.async_get_entry(msg["entry_id"])
    if entry is None or entry.domain != DOMAIN or entry.unique_id == GLOBAL_UNIQUE_ID:
        connection.send_error(msg["id"], "not_found", "Object not found")
        return

    task_id = msg["task_id"]
    new_data = dict(entry.data)
    new_tasks = dict(new_data.get(CONF_TASKS, {}))
    if task_id not in new_tasks:
        connection.send_error(msg["id"], "not_found", "Task not found")
        return

    del new_tasks[task_id]
    new_data[CONF_TASKS] = new_tasks

    # Remove from task_ids
    obj = dict(new_data.get(CONF_OBJECT, {}))
    task_ids = [tid for tid in obj.get("task_ids", []) if tid != task_id]
    obj["task_ids"] = task_ids
    new_data[CONF_OBJECT] = obj

    hass.config_entries.async_update_entry(entry, data=new_data)

    # Reload to remove entity
    await hass.config_entries.async_reload(entry.entry_id)

    connection.send_result(msg["id"], {"success": True})


# ---------------------------------------------------------------------------
# Write Commands: Task Services (Complete / Skip / Reset)
# ---------------------------------------------------------------------------


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/task/complete",
        vol.Required("entry_id"): str,
        vol.Required("task_id"): str,
        vol.Optional("notes"): vol.Any(str, None),
        vol.Optional("cost"): vol.Any(vol.Coerce(float), None),
        vol.Optional("duration"): vol.Any(vol.Coerce(int), None),
        vol.Optional("checklist_state"): vol.Any(dict, None),
        vol.Optional("feedback"): vol.Any(str, None),
    }
)
@websocket_api.async_response
async def ws_complete_task(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Mark a task as completed."""
    rd = _get_runtime_data(hass, msg["entry_id"])
    if rd is None or rd.coordinator is None:
        connection.send_error(msg["id"], "not_found", "Coordinator not found")
        return

    await rd.coordinator.complete_maintenance(
        task_id=msg["task_id"],
        notes=msg.get("notes"),
        cost=msg.get("cost"),
        duration=msg.get("duration"),
        checklist_state=msg.get("checklist_state"),
        feedback=msg.get("feedback"),
    )
    connection.send_result(msg["id"], {"success": True})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/task/skip",
        vol.Required("entry_id"): str,
        vol.Required("task_id"): str,
        vol.Optional("reason"): vol.Any(str, None),
    }
)
@websocket_api.async_response
async def ws_skip_task(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Skip the current maintenance cycle."""
    rd = _get_runtime_data(hass, msg["entry_id"])
    if rd is None or rd.coordinator is None:
        connection.send_error(msg["id"], "not_found", "Coordinator not found")
        return

    await rd.coordinator.skip_maintenance(
        task_id=msg["task_id"],
        reason=msg.get("reason"),
    )
    connection.send_result(msg["id"], {"success": True})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/task/reset",
        vol.Required("entry_id"): str,
        vol.Required("task_id"): str,
        vol.Optional("date"): vol.Any(str, None),
    }
)
@websocket_api.async_response
async def ws_reset_task(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Reset the last performed date."""
    from datetime import date as date_cls

    rd = _get_runtime_data(hass, msg["entry_id"])
    if rd is None or rd.coordinator is None:
        connection.send_error(msg["id"], "not_found", "Coordinator not found")
        return

    reset_date = None
    if msg.get("date"):
        try:
            reset_date = date_cls.fromisoformat(msg["date"])
        except ValueError:
            connection.send_error(msg["id"], "invalid_date", "Invalid date format")
            return

    await rd.coordinator.reset_maintenance(
        task_id=msg["task_id"],
        date=reset_date,
    )
    connection.send_result(msg["id"], {"success": True})


# ---------------------------------------------------------------------------
# Templates
# ---------------------------------------------------------------------------


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
    from .templates import TEMPLATE_CATEGORIES, TEMPLATES

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


# ---------------------------------------------------------------------------
# Export
# ---------------------------------------------------------------------------


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
    from .export import export_maintenance_data  # noqa: PLC0415

    fmt = msg.get("format", "json")
    include_history = msg.get("include_history", True)
    result = export_maintenance_data(hass, fmt=fmt, include_history=include_history)
    connection.send_result(msg["id"], {"format": fmt, "data": result})


# ---------------------------------------------------------------------------
# Budget
# ---------------------------------------------------------------------------


@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/budget_status"}
)
@websocket_api.async_response
async def ws_get_budget_status(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return current budget status (monthly/yearly spent vs budget)."""
    from datetime import datetime as dt_cls  # noqa: PLC0415

    from .const import (  # noqa: PLC0415
        CONF_BUDGET_ALERT_THRESHOLD,
        CONF_BUDGET_MONTHLY,
        CONF_BUDGET_YEARLY,
    )

    # Get global options
    global_options: dict[str, Any] = {}
    for entry in hass.config_entries.async_entries(DOMAIN):
        if entry.unique_id == GLOBAL_UNIQUE_ID:
            global_options = entry.options or entry.data
            break

    monthly_budget = float(global_options.get(CONF_BUDGET_MONTHLY, 0))
    yearly_budget = float(global_options.get(CONF_BUDGET_YEARLY, 0))
    threshold_pct = int(global_options.get(CONF_BUDGET_ALERT_THRESHOLD, 80))

    now = dt_cls.now()
    monthly_spent = 0.0
    yearly_spent = 0.0

    entries = _get_object_entries(hass)
    for entry in entries:
        tasks_data = entry.data.get("tasks", {})
        for _tid, tdata in tasks_data.items():
            for h_entry in tdata.get("history", []):
                if h_entry.get("type") != "completed":
                    continue
                cost = h_entry.get("cost")
                if cost is None:
                    continue
                ts = h_entry.get("timestamp", "")
                try:
                    entry_dt = dt_cls.fromisoformat(ts)
                except (ValueError, TypeError):
                    continue
                if entry_dt.year == now.year:
                    yearly_spent += cost
                    if entry_dt.month == now.month:
                        monthly_spent += cost

    connection.send_result(
        msg["id"],
        {
            "monthly_budget": monthly_budget,
            "monthly_spent": round(monthly_spent, 2),
            "yearly_budget": yearly_budget,
            "yearly_spent": round(yearly_spent, 2),
            "alert_threshold_pct": threshold_pct,
        },
    )


# ---------------------------------------------------------------------------
# CSV Import/Export
# ---------------------------------------------------------------------------


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
    from .helpers.csv_handler import export_objects_csv  # noqa: PLC0415

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
    from .helpers.csv_handler import import_objects_csv  # noqa: PLC0415

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


# ---------------------------------------------------------------------------
# Groups
# ---------------------------------------------------------------------------


def _get_global_entry(hass: HomeAssistant) -> ConfigEntry | None:
    """Get the global config entry."""
    for entry in hass.config_entries.async_entries(DOMAIN):
        if entry.unique_id == GLOBAL_UNIQUE_ID:
            return entry
    return None


@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/groups"}
)
@websocket_api.async_response
async def ws_get_groups(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return all maintenance groups."""
    from .const import CONF_GROUPS  # noqa: PLC0415

    global_entry = _get_global_entry(hass)
    if global_entry is None:
        connection.send_result(msg["id"], {"groups": {}})
        return

    options = global_entry.options or global_entry.data
    groups = options.get(CONF_GROUPS, {})
    connection.send_result(msg["id"], {"groups": groups})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/group/create",
        vol.Required("name"): str,
        vol.Optional("description", default=""): str,
        vol.Optional("task_refs", default=[]): [
            {
                vol.Required("entry_id"): str,
                vol.Required("task_id"): str,
            }
        ],
    }
)
@websocket_api.async_response
async def ws_create_group(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Create a new maintenance group."""
    from .const import CONF_GROUPS  # noqa: PLC0415

    global_entry = _get_global_entry(hass)
    if global_entry is None:
        connection.send_error(msg["id"], "not_found", "Global config not found")
        return

    group_id = uuid4().hex
    options = dict(global_entry.options or global_entry.data)
    groups = dict(options.get(CONF_GROUPS, {}))
    groups[group_id] = {
        "name": msg["name"],
        "description": msg.get("description", ""),
        "task_refs": msg.get("task_refs", []),
    }
    options[CONF_GROUPS] = groups
    hass.config_entries.async_update_entry(global_entry, options=options)

    connection.send_result(msg["id"], {"group_id": group_id})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/group/update",
        vol.Required("group_id"): str,
        vol.Optional("name"): str,
        vol.Optional("description"): str,
        vol.Optional("task_refs"): [
            {
                vol.Required("entry_id"): str,
                vol.Required("task_id"): str,
            }
        ],
    }
)
@websocket_api.async_response
async def ws_update_group(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Update an existing maintenance group."""
    from .const import CONF_GROUPS  # noqa: PLC0415

    global_entry = _get_global_entry(hass)
    if global_entry is None:
        connection.send_error(msg["id"], "not_found", "Global config not found")
        return

    options = dict(global_entry.options or global_entry.data)
    groups = dict(options.get(CONF_GROUPS, {}))
    group_id = msg["group_id"]

    if group_id not in groups:
        connection.send_error(msg["id"], "not_found", "Group not found")
        return

    group = dict(groups[group_id])
    if "name" in msg:
        group["name"] = msg["name"]
    if "description" in msg:
        group["description"] = msg["description"]
    if "task_refs" in msg:
        group["task_refs"] = msg["task_refs"]

    groups[group_id] = group
    options[CONF_GROUPS] = groups
    hass.config_entries.async_update_entry(global_entry, options=options)

    connection.send_result(msg["id"], {"success": True})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/group/delete",
        vol.Required("group_id"): str,
    }
)
@websocket_api.async_response
async def ws_delete_group(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Delete a maintenance group."""
    from .const import CONF_GROUPS  # noqa: PLC0415

    global_entry = _get_global_entry(hass)
    if global_entry is None:
        connection.send_error(msg["id"], "not_found", "Global config not found")
        return

    options = dict(global_entry.options or global_entry.data)
    groups = dict(options.get(CONF_GROUPS, {}))
    group_id = msg["group_id"]

    if group_id not in groups:
        connection.send_error(msg["id"], "not_found", "Group not found")
        return

    del groups[group_id]
    options[CONF_GROUPS] = groups
    hass.config_entries.async_update_entry(global_entry, options=options)

    connection.send_result(msg["id"], {"success": True})


# ---------------------------------------------------------------------------
# Adaptive Scheduling
# ---------------------------------------------------------------------------


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/task/analyze_interval",
        vol.Required("entry_id"): str,
        vol.Required("task_id"): str,
    }
)
@websocket_api.async_response
async def ws_analyze_interval(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return full interval analysis for a task (on-demand)."""
    from .helpers.interval_analyzer import IntervalAnalyzer  # noqa: PLC0415

    entry = hass.config_entries.async_get_entry(msg["entry_id"])
    if entry is None or entry.domain != DOMAIN or entry.unique_id == GLOBAL_UNIQUE_ID:
        connection.send_error(msg["id"], "not_found", "Object not found")
        return

    tasks_data = entry.data.get(CONF_TASKS, {})
    task_id = msg["task_id"]
    if task_id not in tasks_data:
        connection.send_error(msg["id"], "not_found", "Task not found")
        return

    task_data = tasks_data[task_id]
    adaptive_config = dict(task_data.get("adaptive_config", {}))

    # Inject hemisphere and current month for seasonal awareness
    from datetime import datetime as dt_cls  # noqa: PLC0415

    adaptive_config["hemisphere"] = (
        "south" if hass.config.latitude < 0 else "north"
    )
    adaptive_config["_current_month"] = dt_cls.now().month

    analyzer = IntervalAnalyzer()
    analysis = analyzer.analyze(task_data, adaptive_config)

    connection.send_result(
        msg["id"],
        {
            "current_interval": analysis.current_interval,
            "average_actual_interval": analysis.average_actual_interval,
            "interval_std_dev": analysis.interval_std_dev,
            "ewa_prediction": analysis.ewa_prediction,
            "weibull_prediction": analysis.weibull_prediction,
            "weibull_beta": analysis.weibull_beta,
            "weibull_eta": analysis.weibull_eta,
            "recommended_interval": analysis.recommended_interval,
            "confidence": analysis.confidence,
            "feedback_count": analysis.feedback_count,
            "data_points": analysis.data_points,
            "recommendation_reason": analysis.recommendation_reason,
            "seasonal_factor": analysis.seasonal_factor,
            "seasonal_factors": analysis.seasonal_factors,
            "seasonal_reason": analysis.seasonal_adjustment_reason,
            "weibull_r_squared": analysis.weibull_r_squared,
            "confidence_interval_low": analysis.confidence_interval_low,
            "confidence_interval_high": analysis.confidence_interval_high,
        },
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/task/apply_suggestion",
        vol.Required("entry_id"): str,
        vol.Required("task_id"): str,
        vol.Required("interval"): int,
    }
)
@websocket_api.async_response
async def ws_apply_suggestion(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Apply a suggested interval to a task."""
    rd = _get_runtime_data(hass, msg["entry_id"])
    if rd is None or rd.coordinator is None:
        connection.send_error(msg["id"], "not_found", "Coordinator not found")
        return

    await rd.coordinator.async_apply_suggested_interval(
        task_id=msg["task_id"],
        interval=msg["interval"],
    )
    connection.send_result(msg["id"], {"success": True})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/task/seasonal_overrides",
        vol.Required("entry_id"): str,
        vol.Required("task_id"): str,
        vol.Required("overrides"): dict,
    }
)
@websocket_api.async_response
async def ws_seasonal_overrides(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Set manual seasonal overrides for a task.

    Overrides is a dict of {month_num: factor}, e.g. {7: 0.5, 1: 2.0}.
    Keys must be 1-12, values must be 0.1-5.0.
    Pass empty dict {} to clear all overrides.
    """
    entry = hass.config_entries.async_get_entry(msg["entry_id"])
    if entry is None or entry.domain != DOMAIN or entry.unique_id == GLOBAL_UNIQUE_ID:
        connection.send_error(msg["id"], "not_found", "Object not found")
        return

    task_id = msg["task_id"]
    tasks_data = dict(entry.data.get(CONF_TASKS, {}))
    if task_id not in tasks_data:
        connection.send_error(msg["id"], "not_found", "Task not found")
        return

    # Validate overrides
    overrides = msg["overrides"]
    validated: dict[int, float] = {}
    for key, value in overrides.items():
        try:
            month = int(key)
            factor = float(value)
        except (ValueError, TypeError):
            connection.send_error(
                msg["id"], "invalid_input",
                f"Invalid override: key={key}, value={value}"
            )
            return
        if month < 1 or month > 12:
            connection.send_error(
                msg["id"], "invalid_input",
                f"Month must be 1-12, got {month}"
            )
            return
        if factor < 0.1 or factor > 5.0:
            connection.send_error(
                msg["id"], "invalid_input",
                f"Factor must be 0.1-5.0, got {factor}"
            )
            return
        validated[month] = round(factor, 2)

    # Persist overrides in adaptive_config
    task = dict(tasks_data[task_id])
    adaptive_config = dict(task.get("adaptive_config", {}))
    if validated:
        adaptive_config["seasonal_overrides"] = validated
    else:
        adaptive_config.pop("seasonal_overrides", None)
    task["adaptive_config"] = adaptive_config
    tasks_data[task_id] = task

    new_data = dict(entry.data)
    new_data[CONF_TASKS] = tasks_data
    hass.config_entries.async_update_entry(entry, data=new_data)

    # Refresh coordinator
    rd = _get_runtime_data(hass, entry.entry_id)
    if rd and rd.coordinator:
        await rd.coordinator.async_request_refresh()

    connection.send_result(msg["id"], {"success": True, "overrides": validated})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/task/set_environmental_entity",
        vol.Required("entry_id"): str,
        vol.Required("task_id"): str,
        vol.Optional("environmental_entity"): vol.Any(str, None),
        vol.Optional("environmental_attribute"): vol.Any(str, None),
    }
)
@websocket_api.async_response
async def ws_set_environmental_entity(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Set or clear the environmental entity for sensor-driven predictions.

    When set, the environmental sensor (e.g. outdoor temperature) is
    correlated with maintenance intervals to produce an adjustment factor.
    Pass environmental_entity=null to clear the binding.
    """
    entry = hass.config_entries.async_get_entry(msg["entry_id"])
    if entry is None or entry.domain != DOMAIN or entry.unique_id == GLOBAL_UNIQUE_ID:
        connection.send_error(msg["id"], "not_found", "Object not found")
        return

    task_id = msg["task_id"]
    tasks_data = dict(entry.data.get(CONF_TASKS, {}))
    if task_id not in tasks_data:
        connection.send_error(msg["id"], "not_found", "Task not found")
        return

    task = dict(tasks_data[task_id])
    adaptive_config = dict(task.get("adaptive_config", {}))

    env_entity = msg.get("environmental_entity")
    env_attribute = msg.get("environmental_attribute")

    if env_entity:
        adaptive_config["environmental_entity"] = env_entity
        if env_attribute:
            adaptive_config["environmental_attribute"] = env_attribute
        else:
            adaptive_config.pop("environmental_attribute", None)
    else:
        # Clear environmental binding
        adaptive_config.pop("environmental_entity", None)
        adaptive_config.pop("environmental_attribute", None)

    task["adaptive_config"] = adaptive_config
    tasks_data[task_id] = task

    new_data = dict(entry.data)
    new_data[CONF_TASKS] = tasks_data
    hass.config_entries.async_update_entry(entry, data=new_data)

    # Refresh coordinator
    rd = _get_runtime_data(hass, entry.entry_id)
    if rd and rd.coordinator:
        await rd.coordinator.async_request_refresh()

    connection.send_result(
        msg["id"],
        {
            "success": True,
            "environmental_entity": env_entity,
            "environmental_attribute": env_attribute,
        },
    )


# ---------------------------------------------------------------------------
# QR Code Generation
# ---------------------------------------------------------------------------


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/qr/generate",
        vol.Required("entry_id"): str,
        vol.Optional("task_id"): str,
        vol.Optional("action", default="view"): vol.In(["view", "complete"]),
        vol.Optional("base_url"): str,
        vol.Optional("scale", default=8): vol.All(int, vol.Range(min=2, max=20)),
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
    url = build_qr_url(hass, entry_id, task_id=task_id, action=action, base_url_override=base_url)
    svg_data_uri = generate_qr_svg_data_uri(url, border=2)

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
