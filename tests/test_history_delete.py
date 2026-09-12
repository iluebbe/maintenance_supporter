"""maintenance_supporter/task/history/delete (#170 round 2).

Pins: the entry named by its timestamp is removed and persisted; deleting
the LATEST completion re-anchors last_performed on the previous lifecycle
entry; deleting the only lifecycle entry clears the Store's anchor (the task
reads as never performed); non-lifecycle entries do not anchor anything;
an unknown timestamp is refused without touching the history; the command
sits in the write tier (registered, permission matrix) and the tasks
package re-exports it.
"""

from __future__ import annotations

from datetime import timedelta
from typing import Any

from homeassistant.components.websocket_api.const import DOMAIN as WS_DOMAIN
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import DOMAIN, GLOBAL_UNIQUE_ID, HistoryEntryType
from custom_components.maintenance_supporter.websocket.tasks import ws_delete_history_entry
from tests.conftest import (
    TASK_ID_1,
    assert_ws_error,
    assert_ws_success,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    make_ws_connection,
    setup_integration,
)


def _entry(days_ago: int, entry_type: str = HistoryEntryType.COMPLETED, **extra: Any) -> dict[str, Any]:
    ts = (dt_util.now() - timedelta(days=days_ago)).isoformat()
    return {"timestamp": ts, "type": entry_type, **extra}


async def _setup(hass: HomeAssistant, history: list[dict[str, Any]]) -> MockConfigEntry:
    g = MockConfigEntry(version=1, minor_version=1, domain=DOMAIN, title="Maintenance Supporter", data=build_global_entry_data(), source="user", unique_id=GLOBAL_UNIQUE_ID)
    g.add_to_hass(hass)
    lifecycle = [h["timestamp"] for h in history if h["type"] in {HistoryEntryType.COMPLETED, HistoryEntryType.RESET, HistoryEntryType.SKIPPED}]
    task = build_task_data(history=history, last_performed=max(lifecycle)[:10] if lifecycle else None)
    obj = MockConfigEntry(version=1, minor_version=2, domain=DOMAIN, title="HistDel", data=build_object_entry_data(object_data=build_object_data(name="HistDel"), tasks={TASK_ID_1: task}), source="user", unique_id="maintenance_supporter_hist_del")
    obj.add_to_hass(hass)
    await setup_integration(hass, g, obj)
    return obj


async def _delete(hass: HomeAssistant, obj: MockConfigEntry, timestamp: str, *, id_: int = 1) -> Any:
    conn = make_ws_connection()
    await call_ws_handler(ws_delete_history_entry, hass, conn, {"id": id_, "type": "maintenance_supporter/task/history/delete", "entry_id": obj.entry_id, "task_id": TASK_ID_1, "timestamp": timestamp})
    return conn


async def test_delete_latest_completion_re_anchors_on_previous(hass: HomeAssistant) -> None:
    older, latest = _entry(40, notes="first"), _entry(5, notes="oops")
    obj = await _setup(hass, [older, latest])
    store = obj.runtime_data.store
    assert store.get_last_performed(TASK_ID_1) == latest["timestamp"][:10]
    conn = await _delete(hass, obj, latest["timestamp"])
    result = assert_ws_success(conn)
    assert result == {"success": True, "remaining": 1}
    assert [h["notes"] for h in store.get_history(TASK_ID_1)] == ["first"]
    assert store.get_last_performed(TASK_ID_1) == older["timestamp"][:10]
    # Persisted: the Store's saved data carries the shortened history.
    assert len(store._get_data()["tasks"][TASK_ID_1]["history"]) == 1


async def test_delete_only_lifecycle_entry_clears_the_anchor(hass: HomeAssistant) -> None:
    only = _entry(3)
    obj = await _setup(hass, [only, _entry(2, HistoryEntryType.TRIGGERED)])
    store = obj.runtime_data.store
    conn = await _delete(hass, obj, only["timestamp"])
    assert assert_ws_success(conn)["remaining"] == 1
    assert store.get_last_performed(TASK_ID_1) is None, "a TRIGGERED entry does not anchor the cycle"
    assert [h["type"] for h in store.get_history(TASK_ID_1)] == [HistoryEntryType.TRIGGERED]


async def test_delete_older_entry_keeps_the_anchor(hass: HomeAssistant) -> None:
    older, latest = _entry(40), _entry(5)
    obj = await _setup(hass, [older, latest])
    store = obj.runtime_data.store
    conn = await _delete(hass, obj, older["timestamp"])
    assert_ws_success(conn)
    assert store.get_last_performed(TASK_ID_1) == latest["timestamp"][:10]


async def test_unknown_timestamp_is_refused(hass: HomeAssistant) -> None:
    only = _entry(3)
    obj = await _setup(hass, [only])
    store = obj.runtime_data.store
    conn = await _delete(hass, obj, "2001-01-01T00:00:00+00:00")
    assert_ws_error(conn, "not_found")
    assert len(store.get_history(TASK_ID_1)) == 1


async def test_delete_is_registered_and_re_exported(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.websocket import tasks

    assert "ws_delete_history_entry" in tasks.__all__
    obj = await _setup(hass, [_entry(1)])
    assert obj.state.name == "LOADED"
    assert "maintenance_supporter/task/history/delete" in hass.data[WS_DOMAIN]
