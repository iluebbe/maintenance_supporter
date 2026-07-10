"""Journey: the spare-parts loop survives a restart.

Consume → low crossing → auto buy task → RESTART (stock + open reminder must
persist) → complete the buy task with a dialog qty → restocked, reminder
detached, next episode re-arms.
"""

from __future__ import annotations

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import CONF_PARTS, CONF_TASKS, DOMAIN, GLOBAL_UNIQUE_ID
from custom_components.maintenance_supporter.helpers.parts import PART_REF_FIELD, normalize_part
from tests.conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    setup_integration,
)
from tests.journey import simulate_restart


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


def _buy_tasks(entry: MockConfigEntry) -> dict[str, dict]:
    return {
        tid: td
        for tid, td in entry.data[CONF_TASKS].items()
        if (td.get(PART_REF_FIELD) or {}).get("part_id") == "p1"
    }


async def test_journey_parts_loop_across_restart(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    part = normalize_part(
        {
            "id": "p1",
            "name": "Anode rod",
            "reorder_threshold": 0,
            "restock_quantity": 1,
            "auto_buy_task": True,
            "storage_location": "Garage shelf 2",
            "cost": 30.0,
        }
    )
    task = build_task_data(name="Replace anode", last_performed="2026-01-01")
    task["consumes_parts"] = [{"part_id": "p1", "quantity": 1}]
    data = build_object_entry_data(object_data=build_object_data(name="Water Heater"), tasks={TASK_ID_1: task})
    data[CONF_PARTS] = {"p1": part}
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Water Heater",
        data=data,
        source="user",
        unique_id="maintenance_supporter_wh_journey",
    )
    entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, entry)
    entry.runtime_data.store.set_part_stock("p1", 1)
    await entry.runtime_data.store.async_save()

    # 1. Consume the last spare → 1→0 crosses the threshold → buy task.
    await entry.runtime_data.coordinator.complete_maintenance(TASK_ID_1)
    await hass.async_block_till_done()
    entry = hass.config_entries.async_get_entry(entry.entry_id)
    assert entry.runtime_data.store.get_part_stock("p1") == 0
    assert len(_buy_tasks(entry)) == 1

    # 2. Restart: stock, part definition and the OPEN reminder persist; the
    #    reconcile-at-load must not duplicate it (declarative idempotence).
    await simulate_restart(hass, global_entry, entry)
    await hass.async_block_till_done()
    entry = hass.config_entries.async_get_entry(entry.entry_id)
    assert entry.runtime_data.store.get_part_stock("p1") == 0
    assert entry.data[CONF_PARTS]["p1"]["storage_location"] == "Garage shelf 2"
    buy = _buy_tasks(entry)
    assert len(buy) == 1, "open reminder lost or duplicated across restart"
    buy_id = next(iter(buy))

    # 3. Complete the reminder with a dialog qty of 2 → stock 0+2, above the
    #    threshold → the completed reminder detaches (keeps its history).
    await entry.runtime_data.coordinator.complete_maintenance(buy_id, cost=59.9, restock_quantity=2)
    await hass.async_block_till_done()
    entry = hass.config_entries.async_get_entry(entry.entry_id)
    assert entry.runtime_data.store.get_part_stock("p1") == 2
    assert len(_buy_tasks(entry)) == 0, "marker should be detached after restock"
    assert buy_id in entry.data[CONF_TASKS], "completed reminder (cost history) must survive"

    # 4. Next episode re-arms after another restart + consumptions: 2→1→0.
    await simulate_restart(hass, global_entry, entry)
    await hass.async_block_till_done()
    entry = hass.config_entries.async_get_entry(entry.entry_id)
    await entry.runtime_data.coordinator.complete_maintenance(TASK_ID_1)
    await hass.async_block_till_done()
    # The manual double-tap dedup uses time.monotonic (freeze_time can't move
    # it) — a restart rebuilds the coordinator and clears the window.
    entry = hass.config_entries.async_get_entry(entry.entry_id)
    await simulate_restart(hass, global_entry, entry)
    await hass.async_block_till_done()
    entry = hass.config_entries.async_get_entry(entry.entry_id)
    await entry.runtime_data.coordinator.complete_maintenance(TASK_ID_1)
    await hass.async_block_till_done()
    entry = hass.config_entries.async_get_entry(entry.entry_id)
    assert entry.runtime_data.store.get_part_stock("p1") == 0
    fresh = _buy_tasks(entry)
    assert len(fresh) == 1 and next(iter(fresh)) != buy_id, "fresh episode must create a NEW reminder"
