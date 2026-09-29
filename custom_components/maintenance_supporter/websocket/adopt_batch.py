"""Batch scaffolding shared by the two adopt endpoints (DRY audit 2026-09-26 B).

``problem_sensors/adopt`` and ``integration_setups/adopt`` both walk a list of
selections, create a target object on demand, persist sensor-wired tasks into
it and — when a selection fails — remove an object created for that selection
so no task-less orphan survives. The counters, the target-entry guard and the
rollback lived twice; the integration copy did not take back the tasks it had
already persisted into a rolled-back object (a device whose second task failed
reported one created task that no longer existed).

Every touched object is reloaded ONCE, by :meth:`finish` — persisting through
``async_persist_task`` reloaded the object after EVERY task, and on a real
install (thousands of entities) adopting one device took well over 30 s
while the dialog waited (reported from production, 2.95).
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
        # Objects that received tasks — reloaded once by finish().
        self._touched: set[str] = set()

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
        """Persist one adopted task and count it (the object reloads once, in
        :meth:`finish`)."""
        from homeassistant.util import dt as dt_util

        from ..helpers.entry_tasks import insert_new_task
        from ..helpers.global_options import get_default_warning_days

        # Like every other create path: the creation day (the next-due
        # anchor, and what a backup restores) and the household's warning
        # days — adoption left both out, so an export filled in the constant
        # 7 and the restore stamped the import day (round-trip audit
        # 2026-09-29).
        task_data.setdefault("created_at", dt_util.now().date().isoformat())
        task_data.setdefault("warning_days", get_default_warning_days(self.hass))
        store = insert_new_task(self.hass, entry, task_data)
        if store is not None:
            await store.async_save()
        self._touched.add(entry.entry_id)
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
        self._touched.discard(entry_id)
        self.begin()
        if self.hass.config_entries.async_get_entry(entry_id) is not None:
            await self.hass.config_entries.async_remove(entry_id)
        return True

    async def finish(self) -> None:
        """Reload every object that received tasks — once each — so their
        entities exist before the result goes out."""
        for entry_id in sorted(self._touched):
            if self.hass.config_entries.async_get_entry(entry_id) is not None:
                await self.hass.config_entries.async_reload(entry_id)
        self._touched.clear()

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
