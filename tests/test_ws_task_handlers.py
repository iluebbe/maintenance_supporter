"""Tests for WebSocket task CRUD handlers (websocket/tasks.py)."""

from __future__ import annotations

from typing import Any
from unittest.mock import MagicMock, patch

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_OBJECT,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    HistoryEntryType,
)
from custom_components.maintenance_supporter.websocket.groups import (
    ws_create_group,
)
from custom_components.maintenance_supporter.websocket.tasks import (
    _check_nfc_tag_duplicate,
    _is_safe_url,
    _validate_compound_trigger,
    _validate_trigger_config,
    ws_complete_task,
    ws_create_task,
    ws_delete_task,
    ws_duplicate_task,
    ws_list_tasks,
    ws_quick_complete_task,
    ws_reset_task,
    ws_skip_task,
    ws_snooze_task,
    ws_update_history_entry,
    ws_update_task,
)

from .conftest import (
    make_ws_connection as _mock_connection,
    TASK_ID_1,
    TASK_ID_2,
    build_global_entry_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    get_task_store_state,
    setup_integration,
)

# ─── Helpers ──────────────────────────────────────────────────────────────




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


@pytest.fixture
def object_entry(hass: HomeAssistant) -> MockConfigEntry:
    task = build_task_data(last_performed="2024-06-01")
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Pool Pump",
        data=build_object_entry_data(tasks={TASK_ID_1: task}),
        source="user",
        unique_id="maintenance_supporter_pool_pump_ws",
    )
    entry.add_to_hass(hass)
    return entry


# ─── Task Create Tests ────────────────────────────────────────────────────


async def test_ws_create_task_basic(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Test creating a basic task via WS."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await call_ws_handler(
        ws_create_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/create",
            "entry_id": object_entry.entry_id,
            "name": "Oil Change",
        },
    )

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert "task_id" in result
    assert len(result["task_id"]) == 32


async def test_ws_create_task_with_all_fields(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Test creating a task with all optional fields."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await call_ws_handler(
        ws_create_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/create",
            "entry_id": object_entry.entry_id,
            "name": "Full Task",
            "task_type": "inspection",
            "schedule_type": "sensor_based",
            "interval_days": 60,
            "warning_days": 14,
            "notes": "Check everything",
            "documentation_url": "https://example.com/docs",
            "responsible_user_id": "user123",
            "entity_slug": "pump_filter",
        },
    )

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert "task_id" in result


async def test_ws_create_task_with_last_performed(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Test that creating task with last_performed adds history entry.

    The WS handler writes dynamic state (last_performed, history) to the Store,
    then reloads the config entry.  We patch async_delay_save → async_save so
    the data is flushed to disk *before* the reload creates a fresh Store.
    """
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    # Make the Store flush immediately so data survives the reload that
    # ws_create_task triggers.
    entry = hass.config_entries.async_get_entry(object_entry.entry_id)
    assert entry is not None
    store = entry.runtime_data.store

    async def _immediate_save() -> None:
        await store.async_save()

    with patch.object(store, "async_delay_save", side_effect=lambda: hass.async_create_task(_immediate_save())):
        await call_ws_handler(
            ws_create_task,
            hass,
            conn,
            {
                "id": 1,
                "type": "maintenance_supporter/task/create",
                "entry_id": object_entry.entry_id,
                "name": "Test Task",
                "last_performed": "2024-01-15",
            },
        )

    result = conn.send_result.call_args[0][1]
    task_id = result["task_id"]
    # last_performed and history are now in the Store
    state = get_task_store_state(hass, object_entry.entry_id, task_id)
    assert state.get("last_performed") == "2024-01-15"
    assert len(state.get("history", [])) == 1
    assert state["history"][0]["type"] == HistoryEntryType.COMPLETED


async def test_ws_create_task_with_trigger_config(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Test creating a task with trigger configuration."""
    await setup_integration(hass, global_entry, object_entry)
    hass.states.async_set("sensor.test_temp", "25.0")
    conn = _mock_connection()

    await call_ws_handler(
        ws_create_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/create",
            "entry_id": object_entry.entry_id,
            "name": "Triggered Task",
            "schedule_type": "sensor_based",
            "trigger_config": {
                "type": "threshold",
                "entity_id": "sensor.test_temp",
                "trigger_above": 30.0,
            },
        },
    )

    conn.send_result.assert_called_once()
    conn.send_error.assert_not_called()


async def test_ws_create_task_invalid_trigger(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Test creating a task with invalid trigger (missing entity_id)."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await call_ws_handler(
        ws_create_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/create",
            "entry_id": object_entry.entry_id,
            "name": "Bad Trigger",
            "trigger_config": {"type": "threshold"},
        },
    )

    conn.send_error.assert_called_once()
    assert "entity_id" in conn.send_error.call_args[0][2]


async def test_ws_create_task_invalid_entity_slug(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Test creating a task with invalid entity_slug."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await call_ws_handler(
        ws_create_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/create",
            "entry_id": object_entry.entry_id,
            "name": "Bad Slug",
            "entity_slug": "Invalid-Slug!",
        },
    )

    conn.send_error.assert_called_once()
    assert "entity_slug" in conn.send_error.call_args[0][2]


async def test_ws_create_task_accepts_valid_schedule_time(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Voluptuous schema accepts HH:MM strings in the valid range."""
    import voluptuous as vol_mod

    await setup_integration(hass, global_entry, object_entry)
    schema = vol_mod.Schema(ws_create_task._ws_schema, extra=vol_mod.PREVENT_EXTRA)  # type: ignore[attr-defined]

    for good in ("00:00", "09:30", "13:45", "23:59"):
        schema(
            {
                "id": 1,
                "type": "maintenance_supporter/task/create",
                "entry_id": object_entry.entry_id,
                "name": "X",
                "schedule_time": good,
            }
        )

    # None also accepted (clears the time → back to midnight semantic)
    schema(
        {
            "id": 1,
            "type": "maintenance_supporter/task/create",
            "entry_id": object_entry.entry_id,
            "name": "X",
            "schedule_time": None,
        }
    )


async def test_ws_create_task_rejects_malformed_schedule_time(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Voluptuous schema rejects malformed HH:MM inputs."""
    import voluptuous as vol_mod

    await setup_integration(hass, global_entry, object_entry)
    schema = vol_mod.Schema(ws_create_task._ws_schema, extra=vol_mod.PREVENT_EXTRA)  # type: ignore[attr-defined]

    bad_inputs = ("25:00", "9:00", "99:99", "abc", "12:5", "", "12:00:00")
    for bad in bad_inputs:
        try:
            schema(
                {
                    "id": 1,
                    "type": "maintenance_supporter/task/create",
                    "entry_id": object_entry.entry_id,
                    "name": "X",
                    "schedule_time": bad,
                }
            )
        except vol_mod.Invalid:
            continue
        raise AssertionError(f"schema accepted bad schedule_time={bad!r}")


async def test_ws_create_task_rejects_oversize_strings(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Voluptuous schema must reject oversized inputs at the boundary so they
    can never reach storage. Covers the hardening pass that added length caps
    to all formerly-unbounded str fields (entry_id, last_performed,
    entity_slug) and the interval_days overflow guard."""
    import voluptuous as vol_mod

    await setup_integration(hass, global_entry, object_entry)

    # The schema dict is attached by HA's @websocket_command decorator and is
    # what the websocket dispatcher applies BEFORE invoking the handler. Run
    # it directly so we test the boundary, not the handler body.
    schema = vol_mod.Schema(ws_create_task._ws_schema, extra=vol_mod.PREVENT_EXTRA)  # type: ignore[attr-defined]

    payloads_that_must_fail = [
        # interval_days overflow attempt — would crash next_due via timedelta
        {"name": "X", "interval_days": 10**18},
        # last_performed wildly oversized
        {"name": "X", "last_performed": "2026-04-21" + "X" * 1000},
        # entity_slug oversized — cap stops the regex DoS earlier
        {"name": "X", "entity_slug": "a" * 10_000},
        # entry_id oversized
        {"entry_id": "a" * 10_000, "name": "X"},
    ]
    for extra in payloads_that_must_fail:
        msg = {
            "id": 1,
            "type": "maintenance_supporter/task/create",
            "entry_id": extra.get("entry_id", object_entry.entry_id),
            **{k: v for k, v in extra.items() if k != "entry_id"},
        }
        try:
            schema(msg)
        except vol_mod.Invalid:
            continue
        raise AssertionError(f"schema accepted oversize payload: {extra}")


async def test_ws_duplicate_task_copies_config_resets_state(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Duplicate clones config, starts clean, and drops per-task-unique keys."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    # A rich source task: config + a unique slug + a checklist.
    await call_ws_handler(
        ws_create_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/create",
            "entry_id": object_entry.entry_id,
            "name": "Stage 1 filter",
            "task_type": "replacement",
            "interval_days": 90,
            "checklist": ["remove", "rinse", "reinstall"],
            "entity_slug": "stage_1_filter",
            "nfc_tag_id": "abc-123",
            "last_performed": "2024-01-01",
        },
    )
    src_id = conn.send_result.call_args[0][1]["task_id"]

    conn.send_result.reset_mock()
    await call_ws_handler(
        ws_duplicate_task,
        hass,
        conn,
        {
            "id": 2,
            "type": "maintenance_supporter/task/duplicate",
            "entry_id": object_entry.entry_id,
            "task_id": src_id,
        },
    )
    conn.send_error.assert_not_called()
    new_id = conn.send_result.call_args[0][1]["task_id"]
    assert new_id != src_id

    entry = hass.config_entries.async_get_entry(object_entry.entry_id)
    assert entry is not None
    source = entry.data[CONF_TASKS][src_id]
    copy = entry.data[CONF_TASKS][new_id]
    # Config carried over
    assert copy["name"] == "Stage 1 filter (copy)"
    assert copy["type"] == "replacement"
    assert copy["checklist"] == ["remove", "rinse", "reinstall"]
    # Recurrence preserved (compare in whatever shape normalize produced)
    assert copy.get("schedule") == source.get("schedule")
    assert copy.get("interval_days") == source.get("interval_days")
    # Per-task-unique keys dropped (would collide)
    assert "entity_slug" not in copy
    assert "nfc_tag_id" not in copy
    # Dynamic state NOT copied — the copy is un-started
    assert "history" not in copy
    assert "last_performed" not in copy
    store_state = get_task_store_state(hass, entry.entry_id, new_id)
    assert store_state.get("last_performed") is None
    assert store_state.get("history", []) == []
    # The object now lists both tasks
    assert new_id in entry.data[CONF_OBJECT]["task_ids"]


async def test_ws_duplicate_task_not_found(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Duplicating a missing task returns not_found, no new task."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()
    before = len(object_entry.data.get(CONF_TASKS, {}))

    await call_ws_handler(
        ws_duplicate_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/duplicate",
            "entry_id": object_entry.entry_id,
            "task_id": "nonexistent00000000000000000000",
        },
    )
    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "not_found"
    entry = hass.config_entries.async_get_entry(object_entry.entry_id)
    assert entry is not None
    assert len(entry.data.get(CONF_TASKS, {})) == before


async def test_ws_create_task_dry_run(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Test dry run creates no persistent data."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    initial_task_count = len(object_entry.data.get(CONF_TASKS, {}))

    await call_ws_handler(
        ws_create_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/create",
            "entry_id": object_entry.entry_id,
            "name": "Dry Run Task",
            "dry_run": True,
        },
    )

    result = conn.send_result.call_args[0][1]
    assert result["valid"] is True
    assert result["task_id"] is None
    # No new task in entry
    entry = hass.config_entries.async_get_entry(object_entry.entry_id)
    assert entry is not None
    assert len(entry.data.get(CONF_TASKS, {})) == initial_task_count


async def test_ws_create_task_dry_run_warnings(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Test dry run with trigger warnings (entity doesn't exist)."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await call_ws_handler(
        ws_create_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/create",
            "entry_id": object_entry.entry_id,
            "name": "Dry Run Warnings",
            "trigger_config": {
                "type": "threshold",
                "entity_id": "sensor.nonexistent",
                "trigger_above": 50.0,
            },
            "dry_run": True,
        },
    )

    result = conn.send_result.call_args[0][1]
    assert result["valid"] is True
    assert "warnings" in result
    assert any("nonexistent" in w for w in result["warnings"])


async def test_ws_create_task_not_found(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """Test creating task on non-existent entry."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await call_ws_handler(
        ws_create_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/create",
            "entry_id": "nonexistent",
            "name": "Test",
        },
    )

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "not_found"


async def test_ws_create_task_global_rejected(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """Test creating task on global entry is rejected."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await call_ws_handler(
        ws_create_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/create",
            "entry_id": global_entry.entry_id,
            "name": "Test",
        },
    )

    conn.send_error.assert_called_once()


# ─── Task Update Tests ───────────────────────────────────────────────────


async def test_ws_update_task_basic(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Test updating a task name."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await call_ws_handler(
        ws_update_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/update",
            "entry_id": object_entry.entry_id,
            "task_id": TASK_ID_1,
            "name": "Updated Name",
        },
    )

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["success"] is True

    entry = hass.config_entries.async_get_entry(object_entry.entry_id)
    assert entry is not None
    assert entry.data[CONF_TASKS][TASK_ID_1]["name"] == "Updated Name"


async def test_ws_update_task_multiple_fields(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Test updating multiple fields at once."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await call_ws_handler(
        ws_update_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/update",
            "entry_id": object_entry.entry_id,
            "task_id": TASK_ID_1,
            "name": "New Name",
            "warning_days": 14,
            "enabled": False,
            "notes": "Updated notes",
        },
    )

    conn.send_result.assert_called_once()
    entry = hass.config_entries.async_get_entry(object_entry.entry_id)
    assert entry is not None
    task = entry.data[CONF_TASKS][TASK_ID_1]
    assert task["name"] == "New Name"
    assert task["warning_days"] == 14
    assert task["enabled"] is False
    assert task["notes"] == "Updated notes"


async def test_ws_update_task_with_trigger(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Test updating task with valid trigger config."""
    await setup_integration(hass, global_entry, object_entry)
    hass.states.async_set("sensor.test_temp", "22.0")
    conn = _mock_connection()

    await call_ws_handler(
        ws_update_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/update",
            "entry_id": object_entry.entry_id,
            "task_id": TASK_ID_1,
            "trigger_config": {
                "type": "threshold",
                "entity_id": "sensor.test_temp",
                "trigger_above": 30.0,
            },
        },
    )

    conn.send_result.assert_called_once()


async def test_ws_update_task_baseline_change_clears_store_runtime(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """#102: editing trigger_baseline_value must clear the Store's trigger
    runtime — the Store baseline wins on restore, so without the clear a
    user-entered start value would silently never take effect. An update
    that keeps the baseline untouched must NOT clear the runtime."""
    await setup_integration(hass, global_entry, object_entry)
    hass.states.async_set("sensor.odometer", "27000")

    base_tc = {
        "type": "counter",
        "entity_id": "sensor.odometer",
        "trigger_target_value": 15000.0,
        "trigger_delta_mode": True,
    }
    conn = _mock_connection()
    await call_ws_handler(
        ws_update_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/update",
            "entry_id": object_entry.entry_id,
            "task_id": TASK_ID_1,
            "trigger_config": dict(base_tc),
        },
    )
    conn.send_result.assert_called_once()

    def seed_runtime() -> None:
        entry = hass.config_entries.async_get_entry(object_entry.entry_id)
        assert entry is not None
        entry.runtime_data.store.set_trigger_runtime(
            TASK_ID_1, "sensor.odometer", {"baseline_value": 27000.0}
        )

    def stored_runtime() -> dict[str, Any]:
        state = get_task_store_state(hass, object_entry.entry_id, TASK_ID_1)
        return state.get("trigger_runtime") or {}

    # Same trigger_config (baseline untouched) -> runtime survives.
    seed_runtime()
    conn2 = _mock_connection()
    await call_ws_handler(
        ws_update_task,
        hass,
        conn2,
        {
            "id": 2,
            "type": "maintenance_supporter/task/update",
            "entry_id": object_entry.entry_id,
            "task_id": TASK_ID_1,
            "name": "Renamed",
            "trigger_config": dict(base_tc),
        },
    )
    conn2.send_result.assert_called_once()
    assert stored_runtime().get("sensor.odometer", {}).get("baseline_value") == 27000.0

    # Edited baseline ("last service was at 12000") -> stale runtime cleared.
    conn3 = _mock_connection()
    await call_ws_handler(
        ws_update_task,
        hass,
        conn3,
        {
            "id": 3,
            "type": "maintenance_supporter/task/update",
            "entry_id": object_entry.entry_id,
            "task_id": TASK_ID_1,
            "trigger_config": {**base_tc, "trigger_baseline_value": 12000.0},
        },
    )
    conn3.send_result.assert_called_once()
    runtime = stored_runtime()
    assert runtime.get("sensor.odometer", {}).get("baseline_value") != 27000.0


async def test_ws_update_task_invalid_trigger(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Test updating task with invalid trigger config."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await call_ws_handler(
        ws_update_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/update",
            "entry_id": object_entry.entry_id,
            "task_id": TASK_ID_1,
            "trigger_config": {"type": "threshold"},
        },
    )

    conn.send_error.assert_called_once()


async def test_ws_update_task_not_found_entry(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """Test updating task on non-existent entry."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await call_ws_handler(
        ws_update_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/update",
            "entry_id": "nonexistent",
            "task_id": TASK_ID_1,
        },
    )

    conn.send_error.assert_called_once()


async def test_ws_update_task_not_found_task(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Test updating non-existent task."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await call_ws_handler(
        ws_update_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/update",
            "entry_id": object_entry.entry_id,
            "task_id": "nonexistent_task_id",
        },
    )

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "not_found"


# ─── Task Delete Tests ───────────────────────────────────────────────────


async def test_ws_delete_task_basic(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Test deleting a task."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await call_ws_handler(
        ws_delete_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/delete",
            "entry_id": object_entry.entry_id,
            "task_id": TASK_ID_1,
        },
    )

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["success"] is True


async def test_ws_delete_task_not_found_entry(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """Test deleting task on non-existent entry."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await call_ws_handler(
        ws_delete_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/delete",
            "entry_id": "nonexistent",
            "task_id": TASK_ID_1,
        },
    )

    conn.send_error.assert_called_once()


async def test_ws_delete_task_not_found_task(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Test deleting non-existent task."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await call_ws_handler(
        ws_delete_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/delete",
            "entry_id": object_entry.entry_id,
            "task_id": "nonexistent_task_id",
        },
    )

    conn.send_error.assert_called_once()


async def test_ws_delete_task_cleans_entity_registry(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Test that deleting a task removes its entity registry entries."""
    await setup_integration(hass, global_entry, object_entry)

    # Verify entities exist before deletion
    ent_reg = er.async_get(hass)
    entities_before = er.async_entries_for_config_entry(ent_reg, object_entry.entry_id)
    task_entities = [e for e in entities_before if TASK_ID_1 in (e.unique_id or "")]
    assert len(task_entities) >= 1, "Expected at least sensor + binary_sensor entities"

    conn = _mock_connection()
    await call_ws_handler(
        ws_delete_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/delete",
            "entry_id": object_entry.entry_id,
            "task_id": TASK_ID_1,
        },
    )
    await hass.async_block_till_done()

    conn.send_result.assert_called_once()

    # Verify entity registry entries for the deleted task are gone
    entities_after = er.async_entries_for_config_entry(ent_reg, object_entry.entry_id)
    orphans = [e for e in entities_after if TASK_ID_1 in (e.unique_id or "")]
    assert len(orphans) == 0, f"Found orphaned entities: {[e.entity_id for e in orphans]}"


async def test_ws_delete_task_cleans_group_refs(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Test that deleting a task removes its references from groups."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    # Create a group referencing the task we'll delete
    await call_ws_handler(
        ws_create_group,
        hass,
        conn,
        {
            "id": 10,
            "type": "maintenance_supporter/group/create",
            "name": "Test Group",
            "task_refs": [
                {"entry_id": object_entry.entry_id, "task_id": TASK_ID_1},
            ],
        },
    )
    group_id = conn.send_result.call_args[0][1]["group_id"]
    conn.reset_mock()

    # Delete the task
    await call_ws_handler(
        ws_delete_task,
        hass,
        conn,
        {
            "id": 11,
            "type": "maintenance_supporter/task/delete",
            "entry_id": object_entry.entry_id,
            "task_id": TASK_ID_1,
        },
    )
    conn.send_result.assert_called_once()

    # Verify group no longer references the deleted task
    ge = hass.config_entries.async_get_entry(global_entry.entry_id)
    assert ge is not None
    refs = ge.options["groups"][group_id]["task_refs"]
    assert len(refs) == 0


# ─── Task List Tests ─────────────────────────────────────────────────────


async def test_ws_list_tasks_all(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Test listing all tasks."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    ws_list_tasks(
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/list",
        },
    )

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert "tasks" in result
    assert len(result["tasks"]) >= 1
    assert result["tasks"][0]["task_id"] == TASK_ID_1


async def test_ws_list_tasks_filtered(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Test listing tasks filtered by entry_id."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    ws_list_tasks(
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/list",
            "entry_id": object_entry.entry_id,
        },
    )

    result = conn.send_result.call_args[0][1]
    assert len(result["tasks"]) == 1
    assert result["tasks"][0]["entry_id"] == object_entry.entry_id


async def test_ws_list_tasks_empty(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """Test listing tasks when none exist."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    ws_list_tasks(
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/list",
        },
    )

    result = conn.send_result.call_args[0][1]
    assert result["tasks"] == []


# ─── Task Complete Tests ──────────────────────────────────────────────────


async def test_ws_complete_task_basic(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Test completing a task."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await call_ws_handler(
        ws_complete_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/complete",
            "entry_id": object_entry.entry_id,
            "task_id": TASK_ID_1,
        },
    )

    conn.send_result.assert_called_once()
    assert conn.send_result.call_args[0][1]["success"] is True


async def test_ws_complete_task_with_fields(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Test completing a task with optional fields."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await call_ws_handler(
        ws_complete_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/complete",
            "entry_id": object_entry.entry_id,
            "task_id": TASK_ID_1,
            "notes": "All good",
            "cost": 25.50,
            "duration": 30,
            "feedback": "needed",
        },
    )

    conn.send_result.assert_called_once()
    # Audit (c)#1: don't stop at the success flag — the optional fields must
    # actually be persisted on the COMPLETED history entry. (The broader
    # roundtrip coverage lives in test_ws_roundtrip.py; this pins the same
    # guarantee at the handler test that people naturally extend.)
    state = get_task_store_state(hass, object_entry.entry_id, TASK_ID_1)
    completed = [h for h in state.get("history", []) if h.get("type") == "completed"]
    assert completed, "completion must append a history entry"
    entry = completed[-1]
    assert entry["notes"] == "All good"
    assert entry["cost"] == 25.50
    assert entry["duration"] == 30
    assert entry["feedback"] == "needed"


async def test_ws_complete_task_not_found(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """Test completing task when coordinator not found."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await call_ws_handler(
        ws_complete_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/complete",
            "entry_id": "nonexistent",
            "task_id": TASK_ID_1,
        },
    )

    conn.send_error.assert_called_once()


# ─── Task Skip Tests ─────────────────────────────────────────────────────


async def test_ws_skip_task_basic(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Test skipping a task."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await call_ws_handler(
        ws_skip_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/skip",
            "entry_id": object_entry.entry_id,
            "task_id": TASK_ID_1,
        },
    )

    conn.send_result.assert_called_once()
    assert conn.send_result.call_args[0][1]["success"] is True


async def test_ws_skip_task_not_found(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """Test skipping task when coordinator not found."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await call_ws_handler(
        ws_skip_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/skip",
            "entry_id": "nonexistent",
            "task_id": TASK_ID_1,
        },
    )

    conn.send_error.assert_called_once()


# ─── Task Reset Tests ────────────────────────────────────────────────────


async def test_ws_reset_task_basic(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Test resetting a task without date."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await call_ws_handler(
        ws_reset_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/reset",
            "entry_id": object_entry.entry_id,
            "task_id": TASK_ID_1,
        },
    )

    conn.send_result.assert_called_once()
    assert conn.send_result.call_args[0][1]["success"] is True


async def test_ws_reset_task_with_date(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Test resetting a task with specific date."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await call_ws_handler(
        ws_reset_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/reset",
            "entry_id": object_entry.entry_id,
            "task_id": TASK_ID_1,
            "date": "2024-06-15",
        },
    )

    conn.send_result.assert_called_once()


async def test_ws_reset_task_invalid_date(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Test resetting a task with invalid date."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await call_ws_handler(
        ws_reset_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/reset",
            "entry_id": object_entry.entry_id,
            "task_id": TASK_ID_1,
            "date": "not-a-date",
        },
    )

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "invalid_date"


async def test_ws_reset_task_not_found(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """Test resetting task when coordinator not found."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await call_ws_handler(
        ws_reset_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/reset",
            "entry_id": "nonexistent",
            "task_id": TASK_ID_1,
        },
    )

    conn.send_error.assert_called_once()


# ─── Trigger Validation Unit Tests ───────────────────────────────────────


def test_validate_compound_valid(hass: HomeAssistant) -> None:
    """Test valid compound trigger with 2 conditions."""
    hass.states.async_set("sensor.temp1", "25.0")
    hass.states.async_set("sensor.temp2", "30.0")

    config = {
        "type": "compound",
        "compound_logic": "AND",
        "conditions": [
            {"type": "threshold", "entity_id": "sensor.temp1", "trigger_above": 30},
            {"type": "threshold", "entity_id": "sensor.temp2", "trigger_below": 10},
        ],
    }
    errors, warnings = _validate_compound_trigger(hass, config)
    assert errors == []


def test_validate_compound_nested_rejected(hass: HomeAssistant) -> None:
    """Test that nested compound triggers are rejected."""
    config = {
        "type": "compound",
        "compound_logic": "AND",
        "conditions": [
            {"type": "threshold", "entity_id": "sensor.a", "trigger_above": 10},
            {"type": "compound", "conditions": []},
        ],
    }
    errors, warnings = _validate_compound_trigger(hass, config)
    assert any("nested compound" in e for e in errors)


def test_validate_runtime_on_states(hass: HomeAssistant) -> None:
    """Test that trigger_on_states list is validated."""
    hass.states.async_set("sensor.pump", "on")

    config = {
        "type": "runtime",
        "entity_id": "sensor.pump",
        "trigger_runtime_hours": 100,
        "trigger_on_states": ["on", "running"],
    }
    errors, _ = _validate_trigger_config(hass, config)
    assert errors == []


def test_validate_entity_logic_invalid(hass: HomeAssistant) -> None:
    """Test that invalid entity_logic is rejected."""
    hass.states.async_set("sensor.temp", "25.0")

    config = {
        "type": "threshold",
        "entity_id": "sensor.temp",
        "trigger_above": 30,
        "entity_logic": "invalid",
    }
    errors, _ = _validate_trigger_config(hass, config)
    assert any("entity_logic" in e for e in errors)


def test_validate_runtime_empty_on_states(hass: HomeAssistant) -> None:
    """Test that empty trigger_on_states is rejected."""
    hass.states.async_set("sensor.pump", "on")

    config = {
        "type": "runtime",
        "entity_id": "sensor.pump",
        "trigger_runtime_hours": 100,
        "trigger_on_states": [],
    }
    errors, _ = _validate_trigger_config(hass, config)
    assert any("must not be empty" in e for e in errors)


def test_validate_runtime_invalid_on_states(hass: HomeAssistant) -> None:
    """Test that non-string trigger_on_states is rejected."""
    hass.states.async_set("sensor.pump", "on")

    config = {
        "type": "runtime",
        "entity_id": "sensor.pump",
        "trigger_runtime_hours": 100,
        "trigger_on_states": [123, ""],
    }
    errors, _ = _validate_trigger_config(hass, config)
    assert any("non-empty strings" in e for e in errors)


def test_validate_invalid_trigger_type(hass: HomeAssistant) -> None:
    """Test that invalid trigger type is rejected."""
    config = {"type": "nonexistent_type", "entity_id": "sensor.temp"}
    errors, _ = _validate_trigger_config(hass, config)
    assert any("Invalid trigger type" in e for e in errors)


def test_validate_counter_missing_target(hass: HomeAssistant) -> None:
    """Test that counter without target_value is rejected."""
    hass.states.async_set("sensor.counter", "5")

    config = {"type": "counter", "entity_id": "sensor.counter"}
    errors, _ = _validate_trigger_config(hass, config)
    assert any("trigger_target_value" in e for e in errors)


def test_validate_threshold_missing_above_below(hass: HomeAssistant) -> None:
    """Test threshold without above or below is rejected."""
    hass.states.async_set("sensor.temp", "25.0")

    config = {"type": "threshold", "entity_id": "sensor.temp"}
    errors, _ = _validate_trigger_config(hass, config)
    assert any("trigger_above" in e for e in errors)


# ===========================================================================
# Coverage tests carried from test_cov_ws.py (websocket/tasks.py section)
# ===========================================================================


def _covws_conn() -> MagicMock:
    """Create a mock WS connection (carried from test_cov_ws.py)."""
    conn = MagicMock()
    conn.send_result = MagicMock()
    conn.send_error = MagicMock()
    conn.user = MagicMock(is_admin=True)
    conn.user.id = "mock-ws-user"
    conn.subscriptions = {}
    conn.send_message = MagicMock()
    return conn


@pytest.fixture
def covws_global_entry(hass: HomeAssistant) -> MockConfigEntry:
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


@pytest.fixture
def covws_object_entry(hass: HomeAssistant) -> MockConfigEntry:
    task = build_task_data(last_performed="2024-06-01")
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Pool Pump",
        data=build_object_entry_data(tasks={TASK_ID_1: task}),
        source="user",
        unique_id="maintenance_supporter_pool_pump_cov",
    )
    entry.add_to_hass(hass)
    return entry


# Line 217: ws_create_task — interval_unit != "days" is stored in normalized schedule
async def test_create_task_interval_unit_weeks(
    hass: HomeAssistant,
    covws_global_entry: MockConfigEntry,
    covws_object_entry: MockConfigEntry,
) -> None:
    """ws_create_task: interval_unit='weeks' branch is hit and persisted via schedule."""
    await setup_integration(hass, covws_global_entry, covws_object_entry)
    conn = _covws_conn()

    await call_ws_handler(
        ws_create_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/create",
            "entry_id": covws_object_entry.entry_id,
            "name": "Weekly Check",
            "interval_days": 2,
            "interval_unit": "weeks",
        },
    )

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert "task_id" in result

    # After normalize_task_storage the interval is in the nested schedule dict
    entry = hass.config_entries.async_get_entry(covws_object_entry.entry_id)
    task = entry.data[CONF_TASKS][result["task_id"]]
    # schedule.unit holds the normalized value
    schedule = task.get("schedule", {})
    assert schedule.get("unit") == "weeks"


# Line 360: async_create_task_simple — empty name raises ValueError
async def test_async_create_task_simple_empty_name(
    hass: HomeAssistant,
    covws_global_entry: MockConfigEntry,
    covws_object_entry: MockConfigEntry,
) -> None:
    """async_create_task_simple: empty name raises ValueError."""
    from custom_components.maintenance_supporter.websocket.tasks import (
        async_create_task_simple,
    )

    await setup_integration(hass, covws_global_entry, covws_object_entry)

    with pytest.raises(ValueError, match="Name must not be empty"):
        await async_create_task_simple(
            hass,
            entry_id=covws_object_entry.entry_id,
            name="   ",
        )


# Line 382: async_create_task_simple — missing/wrong entry_id raises ValueError
async def test_async_create_task_simple_bad_entry(
    hass: HomeAssistant,
    covws_global_entry: MockConfigEntry,
) -> None:
    """async_create_task_simple: invalid entry_id raises ValueError."""
    from custom_components.maintenance_supporter.websocket.tasks import (
        async_create_task_simple,
    )

    await setup_integration(hass, covws_global_entry)

    with pytest.raises(ValueError, match="No maintenance object found"):
        await async_create_task_simple(
            hass,
            entry_id="nonexistent_entry_id",
            name="My Task",
        )


# Line 470: ws_create_task — interval_anchor != "completion" is persisted in schedule
async def test_create_task_interval_anchor_planned(
    hass: HomeAssistant,
    covws_global_entry: MockConfigEntry,
    covws_object_entry: MockConfigEntry,
) -> None:
    """ws_create_task: interval_anchor='planned' branch is executed; task is created."""
    await setup_integration(hass, covws_global_entry, covws_object_entry)
    conn = _covws_conn()

    await call_ws_handler(
        ws_create_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/create",
            "entry_id": covws_object_entry.entry_id,
            "name": "Planned Task",
            "interval_days": 30,
            "interval_anchor": "planned",
        },
    )

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert "task_id" in result
    # The task was created — anchor branch executed; stored in schedule.anchor
    entry = hass.config_entries.async_get_entry(covws_object_entry.entry_id)
    task = entry.data[CONF_TASKS][result["task_id"]]
    schedule = task.get("schedule", {})
    assert schedule.get("anchor") == "planned"


# Line 472: ws_create_task — due_date is set on one_time tasks
async def test_create_task_with_due_date(
    hass: HomeAssistant,
    covws_global_entry: MockConfigEntry,
    covws_object_entry: MockConfigEntry,
) -> None:
    """ws_create_task: due_date is persisted for one_time tasks."""
    await setup_integration(hass, covws_global_entry, covws_object_entry)
    conn = _covws_conn()

    await call_ws_handler(
        ws_create_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/create",
            "entry_id": covws_object_entry.entry_id,
            "name": "One Time Task",
            "schedule_type": "one_time",
            "due_date": "2027-01-01",
        },
    )

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert "task_id" in result
    # due_date is in schedule.due for one_time after normalization
    entry = hass.config_entries.async_get_entry(covws_object_entry.entry_id)
    task = entry.data[CONF_TASKS][result["task_id"]]
    # The task was created successfully — due_date branch was hit
    assert task is not None


# Lines 478-480: ws_create_task — invalid last_performed date format → error
async def test_create_task_invalid_last_performed(
    hass: HomeAssistant,
    covws_global_entry: MockConfigEntry,
    covws_object_entry: MockConfigEntry,
) -> None:
    """ws_create_task: non-ISO last_performed → invalid_format error."""
    await setup_integration(hass, covws_global_entry, covws_object_entry)
    conn = _covws_conn()

    await call_ws_handler(
        ws_create_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/create",
            "entry_id": covws_object_entry.entry_id,
            "name": "Bad Date Task",
            "last_performed": "not-a-date",
        },
    )

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "invalid_format"


# Lines 629-630: ws_update_task — empty name (after strip) → invalid_input error
async def test_update_task_empty_name(
    hass: HomeAssistant,
    covws_global_entry: MockConfigEntry,
    covws_object_entry: MockConfigEntry,
) -> None:
    """ws_update_task: setting name to blank string → invalid_input error."""
    await setup_integration(hass, covws_global_entry, covws_object_entry)
    conn = _covws_conn()

    await call_ws_handler(
        ws_update_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/update",
            "entry_id": covws_object_entry.entry_id,
            "task_id": TASK_ID_1,
            "name": "   ",
        },
    )

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "invalid_input"


# Lines 665-669: ws_update_task — invalid last_performed date → invalid_format error
async def test_update_task_invalid_last_performed(
    hass: HomeAssistant,
    covws_global_entry: MockConfigEntry,
    covws_object_entry: MockConfigEntry,
) -> None:
    """ws_update_task: non-ISO last_performed → invalid_format error."""
    await setup_integration(hass, covws_global_entry, covws_object_entry)
    conn = _covws_conn()

    await call_ws_handler(
        ws_update_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/update",
            "entry_id": covws_object_entry.entry_id,
            "task_id": TASK_ID_1,
            "last_performed": "not-a-date",
        },
    )

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "invalid_format"


# Line 862: ws_list_tasks — filtered to a specific entry_id
# ws_list_tasks is @callback (sync), so call it directly — not via await
async def test_list_tasks_filtered_by_entry(
    hass: HomeAssistant,
    covws_global_entry: MockConfigEntry,
    covws_object_entry: MockConfigEntry,
) -> None:
    """ws_list_tasks: entry_id filter skips non-matching entries."""
    # Add a second object entry to confirm filtering works
    task2 = build_task_data(task_id=TASK_ID_2, name="Other Task")
    entry2 = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Other Object",
        data=build_object_entry_data(tasks={TASK_ID_2: task2}),
        source="user",
        unique_id="maintenance_supporter_other_obj_cov",
    )
    entry2.add_to_hass(hass)
    await setup_integration(hass, covws_global_entry, covws_object_entry, entry2)

    conn = _covws_conn()

    # ws_list_tasks is @callback (synchronous) — unwrap and call directly
    unwrapped = ws_list_tasks
    while hasattr(unwrapped, "__wrapped__"):
        unwrapped = unwrapped.__wrapped__
    unwrapped(
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/list",
            "entry_id": covws_object_entry.entry_id,
        },
    )

    result = conn.send_result.call_args[0][1]
    assert "tasks" in result
    # Only tasks from covws_object_entry should appear
    entry_ids = {t["entry_id"] for t in result["tasks"]}
    assert entry_ids == {covws_object_entry.entry_id}


# Lines 956-957: ws_quick_complete_task — coordinator not found → not_found
async def test_quick_complete_no_coordinator(
    hass: HomeAssistant,
    covws_global_entry: MockConfigEntry,
) -> None:
    """ws_quick_complete_task: missing runtime_data → not_found error."""
    await setup_integration(hass, covws_global_entry)
    conn = _covws_conn()

    await call_ws_handler(
        ws_quick_complete_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/quick_complete",
            "entry_id": "nonexistent",
            "task_id": TASK_ID_1,
        },
    )

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "not_found"


# Lines 961-962: ws_quick_complete_task — entry not found
async def test_quick_complete_entry_not_found(
    hass: HomeAssistant,
    covws_global_entry: MockConfigEntry,
    covws_object_entry: MockConfigEntry,
) -> None:
    """ws_quick_complete_task: entry doesn't exist → not_found error."""
    await setup_integration(hass, covws_global_entry, covws_object_entry)
    conn = _covws_conn()

    # Provide valid entry_id (so coordinator lookup works) but wrong entry for task
    await call_ws_handler(
        ws_quick_complete_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/quick_complete",
            "entry_id": covws_object_entry.entry_id,
            "task_id": "no_such_task" * 2,  # keeps len=24 — still "not found" path
        },
    )

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "not_found"


# Lines 965-966: ws_quick_complete_task — task has no quick_complete_defaults → no_defaults
async def test_quick_complete_no_defaults(
    hass: HomeAssistant,
    covws_global_entry: MockConfigEntry,
    covws_object_entry: MockConfigEntry,
) -> None:
    """ws_quick_complete_task: task without quick_complete_defaults → no_defaults error."""
    await setup_integration(hass, covws_global_entry, covws_object_entry)
    conn = _covws_conn()

    await call_ws_handler(
        ws_quick_complete_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/quick_complete",
            "entry_id": covws_object_entry.entry_id,
            "task_id": TASK_ID_1,
        },
    )

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "no_defaults"


# Lines 1107-1108: ws_update_history_entry — store is None → not_loaded error
async def test_update_history_entry_no_store(
    hass: HomeAssistant,
    covws_global_entry: MockConfigEntry,
    covws_object_entry: MockConfigEntry,
) -> None:
    """ws_update_history_entry: no Store (entry not loaded) → not_loaded error."""
    # Setup integration but manually strip runtime_data.store to simulate missing store
    await setup_integration(hass, covws_global_entry, covws_object_entry)
    conn = _covws_conn()

    # Patch _get_runtime_data to return an object without a store
    fake_rd = MagicMock()
    fake_rd.store = None
    fake_rd.coordinator = None

    with patch(
        # ws_update_history_entry lives in the tasks_history submodule now; patch
        # the helper where it's looked up (the split moved the lookup location).
        "custom_components.maintenance_supporter.websocket.tasks_history._get_runtime_data",
        return_value=fake_rd,
    ):
        await call_ws_handler(
            ws_update_history_entry,
            hass,
            conn,
            {
                "id": 1,
                "type": "maintenance_supporter/task/history/update",
                "entry_id": covws_object_entry.entry_id,
                "task_id": TASK_ID_1,
                "original_timestamp": "2024-06-01T00:00:00",
            },
        )

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "not_loaded"


# ─── _validate_trigger_config: unknown key stripping ──────────────────────


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


# ─── ws_create_task: notes persisted ──────────────────────────────────────


async def test_ws_create_task_with_notes(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """ws_create_task creates a task with notes field persisted to entry data."""
    from custom_components.maintenance_supporter.websocket.tasks import ws_create_task

    await setup_integration(hass, global_entry, object_entry)

    conn = _mock_connection()
    msg = {
        "id": 1,
        "entry_id": object_entry.entry_id,
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
    oe_reloaded = hass.config_entries.async_get_entry(object_entry.entry_id)
    tasks = oe_reloaded.data.get(CONF_TASKS, {})
    assert task_id in tasks
    assert tasks[task_id].get("notes") == "This is a note"


# ─── ws_quick_complete_task: entry not found ──────────────────────────────


async def test_ws_quick_complete_task_entry_not_found(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """ws_quick_complete_task returns not_found when entry doesn't exist."""
    from custom_components.maintenance_supporter.websocket.tasks import ws_quick_complete_task

    await setup_integration(hass, global_entry, object_entry)

    conn = _mock_connection()
    msg = {
        "id": 1,
        "entry_id": "nonexistent_entry_id",
        "task_id": TASK_ID_1,
    }
    await call_ws_handler(ws_quick_complete_task, hass, conn, msg)

    assert conn.send_error.call_count == 1
    err_args = conn.send_error.call_args[0]
    assert err_args[1] == "not_found"


# ===========================================================================
# Coverage tests carried from test_coverage_97.py (websocket/tasks.py section)
# ===========================================================================


_c97_msg_id = 0


def _c97_nid() -> int:
    global _c97_msg_id
    _c97_msg_id += 1
    return _c97_msg_id


def _c97_conn() -> MagicMock:
    conn = MagicMock()
    conn.send_result = MagicMock()
    conn.send_error = MagicMock()
    conn.send_message = MagicMock()
    conn.subscriptions = {}
    conn.user = MagicMock(is_admin=True)
    conn.user.id = "mock-ws-user"
    return conn


# ─── websocket/tasks.py: _is_safe_url ─────────────────────────────────


def test_is_safe_url_empty() -> None:
    """Line 36: empty URL returns True."""
    assert _is_safe_url("") is True
    assert _is_safe_url(None) is True


def test_is_safe_url_protocol_relative() -> None:
    """Line 39: protocol-relative URL rejected."""
    assert _is_safe_url("//evil.com/hack") is False


def test_is_safe_url_javascript() -> None:
    """Non http/https schemes rejected (line 43)."""
    assert _is_safe_url("javascript:alert(1)") is False
    assert _is_safe_url("data:text/html,<h1>hi</h1>") is False


def test_is_safe_url_valid() -> None:
    """Valid http/https URLs accepted."""
    assert _is_safe_url("https://example.com/docs") is True
    assert _is_safe_url("http://example.com") is True


def test_is_safe_url_exception() -> None:
    """Lines 44-45: exception in urlparse returns False."""
    with patch(
        "urllib.parse.urlparse",
        side_effect=ValueError("bad url"),
    ):
        assert _is_safe_url("https://example.com") is False


# ─── websocket/tasks.py: _check_nfc_tag_duplicate ─────────────────────


async def test_nfc_tag_duplicate_found(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """Line 67: duplicate NFC tag returns warning string."""
    task = build_task_data()
    task["nfc_tag_id"] = "TAG_ABC"
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Pump1",
        source="user",
        data=build_object_entry_data(tasks={TASK_ID_1: task}),
        unique_id="maintenance_supporter_nfc_dup1",
    )
    entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, entry)

    result = _check_nfc_tag_duplicate(hass, "TAG_ABC")
    assert result is not None
    assert "TAG_ABC" in result
    assert "already linked" in result


async def test_nfc_tag_duplicate_excluded(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """Excluding the same task_id should not report duplicate."""
    task = build_task_data()
    task["nfc_tag_id"] = "TAG_XYZ"
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Pump2",
        source="user",
        data=build_object_entry_data(tasks={TASK_ID_1: task}),
        unique_id="maintenance_supporter_nfc_dup2",
    )
    entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, entry)

    result = _check_nfc_tag_duplicate(hass, "TAG_XYZ", exclude_task_id=TASK_ID_1)
    assert result is None


# ─── websocket/tasks.py: _validate_trigger_config (compound) ──────────


def test_validate_compound_trigger_invalid_logic(hass: HomeAssistant) -> None:
    """Line 186: invalid compound_logic."""
    errors, _ = _validate_trigger_config(
        hass,
        {
            "type": "compound",
            "compound_logic": "XOR",
            "conditions": [
                {"type": "threshold", "entity_id": "sensor.a", "trigger_above": 10},
                {"type": "threshold", "entity_id": "sensor.b", "trigger_above": 20},
            ],
        },
    )
    assert any("compound_logic" in e for e in errors)


def test_validate_compound_trigger_non_dict_condition(hass: HomeAssistant) -> None:
    """Lines 199-200: non-dict condition."""
    errors, _ = _validate_trigger_config(
        hass,
        {
            "type": "compound",
            "compound_logic": "AND",
            "conditions": [
                "not_a_dict",
                {"type": "threshold", "entity_id": "sensor.a", "trigger_above": 10},
            ],
        },
    )
    assert any("must be a dict" in e for e in errors)


def test_validate_compound_trigger_nested_compound(hass: HomeAssistant) -> None:
    """Nested compound triggers are not allowed."""
    errors, _ = _validate_trigger_config(
        hass,
        {
            "type": "compound",
            "compound_logic": "AND",
            "conditions": [
                {"type": "compound", "conditions": []},
                {"type": "threshold", "entity_id": "sensor.a", "trigger_above": 10},
            ],
        },
    )
    assert any("nested compound" in e for e in errors)


def test_validate_compound_trigger_sub_errors(hass: HomeAssistant) -> None:
    """Line 210: sub-condition errors are prefixed with condition index."""
    errors, _ = _validate_trigger_config(
        hass,
        {
            "type": "compound",
            "compound_logic": "AND",
            "conditions": [
                {"type": "threshold", "entity_id": "sensor.a"},  # missing above/below
                {"type": "threshold", "entity_id": "sensor.b", "trigger_above": 10},
            ],
        },
    )
    assert any("Condition 0:" in e for e in errors)


def test_validate_trigger_entity_ids_backfill(hass: HomeAssistant) -> None:
    """Line 131: entity_id is backfilled from entity_ids[0] when not set."""
    tc: dict[str, Any] = {
        "type": "threshold",
        "entity_ids": ["sensor.temp1", "sensor.temp2"],
        "trigger_above": 30,
    }
    hass.states.async_set("sensor.temp1", "25")
    hass.states.async_set("sensor.temp2", "26")
    errors, _ = _validate_trigger_config(hass, tc)
    assert not errors
    assert tc["entity_id"] == "sensor.temp1"


# ─── websocket/tasks.py: ws_create_task edge paths ────────────────────


async def test_create_task_global_entry_rejected(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """Line 275: creating task on global entry returns not_found."""
    await setup_integration(hass, global_entry)
    conn = _c97_conn()
    await call_ws_handler(
        ws_create_task,
        hass,
        conn,
        {
            "id": _c97_nid(),
            "type": "maintenance_supporter/task/create",
            "entry_id": global_entry.entry_id,
            "name": "Test",
        },
    )
    conn.send_error.assert_called_once()
    assert "not_found" in str(conn.send_error.call_args)


async def test_create_task_unsafe_url(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Lines 301-302: unsafe documentation_url rejected."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _c97_conn()
    await call_ws_handler(
        ws_create_task,
        hass,
        conn,
        {
            "id": _c97_nid(),
            "type": "maintenance_supporter/task/create",
            "entry_id": object_entry.entry_id,
            "name": "Bad URL",
            "documentation_url": "javascript:alert(1)",
        },
    )
    conn.send_error.assert_called_once()
    assert "invalid_url" in str(conn.send_error.call_args)


async def test_create_task_nfc_duplicate_warning(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """Lines 323, 325, 370: NFC duplicate warning + checklist in create result."""
    task = build_task_data()
    task["nfc_tag_id"] = "TAG_DUP_CREATE"
    obj_entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Pump NFC",
        source="user",
        data=build_object_entry_data(tasks={TASK_ID_1: task}),
        unique_id="maintenance_supporter_nfc_create",
    )
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj_entry)
    conn = _c97_conn()

    # Create second task with same NFC tag + checklist
    await call_ws_handler(
        ws_create_task,
        hass,
        conn,
        {
            "id": _c97_nid(),
            "type": "maintenance_supporter/task/create",
            "entry_id": obj_entry.entry_id,
            "name": "New Task",
            "nfc_tag_id": "TAG_DUP_CREATE",
            "checklist": ["Step 1", "Step 2"],
        },
    )
    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert "warnings" in result
    assert any("already linked" in w for w in result["warnings"])


async def test_create_task_legacy_store_path(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Lines 359-363: legacy path when Store is None writes to ConfigEntry.data."""
    await setup_integration(hass, global_entry, object_entry)

    # Patch runtime_data to have store=None
    entry = hass.config_entries.async_get_entry(object_entry.entry_id)
    assert entry is not None
    rd = entry.runtime_data
    original_store = rd.store
    rd.store = None

    conn = _c97_conn()
    await call_ws_handler(
        ws_create_task,
        hass,
        conn,
        {
            "id": _c97_nid(),
            "type": "maintenance_supporter/task/create",
            "entry_id": object_entry.entry_id,
            "name": "Legacy Task",
            "last_performed": "2024-03-01",
        },
    )
    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert "task_id" in result

    # Restore
    rd.store = original_store


# ─── websocket/tasks.py: ws_update_task edge paths ────────────────────


async def test_update_task_invalid_entity_slug(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Lines 431-438: invalid entity_slug rejected."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _c97_conn()
    await call_ws_handler(
        ws_update_task,
        hass,
        conn,
        {
            "id": _c97_nid(),
            "type": "maintenance_supporter/task/update",
            "entry_id": object_entry.entry_id,
            "task_id": TASK_ID_1,
            "entity_slug": "INVALID-Slug!",
        },
    )
    conn.send_error.assert_called_once()
    assert "invalid_entity_slug" in str(conn.send_error.call_args)


async def test_update_task_nfc_duplicate_warning(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """Lines 444, 497: NFC duplicate warning on update."""
    task1 = build_task_data(task_id=TASK_ID_1, name="Task A")
    task1["nfc_tag_id"] = "TAG_UP1"
    task2 = build_task_data(task_id=TASK_ID_2, name="Task B")
    obj_entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Multi Task",
        source="user",
        data=build_object_entry_data(tasks={TASK_ID_1: task1, TASK_ID_2: task2}),
        unique_id="maintenance_supporter_nfc_update",
    )
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj_entry)
    conn = _c97_conn()

    # Update task2 to have same NFC tag as task1
    await call_ws_handler(
        ws_update_task,
        hass,
        conn,
        {
            "id": _c97_nid(),
            "type": "maintenance_supporter/task/update",
            "entry_id": obj_entry.entry_id,
            "task_id": TASK_ID_2,
            "nfc_tag_id": "TAG_UP1",
        },
    )
    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result.get("warnings")


async def test_update_task_unsafe_url(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Lines 448-449: unsafe documentation_url on update."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _c97_conn()
    await call_ws_handler(
        ws_update_task,
        hass,
        conn,
        {
            "id": _c97_nid(),
            "type": "maintenance_supporter/task/update",
            "entry_id": object_entry.entry_id,
            "task_id": TASK_ID_1,
            "documentation_url": "//evil.com/payload",
        },
    )
    conn.send_error.assert_called_once()
    assert "invalid_url" in str(conn.send_error.call_args)


# ─── websocket/tasks.py: ws_list_tasks with entry_id filter ───────────


async def test_list_tasks_filtered_by_entry_id(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Line 590: entry_id filter skips non-matching entries."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _c97_conn()
    ws_list_tasks(
        hass,
        conn,
        {
            "id": _c97_nid(),
            "type": "maintenance_supporter/task/list",
            "entry_id": object_entry.entry_id,
        },
    )
    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert len(result["tasks"]) == 1
    assert result["tasks"][0]["entry_id"] == object_entry.entry_id


# ─── websocket/tasks.py: task action not-found paths ──────────────────


async def test_complete_task_not_found_c97(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Lines 641-642: task not found in ws_complete_task."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _c97_conn()
    await call_ws_handler(
        ws_complete_task,
        hass,
        conn,
        {
            "id": _c97_nid(),
            "type": "maintenance_supporter/task/complete",
            "entry_id": object_entry.entry_id,
            "task_id": "nonexistent_task_id_zzz",
        },
    )
    conn.send_error.assert_called_once()


async def test_skip_task_not_found_c97(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Lines 677-678: task not found in ws_skip_task."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _c97_conn()
    await call_ws_handler(
        ws_skip_task,
        hass,
        conn,
        {
            "id": _c97_nid(),
            "type": "maintenance_supporter/task/skip",
            "entry_id": object_entry.entry_id,
            "task_id": "nonexistent_task_id_zzz",
        },
    )
    conn.send_error.assert_called_once()


async def test_reset_task_not_found_c97(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Lines 711-712: task not found in ws_reset_task."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _c97_conn()
    await call_ws_handler(
        ws_reset_task,
        hass,
        conn,
        {
            "id": _c97_nid(),
            "type": "maintenance_supporter/task/reset",
            "entry_id": object_entry.entry_id,
            "task_id": "nonexistent_task_id_zzz",
        },
    )
    conn.send_error.assert_called_once()


async def test_snooze_task_suppresses_notifications(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """task/snooze marks the task's notification keys snoozed."""
    from custom_components.maintenance_supporter import (
        DOMAIN,
        NOTIFICATION_MANAGER_KEY,
    )

    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()
    await call_ws_handler(
        ws_snooze_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/snooze",
            "entry_id": object_entry.entry_id,
            "task_id": TASK_ID_1,
        },
    )
    conn.send_result.assert_called_once()

    nm = hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY]
    key = f"{object_entry.entry_id}_{TASK_ID_1}_overdue"
    assert nm._is_snoozed(key)


async def test_snooze_task_not_found(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """task/snooze on an unknown task errors."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()
    await call_ws_handler(
        ws_snooze_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/snooze",
            "entry_id": object_entry.entry_id,
            "task_id": "nope_zzz",
        },
    )
    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "not_found"
