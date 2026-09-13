"""To-do mirror (D#183): a due task shows up in the family's to-do lists.

A task may name one or more external ``todo.*`` entities in its
``mirror_todo_entities`` field. While the task is due (due_soon / overdue /
triggered) one row "<Object>: <Task>" is kept on every named list; when the
task goes back to OK (completed, skipped, reset, archived, paused, disabled,
list removed from the config) the rows we own are removed again. Checking a
row off in ANY of the lists completes the task here through the normal choke
point (``complete_maintenance(source="todo_mirror")``) and clears the rows on
every list. Maintenance Supporter stays the single source of truth; the lists
are a view.

Design rules (the shopping-list sync's, applied per task):

* **Only our own rows.** Every row we create is remembered per task in the
  object's Store (``todo_mirror`` = ``{list_entity: {"summary", "uid"}}``);
  foreign rows are never touched.
* **Declarative + best effort.** The coordinator hands each refresh's task
  results to :meth:`TodoMirror.async_sync_entry`, which diffs the wanted rows
  against the record. Service failures log and retry on the next refresh; a
  row a family member deletes by hand comes back (the task is still due —
  complete or skip it in Maintenance Supporter instead).
* **No existence requirement.** A list that loads after us (or does not
  exist yet) is skipped quietly, logged once, and picked up by the
  state-change listener the moment it appears.
* **Our own to-do platform is not a target** (it cannot take rows and would
  be circular); the WS layer refuses it, the mirror skips it defensively.

Known edge (mirrors the shopping sync): deleting a mirrored TASK drops its
Store record with it, so a row left on a list at that moment stays there
until a person removes it.
"""

from __future__ import annotations

import asyncio
import logging
from typing import TYPE_CHECKING, Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import CALLBACK_TYPE, Event, EventStateChangedData, HomeAssistant, callback
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.event import async_track_state_change_event

from ..const import COMPLETION_PROVENANCE_NOTES, CONF_TASKS, DOMAIN, GLOBAL_UNIQUE_ID, UNAVAILABLE_STATES, MaintenanceStatus
from .managed_timer import ManagedTimer

if TYPE_CHECKING:
    from ..coordinator import MaintenanceCoordinator
    from ..storage import MaintenanceStore

_LOGGER = logging.getLogger(__name__)

TODO_MIRROR_KEY = "todo_mirror"
MIRROR_FIELD = "mirror_todo_entities"
# Store task-state key holding {list_entity: {"summary": str, "uid": str | None}}.
MIRROR_STATE_KEY = "todo_mirror"
_DEBOUNCE_SECONDS = 2.0
# Statuses that put a row on the lists; everything else (ok, archived,
# paused — and a disabled task reads ok) takes it off.
MIRRORED_STATUSES = frozenset({MaintenanceStatus.DUE_SOON, MaintenanceStatus.OVERDUE, MaintenanceStatus.TRIGGERED})


def mirror_lists(task: dict[str, Any]) -> list[str]:
    """The task's configured mirror targets (validated shape assumed)."""
    raw = task.get(MIRROR_FIELD)
    return [e for e in raw if isinstance(e, str) and e] if isinstance(raw, list) else []


def mirror_summary(object_name: str, task: dict[str, Any]) -> str:
    """The row text — same shape as our own to-do platform and the shopping sync."""
    return f"{object_name}: {task.get('name', task.get('id', ''))}"


@callback
def schedule_check(hass: HomeAssistant) -> None:
    """Ask the mirror (if set up) to re-check its lists soon — safe from anywhere."""
    mirror = hass.data.get(DOMAIN, {}).get(TODO_MIRROR_KEY)
    if mirror is not None:
        mirror.schedule_check()


class TodoMirror:
    """Owns the rows Maintenance Supporter keeps on external to-do lists."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass
        # Serialises the per-entry reconcile (the coordinator refresh and the
        # list-change check both call it). NEVER held across
        # complete_maintenance: the completion's refresh re-enters
        # async_sync_entry and would deadlock.
        self._lock = asyncio.Lock()
        self._listening: dict[str, CALLBACK_TYPE] = {}
        self._missing_logged: set[str] = set()
        self._checking = False
        self._recheck = False
        self._debounce = ManagedTimer(hass, f"{DOMAIN}_todo_mirror")

    async def async_setup(self) -> None:
        """Arm the list listeners for every task that names a list (the
        entries' data is readable before they are loaded)."""
        self._arm_listeners(self._configured_lists())

    @callback
    def async_teardown(self) -> None:
        self._debounce.close()
        for unsub in self._listening.values():
            unsub()
        self._listening.clear()

    # ── config scan / listeners ───────────────────────────────────────────

    def _object_entries(self) -> list[ConfigEntry]:
        return [ce for ce in self._hass.config_entries.async_entries(DOMAIN) if ce.unique_id != GLOBAL_UNIQUE_ID]

    def _configured_lists(self) -> set[str]:
        lists: set[str] = set()
        for ce in self._object_entries():
            for td in (ce.data.get(CONF_TASKS) or {}).values():
                if isinstance(td, dict):
                    lists.update(mirror_lists(td))
        return lists

    @callback
    def _arm_listeners(self, wanted: set[str]) -> None:
        for eid in [e for e in self._listening if e not in wanted]:
            self._listening.pop(eid)()
        for eid in wanted - set(self._listening):
            self._listening[eid] = async_track_state_change_event(self._hass, [eid], self._on_list_changed)

    @property
    def listening_to(self) -> set[str]:
        return set(self._listening)

    @callback
    def _on_list_changed(self, _event: Event[EventStateChangedData]) -> None:
        self.schedule_check()

    @callback
    def schedule_check(self) -> None:
        """Debounced list check — every list change converges on one pass.
        A no-op once torn down (the timer is closed)."""
        self._debounce.schedule(_DEBOUNCE_SECONDS, self._fire_check)

    @callback
    def _fire_check(self, _now: Any) -> None:
        self._debounce.track_task(self.async_check_lists(), name=f"{DOMAIN}_todo_mirror_check")

    # ── the per-entry reconcile (called by the coordinator) ───────────────

    async def async_sync_entry(
        self,
        entry_id: str,
        task_results: dict[str, Any],
        *,
        store: MaintenanceStore,
        object_name: str,
    ) -> None:
        """Bring one object's rows in line with its freshly computed task
        results. Cheap when no task names a list and none has a record."""
        has_config = any(mirror_lists(tr) for tr in task_results.values() if isinstance(tr, dict))
        has_records = any(store.get_task_state(tid).get(MIRROR_STATE_KEY) for tid in task_results)
        if not has_config and not has_records:
            return
        self._arm_listeners(self._configured_lists())
        async with self._lock:
            try:
                await self._sync_entry_locked(task_results, store, object_name)
            except Exception:  # never fail the coordinator refresh; retried next time
                _LOGGER.exception("To-do mirror pass for entry %s failed", entry_id)

    async def _sync_entry_locked(self, task_results: dict[str, Any], store: MaintenanceStore, object_name: str) -> None:
        dirty = False
        for task_id, tr in task_results.items():
            if not isinstance(tr, dict):
                continue
            wanted = mirror_lists(tr) if tr.get("_status") in MIRRORED_STATUSES else []
            record: dict[str, Any] = dict(store.get_task_state(task_id).get(MIRROR_STATE_KEY) or {})
            if not wanted and not record:
                continue
            summary = mirror_summary(object_name, tr)
            changed = False
            # Rows we no longer want: list dropped from the config, task no
            # longer due, or the row text changed (task/object renamed).
            for eid, rec in list(record.items()):
                if eid in wanted and rec.get("summary") == summary:
                    continue
                await self._remove_item(eid, rec)
                record.pop(eid)
                changed = True
            # Rows still missing on a wanted list.
            for eid in wanted:
                if eid in record or not self._list_ready(eid):
                    continue
                uid = await self._add_item(eid, summary)
                if uid is False:
                    continue  # service failed — retried on the next refresh
                record[eid] = {"summary": summary, "uid": uid}
                changed = True
            if changed:
                store.update_task_state(task_id, **{MIRROR_STATE_KEY: record or None})
                dirty = True
        if dirty:
            store.async_delay_save()

    async def async_forget_task(self, store: MaintenanceStore, task_id: str) -> None:
        """A mirrored task is being deleted: take its rows off every list
        first, then drop the record (otherwise the rows would outlive the task
        — the Store state goes with the task)."""
        record: dict[str, Any] = dict(store.get_task_state(task_id).get(MIRROR_STATE_KEY) or {})
        if not record:
            return
        async with self._lock:
            for eid, rec in record.items():
                await self._remove_item(eid, rec)
            store.update_task_state(task_id, **{MIRROR_STATE_KEY: None})

    # ── the list check (state-change listener) ────────────────────────────

    async def async_check_lists(self) -> None:
        """Look at every mirrored list: a row checked off completes its task;
        a row deleted by hand is put back; lists that just appeared get
        their rows. Overlapping triggers coalesce into one extra pass."""
        if self._checking:
            self._recheck = True
            return
        self._checking = True
        try:
            await self._check_lists()
        except Exception:  # never crash the listener; the next change retries
            _LOGGER.exception("To-do mirror list check failed")
        finally:
            self._checking = False
            if self._recheck:
                self._recheck = False
                self.schedule_check()

    async def _check_lists(self) -> None:
        cache: dict[str, list[dict[str, Any]] | None] = {}

        async def rows_of(eid: str) -> list[dict[str, Any]] | None:
            if eid not in cache:
                cache[eid] = await self._get_items(eid) if self._list_ready(eid) else None
            return cache[eid]

        for ce in self._object_entries():
            rd = getattr(ce, "runtime_data", None)
            store: MaintenanceStore | None = getattr(rd, "store", None)
            coordinator: MaintenanceCoordinator | None = getattr(rd, "coordinator", None)
            if store is None or coordinator is None:
                continue
            tasks = ce.data.get(CONF_TASKS) or {}
            for task_id in list(tasks):
                record: dict[str, Any] = dict(store.get_task_state(task_id).get(MIRROR_STATE_KEY) or {})
                if not record:
                    continue
                checked_on: str | None = None
                gone: list[str] = []
                for eid, rec in record.items():
                    rows = await rows_of(eid)
                    if rows is None:
                        continue  # list not loaded — leave the record alone
                    uid = rec.get("uid")
                    row = next((r for r in rows if uid and r.get("uid") == uid), None)
                    if row is None:
                        gone.append(eid)
                    elif row.get("status") == "completed":
                        checked_on = eid
                        break
                if checked_on is not None:
                    # Drop the record FIRST: the completion's own refresh
                    # re-enters async_sync_entry, which must find nothing to
                    # keep; the captured record still names every row to clear.
                    store.update_task_state(task_id, **{MIRROR_STATE_KEY: None})
                    store.async_delay_save()
                    await self._complete(ce, coordinator, task_id, checked_on)
                    for eid, rec in record.items():
                        await self._remove_item(eid, rec)
                    cache.clear()
                elif gone:
                    # Hand-deleted rows: forget them so the reconcile below
                    # re-adds them while the task is still due.
                    for eid in gone:
                        record.pop(eid, None)
                    store.update_task_state(task_id, **{MIRROR_STATE_KEY: record or None})
                    store.async_delay_save()
            # Converge on the last computed status (rows for lists that just
            # appeared, rows deleted by hand, nothing after a completion).
            task_results = (coordinator.data or {}).get(CONF_TASKS) or {}
            if task_results:
                await self.async_sync_entry(
                    ce.entry_id, task_results, store=store, object_name=coordinator.maintenance_object.name
                )

    async def _complete(self, ce: ConfigEntry, coordinator: MaintenanceCoordinator, task_id: str, list_entity: str) -> None:
        task_name = (ce.data.get(CONF_TASKS) or {}).get(task_id, {}).get("name", task_id)
        try:
            await coordinator.complete_maintenance(
                task_id=task_id,
                notes=COMPLETION_PROVENANCE_NOTES["todo_mirror"],
                unattended=True,
                source="todo_mirror",
            )
        except Exception as err:  # noqa: BLE001 — a refused completion must not stall the pass
            # The rows are cleared and re-added by the reconcile, so the tick
            # visibly "bounces back" — say why.
            _LOGGER.warning(
                "To-do mirror: checking off %r in %s did not complete the task (%s); the row will reappear",
                task_name,
                list_entity,
                err,
            )

    # ── todo service wrappers (best effort) ───────────────────────────────

    def _list_ready(self, entity: str) -> bool:
        """The list exists, is available, is not ours, and todo services are up."""
        state = self._hass.states.get(entity)
        if state is None or state.state in UNAVAILABLE_STATES or not self._hass.services.has_service("todo", "get_items"):
            if f"missing:{entity}" not in self._missing_logged:
                self._missing_logged.add(f"missing:{entity}")
                _LOGGER.info("To-do mirror: list %s is not available (yet); its rows are added when it appears", entity)
            return False
        self._missing_logged.discard(f"missing:{entity}")
        reg_entry = er.async_get(self._hass).async_get(entity)
        if reg_entry is not None and reg_entry.platform == DOMAIN:
            if f"own:{entity}" not in self._missing_logged:
                self._missing_logged.add(f"own:{entity}")
                _LOGGER.warning("To-do mirror: %s is Maintenance Supporter's own list and is skipped", entity)
            return False
        return True

    async def _get_items(self, entity: str) -> list[dict[str, Any]] | None:
        try:
            resp = await self._hass.services.async_call(
                "todo",
                "get_items",
                {"entity_id": entity, "status": ["needs_action", "completed"]},
                blocking=True,
                return_response=True,
            )
        except Exception:  # noqa: BLE001 — provider errors are retried on the next trigger
            _LOGGER.warning("todo.get_items on %s failed", entity, exc_info=True)
            return None
        payload = (resp or {}).get(entity)
        items = payload.get("items") if isinstance(payload, dict) else None
        return [i for i in items if isinstance(i, dict)] if isinstance(items, list) else []

    async def _add_item(self, entity: str, summary: str) -> str | None | bool:
        """Add a row; returns its uid, None when the provider hid it, False on failure."""
        before = await self._get_items(entity)
        known = {i.get("uid") for i in before or [] if i.get("uid")}
        try:
            await self._hass.services.async_call("todo", "add_item", {"entity_id": entity, "item": summary}, blocking=True)
        except Exception:  # noqa: BLE001 — provider errors are retried on the next trigger
            _LOGGER.warning("todo.add_item %r on %s failed", summary, entity, exc_info=True)
            return False
        # add_item returns nothing — re-list and claim the new uid: by summary
        # first, then the single unclaimed leftover (a provider that
        # normalises the text still hands us the right row).
        after = await self._get_items(entity) or []
        fresh = [i for i in after if i.get("uid") and i["uid"] not in known]
        twin = next((i for i in fresh if i.get("summary") == summary), None)
        if twin is None and len(fresh) == 1:
            twin = fresh[0]
        if twin is None:
            _LOGGER.warning("To-do mirror: added %r to %s but could not identify the new row", summary, entity)
            return None
        return str(twin["uid"])

    async def _remove_item(self, entity: str, rec: dict[str, Any]) -> None:
        ref = rec.get("uid") or rec.get("summary")
        if not ref or self._hass.states.get(entity) is None:
            return  # nothing to remove, or the list is gone entirely
        try:
            await self._hass.services.async_call("todo", "remove_item", {"entity_id": entity, "item": ref}, blocking=True)
        except Exception:  # noqa: BLE001 — a row already gone is not an error worth more than a log line
            _LOGGER.warning("todo.remove_item %r on %s failed", ref, entity, exc_info=True)
