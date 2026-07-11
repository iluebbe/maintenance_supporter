"""Selective export (JSON/YAML/CSV) + the documents ZIP archive with blobs.

The JSON/YAML/CSV exports gained an ``entry_ids`` filter so a single object can
be moved between installs, and a new documents archive carries the file BLOBS
the JSON backup deliberately omits — restoring them on a fresh instance.
"""

from __future__ import annotations

import io
import zipfile

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import DOMAIN, GLOBAL_UNIQUE_ID

from .conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    setup_integration,
)


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


def _object(hass: HomeAssistant, name: str, oid: str, uid: str) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title=name,
        data=build_object_entry_data(
            object_data=build_object_data(name=name, object_id=oid),
            tasks={TASK_ID_1: build_task_data(name=f"{name} task")},
        ),
        source="user",
        unique_id=uid,
    )
    entry.add_to_hass(hass)
    return entry


async def test_selective_json_export_restricts_to_entry_ids(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    from custom_components.maintenance_supporter.export import build_export_data

    a = _object(hass, "Alpha", "oid_a", "maintenance_supporter_a")
    b = _object(hass, "Beta", "oid_b", "maintenance_supporter_b")
    await setup_integration(hass, global_entry, a, b)

    full = build_export_data(hass)
    assert {o["object"]["name"] for o in full["objects"]} == {"Alpha", "Beta"}

    just_a = build_export_data(hass, entry_ids={a.entry_id})
    assert [o["object"]["name"] for o in just_a["objects"]] == ["Alpha"]


async def test_selective_csv_export_restricts_to_entry_ids(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    from custom_components.maintenance_supporter.helpers.csv_handler import (
        export_object_records_csv,
        export_objects_csv,
    )

    a = _object(hass, "Alpha", "oid_a", "maintenance_supporter_a")
    b = _object(hass, "Beta", "oid_b", "maintenance_supporter_b")
    await setup_integration(hass, global_entry, a, b)

    csv_a = export_objects_csv(hass, entry_ids={a.entry_id})
    assert "Alpha" in csv_a and "Beta" not in csv_a
    rec_b = export_object_records_csv(hass, entry_ids={b.entry_id})
    assert "Beta" in rec_b and "Alpha" not in rec_b


async def test_documents_archive_roundtrips_blobs_to_a_fresh_instance(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """Upload a file, build the archive, wipe the blob, restore from the
    archive → the blob is back on disk and the doc is no longer dangling."""
    from custom_components.maintenance_supporter import DOCUMENT_STORE_KEY
    from custom_components.maintenance_supporter.helpers.doc_archive import (
        build_documents_archive,
        import_documents_archive,
    )

    a = _object(hass, "Alpha", "oid_a", "maintenance_supporter_a")
    await setup_integration(hass, global_entry, a)
    store = hass.data[DOMAIN][DOCUMENT_STORE_KEY]

    content = b"%PDF-1.4 fake manual bytes"
    doc = await store.async_add_file("oid_a", content=content, filename="manual.pdf", mime="application/pdf")
    digest = doc["hash"]
    assert store.blob_path(digest).is_file()

    archive = await hass.async_add_executor_job(build_documents_archive, hass, None)
    # Manifest + one blob present.
    with zipfile.ZipFile(io.BytesIO(archive)) as zf:
        names = zf.namelist()
        assert "manifest.json" in names
        assert f"blobs/{digest}" in names

    # Simulate a fresh instance: the doc metadata is present (as after a JSON
    # import) but the blob binary is gone.
    store.blob_path(digest).unlink()
    assert not store.blob_path(digest).is_file()

    result = await import_documents_archive(hass, archive)
    assert result["blobs_written"] == 1
    assert store.blob_path(digest).is_file(), "blob not restored from the archive"
    # Re-import is idempotent (doc already there → no duplicate metadata).
    result2 = await import_documents_archive(hass, archive)
    assert result2["documents_created"] == 0


async def test_documents_archive_matches_object_by_name_cross_instance(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """A cross-instance restore: the target object has the same NAME but a
    fresh id (as a JSON import would create). The archive re-attaches its docs
    by name and writes the blob."""
    from custom_components.maintenance_supporter import DOCUMENT_STORE_KEY
    from custom_components.maintenance_supporter.helpers.doc_archive import (
        build_documents_archive,
        import_documents_archive,
    )

    src = _object(hass, "Boiler", "oid_src", "maintenance_supporter_src")
    await setup_integration(hass, global_entry, src)
    store = hass.data[DOMAIN][DOCUMENT_STORE_KEY]
    doc = await store.async_add_file("oid_src", content=b"invoice-2026", filename="inv.pdf", mime="application/pdf")
    digest = doc["hash"]
    archive = await hass.async_add_executor_job(build_documents_archive, hass, None)

    # Remove the source object's docs from the store to model a fresh target
    # object with the same name but a DIFFERENT id and no documents yet.
    store._data["documents"] = {}
    store.blob_path(digest).unlink()
    # Re-point: pretend the surviving object now has a fresh id.
    new_data = dict(src.data)
    obj = dict(new_data["object"])
    obj["id"] = "oid_fresh"
    new_data["object"] = obj
    hass.config_entries.async_update_entry(src, data=new_data)

    result = await import_documents_archive(hass, archive)
    assert result["objects_matched"] == 1, "object not matched by name"
    assert result["blobs_written"] == 1
    assert result["documents_created"] == 1
    assert store.blob_path(digest).is_file()
    restored = store.for_object("oid_fresh")
    assert any(d.get("hash") == digest for d in restored), "doc not re-attached to the renamed object"
