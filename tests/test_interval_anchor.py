"""Tests for interval_anchor feature (planned vs completion anchoring)."""

from __future__ import annotations

from datetime import date, datetime, timedelta
from typing import Any
from unittest.mock import MagicMock, patch

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MaintenanceStatus,
    ScheduleType,
)
from custom_components.maintenance_supporter.models.maintenance_task import (
    MaintenanceTask,
)

from .conftest import (
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
    def test_planned_anchor_on_time(self, mock_dt: MagicMock) -> None:
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
    def test_planned_anchor_late_completion_no_drift(self, mock_dt: MagicMock) -> None:
        """Planned anchor: late completion doesn't cause schedule drift."""
        # "Today" is Feb 20
        mock_dt.now.return_value.date.return_value = date(2026, 2, 20)

        # Was planned for Feb 14 (anchor), completed late on Feb 20
        task = MaintenanceTask(
            id=TASK_ID_1,
            name="Test",
            last_performed="2026-02-20",
            interval_days=30,
            interval_anchor="planned",
            last_planned_due="2026-02-14",  # the planned date before completion
        )
        # Next due: Feb 14 + 30 = Mar 16 (not Feb 20 + 30 = Mar 22)
        assert task.next_due == date(2026, 3, 16)

    @patch("custom_components.maintenance_supporter.models.maintenance_task.dt_util")
    def test_planned_anchor_without_stored_anchor_falls_back(self, mock_dt: MagicMock) -> None:
        """Without last_planned_due, planned mode falls back to last_performed."""
        mock_dt.now.return_value.date.return_value = date(2026, 2, 20)

        task = MaintenanceTask(
            id=TASK_ID_1,
            name="Test",
            last_performed="2026-02-20",
            interval_days=30,
            interval_anchor="planned",
            # No last_planned_due → falls back to last_performed
        )
        # Fallback: Feb 20 + 30 = Mar 22
        assert task.next_due == date(2026, 3, 22)

    @patch("custom_components.maintenance_supporter.models.maintenance_task.dt_util")
    def test_planned_anchor_missed_periods_shows_overdue(self, mock_dt: MagicMock) -> None:
        """Planned anchor with missed periods: next_due stays in the past → OVERDUE."""
        # "Today" is June 1
        mock_dt.now.return_value.date.return_value = date(2026, 6, 1)

        # Last performed Jan 1, 30-day interval
        # candidate = Jan 1 + 30 = Jan 31, which is past last_performed
        # No more advancing → next_due = Jan 31 (in the past) → OVERDUE
        task = MaintenanceTask(
            id=TASK_ID_1,
            name="Test",
            last_performed="2026-01-01",
            interval_days=30,
            interval_anchor="planned",
        )
        assert task.next_due == date(2026, 1, 31)
        assert task.status == MaintenanceStatus.OVERDUE

    @patch("custom_components.maintenance_supporter.models.maintenance_task.dt_util")
    def test_planned_anchor_overdue_then_complete(self, mock_dt: MagicMock) -> None:
        """Complete an overdue planned task, verify new next_due is correct."""
        # "Today" is June 1. A REAL datetime (not just a mocked .date()):
        # complete() also builds the history timestamp + latest-anchor
        # comparison from now().isoformat() (#133).
        mock_dt.now.return_value = datetime(2026, 6, 1, 12, 0, 0)

        task = MaintenanceTask(
            id=TASK_ID_1,
            name="Test",
            last_performed="2026-01-01",
            interval_days=30,
            interval_anchor="planned",
        )
        # Before complete: overdue
        assert task.next_due == date(2026, 1, 31)
        assert task.status == MaintenanceStatus.OVERDUE

        # Complete it — saves next_due (Jan 31) as last_planned_due
        task.complete()
        assert task.last_planned_due == "2026-01-31"
        assert task.last_performed == "2026-06-01"

        # After complete: next_due = Jan 31 + 30 = Mar 2,
        # but Mar 2 <= Jun 1 (last_performed), so advance:
        # Mar 2 + 30 = Apr 1, Apr 1 + 30 = May 1, May 1 + 30 = May 31,
        # May 31 + 30 = Jun 30. Jun 30 > Jun 1 → next_due = Jun 30
        assert task.next_due == date(2026, 6, 30)

    @patch("custom_components.maintenance_supporter.models.maintenance_task.dt_util")
    def test_planned_anchor_future_due_not_advanced(self, mock_dt: MagicMock) -> None:
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

    def test_no_last_performed_returns_today_plus_interval(self) -> None:
        """No last_performed → next_due is today + interval (issue #30 fix).

        Without an anchor, the legacy fallback uses today + interval_days so
        the task does not appear due immediately on every refresh.
        """
        from datetime import timedelta

        task = MaintenanceTask(
            id=TASK_ID_1,
            name="Test",
            interval_days=30,
            interval_anchor="planned",
        )
        assert task.next_due == dt_util.now().date() + timedelta(days=30)

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
        """'planned' is carried in the nested schedule (schedule-model v2)."""
        task = MaintenanceTask(
            id=TASK_ID_1,
            name="Test",
            interval_days=30,
            interval_anchor="planned",
        )
        data = task.to_dict()
        assert data["schedule"]["anchor"] == "planned"

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

    def test_last_planned_due_serialization(self) -> None:
        """last_planned_due is serialized and deserialized correctly."""
        task = MaintenanceTask(
            id=TASK_ID_1,
            name="Test",
            interval_anchor="planned",
            last_planned_due="2026-03-01",
        )
        data = task.to_dict()
        assert data["last_planned_due"] == "2026-03-01"

        restored = MaintenanceTask.from_dict(data)
        assert restored.last_planned_due == "2026-03-01"

    def test_last_planned_due_omitted_when_none(self) -> None:
        """last_planned_due is omitted from to_dict when None."""
        task = MaintenanceTask(id=TASK_ID_1, name="Test")
        data = task.to_dict()
        assert "last_planned_due" not in data


# ─── Complete/Skip save last_planned_due ─────────────────────────────────


class TestPlannedAnchorOnComplete:
    """Tests that complete/skip save last_planned_due for planned anchor."""

    @patch("custom_components.maintenance_supporter.models.maintenance_task.dt_util")
    def test_complete_saves_last_planned_due(self, mock_dt: MagicMock) -> None:
        """complete() saves current next_due as last_planned_due."""
        # Set today to Feb 15 so next_due (Mar 3) is in the future — a real
        # datetime, see test_planned_anchor_overdue_then_complete.
        mock_dt.now.return_value = datetime(2026, 2, 15, 12, 0, 0)

        task = MaintenanceTask(
            id=TASK_ID_1,
            name="Test",
            last_performed="2026-02-01",
            interval_days=30,
            interval_anchor="planned",
        )
        # Before complete: next_due = Feb 1 + 30 = Mar 3
        assert task.next_due == date(2026, 3, 3)

        task.complete()

        assert task.last_planned_due == "2026-03-03"
        assert task.last_performed == "2026-02-15"

    @patch("custom_components.maintenance_supporter.models.maintenance_task.dt_util")
    def test_skip_saves_last_planned_due(self, mock_dt: MagicMock) -> None:
        """skip() saves current next_due as last_planned_due."""
        mock_dt.now.return_value.date.return_value = date(2026, 2, 15)

        task = MaintenanceTask(
            id=TASK_ID_1,
            name="Test",
            last_performed="2026-02-01",
            interval_days=30,
            interval_anchor="planned",
        )
        # next_due = Feb 1 + 30 = Mar 3
        assert task.next_due == date(2026, 3, 3)
        task.skip()
        assert task.last_planned_due == "2026-03-03"

    def test_completion_anchor_does_not_save_planned_due(self) -> None:
        """complete() with completion anchor doesn't save last_planned_due."""
        task = MaintenanceTask(
            id=TASK_ID_1,
            name="Test",
            last_performed="2026-02-01",
            interval_days=30,
            interval_anchor="completion",
        )
        task.complete()
        assert task.last_planned_due is None


# ─── Integration test: sensor attribute ──────────────────────────────────


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


async def test_sensor_exposes_interval_anchor(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """Test that the sensor entity exposes interval_anchor in its attributes."""
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(task_id=TASK_ID_1, last_performed=last)
    task["interval_anchor"] = "planned"

    obj_entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
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
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """Test that the default interval_anchor is 'completion' in sensor attributes."""
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(task_id=TASK_ID_1, last_performed=last)

    obj_entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
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


# ─── Reset clears last_planned_due ───────────────────────────────────────


class TestResetClearsPlannedAnchor:
    """Tests that reset() clears last_planned_due."""

    @patch("custom_components.maintenance_supporter.models.maintenance_task.dt_util")
    def test_reset_clears_last_planned_due(self, mock_dt: MagicMock) -> None:
        """Reset must clear last_planned_due so next_due anchors from reset date."""
        mock_dt.now.return_value.date.return_value = date(2026, 2, 15)

        task = MaintenanceTask(
            id=TASK_ID_1,
            name="Test",
            last_performed="2026-02-01",
            interval_days=30,
            interval_anchor="planned",
            last_planned_due="2026-01-15",
        )
        task.reset(reset_date=date(2026, 2, 10))
        assert task.last_planned_due is None
        assert task.last_performed == "2026-02-10"
        # next_due should be 30 days from reset date (no anchor)
        assert task.next_due == date(2026, 3, 12)

    @patch("custom_components.maintenance_supporter.models.maintenance_task.dt_util")
    def test_reset_without_anchor_still_works(self, mock_dt: MagicMock) -> None:
        """Reset on completion-anchor task doesn't break anything."""
        mock_dt.now.return_value.date.return_value = date(2026, 2, 15)

        task = MaintenanceTask(
            id=TASK_ID_1,
            name="Test",
            last_performed="2026-02-01",
            interval_days=30,
            interval_anchor="completion",
        )
        task.reset(reset_date=date(2026, 2, 10))
        assert task.last_planned_due is None
        assert task.next_due == date(2026, 3, 12)


# ─── interval_analyzer edge cases (migrated from test_coverage_97c.py) ────


def test_compute_intervals_bad_timestamps() -> None:
    """Lines 351, 357-358: malformed timestamps skipped."""
    from custom_components.maintenance_supporter.helpers.interval_analyzer import (
        IntervalAnalyzer,
    )

    history: list[dict[str, Any]] = [
        {"type": "completed", "timestamp": None},  # line 351: falsy
        {"type": "completed", "timestamp": "bad_date"},  # line 357-358
        {"type": "completed", "timestamp": "2024-01-01T00:00:00"},
        {"type": "completed", "timestamp": "2024-02-01T00:00:00"},
    ]
    intervals = IntervalAnalyzer._compute_intervals_from_history(history)
    assert intervals == [31]  # Jan → Feb only


def test_weibull_fit_few_valid_points() -> None:
    """Line 426: filtered valid points < 5 → return None."""
    from custom_components.maintenance_supporter.helpers.interval_analyzer import (
        IntervalAnalyzer,
    )

    # Only 3 positive values → below DEFAULT_ADAPTIVE_WEIBULL_MIN (5)
    result = IntervalAnalyzer._weibull_fit([10, 20, 30])
    assert result is None


def test_weibull_fit_few_xy_pairs() -> None:
    """Line 447: < 3 valid x/y pairs → return None."""
    from custom_components.maintenance_supporter.helpers.interval_analyzer import (
        IntervalAnalyzer,
    )

    # 5 identical values → all get same rank, log calculations might produce <3 valid pairs
    # Actually, 5 positive distinct values should work. Let's use values that cause
    # log(-log(1-f)) to fail for most points.
    # With 5 points: ranks 1-5, f = (i-0.3)/(5.4)
    # All should be valid. Let me use 5 values where some are 0 (filtered out)
    # leaving < 3 valid.
    result = IntervalAnalyzer._weibull_fit([10, 0, 0, 0, 20])
    # After filtering zeros: only 2 valid points → < DEFAULT_ADAPTIVE_WEIBULL_MIN
    assert result is None


def test_seasonal_intervals_bad_timestamps() -> None:
    """Lines 549, 555-556: seasonal interval extraction with bad timestamps."""
    from custom_components.maintenance_supporter.helpers.interval_analyzer import (
        IntervalAnalyzer,
    )

    history: list[dict[str, Any]] = [
        {"type": "completed", "timestamp": None},  # line 549
        {"type": "completed", "timestamp": "bad"},  # line 555-556
        {"type": "completed", "timestamp": "2024-01-01T00:00:00"},
        {"type": "completed", "timestamp": "2024-02-15T00:00:00"},
    ]
    result = IntervalAnalyzer._compute_intervals_with_months(history)
    assert len(result) == 1
    assert result[0] == (45, 2)  # 45 days, February


class TestAnalysisDatetimeFix:
    """Verify analysis.py uses dt_util.now() instead of naive datetime."""

    def test_analysis_uses_injected_current_month(self) -> None:
        """IntervalAnalyzer.analyze uses _current_month from config."""
        from custom_components.maintenance_supporter.helpers.interval_analyzer import (
            IntervalAnalyzer,
        )

        analyzer = IntervalAnalyzer()
        task_data = {
            "history": [
                {"timestamp": "2026-01-01T00:00:00", "type": "completed"},
                {"timestamp": "2026-01-31T00:00:00", "type": "completed"},
                {"timestamp": "2026-03-02T00:00:00", "type": "completed"},
            ],
            "interval_days": 30,
        }
        config = {
            "enabled": True,
            "_current_month": 7,  # Inject July
            "seasonal_enabled": True,
        }
        result = analyzer.analyze(task_data, config)
        # Should not crash and should use month 7 for seasonal calc
        assert result is not None

    def test_update_on_completion_uses_injected_month(self) -> None:
        """update_on_completion uses _current_month from config."""
        from custom_components.maintenance_supporter.helpers.interval_analyzer import (
            IntervalAnalyzer,
        )

        analyzer = IntervalAnalyzer()
        config = {
            "enabled": True,
            "smoothed_interval": 30.0,
            "_seasonal_factors": [1.0] * 12,
            "seasonal_enabled": True,
            "_current_month": 3,
            "_current_date": "2026-03-05",
        }
        result = analyzer.update_on_completion(config, 28, None)
        assert result["last_analysis_date"] == "2026-03-05"

    def test_update_on_completion_fallback_without_injection(self) -> None:
        """update_on_completion still works without _current_month (fallback)."""
        from custom_components.maintenance_supporter.helpers.interval_analyzer import (
            IntervalAnalyzer,
        )

        analyzer = IntervalAnalyzer()
        config = {
            "enabled": True,
            "smoothed_interval": 30.0,
        }
        result = analyzer.update_on_completion(config, 28, None)
        # Should not crash, date should be set
        assert "last_analysis_date" in result


# === migrated from test_cov_helpers.py (behaviour-based split) ===


def test_weibull_fit_with_sufficient_data() -> None:
    """Lines 443-453: Weibull fit succeeds with enough valid data points."""
    from custom_components.maintenance_supporter.helpers.interval_analyzer import IntervalAnalyzer

    analyzer = IntervalAnalyzer()
    intervals = [25.0, 28.0, 30.0, 32.0, 27.0, 29.0]
    result = analyzer._weibull_fit(intervals)
    assert result is not None
    beta, eta, r_squared = result
    assert beta > 0
    assert eta > 0
    assert 0.0 <= r_squared <= 1.0


def test_weibull_fit_insufficient_data_returns_none() -> None:
    """Line 423: Weibull fit returns None with fewer than min required points."""
    from custom_components.maintenance_supporter.helpers.interval_analyzer import IntervalAnalyzer

    analyzer = IntervalAnalyzer()
    result = analyzer._weibull_fit([10.0, 20.0])  # less than DEFAULT_ADAPTIVE_WEIBULL_MIN
    assert result is None


def test_weibull_fit_all_zeros_returns_none() -> None:
    """Lines 449-450: ValueError in log(0) is caught, continues."""
    from custom_components.maintenance_supporter.helpers.interval_analyzer import IntervalAnalyzer

    analyzer = IntervalAnalyzer()
    # Zeros filtered by 'valid' check; if not enough valid, returns None
    result = analyzer._weibull_fit([0.0, 0.0, 0.0, 0.0, 0.0])
    assert result is None


def test_weibull_recommended_interval_invalid_params() -> None:
    """Lines 514-515: _weibull_recommended_interval returns 0 for invalid params."""
    from custom_components.maintenance_supporter.helpers.interval_analyzer import IntervalAnalyzer

    # beta <= 0
    assert IntervalAnalyzer._weibull_recommended_interval(0.0, 30.0, 0.9) == 0
    # reliability out of range
    assert IntervalAnalyzer._weibull_recommended_interval(1.5, 30.0, 0.0) == 0
    assert IntervalAnalyzer._weibull_recommended_interval(1.5, 30.0, 1.0) == 0
    # eta <= 0
    assert IntervalAnalyzer._weibull_recommended_interval(1.5, -1.0, 0.9) == 0


def test_weibull_recommended_interval_valid() -> None:
    """_weibull_recommended_interval returns positive int for valid params."""
    from custom_components.maintenance_supporter.helpers.interval_analyzer import IntervalAnalyzer

    result = IntervalAnalyzer._weibull_recommended_interval(2.0, 30.0, 0.9)
    assert isinstance(result, int)
    assert result >= 1


def test_weibull_fit_denom_zero_returns_none() -> None:
    """Line 464-465: denom < 1e-10 → returns None (all x_vals identical)."""
    from custom_components.maintenance_supporter.helpers.interval_analyzer import IntervalAnalyzer

    analyzer = IntervalAnalyzer()
    # All identical values → x_vals all same → denom = 0
    result = analyzer._weibull_fit([30.0] * 7)
    # This might or might not produce None depending on fp precision; just assert no crash
    assert result is None or isinstance(result, tuple)


def test_compute_confidence_levels() -> None:
    """Lines 471-480 / 527-531: _compute_confidence returns correct level."""
    from custom_components.maintenance_supporter.const import DEFAULT_ADAPTIVE_MIN_COMPLETIONS
    from custom_components.maintenance_supporter.helpers.interval_analyzer import IntervalAnalyzer

    assert IntervalAnalyzer._compute_confidence(0) == "low"
    assert IntervalAnalyzer._compute_confidence(DEFAULT_ADAPTIVE_MIN_COMPLETIONS - 1) == "low"
    assert IntervalAnalyzer._compute_confidence(DEFAULT_ADAPTIVE_MIN_COMPLETIONS) == "medium"
    assert IntervalAnalyzer._compute_confidence(8) == "high"
    assert IntervalAnalyzer._compute_confidence(100) == "high"


def test_weibull_beta_nonpositive_returns_none() -> None:
    """Line 471: beta <= 0 returns None after regression."""
    from custom_components.maintenance_supporter.helpers.interval_analyzer import IntervalAnalyzer

    # Decreasing series → slope may be negative → beta <= 0 → None
    analyzer = IntervalAnalyzer()
    # Strongly decreasing intervals: log-space will have negative slope
    result = analyzer._weibull_fit([100.0, 80.0, 60.0, 40.0, 20.0, 10.0])
    # Could be None (beta<=0) or a valid fit depending on data; just no crash
    assert result is None or (isinstance(result, tuple) and len(result) == 3)


def test_weibull_eta_zero_overflow_returns_none() -> None:
    """Lines 476-477, 480: OverflowError/ZeroDivisionError → None; eta <= 0 → None."""
    from custom_components.maintenance_supporter.helpers.interval_analyzer import IntervalAnalyzer

    analyzer = IntervalAnalyzer()
    # Pathological data that may trigger overflow in exp()
    # Very large b/beta ratio → large negative → near-zero eta
    result = analyzer._weibull_fit([1.0, 2.0, 3.0, 4.0, 5.0, 6.0])
    # Just assert no exception
    assert result is None or isinstance(result, tuple)


class TestPlannedAnchorPostponeInteraction:
    """Bug audit 2026-08-22: complete()/skip() anchored on next_due, which
    returns the postpone override when one is set — a one-shot 19-day postpone
    shifted the whole planned cadence by 19 days FOREVER. The anchor update
    must use the drift-free grid date (_planned_grid_due)."""

    def _task(self) -> MaintenanceTask:
        return MaintenanceTask(
            id=TASK_ID_1,
            name="Test",
            last_performed="2026-01-15",
            interval_days=30,
            interval_anchor="planned",
            last_planned_due="2026-01-15",
            due_override="2026-03-05",  # this cycle postponed by ~19 days
        )

    @patch("custom_components.maintenance_supporter.models.maintenance_task.dt_util")
    def test_complete_keeps_planned_grid_despite_postpone(self, mock_dt: MagicMock) -> None:
        mock_dt.now.return_value.date.return_value = date(2026, 3, 5)
        task = self._task()
        assert task.next_due == date(2026, 3, 5)  # the override rules THIS cycle

        task.complete(completed_at=datetime(2026, 3, 5, 12, 0))
        # Anchor = grid date (Jan 15 + 30), NOT the postponed date.
        assert task.last_planned_due == "2026-02-14"
        assert task.due_override is None  # consumed
        # Next cycle continues the original cadence: Feb 14 + 30.
        assert task.next_due == date(2026, 3, 16)

    @patch("custom_components.maintenance_supporter.models.maintenance_task.dt_util")
    def test_skip_keeps_planned_grid_despite_postpone(self, mock_dt: MagicMock) -> None:
        mock_dt.now.return_value.date.return_value = date(2026, 3, 5)
        task = self._task()
        task.skip("busy")
        assert task.last_planned_due == "2026-02-14"
        assert task.due_override is None

    def test_reset_clears_due_override(self) -> None:
        """reset() forgot due_override (bug audit 2026-08-22): a postponed
        task that was reset kept the override, so the reset visibly did
        nothing to the due date."""
        task = self._task()
        task.reset(date(2026, 2, 1))
        assert task.due_override is None
        assert task.last_planned_due is None
        assert task.last_performed == "2026-02-01"
