"""Base for the per-object task options flow: shared state + B1 helpers.

The MaintenanceOptionsFlow steps are split across sibling mixins; this base
holds the __init__ state, the single persist path, and the init/menu steps
they all rely on. Assembled in config_flow_options_task.py."""

from __future__ import annotations

from typing import Any
from uuid import uuid4

from homeassistant.config_entries import ConfigFlowResult, OptionsFlow
from homeassistant.core import State

from .config_flow_trigger import TriggerConfigMixin
from .const import (
    CONF_ADVANCED_ADAPTIVE,
    CONF_ADVANCED_CHECKLISTS,
    CONF_OBJECT,
    CONF_TASK_DUE_DATE,
    CONF_TASK_ICON,
    CONF_TASK_INTERVAL_ANCHOR,
    CONF_TASK_INTERVAL_DAYS,
    CONF_TASK_INTERVAL_UNIT,
    CONF_TASK_NAME,
    CONF_TASK_NOTES,
    CONF_TASK_SCHEDULE_TYPE,
    CONF_TASK_TYPE,
    CONF_TASK_WARNING_DAYS,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MaintenanceTypeEnum,
    ScheduleType,
)
from .helpers.global_options import get_default_warning_days
from .helpers.schedule import (
    normalize_task_storage,
)


class _OptionsFlowBase(TriggerConfigMixin, OptionsFlow):
    """Shared state + core steps for the task options flow."""

    def __init__(self) -> None:
        """Initialize maintenance options flow."""
        self._current_task: dict[str, Any] = {}
        self._selected_task_id: str | None = None
        self._trigger_entity_id: str | None = None
        self._trigger_entity_state: State | None = None
        self._trigger_on_complete = self._save_new_task

    def _update_config_entry(self, new_data: dict[str, Any]) -> None:
        """Update the config entry with new data.

        Recurrence is normalized to the nested ``schedule`` storage here — the
        single persist path for add/edit task — so every saved task converges
        on one storage shape (idempotent for already-nested tasks).
        """
        tasks = new_data.get(CONF_TASKS)
        if tasks:
            new_data = {
                **new_data,
                CONF_TASKS: {
                    tid: normalize_task_storage(td) for tid, td in tasks.items()
                },
            }
        self.hass.config_entries.async_update_entry(
            self.config_entry, data=new_data
        )

    def _save_new_task(self) -> ConfigFlowResult:
        """Save the current task and return to init."""
        from homeassistant.util import dt as dt_util

        from .helpers.sanitize import cap_task_fields

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
                CONF_TASK_WARNING_DAYS, get_default_warning_days(self.hass)
            ),
            # Anchor for next_due fallback when last_performed is None (issue #30).
            "created_at": dt_util.now().date().isoformat(),
        }

        # Calendar kinds carry a pre-built nested schedule; normalize (in
        # _update_config_entry) treats it as authoritative over the flat fields.
        if "schedule" in self._current_task:
            task_data["schedule"] = self._current_task["schedule"]

        if CONF_TASK_INTERVAL_DAYS in self._current_task:
            task_data["interval_days"] = int(self._current_task[CONF_TASK_INTERVAL_DAYS])
        if CONF_TASK_INTERVAL_UNIT in self._current_task:
            task_data["interval_unit"] = self._current_task[CONF_TASK_INTERVAL_UNIT]
        if CONF_TASK_DUE_DATE in self._current_task:
            task_data["due_date"] = self._current_task[CONF_TASK_DUE_DATE]
        anchor = self._current_task.get(CONF_TASK_INTERVAL_ANCHOR, "completion")
        if anchor != "completion":
            task_data["interval_anchor"] = anchor
        if "trigger_config" in self._current_task:
            task_data["trigger_config"] = self._current_task["trigger_config"]
        if CONF_TASK_NOTES in self._current_task:
            task_data["notes"] = self._current_task[CONF_TASK_NOTES]
        if CONF_TASK_ICON in self._current_task:
            task_data["custom_icon"] = self._current_task[CONF_TASK_ICON]

        cap_task_fields(task_data)
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

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Show main options menu."""
        return self._show_init_menu()

    async def async_step_done(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Close the options flow."""
        # Flush store and reload to pick up config changes from this flow
        rd = getattr(self.config_entry, "runtime_data", None)
        store = getattr(rd, "store", None) if rd else None
        if store is not None:
            await store.async_save()
        self.hass.async_create_task(
            self.hass.config_entries.async_reload(self.config_entry.entry_id)
        )
        return self.async_create_entry(title="", data=self.config_entry.options)

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
