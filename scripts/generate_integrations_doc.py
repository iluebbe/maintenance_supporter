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
        "Known adoptable sensors (source-verified 2026-07-19; every entry",
        "names the sensor the integration actually ships and the duty it",
        "becomes):",
        "",
        "| Integration | Problem sensor(s) | Adopts as |",
        "|---|---|---|",
        "| **Synology DSM** (core) | `safety`-class disk status, bad-sector threshold exceeded, SSD remaining-life below threshold | Disk inspection / replacement per drive |",
        "| **Miele** (core) | `problem`-class appliance failure + active-notification (carries salt / rinse-aid / service warnings) | One catch-all fault task per appliance |",
        "| **Roborock** (core) | `problem`-class dock water shortage, dirty-water box full | Refill dock water / empty dirty-water box |",
        "| **Sensibo** (core) | `problem`-class filter-clean alert (device-computed) | AC filter cleaning |",
        "| **SmartTub** (core) | `problem`-class spa reminders — one binary per reminder (filter, water care) | The matching spa duty each |",
        "| **VeSync / Levoit** (core) | `problem`-class humidifier water-lacks, water-tank-lifted | Refill / reseat the tank |",
        "| **Bambu Lab** (HACS) | `problem`-class HMS errors, print error | Printer fault triage |",
        "| **ZHA / Z-Wave JS / deCONZ / MQTT** | device-dependent `tamper` + smoke-detector fault binaries | Detector service / tamper checks |",
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
