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
        verified="2026-07-19 @ Jezza34000/homeassistant_petkit main sensor.py; resets + odor eliminator 2026-09-27 @ a749d54",
        source=(
            "HACS petkit (Jezza34000): tk 'desiccant_left_days' (feeder, "
            "UnitOfTime.DAYS) and tk 'filter_percent' (water fountain, "
            "PERCENTAGE). 2026-09-27: button.py tk 'reset_desiccant' (feeders) and "
            "'reset_filter' (fountains; BLE for all but the W7H, cloud API there — a BLE "
            "press without a reachable relay is a silent no-op). Litter boxes: tk "
            "'odor_eliminator_n50_left_days' (state.deodorant_left_days) and "
            "'odor_eliminator_n60_left_days' (state.spray_left_days), both "
            "UnitOfTime.DAYS countdowns, created only when the box reports them, with "
            "the resets 'reset_n50_odor_eliminator' (litter boxes except T7) and "
            "'reset_n60_odor_eliminator' (camera boxes T5/T6/T7). "
            "'purification_n60_left_days' is skipped (a third N60 countdown whose part "
            "is not established)."
        ),
        tasks=(
            # 48 canonical hours = warn at 2 days of desiccant left.
            ConsumableSignature(
                ("desiccant_left_days",),
                "Replace Desiccant",
                "duration_left",
                below_hours=48,
                resets=(("desiccant_left_days", "reset_desiccant"),),
            ),
            ConsumableSignature(
                ("filter_percent",),
                "Replace Water Filter",
                "percent_left",
                resets=(("filter_percent", "reset_filter"),),
            ),
            # N50 block / N60 spray are separate parts → one task each where a
            # box reports both.
            ConsumableSignature(
                ("odor_eliminator_n50_left_days", "odor_eliminator_n60_left_days"),
                "Replace Odor Eliminator",
                "duration_left",
                below_hours=48,
                per_entity=True,
                resets=(
                    ("odor_eliminator_n50_left_days", "reset_n50_odor_eliminator"),
                    ("odor_eliminator_n60_left_days", "reset_n60_odor_eliminator"),
                ),
            ),
        ),
    ),
    "litterrobot": IntegrationSignature(
        name="Litter-Robot",
        verified="2026-07-18 @ home-assistant/core dev; re-checked 2026-09-27 @ home-assistant/core 2026.9",
        source=(
            "home-assistant/core homeassistant/components/litterrobot/sensor.py "
            "(waste_drawer_level tk 'waste_drawer' % FULL -> alert_above; "
            "litter_level tk 'litter_level' % remaining (LR4/5) -> "
            "percent_left; total_cycles lifetime counter -> usage_delta). "
            "2026-09 re-check, skipped: LR5 tk 'next_filter_replacement' (TIMESTAMP, "
            "pylitterbot nextFilterReplacementDate — no catalog direction reads a due "
            "date; its 'change_filter' button has no counter duty to reset), LR5 binary "
            "'laser_dirty' (device_class problem → problem-sensor adoption), button "
            "'reset' (LR4/LR5 robot reset, not a counter reset)."
        ),
        tasks=(
            ConsumableSignature(("waste_drawer",), "Empty Waste Drawer", "alert_above", delta_units=90, resets=(("waste_drawer", "reset_waste_drawer"),)),
            ConsumableSignature(("litter_level",), "Refill Litter", "percent_left"),
            ConsumableSignature(("total_cycles",), "Wash Litter Box", "usage_delta", delta_units=150),
        ),
    ),
    "petlibro": IntegrationSignature(
        name="PETLIBRO",
        verified="2026-09-25 @ jjjonesjr33/petlibro dev; resets 2026-09-27 @ 7ee757f",
        source=(
            "jjjonesjr33/petlibro custom_components/petlibro/sensor.py: tk "
            "'remaining_desiccant' (feeders, native 'd', DURATION — "
            "remainingDesiccantDays), tk 'remaining_filter_days' (Dockstream "
            "fountains, 'd' — realInfo.remainingReplacementDays), tk "
            "'remaining_cleaning_days' (fountains + Polar wet-food feeder + Luma "
            "litter box, 'd' — remainingCleaningDays), tk "
            "'remaining_replacement_days' (Luma litter box 'Filter Replacement "
            "Days', same API field as the fountain filter); button.py "
            "desiccant_reset / filter_reset / cleaning_reset restart the countdowns "
            "(tk = key; Granary/One RFID desiccant, the Dockstream fountains and the Luma "
            "filter, fountains + Polar + Luma cleaning — wired as each duty's reset; "
            "async_press only logs API errors). Luma's remaining_mat_days skipped (minor "
            "accessory, no catalog duty, no reset)."
        ),
        tasks=(
            # 48 canonical hours = warn at 2 days left, like PetKit's desiccant.
            ConsumableSignature(
                ("remaining_desiccant",),
                "Replace Desiccant",
                "duration_left",
                below_hours=48,
                resets=(("remaining_desiccant", "desiccant_reset"),),
            ),
            ConsumableSignature(
                ("remaining_filter_days",),
                "Replace Water Filter",
                "duration_left",
                below_hours=48,
                resets=(("remaining_filter_days", "filter_reset"),),
            ),
            ConsumableSignature(
                ("remaining_cleaning_days",),
                "Clean Appliance",
                "duration_left",
                below_hours=48,
                resets=(("remaining_cleaning_days", "cleaning_reset"),),
            ),
            ConsumableSignature(
                ("remaining_replacement_days",),
                "Replace Filter",
                "duration_left",
                below_hours=48,
                resets=(("remaining_replacement_days", "filter_reset"),),
            ),
        ),
    ),
    "eheimdigital": IntegrationSignature(
        name="EHEIM Digital (aquarium)",
        verified="2026-07-20 @ home-assistant/core dev",
        source=(
            "core eheimdigital: tk 'service_hours' (DURATION, HOURS remaining "
            "to the next filter service, suggested display DAYS) — the "
            "filter's own service countdown."
        ),
        tasks=(ConsumableSignature(("service_hours",), "Filter Cleaning", "duration_left"),),
    ),
    "petsafe": IntegrationSignature(
        name="PetSafe ScoopFree",
        verified="2026-09-27 @ dcmeglio/homeassistant-petsafe master (9c83b49, HACS default) + petsafe 2.0.6",
        source=(
            "dcmeglio/homeassistant-petsafe sensor.py + SensorEntities.py: per litter box "
            "'Rake Counter' (_attr_has_entity_name, no translation_key → suffix "
            "_rake_counter) = shadow.state.reported.rakeCount, the rakes since the "
            "counter was last reset; button.py 'Reset' (suffix _reset, litter boxes only) "
            "→ petsafe devices.DeviceScoopfree.reset(0) PATCHes rakeCount = 0 — the "
            "reset the app offers after a fresh litter tray. usage_above 120 rakes ≈ a "
            "month for one cat (tunable). Feeder food level is daily care — skipped."
        ),
        tasks=(
            ConsumableSignature(
                ("rake_counter",),
                "Change Litter",
                "usage_above",
                above_hours=120,
                resets=(("rake_counter", "reset"),),
            ),
        ),
    ),
}
