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
}
