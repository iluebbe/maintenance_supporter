"""Regression: a pending debounced store save must not clobber post-reload
writes (bug audit 2026-07-11).

Before the fix every entry setup created a FRESH MaintenanceStore. HA core
only cancels the 60s ``async_delay_save`` timer on HA stop — not on entry
unload — so after a reload (part CRUD, buy-task reconcile, pause/resume,
replace, options) the pre-reload instance's timer fired later and wrote its
stale full-file snapshot over everything the post-reload instance had saved
since: silent loss of completions/history. The store is now cached per
entry_id (const.STORES_CACHE_KEY) and flushed on unload, so the late timer
writes CURRENT memory. A/B-proven against the pre-fix setup.
"""

from __future__ import annotations

from datetime import timedelta

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    async_fire_time_changed,
)

from custom_components.maintenance_supporter.const import DOMAIN, GLOBAL_UNIQUE_ID

from .conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    setup_integration,
)


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


def _object(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Debounce Rig",
        data=build_object_entry_data(
            object_data=build_object_data(name="Debounce Rig"),
            tasks={TASK_ID_1: build_task_data()},
        ),
        source="user",
        unique_id="maintenance_supporter_debounce_rig",
    )
    entry.add_to_hass(hass)
    return entry


async def test_debounced_save_cannot_clobber_post_reload_writes(
    hass: HomeAssistant, global_entry: MockConfigEntry, hass_storage: dict
) -> None:
    entry = _object(hass)
    await setup_integration(hass, global_entry, entry)
    entry = hass.config_entries.async_get_entry(entry.entry_id)
    store = entry.runtime_data.store

    # A debounced write is pending (what trigger-runtime updates do)...
    store.set_last_performed(TASK_ID_1, "2026-01-01")
    store.async_delay_save()

    # ...when something reloads the entry (part CRUD / reconcile / options).
    await hass.config_entries.async_reload(entry.entry_id)
    await hass.async_block_till_done()
    entry = hass.config_entries.async_get_entry(entry.entry_id)
    store2 = entry.runtime_data.store
    assert store2 is store, "store must be reused across reloads (STORES_CACHE_KEY)"

    # A user action right after the reload saves immediately...
    store2.set_last_performed(TASK_ID_1, "2026-02-02")
    await store2.async_save()

    # ...then the pre-reload debounce timer finally fires.
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=90))
    await hass.async_block_till_done()

    key = f"{DOMAIN}.{entry.entry_id}"
    on_disk = hass_storage[key]["data"]["tasks"][TASK_ID_1]["last_performed"]
    assert on_disk == "2026-02-02", (
        "stale pre-reload snapshot clobbered the post-reload save"
    )


async def test_unload_flushes_pending_debounced_save(
    hass: HomeAssistant, global_entry: MockConfigEntry, hass_storage: dict
) -> None:
    """Unloading an entry must leave its store file current — a change still
    inside the debounce window may not sit only in memory."""
    entry = _object(hass)
    await setup_integration(hass, global_entry, entry)
    entry = hass.config_entries.async_get_entry(entry.entry_id)
    store = entry.runtime_data.store

    store.set_last_performed(TASK_ID_1, "2026-03-03")
    store.async_delay_save()
    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()

    key = f"{DOMAIN}.{entry.entry_id}"
    assert hass_storage[key]["data"]["tasks"][TASK_ID_1]["last_performed"] == "2026-03-03"
