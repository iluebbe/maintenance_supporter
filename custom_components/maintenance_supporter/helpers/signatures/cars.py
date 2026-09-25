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
        verified="2026-09-25 @ townsmcp/mg-saic-ha main sensor.py (HACS default)",
        source=(
            "HACS mg_saic (repo moved ad-ha/mg-saic-ha → townsmcp/mg-saic-ha, "
            "hacs/default #9319; code identical): SAICMGMileageSensor "
            "'Mileage' (field 'mileage', KILOMETERS, total_increasing; name "
            "'{brand} {model} Mileage' → suffix _mileage; the sibling "
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
    # --- Round 14 (2026-09-25) --------------------------------------------
    "stellantis_vehicles": IntegrationSignature(
        name="Stellantis (Peugeot/Citroën/DS/Opel/Fiat…)",
        verified="2026-09-25 @ andreadegiovine/homeassistant-stellantis-vehicles develop",
        source=(
            "HACS stellantis_vehicles const.py SENSORS_DEFAULT (sensor.py sets "
            "translation_key = key): 'mileage' (odometer.mileage, KILOMETERS, "
            "TOTAL_INCREASING), 'mileage_before_maintenance' (maintenance."
            "mileageBeforeMaintenance, KILOMETERS remaining) and "
            "'days_before_maintenance' (maintenance.daysBeforeMaintenance, "
            "DURATION DAYS remaining) — the car's own service countdowns, so "
            "no editorial 15000 km interval (myskoda precedent)."
        ),
        tasks=(
            ConsumableSignature(("mileage",), "Tire Rotation", "usage_delta", delta_units=10000),
            ConsumableSignature(("days_before_maintenance",), "Annual Service", "duration_left", below_hours=336),
            ConsumableSignature(("mileage_before_maintenance",), "Annual Service", "value_below", delta_units=1000),
        ),
    ),
    "cardata": IntegrationSignature(
        name="BMW CarData (bmw-cardata-ha)",
        verified="2026-09-25 @ kvanbiesen/bmw-cardata-ha main",
        source=(
            "HACS cardata (not in the default store): descriptor "
            "'vehicle.vehicle.travelledDistance' titled 'Vehicle mileage' "
            "(descriptor_titles.py; entity.py names '{vehicle} {title}', no "
            "translation_key → suffix _vehicle_mileage); sensor.py forces "
            "TOTAL_INCREASING for DESC_TRAVELLED_DISTANCE; the unit is the "
            "stream's own (units.py normalises to km/mi) — the unit-aware "
            "threshold converts."
        ),
        tasks=(
            ConsumableSignature(("vehicle_mileage",), "Annual Service", "usage_delta", delta_units=15000),
            ConsumableSignature(("vehicle_mileage",), "Tire Rotation", "usage_delta", delta_units=10000),
        ),
    ),
    "bavariandata": IntegrationSignature(
        name="BavarianData (BMW CarData)",
        verified="2026-09-25 @ JustChr/BavarianData main",
        source=(
            "HACS bavariandata: catalogue descriptor 'vehicle.vehicle."
            "travelledDistance' (descriptor_metadata.py: distance, "
            "total_increasing, km) → keys.translation_key() = "
            "'vehicle_vehicle_travelleddistance' (entity.py). Cars streaming "
            "'vehicle.vehicle.mileage' instead get an uncatalogued name-only "
            "sensor without a fixed unit — deliberately not matched."
        ),
        tasks=(
            ConsumableSignature(("vehicle_vehicle_travelleddistance",), "Annual Service", "usage_delta", delta_units=15000),
            ConsumableSignature(("vehicle_vehicle_travelleddistance",), "Tire Rotation", "usage_delta", delta_units=10000),
        ),
    ),
    "uconnect": IntegrationSignature(
        name="Uconnect (Jeep/Fiat/Chrysler/Dodge/Ram/Alfa Romeo)",
        verified="2026-09-25 @ hass-uconnect/hass-uconnect main",
        source=(
            "HACS uconnect sensor.py (no translation_key; name '{make} "
            "{nickname|model} <name>' → entity_id suffix): 'Odometer' (key "
            "odometer, TOTAL_INCREASING, API unit km/mi), 'Distance to "
            "Service' (distanceToService, remaining), 'Days till service "
            "needed' (daysToService, DAYS remaining) and 'Oil Life' (key "
            "oil_level = py_uconnect oilLevel, PERCENTAGE remaining). The "
            "service countdowns replace the generic odometer service duty."
        ),
        tasks=(
            ConsumableSignature(("odometer",), "Tire Rotation", "usage_delta", delta_units=10000),
            ConsumableSignature(("days_till_service_needed",), "Annual Service", "duration_left", below_hours=336),
            ConsumableSignature(("distance_to_service",), "Annual Service", "value_below", delta_units=1000),
            ConsumableSignature(("oil_life",), "Oil Service", "percent_left"),
        ),
    ),
    "porscheconnect": IntegrationSignature(
        name="Porsche Connect",
        verified="2026-09-25 @ CJNE/ha-porscheconnect main",
        source=(
            "HACS porscheconnect sensor.py: tk 'mileage' (MILEAGE.kilometers, "
            "TOTAL_INCREASING), 'main_service_range'/'main_service_time' "
            "('Next service in', km resp. DAYS remaining) and "
            "'oil_service_range'/'oil_service_time' ('Next oil change in'). "
            "The car's own countdowns replace the generic odometer service "
            "duty; the intermediate-service pair is left out (no duty name)."
        ),
        tasks=(
            ConsumableSignature(("mileage",), "Tire Rotation", "usage_delta", delta_units=10000),
            ConsumableSignature(("main_service_time",), "Annual Service", "duration_left", below_hours=336),
            ConsumableSignature(("main_service_range",), "Annual Service", "value_below", delta_units=1000),
            ConsumableSignature(("oil_service_time",), "Oil Service", "duration_left", below_hours=336),
            ConsumableSignature(("oil_service_range",), "Oil Service", "value_below", delta_units=1000),
        ),
    ),
    "nissan_connect": IntegrationSignature(
        name="Nissan Connect",
        verified="2026-09-25 @ dan-r/HomeAssistant-NissanConnect main",
        source=(
            "HACS nissan_connect sensor.py OdometerSensor (_attr_translation_key "
            "'odometer', DISTANCE, TOTAL_INCREASING, native KILOMETERS with "
            "suggested MILES for imperial accounts)."
        ),
        tasks=(
            ConsumableSignature(("odometer",), "Annual Service", "usage_delta", delta_units=15000),
            ConsumableSignature(("odometer",), "Tire Rotation", "usage_delta", delta_units=10000),
        ),
    ),
    "smartcar": IntegrationSignature(
        name="Smartcar",
        verified="2026-09-25 @ wbyoung/smartcar main",
        source=(
            "HACS smartcar sensor.py: 'Odometer' (key odometer, "
            "odometer-traveleddistance, DISTANCE, TOTAL_INCREASING, native km "
            "with imperial conversion; has_entity_name, no translation_key → "
            "suffix _odometer). 'Engine Oil Life' deliberately NOT matched: "
            "the API's lifeRemaining is passed through without the ×100 the "
            "sibling percent sensors apply — its scale is unverified."
        ),
        tasks=(
            ConsumableSignature(("odometer",), "Annual Service", "usage_delta", delta_units=15000),
            ConsumableSignature(("odometer",), "Tire Rotation", "usage_delta", delta_units=10000),
        ),
    ),
    "lucidmotors": IntegrationSignature(
        name="Lucid Motors",
        verified="2026-09-25 @ borski/ha-lucidmotors main",
        source=(
            "HACS lucidmotors sensor.py: key 'odometer_km' (state.chassis) with "
            "translation_key 'mileage', DISTANCE, KILOMETERS — the lifetime "
            "odometer (declared MEASUREMENT, but only ever grows)."
        ),
        tasks=(
            ConsumableSignature(("mileage",), "Annual Service", "usage_delta", delta_units=15000),
            ConsumableSignature(("mileage",), "Tire Rotation", "usage_delta", delta_units=10000),
        ),
    ),
    "abrp": IntegrationSignature(
        name="ABRP (A Better Routeplanner)",
        verified="2026-09-25 @ MichelFR/ha-abrp main",
        source=("HACS abrp sensor.py: tk 'odometer' (telemetry odometer_km, KILOMETERS, DISTANCE, TOTAL_INCREASING)."),
        tasks=(
            ConsumableSignature(("odometer",), "Annual Service", "usage_delta", delta_units=15000),
            ConsumableSignature(("odometer",), "Tire Rotation", "usage_delta", delta_units=10000),
        ),
    ),
    # Separate domain from pypolestar's polestar_api above.
    "polestar": IntegrationSignature(
        name="Unofficial Polestar",
        verified="2026-09-25 @ kildahldev/unofficial-polestar-api main",
        source=(
            "HACS polestar (kildahldev; domain 'polestar', not polestar_api) "
            "sensor.py, name-based ids (no translation_key): 'Odometer' "
            "(odometer_km, KILOMETERS, TOTAL_INCREASING), 'Distance to "
            "service' (health.distance_to_service_km, remaining) and 'Days to "
            "service' (health.days_to_service, unit 'd'). Countdowns replace "
            "the generic odometer service duty."
        ),
        tasks=(
            ConsumableSignature(("odometer",), "Tire Rotation", "usage_delta", delta_units=10000),
            ConsumableSignature(("days_to_service",), "Annual Service", "duration_left", below_hours=336),
            ConsumableSignature(("distance_to_service",), "Annual Service", "value_below", delta_units=1000),
        ),
    ),
    "specialized_turbo": IntegrationSignature(
        name="Specialized Turbo eBike",
        verified="2026-09-25 @ home-assistant/core dev",
        source=(
            "core specialized_turbo sensor.py (new in 2026.9): tk 'odometer' "
            "(motor.odometer_km, KILOMETERS, DISTANCE, TOTAL_INCREASING). Same "
            "drivetrain duties as Bosch eBike."
        ),
        tasks=(
            ConsumableSignature(("odometer",), "Lubricate Chain", "usage_delta", delta_units=250),
            ConsumableSignature(("odometer",), "Bike Service", "usage_delta", delta_units=2000),
        ),
    ),
    "cowboy": IntegrationSignature(
        name="Cowboy eBike",
        verified="2026-09-25 @ elsbrock/cowboy-ha main",
        source=(
            "HACS cowboy sensor.py: tk 'total_distance' (KILOMETERS, DISTANCE, "
            "TOTAL_INCREASING). Cowboy bikes run a carbon belt drive — no "
            "chain to lubricate, so only the drivetrain service interval."
        ),
        tasks=(ConsumableSignature(("total_distance",), "Bike Service", "usage_delta", delta_units=2000),),
    ),
    "ha_bosch_ebike": IntegrationSignature(
        name="Bosch eBike (Smart System & eBike System 2)",
        verified="2026-09-25 @ Xunil99/ha-bosch-ebike main",
        source=(
            "HACS ha_bosch_ebike (separate domain from bosch_ebike) sensor.py "
            "BoschServiceDueSensor: tk 'service_due_in_km' (km remaining to "
            "the dealer-set/overridden service odometer) and "
            "'service_due_in_days' (unit 'd', days remaining) — created for "
            "every bike, BES2 included. tk 'odometer' (km, driveUnit.odometer "
            "/ 1000) drives the chain duty; translation_keys_authoritative keeps "
            "the suffix fallback from also claiming next_service_odometer and "
            "last_ride_start_odometer (their own translation_keys)."
        ),
        translation_keys_authoritative=True,
        tasks=(
            ConsumableSignature(("service_due_in_days",), "Bike Service", "duration_left", below_hours=336),
            ConsumableSignature(("service_due_in_km",), "Bike Service", "value_below", delta_units=100),
            ConsumableSignature(("odometer",), "Lubricate Chain", "usage_delta", delta_units=250),
        ),
    ),
}
