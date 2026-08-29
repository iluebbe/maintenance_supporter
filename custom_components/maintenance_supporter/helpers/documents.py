"""Document storage for maintenance objects — manuals/PDFs + web-links.

Files are **content-addressed** (SHA-256) under
``<config>/maintenance_supporter/docs/blobs/<hash>`` so identical uploads dedupe
to a single reference-counted blob. All document metadata + the blob registry
live in one global Store (``.storage/maintenance_supporter.documents``); the
binaries live on disk under ``/config`` so they're included in Home Assistant
backups (unlike ``/media``/``/share`` which are separate backup toggles).

Design notes: see the project memory ``project_documents_feature_concept``.
This is the v1 backend foundation — pure storage + dedup + lifecycle; WS,
serving view, sensor and frontend build on top of it.
"""

from __future__ import annotations

import hashlib
import logging
import os
from pathlib import Path
from typing import Any
from uuid import uuid4

from homeassistant.core import HomeAssistant
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from ..const import DOMAIN, MAX_DOCS_PER_OBJECT, SIGNAL_DOCUMENTS_UPDATED

_LOGGER = logging.getLogger(__name__)

DOC_STORE_VERSION = 1
DOC_STORE_KEY = f"{DOMAIN}.documents"
DOCS_SUBDIR = "docs"
BLOBS_SUBDIR = "blobs"

# Predefined document categories (localized in the frontend; stored as keys).
DOC_CATEGORIES = ("manual", "warranty", "invoice", "spare_parts", "photo", "other")

# Per-file cap — guards against runaway backup growth (docs live in /config and
# are therefore duplicated into every retained backup).
MAX_DOC_BYTES = 25 * 1024 * 1024  # 25 MB

KIND_FILE = "file"
KIND_WEBLINK = "weblink"


class DocumentStore:
    """Global store for maintenance-object documents (metadata + blob registry).

    ``documents``: ``{doc_id: {object_id, kind, hash|url, title, filename, mime,
    size, tags, task_ids, added_at}}``.
    ``blobs``: ``{sha256: {size, mime, refcount}}`` — the content-addressed
    registry backing ``kind == "file"`` documents (shared across objects).
    """

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize the document store."""
        self.hass = hass
        self._store: Store[dict[str, Any]] = Store(hass, DOC_STORE_VERSION, DOC_STORE_KEY)
        self._data: dict[str, Any] = {"documents": {}, "blobs": {}}

    # ------------------------------------------------------------------
    # Paths
    # ------------------------------------------------------------------

    @property
    def _blobs_dir(self) -> Path:
        return Path(self.hass.config.path(DOMAIN, DOCS_SUBDIR, BLOBS_SUBDIR))

    def blob_path(self, digest: str) -> Path:
        """Absolute path to a blob file (validated hex digest — no traversal)."""
        if not digest or not all(c in "0123456789abcdef" for c in digest):
            raise ValueError(f"invalid blob digest: {digest!r}")
        return self._blobs_dir / digest

    # ------------------------------------------------------------------
    # Load / save
    # ------------------------------------------------------------------

    async def async_load(self) -> None:
        """Load persisted metadata + blob registry."""
        raw = await self._store.async_load()
        if raw is not None:
            self._data = self._sanitize_loaded(raw)
        self._data.setdefault("documents", {})
        self._data.setdefault("blobs", {})

    @staticmethod
    def _sanitize_loaded(raw: Any) -> dict[str, Any]:
        """Coerce a loaded payload to the ``{"documents": {}, "blobs": {}}`` shape.

        Mirrors ``storage.MaintenanceStore._sanitize_loaded``: HA quarantines
        syntactically corrupt files, but a hand-edited/partially written file
        can be valid JSON of the wrong SHAPE — and this is a GLOBAL store, so
        an AttributeError here would fail the whole integration setup, not
        just one object. Wrong-shaped sections degrade to empty; non-dict
        records are dropped, the rest kept.
        """
        if not isinstance(raw, dict):
            _LOGGER.warning("Document store payload is %s, expected dict — resetting", type(raw).__name__)
            return {"documents": {}, "blobs": {}}
        data = dict(raw)
        for section in ("documents", "blobs"):
            value = data.get(section)
            if value is None:
                continue
            if not isinstance(value, dict):
                _LOGGER.warning("Document store %r is %s, expected dict — resetting", section, type(value).__name__)
                data[section] = {}
                continue
            kept = {key: rec for key, rec in value.items() if isinstance(rec, dict)}
            if len(kept) != len(value):
                _LOGGER.warning("Dropping %d malformed document store %r record(s)", len(value) - len(kept), section)
            data[section] = kept
        return data

    async def _async_save(self) -> None:
        # Doc mutations are infrequent → immediate save keeps metadata and the
        # on-disk blobs consistent (a crash between the two only ever leaves an
        # orphan blob, which the hygiene scan reclaims).
        await self._store.async_save(self._data)
        # Nudge the storage sensor (and any other listener) to refresh. Sent
        # after the save so listeners always read post-mutation state.
        async_dispatcher_send(self.hass, SIGNAL_DOCUMENTS_UPDATED)

    # ------------------------------------------------------------------
    # Accessors
    # ------------------------------------------------------------------

    @property
    def documents(self) -> dict[str, dict[str, Any]]:
        """The raw ``{doc_id: metadata}`` map."""
        docs: dict[str, dict[str, Any]] = self._data["documents"]
        return docs

    @property
    def blobs(self) -> dict[str, dict[str, Any]]:
        """The raw ``{hash: {size, mime, refcount}}`` registry."""
        blobs: dict[str, dict[str, Any]] = self._data["blobs"]
        return blobs

    def get(self, doc_id: str) -> dict[str, Any] | None:
        """Return a document's metadata (with its ``id``), or None."""
        doc = self.documents.get(doc_id)
        return {"id": doc_id, **doc} if doc is not None else None

    def for_object(self, object_id: str) -> list[dict[str, Any]]:
        """All documents attached to an object, newest first."""
        docs = [{"id": did, **d} for did, d in self.documents.items() if d.get("object_id") == object_id]
        docs.sort(key=lambda d: d.get("added_at", ""), reverse=True)
        return docs

    # ------------------------------------------------------------------
    # Add
    # ------------------------------------------------------------------

    async def async_add_file(
        self,
        object_id: str,
        *,
        content: bytes,
        filename: str,
        mime: str,
        title: str | None = None,
        tags: list[str] | None = None,
    ) -> dict[str, Any]:
        """Store an uploaded file (content-addressed + deduped) for an object.

        Returns the new document dict plus ``deduped`` (the blob already existed)
        and ``duplicate_in_object`` (the id of an existing doc on the *same*
        object with identical content, if any — the caller surfaces a hint).
        """
        if len(content) > MAX_DOC_BYTES:
            raise ValueError("file_too_large")

        # Per-object document cap — a runaway upload loop must not be able to
        # bloat the (single, global) documents store without bound.
        object_doc_count = sum(1 for d in self.documents.values() if d.get("object_id") == object_id)
        if object_doc_count >= MAX_DOCS_PER_OBJECT:
            raise ValueError("too_many_documents")

        digest, wrote_new = await self.hass.async_add_executor_job(self._store_blob_sync, content)

        # Register / adopt the blob and bump its refcount.
        blob = self.blobs.get(digest)
        deduped = blob is not None
        if blob is None:
            blob = {"size": len(content), "mime": mime, "refcount": 0}
            self.blobs[digest] = blob
        blob["refcount"] += 1

        duplicate_in_object = next(
            (did for did, d in self.documents.items() if d.get("object_id") == object_id and d.get("hash") == digest),
            None,
        )

        doc_id = uuid4().hex
        doc = {
            "object_id": object_id,
            "kind": KIND_FILE,
            "hash": digest,
            "title": title or filename,
            "filename": filename,
            "mime": mime,
            "size": len(content),
            "tags": list(tags or []),
            "task_ids": [],
            "part_ids": [],
            "added_at": dt_util.utcnow().isoformat(),
        }
        self.documents[doc_id] = doc
        await self._async_save()
        if not wrote_new and not deduped:
            _LOGGER.debug("Adopted pre-existing blob %s into registry", digest[:12])
        return {
            "id": doc_id,
            "deduped": deduped,
            "duplicate_in_object": duplicate_in_object,
            **doc,
        }

    def _store_blob_sync(self, content: bytes) -> tuple[str, bool]:
        """Hash content and write the blob if absent. Returns (digest, wrote_new)."""
        digest = hashlib.sha256(content).hexdigest()
        path = self.blob_path(digest)
        if path.exists():
            return digest, False
        self._blobs_dir.mkdir(parents=True, exist_ok=True)
        tmp = path.with_name(path.name + ".tmp")
        tmp.write_bytes(content)
        os.replace(tmp, path)  # atomic
        return digest, True

    async def async_add_weblink(
        self,
        object_id: str,
        *,
        url: str,
        title: str | None = None,
        tags: list[str] | None = None,
    ) -> dict[str, Any]:
        """Attach an external web-link (0 storage, NOT in backups)."""
        doc_id = uuid4().hex
        doc = {
            "object_id": object_id,
            "kind": KIND_WEBLINK,
            "url": url,
            "title": title or url,
            "tags": list(tags or []),
            "task_ids": [],
            "part_ids": [],
            "added_at": dt_util.utcnow().isoformat(),
        }
        self.documents[doc_id] = doc
        await self._async_save()
        return {"id": doc_id, **doc}

    async def async_import_documents(
        self,
        object_id: str,
        docs: list[dict[str, Any]],
        task_id_map: dict[str, str] | None = None,
        part_id_map: dict[str, str] | None = None,
    ) -> int:
        """Recreate document metadata for an imported object (P6).

        Web-links round-trip fully. File docs are restored as metadata + a blob
        refcount; the binary itself is not in the JSON export (it rides the
        /config backup), so unless a matching backup was restored the blob is
        absent and the hygiene scan flags the doc as dangling. ``task_ids`` /
        ``part_ids`` are remapped through their old→new id maps so a doc's
        task and spare-part links survive the import; ids with no mapping are
        dropped. Returns the number created.
        """

        def _remap(meta: dict[str, Any]) -> list[str]:
            if not task_id_map:
                return []
            return [task_id_map[t] for t in (meta.get("task_ids") or []) if t in task_id_map]

        def _remap_parts(meta: dict[str, Any]) -> list[str]:
            if not part_id_map:
                return []
            return [part_id_map[p] for p in (meta.get("part_ids") or []) if p in part_id_map]

        created = 0
        for meta in docs:
            if not isinstance(meta, dict):
                continue
            tags = [x for x in (meta.get("tags") or []) if isinstance(x, str)]
            title = meta.get("title")
            if meta.get("kind") == KIND_WEBLINK:
                url = meta.get("url")
                # Only http(s) links — the add-link WS path enforces the same, so
                # a crafted export can't smuggle a javascript:/data: URL that the
                # frontend would later window.open (matches ws_documents_add_link).
                if not isinstance(url, str) or not url.lower().startswith(("http://", "https://")):
                    continue
                self.documents[uuid4().hex] = {
                    "object_id": object_id,
                    "kind": KIND_WEBLINK,
                    "url": url,
                    "title": title or url,
                    "tags": tags,
                    "task_ids": _remap(meta),
                    "part_ids": _remap_parts(meta),
                    "added_at": dt_util.utcnow().isoformat(),
                }
                created += 1
            elif meta.get("kind") == KIND_FILE:
                digest = meta.get("hash")
                if not isinstance(digest, str) or len(digest) != 64 or not all(c in "0123456789abcdef" for c in digest):
                    continue
                size = int(meta.get("size") or 0)
                mime = meta.get("mime") or "application/octet-stream"
                blob = self.blobs.get(digest)
                if blob is None:
                    blob = {"size": size, "mime": mime, "refcount": 0}
                    self.blobs[digest] = blob
                blob["refcount"] += 1
                self.documents[uuid4().hex] = {
                    "object_id": object_id,
                    "kind": KIND_FILE,
                    "hash": digest,
                    "title": title or meta.get("filename") or "document",
                    "filename": meta.get("filename") or "document",
                    "mime": mime,
                    "size": size,
                    "tags": tags,
                    "task_ids": _remap(meta),
                    "part_ids": _remap_parts(meta),
                    "added_at": dt_util.utcnow().isoformat(),
                }
                created += 1
        if created:
            await self._async_save()
        return created

    # ------------------------------------------------------------------
    # Update
    # ------------------------------------------------------------------

    async def async_update(
        self,
        doc_id: str,
        *,
        title: str | None = None,
        tags: list[str] | None = None,
        task_ids: list[str] | None = None,
        task_pages: dict[str, int] | None = None,
        part_ids: list[str] | None = None,
    ) -> bool:
        """Update editable metadata (title / tags / task+part links / per-task page).

        ``task_pages`` is a ``{task_id: page}`` map merged into the doc: a page
        ``>= 1`` sets the jump-to page for that task's link, ``0`` clears it. Page
        hints are always pruned to the currently linked tasks so an unlink also
        forgets its page, and an empty map is dropped to keep the record clean.
        ``part_ids`` (v2.26) links the doc to spare parts, mirroring task links.
        """
        doc = self.documents.get(doc_id)
        if doc is None:
            return False
        if title is not None:
            doc["title"] = title
        if tags is not None:
            doc["tags"] = list(tags)
        if task_ids is not None:
            doc["task_ids"] = list(task_ids)
        if part_ids is not None:
            doc["part_ids"] = list(part_ids)
        if task_pages is not None:
            merged = dict(doc.get("task_pages") or {})
            for tid, page in task_pages.items():
                if isinstance(page, int) and page >= 1:
                    merged[tid] = page
                else:
                    merged.pop(tid, None)
            doc["task_pages"] = merged
        pages = doc.get("task_pages")
        if pages is not None:
            linked = set(doc.get("task_ids") or [])
            pruned = {t: p for t, p in pages.items() if t in linked}
            if pruned:
                doc["task_pages"] = pruned
            else:
                doc.pop("task_pages", None)
        await self._async_save()
        return True

    # ------------------------------------------------------------------
    # Remove
    # ------------------------------------------------------------------

    async def async_remove(self, doc_id: str) -> int:
        """Remove a document. Returns bytes freed (0 if shared or a web-link).

        For a shared file (refcount > 1) the blob stays — only the last
        reference frees the bytes.
        """
        doc = self.documents.pop(doc_id, None)
        if doc is None:
            return 0
        freed = await self._deref_blob(doc)
        await self._async_save()
        return freed

    async def async_unlink_task(self, task_id: str) -> int:
        """Drop every document link to a deleted task. Returns the docs touched.

        The task-delete cleanup counterpart of :meth:`async_remove_object`:
        ``task_ids`` / ``task_pages`` are task-id keyed and persistent, so
        without this a deleted task's id lingers in the document metadata
        forever (and the panel's "linked tasks" chips point at nothing).
        Task ids are uuids, so no object filter is needed.
        """
        touched = 0
        for doc in self.documents.values():
            linked = doc.get("task_ids")
            pages = doc.get("task_pages")
            hit = False
            if isinstance(linked, list) and task_id in linked:
                doc["task_ids"] = [t for t in linked if t != task_id]
                hit = True
            if isinstance(pages, dict) and task_id in pages:
                remaining = {t: p for t, p in pages.items() if t != task_id}
                if remaining:
                    doc["task_pages"] = remaining
                else:
                    doc.pop("task_pages", None)
                hit = True
            if hit:
                touched += 1
        if touched:
            await self._async_save()
        return touched

    async def async_remove_object(self, object_id: str) -> int:
        """Remove every document of an object (on object delete). Bytes freed."""
        doc_ids = [did for did, d in self.documents.items() if d.get("object_id") == object_id]
        if not doc_ids:
            return 0
        freed = 0
        for did in doc_ids:
            doc = self.documents.pop(did, None)
            if doc is not None:
                freed += await self._deref_blob(doc)
        await self._async_save()
        return freed

    async def _deref_blob(self, doc: dict[str, Any]) -> int:
        """Decrement a file doc's blob refcount; delete the blob at 0."""
        if doc.get("kind") != KIND_FILE:
            return 0
        digest = doc.get("hash")
        if not isinstance(digest, str):
            return 0
        blob = self.blobs.get(digest)
        if blob is None:
            return 0
        blob["refcount"] = blob.get("refcount", 1) - 1
        if blob["refcount"] <= 0:
            size = int(blob.get("size", 0))
            self.blobs.pop(digest, None)
            await self.hass.async_add_executor_job(self._delete_blob_sync, digest)
            return size
        return 0

    def _delete_blob_sync(self, digest: str) -> None:
        try:
            self.blob_path(digest).unlink(missing_ok=True)
        except OSError:
            _LOGGER.warning("Could not delete blob %s", digest[:12])

    # ------------------------------------------------------------------
    # Storage summary (backs the sensor + the panel overview)
    # ------------------------------------------------------------------

    def storage_summary(self) -> dict[str, Any]:
        """Aggregate storage usage.

        ``total_bytes`` is the **physical** footprint (unique blobs) — the real
        backup cost. ``logical_bytes`` counts each file doc's size (shared blobs
        multiple times); the difference is the dedup saving.
        """
        total_bytes = sum(int(b.get("size", 0)) for b in self.blobs.values())
        logical_bytes = 0
        file_count = 0
        link_count = 0
        by_object: dict[str, dict[str, int]] = {}
        by_category: dict[str, int] = {}

        for doc in self.documents.values():
            obj = doc.get("object_id", "")
            slot = by_object.setdefault(obj, {"bytes": 0, "files": 0, "links": 0})
            if doc.get("kind") == KIND_FILE:
                size = int(doc.get("size", 0))
                logical_bytes += size
                file_count += 1
                slot["bytes"] += size
                slot["files"] += 1
                for tag in doc.get("tags") or ["other"]:
                    by_category[tag] = by_category.get(tag, 0) + size
            else:
                link_count += 1
                slot["links"] += 1

        return {
            "total_bytes": total_bytes,
            "logical_bytes": logical_bytes,
            "dedup_savings_bytes": max(0, logical_bytes - total_bytes),
            "blob_count": len(self.blobs),
            "file_count": file_count,
            "link_count": link_count,
            "document_count": len(self.documents),
            "by_object": by_object,
            "by_category": by_category,
        }

    # ------------------------------------------------------------------
    # Hygiene (backs the repair-issue scan)
    # ------------------------------------------------------------------

    async def async_find_issues(self) -> dict[str, list[str]]:
        """Detect storage anomalies for the repair-issue / cleanup flow.

        - ``orphan_blobs``: blob files on disk not referenced by the registry.
        - ``zero_refcount``: registry blobs whose refcount fell to 0 (a crash
          between deref and delete).
        - ``dangling_docs``: file documents whose blob is missing (external
          delete / partial restore).
        """
        on_disk: set[str] = await self.hass.async_add_executor_job(self._list_blob_files)
        registered = set(self.blobs)
        orphan_blobs = sorted(on_disk - registered)
        zero_refcount = sorted(h for h, b in self.blobs.items() if int(b.get("refcount", 0)) <= 0)
        dangling_docs = sorted(
            did
            for did, d in self.documents.items()
            if d.get("kind") == KIND_FILE and (d.get("hash") not in self.blobs or d.get("hash") not in on_disk)
        )
        return {
            "orphan_blobs": orphan_blobs,
            "zero_refcount": zero_refcount,
            "dangling_docs": dangling_docs,
        }

    def _list_blob_files(self) -> set[str]:
        # Only our own blobs (a 64-char sha256 hex name) count — a foreign file
        # dropped into the dir is none of our business and must never be
        # reported as an orphan (the cleanup would otherwise try to delete it).
        d = self._blobs_dir
        try:
            entries = list(d.iterdir())
        except FileNotFoundError:
            # Dir absent, or removed between the check and the scan (a
            # concurrent delete / shared test config dir) — nothing to list.
            return set()
        return {p.name for p in entries if p.is_file() and len(p.name) == 64 and all(c in "0123456789abcdef" for c in p.name)}

    # ------------------------------------------------------------------
    # Cleanup (backs the repair-issue fix flow)
    # ------------------------------------------------------------------

    async def async_cleanup_issues(self) -> dict[str, int]:
        """Reclaim the anomalies found by :meth:`async_find_issues`.

        Deletes orphaned blob files and stale (zero-refcount) blobs to reclaim
        disk/backup space, and prunes dangling document records whose blob is
        already gone (nothing left to serve). Files still referenced by a live
        document are never touched. Returns per-category counts + bytes freed.
        """
        issues = await self.async_find_issues()
        freed = 0
        for digest in issues["orphan_blobs"]:
            freed += await self.hass.async_add_executor_job(self._reclaim_blob_sync, digest)
        for digest in issues["zero_refcount"]:
            blob = self.blobs.pop(digest, None)
            freed += int(blob.get("size", 0)) if blob else 0
            await self.hass.async_add_executor_job(self._delete_blob_sync, digest)
        for did in issues["dangling_docs"]:
            doc = self.documents.pop(did, None)
            if doc is not None:
                # Reconcile the now over-counted blob refcount so no phantom
                # registry entry lingers; the file is already gone (0 real bytes).
                await self._deref_blob(doc)
        if any(issues.values()):
            await self._async_save()
        return {
            "orphans_deleted": len(issues["orphan_blobs"]),
            "zero_refcount_cleared": len(issues["zero_refcount"]),
            "dangling_removed": len(issues["dangling_docs"]),
            "bytes_freed": freed,
        }

    def _reclaim_blob_sync(self, digest: str) -> int:
        """Delete an orphan blob file, returning its size (0 if already gone)."""
        try:
            size = self.blob_path(digest).stat().st_size
        except OSError:
            size = 0
        self._delete_blob_sync(digest)
        return size
