"""Cleaning robots — vacuums, mops and the Dolphin pool robot.

Interval audit 2026-07-19: the sensor-less runtime duties (filter wash
15 h / main-brush clean 30 h of cleaning time) map to Roborock's official
biweekly cleaning cadence at typical 1-2 h/day usage.

Data module of the suggested-setups signature catalog — see
``helpers/signatures/_model.py`` for the direction semantics and the
method contract (every entry cites and is verified against the
integration's source; drift-probed weekly)."""

from __future__ import annotations

from ._model import ConsumableSignature, IntegrationSignature

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
            ConsumableSignature(("main_brush_time_left", "brush_remaining"), "Replace Main Brush", "duration_left"),
            ConsumableSignature(("side_brush_time_left",), "Replace Side Brush", "duration_left"),
            ConsumableSignature(("filter_time_left",), "Replace Filter", "duration_left"),
            ConsumableSignature(("sensor_time_left",), "Clean Sensors", "duration_left"),
            ConsumableSignature(("mop_life_time_left",), "Replace Mop Pads", "duration_left"),
            # Dock consumables: the 'hours' are the dock's wash-count budget
            # (150 / 300); 24 left ≈ the last 8-16 % of the part's life.
            ConsumableSignature(("strainer_time_left",), "Replace Dock Strainer", "duration_left"),
            ConsumableSignature(("cleaning_brush_time_left",), "Replace Maintenance Brush", "duration_left"),
            # Zeo washer: washes since the last drum-clean program (unitless;
            # above_hours is the wash count, ~monthly like LG's tub counter).
            ConsumableSignature(("times_after_clean",), "Clean Tub", "usage_above", above_hours=30),
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
        verified="2026-09-02 @ Tasshack/dreame-vacuum master (ae8422f2)",
        source=(
            "Tasshack/dreame-vacuum custom_components/dreame_vacuum/sensor.py "
            "(property_key *_LEFT, UNIT_PERCENT) + dreame/const.py PROPERTY_TO_NAME "
            "(translation_key = first element, e.g. mop_pad_left); every *_left "
            "sensor is entity_registry_enabled_default=False — the user enables "
            "the ones their model has (#150, station consumables)."
        ),
        tasks=(
            ConsumableSignature(("main_brush_left",), "Replace Main Brush", "percent_left"),
            ConsumableSignature(("side_brush_left",), "Replace Side Brush", "percent_left"),
            ConsumableSignature(("filter_left",), "Replace Filter", "percent_left"),
            ConsumableSignature(("sensor_dirty_left",), "Clean Sensors", "percent_left"),
            # Self-wash base stations (L10s/L20/X30/X40 …) add four more wear
            # counters — same percent scale, same *_left key convention.
            ConsumableSignature(("mop_pad_left",), "Replace Mop Pads", "percent_left"),
            ConsumableSignature(("detergent_left",), "Refill Detergent", "percent_left"),
            ConsumableSignature(("secondary_filter_left",), "Replace Secondary Filter", "percent_left"),
            ConsumableSignature(("silver_ion_left",), "Replace Silver-ion Module", "percent_left"),
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
            ConsumableSignature(("lifespan_brush", "lifespan_main_brush"), "Replace Main Brush", "percent_left"),
            ConsumableSignature(("lifespan_side_brush",), "Replace Side Brush", "percent_left"),
            # The robot's filter and the handheld unit's filter (combo models)
            # are separate parts — one task per entity when a device has both.
            ConsumableSignature(("lifespan_filter", "lifespan_hand_filter"), "Replace Filter", "percent_left", per_entity=True),
            ConsumableSignature(("lifespan_station_filter",), "Replace Secondary Filter", "percent_left"),
            ConsumableSignature(("lifespan_dust_bag",), "Replace Dust Bag", "percent_left"),
            ConsumableSignature(("lifespan_round_mop",), "Replace Mop Pads", "percent_left"),
            ConsumableSignature(("lifespan_cleaning_solution",), "Refill Detergent", "percent_left"),
            ConsumableSignature(("lifespan_sewage_box",), "Empty Dirty Water Tank", "percent_left"),
            ConsumableSignature(("lifespan_water_sink",), "Clean Mop Tray", "percent_left"),
            ConsumableSignature(("lifespan_air_freshener",), "Replace Air Freshener", "percent_left"),
            ConsumableSignature(("lifespan_uv_sanitizer",), "Replace UV Lamp", "percent_left"),
            # GOAT robotic mowers report their wear parts through the same platform.
            ConsumableSignature(("lifespan_blade",), "Replace Blades", "percent_left"),
            ConsumableSignature(("lifespan_lens_brush",), "Replace Lens Brush", "percent_left"),
            ConsumableSignature(("lifespan_trimmer_brush",), "Replace Trimmer Brush", "percent_left"),
            ConsumableSignature(("lifespan_weed_rope",), "Replace Trimmer Line", "percent_left"),
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
    "roomba": IntegrationSignature(
        name="iRobot Roomba",
        verified="2026-07-18 @ home-assistant/core dev",
        source=(
            "home-assistant/core homeassistant/components/roomba/vacuum.py "
            "(vacuum platform verified present; no consumable sensors) — the "
            "ENGINE accumulates cleaning time."
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
    "romy": IntegrationSignature(
        name="ROMY Vacuum",
        verified="2026-07-18 @ home-assistant/core dev",
        source=(
            "home-assistant/core homeassistant/components/romy/vacuum.py "
            "(vacuum platform verified present; no consumable sensors) — the "
            "ENGINE accumulates cleaning time."
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
            ConsumableSignature(("rolling_brush_life",), "Replace Main Brush", "percent_left"),
            ConsumableSignature(("side_brush_life",), "Replace Side Brush", "percent_left"),
            ConsumableSignature(("filter_life",), "Replace Filter", "percent_left"),
            ConsumableSignature(("duster_cloth_life",), "Replace Mop Pads", "percent_left"),
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
    "switchbot_cloud": IntegrationSignature(
        name="SwitchBot vacuum",
        verified="2026-07-18 @ home-assistant/core dev",
        source=(
            "home-assistant/core homeassistant/components/switchbot_cloud/vacuum.py "
            "(vacuum platform verified present; no consumable sensors) — the "
            "ENGINE accumulates cleaning time, entity_domain-gated so the bridge's other device types are untouched."
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
    "smartthings": IntegrationSignature(
        name="SmartThings",
        verified="2026-07-18 (vacuum) / 2026-07-20 (filters) @ home-assistant/core dev",
        source=(
            "home-assistant/core homeassistant/components/smartthings/vacuum.py "
            "(vacuum platform verified present; no consumable sensors) — the "
            "ENGINE accumulates cleaning time, entity_domain-gated so the bridge's other device types are untouched. "
            "sensor.py: tk 'water_filter_usage' (custom.waterFilter, "
            "PERCENTAGE, MEASUREMENT — Samsung fridge water filter, % USED "
            "counting up; replacement resets to 0) and tk 'hood_filter_usage' "
            "(SAMSUNG_CE_HOOD_FILTER, PERCENTAGE) — same up-counting shape."
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
            # Samsung fridge water filter / hood grease filter: usage counts
            # UP in percent; replacing/cleaning resets to 0 (auto-resolve).
            ConsumableSignature(("water_filter_usage",), "Replace Water Filter", "alert_above", delta_units=90),
            ConsumableSignature(("hood_filter_usage",), "Clean Grease Filter", "alert_above", delta_units=90),
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
    "tplink": IntegrationSignature(
        name="TP-Link Tapo vacuum",
        verified="2026-07-18 @ home-assistant/core dev",
        source=(
            "home-assistant/core homeassistant/components/tplink/vacuum.py "
            "(vacuum platform verified present; no consumable sensors) — the "
            "ENGINE accumulates cleaning time, entity_domain-gated so the bridge's other device types are untouched."
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
        verified="2026-09-25 @ jeppesens/eufy-clean main",
        source=(
            "jeppesens/eufy-clean custom_components/robovac_mqtt/sensor.py accessory "
            "sensors: RoboVacSensor(coordinator, attr.replace('_usage', '_remaining'), "
            "name, …) with _attr_has_entity_name and names 'Filter Remaining' / "
            "'Rolling Brush Remaining' / 'Side Brush Remaining' / 'Sensor Remaining' / "
            "'Cleaning Tray Remaining' / 'Mopping Cloth Remaining' → entity-id "
            "suffixes; unit 'h', value = max life − usage (const.py "
            "ACCESSORY_MAX_LIFE / SCALAR_ACCESSORY_MAX_LIFE) → hours REMAINING, reset "
            "buttons in button.py. Tray and mop only on mop-capable (novel) models."
        ),
        tasks=(
            ConsumableSignature(("filter_remaining",), "Replace Filter", "duration_left"),
            ConsumableSignature(("rolling_brush_remaining",), "Replace Main Brush", "duration_left"),
            ConsumableSignature(("side_brush_remaining",), "Replace Side Brush", "duration_left"),
            ConsumableSignature(("mopping_cloth_remaining",), "Replace Mop Pads", "duration_left"),
            # Short cleaning intervals (sensors 60/35 h, tray 30 h): warn in
            # the last 6 h instead of the 24 h default, which would fire
            # almost right after the previous cleaning.
            ConsumableSignature(("sensor_remaining",), "Clean Sensors", "duration_left", below_hours=6),
            ConsumableSignature(("cleaning_tray_remaining",), "Clean Mop Tray", "duration_left", below_hours=6),
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
            ConsumableSignature(("main_brush_life",), "Replace Main Brush", "percent_left"),
            ConsumableSignature(("side_brush_life",), "Replace Side Brush", "percent_left"),
            ConsumableSignature(("filter_life",), "Replace Filter", "percent_left"),
            ConsumableSignature(("mop_life",), "Replace Mop Pads", "percent_left"),
        ),
    ),
    "ilife": IntegrationSignature(
        name="ILIFE",
        verified="2026-09-25 @ maximedeprince/ha-ilife main",
        source=(
            "maximedeprince/ha-ilife custom_components/ilife/sensor.py SENSORS "
            "(ILIFE-cloud backend): translation_key 'main_brush' / 'side_brush' / "
            "'filter', PERCENTAGE from PartsStatus MainBrushLife/SideBrushLife/"
            "FilterLife; api.py reset_part sets the field back to 100 → remaining. "
            "Gated on the sibling tk 'history' (ILifeHistorySensor, cloud backend "
            "only): the Tuya backend's TuyaGenericSensor names raw DP codes (a bare "
            "'filter' DP of unknown unit/direction would otherwise suffix-match)."
        ),
        tasks=(
            ConsumableSignature(("main_brush",), "Replace Main Brush", "percent_left", require_sibling_keys=("history",)),
            ConsumableSignature(("side_brush",), "Replace Side Brush", "percent_left", require_sibling_keys=("history",)),
            ConsumableSignature(("filter",), "Replace Filter", "percent_left", require_sibling_keys=("history",)),
        ),
    ),
}
