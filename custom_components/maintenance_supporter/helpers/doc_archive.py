"""Documents archive (ZIP) — the one export that carries file *contents*.

The JSON/YAML backup deliberately keeps document metadata only; the binary
blobs ride the HA backup. That leaves a portable JSON export with dangling
file docs on a fresh instance. This module adds a dedicated, self-contained
documents archive:

    manifest.json   {"version":1, "objects":[{object_id, object_name,
                     documents:[<metadata>]}]}
    blobs/<sha256>  the raw file contents (content-addressed, dedup'd)

Export gathers the selected objects' documents + their unique blobs. Import
writes every blob back, then re-attaches metadata to the matching object
(by id first, then by name for a cross-instance restore), skipping documents
that already exist so a repeated import is idempotent. Weblinks travel too
(0 bytes) so the archive is a complete documents backup on its own.
"""

from __future__ import annotations

import io
import json
import logging
import zipfile
from typing import Any

from homeassistant.core import HomeAssistant

from ..const import DOMAIN, GLOBAL_UNIQUE_ID
from .documents import KIND_FILE, KIND_WEBLINK

_LOGGER = logging.getLogger(__name__)

MANIFEST_NAME = "manifest.json"
BLOB_DIR = "blobs/"
ARCHIVE_VERSION = 1
# Cap a single archive import so a crafted ZIP can't exhaust memory/disk. A
# real documents backup is dominated by the blobs, already capped at 25 MB
# each × 100 docs/object — this is a coarse whole-archive ceiling on top.
MAX_ARCHIVE_BYTES = 500 * 1024 * 1024  # 500 MB uncompressed-blob budget


def _get_store(hass: HomeAssistant) -> Any:
    from .. import DOCUMENT_STORE_KEY

    return hass.data.get(DOMAIN, {}).get(DOCUMENT_STORE_KEY)


def _object_name_map(hass: HomeAssistant) -> tuple[dict[str, str], dict[str, str]]:
    """(object_id → entry_id-object_id) is identity; return the maps the import
    needs: existing object_ids (set) and name → object_id for cross-instance
    matching."""
    from ..const import CONF_OBJECT

    ids: dict[str, str] = {}
    by_name: dict[str, str] = {}
    for entry in hass.config_entries.async_entries(DOMAIN):
        if entry.unique_id == GLOBAL_UNIQUE_ID:
            continue
        obj = entry.data.get(CONF_OBJECT, {})
        oid = obj.get("id")
        if not oid:
            continue
        ids[oid] = oid
        name = obj.get("name")
        if name:
            by_name.setdefault(name, oid)
    return ids, by_name


def build_documents_archive(hass: HomeAssistant, entry_ids: set[str] | None = None) -> bytes:
    """Build a documents ZIP for the selected objects (None = all).

    Runs on the event loop for the metadata gather (reads config entries) but
    the heavy blob reads happen here synchronously — call via the executor.
    """
    from ..const import CONF_OBJECT
    from ..export import object_entries

    store = _get_store(hass)
    entries = object_entries(hass, entry_ids)

    manifest_objects: list[dict[str, Any]] = []
    blob_hashes: set[str] = set()
    for entry in entries:
        obj = entry.data.get(CONF_OBJECT, {})
        object_id = obj.get("id", "")
        if not object_id or store is None:
            continue
        docs = []
        for d in store.for_object(object_id):
            if d.get("kind") == KIND_WEBLINK:
                docs.append(
                    {"kind": KIND_WEBLINK, "url": d.get("url"), "title": d.get("title"), "tags": d.get("tags") or []}
                )
            else:
                h = d.get("hash")
                docs.append(
                    {
                        "kind": KIND_FILE,
                        "hash": h,
                        "title": d.get("title"),
                        "filename": d.get("filename"),
                        "mime": d.get("mime"),
                        "size": d.get("size"),
                        "tags": d.get("tags") or [],
                    }
                )
                if isinstance(h, str):
                    blob_hashes.add(h)
        if docs:
            manifest_objects.append({"object_id": object_id, "object_name": obj.get("name", ""), "documents": docs})

    manifest = {"version": ARCHIVE_VERSION, "objects": manifest_objects}

    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.writestr(MANIFEST_NAME, json.dumps(manifest, ensure_ascii=False, indent=2))
        for h in sorted(blob_hashes):
            if store is None:
                break
            try:
                path = store.blob_path(h)
            except ValueError:
                continue
            if path.is_file():
                zf.writestr(f"{BLOB_DIR}{h}", path.read_bytes())
            else:
                _LOGGER.warning("Documents archive: blob %s missing on disk, skipped", h[:12])
    return buf.getvalue()


async def import_documents_archive(hass: HomeAssistant, data: bytes) -> dict[str, Any]:
    """Restore a documents ZIP: write blobs back, re-attach metadata.

    Objects are matched by id first (same instance), then by name (a
    cross-instance restore after a JSON import created fresh ids). Documents
    already present on the target object are skipped so a repeat import is
    idempotent. Returns counts.
    """
    store = _get_store(hass)
    if store is None:
        return {"error": "documents store unavailable"}

    def _read() -> tuple[dict[str, Any], dict[str, bytes]]:
        blobs: dict[str, bytes] = {}
        manifest: dict[str, Any] = {}
        total = 0
        with zipfile.ZipFile(io.BytesIO(data)) as zf:
            for name in zf.namelist():
                if name == MANIFEST_NAME:
                    manifest = json.loads(zf.read(name).decode("utf-8"))
                elif name.startswith(BLOB_DIR) and not name.endswith("/"):
                    digest = name[len(BLOB_DIR) :]
                    if len(digest) == 64 and all(c in "0123456789abcdef" for c in digest):
                        content = zf.read(name)
                        total += len(content)
                        if total > MAX_ARCHIVE_BYTES:
                            raise ValueError("archive_too_large")
                        blobs[digest] = content
        return manifest, blobs

    try:
        manifest, blobs = await hass.async_add_executor_job(_read)
    except (zipfile.BadZipFile, ValueError, json.JSONDecodeError, KeyError) as err:
        return {"error": f"invalid archive: {err}"}

    # 1) Write every blob back (verify the hash — a blob's name IS its sha256).
    import hashlib

    written = 0
    for digest, content in blobs.items():
        if hashlib.sha256(content).hexdigest() != digest:
            _LOGGER.warning("Documents archive: blob %s failed hash check, skipped", digest[:12])
            continue
        _, wrote_new = await hass.async_add_executor_job(store._store_blob_sync, content)
        if wrote_new:
            written += 1

    # 2) Re-attach metadata to the matching object (id, then name).
    ids, by_name = _object_name_map(hass)
    docs_created = 0
    objects_matched = 0
    for obj in manifest.get("objects", []):
        if not isinstance(obj, dict):
            continue
        target = ids.get(str(obj.get("object_id") or "")) or by_name.get(str(obj.get("object_name") or ""))
        if target is None:
            _LOGGER.info("Documents archive: no object matches %r, its docs skipped", obj.get("object_name"))
            continue
        objects_matched += 1
        # Skip docs already present on the target (idempotent re-import).
        existing = store.for_object(target)
        existing_keys = {(d.get("kind"), d.get("hash") or d.get("url")) for d in existing}
        fresh = [
            m
            for m in obj.get("documents", [])
            if isinstance(m, dict) and (m.get("kind"), m.get("hash") or m.get("url")) not in existing_keys
        ]
        if fresh:
            docs_created += await store.async_import_documents(target, fresh)

    return {
        "blobs_written": written,
        "documents_created": docs_created,
        "objects_matched": objects_matched,
    }
