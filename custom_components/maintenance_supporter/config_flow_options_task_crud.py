"""Task manage / edit / delete / checklist steps (mixin)."""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

import voluptuous as vol
from homeassistant.config_entries import ConfigFlowResult
from homeassistant.helpers import selector

from .config_flow_helpers import (
    CALENDAR_KIND_VALUES,
    apply_season_ends,
    calendar_current,
    calendar_schema,
    interval_unit_selector,
    schedule_from_calendar_input,
    season_ends_schema,
)
from .const import (
    CONF_ADVANCED_SCHEDULE_TIME,
    CONF_RESPONSIBLE_USER_ID,
    CONF_TASK_ASSIGNEE_POOL,
    CONF_TASK_DOCUMENTATION_URL,
    CONF_TASK_DUE_DATE,
    CONF_TASK_ENABLED,
    CONF_TASK_ICON,
    CONF_TASK_INTERVAL_ANCHOR,
    CONF_TASK_INTERVAL_DAYS,
    CONF_TASK_INTERVAL_UNIT,
    CONF_TASK_LABELS_TEXT,
    CONF_TASK_LAST_PERFORMED,
    CONF_TASK_NAME,
    CONF_TASK_NFC_TAG,
    CONF_TASK_NOTES,
    CONF_TASK_PRIORITY,
    CONF_TASK_READING_UNIT,
    CONF_TASK_ROTATION_STRATEGY,
    CONF_TASK_SCHEDULE_TIME,
    CONF_TASK_TYPE,
    CONF_TASK_WARNING_DAYS,
    CONF_TASKS,
    DEFAULT_INTERVAL_DAYS,
    MAX_CHECKLIST_ITEM_LENGTH,
    MAX_CHECKLIST_ITEMS,
    ROTATION_STRATEGIES,
    MaintenanceTypeEnum,
    ScheduleType,
)
from .helpers.global_options import get_default_warning_days
from .helpers.schedule import (
    read_legacy_fields,
)
from .helpers.task_fields import (
    EARLIEST_COMPLETION_RANGE,
    INTERVAL_DAYS_RANGE,
    TASK_PRIORITIES,
    WARNING_DAYS_RANGE,
)

if TYPE_CHECKING:
    from homeassistant.config_entries import ConfigEntry
    from homeassistant.core import HomeAssistant


class TaskCrudMixin:
    """Manage, edit, delete tasks + checklist editing."""

    # -- provided by the assembled MaintenanceOptionsFlow --
    if TYPE_CHECKING:
        hass: HomeAssistant
        config_entry: ConfigEntry

        def _get_global_options(self) -> dict[str, Any]: ...
        def _show_init_menu(self) -> ConfigFlowResult: ...
        def _show_task_action_menu(self) -> ConfigFlowResult: ...
        def _update_config_entry(self, new_data: dict[str, Any]) -> None: ...
        def async_show_form(self, **kwargs: Any) -> ConfigFlowResult: ...

    async def async_step_manage_tasks(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """List and manage existing tasks."""
        tasks_data = self.config_entry.data.get(CONF_TASKS, {})

        if user_input is not None:
            if user_input.get("go_back"):
                return self._show_init_menu()
            selected = user_input.get("selected_task")
            if selected and selected in tasks_data:
                self._selected_task_id = selected
                return await self.async_step_task_action()
            return self._show_init_menu()

        task_options = [
            selector.SelectOptionDict(
                value=task_id,
                label=f"{task.get('name', 'Unknown')} ({task.get('type', 'custom')})",
            )
            for task_id, task in tasks_data.items()
        ]

        if not task_options:
            return self._show_init_menu()

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
                    vol.Optional("go_back", default=False): selector.BooleanSelector(),
                }
            ),
        )

    async def async_step_task_action(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Show actions for selected task."""
        return self._show_task_action_menu()

    async def async_step_edit_task(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Edit an existing task."""
        tasks_data = self.config_entry.data.get(CONF_TASKS, {})
        task = tasks_data.get(self._selected_task_id or "", {})

        errors: dict[str, str] = {}

        if user_input is not None:
            if user_input.get("go_back"):
                return self._show_task_action_menu()

            # Validate NFC tag uniqueness before saving
            nfc_val = (user_input.get(CONF_TASK_NFC_TAG) or "").strip()
            if nfc_val:
                from .websocket.tasks import _check_nfc_tag_duplicate

                dup_warn = _check_nfc_tag_duplicate(
                    self.hass,
                    nfc_val,
                    exclude_task_id=self._selected_task_id,
                )
                if dup_warn:
                    errors[CONF_TASK_NFC_TAG] = "nfc_tag_duplicate"

            if not errors:
                new_data = dict(self.config_entry.data)
                new_tasks = dict(new_data.get(CONF_TASKS, {}))
                updated_task = dict(new_tasks.get(self._selected_task_id or "", {}))

                updated_task["name"] = user_input.get(CONF_TASK_NAME, updated_task.get("name"))
                updated_task["type"] = user_input.get(CONF_TASK_TYPE, updated_task.get("type"))
                if user_input.get(CONF_TASK_INTERVAL_DAYS):
                    updated_task["interval_days"] = int(user_input[CONF_TASK_INTERVAL_DAYS])
                if CONF_TASK_INTERVAL_UNIT in user_input:
                    unit = user_input[CONF_TASK_INTERVAL_UNIT]
                    if unit and unit != "days":
                        updated_task["interval_unit"] = unit
                    else:
                        updated_task.pop("interval_unit", None)
                if user_input.get(CONF_TASK_DUE_DATE):
                    updated_task["due_date"] = str(user_input[CONF_TASK_DUE_DATE])
                if CONF_TASK_INTERVAL_ANCHOR in user_input:
                    updated_task["interval_anchor"] = user_input[CONF_TASK_INTERVAL_ANCHOR]
                # Calendar kinds: rebuild the nested schedule from the form fields
                # (normalize, in _update_config_entry, treats it as authoritative).
                edit_kind = read_legacy_fields(task)["schedule_type"]
                if edit_kind in CALENDAR_KIND_VALUES:
                    schedule = schedule_from_calendar_input(edit_kind, user_input)
                    if schedule is not None:
                        for key in ("interval_days", "interval_unit", "interval_anchor", "due_date"):
                            updated_task.pop(key, None)
                        updated_task["schedule"] = schedule
                # Seasonal window + finite-series end (recurring kinds). Calendar
                # kinds carry them on their nested schedule; interval tasks get a
                # minimal authoritative nested schedule only when extras are set
                # (the backend carries them onto the flat-derived interval).
                if edit_kind in CALENDAR_KIND_VALUES and isinstance(updated_task.get("schedule"), dict):
                    apply_season_ends(updated_task["schedule"], user_input)
                elif edit_kind == ScheduleType.TIME_BASED:
                    extras: dict[str, Any] = {}
                    apply_season_ends(extras, user_input)
                    if extras:
                        updated_task["schedule"] = {"kind": "interval", **extras}
                    else:
                        updated_task.pop("schedule", None)
                # schedule_time only present when global advanced flag is on; clear by submitting "".
                if CONF_TASK_SCHEDULE_TIME in user_input:
                    sched = (user_input.get(CONF_TASK_SCHEDULE_TIME) or "").strip()
                    # HA's TimeSelector serialises "HH:MM:SS"; every consumer
                    # parses "HH:MM", so normalise to the first two components
                    # here (else the calendar/next-due land at midnight).
                    parts = sched.split(":")
                    if len(parts) >= 2 and parts[0].isdigit() and parts[1].isdigit():
                        sched = f"{int(parts[0]):02d}:{int(parts[1]):02d}"
                    if sched:
                        updated_task["schedule_time"] = sched
                    else:
                        updated_task.pop("schedule_time", None)
                updated_task["warning_days"] = int(
                    user_input.get(
                        CONF_TASK_WARNING_DAYS,
                        updated_task.get("warning_days", get_default_warning_days(self.hass)),
                    )
                )
                updated_task[CONF_TASK_ENABLED] = user_input.get(CONF_TASK_ENABLED, updated_task.get(CONF_TASK_ENABLED, True))
                if user_input.get(CONF_TASK_NOTES):
                    updated_task[CONF_TASK_NOTES] = user_input[CONF_TASK_NOTES]
                if user_input.get(CONF_TASK_DOCUMENTATION_URL):
                    updated_task[CONF_TASK_DOCUMENTATION_URL] = user_input[CONF_TASK_DOCUMENTATION_URL]
                if user_input.get(CONF_TASK_LAST_PERFORMED):
                    updated_task[CONF_TASK_LAST_PERFORMED] = str(user_input[CONF_TASK_LAST_PERFORMED])
                pool = user_input.get(CONF_TASK_ASSIGNEE_POOL, [])
                if pool:
                    updated_task["assignee_pool"] = pool
                else:
                    updated_task.pop("assignee_pool", None)
                rot = user_input.get(CONF_TASK_ROTATION_STRATEGY, "")
                if rot:
                    updated_task["rotation_strategy"] = rot
                else:
                    updated_task.pop("rotation_strategy", None)
                ecd = user_input.get("earliest_completion_days")
                if ecd is not None and ecd != "":
                    updated_task["earliest_completion_days"] = int(ecd)
                else:
                    updated_task.pop("earliest_completion_days", None)
                resp_user = user_input.get(CONF_RESPONSIBLE_USER_ID, "")
                if resp_user:
                    updated_task[CONF_RESPONSIBLE_USER_ID] = resp_user
                else:
                    updated_task.pop(CONF_RESPONSIBLE_USER_ID, None)
                icon_val = user_input.get(CONF_TASK_ICON, "")
                updated_task[CONF_TASK_PRIORITY] = user_input.get(CONF_TASK_PRIORITY, "normal")
                labels_text = user_input.get(CONF_TASK_LABELS_TEXT, "")
                if labels_text.strip():
                    from .helpers.sanitize import parse_labels_text

                    updated_task["labels"] = parse_labels_text(labels_text)
                else:
                    updated_task.pop("labels", None)
                if icon_val:
                    updated_task[CONF_TASK_ICON] = icon_val
                else:
                    updated_task.pop(CONF_TASK_ICON, None)
                if nfc_val:
                    updated_task[CONF_TASK_NFC_TAG] = nfc_val
                else:
                    updated_task.pop(CONF_TASK_NFC_TAG, None)
                # v2.20 (#83): reading unit — clear by submitting "".
                if CONF_TASK_READING_UNIT in user_input:
                    ru = (user_input.get(CONF_TASK_READING_UNIT) or "").strip()
                    if ru:
                        updated_task[CONF_TASK_READING_UNIT] = ru
                    else:
                        updated_task.pop(CONF_TASK_READING_UNIT, None)

                from .helpers.sanitize import cap_task_fields

                cap_task_fields(updated_task)
                new_tasks[self._selected_task_id or ""] = updated_task
                new_data[CONF_TASKS] = new_tasks
                self._update_config_entry(new_data)

                return self._show_task_action_menu()

        type_options = [t.value for t in MaintenanceTypeEnum]

        # Build optional keys with defaults only when the task has a value
        last_performed_key = (
            vol.Optional(CONF_TASK_LAST_PERFORMED, default=task.get(CONF_TASK_LAST_PERFORMED))
            if task.get(CONF_TASK_LAST_PERFORMED)
            else vol.Optional(CONF_TASK_LAST_PERFORMED)
        )
        notes_key = (
            vol.Optional(CONF_TASK_NOTES, default=task.get(CONF_TASK_NOTES))
            if task.get(CONF_TASK_NOTES)
            else vol.Optional(CONF_TASK_NOTES)
        )
        doc_url_key = (
            vol.Optional(CONF_TASK_DOCUMENTATION_URL, default=task.get(CONF_TASK_DOCUMENTATION_URL))
            if task.get(CONF_TASK_DOCUMENTATION_URL)
            else vol.Optional(CONF_TASK_DOCUMENTATION_URL)
        )
        icon_key = (
            vol.Optional(CONF_TASK_ICON, default=task.get(CONF_TASK_ICON))
            if task.get(CONF_TASK_ICON)
            else vol.Optional(CONF_TASK_ICON)
        )
        nfc_tag_key = (
            vol.Optional(CONF_TASK_NFC_TAG, default=task.get(CONF_TASK_NFC_TAG))
            if task.get(CONF_TASK_NFC_TAG)
            else vol.Optional(CONF_TASK_NFC_TAG)
        )
        reading_unit_key = (
            vol.Optional(CONF_TASK_READING_UNIT, default=task.get(CONF_TASK_READING_UNIT))
            if task.get(CONF_TASK_READING_UNIT)
            else vol.Optional(CONF_TASK_READING_UNIT)
        )
        due_date_key = (
            vol.Required(CONF_TASK_DUE_DATE, default=task.get(CONF_TASK_DUE_DATE))
            if task.get(CONF_TASK_DUE_DATE)
            else vol.Required(CONF_TASK_DUE_DATE)
        )
        # Build user dropdown options
        users = await self.hass.auth.async_get_users()
        user_options = [selector.SelectOptionDict(value="", label="\u2014")]
        for user in users:
            if not user.is_active or user.system_generated:
                continue
            user_options.append(selector.SelectOptionDict(value=user.id, label=user.name or user.id))

        user_id_default = task.get(CONF_RESPONSIBLE_USER_ID, "")
        user_id_key = vol.Optional(CONF_RESPONSIBLE_USER_ID, default=user_id_default)
        # Rotation pool options = the real users (no empty sentinel).
        pool_options = [o for o in user_options if o["value"]]
        pool_default = task.get("assignee_pool", [])
        rotation_default = task.get("rotation_strategy", "")
        # Completion window (optional): only carry a default when one is stored,
        # so the NumberSelector renders empty for the "no restriction" case.
        ecd_stored = task.get("earliest_completion_days")
        ecd_key = (
            vol.Optional("earliest_completion_days")
            if ecd_stored is None
            else vol.Optional("earliest_completion_days", default=ecd_stored)
        )

        # Prefill the recurrence from whichever storage shape this task uses
        # (flat v2.6.x or nested `schedule`). Reading raw flat keys here would
        # silently reset a migrated task's interval on the next save (issue #58).
        sched = read_legacy_fields(task)

        return self.async_show_form(
            step_id="edit_task",
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_TASK_NAME, default=task.get("name", "")): selector.TextSelector(
                        selector.TextSelectorConfig(type=selector.TextSelectorType.TEXT)
                    ),
                    vol.Required(CONF_TASK_TYPE, default=task.get("type", MaintenanceTypeEnum.CLEANING)): selector.SelectSelector(
                        selector.SelectSelectorConfig(
                            options=type_options,
                            mode=selector.SelectSelectorMode.DROPDOWN,
                            translation_key="maintenance_type",
                        )
                    ),
                    **(
                        {
                            vol.Optional(
                                CONF_TASK_INTERVAL_DAYS,
                                default=sched["interval_days"] or DEFAULT_INTERVAL_DAYS,
                            ): selector.NumberSelector(
                                selector.NumberSelectorConfig(
                                    min=INTERVAL_DAYS_RANGE[0],
                                    max=INTERVAL_DAYS_RANGE[1],
                                    step=1,
                                    mode=selector.NumberSelectorMode.BOX,
                                )
                            ),
                            vol.Optional(
                                CONF_TASK_INTERVAL_UNIT,
                                default=sched["interval_unit"],
                            ): interval_unit_selector(),
                            vol.Optional(
                                CONF_TASK_INTERVAL_ANCHOR,
                                default=sched["interval_anchor"],
                            ): selector.SelectSelector(
                                selector.SelectSelectorConfig(
                                    options=[
                                        selector.SelectOptionDict(value="completion", label="From completion date"),
                                        selector.SelectOptionDict(value="planned", label="From planned date (no drift)"),
                                    ],
                                    mode=selector.SelectSelectorMode.DROPDOWN,
                                )
                            ),
                            **(
                                {
                                    vol.Optional(
                                        CONF_TASK_SCHEDULE_TIME,
                                        default=task.get("schedule_time", ""),
                                    ): selector.TimeSelector(),
                                }
                                if self._get_global_options().get(CONF_ADVANCED_SCHEDULE_TIME, False)
                                else dict[Any, Any]()
                            ),
                        }
                        if sched["schedule_type"] == ScheduleType.TIME_BASED
                        else dict[Any, Any]()
                    ),
                    **(
                        {due_date_key: selector.DateSelector()}
                        if sched["schedule_type"] == ScheduleType.ONE_TIME
                        else dict[Any, Any]()
                    ),
                    # Calendar kinds (Phase 4): per-kind fields, prefilled from
                    # the task's nested schedule.
                    **(
                        calendar_schema(sched["schedule_type"], calendar_current(task)).schema
                        if sched["schedule_type"] in CALENDAR_KIND_VALUES
                        else dict[Any, Any]()
                    ),
                    # Seasonal window + finite-series end — recurring kinds only.
                    **(
                        season_ends_schema(task.get("schedule"))
                        if sched["schedule_type"] == ScheduleType.TIME_BASED
                        or sched["schedule_type"] in CALENDAR_KIND_VALUES
                        else dict[Any, Any]()
                    ),
                    vol.Optional(
                        CONF_TASK_WARNING_DAYS,
                        default=task.get("warning_days", get_default_warning_days(self.hass)),
                    ): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            min=WARNING_DAYS_RANGE[0], max=WARNING_DAYS_RANGE[1], step=1, mode=selector.NumberSelectorMode.BOX
                        )
                    ),
                    ecd_key: selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            min=EARLIEST_COMPLETION_RANGE[0],
                            max=EARLIEST_COMPLETION_RANGE[1],
                            step=1,
                            mode=selector.NumberSelectorMode.BOX,
                        )
                    ),
                    vol.Optional(
                        CONF_TASK_ENABLED,
                        default=task.get(CONF_TASK_ENABLED, True),
                    ): selector.BooleanSelector(),
                    notes_key: selector.TextSelector(
                        selector.TextSelectorConfig(type=selector.TextSelectorType.TEXT, multiline=True)
                    ),
                    doc_url_key: selector.TextSelector(selector.TextSelectorConfig(type=selector.TextSelectorType.URL)),
                    last_performed_key: selector.DateSelector(),
                    user_id_key: selector.SelectSelector(
                        selector.SelectSelectorConfig(
                            options=user_options,
                            mode=selector.SelectSelectorMode.DROPDOWN,
                        )
                    ),
                    **(
                        {
                            vol.Optional(CONF_TASK_ASSIGNEE_POOL, default=pool_default): selector.SelectSelector(
                                selector.SelectSelectorConfig(
                                    options=pool_options,
                                    mode=selector.SelectSelectorMode.LIST,
                                    multiple=True,
                                )
                            ),
                            vol.Optional(CONF_TASK_ROTATION_STRATEGY, default=rotation_default): selector.SelectSelector(
                                selector.SelectSelectorConfig(
                                    options=["", *ROTATION_STRATEGIES],
                                    mode=selector.SelectSelectorMode.DROPDOWN,
                                    translation_key="rotation_strategy",
                                )
                            ),
                        }
                        if len(pool_options) >= 2
                        else dict[Any, Any]()
                    ),
                    icon_key: selector.IconSelector(),
                    vol.Optional(CONF_TASK_PRIORITY, default=task.get(CONF_TASK_PRIORITY, "normal")): selector.SelectSelector(
                        selector.SelectSelectorConfig(
                            options=list(TASK_PRIORITIES),
                            mode=selector.SelectSelectorMode.DROPDOWN,
                            translation_key="task_priority",
                        )
                    ),
                    vol.Optional(
                        CONF_TASK_LABELS_TEXT,
                        default=", ".join(task.get("labels", [])),
                    ): selector.TextSelector(selector.TextSelectorConfig(type=selector.TextSelectorType.TEXT)),
                    nfc_tag_key: selector.TextSelector(selector.TextSelectorConfig(type=selector.TextSelectorType.TEXT)),
                    reading_unit_key: selector.TextSelector(selector.TextSelectorConfig(type=selector.TextSelectorType.TEXT)),
                    vol.Optional("go_back", default=False): selector.BooleanSelector(),
                }
            ),
            errors=errors,
            description_placeholders={
                "task_name": task.get("name", ""),
            },
        )

    async def async_step_edit_checklist(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Edit the checklist for a task."""
        tasks_data = self.config_entry.data.get(CONF_TASKS, {})
        task = tasks_data.get(self._selected_task_id or "", {})

        if user_input is not None:
            if user_input.get("go_back"):
                return self._show_task_action_menu()

            # Parse textarea: one step per line, strip empty lines.
            # Per-item length and total-count caps mirror the WS schema so
            # neither path can grow ConfigEntry.data without bound.
            raw = user_input.get("checklist_text", "")
            items = [line.strip()[:MAX_CHECKLIST_ITEM_LENGTH] for line in raw.splitlines() if line.strip()][:MAX_CHECKLIST_ITEMS]

            new_data = dict(self.config_entry.data)
            new_tasks = dict(new_data.get(CONF_TASKS, {}))
            updated_task = dict(new_tasks.get(self._selected_task_id or "", {}))
            updated_task["checklist"] = items
            new_tasks[self._selected_task_id or ""] = updated_task
            new_data[CONF_TASKS] = new_tasks
            self._update_config_entry(new_data)

            return self._show_task_action_menu()

        current_checklist = task.get("checklist", [])
        default_text = "\n".join(current_checklist)

        return self.async_show_form(
            step_id="edit_checklist",
            data_schema=vol.Schema(
                {
                    vol.Optional("checklist_text", default=default_text): selector.TextSelector(
                        selector.TextSelectorConfig(
                            type=selector.TextSelectorType.TEXT,
                            multiline=True,
                        )
                    ),
                    vol.Optional("go_back", default=False): selector.BooleanSelector(),
                }
            ),
            description_placeholders={
                "task_name": task.get("name", ""),
            },
        )

    async def async_step_delete_task(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Confirm and delete a task."""
        tasks_data = self.config_entry.data.get(CONF_TASKS, {})
        task = tasks_data.get(self._selected_task_id or "", {})

        if user_input is not None:
            if user_input.get("go_back"):
                return self._show_task_action_menu()

            if user_input.get("confirm"):
                # Delegate to the shared delete helper so this surface gets
                # the SAME side-state cleanup as the WS command and the
                # delete_task service (Store, notification state, registry
                # entries, group refs, vacation exempt list, repair issues).
                # The inline copy this replaced missed most of those.
                from .websocket.tasks_crud import async_delete_task

                if self._selected_task_id:
                    await async_delete_task(self.hass, self.config_entry, self._selected_task_id)

                return self._show_init_menu()

            return self._show_task_action_menu()

        return self.async_show_form(
            step_id="delete_task",
            data_schema=vol.Schema(
                {
                    vol.Required("confirm", default=False): selector.BooleanSelector(),
                    vol.Optional("go_back", default=False): selector.BooleanSelector(),
                }
            ),
            description_placeholders={
                "task_name": task.get("name", ""),
            },
        )
