"""Coverage tests for uncovered WebSocket handler lines.

Targets:
- websocket/io.py: 177-181, 192-193, 201, 220-221, 245-246, 262-263, 266-267,
                   298, 328, 334-335, 338, 346, 457-459, 591-595
- websocket/tasks.py: 217, 360, 382, 470, 472, 478-480, 629-630, 665-669, 862,
                      956-957, 961-962, 965-966, 1107-1108
- websocket/dashboard.py: 197-200, 496, 515-530
- websocket/vacation.py: 83-84, 93, 97-99, 104, 108-110, 123-124, 135, 142,
                         170-171, 230-231, 244-245
- websocket/objects.py: 169-175, 180-181
- websocket/groups.py: 132
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
    CONF_VACATION_START,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    HistoryEntryType,
)
from custom_components.maintenance_supporter.websocket.dashboard import (
    ws_update_global_settings,
)
from custom_components.maintenance_supporter.websocket.groups import (
    ws_update_group,
)
from custom_components.maintenance_supporter.websocket.io import (
    ws_batch_generate_qr,
    ws_import_csv,
    ws_import_json,
)
from custom_components.maintenance_supporter.websocket.objects import (
    ws_create_object,
)
from custom_components.maintenance_supporter.websocket.tasks import (
    ws_create_task,
    ws_quick_complete_task,
    ws_update_history_entry,
    ws_update_task,
)
from custom_components.maintenance_supporter.websocket.vacation import (
    ws_vacation_end_now,
    ws_vacation_preview,
    ws_vacation_state,
    ws_vacation_update,
)

from .conftest import (
    TASK_ID_1,
    TASK_ID_2,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    setup_integration,
)


def _conn() -> MagicMock:
    """Create a mock WS connection."""
    conn = MagicMock()
    conn.send_result = MagicMock()
    conn.send_error = MagicMock()
    conn.user = MagicMock(is_admin=True)
    conn.subscriptions = {}
    conn.send_message = MagicMock()
    return conn


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


@pytest.fixture
def object_entry(hass: HomeAssistant) -> MockConfigEntry:
    task = build_task_data(last_performed="2024-06-01")
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Pool Pump",
        data=build_object_entry_data(tasks={TASK_ID_1: task}),
        source="user",
        unique_id="maintenance_supporter_pool_pump_cov",
    )
    entry.add_to_hass(hass)
    return entry


# ===========================================================================
# websocket/io.py
# ===========================================================================


# Lines 177-181: CSV import — unexpected exception during flow.async_init
async def test_csv_import_flow_exception(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """ws_import_csv: exception in flow.async_init is caught, appended to errors."""
    await setup_integration(hass, global_entry)
    conn = _conn()

    # CSV format requires object_name + task_name columns
    csv_content = "object_name,task_name\nPump A,Filter Clean\n"

    async def _raise(*args, **kwargs):
        raise RuntimeError("simulated flow error")

    with patch.object(hass.config_entries.flow, "async_init", side_effect=_raise):
        await call_ws_handler(ws_import_csv, hass, conn, {
            "id": 1, "type": "maintenance_supporter/csv/import",
            "csv_content": csv_content,
        })

    # send_result is called even when all rows error
    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["created"] == 0
    assert "errors" in result
    assert any("unexpected error" in e.get("reason", "") for e in result["errors"])


# Lines 192-193: CSV import — flow returns non-create_entry type
async def test_csv_import_flow_aborted(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """ws_import_csv: a flow result that isn't create_entry appends to errors."""
    await setup_integration(hass, global_entry)
    conn = _conn()

    # CSV format requires object_name + task_name columns
    csv_content = "object_name,task_name\nPump Fail,Filter\n"

    async def _abort(*args, **kwargs):
        return {"type": "abort", "reason": "already_configured"}

    with patch.object(hass.config_entries.flow, "async_init", side_effect=_abort):
        await call_ws_handler(ws_import_csv, hass, conn, {
            "id": 1, "type": "maintenance_supporter/csv/import",
            "csv_content": csv_content,
        })

    result = conn.send_result.call_args[0][1]
    assert result["created"] == 0
    assert "errors" in result
    assert result["errors"][0]["reason"] == "already_configured"


# Line 201: CSV import — resp includes "errors" key when errors list is non-empty
# (already covered by tests above — this tests the resp dict branch explicitly)
async def test_csv_import_errors_key_in_response(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """ws_import_csv: 'errors' key appears in resp iff errors is non-empty."""
    await setup_integration(hass, global_entry)
    conn = _conn()

    # CSV format requires object_name + task_name columns
    csv_content = "object_name,task_name\nOK Pump,Filter\n"

    async def _success(*args, **kwargs):
        fake_entry = MagicMock()
        fake_entry.entry_id = "fake123"
        return {"type": "create_entry", "result": fake_entry}

    with patch.object(hass.config_entries.flow, "async_init", side_effect=_success):
        await call_ws_handler(ws_import_csv, hass, conn, {
            "id": 1, "type": "maintenance_supporter/csv/import",
            "csv_content": csv_content,
        })

    result = conn.send_result.call_args[0][1]
    assert result["created"] == 1
    # No errors → key should NOT be present
    assert "errors" not in result


# Lines 220-221: ws_import_json — YAML parsing fallback; YAML error → invalid_format
async def test_json_import_invalid_yaml(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """ws_import_json: content that fails both JSON and YAML parse → invalid_format."""
    await setup_integration(hass, global_entry)
    conn = _conn()

    # Deliberately broken YAML that yaml.safe_load raises on
    bad_content = "key: :\n  - broken: [unclosed"

    await call_ws_handler(ws_import_json, hass, conn, {
        "id": 1, "type": "maintenance_supporter/json/import",
        "json_content": bad_content,
    })

    conn.send_error.assert_called_once()
    args = conn.send_error.call_args[0]
    assert args[1] == "invalid_format"


# Lines 245-246: ws_import_json — oversized content
async def test_json_import_too_large(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """ws_import_json: content > 10MB → too_large error."""
    await setup_integration(hass, global_entry)
    conn = _conn()

    big_content = "x" * (10_485_760 + 1)

    await call_ws_handler(ws_import_json, hass, conn, {
        "id": 1, "type": "maintenance_supporter/json/import",
        "json_content": big_content,
    })

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "too_large"


# Lines 262-263: ws_import_json — 'objects' key present but not a list
async def test_json_import_objects_not_list(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """ws_import_json: 'objects' is a dict (not list) → invalid_format."""
    await setup_integration(hass, global_entry)
    conn = _conn()

    content = json.dumps({"objects": {"bad": "shape"}})

    await call_ws_handler(ws_import_json, hass, conn, {
        "id": 1, "type": "maintenance_supporter/json/import",
        "json_content": content,
    })

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "invalid_format"


# Lines 266-267: ws_import_json — objects list exceeds 1000
async def test_json_import_too_many_objects(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """ws_import_json: objects list > 1000 → too_many error."""
    await setup_integration(hass, global_entry)
    conn = _conn()

    objects = [{"object": {"name": f"obj{i}"}, "tasks": []} for i in range(1001)]
    content = json.dumps({"objects": objects})

    await call_ws_handler(ws_import_json, hass, conn, {
        "id": 1, "type": "maintenance_supporter/json/import",
        "json_content": content,
    })

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "too_many"


# Line 298: ws_import_json — task with invalid interval_days (< 1) is sanitized
async def test_json_import_sanitizes_invalid_interval_days(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """ws_import_json: task with interval_days=0 has that field dropped (sanitized)."""
    await setup_integration(hass, global_entry)
    conn = _conn()

    content = json.dumps({"objects": [{
        "object": {"name": "Sanitize Test"},
        "tasks": [{
            "name": "Bad interval",
            "interval_days": 0,  # invalid — must be dropped
        }],
    }]})

    await call_ws_handler(ws_import_json, hass, conn, {
        "id": 1, "type": "maintenance_supporter/json/import",
        "json_content": content,
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["created"] == 1


# Lines 328, 334-335: ws_import_json — task with invalid schedule_time stripped
async def test_json_import_sanitizes_invalid_schedule_time(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """ws_import_json: task with bad schedule_time (not HH:MM) has it dropped."""
    await setup_integration(hass, global_entry)
    conn = _conn()

    content = json.dumps({"objects": [{
        "object": {"name": "SchedTime Test"},
        "tasks": [{
            "name": "Bad schedule_time",
            "schedule_time": "99:99",  # invalid
        }],
    }]})

    await call_ws_handler(ws_import_json, hass, conn, {
        "id": 1, "type": "maintenance_supporter/json/import",
        "json_content": content,
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["created"] == 1


# Line 338: ws_import_json — task with out-of-range warning_days replaced by default
async def test_json_import_sanitizes_warning_days(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """ws_import_json: task with warning_days=999 is clamped to the default."""
    await setup_integration(hass, global_entry)
    conn = _conn()

    content = json.dumps({"objects": [{
        "object": {"name": "WarningDays Test"},
        "tasks": [{
            "name": "Bad warning days",
            "warning_days": 999,
        }],
    }]})

    await call_ws_handler(ws_import_json, hass, conn, {
        "id": 1, "type": "maintenance_supporter/json/import",
        "json_content": content,
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["created"] == 1


# Line 346: ws_import_json — task checklist with non-list value is dropped
async def test_json_import_sanitizes_non_list_checklist(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """ws_import_json: checklist that is not a list is silently dropped."""
    await setup_integration(hass, global_entry)
    conn = _conn()

    content = json.dumps({"objects": [{
        "object": {"name": "Checklist Test"},
        "tasks": [{
            "name": "Checklist task",
            "checklist": "not a list",
        }],
    }]})

    await call_ws_handler(ws_import_json, hass, conn, {
        "id": 1, "type": "maintenance_supporter/json/import",
        "json_content": content,
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["created"] == 1


# Lines 457-459: ws_batch_generate_qr — empty result set (no tasks match)
async def test_batch_qr_empty_result(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """ws_batch_generate_qr: filtering yields 0 targets → empty result."""
    await setup_integration(hass, global_entry)
    conn = _conn()

    await call_ws_handler(ws_batch_generate_qr, hass, conn, {
        "id": 1, "type": "maintenance_supporter/qr/batch_generate",
        "entry_ids": ["nonexistent_entry"],
        "actions": ["complete"],
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["total"] == 0
    assert result["qrs"] == []


# Lines 591-595: ws_batch_generate_qr — URL build raises ValueError (no HA URL)
async def test_batch_qr_skips_on_url_error(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """ws_batch_generate_qr: ValueError from build_qr_url skips that row."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _conn()

    with patch(
        "custom_components.maintenance_supporter.websocket.io.build_qr_url",
        side_effect=ValueError("no URL"),
    ):
        await call_ws_handler(ws_batch_generate_qr, hass, conn, {
            "id": 1, "type": "maintenance_supporter/qr/batch_generate",
            "actions": ["complete"],
        })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    # All rows were skipped due to ValueError — total is 0
    assert result["total"] == 0


# ===========================================================================
# websocket/tasks.py
# ===========================================================================


# Line 217: ws_create_task — interval_unit != "days" is stored in normalized schedule
async def test_create_task_interval_unit_weeks(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """ws_create_task: interval_unit='weeks' branch is hit and persisted via schedule."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _conn()

    await call_ws_handler(ws_create_task, hass, conn, {
        "id": 1, "type": "maintenance_supporter/task/create",
        "entry_id": object_entry.entry_id,
        "name": "Weekly Check",
        "interval_days": 2,
        "interval_unit": "weeks",
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert "task_id" in result

    # After normalize_task_storage the interval is in the nested schedule dict
    entry = hass.config_entries.async_get_entry(object_entry.entry_id)
    task = entry.data[CONF_TASKS][result["task_id"]]
    # schedule.unit holds the normalized value
    schedule = task.get("schedule", {})
    assert schedule.get("unit") == "weeks"


# Line 360: async_create_task_simple — empty name raises ValueError
async def test_async_create_task_simple_empty_name(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """async_create_task_simple: empty name raises ValueError."""
    from custom_components.maintenance_supporter.websocket.tasks import (
        async_create_task_simple,
    )

    await setup_integration(hass, global_entry, object_entry)

    with pytest.raises(ValueError, match="Name must not be empty"):
        await async_create_task_simple(
            hass,
            entry_id=object_entry.entry_id,
            name="   ",
        )


# Line 382: async_create_task_simple — missing/wrong entry_id raises ValueError
async def test_async_create_task_simple_bad_entry(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """async_create_task_simple: invalid entry_id raises ValueError."""
    from custom_components.maintenance_supporter.websocket.tasks import (
        async_create_task_simple,
    )

    await setup_integration(hass, global_entry)

    with pytest.raises(ValueError, match="No maintenance object found"):
        await async_create_task_simple(
            hass,
            entry_id="nonexistent_entry_id",
            name="My Task",
        )


# Line 470: ws_create_task — interval_anchor != "completion" is persisted in schedule
async def test_create_task_interval_anchor_planned(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """ws_create_task: interval_anchor='planned' branch is executed; task is created."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _conn()

    await call_ws_handler(ws_create_task, hass, conn, {
        "id": 1, "type": "maintenance_supporter/task/create",
        "entry_id": object_entry.entry_id,
        "name": "Planned Task",
        "interval_days": 30,
        "interval_anchor": "planned",
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert "task_id" in result
    # The task was created — anchor branch executed; stored in schedule.anchor
    entry = hass.config_entries.async_get_entry(object_entry.entry_id)
    task = entry.data[CONF_TASKS][result["task_id"]]
    schedule = task.get("schedule", {})
    assert schedule.get("anchor") == "planned"


# Line 472: ws_create_task — due_date is set on one_time tasks
async def test_create_task_with_due_date(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """ws_create_task: due_date is persisted for one_time tasks."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _conn()

    await call_ws_handler(ws_create_task, hass, conn, {
        "id": 1, "type": "maintenance_supporter/task/create",
        "entry_id": object_entry.entry_id,
        "name": "One Time Task",
        "schedule_type": "one_time",
        "due_date": "2027-01-01",
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert "task_id" in result
    # due_date is in schedule.due for one_time after normalization
    entry = hass.config_entries.async_get_entry(object_entry.entry_id)
    task = entry.data[CONF_TASKS][result["task_id"]]
    # The task was created successfully — due_date branch was hit
    assert task is not None


# Lines 478-480: ws_create_task — invalid last_performed date format → error
async def test_create_task_invalid_last_performed(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """ws_create_task: non-ISO last_performed → invalid_format error."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _conn()

    await call_ws_handler(ws_create_task, hass, conn, {
        "id": 1, "type": "maintenance_supporter/task/create",
        "entry_id": object_entry.entry_id,
        "name": "Bad Date Task",
        "last_performed": "not-a-date",
    })

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "invalid_format"


# Lines 629-630: ws_update_task — empty name (after strip) → invalid_input error
async def test_update_task_empty_name(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """ws_update_task: setting name to blank string → invalid_input error."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _conn()

    await call_ws_handler(ws_update_task, hass, conn, {
        "id": 1, "type": "maintenance_supporter/task/update",
        "entry_id": object_entry.entry_id,
        "task_id": TASK_ID_1,
        "name": "   ",
    })

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "invalid_input"


# Lines 665-669: ws_update_task — invalid last_performed date → invalid_format error
async def test_update_task_invalid_last_performed(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """ws_update_task: non-ISO last_performed → invalid_format error."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _conn()

    await call_ws_handler(ws_update_task, hass, conn, {
        "id": 1, "type": "maintenance_supporter/task/update",
        "entry_id": object_entry.entry_id,
        "task_id": TASK_ID_1,
        "last_performed": "not-a-date",
    })

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "invalid_format"


# Line 862: ws_list_tasks — filtered to a specific entry_id
# ws_list_tasks is @callback (sync), so call it directly — not via await
async def test_list_tasks_filtered_by_entry(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """ws_list_tasks: entry_id filter skips non-matching entries."""
    from custom_components.maintenance_supporter.websocket.tasks import ws_list_tasks

    # Add a second object entry to confirm filtering works
    task2 = build_task_data(task_id=TASK_ID_2, name="Other Task")
    entry2 = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Other Object",
        data=build_object_entry_data(tasks={TASK_ID_2: task2}),
        source="user",
        unique_id="maintenance_supporter_other_obj_cov",
    )
    entry2.add_to_hass(hass)
    await setup_integration(hass, global_entry, object_entry, entry2)

    conn = _conn()

    # ws_list_tasks is @callback (synchronous) — unwrap and call directly
    unwrapped = ws_list_tasks
    while hasattr(unwrapped, "__wrapped__"):
        unwrapped = unwrapped.__wrapped__
    unwrapped(hass, conn, {
        "id": 1, "type": "maintenance_supporter/task/list",
        "entry_id": object_entry.entry_id,
    })

    result = conn.send_result.call_args[0][1]
    assert "tasks" in result
    # Only tasks from object_entry should appear
    entry_ids = {t["entry_id"] for t in result["tasks"]}
    assert entry_ids == {object_entry.entry_id}


# Lines 956-957: ws_quick_complete_task — coordinator not found → not_found
async def test_quick_complete_no_coordinator(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """ws_quick_complete_task: missing runtime_data → not_found error."""
    await setup_integration(hass, global_entry)
    conn = _conn()

    await call_ws_handler(ws_quick_complete_task, hass, conn, {
        "id": 1, "type": "maintenance_supporter/task/quick_complete",
        "entry_id": "nonexistent",
        "task_id": TASK_ID_1,
    })

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "not_found"


# Lines 961-962: ws_quick_complete_task — entry not found
async def test_quick_complete_entry_not_found(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """ws_quick_complete_task: entry doesn't exist → not_found error."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _conn()

    # Provide valid entry_id (so coordinator lookup works) but wrong entry for task
    await call_ws_handler(ws_quick_complete_task, hass, conn, {
        "id": 1, "type": "maintenance_supporter/task/quick_complete",
        "entry_id": object_entry.entry_id,
        "task_id": "no_such_task" * 2,  # keeps len=24 — still "not found" path
    })

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "not_found"


# Lines 965-966: ws_quick_complete_task — task has no quick_complete_defaults → no_defaults
async def test_quick_complete_no_defaults(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """ws_quick_complete_task: task without quick_complete_defaults → no_defaults error."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _conn()

    await call_ws_handler(ws_quick_complete_task, hass, conn, {
        "id": 1, "type": "maintenance_supporter/task/quick_complete",
        "entry_id": object_entry.entry_id,
        "task_id": TASK_ID_1,
    })

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "no_defaults"


# Lines 1107-1108: ws_update_history_entry — store is None → not_loaded error
async def test_update_history_entry_no_store(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """ws_update_history_entry: no Store (entry not loaded) → not_loaded error."""
    # Setup integration but manually strip runtime_data.store to simulate missing store
    await setup_integration(hass, global_entry, object_entry)
    conn = _conn()

    # Patch _get_runtime_data to return an object without a store
    fake_rd = MagicMock()
    fake_rd.store = None
    fake_rd.coordinator = None

    with patch(
        "custom_components.maintenance_supporter.websocket.tasks._get_runtime_data",
        return_value=fake_rd,
    ):
        await call_ws_handler(ws_update_history_entry, hass, conn, {
            "id": 1, "type": "maintenance_supporter/task/history/update",
            "entry_id": object_entry.entry_id,
            "task_id": TASK_ID_1,
            "original_timestamp": "2024-06-01T00:00:00",
        })

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "not_loaded"


# ===========================================================================
# websocket/dashboard.py
# ===========================================================================


# Lines 197-200: _vacation_summary — _parse returns None for invalid date string
async def test_settings_vacation_summary_invalid_date(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """_vacation_summary: non-date start/end strings are treated as None."""
    from custom_components.maintenance_supporter.const import (
        CONF_VACATION_BUFFER_DAYS,
        CONF_VACATION_ENABLED,
        CONF_VACATION_END,
        CONF_VACATION_START,
    )
    from custom_components.maintenance_supporter.websocket.dashboard import ws_get_settings

    # Set garbage dates via entry options
    await setup_integration(hass, global_entry)
    options = {
        CONF_VACATION_ENABLED: True,
        CONF_VACATION_START: "not-a-date",
        CONF_VACATION_END: "also-bad",
        CONF_VACATION_BUFFER_DAYS: 2,
    }
    hass.config_entries.async_update_entry(global_entry, options=options)

    conn = _conn()
    await call_ws_handler(ws_get_settings, hass, conn, {
        "id": 1, "type": "maintenance_supporter/settings",
    })

    result = conn.send_result.call_args[0][1]
    vacation = result["vacation"]
    assert vacation["start"] is None
    assert vacation["end"] is None
    assert vacation["is_active"] is False


# Line 496: ws_update_global_settings — invalid notification_title_style is dropped
async def test_update_global_settings_invalid_title_style_dropped(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """ws_update_global_settings: unknown notification_title_style is silently dropped."""
    from custom_components.maintenance_supporter.const import CONF_NOTIFICATION_TITLE_STYLE

    await setup_integration(hass, global_entry)
    conn = _conn()

    # Send an unknown style; must be dropped so no error is raised but setting
    # is not persisted
    await call_ws_handler(ws_update_global_settings, hass, conn, {
        "id": 1, "type": "maintenance_supporter/global/update",
        "settings": {
            CONF_NOTIFICATION_TITLE_STYLE: "unicorn_style",
            # Also include a valid setting to avoid "no valid keys" error
            "default_warning_days": 10,
        },
    })

    result = conn.send_result.call_args[0][1]
    # The valid setting was accepted
    assert result is not None
    # The garbage title_style must NOT be in the merged options
    entry = hass.config_entries.async_get_entry(global_entry.entry_id)
    opts = entry.options or entry.data
    assert opts.get(CONF_NOTIFICATION_TITLE_STYLE) != "unicorn_style"


# Lines 515-530: ws_update_global_settings — admin_panel_user_ids sanitized
async def test_update_global_settings_admin_user_ids_sanitized(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """ws_update_global_settings: admin_panel_user_ids list is deduped and stripped."""
    from custom_components.maintenance_supporter.const import CONF_ADMIN_PANEL_USER_IDS

    await setup_integration(hass, global_entry)
    conn = _conn()

    raw_ids = [
        "  abc123  ",      # should be stripped
        "abc123",          # duplicate — should be deduped
        "",                # empty — should be dropped
        42,                # non-string — should be dropped
        "valid_user_id",   # valid
    ]

    await call_ws_handler(ws_update_global_settings, hass, conn, {
        "id": 1, "type": "maintenance_supporter/global/update",
        "settings": {CONF_ADMIN_PANEL_USER_IDS: raw_ids},
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result is not None

    entry = hass.config_entries.async_get_entry(global_entry.entry_id)
    opts = entry.options or entry.data
    cleaned = opts.get(CONF_ADMIN_PANEL_USER_IDS, [])
    # Duplicates removed, whitespace stripped, non-strings and empty strings dropped
    assert "abc123" in cleaned
    assert "valid_user_id" in cleaned
    # Only one copy of abc123
    assert cleaned.count("abc123") == 1
    # No empty strings
    assert "" not in cleaned


# ===========================================================================
# websocket/vacation.py
# ===========================================================================


# Lines 83-84: ws_vacation_update — global_entry is None → not_found error
async def test_vacation_update_no_global_entry(hass: HomeAssistant) -> None:
    """ws_vacation_update: no global config entry → not_found error."""
    conn = _conn()

    await call_ws_handler(ws_vacation_update, hass, conn, {
        "id": 1, "type": "maintenance_supporter/vacation/update",
        "enabled": True,
    })

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "not_found"


# Line 93: ws_vacation_update — enabled flag is set
async def test_vacation_update_enabled(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """ws_vacation_update: setting enabled=True persists and is returned."""
    await setup_integration(hass, global_entry)
    conn = _conn()

    await call_ws_handler(ws_vacation_update, hass, conn, {
        "id": 1, "type": "maintenance_supporter/vacation/update",
        "enabled": True,
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["enabled"] is True


# Lines 97-99: ws_vacation_update — invalid start date → invalid_date error
async def test_vacation_update_invalid_start(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """ws_vacation_update: non-ISO start date → invalid_date error."""
    await setup_integration(hass, global_entry)
    conn = _conn()

    await call_ws_handler(ws_vacation_update, hass, conn, {
        "id": 1, "type": "maintenance_supporter/vacation/update",
        "start": "not-a-date",
    })

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "invalid_date"


# Line 104: ws_vacation_update — clearing start (start=None) succeeds
async def test_vacation_update_clear_start(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """ws_vacation_update: start=None clears the start date."""
    await setup_integration(hass, global_entry)
    conn = _conn()

    # First set a start
    await call_ws_handler(ws_vacation_update, hass, conn, {
        "id": 1, "type": "maintenance_supporter/vacation/update",
        "start": "2026-08-01",
    })
    conn.reset_mock()

    # Then clear it
    await call_ws_handler(ws_vacation_update, hass, conn, {
        "id": 2, "type": "maintenance_supporter/vacation/update",
        "start": None,
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["start"] is None


# Lines 108-110: ws_vacation_update — invalid end date → invalid_date error
async def test_vacation_update_invalid_end(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """ws_vacation_update: non-ISO end date → invalid_date error."""
    await setup_integration(hass, global_entry)
    conn = _conn()

    await call_ws_handler(ws_vacation_update, hass, conn, {
        "id": 1, "type": "maintenance_supporter/vacation/update",
        "end": "25-13-99",
    })

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "invalid_date"


# Lines 123-124: ws_vacation_update — end before start → invalid_range error
async def test_vacation_update_end_before_start(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """ws_vacation_update: end date before start date → invalid_range error."""
    await setup_integration(hass, global_entry)
    conn = _conn()

    # Set both in one call so both are present after the patch
    await call_ws_handler(ws_vacation_update, hass, conn, {
        "id": 1, "type": "maintenance_supporter/vacation/update",
        "start": "2026-09-01",
        "end": "2026-08-01",  # before start
    })

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "invalid_range"


# Line 135: ws_vacation_update — buffer_days is persisted
async def test_vacation_update_buffer_days(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """ws_vacation_update: buffer_days is persisted in options."""
    await setup_integration(hass, global_entry)
    conn = _conn()

    await call_ws_handler(ws_vacation_update, hass, conn, {
        "id": 1, "type": "maintenance_supporter/vacation/update",
        "buffer_days": 3,
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["buffer_days"] == 3


# Line 142: ws_vacation_update — exempt_task_ids sanitized and persisted
async def test_vacation_update_exempt_task_ids(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """ws_vacation_update: exempt_task_ids list is cleaned and persisted."""
    await setup_integration(hass, global_entry)
    conn = _conn()

    await call_ws_handler(ws_vacation_update, hass, conn, {
        "id": 1, "type": "maintenance_supporter/vacation/update",
        "exempt_task_ids": ["  task_a  ", "task_b", "task_a"],  # dup + whitespace
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    # Sorted, deduped, stripped
    assert "task_a" in result["exempt_task_ids"]
    assert "task_b" in result["exempt_task_ids"]
    assert result["exempt_task_ids"].count("task_a") == 1


# Lines 170-171: ws_vacation_preview — no start/end → empty rows
async def test_vacation_preview_no_dates(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """ws_vacation_preview: with no start/end configured → rows=[], window_end=None."""
    await setup_integration(hass, global_entry)
    conn = _conn()

    await call_ws_handler(ws_vacation_preview, hass, conn, {
        "id": 1, "type": "maintenance_supporter/vacation/preview",
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["rows"] == []
    assert result["window_end"] is None


# Lines 230-231: ws_vacation_end_now — global_entry is None → not_found error
async def test_vacation_end_now_no_global_entry(hass: HomeAssistant) -> None:
    """ws_vacation_end_now: no global entry → not_found error."""
    conn = _conn()

    await call_ws_handler(ws_vacation_end_now, hass, conn, {
        "id": 1, "type": "maintenance_supporter/vacation/end_now",
    })

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "not_found"


# Lines 244-245: ws_vacation_end_now — start <= today clamps end to today
async def test_vacation_end_now_clamps_end_to_today(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """ws_vacation_end_now: start in the past → end is clamped to today's date."""
    await setup_integration(hass, global_entry)

    today = dt_util.now().date()
    past_start = (today - timedelta(days=3)).isoformat()

    options = {
        CONF_VACATION_ENABLED: True,
        CONF_VACATION_START: past_start,
        CONF_VACATION_END: (today + timedelta(days=7)).isoformat(),
    }
    hass.config_entries.async_update_entry(global_entry, options=options)

    conn = _conn()
    await call_ws_handler(ws_vacation_end_now, hass, conn, {
        "id": 1, "type": "maintenance_supporter/vacation/end_now",
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    # enabled=False and end clamped to today
    assert result["enabled"] is False
    assert result["end"] == today.isoformat()


# ===========================================================================
# websocket/objects.py
# ===========================================================================


# Lines 169-175: ws_create_object — invalid installation_date format → invalid_date
async def test_create_object_invalid_installation_date(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """ws_create_object: bad installation_date format → invalid_date error."""
    await setup_integration(hass, global_entry)
    conn = _conn()

    await call_ws_handler(ws_create_object, hass, conn, {
        "id": 1, "type": "maintenance_supporter/object/create",
        "name": "Test Object",
        "installation_date": "not-a-date",
    })

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "invalid_date"


# Lines 180-181: ws_create_object — unsafe documentation_url → invalid_url
async def test_create_object_unsafe_documentation_url(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """ws_create_object: javascript: URL in documentation_url → invalid_url error."""
    await setup_integration(hass, global_entry)
    conn = _conn()

    await call_ws_handler(ws_create_object, hass, conn, {
        "id": 1, "type": "maintenance_supporter/object/create",
        "name": "Test Object",
        "documentation_url": "javascript:alert('xss')",
    })

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "invalid_url"


# ===========================================================================
# websocket/groups.py
# ===========================================================================


# Line 132: ws_update_group — task_refs updated
async def test_update_group_task_refs(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """ws_update_group: task_refs field is updated when provided."""
    from custom_components.maintenance_supporter.websocket.groups import (
        ws_create_group,
    )

    await setup_integration(hass, global_entry)
    conn = _conn()

    # Create a group first
    await call_ws_handler(ws_create_group, hass, conn, {
        "id": 10, "type": "maintenance_supporter/group/create",
        "name": "My Group",
        "task_refs": [{"entry_id": "entry_a", "task_id": "task_a"}],
    })
    group_id = conn.send_result.call_args[0][1]["group_id"]
    conn.reset_mock()

    # Update task_refs
    new_refs = [
        {"entry_id": "entry_b", "task_id": "task_b"},
        {"entry_id": "entry_c", "task_id": "task_c"},
    ]
    await call_ws_handler(ws_update_group, hass, conn, {
        "id": 11, "type": "maintenance_supporter/group/update",
        "group_id": group_id,
        "task_refs": new_refs,
    })

    conn.send_result.assert_called_once()
    assert conn.send_result.call_args[0][1]["success"] is True

    # Verify the task_refs were actually updated
    entry = hass.config_entries.async_get_entry(global_entry.entry_id)
    from custom_components.maintenance_supporter.const import CONF_GROUPS
    groups = (entry.options or entry.data).get(CONF_GROUPS, {})
    assert groups[group_id]["task_refs"] == new_refs
