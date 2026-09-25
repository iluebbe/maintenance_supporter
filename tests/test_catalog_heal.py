"""Setup-time heal of catalog triggers that could never fire (2026-09-25):
gree/daikin "Filter Cleaning" counted runtime on hvac_action."""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import CONF_TASKS
from custom_components.maintenance_supporter.helpers.catalog_heal import heal_catalog_triggers

from .conftest import build_object_entry_data, build_object_data, build_task_data, setup_integration

OLD_STATES = ["cooling", "heating", "fan", "drying"]


def _climate(hass: HomeAssistant, platform: str, uid: str) -> str:
    src = MockConfigEntry(domain=platform, title=platform)
    src.add_to_hass(hass)
    dev = dr.async_get(hass).async_get_or_create(config_entry_id=src.entry_id, identifiers={(platform, uid)}, name=f"{platform} AC")
    return er.async_get(hass).async_get_or_create("climate", platform, uid, config_entry=src, device_id=dev.id).entity_id


def _task(entity_id: str, states: list[str], attribute: str | None = "hvac_action") -> dict:
    td = build_task_data(name="Filter Cleaning")
    tc = {"type": "runtime", "entity_id": entity_id, "entity_ids": [entity_id], "trigger_on_states": states, "trigger_runtime_hours": 100.0}
    if attribute:
        tc["attribute"] = attribute
    td["trigger_config"] = tc
    return td


async def test_gree_and_daikin_catalog_triggers_are_healed(hass: HomeAssistant) -> None:
    gree = _climate(hass, "gree", "g1")
    daikin = _climate(hass, "daikin", "d1")
    data = build_object_entry_data(object_data=build_object_data(name="ACs"), tasks={"t1": _task(gree, OLD_STATES), "t2": _task(daikin, OLD_STATES)})
    healed = heal_catalog_triggers(hass, data)
    assert healed is not None
    g = healed[CONF_TASKS]["t1"]["trigger_config"]
    d = healed[CONF_TASKS]["t2"]["trigger_config"]
    assert "attribute" not in g and g["trigger_on_states"] == ["auto", "cool", "dry", "fan_only", "heat"]
    assert "attribute" not in d and d["trigger_on_states"] == ["cool", "dry", "fan_only", "heat", "heat_cool"]
    assert g["trigger_runtime_hours"] == 100.0, "everything else is kept"
    assert heal_catalog_triggers(hass, healed) is None, "idempotent"


async def test_user_configured_or_foreign_triggers_are_left_alone(hass: HomeAssistant) -> None:
    gree = _climate(hass, "gree", "g2")
    other = _climate(hass, "mill", "m1")
    data = build_object_entry_data(
        object_data=build_object_data(name="ACs"),
        tasks={
            "custom": _task(gree, ["cooling"]),  # the user narrowed the states
            "foreign": _task(other, OLD_STATES),  # another platform's hvac_action works
            "state": _task(gree, ["cool"], attribute=None),  # already state-based
        },
    )
    assert heal_catalog_triggers(hass, data) is None


async def test_heal_runs_at_object_setup(hass: HomeAssistant, global_config_entry: MockConfigEntry) -> None:
    gree = _climate(hass, "gree", "g3")
    entry = MockConfigEntry(
        domain="maintenance_supporter",
        version=1,
        minor_version=6,
        title="Living room AC",
        unique_id="maintenance_supporter_living_room_ac_heal",
        data=build_object_entry_data(object_data=build_object_data(name="Living room AC"), tasks={"t1": _task(gree, OLD_STATES)}),
    )
    entry.add_to_hass(hass)
    await setup_integration(hass, global_config_entry, entry)
    tc = hass.config_entries.async_get_entry(entry.entry_id).data[CONF_TASKS]["t1"]["trigger_config"]
    assert "attribute" not in tc and "cool" in tc["trigger_on_states"]
