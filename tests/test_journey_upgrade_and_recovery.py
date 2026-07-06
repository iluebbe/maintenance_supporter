"""Journey backlog batch 3: upgrades, recovery, and portability.

O3 golden-master upgrade (real v1.x-shaped entry data → current code),
I2 damaged Store content at boot, O1 uninstall → reinstall contract,
I4 restore on a foreign instance (dangling device/parent/trigger refs),
O2 export → wipe → import → re-export round-trip.
See docs/design/user-journeys.md.
"""

from __future__ import annotations

import json
from datetime import timedelta
from typing import Any
from unittest.mock import MagicMock

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)

from .conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    setup_integration,
)
from .journey import simulate_restart


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


def _conn() -> MagicMock:
    conn = MagicMock()
    conn.user = MagicMock(is_admin=True)
    return conn


async def _rows(hass: HomeAssistant, entry_id: str) -> list[dict[str, Any]]:
    listed = await hass.services.async_call(
        DOMAIN,
        "list_tasks",
        {"entry_id": entry_id},
        blocking=True,
        return_response=True,
    )
    return list(listed["tasks"])


# ─── O3: golden-master upgrade — v1.x entry data straight into current code ──


async def test_v1_shaped_entry_migrates_end_to_end(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """A minor_version=1 entry as v1.x wrote it: flat recurrence fields, the
    dynamic state (history / last_performed) still inline in entry.data, no
    created_at. One setup must migrate ALL of it: nested schedule, created_at
    backfill, dynamic state moved to the Store — and stay stable across a
    second restart."""
    old_task = {
        "id": TASK_ID_1,
        "object_id": "obj-old",
        "name": "Oil Change",
        "type": "custom",
        "enabled": True,
        "schedule_type": "time_based",
        "interval_days": 90,
        "warning_days": 7,
        # dynamic state as v1.x kept it: inline in entry.data
        "last_performed": "2025-11-05",
        "history": [
            {"timestamp": "2025-08-07T10:00:00", "type": "completed", "cost": 60.0},
            {"timestamp": "2025-11-05T09:00:00", "type": "completed", "cost": 62.0},
        ],
        # no created_at (pre-#30) — last_performed anchors, so no backfill
    }
    never_done_id = "b" * 32
    never_done = {
        "id": never_done_id,
        "object_id": "obj-old",
        "name": "Brake Check",
        "type": "custom",
        "enabled": True,
        "schedule_type": "time_based",
        "interval_days": 365,
        "warning_days": 14,
        # never performed, but skips recorded — the #30 backfill case
        "history": [
            {"timestamp": "2025-09-01T08:00:00", "type": "skipped"},
        ],
    }
    entry = MockConfigEntry(
        version=1,
        minor_version=1,  # v1.x on-disk shape
        domain=DOMAIN,
        title="Old Car",
        data={
            "object": {
                "name": "Old Car",
                "type": "vehicle",
                "task_ids": [TASK_ID_1, never_done_id],
            },
            CONF_TASKS: {TASK_ID_1: old_task, never_done_id: never_done},
        },
        source="user",
        unique_id="maintenance_supporter_o3_golden",
    )
    entry.add_to_hass(hass)

    await setup_integration(hass, global_entry, entry)

    # Schema migration ran and converged on the canonical shape.
    assert entry.minor_version >= 3
    migrated = entry.data[CONF_TASKS][TASK_ID_1]
    assert "schedule" in migrated, "flat recurrence was not nested"
    # Backfill contract (#30): last_performed anchors → NO created_at added;
    # a never-performed task gets created_at from its earliest history entry.
    assert "created_at" not in migrated
    assert entry.data[CONF_TASKS][never_done_id]["created_at"] == "2025-09-01"
    # Dynamic state left entry.data for the Store...
    assert "history" not in migrated
    assert "last_performed" not in migrated
    store = entry.runtime_data.store
    assert store.get_last_performed(TASK_ID_1) == "2025-11-05"
    assert [h["cost"] for h in store.get_history(TASK_ID_1)] == [60.0, 62.0]

    # ...and the task behaves: due 90d after 2025-11-05 → overdue today (2026).
    rows = await _rows(hass, entry.entry_id)
    assert rows[0]["status"] == "overdue"

    # Second boot: migration is idempotent, nothing degrades.
    await simulate_restart(hass, global_entry, entry)
    rows = await _rows(hass, entry.entry_id)
    assert rows[0]["status"] == "overdue"
    assert [h["cost"] for h in store.get_history(TASK_ID_1)] == [60.0, 62.0]


# ─── I2: damaged Store content at boot ───────────────────────────────────────


@pytest.mark.parametrize(
    "bad_data",
    [
        [],  # whole payload is a list
        {"tasks": []},  # tasks is a list
        {"tasks": {TASK_ID_1: "garbage"}},  # a task state is a string
        {"tasks": {TASK_ID_1: {"history": {"not": "a list"}}}},  # history wrong type
        # runtime/adaptive blobs wrong-typed
        {"tasks": {TASK_ID_1: {"trigger_runtime": "bad", "adaptive_config": 5}}},
    ],
    ids=["payload-list", "tasks-list", "state-string", "history-dict", "runtime-scalar"],
)
async def test_damaged_store_content_does_not_break_boot(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    hass_storage: dict[str, Any],
    bad_data: Any,
) -> None:
    """A hand-edited / partially-written store file must not brick the entry.
    Boot succeeds; the damaged parts degrade to 'never performed'."""
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Damaged",
        data=build_object_entry_data(
            object_data=build_object_data(name="Damaged"),
            tasks={TASK_ID_1: build_task_data(task_id=TASK_ID_1, interval_days=30)},
        ),
        source="user",
        unique_id="maintenance_supporter_i2_damaged",
    )
    entry.add_to_hass(hass)
    hass_storage[f"{DOMAIN}.{entry.entry_id}"] = {
        "version": 1,
        "minor_version": 1,
        "key": f"{DOMAIN}.{entry.entry_id}",
        "data": bad_data,
    }

    await setup_integration(hass, global_entry, entry)
    assert entry.state.value == "loaded", f"boot failed on damaged store: {bad_data!r}"

    rows = await _rows(hass, entry.entry_id)
    assert len(rows) == 1  # the task is there, state degraded but alive

    # And the store is usable again: a completion persists normally.
    coordinator = entry.runtime_data.coordinator
    await coordinator.complete_maintenance(task_id=TASK_ID_1)
    await hass.async_block_till_done()
    store = entry.runtime_data.store
    assert store.get_last_performed(TASK_ID_1) is not None


# ─── O1: uninstall → reinstall is a documented fresh start ───────────────────


async def test_uninstall_then_reinstall_same_names_is_fresh(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Removing every entry and re-adding the same object/task names must give
    a clean, working install (no unique_id squatting from the old life)."""
    first = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Boiler",
        data=build_object_entry_data(
            object_data=build_object_data(name="Boiler"),
            tasks={TASK_ID_1: build_task_data(task_id=TASK_ID_1, interval_days=30)},
        ),
        source="user",
        unique_id="maintenance_supporter_boiler",
    )
    first.add_to_hass(hass)
    await setup_integration(hass, global_entry, first)
    await hass.config_entries.async_remove(first.entry_id)
    await hass.config_entries.async_remove(global_entry.entry_id)
    await hass.async_block_till_done()

    # Reinstall: same unique_ids, same names, fresh entry ids.
    global2 = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    global2.add_to_hass(hass)
    second = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Boiler",
        data=build_object_entry_data(
            object_data=build_object_data(name="Boiler"),
            tasks={TASK_ID_1: build_task_data(task_id=TASK_ID_1, interval_days=30)},
        ),
        source="user",
        unique_id="maintenance_supporter_boiler",
    )
    second.add_to_hass(hass)
    await setup_integration(hass, global2, second)

    rows = await _rows(hass, second.entry_id)
    assert len(rows) == 1
    # Fresh start: the old install's completions are gone by contract.
    assert rows[0].get("last_performed") is None
    # Entities exist and belong to the NEW entry.
    reg = er.async_get(hass)
    sensors = [e for e in er.async_entries_for_config_entry(reg, second.entry_id) if e.domain == "sensor"]
    assert sensors, "reinstall produced no sensor entities"


# ─── I4: restore onto a foreign instance — dangling references ───────────────


async def test_restore_with_dangling_device_and_parent_refs_boots(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """An HA-backup restore on a NEW machine: the linked HA device and the
    parent object entry do not exist there, and the trigger source is gone.
    Setup must succeed and fall back to the object's own device."""
    task = build_task_data(
        task_id=TASK_ID_1,
        interval_days=None,
        schedule_type="sensor_based",
        trigger_config={
            "type": "threshold",
            "entity_id": "sensor.not_on_this_machine",
            "trigger_below": 10,
        },
    )
    obj = build_object_data(name="Restored Object")
    obj["ha_device_id"] = "deadbeef-device-from-old-machine"
    obj["parent_entry_id"] = "deadbeef-entry-from-old-machine"
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Restored Object",
        data=build_object_entry_data(object_data=obj, tasks={TASK_ID_1: task}),
        source="user",
        unique_id="maintenance_supporter_i4_restore",
    )
    entry.add_to_hass(hass)

    await setup_integration(hass, global_entry, entry)
    assert entry.state.value == "loaded"

    # Entities exist and did NOT vanish into the dangling foreign device.
    reg = er.async_get(hass)
    sensors = [e for e in er.async_entries_for_config_entry(reg, entry.entry_id) if e.domain == "sensor"]
    assert sensors
    assert all(e.device_id is not None for e in sensors)

    # The task is listable; the missing trigger source degrades to the
    # repair-issue path (covered in test_journey_interactions), not a crash.
    rows = await _rows(hass, entry.entry_id)
    assert len(rows) == 1


# ─── O2: export → wipe → import → re-export round-trip ───────────────────────


async def test_export_import_reexport_round_trip(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    from custom_components.maintenance_supporter.websocket.io import (
        ws_export_data,
        ws_import_json,
    )

    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(
        task_id=TASK_ID_1,
        name="Descale",
        interval_days=30,
        last_performed=last,
        history=[
            {"timestamp": f"{last}T10:00:00", "type": "completed", "cost": 12.5},
        ],
    )
    task["notes"] = "use citric acid"
    task["priority"] = "high"
    task["labels"] = ["kitchen"]
    obj = build_object_data(name="Kettle")
    obj["manufacturer"] = "Acme"
    obj["model"] = "K-2"
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Kettle",
        data=build_object_entry_data(object_data=obj, tasks={TASK_ID_1: task}),
        source="user",
        unique_id="maintenance_supporter_o2_kettle",
    )
    entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, entry)

    def _normalize(export_payload: str) -> list[dict[str, Any]]:
        """Strip instance-specific ids so two installs compare equal."""
        data = json.loads(export_payload)
        objects = data.get("objects", data)
        out = []
        for o in objects:
            o = json.loads(json.dumps(o))  # deep copy
            o.pop("entry_id", None)
            o.get("object", {}).pop("task_ids", None)
            o.get("object", {}).pop("id", None)
            for t in o.get("tasks", []):
                t.pop("id", None)
                t.pop("object_id", None)
            out.append(o)
        return out

    conn = _conn()
    await call_ws_handler(ws_export_data, hass, conn, {"id": 1, "type": f"{DOMAIN}/export"})
    first_export = conn.send_result.call_args[0][1]["data"]

    # Wipe the object (keep the global entry) and restore from the export.
    await hass.config_entries.async_remove(entry.entry_id)
    await hass.async_block_till_done()

    conn2 = _conn()
    await call_ws_handler(
        ws_import_json,
        hass,
        conn2,
        {"id": 2, "type": f"{DOMAIN}/json/import", "json_content": first_export},
    )
    await hass.async_block_till_done()
    assert conn2.send_result.call_args[0][1]["imported"], "import restored nothing"

    conn3 = _conn()
    await call_ws_handler(ws_export_data, hass, conn3, {"id": 3, "type": f"{DOMAIN}/export"})
    second_export = conn3.send_result.call_args[0][1]["data"]

    assert _normalize(second_export) == _normalize(first_export), "export → import → re-export lost or mutated data"
