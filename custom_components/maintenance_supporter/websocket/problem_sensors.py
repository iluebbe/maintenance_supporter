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

from ..const import CONF_OBJECT, DOMAIN, MAX_ENTITY_ID_LENGTH, MAX_NAME_LENGTH, TRIGGER_FIELD_RANGES
from ..helpers.permissions import require_write
from ..helpers.problem_sensors import (
    build_problem_task,
    discover_problem_sensors,
    pop_stashed_config,
    sensor_covered_by,
)
from . import ID_FIELD
from .adopt_batch import AdoptBatch


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/problem_sensors/discover"})
@websocket_api.async_response
async def ws_discover_problem_sensors(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """List adoptable problem sensors (not already watched by a task)."""
    connection.send_result(msg["id"], {"sensors": discover_problem_sensors(hass)})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/problem_sensors/preview",
        vol.Required("selections"): vol.All(
            [
                vol.Schema(
                    {
                        vol.Required("entity_id"): vol.All(str, vol.Length(max=MAX_ENTITY_ID_LENGTH)),
                        vol.Required("name"): vol.All(str, vol.Length(min=1, max=MAX_NAME_LENGTH)),
                        vol.Optional("entry_id"): vol.Any(ID_FIELD, None),
                    }
                )
            ],
            vol.Length(max=100),
        ),
    }
)
@websocket_api.async_response
async def ws_preview_problem_sensors(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Judge each sensor against the object the dialog now sends it to
    (2.94): ``{covered: {entity_id: {task_id, name, reason} | null}}`` — the
    task that probably already watches this problem under another name.
    Read-only; a new object (no ``entry_id``) has nothing to cover."""
    from homeassistant.helpers import device_registry as dr
    from homeassistant.helpers import entity_registry as er

    from ..helpers.aggregate import is_object_entry

    ent_reg, dev_reg = er.async_get(hass), dr.async_get(hass)
    covered: dict[str, Any] = {}
    for sel in msg["selections"]:
        entry = hass.config_entries.async_get_entry(sel["entry_id"]) if sel.get("entry_id") else None
        if entry is not None and not is_object_entry(entry):
            entry = None
        ent = ent_reg.async_get(sel["entity_id"])
        device = dev_reg.async_get(ent.device_id) if ent and ent.device_id else None
        device_name = (device.name_by_user or device.name or "") if device else ""
        covered[sel["entity_id"]] = sensor_covered_by(hass, sel["entity_id"], sel["name"], entry, device_name)
    connection.send_result(msg["id"], {"covered": covered})


# The trigger hold-time bounds the flows and the WS validator use too.
_FOR_MINUTES = TRIGGER_FIELD_RANGES["trigger_for_minutes"]

_SELECTION_SCHEMA = vol.Schema(
    {
        vol.Required("entity_id"): vol.All(str, vol.Length(max=MAX_ENTITY_ID_LENGTH)),
        vol.Required("name"): vol.All(str, vol.Length(min=1, max=MAX_NAME_LENGTH)),
        # Existing target object; omit to create a fresh object for this device.
        vol.Optional("entry_id"): ID_FIELD,
        vol.Optional("object_name"): vol.All(str, vol.Length(min=1, max=MAX_NAME_LENGTH)),
        vol.Optional("device_id"): vol.Any(ID_FIELD, None),
        # Spare part to link as consumes_parts on the adopted task (discovery's
        # suggested_part_id) — completing the task then consumes/restocks it.
        vol.Optional("part_id"): vol.Any(ID_FIELD, None),
        # Responsible HA user for the created task (the adopt dialog offers one
        # picker applied to every selection). Wins over a stashed value.
        vol.Optional("responsible_user_id"): vol.Any(ID_FIELD, None),
        # #136: minutes the problem state must HOLD before the task triggers
        # (one dialog field applied to every selection). 0/omitted = trigger
        # on the first flicker, the pre-#136 behaviour.
        vol.Optional("for_minutes"): vol.Any(vol.All(int, vol.Range(min=_FOR_MINUTES[0], max=_FOR_MINUTES[1])), None),
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
    Selections in the same batch that carry the same ``object_name`` share ONE
    new object even when they belong to different devices (#188: "these four
    sensors are one thing"); the dialog resolves an existing object's name to
    its ``entry_id`` before sending, so the name match stays within the batch.
    """
    batch = AdoptBatch(hass)
    # Created tasks, in order — the dialog links "configure now" to the first.
    created: list[dict[str, str]] = []
    # Reuse an object created earlier in THIS batch for the same device, so two
    # sensors on one device don't spawn two objects.
    device_to_entry: dict[str, str] = {}
    # #188: ...and for the same object NAME (case-insensitive) — the way the
    # dialog lets the user say which sensors belong together.
    name_to_entry: dict[str, str] = {}

    # Reload the touched objects even when a selection blew up mid-way —
    # their tasks are already stored.
    try:
        for sel in msg["selections"]:
            entity_id = sel["entity_id"]
            entry_id = sel.get("entry_id")
            device_id = sel.get("device_id")
            group_name = str(sel.get("object_name") or "").strip().casefold()
            batch.begin()
            try:
                if not entry_id and device_id and device_id in device_to_entry:
                    entry_id = device_to_entry[device_id]
                if not entry_id and group_name and group_name in name_to_entry:
                    entry_id = name_to_entry[group_name]
                if not entry_id:
                    entry_id = await batch.create_object(
                        name=sel.get("object_name") or sel["name"],
                        ha_device_id=device_id or None,
                    )
                    if device_id:
                        device_to_entry[device_id] = entry_id
                    if group_name:
                        name_to_entry[group_name] = entry_id

                entry = batch.target_entry(entry_id)
                if entry is None:
                    batch.errors.append({"entity_id": entity_id, "reason": "target object not found"})
                    continue
                # 2.94: the sensor goes to THE object its device most likely is
                # (the dialog's default) and that object has no device yet —
                # link it, so the next discovery finds it by device, as the
                # suggested setups do. Any other pick stays unlinked.
                if device_id and not (entry.data.get(CONF_OBJECT) or {}).get("ha_device_id"):
                    from ..helpers.adopt_match import candidate_object

                    match = candidate_object(hass, device_id)
                    if match is not None and match["entry_id"] == entry.entry_id:
                        new_data = dict(entry.data)
                        new_data[CONF_OBJECT] = {**new_data.get(CONF_OBJECT, {}), "ha_device_id": device_id}
                        hass.config_entries.async_update_entry(entry, data=new_data)
                        entry = hass.config_entries.async_get_entry(entry.entry_id) or entry

                task = build_problem_task(entity_id, sel["name"], for_minutes=sel.get("for_minutes") or 0)
                task_data = {
                    "id": uuid4().hex,
                    "object_id": entry.data.get(CONF_OBJECT, {}).get("id", ""),
                    "name": task["name"],
                    "type": task["task_type"],
                    "enabled": True,
                    "schedule": task["schedule"],
                    "trigger_config": task["trigger_config"],
                }
                # Un-adopt → re-adopt: restore (and consume) the notes and one-time
                # setup the deleted predecessor task had accumulated for this
                # sensor. Restored part links are re-validated below alongside the
                # dialog's suggestion (the target object/parts may have changed).
                from ..const import CONF_PARTS
                from ..helpers.parts import sanitize_consumes_parts

                stashed = pop_stashed_config(hass, entity_id) or {}
                for field in ("notes", "responsible_user_id", "priority", "labels"):
                    if stashed.get(field):
                        task_data[field] = stashed[field]
                # An explicit dialog pick wins over the stashed responsible user.
                if sel.get("responsible_user_id"):
                    task_data["responsible_user_id"] = sel["responsible_user_id"]
                # Link the suggested spare part — or, absent one, the stashed link —
                # validated against the target object's parts (an unknown id is
                # silently dropped, same as the task-CRUD path).
                raw_links = (
                    [{"part_id": sel["part_id"], "quantity": 1}] if sel.get("part_id") else stashed.get("consumes_parts") or []
                )
                if raw_links:
                    # foreign_part_ids keeps pooled #111 cross-object links — the
                    # CRUD paths pass it, this copy had forgotten it (a re-adopted
                    # task silently lost its pooled part link).
                    from . import foreign_part_resolver

                    links = sanitize_consumes_parts(
                        raw_links,
                        set(entry.data.get(CONF_PARTS) or {}),
                        foreign_part_ids=foreign_part_resolver(hass),
                    )
                    if links:
                        task_data["consumes_parts"] = links
                # 2.95: the fingerprint — the sensor this task was adopted from.
                from ..helpers.task_origin import ORIGIN_KEY, problem_sensor_origin

                task_data[ORIGIN_KEY] = problem_sensor_origin(entity_id)
                await batch.persist_task(entry, task_data)
                created.append({"entry_id": entry_id, "task_id": task_data["id"], "name": task_data["name"]})
            except (ValueError, KeyError) as err:
                # Roll back an object created in THIS iteration whose task failed —
                # never leave an empty, task-less orphan object behind (and undo the
                # device/name reuse pointers so a later selection re-creates it).
                if await batch.fail({"entity_id": entity_id, "reason": str(err)}):
                    if device_id:
                        device_to_entry.pop(device_id, None)
                    if group_name:
                        name_to_entry.pop(group_name, None)
    finally:
        await batch.finish()
    connection.send_result(msg["id"], batch.result(created=created))
