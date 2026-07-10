"""WebSocket handlers for spare parts & consumables (part/*)."""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant

from ..const import CONF_PARTS, MAX_ID_LENGTH
from ..helpers.parts import (
    MAX_PART_STOCK,
    MAX_PARTS_PER_OBJECT,
    PartValidationError,
    normalize_part,
)
from ..helpers.permissions import require_write
from . import _get_runtime_data, _load_object_entry


def _parts_of(entry: Any) -> dict[str, dict[str, Any]]:
    parts = entry.data.get(CONF_PARTS)
    return dict(parts) if isinstance(parts, dict) else {}


def _persist_parts(hass: HomeAssistant, entry: Any, parts: dict[str, dict[str, Any]]) -> None:
    new_data = dict(entry.data)
    new_data[CONF_PARTS] = parts
    hass.config_entries.async_update_entry(entry, data=new_data)


_PART_FIELDS_SCHEMA = {
    vol.Required("name"): str,
    vol.Optional("mpn"): vol.Any(str, None),
    vol.Optional("gtin"): vol.Any(str, None),
    vol.Optional("vendor"): vol.Any(str, None),
    vol.Optional("storage_location"): vol.Any(str, None),
    vol.Optional("product_url"): vol.Any(str, None),
    vol.Optional("notes"): vol.Any(str, None),
    vol.Optional("unit"): vol.Any(str, None),
    vol.Optional("cost"): vol.Any(int, float, None),
    vol.Optional("reorder_threshold"): vol.Any(int, None),
    vol.Optional("restock_quantity"): vol.Any(int, None),
    vol.Optional("auto_buy_task"): bool,
    vol.Optional("doc_id"): vol.Any(str, None),
    # Initial / edited stock travels WITH the definition for dialog simplicity,
    # but is stored in the per-entry Store (dynamic), not entry.data.
    vol.Optional("stock"): vol.Any(int, None),
}


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/part/create",
        vol.Required("entry_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
        **_PART_FIELDS_SCHEMA,
    }
)
@require_write
@websocket_api.async_response
async def ws_create_part(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Add a part to an object."""
    entry = _load_object_entry(hass, connection, msg)
    if entry is None:
        return
    parts = _parts_of(entry)
    if len(parts) >= MAX_PARTS_PER_OBJECT:
        connection.send_error(msg["id"], "limit_reached", f"At most {MAX_PARTS_PER_OBJECT} parts per object")
        return
    try:
        part = normalize_part(msg)
    except PartValidationError as err:
        connection.send_error(msg["id"], "invalid_input", str(err))
        return
    part["id"] = part["id"] if part["id"] not in parts else ""
    if not part["id"]:
        from uuid import uuid4

        part["id"] = uuid4().hex
    parts[part["id"]] = part
    _persist_parts(hass, entry, parts)

    stock = msg.get("stock")
    if stock is not None:
        from ..parts_runtime import async_change_part_stock

        await async_change_part_stock(hass, entry, part["id"], absolute=int(stock))
    # Reload so the part's stock sensor appears (entities are created at setup).
    await hass.config_entries.async_reload(entry.entry_id)
    connection.send_result(msg["id"], {"part_id": part["id"]})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/part/update",
        vol.Required("entry_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
        vol.Required("part_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
        **_PART_FIELDS_SCHEMA,
    }
)
@require_write
@websocket_api.async_response
async def ws_update_part(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Edit a part definition (and optionally its stock)."""
    entry = _load_object_entry(hass, connection, msg)
    if entry is None:
        return
    parts = _parts_of(entry)
    existing = parts.get(msg["part_id"])
    if existing is None:
        connection.send_error(msg["id"], "not_found", "Part not found")
        return
    payload = {**existing, **{k: v for k, v in msg.items() if k in _PART_FIELD_KEYS}}
    payload["id"] = msg["part_id"]
    try:
        part = normalize_part(payload)
    except PartValidationError as err:
        connection.send_error(msg["id"], "invalid_input", str(err))
        return
    parts[part["id"]] = part
    _persist_parts(hass, entry, parts)

    from ..parts_runtime import async_change_part_stock, schedule_buy_task_reconcile

    if "stock" in msg:
        stock = msg.get("stock")
        if stock is None:
            rd = _get_runtime_data(hass, entry.entry_id)
            if rd and rd.store:
                rd.store.set_part_stock(part["id"], None)
                await rd.store.async_save()
            schedule_buy_task_reconcile(hass, entry)
        else:
            await async_change_part_stock(hass, entry, part["id"], absolute=int(stock))
    else:
        # Threshold/opt-in edits can change the desired buy-task set.
        schedule_buy_task_reconcile(hass, entry)
    connection.send_result(msg["id"], {"success": True})


_PART_FIELD_KEYS = {k.schema for k in _PART_FIELDS_SCHEMA if str(k.schema) != "stock"}


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/part/delete",
        vol.Required("entry_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
        vol.Required("part_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
    }
)
@require_write
@websocket_api.async_response
async def ws_delete_part(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Remove a part: definition, stock state, task links, open buy task."""
    entry = _load_object_entry(hass, connection, msg)
    if entry is None:
        return
    parts = _parts_of(entry)
    if msg["part_id"] not in parts:
        connection.send_error(msg["id"], "not_found", "Part not found")
        return
    del parts[msg["part_id"]]

    # Prune task-side consumption links pointing at the deleted part.
    from ..const import CONF_TASK_CONSUMES_PARTS, CONF_TASKS

    new_data = dict(entry.data)
    new_data[CONF_PARTS] = parts
    tasks = dict(new_data.get(CONF_TASKS, {}))
    for tid, td in list(tasks.items()):
        links = td.get(CONF_TASK_CONSUMES_PARTS)
        if isinstance(links, list) and any(isinstance(x, dict) and x.get("part_id") == msg["part_id"] for x in links):
            td = dict(td)
            td[CONF_TASK_CONSUMES_PARTS] = [
                x for x in links if not (isinstance(x, dict) and x.get("part_id") == msg["part_id"])
            ]
            if not td[CONF_TASK_CONSUMES_PARTS]:
                td.pop(CONF_TASK_CONSUMES_PARTS, None)
            tasks[tid] = td
    new_data[CONF_TASKS] = tasks
    hass.config_entries.async_update_entry(entry, data=new_data)

    rd = _get_runtime_data(hass, entry.entry_id)
    if rd and rd.store:
        rd.store.remove_part(msg["part_id"])
        await rd.store.async_save()

    # Remove the part's stock sensor from the entity registry (same
    # contained-segment match the task delete uses; part ids are uuid4).
    from homeassistant.helpers import entity_registry as er

    ent_reg = er.async_get(hass)
    for ent_entry in er.async_entries_for_config_entry(ent_reg, entry.entry_id):
        if ent_entry.unique_id and f"_part_{msg['part_id']}" in ent_entry.unique_id:
            ent_reg.async_remove(ent_entry.entity_id)

    # The reconcile removes an open buy task for the now-gone part (it reloads
    # when it changes anything); reload here regardless so the sensor vanishes.
    from ..parts_runtime import schedule_buy_task_reconcile

    await hass.config_entries.async_reload(entry.entry_id)
    schedule_buy_task_reconcile(hass, entry)
    connection.send_result(msg["id"], {"success": True})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/part/restock",
        vol.Required("entry_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
        vol.Required("part_id"): vol.All(str, vol.Length(max=MAX_ID_LENGTH)),
        # Either a relative delta (may be negative for corrections) or an
        # absolute count — exactly one.
        vol.Optional("delta"): vol.All(int, vol.Range(min=-MAX_PART_STOCK, max=MAX_PART_STOCK)),
        vol.Optional("absolute"): vol.All(int, vol.Range(min=0, max=MAX_PART_STOCK)),
    }
)
@require_write
@websocket_api.async_response
async def ws_restock_part(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Adjust a part's on-hand stock (inventory correction / manual restock)."""
    entry = _load_object_entry(hass, connection, msg)
    if entry is None:
        return
    if ("delta" in msg) == ("absolute" in msg):
        connection.send_error(msg["id"], "invalid_input", "Provide exactly one of delta / absolute")
        return
    from ..parts_runtime import async_change_part_stock

    new = await async_change_part_stock(
        hass,
        entry,
        msg["part_id"],
        delta=msg.get("delta"),
        absolute=msg.get("absolute"),
    )
    if new is None:
        connection.send_error(msg["id"], "not_found", "Part not found")
        return
    connection.send_result(msg["id"], {"stock": new})
