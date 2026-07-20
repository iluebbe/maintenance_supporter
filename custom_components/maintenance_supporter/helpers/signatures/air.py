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
        verified="2026-07-18 @ home-assistant/core dev",
        source=(
            "home-assistant/core homeassistant/components/daikin/climate.py "
            "(climate platform verified present; AC-only integration, so the "
            "climate entity IS an air conditioner). Runtime on the hvac_action "
            "ATTRIBUTE — the state only reports the standby mode. Interval per Daikin's official guidance (clean filters every 2 weeks; ≈100 runtime-hours at typical in-season use)."
        ),
        tasks=(
            ConsumableSignature(
                (),
                "Filter Cleaning",
                "runtime_hours",
                delta_units=100,
                entity_domain="climate",
                attribute="hvac_action",
                on_states=("cooling", "heating", "fan", "drying"),
            ),
        ),
    ),
    "gree": IntegrationSignature(
        name="Gree AC",
        verified="2026-07-18 @ home-assistant/core dev",
        source=(
            "home-assistant/core homeassistant/components/gree/climate.py "
            "(climate platform verified present; AC-only integration, so the "
            "climate entity IS an air conditioner). Runtime on the hvac_action "
            "ATTRIBUTE — the state only reports the standby mode. Interval per Daikin's official guidance (clean filters every 2 weeks; ≈100 runtime-hours at typical in-season use)."
        ),
        tasks=(
            ConsumableSignature(
                (),
                "Filter Cleaning",
                "runtime_hours",
                delta_units=100,
                entity_domain="climate",
                attribute="hvac_action",
                on_states=("cooling", "heating", "fan", "drying"),
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
        verified="2026-07-19 @ iprak/winix master sensor.py (HACS default)",
        source=(
            "HACS winix: tk 'filter_life' (PERCENTAGE) — % remaining derived "
            "device-side from filter hours vs the model's "
            "filter_alarm_duration."
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
}
