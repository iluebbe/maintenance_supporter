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
    CONF_ADMIN_PANEL_USER_IDS,
    CONF_TASKS,
    HistoryEntryType,
    ScheduleType,
)

_LOGGER = logging.getLogger(__name__)


def _replace_entity_in_dict(
    cfg: dict[str, Any], old: str, new: str
) -> dict[str, Any]:
    """Return a copy of ``cfg`` with entity_id/entity_ids replaced if matching."""
    cfg = dict(cfg)
    eids = cfg.get("entity_ids")
    if isinstance(eids, list) and old in eids:
        cfg["entity_ids"] = [new if e == old else e for e in eids]
    if cfg.get("entity_id") == old:
        cfg["entity_id"] = new
    return cfg


def _replace_entity_in_condition(
    cond: dict[str, Any], old: str, new: str
) -> dict[str, Any]:
    """Replace ``old`` entity with ``new`` in a compound trigger condition.

    Conditions may have entity references at top level OR in a nested
    ``trigger_config`` sub-dict.
    """
    cond = _replace_entity_in_dict(cond, old, new)
    nested = cond.get("trigger_config")
    if isinstance(nested, dict):
        cond["trigger_config"] = _replace_entity_in_dict(nested, old, new)
    return cond


def _strip_entity_from_dict(
    cfg: dict[str, Any], target: str
) -> tuple[dict[str, Any], bool]:
    """Strip ``target`` from a flat trigger config dict.

    Returns (modified copy, has_remaining_entity).
    """
    cfg = dict(cfg)
    eids = cfg.get("entity_ids")
    if isinstance(eids, list):
        eids = [e for e in eids if e != target]
        if eids:
            cfg["entity_ids"] = eids
            if cfg.get("entity_id") == target:
                cfg["entity_id"] = eids[0]
            return cfg, True
        cfg.pop("entity_ids", None)
    if cfg.get("entity_id") == target:
        cfg.pop("entity_id", None)
    has_remaining = bool(cfg.get("entity_id") or cfg.get("entity_ids"))
    return cfg, has_remaining


def _strip_entity_from_condition(
    cond: dict[str, Any], target: str
) -> tuple[dict[str, Any], bool]:
    """Strip ``target`` from a compound condition.

    Returns (modified copy, keep_condition). The condition is kept if it
    still references at least one entity (top-level or nested).
    """
    cond, top_has = _strip_entity_from_dict(cond, target)
    nested = cond.get("trigger_config")
    nested_has = False
    if isinstance(nested, dict):
        nested_stripped, nested_has = _strip_entity_from_dict(nested, target)
        cond["trigger_config"] = nested_stripped
    return cond, top_has or nested_has


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
            # Guard: task may have been deleted since issue was created
            issue_data = self.data or {}
            entry = self.hass.config_entries.async_get_entry(
                str(issue_data.get("entry_id", ""))
            )
            if entry is None or issue_data.get("task_id") not in entry.data.get(
                CONF_TASKS, {}
            ):
                return self.async_abort(reason="task_deleted")
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
            # Guard: task may have been deleted since issue was created
            issue_data = self.data or {}
            entry = self.hass.config_entries.async_get_entry(
                str(issue_data.get("entry_id", ""))
            )
            if entry is None or issue_data.get("task_id") not in entry.data.get(
                CONF_TASKS, {}
            ):
                return self.async_abort(reason="task_deleted")
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
        task_dict = dict(tasks_data[task_id])
        trigger_config = dict(task_dict.get("trigger_config", {}))

        if trigger_config.get("type") == "compound":
            # Recurse into conditions
            new_conditions = [
                _replace_entity_in_condition(cond, old_entity_id, new_entity_id)
                for cond in trigger_config.get("conditions", [])
            ]
            trigger_config["conditions"] = new_conditions
        else:
            # Flat trigger: update entity_ids list if present
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
        task_dict = dict(tasks_data[task_id])
        trigger_config = dict(task_dict.get("trigger_config", {}))

        history_notes: str

        if trigger_config.get("type") == "compound":
            history_notes = self._remove_from_compound(
                task_dict, trigger_config, missing_entity_id
            )
        else:
            history_notes = self._remove_from_flat(
                task_dict, trigger_config, missing_entity_id
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

    def _remove_from_flat(
        self,
        task_dict: dict[str, Any],
        trigger_config: dict[str, Any],
        missing_entity_id: str,
    ) -> str:
        """Remove ``missing_entity_id`` from a flat trigger config.

        Mutates ``task_dict`` in place. Returns a history notes string.
        """
        entity_ids = trigger_config.get("entity_ids", [])
        remaining = [eid for eid in entity_ids if eid != missing_entity_id]

        if remaining:
            trigger_config["entity_ids"] = remaining
            trigger_config["entity_id"] = remaining[0]
            task_dict["trigger_config"] = trigger_config
            return (
                f"Entity {missing_entity_id} removed from multi-entity trigger. "
                f"Remaining: {', '.join(remaining)}"
            )

        old_entity_id = trigger_config.get("entity_id", missing_entity_id)
        safety_interval = trigger_config.get("interval_days")
        task_dict.pop("trigger_config", None)

        if safety_interval or task_dict.get("interval_days"):
            task_dict["schedule_type"] = ScheduleType.TIME_BASED
            if safety_interval and not task_dict.get("interval_days"):
                task_dict["interval_days"] = safety_interval
        else:
            task_dict["schedule_type"] = ScheduleType.MANUAL

        return (
            f"Sensor trigger removed (entity was: {old_entity_id}). "
            f"Schedule converted to {task_dict.get('schedule_type', 'manual')}."
        )

    def _remove_from_compound(
        self,
        task_dict: dict[str, Any],
        trigger_config: dict[str, Any],
        missing_entity_id: str,
    ) -> str:
        """Remove ``missing_entity_id`` from a compound trigger config.

        Walks each condition; if a condition still references at least one
        entity it is kept (with the missing entity stripped). Otherwise the
        condition is dropped.

        Resulting condition count handling:
          - ``>= 2``: stays compound
          - ``== 1``: demoted to a flat trigger using the remaining condition
          - ``== 0``: trigger removed entirely (delegate to flat fallback)

        Mutates ``task_dict`` in place. Returns a history notes string.
        """
        new_conditions = []
        for cond in trigger_config.get("conditions", []):
            stripped, keep = _strip_entity_from_condition(cond, missing_entity_id)
            if keep:
                new_conditions.append(stripped)

        if len(new_conditions) >= 2:
            trigger_config["conditions"] = new_conditions
            task_dict["trigger_config"] = trigger_config
            return (
                f"Entity {missing_entity_id} removed from compound trigger; "
                f"{len(new_conditions)} conditions remain."
            )

        if len(new_conditions) == 1:
            sole = new_conditions[0]
            # Conditions may carry their config nested under "trigger_config"
            nested = sole.get("trigger_config")
            if isinstance(nested, dict):
                new_tc = dict(nested)
                if "type" not in new_tc and sole.get("type"):
                    new_tc["type"] = sole["type"]
            else:
                new_tc = dict(sole)
            task_dict["trigger_config"] = new_tc
            return (
                f"Entity {missing_entity_id} removed; compound trigger "
                f"demoted to single trigger ({new_tc.get('type', 'unknown')})."
            )

        # 0 conditions remain — fall back to the flat removal path
        # (uses the original trigger_config to determine schedule_type)
        return self._remove_from_flat(task_dict, trigger_config, missing_entity_id)


class OrphanAdminPanelUserRepairFlow(RepairsFlow):
    """Repair flow for an admin_panel_user_ids entry pointing at a deleted HA user.

    Single action: remove the orphaned id from the panel-access list. There's
    no scenario where keeping an invalid user_id makes sense — if an admin
    really wants to silence the issue without fixing it, they can use HA's
    built-in "Ignore issue" UI on the Repairs page.

    `self.data` is populated by ``async_create_issue(data=...)`` and contains::

        {
            "user_id": str,    # the orphaned HA user UUID
            "entry_id": str,   # the global config entry ID
        }
    """

    async def async_step_init(
        self, user_input: dict[str, str] | None = None
    ) -> data_entry_flow.FlowResult:
        """Show a confirmation form, then remove on submit."""
        issue_data = self.data or {}
        if user_input is not None:
            return await self.async_step_remove_user_id()
        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema({}),
            description_placeholders={
                "user_id": str(issue_data.get("user_id", "?"))[:8],
            },
        )

    async def async_step_remove_user_id(
        self, user_input: dict[str, Any] | None = None
    ) -> data_entry_flow.FlowResult:
        """Remove the orphaned id from admin_panel_user_ids and persist."""
        issue_data = self.data or {}
        entry = self.hass.config_entries.async_get_entry(
            str(issue_data.get("entry_id", ""))
        )
        if entry is None:
            return self.async_abort(reason="entry_gone")
        target_uid = str(issue_data.get("user_id", ""))
        ids = list(entry.options.get(CONF_ADMIN_PANEL_USER_IDS, []) or [])
        if target_uid in ids:
            ids.remove(target_uid)
            self.hass.config_entries.async_update_entry(
                entry,
                options={**entry.options, CONF_ADMIN_PANEL_USER_IDS: ids},
            )
        return self.async_create_entry(data={})


class StaleActionEntityRepairFlow(RepairsFlow):
    """Repair flow for an `on_complete_action.target.entity_id` that no longer
    resolves to an entity in HA. Three options:

    1. Replace — pick a new entity to point the action at
    2. Remove  — clear `on_complete_action` from the task entirely
    3. Ignore — fall through (user uses HA's Ignore-issue button)

    `self.data` carries::
        {
            "entry_id": str,    # the per-object config entry holding the task
            "task_id": str,     # the task whose action references the dead entity
            "task_name": str,   # for the description placeholder
            "stale_entity": str # the now-missing entity_id
        }
    """

    async def async_step_init(
        self, user_input: dict[str, str] | None = None
    ) -> data_entry_flow.FlowResult:
        return self.async_show_menu(
            step_id="init",
            menu_options=["replace_entity", "remove_action"],
            description_placeholders={
                "task_name": str((self.data or {}).get("task_name", "?")),
                "stale_entity": str((self.data or {}).get("stale_entity", "?")),
            },
        )

    async def async_step_replace_entity(
        self, user_input: dict[str, Any] | None = None
    ) -> data_entry_flow.FlowResult:
        if user_input is not None:
            entry = self._entry()
            if entry is None:
                return self.async_abort(reason="entry_gone")
            new_eid = str(user_input.get("new_entity", "")).strip()
            if not new_eid:
                return self.async_abort(reason="no_entity")
            self._patch_action_entity(entry, new_eid)
            return self.async_create_entry(data={})
        return self.async_show_form(
            step_id="replace_entity",
            data_schema=vol.Schema({
                vol.Required("new_entity"): selector.EntitySelector(),
            }),
            description_placeholders={
                "task_name": str((self.data or {}).get("task_name", "?")),
                "stale_entity": str((self.data or {}).get("stale_entity", "?")),
            },
        )

    async def async_step_remove_action(
        self, user_input: dict[str, Any] | None = None
    ) -> data_entry_flow.FlowResult:
        if user_input is not None:
            entry = self._entry()
            if entry is None:
                return self.async_abort(reason="entry_gone")
            self._clear_action(entry)
            return self.async_create_entry(data={})
        return self.async_show_form(
            step_id="remove_action",
            data_schema=vol.Schema({}),
            description_placeholders={
                "task_name": str((self.data or {}).get("task_name", "?")),
            },
        )

    def _entry(self) -> Any:
        return self.hass.config_entries.async_get_entry(
            str((self.data or {}).get("entry_id", ""))
        )

    def _patch_action_entity(self, entry: Any, new_entity_id: str) -> None:
        task_id = str((self.data or {}).get("task_id", ""))
        new_data = dict(entry.data)
        tasks = dict(new_data.get(CONF_TASKS, {}))
        task = dict(tasks.get(task_id) or {})
        action = dict(task.get("on_complete_action") or {})
        target = dict(action.get("target") or {})
        target["entity_id"] = new_entity_id
        action["target"] = target
        task["on_complete_action"] = action
        tasks[task_id] = task
        new_data[CONF_TASKS] = tasks
        self.hass.config_entries.async_update_entry(entry, data=new_data)

    def _clear_action(self, entry: Any) -> None:
        task_id = str((self.data or {}).get("task_id", ""))
        new_data = dict(entry.data)
        tasks = dict(new_data.get(CONF_TASKS, {}))
        task = dict(tasks.get(task_id) or {})
        task.pop("on_complete_action", None)
        tasks[task_id] = task
        new_data[CONF_TASKS] = tasks
        self.hass.config_entries.async_update_entry(entry, data=new_data)


async def async_create_fix_flow(
    hass: HomeAssistant,
    issue_id: str,
    data: dict[str, Any] | None,
) -> RepairsFlow:
    """Create a repair flow for the given issue."""
    if issue_id.startswith("orphan_admin_panel_user_"):
        return OrphanAdminPanelUserRepairFlow()
    if issue_id.startswith("stale_action_entity_"):
        return StaleActionEntityRepairFlow()
    return MissingTriggerEntityRepairFlow()
