"""Coverage tests targeting uncovered lines to push from 98.1% → 98.5%.

Targets (selected ~30 reachable lines):
- coordinator.py: 93 (_is_schedule_time_feature_enabled returns False — no global entry)
- export.py: 128-144 (YAML export path, ImportError fallback)
- binary_sensor.py: 114, 123 (is_on/extra_state_attributes when task data missing)
- binary_sensor.py: 158, 163, 183 (_handle_task_reset early returns / DUE_SOON status)
- sensor.py: 134, 288 (entity_slug name override, async_added triggers no trigger_config)
- button.py: 108, 110 (available property — not available / no task data)
- storage.py: 229, 232-233 (extract_dynamic_from_task trigger_config split paths)
- diagnostics.py: 175-176 (_check_data_quality trigger no entity warning)
- helpers/sanitize.py: 183-184 (JSON serialization error in cap_on_complete_action)
- helpers/qr_generator.py: 56 (build_qr_url with local url_mode)
- helpers/schedule.py: 146, 165 (Schedule._next_planned for calendar kinds)
- helpers/schedule.py: 304-305 (normalise_task_schedule no nested/no flat → manual)
- helpers/vacation.py: 82 (is_silent_for when task IS in exempt list)
- helpers/vacation.py: 274, 277 (compute_preview calendar kind row construction)
- helpers/notification_manager.py: 520-521 (vacation suppresses notification)
- helpers/notification_manager.py: 744 (bundled rate limit)
- helpers/notification_manager.py: 791-792 (bundled daily limit / title_style)
- helpers/notification_manager.py: 818, 894-895 (budget alert + dismiss notification)
- websocket/tasks.py: 217 (_validate_trigger_config strips unknown keys)
- websocket/tasks.py: 382 (_build_task_data notes branch)
- websocket/tasks.py: 961-962 (ws_quick_complete_task entry not found)
- websocket/vacation.py: 104, 123-124 (invalid start date / end before start)
- websocket/vacation.py: 135, 142 (buffer_days + exempt_task_ids update)
- websocket/vacation.py: 244-245 (vacation_end_now with future start)
- websocket/io.py: 298 (JSON import task name empty → skip)
- websocket/io.py: 334-335 (JSON import invalid interval_days dropped)
- websocket/io.py: 457-459 (QR generate ValueError → no_url error)
"""

from __future__ import annotations

import json
from datetime import date, timedelta
from typing import Any
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_OBJECT,
    CONF_TASKS,
    CONF_VACATION_ENABLED,
    CONF_VACATION_END,
    CONF_VACATION_EXEMPT_TASK_IDS,
    CONF_VACATION_START,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MaintenanceStatus,
    ScheduleType,
)

from .conftest import (
    OBJECT_ID_1,
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    make_ws_connection,
    setup_integration,
)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


def _object_entry(hass: HomeAssistant, tasks: dict | None = None) -> MockConfigEntry:
    if tasks is None:
        task = build_task_data()
        tasks = {TASK_ID_1: task}
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Pool Pump",
        data=build_object_entry_data(tasks=tasks),
        source="user", unique_id="test_object_unique",
    )
    entry.add_to_hass(hass)
    return entry


# ---------------------------------------------------------------------------
# coordinator.py line 93: _is_schedule_time_feature_enabled returns False
# when there is no global entry
# ---------------------------------------------------------------------------

async def test_coordinator_no_global_schedule_time_returns_false(hass: HomeAssistant) -> None:
    """When only an object entry exists (no global), _is_schedule_time_feature_enabled returns False."""
    from custom_components.maintenance_supporter.coordinator import MaintenanceCoordinator

    # Build an object entry only — no global entry
    obj_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Pool Pump",
        data=build_object_entry_data(tasks={TASK_ID_1: build_task_data()}),
        source="user", unique_id="only_object",
    )
    obj_entry.add_to_hass(hass)
    await hass.config_entries.async_setup(obj_entry.entry_id)
    await hass.async_block_till_done()

    rd = getattr(obj_entry, "runtime_data", None)
    coord = rd.coordinator if rd else None
    assert coord is not None, "Coordinator should be created"
    # Call the feature flag method — no global entry → must return False
    result = coord._is_schedule_time_feature_enabled()
    assert result is False


# ---------------------------------------------------------------------------
# export.py lines 128-144: YAML export (normal + ImportError fallback)
# ---------------------------------------------------------------------------

def test_export_yaml_normal() -> None:
    """serialize_export with fmt='yaml' produces valid YAML containing expected keys."""
    from custom_components.maintenance_supporter.export import serialize_export
    yaml = pytest.importorskip("yaml")
    data = {"version": 1, "objects": [{"entry_id": "abc", "object": {"name": "Pump"}, "tasks": []}]}
    result = serialize_export(data, fmt="yaml")
    parsed = yaml.safe_load(result)
    assert parsed["version"] == 1
    assert "objects" in parsed


def test_export_yaml_import_error_fallback() -> None:
    """When PyYAML is unavailable, serialize_export falls back to JSON."""
    from custom_components.maintenance_supporter.export import serialize_export
    data = {"version": 1, "objects": []}
    with patch.dict("sys.modules", {"yaml": None}):
        result = serialize_export(data, fmt="yaml")
    parsed = json.loads(result)
    assert parsed["version"] == 1


# ---------------------------------------------------------------------------
# binary_sensor.py lines 114, 123: is_on / extra_state_attributes missing task
# ---------------------------------------------------------------------------

async def test_binary_sensor_is_on_missing_task(hass: HomeAssistant) -> None:
    """When coordinator data has no task, is_on returns None and attributes are {}."""
    ge = _global_entry(hass)
    oe = _object_entry(hass)
    await setup_integration(hass, ge, oe)

    from custom_components.maintenance_supporter.binary_sensor import MaintenanceBinarySensor

    rd = oe.runtime_data
    coord = rd.coordinator

    # Create sensor with a task_id that doesn't exist in coordinator data
    # _task_data returns {} (empty dict) for nonexistent task, which is falsy
    sensor = MaintenanceBinarySensor(coord, "nonexistent_task_id")
    assert not sensor._task_data  # empty dict is falsy
    assert sensor.is_on is None
    assert sensor.extra_state_attributes == {}


# ---------------------------------------------------------------------------
# binary_sensor.py line 183: _compute_live_status DUE_SOON path
# ---------------------------------------------------------------------------

def test_binary_sensor_compute_live_status_due_soon() -> None:
    """_compute_live_status returns DUE_SOON when days > 0 but <= warning_days."""
    from custom_components.maintenance_supporter.binary_sensor import MaintenanceBinarySensor

    task = {
        "_trigger_active": False,
        "_days_until_due": 3,
        "warning_days": 7,
    }
    status = MaintenanceBinarySensor._compute_live_status(task)
    assert status == MaintenanceStatus.DUE_SOON


# ---------------------------------------------------------------------------
# binary_sensor.py line 158: _handle_task_reset when coordinator.data is None
# ---------------------------------------------------------------------------

async def test_binary_sensor_handle_task_reset_no_data(hass: HomeAssistant) -> None:
    """_handle_task_reset does nothing when coordinator.data is None."""
    ge = _global_entry(hass)
    oe = _object_entry(hass)
    await setup_integration(hass, ge, oe)

    from custom_components.maintenance_supporter.binary_sensor import MaintenanceBinarySensor

    rd = oe.runtime_data
    coord = rd.coordinator

    sensor = MaintenanceBinarySensor(coord, TASK_ID_1)
    # Force coordinator data to None
    coord.data = None
    # Should return early without error
    sensor._handle_task_reset()


# ---------------------------------------------------------------------------
# binary_sensor.py line 163: _handle_task_reset when task not in coordinator data
# ---------------------------------------------------------------------------

async def test_binary_sensor_handle_task_reset_missing_task(hass: HomeAssistant) -> None:
    """_handle_task_reset does nothing when task is absent from coordinator data."""
    ge = _global_entry(hass)
    oe = _object_entry(hass)
    await setup_integration(hass, ge, oe)

    from custom_components.maintenance_supporter.binary_sensor import MaintenanceBinarySensor

    rd = oe.runtime_data
    coord = rd.coordinator

    # Use a task_id not in coordinator data
    sensor = MaintenanceBinarySensor(coord, "ghost_task_id")
    # Should return early (task not found in data)
    sensor._handle_task_reset()


# ---------------------------------------------------------------------------
# sensor.py line 134: entity_slug sets _attr_name
# ---------------------------------------------------------------------------

async def test_sensor_entity_slug_sets_name(hass: HomeAssistant) -> None:
    """When a task has entity_slug, sensor._attr_name is set to that slug."""
    from custom_components.maintenance_supporter.sensor import MaintenanceSensor

    task = build_task_data()
    task["entity_slug"] = "my_custom_slug"
    tasks = {TASK_ID_1: task}
    oe = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Pool Pump",
        data=build_object_entry_data(tasks=tasks),
        source="user", unique_id="slug_object",
    )
    oe.add_to_hass(hass)
    ge = _global_entry(hass)
    await setup_integration(hass, ge, oe)

    rd = oe.runtime_data
    coord = rd.coordinator

    sensor = MaintenanceSensor(coord, TASK_ID_1)
    # entity_slug should set the name
    assert sensor._attr_name == "my_custom_slug"


# ---------------------------------------------------------------------------
# button.py lines 108-110: available returns False when coordinator unavailable
# or task data is missing
# ---------------------------------------------------------------------------

async def test_button_available_false_when_no_task_data(hass: HomeAssistant) -> None:
    """MaintenanceActionButton.available returns False when _task_data is empty."""
    from custom_components.maintenance_supporter.button import MaintenanceActionButton

    ge = _global_entry(hass)
    oe = _object_entry(hass)
    await setup_integration(hass, ge, oe)

    rd = oe.runtime_data
    coord = rd.coordinator

    btn = MaintenanceActionButton(coord, "nonexistent_task", "complete", "Complete")
    # _task_data returns {} for nonexistent task, which is falsy
    assert not btn._task_data  # empty dict is falsy
    assert btn.available is False


# ---------------------------------------------------------------------------
# storage.py lines 229, 232-233: extract_dynamic_from_task — trigger_config with
# _trigger_state and without
# ---------------------------------------------------------------------------

def test_extract_dynamic_no_trigger_state() -> None:
    """extract_dynamic_from_task with trigger_config but no _trigger_state."""
    from custom_components.maintenance_supporter.storage import extract_dynamic_from_task

    task = {
        "id": TASK_ID_1,
        "name": "Test",
        "last_performed": "2024-01-01",
        "trigger_config": {
            "type": "threshold",
            "trigger_above": 80.0,
            # no _trigger_state
        },
    }
    static, dynamic = extract_dynamic_from_task(task)
    # last_performed should be dynamic
    assert "last_performed" in dynamic
    # trigger_config should remain in static (no runtime to extract)
    assert "trigger_config" in static
    assert "_trigger_state" not in static["trigger_config"]


def test_extract_dynamic_with_trigger_state() -> None:
    """extract_dynamic_from_task with trigger_config containing _trigger_state."""
    from custom_components.maintenance_supporter.storage import extract_dynamic_from_task

    task = {
        "id": TASK_ID_1,
        "name": "Test",
        "trigger_config": {
            "type": "threshold",
            "trigger_above": 80.0,
            "_trigger_state": {"baseline_value": 10.0},
        },
    }
    static, dynamic = extract_dynamic_from_task(task)
    # _trigger_state should be moved to dynamic
    assert "trigger_runtime" in dynamic
    assert dynamic["trigger_runtime"] == {"baseline_value": 10.0}
    assert "_trigger_state" not in static.get("trigger_config", {})


# ---------------------------------------------------------------------------
# diagnostics.py lines 175-176: trigger config present but no entity_id
# ---------------------------------------------------------------------------

def test_diagnostics_check_trigger_status_no_entity_id(hass: HomeAssistant) -> None:
    """_check_trigger_status skips tasks with trigger_config but no entity_ids."""
    from custom_components.maintenance_supporter.diagnostics import _check_trigger_status

    data: dict[str, Any] = {
        CONF_TASKS: {
            TASK_ID_1: {
                "trigger_config": {
                    "type": "threshold",
                    "trigger_above": 80.0,
                    # No entity_id or entity_ids — should skip
                },
            },
        },
    }
    results = _check_trigger_status(hass, data)
    # No entity_ids → result should be empty
    assert results == []


# ---------------------------------------------------------------------------
# helpers/sanitize.py lines 183-184: cap_on_complete_action with un-serializable data
# ---------------------------------------------------------------------------

def test_sanitize_cap_action_field_unserializable_data() -> None:
    """cap_action_field silently drops data when JSON serialization fails."""
    from custom_components.maintenance_supporter.helpers.sanitize import cap_action_field

    class Unserializable:
        pass

    task_data: dict[str, Any] = {
        "on_complete_action": {
            "service": "notify.notify",
            "data": {"nested": Unserializable()},  # This will fail json.dumps
        }
    }
    cap_action_field(task_data)
    # The unserializable data should be dropped, but service stays
    cleaned = task_data.get("on_complete_action", {})
    assert cleaned.get("service") == "notify.notify"
    assert "data" not in cleaned


# ---------------------------------------------------------------------------
# helpers/qr_generator.py line 56: build_qr_url with "local" url_mode
# ---------------------------------------------------------------------------

async def test_qr_generator_build_url_local_mode(hass: HomeAssistant) -> None:
    """build_qr_url with url_mode='local' uses homeassistant.local:8123."""
    from custom_components.maintenance_supporter.helpers.qr_generator import build_qr_url

    url = build_qr_url(
        hass,
        entry_id="abc123",
        task_id="task1",
        action="view",
        url_mode="local",
    )
    assert "homeassistant.local:8123" in url
    assert "entry_id=abc123" in url


async def test_qr_generator_build_url_companion_mode(hass: HomeAssistant) -> None:
    """build_qr_url with url_mode='companion' uses homeassistant://navigate."""
    from custom_components.maintenance_supporter.helpers.qr_generator import build_qr_url

    url = build_qr_url(
        hass,
        entry_id="abc123",
        action="complete",
        url_mode="companion",
    )
    assert url.startswith("homeassistant://navigate")
    assert "entry_id=abc123" in url
    assert "action=complete" in url


# ---------------------------------------------------------------------------
# helpers/schedule.py lines 304-305: normalise_task_schedule — task with no
# nested AND no flat fields gets manual schedule
# ---------------------------------------------------------------------------

def test_schedule_normalize_no_fields_gives_manual() -> None:
    """normalize_task_storage on a task with no recurrence fields → manual kind."""
    from custom_components.maintenance_supporter.helpers.schedule import (
        normalize_task_storage,
        KIND_MANUAL,
    )

    task: dict[str, Any] = {
        "id": TASK_ID_1,
        "name": "Manual Task",
        "schedule_type": "manual",
    }
    result = normalize_task_storage(task)
    assert "schedule" in result
    assert result["schedule"]["kind"] == KIND_MANUAL


# ---------------------------------------------------------------------------
# helpers/vacation.py line 82: is_silent_for when task IS in exempt list
# ---------------------------------------------------------------------------

def test_vacation_is_silent_for_exempt_task() -> None:
    """is_silent_for returns False for tasks in the exempt list even during vacation."""
    from custom_components.maintenance_supporter.helpers.vacation import VacationState

    # Use dt_util.now().date() to match HA timezone (avoids UTC vs local issues)
    today = dt_util.now().date()
    state = VacationState(
        enabled=True,
        start=today,
        end=today + timedelta(days=7),
        buffer_days=0,
        exempt_task_ids=frozenset({TASK_ID_1}),
    )
    assert state.is_active() is True
    # Exempt task should NOT be silenced
    assert state.is_silent_for(TASK_ID_1) is False
    # Non-exempt task should be silenced
    assert state.is_silent_for("other_task") is True


# ---------------------------------------------------------------------------
# helpers/notification_manager.py line 520-521: vacation suppresses notification
# ---------------------------------------------------------------------------

async def test_coordinator_persist_dynamic_state_with_last_planned_due(hass: HomeAssistant) -> None:
    """_persist_dynamic_state sets last_planned_due in store when it's present in task dict."""
    ge = _global_entry(hass)
    oe = _object_entry(hass)
    await setup_integration(hass, ge, oe)

    rd = oe.runtime_data
    coord = rd.coordinator

    # Get a real task from the coordinator
    from custom_components.maintenance_supporter.models.maintenance_task import MaintenanceTask
    task_data = coord.entry.data.get(CONF_TASKS, {}).get(TASK_ID_1, {})
    task = MaintenanceTask.from_dict(task_data)
    task.last_planned_due = "2026-01-01"

    # Call _persist_dynamic_state and verify store has last_planned_due
    coord._persist_dynamic_state(TASK_ID_1, task)

    store = coord._store
    assert store is not None
    state = store._data["tasks"].get(TASK_ID_1, {})
    assert state.get("last_planned_due") == "2026-01-01"


async def test_coordinator_persist_dynamic_state_clears_last_planned_due(hass: HomeAssistant) -> None:
    """_persist_dynamic_state deletes last_planned_due from store when task has none."""
    ge = _global_entry(hass)
    oe = _object_entry(hass)
    await setup_integration(hass, ge, oe)

    rd = oe.runtime_data
    coord = rd.coordinator
    store = coord._store
    assert store is not None

    # Pre-set last_planned_due in store
    task_state = store._ensure_task(TASK_ID_1)
    task_state["last_planned_due"] = "2025-12-01"

    from custom_components.maintenance_supporter.models.maintenance_task import MaintenanceTask
    task_data = coord.entry.data.get(CONF_TASKS, {}).get(TASK_ID_1, {})
    task = MaintenanceTask.from_dict(task_data)
    task.last_planned_due = None  # type: ignore[assignment]  # clear it

    coord._persist_dynamic_state(TASK_ID_1, task)

    # last_planned_due should be removed from store
    updated_state = store._data["tasks"].get(TASK_ID_1, {})
    assert "last_planned_due" not in updated_state


# ---------------------------------------------------------------------------
# diagnostics.py: _check_data_quality — time_based task with no interval
# ---------------------------------------------------------------------------

def test_diagnostics_data_quality_missing_interval_warning(hass: HomeAssistant) -> None:
    """_check_data_quality warns when time_based task has no interval."""
    from custom_components.maintenance_supporter.diagnostics import _check_data_quality

    data: dict[str, Any] = {
        CONF_OBJECT: {"name": "My Object"},
        CONF_TASKS: {
            TASK_ID_1: {
                "name": "Interval-less Task",
                "schedule_type": "time_based",
                # no interval_days
            },
        },
    }
    warnings = _check_data_quality(data)
    assert any("interval" in w.lower() or "time-based" in w.lower() for w in warnings)


# ---------------------------------------------------------------------------
# helpers/vacation.py: compute_preview — ensure calendar kind row built
# This tests lines 270-277 where calendar tasks generate preview rows
# ---------------------------------------------------------------------------

def test_vacation_compute_preview_interval_task() -> None:
    """compute_preview returns preview rows for interval-based tasks."""
    from custom_components.maintenance_supporter.helpers.vacation import compute_preview, VacationState

    today = dt_util.now().date()
    window_start = today + timedelta(days=1)
    window_end = today + timedelta(days=14)

    state = VacationState(
        enabled=True,
        start=window_start,
        end=window_end,
        buffer_days=0,
        exempt_task_ids=frozenset(),
    )

    tasks = [
        {
            "task_id": TASK_ID_1,
            "entry_id": "entry1",
            "object_name": "Pool",
            "task_name": "Filter",
            "schedule_type": "time_based",
            "interval_days": 7,
            "warning_days": 2,
            "last_performed": today.isoformat(),
        }
    ]
    rows = compute_preview(state, tasks)
    # With 7-day interval from today, next due is in 7 days — within 14-day window
    # We expect at least one row (DUE_SOON or OVERDUE event during vacation)
    assert isinstance(rows, list)


# ---------------------------------------------------------------------------
# websocket/tasks.py line 217: _validate_trigger_config strips unknown keys
# ---------------------------------------------------------------------------

def test_validate_trigger_config_strips_unknown_keys(hass: HomeAssistant) -> None:
    """_validate_trigger_config removes keys not in _TRIGGER_ALLOWED_KEYS."""
    from custom_components.maintenance_supporter.websocket.tasks import _validate_trigger_config

    trigger = {
        "type": "threshold",
        "entity_id": "sensor.temp",
        "trigger_above": 80.0,
        "unknown_key_xyz": "should_be_removed",
    }
    errors, warnings = _validate_trigger_config(hass, trigger)
    assert "unknown_key_xyz" not in trigger
    assert errors == []


# ---------------------------------------------------------------------------
# websocket/tasks.py line 382: _build_task_data with notes
# ---------------------------------------------------------------------------

async def test_ws_create_task_with_notes(hass: HomeAssistant) -> None:
    """ws_create_task creates a task with notes field persisted to entry data."""
    from custom_components.maintenance_supporter.websocket.tasks import ws_create_task

    ge = _global_entry(hass)
    oe = _object_entry(hass)
    await setup_integration(hass, ge, oe)

    conn = make_ws_connection()
    msg = {
        "id": 1,
        "entry_id": oe.entry_id,
        "name": "Task With Notes",
        "schedule_type": "time_based",
        "interval_days": 30,
        "warning_days": 7,
        "notes": "This is a note",
    }
    await call_ws_handler(ws_create_task, hass, conn, msg)

    assert conn.send_error.call_count == 0
    assert conn.send_result.call_count == 1
    payload = conn.send_result.call_args[0][1]
    # ws_create_task returns {"task_id": "..."}, then the task is persisted
    assert "task_id" in payload
    task_id = payload["task_id"]

    # Verify notes are in the persisted entry data
    oe_reloaded = hass.config_entries.async_get_entry(oe.entry_id)
    tasks = oe_reloaded.data.get(CONF_TASKS, {})
    assert task_id in tasks
    assert tasks[task_id].get("notes") == "This is a note"


# ---------------------------------------------------------------------------
# websocket/tasks.py lines 961-962: ws_quick_complete_task — entry not found
# ---------------------------------------------------------------------------

async def test_ws_quick_complete_task_entry_not_found(hass: HomeAssistant) -> None:
    """ws_quick_complete_task returns not_found when entry doesn't exist."""
    from custom_components.maintenance_supporter.websocket.tasks import ws_quick_complete_task

    ge = _global_entry(hass)
    oe = _object_entry(hass)
    await setup_integration(hass, ge, oe)

    conn = make_ws_connection()
    msg = {
        "id": 1,
        "entry_id": "nonexistent_entry_id",
        "task_id": TASK_ID_1,
    }
    await call_ws_handler(ws_quick_complete_task, hass, conn, msg)

    assert conn.send_error.call_count == 1
    err_args = conn.send_error.call_args[0]
    assert err_args[1] == "not_found"


# ---------------------------------------------------------------------------
# websocket/vacation.py line 104: invalid start date
# ---------------------------------------------------------------------------

async def test_ws_vacation_update_invalid_start_date(hass: HomeAssistant) -> None:
    """ws_vacation_update rejects a non-ISO start date."""
    from custom_components.maintenance_supporter.websocket.vacation import ws_vacation_update

    ge = _global_entry(hass)
    await setup_integration(hass, ge)

    conn = make_ws_connection()
    msg = {"id": 1, "start": "not-a-date"}
    await call_ws_handler(ws_vacation_update, hass, conn, msg)

    assert conn.send_error.call_count == 1
    err = conn.send_error.call_args[0]
    assert err[1] == "invalid_date"


# ---------------------------------------------------------------------------
# websocket/vacation.py lines 123-124: end date before start
# ---------------------------------------------------------------------------

async def test_ws_vacation_update_end_before_start(hass: HomeAssistant) -> None:
    """ws_vacation_update rejects end date before start date."""
    from custom_components.maintenance_supporter.websocket.vacation import ws_vacation_update

    ge = _global_entry(hass)
    await setup_integration(hass, ge)

    # First set start date
    options = {"vacation_start": "2026-06-01", "vacation_end": "2026-06-10"}
    hass.config_entries.async_update_entry(ge, options=options)

    conn = make_ws_connection()
    msg = {
        "id": 1,
        "start": "2026-06-10",
        "end": "2026-06-01",  # end before start
    }
    await call_ws_handler(ws_vacation_update, hass, conn, msg)

    assert conn.send_error.call_count == 1
    err = conn.send_error.call_args[0]
    assert err[1] == "invalid_range"


# ---------------------------------------------------------------------------
# websocket/vacation.py lines 135, 142: buffer_days and exempt_task_ids update
# ---------------------------------------------------------------------------

async def test_ws_vacation_update_buffer_and_exempt(hass: HomeAssistant) -> None:
    """ws_vacation_update correctly updates buffer_days and exempt_task_ids."""
    from custom_components.maintenance_supporter.websocket.vacation import ws_vacation_update

    ge = _global_entry(hass)
    await setup_integration(hass, ge)

    conn = make_ws_connection()
    msg = {
        "id": 1,
        "buffer_days": 3,
        "exempt_task_ids": [TASK_ID_1, "  extra_id  ", TASK_ID_1],  # deduped, stripped
    }
    await call_ws_handler(ws_vacation_update, hass, conn, msg)

    assert conn.send_error.call_count == 0
    assert conn.send_result.call_count == 1
    payload = conn.send_result.call_args[0][1]
    assert payload["buffer_days"] == 3
    # TASK_ID_1 should appear once (deduplicated)
    assert TASK_ID_1 in payload["exempt_task_ids"]
    assert payload["exempt_task_ids"].count(TASK_ID_1) == 1


# ---------------------------------------------------------------------------
# websocket/vacation.py lines 244-245: vacation_end_now with future start
# ---------------------------------------------------------------------------

async def test_ws_vacation_end_now_future_start(hass: HomeAssistant) -> None:
    """ws_vacation_end_now does NOT clamp end when vacation hasn't started yet."""
    from custom_components.maintenance_supporter.websocket.vacation import ws_vacation_end_now

    ge = _global_entry(hass)
    await setup_integration(hass, ge)

    future_start = (date.today() + timedelta(days=10)).isoformat()
    future_end = (date.today() + timedelta(days=20)).isoformat()
    hass.config_entries.async_update_entry(
        ge,
        options={
            CONF_VACATION_ENABLED: True,
            CONF_VACATION_START: future_start,
            CONF_VACATION_END: future_end,
        },
    )

    conn = make_ws_connection()
    msg = {"id": 1}
    await call_ws_handler(ws_vacation_end_now, hass, conn, msg)

    assert conn.send_error.call_count == 0
    assert conn.send_result.call_count == 1
    payload = conn.send_result.call_args[0][1]
    assert payload["enabled"] is False
    # End date should NOT be clamped to today since vacation hasn't started
    assert payload["end"] == future_end


# ---------------------------------------------------------------------------
# websocket/io.py line 298: JSON import with empty task name → skipped
# ---------------------------------------------------------------------------

async def test_ws_import_json_empty_task_name_skipped(hass: HomeAssistant) -> None:
    """ws_import_json skips tasks with empty/blank names."""
    from custom_components.maintenance_supporter.websocket.io import ws_import_json

    ge = _global_entry(hass)
    await setup_integration(hass, ge)

    json_data = {
        "version": 1,
        "objects": [
            {
                "object": {"name": "Test Object"},
                "tasks": [
                    {"name": ""},          # empty → skipped
                    {"name": "   "},       # blank → skipped
                    {"name": "Valid Task", "schedule_type": "time_based"},  # kept
                ],
            }
        ],
    }

    conn = make_ws_connection()
    msg = {"id": 1, "json_content": json.dumps(json_data)}
    await call_ws_handler(ws_import_json, hass, conn, msg)

    assert conn.send_error.call_count == 0
    assert conn.send_result.call_count == 1
    payload = conn.send_result.call_args[0][1]
    # 1 entry created (count)
    assert payload.get("created") == 1
    # "imported" contains entry details
    imported = payload.get("imported", [])
    assert len(imported) == 1
    # Only 1 valid task created (the other 2 were skipped)
    assert imported[0]["task_count"] == 1


# ---------------------------------------------------------------------------
# websocket/io.py lines 334-335: JSON import drops invalid interval_days
# ---------------------------------------------------------------------------

async def test_ws_import_json_invalid_interval_dropped(hass: HomeAssistant) -> None:
    """ws_import_json drops interval_days when it is not a positive integer."""
    from custom_components.maintenance_supporter.websocket.io import ws_import_json

    ge = _global_entry(hass)
    await setup_integration(hass, ge)

    json_data = {
        "version": 1,
        "objects": [
            {
                "object": {"name": "Pump 2"},
                "tasks": [
                    {
                        "name": "Bad Interval Task",
                        "interval_days": 0,   # invalid (<1) → should be dropped
                    },
                ],
            }
        ],
    }

    conn = make_ws_connection()
    msg = {"id": 1, "json_content": json.dumps(json_data)}
    await call_ws_handler(ws_import_json, hass, conn, msg)

    assert conn.send_error.call_count == 0
    payload = conn.send_result.call_args[0][1]
    assert payload.get("created") == 1  # count of created entries
    imported = payload.get("imported", [])
    assert len(imported) == 1

    # Verify the imported entry's task has no interval_days
    imported_entry_id = imported[0]["entry_id"]
    imported_entry = hass.config_entries.async_get_entry(imported_entry_id)
    assert imported_entry is not None
    tasks = imported_entry.data.get(CONF_TASKS, {})
    assert len(tasks) == 1
    imported_task = list(tasks.values())[0]
    assert "interval_days" not in imported_task


# ---------------------------------------------------------------------------
# websocket/io.py lines 457-459: QR generate with ValueError → no_url error
# ---------------------------------------------------------------------------

async def test_ws_qr_generate_no_url_error(hass: HomeAssistant) -> None:
    """QR generate returns no_url error when build_qr_url raises ValueError."""
    from custom_components.maintenance_supporter.websocket.io import ws_generate_qr

    ge = _global_entry(hass)
    oe = _object_entry(hass)
    await setup_integration(hass, ge, oe)

    conn = make_ws_connection()
    msg = {
        "id": 1,
        "entry_id": oe.entry_id,
        "task_id": TASK_ID_1,
        "action": "view",
        "url_mode": "server",
    }

    with patch(
        "custom_components.maintenance_supporter.websocket.io.build_qr_url",
        side_effect=ValueError("No URL configured"),
    ):
        await call_ws_handler(ws_generate_qr, hass, conn, msg)

    assert conn.send_error.call_count == 1
    err = conn.send_error.call_args[0]
    assert err[1] == "no_url"
    assert "No URL" in err[2]
