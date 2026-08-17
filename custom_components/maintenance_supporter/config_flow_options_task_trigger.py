"""Trigger edit / summary / remove steps + opt_* wrappers (mixin)."""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

import voluptuous as vol
from homeassistant.config_entries import ConfigFlowResult
from homeassistant.helpers import selector

from .config_flow_trigger import TriggerConfigMixin
from .const import (
    CONF_TASK_INTERVAL_DAYS,
    CONF_TASK_SCHEDULE_TYPE,
    CONF_TASK_WARNING_DAYS,
    CONF_TASKS,
    ScheduleType,
    TriggerType,
)

if TYPE_CHECKING:
    from homeassistant.config_entries import ConfigEntry


class TriggerStepsMixin(TriggerConfigMixin):
    """Sensor-trigger editing steps; opt_* wrappers delegate to the
    shared TriggerConfigMixin. Owns the compound step aliases."""

    # -- provided by the assembled MaintenanceOptionsFlow --
    if TYPE_CHECKING:
        config_entry: ConfigEntry
        _selected_task_id: str | None

        def _show_task_action_menu(self) -> ConfigFlowResult: ...
        def _update_config_entry(self, new_data: dict[str, Any]) -> None: ...
        def async_show_menu(self, **kwargs: Any) -> ConfigFlowResult: ...

    async def async_step_edit_trigger(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
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
            if cond.get("trigger_equals") is not None:
                parts.append(f"= {cond['trigger_equals']}")
            if cond.get("trigger_not_equals") is not None:
                parts.append(f"≠ {cond['trigger_not_equals']}")
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
            entity_ids = [eid] if isinstance(eid, str) and eid else (eid if isinstance(eid, list) else [])
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
            if tc.get("trigger_equals") is not None:
                config_parts.append(f"= {tc['trigger_equals']}")
            if tc.get("trigger_not_equals") is not None:
                config_parts.append(f"≠ {tc['trigger_not_equals']}")
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
                c_detail = TriggerStepsMixin._condition_summary(cond)
                config_parts.append(f"#{i} {ctype}: {c_entities} ({c_detail})")
        return config_parts

    async def async_step_trigger_summary(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
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

    async def async_step_edit_trigger_proceed(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
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
            updated_task["interval_days"] = int(self._current_task[CONF_TASK_INTERVAL_DAYS])
        if CONF_TASK_WARNING_DAYS in self._current_task:
            updated_task["warning_days"] = int(self._current_task[CONF_TASK_WARNING_DAYS])

        new_tasks[self._selected_task_id or ""] = updated_task
        new_data[CONF_TASKS] = new_tasks
        self._update_config_entry(new_data)
        self._current_task = {}

        return self._show_task_action_menu()

    async def async_step_remove_trigger(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Confirm and remove trigger configuration from a task."""
        tasks_data = self.config_entry.data.get(CONF_TASKS, {})
        task = tasks_data.get(self._selected_task_id or "", {})
        tc = task.get("trigger_config", {})

        # Resolve entity list
        entity_ids = tc.get("entity_ids", [])
        if not entity_ids:
            eid = tc.get("entity_id", "")
            entity_ids = [eid] if isinstance(eid, str) and eid else (eid if isinstance(eid, list) else [])
        has_multiple = len(entity_ids) > 1

        if user_input is not None:
            if user_input.get("go_back"):
                return self._show_task_action_menu()

            if user_input.get("confirm"):
                entities_to_remove = user_input.get("entities_to_remove", entity_ids)
                remaining = [e for e in entity_ids if e not in entities_to_remove]

                new_data = dict(self.config_entry.data)
                new_tasks = dict(new_data.get(CONF_TASKS, {}))
                updated_task = dict(new_tasks.get(self._selected_task_id or "", {}))

                if remaining:
                    # Partial removal — keep trigger with remaining entities
                    updated_tc = dict(updated_task.get("trigger_config", {}))
                    updated_tc["entity_ids"] = remaining
                    updated_tc.pop("entity_id", None)
                    updated_task["trigger_config"] = updated_tc
                else:
                    # Full removal — remove entire trigger config
                    updated_task.pop("trigger_config", None)
                    if updated_task.get("schedule_type") == ScheduleType.SENSOR_BASED:
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
            schema_dict[vol.Required("entities_to_remove")] = selector.EntitySelector(
                selector.EntitySelectorConfig(
                    include_entities=entity_ids,
                    multiple=True,
                )
            )
        schema_dict[vol.Required("confirm", default=False)] = selector.BooleanSelector()
        schema_dict[vol.Optional("go_back", default=False)] = selector.BooleanSelector()

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

    async def async_step_opt_sensor_select(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
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

    async def async_step_opt_sensor_attribute(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Select attribute to monitor."""
        return await self._trigger_sensor_attribute(
            user_input,
            step_id="opt_sensor_attribute",
            next_step=self.async_step_opt_trigger_type,
            error_step_id="opt_sensor_select",
        )

    async def async_step_opt_trigger_type(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
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

    async def async_step_opt_trigger_threshold(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Configure threshold trigger."""
        return await self._trigger_threshold_config(
            user_input,
            step_id="opt_trigger_threshold",
            on_complete=self._trigger_on_complete,
        )

    async def async_step_opt_trigger_counter(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Configure counter trigger."""
        return await self._trigger_counter_config(
            user_input,
            step_id="opt_trigger_counter",
            on_complete=self._trigger_on_complete,
        )

    async def async_step_opt_trigger_state_change(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Configure state change trigger."""
        return await self._trigger_state_change_config(
            user_input,
            step_id="opt_trigger_state_change",
            on_complete=self._trigger_on_complete,
        )

    async def async_step_opt_trigger_runtime(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Configure runtime trigger."""
        return await self._trigger_runtime_config(
            user_input,
            step_id="opt_trigger_runtime",
            on_complete=self._trigger_on_complete,
        )

    async def async_step_opt_compound_logic(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Select compound trigger logic."""
        return await self._trigger_compound_logic(
            user_input,
            step_id="compound_logic",
            next_step=self.async_step_opt_compound_condition_entity,
        )

    async def async_step_opt_compound_condition_entity(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Select entity for compound condition."""
        return await self._trigger_compound_condition_entity(
            user_input,
            step_id="compound_condition_entity",
            next_step=self.async_step_opt_compound_condition_type,
        )

    async def async_step_opt_compound_condition_type(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Select trigger type for compound condition."""
        return await self._trigger_compound_condition_type(
            user_input,
            step_id="compound_condition_type",
            threshold_step=self.async_step_opt_compound_condition_threshold,
            counter_step=self.async_step_opt_compound_condition_counter,
            state_change_step=self.async_step_opt_compound_condition_state_change,
            runtime_step=self.async_step_opt_compound_condition_runtime,
        )

    async def async_step_opt_compound_condition_threshold(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Configure threshold for compound condition."""
        return await self._trigger_compound_condition_config(
            user_input,
            "threshold",
            step_id="compound_condition_threshold",
            on_complete=self.async_step_opt_compound_review,
        )

    async def async_step_opt_compound_condition_counter(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Configure counter for compound condition."""
        return await self._trigger_compound_condition_config(
            user_input,
            "counter",
            step_id="compound_condition_counter",
            on_complete=self.async_step_opt_compound_review,
        )

    async def async_step_opt_compound_condition_state_change(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Configure state_change for compound condition."""
        return await self._trigger_compound_condition_config(
            user_input,
            "state_change",
            step_id="compound_condition_state_change",
            on_complete=self.async_step_opt_compound_review,
        )

    async def async_step_opt_compound_condition_runtime(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Configure runtime for compound condition."""
        return await self._trigger_compound_condition_config(
            user_input,
            "runtime",
            step_id="compound_condition_runtime",
            on_complete=self.async_step_opt_compound_review,
        )

    async def async_step_opt_compound_review(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Review compound trigger conditions."""
        return await self._trigger_compound_review(
            user_input,
            step_id="compound_review",
            add_condition_step=self.async_step_opt_compound_condition_entity,
            on_complete=self._trigger_on_complete,
        )

    # Compound step aliases — HA routes by async_step_<step_id>;
    # these expose the opt_* compound steps under their bare names.
    async_step_compound_logic = async_step_opt_compound_logic

    async_step_compound_condition_entity = async_step_opt_compound_condition_entity

    async_step_compound_condition_type = async_step_opt_compound_condition_type

    async_step_compound_condition_threshold = async_step_opt_compound_condition_threshold

    async_step_compound_condition_counter = async_step_opt_compound_condition_counter

    async_step_compound_condition_state_change = async_step_opt_compound_condition_state_change

    async_step_compound_condition_runtime = async_step_opt_compound_condition_runtime

    async_step_compound_review = async_step_opt_compound_review
