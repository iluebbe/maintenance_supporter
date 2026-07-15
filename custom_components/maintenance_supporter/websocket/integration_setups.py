"""WebSocket commands for integration-aware suggested setups (roadmap).

``integration_setups/discover`` lists devices of catalogued integrations
(helpers/integration_signatures — every signature verified against the
integration's source) whose consumable entities can back maintenance tasks;
``integration_setups/adopt`` creates the object (or extends the existing one on
that device) with the tasks and their sensor triggers PRE-WIRED. Discovery is
read; adoption is write, mirroring problem-sensor adoption.
"""

from __future__ import annotations

from typing import Any
from uuid import uuid4

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant

from ..const import CONF_OBJECT, DOMAIN, MAX_ID_LENGTH, MAX_NAME_LENGTH
from ..helpers.integration_signatures import (
    SIGNATURES,
    build_setup_trigger,
    discover_integration_setups,
)
from ..helpers.permissions import require_write


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/integration_setups/discover"})
@websocket_api.async_response
async def ws_discover_integration_setups(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """List suggested maintenance setups for catalogued integrations."""
    connection.send_result(msg["id"], {"setups": discover_integration_setups(hass)})


_SELECTION_SCHEMA = vol.Schema(
    {
        vol.Required("device_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
        # Existing target object; omit to create a fresh object for the device.
        vol.Optional("entry_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
        vol.Optional("object_name"): vol.All(str, vol.Length(min=1, max=MAX_NAME_LENGTH)),
        # Subset of suggested task names to adopt; omit = all suggested.
        vol.Optional("task_names"): vol.All(
            [vol.All(str, vol.Length(max=MAX_NAME_LENGTH))], vol.Length(max=20)
        ),
    }
)


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/integration_setups/adopt",
        vol.Required("selections"): vol.All([_SELECTION_SCHEMA], vol.Length(min=1, max=50)),
    }
)
@require_write
@websocket_api.async_response
async def ws_adopt_integration_setups(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Create sensor-wired maintenance tasks for the selected suggestions."""
    from ..export import object_entries
    from ..helpers.i18n import normalize_language
    from ..templates import localize_template_text
    from .objects import async_create_object
    from .tasks_persist import async_persist_task

    lang = normalize_language(hass)
    # Re-run discovery server-side: the wiring (entities, thresholds) comes
    # from the verified catalog, never from the client.
    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    tasks_created = 0
    objects_created = 0
    errors: list[dict[str, str]] = []

    for sel in msg["selections"]:
        device_id = sel["device_id"]
        setup = setups.get(device_id)
        if setup is None:
            errors.append({"device_id": device_id, "reason": "no suggestion for this device"})
            continue
        wanted = set(sel.get("task_names") or [t["task_name"] for t in setup["tasks"]])
        sig_by_name = {
            s.task_name: s for s in SIGNATURES[setup["integration"]].tasks
        }
        created_entry_id: str | None = None
        try:
            entry_id = sel.get("entry_id") or setup["suggested_entry_id"]
            if not entry_id:
                entry_id = await async_create_object(
                    hass,
                    name=sel.get("object_name") or setup["suggested_object_name"],
                    ha_device_id=device_id,
                )
                created_entry_id = entry_id
                objects_created += 1

            entry = hass.config_entries.async_get_entry(entry_id)
            if entry is None or entry.domain != DOMAIN:
                errors.append({"device_id": device_id, "reason": "target object not found"})
                continue

            for task in setup["tasks"]:
                if task["task_name"] not in wanted:
                    continue
                sig = sig_by_name[task["task_name"]]
                await async_persist_task(
                    hass,
                    entry,
                    {
                        "id": uuid4().hex,
                        "object_id": entry.data.get(CONF_OBJECT, {}).get("id", ""),
                        "name": localize_template_text(task["task_name"], lang) or task["task_name"],
                        "type": "replacement",
                        "enabled": True,
                        "schedule": {"kind": "manual"},
                        "trigger_config": build_setup_trigger(sig, hass, task["entity_ids"]),
                    },
                )
                tasks_created += 1
        except (ValueError, KeyError) as err:
            errors.append({"device_id": device_id, "reason": str(err)})
            if created_entry_id is not None:
                objects_created -= 1
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
