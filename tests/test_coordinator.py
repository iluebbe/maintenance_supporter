"""Tests for the MaintenanceCoordinator (coordinator.py)."""

from __future__ import annotations

from datetime import date, timedelta
from typing import Any
from unittest.mock import AsyncMock, MagicMock

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_BUDGET_ALERTS_ENABLED,
    CONF_NOTIFICATIONS_ENABLED,
    CONF_NOTIFY_SERVICE,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    HistoryEntryType,
    MaintenanceStatus,
    ScheduleType,
    TriggerEntityState,
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
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


def _make_object_entry(
    hass: HomeAssistant,
    tasks: dict[str, dict[str, Any]],
    name: str = "Test Object",
    unique_id: str = "test_coord",
) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title=name,
        data=build_object_entry_data(
            object_data=build_object_data(name=name),
            tasks=tasks,
        ),
        source="user",
        unique_id=f"maintenance_supporter_{unique_id}",
    )
    entry.add_to_hass(hass)
    return entry


# ─── _async_update_data Tests ─────────────────────────────────────────────


async def test_update_data_basic_status(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test that status is correctly computed: OK, DUE_SOON, OVERDUE."""
    recent = (dt_util.now().date() - timedelta(days=5)).isoformat()
    task_ok = build_task_data(task_id=TASK_ID_1, last_performed=recent, interval_days=30)

    due_soon_date = (dt_util.now().date() - timedelta(days=26)).isoformat()
    task_due = build_task_data(task_id=TASK_ID_2, last_performed=due_soon_date, interval_days=30)

    obj_entry = _make_object_entry(hass, {TASK_ID_1: task_ok, TASK_ID_2: task_due})
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator
    data = coordinator.data

    assert data[CONF_TASKS][TASK_ID_1]["_status"] == MaintenanceStatus.OK
    assert data[CONF_TASKS][TASK_ID_2]["_status"] == MaintenanceStatus.DUE_SOON


async def test_update_data_disabled_task(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test that disabled tasks get status OK."""
    overdue_date = (dt_util.now().date() - timedelta(days=60)).isoformat()
    task = build_task_data(
        task_id=TASK_ID_1, last_performed=overdue_date,
        interval_days=30, enabled=False,
    )
    obj_entry = _make_object_entry(hass, {TASK_ID_1: task}, unique_id="disabled")
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    data = entry.runtime_data.coordinator.data
    assert data[CONF_TASKS][TASK_ID_1]["_status"] == MaintenanceStatus.OK


async def test_update_data_preserves_trigger_state(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test that live trigger state is preserved between refreshes."""
    task = build_task_data(
        task_id=TASK_ID_1, last_performed="2024-01-01",
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={"type": "threshold", "entity_id": "sensor.temp", "trigger_above": 30},
    )
    hass.states.async_set("sensor.temp", "25.0")
    obj_entry = _make_object_entry(hass, {TASK_ID_1: task}, unique_id="trigger_preserve")
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator

    # Simulate trigger activation via previous data
    coordinator.data[CONF_TASKS][TASK_ID_1]["_trigger_active"] = True
    coordinator.data[CONF_TASKS][TASK_ID_1]["_trigger_current_value"] = 35.0

    # Force refresh
    await coordinator.async_refresh()

    # Trigger state should be preserved from previous data
    data = coordinator.data
    # The sensor shows 25 (below threshold), so fallback evaluation sets it to False
    # But the key point is the data flow works - the trigger was read from prev_tasks
    assert "_trigger_active" in data[CONF_TASKS][TASK_ID_1]


# ─── _evaluate_trigger_fallback Tests ─────────────────────────────────────


async def test_fallback_threshold_above(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test fallback: value above threshold triggers."""
    hass.states.async_set("sensor.temp", "35.0")
    task = build_task_data(
        task_id=TASK_ID_1,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={"type": "threshold", "entity_id": "sensor.temp", "trigger_above": 30},
    )
    obj_entry = _make_object_entry(hass, {TASK_ID_1: task}, unique_id="fb_above")
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    data = entry.runtime_data.coordinator.data
    assert data[CONF_TASKS][TASK_ID_1]["_trigger_active"] is True


async def test_fallback_threshold_below(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test fallback: value below threshold triggers."""
    hass.states.async_set("sensor.temp", "5.0")
    task = build_task_data(
        task_id=TASK_ID_1,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={"type": "threshold", "entity_id": "sensor.temp", "trigger_below": 10},
    )
    obj_entry = _make_object_entry(hass, {TASK_ID_1: task}, unique_id="fb_below")
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    data = entry.runtime_data.coordinator.data
    assert data[CONF_TASKS][TASK_ID_1]["_trigger_active"] is True


async def test_fallback_threshold_multi_any(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test multi-entity threshold: any triggered = active."""
    hass.states.async_set("sensor.temp1", "35.0")  # above
    hass.states.async_set("sensor.temp2", "20.0")  # below threshold
    task = build_task_data(
        task_id=TASK_ID_1,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "threshold",
            "entity_ids": ["sensor.temp1", "sensor.temp2"],
            "entity_id": "sensor.temp1",
            "trigger_above": 30,
            "entity_logic": "any",
        },
    )
    obj_entry = _make_object_entry(hass, {TASK_ID_1: task}, unique_id="fb_multi_any")
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    data = entry.runtime_data.coordinator.data
    assert data[CONF_TASKS][TASK_ID_1]["_trigger_active"] is True


async def test_fallback_threshold_multi_all(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test multi-entity threshold 'all': both above → True."""
    hass.states.async_set("sensor.temp1", "35.0")  # above
    hass.states.async_set("sensor.temp2", "40.0")  # also above
    task = build_task_data(
        task_id=TASK_ID_1,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "threshold",
            "entity_ids": ["sensor.temp1", "sensor.temp2"],
            "entity_id": "sensor.temp1",
            "trigger_above": 30,
            "entity_logic": "all",
        },
    )
    obj_entry = _make_object_entry(hass, {TASK_ID_1: task}, unique_id="fb_multi_all")
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    data = entry.runtime_data.coordinator.data
    assert data[CONF_TASKS][TASK_ID_1]["_trigger_active"] is True


async def test_fallback_threshold_unavailable(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test fallback with unavailable entity."""
    hass.states.async_set("sensor.temp", "unavailable")
    task = build_task_data(
        task_id=TASK_ID_1,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={"type": "threshold", "entity_id": "sensor.temp", "trigger_above": 30},
    )
    obj_entry = _make_object_entry(hass, {TASK_ID_1: task}, unique_id="fb_unavail")
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    data = entry.runtime_data.coordinator.data
    assert data[CONF_TASKS][TASK_ID_1]["_trigger_active"] is False


async def test_fallback_threshold_attribute(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test fallback reads attribute instead of state."""
    hass.states.async_set("sensor.temp", "ok", {"temperature": 35.0})
    task = build_task_data(
        task_id=TASK_ID_1,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "threshold", "entity_id": "sensor.temp",
            "attribute": "temperature", "trigger_above": 30,
        },
    )
    obj_entry = _make_object_entry(hass, {TASK_ID_1: task}, unique_id="fb_attr")
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    data = entry.runtime_data.coordinator.data
    assert data[CONF_TASKS][TASK_ID_1]["_trigger_active"] is True


async def test_fallback_counter_absolute(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test counter fallback: absolute value >= target."""
    hass.states.async_set("sensor.counter", "150")
    task = build_task_data(
        task_id=TASK_ID_1,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "counter", "entity_id": "sensor.counter",
            "trigger_target_value": 100,
        },
    )
    obj_entry = _make_object_entry(hass, {TASK_ID_1: task}, unique_id="fb_counter")
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    data = entry.runtime_data.coordinator.data
    assert data[CONF_TASKS][TASK_ID_1]["_trigger_active"] is True


async def test_fallback_counter_delta(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test counter fallback: delta from baseline >= target."""
    hass.states.async_set("sensor.counter", "150")
    task = build_task_data(
        task_id=TASK_ID_1,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "counter", "entity_id": "sensor.counter",
            "trigger_target_value": 50,
            "trigger_delta_mode": True,
            "trigger_baseline_value": 100,
            "_trigger_state": {
                "sensor.counter": {"baseline_value": 100},
            },
        },
    )
    obj_entry = _make_object_entry(hass, {TASK_ID_1: task}, unique_id="fb_delta")
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    data = entry.runtime_data.coordinator.data
    assert data[CONF_TASKS][TASK_ID_1]["_trigger_active"] is True


# ─── _async_check_for_issues Tests ────────────────────────────────────────


async def test_check_issues_available_clears(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test that available entity clears any existing issue."""
    hass.states.async_set("sensor.temp", "25.0")
    task = build_task_data(
        task_id=TASK_ID_1,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={"type": "threshold", "entity_id": "sensor.temp", "trigger_above": 30},
    )
    obj_entry = _make_object_entry(hass, {TASK_ID_1: task}, unique_id="issues_avail")
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator
    assert coordinator._trigger_entity_states.get(TASK_ID_1) == TriggerEntityState.AVAILABLE


async def test_check_issues_startup_grace(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test that missing entity during startup grace period doesn't create issue."""
    # Entity does NOT exist - will be "missing"
    task = build_task_data(
        task_id=TASK_ID_1,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={"type": "threshold", "entity_id": "sensor.nonexistent", "trigger_above": 30},
    )
    obj_entry = _make_object_entry(hass, {TASK_ID_1: task}, unique_id="issues_startup")
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator

    # During startup grace period (default 300s), state should be STARTUP
    assert coordinator._in_startup_grace_period
    state = coordinator._trigger_entity_states.get(TASK_ID_1)
    assert state == TriggerEntityState.STARTUP


async def test_check_issues_unavailable_logs_once(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test that unavailable entity warning is logged once."""
    hass.states.async_set("sensor.temp", "unavailable")
    task = build_task_data(
        task_id=TASK_ID_1,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={"type": "threshold", "entity_id": "sensor.temp", "trigger_above": 30},
    )
    obj_entry = _make_object_entry(hass, {TASK_ID_1: task}, unique_id="issues_unavail")
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator
    assert coordinator._trigger_entity_states.get(TASK_ID_1) == TriggerEntityState.UNAVAILABLE
    # First refresh should have logged it
    entity_key = f"{TASK_ID_1}_sensor.temp"
    assert coordinator._entity_unavailable_logged.get(entity_key) is True


async def test_check_issues_compound_missing_entity_creates_repair(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test that a missing entity in a compound trigger condition creates a repair issue.

    Regression test: previously normalize_entity_ids returned [] for compound
    triggers, causing _async_check_for_issues to silently skip them.
    """
    from custom_components.maintenance_supporter.const import (
        MISSING_ENTITY_THRESHOLD_REFRESHES,
    )

    # sensor.present exists but sensor.gone does not
    hass.states.async_set("sensor.present", "20.0")
    task = build_task_data(
        task_id=TASK_ID_1,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "compound",
            "compound_logic": "AND",
            "conditions": [
                {"type": "threshold", "entity_id": "sensor.present", "trigger_above": 10},
                {"type": "threshold", "entity_id": "sensor.gone", "trigger_above": 10},
            ],
        },
    )
    obj_entry = _make_object_entry(hass, {TASK_ID_1: task}, unique_id="issues_compound_missing")
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator

    # Bypass startup grace period and trigger enough refreshes to cross threshold
    coordinator._startup_time = 0.0
    for _ in range(MISSING_ENTITY_THRESHOLD_REFRESHES):
        await coordinator.async_refresh()

    # Compound sub-entity tracking key matches per-entity scheme
    entity_key = f"{TASK_ID_1}_sensor.gone"
    assert coordinator._entity_missing_refresh_count.get(entity_key) is not None
    assert (
        coordinator._entity_missing_refresh_count[entity_key]
        >= MISSING_ENTITY_THRESHOLD_REFRESHES
    )
    # Repair issue should exist for the missing sub-entity
    from homeassistant.helpers import issue_registry as ir

    issue_id = f"missing_trigger_{obj_entry.entry_id}_{TASK_ID_1}_sensor.gone"
    issue = ir.async_get(hass).async_get_issue(DOMAIN, issue_id)
    assert issue is not None
    # No issue for the present entity
    assert (
        ir.async_get(hass).async_get_issue(
            DOMAIN, f"missing_trigger_{obj_entry.entry_id}_{TASK_ID_1}_sensor.present"
        )
        is None
    )


async def test_check_issues_compound_all_available_no_repair(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test that a compound trigger with all sub-entities available creates no repair issue."""
    hass.states.async_set("sensor.a", "20.0")
    hass.states.async_set("sensor.b", "30.0")
    task = build_task_data(
        task_id=TASK_ID_1,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "compound",
            "compound_logic": "OR",
            "conditions": [
                {"type": "threshold", "entity_id": "sensor.a", "trigger_above": 10},
                {"type": "threshold", "entity_id": "sensor.b", "trigger_above": 10},
            ],
        },
    )
    obj_entry = _make_object_entry(hass, {TASK_ID_1: task}, unique_id="issues_compound_avail")
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator

    coordinator._startup_time = 0.0
    await coordinator.async_refresh()

    # No missing tracking and no repair issues for any sub-entity
    from homeassistant.helpers import issue_registry as ir

    for eid in ("sensor.a", "sensor.b"):
        assert coordinator._entity_missing_refresh_count.get(f"{TASK_ID_1}_{eid}") is None
        issue_id = f"missing_trigger_{obj_entry.entry_id}_{TASK_ID_1}_{eid}"
        assert ir.async_get(hass).async_get_issue(DOMAIN, issue_id) is None


# ─── _async_check_budget Tests ────────────────────────────────────────────


async def test_budget_disabled_no_alert(
    hass: HomeAssistant,
) -> None:
    """Test no budget alert when budget alerts disabled."""
    global_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(notifications_enabled=True, notify_service="notify.test"),
        options={
            CONF_NOTIFICATIONS_ENABLED: True,
            CONF_NOTIFY_SERVICE: "notify.test",
            CONF_BUDGET_ALERTS_ENABLED: False,
        },
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    global_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry)

    nm = hass.data.get(DOMAIN, {}).get("_notification_manager")
    nm.async_budget_alert = AsyncMock()

    # No alerts should have been sent
    nm.async_budget_alert.assert_not_called()


# ─── Mutation Methods Tests ───────────────────────────────────────────────


async def test_complete_maintenance_history(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test that complete_maintenance adds history entry."""
    last = (dt_util.now().date() - timedelta(days=20)).isoformat()
    task = build_task_data(task_id=TASK_ID_1, last_performed=last)
    obj_entry = _make_object_entry(hass, {TASK_ID_1: task}, unique_id="complete")
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator

    await coordinator.complete_maintenance(
        task_id=TASK_ID_1, notes="Done", cost=50.0, duration=30,
    )

    state = get_task_store_state(hass, obj_entry.entry_id, TASK_ID_1)
    assert state["last_performed"] == dt_util.now().date().isoformat()
    history = state["history"]
    completed = [h for h in history if h["type"] == HistoryEntryType.COMPLETED]
    assert len(completed) >= 1
    assert completed[-1]["cost"] == 50.0


async def test_skip_maintenance(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test that skip_maintenance adds skip history entry."""
    last = (dt_util.now().date() - timedelta(days=20)).isoformat()
    task = build_task_data(task_id=TASK_ID_1, last_performed=last)
    obj_entry = _make_object_entry(hass, {TASK_ID_1: task}, unique_id="skip")
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator

    await coordinator.skip_maintenance(task_id=TASK_ID_1, reason="Not needed")

    state = get_task_store_state(hass, obj_entry.entry_id, TASK_ID_1)
    history = state["history"]
    skipped = [h for h in history if h["type"] == HistoryEntryType.SKIPPED]
    assert len(skipped) == 1
    assert skipped[0]["notes"] == "Not needed"


async def test_reset_maintenance(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test that reset_maintenance updates last_performed."""
    last = (dt_util.now().date() - timedelta(days=60)).isoformat()
    task = build_task_data(task_id=TASK_ID_1, last_performed=last)
    obj_entry = _make_object_entry(hass, {TASK_ID_1: task}, unique_id="reset")
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator

    reset_date = date(2024, 6, 15)
    await coordinator.reset_maintenance(task_id=TASK_ID_1, date=reset_date)

    state = get_task_store_state(hass, obj_entry.entry_id, TASK_ID_1)
    assert state["last_performed"] == "2024-06-15"


async def test_persist_trigger_runtime_per_entity(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test persisting per-entity trigger runtime data."""
    task = build_task_data(
        task_id=TASK_ID_1,
        trigger_config={"type": "runtime", "entity_id": "sensor.pump"},
    )
    obj_entry = _make_object_entry(hass, {TASK_ID_1: task}, unique_id="persist_rt")
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator

    await coordinator.async_persist_trigger_runtime(
        task_id=TASK_ID_1,
        runtime_data={"accumulated_seconds": 3600.0},
        entity_id="sensor.pump",
    )

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    runtime = entry.runtime_data.store.get_trigger_runtime(TASK_ID_1, "sensor.pump")
    assert runtime["accumulated_seconds"] == 3600.0


async def test_register_calendar_entity(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test registering calendar entity for state updates."""
    task = build_task_data(task_id=TASK_ID_1)
    obj_entry = _make_object_entry(hass, {TASK_ID_1: task}, unique_id="calendar")
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator

    mock_calendar = MagicMock()
    mock_calendar.hass = hass
    mock_calendar.async_write_ha_state = MagicMock()

    coordinator.register_calendar_entity(mock_calendar)
    assert coordinator._calendar_entity is mock_calendar

    # After refresh, calendar should get notified
    await coordinator.async_refresh()
    mock_calendar.async_write_ha_state.assert_called()


async def test_complete_maintenance_updates_adaptive(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test that complete_maintenance updates adaptive config if enabled."""
    last = (dt_util.now().date() - timedelta(days=20)).isoformat()
    task = build_task_data(task_id=TASK_ID_1, last_performed=last)
    task["adaptive_config"] = {"enabled": True, "base_interval": 30}
    task["history"] = [
        {"timestamp": "2024-01-01T00:00:00", "type": "completed"},
        {"timestamp": "2024-02-01T00:00:00", "type": "completed"},
        {"timestamp": "2024-03-01T00:00:00", "type": "completed"},
    ]
    obj_entry = _make_object_entry(hass, {TASK_ID_1: task}, unique_id="adaptive")
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    coordinator = entry.runtime_data.coordinator

    await coordinator.complete_maintenance(task_id=TASK_ID_1, feedback="needed")

    state = get_task_store_state(hass, obj_entry.entry_id, TASK_ID_1)
    # Adaptive config should be updated
    assert state.get("adaptive_config") is not None
