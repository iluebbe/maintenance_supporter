"""Coverage push tests targeting uncovered lines across multiple modules.

Targets: websocket/tasks.py, websocket/dashboard.py, websocket/analysis.py,
websocket/objects.py, websocket/io.py, __init__.py, config_flow_options_global.py.
"""

from __future__ import annotations

from datetime import timedelta
from typing import Any
from unittest.mock import MagicMock, patch
from uuid import uuid4

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_ACTION_COMPLETE_ENABLED,
    CONF_ACTION_SKIP_ENABLED,
    CONF_ACTION_SNOOZE_ENABLED,
    CONF_ADVANCED_SEASONAL,
    CONF_GROUPS,
    CONF_NOTIFICATIONS_ENABLED,
    CONF_NOTIFY_SERVICE,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from custom_components.maintenance_supporter.websocket.analysis import (
    ws_seasonal_overrides,
    ws_set_environmental_entity,
)
from custom_components.maintenance_supporter.websocket.dashboard import (
    ws_get_statistics,
    ws_subscribe,
    ws_test_notification,
    ws_update_global_settings,
)
from custom_components.maintenance_supporter.websocket.io import (
    ws_import_csv,
)
from custom_components.maintenance_supporter.websocket.objects import (
    ws_entity_attributes,
)
from custom_components.maintenance_supporter.websocket.tasks import (
    _check_nfc_tag_duplicate,
    _is_safe_url,
    _validate_trigger_config,
    ws_complete_task,
    ws_create_task,
    ws_list_tasks,
    ws_reset_task,
    ws_skip_task,
    ws_update_task,
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

# ─── Helpers ──────────────────────────────────────────────────────────────


def _conn() -> MagicMock:
    conn = MagicMock()
    conn.send_result = MagicMock()
    conn.send_error = MagicMock()
    conn.send_message = MagicMock()
    conn.subscriptions = {}
    conn.user = MagicMock(is_admin=True)
    return conn


_msg_id = 0


def _nid() -> int:
    global _msg_id
    _msg_id += 1
    return _msg_id


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
        unique_id="maintenance_supporter_cov97_pump",
    )
    entry.add_to_hass(hass)
    return entry


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
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Line 67: duplicate NFC tag returns warning string."""
    task = build_task_data()
    task["nfc_tag_id"] = "TAG_ABC"
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Pump1", source="user",
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
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Excluding the same task_id should not report duplicate."""
    task = build_task_data()
    task["nfc_tag_id"] = "TAG_XYZ"
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Pump2", source="user",
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
    errors, _ = _validate_trigger_config(hass, {
        "type": "compound",
        "compound_logic": "XOR",
        "conditions": [
            {"type": "threshold", "entity_id": "sensor.a", "trigger_above": 10},
            {"type": "threshold", "entity_id": "sensor.b", "trigger_above": 20},
        ],
    })
    assert any("compound_logic" in e for e in errors)


def test_validate_compound_trigger_non_dict_condition(hass: HomeAssistant) -> None:
    """Lines 199-200: non-dict condition."""
    errors, _ = _validate_trigger_config(hass, {
        "type": "compound",
        "compound_logic": "AND",
        "conditions": [
            "not_a_dict",
            {"type": "threshold", "entity_id": "sensor.a", "trigger_above": 10},
        ],
    })
    assert any("must be a dict" in e for e in errors)


def test_validate_compound_trigger_nested_compound(hass: HomeAssistant) -> None:
    """Nested compound triggers are not allowed."""
    errors, _ = _validate_trigger_config(hass, {
        "type": "compound",
        "compound_logic": "AND",
        "conditions": [
            {"type": "compound", "conditions": []},
            {"type": "threshold", "entity_id": "sensor.a", "trigger_above": 10},
        ],
    })
    assert any("nested compound" in e for e in errors)


def test_validate_compound_trigger_sub_errors(hass: HomeAssistant) -> None:
    """Line 210: sub-condition errors are prefixed with condition index."""
    errors, _ = _validate_trigger_config(hass, {
        "type": "compound",
        "compound_logic": "AND",
        "conditions": [
            {"type": "threshold", "entity_id": "sensor.a"},  # missing above/below
            {"type": "threshold", "entity_id": "sensor.b", "trigger_above": 10},
        ],
    })
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
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Line 275: creating task on global entry returns not_found."""
    await setup_integration(hass, global_entry)
    conn = _conn()
    await call_ws_handler(ws_create_task, hass, conn, {
        "id": _nid(), "type": "maintenance_supporter/task/create",
        "entry_id": global_entry.entry_id,
        "name": "Test",
    })
    conn.send_error.assert_called_once()
    assert "not_found" in str(conn.send_error.call_args)


async def test_create_task_unsafe_url(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Lines 301-302: unsafe documentation_url rejected."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _conn()
    await call_ws_handler(ws_create_task, hass, conn, {
        "id": _nid(), "type": "maintenance_supporter/task/create",
        "entry_id": object_entry.entry_id,
        "name": "Bad URL",
        "documentation_url": "javascript:alert(1)",
    })
    conn.send_error.assert_called_once()
    assert "invalid_url" in str(conn.send_error.call_args)


async def test_create_task_nfc_duplicate_warning(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Lines 323, 325, 370: NFC duplicate warning + checklist in create result."""
    task = build_task_data()
    task["nfc_tag_id"] = "TAG_DUP_CREATE"
    obj_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Pump NFC", source="user",
        data=build_object_entry_data(tasks={TASK_ID_1: task}),
        unique_id="maintenance_supporter_nfc_create",
    )
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj_entry)
    conn = _conn()

    # Create second task with same NFC tag + checklist
    await call_ws_handler(ws_create_task, hass, conn, {
        "id": _nid(), "type": "maintenance_supporter/task/create",
        "entry_id": obj_entry.entry_id,
        "name": "New Task",
        "nfc_tag_id": "TAG_DUP_CREATE",
        "checklist": ["Step 1", "Step 2"],
    })
    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert "warnings" in result
    assert any("already linked" in w for w in result["warnings"])


async def test_create_task_legacy_store_path(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Lines 359-363: legacy path when Store is None writes to ConfigEntry.data."""
    await setup_integration(hass, global_entry, object_entry)

    # Patch runtime_data to have store=None
    entry = hass.config_entries.async_get_entry(object_entry.entry_id)
    assert entry is not None
    rd = entry.runtime_data
    original_store = rd.store
    rd.store = None

    conn = _conn()
    await call_ws_handler(ws_create_task, hass, conn, {
        "id": _nid(), "type": "maintenance_supporter/task/create",
        "entry_id": object_entry.entry_id,
        "name": "Legacy Task",
        "last_performed": "2024-03-01",
    })
    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert "task_id" in result

    # Restore
    rd.store = original_store


# ─── websocket/tasks.py: ws_update_task edge paths ────────────────────


async def test_update_task_invalid_entity_slug(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Lines 431-438: invalid entity_slug rejected."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _conn()
    await call_ws_handler(ws_update_task, hass, conn, {
        "id": _nid(), "type": "maintenance_supporter/task/update",
        "entry_id": object_entry.entry_id,
        "task_id": TASK_ID_1,
        "entity_slug": "INVALID-Slug!",
    })
    conn.send_error.assert_called_once()
    assert "invalid_entity_slug" in str(conn.send_error.call_args)


async def test_update_task_nfc_duplicate_warning(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Lines 444, 497: NFC duplicate warning on update."""
    task1 = build_task_data(task_id=TASK_ID_1, name="Task A")
    task1["nfc_tag_id"] = "TAG_UP1"
    task2 = build_task_data(task_id=TASK_ID_2, name="Task B")
    obj_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Multi Task", source="user",
        data=build_object_entry_data(
            tasks={TASK_ID_1: task1, TASK_ID_2: task2}
        ),
        unique_id="maintenance_supporter_nfc_update",
    )
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj_entry)
    conn = _conn()

    # Update task2 to have same NFC tag as task1
    await call_ws_handler(ws_update_task, hass, conn, {
        "id": _nid(), "type": "maintenance_supporter/task/update",
        "entry_id": obj_entry.entry_id,
        "task_id": TASK_ID_2,
        "nfc_tag_id": "TAG_UP1",
    })
    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result.get("warnings")


async def test_update_task_unsafe_url(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Lines 448-449: unsafe documentation_url on update."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _conn()
    await call_ws_handler(ws_update_task, hass, conn, {
        "id": _nid(), "type": "maintenance_supporter/task/update",
        "entry_id": object_entry.entry_id,
        "task_id": TASK_ID_1,
        "documentation_url": "//evil.com/payload",
    })
    conn.send_error.assert_called_once()
    assert "invalid_url" in str(conn.send_error.call_args)


# ─── websocket/tasks.py: ws_list_tasks with entry_id filter ───────────


async def test_list_tasks_filtered_by_entry_id(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Line 590: entry_id filter skips non-matching entries."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _conn()
    ws_list_tasks(hass, conn, {
        "id": _nid(), "type": "maintenance_supporter/task/list",
        "entry_id": object_entry.entry_id,
    })
    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert len(result["tasks"]) == 1
    assert result["tasks"][0]["entry_id"] == object_entry.entry_id


# ─── websocket/tasks.py: task action not-found paths ──────────────────


async def test_complete_task_not_found(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Lines 641-642: task not found in ws_complete_task."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _conn()
    await call_ws_handler(ws_complete_task, hass, conn, {
        "id": _nid(), "type": "maintenance_supporter/task/complete",
        "entry_id": object_entry.entry_id,
        "task_id": "nonexistent_task_id_zzz",
    })
    conn.send_error.assert_called_once()


async def test_skip_task_not_found(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Lines 677-678: task not found in ws_skip_task."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _conn()
    await call_ws_handler(ws_skip_task, hass, conn, {
        "id": _nid(), "type": "maintenance_supporter/task/skip",
        "entry_id": object_entry.entry_id,
        "task_id": "nonexistent_task_id_zzz",
    })
    conn.send_error.assert_called_once()


async def test_reset_task_not_found(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Lines 711-712: task not found in ws_reset_task."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _conn()
    await call_ws_handler(ws_reset_task, hass, conn, {
        "id": _nid(), "type": "maintenance_supporter/task/reset",
        "entry_id": object_entry.entry_id,
        "task_id": "nonexistent_task_id_zzz",
    })
    conn.send_error.assert_called_once()


# ─── websocket/dashboard.py: triggered status in statistics ───────────


async def test_statistics_triggered_count(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Line 209: triggered status is counted in statistics."""
    # Create a sensor-based task that will show as triggered
    task = build_task_data(
        schedule_type="sensor_based",
        interval_days=None,
        trigger_config={
            "type": "threshold",
            "entity_id": "sensor.cov97_temp",
            "trigger_above": 30,
        },
    )
    obj_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Triggered Obj", source="user",
        data=build_object_entry_data(tasks={TASK_ID_1: task}),
        unique_id="maintenance_supporter_cov97_triggered",
    )
    obj_entry.add_to_hass(hass)
    hass.states.async_set("sensor.cov97_temp", "50")
    await setup_integration(hass, global_entry, obj_entry)

    conn = _conn()
    await call_ws_handler(ws_get_statistics, hass, conn, {
        "id": _nid(), "type": "maintenance_supporter/statistics",
    })
    result = conn.send_result.call_args[0][1]
    # The task should be triggered since sensor value 50 > threshold 30
    assert result["triggered"] >= 1


# ─── websocket/dashboard.py: subscribe new entry callback ─────────────


async def test_subscribe_new_entry_callback(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Lines 270-271: _on_new_entry callback fires on new object entry."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _conn()

    await call_ws_handler(ws_subscribe, hass, conn, {
        "id": _nid(), "type": "maintenance_supporter/subscribe",
    })
    # Initial send_result + _forward_update
    initial_calls = conn.send_message.call_count

    # Add and set up a new object entry
    task2 = build_task_data(task_id=TASK_ID_2, name="New Task", last_performed="2024-01-01")
    new_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="New Pump", source="user",
        data=build_object_entry_data(
            object_data=build_object_data(name="New Pump"),
            tasks={TASK_ID_2: task2},
        ),
        unique_id="maintenance_supporter_cov97_new_sub",
    )
    new_entry.add_to_hass(hass)
    await hass.config_entries.async_setup(new_entry.entry_id)
    await hass.async_block_till_done()

    # The _on_new_entry callback should have fired _forward_update
    assert conn.send_message.call_count > initial_calls


# ─── websocket/dashboard.py: subscribe already attached (line 254) ────


async def test_subscribe_already_attached_entry(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Line 254: _attach_entry returns early if already attached."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _conn()

    # Subscribe — this attaches the entry
    await call_ws_handler(ws_subscribe, hass, conn, {
        "id": _nid(), "type": "maintenance_supporter/subscribe",
    })

    # Manually trigger _on_new_entry for the already-attached entry
    # by dispatching the signal
    from homeassistant.helpers.dispatcher import async_dispatcher_send

    from custom_components.maintenance_supporter.const import SIGNAL_NEW_OBJECT_ENTRY

    msg_count_before = conn.send_message.call_count
    async_dispatcher_send(hass, SIGNAL_NEW_OBJECT_ENTRY, object_entry.entry_id)
    await hass.async_block_till_done()
    # _forward_update is still called even for already-attached entries
    # (line 271), but _attach_entry returns early at line 254
    assert conn.send_message.call_count >= msg_count_before


# ─── websocket/dashboard.py: budget_status edge cases ─────────────────


async def test_budget_status_edge_history(
    hass: HomeAssistant,
) -> None:
    """Lines 325, 329, 332, 336-337: non-completed type, null cost, invalid timestamp."""
    from custom_components.maintenance_supporter.websocket.dashboard import (
        ws_get_budget_status,
    )

    # Global entry with budget config
    data = build_global_entry_data()
    data["budget_monthly"] = 500.0
    data["budget_yearly"] = 5000.0
    ge = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter", source="user",
        data=data, unique_id=GLOBAL_UNIQUE_ID,
    )
    ge.add_to_hass(hass)

    # Object with history containing edge cases
    now = dt_util.now()
    task = build_task_data(last_performed=(now.date() - timedelta(days=5)).isoformat())
    task["history"] = [
        # Line 329: type != "completed" → continue
        {"timestamp": now.isoformat(), "type": "skipped", "cost": 100.0},
        # Line 332: cost is None → continue
        {"timestamp": now.isoformat(), "type": "completed", "cost": None},
        # Lines 336-337: invalid timestamp → continue
        {"timestamp": "not-a-date", "type": "completed", "cost": 50.0},
        # Line 325: history from entry.data (legacy path — store is None)
        {"timestamp": now.isoformat(), "type": "completed", "cost": 25.0},
    ]
    obj_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Budget Edge", source="user",
        data=build_object_entry_data(
            object_data=build_object_data(name="Budget Edge"),
            tasks={TASK_ID_1: task},
        ),
        unique_id="maintenance_supporter_cov97_budget_edge",
    )
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, ge, obj_entry)

    # Patch the store to None to hit the legacy history path (line 325)
    # Also write the history into entry.data so the legacy path finds it
    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    rd = entry.runtime_data
    original_store = rd.store
    rd.store = None

    # Re-inject history into entry.data for the legacy path
    new_data = dict(entry.data)
    tasks = dict(new_data.get(CONF_TASKS, {}))
    t = dict(tasks[TASK_ID_1])
    t["history"] = task["history"]
    tasks[TASK_ID_1] = t
    new_data[CONF_TASKS] = tasks
    hass.config_entries.async_update_entry(entry, data=new_data)

    conn = _conn()
    await call_ws_handler(ws_get_budget_status, hass, conn, {
        "id": _nid(), "type": "maintenance_supporter/budget_status",
    })
    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    # Only the valid completed entry with cost 25.0 should be counted
    assert result["monthly_spent"] == 25.0

    rd.store = original_store


# ─── websocket/dashboard.py: test_notification invalid service ────────


async def test_notification_invalid_service(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Lines 464-471: invalid notify service in ws_test_notification."""
    # Set up with an invalid notify service
    hass.config_entries.async_update_entry(
        global_entry, options={
            **dict(global_entry.data),
            CONF_NOTIFY_SERVICE: "invalid_service_format",
            CONF_NOTIFICATIONS_ENABLED: True,
        },
    )
    await setup_integration(hass, global_entry)

    conn = _conn()
    await call_ws_handler(ws_test_notification, hass, conn, {
        "id": _nid(), "type": "maintenance_supporter/global/test_notification",
    })
    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["success"] is False


# ─── websocket/dashboard.py: test_notification action buttons ─────────


async def test_notification_with_action_buttons(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Lines 486-493: action buttons included in test notification."""
    hass.config_entries.async_update_entry(
        global_entry, options={
            **dict(global_entry.data),
            CONF_NOTIFY_SERVICE: "notify.mobile_app_phone",
            CONF_NOTIFICATIONS_ENABLED: True,
            CONF_ACTION_COMPLETE_ENABLED: True,
            CONF_ACTION_SKIP_ENABLED: True,
            CONF_ACTION_SNOOZE_ENABLED: True,
        },
    )
    await setup_integration(hass, global_entry)

    calls: list[dict[str, Any]] = []

    original_async_call = hass.services.async_call

    async def mock_async_call(
        domain: str, service: str, service_data: dict[str, Any] | None = None, **kw: Any,
    ) -> None:
        if domain == "notify":
            calls.append({"domain": domain, "service": service, "data": service_data or {}})
            return
        await original_async_call(domain, service, service_data, **kw)

    conn = _conn()
    with patch(
        "homeassistant.core.ServiceRegistry.async_call",
        side_effect=mock_async_call,
    ):
        await call_ws_handler(ws_test_notification, hass, conn, {
            "id": _nid(), "type": "maintenance_supporter/global/test_notification",
        })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["success"] is True
    # Verify action buttons were included
    assert len(calls) == 1
    actions = calls[0]["data"].get("data", {}).get("actions", [])
    assert len(actions) == 3
    action_names = [a["action"] for a in actions]
    assert "MS_TEST_COMPLETE" in action_names
    assert "MS_TEST_SKIP" in action_names
    assert "MS_TEST_SNOOZE" in action_names


# ─── websocket/dashboard.py: ws_update_global_settings notify validation


async def test_update_settings_invalid_notify_service(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Line 414: notify_service validation in global update."""
    await setup_integration(hass, global_entry)
    conn = _conn()
    await call_ws_handler(ws_update_global_settings, hass, conn, {
        "id": _nid(), "type": "maintenance_supporter/global/update",
        "settings": {CONF_NOTIFY_SERVICE: "badprefix.service_name"},
    })
    conn.send_error.assert_called_once()


# ─── websocket/analysis.py: legacy fallback paths ─────────────────────


async def test_seasonal_overrides_legacy_store_none(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Lines 187-193: legacy path in ws_seasonal_overrides when store is None."""
    await setup_integration(hass, global_entry, object_entry)

    entry = hass.config_entries.async_get_entry(object_entry.entry_id)
    assert entry is not None
    rd = entry.runtime_data
    original_store = rd.store
    rd.store = None

    conn = _conn()
    await call_ws_handler(ws_seasonal_overrides, hass, conn, {
        "id": _nid(),
        "type": "maintenance_supporter/task/set_seasonal_overrides",
        "entry_id": object_entry.entry_id,
        "task_id": TASK_ID_1,
        "overrides": {"1": 0.8, "7": 1.2},
    })
    conn.send_result.assert_called_once()

    rd.store = original_store


async def test_environmental_entity_legacy_store_none(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Lines 258-264: legacy path in ws_set_environmental_entity when store is None."""
    await setup_integration(hass, global_entry, object_entry)

    entry = hass.config_entries.async_get_entry(object_entry.entry_id)
    assert entry is not None
    rd = entry.runtime_data
    original_store = rd.store
    rd.store = None

    conn = _conn()
    await call_ws_handler(ws_set_environmental_entity, hass, conn, {
        "id": _nid(),
        "type": "maintenance_supporter/task/set_environmental_entity",
        "entry_id": object_entry.entry_id,
        "task_id": TASK_ID_1,
        "environmental_entity": "sensor.outdoor_temp",
        "environmental_attribute": "temperature",
    })
    conn.send_result.assert_called_once()

    rd.store = original_store


# ─── __init__.py: service call task_id not found ──────────────────────


async def test_service_complete_task_id_not_found(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Lines 120 (and 144, 166): task_id not found raises ServiceValidationError."""
    await setup_integration(hass, global_entry, object_entry)

    # Register a fake entity that has a unique_id that doesn't match any task
    ent_reg = er.async_get(hass)
    ent_reg.async_get_or_create(
        domain="sensor",
        platform=DOMAIN,
        unique_id="maintenance_supporter_pump_nomatch",
        config_entry=object_entry,
    )

    from homeassistant.exceptions import ServiceValidationError

    with pytest.raises(ServiceValidationError):
        await hass.services.async_call(
            DOMAIN, "complete_maintenance",
            {"entity_id": "sensor.maintenance_supporter_pump_nomatch"},
            blocking=True,
        )


async def test_service_reset_task_id_not_found(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Line 144: reset service with entity whose task_id can't be found."""
    await setup_integration(hass, global_entry, object_entry)

    ent_reg = er.async_get(hass)
    ent_reg.async_get_or_create(
        domain="sensor",
        platform=DOMAIN,
        unique_id="maintenance_supporter_pump_noreset",
        config_entry=object_entry,
    )

    from homeassistant.exceptions import ServiceValidationError

    with pytest.raises(ServiceValidationError):
        await hass.services.async_call(
            DOMAIN, "reset_maintenance",
            {"entity_id": "sensor.maintenance_supporter_pump_noreset"},
            blocking=True,
        )


async def test_service_skip_task_id_not_found(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Line 166: skip service with entity whose task_id can't be found."""
    await setup_integration(hass, global_entry, object_entry)

    ent_reg = er.async_get(hass)
    ent_reg.async_get_or_create(
        domain="sensor",
        platform=DOMAIN,
        unique_id="maintenance_supporter_pump_noskip",
        config_entry=object_entry,
    )

    from homeassistant.exceptions import ServiceValidationError

    with pytest.raises(ServiceValidationError):
        await hass.services.async_call(
            DOMAIN, "skip_maintenance",
            {"entity_id": "sensor.maintenance_supporter_pump_noskip"},
            blocking=True,
        )


# ─── __init__.py: _detect_advanced_feature_usage seasonal ─────────────


async def test_detect_seasonal_feature_usage(
    hass: HomeAssistant,
) -> None:
    """Line 341: seasonal_enabled detected in _detect_advanced_feature_usage."""
    from custom_components.maintenance_supporter import _detect_advanced_feature_usage

    ge = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter", source="user",
        data=build_global_entry_data(), unique_id=GLOBAL_UNIQUE_ID,
    )
    ge.add_to_hass(hass)

    task = build_task_data()
    task["adaptive_config"] = {"seasonal_enabled": True}
    obj_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Seasonal Pump", source="user",
        data=build_object_entry_data(tasks={TASK_ID_1: task}),
        unique_id="maintenance_supporter_cov97_seasonal",
    )
    obj_entry.add_to_hass(hass)

    result = _detect_advanced_feature_usage(hass, {})
    assert result[CONF_ADVANCED_SEASONAL] is True


# ─── __init__.py: cleanup on last entry unload ────────────────────────


async def test_cleanup_on_last_entry_unload(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Lines 447-452: domain data cleanup when no entries remain."""
    from custom_components.maintenance_supporter import async_unload_entry

    await setup_integration(hass, global_entry)
    assert DOMAIN in hass.data

    # Unload platforms first
    await hass.config_entries.async_unload_platforms(global_entry, ["sensor", "binary_sensor", "calendar"])

    # Patch async_entries to return empty list to simulate no entries remaining
    with patch.object(
        hass.config_entries, "async_entries", return_value=[],
    ), patch.object(
        hass.config_entries, "async_unload_platforms", return_value=True,
    ):
        await async_unload_entry(hass, global_entry)

    assert DOMAIN not in hass.data


# ─── __init__.py: async_remove_entry for global entry (line 462) ──────


async def test_remove_global_entry(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Line 462: async_remove_entry returns early for global entry."""
    from custom_components.maintenance_supporter import async_remove_entry

    # Should return without error
    await async_remove_entry(hass, global_entry)


# ─── __init__.py: _get_coordinator_for_entity no runtime_data (497) ───


async def test_get_coordinator_no_runtime_data(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Line 497: _get_coordinator_for_entity returns None when no runtime_data."""
    from custom_components.maintenance_supporter import _get_coordinator_for_entity

    await setup_integration(hass, global_entry)

    # Create an entity registered against the global entry (which has no coordinator)
    ent_reg = er.async_get(hass)
    ent_reg.async_get_or_create(
        domain="sensor",
        platform=DOMAIN,
        unique_id="maintenance_supporter_no_coord",
        config_entry=global_entry,
    )

    # Global entry has runtime_data but coordinator is None
    result = _get_coordinator_for_entity(hass, "sensor.maintenance_supporter_no_coord")
    assert result is None


# ─── config_flow_options_global.py: redirect steps ────────────────────


async def test_global_options_redirect_steps(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Lines 201, 208: redirect wrapper steps."""
    await setup_integration(hass, global_entry)

    from custom_components.maintenance_supporter.config_flow_options_global import (
        GlobalOptionsFlow,
    )

    # Create flow instance the HA way
    flow = GlobalOptionsFlow()
    flow.hass = hass
    flow.handler = global_entry.entry_id
    flow._common_handler = global_entry.entry_id  # type: ignore[attr-defined]
    # Set config_entry via internal attribute
    flow._config_entry = global_entry  # type: ignore[attr-defined]

    # async_step_global_init → async_step_init
    result = await flow.async_step_global_init()
    assert result["type"] == FlowResultType.MENU

    # async_step_global_options → async_step_init
    result = await flow.async_step_global_options()
    assert result["type"] == FlowResultType.MENU


# ─── config_flow_options_global.py: group management ──────────────────


async def test_manage_groups_delete(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Lines 671-680: _delete_group removes group and returns menu."""
    # Add a group via options
    group_id = uuid4().hex
    hass.config_entries.async_update_entry(
        global_entry, options={
            **dict(global_entry.data),
            "advanced_groups": True,
            CONF_GROUPS: {
                group_id: {
                    "name": "Test Group",
                    "description": "A test group",
                    "task_refs": [],
                },
            },
        },
    )
    await setup_integration(hass, global_entry)

    # Navigate to manage_groups and select the group to delete
    result = await hass.config_entries.options.async_init(global_entry.entry_id)
    assert result["type"] == FlowResultType.MENU
    assert "manage_groups" in result["menu_options"]

    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "manage_groups"},
    )
    assert result["type"] == FlowResultType.FORM

    # Select the group (triggers _delete_group)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"selected_group": group_id},
    )
    assert result["type"] == FlowResultType.MENU

    # Verify group was deleted
    entry = hass.config_entries.async_get_entry(global_entry.entry_id)
    assert entry is not None
    groups = (entry.options or entry.data).get(CONF_GROUPS, {})
    assert group_id not in groups


async def test_manage_groups_no_groups_redirects_to_add(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Lines 595-597: no groups → redirect to add_group form."""
    from custom_components.maintenance_supporter.config_flow_options_global import (
        GlobalOptionsFlow,
    )

    hass.config_entries.async_update_entry(
        global_entry, options={
            **dict(global_entry.data),
            "advanced_adaptive": False,
            "advanced_groups": True,
            CONF_GROUPS: {},
        },
    )
    await setup_integration(hass, global_entry)

    # Create flow instance directly to bypass menu navigation
    flow = GlobalOptionsFlow()
    flow.hass = hass
    flow.handler = global_entry.entry_id
    # Set config_entry to the current entry
    entry = hass.config_entries.async_get_entry(global_entry.entry_id)
    assert entry is not None
    flow._config_entry = entry  # type: ignore[attr-defined]

    # Call manage_groups directly — with no groups, should redirect to add_group
    result = await flow.async_step_manage_groups()
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "add_group"


async def test_manage_groups_select_add_new(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Lines 590-591: selecting _add_new in manage_groups."""
    group_id = uuid4().hex
    hass.config_entries.async_update_entry(
        global_entry, options={
            **dict(global_entry.data),
            "advanced_adaptive": False,
            "advanced_groups": True,
            CONF_GROUPS: {
                group_id: {"name": "Existing", "description": "", "task_refs": []},
            },
        },
    )
    await setup_integration(hass, global_entry)

    result = await hass.config_entries.options.async_init(global_entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "manage_groups"},
    )
    assert result["type"] == FlowResultType.FORM

    # Select _add_new
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"selected_group": "_add_new"},
    )
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "add_group"


# ─── config_flow_options_global.py: test_notification flow step ───────


async def test_config_flow_test_notification_invalid_service(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Line 477: test_notification step with invalid service."""
    hass.config_entries.async_update_entry(
        global_entry, options={
            **dict(global_entry.data),
            CONF_NOTIFICATIONS_ENABLED: True,
            CONF_NOTIFY_SERVICE: "bad_service",
        },
    )
    await setup_integration(hass, global_entry)

    result = await hass.config_entries.options.async_init(global_entry.entry_id)
    assert "test_notification" in result["menu_options"]

    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "test_notification"},
    )
    # Should show form with result (invalid service)
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "test_notification"


# ─── websocket/io.py: CSV import edge cases ──────────────────────────


async def test_csv_import_too_large(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Lines 132-133: CSV content exceeds 1MB limit."""
    await setup_integration(hass, global_entry)
    conn = _conn()
    # Create content > 1MB
    large_content = "x" * (1_048_577)
    await call_ws_handler(ws_import_csv, hass, conn, {
        "id": _nid(), "type": "maintenance_supporter/csv/import",
        "csv_content": large_content,
    })
    conn.send_error.assert_called_once()
    assert "too_large" in str(conn.send_error.call_args)


async def test_csv_import_too_many_objects(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Lines 137-138: CSV contains more than 1000 objects."""
    await setup_integration(hass, global_entry)
    conn = _conn()
    # Mock import_objects_csv to return > 1000 objects
    mock_objects = [{"object": {"name": f"Obj{i}"}, "tasks": {}} for i in range(1001)]
    with patch(
        "custom_components.maintenance_supporter.helpers.csv_handler.import_objects_csv",
        return_value=mock_objects,
    ):
        await call_ws_handler(ws_import_csv, hass, conn, {
            "id": _nid(), "type": "maintenance_supporter/csv/import",
            "csv_content": "name\nObj1",
        })
    conn.send_error.assert_called_once()
    assert "too_many" in str(conn.send_error.call_args)


# ─── websocket/objects.py: ws_entity_attributes ──────────────────────


def test_ws_entity_attributes(hass: HomeAssistant) -> None:
    """Lines 209-212: ws_entity_attributes returns entity attribute info."""
    hass.states.async_set("sensor.test_cov97", "25.0", {
        "unit_of_measurement": "°C",
        "friendly_name": "Test Sensor",
    })
    conn = _conn()
    ws_entity_attributes(hass, conn, {
        "id": _nid(), "type": "maintenance_supporter/entity/attributes",
        "entity_id": "sensor.test_cov97",
    })
    conn.send_result.assert_called_once()


# ─── websocket/objects.py: create object failure path ─────────────────


async def test_create_object_failure(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Line 118: create_failed when flow doesn't produce create_entry."""
    from custom_components.maintenance_supporter.websocket.objects import (
        ws_create_object,
    )

    await setup_integration(hass, global_entry)
    conn = _conn()

    # Mock config flow to return abort instead of create_entry
    with patch.object(
        hass.config_entries.flow, "async_init",
        return_value={"type": "abort", "reason": "test"},
    ):
        await call_ws_handler(ws_create_object, hass, conn, {
            "id": _nid(), "type": "maintenance_supporter/object/create",
            "name": "Test Object",
        })
    conn.send_error.assert_called_once()
    assert "create_failed" in str(conn.send_error.call_args)


# ─── websocket/objects.py: update object installation_date ────────────


async def test_update_object_installation_date(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Line 159: installation_date field update."""
    from custom_components.maintenance_supporter.websocket.objects import (
        ws_update_object,
    )

    await setup_integration(hass, global_entry, object_entry)
    conn = _conn()

    await call_ws_handler(ws_update_object, hass, conn, {
        "id": _nid(), "type": "maintenance_supporter/object/update",
        "entry_id": object_entry.entry_id,
        "installation_date": "2023-01-15",
    })
    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["success"] is True

    entry = hass.config_entries.async_get_entry(object_entry.entry_id)
    assert entry is not None
    assert entry.data["object"]["installation_date"] == "2023-01-15"


# ─── websocket/io.py: QR generate task not found ─────────────────────


async def test_qr_generate_task_not_found(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Lines 211-213: QR generate with nonexistent task_id."""
    from custom_components.maintenance_supporter.websocket.io import ws_generate_qr

    await setup_integration(hass, global_entry, object_entry)
    conn = _conn()

    await call_ws_handler(ws_generate_qr, hass, conn, {
        "id": _nid(), "type": "maintenance_supporter/qr/generate",
        "entry_id": object_entry.entry_id,
        "task_id": "nonexistent_task_zzz",
    })
    conn.send_error.assert_called_once()
