"""Boilers, heating & water treatment.

Data module of the suggested-setups signature catalog — see
``helpers/signatures/_model.py`` for the direction semantics and the
method contract (every entry cites and is verified against the
integration's source; drift-probed weekly)."""

from __future__ import annotations

from ._model import ConsumableSignature, IntegrationSignature

SIGNATURES: dict[str, IntegrationSignature] = {
    "vicare": IntegrationSignature(
        name="Viessmann ViCare",
        verified="2026-07-17 (filter) / 2026-07-18 (burner) @ home-assistant/core dev + openviess/PyViCare master",
        source=(
            "home-assistant/core homeassistant/components/vicare/sensor.py "
            "(GLOBAL_SENSORS translation_key 'filter_remaining_hours', UnitOfTime.HOURS, "
            "disabled-by-default; PyViCare ventilation.filter.runtime.remainingHours; "
            "BURNER_SENSORS/COMPRESSOR_SENSORS 'burner_hours'/'compressor_hours', "
            "UnitOfTime.HOURS, TOTAL_INCREASING lifetime → usage_delta)."
        ),
        tasks=(
            ConsumableSignature(("filter_remaining_hours",), "Replace Filter", "duration_left"),
            # Boiler/heat-pump service by accumulated operating hours since the
            # last service — the counters are lifetime (no reset), which is
            # exactly what the delta-baseline trigger models.
            ConsumableSignature(
                ("burner_hours", "compressor_hours"),
                "Annual Inspection",
                "usage_delta",
                delta_units=2000,
            ),
        ),
    ),
    "bosch": IntegrationSignature(
        name="Bosch/Buderus heating",
        verified="2026-07-18 @ bosch-thermostat/home-assistant-bosch-custom-component master + live RC300 registry",
        source=(
            "bosch-thermostat custom component: sensors are DYNAMIC (named "
            "from the device's XMPP data, sensor/base.py builds names without "
            "a device prefix → entity ids like sensor.system_pressure; no "
            "translation_keys). Key verified against a live Buderus RC300 "
            "registry; matched via the exact-object-id pattern."
        ),
        tasks=(
            # Heating-loop pressure: refill water when it drops below 1 bar;
            # topping up raises the value back (auto-resolve).
            ConsumableSignature(
                ("system_pressure",), "Refill Heating Water", "value_below", delta_units=1
            ),
        ),
    ),
    # ─── Research round 4 (2026-07-19): boiler pressure, HRV filters, ───
    # ─── purifiers, espresso, pet tech, Klipper ─────────────────────────
    "opentherm_gw": IntegrationSignature(
        name="OpenTherm Gateway",
        verified="2026-07-19 @ core/dev opentherm_gw/sensor.py",
        source=(
            "core opentherm_gw: tk 'central_heating_pressure', BAR, "
            "MEASUREMENT — generic for EVERY OpenTherm-connected boiler."
        ),
        tasks=(
            ConsumableSignature(
                ("central_heating_pressure",), "Refill Heating Water", "value_below", delta_units=1
            ),
        ),
    ),
    "plugwise": IntegrationSignature(
        name="Plugwise (Anna/Adam)",
        verified="2026-07-19 @ core/dev plugwise/sensor.py",
        source="core plugwise: tk 'water_pressure', BAR, MEASUREMENT (boiler loop).",
        tasks=(
            ConsumableSignature(("water_pressure",), "Refill Heating Water", "value_below", delta_units=1),
        ),
    ),
    "incomfort": IntegrationSignature(
        name="Intergas InComfort",
        verified="2026-07-19 @ core/dev incomfort/sensor.py",
        source=(
            "core incomfort: key 'cv_pressure', BAR, MEASUREMENT. NOTE: "
            "entity_registry_enabled_default=False — the suggestion appears "
            "once the user enables the sensor."
        ),
        tasks=(
            ConsumableSignature(("cv_pressure",), "Refill Heating Water", "value_below", delta_units=1),
        ),
    ),
    "atag": IntegrationSignature(
        name="ATAG One",
        verified="2026-07-19 @ core/dev atag/sensor.py",
        source=(
            "core atag: legacy name-based sensors ('CH Water Pressure' → "
            "object id ch_water_pressure), BAR — matched via suffix or the "
            "exact-object-id pattern."
        ),
        tasks=(
            ConsumableSignature(("ch_water_pressure",), "Refill Heating Water", "value_below", delta_units=1),
        ),
    ),
    "bwt_perla": IntegrationSignature(
        name="BWT Perla",
        verified="2026-07-19 @ dkarv/ha-bwt-perla main sensor.py (HACS default)",
        source=(
            "HACS bwt_perla (dkarv): tk 'regenerativ_level' (salt reserve, "
            "PERCENTAGE) and tk 'regenerativ_days' (days of salt left, "
            "UnitOfTime.DAYS) — refilling raises both (auto-resolve)."
        ),
        tasks=(
            ConsumableSignature(("regenerativ_level",), "Refill Softener Salt", "percent_left"),
            ConsumableSignature(
                ("regenerativ_days",), "Refill Softener Salt", "duration_left", below_hours=168
            ),
        ),
    ),
    "ecowater_softener": IntegrationSignature(
        name="EcoWater softener",
        verified="2026-07-19 @ barleybobs/homeassistant-ecowater-softener master (HACS default)",
        source=(
            "HACS ecowater_softener (barleybobs): key 'salt_level_percentage' "
            "(PERCENTAGE) and key 'out_of_salt_days' (days) — name-style "
            "entities, suffix-matched."
        ),
        tasks=(
            ConsumableSignature(("salt_level_percentage",), "Refill Softener Salt", "percent_left"),
            ConsumableSignature(
                ("out_of_salt_days",), "Refill Softener Salt", "duration_left", below_hours=168
            ),
        ),
    ),
}
