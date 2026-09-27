"""Protocol/hub transports whose duties are entity-domain-gated.

Data module of the suggested-setups signature catalog — see
``helpers/signatures/_model.py`` for the direction semantics and the
method contract (every entry cites and is verified against the
integration's source; drift-probed weekly)."""

from __future__ import annotations

from ._model import ConsumableSignature, IntegrationSignature
from ._shared import (
    LOCK_CYLINDER_CYCLES,
    MOWER_BLADES_RUNTIME,
    MOWER_UNDERCARRIAGE_RUNTIME,
    VACUUM_FILTER_CLEANING_RUNTIME,
    VACUUM_MAIN_BRUSH_RUNTIME,
)

SIGNATURES: dict[str, IntegrationSignature] = {
    "matter": IntegrationSignature(
        name="Matter",
        verified="2026-07-18 (lock) / 2026-09-27 (filters, vacuum) @ home-assistant/core 2026.9 + dev",
        source=(
            "home-assistant/core homeassistant/components/matter/lock.py "
            "(MatterLock, lock domain entity per device). Matter bridges many "
            "device types — the lock entity_domain restricts this signature "
            "to locks; every transition to 'locked' is one mechanical cycle. "
            "sensor.py: tk 'hepa_filter_condition' (HepaFilterMonitoring."
            "Condition) and 'activated_carbon_filter_condition' "
            "(ActivatedCarbonFilterMonitoring.Condition), PERCENTAGE, "
            "MEASUREMENT, enabled — air purifiers and extractor hoods. Read "
            "as % REMAINING: the Matter SDK's ResetCondition sets "
            "100 for DegradationDirection 'down' (the SDK air-purifier example "
            "and core's mock_air_purifier / mock_extractor_hood fixtures: "
            "Condition 100, direction down); HA does not invert 'up' devices. "
            "The two filters wear independently → two duties. button.py has "
            "one reset per filter, but BOTH carry tk 'reset_filter_condition' "
            "(only the unique_id tells HepaFilterMonitoringResetButton from "
            "ActivatedCarbonFilterMonitoringResetButton). Wired as each duty's "
            "reset: the lookup presses a button only when exactly ONE matches "
            "the key on the device, so a single-filter purifier or hood gets "
            "its reset and a dual-filter device gets none (a guess could "
            "reset the wrong filter). vacuum.py: not docked/returning/paused/"
            "error and an RVC run mode tagged Cleaning (or Mapping) → "
            "VacuumActivity.CLEANING; core's RVC fixtures "
            "(mock_vacuum_cleaner, eufy_vacuum_omni_e28) carry no "
            "filter-monitoring cluster, so the ENGINE accumulates cleaning "
            "time."
        ),
        tasks=(
            LOCK_CYLINDER_CYCLES,
            ConsumableSignature(
                ("hepa_filter_condition",),
                "Replace Filter",
                "percent_left",
                resets=(("hepa_filter_condition", "reset_filter_condition"),),
            ),
            ConsumableSignature(
                ("activated_carbon_filter_condition",),
                "Replace Activated Carbon",
                "percent_left",
                resets=(("activated_carbon_filter_condition", "reset_filter_condition"),),
            ),
            VACUUM_FILTER_CLEANING_RUNTIME,
            VACUUM_MAIN_BRUSH_RUNTIME,
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
        name="Zigbee (ZHA)",
        verified="2026-07-18 (lock) / 2026-09-27 (STARKVIND filter) @ home-assistant/core 2026.9 + dev, zigpy/zha 2.2.0 + dev",
        source=(
            "home-assistant/core homeassistant/components/zha/lock.py "
            "(lock platform verified present). Locks carry no wear sensor — "
            "the ENGINE counts locking cycles; entity_domain-gated to locks, so the bridge's other device types are untouched. "
            "IKEA STARKVIND purifiers: zha library application/platforms/"
            "sensor IkeaFilterRunTime — tk 'filter_run_time' (HA "
            "zha/strings.json 'Filter run time'), DURATION, MINUTES, "
            "DIAGNOSTIC, 'run time of the current filter' (IKEA cluster "
            "0xFC7D attribute 0x0000; counts UP and restarts at 0 when the "
            "filter is reset on the purifier) → usage_above at 4,320 h = the "
            "cluster's default filter_life_time of 259,200 min (the "
            "DIRIGERA/STARKVIND duty). The 'replace_filter' binary is "
            "device_class problem (adoption path); no reset button."
        ),
        tasks=(
            LOCK_CYLINDER_CYCLES,
            ConsumableSignature(("filter_run_time",), "Replace Filter", "usage_above", above_hours=4320),
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
        name="HomeKit Device",
        verified="2026-07-18 (lock) / 2026-09-27 (filter) @ home-assistant/core 2026.9 + dev",
        source=(
            "home-assistant/core homeassistant/components/homekit_controller/lock.py "
            "(lock platform verified present). Locks carry no wear sensor — "
            "the ENGINE counts locking cycles; entity_domain-gated to locks, so the bridge's other device types are untouched. "
            "sensor.py SIMPLE_SENSOR CharacteristicsTypes.FILTER_LIFE_LEVEL: "
            "name 'Filter lifetime', PERCENTAGE, MEASUREMENT, no "
            "translation_key — SimpleSensor names it '<accessory> Filter "
            "lifetime' → suffix _filter_lifetime. HAP Filter Life Level is "
            "the REMAINING life (core's own homekit bridge, type_air_purifiers"
            ".py, raises Filter Change Indication below 10 %). No reset "
            "entity (Reset Filter Indication is not exposed)."
        ),
        tasks=(
            LOCK_CYLINDER_CYCLES,
            ConsumableSignature(("filter_lifetime",), "Replace Filter", "percent_left"),
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
