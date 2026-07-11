"""Per-object fan-out caps (limits audit 2026-07-11).

A runaway automation or import loop must not inflate one object's
ConfigEntry.data / the documents store without bound. Parts already had a cap
(50); tasks and documents did not. These tests pin the new task + document
caps and confirm the import byte limits are wired to the named constants.
"""

from __future__ import annotations

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MAX_DOCS_PER_OBJECT,
    MAX_TASKS_PER_OBJECT,
)

from .conftest import (
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    make_ws_connection,
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


def _object_with_n_tasks(hass: HomeAssistant, n: int) -> MockConfigEntry:
    tasks = {f"task-{i:04d}": build_task_data(name=f"Task {i}", task_id=f"task-{i:04d}") for i in range(n)}
    for tid, td in tasks.items():
        td["id"] = tid
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Cap Rig",
        data=build_object_entry_data(
            object_data=build_object_data(name="Cap Rig"),
            tasks=tasks,
        ),
        source="user",
        unique_id="maintenance_supporter_cap_rig",
    )
    entry.add_to_hass(hass)
    return entry


async def test_task_create_rejected_at_cap(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """ws task/create returns limit_reached once the object is full."""
    from custom_components.maintenance_supporter.websocket.tasks import ws_create_task

    entry = _object_with_n_tasks(hass, MAX_TASKS_PER_OBJECT)
    await setup_integration(hass, global_entry, entry)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_create_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/create",
            "entry_id": entry.entry_id,
            "name": "One too many",
            "task_type": "custom",
            "interval_days": 30,
            "warning_days": 7,
        },
    )
    assert conn.send_error.called, "creating past the cap must error"
    assert conn.send_error.call_args[0][1] == "limit_reached"
    entry = hass.config_entries.async_get_entry(entry.entry_id)
    assert len(entry.data[CONF_TASKS]) == MAX_TASKS_PER_OBJECT, "no task added past the cap"


async def test_task_create_allowed_below_cap(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """One below the cap still succeeds (the guard is off-by-one-correct)."""
    from custom_components.maintenance_supporter.websocket.tasks import ws_create_task

    entry = _object_with_n_tasks(hass, MAX_TASKS_PER_OBJECT - 1)
    await setup_integration(hass, global_entry, entry)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_create_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/create",
            "entry_id": entry.entry_id,
            "name": "The last allowed one",
            "task_type": "custom",
            "interval_days": 30,
            "warning_days": 7,
        },
    )
    assert not conn.send_error.called, conn.send_error.call_args
    entry = hass.config_entries.async_get_entry(entry.entry_id)
    assert len(entry.data[CONF_TASKS]) == MAX_TASKS_PER_OBJECT


async def test_document_store_rejects_past_object_cap(hass: HomeAssistant) -> None:
    """async_add_file raises too_many_documents at the per-object cap, and only
    for the object that is full (a second object is unaffected)."""
    from custom_components.maintenance_supporter.helpers.documents import DocumentStore

    store = DocumentStore(hass)
    # Pre-fill obj-1 to its cap with cheap catalog-style metadata entries
    # (no real blobs written — the guard only counts this object's docs).
    store._data["documents"] = {
        f"d{i}": {"object_id": "obj-1", "kind": "file", "hash": f"{i:064x}"} for i in range(MAX_DOCS_PER_OBJECT)
    }

    with pytest.raises(ValueError, match="too_many_documents"):
        await store.async_add_file("obj-1", content=b"x", filename="f.pdf", mime="application/pdf")

    # A different object is not at its cap → still accepts uploads.
    doc = await store.async_add_file("obj-2", content=b"y", filename="g.pdf", mime="application/pdf")
    assert doc["object_id"] == "obj-2"


def test_import_byte_caps_are_wired_to_constants() -> None:
    """The CSV/JSON payload guards read the named constants, not stray literals
    (the constant was dead before the audit)."""
    import inspect

    from custom_components.maintenance_supporter.const import (
        MAX_IMPORT_PAYLOAD_BYTES,
        MAX_JSON_IMPORT_PAYLOAD_BYTES,
    )
    from custom_components.maintenance_supporter.websocket import io

    assert MAX_IMPORT_PAYLOAD_BYTES == 1_048_576
    assert MAX_JSON_IMPORT_PAYLOAD_BYTES == 10 * 1_048_576
    src = inspect.getsource(io)
    assert "MAX_IMPORT_PAYLOAD_BYTES" in src and "MAX_JSON_IMPORT_PAYLOAD_BYTES" in src
    assert "10_485_760" not in src, "raw JSON byte literal still present"
