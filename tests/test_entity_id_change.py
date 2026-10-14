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

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_platform
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.entity import Entity
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import DOMAIN, MaintenanceStatus, ScheduleType
from custom_components.maintenance_supporter.entity.id_change import entity_id_changed
from custom_components.maintenance_supporter.sensor import MaintenanceSensor

from .conftest import TASK_ID_1, build_object_data, build_object_entry_data, build_task_data, setup_integration
from .test_journey_compound_trigger import global_entry  # the fixture

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


# Home Assistant 2026.11 and later; skipped on older cores, which still remove
# and re-add a renamed entity (that path is tested in test_calendar_reload_leak).
IN_PLACE = hasattr(Entity, "async_entity_id_changed")


async def _softener(hass: HomeAssistant, global_entry: MockConfigEntry) -> dict[str, Entity]:
    """An object whose task watches `sensor.salt` (low below 10); returns every entity of ours by id."""
    hass.states.async_set("sensor.salt", "50")
    trigger = {"type": "threshold", "entity_id": "sensor.salt", "entity_ids": ["sensor.salt"], "trigger_below": 10}
    task = build_task_data(schedule_type=ScheduleType.SENSOR_BASED, trigger_config=trigger)
    obj = MockConfigEntry(
        domain=DOMAIN,
        title="Softener",
        unique_id="maintenance_supporter_softener",
        data=build_object_entry_data(object_data=build_object_data(name="Softener"), tasks={TASK_ID_1: task}),
    )
    obj.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj)
    await hass.async_block_till_done()
    return {eid: ent for platform in entity_platform.async_get_platforms(hass, DOMAIN) for eid, ent in platform.entities.items()}


@pytest.mark.skipif(IN_PLACE, reason="from 2026.11 the in-place test below calls the hook through a real rename")
async def test_before_2026_11_the_hook_is_harmless_on_every_entity(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Nothing calls the hook on these cores and Home Assistant's Entity has
    none to hand on to; calling it anyway must neither raise nor change a thing."""
    entities = await _softener(hass, global_entry)
    called = 0
    for eid, ent in entities.items():
        hook = getattr(ent, "async_entity_id_changed", None)
        if hook is None:
            continue
        hook(eid)
        called += 1
        assert ent.entity_id == eid and hass.states.get(eid) is not None
    assert called >= 4, f"only {called} entities define the hook: {sorted(entities)}"


@pytest.mark.skipif(not IN_PLACE, reason="in-place entity_id changes arrive with Home Assistant 2026.11")
async def test_a_rename_changes_every_entity_in_place_and_triggers_keep_firing(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    entities = await _softener(hass, global_entry)
    for domain in ("sensor", "binary_sensor", "calendar", "todo"):
        assert any(eid.startswith(f"{domain}.") for eid in entities), f"no {domain} entity to rename: {sorted(entities)}"
    removed: list[str] = []
    for ent in entities.values():
        original = ent.async_will_remove_from_hass

        async def spy(original=original, ent=ent) -> None:
            removed.append(ent.entity_id)
            await original()

        ent.async_will_remove_from_hass = spy

    ent_reg = er.async_get(hass)
    renamed: dict[str, Entity] = {}
    for old_id, ent in entities.items():
        domain, name = old_id.split(".", 1)
        ent_reg.async_update_entity(old_id, new_entity_id=f"{domain}.renamed_{name}")
        renamed[f"{domain}.renamed_{name}"] = ent
    await hass.async_block_till_done()

    assert not removed, f"removed and added again instead of renamed in place: {removed}"
    for new_id, ent in renamed.items():
        assert ent.entity_id == new_id
        assert hass.states.get(new_id) is not None, f"{new_id} has no state"
    assert not [eid for eid in entities if hass.states.get(eid) is not None], "a state stayed under an old entity_id"

    # The task sensor's threshold trigger kept running through the rename.
    task_sensor = next(ent for ent in renamed.values() if isinstance(ent, MaintenanceSensor))
    hass.states.async_set("sensor.salt", "5")
    await hass.async_block_till_done()
    assert hass.states.get(task_sensor.entity_id).state == MaintenanceStatus.TRIGGERED
