"""Throwaway (untracked): template strings without a _T entry, and _T entries no template uses."""
import json
import sys

from custom_components.maintenance_supporter.templates import TEMPLATES
from custom_components.maintenance_supporter.templates_i18n import _T

used: set[str] = set()
for t in TEMPLATES:
    used.add(t.name)
    for tt in t.tasks:
        used.add(tt.name)
        if tt.notes:
            used.add(tt.notes)
        used.update((tt.country_notes or {}).values())
extra = {
    "Battery Fleet",
    "Replace low batteries",
    "Aggregate battery check. The detail view lists which devices are low and which battery types to buy.",
    "{type} battery",
    "Typical service life ~{months} months.",
}
missing = sorted(u for u in used if u not in _T)
orphans = sorted(k for k in _T if k not in used and k not in extra)
out = sys.argv[1] if len(sys.argv) > 1 else "/tmp/i18n_gap.json"
with open(out, "w", encoding="utf-8") as f:
    json.dump({"missing": missing, "orphans": orphans}, f, ensure_ascii=False, indent=1)
print(f"missing {len(missing)}, orphans {len(orphans)} -> {out}")
