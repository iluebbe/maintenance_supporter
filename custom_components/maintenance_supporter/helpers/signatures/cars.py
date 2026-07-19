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
        source=(
            "home-assistant/core homeassistant/components/subaru/sensor.py "
            "(key sc.ODOMETER, translation_key 'odometer')."
        ),
        tasks=(
            ConsumableSignature(("odometer",), "Annual Service", "usage_delta", delta_units=15000),
            ConsumableSignature(("odometer",), "Tire Rotation", "usage_delta", delta_units=10000),
        ),
    ),
    "volvo": IntegrationSignature(
        name="Volvo",
        verified="2026-07-18 @ home-assistant/core dev",
        source=(
            "home-assistant/core homeassistant/components/volvo/sensor.py "
            "(key 'odometer', api_field 'odometer')."
        ),
        tasks=(
            ConsumableSignature(("odometer",), "Annual Service", "usage_delta", delta_units=15000),
            ConsumableSignature(("odometer",), "Tire Rotation", "usage_delta", delta_units=10000),
        ),
    ),
}
