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
