"""#221: a copied object failed to set up, every time.

The task dialog sends ``trigger_config: null`` on every save of a task
without a sensor trigger, and ``task/update`` stored it. The object itself
kept working, its Store already existed. A copy (and a replacement, and an
import of such a task) is a new entry whose first setup moves the dynamic
fields into the Store, and that step called ``dict(None)``: "Setup error",
and reload, reconfigure or disable / enable all hit it again.

A task without a trigger has no ``trigger_config`` now: the one normalizer
every write goes through drops a null, and the first setup tolerates one,
so a copy the old code left broken loads after the update with no hand edit.
"""

from __future__ import annotations

import json
from typing import Any

from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import CONF_TASKS, DOMAIN, GLOBAL_UNIQUE_ID

from .conftest import (
    TASK_ID_1,
    assert_ws_success,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    make_ws_connection,
    setup_integration,
)


def _global(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN, title="Maintenance Supporter",
        data=build_global_entry_data(), source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


def _object(name: str = "Storeroom door", **task_extra: Any) -> MockConfigEntry:
    task = {**build_task_data(name="Oil the hinges"), **task_extra}
    data = build_object_entry_data(object_data=build_object_data(name=name), tasks={TASK_ID_1: task})
    return MockConfigEntry(version=1, minor_version=4, domain=DOMAIN, title=name, data=data, source="user", unique_id=f"ms_221_{name}")


async def _ws(hass: HomeAssistant, handler: Any, msg: dict[str, Any]) -> Any:
    conn = make_ws_connection()
    await call_ws_handler(handler, hass, conn, {"id": 1, **msg})
    await hass.async_block_till_done()
    return assert_ws_success(conn)


def _task(hass: HomeAssistant, entry_id: str) -> dict[str, Any]:
    entry = hass.config_entries.async_get_entry(entry_id)
    assert entry is not None
    (task,) = entry.data[CONF_TASKS].values()
    return task


async def test_a_copy_left_broken_loads_after_the_update(hass: HomeAssistant) -> None:
    """The state the old code left: a new entry with the null and no Store yet."""
    broken = _object(trigger_config=None)
    broken.add_to_hass(hass)
    await setup_integration(hass, _global(hass), broken)
    assert broken.state is ConfigEntryState.LOADED
    assert "trigger_config" not in _task(hass, broken.entry_id)


async def test_saving_a_task_without_a_trigger_stores_no_null(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.websocket.tasks_crud import ws_update_task

    obj = _object()
    obj.add_to_hass(hass)
    await setup_integration(hass, _global(hass), obj)
    # What the task dialog sends for a task without a sensor trigger.
    await _ws(hass, ws_update_task, {"type": f"{DOMAIN}/task/update", "entry_id": obj.entry_id, "task_id": TASK_ID_1, "name": "Oil the hinges", "trigger_config": None})
    assert "trigger_config" not in _task(hass, obj.entry_id)


async def test_a_copy_of_a_task_stored_with_the_null_loads(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.websocket.objects import ws_duplicate_object, ws_replace_object

    obj = _object()
    obj.add_to_hass(hass)
    await setup_integration(hass, _global(hass), obj)
    # The task as an older version stored it.
    tasks = {TASK_ID_1: {**_task(hass, obj.entry_id), "trigger_config": None}}
    hass.config_entries.async_update_entry(obj, data={**obj.data, CONF_TASKS: tasks})

    copy_id = (await _ws(hass, ws_duplicate_object, {"type": f"{DOMAIN}/object/duplicate", "entry_id": obj.entry_id}))["entry_id"]
    succ_id = (await _ws(hass, ws_replace_object, {"type": f"{DOMAIN}/object/replace", "entry_id": obj.entry_id}))["entry_id"]
    for new_id in (copy_id, succ_id):
        entry = hass.config_entries.async_get_entry(new_id)
        assert entry is not None and entry.state is ConfigEntryState.LOADED, new_id
        assert "trigger_config" not in _task(hass, new_id)


async def test_an_import_with_the_null_loads(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.websocket.io import ws_import_json

    await setup_integration(hass, _global(hass))
    payload = {"objects": [{"object": {"name": "Imported door"}, "tasks": [{"name": "Oil the hinges", "interval_days": 90, "trigger_config": None}]}]}
    res = await _ws(hass, ws_import_json, {"type": f"{DOMAIN}/json/import", "json_content": json.dumps(payload)})
    entry_id = res["imported"][0]["entry_id"]
    entry = hass.config_entries.async_get_entry(entry_id)
    assert entry is not None and entry.state is ConfigEntryState.LOADED
    assert "trigger_config" not in _task(hass, entry_id)


async def test_a_trigger_state_left_in_the_store_meets_no_trigger(hass: HomeAssistant) -> None:
    """A Store that still holds a trigger's state for a task stored with the
    null: reading the task dict()ed the null as well."""
    from custom_components.maintenance_supporter.storage import MaintenanceStore

    store = MaintenanceStore(hass, "e221")
    store.update_task_state("t1", trigger_runtime={"sensor.x": {"baseline": 3}}, trigger_runtime_legacy={"trigger_baseline": 3})
    merged = store.merge_task_data("t1", {"name": "Oil the hinges", "trigger_config": None})
    assert merged["trigger_config"] is None and "_trigger_state" not in str(merged)
