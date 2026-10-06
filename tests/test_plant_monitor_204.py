"""#204: Plant Monitor (Olen/homeassistant-plant, HACS) in Suggested setups.

The integration sums each plant up in one ``plant.<name>`` entity: "ok", or
"problem" while any watched reading (moisture, light, temperature,
conductivity, humidity, DLI) is outside the plant's own thresholds.

* The trigger pickers offer the plant domain (the config flow's list; the
  panel dialog mirrors it, test_frontend_const_parity).
* Suggested setups propose "Check Plant" per plant, latched on that summary,
  not on one of its sensors: the thresholds stay the plant's.
* Adopted, the task turns triggered while the plant has a problem and
  completes itself when the plant is back to ok.
"""

from __future__ import annotations

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.config_flow_trigger import TRIGGER_ENTITY_DOMAINS
from custom_components.maintenance_supporter.const import CONF_OBJECT, CONF_TASKS, DOMAIN, GLOBAL_UNIQUE_ID
from custom_components.maintenance_supporter.helpers.integration_signatures import (
    SIGNATURES,
    build_setup_trigger,
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


async def _plant(hass: HomeAssistant, slug: str, name: str) -> tuple[str, str]:
    """A plant as the integration registers it: its device, the plant entity
    (unique_id = its config entry) and one of its sensors."""
    source = MockConfigEntry(domain="plant", title=name)
    source.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(config_entry_id=source.entry_id, identifiers={("plant", source.entry_id)}, name=name)
    ent_reg = er.async_get(hass)
    plant = ent_reg.async_get_or_create(
        "plant", "plant", source.entry_id, config_entry=source, device_id=device.id, suggested_object_id=slug
    )
    moisture = ent_reg.async_get_or_create(
        "sensor",
        "plant",
        f"{source.entry_id}-moisture",
        config_entry=source,
        device_id=device.id,
        suggested_object_id=f"{slug}_soil_moisture",
        original_name="Soil moisture",
    )
    hass.states.async_set(plant.entity_id, "ok", {"friendly_name": name})
    hass.states.async_set(moisture.entity_id, "41", {"unit_of_measurement": "%"})
    return device.id, plant.entity_id


def test_the_trigger_pickers_offer_plants() -> None:
    assert "plant" in TRIGGER_ENTITY_DOMAINS


async def test_a_plant_proposes_check_plant_on_its_summary(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    await setup_integration(hass, global_entry)
    ficus, entity = await _plant(hass, "ficus", "Ficus")

    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}

    (task,) = setups[ficus]["tasks"]
    assert task["task_name"] == "Check Plant" and task["direction"] == "event_present"
    assert task["entity_ids"] == [entity], "the plant's summary, not its moisture sensor"
    (sig,) = SIGNATURES["plant"].tasks
    assert build_setup_trigger(sig, hass, task["entity_ids"]) == {
        "type": "state_change",
        "entity_id": entity,
        "entity_ids": [entity],
        "trigger_target_changes": 1,
        "auto_complete_on_recovery": True,
        "trigger_to_state": "problem",
    }


async def test_adopted_it_follows_the_plant(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    from custom_components.maintenance_supporter.websocket.integration_setups import ws_adopt_integration_setups

    await setup_integration(hass, global_entry)
    ficus, entity = await _plant(hass, "ficus", "Ficus")
    conn = make_ws_connection()
    await call_ws_handler(ws_adopt_integration_setups, hass, conn, {"id": 1, "type": "x", "selections": [{"device_id": ficus}]})
    await hass.async_block_till_done()
    conn.send_error.assert_not_called()

    obj = next(
        e for e in hass.config_entries.async_entries(DOMAIN) if e.unique_id != GLOBAL_UNIQUE_ID and e.data[CONF_OBJECT].get("name") == "Ficus"
    )
    (task_id,) = obj.data[CONF_TASKS]
    assert obj.data[CONF_TASKS][task_id]["name"] == "Check Plant"
    coordinator = obj.runtime_data.coordinator

    async def status_after(state: str) -> str:
        hass.states.async_set(entity, state, {"friendly_name": "Ficus"})
        await hass.async_block_till_done()
        await coordinator.async_refresh()
        await hass.async_block_till_done()
        return coordinator.data[CONF_TASKS][task_id]["_status"]

    assert coordinator.data[CONF_TASKS][task_id]["_status"] == "ok"
    assert await status_after("problem") == "triggered", "too dry, too dark, …"
    assert await status_after("ok") == "ok", "watered: the task completes itself"
    history = [h["type"] for h in obj.runtime_data.store.get_history(task_id)]
    assert history[-2:] == ["triggered", "completed"]
