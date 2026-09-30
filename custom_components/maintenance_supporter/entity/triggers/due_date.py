"""Due-date trigger: the device reports WHEN the maintenance is due.

Some integrations do the bookkeeping themselves and publish the date the next
filter change or cleaning falls due (a Vitesy purifier's ``filter_change_due``
timestamp, a date sensor). A threshold cannot read a date, and the moment
passes without the sensor changing — so this trigger turns the reported date
into "days left" (its numeric reading) and arms a timer for the instant it
falls within ``trigger_days_before`` days. When the device moves the date
forward (its own "filter changed" button, pressed by the task's completion
action), the trigger clears and — with ``auto_complete_on_recovery`` — the
task records the completion.
"""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import TYPE_CHECKING, Any

from homeassistant.core import HomeAssistant, State, callback
from homeassistant.util import dt as dt_util

from ...const import UNAVAILABLE_STATES
from ...helpers.dates import days_until, due_instant
from ...helpers.managed_timer import ManagedTimer
from .base_trigger import BaseTrigger

if TYPE_CHECKING:
    from .base_trigger import TriggerHost


class DueDateTrigger(BaseTrigger):
    """Active from ``trigger_days_before`` days before the reported date."""

    def __init__(
        self,
        hass: HomeAssistant,
        entity: TriggerHost,
        trigger_config: dict[str, Any],
    ) -> None:
        """Initialize the due-date trigger."""
        super().__init__(hass, entity, trigger_config)
        self._days_before = float(trigger_config.get("trigger_days_before") or 0)
        self._due_at: datetime | None = None
        self._due_timer = ManagedTimer(hass, f"DueDateTrigger:{self.entity_id}:due")

    def _get_numeric_value(self, state: State) -> float | None:
        """Days left until the reported date (negative once passed)."""
        raw = state.attributes.get(self.attribute) if self.attribute else state.state
        self._due_at = due_instant(raw)
        if self._due_at is None:
            return None
        return days_until(self._due_at, dt_util.utcnow())

    def evaluate(self, value: float) -> bool:
        """Due within the lead time, or already past."""
        return value <= self._days_before

    def _evaluate_and_update(self, value: float) -> None:
        super()._evaluate_and_update(value)
        self._arm()

    def _arm(self) -> None:
        """Wake up when the date comes within the lead time — nothing else
        would: the sensor keeps reporting the same date until then."""
        if self._due_at is None or self._triggered:
            self._due_timer.cancel()
            return
        self._due_timer.schedule_at(self._due_at - timedelta(days=self._days_before), self._on_due)

    @callback
    def _on_due(self, _now: datetime) -> None:
        state = self.hass.states.get(self.entity_id)
        if state is None or state.state in UNAVAILABLE_STATES:
            return
        value = self._get_numeric_value(state)
        if value is not None:
            self._current_value = value
            self._evaluate_and_update(value)

    async def async_teardown(self) -> None:
        """Cancel the due timer along with the listener."""
        self._due_timer.close()
        await super().async_teardown()
