"""Kitchen & household appliances incl. espresso machines.

Data module of the suggested-setups signature catalog — see
``helpers/signatures/_model.py`` for the direction semantics and the
method contract (every entry cites and is verified against the
integration's source; drift-probed weekly)."""

from __future__ import annotations

from ._model import ConsumableSignature, IntegrationSignature

SIGNATURES: dict[str, IntegrationSignature] = {
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
            ConsumableSignature(
                ("rinse_refill",),
                "Refill Rinse Aid",
                "event_present",
                entity_domain="binary_sensor",
                on_states=("on",),
            ),
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
        verified="2026-09-25 @ chris-mc1/homeconnect_local_hass main (HACS default)",
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
            "adoption)."
        ),
        tasks=(
            ConsumableSignature(("sensor_salt",), "Refill Salt", "event_present", ok_state="full"),
            ConsumableSignature(("sensor_rinse_aid",), "Refill Rinse Aid", "event_present", ok_state="full"),
            ConsumableSignature(("sensor_grease_filter_saturation",), "Clean Grease Filter", "alert_above", delta_units=90),
            ConsumableSignature(("sensor_carbon_filter_saturation",), "Replace Filter", "alert_above", delta_units=90),
            ConsumableSignature(("sensor_countdown_descaling",), "Descale Appliance", "value_below", delta_units=10),
            ConsumableSignature(("sensor_countdown_cleaning",), "Clean Appliance", "value_below", delta_units=10),
            ConsumableSignature(("sensor_countdown_water_filter",), "Replace Water Filter", "value_below", delta_units=10),
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
        verified="2026-07-18 @ albaintor/homeassistant_electrolux_status master",
        source=(
            "albaintor/homeassistant_electrolux_status catalog_purifier.py "
            "'FilterLife' (PERCENTAGE) + entity.py entity_id = "
            "f'..._{entity_attr}' — HA slugifies the raw 'FilterLife' tail, so "
            "both slug forms are matched."
        ),
        tasks=(ConsumableSignature(("filterlife", "filter_life"), "Replace Filter", "percent_left"),),
    ),
    "midea_ac_lan": IntegrationSignature(
        name="Midea (LAN)",
        verified="2026-07-18 / re-audited 2026-09-25 @ wuwentao/midea_ac_lan master",
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
        verified="2026-09-25 @ home-assistant/core dev (new in 2026.8) + midea-local 12.1.0",
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
            "adoption."
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
        verified="2026-07-19 @ Andre0512/hon main sensor.py (1.5k stars; open #101 ask)",
        source=(
            "HACS hon: purifiers (type AP) expose tk 'filter_life' (main "
            "filter, %) and tk 'filter_cleaning' (pre-filter, %); washers "
            "(WM/WD) expose tk 'cycles_total' (lifetime wash-cycle counter) — "
            "tub-clean cadence reuses LG's manufacturer value of 30 cycles."
        ),
        tasks=(
            ConsumableSignature(("filter_life",), "Replace Filter", "percent_left"),
            ConsumableSignature(("filter_cleaning",), "Filter Cleaning", "percent_left"),
            ConsumableSignature(("cycles_total",), "Clean Tub", "usage_delta", delta_units=30),
        ),
    ),
    "whirlpool": IntegrationSignature(
        name="Whirlpool",
        verified="2026-07-19 @ core/dev whirlpool/sensor.py",
        source=(
            "core whirlpool: tk 'washer_state' ENUM incl. 'running_maincycle' "
            "— no cycle counter exists, so the ENGINE accumulates wash time "
            "(the Miele Clean-Tub pattern; 60 h of washing ~= LG's 30-cycle "
            "cadence at a typical 2-h cycle). The dryer's distinct "
            "'dryer_state' tk cannot match."
        ),
        tasks=(
            ConsumableSignature(
                ("washer_state",),
                "Clean Tub",
                "runtime_hours",
                delta_units=60,
                on_states=("running_maincycle",),
            ),
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
            ConsumableSignature(("cycle_count",), "Descaling", "usage_delta", delta_units=30),
            ConsumableSignature(("cycle_count",), "Filter Cleaning", "usage_delta", delta_units=50),
            ConsumableSignature(("cycle_count",), "Clean Tub", "usage_delta", delta_units=100),
        ),
    ),
    "traeger": IntegrationSignature(
        name="Traeger grill",
        verified="2026-07-20 @ njobrien1006/hass_traeger master + johnvoipguy/Traeger-WiFire main (HACS default, shared sensor map)",
        source=(
            "HACS traeger (both default-store forks share the domain and "
            "sensor map): 'Cook Cycle' sensor (usage;cook_cycles — lifetime "
            "counter, suffix _cook_cycle, disabled-by-default DIAGNOSTIC; the "
            "suggestion appears once the user enables it). Cadence per "
            "Traeger's official maintenance guidance: grease management every "
            "few cooks, deep clean ~every 20 cooks / twice a grilling season. "
            "'Pellet Level' (%) is hopper inventory, not wear — skipped (same "
            "rationale as Palazzetti's pellet_level)."
        ),
        tasks=(
            ConsumableSignature(("cook_cycle",), "Clean Grease Trap", "usage_delta", delta_units=5),
            ConsumableSignature(("cook_cycle",), "Clean Appliance", "usage_delta", delta_units=20),
        ),
    ),
    "electrolux": IntegrationSignature(
        name="Electrolux (OCP API)",
        verified="2026-09-25 @ TTLucian/ha-electrolux main (HACS default; not the electrolux_status domain)",
        source=(
            "HACS electrolux: entity.py sets translation_key = the lowercased "
            "capability name (fppn prefix stripped) → 'filterlife', "
            "'filterlife_1', 'filterlife_2'. catalogs/catalog_ap.py "
            "'FilterLife' (PERCENTAGE, air purifiers) and the UltimateHome 500 "
            "pair 'FilterLife_1' / 'FilterLife_2' (int 0-100 %, two slots with "
            "their own FilterType_1/_2) → one duty per filter (per_entity). "
            "Skipped: AC/fridge/hood filter lifetimes and timers (seconds or "
            "minutes with the maintainer's own 'unit is an educated guess' "
            "caveat — remaining vs used unclear) and the filterState ENUMs "
            "(rendered state strings not verified)."
        ),
        tasks=(
            ConsumableSignature(
                ("filterlife", "filterlife_1", "filterlife_2"),
                "Replace Filter",
                "percent_left",
                per_entity=True,
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
            "(what the Simply-Fi 'Full Check-up' asks the user to do is "
            "undocumented)."
        ),
        tasks=(
            ConsumableSignature(("wash_total_cycles",), "Clean Tub", "usage_delta", delta_units=30),
            ConsumableSignature(("wash_maint_limescale",), "Descaling", "value_below", delta_units=1),
            ConsumableSignature(("wash_maint_filter",), "Filter Cleaning", "value_below", delta_units=1),
        ),
    ),
}
