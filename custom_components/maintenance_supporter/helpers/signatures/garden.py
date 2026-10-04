"""Robot lawn mowers, irrigation and pool/spa water care.

Data module of the suggested-setups signature catalog — see
``helpers/signatures/_model.py`` for the direction semantics and the
method contract (every entry cites and is verified against the
integration's source; drift-probed weekly)."""

from __future__ import annotations

from ._model import ConsumableSignature, IntegrationSignature
from ._shared import (
    LANDROID_UNDERCARRIAGE_RUNTIME,
    MOWER_BLADES_RUNTIME,
    MOWER_UNDERCARRIAGE_RUNTIME,
    POOL_SALT_LOW,
)

SIGNATURES: dict[str, IntegrationSignature] = {
    "husqvarna_automower": IntegrationSignature(
        name="Husqvarna Automower",
        verified="2026-07-17 @ home-assistant/core dev",
        source=(
            "home-assistant/core homeassistant/components/husqvarna_automower/sensor.py "
            "(translation_key 'cutting_blade_usage_time', DURATION s→h; matching reset button exists)"
        ),
        tasks=(
            ConsumableSignature(("cutting_blade_usage_time",), "Replace Blades", "usage_above", resets=(("cutting_blade_usage_time", "reset_cutting_blade_usage_time"),)),
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
        verified="2026-07-17 (sensors) / 2026-09-27 (reset) @ MTrab/landroid_cloud master",
        source=(
            "MTrab/landroid_cloud custom_components/landroid_cloud/sensor.py "
            "(translation_key 'blade_runtime_current' — since last reset, DURATION min→h). "
            "button.py tk 'reset_blade_time' (CONFIG, disabled by default; "
            "en 'Reset blade runtime' → suffix _reset_blade_runtime) → "
            "pyworxcloud reset_blade_counter moves the reset marker, so the "
            "current runtime drops to 0 (verified @ f30af7f)."
        ),
        tasks=(
            ConsumableSignature(
                ("blade_runtime_current",),
                "Replace Blades",
                "usage_above",
                resets=(("blade_runtime_current", "reset_blade_time"),),
            ),
            LANDROID_UNDERCARRIAGE_RUNTIME,
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
            MOWER_BLADES_RUNTIME,
            MOWER_UNDERCARRIAGE_RUNTIME,
        ),
    ),
    "sunseeker": IntegrationSignature(
        name="Sunseeker mowers",
        verified="2026-07-20 (sensors) / 2026-09-27 (parts split, resets) @ Sdahl1234/Sunseeker-lawn-mower main (HACS default)",
        source=(
            "HACS sunseeker (also Ambrogio/Techline via ZCS), models S/X: "
            "four consumables, each with its own reset — 'Blade' (tk "
            "sunseeker_blade_time_left, HOURS, and sunseeker_blade_health, %), "
            "'Cutterplade' = the cutting disc (sunseeker_cutterplade_*), and "
            "with support_edge_trim the edge trimmer's 'Small blade' / 'Small "
            "cutterplade' (sunseeker_small_*); remaining = mp minus at of the "
            "consumable item. button.py (tk set on every entity): "
            "sunseeker_reset_blade / _reset_bladeplade / _reset_small_blade / "
            "_reset_small_bladeplade → maintain_consumable_item "
            "blade/cutter/small_blade/small_cutter (verified @ 659ef13). The "
            "parts wear and are reset independently, so each is its own duty "
            "(one reset per duty; the former any-low 'Replace Blades' over "
            "all parts could only have pressed one of them). The blade keeps "
            "both directions (hours + %); the other parts use the % sensor. "
            "Plain alias keys only match entities without a translation_key "
            "(translation_keys_authoritative) and are never paired with a "
            "reset."
        ),
        translation_keys_authoritative=True,
        tasks=(
            ConsumableSignature(
                ("blade_time_left", "sunseeker_blade_time_left"),
                "Replace Blades",
                "duration_left",
                below_hours=24,
                resets=(("sunseeker_blade_time_left", "sunseeker_reset_blade"),),
            ),
            ConsumableSignature(
                ("blade_health", "sunseeker_blade_health"),
                "Replace Blades",
                "percent_left",
                resets=(("sunseeker_blade_health", "sunseeker_reset_blade"),),
            ),
            ConsumableSignature(
                ("cutterplade_health", "sunseeker_cutterplade_health"),
                "Replace Cutting Disc",
                "percent_left",
                resets=(("sunseeker_cutterplade_health", "sunseeker_reset_bladeplade"),),
            ),
            ConsumableSignature(
                ("small_blade_health", "sunseeker_small_blade_health"),
                "Replace Edge Trimmer Blade",
                "percent_left",
                resets=(("sunseeker_small_blade_health", "sunseeker_reset_small_blade"),),
            ),
            ConsumableSignature(
                ("small_cutterplade_health", "sunseeker_small_cutterplade_health"),
                "Replace Edge Trimmer Disc",
                "percent_left",
                resets=(("sunseeker_small_cutterplade_health", "sunseeker_reset_small_bladeplade"),),
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
            MOWER_BLADES_RUNTIME,
            MOWER_UNDERCARRIAGE_RUNTIME,
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
        verified="2026-07-20 @ home-assistant/core dev; skips re-checked 2026-10-03 @ home-assistant/core 2026.10.0b0",
        source=(
            "core screenlogic: tk 'salt_ppm' (MEASUREMENT, ppm) — IntelliChlor salt concentration. "
            "2026-10-03 skip: 'salt_tds_ppm' is IntelliChem's CONFIGURATION value (a CONFIG "
            "number; its sensor twin is disabled by default as superseded) — a setting, not a "
            "reading."
        ),
        tasks=(ConsumableSignature(("salt_ppm",), "Refill Pool Salt", "value_below", delta_units=2700),),
    ),
    "ondilo_ico": IntegrationSignature(
        name="Ondilo ICO",
        verified="2026-07-20 @ home-assistant/core dev",
        source=("core ondilo_ico: tk 'salt' (mg/L ≡ ppm numerically) — pool salt concentration."),
        tasks=(POOL_SALT_LOW,),
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
            "percent'; only created when the mower reports it, exists_fn). "
            "button.py RESET_BLADES: entity.py sets translation_key = "
            "ACTION_TO_NAME key 'reset_blades' (entity_id <device>_reset_blades); "
            "device.py sets BLADES_LEFT back to 100 (verified @ 33a89dd). The "
            "button is unavailable while the blades are at 100 %. The sibling "
            "'blades_time_left' (hours, same reset) is the same duty and is not "
            "signed twice."
        ),
        tasks=(
            ConsumableSignature(
                ("blades_left",),
                "Replace Blades",
                "percent_left",
                resets=(("blades_left", "reset_blades"),),
            ),
        ),
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
            "TOTAL_INCREASING lifetime). button.py (both forks, verified @ "
            "ddccee6 / 2540f6c): tk 'reset_blade_counter' (CONFIG, enabled; "
            "note: not landroid_cloud's 'reset_blade_time') → pyworxcloud "
            "reset_blade_counter, the same reset marker."
        ),
        tasks=(
            ConsumableSignature(
                ("blade_runtime_current",),
                "Replace Blades",
                "usage_above",
                resets=(("blade_runtime_current", "reset_blade_counter"),),
            ),
            LANDROID_UNDERCARRIAGE_RUNTIME,
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
        tasks=(POOL_SALT_LOW,),
    ),
    "hotspring": IntegrationSignature(
        name="Hot Spring spas",
        verified="2026-09-25 (cartridge) / 2026-09-27 (10-day check) @ home-assistant/core 2026.9 + dev",
        source=(
            "core hotspring sensor.py (new in 2026.9): tk "
            "'water_care_120_day_timer' ('Salt cartridge age' — per the "
            "integration docs 'number of days the FreshWater Salt System "
            "cartridge has been in use', i.e. counts UP; DURATION DAYS; only "
            "created while a cartridge is installed; python-hotspring passes "
            "the spa's raw 120DayTimer). Hot Spring rates the cartridge for "
            "up to four months → 120 days = 2,880 h. tk "
            "'water_care_10_day_timer' ('Salt 10-day check timer', DURATION "
            "DAYS, same cartridge gate) — the docs: 'number of days remaining "
            "until the next 10-day salt water test reminder', their example "
            "automation fires below 1 day → duration_left at 24 h (= 1 d) "
            "for the test-strip water test; the task auto-resolves when the "
            "spa's timer starts over. 'water_care_salt_value' (unitless "
            "reading, no documented scale) is not used."
        ),
        tasks=(
            ConsumableSignature(("water_care_120_day_timer",), "Replace Salt Cartridge", "usage_above", above_hours=2880),
            ConsumableSignature(("water_care_10_day_timer",), "Water Test", "duration_left"),
        ),
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
            "self-clean by polarity reversal) and is not used. Re-checked "
            "2026-09-27 @ core 2026.9: button.py 'reset_cell_partial' "
            "(disabled by default) calls neopool_modbus "
            "async_reset_user_counters, which clears the cell partial "
            "runtime AND the ION/UV partial work-time — no duty watches "
            "those counters, so it stays unwired."
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
    # --- Round 15 (2026-09-27): HACS mowers and pool dosing -----------------
    "robonect": IntegrationSignature(
        name="Robonect (Husqvarna/Gardena/Flymo)",
        verified="2026-09-27 @ geertmeersman/robonect main (114b8ca)",
        source=(
            "HACS robonect definitions.py: 'mower/blades/hours' "
            "($.status.blades.hours — blade hours since the last blade reset; "
            "DURATION, h, TOTAL_INCREASING) and 'mower/statistic/hours' "
            "($.status.status.hours, lifetime mowing hours); entity.py sets "
            "translation_key = slugify(key.replace('/', '_')) → tk "
            "'mower_blades_hours' / 'mower_statistic_hours'. button.py "
            "'blades_reset' (cmd reset_blades; created when the REST API is "
            "enabled) resets the blade counter. Same 100 h blades / 25 h "
            "undercarriage cadence as the Husqvarna Automower entry."
        ),
        translation_keys_authoritative=True,
        tasks=(
            ConsumableSignature(
                ("mower_blades_hours",),
                "Replace Blades",
                "usage_above",
                resets=(("mower_blades_hours", "blades_reset"),),
            ),
            ConsumableSignature(("mower_statistic_hours",), "Clean Undercarriage", "usage_delta", delta_units=25),
        ),
    ),
    "indego": IntegrationSignature(
        name="Bosch Indego",
        verified="2026-09-27 @ sander1988/Indego develop (bf10e09)",
        source=(
            "HACS indego __init__.py ENTITY_RUNTIME: tk 'runtime_total' "
            "(DURATION, h, TOTAL_INCREASING; state = runtime.total.cut, never "
            "allowed to decrease) — LIFETIME cutting hours → usage_delta, like "
            "the Gardena operating-hours pair (100 h blades / 25 h "
            "undercarriage). 'maintenance_hours' (lifetime operate hours, "
            "integration-side good/due banding, not resettable) is not used; "
            "the mower's own blade reminder arrives via the problem-class "
            "alert binary (adoption path). No reset button."
        ),
        tasks=(
            ConsumableSignature(("runtime_total",), "Replace Blades", "usage_delta", delta_units=100),
            ConsumableSignature(("runtime_total",), "Clean Undercarriage", "usage_delta", delta_units=25),
        ),
    ),
    "dreame_lawn_mower": IntegrationSignature(
        name="Dreame / MOVA lawn mowers",
        verified="2026-09-27 @ EvotecIT/homeassistant-dreamelawnmower main (967e50b)",
        source=(
            "HACS dreame_lawn_mower (not the dreame_mower domain) "
            "sensor_operations.py DreameLawnMowerMaintenanceRemainingSensor: "
            "name '<item> Remaining' under has_entity_name, no "
            "translation_key, '%' = the cloud CMS counter's remaining_percent "
            "— items (dreame_lawn_mower_client/maintenance.py) 'Blade' (6000 "
            "min), 'Cleaning Brush' (30000 min), 'Robot Maintenance' (3600 "
            "min) → suffixes _blade_remaining / _cleaning_brush_remaining / "
            "_robot_maintenance_remaining. button.py "
            "DreameLawnMowerResetMaintenanceButton 'Reset <item> Maintenance' "
            "(DIAGNOSTIC, disabled by default — wiring enables it) resets "
            "that item's counter. 'Robot Maintenance' (the app's 60-hour "
            "check) is mapped to Clean Undercarriage."
        ),
        tasks=(
            ConsumableSignature(
                ("blade_remaining",),
                "Replace Blades",
                "percent_left",
                resets=(("blade_remaining", "reset_blade_maintenance"),),
            ),
            ConsumableSignature(
                ("cleaning_brush_remaining",),
                "Replace Cleaning Brush",
                "percent_left",
                resets=(("cleaning_brush_remaining", "reset_cleaning_brush_maintenance"),),
            ),
            ConsumableSignature(
                ("robot_maintenance_remaining",),
                "Clean Undercarriage",
                "percent_left",
                resets=(("robot_maintenance_remaining", "reset_robot_maintenance_maintenance"),),
            ),
        ),
    ),
    "bayrol": IntegrationSignature(
        name="Bayrol pool (Automatic SALT / Cl-pH, PoolManager 5)",
        verified="2026-09-27 @ 0xQuantumHome/bayrol-home-hassistant main (c84c5ca)",
        source=(
            "HACS bayrol sensor.py BayrolSensor: entity_id = "
            "sensor.bayrol_<device_id>_<normalize_entity_id_part(name)>, no "
            "translation_key. const.py: 'pH Minus Canister Status' (5.80, "
            "Automatic) and 'pH Canister Level' (5.6064, PM5); 'Cl Canister "
            "Status' (5.169, Automatic Cl-pH), 'Cl Canister Level' / 'Redox "
            "Canister Level' (5.6066 / 5.6068, PM5); the decode table maps "
            "19.259 and 7523 to the state 'Empty' (19.258 'Not Empty', 7521 "
            "'Full', 7522 'Low') → latch on 'Empty', cleared by a new "
            "canister. 'Salt To Add' (4.138, kg, Automatic SALT) = salt "
            "missing to the preferred level → alert_above 5 kg (editorial, a "
            "fifth of a 25 kg bag; clears once salted). 'Missing' canisters "
            "and the salt alarms (messages sensor only) are faults, not "
            "duties."
        ),
        tasks=(
            ConsumableSignature(
                ("ph_minus_canister_status", "ph_canister_level"),
                "Replace pH Canister",
                "event_present",
                on_states=("Empty",),
            ),
            ConsumableSignature(
                ("cl_canister_status", "cl_canister_level", "redox_canister_level"),
                "Replace Chlorine Canister",
                "event_present",
                on_states=("Empty",),
                per_entity=True,
            ),
            ConsumableSignature(("salt_to_add",), "Refill Pool Salt", "alert_above", delta_units=5),
        ),
    ),
    # --- Round 16 (2026-10-03): HACS spas, mowers and pool equipment --------
    "gecko": IntegrationSignature(
        name="Gecko spa packs (in.touch)",
        verified="2026-10-03 @ gazoodle/gecko-home-assistant main (eb3fba4) + geckolib 1.0.16",
        source=(
            "HACS gecko sensor.py GeckoReminderSensor: one sensor per reminder the spa pack reports "
            "(geckolib GeckoReminders.reminders, INVALID slots dropped), name '<spa>: <Type> due' "
            "(GeckoEntityBase.name; no has_entity_name, no translation_key → entity-id and "
            "original-name suffixes _rinse_filter_due, _clean_filter_due, _change_water_due, "
            "_change_ozonator_due, _change_vision_cartridge_due), device_class timestamp, no unit; the "
            "value is midnight UTC today + the reminder's remaining days (in the past once overdue). "
            "Resetting the reminder on the spa (or through the CONFIG date twin of the same name, "
            "date.py set_reminder) moves the date forward, which clears the trigger and auto-completes "
            "the task — there is no button to wire. The date.* twins carry the same names and are kept "
            "out by the sensor domain. Rinse / clean / change water map onto the Hot Tub template's "
            "duties, due on the date itself (the spa's own reminder); the ozonator and the Vision "
            "cartridge are parts to order → two weeks' lead. Skipped: 'Check Spa due' (a generic "
            "check, no part or action)."
        ),
        tasks=(
            ConsumableSignature(("rinse_filter_due",), "Rinse Filter", "due_date"),
            ConsumableSignature(("clean_filter_due",), "Deep Clean Filter", "due_date"),
            ConsumableSignature(("change_water_due",), "Drain and Refill", "due_date"),
            ConsumableSignature(("change_ozonator_due",), "Replace Ozonator", "due_date", days_before=14),
            ConsumableSignature(("change_vision_cartridge_due",), "Replace Vision Cartridge", "due_date", days_before=14),
        ),
    ),
    "terramow": IntegrationSignature(
        name="TerraMow",
        verified="2026-10-03 @ TerraMow/TerraMowHA main (045d789)",
        source=(
            "TerraMow's own HACS integration (custom repository) sensor.py — has_entity_name and "
            "_attr_translation_key on every entity class: 'remaining_blade_time' ('Remaining Blade "
            "Time', de 'Verbleibende Laufzeit der Klingen'; MINUTES, DURATION, DIAGNOSTIC) = "
            "const.BLADE_MAINTENANCE_CYCLE_MINUTES (14,400 = 240 h) minus dp_126 'blade disk usage "
            "time', floored at 0; 'remaining_base_station_time' (MINUTES) = "
            "BASE_STATION_MAINTENANCE_CYCLE_MINUTES (43,200 = 30 days) minus dp_125 'base station usage "
            "time' — both computed in the integration from the vendor's recommended cycles and both "
            "restart when the robot's counter is reset in the TerraMow app (dp value 0; no HA "
            "button). The base-station cycle maps to Clean Charging Contacts (the Robot Lawn Mower "
            "template's station duty). 'total_mowing_time' (dp_124 statistics duration, SECONDS, "
            "TOTAL_INCREASING, lifetime) → Clean Undercarriage every 25 h like the other lifetime "
            "mowing counters. NOTE: docs/en/developers/data_point.md calls both cycles a 'recommended "
            "cleaning cycle' (and gives 240 minutes for the blade disk where the integration uses 240 "
            "hours)."
        ),
        translation_keys_authoritative=True,
        tasks=(
            ConsumableSignature(("remaining_blade_time",), "Replace Blades", "duration_left"),
            ConsumableSignature(("remaining_base_station_time",), "Clean Charging Contacts", "duration_left"),
            ConsumableSignature(("total_mowing_time",), "Clean Undercarriage", "usage_delta", delta_units=25),
        ),
    ),
    "stihl_imow": IntegrationSignature(
        name="STIHL iMOW",
        verified="2026-10-03 @ ChrisHaPunkt/ha-stihl-imow main (0fe6c7b)",
        source=(
            "HACS stihl_imow (custom repository) maps.py IMOW_SENSORS_MAP + entity.py: has_entity_name, "
            "translation_key = to_translation_key(property) on every entity → "
            "'statistics_total_blade_operating_time' (statistics_totalBladeOperatingTime) and "
            "'statistics_total_operating_time' — DURATION, SECONDS with suggested HOURS, "
            "TOTAL_INCREASING lifetime counters, enabled (not in DISABLED_BY_DEFAULT_PROPERTIES) → the "
            "Gardena / Indego pair: blades every 100 h of blade time, undercarriage every 25 h of "
            "operation. Skipped: 'status_blade_service' (status_bladeService, no type or unit, meaning "
            "undocumented). No reset button."
        ),
        translation_keys_authoritative=True,
        tasks=(
            ConsumableSignature(("statistics_total_blade_operating_time",), "Replace Blades", "usage_delta", delta_units=100),
            ConsumableSignature(("statistics_total_operating_time",), "Clean Undercarriage", "usage_delta", delta_units=25),
        ),
    ),
    "omnilogic_local": IntegrationSignature(
        name="Hayward OmniLogic (local)",
        verified="2026-10-03 @ cryptk/haomnilogic-local main (6a8abb8)",
        source=(
            "HACS omnilogic_local (custom repository; not the core 'omnilogic' cloud domain) sensor.py "
            "CHLORINATOR_SALT_SENSORS 'chlorinator_salt_level_average' (name 'Average Salt Level', "
            "PARTS_PER_MILLION, MEASUREMENT); the entity is named f'{equipment.name} Average Salt "
            "Level' under has_entity_name, no translation_key → suffix _average_salt_level. Hayward "
            "salt cells start their operating range at 2,700 ppm, the IntelliChlor band of the "
            "ScreenLogic entry → value_below 2,700; topping up raises the reading (auto-resolve). The "
            "'Instant Salt Level' twin (the raw reading) is not used."
        ),
        tasks=(ConsumableSignature(("average_salt_level",), "Refill Pool Salt", "value_below", delta_units=2700),),
    ),
    "fluidra_pool": IntegrationSignature(
        name="Fluidra Pool (Fluidra Connect)",
        verified="2026-10-03 @ foXaCe/Fluidra-pool main (fef0d33)",
        source=(
            "HACS fluidra_pool (custom repository) sensor/chlorinator.py FluidraUvRunningHoursSensor: "
            "tk 'uv_running_hours' (DURATION, HOURS, TOTAL_INCREASING — 'a plain integer hour counter "
            "… the lamp-replacement interval is a running-hours threshold'), created only when the "
            "chlorinator reports a UV block with running_hours (sensor/__init__.py) → Replace UV Lamp "
            "every 8,000 h (the UV-lamp rating of the NeoPool entry). Whether the controller restarts "
            "the counter after a lamp change is not documented, hence usage_delta (completing "
            "re-baselines either way)."
        ),
        tasks=(ConsumableSignature(("uv_running_hours",), "Replace UV Lamp", "usage_delta", delta_units=8000),),
    ),
}
