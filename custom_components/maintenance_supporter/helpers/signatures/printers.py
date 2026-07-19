"""2D and 3D printers incl. Klipper via Moonraker.

Interval audit 2026-07-19: rail/rod lubrication follows Prusa's OFFICIAL
200-print-hour maintenance interval (octoprint/prusalink); Bambu's 500 h
stays editorial (different motion system, wiki unfetchable).

Data module of the suggested-setups signature catalog — see
``helpers/signatures/_model.py`` for the direction semantics and the
method contract (every entry cites and is verified against the
integration's source; drift-probed weekly)."""

from __future__ import annotations

from ._model import ConsumableSignature, IntegrationSignature

SIGNATURES: dict[str, IntegrationSignature] = {
    "bambu_lab": IntegrationSignature(
        name="Bambu Lab",
        verified="2026-07-18 @ greghesp/ha-bambulab main",
        source=(
            "greghesp/ha-bambulab definitions.py (key/translation_key "
            "'total_usage_hours', UnitOfTime.HOURS, TOTAL_INCREASING lifetime "
            "usage → usage_delta every 500 print-hours; filament remaining is "
            "only a tray-sensor attribute and hms/print_error are device_class "
            "problem → problem-sensor adoption)."
        ),
        tasks=(
            ConsumableSignature(
                ("total_usage_hours",),
                "Lubricate Rails and Rods",
                "usage_delta",
                delta_units=500,
            ),
            ConsumableSignature(
                ("total_usage_hours",),
                "Replace Filter",
                "usage_delta",
                delta_units=300,
                models=("X1C", "X1E", "P1S", "H2"),
            ),
            ConsumableSignature(
                ("total_usage_hours",),
                "Clean Carbon Rods",
                "usage_delta",
                delta_units=100,
                models=("X1", "P1S", "P1P"),
            ),
            ConsumableSignature(
                ("total_usage_hours",),
                "Replace Purge Wiper",
                "usage_delta",
                delta_units=300,
                models=("A1",),
            ),
            ConsumableSignature(
                ("humidity",),
                "Replace Desiccant",
                "alert_above",
                delta_units=40,
                models=("AMS",),
                models_exclude=("AMS Lite",),
            ),
        ),
    ),
    "octoprint": IntegrationSignature(
        name="OctoPrint",
        verified="2026-07-18 @ home-assistant/core dev",
        source=(
            "home-assistant/core homeassistant/components/octoprint/"
            "binary_sensor.py (OctoPrintPrintingBinarySensor named 'Printing' "
            "-> entity suffix _printing; no lifetime counter exists) — the "
            "ENGINE accumulates print time."
        ),
        tasks=(
            ConsumableSignature(
                ("printing",), "Lubricate Rails and Rods", "runtime_hours",
                delta_units=200, entity_domain="binary_sensor", on_states=("on",),
            ),
        ),
    ),
    "prusalink": IntegrationSignature(
        name="PrusaLink",
        verified="2026-07-18 @ home-assistant/core dev",
        source=(
            "home-assistant/core homeassistant/components/prusalink/sensor.py "
            "(translation_key 'printer_state', ENUM incl. 'printing') — the "
            "ENGINE accumulates print time on the state sensor."
        ),
        tasks=(
            ConsumableSignature(
                ("printer_state",), "Lubricate Rails and Rods", "runtime_hours",
                delta_units=200, on_states=("printing",),
            ),
        ),
    ),
    "moonraker": IntegrationSignature(
        name="Moonraker (Klipper)",
        verified="2026-07-19 @ marcolivierarsenault/moonraker-home-assistant main sensor.py+base.py",
        source=(
            "HACS moonraker: name 'Totals Filament Used' (has_entity_name → "
            "suffix totals_filament_used), METERS, TOTAL_INCREASING lifetime. "
            "NOTE: 'Totals Print Time' is a formatted STRING — unusable. "
            "Nozzle interval is an editorial default (~1000 m on brass)."
        ),
        tasks=(
            ConsumableSignature(
                ("totals_filament_used",), "Replace Nozzle", "usage_delta", delta_units=1000
            ),
        ),
    ),
    "ipp": IntegrationSignature(
        name="IPP printer",
        verified="2026-07-16 @ home-assistant/core dev",
        source="home-assistant/core homeassistant/components/ipp/sensor.py (marker_<i>, translation_key 'marker', %)",
        tasks=(
            # Every marker (each ink/toner) shares translation_key "marker" —
            # ONE task watches them all with entity_logic any.
            ConsumableSignature(("marker",), "Replace Ink or Toner", "percent_left"),
        ),
    ),
    "brother": IntegrationSignature(
        name="Brother printer",
        verified="2026-07-16 @ home-assistant/core dev",
        source="home-assistant/core homeassistant/components/brother/sensor.py (*_toner_remaining / *_remaining_life, %)",
        tasks=(
            ConsumableSignature(
                (
                    "black_toner_remaining",
                    "cyan_toner_remaining",
                    "magenta_toner_remaining",
                    "yellow_toner_remaining",
                ),
                "Replace Toner",
                "percent_left",
            ),
            ConsumableSignature(
                (
                    "drum_remaining_life",
                    "black_drum_remaining_life",
                    "cyan_drum_remaining_life",
                    "magenta_drum_remaining_life",
                    "yellow_drum_remaining_life",
                ),
                "Replace Drum Unit",
                "percent_left",
            ),
            ConsumableSignature(("belt_unit_remaining_life",), "Replace Belt Unit", "percent_left"),
            ConsumableSignature(("fuser_remaining_life",), "Replace Fuser", "percent_left"),
        ),
    ),
}
