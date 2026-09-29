"""Documents archive (ZIP) — the one export that carries file *contents*.

The JSON/YAML backup deliberately keeps document metadata only; the binary
blobs ride the HA backup. That leaves a portable JSON export with dangling
file docs on a fresh instance. This module adds a dedicated, self-contained
documents archive, laid out so a person can browse it too (version 2):

    README.txt
    manifest.json                    {"version":2, "objects":[{object_id,
                                      object_name, documents:[<metadata>
                                      + "path">]}]}
    Family Car/Manuals/owners-manual.pdf
    Family Car/Links.txt             the object's web links
    Utility Meters/Meter reading/2026-09-12 hot-water.jpg
                                     completion photos: task + day done

One folder per object; completion photos sit in their task's folder named
by the day of the completion, every other file in a folder for its category.
Version 1 stored the files as ``blobs/<sha256>`` — no names, no extensions,
useless outside a restore (round-trip audit 2026-09-29); its archives still
import.

Import reads every file the manifest names (checked against its hash),
writes it back, then re-attaches metadata to the matching object (by id
first, then by name for a cross-instance restore), skipping documents that
already exist so a repeated import is idempotent. Weblinks travel too
(0 bytes) so the archive is a complete documents backup on its own.
"""

from __future__ import annotations

import io
import json
import logging
import mimetypes
import re
import zipfile
from pathlib import PurePosixPath
from typing import Any

from homeassistant.core import HomeAssistant

from ..const import DOMAIN, GLOBAL_UNIQUE_ID
from .completion_photos import history_photo_ids
from .documents import KIND_WEBLINK, async_rewrite_doc_refs, doc_wire_dict

_LOGGER = logging.getLogger(__name__)

MANIFEST_NAME = "manifest.json"
README_NAME = "README.txt"
LINKS_NAME = "Links.txt"
# Version 1's content-addressed layout — still read on import.
BLOB_DIR = "blobs/"
ARCHIVE_VERSION = 2
# Cap a single archive import so a crafted ZIP can't exhaust memory/disk. A
# real documents backup is dominated by the blobs, already capped at 25 MB
# each × 100 docs/object — this is a coarse whole-archive ceiling on top.
MAX_ARCHIVE_BYTES = 500 * 1024 * 1024  # 500 MB uncompressed-blob budget
MAX_MANIFEST_BYTES = 16 * 1024 * 1024  # the manifest is metadata only
MAX_ARCHIVE_MEMBERS = 20000  # ceiling on ZIP entry count (blobs cap at 100/obj)


def _read_member_bounded(zf: zipfile.ZipFile, name: str, limit: int) -> bytes:
    """Read a ZIP member but never materialise more than ``limit`` bytes.

    ``ZipFile.read`` inflates the WHOLE member before returning, so a crafted
    member (small compressed, huge inflated — a "zip bomb") would exhaust memory
    before any post-hoc size check. Reading through ``open()`` with a hard byte
    ceiling bounds the decompression regardless of the declared/actual size.
    """
    with zf.open(name) as fh:
        data = fh.read(limit + 1)
    if len(data) > limit:
        raise ValueError("archive_member_too_large")
    return data


def _get_store(hass: HomeAssistant) -> Any:
    from .. import DOCUMENT_STORE_KEY

    return hass.data.get(DOMAIN, {}).get(DOCUMENT_STORE_KEY)


def _object_name_map(hass: HomeAssistant) -> tuple[dict[str, str], dict[str, list[tuple[str, bool]]]]:
    """(object_id → entry_id-object_id) is identity; return the maps the import
    needs: existing object_ids (set) and name → [(object_id, archived)] for
    cross-instance matching — a list, since a replaced object and its
    successor share the name by default."""
    from ..const import CONF_OBJECT

    ids: dict[str, str] = {}
    by_name: dict[str, list[tuple[str, bool]]] = {}
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
            by_name.setdefault(name, []).append((oid, bool(obj.get("archived_at"))))
    return ids, by_name


def _match_object(
    obj: dict[str, Any],
    ids: dict[str, str],
    by_name: dict[str, list[tuple[str, bool]]],
    claimed: set[str],
) -> str | None:
    """The object an archive's manifest entry belongs to: the same id (a
    restore on the same instance), else a same-named object no other manifest
    entry took yet, the one with the same archive state first. Matching by
    the first name alone attached a successor's documents to the retired
    object it replaced (bug audit 2026-09-29)."""
    if (target := ids.get(str(obj.get("object_id") or ""))) is not None:
        return target
    free = [(oid, archived) for oid, archived in by_name.get(str(obj.get("object_name") or ""), []) if oid not in claimed]
    if isinstance(obj.get("archived"), bool):
        free = [c for c in free if c[1] == obj["archived"]] or free
    return free[0][0] if free else None


def _object_task_ids(hass: HomeAssistant, object_id: str) -> set[str]:
    """The current task ids of the object whose id is ``object_id`` (empty if
    none). Used to keep a same-instance archive restore's task links valid."""
    from ..const import CONF_OBJECT, CONF_TASKS

    for entry in hass.config_entries.async_entries(DOMAIN):
        if entry.unique_id == GLOBAL_UNIQUE_ID:
            continue
        if entry.data.get(CONF_OBJECT, {}).get("id") == object_id:
            return set(entry.data.get(CONF_TASKS, {}))
    return set()


def _object_part_ids(hass: HomeAssistant, object_id: str) -> set[str]:
    """The current spare-part ids of the object (same role as
    ``_object_task_ids``, for a doc's part links)."""
    from ..const import CONF_OBJECT, CONF_PARTS

    for entry in hass.config_entries.async_entries(DOMAIN):
        if entry.unique_id == GLOBAL_UNIQUE_ID:
            continue
        if entry.data.get(CONF_OBJECT, {}).get("id") == object_id:
            return set(entry.data.get(CONF_PARTS) or {})
    return set()


class ArchiveTooLarge(ValueError):
    """The selection's files exceed what an import accepts (MAX_ARCHIVE_BYTES)."""


# Document category (its first known tag) → folder inside the object's folder.
_CATEGORY_FOLDERS = {
    "manual": "Manuals",
    "warranty": "Warranty",
    "invoice": "Invoices",
    "spare_parts": "Spare parts",
    "photo": "Photos",
    "other": "Other",
}
_UNSAFE_CHARS = re.compile(r'[\\/:*?"<>|\x00-\x1f]+')
_WINDOWS_RESERVED = re.compile(r"^(con|prn|aux|nul|com\d|lpt\d)$", re.IGNORECASE)
_README = """Maintenance Supporter - documents archive

One folder per maintenance object. Completion photos sit in the folder of
their task, named by the day the task was done; every other file sits in a
folder for its category (Manuals, Invoices, Photos, ...). Links.txt lists an
object's web links. A file several objects share (a replaced appliance and
its successor) is stored once, in the folder of the first.

To restore: Maintenance panel > Settings > Import / Export > Restore
documents ZIP. manifest.json describes every file for the restore - keep
it next to the folders.
"""


def _safe_part(name: Any, fallback: str) -> str:
    """One path segment that every OS unpacks: no separators or reserved
    characters, no trailing dots, bounded length."""
    text = _UNSAFE_CHARS.sub(" ", str(name or ""))
    text = re.sub(r"\s+", " ", text).strip().strip(".").strip()[:80].strip()
    if not text:
        return fallback
    return f"{text}_" if _WINDOWS_RESERVED.match(PurePosixPath(text).stem) else text


def _file_name(doc: dict[str, Any]) -> str:
    """A document's file name with an extension (from its MIME type when the
    stored name has none)."""
    raw = str(doc.get("filename") or doc.get("title") or "document").replace(chr(92), "/")
    name = PurePosixPath(raw).name or "document"
    suffix = re.sub(r"[^A-Za-z0-9]", "", PurePosixPath(name).suffix)
    if suffix and len(suffix) <= 10:
        stem = PurePosixPath(name).stem
    else:
        stem = name
        suffix = (mimetypes.guess_extension(str(doc.get("mime") or "")) or "").lstrip(".")
    return _safe_part(stem, "document") + (f".{suffix.lower()}" if suffix else "")


class _Paths:
    """Hands out unique archive paths (case-insensitive, like the file
    systems the archive is unpacked on)."""

    def __init__(self) -> None:
        # The archive's own root entries are not available as folder names.
        self._taken: set[str] = {f"/{MANIFEST_NAME}".casefold(), f"/{README_NAME}".casefold(), "/blobs"}

    def claim(self, folder: str, name: str) -> str:
        stem, suffix = PurePosixPath(name).stem, PurePosixPath(name).suffix
        candidate, n = f"{folder}/{name}", 2
        while candidate.casefold() in self._taken:
            candidate, n = f"{folder}/{stem} ({n}){suffix}", n + 1
        self._taken.add(candidate.casefold())
        return candidate


def _completion_photo_refs(entry: Any) -> dict[str, tuple[str, str]]:
    """{document id: (task name, day done)} — the first completion each photo
    belongs to."""
    from .aggregate import merged_tasks

    refs: dict[str, tuple[str, str]] = {}
    for task in merged_tasks(entry).values():
        for item in task.get("history") or []:
            if not isinstance(item, dict):
                continue
            day = str(item.get("timestamp") or "")[:10]
            for doc_id in history_photo_ids(item):
                refs.setdefault(doc_id, (str(task.get("name") or ""), day))
    return refs


def _gather_archive(hass: HomeAssistant, entry_ids: set[str] | None) -> tuple[Any, dict[str, Any], list[str]]:
    """The manifest and the blob digests of the selected objects (None = all).

    Metadata only — reads config entries and the document store.
    """
    from ..const import CONF_OBJECT
    from ..export import object_entries

    store = _get_store(hass)
    entries = object_entries(hass, entry_ids)

    manifest_objects: list[dict[str, Any]] = []
    blob_hashes: set[str] = set()
    paths = _Paths()
    # One file per content: a replaced object shares its predecessor's
    # documents, and writing each at every path doubled the archive towards
    # the import ceiling (bug audit 2026-09-29). Later documents point at the
    # first copy's path.
    first_path: dict[str, str] = {}
    for entry in entries:
        obj = entry.data.get(CONF_OBJECT, {})
        object_id = obj.get("id", "")
        if not object_id or store is None:
            continue
        stored = store.for_object(object_id)
        if not stored:
            continue
        # A readable place for every file (version 2): the object's folder
        # (made unique, two objects may share a name), then the task + day
        # for a completion photo, else the category.
        folder = PurePosixPath(paths.claim("", _safe_part(obj.get("name"), "Object"))).name
        photo_refs = _completion_photo_refs(entry)
        docs = []
        for d in stored:
            # The same record the JSON export writes (id included, so a
            # restore can re-point completion photos / part doc links).
            record = doc_wire_dict(d, include_id=True)
            h = d.get("hash")
            if d.get("kind") != KIND_WEBLINK and isinstance(h, str):
                blob_hashes.add(h)
                if h in first_path:
                    record["path"] = first_path[h]
                elif (ref := photo_refs.get(str(d.get("id")))) is not None:
                    task_name, day = ref
                    name = _file_name(d)
                    record["path"] = paths.claim(
                        f"{folder}/{_safe_part(task_name, 'Task')}", f"{day} {name}" if day else name
                    )
                else:
                    tags = [t for t in d.get("tags") or [] if t in _CATEGORY_FOLDERS]
                    category = _CATEGORY_FOLDERS[tags[0]] if tags else "Documents"
                    record["path"] = paths.claim(f"{folder}/{category}", _file_name(d))
                first_path.setdefault(h, record["path"])
            docs.append(record)
        links = [r for r in docs if r.get("kind") == KIND_WEBLINK]
        if links:
            paths.claim(folder, LINKS_NAME)
        manifest_objects.append(
            {
                "object_id": object_id,
                "object_name": obj.get("name", ""),
                # Tells a retired object from its same-named successor on a
                # restore into another instance (new object ids there).
                "archived": bool(obj.get("archived_at")),
                "folder": folder,
                "documents": docs,
            }
        )

    return store, {"version": ARCHIVE_VERSION, "objects": manifest_objects}, sorted(blob_hashes)


def _write_archive(store: Any, manifest: dict[str, Any], blob_hashes: list[str], target: Any) -> None:
    """Write the ZIP to ``target`` (a path or binary file object) — blocking.

    Each file is streamed from disk into the archive (``ZipFile.write``) at
    its readable path, so memory stays flat however large the documents
    are. A file several documents share is written once, at the path the
    manifest gives all of them. Refuses up front a selection whose files exceed
    MAX_ARCHIVE_BYTES: the import refuses such an archive anyway, and the
    export used to assemble the whole ZIP in memory with no ceiling (bug
    audit 2026-09-26). ``blob_hashes`` is the set the manifest references.
    """
    wanted = set(blob_hashes)
    files: list[tuple[str, Any]] = []
    written: set[str] = set()
    total = 0
    for obj in manifest.get("objects") or []:
        for doc in obj.get("documents") or []:
            h, arcname = doc.get("hash"), doc.get("path")
            if store is None or h not in wanted or not isinstance(arcname, str) or arcname in written:
                continue
            try:
                path = store.blob_path(h)
            except ValueError:
                continue
            if not path.is_file():
                _LOGGER.warning("Documents archive: blob %s missing on disk, skipped", h[:12])
                doc.pop("path", None)
                continue
            total += path.stat().st_size
            if total > MAX_ARCHIVE_BYTES:
                raise ArchiveTooLarge(
                    f"The selected documents exceed {MAX_ARCHIVE_BYTES // (1024 * 1024)} MB, "
                    "more than an archive import accepts — export fewer objects at a time."
                )
            files.append((arcname, path))
            written.add(arcname)
    with zipfile.ZipFile(target, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.writestr(README_NAME, _README)
        zf.writestr(MANIFEST_NAME, json.dumps(manifest, ensure_ascii=False, indent=2))
        for obj in manifest.get("objects") or []:
            links = [d for d in obj.get("documents") or [] if d.get("kind") == KIND_WEBLINK]
            if links and obj.get("folder"):
                text = "".join(f"{d.get('title') or d.get('url')}\n{d.get('url')}\n\n" for d in links)
                zf.writestr(f"{obj['folder']}/{LINKS_NAME}", text)
        for arcname, path in files:
            zf.write(path, arcname=arcname)


def build_documents_archive(hass: HomeAssistant, entry_ids: set[str] | None = None) -> bytes:
    """Build a documents ZIP in memory for the selected objects (None = all).

    Blocking — call via the executor. The HTTP export streams through
    :func:`async_build_documents_archive_file` instead; this in-memory form
    stays for tooling and tests.
    """
    store, manifest, blob_hashes = _gather_archive(hass, entry_ids)
    buf = io.BytesIO()
    _write_archive(store, manifest, blob_hashes, buf)
    return buf.getvalue()


async def async_build_documents_archive_file(hass: HomeAssistant, entry_ids: set[str] | None = None) -> str:
    """Write the documents ZIP to a temporary file and return its path.

    The caller streams it out and deletes it. Raises :class:`ArchiveTooLarge`
    (nothing left behind) when the selection exceeds the import ceiling.
    """
    import os
    import tempfile

    store, manifest, blob_hashes = _gather_archive(hass, entry_ids)

    def _write() -> str:
        fd, path = tempfile.mkstemp(prefix="maintenance-documents-", suffix=".zip")
        os.close(fd)
        try:
            _write_archive(store, manifest, blob_hashes, path)
        except BaseException:
            os.unlink(path)
            raise
        return path

    return await hass.async_add_executor_job(_write)


def _blob_on_disk(store: Any, digest: str) -> bool:
    """Whether the store holds this content (blocking — a file check)."""
    try:
        return bool(store.blob_path(digest).is_file())
    except ValueError:
        return False


def _doc_key(doc: dict[str, Any]) -> tuple[str | None, str | None]:
    """A document's identity for the idempotent re-import: kind + content
    hash (file) or URL (link). Only strings count — a list-valued URL in a
    crafted manifest was unhashable and crashed the set lookup."""
    kind = doc.get("kind")
    ref = doc.get("hash") or doc.get("url")
    return (kind if isinstance(kind, str) else None, ref if isinstance(ref, str) else None)


async def import_documents_archive(hass: HomeAssistant, data: bytes) -> dict[str, Any]:
    """Restore a documents ZIP: write blobs back, re-attach metadata.

    Objects are matched by id first (same instance), then by name (a
    cross-instance restore after a JSON import created fresh ids). Documents
    already present on the target object are skipped so a repeat import is
    idempotent. Returns counts.
    """
    import hashlib

    store = _get_store(hass)
    if store is None:
        return {"error": "documents store unavailable"}

    def _read() -> tuple[Any, dict[str, bytes]]:
        """(manifest — None when the archive has none, verified blobs by
        content hash). Everything here runs in the executor, the hashing
        included: it covers up to 500 MB (it ran on the event loop)."""
        import unicodedata

        def nfc(text: str) -> str:
            return unicodedata.normalize("NFC", text)

        blobs: dict[str, bytes] = {}
        manifest: Any = None
        total = 0
        with zipfile.ZipFile(io.BytesIO(data)) as zf:
            names = zf.namelist()
            if len(names) > MAX_ARCHIVE_MEMBERS:
                raise ValueError("archive_too_many_members")
            # An archive browsed and zipped again: macOS stores names
            # decomposed ("u" + combining diaeresis), and zipping the unpacked
            # folder wraps everything in one more folder. Match NFC names
            # below that folder (bug audit 2026-09-29: such an archive
            # imported nothing, silently).
            prefix = ""
            if not any(nfc(n) == MANIFEST_NAME for n in names):
                nested = {nfc(n)[: -len(MANIFEST_NAME)] for n in names if nfc(n).endswith("/" + MANIFEST_NAME) and nfc(n).count("/") == 1}
                if len(nested) == 1:
                    prefix = nested.pop()
            members = {nfc(n)[len(prefix) :]: n for n in names if nfc(n).startswith(prefix)}
            if MANIFEST_NAME in members:
                # Bound the metadata member too (was read uncapped).
                manifest = json.loads(_read_member_bounded(zf, members[MANIFEST_NAME], MAX_MANIFEST_BYTES).decode("utf-8"))
            # Version 2: the files sit at the readable paths the manifest
            # names; keyed by their content hash, which the documents' hash
            # then has to match like a version-1 blob name.
            listed: set[str] = set()
            raw_objects = manifest.get("objects") if isinstance(manifest, dict) else None
            for obj in raw_objects if isinstance(raw_objects, list) else []:
                docs_in = obj.get("documents") if isinstance(obj, dict) else None
                for doc in docs_in if isinstance(docs_in, list) else []:
                    if isinstance(doc, dict) and isinstance(doc.get("path"), str):
                        listed.add(nfc(doc["path"]))
            for name, member in members.items():
                digest = None
                if name in listed:
                    pass
                elif name.startswith(BLOB_DIR) and not name.endswith("/"):
                    digest = name[len(BLOB_DIR) :]
                    if not (len(digest) == 64 and all(c in "0123456789abcdef" for c in digest)):
                        continue
                else:
                    continue
                remaining = MAX_ARCHIVE_BYTES - total
                if remaining <= 0:
                    raise ValueError("archive_too_large")
                # Read bounded by the remaining budget so a bomb can't
                # inflate past the whole-archive ceiling (checked DURING the
                # read, not after materialising the full member).
                content = _read_member_bounded(zf, member, remaining)
                total += len(content)
                actual = hashlib.sha256(content).hexdigest()
                if digest is not None and actual != digest:
                    _LOGGER.warning("Documents archive: blob %s failed hash check, skipped", digest[:12])
                    continue
                blobs.setdefault(actual, content)
        return manifest, blobs

    try:
        manifest, blobs = await hass.async_add_executor_job(_read)
    except (zipfile.BadZipFile, ValueError, json.JSONDecodeError, KeyError) as err:
        return {"error": f"invalid archive: {err}"}
    if manifest is None:
        # Zipped without it (only the folders): nothing says which document a
        # file belongs to — said, instead of "0 restored".
        return {
            "error": f"invalid archive: no {MANIFEST_NAME} — keep it next to the folders when zipping again",
            "code": "docs_archive_no_manifest",
        }

    # The manifest is untrusted JSON: a list at the top, an "objects" that is
    # no list or a "documents" that is a number raised AttributeError /
    # TypeError past the handler above — a bare 500 instead of the clean
    # error (bug audit 2026-09-27). Wrong shapes are refused or skipped.
    if not isinstance(manifest, dict):
        return {"error": "invalid archive: the manifest is not an object"}
    raw_objects = manifest.get("objects")
    manifest_objects: list[tuple[dict[str, Any], list[Any]]] = [
        (obj, docs)
        for obj in (raw_objects if isinstance(raw_objects, list) else [])
        if isinstance(obj, dict) and isinstance(docs := obj.get("documents", []), list)
    ]

    # 1) Write back only blobs a manifest document actually references — an
    # archive carrying extra blobs must not litter /config with orphans that
    # ride every HA backup and are never refcounted (disk-fill hardening).
    referenced: set[str] = set()
    for _obj, docs in manifest_objects:
        for m in docs:
            if isinstance(m, dict) and isinstance(m.get("hash"), str):
                referenced.add(m["hash"])

    written = 0
    docs_created = 0
    objects_matched = 0
    # old → new document ids across every restored object, so history photos
    # and part doc links that pointed at the archived ids follow (the JSON
    # importer does the same for its own restore).
    doc_id_map: dict[str, str] = {}
    # Under the store's blob lock from the first blob write to the last
    # refcount bump: a document delete running meanwhile could remove a blob
    # file the restore had just written (or found) before the restored
    # document registered it — a document pointing at nothing (bug audit
    # 2026-09-27; the upload and delete paths took the lock, this one not).
    async with store.blob_lock:
        for digest, content in blobs.items():
            if digest not in referenced:
                _LOGGER.info("Documents archive: blob %s referenced by no document, skipped", digest[:12])
                continue
            _, wrote_new = await hass.async_add_executor_job(store._store_blob_sync, content)
            if wrote_new:
                written += 1
            store.notify_blob_added(digest)

        # A file document whose file neither came with the archive nor is on
        # disk would point at nothing — an archive zipped again without some
        # of its files created such documents without a word.
        file_hashes = {
            m["hash"]
            for _obj, docs in manifest_objects
            for m in docs
            if isinstance(m, dict) and m.get("kind") != KIND_WEBLINK and isinstance(m.get("hash"), str)
        }
        on_disk = await hass.async_add_executor_job(lambda: {h for h in file_hashes if _blob_on_disk(store, h)})
        files_missing = 0

        # 2) Re-attach metadata to the matching object (id, then name).
        ids, by_name = _object_name_map(hass)
        claimed: set[str] = set()
        for obj, docs in manifest_objects:
            target = _match_object(obj, ids, by_name, claimed)
            if target is None:
                _LOGGER.info("Documents archive: no object matches %r, its docs skipped", obj.get("object_name"))
                continue
            claimed.add(target)
            objects_matched += 1
            # Skip docs already present on the target (idempotent re-import).
            existing = store.for_object(target)
            existing_keys = {_doc_key(d) for d in existing}
            fresh = [m for m in docs if isinstance(m, dict) and _doc_key(m) not in existing_keys]
            restorable = [m for m in fresh if m.get("kind") == KIND_WEBLINK or m.get("hash") in on_disk]
            files_missing += len(fresh) - len(restorable)
            fresh = restorable
            if fresh:
                # Keep task links that still resolve on the target (a same-instance
                # restore) via an identity map over the object's current task ids;
                # a cross-instance restore has fresh task ids, so those links drop
                # here and are re-established by the JSON import's remap instead.
                valid_task_ids = _object_task_ids(hass, target)
                identity = {tid: tid for tid in valid_task_ids}
                part_identity = {pid: pid for pid in _object_part_ids(hass, target)}
                docs_created += await store.async_import_documents(
                    target, fresh, task_id_map=identity, part_id_map=part_identity, id_map=doc_id_map
                )
    if doc_id_map:
        await async_rewrite_doc_refs(hass, lambda old: doc_id_map.get(old, old))

    result: dict[str, Any] = {
        "blobs_written": written,
        "documents_created": docs_created,
        "objects_matched": objects_matched,
    }
    if files_missing:
        result["files_missing"] = files_missing
    return result
