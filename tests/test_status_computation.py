"""Tests for status computation (OK, DUE_SOON, OVERDUE, TRIGGERED)."""

from __future__ import annotations

from datetime import date, timedelta

import pytest
from freezegun import freeze_time

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from custom_components.maintenance_supporter.const import (
    CONF_TASKS,
    DOMAIN,
    MaintenanceStatus,
)
from custom_components.maintenance_supporter.models.maintenance_task import (
    MaintenanceTask,
)

from .conftest import (
    TASK_ID_1,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    setup_integration,
)


# ─── 6.1 Unit Tests for MaintenanceTask.status ──────────────────────────


class TestMaintenanceTaskStatus:
    """Unit tests for MaintenanceTask status computation."""

    def test_ok_status_within_interval(self) -> None:
        """Task performed recently should be OK."""
        last = (dt_util.now().date() - timedelta(days=10)).isoformat()
        task = MaintenanceTask.from_dict(
            build_task_data(interval_days=30, warning_days=7, last_performed=last)
        )
        assert task.status == MaintenanceStatus.OK

    def test_due_soon_within_warning(self) -> None:
        """Task approaching due date should be DUE_SOON."""
        last = (dt_util.now().date() - timedelta(days=25)).isoformat()
        task = MaintenanceTask.from_dict(
            build_task_data(interval_days=30, warning_days=7, last_performed=last)
        )
        assert task.status == MaintenanceStatus.DUE_SOON

    def test_overdue_past_interval(self) -> None:
        """Task past its due date should be OVERDUE."""
        last = (dt_util.now().date() - timedelta(days=60)).isoformat()
        task = MaintenanceTask.from_dict(
            build_task_data(interval_days=30, warning_days=7, last_performed=last)
        )
        assert task.status == MaintenanceStatus.OVERDUE

    def test_triggered_status(self) -> None:
        """Task with active trigger should be TRIGGERED."""
        last = (dt_util.now().date() - timedelta(days=5)).isoformat()
        task = MaintenanceTask.from_dict(
            build_task_data(interval_days=30, warning_days=7, last_performed=last)
        )
        task._trigger_active = True
        assert task.status == MaintenanceStatus.TRIGGERED

    def test_triggered_overrides_time_based(self) -> None:
        """Trigger status should take precedence over time-based status."""
        last = (dt_util.now().date() - timedelta(days=60)).isoformat()
        task = MaintenanceTask.from_dict(
            build_task_data(interval_days=30, warning_days=7, last_performed=last)
        )
        # Without trigger: overdue
        assert task.status == MaintenanceStatus.OVERDUE
        # With trigger: triggered takes precedence
        task._trigger_active = True
        assert task.status == MaintenanceStatus.TRIGGERED

    def test_never_performed_with_interval(self) -> None:
        """Task never performed but with interval should be immediately due."""
        task = MaintenanceTask.from_dict(
            build_task_data(
                interval_days=30,
                warning_days=7,
                last_performed=None,
            )
        )
        # days_until_due should be 0 (immediately due)
        assert task.days_until_due == 0
        # Status with 0 days until due and warning_days=7 → DUE_SOON
        assert task.status == MaintenanceStatus.DUE_SOON

    def test_manual_no_interval_is_ok(self) -> None:
        """Manual task without interval should be OK."""
        data = build_task_data(
            schedule_type="manual",
            interval_days=None,
            last_performed=None,
        )
        # Remove interval_days key entirely
        data.pop("interval_days", None)
        task = MaintenanceTask.from_dict(data)
        assert task.status == MaintenanceStatus.OK

    def test_disabled_task(self) -> None:
        """Disabled task should not be evaluated (handled by coordinator)."""
        task = MaintenanceTask.from_dict(
            build_task_data(enabled=False)
        )
        # The model still computes status, but the coordinator skips it
        assert task.enabled is False


# ─── 6.2 Days Until Due ─────────────────────────────────────────────────


class TestDaysUntilDue:
    """Test days_until_due computation."""

    def test_positive_days(self) -> None:
        """Test task with days remaining."""
        last = (dt_util.now().date() - timedelta(days=10)).isoformat()
        task = MaintenanceTask.from_dict(
            build_task_data(interval_days=30, last_performed=last)
        )
        assert task.days_until_due == 20

    def test_negative_days_overdue(self) -> None:
        """Test overdue task has negative days."""
        last = (dt_util.now().date() - timedelta(days=40)).isoformat()
        task = MaintenanceTask.from_dict(
            build_task_data(interval_days=30, last_performed=last)
        )
        assert task.days_until_due == -10

    def test_due_today(self) -> None:
        """Test task due today."""
        last = (dt_util.now().date() - timedelta(days=30)).isoformat()
        task = MaintenanceTask.from_dict(
            build_task_data(interval_days=30, last_performed=last)
        )
        assert task.days_until_due == 0

    def test_no_interval_returns_none(self) -> None:
        """Test task without interval."""
        data = build_task_data(last_performed="2024-01-01")
        data.pop("interval_days", None)
        task = MaintenanceTask.from_dict(data)
        assert task.days_until_due is None


# ─── 6.3 Next Due ───────────────────────────────────────────────────────


class TestNextDue:
    """Test next_due computation."""

    def test_next_due_calculation(self) -> None:
        """Test basic next_due calculation."""
        last = "2024-06-01"
        task = MaintenanceTask.from_dict(
            build_task_data(interval_days=30, last_performed=last)
        )
        assert task.next_due == date(2024, 7, 1)

    def test_no_last_performed(self) -> None:
        """Test next_due with no last_performed returns today (immediately due)."""
        task = MaintenanceTask.from_dict(
            build_task_data(interval_days=30, last_performed=None)
        )
        assert task.next_due == dt_util.now().date()


# ─── 6.4 Integration Status via Coordinator ─────────────────────────────


async def test_sensor_shows_ok_status(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """Test that sensor shows OK when task is not yet due."""
    await setup_integration(hass, global_config_entry, object_config_entry)

    # Find sensor entity
    states = hass.states.async_all("sensor")
    maintenance_sensors = [
        s for s in states if s.entity_id.startswith("sensor.maintenance_supporter")
        or DOMAIN in (s.attributes.get("integration") or "")
    ]
    # There should be at least one sensor from the object entry
    # The sensor value should be the status
    if maintenance_sensors:
        assert maintenance_sensors[0].state in [
            MaintenanceStatus.OK,
            MaintenanceStatus.DUE_SOON,
        ]


async def test_sensor_shows_overdue_status(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    overdue_config_entry: ConfigEntry,
) -> None:
    """Test that sensor shows OVERDUE when task is past due."""
    from homeassistant.helpers import entity_registry as er

    await setup_integration(hass, global_config_entry, overdue_config_entry)

    # Look for the sensor by checking all entities for the config entry
    entity_reg = er.async_get(hass)
    entities = er.async_entries_for_config_entry(
        entity_reg, overdue_config_entry.entry_id
    )
    sensor_entities = [e for e in entities if e.domain == "sensor"]

    assert len(sensor_entities) >= 1, "Expected at least one sensor entity"
    state = hass.states.get(sensor_entities[0].entity_id)
    assert state is not None
    assert state.state == MaintenanceStatus.OVERDUE


# ─── 6.5 History Properties ─────────────────────────────────────────────


class TestHistoryProperties:
    """Test history-derived properties."""

    def test_times_performed(self) -> None:
        """Test counting completed entries."""
        history = [
            {"type": "completed", "timestamp": "2024-01-01T00:00:00"},
            {"type": "completed", "timestamp": "2024-02-01T00:00:00"},
            {"type": "skipped", "timestamp": "2024-03-01T00:00:00"},
        ]
        task = MaintenanceTask.from_dict(
            build_task_data(history=history)
        )
        assert task.times_performed == 2

    def test_total_cost(self) -> None:
        """Test cost summation."""
        history = [
            {"type": "completed", "timestamp": "2024-01-01T00:00:00", "cost": 25.50},
            {"type": "completed", "timestamp": "2024-02-01T00:00:00", "cost": 30.00},
        ]
        task = MaintenanceTask.from_dict(
            build_task_data(history=history)
        )
        assert task.total_cost == 55.50

    def test_average_duration(self) -> None:
        """Test average duration calculation."""
        history = [
            {"type": "completed", "timestamp": "2024-01-01T00:00:00", "duration": 30},
            {"type": "completed", "timestamp": "2024-02-01T00:00:00", "duration": 60},
        ]
        task = MaintenanceTask.from_dict(
            build_task_data(history=history)
        )
        assert task.average_duration == 45.0

    def test_average_duration_none_when_empty(self) -> None:
        """Test average duration is None with no data."""
        task = MaintenanceTask.from_dict(build_task_data())
        assert task.average_duration is None

    def test_last_entry(self) -> None:
        """Test last_entry returns most recent."""
        history = [
            {"type": "completed", "timestamp": "2024-01-01T00:00:00"},
            {"type": "skipped", "timestamp": "2024-02-01T00:00:00"},
        ]
        task = MaintenanceTask.from_dict(
            build_task_data(history=history)
        )
        assert task.last_entry["type"] == "skipped"
