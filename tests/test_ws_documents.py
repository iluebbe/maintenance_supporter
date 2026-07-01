"""Tests for document WS handlers (websocket/documents.py) + HTTP views (views.py)."""

from __future__ import annotations

import shutil
from collections.abc import Iterator
from http import HTTPStatus
from pathlib import Path
from unittest.mock import MagicMock

import pytest
from aiohttp import FormData
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry
from pytest_homeassistant_custom_component.typing import ClientSessionGenerator

from custom_components.maintenance_supporter import DOCUMENT_STORE_KEY
from custom_components.maintenance_supporter.const import DOMAIN, GLOBAL_UNIQUE_ID
from custom_components.maintenance_supporter.helpers import documents as docmod
from custom_components.maintenance_supporter.helpers.documents import DocumentStore
from custom_components.maintenance_supporter.views import (
    SERVE_URL,
    UPLOAD_URL,
    DocumentUploadView,
    _content_disposition,
)
from custom_components.maintenance_supporter.websocket.documents import (
    ws_documents_add_link,
    ws_documents_delete,
    ws_documents_list,
    ws_documents_storage,
    ws_documents_update,
)

from .conftest import (
    OBJECT_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    call_ws_handler,
    setup_integration,
)

_LIST = "maintenance_supporter/documents/list"
_STORAGE = "maintenance_supporter/documents/storage"
_ADD_LINK = "maintenance_supporter/documents/add_link"
_UPDATE = "maintenance_supporter/documents/update"
_DELETE = "maintenance_supporter/documents/delete"


@pytest.fixture(autouse=True)
def _isolate_docs_dir(hass: HomeAssistant) -> Iterator[None]:
    """Blobs live on the shared test config dir — give each test a clean one."""
    docs = Path(hass.config.path("maintenance_supporter", "docs"))
    shutil.rmtree(docs, ignore_errors=True)
    yield
    shutil.rmtree(docs, ignore_errors=True)


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter", data=build_global_entry_data(),
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


@pytest.fixture
def object_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN, title="Pool Pump",
        data=build_object_entry_data(object_data=build_object_data(name="Pool Pump")),
        source="user", unique_id="ms_docs_obj",
    )
    entry.add_to_hass(hass)
    return entry


def _conn() -> MagicMock:
    conn = MagicMock()
    conn.send_result = MagicMock()
    conn.send_error = MagicMock()
    conn.user = MagicMock(is_admin=True)
    return conn


def _store(hass: HomeAssistant) -> DocumentStore:
    store: DocumentStore = hass.data[DOMAIN][DOCUMENT_STORE_KEY]
    return store


# ─── WS: list ───────────────────────────────────────────────────────────────


async def test_ws_list_empty(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    await setup_integration(hass, global_entry, object_entry)
    conn = _conn()
    await call_ws_handler(
        ws_documents_list, hass, conn,
        {"id": 1, "type": _LIST, "entry_id": object_entry.entry_id},
    )
    assert conn.send_result.call_args[0][1] == {"documents": []}


async def test_ws_list_returns_docs(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    await setup_integration(hass, global_entry, object_entry)
    doc = await _store(hass).async_add_file(
        OBJECT_ID_1, content=b"pdf", filename="m.pdf", mime="application/pdf", tags=["manual"],
    )
    conn = _conn()
    await call_ws_handler(
        ws_documents_list, hass, conn,
        {"id": 1, "type": _LIST, "entry_id": object_entry.entry_id},
    )
    documents = conn.send_result.call_args[0][1]["documents"]
    assert [d["id"] for d in documents] == [doc["id"]]
    assert documents[0]["kind"] == "file"


async def test_object_response_includes_document_count(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """(P2) The object WS response carries document_count for the objects-table badge."""
    from custom_components.maintenance_supporter.websocket.objects import ws_get_object

    await setup_integration(hass, global_entry, object_entry)
    store = _store(hass)
    await store.async_add_file(OBJECT_ID_1, content=b"x", filename="a.pdf", mime="application/pdf")
    await store.async_add_weblink(OBJECT_ID_1, url="https://x")

    conn = _conn()
    await call_ws_handler(
        ws_get_object, hass, conn,
        {"id": 1, "type": "maintenance_supporter/object", "entry_id": object_entry.entry_id},
    )
    assert conn.send_result.call_args[0][1]["object"]["document_count"] == 2


async def test_ws_list_unknown_entry(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    await setup_integration(hass, global_entry)
    conn = _conn()
    await call_ws_handler(
        ws_documents_list, hass, conn,
        {"id": 1, "type": _LIST, "entry_id": "does_not_exist"},
    )
    assert conn.send_error.call_args[0][1] == "not_found"


# ─── WS: storage summary ──────────────────────────────────────────────────────


async def test_ws_storage_summary(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    await setup_integration(hass, global_entry, object_entry)
    await _store(hass).async_add_file(
        OBJECT_ID_1, content=b"1234567890", filename="a.pdf", mime="application/pdf",
    )
    conn = _conn()
    await call_ws_handler(ws_documents_storage, hass, conn, {"id": 1, "type": _STORAGE})
    summ = conn.send_result.call_args[0][1]
    assert summ["total_bytes"] == 10
    assert summ["file_count"] == 1


# ─── WS: add_link ─────────────────────────────────────────────────────────────


async def test_ws_add_link(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    await setup_integration(hass, global_entry, object_entry)
    conn = _conn()
    await call_ws_handler(
        ws_documents_add_link, hass, conn,
        {
            "id": 1, "type": _ADD_LINK, "entry_id": object_entry.entry_id,
            "url": "https://example.com/manual.pdf", "title": "Online", "tags": ["manual"],
        },
    )
    doc = conn.send_result.call_args[0][1]
    assert doc["kind"] == "weblink"
    assert doc["url"] == "https://example.com/manual.pdf"
    assert doc["title"] == "Online"
    assert _store(hass).for_object(OBJECT_ID_1)[0]["id"] == doc["id"]


async def test_ws_add_link_rejects_non_http(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    await setup_integration(hass, global_entry, object_entry)
    conn = _conn()
    await call_ws_handler(
        ws_documents_add_link, hass, conn,
        {"id": 1, "type": _ADD_LINK, "entry_id": object_entry.entry_id, "url": "javascript:alert(1)"},
    )
    assert conn.send_error.call_args[0][1] == "invalid_url"


async def test_ws_add_link_unknown_entry(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    await setup_integration(hass, global_entry)
    conn = _conn()
    await call_ws_handler(
        ws_documents_add_link, hass, conn,
        {"id": 1, "type": _ADD_LINK, "entry_id": "nope", "url": "https://x/m.pdf"},
    )
    assert conn.send_error.call_args[0][1] == "not_found"


# ─── WS: update ───────────────────────────────────────────────────────────────


async def test_ws_update(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    await setup_integration(hass, global_entry, object_entry)
    doc = await _store(hass).async_add_file(
        OBJECT_ID_1, content=b"y", filename="a.pdf", mime="application/pdf",
    )
    conn = _conn()
    await call_ws_handler(
        ws_documents_update, hass, conn,
        {
            "id": 1, "type": _UPDATE, "doc_id": doc["id"],
            "title": "Renamed", "tags": ["warranty"], "task_ids": ["t1"],
        },
    )
    result = conn.send_result.call_args[0][1]
    assert result["title"] == "Renamed"
    assert result["tags"] == ["warranty"]
    assert result["task_ids"] == ["t1"]


async def test_ws_update_missing(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    await setup_integration(hass, global_entry)
    conn = _conn()
    # No title in the message → exercises the "title absent" branch too.
    await call_ws_handler(
        ws_documents_update, hass, conn,
        {"id": 1, "type": _UPDATE, "doc_id": "nope", "tags": ["x"]},
    )
    assert conn.send_error.call_args[0][1] == "not_found"


# ─── WS: delete ───────────────────────────────────────────────────────────────


async def test_ws_delete(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    await setup_integration(hass, global_entry, object_entry)
    doc = await _store(hass).async_add_file(
        OBJECT_ID_1, content=b"bye", filename="a.pdf", mime="application/pdf",
    )
    conn = _conn()
    await call_ws_handler(
        ws_documents_delete, hass, conn,
        {"id": 1, "type": _DELETE, "doc_id": doc["id"]},
    )
    assert conn.send_result.call_args[0][1] == {"success": True, "bytes_freed": len(b"bye")}
    assert _store(hass).get(doc["id"]) is None


async def test_ws_delete_missing(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    await setup_integration(hass, global_entry)
    conn = _conn()
    await call_ws_handler(
        ws_documents_delete, hass, conn,
        {"id": 1, "type": _DELETE, "doc_id": "nope"},
    )
    assert conn.send_error.call_args[0][1] == "not_found"


# ─── HTTP views: upload + serve ───────────────────────────────────────────────


async def test_upload_and_serve_roundtrip(
    hass: HomeAssistant, hass_client: ClientSessionGenerator,
    global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    await setup_integration(hass, global_entry, object_entry)
    client = await hass_client()

    form = FormData()
    form.add_field("entry_id", object_entry.entry_id)
    form.add_field("tags", "manual")
    form.add_field("file", b"%PDF-1.4 hello", filename="manual.pdf", content_type="application/pdf")
    resp = await client.post(UPLOAD_URL, data=form)
    assert resp.status == HTTPStatus.OK
    doc = await resp.json()
    assert doc["kind"] == "file"
    assert doc["filename"] == "manual.pdf"
    assert doc["tags"] == ["manual"]
    assert doc["size"] == len(b"%PDF-1.4 hello")

    serve = await client.get(SERVE_URL.format(doc_id=doc["id"]))
    assert serve.status == HTTPStatus.OK
    assert serve.content_type == "application/pdf"
    assert "manual.pdf" in serve.headers["Content-Disposition"]
    assert await serve.read() == b"%PDF-1.4 hello"


async def test_upload_unknown_entry(
    hass: HomeAssistant, hass_client: ClientSessionGenerator, global_entry: MockConfigEntry,
) -> None:
    await setup_integration(hass, global_entry)
    client = await hass_client()
    form = FormData()
    form.add_field("entry_id", "nope")
    form.add_field("file", b"x", filename="a.pdf", content_type="application/pdf")
    resp = await client.post(UPLOAD_URL, data=form)
    assert resp.status == HTTPStatus.NOT_FOUND


async def test_upload_missing_file(
    hass: HomeAssistant, hass_client: ClientSessionGenerator,
    global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    await setup_integration(hass, global_entry, object_entry)
    client = await hass_client()
    form = FormData()
    form.add_field("entry_id", object_entry.entry_id)
    resp = await client.post(UPLOAD_URL, data=form)
    assert resp.status == HTTPStatus.BAD_REQUEST


async def test_upload_too_large(
    hass: HomeAssistant, hass_client: ClientSessionGenerator,
    global_entry: MockConfigEntry, object_entry: MockConfigEntry,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setattr(docmod, "MAX_DOC_BYTES", 4)
    await setup_integration(hass, global_entry, object_entry)
    client = await hass_client()
    form = FormData()
    form.add_field("entry_id", object_entry.entry_id)
    form.add_field("file", b"toolong", filename="a.pdf", content_type="application/pdf")
    resp = await client.post(UPLOAD_URL, data=form)
    assert resp.status == HTTPStatus.REQUEST_ENTITY_TOO_LARGE


async def test_upload_forbidden_for_non_writer(hass: HomeAssistant) -> None:
    """A non-admin without operator-write delegation is rejected (403)."""
    view = DocumentUploadView(hass)
    request = MagicMock()
    request.__getitem__.return_value = MagicMock(is_admin=False, id="u1")
    resp = await view.post(request)
    assert resp.status == HTTPStatus.FORBIDDEN


async def test_serve_unknown_doc(
    hass: HomeAssistant, hass_client: ClientSessionGenerator, global_entry: MockConfigEntry,
) -> None:
    await setup_integration(hass, global_entry)
    client = await hass_client()
    resp = await client.get(SERVE_URL.format(doc_id="nope"))
    assert resp.status == HTTPStatus.NOT_FOUND


async def test_serve_weblink_is_404(
    hass: HomeAssistant, hass_client: ClientSessionGenerator,
    global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    await setup_integration(hass, global_entry, object_entry)
    doc = await _store(hass).async_add_weblink(OBJECT_ID_1, url="https://x/manual.pdf")
    client = await hass_client()
    resp = await client.get(SERVE_URL.format(doc_id=doc["id"]))
    assert resp.status == HTTPStatus.NOT_FOUND


async def test_serve_dangling_blob_is_404(
    hass: HomeAssistant, hass_client: ClientSessionGenerator,
    global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    await setup_integration(hass, global_entry, object_entry)
    store = _store(hass)
    doc = await store.async_add_file(
        OBJECT_ID_1, content=b"data", filename="a.pdf", mime="application/pdf",
    )
    store.blob_path(doc["hash"]).unlink()  # delete the blob behind the doc's back
    client = await hass_client()
    resp = await client.get(SERVE_URL.format(doc_id=doc["id"]))
    assert resp.status == HTTPStatus.NOT_FOUND


async def test_serve_corrupt_hash_is_404(
    hass: HomeAssistant, hass_client: ClientSessionGenerator,
    global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """A file doc whose stored hash isn't a valid digest fails path validation."""
    await setup_integration(hass, global_entry, object_entry)
    store = _store(hass)
    store.documents["corrupt"] = {
        "object_id": OBJECT_ID_1, "kind": "file", "hash": "NOThex",
        "title": "x", "filename": "x.pdf", "mime": "application/pdf",
        "size": 1, "tags": [], "task_ids": [], "added_at": "2026-01-01T00:00:00",
    }
    client = await hass_client()
    resp = await client.get(SERVE_URL.format(doc_id="corrupt"))
    assert resp.status == HTTPStatus.NOT_FOUND


# ─── _content_disposition helper ──────────────────────────────────────────────


def test_content_disposition_ascii() -> None:
    assert _content_disposition("manual.pdf") == (
        "inline; filename=\"manual.pdf\"; filename*=UTF-8''manual.pdf"
    )


def test_content_disposition_unicode_stripped_and_encoded() -> None:
    got = _content_disposition("Anleitung_Öl.pdf")
    assert 'filename="Anleitung_l.pdf"' in got            # non-ASCII dropped from fallback
    assert "filename*=UTF-8''Anleitung_%C3%96l.pdf" in got  # full name RFC 5987-encoded


def test_content_disposition_all_unicode_falls_back() -> None:
    assert 'filename="document"' in _content_disposition("Öä")


# ─── Lifecycle: object delete / archive ───────────────────────────────────────


async def test_object_delete_removes_documents(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Permanently deleting an object reclaims its (unshared) document storage."""
    await setup_integration(hass, global_entry, object_entry)
    store = _store(hass)
    doc = await store.async_add_file(
        OBJECT_ID_1, content=b"del-me", filename="a.pdf", mime="application/pdf",
    )
    assert store.for_object(OBJECT_ID_1)

    await hass.config_entries.async_remove(object_entry.entry_id)
    await hass.async_block_till_done()

    assert store.for_object(OBJECT_ID_1) == []
    assert doc["hash"] not in store.blobs          # unshared blob freed
    assert not store.blob_path(doc["hash"]).exists()


async def test_object_delete_keeps_shared_blob(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """A blob shared with another object survives the delete (refcount-aware)."""
    await setup_integration(hass, global_entry, object_entry)
    store = _store(hass)
    await store.async_add_file(OBJECT_ID_1, content=b"shared", filename="a.pdf", mime="application/pdf")
    other = await store.async_add_file("other_obj", content=b"shared", filename="b.pdf", mime="application/pdf")
    assert store.blobs[other["hash"]]["refcount"] == 2

    await hass.config_entries.async_remove(object_entry.entry_id)
    await hass.async_block_till_done()

    assert store.for_object(OBJECT_ID_1) == []
    assert store.blobs[other["hash"]]["refcount"] == 1  # still held by other_obj
    assert store.blob_path(other["hash"]).exists()


async def test_object_archive_keeps_documents(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Archiving (unlike deleting) leaves the object's documents intact."""
    from custom_components.maintenance_supporter.websocket.objects import (
        ws_archive_object,
    )

    await setup_integration(hass, global_entry, object_entry)
    store = _store(hass)
    await store.async_add_file(OBJECT_ID_1, content=b"keep", filename="a.pdf", mime="application/pdf")

    conn = _conn()
    await call_ws_handler(
        ws_archive_object, hass, conn,
        {"id": 1, "type": "maintenance_supporter/object/archive", "entry_id": object_entry.entry_id},
    )
    await hass.async_block_till_done()

    assert store.for_object(OBJECT_ID_1)  # documents survive the archive
