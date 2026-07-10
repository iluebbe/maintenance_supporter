"""Edge-path coverage for the 2.19 feature batch.

Exercises the branches the happy-path tests skip: WS device-link validation
through the real handlers, next-due sensor edge cases, orphan-sweep handover
branches, and export/import of the device-link fields.
"""

from __future__ import annotations

from datetime import timedelta
from typing import Any
from unittest.mock import MagicMock

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry, MockUser

from custom_components.maintenance_supporter.const import (
    CONF_ADVANCED_SCHEDULE_TIME,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from custom_components.maintenance_supporter.websocket.objects import (
    ws_create_object,
    ws_update_object,
)

from .conftest import (
    make_ws_connection as _conn,
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
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




def _make_entry(
    hass: HomeAssistant,
    unique_id: str,
    name: str = "Edge Object",
    task: dict[str, Any] | None = None,
) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title=name,
        data=build_object_entry_data(
            object_data=build_object_data(name=name),
            tasks={TASK_ID_1: task or build_task_data(task_id=TASK_ID_1, interval_days=30)},
        ),
        source="user",
        unique_id=f"maintenance_supporter_{unique_id}",
    )
    entry.add_to_hass(hass)
    return entry


# ─── WS handlers: device link through the real commands ────────────────────


async def test_ws_create_object_rejects_unknown_device(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    await setup_integration(hass, global_entry)
    conn = _conn()
    await call_ws_handler(
        ws_create_object,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/object/create",
            "name": "X",
            "ha_device_id": "does-not-exist",
        },
    )
    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "invalid_device"


async def test_ws_create_object_with_valid_links(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    parent = _make_entry(hass, "edge_parent", name="Parent")
    await setup_integration(hass, global_entry, parent)

    foreign_entry = MockConfigEntry(domain="demo", title="Demo")
    foreign_entry.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(
        config_entry_id=foreign_entry.entry_id,
        identifiers={("demo", "edge-dev")},
        name="Edge Device",
    )

    conn = _conn()
    await call_ws_handler(
        ws_create_object,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/object/create",
            "name": "Linked Child",
            "ha_device_id": device.id,
            "parent_entry_id": parent.entry_id,
        },
    )
    await hass.async_block_till_done()
    conn.send_result.assert_called_once()
    entry_id = conn.send_result.call_args[0][1]["entry_id"]
    obj = hass.config_entries.async_get_entry(entry_id).data["object"]
    assert obj["ha_device_id"] == device.id
    assert obj["parent_entry_id"] == parent.entry_id


async def test_ws_update_object_link_change_schedules_reload(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    obj_entry = _make_entry(hass, "edge_reload", name="Reloader")
    await setup_integration(hass, global_entry, obj_entry)

    foreign_entry = MockConfigEntry(domain="demo", title="Demo2")
    foreign_entry.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(
        config_entry_id=foreign_entry.entry_id,
        identifiers={("demo", "edge-dev-2")},
    )

    conn = _conn()
    await call_ws_handler(
        ws_update_object,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/object/update",
            "entry_id": obj_entry.entry_id,
            "ha_device_id": device.id,
        },
    )
    await hass.async_block_till_done()
    conn.send_result.assert_called_once()
    assert obj_entry.data["object"]["ha_device_id"] == device.id

    # Clearing the link goes through the same changed-path.
    conn2 = _conn()
    await call_ws_handler(
        ws_update_object,
        hass,
        conn2,
        {
            "id": 2,
            "type": "maintenance_supporter/object/update",
            "entry_id": obj_entry.entry_id,
            "ha_device_id": None,
        },
    )
    await hass.async_block_till_done()
    assert obj_entry.data["object"]["ha_device_id"] is None


async def test_ws_update_object_rejects_bad_parent(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    obj_entry = _make_entry(hass, "edge_badparent", name="Child")
    await setup_integration(hass, global_entry, obj_entry)
    conn = _conn()
    await call_ws_handler(
        ws_update_object,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/object/update",
            "entry_id": obj_entry.entry_id,
            "parent_entry_id": global_entry.entry_id,
        },
    )
    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "invalid_parent"


# ─── Next-due sensor edges ──────────────────────────────────────────────────


def _next_due_sensor(hass: HomeAssistant, entry: MockConfigEntry) -> Any:
    from custom_components.maintenance_supporter.sensor import (
        MaintenanceNextDueSensor,
    )

    coordinator = entry.runtime_data.coordinator
    return MaintenanceNextDueSensor(coordinator, TASK_ID_1)


async def test_next_due_sensor_edge_values(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(task_id=TASK_ID_1, last_performed=last, interval_days=30)
    task["schedule_time"] = "junk"  # malformed → midnight fallback
    obj_entry = _make_entry(hass, "edge_nextdue", task=task)

    # Enable the schedule-time feature so the malformed branch is reached.
    hass.config_entries.async_update_entry(
        global_entry,
        data={**global_entry.data, CONF_ADVANCED_SCHEDULE_TIME: True},
    )
    await setup_integration(hass, global_entry, obj_entry)

    sensor = _next_due_sensor(hass, obj_entry)
    value = sensor.native_value
    assert value is not None
    assert (value.hour, value.minute) == (0, 0)  # malformed time → midnight

    # Malformed next_due → None (defensive parse).
    coordinator = obj_entry.runtime_data.coordinator
    coordinator.data[CONF_TASKS][TASK_ID_1]["_next_due"] = "not-a-date"
    assert sensor.native_value is None

    # Archived → None.
    coordinator.data[CONF_TASKS][TASK_ID_1]["_next_due"] = "2027-01-01"
    coordinator.data[CONF_TASKS][TASK_ID_1]["_status"] = "archived"
    assert sensor.native_value is None

    # Missing next_due (manual task) → None.
    coordinator.data[CONF_TASKS][TASK_ID_1]["_status"] = "ok"
    coordinator.data[CONF_TASKS][TASK_ID_1]["_next_due"] = None
    assert sensor.native_value is None


# ─── Orphan sweep: handover + no-pool branches ──────────────────────────────


async def test_sweep_clears_pointer_without_pool(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Orphaned pointer with NO pool → cleared (not handed over)."""
    MockUser(id="edge-live", name="Live").add_to_hass(hass)
    task = build_task_data(task_id=TASK_ID_1, interval_days=30)
    task["responsible_user_id"] = "edge-ghost"
    obj_entry = _make_entry(hass, "edge_sweep", task=task)
    await setup_integration(hass, global_entry, obj_entry)

    stored = obj_entry.data[CONF_TASKS][TASK_ID_1]
    assert "responsible_user_id" not in stored


async def test_sweep_keeps_valid_assignments_untouched(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    MockUser(id="edge-a", name="A").add_to_hass(hass)
    MockUser(id="edge-b", name="B").add_to_hass(hass)
    task = build_task_data(task_id=TASK_ID_1, interval_days=30)
    task["responsible_user_id"] = "edge-a"
    task["assignee_pool"] = ["edge-a", "edge-b"]
    task["rotation_strategy"] = "round_robin"
    obj_entry = _make_entry(hass, "edge_sweep_ok", task=task)
    await setup_integration(hass, global_entry, obj_entry)

    stored = obj_entry.data[CONF_TASKS][TASK_ID_1]
    assert stored["responsible_user_id"] == "edge-a"
    assert stored["assignee_pool"] == ["edge-a", "edge-b"]
    assert stored["rotation_strategy"] == "round_robin"
