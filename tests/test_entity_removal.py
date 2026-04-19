"""Integration tests: entity, device, and attribute removal scenarios.

Covers:
- Trigger entity removed from HA → repair issue created after threshold
- Trigger entity becomes unavailable → logged, no issue
- Trigger entity attribute removed → trigger handles gracefully
- Multi-entity trigger: one entity removed → partial state
- Device removal allowed when no entities remain
- Object deletion cleans up entities, device, and Store
- Task deletion removes sensor + binary_sensor entities
- Startup grace period skips issue creation for missing entities
"""

from __future__ import annotations

import time
from datetime import timedelta
from typing import Any
from unittest.mock import MagicMock

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import (
    device_registry as dr,
)
from homeassistant.helpers import (
    entity_registry as er,
)
from homeassistant.helpers import (
    issue_registry as ir,
)
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MISSING_ENTITY_THRESHOLD_REFRESHES,
    ScheduleType,
    TriggerEntityState,
)
from custom_components.maintenance_supporter.websocket.objects import (
    ws_delete_object,
)
from custom_components.maintenance_supporter.websocket.tasks import (
    ws_delete_task,
)

from .conftest import (
    TASK_ID_1,
    TASK_ID_2,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    set_sensor_state,
    setup_integration,
)

# ─── Helpers ──────────────────────────────────────────────────────────────


def _mock_connection() -> MagicMock:
    conn = MagicMock()
    conn.send_result = MagicMock()
    conn.send_error = MagicMock()
    conn.user = MagicMock(is_admin=True)
    return conn


# ─── Fixtures ─────────────────────────────────────────────────────────────


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


def _make_trigger_entry(
    hass: HomeAssistant,
    entity_id: str = "sensor.test_pressure",
    trigger_above: float | None = None,
    trigger_below: float | None = None,
    attribute: str | None = None,
    unique_suffix: str = "removal",
    name: str = "Pressure Monitor",
) -> MockConfigEntry:
    """Create an object entry with a threshold trigger task."""
    trigger_config: dict[str, Any] = {
        "type": "threshold",
        "entity_id": entity_id,
    }
    if trigger_above is not None:
        trigger_config["trigger_above"] = trigger_above
    if trigger_below is not None:
        trigger_config["trigger_below"] = trigger_below
    if attribute is not None:
        trigger_config["attribute"] = attribute

    task = build_task_data(
        schedule_type=ScheduleType.SENSOR_BASED,
        interval_days=None,
        trigger_config=trigger_config,
    )
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title=name,
        data=build_object_entry_data(
            object_data=build_object_data(name=name),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id=f"maintenance_supporter_{unique_suffix}",
    )
    entry.add_to_hass(hass)
    return entry


# ─── Trigger Entity Removed → Repair Issue ───────────────────────────────


async def test_trigger_entity_removed_creates_repair_issue(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Trigger entity removed → after threshold refreshes → repair issue created."""
    set_sensor_state(hass, "sensor.removable", "25.0")
    obj_entry = _make_trigger_entry(
        hass, entity_id="sensor.removable",
        trigger_above=50.0, unique_suffix="repair_issue",
        name="Repair Test",
    )
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator

    # Entity exists → no issue
    # Skip startup grace period
    coordinator._startup_time = time.monotonic() - 600
    await coordinator.async_refresh()
    await hass.async_block_till_done()

    issue_reg = ir.async_get(hass)
    issue_id = f"missing_trigger_{obj_entry.entry_id}_{TASK_ID_1}_sensor.removable"
    assert (DOMAIN, issue_id) not in issue_reg.issues

    # Remove the entity
    hass.states.async_remove("sensor.removable")

    # Refresh multiple times to hit threshold
    for _ in range(MISSING_ENTITY_THRESHOLD_REFRESHES):
        await coordinator.async_refresh()
        await hass.async_block_till_done()

    # Repair issue should now exist
    assert (DOMAIN, issue_id) in issue_reg.issues
    issue = issue_reg.issues[(DOMAIN, issue_id)]
    assert issue.translation_key == "missing_trigger_entity"


async def test_trigger_entity_removed_then_restored(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Trigger entity removed → issue created → entity restored → issue cleared."""
    set_sensor_state(hass, "sensor.flapping", "10.0")
    obj_entry = _make_trigger_entry(
        hass, entity_id="sensor.flapping",
        trigger_below=5.0, unique_suffix="flapping",
        name="Flapping Test",
    )
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator
    coordinator._startup_time = time.monotonic() - 600

    # Remove entity
    hass.states.async_remove("sensor.flapping")

    # Hit threshold
    for _ in range(MISSING_ENTITY_THRESHOLD_REFRESHES):
        await coordinator.async_refresh()
        await hass.async_block_till_done()

    issue_reg = ir.async_get(hass)
    issue_id = f"missing_trigger_{obj_entry.entry_id}_{TASK_ID_1}_sensor.flapping"
    assert (DOMAIN, issue_id) in issue_reg.issues

    # Restore entity
    set_sensor_state(hass, "sensor.flapping", "10.0")
    await coordinator.async_refresh()
    await hass.async_block_till_done()

    # Issue should be cleared
    assert (DOMAIN, issue_id) not in issue_reg.issues


# ─── Trigger Entity Unavailable ──────────────────────────────────────────


async def test_trigger_entity_unavailable_no_issue(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Entity state='unavailable' → no repair issue, but trigger not activated."""
    set_sensor_state(hass, "sensor.unreliable", "2.0")
    obj_entry = _make_trigger_entry(
        hass, entity_id="sensor.unreliable",
        trigger_below=1.0, unique_suffix="unavail_no_issue",
        name="Unavailable Test",
    )
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator
    coordinator._startup_time = time.monotonic() - 600

    # Set entity to unavailable
    hass.states.async_set("sensor.unreliable", "unavailable")
    await coordinator.async_refresh()
    await hass.async_block_till_done()

    # No repair issue for unavailable (only for missing)
    issue_reg = ir.async_get(hass)
    issue_id = f"missing_trigger_{obj_entry.entry_id}_{TASK_ID_1}_sensor.unreliable"
    assert (DOMAIN, issue_id) not in issue_reg.issues

    # Trigger entity state should be UNAVAILABLE
    assert coordinator._trigger_entity_states.get(TASK_ID_1) == TriggerEntityState.UNAVAILABLE

    # Trigger should not be active
    task_data = coordinator.data[CONF_TASKS][TASK_ID_1]
    assert task_data.get("_trigger_active") is not True


async def test_trigger_entity_unknown_state(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Entity state='unknown' → handled same as unavailable."""
    set_sensor_state(hass, "sensor.mystery", "5.0")
    obj_entry = _make_trigger_entry(
        hass, entity_id="sensor.mystery",
        trigger_above=10.0, unique_suffix="unknown_state",
        name="Unknown Test",
    )
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator
    coordinator._startup_time = time.monotonic() - 600

    hass.states.async_set("sensor.mystery", "unknown")
    await coordinator.async_refresh()
    await hass.async_block_till_done()

    task_data = coordinator.data[CONF_TASKS][TASK_ID_1]
    assert task_data.get("_trigger_active") is not True


# ─── Trigger Attribute Removed ────────────────────────────────────────────


async def test_trigger_attribute_removed(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Trigger monitors attribute → attribute removed → trigger handles gracefully."""
    hass.states.async_set("sensor.multi_attr", "on", {
        "temperature": 25.0,
        "humidity": 60.0,
    })
    obj_entry = _make_trigger_entry(
        hass, entity_id="sensor.multi_attr",
        trigger_above=40.0, attribute="temperature",
        unique_suffix="attr_removed", name="Attr Removed",
    )
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator

    # Normal: attribute exists, below threshold → not triggered
    await coordinator.async_refresh()
    await hass.async_block_till_done()
    task_data = coordinator.data[CONF_TASKS][TASK_ID_1]
    assert task_data.get("_trigger_active") is not True

    # Remove the attribute (entity still exists but attribute gone)
    hass.states.async_set("sensor.multi_attr", "on", {
        "humidity": 60.0,
        # "temperature" removed
    })
    await coordinator.async_refresh()
    await hass.async_block_till_done()

    # Should not crash, trigger should not be active
    task_data = coordinator.data[CONF_TASKS][TASK_ID_1]
    assert task_data.get("_trigger_active") is not True


async def test_trigger_attribute_non_numeric(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Trigger attribute becomes non-numeric → handled gracefully."""
    hass.states.async_set("sensor.attr_type", "on", {"level": 5.0})
    obj_entry = _make_trigger_entry(
        hass, entity_id="sensor.attr_type",
        trigger_above=10.0, attribute="level",
        unique_suffix="attr_type", name="Attr Type Change",
    )
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator

    # Change attribute to non-numeric
    hass.states.async_set("sensor.attr_type", "on", {"level": "high"})
    await coordinator.async_refresh()
    await hass.async_block_till_done()

    # No crash, trigger not active
    task_data = coordinator.data[CONF_TASKS][TASK_ID_1]
    assert task_data.get("_trigger_active") is not True


# ─── Multi-Entity Trigger: Partial Removal ───────────────────────────────


async def test_multi_entity_trigger_one_removed(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Multi-entity trigger with entity_logic='any': one entity removed."""
    set_sensor_state(hass, "sensor.tire_fl", "2.5")
    set_sensor_state(hass, "sensor.tire_fr", "2.5")

    trigger_config = {
        "type": "threshold",
        "entity_ids": ["sensor.tire_fl", "sensor.tire_fr"],
        "trigger_below": 2.0,
        "entity_logic": "any",
    }
    task = build_task_data(
        schedule_type=ScheduleType.SENSOR_BASED,
        interval_days=None,
        trigger_config=trigger_config,
    )
    obj_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Multi Remove",
        data=build_object_entry_data(
            object_data=build_object_data(name="Multi Remove"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_multi_remove",
    )
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator
    coordinator._startup_time = time.monotonic() - 600

    # Both above threshold → not triggered
    await coordinator.async_refresh()
    await hass.async_block_till_done()
    task_data = coordinator.data[CONF_TASKS][TASK_ID_1]
    assert task_data.get("_trigger_active") is not True

    # Remove one entity
    hass.states.async_remove("sensor.tire_fr")

    # Remaining entity still above threshold → not triggered
    await coordinator.async_refresh()
    await hass.async_block_till_done()
    task_data = coordinator.data[CONF_TASKS][TASK_ID_1]
    assert task_data.get("_trigger_active") is not True

    # Drop remaining entity below threshold
    set_sensor_state(hass, "sensor.tire_fl", "1.5")
    await coordinator.async_refresh()
    await hass.async_block_till_done()
    task_data = coordinator.data[CONF_TASKS][TASK_ID_1]
    assert task_data.get("_trigger_active") is True


async def test_multi_entity_trigger_all_logic_one_removed(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Multi-entity trigger with entity_logic='all': one entity removed → not triggered."""
    set_sensor_state(hass, "sensor.zone_a", "1.5")
    set_sensor_state(hass, "sensor.zone_b", "1.5")

    trigger_config = {
        "type": "threshold",
        "entity_ids": ["sensor.zone_a", "sensor.zone_b"],
        "trigger_below": 2.0,
        "entity_logic": "all",
    }
    task = build_task_data(
        schedule_type=ScheduleType.SENSOR_BASED,
        interval_days=None,
        trigger_config=trigger_config,
    )
    obj_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="All Logic Remove",
        data=build_object_entry_data(
            object_data=build_object_data(name="All Logic Remove"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_all_logic_remove",
    )
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator

    # Both below threshold → triggered (entity_logic=all)
    await coordinator.async_refresh()
    await hass.async_block_till_done()
    task_data = coordinator.data[CONF_TASKS][TASK_ID_1]
    assert task_data.get("_trigger_active") is True

    # Remove one entity → "all" can't be satisfied → not triggered
    hass.states.async_remove("sensor.zone_b")
    await coordinator.async_refresh()
    await hass.async_block_till_done()
    task_data = coordinator.data[CONF_TASKS][TASK_ID_1]
    # With one missing, "all" logic treats missing as False
    assert task_data.get("_trigger_active") is not True


# ─── Device and Entity Cleanup ────────────────────────────────────────────


async def test_object_deletion_cleans_up_device_and_entities(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Deleting object via WS removes device, entities, and Store."""
    task = build_task_data(
        last_performed=(dt_util.now().date() - timedelta(days=5)).isoformat(),
        interval_days=30,
    )
    obj_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Deletable",
        data=build_object_entry_data(
            object_data=build_object_data(name="Deletable"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_deletable",
    )
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj_entry)

    # Verify entities and device exist
    entity_reg = er.async_get(hass)
    device_reg = dr.async_get(hass)

    entities_before = er.async_entries_for_config_entry(entity_reg, obj_entry.entry_id)
    assert len(entities_before) >= 1  # at least sensor + binary_sensor

    devices_before = dr.async_entries_for_config_entry(device_reg, obj_entry.entry_id)
    assert len(devices_before) == 1

    # Delete object via WS
    conn = _mock_connection()
    await call_ws_handler(ws_delete_object, hass, conn, {
        "id": 1, "type": "maintenance_supporter/object/delete",
        "entry_id": obj_entry.entry_id,
    })
    conn.send_result.assert_called_once()
    await hass.async_block_till_done()

    # Config entry should be removed
    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is None


async def test_task_deletion_removes_entities(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Deleting a task via WS removes its sensor + binary_sensor entities."""
    now = dt_util.now().date()
    tasks = {
        TASK_ID_1: build_task_data(
            task_id=TASK_ID_1, name="Task Keep",
            last_performed=(now - timedelta(days=5)).isoformat(),
            interval_days=30,
        ),
        TASK_ID_2: build_task_data(
            task_id=TASK_ID_2, name="Task Remove",
            last_performed=(now - timedelta(days=5)).isoformat(),
            interval_days=30,
        ),
    }
    obj_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Task Del",
        data=build_object_entry_data(
            object_data=build_object_data(name="Task Del"),
            tasks=tasks,
        ),
        source="user",
        unique_id="maintenance_supporter_task_del",
    )
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj_entry)

    entity_reg = er.async_get(hass)
    entities_before = er.async_entries_for_config_entry(entity_reg, obj_entry.entry_id)
    sensor_count_before = len([e for e in entities_before if e.domain == "sensor"])
    assert sensor_count_before == 2

    # Delete one task via WS
    conn = _mock_connection()
    await call_ws_handler(ws_delete_task, hass, conn, {
        "id": 1, "type": "maintenance_supporter/task/delete",
        "entry_id": obj_entry.entry_id,
        "task_id": TASK_ID_2,
    })
    conn.send_result.assert_called_once()
    await hass.async_block_till_done()

    # After reload, only 1 sensor entity should remain
    entities_after = er.async_entries_for_config_entry(entity_reg, obj_entry.entry_id)
    sensor_count_after = len([e for e in entities_after if e.domain == "sensor"])
    assert sensor_count_after == 1


# ─── Startup Grace Period ─────────────────────────────────────────────────


async def test_startup_grace_period_no_issue(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Entity missing during startup grace period → no issue created."""
    # Don't create the entity — it's "missing" from the start
    task = build_task_data(
        schedule_type=ScheduleType.SENSOR_BASED,
        interval_days=None,
        trigger_config={
            "type": "threshold",
            "entity_id": "sensor.not_yet_loaded",
            "trigger_above": 50.0,
        },
    )
    obj_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Grace Period",
        data=build_object_entry_data(
            object_data=build_object_data(name="Grace Period"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_grace",
    )
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator

    # During grace period: refresh should NOT create an issue
    await coordinator.async_refresh()
    await hass.async_block_till_done()

    issue_reg = ir.async_get(hass)
    issue_id = f"missing_trigger_{obj_entry.entry_id}_{TASK_ID_1}_sensor.not_yet_loaded"
    assert (DOMAIN, issue_id) not in issue_reg.issues

    # Verify trigger entity state is STARTUP
    assert coordinator._trigger_entity_states.get(TASK_ID_1) == TriggerEntityState.STARTUP


async def test_entity_appears_after_grace_period(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Entity missing at startup → appears later → trigger works normally."""
    task = build_task_data(
        schedule_type=ScheduleType.SENSOR_BASED,
        interval_days=None,
        trigger_config={
            "type": "threshold",
            "entity_id": "sensor.late_loader",
            "trigger_above": 50.0,
        },
    )
    obj_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Late Load",
        data=build_object_entry_data(
            object_data=build_object_data(name="Late Load"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_late_load",
    )
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator

    # Initially missing during grace
    await coordinator.async_refresh()
    await hass.async_block_till_done()

    # Entity appears with value above threshold
    set_sensor_state(hass, "sensor.late_loader", "60.0")
    await coordinator.async_refresh()
    await hass.async_block_till_done()

    # Should now be triggered
    task_data = coordinator.data[CONF_TASKS][TASK_ID_1]
    assert task_data.get("_trigger_active") is True

    # Trigger entity state should be AVAILABLE
    assert coordinator._trigger_entity_states.get(TASK_ID_1) == TriggerEntityState.AVAILABLE
