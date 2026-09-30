"""A new device for an object: the wiring follows it (Replace object, relink).

*Replace object* copied the old unit's device link onto the successor, so the
new machine's object kept watching the retired machine's sensors, pressed its
reset button on completion, and discovery treated the old device as still
taken. The new unit is usually a new device in Home Assistant; choosing it —
in the replace dialog or later in the object's settings — now moves the
sensor triggers, completion-action targets and adopted-task fingerprints to
the matching entities of that device.
"""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import CONF_OBJECT, CONF_TASKS
from custom_components.maintenance_supporter.helpers.device_swap import move_tasks_to_device, old_device_ids
from custom_components.maintenance_supporter.helpers.problem_sensors import _object_by_device
from custom_components.maintenance_supporter.websocket.objects import ws_replace_object, ws_update_object

from .conftest import (
    build_object_data,
    build_task_data,
    call_ws_handler,
    make_global_entry,
    make_object_entry,
    make_ws_connection,
    setup_integration,
)


def _vacuum(hass: HomeAssistant, serial: str, name: str) -> tuple[dr.DeviceEntry, dict[str, str]]:
    """A robot vacuum device with the entities an integration names the same
    way on every unit: a brush-life sensor, a filter sensor, a reset button."""
    entry = MockConfigEntry(domain="roborock", title=name)
    entry.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(
        config_entry_id=entry.entry_id, identifiers={("roborock", serial)}, name=name
    )
    ent_reg = er.async_get(hass)
    ids: dict[str, str] = {}
    for domain, key, label in (
        ("sensor", "main_brush_time_left", "Main brush time left"),
        ("sensor", "filter_time_left", "Filter time left"),
        ("button", "reset_main_brush_consumable", "Reset main brush consumable"),
    ):
        created = ent_reg.async_get_or_create(
            domain,
            "roborock",
            f"{serial}_{key}",
            config_entry=entry,
            device_id=device.id,
            translation_key=key,
            original_name=label,
            suggested_object_id=f"{name.lower().replace(' ', '_')}_{key}",
        )
        ids[key] = created.entity_id
    return device, ids


def _brush_task(old: dict[str, str], device_id: str, *, outdoor: str | None = None) -> dict[str, Any]:
    task: dict[str, Any] = build_task_data(task_id="brush", name="Replace main brush")
    task["trigger_config"] = {
        "type": "threshold",
        "entity_ids": [old["main_brush_time_left"], *([outdoor] if outdoor else [])],
        "trigger_below": 10,
    }
    task["on_complete_action"] = {"service": "button.press", "target": {"entity_id": old["reset_main_brush_consumable"]}}
    task["origin"] = {
        "kind": "integration",
        "integration": "roborock",
        "duty": "Replace Main Brush",
        "direction": "duration_left",
        "device_id": device_id,
    }
    return task


# ─── the rewrite itself ───────────────────────────────────────────────────


async def test_triggers_actions_and_origin_follow_the_new_device(hass: HomeAssistant) -> None:
    old_dev, old = _vacuum(hass, "q7_old", "Robot Old")
    new_dev, new = _vacuum(hass, "q7_new", "Robot New")
    hass.states.async_set("sensor.outdoor_temperature", "12")
    tasks = {"brush": _brush_task(old, old_dev.id, outdoor="sensor.outdoor_temperature")}

    moved, report = move_tasks_to_device(hass, tasks, {old_dev.id}, new_dev.id)

    task = moved["brush"]
    assert task["trigger_config"]["entity_ids"] == [new["main_brush_time_left"], "sensor.outdoor_temperature"]
    assert task["on_complete_action"]["target"]["entity_id"] == new["reset_main_brush_consumable"]
    assert task["origin"]["device_id"] == new_dev.id
    assert report.as_dict() == {"moved": 2, "unmatched": []}
    # The input is left alone — callers write the copies.
    assert tasks["brush"]["trigger_config"]["entity_ids"][0] == old["main_brush_time_left"]


async def test_a_link_counts_once_though_the_trigger_names_it_twice(hass: HomeAssistant) -> None:
    """A stored trigger keeps the legacy `entity_id` beside `entity_ids`; the
    live replace reported "3 sensor links moved" for a trigger and a reset."""
    old_dev, old = _vacuum(hass, "q7_old", "Robot Old")
    new_dev, new = _vacuum(hass, "q7_new", "Robot New")
    task = _brush_task(old, old_dev.id)
    task["trigger_config"]["entity_id"] = old["main_brush_time_left"]

    moved, report = move_tasks_to_device(hass, {"brush": task}, {old_dev.id}, new_dev.id)

    assert moved["brush"]["trigger_config"]["entity_id"] == new["main_brush_time_left"]
    assert report.moved == 2


async def test_an_entity_without_a_counterpart_is_reported_not_guessed(hass: HomeAssistant) -> None:
    old_dev, old = _vacuum(hass, "q7_old", "Robot Old")
    other_entry = MockConfigEntry(domain="acme", title="Acme")
    other_entry.add_to_hass(hass)
    new_dev = dr.async_get(hass).async_get_or_create(
        config_entry_id=other_entry.entry_id, identifiers={("acme", "x")}, name="Acme thing"
    )
    tasks = {"brush": _brush_task(old, old_dev.id)}

    moved, report = move_tasks_to_device(hass, tasks, {old_dev.id}, new_dev.id)

    assert moved["brush"]["trigger_config"]["entity_ids"] == [old["main_brush_time_left"]]
    assert set(report.unmatched) == {old["main_brush_time_left"], old["reset_main_brush_consumable"]}
    assert report.moved == 0


async def test_a_dangling_entity_needs_more_than_one_shared_word(hass: HomeAssistant) -> None:
    """With no registry entry nothing proves the entity WAS the old device's;
    "…_temperature" alone must not rewire a trigger to the new vacuum."""
    old_dev, _old = _vacuum(hass, "q7_old", "Robot Old")
    new_dev, new = _vacuum(hass, "q7_new", "Robot New")
    task = build_task_data(task_id="t", name="Check")
    task["trigger_config"] = {
        "type": "threshold",
        "entity_ids": ["sensor.gone_filter_time_left", "sensor.gone_temperature"],
        "trigger_below": 5,
    }

    moved, report = move_tasks_to_device(hass, {"t": task}, {old_dev.id}, new_dev.id)

    assert moved["t"]["trigger_config"]["entity_ids"] == [new["filter_time_left"], "sensor.gone_temperature"]
    assert report.unmatched == ["sensor.gone_temperature"]


async def test_compound_conditions_device_targets_and_lists_move_too(hass: HomeAssistant) -> None:
    old_dev, old = _vacuum(hass, "q7_old", "Robot Old")
    new_dev, new = _vacuum(hass, "q7_new", "Robot New")
    task = build_task_data(task_id="t", name="Brush and filter")
    task["trigger_config"] = {
        "type": "compound",
        "logic": "AND",
        "conditions": [
            {"type": "threshold", "entity_id": old["main_brush_time_left"], "trigger_below": 5},
            {"type": "threshold", "entity_ids": [old["filter_time_left"], None, ""], "trigger_below": 5},
            "junk",
        ],
    }
    task["on_complete_action"] = {
        "service": "button.press",
        "target": {"entity_id": [old["reset_main_brush_consumable"]], "device_id": [old_dev.id, "other"]},
    }
    start = build_task_data(task_id="u", name="Start")
    start["on_complete_action"] = {"service": "vacuum.start", "target": {"device_id": old_dev.id}}
    start["origin"] = {"kind": "integration", "device_id": "someone_else"}

    moved, report = move_tasks_to_device(hass, {"t": task, "u": start}, {old_dev.id}, new_dev.id)

    conditions = moved["t"]["trigger_config"]["conditions"]
    assert conditions[0]["entity_id"] == new["main_brush_time_left"]
    assert conditions[1]["entity_ids"] == [new["filter_time_left"], None, ""]
    assert conditions[2] == "junk"
    assert moved["t"]["on_complete_action"]["target"] == {
        "entity_id": [new["reset_main_brush_consumable"]],
        "device_id": [new_dev.id, "other"],
    }
    assert moved["u"]["on_complete_action"]["target"]["device_id"] == new_dev.id
    assert moved["u"]["origin"]["device_id"] == "someone_else"
    assert report.as_dict() == {"moved": 3, "unmatched": []}


async def test_counterparts_by_name_by_key_and_name_and_the_enabled_twin(hass: HomeAssistant) -> None:
    """Integrations without translation keys are matched by the entity's
    name; a key shared by several entities by key AND name; of two equal
    candidates the enabled one."""
    entry = MockConfigEntry(domain="acme", title="Acme")
    entry.add_to_hass(hass)
    dev_reg, ent_reg = dr.async_get(hass), er.async_get(hass)
    old_dev = dev_reg.async_get_or_create(config_entry_id=entry.entry_id, identifiers={("acme", "old")}, name="Old")
    new_dev = dev_reg.async_get_or_create(config_entry_id=entry.entry_id, identifiers={("acme", "new")}, name="New")
    other_dev = dev_reg.async_get_or_create(config_entry_id=entry.entry_id, identifiers={("acme", "kitchen")}, name="Kitchen")

    def add(uid: str, device: dr.DeviceEntry, object_id: str, **kw: Any) -> str:
        return ent_reg.async_get_or_create(
            "sensor", "acme", uid, config_entry=entry, device_id=device.id, suggested_object_id=object_id, **kw
        ).entity_id

    old_hardness = add("o1", old_dev, "old_hardness_x", original_name="Water hardness")
    new_hardness = add("n1", new_dev, "new_thing_y", original_name="Water hardness")
    old_salt = add("o2", old_dev, "old_salt_q", translation_key="level", original_name="Salt level")
    new_salt = add("n2", new_dev, "new_salt_r", translation_key="level", original_name="Salt level")
    add("n3", new_dev, "new_rinse_s", translation_key="level", original_name="Rinse aid level")
    old_filter = add("o4", old_dev, "old_filter_t", translation_key="filter")
    new_filter = add("n4", new_dev, "new_filter_u", translation_key="filter")
    add("n5", new_dev, "new_filter_v", translation_key="filter", disabled_by=er.RegistryEntryDisabler.USER)
    kitchen = add("k1", other_dev, "kitchen_humidity", original_name="Humidity")
    already = add("n6", new_dev, "new_door", original_name="Door")
    task = build_task_data(task_id="t", name="Check")
    task["trigger_config"] = {
        "type": "threshold",
        "entity_ids": [old_hardness, old_salt, old_filter, kitchen, already],
        "trigger_above": 5,
    }

    moved, report = move_tasks_to_device(hass, {"t": task}, {old_dev.id}, new_dev.id)

    assert moved["t"]["trigger_config"]["entity_ids"] == [new_hardness, new_salt, new_filter, kitchen, already]
    assert report.as_dict() == {"moved": 3, "unmatched": []}


async def test_nothing_to_move_from_returns_the_tasks_as_they_are(hass: HomeAssistant) -> None:
    tasks: dict[str, dict[str, Any]] = {"t": {"trigger_config": {"entity_ids": ["sensor.x"]}}}
    moved, report = move_tasks_to_device(hass, tasks, set(), "new")
    assert moved is tasks and report.as_dict() == {"moved": 0, "unmatched": []}


def test_the_old_devices_are_the_link_and_the_fingerprints() -> None:
    tasks = [{"origin": {"device_id": "d2"}}, {"origin": {"kind": "template"}}, {}]
    assert old_device_ids({"ha_device_id": "d1"}, tasks, "new") == {"d1", "d2"}
    assert old_device_ids({"ha_device_id": "new"}, tasks, "new") == {"d2"}


# ─── Replace object ───────────────────────────────────────────────────────


async def _linked_object(hass: HomeAssistant) -> tuple[MockConfigEntry, dr.DeviceEntry, dict[str, str]]:
    old_dev, old = _vacuum(hass, "q7_old", "Robot Old")
    g = make_global_entry(hass)
    obj = build_object_data(name="Robot", object_id="robot")
    obj["ha_device_id"] = old_dev.id
    entry = make_object_entry(hass, tasks={"brush": _brush_task(old, old_dev.id)}, name="Robot", uid="robot", object_data=obj)
    await setup_integration(hass, g, entry)
    return entry, old_dev, old


async def _replace(hass: HomeAssistant, entry_id: str, **extra: Any) -> dict[str, Any]:
    conn = make_ws_connection()
    await call_ws_handler(
        ws_replace_object, hass, conn, {"id": 1, "type": "maintenance_supporter/object/replace", "entry_id": entry_id, **extra}
    )
    await hass.async_block_till_done()
    assert not conn.send_error.called, conn.send_error.call_args
    return dict(conn.send_result.call_args[0][1])


async def test_replacing_onto_the_new_units_device_moves_the_wiring(hass: HomeAssistant) -> None:
    entry, old_dev, old = await _linked_object(hass)
    new_dev, new = _vacuum(hass, "q7_new", "Robot New")

    result = await _replace(hass, entry.entry_id, ha_device_id=new_dev.id)

    successor = hass.config_entries.async_get_entry(result["entry_id"])
    assert successor.data[CONF_OBJECT]["ha_device_id"] == new_dev.id
    (task,) = successor.data[CONF_TASKS].values()
    assert task["trigger_config"]["entity_ids"] == [new["main_brush_time_left"]]
    assert task["on_complete_action"]["target"]["entity_id"] == new["reset_main_brush_consumable"]
    assert task["origin"]["device_id"] == new_dev.id
    assert result["device_swap"] == {"moved": 2, "unmatched": []}
    # The retired unit keeps its record of the old device.
    assert entry.data[CONF_OBJECT]["ha_device_id"] == old_dev.id


async def test_replacing_without_a_choice_keeps_the_device(hass: HomeAssistant) -> None:
    """API compatibility: omitted = the same device (a controller or smart
    plug that stays); the panel always asks."""
    entry, old_dev, old = await _linked_object(hass)

    result = await _replace(hass, entry.entry_id)

    successor = hass.config_entries.async_get_entry(result["entry_id"])
    assert successor.data[CONF_OBJECT]["ha_device_id"] == old_dev.id
    assert "device_swap" not in result


async def test_replacing_with_no_device_unlinks_the_successor(hass: HomeAssistant) -> None:
    entry, _old_dev, old = await _linked_object(hass)

    result = await _replace(hass, entry.entry_id, ha_device_id=None)

    successor = hass.config_entries.async_get_entry(result["entry_id"])
    assert successor.data[CONF_OBJECT].get("ha_device_id") is None
    (task,) = successor.data[CONF_TASKS].values()
    assert task["trigger_config"]["entity_ids"] == [old["main_brush_time_left"]]


async def test_discovery_never_offers_the_retired_object(hass: HomeAssistant) -> None:
    """Both the archived predecessor and its successor link the same device
    when it stays; which one discovery reported depended on entry order."""
    entry, old_dev, _old = await _linked_object(hass)
    result = await _replace(hass, entry.entry_id)

    assert _object_by_device(hass)[old_dev.id]["entry_id"] == result["entry_id"]


# ─── relinking later, in the object's settings ────────────────────────────


async def test_linking_the_new_device_later_moves_the_wiring(hass: HomeAssistant) -> None:
    entry, _old_dev, _old = await _linked_object(hass)
    new_dev, new = _vacuum(hass, "q7_new", "Robot New")
    conn = make_ws_connection()

    await call_ws_handler(
        ws_update_object,
        hass,
        conn,
        {"id": 2, "type": "maintenance_supporter/object/update", "entry_id": entry.entry_id, "ha_device_id": new_dev.id},
    )
    await hass.async_block_till_done()

    assert conn.send_result.call_args[0][1]["device_swap"] == {"moved": 2, "unmatched": []}
    task = entry.data[CONF_TASKS]["brush"]
    assert task["trigger_config"]["entity_ids"] == [new["main_brush_time_left"]]
    assert entry.data[CONF_OBJECT]["ha_device_id"] == new_dev.id


async def test_an_edit_without_a_device_change_moves_nothing(hass: HomeAssistant) -> None:
    entry, old_dev, old = await _linked_object(hass)
    conn = make_ws_connection()

    await call_ws_handler(
        ws_update_object,
        hass,
        conn,
        {"id": 3, "type": "maintenance_supporter/object/update", "entry_id": entry.entry_id, "ha_device_id": old_dev.id, "notes": "x"},
    )

    assert "device_swap" not in conn.send_result.call_args[0][1]
    assert entry.data[CONF_TASKS]["brush"]["trigger_config"]["entity_ids"] == [old["main_brush_time_left"]]
