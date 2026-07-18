"""Verified maintenance entity signatures of popular integrations (roadmap).

Popular integrations expose consumable/wear entities that map 1:1 onto
maintenance tasks — a Roborock reports *filter time left*, a Brother printer
its *drum remaining life*. This catalog lets discovery propose a maintenance
object **with sensor-based triggers pre-wired** instead of bare calendar
intervals.

METHOD CONTRACT: every signature is verified against the integration's actual
source code — the ``source`` field records where, ``verified`` records when and
against which ref. Evaluation follows the direct→derived ladder in
docs/design/signature-evaluation-scheme.md: inventory ALL entity platforms,
then direct signals (percent/countdown/resettable counter/event), then derived
(lifetime counters via delta, attributes), then engine-derived (runtime on
state entities) — a negative verdict only after all rungs.
Matching uses the entity registry's ``translation_key`` (the stable id from the
integration's EntityDescription, immune to renames) with an entity_id-suffix
fallback for custom integrations that don't set one.

Direction semantics:
* ``duration_left``  — countdown to the next replacement (device_class
  duration). Trigger: below N hours, converted into the entity's display unit.
* ``percent_left``   — remaining life/level in percent. Trigger: below N %.
* ``usage_above``    — a wear counter that counts UP since the device's own
  last reset (blade usage time, tub-clean cycles). Trigger: a delta counter
  from an explicit 0 baseline — absolute semantics at adoption, but a manual
  completion re-baselines instead of immediately re-firing, and a device-side
  reset both re-baselines (rollover handling) and auto-completes the task.
* ``event_present``  — an ENUM *event* sensor (no unit) that reports an
  actionable maintenance state (``present``) vs. ``off``/``confirmed`` — Home
  Connect salt/rinse-aid/descale/clean events. Trigger: a state_change latch on
  ``present`` (not a numeric threshold); the task auto-completes when the event
  clears. The appliance emitting the clearing event is required for auto-resolve
  — otherwise the task waits for a manual completion.
* ``usage_delta``    — a LIFETIME counter with no reset anywhere (printer
  usage hours, burner hours, car odometer). Trigger: a counter trigger in
  delta mode — fires every N canonical units (hours for operating-time
  counters, kilometres for odometers) of accumulated use since the task was
  last completed; completing the task re-baselines the counter. No
  auto_complete_on_recovery (a lifetime counter never recovers).
* ``runtime_hours``  — the integration exposes NO usage counter at all, only a
  STATE entity (a ``lawn_mower`` reporting ``mowing``). The ENGINE accumulates
  the time spent in the given states itself (runtime trigger: persisted every
  5 min, restart-safe, paused while unavailable) and fires after N accumulated
  hours; completing the task resets the accumulation. Signatures of this
  direction set ``entity_domain``/``on_states`` and may leave ``keys`` empty —
  meaning "the device's single entity of that domain".
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
# Canonical units between services for lifetime counters (usage_delta mode):
# hours for operating-time counters, kilometres for odometers.
_DEFAULT_DELTA_UNITS = 500
# Percent floor for percent-remaining consumables (ink, toner, drum, brush %).
_DEFAULT_BELOW_PERCENT = 10


@dataclass(frozen=True)
class ConsumableSignature:
    """One maintenance task backed by 1..n verified consumable entities."""

    keys: tuple[str, ...]  # translation_key values (also matched as _<key> entity-id suffix)
    task_name: str  # EN task name; localized through templates_i18n
    direction: str  # duration_left | percent_left | usage_above | event_present | usage_delta | runtime_hours
    below_hours: int = _DEFAULT_BELOW_HOURS
    below_percent: int = _DEFAULT_BELOW_PERCENT
    above_hours: int = _DEFAULT_ABOVE_HOURS
    delta_units: int = _DEFAULT_DELTA_UNITS
    # runtime_hours signatures target a non-sensor STATE entity; empty keys
    # then mean "the device's single entity of this domain".
    entity_domain: str = "sensor"
    on_states: tuple[str, ...] = ()
    # Device-type gates. Some integrations reuse one entity key across ALL
    # appliance types (Miele's status sensor) — require_sibling_keys restricts
    # the signature to devices that ALSO carry a type-identifying entity
    # (a washer has twin_dos/spin_speed). models gates on the device
    # registry's model string (case-insensitive substring — Bambu X1C vs A1).
    require_sibling_keys: tuple[str, ...] = ()
    models: tuple[str, ...] = ()


@dataclass(frozen=True)
class IntegrationSignature:
    """All verified signatures of one integration domain."""

    name: str  # human-readable integration name
    source: str  # where the entity keys were verified
    # When and against which ref the source was read (branch head at that
    # date, not a pinned commit) — the audit trail for "verified against what".
    verified: str = ""
    tasks: tuple[ConsumableSignature, ...] = field(default_factory=tuple)


SIGNATURES: dict[str, IntegrationSignature] = {
    "roborock": IntegrationSignature(
        name="Roborock",
        verified="2026-07-16 @ home-assistant/core dev",
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
        verified="2026-07-16 @ home-assistant/core dev",
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
        verified="2026-07-16 @ Tasshack/dreame-vacuum master",
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
        verified="2026-07-17 @ al-one/hass-xiaomi-miot master",
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
        verified="2026-07-18 @ XiaoMi/ha_xiaomi_home main",
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
        verified="2026-07-18 @ wuwentao/midea_ac_lan master",
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
        verified="2026-07-17 @ home-assistant/core dev + DeebotUniverse/client.py main",
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
        verified="2026-07-17 @ home-assistant/core dev",
        source=(
            "home-assistant/core homeassistant/components/husqvarna_automower/sensor.py "
            "(translation_key 'cutting_blade_usage_time', DURATION s→h; matching reset button exists)"
        ),
        tasks=(
            ConsumableSignature(("cutting_blade_usage_time",), "Replace Blades", "usage_above"),
            # Lifetime statistics sensors (SECONDS, suggested h) carry two more
            # duties: undercarriage washing by mowing time, contact cleaning by
            # docking cycles (unitless counter -> delta target is the count).
            ConsumableSignature(
                ("total_cutting_time",), "Clean Undercarriage", "usage_delta", delta_units=25
            ),
            ConsumableSignature(
                ("number_of_charging_cycles",),
                "Clean Charging Contacts",
                "usage_delta",
                delta_units=100,
            ),
        ),
    ),
    "landroid_cloud": IntegrationSignature(
        name="Worx Landroid",
        verified="2026-07-17 @ MTrab/landroid_cloud master",
        source=(
            "MTrab/landroid_cloud custom_components/landroid_cloud/sensor.py "
            "(translation_key 'blade_runtime_current' — since last reset, DURATION min→h)"
        ),
        tasks=(
            ConsumableSignature(("blade_runtime_current",), "Replace Blades", "usage_above"),
            ConsumableSignature(
                ("mower_runtime_total",), "Clean Undercarriage", "usage_delta", delta_units=25
            ),
        ),
    ),
    "gardena_smart_system": IntegrationSignature(
        name="Gardena Smart System",
        verified="2026-07-18 @ py-smart-gardena/hass-gardena-smart-system master",
        source=(
            "py-smart-gardena/hass-gardena-smart-system sensor.py "
            "GardenaMowerOperatingHoursSensor (entity_id "
            "'{device.id}_{service.id}_operating_hours', UnitOfTime.HOURS, "
            "TOTAL_INCREASING lifetime — no reset anywhere) → usage_delta."
        ),
        tasks=(
            # Sileno mowers: pivoting razor blades wear by mowing time — every
            # 100 operating hours since the last change (delta re-baselines on
            # completion, matching the Husqvarna default).
            ConsumableSignature(
                ("operating_hours",), "Replace Blades", "usage_delta", delta_units=100
            ),
            # Same source entity, second duty — the matcher allows multi-duty.
            ConsumableSignature(
                ("operating_hours",), "Clean Undercarriage", "usage_delta", delta_units=25
            ),
        ),
    ),
    "navimow": IntegrationSignature(
        name="Segway Navimow",
        verified="2026-07-18 @ pgoutsos/NavimowHA main",
        source=(
            "pgoutsos/NavimowHA lawn_mower.py (one LawnMower entity per "
            "device) + const.py MOWER_STATUS_TO_ACTIVITY ('mowing' → "
            "LawnMowerActivity.MOWING). The integration exposes NO usage "
            "counter — the ENGINE accumulates mowing time itself via the "
            "runtime trigger on the lawn_mower entity."
        ),
        tasks=(
            ConsumableSignature(
                (),
                "Replace Blades",
                "runtime_hours",
                delta_units=100,
                entity_domain="lawn_mower",
                on_states=("mowing",),
            ),
            ConsumableSignature(
                (),
                "Clean Undercarriage",
                "runtime_hours",
                delta_units=25,
                entity_domain="lawn_mower",
                on_states=("mowing",),
            ),
        ),
    ),
    "lg_thinq": IntegrationSignature(
        name="LG ThinQ",
        verified="2026-07-17 @ home-assistant/core dev + thinq-connect/pythinqconnect main",
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
        verified="2026-07-17 @ ollo69/ha-smartthinq-sensors master",
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
        verified="2026-07-17 (filter) / 2026-07-18 (burner) @ home-assistant/core dev + openviess/PyViCare master",
        source=(
            "home-assistant/core homeassistant/components/vicare/sensor.py "
            "(GLOBAL_SENSORS translation_key 'filter_remaining_hours', UnitOfTime.HOURS, "
            "disabled-by-default; PyViCare ventilation.filter.runtime.remainingHours; "
            "BURNER_SENSORS/COMPRESSOR_SENSORS 'burner_hours'/'compressor_hours', "
            "UnitOfTime.HOURS, TOTAL_INCREASING lifetime → usage_delta)."
        ),
        tasks=(
            ConsumableSignature(("filter_remaining_hours",), "Replace Filter", "duration_left"),
            # Boiler/heat-pump service by accumulated operating hours since the
            # last service — the counters are lifetime (no reset), which is
            # exactly what the delta-baseline trigger models.
            ConsumableSignature(
                ("burner_hours", "compressor_hours"),
                "Annual Inspection",
                "usage_delta",
                delta_units=2000,
            ),
        ),
    ),
    "kia_uvo": IntegrationSignature(
        name="Hyundai / Kia Connect",
        verified="2026-07-18 @ Hyundai-Kia-Connect/kia_uvo master",
        source=(
            "Hyundai-Kia-Connect/kia_uvo custom_components/kia_uvo/sensor.py "
            "(translation_key 'odometer', DISTANCE, TOTAL_INCREASING, dynamic "
            "km/mi unit). next/last_service_distance exist but their semantics "
            "(target vs remaining) are unverified — odometer delta instead."
        ),
        tasks=(
            ConsumableSignature(("odometer",), "Annual Service", "usage_delta", delta_units=15000),
            ConsumableSignature(("odometer",), "Tire Rotation", "usage_delta", delta_units=10000),
        ),
    ),
    "tesla_custom": IntegrationSignature(
        name="Tesla (custom)",
        verified="2026-07-18 @ alandtse/tesla dev",
        source=(
            "alandtse/tesla custom_components/tesla_custom/sensor.py "
            "TeslaCarOdometer (type='odometer' → entity_id suffix, no "
            "translation_key; DISTANCE, TOTAL_INCREASING, native miles)."
        ),
        tasks=(
            ConsumableSignature(("odometer",), "Annual Service", "usage_delta", delta_units=15000),
            ConsumableSignature(("odometer",), "Tire Rotation", "usage_delta", delta_units=10000),
        ),
    ),
    "renault": IntegrationSignature(
        name="Renault",
        verified="2026-07-18 @ home-assistant/core dev",
        source=(
            "home-assistant/core homeassistant/components/renault/sensor.py "
            "(translation_key 'mileage', DISTANCE, TOTAL_INCREASING, km)."
        ),
        tasks=(
            ConsumableSignature(("mileage",), "Annual Service", "usage_delta", delta_units=15000),
            ConsumableSignature(("mileage",), "Tire Rotation", "usage_delta", delta_units=10000),
        ),
    ),
    "bambu_lab": IntegrationSignature(
        name="Bambu Lab",
        verified="2026-07-18 @ greghesp/ha-bambulab main",
        source=(
            "greghesp/ha-bambulab definitions.py (key/translation_key "
            "'total_usage_hours', UnitOfTime.HOURS, TOTAL_INCREASING lifetime "
            "usage → usage_delta every 500 print-hours; filament remaining is "
            "only a tray-sensor attribute and hms/print_error are device_class "
            "problem → problem-sensor adoption)."
        ),
        tasks=(
            ConsumableSignature(
                ("total_usage_hours",),
                "Lubricate Rails and Rods",
                "usage_delta",
                delta_units=500,
            ),
            # Enclosed printers only (device registry model = the device_type
            # enum: X1C/X1E/P1S/H2*) — the activated-carbon/chamber filter
            # duty makes no sense on open-frame A1/A1MINI/P1P.
            ConsumableSignature(
                ("total_usage_hours",),
                "Replace Filter",
                "usage_delta",
                delta_units=300,
                models=("X1C", "X1E", "P1S", "H2"),
            ),
        ),
    ),
    "home_connect": IntegrationSignature(
        name="Home Connect",
        verified="2026-07-17 @ home-assistant/core dev",
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
    "miele": IntegrationSignature(
        name="Miele",
        verified="2026-07-18 @ home-assistant/core dev",
        source=(
            "home-assistant/core homeassistant/components/miele/sensor.py "
            "(dishwasher salt_level/rinse_aid_level/power_disk_level PERCENTAGE "
            "fill levels; washer twin_dos_1/2_level PERCENTAGE detergent "
            "containers). Coffee descaling/degreasing counters are lifetime "
            "tallies of PERFORMED maintenance — unclear delta semantics, "
            "skipped."
        ),
        tasks=(
            ConsumableSignature(("salt_level",), "Refill Salt", "percent_left"),
            ConsumableSignature(("rinse_aid_level",), "Refill Rinse Aid", "percent_left"),
            # PowerDisk (dishwasher AutoDos) and TwinDos (washer) are both
            # detergent reservoirs — one any-low task per device.
            ConsumableSignature(
                ("power_disk_level", "twin_dos_1_level", "twin_dos_2_level"),
                "Refill Detergent",
                "percent_left",
            ),
            # Tub cleaning by accumulated wash time. The status sensor's
            # translation_key ("status") is IDENTICAL across all Miele
            # appliance types, so the signature is sibling-gated to washers:
            # only devices that also carry TwinDos/spin-speed entities (both
            # washer-only per core sensor.py `types=` gating) qualify.
            ConsumableSignature(
                ("status",),
                "Clean Tub",
                "runtime_hours",
                delta_units=60,
                on_states=("in_use",),
                require_sibling_keys=("twin_dos_1_level", "twin_dos_2_level", "spin_speed"),
            ),
        ),
    ),
    "hass_dyson": IntegrationSignature(
        name="Dyson",
        verified="2026-07-18 @ cmgrayb/hass-dyson main",
        source=(
            "cmgrayb/hass-dyson sensor.py DysonFilterLifeSensor "
            "(translation_key 'filter_life' for BOTH hepa and carbon "
            "instances, PERCENTAGE) — one any-low task covers both filters."
        ),
        tasks=(
            ConsumableSignature(("filter_life",), "Replace Filter", "percent_left"),
        ),
    ),
    "dreo": IntegrationSignature(
        name="Dreo",
        verified="2026-07-18 @ JeffSteinbok/hass-dreo main",
        source=(
            "JeffSteinbok/hass-dreo sensor.py (translation_key 'filter_life', "
            "unit '%', humidifiers with FILTERTIME support)."
        ),
        tasks=(
            ConsumableSignature(("filter_life",), "Replace Filter", "percent_left"),
        ),
    ),
    "weback_vacuum": IntegrationSignature(
        name="WeBack Vacuum",
        verified="2026-07-18 @ Jezza34000/homeassistant_weback_component main",
        source=(
            "Jezza34000/homeassistant_weback_component vacuum.py (NO sensors "
            "at all — STATE_MAPPING maps all clean modes to STATE_CLEANING) — "
            "the ENGINE accumulates cleaning time on the vacuum entity."
        ),
        tasks=(
            ConsumableSignature(
                (),
                "Filter Cleaning",
                "runtime_hours",
                delta_units=15,
                entity_domain="vacuum",
                on_states=("cleaning",),
            ),
            ConsumableSignature(
                (),
                "Clean Main Brush",
                "runtime_hours",
                delta_units=30,
                entity_domain="vacuum",
                on_states=("cleaning",),
            ),
        ),
    ),
    "electrolux_status": IntegrationSignature(
        name="Electrolux / AEG",
        verified="2026-07-18 @ albaintor/homeassistant_electrolux_status master",
        source=(
            "albaintor/homeassistant_electrolux_status catalog_purifier.py "
            "'FilterLife' (PERCENTAGE) + entity.py entity_id = "
            "f'..._{entity_attr}' — HA slugifies the raw 'FilterLife' tail, so "
            "both slug forms are matched."
        ),
        tasks=(
            ConsumableSignature(("filterlife", "filter_life"), "Replace Filter", "percent_left"),
        ),
    ),
    "mbapi2020": IntegrationSignature(
        name="Mercedes-Benz",
        verified="2026-07-18 @ ReneNulschDE/mbapi2020 master",
        source=(
            "ReneNulschDE/mbapi2020 const.py SENSORS 'odometer' (name "
            "'Odometer' → entity_id suffix; attributes carry "
            "serviceintervaldays/distance) — lifetime km counter."
        ),
        tasks=(
            ConsumableSignature(("odometer",), "Annual Service", "usage_delta", delta_units=15000),
            ConsumableSignature(("odometer",), "Tire Rotation", "usage_delta", delta_units=10000),
        ),
    ),
    "ipp": IntegrationSignature(
        name="IPP printer",
        verified="2026-07-16 @ home-assistant/core dev",
        source="home-assistant/core homeassistant/components/ipp/sensor.py (marker_<i>, translation_key 'marker', %)",
        tasks=(
            # Every marker (each ink/toner) shares translation_key "marker" —
            # ONE task watches them all with entity_logic any.
            ConsumableSignature(("marker",), "Replace Ink or Toner", "percent_left"),
        ),
    ),
    "brother": IntegrationSignature(
        name="Brother printer",
        verified="2026-07-16 @ home-assistant/core dev",
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
    if direction in ("event_present", "runtime_hours"):
        return unit is None  # ENUM events and state entities carry no unit
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
    if sig.direction == "runtime_hours":
        return float(sig.delta_units)  # engine-accumulated hours, no unit scaling
    if sig.direction == "percent_left":
        return float(sig.below_percent)
    state = hass.states.get(entity_id)
    unit = (state.attributes.get("unit_of_measurement") if state else None) or "h"
    # Canonical → display unit: time counters are stored in hours, odometers in
    # kilometres; the entity may display s/min/d resp. miles.
    factor = {
        "s": 3600.0,
        "min": 60.0,
        "h": 1.0,
        "d": 1 / 24,
        "km": 1.0,
        "mi": 0.62137,
    }.get(unit, 1.0)
    hours = {
        "usage_above": sig.above_hours,
        "usage_delta": sig.delta_units,
    }.get(sig.direction, sig.below_hours)
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
    if sig.direction == "runtime_hours":
        # The engine accumulates the time the entity spends in on_states
        # itself (no integration counter needed); completing the task resets
        # the accumulation.
        return {
            "type": "runtime",
            "entity_id": entity_ids[0],
            "entity_ids": list(entity_ids),
            "trigger_on_states": list(sig.on_states) or ["on"],
            "trigger_runtime_hours": _threshold_for(sig, hass, entity_ids[0]),
        }
    if sig.direction in ("usage_delta", "usage_above"):
        # Counter trigger in delta mode for both wear-counter flavours — a
        # plain trigger_above threshold would re-fire immediately after a
        # manual completion (the counter is still past the mark), whereas the
        # delta baseline moves on completion.
        # * usage_delta (lifetime counter): baseline = current value at setup;
        #   the task is due every N units from the adoption/completion point.
        # * usage_above (counts since the device's own reset): explicit 0
        #   baseline keeps absolute semantics at adoption (80 h old blades are
        #   80 h old), manual completion re-baselines, and a device-side reset
        #   drops the value below the baseline — the rollover handling
        #   re-baselines and the deactivation auto-completes the task.
        trigger: dict[str, Any] = {
            "type": "counter",
            "entity_id": entity_ids[0],  # counter watches a single entity
            "entity_ids": list(entity_ids),
            "trigger_delta_mode": True,
            "trigger_target_value": _threshold_for(sig, hass, entity_ids[0]),
        }
        if sig.direction == "usage_above":
            trigger["trigger_baseline_value"] = 0
            trigger["auto_complete_on_recovery"] = True
        return trigger
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

    # Collect the enabled registry entities of cataloged integrations per
    # (device, integration) first — the device-type gates need the device's
    # FULL entity list (siblings identify the appliance type).
    by_device_integration: dict[tuple[str, str], list[er.RegistryEntry]] = {}
    for entry in ent_reg.entities.values():
        if SIGNATURES.get(entry.platform) is None or not entry.device_id:
            continue
        if entry.disabled_by is not None:
            continue
        by_device_integration.setdefault((entry.device_id, entry.platform), []).append(entry)

    # device_id → {(integration, task_name, direction): {sig, entity_ids}}.
    # The direction is part of the key so an integration that ships one task
    # name in two directions (LG ThinQ filter: hours vs percent) stays split.
    matched: dict[str, dict[tuple[str, str, str], dict[str, Any]]] = {}
    for (device_id, integration), entries in by_device_integration.items():
        catalog = SIGNATURES[integration]
        device = dev_reg.async_get(device_id)
        model = ((device.model or "") if device else "").lower()
        for sig in catalog.tasks:
            # Device-type gates: registry model substring and/or a
            # type-identifying sibling entity (watched siblings still count —
            # only the match TARGET must be unwatched).
            if sig.models and not any(m.lower() in model for m in sig.models):
                continue
            if sig.require_sibling_keys and not any(
                any(_entity_matches(e, key) for key in sig.require_sibling_keys)
                for e in entries
            ):
                continue
            for entry in entries:
                if entry.domain != sig.entity_domain:
                    continue
                if entry.entity_id in already_watched:
                    continue
                if not _unit_compatible(sig.direction, _entity_unit(hass, entry)):
                    continue
                # Empty keys (non-sensor domains only, tripwire-enforced) match
                # the device's single entity of that domain — THE lawn_mower.
                if sig.keys and not any(_entity_matches(entry, key) for key in sig.keys):
                    continue
                group = matched.setdefault(device_id, {}).setdefault(
                    (integration, sig.task_name, sig.direction),
                    {"sig": sig, "entity_ids": []},
                )
                group["entity_ids"].append(entry.entity_id)
                # One source entity may back SEVERAL duties (a mower's hours
                # counter drives blades AND undercarriage). Adopting any duty
                # marks the entity watched — adopt-all is the default,
                # deselecting a duty forfeits its later proposal.

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
