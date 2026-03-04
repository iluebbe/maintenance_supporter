"""Tests for interval_anchor feature (planned vs completion anchoring)."""

from __future__ import annotations

from datetime import date, timedelta
from typing import Any
from unittest.mock import patch

import pytest

from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MaintenanceStatus,
    ScheduleType,
)
from custom_components.maintenance_supporter.models.maintenance_task import (
    MaintenanceTask,
)

from .conftest import (
    OBJECT_ID_1,
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    setup_integration,
)


# ─── Unit tests for MaintenanceTask.next_due ─────────────────────────────


class TestIntervalAnchorCompletion:
    """Tests for the default completion-based anchoring."""

    def test_next_due_from_completion_date(self) -> None:
        """Default: next_due = last_performed + interval_days."""
        task = MaintenanceTask(
            id=TASK_ID_1,
            name="Test",
            last_performed="2026-01-15",
            interval_days=30,
            interval_anchor="completion",
        )
        assert task.next_due == date(2026, 2, 14)

    def test_next_due_default_is_completion(self) -> None:
        """interval_anchor defaults to 'completion'."""
        task = MaintenanceTask(
            id=TASK_ID_1,
            name="Test",
            last_performed="2026-01-15",
            interval_days=30,
        )
        assert task.interval_anchor == "completion"
        assert task.next_due == date(2026, 2, 14)

    def test_completion_anchor_late_completion_causes_drift(self) -> None:
        """With completion anchor, late completion shifts the schedule forward."""
        # Planned for Jan 15, but completed on Jan 25 (10 days late)
        task = MaintenanceTask(
            id=TASK_ID_1,
            name="Test",
            last_performed="2026-01-25",
            interval_days=30,
        )
        # Next due: Jan 25 + 30 = Feb 24 (not Feb 14)
        assert task.next_due == date(2026, 2, 24)


class TestIntervalAnchorPlanned:
    """Tests for planned-date anchoring (prevents schedule drift)."""

    @patch("custom_components.maintenance_supporter.models.maintenance_task.dt_util")
    def test_planned_anchor_on_time(self, mock_dt) -> None:
        """Planned anchor on-time completion: same as completion anchor."""
        # "Today" is Jan 20 — next due (Feb 14) is in the future
        mock_dt.now.return_value.date.return_value = date(2026, 1, 20)

        task = MaintenanceTask(
            id=TASK_ID_1,
            name="Test",
            last_performed="2026-01-15",
            interval_days=30,
            interval_anchor="planned",
        )
        assert task.next_due == date(2026, 2, 14)

    @patch("custom_components.maintenance_supporter.models.maintenance_task.dt_util")
    def test_planned_anchor_late_completion_no_drift(self, mock_dt) -> None:
        """Planned anchor: late completion doesn't cause schedule drift."""
        # "Today" is Feb 20
        mock_dt.now.return_value.date.return_value = date(2026, 2, 20)

        # Planned for Jan 15 + 30 = Feb 14, completed on Feb 20
        task = MaintenanceTask(
            id=TASK_ID_1,
            name="Test",
            last_performed="2026-02-20",
            interval_days=30,
            interval_anchor="planned",
        )
        # Next due: Feb 20 + 30 = Mar 22 (first interval boundary after last_performed)
        assert task.next_due == date(2026, 3, 22)

    @patch("custom_components.maintenance_supporter.models.maintenance_task.dt_util")
    def test_planned_anchor_missed_periods(self, mock_dt) -> None:
        """Planned anchor with multiple missed periods advances to next future date."""
        # "Today" is June 1
        mock_dt.now.return_value.date.return_value = date(2026, 6, 1)

        # Last performed Jan 1, 30-day interval
        # candidate = Jan 1 + 30 = Jan 31
        # Jan 31 < Jun 1, so advance: (Jun 1 - Jan 31) = 121 days, 121/30 = 4 periods
        # Jan 31 + 4*30 = Jan 31 + 120 = May 31
        # May 31 < Jun 1, advance one more: May 31 + 30 = Jun 30
        task = MaintenanceTask(
            id=TASK_ID_1,
            name="Test",
            last_performed="2026-01-01",
            interval_days=30,
            interval_anchor="planned",
        )
        assert task.next_due >= date(2026, 6, 1)

    @patch("custom_components.maintenance_supporter.models.maintenance_task.dt_util")
    def test_planned_anchor_future_due_not_advanced(self, mock_dt) -> None:
        """Planned anchor: if candidate is already in the future, use it."""
        # "Today" is Feb 1
        mock_dt.now.return_value.date.return_value = date(2026, 2, 1)

        task = MaintenanceTask(
            id=TASK_ID_1,
            name="Test",
            last_performed="2026-01-15",
            interval_days=30,
            interval_anchor="planned",
        )
        # candidate = Jan 15 + 30 = Feb 14, which is after today (Feb 1)
        assert task.next_due == date(2026, 2, 14)


class TestIntervalAnchorEdgeCases:
    """Edge case tests for interval anchoring."""

    def test_no_interval_returns_none(self) -> None:
        """No interval_days → next_due is None."""
        task = MaintenanceTask(
            id=TASK_ID_1,
            name="Test",
            last_performed="2026-01-15",
            interval_days=None,
            interval_anchor="planned",
        )
        assert task.next_due is None

    def test_no_last_performed_returns_today(self) -> None:
        """No last_performed → next_due is today."""
        task = MaintenanceTask(
            id=TASK_ID_1,
            name="Test",
            interval_days=30,
            interval_anchor="planned",
        )
        assert task.next_due == dt_util.now().date()

    def test_invalid_last_performed(self) -> None:
        """Invalid last_performed → next_due is None."""
        task = MaintenanceTask(
            id=TASK_ID_1,
            name="Test",
            last_performed="not-a-date",
            interval_days=30,
            interval_anchor="planned",
        )
        assert task.next_due is None

    def test_manual_schedule_no_interval(self) -> None:
        """Manual schedule with no interval_days → next_due is None."""
        task = MaintenanceTask(
            id=TASK_ID_1,
            name="Test",
            schedule_type=ScheduleType.MANUAL,
            interval_days=None,
            interval_anchor="completion",
        )
        assert task.next_due is None


# ─── Serialization ───────────────────────────────────────────────────────


class TestIntervalAnchorSerialization:
    """Tests for to_dict/from_dict serialization of interval_anchor."""

    def test_to_dict_omits_default(self) -> None:
        """Default 'completion' is omitted from to_dict output."""
        task = MaintenanceTask(
            id=TASK_ID_1,
            name="Test",
            interval_anchor="completion",
        )
        data = task.to_dict()
        assert "interval_anchor" not in data

    def test_to_dict_includes_planned(self) -> None:
        """'planned' is explicitly included in to_dict output."""
        task = MaintenanceTask(
            id=TASK_ID_1,
            name="Test",
            interval_anchor="planned",
        )
        data = task.to_dict()
        assert data["interval_anchor"] == "planned"

    def test_from_dict_default(self) -> None:
        """from_dict without interval_anchor defaults to 'completion'."""
        data = {"id": TASK_ID_1, "name": "Test"}
        task = MaintenanceTask.from_dict(data)
        assert task.interval_anchor == "completion"

    def test_from_dict_planned(self) -> None:
        """from_dict with interval_anchor='planned' preserves it."""
        data = {"id": TASK_ID_1, "name": "Test", "interval_anchor": "planned"}
        task = MaintenanceTask.from_dict(data)
        assert task.interval_anchor == "planned"

    def test_roundtrip(self) -> None:
        """to_dict → from_dict roundtrip preserves interval_anchor."""
        original = MaintenanceTask(
            id=TASK_ID_1,
            name="Test",
            interval_days=30,
            interval_anchor="planned",
        )
        restored = MaintenanceTask.from_dict(original.to_dict())
        assert restored.interval_anchor == "planned"
        assert restored.interval_days == 30


# ─── Integration test: sensor attribute ──────────────────────────────────


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


async def test_sensor_exposes_interval_anchor(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test that the sensor entity exposes interval_anchor in its attributes."""
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(task_id=TASK_ID_1, last_performed=last)
    task["interval_anchor"] = "planned"

    obj_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Anchor Test",
        data=build_object_entry_data(
            object_data=build_object_data(name="Anchor Test"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_anchor_test",
    )
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj_entry)

    entity_reg = er.async_get(hass)
    entities = er.async_entries_for_config_entry(entity_reg, obj_entry.entry_id)
    sensors = [e for e in entities if e.domain == "sensor"]
    assert len(sensors) >= 1

    state = hass.states.get(sensors[0].entity_id)
    assert state is not None
    assert state.attributes.get("interval_anchor") == "planned"


async def test_sensor_default_anchor_completion(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test that the default interval_anchor is 'completion' in sensor attributes."""
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(task_id=TASK_ID_1, last_performed=last)

    obj_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Default Anchor",
        data=build_object_entry_data(
            object_data=build_object_data(name="Default Anchor"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_default_anchor",
    )
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj_entry)

    entity_reg = er.async_get(hass)
    entities = er.async_entries_for_config_entry(entity_reg, obj_entry.entry_id)
    sensors = [e for e in entities if e.domain == "sensor"]
    state = hass.states.get(sensors[0].entity_id)
    assert state is not None
    assert state.attributes.get("interval_anchor") == "completion"
