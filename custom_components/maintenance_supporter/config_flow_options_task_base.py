"""Base for the per-object task options flow: shared state + B1 helpers.

The MaintenanceOptionsFlow steps are split across sibling mixins; this base
holds the __init__ state, the single persist path, and the init/menu steps
they all rely on. Assembled in config_flow_options_task.py."""

from __future__ import annotations

from collections.abc import Mapping
from datetime import date as date_cls
from typing import Any
from uuid import uuid4

from homeassistant.config_entries import ConfigFlowResult, OptionsFlow
from homeassistant.core import State, callback
from homeassistant.util import dt as dt_util

from .config_flow_schedule import build_new_task_record
from .config_flow_trigger import TriggerConfigMixin
from .const import (
    CONF_ADVANCED_ADAPTIVE,
    CONF_ADVANCED_CHECKLISTS,
    CONF_OBJECT,
    CONF_TASKS,
    MAX_TASKS_PER_OBJECT,
)
from .helpers.aggregate import store_of
from .helpers.global_options import get_global_options
from .helpers.history import completed_entries
from .helpers.schedule import (
    Schedule,
    cycle_state,
    normalize_task_storage,
    preview_occurrences,
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
                CONF_TASKS: {tid: normalize_task_storage(td) for tid, td in tasks.items()},
            }
        self.hass.config_entries.async_update_entry(self.config_entry, data=new_data)

    def _save_new_task(self) -> ConfigFlowResult:
        """Save the current task and return to init."""
        from .helpers.entry_tasks import insert_new_task

        task_id = uuid4().hex
        task_data = build_new_task_record(
            self._current_task,
            task_id=task_id,
            object_id=self.config_entry.data.get(CONF_OBJECT, {}).get("id", ""),
            hass=self.hass,
        )
        # The one create rule shared with task/create and add_task (cap,
        # task_ids, Store init). The flow keeps its own save/reload timing:
        # delay-save now, reload on the done step. A refusal is said: the
        # flow went back to the menu and the task was simply gone (bug audit
        # 2026-10-17, N-16).
        try:
            store = insert_new_task(self.hass, self.config_entry, task_data, last_performed=self._current_task.get("last_performed"))
        except ValueError:
            self._current_task = {}
            return self._add_task_refused() or self.async_abort(reason="task_limit", description_placeholders={"max": str(MAX_TASKS_PER_OBJECT)})
        if store is not None:
            store.async_delay_save()

        self._current_task = {}

        return self._show_init_menu()

    def _add_task_refused(self) -> ConfigFlowResult | None:
        """The abort when this object takes no new task (archived, or at the
        cap) — said before the form, not after it was filled in."""
        if (self.config_entry.data.get(CONF_OBJECT) or {}).get("archived_at"):
            return self.async_abort(reason="archived_no_new_tasks")
        if len(self.config_entry.data.get(CONF_TASKS) or {}) >= MAX_TASKS_PER_OBJECT:
            return self.async_abort(reason="task_limit", description_placeholders={"max": str(MAX_TASKS_PER_OBJECT)})
        return None

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

    async def async_step_init(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Show main options menu."""
        # What the entry looked like when the flow opened (G8, async_remove).
        if not hasattr(self, "_data_at_start"):
            self._data_at_start = self.config_entry.data
        return self._show_init_menu()

    @callback
    def async_remove(self) -> None:
        """The flow went away. Closed with its X instead of "Done", what the
        steps had saved was in the entry, but the running object reloads only
        on "Done" — its tasks and entities stayed as they were until a
        restart (bug audit 2026-10-16, G8). A changed entry reloads now."""
        # Not while Home Assistant stops: it aborts every open flow then.
        if getattr(self, "_reloaded", False) or getattr(self, "_data_at_start", None) is None or not self.hass.is_running:
            return
        entry = self.hass.config_entries.async_get_entry(self.handler) if isinstance(self.handler, str) else None
        if entry is not None and entry.data is not self._data_at_start:
            self.hass.config_entries.async_schedule_reload(entry.entry_id)

    async def async_step_done(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Close the options flow."""
        self._reloaded = True
        # Flush store and reload to pick up config changes from this flow
        store = store_of(self.config_entry)
        if store is not None:
            await store.async_save()
        self.hass.async_create_task(self.hass.config_entries.async_reload(self.config_entry.entry_id))
        return self.async_create_entry(title="", data=self.config_entry.options)

    def _get_global_options(self) -> dict[str, Any]:
        """Get global options from the global config entry."""
        return dict(get_global_options(self.hass))

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
        # #139: cycle phases are not feature-gated (the panel editor isn't
        # either) — the minimal flow editor is always reachable.
        menu.append("edit_phases")
        if global_opts.get(CONF_ADVANCED_ADAPTIVE, False):
            menu.append("adaptive_scheduling")
        menu.extend(["delete_task", "manage_tasks"])
        return menu

    def _show_task_action_menu(self) -> ConfigFlowResult:
        """Show the task_action menu (sync helper for callbacks)."""
        tasks_data = self.config_entry.data.get(CONF_TASKS, {})
        task_id = self._selected_task_id or ""
        task = tasks_data.get(task_id, {})
        return self.async_show_menu(
            step_id="task_action",
            menu_options=self._build_task_action_menu(),
            description_placeholders={
                "task_name": task.get("name", "Unknown"),
                "next_dates": self._next_dates_line(task_id, task),
            },
        )

    def _next_dates_line(self, task_id: str, static_task: dict[str, Any]) -> str:
        """The task's next three due dates — the flow-side twin of the panel's
        live schedule preview (#83), computed by the SAME engine helper
        (helpers.schedule.preview_occurrences) so the two surfaces stay DRY.

        Rendered ISO (YYYY-MM-DD): server-side text has no user locale, and
        ISO is the only order-unambiguous form. Menus re-render after every
        schedule edit, so the line updates right after saving."""
        merged: Mapping[str, Any] = dict(static_task)
        store = store_of(self.config_entry)
        if store is not None:
            merged = store.merge_task_data(task_id, merged)

        try:
            sched = Schedule.parse(merged)
            lp_raw = merged.get("last_performed")
            lp = date_cls.fromisoformat(lp_raw[:10]) if isinstance(lp_raw, str) and lp_raw else None
            times = len(completed_entries(merged.get("history")))
            dates, _ended = preview_occurrences(
                sched, last_performed=lp, times_performed=times, today=dt_util.now().date(), **cycle_state(merged)
            )
        except (TypeError, ValueError):  # pragma: no cover — malformed legacy data
            return "—"
        if not dates:
            return "—"
        return " · ".join(d.isoformat() for d in dates)
