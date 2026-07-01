"""Tests for the DocumentStore — content-addressed storage, dedup, lifecycle."""

from __future__ import annotations

import shutil
from collections.abc import Iterator
from pathlib import Path

import pytest
from homeassistant.core import HomeAssistant

from custom_components.maintenance_supporter.helpers import documents as docmod
from custom_components.maintenance_supporter.helpers.documents import DocumentStore


@pytest.fixture(autouse=True)
def _isolate_docs_dir(hass: HomeAssistant) -> Iterator[None]:
    """Blobs live on the shared test config dir — give each test a clean one."""
    docs = Path(hass.config.path("maintenance_supporter", "docs"))
    shutil.rmtree(docs, ignore_errors=True)
    yield
    shutil.rmtree(docs, ignore_errors=True)


async def _store(hass: HomeAssistant) -> DocumentStore:
    s = DocumentStore(hass)
    await s.async_load()
    return s


async def test_add_file_creates_blob_and_metadata(hass: HomeAssistant) -> None:
    s = await _store(hass)
    doc = await s.async_add_file(
        "obj1", content=b"manual A", filename="a.pdf", mime="application/pdf",
        title="Manual", tags=["manual"],
    )
    assert doc["kind"] == "file"
    assert doc["deduped"] is False
    assert doc["size"] == len(b"manual A")
    digest = doc["hash"]
    assert s.blobs[digest]["refcount"] == 1
    assert s.blob_path(digest).exists()
    assert s.blob_path(digest).read_bytes() == b"manual A"
    assert [d["id"] for d in s.for_object("obj1")] == [doc["id"]]


async def test_dedup_same_content_shares_blob(hass: HomeAssistant) -> None:
    s = await _store(hass)
    d1 = await s.async_add_file("obj1", content=b"same", filename="a.pdf", mime="application/pdf")
    d2 = await s.async_add_file("obj2", content=b"same", filename="b.pdf", mime="application/pdf")
    assert d1["hash"] == d2["hash"]
    assert d2["deduped"] is True
    assert s.blobs[d1["hash"]]["refcount"] == 2
    assert len(s._list_blob_files()) == 1  # one physical blob


async def test_duplicate_in_same_object_flagged(hass: HomeAssistant) -> None:
    s = await _store(hass)
    d1 = await s.async_add_file("obj1", content=b"x", filename="a.pdf", mime="application/pdf")
    d2 = await s.async_add_file("obj1", content=b"x", filename="a.pdf", mime="application/pdf")
    assert d2["duplicate_in_object"] == d1["id"]


async def test_remove_shared_keeps_blob_until_last_ref(hass: HomeAssistant) -> None:
    s = await _store(hass)
    d1 = await s.async_add_file("obj1", content=b"shared", filename="a.pdf", mime="application/pdf")
    d2 = await s.async_add_file("obj2", content=b"shared", filename="b.pdf", mime="application/pdf")

    assert await s.async_remove(d1["id"]) == 0  # still referenced by obj2
    assert s.blobs[d2["hash"]]["refcount"] == 1
    assert s.blob_path(d2["hash"]).exists()

    assert await s.async_remove(d2["id"]) == len(b"shared")  # last ref frees it
    assert d2["hash"] not in s.blobs
    assert not s.blob_path(d2["hash"]).exists()


async def test_weblink_has_no_blob(hass: HomeAssistant) -> None:
    s = await _store(hass)
    doc = await s.async_add_weblink("obj1", url="https://x/manual.pdf", title="Online")
    assert doc["kind"] == "weblink"
    assert s.blobs == {}
    assert await s.async_remove(doc["id"]) == 0


async def test_update_metadata(hass: HomeAssistant) -> None:
    s = await _store(hass)
    doc = await s.async_add_file("obj1", content=b"y", filename="a.pdf", mime="application/pdf")
    assert await s.async_update(doc["id"], title="New", tags=["warranty"], task_ids=["t1"]) is True
    got = s.get(doc["id"])
    assert got["title"] == "New"
    assert got["tags"] == ["warranty"]
    assert got["task_ids"] == ["t1"]
    assert await s.async_update("missing", title="X") is False


async def test_remove_object_clears_all(hass: HomeAssistant) -> None:
    s = await _store(hass)
    await s.async_add_file("obj1", content=b"a", filename="a.pdf", mime="application/pdf")
    await s.async_add_file("obj1", content=b"b", filename="b.pdf", mime="application/pdf")
    await s.async_add_weblink("obj1", url="https://x")
    freed = await s.async_remove_object("obj1")
    assert freed == len(b"a") + len(b"b")
    assert s.for_object("obj1") == []
    assert s.blobs == {}


async def test_storage_summary_physical_vs_logical(hass: HomeAssistant) -> None:
    s = await _store(hass)
    await s.async_add_file("obj1", content=b"1234567890", filename="a.pdf", mime="application/pdf", tags=["manual"])
    await s.async_add_file("obj2", content=b"1234567890", filename="b.pdf", mime="application/pdf", tags=["manual"])  # dedup
    await s.async_add_file("obj1", content=b"xyz", filename="c.pdf", mime="application/pdf", tags=["warranty"])
    await s.async_add_weblink("obj1", url="https://x")

    summ = s.storage_summary()
    assert summ["total_bytes"] == 10 + 3          # unique blobs (physical / backup cost)
    assert summ["logical_bytes"] == 10 + 10 + 3   # per-doc (shared counted twice)
    assert summ["dedup_savings_bytes"] == 10
    assert summ["file_count"] == 3
    assert summ["link_count"] == 1
    assert summ["by_object"]["obj1"]["files"] == 2
    assert summ["by_object"]["obj1"]["links"] == 1
    assert summ["by_category"]["manual"] == 20


async def test_find_issues_orphan_and_dangling(hass: HomeAssistant) -> None:
    s = await _store(hass)
    doc = await s.async_add_file("obj1", content=b"data", filename="a.pdf", mime="application/pdf")

    stray = "a" * 64  # a stray hex-named file with no registry entry
    s.blob_path(stray).write_bytes(b"stray")
    s.blob_path(doc["hash"]).unlink()  # delete the real blob behind the doc's back

    issues = await s.async_find_issues()
    assert stray in issues["orphan_blobs"]
    assert doc["id"] in issues["dangling_docs"]


async def test_file_too_large_rejected(hass: HomeAssistant, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(docmod, "MAX_DOC_BYTES", 4)
    s = await _store(hass)
    with pytest.raises(ValueError):
        await s.async_add_file("obj1", content=b"toolong", filename="big.pdf", mime="application/pdf")


async def test_blob_path_rejects_traversal(hass: HomeAssistant) -> None:
    s = DocumentStore(hass)
    with pytest.raises(ValueError):
        s.blob_path("../etc/passwd")
    with pytest.raises(ValueError):
        s.blob_path("NOThex")
