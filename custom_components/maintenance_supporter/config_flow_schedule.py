"""Shared add-task + schedule-kind steps for BOTH task-creation flows.

The initial setup wizard (config_flow.py) and the options flow's add-task
path (config_flow_options_task_add.py) present the same five steps — add_task,
time-based, calendar, one-time, manual. They used to be hand-copied twins and
drifted four ways (the setup flow was missing reading_unit, interval_anchor,
the calendar last_performed field, and crashed on a None interval; the options
flow collected reading_unit but its save path dropped it). This mixin is the
single source, parameterized by step_id / go-back / completion exactly like
TriggerConfigMixin.
"""

from __future__ import annotations

import inspect
from typing import TYPE_CHECKING, Any, cast
from uuid import uuid4

import voluptuous as vol
from homeassistant.config_entries import ConfigFlowResult
from homeassistant.helpers import selector

from .config_flow_helpers import (
    CALENDAR_KIND_VALUES,
    apply_interval_unit,
    calendar_schema,
    interval_anchor_selector,
    interval_unit_selector,
    schedule_from_calendar_input,
)
from .const import (
    CONF_TASK_DUE_DATE,
    CONF_TASK_ICON,
    CONF_TASK_INTERVAL_ANCHOR,
    CONF_TASK_INTERVAL_DAYS,
    CONF_TASK_INTERVAL_UNIT,
    CONF_TASK_LABELS_TEXT,
    CONF_TASK_NAME,
    CONF_TASK_NOTES,
    CONF_TASK_PRIORITY,
    CONF_TASK_READING_UNIT,
    CONF_TASK_SCHEDULE_TYPE,
    CONF_TASK_TYPE,
    CONF_TASK_WARNING_DAYS,
    DEFAULT_INTERVAL_DAYS,
    MaintenanceTypeEnum,
    ScheduleType,
)
from .helpers.global_options import get_default_warning_days
from .helpers.schedule import KIND_WEEKDAYS
from .helpers.task_fields import INTERVAL_DAYS_RANGE, TASK_PRIORITIES, WARNING_DAYS_RANGE

if TYPE_CHECKING:
    from collections.abc import Awaitable, Callable

    from homeassistant.core import HomeAssistant

async def _resolve(result: Any) -> ConfigFlowResult:
    """Await a step-callback result when it is a coroutine — a callback may be
    sync (options-flow menu helpers) or async (setup-flow step methods), the
    same contract as TriggerConfigMixin's _on_cancel."""
    if inspect.isawaitable(result):
        result = await result
    return cast("ConfigFlowResult", result)


def _warning_days_field(hass: HomeAssistant) -> dict[Any, Any]:
    """The warning-days entry every schedule-kind step ends with."""
    return {
        vol.Optional(
            CONF_TASK_WARNING_DAYS,
            default=get_default_warning_days(hass),
        ): selector.NumberSelector(
            selector.NumberSelectorConfig(
                min=WARNING_DAYS_RANGE[0], max=WARNING_DAYS_RANGE[1], step=1, mode=selector.NumberSelectorMode.BOX
            )
        )
    }


def _go_back_field() -> dict[Any, Any]:
    return {vol.Optional("go_back", default=False): selector.BooleanSelector()}


class ScheduleStepsMixin:
    """Shared implementations of the five task-creation schedule steps."""

    # -- provided by the assembling flow class --
    if TYPE_CHECKING:
        hass: HomeAssistant
        _current_task: dict[str, Any]

        def async_show_form(self, **kwargs: Any) -> ConfigFlowResult: ...

    async def _schedule_add_task(
        self,
        user_input: dict[str, Any] | None,
        *,
        step_id: str,
        on_go_back: Callable[[], Any],
        time_based_step: Callable[[], Awaitable[ConfigFlowResult]],
        calendar_step: Callable[[], Awaitable[ConfigFlowResult]],
        sensor_step: Callable[[], Awaitable[ConfigFlowResult]],
        one_time_step: Callable[[], Awaitable[ConfigFlowResult]],
        manual_step: Callable[[], Awaitable[ConfigFlowResult]],
        before_dispatch: Callable[[], None] | None = None,
        seed_id: bool = False,
        description_placeholders: dict[str, str] | None = None,
    ) -> ConfigFlowResult:
        """Step 1 of a new task: name, type, schedule kind + secondary fields."""
        if user_input is not None:
            if user_input.get("go_back"):
                return await _resolve(on_go_back())

            self._current_task = {
                CONF_TASK_NAME: user_input[CONF_TASK_NAME],
                CONF_TASK_TYPE: user_input.get(CONF_TASK_TYPE, MaintenanceTypeEnum.CLEANING),
                CONF_TASK_SCHEDULE_TYPE: user_input[CONF_TASK_SCHEDULE_TYPE],
            }
            if seed_id:
                self._current_task["id"] = uuid4().hex
            if user_input.get(CONF_TASK_ICON):
                self._current_task[CONF_TASK_ICON] = user_input[CONF_TASK_ICON]
            if user_input.get(CONF_TASK_PRIORITY):
                self._current_task[CONF_TASK_PRIORITY] = user_input[CONF_TASK_PRIORITY]
            if user_input.get(CONF_TASK_LABELS_TEXT):
                self._current_task[CONF_TASK_LABELS_TEXT] = user_input[CONF_TASK_LABELS_TEXT]
            if user_input.get(CONF_TASK_READING_UNIT):
                self._current_task[CONF_TASK_READING_UNIT] = user_input[CONF_TASK_READING_UNIT].strip()

            if before_dispatch is not None:
                before_dispatch()

            schedule = user_input[CONF_TASK_SCHEDULE_TYPE]
            if schedule == ScheduleType.TIME_BASED:
                return await time_based_step()
            if schedule in CALENDAR_KIND_VALUES:
                return await calendar_step()
            if schedule == ScheduleType.SENSOR_BASED:
                return await sensor_step()
            if schedule == ScheduleType.ONE_TIME:
                return await one_time_step()
            return await manual_step()

        type_options = [t.value for t in MaintenanceTypeEnum]
        # Recurrence kinds: time-based, the calendar kinds, then the
        # trigger/one-time/manual kinds.
        schedule_options = [
            ScheduleType.TIME_BASED,
            *CALENDAR_KIND_VALUES,
            ScheduleType.SENSOR_BASED,
            ScheduleType.ONE_TIME,
            ScheduleType.MANUAL,
        ]

        return self.async_show_form(
            step_id=step_id,
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_TASK_NAME): selector.TextSelector(
                        selector.TextSelectorConfig(type=selector.TextSelectorType.TEXT)
                    ),
                    vol.Required(CONF_TASK_TYPE, default=MaintenanceTypeEnum.CLEANING): selector.SelectSelector(
                        selector.SelectSelectorConfig(
                            options=type_options,
                            mode=selector.SelectSelectorMode.DROPDOWN,
                            translation_key="maintenance_type",
                        )
                    ),
                    vol.Required(CONF_TASK_SCHEDULE_TYPE, default=ScheduleType.TIME_BASED): selector.SelectSelector(
                        selector.SelectSelectorConfig(
                            options=schedule_options,
                            mode=selector.SelectSelectorMode.LIST,
                            translation_key="schedule_type",
                        )
                    ),
                    vol.Optional(CONF_TASK_ICON): selector.IconSelector(),
                    vol.Optional(CONF_TASK_PRIORITY, default="normal"): selector.SelectSelector(
                        selector.SelectSelectorConfig(
                            options=list(TASK_PRIORITIES),
                            mode=selector.SelectSelectorMode.DROPDOWN,
                            translation_key="task_priority",
                        )
                    ),
                    vol.Optional(CONF_TASK_LABELS_TEXT): selector.TextSelector(
                        selector.TextSelectorConfig(type=selector.TextSelectorType.TEXT)
                    ),
                    # v2.20 (#83): unit for `reading`-type tasks ("kWh", "m³").
                    vol.Optional(CONF_TASK_READING_UNIT): selector.TextSelector(
                        selector.TextSelectorConfig(type=selector.TextSelectorType.TEXT)
                    ),
                    **_go_back_field(),
                }
            ),
            description_placeholders=description_placeholders,
        )

    async def _schedule_time_based(
        self,
        user_input: dict[str, Any] | None,
        *,
        step_id: str,
        on_go_back: Callable[[], Any],
        on_complete: Callable[[], Any],
    ) -> ConfigFlowResult:
        """Interval schedule: interval + unit + anchor + backdated last done."""
        errors: dict[str, str] = {}

        if user_input is not None:
            if user_input.get("go_back"):
                return await _resolve(on_go_back())

            interval = user_input.get(CONF_TASK_INTERVAL_DAYS)
            if not interval or interval <= 0:
                errors[CONF_TASK_INTERVAL_DAYS] = "invalid_interval"
            else:
                self._current_task[CONF_TASK_INTERVAL_DAYS] = interval
                apply_interval_unit(self._current_task, user_input)
                self._current_task[CONF_TASK_WARNING_DAYS] = user_input.get(
                    CONF_TASK_WARNING_DAYS, get_default_warning_days(self.hass)
                )
                self._current_task[CONF_TASK_INTERVAL_ANCHOR] = user_input.get(CONF_TASK_INTERVAL_ANCHOR, "completion")
                last_performed = user_input.get("last_performed")
                if last_performed:
                    self._current_task["last_performed"] = str(last_performed)

                return await _resolve(on_complete())

        return self.async_show_form(
            step_id=step_id,
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_TASK_INTERVAL_DAYS, default=DEFAULT_INTERVAL_DAYS): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            min=INTERVAL_DAYS_RANGE[0], max=INTERVAL_DAYS_RANGE[1], step=1, mode=selector.NumberSelectorMode.BOX
                        )
                    ),
                    vol.Optional(CONF_TASK_INTERVAL_UNIT, default="days"): interval_unit_selector(),
                    vol.Optional(CONF_TASK_INTERVAL_ANCHOR, default="completion"): interval_anchor_selector(),
                    vol.Optional("last_performed"): selector.DateSelector(),
                    **_warning_days_field(self.hass),
                    **_go_back_field(),
                }
            ),
            errors=errors,
        )

    async def _schedule_calendar(
        self,
        user_input: dict[str, Any] | None,
        *,
        step_id: str,
        on_go_back: Callable[[], Any],
        on_complete: Callable[[], Any],
    ) -> ConfigFlowResult:
        """Calendar recurrence kind (weekdays / nth_weekday / day_of_month)."""
        errors: dict[str, str] = {}
        kind = self._current_task.get(CONF_TASK_SCHEDULE_TYPE, KIND_WEEKDAYS)

        if user_input is not None:
            if user_input.get("go_back"):
                return await _resolve(on_go_back())
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
                return await _resolve(on_complete())

        schema = calendar_schema(kind).extend(
            {
                vol.Optional("last_performed"): selector.DateSelector(),
                **_warning_days_field(self.hass),
                **_go_back_field(),
            }
        )
        return self.async_show_form(
            step_id=step_id,
            data_schema=schema,
            errors=errors,
            description_placeholders={"kind": kind},
        )

    async def _schedule_one_time(
        self,
        user_input: dict[str, Any] | None,
        *,
        step_id: str,
        on_go_back: Callable[[], Any],
        on_complete: Callable[[], Any],
    ) -> ConfigFlowResult:
        """One-time (non-recurring) task: a due date."""
        errors: dict[str, str] = {}

        if user_input is not None:
            if user_input.get("go_back"):
                return await _resolve(on_go_back())

            due_date = user_input.get(CONF_TASK_DUE_DATE)
            if not due_date:
                errors[CONF_TASK_DUE_DATE] = "invalid_due_date"
            else:
                self._current_task[CONF_TASK_DUE_DATE] = str(due_date)
                self._current_task[CONF_TASK_WARNING_DAYS] = user_input.get(
                    CONF_TASK_WARNING_DAYS, get_default_warning_days(self.hass)
                )
                return await _resolve(on_complete())

        return self.async_show_form(
            step_id=step_id,
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_TASK_DUE_DATE): selector.DateSelector(),
                    **_warning_days_field(self.hass),
                    **_go_back_field(),
                }
            ),
            errors=errors,
        )

    async def _schedule_manual(
        self,
        user_input: dict[str, Any] | None,
        *,
        step_id: str,
        on_go_back: Callable[[], Any],
        on_complete: Callable[[], Any],
    ) -> ConfigFlowResult:
        """Manual schedule: no recurrence, optional notes."""
        if user_input is not None:
            if user_input.get("go_back"):
                return await _resolve(on_go_back())

            self._current_task[CONF_TASK_SCHEDULE_TYPE] = ScheduleType.MANUAL
            self._current_task[CONF_TASK_WARNING_DAYS] = user_input.get(
                CONF_TASK_WARNING_DAYS, get_default_warning_days(self.hass)
            )
            if user_input.get(CONF_TASK_NOTES):
                self._current_task[CONF_TASK_NOTES] = user_input[CONF_TASK_NOTES]

            return await _resolve(on_complete())

        return self.async_show_form(
            step_id=step_id,
            data_schema=vol.Schema(
                {
                    **_warning_days_field(self.hass),
                    vol.Optional(CONF_TASK_NOTES): selector.TextSelector(
                        selector.TextSelectorConfig(type=selector.TextSelectorType.TEXT, multiline=True)
                    ),
                    **_go_back_field(),
                }
            ),
        )


def build_new_task_record(
    current_task: dict[str, Any],
    *,
    task_id: str,
    object_id: str,
    hass: HomeAssistant,
    seed_history: bool = False,
    include_last_performed: bool = False,
) -> dict[str, Any]:
    """Build the persisted record for a task created by either flow.

    The setup wizard and the options flow used to hand-copy this field map and
    drifted (the setup flow never wrote reading_unit/interval_anchor, the
    options flow dropped reading_unit). ``seed_history`` keeps the setup
    wizard's explicit empty history and ``include_last_performed`` its
    last_performed-in-entry-data seeding — during setup no Store exists yet, so
    dynamic state must ride entry.data; the options flow initializes both via
    the live Store instead.
    """
    from homeassistant.util import dt as dt_util

    from .helpers.sanitize import cap_task_fields, parse_labels_text

    task_data: dict[str, Any] = {
        "id": task_id,
        "object_id": object_id,
        "name": current_task.get(CONF_TASK_NAME, ""),
        "type": current_task.get(CONF_TASK_TYPE, MaintenanceTypeEnum.CUSTOM),
        "enabled": True,
        "schedule_type": current_task.get(CONF_TASK_SCHEDULE_TYPE, ScheduleType.TIME_BASED),
        "warning_days": current_task.get(CONF_TASK_WARNING_DAYS, get_default_warning_days(hass)),
        # Anchor for next_due fallback when last_performed is None (issue #30).
        "created_at": dt_util.now().date().isoformat(),
    }
    if seed_history:
        task_data["history"] = []

    # Calendar kinds carry a pre-built nested schedule; normalization treats it
    # as authoritative over the flat fields.
    if "schedule" in current_task:
        task_data["schedule"] = current_task["schedule"]

    if CONF_TASK_INTERVAL_DAYS in current_task:
        task_data["interval_days"] = int(current_task[CONF_TASK_INTERVAL_DAYS])
    if CONF_TASK_INTERVAL_UNIT in current_task:
        task_data["interval_unit"] = current_task[CONF_TASK_INTERVAL_UNIT]
    if CONF_TASK_DUE_DATE in current_task:
        task_data["due_date"] = current_task[CONF_TASK_DUE_DATE]
    anchor = current_task.get(CONF_TASK_INTERVAL_ANCHOR, "completion")
    if anchor != "completion":
        task_data["interval_anchor"] = anchor
    if include_last_performed and "last_performed" in current_task:
        task_data["last_performed"] = current_task["last_performed"]
    if "trigger_config" in current_task:
        task_data["trigger_config"] = current_task["trigger_config"]
    if CONF_TASK_NOTES in current_task:
        task_data["notes"] = current_task[CONF_TASK_NOTES]
    if CONF_TASK_ICON in current_task:
        task_data["custom_icon"] = current_task[CONF_TASK_ICON]
    if CONF_TASK_PRIORITY in current_task:
        task_data["priority"] = current_task[CONF_TASK_PRIORITY]
    if current_task.get(CONF_TASK_LABELS_TEXT):
        task_data["labels"] = parse_labels_text(current_task[CONF_TASK_LABELS_TEXT])
    if current_task.get(CONF_TASK_READING_UNIT):
        task_data["reading_unit"] = current_task[CONF_TASK_READING_UNIT]

    cap_task_fields(task_data)
    return task_data
