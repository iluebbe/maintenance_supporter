"""Persistent storage for dynamic maintenance state.

Frequently-changing data (history, last_performed, trigger runtime,
adaptive config) lives here instead of in ConfigEntry.data to avoid
excessive writes to ``core.config_entries`` which wears out SD cards.

Static task configuration (name, type, interval, trigger thresholds, etc.)
remains in ConfigEntry.data and is only written on explicit user edits.
"""

from __future__ import annotations

import logging
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import CONF_TASKS, DEFAULT_MAX_HISTORY_ENTRIES, DOMAIN

_LOGGER = logging.getLogger(__name__)

STORE_VERSION = 1
STORE_KEY_PREFIX = f"{DOMAIN}"
STORE_SAVE_DELAY = 1.0  # seconds — debounce for rapid updates

# Fields that migrate from ConfigEntry.data to Store
_DYNAMIC_TASK_FIELDS = ("last_performed", "history", "adaptive_config")

# Flat trigger_config keys that should move to Store trigger_runtime
_LEGACY_TRIGGER_RUNTIME_KEYS = (
    "trigger_baseline_value",
    "trigger_accumulated_seconds",
    "trigger_change_count",
    "trigger_on_since",
)


class MaintenanceStore:
    """Manages dynamic state storage for a single maintenance object.

    Each maintenance object config entry gets its own store file at
    ``.storage/maintenance_supporter.<entry_id>``.
    """

    def __init__(self, hass: HomeAssistant, entry_id: str) -> None:
        """Initialize the store."""
        self._store: Store[dict[str, Any]] = Store(
            hass, STORE_VERSION, f"{STORE_KEY_PREFIX}.{entry_id}"
        )
        self._data: dict[str, Any] = {"version": STORE_VERSION, "tasks": {}}

    # ------------------------------------------------------------------
    # Load / Save / Remove
    # ------------------------------------------------------------------

    async def async_load(self) -> dict[str, Any] | None:
        """Load store data.  Returns None if no store file exists."""
        raw = await self._store.async_load()
        if raw is not None:
            self._data = raw
        return raw

    def async_delay_save(self) -> None:
        """Schedule a debounced save (coalesces rapid writes)."""
        self._store.async_delay_save(self._get_data, STORE_SAVE_DELAY)

    async def async_save(self) -> None:
        """Immediate save (for migration or critical writes)."""
        await self._store.async_save(self._data)

    async def async_remove(self) -> None:
        """Delete the store file (called when config entry is removed)."""
        await self._store.async_remove()

    def _get_data(self) -> dict[str, Any]:
        """Return current data for save callback."""
        return self._data

    # ------------------------------------------------------------------
    # Task State Accessors
    # ------------------------------------------------------------------

    def _ensure_task(self, task_id: str) -> dict[str, Any]:
        """Ensure a task state dict exists and return it."""
        tasks = self._data.setdefault("tasks", {})
        if task_id not in tasks:
            tasks[task_id] = {}
        return tasks[task_id]

    def get_task_state(self, task_id: str) -> dict[str, Any]:
        """Return the dynamic state for a task (or empty dict)."""
        return self._data.get("tasks", {}).get(task_id, {})

    def init_task(
        self, task_id: str, last_performed: str | None = None
    ) -> None:
        """Initialize state for a newly created task."""
        state = self._ensure_task(task_id)
        if last_performed is not None:
            state["last_performed"] = last_performed
        state.setdefault("history", [])

    def remove_task(self, task_id: str) -> None:
        """Remove all state for a deleted task."""
        self._data.get("tasks", {}).pop(task_id, None)

    # --- last_performed ---

    def get_last_performed(self, task_id: str) -> str | None:
        """Return last_performed date string (or None)."""
        return self.get_task_state(task_id).get("last_performed")

    def set_last_performed(self, task_id: str, date_str: str) -> None:
        """Set last_performed date string."""
        self._ensure_task(task_id)["last_performed"] = date_str

    # --- history ---

    def get_history(self, task_id: str) -> list[dict[str, Any]]:
        """Return the history list for a task."""
        return self.get_task_state(task_id).get("history", [])

    def append_history(self, task_id: str, entry: dict[str, Any]) -> None:
        """Append a history entry and trim to max size."""
        state = self._ensure_task(task_id)
        history = state.setdefault("history", [])
        history.append(entry)
        if len(history) > DEFAULT_MAX_HISTORY_ENTRIES:
            state["history"] = history[-DEFAULT_MAX_HISTORY_ENTRIES:]

    def set_history(self, task_id: str, history: list[dict[str, Any]]) -> None:
        """Replace the entire history list."""
        self._ensure_task(task_id)["history"] = history

    # --- adaptive_config ---

    def get_adaptive_config(self, task_id: str) -> dict[str, Any] | None:
        """Return the adaptive config (or None)."""
        return self.get_task_state(task_id).get("adaptive_config")

    def set_adaptive_config(
        self, task_id: str, config: dict[str, Any]
    ) -> None:
        """Set the adaptive config."""
        self._ensure_task(task_id)["adaptive_config"] = config

    # --- trigger_runtime (per-entity) ---

    def get_trigger_runtime(
        self, task_id: str, entity_id: str | None = None
    ) -> dict[str, Any]:
        """Return trigger runtime data.

        If *entity_id* is given, return per-entity runtime data.
        Otherwise, return the whole trigger_runtime dict.
        """
        state = self.get_task_state(task_id)
        runtime = state.get("trigger_runtime", {})
        if entity_id is not None:
            return runtime.get(entity_id, {})
        return runtime

    def set_trigger_runtime(
        self,
        task_id: str,
        entity_id: str,
        data: dict[str, Any],
    ) -> None:
        """Set trigger runtime data for a specific entity."""
        state = self._ensure_task(task_id)
        runtime = state.setdefault("trigger_runtime", {})
        entity_state = runtime.setdefault(entity_id, {})
        entity_state.update(data)

    def clear_trigger_runtime(self, task_id: str) -> None:
        """Clear all trigger runtime data for a task."""
        state = self.get_task_state(task_id)
        state.pop("trigger_runtime", None)

    # ------------------------------------------------------------------
    # Merge / Split Helpers
    # ------------------------------------------------------------------

    def merge_task_data(
        self, task_id: str, static_data: dict[str, Any]
    ) -> dict[str, Any]:
        """Merge static ConfigEntry data with dynamic Store data.

        Returns a unified task dict compatible with ``MaintenanceTask.from_dict``.
        """
        result = dict(static_data)
        state = self.get_task_state(task_id)

        # Overlay dynamic fields
        for field in _DYNAMIC_TASK_FIELDS:
            if field in state:
                result[field] = state[field]

        # Merge trigger_runtime into trigger_config._trigger_state
        trigger_runtime = state.get("trigger_runtime")
        if trigger_runtime and "trigger_config" in result:
            tc = dict(result["trigger_config"])
            tc["_trigger_state"] = trigger_runtime
            result["trigger_config"] = tc

        return result

    def merge_all_tasks(
        self, static_tasks: dict[str, Any]
    ) -> dict[str, Any]:
        """Merge all tasks' static data with Store dynamic data."""
        return {
            task_id: self.merge_task_data(task_id, task_data)
            for task_id, task_data in static_tasks.items()
        }

    # ------------------------------------------------------------------
    # Migration
    # ------------------------------------------------------------------


def extract_dynamic_from_task(
    task_data: dict[str, Any],
) -> tuple[dict[str, Any], dict[str, Any]]:
    """Split a task dict into (static, dynamic) parts.

    Modifies neither input; returns new dicts.
    """
    static = dict(task_data)
    dynamic: dict[str, Any] = {}

    # Extract top-level dynamic fields
    for field in _DYNAMIC_TASK_FIELDS:
        if field in static:
            dynamic[field] = static.pop(field)

    # Extract trigger runtime from trigger_config
    if "trigger_config" in static:
        tc = dict(static["trigger_config"])
        runtime = tc.pop("_trigger_state", None)

        # Also extract legacy flat runtime keys into trigger_runtime
        flat_runtime: dict[str, Any] = {}
        for flat_key in _LEGACY_TRIGGER_RUNTIME_KEYS:
            val = tc.pop(flat_key, None)
            if val is not None:
                flat_runtime[flat_key] = val

        static["trigger_config"] = tc

        if runtime:
            dynamic["trigger_runtime"] = runtime
        elif flat_runtime:
            # Legacy: flat keys exist but no _trigger_state yet.
            # Store them as-is; the trigger objects will migrate to
            # per-entity format on first setup.
            dynamic["trigger_runtime_legacy"] = flat_runtime

    return static, dynamic


async def async_migrate_to_store(
    hass: HomeAssistant,
    entry_id: str,
    entry_data: dict[str, Any],
    store: MaintenanceStore,
) -> dict[str, Any]:
    """Migrate dynamic state from ConfigEntry.data into a Store.

    Returns the cleaned static-only entry data (for updating the ConfigEntry).
    The Store is saved immediately.

    This is idempotent: if the Store already has data, nothing happens
    and the original *entry_data* is returned unchanged.
    """
    existing = await store.async_load()
    if existing is not None:
        return entry_data  # Already migrated

    tasks_data = entry_data.get(CONF_TASKS, {})
    static_tasks: dict[str, Any] = {}

    for task_id, task_data in tasks_data.items():
        static, dynamic = extract_dynamic_from_task(task_data)
        static_tasks[task_id] = static

        # Populate store
        store.init_task(task_id)
        state = store._ensure_task(task_id)
        state.update(dynamic)

    # Save store immediately (must succeed before we strip ConfigEntry)
    await store.async_save()

    # Build cleaned entry data
    new_data = dict(entry_data)
    new_data[CONF_TASKS] = static_tasks

    _LOGGER.info(
        "Migrated %d tasks from ConfigEntry to Store for entry %s",
        len(tasks_data),
        entry_id,
    )

    return new_data
