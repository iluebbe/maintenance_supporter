"""EV chargers — cable/plug inspection by delivered energy.

Data module of the suggested-setups signature catalog — see
``helpers/signatures/_model.py`` for the direction semantics and the
method contract (every entry cites and is verified against the
integration's source; drift-probed weekly)."""

from __future__ import annotations

from ._model import ConsumableSignature, IntegrationSignature

SIGNATURES: dict[str, IntegrationSignature] = {
    "easee": IntegrationSignature(
        name="Easee Wallbox",
        verified="2026-07-18 @ nordicopen/easee_hass master",
        source=(
            "nordicopen/easee_hass const.py 'lifetime_energy' "
            "(state.lifetimeEnergy, translation_key 'lifetime_energy', kWh "
            "lifetime counter) → cable/plug inspection by delivered energy. "
            "Core `wallbox` verified NEGATIVE: its added_energy is per-session."
        ),
        tasks=(
            ConsumableSignature(
                ("lifetime_energy",),
                "Inspect Cable and Plug",
                "usage_delta",
                delta_units=5000,
            ),
        ),
    ),
    "keba": IntegrationSignature(
        name="KEBA Wallbox",
        verified="2026-07-18 @ home-assistant/core dev",
        source=(
            "home-assistant/core homeassistant/components/keba/sensor.py "
            "('E total' description, name 'Total Energy' → entity_id suffix "
            "_total_energy, kWh, TOTAL_INCREASING lifetime)."
        ),
        tasks=(ConsumableSignature(("total_energy",), "Inspect Cable and Plug", "usage_delta", delta_units=5000),),
    ),
    "goecharger_api2": IntegrationSignature(
        name="go-e Charger",
        verified="2026-07-18 @ marq24/ha-goecharger-api2 main",
        source=(
            "marq24/ha-goecharger-api2 const.py Tag.ETO sensor (key 'eto', "
            "native WATT_HOUR with suggested kWh display, TOTAL_INCREASING "
            "lifetime energy) — the unit map converts the 5,000 kWh target "
            "into the live display unit."
        ),
        tasks=(ConsumableSignature(("eto",), "Inspect Cable and Plug", "usage_delta", delta_units=5000),),
    ),
    "openevse": IntegrationSignature(
        name="OpenEVSE",
        verified="2026-07-18 @ home-assistant/core dev",
        source=(
            "home-assistant/core homeassistant/components/openevse/sensor.py "
            "(translation_key 'usage_total', kWh lifetime; usage_session is "
            "per-session and deliberately not used)."
        ),
        tasks=(ConsumableSignature(("usage_total",), "Inspect Cable and Plug", "usage_delta", delta_units=5000),),
    ),
    # --- Round 14 (2026-09-25) --------------------------------------------
    "tesla_wall_connector": IntegrationSignature(
        name="Tesla Wall Connector",
        verified="2026-09-25 @ home-assistant/core dev",
        source=(
            "core tesla_wall_connector sensor.py: key 'energy_kWh' with "
            "translation_key 'energy_kwh' since 2026.8 ('Lifetime energy', "
            "lifetime.energy_wh, native WATT_HOUR, suggested kWh, ENERGY, "
            "TOTAL_INCREASING). The per-session 'session_energy_wh' is not "
            "used."
        ),
        tasks=(ConsumableSignature(("energy_kwh",), "Inspect Cable and Plug", "usage_delta", delta_units=5000),),
    ),
    "nexblue": IntegrationSignature(
        name="NexBlue",
        verified="2026-09-25 @ home-assistant/core dev",
        source=(
            "core nexblue sensor.py (new in 2026.9): tk 'lifetime_energy' "
            "(status.lifetime_energy_kwh, KILO_WATT_HOUR, TOTAL_INCREASING); "
            "the sibling 'energy' (state_class TOTAL) is the session value."
        ),
        tasks=(ConsumableSignature(("lifetime_energy",), "Inspect Cable and Plug", "usage_delta", delta_units=5000),),
    ),
    "silla_prism": IntegrationSignature(
        name="Silla Prism",
        verified="2026-09-25 @ home-assistant/core dev",
        source=(
            "core silla_prism sensor.py (new in 2026.9): tk 'total_energy' "
            "(port total_energy = pysillaprism 'wh_total' topic, 'lifetime "
            "energy delivered, in watt-hours', WATT_HOUR, TOTAL_INCREASING); "
            "'session_energy' ('wh' topic) is per session."
        ),
        tasks=(ConsumableSignature(("total_energy",), "Inspect Cable and Plug", "usage_delta", delta_units=5000),),
    ),
    "besen": IntegrationSignature(
        name="Besen EV charger",
        verified="2026-09-25 @ home-assistant/core dev",
        source=(
            "core besen sensor.py (sensor platform on dev, i.e. 2026.10): tk "
            "'total_energy' (charge.total_energy, KILO_WATT_HOUR, "
            "TOTAL_INCREASING — the besen library README: 'Total energy for "
            "cumulative consumption'); 'session_energy' resets per session."
        ),
        tasks=(ConsumableSignature(("total_energy",), "Inspect Cable and Plug", "usage_delta", delta_units=5000),),
    ),
    "peblar": IntegrationSignature(
        name="Peblar",
        verified="2026-09-25 @ home-assistant/core dev",
        source=(
            "core peblar sensor.py: tk 'energy_total' ('Lifetime energy', "
            "meter.energy_total, native WATT_HOUR, suggested kWh, "
            "TOTAL_INCREASING, diagnostic); 'energy_session' is per session."
        ),
        tasks=(ConsumableSignature(("energy_total",), "Inspect Cable and Plug", "usage_delta", delta_units=5000),),
    ),
    "zaptec": IntegrationSignature(
        name="Zaptec EV charger",
        verified="2026-09-25 @ custom-components/zaptec master",
        source=(
            "HACS zaptec sensor.py: key 'signed_meter_value_kwh' with tk "
            "'signed_meter_value' ('Energy meter', ZaptecEnengySensor — the "
            "max OCMF meter reading (RV) of signed_meter_value/completed_"
            "session, KILO_WATT_HOUR, TOTAL_INCREASING): the charger's own "
            "metering register, i.e. lifetime delivered energy."
        ),
        tasks=(ConsumableSignature(("signed_meter_value",), "Inspect Cable and Plug", "usage_delta", delta_units=5000),),
    ),
    "goecharger_mqtt": IntegrationSignature(
        name="go-eCharger (MQTT)",
        verified="2026-09-25 @ syssi/homeassistant-goecharger-mqtt main",
        source=(
            "HACS goecharger_mqtt definitions/sensor.py key 'eto' ('Total "
            "energy', WATT_HOUR, TOTAL_INCREASING); entity.py derives "
            "translation_key = key.lower() (attribute '') and entity_id "
            "'<topic>_eto'. The disabled 'etop' (persisted) is not used."
        ),
        tasks=(ConsumableSignature(("eto",), "Inspect Cable and Plug", "usage_delta", delta_units=5000),),
    ),
}
