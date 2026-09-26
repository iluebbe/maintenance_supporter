"""Task write paths — the fields the create/edit happy paths never send.

Two surfaces write task config besides the panel's update command: the WS
``task/create`` (panel "add task") and the options flow's edit form. Both
must store exactly what was asked for — validated part links, per-phase links
that point nowhere dropped, the interval unit carried from the flat fields —
and refuse what is malformed without touching the stored task.
"""

from __future__ import annotations

from typing import Any
from unittest.mock import patch

from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_TASK_INTERVAL_DAYS,
    CONF_TASK_NAME,
    CONF_TASK_TYPE,
    CONF_TASK_WARNING_DAYS,
    CONF_TASKS,
    MaintenanceTypeEnum,
)
from custom_components.maintenance_supporter.websocket.tasks_crud import ws_create_task, ws_move_task

from .conftest import (
    TASK_ID_1,
    TASK_ID_2,
    build_task_data,
    call_ws_handler,
    make_global_entry,
    make_object_entry,
    make_ws_connection,
    setup_integration,
)


async def _pool_with_part(hass: HomeAssistant, tasks: dict[str, Any] | None = None) -> MockConfigEntry:
    g = make_global_entry(hass)
    obj = make_object_entry(
        hass,
        tasks=tasks or {},
        name="Pool",
        uid="write_pool",
        extra_data={"parts": {"p1": {"id": "p1", "name": "Filter cartridge"}}},
    )
    await setup_integration(hass, g, obj)
    return obj


# ─── WS task/create ───────────────────────────────────────────────────────


async def test_create_stores_the_validated_extras(hass: HomeAssistant) -> None:
    obj = await _pool_with_part(hass)
    conn = make_ws_connection()

    await call_ws_handler(
        ws_create_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "x",
            "entry_id": obj.entry_id,
            "name": "Backwash",
            # A bare interval schedule is only the carrier for the season/ends
            # extras — the interval itself rides the flat fields.
            "schedule": {"kind": "interval"},
            "interval_days": 2,
            "interval_unit": "weeks",
            "earliest_completion_days": 3,
            "require_tag_scan": True,
            "consumes_parts": [{"part_id": "p1", "quantity": 2}, {"part_id": "no_such_part"}],
            "phases": {
                "rinse": {"name": "Rinse", "consumes_parts": [{"part_id": "no_such_part"}]},
                "swap": {"name": "Swap cartridge", "consumes_parts": [{"part_id": "p1"}]},
            },
            "phase_sequence": ["rinse", "swap"],
        },
    )
    await hass.async_block_till_done()

    conn.send_error.assert_not_called()
    task_id = conn.send_result.call_args[0][1]["task_id"]
    task = hass.config_entries.async_get_entry(obj.entry_id).data[CONF_TASKS][task_id]
    assert task["schedule"] == {"kind": "interval", "every": 2, "unit": "weeks"}
    assert task["earliest_completion_days"] == 3
    assert task["require_tag_scan"] is True
    assert task["consumes_parts"] == [{"part_id": "p1", "quantity": 2}]
    # A phase whose only link points nowhere keeps no links at all.
    assert task["phases"]["rinse"] == {"name": "Rinse"}
    assert task["phases"]["swap"]["consumes_parts"] == [{"part_id": "p1", "quantity": 1}]
    assert task["phase_sequence"] == ["rinse", "swap"]


async def test_moving_into_a_full_object_is_refused_without_changes(hass: HomeAssistant) -> None:
    g = make_global_entry(hass)
    src = make_object_entry(hass, tasks={TASK_ID_1: build_task_data(name="Descale")}, name="Kettle", uid="mv_src")
    dst = make_object_entry(
        hass, tasks={TASK_ID_2: build_task_data(task_id=TASK_ID_2, name="Clean")}, name="Toaster", uid="mv_dst"
    )
    await setup_integration(hass, g, src, dst)
    conn = make_ws_connection()

    with patch("custom_components.maintenance_supporter.websocket.tasks_persist.MAX_TASKS_PER_OBJECT", 1):
        await call_ws_handler(
            ws_move_task,
            hass,
            conn,
            {"id": 1, "type": "x", "entry_id": src.entry_id, "task_id": TASK_ID_1, "target_entry_id": dst.entry_id},
        )
    await hass.async_block_till_done()

    assert conn.send_error.call_args[0][1] == "limit_reached"
    assert TASK_ID_1 in hass.config_entries.async_get_entry(src.entry_id).data[CONF_TASKS]
    assert list(hass.config_entries.async_get_entry(dst.entry_id).data[CONF_TASKS]) == [TASK_ID_2]


# ─── options flow: edit task ──────────────────────────────────────────────


async def _open_edit_form(hass: HomeAssistant, entry: MockConfigEntry) -> dict[str, Any]:
    result = await hass.config_entries.options.async_init(entry.entry_id)
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": "manage_tasks"})
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"selected_task": TASK_ID_1, "go_back": False})
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": "edit_task"})
    assert result["step_id"] == "edit_task"
    return result


def _base_input(**extra: Any) -> dict[str, Any]:
    return {
        CONF_TASK_NAME: "Filter Cleaning",
        CONF_TASK_TYPE: MaintenanceTypeEnum.CLEANING,
        CONF_TASK_INTERVAL_DAYS: 30,
        CONF_TASK_WARNING_DAYS: 7,
        **extra,
    }


async def test_edit_form_refuses_a_malformed_notification_icon(hass: HomeAssistant) -> None:
    obj = await _pool_with_part(hass, {TASK_ID_1: build_task_data(name="Filter Cleaning")})
    before = dict(obj.data[CONF_TASKS][TASK_ID_1])
    result = await _open_edit_form(hass, obj)

    result = await hass.config_entries.options.async_configure(result["flow_id"], _base_input(notify_icon="not an icon!"))

    assert result["type"] == FlowResultType.FORM
    assert result["errors"] == {"notify_icon": "invalid_notify_icon"}
    assert hass.config_entries.async_get_entry(obj.entry_id).data[CONF_TASKS][TASK_ID_1] == before


async def test_edit_form_writes_rotation_labels_units_and_icons(hass: HomeAssistant) -> None:
    alice = await hass.auth.async_create_user("Alice")
    bob = await hass.auth.async_create_user("Bob")
    task = build_task_data(name="Filter Cleaning")
    task["responsible_user_id"] = "user-deleted-long-ago"  # no longer offered by the dropdown
    obj = await _pool_with_part(hass, {TASK_ID_1: task})
    result = await _open_edit_form(hass, obj)
    # The stale assignee must not become the select's default (it would fail
    # the select's own validation and 400 the whole form).
    schema_defaults = {str(k): k.default() for k in result["data_schema"].schema if hasattr(k, "default") and callable(k.default)}
    assert schema_defaults["responsible_user_id"] == ""

    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        _base_input(
            interval_unit="weeks",
            earliest_completion_days=2,
            assignee_pool=[alice.id, bob.id],
            rotation_strategy="round_robin",
            labels_text="Outdoor, pool ,Outdoor",
            notify_icon=" mdi:pool ",
            reading_unit=" bar ",
        ),
    )

    assert result["type"] == FlowResultType.MENU
    stored = hass.config_entries.async_get_entry(obj.entry_id).data[CONF_TASKS][TASK_ID_1]
    assert stored["schedule"]["unit"] == "weeks"
    assert stored["earliest_completion_days"] == 2
    assert stored["assignee_pool"] == [alice.id, bob.id]
    assert stored["rotation_strategy"] == "round_robin"
    assert stored["labels"] == ["Outdoor", "pool"]
    assert stored["notify_icon"] == "mdi:pool"
    assert stored["reading_unit"] == "bar"

    # Clearing the reading unit removes it again.
    result = await _open_edit_form(hass, obj)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], _base_input(interval_unit="weeks", reading_unit="", notify_icon="")
    )
    stored = hass.config_entries.async_get_entry(obj.entry_id).data[CONF_TASKS][TASK_ID_1]
    assert "reading_unit" not in stored
    assert "notify_icon" not in stored


async def test_phase_editor_go_back_changes_nothing(hass: HomeAssistant) -> None:
    obj = await _pool_with_part(hass, {TASK_ID_1: build_task_data(name="Filter Cleaning")})
    before = dict(obj.data[CONF_TASKS][TASK_ID_1])
    result = await hass.config_entries.options.async_init(obj.entry_id)
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": "manage_tasks"})
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"selected_task": TASK_ID_1, "go_back": False})
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": "edit_phases"})
    assert result["step_id"] == "edit_phases"

    result = await hass.config_entries.options.async_configure(result["flow_id"], {"phases_text": "Rinse\nSwap", "go_back": True})

    assert result["type"] == FlowResultType.MENU and result["step_id"] == "task_action"
    assert hass.config_entries.async_get_entry(obj.entry_id).data[CONF_TASKS][TASK_ID_1] == before
