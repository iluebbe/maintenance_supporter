"""Air treatment — purifiers, ACs and HRV/ventilation filters.

Data module of the suggested-setups signature catalog — see
``helpers/signatures/_model.py`` for the direction semantics and the
method contract (every entry cites and is verified against the
integration's source; drift-probed weekly)."""

from __future__ import annotations

from ._model import ConsumableSignature, IntegrationSignature

SIGNATURES: dict[str, IntegrationSignature] = {
            # Tub cleaning by accumulated wash time. The status sensor's
            # translation_key ("status") is IDENTICAL across all Miele
            # appliance types, so the signature is sibling-gated to washers:
            # only devices that also carry TwinDos/spin-speed entities (both
            # washer-only per core sensor.py `types=` gating) qualify.
    "hass_dyson": IntegrationSignature(
        name="Dyson",
        verified="2026-07-18 @ cmgrayb/hass-dyson main",
        source=(
            "cmgrayb/hass-dyson sensor.py DysonFilterLifeSensor "
            "(translation_key 'filter_life' for BOTH hepa and carbon "
            "instances, PERCENTAGE) — one any-low task covers both filters."
        ),
        tasks=(
            ConsumableSignature(("filter_life",), "Replace Filter", "percent_left"),
        ),
    ),
    "dreo": IntegrationSignature(
        name="Dreo",
        verified="2026-07-18 @ JeffSteinbok/hass-dreo main",
        source=(
            "JeffSteinbok/hass-dreo sensor.py (translation_key 'filter_life', "
            "unit '%', humidifiers with FILTERTIME support)."
        ),
        tasks=(
            ConsumableSignature(("filter_life",), "Replace Filter", "percent_left"),
        ),
    ),
    "vesync": IntegrationSignature(
        name="VeSync (Levoit)",
        verified="2026-07-19 @ core/dev vesync/sensor.py",
        source="core vesync: tk 'filter_life', PERCENTAGE, MEASUREMENT (Levoit purifiers).",
        tasks=(ConsumableSignature(("filter_life",), "Replace Filter", "percent_left"),),
    ),
    "daikin": IntegrationSignature(
        name="Daikin AC",
        verified="2026-07-18 @ home-assistant/core dev",
        source=(
            "home-assistant/core homeassistant/components/daikin/climate.py "
            "(climate platform verified present; AC-only integration, so the "
            "climate entity IS an air conditioner). Runtime on the hvac_action "
            "ATTRIBUTE — the state only reports the standby mode."
        ),
        tasks=(
            ConsumableSignature(
                (), "Filter Cleaning", "runtime_hours", delta_units=250,
                entity_domain="climate", attribute="hvac_action",
                on_states=("cooling", "heating", "fan", "drying"),
            ),
        ),
    ),
    "gree": IntegrationSignature(
        name="Gree AC",
        verified="2026-07-18 @ home-assistant/core dev",
        source=(
            "home-assistant/core homeassistant/components/gree/climate.py "
            "(climate platform verified present; AC-only integration, so the "
            "climate entity IS an air conditioner). Runtime on the hvac_action "
            "ATTRIBUTE — the state only reports the standby mode."
        ),
        tasks=(
            ConsumableSignature(
                (), "Filter Cleaning", "runtime_hours", delta_units=250,
                entity_domain="climate", attribute="hvac_action",
                on_states=("cooling", "heating", "fan", "drying"),
            ),
        ),
    ),
    "comfoconnect": IntegrationSignature(
        name="Zehnder ComfoAirQ",
        verified="2026-07-19 @ core/dev comfoconnect/sensor.py",
        source=(
            "core comfoconnect: key 'days_to_replace_filter', UnitOfTime.DAYS "
            "(name-style, no tk → suffix match)."
        ),
        tasks=(
            # 168 canonical hours = warn at 7 days remaining (unit 'd' → ÷24).
            ConsumableSignature(
                ("days_to_replace_filter",), "Replace Ventilation Filter", "duration_left", below_hours=168
            ),
        ),
    ),
    "renson": IntegrationSignature(
        name="Renson Endura Delta",
        verified="2026-07-19 @ core/dev renson/sensor.py",
        source="core renson: tk 'filter_change', DURATION, DAYS, MEASUREMENT.",
        tasks=(
            ConsumableSignature(
                ("filter_change",), "Replace Ventilation Filter", "duration_left", below_hours=168
            ),
        ),
    ),
}
