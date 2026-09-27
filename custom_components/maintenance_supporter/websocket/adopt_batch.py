"""Batch scaffolding shared by the two adopt endpoints (DRY audit 2026-09-26 B).

``problem_sensors/adopt`` and ``integration_setups/adopt`` both walk a list of
selections, create a target object on demand, persist sensor-wired tasks into
it and — when a selection fails — remove an object created for that selection
so no task-less orphan survives. The counters, the target-entry guard and the
rollback lived twice; the integration copy did not take back the tasks it had
already persisted into a rolled-back object (a device whose second task failed
reported one created task that no longer existed).
"""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

from ..helpers.aggregate import is_object_entry

if TYPE_CHECKING:
    from homeassistant.config_entries import ConfigEntry
    from homeassistant.core import HomeAssistant


class AdoptBatch:
    """Counters, errors and per-selection rollback of one adopt request.

    Call :meth:`begin` at the start of every selection; objects created via
    :meth:`create_object` and tasks persisted into them via
    :meth:`persist_task` are then undone together by :meth:`fail`.
    """

    def __init__(self, hass: HomeAssistant) -> None:
        self.hass = hass
        self.tasks_created = 0
        self.objects_created = 0
        self.errors: list[dict[str, str]] = []
        # The object created for the CURRENT selection and how many of the
        # batch's tasks went into it (both undone by fail()).
        self._new_entry_id: str | None = None
        self._new_entry_tasks = 0

    def begin(self) -> None:
        """Start a selection: nothing has been created for it yet."""
        self._new_entry_id = None
        self._new_entry_tasks = 0

    async def create_object(self, *, name: str, ha_device_id: str | None) -> str:
        """Create the selection's target object; returns its entry id."""
        # Imported at call time (tests patch the module attributes).
        from .objects import async_create_object

        entry_id = await async_create_object(self.hass, name=name, ha_device_id=ha_device_id)
        self._new_entry_id = entry_id
        self.objects_created += 1
        return entry_id

    def target_entry(self, entry_id: str) -> ConfigEntry | None:
        """The object entry to adopt into, or None.

        Same guard as websocket._load_object_entry: the global settings entry
        is NOT a valid adoption target — async_persist_task writes CONF_TASKS +
        CONF_OBJECT["task_ids"] into whatever entry it is handed, so a
        client-supplied global entry_id would corrupt it.
        """
        entry = self.hass.config_entries.async_get_entry(entry_id)
        # is_object_entry() rejects None too; the explicit test narrows the type.
        if entry is None or not is_object_entry(entry):
            return None
        return entry

    async def persist_task(self, entry: ConfigEntry, task_data: dict[str, Any]) -> None:
        """Persist one adopted task and count it."""
        from .tasks_persist import async_persist_task

        await async_persist_task(self.hass, entry, task_data)
        self.tasks_created += 1
        if entry.entry_id == self._new_entry_id:
            self._new_entry_tasks += 1

    async def fail(self, error: dict[str, str]) -> bool:
        """Record a failed selection and remove the object created for it,
        together with the tasks already persisted into it — neither is left
        behind nor counted. True when an object was rolled back."""
        self.errors.append(error)
        entry_id = self._new_entry_id
        if entry_id is None:
            return False
        self.objects_created -= 1
        self.tasks_created -= self._new_entry_tasks
        self.begin()
        if self.hass.config_entries.async_get_entry(entry_id) is not None:
            await self.hass.config_entries.async_remove(entry_id)
        return True

    def result(self, **extra: Any) -> dict[str, Any]:
        """The WS result: counters, endpoint extras, the object total, errors."""
        from ..export import object_entries

        result: dict[str, Any] = {
            "tasks_created": self.tasks_created,
            "objects_created": self.objects_created,
            **extra,
            "total": len(object_entries(self.hass)),
        }
        if self.errors:
            result["errors"] = self.errors
        return result
