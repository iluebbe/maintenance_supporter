"""NAS & home IT.

Data module of the suggested-setups signature catalog — see
``helpers/signatures/_model.py`` for the direction semantics and the
method contract (every entry cites and is verified against the
integration's source; drift-probed weekly)."""

from __future__ import annotations

from ._model import ConsumableSignature, IntegrationSignature

SIGNATURES: dict[str, IntegrationSignature] = {
    "synology_dsm": IntegrationSignature(
        name="Synology NAS",
        verified="2026-07-18 @ home-assistant/core dev",
        source=(
            "home-assistant/core homeassistant/components/synology_dsm/sensor.py "
            "STORAGE_VOL_SENSORS (translation_key 'volume_percentage_used', "
            "PERCENTAGE). Disk-health thresholds ship as device_class: safety "
            "binaries → covered by problem-sensor adoption (widened to safety)."
        ),
        tasks=(ConsumableSignature(("volume_percentage_used",), "Storage Cleanup", "alert_above", delta_units=85),),
    ),
    "qnap": IntegrationSignature(
        name="QNAP NAS",
        verified="2026-07-18 @ home-assistant/core dev",
        source=(
            "home-assistant/core homeassistant/components/qnap/sensor.py "
            "(translation_key 'volume_percentage_used', PERCENTAGE — same key "
            "shape as synology_dsm)."
        ),
        tasks=(ConsumableSignature(("volume_percentage_used",), "Storage Cleanup", "alert_above", delta_units=85),),
    ),
    # Unraid / UniFi UNAS / MOS below mirror the Synology/QNAP duty: storage
    # usage fires ABOVE 85 % and a cleanup that lowers it auto-resolves.
    "unraid": IntegrationSignature(
        name="Unraid",
        verified="2026-09-25 @ ruaan-deysel/ha-unraid main (2026.9.1, HACS default)",
        source=(
            "HACS unraid sensor.py ArrayUsageSensor: _attr_translation_key "
            "'array_usage', unit '%' (capacity.usage_percent of the array)."
        ),
        tasks=(ConsumableSignature(("array_usage",), "Storage Cleanup", "alert_above", delta_units=85),),
    ),
    "unraid_api": IntegrationSignature(
        name="Unraid API",
        verified="2026-09-25 @ chris-mc1/unraid_api main (1.5.1, HACS default)",
        source=(
            "HACS unraid_api sensor.py description key 'array_usage' "
            "(PERCENTAGE, calc_array_usage_percentage = used / total * 100); "
            "entity.py sets translation_key = description.key."
        ),
        tasks=(ConsumableSignature(("array_usage",), "Storage Cleanup", "alert_above", delta_units=85),),
    ),
    "unraid_management_agent": IntegrationSignature(
        name="Unraid Management Agent",
        verified="2026-09-25 @ ruaan-deysel/ha-unraid-management-agent main (2026.6.5, HACS default)",
        source=(
            "HACS unraid_management_agent sensor.py ARRAY_SENSOR_DESCRIPTIONS "
            "translation_key 'array_usage' (PERCENTAGE, "
            "array.computed_used_percent)."
        ),
        tasks=(ConsumableSignature(("array_usage",), "Storage Cleanup", "alert_above", delta_units=85),),
    ),
    "unifi_unas_rest": IntegrationSignature(
        name="UniFi UNAS (REST)",
        verified="2026-09-25 @ LayerTM/unifi-unas-ha main (1.8.7, HACS default)",
        source=(
            "HACS unifi_unas_rest sensor.py hub sensor translation_key "
            "'storage_usage' (PERCENTAGE, storage.usage_percent — the whole "
            "NAS). The per-pool 'pool_usage' sub-device sensors are left out "
            "on purpose: on a single-pool NAS they would duplicate the duty."
        ),
        tasks=(ConsumableSignature(("storage_usage",), "Storage Cleanup", "alert_above", delta_units=85),),
    ),
    "unifi_unas": IntegrationSignature(
        name="UniFi UNAS (MQTT)",
        verified="2026-09-25 @ cardouken/homeassistant-unifi-unas main (0.9.4, HACS default)",
        source=(
            "HACS unifi_unas sensor.py: no translation_key — pool sensors are "
            "named f'Storage Pool {pool_num} {name}' (STORAGE_POOL_SENSORS "
            "'usage' → 'Usage', PERCENTAGE; pools numbered from 1 by "
            "scripts/unas_monitor.py) on the one NAS device → entity-id "
            "suffix _storage_pool_<n>_usage, pools 1-4 cataloged (any-high)."
        ),
        tasks=(
            ConsumableSignature(
                (
                    "storage_pool_1_usage",
                    "storage_pool_2_usage",
                    "storage_pool_3_usage",
                    "storage_pool_4_usage",
                ),
                "Storage Cleanup",
                "alert_above",
                delta_units=85,
            ),
        ),
    ),
    "mos": IntegrationSignature(
        name="MOS NAS",
        verified="2026-09-25 @ anym001/ha-mos main (0.3.3, HACS default)",
        source=(
            "HACS mos sensor/pools.py ENTITY_DESCRIPTIONS translation_key "
            "'pool_usage' (PERCENTAGE, status.usagePercent) — one sub-device "
            "per storage pool, so each pool gets its own cleanup duty."
        ),
        tasks=(ConsumableSignature(("pool_usage",), "Storage Cleanup", "alert_above", delta_units=85),),
    ),
}
