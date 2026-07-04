"""Add-task + schedule-kind steps (mixin)."""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

import voluptuous as vol
from homeassistant.config_entries import ConfigFlowResult
from homeassistant.helpers import selector

from .config_flow_helpers import (
    CALENDAR_KIND_VALUES,
    apply_interval_unit,
    calendar_schema,
    interval_unit_selector,
    schedule_from_calendar_input,
)
from .const import (
    CONF_TASK_DUE_DATE,
    CONF_TASK_ICON,
    CONF_TASK_INTERVAL_ANCHOR,
    CONF_TASK_INTERVAL_DAYS,
    CONF_TASK_INTERVAL_UNIT,
    CONF_TASK_NAME,
    CONF_TASK_NOTES,
    CONF_TASK_PRIORITY,
    CONF_TASK_SCHEDULE_TYPE,
    CONF_TASK_TYPE,
    CONF_TASK_WARNING_DAYS,
    DEFAULT_INTERVAL_DAYS,
    MaintenanceTypeEnum,
    ScheduleType,
)
from .helpers.global_options import get_default_warning_days
from .helpers.schedule import (
    KIND_WEEKDAYS,
)

if TYPE_CHECKING:
    from collections.abc import Awaitable, Callable

    from homeassistant.core import HomeAssistant


class AddTaskMixin:
    """Add a new task and pick its schedule kind."""

    # -- provided by the assembled MaintenanceOptionsFlow --
    if TYPE_CHECKING:
        hass: HomeAssistant
        _on_cancel: Callable[[], ConfigFlowResult | Awaitable[ConfigFlowResult]] | None
        def _save_new_task(self) -> ConfigFlowResult: ...
        def _show_init_menu(self) -> ConfigFlowResult: ...
        def async_show_form(self, **kwargs: Any) -> ConfigFlowResult: ...
        async def async_step_opt_sensor_select(
            self, user_input: dict[str, Any] | None = None
        ) -> ConfigFlowResult: ...

    async def async_step_add_task(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Add a new task — step 1: name, type, schedule."""
        if user_input is not None:
            if user_input.get("go_back"):
                return self._show_init_menu()

            self._current_task = {
                CONF_TASK_NAME: user_input[CONF_TASK_NAME],
                CONF_TASK_TYPE: user_input.get(CONF_TASK_TYPE, MaintenanceTypeEnum.CLEANING),
                CONF_TASK_SCHEDULE_TYPE: user_input[CONF_TASK_SCHEDULE_TYPE],
            }
            if user_input.get(CONF_TASK_ICON):
                self._current_task[CONF_TASK_ICON] = user_input[CONF_TASK_ICON]
            if user_input.get(CONF_TASK_PRIORITY):
                self._current_task[CONF_TASK_PRIORITY] = user_input[CONF_TASK_PRIORITY]

            self._trigger_on_complete = self._save_new_task
            self._on_cancel = self._show_init_menu

            schedule = user_input[CONF_TASK_SCHEDULE_TYPE]
            if schedule == ScheduleType.TIME_BASED:
                return await self.async_step_opt_time_based()
            if schedule in CALENDAR_KIND_VALUES:
                return await self.async_step_opt_calendar()
            if schedule == ScheduleType.SENSOR_BASED:
                return await self.async_step_opt_sensor_select()
            if schedule == ScheduleType.ONE_TIME:
                return await self.async_step_opt_one_time()
            # Manual
            return await self.async_step_opt_manual()

        type_options = [t.value for t in MaintenanceTypeEnum]
        # Recurrence kinds: time-based, the calendar kinds (Phase 4), then the
        # trigger/one-time/manual kinds.
        schedule_options = [
            ScheduleType.TIME_BASED,
            *CALENDAR_KIND_VALUES,
            ScheduleType.SENSOR_BASED,
            ScheduleType.ONE_TIME,
            ScheduleType.MANUAL,
        ]

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
                    vol.Optional(CONF_TASK_ICON): selector.IconSelector(),
                    vol.Optional(CONF_TASK_PRIORITY, default="normal"): selector.SelectSelector(
                        selector.SelectSelectorConfig(
                            options=["low", "normal", "high"],
                            mode=selector.SelectSelectorMode.DROPDOWN,
                            translation_key="task_priority",
                        )
                    ),
                    vol.Optional(
                        "go_back", default=False
                    ): selector.BooleanSelector(),
                }
            ),
        )

    async def async_step_opt_time_based(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Configure time-based schedule for new task."""
        errors: dict[str, str] = {}

        if user_input is not None:
            if user_input.get("go_back"):
                return self._show_init_menu()

            interval = user_input.get(CONF_TASK_INTERVAL_DAYS)
            if not interval or interval <= 0:
                errors[CONF_TASK_INTERVAL_DAYS] = "invalid_interval"
            else:
                self._current_task[CONF_TASK_INTERVAL_DAYS] = interval
                apply_interval_unit(self._current_task, user_input)
                self._current_task[CONF_TASK_WARNING_DAYS] = user_input.get(
                    CONF_TASK_WARNING_DAYS, get_default_warning_days(self.hass)
                )
                self._current_task[CONF_TASK_INTERVAL_ANCHOR] = user_input.get(
                    CONF_TASK_INTERVAL_ANCHOR, "completion"
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
                    vol.Optional(
                        CONF_TASK_INTERVAL_UNIT, default="days"
                    ): interval_unit_selector(),
                    vol.Optional(
                        CONF_TASK_INTERVAL_ANCHOR, default="completion"
                    ): selector.SelectSelector(
                        selector.SelectSelectorConfig(
                            options=[
                                selector.SelectOptionDict(value="completion", label="From completion date"),
                                selector.SelectOptionDict(value="planned", label="From planned date (no drift)"),
                            ],
                            mode=selector.SelectSelectorMode.DROPDOWN,
                        )
                    ),
                    vol.Optional("last_performed"): selector.DateSelector(),
                    vol.Optional(
                        CONF_TASK_WARNING_DAYS,
                        default=get_default_warning_days(self.hass),
                    ): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            min=0, max=365, step=1, mode=selector.NumberSelectorMode.BOX
                        )
                    ),
                    vol.Optional(
                        "go_back", default=False
                    ): selector.BooleanSelector(),
                }
            ),
            errors=errors,
        )

    async def async_step_opt_calendar(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Configure a calendar recurrence kind for a new task."""
        errors: dict[str, str] = {}
        kind = self._current_task.get(CONF_TASK_SCHEDULE_TYPE, KIND_WEEKDAYS)

        if user_input is not None:
            if user_input.get("go_back"):
                return self._show_init_menu()
            schedule = schedule_from_calendar_input(kind, user_input)
            if schedule is None:
                errors["base"] = "invalid_schedule"
            else:
                self._current_task["schedule"] = schedule
                self._current_task[CONF_TASK_WARNING_DAYS] = user_input.get(
                    CONF_TASK_WARNING_DAYS, get_default_warning_days(self.hass)
                )
                if user_input.get("last_performed"):
                    self._current_task["last_performed"] = str(user_input["last_performed"])
                return self._save_new_task()

        schema = calendar_schema(kind).extend({
            vol.Optional("last_performed"): selector.DateSelector(),
            vol.Optional(
                CONF_TASK_WARNING_DAYS, default=get_default_warning_days(self.hass)
            ): selector.NumberSelector(
                selector.NumberSelectorConfig(
                    min=0, max=365, step=1, mode=selector.NumberSelectorMode.BOX
                )
            ),
            vol.Optional("go_back", default=False): selector.BooleanSelector(),
        })
        return self.async_show_form(
            step_id="opt_calendar", data_schema=schema, errors=errors,
            description_placeholders={"kind": kind},
        )

    async def async_step_opt_one_time(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Configure a one-time (non-recurring) task for new task."""
        errors: dict[str, str] = {}

        if user_input is not None:
            if user_input.get("go_back"):
                return self._show_init_menu()

            due_date = user_input.get(CONF_TASK_DUE_DATE)
            if not due_date:
                errors[CONF_TASK_DUE_DATE] = "invalid_due_date"
            else:
                self._current_task[CONF_TASK_DUE_DATE] = str(due_date)
                self._current_task[CONF_TASK_WARNING_DAYS] = user_input.get(
                    CONF_TASK_WARNING_DAYS, get_default_warning_days(self.hass)
                )
                return self._save_new_task()

        return self.async_show_form(
            step_id="opt_one_time",
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_TASK_DUE_DATE): selector.DateSelector(),
                    vol.Optional(
                        CONF_TASK_WARNING_DAYS,
                        default=get_default_warning_days(self.hass),
                    ): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            min=0, max=365, step=1, mode=selector.NumberSelectorMode.BOX
                        )
                    ),
                    vol.Optional(
                        "go_back", default=False
                    ): selector.BooleanSelector(),
                }
            ),
            errors=errors,
        )

    async def async_step_opt_manual(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Configure manual schedule for new task."""
        if user_input is not None:
            if user_input.get("go_back"):
                return self._show_init_menu()

            self._current_task[CONF_TASK_SCHEDULE_TYPE] = ScheduleType.MANUAL
            self._current_task[CONF_TASK_WARNING_DAYS] = user_input.get(
                CONF_TASK_WARNING_DAYS, get_default_warning_days(self.hass)
            )
            if user_input.get(CONF_TASK_NOTES):
                self._current_task[CONF_TASK_NOTES] = user_input[CONF_TASK_NOTES]

            return self._save_new_task()

        return self.async_show_form(
            step_id="opt_manual",
            data_schema=vol.Schema(
                {
                    vol.Optional(
                        CONF_TASK_WARNING_DAYS,
                        default=get_default_warning_days(self.hass),
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
                    vol.Optional(
                        "go_back", default=False
                    ): selector.BooleanSelector(),
                }
            ),
        )
