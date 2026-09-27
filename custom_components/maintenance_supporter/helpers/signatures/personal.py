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
        verified="2026-09-25 @ mtheli/philips_shaver main; resets + cartridge 2026-09-27 @ 31bedaa",
        source=(
            "mtheli/philips_shaver custom_components/philips_shaver/sensor.py "
            "PhilipsHeadRemainingSensor: _attr_translation_key 'head_remaining', "
            "PERCENTAGE (coordinator: CHAR_HEAD_REMAINING byte — the shaver's own "
            "head-life counter). button.py PhilipsBladeReplacementButton tk "
            "'blade_replacement' writes 0x01 to the head-replacement characteristic and "
            "sets head_remaining = 100 (a no-op, logged, while the BLE link is down). "
            "2026-09-27: PhilipsRemainingCleaningCyclesSensor tk "
            "'cleaning_cycles_remaining' (unitless, 0-30 = CARTRIDGE_CAPACITY) — the "
            "Quick Clean cartridge's remaining cycles, estimated from the shaver's own "
            "cleaning counter plus fluid evaporation (the Philips app's model); only on "
            "shavers with a cleaning station. Its reset is PhilipsCartridgeResetButton tk "
            "'cartridge_reset' (back to 30) → value_below 3 cycles, the reset restores it."
        ),
        tasks=(
            ConsumableSignature(
                ("head_remaining",),
                "Replace Shaver Head",
                "percent_left",
                resets=(("head_remaining", "blade_replacement"),),
            ),
            ConsumableSignature(
                ("cleaning_cycles_remaining",),
                "Replace Cleaning Cartridge",
                "value_below",
                delta_units=3,
                resets=(("cleaning_cycles_remaining", "cartridge_reset"),),
            ),
        ),
    ),
    "philips_sonicare_ble": IntegrationSignature(
        name="Philips Sonicare (BLE)",
        verified="2026-09-27 @ mtheli/philips_sonicare_ble master (93c4257, HACS default)",
        source=(
            "mtheli/philips_sonicare_ble custom_components/philips_sonicare_ble/sensor.py "
            "SonicareBrushHeadWearSensor: _attr_translation_key 'brushhead_wear', "
            "PERCENTAGE = coordinator brushhead_wear_pct = NFC head lifetime usage / "
            "lifetime limit × 100 (capped 100) — wear counting UP, back to 0 on a new head "
            "(auto-resolve). Created only for handles with the NFC brush-head service "
            "(SVC_BRUSHHEAD or Condor). The brush-head entities live on a SUB-DEVICE "
            "'<name> Brush Head' (entity.py PhilipsBrushHeadEntity, via_device = the "
            "handle), so the proposal lands on that sub-device. 'brushhead_sessions_left' "
            "is the same head in sessions — one signal per duty."
        ),
        tasks=(ConsumableSignature(("brushhead_wear",), "Replace Brush Head", "alert_above", delta_units=90),),
    ),
}
