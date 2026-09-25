"""Personal-care devices.

Data module of the suggested-setups signature catalog — see
``helpers/signatures/_model.py`` for the direction semantics and the
method contract (every entry cites and is verified against the
integration's source; drift-probed weekly)."""

from __future__ import annotations

from ._model import ConsumableSignature, IntegrationSignature

SIGNATURES: dict[str, IntegrationSignature] = {
    "oralb": IntegrationSignature(
        name="Oral-B toothbrush",
        verified="2026-07-19 @ core/dev oralb/sensor.py",
        source=(
            "core oralb (BLE): tk 'toothbrush_state', ENUM incl. 'running' — "
            "the engine accumulates brushing time (the per-session 'time' "
            "sensor is session-scoped, unusable for deltas). 6 h of brushing "
            "= the dentist's 3 months at 2x2 minutes a day. BLE gaps pause "
            "the runtime trigger; brushing only happens while connected."
        ),
        tasks=(
            ConsumableSignature(
                ("toothbrush_state",),
                "Replace Brush Head",
                "runtime_hours",
                delta_units=6,
                on_states=("running",),
            ),
        ),
    ),
    "oralb_live": IntegrationSignature(
        name="Oral-B (live BLE)",
        verified="2026-09-25 @ thomasgregg/oralb-ha main",
        source=(
            "thomasgregg/oralb-ha custom_components/oralb_live/sensor.py: key/tk "
            "'refill_days' ('Brush head remaining', UnitOfTime.DAYS, DURATION, "
            "entity_registry_enabled_default=False — discovered once the user "
            "enables it); protocol.parse_refill_remainder decodes the handle's own "
            "brush-head countdown (ff2d). The sibling 'refill_brushing_time' "
            "(hours) is the same countdown in another unit — one signal per duty."
        ),
        tasks=(ConsumableSignature(("refill_days",), "Replace Brush Head", "duration_left", below_hours=48),),
    ),
    "philips_shaver": IntegrationSignature(
        name="Philips shaver",
        verified="2026-09-25 @ mtheli/philips_shaver main",
        source=(
            "mtheli/philips_shaver custom_components/philips_shaver/sensor.py "
            "PhilipsHeadRemainingSensor: _attr_translation_key 'head_remaining', "
            "PERCENTAGE (coordinator: CHAR_HEAD_REMAINING byte — the shaver's own "
            "head-life counter). 'cleaning_cycles_remaining' is skipped: an "
            "integration-side evaporation estimate, not a device value."
        ),
        tasks=(ConsumableSignature(("head_remaining",), "Replace Shaver Head", "percent_left"),),
    ),
}
