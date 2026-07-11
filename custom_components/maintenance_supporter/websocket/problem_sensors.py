"""WebSocket commands to discover + adopt HA problem sensors as tasks.

``problem_sensors/discover`` proposes adoptable ``device_class: problem`` binary
sensors; ``problem_sensors/adopt`` turns an explicit selection into
sensor-triggered tasks (creating a maintenance object per device when needed).
Adoption is admin-gated write; discovery is read (it only lists candidates).
"""

from __future__ import annotations

from typing import Any
from uuid import uuid4

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant

from ..const import CONF_OBJECT, DOMAIN, MAX_ENTITY_ID_LENGTH, MAX_ID_LENGTH, MAX_NAME_LENGTH
from ..helpers.permissions import require_write
from ..helpers.problem_sensors import build_problem_task, discover_problem_sensors


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/problem_sensors/discover"})
@websocket_api.async_response
async def ws_discover_problem_sensors(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """List adoptable problem sensors (not already watched by a task)."""
    connection.send_result(msg["id"], {"sensors": discover_problem_sensors(hass)})


_SELECTION_SCHEMA = vol.Schema(
    {
        vol.Required("entity_id"): vol.All(str, vol.Length(max=MAX_ENTITY_ID_LENGTH)),
        vol.Required("name"): vol.All(str, vol.Length(min=1, max=MAX_NAME_LENGTH)),
        # Existing target object; omit to create a fresh object for this device.
        vol.Optional("entry_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
        vol.Optional("object_name"): vol.All(str, vol.Length(min=1, max=MAX_NAME_LENGTH)),
        vol.Optional("device_id"): vol.Any(vol.All(str, vol.Length(max=MAX_ID_LENGTH)), None),
    }
)


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/problem_sensors/adopt",
        vol.Required("selections"): vol.All([_SELECTION_SCHEMA], vol.Length(min=1, max=100)),
    }
)
@require_write
@websocket_api.async_response
async def ws_adopt_problem_sensors(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Create a sensor-triggered task per selected problem sensor.

    Each selection attaches to its ``entry_id`` (an existing object) or, when
    omitted, to a freshly created object named ``object_name`` and bound to the
    sensor's ``device_id`` — so a second adoption on the same device reuses it.
    """
    from ..export import object_entries
    from ..websocket.objects import async_create_object
    from ..websocket.tasks_persist import async_persist_task

    selections = msg["selections"]
    tasks_created = 0
    objects_created = 0
    # Reuse an object created earlier in THIS batch for the same device, so two
    # sensors on one device don't spawn two objects.
    device_to_entry: dict[str, str] = {}
    errors: list[dict[str, str]] = []

    for sel in selections:
        entity_id = sel["entity_id"]
        entry_id = sel.get("entry_id")
        device_id = sel.get("device_id")
        created_entry_id: str | None = None  # object created in THIS iteration
        try:
            if not entry_id and device_id and device_id in device_to_entry:
                entry_id = device_to_entry[device_id]
            if not entry_id:
                entry_id = await async_create_object(
                    hass,
                    name=sel.get("object_name") or sel["name"],
                    ha_device_id=device_id or None,
                )
                created_entry_id = entry_id
                objects_created += 1
                if device_id:
                    device_to_entry[device_id] = entry_id

            entry = hass.config_entries.async_get_entry(entry_id)
            if entry is None or entry.domain != DOMAIN:
                errors.append({"entity_id": entity_id, "reason": "target object not found"})
                continue

            task = build_problem_task(entity_id, sel["name"])
            task_data = {
                "id": uuid4().hex,
                "object_id": entry.data.get(CONF_OBJECT, {}).get("id", ""),
                "name": task["name"],
                "type": task["task_type"],
                "enabled": True,
                "schedule": task["schedule"],
                "trigger_config": task["trigger_config"],
            }
            await async_persist_task(hass, entry, task_data)
            tasks_created += 1
        except (ValueError, KeyError) as err:
            errors.append({"entity_id": entity_id, "reason": str(err)})
            # Roll back an object created in THIS iteration whose task failed —
            # never leave an empty, task-less orphan object behind (and undo the
            # count + device-reuse pointer so a later selection re-creates it).
            if created_entry_id is not None:
                objects_created -= 1
                if device_id:
                    device_to_entry.pop(device_id, None)
                if hass.config_entries.async_get_entry(created_entry_id) is not None:
                    await hass.config_entries.async_remove(created_entry_id)

    result: dict[str, Any] = {
        "tasks_created": tasks_created,
        "objects_created": objects_created,
        "total": len(object_entries(hass)),
    }
    if errors:
        result["errors"] = errors
    connection.send_result(msg["id"], result)
