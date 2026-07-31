"""Object → HA-device attachment + parent hierarchy (2.19).

An object can (a) link to an EXISTING HA device (`ha_device_id`) so its task
entities land on that device's page instead of creating an own virtual
device, or (b) nest under another maintenance object (`parent_entry_id`,
HA's via_device hierarchy). Both are validated at WS write time (device must
exist; parent chain must not cycle) and degrade gracefully at read time.
"""

from __future__ import annotations

from typing import Any

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_OBJECT,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from custom_components.maintenance_supporter.websocket import _build_object_response
from custom_components.maintenance_supporter.websocket.objects import (
    _validate_device_link,
)

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


def _make_entry(
    hass: HomeAssistant,
    unique_id: str,
    name: str = "Test Object",
    extra_obj: dict[str, Any] | None = None,
) -> MockConfigEntry:
    obj = build_object_data(name=name)
    obj.update(extra_obj or {})
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title=name,
        data=build_object_entry_data(
            object_data=obj,
            tasks={TASK_ID_1: build_task_data(task_id=TASK_ID_1, interval_days=30)},
        ),
        source="user",
        unique_id=f"maintenance_supporter_{unique_id}",
    )
    entry.add_to_hass(hass)
    return entry


def _foreign_device(hass: HomeAssistant) -> dr.DeviceEntry:
    """A device owned by another integration."""
    foreign_entry = MockConfigEntry(domain="demo", title="Demo")
    foreign_entry.add_to_hass(hass)
    return dr.async_get(hass).async_get_or_create(
        config_entry_id=foreign_entry.entry_id,
        identifiers={("demo", "washer-1")},
        name="Washing Machine",
        manufacturer="Miele",
    )


async def test_linked_object_attaches_entities_to_foreign_device(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    device = _foreign_device(hass)
    obj_entry = _make_entry(
        hass,
        "linked",
        name="Washer Maintenance",
        extra_obj={"ha_device_id": device.id},
    )
    await setup_integration(hass, global_entry, obj_entry)

    ent_reg = er.async_get(hass)
    sensors = [e for e in er.async_entries_for_config_entry(ent_reg, obj_entry.entry_id) if e.domain == "sensor"]
    assert sensors, "task sensor registered"
    assert all(e.device_id == device.id for e in sensors)

    # No own virtual device was created for the object...
    own = dr.async_get(hass).async_get_device(identifiers={(DOMAIN, obj_entry.unique_id or "")})
    assert own is None
    # ...and the foreign device's metadata was NOT overwritten by the
    # obj→device forward-sync.
    refreshed = dr.async_get(hass).async_get(device.id)
    assert refreshed is not None
    assert refreshed.name == "Washing Machine"
    assert refreshed.manufacturer == "Miele"


async def test_vanished_linked_device_falls_back_to_own_device(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    obj_entry = _make_entry(
        hass,
        "dangling",
        name="Orphan",
        extra_obj={"ha_device_id": "no_such_device"},
    )
    await setup_integration(hass, global_entry, obj_entry)

    own = dr.async_get(hass).async_get_device(identifiers={(DOMAIN, obj_entry.unique_id or "")})
    assert own is not None
    assert own.name == "Orphan"


async def test_parent_object_nests_via_device(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    parent_entry = _make_entry(hass, "parent", name="Water Heater")
    child_entry = _make_entry(
        hass,
        "child",
        name="Anode Rod",
        extra_obj={"parent_entry_id": parent_entry.entry_id},
    )
    await setup_integration(hass, global_entry, parent_entry, child_entry)

    reg = dr.async_get(hass)
    parent_dev = reg.async_get_device(identifiers={(DOMAIN, parent_entry.unique_id or "")})
    child_dev = reg.async_get_device(identifiers={(DOMAIN, child_entry.unique_id or "")})
    assert parent_dev is not None and child_dev is not None
    assert child_dev.via_device_id == parent_dev.id


class _FakeConnection:
    def __init__(self) -> None:
        self.errors: list[tuple[str, str]] = []

    def send_error(self, _msg_id: Any, code: str, message: str) -> None:
        self.errors.append((code, message))


async def test_validate_rejects_unknown_device_and_parent(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    conn = _FakeConnection()
    assert not _validate_device_link(hass, conn, {"id": 1, "ha_device_id": "nope"}, self_entry_id=None)
    assert conn.errors[-1][0] == "invalid_device"

    assert not _validate_device_link(hass, conn, {"id": 2, "parent_entry_id": "nope"}, self_entry_id=None)
    assert conn.errors[-1][0] == "invalid_parent"

    # The global entry is not a valid parent either.
    assert not _validate_device_link(
        hass,
        conn,
        {"id": 3, "parent_entry_id": global_entry.entry_id},
        self_entry_id=None,
    )
    assert conn.errors[-1][0] == "invalid_parent"


async def test_validate_rejects_parent_cycle(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    a = _make_entry(hass, "cyc_a", name="A")
    b = _make_entry(hass, "cyc_b", name="B", extra_obj={"parent_entry_id": a.entry_id})
    conn = _FakeConnection()
    # Making B the parent of A closes the loop A→B→A.
    assert not _validate_device_link(
        hass,
        conn,
        {"id": 1, "parent_entry_id": b.entry_id},
        self_entry_id=a.entry_id,
    )
    assert conn.errors[-1][0] == "invalid_parent"
    # Direct self-parenting is a cycle of length one.
    assert not _validate_device_link(
        hass,
        conn,
        {"id": 2, "parent_entry_id": a.entry_id},
        self_entry_id=a.entry_id,
    )
    assert conn.errors[-1][0] == "invalid_parent"
    # A legitimate parent passes.
    assert _validate_device_link(
        hass,
        conn,
        {"id": 3, "parent_entry_id": a.entry_id},
        self_entry_id=b.entry_id,
    )


async def test_ws_response_exposes_link_fields(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    parent_entry = _make_entry(hass, "resp_parent", name="Parent")
    obj_entry = _make_entry(
        hass,
        "resp_child",
        name="Child",
        extra_obj={"parent_entry_id": parent_entry.entry_id, "ha_device_id": None},
    )
    await setup_integration(hass, global_entry, parent_entry, obj_entry)

    resp = _build_object_response(hass, obj_entry, None)
    assert resp[CONF_OBJECT]["parent_entry_id"] == parent_entry.entry_id
    assert resp[CONF_OBJECT]["ha_device_id"] is None


# ─── the reworked attachment: point at the device, do not co-own it ────────


async def test_linking_does_not_put_our_config_entry_on_the_foreign_device(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """The whole point of the rework.

    Returning the device's own identifiers from `device_info` used to make the
    registry add OUR config entry to somebody else's device. Home Assistant
    forbids that from 2026.8 and scopes identifiers per config entry, so the
    same trick then produces a SECOND, nameless device instead of a merge.
    Attaching via `device_entry` reaches the same device page without claiming
    any ownership.
    """
    device = _foreign_device(hass)
    obj_entry = _make_entry(hass, "linked", name="Washer Maintenance", extra_obj={"ha_device_id": device.id})
    await setup_integration(hass, global_entry, obj_entry)

    after = dr.async_get(hass).async_get(device.id)
    assert after is not None, "the appliance's device disappeared"
    assert obj_entry.entry_id not in after.config_entries, (
        "we are listed as an owner of another integration's device — the exact "
        "thing HA 2026.8 stops supporting"
    )

    # …and the entities are on it anyway, which is what the user cares about.
    ent_reg = er.async_get(hass)
    sensors = [e for e in er.async_entries_for_config_entry(ent_reg, obj_entry.entry_id) if e.domain == "sensor"]
    assert sensors and all(e.device_id == device.id for e in sensors)


async def test_a_linked_object_creates_no_device_of_its_own(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """`device_info` must return None while linked.

    If it described a device instead, we would get one of our own — under the
    old code carrying the appliance's identifiers and no name at all, which is
    what 2026.8 turns into a nameless duplicate in the device list.
    """
    device = _foreign_device(hass)
    obj_entry = _make_entry(hass, "linked2", name="Washer Maintenance", extra_obj={"ha_device_id": device.id})
    await setup_integration(hass, global_entry, obj_entry)

    ours = dr.async_entries_for_config_entry(dr.async_get(hass), obj_entry.entry_id)
    assert ours == [], f"a device was created for a linked object: {[d.name for d in ours]}"


async def test_a_linked_device_that_no_longer_exists_falls_back_to_an_own_device(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """Core helpers leave the entity device-less here. We keep the historical
    fallback instead: an object with its own device page reads better than one
    with none, and this is what the integration already did."""
    obj_entry = _make_entry(hass, "dangling", name="Orphan", extra_obj={"ha_device_id": "does-not-exist"})
    await setup_integration(hass, global_entry, obj_entry)

    ours = dr.async_entries_for_config_entry(dr.async_get(hass), obj_entry.entry_id)
    assert len(ours) == 1, "expected the object to fall back to its own device"
    assert ours[0].name == "Orphan"


async def test_the_area_of_a_linked_device_still_reaches_the_object(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """The reverse area sync used to find the object through the foreign
    device's `config_entries` — which only worked BECAUSE we wrongly sat there.
    Removing that association would have silently stopped area sync for exactly
    the objects a user attached by hand, so the lookup now follows the stored
    link instead."""
    from homeassistant.helpers import area_registry as ar

    device = _foreign_device(hass)
    obj_entry = _make_entry(hass, "areal", name="Washer Maintenance", extra_obj={"ha_device_id": device.id})
    await setup_integration(hass, global_entry, obj_entry)

    area = ar.async_get(hass).async_get_or_create("Laundry")
    dr.async_get(hass).async_update_device(device.id, area_id=area.id)
    await hass.async_block_till_done()

    obj = hass.config_entries.async_get_entry(obj_entry.entry_id).data[CONF_OBJECT]
    assert obj.get("area_id") == area.id, "moving the appliance did not move the object"


async def test_migrating_an_existing_install_drops_the_co_ownership(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """Entries written before this change have our config entry on the linked
    device. Left alone, HA 2026.8's upgrade splits that device and strands the
    entities on a nameless copy — so the migration removes the association
    before setup ever runs."""
    device = _foreign_device(hass)
    obj_entry = _make_entry(hass, "legacy", name="Washer Maintenance", extra_obj={"ha_device_id": device.id})

    # Recreate the pre-migration state: our entry co-owns the device.
    dr.async_get(hass).async_update_device(device.id, add_config_entry_id=obj_entry.entry_id)
    if obj_entry.entry_id not in dr.async_get(hass).async_get(device.id).config_entries:
        pytest.skip(
            "this Home Assistant refuses to co-own a device at all (2026.8+), so the "
            "legacy state this migration repairs cannot be constructed here — the "
            "migration only ever matters for entries written on 2026.7 or earlier"
        )

    await setup_integration(hass, global_entry, obj_entry)

    after = dr.async_get(hass).async_get(device.id)
    assert obj_entry.entry_id not in after.config_entries, "the stale co-ownership survived the migration"
    assert hass.config_entries.async_get_entry(obj_entry.entry_id).minor_version >= 5


async def test_an_unresolvable_link_is_kept_not_erased(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """Setup repoints a link the 2026.8 split moved, but must never CLEAR one.

    Clearing gains nothing — a missing device already falls back to an own
    device when the entities render — and it would destroy the user's choice
    permanently. The id can become meaningful again: a JSON export carries it
    to another instance where it dangles until the backup comes home, and a
    device returns when its integration is re-added or re-enabled.
    """
    obj_entry = _make_entry(hass, "dangling2", name="Orphan", extra_obj={"ha_device_id": "not-a-device"})
    await setup_integration(hass, global_entry, obj_entry)

    stored = hass.config_entries.async_get_entry(obj_entry.entry_id).data[CONF_OBJECT]
    assert stored.get("ha_device_id") == "not-a-device", "the stored link was erased"

    # …and the object still gets a device of its own, so nothing is homeless.
    ours = dr.async_entries_for_config_entry(dr.async_get(hass), obj_entry.entry_id)
    assert len(ours) == 1


async def test_a_lost_device_link_is_reported_as_a_repair(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """Falling back to an own device is quiet, and a link the user set on
    purpose is worth saying something about — otherwise the object drifts off
    the appliance's page and nobody finds out why."""
    from homeassistant.helpers import issue_registry as ir

    obj_entry = _make_entry(hass, "lostlink", name="Orphan", extra_obj={"ha_device_id": "gone-for-good"})
    await setup_integration(hass, global_entry, obj_entry)

    issue = ir.async_get(hass).async_get_issue(DOMAIN, f"device_link_lost_{obj_entry.entry_id}")
    assert issue is not None, "a lost device link went unreported"
    assert issue.translation_placeholders == {"object": "Orphan"}


async def test_a_working_device_link_reports_nothing(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    from homeassistant.helpers import issue_registry as ir

    device = _foreign_device(hass)
    obj_entry = _make_entry(hass, "goodlink", name="Washer", extra_obj={"ha_device_id": device.id})
    await setup_integration(hass, global_entry, obj_entry)

    assert ir.async_get(hass).async_get_issue(DOMAIN, f"device_link_lost_{obj_entry.entry_id}") is None


async def test_deleting_the_object_takes_its_repair_with_it(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """An issue about an object that no longer exists is just clutter."""
    from homeassistant.helpers import issue_registry as ir

    obj_entry = _make_entry(hass, "lostlink2", name="Orphan", extra_obj={"ha_device_id": "gone-for-good"})
    await setup_integration(hass, global_entry, obj_entry)
    issue_id = f"device_link_lost_{obj_entry.entry_id}"
    assert ir.async_get(hass).async_get_issue(DOMAIN, issue_id) is not None

    await hass.config_entries.async_remove(obj_entry.entry_id)
    await hass.async_block_till_done()

    assert ir.async_get(hass).async_get_issue(DOMAIN, issue_id) is None


async def test_entities_never_attach_through_a_dead_link(
    hass: HomeAssistant, global_entry: MockConfigEntry, monkeypatch
) -> None:
    """The entity constructor must route the stored id through the resolver.

    On HA 2026.8 a raw `async_get(stored_id)` still ANSWERS for a
    pre-migration composite id — it synthesises a read-only device carrying
    that dead id, the entity registry then refuses the link and asks the user
    to file a bug against us. The resolver returns a live id or None, never
    the synthetic. Simulated here by forcing the resolver to None: every
    entity must land on the object's own fallback device, none may go
    device-less, and the stored link must survive untouched.
    """
    from custom_components.maintenance_supporter.helpers import device_link

    calls: list[str] = []

    def _recording_resolver(_hass, device_id, *, own_entry_id):
        calls.append(device_id)
        return None

    monkeypatch.setattr(device_link, "resolve_linked_device_id", _recording_resolver)

    obj_entry = _make_entry(hass, "deadlink", name="Orphan", extra_obj={"ha_device_id": "old-composite"})
    await setup_integration(hass, global_entry, obj_entry)

    # On a registry without real composites, raw `async_get` and the resolver
    # happen to agree, so the outcome alone cannot tell them apart. The call
    # count can: setup resolves once, and every entity constructor must resolve
    # again — a constructor bypassing the resolver leaves exactly one call.
    assert len(calls) > 1, (
        f"the entity constructor did not route the stored id through the resolver "
        f"({len(calls)} call(s) recorded — expected setup + one per entity)"
    )

    own = dr.async_entries_for_config_entry(dr.async_get(hass), obj_entry.entry_id)
    assert len(own) == 1, "expected the fallback own device"
    ours = er.async_entries_for_config_entry(er.async_get(hass), obj_entry.entry_id)
    assert ours and all(e.device_id == own[0].id for e in ours), (
        "an entity attached through the dead link instead of the fallback"
    )
    stored = hass.config_entries.async_get_entry(obj_entry.entry_id).data[CONF_OBJECT]
    assert stored.get("ha_device_id") == "old-composite"


async def test_linking_a_previously_unlinked_object_removes_its_empty_device(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """The transition nobody had tested: an object lives unlinked (own device),
    then the user links it to an appliance. Its entities move to the
    appliance's device — and the old own device must not stay behind as an
    empty duplicate named after the object. The targeted shed only removes
    duplicates of the SOURCE, so this needs its own cleanup on both HA
    versions."""
    obj_entry = _make_entry(hass, "transition", name="Washer Maintenance")
    await setup_integration(hass, global_entry, obj_entry)

    own_before = dr.async_entries_for_config_entry(dr.async_get(hass), obj_entry.entry_id)
    assert len(own_before) == 1, "the unlinked object should own a device"

    device = _foreign_device(hass)
    data = dict(obj_entry.data)
    data[CONF_OBJECT] = {**data[CONF_OBJECT], "ha_device_id": device.id}
    hass.config_entries.async_update_entry(obj_entry, data=data)
    await hass.config_entries.async_reload(obj_entry.entry_id)
    await hass.async_block_till_done()

    ours = er.async_entries_for_config_entry(er.async_get(hass), obj_entry.entry_id)
    assert ours and all(e.device_id == device.id for e in ours), "entities did not move to the appliance"
    leftovers = dr.async_entries_for_config_entry(dr.async_get(hass), obj_entry.entry_id)
    assert leftovers == [], (
        f"empty leftover device(s) remain: {[d.name for d in leftovers]}"
    )
