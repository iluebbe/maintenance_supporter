"""Places (2026-10): an object can be maintained at an HA zone other than home.

* ``place`` is a zone's entity id; empty, ``zone.home`` and anything that is
  no zone mean home — an installation that never sets one changes nothing.
* ``remind_on_site`` holds the object's reminders until somebody is staying
  in the zone (the ``on_site`` gate; driving past is no stay); vacation
  mode does not silence a place that has somebody there. No data never
  silences: a missing zone or an unknown occupancy leaves the reminders as
  they were.
* Arriving at a place (after a two-minute stay, once per visit, to the
  arriving person's own phones) brings a message with what is due there.
  A restart, a brief ``unavailable`` and a drive-by are no arrival. For an
  object whose reminders wait for somebody on site the message is the
  visit's reminder: the held reminder does not follow it to everybody.
* The calendar names the place as its events' location; a renamed zone
  keeps its objects; the JSON backup carries the place.
"""

from __future__ import annotations

import json
import time
from datetime import timedelta
from typing import Any
from unittest.mock import AsyncMock, patch

import pytest
from homeassistant.core import Event, HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_fire_time_changed, async_mock_service

from custom_components.maintenance_supporter.const import (
    CONF_NOTIFY_EVENT_ONLY,
    CONF_OBJECT,
    CONF_QUIET_HOURS_ENABLED,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    NOTIFICATION_MANAGER_KEY,
    PLACE_ARRIVAL_COOLDOWN_SECONDS,
    PLACE_ARRIVAL_DWELL_SECONDS,
    MaintenanceStatus,
)
from custom_components.maintenance_supporter.helpers.notification_gates import task_may_notify
from custom_components.maintenance_supporter.helpers.notify_hooks import KIND_STATUS
from custom_components.maintenance_supporter.helpers.places import PLACES_KEY, normalize_place

from .conftest import (
    TASK_ID_1,
    build_object_data,
    build_task_data,
    call_ws_handler,
    make_global_entry,
    make_object_entry,
    make_ws_connection,
    setup_integration,
)

ZONE = "zone.allotment"
PERSON = "person.anna"
USER_ID = "anna-user"
PHONE = "mobile_app_anna"


def _zone(hass: HomeAssistant, count: int | str = 0, entity_id: str = ZONE, name: str = "Allotment", *, since: float = 3600) -> None:
    """The zone with ``count`` persons in it, at that count for ``since`` seconds."""
    hass.states.async_set(
        entity_id,
        str(count),
        {"friendly_name": name, "latitude": 52.5, "longitude": 13.4, "radius": 100},
        force_update=True,
        timestamp=time.time() - since,
    )


def _person(hass: HomeAssistant, zones: list[str] | None, state: str = "not_home", user_id: str | None = USER_ID) -> None:
    attrs: dict[str, Any] = {"friendly_name": "Anna"}
    if zones is not None:
        attrs["in_zones"] = zones
    if user_id:
        attrs["user_id"] = user_id
    hass.states.async_set(PERSON, state, attrs)


def _overdue_task(**extra: Any) -> dict[str, Any]:
    task = build_task_data(
        task_id=TASK_ID_1,
        name="Oil the gate",
        interval_days=30,
        last_performed=(dt_util.now().date() - timedelta(days=40)).isoformat(),
    )
    return {**task, **extra}


async def _setup(
    hass: HomeAssistant,
    *,
    place: str | None = ZONE,
    on_site: bool = False,
    task: dict[str, Any] | None = None,
    quiet: bool = False,
    event_only: bool = False,
) -> MockConfigEntry:
    g = make_global_entry(
        hass,
        notifications_enabled=True,
        notify_service="notify.household",
        extra_data={CONF_QUIET_HOURS_ENABLED: quiet, CONF_NOTIFY_EVENT_ONLY: event_only},
    )
    obj = {**build_object_data(name="Garden shed"), **({"place": place} if place else {}), **({"remind_on_site": True} if on_site else {})}
    entry = make_object_entry(hass, tasks={TASK_ID_1: task or _overdue_task()}, object_data=obj, uid="places_obj")
    await setup_integration(hass, g, entry)
    return entry


# ─── normalization ───────────────────────────────────────────────────────────


@pytest.mark.parametrize(
    ("raw", "expected"),
    [(None, None), ("", None), ("  ", None), ("zone.home", None), ("sensor.x", None), (5, None), (" zone.a ", "zone.a"), (ZONE, ZONE)],
)
def test_a_place_is_a_zone_or_home(raw: Any, expected: str | None) -> None:
    assert normalize_place(raw) == expected


async def _ws(hass: HomeAssistant, handler: Any, msg: dict[str, Any]) -> Any:
    conn = make_ws_connection()
    await call_ws_handler(handler, hass, conn, {"id": 1, **msg})
    await hass.async_block_till_done()
    return conn


async def test_create_update_and_payload(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.websocket.objects import (
        ws_create_object,
        ws_get_object,
        ws_update_object,
    )

    _zone(hass)
    g = make_global_entry(hass)
    await setup_integration(hass, g)
    conn = await _ws(hass, ws_create_object, {"type": f"{DOMAIN}/object/create", "name": "Shed", "place": ZONE, "remind_on_site": True})
    conn.send_error.assert_not_called()
    entry_id = conn.send_result.call_args[0][1]["entry_id"]
    stored = hass.config_entries.async_get_entry(entry_id).data[CONF_OBJECT]
    assert stored["place"] == ZONE and stored["remind_on_site"] is True

    conn = await _ws(hass, ws_get_object, {"type": f"{DOMAIN}/object", "entry_id": entry_id})
    obj = conn.send_result.call_args[0][1]["object"]
    assert obj["place"] == ZONE and obj["place_name"] == "Allotment"
    assert obj["place_missing"] is False and obj["remind_on_site"] is True

    # Home again: "zone.home" is home, and "only on site" goes with the place.
    await _ws(hass, ws_update_object, {"type": f"{DOMAIN}/object/update", "entry_id": entry_id, "place": "zone.home"})
    stored = hass.config_entries.async_get_entry(entry_id).data[CONF_OBJECT]
    assert "place" not in stored and "remind_on_site" not in stored

    # A zone that is gone: the payload says so (the object behaves as at home).
    await _ws(hass, ws_update_object, {"type": f"{DOMAIN}/object/update", "entry_id": entry_id, "place": "zone.marina"})
    conn = await _ws(hass, ws_get_object, {"type": f"{DOMAIN}/object", "entry_id": entry_id})
    obj = conn.send_result.call_args[0][1]["object"]
    assert obj["place"] == "zone.marina" and obj["place_name"] is None and obj["place_missing"] is True


async def test_an_object_at_home_stores_nothing_new(hass: HomeAssistant) -> None:
    entry = await _setup(hass, place=None)
    assert "place" not in entry.data[CONF_OBJECT]
    assert "remind_on_site" not in entry.data[CONF_OBJECT]


# ─── the on_site gate ────────────────────────────────────────────────────────


def _gate(hass: HomeAssistant, entry: MockConfigEntry) -> Any:
    task = {**entry.data[CONF_TASKS][TASK_ID_1]}
    return task_may_notify(hass, entry.entry_id, TASK_ID_1, MaintenanceStatus.OVERDUE, task, kind=KIND_STATUS)


async def test_reminders_wait_for_somebody_on_site(hass: HomeAssistant) -> None:
    _zone(hass, 0)
    entry = await _setup(hass, on_site=True)
    assert _gate(hass, entry).blocked_by == "on_site"
    _zone(hass, 1, since=10)
    assert _gate(hass, entry).blocked_by == "on_site", "just arrived, or driving past: no stay yet"
    _zone(hass, 1, since=PLACE_ARRIVAL_DWELL_SECONDS)
    assert _gate(hass, entry)


@pytest.mark.parametrize("zone_state", [None, "unknown", "unavailable"])
async def test_no_data_never_silences(hass: HomeAssistant, zone_state: str | None) -> None:
    if zone_state is not None:
        hass.states.async_set(ZONE, zone_state, {"friendly_name": "Allotment"})
    entry = await _setup(hass, on_site=True)
    assert _gate(hass, entry), "a missing zone or an unknown count must not hold reminders"


async def test_without_on_site_a_place_changes_no_reminder(hass: HomeAssistant) -> None:
    _zone(hass, 0)
    entry = await _setup(hass, on_site=False)
    assert _gate(hass, entry)


class _Vacation:
    def is_silent_for(self, task_id: str) -> bool:
        return True


async def test_vacation_does_not_silence_a_place_with_somebody_there(hass: HomeAssistant) -> None:
    _zone(hass, 0)
    entry = await _setup(hass)
    with patch("custom_components.maintenance_supporter.helpers.vacation.get_vacation_state", return_value=_Vacation()):
        assert _gate(hass, entry).blocked_by == "vacation"
        _zone(hass, 2, since=10)
        assert _gate(hass, entry).blocked_by == "vacation", "driving past the holiday home is no stay"
        _zone(hass, 2)
        assert _gate(hass, entry), "at the holiday home during the vacation: its tasks speak up"


# ─── arrival ─────────────────────────────────────────────────────────────────


class _Arrival:
    def __init__(self, hass: HomeAssistant) -> None:
        self.hass = hass
        self.calls = async_mock_service(hass, "notify", PHONE)
        self.events: list[Event] = []

        @callback
        def _on(event: Event) -> None:
            if event.data.get("kind") == "place_arrival":
                self.events.append(event)

        hass.bus.async_listen(f"{DOMAIN}_notification", _on)

    async def arrive(self, *, stay: bool = True) -> None:
        _person(self.hass, [ZONE], state="Allotment")
        await self.hass.async_block_till_done()
        if stay:
            await self.wait()

    async def wait(self, seconds: int = PLACE_ARRIVAL_DWELL_SECONDS + 1) -> None:
        async_fire_time_changed(self.hass, dt_util.utcnow() + timedelta(seconds=seconds))
        await self.hass.async_block_till_done()


def _phones(return_value: list[str] | None = None) -> Any:
    return patch(
        "custom_components.maintenance_supporter.helpers.notification_manager.get_user_notify_services",
        AsyncMock(return_value=[f"notify.{PHONE}"] if return_value is None else return_value),
    )


async def test_arriving_tells_the_person_what_is_due_there(hass: HomeAssistant) -> None:
    _zone(hass)
    _person(hass, [])  # seen before the visit
    entry = await _setup(hass)
    arrival = _Arrival(hass)
    with _phones():
        await arrival.arrive()
    assert len(arrival.calls) == 1
    data = arrival.calls[0].data
    assert data["title"] == "Maintenance at Allotment"
    assert "Garden shed" in data["message"] and "Oil the gate" in data["message"]
    assert entry.entry_id in data["data"]["url"], "one object: the deep link opens it"
    (event,) = arrival.events
    assert event.data["place"] == ZONE and event.data["place_name"] == "Allotment"
    assert [t["task_id"] for t in event.data["tasks"]] == [TASK_ID_1]
    assert event.data["category"] == "reminder"


async def test_a_drive_by_is_no_visit(hass: HomeAssistant) -> None:
    _zone(hass)
    _person(hass, [])
    await _setup(hass)
    arrival = _Arrival(hass)
    with _phones():
        await arrival.arrive(stay=False)
        _person(hass, [])  # gone again before the stay
        await hass.async_block_till_done()
        await arrival.wait()
    assert arrival.calls == []


async def test_once_per_visit(hass: HomeAssistant) -> None:
    _zone(hass)
    _person(hass, [])
    await _setup(hass)
    arrival = _Arrival(hass)
    with _phones():
        await arrival.arrive()
        _person(hass, [])
        await hass.async_block_till_done()
        await arrival.arrive()  # back within the cooldown
        assert len(arrival.calls) == 1
        place_arrivals = hass.data[DOMAIN][PLACES_KEY]
        for key in list(place_arrivals._last_sent):
            place_arrivals._last_sent[key] -= PLACE_ARRIVAL_COOLDOWN_SECONDS + 1
        _person(hass, [])
        await hass.async_block_till_done()
        await arrival.arrive()  # a later visit
    assert len(arrival.calls) == 2


async def test_a_restart_or_an_outage_is_no_arrival(hass: HomeAssistant) -> None:
    _zone(hass)
    await _setup(hass)
    arrival = _Arrival(hass)
    with _phones():
        # First position seen (as after a restart): already there, not an arrival we watched.
        await arrival.arrive()
        assert arrival.calls == []
        # The phone drops out and comes back while still there: no new visit.
        hass.states.async_set(PERSON, "unavailable", {"user_id": USER_ID})
        await hass.async_block_till_done()
        await arrival.arrive()
    assert arrival.calls == []


async def test_nothing_due_nothing_said(hass: HomeAssistant) -> None:
    _zone(hass)
    _person(hass, [])
    fresh = build_task_data(task_id=TASK_ID_1, name="Oil the gate", interval_days=30, last_performed=dt_util.now().date().isoformat())
    await _setup(hass, task=fresh)
    arrival = _Arrival(hass)
    with _phones():
        await arrival.arrive()
    assert arrival.calls == []


async def test_only_the_arriving_persons_phones(hass: HomeAssistant) -> None:
    """No phone of their own: nothing — never the household service."""
    _zone(hass)
    _person(hass, [])
    await _setup(hass)
    arrival = _Arrival(hass)
    household = async_mock_service(hass, "notify", "household")
    with _phones([]):
        await arrival.arrive()
    assert arrival.calls == [] and household == []


async def test_a_person_without_a_user_gets_nothing(hass: HomeAssistant) -> None:
    _zone(hass)
    _person(hass, [], user_id=None)
    await _setup(hass)
    arrival = _Arrival(hass)
    with _phones():
        _person(hass, [ZONE], state="Allotment", user_id=None)
        await hass.async_block_till_done()
        await arrival.wait()
    assert arrival.calls == []


async def test_a_muted_task_is_left_out(hass: HomeAssistant) -> None:
    _zone(hass)
    _person(hass, [])
    await _setup(hass, task=_overdue_task(notify_enabled=False))
    arrival = _Arrival(hass)
    with _phones():
        await arrival.arrive()
    assert arrival.calls == []


async def test_quiet_hours_skip_the_arrival_message(hass: HomeAssistant) -> None:
    _zone(hass)
    _person(hass, [])
    await _setup(hass, quiet=True)
    arrival = _Arrival(hass)
    with _phones(), patch(
        "custom_components.maintenance_supporter.helpers.notification_manager.NotificationManager._is_quiet_hours",
        return_value=True,
    ):
        await arrival.arrive()
    assert arrival.calls == []


async def test_home_is_no_place_to_arrive_at(hass: HomeAssistant) -> None:
    hass.states.async_set("zone.home", "0", {"friendly_name": "Home"})
    _person(hass, [], state="not_home")
    await _setup(hass, place=None)
    arrival = _Arrival(hass)
    with _phones():
        _person(hass, ["zone.home"], state="home")
        await hass.async_block_till_done()
        await arrival.wait()
    assert arrival.calls == []


async def test_event_only_mode_needs_no_phone(hass: HomeAssistant) -> None:
    """#173 event-only: the event is the delivery, phones or not."""
    _zone(hass)
    _person(hass, [])
    await _setup(hass, event_only=True)
    arrival = _Arrival(hass)
    with _phones([]):
        await arrival.arrive()
    assert arrival.calls == []
    (event,) = arrival.events
    assert event.data["target"] is None and event.data["responsible_user_id"] == USER_ID


async def test_one_failing_phone_does_not_stop_the_others(hass: HomeAssistant, caplog: pytest.LogCaptureFixture) -> None:
    from custom_components.maintenance_supporter.helpers import notification_manager as nm_module

    _zone(hass)
    _person(hass, [])
    await _setup(hass)
    arrival = _Arrival(hass)
    real = nm_module.async_emit_and_dispatch

    async def flaky(hass_: HomeAssistant, target: str, *args: Any, **kwargs: Any) -> bool:
        if target == "notify.mobile_app_broken":
            raise HomeAssistantError("the phone is gone")
        return await real(hass_, target, *args, **kwargs)

    with _phones(["notify.mobile_app_broken", f"notify.{PHONE}"]), patch.object(nm_module, "async_emit_and_dispatch", side_effect=flaky):
        await arrival.arrive()
    assert len(arrival.calls) == 1
    assert "Place arrival message to notify.mobile_app_broken failed" in caplog.text


async def test_a_core_without_in_zones_reads_the_zone_name(hass: HomeAssistant) -> None:
    """Before 2026.6, and for trackers that report no in_zones, the state
    is the zone's name (``not_home`` and unknown names are no zone)."""
    _zone(hass)
    hass.states.async_set(PERSON, "not_home", {"user_id": USER_ID})
    await _setup(hass)
    arrival = _Arrival(hass)
    with _phones():
        hass.states.async_set(PERSON, "Allotment", {"user_id": USER_ID})
        await hass.async_block_till_done()
        await arrival.wait()
        hass.states.async_set(PERSON, "home", {"user_id": USER_ID})
        await hass.async_block_till_done()
    assert len(arrival.calls) == 1
    assert hass.data[DOMAIN][PLACES_KEY]._known[PERSON] == {"zone.home"}


async def test_only_the_objects_at_that_place_are_listed(hass: HomeAssistant) -> None:
    _zone(hass)
    _zone(hass, entity_id="zone.marina", name="Marina")
    _person(hass, [])
    g = make_global_entry(hass, notifications_enabled=True, notify_service="notify.household", extra_data={CONF_QUIET_HOURS_ENABLED: False})
    shed = make_object_entry(
        hass, tasks={TASK_ID_1: _overdue_task()}, object_data={**build_object_data(name="Garden shed"), "place": ZONE}, uid="shed"
    )
    boat = make_object_entry(
        hass, tasks={TASK_ID_1: _overdue_task()}, object_data={**build_object_data(name="Boat"), "place": "zone.marina"}, uid="boat"
    )
    await setup_integration(hass, g, shed, boat)
    arrival = _Arrival(hass)
    with _phones():
        await arrival.arrive()
    (event,) = arrival.events
    assert [t["entry_id"] for t in event.data["tasks"]] == [shed.entry_id]
    assert "Boat" not in arrival.calls[0].data["message"]


async def test_a_person_removed_during_the_stay_gets_nothing(hass: HomeAssistant) -> None:
    _zone(hass)
    _person(hass, [])
    await _setup(hass)
    arrival = _Arrival(hass)
    with _phones():
        await arrival.arrive(stay=False)
        hass.states.async_remove(PERSON)
        await hass.async_block_till_done()
        await arrival.wait()
    assert arrival.calls == []
    assert hass.data[DOMAIN][PLACES_KEY]._pending == {}


async def test_unloading_cancels_a_pending_stay(hass: HomeAssistant) -> None:
    """The global entry owns the listener: a settings save reloads it."""
    _zone(hass)
    _person(hass, [])
    await _setup(hass)
    arrival = _Arrival(hass)
    place_arrivals = hass.data[DOMAIN][PLACES_KEY]
    with _phones():
        await arrival.arrive(stay=False)
        assert place_arrivals._pending
        g = next(e for e in hass.config_entries.async_entries(DOMAIN) if e.unique_id == GLOBAL_UNIQUE_ID)
        await hass.config_entries.async_unload(g.entry_id)
        await hass.async_block_till_done()
        await arrival.wait()
    assert PLACES_KEY not in hass.data.get(DOMAIN, {})
    assert place_arrivals._pending == {} and place_arrivals._unsub is None
    assert arrival.calls == []


# ─── the arrival message is the visit's reminder ─────────────────────────────


async def _held_reminder_after_a_visit(hass: HomeAssistant, phones: list[str] | None = None) -> list[Any]:
    """An object whose reminders wait for somebody on site, its overdue
    reminder pending; somebody arrives and stays. The household service's
    calls after that."""
    _zone(hass, 0)
    _person(hass, [])
    entry = await _setup(hass, on_site=True)
    household = async_mock_service(hass, "notify", "household")
    arrival = _Arrival(hass)
    hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY]._last_notified.clear()  # the startup seed: pending again
    coordinator = entry.runtime_data.coordinator

    async def refresh() -> None:
        await coordinator.async_refresh()
        await hass.async_block_till_done()

    await refresh()
    assert household == [], "nobody there: the reminder waits"
    with _phones(phones):
        await arrival.arrive(stay=False)
        _zone(hass, 1, since=0)
        await refresh()
        assert household == [], "just arrived: no stay yet"
        await arrival.wait()
    _zone(hass, 1)
    await refresh()
    return household


async def test_the_arrival_message_is_the_visits_reminder(hass: HomeAssistant) -> None:
    household = await _held_reminder_after_a_visit(hass)
    assert household == [], "the person on site was told; the held reminder must not follow to everybody"


async def test_without_an_arrival_message_the_held_reminder_follows(hass: HomeAssistant) -> None:
    """Somebody stays but got no message (no phone of their own): the
    reminder goes out as usual once somebody is there."""
    household = await _held_reminder_after_a_visit(hass, phones=[])
    assert len(household) == 1


# ─── calendar, rename, backup ────────────────────────────────────────────────


async def test_calendar_events_name_the_place(hass: HomeAssistant) -> None:
    _zone(hass)
    await _setup(hass)
    calendar = hass.data[DOMAIN]["_calendar_entity"]
    now = dt_util.now()
    events = await calendar.async_get_events(hass, now - timedelta(days=30), now + timedelta(days=365))
    assert events and all(e.location == "Allotment" for e in events)


async def test_a_renamed_zone_keeps_its_objects(hass: HomeAssistant) -> None:
    reg = er.async_get(hass)
    zone_entry = reg.async_get_or_create("zone", "zone", "allot_uid", suggested_object_id="allotment")
    assert zone_entry.entity_id == ZONE
    _zone(hass)
    entry = await _setup(hass)
    reg.async_update_entity(ZONE, new_entity_id="zone.garden_plot")
    await hass.async_block_till_done()
    assert hass.config_entries.async_get_entry(entry.entry_id).data[CONF_OBJECT]["place"] == "zone.garden_plot"


async def test_the_json_backup_carries_the_place(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.export import build_export_data
    from custom_components.maintenance_supporter.websocket.io import ws_import_json

    _zone(hass)
    await _setup(hass, on_site=True)
    export = build_export_data(hass)
    exported = export["objects"][0]["object"]
    assert exported["place"] == ZONE and exported["remind_on_site"] is True

    payload = json.loads(json.dumps(export))
    payload["objects"][0]["object"]["name"] = "Garden shed copy"
    conn = make_ws_connection()
    await call_ws_handler(ws_import_json, hass, conn, {"id": 1, "type": "x", "json_content": json.dumps(payload)})
    await hass.async_block_till_done()
    conn.send_error.assert_not_called()
    copy = next(
        e for e in hass.config_entries.async_entries(DOMAIN) if (e.data.get(CONF_OBJECT) or {}).get("name") == "Garden shed copy"
    )
    assert copy.data[CONF_OBJECT]["place"] == ZONE and copy.data[CONF_OBJECT]["remind_on_site"] is True
