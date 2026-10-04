"""Places: where an object is maintained — an HA zone, home by default.

An object stores the zone's entity id as ``place``; empty (and
``zone.home``) means home, so an installation that never sets a place
changes nothing. A place does three things:

* ``remind_on_site`` holds the object's reminders until somebody is staying
  in the zone (the ``on_site`` gate in helpers/notification_gates.py) — a
  task at the allotment garden stops nagging at home and speaks up when it
  can be done. Vacation mode, which is about being away from home, does not
  silence a place while somebody is there.
* :class:`PlaceArrivals` tells a person what is due at a place when they
  arrive there: after a short stay (a drive past a zone edge is no visit),
  once per visit, to that person's own phones only. For an object whose
  reminders wait for somebody on site that message is the visit's
  reminder: the held reminders do not follow it to everybody.
* The calendar names the place as the events' location.

Zones are Home Assistant's: nothing here stores positions or movements, it
only compares the zones a person is in (``in_zones``, reported by the
companion apps since 2026.6; the state's zone name before that). No data is
no verdict: a person who is briefly ``unavailable`` neither left nor arrived,
and a missing zone or an unknown occupancy never silences a reminder.
"""

from __future__ import annotations

import logging
import time
from collections.abc import Mapping
from datetime import datetime
from functools import partial
from typing import Any

from homeassistant.const import EVENT_STATE_CHANGED, STATE_HOME
from homeassistant.core import CALLBACK_TYPE, Event, HomeAssistant, State, callback
from homeassistant.helpers.event import EventStateChangedData, async_call_later
from homeassistant.util import dt as dt_util

from ..const import (
    CONF_OBJECT,
    CONF_OBJECT_PLACE,
    CONF_OBJECT_REMIND_ON_SITE,
    CONF_TASKS,
    DOMAIN,
    NOTIFICATION_MANAGER_KEY,
    PLACE_ARRIVAL_COOLDOWN_SECONDS,
    PLACE_ARRIVAL_DWELL_SECONDS,
    UNAVAILABLE_STATES,
    MaintenanceStatus,
)
from .aggregate import get_object_entries

_LOGGER = logging.getLogger(__name__)

HOME_ZONE = "zone.home"
PLACES_KEY = f"{DOMAIN}_place_arrivals"

# The statuses an arrival message lists — what can be done now.
ARRIVAL_STATUSES = (MaintenanceStatus.OVERDUE, MaintenanceStatus.TRIGGERED, MaintenanceStatus.DUE_SOON)


def normalize_place(raw: Any) -> str | None:
    """A zone's entity id, or None for home: empty, ``zone.home`` and
    anything that is not a zone all mean home."""
    if not isinstance(raw, str):
        return None
    value = raw.strip()
    if not value or value == HOME_ZONE or not value.startswith("zone."):
        return None
    return value


def object_place(obj_data: Mapping[str, Any] | None) -> str | None:
    """The object's place (None = home)."""
    return normalize_place((obj_data or {}).get(CONF_OBJECT_PLACE))


def zone_name(hass: HomeAssistant, zone_id: str | None) -> str | None:
    """The zone's display name, None when there is no such zone."""
    state = hass.states.get(zone_id) if zone_id else None
    return state.name if state is not None else None


def somebody_staying(hass: HomeAssistant, zone_id: str) -> bool | None:
    """Whether somebody is staying in the zone: it is occupied and its
    count has not changed for the arrival dwell. The count moves the moment
    a phone reports a zone edge, a drive past included; the dwell makes
    that no visit, as for the arrival message (a second person arriving or
    one of two leaving restarts it: the reminders wait those two minutes
    longer). None when that is not known: no such zone, a state that is no
    count."""
    state = hass.states.get(zone_id)
    if state is None:
        return None
    try:
        count = int(float(state.state))
    except (TypeError, ValueError):
        return None
    if count <= 0:
        return False
    return (dt_util.utcnow() - state.last_changed).total_seconds() >= PLACE_ARRIVAL_DWELL_SECONDS


def _entry_object(hass: HomeAssistant, entry_id: str) -> Mapping[str, Any] | None:
    entry = hass.config_entries.async_get_entry(entry_id)
    return entry.data.get(CONF_OBJECT) if entry is not None else None


def reminds_on_site(hass: HomeAssistant, entry_id: str) -> str | None:
    """The object's place when its reminders wait for somebody there."""
    obj = _entry_object(hass, entry_id)
    place = object_place(obj)
    return place if place is not None and (obj or {}).get(CONF_OBJECT_REMIND_ON_SITE) else None


def waits_for_someone_on_site(hass: HomeAssistant, entry_id: str) -> bool:
    """True when the object's reminders wait for somebody on site and
    nobody is staying there right now. Never True without data: no place,
    a zone that does not exist (any more) or an occupancy that is not a
    number leave the reminders as they were."""
    place = reminds_on_site(hass, entry_id)
    return place is not None and somebody_staying(hass, place) is False


def somebody_on_site(hass: HomeAssistant, entry_id: str) -> bool:
    """True when the object has a place away from home and somebody is
    staying there now — vacation mode (being away from HOME) does not
    silence it."""
    place = object_place(_entry_object(hass, entry_id))
    return place is not None and somebody_staying(hass, place) is True


def zones_of(hass: HomeAssistant, state: State) -> set[str] | None:
    """The zones a person (or tracker) is in; None when the state carries
    no position (unknown / unavailable) — no data, no verdict."""
    if state.state in UNAVAILABLE_STATES:
        return None
    raw = state.attributes.get("in_zones")
    if isinstance(raw, list):
        return {z for z in raw if isinstance(z, str) and z.startswith("zone.")}
    # Cores and trackers without in_zones: the state is the zone's name.
    if state.state == STATE_HOME:
        return {HOME_ZONE}
    for zone_state in hass.states.async_all("zone"):
        if zone_state.name == state.state:
            return {zone_state.entity_id}
    return set()


def objects_at(hass: HomeAssistant, zone_id: str) -> list[Any]:
    """The loaded object entries maintained at ``zone_id``."""
    out = []
    for entry in get_object_entries(hass):
        if object_place(entry.data.get(CONF_OBJECT)) != zone_id:
            continue
        rd = getattr(entry, "runtime_data", None)
        if getattr(rd, "coordinator", None) is not None:
            out.append(entry)
    return out


def due_tasks_at(hass: HomeAssistant, zone_id: str) -> list[dict[str, Any]]:
    """What can be done at ``zone_id`` now: the tasks of its objects that
    are overdue, triggered or due soon (most urgent first). Each item
    carries the task's config merged with its computed state, for the
    per-task notification gates."""
    from .phases import task_label

    rank = {status: i for i, status in enumerate(ARRIVAL_STATUSES)}
    out: list[dict[str, Any]] = []
    for entry in objects_at(hass, zone_id):
        coordinator = entry.runtime_data.coordinator
        results = (coordinator.data or {}).get(CONF_TASKS) or {}
        configs = entry.data.get(CONF_TASKS) or {}
        for task_id, result in results.items():
            status = result.get("_status")
            if status not in rank:
                continue
            out.append(
                {
                    "entry_id": entry.entry_id,
                    "task_id": task_id,
                    "task_name": task_label(result),
                    "object_name": coordinator.maintenance_object.name,
                    "status": status,
                    "task_data": {**(configs.get(task_id) or {}), **result},
                }
            )
    out.sort(key=lambda t: (rank[t["status"]], t["object_name"], t["task_name"]))
    return out


@callback
def _is_person_change(event_data: EventStateChangedData) -> bool:
    return str(event_data.get("entity_id", "")).startswith("person.")


class PlaceArrivals:
    """Tells a person what is due at a place when they arrive there."""

    def __init__(self, hass: HomeAssistant) -> None:
        self.hass = hass
        self._unsub: CALLBACK_TYPE | None = None
        # The zones each person was last SEEN in (unavailable keeps it).
        self._known: dict[str, set[str]] = {}
        self._pending: dict[tuple[str, str], CALLBACK_TYPE] = {}
        self._last_sent: dict[tuple[str, str], float] = {}

    @callback
    def async_setup(self) -> None:
        for state in self.hass.states.async_all("person"):
            zones = zones_of(self.hass, state)
            if zones is not None:
                self._known[state.entity_id] = zones
        self._unsub = self.hass.bus.async_listen(EVENT_STATE_CHANGED, self._on_state_changed, event_filter=_is_person_change)

    @callback
    def async_teardown(self) -> None:
        if self._unsub is not None:
            self._unsub()
            self._unsub = None
        for cancel in self._pending.values():
            cancel()
        self._pending.clear()

    @callback
    def _on_state_changed(self, event: Event[EventStateChangedData]) -> None:
        person = event.data["entity_id"]
        new = event.data["new_state"]
        if new is None:  # the person was removed
            self._known.pop(person, None)
            for key in [k for k in self._pending if k[0] == person]:
                self._pending.pop(key)()
            return
        zones = zones_of(self.hass, new)
        if zones is None:
            return  # no position right now: nobody left, nobody arrived
        before = self._known.get(person)
        self._known[person] = zones
        if before is None:
            return  # first position seen (a restart): not an arrival we watched
        for zone in before - zones:
            if (cancel := self._pending.pop((person, zone), None)) is not None:
                cancel()
        # (Leaving a zone cancelled its pending stay above, so a zone entered
        # now has none.)
        for zone in zones - before:
            if zone == HOME_ZONE or not objects_at(self.hass, zone):
                continue
            self._pending[(person, zone)] = async_call_later(
                self.hass, PLACE_ARRIVAL_DWELL_SECONDS, partial(self._stayed, person, zone)
            )

    @callback
    def _stayed(self, person: str, zone: str, _now: datetime) -> None:
        self._pending.pop((person, zone), None)
        if zone not in self._known.get(person, set()):
            return
        key = (person, zone)
        now = time.monotonic()
        last = self._last_sent.get(key)
        if last is not None and now - last < PLACE_ARRIVAL_COOLDOWN_SECONDS:
            return
        state = self.hass.states.get(person)
        user_id = state.attributes.get("user_id") if state is not None else None
        if not user_id:
            return  # a person without a user has no phones of their own
        tasks = due_tasks_at(self.hass, zone)
        if not tasks:
            return
        nm = self.hass.data.get(DOMAIN, {}).get(NOTIFICATION_MANAGER_KEY)
        if nm is None:
            return
        self._last_sent[key] = now
        self.hass.async_create_task(
            nm.async_place_arrival(user_id=str(user_id), zone_id=zone, place_name=zone_name(self.hass, zone) or zone, tasks=tasks),
            eager_start=False,
        )
