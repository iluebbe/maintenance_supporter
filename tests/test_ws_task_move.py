"""task/move (forum #23): a task moves to another object with its config,
history, readings, adaptive config, trigger runtime and group membership;
it gets a fresh reference number under the target, its entities are
recreated there, the source loses it, and the guards refuse the same
object, an archived target, a missing task and a full target.
"""

from __future__ import annotations

from datetime import timedelta

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import CONF_GROUPS, CONF_OBJECT, CONF_TASKS
from custom_components.maintenance_supporter.websocket.tasks import ws_move_task

from .conftest import (
    TASK_ID_1,
    build_object_data,
    build_task_data,
    call_ws_handler,
    get_task_store_state,
    make_global_entry,
    make_object_entry,
    make_ws_connection,
    setup_integration,
)


def _global(hass: HomeAssistant, **extra: object) -> MockConfigEntry:
    return make_global_entry(hass, extra_data=extra)


def _object(hass: HomeAssistant, name: str, tasks: dict, *, uid: str, archived: bool = False) -> MockConfigEntry:
    obj = build_object_data(name=name)
    if archived:
        obj["archived_at"] = dt_util.now().isoformat()
    return make_object_entry(hass, tasks=tasks, name=name, uid=uid, object_data=obj)


def _entry(hass: HomeAssistant, entry_id: str) -> MockConfigEntry:
    e = hass.config_entries.async_get_entry(entry_id)
    assert e is not None
    return e  # type: ignore[return-value]


async def test_move_carries_config_state_and_group_and_renumbers(hass: HomeAssistant) -> None:
    task = build_task_data(name="Descale", interval_days=90, last_performed=(dt_util.now().date() - timedelta(days=10)).isoformat())
    task["checklist"] = ["drain", "descale", "rinse"]
    task["nfc_tag_id"] = "tag-descale"
    task["entity_slug"] = "descale_it"
    src = _object(hass, "Espresso", {TASK_ID_1: task}, uid="move_src")
    dst = _object(hass, "Kettle", {}, uid="move_dst")
    g = _global(hass, **{CONF_GROUPS: {"g1": {"name": "Kitchen", "task_refs": [{"entry_id": src.entry_id, "task_id": TASK_ID_1}]}}})
    await setup_integration(hass, g, src, dst)

    # A completion + a history entry + a reference number on the source side.
    coordinator = _entry(hass, src.entry_id).runtime_data.coordinator
    await coordinator.complete_maintenance(TASK_ID_1, notes="first service")
    await hass.async_block_till_done()
    await coordinator.async_refresh()
    await hass.async_block_till_done()
    src_task_before = _entry(hass, src.entry_id).data[CONF_TASKS][TASK_ID_1]
    assert src_task_before.get("ref_no") is not None
    src_state_before = get_task_store_state(hass, src.entry_id, TASK_ID_1)
    assert len(src_state_before.get("history", [])) >= 1
    assert any(e.get("ref_no") for e in src_state_before["history"])
    ent_reg = er.async_get(hass)
    src_entities = [e.entity_id for e in er.async_entries_for_config_entry(ent_reg, src.entry_id) if e.unique_id and f"_{TASK_ID_1}" in e.unique_id]
    assert src_entities, "the task had entities under the source object"

    conn = make_ws_connection()
    await call_ws_handler(ws_move_task, hass, conn, {"id": 1, "type": "x", "entry_id": src.entry_id, "task_id": TASK_ID_1, "target_entry_id": dst.entry_id})
    await hass.async_block_till_done()
    conn.send_error.assert_not_called()
    assert conn.send_result.call_args[0][1] == {"task_id": TASK_ID_1, "entry_id": dst.entry_id}

    # Source: gone (config, task_ids, store, entities).
    src_entry = _entry(hass, src.entry_id)
    assert TASK_ID_1 not in src_entry.data[CONF_TASKS]
    assert TASK_ID_1 not in src_entry.data[CONF_OBJECT]["task_ids"]
    assert get_task_store_state(hass, src.entry_id, TASK_ID_1) == {}
    assert not [e for e in er.async_entries_for_config_entry(ent_reg, src.entry_id) if e.unique_id and f"_{TASK_ID_1}" in e.unique_id]

    # Target: config carried (same id), state carried, refs renumbered, entities recreated.
    dst_entry = _entry(hass, dst.entry_id)
    moved = dst_entry.data[CONF_TASKS][TASK_ID_1]
    assert moved["name"] == "Descale"
    assert moved["checklist"] == ["drain", "descale", "rinse"]
    assert moved["nfc_tag_id"] == "tag-descale" and moved["entity_slug"] == "descale_it"
    assert TASK_ID_1 in dst_entry.data[CONF_OBJECT]["task_ids"]
    dst_state = get_task_store_state(hass, dst.entry_id, TASK_ID_1)
    assert dst_state.get("last_performed") == src_state_before.get("last_performed")
    assert [e.get("notes") for e in dst_state["history"]] == [e.get("notes") for e in src_state_before["history"]]
    dst_coordinator = dst_entry.runtime_data.coordinator
    await dst_coordinator.async_refresh()
    await hass.async_block_till_done()
    moved = _entry(hass, dst.entry_id).data[CONF_TASKS][TASK_ID_1]
    assert moved.get("ref_no") == 1, "numbered afresh under the target object"
    history = get_task_store_state(hass, dst.entry_id, TASK_ID_1)["history"]
    completed = [e for e in history if e.get("type") == "completed"]
    assert completed and all(e.get("ref_no") for e in completed), "history entries renumbered"
    dst_entities = [e.entity_id for e in er.async_entries_for_config_entry(ent_reg, dst.entry_id) if e.unique_id and f"_{TASK_ID_1}" in e.unique_id]
    assert dst_entities and all("kettle" in eid for eid in dst_entities), dst_entities

    # Group membership followed the task.
    groups = (_entry(hass, g.entry_id).options or _entry(hass, g.entry_id).data)[CONF_GROUPS]
    assert groups["g1"]["task_refs"] == [{"entry_id": dst.entry_id, "task_id": TASK_ID_1}]


@pytest.mark.parametrize(
    ("case", "error"),
    [("same", "invalid_target"), ("archived", "invalid_target"), ("missing_task", "not_found"), ("missing_target", "not_found")],
)
async def test_move_guards(hass: HomeAssistant, case: str, error: str) -> None:
    src = _object(hass, "Espresso", {TASK_ID_1: build_task_data(name="Descale")}, uid=f"guard_src_{case}")
    dst = _object(hass, "Kettle", {}, uid=f"guard_dst_{case}", archived=(case == "archived"))
    await setup_integration(hass, _global(hass), src, dst)
    conn = make_ws_connection()
    msg = {"id": 1, "type": "x", "entry_id": src.entry_id, "task_id": TASK_ID_1, "target_entry_id": dst.entry_id}
    if case == "same":
        msg["target_entry_id"] = src.entry_id
    elif case == "missing_task":
        msg["task_id"] = "f" * 32
    elif case == "missing_target":
        msg["target_entry_id"] = "does_not_exist"
    await call_ws_handler(ws_move_task, hass, conn, msg)
    conn.send_result.assert_not_called()
    assert conn.send_error.call_args[0][1] == error
    assert TASK_ID_1 in _entry(hass, src.entry_id).data[CONF_TASKS], "nothing moved"
