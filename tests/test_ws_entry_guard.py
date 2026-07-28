"""Regression: the adopt handlers must refuse the GLOBAL settings entry.

``websocket._load_object_entry`` is the canonical resolver — entry exists, is
ours, and is NOT the global entry — and its docstring says it exists so
"future additions can't forget any of the three checks". Both adopt handlers
resolve a client-supplied ``entry_id`` themselves and carried only the first
two checks. ``async_persist_task`` does not re-check, so a global ``entry_id``
wrote object-shaped task data (``CONF_TASKS`` + ``CONF_OBJECT["task_ids"]``)
straight into the global settings entry.
"""

from __future__ import annotations

import copy
from typing import Any

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_OBJECT,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)

from .conftest import (
    build_global_entry_data,
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


async def _seed_roborock(hass: HomeAssistant) -> str:
    """A fake Roborock device with two consumable sensors (mirrors the seed in
    test_integration_setups). Adoption needs a real discovered suggestion
    before control ever reaches the entry guard."""
    source = MockConfigEntry(domain="roborock", title="Roborock")
    source.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(
        config_entry_id=source.entry_id,
        identifiers={("roborock", "s7maxv")},
        name="Roborock S7 MaxV",
    )
    ent_reg = er.async_get(hass)
    for key in ("main_brush_time_left", "filter_time_left"):
        ent = ent_reg.async_get_or_create(
            "sensor",
            "roborock",
            f"s7_{key}",
            config_entry=source,
            device_id=device.id,
            translation_key=key,
            suggested_object_id=f"roborock_s7_{key}",
        )
        hass.states.async_set(ent.entity_id, "120", {"unit_of_measurement": "h"})
    return device.id


def _snapshot(hass: HomeAssistant, entry_id: str) -> dict[str, Any]:
    entry = hass.config_entries.async_get_entry(entry_id)
    assert entry is not None
    return copy.deepcopy(dict(entry.data))


def _assert_global_untouched(
    hass: HomeAssistant, entry_id: str, before: dict[str, Any]
) -> None:
    entry = hass.config_entries.async_get_entry(entry_id)
    assert entry is not None
    assert CONF_TASKS not in entry.data, "task data written into the GLOBAL settings entry"
    assert CONF_OBJECT not in entry.data, "object data written into the GLOBAL settings entry"
    assert dict(entry.data) == before, "the GLOBAL settings entry was mutated"


async def test_problem_sensor_adopt_refuses_the_global_entry(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    from custom_components.maintenance_supporter.websocket.problem_sensors import (
        ws_adopt_problem_sensors,
    )

    await setup_integration(hass, global_entry)
    hass.states.async_set(
        "binary_sensor.printer_problem",
        "on",
        {"device_class": "problem", "friendly_name": "Printer"},
    )
    before = _snapshot(hass, global_entry.entry_id)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_adopt_problem_sensors,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/problem_sensors/adopt",
            "selections": [
                {
                    "entity_id": "binary_sensor.printer_problem",
                    "name": "Printer Problem",
                    "entry_id": global_entry.entry_id,
                }
            ],
        },
    )
    await hass.async_block_till_done()

    res = conn.send_result.call_args[0][1]
    assert res["tasks_created"] == 0, "task created on the GLOBAL entry"
    assert res["objects_created"] == 0
    assert [e["reason"] for e in res.get("errors", [])] == ["target object not found"]
    _assert_global_untouched(hass, global_entry.entry_id, before)


async def test_integration_setup_adopt_refuses_the_global_entry(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    from custom_components.maintenance_supporter.websocket.integration_setups import (
        ws_adopt_integration_setups,
    )

    await setup_integration(hass, global_entry)
    device_id = await _seed_roborock(hass)
    before = _snapshot(hass, global_entry.entry_id)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_adopt_integration_setups,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/integration_setups/adopt",
            "selections": [{"device_id": device_id, "entry_id": global_entry.entry_id}],
        },
    )
    await hass.async_block_till_done()

    res = conn.send_result.call_args[0][1]
    assert res["tasks_created"] == 0, "tasks created on the GLOBAL entry"
    assert res["objects_created"] == 0
    assert [e["reason"] for e in res.get("errors", [])] == ["target object not found"]
    _assert_global_untouched(hass, global_entry.entry_id, before)
