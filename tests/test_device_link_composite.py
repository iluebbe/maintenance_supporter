"""Resolving a stored device link across HA 2026.8's device split.

An object stores the id of the device it is attached to. HA 2026.8 splits every
device that several config entries shared into one device per entry; the old id
survives only as a `composite_device_id` pointer and names no registered device.
Home Assistant then refuses to attach entities to it — and says so in a log line
that asks the user to file a bug against this integration.

The trap, and the reason these tests exist: `DeviceRegistry.async_get()` still
RETURNS something for a composite id. It synthesises a read-only device on the
fly "so integration code that resolves a device by id keeps working" — and that
synthetic entry carries the composite id, which is exactly the id the entity
registry rejects. Using `async_get` as the liveness test therefore looks correct
and silently does nothing, which is how the first attempt at this shipped past a
live upgrade run.

The dev container runs 2026.7, which has no composite ids at all, so the
composite branch is exercised against a stand-in registry rather than skipped.
"""

from __future__ import annotations

from typing import Any

from custom_components.maintenance_supporter.helpers.device_link import (
    resolve_linked_device_id,
)


class _Device:
    def __init__(self, device_id: str, entries: tuple[str, ...]) -> None:
        self.id = device_id
        self.config_entries = frozenset(entries)
        self.config_entry_id = entries[0] if entries else None


class _LegacyRegistry:
    """HA 2026.7: no composite ids, and neither of the two APIs exists.

    A separate class rather than a flag — deleting methods off an instance does
    not hide what the class defines, and `getattr` is exactly what the resolver
    uses to decide which Home Assistant it is talking to.
    """

    def __init__(self, live: dict[str, _Device]) -> None:
        self._live = live

    def async_get(self, device_id: str) -> _Device | None:
        return self._live.get(device_id)


class _Registry(_LegacyRegistry):
    """HA 2026.8: composite ids, plus the APIs that resolve them."""

    def __init__(self, live: dict[str, _Device], composites: dict[str, list[_Device]]) -> None:
        super().__init__(live)
        self._composites = composites

    def async_get(self, device_id: str) -> _Device | None:
        if device_id in self._live:
            return self._live[device_id]
        # The synthetic composite HA 2026.8 hands back — same id, not registered.
        if device_id in self._composites:
            return _Device(device_id, ())
        return None

    def async_is_composite_device_id(self, device_id: str) -> bool | None:
        if device_id in self._live:
            return False
        if device_id in self._composites:
            return True
        return None

    def async_get_devices_for_composite_device_id(self, device_id: str) -> list[_Device]:
        return self._composites.get(device_id, [])


def _patch(monkeypatch: Any, registry: _Registry) -> None:
    from custom_components.maintenance_supporter.helpers import device_link

    monkeypatch.setattr(device_link.dr, "async_get", lambda _hass: registry)


def test_a_live_device_id_is_returned_unchanged(monkeypatch) -> None:
    reg = _Registry({"dev1": _Device("dev1", ("foreign",))}, {})
    _patch(monkeypatch, reg)
    assert resolve_linked_device_id(None, "dev1", own_entry_id="ours") == "dev1"


def test_a_composite_id_resolves_to_the_appliances_split(monkeypatch) -> None:
    """The whole point: the stored id names nothing, and the device the user
    picked now lives under a new id."""
    reg = _Registry(
        live={"split_foreign": _Device("split_foreign", ("foreign",))},
        composites={"old": [_Device("split_ours", ("ours",)), _Device("split_foreign", ("foreign",))]},
    )
    _patch(monkeypatch, reg)
    assert resolve_linked_device_id(None, "old", own_entry_id="ours") == "split_foreign"


def test_async_get_alone_would_have_missed_it(monkeypatch) -> None:
    """Guard against the mistake this module was written for.

    `async_get` answers for a composite id, so a resolver that tests liveness
    with it returns the dead id unchanged and quietly changes nothing.
    """
    reg = _Registry(live={}, composites={"old": [_Device("split_foreign", ("foreign",))]})
    _patch(monkeypatch, reg)
    assert reg.async_get("old") is not None, "the stand-in must mimic HA's synthetic composite"
    assert resolve_linked_device_id(None, "old", own_entry_id="ours") == "split_foreign"


def test_a_composite_with_only_our_own_split_drops_the_link(monkeypatch) -> None:
    """Our split exists only because the old code claimed part-ownership. If
    the appliance's integration is gone, attaching to that leftover would
    pretend a link that no longer means anything."""
    reg = _Registry(live={}, composites={"old": [_Device("split_ours", ("ours",))]})
    _patch(monkeypatch, reg)
    assert resolve_linked_device_id(None, "old", own_entry_id="ours") is None


def test_an_unknown_id_drops_the_link(monkeypatch) -> None:
    reg = _Registry(live={}, composites={})
    _patch(monkeypatch, reg)
    assert resolve_linked_device_id(None, "gone", own_entry_id="ours") is None


def test_older_home_assistant_has_no_composites(monkeypatch) -> None:
    """On 2026.7 the two APIs do not exist; a live device resolves, anything
    else is simply gone."""
    reg = _LegacyRegistry({"dev1": _Device("dev1", ("foreign",))})
    _patch(monkeypatch, reg)
    assert not hasattr(reg, "async_is_composite_device_id")
    assert resolve_linked_device_id(None, "dev1", own_entry_id="ours") == "dev1"
    assert resolve_linked_device_id(None, "gone", own_entry_id="ours") is None
