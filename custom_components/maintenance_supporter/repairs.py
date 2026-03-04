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

from .config_flow_trigger import TRIGGER_ENTITY_DOMAINS
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
                "entity_id": str(issue_data.get("entity_id", "unknown")),
                "task_name": str(issue_data.get("task_name", "unknown")),
                "object_name": str(issue_data.get("object_name", "unknown")),
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
                            domain=TRIGGER_ENTITY_DOMAINS,
                            multiple=False,
                        )
                    ),
                }
            ),
            description_placeholders={
                "entity_id": str(issue_data.get("entity_id", "unknown")),
                "task_name": str(issue_data.get("task_name", "unknown")),
                "object_name": str(issue_data.get("object_name", "unknown")),
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
                "entity_id": str(issue_data.get("entity_id", "unknown")),
                "task_name": str(issue_data.get("task_name", "unknown")),
                "object_name": str(issue_data.get("object_name", "unknown")),
            },
        )

    async def async_step_dismiss(
        self, user_input: dict[str, Any] | None = None
    ) -> data_entry_flow.FlowResult:
        """Dismiss the issue (it will reappear if entity is still missing)."""
        return self.async_create_entry(data={})

    # --- Helpers ---

    async def _replace_trigger_entity(self, new_entity_id: str) -> None:
        """Replace the trigger entity in config entry data and reload.

        For multi-entity triggers, replaces the specific missing entity
        within the entity_ids list.
        """
        issue_data = self.data or {}
        entry_id = str(issue_data.get("entry_id", ""))
        task_id = issue_data.get("task_id")
        old_entity_id = str(issue_data.get("entity_id", ""))

        if not entry_id or not task_id:
            _LOGGER.error("Repair flow missing entry_id or task_id in issue data")
            return

        entry = self.hass.config_entries.async_get_entry(entry_id)
        if entry is None:
            _LOGGER.error("Config entry %s not found", entry_id)
            return

        # Read static task data from ConfigEntry
        tasks_data = dict(entry.data.get(CONF_TASKS, {}))
        task_dict = dict(tasks_data.get(task_id, {}))
        trigger_config = dict(task_dict.get("trigger_config", {}))

        # Update entity_ids list if present
        entity_ids = trigger_config.get("entity_ids", [])
        if entity_ids and old_entity_id in entity_ids:
            entity_ids = [
                new_entity_id if eid == old_entity_id else eid
                for eid in entity_ids
            ]
            trigger_config["entity_ids"] = entity_ids

        # Update entity_id (for backwards compat / single-entity)
        if trigger_config.get("entity_id") == old_entity_id:
            trigger_config["entity_id"] = new_entity_id
        if entity_ids:
            trigger_config["entity_id"] = entity_ids[0]

        # Reset runtime values
        trigger_config.pop("trigger_baseline_value", None)
        trigger_config.pop("trigger_change_count", None)
        task_dict["trigger_config"] = trigger_config
        tasks_data[task_id] = task_dict

        # Write static changes to ConfigEntry
        new_data = dict(entry.data)
        new_data[CONF_TASKS] = tasks_data
        self.hass.config_entries.async_update_entry(entry, data=new_data)

        # Add history entry via Store (dynamic state)
        rd = getattr(entry, "runtime_data", None)
        store = getattr(rd, "store", None) if rd else None
        if store is not None:
            from .models.maintenance_task import MaintenanceTask

            merged = store.merge_task_data(task_id, task_dict)
            task = MaintenanceTask.from_dict(merged)
            task.add_history_entry(
                entry_type=HistoryEntryType.TRIGGER_REPLACED,
                notes=f"Trigger entity replaced: {old_entity_id} → {new_entity_id}",
            )
            td = task.to_dict()
            store.set_history(task_id, td.get("history", []))
            store.clear_trigger_runtime(task_id)
            store.async_delay_save()
        else:
            # Legacy: full task roundtrip via ConfigEntry
            from .models.maintenance_task import MaintenanceTask

            task = MaintenanceTask.from_dict(task_dict)
            task.add_history_entry(
                entry_type=HistoryEntryType.TRIGGER_REPLACED,
                notes=f"Trigger entity replaced: {old_entity_id} → {new_entity_id}",
            )
            tasks_data[task_id] = task.to_dict()
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
        """Remove the missing entity from the trigger.

        For multi-entity triggers, removes only the specific entity from the
        entity_ids list.  If only one entity remains (or was the only one),
        removes the entire trigger and converts to time_based or manual.
        """
        issue_data = self.data or {}
        entry_id = str(issue_data.get("entry_id", ""))
        task_id = issue_data.get("task_id")
        missing_entity_id = str(issue_data.get("entity_id", ""))

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

        entity_ids = trigger_config.get("entity_ids", [])
        remaining = [eid for eid in entity_ids if eid != missing_entity_id]

        history_notes: str
        if remaining:
            trigger_config["entity_ids"] = remaining
            trigger_config["entity_id"] = remaining[0]
            task_dict["trigger_config"] = trigger_config
            history_notes = (
                f"Entity {missing_entity_id} removed from multi-entity trigger. "
                f"Remaining: {', '.join(remaining)}"
            )
        else:
            old_entity_id = trigger_config.get("entity_id", missing_entity_id)
            safety_interval = trigger_config.get("interval_days")

            task_dict.pop("trigger_config", None)

            if safety_interval or task_dict.get("interval_days"):
                task_dict["schedule_type"] = ScheduleType.TIME_BASED
                if safety_interval and not task_dict.get("interval_days"):
                    task_dict["interval_days"] = safety_interval
            else:
                task_dict["schedule_type"] = ScheduleType.MANUAL

            history_notes = (
                f"Sensor trigger removed (entity was: {old_entity_id}). "
                f"Schedule converted to {task_dict.get('schedule_type', 'manual')}."
            )

        # Write static changes to ConfigEntry
        tasks_data[task_id] = task_dict
        new_data = dict(entry.data)
        new_data[CONF_TASKS] = tasks_data
        self.hass.config_entries.async_update_entry(entry, data=new_data)

        # Add history entry via Store (dynamic state)
        rd = getattr(entry, "runtime_data", None)
        store = getattr(rd, "store", None) if rd else None
        if store is not None:
            from .models.maintenance_task import MaintenanceTask

            merged = store.merge_task_data(task_id, task_dict)
            task = MaintenanceTask.from_dict(merged)
            task.add_history_entry(
                entry_type=HistoryEntryType.TRIGGER_REMOVED,
                notes=history_notes,
            )
            td = task.to_dict()
            store.set_history(task_id, td.get("history", []))
            store.clear_trigger_runtime(task_id)
            store.async_delay_save()
        else:
            # Legacy: history via full task roundtrip in ConfigEntry
            from .models.maintenance_task import MaintenanceTask

            task = MaintenanceTask.from_dict(task_dict)
            task.add_history_entry(
                entry_type=HistoryEntryType.TRIGGER_REMOVED,
                notes=history_notes,
            )
            tasks_data[task_id] = task.to_dict()
            new_data[CONF_TASKS] = tasks_data
            self.hass.config_entries.async_update_entry(entry, data=new_data)

        await self.hass.config_entries.async_reload(entry_id)

        _LOGGER.info(
            "Trigger entity %s removed for task '%s'",
            missing_entity_id,
            issue_data.get("task_name"),
        )


async def async_create_fix_flow(
    hass: HomeAssistant,
    issue_id: str,
    data: dict[str, Any] | None,
) -> RepairsFlow:
    """Create a repair flow for the given issue."""
    return MissingTriggerEntityRepairFlow()
