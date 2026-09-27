"""Air treatment — purifiers, ACs and HRV/ventilation filters.

Data module of the suggested-setups signature catalog — see
``helpers/signatures/_model.py`` for the direction semantics and the
method contract (every entry cites and is verified against the
integration's source; drift-probed weekly)."""

from __future__ import annotations

from ._model import ConsumableSignature, IntegrationSignature
from ._shared import (
    FILTER_LIFE_PERCENT,
    PRE_FILTER_CLEANING_PERCENT,
    VENTILATION_FILTER_OPERATING_TIME,
    VENTILATION_FILTER_REMAIN,
)

# One object for the AC-only integrations whose climate entity runs through
# these HVAC modes (gree, midea_ac) — shared here, next to its users, so the
# verbatim-duplicate tripwire holds without a _shared.py entry.
_AC_FILTER_CLEANING_RUNTIME = ConsumableSignature(
    (),
    "Filter Cleaning",
    "runtime_hours",
    delta_units=100,
    entity_domain="climate",
    on_states=("auto", "cool", "dry", "fan_only", "heat"),
)

SIGNATURES: dict[str, IntegrationSignature] = {
    "hass_dyson": IntegrationSignature(
        name="Dyson",
        verified="2026-07-18 / 2026-09-27 (live keys, deep clean) @ cmgrayb/hass-dyson main",
        source=(
            "cmgrayb/hass-dyson sensor.py (verified @ 3dde06e): the live "
            "filter sensors are DysonHEPAFilterLifeSensor tk "
            "'hepa_filter_life' and DysonCarbonFilterLifeSensor tk "
            "'carbon_filter_life' (PERCENTAGE; the carbon one only when the "
            "device reports a separate carbon filter) — one any-low task "
            "covers both filters. The older DysonFilterLifeSensor (tk "
            "'filter_life') is never instantiated; the catalog matched the "
            "live sensors only through the _filter_life suffix until "
            "2026-09-27. Humidifiers: DysonNextCleaningCycleSensor tk "
            "'next_cleaning_cycle' (cltr, HOURS until the deep-clean cycle, "
            "i.e. the citric-acid descale; unknown at 0) → Descale Appliance "
            "24 h ahead. The filter reset is only the service "
            "hass_dyson.reset_filter (no button)."
        ),
        tasks=(
            ConsumableSignature(("hepa_filter_life", "carbon_filter_life"), "Replace Filter", "percent_left"),
            ConsumableSignature(("next_cleaning_cycle",), "Descale Appliance", "duration_left"),
        ),
    ),
    "dreo": IntegrationSignature(
        name="Dreo",
        verified="2026-07-18 @ JeffSteinbok/hass-dreo main",
        source=(
            "JeffSteinbok/hass-dreo sensor.py (translation_key 'filter_life', unit '%', humidifiers with FILTERTIME support)."
        ),
        tasks=(FILTER_LIFE_PERCENT,),
    ),
    "vesync": IntegrationSignature(
        name="VeSync (Levoit)",
        verified="2026-07-19 @ core/dev vesync/sensor.py",
        source="core vesync: tk 'filter_life', PERCENTAGE, MEASUREMENT (Levoit purifiers).",
        tasks=(FILTER_LIFE_PERCENT,),
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
        tasks=(_AC_FILTER_CLEANING_RUNTIME,),
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
        tasks=(ConsumableSignature(("filter_change",), "Replace Ventilation Filter", "duration_left", below_hours=168, resets=(("filter_change", "reset_filter"),)),),
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
            PRE_FILTER_CLEANING_PERCENT,
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
            FILTER_LIFE_PERCENT,
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
        verified="2026-09-02 @ iprak/winix main sensor.py (HACS default)",
        source=(
            "HACS winix: tk 'filter_life' (PERCENTAGE) — % remaining derived "
            "from filter hours vs the model's max filter life "
            "(wrapper.filter_max_life; was filter_alarm_duration before 2026-09)."
        ),
        tasks=(FILTER_LIFE_PERCENT,),
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
            VENTILATION_FILTER_OPERATING_TIME,
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
            "lg_thinq dual-unit pattern). button.py (verified @ 41c3338): "
            "'Reset Filter Life' (no translation_key → suffix "
            "_reset_filter_life, CONFIG) exists only on Pure Cool Link units "
            "(hasattr filter_life) and resets the 'filf' hours behind both "
            "'Filter Life' (h) and 'Filter Life Percentage'; the Pure Cool "
            "carbon/HEPA/combined % sensors have no reset. Humidify+Cool: "
            "'Next Deep Clean' (HOURS until the citric-acid deep-clean cycle, "
            "libdyson cltr) → Descale Appliance."
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
                resets=(("filter_life_percentage", "reset_filter_life"),),
            ),
            ConsumableSignature(
                ("filter_life",),
                "Replace Filter",
                "duration_left",
                below_hours=72,
                resets=(("filter_life", "reset_filter_life"),),
            ),
            ConsumableSignature(("next_deep_clean",), "Descale Appliance", "duration_left"),
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
            "these configs is the CHILD lock — no lock signature. Resets "
            "(verified @ 986d71e): 37 of the '%' configs carry a button with "
            "translation_key 'filter_reset' (e.g. ap402_airpurifier.yaml), two "
            "robot vacuums a name-only 'Reset filter' button (suffix "
            "_reset_filter); the press writes the yaml's reset DP. A device "
            "with several matching buttons gets none wired."
        ),
        tasks=(
            ConsumableSignature(
                ("filter_life",),
                "Replace Filter",
                "percent_left",
                resets=(("filter_life", "filter_reset"), ("filter_life", "reset_filter")),
            ),
        ),
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
        tasks=(FILTER_LIFE_PERCENT,),
    ),
    "komfovent": IntegrationSignature(
        name="Komfovent ventilation",
        verified="2026-09-25 @ lnagel/hass-komfovent main",
        source=(
            "HACS komfovent sensor.py: key 'filter_clogging' (Modbus register "
            "917, PERCENTAGE, MEASUREMENT; KomfoventSensor sets "
            "translation_key = key). Clogging climbs to 100 % (warning 0x81 "
            "'Change Air Filter'); the 'Clean Filters Calibration' button "
            "resets it after a change → alert_above 90 % with auto-resolve. "
            "button.py (verified @ e5be948): tk 'clean_filters' (name 'Clean "
            "Filters Calibration', CONFIG) writes register 1051 = 1, the "
            "'Reset filters counter'."
        ),
        tasks=(
            ConsumableSignature(
                ("filter_clogging",),
                "Replace Ventilation Filter",
                "alert_above",
                delta_units=90,
                resets=(("filter_clogging", "clean_filters"),),
            ),
        ),
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
            "Absent on Servo_flow units (not_component_class). Button key "
            "'filter_reset' (ATTR_FILTER_RESET, translation_key = key) → "
            "set_filter_reset writes register 558 = 1, restoring the "
            "remaining days (verified @ ee0e13d)."
        ),
        tasks=(VENTILATION_FILTER_REMAIN,),
    ),
    "dantherm": IntegrationSignature(
        name="Dantherm ventilation",
        verified="2026-09-25 @ Tvalley71/dantherm main",
        source=(
            "HACS dantherm — the same code base as pluggit (device_map.py "
            "key 'filter_remain', DURATION, unit 'd', Modbus register 554 = "
            "filter days REMAINING; translation_key = key) and the same "
            "'filter_reset' button → register 558 (verified @ da9dfaa)."
        ),
        tasks=(VENTILATION_FILTER_REMAIN,),
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
            "the washer registry — one key, different duties). Reset "
            "(verified @ 2e942fc): 'air_filter_reset' (common."
            "filter_reset_button, filterReset 'On' to the same "
            "/filter/airdustfilter resource; measured on a RAC board, #449). "
            "The hepa/hood resets are only extrapolated upstream and stay "
            "unwired."
        ),
        tasks=(
            ConsumableSignature(
                ("air_filter_usage",),
                "Filter Cleaning",
                "alert_above",
                delta_units=90,
                require_sibling_keys=("air_filter_usage_hours",),
                resets=(("air_filter_usage", "air_filter_reset"),),
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
            VENTILATION_FILTER_OPERATING_TIME,
        ),
    ),
    # ─── Round 15 part 2 (2026-09-27): HACS HRVs, ACs, thermostats, ──────
    # ─── fragrance diffusers ─────────────────────────────────────────────
    "genvex_connect": IntegrationSignature(
        name="Genvex Connect / Nilan gateway",
        verified="2026-09-27 @ superrob/genvexconnect main (70a1c55) + superrob/genvexnabto 1.5.4",
        source=(
            "HACS genvex_connect entity.py: translation_key = the genvexnabto "
            "value key (plain str constants, every entity). sensor.py: "
            "'filter_days_left' (unit 'd', 'Days left until filter change'; "
            "Nilan CTS400/CTS602/CTS602light) → duration_left 7 days; "
            "'filter_days' (unit 'd', 'Days since filter change'; Genvex "
            "Optima 270/314, counts up until the reset) → usage_above 4,380 h "
            "like the other HRV filter timers. The two never exist on one "
            "model. button.py 'filter_reset' (CONFIG, created when the model "
            "provides FILTER_RESET — every model above) writes the setpoint 1. "
            "The DHW 'sacrificial_anode' enum ('service' state) is left out: "
            "its meaning is only inferred from the option names."
        ),
        translation_keys_authoritative=True,
        tasks=(
            ConsumableSignature(
                ("filter_days_left",),
                "Replace Ventilation Filter",
                "duration_left",
                below_hours=168,
                resets=(("filter_days_left", "filter_reset"),),
            ),
            ConsumableSignature(
                ("filter_days",),
                "Replace Ventilation Filter",
                "usage_above",
                above_hours=4380,
                resets=(("filter_days", "filter_reset"),),
            ),
        ),
    ),
    "nilan": IntegrationSignature(
        name="Nilan (CTS602 Modbus)",
        verified="2026-09-27 @ veista/nilan master (6cdbbfe)",
        source=(
            "HACS nilan sensor.py: translation_key = the map name on every "
            "sensor; 'days_to_air_filter_change' (UnitOfTime.DAYS, input "
            "register air_flow_to_filt_day, bus version >= 9) → duration_left "
            "7 days. 'days_since_air_filter_change' is the same duty from the "
            "other side and is not signed twice; the DHW 'anode_state' raw "
            "register (2 = Service) is left out (meaning unconfirmed). No "
            "filter-reset button (button.py has only sync_time)."
        ),
        translation_keys_authoritative=True,
        tasks=(ConsumableSignature(("days_to_air_filter_change",), "Replace Ventilation Filter", "duration_left", below_hours=168),),
    ),
    "ha_comfoconnectpro": IntegrationSignature(
        name="Zehnder ComfoConnect Pro (Modbus)",
        verified="2026-09-27 @ hstrohmaier/ha_comfoconnectpro main (e03e4b6)",
        source=(
            "HACS ha_comfoconnectpro const.py: 'filter_days_remaining' (input "
            "register 25, unit 'd' → DURATION; translation_key = key for every "
            "generated entity) — days until the filter change, the ComfoAir "
            "Q's own countdown → duration_left 7 days like the core "
            "comfoconnect entry. The 'filter_dirty' binary is the same duty "
            "(not signed twice). No reset entity."
        ),
        translation_keys_authoritative=True,
        tasks=(ConsumableSignature(("filter_days_remaining",), "Replace Ventilation Filter", "duration_left", below_hours=168),),
    ),
    "heru": IntegrationSignature(
        name="Östberg HERU",
        verified="2026-09-27 @ toringer/home-assistant-heru master (ec1294f)",
        source=(
            "HACS heru const.py (name-based entities under has_entity_name, no "
            "translation_key): 'Filter days left' (input register 3x00020, "
            "unit spelled out as 'days') → suffix _filter_days_left, "
            "duration_left 7 days; button 'Reset filter timer' (coil "
            "0x00006) → suffix _reset_filter_timer resets it."
        ),
        tasks=(
            ConsumableSignature(
                ("filter_days_left",),
                "Replace Ventilation Filter",
                "duration_left",
                below_hours=168,
                resets=(("filter_days_left", "reset_filter_timer"),),
            ),
        ),
    ),
    "midea_ac": IntegrationSignature(
        name="Midea Smart AC (msmart-ng)",
        verified="2026-09-27 @ mill1000/midea-ac-py main (d433bbb)",
        source=(
            "HACS midea_ac climate.py (AC and commercial AC devices only): "
            "_OPERATIONAL_MODE_TO_HVAC_MODE maps auto/cool/dry/heat/fan to "
            "auto/cool/dry/heat/fan_only, off otherwise — every mode except "
            "off moves air through the filter → the same engine-runtime duty "
            "as gree, with its cadence (Daikin's guidance: clean filters every "
            "2 weeks ≈ 100 runtime hours at in-season use). The unit's own "
            "'filter_alert' binary (supports_filter_reminder only) is "
            "device_class problem → problem-sensor adoption."
        ),
        tasks=(_AC_FILTER_CLEANING_RUNTIME,),
    ),
    "nest_legacy": IntegrationSignature(
        name="Nest (legacy API)",
        verified="2026-09-27 @ tronikos/nest_legacy main (018eb74)",
        source=(
            "HACS nest_legacy sensor.py: tk 'filter_runtime' (thermostats with "
            "an air filter; SECONDS, DURATION, TOTAL_INCREASING) = the "
            "FilterReminder trait's filterRuntime, the HVAC runtime on the "
            "current filter → usage_above 300 h, the furnace-filter cadence of "
            "the venstar duty. Nest's own reminder is the problem-class "
            "'filter_replacement_needed' binary (adoption path); Protect "
            "'replace_by' is a DATE sensor (no direction)."
        ),
        tasks=(ConsumableSignature(("filter_runtime",), "Replace Filter", "usage_above", above_hours=300),),
    ),
    "pura": IntegrationSignature(
        name="Pura fragrance diffusers",
        verified="2026-09-27 @ natekspencer/ha-pura main (6166f16)",
        source=(
            "HACS pura sensor.py: tk 'fragrance_remaining' (car/mini) and "
            "'bay_fragrance_remaining' (wall/plus, one per bay with the "
            "placeholder {bay}), PERCENTAGE — pypura's bay.remaining.percent, "
            "else (expectedLifeHours − runtime) / expectedLife → % REMAINING. "
            "Two-bay diffusers get one task per vial."
        ),
        tasks=(
            ConsumableSignature(
                ("fragrance_remaining", "bay_fragrance_remaining"),
                "Replace Air Freshener",
                "percent_left",
                per_entity=True,
            ),
        ),
    ),
}
