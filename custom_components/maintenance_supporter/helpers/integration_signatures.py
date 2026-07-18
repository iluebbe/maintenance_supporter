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
* ``usage_above``    — a wear counter that counts UP since the last
  replacement/reset (blade usage time). Trigger: above N hours, converted
  into the entity's display unit; resetting the counter after the swap
  resolves the task (auto_complete_on_recovery).
* ``event_present``  — an ENUM *event* sensor (no unit) that reports an
  actionable maintenance state (``present``) vs. ``off``/``confirmed`` — Home
  Connect salt/rinse-aid/descale/clean events. Trigger: a state_change latch on
  ``present`` (not a numeric threshold); the task auto-completes when the event
  clears. The appliance emitting the clearing event is required for auto-resolve
  — otherwise the task waits for a manual completion.
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
# Usage-hours a wear counter may accumulate before the task should trigger.
_DEFAULT_ABOVE_HOURS = 100
# Percent floor for percent-remaining consumables (ink, toner, drum, brush %).
_DEFAULT_BELOW_PERCENT = 10


@dataclass(frozen=True)
class ConsumableSignature:
    """One maintenance task backed by 1..n verified consumable entities."""

    keys: tuple[str, ...]  # translation_key values (also matched as _<key> entity-id suffix)
    task_name: str  # EN task name; localized through templates_i18n
    direction: str  # "duration_left" | "percent_left" | "usage_above"
    below_hours: int = _DEFAULT_BELOW_HOURS
    below_percent: int = _DEFAULT_BELOW_PERCENT
    above_hours: int = _DEFAULT_ABOVE_HOURS


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
    "xiaomi_miot": IntegrationSignature(
        name="Xiaomi MIoT",
        source=(
            "al-one/hass-xiaomi-miot — generic MIoT-spec entities; entity_id "
            "suffix = the spec property name (core/miot_spec.py format_name + "
            "eid = f'{model}_{mac[-4:]}_{desc_name}'). Cross-device consumables: "
            "'filter-life-level' (PERCENTAGE) on air purifiers/humidifiers/water "
            "purifiers/vacuums, 'brush-life-level' (PERCENTAGE) on vacuums. The "
            "days/used-hours filter counterparts describe the SAME filter, so "
            "only the percent signal is cataloged to avoid duplicate tasks."
        ),
        tasks=(
            # Matched via the entity_id suffix (translation_key is the noisier
            # 'filter-filter_life_level' form). One % task per filter; the side
            # brush collides to a '_2' suffix and is intentionally not matched.
            ConsumableSignature(("filter_life_level",), "Replace Filter", "percent_left"),
            ConsumableSignature(("brush_life_level",), "Replace Main Brush", "percent_left"),
        ),
    ),
    "xiaomi_home": IntegrationSignature(
        name="Xiaomi Home",
        source=(
            "XiaoMi/ha_xiaomi_home miot/miot_device.py gen_prop_entity_id: "
            "entity_id = f'{model}_{did}_{model}_{slugify_name(prop)}_p_{siid}_{piid}' "
            "(property name mid-string, no translation_key) — matched via the "
            "'_<key>_p_' infix. Same MIoT spec properties as hass-xiaomi-miot."
        ),
        tasks=(
            ConsumableSignature(("filter_life_level",), "Replace Filter", "percent_left"),
            ConsumableSignature(("brush_life_level",), "Replace Main Brush", "percent_left"),
        ),
    ),
    "midea_ac_lan": IntegrationSignature(
        name="Midea (LAN)",
        source=(
            "wuwentao/midea_ac_lan midea_devices.py + midea_entity.py "
            "(_attr_translation_key from the per-attribute config; entity_id = "
            "f'{device_id}_{entity_key}'). 0xED water purifier: filter1/2/3_life "
            "PERCENTAGE; 0xC2: filter_life PERCENTAGE. The filterN_days "
            "countdowns describe the SAME filters — percent only, no duplicate "
            "tasks. Filter cleaning/change reminders (A1/CE/AC full_dust) are "
            "device_class problem binaries — covered by problem-sensor adoption."
        ),
        tasks=(
            ConsumableSignature(
                ("filter1_life", "filter2_life", "filter3_life"),
                "Replace Water Filter",
                "percent_left",
            ),
            ConsumableSignature(("filter_life",), "Replace Filter", "percent_left"),
        ),
    ),
    "ecovacs": IntegrationSignature(
        name="Ecovacs",
        source=(
            "home-assistant/core homeassistant/components/ecovacs/sensor.py "
            "(translation_key f'lifespan_{component.name.lower()}', PERCENTAGE) + "
            "DeebotUniverse/client.py deebot_client/events LifeSpan enum members"
        ),
        tasks=(
            ConsumableSignature(("lifespan_brush",), "Replace Main Brush", "percent_left"),
            ConsumableSignature(("lifespan_side_brush",), "Replace Side Brush", "percent_left"),
            ConsumableSignature(("lifespan_filter",), "Replace Filter", "percent_left"),
            ConsumableSignature(("lifespan_dust_bag",), "Replace Dust Bag", "percent_left"),
            ConsumableSignature(("lifespan_round_mop",), "Replace Mop Pads", "percent_left"),
            # GOAT robotic mowers report blade lifespan through the same platform.
            ConsumableSignature(("lifespan_blade",), "Replace Blades", "percent_left"),
        ),
    ),
    "husqvarna_automower": IntegrationSignature(
        name="Husqvarna Automower",
        source=(
            "home-assistant/core homeassistant/components/husqvarna_automower/sensor.py "
            "(translation_key 'cutting_blade_usage_time', DURATION s→h; matching reset button exists)"
        ),
        tasks=(
            ConsumableSignature(("cutting_blade_usage_time",), "Replace Blades", "usage_above"),
        ),
    ),
    "landroid_cloud": IntegrationSignature(
        name="Worx Landroid",
        source=(
            "MTrab/landroid_cloud custom_components/landroid_cloud/sensor.py "
            "(translation_key 'blade_runtime_current' — since last reset, DURATION min→h)"
        ),
        tasks=(
            ConsumableSignature(("blade_runtime_current",), "Replace Blades", "usage_above"),
        ),
    ),
    "lg_thinq": IntegrationSignature(
        name="LG ThinQ",
        source=(
            "home-assistant/core homeassistant/components/lg_thinq/sensor.py "
            "(ThinQProperty StrEnum translation_key; FILTER_LIFETIME is shared by "
            "an HOURS description and a PERCENTAGE one — the unit-aware matcher "
            "routes each entity to the right direction) + "
            "thinq-connect/pythinqconnect devices/const.py Property members"
        ),
        tasks=(
            # AC filter reports hours-remaining; air-purifier/RAC filters report
            # percent — both under translation_key 'filter_lifetime'. Two
            # directions, unit-disambiguated at match time.
            ConsumableSignature(
                ("filter_lifetime", "top_filter_remain_percent"), "Replace Filter", "percent_left"
            ),
            ConsumableSignature(("filter_lifetime",), "Replace Filter", "duration_left"),
            ConsumableSignature(
                (
                    "water_filter_1_remain_percent",
                    "water_filter_2_remain_percent",
                    "water_filter_3_remain_percent",
                ),
                "Replace Water Filter",
                "percent_left",
            ),
        ),
    ),
    "smartthinq_sensors": IntegrationSignature(
        name="LG ThinQ (SmartThinQ)",
        source=(
            "ollo69/ha-smartthinq-sensors custom_components/smartthinq_sensors/sensor.py "
            "(legacy name= entities, NO translation_key → matched by entity_id suffix; "
            "FILTER_*_LIFE / *_REMAIN_PERC are percent via wideq device.py "
            "_get_filter_life(); TUBCLEAN_COUNT counts up per wash cycle and the "
            "machine resets it when a tub-clean course runs)"
        ),
        tasks=(
            ConsumableSignature(
                (
                    "filter_remaining_life",
                    "filter_remaining_life_main",
                    "filter_remaining_life_bottom",
                    "filter_remaining_life_dust",
                    "filter_remaining_life_middle",
                    "filter_remaining_life_top",
                    "fresh_air_filter_remaining",
                ),
                "Replace Filter",
                "percent_left",
            ),
            ConsumableSignature(("water_filter_remaining",), "Replace Water Filter", "percent_left"),
            # Unitless wash-cycle counter: above_hours here is the cycle count
            # (~monthly cadence); resetting on a tub-clean course resolves it.
            ConsumableSignature(("tub_clean_counter",), "Clean Tub", "usage_above", above_hours=30),
        ),
    ),
    "vicare": IntegrationSignature(
        name="Viessmann ViCare",
        source=(
            "home-assistant/core homeassistant/components/vicare/sensor.py "
            "(GLOBAL_SENSORS translation_key 'filter_remaining_hours', UnitOfTime.HOURS, "
            "disabled-by-default; PyViCare ventilation.filter.runtime.remainingHours). "
            "Burner/compressor hours are lifetime counters with no reset → excluded."
        ),
        tasks=(
            ConsumableSignature(("filter_remaining_hours",), "Replace Filter", "duration_left"),
        ),
    ),
    "home_connect": IntegrationSignature(
        name="Home Connect",
        source=(
            "home-assistant/core homeassistant/components/home_connect/sensor.py "
            "EVENT_SENSORS (HomeConnectEventSensor, device_class ENUM, "
            "EVENT_OPTIONS ['confirmed','off','present']; translation_key per "
            "EventKey). No percent/countdown consumables exist (coffee counters "
            "are lifetime, no reset) — these actionable events are the only "
            "maintenance-usable signal, matched as a state latch on 'present'."
        ),
        tasks=(
            ConsumableSignature(("salt_nearly_empty",), "Refill Salt", "event_present"),
            ConsumableSignature(("rinse_aid_nearly_empty",), "Refill Rinse Aid", "event_present"),
            ConsumableSignature(("device_should_be_descaled",), "Descale Appliance", "event_present"),
            ConsumableSignature(("device_should_be_cleaned",), "Clean Appliance", "event_present"),
            ConsumableSignature(
                ("grease_filter_max_saturation_reached",), "Clean Grease Filter", "event_present"
            ),
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
    integrations that don't set translation_key on their descriptions.

    Third pattern: xiaomi_home embeds the MIoT property name mid-entity_id with
    a ``_p_{siid}_{piid}`` tail (``..._filter_life_level_p_4_1``) and sets no
    translation_key — matched via the distinctive ``_<key>_p_`` infix. Matching
    is already scoped to the signature's integration (entry.platform), so this
    cannot bleed across integrations."""
    if entry.translation_key == key:
        return True
    if entry.entity_id.endswith(f"_{key}"):
        return True
    return f"_{key}_p_" in entry.entity_id


def _entity_unit(hass: HomeAssistant, entry: er.RegistryEntry) -> str | None:
    """The entity's live display unit, falling back to the registry unit."""
    state = hass.states.get(entry.entity_id)
    if state and (unit := state.attributes.get("unit_of_measurement")):
        return str(unit)
    reg_unit = entry.unit_of_measurement
    return str(reg_unit) if reg_unit is not None else None


def _unit_compatible(direction: str, unit: str | None) -> bool:
    """Whether an entity's unit fits a signature's direction.

    Some integrations (LG ThinQ) reuse ONE translation_key for both an
    hours-remaining and a percent-remaining sensor; the key alone can't say
    which direction applies. A concrete unit disambiguates: percent_left wants
    ``%``; the duration/counter directions want anything else. The check is
    lenient — a missing unit (disabled/just-added entity) never rejects a
    key match, so existing single-shape signatures are unaffected. The one
    strict case is ``event_present``: ENUM event sensors carry no unit, so a
    unit-bearing entity that happens to share the key is NOT an event."""
    if direction == "event_present":
        return unit is None
    if unit is None:
        return True
    if direction == "percent_left":
        return unit == "%"
    return unit != "%"


def _threshold_for(sig: ConsumableSignature, hass: HomeAssistant, entity_id: str) -> float:
    """The trigger threshold in the entity's CURRENT display unit.

    Duration values are stored in the signature as hours; HA may present the
    state in s/min/h/d depending on the entity's unit settings.
    """
    if sig.direction == "event_present":
        return 0.0  # ENUM event latch — no numeric threshold
    if sig.direction == "percent_left":
        return float(sig.below_percent)
    state = hass.states.get(entity_id)
    unit = (state.attributes.get("unit_of_measurement") if state else None) or "h"
    factor = {"s": 3600.0, "min": 60.0, "h": 1.0, "d": 1 / 24}.get(unit, 1.0)
    hours = sig.above_hours if sig.direction == "usage_above" else sig.below_hours
    return round(hours * factor, 3)


def build_setup_trigger(
    sig: ConsumableSignature, hass: HomeAssistant, entity_ids: list[str]
) -> dict[str, Any]:
    """A pre-wired trigger for one signature's matched entities.

    Numeric signatures build a threshold trigger with ``entity_logic: any``
    (any low consumable triggers) and auto-complete on recovery — replacing the
    consumable resets the countdown/percentage (or, for ``usage_above`` wear
    counters, resetting the counter drops it back below the threshold), which
    resolves the task just like a cleared problem sensor.

    ``event_present`` signatures build a single-entity state-change LATCH on the
    ``present`` state (Home Connect salt/rinse-aid/descale/clean events): the
    task activates while the event is present and auto-completes when the
    appliance clears it (to ``off``/``confirmed``).
    """
    if sig.direction == "event_present":
        return {
            "type": "state_change",
            "entity_id": entity_ids[0],  # state latch watches a single entity
            "entity_ids": list(entity_ids),
            "trigger_to_state": "present",
            "trigger_target_changes": 1,
            "auto_complete_on_recovery": True,
        }
    threshold_key = "trigger_above" if sig.direction == "usage_above" else "trigger_below"
    return {
        "type": "threshold",
        "entity_ids": list(entity_ids),
        threshold_key: _threshold_for(sig, hass, entity_ids[0]),
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

    # device_id → {(integration, task_name, direction): {sig, entity_ids}}.
    # The direction is part of the key so an integration that ships one task
    # name in two directions (LG ThinQ filter: hours vs percent) stays split.
    matched: dict[str, dict[tuple[str, str, str], dict[str, Any]]] = {}
    for entry in ent_reg.entities.values():
        integration = entry.platform
        catalog = SIGNATURES.get(integration)
        if catalog is None or entry.domain != "sensor" or not entry.device_id:
            continue
        if entry.disabled_by is not None or entry.entity_id in already_watched:
            continue
        unit = _entity_unit(hass, entry)
        for sig in catalog.tasks:
            if not _unit_compatible(sig.direction, unit):
                continue
            if any(_entity_matches(entry, key) for key in sig.keys):
                group = matched.setdefault(entry.device_id, {}).setdefault(
                    (integration, sig.task_name, sig.direction),
                    {"sig": sig, "entity_ids": []},
                )
                group["entity_ids"].append(entry.entity_id)
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
        for (_integ, task_name, direction), group in sig_map.items():
            entity_ids = sorted(group["entity_ids"])
            if not entity_ids:
                continue
            tasks.append(
                {
                    "task_name": task_name,
                    "entity_ids": entity_ids,
                    "threshold": _threshold_for(group["sig"], hass, entity_ids[0]),
                    "direction": direction,
                }
            )
        if not tasks:
            continue
        tasks.sort(key=lambda t: (t["task_name"], t["direction"]))
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
