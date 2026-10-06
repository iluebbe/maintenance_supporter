"""Demo stand-in for Plant Monitor (Olen/homeassistant-plant) — docs screenshots only.

Mounted into the throwaway ``ha-shots`` container as
``/config/custom_components/plant`` (see e2e/shots-demo.mjs). Like the real
integration it owns the ``plant`` domain and adds one ``plant.<name>`` entity
per plant through its own config-entry platform (plant.py), registered with
the plant's device and unique_id = the plant key — so the Suggested setups
catalog matches it exactly like a real Plant Monitor plant and proposes
"Check Plant". The state is the plant's summary: "ok", or "problem" while a
reading is outside the plant's thresholds; the service ``plant.set_demo_state``
flips it for a GIF.

Never shipped: HACS packages custom_components/maintenance_supporter only.
"""

from __future__ import annotations

import logging

import voluptuous as vol
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.helpers.entity_component import EntityComponent

DOMAIN = "plant"
SIGNAL = "plant_demo_update"
_LOGGER = logging.getLogger(__name__)

# plant key -> (name, species, summary state)
PLANTS = {
    "monstera": ("Monstera", "Monstera deliciosa", "problem"),
    "fiddle_leaf_fig": ("Fiddle-Leaf Fig", "Ficus lyrata", "ok"),
}
STATES: dict[str, str] = {key: state for key, (_, _, state) in PLANTS.items()}


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    component: EntityComponent | None = hass.data.get(DOMAIN)
    if component is None:
        component = hass.data[DOMAIN] = EntityComponent(_LOGGER, DOMAIN, hass)

        async def _set_state(call: ServiceCall) -> None:
            STATES[call.data["plant"]] = call.data["state"]
            async_dispatcher_send(hass, SIGNAL, call.data["plant"])

        hass.services.async_register(
            DOMAIN,
            "set_demo_state",
            _set_state,
            schema=vol.Schema({vol.Required("plant"): vol.In(list(PLANTS)), vol.Required("state"): vol.In(["ok", "problem"])}),
        )
    # The plant.<name> entities come from this integration's own "plant"
    # platform (plant.py), as with Plant Monitor.
    return await component.async_setup_entry(entry)


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    component: EntityComponent | None = hass.data.get(DOMAIN)
    return True if component is None else await component.async_unload_entry(entry)
