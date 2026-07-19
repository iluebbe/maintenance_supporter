"""Protocol/hub transports whose duties are entity-domain-gated.

Data module of the suggested-setups signature catalog — see
``helpers/signatures/_model.py`` for the direction semantics and the
method contract (every entry cites and is verified against the
integration's source; drift-probed weekly)."""

from __future__ import annotations

from ._model import ConsumableSignature, IntegrationSignature

SIGNATURES: dict[str, IntegrationSignature] = {
    "matter": IntegrationSignature(
        name="Matter lock",
        verified="2026-07-18 @ home-assistant/core dev",
        source=(
            "home-assistant/core homeassistant/components/matter/lock.py "
            "(MatterLock, lock domain entity per device). Matter bridges many "
            "device types — the lock entity_domain restricts this signature "
            "to locks; every transition to 'locked' is one mechanical cycle."
        ),
        tasks=(
            ConsumableSignature(
                (),
                "Lubricate Cylinder",
                "cycle_count",
                delta_units=500,
                entity_domain="lock",
                on_states=("locked",),
            ),
        ),
    ),
    "zwave_js": IntegrationSignature(
        name="Z-Wave lock",
        verified="2026-07-18 @ home-assistant/core dev",
        source=(
            "home-assistant/core homeassistant/components/zwave_js/lock.py "
            "(lock platform verified present). Locks carry no wear sensor — "
            "the ENGINE counts locking cycles; entity_domain-gated to locks, so the bridge's other device types are untouched."
        ),
        tasks=(
            ConsumableSignature(
                (),
                "Lubricate Cylinder",
                "cycle_count",
                delta_units=500,
                entity_domain="lock",
                on_states=("locked",),
            ),
        ),
    ),
    "zha": IntegrationSignature(
        name="Zigbee (ZHA) lock",
        verified="2026-07-18 @ home-assistant/core dev",
        source=(
            "home-assistant/core homeassistant/components/zha/lock.py "
            "(lock platform verified present). Locks carry no wear sensor — "
            "the ENGINE counts locking cycles; entity_domain-gated to locks, so the bridge's other device types are untouched."
        ),
        tasks=(
            ConsumableSignature(
                (),
                "Lubricate Cylinder",
                "cycle_count",
                delta_units=500,
                entity_domain="lock",
                on_states=("locked",),
            ),
        ),
    ),
    "mqtt": IntegrationSignature(
        name="MQTT lock (Zigbee2MQTT etc.)",
        verified="2026-07-18 @ home-assistant/core dev",
        source=(
            "home-assistant/core homeassistant/components/mqtt/lock.py "
            "(lock platform verified present). Locks carry no wear sensor — "
            "the ENGINE counts locking cycles; entity_domain-gated to locks, so the bridge's other device types are untouched."
        ),
        tasks=(
            ConsumableSignature(
                (),
                "Lubricate Cylinder",
                "cycle_count",
                delta_units=500,
                entity_domain="lock",
                on_states=("locked",),
            ),
            ConsumableSignature(
                (), "Filter Cleaning", "runtime_hours", delta_units=15,
                entity_domain="vacuum", on_states=("cleaning",),
            ),
            ConsumableSignature(
                (), "Clean Main Brush", "runtime_hours", delta_units=30,
                entity_domain="vacuum", on_states=("cleaning",),
            ),
            ConsumableSignature(
                (), "Replace Blades", "runtime_hours", delta_units=100,
                entity_domain="lawn_mower", on_states=("mowing",),
            ),
            ConsumableSignature(
                (), "Clean Undercarriage", "runtime_hours", delta_units=25,
                entity_domain="lawn_mower", on_states=("mowing",),
            ),
        ),
    ),
            # MQTT vacuums (Valetudo!) and mowers (OpenMower) expose only
            # state entities — engine-accumulated usage covers their duties.
    "homekit_controller": IntegrationSignature(
        name="HomeKit lock",
        verified="2026-07-18 @ home-assistant/core dev",
        source=(
            "home-assistant/core homeassistant/components/homekit_controller/lock.py "
            "(lock platform verified present). Locks carry no wear sensor — "
            "the ENGINE counts locking cycles; entity_domain-gated to locks, so the bridge's other device types are untouched."
        ),
        tasks=(
            ConsumableSignature(
                (),
                "Lubricate Cylinder",
                "cycle_count",
                delta_units=500,
                entity_domain="lock",
                on_states=("locked",),
            ),
        ),
    ),
    "deconz": IntegrationSignature(
        name="deCONZ (Zigbee) lock",
        verified="2026-07-18 @ home-assistant/core dev",
        source=(
            "home-assistant/core homeassistant/components/deconz/lock.py "
            "(lock platform verified present) — engine-counted locking cycles, entity_domain-gated so the bridge's other device types are untouched."
        ),
        tasks=(
            ConsumableSignature(
                (), "Lubricate Cylinder", "cycle_count", delta_units=500,
                entity_domain="lock", on_states=("locked",),
            ),
        ),
    ),
}
