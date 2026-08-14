"""Journey: the "oops, I imported it twice" (D5 blind spot).

A user restores a JSON backup, then — panicking that it didn't work — imports
the very same file again. The second import must NOT silently duplicate every
object: same-named objects collide on their unique_id and are reported as
errors, not created a second time. A renamed copy, by contrast, imports fine.
This pins idempotency of re-import over existing data and that it holds across
a restart (no ghost duplicates reappear).

See docs/design/user-journeys.md (D5 "oops" import: re-import over existing).
"""

from __future__ import annotations

import json
from typing import Any
from unittest.mock import MagicMock

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import DOMAIN, GLOBAL_UNIQUE_ID
from custom_components.maintenance_supporter.websocket.io import ws_import_json

from .conftest import (
    make_ws_connection as _conn,
    build_global_entry_data,
    call_ws_handler,
    setup_integration,
)
from .journey import simulate_restart


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




def _payload(name: str) -> dict[str, Any]:
    return {
        "objects": [
            {
                "object": {"name": name, "manufacturer": "Acme"},
                "tasks": [
                    {"name": "Annual service", "type": "inspection", "schedule_type": "time_based", "interval_days": 365},
                ],
            }
        ]
    }


async def _import(hass: HomeAssistant, payload: dict[str, Any]) -> dict[str, Any]:
    conn = _conn()
    await call_ws_handler(
        ws_import_json,
        hass,
        conn,
        {"id": 1, "type": "maintenance_supporter/json/import", "json_content": json.dumps(payload)},
    )
    await hass.async_block_till_done()
    # ws_import_json reports via send_result on success, send_error on a
    # whole-payload problem (empty / bad format) — return whichever fired.
    if conn.send_result.called:
        return conn.send_result.call_args.args[1]
    return {"error": conn.send_error.call_args.args[1]}


def _objects_named(hass: HomeAssistant, name: str) -> list[MockConfigEntry]:
    return [
        e
        for e in hass.config_entries.async_entries(DOMAIN)
        if e.unique_id != GLOBAL_UNIQUE_ID and e.title == name
    ]


async def test_reimporting_the_same_backup_does_not_duplicate_objects(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    await setup_integration(hass, global_entry)

    # First import: the object is created.
    r1 = await _import(hass, _payload("Boiler"))
    assert r1.get("created") == 1, f"first import should create one object: {r1}"
    assert len(_objects_named(hass, "Boiler")) == 1

    # Second import of the SAME data: collides on unique_id → reported as an
    # error, NOT created again. Still exactly one Boiler.
    r2 = await _import(hass, _payload("Boiler"))
    assert r2.get("created") == 0, f"re-import must not create a duplicate: {r2}"
    assert r2.get("errors"), "the collision should be reported as an error"
    assert len(_objects_named(hass, "Boiler")) == 1, "re-import duplicated the object"

    # A renamed copy imports cleanly alongside the original.
    r3 = await _import(hass, _payload("Boiler Copy"))
    assert r3.get("created") == 1
    assert len(_objects_named(hass, "Boiler")) == 1
    assert len(_objects_named(hass, "Boiler Copy")) == 1

    # No ghost duplicates reappear after a restart.
    await simulate_restart(hass, *hass.config_entries.async_entries(DOMAIN))
    assert len(_objects_named(hass, "Boiler")) == 1, "duplicate Boiler resurrected after restart"
    assert len(_objects_named(hass, "Boiler Copy")) == 1


async def test_import_remaps_history_used_parts_to_new_part_ids(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """#130: history used_parts are editable (stock delta), so the ids must
    follow the part ids the import mints. Own-part ids remap; a pooled link
    whose owner is not in this instance stays verbatim (recorded-only)."""
    await setup_integration(hass, global_entry)
    payload = {
        "objects": [
            {
                "object": {"name": "Machine"},
                "parts": [
                    {"id": "old_filter", "name": "Filter", "stock": 4},
                ],
                "tasks": [
                    {
                        "name": "Service",
                        "type": "custom",
                        "schedule_type": "time_based",
                        "interval_days": 30,
                        "consumes_parts": [{"part_id": "old_filter", "quantity": 1}],
                        "history": [
                            {
                                "timestamp": "2026-05-01T10:00:00",
                                "type": "completed",
                                "used_parts": [
                                    {"part_id": "old_filter", "name": "Filter", "quantity": 2},
                                    {"part_id": "pool_part", "name": "Pool thing", "quantity": 1, "entry_id": "gone-instance-entry"},
                                ],
                            }
                        ],
                    }
                ],
            }
        ]
    }
    result = await _import(hass, payload)
    assert result.get("imported_objects") or result.get("success") or not result.get("error"), result

    entry = _objects_named(hass, "Machine")[0]
    parts = entry.data.get("parts") or {}
    new_part_id = next(iter(parts))
    assert new_part_id != "old_filter"  # ids are minted on import

    from custom_components.maintenance_supporter.const import STORES_CACHE_KEY

    task_id = next(iter(entry.data["tasks"]))
    store = hass.data[STORES_CACHE_KEY][entry.entry_id]
    hist_entry = store.get_history(task_id)[0]
    own_link, pool_link = hist_entry["used_parts"]
    assert own_link["part_id"] == new_part_id  # remapped
    assert own_link["quantity"] == 2
    assert pool_link["part_id"] == "pool_part"  # verbatim (owner not present)
    assert pool_link["entry_id"] == "gone-instance-entry"


async def test_import_carries_checklist_progress_into_store(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """In-cycle checklist ticks round-trip a backup: the export carries them
    (post 2026-08 audit), the import sanitizes and stages them in entry.data,
    and the fresh entry's first setup migrates them into its Store — from
    where the merged read surfaces them again."""
    await setup_integration(hass, global_entry)
    payload = {
        "objects": [
            {
                "object": {"name": "Dishwasher"},
                "tasks": [
                    {
                        "name": "Deep clean",
                        "type": "cleaning",
                        "schedule_type": "time_based",
                        "interval_days": 90,
                        "checklist": ["filter", "arms", "seals"],
                        # "arms" already ticked; junk keys/values must not survive.
                        "checklist_progress": {"filter": True, "arms": 1, 42: True},
                    }
                ],
            }
        ]
    }
    result = await _import(hass, payload)
    assert not result.get("error"), result

    from custom_components.maintenance_supporter.const import STORES_CACHE_KEY
    from custom_components.maintenance_supporter.helpers.aggregate import merged_tasks

    entry = _objects_named(hass, "Dishwasher")[0]
    task_id = next(iter(entry.data["tasks"]))
    # Lifted into the Store by the first-setup migration (split-only field) —
    # and NOT left behind in the static entry data.
    store = hass.data[STORES_CACHE_KEY][entry.entry_id]
    assert store.get_task_state(task_id).get("checklist_progress") == {"filter": True, "arms": True}
    assert "checklist_progress" not in entry.data["tasks"][task_id]
    # The shared merged read overlays it for every surface (export included).
    assert merged_tasks(entry)[task_id]["checklist_progress"] == {"filter": True, "arms": True}
