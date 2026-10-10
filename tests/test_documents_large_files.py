"""Documents up to 100 MB, never held in memory whole (#209, second round).

The limit was 25 MB because every path held a file in memory whole: the
upload view read() it, the store hashed and wrote the bytes, the serve view
read_bytes() it, pypdf read the path into a buffer. Now the upload view hands
the store the temporary file aiohttp spooled the upload into, the store
copies and hashes it in pieces (refusing past the limit mid-copy), the serve
view streams the blob from disk (with range requests), and pypdf reads an
open file only as far as it needs.
"""

from __future__ import annotations

import hashlib
import io
from http import HTTPStatus
from pathlib import Path
from typing import Any
from unittest.mock import patch

import pytest
from aiohttp import FormData
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry
from pytest_homeassistant_custom_component.typing import ClientSessionGenerator

from custom_components.maintenance_supporter import DOCUMENT_STORE_KEY
from custom_components.maintenance_supporter.const import DOMAIN, GLOBAL_UNIQUE_ID
from custom_components.maintenance_supporter.helpers import documents as docmod
from custom_components.maintenance_supporter.helpers.documents import DocumentStore
from custom_components.maintenance_supporter.views import SERVE_URL, UPLOAD_URL

from .conftest import build_global_entry_data, build_object_data, build_object_entry_data, setup_integration
from .test_document_search import make_pdf

pytestmark = pytest.mark.usefixtures("isolated_docs_dir")


class _PieceReader(io.BytesIO):
    """A source that records the size of every read."""

    def __init__(self, data: bytes) -> None:
        super().__init__(data)
        self.sizes: list[int] = []

    def read(self, size: int | None = -1, /) -> bytes:
        self.sizes.append(-1 if size is None else size)
        return super().read(size)


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


@pytest.fixture
def object_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Boiler",
        data=build_object_entry_data(object_data=build_object_data(name="Boiler")),
        source="user",
        unique_id="ms_large_docs_obj",
    )
    entry.add_to_hass(hass)
    return entry


async def _store(hass: HomeAssistant) -> DocumentStore:
    s = DocumentStore(hass)
    await s.async_load()
    return s


def _tmp_files(s: DocumentStore) -> list[str]:
    return [p.name for p in s._blobs_dir.iterdir() if p.name.endswith(".tmp")] if s._blobs_dir.exists() else []


# ─── The store: copied and hashed in pieces ────────────────────────────────


async def test_a_file_is_copied_and_hashed_in_pieces(hass: HomeAssistant, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(docmod, "_COPY_CHUNK_BYTES", 4)
    s = await _store(hass)
    data = b"%PDF-1.4 a manual, read in pieces"
    src = _PieceReader(data)
    doc = await s.async_add_file("obj1", content=src, filename="m.pdf", mime="application/pdf")

    assert doc["hash"] == hashlib.sha256(data).hexdigest()
    assert doc["size"] == len(data)
    assert s.blobs[doc["hash"]]["size"] == len(data)
    assert s.blob_path(doc["hash"]).read_bytes() == data
    # Every read asked for one piece, never for "all of it".
    assert src.sizes and set(src.sizes) == {4}
    assert _tmp_files(s) == []


async def test_a_file_past_the_limit_stops_mid_copy_and_leaves_nothing(
    hass: HomeAssistant, monkeypatch: pytest.MonkeyPatch
) -> None:
    monkeypatch.setattr(docmod, "MAX_DOC_BYTES", 10)
    monkeypatch.setattr(docmod, "_COPY_CHUNK_BYTES", 4)
    s = await _store(hass)
    src = _PieceReader(b"x" * 1000)

    with pytest.raises(ValueError, match="file_too_large"):
        await s.async_add_file("obj1", content=src, filename="big.pdf", mime="application/pdf")

    # 4 + 4 + 4 = 12 > 10: it stopped at the third piece, not after 1000 bytes.
    assert len(src.sizes) == 3
    assert s.documents == {}
    assert s.blobs == {}
    assert not any(s._blobs_dir.iterdir())


async def test_a_file_exactly_at_the_limit_is_stored(hass: HomeAssistant, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(docmod, "MAX_DOC_BYTES", 8)
    monkeypatch.setattr(docmod, "_COPY_CHUNK_BYTES", 4)
    s = await _store(hass)
    doc = await s.async_add_file("obj1", content=io.BytesIO(b"12345678"), filename="a.pdf", mime="application/pdf")
    assert doc["size"] == 8
    assert s.blob_path(doc["hash"]).read_bytes() == b"12345678"


async def test_the_same_file_twice_shares_one_blob_and_leaves_no_copy(hass: HomeAssistant) -> None:
    s = await _store(hass)
    first = await s.async_add_file("obj1", content=io.BytesIO(b"manual"), filename="a.pdf", mime="application/pdf")
    second = await s.async_add_file("obj2", content=io.BytesIO(b"manual"), filename="b.pdf", mime="application/pdf")
    assert second["deduped"] is True
    assert second["hash"] == first["hash"]
    assert s.blobs[first["hash"]]["refcount"] == 2
    assert _tmp_files(s) == []


# ─── The upload view: hands over the spooled file ──────────────────────────


async def test_the_upload_view_hands_over_the_spooled_file_not_its_bytes(
    hass: HomeAssistant,
    hass_client: ClientSessionGenerator,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    await setup_integration(hass, global_entry, object_entry)
    client = await hass_client()
    seen: list[Any] = []
    real = DocumentStore.async_add_file

    async def spy(self: DocumentStore, object_id: str, **kwargs: Any) -> dict[str, Any]:
        seen.append(kwargs["content"])
        return await real(self, object_id, **kwargs)

    data = b"%PDF-1.4 " + bytes(range(256)) * 64
    form = FormData()
    form.add_field("entry_id", object_entry.entry_id)
    form.add_field("file", data, filename="manual.pdf", content_type="application/pdf")
    with patch.object(DocumentStore, "async_add_file", spy):
        resp = await client.post(UPLOAD_URL, data=form)

    assert resp.status == HTTPStatus.OK
    doc = await resp.json()
    assert doc["size"] == len(data)
    assert doc["hash"] == hashlib.sha256(data).hexdigest()
    assert not isinstance(seen[0], bytes | bytearray), "the view read the upload into memory"
    assert seen[0].closed, "the spooled file stays open after the upload"


async def test_a_refused_upload_closes_the_spooled_file_too(
    hass: HomeAssistant,
    hass_client: ClientSessionGenerator,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setattr(docmod, "MAX_DOC_BYTES", 4)
    await setup_integration(hass, global_entry, object_entry)
    client = await hass_client()
    seen: list[Any] = []
    real = DocumentStore.async_add_file

    async def spy(self: DocumentStore, object_id: str, **kwargs: Any) -> dict[str, Any]:
        seen.append(kwargs["content"])
        return await real(self, object_id, **kwargs)

    form = FormData()
    form.add_field("entry_id", object_entry.entry_id)
    form.add_field("file", b"too long", filename="a.pdf", content_type="application/pdf")
    with patch.object(DocumentStore, "async_add_file", spy):
        resp = await client.post(UPLOAD_URL, data=form)

    assert resp.status == HTTPStatus.REQUEST_ENTITY_TOO_LARGE
    assert seen[0].closed
    assert _tmp_files(hass.data[DOMAIN][DOCUMENT_STORE_KEY]) == []


# ─── The serve view: streamed from disk ────────────────────────────────────


async def test_the_serve_view_streams_from_disk_and_answers_ranges(
    hass: HomeAssistant,
    hass_client: ClientSessionGenerator,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    await setup_integration(hass, global_entry, object_entry)
    store: DocumentStore = hass.data[DOMAIN][DOCUMENT_STORE_KEY]
    data = b"%PDF-1.4 " + b"0123456789" * 100
    doc = await store.async_add_file("obj", content=data, filename="manual.pdf", mime="application/pdf")
    client = await hass_client()

    whole = await client.get(SERVE_URL.format(doc_id=doc["id"]))
    assert whole.status == HTTPStatus.OK
    assert await whole.read() == data
    assert whole.headers["Accept-Ranges"] == "bytes"

    # A PDF viewer fetching one stretch of a large manual.
    part = await client.get(SERVE_URL.format(doc_id=doc["id"]), headers={"Range": "bytes=9-18"})
    assert part.status == HTTPStatus.PARTIAL_CONTENT
    assert await part.read() == data[9:19]
    assert part.content_type == "application/pdf"
    assert part.headers["X-Content-Type-Options"] == "nosniff"
    assert part.headers["Content-Disposition"].startswith("inline;")


async def test_an_unsafe_type_is_still_served_as_an_opaque_attachment(
    hass: HomeAssistant,
    hass_client: ClientSessionGenerator,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """The blob name has no extension, so the type comes from the header the
    view sets — never from a guess, never the stored text/html."""
    await setup_integration(hass, global_entry, object_entry)
    store: DocumentStore = hass.data[DOMAIN][DOCUMENT_STORE_KEY]
    doc = await store.async_add_file("obj", content=b"<script>alert(1)</script>", filename="x.html", mime="text/html")
    client = await hass_client()

    resp = await client.get(SERVE_URL.format(doc_id=doc["id"]))
    assert resp.status == HTTPStatus.OK
    assert resp.content_type == "application/octet-stream"
    assert resp.headers["Content-Disposition"].startswith("attachment;")
    assert resp.headers["X-Content-Type-Options"] == "nosniff"


# ─── pypdf: an open file, not a path ───────────────────────────────────────


def _spy_pdf_reader(monkeypatch: pytest.MonkeyPatch) -> list[Any]:
    import pypdf

    seen: list[Any] = []
    real = pypdf.PdfReader

    def spy(stream: Any, *args: Any, **kwargs: Any) -> Any:
        seen.append(stream)
        return real(stream, *args, **kwargs)

    monkeypatch.setattr(pypdf, "PdfReader", spy)
    return seen


def test_the_text_index_reads_a_pdf_from_an_open_file(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    from custom_components.maintenance_supporter.helpers.document_text import STATUS_TEXT, extract_text_sync

    seen = _spy_pdf_reader(monkeypatch)
    path = tmp_path / "manual.pdf"
    path.write_bytes(make_pdf(["Boiler manual: error E24 means the filter is clogged"]))

    result = extract_text_sync(path, "application/pdf")
    assert result["status"] == STATUS_TEXT
    assert "E24" in result["text"]
    assert not isinstance(seen[0], str | Path), "pypdf got the path and read the file whole"


async def test_the_manual_excerpt_reads_the_pdf_from_an_open_file(
    hass: HomeAssistant,
    hass_client: ClientSessionGenerator,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    await setup_integration(hass, global_entry, object_entry)
    store: DocumentStore = hass.data[DOMAIN][DOCUMENT_STORE_KEY]
    doc = await store.async_add_file("obj", content=make_pdf(["one", "two", "three"]), filename="m.pdf", mime="application/pdf")
    seen = _spy_pdf_reader(monkeypatch)
    client = await hass_client()

    resp = await client.get(f"/api/maintenance_supporter/document/{doc['id']}/excerpt?start=2&count=2")
    assert resp.status == HTTPStatus.OK
    from pypdf import PdfReader

    assert len(PdfReader(io.BytesIO(await resp.read())).pages) == 2
    assert not isinstance(seen[0], str | Path), "pypdf got the path and read the file whole"
