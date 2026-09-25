"""Air treatment — purifiers, ACs and HRV/ventilation filters.

Data module of the suggested-setups signature catalog — see
``helpers/signatures/_model.py`` for the direction semantics and the
method contract (every entry cites and is verified against the
integration's source; drift-probed weekly)."""

from __future__ import annotations

from ._model import ConsumableSignature, IntegrationSignature

SIGNATURES: dict[str, IntegrationSignature] = {
    "hass_dyson": IntegrationSignature(
        name="Dyson",
        verified="2026-07-18 @ cmgrayb/hass-dyson main",
        source=(
            "cmgrayb/hass-dyson sensor.py DysonFilterLifeSensor "
            "(translation_key 'filter_life' for BOTH hepa and carbon "
            "instances, PERCENTAGE) — one any-low task covers both filters."
        ),
        tasks=(ConsumableSignature(("filter_life",), "Replace Filter", "percent_left"),),
    ),
    "dreo": IntegrationSignature(
        name="Dreo",
        verified="2026-07-18 @ JeffSteinbok/hass-dreo main",
        source=(
            "JeffSteinbok/hass-dreo sensor.py (translation_key 'filter_life', unit '%', humidifiers with FILTERTIME support)."
        ),
        tasks=(ConsumableSignature(("filter_life",), "Replace Filter", "percent_left"),),
    ),
    "vesync": IntegrationSignature(
        name="VeSync (Levoit)",
        verified="2026-07-19 @ core/dev vesync/sensor.py",
        source="core vesync: tk 'filter_life', PERCENTAGE, MEASUREMENT (Levoit purifiers).",
        tasks=(ConsumableSignature(("filter_life",), "Replace Filter", "percent_left"),),
    ),
    "daikin": IntegrationSignature(
        name="Daikin AC",
        verified="2026-09-25 @ home-assistant/core dev (+ tag 2026.7.0)",
        source=(
            "home-assistant/core homeassistant/components/daikin/climate.py "
            "(AC-only integration, so the climate entity IS an air "
            "conditioner). hvac_action is only mapped for COOL/HEAT/OFF "
            "(HA_STATE_TO_CURRENT_HVAC) and is None in fan_only, dry and "
            "heat_cool — the former hvac_action-attribute runtime missed "
            "every hour in those modes and never reached its 'fan'/'drying' "
            "states. Runtime on the climate STATE instead: DAIKIN_TO_HA_STATE "
            "maps fan/dry/cool/hot/auto to fan_only/dry/cool/heat/heat_cool — "
            "every mode except off moves air through the filter. Interval per "
            "Daikin's official guidance (clean filters every 2 weeks; ≈100 "
            "runtime-hours at typical in-season use)."
        ),
        tasks=(
            ConsumableSignature(
                (),
                "Filter Cleaning",
                "runtime_hours",
                delta_units=100,
                entity_domain="climate",
                on_states=("cool", "dry", "fan_only", "heat", "heat_cool"),
            ),
        ),
    ),
    "gree": IntegrationSignature(
        name="Gree AC",
        verified="2026-09-25 @ home-assistant/core dev (+ tag 2026.7.0)",
        source=(
            "home-assistant/core homeassistant/components/gree/climate.py "
            "(AC-only integration, so the climate entity IS an air "
            "conditioner). The entity NEVER sets hvac_action (0 hits at "
            "2026.7.0 and dev) — the former hvac_action-attribute runtime "
            "never accumulated. Runtime on the climate STATE instead: "
            "HVAC_MODES maps Mode.Auto/Cool/Dry/Fan/Heat to "
            "auto/cool/dry/fan_only/heat and _attr_hvac_modes = "
            "[*HVAC_MODES_INVERSE, HVACMode.OFF] — every mode except off "
            "moves air through the filter. Interval per Daikin's official "
            "guidance (clean filters every 2 weeks; ≈100 runtime-hours at "
            "typical in-season use)."
        ),
        tasks=(
            ConsumableSignature(
                (),
                "Filter Cleaning",
                "runtime_hours",
                delta_units=100,
                entity_domain="climate",
                on_states=("auto", "cool", "dry", "fan_only", "heat"),
            ),
        ),
    ),
    "comfoconnect": IntegrationSignature(
        name="Zehnder ComfoAirQ",
        verified="2026-07-19 @ core/dev comfoconnect/sensor.py",
        source=("core comfoconnect: key 'days_to_replace_filter', UnitOfTime.DAYS (name-style, no tk → suffix match)."),
        tasks=(
            # 168 canonical hours = warn at 7 days remaining (unit 'd' → ÷24).
            ConsumableSignature(("days_to_replace_filter",), "Replace Ventilation Filter", "duration_left", below_hours=168),
        ),
    ),
    "renson": IntegrationSignature(
        name="Renson Endura Delta",
        verified="2026-07-19 @ core/dev renson/sensor.py",
        source="core renson: tk 'filter_change', DURATION, DAYS, MEASUREMENT.",
        tasks=(ConsumableSignature(("filter_change",), "Replace Ventilation Filter", "duration_left", below_hours=168),),
    ),
    "philips_airpurifier_coap": IntegrationSignature(
        name="Philips AirPurifier (CoAP)",
        verified="2026-07-19 @ kongo09/philips-airpurifier-coap master sensor.py+const.py",
        source=(
            "HACS philips-airpurifier-coap: PhilipsFilterSensor reports "
            "PERCENT when the filter total is known, else HOURS remaining — "
            "the LG dual-unit pattern, split per direction. tks: pre_filter "
            "(cleaning cycle), hepa_filter / active_carbon_filter / "
            "nanoprotect_filter (replacements), wick (humidifier "
            "evaporation wick)."
        ),
        tasks=(
            ConsumableSignature(("pre_filter",), "Filter Cleaning", "percent_left"),
            ConsumableSignature(("pre_filter",), "Filter Cleaning", "duration_left", below_hours=72),
            ConsumableSignature(
                ("hepa_filter", "active_carbon_filter", "nanoprotect_filter"),
                "Replace Filter",
                "percent_left",
            ),
            ConsumableSignature(
                ("hepa_filter", "active_carbon_filter", "nanoprotect_filter"),
                "Replace Filter",
                "duration_left",
                below_hours=72,
            ),
            # Humidifier models: the evaporation wick (tk 'wick'), same
            # dual-unit shape as the filters.
            ConsumableSignature(("wick",), "Replace Wick", "percent_left"),
            ConsumableSignature(("wick",), "Replace Wick", "duration_left", below_hours=72),
        ),
    ),
    "dirigera_platform": IntegrationSignature(
        name="IKEA DIRIGERA (STARKVIND)",
        verified="2026-07-19 @ sanjoyg/dirigera_platform main sensor.py",
        source=(
            "HACS dirigera_platform: STARKVIND 'Filter Elapsed Time' sensor "
            "(suffix filter_elapsed_time, MINUTES, DURATION) counts UP and "
            "resets on IKEA's filter-change reset -> usage_above at 4,320 h "
            "(= IKEA's 259,200-minute filter lifetime). The sibling "
            "'Filter Lifetime' sensor is the constant total — unusable."
        ),
        tasks=(ConsumableSignature(("filter_elapsed_time",), "Replace Filter", "usage_above", above_hours=4320),),
    ),
    "ha_blueair": IntegrationSignature(
        name="Blueair",
        verified="2026-07-19 @ dahlb/ha_blueair master sensor.py (HACS default)",
        source=(
            "HACS ha_blueair: name-derived 'Filter Life' / 'Wick Life' / "
            "'Water Refresher Life' (PERCENTAGE). Verified % REMAINING: the "
            "device-aws coordinator returns 100 - filter_usage_percentage. "
            "A filter_expired problem binary also exists (adoption path)."
        ),
        tasks=(
            ConsumableSignature(("filter_life",), "Replace Filter", "percent_left"),
            ConsumableSignature(("wick_life",), "Replace Wick", "percent_left"),
            ConsumableSignature(("water_refresher_life",), "Replace Water Refresher", "percent_left"),
        ),
    ),
    "coway": IntegrationSignature(
        name="Coway IoCare",
        verified="2026-07-19 @ robertd502/home-assistant-iocare main sensor.py (HACS default)",
        source=(
            "HACS coway: name-derived entities, % remaining — 'Pre filter' "
            "(AIRMEGA odor variant: 'Charcoal filter') and 'MAX2 filter' "
            "(AP-1512HHS EU/UK models: 'HEPA filter'); both name variants "
            "listed as keys."
        ),
        tasks=(
            ConsumableSignature(("pre_filter", "charcoal_filter"), "Filter Cleaning", "percent_left"),
            ConsumableSignature(("max2_filter", "hepa_filter"), "Replace Filter", "percent_left"),
        ),
    ),
    "winix": IntegrationSignature(
        name="Winix",
        verified="2026-09-02 @ iprak/winix master sensor.py (HACS default)",
        source=(
            "HACS winix: tk 'filter_life' (PERCENTAGE) — % remaining derived "
            "from filter hours vs the model's max filter life "
            "(wrapper.filter_max_life; was filter_alarm_duration before 2026-09)."
        ),
        tasks=(ConsumableSignature(("filter_life",), "Replace Filter", "percent_left"),),
    ),
    "duco": IntegrationSignature(
        name="Duco ventilation",
        verified="2026-07-20 @ home-assistant/core dev",
        source=("core duco: tk 'filter_remaining' (DURATION, DAYS) — the box's own filter countdown."),
        tasks=(ConsumableSignature(("filter_remaining",), "Replace Ventilation Filter", "duration_left", below_hours=168),),
    ),
    "flexit_bacnet": IntegrationSignature(
        name="Flexit Nordic",
        verified="2026-07-20 @ home-assistant/core dev",
        source=(
            "core flexit_bacnet: tk 'air_filter_operating_time' "
            "(TOTAL_INCREASING, HOURS — counts UP, reset on filter change) → "
            "usage_above at 4380 h (Flexit: change the filter every 6-12 "
            "months). An 'air_filter_polluted' problem binary also exists "
            "(adoption path)."
        ),
        tasks=(
            ConsumableSignature(
                ("air_filter_operating_time",),
                "Replace Ventilation Filter",
                "usage_above",
                above_hours=4380,
            ),
        ),
    ),
    "tradfri": IntegrationSignature(
        name="IKEA Trådfri (STARKVIND)",
        verified="2026-07-20 @ home-assistant/core dev",
        source=(
            "core tradfri: tk 'filter_life_remaining' (MEASUREMENT, HOURS "
            "remaining) — STARKVIND purifiers on the NATIVE IKEA gateway "
            "(the DIRIGERA path is covered separately)."
        ),
        tasks=(ConsumableSignature(("filter_life_remaining",), "Replace Filter", "duration_left", below_hours=72),),
    ),
    "dyson_local": IntegrationSignature(
        name="Dyson (local)",
        verified="2026-07-20 @ libdyson-wg/ha-dyson main sensor.py (HACS default)",
        source=(
            "HACS dyson_local (libdyson-wg — the maintained fork): "
            "name-derived 'Filter Life' (HOURS remaining) and 'Filter Life "
            "Percentage' / 'Carbon Filter Life' / 'HEPA Filter Life' / "
            "'Combined Filter Life' (PERCENTAGE, value/4300 h budget). The "
            "percent suffixes end in _filter_life too — the unit-aware "
            "matcher routes each entity to the right direction (the "
            "lg_thinq dual-unit pattern)."
        ),
        tasks=(
            # The Pure Cool "combined" sensor is NAMED plain 'Filter Life'
            # (suffix _filter_life) but reports PERCENT, while older models'
            # 'Filter Life' reports HOURS — the same suffix appears in BOTH
            # key tuples and the unit check routes each entity.
            ConsumableSignature(
                (
                    "filter_life_percentage",
                    "carbon_filter_life",
                    "hepa_filter_life",
                    "filter_life",
                ),
                "Replace Filter",
                "percent_left",
            ),
            ConsumableSignature(("filter_life",), "Replace Filter", "duration_left", below_hours=72),
        ),
    ),
    "venstar": IntegrationSignature(
        name="Venstar thermostat",
        verified="2026-07-20 @ home-assistant/core dev",
        source=(
            "core venstar CONSUMABLE_ENTITIES: key 'filterHours' carries tk "
            "'filter_install_time' (HOURS of filter RUNTIME, counts UP, "
            "user-reset on change) — 300 h ≈ the typical 1-3-month "
            "furnace-filter guidance. The sibling 'filterDays'/tk "
            "'filter_usage' (CALENDAR days since install) ships alongside it "
            "and is skipped: same duty, weaker wear proxy, and two "
            "same-direction signatures of one task name would collide in "
            "discovery's per-device dedupe."
        ),
        tasks=(ConsumableSignature(("filter_install_time",), "Replace Filter", "usage_above", above_hours=300),),
    ),
    # ─── Round 14 (2026-09-25): purifier/HRV filters from the HACS + ────
    # ─── core 2026.9/dev sweep ───────────────────────────────────────────
    "meross_lan": IntegrationSignature(
        name="Meross LAN (MAP100 purifier)",
        verified="2026-09-25 @ krahabb/meross_lan master",
        source=(
            "HACS meross_lan sensor.py MLFilterMaintenanceSensor "
            "(Appliance.Control.FilterMaintenance; entitykey mc.KEY_FILTER "
            "'filter', PERCENTAGE, DIAGNOSTIC, no translation_key). "
            "helpers/entity.py names it entitykey.replace('_', ' ')"
            ".capitalize() = 'Filter' (channel 0 is dropped) under "
            "has_entity_name → suffix _filter. The value is the payload's "
            "'life' — REMAINING: the emulator (emulator/mixins/fan.py) starts "
            "it at 100 and counts it down, and a real MAP100 push quoted in "
            "issue #388 reads life: 100 on a fresh filter. No other "
            "meross_lan entity key ends in 'filter' (the match is "
            "platform-scoped)."
        ),
        tasks=(ConsumableSignature(("filter",), "Replace Filter", "percent_left"),),
    ),
    "tuya_local": IntegrationSignature(
        name="Tuya Local",
        verified="2026-09-25 @ make-all/tuya-local main",
        source=(
            "HACS tuya_local (not in the HACS default store) entity.py: "
            "_attr_translation_key = config.translation_key; devices/*.yaml "
            "carry 'translation_key: filter_life' with unit '%' in 57 device "
            "configs (purifiers, humidifiers, dehumidifiers, robot vacuums, "
            "fans) — the Tuya 'filter' DP, REMAINING life (it sits next to a "
            "'Filter remaining' days DP on the Honeywell/Stadler Form "
            "configs; a used-hours DP was moved off filter_life in #6202). "
            "The duration-unit filter_life variants (d/h/min/s) are NOT "
            "signed: some count UP without the 'invert' mapping "
            "(fresco_hydrateultra_petfountain v1 vs v2). 'entity: lock' in "
            "these configs is the CHILD lock — no lock signature."
        ),
        tasks=(ConsumableSignature(("filter_life",), "Replace Filter", "percent_left"),),
    ),
    "govee": IntegrationSignature(
        name="Govee (purifiers)",
        verified="2026-09-25 @ lasswellt/govee-homeassistant main",
        source=(
            "HACS govee (lasswellt) sensor.py GoveeFilterLifeSensor: tk "
            "'sensor_filter_life', PERCENTAGE, MEASUREMENT, DIAGNOSTIC — "
            "'remaining filter life %' from the devices.capabilities.property "
            "instance 'filterLifeTime' (models/state.py; H7124/H7126). "
            "LaggAt/hacs-govee shares the 'govee' domain but ships lights "
            "only — no conflicting entity."
        ),
        tasks=(ConsumableSignature(("sensor_filter_life",), "Replace Filter", "percent_left"),),
    ),
    "duux": IntegrationSignature(
        name="Duux",
        verified="2026-09-25 @ SSmale/Duux-Home-Assistant master",
        source=(
            "HACS duux sensor.py DuuxFilterLifeSensor (Bright 2 purifier): "
            "key 'filter', tk 'filter_life', PERCENTAGE, MEASUREMENT — "
            "translations name it 'HEPA Filter remaining lifespan' "
            "(REMAINING; fixtures/devices.json reports filter: 80)."
        ),
        tasks=(ConsumableSignature(("filter_life",), "Replace Filter", "percent_left"),),
    ),
    "komfovent": IntegrationSignature(
        name="Komfovent ventilation",
        verified="2026-09-25 @ lnagel/hass-komfovent main",
        source=(
            "HACS komfovent sensor.py: key 'filter_clogging' (Modbus register "
            "917, PERCENTAGE, MEASUREMENT; KomfoventSensor sets "
            "translation_key = key). Clogging climbs to 100 % (warning 0x81 "
            "'Change Air Filter'); the 'Clean Filters Calibration' button "
            "resets it after a change → alert_above 90 % with auto-resolve."
        ),
        tasks=(ConsumableSignature(("filter_clogging",), "Replace Ventilation Filter", "alert_above", delta_units=90),),
    ),
    "pluggit": IntegrationSignature(
        name="Pluggit ventilation",
        verified="2026-09-25 @ Tvalley71/pluggit main",
        source=(
            "HACS pluggit device_map.py: key ATTR_FILTER_REMAIN "
            "'filter_remain' (DURATION, unit 'd'; entity.py's translation_key "
            "property returns the key) — Modbus register 554 = filter days "
            "REMAINING (device.py derives the replace level from lifetime − "
            "remain; the translated state 0 reads 'Replace the filter now'). "
            "Absent on Servo_flow units (not_component_class)."
        ),
        tasks=(ConsumableSignature(("filter_remain",), "Replace Ventilation Filter", "duration_left", below_hours=168),),
    ),
    "dantherm": IntegrationSignature(
        name="Dantherm ventilation",
        verified="2026-09-25 @ Tvalley71/dantherm main",
        source=(
            "HACS dantherm — the same code base as pluggit (device_map.py "
            "key 'filter_remain', DURATION, unit 'd', Modbus register 554 = "
            "filter days REMAINING; translation_key = key)."
        ),
        tasks=(ConsumableSignature(("filter_remain",), "Replace Ventilation Filter", "duration_left", below_hours=168),),
    ),
    "ha_carrier": IntegrationSignature(
        name="Carrier Infinity",
        verified="2026-09-25 @ dahlb/ha_carrier main",
        source=(
            "HACS ha_carrier sensor.py FilterUsedSensor: entity_name 'Filter "
            "Remaining' (carrier_entity.py sets _attr_name = entity_name "
            "under has_entity_name, no translation_key → suffix "
            "_filter_remaining), PERCENTAGE = 100 − status.filter_used → "
            "REMAINING."
        ),
        tasks=(ConsumableSignature(("filter_remaining",), "Replace Filter", "percent_left"),),
    ),
    "localthings": IntegrationSignature(
        name="Samsung (Local Things)",
        verified="2026-09-25 @ mbillow/localthings main",
        source=(
            "HACS localthings registry/capabilities: every % filter sensor "
            "is Samsung's filterUsage = % USED (common.filter_usage_percent: "
            "filterStatus flips to 'wash' at 100); entity.py's "
            "translation_key defaults to the descriptor key. "
            "airconditioner.AIR_FILTER 'air_filter_usage' (AC + dehumidifier "
            "washable dust filter) → Filter Cleaning, gated on its AC-only "
            "sibling 'air_filter_usage_hours' because fridge.AIR_FILTER "
            "reuses the 'air_filter_usage' key for the fridge's deodorizing "
            "filter; air_purifier.HEPA_FILTER 'hepa_filter_usage' + "
            "air_purifier.FILTER 'filter_progress' (counts UP, 100 = change) "
            "→ Replace Filter; range_hood.HOOD_FILTER 'hood_filter_usage' → "
            "Clean Grease Filter (mirrors the core smartthings entry). "
            "Skipped: the shared water-filter key 'filter_usage' (fridge, "
            "dishwasher, water purifier AND the AMF microfiber lint unit on "
            "the washer registry — one key, different duties)."
        ),
        tasks=(
            ConsumableSignature(
                ("air_filter_usage",),
                "Filter Cleaning",
                "alert_above",
                delta_units=90,
                require_sibling_keys=("air_filter_usage_hours",),
            ),
            ConsumableSignature(("hepa_filter_usage", "filter_progress"), "Replace Filter", "alert_above", delta_units=90),
            ConsumableSignature(("hood_filter_usage",), "Clean Grease Filter", "alert_above", delta_units=90),
        ),
    ),
    "flexit": IntegrationSignature(
        name="Flexit (Modbus)",
        verified="2026-09-25 @ home-assistant/core dev",
        source=(
            "core flexit (Modbus CI66; config flow since 2026.9, the sensor "
            "and binary_sensor platforms are on dev = 2026.10): tk "
            "'air_filter_operating_time' (DURATION, HOURS, TOTAL_INCREASING; "
            "flexit_modbus Measurements.filter_running_hours, input register "
            "8 — the filter timer behind the filter alarm, not a unit "
            "runtime) → usage_above at 4380 h, mirroring flexit_bacnet. A "
            "'filter_alarm' problem binary also exists (adoption path)."
        ),
        tasks=(
            ConsumableSignature(
                ("air_filter_operating_time",),
                "Replace Ventilation Filter",
                "usage_above",
                above_hours=4380,
            ),
        ),
    ),
}
