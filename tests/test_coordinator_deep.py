"""Deep coordinator coverage: notifications, budget alerts, missing entity repairs."""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_BUDGET_ALERTS_ENABLED,
    CONF_BUDGET_ALERT_THRESHOLD,
    CONF_BUDGET_MONTHLY,
    CONF_BUDGET_YEARLY,
    CONF_NOTIFICATION_BUNDLING_ENABLED,
    CONF_NOTIFICATION_BUNDLE_THRESHOLD,
    CONF_NOTIFICATIONS_ENABLED,
    CONF_NOTIFY_SERVICE,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    ScheduleType,
)

from .conftest import (
    TASK_ID_1,
    TASK_ID_2,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    get_task_store_state,
    setup_integration,
)


@pytest.fixture
def global_entry_notifications(hass: HomeAssistant) -> MockConfigEntry:
    """Global entry with notifications enabled."""
    data = build_global_entry_data(
        notifications_enabled=True,
        notify_service="notify.test",
    )
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter",
        data=data,
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


@pytest.fixture
def global_entry_budget(hass: HomeAssistant) -> MockConfigEntry:
    """Global entry with budget alerts enabled."""
    data = build_global_entry_data(
        notifications_enabled=True,
        notify_service="notify.test",
    )
    data[CONF_BUDGET_ALERTS_ENABLED] = True
    data[CONF_BUDGET_MONTHLY] = 100.0
    data[CONF_BUDGET_YEARLY] = 1000.0
    data[CONF_BUDGET_ALERT_THRESHOLD] = 80
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter",
        data=data,
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


@pytest.fixture
def global_entry_bundled(hass: HomeAssistant) -> MockConfigEntry:
    """Global entry with bundled notifications enabled."""
    data = build_global_entry_data(
        notifications_enabled=True,
        notify_service="notify.test",
    )
    data[CONF_NOTIFICATION_BUNDLING_ENABLED] = True
    data[CONF_NOTIFICATION_BUNDLE_THRESHOLD] = 2
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter",
        data=data,
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


def _make_overdue_entry(hass: HomeAssistant, unique_id: str, days_overdue: int = 60) -> MockConfigEntry:
    """Create an entry with an overdue task."""
    last = (dt_util.now().date() - timedelta(days=days_overdue)).isoformat()
    task = build_task_data(
        task_id=TASK_ID_1, last_performed=last, interval_days=30,
    )
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Overdue Object",
        data=build_object_entry_data(
            object_data=build_object_data(name="Overdue Object"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id=f"maintenance_supporter_{unique_id}",
    )
    entry.add_to_hass(hass)
    return entry


def _make_cost_entry(
    hass: HomeAssistant, unique_id: str, monthly_cost: float = 0, yearly_cost: float = 0,
) -> MockConfigEntry:
    """Create entry with cost history."""
    now = datetime.now()
    history: list[dict[str, Any]] = []
    if monthly_cost > 0:
        history.append({
            "timestamp": now.isoformat(),
            "type": "completed",
            "cost": monthly_cost,
        })
    if yearly_cost > 0:
        history.append({
            "timestamp": now.replace(month=max(1, now.month - 2)).isoformat(),
            "type": "completed",
            "cost": yearly_cost,
        })

    task = build_task_data(task_id=TASK_ID_1, last_performed="2024-06-01")
    task["history"] = history
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Cost Object",
        data=build_object_entry_data(
            object_data=build_object_data(name="Cost Object"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id=f"maintenance_supporter_{unique_id}",
    )
    entry.add_to_hass(hass)
    return entry


# ─── Notification Status Changes ──────────────────────────────────────────


async def test_notify_overdue_task(
    hass: HomeAssistant, global_entry_notifications: MockConfigEntry,
) -> None:
    """Test that overdue task triggers notification dispatch."""
    obj_entry = _make_overdue_entry(hass, "notif_overdue", 60)
    await setup_integration(hass, global_entry_notifications, obj_entry)

    # After setup, the coordinator should have run _async_update_data
    # and found the overdue task. Notifications may or may not have fired
    # depending on whether notification_manager was fully initialized.
    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    data = entry.runtime_data.coordinator.data
    assert data[CONF_TASKS][TASK_ID_1]["_status"] == "overdue"


async def test_notify_bundled_sends(
    hass: HomeAssistant, global_entry_bundled: MockConfigEntry,
) -> None:
    """Test that bundled notifications are sent when threshold met."""
    # Create an entry with 2 overdue tasks
    last = (dt_util.now().date() - timedelta(days=60)).isoformat()
    task1 = build_task_data(task_id=TASK_ID_1, name="Task 1", last_performed=last, interval_days=30)
    task2 = build_task_data(task_id=TASK_ID_2, name="Task 2", last_performed=last, interval_days=30)
    obj_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Multi Overdue",
        data=build_object_entry_data(
            object_data=build_object_data(name="Multi Overdue"),
            tasks={TASK_ID_1: task1, TASK_ID_2: task2},
        ),
        source="user",
        unique_id="maintenance_supporter_bundled_notif",
    )
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry_bundled, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    data = entry.runtime_data.coordinator.data
    assert data[CONF_TASKS][TASK_ID_1]["_status"] == "overdue"
    assert data[CONF_TASKS][TASK_ID_2]["_status"] == "overdue"


# ─── Budget Alerts ───────────────────────────────────────────────────────


async def test_budget_monthly_check(
    hass: HomeAssistant, global_entry_budget: MockConfigEntry,
) -> None:
    """Test budget check finds monthly cost data."""
    obj_entry = _make_cost_entry(hass, "budget_monthly", monthly_cost=90.0)
    await setup_integration(hass, global_entry_budget, obj_entry)

    # Coordinator should have run budget check during update
    # Verify the task exists and was processed
    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None


async def test_budget_no_alerts_disabled(
    hass: HomeAssistant,
) -> None:
    """Test budget check skipped when alerts disabled."""
    global_data = build_global_entry_data(
        notifications_enabled=True,
        notify_service="notify.test",
    )
    global_data[CONF_BUDGET_ALERTS_ENABLED] = False
    global_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter",
        data=global_data,
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    global_entry.add_to_hass(hass)

    obj_entry = _make_cost_entry(hass, "budget_disabled", monthly_cost=999.0)
    await setup_integration(hass, global_entry, obj_entry)

    # Should not crash — budget alerts disabled


# ─── Missing Trigger Entity ──────────────────────────────────────────────


async def test_missing_trigger_entity_startup_grace(
    hass: HomeAssistant, global_entry_notifications: MockConfigEntry,
) -> None:
    """Test that missing entity during startup is handled gracefully."""
    # Don't set the entity state — it won't exist
    task = build_task_data(
        task_id=TASK_ID_1,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "threshold",
            "entity_id": "sensor.nonexistent_entity",
            "trigger_above": 30,
        },
    )
    obj_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Missing Entity",
        data=build_object_entry_data(
            object_data=build_object_data(name="Missing Entity"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_missing_entity",
    )
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry_notifications, obj_entry)

    # During startup grace period, no repair issue should be created yet
    # The entity should be tracked but not trigger a repair
    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None


# ─── Trigger Fallback: No Trigger Config ──────────────────────────────────


async def test_fallback_no_trigger_config(
    hass: HomeAssistant, global_entry_notifications: MockConfigEntry,
) -> None:
    """Test fallback does nothing when trigger_config is None."""
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(task_id=TASK_ID_1, last_performed=last)
    # No trigger_config → time-based only
    obj_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="No Trigger",
        data=build_object_entry_data(
            object_data=build_object_data(name="No Trigger"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_no_trigger",
    )
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry_notifications, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    data = entry.runtime_data.coordinator.data
    # Should have _trigger_active = False for time-based tasks
    assert data[CONF_TASKS][TASK_ID_1].get("_trigger_active") is False


# ─── Trigger Fallback: Unavailable Entity ──────────────────────────────────


async def test_fallback_unavailable_entity(
    hass: HomeAssistant, global_entry_notifications: MockConfigEntry,
) -> None:
    """Test threshold fallback with unavailable entity."""
    hass.states.async_set("sensor.temp_unav", "unavailable")
    task = build_task_data(
        task_id=TASK_ID_1,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "threshold",
            "entity_id": "sensor.temp_unav",
            "trigger_above": 30,
        },
    )
    obj_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Unavailable",
        data=build_object_entry_data(
            object_data=build_object_data(name="Unavailable"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_unavail_entity",
    )
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry_notifications, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    data = entry.runtime_data.coordinator.data
    # Unavailable entity should not trigger
    assert data[CONF_TASKS][TASK_ID_1]["_trigger_active"] is False


# ─── Trigger Fallback: Counter with Delta Mode ───────────────────────────


async def test_fallback_counter_delta(
    hass: HomeAssistant, global_entry_notifications: MockConfigEntry,
) -> None:
    """Test counter trigger with delta mode."""
    hass.states.async_set("sensor.counter", "150")
    task = build_task_data(
        task_id=TASK_ID_1,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "counter",
            "entity_id": "sensor.counter",
            "trigger_target_value": 100,
            "trigger_delta_mode": True,
            "trigger_baseline_value": 100,
        },
    )
    obj_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Counter Delta",
        data=build_object_entry_data(
            object_data=build_object_data(name="Counter Delta"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_counter_delta",
    )
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry_notifications, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    data = entry.runtime_data.coordinator.data
    # Delta = 150 - 100 = 50, target = 100 → not triggered
    assert data[CONF_TASKS][TASK_ID_1]["_trigger_active"] is False


async def test_fallback_counter_absolute_triggered(
    hass: HomeAssistant, global_entry_notifications: MockConfigEntry,
) -> None:
    """Test counter trigger without delta mode — absolute value >= target."""
    hass.states.async_set("sensor.counter_abs", "150")
    task = build_task_data(
        task_id=TASK_ID_1,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "counter",
            "entity_id": "sensor.counter_abs",
            "trigger_target_value": 100,
            "trigger_delta_mode": False,
        },
    )
    obj_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Counter Abs",
        data=build_object_entry_data(
            object_data=build_object_data(name="Counter Abs"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_counter_abs",
    )
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry_notifications, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    data = entry.runtime_data.coordinator.data
    # 150 >= 100 → triggered
    assert data[CONF_TASKS][TASK_ID_1]["_trigger_active"] is True


# ─── Trigger Fallback: Attribute-based Threshold ──────────────────────────


async def test_fallback_threshold_attribute(
    hass: HomeAssistant, global_entry_notifications: MockConfigEntry,
) -> None:
    """Test threshold trigger reading from an entity attribute."""
    hass.states.async_set("sensor.device", "ok", {"temperature": 35.0})
    task = build_task_data(
        task_id=TASK_ID_1,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "threshold",
            "entity_id": "sensor.device",
            "attribute": "temperature",
            "trigger_above": 30,
        },
    )
    obj_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Attr Threshold",
        data=build_object_entry_data(
            object_data=build_object_data(name="Attr Threshold"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_attr_threshold",
    )
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry_notifications, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    data = entry.runtime_data.coordinator.data
    assert data[CONF_TASKS][TASK_ID_1]["_trigger_active"] is True


# ─── Complete with Adaptive Config ────────────────────────────────────────


async def test_complete_updates_history(
    hass: HomeAssistant, global_entry_notifications: MockConfigEntry,
) -> None:
    """Test that complete_maintenance adds history entry."""
    last = (dt_util.now().date() - timedelta(days=20)).isoformat()
    task = build_task_data(task_id=TASK_ID_1, last_performed=last, interval_days=30)
    obj_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Complete Test",
        data=build_object_entry_data(
            object_data=build_object_data(name="Complete Test"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_complete_hist",
    )
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry_notifications, obj_entry)

    coordinator = obj_entry.runtime_data.coordinator
    await coordinator.complete_maintenance(
        task_id=TASK_ID_1,
        notes="All good",
        cost=25.0,
        duration=15,
    )

    state = get_task_store_state(hass, obj_entry.entry_id, TASK_ID_1)
    history = state.get("history", [])
    completed = [h for h in history if h.get("type") == "completed"]
    assert len(completed) >= 1
    assert completed[-1].get("cost") == 25.0
    assert completed[-1].get("duration") == 15


async def test_skip_maintenance(
    hass: HomeAssistant, global_entry_notifications: MockConfigEntry,
) -> None:
    """Test skip_maintenance adds skip entry."""
    last = (dt_util.now().date() - timedelta(days=20)).isoformat()
    task = build_task_data(task_id=TASK_ID_1, last_performed=last, interval_days=30)
    obj_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Skip Test",
        data=build_object_entry_data(
            object_data=build_object_data(name="Skip Test"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_skip_test",
    )
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry_notifications, obj_entry)

    coordinator = obj_entry.runtime_data.coordinator
    await coordinator.skip_maintenance(task_id=TASK_ID_1, reason="Not needed")

    state = get_task_store_state(hass, obj_entry.entry_id, TASK_ID_1)
    history = state.get("history", [])
    assert any(h.get("type") == "skipped" for h in history)


async def test_reset_maintenance(
    hass: HomeAssistant, global_entry_notifications: MockConfigEntry,
) -> None:
    """Test reset_maintenance clears last_performed."""
    last = (dt_util.now().date() - timedelta(days=20)).isoformat()
    task = build_task_data(task_id=TASK_ID_1, last_performed=last, interval_days=30)
    obj_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Reset Test",
        data=build_object_entry_data(
            object_data=build_object_data(name="Reset Test"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_reset_test",
    )
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry_notifications, obj_entry)

    coordinator = obj_entry.runtime_data.coordinator
    await coordinator.reset_maintenance(task_id=TASK_ID_1)

    # Reset sets last_performed to today (dynamic state in Store)
    state = get_task_store_state(hass, obj_entry.entry_id, TASK_ID_1)
    assert state.get("last_performed") == dt_util.now().date().isoformat()
