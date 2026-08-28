"""Shopping-list sync: mirror auto "buy" tasks into a user-picked HA to-do list.

The parts machinery already maintains one declarative "buy" task per low part
(helpers/parts.reconcile_buy_tasks). This module mirrors exactly those tasks
into the ``todo.*`` entity configured by the global ``shopping_list_entity``
option — the built-in version of the automation ``docs/EXAMPLES.md`` used to
ask users to write themselves:

* buy task appears        → ``todo.add_item`` on the configured list
* buy task disappears     → our item is removed (restocked in the panel,
                            part opted out / deleted)
* item CHECKED in the list → the buy task is completed through the normal
  choke point (``complete_maintenance`` restocks the part by its configured
  default), then our item is removed — the task's own history carries the
  record.

Design rules:

* **Only our own rows.** Every item we create is remembered (uid) in a small
  global Store; foreign items are never touched.
* **Declarative + best effort.** The resync recomputes the desired set from
  the entries and diffs it against the mapping; service failures log and
  retry on the next trigger, they never crash a caller. A row the user
  deletes by hand comes back on the next resync — opt out via the part's
  ``auto_buy_task`` or by clearing the option.
* **No existence requirement.** The configured entity may load after us;
  the state-change listener self-heals on first appearance.

Known edge: deleting a buy TASK by hand (WS task/delete) leaves its row until
the next trigger (stock change / list change / restart) — the resync is
event-driven, not polled.
"""

from __future__ import annotations

import asyncio
import logging
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import EVENT_HOMEASSISTANT_STARTED
from homeassistant.core import (
    CALLBACK_TYPE,
    CoreState,
    Event,
    EventStateChangedData,
    HassJob,
    HomeAssistant,
    callback,
)
from homeassistant.helpers.event import async_call_later, async_track_state_change_event
from homeassistant.helpers.storage import Store

from .const import CONF_SHOPPING_LIST_ENTITY, CONF_TASKS, DOMAIN, GLOBAL_UNIQUE_ID
from .helpers.global_options import get_global_options
from .helpers.parts import PART_REF_FIELD

_LOGGER = logging.getLogger(__name__)

SHOPPING_SYNC_KEY = "shopping_sync"
_STORAGE_KEY = f"{DOMAIN}.shopping_sync"
_STORAGE_VERSION = 1
_DEBOUNCE_SECONDS = 2.0


@callback
def schedule_resync(hass: HomeAssistant) -> None:
    """Ask the sync (if configured) to reconcile soon — safe from anywhere."""
    sync = hass.data.get(DOMAIN, {}).get(SHOPPING_SYNC_KEY)
    if sync is not None:
        sync.schedule_resync()


class ShoppingListSync:
    """Owns the mapping between our buy tasks and rows in the user's list."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass
        self._store: Store[dict[str, Any]] = Store(hass, _STORAGE_VERSION, _STORAGE_KEY)
        # {"entity_id": "todo.x", "items": {"<entry>:<task>": {"uid":, "summary":}}}
        self._data: dict[str, Any] = {"entity_id": "", "items": {}}
        self._lock = asyncio.Lock()
        self._listening_to: str | None = None
        self._unsub_state: CALLBACK_TYPE | None = None
        self._unsub_started: CALLBACK_TYPE | None = None
        self._debounce: CALLBACK_TYPE | None = None

    async def async_setup(self) -> None:
        loaded = await self._store.async_load()
        if isinstance(loaded, dict):
            items = loaded.get("items")
            self._data = {
                "entity_id": str(loaded.get("entity_id") or ""),
                "items": dict(items) if isinstance(items, dict) else {},
            }
        # NOT is_running — that is already True during CoreState.starting,
        # and the initial pass should wait until entities are actually loaded.
        if self._hass.state is CoreState.running:
            self.schedule_resync()
        else:
            self._unsub_started = self._hass.bus.async_listen_once(
                EVENT_HOMEASSISTANT_STARTED, self._on_started
            )

    @callback
    def async_teardown(self) -> None:
        for unsub in (self._unsub_state, self._unsub_started, self._debounce):
            if unsub is not None:
                unsub()
        self._unsub_state = self._unsub_started = self._debounce = None
        self._listening_to = None

    async def async_handle_rename(self, old_eid: str, new_eid: str) -> None:
        """Follow an HA entity-registry rename of the configured list."""
        if str(self._data.get("entity_id") or "") == old_eid:
            self._data["entity_id"] = new_eid
            await self._save()
        self._arm_listener(new_eid)
        self.schedule_resync()

    @callback
    def _on_started(self, _event: Event) -> None:
        self._unsub_started = None
        self.schedule_resync()

    @callback
    def _on_list_changed(self, _event: Event[EventStateChangedData]) -> None:
        self.schedule_resync()

    @callback
    def schedule_resync(self) -> None:
        """Debounced resync — every trigger converges on one pass."""
        if self._debounce is not None:
            self._debounce()

        @callback
        def _fire(_now: Any) -> None:
            self._debounce = None
            self._hass.async_create_task(
                self.async_resync(), name=f"{DOMAIN}_shopping_sync"
            )

        # cancel_on_shutdown: a pending debounce must never outlive HA (or a
        # test teardown) — the resync it carries is worthless after shutdown.
        self._debounce = async_call_later(
            self._hass, _DEBOUNCE_SECONDS, HassJob(_fire, cancel_on_shutdown=True)
        )

    def configured_entity(self) -> str:
        return str(get_global_options(self._hass).get(CONF_SHOPPING_LIST_ENTITY) or "")

    # ── the reconcile ─────────────────────────────────────────────────────

    async def async_resync(self) -> None:
        async with self._lock:
            try:
                await self._resync_locked()
            except Exception:  # never crash a caller; retried on the next trigger
                _LOGGER.exception("Shopping-list sync pass failed")

    async def _resync_locked(self) -> None:
        entity = self.configured_entity()
        self._arm_listener(entity)

        # Target changed (or cleared): pull our rows out of the OLD list
        # first, then start fresh against the new one.
        old_entity = str(self._data.get("entity_id") or "")
        if old_entity and old_entity != entity:
            await self._remove_all_from(old_entity)
            self._data = {"entity_id": entity, "items": {}}
            await self._save()
        if not entity:
            return
        self._data["entity_id"] = entity

        if self._hass.states.get(entity) is None:
            return  # not loaded yet — the listener re-triggers on appearance

        listed = await self._get_items(entity)
        if listed is None:
            return
        by_uid = {i["uid"]: i for i in listed if i.get("uid")}
        mapping: dict[str, dict[str, Any]] = self._data["items"]
        changed = False

        # 1. Rows the user checked → complete the buy task (restocks the part
        #    by its configured default), then drop the row.
        for key, rec in list(mapping.items()):
            item = by_uid.get(rec.get("uid"))
            if item is None or item.get("status") != "completed":
                continue
            await self._complete_buy_task(key)
            await self._remove_item(entity, rec)
            mapping.pop(key, None)
            changed = True

        desired = self._desired()

        # 2. Buy tasks gone (restocked / opted out / deleted) → drop the row.
        for key, rec in list(mapping.items()):
            if key in desired:
                continue
            if rec.get("uid") in by_uid:
                await self._remove_item(entity, rec)
            mapping.pop(key, None)
            changed = True

        # 3. New buy tasks (or rows the user deleted by hand) → add.
        to_add = {
            key: summary
            for key, summary in desired.items()
            if key not in mapping or mapping[key].get("uid") not in by_uid
        }
        if to_add:
            known = set(by_uid)
            for key, summary in to_add.items():
                if not await self._add_item(entity, summary):
                    continue
                mapping[key] = {"uid": None, "summary": summary}
                changed = True
            # add_item returns nothing — re-list and claim the new uids.
            relisted = await self._get_items(entity) or []
            unclaimed = [
                i for i in relisted
                if i.get("uid") and i["uid"] not in known
            ]
            for rec in mapping.values():
                if rec.get("uid") is not None:
                    continue
                for item in unclaimed:
                    if item.get("summary") == rec["summary"]:
                        rec["uid"] = item["uid"]
                        unclaimed.remove(item)
                        break

        if changed or to_add:
            await self._save()

    def _desired(self) -> dict[str, str]:
        """Open buy tasks across all object entries → {key: row summary}."""
        out: dict[str, str] = {}
        for ce in self._hass.config_entries.async_entries(DOMAIN):
            if ce.unique_id == GLOBAL_UNIQUE_ID:
                continue
            rd = getattr(ce, "runtime_data", None)
            store = getattr(rd, "store", None)
            coordinator = getattr(rd, "coordinator", None)
            if store is None or coordinator is None:
                continue
            obj_name = coordinator.maintenance_object.name
            for tid, td in (ce.data.get(CONF_TASKS) or {}).items():
                ref = td.get(PART_REF_FIELD)
                if not isinstance(ref, dict) or not ref.get("part_id"):
                    continue
                if not td.get("enabled", True):
                    continue
                if store.get_last_performed(tid) is not None:
                    continue  # completed reminder — history, not shopping
                # Same summary shape as our own to-do platform.
                out[f"{ce.entry_id}:{tid}"] = f"{obj_name}: {td.get('name', tid)}"
        return out

    async def _complete_buy_task(self, key: str) -> None:
        entry_id, _, task_id = key.partition(":")
        ce: ConfigEntry | None = self._hass.config_entries.async_get_entry(entry_id)
        if ce is None:
            return
        rd = getattr(ce, "runtime_data", None)
        coordinator = getattr(rd, "coordinator", None)
        store = getattr(rd, "store", None)
        if coordinator is None or store is None:
            return
        if task_id not in (ce.data.get(CONF_TASKS) or {}):
            return
        if store.get_last_performed(task_id) is not None:
            return  # already completed elsewhere
        try:
            await coordinator.complete_maintenance(
                task_id=task_id,
                notes="Completed from the shopping list",
                unattended=True,
            )
        except Exception:
            _LOGGER.exception("Completing buy task %s from the shopping list failed", key)

    # ── todo service wrappers (best effort) ───────────────────────────────

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

    async def _add_item(self, entity: str, summary: str) -> bool:
        try:
            await self._hass.services.async_call(
                "todo", "add_item", {"entity_id": entity, "item": summary}, blocking=True
            )
        except Exception:  # noqa: BLE001 — provider errors are retried on the next trigger
            _LOGGER.warning("todo.add_item %r on %s failed", summary, entity, exc_info=True)
            return False
        return True

    async def _remove_item(self, entity: str, rec: dict[str, Any]) -> None:
        ref = rec.get("uid") or rec.get("summary")
        if not ref:
            return
        try:
            await self._hass.services.async_call(
                "todo", "remove_item", {"entity_id": entity, "item": ref}, blocking=True
            )
        except Exception:  # noqa: BLE001 — provider errors are retried on the next trigger
            _LOGGER.warning("todo.remove_item %r on %s failed", ref, entity, exc_info=True)

    async def _remove_all_from(self, entity: str) -> None:
        if self._hass.states.get(entity) is None:
            return  # old list gone entirely — nothing to clean
        for rec in list(self._data.get("items", {}).values()):
            await self._remove_item(entity, rec)

    # ── plumbing ──────────────────────────────────────────────────────────

    @callback
    def _arm_listener(self, entity: str) -> None:
        if entity == self._listening_to:
            return
        if self._unsub_state is not None:
            self._unsub_state()
            self._unsub_state = None
        self._listening_to = entity or None
        if entity:
            self._unsub_state = async_track_state_change_event(
                self._hass, [entity], self._on_list_changed
            )

    async def _save(self) -> None:
        await self._store.async_save(
            {"entity_id": self._data.get("entity_id", ""), "items": self._data.get("items", {})}
        )
