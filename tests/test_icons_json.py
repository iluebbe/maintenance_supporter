"""``icons.json`` gives every action, trigger and condition an icon.

The automation editor shows the icon next to each of them; one without an
entry shows a blank. A new service in ``services.yaml`` (or a trigger /
condition) has to bring its icon along, and an icon whose service is gone
is a leftover.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

import pytest
import yaml

_COMPONENT = Path(__file__).resolve().parents[1] / "custom_components" / "maintenance_supporter"
_ICON = re.compile(r"^mdi:[a-z0-9]+(-[a-z0-9]+)*$")


def _icons() -> dict:
    return json.loads((_COMPONENT / "icons.json").read_text(encoding="utf-8"))


@pytest.mark.parametrize(
    ("category", "source"),
    [("services", "services.yaml"), ("triggers", "triggers.yaml"), ("conditions", "conditions.yaml")],
)
def test_every_action_trigger_and_condition_has_an_icon(category: str, source: str) -> None:
    declared = yaml.safe_load((_COMPONENT / source).read_text(encoding="utf-8"))
    # Keys starting with "." are YAML anchors shared by the entries.
    names = {k for k in declared if not k.startswith(".")}
    icons = _icons().get(category, {})
    assert names, f"{source} declares nothing"
    assert sorted(names - set(icons)) == [], f"{category} without an icon in icons.json"
    assert sorted(set(icons) - names) == [], f"icons.json {category} that {source} no longer declares"
    key = category[:-1]  # service / trigger / condition
    for name, entry in icons.items():
        assert set(entry) == {key}, f"{category}.{name}: {entry}"
        assert _ICON.match(entry[key]), f"{category}.{name}: {entry[key]!r}"
