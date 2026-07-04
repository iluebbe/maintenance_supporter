"""Tests for the completion-photo feature.

A completion photo is uploaded to the DocumentStore (tagged "photo"), and its
``doc_id`` is recorded on the task's COMPLETED history entry + linked back to
the task. Covers:
- the model (``complete(photo_doc_id=...)`` writes the key; absent otherwise),
- the WS ``task/complete`` path (history entry carries it; doc gets task-linked),
- best-effort linking (an unknown doc_id must not fail the completion).
"""

from __future__ import annotations

from unittest.mock import MagicMock

from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter import DOCUMENT_STORE_KEY
from custom_components.maintenance_supporter.const import (
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    HistoryEntryType,
)
from custom_components.maintenance_supporter.helpers.documents import DocumentStore
from custom_components.maintenance_supporter.models.maintenance_task import (
    MaintenanceTask,
)
from custom_components.maintenance_supporter.websocket.objects import ws_get_object
from custom_components.maintenance_supporter.websocket.tasks_actions import (
    ws_complete_task,
)

from .conftest import (
    OBJECT_ID_1,
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    setup_integration,
)


# ─── Model ──────────────────────────────────────────────────────────────────


def test_complete_records_photo_doc_id() -> None:
    task = MaintenanceTask(name="X")
    task.complete(photo_doc_id="doc-abc")
    entry = task.history[-1]
    assert entry["type"] == HistoryEntryType.COMPLETED
    assert entry["photo_doc_id"] == "doc-abc"


def test_complete_without_photo_omits_key() -> None:
    task = MaintenanceTask(name="X")
    task.complete()
    assert "photo_doc_id" not in task.history[-1]


# ─── WS + coordinator ───────────────────────────────────────────────────────


def _conn() -> MagicMock:
    conn = MagicMock()
    conn.send_result = MagicMock()
    conn.send_error = MagicMock()
    conn.user = MagicMock(is_admin=True)
    return conn


def _global(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter", data=build_global_entry_data(),
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


def _object(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN, title="Pool Pump",
        data=build_object_entry_data(
            object_data=build_object_data(name="Pool Pump"),
            tasks={TASK_ID_1: build_task_data(last_performed="2024-06-01")},
        ),
        source="user", unique_id="maintenance_supporter_photo_obj",
    )
    entry.add_to_hass(hass)
    return entry


async def _history_after_complete(
    hass: HomeAssistant, obj: MockConfigEntry
) -> list[dict]:
    conn = _conn()
    await call_ws_handler(ws_get_object, hass, conn, {
        "id": 9, "type": "maintenance_supporter/object",
        "entry_id": obj.entry_id,
    })
    tasks = conn.send_result.call_args[0][1]["tasks"]
    task = next(t for t in tasks if t["id"] == TASK_ID_1)
    return task["history"]


async def test_ws_complete_with_photo_links_doc(hass: HomeAssistant) -> None:
    global_entry = _global(hass)
    obj = _object(hass)
    await setup_integration(hass, global_entry, obj)

    store: DocumentStore = hass.data[DOMAIN][DOCUMENT_STORE_KEY]
    doc = await store.async_add_file(
        OBJECT_ID_1, content=b"\x89PNG fake", filename="done.png",
        mime="image/png", tags=["photo"],
    )

    conn = _conn()
    await call_ws_handler(ws_complete_task, hass, conn, {
        "id": 1, "type": "maintenance_supporter/task/complete",
        "entry_id": obj.entry_id, "task_id": TASK_ID_1,
        "photo_doc_id": doc["id"],
    })
    conn.send_result.assert_called_once()

    history = await _history_after_complete(hass, obj)
    completed = [h for h in history if h["type"] == HistoryEntryType.COMPLETED]
    assert completed and completed[-1]["photo_doc_id"] == doc["id"]

    # The photo doc is now linked back to the task.
    linked = store.get(doc["id"])
    assert linked is not None
    assert TASK_ID_1 in (linked.get("task_ids") or [])


async def test_ws_complete_with_unknown_photo_still_completes(
    hass: HomeAssistant,
) -> None:
    global_entry = _global(hass)
    obj = _object(hass)
    await setup_integration(hass, global_entry, obj)

    conn = _conn()
    await call_ws_handler(ws_complete_task, hass, conn, {
        "id": 1, "type": "maintenance_supporter/task/complete",
        "entry_id": obj.entry_id, "task_id": TASK_ID_1,
        "photo_doc_id": "does-not-exist",
    })
    # Completion succeeds; the (unknown) id is still recorded on the entry.
    conn.send_result.assert_called_once()
    history = await _history_after_complete(hass, obj)
    completed = [h for h in history if h["type"] == HistoryEntryType.COMPLETED]
    assert completed and completed[-1]["photo_doc_id"] == "does-not-exist"
