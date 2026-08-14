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

from ..const import (
    CONF_ADOPTED_NOTES,
    CONF_OBJECT,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MAX_ADOPTED_NOTES,
)
from .aggregate import object_name

PROBLEM_DEVICE_CLASS = "problem"
# safety (NAS disk-health / lifespan thresholds) and tamper alarms behave like
# problem sensors for adoption purposes: binary, on = action needed.
ADOPTABLE_DEVICE_CLASSES = frozenset({PROBLEM_DEVICE_CLASS, "safety", "tamper"})

# Words too generic to establish a sensor↔part relationship on their own
# ("Printer problem" must not match a part just because it's ON the printer).
_MATCH_STOPWORDS = frozenset({"problem", "low", "empty", "sensor", "status", "warning", "error", "alert", "the", "and"})


def _name_tokens(name: str) -> set[str]:
    """Meaningful lowercase tokens (≥3 chars, stopwords removed) of a name."""
    import re

    return {tok for tok in re.split(r"[^a-z0-9]+", name.lower()) if len(tok) >= 3 and tok not in _MATCH_STOPWORDS}


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
            out[dev] = {"entry_id": entry.entry_id, "name": object_name(entry)}
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
        # safety/tamper alarms are maintenance-adjacent the same way problem
        # is (NAS disk-health thresholds ship as device_class: safety) —
        # adoption stays opt-in per sensor either way.
        if state.attributes.get("device_class") not in ADOPTABLE_DEVICE_CLASSES:
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


# Task fields worth surviving an un-adopt → re-adopt cycle. Notes carry the
# accumulated knowledge; the rest is configuration the user set up once and
# shouldn't have to redo (consumes_parts is re-validated against the target
# object's parts on restore — the object may differ or the part may be gone).
_STASHED_TASK_FIELDS = ("notes", "responsible_user_id", "priority", "labels", "consumes_parts")


def stash_task_config_for_readopt(hass: HomeAssistant, task: dict[str, Any]) -> None:
    """Preserve a deleted adopted task's configuration for a later re-adopt.

    Un-adopting a problem sensor = deleting its task, which used to drop the
    accumulated notes ("needs part X") AND the one-time setup (responsible
    user, priority, labels, part link). For tasks carrying the adopted
    signature (``auto_complete_on_recovery`` on watched ``entity_ids``), the
    ``_STASHED_TASK_FIELDS`` present on the task are stashed on the global
    entry keyed by the watched sensor, and restored (consumed) when the sensor
    is re-adopted. FIFO-capped at ``MAX_ADOPTED_NOTES`` so the global entry
    can't grow unbounded. Called from the shared task-delete path; a no-op for
    everything that isn't an adopted task with stashable fields.
    """
    tc = task.get("trigger_config")
    if not isinstance(tc, dict) or not tc.get("auto_complete_on_recovery"):
        return
    entity_ids = tc.get("entity_ids") or []
    config = {k: task[k] for k in _STASHED_TASK_FIELDS if task.get(k) and (not isinstance(task[k], str) or task[k].strip())}
    # "normal" priority is the default — not worth resurrecting on its own.
    if config.get("priority") == "normal":
        config.pop("priority")
    if not entity_ids or not config:
        return
    from .global_options import get_global_entry

    entry = get_global_entry(hass)
    if entry is None:
        return
    options = dict(entry.options or entry.data)
    stash = dict(options.get(CONF_ADOPTED_NOTES) or {})
    key = str(entity_ids[0])
    stash.pop(key, None)  # re-insert as newest (dict order = age)
    stash[key] = config
    while len(stash) > MAX_ADOPTED_NOTES:
        stash.pop(next(iter(stash)))
    options[CONF_ADOPTED_NOTES] = stash
    hass.config_entries.async_update_entry(entry, options=options)


def pop_stashed_config(hass: HomeAssistant, entity_id: str) -> dict[str, Any] | None:
    """Consume (return + remove) the stashed config for ``entity_id``, if any.

    Pre-v2.37 stashes stored the notes string bare — normalized here to the
    dict shape so the adopt path has a single format to apply.
    """
    from .global_options import get_global_entry

    entry = get_global_entry(hass)
    if entry is None:
        return None
    options = dict(entry.options or entry.data)
    stash = dict(options.get(CONF_ADOPTED_NOTES) or {})
    stored = stash.pop(entity_id, None)
    if stored is None:
        return None
    options[CONF_ADOPTED_NOTES] = stash
    hass.config_entries.async_update_entry(entry, options=options)
    if isinstance(stored, str):
        return {"notes": stored} if stored.strip() else None
    if isinstance(stored, dict):
        config = {k: v for k, v in stored.items() if k in _STASHED_TASK_FIELDS and v}
        return config or None
    return None


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
