"""Cleaning robots — vacuums, mops and the Dolphin pool robot.

Interval audit 2026-07-19: the sensor-less runtime duties (filter wash
15 h / main-brush clean 30 h of cleaning time) map to Roborock's official
biweekly cleaning cadence at typical 1-2 h/day usage.

Data module of the suggested-setups signature catalog — see
``helpers/signatures/_model.py`` for the direction semantics and the
method contract (every entry cites and is verified against the
integration's source; drift-probed weekly)."""

from __future__ import annotations

from dataclasses import replace

from ._model import ConsumableSignature, IntegrationSignature
from ._shared import (
    FILTER_LIFE_PERCENT,
    VACUUM_FILTER_CLEANING_RUNTIME,
    VACUUM_MAIN_BRUSH_RUNTIME,
)

# Percent-left brush and mop gauges named '<Part> Life' — shared verbatim by
# the Xiaomi cloud vacuum and Viomi SE integrations (DRY tripwire: one object
# per duplicated duty; both users live in this module).
MAIN_BRUSH_LIFE_PERCENT = ConsumableSignature(("main_brush_life",), "Replace Main Brush", "percent_left")
SIDE_BRUSH_LIFE_PERCENT = ConsumableSignature(("side_brush_life",), "Replace Side Brush", "percent_left")
MOP_LIFE_PERCENT = ConsumableSignature(("mop_life",), "Replace Mop Pads", "percent_left")

SIGNATURES: dict[str, IntegrationSignature] = {
    "roborock": IntegrationSignature(
        name="Roborock",
        verified="2026-09-25 @ home-assistant/core dev + Python-roborock/python-roborock main",
        source=(
            "home-assistant/core homeassistant/components/roborock/sensor.py (translation_key, "
            "duration s→h). 2026-09 round: dock tks 'strainer_time_left' / "
            "'cleaning_brush_time_left' (HOURS; python-roborock v1_containers: "
            "STRAINER_REPLACE_TIME 150 / CLEANING_BRUSH_REPLACE_TIME 300 minus work "
            "count — countdowns to replacement, HA docs: 'replace your dock's "
            "strainer/maintenance brush'); Q7 (B01) tk 'mop_life_time_left' (MINUTES, "
            "b01_q7_containers: max(0, 10800 - mop_life) = remaining); Dyad tk "
            "'brush_remaining' ('Roller left', SECONDS, DyadDataProtocol.BRUSH_LEFT) joins "
            "the main-brush duty; Zeo washer tk 'times_after_clean' (unitless "
            "RoborockZeoProtocol.TIMES_AFTER_CLEAN, washes since the last drum clean — "
            "usage_above like LG's tub_clean_counter). Q10 tks main_brush_life/"
            "side_brush_life/filter_life/sensor_life are SKIPPED: HA names them 'time "
            "used' while python-roborock's Q10Consumable calls them remaining life."
        ),
        tasks=(
            # Dyad wet-dry vacuums report their roller brush as 'brush_remaining'
            # — same duty, same direction → one signature (per-device dedupe).
            ConsumableSignature(("main_brush_time_left", "brush_remaining"), "Replace Main Brush", "duration_left", resets=(("main_brush_time_left", "reset_main_brush_consumable"),)),
            ConsumableSignature(("side_brush_time_left",), "Replace Side Brush", "duration_left", resets=(("side_brush_time_left", "reset_side_brush_consumable"),)),
            ConsumableSignature(("filter_time_left",), "Replace Filter", "duration_left", resets=(("filter_time_left", "reset_air_filter_consumable"),)),
            ConsumableSignature(("sensor_time_left",), "Clean Sensors", "duration_left", resets=(("sensor_time_left", "reset_sensor_consumable"),)),
            ConsumableSignature(("mop_life_time_left",), "Replace Mop Pads", "duration_left"),
            # Dock consumables: the 'hours' are the dock's wash-count budget
            # (150 / 300); 24 left ≈ the last 8-16 % of the part's life.
            ConsumableSignature(("strainer_time_left",), "Replace Dock Strainer", "duration_left", resets=(("strainer_time_left", "reset_dock_strainer_consumable"),)),
            ConsumableSignature(("cleaning_brush_time_left",), "Replace Maintenance Brush", "duration_left", resets=(("cleaning_brush_time_left", "reset_dock_cleaning_brush_consumable"),)),
            # Zeo washer: washes since the last drum-clean program (unitless;
            # above_hours is the wash count, ~monthly like LG's tub counter).
            ConsumableSignature(("times_after_clean",), "Clean Tub", "usage_above", above_hours=30),
        ),
    ),
    "xiaomi_miio": IntegrationSignature(
        name="Xiaomi Miio",
        verified="2026-07-16 @ home-assistant/core dev; purifier/Air Fresh filters 2026-09-27 @ home-assistant/core 2026.9",
        source=(
            "home-assistant/core homeassistant/components/xiaomi_miio/sensor.py (consumable_* "
            "descriptions, duration s). 2026-09 round: air purifiers + Air Fresh VA2/VA4 tk "
            "'filter_life_remaining', Air Fresh A1/T2017 tk 'dust_filter_life_remaining', "
            "T2017 tk 'upper_filter_life_remaining' (all PERCENTAGE, DIAGNOSTIC, enabled) → one "
            "percent duty, per entity because the T2017's two filters are replaced "
            "separately. button.py MODEL_TO_BUTTON_MAP: 'reset_dust_filter' (A1, T2017) and "
            "'reset_upper_filter' (T2017). Skipped: the same filters' days/hours twins "
            "'filter_left_time' / '*_life_remaining_days' (DAYS) and 'filter_hours_used' "
            "(HOURS) — one signal per filter; purifiers reset only via the "
            "xiaomi_miio.fan_reset_filter service (no button to wire)."
        ),
        tasks=(
            ConsumableSignature(("main_brush_left",), "Replace Main Brush", "duration_left", resets=(("main_brush_left", "reset_vacuum_main_brush"),)),
            ConsumableSignature(("side_brush_left",), "Replace Side Brush", "duration_left", resets=(("side_brush_left", "reset_vacuum_side_brush"),)),
            ConsumableSignature(("filter_left",), "Replace Filter", "duration_left", resets=(("filter_left", "reset_vacuum_filter"),)),
            ConsumableSignature(("sensor_dirty_left",), "Clean Sensors", "duration_left", resets=(("sensor_dirty_left", "reset_vacuum_sensor_dirty"),)),
            # Purifier / Air Fresh filters (percent, the vacuum's filter is a
            # duration → a separate direction). The T2017 has two filters
            # replaced independently → one task per entity there.
            ConsumableSignature(
                ("filter_life_remaining", "dust_filter_life_remaining", "upper_filter_life_remaining"),
                "Replace Filter",
                "percent_left",
                per_entity=True,
                resets=(
                    ("dust_filter_life_remaining", "reset_dust_filter"),
                    ("upper_filter_life_remaining", "reset_upper_filter"),
                ),
            ),
        ),
    ),
    "dreame_vacuum": IntegrationSignature(
        name="Dreame Vacuum",
        verified="2026-09-02 @ Tasshack/dreame-vacuum master (ae8422f2); resets 2026-09-27 @ ae8422f",
        source=(
            "Tasshack/dreame-vacuum custom_components/dreame_vacuum/sensor.py "
            "(property_key *_LEFT, UNIT_PERCENT) + dreame/const.py PROPERTY_TO_NAME "
            "(translation_key = first element, e.g. mop_pad_left); every *_left "
            "sensor is entity_registry_enabled_default=False — the user enables "
            "the ones their model has (#150, station consumables). Resets: "
            "button.py BUTTONS action_key RESET_* → entity.py key/translation_key from "
            "dreame/const.py ACTION_TO_NAME ('reset_main_brush', 'reset_side_brush', "
            "'reset_filter', 'reset_sensor', 'reset_mop_pad', 'reset_detergent', "
            "'reset_silver_ion'; DIAGNOSTIC, enabled; each created only when its counter "
            "exists). The button is unavailable while its counter reads 100 %. "
            "secondary_filter_left has no button (service vacuum_reset_consumable only)."
        ),
        tasks=(
            ConsumableSignature(("main_brush_left",), "Replace Main Brush", "percent_left", resets=(("main_brush_left", "reset_main_brush"),)),
            ConsumableSignature(("side_brush_left",), "Replace Side Brush", "percent_left", resets=(("side_brush_left", "reset_side_brush"),)),
            ConsumableSignature(("filter_left",), "Replace Filter", "percent_left", resets=(("filter_left", "reset_filter"),)),
            ConsumableSignature(("sensor_dirty_left",), "Clean Sensors", "percent_left", resets=(("sensor_dirty_left", "reset_sensor"),)),
            # Self-wash base stations (L10s/L20/X30/X40 …) add four more wear
            # counters — same percent scale, same *_left key convention.
            ConsumableSignature(("mop_pad_left",), "Replace Mop Pads", "percent_left", resets=(("mop_pad_left", "reset_mop_pad"),)),
            ConsumableSignature(("detergent_left",), "Refill Detergent", "percent_left", resets=(("detergent_left", "reset_detergent"),)),
            ConsumableSignature(("secondary_filter_left",), "Replace Secondary Filter", "percent_left"),
            ConsumableSignature(("silver_ion_left",), "Replace Silver-ion Module", "percent_left", resets=(("silver_ion_left", "reset_silver_ion"),)),
        ),
    ),
    "ecovacs": IntegrationSignature(
        name="Ecovacs",
        verified="2026-09-25 @ home-assistant/core dev + DeebotUniverse/client.py main",
        source=(
            "home-assistant/core homeassistant/components/ecovacs/sensor.py "
            "(translation_key f'lifespan_{component.name.lower()}' over const.py "
            "SUPPORTED_LIFESPANS, PERCENTAGE; LEGACY_LIFESPAN_SENSORS "
            "f'lifespan_{component}' for main_brush/side_brush/filter) + "
            "DeebotUniverse/client.py deebot_client/events LifeSpan enum members "
            "(LifeSpanEvent.percent = remaining). 2026.8 added cleaning_solution, "
            "sewage_box (the dirty-water box), water_sink (the station's cleaning "
            "sink), trimmer_brush and weed_rope (GOAT edge trimmer). "
            "total_stats_time_mower = the mower override of total_stats_time "
            "(SECONDS, suggested h, TOTAL_INCREASING lifetime). unit_care is "
            "SKIPPED (which parts it covers is not established from source)."
        ),
        tasks=(
            ConsumableSignature(("lifespan_brush", "lifespan_main_brush"), "Replace Main Brush", "percent_left", resets=(("lifespan_brush", "reset_lifespan_brush"),)),
            ConsumableSignature(("lifespan_side_brush",), "Replace Side Brush", "percent_left", resets=(("lifespan_side_brush", "reset_lifespan_side_brush"),)),
            # The robot's filter and the handheld unit's filter (combo models)
            # are separate parts — one task per entity when a device has both.
            ConsumableSignature(("lifespan_filter", "lifespan_hand_filter"), "Replace Filter", "percent_left", per_entity=True, resets=(("lifespan_filter", "reset_lifespan_filter"), ("lifespan_hand_filter", "reset_lifespan_hand_filter"))),
            ConsumableSignature(("lifespan_station_filter",), "Replace Secondary Filter", "percent_left", resets=(("lifespan_station_filter", "reset_lifespan_station_filter"),)),
            ConsumableSignature(("lifespan_dust_bag",), "Replace Dust Bag", "percent_left", resets=(("lifespan_dust_bag", "reset_lifespan_dust_bag"),)),
            ConsumableSignature(("lifespan_round_mop",), "Replace Mop Pads", "percent_left", resets=(("lifespan_round_mop", "reset_lifespan_round_mop"),)),
            ConsumableSignature(("lifespan_cleaning_solution",), "Refill Detergent", "percent_left", resets=(("lifespan_cleaning_solution", "reset_lifespan_cleaning_solution"),)),
            ConsumableSignature(("lifespan_sewage_box",), "Empty Dirty Water Tank", "percent_left", resets=(("lifespan_sewage_box", "reset_lifespan_sewage_box"),)),
            ConsumableSignature(("lifespan_water_sink",), "Clean Mop Tray", "percent_left", resets=(("lifespan_water_sink", "reset_lifespan_water_sink"),)),
            ConsumableSignature(("lifespan_air_freshener",), "Replace Air Freshener", "percent_left", resets=(("lifespan_air_freshener", "reset_lifespan_air_freshener"),)),
            ConsumableSignature(("lifespan_uv_sanitizer",), "Replace UV Lamp", "percent_left", resets=(("lifespan_uv_sanitizer", "reset_lifespan_uv_sanitizer"),)),
            # GOAT robotic mowers report their wear parts through the same platform.
            ConsumableSignature(("lifespan_blade",), "Replace Blades", "percent_left", resets=(("lifespan_blade", "reset_lifespan_blade"),)),
            ConsumableSignature(("lifespan_lens_brush",), "Replace Lens Brush", "percent_left", resets=(("lifespan_lens_brush", "reset_lifespan_lens_brush"),)),
            ConsumableSignature(("lifespan_trimmer_brush",), "Replace Trimmer Brush", "percent_left", resets=(("lifespan_trimmer_brush", "reset_lifespan_trimmer_brush"),)),
            ConsumableSignature(("lifespan_weed_rope",), "Replace Trimmer Line", "percent_left", resets=(("lifespan_weed_rope", "reset_lifespan_weed_rope"),)),
            # Lifetime mowing time — undercarriage wash every 25 h like the
            # automower/landroid signatures.
            ConsumableSignature(("total_stats_time_mower",), "Clean Undercarriage", "usage_delta", delta_units=25),
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
            VACUUM_FILTER_CLEANING_RUNTIME,
            VACUUM_MAIN_BRUSH_RUNTIME,
        ),
    ),
    "roomba": IntegrationSignature(
        name="iRobot Roomba",
        verified="2026-07-18 @ home-assistant/core dev",
        source=(
            "home-assistant/core homeassistant/components/roomba/vacuum.py "
            "(vacuum platform verified present; no consumable sensors) — the "
            "ENGINE accumulates cleaning time."
        ),
        tasks=(
            VACUUM_FILTER_CLEANING_RUNTIME,
            VACUUM_MAIN_BRUSH_RUNTIME,
            ConsumableSignature(
                ("bin_full",),
                "Empty Dustbin",
                "event_present",
                entity_domain="binary_sensor",
                on_states=("on",),
            ),
        ),
    ),
    # bin_full is a plain binary (no problem device_class, so the
    # problem-sensor adoption does NOT cover it) -> event latch.
    "neato": IntegrationSignature(
        name="Neato Botvac",
        verified="2026-07-18 @ home-assistant/core dev",
        source=(
            "home-assistant/core homeassistant/components/neato/vacuum.py "
            "(vacuum platform verified present; no consumable sensors) — the "
            "ENGINE accumulates cleaning time."
        ),
        tasks=(
            VACUUM_FILTER_CLEANING_RUNTIME,
            VACUUM_MAIN_BRUSH_RUNTIME,
        ),
    ),
    "romy": IntegrationSignature(
        name="ROMY Vacuum",
        verified="2026-07-18 @ home-assistant/core dev",
        source=(
            "home-assistant/core homeassistant/components/romy/vacuum.py "
            "(vacuum platform verified present; no consumable sensors) — the "
            "ENGINE accumulates cleaning time."
        ),
        tasks=(
            VACUUM_FILTER_CLEANING_RUNTIME,
            VACUUM_MAIN_BRUSH_RUNTIME,
        ),
    ),
    "tuya": IntegrationSignature(
        name="Tuya vacuum",
        verified="2026-09-25 @ home-assistant/core dev",
        source=(
            "home-assistant/core homeassistant/components/tuya/vacuum.py (vacuum "
            "platform) — the ENGINE accumulates cleaning time, entity_domain-gated so "
            "the bridge's other device types are untouched. sensor.py category SD "
            "(robot vacuum) ALSO has consumable sensors (present since 2026.7): tks "
            "'duster_cloth_life' (DP duster_cloth), 'side_brush_life' (DP edge_brush), "
            "'filter_life' (DPCode.FILTER_LIFE = DP 'filter', const.py: 'Filter life "
            "(percentage)'), 'rolling_brush_life' (DP roll_brush). No unit in the "
            "description — TuyaSensorEntity takes the device's DP unit; Tuya's sd "
            "standard status set defines all four as 'life' Integer 0-100 %, reset via "
            "reset_* DPs → percent_left. Devices whose DP reports 'min'/'h' instead are "
            "NOT matched (unit gate): real devices mislabel the unit (Neatsvor X600 "
            "reports 'min' with a 200-max range), so no duration signature. SKIPPED: "
            "KJ purifier 'filter_utilization' (Tuya: 'Filter cartridge utilization', "
            "used-vs-remaining undetermined) and CWYSJ fountain 'filter_duration' (DP "
            "filter_life 'hours', direction undetermined). The runtime duties stay: "
            "washing the filter / de-tangling the brush is a separate duty from "
            "replacing the part at end of life."
        ),
        tasks=(
            # 2.95: each counter has its reset_* button (button.py category SD).
            ConsumableSignature(("rolling_brush_life",), "Replace Main Brush", "percent_left", resets=(("rolling_brush_life", "reset_roll_brush"),)),
            ConsumableSignature(("side_brush_life",), "Replace Side Brush", "percent_left", resets=(("side_brush_life", "reset_edge_brush"),)),
            replace(FILTER_LIFE_PERCENT, resets=(("filter_life", "reset_filter"),)),
            ConsumableSignature(("duster_cloth_life",), "Replace Mop Pads", "percent_left", resets=(("duster_cloth_life", "reset_duster_cloth"),)),
            VACUUM_FILTER_CLEANING_RUNTIME,
            VACUUM_MAIN_BRUSH_RUNTIME,
        ),
    ),
    "switchbot_cloud": IntegrationSignature(
        name="SwitchBot vacuum",
        verified="2026-07-18 @ home-assistant/core dev",
        source=(
            "home-assistant/core homeassistant/components/switchbot_cloud/vacuum.py "
            "(vacuum platform verified present; no consumable sensors) — the "
            "ENGINE accumulates cleaning time, entity_domain-gated so the bridge's other device types are untouched."
        ),
        tasks=(
            VACUUM_FILTER_CLEANING_RUNTIME,
            VACUUM_MAIN_BRUSH_RUNTIME,
        ),
    ),
    "smartthings": IntegrationSignature(
        name="SmartThings",
        verified="2026-07-18 (vacuum) / 2026-07-20 (filters) @ home-assistant/core dev; dust bag 2026-09-27 @ home-assistant/core 2026.9",
        source=(
            "home-assistant/core homeassistant/components/smartthings/vacuum.py "
            "(vacuum platform verified present; no consumable sensors) — the "
            "ENGINE accumulates cleaning time, entity_domain-gated so the bridge's other device types are untouched. "
            "sensor.py: tk 'water_filter_usage' (custom.waterFilter, "
            "PERCENTAGE, MEASUREMENT — Samsung fridge water filter, % USED "
            "counting up; replacement resets to 0) and tk 'hood_filter_usage' "
            "(SAMSUNG_CE_HOOD_FILTER, PERCENTAGE) — same up-counting shape. "
            "2026-09 round: binary_sensor.py SAMSUNG_CE_ROBOT_CLEANER_DUST_BAG on the "
            "'station' component, component_translation_key 'robot_cleaner_dust_bag' "
            "('Dust bag full', is_on_key 'full', NO device_class → not problem-adoptable) → "
            "latch on 'on'. Skipped: 'stick_cleaner_dust_bag' / 'microfiber_filter_blockage' "
            "/ 'filter_status' (device_class problem → problem-sensor adoption), "
            "'stick_cleaner_dust_bag_usage' (unitless TOTAL_INCREASING bag cycles, reset "
            "semantics not established) and button 'reset_hepa_filter' (custom.hepaFilter — "
            "no sensor exposes that filter, core 2026.9 nor dev, so there is no duty to wire)."
        ),
        tasks=(
            VACUUM_FILTER_CLEANING_RUNTIME,
            VACUUM_MAIN_BRUSH_RUNTIME,
            # Samsung fridge water filter / hood grease filter: usage counts
            # UP in percent; replacing/cleaning resets to 0 (auto-resolve).
            ConsumableSignature(("water_filter_usage",), "Replace Water Filter", "alert_above", delta_units=90, resets=(("water_filter_usage", "reset_water_filter"),)),
            # 2.95: SmartThings resets both counters itself (button.py).
            ConsumableSignature(("hood_filter_usage",), "Clean Grease Filter", "alert_above", delta_units=90, resets=(("hood_filter_usage", "reset_hood_filter"),)),
            # Jet Bot Clean Station: the station's disposable dust bag is full;
            # the station reporting it not full after the swap auto-resolves.
            ConsumableSignature(
                ("robot_cleaner_dust_bag",),
                "Replace Dust Bag",
                "event_present",
                entity_domain="binary_sensor",
                on_states=("on",),
            ),
        ),
    ),
    "sharkiq": IntegrationSignature(
        name="Shark IQ",
        verified="2026-07-18 @ home-assistant/core dev",
        source=(
            "home-assistant/core homeassistant/components/sharkiq/vacuum.py "
            "(vacuum platform verified present; no consumable sensors) — the "
            "ENGINE accumulates cleaning time."
        ),
        tasks=(
            VACUUM_FILTER_CLEANING_RUNTIME,
            VACUUM_MAIN_BRUSH_RUNTIME,
        ),
    ),
    "tplink": IntegrationSignature(
        name="TP-Link Tapo vacuum",
        verified="2026-07-18 (vacuum) @ home-assistant/core dev; consumables 2026-09-27 @ home-assistant/core 2026.9 + python-kasa 0.10.2",
        source=(
            "home-assistant/core homeassistant/components/tplink/vacuum.py "
            "(vacuum platform) — the ENGINE accumulates cleaning time, entity_domain-gated "
            "so the bridge's other device types are untouched (washing the filter / "
            "de-tangling the brush stays a separate duty from replacing the part). "
            "2026-09 round: sensor.py consumable descriptions — entity.py "
            "_description_for_feature sets translation_key = the python-kasa feature id: "
            "'main_brush_remaining', 'side_brush_remaining', 'filter_remaining', "
            "'sensor_remaining', 'charging_contacts_remaining' (DURATION, native SECONDS, "
            "suggested HOURS, entity_registry_enabled_default=False). python-kasa "
            "smart/modules/consumables.py: remaining = lifetime − used with lifetimes 400 h "
            "(main brush) / 200 h (side brush, filter) / 30 h (sensor, charging contacts) — "
            "countdowns to replacement/cleaning. button.py resets 'main_brush_reset' / "
            "'side_brush_reset' / 'filter_reset' / 'sensor_reset' / 'charging_contacts_reset' "
            "(kasa resetConsumablesTime; Debug category → disabled by the integration, "
            "wiring enables them). The '*_used' twins (Debug, disabled) are skipped — one "
            "signal per part."
        ),
        tasks=(
            VACUUM_FILTER_CLEANING_RUNTIME,
            VACUUM_MAIN_BRUSH_RUNTIME,
            ConsumableSignature(("main_brush_remaining",), "Replace Main Brush", "duration_left", resets=(("main_brush_remaining", "main_brush_reset"),)),
            ConsumableSignature(("side_brush_remaining",), "Replace Side Brush", "duration_left", resets=(("side_brush_remaining", "side_brush_reset"),)),
            ConsumableSignature(("filter_remaining",), "Replace Filter", "duration_left", resets=(("filter_remaining", "filter_reset"),)),
            # 30-hour cleaning cycles: warn in the last 6 h instead of the 24 h
            # default, which would fire 6 h after the previous cleaning.
            ConsumableSignature(("sensor_remaining",), "Clean Sensors", "duration_left", below_hours=6, resets=(("sensor_remaining", "sensor_reset"),)),
            ConsumableSignature(
                ("charging_contacts_remaining",),
                "Clean Charging Contacts",
                "duration_left",
                below_hours=6,
                resets=(("charging_contacts_remaining", "charging_contacts_reset"),),
            ),
        ),
    ),
    "mydolphin_plus": IntegrationSignature(
        name="Maytronics Dolphin",
        verified="2026-07-18 @ sh00t2kill/dolphin-robot master",
        source=(
            "sh00t2kill/dolphin-robot common/consts.py "
            "(DATA_KEY_FILTER_STATUS 'Filter Status' -> entity suffix "
            "_filter_status; FILTER_BAG_STATUS enum empty/partially_full/"
            "getting_full/almost_full/full/fault) — latch on 'full', emptying "
            "the bag drops the state back (auto-resolve)."
        ),
        tasks=(
            ConsumableSignature(
                ("filter_status",),
                "Filter Cleaning",
                "event_present",
                on_states=("full",),
            ),
        ),
    ),
    "robovac_mqtt": IntegrationSignature(
        name="Eufy Clean",
        verified="2026-09-25 @ jeppesens/eufy-clean main; resets 2026-09-27 @ baeb32c",
        source=(
            "jeppesens/eufy-clean custom_components/robovac_mqtt/sensor.py accessory "
            "sensors: RoboVacSensor(coordinator, attr.replace('_usage', '_remaining'), "
            "name, …) with _attr_has_entity_name and names 'Filter Remaining' / "
            "'Rolling Brush Remaining' / 'Side Brush Remaining' / 'Sensor Remaining' / "
            "'Cleaning Tray Remaining' / 'Mopping Cloth Remaining' → entity-id "
            "suffixes; unit 'h', value = max life − usage (const.py "
            "ACCESSORY_MAX_LIFE / SCALAR_ACCESSORY_MAX_LIFE) → hours REMAINING, reset "
            "buttons in button.py. Tray and mop only on mop-capable (novel) models. "
            "Resets: button.py _ACCESSORY_RESET_BUTTONS, _attr_has_entity_name + names "
            "'Reset Filter' / 'Reset Rolling Brush' / 'Reset Side Brush' / 'Reset Sensors' "
            "(plural) / 'Reset Cleaning Tray' / 'Reset Mopping Cloth' (CONFIG, no tk → "
            "entity-id suffixes; the unique_id suffixes differ and are not used). Legacy "
            "(Tuya-cloud) devices get neither the accessory sensors nor the buttons."
        ),
        tasks=(
            ConsumableSignature(("filter_remaining",), "Replace Filter", "duration_left", resets=(("filter_remaining", "reset_filter"),)),
            ConsumableSignature(("rolling_brush_remaining",), "Replace Main Brush", "duration_left", resets=(("rolling_brush_remaining", "reset_rolling_brush"),)),
            ConsumableSignature(("side_brush_remaining",), "Replace Side Brush", "duration_left", resets=(("side_brush_remaining", "reset_side_brush"),)),
            ConsumableSignature(("mopping_cloth_remaining",), "Replace Mop Pads", "duration_left", resets=(("mopping_cloth_remaining", "reset_mopping_cloth"),)),
            # Short cleaning intervals (sensors 60/35 h, tray 30 h): warn in
            # the last 6 h instead of the 24 h default, which would fire
            # almost right after the previous cleaning.
            ConsumableSignature(("sensor_remaining",), "Clean Sensors", "duration_left", below_hours=6, resets=(("sensor_remaining", "reset_sensors"),)),
            ConsumableSignature(
                ("cleaning_tray_remaining",),
                "Clean Mop Tray",
                "duration_left",
                below_hours=6,
                resets=(("cleaning_tray_remaining", "reset_cleaning_tray"),),
            ),
        ),
    ),
    "robovac": IntegrationSignature(
        name="Eufy RoboVac",
        verified="2026-09-25 @ damacus/robovac main",
        source=(
            "damacus/robovac custom_components/robovac/vacuum.py (vacuum platform, "
            "VacuumActivity.CLEANING) — the ENGINE accumulates cleaning time on every "
            "model. sensor.py RobovacConsumableSensor (proto models with DPS 168 only): "
            "_attr_has_entity_name, _attr_name = label from _PROTO_CONSUMABLES ('Side "
            "Brush' / 'Rolling Brush' / 'Filter' / 'Scraper' / 'Sensor' / 'Mop') → "
            "entity-id suffixes; unit 'h' = 'cumulative hours since the last manual "
            "reset' (proto_decode.decode_consumable_response) → usage_above. Limits = "
            "Eufy's accessory lifetimes as encoded in jeppesens/eufy-clean const.py "
            "ACCESSORY_MAX_LIFE (same DPS 168 ConsumableResponse). 'Dust Bag' skipped "
            "(no lifetime reference)."
        ),
        tasks=(
            VACUUM_FILTER_CLEANING_RUNTIME,
            VACUUM_MAIN_BRUSH_RUNTIME,
            ConsumableSignature(("filter",), "Replace Filter", "usage_above", above_hours=360),
            ConsumableSignature(("rolling_brush",), "Replace Main Brush", "usage_above", above_hours=360),
            ConsumableSignature(("side_brush",), "Replace Side Brush", "usage_above", above_hours=180),
            ConsumableSignature(("mop",), "Replace Mop Pads", "usage_above", above_hours=180),
            ConsumableSignature(("sensor",), "Clean Sensors", "usage_above", above_hours=60),
            ConsumableSignature(("scraper",), "Clean Mop Tray", "usage_above", above_hours=30),
        ),
    ),
    "tineco": IntegrationSignature(
        name="Tineco",
        verified="2026-09-25 @ wheeller123/Tineco-Integration main",
        source=(
            "wheeller123/Tineco-Integration custom_components/tineco/sensor.py "
            "TinecoBrushRollerSensor: _attr_translation_key 'brush_roller', ENUM "
            "options normal/tangled/stuck/needs_cleaning (br code 3) — latch on "
            "'needs_cleaning'; the device reporting 'normal' again auto-resolves."
        ),
        tasks=(
            ConsumableSignature(
                ("brush_roller",),
                "Clean Main Brush",
                "event_present",
                on_states=("needs_cleaning",),
            ),
        ),
    ),
    "xiaomi_vacuum": IntegrationSignature(
        name="Xiaomi Vacuum (cloud)",
        verified="2026-09-25 @ roquerodrigo/ha-xiaomi-vacuum main",
        source=(
            "roquerodrigo/ha-xiaomi-vacuum custom_components/xiaomi_vacuum/sensor/"
            "{filter,main_brush,side_brush,mop}_life.py: _attr_translation_key "
            "'filter_life' / 'main_brush_life' / 'side_brush_life' / 'mop_life', "
            "life_base.py PERCENTAGE 'remaining life 0-100' (MIoT life-level)."
        ),
        tasks=(
            MAIN_BRUSH_LIFE_PERCENT,
            SIDE_BRUSH_LIFE_PERCENT,
            FILTER_LIFE_PERCENT,
            MOP_LIFE_PERCENT,
        ),
    ),
    "ilife": IntegrationSignature(
        name="ILIFE",
        verified="2026-09-25 @ maximedeprince/ha-ilife main; resets 2026-09-27 @ 6114e0f",
        source=(
            "maximedeprince/ha-ilife custom_components/ilife/sensor.py SENSORS "
            "(ILIFE-cloud backend): translation_key 'main_brush' / 'side_brush' / "
            "'filter', PERCENTAGE from PartsStatus MainBrushLife/SideBrushLife/"
            "FilterLife; api.py reset_part sets the field back to 100 → remaining. "
            "Gated on the sibling tk 'history' (ILifeHistorySensor, cloud backend "
            "only): the Tuya backend's TuyaGenericSensor names raw DP codes (a bare "
            "'filter' DP of unknown unit/direction would otherwise suffix-match). "
            "button.py _RESETS: tk 'reset_main_brush' / 'reset_side_brush' / "
            "'reset_filter' (CONFIG; press = api.reset_part → the PartsStatus field back "
            "to 100) — cloud backend only, like the duties."
        ),
        tasks=(
            ConsumableSignature(
                ("main_brush",),
                "Replace Main Brush",
                "percent_left",
                require_sibling_keys=("history",),
                resets=(("main_brush", "reset_main_brush"),),
            ),
            ConsumableSignature(
                ("side_brush",),
                "Replace Side Brush",
                "percent_left",
                require_sibling_keys=("history",),
                resets=(("side_brush", "reset_side_brush"),),
            ),
            ConsumableSignature(
                ("filter",),
                "Replace Filter",
                "percent_left",
                require_sibling_keys=("history",),
                resets=(("filter", "reset_filter"),),
            ),
        ),
    ),
    "viomise": IntegrationSignature(
        name="Viomi SE vacuum",
        verified="2026-09-27 @ marotoweb/home-assistant-vacuum-viomise master (21deeda, HACS default)",
        source=(
            "marotoweb/home-assistant-vacuum-viomise custom_components/viomise/sensor.py "
            "SENSOR_DESCRIPTIONS: _attr_has_entity_name, names 'Main Brush Life' / 'Side "
            "Brush Life' / 'Filter Life' / 'Mop Life' (no translation_key → entity-id "
            "suffixes), PERCENTAGE from the MIoT *_percentage values = life left. No reset "
            "button or service (services.yaml: clean / goto only)."
        ),
        tasks=(
            MAIN_BRUSH_LIFE_PERCENT,
            SIDE_BRUSH_LIFE_PERCENT,
            FILTER_LIFE_PERCENT,
            MOP_LIFE_PERCENT,
        ),
    ),
    "roomba_rest980": IntegrationSignature(
        name="Roomba (rest980)",
        verified="2026-09-27 @ ia74/roomba_rest980 main (012a86f, HACS default)",
        source=(
            "ia74/roomba_rest980 custom_components/roomba_rest980/RoombaSensor.py "
            "(_attr_has_entity_name, _attr_name from _rs_given_info, no translation_key → "
            "entity-id suffixes). sensor.py RoombaTotalTime 'Total Time' = runtimeStats "
            "hr*60 + min (DURATION, MINUTES — the robot's LIFETIME runtime, never reset) → "
            "usage_delta on the catalog's vacuum cadences (filter wash 15 h, brush clean "
            "30 h) from the robot's own counter, which also runs while HA is down. "
            "RoombaBinSensor 'Bin' (ENUM 'Not Full' / 'Full' from bin.full) → latch on "
            "'Full'. 'Total Jobs' carries a bogus MINUTES unit — ignored."
        ),
        tasks=(
            ConsumableSignature(("total_time",), "Filter Cleaning", "usage_delta", delta_units=15),
            ConsumableSignature(("total_time",), "Clean Main Brush", "usage_delta", delta_units=30),
            ConsumableSignature(("bin",), "Empty Dustbin", "event_present", on_states=("Full",)),
        ),
    ),
    "roomba_plus": IntegrationSignature(
        name="Roomba+ (local MQTT)",
        verified="2026-09-27 @ johnnyh1975/ha_roomba_plus main (ca95fc4, HACS default)",
        source=(
            "johnnyh1975/ha_roomba_plus sensor_core.py maintenance descriptions (tk = key): "
            "'filter_remaining_hours', 'brush_remaining_hours' (the main brushes), "
            "'part_edge_brush' (not on Braava), 'part_dirt_bag' (Clean Base only) — "
            "DURATION HOURS remaining (iRobot cloud counter first, else the local "
            "baseline vs const.py defaults 60 h filter / 200 h brushes / 150 h side brush "
            "/ 30 h bag). button.py maintenance resets tk 'reset_filter', 'reset_brush', "
            "'reset_side_brush', 'reset_clean_base_bag' (CONFIG, enabled; the press "
            "restarts the local countdown and pushes the part reset to the cloud). "
            "Floors ≈ 10 % of each part's default budget (the 24 h default would fire "
            "with 80 % of a 30 h bag left). bin_full is device_class problem → "
            "problem-sensor adoption."
        ),
        tasks=(
            ConsumableSignature(
                ("filter_remaining_hours",),
                "Replace Filter",
                "duration_left",
                below_hours=6,
                resets=(("filter_remaining_hours", "reset_filter"),),
            ),
            ConsumableSignature(
                ("brush_remaining_hours",),
                "Replace Main Brush",
                "duration_left",
                below_hours=20,
                resets=(("brush_remaining_hours", "reset_brush"),),
            ),
            ConsumableSignature(
                ("part_edge_brush",),
                "Replace Side Brush",
                "duration_left",
                below_hours=15,
                resets=(("part_edge_brush", "reset_side_brush"),),
            ),
            ConsumableSignature(
                ("part_dirt_bag",),
                "Replace Dust Bag",
                "duration_left",
                below_hours=3,
                resets=(("part_dirt_bag", "reset_clean_base_bag"),),
            ),
        ),
        translation_keys_authoritative=True,
    ),
    "wellbeing": IntegrationSignature(
        name="Electrolux Wellbeing",
        verified="2026-09-27 @ JohNan/homeassistant-wellbeing main (6e294d3, HACS default)",
        source=(
            "JohNan/homeassistant-wellbeing entity.py forces entity_id = "
            "slugify(f'wellbeing_{appliance}_{attr}') (no translation_key) → suffixes. "
            "api.py PUREi9 robot: ApplianceConsumableSensor 'Main Brush' / 'Side Brush' / "
            "'Filter' (attrs main_brush_sqm / side_brush_sqm / filter_sqm, PERCENTAGE, "
            "value = 100 × (1 − m² since reset / rated m²), rated 3000 / 1000 / 1000 m² — "
            "life LEFT; ratings reverse-engineered from the Electrolux app). Purifiers: "
            "'FilterLife' (A9) and 'FilterLife_1' / 'FilterLife_2' (two filter slots), "
            "PERCENTAGE left; entities exist only for attrs the appliance reports. One "
            "appliance is either a robot or a purifier, so the filter keys share one "
            "per-entity duty. No reset button or service. 'hepaFilterState' (ENUM) "
            "skipped — states undocumented."
        ),
        tasks=(
            ConsumableSignature(("main_brush_sqm",), "Replace Main Brush", "percent_left"),
            ConsumableSignature(("side_brush_sqm",), "Replace Side Brush", "percent_left"),
            ConsumableSignature(
                ("filter_sqm", "filterlife", "filterlife_1", "filterlife_2"),
                "Replace Filter",
                "percent_left",
                per_entity=True,
            ),
        ),
    ),
}
