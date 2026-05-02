"""Stale-reference / dual-storage hardening (v1.5.4 audit follow-ups to #48).

A — entity_id rewrite on HA rename (trigger_config + adaptive_config)
B — responsible_user_id orphan cleanup at startup
C — group task_refs cleanup on async_remove_entry path
"""

from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock

from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_GROUPS,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from custom_components.maintenance_supporter.helpers.entity_rename import (
    rewrite_task,
    rewrite_trigger_config,
)
from tests.conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    setup_integration,
)

# ── A. Entity rename — pure rewrite helpers (no hass needed) ────────────────


def test_rewrite_flat_entity_id() -> None:
    new, changed = rewrite_trigger_config(
        {"type": "threshold", "entity_id": "sensor.old", "trigger_above": 5},
        "sensor.old",
        "sensor.new",
    )
    assert changed is True
    assert new["entity_id"] == "sensor.new"
    assert new["trigger_above"] == 5  # untouched


def test_rewrite_entity_ids_list() -> None:
    new, changed = rewrite_trigger_config(
        {"type": "counter", "entity_ids": ["sensor.a", "sensor.old", "sensor.b"]},
        "sensor.old",
        "sensor.new",
    )
    assert changed is True
    assert new["entity_ids"] == ["sensor.a", "sensor.new", "sensor.b"]


def test_rewrite_trigger_state_keys() -> None:
    """_trigger_state is keyed by entity_id; keys must be remapped."""
    new, changed = rewrite_trigger_config(
        {
            "type": "counter",
            "entity_id": "sensor.old",
            "_trigger_state": {"sensor.old": {"baseline_value": 42}},
        },
        "sensor.old",
        "sensor.new",
    )
    assert changed is True
    assert "sensor.old" not in new["_trigger_state"]
    assert new["_trigger_state"]["sensor.new"]["baseline_value"] == 42


def test_rewrite_compound_recurses() -> None:
    new, changed = rewrite_trigger_config(
        {
            "type": "compound",
            "operator": "AND",
            "conditions": [
                {"type": "threshold", "entity_id": "sensor.other", "trigger_above": 1},
                {
                    "type": "threshold",
                    "trigger_config": {
                        "type": "threshold",
                        "entity_id": "sensor.old",
                        "trigger_above": 9,
                    },
                },
            ],
        },
        "sensor.old",
        "sensor.new",
    )
    assert changed is True
    assert new["conditions"][0]["entity_id"] == "sensor.other"  # untouched
    assert new["conditions"][1]["trigger_config"]["entity_id"] == "sensor.new"


def test_rewrite_no_match_returns_unchanged() -> None:
    cfg = {"type": "threshold", "entity_id": "sensor.unrelated"}
    new, changed = rewrite_trigger_config(cfg, "sensor.old", "sensor.new")
    assert changed is False
    assert new == cfg


def test_rewrite_environmental_entity() -> None:
    new, changed = rewrite_task(
        {
            "id": "t1",
            "trigger_config": {"type": "threshold", "entity_id": "sensor.temp"},
            "adaptive_config": {"environmental_entity": "sensor.humidity"},
        },
        "sensor.humidity",
        "sensor.humidity_v2",
    )
    assert changed is True
    assert new["adaptive_config"]["environmental_entity"] == "sensor.humidity_v2"


# ── A (integration). Full rename event → entry data rewrite ─────────────────


async def test_entity_rename_rewrites_trigger_config_and_reloads(
    hass: HomeAssistant,
    global_config_entry: MockConfigEntry,
) -> None:
    """A rename in HA's entity_registry rewrites stored entity references."""
    task = build_task_data()
    task["trigger_config"] = {
        "type": "threshold",
        "entity_id": "sensor.old_name",
        "trigger_above": 5,
    }
    task["adaptive_config"] = {
        "enabled": True,
        "environmental_entity": "sensor.old_name",
    }
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Renamable",
        data=build_object_entry_data(
            object_data=build_object_data(name="Renamable"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_renamable",
    )
    entry.add_to_hass(hass)
    await setup_integration(hass, global_config_entry, entry)

    # Fire a synthetic entity_registry rename event
    hass.bus.async_fire(
        er.EVENT_ENTITY_REGISTRY_UPDATED,
        {
            "action": "update",
            "entity_id": "sensor.new_name",
            "changes": {"entity_id": "sensor.old_name"},
        },
    )
    await hass.async_block_till_done()

    # The reload happens via async_schedule_reload — flush both the event
    # handler and the reload.
    await hass.async_block_till_done()

    refreshed = hass.config_entries.async_get_entry(entry.entry_id)
    assert refreshed is not None
    rewritten = refreshed.data[CONF_TASKS][TASK_ID_1]
    # trigger_config stays in entry.data
    assert rewritten["trigger_config"]["entity_id"] == "sensor.new_name"
    # adaptive_config migrates to Store post-setup — read it from there.
    rd = getattr(refreshed, "runtime_data", None)
    store = getattr(rd, "store", None) if rd else None
    assert store is not None
    ac = store.get_adaptive_config(TASK_ID_1)
    assert ac is not None
    assert ac["environmental_entity"] == "sensor.new_name"


async def test_entity_rename_ignores_unrelated_event(
    hass: HomeAssistant,
    global_config_entry: MockConfigEntry,
    object_config_entry: MockConfigEntry,
) -> None:
    """Non-rename entity_registry events must not touch entry.data."""
    await setup_integration(hass, global_config_entry, object_config_entry)
    before = dict(
        hass.config_entries.async_get_entry(object_config_entry.entry_id).data
    )

    # action=create has no "changes" — must be a no-op
    hass.bus.async_fire(
        er.EVENT_ENTITY_REGISTRY_UPDATED,
        {"action": "create", "entity_id": "sensor.new"},
    )
    await hass.async_block_till_done()
    after = hass.config_entries.async_get_entry(object_config_entry.entry_id).data
    assert dict(after) == before


# ── B. responsible_user_id orphan cleanup ───────────────────────────────────


async def test_orphan_responsible_user_id_cleared_at_setup(
    hass: HomeAssistant,
) -> None:
    """A task's responsible_user_id pointing at a deleted user is cleared."""
    real_user = MagicMock(id="real-user-uuid")
    hass.auth.async_get_users = AsyncMock(return_value=[real_user])  # type: ignore[method-assign]

    task = build_task_data()
    task["responsible_user_id"] = "ghost-user-uuid"  # no such user

    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Has ghost user",
        data=build_object_entry_data(tasks={TASK_ID_1: task}),
        source="user",
        unique_id="maintenance_supporter_ghost_user",
    )
    entry.add_to_hass(hass)

    global_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    global_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, entry)

    refreshed = hass.config_entries.async_get_entry(entry.entry_id)
    cleaned_task = refreshed.data[CONF_TASKS][TASK_ID_1]
    assert "responsible_user_id" not in cleaned_task


async def test_real_responsible_user_id_kept(
    hass: HomeAssistant,
) -> None:
    """A task's responsible_user_id pointing at an active user survives."""
    real_user = MagicMock(id="active-user")
    hass.auth.async_get_users = AsyncMock(return_value=[real_user])  # type: ignore[method-assign]

    task = build_task_data()
    task["responsible_user_id"] = "active-user"

    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Has real user",
        data=build_object_entry_data(tasks={TASK_ID_1: task}),
        source="user",
        unique_id="maintenance_supporter_real_user",
    )
    entry.add_to_hass(hass)

    global_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    global_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, entry)

    refreshed = hass.config_entries.async_get_entry(entry.entry_id)
    assert refreshed.data[CONF_TASKS][TASK_ID_1]["responsible_user_id"] == "active-user"


async def test_orphan_check_skipped_when_no_users(
    hass: HomeAssistant,
) -> None:
    """Defensive: 0 users → no pruning. Otherwise tests with synthetic
    user_ids would have them silently stripped."""
    hass.auth.async_get_users = AsyncMock(return_value=[])  # type: ignore[method-assign]

    task = build_task_data()
    task["responsible_user_id"] = "synthetic-test-user"

    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="No users at all",
        data=build_object_entry_data(tasks={TASK_ID_1: task}),
        source="user",
        unique_id="maintenance_supporter_no_users",
    )
    entry.add_to_hass(hass)
    global_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    global_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, entry)

    refreshed = hass.config_entries.async_get_entry(entry.entry_id)
    assert refreshed.data[CONF_TASKS][TASK_ID_1]["responsible_user_id"] == "synthetic-test-user"


# ── C. cleanup_group_refs from async_remove_entry path ──────────────────────


async def test_async_remove_entry_cleans_group_refs(
    hass: HomeAssistant,
) -> None:
    """Removing a config entry via HA core (not our WS) still prunes group refs."""
    # Global entry holds the groups. Pre-seed a group whose task_refs include
    # the entry we're about to remove.
    obj_unique = "maintenance_supporter_grouped_obj"
    obj_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Grouped",
        data=build_object_entry_data(tasks={TASK_ID_1: build_task_data()}),
        source="user", unique_id=obj_unique,
    )
    obj_entry.add_to_hass(hass)

    global_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        options={
            CONF_GROUPS: {
                "g1": {
                    "name": "Test Group",
                    "task_refs": [
                        {"entry_id": obj_entry.entry_id, "task_id": TASK_ID_1},
                        {"entry_id": "another-entry", "task_id": TASK_ID_1},
                    ],
                },
            },
        },
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    global_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj_entry)

    # Sanity: ref present before removal
    refs_before = global_entry.options[CONF_GROUPS]["g1"]["task_refs"]
    assert any(r["entry_id"] == obj_entry.entry_id for r in refs_before)

    # Remove via HA's core API — this triggers async_remove_entry directly.
    await hass.config_entries.async_remove(obj_entry.entry_id)
    await hass.async_block_till_done()

    refs_after = global_entry.options[CONF_GROUPS]["g1"]["task_refs"]
    assert all(r["entry_id"] != obj_entry.entry_id for r in refs_after)
    # The other-entry ref must survive — we only prune the removed entry.
    assert any(r["entry_id"] == "another-entry" for r in refs_after)
