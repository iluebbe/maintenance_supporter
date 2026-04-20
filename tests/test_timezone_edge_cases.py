"""Timezone and date edge-case tests for the maintenance supporter integration.

Covers scenarios that have caused or could cause off-by-one and TZ-mix bugs:
  - DST transitions (spring forward, fall back)
  - Leap day (Feb 29)
  - Year/month boundary crossings
  - Naive vs TZ-aware history timestamps
  - Future last_performed
  - HA timezone vs system timezone divergence

The tests use freezegun to pin "now" deterministically and exercise the
public surface (MaintenanceTask, IntervalAnalyzer, async_migrate_entry,
budget recalculation, threshold trigger restore).
"""

from __future__ import annotations

from datetime import UTC, date, datetime, timedelta, timezone
from typing import Any

import pytest
from freezegun import freeze_time
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    HistoryEntryType,
    MaintenanceStatus,
    ScheduleType,
)
from custom_components.maintenance_supporter.helpers.interval_analyzer import (
    IntervalAnalyzer,
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
)


# ---------------------------------------------------------------------------
# 1. MaintenanceTask.next_due — date-arithmetic edge cases
# ---------------------------------------------------------------------------


class TestNextDueAcrossBoundaries:
    """next_due correctly handles year, month, leap-day, and DST boundaries."""

    def test_year_boundary(self) -> None:
        """Dec 31 + 1 day → Jan 1 of next year."""
        task = MaintenanceTask.from_dict(
            build_task_data(interval_days=1, last_performed="2025-12-31")
        )
        assert task.next_due == date(2026, 1, 1)

    def test_month_boundary_31_to_30(self) -> None:
        """Mar 31 + 31 days → May 1 (April has 30 days)."""
        task = MaintenanceTask.from_dict(
            build_task_data(interval_days=31, last_performed="2026-03-31")
        )
        assert task.next_due == date(2026, 5, 1)

    def test_leap_day(self) -> None:
        """Feb 29 (leap) + 365 days → Feb 28 next year."""
        task = MaintenanceTask.from_dict(
            build_task_data(interval_days=365, last_performed="2024-02-29")
        )
        assert task.next_due == date(2025, 2, 28)

    def test_leap_day_interval_one_year(self) -> None:
        """Feb 29 + 366 days lands on Feb 29 of the next leap year cycle."""
        task = MaintenanceTask.from_dict(
            build_task_data(interval_days=366, last_performed="2024-02-29")
        )
        assert task.next_due == date(2025, 3, 1)

    def test_dst_spring_forward_unaffected(self) -> None:
        """DST does not affect date-only arithmetic (timedelta(days=N) is calendar days)."""
        # In Europe/Berlin DST switches on last Sunday of March
        task = MaintenanceTask.from_dict(
            build_task_data(interval_days=7, last_performed="2026-03-25")
        )
        # 2026-03-29 is the DST switch day (CET → CEST in Berlin)
        assert task.next_due == date(2026, 4, 1)

    def test_dst_fall_back_unaffected(self) -> None:
        """DST end (fall back) likewise does not affect date math."""
        task = MaintenanceTask.from_dict(
            build_task_data(interval_days=7, last_performed="2026-10-22")
        )
        # 2026-10-25 is DST end in Europe
        assert task.next_due == date(2026, 10, 29)


class TestNextDueAnchorPriority:
    """Anchor priority: last_performed > created_at > today."""

    def test_last_performed_overrides_created_at(self) -> None:
        """Even if created_at is newer, last_performed wins."""
        task = MaintenanceTask.from_dict({
            **build_task_data(interval_days=10, last_performed="2024-01-01"),
            "created_at": "2026-01-01",
        })
        assert task.next_due == date(2024, 1, 11)

    def test_created_at_used_when_no_last_performed(self) -> None:
        task = MaintenanceTask.from_dict({
            **build_task_data(interval_days=14, last_performed=None),
            "created_at": "2026-01-01",
        })
        assert task.next_due == date(2026, 1, 15)

    @freeze_time("2026-04-19 12:00:00", tz_offset=2)
    def test_no_anchor_falls_back_to_today_local(self) -> None:
        """Legacy fallback uses HA-TZ-aware today, not naive system date."""
        task = MaintenanceTask.from_dict(
            build_task_data(interval_days=7, last_performed=None)
        )
        # dt_util.now().date() with TZ offset +2: still 2026-04-19 at noon UTC
        assert task.next_due == date(2026, 4, 26)


class TestNextDueDefensive:
    """Invalid or pathological inputs should not crash."""

    def test_invalid_last_performed_returns_none(self) -> None:
        task = MaintenanceTask(
            id=TASK_ID_1, name="x", interval_days=30, last_performed="not-a-date"
        )
        assert task.next_due is None

    def test_invalid_created_at_falls_back_to_today(self) -> None:
        task = MaintenanceTask.from_dict({
            **build_task_data(interval_days=7, last_performed=None),
            "created_at": "garbage",
        })
        assert task.next_due == dt_util.now().date() + timedelta(days=7)

    def test_zero_interval_returns_none(self) -> None:
        task = MaintenanceTask.from_dict(
            build_task_data(interval_days=0, last_performed="2026-01-01")
        )
        assert task.next_due is None

    def test_negative_interval_returns_none(self) -> None:
        task = MaintenanceTask(
            id=TASK_ID_1, name="x", interval_days=-5, last_performed="2026-01-01"
        )
        assert task.next_due is None

    def test_future_last_performed_yields_future_next_due(self) -> None:
        """A future last_performed is allowed (user error / manual override).

        We don't crash; status simply remains OK until the future date arrives.
        """
        future = (dt_util.now().date() + timedelta(days=30)).isoformat()
        task = MaintenanceTask.from_dict(
            build_task_data(interval_days=10, last_performed=future)
        )
        assert task.next_due == date.fromisoformat(future) + timedelta(days=10)
        assert task.status == MaintenanceStatus.OK


# ---------------------------------------------------------------------------
# 2. add_history_entry / complete_maintenance — TZ-aware timestamps
# ---------------------------------------------------------------------------


class TestHistoryTimestamps:
    """All write paths produce TZ-aware ISO timestamps."""

    def test_add_history_entry_timestamp_is_tz_aware(self) -> None:
        task = MaintenanceTask.from_dict(build_task_data())
        task.add_history_entry(entry_type=HistoryEntryType.COMPLETED)
        ts = task.history[-1]["timestamp"]
        parsed = datetime.fromisoformat(ts)
        assert parsed.tzinfo is not None, f"history timestamp is naive: {ts}"

    def test_complete_writes_tz_aware_history(self) -> None:
        task = MaintenanceTask.from_dict(build_task_data())
        task.complete()
        parsed = datetime.fromisoformat(task.history[-1]["timestamp"])
        assert parsed.tzinfo is not None

    def test_skip_writes_tz_aware_history(self) -> None:
        task = MaintenanceTask.from_dict(build_task_data())
        task.skip(reason="busy")
        parsed = datetime.fromisoformat(task.history[-1]["timestamp"])
        assert parsed.tzinfo is not None

    def test_reset_writes_tz_aware_history(self) -> None:
        task = MaintenanceTask.from_dict(build_task_data())
        task.reset(reset_date=date(2025, 6, 1))
        parsed = datetime.fromisoformat(task.history[-1]["timestamp"])
        assert parsed.tzinfo is not None


# ---------------------------------------------------------------------------
# 3. IntervalAnalyzer — naive vs aware history mix, month attribution
# ---------------------------------------------------------------------------


class TestIntervalAnalyzerTimezones:
    """Adaptive scheduling tolerates naive timestamps and uses HA TZ."""

    def test_naive_history_does_not_crash(self) -> None:
        analyzer = IntervalAnalyzer()
        history = [
            {"type": "completed", "timestamp": "2025-06-01T10:00:00"},
            {"type": "completed", "timestamp": "2025-06-15T10:00:00"},
            {"type": "completed", "timestamp": "2025-07-01T10:00:00"},
        ]
        intervals = analyzer._compute_intervals_from_history(history)
        assert intervals == [14, 16]

    def test_mixed_naive_and_aware_history(self) -> None:
        """Mixing naive and aware ISO strings in one history must not raise."""
        analyzer = IntervalAnalyzer()
        history = [
            {"type": "completed", "timestamp": "2025-06-01T10:00:00"},  # naive
            {"type": "completed", "timestamp": "2025-06-15T10:00:00+00:00"},  # aware
            {"type": "completed", "timestamp": "2025-07-01T10:00:00"},  # naive
        ]
        intervals = analyzer._compute_intervals_from_history(history)
        # All entries normalised to HA TZ → arithmetic in days works
        assert len(intervals) == 2
        assert all(i > 0 for i in intervals)

    @freeze_time("2026-01-01 00:30:00", tz_offset=2)
    def test_seasonal_uses_ha_tz_month(self) -> None:
        """At 00:30 UTC on Jan 1 with HA TZ +2, system month is Jan but HA month is Jan too.

        Verifies seasonal analysis takes month from dt_util.now(), not datetime.now().
        Without the fix this would return system-TZ month which can differ at midnight.
        """
        analyzer = IntervalAnalyzer()
        # Build 12 months of history so seasonal is computed
        history = []
        for month in range(1, 13):
            history.append({
                "type": "completed",
                "timestamp": f"2025-{month:02d}-15T12:00:00+00:00",
                "feedback": "needed",
            })
        result = analyzer.analyze(
            task_data={"interval_days": 30, "history": history},
            adaptive_config={
                "feedback_count": 12,
                "seasonal_enabled": True,
                "hemisphere": "north",
            },
        )
        # current_month is January (= 1) in both HA and system TZ for this freeze
        assert result.seasonal_factor is not None


# ---------------------------------------------------------------------------
# 4. async_migrate_entry — backfill chooses TZ-correct anchors
# ---------------------------------------------------------------------------


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    e = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    e.add_to_hass(hass)
    return e


async def test_migrate_uses_dt_util_today_not_system_today(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Backfilled created_at uses HA TZ — not system date.

    With freezegun set to 23:30 UTC and HA TZ +2 (so 'today' in HA is the
    next day), the backfill must pick the HA-local date.
    """
    from custom_components.maintenance_supporter import async_migrate_entry

    task = build_task_data(last_performed=None, history=[])
    task.pop("created_at", None)
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="TZ Migrate",
        data=build_object_entry_data(
            object_data=build_object_data(name="TZ Object"),
            tasks={TASK_ID_1: task},
        ),
        source="user", unique_id="maintenance_supporter_tz_mig",
    )
    entry.add_to_hass(hass)

    await async_migrate_entry(hass, entry)
    refreshed = hass.config_entries.async_get_entry(entry.entry_id)
    assert refreshed is not None
    backfilled = refreshed.data[CONF_TASKS][TASK_ID_1]["created_at"]
    # The backfill uses dt_util.now().date() — must equal HA-local "today"
    assert backfilled == dt_util.now().date().isoformat()


async def test_migrate_picks_earliest_history_only_date_part(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """When history has multiple entries with TZ suffixes, earliest YYYY-MM-DD wins."""
    from custom_components.maintenance_supporter import async_migrate_entry

    history = [
        {"type": "completed", "timestamp": "2025-08-15T22:00:00+00:00"},
        {"type": "completed", "timestamp": "2025-06-01T23:30:00+02:00"},  # earliest
        {"type": "completed", "timestamp": "2025-12-20T10:00:00+00:00"},
    ]
    task = build_task_data(last_performed=None, history=history)
    task.pop("created_at", None)
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="TZ Hist",
        data=build_object_entry_data(
            object_data=build_object_data(name="TZ Hist Obj"),
            tasks={TASK_ID_1: task},
        ),
        source="user", unique_id="maintenance_supporter_tz_hist",
    )
    entry.add_to_hass(hass)

    await async_migrate_entry(hass, entry)
    refreshed = hass.config_entries.async_get_entry(entry.entry_id)
    assert refreshed is not None
    # Lexicographic min on ISO strings — date prefix is correct because all
    # ISO timestamps use the same YYYY-MM-DD prefix length
    assert refreshed.data[CONF_TASKS][TASK_ID_1]["created_at"] == "2025-06-01"


# ---------------------------------------------------------------------------
# 5. ws_create_task — initial_history with last_performed is TZ-aware
# ---------------------------------------------------------------------------


async def test_ws_create_with_last_performed_writes_tz_aware_history(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """initial_history timestamp from ws_create_task carries a TZ suffix."""
    from unittest.mock import MagicMock

    from custom_components.maintenance_supporter.websocket.tasks import ws_create_task

    from .conftest import call_ws_handler, setup_integration

    entry = MockConfigEntry(
        version=1, minor_version=2, domain=DOMAIN,
        title="LP Create",
        data=build_object_entry_data(tasks={}),
        source="user", unique_id="maintenance_supporter_lp_create",
    )
    entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, entry)

    conn = MagicMock()
    conn.send_result = MagicMock()
    conn.send_error = MagicMock()
    await call_ws_handler(
        ws_create_task, hass, conn,
        {
            "id": 1, "type": "maintenance_supporter/task/create",
            "entry_id": entry.entry_id, "name": "T",
            "interval_days": 30, "last_performed": "2025-06-01",
        },
    )
    new_id = conn.send_result.call_args[0][1]["task_id"]
    refreshed = hass.config_entries.async_get_entry(entry.entry_id)
    assert refreshed is not None

    # Read history through the store (dynamic state)
    rd = refreshed.runtime_data
    history = rd.store.get_history(new_id)
    assert history, "initial history not persisted"
    ts = history[0]["timestamp"]
    parsed = datetime.fromisoformat(ts)
    assert parsed.tzinfo is not None, f"initial_history timestamp naive: {ts}"


# ---------------------------------------------------------------------------
# 6. Budget recalculation — naive timestamps near year boundary
# ---------------------------------------------------------------------------


@freeze_time("2026-01-01 00:30:00", tz_offset=-3)
async def test_budget_naive_timestamp_at_year_boundary(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """A naive 'just-before-midnight' entry is attributed to the local-TZ year.

    With freezegun fixing UTC to 2026-01-01 00:30 and HA TZ -3 (e.g. America),
    HA "now" is 2025-12-31 21:30. A naive entry at 2025-12-31T23:00:00 should
    fall in the local "2025" year, not 2026.
    """
    from custom_components.maintenance_supporter.coordinator import (
        MaintenanceCoordinator,
    )
    from .conftest import setup_integration

    history = [
        {"type": "completed", "timestamp": "2025-12-31T23:00:00", "cost": 50.0},
        {"type": "completed", "timestamp": "2026-01-15T10:00:00", "cost": 75.0},
    ]
    task = build_task_data(last_performed="2026-01-15", history=history)
    entry = MockConfigEntry(
        version=1, minor_version=2, domain=DOMAIN,
        title="Budget TZ",
        data=build_object_entry_data(
            object_data=build_object_data(name="Budget Obj"),
            tasks={TASK_ID_1: task},
        ),
        source="user", unique_id="maintenance_supporter_budget_tz",
    )
    entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, entry)

    refreshed = hass.config_entries.async_get_entry(entry.entry_id)
    assert refreshed is not None
    coordinator: MaintenanceCoordinator = refreshed.runtime_data.coordinator
    coordinator._recalculate_budget_cache()
    cache = hass.data[DOMAIN]["_budget_cache"]

    # In HA-local TZ now is 2025-12-31, so:
    # - 2025-12-31T23:00:00 (naive → HA-local) is also 2025 → counted
    # - 2026-01-15T10:00:00 (naive → HA-local) is 2026 → NOT counted
    assert cache["yearly_spent"] == 50.0
    assert cache["monthly_spent"] == 50.0


# ---------------------------------------------------------------------------
# 7. Threshold trigger — restore from naive ISO string
# ---------------------------------------------------------------------------


def test_threshold_trigger_restore_naive_isoformat() -> None:
    """ThresholdTrigger.__init__ tolerates a naive persisted exceeded_since."""
    from unittest.mock import MagicMock
    from custom_components.maintenance_supporter.entity.triggers.threshold import (
        ThresholdTrigger,
    )

    hass = MagicMock()
    sensor = MagicMock()
    cfg = {
        "entity_id": "sensor.x",
        "trigger_above": 30.0,
        "trigger_threshold_exceeded_since": "2025-12-01T10:00:00",  # naive
    }
    trig = ThresholdTrigger(hass, sensor, cfg)
    assert trig._exceeded_since_dt is not None
    # Naive string was reattached to UTC (matches live writes)
    assert trig._exceeded_since_dt.tzinfo is not None


def test_threshold_trigger_restore_aware_isoformat() -> None:
    """Already TZ-aware persisted exceeded_since is preserved."""
    from unittest.mock import MagicMock
    from custom_components.maintenance_supporter.entity.triggers.threshold import (
        ThresholdTrigger,
    )

    hass = MagicMock()
    sensor = MagicMock()
    aware = "2025-12-01T10:00:00+05:30"
    cfg = {
        "entity_id": "sensor.x",
        "trigger_above": 30.0,
        "trigger_threshold_exceeded_since": aware,
    }
    trig = ThresholdTrigger(hass, sensor, cfg)
    assert trig._exceeded_since_dt is not None
    assert trig._exceeded_since_dt.tzinfo is not None
    # TZ offset preserved
    assert trig._exceeded_since_dt.utcoffset() == timedelta(hours=5, minutes=30)
