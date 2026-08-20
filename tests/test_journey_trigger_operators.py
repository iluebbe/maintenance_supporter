"""Journey: discrete-level triggers and the trigger∧interval combinator.

Two arcs through the REAL event-driven trigger machinery (state changes on
live entities, no hand-called evaluate()):

* A filter-stage sensor reports discrete levels — the task fires while the
  stage EQUALS the service level (=), clears when it leaves it, and a mode
  sensor fires while it DEVIATES from the expected value (≠).
* A trigger task carrying a safety interval with ``trigger_combinator: all``
  only becomes due once BOTH legs are met: the trigger latches early but the
  task stays on the time ladder until the interval elapsed too; completing
  it clears the latch and restarts the cycle.
"""

from __future__ import annotations

from datetime import date, timedelta

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MaintenanceStatus,
    ScheduleType,
)

from .conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    set_sensor_state,
    setup_integration,
)


import pytest


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


def _entry(hass: HomeAssistant, task: dict, uid: str, name: str = "Water Filter") -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title=name,
        data=build_object_entry_data(
            object_data=build_object_data(name=name),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id=f"maintenance_supporter_{uid}",
    )
    entry.add_to_hass(hass)
    return entry


async def test_journey_equals_trigger_lives_with_a_stage_sensor(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """Stage 3 = 'service the filter'. The task follows the stage around."""
    set_sensor_state(hass, "sensor.filter_stage", "1")
    task = build_task_data(
        task_id=TASK_ID_1,
        name="Cartridge Service",
        schedule_type=ScheduleType.SENSOR_BASED,
        interval_days=None,
        trigger_config={
            "type": "threshold",
            "entity_id": "sensor.filter_stage",
            "entity_ids": ["sensor.filter_stage"],
            "trigger_equals": 3.0,
        },
    )
    obj = _entry(hass, task, uid="journey_eq")
    await setup_integration(hass, global_entry, obj)
    coordinator = obj.runtime_data.coordinator

    def status() -> str:
        return coordinator.data[CONF_TASKS][TASK_ID_1]["_status"]

    # Stage climbs 1 -> 2: nothing (2 != 3).
    set_sensor_state(hass, "sensor.filter_stage", "2")
    await hass.async_block_till_done()
    assert status() != MaintenanceStatus.TRIGGERED

    # Stage hits the service level: TRIGGERED.
    set_sensor_state(hass, "sensor.filter_stage", "3")
    await hass.async_block_till_done()
    assert coordinator.data[CONF_TASKS][TASK_ID_1]["_trigger_active"] is True

    # Stage moves past it (4 != 3): the condition clears again.
    set_sensor_state(hass, "sensor.filter_stage", "4")
    await hass.async_block_till_done()
    assert coordinator.data[CONF_TASKS][TASK_ID_1]["_trigger_active"] is False


async def test_journey_not_equals_trigger_watches_a_mode_sensor(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """Mode 1 = 'auto'. Any deviation from it means someone must look."""
    set_sensor_state(hass, "sensor.pump_mode", "1")
    task = build_task_data(
        task_id=TASK_ID_1,
        name="Pump Mode Check",
        schedule_type=ScheduleType.SENSOR_BASED,
        interval_days=None,
        trigger_config={
            "type": "threshold",
            "entity_id": "sensor.pump_mode",
            "entity_ids": ["sensor.pump_mode"],
            "trigger_not_equals": 1.0,
        },
    )
    obj = _entry(hass, task, uid="journey_ne", name="Pool Pump")
    await setup_integration(hass, global_entry, obj)
    coordinator = obj.runtime_data.coordinator

    # Deviates -> latches; back to auto -> clears.
    set_sensor_state(hass, "sensor.pump_mode", "0")
    await hass.async_block_till_done()
    assert coordinator.data[CONF_TASKS][TASK_ID_1]["_trigger_active"] is True

    set_sensor_state(hass, "sensor.pump_mode", "1")
    await hass.async_block_till_done()
    assert coordinator.data[CONF_TASKS][TASK_ID_1]["_trigger_active"] is False


async def test_journey_all_combinator_waits_for_both_legs(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """'When the sensor says so, but never more often than every 30 days.'"""
    set_sensor_state(hass, "sensor.salt_level", "80")
    task = build_task_data(
        task_id=TASK_ID_1,
        name="Refill Salt",
        schedule_type=ScheduleType.SENSOR_BASED,
        interval_days=30,
        last_performed=(dt_util.now().date() - timedelta(days=5)).isoformat(),
        trigger_config={
            "type": "threshold",
            "entity_id": "sensor.salt_level",
            "entity_ids": ["sensor.salt_level"],
            "trigger_below": 20.0,
            "trigger_combinator": "all",
        },
    )
    obj = _entry(hass, task, uid="journey_comb", name="Water Softener")
    await setup_integration(hass, global_entry, obj)
    coordinator = obj.runtime_data.coordinator

    # The sensor drops below the limit only 5 days into the 30-day interval:
    # the trigger LATCHES but the task must not action yet.
    set_sensor_state(hass, "sensor.salt_level", "15")
    await hass.async_block_till_done()
    tk = coordinator.data[CONF_TASKS][TASK_ID_1]
    assert tk["_trigger_active"] is True
    assert tk["_status"] != MaintenanceStatus.TRIGGERED

    # The interval leg matures (the last service ages past 30 days) — the
    # store-side reset is the no-reload way to move the anchor (see the
    # live check for why task/update would re-seed instead).
    await coordinator.reset_maintenance(
        TASK_ID_1, date=dt_util.now().date() - timedelta(days=40)
    )
    await hass.async_block_till_done()
    # reset_maintenance clears the latch by design — the sensor is still low,
    # so the next evaluation latches again (a real state edge re-fires it).
    set_sensor_state(hass, "sensor.salt_level", "14")
    await hass.async_block_till_done()

    tk = coordinator.data[CONF_TASKS][TASK_ID_1]
    assert tk["_trigger_active"] is True
    assert tk["_status"] == MaintenanceStatus.TRIGGERED

    # Completing services both legs: latch cleared, cycle restarted.
    await coordinator.complete_maintenance(TASK_ID_1, notes="refilled")
    await hass.async_block_till_done()
    tk = coordinator.data[CONF_TASKS][TASK_ID_1]
    assert tk["_trigger_active"] is False
    assert tk["_status"] != MaintenanceStatus.TRIGGERED
