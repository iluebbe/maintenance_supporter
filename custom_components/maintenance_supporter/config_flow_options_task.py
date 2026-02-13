"""Per-object task options flow for the Maintenance Supporter integration.

Contains MaintenanceOptionsFlow: per-object task CRUD, trigger config via TriggerConfigMixin.
Split from config_flow_options.py for better maintainability.
"""

from __future__ import annotations

from typing import Any
from uuid import uuid4

import voluptuous as vol

from homeassistant.config_entries import ConfigFlowResult, OptionsFlow
from homeassistant.helpers import selector

from .config_flow_trigger import TriggerConfigMixin
from .const import (
    CONF_ADAPTIVE_CONFIG,
    CONF_ADAPTIVE_ENABLED,
    CONF_ADAPTIVE_EWA_ALPHA,
    CONF_ADAPTIVE_MAX_INTERVAL,
    CONF_ADAPTIVE_MIN_INTERVAL,
    CONF_ADVANCED_ADAPTIVE,
    CONF_ADVANCED_CHECKLISTS,
    CONF_ENVIRONMENTAL_ENTITY,
    CONF_SENSOR_PREDICTION_ENABLED,
    CONF_OBJECT,
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
    DEFAULT_ADAPTIVE_EWA_ALPHA,
    DEFAULT_ADAPTIVE_MAX_INTERVAL,
    DEFAULT_ADAPTIVE_MIN_INTERVAL,
    DEFAULT_INTERVAL_DAYS,
    DEFAULT_WARNING_DAYS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MaintenanceTypeEnum,
    ScheduleType,
)


class MaintenanceOptionsFlow(TriggerConfigMixin, OptionsFlow):
    """Handle maintenance object options."""

    def __init__(self) -> None:
        """Initialize maintenance options flow."""
        self._current_task: dict[str, Any] = {}
        self._selected_task_id: str | None = None
        self._trigger_entity_id: str | None = None
        self._trigger_entity_state: Any = None

    # --- Helpers ---

    def _update_config_entry(self, new_data: dict) -> None:
        """Update the config entry with new data."""
        self.hass.config_entries.async_update_entry(
            self.config_entry, data=new_data
        )

    def _save_new_task(self) -> ConfigFlowResult:
        """Save the current task and return to init."""
        task_id = uuid4().hex
        task_data: dict[str, Any] = {
            "id": task_id,
            "object_id": self.config_entry.data.get(CONF_OBJECT, {}).get("id", ""),
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
            task_data["interval_days"] = int(self._current_task[CONF_TASK_INTERVAL_DAYS])
        if "last_performed" in self._current_task:
            task_data["last_performed"] = self._current_task["last_performed"]
        if "trigger_config" in self._current_task:
            task_data["trigger_config"] = self._current_task["trigger_config"]
        if CONF_TASK_NOTES in self._current_task:
            task_data["notes"] = self._current_task[CONF_TASK_NOTES]

        new_data = dict(self.config_entry.data)
        new_tasks = dict(new_data.get(CONF_TASKS, {}))
        new_tasks[task_id] = task_data
        new_data[CONF_TASKS] = new_tasks

        obj = dict(new_data.get(CONF_OBJECT, {}))
        task_ids = list(obj.get("task_ids", []))
        task_ids.append(task_id)
        obj["task_ids"] = task_ids
        new_data[CONF_OBJECT] = obj

        self._update_config_entry(new_data)
        self._current_task = {}

        return self.async_create_entry(title="", data=self.config_entry.options)

    # --- Main Menu ---

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Show main options menu."""
        obj_data = self.config_entry.data.get(CONF_OBJECT, {})
        tasks_data = self.config_entry.data.get(CONF_TASKS, {})

        object_info = f"{obj_data.get('name', 'Unknown')} — {len(tasks_data)} task(s)"

        return self.async_show_menu(
            step_id="init",
            menu_options=["manage_tasks", "add_task", "object_settings"],
            description_placeholders={"object_info": object_info},
        )

    # --- Manage Tasks: List → Select → Action ---

    async def async_step_manage_tasks(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """List and manage existing tasks."""
        tasks_data = self.config_entry.data.get(CONF_TASKS, {})

        if user_input is not None:
            selected = user_input.get("selected_task")
            if selected and selected in tasks_data:
                self._selected_task_id = selected
                return await self.async_step_task_action()
            return self.async_create_entry(title="", data=self.config_entry.options)

        task_options = [
            selector.SelectOptionDict(
                value=task_id,
                label=f"{task.get('name', 'Unknown')} ({task.get('type', 'custom')})",
            )
            for task_id, task in tasks_data.items()
        ]

        if not task_options:
            return self.async_create_entry(title="", data=self.config_entry.options)

        return self.async_show_form(
            step_id="manage_tasks",
            data_schema=vol.Schema(
                {
                    vol.Required("selected_task"): selector.SelectSelector(
                        selector.SelectSelectorConfig(
                            options=task_options,
                            mode=selector.SelectSelectorMode.LIST,
                        )
                    ),
                }
            ),
        )

    def _get_global_options(self) -> dict[str, Any]:
        """Get global options from the global config entry."""
        for entry in self.hass.config_entries.async_entries(DOMAIN):
            if entry.unique_id == GLOBAL_UNIQUE_ID:
                return dict(entry.options or entry.data)
        return {}

    async def async_step_task_action(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Show actions for selected task."""
        tasks_data = self.config_entry.data.get(CONF_TASKS, {})
        task = tasks_data.get(self._selected_task_id or "", {})
        task_name = task.get("name", "Unknown")

        global_opts = self._get_global_options()
        menu = ["edit_task"]
        if global_opts.get(CONF_ADVANCED_CHECKLISTS, False):
            menu.append("edit_checklist")
        if global_opts.get(CONF_ADVANCED_ADAPTIVE, False):
            menu.append("adaptive_scheduling")
        menu.extend(["delete_task", "manage_tasks"])

        return self.async_show_menu(
            step_id="task_action",
            menu_options=menu,
            description_placeholders={"task_name": task_name},
        )

    async def async_step_edit_task(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Edit an existing task."""
        tasks_data = self.config_entry.data.get(CONF_TASKS, {})
        task = tasks_data.get(self._selected_task_id or "", {})

        if user_input is not None:
            new_data = dict(self.config_entry.data)
            new_tasks = dict(new_data.get(CONF_TASKS, {}))
            updated_task = dict(new_tasks.get(self._selected_task_id or "", {}))

            updated_task["name"] = user_input.get(CONF_TASK_NAME, updated_task.get("name"))
            updated_task["type"] = user_input.get(CONF_TASK_TYPE, updated_task.get("type"))
            if user_input.get(CONF_TASK_INTERVAL_DAYS):
                updated_task["interval_days"] = int(user_input[CONF_TASK_INTERVAL_DAYS])
            updated_task["warning_days"] = int(
                user_input.get(CONF_TASK_WARNING_DAYS, updated_task.get("warning_days", DEFAULT_WARNING_DAYS))
            )

            new_tasks[self._selected_task_id or ""] = updated_task
            new_data[CONF_TASKS] = new_tasks
            self._update_config_entry(new_data)

            return self.async_create_entry(title="", data=self.config_entry.options)

        type_options = [t.value for t in MaintenanceTypeEnum]

        return self.async_show_form(
            step_id="edit_task",
            data_schema=vol.Schema(
                {
                    vol.Required(
                        CONF_TASK_NAME, default=task.get("name", "")
                    ): selector.TextSelector(
                        selector.TextSelectorConfig(type=selector.TextSelectorType.TEXT)
                    ),
                    vol.Required(
                        CONF_TASK_TYPE, default=task.get("type", MaintenanceTypeEnum.CLEANING)
                    ): selector.SelectSelector(
                        selector.SelectSelectorConfig(
                            options=type_options,
                            mode=selector.SelectSelectorMode.DROPDOWN,
                            translation_key="maintenance_type",
                        )
                    ),
                    vol.Optional(
                        CONF_TASK_INTERVAL_DAYS,
                        default=task.get("interval_days", DEFAULT_INTERVAL_DAYS),
                    ): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            min=1, max=3650, step=1, mode=selector.NumberSelectorMode.BOX
                        )
                    ),
                    vol.Optional(
                        CONF_TASK_WARNING_DAYS,
                        default=task.get("warning_days", DEFAULT_WARNING_DAYS),
                    ): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            min=0, max=365, step=1, mode=selector.NumberSelectorMode.BOX
                        )
                    ),
                }
            ),
            description_placeholders={
                "task_name": task.get("name", ""),
            },
        )

    async def async_step_edit_checklist(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Edit the checklist for a task."""
        tasks_data = self.config_entry.data.get(CONF_TASKS, {})
        task = tasks_data.get(self._selected_task_id or "", {})

        if user_input is not None:
            # Parse textarea: one step per line, strip empty lines
            raw = user_input.get("checklist_text", "")
            items = [line.strip() for line in raw.splitlines() if line.strip()]

            new_data = dict(self.config_entry.data)
            new_tasks = dict(new_data.get(CONF_TASKS, {}))
            updated_task = dict(new_tasks.get(self._selected_task_id or "", {}))
            updated_task["checklist"] = items
            new_tasks[self._selected_task_id or ""] = updated_task
            new_data[CONF_TASKS] = new_tasks
            self._update_config_entry(new_data)

            return self.async_create_entry(title="", data=self.config_entry.options)

        current_checklist = task.get("checklist", [])
        default_text = "\n".join(current_checklist)

        return self.async_show_form(
            step_id="edit_checklist",
            data_schema=vol.Schema(
                {
                    vol.Optional(
                        "checklist_text", default=default_text
                    ): selector.TextSelector(
                        selector.TextSelectorConfig(
                            type=selector.TextSelectorType.TEXT,
                            multiline=True,
                        )
                    ),
                }
            ),
            description_placeholders={
                "task_name": task.get("name", ""),
            },
        )

    async def async_step_delete_task(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Confirm and delete a task."""
        tasks_data = self.config_entry.data.get(CONF_TASKS, {})
        task = tasks_data.get(self._selected_task_id or "", {})

        if user_input is not None:
            if user_input.get("confirm"):
                new_data = dict(self.config_entry.data)
                new_tasks = dict(new_data.get(CONF_TASKS, {}))
                new_tasks.pop(self._selected_task_id or "", None)
                new_data[CONF_TASKS] = new_tasks

                # Remove from task_ids
                obj = dict(new_data.get(CONF_OBJECT, {}))
                task_ids = [
                    tid for tid in obj.get("task_ids", [])
                    if tid != self._selected_task_id
                ]
                obj["task_ids"] = task_ids
                new_data[CONF_OBJECT] = obj

                self._update_config_entry(new_data)

            return self.async_create_entry(title="", data=self.config_entry.options)

        return self.async_show_form(
            step_id="delete_task",
            data_schema=vol.Schema(
                {
                    vol.Required("confirm", default=False): selector.BooleanSelector(),
                }
            ),
            description_placeholders={
                "task_name": task.get("name", ""),
            },
        )

    # --- Add Task (full flow with schedule type selection) ---

    async def async_step_add_task(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Add a new task — step 1: name, type, schedule."""
        if user_input is not None:
            self._current_task = {
                CONF_TASK_NAME: user_input[CONF_TASK_NAME],
                CONF_TASK_TYPE: user_input.get(CONF_TASK_TYPE, MaintenanceTypeEnum.CLEANING),
                CONF_TASK_SCHEDULE_TYPE: user_input[CONF_TASK_SCHEDULE_TYPE],
            }

            schedule = user_input[CONF_TASK_SCHEDULE_TYPE]
            if schedule == ScheduleType.TIME_BASED:
                return await self.async_step_opt_time_based()
            if schedule == ScheduleType.SENSOR_BASED:
                return await self.async_step_opt_sensor_select()
            # Manual
            return await self.async_step_opt_manual()

        type_options = [t.value for t in MaintenanceTypeEnum]
        schedule_options = [s.value for s in ScheduleType]

        return self.async_show_form(
            step_id="add_task",
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_TASK_NAME): selector.TextSelector(
                        selector.TextSelectorConfig(type=selector.TextSelectorType.TEXT)
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
        )

    async def async_step_opt_time_based(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Configure time-based schedule for new task."""
        errors: dict[str, str] = {}

        if user_input is not None:
            interval = user_input.get(CONF_TASK_INTERVAL_DAYS)
            if not interval or interval <= 0:
                errors[CONF_TASK_INTERVAL_DAYS] = "invalid_interval"
            else:
                self._current_task[CONF_TASK_INTERVAL_DAYS] = interval
                self._current_task[CONF_TASK_WARNING_DAYS] = user_input.get(
                    CONF_TASK_WARNING_DAYS, DEFAULT_WARNING_DAYS
                )
                last_performed = user_input.get("last_performed")
                if last_performed:
                    self._current_task["last_performed"] = str(last_performed)

                return self._save_new_task()

        return self.async_show_form(
            step_id="opt_time_based",
            data_schema=vol.Schema(
                {
                    vol.Required(
                        CONF_TASK_INTERVAL_DAYS, default=DEFAULT_INTERVAL_DAYS
                    ): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            min=1, max=3650, step=1, mode=selector.NumberSelectorMode.BOX
                        )
                    ),
                    vol.Optional("last_performed"): selector.DateSelector(),
                    vol.Optional(
                        CONF_TASK_WARNING_DAYS, default=DEFAULT_WARNING_DAYS
                    ): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            min=0, max=365, step=1, mode=selector.NumberSelectorMode.BOX
                        )
                    ),
                }
            ),
            errors=errors,
        )

    async def async_step_opt_manual(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Configure manual schedule for new task."""
        if user_input is not None:
            self._current_task[CONF_TASK_SCHEDULE_TYPE] = ScheduleType.MANUAL
            self._current_task[CONF_TASK_WARNING_DAYS] = user_input.get(
                CONF_TASK_WARNING_DAYS, DEFAULT_WARNING_DAYS
            )
            if user_input.get(CONF_TASK_NOTES):
                self._current_task[CONF_TASK_NOTES] = user_input[CONF_TASK_NOTES]

            return self._save_new_task()

        return self.async_show_form(
            step_id="opt_manual",
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
                            type=selector.TextSelectorType.TEXT, multiline=True
                        )
                    ),
                }
            ),
        )

    # --- Sensor trigger steps (thin wrappers delegating to TriggerConfigMixin) ---

    async def async_step_opt_sensor_select(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Select sensor entity for trigger."""
        return await self._trigger_sensor_select(
            user_input,
            step_id="opt_sensor_select",
            next_step=self.async_step_opt_sensor_attribute,
        )

    async def async_step_opt_sensor_attribute(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Select attribute to monitor."""
        return await self._trigger_sensor_attribute(
            user_input,
            step_id="opt_sensor_attribute",
            next_step=self.async_step_opt_trigger_type,
            error_step_id="opt_sensor_select",
        )

    async def async_step_opt_trigger_type(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Select trigger type."""
        return await self._trigger_type_select(
            user_input,
            step_id="opt_trigger_type",
            threshold_step=self.async_step_opt_trigger_threshold,
            counter_step=self.async_step_opt_trigger_counter,
            state_change_step=self.async_step_opt_trigger_state_change,
        )

    async def async_step_opt_trigger_threshold(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Configure threshold trigger."""
        return await self._trigger_threshold_config(
            user_input,
            step_id="opt_trigger_threshold",
            on_complete=self._save_new_task,
        )

    async def async_step_opt_trigger_counter(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Configure counter trigger."""
        return await self._trigger_counter_config(
            user_input,
            step_id="opt_trigger_counter",
            on_complete=self._save_new_task,
        )

    async def async_step_opt_trigger_state_change(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Configure state change trigger."""
        return await self._trigger_state_change_config(
            user_input,
            step_id="opt_trigger_state_change",
            on_complete=self._save_new_task,
        )

    # --- Adaptive Scheduling ---

    async def async_step_adaptive_scheduling(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Configure adaptive scheduling for a task."""
        tasks_data = self.config_entry.data.get(CONF_TASKS, {})
        task = tasks_data.get(self._selected_task_id or "", {})
        current_adaptive = task.get(CONF_ADAPTIVE_CONFIG, {})

        if user_input is not None:
            enabled = user_input.get(CONF_ADAPTIVE_ENABLED, False)
            adaptive_config: dict[str, Any] = dict(current_adaptive)
            adaptive_config["enabled"] = enabled
            adaptive_config[CONF_ADAPTIVE_EWA_ALPHA] = user_input.get(
                CONF_ADAPTIVE_EWA_ALPHA, DEFAULT_ADAPTIVE_EWA_ALPHA
            )
            adaptive_config[CONF_ADAPTIVE_MIN_INTERVAL] = int(
                user_input.get(CONF_ADAPTIVE_MIN_INTERVAL, DEFAULT_ADAPTIVE_MIN_INTERVAL)
            )
            adaptive_config[CONF_ADAPTIVE_MAX_INTERVAL] = int(
                user_input.get(CONF_ADAPTIVE_MAX_INTERVAL, DEFAULT_ADAPTIVE_MAX_INTERVAL)
            )
            # Seasonal awareness toggle
            adaptive_config["seasonal_enabled"] = user_input.get(
                "seasonal_enabled", True
            )

            # Sensor prediction toggle (Phase 3)
            adaptive_config[CONF_SENSOR_PREDICTION_ENABLED] = user_input.get(
                CONF_SENSOR_PREDICTION_ENABLED, True
            )
            env_entity = user_input.get(CONF_ENVIRONMENTAL_ENTITY)
            if env_entity:
                adaptive_config["environmental_entity"] = env_entity
            else:
                adaptive_config.pop("environmental_entity", None)
                adaptive_config.pop("environmental_attribute", None)

            # Store base_interval for blending if not yet set
            if "base_interval" not in adaptive_config:
                adaptive_config["base_interval"] = task.get("interval_days", 30)

            new_data = dict(self.config_entry.data)
            new_tasks = dict(new_data.get(CONF_TASKS, {}))
            updated_task = dict(new_tasks.get(self._selected_task_id or "", {}))
            updated_task[CONF_ADAPTIVE_CONFIG] = adaptive_config
            new_tasks[self._selected_task_id or ""] = updated_task
            new_data[CONF_TASKS] = new_tasks
            self._update_config_entry(new_data)

            return self.async_create_entry(title="", data=self.config_entry.options)

        return self.async_show_form(
            step_id="adaptive_scheduling",
            data_schema=vol.Schema(
                {
                    vol.Optional(
                        CONF_ADAPTIVE_ENABLED,
                        default=current_adaptive.get("enabled", False),
                    ): selector.BooleanSelector(),
                    vol.Optional(
                        CONF_ADAPTIVE_EWA_ALPHA,
                        default=current_adaptive.get(
                            CONF_ADAPTIVE_EWA_ALPHA, DEFAULT_ADAPTIVE_EWA_ALPHA
                        ),
                    ): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            min=0.1, max=0.9, step=0.1,
                            mode=selector.NumberSelectorMode.SLIDER,
                        )
                    ),
                    vol.Optional(
                        CONF_ADAPTIVE_MIN_INTERVAL,
                        default=current_adaptive.get(
                            CONF_ADAPTIVE_MIN_INTERVAL, DEFAULT_ADAPTIVE_MIN_INTERVAL
                        ),
                    ): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            min=1, max=365, step=1,
                            mode=selector.NumberSelectorMode.BOX,
                            unit_of_measurement="days",
                        )
                    ),
                    vol.Optional(
                        CONF_ADAPTIVE_MAX_INTERVAL,
                        default=current_adaptive.get(
                            CONF_ADAPTIVE_MAX_INTERVAL, DEFAULT_ADAPTIVE_MAX_INTERVAL
                        ),
                    ): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            min=1, max=3650, step=1,
                            mode=selector.NumberSelectorMode.BOX,
                            unit_of_measurement="days",
                        )
                    ),
                    vol.Optional(
                        "seasonal_enabled",
                        default=current_adaptive.get("seasonal_enabled", True),
                    ): selector.BooleanSelector(),
                    vol.Optional(
                        CONF_SENSOR_PREDICTION_ENABLED,
                        default=current_adaptive.get(
                            CONF_SENSOR_PREDICTION_ENABLED, True
                        ),
                    ): selector.BooleanSelector(),
                    vol.Optional(
                        CONF_ENVIRONMENTAL_ENTITY,
                        default=current_adaptive.get("environmental_entity", ""),
                    ): selector.EntitySelector(
                        selector.EntitySelectorConfig(
                            domain=["sensor"],
                            device_class=["temperature", "humidity", "pressure"],
                            multiple=False,
                        )
                    ),
                }
            ),
            description_placeholders={
                "task_name": task.get("name", ""),
            },
        )

    # --- Object Settings ---

    async def async_step_object_settings(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Edit object settings."""
        if user_input is not None:
            new_data = dict(self.config_entry.data)
            obj = dict(new_data.get(CONF_OBJECT, {}))
            obj[CONF_OBJECT_NAME] = user_input.get(CONF_OBJECT_NAME, obj.get("name"))
            obj[CONF_OBJECT_MANUFACTURER] = user_input.get(CONF_OBJECT_MANUFACTURER)
            obj[CONF_OBJECT_MODEL] = user_input.get(CONF_OBJECT_MODEL)
            new_data[CONF_OBJECT] = obj

            self.hass.config_entries.async_update_entry(
                self.config_entry,
                data=new_data,
                title=obj[CONF_OBJECT_NAME],
            )

            return self.async_create_entry(title="", data=self.config_entry.options)

        obj = self.config_entry.data.get(CONF_OBJECT, {})

        return self.async_show_form(
            step_id="object_settings",
            data_schema=vol.Schema(
                {
                    vol.Required(
                        CONF_OBJECT_NAME, default=obj.get("name", "")
                    ): selector.TextSelector(
                        selector.TextSelectorConfig(type=selector.TextSelectorType.TEXT)
                    ),
                    vol.Optional(
                        CONF_OBJECT_MANUFACTURER,
                        default=obj.get("manufacturer", ""),
                    ): selector.TextSelector(
                        selector.TextSelectorConfig(type=selector.TextSelectorType.TEXT)
                    ),
                    vol.Optional(
                        CONF_OBJECT_MODEL, default=obj.get("model", "")
                    ): selector.TextSelector(
                        selector.TextSelectorConfig(type=selector.TextSelectorType.TEXT)
                    ),
                }
            ),
        )
