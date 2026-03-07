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

import inspect
from collections.abc import Awaitable, Callable
from typing import TYPE_CHECKING, Any

if TYPE_CHECKING:
    from collections.abc import Mapping

    from homeassistant.core import HomeAssistant, State

import voluptuous as vol

from homeassistant.config_entries import ConfigFlowResult
from homeassistant.helpers import selector

from .config_flow_helpers import (
    async_get_threshold_suggestions,
    format_threshold_placeholders,
)
from .const import (
    CONF_COMPOUND_CONDITIONS,
    CONF_COMPOUND_LOGIC,
    CONF_TASK_INTERVAL_DAYS,
    CONF_TASK_SCHEDULE_TYPE,
    CONF_TASK_WARNING_DAYS,
    CONF_TRIGGER_ABOVE,
    CONF_TRIGGER_ATTRIBUTE,
    CONF_TRIGGER_BELOW,
    CONF_TRIGGER_DELTA_MODE,
    CONF_TRIGGER_ENTITY,
    CONF_TRIGGER_ENTITY_IDS,
    CONF_TRIGGER_ENTITY_LOGIC,
    CONF_TRIGGER_FOR_MINUTES,
    CONF_TRIGGER_FROM_STATE,
    CONF_TRIGGER_ON_STATES,
    CONF_TRIGGER_RUNTIME_HOURS,
    CONF_TRIGGER_TARGET_CHANGES,
    CONF_TRIGGER_TARGET_VALUE,
    CONF_TRIGGER_TO_STATE,
    CONF_TRIGGER_TYPE,
    DEFAULT_ENTITY_LOGIC,
    DEFAULT_WARNING_DAYS,
    ScheduleType,
    TriggerType,
)


# Domains allowed for trigger entity selection.
# Includes all domains from entity_attributes.DOMAIN_ATTRIBUTE_MAP plus
# input helpers and switches that are commonly used as trigger sources.
TRIGGER_ENTITY_DOMAINS = [
    "sensor",
    "binary_sensor",
    "number",
    "input_number",
    "input_boolean",
    "switch",
    "climate",
    "vacuum",
    "cover",
    "fan",
    "light",
    "water_heater",
    "humidifier",
    "media_player",
    "weather",
    "air_quality",
    "valve",
    "lawn_mower",
    "lock",
]


class TriggerConfigMixin:
    """Shared sensor trigger configuration logic for ConfigFlow and OptionsFlow.

    Consuming classes may set ``_on_cancel`` to a callable returning
    ``ConfigFlowResult`` to enable a *go back* toggle on every mixin form.
    When ``_on_cancel`` is ``None`` (the default), no toggle is shown.
    """

    # -- attributes provided by the consuming ConfigFlow / OptionsFlow class --
    if TYPE_CHECKING:
        hass: HomeAssistant
        _current_task: dict[str, Any]
        _trigger_entity_id: str | None
        _trigger_entity_state: State | None
        _trigger_entity_ids: list[str]
        _compound_conditions: list[dict[str, Any]]
        _compound_logic: str
        _current_compound_condition: dict[str, Any]

        def async_show_form(
            self,
            *,
            step_id: str | None = None,
            data_schema: vol.Schema | None = None,
            errors: dict[str, str] | None = None,
            description_placeholders: Mapping[str, str] | None = None,
            last_step: bool | None = None,
            preview: str | None = None,
        ) -> ConfigFlowResult: ...

        def async_abort(
            self,
            *,
            reason: str,
            description_placeholders: Mapping[str, str] | None = None,
            **kwargs: Any,
        ) -> ConfigFlowResult: ...

    _on_cancel: Callable[[], ConfigFlowResult | Awaitable[ConfigFlowResult]] | None = None

    async def _mixin_check_go_back(
        self, user_input: dict[str, Any] | None
    ) -> ConfigFlowResult | None:
        """Return cancel result when user checked go_back, else None.

        Handles both sync callbacks (options flow) and async callbacks
        (config flow step methods).
        """
        if (
            user_input
            and user_input.get("go_back")
            and self._on_cancel is not None
        ):
            result = self._on_cancel()
            if inspect.isawaitable(result):
                return await result
            return result
        return None

    def _mixin_add_go_back(self, schema_dict: dict[Any, Any]) -> dict[Any, Any]:
        """Append go_back toggle to schema dict when cancelling is enabled."""
        if self._on_cancel is not None:
            schema_dict[
                vol.Optional("go_back", default=False)
            ] = selector.BooleanSelector()
        return schema_dict

    async def _trigger_sensor_select(
        self,
        user_input: dict[str, Any] | None,
        *,
        step_id: str,
        next_step: Callable[[], Awaitable[ConfigFlowResult]],
        default_entities: list[str] | None = None,
    ) -> ConfigFlowResult:
        """Core logic for sensor entity selection.

        Accepts a single entity_id or a list of entity_ids.  When multiple
        entities are selected, uses the first one for attribute discovery.
        """
        errors: dict[str, str] = {}

        if user_input is not None:
            cancel = await self._mixin_check_go_back(user_input)
            if cancel is not None:
                return cancel

            raw = user_input[CONF_TRIGGER_ENTITY]
            # EntitySelector with multiple=True returns a list
            entity_ids = raw if isinstance(raw, list) else [raw]

            if not entity_ids:
                errors[CONF_TRIGGER_ENTITY] = "invalid_entity"
            else:
                # Validate first entity (used for attribute discovery)
                state = self.hass.states.get(entity_ids[0])
                if state is None:
                    errors[CONF_TRIGGER_ENTITY] = "invalid_entity"
                else:
                    self._trigger_entity_id = entity_ids[0]
                    self._trigger_entity_state = state
                    # Store all selected entity_ids for multi-entity support
                    if not hasattr(self, "_trigger_entity_ids"):
                        self._trigger_entity_ids = []
                    self._trigger_entity_ids = entity_ids
                    return await next_step()

        entity_key = (
            vol.Required(CONF_TRIGGER_ENTITY, default=default_entities)
            if default_entities
            else vol.Required(CONF_TRIGGER_ENTITY)
        )
        schema_dict: dict[Any, Any] = {
            entity_key: selector.EntitySelector(
                selector.EntitySelectorConfig(
                    domain=TRIGGER_ENTITY_DOMAINS,
                    multiple=True,
                )
            ),
        }
        return self.async_show_form(
            step_id=step_id,
            data_schema=vol.Schema(self._mixin_add_go_back(schema_dict)),
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
            cancel = await self._mixin_check_go_back(user_input)
            if cancel is not None:
                return cancel

            attr = user_input.get(CONF_TRIGGER_ATTRIBUTE, "_state")
            entity_ids = getattr(self, "_trigger_entity_ids", [self._trigger_entity_id])
            self._current_task["trigger_config"] = {
                "entity_id": entity_ids[0] if entity_ids else self._trigger_entity_id,
                "entity_ids": entity_ids,
                "attribute": None if attr == "_state" else attr,
            }
            return await next_step()

        # Build attribute options from entity
        state = self._trigger_entity_state
        if state is None:
            return self.async_abort(reason="entity_unavailable")
        options: list[selector.SelectOptionDict] = []

        # Add state value — always offer _state so that state_change and
        # runtime triggers work with non-numeric entities (e.g. input_boolean).
        unit = state.attributes.get("unit_of_measurement", "")
        options.append(
            selector.SelectOptionDict(
                value="_state",
                label=f"State: {state.state} {unit}".strip(),
            )
        )

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
                                domain=TRIGGER_ENTITY_DOMAINS,
                            )
                        ),
                    }
                ),
                errors={CONF_TRIGGER_ENTITY: "invalid_entity"},
            )

        current_state = state.state
        unit = state.attributes.get("unit_of_measurement", "")

        schema_dict: dict[Any, Any] = {
            vol.Required(
                CONF_TRIGGER_ATTRIBUTE, default="_state"
            ): selector.SelectSelector(
                selector.SelectSelectorConfig(
                    options=options,
                    mode=selector.SelectSelectorMode.LIST,
                )
            ),
        }
        return self.async_show_form(
            step_id=step_id,
            data_schema=vol.Schema(self._mixin_add_go_back(schema_dict)),
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
        compound_step: Callable[[], Awaitable[ConfigFlowResult]] | None = None,
    ) -> ConfigFlowResult:
        """Core logic for trigger type selection."""
        if user_input is not None:
            cancel = await self._mixin_check_go_back(user_input)
            if cancel is not None:
                return cancel

            trigger_type = user_input[CONF_TRIGGER_TYPE]
            self._current_task["trigger_config"]["type"] = trigger_type

            if trigger_type == TriggerType.THRESHOLD:
                return await threshold_step()
            if trigger_type == TriggerType.COUNTER:
                return await counter_step()
            if trigger_type == TriggerType.RUNTIME:
                return await runtime_step()
            if trigger_type == TriggerType.COMPOUND and compound_step:
                return await compound_step()
            return await state_change_step()

        trigger_options = [t.value for t in TriggerType]

        schema_dict: dict[Any, Any] = {
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
        return self.async_show_form(
            step_id=step_id,
            data_schema=vol.Schema(self._mixin_add_go_back(schema_dict)),
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
            cancel = await self._mixin_check_go_back(user_input)
            if cancel is not None:
                return cancel

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

                # Multi-entity: store entity_logic if multiple entities selected
                entity_ids = tc.get("entity_ids", [])
                if len(entity_ids) > 1:
                    tc[CONF_TRIGGER_ENTITY_LOGIC] = user_input.get(
                        CONF_TRIGGER_ENTITY_LOGIC, DEFAULT_ENTITY_LOGIC
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

        # Build schema fields
        schema_fields: dict[Any, Any] = {
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
        }

        # Add entity_logic selector when multiple entities are selected
        entity_ids = self._current_task.get("trigger_config", {}).get("entity_ids", [])
        if len(entity_ids) > 1:
            schema_fields[vol.Optional(
                CONF_TRIGGER_ENTITY_LOGIC, default=DEFAULT_ENTITY_LOGIC
            )] = selector.SelectSelector(
                selector.SelectSelectorConfig(
                    options=[
                        selector.SelectOptionDict(value="any", label="Any entity triggers"),
                        selector.SelectOptionDict(value="all", label="All entities must trigger"),
                    ],
                    mode=selector.SelectSelectorMode.LIST,
                    translation_key="entity_logic",
                )
            )

        schema_fields.update({
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
        })

        return self.async_show_form(
            step_id=step_id,
            data_schema=vol.Schema(self._mixin_add_go_back(schema_fields)),
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
            cancel = await self._mixin_check_go_back(user_input)
            if cancel is not None:
                return cancel

            tc = self._current_task["trigger_config"]
            tc[CONF_TRIGGER_TARGET_VALUE] = user_input[CONF_TRIGGER_TARGET_VALUE]
            tc[CONF_TRIGGER_DELTA_MODE] = user_input.get(CONF_TRIGGER_DELTA_MODE, False)

            # Multi-entity: store entity_logic if multiple entities selected
            entity_ids = tc.get("entity_ids", [])
            if len(entity_ids) > 1:
                tc[CONF_TRIGGER_ENTITY_LOGIC] = user_input.get(
                    CONF_TRIGGER_ENTITY_LOGIC, DEFAULT_ENTITY_LOGIC
                )

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

        schema_fields: dict[Any, Any] = {
            vol.Required(CONF_TRIGGER_TARGET_VALUE): selector.NumberSelector(
                selector.NumberSelectorConfig(
                    mode=selector.NumberSelectorMode.BOX,
                    step="any",
                )
            ),
            vol.Optional(
                CONF_TRIGGER_DELTA_MODE, default=False
            ): selector.BooleanSelector(),
        }

        # Add entity_logic selector when multiple entities are selected
        entity_ids = self._current_task.get("trigger_config", {}).get("entity_ids", [])
        if len(entity_ids) > 1:
            schema_fields[vol.Optional(
                CONF_TRIGGER_ENTITY_LOGIC, default=DEFAULT_ENTITY_LOGIC
            )] = selector.SelectSelector(
                selector.SelectSelectorConfig(
                    options=[
                        selector.SelectOptionDict(value="any", label="Any entity triggers"),
                        selector.SelectOptionDict(value="all", label="All entities must trigger"),
                    ],
                    mode=selector.SelectSelectorMode.LIST,
                    translation_key="entity_logic",
                )
            )

        schema_fields.update({
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
        })

        return self.async_show_form(
            step_id=step_id,
            data_schema=vol.Schema(self._mixin_add_go_back(schema_fields)),
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
            cancel = await self._mixin_check_go_back(user_input)
            if cancel is not None:
                return cancel

            tc = self._current_task["trigger_config"]
            if user_input.get(CONF_TRIGGER_FROM_STATE):
                tc[CONF_TRIGGER_FROM_STATE] = user_input[CONF_TRIGGER_FROM_STATE]
            if user_input.get(CONF_TRIGGER_TO_STATE):
                tc[CONF_TRIGGER_TO_STATE] = user_input[CONF_TRIGGER_TO_STATE]
            tc[CONF_TRIGGER_TARGET_CHANGES] = user_input.get(
                CONF_TRIGGER_TARGET_CHANGES, 1
            )

            # Multi-entity: store entity_logic if multiple entities selected
            entity_ids = tc.get("entity_ids", [])
            if len(entity_ids) > 1:
                tc[CONF_TRIGGER_ENTITY_LOGIC] = user_input.get(
                    CONF_TRIGGER_ENTITY_LOGIC, DEFAULT_ENTITY_LOGIC
                )

            self._current_task[CONF_TASK_SCHEDULE_TYPE] = ScheduleType.SENSOR_BASED
            interval = user_input.get(CONF_TASK_INTERVAL_DAYS)
            if interval and interval > 0:
                self._current_task[CONF_TASK_INTERVAL_DAYS] = interval
            self._current_task[CONF_TASK_WARNING_DAYS] = user_input.get(
                CONF_TASK_WARNING_DAYS, DEFAULT_WARNING_DAYS
            )

            return on_complete()

        schema_fields: dict[Any, Any] = {
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
        }

        # Add entity_logic selector when multiple entities are selected
        entity_ids = self._current_task.get("trigger_config", {}).get("entity_ids", [])
        if len(entity_ids) > 1:
            schema_fields[vol.Optional(
                CONF_TRIGGER_ENTITY_LOGIC, default=DEFAULT_ENTITY_LOGIC
            )] = selector.SelectSelector(
                selector.SelectSelectorConfig(
                    options=[
                        selector.SelectOptionDict(value="any", label="Any entity triggers"),
                        selector.SelectOptionDict(value="all", label="All entities must trigger"),
                    ],
                    mode=selector.SelectSelectorMode.LIST,
                    translation_key="entity_logic",
                )
            )

        schema_fields.update({
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
        })

        return self.async_show_form(
            step_id=step_id,
            data_schema=vol.Schema(self._mixin_add_go_back(schema_fields)),
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
            cancel = await self._mixin_check_go_back(user_input)
            if cancel is not None:
                return cancel

            tc = self._current_task["trigger_config"]
            tc[CONF_TRIGGER_RUNTIME_HOURS] = user_input[CONF_TRIGGER_RUNTIME_HOURS]

            # Parse comma-separated ON states
            raw_states = user_input.get(CONF_TRIGGER_ON_STATES, "")
            if raw_states and raw_states.strip():
                tc[CONF_TRIGGER_ON_STATES] = [
                    s.strip().lower()
                    for s in raw_states.split(",")
                    if s.strip()
                ]
            else:
                tc.pop(CONF_TRIGGER_ON_STATES, None)

            # Multi-entity: store entity_logic if multiple entities selected
            entity_ids = tc.get("entity_ids", [])
            if len(entity_ids) > 1:
                tc[CONF_TRIGGER_ENTITY_LOGIC] = user_input.get(
                    CONF_TRIGGER_ENTITY_LOGIC, DEFAULT_ENTITY_LOGIC
                )

            self._current_task[CONF_TASK_SCHEDULE_TYPE] = ScheduleType.SENSOR_BASED
            interval = user_input.get(CONF_TASK_INTERVAL_DAYS)
            if interval and interval > 0:
                self._current_task[CONF_TASK_INTERVAL_DAYS] = interval
            self._current_task[CONF_TASK_WARNING_DAYS] = user_input.get(
                CONF_TASK_WARNING_DAYS, DEFAULT_WARNING_DAYS
            )

            return on_complete()

        # Pre-fill existing custom states for editing
        current_tc = self._current_task.get("trigger_config", {})
        existing_states = current_tc.get(CONF_TRIGGER_ON_STATES)
        default_states = ", ".join(existing_states) if existing_states else ""

        schema_fields: dict[Any, Any] = {
            vol.Required(CONF_TRIGGER_RUNTIME_HOURS): selector.NumberSelector(
                selector.NumberSelectorConfig(
                    mode=selector.NumberSelectorMode.BOX,
                    step=1,
                    min=1,
                    max=100000,
                    unit_of_measurement="h",
                )
            ),
            vol.Optional(
                CONF_TRIGGER_ON_STATES, default=default_states
            ): selector.TextSelector(
                selector.TextSelectorConfig(
                    type=selector.TextSelectorType.TEXT,
                )
            ),
        }

        # Add entity_logic selector when multiple entities are selected
        entity_ids = self._current_task.get("trigger_config", {}).get("entity_ids", [])
        if len(entity_ids) > 1:
            schema_fields[vol.Optional(
                CONF_TRIGGER_ENTITY_LOGIC, default=DEFAULT_ENTITY_LOGIC
            )] = selector.SelectSelector(
                selector.SelectSelectorConfig(
                    options=[
                        selector.SelectOptionDict(value="any", label="Any entity triggers"),
                        selector.SelectOptionDict(value="all", label="All entities must trigger"),
                    ],
                    mode=selector.SelectSelectorMode.LIST,
                    translation_key="entity_logic",
                )
            )

        schema_fields.update({
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
        })

        return self.async_show_form(
            step_id=step_id,
            data_schema=vol.Schema(self._mixin_add_go_back(schema_fields)),
            description_placeholders={
                "entity_id": self._trigger_entity_id or "",
            },
        )

    # ------------------------------------------------------------------
    # Compound trigger configuration steps
    # ------------------------------------------------------------------

    async def _trigger_compound_logic(
        self,
        user_input: dict[str, Any] | None,
        *,
        step_id: str,
        next_step: Callable[[], Awaitable[ConfigFlowResult]],
    ) -> ConfigFlowResult:
        """Select compound trigger logic (AND/OR)."""
        if user_input is not None:
            cancel = await self._mixin_check_go_back(user_input)
            if cancel is not None:
                return cancel

            logic = user_input.get(CONF_COMPOUND_LOGIC, "AND").upper()
            self._current_task["trigger_config"] = {
                "type": TriggerType.COMPOUND,
                CONF_COMPOUND_LOGIC: logic,
                CONF_COMPOUND_CONDITIONS: [],
            }
            if not hasattr(self, "_compound_conditions"):
                self._compound_conditions: list[dict[str, Any]] = []
            self._compound_conditions = []
            self._compound_logic = logic
            return await next_step()

        schema_dict: dict[Any, Any] = {
            vol.Required(
                CONF_COMPOUND_LOGIC, default="and"
            ): selector.SelectSelector(
                selector.SelectSelectorConfig(
                    options=[
                        selector.SelectOptionDict(
                            value="and",
                            label="AND (all conditions must trigger)",
                        ),
                        selector.SelectOptionDict(
                            value="or",
                            label="OR (any condition triggers)",
                        ),
                    ],
                    mode=selector.SelectSelectorMode.LIST,
                    translation_key="compound_logic",
                )
            ),
        }
        return self.async_show_form(
            step_id=step_id,
            data_schema=vol.Schema(self._mixin_add_go_back(schema_dict)),
        )

    async def _trigger_compound_condition_entity(
        self,
        user_input: dict[str, Any] | None,
        *,
        step_id: str,
        next_step: Callable[[], Awaitable[ConfigFlowResult]],
    ) -> ConfigFlowResult:
        """Select entity for a compound condition."""
        errors: dict[str, str] = {}

        if user_input is not None:
            cancel = await self._mixin_check_go_back(user_input)
            if cancel is not None:
                return cancel

            raw = user_input[CONF_TRIGGER_ENTITY]
            entity_ids = raw if isinstance(raw, list) else [raw]
            if not entity_ids:
                errors[CONF_TRIGGER_ENTITY] = "invalid_entity"
            else:
                state = self.hass.states.get(entity_ids[0])
                if state is None:
                    errors[CONF_TRIGGER_ENTITY] = "invalid_entity"
                else:
                    self._trigger_entity_id = entity_ids[0]
                    self._trigger_entity_state = state
                    self._trigger_entity_ids = entity_ids
                    self._current_compound_condition = {
                        "entity_id": entity_ids[0],
                        "entity_ids": entity_ids,
                    }
                    return await next_step()

        cond_num = len(getattr(self, "_compound_conditions", [])) + 1
        schema_dict: dict[Any, Any] = {
            vol.Required(CONF_TRIGGER_ENTITY): selector.EntitySelector(
                selector.EntitySelectorConfig(
                    domain=["sensor", "binary_sensor", "number",
                            "input_number", "input_boolean", "switch"],
                    multiple=True,
                )
            ),
        }
        return self.async_show_form(
            step_id=step_id,
            data_schema=vol.Schema(self._mixin_add_go_back(schema_dict)),
            errors=errors,
            description_placeholders={"condition_num": str(cond_num)},
        )

    async def _trigger_compound_condition_type(
        self,
        user_input: dict[str, Any] | None,
        *,
        step_id: str,
        threshold_step: Callable[[], Awaitable[ConfigFlowResult]],
        counter_step: Callable[[], Awaitable[ConfigFlowResult]],
        state_change_step: Callable[[], Awaitable[ConfigFlowResult]],
        runtime_step: Callable[[], Awaitable[ConfigFlowResult]],
    ) -> ConfigFlowResult:
        """Select trigger type for a compound condition."""
        if user_input is not None:
            cancel = await self._mixin_check_go_back(user_input)
            if cancel is not None:
                return cancel

            trigger_type = user_input[CONF_TRIGGER_TYPE]
            self._current_compound_condition["type"] = trigger_type

            if trigger_type == TriggerType.THRESHOLD:
                return await threshold_step()
            if trigger_type == TriggerType.COUNTER:
                return await counter_step()
            if trigger_type == TriggerType.RUNTIME:
                return await runtime_step()
            return await state_change_step()

        trigger_options = [
            t.value for t in TriggerType if t != TriggerType.COMPOUND
        ]

        schema_dict: dict[Any, Any] = {
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
        return self.async_show_form(
            step_id=step_id,
            data_schema=vol.Schema(self._mixin_add_go_back(schema_dict)),
        )

    async def _trigger_compound_condition_config(
        self,
        user_input: dict[str, Any] | None,
        condition_type: str,
        *,
        step_id: str,
        on_complete: Callable[[], Awaitable[ConfigFlowResult]],
    ) -> ConfigFlowResult:
        """Configure a compound condition's type-specific settings."""
        cond = self._current_compound_condition

        if user_input is not None:
            cancel = await self._mixin_check_go_back(user_input)
            if cancel is not None:
                return cancel

            if condition_type == TriggerType.THRESHOLD:
                above = user_input.get(CONF_TRIGGER_ABOVE)
                below = user_input.get(CONF_TRIGGER_BELOW)
                if above is not None:
                    cond["trigger_above"] = above
                if below is not None:
                    cond["trigger_below"] = below
                for_min = user_input.get(CONF_TRIGGER_FOR_MINUTES)
                if for_min:
                    cond["trigger_for_minutes"] = for_min
            elif condition_type == TriggerType.COUNTER:
                cond["trigger_target_value"] = user_input.get(
                    CONF_TRIGGER_TARGET_VALUE, 0
                )
                cond["trigger_delta_mode"] = user_input.get(
                    CONF_TRIGGER_DELTA_MODE, False
                )
            elif condition_type == TriggerType.STATE_CHANGE:
                if user_input.get(CONF_TRIGGER_FROM_STATE):
                    cond["trigger_from_state"] = user_input[CONF_TRIGGER_FROM_STATE]
                if user_input.get(CONF_TRIGGER_TO_STATE):
                    cond["trigger_to_state"] = user_input[CONF_TRIGGER_TO_STATE]
                cond["trigger_target_changes"] = user_input.get(
                    CONF_TRIGGER_TARGET_CHANGES, 1
                )
            elif condition_type == TriggerType.RUNTIME:
                cond["trigger_runtime_hours"] = user_input[CONF_TRIGGER_RUNTIME_HOURS]
                raw_states = user_input.get(CONF_TRIGGER_ON_STATES, "")
                if raw_states and raw_states.strip():
                    cond["trigger_on_states"] = [
                        s.strip().lower() for s in raw_states.split(",") if s.strip()
                    ]

            entity_ids = cond.get("entity_ids", [])
            if len(entity_ids) > 1 and user_input.get(CONF_TRIGGER_ENTITY_LOGIC):
                cond["entity_logic"] = user_input[CONF_TRIGGER_ENTITY_LOGIC]

            self._compound_conditions.append(cond)
            self._current_compound_condition = {}
            return await on_complete()

        schema_fields: dict[Any, Any] = {}
        if condition_type == TriggerType.THRESHOLD:
            schema_fields = {
                vol.Optional(CONF_TRIGGER_ABOVE): selector.NumberSelector(
                    selector.NumberSelectorConfig(
                        mode=selector.NumberSelectorMode.BOX
                    )
                ),
                vol.Optional(CONF_TRIGGER_BELOW): selector.NumberSelector(
                    selector.NumberSelectorConfig(
                        mode=selector.NumberSelectorMode.BOX
                    )
                ),
                vol.Optional(
                    CONF_TRIGGER_FOR_MINUTES, default=0
                ): selector.NumberSelector(
                    selector.NumberSelectorConfig(
                        min=0, max=1440, step=1,
                        mode=selector.NumberSelectorMode.BOX,
                        unit_of_measurement="min",
                    )
                ),
            }
        elif condition_type == TriggerType.COUNTER:
            schema_fields = {
                vol.Required(CONF_TRIGGER_TARGET_VALUE): selector.NumberSelector(
                    selector.NumberSelectorConfig(
                        mode=selector.NumberSelectorMode.BOX
                    )
                ),
                vol.Optional(
                    CONF_TRIGGER_DELTA_MODE, default=False
                ): selector.BooleanSelector(),
            }
        elif condition_type == TriggerType.STATE_CHANGE:
            schema_fields = {
                vol.Optional(CONF_TRIGGER_FROM_STATE): selector.TextSelector(
                    selector.TextSelectorConfig(type=selector.TextSelectorType.TEXT)
                ),
                vol.Optional(CONF_TRIGGER_TO_STATE): selector.TextSelector(
                    selector.TextSelectorConfig(type=selector.TextSelectorType.TEXT)
                ),
                vol.Required(
                    CONF_TRIGGER_TARGET_CHANGES, default=1
                ): selector.NumberSelector(
                    selector.NumberSelectorConfig(
                        min=1, max=10000, step=1,
                        mode=selector.NumberSelectorMode.BOX,
                    )
                ),
            }
        elif condition_type == TriggerType.RUNTIME:
            schema_fields = {
                vol.Required(CONF_TRIGGER_RUNTIME_HOURS): selector.NumberSelector(
                    selector.NumberSelectorConfig(
                        mode=selector.NumberSelectorMode.BOX,
                        step=1, min=1, max=100000,
                        unit_of_measurement="h",
                    )
                ),
                vol.Optional(CONF_TRIGGER_ON_STATES, default=""): selector.TextSelector(
                    selector.TextSelectorConfig(type=selector.TextSelectorType.TEXT)
                ),
            }

        entity_ids = cond.get("entity_ids", [])
        if len(entity_ids) > 1:
            schema_fields[vol.Optional(
                CONF_TRIGGER_ENTITY_LOGIC, default=DEFAULT_ENTITY_LOGIC
            )] = selector.SelectSelector(
                selector.SelectSelectorConfig(
                    options=[
                        selector.SelectOptionDict(value="any", label="Any entity triggers"),
                        selector.SelectOptionDict(value="all", label="All entities must trigger"),
                    ],
                    mode=selector.SelectSelectorMode.LIST,
                    translation_key="entity_logic",
                )
            )

        return self.async_show_form(
            step_id=step_id,
            data_schema=vol.Schema(self._mixin_add_go_back(schema_fields)),
        )

    async def _trigger_compound_review(
        self,
        user_input: dict[str, Any] | None,
        *,
        step_id: str,
        add_condition_step: Callable[[], Awaitable[ConfigFlowResult]],
        on_complete: Callable[[], ConfigFlowResult],
    ) -> ConfigFlowResult:
        """Review compound trigger conditions and optionally add more."""
        if user_input is not None:
            cancel = await self._mixin_check_go_back(user_input)
            if cancel is not None:
                return cancel

            action = user_input.get("compound_action", "finish")
            if action == "add":
                return await add_condition_step()

            tc = self._current_task["trigger_config"]
            tc[CONF_COMPOUND_CONDITIONS] = list(self._compound_conditions)
            tc[CONF_COMPOUND_LOGIC] = self._compound_logic
            self._current_task[CONF_TASK_SCHEDULE_TYPE] = ScheduleType.SENSOR_BASED
            return on_complete()

        condition_count = len(self._compound_conditions)
        logic = getattr(self, "_compound_logic", "AND")

        options = [
            selector.SelectOptionDict(
                value="finish",
                label=f"Finish ({condition_count} conditions, {logic})",
            ),
        ]
        if condition_count < 5:
            options.append(
                selector.SelectOptionDict(
                    value="add",
                    label="Add another condition",
                ),
            )

        schema_dict: dict[Any, Any] = {
            vol.Required(
                "compound_action", default="finish"
            ): selector.SelectSelector(
                selector.SelectSelectorConfig(
                    options=options,
                    mode=selector.SelectSelectorMode.LIST,
                )
            ),
        }
        return self.async_show_form(
            step_id=step_id,
            data_schema=vol.Schema(self._mixin_add_go_back(schema_dict)),
            description_placeholders={
                "condition_count": str(condition_count),
                "compound_logic": logic,
            },
        )
