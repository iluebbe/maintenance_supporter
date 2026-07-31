"""What a JSON backup may and may not restore about a device link.

`ha_device_id` is an instance-specific id: it names one device in one Home
Assistant. A backup carries it verbatim, which is right for a restore onto the
same instance and meaningless anywhere else. The question these tests answer is
what "meaningless" does — because the one outcome that would be unacceptable is
an imported object silently attaching itself to the WRONG device.

Two decisions are pinned here:

* an id that names nothing is **kept**, not scrubbed, so the same backup
  restored onto its home instance still links up. It costs nothing: the object
  falls back to its own device meanwhile.
* an id that names a real device on this instance is honoured — that IS the
  same-instance restore, and refusing it would break the feature the field
  exists for.
"""

from __future__ import annotations

import json
from typing import Any

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import CONF_OBJECT, DOMAIN, GLOBAL_UNIQUE_ID
from custom_components.maintenance_supporter.export import build_export_data
from custom_components.maintenance_supporter.websocket.io import ws_import_json

from .conftest import (
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    make_ws_connection,
    setup_integration,
)

TASK_ID = "task_1"


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN, title="Maintenance Supporter",
        data=build_global_entry_data(), source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


def _foreign_device(hass: HomeAssistant, name: str = "Washing Machine") -> dr.DeviceEntry:
    foreign = MockConfigEntry(domain="demo", title="Demo")
    foreign.add_to_hass(hass)
    return dr.async_get(hass).async_get_or_create(
        config_entry_id=foreign.entry_id,
        identifiers={("demo", name.lower().replace(" ", "-"))},
        name=name,
    )


def _payload(device_id: str | None) -> dict[str, Any]:
    """A minimal backup carrying one linked object."""
    return {
        "objects": [
            {
                "object": {"name": "Imported Object", "ha_device_id": device_id},
                "tasks": [{"name": "Service", "task_type": "service", "interval_days": 30}],
            }
        ]
    }


async def _import(hass: HomeAssistant, payload: dict[str, Any]) -> dict[str, Any]:
    conn = make_ws_connection()
    await call_ws_handler(
        ws_import_json, hass, conn,
        {"id": 1, "type": f"{DOMAIN}/json/import", "json_content": json.dumps(payload)},
    )
    await hass.async_block_till_done()
    assert conn.send_result.called, conn.send_error.call_args
    return dict(conn.send_result.call_args[0][1])


def _imported_entry(hass: HomeAssistant) -> MockConfigEntry:
    entries = [
        e for e in hass.config_entries.async_entries(DOMAIN)
        if (e.data.get(CONF_OBJECT) or {}).get("name") == "Imported Object"
    ]
    assert len(entries) == 1, f"expected exactly one imported object, got {len(entries)}"
    return entries[0]


async def test_a_backup_from_another_instance_attaches_to_nothing(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """The id came from a different Home Assistant. It must not resolve to a
    device here — the object gets one of its own instead."""
    await setup_integration(hass, global_entry)
    present = _foreign_device(hass)

    result = await _import(hass, _payload("id-from-a-foreign-instance"))
    assert result["created"] == 1, result

    entry = _imported_entry(hass)
    ent_reg = er.async_get(hass)
    ours = er.async_entries_for_config_entry(ent_reg, entry.entry_id)
    assert ours, "the imported object produced no entities"
    assert all(e.device_id != present.id for e in ours), "attached to an unrelated device"

    own = dr.async_entries_for_config_entry(dr.async_get(hass), entry.entry_id)
    assert len(own) == 1, "expected a device of its own"
    assert all(e.device_id == own[0].id for e in ours)


async def test_the_dangling_id_is_kept_so_the_backup_still_works_at_home(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """Scrubbing it would quietly turn a portable backup into a lossy one."""
    await setup_integration(hass, global_entry)
    await _import(hass, _payload("id-from-a-foreign-instance"))

    stored = _imported_entry(hass).data[CONF_OBJECT]
    assert stored.get("ha_device_id") == "id-from-a-foreign-instance"


async def test_restoring_onto_the_same_instance_links_up_again(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """The case the field exists for: the device is still here, so the restored
    object belongs on its page."""
    await setup_integration(hass, global_entry)
    device = _foreign_device(hass)

    await _import(hass, _payload(device.id))

    entry = _imported_entry(hass)
    ours = er.async_entries_for_config_entry(er.async_get(hass), entry.entry_id)
    assert ours and all(e.device_id == device.id for e in ours)
    assert not dr.async_entries_for_config_entry(dr.async_get(hass), entry.entry_id), (
        "a linked object must not own a device"
    )


async def test_an_export_carries_the_link_that_is_actually_in_use(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """Export reads what setup left behind, so a link repointed across the
    2026.8 device split is exported in its repaired form rather than as the
    dead id it was written with."""
    device = _foreign_device(hass, "Dishwasher")
    obj = build_object_data(name="Linked Object")
    obj["ha_device_id"] = device.id
    linked = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN, title="Linked Object",
        data=build_object_entry_data(
            object_data=obj, tasks={TASK_ID: build_task_data(task_id=TASK_ID, interval_days=30)}
        ),
        source="user", unique_id="maintenance_supporter_exp",
    )
    linked.add_to_hass(hass)
    await setup_integration(hass, global_entry, linked)

    payload = build_export_data(hass)
    exported = [o for o in payload["objects"] if o["object"]["name"] == "Linked Object"]
    assert len(exported) == 1
    assert exported[0]["object"]["ha_device_id"] == device.id
