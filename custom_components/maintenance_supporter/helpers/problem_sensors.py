"""Adopt HA problem sensors as sensor-triggered maintenance tasks.

Many integrations expose ``binary_sensor`` entities with
``device_class: problem`` — printer errors, filter warnings, low-battery
alerts. This turns a *selected* set of them into maintenance tasks that use the
existing sensor-trigger pipeline: the task triggers while the problem is active
(``state_change`` to ``on``) and auto-completes when it clears
(``auto_complete_on_recovery``), so a one-off appliance fault lands in the same
inbox, history and reminders as planned maintenance.

Opt-in by design: discovery only *proposes*, and adoption acts on an explicit
selection — a chatty integration can never flood the task list on its own. The
pure discovery/build logic lives here; the WS layer wires it to hass.
"""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er

from ..const import CONF_OBJECT, CONF_TASKS, DOMAIN, GLOBAL_UNIQUE_ID

PROBLEM_DEVICE_CLASS = "problem"

# Words too generic to establish a sensor↔part relationship on their own
# ("Printer problem" must not match a part just because it's ON the printer).
_MATCH_STOPWORDS = frozenset(
    {"problem", "low", "empty", "sensor", "status", "warning", "error", "alert", "the", "and"}
)


def _name_tokens(name: str) -> set[str]:
    """Meaningful lowercase tokens (≥3 chars, stopwords removed) of a name."""
    import re

    return {
        tok
        for tok in re.split(r"[^a-z0-9]+", name.lower())
        if len(tok) >= 3 and tok not in _MATCH_STOPWORDS
    }


def match_part_for_sensor(sensor_name: str, parts: dict[str, Any]) -> tuple[str, str] | None:
    """The object's spare part that best matches a problem sensor's name.

    A toner-low sensor on a printer should suggest the "Toner cartridge" part:
    match = shared meaningful name token (case-insensitive, stopwords ignored).
    Returns ``(part_id, part_name)`` of the best (most-overlapping) match, or
    ``None`` — deliberately conservative: no token overlap, no suggestion.
    """
    sensor_tokens = _name_tokens(sensor_name)
    if not sensor_tokens or not isinstance(parts, dict):
        return None
    best: tuple[int, str, str] | None = None
    for part_id, part in parts.items():
        if not isinstance(part, dict):
            continue
        part_name = str(part.get("name") or "")
        overlap = len(_name_tokens(part_name) & sensor_tokens)
        if overlap and (best is None or overlap > best[0]):
            best = (overlap, str(part_id), part_name)
    return (best[1], best[2]) if best else None


def _adopted_entity_ids(hass: HomeAssistant) -> set[str]:
    """Every entity id already watched by some task's trigger — so discovery
    hides sensors that are already adopted (or manually wired to a trigger)."""
    from ..entity.triggers import normalize_entity_ids

    watched: set[str] = set()
    for entry in hass.config_entries.async_entries(DOMAIN):
        if entry.unique_id == GLOBAL_UNIQUE_ID:
            continue
        for task in entry.data.get(CONF_TASKS, {}).values():
            tc = task.get("trigger_config")
            if isinstance(tc, dict):
                watched.update(normalize_entity_ids(tc))
    return watched


def _object_by_device(hass: HomeAssistant) -> dict[str, dict[str, str]]:
    """{ha_device_id: {entry_id, name}} for objects already attached to a device."""
    out: dict[str, dict[str, str]] = {}
    for entry in hass.config_entries.async_entries(DOMAIN):
        if entry.unique_id == GLOBAL_UNIQUE_ID:
            continue
        obj = entry.data.get(CONF_OBJECT, {})
        dev = obj.get("ha_device_id")
        if dev:
            out[dev] = {"entry_id": entry.entry_id, "name": obj.get("name", entry.title)}
    return out


def discover_problem_sensors(hass: HomeAssistant) -> list[dict[str, Any]]:
    """Propose adoptable problem sensors (not already watched by a task).

    Each candidate carries what the picker needs to render + a suggested target
    object: the maintenance object already attached to the sensor's HA device,
    if any, else a name derived from the device/entity for a fresh object.
    """
    adopted = _adopted_entity_ids(hass)
    by_device = _object_by_device(hass)
    ent_reg = er.async_get(hass)
    dev_reg = dr.async_get(hass)
    area_reg = ar.async_get(hass)

    out: list[dict[str, Any]] = []
    for state in hass.states.async_all("binary_sensor"):
        if state.attributes.get("device_class") != PROBLEM_DEVICE_CLASS:
            continue
        if state.entity_id in adopted:
            continue

        name = state.attributes.get("friendly_name") or state.entity_id
        ent = ent_reg.async_get(state.entity_id)
        # Skip our OWN per-task "overdue" binary sensors — they carry
        # device_class: problem too, and adopting them would be circular.
        if ent is not None and ent.platform == DOMAIN:
            continue
        device_id = ent.device_id if ent else None
        device_name = ""
        area_name = ""
        if device_id and (dev := dev_reg.async_get(device_id)):
            device_name = dev.name_by_user or dev.name or ""
            area_id = dev.area_id
            if area_id and (area := area_reg.async_get_area(area_id)):
                area_name = area.name
        # Suggested target: existing object on this device, else a fresh one.
        suggested = by_device.get(device_id) if device_id else None
        # Suggested spare part: when the target object already exists and has a
        # part whose name matches the sensor's (toner-low ↔ "Toner cartridge"),
        # adoption can pre-link it so completing the task consumes/restocks it.
        suggested_part: tuple[str, str] | None = None
        if suggested is not None:
            from ..const import CONF_PARTS

            target_entry = hass.config_entries.async_get_entry(suggested["entry_id"])
            if target_entry is not None:
                suggested_part = match_part_for_sensor(name, target_entry.data.get(CONF_PARTS) or {})
        out.append(
            {
                "entity_id": state.entity_id,
                "name": name,
                "state": state.state,  # "on" = problem active right now
                "device_id": device_id,
                "device_name": device_name,
                "area_name": area_name,
                "suggested_entry_id": suggested["entry_id"] if suggested else None,
                "suggested_object_name": suggested["name"] if suggested else (device_name or name),
                "suggested_part_id": suggested_part[0] if suggested_part else None,
                "suggested_part_name": suggested_part[1] if suggested_part else None,
            }
        )
    out.sort(key=lambda c: (c["device_name"] or "", c["name"]))
    return out


def build_problem_task(entity_id: str, name: str) -> dict[str, Any]:
    """The task payload for an adopted problem sensor: manual schedule (no
    calendar), triggered while the problem is on, auto-completed on recovery."""
    # A concise task title; the sensor's friendly name often already reads like
    # "Printer problem", so keep it as-is rather than double-prefixing.
    return {
        "name": name,
        "task_type": "inspection",
        "schedule": {"kind": "manual"},
        "trigger_config": {
            "type": "state_change",
            "entity_ids": [entity_id],
            "trigger_to_state": "on",
            "trigger_target_changes": 1,
            "auto_complete_on_recovery": True,
        },
    }
