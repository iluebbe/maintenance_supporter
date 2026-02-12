"""Config flow for the Maintenance Supporter integration."""

from __future__ import annotations

import logging
from typing import Any
from uuid import uuid4

import voluptuous as vol

from homeassistant.config_entries import (
    ConfigEntry,
    ConfigFlow,
    ConfigFlowResult,
    OptionsFlow,
)
from homeassistant.core import callback
from homeassistant.helpers import selector

from .config_flow_trigger import TriggerConfigMixin
from .templates import TEMPLATE_CATEGORIES, TEMPLATES, get_template_by_id, get_templates_by_category
from .const import (
    CONF_DEFAULT_WARNING_DAYS,
    CONF_NOTIFICATIONS_ENABLED,
    CONF_NOTIFY_SERVICE,
    CONF_OBJECT,
    CONF_OBJECT_AREA,
    CONF_OBJECT_INSTALLATION_DATE,
    CONF_OBJECT_MANUFACTURER,
    CONF_OBJECT_MODEL,
    CONF_OBJECT_NAME,
    CONF_TASK_INTERVAL_DAYS,
    CONF_TASK_NAME,
    CONF_TASK_NOTES,
    CONF_TASK_SCHEDULE_TYPE,
    CONF_TASK_TYPE,
    CONF_TASK_WARNING_DAYS,
    CONF_TASKS,
    DEFAULT_INTERVAL_DAYS,
    DEFAULT_WARNING_DAYS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MaintenanceTypeEnum,
    ScheduleType,
)

_LOGGER = logging.getLogger(__name__)


class MaintenanceSupporterConfigFlow(TriggerConfigMixin, ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Maintenance Supporter."""

    VERSION = 1

    def __init__(self) -> None:
        """Initialize the config flow."""
        self._object_data: dict[str, Any] = {}
        self._tasks: dict[str, dict[str, Any]] = {}
        self._current_task: dict[str, Any] = {}
        self._trigger_entity_id: str | None = None
        self._trigger_entity_state: Any = None
        self._template_category: str = ""
        self._selected_template: Any = None

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Handle the initial step."""
        # Check if global entry exists
        global_exists = any(
            entry.unique_id == GLOBAL_UNIQUE_ID
            for entry in self.hass.config_entries.async_entries(DOMAIN)
        )

        if not global_exists:
            return await self.async_step_global_setup()

        return self.async_show_menu(
            step_id="user",
            menu_options=["create_object", "create_from_template"],
        )

    async def async_step_global_setup(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Set up global configuration."""
        if user_input is not None:
            await self.async_set_unique_id(GLOBAL_UNIQUE_ID)
            self._abort_if_unique_id_configured()
            return self.async_create_entry(
                title="Maintenance Supporter",
                data={
                    CONF_DEFAULT_WARNING_DAYS: user_input.get(
                        CONF_DEFAULT_WARNING_DAYS, DEFAULT_WARNING_DAYS
                    ),
                    CONF_NOTIFICATIONS_ENABLED: user_input.get(
                        CONF_NOTIFICATIONS_ENABLED, False
                    ),
                    CONF_NOTIFY_SERVICE: user_input.get(CONF_NOTIFY_SERVICE, ""),
                },
            )

        return self.async_show_form(
            step_id="global_setup",
            data_schema=vol.Schema(
                {
                    vol.Optional(
                        CONF_DEFAULT_WARNING_DAYS, default=DEFAULT_WARNING_DAYS
                    ): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            min=1, max=365, step=1, mode=selector.NumberSelectorMode.BOX
                        )
                    ),
                    vol.Optional(
                        CONF_NOTIFICATIONS_ENABLED, default=False
                    ): selector.BooleanSelector(),
                    vol.Optional(
                        CONF_NOTIFY_SERVICE, default=""
                    ): selector.TextSelector(
                        selector.TextSelectorConfig(
                            type=selector.TextSelectorType.TEXT
                        )
                    ),
                }
            ),
        )

    async def async_step_create_from_template(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Step 1: Select a template category."""
        if user_input is not None:
            self._template_category = user_input["template_category"]
            return await self.async_step_template_select()

        options = [
            selector.SelectOptionDict(
                value=cat_id,
                label=f"{cat['name_en']} / {cat['name_de']}",
            )
            for cat_id, cat in TEMPLATE_CATEGORIES.items()
        ]

        return self.async_show_form(
            step_id="create_from_template",
            data_schema=vol.Schema(
                {
                    vol.Required("template_category"): selector.SelectSelector(
                        selector.SelectSelectorConfig(
                            options=options,
                            mode=selector.SelectSelectorMode.LIST,
                        )
                    ),
                }
            ),
        )

    async def async_step_template_select(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Step 2: Select a template from the chosen category."""
        if user_input is not None:
            template = get_template_by_id(user_input["template_id"])
            if template is None:
                return self.async_abort(reason="template_not_found")
            self._selected_template = template
            return await self.async_step_template_customize()

        templates = get_templates_by_category(self._template_category)
        options = [
            selector.SelectOptionDict(
                value=t.id,
                label=t.name,
            )
            for t in templates
        ]

        return self.async_show_form(
            step_id="template_select",
            data_schema=vol.Schema(
                {
                    vol.Required("template_id"): selector.SelectSelector(
                        selector.SelectSelectorConfig(
                            options=options,
                            mode=selector.SelectSelectorMode.LIST,
                        )
                    ),
                }
            ),
        )

    async def async_step_template_customize(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Step 3: Customize the template before creating the entry."""
        errors: dict[str, str] = {}
        template = self._selected_template

        if user_input is not None:
            name = user_input[CONF_OBJECT_NAME]

            # Validate unique name
            existing_names = [
                entry.data.get(CONF_OBJECT, {}).get(CONF_OBJECT_NAME, "")
                for entry in self.hass.config_entries.async_entries(DOMAIN)
                if entry.unique_id != GLOBAL_UNIQUE_ID
            ]
            if name in existing_names:
                errors[CONF_OBJECT_NAME] = "name_exists"
            else:
                # Build object data
                self._object_data = {
                    "id": uuid4().hex,
                    CONF_OBJECT_NAME: name,
                    CONF_OBJECT_AREA: user_input.get(CONF_OBJECT_AREA),
                    CONF_OBJECT_MANUFACTURER: user_input.get(CONF_OBJECT_MANUFACTURER),
                    CONF_OBJECT_MODEL: user_input.get(CONF_OBJECT_MODEL),
                }

                # Build tasks from template
                self._tasks = {}
                for tt in template.tasks:
                    task_id = uuid4().hex
                    task_data = {
                        "id": task_id,
                        "object_id": self._object_data["id"],
                        "name": tt.name,
                        "type": tt.type,
                        "enabled": True,
                        "schedule_type": tt.schedule_type,
                        "warning_days": tt.warning_days,
                        "history": [],
                    }
                    if tt.interval_days is not None:
                        task_data["interval_days"] = tt.interval_days
                    if tt.notes:
                        task_data["notes"] = tt.notes
                    self._tasks[task_id] = task_data

                self._object_data["task_ids"] = list(self._tasks.keys())

                return await self.async_step_finish()

        return self.async_show_form(
            step_id="template_customize",
            data_schema=vol.Schema(
                {
                    vol.Required(
                        CONF_OBJECT_NAME, default=template.name
                    ): selector.TextSelector(
                        selector.TextSelectorConfig(
                            type=selector.TextSelectorType.TEXT
                        )
                    ),
                    vol.Optional(CONF_OBJECT_AREA): selector.AreaSelector(),
                    vol.Optional(CONF_OBJECT_MANUFACTURER): selector.TextSelector(
                        selector.TextSelectorConfig(
                            type=selector.TextSelectorType.TEXT
                        )
                    ),
                    vol.Optional(CONF_OBJECT_MODEL): selector.TextSelector(
                        selector.TextSelectorConfig(
                            type=selector.TextSelectorType.TEXT
                        )
                    ),
                }
            ),
            errors=errors,
            description_placeholders={
                "template_name": template.name,
                "task_count": str(len(template.tasks)),
                "task_list": ", ".join(t.name for t in template.tasks),
            },
        )

    async def async_step_websocket(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Handle object creation from the WebSocket API (no UI)."""
        if user_input is None:
            return self.async_abort(reason="missing_data")

        obj_data = user_input.get(CONF_OBJECT, {})
        object_name = obj_data.get(CONF_OBJECT_NAME, "Unknown")
        object_slug = object_name.lower().replace(" ", "_").replace("-", "_")

        await self.async_set_unique_id(f"maintenance_supporter_{object_slug}")
        self._abort_if_unique_id_configured()

        obj_data.setdefault("task_ids", [])

        return self.async_create_entry(
            title=object_name,
            data={
                CONF_OBJECT: obj_data,
                CONF_TASKS: user_input.get(CONF_TASKS, {}),
            },
        )

    async def async_step_create_object(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Create a new maintenance object."""
        errors: dict[str, str] = {}

        if user_input is not None:
            name = user_input[CONF_OBJECT_NAME]

            # Validate unique name
            existing_names = [
                entry.data.get(CONF_OBJECT, {}).get(CONF_OBJECT_NAME, "")
                for entry in self.hass.config_entries.async_entries(DOMAIN)
                if entry.unique_id != GLOBAL_UNIQUE_ID
            ]
            if name in existing_names:
                errors[CONF_OBJECT_NAME] = "name_exists"
            else:
                self._object_data = {
                    "id": uuid4().hex,
                    CONF_OBJECT_NAME: name,
                    CONF_OBJECT_AREA: user_input.get(CONF_OBJECT_AREA),
                    CONF_OBJECT_MANUFACTURER: user_input.get(CONF_OBJECT_MANUFACTURER),
                    CONF_OBJECT_MODEL: user_input.get(CONF_OBJECT_MODEL),
                    CONF_OBJECT_INSTALLATION_DATE: user_input.get(
                        CONF_OBJECT_INSTALLATION_DATE
                    ),
                }
                self._tasks = {}
                return await self.async_step_task_menu()

        return self.async_show_form(
            step_id="create_object",
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_OBJECT_NAME): selector.TextSelector(
                        selector.TextSelectorConfig(
                            type=selector.TextSelectorType.TEXT
                        )
                    ),
                    vol.Optional(CONF_OBJECT_AREA): selector.AreaSelector(),
                    vol.Optional(CONF_OBJECT_MANUFACTURER): selector.TextSelector(
                        selector.TextSelectorConfig(
                            type=selector.TextSelectorType.TEXT
                        )
                    ),
                    vol.Optional(CONF_OBJECT_MODEL): selector.TextSelector(
                        selector.TextSelectorConfig(
                            type=selector.TextSelectorType.TEXT
                        )
                    ),
                    vol.Optional(
                        CONF_OBJECT_INSTALLATION_DATE
                    ): selector.DateSelector(),
                }
            ),
            errors=errors,
        )

    async def async_step_task_menu(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Show menu to add tasks or finish."""
        return self.async_show_menu(
            step_id="task_menu",
            menu_options=["add_task", "finish"],
            description_placeholders={
                "object_name": self._object_data.get(CONF_OBJECT_NAME, ""),
                "task_count": str(len(self._tasks)),
            },
        )

    async def async_step_add_task(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Add a maintenance task."""
        if user_input is not None:
            self._current_task = {
                "id": uuid4().hex,
                CONF_TASK_NAME: user_input[CONF_TASK_NAME],
                CONF_TASK_TYPE: user_input[CONF_TASK_TYPE],
                CONF_TASK_SCHEDULE_TYPE: user_input[CONF_TASK_SCHEDULE_TYPE],
            }

            schedule = user_input[CONF_TASK_SCHEDULE_TYPE]
            if schedule == ScheduleType.TIME_BASED:
                return await self.async_step_time_based()
            if schedule == ScheduleType.SENSOR_BASED:
                return await self.async_step_sensor_select()
            # Manual
            return await self.async_step_manual()

        type_options = [t.value for t in MaintenanceTypeEnum]
        schedule_options = [s.value for s in ScheduleType]

        return self.async_show_form(
            step_id="add_task",
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_TASK_NAME): selector.TextSelector(
                        selector.TextSelectorConfig(
                            type=selector.TextSelectorType.TEXT
                        )
                    ),
                    vol.Required(
                        CONF_TASK_TYPE, default=MaintenanceTypeEnum.CLEANING
                    ): selector.SelectSelector(
                        selector.SelectSelectorConfig(
                            options=type_options,
                            mode=selector.SelectSelectorMode.DROPDOWN,
                            translation_key="maintenance_type",
                        )
                    ),
                    vol.Required(
                        CONF_TASK_SCHEDULE_TYPE, default=ScheduleType.TIME_BASED
                    ): selector.SelectSelector(
                        selector.SelectSelectorConfig(
                            options=schedule_options,
                            mode=selector.SelectSelectorMode.LIST,
                            translation_key="schedule_type",
                        )
                    ),
                }
            ),
            description_placeholders={
                "object_name": self._object_data.get(CONF_OBJECT_NAME, ""),
            },
        )

    async def async_step_time_based(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Configure time-based schedule."""
        errors: dict[str, str] = {}

        if user_input is not None:
            interval = user_input.get(CONF_TASK_INTERVAL_DAYS, DEFAULT_INTERVAL_DAYS)
            if interval <= 0:
                errors[CONF_TASK_INTERVAL_DAYS] = "invalid_interval"
            else:
                self._current_task[CONF_TASK_INTERVAL_DAYS] = interval
                self._current_task[CONF_TASK_WARNING_DAYS] = user_input.get(
                    CONF_TASK_WARNING_DAYS, DEFAULT_WARNING_DAYS
                )
                last_performed = user_input.get("last_performed")
                if last_performed:
                    self._current_task["last_performed"] = str(last_performed)

                return self._save_task_and_return()

        return self.async_show_form(
            step_id="time_based",
            data_schema=vol.Schema(
                {
                    vol.Required(
                        CONF_TASK_INTERVAL_DAYS, default=DEFAULT_INTERVAL_DAYS
                    ): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            min=1,
                            max=3650,
                            step=1,
                            mode=selector.NumberSelectorMode.BOX,
                        )
                    ),
                    vol.Optional("last_performed"): selector.DateSelector(),
                    vol.Optional(
                        CONF_TASK_WARNING_DAYS, default=DEFAULT_WARNING_DAYS
                    ): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            min=0,
                            max=365,
                            step=1,
                            mode=selector.NumberSelectorMode.BOX,
                        )
                    ),
                }
            ),
            errors=errors,
        )

    # --- Sensor trigger steps (thin wrappers delegating to TriggerConfigMixin) ---

    async def async_step_sensor_select(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Select sensor entity for trigger."""
        return await self._trigger_sensor_select(
            user_input,
            step_id="sensor_select",
            next_step=self.async_step_sensor_attribute,
        )

    async def async_step_sensor_attribute(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Select attribute to monitor."""
        return await self._trigger_sensor_attribute(
            user_input,
            step_id="sensor_attribute",
            next_step=self.async_step_trigger_type,
            error_step_id="sensor_select",
        )

    async def async_step_trigger_type(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Select trigger type."""
        return await self._trigger_type_select(
            user_input,
            step_id="trigger_type",
            threshold_step=self.async_step_trigger_threshold,
            counter_step=self.async_step_trigger_counter,
            state_change_step=self.async_step_trigger_state_change,
        )

    async def async_step_trigger_threshold(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Configure threshold trigger."""
        return await self._trigger_threshold_config(
            user_input,
            step_id="trigger_threshold",
            on_complete=self._save_task_and_return,
        )

    async def async_step_trigger_counter(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Configure counter trigger."""
        return await self._trigger_counter_config(
            user_input,
            step_id="trigger_counter",
            on_complete=self._save_task_and_return,
        )

    async def async_step_trigger_state_change(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Configure state change trigger."""
        return await self._trigger_state_change_config(
            user_input,
            step_id="trigger_state_change",
            on_complete=self._save_task_and_return,
        )

    # --- Manual & Finish ---

    async def async_step_manual(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Configure manual schedule."""
        if user_input is not None:
            self._current_task[CONF_TASK_SCHEDULE_TYPE] = ScheduleType.MANUAL
            self._current_task[CONF_TASK_WARNING_DAYS] = user_input.get(
                CONF_TASK_WARNING_DAYS, DEFAULT_WARNING_DAYS
            )
            if user_input.get(CONF_TASK_NOTES):
                self._current_task[CONF_TASK_NOTES] = user_input[CONF_TASK_NOTES]

            return self._save_task_and_return()

        return self.async_show_form(
            step_id="manual",
            data_schema=vol.Schema(
                {
                    vol.Optional(
                        CONF_TASK_WARNING_DAYS, default=DEFAULT_WARNING_DAYS
                    ): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            min=0, max=365, step=1, mode=selector.NumberSelectorMode.BOX
                        )
                    ),
                    vol.Optional(CONF_TASK_NOTES): selector.TextSelector(
                        selector.TextSelectorConfig(
                            type=selector.TextSelectorType.TEXT,
                            multiline=True,
                        )
                    ),
                }
            ),
        )

    async def async_step_finish(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Finish the object setup and create the config entry."""
        if not self._tasks:
            # No tasks defined: go back to task menu with error
            return self.async_show_menu(
                step_id="task_menu",
                menu_options=["add_task", "finish"],
                description_placeholders={
                    "object_name": self._object_data.get(CONF_OBJECT_NAME, ""),
                    "task_count": "0",
                },
            )

        object_name = self._object_data.get(CONF_OBJECT_NAME, "Unknown")
        object_slug = object_name.lower().replace(" ", "_").replace("-", "_")

        await self.async_set_unique_id(f"maintenance_supporter_{object_slug}")
        self._abort_if_unique_id_configured()

        # Add task_ids to object
        self._object_data["task_ids"] = list(self._tasks.keys())

        return self.async_create_entry(
            title=object_name,
            data={
                CONF_OBJECT: self._object_data,
                CONF_TASKS: self._tasks,
            },
        )

    def _save_task_and_return(self) -> ConfigFlowResult:
        """Save the current task and return to task menu."""
        task_id = self._current_task.get("id", uuid4().hex)
        task_data = {
            "id": task_id,
            "object_id": self._object_data.get("id", ""),
            "name": self._current_task.get(CONF_TASK_NAME, ""),
            "type": self._current_task.get(CONF_TASK_TYPE, MaintenanceTypeEnum.CUSTOM),
            "enabled": True,
            "schedule_type": self._current_task.get(
                CONF_TASK_SCHEDULE_TYPE, ScheduleType.TIME_BASED
            ),
            "warning_days": self._current_task.get(
                CONF_TASK_WARNING_DAYS, DEFAULT_WARNING_DAYS
            ),
            "history": [],
        }

        if CONF_TASK_INTERVAL_DAYS in self._current_task:
            task_data["interval_days"] = int(
                self._current_task[CONF_TASK_INTERVAL_DAYS]
            )
        if "last_performed" in self._current_task:
            task_data["last_performed"] = self._current_task["last_performed"]
        if "trigger_config" in self._current_task:
            task_data["trigger_config"] = self._current_task["trigger_config"]
        if CONF_TASK_NOTES in self._current_task:
            task_data["notes"] = self._current_task[CONF_TASK_NOTES]

        self._tasks[task_id] = task_data
        self._current_task = {}

        _LOGGER.debug("Task saved: %s (total: %d)", task_data["name"], len(self._tasks))

        # Return to task menu using show_menu (not await)
        return self.async_show_menu(
            step_id="task_menu",
            menu_options=["add_task", "finish"],
            description_placeholders={
                "object_name": self._object_data.get(CONF_OBJECT_NAME, ""),
                "task_count": str(len(self._tasks)),
            },
        )

    @staticmethod
    @callback
    def async_get_options_flow(
        config_entry: ConfigEntry,
    ) -> OptionsFlow:
        """Get the options flow for this handler."""
        from .config_flow_options_global import GlobalOptionsFlow
        from .config_flow_options_task import MaintenanceOptionsFlow

        if config_entry.unique_id == GLOBAL_UNIQUE_ID:
            return GlobalOptionsFlow()
        return MaintenanceOptionsFlow()
