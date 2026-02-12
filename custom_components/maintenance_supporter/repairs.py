"""Repairs support for the Maintenance Supporter integration.

Provides a multi-step repair flow for missing trigger entities with
three options:
1. Replace — select a new entity to use as trigger
2. Remove  — remove the trigger entirely (convert to time_based/manual)
3. Dismiss — close the issue (will reappear on next check)
"""

from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol
from homeassistant import data_entry_flow
from homeassistant.components.repairs import RepairsFlow
from homeassistant.core import HomeAssistant
from homeassistant.helpers import selector

from .const import (
    CONF_TASKS,
    DOMAIN,
    HistoryEntryType,
    ScheduleType,
)

_LOGGER = logging.getLogger(__name__)


class MissingTriggerEntityRepairFlow(RepairsFlow):
    """Handle repair for a missing trigger entity.

    ``self.data`` is populated by ``async_create_issue(data=...)`` and
    contains::

        {
            "entry_id": str,
            "task_id": str,
            "task_name": str,
            "object_name": str,
            "entity_id": str,          # the missing entity
        }
    """

    async def async_step_init(
        self, user_input: dict[str, str] | None = None
    ) -> data_entry_flow.FlowResult:
        """Show a menu with repair options."""
        issue_data = self.data or {}
        return self.async_show_menu(
            step_id="init",
            menu_options=["replace_entity", "remove_trigger", "dismiss"],
            description_placeholders={
                "entity_id": issue_data.get("entity_id", "unknown"),
                "task_name": issue_data.get("task_name", "unknown"),
                "object_name": issue_data.get("object_name", "unknown"),
            },
        )

    async def async_step_replace_entity(
        self, user_input: dict[str, Any] | None = None
    ) -> data_entry_flow.FlowResult:
        """Let the user pick a replacement entity."""
        issue_data = self.data or {}

        if user_input is not None:
            new_entity_id = user_input["new_entity_id"]
            await self._replace_trigger_entity(new_entity_id)
            return self.async_create_entry(data={})

        return self.async_show_form(
            step_id="replace_entity",
            data_schema=vol.Schema(
                {
                    vol.Required("new_entity_id"): selector.EntitySelector(
                        selector.EntitySelectorConfig(
                            domain=["sensor", "binary_sensor", "number", "input_number"],
                            multiple=False,
                        )
                    ),
                }
            ),
            description_placeholders={
                "entity_id": issue_data.get("entity_id", "unknown"),
                "task_name": issue_data.get("task_name", "unknown"),
                "object_name": issue_data.get("object_name", "unknown"),
            },
        )

    async def async_step_remove_trigger(
        self, user_input: dict[str, Any] | None = None
    ) -> data_entry_flow.FlowResult:
        """Confirm removal of the trigger (convert to time_based or manual)."""
        issue_data = self.data or {}

        if user_input is not None:
            await self._remove_trigger()
            return self.async_create_entry(data={})

        return self.async_show_form(
            step_id="remove_trigger",
            data_schema=vol.Schema({}),
            description_placeholders={
                "entity_id": issue_data.get("entity_id", "unknown"),
                "task_name": issue_data.get("task_name", "unknown"),
                "object_name": issue_data.get("object_name", "unknown"),
            },
        )

    async def async_step_dismiss(
        self, user_input: dict[str, Any] | None = None
    ) -> data_entry_flow.FlowResult:
        """Dismiss the issue (it will reappear if entity is still missing)."""
        return self.async_create_entry(data={})

    # --- Helpers ---

    async def _replace_trigger_entity(self, new_entity_id: str) -> None:
        """Replace the trigger entity in config entry data and reload."""
        issue_data = self.data or {}
        entry_id = issue_data.get("entry_id")
        task_id = issue_data.get("task_id")
        old_entity_id = issue_data.get("entity_id", "")

        if not entry_id or not task_id:
            _LOGGER.error("Repair flow missing entry_id or task_id in issue data")
            return

        entry = self.hass.config_entries.async_get_entry(entry_id)
        if entry is None:
            _LOGGER.error("Config entry %s not found", entry_id)
            return

        tasks_data = dict(entry.data.get(CONF_TASKS, {}))
        task_dict = dict(tasks_data.get(task_id, {}))
        trigger_config = dict(task_dict.get("trigger_config", {}))

        # Update entity_id
        trigger_config["entity_id"] = new_entity_id
        # Reset runtime values that are specific to the old entity
        trigger_config.pop("trigger_baseline_value", None)
        trigger_config.pop("trigger_change_count", None)
        task_dict["trigger_config"] = trigger_config

        # Add history entry
        from .models.maintenance_task import MaintenanceTask

        task = MaintenanceTask.from_dict(task_dict)
        task.add_history_entry(
            entry_type=HistoryEntryType.TRIGGER_REMOVED,
            notes=f"Trigger entity replaced: {old_entity_id} → {new_entity_id}",
        )
        tasks_data[task_id] = task.to_dict()

        new_data = dict(entry.data)
        new_data[CONF_TASKS] = tasks_data
        self.hass.config_entries.async_update_entry(entry, data=new_data)

        # Reload entry so the trigger re-initialises with the new entity
        await self.hass.config_entries.async_reload(entry_id)

        _LOGGER.info(
            "Trigger entity for task '%s' replaced: %s → %s",
            issue_data.get("task_name"),
            old_entity_id,
            new_entity_id,
        )

    async def _remove_trigger(self) -> None:
        """Remove the sensor trigger and convert to time_based or manual."""
        issue_data = self.data or {}
        entry_id = issue_data.get("entry_id")
        task_id = issue_data.get("task_id")

        if not entry_id or not task_id:
            _LOGGER.error("Repair flow missing entry_id or task_id in issue data")
            return

        entry = self.hass.config_entries.async_get_entry(entry_id)
        if entry is None:
            _LOGGER.error("Config entry %s not found", entry_id)
            return

        tasks_data = dict(entry.data.get(CONF_TASKS, {}))
        task_dict = dict(tasks_data.get(task_id, {}))
        old_entity_id = task_dict.get("trigger_config", {}).get("entity_id", "")

        # Keep interval_days from trigger_config if it has a safety interval
        safety_interval = task_dict.get("trigger_config", {}).get("interval_days")

        # Remove trigger config
        task_dict.pop("trigger_config", None)

        # Convert schedule type: use time_based if there's an interval, else manual
        if safety_interval or task_dict.get("interval_days"):
            task_dict["schedule_type"] = ScheduleType.TIME_BASED
            if safety_interval and not task_dict.get("interval_days"):
                task_dict["interval_days"] = safety_interval
        else:
            task_dict["schedule_type"] = ScheduleType.MANUAL

        # Add history entry
        from .models.maintenance_task import MaintenanceTask

        task = MaintenanceTask.from_dict(task_dict)
        task.add_history_entry(
            entry_type=HistoryEntryType.TRIGGER_REMOVED,
            notes=f"Sensor trigger removed (entity was: {old_entity_id}). "
            f"Schedule converted to {task.schedule_type}.",
        )
        tasks_data[task_id] = task.to_dict()

        new_data = dict(entry.data)
        new_data[CONF_TASKS] = tasks_data
        self.hass.config_entries.async_update_entry(entry, data=new_data)

        # Reload entry so the trigger is torn down properly
        await self.hass.config_entries.async_reload(entry_id)

        _LOGGER.info(
            "Trigger removed for task '%s' (was: %s), converted to %s",
            issue_data.get("task_name"),
            old_entity_id,
            task.schedule_type,
        )


async def async_create_fix_flow(
    hass: HomeAssistant,
    issue_id: str,
    data: dict[str, Any] | None,
) -> RepairsFlow:
    """Create a repair flow for the given issue."""
    return MissingTriggerEntityRepairFlow()
