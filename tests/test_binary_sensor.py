"""Tests for binary_sensor platform (binary_sensor.py)."""

from __future__ import annotations

from datetime import timedelta
from typing import Any

import pytest

from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_OBJECT,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    SIGNAL_TASK_RESET,
    MaintenanceStatus,
    ScheduleType,
)

from .conftest import (
    OBJECT_ID_1,
    TASK_ID_1,
    TASK_ID_2,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    setup_integration,
)


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


def _make_entry(
    hass: HomeAssistant,
    tasks: dict[str, dict[str, Any]],
    name: str = "Test Object",
    unique_id: str = "bs_test",
) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title=name,
        data=build_object_entry_data(
            object_data=build_object_data(name=name),
            tasks=tasks,
        ),
        source="user",
        unique_id=f"maintenance_supporter_{unique_id}",
    )
    entry.add_to_hass(hass)
    return entry


def _get_binary_sensors(
    hass: HomeAssistant, entry: MockConfigEntry,
) -> list[Any]:
    """Get all binary_sensor entity states for this config entry."""
    entity_reg = er.async_get(hass)
    entities = er.async_entries_for_config_entry(entity_reg, entry.entry_id)
    bs = [e for e in entities if e.domain == "binary_sensor"]
    return [hass.states.get(e.entity_id) for e in bs]


def _get_binary_sensor(
    hass: HomeAssistant, entry: MockConfigEntry,
) -> Any | None:
    """Get the first binary_sensor state for this config entry."""
    states = _get_binary_sensors(hass, entry)
    return states[0] if states else None


# ─── Entity Creation ─────────────────────────────────────────────────────


async def test_binary_sensor_created(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test that a binary_sensor entity is created for each task."""
    task1 = build_task_data(task_id=TASK_ID_1, last_performed="2024-06-01")
    task2 = build_task_data(task_id=TASK_ID_2, name="Oil Change", last_performed="2024-06-01")
    obj_entry = _make_entry(hass, {TASK_ID_1: task1, TASK_ID_2: task2}, unique_id="bs_create")
    await setup_integration(hass, global_entry, obj_entry)

    states = _get_binary_sensors(hass, obj_entry)
    assert len(states) == 2
    assert all(s is not None for s in states)


async def test_binary_sensor_device_class(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test that binary_sensor has device_class 'problem'."""
    task = build_task_data(task_id=TASK_ID_1, last_performed="2024-06-01")
    obj_entry = _make_entry(hass, {TASK_ID_1: task}, unique_id="bs_devclass")
    await setup_integration(hass, global_entry, obj_entry)

    state = _get_binary_sensor(hass, obj_entry)
    assert state is not None
    assert state.attributes.get("device_class") == "problem"


async def test_binary_sensor_unique_id(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test the unique_id includes object slug and task_id with _overdue suffix."""
    task = build_task_data(task_id=TASK_ID_1, last_performed="2024-06-01")
    obj_entry = _make_entry(hass, {TASK_ID_1: task}, name="My Device", unique_id="bs_uid")
    await setup_integration(hass, global_entry, obj_entry)

    entity_reg = er.async_get(hass)
    entities = er.async_entries_for_config_entry(entity_reg, obj_entry.entry_id)
    bs = [e for e in entities if e.domain == "binary_sensor"]
    assert len(bs) == 1
    assert bs[0].unique_id == f"maintenance_supporter_my_device_{TASK_ID_1}_overdue"


# ─── Status (is_on) ─────────────────────────────────────────────────────


async def test_binary_sensor_ok_is_off(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test binary_sensor is OFF when task status is OK."""
    last = (dt_util.now().date() - timedelta(days=5)).isoformat()
    task = build_task_data(task_id=TASK_ID_1, last_performed=last, interval_days=30)
    obj_entry = _make_entry(hass, {TASK_ID_1: task}, unique_id="bs_ok")
    await setup_integration(hass, global_entry, obj_entry)

    state = _get_binary_sensor(hass, obj_entry)
    assert state is not None
    assert state.state == "off"


async def test_binary_sensor_due_soon_is_off(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test binary_sensor is OFF when task status is DUE_SOON."""
    # 25 days ago, 30 day interval, 7 day warning → due in 5 days → due_soon
    last = (dt_util.now().date() - timedelta(days=25)).isoformat()
    task = build_task_data(task_id=TASK_ID_1, last_performed=last, interval_days=30, warning_days=7)
    obj_entry = _make_entry(hass, {TASK_ID_1: task}, unique_id="bs_duesoon")
    await setup_integration(hass, global_entry, obj_entry)

    state = _get_binary_sensor(hass, obj_entry)
    assert state is not None
    # DUE_SOON is not a "problem" status — binary sensor should be OFF
    assert state.state == "off"


async def test_binary_sensor_overdue_is_on(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test binary_sensor is ON when task status is OVERDUE."""
    last = (dt_util.now().date() - timedelta(days=60)).isoformat()
    task = build_task_data(task_id=TASK_ID_1, last_performed=last, interval_days=30)
    obj_entry = _make_entry(hass, {TASK_ID_1: task}, unique_id="bs_overdue")
    await setup_integration(hass, global_entry, obj_entry)

    state = _get_binary_sensor(hass, obj_entry)
    assert state is not None
    assert state.state == "on"


async def test_binary_sensor_triggered_is_on(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test binary_sensor is ON when task status is TRIGGERED."""
    hass.states.async_set("sensor.counter", "100")
    task = build_task_data(
        task_id=TASK_ID_1,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "threshold",
            "entity_id": "sensor.counter",
            "trigger_above": 50.0,
        },
        last_performed="2024-01-01",
        interval_days=365,
    )
    obj_entry = _make_entry(hass, {TASK_ID_1: task}, unique_id="bs_triggered")
    await setup_integration(hass, global_entry, obj_entry)
    # Allow trigger to fire
    await hass.async_block_till_done()

    state = _get_binary_sensor(hass, obj_entry)
    assert state is not None
    assert state.state == "on"


# ─── Extra State Attributes ──────────────────────────────────────────────


async def test_binary_sensor_attributes(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test extra_state_attributes include status, days_until_due, next_due, parent_object."""
    last = (dt_util.now().date() - timedelta(days=60)).isoformat()
    task = build_task_data(task_id=TASK_ID_1, last_performed=last, interval_days=30)
    obj_entry = _make_entry(hass, {TASK_ID_1: task}, name="Pool Pump", unique_id="bs_attrs")
    await setup_integration(hass, global_entry, obj_entry)

    state = _get_binary_sensor(hass, obj_entry)
    assert state is not None
    attrs = state.attributes
    assert attrs["maintenance_status"] == MaintenanceStatus.OVERDUE
    assert attrs["days_until_due"] < 0
    assert attrs["next_due"] is not None
    assert attrs["parent_object"] == "Pool Pump"


# ─── Disabled Task ────────────────────────────────────────────────────────


async def test_binary_sensor_disabled_task_is_off(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test binary_sensor is OFF for a disabled task even if interval is overdue."""
    last = (dt_util.now().date() - timedelta(days=60)).isoformat()
    task = build_task_data(task_id=TASK_ID_1, last_performed=last, interval_days=30, enabled=False)
    obj_entry = _make_entry(hass, {TASK_ID_1: task}, unique_id="bs_disabled")
    await setup_integration(hass, global_entry, obj_entry)

    state = _get_binary_sensor(hass, obj_entry)
    assert state is not None
    assert state.state == "off"


# ─── Task Reset Signal ───────────────────────────────────────────────────


async def test_binary_sensor_reacts_to_task_reset(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test binary_sensor updates immediately on SIGNAL_TASK_RESET dispatch."""
    from homeassistant.helpers.dispatcher import async_dispatcher_send

    last = (dt_util.now().date() - timedelta(days=60)).isoformat()
    task = build_task_data(task_id=TASK_ID_1, last_performed=last, interval_days=30)
    obj_entry = _make_entry(hass, {TASK_ID_1: task}, unique_id="bs_reset")
    await setup_integration(hass, global_entry, obj_entry)

    state = _get_binary_sensor(hass, obj_entry)
    assert state is not None
    assert state.state == "on"  # overdue

    # Simulate completion: update coordinator data and dispatch signal
    rd = obj_entry.runtime_data
    coordinator = rd.coordinator
    tasks = coordinator.data.get(CONF_TASKS, {})
    ct = tasks.get(TASK_ID_1, {})
    ct["last_performed"] = dt_util.now().date().isoformat()
    ct["_days_until_due"] = 30
    ct["_status"] = MaintenanceStatus.OK
    ct["_trigger_active"] = False

    signal = SIGNAL_TASK_RESET.format(
        entry_id=obj_entry.entry_id,
        task_id=TASK_ID_1,
    )
    async_dispatcher_send(hass, signal)
    await hass.async_block_till_done()

    state = _get_binary_sensor(hass, obj_entry)
    assert state is not None
    assert state.state == "off"  # now ok


# ─── Global Entry Skip ───────────────────────────────────────────────────


async def test_no_binary_sensors_for_global_entry(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test that no binary_sensor entities are created for the global config entry."""
    await setup_integration(hass, global_entry)

    entity_reg = er.async_get(hass)
    entities = er.async_entries_for_config_entry(entity_reg, global_entry.entry_id)
    bs = [e for e in entities if e.domain == "binary_sensor"]
    assert len(bs) == 0
