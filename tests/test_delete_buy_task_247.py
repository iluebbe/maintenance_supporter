"""#247: a deleted buy task came straight back.

A buy task belongs to its part: while the part stays below its reorder
threshold with *Auto-create buy task when low* on, the next reconcile (the
reload right after the delete) creates it again, so deleting it "never
worked". The delete dialog now offers to turn the part's reminder off with it
(`task/delete` with `disable_auto_buy_task`); deleted on its own the task
still comes back, as the dialog says.
"""

from __future__ import annotations

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import CONF_OBJECT, CONF_PARTS, CONF_TASKS, DOMAIN, GLOBAL_UNIQUE_ID
from custom_components.maintenance_supporter.helpers.parts import PART_REF_FIELD, normalize_part
from custom_components.maintenance_supporter.websocket.tasks_crud import ws_delete_task
from tests.conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    make_ws_connection,
    setup_integration,
)


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


def _buy_tasks(hass: HomeAssistant, entry_id: str) -> list[str]:
    entry = hass.config_entries.async_get_entry(entry_id)
    assert entry is not None
    return [tid for tid, td in entry.data[CONF_TASKS].items() if (td.get(PART_REF_FIELD) or {}).get("part_id") == "p1"]


async def _robot_with_low_part(hass: HomeAssistant, global_entry: MockConfigEntry) -> MockConfigEntry:
    part = normalize_part(
        {"id": "p1", "name": "Side brush", "reorder_threshold": 1, "restock_quantity": 2, "auto_buy_task": True}
    )
    data = build_object_entry_data(object_data=build_object_data(name="Roborock"), tasks={})
    data[CONF_PARTS] = {"p1": part}
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Roborock",
        data=data,
        source="user",
        unique_id="maintenance_supporter_robot_247",
    )
    entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, entry)
    entry.runtime_data.store.set_part_stock("p1", 0)
    await entry.runtime_data.store.async_save()
    # A reload re-plans the buy tasks: the part is low → one reminder.
    await hass.config_entries.async_reload(entry.entry_id)
    await hass.async_block_till_done()
    assert len(_buy_tasks(hass, entry.entry_id)) == 1
    return entry


async def _delete(hass: HomeAssistant, entry_id: str, task_id: str, **extra: object) -> None:
    conn = make_ws_connection()
    await call_ws_handler(
        ws_delete_task,
        hass,
        conn,
        {"id": 1, "type": "maintenance_supporter/task/delete", "entry_id": entry_id, "task_id": task_id, **extra},
    )
    conn.send_result.assert_called_once()
    await hass.async_block_till_done()


async def test_deleted_on_its_own_the_buy_task_comes_back(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """What the reporter saw, and what the dialog now says: the part is still
    low and still wants its reminder."""
    entry = await _robot_with_low_part(hass, global_entry)
    first = _buy_tasks(hass, entry.entry_id)[0]
    await _delete(hass, entry.entry_id, first)
    again = _buy_tasks(hass, entry.entry_id)
    assert len(again) == 1 and again[0] != first
    current = hass.config_entries.async_get_entry(entry.entry_id)
    assert current is not None and current.data[CONF_PARTS]["p1"]["auto_buy_task"] is True


async def test_delete_with_the_reminder_off_stays_deleted(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    entry = await _robot_with_low_part(hass, global_entry)
    buy = _buy_tasks(hass, entry.entry_id)[0]
    await _delete(hass, entry.entry_id, buy, disable_auto_buy_task=True)
    current = hass.config_entries.async_get_entry(entry.entry_id)
    assert current is not None
    assert buy not in current.data[CONF_TASKS]
    assert current.data[CONF_PARTS]["p1"]["auto_buy_task"] is False
    assert current.data[CONF_PARTS]["p1"]["name"] == "Side brush", "the rest of the part stays"
    # Another reload (a restart, a stock change) plans nothing for it.
    await hass.config_entries.async_reload(entry.entry_id)
    await hass.async_block_till_done()
    assert _buy_tasks(hass, entry.entry_id) == []
    assert current.runtime_data.store.get_part_stock("p1") == 0, "the stock is not touched"


async def test_the_flag_on_an_ordinary_task_changes_no_part(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    entry = await _robot_with_low_part(hass, global_entry)
    current = hass.config_entries.async_get_entry(entry.entry_id)
    assert current is not None
    tasks = dict(current.data[CONF_TASKS])
    tasks[TASK_ID_1] = build_task_data(name="Clean the sensors")
    obj = dict(current.data[CONF_OBJECT])
    obj["task_ids"] = [*obj.get("task_ids", []), TASK_ID_1]
    hass.config_entries.async_update_entry(current, data={**current.data, CONF_TASKS: tasks, CONF_OBJECT: obj})
    await hass.config_entries.async_reload(entry.entry_id)
    await hass.async_block_till_done()

    await _delete(hass, entry.entry_id, TASK_ID_1, disable_auto_buy_task=True)
    current = hass.config_entries.async_get_entry(entry.entry_id)
    assert current is not None
    assert TASK_ID_1 not in current.data[CONF_TASKS]
    assert current.data[CONF_PARTS]["p1"]["auto_buy_task"] is True
    assert len(_buy_tasks(hass, entry.entry_id)) == 1
