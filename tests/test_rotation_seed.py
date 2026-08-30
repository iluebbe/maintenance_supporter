"""Rotation tasks always carry an effective assignee (discussion #49).

The rotation resolves "who is on duty" into ``responsible_user_id`` — the
field every user filter reads (panel, Lovelace card, calendar card, saved
views, per-user notifications). A rotation configured WITHOUT an initial
assignee was invisible to all of them until its first completion ran
``advance_rotation``. These tests pin the seeding on every write path
(WS create, WS update, pool edits) and the 3→4 migration for stored tasks.
"""

from __future__ import annotations

from typing import Any

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import CONF_TASKS, DOMAIN, GLOBAL_UNIQUE_ID
from custom_components.maintenance_supporter.helpers.sanitize import seed_rotation_assignee
from custom_components.maintenance_supporter.websocket.tasks_crud import ws_create_task, ws_update_task

from .conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    make_ws_connection,
    setup_integration,
)


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


def _make_object_entry(hass: HomeAssistant, task: dict[str, Any] | None, minor_version: int = 1) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1,
        minor_version=minor_version,
        domain=DOMAIN,
        title="Kitchen Bin",
        data=build_object_entry_data(
            object_data=build_object_data(name="Kitchen Bin", object_id="objid_bin"),
            tasks={TASK_ID_1: task} if task else {},
        ),
        source="user",
        unique_id="maintenance_supporter_kitchen_bin",
    )
    entry.add_to_hass(hass)
    return entry


def _task_data(hass: HomeAssistant, entry_id: str, task_id: str) -> dict[str, Any]:
    entry = hass.config_entries.async_get_entry(entry_id)
    assert entry is not None
    task: dict[str, Any] = entry.data[CONF_TASKS][task_id]
    return task


# ── Pure helper ─────────────────────────────────────────────────────────────


def test_seed_helper_edge_cases() -> None:
    """No seeding without an ACTIVE rotation; existing in-pool assignee wins."""
    # Plain task: never touched.
    td: dict[str, Any] = {"name": "x"}
    seed_rotation_assignee(td)
    assert "responsible_user_id" not in td

    # Pool of one: rotation is inert, no seed.
    td = {"assignee_pool": ["a"], "rotation_strategy": "round_robin"}
    seed_rotation_assignee(td)
    assert "responsible_user_id" not in td

    # Pool without strategy: plain multi-assign candidates, no seed.
    td = {"assignee_pool": ["a", "b"]}
    seed_rotation_assignee(td)
    assert "responsible_user_id" not in td

    # Active rotation, no assignee: first pool member.
    td = {"assignee_pool": ["a", "b"], "rotation_strategy": "round_robin"}
    seed_rotation_assignee(td)
    assert td["responsible_user_id"] == "a"

    # Existing in-pool assignee is preserved.
    td = {"assignee_pool": ["a", "b"], "rotation_strategy": "round_robin", "responsible_user_id": "b"}
    seed_rotation_assignee(td)
    assert td["responsible_user_id"] == "b"

    # Assignee no longer in the pool: reseeded to a pool member.
    td = {"assignee_pool": ["a", "b"], "rotation_strategy": "least_completed", "responsible_user_id": "ghost"}
    seed_rotation_assignee(td)
    assert td["responsible_user_id"] == "a"

    # Pool edited down to ONE member with a now-removed assignee: the stale
    # assignee must still be corrected — the old len<2 early-return kept the
    # task on the removed user forever (bug audit 2026-08-22).
    td = {"assignee_pool": ["a"], "rotation_strategy": "round_robin", "responsible_user_id": "removed"}
    seed_rotation_assignee(td)
    assert td["responsible_user_id"] == "a"


# ── WS create ───────────────────────────────────────────────────────────────


async def test_create_rotation_without_assignee_seeds_first_pool_member(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    a = await hass.auth.async_create_user("Alice")
    b = await hass.auth.async_create_user("Bob")
    obj = _make_object_entry(hass, task=None)
    await setup_integration(hass, global_entry, obj)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_create_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "x",
            "entry_id": obj.entry_id,
            "name": "Take out bins",
            "task_type": "cleaning",
            "interval_days": 7,
            "assignee_pool": [a.id, b.id],
            "rotation_strategy": "round_robin",
        },
    )
    assert not conn.send_error.called, conn.send_error.call_args
    task_id = conn.send_result.call_args[0][1]["task_id"]
    task = _task_data(hass, obj.entry_id, task_id)
    assert task["responsible_user_id"] == a.id


async def test_create_without_rotation_stays_unassigned(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    obj = _make_object_entry(hass, task=None)
    await setup_integration(hass, global_entry, obj)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_create_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "x",
            "entry_id": obj.entry_id,
            "name": "Take out bins",
            "task_type": "cleaning",
            "interval_days": 7,
        },
    )
    assert not conn.send_error.called, conn.send_error.call_args
    task_id = conn.send_result.call_args[0][1]["task_id"]
    assert _task_data(hass, obj.entry_id, task_id).get("responsible_user_id") is None


# ── WS update ───────────────────────────────────────────────────────────────


async def test_update_adding_rotation_seeds_assignee(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    a = await hass.auth.async_create_user("Alice")
    b = await hass.auth.async_create_user("Bob")
    task = build_task_data(interval_days=30)
    obj = _make_object_entry(hass, task=task)
    await setup_integration(hass, global_entry, obj)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_update_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "x",
            "entry_id": obj.entry_id,
            "task_id": TASK_ID_1,
            "assignee_pool": [a.id, b.id],
            "rotation_strategy": "round_robin",
        },
    )
    assert not conn.send_error.called, conn.send_error.call_args
    assert _task_data(hass, obj.entry_id, TASK_ID_1)["responsible_user_id"] == a.id


async def test_update_pool_removal_reseeds_to_remaining_member(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """The current assignee is edited OUT of the pool → rotate to a member
    instead of leaving a pool-foreign (or dangling) assignee behind."""
    a = await hass.auth.async_create_user("Alice")
    b = await hass.auth.async_create_user("Bob")
    c = await hass.auth.async_create_user("Cara")
    task = build_task_data(interval_days=30)
    task["assignee_pool"] = [a.id, b.id, c.id]
    task["rotation_strategy"] = "round_robin"
    task["responsible_user_id"] = a.id
    obj = _make_object_entry(hass, task=task)
    await setup_integration(hass, global_entry, obj)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_update_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "x",
            "entry_id": obj.entry_id,
            "task_id": TASK_ID_1,
            "assignee_pool": [b.id, c.id],
            "rotation_strategy": "round_robin",
        },
    )
    assert not conn.send_error.called, conn.send_error.call_args
    assert _task_data(hass, obj.entry_id, TASK_ID_1)["responsible_user_id"] == b.id


async def test_update_keeps_existing_in_pool_assignee(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    a = await hass.auth.async_create_user("Alice")
    b = await hass.auth.async_create_user("Bob")
    task = build_task_data(interval_days=30)
    task["assignee_pool"] = [a.id, b.id]
    task["rotation_strategy"] = "round_robin"
    task["responsible_user_id"] = b.id
    obj = _make_object_entry(hass, task=task)
    await setup_integration(hass, global_entry, obj)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_update_task,
        hass,
        conn,
        {"id": 1, "type": "x", "entry_id": obj.entry_id, "task_id": TASK_ID_1, "notes": "unrelated edit"},
    )
    assert not conn.send_error.called, conn.send_error.call_args
    assert _task_data(hass, obj.entry_id, TASK_ID_1)["responsible_user_id"] == b.id


# ── Migration 3 → 4 ─────────────────────────────────────────────────────────


async def test_migration_seeds_stored_rotation_tasks(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Existing installs: a stored rotation task without an assignee gets one
    on the 3→4 migration; a plain unassigned task stays unassigned."""
    a = await hass.auth.async_create_user("Alice")
    b = await hass.auth.async_create_user("Bob")
    rotation_task = build_task_data(task_id=TASK_ID_1, interval_days=30)
    rotation_task["assignee_pool"] = [a.id, b.id]
    rotation_task["rotation_strategy"] = "round_robin"
    plain_task = build_task_data(task_id="task2", name="Plain", interval_days=30)

    entry = MockConfigEntry(
        version=1,
        minor_version=3,
        domain=DOMAIN,
        title="Kitchen Bin",
        data=build_object_entry_data(
            object_data=build_object_data(name="Kitchen Bin", object_id="objid_bin"),
            tasks={TASK_ID_1: rotation_task, "task2": plain_task},
        ),
        source="user",
        unique_id="maintenance_supporter_kitchen_bin",
    )
    entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, entry)

    migrated = hass.config_entries.async_get_entry(entry.entry_id)
    assert migrated is not None
    assert migrated.minor_version == 6
    assert migrated.data[CONF_TASKS][TASK_ID_1]["responsible_user_id"] == a.id
    assert migrated.data[CONF_TASKS]["task2"].get("responsible_user_id") is None
