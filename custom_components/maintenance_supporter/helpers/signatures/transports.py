"""Protocol/hub transports whose duties are entity-domain-gated.

Data module of the suggested-setups signature catalog — see
``helpers/signatures/_model.py`` for the direction semantics and the
method contract (every entry cites and is verified against the
integration's source; drift-probed weekly)."""

from __future__ import annotations

from ._model import IntegrationSignature
from ._shared import (
    LOCK_CYLINDER_CYCLES,
    MOWER_BLADES_RUNTIME,
    MOWER_UNDERCARRIAGE_RUNTIME,
    VACUUM_FILTER_CLEANING_RUNTIME,
    VACUUM_MAIN_BRUSH_RUNTIME,
)

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
            LOCK_CYLINDER_CYCLES,
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
            LOCK_CYLINDER_CYCLES,
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
            LOCK_CYLINDER_CYCLES,
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
            LOCK_CYLINDER_CYCLES,
            VACUUM_FILTER_CLEANING_RUNTIME,
            VACUUM_MAIN_BRUSH_RUNTIME,
            MOWER_BLADES_RUNTIME,
            MOWER_UNDERCARRIAGE_RUNTIME,
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
            LOCK_CYLINDER_CYCLES,
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
            LOCK_CYLINDER_CYCLES,
        ),
    ),
}
