"""In-place entity_id changes (Home Assistant 2026.11, #214).

From 2026.11 a renamed entity is changed in place, but only when each of the
integration's own classes that defines ``async_added_to_hass``,
``async_will_remove_from_hass`` or ``async_prepare_to_add_to_hass`` (or a
subclass of it) also defines ``async_entity_id_changed``; until 2027.11 any
other entity is still removed and added again. Nothing here is keyed on an
entity's own entity_id, so every such class opts in (``entity/id_change.py``).
"""

from __future__ import annotations

import ast
from pathlib import Path

from custom_components.maintenance_supporter.entity.id_change import entity_id_changed

INTEGRATION = Path(__file__).resolve().parent.parent / "custom_components" / "maintenance_supporter"
LIFECYCLE = {"async_added_to_hass", "async_will_remove_from_hass", "async_prepare_to_add_to_hass"}


def test_every_class_with_its_own_lifecycle_hook_opts_in() -> None:
    """A class that adds a lifecycle hook and forgets the opt-in keeps every
    entity of it on the remove-and-add path (the one that left the calendar
    dead) until Home Assistant drops it in 2027.11."""
    found: list[str] = []
    missing: list[str] = []
    for path in sorted(INTEGRATION.rglob("*.py")):
        for node in ast.walk(ast.parse(path.read_text(encoding="utf-8"))):
            if not isinstance(node, ast.ClassDef):
                continue
            methods = {n.name for n in node.body if isinstance(n, (ast.FunctionDef, ast.AsyncFunctionDef))}
            if methods & LIFECYCLE:
                name = f"{path.relative_to(INTEGRATION).as_posix()}::{node.name}"
                found.append(name)
                if "async_entity_id_changed" not in methods:
                    missing.append(name)
    # The scan sees the classes the issue listed (it would pass vacuously otherwise).
    for listed in ("sensor.py::MaintenanceSensor", "binary_sensor.py::MaintenanceBinarySensor", "calendar.py::MaintenanceCalendar", "entity/area_cost.py::AreaCostSensor"):
        assert listed in found, found
    assert len(found) >= 8, found
    assert not missing, f"define async_entity_id_changed (entity/id_change.py) on: {missing}"


def test_the_change_is_handed_on_where_home_assistant_has_a_hook() -> None:
    calls: list[str] = []

    class Core:
        def async_entity_id_changed(self, old_entity_id: str) -> None:
            calls.append(old_entity_id)

    entity_id_changed(Core(), "sensor.old")
    assert calls == ["sensor.old"]
    # Before 2026.11 Home Assistant's Entity has no such hook: nothing to hand on, no error.
    entity_id_changed(object(), "sensor.old")
