"""Document references outside the document store (DRY/drift round 2026-09-12).

Pins: ``doc_wire_dict`` is the one record the JSON export and the documents
ZIP archive write — the archive now carries ``id`` and ``task_pages`` like
the export; a ZIP restore re-points completion photos and part ``doc_id``
links at the fresh ids; deleting a document strips its id from every
history entry's ``photo_doc_ids`` and every part's ``doc_id``
(``async_forget_doc_ids``) instead of leaving them dangling.
"""

from __future__ import annotations

import io
import json
import zipfile

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter import DOCUMENT_STORE_KEY
from custom_components.maintenance_supporter.const import CONF_PARTS, CONF_TASKS, DOMAIN, HistoryEntryType
from custom_components.maintenance_supporter.export import _export_documents
from custom_components.maintenance_supporter.helpers import doc_archive
from custom_components.maintenance_supporter.helpers.documents import DocumentStore, async_forget_doc_ids, doc_wire_dict
from custom_components.maintenance_supporter.websocket.documents import ws_documents_delete

from .conftest import OBJECT_ID_1, TASK_ID_1, build_object_data, build_object_entry_data, build_task_data, call_ws_handler, make_global_entry, make_ws_connection, setup_integration


pytestmark = pytest.mark.usefixtures("isolated_docs_dir")


def _store(hass: HomeAssistant) -> DocumentStore:
    store: DocumentStore = hass.data[DOMAIN][DOCUMENT_STORE_KEY]
    return store


async def _setup(hass: HomeAssistant) -> MockConfigEntry:
    g = make_global_entry(hass)
    data = build_object_entry_data(object_data=build_object_data(name="Pump"), tasks={TASK_ID_1: build_task_data(last_performed="2026-06-01", history=[{"timestamp": "2026-06-01T10:00:00+00:00", "type": HistoryEntryType.COMPLETED}])})
    data[CONF_PARTS] = {"p1": {"id": "p1", "name": "Seal", "doc_id": None}}
    obj = MockConfigEntry(version=1, minor_version=1, domain=DOMAIN, title="Pump", data=data, source="user", unique_id="maintenance_supporter_docrefs")
    obj.add_to_hass(hass)
    await setup_integration(hass, g, obj)
    return obj


async def _link_photo_and_part(hass: HomeAssistant, obj: MockConfigEntry, doc_id: str, *, extra_photo: str | None = None) -> None:
    store = obj.runtime_data.store
    history = list(store.get_history(TASK_ID_1))
    history[0] = {**history[0], "photo_doc_ids": [doc_id] + ([extra_photo] if extra_photo else [])}
    store.set_history(TASK_ID_1, history)
    parts = {"p1": {**obj.data[CONF_PARTS]["p1"], "doc_id": doc_id}}
    hass.config_entries.async_update_entry(obj, data={**obj.data, CONF_PARTS: parts})


def test_doc_wire_dict_is_the_shared_record() -> None:
    file_doc = {"id": "d1", "object_id": "o", "kind": "file", "hash": "ab" * 32, "title": "Manual", "filename": "m.pdf", "mime": "application/pdf", "size": 3, "tags": ["manual"], "description": "x", "task_ids": ["t1"], "part_ids": ["p1"], "task_pages": {"t1": 4}, "added_at": "2026-01-01"}
    wire = doc_wire_dict(file_doc, include_id=True)
    assert wire == {"id": "d1", "kind": "file", "hash": "ab" * 32, "title": "Manual", "filename": "m.pdf", "mime": "application/pdf", "size": 3, "tags": ["manual"], "description": "x", "task_ids": ["t1"], "part_ids": ["p1"], "task_pages": {"t1": 4}}
    assert "id" not in doc_wire_dict(file_doc, include_id=False)
    link = doc_wire_dict({"id": "d2", "kind": "weblink", "url": "https://x", "title": "X"}, include_id=True)
    assert link == {"id": "d2", "kind": "weblink", "url": "https://x", "title": "X", "tags": [], "description": "", "task_ids": [], "part_ids": []}


async def test_archive_manifest_matches_the_json_export_record(hass: HomeAssistant) -> None:
    obj = await _setup(hass)
    store = _store(hass)
    doc = await store.async_add_file(OBJECT_ID_1, content=b"%PDF-cascade", filename="m.pdf", mime="application/pdf")
    await store.async_update(doc["id"], task_ids=[TASK_ID_1], task_pages={TASK_ID_1: 7})
    manifest = json.loads(zipfile.ZipFile(io.BytesIO(doc_archive.build_documents_archive(hass, {obj.entry_id}))).read(doc_archive.MANIFEST_NAME))
    (archived,) = manifest["objects"][0]["documents"]
    (exported,) = _export_documents(store, OBJECT_ID_1)
    assert archived == exported
    assert archived["id"] == doc["id"] and archived["task_pages"] == {TASK_ID_1: 7}


async def test_archive_restore_repoints_photos_and_part_docs(hass: HomeAssistant) -> None:
    obj = await _setup(hass)
    store = _store(hass)
    doc = await store.async_add_file(OBJECT_ID_1, content=b"%PDF-restore", filename="done.png", mime="image/png")
    await _link_photo_and_part(hass, obj, doc["id"])
    zip_bytes = doc_archive.build_documents_archive(hass, {obj.entry_id})
    await store.async_remove_object(OBJECT_ID_1)
    result = await doc_archive.import_documents_archive(hass, zip_bytes)
    assert result["documents_created"] == 1
    (restored,) = store.for_object(OBJECT_ID_1)
    assert restored["id"] != doc["id"], "the importer mints a fresh id"
    assert obj.runtime_data.store.get_history(TASK_ID_1)[0]["photo_doc_ids"] == [restored["id"]]
    assert obj.data[CONF_PARTS]["p1"]["doc_id"] == restored["id"]


async def test_document_delete_forgets_photo_and_part_links(hass: HomeAssistant) -> None:
    obj = await _setup(hass)
    store = _store(hass)
    doc = await store.async_add_file(OBJECT_ID_1, content=b"%PDF-delete", filename="done.png", mime="image/png")
    keep = await store.async_add_file(OBJECT_ID_1, content=b"%PDF-keep", filename="keep.png", mime="image/png")
    await _link_photo_and_part(hass, obj, doc["id"], extra_photo=keep["id"])
    conn = make_ws_connection()
    await call_ws_handler(ws_documents_delete, hass, conn, {"id": 1, "type": "maintenance_supporter/documents/delete", "doc_id": doc["id"]})
    assert conn.send_result.call_args[0][1]["success"] is True
    assert obj.runtime_data.store.get_history(TASK_ID_1)[0]["photo_doc_ids"] == [keep["id"]]
    assert obj.data[CONF_PARTS]["p1"]["doc_id"] is None
    # The last photo gone → the key disappears (never an empty list).
    await async_forget_doc_ids(hass, {keep["id"]})
    assert "photo_doc_ids" not in obj.runtime_data.store.get_history(TASK_ID_1)[0]
    assert await async_forget_doc_ids(hass, set()) == 0
    assert TASK_ID_1 in obj.data[CONF_TASKS]
