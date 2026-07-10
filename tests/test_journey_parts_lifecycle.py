"""Journeys S2–S6: the spare-parts shelf through the object lifecycle.

Delete mid-episode, Replace…, pause/resume, backup/restore, and the
crash-orphan boot reconciliation — each across the persistence boundary.
"""

from __future__ import annotations

import json

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import CONF_PARTS, CONF_TASKS, DOMAIN, GLOBAL_UNIQUE_ID
from custom_components.maintenance_supporter.export import build_export_data
from custom_components.maintenance_supporter.helpers.parts import PART_REF_FIELD, normalize_part
from custom_components.maintenance_supporter.parts_runtime import async_reconcile_buy_tasks
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


def _shelf_object(hass: HomeAssistant, uid: str) -> MockConfigEntry:
    part = normalize_part(
        {
            "id": "p1",
            "name": "Anode rod",
            "reorder_threshold": 0,
            "restock_quantity": 1,
            "auto_buy_task": True,
            "storage_location": "Garage shelf 2",
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
        unique_id=uid,
    )
    entry.add_to_hass(hass)
    return entry


def _buy_tasks_for(entry: MockConfigEntry, part_id: str) -> dict[str, dict]:
    return {
        tid: td
        for tid, td in entry.data[CONF_TASKS].items()
        if (td.get(PART_REF_FIELD) or {}).get("part_id") == part_id
    }


async def _make_low_with_reminder(hass: HomeAssistant, entry: MockConfigEntry) -> MockConfigEntry:
    entry.runtime_data.store.set_part_stock("p1", 0)
    await entry.runtime_data.store.async_save()
    await async_reconcile_buy_tasks(hass, entry)
    await hass.async_block_till_done()
    entry = hass.config_entries.async_get_entry(entry.entry_id)
    assert len(_buy_tasks_for(entry, "p1")) == 1
    return entry


async def test_journey_part_deleted_mid_episode(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """S2: deleting a part mid-low-episode cleans everything — the open
    reminder, the task-side link, the stock state — and stays clean across a
    restart (no orphans resurrect)."""
    from custom_components.maintenance_supporter.websocket.parts import ws_delete_part

    entry = _shelf_object(hass, "maintenance_supporter_s2")
    await setup_integration(hass, global_entry, entry)
    entry = await _make_low_with_reminder(hass, entry)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_delete_part,
        hass,
        conn,
        {"id": 1, "type": "maintenance_supporter/part/delete", "entry_id": entry.entry_id, "part_id": "p1"},
    )
    await hass.async_block_till_done()
    entry = hass.config_entries.async_get_entry(entry.entry_id)
    assert "p1" not in (entry.data.get(CONF_PARTS) or {})
    assert len(_buy_tasks_for(entry, "p1")) == 0, "open reminder must go with its part"
    assert "consumes_parts" not in entry.data[CONF_TASKS][TASK_ID_1]
    assert entry.runtime_data.store.get_part_stock("p1") is None

    await simulate_restart(hass, global_entry, entry)
    await hass.async_block_till_done()
    entry = hass.config_entries.async_get_entry(entry.entry_id)
    assert len(_buy_tasks_for(entry, "p1")) == 0
    assert entry.runtime_data.store.get_part_stock("p1") is None


async def test_journey_replace_carries_the_parts_shelf(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """S3: the machine dies — Replace… carries the spares shelf to the
    successor: definitions with fresh ids, remapped consumption links, the
    tracked stock — and NO copied reminder (the successor's own reconcile
    recreates one because the carried part is still low)."""
    from custom_components.maintenance_supporter.websocket.objects import ws_replace_object

    entry = _shelf_object(hass, "maintenance_supporter_s3")
    await setup_integration(hass, global_entry, entry)
    entry = await _make_low_with_reminder(hass, entry)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_replace_object,
        hass,
        conn,
        {"id": 1, "type": "maintenance_supporter/object/replace", "entry_id": entry.entry_id, "name": "Water Heater II"},
    )
    assert not conn.send_error.called, conn.send_error.call_args
    new_entry_id = conn.send_result.call_args[0][1]["entry_id"]
    await hass.async_block_till_done()
    await hass.async_block_till_done()

    successor = hass.config_entries.async_get_entry(new_entry_id)
    parts = successor.data.get(CONF_PARTS) or {}
    assert len(parts) == 1, "part definition not carried"
    (new_pid,) = parts.keys()
    assert new_pid != "p1", "part id must be regenerated"
    assert parts[new_pid]["storage_location"] == "Garage shelf 2"
    assert successor.runtime_data.store.get_part_stock(new_pid) == 0, "tracked stock not carried"

    consuming = [td for td in successor.data[CONF_TASKS].values() if td.get("consumes_parts")]
    assert len(consuming) == 1
    assert consuming[0]["consumes_parts"] == [{"part_id": new_pid, "quantity": 1}]

    assert len(_buy_tasks_for(successor, new_pid)) == 1, "successor's reconcile should recreate the reminder"


async def test_journey_paused_object_stays_quiet(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """S4: pausing an object suppresses shopping reminders — the open reminder
    is removed while inert, and resume brings it back via the setup catch-up."""
    from custom_components.maintenance_supporter.websocket.objects import (
        ws_pause_object,
        ws_resume_object,
    )

    entry = _shelf_object(hass, "maintenance_supporter_s4")
    await setup_integration(hass, global_entry, entry)
    entry = await _make_low_with_reminder(hass, entry)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_pause_object,
        hass,
        conn,
        {"id": 1, "type": "maintenance_supporter/object/pause", "entry_id": entry.entry_id},
    )
    assert not conn.send_error.called, conn.send_error.call_args
    await hass.async_block_till_done()
    # The pause reload schedules the catch-up reconcile; let it run + reload.
    await hass.async_block_till_done()
    entry = hass.config_entries.async_get_entry(entry.entry_id)
    assert len(_buy_tasks_for(entry, "p1")) == 0, "paused object must not keep shopping reminders"

    conn = make_ws_connection()
    await call_ws_handler(
        ws_resume_object,
        hass,
        conn,
        {"id": 2, "type": "maintenance_supporter/object/resume", "entry_id": entry.entry_id},
    )
    assert not conn.send_error.called
    await hass.async_block_till_done()
    await hass.async_block_till_done()
    entry = hass.config_entries.async_get_entry(entry.entry_id)
    assert len(_buy_tasks_for(entry, "p1")) == 1, "resume must bring the reminder back (part still low)"


async def test_journey_backup_restore_keeps_the_shelf(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """S5: JSON backup → restore as a copy → restart. The shelf survives:
    definitions, tracked stock, remapped links — and the restored copy's
    reconcile creates its own reminder for the still-low part."""
    from custom_components.maintenance_supporter.websocket.io import ws_import_json

    entry = _shelf_object(hass, "maintenance_supporter_s5")
    await setup_integration(hass, global_entry, entry)
    entry.runtime_data.store.set_part_stock("p1", 0)
    await entry.runtime_data.store.async_save()

    data = build_export_data(hass, include_history=True)
    exported = next(e for e in data["objects"] if e["object"]["name"] == "Water Heater")
    exported["object"]["name"] = "Water Heater Restored"
    conn = make_ws_connection()
    await call_ws_handler(
        ws_import_json,
        hass,
        conn,
        {"id": 1, "type": "maintenance_supporter/json/import", "json_content": json.dumps({"objects": [exported]})},
    )
    assert conn.send_result.call_args[0][1]["created"] == 1
    await hass.async_block_till_done()
    await hass.async_block_till_done()

    copy = next(e for e in hass.config_entries.async_entries(DOMAIN) if e.title == "Water Heater Restored")
    (new_pid,) = (copy.data.get(CONF_PARTS) or {}).keys()
    assert copy.runtime_data.store.get_part_stock(new_pid) == 0

    await simulate_restart(hass, global_entry, copy)
    await hass.async_block_till_done()
    await hass.async_block_till_done()
    copy = hass.config_entries.async_get_entry(copy.entry_id)
    assert copy.runtime_data.store.get_part_stock(new_pid) == 0
    assert len(_buy_tasks_for(copy, new_pid)) == 1, "restored low part must get its own reminder"


async def test_journey_orphaned_stock_pruned_at_boot(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """S6 (journey-I1 twin): a crash between the ConfigEntry write and the
    Store save on a part deletion leaves stock state orphaned — boot
    reconciliation prunes it while real parts keep theirs."""
    entry = _shelf_object(hass, "maintenance_supporter_s6")
    await setup_integration(hass, global_entry, entry)
    entry.runtime_data.store.set_part_stock("p1", 3)
    entry.runtime_data.store.set_part_stock("ghost-part", 5)
    await entry.runtime_data.store.async_save()

    await simulate_restart(hass, global_entry, entry)
    await hass.async_block_till_done()
    entry = hass.config_entries.async_get_entry(entry.entry_id)
    assert entry.runtime_data.store.get_part_stock("ghost-part") is None, "orphaned stock must be pruned"
    assert entry.runtime_data.store.get_part_stock("p1") == 3, "real stock must survive the prune"
