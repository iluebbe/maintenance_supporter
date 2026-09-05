"""Tests for the completion-photo feature.

Completion photos are uploaded to the DocumentStore (tagged "photo") and
their ``doc_id``s are recorded on the task's COMPLETED history entry as
``photo_doc_ids`` (#161: several per completion) + linked back to the task.
Covers:
- the read helper (list form, the pre-2.75 ``photo_doc_id`` scalar, both),
- the model (``complete(photo_doc_ids=...)`` writes the key; absent otherwise),
- the WS ``task/complete`` path (history entry carries the list; every doc
  gets task-linked; the legacy scalar from an older client is folded in),
- best-effort linking (an unknown doc_id must not fail the completion),
- editing the photos of an existing entry (history/update),
- JSON export/import re-pointing photos + part ``doc_id`` at the fresh ids.
"""

from __future__ import annotations

import json
from unittest.mock import MagicMock

from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter import DOCUMENT_STORE_KEY
from custom_components.maintenance_supporter.const import (
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    HistoryEntryType,
)
from custom_components.maintenance_supporter.helpers.completion_photos import (
    MAX_COMPLETION_PHOTOS,
    history_photo_ids,
    normalize_photo_doc_ids,
)
from custom_components.maintenance_supporter.helpers.completion_requirements import (
    missing_completion_fields,
)
from custom_components.maintenance_supporter.helpers.documents import DocumentStore
from custom_components.maintenance_supporter.models.maintenance_task import (
    MaintenanceTask,
)
from custom_components.maintenance_supporter.websocket.objects import ws_get_object
from custom_components.maintenance_supporter.websocket.tasks_actions import (
    ws_complete_task,
)
from custom_components.maintenance_supporter.websocket.tasks_history import (
    ws_update_history_entry,
)

from .conftest import (
    make_ws_connection as _conn,
    OBJECT_ID_1,
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    setup_integration,
)


# ─── Read helper ────────────────────────────────────────────────────────────


def test_normalize_dedupes_strips_and_caps() -> None:
    ids = [" a ", "b", "a", "", None, 7, "c"]
    assert normalize_photo_doc_ids(ids) == ["a", "b", "c"]
    # The legacy scalar goes FIRST and is de-duplicated against the list.
    assert normalize_photo_doc_ids(["b", "a"], legacy="a") == ["a", "b"]
    assert normalize_photo_doc_ids(None, legacy="only") == ["only"]
    assert normalize_photo_doc_ids(None) == []
    # A bare string is not a list of ids.
    assert normalize_photo_doc_ids("abc") == []  # type: ignore[arg-type]
    many = [f"d{i}" for i in range(MAX_COMPLETION_PHOTOS + 5)]
    assert len(normalize_photo_doc_ids(many)) == MAX_COMPLETION_PHOTOS


def test_history_photo_ids_reads_both_shapes() -> None:
    assert history_photo_ids({"photo_doc_id": "old"}) == ["old"]
    assert history_photo_ids({"photo_doc_ids": ["x", "y"]}) == ["x", "y"]
    assert history_photo_ids({"photo_doc_id": "old", "photo_doc_ids": ["x", "old"]}) == ["old", "x"]
    assert history_photo_ids({"photo_doc_ids": "not-a-list"}) == []
    assert history_photo_ids({"type": "completed"}) == []


def test_photo_requirement_counts_any_photo() -> None:
    task = {"required_completion_fields": ["photo"]}
    assert missing_completion_fields(task) == ["photo"]
    assert missing_completion_fields(task, photo_doc_ids=[]) == ["photo"]
    assert missing_completion_fields(task, photo_doc_ids=["doc-1"]) == []


# ─── Model ──────────────────────────────────────────────────────────────────


def test_complete_records_photo_doc_ids() -> None:
    task = MaintenanceTask(name="X")
    task.complete(photo_doc_ids=["doc-abc", "doc-def"])
    entry = task.history[-1]
    assert entry["type"] == HistoryEntryType.COMPLETED
    assert entry["photo_doc_ids"] == ["doc-abc", "doc-def"]
    # The list form is the only one written — never the legacy scalar.
    assert "photo_doc_id" not in entry


def test_complete_without_photo_omits_key() -> None:
    task = MaintenanceTask(name="X")
    task.complete()
    assert "photo_doc_ids" not in task.history[-1]
    task.complete(photo_doc_ids=[])
    assert "photo_doc_ids" not in task.history[-1]


# ─── WS + coordinator ───────────────────────────────────────────────────────


def _global(hass: HomeAssistant) -> MockConfigEntry:
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


def _object(hass: HomeAssistant, history: list[dict] | None = None) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Pool Pump",
        data=build_object_entry_data(
            object_data=build_object_data(name="Pool Pump"),
            tasks={TASK_ID_1: build_task_data(last_performed="2024-06-01", history=history)},
        ),
        source="user",
        unique_id="maintenance_supporter_photo_obj",
    )
    entry.add_to_hass(hass)
    return entry


async def _history(hass: HomeAssistant, obj: MockConfigEntry) -> list[dict]:
    conn = _conn()
    await call_ws_handler(
        ws_get_object,
        hass,
        conn,
        {
            "id": 9,
            "type": "maintenance_supporter/object",
            "entry_id": obj.entry_id,
        },
    )
    tasks = conn.send_result.call_args[0][1]["tasks"]
    task = next(t for t in tasks if t["id"] == TASK_ID_1)
    return task["history"]


async def _add_photo(store: DocumentStore, content: bytes) -> str:
    doc = await store.async_add_file(
        OBJECT_ID_1,
        content=content,
        filename="done.png",
        mime="image/png",
        tags=["photo"],
    )
    return doc["id"]


async def _complete(hass: HomeAssistant, obj: MockConfigEntry, **extra: object) -> MagicMock:
    conn = _conn()
    await call_ws_handler(
        ws_complete_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/complete",
            "entry_id": obj.entry_id,
            "task_id": TASK_ID_1,
            **extra,
        },
    )
    return conn


async def test_ws_complete_with_photos_links_every_doc(hass: HomeAssistant) -> None:
    global_entry = _global(hass)
    obj = _object(hass)
    await setup_integration(hass, global_entry, obj)
    store: DocumentStore = hass.data[DOMAIN][DOCUMENT_STORE_KEY]
    first = await _add_photo(store, b"\x89PNG one")
    second = await _add_photo(store, b"\x89PNG two")

    # The real schema must accept the list (call_ws_handler bypasses it).
    ws_complete_task._ws_schema(  # type: ignore[attr-defined]
        {
            "id": 1,
            "type": "maintenance_supporter/task/complete",
            "entry_id": obj.entry_id,
            "task_id": TASK_ID_1,
            "photo_doc_ids": [first, second],
        }
    )
    conn = await _complete(hass, obj, photo_doc_ids=[first, second])
    conn.send_result.assert_called_once()

    completed = [h for h in await _history(hass, obj) if h["type"] == HistoryEntryType.COMPLETED]
    assert completed and completed[-1]["photo_doc_ids"] == [first, second]
    assert "photo_doc_id" not in completed[-1]

    # Both photo docs are now linked back to the task.
    for doc_id in (first, second):
        linked = store.get(doc_id)
        assert linked is not None
        assert TASK_ID_1 in (linked.get("task_ids") or [])


async def test_ws_complete_accepts_legacy_scalar_from_old_clients(hass: HomeAssistant) -> None:
    """A pre-2.75 dialog still sends ``photo_doc_id`` — it lands in the list."""
    global_entry = _global(hass)
    obj = _object(hass)
    await setup_integration(hass, global_entry, obj)
    store: DocumentStore = hass.data[DOMAIN][DOCUMENT_STORE_KEY]
    doc_id = await _add_photo(store, b"\x89PNG legacy")

    conn = await _complete(hass, obj, photo_doc_id=doc_id)
    conn.send_result.assert_called_once()
    completed = [h for h in await _history(hass, obj) if h["type"] == HistoryEntryType.COMPLETED]
    assert completed[-1]["photo_doc_ids"] == [doc_id]
    assert TASK_ID_1 in (store.get(doc_id) or {}).get("task_ids", [])


def test_ws_complete_schema_caps_the_photo_list() -> None:
    import pytest
    import voluptuous as vol

    base = {"id": 1, "type": "maintenance_supporter/task/complete", "entry_id": "e", "task_id": "t"}
    ws_complete_task._ws_schema({**base, "photo_doc_ids": None})  # type: ignore[attr-defined]
    ws_complete_task._ws_schema({**base, "photo_doc_ids": ["a"] * MAX_COMPLETION_PHOTOS})  # type: ignore[attr-defined]
    with pytest.raises(vol.Invalid):
        ws_complete_task._ws_schema({**base, "photo_doc_ids": ["a"] * (MAX_COMPLETION_PHOTOS + 1)})  # type: ignore[attr-defined]
    with pytest.raises(vol.Invalid):
        ws_complete_task._ws_schema({**base, "photo_doc_ids": "not-a-list"})  # type: ignore[attr-defined]


async def test_ws_complete_with_unknown_photo_still_completes(
    hass: HomeAssistant,
) -> None:
    global_entry = _global(hass)
    obj = _object(hass)
    await setup_integration(hass, global_entry, obj)

    conn = await _complete(hass, obj, photo_doc_ids=["does-not-exist"])
    # Completion succeeds; the (unknown) id is still recorded on the entry.
    conn.send_result.assert_called_once()
    completed = [h for h in await _history(hass, obj) if h["type"] == HistoryEntryType.COMPLETED]
    assert completed and completed[-1]["photo_doc_ids"] == ["does-not-exist"]


# ─── History edit (#161: add / remove photos after the fact) ────────────────


async def _patch_photos(hass: HomeAssistant, obj: MockConfigEntry, ts: str, photos: object) -> MagicMock:
    conn = _conn()
    await call_ws_handler(
        ws_update_history_entry,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/history/update",
            "entry_id": obj.entry_id,
            "task_id": TASK_ID_1,
            "original_timestamp": ts,
            "photo_doc_ids": photos,
        },
    )
    return conn


async def test_history_edit_adds_and_links_new_photos(hass: HomeAssistant) -> None:
    ts = "2024-06-01T10:00:00+00:00"
    global_entry = _global(hass)
    obj = _object(hass, history=[{"timestamp": ts, "type": HistoryEntryType.COMPLETED, "photo_doc_id": "old-scalar"}])
    await setup_integration(hass, global_entry, obj)
    store: DocumentStore = hass.data[DOMAIN][DOCUMENT_STORE_KEY]
    added = await _add_photo(store, b"\x89PNG later")

    ws_update_history_entry._ws_schema(  # type: ignore[attr-defined]
        {
            "id": 1,
            "type": "maintenance_supporter/task/history/update",
            "entry_id": obj.entry_id,
            "task_id": TASK_ID_1,
            "original_timestamp": ts,
            "photo_doc_ids": ["old-scalar", added],
        }
    )
    conn = await _patch_photos(hass, obj, ts, ["old-scalar", added])
    assert not conn.send_error.called, conn.send_error.call_args

    saved = obj.runtime_data.store.get_history(TASK_ID_1)[0]
    # The legacy scalar is folded into the list the moment the entry is edited.
    assert saved["photo_doc_ids"] == ["old-scalar", added]
    assert "photo_doc_id" not in saved
    # The newly attached photo is linked to the task like a live completion.
    assert TASK_ID_1 in (store.get(added) or {}).get("task_ids", [])


async def test_history_edit_removing_a_photo_keeps_the_document(hass: HomeAssistant) -> None:
    ts = "2024-06-01T10:00:00+00:00"
    global_entry = _global(hass)
    obj = _object(hass)
    await setup_integration(hass, global_entry, obj)
    store: DocumentStore = hass.data[DOMAIN][DOCUMENT_STORE_KEY]
    keep = await _add_photo(store, b"\x89PNG keep")
    drop = await _add_photo(store, b"\x89PNG drop")
    obj.runtime_data.store.set_history(
        TASK_ID_1, [{"timestamp": ts, "type": HistoryEntryType.COMPLETED, "photo_doc_ids": [keep, drop]}]
    )

    conn = await _patch_photos(hass, obj, ts, [keep])
    assert not conn.send_error.called, conn.send_error.call_args
    saved = obj.runtime_data.store.get_history(TASK_ID_1)[0]
    assert saved["photo_doc_ids"] == [keep]
    # Detaching is not deleting: the picture is still in the object's documents.
    assert store.get(drop) is not None

    # None (or []) clears the key entirely.
    conn = await _patch_photos(hass, obj, ts, None)
    assert not conn.send_error.called
    saved = obj.runtime_data.store.get_history(TASK_ID_1)[0]
    assert "photo_doc_ids" not in saved and "photo_doc_id" not in saved
    assert store.get(keep) is not None


# ─── JSON export / import: photos survive the id regeneration ───────────────


async def test_export_import_repoints_photos_and_part_docs(hass: HomeAssistant) -> None:
    """ROADMAP known-bug: history photos and part ``doc_id`` pointed at the OLD
    document ids after an import (fresh ids are minted). The export now carries
    each doc's id and the importer remaps both references."""
    from custom_components.maintenance_supporter.export import build_export_data
    from custom_components.maintenance_supporter.websocket.io import ws_import_json

    ts = "2024-06-01T10:00:00+00:00"
    global_entry = _global(hass)
    obj = _object(hass)
    await setup_integration(hass, global_entry, obj)
    store: DocumentStore = hass.data[DOMAIN][DOCUMENT_STORE_KEY]
    photo = await _add_photo(store, b"\x89PNG export")
    legacy = await _add_photo(store, b"\x89PNG legacy export")
    manual = await store.async_add_file(OBJECT_ID_1, content=b"pdf", filename="m.pdf", mime="application/pdf", tags=["manual"])
    obj.runtime_data.store.set_history(
        TASK_ID_1,
        [
            {"timestamp": ts, "type": HistoryEntryType.COMPLETED, "photo_doc_ids": [photo, "gone-before-export"]},
            {"timestamp": "2024-05-01T10:00:00+00:00", "type": HistoryEntryType.COMPLETED, "photo_doc_id": legacy},
        ],
    )
    await obj.runtime_data.store.async_save()
    # A spare part pointing at the manual by doc id.
    hass.config_entries.async_update_entry(
        obj,
        data={**obj.data, "parts": {"part-1": {"id": "part-1", "name": "Filter", "doc_id": manual["id"]}}},
    )
    await hass.async_block_till_done()

    data = build_export_data(hass)
    obj_export = next(o for o in data["objects"] if o["entry_id"] == obj.entry_id)
    assert {d["id"] for d in obj_export["documents"]} == {photo, legacy, manual["id"]}

    conn = _conn()
    await call_ws_handler(ws_import_json, hass, conn, {"id": 1, "type": "x", "json_content": json.dumps(data)})
    await hass.async_block_till_done()
    result = conn.send_result.call_args[0][1]
    assert result["created"] == 1, result
    new_entry = hass.config_entries.async_get_entry(result["imported"][0]["entry_id"])
    assert new_entry is not None

    new_docs = {d["id"] for d in store.for_object(new_entry.data["object"]["id"])}
    assert len(new_docs) == 3 and not (new_docs & {photo, legacy, manual["id"]})

    new_task = next(iter(new_entry.runtime_data.coordinator._get_merged_tasks_data().values()))
    completed = sorted(
        (h for h in new_task["history"] if h["type"] == HistoryEntryType.COMPLETED), key=lambda h: h["timestamp"]
    )
    # Legacy scalar → list on import; every carried id re-pointed; an id the
    # export could not resolve stays verbatim (dangling, not silently dropped).
    assert history_photo_ids(completed[0]) and history_photo_ids(completed[0])[0] in new_docs
    assert "photo_doc_id" not in completed[0]
    new_photos = completed[1]["photo_doc_ids"]
    assert new_photos[0] in new_docs and new_photos[0] != photo
    assert new_photos[1] == "gone-before-export"
    new_part = next(iter(new_entry.data["parts"].values()))
    assert new_part["doc_id"] in new_docs and new_part["doc_id"] != manual["id"]


async def test_failed_import_does_not_leave_orphan_documents(hass: HomeAssistant, monkeypatch) -> None:
    """Documents are recreated BEFORE the entry flow (their fresh ids feed the
    remap) — if the flow then fails they must be rolled back."""
    from custom_components.maintenance_supporter.export import build_export_data
    from custom_components.maintenance_supporter.websocket.io import ws_import_json

    global_entry = _global(hass)
    obj = _object(hass)
    await setup_integration(hass, global_entry, obj)
    store: DocumentStore = hass.data[DOMAIN][DOCUMENT_STORE_KEY]
    await _add_photo(store, b"\x89PNG orphan?")
    before = len(store.documents)
    data = build_export_data(hass)

    async def _boom(*args: object, **kwargs: object) -> None:
        raise RuntimeError("flow exploded")

    monkeypatch.setattr(hass.config_entries.flow, "async_init", _boom)
    conn = _conn()
    await call_ws_handler(ws_import_json, hass, conn, {"id": 1, "type": "x", "json_content": json.dumps(data)})
    await hass.async_block_till_done()
    result = conn.send_result.call_args[0][1]
    assert result["created"] == 0 and result["errors"]
    assert len(store.documents) == before
