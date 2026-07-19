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
            ConsumableSignature(
                ("filter_lifetime", "top_filter_remain_percent"), "Replace Filter", "percent_left"
            ),
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
        verified="2026-07-17 @ ollo69/ha-smartthinq-sensors master",
        source=(
            "ollo69/ha-smartthinq-sensors custom_components/smartthinq_sensors/sensor.py "
            "(legacy name= entities, NO translation_key → matched by entity_id suffix; "
            "FILTER_*_LIFE / *_REMAIN_PERC are percent via wideq device.py "
            "_get_filter_life(); TUBCLEAN_COUNT counts up per wash cycle and the "
            "machine resets it when a tub-clean course runs)"
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
        verified="2026-07-17 @ home-assistant/core dev",
        source=(
            "home-assistant/core homeassistant/components/home_connect/sensor.py "
            "EVENT_SENSORS (HomeConnectEventSensor, device_class ENUM, "
            "EVENT_OPTIONS ['confirmed','off','present']; translation_key per "
            "EventKey). No percent/countdown consumables exist (coffee counters "
            "are lifetime, no reset) — these actionable events are the only "
            "maintenance-usable signal, matched as a state latch on 'present'."
        ),
        tasks=(
            ConsumableSignature(("salt_nearly_empty",), "Refill Salt", "event_present"),
            ConsumableSignature(("rinse_aid_nearly_empty",), "Refill Rinse Aid", "event_present"),
            ConsumableSignature(("device_should_be_descaled",), "Descale Appliance", "event_present"),
            ConsumableSignature(("device_should_be_cleaned",), "Clean Appliance", "event_present"),
            ConsumableSignature(
                ("grease_filter_max_saturation_reached",), "Clean Grease Filter", "event_present"
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
        verified="2026-07-18 @ albaintor/homeassistant_electrolux_status master",
        source=(
            "albaintor/homeassistant_electrolux_status catalog_purifier.py "
            "'FilterLife' (PERCENTAGE) + entity.py entity_id = "
            "f'..._{entity_attr}' — HA slugifies the raw 'FilterLife' tail, so "
            "both slug forms are matched."
        ),
        tasks=(
            ConsumableSignature(("filterlife", "filter_life"), "Replace Filter", "percent_left"),
        ),
    ),
    "midea_ac_lan": IntegrationSignature(
        name="Midea (LAN)",
        verified="2026-07-18 @ wuwentao/midea_ac_lan master",
        source=(
            "wuwentao/midea_ac_lan midea_devices.py + midea_entity.py "
            "(_attr_translation_key from the per-attribute config; entity_id = "
            "f'{device_id}_{entity_key}'). 0xED water purifier: filter1/2/3_life "
            "PERCENTAGE; 0xC2: filter_life PERCENTAGE. The filterN_days "
            "countdowns describe the SAME filters — percent only, no duplicate "
            "tasks. Filter cleaning/change reminders (A1/CE/AC full_dust) are "
            "device_class problem binaries — covered by problem-sensor adoption."
        ),
        tasks=(
            ConsumableSignature(
                ("filter1_life", "filter2_life", "filter3_life"),
                "Replace Water Filter",
                "percent_left",
            ),
            ConsumableSignature(("filter_life",), "Replace Filter", "percent_left"),
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
            ConsumableSignature(
                ("total_coffees_made",), "Backflush Espresso Group", "usage_delta", delta_units=100
            ),
            ConsumableSignature(
                ("total_coffees_made",), "Replace Water Filter", "usage_delta", delta_units=1000
            ),
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
}
