"""Per-object task options flow for the Maintenance Supporter integration.

Contains MaintenanceOptionsFlow: per-object task CRUD, trigger config via TriggerConfigMixin.
Split from config_flow_options.py for better maintainability.
"""

from __future__ import annotations

from typing import Any
from uuid import uuid4

from homeassistant.core import State

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
    CONF_OBJECT,
    CONF_OBJECT_AREA,
    CONF_OBJECT_INSTALLATION_DATE,
    CONF_OBJECT_MANUFACTURER,
    CONF_OBJECT_MODEL,
    CONF_OBJECT_NAME,
    CONF_RESPONSIBLE_USER_ID,
    CONF_SENSOR_PREDICTION_ENABLED,
    CONF_TASK_DOCUMENTATION_URL,
    CONF_TASK_ENABLED,
    CONF_TASK_ICON,
    CONF_TASK_INTERVAL_DAYS,
    CONF_TASK_LAST_PERFORMED,
    CONF_TASK_NAME,
    CONF_TASK_NFC_TAG,
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
    TriggerType,
)


class MaintenanceOptionsFlow(TriggerConfigMixin, OptionsFlow):
    """Handle maintenance object options."""

    def __init__(self) -> None:
        """Initialize maintenance options flow."""
        self._current_task: dict[str, Any] = {}
        self._selected_task_id: str | None = None
        self._trigger_entity_id: str | None = None
        self._trigger_entity_state: State | None = None
        self._trigger_on_complete = self._save_new_task

    # --- Helpers ---

    def _update_config_entry(self, new_data: dict[str, Any]) -> None:
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
        }

        if CONF_TASK_INTERVAL_DAYS in self._current_task:
            task_data["interval_days"] = int(self._current_task[CONF_TASK_INTERVAL_DAYS])
        if "trigger_config" in self._current_task:
            task_data["trigger_config"] = self._current_task["trigger_config"]
        if CONF_TASK_NOTES in self._current_task:
            task_data["notes"] = self._current_task[CONF_TASK_NOTES]
        if CONF_TASK_ICON in self._current_task:
            task_data["custom_icon"] = self._current_task[CONF_TASK_ICON]

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

        # Initialize dynamic state in Store
        rd = getattr(self.config_entry, "runtime_data", None)
        store = getattr(rd, "store", None) if rd else None
        last_performed = self._current_task.get("last_performed")
        if store is not None:
            store.init_task(task_id, last_performed=last_performed)
            store.async_delay_save()
        elif last_performed:
            # Legacy: put last_performed in ConfigEntry.data
            task_data["last_performed"] = last_performed
            task_data["history"] = []
            new_tasks[task_id] = task_data
            new_data[CONF_TASKS] = new_tasks
            self._update_config_entry(new_data)

        self._current_task = {}

        return self._show_init_menu()

    def _show_init_menu(self) -> ConfigFlowResult:
        """Show the init menu (sync helper for callbacks)."""
        obj_data = self.config_entry.data.get(CONF_OBJECT, {})
        tasks_data = self.config_entry.data.get(CONF_TASKS, {})
        object_info = f"{obj_data.get('name', 'Unknown')} — {len(tasks_data)} task(s)"
        return self.async_show_menu(
            step_id="init",
            menu_options=["manage_tasks", "add_task", "object_settings", "done"],
            description_placeholders={"object_info": object_info},
        )

    # --- Main Menu ---

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Show main options menu."""
        return self._show_init_menu()

    async def async_step_done(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Close the options flow."""
        return self.async_create_entry(title="", data=self.config_entry.options)

    # --- Manage Tasks: List → Select → Action ---

    async def async_step_manage_tasks(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
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
                    vol.Optional(
                        "go_back", default=False
                    ): selector.BooleanSelector(),
                }
            ),
        )

    def _get_global_options(self) -> dict[str, Any]:
        """Get global options from the global config entry."""
        for entry in self.hass.config_entries.async_entries(DOMAIN):
            if entry.unique_id == GLOBAL_UNIQUE_ID:
                return dict(entry.options or entry.data)
        return {}

    def _build_task_action_menu(self) -> list[str]:
        """Build the task_action menu options list."""
        tasks_data = self.config_entry.data.get(CONF_TASKS, {})
        task = tasks_data.get(self._selected_task_id or "", {})

        global_opts = self._get_global_options()
        menu = ["edit_task", "edit_trigger"]
        if task.get("trigger_config"):
            menu.append("remove_trigger")
        if global_opts.get(CONF_ADVANCED_CHECKLISTS, False):
            menu.append("edit_checklist")
        if global_opts.get(CONF_ADVANCED_ADAPTIVE, False):
            menu.append("adaptive_scheduling")
        menu.extend(["delete_task", "manage_tasks"])
        return menu

    def _show_task_action_menu(self) -> ConfigFlowResult:
        """Show the task_action menu (sync helper for callbacks)."""
        tasks_data = self.config_entry.data.get(CONF_TASKS, {})
        task = tasks_data.get(self._selected_task_id or "", {})
        return self.async_show_menu(
            step_id="task_action",
            menu_options=self._build_task_action_menu(),
            description_placeholders={"task_name": task.get("name", "Unknown")},
        )

    async def async_step_task_action(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Show actions for selected task."""
        return self._show_task_action_menu()

    async def async_step_edit_task(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Edit an existing task."""
        tasks_data = self.config_entry.data.get(CONF_TASKS, {})
        task = tasks_data.get(self._selected_task_id or "", {})

        if user_input is not None:
            if user_input.get("go_back"):
                return self._show_task_action_menu()
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
            updated_task[CONF_TASK_ENABLED] = user_input.get(
                CONF_TASK_ENABLED, updated_task.get(CONF_TASK_ENABLED, True)
            )
            if user_input.get(CONF_TASK_NOTES):
                updated_task[CONF_TASK_NOTES] = user_input[CONF_TASK_NOTES]
            if user_input.get(CONF_TASK_DOCUMENTATION_URL):
                updated_task[CONF_TASK_DOCUMENTATION_URL] = user_input[CONF_TASK_DOCUMENTATION_URL]
            if user_input.get(CONF_TASK_LAST_PERFORMED):
                updated_task[CONF_TASK_LAST_PERFORMED] = str(
                    user_input[CONF_TASK_LAST_PERFORMED]
                )
            resp_user = user_input.get(CONF_RESPONSIBLE_USER_ID, "")
            if resp_user:
                updated_task[CONF_RESPONSIBLE_USER_ID] = resp_user
            else:
                updated_task.pop(CONF_RESPONSIBLE_USER_ID, None)
            icon_val = user_input.get(CONF_TASK_ICON, "")
            if icon_val:
                updated_task[CONF_TASK_ICON] = icon_val
            else:
                updated_task.pop(CONF_TASK_ICON, None)
            nfc_val = user_input.get(CONF_TASK_NFC_TAG, "")
            if nfc_val:
                updated_task[CONF_TASK_NFC_TAG] = nfc_val.strip()
            else:
                updated_task.pop(CONF_TASK_NFC_TAG, None)

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
        # Build user dropdown options
        users = await self.hass.auth.async_get_users()
        user_options = [selector.SelectOptionDict(value="", label="\u2014")]
        for user in users:
            if not user.is_active or user.system_generated:
                continue
            user_options.append(
                selector.SelectOptionDict(
                    value=user.id, label=user.name or user.id
                )
            )

        user_id_default = task.get(CONF_RESPONSIBLE_USER_ID, "")
        user_id_key = vol.Optional(
            CONF_RESPONSIBLE_USER_ID, default=user_id_default
        )

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
                    vol.Optional(
                        CONF_TASK_ENABLED,
                        default=task.get(CONF_TASK_ENABLED, True),
                    ): selector.BooleanSelector(),
                    notes_key: selector.TextSelector(
                        selector.TextSelectorConfig(
                            type=selector.TextSelectorType.TEXT, multiline=True
                        )
                    ),
                    doc_url_key: selector.TextSelector(
                        selector.TextSelectorConfig(type=selector.TextSelectorType.URL)
                    ),
                    last_performed_key: selector.DateSelector(),
                    user_id_key: selector.SelectSelector(
                        selector.SelectSelectorConfig(
                            options=user_options,
                            mode=selector.SelectSelectorMode.DROPDOWN,
                        )
                    ),
                    icon_key: selector.IconSelector(),
                    nfc_tag_key: selector.TextSelector(
                        selector.TextSelectorConfig(
                            type=selector.TextSelectorType.TEXT
                        )
                    ),
                    vol.Optional(
                        "go_back", default=False
                    ): selector.BooleanSelector(),
                }
            ),
            description_placeholders={
                "task_name": task.get("name", ""),
            },
        )

    async def async_step_edit_trigger(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Edit the trigger configuration for an existing task."""
        tasks_data = self.config_entry.data.get(CONF_TASKS, {})
        task = tasks_data.get(self._selected_task_id or "", {})

        if task.get("trigger_config"):
            return await self.async_step_trigger_summary()

        # No existing trigger — go directly to sensor select
        self._current_task = {}
        self._trigger_on_complete = self._save_edited_trigger
        self._on_cancel = self._show_task_action_menu
        return await self.async_step_opt_sensor_select()

    @staticmethod
    def _condition_summary(cond: dict[str, Any]) -> str:
        """Build a short summary string for a single trigger condition."""
        ctype = cond.get("type", "?")
        parts: list[str] = []
        if ctype == TriggerType.THRESHOLD:
            if cond.get("trigger_above") is not None:
                parts.append(f"above: {cond['trigger_above']}")
            if cond.get("trigger_below") is not None:
                parts.append(f"below: {cond['trigger_below']}")
            if cond.get("trigger_for_minutes"):
                parts.append(f"for: {cond['trigger_for_minutes']}min")
        elif ctype == TriggerType.COUNTER:
            if cond.get("trigger_target_value") is not None:
                parts.append(f"target: {cond['trigger_target_value']}")
            if cond.get("trigger_delta_mode"):
                parts.append("delta mode")
        elif ctype == TriggerType.STATE_CHANGE:
            if cond.get("trigger_target_changes") is not None:
                parts.append(f"changes: {cond['trigger_target_changes']}")
            if cond.get("trigger_from_state"):
                parts.append(f"from: {cond['trigger_from_state']}")
            if cond.get("trigger_to_state"):
                parts.append(f"to: {cond['trigger_to_state']}")
        elif ctype == TriggerType.RUNTIME:
            if cond.get("trigger_runtime_hours") is not None:
                parts.append(f"hours: {cond['trigger_runtime_hours']}")
        return ", ".join(parts) if parts else "—"

    @staticmethod
    def _get_entity_ids_str(tc: dict[str, Any]) -> str:
        """Get display string for entity IDs from trigger config."""
        entity_ids = tc.get("entity_ids", [])
        if not entity_ids:
            eid = tc.get("entity_id", "")
            entity_ids = [eid] if isinstance(eid, str) and eid else (
                eid if isinstance(eid, list) else []
            )
        return ", ".join(entity_ids) if entity_ids else "—"

    @staticmethod
    def _build_trigger_config_parts(tc: dict[str, Any]) -> list[str]:
        """Build config detail parts for a trigger config (shared by summary & remove)."""
        trigger_type = tc.get("type", "unknown")
        config_parts: list[str] = []
        if trigger_type == TriggerType.THRESHOLD:
            if tc.get("trigger_above") is not None:
                config_parts.append(f"above: {tc['trigger_above']}")
            if tc.get("trigger_below") is not None:
                config_parts.append(f"below: {tc['trigger_below']}")
            if tc.get("trigger_for_minutes"):
                config_parts.append(f"for: {tc['trigger_for_minutes']}min")
        elif trigger_type == TriggerType.COUNTER:
            if tc.get("trigger_target_value") is not None:
                config_parts.append(f"target: {tc['trigger_target_value']}")
            if tc.get("trigger_delta_mode"):
                config_parts.append("delta mode")
        elif trigger_type == TriggerType.STATE_CHANGE:
            if tc.get("trigger_target_changes") is not None:
                config_parts.append(f"changes: {tc['trigger_target_changes']}")
            if tc.get("trigger_from_state"):
                config_parts.append(f"from: {tc['trigger_from_state']}")
            if tc.get("trigger_to_state"):
                config_parts.append(f"to: {tc['trigger_to_state']}")
        elif trigger_type == TriggerType.RUNTIME:
            if tc.get("trigger_runtime_hours") is not None:
                config_parts.append(f"hours: {tc['trigger_runtime_hours']}")
        elif trigger_type == TriggerType.COMPOUND:
            conditions = tc.get("conditions", [])
            logic = tc.get("compound_logic", "AND")
            config_parts.append(f"logic: {logic}")
            for i, cond in enumerate(conditions, 1):
                ctype = cond.get("type", "?")
                c_eids = cond.get("entity_ids", [])
                if not c_eids:
                    c_eid = cond.get("entity_id", "?")
                    c_eids = [c_eid] if isinstance(c_eid, str) else c_eid
                c_entities = ", ".join(c_eids[:2])
                c_detail = MaintenanceOptionsFlow._condition_summary(cond)
                config_parts.append(f"#{i} {ctype}: {c_entities} ({c_detail})")
        return config_parts

    async def async_step_trigger_summary(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Show current trigger configuration summary before editing."""
        tasks_data = self.config_entry.data.get(CONF_TASKS, {})
        task = tasks_data.get(self._selected_task_id or "", {})
        tc = task.get("trigger_config", {})

        entity_ids_str = self._get_entity_ids_str(tc)

        # Current state values
        state_parts: list[str] = []
        eid_list = tc.get("entity_ids", tc.get("entity_id", []))
        if isinstance(eid_list, str):
            eid_list = [eid_list]
        for eid in eid_list[:3]:
            state = self.hass.states.get(eid)
            if state:
                state_parts.append(f"{eid}: {state.state}")
            else:
                state_parts.append(f"{eid}: unavailable")
        current_states = ", ".join(state_parts) if state_parts else "—"

        trigger_type = tc.get("type", "unknown")
        attribute = tc.get("attribute") or "state"

        config_parts = self._build_trigger_config_parts(tc)
        config_details = "\n".join(config_parts) if config_parts else "—"

        return self.async_show_menu(
            step_id="trigger_summary",
            menu_options=["edit_trigger_proceed", "task_action"],
            description_placeholders={
                "task_name": task.get("name", ""),
                "entity_ids": entity_ids_str,
                "current_states": current_states,
                "trigger_type": trigger_type,
                "attribute": attribute,
                "config_details": config_details,
            },
        )

    async def async_step_edit_trigger_proceed(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Proceed with editing the trigger after reviewing the summary."""
        self._current_task = {}
        self._trigger_on_complete = self._save_edited_trigger
        self._on_cancel = self._show_task_action_menu
        return await self.async_step_opt_sensor_select()

    def _save_edited_trigger(self) -> ConfigFlowResult:
        """Save edited trigger configuration to an existing task."""
        new_data = dict(self.config_entry.data)
        new_tasks = dict(new_data.get(CONF_TASKS, {}))
        updated_task = dict(new_tasks.get(self._selected_task_id or "", {}))

        if "trigger_config" in self._current_task:
            updated_task["trigger_config"] = self._current_task["trigger_config"]
        if CONF_TASK_SCHEDULE_TYPE in self._current_task:
            updated_task["schedule_type"] = self._current_task[CONF_TASK_SCHEDULE_TYPE]
        if CONF_TASK_INTERVAL_DAYS in self._current_task:
            updated_task["interval_days"] = int(
                self._current_task[CONF_TASK_INTERVAL_DAYS]
            )
        if CONF_TASK_WARNING_DAYS in self._current_task:
            updated_task["warning_days"] = int(
                self._current_task[CONF_TASK_WARNING_DAYS]
            )

        new_tasks[self._selected_task_id or ""] = updated_task
        new_data[CONF_TASKS] = new_tasks
        self._update_config_entry(new_data)
        self._current_task = {}

        return self._show_task_action_menu()

    async def async_step_remove_trigger(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Confirm and remove trigger configuration from a task."""
        tasks_data = self.config_entry.data.get(CONF_TASKS, {})
        task = tasks_data.get(self._selected_task_id or "", {})
        tc = task.get("trigger_config", {})

        # Resolve entity list
        entity_ids = tc.get("entity_ids", [])
        if not entity_ids:
            eid = tc.get("entity_id", "")
            entity_ids = [eid] if isinstance(eid, str) and eid else (
                eid if isinstance(eid, list) else []
            )
        has_multiple = len(entity_ids) > 1

        if user_input is not None:
            if user_input.get("go_back"):
                return self._show_task_action_menu()

            if user_input.get("confirm"):
                entities_to_remove = user_input.get(
                    "entities_to_remove", entity_ids
                )
                remaining = [
                    e for e in entity_ids if e not in entities_to_remove
                ]

                new_data = dict(self.config_entry.data)
                new_tasks = dict(new_data.get(CONF_TASKS, {}))
                updated_task = dict(
                    new_tasks.get(self._selected_task_id or "", {})
                )

                if remaining:
                    # Partial removal — keep trigger with remaining entities
                    updated_tc = dict(
                        updated_task.get("trigger_config", {})
                    )
                    updated_tc["entity_ids"] = remaining
                    updated_tc.pop("entity_id", None)
                    updated_task["trigger_config"] = updated_tc
                else:
                    # Full removal — remove entire trigger config
                    updated_task.pop("trigger_config", None)
                    if updated_task.get(
                        "schedule_type"
                    ) == ScheduleType.SENSOR_BASED:
                        updated_task["schedule_type"] = ScheduleType.TIME_BASED

                new_tasks[self._selected_task_id or ""] = updated_task
                new_data[CONF_TASKS] = new_tasks
                self._update_config_entry(new_data)

            return self._show_task_action_menu()

        # Build rich description from trigger_config
        entity_ids_str = self._get_entity_ids_str(tc)
        trigger_type = tc.get("type", "unknown")

        config_parts = self._build_trigger_config_parts(tc)
        config_details = "\n".join(config_parts) if config_parts else "—"

        # Build schema — add entity selector for multi-entity triggers
        schema_dict: dict[Any, Any] = {}
        if has_multiple:
            schema_dict[
                vol.Required("entities_to_remove")
            ] = selector.EntitySelector(
                selector.EntitySelectorConfig(
                    include_entities=entity_ids,
                    multiple=True,
                )
            )
        schema_dict[
            vol.Required("confirm", default=False)
        ] = selector.BooleanSelector()
        schema_dict[
            vol.Optional("go_back", default=False)
        ] = selector.BooleanSelector()

        return self.async_show_form(
            step_id="remove_trigger",
            data_schema=vol.Schema(schema_dict),
            description_placeholders={
                "task_name": task.get("name", ""),
                "entity_ids": entity_ids_str,
                "trigger_type": trigger_type,
                "config_details": config_details,
            },
        )

    async def async_step_edit_checklist(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Edit the checklist for a task."""
        tasks_data = self.config_entry.data.get(CONF_TASKS, {})
        task = tasks_data.get(self._selected_task_id or "", {})

        if user_input is not None:
            if user_input.get("go_back"):
                return self._show_task_action_menu()

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

            return self._show_task_action_menu()

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
                    vol.Optional(
                        "go_back", default=False
                    ): selector.BooleanSelector(),
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
            if user_input.get("go_back"):
                return self._show_task_action_menu()

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
                return self._show_init_menu()

            return self._show_task_action_menu()

        return self.async_show_form(
            step_id="delete_task",
            data_schema=vol.Schema(
                {
                    vol.Required("confirm", default=False): selector.BooleanSelector(),
                    vol.Optional(
                        "go_back", default=False
                    ): selector.BooleanSelector(),
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
            if user_input.get("go_back"):
                return self._show_init_menu()

            self._current_task = {
                CONF_TASK_NAME: user_input[CONF_TASK_NAME],
                CONF_TASK_TYPE: user_input.get(CONF_TASK_TYPE, MaintenanceTypeEnum.CLEANING),
                CONF_TASK_SCHEDULE_TYPE: user_input[CONF_TASK_SCHEDULE_TYPE],
            }
            if user_input.get(CONF_TASK_ICON):
                self._current_task[CONF_TASK_ICON] = user_input[CONF_TASK_ICON]

            self._trigger_on_complete = self._save_new_task
            self._on_cancel = self._show_init_menu

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
                    vol.Optional(CONF_TASK_ICON): selector.IconSelector(),
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
                    vol.Optional(
                        "go_back", default=False
                    ): selector.BooleanSelector(),
                }
            ),
        )

    # --- Sensor trigger steps (thin wrappers delegating to TriggerConfigMixin) ---

    async def async_step_opt_sensor_select(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Select sensor entity for trigger."""
        # Pre-populate with existing entity_ids when editing a trigger
        existing = None
        if self._selected_task_id:
            tasks = self.config_entry.data.get(CONF_TASKS, {})
            task = tasks.get(self._selected_task_id, {})
            tc = task.get("trigger_config", {})
            eids = tc.get("entity_ids", [])
            if not eids:
                eid = tc.get("entity_id", "")
                eids = [eid] if eid else []
            if eids:
                existing = eids

        return await self._trigger_sensor_select(
            user_input,
            step_id="opt_sensor_select",
            next_step=self.async_step_opt_sensor_attribute,
            default_entities=existing,
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
            runtime_step=self.async_step_opt_trigger_runtime,
            compound_step=self.async_step_opt_compound_logic,
        )

    async def async_step_opt_trigger_threshold(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Configure threshold trigger."""
        return await self._trigger_threshold_config(
            user_input,
            step_id="opt_trigger_threshold",
            on_complete=self._trigger_on_complete,
        )

    async def async_step_opt_trigger_counter(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Configure counter trigger."""
        return await self._trigger_counter_config(
            user_input,
            step_id="opt_trigger_counter",
            on_complete=self._trigger_on_complete,
        )

    async def async_step_opt_trigger_state_change(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Configure state change trigger."""
        return await self._trigger_state_change_config(
            user_input,
            step_id="opt_trigger_state_change",
            on_complete=self._trigger_on_complete,
        )

    async def async_step_opt_trigger_runtime(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Configure runtime trigger."""
        return await self._trigger_runtime_config(
            user_input,
            step_id="opt_trigger_runtime",
            on_complete=self._trigger_on_complete,
        )

    # --- Compound Trigger Steps ---

    async def async_step_opt_compound_logic(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Select compound trigger logic."""
        return await self._trigger_compound_logic(
            user_input,
            step_id="compound_logic",
            next_step=self.async_step_opt_compound_condition_entity,
        )

    async def async_step_opt_compound_condition_entity(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Select entity for compound condition."""
        return await self._trigger_compound_condition_entity(
            user_input,
            step_id="compound_condition_entity",
            next_step=self.async_step_opt_compound_condition_type,
        )

    async def async_step_opt_compound_condition_type(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Select trigger type for compound condition."""
        return await self._trigger_compound_condition_type(
            user_input,
            step_id="compound_condition_type",
            threshold_step=self.async_step_opt_compound_condition_threshold,
            counter_step=self.async_step_opt_compound_condition_counter,
            state_change_step=self.async_step_opt_compound_condition_state_change,
            runtime_step=self.async_step_opt_compound_condition_runtime,
        )

    async def async_step_opt_compound_condition_threshold(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Configure threshold for compound condition."""
        return await self._trigger_compound_condition_config(
            user_input, "threshold",
            step_id="compound_condition_threshold",
            on_complete=self.async_step_opt_compound_review,
        )

    async def async_step_opt_compound_condition_counter(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Configure counter for compound condition."""
        return await self._trigger_compound_condition_config(
            user_input, "counter",
            step_id="compound_condition_counter",
            on_complete=self.async_step_opt_compound_review,
        )

    async def async_step_opt_compound_condition_state_change(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Configure state_change for compound condition."""
        return await self._trigger_compound_condition_config(
            user_input, "state_change",
            step_id="compound_condition_state_change",
            on_complete=self.async_step_opt_compound_review,
        )

    async def async_step_opt_compound_condition_runtime(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Configure runtime for compound condition."""
        return await self._trigger_compound_condition_config(
            user_input, "runtime",
            step_id="compound_condition_runtime",
            on_complete=self.async_step_opt_compound_review,
        )

    async def async_step_opt_compound_review(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Review compound trigger conditions."""
        return await self._trigger_compound_review(
            user_input,
            step_id="compound_review",
            add_condition_step=self.async_step_opt_compound_condition_entity,
            on_complete=self._trigger_on_complete,
        )

    # --- Adaptive Scheduling ---

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

        env_entity = current_adaptive.get("environmental_entity")
        env_key = (
            vol.Optional(CONF_ENVIRONMENTAL_ENTITY, default=env_entity)
            if env_entity
            else vol.Optional(CONF_ENVIRONMENTAL_ENTITY)
        )

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
            if user_input.get("go_back"):
                return self._show_init_menu()
            new_data = dict(self.config_entry.data)
            obj = dict(new_data.get(CONF_OBJECT, {}))
            obj[CONF_OBJECT_NAME] = user_input.get(CONF_OBJECT_NAME, obj.get("name"))
            obj[CONF_OBJECT_MANUFACTURER] = user_input.get(CONF_OBJECT_MANUFACTURER)
            obj[CONF_OBJECT_MODEL] = user_input.get(CONF_OBJECT_MODEL)
            obj[CONF_OBJECT_AREA] = user_input.get(CONF_OBJECT_AREA)
            if user_input.get(CONF_OBJECT_INSTALLATION_DATE):
                obj[CONF_OBJECT_INSTALLATION_DATE] = str(
                    user_input[CONF_OBJECT_INSTALLATION_DATE]
                )
            new_data[CONF_OBJECT] = obj

            self.hass.config_entries.async_update_entry(
                self.config_entry,
                data=new_data,
                title=obj[CONF_OBJECT_NAME],
            )

            return self._show_init_menu()

        obj = self.config_entry.data.get(CONF_OBJECT, {})

        # Build optional keys with defaults only when the object has a value
        area_key = (
            vol.Optional(CONF_OBJECT_AREA, default=obj.get(CONF_OBJECT_AREA))
            if obj.get(CONF_OBJECT_AREA)
            else vol.Optional(CONF_OBJECT_AREA)
        )
        install_date_key = (
            vol.Optional(CONF_OBJECT_INSTALLATION_DATE, default=obj.get(CONF_OBJECT_INSTALLATION_DATE))
            if obj.get(CONF_OBJECT_INSTALLATION_DATE)
            else vol.Optional(CONF_OBJECT_INSTALLATION_DATE)
        )

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
                    area_key: selector.AreaSelector(),
                    install_date_key: selector.DateSelector(),
                    vol.Optional(
                        "go_back", default=False
                    ): selector.BooleanSelector(),
                }
            ),
        )
