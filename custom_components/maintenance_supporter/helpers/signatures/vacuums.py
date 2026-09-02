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
        verified="2026-07-18 @ home-assistant/core dev",
        source=(
            "home-assistant/core homeassistant/components/tuya/vacuum.py "
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
}
