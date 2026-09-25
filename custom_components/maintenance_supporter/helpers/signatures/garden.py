"""Robot lawn mowers, irrigation and pool/spa water care.

Data module of the suggested-setups signature catalog — see
``helpers/signatures/_model.py`` for the direction semantics and the
method contract (every entry cites and is verified against the
integration's source; drift-probed weekly)."""

from __future__ import annotations

from ._model import ConsumableSignature, IntegrationSignature

SIGNATURES: dict[str, IntegrationSignature] = {
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
            ConsumableSignature(("total_cutting_time",), "Clean Undercarriage", "usage_delta", delta_units=25),
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
            ConsumableSignature(("mower_runtime_total",), "Clean Undercarriage", "usage_delta", delta_units=25),
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
            ConsumableSignature(("operating_hours",), "Replace Blades", "usage_delta", delta_units=100),
            ConsumableSignature(("operating_hours",), "Clean Undercarriage", "usage_delta", delta_units=25),
        ),
    ),
    # Same source entity, second duty — the matcher allows multi-duty.
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
    "sunseeker": IntegrationSignature(
        name="Sunseeker mowers",
        verified="2026-07-20 @ Sdahl1234/Sunseeker-lawn-mower main sensor.py (HACS default)",
        source=(
            "HACS sunseeker (also Ambrogio/Techline via ZCS): REAL blade-wear "
            "sensors — 'Blade time left' / 'Cutterplade time left' / 'Small "
            "blade time left' (UnitOfTime.HOURS remaining, tk "
            "sunseeker_*_time_left) and the matching '*_health' (PERCENTAGE "
            "remaining). Dual-unit like the LG filter: hours→duration_left, "
            "percent→percent_left, both the one blade-replacement duty."
        ),
        tasks=(
            ConsumableSignature(
                (
                    "blade_time_left",
                    "cutterplade_time_left",
                    "small_blade_time_left",
                    "sunseeker_blade_time_left",
                    "sunseeker_cutterplade_time_left",
                    "sunseeker_small_blade_time_left",
                ),
                "Replace Blades",
                "duration_left",
                below_hours=24,
            ),
            ConsumableSignature(
                (
                    "blade_health",
                    "cutterplade_health",
                    "small_blade_health",
                    "sunseeker_blade_health",
                    "sunseeker_cutterplade_health",
                    "sunseeker_small_blade_health",
                ),
                "Replace Blades",
                "percent_left",
            ),
        ),
    ),
    "husqvarna_automower_ble": IntegrationSignature(
        name="Husqvarna Automower BLE",
        verified="2026-07-18 @ home-assistant/core dev",
        source=(
            "home-assistant/core homeassistant/components/husqvarna_automower_ble/"
            "lawn_mower.py (lawn_mower entity; the BLE variant exposes no blade "
            "counter) — the ENGINE accumulates mowing time."
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
    "rainbird": IntegrationSignature(
        name="Rain Bird irrigation",
        verified="2026-07-20 @ home-assistant/core dev",
        source=(
            "core rainbird: switch.py creates one irrigation-zone switch per "
            "zone, each on its own 'Rain Bird Sprinkler <n>' device (single "
            "switch entity per device). No consumable sensors; the rainsensor "
            "binary carries no device_class (not adoptable) and raindelay is "
            "operational — the ENGINE accumulates actual watering time on the "
            "zone switch instead. Cadence per Rain Bird's maintenance "
            "guidance: inspect/clean heads and (drip) filters at least once a "
            "season — ~30 h of watering at typical in-season use."
        ),
        tasks=(
            ConsumableSignature(
                (),
                "Clean Sprinkler Heads",
                "runtime_hours",
                delta_units=30,
                entity_domain="switch",
                on_states=("on",),
            ),
        ),
    ),
    # Pool chlorinator salt: refill when the water's salt concentration
    # drops below the generator's operating band (Pentair: 2600-4500 ppm;
    # low-salt cells stop producing chlorine). Topping up raises the value
    # back — auto-resolve.
    "screenlogic": IntegrationSignature(
        name="Pentair ScreenLogic",
        verified="2026-07-20 @ home-assistant/core dev",
        source=("core screenlogic: tk 'salt_ppm' (MEASUREMENT, ppm) — IntelliChlor salt concentration."),
        tasks=(ConsumableSignature(("salt_ppm",), "Refill Pool Salt", "value_below", delta_units=2700),),
    ),
    "ondilo_ico": IntegrationSignature(
        name="Ondilo ICO",
        verified="2026-07-20 @ home-assistant/core dev",
        source=("core ondilo_ico: tk 'salt' (mg/L ≡ ppm numerically) — pool salt concentration."),
        tasks=(ConsumableSignature(("salt",), "Refill Pool Salt", "value_below", delta_units=2700),),
    ),
    # --- Round 14 (2026-09-25) --------------------------------------------
    "mammotion": IntegrationSignature(
        name="Mammotion (Luba)",
        verified="2026-09-25 @ mikey0000/Mammotion-HA main",
        source=(
            "HACS mammotion (not in the default store) sensor.py "
            "LUBA_SENSOR_ONLY_TYPES (MammotionSensorEntity sets translation_key "
            "= key): 'blade_used_time' (maintenance.blade_used_time, SECONDS, "
            "suggested h — counts since the blade reset; lawn_mower.py service "
            "reset_blade_time) and 'maintenance_work_time' ('Total work "
            "time', SECONDS, lifetime). Yuka models carry no blade sensors."
        ),
        tasks=(
            ConsumableSignature(("blade_used_time",), "Replace Blades", "usage_above"),
            ConsumableSignature(("maintenance_work_time",), "Clean Undercarriage", "usage_delta", delta_units=25),
        ),
    ),
    "dreame_mower": IntegrationSignature(
        name="Dreame Mower",
        verified="2026-09-25 @ bhuebschen/dreame-mower main",
        source=(
            "HACS dreame_mower sensor.py DreameMowerProperty.BLADES_LEFT → "
            "key/translation_key 'blades_left' (dreame/const.py; siid 9 piid "
            "2, UNIT_PERCENT — device.blades_life 'blade remaining life in "
            "percent'; only created when the mower reports it, exists_fn)."
        ),
        tasks=(ConsumableSignature(("blades_left",), "Replace Blades", "percent_left"),),
    ),
    # Two HACS forks share the domain and the keys (SmartServicePL and
    # ADNPolymerase) — mirrors landroid_cloud.
    "worx_vision_cloud": IntegrationSignature(
        name="Worx Landroid Vision",
        verified=("2026-09-25 @ SmartServicePL/worx_vision_cloud_plus_github main + ADNPolymerase/ha-landroid-vision main"),
        source=(
            "HACS worx_vision_cloud sensor.py (both forks): tk "
            "'blade_runtime_current' (blades.current_on or blade_work_time "
            "minus the reset marker — since the last blade reset, MINUTES) "
            "and 'mower_runtime_total' (worktime_total, MINUTES, "
            "TOTAL_INCREASING lifetime)."
        ),
        tasks=(
            ConsumableSignature(("blade_runtime_current",), "Replace Blades", "usage_above"),
            ConsumableSignature(("mower_runtime_total",), "Clean Undercarriage", "usage_delta", delta_units=25),
        ),
    ),
    "intellicenter": IntegrationSignature(
        name="Pentair IntelliCenter",
        verified="2026-09-25 @ joyfulhouse/intellicenter main",
        source=(
            "HACS intellicenter sensor.py: chlorinator (CHLORINATOR_SUBTYPE) "
            "PoolSensor on SALT_ATTR, name '+ (Salt)' → '<IntelliChlor> "
            "(Salt)', CONCENTRATION_PPM (no translation_key → suffix _salt). "
            "Same IntelliChlor band as ScreenLogic."
        ),
        tasks=(ConsumableSignature(("salt",), "Refill Pool Salt", "value_below", delta_units=2700),),
    ),
    "hotspring": IntegrationSignature(
        name="Hot Spring spas",
        verified="2026-09-25 @ home-assistant/core dev",
        source=(
            "core hotspring sensor.py (new in 2026.9): tk "
            "'water_care_120_day_timer' ('Salt cartridge age' — per the "
            "integration docs 'number of days the FreshWater Salt System "
            "cartridge has been in use', i.e. counts UP; DURATION DAYS; only "
            "created while a cartridge is installed; python-hotspring passes "
            "the spa's raw 120DayTimer). Hot Spring rates the cartridge for "
            "up to four months → 120 days = 2,880 h."
        ),
        tasks=(ConsumableSignature(("water_care_120_day_timer",), "Replace Salt Cartridge", "usage_above", above_hours=2880),),
    ),
    "neopool": IntegrationSignature(
        name="Sugar Valley NeoPool",
        verified="2026-09-25 @ home-assistant/core dev",
        source=(
            "core neopool binary_sensor.py (platform on dev, i.e. 2026.10): tk "
            "'uv_lamp' (RUNNING; neopool_modbus decodes the UV relay bit, "
            "created only for a valid MBF_PAR_UV_RELAY_GPIO). No lamp-hours "
            "counter — the ENGINE accumulates lamp-on time. Sugar Valley "
            "UVScenic manual (routine maintenance): UV lamps last '1 year or "
            "8,000 hours'. NOTE: 'measure_cl' is chlorine ppm despite its "
            "'Salt level' label and is never mapped to salt; "
            "cell_runtime_part has no documented cleaning interval (cells "
            "self-clean by polarity reversal) and is not used."
        ),
        tasks=(
            ConsumableSignature(
                ("uv_lamp",),
                "Replace UV Lamp",
                "runtime_hours",
                delta_units=8000,
                entity_domain="binary_sensor",
                on_states=("on",),
            ),
        ),
    ),
    "bestway": IntegrationSignature(
        name="Bestway (Lay-Z-Spa / Flowclear)",
        verified="2026-09-25 @ cdpuk/ha-bestway main",
        source=(
            "HACS bestway binary_sensor.py PoolFilterChangeRequiredSensor "
            "(key 'pool_filter_change_required', name 'Pool Filter Change "
            "Required', no device class → not adoptable as a problem sensor; "
            "status.filter_change_required from the pump's 'filter' "
            "attribute). No has_entity_name → entity_id "
            "'binary_sensor.pool_filter_change_required' (exact object-id "
            "match). State latch on 'on'; clears after the change."
        ),
        tasks=(
            ConsumableSignature(
                ("pool_filter_change_required",),
                "Replace Filter",
                "event_present",
                entity_domain="binary_sensor",
                on_states=("on",),
            ),
        ),
    ),
}
