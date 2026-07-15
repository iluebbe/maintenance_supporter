"""Verified maintenance entity signatures of popular integrations (roadmap).

Popular integrations expose consumable/wear entities that map 1:1 onto
maintenance tasks — a Roborock reports *filter time left*, a Brother printer
its *drum remaining life*. This catalog lets discovery propose a maintenance
object **with sensor-based triggers pre-wired** instead of bare calendar
intervals.

METHOD CONTRACT: every signature is verified against the integration's actual
source code — the ``source`` field records where. Nothing here is assumed from
docs or memory; when adding an integration, read its ``sensor.py`` first.
Matching uses the entity registry's ``translation_key`` (the stable id from the
integration's EntityDescription, immune to renames) with an entity_id-suffix
fallback for custom integrations that don't set one.

Direction semantics:
* ``duration_left``  — countdown to the next replacement (device_class
  duration). Trigger: below N hours, converted into the entity's display unit.
* ``percent_left``   — remaining life/level in percent. Trigger: below N %.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er

# Hours a duration-countdown may still hold when the task should trigger.
_DEFAULT_BELOW_HOURS = 24
# Percent floor for percent-remaining consumables (ink, toner, drum, brush %).
_DEFAULT_BELOW_PERCENT = 10


@dataclass(frozen=True)
class ConsumableSignature:
    """One maintenance task backed by 1..n verified consumable entities."""

    keys: tuple[str, ...]  # translation_key values (also matched as _<key> entity-id suffix)
    task_name: str  # EN task name; localized through templates_i18n
    direction: str  # "duration_left" | "percent_left"
    below_hours: int = _DEFAULT_BELOW_HOURS
    below_percent: int = _DEFAULT_BELOW_PERCENT


@dataclass(frozen=True)
class IntegrationSignature:
    """All verified signatures of one integration domain."""

    name: str  # human-readable integration name
    source: str  # where the entity keys were verified
    tasks: tuple[ConsumableSignature, ...] = field(default_factory=tuple)


SIGNATURES: dict[str, IntegrationSignature] = {
    "roborock": IntegrationSignature(
        name="Roborock",
        source="home-assistant/core homeassistant/components/roborock/sensor.py (translation_key, duration s→h)",
        tasks=(
            ConsumableSignature(("main_brush_time_left",), "Replace Main Brush", "duration_left"),
            ConsumableSignature(("side_brush_time_left",), "Replace Side Brush", "duration_left"),
            ConsumableSignature(("filter_time_left",), "Replace Filter", "duration_left"),
            ConsumableSignature(("sensor_time_left",), "Clean Sensors", "duration_left"),
        ),
    ),
    "xiaomi_miio": IntegrationSignature(
        name="Xiaomi Miio",
        source="home-assistant/core homeassistant/components/xiaomi_miio/sensor.py (consumable_* descriptions, duration s)",
        tasks=(
            ConsumableSignature(("main_brush_left",), "Replace Main Brush", "duration_left"),
            ConsumableSignature(("side_brush_left",), "Replace Side Brush", "duration_left"),
            ConsumableSignature(("filter_left",), "Replace Filter", "duration_left"),
            ConsumableSignature(("sensor_dirty_left",), "Clean Sensors", "duration_left"),
        ),
    ),
    "dreame_vacuum": IntegrationSignature(
        name="Dreame Vacuum",
        source="Tasshack/dreame-vacuum custom_components/dreame_vacuum/sensor.py (property keys *_left, percent)",
        tasks=(
            ConsumableSignature(("main_brush_left",), "Replace Main Brush", "percent_left"),
            ConsumableSignature(("side_brush_left",), "Replace Side Brush", "percent_left"),
            ConsumableSignature(("filter_left",), "Replace Filter", "percent_left"),
            ConsumableSignature(("sensor_dirty_left",), "Clean Sensors", "percent_left"),
        ),
    ),
    "ipp": IntegrationSignature(
        name="IPP printer",
        source="home-assistant/core homeassistant/components/ipp/sensor.py (marker_<i>, translation_key 'marker', %)",
        tasks=(
            # Every marker (each ink/toner) shares translation_key "marker" —
            # ONE task watches them all with entity_logic any.
            ConsumableSignature(("marker",), "Replace Ink or Toner", "percent_left"),
        ),
    ),
    "brother": IntegrationSignature(
        name="Brother printer",
        source="home-assistant/core homeassistant/components/brother/sensor.py (*_toner_remaining / *_remaining_life, %)",
        tasks=(
            ConsumableSignature(
                (
                    "black_toner_remaining",
                    "cyan_toner_remaining",
                    "magenta_toner_remaining",
                    "yellow_toner_remaining",
                ),
                "Replace Toner",
                "percent_left",
            ),
            ConsumableSignature(
                (
                    "drum_remaining_life",
                    "black_drum_remaining_life",
                    "cyan_drum_remaining_life",
                    "magenta_drum_remaining_life",
                    "yellow_drum_remaining_life",
                ),
                "Replace Drum Unit",
                "percent_left",
            ),
            ConsumableSignature(("belt_unit_remaining_life",), "Replace Belt Unit", "percent_left"),
            ConsumableSignature(("fuser_remaining_life",), "Replace Fuser", "percent_left"),
        ),
    ),
}


def _entity_matches(entry: er.RegistryEntry, key: str) -> bool:
    """translation_key match, with an entity_id-suffix fallback for custom
    integrations that don't set translation_key on their descriptions."""
    if entry.translation_key == key:
        return True
    return entry.entity_id.endswith(f"_{key}")


def _threshold_for(sig: ConsumableSignature, hass: HomeAssistant, entity_id: str) -> float:
    """The trigger_below value in the entity's CURRENT display unit.

    Duration countdowns are stored in the signature as hours; HA may present
    the state in s/min/h/d depending on the entity's unit settings.
    """
    if sig.direction == "percent_left":
        return float(sig.below_percent)
    state = hass.states.get(entity_id)
    unit = (state.attributes.get("unit_of_measurement") if state else None) or "h"
    factor = {"s": 3600.0, "min": 60.0, "h": 1.0, "d": 1 / 24}.get(unit, 1.0)
    return round(sig.below_hours * factor, 3)


def build_setup_trigger(
    sig: ConsumableSignature, hass: HomeAssistant, entity_ids: list[str]
) -> dict[str, Any]:
    """A pre-wired threshold trigger for one signature's matched entities.

    ``entity_logic: any`` (any low consumable triggers) and auto-complete on
    recovery — replacing the consumable resets the countdown/percentage, which
    resolves the task just like a cleared problem sensor.
    """
    return {
        "type": "threshold",
        "entity_ids": list(entity_ids),
        "trigger_below": _threshold_for(sig, hass, entity_ids[0]),
        "entity_logic": "any",
        "auto_complete_on_recovery": True,
    }


def discover_integration_setups(hass: HomeAssistant) -> list[dict[str, Any]]:
    """Devices of catalogued integrations with their matchable task wiring.

    Groups matched entities per device; carries the maintenance object already
    attached to the device (if any) so adoption can extend it instead of
    creating a duplicate. Entities already watched by some task's trigger are
    skipped — re-running discovery never proposes what is already wired.
    """
    from .problem_sensors import _adopted_entity_ids, _object_by_device

    ent_reg = er.async_get(hass)
    dev_reg = dr.async_get(hass)
    area_reg = ar.async_get(hass)
    already_watched = _adopted_entity_ids(hass)
    by_device = _object_by_device(hass)

    # device_id → {sig_key: [entity_ids]} for entities of catalogued domains.
    matched: dict[str, dict[tuple[str, str], list[str]]] = {}
    for entry in ent_reg.entities.values():
        integration = entry.platform
        catalog = SIGNATURES.get(integration)
        if catalog is None or entry.domain != "sensor" or not entry.device_id:
            continue
        if entry.disabled_by is not None or entry.entity_id in already_watched:
            continue
        for sig in catalog.tasks:
            if any(_entity_matches(entry, key) for key in sig.keys):
                matched.setdefault(entry.device_id, {}).setdefault(
                    (integration, sig.task_name), []
                ).append(entry.entity_id)
                break

    out: list[dict[str, Any]] = []
    for device_id, sig_map in matched.items():
        device = dev_reg.async_get(device_id)
        if device is None:
            continue
        device_name = device.name_by_user or device.name or device_id
        area_name = ""
        if device.area_id and (area := area_reg.async_get_area(device.area_id)):
            area_name = area.name
        integration = next(iter(sig_map))[0]
        catalog = SIGNATURES[integration]
        suggested = by_device.get(device_id)
        tasks = []
        for sig in catalog.tasks:
            entity_ids = sorted(sig_map.get((integration, sig.task_name), []))
            if not entity_ids:
                continue
            tasks.append(
                {
                    "task_name": sig.task_name,
                    "entity_ids": entity_ids,
                    "trigger_below": _threshold_for(sig, hass, entity_ids[0]),
                    "direction": sig.direction,
                }
            )
        if not tasks:
            continue
        out.append(
            {
                "device_id": device_id,
                "device_name": device_name,
                "area_name": area_name,
                "integration": integration,
                "integration_name": catalog.name,
                "suggested_entry_id": suggested["entry_id"] if suggested else None,
                "suggested_object_name": suggested["name"] if suggested else device_name,
                "tasks": tasks,
            }
        )
    out.sort(key=lambda s: (s["integration_name"], s["device_name"]))
    return out
