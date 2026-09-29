"""The documents ZIP survives what people do with it, and a move maps people
the way a household expects (bug audit 2026-09-29, the smaller findings).

- A file several documents share is stored once (a replaced appliance shares
  its predecessor's paperwork — the archive had doubled towards its ceiling).
- An archive unpacked, browsed and zipped again still restores: macOS writes
  decomposed names, and zipping the folder wraps everything in one more.
- Zipped without its manifest.json it says so instead of restoring nothing.
- A document whose file the archive does not carry is not created pointing at
  nothing; the result counts it.
- Two people who shared a name at the source are reported, not folded into
  one; a system user maps to the system user of the same name.
"""

from __future__ import annotations

import hashlib
import io
import json
import unicodedata
import zipfile

from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter import DOCUMENT_STORE_KEY
from custom_components.maintenance_supporter.const import DOMAIN
from custom_components.maintenance_supporter.helpers import doc_archive
from custom_components.maintenance_supporter.helpers.import_mapping import async_user_map

from .test_migration_roundtrip import _export_all, _seed, global_entry  # global_entry: the fixture


def _members(archive: bytes) -> dict[str, bytes]:
    with zipfile.ZipFile(io.BytesIO(archive)) as zf:
        return {name: zf.read(name) for name in zf.namelist()}


def _zip(members: dict[str, bytes]) -> bytes:
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w") as zf:
        for name, content in members.items():
            zf.writestr(name, content)
    return buf.getvalue()


async def test_a_shared_file_is_stored_once(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    await _seed(hass, global_entry)
    docs = hass.data[DOMAIN][DOCUMENT_STORE_KEY]
    # The successor keeps its predecessor's manual: the same content twice.
    await docs.async_add_file("new_obj", content=b"%PDF-1.4 manual", filename="manual.pdf", mime="application/pdf", tags=["manual"])
    _objects, _settings, archive = await _export_all(hass)
    members = _members(archive)
    manual = hashlib.sha256(b"%PDF-1.4 manual").hexdigest()
    copies = [name for name, content in members.items() if hashlib.sha256(content).hexdigest() == manual]
    assert len(copies) == 1, copies
    manifest = json.loads(members[doc_archive.MANIFEST_NAME])
    paths = {d["path"] for o in manifest["objects"] for d in o["documents"] if d.get("hash") == manual}
    assert paths == set(copies), "every document sharing the file points at the one copy"


async def test_an_archive_zipped_again_still_restores(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    await _seed(hass, global_entry)
    _objects, _settings, archive = await _export_all(hass)
    manifest = json.loads(_members(archive)[doc_archive.MANIFEST_NAME])
    hashes = {d["hash"] for o in manifest["objects"] for d in o["documents"] if d.get("path")}
    # Unpacked on a Mac and zipped again as a folder: decomposed names
    # ("Küche" as "Ku" + combining diaeresis) under one more folder.
    again = _zip({f"Documents backup/{unicodedata.normalize('NFD', name)}": content for name, content in _members(archive).items()})
    assert any("̈" in name for name in _members(again)), "the test must carry a decomposed name"
    docs = hass.data[DOMAIN][DOCUMENT_STORE_KEY]
    for digest in hashes:
        docs.blob_path(digest).unlink()

    result = await doc_archive.import_documents_archive(hass, again)
    assert "error" not in result, result
    assert result["blobs_written"] == len(hashes), result
    assert all(docs.blob_path(digest).is_file() for digest in hashes)


async def test_an_archive_without_its_manifest_says_so(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    await _seed(hass, global_entry)
    _objects, _settings, archive = await _export_all(hass)
    folders_only = _zip({n: c for n, c in _members(archive).items() if n != doc_archive.MANIFEST_NAME})
    result = await doc_archive.import_documents_archive(hass, folders_only)
    assert result.get("code") == "docs_archive_no_manifest", result


async def test_a_document_whose_file_is_missing_is_not_created(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    await _seed(hass, global_entry)
    _objects, _settings, archive = await _export_all(hass)
    docs = hass.data[DOMAIN][DOCUMENT_STORE_KEY]
    warranty_id, warranty = next((i, d) for i, d in docs.documents.items() if d.get("title") == "Garantie.pdf")
    await docs.async_remove(warranty_id)
    assert not docs.blob_path(warranty["hash"]).is_file()
    members = _members(archive)
    manifest = json.loads(members[doc_archive.MANIFEST_NAME])
    path = next(d["path"] for o in manifest["objects"] for d in o["documents"] if d.get("hash") == warranty["hash"])
    without = _zip({n: c for n, c in members.items() if n != path})

    result = await doc_archive.import_documents_archive(hass, without)
    assert result.get("files_missing") == 1, result
    assert not [d for d in docs.documents.values() if d.get("hash") == warranty["hash"]], "no document pointing at nothing"


async def test_people_who_shared_a_name_are_reported_and_system_users_map(hass: HomeAssistant) -> None:
    await hass.auth.async_create_user("Anna")
    supervisor = await hass.auth.async_create_system_user("Supervisor")
    mapping, unmatched = await async_user_map(
        hass, {"old-anna-1": "Anna", "old-anna-2": "Anna", "old-supervisor": "Supervisor", "old-bob": "Bob"}
    )
    assert mapping == {"old-supervisor": supervisor.id}
    assert unmatched == ["Anna", "Bob"]
