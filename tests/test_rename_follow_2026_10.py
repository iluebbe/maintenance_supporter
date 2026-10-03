"""Renames that used to need a hand (2026-10).

A user may rename any entity id. Triggers, calendar schedules, to-do mirror
targets, the battery fleet's lists and the shopping list already followed;
two references did not and left it to a repair message:

* a task's completion action — above all the integration's reset button
  wired at adoption (2.95): the counter kept running behind the repair;
* a notify ENTITY picked as the notification target.

And the catalog recognised a sensor of an integration without translation
keys only by its entity id: renamed before adoption, it was never proposed.
The integration's own entity name (``original_name``) stays put — it is the
fallback now.
"""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import CONF_NOTIFY_SERVICE, CONF_TASKS, DOMAIN
from custom_components.maintenance_supporter.helpers.entity_rename import rewrite_task
from custom_components.maintenance_supporter.helpers.integration_signatures import discover_integration_setups

from .conftest import TASK_ID_1, build_task_data, make_global_entry, make_object_entry, setup_integration


def _reset_action(entity_id: Any) -> dict[str, Any]:
    return {"service": "button.press", "target": {"entity_id": entity_id}, "skip_auto": True}


async def test_a_renamed_reset_button_follows_into_the_completion_action(hass: HomeAssistant) -> None:
    global_entry = make_global_entry(hass)
    task = {**build_task_data(), "on_complete_action": _reset_action("button.robot_reset_main_brush")}
    obj_entry = make_object_entry(hass, tasks={TASK_ID_1: task}, uid="rename_action")
    await setup_integration(hass, global_entry, obj_entry)

    ent_reg = er.async_get(hass)
    source = MockConfigEntry(domain="roborock", title="roborock")
    source.add_to_hass(hass)
    button = ent_reg.async_get_or_create(
        "button", "roborock", "duid_reset_main_brush", config_entry=source, suggested_object_id="robot_reset_main_brush"
    )
    assert button.entity_id == "button.robot_reset_main_brush"
    ent_reg.async_update_entity(button.entity_id, new_entity_id="button.upstairs_vacuum_brush_reset")
    await hass.async_block_till_done()

    action = hass.config_entries.async_get_entry(obj_entry.entry_id).data[CONF_TASKS][TASK_ID_1]["on_complete_action"]
    assert action["target"]["entity_id"] == "button.upstairs_vacuum_brush_reset"
    assert action["service"] == "button.press" and action["skip_auto"] is True


def test_the_action_rewrite_covers_lists_and_data_and_leaves_others_alone() -> None:
    task = {
        "name": "x",
        "on_complete_action": {
            "service": "script.turn_on",
            "target": {"entity_id": ["script.a", "button.old"]},
            "data": {"entity_id": "button.old", "variables": {"keep": "button.old"}},
        },
    }
    new, changed = rewrite_task(task, "button.old", "button.new")
    assert changed
    assert new["on_complete_action"]["target"]["entity_id"] == ["script.a", "button.new"]
    assert new["on_complete_action"]["data"]["entity_id"] == "button.new"
    # only entity_id keys are references — free-form variables are not touched
    assert new["on_complete_action"]["data"]["variables"] == {"keep": "button.old"}
    assert task["on_complete_action"]["target"]["entity_id"] == ["script.a", "button.old"]  # input untouched

    untouched, changed = rewrite_task(task, "button.other", "button.new")
    assert not changed and untouched["on_complete_action"] == task["on_complete_action"]


async def test_a_renamed_notify_entity_follows_into_the_notification_target(hass: HomeAssistant) -> None:
    global_entry = make_global_entry(hass, options={CONF_NOTIFY_SERVICE: "notify.kitchen_display"})
    await setup_integration(hass, global_entry)

    ent_reg = er.async_get(hass)
    source = MockConfigEntry(domain="demo_notify", title="demo")
    source.add_to_hass(hass)
    display = ent_reg.async_get_or_create("notify", "demo_notify", "display_1", config_entry=source, suggested_object_id="kitchen_display")
    assert display.entity_id == "notify.kitchen_display"
    ent_reg.async_update_entity(display.entity_id, new_entity_id="notify.kitchen_wall_display")
    await hass.async_block_till_done()

    assert hass.config_entries.async_get_entry(global_entry.entry_id).options[CONF_NOTIFY_SERVICE] == "notify.kitchen_wall_display"


async def test_an_unrelated_rename_leaves_the_notification_target_alone(hass: HomeAssistant) -> None:
    global_entry = make_global_entry(hass, options={CONF_NOTIFY_SERVICE: "notify.mobile_app_phone"})
    await setup_integration(hass, global_entry)
    ent_reg = er.async_get(hass)
    source = MockConfigEntry(domain="demo_notify", title="demo")
    source.add_to_hass(hass)
    other = ent_reg.async_get_or_create("notify", "demo_notify", "display_2", config_entry=source, suggested_object_id="hall_display")
    ent_reg.async_update_entity(other.entity_id, new_entity_id="notify.hallway_display")
    await hass.async_block_till_done()
    assert hass.config_entries.async_get_entry(global_entry.entry_id).options[CONF_NOTIFY_SERVICE] == "notify.mobile_app_phone"


async def test_a_sensor_renamed_before_adoption_is_still_proposed(hass: HomeAssistant) -> None:
    """Viomi SE names its entities ('Filter Life') and sets no translation
    key — the catalog matched the entity-id suffix only. Renamed, the id says
    nothing; the integration's own name still does."""
    await setup_integration(hass, make_global_entry(hass))
    source = MockConfigEntry(domain="viomise", title="viomise")
    source.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(config_entry_id=source.entry_id, identifiers={("viomise", "v1")}, name="Viomi SE")
    ent_reg = er.async_get(hass)
    sensor = ent_reg.async_get_or_create(
        "sensor", "viomise", "v1_filter_life", config_entry=source, device_id=device.id, original_name="Filter Life", suggested_object_id="viomi_se_filter_life"
    )
    ent_reg.async_update_entity(sensor.entity_id, new_entity_id="sensor.upstairs_robot_air_filter")
    hass.states.async_set("sensor.upstairs_robot_air_filter", "62", {"unit_of_measurement": "%"})

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}
    proposed = {t["task_name"]: t for t in setups[device.id]["tasks"]}
    assert "Replace Filter" in proposed
    assert proposed["Replace Filter"]["entity_ids"] == ["sensor.upstairs_robot_air_filter"]
