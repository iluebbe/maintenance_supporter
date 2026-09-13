"""ManagedTimer — the one-shot / interval / retry / task plumbing every
timer-owning class used to hand-roll (DRY audit 2026-09).

Six classes (the sensor triggers' retry and for/hold timers, the runtime
trigger's periodic persist, the shopping-list debounce, the document-text
backfill) each kept an ``unsub`` handle, cancelled it before re-arming,
nulled it — or forgot to — inside the callback, and spawned fire-and-forget
tasks nobody cancelled at teardown. The variants had already drifted: one
callback never nulled its handle, one retry was a hard-coded single shot,
two schedulers could re-arm a timer AFTER their owner was torn down.

This class owns exactly that HANDLE LIFECYCLE and nothing else:

* :meth:`schedule` / :meth:`schedule_at` / :meth:`schedule_interval` arm a
  timer, cancelling a pending one first; the handle is cleared BEFORE the
  callback runs, so ``pending`` is already False inside it and the callback
  may re-arm freely.
* :meth:`cancel` drops a pending timer (idempotent).
* :meth:`close` cancels, cancels every tracked task and LATCHES: any later
  schedule is a no-op logged at debug — a queued ``schedule_resync`` after
  ``async_teardown`` can no longer resurrect a dead sync.
* :meth:`retry` counts attempts against an optional cap.
* :meth:`track_task` keeps the created tasks in a set; ``close`` cancels
  them (opt out per task with ``cancel_on_close=False`` for work that must
  land even across a reload).

What stays in the owners: the premise re-checks inside a fired callback
(does the threshold still hold? is the state still the pending one?) — that
is domain logic, not plumbing.
"""

from __future__ import annotations

import asyncio
import logging
from collections.abc import Callable, Coroutine
from datetime import datetime, timedelta
from typing import Any

from homeassistant.core import CALLBACK_TYPE, HassJob, HomeAssistant, callback
from homeassistant.helpers.event import async_call_later, async_track_point_in_utc_time, async_track_time_interval
from homeassistant.util import dt as dt_util

_LOGGER = logging.getLogger(__name__)

TimerCallback = Callable[[datetime], Any]

DEFAULT_RETRY_DELAY = 30.0


class ManagedTimer:
    """Owns one timer handle (plus the tasks it spawns) for its owner."""

    __slots__ = ("_attempts", "_closed", "_hass", "_name", "_tasks", "_unsub")

    def __init__(self, hass: HomeAssistant, name: str) -> None:
        self._hass = hass
        self._name = name
        self._unsub: CALLBACK_TYPE | None = None
        self._closed = False
        self._attempts = 0
        self._tasks: set[asyncio.Task[Any]] = set()

    # ── state ────────────────────────────────────────────────────────────

    @property
    def name(self) -> str:
        return self._name

    @property
    def pending(self) -> bool:
        """Whether a timer is armed right now."""
        return self._unsub is not None

    @property
    def closed(self) -> bool:
        return self._closed

    @property
    def attempts(self) -> int:
        """How many retries :meth:`retry` has armed since the last reset."""
        return self._attempts

    @property
    def tracked_tasks(self) -> int:
        return len(self._tasks)

    # ── arming ───────────────────────────────────────────────────────────

    def _refuse_when_closed(self, what: str) -> bool:
        if self._closed:
            _LOGGER.debug("%s: %s ignored — timer closed", self._name, what)
            return True
        return False

    def _wrap(self, cb: TimerCallback) -> HassJob[[datetime], Any]:
        @callback
        def _fire(now: datetime) -> None:
            # Cleared BEFORE the callback so it may re-arm; a callback that
            # forgot this used to leave a dead handle behind (threshold.py).
            self._unsub = None
            cb(now)

        # cancel_on_shutdown: a pending timer must never outlive HA (or a test
        # teardown) — whatever it carries is worthless after shutdown.
        return HassJob(_fire, f"{self._name} timer", cancel_on_shutdown=True)

    @callback
    def schedule(self, delay: timedelta | float, cb: TimerCallback) -> None:
        """Fire ``cb`` after ``delay`` (seconds or timedelta), replacing any
        pending timer. No-op after :meth:`close`."""
        if self._refuse_when_closed("schedule"):
            return
        self.cancel()
        seconds = delay.total_seconds() if isinstance(delay, timedelta) else float(delay)
        self._unsub = async_call_later(self._hass, max(0.0, seconds), self._wrap(cb))

    @callback
    def schedule_at(self, when: datetime, cb: TimerCallback) -> None:
        """Fire ``cb`` at the wall-clock instant ``when`` (naive = UTC)."""
        if self._refuse_when_closed("schedule_at"):
            return
        self.cancel()
        self._unsub = async_track_point_in_utc_time(self._hass, self._wrap(cb), dt_util.as_utc(when))

    @callback
    def schedule_interval(self, interval: timedelta, cb: TimerCallback) -> None:
        """Fire ``cb`` every ``interval`` until cancelled/closed."""
        if self._refuse_when_closed("schedule_interval"):
            return
        self.cancel()

        # An interval keeps its handle: this wrapper must NOT clear it. It
        # still exists so a plain function runs in the loop (a bare callable
        # inside a HassJob is dispatched to the executor).
        @callback
        def _tick(now: datetime) -> None:
            cb(now)

        # async_track_time_interval builds its own HassJob (a HassJob passed
        # in would be double-wrapped and dispatched to the executor).
        self._unsub = async_track_time_interval(
            self._hass, _tick, interval, name=f"{self._name} interval", cancel_on_shutdown=True
        )

    @callback
    def retry(
        self,
        cb: TimerCallback,
        *,
        delay: timedelta | float = DEFAULT_RETRY_DELAY,
        max_attempts: int | None = None,
    ) -> bool:
        """Arm one more retry of ``cb``; returns False (nothing armed) once
        ``max_attempts`` is reached or the timer is closed. The counter
        survives across attempts — :meth:`reset_retries` starts over."""
        if self._closed:
            return False
        if max_attempts is not None and self._attempts >= max_attempts:
            _LOGGER.debug("%s: retry budget exhausted (%d attempts)", self._name, self._attempts)
            return False
        self._attempts += 1
        self.schedule(delay, cb)
        return True

    @callback
    def reset_retries(self) -> None:
        self._attempts = 0

    # ── tasks ────────────────────────────────────────────────────────────

    def track_task(
        self,
        coro: Coroutine[Any, Any, Any],
        *,
        name: str | None = None,
        background: bool = False,
        cancel_on_close: bool = True,
    ) -> asyncio.Task[Any] | None:
        """Create a task for ``coro`` and remember it; ``close`` cancels the
        ones created with ``cancel_on_close`` (the default). After ``close``
        the coroutine is closed unawaited and None is returned. ``background``
        uses HA's background-task pool (never blocks ``async_block_till_done``)."""
        if self._closed:
            _LOGGER.debug("%s: task %s dropped — timer closed", self._name, name or "")
            coro.close()
            return None
        task_name = name or f"{self._name} task"
        if background:
            task = self._hass.async_create_background_task(coro, task_name)
        else:
            task = self._hass.async_create_task(coro, task_name)
        if cancel_on_close and not task.done():
            self._tasks.add(task)
            task.add_done_callback(self._tasks.discard)
        return task

    # ── teardown ─────────────────────────────────────────────────────────

    @callback
    def cancel(self) -> None:
        """Drop the pending timer, if any (idempotent)."""
        if self._unsub is not None:
            self._unsub()
            self._unsub = None

    @callback
    def close(self) -> None:
        """Cancel, cancel tracked tasks and latch — nothing re-arms after this."""
        self._closed = True
        self.cancel()
        for task in list(self._tasks):
            task.cancel()
        self._tasks.clear()
