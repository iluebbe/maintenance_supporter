"""Aggregate summary coordinator for the global Maintenance Supporter entry.

Holds the cross-object status counts that back the global summary sensors.
It does not poll: it recomputes whenever any object coordinator updates, a new
object entry appears, or a sensor trigger flips — mirroring the live-update
pattern used by the ``maintenance_supporter/subscribe`` WebSocket endpoint.
"""

from __future__ import annotations

import logging
from typing import Any

from homeassistant.core import CALLBACK_TYPE, Event, HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator

from ..const import (
    EVENT_TRIGGER_ACTIVATED,
    EVENT_TRIGGER_DEACTIVATED,
    SIGNAL_NEW_OBJECT_ENTRY,
    SIGNAL_OBJECT_ENTRY_REMOVED,
)
from ..helpers.aggregate import (
    compute_status_counts,
    get_object_entries,
    get_runtime_data,
)

_LOGGER = logging.getLogger(__name__)


class MaintenanceSummaryCoordinator(DataUpdateCoordinator[dict[str, Any]]):
    """Event-driven aggregator of task status counts across all objects."""

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize the summary coordinator (no polling)."""
        super().__init__(
            hass,
            _LOGGER,
            name="Maintenance Supporter summary",
            update_interval=None,
        )
        self._unsubs: list[CALLBACK_TYPE] = []
        self._attached: dict[str, CALLBACK_TYPE] = {}

    async def _async_update_data(self) -> dict[str, Any]:
        """Recompute counts from the shared aggregator (single source)."""
        return compute_status_counts(self.hass)

    @callback
    def async_setup_listeners(self) -> None:
        """Attach to every object coordinator + new-entry/trigger signals."""
        for entry in get_object_entries(self.hass):
            self._attach_entry(entry.entry_id)

        self._unsubs.append(async_dispatcher_connect(self.hass, SIGNAL_NEW_OBJECT_ENTRY, self._on_new_entry))
        self._unsubs.append(async_dispatcher_connect(self.hass, SIGNAL_OBJECT_ENTRY_REMOVED, self._on_removed))
        # Trigger activation/deactivation updates a task's _status in place but
        # does NOT notify coordinator listeners, so listen for it explicitly.
        self._unsubs.append(self.hass.bus.async_listen(EVENT_TRIGGER_ACTIVATED, self._on_event))
        self._unsubs.append(self.hass.bus.async_listen(EVENT_TRIGGER_DEACTIVATED, self._on_event))

    def _attach_entry(self, entry_id: str) -> None:
        """Register a listener on a single object coordinator (once)."""
        if entry_id in self._attached:
            return
        rd = get_runtime_data(self.hass, entry_id)
        if rd and rd.coordinator:
            self._attached[entry_id] = rd.coordinator.async_add_listener(self._schedule)

    @callback
    def _on_new_entry(self, entry_id: str) -> None:
        """A new object entry was set up — attach and recompute."""
        self._attach_entry(entry_id)
        self._schedule()

    @callback
    def _on_removed(self, entry_id: str) -> None:
        """An object entry was deleted — detach its listener and recompute."""
        unsub = self._attached.pop(entry_id, None)
        if unsub is not None:
            unsub()
        self._schedule()

    @callback
    def _on_event(self, _event: Event) -> None:
        self._schedule()

    @callback
    def _schedule(self) -> None:
        """Request a (debounced) recompute from any sync callback."""
        self.hass.async_create_task(self.async_request_refresh())

    @callback
    def async_teardown_listeners(self) -> None:
        """Detach all listeners (called on global entry unload)."""
        for unsub in self._unsubs:
            unsub()
        for unsub in self._attached.values():
            unsub()
        self._unsubs.clear()
        self._attached.clear()
