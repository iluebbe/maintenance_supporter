"""Areas an object's device created by mistake before 2.96 — and the way out.

An object's own device was created with the object's AREA ID as
``suggested_area``, which Home Assistant resolves by NAME: an object in
"Living Room" (id ``living_room``) made Home Assistant create a second area
called "living_room" and put the object's device there, while the object kept
the right area (bug audit 2026-09-29; one-word areas like "Kitchen" were not
affected — their id and name agree). The cause is fixed in
``entity/entity_base.py``; this moves our devices back and offers to remove the
empty areas that were left over (a repair issue — deleting an area is the
user's call).
"""

from __future__ import annotations

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers import issue_registry as ir

from ..const import CONF_OBJECT, DOMAIN
from .aggregate import get_object_entries

LEFTOVER_AREAS_ISSUE_ID = "leftover_areas"


@callback
def _mistaken_areas(hass: HomeAssistant) -> dict[str, str]:
    """Area id → the id of the real area its name spells. Area names are
    unique, so an area NAMED exactly like another area's id (and not like its
    own) is the signature of the mistake."""
    areas = ar.async_get(hass).async_list_areas()
    ids = {area.id for area in areas}
    return {area.id: area.name for area in areas if area.name in ids and area.name != area.id}


@callback
def async_rehome_devices(hass: HomeAssistant) -> int:
    """Move our objects' own devices out of a mistaken area into the real
    area its name spells. The object may name either: the real one (as set
    up), or the mistaken one — the device→object area sync adopts the
    device's area as the user's choice once anything touched the device.
    Both end in the real area. Returns how many devices moved."""
    mistaken = _mistaken_areas(hass)
    if not mistaken:
        return 0
    dev_reg = dr.async_get(hass)
    moved = 0
    for entry in get_object_entries(hass):
        obj = entry.data.get(CONF_OBJECT) or {}
        if obj.get("ha_device_id"):
            continue  # another integration's device: not ours to move
        for device in dr.async_entries_for_config_entry(dev_reg, entry.entry_id):
            real = mistaken.get(device.area_id or "")
            if real is None or obj.get("area_id") not in (real, device.area_id):
                continue
            dev_reg.async_update_device(device.id, area_id=real)
            moved += 1
            current = hass.config_entries.async_get_entry(entry.entry_id)
            if current is not None and (current.data.get(CONF_OBJECT) or {}).get("area_id") != real:
                hass.config_entries.async_update_entry(
                    current, data={**current.data, CONF_OBJECT: {**current.data[CONF_OBJECT], "area_id": real}}
                )
    return moved


@callback
def async_leftover_areas(hass: HomeAssistant) -> list[ar.AreaEntry]:
    """The mistaken areas nothing is in any more."""
    dev_reg = dr.async_get(hass)
    ent_reg = er.async_get(hass)
    area_reg = ar.async_get(hass)
    out: list[ar.AreaEntry] = []
    for area_id in _mistaken_areas(hass):
        if dr.async_entries_for_area(dev_reg, area_id) or er.async_entries_for_area(ent_reg, area_id):
            continue
        if (area := area_reg.async_get_area(area_id)) is not None:
            out.append(area)
    return sorted(out, key=lambda area: area.name)


async def async_check_leftover_areas(hass: HomeAssistant) -> None:
    """At start: bring our devices home, then raise (or clear) the repair
    issue that offers to remove the empty leftovers."""
    async_rehome_devices(hass)
    leftovers = async_leftover_areas(hass)
    if leftovers:
        ir.async_create_issue(
            hass,
            DOMAIN,
            LEFTOVER_AREAS_ISSUE_ID,
            is_fixable=True,
            severity=ir.IssueSeverity.WARNING,
            translation_key=LEFTOVER_AREAS_ISSUE_ID,
            translation_placeholders={"areas": ", ".join(area.name for area in leftovers)},
        )
    else:
        ir.async_delete_issue(hass, DOMAIN, LEFTOVER_AREAS_ISSUE_ID)
