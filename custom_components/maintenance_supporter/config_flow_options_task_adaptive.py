"""Adaptive-scheduling step + schema (mixin)."""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

import voluptuous as vol
from homeassistant.config_entries import ConfigFlowResult
from homeassistant.helpers import selector

from .const import (
    CONF_ADAPTIVE_CONFIG,
    CONF_ADAPTIVE_ENABLED,
    CONF_ADAPTIVE_EWA_ALPHA,
    CONF_ADAPTIVE_MAX_INTERVAL,
    CONF_ADAPTIVE_MIN_INTERVAL,
    CONF_ENVIRONMENTAL_ENTITY,
    CONF_SENSOR_PREDICTION_ENABLED,
    CONF_TASKS,
    DEFAULT_ADAPTIVE_EWA_ALPHA,
    DEFAULT_ADAPTIVE_MAX_INTERVAL,
    DEFAULT_ADAPTIVE_MIN_INTERVAL,
)
from .helpers.schedule import (
    read_legacy_fields,
)

if TYPE_CHECKING:
    from homeassistant.config_entries import ConfigEntry

class AdaptiveMixin:
    """Adaptive scheduling configuration."""

    # -- provided by the assembled MaintenanceOptionsFlow --
    if TYPE_CHECKING:
        config_entry: ConfigEntry
        _selected_task_id: str | None
        def _show_task_action_menu(self) -> ConfigFlowResult: ...
        def _update_config_entry(self, new_data: dict[str, Any]) -> None: ...
        def async_show_form(self, **kwargs: Any) -> ConfigFlowResult: ...

    async def async_step_adaptive_scheduling(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Configure adaptive scheduling for a task."""
        # Read adaptive_config from Store (merged) data
        rd = getattr(self.config_entry, "runtime_data", None)
        store = getattr(rd, "store", None) if rd else None
        tasks_data = self.config_entry.data.get(CONF_TASKS, {})
        task = tasks_data.get(self._selected_task_id or "", {})
        if store is not None:
            current_adaptive = store.get_adaptive_config(self._selected_task_id or "") or {}
        else:
            current_adaptive = task.get(CONF_ADAPTIVE_CONFIG, {})

        if user_input is not None:
            if user_input.get("go_back"):
                return self._show_task_action_menu()

            enabled = user_input.get(CONF_ADAPTIVE_ENABLED, False)
            adaptive_config: dict[str, Any] = dict(current_adaptive)
            adaptive_config["enabled"] = enabled
            adaptive_config[CONF_ADAPTIVE_EWA_ALPHA] = user_input.get(
                CONF_ADAPTIVE_EWA_ALPHA, DEFAULT_ADAPTIVE_EWA_ALPHA
            )
            min_iv = int(
                user_input.get(CONF_ADAPTIVE_MIN_INTERVAL, DEFAULT_ADAPTIVE_MIN_INTERVAL)
            )
            max_iv = int(
                user_input.get(CONF_ADAPTIVE_MAX_INTERVAL, DEFAULT_ADAPTIVE_MAX_INTERVAL)
            )
            if min_iv > max_iv:
                return self.async_show_form(
                    step_id="adaptive_scheduling",
                    data_schema=self._adaptive_schema(current_adaptive, task),
                    errors={CONF_ADAPTIVE_MIN_INTERVAL: "min_exceeds_max"},
                )
            adaptive_config[CONF_ADAPTIVE_MIN_INTERVAL] = min_iv
            adaptive_config[CONF_ADAPTIVE_MAX_INTERVAL] = max_iv
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
                base = read_legacy_fields(task)["interval_days"]
                adaptive_config["base_interval"] = base if base is not None else 30

            if store is not None:
                store.set_adaptive_config(self._selected_task_id or "", adaptive_config)
                store.async_delay_save()
            else:
                # Legacy: write to ConfigEntry.data
                new_data = dict(self.config_entry.data)
                new_tasks = dict(new_data.get(CONF_TASKS, {}))
                updated_task = dict(new_tasks.get(self._selected_task_id or "", {}))
                updated_task[CONF_ADAPTIVE_CONFIG] = adaptive_config
                new_tasks[self._selected_task_id or ""] = updated_task
                new_data[CONF_TASKS] = new_tasks
                self._update_config_entry(new_data)

            return self._show_task_action_menu()

        return self.async_show_form(
            step_id="adaptive_scheduling",
            data_schema=self._adaptive_schema(current_adaptive, task),
            description_placeholders={
                "task_name": task.get("name", ""),
            },
        )

    def _adaptive_schema(
        self,
        current_adaptive: dict[str, Any],
        task: dict[str, Any],
    ) -> vol.Schema:
        """Build the adaptive scheduling form schema."""
        env_entity = current_adaptive.get("environmental_entity")
        env_key = (
            vol.Optional(CONF_ENVIRONMENTAL_ENTITY, default=env_entity)
            if env_entity
            else vol.Optional(CONF_ENVIRONMENTAL_ENTITY)
        )
        return vol.Schema(
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
                env_key: selector.EntitySelector(
                    selector.EntitySelectorConfig(
                        domain=["sensor"],
                        device_class=["temperature", "humidity", "pressure"],
                        multiple=False,
                    )
                ),
                vol.Optional(
                    "go_back", default=False
                ): selector.BooleanSelector(),
            }
        )
