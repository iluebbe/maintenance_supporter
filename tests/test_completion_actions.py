"""Tests for v1.3.0 completion-action infrastructure.

Covers two pieces wired together by the EVENT_TASK_COMPLETED bus:

  * helpers.action_listener.register_action_listener — subscribes to
    EVENT_TASK_COMPLETED and dispatches the per-task on_complete_action
    service call. Errors must be swallowed (a broken action must never
    block a completion from being recorded).

  * repairs.StaleActionEntityRepairFlow — replaces or removes a stale
    on_complete_action.target.entity_id reference. Mirrors the existing
    MissingTriggerEntityRepairFlow pattern.

The listener is auto-registered by __init__.py during integration setup
(via setup_integration), so we exercise it through the live event bus
rather than by re-registering manually.
"""

from __future__ import annotations

from typing import Any
from unittest.mock import MagicMock

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_TASKS,
    DOMAIN,
    EVENT_TASK_COMPLETED,
    GLOBAL_UNIQUE_ID,
)
from custom_components.maintenance_supporter.repairs import (
    StaleActionEntityRepairFlow,
    async_create_fix_flow,
)
from custom_components.maintenance_supporter.websocket.tasks import (
    ws_complete_task,
    ws_create_task,
)

from .conftest import (
    build_global_entry_data,
    build_object_entry_data,
    call_ws_handler,
    setup_integration,
)

# ─── Fixtures ──────────────────────────────────────────────────────────


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1, minor_version=2, domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


@pytest.fixture
def object_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1, minor_version=2, domain=DOMAIN,
        title="Air Purifier",
        data=build_object_entry_data(tasks={}),
        source="user",
        unique_id="maintenance_supporter_completion_actions",
    )
    entry.add_to_hass(hass)
    return entry


def _conn() -> MagicMock:
    conn = MagicMock()
    conn.send_result = MagicMock()
    conn.send_error = MagicMock()
    conn.user = MagicMock(is_admin=True)
    return conn


async def _create_task(
    hass: HomeAssistant, entry_id: str, payload: dict[str, Any]
) -> str:
    conn = _conn()
    await call_ws_handler(
        ws_create_task, hass, conn,
        {
            "id": 1, "type": "maintenance_supporter/task/create",
            "entry_id": entry_id, **payload,
        },
    )
    assert conn.send_error.call_count == 0, conn.send_error.call_args
    return conn.send_result.call_args[0][1]["task_id"]


# ─── action_listener: dispatches service-call on completion ─────────────


async def test_action_listener_invokes_configured_service(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Completing a task with on_complete_action triggers the named service."""
    await setup_integration(hass, global_entry, object_entry)

    task_id = await _create_task(
        hass, object_entry.entry_id,
        {
            "name": "Listener happy path",
            "schedule_type": "time_based",
            "interval_days": 30,
            "on_complete_action": {
                "service": "test_listener.ping",
                "target": {"entity_id": "switch.dummy"},
                "data": {"value": 42},
            },
        },
    )

    calls: list[Any] = []

    async def _capture(call: Any) -> None:
        calls.append(call)

    hass.services.async_register("test_listener", "ping", _capture)

    conn = _conn()
    await call_ws_handler(
        ws_complete_task, hass, conn,
        {
            "id": 1, "type": "maintenance_supporter/task/complete",
            "entry_id": object_entry.entry_id, "task_id": task_id,
        },
    )
    assert conn.send_error.call_count == 0
    await hass.async_block_till_done()

    assert len(calls) == 1, "listener should dispatch exactly one service call"
    assert calls[0].domain == "test_listener"
    assert calls[0].service == "ping"
    assert calls[0].data.get("value") == 42


async def test_action_listener_skips_when_no_action_configured(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Tasks without on_complete_action must not fire any service call."""
    await setup_integration(hass, global_entry, object_entry)

    task_id = await _create_task(
        hass, object_entry.entry_id,
        {
            "name": "No action",
            "schedule_type": "time_based",
            "interval_days": 30,
        },
    )

    calls: list[Any] = []

    async def _capture(call: Any) -> None:
        calls.append(call)

    hass.services.async_register("test_listener", "should_not_fire", _capture)

    conn = _conn()
    await call_ws_handler(
        ws_complete_task, hass, conn,
        {
            "id": 1, "type": "maintenance_supporter/task/complete",
            "entry_id": object_entry.entry_id, "task_id": task_id,
        },
    )
    await hass.async_block_till_done()
    assert calls == []


async def test_action_listener_swallows_service_errors(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
    caplog: pytest.LogCaptureFixture,
) -> None:
    """A service-call that raises must not break the completion flow."""
    await setup_integration(hass, global_entry, object_entry)

    task_id = await _create_task(
        hass, object_entry.entry_id,
        {
            "name": "Failing action",
            "schedule_type": "time_based",
            "interval_days": 30,
            "on_complete_action": {
                "service": "test_listener.boom",
            },
        },
    )

    async def _explode(call: Any) -> None:
        raise RuntimeError("kaboom")

    hass.services.async_register("test_listener", "boom", _explode)

    conn = _conn()
    await call_ws_handler(
        ws_complete_task, hass, conn,
        {
            "id": 1, "type": "maintenance_supporter/task/complete",
            "entry_id": object_entry.entry_id, "task_id": task_id,
        },
    )
    await hass.async_block_till_done()

    # ws_complete_task itself must succeed even though the listener exploded.
    assert conn.send_error.call_count == 0


async def test_action_listener_ignores_unknown_service(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """A service that does not exist in HA must not block completion."""
    await setup_integration(hass, global_entry, object_entry)

    task_id = await _create_task(
        hass, object_entry.entry_id,
        {
            "name": "Unknown service",
            "schedule_type": "time_based",
            "interval_days": 30,
            "on_complete_action": {"service": "nonexistent.service"},
        },
    )

    conn = _conn()
    await call_ws_handler(
        ws_complete_task, hass, conn,
        {
            "id": 1, "type": "maintenance_supporter/task/complete",
            "entry_id": object_entry.entry_id, "task_id": task_id,
        },
    )
    await hass.async_block_till_done()
    assert conn.send_error.call_count == 0


async def test_action_listener_runs_only_for_owning_entry(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """An EVENT_TASK_COMPLETED with an unknown entry_id must be a no-op."""
    await setup_integration(hass, global_entry, object_entry)

    calls: list[Any] = []

    async def _capture(call: Any) -> None:
        calls.append(call)

    hass.services.async_register("test_listener", "should_not_fire2", _capture)

    hass.bus.async_fire(EVENT_TASK_COMPLETED, {
        "entry_id": "totally_made_up_entry",
        "task_id": "x" * 32,
        "task_name": "ghost",
    })
    await hass.async_block_till_done()
    assert calls == []


# ─── StaleActionEntityRepairFlow ────────────────────────────────────────


def _make_object_entry_with_action(
    hass: HomeAssistant,
    entity_id: str = "light.dead_target",
    unique_id: str = "stale_action_object",
) -> MockConfigEntry:
    """Object entry with a single time-based task whose on_complete_action
    targets `entity_id` (which the test will leave non-existent in HA).
    """
    from .conftest import (
        TASK_ID_1,
        build_object_data,
        build_task_data,
    )

    task = build_task_data(task_id=TASK_ID_1)
    # build_task_data is schema-shaped already; tack the v1.3.0 field on.
    task["on_complete_action"] = {
        "service": "light.turn_on",
        "target": {"entity_id": entity_id},
    }
    entry = MockConfigEntry(
        version=1, minor_version=2, domain=DOMAIN,
        title="Stale-Action Object",
        data=build_object_entry_data(
            object_data=build_object_data(name="Stale-Action Object"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id=f"maintenance_supporter_{unique_id}",
    )
    entry.add_to_hass(hass)
    return entry


def _make_stale_flow(
    hass: HomeAssistant, entry_id: str, entity_id: str = "light.dead_target",
) -> StaleActionEntityRepairFlow:
    from .conftest import TASK_ID_1
    flow = StaleActionEntityRepairFlow()
    flow.hass = hass
    flow.data = {
        "entry_id": entry_id,
        "task_id": TASK_ID_1,
        "task_name": "Replace filter",
        "stale_entity": entity_id,
    }
    return flow


async def test_stale_action_init_shows_two_options(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """init step exposes replace_entity + remove_action."""
    obj_entry = _make_object_entry_with_action(hass)
    await setup_integration(hass, global_entry, obj_entry)

    flow = _make_stale_flow(hass, obj_entry.entry_id)
    result = await flow.async_step_init()

    assert result["type"] == "menu"
    assert "replace_entity" in result["menu_options"]
    assert "remove_action" in result["menu_options"]


async def test_stale_action_replace_updates_entity_id(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Picking a new entity rewrites on_complete_action.target.entity_id."""
    from .conftest import TASK_ID_1

    obj_entry = _make_object_entry_with_action(hass)
    await setup_integration(hass, global_entry, obj_entry)

    flow = _make_stale_flow(hass, obj_entry.entry_id)
    result = await flow.async_step_replace_entity(
        {"new_entity": "light.new_target"}
    )

    assert result["type"] == "create_entry"
    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    action = entry.data[CONF_TASKS][TASK_ID_1]["on_complete_action"]
    assert action["target"]["entity_id"] == "light.new_target"
    # Service untouched.
    assert action["service"] == "light.turn_on"


async def test_stale_action_remove_drops_action_entirely(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """The remove path strips on_complete_action from the task."""
    from .conftest import TASK_ID_1

    obj_entry = _make_object_entry_with_action(hass)
    await setup_integration(hass, global_entry, obj_entry)

    flow = _make_stale_flow(hass, obj_entry.entry_id)
    result = await flow.async_step_remove_action({})

    assert result["type"] == "create_entry"
    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    task = entry.data[CONF_TASKS][TASK_ID_1]
    assert "on_complete_action" not in task


async def test_stale_action_create_fix_flow_routes_correctly(
    hass: HomeAssistant,
) -> None:
    """async_create_fix_flow returns the right class for a stale_action_*
    issue id (vs the existing trigger / orphan-user flows).
    """
    flow = await async_create_fix_flow(
        hass,
        "stale_action_entity_xyz_taskid_light.gone",
        data={},
    )
    assert isinstance(flow, StaleActionEntityRepairFlow)
