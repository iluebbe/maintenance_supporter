"""Tests for status computation (OK, DUE_SOON, OVERDUE, TRIGGERED)."""

from __future__ import annotations

from datetime import date, timedelta

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from custom_components.maintenance_supporter.const import (
    DOMAIN,
    MaintenanceStatus,
)
from custom_components.maintenance_supporter.models.maintenance_task import (
    MaintenanceTask,
)

from .conftest import (
    build_task_data,
    setup_integration,
)

# ─── 6.1 Unit Tests for MaintenanceTask.status ──────────────────────────


class TestMaintenanceTaskStatus:
    """Unit tests for MaintenanceTask status computation."""

    def test_ok_status_within_interval(self) -> None:
        """Task performed recently should be OK."""
        last = (dt_util.now().date() - timedelta(days=10)).isoformat()
        task = MaintenanceTask.from_dict(build_task_data(interval_days=30, warning_days=7, last_performed=last))
        assert task.status == MaintenanceStatus.OK

    def test_due_soon_within_warning(self) -> None:
        """Task approaching due date should be DUE_SOON."""
        last = (dt_util.now().date() - timedelta(days=25)).isoformat()
        task = MaintenanceTask.from_dict(build_task_data(interval_days=30, warning_days=7, last_performed=last))
        assert task.status == MaintenanceStatus.DUE_SOON

    def test_overdue_past_interval(self) -> None:
        """Task past its due date should be OVERDUE."""
        last = (dt_util.now().date() - timedelta(days=60)).isoformat()
        task = MaintenanceTask.from_dict(build_task_data(interval_days=30, warning_days=7, last_performed=last))
        assert task.status == MaintenanceStatus.OVERDUE

    def test_triggered_status(self) -> None:
        """Task with active trigger should be TRIGGERED."""
        last = (dt_util.now().date() - timedelta(days=5)).isoformat()
        task = MaintenanceTask.from_dict(build_task_data(interval_days=30, warning_days=7, last_performed=last))
        task._trigger_active = True
        assert task.status == MaintenanceStatus.TRIGGERED

    def test_triggered_overrides_time_based(self) -> None:
        """Trigger status should take precedence over time-based status."""
        last = (dt_util.now().date() - timedelta(days=60)).isoformat()
        task = MaintenanceTask.from_dict(build_task_data(interval_days=30, warning_days=7, last_performed=last))
        # Without trigger: overdue
        status_before: MaintenanceStatus = task.status
        assert status_before == MaintenanceStatus.OVERDUE
        # With trigger: triggered takes precedence
        task._trigger_active = True
        status_after: MaintenanceStatus = task.status
        assert status_after == MaintenanceStatus.TRIGGERED

    def test_all_combinator_trigger_alone_stays_time_ladder(self) -> None:
        """With trigger_combinator=all a fired trigger waits for the interval."""
        last = (dt_util.now().date() - timedelta(days=5)).isoformat()
        data = build_task_data(interval_days=30, warning_days=7, last_performed=last)
        data["trigger_config"] = {"type": "threshold", "entity_id": "sensor.x", "trigger_above": 1, "trigger_combinator": "all"}
        task = MaintenanceTask.from_dict(data)
        task._trigger_active = True
        # 25 days until due -> trigger suppressed, plain time ladder (OK)
        assert task.status == MaintenanceStatus.OK

    def test_all_combinator_interval_alone_never_actions(self) -> None:
        """With all, an elapsed interval without the trigger stays OK."""
        last = (dt_util.now().date() - timedelta(days=60)).isoformat()
        data = build_task_data(interval_days=30, warning_days=7, last_performed=last)
        data["trigger_config"] = {"type": "threshold", "entity_id": "sensor.x", "trigger_above": 1, "trigger_combinator": "all"}
        task = MaintenanceTask.from_dict(data)
        assert task.status == MaintenanceStatus.OK

    def test_all_combinator_both_met_is_triggered(self) -> None:
        """Trigger fired AND interval elapsed -> TRIGGERED."""
        last = (dt_util.now().date() - timedelta(days=60)).isoformat()
        data = build_task_data(interval_days=30, warning_days=7, last_performed=last)
        data["trigger_config"] = {"type": "threshold", "entity_id": "sensor.x", "trigger_above": 1, "trigger_combinator": "all"}
        task = MaintenanceTask.from_dict(data)
        task._trigger_active = True
        assert task.status == MaintenanceStatus.TRIGGERED

    def test_all_combinator_without_schedule_acts_like_any(self) -> None:
        """No interval leg -> the trigger alone governs (no dead task)."""
        data = build_task_data(schedule_type="manual", interval_days=None, last_performed=None)
        data.pop("interval_days", None)
        data["trigger_config"] = {"type": "threshold", "entity_id": "sensor.x", "trigger_above": 1, "trigger_combinator": "all"}
        task = MaintenanceTask.from_dict(data)
        task._trigger_active = True
        assert task.status == MaintenanceStatus.TRIGGERED

    def test_any_combinator_keeps_whichever_first(self) -> None:
        """Default any: the trigger actions immediately, due date untouched."""
        last = (dt_util.now().date() - timedelta(days=5)).isoformat()
        data = build_task_data(interval_days=30, warning_days=7, last_performed=last)
        data["trigger_config"] = {"type": "threshold", "entity_id": "sensor.x", "trigger_above": 1}
        task = MaintenanceTask.from_dict(data)
        task._trigger_active = True
        assert task.status == MaintenanceStatus.TRIGGERED

    def test_never_performed_with_interval(self) -> None:
        """Task never performed schedules from creation date (issue #30 fix).

        Without last_performed, next_due anchors on created_at + interval_days.
        Falls back to today + interval when created_at is also missing (legacy).
        """
        task = MaintenanceTask.from_dict(
            build_task_data(
                interval_days=30,
                warning_days=7,
                last_performed=None,
            )
        )
        # Legacy fallback: anchor=today → next_due = today + 30 days
        assert task.days_until_due == 30
        # 30 days out, warning_days=7 → OK
        assert task.status == MaintenanceStatus.OK

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
        task = MaintenanceTask.from_dict(build_task_data(enabled=False))
        # The model still computes status, but the coordinator skips it
        assert task.enabled is False


class TestScheduleTimeStatus:
    """Sub-day OVERDUE transition: schedule_time makes 'today, past HH:MM'
    behave as overdue instead of waiting until midnight."""

    def test_due_today_before_schedule_time_is_due_soon(self, freezer) -> None:
        """Clock at local 08:30, schedule_time=20:00 → DUE_SOON (not yet past time)."""
        # Freeze to a fixed local-TZ-independent offset: 2026-05-01 15:30 UTC
        # is safely in-hours regardless of HA test TZ.
        freezer.move_to("2026-05-01 15:30:00+00:00")
        now = dt_util.now()
        # schedule_time is 4 hours after the frozen local "now"
        future_time = (now + timedelta(hours=4)).time().strftime("%H:%M")
        last = (now.date() - timedelta(days=30)).isoformat()
        task = MaintenanceTask.from_dict(
            build_task_data(
                interval_days=30,
                warning_days=7,
                last_performed=last,
                schedule_time=future_time,
            )
        )
        assert task.days_until_due == 0
        assert task.status == MaintenanceStatus.DUE_SOON

    def test_due_today_after_schedule_time_is_overdue(self, freezer) -> None:
        """Clock at local midday, schedule_time 4h earlier → OVERDUE."""
        freezer.move_to("2026-05-01 15:30:00+00:00")
        now = dt_util.now()
        past_time = (now - timedelta(hours=4)).time().strftime("%H:%M")
        last = (now.date() - timedelta(days=30)).isoformat()
        task = MaintenanceTask.from_dict(
            build_task_data(
                interval_days=30,
                warning_days=7,
                last_performed=last,
                schedule_time=past_time,
            )
        )
        assert task.days_until_due == 0
        assert task.status == MaintenanceStatus.OVERDUE

    def test_schedule_time_is_none_preserves_midnight_semantic(self) -> None:
        """No schedule_time → status never flips on 'today' regardless of clock."""
        last = (dt_util.now().date() - timedelta(days=30)).isoformat()
        task = MaintenanceTask.from_dict(
            build_task_data(
                interval_days=30,
                warning_days=7,
                last_performed=last,
            )
        )
        assert task.schedule_time is None
        # days == 0 without schedule_time → DUE_SOON (historical behaviour)
        assert task.status == MaintenanceStatus.DUE_SOON

    def test_malformed_schedule_time_falls_back_to_midnight(self) -> None:
        """A garbage schedule_time value must NOT raise — it's silently ignored."""
        last = (dt_util.now().date() - timedelta(days=30)).isoformat()
        task = MaintenanceTask.from_dict(
            build_task_data(
                interval_days=30,
                warning_days=7,
                last_performed=last,
                schedule_time="9a:bc",
            )
        )
        # _is_past_schedule_time() → False, so status stays DUE_SOON (not OVERDUE)
        assert task.status == MaintenanceStatus.DUE_SOON


# ─── 6.2 Days Until Due ─────────────────────────────────────────────────


class TestDaysUntilDue:
    """Test days_until_due computation."""

    def test_positive_days(self) -> None:
        """Test task with days remaining."""
        last = (dt_util.now().date() - timedelta(days=10)).isoformat()
        task = MaintenanceTask.from_dict(build_task_data(interval_days=30, last_performed=last))
        assert task.days_until_due == 20

    def test_negative_days_overdue(self) -> None:
        """Test overdue task has negative days."""
        last = (dt_util.now().date() - timedelta(days=40)).isoformat()
        task = MaintenanceTask.from_dict(build_task_data(interval_days=30, last_performed=last))
        assert task.days_until_due == -10

    def test_due_today(self) -> None:
        """Test task due today."""
        last = (dt_util.now().date() - timedelta(days=30)).isoformat()
        task = MaintenanceTask.from_dict(build_task_data(interval_days=30, last_performed=last))
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
        task = MaintenanceTask.from_dict(build_task_data(interval_days=30, last_performed=last))
        assert task.next_due == date(2024, 7, 1)

    def test_no_last_performed(self) -> None:
        """Test next_due falls back to today + interval when no anchor known."""
        task = MaintenanceTask.from_dict(build_task_data(interval_days=30, last_performed=None))
        from datetime import timedelta

        assert task.next_due == dt_util.now().date() + timedelta(days=30)

    def test_next_due_uses_created_at_when_no_last_performed(self) -> None:
        """created_at is used as anchor when last_performed is None (issue #30)."""
        from datetime import timedelta

        created = (dt_util.now().date() - timedelta(days=10)).isoformat()
        task = MaintenanceTask.from_dict(
            {
                **build_task_data(interval_days=7, last_performed=None),
                "created_at": created,
            }
        )
        # Anchor=created, interval=7 → next_due = created + 7 days (3 days ago)
        from datetime import date as _date

        assert task.next_due == _date.fromisoformat(created) + timedelta(days=7)
        # Should be OVERDUE since next_due is in the past
        assert task.days_until_due == -3
        assert task.status == MaintenanceStatus.OVERDUE

    def test_invalid_created_at_falls_back_to_today(self) -> None:
        """Invalid created_at strings are tolerated and fall back to today."""
        from datetime import timedelta

        task = MaintenanceTask.from_dict(
            {
                **build_task_data(interval_days=7, last_performed=None),
                "created_at": "not-a-date",
            }
        )
        assert task.next_due == dt_util.now().date() + timedelta(days=7)

    def test_last_performed_takes_precedence_over_created_at(self) -> None:
        """When last_performed is set, created_at is ignored."""
        task = MaintenanceTask.from_dict(
            {
                **build_task_data(interval_days=30, last_performed="2024-06-01"),
                "created_at": "2020-01-01",
            }
        )
        assert task.next_due == date(2024, 7, 1)


# ─── 6.4 Integration Status via Coordinator ─────────────────────────────


async def test_sensor_shows_ok_status(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """Test that sensor shows OK when task is not yet due."""
    await setup_integration(hass, global_config_entry, object_config_entry)

    # Task sensors expose a `parent_object` attribute; the global summary
    # sensors (sensor.maintenance_supporter_*) do not — filter to the task one.
    states = hass.states.async_all("sensor")
    task_sensors = [s for s in states if s.attributes.get("parent_object") is not None]
    assert task_sensors, "object task sensor should be present"
    assert task_sensors[0].state in [
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
    entities = er.async_entries_for_config_entry(entity_reg, overdue_config_entry.entry_id)
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
        task = MaintenanceTask.from_dict(build_task_data(history=history))
        assert task.times_performed == 2

    def test_total_cost(self) -> None:
        """Test cost summation."""
        history = [
            {"type": "completed", "timestamp": "2024-01-01T00:00:00", "cost": 25.50},
            {"type": "completed", "timestamp": "2024-02-01T00:00:00", "cost": 30.00},
        ]
        task = MaintenanceTask.from_dict(build_task_data(history=history))
        assert task.total_cost == 55.50

    def test_average_duration(self) -> None:
        """Test average duration calculation."""
        history = [
            {"type": "completed", "timestamp": "2024-01-01T00:00:00", "duration": 30},
            {"type": "completed", "timestamp": "2024-02-01T00:00:00", "duration": 60},
        ]
        task = MaintenanceTask.from_dict(build_task_data(history=history))
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
        task = MaintenanceTask.from_dict(build_task_data(history=history))
        last = task.last_entry
        assert last is not None
        assert last["type"] == "skipped"


# ─── models/maintenance_type.py lines 23, 34 ─────────────────────────────────


def test_maintenance_type_to_dict() -> None:
    """maintenance_type.py line 21-28: to_dict serializes all fields."""
    from custom_components.maintenance_supporter.models.maintenance_type import MaintenanceType

    mt = MaintenanceType(
        id="cleaning",
        name="Cleaning",
        icon="mdi:broom",
        typical_duration=30,
        default_interval_days=30,
    )
    d = mt.to_dict()
    assert d["id"] == "cleaning"
    assert d["name"] == "Cleaning"
    assert d["icon"] == "mdi:broom"
    assert d["typical_duration"] == 30
    assert d["default_interval_days"] == 30


def test_maintenance_type_from_dict() -> None:
    """maintenance_type.py line 31-39: from_dict deserializes."""
    from custom_components.maintenance_supporter.models.maintenance_type import MaintenanceType

    data = {
        "id": "inspection",
        "name": "Inspection",
        "icon": "mdi:magnify",
        "typical_duration": 15,
        "default_interval_days": 180,
    }
    mt = MaintenanceType.from_dict(data)
    assert mt.id == "inspection"
    assert mt.typical_duration == 15
    assert mt.default_interval_days == 180


# ─── models/maintenance_object.py line 64 ────────────────────────────────────


def test_maintenance_object_slug() -> None:
    """maintenance_object.py line 61-64: slug property returns slugified name."""
    from custom_components.maintenance_supporter.models.maintenance_object import MaintenanceObject

    obj = MaintenanceObject(id="abc", name="Pool Pump")
    assert obj.slug == "pool_pump"


def test_maintenance_object_from_dict_all_fields() -> None:
    """maintenance_object.py line 45-59: from_dict with all optional fields."""
    from custom_components.maintenance_supporter.models.maintenance_object import MaintenanceObject

    data = {
        "id": "test_id",
        "name": "Test Object",
        "area_id": "living_room",
        "manufacturer": "ACME",
        "model": "Widget X",
        "serial_number": "SN-001",
        "installation_date": "2023-01-15",
        "documentation_url": "https://example.com/manual.pdf",
        "notes": "Some notes",
        "task_ids": ["task1"],
    }
    obj = MaintenanceObject.from_dict(data)
    assert obj.installation_date == "2023-01-15"
    assert obj.documentation_url == "https://example.com/manual.pdf"
    assert obj.notes == "Some notes"
    assert obj.slug == "test_object"


# ─── F6: dict-twin parity — helpers.status.compute_status_from_task_dict ─────


def _coord_dict(task: MaintenanceTask) -> dict:
    """Build the coordinator-style data dict the dict-twin reads, from a task."""
    return {
        **task.to_dict(),
        "archived_at": task.archived_at,
        "_trigger_active": task._trigger_active,
        "_days_until_due": task.days_until_due,
        "warning_days": task.warning_days,
    }


def test_status_dict_twin_agrees_with_model_on_shared_ladder() -> None:
    """helpers.status.compute_status_from_task_dict must agree with the model's
    MaintenanceTask.status on the shared archived/triggered/overdue/due_soon/ok
    ladder. Uses interval 30 / warning 7 (span >= warning) and no schedule_time,
    so the model-only refinements (#58 span clamp, past-schedule_time) don't
    apply — this pins the SHARED precedence so a new tier can't drift.
    """
    from custom_components.maintenance_supporter.helpers.status import (
        compute_status_from_task_dict,
    )

    def mk(days_ago: int) -> MaintenanceTask:
        last = (dt_util.now().date() - timedelta(days=days_ago)).isoformat()
        return MaintenanceTask.from_dict(build_task_data(interval_days=30, warning_days=7, last_performed=last))

    ok = mk(10)  # ~20 days out → OK
    due_soon = mk(25)  # ~5 days out → DUE_SOON
    overdue = mk(60)  # past → OVERDUE
    triggered = mk(10)
    triggered._trigger_active = True
    archived = mk(10)
    archived.archived_at = dt_util.now().isoformat()

    for task, expected in (
        (ok, MaintenanceStatus.OK),
        (due_soon, MaintenanceStatus.DUE_SOON),
        (overdue, MaintenanceStatus.OVERDUE),
        (triggered, MaintenanceStatus.TRIGGERED),
        (archived, MaintenanceStatus.ARCHIVED),
    ):
        assert task.status == expected  # sanity: model computes the tier
        assert compute_status_from_task_dict(_coord_dict(task)) == expected, f"dict-twin diverged from model for {expected}"


class TestDictTwinCombinator:
    """compute_status_from_task_dict mirrors the model for trigger_combinator."""

    def test_all_combinator_dict_twin(self) -> None:
        from custom_components.maintenance_supporter.helpers.status import (
            compute_status_from_task_dict,
        )

        base = {
            "trigger_config": {"type": "threshold", "trigger_above": 1, "trigger_combinator": "all"},
            "warning_days": 7,
        }
        # Trigger alone, interval not elapsed -> OK
        assert compute_status_from_task_dict({**base, "_trigger_active": True, "_days_until_due": 25}) == MaintenanceStatus.OK
        # Interval alone -> OK
        assert compute_status_from_task_dict({**base, "_trigger_active": False, "_days_until_due": -5}) == MaintenanceStatus.OK
        # Both -> TRIGGERED
        assert compute_status_from_task_dict({**base, "_trigger_active": True, "_days_until_due": -5}) == MaintenanceStatus.TRIGGERED
        # No schedule leg -> trigger alone governs
        assert compute_status_from_task_dict({**base, "_trigger_active": True, "_days_until_due": None}) == MaintenanceStatus.TRIGGERED

    def test_any_combinator_dict_twin_unchanged(self) -> None:
        from custom_components.maintenance_supporter.helpers.status import (
            compute_status_from_task_dict,
        )

        task = {
            "trigger_config": {"type": "threshold", "trigger_above": 1},
            "_trigger_active": True,
            "_days_until_due": 25,
            "warning_days": 7,
        }
        assert compute_status_from_task_dict(task) == MaintenanceStatus.TRIGGERED


class TestDictTwinBoundaries:
    """Mutation-run pins: the dict twin's comparison boundaries (2026-08)."""

    def test_due_today_is_due_soon_not_overdue(self) -> None:
        from custom_components.maintenance_supporter.helpers.status import (
            compute_status_from_task_dict,
        )

        task = {"_days_until_due": 0, "warning_days": 7}
        assert compute_status_from_task_dict(task) == MaintenanceStatus.DUE_SOON

    def test_exactly_at_warning_days_is_due_soon(self) -> None:
        from custom_components.maintenance_supporter.helpers.status import (
            compute_status_from_task_dict,
        )

        assert compute_status_from_task_dict({"_days_until_due": 7, "warning_days": 7}) == MaintenanceStatus.DUE_SOON
        assert compute_status_from_task_dict({"_days_until_due": 8, "warning_days": 7}) == MaintenanceStatus.OK

    def test_all_combinator_due_today_counts_as_time_met(self) -> None:
        """days == 0 IS time-met: a latched trigger actions on the due day."""
        from custom_components.maintenance_supporter.helpers.status import (
            compute_status_from_task_dict,
        )

        task = {
            "trigger_config": {"trigger_combinator": "all"},
            "_trigger_active": True,
            "_days_until_due": 0,
            "warning_days": 7,
        }
        assert compute_status_from_task_dict(task) == MaintenanceStatus.TRIGGERED
        # One day early: not TRIGGERED yet — but the time ladder keeps
        # running, so the imminent due date still reads as a warning.
        task["_days_until_due"] = 1
        assert compute_status_from_task_dict(task) == MaintenanceStatus.DUE_SOON
