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

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from homeassistant.util import dt as dt_util

from ..const import CONF_OBJECT, CONF_PARTS, CONF_TASKS, DOMAIN
from .battery_fleet import _norm_type, discover_battery_types, lifetime_months, read_batteries

# The global aggregate sensor the fleet task triggers on (fixed entity_id).
LOW_COUNT_ENTITY_ID = "sensor.maintenance_supporter_batteries_to_replace"

# Marker on the object + task so the panel renders the battery detail section
# and setup is idempotent (never a second fleet).
OBJECT_FLAG = "battery_fleet"
TASK_FLAG = "battery_fleet_task"


def find_fleet_entry(hass: HomeAssistant) -> ConfigEntry | None:
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
        repaired = await _reconcile_fleet_task(hass, existing)
        return {
            "entry_id": existing.entry_id,
            "created": False,
            "types": list(types),
            "parts_added": added,
            "task_repaired": repaired,
        }

    entry_id = await async_create_object(hass, name="Battery Fleet")
    entry = hass.config_entries.async_get_entry(entry_id)
    if entry is None:  # pragma: no cover — just created above
        raise HomeAssistantError("Battery Fleet object entry vanished after creation")

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
        "trigger_config": _fleet_trigger_config(),
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


def _fleet_trigger_config() -> dict[str, Any]:
    """The canonical fleet-task trigger: threshold >0 on the low-count sensor.

    Carries BOTH the singular ``entity_id`` and plural ``entity_ids`` — the
    task-dialog's save path gates on the singular field, and a (possibly
    cached) frontend that hydrates only ``entity_id`` would otherwise wipe
    the trigger on an unrelated edit (issue #106).
    """
    return {
        "type": "threshold",
        "entity_id": LOW_COUNT_ENTITY_ID,
        "entity_ids": [LOW_COUNT_ENTITY_ID],
        "trigger_above": 0,
        "entity_logic": "any",
        "auto_complete_on_recovery": True,
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


def replaced_button_for(battery_plus_entity_id: str) -> str:
    """The Battery Notes 'replaced' button entity id for a battery_plus sensor.

    Battery Notes mints them in parallel: sensor.<x>_battery_plus ->
    button.<x>_battery_replaced.
    """
    return battery_plus_entity_id.replace("sensor.", "button.", 1).replace("_battery_plus", "_battery_replaced")


async def async_mark_replaced(hass: HomeAssistant, entity_ids: list[str] | None = None) -> dict[str, Any]:
    """Mark batteries replaced: press their Battery Notes 'replaced' button
    (records the replacement date → resets the forecast) and consume the
    matching type-part spares from stock.

    ``entity_ids`` = battery_plus sensors to mark; default = all currently low.
    The fleet task auto-completes on its own once the devices report fresh
    (low count → 0), so this does NOT complete the task directly (which would
    race that recovery).
    """
    by_eid = {b.entity_id: b for b in read_batteries(hass)}
    targets = entity_ids if entity_ids is not None else [e for e, b in by_eid.items() if b.low]

    pressed = 0
    by_type: dict[str, int] = {}
    for eid in targets:
        bat = by_eid.get(eid)
        if bat is None:
            continue
        button = replaced_button_for(eid)
        if hass.states.get(button) is not None:
            await hass.services.async_call("button", "press", {"entity_id": button}, blocking=False)
            pressed += 1
        t = _norm_type(bat.battery_type)
        by_type[t] = by_type.get(t, 0) + bat.quantity

    consumed: dict[str, int] = {}
    fleet = find_fleet_entry(hass)
    if fleet is not None and by_type:
        from ..parts_runtime import async_change_part_stock

        parts = fleet.data.get(CONF_PARTS) or {}
        for btype, qty in by_type.items():
            pid = f"batt_{btype.lower()}"
            if pid in parts:
                await async_change_part_stock(hass, fleet, pid, delta=-qty)
                consumed[pid] = qty

    return {"marked": len(targets), "pressed": pressed, "consumed": consumed}


def find_fleet_task(entry: ConfigEntry) -> tuple[str, dict[str, Any]] | None:
    """The flagged fleet task (id, data) on the fleet entry, or None."""
    for task_id, task_data in (entry.data.get(CONF_TASKS) or {}).items():
        if task_data.get(TASK_FLAG):
            return task_id, task_data
    return None


def fleet_task_trigger_ok(entry: ConfigEntry) -> bool:
    """Whether the fleet task exists and still carries a usable trigger.

    A user edit can wipe the trigger (issue #106: the dialog nulled a trigger
    stored with only the plural ``entity_ids``); without it the task never
    fires or auto-completes. This is the health signal behind the repair path.
    """
    found = find_fleet_task(entry)
    if found is None:
        return False
    tc = found[1].get("trigger_config") or {}
    eids = tc.get("entity_ids") or ([tc["entity_id"]] if tc.get("entity_id") else [])
    return tc.get("type") == "threshold" and LOW_COUNT_ENTITY_ID in eids


async def _reconcile_fleet_task(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Repair the fleet task if broken. Returns True when something was fixed.

    * Trigger lost (issue #106) → restore the canonical threshold trigger,
      keeping the user's name/type/translations untouched.
    * Task deleted entirely → recreate it fresh.
    """
    from ..websocket.tasks_persist import async_persist_task

    if fleet_task_trigger_ok(entry):
        return False

    found = find_fleet_task(entry)
    if found is not None:
        task_id, task_data = found
        new_task = dict(task_data)
        new_task["trigger_config"] = _fleet_trigger_config()
        new_data = dict(entry.data)
        new_tasks = dict(new_data.get(CONF_TASKS, {}))
        new_tasks[task_id] = new_task
        new_data[CONF_TASKS] = new_tasks
        hass.config_entries.async_update_entry(entry, data=new_data)
        await hass.config_entries.async_reload(entry.entry_id)
        return True

    obj = entry.data.get(CONF_OBJECT, {})
    task = {
        "id": uuid4().hex,
        "object_id": obj.get("id", ""),
        "name": "Replace low batteries",
        "type": "inspection",
        "enabled": True,
        TASK_FLAG: True,
        "schedule": {"kind": "manual"},
        "trigger_config": _fleet_trigger_config(),
        "created_at": dt_util.now().date().isoformat(),
        "notes": ("Aggregate battery check. The detail view lists which devices are low and which battery types to buy."),
    }
    await async_persist_task(hass, entry, task)
    return True


def _reconcile_type_parts(hass: HomeAssistant, entry: ConfigEntry, types: dict[str, int]) -> int:
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
