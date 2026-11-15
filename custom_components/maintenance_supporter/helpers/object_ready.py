"""Waiting out an object's reload before acting on one of its tasks.

An object reloads for many reasons: a completion's part crosses its reorder
level and the buy reminder is created, another user changes the object, an
undo, a rename. For the second or so it takes, the object has no
coordinator, or one whose task sensors are not added yet. A completion
arriving then was answered "Coordinator not found" (the panel's bulk
complete reported "1 failed"), and the phone's Complete button and an NFC
tap were dropped with a log line only (A9-1, bug audit 2026-11-14). The
surfaces a person acts on wait for the reload to end instead.
"""

from __future__ import annotations

import asyncio
import time

from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant

#: How long an action waits for its object to come back.
RELOAD_WAIT_SECONDS = 10.0
_POLL_SECONDS = 0.2
_IN_TRANSIT = frozenset({ConfigEntryState.SETUP_IN_PROGRESS, ConfigEntryState.UNLOAD_IN_PROGRESS})


def object_reloading(hass: HomeAssistant, entry_id: str) -> bool:
    """Whether the object is being set up or taken down right now (a reload
    holds the entry's setup lock from the unload to the end of the setup).
    An object that is simply not loaded (disabled, failed) is not."""
    entry = hass.config_entries.async_get_entry(entry_id)
    if entry is None or entry.disabled_by is not None:
        return False
    lock = getattr(entry, "setup_lock", None)
    return entry.state in _IN_TRANSIT or bool(lock is not None and lock.locked())


async def async_wait_object_ready(hass: HomeAssistant, entry_id: str, timeout: float = RELOAD_WAIT_SECONDS) -> None:
    """Return once the object is not reloading, at most after ``timeout``
    seconds (then the caller answers as before)."""
    deadline = time.monotonic() + timeout
    while object_reloading(hass, entry_id) and time.monotonic() < deadline:
        await asyncio.sleep(_POLL_SECONDS)
