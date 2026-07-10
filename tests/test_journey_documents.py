"""Journey: the shared manual (document blob refcount, D4/E4 blind spot).

The content-addressed blob store deduplicates identical files across objects
into a single blob with a refcount. The lifecycle invariant that per-module
tests don't walk: when the SAME file is attached to two appliances and one is
retired, the blob must SURVIVE (the other still needs it) — and only vanish
when the last referrer is gone. A refcount that decrements too eagerly is
silent data loss for the surviving object; one that never reaches zero leaks
disk. Both failure modes only show up across the delete + restart sequence.

See docs/design/user-journeys.md (D4 photo/blob refcount, E4 object delete).
"""

from __future__ import annotations

from pathlib import Path
from unittest.mock import MagicMock

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter import DOCUMENT_STORE_KEY
from custom_components.maintenance_supporter.const import DOMAIN, GLOBAL_UNIQUE_ID
from custom_components.maintenance_supporter.helpers.documents import DocumentStore
from custom_components.maintenance_supporter.websocket import object_id_for_entry
from custom_components.maintenance_supporter.websocket.objects import ws_delete_object

from .conftest import (
    make_ws_connection as _conn,
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    setup_integration,
)
from .journey import assert_entry_fully_gone, simulate_restart

_MANUAL = b"%PDF-1.4 shared heat-pump manual, identical bytes"


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




def _object(hass: HomeAssistant, unique: str, name: str) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title=name,
        data=build_object_entry_data(
            object_data=build_object_data(name=name, object_id=f"objid_{unique}"),
            tasks={TASK_ID_1: build_task_data(task_id=TASK_ID_1, interval_days=30)},
        ),
        source="user",
        unique_id=f"maintenance_supporter_{unique}",
    )
    entry.add_to_hass(hass)
    return entry


async def _delete_object(hass: HomeAssistant, entry_id: str) -> None:
    await call_ws_handler(
        ws_delete_object,
        hass,
        _conn(),
        {"id": 1, "type": "maintenance_supporter/object/delete", "entry_id": entry_id},
    )
    await hass.async_block_till_done()


async def test_shared_manual_survives_until_the_last_appliance_is_retired(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    a = _object(hass, "hp_a", "Heat Pump A")
    b = _object(hass, "hp_b", "Heat Pump B")
    await setup_integration(hass, global_entry, a, b)

    store: DocumentStore = hass.data[DOMAIN][DOCUMENT_STORE_KEY]
    oid_a = object_id_for_entry(a)
    oid_b = object_id_for_entry(b)

    # Attach the identical manual to both appliances → dedup to one blob.
    doc_a = await store.async_add_file(oid_a, content=_MANUAL, filename="manual.pdf", mime="application/pdf")
    doc_b = await store.async_add_file(oid_b, content=_MANUAL, filename="manual.pdf", mime="application/pdf")
    digest = doc_a["hash"]
    assert doc_b["hash"] == digest, "identical bytes must share one content-addressed blob"
    blob_path = Path(store.blob_path(digest))

    def refcount() -> int:
        return int(store.blobs[digest]["refcount"])

    assert blob_path.exists()
    assert refcount() == 2, "two referrers → refcount 2"
    assert len(store.for_object(oid_a)) == 1
    assert len(store.for_object(oid_b)) == 1

    # The refcount is on disk, not just in memory: a freshly loaded store agrees.
    reloaded = DocumentStore(hass)
    await reloaded.async_load()
    assert int(reloaded.blobs[digest]["refcount"]) == 2, "refcount not persisted to disk"

    # Restart the object entries — docs and the shared blob stay intact.
    await simulate_restart(hass, a, b)
    store = hass.data[DOMAIN][DOCUMENT_STORE_KEY]
    assert blob_path.exists()
    assert refcount() == 2
    assert len(store.for_object(oid_a)) == 1
    assert len(store.for_object(oid_b)) == 1

    # Retire appliance A. The shared blob MUST survive — B still needs it.
    await _delete_object(hass, a.entry_id)
    assert_entry_fully_gone(hass, a.entry_id)
    assert store.for_object(oid_a) == [], "A's document metadata should be gone"
    assert blob_path.exists(), "shared blob wrongly freed while B still references it"
    assert refcount() == 1, "refcount should drop to exactly 1"
    assert len(store.for_object(oid_b)) == 1, "B's document must be untouched"

    # Survives another restart at refcount 1.
    await simulate_restart(hass, b)
    store = hass.data[DOMAIN][DOCUMENT_STORE_KEY]
    assert blob_path.exists()
    assert int(store.blobs[digest]["refcount"]) == 1
    assert len(store.for_object(oid_b)) == 1

    # Retire the last appliance → the blob is finally reclaimed.
    await _delete_object(hass, b.entry_id)
    assert_entry_fully_gone(hass, b.entry_id)
    assert store.for_object(oid_b) == []
    assert not blob_path.exists(), "blob leaked after the last referrer was deleted"
    assert digest not in store.blobs, "zero-refcount blob left in the registry"


async def test_removing_one_of_two_docs_on_the_same_object_keeps_the_blob(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """Same-object dedup: attaching identical bytes twice to ONE object keeps
    two doc rows over one blob (refcount 2); removing one leaves the blob."""
    obj = _object(hass, "single", "Boiler")
    await setup_integration(hass, global_entry, obj)
    store: DocumentStore = hass.data[DOMAIN][DOCUMENT_STORE_KEY]
    oid = object_id_for_entry(obj)

    d1 = await store.async_add_file(oid, content=_MANUAL, filename="a.pdf", mime="application/pdf")
    d2 = await store.async_add_file(oid, content=_MANUAL, filename="b.pdf", mime="application/pdf")
    digest = d1["hash"]
    blob_path = Path(store.blob_path(digest))
    assert int(store.blobs[digest]["refcount"]) == 2
    assert blob_path.exists()

    await store.async_remove(d1["id"])
    await hass.async_block_till_done()

    assert blob_path.exists(), "blob freed while a second doc still references it"
    assert int(store.blobs[digest]["refcount"]) == 1
    remaining = store.for_object(oid)
    assert len(remaining) == 1
    assert remaining[0]["filename"] == d2["filename"]
