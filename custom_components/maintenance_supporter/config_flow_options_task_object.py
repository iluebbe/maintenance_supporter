"""Object-settings (metadata) step (mixin)."""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

import voluptuous as vol
from homeassistant.config_entries import ConfigFlowResult
from homeassistant.helpers import selector

from .const import (
    CONF_OBJECT,
    CONF_OBJECT_AREA,
    CONF_OBJECT_DOCUMENTATION_URL,
    CONF_OBJECT_INSTALLATION_DATE,
    CONF_OBJECT_MANUFACTURER,
    CONF_OBJECT_MODEL,
    CONF_OBJECT_NAME,
    CONF_OBJECT_NOTES,
    CONF_OBJECT_SERIAL_NUMBER,
    CONF_OBJECT_WARRANTY_EXPIRY,
)

if TYPE_CHECKING:
    from homeassistant.config_entries import ConfigEntry
    from homeassistant.core import HomeAssistant


class ObjectSettingsMixin:
    """Edit the maintenance object's metadata."""

    # -- provided by the assembled MaintenanceOptionsFlow --
    if TYPE_CHECKING:
        hass: HomeAssistant
        config_entry: ConfigEntry

        def _show_init_menu(self) -> ConfigFlowResult: ...
        def async_show_form(self, **kwargs: Any) -> ConfigFlowResult: ...
        def add_suggested_values_to_schema(self, data_schema: vol.Schema, suggested_values: Any) -> vol.Schema: ...

    async def async_step_object_settings(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Edit object settings."""
        if user_input is not None:
            if user_input.get("go_back"):
                return self._show_init_menu()
            from .helpers.sanitize import cap_object_fields

            new_data = dict(self.config_entry.data)
            obj = dict(new_data.get(CONF_OBJECT, {}))
            # Migrate name-slug-based unique_ids BEFORE overwriting the name
            # (see helpers.entity_rename.migrate_object_unique_ids).
            from .helpers.entity_rename import migrate_object_unique_ids

            migrate_object_unique_ids(
                self.hass,
                self.config_entry,
                obj.get("name"),
                user_input.get(CONF_OBJECT_NAME, obj.get("name")),
            )
            obj[CONF_OBJECT_NAME] = user_input.get(CONF_OBJECT_NAME, obj.get("name"))
            obj[CONF_OBJECT_MANUFACTURER] = user_input.get(CONF_OBJECT_MANUFACTURER)
            obj[CONF_OBJECT_MODEL] = user_input.get(CONF_OBJECT_MODEL)
            obj[CONF_OBJECT_SERIAL_NUMBER] = user_input.get(CONF_OBJECT_SERIAL_NUMBER)
            obj[CONF_OBJECT_AREA] = user_input.get(CONF_OBJECT_AREA)
            # The form pre-fills with suggested values, so a field the user
            # emptied is simply absent — which now clears it. With the old
            # ``default=<stored>`` the frontend dropped the emptied field and
            # voluptuous put the stored value straight back: a wrong
            # installation or warranty date could never be removed (bug audit
            # 2026-09-26, same for the text fields and the area).
            for key in (CONF_OBJECT_INSTALLATION_DATE, CONF_OBJECT_WARRANTY_EXPIRY):
                if user_input.get(key):
                    obj[key] = str(user_input[key])
                else:
                    obj.pop(key, None)
            # v1.4.0 (#43)
            obj[CONF_OBJECT_DOCUMENTATION_URL] = user_input.get(CONF_OBJECT_DOCUMENTATION_URL) or None
            # v1.4.10 (#46)
            obj[CONF_OBJECT_NOTES] = (user_input.get(CONF_OBJECT_NOTES) or "").strip() or None
            cap_object_fields(obj)
            new_data[CONF_OBJECT] = obj

            self.hass.config_entries.async_update_entry(
                self.config_entry,
                data=new_data,
                title=obj[CONF_OBJECT_NAME],
            )

            return self._show_init_menu()

        obj = self.config_entry.data.get(CONF_OBJECT, {})

        # Suggested values, not defaults: an emptied optional field is left
        # out of the submission, and a default would re-insert the stored
        # value — nothing could be cleared (the reconfigure step's pattern).
        suggested: dict[str, Any] = {
            key: obj[key]
            for key in (
                CONF_OBJECT_MANUFACTURER,
                CONF_OBJECT_MODEL,
                CONF_OBJECT_SERIAL_NUMBER,
                CONF_OBJECT_DOCUMENTATION_URL,
                CONF_OBJECT_NOTES,
                CONF_OBJECT_AREA,
                CONF_OBJECT_INSTALLATION_DATE,
                CONF_OBJECT_WARRANTY_EXPIRY,
            )
            if obj.get(key)
        }

        return self.async_show_form(
            step_id="object_settings",
            data_schema=self.add_suggested_values_to_schema(
                vol.Schema(
                    {
                        vol.Required(CONF_OBJECT_NAME, default=obj.get("name", "")): selector.TextSelector(
                            selector.TextSelectorConfig(type=selector.TextSelectorType.TEXT)
                        ),
                        vol.Optional(CONF_OBJECT_MANUFACTURER): selector.TextSelector(
                            selector.TextSelectorConfig(type=selector.TextSelectorType.TEXT)
                        ),
                        vol.Optional(CONF_OBJECT_MODEL): selector.TextSelector(
                            selector.TextSelectorConfig(type=selector.TextSelectorType.TEXT)
                        ),
                        vol.Optional(CONF_OBJECT_SERIAL_NUMBER): selector.TextSelector(
                            selector.TextSelectorConfig(type=selector.TextSelectorType.TEXT)
                        ),
                        # v1.4.0 (#43): place under serial_number
                        vol.Optional(CONF_OBJECT_DOCUMENTATION_URL): selector.TextSelector(
                            selector.TextSelectorConfig(type=selector.TextSelectorType.URL)
                        ),
                        # v1.4.10 (#46): free-form notes (multiline)
                        vol.Optional(CONF_OBJECT_NOTES): selector.TextSelector(
                            selector.TextSelectorConfig(
                                type=selector.TextSelectorType.TEXT,
                                multiline=True,
                            )
                        ),
                        vol.Optional(CONF_OBJECT_AREA): selector.AreaSelector(),
                        vol.Optional(CONF_OBJECT_INSTALLATION_DATE): selector.DateSelector(),
                        vol.Optional(CONF_OBJECT_WARRANTY_EXPIRY): selector.DateSelector(),
                        vol.Optional("go_back", default=False): selector.BooleanSelector(),
                    }
                ),
                suggested,
            ),
        )
