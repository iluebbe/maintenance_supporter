"""Shared trigger configuration mixin for config flow and options flow.

This mixin provides the sensor trigger configuration steps that are shared
between MaintenanceSupporterConfigFlow and MaintenanceOptionsFlow. Each
consuming class provides thin async_step_* wrappers that delegate to the
mixin methods with the appropriate step_id and completion callback.

Consuming classes must provide:
    - self._trigger_entity_id: str | None
    - self._trigger_entity_state: Any (HA State object or None)
    - self._current_task: dict[str, Any]
    - self.hass: HomeAssistant
    - self.async_show_form(): from ConfigFlow / OptionsFlow
"""

from __future__ import annotations

from collections.abc import Awaitable, Callable
from typing import Any

import voluptuous as vol

from homeassistant.config_entries import ConfigFlowResult
from homeassistant.helpers import selector

from .config_flow_helpers import (
    async_get_threshold_suggestions,
    format_threshold_placeholders,
)
from .const import (
    CONF_TASK_INTERVAL_DAYS,
    CONF_TASK_SCHEDULE_TYPE,
    CONF_TASK_WARNING_DAYS,
    CONF_TRIGGER_ABOVE,
    CONF_TRIGGER_ATTRIBUTE,
    CONF_TRIGGER_BELOW,
    CONF_TRIGGER_DELTA_MODE,
    CONF_TRIGGER_ENTITY,
    CONF_TRIGGER_FOR_MINUTES,
    CONF_TRIGGER_FROM_STATE,
    CONF_TRIGGER_RUNTIME_HOURS,
    CONF_TRIGGER_TARGET_CHANGES,
    CONF_TRIGGER_TARGET_VALUE,
    CONF_TRIGGER_TO_STATE,
    CONF_TRIGGER_TYPE,
    DEFAULT_WARNING_DAYS,
    ScheduleType,
    TriggerType,
)


class TriggerConfigMixin:
    """Shared sensor trigger configuration logic for ConfigFlow and OptionsFlow."""

    async def _trigger_sensor_select(
        self,
        user_input: dict[str, Any] | None,
        *,
        step_id: str,
        next_step: Callable[[], Awaitable[ConfigFlowResult]],
    ) -> ConfigFlowResult:
        """Core logic for sensor entity selection."""
        errors: dict[str, str] = {}

        if user_input is not None:
            entity_id = user_input[CONF_TRIGGER_ENTITY]
            state = self.hass.states.get(entity_id)

            if state is None:
                errors[CONF_TRIGGER_ENTITY] = "invalid_entity"
            else:
                self._trigger_entity_id = entity_id
                self._trigger_entity_state = state
                return await next_step()

        return self.async_show_form(
            step_id=step_id,
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_TRIGGER_ENTITY): selector.EntitySelector(
                        selector.EntitySelectorConfig(
                            domain=["sensor", "binary_sensor", "number", "input_number", "input_boolean", "switch"],
                        )
                    ),
                }
            ),
            errors=errors,
        )

    async def _trigger_sensor_attribute(
        self,
        user_input: dict[str, Any] | None,
        *,
        step_id: str,
        next_step: Callable[[], Awaitable[ConfigFlowResult]],
        error_step_id: str,
    ) -> ConfigFlowResult:
        """Core logic for attribute selection."""
        if user_input is not None:
            attr = user_input.get(CONF_TRIGGER_ATTRIBUTE, "_state")
            self._current_task["trigger_config"] = {
                "entity_id": self._trigger_entity_id,
                "attribute": None if attr == "_state" else attr,
            }
            return await next_step()

        # Build attribute options from entity
        state = self._trigger_entity_state
        options: list[selector.SelectOptionDict] = []

        # Add state value
        try:
            float(state.state)
            unit = state.attributes.get("unit_of_measurement", "")
            options.append(
                selector.SelectOptionDict(
                    value="_state",
                    label=f"State: {state.state} {unit}".strip(),
                )
            )
        except (ValueError, TypeError):
            pass

        # Add numeric attributes
        for attr_name, attr_value in state.attributes.items():
            if attr_name.startswith("_"):
                continue
            try:
                float(attr_value)
                options.append(
                    selector.SelectOptionDict(
                        value=attr_name,
                        label=f"{attr_name}: {attr_value}",
                    )
                )
            except (ValueError, TypeError):
                continue

        if not options:
            # No numeric data available - show error on entity select step
            return self.async_show_form(
                step_id=error_step_id,
                data_schema=vol.Schema(
                    {
                        vol.Required(CONF_TRIGGER_ENTITY): selector.EntitySelector(
                            selector.EntitySelectorConfig(
                                domain=["sensor", "binary_sensor", "number", "input_number", "input_boolean", "switch"],
                            )
                        ),
                    }
                ),
                errors={CONF_TRIGGER_ENTITY: "invalid_entity"},
            )

        current_state = state.state
        unit = state.attributes.get("unit_of_measurement", "")

        return self.async_show_form(
            step_id=step_id,
            data_schema=vol.Schema(
                {
                    vol.Required(
                        CONF_TRIGGER_ATTRIBUTE, default="_state"
                    ): selector.SelectSelector(
                        selector.SelectSelectorConfig(
                            options=options,
                            mode=selector.SelectSelectorMode.LIST,
                        )
                    ),
                }
            ),
            description_placeholders={
                "entity_id": self._trigger_entity_id or "",
                "current_state": str(current_state),
                "unit": unit,
            },
        )

    async def _trigger_type_select(
        self,
        user_input: dict[str, Any] | None,
        *,
        step_id: str,
        threshold_step: Callable[[], Awaitable[ConfigFlowResult]],
        counter_step: Callable[[], Awaitable[ConfigFlowResult]],
        state_change_step: Callable[[], Awaitable[ConfigFlowResult]],
        runtime_step: Callable[[], Awaitable[ConfigFlowResult]],
    ) -> ConfigFlowResult:
        """Core logic for trigger type selection."""
        if user_input is not None:
            trigger_type = user_input[CONF_TRIGGER_TYPE]
            self._current_task["trigger_config"]["type"] = trigger_type

            if trigger_type == TriggerType.THRESHOLD:
                return await threshold_step()
            if trigger_type == TriggerType.COUNTER:
                return await counter_step()
            if trigger_type == TriggerType.RUNTIME:
                return await runtime_step()
            return await state_change_step()

        trigger_options = [t.value for t in TriggerType]

        return self.async_show_form(
            step_id=step_id,
            data_schema=vol.Schema(
                {
                    vol.Required(
                        CONF_TRIGGER_TYPE, default=TriggerType.THRESHOLD
                    ): selector.SelectSelector(
                        selector.SelectSelectorConfig(
                            options=trigger_options,
                            mode=selector.SelectSelectorMode.LIST,
                            translation_key="trigger_type",
                        )
                    ),
                }
            ),
        )

    async def _trigger_threshold_config(
        self,
        user_input: dict[str, Any] | None,
        *,
        step_id: str,
        on_complete: Callable[[], ConfigFlowResult],
    ) -> ConfigFlowResult:
        """Core logic for threshold trigger configuration."""
        errors: dict[str, str] = {}

        if user_input is not None:
            above = user_input.get(CONF_TRIGGER_ABOVE)
            below = user_input.get(CONF_TRIGGER_BELOW)

            if above is None and below is None:
                errors["base"] = "invalid_threshold"
            else:
                tc = self._current_task["trigger_config"]
                if above is not None:
                    tc[CONF_TRIGGER_ABOVE] = above
                if below is not None:
                    tc[CONF_TRIGGER_BELOW] = below
                tc[CONF_TRIGGER_FOR_MINUTES] = user_input.get(
                    CONF_TRIGGER_FOR_MINUTES, 0
                )

                self._current_task[CONF_TASK_SCHEDULE_TYPE] = ScheduleType.SENSOR_BASED
                interval = user_input.get(CONF_TASK_INTERVAL_DAYS)
                if interval and interval > 0:
                    self._current_task[CONF_TASK_INTERVAL_DAYS] = interval
                self._current_task[CONF_TASK_WARNING_DAYS] = user_input.get(
                    CONF_TASK_WARNING_DAYS, DEFAULT_WARNING_DAYS
                )

                return on_complete()

        # Get statistics-based suggestions
        attribute = self._current_task.get("trigger_config", {}).get("attribute", "state")
        suggestions = await async_get_threshold_suggestions(
            self.hass, self._trigger_entity_id, self._current_task
        )

        return self.async_show_form(
            step_id=step_id,
            data_schema=vol.Schema(
                {
                    vol.Optional(CONF_TRIGGER_ABOVE): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            mode=selector.NumberSelectorMode.BOX,
                            step="any",
                        )
                    ),
                    vol.Optional(CONF_TRIGGER_BELOW): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            mode=selector.NumberSelectorMode.BOX,
                            step="any",
                        )
                    ),
                    vol.Optional(
                        CONF_TRIGGER_FOR_MINUTES, default=0
                    ): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            min=0, max=1440, step=1, mode=selector.NumberSelectorMode.BOX
                        )
                    ),
                    vol.Optional(CONF_TASK_INTERVAL_DAYS): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            min=1,
                            max=3650,
                            step=1,
                            mode=selector.NumberSelectorMode.BOX,
                        )
                    ),
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
            description_placeholders=format_threshold_placeholders(
                self._trigger_entity_id, attribute, suggestions
            ),
        )

    async def _trigger_counter_config(
        self,
        user_input: dict[str, Any] | None,
        *,
        step_id: str,
        on_complete: Callable[[], ConfigFlowResult],
    ) -> ConfigFlowResult:
        """Core logic for counter trigger configuration."""
        if user_input is not None:
            tc = self._current_task["trigger_config"]
            tc[CONF_TRIGGER_TARGET_VALUE] = user_input[CONF_TRIGGER_TARGET_VALUE]
            tc[CONF_TRIGGER_DELTA_MODE] = user_input.get(CONF_TRIGGER_DELTA_MODE, False)

            self._current_task[CONF_TASK_SCHEDULE_TYPE] = ScheduleType.SENSOR_BASED
            interval = user_input.get(CONF_TASK_INTERVAL_DAYS)
            if interval and interval > 0:
                self._current_task[CONF_TASK_INTERVAL_DAYS] = interval
            self._current_task[CONF_TASK_WARNING_DAYS] = user_input.get(
                CONF_TASK_WARNING_DAYS, DEFAULT_WARNING_DAYS
            )

            return on_complete()

        current_value = ""
        unit = ""
        attribute = self._current_task.get("trigger_config", {}).get("attribute", "state")

        if self._trigger_entity_state:
            state = self._trigger_entity_state
            unit = state.attributes.get("unit_of_measurement", "")
            attr = self._current_task.get("trigger_config", {}).get("attribute")
            if attr:
                current_value = str(state.attributes.get(attr, ""))
            else:
                current_value = state.state

        return self.async_show_form(
            step_id=step_id,
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_TRIGGER_TARGET_VALUE): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            mode=selector.NumberSelectorMode.BOX,
                            step="any",
                        )
                    ),
                    vol.Optional(
                        CONF_TRIGGER_DELTA_MODE, default=False
                    ): selector.BooleanSelector(),
                    vol.Optional(CONF_TASK_INTERVAL_DAYS): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            min=1,
                            max=3650,
                            step=1,
                            mode=selector.NumberSelectorMode.BOX,
                        )
                    ),
                    vol.Optional(
                        CONF_TASK_WARNING_DAYS, default=DEFAULT_WARNING_DAYS
                    ): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            min=0, max=365, step=1, mode=selector.NumberSelectorMode.BOX
                        )
                    ),
                }
            ),
            description_placeholders={
                "entity_id": self._trigger_entity_id or "",
                "attribute": attribute or "state",
                "current_value": current_value,
                "unit": unit,
            },
        )

    async def _trigger_state_change_config(
        self,
        user_input: dict[str, Any] | None,
        *,
        step_id: str,
        on_complete: Callable[[], ConfigFlowResult],
    ) -> ConfigFlowResult:
        """Core logic for state change trigger configuration."""
        if user_input is not None:
            tc = self._current_task["trigger_config"]
            if user_input.get(CONF_TRIGGER_FROM_STATE):
                tc[CONF_TRIGGER_FROM_STATE] = user_input[CONF_TRIGGER_FROM_STATE]
            if user_input.get(CONF_TRIGGER_TO_STATE):
                tc[CONF_TRIGGER_TO_STATE] = user_input[CONF_TRIGGER_TO_STATE]
            tc[CONF_TRIGGER_TARGET_CHANGES] = user_input.get(
                CONF_TRIGGER_TARGET_CHANGES, 1
            )

            self._current_task[CONF_TASK_SCHEDULE_TYPE] = ScheduleType.SENSOR_BASED
            interval = user_input.get(CONF_TASK_INTERVAL_DAYS)
            if interval and interval > 0:
                self._current_task[CONF_TASK_INTERVAL_DAYS] = interval
            self._current_task[CONF_TASK_WARNING_DAYS] = user_input.get(
                CONF_TASK_WARNING_DAYS, DEFAULT_WARNING_DAYS
            )

            return on_complete()

        return self.async_show_form(
            step_id=step_id,
            data_schema=vol.Schema(
                {
                    vol.Optional(CONF_TRIGGER_FROM_STATE): selector.TextSelector(
                        selector.TextSelectorConfig(
                            type=selector.TextSelectorType.TEXT
                        )
                    ),
                    vol.Optional(CONF_TRIGGER_TO_STATE): selector.TextSelector(
                        selector.TextSelectorConfig(
                            type=selector.TextSelectorType.TEXT
                        )
                    ),
                    vol.Required(
                        CONF_TRIGGER_TARGET_CHANGES, default=1
                    ): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            min=1,
                            max=10000,
                            step=1,
                            mode=selector.NumberSelectorMode.BOX,
                        )
                    ),
                    vol.Optional(CONF_TASK_INTERVAL_DAYS): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            min=1,
                            max=3650,
                            step=1,
                            mode=selector.NumberSelectorMode.BOX,
                        )
                    ),
                    vol.Optional(
                        CONF_TASK_WARNING_DAYS, default=DEFAULT_WARNING_DAYS
                    ): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            min=0, max=365, step=1, mode=selector.NumberSelectorMode.BOX
                        )
                    ),
                }
            ),
            description_placeholders={
                "entity_id": self._trigger_entity_id or "",
            },
        )

    async def _trigger_runtime_config(
        self,
        user_input: dict[str, Any] | None,
        *,
        step_id: str,
        on_complete: Callable[[], ConfigFlowResult],
    ) -> ConfigFlowResult:
        """Core logic for runtime trigger configuration."""
        if user_input is not None:
            tc = self._current_task["trigger_config"]
            tc[CONF_TRIGGER_RUNTIME_HOURS] = user_input[CONF_TRIGGER_RUNTIME_HOURS]

            self._current_task[CONF_TASK_SCHEDULE_TYPE] = ScheduleType.SENSOR_BASED
            interval = user_input.get(CONF_TASK_INTERVAL_DAYS)
            if interval and interval > 0:
                self._current_task[CONF_TASK_INTERVAL_DAYS] = interval
            self._current_task[CONF_TASK_WARNING_DAYS] = user_input.get(
                CONF_TASK_WARNING_DAYS, DEFAULT_WARNING_DAYS
            )

            return on_complete()

        return self.async_show_form(
            step_id=step_id,
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_TRIGGER_RUNTIME_HOURS): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            mode=selector.NumberSelectorMode.BOX,
                            step=1,
                            min=1,
                            max=100000,
                            unit_of_measurement="h",
                        )
                    ),
                    vol.Optional(CONF_TASK_INTERVAL_DAYS): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            min=1,
                            max=3650,
                            step=1,
                            mode=selector.NumberSelectorMode.BOX,
                        )
                    ),
                    vol.Optional(
                        CONF_TASK_WARNING_DAYS, default=DEFAULT_WARNING_DAYS
                    ): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            min=0, max=365, step=1, mode=selector.NumberSelectorMode.BOX
                        )
                    ),
                }
            ),
            description_placeholders={
                "entity_id": self._trigger_entity_id or "",
            },
        )
