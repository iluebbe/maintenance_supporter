"""Idle trigger (D#275): nothing happened for N days.

*State change* counts changes and *Runtime* counts time switched on; neither
notices that nothing happens. This trigger does, in one of two kinds:

* ``no_change`` (the default): the task is due once the entity has kept its
  value for ``trigger_idle_days`` days — a door latch that has not reported,
  irrigation that has not run, a rain sensor that stayed dry. Going
  unavailable and back with the same value is no change; the count runs on.
* ``unavailable``: the task is due once the entity has been unavailable (or
  unknown) that long — a sensor at the edge of its range that drops out for
  minutes is fine, one gone for a week needs a visit. Kept apart from the
  first kind on purpose: an offline device is not an idle one.

The reading is the days of quiet so far. The count starts again with the
next change (or the device coming back), and with a completion: checking
on it is the maintenance, and the task is due again after another quiet
stretch. The moment the quiet began is persisted, so a restart does not
start the count over (Home Assistant's own ``last_changed`` does).
"""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import TYPE_CHECKING, Any

from homeassistant.core import Event, EventStateChangedData, HomeAssistant, State, callback
from homeassistant.util import dt as dt_util

from ...const import (
    CONF_TRIGGER_IDLE_DAYS,
    CONF_TRIGGER_IDLE_MODE,
    IDLE_MODES,
    IDLE_NO_CHANGE,
    IDLE_UNAVAILABLE,
    UNAVAILABLE_STATES,
)
from ...helpers.managed_timer import ManagedTimer
from .base_trigger import BaseTrigger

if TYPE_CHECKING:
    from .base_trigger import TriggerHost

#: The persisted start of the quiet (per entity, ISO timestamp).
IDLE_SINCE_KEY = "idle_since"


def _parse(raw: Any) -> datetime | None:
    if not isinstance(raw, str) or not raw:
        return None
    parsed = dt_util.parse_datetime(raw)
    return dt_util.as_utc(parsed) if parsed is not None else None


class IdleTrigger(BaseTrigger):
    """Active once the entity has been quiet for ``trigger_idle_days`` days."""

    def __init__(self, hass: HomeAssistant, entity: TriggerHost, trigger_config: dict[str, Any]) -> None:
        super().__init__(hass, entity, trigger_config)
        days = trigger_config.get(CONF_TRIGGER_IDLE_DAYS)
        self._idle_days = float(days) if isinstance(days, int | float) and not isinstance(days, bool) and days > 0 else 7.0
        mode = trigger_config.get(CONF_TRIGGER_IDLE_MODE)
        self._mode = mode if mode in IDLE_MODES else IDLE_NO_CHANGE
        self._since: datetime | None = _parse(trigger_config.get("trigger_idle_since"))
        self._last_value: str | None = None
        self._idle_timer = ManagedTimer(hass, f"IdleTrigger:{self.entity_id}:idle")

    # ── the reading: days of quiet ───────────────────────────────────────────

    def _value_of(self, state: State) -> str | None:
        """The value whose changes count (the attribute when one is named)."""
        if self.attribute:
            raw = state.attributes.get(self.attribute)
            return None if raw is None else str(raw)
        return state.state

    def _quiet_days(self) -> float:
        if self._since is None:
            return 0.0
        return max((dt_util.utcnow() - self._since).total_seconds() / 86400, 0.0)

    def _get_numeric_value(self, state: State) -> float | None:
        return round(self._quiet_days(), 2)

    def evaluate(self, value: float) -> bool:
        return self._since is not None and value >= self._idle_days

    # ── setup and events ─────────────────────────────────────────────────────

    async def async_setup(self) -> None:
        """Learn the quiet so far and wake up when it is long enough. Unlike
        the other kinds, an unavailable entity is a reading here."""
        self._unsub_listener = self._listen()
        state = self.hass.states.get(self.entity_id)
        unavailable = state is None or state.state in UNAVAILABLE_STATES
        if self._mode == IDLE_UNAVAILABLE:
            if not unavailable:
                self._since = None
            elif self._since is None:
                self._since = dt_util.utcnow()
                self._persist_soon(self._persist_runtime)
        else:
            if state is not None and not unavailable:
                self._last_value = self._value_of(state)
            if self._since is None:
                # Home Assistant's last change is the best guess there is the
                # first time (it starts over at every restart, ours does not).
                self._since = dt_util.as_utc(state.last_changed) if state is not None else dt_util.utcnow()
                self._persist_soon(self._persist_runtime)
        self._reevaluate()

    def _listen(self) -> Any:
        from homeassistant.helpers.event import async_track_state_change_event

        return async_track_state_change_event(self.hass, [self.entity_id], self._handle_state_change_event)

    @callback
    def _handle_state_change_event(self, event: Event[EventStateChangedData]) -> None:
        new_state = event.data.get("new_state")
        unavailable = new_state is None or new_state.state in UNAVAILABLE_STATES
        if self._mode == IDLE_UNAVAILABLE:
            if unavailable and self._since is None:
                self._quiet_from(dt_util.utcnow())
            elif not unavailable and self._since is not None:
                self._quiet_from(None)
            return
        if unavailable or new_state is None:
            return  # no news: the count runs on
        value = self._value_of(new_state)
        if value is None:
            return
        if self._last_value is not None and value != self._last_value:
            self._last_value = value
            self._quiet_from(dt_util.utcnow())
            return
        self._last_value = value
        self._reevaluate()

    def _quiet_from(self, since: datetime | None) -> None:
        self._since = since
        self._persist_soon(self._persist_runtime)
        self._reevaluate()

    def _reevaluate(self) -> None:
        value = round(self._quiet_days(), 2)
        self._current_value = value
        self._evaluate_and_update(value)
        self._arm()

    def _arm(self) -> None:
        """Wake up when the quiet is long enough; nothing else would."""
        if self._since is None or self._triggered:
            self._idle_timer.cancel()
            return
        self._idle_timer.schedule_at(self._since + timedelta(days=self._idle_days), self._on_idle)

    @callback
    def _on_idle(self, _now: datetime) -> None:
        self._reevaluate()

    def evaluate_live(self) -> None:
        self._reevaluate()

    # ── completion, persistence, teardown ────────────────────────────────────

    def reset(self) -> None:
        """Done: the count starts again now (an unavailable one only while
        it still is)."""
        super().reset()
        if self._mode == IDLE_UNAVAILABLE:
            state = self.hass.states.get(self.entity_id)
            still_gone = state is None or state.state in UNAVAILABLE_STATES
            self._since = dt_util.utcnow() if still_gone else None
        else:
            self._since = dt_util.utcnow()
        self._current_value = 0.0
        self._persist_soon(self._persist_runtime)
        self._arm()

    async def _persist_runtime(self) -> None:
        data: dict[str, Any] = {IDLE_SINCE_KEY: self._since.isoformat()} if self._since is not None else {}
        await self._coordinator.async_persist_trigger_runtime(self._task_id, data, entity_id=self.entity_id)

    async def async_teardown(self) -> None:
        self._idle_timer.close()
        await super().async_teardown()
