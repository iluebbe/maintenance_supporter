"""Smart locks — cycle-count lubrication duties.

The SwitchBot entry also carries its Air Purifier's filter: a domain lives in
exactly one module.

Interval audit 2026-07-19: Nuki's official guidance is ANNUAL cylinder
lubrication — 2,000 cycles ≈ a year at a typical main door (5-6
cycles/day); heavy doors reach it sooner, matching wear.

Data module of the suggested-setups signature catalog — see
``helpers/signatures/_model.py`` for the direction semantics and the
method contract (every entry cites and is verified against the
integration's source; drift-probed weekly)."""

from __future__ import annotations

from ._model import ConsumableSignature, IntegrationSignature
from ._shared import LOCK_CYLINDER_CYCLES, LOCK_CYLINDER_CYCLES_NO_OPENER

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
            LOCK_CYLINDER_CYCLES,
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
            LOCK_CYLINDER_CYCLES,
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
            LOCK_CYLINDER_CYCLES,
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
            LOCK_CYLINDER_CYCLES,
        ),
    ),
    "switchbot": IntegrationSignature(
        name="SwitchBot",
        verified="2026-07-18 @ home-assistant/core dev; purifier filter 2026-10-25 @ core dev (2026.11)",
        source=(
            "home-assistant/core homeassistant/components/switchbot/lock.py "
            "(lock platform verified present). Locks carry no wear sensor — "
            "the ENGINE counts locking cycles; entity_domain-gated to locks. "
            "2026.11: the Air Purifier's sensor.py 'filter element working time' "
            "(tk 'filter_usage', HOURS, DURATION — the filter's working time, "
            "counting up) with button.py ResetFilterUsageButton (tk "
            "'reset_filter_usage', CONFIG; pySwitchbot reset_filter_usage() "
            "verifies the zero readback) → usage_above with the reset wired. "
            "The library defines no filter lifetime; 2160 h ≈ SwitchBot's "
            "3–6-month replacement advice at round-the-clock to half-day use."
        ),
        tasks=(
            LOCK_CYLINDER_CYCLES,
            ConsumableSignature(
                ("filter_usage",),
                "Replace Filter",
                "usage_above",
                above_hours=2160,
                resets=(("filter_usage", "reset_filter_usage"),),
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
            LOCK_CYLINDER_CYCLES,
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
            LOCK_CYLINDER_CYCLES,
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
            LOCK_CYLINDER_CYCLES,
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
            LOCK_CYLINDER_CYCLES,
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
            LOCK_CYLINDER_CYCLES,
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
            LOCK_CYLINDER_CYCLES,
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
            LOCK_CYLINDER_CYCLES,
        ),
    ),
    # --- Round 14 (2026-09-25) --------------------------------------------
    "wyzeapi": IntegrationSignature(
        name="Wyze Lock",
        verified="2026-09-25 @ SecKatie/ha-wyzeapi master",
        source=(
            "HACS wyzeapi lock.py (WyzeLock for DeviceTypes.LOCK, WyzeLockBolt "
            "for YD_BT1 — one lock entity per lock device). Engine-counted "
            "locking cycles; entity_domain-gated so the hub's cameras/plugs "
            "are untouched."
        ),
        tasks=(
            LOCK_CYLINDER_CYCLES,
        ),
    ),
    "ttlock": IntegrationSignature(
        name="TTLock",
        verified="2026-09-25 @ jbergler/hass-ttlock develop",
        source=(
            "HACS ttlock lock.py (one Lock entity per lock coordinator, "
            "is_locked from the lock state) — engine-counted locking cycles."
        ),
        tasks=(
            LOCK_CYLINDER_CYCLES,
        ),
    ),
    "kwikset": IntegrationSignature(
        name="Kwikset Smart Locks",
        verified="2026-09-25 @ explosivo22/kwikset-ha main",
        source=(
            "HACS kwikset (not in the default store) lock.py: 'Each physical "
            "lock device exposes a single LockEntity' (KwiksetLock) — "
            "engine-counted locking cycles."
        ),
        tasks=(
            LOCK_CYLINDER_CYCLES,
        ),
    ),
    "nuki_web": IntegrationSignature(
        name="Nuki Web",
        verified="2026-09-25 @ ArnyminerZ/ha-nuki-web master",
        source=(
            "HACS nuki_web lock.py: one NukiLockEntity per smartlock_id — Nuki "
            "OPENERS (type 2) are lock entities too and report 'locked' "
            "whenever the opener is merely online, so they are excluded via "
            "the device model entity.py derives from the type ('Opener')."
        ),
        tasks=(
            LOCK_CYLINDER_CYCLES_NO_OPENER,
        ),
    ),
    # --- Round 17 (2026-10-25) --------------------------------------------
    "homematicip_local": IntegrationSignature(
        name="Homematic(IP) Local",
        verified="2026-10-25 @ SukramJ/homematicip_local main (9792bef, 2.12.1) + SukramJ/aiohomematic main (7d122a5)",
        source=(
            "HACS homematicip_local lock.py adds a lock entity for every DataPointType.LOCK data "
            "point; aiohomematic model/custom/lock.py registers the door locks HM-Sec-Key "
            "(KeyMatic, CustomDpRfLock), HmIP-DLD and HmIP-DLP (CustomDpIpLock, is_locked = "
            "LOCK_STATE == 'LOCKED') — but ALSO the keypad/button locks of thermostats and "
            "actuators (CustomDpButtonLock: HmIP-eTRV, HmIP-WTH, HmIP-BWTH, ALPHA-IP-RBG, …) as "
            "lock entities. Gated to the door-lock models (device model = hm_device.model). The "
            "DLD/DLP also carry a button lock (tk 'button_lock', CONFIG, disabled by default) on "
            "the same device; only a user who enables it adds it to the cycle count."
        ),
        tasks=(
            ConsumableSignature(
                (),
                "Lubricate Cylinder",
                "cycle_count",
                delta_units=2000,
                entity_domain="lock",
                on_states=("locked",),
                models=("HmIP-DLD", "HmIP-DLP", "HM-Sec-Key"),
            ),
        ),
    ),
    "eufy_security": IntegrationSignature(
        name="Eufy Security (locks)",
        verified="2026-10-25 @ fuatakgun/eufy_security master (cf19868, v8.2.5)",
        source=(
            "HACS eufy_security lock.py: one EufySecurityLock per device whose properties carry "
            "'locked' (is_locked = that property). eufy-security-client gives the Smart Safes "
            "(T7400-T7403) the property too; a safe is no door cylinder (and lock() refuses it), "
            "so the safe models are excluded by the 'T740' prefix of the cloud model string."
        ),
        tasks=(
            ConsumableSignature(
                (),
                "Lubricate Cylinder",
                "cycle_count",
                delta_units=2000,
                entity_domain="lock",
                on_states=("locked",),
                models_exclude=("T740",),
            ),
        ),
    ),
    "nuki_ng": IntegrationSignature(
        name="Nuki NG",
        verified="2026-10-25 @ kvj/hass_nuki_ng main (7c4ac6f, 0.5.5)",
        source=(
            "HACS nuki_ng lock.py: one Lock per device, openers included; is_locked = state "
            "LOCKED and door mode, which an idle Opener reports while merely online. The "
            "device model is 'Nuki Smart Lock' / 'Nuki Opener' (__init__.py), so the Opener "
            "is excluded like in nuki_web."
        ),
        tasks=(
            LOCK_CYLINDER_CYCLES_NO_OPENER,
        ),
    ),
    "hubitat": IntegrationSignature(
        name="Hubitat",
        verified="2026-10-25 @ jason0x43/hacs-hubitat master (b17cc73, v0.11.1)",
        source=(
            "HACS hubitat lock.py: HubitatLock for every hub device with the Lock capability "
            "(is_locked = attribute lock == 'locked'). A hub of many device types, like zwave_js "
            "— entity_domain-gated to locks, engine-counted locking cycles."
        ),
        tasks=(
            LOCK_CYLINDER_CYCLES,
        ),
    ),
}
