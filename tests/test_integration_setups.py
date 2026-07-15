"""Integration-aware suggested setups (roadmap): verified entity signatures
propose maintenance objects with sensor triggers PRE-WIRED.

The catalog (helpers/integration_signatures) is source-verified per entry;
these tests pin the matching (translation_key + entity-id-suffix fallback),
the unit-aware thresholds, the i18n completeness of every signature task name,
and the full discover -> adopt WS cycle against registry-seeded entities.
"""

from __future__ import annotations

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import CONF_OBJECT, CONF_TASKS, DOMAIN, GLOBAL_UNIQUE_ID
from custom_components.maintenance_supporter.helpers.integration_signatures import (
    SIGNATURES,
    discover_integration_setups,
)

from .conftest import build_global_entry_data, call_ws_handler, make_ws_connection, setup_integration


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


def test_every_signature_task_name_is_fully_translated() -> None:
    """Tripwire: signature task names localize like template strings — a new
    catalog entry without its 17 translations fails here."""
    from custom_components.maintenance_supporter.templates_i18n import _T

    langs = ("de", "es", "fr", "it", "nl", "pt", "ru", "uk", "pl", "cs", "sv", "da", "nb", "fi", "ja", "hi", "zh")
    missing = []
    for domain, cat in SIGNATURES.items():
        for sig in cat.tasks:
            entry = _T.get(sig.task_name)
            if entry is None:
                missing.append(f"{domain}: {sig.task_name!r} has no translation entry")
            else:
                gaps = [lg for lg in langs if not entry.get(lg)]
                if gaps:
                    missing.append(f"{domain}: {sig.task_name!r} missing {gaps}")
            assert sig.direction in ("duration_left", "percent_left")
            assert cat.source, f"{domain} lacks a source reference"
    assert not missing, "\n".join(missing)


async def _seed_roborock(hass: HomeAssistant) -> str:
    """A fake Roborock device with two consumable sensors (translation_key
    match) — states in HOURS like HA's suggested display unit."""
    source = MockConfigEntry(domain="roborock", title="Roborock")
    source.add_to_hass(hass)
    dev_reg = dr.async_get(hass)
    device = dev_reg.async_get_or_create(
        config_entry_id=source.entry_id,
        identifiers={("roborock", "s7maxv")},
        name="Roborock S7 MaxV",
    )
    ent_reg = er.async_get(hass)
    for key in ("main_brush_time_left", "filter_time_left"):
        entry = ent_reg.async_get_or_create(
            "sensor",
            "roborock",
            f"s7_{key}",
            config_entry=source,
            device_id=device.id,
            translation_key=key,
            suggested_object_id=f"roborock_s7_{key}",
        )
        hass.states.async_set(entry.entity_id, "120", {"unit_of_measurement": "h"})
    return device.id


async def test_discover_matches_and_builds_unit_aware_thresholds(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    await setup_integration(hass, global_entry)
    device_id = await _seed_roborock(hass)

    (setup,) = discover_integration_setups(hass)
    assert setup["device_id"] == device_id
    assert setup["integration"] == "roborock"
    assert setup["suggested_object_name"] == "Roborock S7 MaxV"
    by_name = {t["task_name"]: t for t in setup["tasks"]}
    assert set(by_name) == {"Replace Main Brush", "Replace Filter"}
    assert by_name["Replace Filter"]["trigger_below"] == 24.0


async def test_adopt_creates_object_with_prewired_triggers(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    from custom_components.maintenance_supporter.websocket.integration_setups import (
        ws_adopt_integration_setups,
        ws_discover_integration_setups,
    )

    await setup_integration(hass, global_entry)
    device_id = await _seed_roborock(hass)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_adopt_integration_setups,
        hass,
        conn,
        {"id": 1, "type": "x", "selections": [{"device_id": device_id}]},
    )
    assert not conn.send_error.called, conn.send_error.call_args
    res = conn.send_result.call_args[0][1]
    assert res["tasks_created"] == 2 and res["objects_created"] == 1

    obj = next(
        e
        for e in hass.config_entries.async_entries(DOMAIN)
        if e.unique_id != GLOBAL_UNIQUE_ID and e.data.get(CONF_OBJECT, {}).get("name") == "Roborock S7 MaxV"
    )
    assert obj.data[CONF_OBJECT].get("ha_device_id") == device_id
    tasks = list(obj.data[CONF_TASKS].values())
    assert len(tasks) == 2
    tc = next(t for t in tasks if "Filter" in t["name"])["trigger_config"]
    assert tc["type"] == "threshold"
    assert tc["trigger_below"] == 24.0
    assert tc["entity_ids"] == ["sensor.roborock_s7_filter_time_left"]
    assert tc["auto_complete_on_recovery"] is True

    # Re-discovery: the wired entities are now watched — nothing proposed.
    conn2 = make_ws_connection()
    await call_ws_handler(ws_discover_integration_setups, hass, conn2, {"id": 2, "type": "x"})
    assert conn2.send_result.call_args[0][1]["setups"] == []


async def test_adopt_subset_and_seconds_unit_scaling(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """task_names subset adopts only that task; a seconds-unit entity gets the
    threshold scaled (24 h -> 86400 s)."""
    from custom_components.maintenance_supporter.websocket.integration_setups import (
        ws_adopt_integration_setups,
    )

    await setup_integration(hass, global_entry)
    device_id = await _seed_roborock(hass)
    hass.states.async_set(
        "sensor.roborock_s7_filter_time_left", "432000", {"unit_of_measurement": "s"}
    )

    conn = make_ws_connection()
    await call_ws_handler(
        ws_adopt_integration_setups,
        hass,
        conn,
        {
            "id": 1,
            "type": "x",
            "selections": [{"device_id": device_id, "task_names": ["Replace Filter"], "object_name": "Vac"}],
        },
    )
    res = conn.send_result.call_args[0][1]
    assert res["tasks_created"] == 1
    obj = next(
        e
        for e in hass.config_entries.async_entries(DOMAIN)
        if e.unique_id != GLOBAL_UNIQUE_ID and e.data.get(CONF_OBJECT, {}).get("name") == "Vac"
    )
    (task,) = obj.data[CONF_TASKS].values()
    assert task["trigger_config"]["trigger_below"] == 86400.0


async def test_adopt_unknown_device_reports_error(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    from custom_components.maintenance_supporter.websocket.integration_setups import (
        ws_adopt_integration_setups,
    )

    await setup_integration(hass, global_entry)
    conn = make_ws_connection()
    await call_ws_handler(
        ws_adopt_integration_setups,
        hass,
        conn,
        {"id": 1, "type": "x", "selections": [{"device_id": "ghost"}]},
    )
    res = conn.send_result.call_args[0][1]
    assert res["tasks_created"] == 0
    assert res["errors"][0]["reason"] == "no suggestion for this device"
