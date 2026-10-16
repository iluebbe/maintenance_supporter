"""Signature check against HA core source: stable tag vs dev (next beta).

run in ha-maint: cd /config && PYTHONPATH=/config python /tmp/sigscan/sigscan.py
Reads /tmp/sigscan/core-<ref>.tgz directly (no extraction).
"""
import collections
import json
import re
import tarfile
from pathlib import Path

from custom_components.maintenance_supporter.helpers.signatures import SIGNATURES

REFS = ("2026.9.4", "dev")
probes = json.loads(Path("/tmp/sigscan/signature_probes.json").read_text(encoding="utf-8"))
probes.pop("_comment", None)
CONSUMABLE = re.compile(
    r"filter|brush|blade|consumable|lifespan|life_?time|remaining_life|descal|decalc|salt|rinse|cartridge|toner|ink|drum|wick|mop|dust_?bag|"
    r"hepa|service_(due|interval|required)|maintenance|oil_life|wear|pad|sponge|tank_clean|clean_?(base|station|required|reminder)|"
    r"sensor_dirty|dirty|replace|chain|belt|nozzle|water_?filter|grease|limescale|scale|usage_time|operating_hours|runtime|hours",
    re.I,
)


def load(ref: str) -> dict[str, dict[str, str]]:
    comps: dict[str, dict[str, str]] = collections.defaultdict(dict)
    with tarfile.open(f"/tmp/sigscan/core-{ref}.tgz") as tf:
        for m in tf:
            if not m.isfile():
                continue
            parts = m.name.split("/")
            if len(parts) >= 5 and parts[1] == "homeassistant" and parts[2] == "components":
                if parts[-1].endswith((".py", ".json")) and "translations" not in parts:
                    comps[parts[3]]["/".join(parts[4:])] = tf.extractfile(m).read().decode("utf-8", "replace")
    return comps


trees = {ref: load(ref) for ref in REFS}
core_domains = sorted(
    d for d in SIGNATURES if any("home-assistant/core" in u for u in probes.get(d, {}).get("urls", []))
)


def literal(blob: str, key: str) -> bool:
    return re.search(r"[\"']" + re.escape(key) + r"[\"']", blob) is not None


def buttons(files: dict[str, str]) -> set[str]:
    try:
        return set(json.loads(files.get("strings.json", "{}")).get("entity", {}).get("button", {}))
    except ValueError:
        return set()


report: dict = {"core_domains": len(core_domains), "domains": {}}
for domain in core_domains:
    sig = SIGNATURES[domain]
    per = {}
    for ref in REFS:
        files = trees[ref].get(domain)
        if files is None:
            per[ref] = {"present": False}
            continue
        blob = "\n".join(files.values())
        btn = buttons(files)
        missing_keys, missing_siblings, missing_buttons, missing_states = [], [], [], []
        for t in sig.tasks:
            for k in t.keys:
                if not literal(blob, k):
                    missing_keys.append(f"{t.task_name}: {k}")
            for k in t.require_sibling_keys:
                if not literal(blob, k):
                    missing_siblings.append(f"{t.task_name}: {k}")
            for _s, b in t.resets:
                if b not in btn:
                    missing_buttons.append(f"{t.task_name}: {b}")
            for s in t.on_states:
                if not literal(blob, s):
                    missing_states.append(f"{t.task_name}: {s}")
        if sig.appliance_type_key and not literal(blob, sig.appliance_type_key):
            missing_siblings.append(f"appliance_type_key: {sig.appliance_type_key}")
        per[ref] = {
            "present": True,
            "missing_keys": sorted(set(missing_keys)),
            "missing_siblings": sorted(set(missing_siblings)),
            "missing_buttons": sorted(set(missing_buttons)),
            "missing_states": sorted(set(missing_states)),
        }
    report["domains"][domain] = per


# New in dev (next beta): consumable-ish entity keys and reset buttons/services.
def scan(files: dict[str, str]) -> set[str]:
    out: set[str] = set()
    try:
        data = json.loads(files.get("strings.json", "{}"))
    except ValueError:
        return out
    for platform, keys in (data.get("entity") or {}).items():
        if not isinstance(keys, dict):
            continue
        for key, spec in keys.items():
            name = spec.get("name", "") if isinstance(spec, dict) else ""
            text = f"{key} {name}"
            if platform == "button" and re.search(r"reset", text, re.I):
                out.add(f"button/{key}: {name}")
            elif platform in ("sensor", "binary_sensor", "number") and CONSUMABLE.search(text):
                out.add(f"{platform}/{key}: {name}")
    for svc in (data.get("services") or {}):
        if re.search(r"reset|consumable|filter", svc, re.I):
            out.add(f"service/{svc}")
    return out


catalog_keys: dict[str, set[str]] = {}
for domain, sig in SIGNATURES.items():
    catalog_keys[domain] = {k for t in sig.tasks for k in t.keys}
stable, dev = trees["2026.9.4"], trees["dev"]
new_in_dev = {}
for domain, files in dev.items():
    added = scan(files) - scan(stable.get(domain, {}))
    if added:
        new_in_dev[domain] = {
            "new_domain": domain not in stable,
            "in_catalog": domain in SIGNATURES,
            "added": sorted(added),
            "uncovered": sorted(a for a in added if a.split("/", 1)[1].split(":")[0] not in catalog_keys.get(domain, set())),
        }
report["new_in_dev"] = new_in_dev
report["removed_in_dev"] = sorted(set(stable) - set(dev))
report["added_in_dev"] = sorted(set(dev) - set(stable))
Path("/tmp/sigscan/report.json").write_text(json.dumps(report, indent=1, ensure_ascii=False), encoding="utf-8")

# ── summary ──
print("core signature domains:", len(core_domains))
for domain, per in report["domains"].items():
    s, d = per["2026.9.4"], per["dev"]
    lines = []
    if not s["present"] or not d["present"]:
        lines.append(f"present stable={s['present']} dev={d['present']}")
    for field in ("missing_keys", "missing_siblings", "missing_buttons", "missing_states"):
        sv = set(s.get(field, [])) if s["present"] else set()
        dv = set(d.get(field, [])) if d["present"] else set()
        if sv:
            lines.append(f"{field} (stable{' + dev' if sv & dv else ''}): {sorted(sv)}")
        if dv - sv:
            lines.append(f"{field} NEW IN DEV: {sorted(dv - sv)}")
    if lines:
        print(f"\n[{domain}]")
        for line in lines:
            print("  ", line)
print("\nremoved in dev:", report["removed_in_dev"])
print("added in dev:", report["added_in_dev"])
print("\nnew consumable/reset keys in dev:", len(new_in_dev), "domains")
for domain, v in sorted(new_in_dev.items()):
    print(f"  {domain}{' (NEW)' if v['new_domain'] else ''}{' [catalog]' if v['in_catalog'] else ''}: {v['added']}")
