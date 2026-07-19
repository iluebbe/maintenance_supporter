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
}
