"""WebSocket handlers for spare parts & consumables (part/*)."""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant
from homeassistant.helpers.typing import VolDictType

from ..const import BATTERY_FLEET_OBJECT_FLAG, BATTERY_FLEET_REMOVED_PARTS, CONF_OBJECT, CONF_PARTS, PARTS_COST_MODES
from ..helpers.aggregate import get_store, object_name
from ..helpers.entry_tasks import write_tasks
from ..helpers.parts import (
    MAX_PART_STOCK,
    MAX_PARTS_PER_OBJECT,
    REUSE_KINDS,
    PartValidationError,
    iter_part_links,
    normalize_part,
)
from ..helpers.permissions import require_write
from ..helpers.ws_errors import send_translated_error
from . import ID_FIELD, _get_runtime_data, _load_object_entry


def _parts_of(entry: Any) -> dict[str, dict[str, Any]]:
    parts = entry.data.get(CONF_PARTS)
    return dict(parts) if isinstance(parts, dict) else {}


def _persist_parts(hass: HomeAssistant, entry: Any, parts: dict[str, dict[str, Any]]) -> None:
    new_data = dict(entry.data)
    new_data[CONF_PARTS] = parts
    hass.config_entries.async_update_entry(entry, data=new_data)


_PART_FIELDS_SCHEMA: VolDictType = {
    vol.Required("name"): str,
    vol.Optional("mpn"): vol.Any(str, None),
    vol.Optional("gtin"): vol.Any(str, None),
    vol.Optional("vendor"): vol.Any(str, None),
    vol.Optional("storage_location"): vol.Any(str, None),
    vol.Optional("product_url"): vol.Any(str, None),
    vol.Optional("notes"): vol.Any(str, None),
    vol.Optional("unit"): vol.Any(str, None),
    vol.Optional("cost"): vol.Any(int, float, None),
    # Decimal thresholds (#98: "0.5 cans") — the schema said int and refused
    # the 0.5 the panel sends, although normalize_part accepts it.
    vol.Optional("reorder_threshold"): vol.Any(int, float, None),
    vol.Optional("restock_quantity"): vol.Any(int, float, None),
    vol.Optional("package_size"): vol.Any(int, float, None),
    vol.Optional("auto_buy_task"): bool,
    vol.Optional("doc_id"): vol.Any(ID_FIELD, None),
    # #208: what readies a used one again (charge, sharpen, ...); None = used up.
    vol.Optional("reuse"): vol.Any(vol.In(REUSE_KINDS), None),
    # #222: when this part counts as spending; None = the household setting.
    vol.Optional("cost_mode"): vol.Any(vol.In(PARTS_COST_MODES), None),
    # Initial / edited stock travels WITH the definition for dialog simplicity,
    # but is stored in the per-entry Store (dynamic), not entry.data — as does
    # the count of used ones waiting (#208).
    vol.Optional("stock"): vol.Any(int, float, None),
    vol.Optional("restoring"): vol.Any(vol.All(vol.Any(int, float), vol.Range(min=0, max=MAX_PART_STOCK)), None),
}


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/part/create",
        vol.Required("entry_id"): ID_FIELD,
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
        send_translated_error(connection, msg["id"], "limit_reached", f"At most {MAX_PARTS_PER_OBJECT} parts per object", translation_key="parts_limit", translation_placeholders={"max": str(MAX_PARTS_PER_OBJECT)})
        return
    try:
        # msg["id"] is the WS envelope's message id — NEVER the part id; force
        # a fresh uuid (normalize_part generates one when id is falsy).
        part = normalize_part({**msg, "id": None})
    except PartValidationError as err:
        connection.send_error(msg["id"], "invalid_input", str(err))
        return
    parts[part["id"]] = part
    _persist_parts(hass, entry, parts)

    stock = msg.get("stock")
    if stock is not None:
        from ..parts_runtime import async_change_part_stock

        pile = msg.get("restoring") if part.get("reuse") else None
        await async_change_part_stock(
            hass, entry, part["id"], absolute=float(stock), restoring=float(pile) if pile is not None else None
        )
    # Reload so the part's stock sensor appears (entities are created at setup).
    await hass.config_entries.async_reload(entry.entry_id)
    connection.send_result(msg["id"], {"part_id": part["id"]})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/part/update",
        vol.Required("entry_id"): ID_FIELD,
        vol.Required("part_id"): ID_FIELD,
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

    from ..parts_runtime import (
        async_change_part_stock,
        async_set_part_restoring,
        async_untrack_part_stock,
        schedule_buy_task_reconcile,
    )

    # #208: the waiting pile goes with the part's reuse — set when given, and
    # gone when the part is no longer reusable. Booked together with the
    # stock: a first count creates the stock the pile lives next to.
    pile: float | None = None
    if not part.get("reuse") and existing.get("reuse"):
        pile = 0.0
    elif part.get("reuse") and msg.get("restoring") is not None:
        pile = float(msg["restoring"])
    if "stock" in msg and msg.get("stock") is None:
        await async_untrack_part_stock(hass, entry, part["id"])
    elif "stock" in msg:
        await async_change_part_stock(hass, entry, part["id"], absolute=float(msg["stock"]), restoring=pile)
    elif pile is not None:
        await async_set_part_restoring(hass, entry, part["id"], pile)
    else:
        # Threshold/opt-in edits can change the desired buy-task set.
        schedule_buy_task_reconcile(hass, entry)
    # The stock sensor repaints its name and attributes: without a stock
    # change nothing told it the part was renamed (bug audit 2026-10-16).
    from homeassistant.helpers.dispatcher import async_dispatcher_send

    from ..parts_runtime import SIGNAL_PARTS_UPDATED

    async_dispatcher_send(hass, SIGNAL_PARTS_UPDATED, entry.entry_id)
    connection.send_result(msg["id"], {"success": True})


# str() of a voluptuous marker is its key name (Marker.__str__ -> str(schema)).
_PART_FIELD_KEYS = {str(k) for k in _PART_FIELDS_SCHEMA if str(k) not in ("stock", "restoring")}


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/part/delete",
        vol.Required("entry_id"): ID_FIELD,
        vol.Required("part_id"): ID_FIELD,
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

    # Prune every consumption link pointing at the deleted part: the task
    # level and each phase (#139), of this object's tasks and of the tasks
    # other objects draw on its pool with (#111). Only this object's own
    # task-level links were pruned; the rest dangled and raised a broken
    # part link repair on the next completion (DRY audit 2026-10-12, BI5-A3).
    from ..const import CONF_TASKS
    from ..helpers.parts import map_part_links

    part_id = msg["part_id"]

    def _pruned(task_entry_id: str, tasks: dict[str, Any]) -> tuple[dict[str, Any], bool]:
        def rewrite(link: dict[str, Any]) -> dict[str, Any] | None:
            owner = str(link.get("entry_id") or task_entry_id)
            return None if owner == entry.entry_id and str(link.get("part_id") or "") == part_id else link

        out, changed = dict(tasks), False
        for tid, td in tasks.items():
            if isinstance(td, dict):
                new, did = map_part_links(td, rewrite)
                if did:
                    out[tid], changed = new, True
        return out, changed

    new_data = dict(entry.data)
    new_data[CONF_PARTS] = parts
    new_data[CONF_TASKS], _ = _pruned(entry.entry_id, dict(new_data.get(CONF_TASKS) or {}))
    from ..helpers.aggregate import get_object_entries

    for other in get_object_entries(hass):
        if other.entry_id == entry.entry_id:
            continue
        other_tasks, changed = _pruned(other.entry_id, dict(other.data.get(CONF_TASKS) or {}))
        if changed:
            write_tasks(hass, other, other_tasks)
    # A deleted fleet type-part must STAY deleted: the start-up reconcile
    # re-minted ``batt_<type>`` on every boot while the type was still in
    # the fleet (bug review 2026-09-04). Tombstone it on the fleet object.
    obj = new_data.get(CONF_OBJECT) or {}
    if obj.get(BATTERY_FLEET_OBJECT_FLAG) is True and msg["part_id"].startswith("batt_"):
        obj = dict(obj)
        obj[BATTERY_FLEET_REMOVED_PARTS] = sorted(set(obj.get(BATTERY_FLEET_REMOVED_PARTS) or []) | {msg["part_id"]})
        new_data[CONF_OBJECT] = obj
    hass.config_entries.async_update_entry(entry, data=new_data)

    rd = _get_runtime_data(hass, entry.entry_id)
    if rd and rd.store:
        rd.store.remove_part(msg["part_id"])
        await rd.store.async_save()

    # Remove the part's stock sensor from the entity registry. Match from
    # the END: fleet part ids are ``batt_<type>`` and ``_part_batt_aa`` is a
    # prefix of ``_part_batt_aaa`` — the contained-segment match wiped the
    # AAA sensor's registry entry along with the AA part (bug review
    # 2026-09-04).
    from homeassistant.helpers import entity_registry as er

    ent_reg = er.async_get(hass)
    for ent_entry in er.async_entries_for_config_entry(ent_reg, entry.entry_id):
        if ent_entry.unique_id and ent_entry.unique_id.endswith(f"_part_{msg['part_id']}"):
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
        vol.Required("entry_id"): ID_FIELD,
        vol.Required("part_id"): ID_FIELD,
        # Either a relative delta (may be negative for corrections) or an
        # absolute count — exactly one.
        vol.Optional("delta"): vol.All(vol.Any(int, float), vol.Coerce(float), vol.Range(min=-MAX_PART_STOCK, max=MAX_PART_STOCK)),
        vol.Optional("absolute"): vol.All(vol.Any(int, float), vol.Coerce(float), vol.Range(min=0, max=MAX_PART_STOCK)),
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


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/part/use",
        vol.Required("entry_id"): ID_FIELD,
        vol.Required("part_id"): ID_FIELD,
        # How many were used; one when left out.
        vol.Optional("quantity"): vol.All(vol.Any(int, float), vol.Coerce(float), vol.Range(min=0, min_included=False, max=MAX_PART_STOCK)),
    }
)
@require_write
@websocket_api.async_response
async def ws_part_use(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Items of a part used outside a task (#226): off the stock like a
    completion's parts, a reusable part's used ones onto the pile."""
    entry = _load_object_entry(hass, connection, msg)
    if entry is None:
        return
    from ..parts_runtime import async_part_use

    result = await async_part_use(hass, entry, msg["part_id"], msg.get("quantity"))
    if result is None:
        connection.send_error(msg["id"], "not_found", "No part with a counted stock")
        return
    connection.send_result(msg["id"], result)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/part/ready_again",
        vol.Required("entry_id"): ID_FIELD,
        vol.Required("part_id"): ID_FIELD,
        # How many are ready again; all waiting ones when left out.
        vol.Optional("quantity"): vol.All(vol.Any(int, float), vol.Coerce(float), vol.Range(min=0, max=MAX_PART_STOCK)),
    }
)
@require_write
@websocket_api.async_response
async def ws_part_ready_again(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Used items of a reusable part are ready again (#208): charged,
    sharpened, cleaned, dried or refilled — back from the pile to the stock."""
    entry = _load_object_entry(hass, connection, msg)
    if entry is None:
        return
    from ..parts_runtime import async_part_ready_again

    result = await async_part_ready_again(hass, entry, msg["part_id"], msg.get("quantity"))
    if result is None:
        connection.send_error(msg["id"], "not_found", "No reusable part with a tracked stock")
        return
    connection.send_result(msg["id"], result)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "maintenance_supporter/part/dispose",
        vol.Required("entry_id"): ID_FIELD,
        vol.Required("part_id"): ID_FIELD,
        # How many are gone for good; one when left out.
        vol.Optional("quantity"): vol.All(vol.Any(int, float), vol.Coerce(float), vol.Range(min=0, max=MAX_PART_STOCK)),
    }
)
@require_write
@websocket_api.async_response
async def ws_part_dispose(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Used items of a reusable part are gone for good (#218): a dead cell,
    a blade past sharpening — off the pile, not back to the stock."""
    entry = _load_object_entry(hass, connection, msg)
    if entry is None:
        return
    from ..parts_runtime import async_part_dispose

    result = await async_part_dispose(hass, entry, msg["part_id"], msg.get("quantity"))
    if result is None:
        connection.send_error(msg["id"], "not_found", "No reusable part with a tracked stock")
        return
    connection.send_result(msg["id"], result)


@websocket_api.websocket_command({vol.Required("type"): "maintenance_supporter/parts/overview"})
@websocket_api.async_response
async def ws_parts_overview(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Instance-wide parts inventory (#130).

    Every part across all objects with its owner, live stock, low state and
    every consuming task — the object's own tasks and pooled #111 links from
    other objects. Read-only; the per-object CRUD stays on part/*.
    """
    from ..helpers.parts import is_part_low
    from . import _get_merged_tasks, _get_object_entries

    entries = _get_object_entries(hass)
    names = {e.entry_id: object_name(e) for e in entries}

    # (owner_entry_id, part_id) -> consuming task links, own AND pooled.
    consumers: dict[tuple[str, str], list[dict[str, Any]]] = {}
    for e in entries:
        for task_id, task in _get_merged_tasks(e).items():
            # Phase links (#139) consume too: listed like the task's own.
            for link in iter_part_links(task):
                if not link.get("part_id"):
                    continue
                owner = link.get("entry_id") or e.entry_id
                consumers.setdefault((owner, link["part_id"]), []).append(
                    {
                        "entry_id": e.entry_id,
                        "object_name": names.get(e.entry_id),
                        "task_id": task_id,
                        "task_name": task.get("name"),
                        "quantity": link.get("quantity", 1),
                        "pooled": owner != e.entry_id,
                    }
                )

    from ..helpers.shared_parts import live_parts

    rows: list[dict[str, Any]] = []
    for e in entries:
        parts = live_parts(hass, e)
        if not parts:
            continue
        store = get_store(hass, e.entry_id)
        for part_id, part in parts.items():
            stock = store.get_part_stock(part_id) if store is not None else None
            restoring = store.get_part_restoring(part_id) if store is not None else 0
            rows.append(
                {
                    **part,
                    "part_id": part_id,
                    "entry_id": e.entry_id,
                    "object_name": names.get(e.entry_id),
                    "stock": stock,
                    "restoring": restoring,
                    "low": is_part_low(part, stock, restoring),
                    "consumers": consumers.get((e.entry_id, part_id), []),
                }
            )
    rows.sort(key=lambda r: ((r.get("name") or "").casefold(), r.get("object_name") or ""))
    connection.send_result(msg["id"], {"parts": rows, "count": len(rows)})
