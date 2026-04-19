"""Reproduce bugs #11, #12, #14 reported by byoung79."""
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.websocket.tasks import (
    ws_create_task,
    ws_reset_task,
)
from tests.conftest import (
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    setup_integration,
)
from tests.test_ws_objects import _mock_connection, call_ws_handler


async def test_bug11_type_resets_to_cleaning(hass: HomeAssistant) -> None:
    """Bug #11: task type resets to 'cleaning' when editing via options flow."""
    global_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    global_entry.add_to_hass(hass)

    task = build_task_data(task_type="service", last_performed="2024-06-01")
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Test Object",
        data=build_object_entry_data(
            object_data=build_object_data(name="Test Object"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_bug11",
    )
    entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, entry)

    assert entry.data["tasks"][TASK_ID_1]["type"] == "service"

    # Options flow: init → task_actions → select task → edit_task
    r = await hass.config_entries.options.async_init(entry.entry_id)
    r = await hass.config_entries.options.async_configure(r["flow_id"], {"next_step_id": "manage_tasks"})
    r = await hass.config_entries.options.async_configure(r["flow_id"], {"selected_task": TASK_ID_1})
    r = await hass.config_entries.options.async_configure(r["flow_id"], {"next_step_id": "edit_task"})
    assert r["step_id"] == "edit_task"

    # Submit form without explicitly setting type — should preserve "service"
    r = await hass.config_entries.options.async_configure(
        r["flow_id"], user_input={"name": "Edited Name", "warning_days": 7},
    )

    updated = entry.data["tasks"][TASK_ID_1]
    assert updated["type"] == "service", f"BUG #11: type changed to '{updated['type']}'"


async def test_bug12_reset_with_date(hass: HomeAssistant) -> None:
    """Bug #12: 'extra keys not allowed @ data[reset_date]' when resetting."""
    global_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    global_entry.add_to_hass(hass)

    task = build_task_data(last_performed="2024-06-01")
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Test Object",
        data=build_object_entry_data(
            object_data=build_object_data(name="Test Object"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_bug12",
    )
    entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, entry)

    conn = _mock_connection()

    # This should work but currently fails with "extra keys not allowed"
    await call_ws_handler(ws_reset_task, hass, conn, {
        "id": 1, "type": "maintenance_supporter/task/reset",
        "entry_id": entry.entry_id,
        "task_id": TASK_ID_1,
        "reset_date": "2026-04-01",
    })

    # If bug exists, send_error was called instead of send_result
    if conn.send_error.called:
        error_msg = conn.send_error.call_args[0][2] if conn.send_error.call_args else ""
        assert False, f"BUG #12: {error_msg}"
    conn.send_result.assert_called_once()


async def test_bug14_create_task_with_enabled(hass: HomeAssistant) -> None:
    """Bug #14: task/create rejects 'enabled' field sent by frontend."""
    global_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    global_entry.add_to_hass(hass)

    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Test Object",
        data=build_object_entry_data(
            object_data=build_object_data(name="Test Object"),
            tasks={},
        ),
        source="user",
        unique_id="maintenance_supporter_bug14",
    )
    entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, entry)

    conn = _mock_connection()

    # Frontend sends 'enabled: true' — currently rejected by schema
    await call_ws_handler(ws_create_task, hass, conn, {
        "id": 1, "type": "maintenance_supporter/task/create",
        "entry_id": entry.entry_id,
        "name": "Bug14 Test Task",
        "task_type": "cleaning",
        "schedule_type": "time_based",
        "interval_days": 30,
        "enabled": True,
    })

    if conn.send_error.called:
        error_msg = conn.send_error.call_args[0][2] if conn.send_error.call_args else ""
        assert False, f"BUG #14: {error_msg}"
    conn.send_result.assert_called_once()
