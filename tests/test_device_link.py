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


async def test_the_production_update_path_keeps_a_live_link(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """The exact path a production install takes when updating from <=2.44:
    a linked object that CO-OWNS a live appliance device (the old merge),
    minor_version 4, then the new code runs — twice, because the first boot
    migrates and the second is an ordinary restart.

    Contract: the link survives, the entities stay on the appliance's device,
    no repair issue is raised, and the appliance's device is never removed.
    """
    from homeassistant.helpers import issue_registry as ir

    device = _foreign_device(hass)
    obj_entry = _make_entry(
        hass, "prodpath", name="Roborock Maintenance", extra_obj={"ha_device_id": device.id}
    )
    # Pre-update reality: the old code merged us onto the appliance's device.
    dr.async_get(hass).async_update_device(device.id, add_config_entry_id=obj_entry.entry_id)
    if obj_entry.entry_id not in dr.async_get(hass).async_get(device.id).config_entries:
        pytest.skip("this HA cannot stage the legacy co-owned state (2026.8+)")

    await setup_integration(hass, global_entry, obj_entry)

    for round_no in (1, 2):
        after = dr.async_get(hass).async_get(device.id)
        assert after is not None, f"round {round_no}: the appliance's device was removed"
        assert obj_entry.entry_id not in after.config_entries, f"round {round_no}: co-ownership survived"
        stored = hass.config_entries.async_get_entry(obj_entry.entry_id).data[CONF_OBJECT]
        assert stored.get("ha_device_id") == device.id, f"round {round_no}: the stored link changed"
        ours = [
            e for e in er.async_entries_for_config_entry(er.async_get(hass), obj_entry.entry_id)
            if e.domain == "sensor"
        ]
        assert ours and all(e.device_id == device.id for e in ours), (
            f"round {round_no}: entities left the appliance's device"
        )
        issue = ir.async_get(hass).async_get_issue(DOMAIN, f"device_link_lost_{obj_entry.entry_id}")
        assert issue is None, f"round {round_no}: a repair issue fired for a LIVE device"
        assert hass.config_entries.async_get_entry(obj_entry.entry_id).minor_version >= 5

        if round_no == 1:
            await hass.config_entries.async_reload(obj_entry.entry_id)
            await hass.async_block_till_done()


# ─── self-links: the doppelgänger trap (prod 2026-08) ──────────────────────
#
# The old picker offered the object's OWN device — which carries the
# appliance's exact name — as a link target, and three production objects
# spent months "linked" to themselves. Every layer now handles it: the WS
# write path rejects it, the resolver treats it as unlinked, setup raises a
# distinct notice, and the migration must not shed the very device the
# entities live on.


async def test_resolver_treats_an_own_device_as_no_link(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    from custom_components.maintenance_supporter.helpers.device_link import (
        resolve_linked_device_id,
    )

    obj_entry = _make_entry(hass, "resself", name="Vacuum")
    await setup_integration(hass, global_entry, obj_entry)
    own = dr.async_entries_for_config_entry(dr.async_get(hass), obj_entry.entry_id)[0]

    assert resolve_linked_device_id(hass, own.id, own_entry_id=obj_entry.entry_id) is None
    # A foreign device still resolves.
    foreign = _foreign_device(hass)
    assert resolve_linked_device_id(hass, foreign.id, own_entry_id=obj_entry.entry_id) == foreign.id


async def test_validate_rejects_maintenance_devices_as_link_targets(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """Both the object's own device and a SIBLING object's device are refused —
    for hierarchy there is parent_entry_id. A foreign device still passes."""
    a = _make_entry(hass, "valself_a", name="A")
    b = _make_entry(hass, "valself_b", name="B")
    await setup_integration(hass, global_entry, a, b)

    own_a = dr.async_entries_for_config_entry(dr.async_get(hass), a.entry_id)[0]
    own_b = dr.async_entries_for_config_entry(dr.async_get(hass), b.entry_id)[0]

    conn = _FakeConnection()
    assert not _validate_device_link(hass, conn, {"id": 1, "ha_device_id": own_a.id}, self_entry_id=a.entry_id)
    assert conn.errors[-1][0] == "self_link_device"
    assert not _validate_device_link(hass, conn, {"id": 2, "ha_device_id": own_b.id}, self_entry_id=a.entry_id)
    assert conn.errors[-1][0] == "self_link_device"
    assert _validate_device_link(
        hass, conn, {"id": 3, "ha_device_id": _foreign_device(hass).id}, self_entry_id=a.entry_id
    )


async def test_a_self_link_raises_its_own_notice_and_keeps_the_device(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """An object whose stored link names its OWN device: setup must raise the
    device_link_self notice (fixable), keep the entities on that device, and
    neither delete nor duplicate it — the prod update did the delete/restore
    dance exactly here."""
    from homeassistant.helpers import issue_registry as ir

    obj_entry = _make_entry(hass, "selflink", name="Robot Vacuum")
    await setup_integration(hass, global_entry, obj_entry)
    own = dr.async_entries_for_config_entry(dr.async_get(hass), obj_entry.entry_id)[0]

    data = dict(obj_entry.data)
    data[CONF_OBJECT] = {**data[CONF_OBJECT], "ha_device_id": own.id}
    hass.config_entries.async_update_entry(obj_entry, data=data)
    await hass.config_entries.async_reload(obj_entry.entry_id)
    await hass.async_block_till_done()

    issue = ir.async_get(hass).async_get_issue(DOMAIN, f"device_link_lost_{obj_entry.entry_id}")
    assert issue is not None, "no notice for a self-link"
    assert issue.translation_key == "device_link_self"
    assert issue.is_fixable

    owned = dr.async_entries_for_config_entry(dr.async_get(hass), obj_entry.entry_id)
    assert [d.id for d in owned] == [own.id], "the own device was removed or duplicated"
    ours = er.async_entries_for_config_entry(er.async_get(hass), obj_entry.entry_id)
    assert ours and all(e.device_id == own.id for e in ours)

    # The stored (nonsensical) link is left alone — the fix flow, not setup,
    # is the place that rewrites it.
    stored = hass.config_entries.async_get_entry(obj_entry.entry_id).data[CONF_OBJECT]
    assert stored.get("ha_device_id") == own.id


async def test_migrating_a_self_linked_install_does_not_shed_its_device(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """The prod 2026-08-01 path: minor_version < 5 with a stored SELF-link.
    The 4→5 shed must skip it — its 'source' is the very device the entities
    live on, and shedding deleted + restored it in one boot."""
    from homeassistant.helpers import issue_registry as ir

    obj_entry = _make_entry(hass, "migself", name="Roborock EG")
    # Stage the pre-update reality: the own device exists and the stored link
    # points at it (written by the old picker months ago).
    own = dr.async_get(hass).async_get_or_create(
        config_entry_id=obj_entry.entry_id,
        identifiers={(DOMAIN, obj_entry.unique_id or "")},
        name="Roborock EG",
    )
    data = dict(obj_entry.data)
    data[CONF_OBJECT] = {**data[CONF_OBJECT], "ha_device_id": own.id}
    hass.config_entries.async_update_entry(obj_entry, data=data)

    await setup_integration(hass, global_entry, obj_entry)

    assert hass.config_entries.async_get_entry(obj_entry.entry_id).minor_version >= 5
    refreshed = dr.async_get(hass).async_get(own.id)
    assert refreshed is not None, "the migration shed the object's own device"
    issue = ir.async_get(hass).async_get_issue(DOMAIN, f"device_link_lost_{obj_entry.entry_id}")
    assert issue is not None and issue.translation_key == "device_link_self"
    ours = er.async_entries_for_config_entry(er.async_get(hass), obj_entry.entry_id)
    assert ours and all(e.device_id == own.id for e in ours)


# ─── the fixable repair flow ────────────────────────────────────────────────


def _link_flow(hass: HomeAssistant, entry_id: str) -> Any:
    from custom_components.maintenance_supporter.repairs import DeviceLinkRepairFlow

    flow = DeviceLinkRepairFlow()
    flow.hass = hass
    flow.data = {"entry_id": entry_id}
    return flow


async def test_link_repair_menu_and_best_match_suggestion(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """The menu names the object and suggests the best foreign name match —
    NEVER one of our own devices, however well their names match."""
    foreign = _foreign_device(hass)  # "Washing Machine" / Miele
    obj_entry = _make_entry(
        hass, "flowmenu", name="Washing Machine", extra_obj={"ha_device_id": "no_such_device"}
    )
    await setup_integration(hass, global_entry, obj_entry)

    flow = _link_flow(hass, obj_entry.entry_id)
    result = await flow.async_step_init()
    assert result["type"] == "menu"
    assert set(result["menu_options"]) == {"relink", "unlink"}
    placeholders = result["description_placeholders"]
    assert placeholders["object"] == "Washing Machine"
    assert placeholders["suggestion"] == "Washing Machine"

    form = await flow.async_step_relink()
    assert form["type"] == "form"
    # The best match is pre-selected in the device picker.
    schema_keys = {str(key): key for key in form["data_schema"].schema}
    assert schema_keys["device"].default() == foreign.id


async def test_link_repair_relink_rewrites_the_link_and_reloads(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    foreign = _foreign_device(hass)
    obj_entry = _make_entry(
        hass, "flowrelink", name="Orphan", extra_obj={"ha_device_id": "no_such_device"}
    )
    await setup_integration(hass, global_entry, obj_entry)

    flow = _link_flow(hass, obj_entry.entry_id)
    result = await flow.async_step_relink({"device": foreign.id})
    assert result["type"] == "create_entry"
    await hass.async_block_till_done()

    stored = hass.config_entries.async_get_entry(obj_entry.entry_id).data[CONF_OBJECT]
    assert stored.get("ha_device_id") == foreign.id
    ours = er.async_entries_for_config_entry(er.async_get(hass), obj_entry.entry_id)
    assert ours and all(e.device_id == foreign.id for e in ours), "reload did not re-attach"


async def test_link_repair_relink_refuses_our_own_devices(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """The flow applies the same guard as the WS write path — picking the
    doppelgänger inside the REPAIR for picking the doppelgänger would be
    a bitter loop."""
    obj_entry = _make_entry(
        hass, "flowguard", name="Guarded", extra_obj={"ha_device_id": "no_such_device"}
    )
    await setup_integration(hass, global_entry, obj_entry)
    own = dr.async_entries_for_config_entry(dr.async_get(hass), obj_entry.entry_id)[0]

    flow = _link_flow(hass, obj_entry.entry_id)
    result = await flow.async_step_relink({"device": own.id})
    assert result["type"] == "form"
    assert result["errors"] == {"device": "self_link"}

    result = await flow.async_step_relink({"device": "gone_entirely"})
    assert result["type"] == "form"
    assert result["errors"] == {"device": "device_gone"}


async def test_link_repair_unlink_clears_the_link(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    obj_entry = _make_entry(
        hass, "flowunlink", name="Standalone", extra_obj={"ha_device_id": "no_such_device"}
    )
    await setup_integration(hass, global_entry, obj_entry)

    flow = _link_flow(hass, obj_entry.entry_id)
    confirm = await flow.async_step_unlink()
    assert confirm["type"] == "form"
    result = await flow.async_step_unlink({})
    assert result["type"] == "create_entry"
    await hass.async_block_till_done()

    stored = hass.config_entries.async_get_entry(obj_entry.entry_id).data[CONF_OBJECT]
    assert stored.get("ha_device_id") is None
    # Unlinked objects live on an own device.
    own = dr.async_entries_for_config_entry(dr.async_get(hass), obj_entry.entry_id)
    assert len(own) == 1


async def test_link_repair_aborts_when_the_object_is_gone(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    flow = _link_flow(hass, "does_not_exist")
    result = await flow.async_step_init()
    assert result["type"] == "abort"
    assert result["reason"] == "entry_gone"


async def test_fix_flow_dispatch_routes_device_link_issues(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    from custom_components.maintenance_supporter.repairs import (
        DeviceLinkRepairFlow,
        async_create_fix_flow,
    )

    flow = await async_create_fix_flow(hass, "device_link_lost_abc123", {"entry_id": "abc123"})
    assert isinstance(flow, DeviceLinkRepairFlow)


# ─── parent nesting via explicit via_device_id (2027.8 deprecation) ─────────


async def test_nesting_survives_child_before_parent_boot_order(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """With DeviceInfo's identifier tuple, a child registering BEFORE its
    parent stayed un-nested. The explicit registry write runs both directions,
    so the parent's setup re-points its already-booted children."""
    parent_entry = _make_entry(hass, "order_parent", name="Water Heater")
    child_entry = _make_entry(
        hass, "order_child", name="Anode Rod", extra_obj={"parent_entry_id": parent_entry.entry_id}
    )
    # Child FIRST, parent second.
    await setup_integration(hass, global_entry, child_entry, parent_entry)

    reg = dr.async_get(hass)
    parent_dev = reg.async_get_device(identifiers={(DOMAIN, parent_entry.unique_id or "")})
    child_dev = reg.async_get_device(identifiers={(DOMAIN, child_entry.unique_id or "")})
    assert parent_dev is not None and child_dev is not None
    assert child_dev.via_device_id == parent_dev.id


async def test_clearing_the_parent_clears_the_nesting(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    parent_entry = _make_entry(hass, "unnest_parent", name="Water Heater")
    child_entry = _make_entry(
        hass, "unnest_child", name="Anode Rod", extra_obj={"parent_entry_id": parent_entry.entry_id}
    )
    await setup_integration(hass, global_entry, parent_entry, child_entry)
    reg = dr.async_get(hass)
    child_dev = reg.async_get_device(identifiers={(DOMAIN, child_entry.unique_id or "")})
    assert child_dev is not None and child_dev.via_device_id is not None

    data = dict(child_entry.data)
    data[CONF_OBJECT] = {**data[CONF_OBJECT], "parent_entry_id": None}
    hass.config_entries.async_update_entry(child_entry, data=data)
    await hass.config_entries.async_reload(child_entry.entry_id)
    await hass.async_block_till_done()

    refreshed = reg.async_get_device(identifiers={(DOMAIN, child_entry.unique_id or "")})
    assert refreshed is not None
    assert refreshed.via_device_id is None, "the stale nesting pointer survived un-nesting"


async def test_via_sync_prefers_per_entry_device_lookup_when_available(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """HA 2027.8 removes DeviceRegistry.async_get_device — sync_via_device_links
    must use async_get_device_by_identifier((domain, id), entry_id) on cores
    that have it. Our reference core doesn't yet, so the modern path is pinned
    through a stub; the legacy fallback is what every other test exercises."""
    from custom_components.maintenance_supporter.helpers.device_link import sync_via_device_links

    parent_entry = _make_entry(hass, "parent2", name="Boiler")
    child_entry = _make_entry(
        hass, "child2", name="Sensor", extra_obj={"parent_entry_id": parent_entry.entry_id}
    )
    await setup_integration(hass, global_entry, parent_entry, child_entry)

    reg = dr.async_get(hass)
    calls: list[tuple[tuple[str, str], str]] = []

    def modern(identifier: tuple[str, str], config_entry_id: str) -> Any:
        calls.append((identifier, config_entry_id))
        return reg.async_get_device(identifiers={identifier})

    reg.async_get_device_by_identifier = modern  # type: ignore[attr-defined]
    try:
        sync_via_device_links(hass, child_entry)
    finally:
        delattr(reg, "async_get_device_by_identifier")

    assert calls, "modern lookup not used although available"
    assert all(cfg in (parent_entry.entry_id, child_entry.entry_id) for _, cfg in calls)
    assert any(ident == (DOMAIN, child_entry.unique_id) for ident, _ in calls)
