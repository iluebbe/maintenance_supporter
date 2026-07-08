"""Shared helpers for the journey-test family (docs/design/user-journeys.md).

Journey tests walk realistic multi-step user stories through the public
surfaces and assert the cross-cutting lifecycle invariants — especially
across the persistence boundary, where the tag-name and object-rename bugs
lived: mutations that look fine in a live session and break on the next
reload/restart.
"""

from __future__ import annotations

from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter import NOTIFICATION_MANAGER_KEY
from custom_components.maintenance_supporter.const import CONF_TASKS, DOMAIN


async def simulate_restart(hass: HomeAssistant, *entries: MockConfigEntry) -> None:
    """Unload every entry, then set them up again from persisted data.

    Approximates a config-entry RELOAD for everything a per-entry setup owns:
    entities are re-created from storage (fresh unique_id computation — the
    class of the object-rename bug), coordinators and per-entry stores are
    rebuilt. Call after every interesting mutation.

    Note: the *shared* runtime (notification manager, document store, global
    listeners) is NOT rebuilt here — it lives in ``hass.data[DOMAIN]`` and only
    gets torn down when the last entry is *removed*, not merely unloaded. For
    state that lives there (e.g. in-memory snooze), use
    :func:`simulate_full_restart` to model a real process restart.
    """
    for entry in entries:
        if entry.state == ConfigEntryState.LOADED:
            await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()
    for entry in entries:
        await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()


async def simulate_full_restart(hass: HomeAssistant, *entries: MockConfigEntry) -> None:
    """Model a real HA process restart: rebuild the SHARED runtime too.

    Unlike :func:`simulate_restart` (an entry reload), this drops
    ``hass.data[DOMAIN]`` — the notification manager, document store and global
    event listeners — the way a fresh boot would, so a fresh shared runtime is
    reconstructed on setup. Use this to test that shared, in-memory-only state
    does NOT survive a restart (e.g. the snooze contract).
    """
    for entry in entries:
        if entry.state == ConfigEntryState.LOADED:
            await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()
    # Tear the shared runtime down the way the last-entry removal would, then
    # drop it so the next setup builds a brand-new one.
    domain_data = hass.data.get(DOMAIN, {})
    nm = domain_data.get(NOTIFICATION_MANAGER_KEY)
    if nm is not None and hasattr(nm, "async_unload"):
        await nm.async_unload()
    for unsub in domain_data.get("_event_unsubs", []):
        unsub()
    hass.data.pop(DOMAIN, None)
    for entry in entries:
        await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()


def registry_snapshot(hass: HomeAssistant, entry: MockConfigEntry) -> dict[str, str]:
    """{unique_id: entity_id} for the entry — the entity-identity invariant."""
    reg = er.async_get(hass)
    return {e.unique_id: e.entity_id for e in er.async_entries_for_config_entry(reg, entry.entry_id)}


def assert_no_orphans(
    hass: HomeAssistant,
    entry: MockConfigEntry,
    *,
    deleted_task_ids: tuple[str, ...] = (),
) -> None:
    """No registry entries / devices / config-data traces for deleted ids."""
    reg = er.async_get(hass)
    for reg_entry in er.async_entries_for_config_entry(reg, entry.entry_id):
        for task_id in deleted_task_ids:
            assert task_id not in (reg_entry.unique_id or ""), f"orphaned entity {reg_entry.entity_id} for deleted task {task_id}"
    tasks = entry.data.get(CONF_TASKS, {})
    for task_id in deleted_task_ids:
        assert task_id not in tasks, f"deleted task {task_id} still in entry data"
        obj = entry.data.get("object", {})
        assert task_id not in obj.get("task_ids", []), "dangling object.task_ids ref"


def assert_entry_fully_gone(hass: HomeAssistant, entry_id: str) -> None:
    """After deleting an object: no config entry, no device, no entities."""
    assert hass.config_entries.async_get_entry(entry_id) is None
    dev_reg = dr.async_get(hass)
    assert not dr.async_entries_for_config_entry(dev_reg, entry_id), "device(s) survived object deletion"
    ent_reg = er.async_get(hass)
    assert not er.async_entries_for_config_entry(ent_reg, entry_id), "entities survived object deletion"


__all__ = [
    "DOMAIN",
    "assert_entry_fully_gone",
    "assert_no_orphans",
    "registry_snapshot",
    "simulate_full_restart",
    "simulate_restart",
]
