"""Cars and EVs — odometer-driven service duties.

Data module of the suggested-setups signature catalog — see
``helpers/signatures/_model.py`` for the direction semantics and the
method contract (every entry cites and is verified against the
integration's source; drift-probed weekly)."""

from __future__ import annotations

from ._model import ConsumableSignature, IntegrationSignature

SIGNATURES: dict[str, IntegrationSignature] = {
    "kia_uvo": IntegrationSignature(
        name="Hyundai / Kia Connect",
        verified="2026-07-18 @ Hyundai-Kia-Connect/kia_uvo master",
        source=(
            "Hyundai-Kia-Connect/kia_uvo custom_components/kia_uvo/sensor.py "
            "(translation_key 'odometer', DISTANCE, TOTAL_INCREASING, dynamic "
            "km/mi unit). next/last_service_distance exist but their semantics "
            "(target vs remaining) are unverified — odometer delta instead."
        ),
        tasks=(
            ConsumableSignature(("odometer",), "Annual Service", "usage_delta", delta_units=15000),
            ConsumableSignature(("odometer",), "Tire Rotation", "usage_delta", delta_units=10000),
        ),
    ),
    "tesla_custom": IntegrationSignature(
        name="Tesla (custom)",
        verified="2026-07-18 @ alandtse/tesla dev",
        source=(
            "alandtse/tesla custom_components/tesla_custom/sensor.py "
            "TeslaCarOdometer (type='odometer' → entity_id suffix, no "
            "translation_key; DISTANCE, TOTAL_INCREASING, native miles)."
        ),
        tasks=(
            ConsumableSignature(("odometer",), "Annual Service", "usage_delta", delta_units=15000),
            ConsumableSignature(("odometer",), "Tire Rotation", "usage_delta", delta_units=10000),
        ),
    ),
    "renault": IntegrationSignature(
        name="Renault",
        verified="2026-07-18 @ home-assistant/core dev",
        source=(
            "home-assistant/core homeassistant/components/renault/sensor.py "
            "(translation_key 'mileage', DISTANCE, TOTAL_INCREASING, km)."
        ),
        tasks=(
            ConsumableSignature(("mileage",), "Annual Service", "usage_delta", delta_units=15000),
            ConsumableSignature(("mileage",), "Tire Rotation", "usage_delta", delta_units=10000),
        ),
    ),
    "mbapi2020": IntegrationSignature(
        name="Mercedes-Benz",
        verified="2026-07-18 @ ReneNulschDE/mbapi2020 master",
        source=(
            "ReneNulschDE/mbapi2020 const.py SENSORS 'odometer' (name "
            "'Odometer' → entity_id suffix; attributes carry "
            "serviceintervaldays/distance) — lifetime km counter."
        ),
        tasks=(
            ConsumableSignature(("odometer",), "Annual Service", "usage_delta", delta_units=15000),
            ConsumableSignature(("odometer",), "Tire Rotation", "usage_delta", delta_units=10000),
        ),
    ),
    "vw_eu_data_act": IntegrationSignature(
        name="VW Group (EU Data Act)",
        verified="2026-07-18 @ mikrohard/hass-vw-eu-data-act main",
        source=(
            "mikrohard/hass-vw-eu-data-act data.py CuratedSensor('mileage', "
            "'Mileage', 'distance', 'km', 'total_increasing') — official EU "
            "Data Act portal data for VW/Audi/Škoda/SEAT/Cupra/Bentley (the "
            "unofficial WeConnect APIs were locked down upstream)."
        ),
        tasks=(
            ConsumableSignature(("mileage",), "Annual Service", "usage_delta", delta_units=15000),
            ConsumableSignature(("mileage",), "Tire Rotation", "usage_delta", delta_units=10000),
        ),
    ),
    "subaru": IntegrationSignature(
        name="Subaru",
        verified="2026-07-18 @ home-assistant/core dev",
        source=("home-assistant/core homeassistant/components/subaru/sensor.py (key sc.ODOMETER, translation_key 'odometer')."),
        tasks=(
            ConsumableSignature(("odometer",), "Annual Service", "usage_delta", delta_units=15000),
            ConsumableSignature(("odometer",), "Tire Rotation", "usage_delta", delta_units=10000),
        ),
    ),
    "volvo": IntegrationSignature(
        name="Volvo",
        verified="2026-07-18 @ home-assistant/core dev",
        source=("home-assistant/core homeassistant/components/volvo/sensor.py (key 'odometer', api_field 'odometer')."),
        tasks=(
            ConsumableSignature(("odometer",), "Annual Service", "usage_delta", delta_units=15000),
            ConsumableSignature(("odometer",), "Tire Rotation", "usage_delta", delta_units=10000),
        ),
    ),
    "polestar_api": IntegrationSignature(
        name="Polestar",
        verified="2026-07-19 @ pypolestar/polestar_api main sensor.py",
        source=(
            "HACS polestar_api: key 'current_odometer' (native METERS, "
            "suggested display KILOMETERS — the unit-aware threshold reads "
            "the display unit)."
        ),
        tasks=(
            ConsumableSignature(("current_odometer",), "Annual Service", "usage_delta", delta_units=15000),
            ConsumableSignature(("current_odometer",), "Tire Rotation", "usage_delta", delta_units=10000),
        ),
    ),
    "fordpass": IntegrationSignature(
        name="Ford (FordPass)",
        verified="2026-07-19 @ itchannel/fordpass-ha master sensor.py",
        source="HACS fordpass: dict-key 'odometer' sensor (name-style, suffix match).",
        tasks=(
            ConsumableSignature(("odometer",), "Annual Service", "usage_delta", delta_units=15000),
            ConsumableSignature(("odometer",), "Tire Rotation", "usage_delta", delta_units=10000),
        ),
    ),
    "toyota": IntegrationSignature(
        name="Toyota Connected",
        verified="2026-07-19 @ DurgNomis-drol/ha_toyota master sensor.py",
        source="HACS toyota: tk 'odometer', DISTANCE, TOTAL_INCREASING.",
        tasks=(
            ConsumableSignature(("odometer",), "Annual Service", "usage_delta", delta_units=15000),
            ConsumableSignature(("odometer",), "Tire Rotation", "usage_delta", delta_units=10000),
        ),
    ),
    "mg_saic": IntegrationSignature(
        name="MG/SAIC iSMART",
        verified="2026-07-19 @ ad-ha/mg-saic-ha main sensor.py (HACS default)",
        source=(
            "HACS mg_saic: 'Mileage' sensor (suffix _mileage; the sibling "
            "'Mileage Since Last Charge' does not end in _mileage — no clash)."
        ),
        tasks=(
            ConsumableSignature(("mileage",), "Annual Service", "usage_delta", delta_units=15000),
            ConsumableSignature(("mileage",), "Tire Rotation", "usage_delta", delta_units=10000),
        ),
    ),
    "myskoda": IntegrationSignature(
        name="Škoda (MySkoda)",
        verified="2026-07-19 @ skodaconnect/homeassistant-myskoda main sensor.py",
        source=(
            "HACS myskoda: tk 'mileage' (key 'milage', km, TOTAL_INCREASING); "
            "tk 'inspection' (DAYS) / 'inspection_in_km' (km) and "
            "'oil_service_in_days' / 'oil_service_in_km' — the car's own "
            "maintenance_report *_due_in countdowns (remaining until due). "
            "The countdown replaces a generic odometer service duty, so no "
            "editorial 15000 km interval here."
        ),
        tasks=(
            ConsumableSignature(("mileage",), "Tire Rotation", "usage_delta", delta_units=10000),
            ConsumableSignature(("inspection",), "Annual Service", "duration_left", below_hours=336),
            ConsumableSignature(("inspection_in_km",), "Annual Service", "value_below", delta_units=1000),
            ConsumableSignature(("oil_service_in_days",), "Oil Service", "duration_left", below_hours=336),
            ConsumableSignature(("oil_service_in_km",), "Oil Service", "value_below", delta_units=1000),
        ),
    ),
    "audiconnect": IntegrationSignature(
        name="Audi Connect",
        verified="2026-07-19 @ audiconnect/audi_connect_ha master sensor.py",
        source=(
            "HACS audiconnect (name-derived entity ids, no translation_key): "
            "'Mileage' (km, TOTAL_INCREASING); 'Service inspection time' "
            "(days) / 'Service inspection distance' (km) and 'Oil change "
            "time' / 'Oil change distance' — VAG API inspectionDue_*/"
            "oilServiceDue_* remaining-until countdowns (audi_models.py). "
            "Countdowns replace the generic odometer service duty."
        ),
        tasks=(
            ConsumableSignature(("mileage",), "Tire Rotation", "usage_delta", delta_units=10000),
            ConsumableSignature(("service_inspection_time",), "Annual Service", "duration_left", below_hours=336),
            ConsumableSignature(("service_inspection_distance",), "Annual Service", "value_below", delta_units=1000),
            ConsumableSignature(("oil_change_time",), "Oil Service", "duration_left", below_hours=336),
            ConsumableSignature(("oil_change_distance",), "Oil Service", "value_below", delta_units=1000),
        ),
    ),
    # The three core Tesla integrations share the same entity pattern:
    # translation_key = description key (entity.py `_attr_translation_key =
    # self.key`), odometer in native MILES — the unit-aware threshold
    # converts. Complements the HACS tesla_custom already covered.
    "tesla_fleet": IntegrationSignature(
        name="Tesla Fleet",
        verified="2026-07-20 @ home-assistant/core dev",
        source=("core tesla_fleet: key/tk 'vehicle_state_odometer' (TOTAL_INCREASING, MILES, DISTANCE)."),
        tasks=(
            ConsumableSignature(("vehicle_state_odometer",), "Annual Service", "usage_delta", delta_units=15000),
            ConsumableSignature(("vehicle_state_odometer",), "Tire Rotation", "usage_delta", delta_units=10000),
        ),
    ),
    "teslemetry": IntegrationSignature(
        name="Teslemetry",
        verified="2026-07-20 @ home-assistant/core dev",
        source=("core teslemetry: key/tk 'vehicle_state_odometer' (TOTAL_INCREASING, MILES, DISTANCE)."),
        tasks=(
            ConsumableSignature(("vehicle_state_odometer",), "Annual Service", "usage_delta", delta_units=15000),
            ConsumableSignature(("vehicle_state_odometer",), "Tire Rotation", "usage_delta", delta_units=10000),
        ),
    ),
    "tessie": IntegrationSignature(
        name="Tessie",
        verified="2026-07-20 @ home-assistant/core dev",
        source=("core tessie: key/tk 'vehicle_state_odometer' (TOTAL_INCREASING, MILES, DISTANCE)."),
        tasks=(
            ConsumableSignature(("vehicle_state_odometer",), "Annual Service", "usage_delta", delta_units=15000),
            ConsumableSignature(("vehicle_state_odometer",), "Tire Rotation", "usage_delta", delta_units=10000),
        ),
    ),
    "ituran": IntegrationSignature(
        name="Ituran",
        verified="2026-07-20 @ home-assistant/core dev",
        source=("core ituran: tk 'mileage' (KILOMETERS, DISTANCE) — fleet-tracker odometer."),
        tasks=(
            ConsumableSignature(("mileage",), "Annual Service", "usage_delta", delta_units=15000),
            ConsumableSignature(("mileage",), "Tire Rotation", "usage_delta", delta_units=10000),
        ),
    ),
    "starline": IntegrationSignature(
        name="StarLine",
        verified="2026-07-20 @ home-assistant/core dev",
        source=("core starline: tk 'mileage' (KILOMETERS, TOTAL_INCREASING) — alarm-system odometer."),
        tasks=(
            ConsumableSignature(("mileage",), "Annual Service", "usage_delta", delta_units=15000),
            ConsumableSignature(("mileage",), "Tire Rotation", "usage_delta", delta_units=10000),
        ),
    ),
    "bosch_ebike": IntegrationSignature(
        name="Bosch eBike",
        verified="2026-07-20 @ Phil-Barker/hass-bosch-ebike + marq24/ha-bosch-ebike-flow main (HACS default)",
        source=(
            "HACS bosch_ebike (both forks share the domain and the "
            "'total_distance' key/tk, KILOMETERS, TOTAL_INCREASING) — the "
            "eBike's odometer. Chain lubrication every ~250 km (bicycle "
            "maintenance standard) and a drivetrain service every ~2,000 km "
            "(Bosch eBike's service-interval guidance). Odometer delta "
            "re-baselines on completion, like the car duties."
        ),
        tasks=(
            ConsumableSignature(("total_distance",), "Lubricate Chain", "usage_delta", delta_units=250),
            ConsumableSignature(("total_distance",), "Bike Service", "usage_delta", delta_units=2000),
        ),
    ),
    "stromer": IntegrationSignature(
        name="Stromer eBike",
        verified="2026-07-20 @ CoMPaTech/stromer main sensor.py (HACS default)",
        source=(
            "HACS stromer: tk 'total_distance' (KILOMETERS, TOTAL_INCREASING) "
            "— the eBike's odometer. Same drivetrain duties as Bosch eBike."
        ),
        tasks=(
            ConsumableSignature(("total_distance",), "Lubricate Chain", "usage_delta", delta_units=250),
            ConsumableSignature(("total_distance",), "Bike Service", "usage_delta", delta_units=2000),
        ),
    ),
}
