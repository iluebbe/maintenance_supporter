"""Keep a stored ``ha_device_id`` pointing at a device that still exists.

An object can be attached to a device owned by another integration. The chosen
device's id is stored in ``obj["ha_device_id"]`` and handed to the entity's
``device_entry``.

Home Assistant 2026.8 scopes device identifiers per config entry and, on
upgrade, **splits** any device that several config entries shared into one
device per entry. The original id survives only as a `composite_device_id`
pointer — it no longer names a registered device. A stored link written before
that upgrade therefore goes stale, and Home Assistant refuses to attach
anything to it:

    Ignoring request to link entity from integration maintenance_supporter to
    device …: the device id refers to a composite device which was split into
    one device per config entry, please create a bug report

Which is a fair complaint: the id we handed over is nobody's device.

Home Assistant offers the way back — `async_is_composite_device_id` and
`async_get_devices_for_composite_device_id` — so the stored id can be pointed
at the surviving device instead. That is the appliance's split, the one NOT
owned by us: our own split exists only because the old code claimed
part-ownership, and holds nothing worth keeping.

Both APIs arrived in 2026.8, so they are looked up defensively — on 2026.7
there are no composite ids and nothing to resolve.
"""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr


def resolve_linked_device_id(
    hass: HomeAssistant, device_id: str, *, own_entry_id: str
) -> str | None:
    """Return the device id to attach to, or ``None`` if there is none left.

    * a live device id is returned unchanged — the ordinary case;
    * a pre-migration composite id resolves to the split we actually meant,
      namely the one owned by somebody else;
    * anything else (deleted device, unknown id) returns ``None``, which the
      caller treats as "not linked" and falls back to an own device.
    """
    dev_reg = dr.async_get(hass)

    # `async_get` must NOT be the test here. For a composite id HA 2026.8
    # synthesises a read-only device on the fly "so integration code that
    # resolves a device by id keeps working" — and that synthetic entry carries
    # the COMPOSITE id. Handing it to an entity is precisely what makes the
    # entity registry refuse the link. Ask whether the id is composite first.
    is_composite = getattr(dev_reg, "async_is_composite_device_id", None)
    if is_composite is None:
        # HA < 2026.8: no composites, so a live device or nothing.
        return device_id if dev_reg.async_get(device_id) is not None else None

    state = is_composite(device_id)  # False = live device, True = composite, None = unknown
    if state is False:
        return device_id
    if state is not True:
        return None

    # Fetched via getattr for the same reason as the check above: the method
    # does not exist on 2026.7, and a `type: ignore` for it would read as
    # unused on the version where it does.
    get_splits = getattr(dev_reg, "async_get_devices_for_composite_device_id", None)
    splits: list[dr.DeviceEntry] = list(get_splits(device_id) or []) if get_splits else []

    # Prefer a split that is not ours. Ours only exists because the older code
    # claimed part-ownership of somebody else's device; the appliance's own
    # split is the device the user actually picked.
    for device in splits:
        if not _is_ours(device, own_entry_id):
            return device.id

    # Only our own split survived — the appliance's integration is gone. Better
    # to report no link than to attach to a leftover of our own making.
    return None


def _is_ours(device: dr.DeviceEntry, own_entry_id: str) -> bool:
    """Whether this device belongs to our config entry.

    2026.8 introduces the singular `config_entry_id` while keeping the plural
    `config_entries` for compatibility; check both rather than betting on which
    one a given version exposes.
    """
    if own_entry_id in (getattr(device, "config_entries", None) or ()):
        return True
    return bool(getattr(device, "config_entry_id", None) == own_entry_id)


def has_own_devices(hass: HomeAssistant, own_entry_id: str) -> bool:
    """Whether our config entry owns any device. A linked object owns none."""
    return bool(dr.async_entries_for_config_entry(dr.async_get(hass), own_entry_id))


def shed_owned_devices(hass: HomeAssistant, *, own_entry_id: str, source_device_id: str | None) -> None:
    """Give up devices a linked object should never have owned.

    Home Assistant ships the repair for exactly this situation, and it does
    more than removing a device would: it drops the helper's duplicate devices
    **and relinks its entities** to the source device, handling both shapes the
    old behaviour could leave behind — a split of a formerly co-owned device,
    and a fork that copied the source's identity.

    `async_remove_helper_devices` arrived in 2026.8; on 2026.7 the older,
    narrower `async_remove_helper_config_entry_from_source_device` is the one
    that exists, and it is not deprecated there. Preferring the newer function
    where it exists is also what stops Home Assistant logging a deprecation
    notice that asks the user to file a bug against us.
    """
    from homeassistant.helpers import helper_integration

    modern = getattr(helper_integration, "async_remove_helper_devices", None)
    if modern is not None:
        modern(hass, helper_config_entry_id=own_entry_id, source_device_id=source_device_id)
        return
    if source_device_id:
        helper_integration.async_remove_helper_config_entry_from_source_device(
            hass, helper_config_entry_id=own_entry_id, source_device_id=source_device_id
        )


__all__ = ["has_own_devices", "resolve_linked_device_id", "shed_owned_devices"]
