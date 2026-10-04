"""Kitchen & household appliances incl. espresso machines.

Data module of the suggested-setups signature catalog — see
``helpers/signatures/_model.py`` for the direction semantics and the
method contract (every entry cites and is verified against the
integration's source; drift-probed weekly)."""

from __future__ import annotations

from ._model import ConsumableSignature, IntegrationSignature
from ._shared import PRE_FILTER_CLEANING_PERCENT

# LG dishwasher "rinse refill needed": a plain binary (no problem class, so
# problem-sensor adoption does not cover it) in both LG integrations — one
# object, the DRY tripwire's verbatim-duplicate rule (both users live here).
LG_RINSE_REFILL_LATCH = ConsumableSignature(
    ("rinse_refill",),
    "Refill Rinse Aid",
    "event_present",
    entity_domain="binary_sensor",
    on_states=("on",),
)

# Electrolux fridge water filter: both Electrolux integrations expose the
# appliance's own 'waterFilterState' verdict (title-cased 'Change' when due)
# and its 'waterFilterStateReset' write capability as a button.
ELECTROLUX_WATER_FILTER_STATE = ConsumableSignature(
    ("waterfilterstate",),
    "Replace Water Filter",
    "event_present",
    on_states=("Change",),
    resets=(("waterfilterstate", "waterfilterstatereset"),),
)

SIGNATURES: dict[str, IntegrationSignature] = {
    "lg_thinq": IntegrationSignature(
        name="LG ThinQ",
        verified="2026-07-17 @ home-assistant/core dev + thinq-connect/pythinqconnect main; dishwasher/fridge latches 2026-09-27 @ home-assistant/core 2026.9; skips re-checked 2026-10-03 @ home-assistant/core 2026.10.0b0",
        source=(
            "home-assistant/core homeassistant/components/lg_thinq/sensor.py "
            "(ThinQProperty StrEnum translation_key; FILTER_LIFETIME is shared by "
            "an HOURS description and a PERCENTAGE one — the unit-aware matcher "
            "routes each entity to the right direction) + "
            "thinq-connect/pythinqconnect devices/const.py Property members. "
            "2026-09 round: binary_sensor.py RINSE_REFILL (dishwasher, "
            "pythinqconnect dish_washer.py dishWashingStatus.rinseRefill, no device_class, "
            "no on_key → is_on = the boolean) → latch on 'on'. sensor.py FRESH_AIR_FILTER "
            "(refrigerator / kimchi refrigerator, ENUM, created only when the property is "
            "READ_ONLY — a writable one is a select and is not matched; strings.json state "
            "'replace': 'Replace filter') → latch on 'replace'; its PERCENTAGE twin "
            "FRESH_AIR_FILTER_REMAIN_PERCENT shares the translation_key and is kept out by "
            "the unit gate (a percent duty on that key would also claim the unit-less ENUM). "
            "Skipped: preference settings mCReminder / cleanLReminder / signalLevel "
            "(binaries machine_clean_reminder / clean_light_reminder / signal_level) and "
            "rinse_level (dispenser SETTING 0-4); used_time (MONTHS, the same water filter as "
            "water_filter_*_remain_percent — no gate can keep both off one fridge) and "
            "water_filter_state (values undocumented). 2026-10-03 (entity descriptions "
            "unchanged since 2026.9): kimchi-refrigerator binary 'one_touch_filter' "
            "(refrigeration.oneTouchFilter, on_key 'on', no device_class) is the fresh-air "
            "filter FUNCTION being on, not a replace flag — the 'fresh_air_filter' latch "
            "already carries that filter; skipped."
        ),
        tasks=(
            # AC filter reports hours-remaining; air-purifier/RAC filters report
            # percent — both under translation_key 'filter_lifetime'. Two
            # directions, unit-disambiguated at match time.
            ConsumableSignature(("filter_lifetime", "top_filter_remain_percent"), "Replace Filter", "percent_left"),
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
            # Fridge Pure-N-Fresh filter: the ENUM shows 'replace' when due and
            # leaves it after the swap + reset on the appliance (auto-resolve).
            ConsumableSignature(("fresh_air_filter",), "Replace Filter", "event_present", on_states=("replace",)),
            LG_RINSE_REFILL_LATCH,
        ),
    ),
    "smartthinq_sensors": IntegrationSignature(
        name="LG ThinQ (SmartThinQ)",
        verified="2026-07-17 / re-audited 2026-07-20 @ ollo69/ha-smartthinq-sensors master",
        source=(
            "ollo69/ha-smartthinq-sensors custom_components/smartthinq_sensors/sensor.py "
            "(legacy name= entities, NO translation_key → matched by entity_id suffix; "
            "FILTER_*_LIFE / *_REMAIN_PERC are percent via wideq device.py "
            "_get_filter_life(); TUBCLEAN_COUNT counts up per wash cycle and the "
            "machine resets it when a tub-clean course runs). binary_sensor.py: "
            "dishwasher RINSEREFILL/SALTREFILL binaries carry NO device_class "
            "(and are disabled-by-default) → not adoptable, latched here "
            "instead; the washer DETERGENTLOW/SOFTENERLOW binaries ARE "
            "problem-class (adoption path)."
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
            # Dishwasher refill alerts: plain binaries (no problem class) →
            # state latch; the appliance clearing them after a refill resolves
            # the task. Enable the entities first (disabled-by-default).
            LG_RINSE_REFILL_LATCH,
            ConsumableSignature(
                ("salt_refill",),
                "Refill Salt",
                "event_present",
                entity_domain="binary_sensor",
                on_states=("on",),
            ),
        ),
    ),
    # Enclosed printers only (device registry model = the device_type
    # enum: X1C/X1E/P1S/H2*) — the activated-carbon/chamber filter
    # duty makes no sense on open-frame A1/A1MINI/P1P.
    # Model-aware duties (Bambu maintenance guides): the CoreXY
    # X1/P1 series runs on carbon rods that want regular wipe-downs;
    # the A1 bed-slingers have a replaceable purge wiper. Intervals
    # are tunable print-hour defaults.
    # AMS desiccant by MEASURED humidity: the AMS/AMS 2 Pro/AMS HT are
    # separate devices (model = 'AMS'/'AMS 2 Pro'/'AMS HT') with a
    # humidity sensor; saturated desiccant shows as high humidity and
    # replacing it brings the value down (auto-resolve). The AMS Lite
    # has NO desiccant compartment and is excluded.
    "home_connect": IntegrationSignature(
        name="Home Connect",
        verified="2026-07-17 / extended 2026-09-25 @ home-assistant/core dev (2026.9 dishwasher events)",
        source=(
            "home-assistant/core homeassistant/components/home_connect/sensor.py "
            "EVENT_SENSORS (HomeConnectEventSensor, device_class ENUM, "
            "EVENT_OPTIONS ['confirmed','off','present']; translation_key per "
            "EventKey; the class sets _attr_entity_registry_enabled_default = "
            "False — every event sensor must be enabled first). No "
            "percent/countdown consumables exist (coffee counters are "
            "lifetime, no reset) — these actionable events are the only "
            "maintenance-usable signal, matched as a state latch on 'present'. "
            "2026.9 added the dishwasher events salt_lack / "
            "program_blocked_salt_lack / rinse_aid_lack (API: 'supply is "
            "empty' resp. 'program blocked due to lack of salt'), "
            "machine_care_reminder ('Machine Clean program without dishes is "
            "needed'), machine_care_and_filter_cleaning_reminder ('Machine "
            "Clean program AND cleaning the filter and spray arm'), "
            "machine_care_and_low_maintenance_filter_cleaning_reminder (filter "
            "cleaning optional → machine care only) and "
            "smart_filter_cleaning_reminder ('filter system may be blocked'). "
            "Escalation keys of one condition share ONE any-latch (refilling "
            "salt clears all three salt events); coffee Calc'N'Clean "
            "(descale + clean in one program) joins the descale duty; the "
            "two i-Dos tanks are refilled independently → per-entity duties. "
            "Semantics per api-docs.home-connect.com/events. Skipped: the "
            "'descaling/calc_n_clean in N cups' pre-warnings and "
            "grease_filter_max_saturation_nearly_reached (pre-warnings of the "
            "duties below, not the duty itself)."
        ),
        tasks=(
            ConsumableSignature(
                ("salt_nearly_empty", "salt_lack", "program_blocked_salt_lack"),
                "Refill Salt",
                "event_present",
            ),
            ConsumableSignature(("rinse_aid_nearly_empty", "rinse_aid_lack"), "Refill Rinse Aid", "event_present"),
            ConsumableSignature(
                (
                    "device_should_be_descaled",
                    "device_descaling_overdue",
                    "device_descaling_blockage",
                    "device_should_be_calc_n_cleaned",
                    "device_calc_n_clean_overdue",
                    "device_calc_n_clean_blockage",
                ),
                "Descale Appliance",
                "event_present",
            ),
            # Coffee-maker cleaning + dishwasher Machine Care (a cleaning
            # program run without dishes) — one duty name, disjoint appliance
            # types, so ONE signature (same name + direction would collide in
            # the per-device dedupe).
            ConsumableSignature(
                (
                    "device_should_be_cleaned",
                    "device_cleaning_overdue",
                    "machine_care_reminder",
                    "machine_care_and_filter_cleaning_reminder",
                    "machine_care_and_low_maintenance_filter_cleaning_reminder",
                ),
                "Clean Appliance",
                "event_present",
            ),
            # The combined machine-care-AND-filter reminder backs both duties.
            ConsumableSignature(
                ("smart_filter_cleaning_reminder", "machine_care_and_filter_cleaning_reminder"),
                "Filter Cleaning",
                "event_present",
            ),
            ConsumableSignature(("grease_filter_max_saturation_reached",), "Clean Grease Filter", "event_present"),
            ConsumableSignature(
                ("poor_i_dos_1_fill_level", "poor_i_dos_2_fill_level"),
                "Refill Detergent",
                "event_present",
                per_entity=True,
            ),
            # Roxxter robot vacuum: 'empty the dust box and clean the filter'.
            ConsumableSignature(("empty_dust_box_and_clean_filter",), "Empty Dustbin", "event_present"),
        ),
    ),
    "homeconnect_ws": IntegrationSignature(
        name="Home Connect Local",
        verified="2026-09-25 @ chris-mc1/homeconnect_local_hass main (HACS default); resets + fridge filter 2026-09-27 @ c20ce8f",
        source=(
            "HACS homeconnect_ws: entity.py sets translation_key = description "
            "key. entity_descriptions/dishcare.py 'sensor_salt' / "
            "'sensor_rinse_aid' (HCEventSensor, ENUM options ['empty', "
            "'nearly_empty', 'full'] — sensor.py returns 'empty' while "
            "SaltLack/RinseAidLack is Present/Confirmed, 'nearly_empty' while "
            "the NearlyEmpty event is, else 'full'; never None) → ok-state "
            "latch on 'full'. cooking.py 'sensor_grease_filter_saturation' / "
            "'sensor_carbon_filter_saturation' (Cooking.Hood.Status.*Saturation, "
            "%, counts UP, reset by the hood's filter-reset buttons) → "
            "alert_above 90 (the Samsung hood_filter_usage precedent). "
            "consumer_products.py 'sensor_countdown_descaling' / "
            "'_cleaning' / '_water_filter' (Status.BeverageCountdown*, "
            "unitless beverages left until due, disabled by default) → "
            "value_below 10. Skipped: 'sensor_countdown_calc_n_clean' (its "
            "relation to the separate descale countdown is undocumented), "
            "'sensor_machinecare_remaining_runs' and the dishwasher/washer/"
            "dryer reminder binaries (device_class problem → problem-sensor "
            "adoption). 2026-09-27: cooking.py button 'button_hood_grease_filter_reset' "
            "(Cooking.Common.Command.Hood.GreaseFilterReset, CONFIG; press = "
            "Command.set_value(True)) resets the grease saturation; refrigeration.py "
            "'sensor_water_filter_saturation' (Refrigeration.Common.Status.Dispenser."
            "WaterFilterSaturation, %, counts UP) with its reset 'button_water_filter_reset' "
            "(Dispenser.WaterFilterReset) → alert_above 90 like the hood filters. The carbon "
            "filter reset stays unwired: regenerative-filter hoods also carry "
            "'button_hood_regenerative_carbon_filter_reset' / '_lifetime_reset', so which "
            "button resets 'sensor_carbon_filter_saturation' is not established."
        ),
        tasks=(
            ConsumableSignature(("sensor_salt",), "Refill Salt", "event_present", ok_state="full"),
            ConsumableSignature(("sensor_rinse_aid",), "Refill Rinse Aid", "event_present", ok_state="full"),
            ConsumableSignature(
                ("sensor_grease_filter_saturation",),
                "Clean Grease Filter",
                "alert_above",
                delta_units=90,
                resets=(("sensor_grease_filter_saturation", "button_hood_grease_filter_reset"),),
            ),
            ConsumableSignature(("sensor_carbon_filter_saturation",), "Replace Filter", "alert_above", delta_units=90),
            ConsumableSignature(("sensor_countdown_descaling",), "Descale Appliance", "value_below", delta_units=10),
            ConsumableSignature(("sensor_countdown_cleaning",), "Clean Appliance", "value_below", delta_units=10),
            ConsumableSignature(("sensor_countdown_water_filter",), "Replace Water Filter", "value_below", delta_units=10),
            # Fridge water dispenser filter: saturation counts UP, the fridge's
            # own reset brings it back to 0 (coffee machines use the countdown
            # above — different appliances, different direction).
            ConsumableSignature(
                ("sensor_water_filter_saturation",),
                "Replace Water Filter",
                "alert_above",
                delta_units=90,
                resets=(("sensor_water_filter_saturation", "button_water_filter_reset"),),
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
    "electrolux_status": IntegrationSignature(
        name="Electrolux / AEG",
        verified="2026-07-18 @ albaintor/homeassistant_electrolux_status master; fridge filters 2026-09-27 @ bd55519",
        source=(
            "albaintor/homeassistant_electrolux_status catalog_purifier.py "
            "'FilterLife' (PERCENTAGE) + entity.py entity_id = "
            "f'..._{entity_attr}' — HA slugifies the raw 'FilterLife' tail, so "
            "both slug forms are matched. 2026-09-27: catalog_core.py fridge "
            "'waterFilterState' / 'airFilterState' (read, values BUY / CHANGE / CLEAN / "
            "GOOD; sensor.py title-cases string states → 'Change') with their write "
            "capabilities 'waterFilterStateReset' / 'airFilterStateReset' (values "
            "{'RESET'} → ONE button each, api.py: write access = BUTTON) — entity ids "
            "end in _waterfilterstate / _waterfilterstatereset (entity.py lowercases the "
            "raw id). Latch on 'Change' (BUY is the order-a-spare pre-warning). The "
            "'*LifeTime' seconds counters are skipped (used vs left undocumented; the "
            "state is the fridge's own verdict against its thresholds)."
        ),
        tasks=(
            ConsumableSignature(("filterlife", "filter_life"), "Replace Filter", "percent_left"),
            ELECTROLUX_WATER_FILTER_STATE,
            ConsumableSignature(
                ("airfilterstate",),
                "Replace Filter",
                "event_present",
                on_states=("Change",),
                resets=(("airfilterstate", "airfilterstatereset"),),
            ),
        ),
    ),
    "midea_ac_lan": IntegrationSignature(
        name="Midea (LAN)",
        verified="2026-07-18 / re-audited 2026-09-25; keys re-checked 2026-09-27 @ wuwentao/midea_ac_lan main (the default branch)",
        source=(
            "wuwentao/midea_ac_lan midea_devices.py + midea_entity.py "
            "(_attr_translation_key from the per-attribute config; entity_id = "
            "f'{device_id}_{entity_key}'; device model = "
            "f\"{MIDEA_DEVICES[type]['name']} {model}\"). 0xED 'Water Drinking "
            "Appliance': filter1/2/3_life PERCENTAGE; 0xC2 'Toilet': "
            "filter_life PERCENTAGE. 2026-09-25 fix: 0xFC 'Air Purifier' "
            "reuses translation_key filter1_life/filter2_life (PERCENTAGE) — "
            "it proposed 'Replace Water Filter' on a purifier; the water "
            "duty now excludes the purifier model, which gets 'Replace "
            "Filter' instead. The filterN_days countdowns describe the SAME "
            "filters — percent only, no duplicate tasks. Filter "
            "cleaning/change reminders (A1/CE/AC full_dust) are device_class "
            "problem binaries — covered by problem-sensor adoption."
        ),
        tasks=(
            ConsumableSignature(
                ("filter1_life", "filter2_life", "filter3_life"),
                "Replace Water Filter",
                "percent_left",
                models_exclude=("Air Purifier",),
            ),
            ConsumableSignature(
                ("filter_life", "filter1_life", "filter2_life"),
                "Replace Filter",
                "percent_left",
                models=("Toilet", "Air Purifier"),
            ),
        ),
    ),
    "midea": IntegrationSignature(
        name="Midea (core)",
        verified="2026-09-25 @ home-assistant/core dev (new in 2026.8) + midea-local 12.1.0; skips re-checked 2026-10-03 @ home-assistant/core 2026.10.0b0",
        source=(
            "home-assistant/core homeassistant/components/midea/sensor.py "
            "SENSOR_ENTITIES (created only when the device reports the "
            "attribute): tk 'salt_available' (key left_salt, PERCENTAGE — ED "
            "soft-water body 09); tk 'filter_life_level' (PERCENTAGE) is shared "
            "by the ED water purifier (keys life1/life2/life3, next to "
            "'filter_available_days') and the FC air purifier (keys "
            "filter1_life/filter2_life) — routed by the device model, which "
            "entity.py sets to device_catalog.MIDEA_DEVICE_NAMES "
            "('Water Drinking Appliance' / 'Air Purifier' / 'Toilet'); tk "
            "'filter_life' (C2 toilet, midea-local c2/message.py "
            "filter_life = 100 - body[19] → remaining %). The 15 virtual "
            "brands with supported_by: midea share the domain. "
            "binary_sensor.py salt / rinse_aid / filter_cleaning_reminder / "
            "full_dust / tank_full are device_class problem → problem-sensor "
            "adoption. 2026-10-03 skips: 'filter_available_days' (keys filter1/2/3, "
            "DURATION DAYS = midea-local ED body-01 hours ÷ 24) counts the SAME three "
            "filters as 'filter_life_level' — one signal per filter; the soft-water "
            "body-05 'remaining_days' / 'use_days' (meaning undocumented) and the binary "
            "'arofene_link' (PLUG, module-attached status)."
        ),
        tasks=(
            ConsumableSignature(("salt_available",), "Refill Softener Salt", "percent_left"),
            ConsumableSignature(
                ("filter_life_level",),
                "Replace Water Filter",
                "percent_left",
                models=("Water Drinking Appliance",),
            ),
            ConsumableSignature(
                ("filter_life", "filter_life_level"),
                "Replace Filter",
                "percent_left",
                models=("Air Purifier", "Toilet"),
            ),
        ),
    ),
    "lamarzocco": IntegrationSignature(
        name="La Marzocco",
        verified="2026-07-19 @ core/dev lamarzocco/sensor.py",
        source=(
            "core lamarzocco: tk 'total_coffees_made', TOTAL_INCREASING "
            "lifetime shot counter — one entity, two duties (intervals are "
            "intervals cross-checked 2026-07-19 against home-barista guidance: detergent backflush every 4-6 weeks ≈ 100 shots at 3/day; "
            "water filter ≈ 1000 shots (editorial)."
        ),
        tasks=(
            ConsumableSignature(("total_coffees_made",), "Backflush Espresso Group", "usage_delta", delta_units=100),
            ConsumableSignature(("total_coffees_made",), "Replace Water Filter", "usage_delta", delta_units=1000),
        ),
    ),
    "hon": IntegrationSignature(
        name="Haier hOn (Haier/Candy/Hoover)",
        verified="2026-09-27 @ gvigroux/hon master (cbc0376, the HACS-default fork) + Andre0512/hon main (70eb6c0, idle since 2024-08)",
        source=(
            "Two forks share the domain. gvigroux/hon (the store's 'hon' today) "
            "sensor.py: no translation_key, _attr_name = f'{nickName} {sensor_name}' → "
            "entity-id suffixes; purifiers (AP) HonBaseMainFilter 'Main filter' / "
            "HonBasePreFilter 'Pre filter' = 100 − mainFilterStatus / preFilterStatus "
            "(PERCENTAGE, life LEFT); washers HonBaseTotalWashCycle 'Total wash cycle' "
            "(totalWashCycle − 1, TOTAL_INCREASING). Andre0512/hon (older installs) "
            "reports the RAW mainFilterStatus / preFilterStatus under tk 'filter_life' / "
            "'filter_cleaning' and tk 'cycles_total'. The raw status counts UP (used): "
            "Andre0512/hon#244 — after a filter reset the hOn app shows 100 % life while "
            "the raw sensor reads 0 %, which is also why gvigroux inverts it. So the "
            "Andre0512 keys are wear gauges (alert_above 90; the former percent_left "
            "reading was inverted) and the gvigroux keys are life gauges (percent_left). "
            "Tub-clean cadence reuses LG's manufacturer value of 30 cycles."
        ),
        tasks=(
            ConsumableSignature(("main_filter",), "Replace Filter", "percent_left"),
            ConsumableSignature(("filter_life",), "Replace Filter", "alert_above", delta_units=90),
            PRE_FILTER_CLEANING_PERCENT,
            ConsumableSignature(("filter_cleaning",), "Filter Cleaning", "alert_above", delta_units=90),
            ConsumableSignature(("cycles_total", "total_wash_cycle"), "Clean Tub", "usage_delta", delta_units=30),
        ),
    ),
    "whirlpool": IntegrationSignature(
        name="Whirlpool",
        verified="2026-07-19 @ core/dev whirlpool/sensor.py; detergent tank 2026-09-27 @ home-assistant/core 2026.9",
        source=(
            "core whirlpool: tk 'washer_state' ENUM incl. 'running_maincycle' "
            "— no cycle counter exists, so the ENGINE accumulates wash time "
            "(the Miele Clean-Tub pattern; 60 h of washing ~= LG's 30-cycle "
            "cadence at a typical 2-h cycle). The dryer's distinct "
            "'dryer_state' tk cannot match. 2026-09 round: washer key 'DispenseLevel', "
            "tk 'whirlpool_tank' ('Detergent level', ENUM from WASHER_TANK_FILL: "
            "empty / 25 / 50 / 100 / active; the bulk-dispenser tank, "
            "entity_registry_enabled_default=False) → latch on 'empty'; refilling moves "
            "it back to a level (auto-resolve)."
        ),
        tasks=(
            ConsumableSignature(
                ("washer_state",),
                "Clean Tub",
                "runtime_hours",
                delta_units=60,
                on_states=("running_maincycle",),
            ),
            ConsumableSignature(("whirlpool_tank",), "Refill Detergent", "event_present", on_states=("empty",)),
        ),
    ),
    "ha_washdata": IntegrationSignature(
        name="WashData (smart-plug cycles)",
        verified="2026-09-10 @ 3dg1luk43/ha_washdata main (0.5.5) + branch 0.5.6 sensor.py/manager.py (HACS default)",
        source=(
            "HACS ha_washdata: tk 'cycle_count' (unit 'cycles'). CAVEAT up to "
            "0.5.5: the sensor is len(stored cycle records), capped at "
            "DEFAULT_MAX_PAST_CYCLES=200 and lowered when a record is deleted "
            "— a delta task freezes once the cap is reached (our D#172, "
            "upstream discussion 414). From 0.5.6 (PR #420) the SAME entity "
            "reports the monotonic lifetime odometer (old value in attribute "
            "'stored_cycles'; state_class total, user-correctable downward), "
            "so the value jumps once on that update — a Reset re-anchors the "
            "task. Cycles are DETECTED from smart-plug power monitoring. The "
            "integration ships its OWN maintenance taxonomy "
            "(MAINTENANCE_EVENT_TYPES + DEFAULT_MAINTENANCE_REMINDER_CYCLES: "
            "descale 30 / filter_clean 50 / drum_clean 100), but shows it "
            "only inside its panel — no due-entity, no notifications. These "
            "tasks mirror that taxonomy 1:1, so what its panel counts "
            "silently becomes a real reminder here; type-agnostic on purpose "
            "because WashData offers the types for every appliance class "
            "itself (washer, dryer, dishwasher, air fryer, …)."
        ),
        tasks=(
            # 2.94: by WashData's own device_type (const.py DEVICE_TYPE_*,
            # stored in the entry's options): no descaling for appliances
            # without a water circuit (a heat-pump dryer — reported), no tub
            # cleaning where there is no tub. Unknown/generic/other keep all.
            ConsumableSignature(
                ("cycle_count",),
                "Descaling",
                "usage_delta",
                delta_units=30,
                exclude_appliance_types=("dryer", "air_fryer", "bread_maker", "pump"),
            ),
            ConsumableSignature(
                ("cycle_count",), "Filter Cleaning", "usage_delta", delta_units=50, exclude_appliance_types=("bread_maker",)
            ),
            ConsumableSignature(
                ("cycle_count",),
                "Clean Tub",
                "usage_delta",
                delta_units=100,
                exclude_appliance_types=("air_fryer", "bread_maker", "pump"),
            ),
        ),
        appliance_type_key="device_type",
    ),
    "traeger": IntegrationSignature(
        name="Traeger grill",
        verified="2026-07-20 @ njobrien1006/hass_traeger master + johnvoipguy/Traeger-WiFire main (HACS default); jv drift fix 2026-09-27 @ 8971c5b",
        source=(
            "HACS traeger (both default-store forks share the domain and "
            "sensor map): 'Cook Cycle' sensor (usage;cook_cycles — lifetime "
            "counter, suffix _cook_cycle, disabled-by-default DIAGNOSTIC; the "
            "suggestion appears once the user enables it). Cadence per "
            "Traeger's official maintenance guidance: grease management every "
            "few cooks, deep clean ~every 20 cooks / twice a grilling season. "
            "'Pellet Level' (%) is hopper inventory, not wear — skipped (same "
            "rationale as Palazzetti's pellet_level). 2026-09-27: the johnvoipguy "
            "fork renamed it TraegerSensor 'Cook Cycles' (key 'cook_cycles', explicit "
            "entity_id f'sensor.{slugify(grill_id)}_{slugify(name)}' → suffix "
            "_cook_cycles) — both suffixes are matched. Its MaintenanceAlert sensors "
            "'Grill Clean Alert' / 'Grease Trap Clean Alert' (True/False from "
            "usage.*_countdown <= 3600 / <= 5 — the integration's own cut-offs, countdown "
            "units undocumented) are skipped."
        ),
        tasks=(
            ConsumableSignature(("cook_cycle", "cook_cycles"), "Clean Grease Trap", "usage_delta", delta_units=5),
            ConsumableSignature(("cook_cycle", "cook_cycles"), "Clean Appliance", "usage_delta", delta_units=20),
        ),
    ),
    "electrolux": IntegrationSignature(
        name="Electrolux (OCP API)",
        verified="2026-09-25 @ TTLucian/ha-electrolux main (HACS default; not the electrolux_status domain); filter states 2026-09-27 @ 60b28fa",
        source=(
            "HACS electrolux: entity.py sets translation_key = the lowercased "
            "capability name (fppn prefix stripped) → 'filterlife', "
            "'filterlife_1', 'filterlife_2'. catalogs/catalog_ap.py "
            "'FilterLife' (PERCENTAGE, air purifiers) and the UltimateHome 500 "
            "pair 'FilterLife_1' / 'FilterLife_2' (int 0-100 %, two slots with "
            "their own FilterType_1/_2) → one duty per filter (per_entity). "
            "Skipped: AC/fridge/hood filter lifetimes and timers (seconds or "
            "minutes with the maintainer's own 'unit is an educated guess' "
            "caveat — remaining vs used unclear). 2026-09-27: the filter STATE "
            "strings are verified — sensor.py native_value title-cases string "
            "values ('CHANGE' → 'Change'). catalogs/catalog_cr.py fridge "
            "'waterFilterState' / 'airFilterState' (GOOD / CLEAN / CHANGE / BUY) with "
            "write buttons 'waterFilterStateReset' / 'airFilterStateReset' (tk "
            "'waterfilterstatereset' / 'airfilterstatereset' in strings.json); "
            "catalog_ac.py 'hepaFilterState' (GOOD / BUY / CHANGE, disabled by default) "
            "with 'hepaFilterReset' → latch on 'Change' (BUY = order a spare). The AC's "
            "main 'filterState' is skipped: it also reports CLEAN for its washable "
            "filter and which of CLEAN / CHANGE the 'filterReset' button clears is "
            "not established."
        ),
        tasks=(
            ConsumableSignature(
                ("filterlife", "filterlife_1", "filterlife_2"),
                "Replace Filter",
                "percent_left",
                per_entity=True,
            ),
            ELECTROLUX_WATER_FILTER_STATE,
            # Fridge air filter / AC HEPA filter — one appliance never has both.
            ConsumableSignature(
                ("airfilterstate", "hepafilterstate"),
                "Replace Filter",
                "event_present",
                on_states=("Change",),
                resets=(("airfilterstate", "airfilterstatereset"), ("hepafilterstate", "hepafilterreset")),
            ),
        ),
    ),
    "ge_home": IntegrationSignature(
        name="GE Home (SmartHQ)",
        verified="2026-09-25 @ simbaja/ha_gehome master + simbaja/gehome (gehomesdk 2026.8.0; custom repository, not in the HACS default store)",
        source=(
            "HACS ge_home: no translation_key — entity names are "
            "f'{serial} {ERD title}' (+ ' {Property Title}' for property "
            "sensors, entities/common/ge_erd_entity.py + "
            "ge_erd_property_sensor.py), matched by entity-id suffix. "
            "devices/fridge.py WATER_FILTER_STATUS 'percent_remaining' "
            "(uom_override PERCENTAGE → _water_filter_status_percent_remaining); "
            "devices/water_filter.py WH_FILTER_LIFE_REMAINING 'life_remaining' "
            "(ErdCodeClass.PERCENTAGE → '%', gehomesdk "
            "ErdWaterFilterLifeRemainingConverter pct → "
            "_wh_filter_life_remaining_life_remaining). Skipped: the water "
            "softener binary WH_SOFTENER_LOW_SALT — gehomesdk "
            "ErdWaterSoftenerSaltLevel.boolify() returns self == OK, so the "
            "'low salt' binary is ON while the salt is fine (inverted; a "
            "latch would fire backwards). AC/dehumidifier/ice-maker filter "
            "binaries are device_class problem → problem-sensor adoption."
        ),
        tasks=(
            ConsumableSignature(
                ("water_filter_status_percent_remaining", "wh_filter_life_remaining_life_remaining"),
                "Replace Water Filter",
                "percent_left",
            ),
        ),
    ),
    "candy": IntegrationSignature(
        name="Candy Simply-Fi",
        verified="2026-09-25 @ bigmoby/home-assistant-candy main (1.5.1, HACS default)",
        source=(
            "HACS candy sensor.py: tk 'wash_total_cycles' (TOTAL_INCREASING; "
            "client/model.py sums the wide Temp* wash counters — no wrap, no "
            "reset) → Clean Tub every 30 cycles (the hOn/LG cadence). With the "
            "integration's opt-in maintenance counters (Simply-Fi app parity) "
            "it also exposes tk 'wash_maint_limescale' / 'wash_maint_filter' "
            "— cycles REMAINING until due (helpers.cycles_remaining: 0 when "
            "due or overdue, back to the full interval after the "
            "integration's reset button) → value_below 1 fires exactly when "
            "Candy itself reports due. Skipped: 'wash_maint_full_checkup' "
            "(button.py WashFullCheckUpButton sends CheckUpState=1 — the machine's "
            "self-diagnosis run, not a maintenance action; the integration schedules "
            "it itself via checkup_schedule). Resets verified 2026-09-27 @ 5e2999f: "
            "button.py tk 'wash_maint_limescale_reset' / 'wash_maint_filter_reset' "
            "(DIAGNOSTIC; press stores last_* = total cycles, the counter restarts)."
        ),
        tasks=(
            ConsumableSignature(("wash_total_cycles",), "Clean Tub", "usage_delta", delta_units=30),
            # 2.95: full-control mode adds the reset buttons (button.py
            # WashMaintResetButton, tk '<counter>_reset'); read-only setups have
            # none and the duty simply keeps no completion action.
            ConsumableSignature(
                ("wash_maint_limescale",),
                "Descaling",
                "value_below",
                delta_units=1,
                resets=(("wash_maint_limescale", "wash_maint_limescale_reset"),),
            ),
            ConsumableSignature(
                ("wash_maint_filter",),
                "Filter Cleaning",
                "value_below",
                delta_units=1,
                resets=(("wash_maint_filter", "wash_maint_filter_reset"),),
            ),
        ),
    ),
    "homewhiz": IntegrationSignature(
        name="HomeWhiz (Beko / Grundig / Arçelik)",
        verified="2026-09-27 @ home-assistant-HomeWhiz/home-assistant-HomeWhiz main (0b7f8d8, HACS default)",
        source=(
            "home-assistant-HomeWhiz custom_components/homewhiz/appliance_controls.py "
            "build_controls_from_warnings: every entry of the appliance's cloud config "
            "deviceWarnings becomes a BooleanBitmaskControl with key "
            "to_friendly_name(strKey) (lower-cased strKey); binary_sensor.py turns them "
            "into binary sensors and entity.py translation_key returns entity_key.lower() "
            "for EVERY entity. device_class is the custom string 'homewhiz__<key>' — NOT "
            "problem, so problem-sensor adoption does not reach them; the appliance clears "
            "the bit after the refill / cleaning (auto-resolve). strKeys verified in the "
            "repo's test fixtures: DISHWASHER_WARNING_NO_SALT / _NO_RINSE_AID / "
            "_CHECK_THE_FILTER / DISHWASHER_LIQUID_DETERGENT_LOW, WASHER_WARNING_NO_LIQUID_"
            "DETERGENT / _NO_POWDER_DETERGENT / _LOW_DETERGENT / _NO_SOFTENER / _LOW_SOFTENER "
            "(auto-dosing tanks), DRYER_WARNING_CHECK_THE_FILTER / _CHECK_THE_CONDENSER_FILTER. "
            "Skipped: *_NO_WATER / *_DOOR_IS_OPEN / *_CALL_SERVICE (status or faults), "
            "DRYER_WARNING_TANKFULL (emptying the condensate tank is per-load operation), "
            "OVEN_WARNING_PYRO_CLEANING (a cleaning cycle in progress)."
        ),
        tasks=(
            ConsumableSignature(
                ("dishwasher_warning_no_salt",),
                "Refill Salt",
                "event_present",
                entity_domain="binary_sensor",
                on_states=("on",),
            ),
            ConsumableSignature(
                ("dishwasher_warning_no_rinse_aid",),
                "Refill Rinse Aid",
                "event_present",
                entity_domain="binary_sensor",
                on_states=("on",),
            ),
            ConsumableSignature(
                ("dishwasher_warning_check_the_filter",),
                "Filter Cleaning",
                "event_present",
                entity_domain="binary_sensor",
                on_states=("on",),
            ),
            # Auto-dosing tanks: the liquid and the powder tank are refilled
            # separately → one task per warning entity.
            ConsumableSignature(
                (
                    "dishwasher_liquid_detergent_low",
                    "washer_warning_low_detergent",
                    "washer_warning_no_liquid_detergent",
                    "washer_warning_no_powder_detergent",
                ),
                "Refill Detergent",
                "event_present",
                entity_domain="binary_sensor",
                on_states=("on",),
                per_entity=True,
            ),
            ConsumableSignature(
                ("washer_warning_no_softener", "washer_warning_low_softener"),
                "Refill Fabric Softener",
                "event_present",
                entity_domain="binary_sensor",
                on_states=("on",),
            ),
            ConsumableSignature(
                ("dryer_warning_check_the_filter",),
                "Lint Filter Cleaning",
                "event_present",
                entity_domain="binary_sensor",
                on_states=("on",),
            ),
            ConsumableSignature(
                ("dryer_warning_check_the_condenser_filter",),
                "Condenser Cleaning",
                "event_present",
                entity_domain="binary_sensor",
                on_states=("on",),
            ),
        ),
        translation_keys_authoritative=True,
    ),
    "connectlife": IntegrationSignature(
        name="ConnectLife (Hisense / Gorenje / ASKO)",
        verified="2026-09-27 @ oyvindwe/connectlife-ha main (fa830d2, HACS default)",
        source=(
            "oyvindwe/connectlife-ha: entities come from data_dictionaries/<type>.yaml; "
            "entity.py to_translation_key = property lower-cased (spaces → '_'), set on "
            "every sensor/binary description; 'optional: true' → disabled by default. "
            "012.yaml (hood) 'GreaseFilterUsedHours' and 010.yaml (hob with extractor) "
            "'Grease_filter_used_hours' (DURATION h, total_increasing — hours since the "
            "filter counter was reset; 012's reset is the select 'GreaseFilterResetCounter', "
            "not a button) → usage_above, 30 h (editorial; the hood's own interval is "
            "exposed as 'GreaseFilterCleaningIntervalInHours'). 012 "
            "'RecirculationFilter1UsedHours' / '…2UsedHours' and 010 "
            "'Recirculation_filter_1_used_hours' (carbon filters, h) → usage_above 120 h "
            "(editorial), one task per filter. 015.yaml (dishwasher) "
            "'Alarm_run_selfcleaning' (binary, NO device_class, options 2 = on) → latch. "
            "Skipped: every other alarm (Alarm_salt_refill, rinse aid, clean filters, "
            "condenser, grease, descale, detergent/softener states, AC 'f-filter') is "
            "device_class problem → problem-sensor adoption; fridge filter_state (% "
            "direction unclear)."
        ),
        tasks=(
            ConsumableSignature(
                ("greasefilterusedhours", "grease_filter_used_hours"),
                "Clean Grease Filter",
                "usage_above",
                above_hours=30,
            ),
            ConsumableSignature(
                ("recirculationfilter1usedhours", "recirculationfilter2usedhours", "recirculation_filter_1_used_hours"),
                "Replace Filter",
                "usage_above",
                above_hours=120,
                per_entity=True,
            ),
            ConsumableSignature(
                ("alarm_run_selfcleaning",),
                "Clean Appliance",
                "event_present",
                entity_domain="binary_sensor",
                on_states=("on",),
            ),
        ),
        translation_keys_authoritative=True,
    ),
    # ─── 2026-09-30: dates the appliance reports itself (due_date engine) ─
    "vitesy": IntegrationSignature(
        name="Vitesy (Shelfy)",
        verified="2026-09-30 @ home-assistant/core dev (new in 2026.10)",
        source=(
            "core vitesy sensor.py: tk 'filter_change_due' / 'fridge_cleaning_due' "
            "(device_class TIMESTAMP, EntityCategory.DIAGNOSTIC; the value is the "
            "device's maintenance[component].due_date, created only when the device "
            "reports one) + button.py: tk 'filter_changed' / 'fridge_cleaned' ('Mark "
            "filter as changed' / 'Mark fridge as cleaned', api.reset_maintenance → "
            "the next maintenance period, i.e. a later due date). Every entity "
            "description sets a translation_key."
        ),
        translation_keys_authoritative=True,
        tasks=(
            # A week's lead time to order the cartridge.
            ConsumableSignature(
                ("filter_change_due",),
                "Replace Filter",
                "due_date",
                days_before=7,
                resets=(("filter_change_due", "filter_changed"),),
            ),
            ConsumableSignature(
                ("fridge_cleaning_due",),
                "Clean Refrigerator",
                "due_date",
                resets=(("fridge_cleaning_due", "fridge_cleaned"),),
            ),
        ),
    ),
    "tami4": IntegrationSignature(
        name="Tami4 Edge / Edge+",
        verified="2026-10-03 @ home-assistant/core 2026.10.0b0",
        source=(
            "core tami4 sensor.py ENTITY_DESCRIPTIONS (unchanged since 2026.9; every sensor "
            "and button description sets a translation_key, has_entity_name): tk "
            "'filter_upcoming_replacement' / 'uv_upcoming_replacement' (device_class DATE, "
            "no unit, enabled; coordinator.py FlattenedWaterQuality ← Tami4EdgeAPI 3.0 "
            "water_quality.py QualityInfo.upcoming_replacement = date.fromtimestamp(cloud "
            "dynamicData filterInfo / uvInfo 'upcomingReplacement' / 1000); HA docs: 'Date "
            "when the filter / UV lamp needs to be replaced') → due_date. button.py has only "
            "'boil_water' / 'prepare_drink' — no reset to wire: the Tami4 cloud moves the "
            "date after the replacement, which clears the trigger (auto-complete). Skipped: "
            "'filter_litters_passed' (LITERS, TOTAL — water through the currently installed "
            "filter, the part the date duty already covers) and 'filter_installed' / "
            "'uv_installed' (booleans, status)."
        ),
        translation_keys_authoritative=True,
        tasks=(
            # A week's lead time to order the cartridge / lamp (as for Vitesy's filter).
            ConsumableSignature(("filter_upcoming_replacement",), "Replace Water Filter", "due_date", days_before=7),
            ConsumableSignature(("uv_upcoming_replacement",), "Replace UV Lamp", "due_date", days_before=7),
        ),
    ),
    # ─── Round 16 (2026-10-03): HACS water treatment and Polaris / Rusclimate ─
    "midea_auto_cloud": IntegrationSignature(
        name="Midea Auto Cloud",
        verified="2026-10-03 @ sususweet/midea_auto_cloud master (8d0f9a5)",
        source=(
            "HACS midea_auto_cloud (not the midea_ac_lan / core midea domains): midea_entity.py sets "
            "_attr_translation_key = the mapping's translation_key, else the entity key, on every "
            "entity; platform_setup.py creates every entity the device's mapping lists "
            "(device_mapping/T0x<type>.py, picked by subtype → sn8 → default_<category>). T0xED water "
            "purifiers (PERCENTAGE): life_1 / life_2 with tk 'life_fcb' / 'life_ro' "
            "(default_water_purifier, 63600118 — en 'FCB filter remaining life' / 'RO filter remaining "
            "life'), 'life_ro' / 'life_pcb' (632009F5, 632009C6; 632009C6 lists translation_key twice, "
            "the last wins) and 'life_1' / 'life_2_pcb' (632009EN) → one task per cartridge. T0xFC air "
            "purifiers (571Z3081, 571Z307F): 'deep_filter_percent' ('Filter Life Remaining', "
            "PERCENTAGE). T0xAC fresh-air units (default_central_fresh_air, 26096947): "
            "'fresh_filter_time' ('Filter remaining life', %; the default mapping writes "
            "native_unit_of_measurement, which the entity ignores → no unit, the lenient unit gate) → "
            "the ventilation filter. Skipped: T0xED 'left_salt' (% salt left) exists only in "
            "default_water_purifier, which creates its softener, purifier and pipeline-machine "
            "attributes for every device it serves (issues #48, #129) — a purifier would get a salt "
            "duty on an entity that never reports; 'remind_maintenance_days' (meaning undocumented); "
            "the C2 toilet's 'filter_use_per' ('Filter Use Percentage' but BATTERY class — direction "
            "contradictory); T0xFA 'filter_life_time' / 'dust_life_time' and T0xCE "
            "'clean_net_used_time' / 'change_net_used_time' (hours, used vs left not established); "
            "the 'maintenance_remind' / 'filter_value' binaries are device_class problem "
            "(problem-sensor adoption). button.py has no filter reset."
        ),
        translation_keys_authoritative=True,
        tasks=(
            ConsumableSignature(
                ("life_fcb", "life_ro", "life_pcb", "life_1", "life_2_pcb"),
                "Replace Water Filter",
                "percent_left",
                per_entity=True,
            ),
            ConsumableSignature(("deep_filter_percent",), "Replace Filter", "percent_left"),
            ConsumableSignature(("fresh_filter_time",), "Replace Ventilation Filter", "percent_left"),
        ),
    ),
    "gruenbeck_cloud": IntegrationSignature(
        name="Grünbeck softliQ (cloud)",
        verified="2026-10-03 @ p0l0/hagruenbeck_cloud main (571eb1d)",
        source=(
            "HACS gruenbeck_cloud (custom repository) sensor.py SENSORS — every description sets a "
            "translation_key, GruenbeckCloudEntity has_entity_name: tk 'salt_range' ('Salt Range' / "
            "'Salzvorrat', UnitOfTime.DAYS, no device class, enabled; pygruenbeck_cloud "
            "realtime.salt_range = the days the salt supply lasts) → Refill Softener Salt a week ahead "
            "(the BWT / EcoWater days precedent); tk 'next_service' ('Next Service', source comment "
            "'Perform maintenance in [days]', UnitOfTime.DAYS, DIAGNOSTIC, "
            "entity_registry_enabled_default=False — 'Not available at SE devices') → Annual Service "
            "two weeks ahead, the Water Softener template's service duty; it is proposed once the "
            "entity is enabled. Skipped: the 'has_error' binary (device_class problem → problem-sensor "
            "adoption), 'last_service' (DATE of the last service), 'salt_consumption' (kg used). The "
            "integration has no button platform."
        ),
        translation_keys_authoritative=True,
        tasks=(
            ConsumableSignature(("salt_range",), "Refill Softener Salt", "duration_left", below_hours=168),
            ConsumableSignature(("next_service",), "Annual Service", "duration_left", below_hours=336),
        ),
    ),
    "gruenbeck_softliq_sc": IntegrationSignature(
        name="Grünbeck softliQ SC (local)",
        verified="2026-10-03 @ tizianodeg/gruenbeck_softliQ_SC main (c603343)",
        source=(
            "HACS gruenbeck_softliq_sc (custom repository; the softliQ:SC's local web interface) "
            "sensor.py: every SoftQLinkSensorEntityDescription sets translation_key = the controller's "
            "own parameter id (upper case, matched exactly): 'D_A_2_3' ('Salt range in days') and "
            "'D_A_2_2' ('days until the next maintenance'), both UnitOfTime.DAYS, DIAGNOSTIC, enabled — "
            "the same pair as the cloud integration, same leads. button.py has only "
            "'manual_regeneration' / 'reset_error_memory' — no counter reset."
        ),
        translation_keys_authoritative=True,
        tasks=(
            ConsumableSignature(("D_A_2_3",), "Refill Softener Salt", "duration_left", below_hours=168),
            ConsumableSignature(("D_A_2_2",), "Annual Service", "duration_left", below_hours=336),
        ),
    ),
    "polaris": IntegrationSignature(
        name="Polaris IQ Home / Rusclimate (MQTT)",
        verified="2026-10-03 @ samoswall/polaris-mqtt main (0db4fa1)",
        source=(
            "HACS polaris (polaris-mqtt: Polaris IQ Home and Rusclimate — Ballu / Electrolux / Royal "
            "Thermo / Zanussi — appliances over MQTT). sensor.py PolarisSensor: entity_id "
            "sensor.<class>_<model>_<description.name>, has_entity_name; const.py SENSORS_* carry a "
            "translation_key; device model = '<class> - <model>'. The 'expendables' payload '[x,y]' "
            "feeds the '… retain' sensors (= remaining, ru 'Остаток …'): tk 'filter_retain' = x — "
            "HOURS on humidifiers (SENSORS_HUMIDIFIER; the vendor app's expendable_max 4392 h filter / "
            "168 h tank), Polaris air cleaners (SENSORS_AIRCLEANER) and the Electrolux EPVS/ERVX "
            "ventilation unit (SENSORS_VENTILATION, model 'ventilation - …' → the ventilation filter, "
            "a week's lead), PERCENTAGE on the Ballu ONEAIR ASP-100/200 breezers (SENSORS_CLIMATE / "
            "_200) and the Electrolux EAP purifier — the unit routes each entity to its direction; tk "
            "'clean_retain' = y (HOURS, humidifiers except type 835: water-tank cleaning); tk "
            "'pre_filter_retain' = y (PERCENTAGE, ASP-200); tk 'anode_retain' = x (UnitOfTime.DAYS, "
            "water heaters 844/876/877). button.py: humidifiers (not 835/881) 'button_reset_filter' "
            "(payload [0,0], 'Reset time filter') and 'button_reset_tank' ([1,0], 'Reset time water "
            "tank'), Polaris air cleaners (not PAW-0804) 'button_reset_filter' ([0]) → wired on the "
            "hour duties. The Ballu breezers' resets stay unwired: the ASP-100 sends [100], the "
            "ASP-200 'button_reset_filter' [0,100] and 'button_reset_prefilter' [100,0] while "
            "sensor.py reads the filter from index 0 and the pre-filter from index 1 — which counter "
            "each ASP-200 button resets is not established. No anode reset exists. Skipped: the "
            "vacuums' 'expendables' brush/filter/mop hours (used vs left not established)."
        ),
        tasks=(
            ConsumableSignature(
                ("filter_retain",),
                "Replace Filter",
                "duration_left",
                models_exclude=("ventilation",),
                resets=(("filter_retain", "button_reset_filter"),),
            ),
            ConsumableSignature(("filter_retain",), "Replace Filter", "percent_left"),
            ConsumableSignature(
                ("filter_retain",),
                "Replace Ventilation Filter",
                "duration_left",
                below_hours=168,
                models=("ventilation",),
            ),
            ConsumableSignature(
                ("clean_retain",),
                "Clean Tank",
                "duration_left",
                resets=(("clean_retain", "button_reset_tank"),),
            ),
            ConsumableSignature(("pre_filter_retain",), "Clean Pre-Filter", "percent_left"),
            ConsumableSignature(("anode_retain",), "Anode Rod Inspection", "duration_left", below_hours=336),
        ),
    ),
}
