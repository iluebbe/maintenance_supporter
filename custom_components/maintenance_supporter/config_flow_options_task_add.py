"""Add-task + schedule-kind steps (mixin).

Thin wrappers: the step content lives in config_flow_schedule.ScheduleStepsMixin,
shared verbatim with the setup wizard (config_flow.py) so the two can't drift.
"""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

from homeassistant.config_entries import ConfigFlowResult

from .config_flow_schedule import ScheduleStepsMixin

if TYPE_CHECKING:
    from collections.abc import Awaitable, Callable

    from homeassistant.core import HomeAssistant


class AddTaskMixin(ScheduleStepsMixin):
    """Add a new task and pick its schedule kind."""

    # -- provided by the assembled MaintenanceOptionsFlow --
    if TYPE_CHECKING:
        hass: HomeAssistant
        _on_cancel: Callable[[], ConfigFlowResult | Awaitable[ConfigFlowResult]] | None

        def _save_new_task(self) -> ConfigFlowResult: ...
        def _show_init_menu(self) -> ConfigFlowResult: ...
        def async_show_form(self, **kwargs: Any) -> ConfigFlowResult: ...
        async def async_step_opt_sensor_select(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult: ...

    def _wire_add_task_callbacks(self) -> None:
        """Route the sensor-trigger sub-flow's completion/cancel to this flow."""
        self._trigger_on_complete = self._save_new_task
        self._on_cancel = self._show_init_menu

    async def async_step_add_task(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Add a new task — step 1: name, type, schedule."""
        return await self._schedule_add_task(
            user_input,
            step_id="add_task",
            on_go_back=self._show_init_menu,
            time_based_step=self.async_step_opt_time_based,
            calendar_step=self.async_step_opt_calendar,
            sensor_step=self.async_step_opt_sensor_select,
            one_time_step=self.async_step_opt_one_time,
            manual_step=self.async_step_opt_manual,
            before_dispatch=self._wire_add_task_callbacks,
        )

    async def async_step_opt_time_based(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Configure time-based schedule for new task."""
        return await self._schedule_time_based(
            user_input,
            step_id="opt_time_based",
            on_go_back=self._show_init_menu,
            on_complete=self._save_new_task,
        )

    async def async_step_opt_calendar(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Configure a calendar recurrence kind for a new task."""
        return await self._schedule_calendar(
            user_input,
            step_id="opt_calendar",
            on_go_back=self._show_init_menu,
            on_complete=self._save_new_task,
        )

    async def async_step_opt_one_time(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Configure a one-time (non-recurring) task for new task."""
        return await self._schedule_one_time(
            user_input,
            step_id="opt_one_time",
            on_go_back=self._show_init_menu,
            on_complete=self._save_new_task,
        )

    async def async_step_opt_manual(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Configure manual schedule for new task."""
        return await self._schedule_manual(
            user_input,
            step_id="opt_manual",
            on_go_back=self._show_init_menu,
            on_complete=self._save_new_task,
        )
