"""Daily notification limit: priority reserves and fairness (2026-09-13).

With ``max_notifications_per_day`` set, the last slots are not
first-come-first-served any more:

* the last 10 % of the limit are kept for high-priority tasks, low-priority
  tasks stop at 20 % (below a limit of 10 both reserves are 0);
* a task turned away yesterday and never served goes first today;
* a task that already got a message today yields its repeat while a task
  turned away today is still waiting;
* a held task is not stamped, so the next refresh offers it again;
* without a limit nothing is held; a bundle admits/marks all its members.
"""

from __future__ import annotations

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
    CONF_QUIET_HOURS_ENABLED,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MaintenanceStatus,
)
from custom_components.maintenance_supporter.helpers.notification_manager import NotificationManager, task_key_of

from .conftest import build_global_entry_data


def _global(hass: HomeAssistant, *, max_per_day: int, overdue_interval: int = 12) -> MockConfigEntry:
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
            CONF_QUIET_HOURS_ENABLED: False,
            CONF_MAX_NOTIFICATIONS_PER_DAY: max_per_day,
            CONF_NOTIFY_OVERDUE_INTERVAL: overdue_interval,
        },
    )
    entry.add_to_hass(hass)
    return entry


async def _offer(nm: NotificationManager, task: str, priority: str = "normal", *, entry: str = "e1") -> bool:
    """Offer one overdue status notification; True when it was sent."""
    nm._roll_day()  # a day rollover inside the offer would skew the count delta
    before = nm._daily_count
    await nm.async_task_status_changed(
        entry_id=entry,
        task_id=task,
        task_name=task,
        object_name="Obj",
        new_status=MaintenanceStatus.OVERDUE,
        task_data={"priority": priority, "notify_enabled": True},
    )
    return nm._daily_count == before + 1


def _manager(hass: HomeAssistant) -> tuple[NotificationManager, AsyncMock]:
    nm = NotificationManager(hass)
    sent = AsyncMock(return_value=True)
    patcher = patch.object(nm, "_resolve_and_send", sent)
    patcher.start()
    return nm, sent


async def test_unlimited_admits_everything_and_keeps_no_holds(hass: HomeAssistant) -> None:
    _global(hass, max_per_day=0)
    nm, sent = _manager(hass)
    for t, p in (("a", "low"), ("b", "normal"), ("c", "high")):
        assert await _offer(nm, t, p)
    assert sent.await_count == 3
    assert nm._deferred_today == set() and nm._starved == set()
    assert nm._served_today == {task_key_of("e1", "a"), task_key_of("e1", "b"), task_key_of("e1", "c")}


async def test_priority_reserves_at_the_end_of_the_budget(hass: HomeAssistant) -> None:
    _global(hass, max_per_day=10)
    nm, _ = _manager(hass)
    nm._daily_count = 8  # 2 remaining → low stops (20 %), normal still passes
    nm._daily_reset_date = dt_util.now().date()
    assert not await _offer(nm, "low1", "low")
    assert await _offer(nm, "n1", "normal")
    # 1 remaining → only high passes (10 %)
    assert not await _offer(nm, "n2", "normal")
    assert not await _offer(nm, "low2", "low")
    assert await _offer(nm, "h1", "high")
    # 0 remaining → nobody
    assert not await _offer(nm, "h2", "high")
    assert task_key_of("e1", "low1") in nm._deferred_today and task_key_of("e1", "n2") in nm._deferred_today


async def test_small_limits_have_no_reserve(hass: HomeAssistant) -> None:
    _global(hass, max_per_day=1)
    nm, _ = _manager(hass)
    assert await _offer(nm, "n1", "normal"), "a limit of 1 must still serve a normal task"
    assert not await _offer(nm, "n2", "normal")


async def test_starved_yesterday_goes_first_today(hass: HomeAssistant) -> None:
    _global(hass, max_per_day=1)
    nm, _ = _manager(hass)
    # Day 1: A (refreshes first) takes the only slot, B is turned away.
    assert await _offer(nm, "A")
    assert not await _offer(nm, "B")
    # Day 2 (interval elapsed for A as well): A is offered first again but
    # must wait for B; B goes; then the limit is reached for A.
    nm._daily_reset_date = dt_util.now().date() - timedelta(days=1)
    nm._last_notified.clear()
    assert not await _offer(nm, "A"), "A got yesterday's slot — B is starved and goes first"
    assert nm._starved == {task_key_of("e1", "B")}
    assert await _offer(nm, "B")
    assert nm._starved == set()
    assert not await _offer(nm, "A"), "limit reached"


async def test_starved_hold_only_while_the_budget_would_not_cover_them(hass: HomeAssistant) -> None:
    _global(hass, max_per_day=3)
    nm, _ = _manager(hass)
    assert await _offer(nm, "A") and await _offer(nm, "B") and await _offer(nm, "C")
    assert not await _offer(nm, "D")
    nm._daily_reset_date = dt_util.now().date() - timedelta(days=1)
    nm._last_notified.clear()
    # 3 slots, 1 starved task: A passes (2 left > 1 starved), B passes (1 left = 1 starved is
    # exactly the budget D needs), C is held (the last slot belongs to D), D goes, C hits the limit.
    assert await _offer(nm, "A")
    assert await _offer(nm, "B")
    assert not await _offer(nm, "C"), "the last slot is held for D"
    assert await _offer(nm, "D")
    assert not await _offer(nm, "C"), "limit reached"


async def test_high_priority_ignores_the_starved_hold(hass: HomeAssistant) -> None:
    _global(hass, max_per_day=1)
    nm, _ = _manager(hass)
    assert await _offer(nm, "A")
    assert not await _offer(nm, "B")
    nm._daily_reset_date = dt_util.now().date() - timedelta(days=1)
    nm._last_notified.clear()
    assert await _offer(nm, "H", "high"), "high priority is never held for starved normal tasks"


async def test_repeat_yields_to_a_task_still_waiting_today(hass: HomeAssistant) -> None:
    _global(hass, max_per_day=2, overdue_interval=1)
    nm, _ = _manager(hass)
    assert await _offer(nm, "A")
    nm._daily_count = 2  # budget exhausted by something else
    assert not await _offer(nm, "B")  # waiting today
    nm._daily_count = 1  # a slot frees up (e.g. the day's count was corrected)
    # A's repeat interval elapsed — but B is still waiting, so A yields.
    nm._last_notified = {k: v - timedelta(hours=2) for k, v in nm._last_notified.items()}
    assert not await _offer(nm, "A"), "repeat yields"
    assert await _offer(nm, "B")
    # Nobody waits any more → A's repeat goes through when a slot is there.
    nm._daily_count = 1
    assert await _offer(nm, "A")


async def test_bundle_admits_and_marks_all_members(hass: HomeAssistant) -> None:
    _global(hass, max_per_day=5)
    nm = NotificationManager(hass)
    with patch("custom_components.maintenance_supporter.helpers.notification_manager.async_emit_and_dispatch", AsyncMock(return_value=True)):
        await nm.async_send_bundled(
            entry_id="e1",
            object_name="Obj",
            tasks=[
                {"task_id": "t1", "task_name": "T1", "status": MaintenanceStatus.OVERDUE},
                {"task_id": "t2", "task_name": "T2", "status": MaintenanceStatus.DUE_SOON},
            ],
        )
    assert nm._daily_count == 1, "a bundle is one message"
    assert nm._served_today == {task_key_of("e1", "t1"), task_key_of("e1", "t2")}


async def test_held_task_is_not_stamped_and_is_offered_again(hass: HomeAssistant) -> None:
    _global(hass, max_per_day=1)
    nm, _ = _manager(hass)
    assert await _offer(nm, "A")
    assert not await _offer(nm, "B")
    assert not any(k.startswith("e1_B") for k in nm._last_notified), "a held task keeps no stamp"
    nm._daily_count = 0  # a slot again → the next refresh's offer goes through
    assert await _offer(nm, "B")


def test_priority_rank_table() -> None:
    rank: Any = NotificationManager._priority_rank
    assert rank({"priority": "high"}) == 0
    assert rank({"priority": "normal"}) == 1
    assert rank({"priority": "low"}) == 2
    assert rank({}) == 1 and rank(None) == 1 and rank({"priority": "bogus"}) == 1
