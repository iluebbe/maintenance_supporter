"""EV chargers — cable/plug inspection by delivered energy.

Data module of the suggested-setups signature catalog — see
``helpers/signatures/_model.py`` for the direction semantics and the
method contract (every entry cites and is verified against the
integration's source; drift-probed weekly)."""

from __future__ import annotations

from ._model import ConsumableSignature, IntegrationSignature
from ._shared import CHARGER_CABLE_ETO, CHARGER_CABLE_LIFETIME_ENERGY, CHARGER_CABLE_TOTAL_ENERGY

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
            CHARGER_CABLE_LIFETIME_ENERGY,
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
        tasks=(CHARGER_CABLE_TOTAL_ENERGY,),
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
        tasks=(CHARGER_CABLE_ETO,),
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
        tasks=(CHARGER_CABLE_LIFETIME_ENERGY,),
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
        tasks=(CHARGER_CABLE_TOTAL_ENERGY,),
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
        tasks=(CHARGER_CABLE_TOTAL_ENERGY,),
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
        tasks=(CHARGER_CABLE_ETO,),
    ),
    # --- Round 16 (2026-10-03) --------------------------------------------
    "wattpilot": IntegrationSignature(
        name="Fronius Wattpilot",
        verified="2026-10-03 @ mk-maddin/wattpilot-HA master (507a066)",
        source=(
            "HACS wattpilot (custom repository) sensor.yaml: property 'eto' ('Totally Charged' — "
            "'Totally charged power', device_class energy, state_class total, unit Wh; the go-e API "
            "lifetime energy the catalogued go-e entries use); entities.py names it "
            "f'{charger} Totally Charged' (no has_entity_name, no translation_key) → suffix "
            "_totally_charged. The unit map converts the 5,000 kWh target into Wh. 'wh' ('Connection "
            "Charged', energy since the car was connected) is per session — not used."
        ),
        tasks=(ConsumableSignature(("totally_charged",), "Inspect Cable and Plug", "usage_delta", delta_units=5000),),
    ),
    # ─── Round 17 (2026-10-25) ───────────────────────────────────────────
    "evcc_intg": IntegrationSignature(
        name="evcc",
        verified="2026-10-25 @ marq24/ha-evcc main (395c3a9)",
        source=(
            "HACS evcc_intg pyevcc_ha/keys.py Tag CHARGETOTALIMPORT (json_key "
            "'chargeTotalImport', per loadpoint); sensor.py sets the translation_key "
            "to the lower-cased json_key → 'chargetotalimport' (kWh, ENERGY, "
            "TOTAL_INCREASING; sensor.py never publishes a value below the previous "
            "one) — the charger meter's lifetime reading. One device per loadpoint "
            "when there are several. 'chargedenergy' (session) and the site "
            "'stattotalchargedkwh' (evcc's session database, all loadpoints) are not "
            "used. A loadpoint driving a heater or switch carries the counter too "
            "and cannot be told apart (model 'Loadpoint <name>')."
        ),
        tasks=(ConsumableSignature(("chargetotalimport",), "Inspect Cable and Plug", "usage_delta", delta_units=5000),),
    ),
    "ocpp": IntegrationSignature(
        name="OCPP charge points",
        verified="2026-10-25 @ lbbrhzn/ocpp main (0fdf24b)",
        source=(
            "HACS ocpp sensor.py: the default measurand Energy.Active.Import.Register "
            "(const.py DEFAULT_MEASURAND) is created per charge point and connector "
            "without translation_key or has_entity_name, entity id forced to "
            "sensor.<cpid>[_connector_<n>]_energy_active_import_register (kWh, "
            "ENERGY, TOTAL_INCREASING). The 2026-07 round skipped it because some "
            "chargers report SESSION energy as this register; chargepoint.py now "
            "detects those (meter_start 0, a sample below meter_start) and routes "
            "the transaction samples to session_energy instead, so the register "
            "stays the lifetime meter (ocppv201.py: 'lifetime energy'). On such a "
            "charger it only moves on samples outside a transaction, so the "
            "interval can lag — it never runs backwards."
        ),
        tasks=(ConsumableSignature(("energy_active_import_register",), "Inspect Cable and Plug", "usage_delta", delta_units=5000),),
    ),
}
