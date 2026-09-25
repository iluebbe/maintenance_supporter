"""2D and 3D printers incl. Klipper via Moonraker.

Threshold audit 2026-07-19: the AMS desiccant trigger targets the REAL
percentage humidity sensor (tk 'humidity', PERCENTAGE + HUMIDITY class,
exists only on hygrometer-equipped AMS units via Features.AMS_HUMIDITY) —
NOT the 1-5 'humidity_index' scale sensor (distinct tk; an endswith
'_humidity' match cannot hit '_humidity_index' either). Bambu publishes
no official RH threshold (their desiccant status is color-based), so
>40 % RH stays an editorial trip point: fresh desiccant holds an AMS at
~10-20 % RH, 40 % means it is spent.

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
                ("printing",),
                "Lubricate Rails and Rods",
                "runtime_hours",
                delta_units=200,
                entity_domain="binary_sensor",
                on_states=("on",),
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
                ("printer_state",),
                "Lubricate Rails and Rods",
                "runtime_hours",
                delta_units=200,
                on_states=("printing",),
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
        tasks=(ConsumableSignature(("totals_filament_used",), "Replace Nozzle", "usage_delta", delta_units=1000),),
    ),
    "ha_creality_ws": IntegrationSignature(
        name="Creality (WebSocket)",
        verified="2026-09-25 @ 3dg1luk43/ha_creality_ws main",
        source=(
            "3dg1luk43/ha_creality_ws custom_components/ha_creality_ws/sensor.py "
            "PrintStatusSensor: _attr_translation_key 'print_status', no unit, states "
            "off/unknown/error/self-testing/completed/paused/stopped/printing/"
            "processing/idle ('printing' = st == 1 with a file loaded). No lifetime "
            "print-hours counter exists — the ENGINE accumulates print time. K1/K2/"
            "Hi/3V3 are all FDM machines (Prusa's 200 print-hour lubrication cadence)."
        ),
        tasks=(
            ConsumableSignature(
                ("print_status",),
                "Lubricate Rails and Rods",
                "runtime_hours",
                delta_units=200,
                on_states=("printing",),
            ),
        ),
    ),
    "elegoo_printer": IntegrationSignature(
        name="Elegoo printer",
        verified="2026-09-25 @ danielcherubini/elegoo-homeassistant main",
        source=(
            "danielcherubini/elegoo-homeassistant custom_components/elegoo_printer/"
            "definitions.py _print_status_sensor: key/translation_key 'print_status', "
            "ENUM of ElegooPrintStatus names (incl. 'printing'). Resin printers carry "
            "the same tk (PRINTER_STATUS_RESIN), so the duty is gated on the FDM-only "
            "sibling 'Nozzle Temperature' (key nozzle_temp, has_entity_name, no tk → "
            "suffix _nozzle_temperature; only in PRINTER_STATUS_FDM, sensor.py adds it "
            "for PrinterType.FDM). The 'Total Print Time' sensor is per job, not "
            "lifetime — the ENGINE accumulates print time."
        ),
        tasks=(
            ConsumableSignature(
                ("print_status",),
                "Lubricate Rails and Rods",
                "runtime_hours",
                delta_units=200,
                on_states=("printing",),
                require_sibling_keys=("nozzle_temperature",),
            ),
        ),
    ),
    "anycubic_cloud": IntegrationSignature(
        name="Anycubic Cloud",
        verified="2026-09-25 @ Nino6689/hass-anycubic main",
        source=(
            "Nino6689/hass-anycubic custom_components/anycubic_cloud/sensor.py: "
            "key/translation_key 'print_time_total_hrs' (UnitOfTime.HOURS, "
            "TOTAL_INCREASING, printer.total_print_time_hrs — lifetime print hours, "
            "no reset) → usage_delta. Resin (LCD) printers share the sensor, so the "
            "duty is gated on the FDM-only sibling tk 'curr_nozzle_temp' "
            "(PrinterEntityType.FDM, helpers.check_descriptor_status_not_fdm)."
        ),
        tasks=(
            ConsumableSignature(
                ("print_time_total_hrs",),
                "Lubricate Rails and Rods",
                "usage_delta",
                delta_units=200,
                require_sibling_keys=("curr_nozzle_temp",),
            ),
        ),
    ),
    "ipp": IntegrationSignature(
        name="IPP printer",
        verified="2026-07-16 @ home-assistant/core dev",
        source="home-assistant/core homeassistant/components/ipp/sensor.py (marker_<i>, translation_key 'marker', %)",
        tasks=(
            # Every marker (each ink/toner) shares translation_key "marker" —
            # per_entity: one task per cartridge ("Replace Ink or Toner — Cyan
            # marker"), so each colour is completed on its own (#145); a mono
            # printer's single marker keeps the plain name.
            ConsumableSignature(("marker",), "Replace Ink or Toner", "percent_left", per_entity=True),
        ),
    ),
    "brother": IntegrationSignature(
        name="Brother printer",
        verified="2026-09-25 @ home-assistant/core dev",
        source=(
            "home-assistant/core homeassistant/components/brother/sensor.py "
            "(*_toner_remaining / *_ink_remaining / *_remaining_life, PERCENTAGE). "
            "Inkjets: black/cyan/magenta/yellow_ink_remaining (since 2026.7). "
            "ink_capture_box_remaining_life (dev, 2026-09; strings.json 'Ink capture "
            "box remaining lifetime') = the waste-ink box → the maintenance-box duty. "
            "laser_remaining_life, pf_kit_1_remaining_life, pf_kit_mp_remaining_life "
            "(paper-feed kits, tray 1 / multipurpose tray)."
        ),
        tasks=(
            ConsumableSignature(
                (
                    "black_ink_remaining",
                    "cyan_ink_remaining",
                    "magenta_ink_remaining",
                    "yellow_ink_remaining",
                ),
                "Replace Ink or Toner",
                "percent_left",
                per_entity=True,  # inkjets: one task per cartridge (#145)
            ),
            ConsumableSignature(("ink_capture_box_remaining_life",), "Replace Maintenance Box", "percent_left"),
            ConsumableSignature(("laser_remaining_life",), "Replace Laser Unit", "percent_left"),
            ConsumableSignature(
                ("pf_kit_1_remaining_life", "pf_kit_mp_remaining_life"),
                "Replace Paper Feed Kit",
                "percent_left",
                per_entity=True,  # the tray-1 and MP-tray kits wear independently
            ),
            ConsumableSignature(
                (
                    "black_toner_remaining",
                    "cyan_toner_remaining",
                    "magenta_toner_remaining",
                    "yellow_toner_remaining",
                ),
                "Replace Toner",
                "percent_left",
                per_entity=True,  # colour lasers: one task per toner (#145)
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
                per_entity=True,  # per-colour drums on colour models
            ),
            ConsumableSignature(("belt_unit_remaining_life",), "Replace Belt Unit", "percent_left"),
            ConsumableSignature(("fuser_remaining_life",), "Replace Fuser", "percent_left"),
        ),
    ),
    "hpprinter": IntegrationSignature(
        name="HP printer",
        verified="2026-09-25 @ elad-bar/ha-hpprinter master",
        source=(
            "elad-bar/ha-hpprinter custom_components/hpprinter/parameters/"
            "data_points.json 'consumable_percentage_level_remaining' "
            "(ConsumablePercentageLevelRemaining, unit %, excluded for printheads); "
            "managers/ha_config_manager.py sets translation_key = property_key. Each "
            "cartridge is its OWN device (ha_coordinator.create_consumable_device, "
            "via_device = the printer), so every cartridge device carries one level "
            "sensor and gets its own plain duty."
        ),
        tasks=(
            ConsumableSignature(
                ("consumable_percentage_level_remaining",),
                "Replace Ink or Toner",
                "percent_left",
                per_entity=True,
            ),
        ),
    ),
    "epson_workforce": IntegrationSignature(
        name="Epson WorkForce",
        verified="2026-09-25 @ lymanepp/ha-epson-workforce master",
        source=(
            "lymanepp/ha-epson-workforce custom_components/epson_workforce/sensor.py "
            "SENSOR_TYPES ink_bk/ink_pb/ink_gy/ink_m/ink_c/ink_y/ink_lc/ink_lm named "
            "'Ink level <Colour>' (PERCENTAGE, _attr_has_entity_name, no tk → "
            "entity-id suffixes _ink_level_black … _ink_level_light_magenta); "
            "parser.py reads the tank bar height = ink left. The 'clean' maintenance-"
            "box sensor ('Cleaning level') is SKIPPED: the parser only reads a bar "
            "height, whether it shows capacity used or left is not established."
        ),
        tasks=(
            ConsumableSignature(
                (
                    "ink_level_black",
                    "ink_level_photoblack",
                    "ink_level_gray",
                    "ink_level_cyan",
                    "ink_level_magenta",
                    "ink_level_yellow",
                    "ink_level_light_cyan",
                    "ink_level_light_magenta",
                ),
                "Replace Ink or Toner",
                "percent_left",
                per_entity=True,  # one task per tank
            ),
        ),
    ),
}
