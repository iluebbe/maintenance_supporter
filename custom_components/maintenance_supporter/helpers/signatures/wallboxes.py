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
        tasks=(
            ConsumableSignature(
                ("total_energy",), "Inspect Cable and Plug", "usage_delta", delta_units=5000
            ),
        ),
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
        tasks=(
            ConsumableSignature(
                ("eto",), "Inspect Cable and Plug", "usage_delta", delta_units=5000
            ),
        ),
    ),
    "openevse": IntegrationSignature(
        name="OpenEVSE",
        verified="2026-07-18 @ home-assistant/core dev",
        source=(
            "home-assistant/core homeassistant/components/openevse/sensor.py "
            "(translation_key 'usage_total', kWh lifetime; usage_session is "
            "per-session and deliberately not used)."
        ),
        tasks=(
            ConsumableSignature(
                ("usage_total",), "Inspect Cable and Plug", "usage_delta", delta_units=5000
            ),
        ),
    ),
}
