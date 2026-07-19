"""Pet tech — feeders, fountains, litter boxes.

Data module of the suggested-setups signature catalog — see
``helpers/signatures/_model.py`` for the direction semantics and the
method contract (every entry cites and is verified against the
integration's source; drift-probed weekly)."""

from __future__ import annotations

from ._model import ConsumableSignature, IntegrationSignature

SIGNATURES: dict[str, IntegrationSignature] = {
    "petkit": IntegrationSignature(
        name="PetKit",
        verified="2026-07-19 @ Jezza34000/homeassistant_petkit main sensor.py",
        source=(
            "HACS petkit (Jezza34000): tk 'desiccant_left_days' (feeder, "
            "UnitOfTime.DAYS) and tk 'filter_percent' (water fountain, "
            "PERCENTAGE)."
        ),
        tasks=(
            # 48 canonical hours = warn at 2 days of desiccant left.
            ConsumableSignature(("desiccant_left_days",), "Replace Desiccant", "duration_left", below_hours=48),
            ConsumableSignature(("filter_percent",), "Replace Water Filter", "percent_left"),
        ),
    ),
    "litterrobot": IntegrationSignature(
        name="Litter-Robot",
        verified="2026-07-18 @ home-assistant/core dev",
        source=(
            "home-assistant/core homeassistant/components/litterrobot/sensor.py "
            "(waste_drawer_level tk 'waste_drawer' % FULL -> alert_above; "
            "litter_level tk 'litter_level' % remaining (LR4/5) -> "
            "percent_left; total_cycles lifetime counter -> usage_delta)."
        ),
        tasks=(
            ConsumableSignature(
                ("waste_drawer",), "Empty Waste Drawer", "alert_above", delta_units=90
            ),
            ConsumableSignature(("litter_level",), "Refill Litter", "percent_left"),
            ConsumableSignature(
                ("total_cycles",), "Wash Litter Box", "usage_delta", delta_units=150
            ),
        ),
    ),
}
