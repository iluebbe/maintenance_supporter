"""Smart locks — cycle-count lubrication duties.

Interval audit 2026-07-19: Nuki's official guidance is ANNUAL cylinder
lubrication — 2,000 cycles ≈ a year at a typical main door (5-6
cycles/day); heavy doors reach it sooner, matching wear.

Data module of the suggested-setups signature catalog — see
``helpers/signatures/_model.py`` for the direction semantics and the
method contract (every entry cites and is verified against the
integration's source; drift-probed weekly)."""

from __future__ import annotations

from ._model import ConsumableSignature, IntegrationSignature

SIGNATURES: dict[str, IntegrationSignature] = {
    "nuki": IntegrationSignature(
        name="Nuki Smart Lock",
        verified="2026-07-18 @ home-assistant/core dev",
        source=(
            "home-assistant/core homeassistant/components/nuki/lock.py "
            "(NukiLockEntity, one lock entity per device). No wear sensor — "
            "the ENGINE counts locking cycles on the lock entity."
        ),
        tasks=(
            ConsumableSignature(
                (),
                "Lubricate Cylinder",
                "cycle_count",
                delta_units=2000,
                entity_domain="lock",
                on_states=("locked",),
            ),
        ),
    ),
    "tedee": IntegrationSignature(
        name="Tedee Smart Lock",
        verified="2026-07-18 @ home-assistant/core dev",
        source=(
            "home-assistant/core homeassistant/components/tedee/lock.py "
            "(lock platform verified present). Locks carry no wear sensor — "
            "the ENGINE counts locking cycles; entity_domain-gated to locks."
        ),
        tasks=(
            ConsumableSignature(
                (),
                "Lubricate Cylinder",
                "cycle_count",
                delta_units=2000,
                entity_domain="lock",
                on_states=("locked",),
            ),
        ),
    ),
    "august": IntegrationSignature(
        name="August lock",
        verified="2026-07-18 @ home-assistant/core dev",
        source=(
            "home-assistant/core homeassistant/components/august/lock.py "
            "(lock platform verified present). Locks carry no wear sensor — "
            "the ENGINE counts locking cycles; entity_domain-gated to locks."
        ),
        tasks=(
            ConsumableSignature(
                (),
                "Lubricate Cylinder",
                "cycle_count",
                delta_units=2000,
                entity_domain="lock",
                on_states=("locked",),
            ),
        ),
    ),
    "yale": IntegrationSignature(
        name="Yale lock",
        verified="2026-07-18 @ home-assistant/core dev",
        source=(
            "home-assistant/core homeassistant/components/yale/lock.py "
            "(lock platform verified present). Locks carry no wear sensor — "
            "the ENGINE counts locking cycles; entity_domain-gated to locks."
        ),
        tasks=(
            ConsumableSignature(
                (),
                "Lubricate Cylinder",
                "cycle_count",
                delta_units=2000,
                entity_domain="lock",
                on_states=("locked",),
            ),
        ),
    ),
    "switchbot": IntegrationSignature(
        name="SwitchBot Lock",
        verified="2026-07-18 @ home-assistant/core dev",
        source=(
            "home-assistant/core homeassistant/components/switchbot/lock.py "
            "(lock platform verified present). Locks carry no wear sensor — "
            "the ENGINE counts locking cycles; entity_domain-gated to locks."
        ),
        tasks=(
            ConsumableSignature(
                (),
                "Lubricate Cylinder",
                "cycle_count",
                delta_units=2000,
                entity_domain="lock",
                on_states=("locked",),
            ),
        ),
    ),
    "loqed": IntegrationSignature(
        name="LOQED Smart Lock",
        verified="2026-07-18 @ home-assistant/core dev",
        source=(
            "home-assistant/core homeassistant/components/loqed/lock.py "
            "(lock platform verified present). Locks carry no wear sensor — "
            "the ENGINE counts locking cycles; entity_domain-gated to locks."
        ),
        tasks=(
            ConsumableSignature(
                (),
                "Lubricate Cylinder",
                "cycle_count",
                delta_units=2000,
                entity_domain="lock",
                on_states=("locked",),
            ),
        ),
    ),
    "homematicip_cloud": IntegrationSignature(
        name="Homematic IP lock",
        verified="2026-07-18 @ home-assistant/core dev",
        source=(
            "home-assistant/core homeassistant/components/homematicip_cloud/lock.py "
            "(lock platform verified present). Locks carry no wear sensor — "
            "the ENGINE counts locking cycles; entity_domain-gated to locks."
        ),
        tasks=(
            ConsumableSignature(
                (),
                "Lubricate Cylinder",
                "cycle_count",
                delta_units=2000,
                entity_domain="lock",
                on_states=("locked",),
            ),
        ),
    ),
    "schlage": IntegrationSignature(
        name="Schlage lock",
        verified="2026-07-18 @ home-assistant/core dev",
        source=(
            "home-assistant/core homeassistant/components/schlage/lock.py "
            "(lock platform verified present) — engine-counted locking cycles."
        ),
        tasks=(
            ConsumableSignature(
                (), "Lubricate Cylinder", "cycle_count", delta_units=2000,
                entity_domain="lock", on_states=("locked",),
            ),
        ),
    ),
    "sesame": IntegrationSignature(
        name="Sesame lock",
        verified="2026-07-18 @ home-assistant/core dev",
        source=(
            "home-assistant/core homeassistant/components/sesame/lock.py "
            "(lock platform verified present) — engine-counted locking cycles."
        ),
        tasks=(
            ConsumableSignature(
                (), "Lubricate Cylinder", "cycle_count", delta_units=2000,
                entity_domain="lock", on_states=("locked",),
            ),
        ),
    ),
    "yalexs_ble": IntegrationSignature(
        name="Yale/August BLE lock",
        verified="2026-07-18 @ home-assistant/core dev",
        source=(
            "home-assistant/core homeassistant/components/yalexs_ble/lock.py "
            "(lock platform verified present) — engine-counted locking cycles."
        ),
        tasks=(
            ConsumableSignature(
                (), "Lubricate Cylinder", "cycle_count", delta_units=2000,
                entity_domain="lock", on_states=("locked",),
            ),
        ),
    ),
    "dormakaba_dkey": IntegrationSignature(
        name="dormakaba dKey lock",
        verified="2026-07-18 @ home-assistant/core dev",
        source=(
            "home-assistant/core homeassistant/components/dormakaba_dkey/lock.py "
            "(lock platform verified present) — engine-counted locking cycles."
        ),
        tasks=(
            ConsumableSignature(
                (), "Lubricate Cylinder", "cycle_count", delta_units=2000,
                entity_domain="lock", on_states=("locked",),
            ),
        ),
    ),
    "homematic": IntegrationSignature(
        name="Homematic KeyMatic",
        verified="2026-07-18 @ home-assistant/core dev",
        source=(
            "home-assistant/core homeassistant/components/homematic/lock.py "
            "(lock platform verified present) — engine-counted locking cycles, entity_domain-gated so the hub's other device types are untouched."
        ),
        tasks=(
            ConsumableSignature(
                (), "Lubricate Cylinder", "cycle_count", delta_units=2000,
                entity_domain="lock", on_states=("locked",),
            ),
        ),
    ),
}
