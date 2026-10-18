"""Notification bookkeeping survives a restart; quiet hours hold reminders
and deliver ONE summary at their end; the quiet-hours skip is logged once
per quiet period (2026-09-13, prod review).

Pins:
* stamps (incl. the "once" mark for interval 0), snoozes, the daily counter,
  the lead dedup, the fairness sets and the held reminders round-trip
  through the Store; a fresh manager that loads them does not re-announce
  (the restart burst: trigger entities came back seconds after the seed);
* the startup seed never overwrites a persisted stamp;
* `async_unload` saves before it clears;
* during quiet hours a due reminder is HELD (no send), three refreshes log
  the skip once; the first send attempt after quiet hours sends one summary
  naming every held task, stamps them (no single pushes follow) and counts
  one against the daily limit; a task completed overnight drops out of the
  summary.
"""

from __future__ import annotations

import logging
from datetime import timedelta
from typing import Any
from unittest.mock import AsyncMock, patch

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_MAX_NOTIFICATIONS_PER_DAY,
    CONF_NOTIFICATIONS_ENABLED,
    CONF_NOTIFY_OVERDUE_INTERVAL,
    CONF_NOTIFY_SERVICE,
    CONF_NOTIFY_TRIGGERED_INTERVAL,
    CONF_QUIET_HOURS_ENABLED,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MaintenanceStatus,
)
from custom_components.maintenance_supporter.helpers.notification_manager import (
    _SENT_ONCE,
    STATE_STORE_KEY,
    NotificationManager,
    notification_key,
)
from custom_components.maintenance_supporter.helpers.notify_hooks import KIND_QUIET_END, NOTIFICATION_KINDS

from .conftest import build_global_entry_data, build_task_data, make_object_entry


def _global(hass: HomeAssistant, *, quiet: bool = False, max_per_day: int = 0) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(notifications_enabled=True, notify_service="notify.mobile_app"),
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
        options={
            CONF_NOTIFICATIONS_ENABLED: True,
            CONF_NOTIFY_SERVICE: "notify.mobile_app",
            CONF_QUIET_HOURS_ENABLED: quiet,
            CONF_NOTIFY_OVERDUE_INTERVAL: 12,
            CONF_NOTIFY_TRIGGERED_INTERVAL: 0,
            CONF_MAX_NOTIFICATIONS_PER_DAY: max_per_day,
        },
    )
    entry.add_to_hass(hass)
    return entry


def _manager(hass: HomeAssistant) -> tuple[NotificationManager, AsyncMock]:
    nm = NotificationManager(hass)
    sent = AsyncMock(return_value=True)
    patch.object(nm, "_resolve_and_send", sent).start()
    return nm, sent


async def _offer(nm: NotificationManager, task: str, status: str = MaintenanceStatus.OVERDUE, *, entry: str = "e1") -> None:
    await nm.async_task_status_changed(
        entry_id=entry, task_id=task, task_name=f"Task {task}", object_name=f"Obj {entry}", new_status=status,
        task_data={"priority": "normal", "notify_enabled": True},
    )


async def test_state_round_trips_through_the_store(hass: HomeAssistant, hass_storage: dict[str, Any]) -> None:
    _global(hass)
    nm, sent = _manager(hass)
    await _offer(nm, "t1")  # overdue, interval 12 h → timestamp stamp
    await _offer(nm, "t2", MaintenanceStatus.TRIGGERED)  # interval 0 → once mark
    assert sent.await_count == 2
    await nm._store.async_save(nm._snapshot())
    saved = hass_storage[STATE_STORE_KEY]["data"]
    assert saved["last_notified"][notification_key("e1", "t2", MaintenanceStatus.TRIGGERED)] == "once"
    assert saved["daily_count"] == 2

    fresh = NotificationManager(hass)
    await fresh.async_load()
    assert fresh._last_notified[notification_key("e1", "t2", MaintenanceStatus.TRIGGERED)] is _SENT_ONCE
    assert isinstance(fresh._last_notified[notification_key("e1", "t1", MaintenanceStatus.OVERDUE)], type(dt_util.now()))
    assert fresh._daily_count == 2 and fresh._served_today == {"e1_t1", "e1_t2"}
    # The restart burst: the same tasks are offered again by the first
    # refresh (trigger entities back) — nothing is re-announced.
    fresh_sent = AsyncMock(return_value=True)
    patch.object(fresh, "_resolve_and_send", fresh_sent).start()
    await _offer(fresh, "t1")
    await _offer(fresh, "t2", MaintenanceStatus.TRIGGERED)
    assert fresh_sent.await_count == 0


async def test_seed_keeps_a_persisted_stamp(hass: HomeAssistant) -> None:
    _global(hass)
    nm = NotificationManager(hass)
    stamp = dt_util.now() - timedelta(hours=5)
    nm._last_notified[notification_key("e1", "t1", MaintenanceStatus.OVERDUE)] = stamp
    assert nm.begin_startup_seed("e1")
    nm.seed_startup_state("e1", "t1", MaintenanceStatus.OVERDUE)
    nm.seed_startup_state("e1", "t9", MaintenanceStatus.TRIGGERED)
    assert nm._last_notified[notification_key("e1", "t1", MaintenanceStatus.OVERDUE)] == stamp, "the real stamp wins over 'now'"
    assert nm._last_notified[notification_key("e1", "t9", MaintenanceStatus.TRIGGERED)] is _SENT_ONCE


async def test_unload_saves_before_clearing(hass: HomeAssistant, hass_storage: dict[str, Any]) -> None:
    _global(hass)
    nm, _ = _manager(hass)
    await _offer(nm, "t1")
    await nm.async_unload()
    assert nm._last_notified == {}
    assert notification_key("e1", "t1", MaintenanceStatus.OVERDUE) in hass_storage[STATE_STORE_KEY]["data"]["last_notified"]


async def test_quiet_hours_hold_then_one_summary(hass: HomeAssistant, caplog: Any) -> None:
    _global(hass, quiet=True, max_per_day=10)
    # The held tasks exist: the summary leaves out tasks gone since.
    make_object_entry(hass, tasks={t: build_task_data(task_id=t) for t in ("t1", "t3")}, name="Obj e1", uid="obj_e1", entry_id="e1")
    make_object_entry(hass, tasks={"t2": build_task_data(task_id="t2")}, name="Obj e2", uid="obj_e2", entry_id="e2")
    nm, sent = _manager(hass)
    dispatch = AsyncMock(return_value=True)
    caplog.set_level(logging.DEBUG, logger="custom_components.maintenance_supporter.helpers.notification_manager")
    with patch.object(nm, "_is_quiet_hours", return_value=True), \
         patch("custom_components.maintenance_supporter.helpers.notification_manager.async_emit_and_dispatch", dispatch):
        for _ in range(3):
            await _offer(nm, "t1")
            await _offer(nm, "t2", MaintenanceStatus.TRIGGERED, entry="e2")
        await _offer(nm, "t3")  # completed overnight → drops out below
        nm.clear_task_state("e1", "t3")
    assert sent.await_count == 0, "nothing goes out during quiet hours"
    assert set(nm._quiet_held) == {notification_key("e1", "t1", MaintenanceStatus.OVERDUE), notification_key("e2", "t2", MaintenanceStatus.TRIGGERED)}
    quiet_lines = [r for r in caplog.records if "Quiet hours" in r.getMessage()]
    assert len(quiet_lines) == 1, "the skip is logged once per quiet period"

    # Quiet hours end: the first offer sends ONE summary and the single pushes stay silent.
    with patch.object(nm, "_is_quiet_hours", return_value=False), \
         patch("custom_components.maintenance_supporter.helpers.notification_manager.async_emit_and_dispatch", dispatch):
        await _offer(nm, "t1")
        await _offer(nm, "t2", MaintenanceStatus.TRIGGERED, entry="e2")
        await _offer(nm, "t1")
    assert dispatch.await_count == 1
    service_data, context = dispatch.await_args.args[2], dispatch.await_args.args[3]
    assert service_data["title"] == "2 reminders held during quiet hours"
    assert "Obj e1: Task t1 (overdue)" in service_data["message"] and "Obj e2: Task t2 (triggered)" in service_data["message"]
    assert "Task t3" not in service_data["message"]
    assert context["kind"] == KIND_QUIET_END and len(context["tasks"]) == 2
    assert sent.await_count == 0, "no single push for a task the summary named"
    assert nm._quiet_held == {}
    assert nm._daily_count == 1, "the summary counts once"
    assert nm._last_notified[notification_key("e2", "t2", MaintenanceStatus.TRIGGERED)] is _SENT_ONCE
    # A task that becomes due AFTER the quiet hours still goes out on its own.
    with patch.object(nm, "_is_quiet_hours", return_value=False):
        await _offer(nm, "t4")
    assert sent.await_count == 1


async def test_a_persons_held_reminders_reach_their_own_phones(hass: HomeAssistant) -> None:
    """Bug audit 2026-10-17 (N-3): the summary went to the household service
    only and stamped every member, so a person's own reminder that fell into
    quiet hours (every midnight due date does) never reached their phone.
    Each recipient gets a summary of their own now; one that fails stays
    held for the next attempt."""
    _global(hass, quiet=True, max_per_day=10)
    make_object_entry(hass, tasks={t: build_task_data(task_id=t) for t in ("t1", "t2", "t3")}, name="Obj e1", uid="obj_e1", entry_id="e1")
    nm, sent = _manager(hass)
    phones = {"anna": ["notify.mobile_app_anna"], "ben": ["notify.mobile_app_ben"]}

    async def _phones(_hass: HomeAssistant, user_id: str) -> list[str]:
        return phones.get(user_id, [])

    async def _offer_for(task: str, person: str | None) -> None:
        await nm.async_task_status_changed(
            entry_id="e1", task_id=task, task_name=f"Task {task}", object_name="Obj e1", new_status=MaintenanceStatus.OVERDUE,
            responsible_user_id=person, task_data={"priority": "normal", "notify_enabled": True},
        )

    dispatch = AsyncMock(side_effect=lambda _hass, target, _data, _ctx: target != "notify.mobile_app_ben")
    with patch("custom_components.maintenance_supporter.helpers.notification_manager.get_user_notify_services", _phones), \
         patch("custom_components.maintenance_supporter.helpers.notification_manager.async_emit_and_dispatch", dispatch):
        with patch.object(nm, "_is_quiet_hours", return_value=True):
            await _offer_for("t1", "anna")
            await _offer_for("t2", None)
            await _offer_for("t3", "ben")
        with patch.object(nm, "_is_quiet_hours", return_value=False):
            await _offer_for("t1", "anna")

    by_target = {c.args[1]: c.args[2]["message"] for c in dispatch.await_args_list}
    assert set(by_target) == {"notify.mobile_app_anna", "notify.mobile_app", "notify.mobile_app_ben"}
    assert "Task t1" in by_target["notify.mobile_app_anna"] and "Task t2" not in by_target["notify.mobile_app_anna"]
    assert "Task t2" in by_target["notify.mobile_app"] and "Task t1" not in by_target["notify.mobile_app"]
    assert sent.await_count == 0, "Anna's reminder went out in her summary"
    assert nm._daily_count == 2, "two summaries were delivered"
    # Ben's phone refused: his reminder is neither stamped nor dropped.
    assert set(nm._quiet_held) == {notification_key("e1", "t3", MaintenanceStatus.OVERDUE)}
    assert nm.reminder_due("e1", "t3", MaintenanceStatus.OVERDUE)
    assert not nm.reminder_due("e1", "t2", MaintenanceStatus.OVERDUE)


async def test_the_summaries_keep_the_daily_cap_and_the_bundle_route(hass: HomeAssistant) -> None:
    """A reminder held from an object's bundle goes to the household like the
    bundle would have; the daily cap stops the summaries that do not fit (they
    stay held); a person nobody can reach keeps their reminder held too."""
    from custom_components.maintenance_supporter.const import CONF_NOTIFY_EVENT_ONLY

    entry = _global(hass, quiet=True, max_per_day=1)
    make_object_entry(hass, tasks={t: build_task_data(task_id=t) for t in ("t1", "t2")}, name="Obj e1", uid="obj_e1", entry_id="e1")
    nm, _sent = _manager(hass)

    async def _phones(_hass: HomeAssistant, user_id: str) -> list[str]:
        return ["notify.mobile_app_anna"] if user_id == "anna" else []

    k1, k2 = (notification_key("e1", t, MaintenanceStatus.OVERDUE) for t in ("t1", "t2"))
    facts = {"entry_id": "e1", "task_name": "x", "object_name": "Obj e1", "status": MaintenanceStatus.OVERDUE}
    nm._hold_for_quiet_end(k1, {**facts, "task_id": "t1"})  # from a bundle: no person
    nm._hold_for_quiet_end(k2, {**facts, "task_id": "t2", "responsible_user_id": "anna"})
    dispatch = AsyncMock(return_value=True)
    with patch("custom_components.maintenance_supporter.helpers.notification_manager.get_user_notify_services", _phones), \
         patch("custom_components.maintenance_supporter.helpers.notification_manager.async_emit_and_dispatch", dispatch), \
         patch.object(nm, "_is_quiet_hours", return_value=False):
        assert await nm._held_targets(nm._quiet_held[k1]) == ("notify.mobile_app",)
        assert await nm.async_flush_quiet_held() is True
        assert dispatch.await_count == 1, "the cap of one summary a day"
        assert len(nm._quiet_held) == 1

        # Without a household target, a person without a phone is reachable
        # by nobody: the reminder stays held, nothing is sent.
        hass.config_entries.async_update_entry(entry, options={**entry.options, CONF_NOTIFY_SERVICE: "", CONF_NOTIFY_EVENT_ONLY: False, CONF_MAX_NOTIFICATIONS_PER_DAY: 10})
        nm._quiet_held.clear()
        nm._hold_for_quiet_end(k2, {**facts, "task_id": "t2", "responsible_user_id": "ben"})
        assert await nm._held_targets(nm._quiet_held[k2]) == ()
        assert await nm.async_flush_quiet_held() is False
        assert set(nm._quiet_held) == {k2}


def test_quiet_end_is_in_the_kind_matrix() -> None:
    spec = NOTIFICATION_KINDS[KIND_QUIET_END]
    # Routed like the reminders it holds (bug audit 2026-10-17, N-3).
    assert spec.category == "summary" and spec.routing == "personal"
    assert "quiet_hours" not in spec.gates, "the summary is what quiet hours produce — it cannot be gated by them"
