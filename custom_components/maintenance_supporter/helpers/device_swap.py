"""Move an object's device-bound wiring to another Home Assistant device.

An object linked to an appliance's device usually watches that device's
entities: the brush-life sensor of a robot vacuum, the filter counter of a
purifier. When the appliance is replaced, the new unit arrives in Home
Assistant as a NEW device with new entities — and the object, its successor
from *Replace object*, or an object someone relinks by hand kept watching the
old ones. The triggers went quiet, the completion action kept pressing the
dead machine's reset button, and the adopted tasks' fingerprints named a
device nobody owned any more.

``move_tasks_to_device`` rewrites exactly those references, from the old
device(s) to the corresponding entities of the new one:

* sensor-trigger entities (including those inside a compound trigger);
* the completion action's target entities and devices;
* an adopted task's ``origin.device_id``.

An entity that belongs to some OTHER device (an outdoor temperature sensor
used as a trigger) is left alone. The counterpart on the new device is found
the way the owning integration names it — same platform and translation key,
then the same original name, then the longest matching entity-id suffix — and
only when exactly one entity fits: a guess would wire a task to the wrong
sensor, so an unclear entity stays as it was and is reported.
"""

from __future__ import annotations

import copy
from collections.abc import Callable, Iterable
from dataclasses import dataclass, field
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er


@dataclass
class SwapReport:
    """What a device swap changed and what it could not place."""

    moved: int = 0
    unmatched: list[str] = field(default_factory=list)

    def as_dict(self) -> dict[str, Any]:
        return {"moved": self.moved, "unmatched": sorted(set(self.unmatched))}


def old_device_ids(obj: dict[str, Any], tasks: Iterable[dict[str, Any]], new_device_id: str) -> set[str]:
    """The devices a swap moves AWAY from: the object's current link and the
    devices its adopted tasks were fingerprinted on."""
    ids: set[str] = set()
    if isinstance(current := obj.get("ha_device_id"), str) and current:
        ids.add(current)
    for task in tasks:
        origin = task.get("origin") if isinstance(task, dict) else None
        if isinstance(origin, dict) and isinstance(origin.get("device_id"), str) and origin["device_id"]:
            ids.add(origin["device_id"])
    ids.discard(new_device_id)
    return ids


def _tokens(entity_id: str) -> list[str]:
    return entity_id.split(".", 1)[-1].split("_")


def _common_suffix(a: list[str], b: list[str]) -> int:
    n = 0
    while n < min(len(a), len(b)) and a[-1 - n] == b[-1 - n]:
        n += 1
    return n


def _entity_matcher(
    hass: HomeAssistant, old_ids: set[str], new_device_id: str
) -> Callable[[str], str | None]:
    """``entity_id → counterpart on the new device`` (the same id when it is
    not the old device's entity at all; ``None`` when no single one fits)."""
    ent_reg = er.async_get(hass)
    candidates = list(er.async_entries_for_device(ent_reg, new_device_id, include_disabled_entities=True))

    def _only(entries: list[er.RegistryEntry]) -> str | None:
        if len(entries) == 1:
            return entries[0].entity_id
        enabled = [e for e in entries if e.disabled_by is None]
        return enabled[0].entity_id if len(enabled) == 1 else None

    def match(entity_id: str) -> str | None:
        old = ent_reg.async_get(entity_id)
        if old is not None:
            if old.device_id == new_device_id:
                return entity_id
            if old.device_id not in old_ids:
                return entity_id  # another device's sensor, used on purpose
        elif hass.states.get(entity_id) is not None:
            return entity_id  # a live entity without a registry entry (YAML): not the device's
        domain = entity_id.split(".", 1)[0]
        same_domain = [e for e in candidates if e.domain == domain]
        if old is not None:
            same_platform = [e for e in same_domain if e.platform == old.platform]
            if old.translation_key:
                keyed = [e for e in same_platform if e.translation_key == old.translation_key]
                if len(keyed) > 1 and old.original_name:
                    keyed = [e for e in keyed if e.original_name == old.original_name] or keyed
                if found := _only(keyed):
                    return found
            if old.original_name and (found := _only([e for e in same_platform if e.original_name == old.original_name])):
                return found
        # The old entity may be gone from the registry already (its device was
        # deleted): the entity id is all that is left — match its tail. With
        # no registry entry nothing proves it WAS the old device's, so one
        # shared word ("…_temperature") is not enough there.
        tokens = _tokens(entity_id)
        scored = [(_common_suffix(tokens, _tokens(e.entity_id)), e) for e in same_domain]
        best = max((score for score, _e in scored), default=0)
        if best < (1 if old is not None else 2):
            return None
        return _only([e for score, e in scored if score == best])

    return match


def move_tasks_to_device(
    hass: HomeAssistant,
    tasks: dict[str, dict[str, Any]],
    old_ids: set[str],
    new_device_id: str,
) -> tuple[dict[str, dict[str, Any]], SwapReport]:
    """Copies of *tasks* with their old-device wiring pointed at the new device."""
    report = SwapReport()
    if not old_ids or not new_device_id:
        return tasks, report
    match = _entity_matcher(hass, old_ids, new_device_id)
    # One link per task and entity: a trigger keeps the legacy `entity_id`
    # beside `entity_ids`, and both name the same sensor.
    moved: set[tuple[str, str]] = set()
    current = ""

    def swap(entity_id: Any) -> Any:
        if not isinstance(entity_id, str) or not entity_id:
            return entity_id
        target = match(entity_id)
        if target is None:
            report.unmatched.append(entity_id)
            return entity_id
        if target != entity_id:
            moved.add((current, entity_id))
        return target

    def swap_list(value: Any) -> Any:
        if isinstance(value, list):
            return [swap(v) for v in value]
        return swap(value)

    def swap_trigger(config: dict[str, Any]) -> dict[str, Any]:
        if "entity_ids" in config:
            config["entity_ids"] = swap_list(config["entity_ids"])
        if "entity_id" in config:
            config["entity_id"] = swap(config["entity_id"])
        for condition in config.get("conditions") or []:
            if isinstance(condition, dict):
                swap_trigger(condition)
        return config

    out: dict[str, dict[str, Any]] = {}
    for task_id, task in tasks.items():
        current = task_id
        new_task = copy.deepcopy(task)
        if isinstance(trigger := new_task.get("trigger_config"), dict):
            new_task["trigger_config"] = swap_trigger(trigger)
        action = new_task.get("on_complete_action")
        if isinstance(action, dict) and isinstance(target := action.get("target"), dict):
            if "entity_id" in target:
                target["entity_id"] = swap_list(target["entity_id"])
            if "device_id" in target:
                devices = target["device_id"]
                target["device_id"] = (
                    [new_device_id if d in old_ids else d for d in devices]
                    if isinstance(devices, list)
                    else (new_device_id if devices in old_ids else devices)
                )
        origin = new_task.get("origin")
        if isinstance(origin, dict) and origin.get("device_id") in old_ids:
            new_task["origin"] = {**origin, "device_id": new_device_id}
        out[task_id] = new_task
    report.moved = len(moved)
    return out, report
