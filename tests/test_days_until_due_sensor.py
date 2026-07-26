"""Per-task days-until-due COUNTDOWN sensor (disabled by default).

Companion to the status sensor: a plain numeric days-until-due state for
gauge/progress-bar cards, which cannot read the status sensor's attribute.
Negative once overdue; unknown for archived or never-scheduled tasks.
"""

from __future__ import annotations

from datetime import timedelta
from typing import Any

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import DOMAIN, GLOBAL_UNIQUE_ID

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


def _countdown_registry_entry(hass: HomeAssistant, entry: MockConfigEntry) -> er.RegistryEntry:
    reg = er.async_get(hass)
    matches = [e for e in er.async_entries_for_config_entry(reg, entry.entry_id) if e.unique_id.endswith("_days_until_due")]
    assert len(matches) == 1
    return matches[0]


async def _enable(hass: HomeAssistant, obj_entry: MockConfigEntry) -> str:
    reg = er.async_get(hass)
    reg_entry = _countdown_registry_entry(hass, obj_entry)
    reg.async_update_entity(reg_entry.entity_id, disabled_by=None)
    await hass.config_entries.async_reload(obj_entry.entry_id)
    await hass.async_block_till_done()
    return reg_entry.entity_id


async def test_registered_but_disabled_by_default(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    task = build_task_data(
        task_id=TASK_ID_1,
        last_performed=(dt_util.now().date() - timedelta(days=10)).isoformat(),
        interval_days=30,
    )
    obj_entry = _make_entry(hass, task, "countdown_disabled")
    await setup_integration(hass, global_entry, obj_entry)

    reg_entry = _countdown_registry_entry(hass, obj_entry)
    assert reg_entry.disabled_by is er.RegistryEntryDisabler.INTEGRATION
    assert hass.states.get(reg_entry.entity_id) is None  # no live entity


async def test_enabled_sensor_counts_down_in_days(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    task = build_task_data(
        task_id=TASK_ID_1,
        last_performed=(dt_util.now().date() - timedelta(days=10)).isoformat(),
        interval_days=30,
    )
    obj_entry = _make_entry(hass, task, "countdown_enabled")
    await setup_integration(hass, global_entry, obj_entry)

    entity_id = await _enable(hass, obj_entry)
    state = hass.states.get(entity_id)
    assert state is not None
    assert state.state == "20"  # due in 30 - 10 days
    assert state.attributes["unit_of_measurement"] == "d"
    assert state.attributes["state_class"] == "measurement"


async def test_overdue_reads_negative(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    task = build_task_data(
        task_id=TASK_ID_1,
        last_performed=(dt_util.now().date() - timedelta(days=45)).isoformat(),
        interval_days=30,
    )
    obj_entry = _make_entry(hass, task, "countdown_overdue")
    await setup_integration(hass, global_entry, obj_entry)

    entity_id = await _enable(hass, obj_entry)
    state = hass.states.get(entity_id)
    assert state is not None
    assert state.state == "-15"  # 15 days past due


async def test_archived_task_reads_unknown(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    task = build_task_data(
        task_id=TASK_ID_1,
        last_performed=(dt_util.now().date() - timedelta(days=10)).isoformat(),
        interval_days=30,
    )
    task["archived_at"] = dt_util.now().isoformat()
    obj_entry = _make_entry(hass, task, "countdown_archived")
    await setup_integration(hass, global_entry, obj_entry)

    entity_id = await _enable(hass, obj_entry)
    state = hass.states.get(entity_id)
    assert state is not None
    assert state.state == "unknown"
