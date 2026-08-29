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

import inspect
from typing import Any, cast

from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr


def _accepts_composite_kwarg(dev_reg: object) -> bool:
    """HA 2026.9+: ``async_get(id, include_composite_devices=False)``.

    Probe the KWARG, never a neighbouring symbol. v2.66.1 keyed this branch on
    ``async_get_device_by_identifier`` — which HA 2026.8 already has, while
    the kwarg only arrives in 2026.9 — and every config entry failed setup
    with a TypeError on the current stable core (#144). Neither the dev
    container (2026.7) nor the unpinned CI (2026.9 beta) ran 2026.8, so the
    CI now carries a stable-pinned matrix leg as well.
    """
    try:
        params = inspect.signature(dev_reg.async_get).parameters  # type: ignore[attr-defined]
    except (TypeError, ValueError, AttributeError):
        return False
    return "include_composite_devices" in params


def resolve_linked_device_id(
    hass: HomeAssistant, device_id: str, *, own_entry_id: str
) -> str | None:
    """Return the device id to attach to, or ``None`` if there is none left.

    * a live FOREIGN device id is returned unchanged — the ordinary case;
    * a live device that is OURS returns ``None``: the old picker offered the
      object's own doppelgänger (same name as the appliance) as a link target,
      and "linked to itself" is not a link (prod 2026-08: three Roborocks);
    * a pre-migration composite id resolves to the split we actually meant,
      namely the one owned by somebody else;
    * anything else (deleted device, unknown id) returns ``None``, which the
      caller treats as "not linked" and falls back to an own device.
    """
    dev_reg = dr.async_get(hass)

    # `async_get` must NOT be the plain test here. For a composite id HA
    # 2026.8+ synthesises a read-only device on the fly "so integration code
    # that resolves a device by id keeps working" — and that synthetic entry
    # carries the COMPOSITE id. Handing it to an entity is precisely what
    # makes the entity registry refuse the link. Three core generations,
    # three probes:
    if _accepts_composite_kwarg(dev_reg):
        # 2026.9+: async_is_composite_device_id is deprecated; the kwarg is the
        # replacement — a composite id resolves WITHOUT it but not WITH
        # include_composite_devices=False. Probed on the INSTANCE (version-stub
        # registries in tests exercise their own generation) and on the KWARG
        # itself — see _accepts_composite_kwarg for the #144 lesson.
        # cast(Any): the kwarg does not exist in older stubs, and this branch
        # only runs where it does.
        live = cast(Any, dev_reg).async_get(device_id, include_composite_devices=False)
        if live is not None:
            if _only_ours(live, own_entry_id):
                return None
            return device_id
        if dev_reg.async_get(device_id) is None:
            return None  # gone entirely — not a composite either
        # composite id → resolve to its splits below
    else:
        is_composite = getattr(dev_reg, "async_is_composite_device_id", None)
        if is_composite is None:
            # HA < 2026.8: no composites, so a live foreign device or nothing.
            device = dev_reg.async_get(device_id)
            if device is None or _only_ours(device, own_entry_id):
                return None
            return device_id

        state = is_composite(device_id)  # False = live device, True = composite, None = unknown
        if state is False:
            device = dev_reg.async_get(device_id)
            if device is not None and _only_ours(device, own_entry_id):
                return None
            return device_id
        if state is not True:
            return None

    # Fetched via getattr for the same reason as the check above: the method
    # does not exist on 2026.7, and a `type: ignore` for it would read as
    # unused on the version where it does.
    get_splits = getattr(dev_reg, "async_get_devices_for_composite_device_id", None)
    splits: list[dr.DeviceEntry] = list(get_splits(device_id) or []) if get_splits else []

    # Only splits that are not ours count. Ours exists solely because the older
    # code claimed part-ownership of somebody else's device; the appliance's
    # own split is the device the user actually picked.
    foreign = [device for device in splits if not _is_ours(device, own_entry_id)]

    # A device can have been shared by SEVERAL integrations (the Shelly that
    # also appeared in UniFi — the motivating example for the whole split), so
    # there may be more than one foreign split. Prefer the one that owned the
    # composite before the migration: each split records the former
    # `primary_config_entry` as `composite_primary_config_entry`, and the
    # primary is the integration that actually provides the appliance rather
    # than one that merely annotated it.
    for device in foreign:
        primary = getattr(device, "composite_primary_config_entry", None)
        if primary is not None and primary == getattr(device, "config_entry_id", None):
            return device.id
    if foreign:
        return foreign[0].id

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


def _only_ours(device: object, own_entry_id: str) -> bool:
    """Whether OUR entry is the device's sole owner — the self-link shape.

    The distinction matters: a legacy CO-OWNED appliance device (the appliance's
    integration + us, the pre-2.45 merge) is a real link that migration must
    still clean up; the doppelgänger the old picker offered is owned by our
    entry alone.

    Typed ``object``: HA 2026.9 introduces sub-devices, so registry lookups
    return ``DeviceEntry | ChildDeviceEntry`` — a union 2026.7 cannot even
    import. The body is getattr-based anyway (the 2026.8 spelling split),
    so any registry entry shape works.
    """
    owners = set(getattr(device, "config_entries", None) or ())
    if single := getattr(device, "config_entry_id", None):
        owners.add(single)
    return owners == {own_entry_id}


def is_maintenance_device(hass: HomeAssistant, device: object) -> bool:
    """Whether a device belongs to Maintenance Supporter (identifiers or owner).

    Typed ``object`` for the same reason as :func:`_only_ours` — HA 2026.9
    registry lookups return ``DeviceEntry | ChildDeviceEntry``.

    Our own devices always carry a ``(DOMAIN, …)`` identifier; the owning-entry
    check additionally catches forks that copied a foreign identity. Both the
    plural ``config_entries`` (classic) and the singular ``config_entry_id``
    (HA 2026.8) spellings are consulted. Used to keep such devices out of the
    device-link surfaces: linking an object to a maintenance device is never
    meaningful (object hierarchy has ``parent_entry_id``).
    """
    from ..const import DOMAIN

    if any(ident[0] == DOMAIN for ident in (getattr(device, "identifiers", None) or ())):
        return True
    owner_ids = list(getattr(device, "config_entries", None) or ())
    if single := getattr(device, "config_entry_id", None):
        owner_ids.append(single)
    return any(
        (ce := hass.config_entries.async_get_entry(ce_id)) is not None and ce.domain == DOMAIN
        for ce_id in owner_ids
    )


def is_self_link(hass: HomeAssistant, device_id: str, *, own_entry_id: str) -> bool:
    """Whether the stored id names a device our entry SOLELY owns (a self-link).

    Distinguishes "the linked device is gone" from "the link points at the
    object's own maintenance doppelgänger" so setup can tell the user which of
    the two actually happened — the repair advice differs. A CO-owned device
    (the legacy merge onto a live appliance) is deliberately NOT a self-link:
    that one migration must still clean up.
    """
    device = dr.async_get(hass).async_get(device_id)
    return device is not None and _only_ours(device, own_entry_id)


def sync_via_device_links(hass: HomeAssistant, entry: Any) -> None:
    """Write parent nesting as an explicit registry ``via_device_id``.

    DeviceInfo's ``via_device`` identifier tuple is deprecated (removal HA
    2027.8), and it resolves identifiers ACROSS config entries — the exact
    lookup the 2026.8 registry scoping ends. Setting the id directly after
    platform setup works identically on both versions.

    Both directions run so boot order doesn't matter: this entry's own device
    is pointed at its parent's, and any CHILD object naming this entry as
    parent is (re)pointed here — with the old identifier tuple, a child that
    registered before its parent simply stayed un-nested. A cleared
    ``parent_entry_id`` clears the pointer again. Only OWN devices are ever
    touched; a linked object owns none and is skipped.
    """
    from ..const import CONF_OBJECT, DOMAIN, GLOBAL_UNIQUE_ID

    dev_reg = dr.async_get(hass)

    def own_device(e: Any) -> dr.DeviceEntry | None:
        if e is None or e.domain != DOMAIN or not e.unique_id or e.unique_id == GLOBAL_UNIQUE_ID:
            return None
        # async_get_device is deprecated (removed HA 2027.8) — identifiers are
        # only unique per config entry since the 2026.8 device split. Prefer
        # the per-entry lookup where the core has it; the legacy call remains
        # the fallback for our minimum-supported cores (same shim pattern as
        # the helper_integration call below).
        modern = getattr(dev_reg, "async_get_device_by_identifier", None)
        if modern is not None:
            return modern((DOMAIN, e.unique_id), e.entry_id)  # type: ignore[no-any-return]
        return dev_reg.async_get_device(identifiers={(DOMAIN, e.unique_id)})

    def apply(child_entry: Any) -> None:
        child_dev = own_device(child_entry)
        if child_dev is None:
            return
        parent_id = (child_entry.data.get(CONF_OBJECT) or {}).get("parent_entry_id")
        parent_dev = own_device(hass.config_entries.async_get_entry(parent_id)) if parent_id else None
        target = parent_dev.id if parent_dev else None
        if child_dev.via_device_id != target:
            dev_reg.async_update_device(child_dev.id, via_device_id=target)

    apply(entry)
    for other in hass.config_entries.async_entries(DOMAIN):
        if other.entry_id != entry.entry_id and (other.data.get(CONF_OBJECT) or {}).get("parent_entry_id") == entry.entry_id:
            apply(other)


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

    Targeted mode only: without a source there is nothing to relink the
    entities to, and "drop every own device" is never what a caller wants here
    (an unlinked/unresolved object is actively USING its own device) — so a
    missing source is an explicit no-op on both HA versions.
    """
    if not source_device_id:
        return

    from homeassistant.helpers import helper_integration

    modern = getattr(helper_integration, "async_remove_helper_devices", None)
    if modern is not None:
        modern(hass, helper_config_entry_id=own_entry_id, source_device_id=source_device_id)
        return
    helper_integration.async_remove_helper_config_entry_from_source_device(
        hass, helper_config_entry_id=own_entry_id, source_device_id=source_device_id
    )


__all__ = [
    "has_own_devices",
    "is_maintenance_device",
    "is_self_link",
    "resolve_linked_device_id",
    "shed_owned_devices",
    "sync_via_device_links",
]
