"""Throwaway (untracked): per domain, our signature duties next to HA core's
button + sensor translation keys, to map reset buttons onto duties."""
import json
import pathlib
import sys

import homeassistant.components as comps

from custom_components.maintenance_supporter.helpers.signatures import SIGNATURES

CORE = pathlib.Path(comps.__file__).parent
for domain in sys.argv[1:]:
    print(f"===== {domain}")
    sig = SIGNATURES.get(domain)
    if sig:
        for t in sig.tasks:
            print(f"  duty {t.task_name!r:32} {t.direction:14} keys={list(t.keys)}")
    strings = CORE / domain / "strings.json"
    if strings.exists():
        ent = json.loads(strings.read_text(encoding="utf-8")).get("entity", {})
        for plat in ("button",):
            for k, v in ent.get(plat, {}).items():
                print(f"  {plat}: {k} = {v.get('name')}")
