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
from homeassistant.core import State, callback
from homeassistant.helpers import selector

from .config_flow_options_global import validate_notify_service
from .config_flow_trigger import TriggerConfigMixin
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
    CONF_OBJECT_SERIAL_NUMBER,
    CONF_TASK_ICON,
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
    slugify_object_name,
)
from .templates import (
    TEMPLATE_CATEGORIES,
    ObjectTemplate,
    get_template_by_id,
    get_templates_by_category,
)

_LOGGER = logging.getLogger(__name__)


class MaintenanceSupporterConfigFlow(TriggerConfigMixin, ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Maintenance Supporter."""

    VERSION = 1
    MINOR_VERSION = 2

    def __init__(self) -> None:
        """Initialize the config flow."""
        self._object_data: dict[str, Any] = {}
        self._tasks: dict[str, dict[str, Any]] = {}
        self._current_task: dict[str, Any] = {}
        self._trigger_entity_id: str | None = None
        self._trigger_entity_state: State | None = None
        self._template_category: str = ""
        self._selected_template: ObjectTemplate | None = None

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
        errors: dict[str, str] = {}

        if user_input is not None:
            # Validate notify service format (no hass check — services may not be loaded yet)
            raw_service = user_input.get(CONF_NOTIFY_SERVICE, "")
            normalized, error = validate_notify_service(raw_service)
            if error:
                errors[CONF_NOTIFY_SERVICE] = error

            if not errors:
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
                        CONF_NOTIFY_SERVICE: normalized,
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
            errors=errors,
        )

    async def async_step_create_from_template(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Step 1: Select a template category."""
        if user_input is not None:
            if user_input.get("go_back"):
                return await self.async_step_user()
            self._template_category = user_input["template_category"]
            return await self.async_step_template_select()

        lang = (getattr(self.hass.config, "language", None) or "en")[:2].lower()
        options = [
            selector.SelectOptionDict(
                value=cat_id,
                label=cat.get(f"name_{lang}", cat["name_en"]),
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
                    vol.Optional("go_back", default=False): selector.BooleanSelector(),
                }
            ),
        )

    async def async_step_template_select(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Step 2: Select a template from the chosen category."""
        if user_input is not None:
            if user_input.get("go_back"):
                return await self.async_step_create_from_template()
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
                    vol.Optional("go_back", default=False): selector.BooleanSelector(),
                }
            ),
        )

    async def async_step_template_customize(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Step 3: Customize the template before creating the entry."""
        errors: dict[str, str] = {}
        template = self._selected_template
        if template is None:
            return self.async_abort(reason="unknown")

        if user_input is not None:
            if user_input.get("go_back"):
                return await self.async_step_template_select()

            name = user_input[CONF_OBJECT_NAME]

            # Validate unique name (case-insensitive to match slug-based unique_id)
            existing_names = [
                entry.data.get(CONF_OBJECT, {}).get(CONF_OBJECT_NAME, "").lower()
                for entry in self.hass.config_entries.async_entries(DOMAIN)
                if entry.unique_id != GLOBAL_UNIQUE_ID
            ]
            if name.lower() in existing_names:
                errors[CONF_OBJECT_NAME] = "name_exists"
            else:
                # Build object data
                self._object_data = {
                    "id": uuid4().hex,
                    CONF_OBJECT_NAME: name,
                    CONF_OBJECT_AREA: user_input.get(CONF_OBJECT_AREA),
                    CONF_OBJECT_MANUFACTURER: user_input.get(CONF_OBJECT_MANUFACTURER),
                    CONF_OBJECT_MODEL: user_input.get(CONF_OBJECT_MODEL),
                    CONF_OBJECT_SERIAL_NUMBER: user_input.get(CONF_OBJECT_SERIAL_NUMBER),
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
                    vol.Optional(CONF_OBJECT_SERIAL_NUMBER): selector.TextSelector(
                        selector.TextSelectorConfig(
                            type=selector.TextSelectorType.TEXT
                        )
                    ),
                    vol.Optional("go_back", default=False): selector.BooleanSelector(),
                }
            ),
            errors=errors,
            description_placeholders={
                "template_name": template.name,
                "task_count": str(len(template.tasks)),
                "task_list": ", ".join(t.name for t in template.tasks),
            },
        )

    async def async_step_reconfigure(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Allow user to reconfigure object settings."""
        entry = self._get_reconfigure_entry()
        obj_data = dict(entry.data.get(CONF_OBJECT, {}))
        errors: dict[str, str] = {}

        if user_input is not None:
            name = user_input[CONF_OBJECT_NAME]
            # Validate unique name (skip self)
            for other in self.hass.config_entries.async_entries(DOMAIN):
                if (
                    other.entry_id != entry.entry_id
                    and other.unique_id != GLOBAL_UNIQUE_ID
                ):
                    if (
                        other.data.get(CONF_OBJECT, {})
                        .get("name", "")
                        .lower()
                        == name.lower()
                    ):
                        errors["base"] = "name_exists"
                        break

            if not errors:
                obj_data["name"] = name
                obj_data["area_id"] = user_input.get(CONF_OBJECT_AREA)
                obj_data["manufacturer"] = user_input.get(CONF_OBJECT_MANUFACTURER)
                obj_data["model"] = user_input.get(CONF_OBJECT_MODEL)
                obj_data["serial_number"] = user_input.get(CONF_OBJECT_SERIAL_NUMBER)
                obj_data["installation_date"] = user_input.get(
                    CONF_OBJECT_INSTALLATION_DATE
                )

                new_data = dict(entry.data)
                new_data[CONF_OBJECT] = obj_data
                return self.async_update_reload_and_abort(
                    entry, data=new_data, title=name
                )

        suggested: dict[str, Any] = {
            CONF_OBJECT_NAME: obj_data.get("name", ""),
            CONF_OBJECT_MANUFACTURER: obj_data.get("manufacturer", ""),
            CONF_OBJECT_MODEL: obj_data.get("model", ""),
            CONF_OBJECT_SERIAL_NUMBER: obj_data.get("serial_number", ""),
        }
        if obj_data.get("area_id"):
            suggested[CONF_OBJECT_AREA] = obj_data["area_id"]
        if obj_data.get("installation_date"):
            suggested[CONF_OBJECT_INSTALLATION_DATE] = obj_data[
                "installation_date"
            ]

        schema = self.add_suggested_values_to_schema(
            vol.Schema(
                {
                    vol.Required(CONF_OBJECT_NAME): str,
                    vol.Optional(CONF_OBJECT_AREA): selector.AreaSelector(),
                    vol.Optional(CONF_OBJECT_MANUFACTURER): str,
                    vol.Optional(CONF_OBJECT_MODEL): str,
                    vol.Optional(CONF_OBJECT_SERIAL_NUMBER): str,
                    vol.Optional(
                        CONF_OBJECT_INSTALLATION_DATE,
                    ): selector.DateSelector(),
                }
            ),
            suggested,
        )

        return self.async_show_form(
            step_id="reconfigure",
            data_schema=schema,
            errors=errors,
            description_placeholders={"name": entry.title},
        )

    async def async_step_websocket(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Handle object creation from the WebSocket API (no UI)."""
        if user_input is None:
            return self.async_abort(reason="missing_data")

        obj_data = user_input.get(CONF_OBJECT, {})
        object_name = obj_data.get(CONF_OBJECT_NAME, "Unknown")
        object_slug = slugify_object_name(object_name)

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
            if user_input.get("go_back"):
                return await self.async_step_user()

            name = user_input[CONF_OBJECT_NAME]

            # Validate unique name (case-insensitive to match slug-based unique_id)
            existing_names = [
                entry.data.get(CONF_OBJECT, {}).get(CONF_OBJECT_NAME, "").lower()
                for entry in self.hass.config_entries.async_entries(DOMAIN)
                if entry.unique_id != GLOBAL_UNIQUE_ID
            ]
            if name.lower() in existing_names:
                errors[CONF_OBJECT_NAME] = "name_exists"
            else:
                self._object_data = {
                    "id": uuid4().hex,
                    CONF_OBJECT_NAME: name,
                    CONF_OBJECT_AREA: user_input.get(CONF_OBJECT_AREA),
                    CONF_OBJECT_MANUFACTURER: user_input.get(CONF_OBJECT_MANUFACTURER),
                    CONF_OBJECT_MODEL: user_input.get(CONF_OBJECT_MODEL),
                    CONF_OBJECT_SERIAL_NUMBER: user_input.get(
                        CONF_OBJECT_SERIAL_NUMBER
                    ),
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
                    vol.Optional(CONF_OBJECT_SERIAL_NUMBER): selector.TextSelector(
                        selector.TextSelectorConfig(
                            type=selector.TextSelectorType.TEXT
                        )
                    ),
                    vol.Optional(
                        CONF_OBJECT_INSTALLATION_DATE
                    ): selector.DateSelector(),
                    vol.Optional("go_back", default=False): selector.BooleanSelector(),
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
            if user_input.get("go_back"):
                return await self.async_step_task_menu()

            self._current_task = {
                "id": uuid4().hex,
                CONF_TASK_NAME: user_input[CONF_TASK_NAME],
                CONF_TASK_TYPE: user_input[CONF_TASK_TYPE],
                CONF_TASK_SCHEDULE_TYPE: user_input[CONF_TASK_SCHEDULE_TYPE],
            }
            if user_input.get(CONF_TASK_ICON):
                self._current_task[CONF_TASK_ICON] = user_input[CONF_TASK_ICON]

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
                    vol.Optional(CONF_TASK_ICON): selector.IconSelector(),
                    vol.Optional("go_back", default=False): selector.BooleanSelector(),
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
            if user_input.get("go_back"):
                return await self.async_step_add_task()

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
                    vol.Optional("go_back", default=False): selector.BooleanSelector(),
                }
            ),
            errors=errors,
        )

    # --- Sensor trigger steps (thin wrappers delegating to TriggerConfigMixin) ---

    async def async_step_sensor_select(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Select sensor entity for trigger."""
        self._on_cancel = lambda: self.async_step_add_task()
        return await self._trigger_sensor_select(
            user_input,
            step_id="sensor_select",
            next_step=self.async_step_sensor_attribute,
        )

    async def async_step_sensor_attribute(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Select attribute to monitor."""
        self._on_cancel = lambda: self.async_step_sensor_select()
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
        self._on_cancel = lambda: self.async_step_sensor_attribute()
        return await self._trigger_type_select(
            user_input,
            step_id="trigger_type",
            threshold_step=self.async_step_trigger_threshold,
            counter_step=self.async_step_trigger_counter,
            state_change_step=self.async_step_trigger_state_change,
            runtime_step=self.async_step_trigger_runtime,
            compound_step=self.async_step_compound_logic,
        )

    async def async_step_trigger_threshold(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Configure threshold trigger."""
        self._on_cancel = lambda: self.async_step_trigger_type()
        return await self._trigger_threshold_config(
            user_input,
            step_id="trigger_threshold",
            on_complete=self._save_task_and_return,
        )

    async def async_step_trigger_counter(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Configure counter trigger."""
        self._on_cancel = lambda: self.async_step_trigger_type()
        return await self._trigger_counter_config(
            user_input,
            step_id="trigger_counter",
            on_complete=self._save_task_and_return,
        )

    async def async_step_trigger_state_change(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Configure state change trigger."""
        self._on_cancel = lambda: self.async_step_trigger_type()
        return await self._trigger_state_change_config(
            user_input,
            step_id="trigger_state_change",
            on_complete=self._save_task_and_return,
        )

    async def async_step_trigger_runtime(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Configure runtime trigger."""
        self._on_cancel = lambda: self.async_step_trigger_type()
        return await self._trigger_runtime_config(
            user_input,
            step_id="trigger_runtime",
            on_complete=self._save_task_and_return,
        )

    # --- Compound Trigger Steps ---

    async def async_step_compound_logic(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Select compound trigger logic."""
        self._on_cancel = lambda: self.async_step_trigger_type()
        return await self._trigger_compound_logic(
            user_input,
            step_id="compound_logic",
            next_step=self.async_step_compound_condition_entity,
        )

    async def async_step_compound_condition_entity(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Select entity for compound condition."""
        if getattr(self, "_compound_conditions", []):
            self._on_cancel = lambda: self.async_step_compound_review()
        else:
            self._on_cancel = lambda: self.async_step_compound_logic()
        return await self._trigger_compound_condition_entity(
            user_input,
            step_id="compound_condition_entity",
            next_step=self.async_step_compound_condition_type,
        )

    async def async_step_compound_condition_type(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Select trigger type for compound condition."""
        self._on_cancel = lambda: self.async_step_compound_condition_entity()
        return await self._trigger_compound_condition_type(
            user_input,
            step_id="compound_condition_type",
            threshold_step=self.async_step_compound_condition_threshold,
            counter_step=self.async_step_compound_condition_counter,
            state_change_step=self.async_step_compound_condition_state_change,
            runtime_step=self.async_step_compound_condition_runtime,
        )

    async def async_step_compound_condition_threshold(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Configure threshold for compound condition."""
        self._on_cancel = lambda: self.async_step_compound_condition_type()
        return await self._trigger_compound_condition_config(
            user_input, "threshold",
            step_id="compound_condition_threshold",
            on_complete=self.async_step_compound_review,
        )

    async def async_step_compound_condition_counter(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Configure counter for compound condition."""
        self._on_cancel = lambda: self.async_step_compound_condition_type()
        return await self._trigger_compound_condition_config(
            user_input, "counter",
            step_id="compound_condition_counter",
            on_complete=self.async_step_compound_review,
        )

    async def async_step_compound_condition_state_change(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Configure state_change for compound condition."""
        self._on_cancel = lambda: self.async_step_compound_condition_type()
        return await self._trigger_compound_condition_config(
            user_input, "state_change",
            step_id="compound_condition_state_change",
            on_complete=self.async_step_compound_review,
        )

    async def async_step_compound_condition_runtime(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Configure runtime for compound condition."""
        self._on_cancel = lambda: self.async_step_compound_condition_type()
        return await self._trigger_compound_condition_config(
            user_input, "runtime",
            step_id="compound_condition_runtime",
            on_complete=self.async_step_compound_review,
        )

    async def async_step_compound_review(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Review compound trigger conditions."""
        self._on_cancel = lambda: self.async_step_compound_logic()
        return await self._trigger_compound_review(
            user_input,
            step_id="compound_review",
            add_condition_step=self.async_step_compound_condition_entity,
            on_complete=self._save_task_and_return,
        )

    # --- Manual & Finish ---

    async def async_step_manual(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Configure manual schedule."""
        if user_input is not None:
            if user_input.get("go_back"):
                return await self.async_step_add_task()

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
                    vol.Optional("go_back", default=False): selector.BooleanSelector(),
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
        object_slug = slugify_object_name(object_name)

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
        if CONF_TASK_ICON in self._current_task:
            task_data["custom_icon"] = self._current_task[CONF_TASK_ICON]

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
