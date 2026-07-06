"""Per-task next-due TIMESTAMP sensor (disabled by default).

A companion entity to the status sensor: the raw next-due instant for
relative time-format displays ("in 2 days") and timestamp automations.
Registered but disabled by default so the extra entity per task costs
nothing unless enabled.
"""

from __future__ import annotations

from datetime import timedelta
from typing import Any

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_ADVANCED_SCHEDULE_TIME,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)

from .conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
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


def _make_entry(hass: HomeAssistant, task_data: dict[str, Any], unique_id: str) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Test Object",
        data=build_object_entry_data(
            object_data=build_object_data(name="Test Object"),
            tasks={TASK_ID_1: task_data},
        ),
        source="user",
        unique_id=f"maintenance_supporter_{unique_id}",
    )
    entry.add_to_hass(hass)
    return entry


def _next_due_registry_entry(hass: HomeAssistant, entry: MockConfigEntry) -> er.RegistryEntry:
    reg = er.async_get(hass)
    matches = [e for e in er.async_entries_for_config_entry(reg, entry.entry_id) if e.unique_id.endswith("_next_due")]
    assert len(matches) == 1
    return matches[0]


async def test_registered_but_disabled_by_default(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    task = build_task_data(
        task_id=TASK_ID_1,
        last_performed=(dt_util.now().date() - timedelta(days=10)).isoformat(),
        interval_days=30,
    )
    obj_entry = _make_entry(hass, task, "next_due_disabled")
    await setup_integration(hass, global_entry, obj_entry)

    reg_entry = _next_due_registry_entry(hass, obj_entry)
    assert reg_entry.disabled_by is er.RegistryEntryDisabler.INTEGRATION
    assert hass.states.get(reg_entry.entity_id) is None  # no live entity


async def test_enabled_sensor_reports_midnight_local(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    last = dt_util.now().date() - timedelta(days=10)
    task = build_task_data(task_id=TASK_ID_1, last_performed=last.isoformat(), interval_days=30)
    obj_entry = _make_entry(hass, task, "next_due_enabled")
    await setup_integration(hass, global_entry, obj_entry)

    reg = er.async_get(hass)
    reg_entry = _next_due_registry_entry(hass, obj_entry)
    reg.async_update_entity(reg_entry.entity_id, disabled_by=None)
    await hass.config_entries.async_reload(obj_entry.entry_id)
    await hass.async_block_till_done()

    state = hass.states.get(reg_entry.entity_id)
    assert state is not None
    assert state.attributes["device_class"] == "timestamp"
    expected_date = last + timedelta(days=30)
    parsed = dt_util.parse_datetime(state.state)
    assert parsed is not None
    local = dt_util.as_local(parsed)
    assert local.date() == expected_date
    assert (local.hour, local.minute) == (0, 0)


async def test_schedule_time_shifts_the_instant(hass: HomeAssistant) -> None:
    global_entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data={**build_global_entry_data(), CONF_ADVANCED_SCHEDULE_TIME: True},
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    global_entry.add_to_hass(hass)

    last = dt_util.now().date() - timedelta(days=10)
    task = build_task_data(task_id=TASK_ID_1, last_performed=last.isoformat(), interval_days=30)
    task["schedule_time"] = "18:30"
    obj_entry = _make_entry(hass, task, "next_due_time")
    await setup_integration(hass, global_entry, obj_entry)

    reg = er.async_get(hass)
    reg_entry = _next_due_registry_entry(hass, obj_entry)
    reg.async_update_entity(reg_entry.entity_id, disabled_by=None)
    await hass.config_entries.async_reload(obj_entry.entry_id)
    await hass.async_block_till_done()

    state = hass.states.get(reg_entry.entity_id)
    assert state is not None
    local = dt_util.as_local(dt_util.parse_datetime(state.state))
    assert (local.hour, local.minute) == (18, 30)
