"""Object-name uniqueness — one rule for every way an object is created.

An object's config-entry ``unique_id`` is the slug of its name *at creation*
and is never updated on a rename. Deriving the duplicate check from that id
(the old ``_abort_if_unique_id_configured`` rule) therefore went wrong both
ways (bug audit 2026-09-26):

* replacing an object under its own name — the panel pre-fills it — hit the
  predecessor's id and failed with ``already_configured``;
* after renaming "Washer" to "Dryer", a new "Washer" passed the name check of
  the setup form but was refused at the last step, losing the tasks just
  entered.

Names are compared by slug (what the entity ids are built from), against the
objects' CURRENT names; the unique id is then any free one.
"""

from __future__ import annotations

from homeassistant.core import HomeAssistant

from ..const import CONF_OBJECT, CONF_OBJECT_NAME, DOMAIN, GLOBAL_UNIQUE_ID, slugify_object_name

_UNIQUE_ID_PREFIX = "maintenance_supporter_"


def name_taken(hass: HomeAssistant, name: str, *, exclude_entry_id: str | None = None) -> bool:
    """Whether another object already carries ``name`` (compared by slug,
    so "Pool Pump" and "pool-pump" are the same name)."""
    slug = slugify_object_name(name)
    for entry in hass.config_entries.async_entries(DOMAIN):
        if entry.unique_id == GLOBAL_UNIQUE_ID or entry.entry_id == exclude_entry_id:
            continue
        current = str((entry.data.get(CONF_OBJECT) or {}).get(CONF_OBJECT_NAME) or "")
        if current and slugify_object_name(current) == slug:
            return True
    return False


def object_unique_id(hass: HomeAssistant, name: str, *, exclude_entry_id: str | None = None) -> str | None:
    """A free config-entry unique id for a new object named ``name``, or
    ``None`` when another object has that name. ``exclude_entry_id``: the
    object a replacement retires may share the name."""
    if name_taken(hass, name, exclude_entry_id=exclude_entry_id):
        return None
    taken = {entry.unique_id for entry in hass.config_entries.async_entries(DOMAIN)}
    base = f"{_UNIQUE_ID_PREFIX}{slugify_object_name(name)}"
    if base not in taken:
        return base
    n = 2
    while f"{base}_{n}" in taken:
        n += 1
    return f"{base}_{n}"
