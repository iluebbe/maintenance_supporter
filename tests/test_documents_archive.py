"""Tests for the documents archive (ZIP with file contents).

Covers the ``DocumentsArchiveView`` HTTP endpoint (admin-gated GET/POST) and the
``helpers/doc_archive`` build/import round-trip — the one export that carries
blob *contents*, so a JSON backup restored on a fresh instance can get its files
back. These paths were previously only exercised live (e2e); this brings them
under the unit gate.
"""

from __future__ import annotations

import io
import json
import shutil
import zipfile
from collections.abc import Iterator
from http import HTTPStatus
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import MagicMock

import pytest
from aiohttp import FormData
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry
from pytest_homeassistant_custom_component.typing import ClientSessionGenerator

from custom_components.maintenance_supporter import DOCUMENT_STORE_KEY
from custom_components.maintenance_supporter.const import DOMAIN, GLOBAL_UNIQUE_ID
from custom_components.maintenance_supporter.helpers import doc_archive
from custom_components.maintenance_supporter.helpers.documents import DocumentStore
from custom_components.maintenance_supporter.views import (
    DOCS_ARCHIVE_URL,
    DocumentsArchiveView,
)

from .conftest import (
    OBJECT_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    setup_integration,
)

_PDF = b"%PDF-1.4 documents-archive-unique-content"


@pytest.fixture(autouse=True)
def _isolate_docs_dir(hass: HomeAssistant, _isolate_document_blobs: None) -> Iterator[None]:
    """Give each test a clean per-test blob dir (mirrors test_ws_documents)."""
    docs = Path(hass.config.path("maintenance_supporter", "docs"))
    shutil.rmtree(docs, ignore_errors=True)
    yield
    shutil.rmtree(docs, ignore_errors=True)


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


def _object_entry(hass: HomeAssistant, *, name: str, object_id: str, unique_id: str) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title=name,
        data=build_object_entry_data(object_data=build_object_data(name=name, object_id=object_id)),
        source="user",
        unique_id=unique_id,
    )
    entry.add_to_hass(hass)
    return entry


def _store(hass: HomeAssistant) -> DocumentStore:
    store: DocumentStore = hass.data[DOMAIN][DOCUMENT_STORE_KEY]
    return store


def _manifest_of(zip_bytes: bytes) -> dict:
    with zipfile.ZipFile(io.BytesIO(zip_bytes)) as zf:
        return json.loads(zf.read(doc_archive.MANIFEST_NAME).decode("utf-8"))


# ─── HTTP view: GET/POST round-trip ──────────────────────────────────────────


async def test_archive_get_then_reimport_roundtrip(
    hass: HomeAssistant,
    hass_client: ClientSessionGenerator,
    global_entry: MockConfigEntry,
) -> None:
    """GET the archive (file + weblink + blob), wipe the docs, POST it back."""
    obj = _object_entry(hass, name="Pool Pump", object_id=OBJECT_ID_1, unique_id="ms_arch_obj")
    await setup_integration(hass, global_entry, obj)
    store = _store(hass)
    file_doc = await store.async_add_file(OBJECT_ID_1, content=_PDF, filename="manual.pdf", mime="application/pdf")
    await store.async_add_weblink(OBJECT_ID_1, url="https://example.test/spec.pdf", title="Spec")

    client = await hass_client()  # admin by default
    resp = await client.get(DOCS_ARCHIVE_URL)
    assert resp.status == HTTPStatus.OK
    assert resp.content_type == "application/zip"
    zip_bytes = await resp.read()

    manifest = _manifest_of(zip_bytes)
    assert manifest["version"] == doc_archive.ARCHIVE_VERSION
    (mobj,) = manifest["objects"]
    assert mobj["object_id"] == OBJECT_ID_1
    kinds = {d["kind"] for d in mobj["documents"]}
    assert kinds == {"file", "weblink"}
    with zipfile.ZipFile(io.BytesIO(zip_bytes)) as zf:
        assert f"{doc_archive.BLOB_DIR}{file_doc['hash']}" in zf.namelist()

    # Wipe every doc (and its blob) for the object, then restore from the ZIP.
    assert await store.async_remove_object(OBJECT_ID_1) == len(_PDF)  # bytes freed
    assert store.for_object(OBJECT_ID_1) == []

    form = FormData()
    form.add_field("file", zip_bytes, filename="maintenance-documents.zip", content_type="application/zip")
    restore = await client.post(DOCS_ARCHIVE_URL, data=form)
    assert restore.status == HTTPStatus.OK
    result = await restore.json()
    assert result["objects_matched"] == 1
    assert result["documents_created"] == 2
    assert result["blobs_written"] == 1  # the file blob was deleted with the object
    assert len(store.for_object(OBJECT_ID_1)) == 2


async def test_archive_get_selection_by_entry_ids(
    hass: HomeAssistant,
    hass_client: ClientSessionGenerator,
    global_entry: MockConfigEntry,
) -> None:
    """``?entry_ids=`` narrows the archive to the selected objects only."""
    a = _object_entry(hass, name="Alpha", object_id="a" * 32, unique_id="ms_arch_a")
    b = _object_entry(hass, name="Beta", object_id="b" * 32, unique_id="ms_arch_b")
    await setup_integration(hass, global_entry, a, b)
    store = _store(hass)
    await store.async_add_weblink("a" * 32, url="https://example.test/a.pdf")
    await store.async_add_weblink("b" * 32, url="https://example.test/b.pdf")

    client = await hass_client()
    resp = await client.get(f"{DOCS_ARCHIVE_URL}?entry_ids={a.entry_id}")
    assert resp.status == HTTPStatus.OK
    manifest = _manifest_of(await resp.read())
    assert [o["object_id"] for o in manifest["objects"]] == ["a" * 32]


async def test_archive_post_invalid_zip_is_400(
    hass: HomeAssistant,
    hass_client: ClientSessionGenerator,
    global_entry: MockConfigEntry,
) -> None:
    await setup_integration(hass, global_entry)
    client = await hass_client()
    form = FormData()
    form.add_field("file", b"this is not a zip", filename="x.zip", content_type="application/zip")
    resp = await client.post(DOCS_ARCHIVE_URL, data=form)
    assert resp.status == HTTPStatus.BAD_REQUEST


async def test_archive_post_missing_file_is_400(
    hass: HomeAssistant,
    hass_client: ClientSessionGenerator,
    global_entry: MockConfigEntry,
) -> None:
    await setup_integration(hass, global_entry)
    client = await hass_client()
    resp = await client.post(DOCS_ARCHIVE_URL, data=FormData())
    assert resp.status == HTTPStatus.BAD_REQUEST


async def test_archive_get_forbidden_for_non_admin(hass: HomeAssistant) -> None:
    view = DocumentsArchiveView(hass)
    request = MagicMock()
    request.get.return_value = SimpleNamespace(is_admin=False)
    resp = await view.get(request)
    assert resp.status == HTTPStatus.FORBIDDEN


async def test_archive_post_forbidden_for_non_admin(hass: HomeAssistant) -> None:
    view = DocumentsArchiveView(hass)
    request = MagicMock()
    request.get.return_value = SimpleNamespace(is_admin=False)
    resp = await view.post(request)
    assert resp.status == HTTPStatus.FORBIDDEN


# ─── helper: build + import edge paths ───────────────────────────────────────


async def test_build_skips_blob_missing_on_disk(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """A file doc whose blob was deleted behind our back is skipped, not fatal."""
    obj = _object_entry(hass, name="Pump", object_id=OBJECT_ID_1, unique_id="ms_arch_missing")
    await setup_integration(hass, global_entry, obj)
    store = _store(hass)
    doc = await store.async_add_file(OBJECT_ID_1, content=_PDF, filename="m.pdf", mime="application/pdf")
    store.blob_path(doc["hash"]).unlink()  # delete the blob, keep the metadata

    zip_bytes = doc_archive.build_documents_archive(hass, None)
    with zipfile.ZipFile(io.BytesIO(zip_bytes)) as zf:
        names = zf.namelist()
    assert doc_archive.MANIFEST_NAME in names
    assert not any(n.startswith(doc_archive.BLOB_DIR) for n in names)  # blob skipped


async def test_import_matches_object_by_name_cross_instance(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """A manifest object with an unknown id but matching name is matched by name;
    an object matching neither is skipped."""
    obj = _object_entry(hass, name="Boiler", object_id=OBJECT_ID_1, unique_id="ms_arch_name")
    await setup_integration(hass, global_entry, obj)

    manifest = {
        "version": 1,
        "objects": [
            {
                "object_id": "does-not-exist",
                "object_name": "Boiler",  # matches by name
                "documents": [{"kind": "weblink", "url": "https://example.test/b.pdf", "task_ids": []}],
            },
            {
                "object_id": "nope",
                "object_name": "Unknown Object",  # matches nothing -> skipped
                "documents": [{"kind": "weblink", "url": "https://example.test/u.pdf", "task_ids": []}],
            },
            "not-a-dict",  # ignored
        ],
    }
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w") as zf:
        zf.writestr(doc_archive.MANIFEST_NAME, json.dumps(manifest))
    result = await doc_archive.import_documents_archive(hass, buf.getvalue())
    assert result["objects_matched"] == 1
    assert result["documents_created"] == 1
    assert len(_store(hass).for_object(OBJECT_ID_1)) == 1


async def test_import_skips_blob_failing_hash_check(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """A blob whose name isn't its own sha256 is dropped (tamper guard)."""
    await setup_integration(hass, global_entry)
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w") as zf:
        zf.writestr(doc_archive.MANIFEST_NAME, json.dumps({"version": 1, "objects": []}))
        zf.writestr(f"{doc_archive.BLOB_DIR}{'a' * 64}", b"content that does not hash to a*64")
    result = await doc_archive.import_documents_archive(hass, buf.getvalue())
    assert result["blobs_written"] == 0


async def test_import_rejects_oversized_archive(
    hass: HomeAssistant, global_entry: MockConfigEntry, monkeypatch: pytest.MonkeyPatch
) -> None:
    await setup_integration(hass, global_entry)
    monkeypatch.setattr(doc_archive, "MAX_ARCHIVE_BYTES", 4)
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w") as zf:
        zf.writestr(doc_archive.MANIFEST_NAME, json.dumps({"version": 1, "objects": []}))
        # A syntactically valid blob whose bytes exceed the (tiny) cap.
        import hashlib

        content = b"way too many bytes for the cap"
        zf.writestr(f"{doc_archive.BLOB_DIR}{hashlib.sha256(content).hexdigest()}", content)
    result = await doc_archive.import_documents_archive(hass, buf.getvalue())
    assert "error" in result


async def test_import_without_store_returns_error(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    await setup_integration(hass, global_entry)
    hass.data[DOMAIN].pop(DOCUMENT_STORE_KEY, None)
    result = await doc_archive.import_documents_archive(hass, b"")
    assert result == {"error": "documents store unavailable"}
