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


async def test_load_restores_persisted_data(hass: HomeAssistant) -> None:
    s1 = await _store(hass)
    doc = await s1.async_add_file("obj1", content=b"persist", filename="a.pdf", mime="application/pdf")
    # A fresh store over the same (mocked) storage must see the saved metadata.
    s2 = await _store(hass)
    assert s2.get(doc["id"]) is not None
    assert s2.blobs[doc["hash"]]["refcount"] == 1


async def test_add_file_adopts_orphan_blob_on_disk(hass: HomeAssistant) -> None:
    import hashlib

    s = await _store(hass)
    content = b"orphan-on-disk"
    digest = hashlib.sha256(content).hexdigest()
    s._blobs_dir.mkdir(parents=True, exist_ok=True)
    s.blob_path(digest).write_bytes(content)  # on disk but not in the registry
    doc = await s.async_add_file("obj1", content=content, filename="a.pdf", mime="application/pdf")
    assert doc["hash"] == digest
    assert doc["deduped"] is False           # absent from registry → not a dedup
    assert s.blobs[digest]["refcount"] == 1  # adopted into the registry


async def test_remove_unknown_doc_returns_zero(hass: HomeAssistant) -> None:
    s = await _store(hass)
    assert await s.async_remove("nonexistent") == 0


async def test_remove_object_without_docs_returns_zero(hass: HomeAssistant) -> None:
    s = await _store(hass)
    assert await s.async_remove_object("empty") == 0


async def test_remove_file_doc_with_missing_hash(hass: HomeAssistant) -> None:
    s = await _store(hass)
    s.documents["d"] = {
        "object_id": "o", "kind": "file", "title": "x",
        "tags": [], "task_ids": [], "added_at": "2026-01-01T00:00:00",
    }
    assert await s.async_remove("d") == 0  # no "hash" → deref is a no-op


async def test_remove_file_doc_blob_not_in_registry(hass: HomeAssistant) -> None:
    s = await _store(hass)
    s.documents["d"] = {
        "object_id": "o", "kind": "file", "hash": "a" * 64, "title": "x",
        "tags": [], "task_ids": [], "added_at": "2026-01-01T00:00:00",
    }
    assert await s.async_remove("d") == 0  # valid hex but unknown blob → no-op


async def test_find_issues_without_blobs_dir(hass: HomeAssistant) -> None:
    s = await _store(hass)  # no files added → the blobs dir never gets created
    assert await s.async_find_issues() == {
        "orphan_blobs": [], "zero_refcount": [], "dangling_docs": [],
    }


async def test_delete_blob_oserror_is_swallowed(
    hass: HomeAssistant, monkeypatch: pytest.MonkeyPatch,
) -> None:
    s = await _store(hass)
    doc = await s.async_add_file("obj1", content=b"z", filename="a.pdf", mime="application/pdf")

    def _boom(self: Path, missing_ok: bool = False) -> None:
        raise OSError("cannot unlink")

    monkeypatch.setattr(Path, "unlink", _boom)
    # Last-ref removal deletes the blob; an unlink OSError must be swallowed.
    assert await s.async_remove(doc["id"]) == len(b"z")


async def test_list_blob_files_ignores_foreign_names(hass: HomeAssistant) -> None:
    """Only 64-char hex names count as our blobs — foreign files are ignored."""
    s = await _store(hass)
    s._blobs_dir.mkdir(parents=True, exist_ok=True)
    (s._blobs_dir / "README.txt").write_bytes(b"not ours")
    (s._blobs_dir / ("a" * 63)).write_bytes(b"too short")  # not 64 chars
    issues = await s.async_find_issues()
    assert issues["orphan_blobs"] == []  # neither foreign file is flagged


async def test_reclaim_blob_missing_returns_zero(hass: HomeAssistant) -> None:
    """Reclaiming a blob whose file already vanished frees 0 bytes, no error."""
    s = await _store(hass)
    assert s._reclaim_blob_sync("a" * 64) == 0


async def test_cleanup_no_issues_is_noop(hass: HomeAssistant) -> None:
    s = await _store(hass)
    await s.async_add_file("o", content=b"x", filename="a.pdf", mime="application/pdf")
    assert await s.async_cleanup_issues() == {
        "orphans_deleted": 0,
        "zero_refcount_cleared": 0,
        "dangling_removed": 0,
        "bytes_freed": 0,
    }


async def test_cleanup_reclaims_orphans_zero_and_dangling(hass: HomeAssistant) -> None:
    s = await _store(hass)
    keep = await s.async_add_file("o", content=b"keep", filename="k.pdf", mime="application/pdf")
    dangling = await s.async_add_file("o", content=b"gone", filename="g.pdf", mime="application/pdf")
    s.blob_path(dangling["hash"]).unlink()  # blob missing → doc is dangling

    orphan = "b" * 64
    s.blob_path(orphan).write_bytes(b"orphan-bytes")  # on disk, not in registry

    zero = "c" * 64
    s.blob_path(zero).write_bytes(b"zero")
    s.blobs[zero] = {"size": 4, "mime": "x", "refcount": 0}  # crash between deref/delete

    summary = await s.async_cleanup_issues()
    assert summary == {
        "orphans_deleted": 1,
        "zero_refcount_cleared": 1,
        "dangling_removed": 1,
        "bytes_freed": len(b"orphan-bytes") + 4,  # dangling frees 0 real bytes
    }

    # Everything reconciled, and the live doc + blob are untouched.
    assert await s.async_find_issues() == {
        "orphan_blobs": [], "zero_refcount": [], "dangling_docs": [],
    }
    assert not s.blob_path(orphan).exists()
    assert not s.blob_path(zero).exists()
    assert dangling["hash"] not in s.blobs      # phantom registry entry gone
    assert s.get(dangling["id"]) is None
    assert s.get(keep["id"]) is not None
    assert s.blob_path(keep["hash"]).exists()
