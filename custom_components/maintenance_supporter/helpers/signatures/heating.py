"""Boilers, heating & water treatment.

Data module of the suggested-setups signature catalog — see
``helpers/signatures/_model.py`` for the direction semantics and the
method contract (every entry cites and is verified against the
integration's source; drift-probed weekly)."""

from __future__ import annotations

from ._model import ConsumableSignature, IntegrationSignature
from ._shared import HEATING_SYSTEM_PRESSURE_LOW, HEATING_WATER_PRESSURE_LOW, SOFTENER_SALT_LEVEL

SIGNATURES: dict[str, IntegrationSignature] = {
    "vicare": IntegrationSignature(
        name="Viessmann ViCare",
        verified="2026-07-17 (filter) / 2026-07-18 (burner) @ home-assistant/core dev + openviess/PyViCare master",
        source=(
            "home-assistant/core homeassistant/components/vicare/sensor.py "
            "(GLOBAL_SENSORS translation_key 'filter_remaining_hours', UnitOfTime.HOURS, "
            "disabled-by-default; PyViCare ventilation.filter.runtime.remainingHours; "
            "BURNER_SENSORS/COMPRESSOR_SENSORS 'burner_hours'/'compressor_hours', "
            "UnitOfTime.HOURS, TOTAL_INCREASING lifetime → usage_delta). "
            "Re-checked 2026-10-03 @ core 2026.10.0b0: 'filter_hours' "
            "(operatingHours) and 'filter_overdue_hours' (overdueHours) read the "
            "same ventilation.filter.runtime as the countdown — one duty per "
            "filter, not signed; 'compressor_hours_loadclass1'-'5', "
            "'heating_rod_hours' and 'supply_fan_hours' are statistics, not "
            "duties. No filter-reset button (button.py: one-time DHW charge "
            "only)."
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
    "bosch": IntegrationSignature(
        name="Bosch/Buderus heating",
        verified=(
            "2026-07-18 @ bosch-thermostat/home-assistant-bosch-custom-component master + live RC300 registry; "
            "re-verified 2026-09-30 after the coordinator refactor (21d1924): names unchanged"
        ),
        source=(
            "bosch-thermostat custom component: sensors are DYNAMIC (named "
            "from the device's XMPP data, sensor/base.py builds names without "
            "a device prefix → entity ids like sensor.system_pressure; no "
            "translation_keys). Key verified against a live Buderus RC300 "
            "registry; matched via the exact-object-id pattern."
        ),
        tasks=(
            # Heating-loop pressure: refill water when it drops below 1 bar;
            # topping up raises the value back (auto-resolve). Shared with
            # bosch_homecom and nefiteasy (round 16).
            HEATING_SYSTEM_PRESSURE_LOW,
        ),
    ),
    # ─── Research round 4 (2026-07-19): boiler pressure, HRV filters, ───
    # ─── purifiers, espresso, pet tech, Klipper ─────────────────────────
    "opentherm_gw": IntegrationSignature(
        name="OpenTherm Gateway",
        verified="2026-07-19 @ core/dev opentherm_gw/sensor.py",
        source=(
            "core opentherm_gw: tk 'central_heating_pressure', BAR, MEASUREMENT — generic for EVERY OpenTherm-connected boiler. "
            "Re-checked 2026-10-03 @ core 2026.10.0b0: every sensor and "
            "binary sensor is registered TWICE, on the 'boiler' and on the "
            "'thermostat' device (BOILER_/THERMOSTAT_DEVICE_DESCRIPTION, "
            "identical translation_keys, neither device has a model string), "
            "so no gate keeps a duty off the thermostat device — the "
            "burner/pump running-time counters ('total_burner_hours', "
            "'central_heating_pump_hours', 'hot_water_burner_hours', "
            "'hot_water_pump_hours'; HOURS, TOTAL) are not signed for that "
            "reason. 'service_required' is a problem-class binary (adoption "
            "path)."
        ),
        tasks=(ConsumableSignature(("central_heating_pressure",), "Refill Heating Water", "value_below", delta_units=1),),
    ),
    "plugwise": IntegrationSignature(
        name="Plugwise (Anna/Adam)",
        verified="2026-07-19 @ core/dev plugwise/sensor.py",
        source="core plugwise: tk 'water_pressure', BAR, MEASUREMENT (boiler loop).",
        tasks=(HEATING_WATER_PRESSURE_LOW,),
    ),
    "incomfort": IntegrationSignature(
        name="Intergas InComfort",
        verified="2026-07-19 @ core/dev incomfort/sensor.py",
        source=(
            "core incomfort: key 'cv_pressure', BAR, MEASUREMENT. NOTE: "
            "entity_registry_enabled_default=False — the suggestion appears "
            "once the user enables the sensor."
        ),
        tasks=(ConsumableSignature(("cv_pressure",), "Refill Heating Water", "value_below", delta_units=1),),
    ),
    "atag": IntegrationSignature(
        name="ATAG One",
        verified="2026-07-19 @ core/dev atag/sensor.py",
        source=(
            "core atag: legacy name-based sensors ('CH Water Pressure' → "
            "object id ch_water_pressure), BAR — matched via suffix or the "
            "exact-object-id pattern."
        ),
        tasks=(ConsumableSignature(("ch_water_pressure",), "Refill Heating Water", "value_below", delta_units=1),),
    ),
    "bwt_perla": IntegrationSignature(
        name="BWT Perla",
        verified="2026-07-19 @ dkarv/ha-bwt-perla main sensor.py (HACS default)",
        source=(
            "HACS bwt_perla (dkarv): tk 'regenerativ_level' (salt reserve, "
            "PERCENTAGE) and tk 'regenerativ_days' (days of salt left, "
            "UnitOfTime.DAYS) — refilling raises both (auto-resolve)."
        ),
        tasks=(
            ConsumableSignature(("regenerativ_level",), "Refill Softener Salt", "percent_left"),
            ConsumableSignature(("regenerativ_days",), "Refill Softener Salt", "duration_left", below_hours=168),
        ),
    ),
    "ecowater_softener": IntegrationSignature(
        name="EcoWater softener",
        verified="2026-07-19 / 2026-09-27 (days key fixed) @ barleybobs/homeassistant-ecowater-softener master (HACS default)",
        source=(
            "HACS ecowater_softener (barleybobs) sensor.py: EcowaterSensor "
            "has_entity_name, no translation_key, so the entity id comes from "
            "the NAME: 'Salt Level Percentage' (PERCENTAGE) → suffix "
            "_salt_level_percentage and 'Days Until Out of Salt' "
            "(UnitOfTime.DAYS) → suffix _days_until_out_of_salt. (Until "
            "2026-09-27 the catalog used the description key "
            "'out_of_salt_days', which no entity id carries — the days duty "
            "never matched; verified @ 6403e5c.)"
        ),
        tasks=(
            ConsumableSignature(("salt_level_percentage",), "Refill Softener Salt", "percent_left"),
            ConsumableSignature(("days_until_out_of_salt",), "Refill Softener Salt", "duration_left", below_hours=168),
        ),
    ),
    "wolflink": IntegrationSignature(
        name="Wolf SmartSet",
        verified="2026-07-19 @ core/dev wolflink/sensor.py",
        source="core wolflink: key 'pressure', BAR (heating loop).",
        tasks=(ConsumableSignature(("pressure",), "Refill Heating Water", "value_below", delta_units=1),),
    ),
    "palazzetti": IntegrationSignature(
        name="Palazzetti pellet stove",
        verified="2026-07-19 @ core/dev palazzetti/sensor.py",
        source=(
            "core palazzetti: tk 'pellet_quantity' (KILOGRAMS consumed, "
            "cumulative) -> usage_delta; ash-pan cadence ~100 kg of pellets "
            "(editorial: roughly weekly in season; manuals prescribe "
            "calendar-based cleaning). 'pellet_level' is a CM tank gauge — "
            "inventory, not wear; skipped."
        ),
        tasks=(ConsumableSignature(("pellet_quantity",), "Empty Ash Pan", "usage_delta", delta_units=100),),
    ),
    "mypyllant": IntegrationSignature(
        name="Vaillant (myVAILLANT)",
        verified="2026-07-19 @ signalkraft/mypyllant-component main sensor.py",
        source=(
            "HACS mypyllant: SystemWaterPressureSensor (name '... System "
            "Water Pressure' -> suffix system_water_pressure) and the "
            "device-level operational-data variant (suffix water_pressure), "
            "both BAR — matched any-low."
        ),
        tasks=(
            ConsumableSignature(
                ("system_water_pressure", "water_pressure"),
                "Refill Heating Water",
                "value_below",
                delta_units=1,
            ),
        ),
    ),
    "grohe_smarthome": IntegrationSignature(
        name="Grohe Blue",
        verified="2026-07-19 / 2026-09-27 (resets) @ Flo-Schilli/ha-grohe_smarthome main (HACS default)",
        source=(
            "HACS grohe_smarthome (owner now 'Flo-Schilli'), yaml-driven "
            "name-derived entities (config/config.yaml, "
            "GroheBlueHome/GroheBlueProf): 'Remaining Filter' (%) and "
            "'Remaining CO2' (%). The sibling 'Remaining Filter (App)' slugs "
            "to _remaining_filter_app and cannot clash with the exact "
            "_remaining_filter suffix. The same yaml declares the buttons "
            "'Reset Filter' (command.filter_status_reset) and 'Reset CO2' "
            "(command.co2_status_reset) — has_entity_name, no "
            "translation_key → suffixes _reset_filter / _reset_co2 (verified "
            "@ 806abcd)."
        ),
        tasks=(
            ConsumableSignature(
                ("remaining_filter",),
                "Replace Water Filter",
                "percent_left",
                resets=(("remaining_filter", "reset_filter"),),
            ),
            ConsumableSignature(
                ("remaining_co2",),
                "Replace CO2 Bottle",
                "percent_left",
                resets=(("remaining_co2", "reset_co2"),),
            ),
        ),
    ),
    "iqua_softener": IntegrationSignature(
        name="iQua softener",
        verified="2026-07-20 @ mutilator/homeassistant-iqua-softener master sensor.py (HACS default)",
        source=(
            "HACS iqua_softener: 'Salt level' (PERCENTAGE, name-style -> "
            "suffix _salt_level). 'Out of salt estimated day' is a DATE "
            "sensor - parked for the date direction."
        ),
        tasks=(SOFTENER_SALT_LEVEL,),
    ),
    "fumis": IntegrationSignature(
        name="Fumis (pellet stoves)",
        verified="2026-07-20 @ home-assistant/core dev",
        source=(
            "core fumis: tk 'time_to_service' (DURATION, HOURS remaining) — "
            "the controller's own service countdown for Fumis-driven pellet "
            "stoves/boilers."
        ),
        tasks=(ConsumableSignature(("time_to_service",), "Annual Service", "duration_left"),),
    ),
    "rehlko": IntegrationSignature(
        name="Rehlko / Kohler generators",
        verified="2026-07-20 @ home-assistant/core dev",
        source=(
            "core rehlko: tk 'runtime_since_last_maintenance' (HOURS since "
            "the last maintenance, resets when maintenance is recorded) → "
            "usage_above at 100 h — Kohler's oil-change interval (every "
            "100 run-hours or annually). An 'oil_pressure' problem binary "
            "also exists (adoption path). Re-checked 2026-10-03 @ core "
            "2026.10.0b0: the sensor is disabled by default (the suggestion "
            "appears once it is enabled); 'total_runtime' (lifetime HOURS) and "
            "'next_maintainance' (TIMESTAMP), both disabled by default too, "
            "describe the same service — one duty, not signed twice."
        ),
        tasks=(ConsumableSignature(("runtime_since_last_maintenance",), "Oil Service", "usage_above", above_hours=100),),
    ),
    "aquacell": IntegrationSignature(
        name="AquaCell softener",
        verified="2026-07-20 @ home-assistant/core dev",
        source=(
            "core aquacell: tk 'salt_left_side_percentage' and "
            "'salt_right_side_percentage' (PERCENTAGE) — dual salt tanks, "
            "matched any-low. 2026-09-27 @ core 2026.9: also tk "
            "'salt_left_side_time_remaining' / 'salt_right_side_time_remaining' "
            "(DURATION, DAYS) — the softener's own days-of-salt forecast, a "
            "week's lead like the BWT/EcoWater days duties (adopting takes one "
            "'Refill Softener Salt' task per object, whichever is ticked "
            "first)."
        ),
        tasks=(
            ConsumableSignature(
                ("salt_left_side_percentage", "salt_right_side_percentage"),
                "Refill Softener Salt",
                "percent_left",
            ),
            ConsumableSignature(
                ("salt_left_side_time_remaining", "salt_right_side_time_remaining"),
                "Refill Softener Salt",
                "duration_left",
                below_hours=168,
            ),
        ),
    ),
    # ─── Round 14 (2026-09-25): boiler pressure, softener salt, ─────────
    # ─── generator engine hours ──────────────────────────────────────────
    # (De Dietrich left again on 2026-09-30: core removed the integration
    # from dev before any release, #183545 — it returns as a joint Remeha /
    # De Dietrich Modbus integration.)
    "remeha_home": IntegrationSignature(
        name="Remeha Home",
        verified="2026-09-25 @ msvisser/remeha_home main",
        source=(
            "HACS remeha_home const.py APPLIANCE_SENSOR_TYPES: key "
            "'waterPressure', name 'Water Pressure' (BAR, MEASUREMENT; "
            "has_entity_name without translation_key → suffix "
            "_water_pressure)."
        ),
        tasks=(HEATING_WATER_PRESSURE_LOW,),
    ),
    "syr_connect": IntegrationSignature(
        name="SYR Connect (softeners)",
        verified="2026-09-25 @ alexhass/syr_connect main",
        source=(
            "HACS syr_connect sensor.py sets _attr_translation_key = "
            "sensor_key.lower() → tk 'getss1' ('Salt container stock 1'; "
            "const.py: getSS1 = salt supply of container 1 in "
            "UnitOfTime.WEEKS, MEASUREMENT, no device class). Weeks are not a "
            "unit the duration conversion knows, so the duty is a "
            "value_below in the entity's own unit: below 2 weeks (= 336 h). "
            "getSS2/getSS3 (extra containers, disabled by default, absent on "
            "most devices) are left out."
        ),
        tasks=(ConsumableSignature(("getss1",), "Refill Softener Salt", "value_below", delta_units=2),),
    ),
    "salt_sentry": IntegrationSignature(
        name="Salt Sentry",
        verified="2026-09-25 @ Lemcke-solutions/Salt-sentry-ha-integration main",
        source=(
            "HACS salt_sentry sensor.py SaltPercentageSensor: tk "
            "'salt_level', '%' = (empty − distance) / (empty − full) × 100 — "
            "the salt REMAINING in the brine tank (ultrasonic level sensor)."
        ),
        tasks=(SOFTENER_SALT_LEVEL,),
    ),
    "unique_waterontharder": IntegrationSignature(
        name="Unique Waterontharder",
        verified="2026-09-25 @ mirkin-pixel/ha-unique-waterontharders main",
        source=(
            "HACS unique_waterontharder sensor.py: tk 'salt_level', "
            "PERCENTAGE, MEASUREMENT — the cloud API's 'zout_niveau' (salt "
            "level)."
        ),
        tasks=(SOFTENER_SALT_LEVEL,),
    ),
    "bwt_aqa_perla_ble": IntegrationSignature(
        name="BWT AQA Perla (BLE)",
        verified="2026-09-25 @ Micka41/bwt-aqa-perla-ble main",
        source=(
            "HACS bwt_aqa_perla_ble sensor.py: tk 'salt_pct', PERCENTAGE, "
            "MEASUREMENT — coordinator.py decodes it as remaining salt × 100 "
            "// tank capacity ('qte_sel_restant'). A 'salt_alarm' problem "
            "binary also exists (adoption path)."
        ),
        tasks=(ConsumableSignature(("salt_pct",), "Refill Softener Salt", "percent_left"),),
    ),
    "generac": IntegrationSignature(
        name="Generac (Mobile Link)",
        verified="2026-09-25 @ binarydev/ha-generac main",
        source=(
            "HACS generac sensor.py RunTimeSensor: name sensor_name(self, "
            "'run_time') = 'generac_<device_id>_run_time' → suffix _run_time, "
            "DURATION, 'h'; value = apparatus property type 71, which the "
            "Mobile Link API labels 'Engine Hours' (payload quoted in issue "
            "#202) — the LIFETIME engine-hours counter → usage_delta every "
            "200 h (Generac air-cooled home-standby schedule: oil and filter "
            "every 200 h or 2 years). The pjordanandrsn fork shares the "
            "domain and the same property-71 sensor."
        ),
        tasks=(ConsumableSignature(("run_time",), "Oil Service", "usage_delta", delta_units=200),),
    ),
    "energytrak": IntegrationSignature(
        name="EnergyTrak (generators)",
        verified="2026-09-25 @ brentb2529/ha-energytrak main",
        source=(
            "HACS energytrak sensor.py: tk 'engine_hours' (DURATION, HOURS, "
            "TOTAL_INCREASING; normalize.py: 'a monotonic counter that is "
            "always > 0 on an installed unit') — LIFETIME → usage_delta every "
            "200 h (standby-generator oil cadence, as for Generac)."
        ),
        tasks=(ConsumableSignature(("engine_hours",), "Oil Service", "usage_delta", delta_units=200),),
    ),
    "himoinsa_c4lan": IntegrationSignature(
        name="Himoinsa C4LAN generators",
        verified="2026-09-25 @ spiri439/himoinsa-c4lan main",
        source=(
            "HACS himoinsa_c4lan sensor.py: key 'engine_hours', name 'Engine "
            "hours' (Modbus input register 42 = total engine hours per "
            "const.py; HOURS, DURATION, TOTAL_INCREASING; has_entity_name "
            "without translation_key → suffix _engine_hours) — LIFETIME → "
            "usage_delta every 250 h (typical diesel-genset oil interval)."
        ),
        tasks=(ConsumableSignature(("engine_hours",), "Oil Service", "usage_delta", delta_units=250),),
    ),
    # ─── Round 15 (2026-09-27): water-treatment cartridges and salt, ────
    # ─── generator service countdown ─────────────────────────────────────
    "drop_connect": IntegrationSignature(
        name="DROP (water treatment)",
        verified="2026-09-27 @ home-assistant/core 2026.9 + dev",
        source=(
            "core drop_connect (one config entry per DROP device, "
            "DEVICE_SENSORS / DEVICE_BINARY_SENSORS by device type). RO filter "
            "('ro'): sensor.py tk 'cart1'/'cart2'/'cart3' ('Cartridge N life "
            "remaining', PERCENTAGE, MEASUREMENT, DIAGNOSTIC) — three "
            "cartridges replaced one at a time → per-entity 'Replace Water "
            "Filter'. Salt sensor ('salt'): binary_sensor.py tk 'salt' ('Salt "
            "low', NO device class, so problem-sensor adoption does not see "
            "it) → state latch on 'on', cleared by the refill. Skipped: the "
            "softener's 'capacity_remaining' (GALLONS of softening capacity "
            "until the next regeneration) / 'reserve_in_use' — the "
            "regeneration cycle, operational, not salt."
        ),
        tasks=(
            ConsumableSignature(("cart1", "cart2", "cart3"), "Replace Water Filter", "percent_left", per_entity=True),
            ConsumableSignature(
                ("salt",),
                "Refill Softener Salt",
                "event_present",
                entity_domain="binary_sensor",
                on_states=("on",),
            ),
        ),
    ),
    "victron_gx": IntegrationSignature(
        name="Victron GX (generator)",
        verified="2026-09-27 @ home-assistant/core 2026.9 + dev, victron-mqtt 2026.8.4 + main",
        source=(
            "core victron_gx entity.py sets translation_key = the metric's "
            "generic_short_id; victron_mqtt _victron_topics.py "
            "'generator_service_counter' (N/…/generator/<id>/ServiceCounter, "
            "'Service counter', DURATION, h; core strings.json 'Service "
            "counter'). Venus OS dbus_generator startstop.py computes it as "
            "(lastservicereset + serviceinterval) − accumulated runtime, i.e. "
            "run-hours LEFT until the service the user configured (None while "
            "no interval is set; negative when overdue) → duration_left, "
            "task at 24 run-hours left. The counter reset "
            "(ServiceCounterReset) is a library SERVICE topic, not an HA "
            "button — nothing to wire. Re-checked 2026-10-03 @ core "
            "2026.10.0b0: 'generator_total_runtime' (AccumulatedRuntime, "
            "lifetime h) is the same service seen from the other side — not "
            "signed twice."
        ),
        tasks=(ConsumableSignature(("generator_service_counter",), "Oil Service", "duration_left"),),
    ),
    # ─── Round 15 part 2 (2026-09-27): HACS heat pumps and stoves ────────
    "stiebel_eltron_isg": IntegrationSignature(
        name="Stiebel Eltron ISG (LWZ)",
        verified="2026-09-27 @ pail23/stiebel_eltron_isg_component main (f47bcf8)",
        source=(
            "HACS stiebel_eltron_isg binary_sensor.py LWZ_BINARY_SENSOR_TYPES "
            "(LWZ ventilation heat pumps only — WPM controllers get other "
            "lists): tk 'filter' (operating_status bit 8), "
            "'filter_extract_air' (bit 12) and 'filter_ventilation_air' (bit "
            "13) — the controller's filter-change requests; plain binaries "
            "with NO device class, so problem-sensor adoption does not see "
            "them → one latch on 'on' over the three (one filter change "
            "clears them together). The 'service' bit (6) has no documented "
            "meaning and is left out. Every entity description sets a "
            "translation_key."
        ),
        translation_keys_authoritative=True,
        tasks=(
            ConsumableSignature(
                ("filter", "filter_extract_air", "filter_ventilation_air"),
                "Replace Ventilation Filter",
                "event_present",
                entity_domain="binary_sensor",
                on_states=("on",),
            ),
        ),
    ),
    "aguaiot": IntegrationSignature(
        name="Micronova Agua IOT (hydro stoves)",
        verified="2026-09-27 @ vincentwolsink/home_assistant_micronova_agua_iot master (4d1883f)",
        source=(
            "HACS aguaiot const.py SENSORS (has_entity_name, name from the "
            "description, no translation_key; created only when the stove "
            "exposes the register): 'Water Pressure' (pres_h2o_get, BAR, "
            "hydro stoves) → suffix _water_pressure. 'Service Hours' "
            "(ore_service_get, h, TOTAL_INCREASING, hours since the last "
            "service) is NOT signed: its limit sibling 'Threshold Service "
            "Hours' also ends in _service_hours, and the suffix match cannot "
            "exclude it (no translation_key to tell them apart)."
        ),
        tasks=(HEATING_WATER_PRESSURE_LOW,),
    ),
    # ─── Round 16 (2026-10-03): pellet-stove service by burn hours ──────
    # (hr_energy_qube 'alarm_working_hours' is a problem-class binary →
    # problem-sensor adoption.)
    "ecoforest": IntegrationSignature(
        name="Ecoforest pellet stoves",
        verified="2026-10-03 @ home-assistant/core 2026.10.0b0 (sensor.py identical in 2026.9.0b0 and dev) + pyecoforest 0.4.0",
        source=(
            "core ecoforest sensor.py: tk 'working_hours' ('Working time', "
            "DURATION, HOURS, no state class, entity_registry_enabled_default="
            "False) = pyecoforest Device.working_hours, the stove's stats "
            "field 'Nh' — the TOTAL working hours of the stove (HA docs: 'total "
            "number of working hours of the device'), never reset → "
            "usage_delta. Every 1,500 h — editorial: about one heating season "
            "of a stove used as the main heating, i.e. the yearly 'Stove "
            "Service' of the Fireplace & Wood Stove template counted in burn "
            "hours. NOTE: disabled by default — the suggestion appears once the "
            "user enables the sensor. The 'ignitions' counter and the 'alarm' "
            "enum (pellets / air depression / CPU overheating) are not "
            "maintenance duties."
        ),
        tasks=(ConsumableSignature(("working_hours",), "Stove Service", "usage_delta", delta_units=1500),),
    ),
    # ─── Round 16 HACS wave (2026-10-03): heating-loop pressure, the ─────
    # ─── pellet-stove service countdown, a heat pump's vent filter ───────
    # (Reviewed and left out: the sfstar 'victron' Modbus integration's
    # generator_servicecounter — dbus-modbustcp returns 0 for an invalid
    # value, so a GX without a service interval would read "due now".)
    "ariston": IntegrationSignature(
        name="Ariston NET (Remotethermo)",
        verified="2026-10-03 @ fustom/ariston-remotethermo-home-assistant-v3 main (31900cb)",
        source=(
            "HACS ariston const.py ARISTON_SENSOR_TYPES "
            "DeviceProperties.HEATING_CIRCUIT_PRESSURE: name f'{NAME} heating "
            "circuit pressure' with NAME 'Ariston' and no has_entity_name / "
            "translation_key → sensor.ariston_heating_circuit_pressure, suffix "
            "_heating_circuit_pressure (the original name also matches a "
            "second boiler's _2 id); PRESSURE, MEASUREMENT, DIAGNOSTIC, "
            "enabled, GALEVO systems only. Value and unit are the cloud item's "
            "own (ariston library galevo_device.heating_circuit_pressure_value"
            " / _unit; HeatingCircuitPressure is in bar) → value_below 1 like "
            "the other boiler-loop duties. Core 'ariston' is only a virtual "
            "brand entry (supported_by midea) without entities."
        ),
        tasks=(ConsumableSignature(("heating_circuit_pressure",), "Refill Heating Water", "value_below", delta_units=1),),
    ),
    "aquarea": IntegrationSignature(
        name="Panasonic Aquarea (HeishaMon)",
        verified="2026-10-03 @ kamaradclimber/heishamon-homeassistant main (3a528fd)",
        source=(
            "HACS aquarea (HeishaMon, MQTT-fed) definitions.py build_sensors "
            "TOP115 key f'{mqtt_prefix}main/Water_Pressure', name 'Aquarea "
            "Water Pressure', PRESSURE, 'bar', entity_registry_enabled_default="
            "False (K/L series only); sensor.py sets entity_id = "
            "sensor.<slugify(key)> → sensor.panasonic_heat_pump_main_water_"
            "pressure (suffix _water_pressure; the original name ends in it "
            "too). No other HeishaMon key ends in water_pressure (High/Low "
            "Pressure are the refrigerant side). NOTE: disabled by default — "
            "the suggestion appears once the user enables the sensor. The "
            "cloud fork wpatrik14/home-assistant-aquarea shares the domain but "
            "has no pressure entity (verified @ a588223)."
        ),
        tasks=(HEATING_WATER_PRESSURE_LOW,),
    ),
    "maestro_mcz": IntegrationSignature(
        name="MCZ pellet stoves (Maestro)",
        verified="2026-10-03 @ Robbe-B/maestro_mcz main (a2ba9cf)",
        source=(
            "HACS maestro_mcz maestro/models/models.py supported_sensors: "
            "SensorMczConfigItem 'Next Maintenance' (status field "
            "'ore_prox_manut' = hours to the next maintenance, UnitOfTime.HOURS, "
            "MEASUREMENT, DIAGNOSTIC, enabled; created only when the stove "
            "reports the field). sensor.py MczSensorEntity has_entity_name with "
            "_attr_name = the item name, no translation_key → suffix "
            "_next_maintenance. The stove controller's own service countdown "
            "(the fumis pattern) → duration_left 24 h; named after the "
            "technician's 'Stove Service' of the Fireplace & Wood Stove "
            "template, like the ecoforest duty. The only binary ('Alarm', "
            "is_in_error) is problem-class."
        ),
        tasks=(ConsumableSignature(("next_maintenance",), "Stove Service", "duration_left"),),
    ),
    "bosch_homecom": IntegrationSignature(
        name="Bosch HomeCom Easy",
        verified="2026-10-03 @ serbanb11/bosch-homecom-hass main (d9c28a6)",
        source=(
            "HACS bosch_homecom sensor.py: K40/ICOM coordinators get "
            "BoschComK40ExtraSensor('systemPressure', translation_key "
            "'system_pressure', PRESSURE, 'bar') when the heat source reports "
            "it (strings.json 'System pressure', has_entity_name). ICOM "
            "devices additionally get BoschComIcomExtraSensor name "
            "'hs_system_pressure' (no translation_key, bar) reading the same "
            "heat_sources.systemPressure — its id ends in _system_pressure too, "
            "so the duty watches both copies of one reading (any-low). "
            "value_below 1 bar → the shared bosch duty."
        ),
        tasks=(HEATING_SYSTEM_PRESSURE_LOW,),
    ),
    "nefiteasy": IntegrationSignature(
        name="Nefit Easy (Bosch thermostat)",
        verified="2026-10-03 @ ksya/ha-nefiteasy dev (28880e4)",
        source=(
            "HACS nefiteasy const.py SENSORS: key 'system_pressure', name "
            "'System pressure', url /system/appliance/systemPressure, "
            "UnitOfPressure.BAR, PRESSURE, MEASUREMENT; nefit_entity.py sets "
            "neither has_entity_name nor translation_key → "
            "sensor.system_pressure (exact-object-id pattern; a second boiler's "
            "_2 id is matched by the original name). value_below 1 bar → the "
            "shared bosch duty."
        ),
        tasks=(HEATING_SYSTEM_PRESSURE_LOW,),
    ),
    "waterkotte_heatpump": IntegrationSignature(
        name="Waterkotte heat pumps (BasicVent)",
        verified="2026-10-03 @ marq24/ha-waterkotte main (f5491c9)",
        source=(
            "HACS waterkotte_heatpump const.py "
            "BASICVENT_FILTER_CHANGE_REMAINING_OPERATING_DAYS_A4504 (DURATION, "
            "UnitOfTime.DAYS, MEASUREMENT, vent feature only, "
            "entity_registry_enabled_default=False); __init__.py sets "
            "translation_key = key.lower() → tk "
            "'basicvent_filter_change_remaining_operating_days_a4504' (en.json "
            "'Vent Air-Filter-Change operating hours remaining time') — the "
            "BasicVent ventilation unit's own filter countdown → duration_left "
            "7 days. NOTE: disabled by default — the suggestion appears once "
            "the user enables it. The counter reset "
            "(BASICVENT_FILTER_CHANGE_OPERATING_HOURS_RESET_D1544) is a SWITCH, "
            "not a button, and cannot be wired; the 'filter change display' "
            "binary carries device_class running and is not signed."
        ),
        tasks=(
            ConsumableSignature(
                ("basicvent_filter_change_remaining_operating_days_a4504",),
                "Replace Ventilation Filter",
                "duration_left",
                below_hours=168,
            ),
        ),
    ),
}
