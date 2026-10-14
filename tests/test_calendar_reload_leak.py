"""A reload of the global entry leaves no calendar alarm behind.

Home Assistant's calendar arms an alarm for the end of the current event on
every state write and cancels its alarms when the entity is removed. The one
calendar belongs to the global entry; the objects' coordinators repaint it.
A refresh in the window between the global entry's unload and its set-up
still wrote the removed calendar and armed an alarm nobody cancelled — found
by the import fuzz test on Home Assistant 2026.9 (bug audit 2026-09-29).
pytest-homeassistant's clean-up check fails any test that leaves a timer.
"""

from __future__ import annotations

from unittest.mock import patch

from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import DOMAIN

from .conftest import build_object_data, build_object_entry_data, build_task_data, setup_integration
from .test_journey_compound_trigger import global_entry  # the fixture


async def test_a_refresh_while_the_global_entry_reloads_arms_no_alarm(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    today = dt_util.now().date().isoformat()
    task = {**build_task_data(task_id="t1", name="Due today"), "schedule": {"kind": "one_time", "due_date": today}}
    for key in ("schedule_type", "interval_days", "interval_unit", "interval_anchor"):
        task.pop(key, None)
    obj = MockConfigEntry(
        domain=DOMAIN,
        title="Boiler",
        unique_id="maintenance_supporter_boiler",
        data=build_object_entry_data(object_data=build_object_data(name="Boiler", object_id="objid_boiler"), tasks={"t1": task}),
    )
    obj.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj)
    await hass.async_block_till_done()
    calendar = hass.data[DOMAIN]["_calendar_entity"]
    assert calendar.is_live

    assert await hass.config_entries.async_unload(global_entry.entry_id)
    await hass.async_block_till_done()
    # The window before the global entry is set up again.
    await obj.runtime_data.coordinator.async_refresh_now()
    await hass.async_block_till_done()

    assert not calendar.is_live
    assert not getattr(calendar, "_alarm_unsubs", None), "a removed calendar armed an alarm"


async def test_a_renamed_calendar_keeps_being_repainted(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """#214: before Home Assistant 2026.11 renaming the calendar removes it and
    adds the same object back. It stayed marked as removed and its global
    registration was gone, so the coordinators stopped repainting it until the
    next reload."""
    obj = MockConfigEntry(
        domain=DOMAIN,
        title="Boiler",
        unique_id="maintenance_supporter_boiler",
        data=build_object_entry_data(object_data=build_object_data(name="Boiler", object_id="objid_boiler"), tasks={"t1": build_task_data(task_id="t1")}),
    )
    obj.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj)
    await hass.async_block_till_done()
    calendar = hass.data[DOMAIN]["_calendar_entity"]
    old_id = calendar.entity_id

    er.async_get(hass).async_update_entity(old_id, new_entity_id="calendar.renamed_schedule")
    await hass.async_block_till_done()

    assert calendar.entity_id == "calendar.renamed_schedule"
    assert hass.states.get(old_id) is None and hass.states.get("calendar.renamed_schedule") is not None
    assert calendar.is_live
    assert hass.data[DOMAIN]["_calendar_entity"] is calendar, "object entries set up later still find it"
    with patch.object(calendar, "invalidate_cache", wraps=calendar.invalidate_cache) as repaint:
        await obj.runtime_data.coordinator.async_refresh_now()
        await hass.async_block_till_done()
    assert repaint.called, "the coordinator repaints the renamed calendar"
