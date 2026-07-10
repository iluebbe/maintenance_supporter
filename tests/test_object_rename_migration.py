"""Object rename must migrate the name-slug-based entity unique_ids.

Sensor/button/binary-sensor unique_ids embed the object's NAME SLUG. Before
the migrate_object_unique_ids helper, renaming an object orphaned every
registry entry on the next reload: the entities came back under NEW
unique_ids (and entity_ids) while dashboards and automations kept pointing
at the unavailable old ones.
"""

from __future__ import annotations

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry
from unittest.mock import MagicMock

from custom_components.maintenance_supporter.const import (
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from custom_components.maintenance_supporter.websocket.objects import (
    ws_update_object,
)

from .conftest import (
    make_ws_connection as _mock_connection,
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
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




async def test_rename_then_reload_keeps_entities(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    obj_entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Old Name",
        data=build_object_entry_data(
            object_data=build_object_data(name="Old Name"),
            tasks={TASK_ID_1: build_task_data(task_id=TASK_ID_1, interval_days=30)},
        ),
        source="user",
        unique_id="maintenance_supporter_old_name",
    )
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj_entry)

    reg = er.async_get(hass)
    before = {e.unique_id for e in er.async_entries_for_config_entry(reg, obj_entry.entry_id)}

    conn = _mock_connection()
    await call_ws_handler(
        ws_update_object,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/object/update",
            "entry_id": obj_entry.entry_id,
            "name": "Completely New Name",
        },
    )
    await hass.async_block_till_done()

    await hass.config_entries.async_reload(obj_entry.entry_id)
    await hass.async_block_till_done()

    after = {e.unique_id for e in er.async_entries_for_config_entry(reg, obj_entry.entry_id)}
    # Same entry count, no orphans — every id swapped to the new slug prefix.
    assert len(after) == len(before)
    assert all("completely_new_name" in uid for uid in after)
    assert not any("old_name" in uid for uid in after)
