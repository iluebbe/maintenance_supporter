# -*- coding: utf-8 -*-
"""Generate docs/INTEGRATIONS.md from the signature catalog.

Single source of truth: the tables are rendered from
``helpers/signatures`` — a tripwire test regenerates the document and
compares it byte-for-byte with the committed file, so the doc can never
drift from the catalog. Run: ``py -X utf8 scripts/generate_integrations_doc.py``.
"""

from __future__ import annotations

import importlib
import io
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from custom_components.maintenance_supporter.const import DEFAULT_CONSUMABLE_THRESHOLD

CATEGORY_ORDER = [
    "vacuums", "garden", "cars", "wallboxes", "heating", "air", "kitchen",
    "printers", "locks", "transports", "home_it", "pets", "personal", "xiaomi",
]


def _threshold_text(sig) -> str:
    d = sig.direction
    if d == "duration_left":
        h = sig.below_hours
        return f"below {h / 24:g} days remaining" if h >= 48 else f"below {h:g} h remaining"
    if d == "percent_left":
        if sig.below_percent is None:
            # #146: the catalog default follows the household setting.
            return f"below the household consumable floor (default {DEFAULT_CONSUMABLE_THRESHOLD} %)"
        return f"below {sig.below_percent:g} % remaining"
    if d == "usage_above":
        return f"at {sig.above_hours:g} h counted by the device"
    if d == "usage_delta":
        return f"every {sig.delta_units:g} units (counter delta)"
    if d == "runtime_hours":
        return f"every {sig.delta_units:g} h counted by the engine"
    if d == "alert_above":
        return f"above {sig.delta_units:g}"
    if d == "value_below":
        return f"below {sig.delta_units:g}"
    if d == "event_present":
        latch = sig.on_states[0] if sig.on_states else "present"
        return f"while the appliance reports '{latch}'"
    if d == "cycle_count":
        return f"every {sig.delta_units:g} cycles"
    return "—"


def _notes(sig) -> str:
    notes = []
    if sig.entity_domain != "sensor":
        notes.append(f"{sig.entity_domain} entity")
    if sig.attribute:
        notes.append(f"attribute `{sig.attribute}`")
    if sig.on_states and sig.direction in ("runtime_hours", "cycle_count"):
        notes.append("active: " + "/".join(sig.on_states))
    if sig.models:
        notes.append("models: " + "/".join(sig.models))
    if sig.models_exclude:
        notes.append("except " + "/".join(sig.models_exclude))
    if sig.require_sibling_keys:
        notes.append("device-type gated")
    if sig.per_entity:
        notes.append("one task per entity")
    return "; ".join(notes)


def generate() -> str:
    package = importlib.import_module(
        "custom_components.maintenance_supporter.helpers.signatures"
    )
    lines: list[str] = [
        "# Supported integrations — Suggested setups catalog",
        "",
        "<!-- GENERATED FILE — do not edit. Regenerate with:",
        "     py -X utf8 scripts/generate_integrations_doc.py",
        "     A tripwire test keeps this file in sync with the catalog. -->",
        "",
        "Devices of these integrations are discovered by **Suggested setups**",
        "and adopt with their sensor triggers pre-wired. Every entry is",
        "verified against the integration's source code and re-checked weekly",
        "by the upstream drift watchdog. Intervals marked *editorial* are",
        "sensible defaults — every adopted task remains fully editable.",
        "",
        "**Trigger styles:** *countdown* (time/percent remaining reported by",
        "the device), *device counter* (usage counted by the device, reset on",
        "service), *counter delta* (lifetime counter; counts from adoption or",
        "a [start value](https://github.com/iluebbe/maintenance_supporter/issues/102)),",
        "*engine runtime* (this integration accumulates active time itself),",
        "*measurement* (plain threshold, auto-resolving), *event latch*",
        "(appliance-reported maintenance event), *cycle count*.",
        "",
        "## Beyond this list: problem-sensor adoption",
        "",
        "The tables below cover the *signature catalog* — integration-specific",
        "wear and consumable sensors. A second, **integration-agnostic**",
        "surface exists alongside it: **Adopt problem sensors** turns any",
        "binary sensor of device class `problem`, `safety` or `tamper` into a",
        "triggered maintenance task that auto-resolves when the alert clears.",
        "",
        "Known adoptable sensors (source-verified 2026-07-19 by sweeping the",
        "upstream code of every catalogued integration; every entry names",
        "the sensor the integration actually ships and the duty it becomes):",
        "",
        "**Vehicles** — the warning-lamp families pair naturally with the",
        "odometer/countdown duties above:",
        "",
        "| Integration | Problem sensor(s) | Adopts as |",
        "|---|---|---|",
        "| **Hyundai / Kia** (HACS kia_uvo) | washer fluid, brake fluid, oil level, aux-battery, tire pressure (all + per tire) | Top-up / tire-check duties per warning |",
        "| **Volvo** (core) | 28 warning binaries: oil, coolant and brake-fluid levels, washer fluid, per-lamp bulb failures, per-tire pressure | Fluid top-ups, bulb replacement, tire checks |",
        "| **Mercedes-Benz** (HACS mbapi2020) | brake fluid, wash water, coolant level, aux battery, tire warnings | Same family |",
        "| **Audi Connect** (HACS) | oil-level warning (`problem`), parking-light/braking status (`safety`) | Oil top-up, light check |",
        "| **Tesla Fleet / Teslemetry / Tessie** (core) | per-tire TPMS soft warnings | Tire checks |",
        "| **RDW** (core, NL) | `pending_recall` — the official Dutch vehicle-recall register | Book the recall fix |",
        "| **Subaru** (core, 2026.9+) | `health_istrouble` (overall vehicle health) + one warning-lamp binary per reported system (`mil_*`: engine-oil level `mil_eol`, oil pressure `mil_opl`, check engine `mil_cel`, washer fluid `mil_wash`, tire pressure `mil_tpms`, ABS/EBD/airbag/brake lamps …) | Oil top-up, washer fluid, tire check, workshop visit per lamp |",
        "",
        "**Appliances & home:**",
        "",
        "| Integration | Problem sensor(s) | Adopts as |",
        "|---|---|---|",
        "| **Haier hOn** (HACS) | dishwasher **salt**, **rinse aid**, filter-replacement | Refill salt / rinse aid, change filter |",
        "| **LG ThinQ** (HACS smartthinq_sensors) | detergent low, softener low, appliance error state | Refill detergent / softener |",
        "| **Miele** (core) | appliance failure + active-notification (carries salt / rinse-aid / service warnings) | One catch-all fault task per appliance |",
        "| **Synology DSM** (core) | `safety`-class disk status, bad-sector threshold exceeded, SSD remaining-life below threshold | Disk inspection / replacement per drive |",
        "| **OpenTherm Gateway** (core) | boiler **service required**, low water pressure, gas fault, air-pressure fault, water overtemperature — any OpenTherm boiler | Boiler service / fault duties |",
        "| **Intergas InComfort** (core) | boiler fault | Boiler service |",
        "| **Viessmann ViCare** (core) | device error | Boiler service |",
        "| **PetKit** (HACS) | replace-filter, waste-tank full, sand/food/water-level alerts, deodorizer presence | The matching feeder/litter/fountain duty each |",
        "| **Litter-Robot** (core) | drawer removed, bonnet removed, **laser dirty** | Empty drawer / clean sensor |",
        "| **La Marzocco** (core) | water tank empty | Refill water tank |",
        "| **Roborock** (core) | dock water shortage, dirty-water box full | Refill dock water / empty dirty-water box |",
        "| **ROMY** (core) | water tank empty | Refill mop tank |",
        "| **Dyson** (HACS hass_dyson) | filter-replacement binary, per-fault sensors (incl. humidifier tank) | Filter change / fault triage |",
        "| **Dreo** (HACS) | humidifier water empty | Refill tank |",
        "| **Sensibo** (core) | filter-clean alert (device-computed) | AC filter cleaning |",
        "| **VeSync / Levoit** (core) | humidifier water-lacks, water-tank-lifted | Refill / reseat the tank |",
        "| **Blueair** (HACS) / **Winix** (HACS) | filter-expired resp. filter-replace binaries (alongside the % sensors in the catalog) | Filter change |",
        "| **SmartTub** (core) | spa reminders — one binary per reminder (filter, water care) | The matching spa duty each |",
        "| **Bambu Lab** (HACS) | HMS errors, print error | Printer fault triage |",
        "| **Tedee** (core) | lock uncalibrated | Recalibrate lock |",
        "| **Schlage** (core) | keypad disabled | Lock service check |",
        "| **SwitchBot** (core) | lock/door unclosed + unlocked alarms, `tamper` alarm | Door/lock checks |",
        "| **Yale Smart Alarm** (core) | lock jam, tamper, AC-fail | Lock/panel service |",
        "| **CoolMaster** (core) | `clean_filter` per AC unit | AC filter cleaning |",
        "| **Fjäråskupan** (core) | hood carbon-filter + grease-filter alerts | Replace/clean hood filters |",
        "| **Flexit Nordic** (core) | `air_filter_polluted` (alongside the catalog's operating-time duty) | Filter change |",
        "| **IntelliFire** (core) | fireplace maintenance / fan / flame / accessory errors | Fireplace service |",
        "| **LetPot** (core) | hydroponics low-water, low-nutrients, pump error | Refill / pump check |",
        "| **Shelly** (core) | TRV `calibration`, relay `overheating` | Recalibrate valve / inspect load |",
        "| **UniFi Protect** (core) | `disk_health`, `tampering` | Replace recorder disk |",
        "| **Hikvision** (core) | disk error/full, `tamper_detection` | Replace/clear recorder disk |",
        "| **Samsung SyncThru** (core) | printer `problem` state | Printer fault triage |",
        "| **Rehlko / Kohler** (core) | generator `oil_pressure` (alongside the catalog's 100-h oil service) | Immediate oil check |",
        "| **myUplink** (core) | `has_alarm` — the heat pump's generic alarm flag | Heat-pump service check |",
        "| **Midea dehumidifiers** (HACS midea_dehumidifier_lan) | tank full, tank removed, **filter replacement** | Empty tank / change filter |",
        "| **Nest Protect** (HACS) | a dozen fault binaries (smoke/CO/heat sensor faults, battery); the device end-of-life date ships as a separate sensor | Detector service / replacement |",
        "| **Deye dehumidifiers** (HACS) | water tank full | Empty tank |",
        "| **Pit Boss grills** (HACS) | error states (default problem class) | Grill fault triage |",
        "| **Bosch Smart Home** (HACS bosch_shc) | shutter `calibration required`, outdoor-siren faults (AC/DC error, battery defect, battery-temp abnormal, power outage), siren + motion-detector `tamper` | Recalibrate shutter / siren service / tamper checks |",
        "| **ZHA / Z-Wave JS / deCONZ / MQTT** | device-dependent `tamper` + smoke-detector fault binaries | Detector service / tamper checks |",
        "| **KNX** | any binary object the user maps with device class `problem`/`safety`/`tamper` (KNX entities are fully user-configured — set the class on your fault/maintenance group addresses and they become adoptable) | Whatever the object signals |",
        "| **Midea** (core) | dishwasher **salt** + **rinse aid** (E1 / sink dishwasher), AC dust-full, dehumidifier / fresh-air filter-cleaning reminder, dehumidifier tank full (alongside the catalog's filter-life and softener-salt duties) | Refill salt / rinse aid, clean filter, empty tank |",
        "| **Midea Dishwasher** (HACS midea_dishwasher) | **salt**, **rinse aid** | Refill salt / rinse aid |",
        "| **ConnectLife** (HACS connectlife) | dishwasher salt- and rinse-aid-refill alarms, clean-the-filters alarm; oven descaling-needed alarm; hood grease- and recirculation-filter alarms | Refill salt / rinse aid, clean filters, descale oven, clean/replace hood filters |",
        "| **Haier hOn — addhOn** (HACS addhon) | washer drum-clean / filter-clean / dry-clean needed, hood filter-cleaning alarm, AC filter change | Clean drum or filter, change AC filter |",
        "| **Home Connect Local** (HACS homeconnect_ws) | dishwasher machine-care, machine-care + filter-cleaning, smart filter-cleaning and water-heater-calcified reminders; washer drum-clean reminder and i-Dos 1/2 fill level poor; dryer lint filter full and maintenance reminder (alongside the catalog's salt/rinse-aid latches) | Machine care, filter cleaning, refill i-Dos, clean lint filter |",
        "| **GE Home** (HACS ge_home, custom repository) | built-in AC filter status, dehumidifier clean-filter, Opal ice-maker filter status | Clean / replace the filter |",
        "| **Actron Air** (core, 2026.9) | `clean_filter` | AC filter cleaning |",
        "| **IntelliClima** (core, 2026.9) | `filter_cleaning` (ECOCOMFORT ventilation units) | Filter cleaning |",
        "| **Duco** (core, dev) | `diagnostic_filter` (alongside the catalog's filter countdown) | Filter change |",
        "| **Flexit Modbus** (core, dev) | `filter_alarm` (alongside the catalog's filter-timer duty) | Filter change |",
        "| **Aprilaire RS-485** (HACS aprilaire_rs485) | `alarm_filter`, `alarm_water_panel`, `alarm_dehumidifier`, `alarm_system` | Filter change / humidifier water-panel change / service check |",
        "| **Daikin Madoka** (HACS daikin_madoka) | `clean_filter` indicator | AC filter cleaning |",
        "| **BWT AQA Perla BLE** (HACS) | `salt_alarm` (alongside the catalog's salt %) | Refill softener salt |",
        "| **EnergyTrak** (HACS) | generator `fault`, `malfunction` (alongside the catalog's engine-hours oil service) | Generator fault triage |",
        "| **NeoPool / Sugar Valley** (core, 2026.10+) | hydrolysis production problem (`hidro_low`), ionizer production problem (`ion_low`), ionizer program time exceeded, chlorine flow sensor (`chlorine_flow_sensor_problem`) | Salt/cell check, ionizer electrode check, flow-sensor cleaning |",
        "| **Sofar inverters** (core, 2026.10+) | one `problem` binary per fault category (`fault_fan`, `fault_insulation`, `fault_grid`, `fault_pv`, `fault_battery`, `fault_internal` …; arc-fault and fuse categories disabled by default) | Inverter service / fault triage |",
        "| **Bestway Lay-Z-Spa / Flowclear** (HACS) | `Spa Errors` resp. `Pool Filter Errors` (problem class; the pump's filter-change binary is a catalog duty instead) | Spa / pump fault triage |",
        "",
        "(QNAP, despite the family resemblance to Synology, ships no binary",
        "sensors at all — its disk data is plain sensors, covered by the",
        "catalog entry above.)",
        "",
        "If a device reports a maintenance condition as a problem-class",
        "binary sensor, it does not need a catalog entry here — the adoption",
        "dialog picks it up automatically, whether or not it appears in this",
        "table.",
        "",
        "## Reviewed — no usable signals (use a template instead)",
        "",
        "Integrations we source-dived that expose NEITHER consumable/wear",
        "sensors NOR adoptable problem binaries. Their devices still need",
        "maintenance — a static template covers them, and because these",
        "devices run on fixed rhythms, calendar intervals track real usage",
        "closely.",
        "",
        "| Integration | What it exposes | Use instead |",
        "|---|---|---|",
        "| **ResMed myAir** (HACS resmed_myair_sensors) | therapy metrics only — per-night usage minutes, AHI, mask leak, myAir score; no consumable data, no cumulative counter, no live running state | The **CPAP Machine** template (nightly use ⇒ calendar ≈ usage; ResMed-guideline intervals for mask cushion, filter, tubing, humidifier tub, headgear) |",
        "",
        "Adopted tasks are created *at adoption* (not when a problem first",
        "fires) and are fully configurable from day one — responsible user,",
        "priority, notes, documents, part links. See the",
        "[adopted-task lifecycle](FEATURES.md#adopt-problem-sensors) for how",
        "due/auto-complete and un-adopt/re-adopt behave.",
        "",
    ]

    total_integrations = 0
    total_signatures = 0
    for cat in CATEGORY_ORDER:
        mod = importlib.import_module(
            f"custom_components.maintenance_supporter.helpers.signatures.{cat}"
        )
        doc_title = (mod.__doc__ or cat).strip().splitlines()[0].rstrip(".")
        entries = mod.SIGNATURES
        if not entries:
            continue
        lines += [f"## {doc_title}", ""]
        lines += [
            "| Integration | Domain | Task | Default | Notes |",
            "|---|---|---|---|---|",
        ]
        for domain, integ in entries.items():
            total_integrations += 1
            for i, sig in enumerate(integ.tasks):
                total_signatures += 1
                name_cell = integ.name if i == 0 else ""
                domain_cell = f"`{domain}`" if i == 0 else ""
                lines.append(
                    f"| {name_cell} | {domain_cell} | {sig.task_name} | "
                    f"{_threshold_text(sig)} | {_notes(sig)} |"
                )
        lines.append("")

    lines += [
        "---",
        "",
        f"**{total_integrations} integrations / {total_signatures} verified signatures.**",
        "Missing yours? Suggest it in",
        "[discussion #101](https://github.com/iluebbe/maintenance_supporter/discussions/101).",
        "",
    ]
    return "\n".join(lines)


if __name__ == "__main__":
    out = os.path.join(ROOT, "docs", "INTEGRATIONS.md")
    io.open(out, "w", encoding="utf-8", newline="\n").write(generate())
    print(f"written {out}")
