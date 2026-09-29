"""An object's area is its area — not a second one named like the area's id.

Before 2.96 an object's device was created with the object's area ID as
``suggested_area``, which Home Assistant resolves by NAME: an object in
"Living Room" (id ``living_room``) made Home Assistant create an area called
"living_room" and put the device there (bug audit 2026-09-29). The area tests
checked the object's own ``area_id`` — never the area registry, and never a
two-word area. Now: the cause, the move back, and the offer to clean up.
"""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import issue_registry as ir
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import DOMAIN
from custom_components.maintenance_supporter.helpers.area_leftovers import (
    LEFTOVER_AREAS_ISSUE_ID,
    async_check_leftover_areas,
)
from custom_components.maintenance_supporter.repairs import LeftoverAreasRepairFlow

from .conftest import build_object_data, build_object_entry_data, build_task_data, setup_integration
from .test_journey_compound_trigger import global_entry  # the fixture


async def _lamp(hass: HomeAssistant, global_entry: MockConfigEntry, area_id: str) -> MockConfigEntry:
    obj = MockConfigEntry(
        domain=DOMAIN,
        title="Lamp",
        unique_id="maintenance_supporter_lamp",
        data=build_object_entry_data(
            object_data={**build_object_data(name="Lamp", object_id="objid_lamp"), "area_id": area_id},
            tasks={"t1": build_task_data(task_id="t1", name="Dust")},
        ),
    )
    obj.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj)
    await hass.async_block_till_done()
    return obj


def _areas(hass: HomeAssistant) -> dict[str, str]:
    return {a.id: a.name for a in ar.async_get(hass).async_list_areas()}


async def test_an_object_in_a_two_word_area_makes_no_second_area(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    living = ar.async_get(hass).async_create("Living Room")
    obj = await _lamp(hass, global_entry, living.id)
    assert _areas(hass) == {living.id: "Living Room"}
    devices = dr.async_entries_for_config_entry(dr.async_get(hass), obj.entry_id)
    assert [d.area_id for d in devices] == [living.id]


async def test_a_mistaken_area_is_emptied_and_offered_for_removal(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    area_reg = ar.async_get(hass)
    living = area_reg.async_create("Living Room")
    obj = await _lamp(hass, global_entry, living.id)
    # The state a pre-2.96 setup left: the device in an area NAMED like the id.
    mistaken = area_reg.async_create(living.id)
    dev_reg = dr.async_get(hass)
    device = dr.async_entries_for_config_entry(dev_reg, obj.entry_id)[0]
    dev_reg.async_update_device(device.id, area_id=mistaken.id)
    # An area that merely looks the same but holds something stays.
    kitchen = area_reg.async_create("Kitchen Corner")
    held = area_reg.async_create(kitchen.id)
    other = MockConfigEntry(domain="test_devices", title="devices")
    other.add_to_hass(hass)
    kettle = dev_reg.async_get_or_create(config_entry_id=other.entry_id, identifiers={("test_devices", "kettle")})
    dev_reg.async_update_device(kettle.id, area_id=held.id)

    await async_check_leftover_areas(hass)

    await hass.async_block_till_done()
    assert dev_reg.async_get(device.id).area_id == living.id, "our device moves back to the real area"
    # Moving the device made the device→object sync adopt the mistaken area
    # (as it would have on a real install once anything touched the device) —
    # the object ends in the real area too.
    assert hass.config_entries.async_get_entry(obj.entry_id).data["object"]["area_id"] == living.id
    issue = ir.async_get(hass).async_get_issue(DOMAIN, LEFTOVER_AREAS_ISSUE_ID)
    assert issue is not None and issue.translation_placeholders == {"areas": living.id}

    flow = LeftoverAreasRepairFlow()
    flow.hass = hass
    form = await flow.async_step_init()
    assert form["description_placeholders"] == {"areas": living.id}
    done = await flow.async_step_init({})
    assert done["type"] == "create_entry"
    assert mistaken.id not in _areas(hass)
    assert held.id in _areas(hass), "an area with something in it is never removed"

    await async_check_leftover_areas(hass)
    assert ir.async_get(hass).async_get_issue(DOMAIN, LEFTOVER_AREAS_ISSUE_ID) is None
