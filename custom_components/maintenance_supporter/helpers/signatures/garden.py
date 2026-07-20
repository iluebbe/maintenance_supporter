"""Robot lawn mowers.

Data module of the suggested-setups signature catalog — see
``helpers/signatures/_model.py`` for the direction semantics and the
method contract (every entry cites and is verified against the
integration's source; drift-probed weekly)."""

from __future__ import annotations

from ._model import ConsumableSignature, IntegrationSignature

SIGNATURES: dict[str, IntegrationSignature] = {
    "husqvarna_automower": IntegrationSignature(
        name="Husqvarna Automower",
        verified="2026-07-17 @ home-assistant/core dev",
        source=(
            "home-assistant/core homeassistant/components/husqvarna_automower/sensor.py "
            "(translation_key 'cutting_blade_usage_time', DURATION s→h; matching reset button exists)"
        ),
        tasks=(
            ConsumableSignature(("cutting_blade_usage_time",), "Replace Blades", "usage_above"),
            # Lifetime statistics sensors (SECONDS, suggested h) carry two more
            # duties: undercarriage washing by mowing time, contact cleaning by
            # docking cycles (unitless counter -> delta target is the count).
            ConsumableSignature(("total_cutting_time",), "Clean Undercarriage", "usage_delta", delta_units=25),
            ConsumableSignature(
                ("number_of_charging_cycles",),
                "Clean Charging Contacts",
                "usage_delta",
                delta_units=100,
            ),
        ),
    ),
    "landroid_cloud": IntegrationSignature(
        name="Worx Landroid",
        verified="2026-07-17 @ MTrab/landroid_cloud master",
        source=(
            "MTrab/landroid_cloud custom_components/landroid_cloud/sensor.py "
            "(translation_key 'blade_runtime_current' — since last reset, DURATION min→h)"
        ),
        tasks=(
            ConsumableSignature(("blade_runtime_current",), "Replace Blades", "usage_above"),
            ConsumableSignature(("mower_runtime_total",), "Clean Undercarriage", "usage_delta", delta_units=25),
        ),
    ),
    "gardena_smart_system": IntegrationSignature(
        name="Gardena Smart System",
        verified="2026-07-18 @ py-smart-gardena/hass-gardena-smart-system master",
        source=(
            "py-smart-gardena/hass-gardena-smart-system sensor.py "
            "GardenaMowerOperatingHoursSensor (entity_id "
            "'{device.id}_{service.id}_operating_hours', UnitOfTime.HOURS, "
            "TOTAL_INCREASING lifetime — no reset anywhere) → usage_delta."
        ),
        tasks=(
            # Sileno mowers: pivoting razor blades wear by mowing time — every
            # 100 operating hours since the last change (delta re-baselines on
            # completion, matching the Husqvarna default).
            ConsumableSignature(("operating_hours",), "Replace Blades", "usage_delta", delta_units=100),
            ConsumableSignature(("operating_hours",), "Clean Undercarriage", "usage_delta", delta_units=25),
        ),
    ),
    # Same source entity, second duty — the matcher allows multi-duty.
    "navimow": IntegrationSignature(
        name="Segway Navimow",
        verified="2026-07-18 @ pgoutsos/NavimowHA main",
        source=(
            "pgoutsos/NavimowHA lawn_mower.py (one LawnMower entity per "
            "device) + const.py MOWER_STATUS_TO_ACTIVITY ('mowing' → "
            "LawnMowerActivity.MOWING). The integration exposes NO usage "
            "counter — the ENGINE accumulates mowing time itself via the "
            "runtime trigger on the lawn_mower entity."
        ),
        tasks=(
            ConsumableSignature(
                (),
                "Replace Blades",
                "runtime_hours",
                delta_units=100,
                entity_domain="lawn_mower",
                on_states=("mowing",),
            ),
            ConsumableSignature(
                (),
                "Clean Undercarriage",
                "runtime_hours",
                delta_units=25,
                entity_domain="lawn_mower",
                on_states=("mowing",),
            ),
        ),
    ),
    "husqvarna_automower_ble": IntegrationSignature(
        name="Husqvarna Automower BLE",
        verified="2026-07-18 @ home-assistant/core dev",
        source=(
            "home-assistant/core homeassistant/components/husqvarna_automower_ble/"
            "lawn_mower.py (lawn_mower entity; the BLE variant exposes no blade "
            "counter) — the ENGINE accumulates mowing time."
        ),
        tasks=(
            ConsumableSignature(
                (),
                "Replace Blades",
                "runtime_hours",
                delta_units=100,
                entity_domain="lawn_mower",
                on_states=("mowing",),
            ),
            ConsumableSignature(
                (),
                "Clean Undercarriage",
                "runtime_hours",
                delta_units=25,
                entity_domain="lawn_mower",
                on_states=("mowing",),
            ),
        ),
    ),
    "rainbird": IntegrationSignature(
        name="Rain Bird irrigation",
        verified="2026-07-20 @ home-assistant/core dev",
        source=(
            "core rainbird: switch.py creates one irrigation-zone switch per "
            "zone, each on its own 'Rain Bird Sprinkler <n>' device (single "
            "switch entity per device). No consumable sensors; the rainsensor "
            "binary carries no device_class (not adoptable) and raindelay is "
            "operational — the ENGINE accumulates actual watering time on the "
            "zone switch instead. Cadence per Rain Bird's maintenance "
            "guidance: inspect/clean heads and (drip) filters at least once a "
            "season — ~30 h of watering at typical in-season use."
        ),
        tasks=(
            ConsumableSignature(
                (),
                "Clean Sprinkler Heads",
                "runtime_hours",
                delta_units=30,
                entity_domain="switch",
                on_states=("on",),
            ),
        ),
    ),
}
