"""Journey backlog batch 1: the remaining lifecycle gaps.

E2 object-archive cascade across a restart, E4 document blobs freed on
object deletion, E6 full uninstall, C6 device link → unlink → restart,
A4 import → restart parity, I3 slug-collision behavior.
See docs/design/user-journeys.md.
"""

from __future__ import annotations

import json
from datetime import timedelta
from pathlib import Path
from typing import Any
from unittest.mock import MagicMock

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter import DOCUMENT_STORE_KEY
from custom_components.maintenance_supporter.const import (
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from custom_components.maintenance_supporter.websocket.objects import (
    ws_archive_object,
    ws_unarchive_object,
    ws_update_object,
)

from .conftest import (
    get_device_by_identifier,
    make_ws_connection as _conn,
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    setup_integration,
)
from .journey import assert_entry_fully_gone, registry_snapshot, simulate_restart


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




def _make_entry(
    hass: HomeAssistant,
    unique_id: str,
    name: str = "Life Object",
    task: dict[str, Any] | None = None,
) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title=name,
        data=build_object_entry_data(
            object_data=build_object_data(name=name),
            tasks={TASK_ID_1: task or build_task_data(task_id=TASK_ID_1, interval_days=30)},
        ),
        source="user",
        unique_id=f"maintenance_supporter_{unique_id}",
    )
    entry.add_to_hass(hass)
    return entry


async def _status(hass: HomeAssistant, entry_id: str) -> list[dict[str, Any]]:
    listed = await hass.services.async_call(
        DOMAIN,
        "list_tasks",
        {"entry_id": entry_id},
        blocking=True,
        return_response=True,
    )
    return list(listed["tasks"])


# ─── E2: object archive cascade survives a restart ──────────────────────────


async def test_object_archive_cascade_across_restart(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    obj_entry = _make_entry(hass, "e2_cascade", name="Old Freezer")
    await setup_integration(hass, global_entry, obj_entry)

    await call_ws_handler(
        ws_archive_object,
        hass,
        _conn(),
        {
            "id": 1,
            "type": "maintenance_supporter/object/archive",
            "entry_id": obj_entry.entry_id,
        },
    )
    await hass.async_block_till_done()

    # Cascaded: the task is archived too, list_tasks hides it.
    assert await _status(hass, obj_entry.entry_id) == []

    # A restart keeps the whole object inert.
    await simulate_restart(hass, global_entry, obj_entry)
    assert await _status(hass, obj_entry.entry_id) == []
    assert obj_entry.data["object"].get("archived_at") is not None

    # Unarchive brings the cascade back to life.
    await call_ws_handler(
        ws_unarchive_object,
        hass,
        _conn(),
        {
            "id": 2,
            "type": "maintenance_supporter/object/unarchive",
            "entry_id": obj_entry.entry_id,
        },
    )
    await hass.async_block_till_done()
    rows = await _status(hass, obj_entry.entry_id)
    assert len(rows) == 1
    assert rows[0]["status"] in ("ok", "due_soon")


# ─── E4 + E6: deletion frees document blobs; uninstall leaves nothing ────────


async def test_object_delete_frees_document_blobs(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    from custom_components.maintenance_supporter.websocket import (
        object_id_for_entry,
    )
    from custom_components.maintenance_supporter.websocket.objects import (
        ws_delete_object,
    )

    obj_entry = _make_entry(hass, "e4_docs", name="Doc Owner")
    await setup_integration(hass, global_entry, obj_entry)

    doc_store = hass.data[DOMAIN][DOCUMENT_STORE_KEY]
    object_id = object_id_for_entry(obj_entry)
    doc = await doc_store.async_add_file(
        object_id,
        content=b"%PDF-1.4 manual",
        filename="manual.pdf",
        mime="application/pdf",
    )
    blob_path = Path(doc_store.blob_path(doc["hash"]))
    assert blob_path.exists()

    await call_ws_handler(
        ws_delete_object,
        hass,
        _conn(),
        {
            "id": 1,
            "type": "maintenance_supporter/object/delete",
            "entry_id": obj_entry.entry_id,
        },
    )
    await hass.async_block_till_done()

    assert_entry_fully_gone(hass, obj_entry.entry_id)
    assert not blob_path.exists(), "orphaned blob after object deletion"
    assert doc_store.for_object(object_id) == []


async def test_uninstall_leaves_nothing_behind(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """E6: removing every entry (Configure-UI style) cleans registries."""
    obj_entry = _make_entry(hass, "e6_uninstall", name="Goodbye")
    await setup_integration(hass, global_entry, obj_entry)

    for entry_id in (obj_entry.entry_id, global_entry.entry_id):
        await hass.config_entries.async_remove(entry_id)
    await hass.async_block_till_done()

    assert_entry_fully_gone(hass, obj_entry.entry_id)
    assert not hass.config_entries.async_entries(DOMAIN)
    # No devices or entities of ours remain anywhere.
    dev_reg = dr.async_get(hass)
    # 2026.9 iterates entries directly and deprecates .values(); 2026.7
    # iterates ids. ChildDeviceEntry marks the new world.
    device_entries = dev_reg.devices if hasattr(dr, "ChildDeviceEntry") else dev_reg.devices.values()
    ours = [d for d in device_entries if any(idf[0] == DOMAIN for idf in d.identifiers)]
    assert not ours


# ─── C6: device link → unlink → restart ─────────────────────────────────────


async def test_device_link_unlink_restart_roundtrip(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    obj_entry = _make_entry(hass, "c6_linkcycle", name="Linker")
    await setup_integration(hass, global_entry, obj_entry)

    foreign_entry = MockConfigEntry(domain="demo", title="Demo")
    foreign_entry.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(
        config_entry_id=foreign_entry.entry_id,
        identifiers={("demo", "c6-dev")},
        name="Foreign Device",
    )

    # Link + restart: entities live on the foreign device.
    await call_ws_handler(
        ws_update_object,
        hass,
        _conn(),
        {
            "id": 1,
            "type": "maintenance_supporter/object/update",
            "entry_id": obj_entry.entry_id,
            "ha_device_id": device.id,
        },
    )
    await hass.async_block_till_done()
    await simulate_restart(hass, global_entry, obj_entry)

    ent_reg = er.async_get(hass)
    sensors = [e for e in er.async_entries_for_config_entry(ent_reg, obj_entry.entry_id) if e.domain == "sensor"]
    assert all(e.device_id == device.id for e in sensors)

    # Unlink + restart: back on an own device, same unique_ids.
    before = registry_snapshot(hass, obj_entry)
    await call_ws_handler(
        ws_update_object,
        hass,
        _conn(),
        {
            "id": 2,
            "type": "maintenance_supporter/object/update",
            "entry_id": obj_entry.entry_id,
            "ha_device_id": None,
        },
    )
    await hass.async_block_till_done()
    await simulate_restart(hass, global_entry, obj_entry)

    assert registry_snapshot(hass, obj_entry) == before
    own = get_device_by_identifier(hass, (DOMAIN, obj_entry.unique_id or ""), obj_entry.entry_id)
    assert own is not None
    sensors = [e for e in er.async_entries_for_config_entry(ent_reg, obj_entry.entry_id) if e.domain == "sensor"]
    assert all(e.device_id == own.id for e in sensors)


# ─── A4: import → restart parity ────────────────────────────────────────────


async def test_import_then_restart_keeps_status_and_history(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    from custom_components.maintenance_supporter.websocket.io import ws_import_json

    await setup_integration(hass, global_entry)

    last = (dt_util.now().date() - timedelta(days=40)).isoformat()
    payload = {
        "objects": [
            {
                "object": {"name": "Imported Car", "manufacturer": "Skoda"},
                "tasks": [
                    {
                        "name": "Oil",
                        "schedule_type": "time_based",
                        "interval_days": 30,
                        "warning_days": 5,
                        "last_performed": last,
                        "history": [
                            {"timestamp": f"{last}T10:00:00", "type": "completed", "cost": 99.0},
                        ],
                    }
                ],
            }
        ],
    }
    conn = _conn()
    await call_ws_handler(
        ws_import_json,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/json/import",
            "json_content": json.dumps(payload),
        },
    )
    await hass.async_block_till_done()
    imported = conn.send_result.call_args[0][1]["imported"]
    entry_id = imported[0]["entry_id"]

    entry = hass.config_entries.async_get_entry(entry_id)
    await simulate_restart(hass, global_entry, entry)

    rows = await _status(hass, entry_id)
    assert rows[0]["status"] == "overdue"
    coordinator = entry.runtime_data.coordinator
    merged = next(iter(coordinator._get_merged_tasks_data().values()))
    assert merged["history"][0]["cost"] == 99.0


# ─── I3: slug collision on rename is survivable ─────────────────────────────


async def test_rename_into_slug_collision_keeps_both_objects_working(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    a = _make_entry(hass, "i3_a", name="Heater Alpha")
    # Distinct task id for B — production task ids are uuid4, so a NAME
    # collision never implies a task-unique_id collision.
    b_task = build_task_data(task_id="b" * 32, interval_days=30)
    b = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Heater Beta",
        data=build_object_entry_data(
            object_data=build_object_data(name="Heater Beta"),
            tasks={"b" * 32: b_task},
        ),
        source="user",
        unique_id="maintenance_supporter_i3_b",
    )
    b.add_to_hass(hass)
    await setup_integration(hass, global_entry, a, b)

    # Rename A so its slug collides with B's task unique_ids? Not possible
    # directly (task ids differ) — the realistic collision is renaming A to
    # B's NAME. The WS layer doesn't forbid same names; the migration must
    # not corrupt B's registry entries.
    before_b = registry_snapshot(hass, b)
    await call_ws_handler(
        ws_update_object,
        hass,
        _conn(),
        {
            "id": 1,
            "type": "maintenance_supporter/object/update",
            "entry_id": a.entry_id,
            "name": "Heater Beta",
        },
    )
    await hass.async_block_till_done()
    await simulate_restart(hass, global_entry, a, b)

    assert registry_snapshot(hass, b) == before_b, "collision corrupted B"
    # Both objects still list their task.
    assert len(await _status(hass, a.entry_id)) == 1
    assert len(await _status(hass, b.entry_id)) == 1
