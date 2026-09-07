"""Full-text document search + the global `search` WS command (#171).

Covers the text-index lifecycle (extract on add, sidecar + meta, index on
first search, forget on the last dereference, backfill of pre-existing
blobs), the three extraction outcomes (text layer / no text layer /
unsupported), page + snippet on a content hit, the tolerant metadata match
of `documents/search`, history-note hits, and the storage summary's
`search_index` counts.
"""

from __future__ import annotations

import shutil
from collections.abc import Iterator
from pathlib import Path

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter import DOCUMENT_STORE_KEY
from custom_components.maintenance_supporter.const import (
    DOCUMENT_TEXT_INDEX_KEY,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from custom_components.maintenance_supporter.helpers import document_text as dt
from custom_components.maintenance_supporter.helpers.document_text import (
    STATUS_EMPTY,
    STATUS_ERROR,
    STATUS_TEXT,
    STATUS_UNSUPPORTED,
    DocumentTextIndex,
    extract_text_sync,
    text_sidecar_path,
)
from custom_components.maintenance_supporter.helpers.documents import DocumentStore
from custom_components.maintenance_supporter.websocket.documents import (
    ws_documents_search,
    ws_documents_storage,
    ws_search,
)

from .conftest import (
    OBJECT_ID_1,
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    make_ws_connection as _conn,
    setup_integration,
)


def make_pdf(pages: list[str]) -> bytes:
    """A minimal but well-formed PDF with one Helvetica text line per page —
    exactly the text layer pypdf extracts."""
    objs: list[bytes] = []
    n_pages = len(pages)
    font_id = 3 + 2 * n_pages
    kids = " ".join(f"{3 + 2 * i} 0 R" for i in range(n_pages))
    objs.append(b"<< /Type /Catalog /Pages 2 0 R >>")
    objs.append(f"<< /Type /Pages /Kids [{kids}] /Count {n_pages} >>".encode())
    for i, text in enumerate(pages):
        page_id, content_id = 3 + 2 * i, 4 + 2 * i
        objs.append(
            f"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 400 200] /Contents {content_id} 0 R "
            f"/Resources << /Font << /F1 {font_id} 0 R >> >> >>".encode()
        )
        escaped = text.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")
        stream = f"BT /F1 12 Tf 20 100 Td ({escaped}) Tj ET".encode("latin-1")
        objs.append(b"<< /Length " + str(len(stream)).encode() + b" >>\nstream\n" + stream + b"\nendstream")
    objs.append(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>")

    out = bytearray(b"%PDF-1.4\n")
    offsets: list[int] = []
    for i, body in enumerate(objs, start=1):
        offsets.append(len(out))
        out += f"{i} 0 obj\n".encode() + body + b"\nendobj\n"
    xref = len(out)
    out += f"xref\n0 {len(objs) + 1}\n".encode()
    out += b"0000000000 65535 f \n"
    for off in offsets:
        out += f"{off:010d} 00000 n \n".encode()
    out += f"trailer\n<< /Size {len(objs) + 1} /Root 1 0 R >>\nstartxref\n{xref}\n%%EOF\n".encode()
    return bytes(out)


@pytest.fixture(autouse=True)
def _clean_docs_dir(hass: HomeAssistant, _isolate_document_blobs: None) -> Iterator[None]:
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


@pytest.fixture
def object_entry(hass: HomeAssistant) -> MockConfigEntry:
    task = build_task_data(last_performed="2026-05-01")
    task["history"] = [
        {"type": "completed", "timestamp": "2026-05-01T10:00:00", "notes": "Zulauffilter gereinigt, Dichtung sah gut aus"},
        {"type": "skipped", "timestamp": "2026-03-01T10:00:00", "notes": "Kein Ersatzteil da"},
        {"type": "completed", "timestamp": "2026-01-01T10:00:00"},  # no notes at all
        {"type": "completed", "timestamp": "2025-12-01T10:00:00", "notes": "   "},
    ]
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Dishwasher",
        data=build_object_entry_data(object_data=build_object_data(name="Spülmaschine"), tasks={TASK_ID_1: task}),
        source="user",
        unique_id="ms_search_obj",
    )
    entry.add_to_hass(hass)
    return entry


def _store(hass: HomeAssistant) -> DocumentStore:
    store: DocumentStore = hass.data[DOMAIN][DOCUMENT_STORE_KEY]
    return store


# Extraction is a BACKGROUND task (must never hold up HA's start or stop),
# so plain async_block_till_done() does not wait for it — the tests ask for
# the background tasks explicitly. Locally the executor was simply fast
# enough; CI's HA legs showed the race.


def _index(hass: HomeAssistant) -> DocumentTextIndex:
    index: DocumentTextIndex = hass.data[DOMAIN][DOCUMENT_TEXT_INDEX_KEY]
    return index


MANUAL = make_pdf(
    [
        "Bedienungsanleitung Geschirrspueler Modell SN65",
        "Stoerungen beheben. Fehlercode E24: Zulauf pruefen, Sieb reinigen.",
    ]
)


# ─── extraction ──────────────────────────────────────────────────────────────


def test_extract_pdf_text_layer_with_pages(tmp_path: Path) -> None:
    path = tmp_path / "m.pdf"
    path.write_bytes(MANUAL)
    result = extract_text_sync(path, "application/pdf")
    assert result["status"] == STATUS_TEXT
    assert result["pages"] == 2 and result["indexed_pages"] == 2
    assert "Fehlercode E24" in result["text"]
    assert result["text"].count("\f") == 1  # one page break between two pages


def test_extract_pdf_without_text_layer_is_empty(tmp_path: Path) -> None:
    path = tmp_path / "scan.pdf"
    path.write_bytes(make_pdf([""]))
    assert extract_text_sync(path, "application/pdf")["status"] == STATUS_EMPTY


def test_extract_unsupported_and_plain_text(tmp_path: Path) -> None:
    img = tmp_path / "p.jpg"
    img.write_bytes(b"\xff\xd8\xff")
    assert extract_text_sync(img, "image/jpeg")["status"] == STATUS_UNSUPPORTED
    txt = tmp_path / "n.txt"
    txt.write_text("Kühlschrank   Notiz\nzweite Zeile", encoding="utf-8")
    result = extract_text_sync(txt, "text/plain")
    assert result["status"] == STATUS_TEXT
    assert result["text"] == "Kühlschrank Notiz zweite Zeile"


def test_extract_corrupt_pdf_is_an_error_not_an_exception(tmp_path: Path) -> None:
    path = tmp_path / "x.pdf"
    path.write_bytes(b"not a pdf")
    assert extract_text_sync(path, "application/pdf")["status"] == "error"


# ─── index lifecycle ─────────────────────────────────────────────────────────


async def test_upload_extracts_in_the_background_and_search_finds_page_and_snippet(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry
) -> None:
    await setup_integration(hass, global_entry, object_entry)
    store = _store(hass)
    doc = await store.async_add_file(OBJECT_ID_1, content=MANUAL, filename="manual.pdf", mime="application/pdf", tags=["manual"])
    await hass.async_block_till_done(wait_background_tasks=True)
    index = _index(hass)
    digest = doc["hash"]
    assert index.meta[digest]["status"] == STATUS_TEXT
    assert text_sidecar_path(hass, digest).exists()

    hits = await index.async_search("fehlercode e24")
    assert len(hits) == 1
    assert hits[0]["digest"] == digest
    assert hits[0]["page"] == 2
    assert "E24" in hits[0]["snippet"]
    # Tolerance carries into the content: digraph spelling + a typo.
    assert (await index.async_search("stoerungen"))[0]["page"] == 2
    assert (await index.async_search("reinigne"))[0]["page"] == 2
    assert await index.async_search("garten") == []
    assert await index.async_search("e24 garten") == []  # every token must hit


async def test_last_dereference_drops_sidecar_meta_and_index(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry
) -> None:
    await setup_integration(hass, global_entry, object_entry)
    store = _store(hass)
    a = await store.async_add_file(OBJECT_ID_1, content=MANUAL, filename="a.pdf", mime="application/pdf")
    b = await store.async_add_file(OBJECT_ID_1, content=MANUAL, filename="b.pdf", mime="application/pdf")
    await hass.async_block_till_done(wait_background_tasks=True)
    index = _index(hass)
    digest = a["hash"]
    assert b["hash"] == digest and b["deduped"]
    assert await index.async_search("zulauf")

    await store.async_remove(a["id"])  # still referenced by b
    assert digest in index.meta and text_sidecar_path(hass, digest).exists()
    assert await index.async_search("zulauf")

    await store.async_remove(b["id"])  # last reference
    await hass.async_block_till_done(wait_background_tasks=True)
    assert digest not in index.meta
    assert not text_sidecar_path(hass, digest).exists()
    assert await index.async_search("zulauf") == []


async def test_backfill_extracts_pre_existing_blobs_and_prunes_stale_meta(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry
) -> None:
    await setup_integration(hass, global_entry, object_entry)
    store = _store(hass)
    index = _index(hass)
    # A blob that predates the index: registered + on disk, no meta.
    store.text_index = None
    doc = await store.async_add_file(OBJECT_ID_1, content=MANUAL, filename="old.pdf", mime="application/pdf")
    store.text_index = index
    assert doc["hash"] not in index.meta
    index.meta["deadbeef" * 8] = {"status": STATUS_TEXT, "v": 1}  # blob long gone

    summary = index.summary()
    assert summary["pending"] == 1 and summary["indexed"] == 0

    result = await index.async_backfill()
    assert result == {"extracted": 1, "stale": 1}
    assert index.meta[doc["hash"]]["status"] == STATUS_TEXT
    assert "deadbeef" * 8 not in index.meta
    assert index.summary() == {"total": 1, "indexed": 1, "no_text": 0, "unsupported": 0, "pending": 0}
    assert (await index.async_search("geschirrspueler"))[0]["page"] == 1


async def test_summary_counts_no_text_layer_and_unsupported(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry
) -> None:
    await setup_integration(hass, global_entry, object_entry)
    store = _store(hass)
    await store.async_add_file(OBJECT_ID_1, content=MANUAL, filename="m.pdf", mime="application/pdf")
    await store.async_add_file(OBJECT_ID_1, content=make_pdf([""]), filename="scan.pdf", mime="application/pdf")
    await store.async_add_file(OBJECT_ID_1, content=b"\xff\xd8\xff", filename="p.jpg", mime="image/jpeg")
    await hass.async_block_till_done(wait_background_tasks=True)
    conn = _conn()
    await call_ws_handler(ws_documents_storage, hass, conn, {"id": 1, "type": "x"})
    summary = conn.send_result.call_args[0][1]
    assert summary["search_index"] == {"total": 3, "indexed": 1, "no_text": 1, "unsupported": 1, "pending": 0}


# ─── WS ──────────────────────────────────────────────────────────────────────


async def test_documents_search_is_tolerant_and_ranked(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry
) -> None:
    await setup_integration(hass, global_entry, object_entry)
    store = _store(hass)
    await store.async_add_file(OBJECT_ID_1, content=b"x", filename="Bedienungsanleitung.pdf", mime="application/pdf", tags=["manual"])
    await store.async_add_weblink(OBJECT_ID_1, url="https://x/warranty", title="Garantie Spülmaschine", tags=["warranty"])
    await hass.async_block_till_done(wait_background_tasks=True)

    async def search(q: str) -> list[dict]:
        conn = _conn()
        await call_ws_handler(ws_documents_search, hass, conn, {"id": 1, "type": "x", "query": q})
        return conn.send_result.call_args[0][1]["results"]

    assert [r["filename"] for r in await search("bedienungs anleitung")] == ["Bedienungsanleitung.pdf"]
    assert [r["title"] for r in await search("spuel garant")] == ["Garantie Spülmaschine"]
    assert [r["title"] for r in await search("garantei")] == ["Garantie Spülmaschine"]  # one typo
    assert await search("garantie handbuch") == []  # AND across tokens


async def test_global_search_returns_documents_with_content_hits_and_history_notes(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry
) -> None:
    await setup_integration(hass, global_entry, object_entry)
    store = _store(hass)
    manual = await store.async_add_file(OBJECT_ID_1, content=MANUAL, filename="manual.pdf", mime="application/pdf", tags=["manual"])
    await store.async_add_weblink(OBJECT_ID_1, url="https://x/e24", title="Fehlercode E24 Video")
    await hass.async_block_till_done(wait_background_tasks=True)

    async def search(q: str) -> dict:
        conn = _conn()
        await call_ws_handler(ws_search, hass, conn, {"id": 1, "type": "x", "query": q, "limit": 8})
        return conn.send_result.call_args[0][1]

    res = await search("e24")
    kinds = {d["id"]: d for d in res["documents"]}
    assert manual["id"] in kinds
    content = kinds[manual["id"]]
    assert content["match"] == "content" and content["page"] == 2 and "E24" in content["snippet"]
    assert content["object_name"] == "Spülmaschine" and content["entry_id"] == object_entry.entry_id
    meta = next(d for d in res["documents"] if d["kind"] == "weblink")
    assert meta["match"] == "meta" and meta["page"] is None
    assert res["history"] == []

    res = await search("dichtung")
    assert res["documents"] == []
    assert len(res["history"]) == 1
    hit = res["history"][0]
    assert hit["task_id"] == TASK_ID_1 and hit["entry_id"] == object_entry.entry_id
    assert hit["object_name"] == "Spülmaschine" and hit["type"] == "completed"
    assert "Dichtung" in hit["snippet"]

    # Tolerance on notes too: typo + prefix; blank query = nothing.
    assert len((await search("ersatzteli"))["history"]) == 1
    assert (await search("   "))["history"] == [] and (await search("   "))["documents"] == []


async def test_global_search_limit_is_honoured(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry
) -> None:
    await setup_integration(hass, global_entry, object_entry)
    store = _store(hass)
    for i in range(5):
        await store.async_add_weblink(OBJECT_ID_1, url=f"https://x/{i}", title=f"Filter Anleitung {i}")
    await hass.async_block_till_done(wait_background_tasks=True)
    conn = _conn()
    await call_ws_handler(ws_search, hass, conn, {"id": 1, "type": "x", "query": "filter", "limit": 2})
    assert len(conn.send_result.call_args[0][1]["documents"]) == 2


async def test_history_search_sees_store_merged_history(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry
) -> None:
    """A note written through the coordinator (dynamic Store) is searchable
    without a reload — the read path is merged_tasks, not the static entry."""
    await setup_integration(hass, global_entry, object_entry)
    coordinator = object_entry.runtime_data.coordinator
    await coordinator.complete_maintenance(TASK_ID_1, notes="Wasserhahn tropfte, Dichtring getauscht", unattended=True)
    await hass.async_block_till_done(wait_background_tasks=True)
    conn = _conn()
    await call_ws_handler(ws_search, hass, conn, {"id": 1, "type": "x", "query": "dichtring"})
    hits = conn.send_result.call_args[0][1]["history"]
    assert len(hits) == 1 and "Dichtring" in hits[0]["snippet"]

# ─── edges (coverage of the branches a happy path never takes) ───────────────


def test_extract_edge_cases_via_a_fake_reader(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    """Encrypted → error; a page that raises is skipped; the page and char
    caps cut the text; a text/* file that cannot be read → error."""
    path = tmp_path / "x.pdf"
    path.write_bytes(b"%PDF-1.4 fake")

    class Page:
        def __init__(self, text: str | Exception) -> None:
            self._text = text

        def extract_text(self) -> str:
            if isinstance(self._text, Exception):
                raise self._text
            return self._text

    class Reader:
        encrypted = False
        pages: list[Page] = []

        def __init__(self, _p: str) -> None:
            self.is_encrypted = Reader.encrypted

        def decrypt(self, _pw: str) -> None:
            raise ValueError("no")

    import pypdf

    monkeypatch.setattr(pypdf, "PdfReader", Reader)
    Reader.encrypted = True
    assert extract_text_sync(path, "application/pdf")["status"] == STATUS_ERROR
    Reader.encrypted = False
    Reader.pages = [Page("Erste Seite mit Woertern"), Page(RuntimeError("broken page")), Page("Dritte Seite Woerter hier")]
    monkeypatch.setattr(dt, "MAX_PAGES", 2)
    result = extract_text_sync(path, "application/pdf")
    assert result["status"] == STATUS_TEXT and result["indexed_pages"] == 2 and result["pages"] == 3
    assert result["text"] == "Erste Seite mit Woertern" + "\f"
    monkeypatch.setattr(dt, "MAX_PAGES", 150)
    monkeypatch.setattr(dt, "MAX_CHARS", 30)
    Reader.pages = [Page("Erste Seite mit Woertern und noch mehr Text"), Page("zweite")]
    result = extract_text_sync(path, "application/pdf")
    assert result["chars"] == 30 and result["indexed_pages"] == 1
    assert extract_text_sync(tmp_path / "missing.txt", "text/plain")["status"] == STATUS_ERROR


def test_sidecar_path_rejects_a_bad_digest(hass: HomeAssistant) -> None:
    with pytest.raises(ValueError):
        text_sidecar_path(hass, "../etc/passwd")


async def test_index_edges(hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry) -> None:
    await setup_integration(hass, global_entry, object_entry)
    store = _store(hass)
    index = _index(hass)
    # A text file with one-letter words and a word shared with the manual.
    note = await store.async_add_file(OBJECT_ID_1, content="Kühlschrank a Notiz Zulauf".encode(), filename="n.txt", mime="text/plain")
    manual = await store.async_add_file(OBJECT_ID_1, content=MANUAL, filename="m.pdf", mime="application/pdf")
    await hass.async_block_till_done(wait_background_tasks=True)
    assert {h["digest"] for h in await index.async_search("zulauf")} == {note["hash"], manual["hash"]}
    assert await index.async_search("   ") == []
    assert index._match_words(("",)) == {}
    # Unknown blob / already extracted / double schedule are no-ops.
    assert await index.async_extract("00" * 32) is None
    index.schedule(manual["hash"])
    index._pending.add(note["hash"])
    index.schedule(note["hash"])
    index._pending.discard(note["hash"])
    await index.async_ensure_loaded()  # already loaded → early return
    # A sidecar that vanished under us: the meta entry goes, the search stays quiet.
    text_sidecar_path(hass, note["hash"]).unlink()
    assert index._read_sidecar_sync(note["hash"]) == ""
    index._loaded = False
    index._index.clear()
    index._vocab_dirty = True
    await index.async_ensure_loaded()
    assert note["hash"] not in index.meta
    # A hit whose sidecar is gone still answers, without page or snippet.
    index._add_to_index(note["hash"], "zulauf")
    ghost = next(h for h in await index.async_search("zulauf") if h["digest"] == note["hash"])
    assert ghost["page"] is None and ghost["snippet"] == ""


async def test_backfill_scheduling_and_failure_logging(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry, monkeypatch: pytest.MonkeyPatch, caplog: pytest.LogCaptureFixture
) -> None:
    from datetime import timedelta

    from homeassistant.util import dt as dt_util
    from pytest_homeassistant_custom_component.common import async_fire_time_changed

    await setup_integration(hass, global_entry, object_entry)
    index = _index(hass)
    calls: list[str] = []

    async def _boom() -> dict[str, int]:
        calls.append("x")
        raise RuntimeError("disk on fire")

    monkeypatch.setattr(index, "async_backfill", _boom)
    index.schedule_backfill(delay=5)
    index.schedule_backfill(delay=5)  # re-arming cancels the first timer
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=6))
    await hass.async_block_till_done()
    assert calls == ["x"]
    assert "Document search backfill failed" in caplog.text
    index.schedule_backfill(delay=60)
    index.cancel()
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=120))
    await hass.async_block_till_done()
    assert calls == ["x"]


async def test_global_search_document_matching_both_meta_and_content(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry
) -> None:
    await setup_integration(hass, global_entry, object_entry)
    store = _store(hass)
    doc = await store.async_add_file(OBJECT_ID_1, content=MANUAL, filename="e24-guide.pdf", mime="application/pdf", title="Fehlercode E24")
    await hass.async_block_till_done(wait_background_tasks=True)
    conn = _conn()
    await call_ws_handler(ws_search, hass, conn, {"id": 1, "type": "x", "query": "e24"})
    hit = next(d for d in conn.send_result.call_args[0][1]["documents"] if d["id"] == doc["id"])
    assert hit["match"] == "meta" and hit["page"] == 2 and "E24" in hit["snippet"]
