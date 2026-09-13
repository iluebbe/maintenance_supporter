"""ManagedTimer: the shared timer/retry/task plumbing (DRY audit 2026-09).

Pins the contract every timer owner relies on: re-arming replaces, the
handle is cleared before the callback runs, close() latches, the retry
counter respects its cap, tracked tasks die with the owner — and the two
schedulers that used to re-arm after teardown (shopping sync, document
backfill) no longer do.
"""

from __future__ import annotations

import asyncio
from datetime import datetime, timedelta

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import async_fire_time_changed

from custom_components.maintenance_supporter.helpers.managed_timer import ManagedTimer


def _advance(hass: HomeAssistant, seconds: float) -> None:
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=seconds))


async def test_schedule_fires_once_and_clears_the_handle_before_the_callback(hass: HomeAssistant) -> None:
    timer = ManagedTimer(hass, "t")
    seen: list[bool] = []

    def _cb(_now: datetime) -> None:
        seen.append(timer.pending)  # already False inside the callback

    assert not timer.pending
    timer.schedule(5, _cb)
    assert timer.pending
    _advance(hass, 6)
    await hass.async_block_till_done()
    assert seen == [False]
    assert not timer.pending


async def test_rearming_replaces_the_pending_timer(hass: HomeAssistant) -> None:
    timer = ManagedTimer(hass, "t")
    fired: list[str] = []
    timer.schedule(timedelta(seconds=5), lambda _n: fired.append("first"))
    timer.schedule(5, lambda _n: fired.append("second"))
    _advance(hass, 6)
    await hass.async_block_till_done()
    assert fired == ["second"]


async def test_callback_may_rearm_itself(hass: HomeAssistant) -> None:
    timer = ManagedTimer(hass, "t")
    ticks: list[int] = []

    def _cb(_now: datetime) -> None:
        ticks.append(1)
        if len(ticks) < 3:
            timer.schedule(5, _cb)

    timer.schedule(5, _cb)
    for _ in range(3):
        _advance(hass, 6)
        await hass.async_block_till_done()
    assert len(ticks) == 3
    assert not timer.pending


async def test_schedule_at_and_cancel(hass: HomeAssistant) -> None:
    timer = ManagedTimer(hass, "t")
    fired: list[int] = []
    timer.schedule_at(dt_util.utcnow() + timedelta(seconds=10), lambda _n: fired.append(1))
    assert timer.pending
    timer.cancel()
    timer.cancel()  # idempotent
    assert not timer.pending
    _advance(hass, 11)
    await hass.async_block_till_done()
    assert fired == []
    timer.schedule_at(dt_util.utcnow() + timedelta(seconds=10), lambda _n: fired.append(2))
    _advance(hass, 11)
    await hass.async_block_till_done()
    assert fired == [2]


async def test_schedule_interval_repeats_until_closed(hass: HomeAssistant) -> None:
    timer = ManagedTimer(hass, "t")
    ticks: list[int] = []
    timer.schedule_interval(timedelta(seconds=10), lambda _n: ticks.append(1))
    assert timer.pending
    _advance(hass, 10)
    await hass.async_block_till_done()
    _advance(hass, 20)
    await hass.async_block_till_done()
    assert len(ticks) == 2
    assert timer.pending  # an interval keeps its handle
    timer.close()
    _advance(hass, 30)
    await hass.async_block_till_done()
    assert len(ticks) == 2


async def test_close_latches_every_later_schedule(hass: HomeAssistant, caplog) -> None:
    timer = ManagedTimer(hass, "latched")
    fired: list[int] = []
    timer.schedule(5, lambda _n: fired.append(1))
    timer.close()
    assert timer.closed and not timer.pending
    # The queued re-arm the old schedulers fell for: a no-op at debug.
    import logging

    caplog.set_level(logging.DEBUG, logger="custom_components.maintenance_supporter.helpers.managed_timer")
    timer.schedule(5, lambda _n: fired.append(2))
    timer.schedule_at(dt_util.utcnow() + timedelta(seconds=5), lambda _n: fired.append(3))
    timer.schedule_interval(timedelta(seconds=5), lambda _n: fired.append(4))
    assert timer.retry(lambda _n: fired.append(5)) is False
    assert not timer.pending
    assert "latched: schedule ignored" in caplog.text
    _advance(hass, 60)
    await hass.async_block_till_done()
    assert fired == []


async def test_retry_counts_attempts_against_the_cap(hass: HomeAssistant) -> None:
    timer = ManagedTimer(hass, "t")
    calls: list[int] = []

    def _attempt(_now: datetime) -> None:
        calls.append(timer.attempts)
        timer.retry(_attempt, delay=30, max_attempts=3)

    assert timer.retry(_attempt, delay=30, max_attempts=3) is True
    assert timer.attempts == 1
    for _ in range(5):
        _advance(hass, 31)
        await hass.async_block_till_done()
    # Three armed attempts fired; the fourth arm was refused, nothing pending.
    assert calls == [1, 2, 3]
    assert timer.attempts == 3
    assert not timer.pending
    timer.reset_retries()
    assert timer.attempts == 0
    assert timer.retry(_attempt, delay=1, max_attempts=3) is True


async def test_retry_default_delay_is_thirty_seconds(hass: HomeAssistant) -> None:
    timer = ManagedTimer(hass, "t")
    fired: list[int] = []
    timer.retry(lambda _n: fired.append(1))
    _advance(hass, 29)
    await hass.async_block_till_done()
    assert fired == []
    _advance(hass, 31)
    await hass.async_block_till_done()
    assert fired == [1]


async def test_tracked_tasks_are_cancelled_on_close(hass: HomeAssistant) -> None:
    timer = ManagedTimer(hass, "t")
    started = asyncio.Event()
    outcome: list[str] = []

    async def _work() -> None:
        started.set()
        try:
            await asyncio.sleep(3600)
            outcome.append("done")
        except asyncio.CancelledError:
            outcome.append("cancelled")
            raise

    task = timer.track_task(_work())
    assert task is not None
    await started.wait()
    assert timer.tracked_tasks == 1
    timer.close()
    await asyncio.sleep(0)
    await asyncio.sleep(0)
    assert outcome == ["cancelled"]
    assert timer.tracked_tasks == 0


async def test_tasks_opted_out_of_cancel_survive_close(hass: HomeAssistant) -> None:
    timer = ManagedTimer(hass, "t")
    gate = asyncio.Event()
    outcome: list[str] = []

    async def _must_land() -> None:
        await gate.wait()
        outcome.append("landed")

    task = timer.track_task(_must_land(), cancel_on_close=False)
    assert task is not None
    assert timer.tracked_tasks == 0
    timer.close()
    gate.set()
    await hass.async_block_till_done()
    assert outcome == ["landed"]


async def test_track_task_after_close_drops_the_coroutine(hass: HomeAssistant) -> None:
    timer = ManagedTimer(hass, "t")
    timer.close()
    ran: list[int] = []

    async def _never() -> None:
        ran.append(1)

    assert timer.track_task(_never()) is None  # closed unawaited, no warning
    await hass.async_block_till_done()
    assert ran == []


async def test_finished_tasks_leave_the_set(hass: HomeAssistant) -> None:
    timer = ManagedTimer(hass, "t")

    async def _quick() -> None:
        await asyncio.sleep(0)

    timer.track_task(_quick())
    timer.track_task(_quick(), background=True)
    await hass.async_block_till_done(wait_background_tasks=True)
    assert timer.tracked_tasks == 0


# ── the two schedulers that could re-arm after teardown ─────────────────────


async def test_shopping_sync_resync_queued_after_teardown_never_fires(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.shopping_sync import ShoppingListSync

    sync = ShoppingListSync(hass)
    passes: list[int] = []

    async def _resync() -> None:
        passes.append(1)

    sync.async_resync = _resync  # type: ignore[method-assign]
    sync.schedule_resync()
    assert sync._debounce.pending
    sync.async_teardown()
    sync.schedule_resync()  # the late caller (a state event drained after unload)
    assert not sync._debounce.pending
    _advance(hass, 10)
    await hass.async_block_till_done()
    assert passes == []


async def test_document_backfill_queued_after_cancel_never_fires(hass: HomeAssistant) -> None:
    from unittest.mock import MagicMock

    from custom_components.maintenance_supporter.helpers.document_text import DocumentTextIndex

    store = MagicMock()
    store.blobs = {}
    index = DocumentTextIndex(hass, store)
    runs: list[int] = []

    async def _backfill() -> dict[str, int]:
        runs.append(1)
        return {"extracted": 0, "stale": 0}

    index.async_backfill = _backfill  # type: ignore[method-assign]
    index.schedule_backfill(delay=5)
    index.cancel()
    index.schedule_backfill(delay=5)
    _advance(hass, 10)
    await hass.async_block_till_done()
    assert runs == []
    # A blob scheduled after teardown is not extracted either and does not
    # stay stuck in the pending set.
    store.blobs = {"ab" * 32: {"mime": "text/plain"}}
    index.schedule("ab" * 32)
    await hass.async_block_till_done(wait_background_tasks=True)
    assert "ab" * 32 not in index._pending


async def test_trigger_retry_rearms_until_the_entity_reports(hass: HomeAssistant) -> None:
    """The base trigger's retry used to be a single 30 s shot; it now keeps
    re-checking (capped) and stops once the entity delivers a value."""
    from unittest.mock import AsyncMock, MagicMock

    from custom_components.maintenance_supporter.entity.triggers.base_trigger import RETRY_MAX_ATTEMPTS
    from custom_components.maintenance_supporter.entity.triggers.threshold import ThresholdTrigger

    hass.states.async_set("sensor.retry_probe", "unavailable")
    entity = MagicMock()
    entity.hass = hass
    entity.entity_id = "sensor.maintenance_supporter_probe"
    entity._task_id = "task-1"
    entity.coordinator = AsyncMock()
    trigger = ThresholdTrigger(hass, entity, {"entity_id": "sensor.retry_probe", "type": "threshold", "trigger_above": 50.0})
    await trigger.async_setup()
    assert trigger._retry_timer.pending and trigger._retry_timer.attempts == 1

    _advance(hass, 31)
    await hass.async_block_till_done()
    assert trigger._retry_timer.pending and trigger._retry_timer.attempts == 2  # still unavailable → re-armed

    # Set the value WITHOUT an observable state-change edge for the listener
    # to act on: the retry itself must pick it up.
    trigger._unsub_listener()
    trigger._unsub_listener = None
    hass.states.async_set("sensor.retry_probe", "75")
    _advance(hass, 31)
    await hass.async_block_till_done()
    assert trigger._current_value == 75.0
    assert trigger._triggered is True
    assert not trigger._retry_timer.pending
    assert trigger._retry_timer.attempts == 0  # reset on recovery
    assert RETRY_MAX_ATTEMPTS >= 3
    await trigger.async_teardown()
    assert trigger._retry_timer.closed
