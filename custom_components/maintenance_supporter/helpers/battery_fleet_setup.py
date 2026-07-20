"""One-click setup of the Battery Fleet: an object whose PARTS are battery
types and whose single task aggregates all low batteries.

Design (see helpers/battery_fleet.py for the aggregation): the fleet is ONE
object; each battery TYPE present becomes a tracked spare-part (so the existing
stock/reorder machinery handles "order in time"); ONE task "Replace low
batteries" hangs off the global battery-low count sensor via an ordinary
threshold trigger. No per-battery task.
"""

from __future__ import annotations

from typing import Any
from uuid import uuid4

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from ..const import CONF_OBJECT, CONF_PARTS, DOMAIN
from .battery_fleet import discover_battery_types, lifetime_months

# The global aggregate sensor the fleet task triggers on (fixed entity_id).
LOW_COUNT_ENTITY_ID = "sensor.maintenance_supporter_batteries_to_replace"

# Marker on the object + task so the panel renders the battery detail section
# and setup is idempotent (never a second fleet).
OBJECT_FLAG = "battery_fleet"
TASK_FLAG = "battery_fleet_task"


def find_fleet_entry(hass: HomeAssistant):
    """The existing Battery Fleet object entry, or None."""
    for entry in hass.config_entries.async_entries(DOMAIN):
        if entry.data.get(CONF_OBJECT, {}).get(OBJECT_FLAG):
            return entry
    return None


async def async_setup_battery_fleet(hass: HomeAssistant) -> dict[str, Any]:
    """Create (or return) the Battery Fleet object with type-parts + the task.

    Idempotent: a second call reconciles the type-parts against the current
    fleet (adds parts for newly-seen types) and returns the existing entry.
    """
    from ..websocket.objects import async_create_object
    from ..websocket.tasks_persist import async_persist_task
    from .parts import normalize_part

    types = discover_battery_types(hass)  # {TYPE: total_qty}

    existing = find_fleet_entry(hass)
    if existing is not None:
        added = _reconcile_type_parts(hass, existing, types)
        return {
            "entry_id": existing.entry_id,
            "created": False,
            "types": list(types),
            "parts_added": added,
        }

    entry_id = await async_create_object(hass, name="Battery Fleet")
    entry = hass.config_entries.async_get_entry(entry_id)

    # Flag the object + attach a type-part per battery type present.
    new_data = dict(entry.data)
    obj = dict(new_data.get(CONF_OBJECT, {}))
    obj[OBJECT_FLAG] = True
    new_data[CONF_OBJECT] = obj
    parts: dict[str, dict[str, Any]] = {}
    for btype, total_qty in types.items():
        part = normalize_part(_type_part(btype, total_qty))
        parts[part["id"]] = part
    new_data[CONF_PARTS] = parts
    hass.config_entries.async_update_entry(entry, data=new_data)

    # Track stock at 0 for each type (user counts their drawer later).
    rd = getattr(entry, "runtime_data", None)
    store = getattr(rd, "store", None) if rd else None
    if store is not None:
        for pid in parts:
            store.set_part_stock(pid, 0)
        await store.async_save()

    # The single aggregate task, triggered by the global low-count sensor.
    obj_id = obj.get("id", "")
    task = {
        "id": uuid4().hex,
        "object_id": obj_id,
        "name": "Replace low batteries",
        "type": "inspection",
        "enabled": True,
        TASK_FLAG: True,
        "schedule": {"kind": "manual"},
        "trigger_config": {
            "type": "threshold",
            "entity_ids": [LOW_COUNT_ENTITY_ID],
            "trigger_above": 0,
            "entity_logic": "any",
            "auto_complete_on_recovery": True,
        },
        "created_at": dt_util.now().date().isoformat(),
        "notes": ("Aggregate battery check. The detail view lists which devices are low and which battery types to buy."),
    }
    await async_persist_task(hass, entry, task)

    return {
        "entry_id": entry_id,
        "created": True,
        "types": list(types),
        "parts_added": len(parts),
        "task_id": task["id"],
    }


def _type_part(btype: str, total_qty: int) -> dict[str, Any]:
    """A spare-part definition for one battery type.

    reorder_threshold defaults to keeping a spare set roughly the size of the
    fleet's need for that type (min 2); restock is double that. auto_buy_task
    stays off so setup never spawns extra buy-tasks — the fleet task's detail
    is the shopping surface; the user can enable auto-buy per type later.
    """
    threshold = max(2, total_qty)
    return {
        "id": f"batt_{btype.lower()}",
        "name": f"{btype} battery",
        "unit": "pcs",
        "reorder_threshold": threshold,
        "restock_quantity": threshold * 2,
        "auto_buy_task": False,
        "notes": f"Typical service life ~{lifetime_months(btype)} months (editorial).",
    }


def _reconcile_type_parts(hass: HomeAssistant, entry, types: dict[str, int]) -> int:
    """Add parts for battery types newly seen since setup. Returns count added."""
    from .parts import normalize_part

    parts = dict(entry.data.get(CONF_PARTS) or {})
    existing_ids = set(parts)
    added = 0
    for btype, total_qty in types.items():
        pid = f"batt_{btype.lower()}"
        if pid not in existing_ids:
            parts[pid] = normalize_part(_type_part(btype, total_qty))
            added += 1
    if added:
        new_data = dict(entry.data)
        new_data[CONF_PARTS] = parts
        hass.config_entries.async_update_entry(entry, data=new_data)
    return added
