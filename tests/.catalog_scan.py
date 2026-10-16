"""Throwaway (untracked): scan HA core integrations for consumable / wear
entities and reset buttons, compare with our signature catalog.

run: PYTHONPATH=/config python tests/.catalog_scan.py /tmp/scan.json
"""
import json
import pathlib
import re
import sys

import homeassistant.components as comps

from custom_components.maintenance_supporter.helpers.signatures import SIGNATURES

CORE = pathlib.Path(comps.__file__).parent
CONSUMABLE = re.compile(
    r"filter|brush|blade|consumable|lifespan|life_?time|remaining_life|descal|decalc|salt|rinse|cartridge|toner|ink|drum|wick|mop|dust_?bag|"
    r"hepa|service_(due|interval|required)|maintenance|oil_life|wear|pad|sponge|tank_clean|clean_?(base|station|required|reminder)|"
    r"sensor_dirty|dirty|replace|chain|belt|nozzle|water_?filter|grease|limescale|scale|usage_time|operating_hours|runtime|hours",
    re.I,
)
SKIP_PLATFORMS = {"config", "options", "services", "issues", "exceptions", "selector", "device_automation", "system_health"}

catalog = {}
for domain, sig in SIGNATURES.items():
    catalog.setdefault(domain, set()).update(k for t in sig.tasks for k in t.keys)

out = {"catalog_domains": sorted(catalog), "hits": {}}
for strings in sorted(CORE.glob("*/strings.json")):
    domain = strings.parent.name
    try:
        data = json.loads(strings.read_text(encoding="utf-8"))
    except ValueError:
        continue
    entity = data.get("entity", {})
    found = {}
    for platform, keys in entity.items():
        for key, spec in keys.items():
            name = spec.get("name", "") if isinstance(spec, dict) else ""
            text = f"{key} {name}"
            if platform == "button" and re.search(r"reset", text, re.I):
                found.setdefault("reset_buttons", []).append(f"{key}: {name}")
            elif platform in ("sensor", "binary_sensor", "button", "number") and CONSUMABLE.search(text):
                found.setdefault(platform, []).append(f"{key}: {name}")
    services = data.get("services", {})
    resets = [s for s in services if re.search(r"reset|consumable|filter", s, re.I)]
    if resets:
        found["reset_services"] = resets
    if found:
        covered = catalog.get(domain, set())
        found["in_catalog"] = domain in catalog
        found["uncovered"] = [
            k for plat in ("sensor", "binary_sensor") for k in found.get(plat, []) if k.split(":")[0] not in covered
        ]
        out["hits"][domain] = found
pathlib.Path(sys.argv[1]).write_text(json.dumps(out, indent=1, ensure_ascii=False), encoding="utf-8")
print(len(out["hits"]), "domains with hits;", sum(1 for v in out["hits"].values() if v.get("reset_buttons") or v.get("reset_services")), "with resets")
