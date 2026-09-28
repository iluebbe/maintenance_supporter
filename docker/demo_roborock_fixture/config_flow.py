"""One-click config flow for the demo robots."""

from __future__ import annotations

from typing import Any

from homeassistant.config_entries import ConfigFlow, ConfigFlowResult

from . import DOMAIN


class RoborockDemoFlow(ConfigFlow, domain=DOMAIN):
    VERSION = 1

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        await self.async_set_unique_id("roborock_demo")
        self._abort_if_unique_id_configured()
        return self.async_create_entry(title="Roborock (Demo)", data={})
